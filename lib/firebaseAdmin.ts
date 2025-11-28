// lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore'; // Importă getFirestore

// Verificăm dacă avem variabilele necesare
const hasFirebaseAdminConfig = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (hasFirebaseAdminConfig) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin SDK a fost inițializat cu succes.');
    } catch (e: any) {
      console.error('❌ EROARE la inițializarea Firebase Admin:', e.message);
    }
  } else {
    console.warn('⚠️ AVERTISMENT: Cheile Firebase Admin lipsesc din .env.local. API-urile admin nu vor funcționa.');
  }
}

// Exportăm `adminAuth` și `adminDb` doar dacă inițializarea a reușit.
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? getFirestore() : null;