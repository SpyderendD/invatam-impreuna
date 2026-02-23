// app/api/study/decks/[deckId]/resources/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

async function verifyAccess(req: NextRequest, deckId: string) {
    if (!adminAuth || !adminDb) {
        return { uid: null, error: 'Server misconfigured', status: 500 };
    }
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { uid: null, error: 'Unauthorized', status: 401 };
    }
    const token = authHeader.split('Bearer ')[1];
    
    let uid;
    try {
        uid = (await adminAuth.verifyIdToken(token)).uid;
    } catch {
        return { uid: null, error: 'Invalid token', status: 401 };
    }

    try {
        const deckRef = adminDb.collection('studyDecks').doc(deckId);
        const deckSnap = await deckRef.get();
        if (!deckSnap.exists || deckSnap.data()?.userId !== uid) {
            return { uid: null, error: 'Access denied', status: 403 };
        }
    } catch {
        return { uid: null, error: 'DB Error', status: 500 };
    }
    return { uid, error: null, status: 200 };
}

export async function GET(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { error, status } = await verifyAccess(req, params.deckId);
    if (error) return NextResponse.json({ error }, { status });

    try {
        const snap = await adminDb!.collection('studyDecks').doc(params.deckId).collection('resources').orderBy('createdAt', 'desc').get();
        const resources = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(resources);
    } catch {
        return NextResponse.json({ error: "Eroare la preluare." }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { uid, error, status } = await verifyAccess(req, params.deckId);
    if (error || !uid) return NextResponse.json({ error }, { status: status || 401 });

    try {
        const { title, url } = await req.json();
        if (!title || !url) return NextResponse.json({ error: 'Titlul și URL-ul sunt obligatorii.' }, { status: 400 });

        const newResource = { title, url, userId: uid, createdAt: new Date().toISOString() };
        const ref = await adminDb!.collection('studyDecks').doc(params.deckId).collection('resources').add(newResource);

        return NextResponse.json({ id: ref.id, ...newResource }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Eroare la adăugare.' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { error, status } = await verifyAccess(req, params.deckId);
    if (error) return NextResponse.json({ error }, { status });

    try {
        const { resourceId } = await req.json();
        if (!resourceId) return NextResponse.json({ error: 'ID lipsă.' }, { status: 400 });

        await adminDb!.collection('studyDecks').doc(params.deckId).collection('resources').doc(resourceId).delete();
        return NextResponse.json({ message: 'Șters cu succes.' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Eroare la ștergere.' }, { status: 500 });
    }
}