// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // --- MODELUL "WHITELIST" ---
  // Definește AICI toate paginile care NU necesită autentificare.
  // Orice altceva va fi considerat protejat.
  const publicPages = [
    '/', // Pagina de start
    '/login',
    '/register',
    '/auth/reset-password',
    '/contact',
    '/termeni'
  ];

  // Verificăm dacă pagina curentă este una publică
  // Folosim `startsWith` pentru a acoperi și sub-rute dacă e cazul
  const isPublicPage = publicPages.some(page => pathname === page || (page !== '/' && pathname.startsWith(page)));
  
  // CAZUL 1: Utilizator neautentificat încearcă să acceseze o pagină protejată
  // Dacă pagina NU este publică ȘI nu există un cookie de sesiune, îl trimitem la login.
  if (!isPublicPage && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    // Adăugăm pagina la care voia să ajungă ca parametru, pentru a-l redirecta corect după login
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CAZUL 2: Utilizator autentificat încearcă să acceseze /login sau /register
  // Dacă există un cookie de sesiune ȘI pagina este una de autentificare, îl trimitem la dashboard.
  if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Dacă niciuna din condițiile de mai sus nu e îndeplinită, permitem accesul.
  return NextResponse.next();
}

// =======================================================================
// MODIFICAREA CRITICĂ ESTE AICI
// =======================================================================
// Configurare: specifică rutele pe care se aplică acest middleware.
// Am adăugat excepții pentru fișierele PWA (sw.js, manifest.json, .png)
// pentru a nu fi blocate de logica de autentificare.
export const config = {
  matcher: [
    /*
     * Rulează pe toate rutele, CU EXCEPȚIA celor care:
     * - încep cu /api (rute API)
     * - încep cu /_next/static (fișiere statice Next.js)
     * - încep cu /_next/image (optimizări de imagine)
     * - sunt fișiere exacte: favicon.ico, sw.js, manifest.json
     * - se termină cu .png (pentru iconițele din manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|.*\\.png$).*)',
  ],
};