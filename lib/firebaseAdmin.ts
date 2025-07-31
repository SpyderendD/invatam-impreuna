// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Verificăm dacă aplicația a fost deja inițializată
if (!admin.apps.length) {
  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Variabilele de mediu pentru Firebase Admin nu sunt setate corect.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK a fost inițializat.');
  } catch (error: any) {
    console.error('Eroare la inițializarea Firebase Admin SDK:', error.message);
  }
}

// Exportăm instanța Firestore și, de asemenea, obiectul `admin` însuși.
export const adminDb = getFirestore();
export default admin; // Exportăm default obiectul admin