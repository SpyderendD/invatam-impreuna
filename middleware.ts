import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // Lista paginilor publice
  const publicPages = [
    '/',
    '/login',
    '/register',
    '/contact',
    '/termeni',
    '/politica-confidentialitate',
    '/cookies',
    '/metode-invatare',
    '/app/sitemap.xml'
  ];

  // Verificăm dacă e pagină publică
  const isPublicPage = publicPages.some(page => pathname === page || (page !== '/' && pathname.startsWith(page)));

  // 1. Dacă userul NU e logat și vrea pagină privată -> Login
  if (!isPublicPage && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Dacă userul E logat și vrea la Login/Register -> Dashboard
  if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|workbox-.*\\.js|manifest.json|.*\\.png$).*)',
  ],
};