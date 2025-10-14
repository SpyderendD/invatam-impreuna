// app/api/complete-lesson/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { toggleLessonCompletion } from '@/lib/firebase'; // Reutilizăm logica ta

export const dynamic = 'force-dynamic';

async function verifyToken(req: NextRequest) {
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

  if (!uid) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const { lessonId, isCompleted } = (await req.json()) as { lessonId: string, isCompleted: boolean };
    
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId este necesar' }, { status: 400 });
    }

    // Aici chemăm funcția ta care face update în Firestore
    await toggleLessonCompletion(uid, lessonId, isCompleted);

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('[API/COMPLETE-LESSON] Eroare la salvarea în Firestore:', error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}