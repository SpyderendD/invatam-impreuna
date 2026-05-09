// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Returnăm null pentru a evita verificarea Admin SDK care cauzează eroarea
  return NextResponse.json({ user: null }, { status: 200 });
}