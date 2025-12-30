import { initFirebaseAdmin } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Inițializăm Firebase
  const app = initFirebaseAdmin();

  // Dacă Firebase nu a reușit să pornească (cheie greșită sau lipsă la build),
  // returnăm că utilizatorul nu e logat, dar NU dăm eroare 500.
  if (!app) {
    console.warn("Firebase Admin failed to load. Skipping auth check.");
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
    
    return NextResponse.json({ 
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        picture: decodedClaims.picture,
        name: decodedClaims.name || '',
      } 
    }, { status: 200 });

  } catch (error) {
    // Dacă sesiunea e invalidă, returnăm user null, nu eroare
    return NextResponse.json({ user: null }, { status: 200 });
  }
}