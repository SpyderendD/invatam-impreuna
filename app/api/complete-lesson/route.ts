import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin'; // Importăm default exportul
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebaseAdmin';

// Marcam ruta ca dinamică
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Autorizare eșuată' }, { status: 401 });
        }
        
        const token = authHeader.split('Bearer ')[1];
        const { lessonId, isCompleted } = await request.json();

        if (!lessonId) {
            return NextResponse.json({ error: 'ID-ul lecției lipsește' }, { status: 400 });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;
        
        const progressRef = adminDb.collection('progress').doc(userId);
        
        await progressRef.set({
            completedLessons: isCompleted 
                ? FieldValue.arrayUnion(lessonId) 
                : FieldValue.arrayRemove(lessonId)
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Eroare în /api/complete-lesson:", error);
        return NextResponse.json({ error: 'Eroare de server' }, { status: 500 });
    }
}