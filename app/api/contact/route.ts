import { NextResponse } from 'next/server';

function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
}

// (opțional) ratelimit simplu în memorie
const hits = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip) || { count: 0, ts: now };
  if (now - rec.ts > windowMs) { rec.count = 0; rec.ts = now; }
  rec.count++;
  hits.set(ip, rec);
  return rec.count <= limit;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      (req as any).ip ||
      '0.0.0.0';

    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Prea multe cereri. Încearcă peste un minut.' }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, subject = 'Mesaj nou', message, company } = body || {};

    // honeypot
    if (company) return NextResponse.json({ message: 'OK' });

    if (!name || !email || !message || !isEmail(email)) {
      return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.RESEND_FROM || 'Invatam Impreuna <onboarding@resend.dev>';
    const TO = process.env.CONTACT_TO || 'spyderend0@gmail.com';

    if (!RESEND_API_KEY) {
      // demo mode (fără cheie) — doar log
      console.log('CONTACT (demo, fără RESEND_API_KEY):', { ip, name, email, subject, message });
      return NextResponse.json({ message: 'Mesaj înregistrat (mod demo). Configurează RESEND_API_KEY pentru trimitere reală.' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Contact] ${subject}`.slice(0, 120),
      text: `Nume: ${name}\nEmail: ${email}\nSubiect: ${subject}\n\nMesaj:\n${message}`,
      html: `
        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.6;color:#0a0a0a">
          <h2>Mesaj nou din formularul de contact</h2>
          <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subiect:</strong> ${escapeHtml(subject)}</p>
          <pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:8px">${escapeHtml(message)}</pre>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Mesajul a fost trimis cu succes. Mulțumim!' });
  } catch (e: any) {
    console.error('CONTACT error:', e);
    return NextResponse.json({ error: 'Eroare la server. Încearcă din nou.' }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));
}