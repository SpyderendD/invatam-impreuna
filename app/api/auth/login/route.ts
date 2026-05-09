import { NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: Request) {
  const app = initFirebaseAdmin();
  
  if (!app) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // 1. Primim ID Token-ul de la Frontend (Google login)
    const { idToken } = await request.json();
    
    // 2. Setăm durata sesiunii la 5 zile
    const expiresIn = 60 * 60 * 24 * 5 * 1000; 

    // 3. Generăm cookie-ul de sesiune folosind Admin SDK
    const auth = getAuth(app);
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // 4. Creăm răspunsul și atașăm cookie-ul
    const response = NextResponse.json({ status: 'success' }, { status: 200 });

    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // secunde
      httpOnly: true, // Nu poate fi citit de JavaScript din browser (securitate)
      secure: process.env.NODE_ENV === 'production', // Doar pe HTTPS
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}