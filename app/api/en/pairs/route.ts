// app/api/en/pairs/route.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

// Domenii permise (extinde dacă vrei)
const ALLOWED = new Set([
  'subiecte.edu.ro',
  'edu.ro',
  'www.edu.ro',
  'heiprofu.ro',
  'www.heiprofu.ro',
  'e3.ro',
  'www.e3.ro',
]);

type Subject = 'romana' | 'matematica' | 'mixt';
type Difficulty = 'usor' | 'mediu' | 'dificil';

type Pair = {
  id: string;
  title: string;
  subject: Subject;
  year: number | null;
  durationMin: number;
  difficulty: Difficulty;
  subiectUrl: string | null;
  baremUrl: string | null;
  source: string;
  tags: string[];
};

type CrawlOpts = {
  protocol: 'https:' | 'http:';
  domain: string;
  startPath: string;
  depth: number;    // 0..2 recomandat
  maxPages: number; // limită anti-abuz
};

function absUrl(protocol: string, domain: string, href: string) {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  const p = href.startsWith('/') ? href : `/${href}`;
  return `${protocol}//${domain}${p}`;
}

function sameDomain(url: string, domain: string) {
  try {
    const u = new URL(url, `https://${domain}`);
    return u.hostname === domain || u.hostname.endsWith(`.${domain}`);
  } catch { return false; }
}

function isPdf(href: string) {
  return href.toLowerCase().includes('.pdf');
}

// Transformă link Google Drive /file/d/<id>/view în link direct download
function driveToPdf(href: string) {
  try {
    const m = href.match(/\/file\/d\/([^/]+)/);
    if (m?.[1]) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  } catch {}
  return null;
}

function rmDiacritics(s: string) {
try {
return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
} catch {
return s;
}
}

function normKey(s: string) {
const x = rmDiacritics(s.toLowerCase());
return x
.replace(/.(pdf|docx?|html?)$/g, '')
.replace(/(subiect|barem|model|simulare|varianta|bar[eă]m|set|examen|evaluare|nationala|națională|clasa|a[- ]?8[- ]?a|en)\b/gi, '')
.replace(/[^a-z0-9]+/g, '')
.slice(0, 80);
}

function guessYear(s: string): number | null {
  const m = s.match(/20(1\d|2\d)/);
  return m ? Number(m[0]) : null;
}

function guessSubject(s: string): Subject {
  const t = s.toLowerCase();
  if (/(rom|rom[aâ]n)/.test(t)) return 'romana';
  if (/(mat|matematic)/.test(t)) return 'matematica';
  return 'mixt';
}

