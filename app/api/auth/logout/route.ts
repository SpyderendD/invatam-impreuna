import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ status: 'success' }, { status: 200 });
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  return response;
}