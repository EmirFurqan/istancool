import { NextResponse } from 'next/server';

export function middleware(req) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl;

  // admin.domain.com ise admin'e yönlendir
  if (hostname.startsWith('admin.')) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  const token = req.cookies.get('token')?.value;

  // Giriş yapmış kullanıcıların login ve register sayfalarına erişimini engelle
  if (token && (url.pathname === '/login' || url.pathname === '/register')) {
    return NextResponse.redirect(new URL('/', url));
  }

  // Korumalı sayfalar için token kontrolü
  const protectedPaths = ['/profile', '/admin'];
  if (protectedPaths.some((path) => url.pathname.startsWith(path))) {
    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Diğerleri domain.com olarak devam eder
  return NextResponse.next();
}

// Middleware hangi yolları dinleyecek
export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