async function crawl({ protocol, domain, startPath, depth, maxPages }: CrawlOpts) {
  const visited = new Set<string>();
  const queue: { url: string; d: number }[] = [];
  const startUrl = absUrl(protocol, domain, startPath || '/');
  queue.push({ url: startUrl, d: 0 });
  visited.add(startUrl);

  // colectăm toate linkurile și încercăm pairing
  type LinkInfo = { url: string; text: string; norm: string; isSubiect: boolean; isBarem: boolean; ctxKey: string; idx: number; parentKey: string; };
  const links: LinkInfo[] = [];
  let pages = 0;

  while (queue.length && pages < maxPages) {
    const { url, d } = queue.shift()!;
    pages++;
    let html = '';
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
      if (!res.ok) continue;
      html = await res.text();
    } catch { continue; }

    const $ = cheerio.load(html);
    const pageKey = url.replace(/^https?:\/\//, '');

    // extrage anchor-uri
    $('a[href]').each((i, el) => {
      let href = String($(el).attr('href') || '').trim();
      if (!href) return;
      let abs = absUrl(protocol, domain, href);
      // PDF direct sau Drive
      let pdfUrl: string | null = null;
      if (isPdf(abs)) pdfUrl = abs;
      else if (abs.includes('drive.google.com')) {
        const gd = driveToPdf(abs);
        if (gd) pdfUrl = gd;
      }
      if (!pdfUrl) return;

      // păstrează doar PDF în același domeniu sau drive
      if (!sameDomain(abs, domain) && !abs.includes('drive.google.com')) return;

      const text = ($(el).text() || href).trim();
      const mix = (text + ' ' + href).toLowerCase();

      const isBarem = /(barem|bar[eă]m)\b/.test(mix);
      const isSubiect = /(subiect|subiecte|varianta|model|simulare|test)\b/.test(mix) || !isBarem; // default subiect dacă nu e clar

      const norm = normKey((text || href) + ' ' + url);
      const parentKey = normKey($(el).closest('li,div,section,article,tr,td').text() || '');
      links.push({ url: pdfUrl, text, norm, isSubiect, isBarem, ctxKey: pageKey, idx: links.length, parentKey });
    });

    // extinde crawl moderat
    if (d < depth) {
      const children: string[] = [];
      $('a[href]').each((_, el) => {
        const href = String($(el).attr('href') || '').trim();
        if (!href) return;
        const abs = absUrl(protocol, domain, href);
        if (!sameDomain(abs, domain)) return;
        if (abs.endsWith('.pdf')) return;
        if (abs.includes('#')) return;
        children.push(abs);
      });
      for (const l of children) {
        if (!visited.has(l)) {
          visited.add(l);
          queue.push({ url: l, d: d + 1 });
        }
      }
    }
  }

  // pairing: grupăm după "norm" și proximitate DOM
  const pairs: Pair[] = [];

  // întâi pairing după parentKey (subiect & barem în același bloc)
  const byParent = new Map<string, LinkInfo[]>();
  links.forEach(li => {
    const k = li.ctxKey + '::' + li.parentKey;
    const arr = byParent.get(k) || [];
    arr.push(li); byParent.set(k, arr);
  });
  const used = new Set<string>();

  for (const [k, arr] of Array.from(byParent.entries())) {
    const subs = arr.filter((a: LinkInfo) => a.isSubiect);
    const bares = arr.filter((a: LinkInfo) => a.isBarem);
    if (subs.length && bares.length) {
      // formează perechi 1-1 după distanță index
      const takenB = new Set<number>();
      for (const s of subs) {
        let best: LinkInfo | null = null;
        let bestDist = Infinity;
        let bestIdx = -1;
        for (let i = 0; i < bares.length; i++) {
          if (takenB.has(i)) continue;
          const b = bares[i];
          const dist = Math.abs(s.idx - b.idx);
          if (dist < bestDist) { bestDist = dist; best = b; bestIdx = i; }
        }
        if (best) {
          takenB.add(bestIdx);
          used.add(s.url); used.add(best.url);
          const title = s.text.length >= best.text.length ? s.text : best.text;
          pairs.push({
            id: s.url + '|' + best.url,
            title: title || 'Model',
            subject: guessSubject(s.text + ' ' + best.text),
            year: guessYear(s.url) ?? guessYear(best.url) ?? guessYear(title) ?? null,
            durationMin: 120,
            difficulty: 'mediu',
            subiectUrl: s.url,
            baremUrl: best.url,
            source: new URL('https://' + s.ctxKey).hostname,
            tags: [],
          });
        }
      }
    }
  }

  // apoi pairing pe bază de normKey (fallback)
  const subsLeft = links.filter(a => a.isSubiect && !used.has(a.url));
  const baresLeft = links.filter(a => a.isBarem && !used.has(a.url));

  const byNormB = new Map<string, LinkInfo[]>();
  baresLeft.forEach(b => {
    const arr = byNormB.get(b.norm) || [];
    arr.push(b); byNormB.set(b.norm, arr);
  });

  for (const s of subsLeft) {
    let cand = byNormB.get(s.norm);
    if (!cand || cand.length === 0) {
      // caută un barem cu același an
      const y = guessYear(s.url) ?? guessYear(s.text) ?? null;
      if (y) cand = baresLeft.filter(b => (guessYear(b.url) ?? guessYear(b.text) ?? null) === y);
    }
    const b = cand?.[0];
    if (b) {
      used.add(s.url); used.add(b.url);
      pairs.push({
        id: s.url + '|' + b.url,
        title: s.text.length >= b.text.length ? s.text : b.text,
        subject: guessSubject(s.text + ' ' + b.text),
        year: guessYear(s.url) ?? guessYear(b.url) ?? guessYear(s.text + ' ' + b.text) ?? null,
        durationMin: 120,
        difficulty: 'mediu',
        subiectUrl: s.url,
        baremUrl: b.url,
        source: new URL('https://' + s.ctxKey).hostname,
        tags: [],
      });
    }
  }

  // adaugă subiecte/ bareme singulare ca perechi incomplete (dacă vrei)
  // aici le păstrăm doar pe cele cu subiect fără barem, ca să vezi ceva
  const singles = links.filter(a => a.isSubiect && !used.has(a.url));
  for (const s of singles) {
    pairs.push({
      id: s.url,
      title: s.text || 'Model',
      subject: guessSubject(s.text),
      year: guessYear(s.url) ?? guessYear(s.text) ?? null,
      durationMin: 120,
      difficulty: 'mediu',
      subiectUrl: s.url,
      baremUrl: null,
      source: new URL('https://' + s.ctxKey).hostname,
      tags: [],
    });
  }

  return pairs;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = (searchParams.get('domain') || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const path = searchParams.get('path') || '/';
    const depth = Math.min(Number(searchParams.get('depth') || '1'), 2);
    const maxPages = Math.min(Number(searchParams.get('max') || '20'), 80);
    const protocol: 'https:' | 'http:' = 'https:';

    if (!domain || !ALLOWED.has(domain)) {
      return NextResponse.json({ error: 'Domeniu nepermis.' }, { status: 403 });
    }

    const data = await crawl({ protocol, domain, startPath: path, depth, maxPages });

    // sort: an desc + titlu
    data.sort((a, b) => {
      const yb = b.year || 0, ya = a.year || 0;
      if (yb !== ya) return yb - ya;
      return a.title.localeCompare(b.title);
    });

    return NextResponse.json({ items: data }, {
      headers: {
        'cache-control': 'public, s-maxage=900, stale-while-revalidate=3600',
      }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Eroare server.' }, { status: 500 });
  }
}