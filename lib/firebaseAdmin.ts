import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Verificăm dacă variabilele există
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      // 2. Formatăm corect cheia privată
      // Vercel uneori transformă \n în string literal "\\n", așa că le înlocuim înapoi
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
      });
      console.log('✅ Firebase Admin SDK a fost inițializat cu succes.');
    } catch (e: any) {
      console.error('❌ EROARE la inițializarea Firebase Admin:', e.message);
    }
  } else {
    console.warn('⚠️ AVERTISMENT: Cheile Firebase Admin lipsesc din variabilele de mediu.');
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? getFirestore() : null;