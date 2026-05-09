import { NextResponse } from 'next/server';

type Body = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmail(s: string): boolean {
  return EMAIL_RE.test(String(s));
}

function escapeHtml(s: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(s).replace(/[&<>"']/g, (m) => (map[m] ? map[m] : m));
}

// Acceptă "email@ex.com" sau "Nume <email@ex.com>".
// Taie ghilimelele de capăt (”, “, ', ").
function normalizeFrom(v: string): string {
  if (!v) return '';
  let s = v.trim();

  // elimină ghilimelele de capăt (duble/single sau tipografice)
  const pairs: Array<[string, string]> = [
    ['"', '"'],
    ["'", "'"],
    ['“', '”'],
    ['‘', '’'],
  ];
  for (const p of pairs) {
    const l = p[0];
    const r = p[1];
    if (s.startsWith(l) && s.endsWith(r)) {
      s = s.substring(1, s.length - 1).trim();
      break;
    }
  }

  // "Nume <email>"
  const named = s.match(/^([^<>\r\n]+?)<\s*([^<>\s@]+@[^\s@<>]+\.[^\s@<>]+)\s*>$/);
  if (named) {
    const name = named[1].trim();
    const email = named[2].trim();
    return name ? name + ' <' + email + '>' : email;
  }

  // extrage primul email; restul e numele
  const emailOnly = s.match(/([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)/);
  if (emailOnly) {
    const email = emailOnly[1];
    const name = s.replace(email, '').trim();
    return name ? name + ' <' + email + '>' : email;
  }

  return '';
}

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as Partial<Body>;
    const name = String(json.name || '');
    const email = String(json.email || '');
    const subjectIn = String(json.subject || 'Mesaj nou');
    const message = String(json.message || '');
    const company = String(json.company || '');

    // honeypot
    if (company) {
      return NextResponse.json({ message: 'OK' });
    }

    if (!name || !email || !message || !isEmail(email)) {
      return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
    }

    const apiKey = (process.env.RESEND_API_KEY || '').trim();
    const to = ((process.env.CONTACT_TO || '') ? String(process.env.CONTACT_TO) : 'spyderend0@gmail.com').trim();
    let from = normalizeFrom((process.env.RESEND_FROM || '').trim());
    if (!from) {
      from = 'onboarding@resend.dev';
    }

    // DEBUG
    console.log('DEBUG /api/contact FROM=', from, ' TO=', to, ' APIKEY=', apiKey ? apiKey.slice(0, 6) + '…' : '(missing)');

    if (!apiKey) {
      console.log('CONTACT (demo):', { from, to, name, email, subjectIn, message });
      return NextResponse.json({
        message: 'Mesaj înregistrat (mod demo). Configurează RESEND_API_KEY/RESEND_FROM pentru trimitere reală.',
        debug: { from, to, demo: true },
      });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const subject = ('[Contact] ' + subjectIn).slice(0, 120);
    const text =
      'Nume: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Subiect: ' + subjectIn + '\n\n' +
      'Mesaj:\n' + message;

    const htmlParts: string[] = [
      '<div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.6;color:#0a0a0a">',
      '<h2>Mesaj nou din formularul de contact</h2>',
      '<p><strong>Nume:</strong> ' + escapeHtml(name) + '</p>',
      '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>',
      '<p><strong>Subiect:</strong> ' + escapeHtml(subjectIn) + '</p>',
      '<pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:8px">' + escapeHtml(message) + '</pre>',
      '</div>',
    ];
    const html = htmlParts.join('');

    const result = await resend.emails.send({
      from: from,
      to: to,
      reply_to: email,
      subject: subject,
      text: text,
      html: html,
    } as any);

    // SDK Resend: { data: { id }, error }
    const anyRes: any = result;
    if (anyRes && anyRes.error) {
      console.error('RESEND ERROR:', anyRes.error);
      return NextResponse.json({ error: anyRes.error?.message || 'Eroare Resend' }, { status: 502 });
    }

    const id = anyRes && anyRes.data ? anyRes.data.id : null;
    console.log('DEBUG /api/contact queued id=', id);

    return NextResponse.json({ message: 'Mesajul a fost trimis către Resend.', id: id, from: from, to: to });
  } catch (e: any) {
    console.error('CONTACT error:', e);
    return NextResponse.json({ error: 'Eroare la server. Încearcă din nou.' }, { status: 500 });
  }
}