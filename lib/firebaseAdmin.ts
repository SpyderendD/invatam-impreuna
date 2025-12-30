import admin from 'firebase-admin';

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function initFirebaseAdmin() {
  // 1. Verificăm dacă avem deja o aplicație pornită
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // 2. Dacă nu există cheia (ex: la build time), nu crăpăm, doar returnăm null
  if (!serviceAccountKey) {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY lipsă. Firebase Admin nu a fost inițializat.');
    return null;
  }

  try {
    // 3. Încercăm să parsăm JSON-ul. Aici apărea eroarea ta!
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    if (serviceAccount.private_key) {
      serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    // 4. PRINDEM EROAREA și nu lăsăm build-ul să moară
    console.error('❌ Eroare la parsarea FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    return null; // Returnăm null ca să putem continua
  }
}