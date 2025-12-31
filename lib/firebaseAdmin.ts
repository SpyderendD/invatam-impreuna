import admin from 'firebase-admin';

function formatPrivateKey(key: string) {
  // Această funcție e critică. Vercel transformă uneori \n în \\n.
  // Aici le transformăm înapoi în newline-uri reale.
  return key.replace(/\\n/g, '\n');
}

export function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 1. Încercăm să citim variabilele separate (metoda clasică)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formatPrivateKey(privateKey),
        }),
      });
    } catch (error) {
      console.error('❌ Eroare la inițializarea Firebase din variabile separate:', error);
    }
  }

  // 2. Fallback: Încercăm JSON-ul mare (dacă variabilele separate nu merg)
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      if (serviceAccount.private_key) {
         serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
      }
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
       console.error('❌ Eroare la inițializarea Firebase din JSON:', error);
    }
  }
  
  console.warn('⚠️ Nu am reușit să inițializez Firebase Admin. Verifică variabilele de mediu.');
  return null;
}