import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'] as const;
export type MiddlewareLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE_FALLBACK: MiddlewareLocale = 'en';

function detectLocaleFromRequest(request: NextRequest): MiddlewareLocale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as MiddlewareLocale | undefined;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLang = request.headers.get('accept-language') || '';
  if (!acceptLang) return DEFAULT_LOCALE_FALLBACK;

  try {
    const parts = acceptLang.split(',').map((chunk) => {
      const [raw, qRaw] = chunk.trim().split(';') as [string, string?];
      const q = qRaw ? parseFloat(qRaw.replace(/^q=/, '')) : 1;
      return { tag: raw.toLowerCase().trim(), q: isNaN(q) ? 1 : q };
    }).filter((p) => p.tag && p.q > 0).sort((a, b) => b.q - a.q);

    for (const { tag } of parts) {
      if (tag === 'zh' || tag.startsWith('zh-') || tag.startsWith('zh_')) {
        return 'zh';
      }
    }

    for (const { tag } of parts) {
      const short = tag.split(/[-_]/)[0];
      if ((SUPPORTED_LOCALES as readonly string[]).includes(short) && short !== 'zh') {
        return short as MiddlewareLocale;
      }
    }
  } catch {
    /* ignore parse error, fall through */
  }
  return DEFAULT_LOCALE_FALLBACK;
}

const intlMiddleware = createMiddleware({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE_FALLBACK,
  localeDetection: false,
  localePrefix: 'always'
});

function isVerificationBot(ua: string | null): boolean {
  if (!ua) return false;
  const low = ua.toLowerCase();
  return low.includes('impact') || low.includes('verification') || low.includes('validator') || low.includes('site-verification') || low.includes('siteverification');
}

export default function middleware(request: NextRequest) {
  const url = new URL(request.url);

  if (/\/{2,}/.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    return NextResponse.redirect(url, 301);
  }

  if (
    url.pathname === '/ByteDanceVerify.html' ||
    url.pathname === '/ByteDanceVerify' ||
    url.pathname.startsWith('/ByteDanceVerify')
  ) {
    return NextResponse.next();
  }

  if (url.pathname === '/' || url.pathname === '') {
    const ua = request.headers.get('user-agent') || '';
    if (isVerificationBot(ua)) {
      const rewriteUrl = new URL('/en/', url.origin);
      rewriteUrl.search = url.search;
      return NextResponse.rewrite(rewriteUrl.toString());
    }
    const detected = detectLocaleFromRequest(request);
    const targetUrl = new URL(`/${detected}/`, url.origin);
    targetUrl.search = url.search;
    const response = NextResponse.redirect(targetUrl.toString(), 307);
    response.cookies.set('NEXT_LOCALE', detected, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
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
        "img-src 'self' data: blob: https: http: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com; " +
        "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; " +
        "connect-src 'self' ws: wss: http: https: data: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://www.googleadservices.com; " +
        "worker-src 'self' blob:; " +
        "manifest-src 'self'; " +
        "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com; " +
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
        "img-src 'self' data: blob: https: http: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoices.google.com https://www.googleadservices.com; " +
        "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; " +
        "connect-src 'self' ws: wss: https: data: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://www.googleadservices.com; " +
        "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://www.googleadservices.com; " +
        "worker-src 'self' blob:; " +
        "manifest-src 'self'; " +
        "upgrade-insecure-requests; " +
        "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://fundingchoices.google.com; " +
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
