// app/api/complete-lesson/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
// Importăm tipurile necesare din admin SDK
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

async function verifyToken(req: NextRequest) {
  // ... funcția ta de verificare token rămâne la fel
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
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
    const { lessonId, isCompleted } = (await req.json()) as { lessonId: string, isCompleted: boolean };
    
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId este necesar' }, { status: 400 });
    }
    
    const progressRef = adminDb.collection('progress').doc(uid);

    // Folosim `arrayUnion` și `arrayRemove` din Admin SDK via `FieldValue`
    if (isCompleted) {
        await progressRef.set({
            completedLessons: FieldValue.arrayUnion(lessonId)
        }, { merge: true }); // `merge: true` adaugă câmpul fără a suprascrie documentul
    } else {
        await progressRef.update({
            completedLessons: FieldValue.arrayRemove(lessonId)
        });
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('[API/COMPLETE-LESSON] Eroare la salvarea în Firestore:', error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}