// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Sesiune invalidă.' }, { status: 401 });
    }

    // Verificăm cookie-ul. Dacă e valid, primim datele decodate.
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Returnăm datele utilizatorului (sau doar un status de succes)
    return NextResponse.json({ userId: decodedClaims.uid, email: decodedClaims.email }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Sesiune invalidă sau expirată.' }, { status: 401 });
  }
}