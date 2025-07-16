import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Autorizare eșuată' }, { status: 401 });
        }
        
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(token);
        const userId = decodedToken.uid;

        const docRef = adminDb.collection('progress').doc(userId);
        const docSnap = await docRef.get();

        // AICI ESTE CORECȚIA: Fără paranteze la .exists
        if (docSnap.exists) { 
            return NextResponse.json(docSnap.data());
        } else {
            // Dacă utilizatorul nu are încă un document de progres, îi trimitem unul gol.
            return NextResponse.json({ completedLessons: [], testResults: [] });
        }
    } catch (error) {
        console.error("Eroare în /api/progress:", error);
        return NextResponse.json({ error: 'Eroare de server', status: 500 });
    }
}