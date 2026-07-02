import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const nextIntlMiddleware = createMiddleware({
  locales: ['en', 'zh', 'es', 'hi', 'fr', 'ar'],
  defaultLocale: 'en',
  localeDetection: false,
});

export default function middleware(request: NextRequest) {
  const isLocalhost = request.url.includes('localhost') || request.url.includes('127.0.0.1');
  
  if (!isLocalhost && (request.headers.get('x-forwarded-proto') === 'http' || request.url.startsWith('http://'))) {
    const httpsUrl = request.url.replace('http://', 'https://');
    return NextResponse.redirect(httpsUrl, 301);
  }

  const response = nextIntlMiddleware(request);
  
  const cspDirectives = [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  
  if (isLocalhost) {
    cspDirectives.push("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  } else {
    cspDirectives.push("script-src 'self' 'unsafe-inline'");
    cspDirectives.push("upgrade-insecure-requests");
    cspDirectives.push("block-all-mixed-content");
  }
  
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), accelerometer=(), gyroscope=(), magnetometer=(), usb=()');
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
  if (!isLocalhost) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  }
  
  return response;
}

export const config = {
  matcher: ['/', '/(en|zh|es|hi|fr|ar)/:path*'],
};