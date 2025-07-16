// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
// Importăm admin normal, nu specific { adminAuth }
import { admin } from '@/lib/firebaseAdmin'; 

export async function POST(request: Request) {
  console.log("\n--- [SERVER] A primit o cerere pe /api/auth/login ---");

  try {
    const { idToken } = await request.json();
    console.log("[SERVER] Pasul 1: A extras idToken din cerere.");

    if (!idToken) {
      console.error("[SERVER] EROARE: idToken lipsește din body-ul cererii.");
      return NextResponse.json({ error: 'ID Token este necesar' }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 zile

    console.log("[SERVER] Pasul 2: Încearcă să creeze cookie-ul de sesiune...");
    
    // Folosim direct admin.auth() pentru a ne asigura că instanța este corectă
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    console.log("[SERVER] Pasul 3: Cookie-ul de sesiune a fost creat cu succes!");

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });
    console.log("[SERVER] Pasul 4: Cookie-ul a fost setat în răspuns. Se trimite 200 OK.");

    return response;

  } catch (error: any) {
    console.error("--- [SERVER] A APĂRUT O EROARE CRITICĂ ÎN TIMPUL PROCESĂRII ---");
    console.error("Mesaj eroare:", error.message);
    console.error("Cod eroare:", error.code);
    console.error("Stack trace:", error.stack);
    console.error("---------------------------------------------------------");
    
    // Returnăm un mesaj de eroare specific
    return NextResponse.json({ error: 'Unauthorized', details: error.message }, { status: 401 });
  }
}