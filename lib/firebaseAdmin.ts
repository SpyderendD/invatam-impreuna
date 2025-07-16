import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Verificăm dacă aplicația a fost deja inițializată pentru a evita erori
if (!admin.apps.length) {
  try {
    // Verificăm dacă toate variabilele de mediu necesare sunt definite
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Variabilele de mediu pentru Firebase Admin nu sunt definite.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Înlocuim `\n` din variabila de mediu cu newline-uri reale
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK a fost inițializat.');
  } catch (error: any) {
    console.error('Eroare la inițializarea Firebase Admin:', error.message);
  }
}

// Exportăm instanța Firestore pentru Admin
export const adminDb = getFirestore();