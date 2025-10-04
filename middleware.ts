// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

// Lista paginilor care necesită autentificare
const PROTECTED_PAGES = ['/dashboard', '/profil', '/setari'];

// Lista paginilor de autentificare
const AUTH_PAGES = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = !!req.cookies.get('session')?.value;

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // 1. Dacă NU ești logat și încerci să accesezi o pagină protejată
  if (!hasSession && isProtectedPage) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Dacă ești logat și încerci să accesezi o pagină de login/register
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. În TOATE celelalte cazuri (ex: ești pe /contact, /, etc.), te lăsăm în pace
  return NextResponse.next();
}

export const config = {
  // Rulează pe toate rutele, cu excepția celor de sistem (api, _next, fișiere)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};