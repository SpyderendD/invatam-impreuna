import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. REGULĂ DE AUR: Dacă e fișier static sau sitemap, lasă-l să treacă IMEDIAT.
  // Asta rezolvă problema cu Google Search Console.
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/manifest.json' ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') || 
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

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
    '/povestea-mea',
    '/modele-teste-EN',
    "/eu",
    "/blog",
    "/materii",
    "/studiu-inteligent"

  ];

  // Verificăm dacă e pagină publică
  const isPublicPage = publicPages.some(page => pathname === page || (page !== '/' && pathname.startsWith(page)));

  // 2. Dacă userul NU e logat și vrea pagină privată -> Login
  if (!isPublicPage && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Dacă userul E logat și vrea la Login/Register -> Dashboard
  if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurare matcher (păstrăm și aici pentru performanță)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!api|_next/static|_next/image).*)',
  ],
};