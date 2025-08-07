// app/api/quiz/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin, { adminDb } from '@/lib/firebaseAdmin'; // Importăm uneltele de server

/**
 * Această funcție gestionează cererile POST către /api/quiz.
 * Rolul ei este să salveze rezultatul unui quiz pentru utilizatorul logat
 * și să actualizeze progresul general la materia respectivă.
 */
export async function POST(request: Request) {
  try {
    // 1. Verificăm dacă utilizatorul este autentificat
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      // Dacă nu are cookie, nu este autorizat
      return NextResponse.json({ error: 'Neautorizat. Te rugăm să te autentifici.' }, { status: 401 });
    }

    // Verificăm dacă cookie-ul este valid și obținem ID-ul utilizatorului
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;
    
    // 2. Extragem datele trimise de la pagina de quiz
    const { quizId, subjectId, score } = await request.json();

    // Verificăm dacă am primit toate datele necesare
    if (!quizId || !subjectId || score === undefined) {
      return NextResponse.json({ error: 'Date incomplete. Lipsesc quizId, subjectId sau score.' }, { status: 400 });
    }

    // 3. Salvăm rezultatul specific al quiz-ului în Firestore
    // Referința către documentul utilizatorului din colecția 'quizResults'
    const resultsRef = adminDb.collection('quizResults').doc(userId);
    await resultsRef.set({
      // Folosim [quizId] pentru a crea un câmp cu numele ID-ului quiz-ului (ex: 'substantivulQuiz')
      [quizId]: { 
        score: score, 
        completedAt: new Date().toISOString(), // Salvăm și data la care a fost completat
      }
    }, { merge: true }); // 'merge: true' asigură că nu ștergem rezultatele altor quiz-uri

    // 4. Actualizăm progresul general la materie
    const progressRef = adminDb.collection('userProgress').doc(userId);
    const progressDoc = await progressRef.get();
    
    // Obținem progresul curent (sau 0 dacă nu există)
    const currentProgress = progressDoc.data()?.[subjectId]?.progress || 0;
    
    // Calculăm cât progres să adăugăm (recompensăm mai mult pentru un scor bun)
    const progressToAdd = score >= 70 ? 15 : 5;
    const newProgress = Math.min(currentProgress + progressToAdd, 100); // Ne asigurăm că nu depășim 100

    // Salvăm noul progres în Firestore
    await progressRef.set({
      [subjectId]: {
        progress: newProgress,
        lastLesson: `Quiz: ${quizId.replace('Quiz', '')}` // Actualizăm cu o descriere relevantă
      }
    }, { merge: true });

    // 5. Returnăm un răspuns de succes
    return NextResponse.json({ success: true, message: 'Rezultat salvat și progres actualizat.' }, { status: 200 });

  } catch (error) {
    // Gestionăm orice eroare neașteptată
    console.error('Eroare la API-ul /api/quiz:', error);
    return NextResponse.json({ error: 'A apărut o eroare pe server.' }, { status: 500 });
  }
}