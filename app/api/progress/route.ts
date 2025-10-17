// app/api/progress/route.ts

import { NextResponse, type NextRequest } from 'next/server';
// ATENȚIE: Importă AMBELE, adminAuth pentru token și adminDb pentru baza de date
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'; 

export const dynamic = 'force-dynamic';

async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  
  if (!adminAuth) {
    console.error('[API/PROGRESS] Firebase Admin SDK (Auth) nu este inițializat.');
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('[API/PROGRESS] Eroare la verificarea tokenului:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const uid = await verifyToken(req);

  if (!uid) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  // Verifică dacă și adminDb este inițializat
  if (!adminDb) {
      console.error('[API/PROGRESS] Firebase Admin SDK (Firestore) nu este inițializat.');
      return NextResponse.json({ error: 'Eroare de configurare server' }, { status: 500 });
  }

  try {
    // --- MODIFICARE CHEIE: Folosim `adminDb` în loc de `db` ---
    const progressRef = adminDb.collection('progress').doc(uid);
    const docSnap = await progressRef.get(); // Metoda .get() pentru Admin SDK

    if (docSnap.exists) {
      const data = docSnap.data();
      // Asigură-te că returnezi un array gol dacă `completedLessons` nu există
      return NextResponse.json({ completedLessons: data?.completedLessons || [] });
    } else {
      // Dacă utilizatorul nu are progres, returnăm un array gol
      return NextResponse.json({ completedLessons: [] });
    }
  } catch (error) {
    console.error('[API/PROGRESS] Eroare la citirea din Firestore:', error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}