// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificăm DOAR dacă cookie-ul 'session' există.
  const sessionCookie = request.cookies.get('session');

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage = pathname.startsWith('/dashboard');

  // Dacă utilizatorul este pe o pagină de autentificare și ARE deja o sesiune,
  // îl redirecționăm la dashboard.
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Dacă utilizatorul este pe o pagină protejată și NU ARE o sesiune,
  // îl redirecționăm la login.
  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // În toate celelalte cazuri, permite accesul.
  return NextResponse.next();
}

// Configurare: specifică rutele pe care se va aplica acest middleware.
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};