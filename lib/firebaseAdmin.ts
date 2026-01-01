import admin from 'firebase-admin';

// Funcție care repară cheia privată (transformă \\n în \n real)
function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function initFirebaseAdmin() {
  // 1. Dacă Firebase e deja pornit, îl folosim pe cel existent
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 2. Citim variabilele SEPARATE (așa cum le ai tu în poza)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Verificăm dacă avem tot ce ne trebuie
  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Lipsesc variabilele de mediu pentru Firebase Admin!');
    console.error('Verifică: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    return null;
  }

  try {
    // 3. Inițializăm Firebase cu variabilele tale
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formatPrivateKey(privateKey),
      }),
    });
  } catch (error) {
    console.error('❌ Eroare la inițializarea Firebase Admin:', error);
    return null;
  }
}