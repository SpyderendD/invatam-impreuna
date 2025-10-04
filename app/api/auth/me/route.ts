import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_PRIVATE_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase Admin SDK a fost inițializat.');
    } catch (e: any) {
      console.error('Eroare la inițializarea Firebase Admin:', e.message);
    }
  } else {
    console.error('EROARE: FIREBASE_PRIVATE_KEY nu este setat în .env.local');
  }
}

// exportăm explicit instanța auth()
export const adminAuth = admin.auth();