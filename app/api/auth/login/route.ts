// app/api/auth/login/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

const SESSION_COOKIE_DURATION_MS = 60 * 60 * 24 * 5 * 1000;

type LoginPayload = { idToken?: string };

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = (await req.json()) as LoginPayload;
    if (!idToken) {
      return NextResponse.json({ error: 'ID Token este necesar' }, { status: 400 });
    }

    // Aici e verificarea: dacă adminAuth e null, nu putem continua
    if (!adminAuth) {
      console.error('[API/LOGIN] EROARE FATALĂ: Firebase Admin SDK nu este inițializat.');
      return NextResponse.json({ error: 'Eroare de configurare server (Firebase Admin).' }, { status: 500 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_DURATION_MS,
    });

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_COOKIE_DURATION_MS / 1000,
      path: '/',
    });
    return response;
  } catch (error: any) {
    console.error("[API/LOGIN] EROARE CRITICĂ:", { message: error.message, code: error.code });
    return NextResponse.json({ error: 'Eroare la autentificare pe server.' }, { status: 500 });
  }
}