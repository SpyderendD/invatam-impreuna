// app/api/progress/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

// Optimizare pentru performanță (opțional, depinde de strategia de deployment)
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

  if (!adminDb) {
      console.error('[API/PROGRESS] Firebase Admin SDK (Firestore) nu este inițializat.');
      return NextResponse.json({ error: 'Eroare de configurare server' }, { status: 500 });
  }

  try {
    const progressRef = adminDb.collection('progress').doc(uid);
    const docSnap = await progressRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      // Returnăm datele complete sau valori implicite sigure
      return NextResponse.json({ 
        completedLessons: data?.completedLessons || [],
        xp: data?.xp || 0,
        level: data?.level || 1,
        streak: data?.streak || 0
      });
    } else {
      // Returnăm structura completă goală pentru utilizatori noi
      return NextResponse.json({ 
        completedLessons: [],
        xp: 0,
        level: 1,
        streak: 0
      });
    }
  } catch (error) {
    console.error('[API/PROGRESS] Eroare la citirea din Firestore:', error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const uid = await verifyToken(req);
  
    if (!uid) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }
  
    if (!adminDb) {
        return NextResponse.json({ error: 'Eroare de configurare server' }, { status: 500 });
    }
  
    try {
        const body = await req.json();
        const { lessonId, action } = body; // action poate fi 'complete' sau 'uncomplete'

        if (!lessonId || !action) {
            return NextResponse.json({ error: 'Date incomplete' }, { status: 400 });
        }

        const progressRef = adminDb.collection('progress').doc(uid);
        
        // Folosim tranzacție pentru a ne asigura că citim și scriem atomic (pentru XP, Streak etc.)
        await adminDb.runTransaction(async (transaction) => {
            const docSnap = await transaction.get(progressRef);
            let data = docSnap.exists ? docSnap.data()! : { completedLessons: [], xp: 0, level: 1, streak: 0 };
            let completedLessons = data.completedLessons || [];
            let xp = data.xp || 0;

            if (action === 'complete') {
                if (!completedLessons.includes(lessonId)) {
                    completedLessons.push(lessonId);
                    xp += 100; // Adaugă 100 XP per lecție
                }
            } else if (action === 'uncomplete') {
                if (completedLessons.includes(lessonId)) {
                    completedLessons = completedLessons.filter((id: string) => id !== lessonId);
                    xp = Math.max(0, xp - 100); // Scade XP, dar nu sub 0
                }
            }

            // Recalculare Level (simplificat: level crește la fiecare 1000 XP)
            const level = Math.floor(xp / 1000) + 1;

            transaction.set(progressRef, {
                ...data,
                completedLessons,
                xp,
                level
            }, { merge: true });
        });

        return NextResponse.json({ success: true });

    } catch (error) {
      console.error('[API/PROGRESS] Eroare la scriere în Firestore:', error);
      return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
    }
  }