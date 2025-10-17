// app/api/tests/route.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

// Domenii permise
const ALLOWED_DOMAINS = new Set([
'subiecte.edu.ro',
'www.edu.ro',
'edu.ro',
'heiprofu.ro',
'www.heiprofu.ro',
'e3.ro',
'www.e3.ro',
]);

type CrawlOpts = {
protocol: 'https:' | 'http:';
domain: string;
startPath: string; // ex: '/examene-matematica/...'
depth: number; // 1-2 recomandat
maxPages: number; // limită pagini
};

function normalizeUrl(protocol: string, domain: string, path: string) {
  if (!path) return `${protocol}//${domain}/`;
  if (path.startsWith('http')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${protocol}//${domain}${p}`;
}

function sameDomain(href: string, domain: string) {
  try {
    const u = new URL(href, `https://${domain}`);
    return u.hostname === domain || u.hostname.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

function isPdfLink(href: string) {
return href.toLowerCase().includes('.pdf');
}

function googleDriveToPdf(href: string) {
  // /file/d/<id>/view -> uc?export=download&id=<id>
  try {
    const m = href.match(/\/file\/d\/([^/]+)\//);
    if (m && m[1]) {
      const id = m[1];
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
  } catch {}
  return null;
}

function guessYear(text: string): number | undefined {
const m = text.match(/20(1\d|2\d)/);
return m ? Number(m[0]) : undefined;
}

function guessSubject(text: string) {
const s = text.toLowerCase();
if (s.includes('rom') || s.includes('română') || s.includes('romana')) return 'romana';
if (s.includes('mat') || s.includes('matematic')) return 'matematica';
return 'mixt';
}

async function crawl({ protocol, domain, startPath, depth, maxPages }: CrawlOpts) {
const visited = new Set<string>();
const queue: { url: string; d: number }[] = [];
const results: {
id: string;
title: string;
subject: 'romana' | 'matematica' | 'mixt';
year: number | null;
durationMin: number;
difficulty: 'usor' | 'mediu' | 'dificil';
pdfUrl: string;
source: string;
tags: string[];
}[] = [];

const startUrl = normalizeUrl(protocol, domain, startPath || '/');
queue.push({ url: startUrl, d: 0 });
visited.add(startUrl);

let pages = 0;

while (queue.length && pages < maxPages) {
const { url, d } = queue.shift()!;
pages++;

let html = '';
try {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  });
  if (!res.ok) continue;
  html = await res.text();
} catch {
  continue;
}

const $ = cheerio.load(html);

// Colectează linkuri PDF + Google Drive
$('a[href]').each((_, el) => {
  let href = ($(el).attr('href') || '').trim();
  if (!href) return;

  // Absolutizează
  const abs = normalizeUrl(protocol, domain, href);

  // PDF direct?
  let pdfUrl = isPdfLink(abs) ? abs : null;

  // Google Drive?
  if (!pdfUrl && abs.includes('drive.google.com')) {
    const gd = googleDriveToPdf(abs);
    if (gd) pdfUrl = gd;
  }

  if (!pdfUrl) return;

  // Acceptă PDF pe orice domeniu? Păstrăm doar același domeniu ca pagină sursă.
  // Dacă vrei să accepți PDF-uri externe, scoate condiția de mai jos.
  if (!sameDomain(abs, domain) && !pdfUrl.includes('drive.google.com')) return;

  const text = ($(el).text() || href).trim();
  const title = text || 'Model';
  const year = guessYear(abs) ?? guessYear(text) ?? null;
  const subject = guessSubject(abs + ' ' + text) as 'romana' | 'matematica' | 'mixt';
  const id = pdfUrl;

  const exists = results.find((r) => r.pdfUrl === pdfUrl);
  if (!exists) {
    results.push({
      id,
      title,
      subject,
      year,
      durationMin: 120,
      difficulty: 'mediu',
      pdfUrl,
      source: domain,
      tags: [],
    });
  }
});

// Extinde crawl dacă d < depth
if (d < depth) {
  const links: string[] = [];
  $('a[href]').each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    if (!href) return;
    const abs = normalizeUrl(protocol, domain, href);
    if (!sameDomain(abs, domain)) return;
    if (abs.endsWith('.pdf')) return;
    if (abs.includes('#')) return;
    links.push(abs);
  });
  for (const l of links) {
    if (!visited.has(l)) {
      visited.add(l);
      queue.push({ url: l, d: d + 1 });
    }
  }
}
}

return results;
}

export async function GET(req: Request) {
try {
const { searchParams } = new URL(req.url);
const domain = (searchParams.get('domain') || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
const path = searchParams.get('path') || '/';
const depth = Math.min(Number(searchParams.get('depth') || '1'), 2);
const maxPages = Math.min(Number(searchParams.get('max') || '10'), 60);
const protocol: 'https:' | 'http:' = 'https:';


if (!domain || !ALLOWED_DOMAINS.has(domain)) {
  return NextResponse.json({ error: 'Domeniu nepermis.' }, { status: 403 });
}

const data = await crawl({ protocol, domain, startPath: path, depth, maxPages });

// Sortează descrescător după an, apoi alfabetic
data.sort((a, b) => {
  const ya = a.year || 0, yb = b.year || 0;
  if (yb !== ya) return yb - ya;
  return a.title.localeCompare(b.title);
});

return new NextResponse(JSON.stringify({ items: data }), {
  headers: {
    'content-type': 'application/json',
    'cache-control': 'public, s-maxage=900, stale-while-revalidate=3600',
  },
});
} catch (e) {
return NextResponse.json({ error: 'Eroare server.' }, { status: 500 });
}
}