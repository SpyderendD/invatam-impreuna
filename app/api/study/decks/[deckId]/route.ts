// app/api/study/decks/[deckId]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

// Folosim o funcție de verificare similară cu cea pentru carduri
async function verifyDeckOwnership(req: NextRequest, deckId: string) {
    if (!adminAuth || !adminDb) {
        return { uid: null, error: 'Server not configured.', status: 500 };
    }
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { uid: null, error: 'Authorization token missing.', status: 401 };
    }
    const token = authHeader.split('Bearer ')[1];
    
    let uid;
    try {
        uid = (await adminAuth.verifyIdToken(token)).uid;
    } catch (e) {
        return { uid: null, error: 'Invalid token.', status: 401 };
    }

    try {
        const deckRef = adminDb.collection('studyDecks').doc(deckId);
        const deckSnap = await deckRef.get();
        if (!deckSnap.exists || deckSnap.data()?.userId !== uid) {
            return { uid: null, error: 'Deck not found or access denied.', status: 403 };
        }
    } catch (e) {
        return { uid: null, error: 'Error accessing database.', status: 500 };
    }
    
    return { uid, error: null, status: 200 };
}


// Handler DELETE: Șterge un pachet întreg (inclusiv sub-colecția de carduri)
export async function DELETE(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { deckId } = params;
    const { error, status } = await verifyDeckOwnership(req, deckId);
    
    if (error) {
        return NextResponse.json({ error }, { status });
    }

    if (!adminDb) {
        return NextResponse.json({ error: 'Server not configured.' }, { status: 500 });
    }

    try {
        // Pentru a șterge o sub-colecție, trebuie să ștergem fiecare document din ea
        const cardsCollectionRef = adminDb.collection('studyDecks').doc(deckId).collection('flashcards');
        const cardsSnapshot = await cardsCollectionRef.get();

        const batch = adminDb.batch();
        cardsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Acum ștergem documentul pachetului principal
        await adminDb.collection('studyDecks').doc(deckId).delete();

        return NextResponse.json({ message: 'Pachetul și toate cardurile au fost șterse.' }, { status: 200 });

    } catch (err) {
        console.error("Eroare la ștergerea pachetului:", err);
        return NextResponse.json({ error: 'Eroare internă la server la ștergerea pachetului.' }, { status: 500 });
    }
}