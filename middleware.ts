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
    // Adaugă aici alte pagini publice, ex: '/contact', '/termeni'
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

// Configurare: specifică rutele pe care se aplică acest middleware.
// Aceasta este configurația standard și corectă pentru a exclude asset-urile și rutele API.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};  