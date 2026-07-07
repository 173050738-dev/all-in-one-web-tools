import './globals.css';
import { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
import Script from 'next/script';
import { RootJsonLd } from '@/components/seo';

const GA_MEASUREMENT_ID = 'G-ZLZS3TZEVW';
const GA_GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const GA_INIT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`;

const ADSENSE_PUBLISHER_ID = (process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '') as string;
const ADSENSE_ENABLED = ADSENSE_PUBLISHER_ID.startsWith('ca-pub-');
const ADSENSE_SRC = ADSENSE_ENABLED
  ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`
  : '';

const SITE_URL = 'https://korelyy.com';
const OG_IMAGE = '/og-image.png';
const FAVICON = '/favicon.svg';
const OG_IMAGE_TYPE = 'image/png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Korelyy Tool Hub - 100% Free Online Tools',
    template: '%s | Korelyy Tools',
  },
  description:
    'Discover 100% free online tools for productivity, creativity, image editing, PDF processing, AI workflows and more. No signup, works on all devices. 6 languages supported.',
  keywords: [
    'free online tools',
    'productivity tools',
    'image compressor',
    'QR code generator',
    'PDF merger',
    'workflow automation',
    'AI tools',
    '在线工具',
    '免费工具',
    'Korelyy',
  ],
  authors: [{ name: 'Korelyy Team' }],
  creator: 'Korelyy',
  publisher: 'Korelyy',
  alternates: {
    canonical: '/en/',
    languages: {
      en: '/en/',
      zh: '/zh/',
      es: '/es/',
      hi: '/hi/',
      fr: '/fr/',
      ar: '/ar/',
      'x-default': '/en/',
    },
  },
  icons: {
    icon: [
      { url: FAVICON, type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: [FAVICON],
    apple: [
      { url: FAVICON, type: 'image/svg+xml', sizes: 'any' },
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180' width='180' height='180'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%235461A8'/%3E%3Cstop offset='100%25' stop-color='%232A3154'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='180' height='180' rx='36' fill='url(%23g)'/%3E%3Cg fill='%23FAF9F6' font-family='Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-weight='700'%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='92' letter-spacing='-2'%3EK%3C/text%3E%3C/g%3E%3Ccircle cx='138' cy='42' r='12' fill='%2334A89C' opacity='0.95'/%3E%3C/svg%3E",
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  },
  applicationName: 'Korelyy Tools',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Korelyy',
    startupImage: [FAVICON],
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#2A3154',
    'msapplication-tap-highlight': 'no',
    'mobile-web-app-capable': 'yes',
    ...(ADSENSE_ENABLED ? { 'google-adsense-account': ADSENSE_PUBLISHER_ID } : null),
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Korelyy Tools',
    title: 'Korelyy Tool Hub - 100% Free Online Tools',
    description:
      'Free online tools for productivity, creativity, image editing, PDF processing and AI workflows. No signup, all devices, 6 languages.',
    locale: 'en_US',
    alternateLocale: ['zh_CN', 'es_ES', 'hi_IN', 'fr_FR', 'ar_SA'],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: OG_IMAGE_TYPE,
        alt: 'Korelyy Tool Hub — Free online tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@korelyy',
    title: 'Korelyy Tool Hub - 100% Free Online Tools',
    description:
      'Free online tools for productivity, image editing, PDF processing & AI workflows. No signup, 6 languages.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  viewportFit: 'cover',
};

const RTL_LOCALES = new Set(['ar']);
const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'] as const;
type KnownLocale = (typeof KNOWN_LOCALES)[number];

function isKnownLocale(v: string | null | undefined): v is KnownLocale {
  return !!v && (KNOWN_LOCALES as readonly string[]).includes(v);
}

function pickFirstPathSegment(rawPath: string | null | undefined): KnownLocale | null {
  if (!rawPath) return null;
  const cleaned = rawPath.split('?')[0].split('#')[0];
  const first = cleaned.split('/').filter(Boolean)[0];
  return isKnownLocale(first) ? first : null;
}

async function detectLocaleFromPath(): Promise<KnownLocale | null> {
  if (typeof headers !== 'function') return null;
  try {
    const h = await headers();
    const invokePath = h.get('x-invoke-path') ?? h.get('x-next-pathname') ?? h.get(':path');
    const fromPath = pickFirstPathSegment(invokePath);
    if (fromPath) return fromPath;
    const referer = h.get('referer');
    if (referer) {
      let p: URL | null = null;
      try { p = new URL(referer); } catch { p = null; }
      if (p) {
        const fromReferer = pickFirstPathSegment(p.pathname);
        if (fromReferer) return fromReferer;
      }
    }
  } catch {
    /* headers() unavailable outside render context */
  }
  return null;
}

async function detectLocaleFromCookie(): Promise<KnownLocale | null> {
  try {
    const ck = (await cookies()).get('NEXT_LOCALE');
    return isKnownLocale(ck?.value) ? ck.value : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathLocale = await detectLocaleFromPath();
  const cookieLocale = await detectLocaleFromCookie();
  const locale: KnownLocale = pathLocale ?? cookieLocale ?? 'en';
  const dir: 'ltr' | 'rtl' = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {isProd && (
          <>
            <Script
              id="console-error-filter"
              strategy="beforeInteractive"
              suppressHydrationWarning
            >
              {`(function(){
  var ADS_HOSTS = /pagead2\\.googlesyndication\\.com|googlesyndication\\.com|adsbygoogle/i;
  function isAdsErr(msg) {
    if (!msg) return false;
    var s = typeof msg === 'string' ? msg : (msg.message || '') + ' ' + (msg.filename || '') + ' ' + (msg.stack || '');
    return ADS_HOSTS.test(s);
  }
  window.addEventListener('error', function(e) {
    if (isAdsErr(e.error) || isAdsErr(e.message) || (e.target && e.target.src && ADS_HOSTS.test(e.target.src))) {
      try { e.preventDefault(); } catch(_) {}
      try { e.stopImmediatePropagation(); } catch(_) {}
      return false;
    }
  }, true);
  window.addEventListener('unhandledrejection', function(e) {
    var r = e.reason;
    if (r && (isAdsErr(r.message) || (r.stack && ADS_HOSTS.test(r.stack)) || (typeof r === 'string' && ADS_HOSTS.test(r)))) {
      try { e.preventDefault(); } catch(_) {}
    }
  });
})();`}
            </Script>
            <Script
              strategy="afterInteractive"
              src={GA_GTAG_SRC}
              data-ga-id={GA_MEASUREMENT_ID}
              suppressHydrationWarning
            />
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: GA_INIT_SCRIPT }}
              data-ga-id={GA_MEASUREMENT_ID}
              suppressHydrationWarning
            />
            {ADSENSE_ENABLED && (
              <Script
                id="adsbygoogle-loader"
                strategy="afterInteractive"
                src={ADSENSE_SRC}
                crossOrigin="anonymous"
                data-ad-client={ADSENSE_PUBLISHER_ID}
                async
                suppressHydrationWarning
              />
            )}
          </>
        )}
        <Script
          id="sw-registrar"
          strategy="afterInteractive"
          suppressHydrationWarning
        >
          {`if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function(reg) { /* ok */ })
      .catch(function(err) { /* silent */ });
  });
}`}
        </Script>
        <RootJsonLd />
        {children}
      </body>
    </html>
  );
}
