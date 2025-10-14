// app/api/progress/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Firestore client-side, dar îl putem folosi aici

export const dynamic = 'force-dynamic';

async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  
  if (!adminAuth) {
    console.error('[API/PROGRESS] Firebase Admin SDK nu este inițializat.');
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

  try {
    const progressRef = doc(db, 'progress', uid);
    const docSnap = await getDoc(progressRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return NextResponse.json({ completedLessons: data.completedLessons || [] });
    } else {
      // Dacă utilizatorul nu are progres, returnăm un array gol
      return NextResponse.json({ completedLessons: [] });
    }
  } catch (error) {
    console.error('[API/PROGRESS] Eroare la citirea din Firestore:', error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}