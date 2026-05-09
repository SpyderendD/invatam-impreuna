import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { App } from 'firebase-admin/app'; // Importăm tipul corect

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

// Definim tipul variabilei
let app: App | undefined;

// Verificăm dacă există deja o instanță
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formatPrivateKey(privateKey),
        }),
      });
      console.log('🔥 Firebase Admin a fost inițializat cu succes.');
    } catch (error) {
      console.error('❌ Eroare la inițializarea Firebase Admin:', error);
    }
  } else {
    // Aici nu mai crăpăm build-ul, doar afișăm un warn
    if (process.env.NODE_ENV === 'development') {
       console.warn('⚠️ Variabilele de mediu Firebase lipsesc. Admin SDK nu a fost inițializat.');
    }
  }
} else {
  // Dacă există, o folosim pe cea existentă
  app = admin.app();
}

// Exportăm instanțele, gestionând cazul în care 'app' e undefined
export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;

// Funcție fallback (opțional)
export function initFirebaseAdmin() {
    return app;
}