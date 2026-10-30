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
  const votersKey = `voters:${slug}`;

  // 2. Verificăm dacă a mai votat
  const hasVoted = await kv.sismember(votersKey, ip);

  if (hasVoted) {
    return NextResponse.json(
      { error: 'Ai votat deja! Mulțumim oricum. ❤️' }, 
      { status: 429 }
    );
  }

  // 3. Salvăm votul
  const key = `rating:${slug}`;
  await kv.sadd(votersKey, ip);
  await kv.hincrby(key, 'count', 1);
  await kv.hincrby(key, 'sum', val);

  const [count, sum] = await Promise.all([
    kv.hget(key, 'count'),
    kv.hget(key, 'sum'),
  ]);
  
  const totalCount = Number(count) || 0;
  const totalSum = Number(sum) || 0;
  const average = totalCount > 0 ? totalSum / totalCount : 0;

  return NextResponse.json({ count: totalCount, average: parseFloat(average.toFixed(1)) });
}

// RESETARE CU PAROLĂ
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'global';
  
  // Citim parola trimisă din frontend
  const secret = req.headers.get('x-admin-secret');
  const expectedSecret = process.env.ADMIN_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Parolă incorectă! Acces interzis. ⛔' }, 
      { status: 401 }
    );
  }

  const key = `rating:${slug}`;
  const votersKey = `voters:${slug}`;

  // Ștergem și statisticile, și lista de IP-uri ca să se poată vota din nou
  await Promise.all([
    kv.del(key),
    kv.del(votersKey)
  ]);

  return NextResponse.json({ success: true, message: 'Rating resetat complet!' });
}