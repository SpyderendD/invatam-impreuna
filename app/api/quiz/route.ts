// app/api/quiz/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'; // <-- IMPORT CORECT, CU ACOLADE {}
import { Timestamp } from 'firebase-admin/firestore';

async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split('Bearer ')[1];
  if (!adminAuth) return null;
  try {
    return (await adminAuth.verifyIdToken(token)).uid;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const uid = await verifyToken(req);

  if (!uid || !adminDb) {
    return NextResponse.json({ error: 'Neautorizat sau server neconfigurat' }, { status: 401 });
  }

  try {
    const { testId, score, totalQuestions } = await req.json();

    if (!testId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return NextResponse.json({ error: 'Date invalide pentru test' }, { status: 400 });
    }
    
    const progressRef = adminDb.collection('progress').doc(uid);
    const newResult = { testId, score, totalQuestions, completedAt: Timestamp.now() };

    const doc = await progressRef.get();

    if (doc.exists) {
        const existingResults = doc.data()?.testResults || [];
        const otherResults = existingResults.filter((r: any) => r.testId !== testId);
        await progressRef.update({
            testResults: [...otherResults, newResult]
        });
    } else {
        await progressRef.set({
            completedLessons: [],
            testResults: [newResult]
        });
    }

    return NextResponse.json({ status: 'success', message: 'Rezultat salvat' });

  } catch (error) {
    console.error('[API/QUIZ] Eroare la salvarea rezultatului:', error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}