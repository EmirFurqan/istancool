import { NextResponse } from 'next/server';

export function middleware(req) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl;

  // admin.domain.com ise admin'e yönlendir
  if (hostname.startsWith('admin.')) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Diğerleri domain.com olarak devam eder
  return NextResponse.next();
}

// Middleware hangi yolları dinleyecek
export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
