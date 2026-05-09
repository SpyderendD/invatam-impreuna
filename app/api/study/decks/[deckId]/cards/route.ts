// app/api/study/decks/[deckId]/cards/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// O singură funcție de verificare, robustă și curată, pentru toate metodele (GET, POST, DELETE)
async function verifyAccess(req: NextRequest, deckId: string) {
    if (!adminAuth || !adminDb) {
        console.error("CRITICAL: Firebase Admin SDK not initialized.");
        return { uid: null, error: 'Serverul nu este configurat corect.', status: 500 };
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return { uid: null, error: 'Token de autorizare lipsă.', status: 401 };
    }
    const token = authHeader.split('Bearer ')[1];
    
    let uid;
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        uid = decodedToken.uid;
    } catch (e) {
        console.warn("Token invalid primit:", e);
        return { uid: null, error: 'Token invalid.', status: 401 };
    }

    try {
        const deckRef = adminDb.collection('studyDecks').doc(deckId);
        const deckSnap = await deckRef.get();
        
        // --- AICI ESTE CORECTURA ESENȚIALĂ APLICATĂ ---
        if (!deckSnap.exists || deckSnap.data()?.userId !== uid) {
            return { uid: null, error: 'Pachetul nu a fost găsit sau accesul este refuzat.', status: 403 };
        }
    } catch (e) {
        console.error("Eroare la accesarea pachetului în Firestore:", e);
        return { uid: null, error: 'Eroare la accesarea bazei de date.', status: 500 };
    }
    
    return { uid, error: null, status: 200 };
}

// Handler GET: Preia toate cardurile dintr-un pachet
export async function GET(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { deckId } = params;
    const { error, status } = await verifyAccess(req, deckId);
    
    if (error) {
        return NextResponse.json({ error }, { status });
    }

    try {
        const cardsSnapshot = await adminDb!.collection('studyDecks').doc(deckId).collection('flashcards').get();
        const cards = cardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(cards);
    } catch (e) {
        console.error("Eroare la preluarea cardurilor:", e);
        return NextResponse.json({ error: "Nu am putut prelua cardurile din colecție." }, { status: 500 });
    }
}

// Handler POST: Adaugă un card nou
export async function POST(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { deckId } = params;
    const { uid, error, status } = await verifyAccess(req, deckId);
    
    if (error || !uid) {
        return NextResponse.json({ error: error || "Utilizator neautorizat." }, { status: status || 401 });
    }

    try {
        const { front, back } = await req.json();
        if (!front || !back) {
            return NextResponse.json({ error: 'Conținutul pentru față și spate este obligatoriu.' }, { status: 400 });
        }

        const newCard = { front, back, userId: uid };
        const cardRef = await adminDb!.collection('studyDecks').doc(deckId).collection('flashcards').add(newCard);

        await adminDb!.collection('studyDecks').doc(deckId).update({
            cardCount: FieldValue.increment(1)
        });

        return NextResponse.json({ id: cardRef.id, ...newCard }, { status: 201 });
    } catch (err) {
        console.error("Eroare la crearea cardului:", err);
        return NextResponse.json({ error: 'Eroare internă la server la crearea cardului.' }, { status: 500 });
    }
}

// Handler DELETE: Șterge un card existent
export async function DELETE(req: NextRequest, { params }: { params: { deckId: string } }) {
    const { deckId } = params;
    const { error, status } = await verifyAccess(req, deckId);
    if (error) {
        return NextResponse.json({ error }, { status });
    }

    try {
        const { cardId } = await req.json();
        if (!cardId) {
            return NextResponse.json({ error: 'ID-ul cardului este obligatoriu.' }, { status: 400 });
        }

        // Șterge documentul cardului din sub-colecție
        await adminDb!.collection('studyDecks').doc(deckId).collection('flashcards').doc(cardId).delete();

        // Decrementează numărul de carduri din documentul pachetului
        await adminDb!.collection('studyDecks').doc(deckId).update({
            cardCount: FieldValue.increment(-1)
        });

        return NextResponse.json({ message: 'Cardul a fost șters cu succes.' }, { status: 200 });
    } catch (err) {
        console.error("Eroare la ștergerea cardului:", err);
        return NextResponse.json({ error: 'Eroare internă la server la ștergerea cardului.' }, { status: 500 });
    }
}