import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin'; //Importăm default exportul
import { adminDb } from '@/lib/firebaseAdmin';

// Marcam ruta ca dinamică pentru a preveni erorile de prerendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Autorizare eșuată' }, { status: 401 });
        }
        
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token); // <-- CORECTAT: Folosim admin.auth()
        const userId = decodedToken.uid;

        const docRef = adminDb.collection('progress').doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) { 
            return NextResponse.json(docSnap.data());
        } else {
            return NextResponse.json({ completedLessons: [], testResults: [] });
        }
    } catch (error) {
        console.error("Eroare în /api/progress:", error);
        return NextResponse.json({ error: 'Eroare de server' }, { status: 500 });
    }
}