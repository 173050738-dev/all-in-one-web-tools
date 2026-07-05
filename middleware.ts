import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh', 'es', 'hi', 'fr', 'ar'],
  defaultLocale: 'zh',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname === '/' || url.pathname === '') {
    const zhUrl = new URL('/zh/', url.origin);
    zhUrl.search = url.search;
    return NextResponse.redirect(zhUrl.toString(), 307);
  }

  const isLocalhost =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname.endsWith('.localhost') ||
    url.protocol === 'http:';

  if (!isLocalhost && url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url.toString(), 308);
  }

  const response = intlMiddleware(request);

  if (isLocalhost) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https: data: blob:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: blob: https: http:; " +
        "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; " +
        "connect-src 'self' ws: wss: http: https: data:; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "worker-src 'self' blob:; " +
        "manifest-src 'self'; " +
        "frame-src 'none'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none'"
    );
  } else {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https: data: blob:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: blob: https: http:; " +
        "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; " +
        "connect-src 'self' ws: wss: https: data:; " +
        "script-src 'self' 'unsafe-inline'; " +
        "worker-src 'self' blob:; " +
        "manifest-src 'self'; " +
        "upgrade-insecure-requests; " +
        "frame-src 'none'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none'"
    );
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), accelerometer=(), gyroscope=(), magnetometer=(), usb=()'
  );
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(en|zh|es|hi|fr|ar)',
    '/(en|zh|es|hi|fr|ar)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
