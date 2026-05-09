// app/api/rating/route.ts
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'global';
  const key = `rating:${slug}`;
  
  const [count, sum] = await Promise.all([
    kv.hget(key, 'count'),
    kv.hget(key, 'sum'),
  ]);

  const totalCount = Number(count) || 0;
  const totalSum = Number(sum) || 0;
  const average = totalCount > 0 ? totalSum / totalCount : 0;

  return NextResponse.json({
    count: totalCount,
    average: parseFloat(average.toFixed(1)),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug = 'global', value } = body;
  const val = Number(value);

  if (!val || val < 1 || val > 10) {
    return NextResponse.json({ error: 'Valoare invalidă' }, { status: 400 });
  }

  // 1. Identificăm utilizatorul după IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  
  // Dacă suntem pe localhost, IP-ul e ::1, e ok pentru teste, dar în producție va fi IP real.
  
  // Cheia unde ținem minte cine a votat pentru pagina asta
  const votersKey = `voters:${slug}`;

  // 2. Verificăm dacă a mai votat (SISMEMBER verifică dacă IP-ul e în set)
  const hasVoted = await kv.sismember(votersKey, ip);

  if (hasVoted) {
    // Dacă a votat deja, returnăm eroare 429 (Too Many Requests) sau 403
    return NextResponse.json(
      { error: 'Ai votat deja! Mulțumim oricum. ❤️' }, 
      { status: 429 }
    );
  }

  // 3. Dacă e curat, salvăm votul
  const key = `rating:${slug}`;
  
  // Adăugăm IP-ul în lista celor care au votat
  await kv.sadd(votersKey, ip);
  
  // Incrementăm statistica
  await kv.hincrby(key, 'count', 1);
  await kv.hincrby(key, 'sum', val);

  // Returnăm noile date
  const [count, sum] = await Promise.all([
    kv.hget(key, 'count'),
    kv.hget(key, 'sum'),
  ]);
  
  const totalCount = Number(count) || 0;
  const totalSum = Number(sum) || 0;
  const average = totalCount > 0 ? totalSum / totalCount : 0;

  return NextResponse.json({ count: totalCount, average: parseFloat(average.toFixed(1)) });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'global';
  const secret = req.headers.get('x-admin-secret');
  
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Nu ai voie aici! ⛔' }, { status: 401 });
  }

  const key = `rating:${slug}`;
  const votersKey = `voters:${slug}`; // Trebuie să ștergem și lista de votanți ca să poți testa iar

  await kv.del(key);
  await kv.del(votersKey); // Ștergem și istoricul de IP-uri

  return NextResponse.json({ success: true });
}