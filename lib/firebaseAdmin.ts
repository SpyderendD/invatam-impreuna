import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_PRIVATE_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK a fost inițializat.');
    } catch (e: any) {
      console.error('❌ EROARE la inițializarea Firebase Admin (JSON invalid):', e.message);
    }
  } else {
    console.warn('⚠️ AVERTISMENT: FIREBASE_PRIVATE_KEY lipsește. API-urile admin nu vor funcționa.');
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;