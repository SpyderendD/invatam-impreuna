// app/api/rating/route.ts
import { NextResponse } from 'next/server';

type Stats = { count: number; sum: number; distribution: number[] };

declare global {
  // păstrează în memorie între requests (în dev)
  // eslint-disable-next-line no-var
  var __RATING_STORE__: Map<string, Stats> | undefined;
}

const store = global.__RATING_STORE__ ?? new Map<string, Stats>();
if (!global.__RATING_STORE__) global.__RATING_STORE__ = store;

function getStats(slug: string) {
  const s = store.get(slug) ?? { count: 0, sum: 0, distribution: Array(11).fill(0) };
  return s;
}

function toResponse(s: Stats) {
  const avg = s.count ? s.sum / s.count : 0;
  return { count: s.count, sum: s.sum, average: avg, distribution: s.distribution };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'default';
  const s = getStats(slug);
  return NextResponse.json(toResponse(s));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.slug || 'default');
    const value = Number(body.value);
    if (!Number.isFinite(value) || value < 1 || value > 10) {
      return NextResponse.json({ error: 'Valoare invalidă (1..10).' }, { status: 400 });
    }
    const s = getStats(slug);
    s.count += 1;
    s.sum += value;
    s.distribution[value] = (s.distribution[value] || 0) + 1;
    store.set(slug, s);
    return NextResponse.json(toResponse(s));
  } catch (e: any) {
    return NextResponse.json({ error: 'Eroare server.' }, { status: 500 });
  }
}