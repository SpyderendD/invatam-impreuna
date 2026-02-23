import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
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

export async function GET(req: NextRequest) {
  const uid = await verifyToken(req);
  if (!uid || !adminDb) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const decksSnapshot = await adminDb.collection('studyDecks').where('userId', '==', uid).orderBy('createdAt', 'desc').get();
    const decks = decksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(decks);
  } catch (error) {
    console.error("Eroare la preluarea pachetelor:", error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const uid = await verifyToken(req);
  if (!uid || !adminDb) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }
  
  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Numele pachetului este obligatoriu' }, { status: 400 });
    }

    // --- VERIFICAREA LIMITEI PE SERVER (SECURITATE) ---
    const existingDecksSnapshot = await adminDb.collection('studyDecks').where('userId', '==', uid).get();
    if (existingDecksSnapshot.size >= 5) {
      return NextResponse.json({ error: 'Ai atins limita maximă de 5 pachete.' }, { status: 403 });
    }

    const newDeck = {
      name,
      description: description || '',
      userId: uid,
      createdAt: Timestamp.now(),
      cardCount: 0,
    };

    const docRef = await adminDb.collection('studyDecks').add(newDeck);
    return NextResponse.json({ id: docRef.id, ...newDeck }, { status: 201 });

  } catch (error) {
    console.error("Eroare la crearea pachetului:", error);
    return NextResponse.json({ error: 'Eroare internă server' }, { status: 500 });
  }
}