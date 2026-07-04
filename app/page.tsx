import { Metadata } from 'next';

const SITE_URL = 'https://korelyy.com';
const OG_IMAGE = '/og-image.png';
const OG_IMAGE_TYPE = 'image/png';
const DEFAULT_LANG = '/en/';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Korelyy Tool Hub - 100% Free Online Tools',
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
    canonical: DEFAULT_LANG,
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${DEFAULT_LANG}`,
    siteName: 'Korelyy Tools',
    title: 'Korelyy Tool Hub — 100% Free Online Tools (6 Languages)',
    description:
      'Free online tools for productivity, creativity, image editing, PDF processing and AI workflow automation. No signup required. Desktop and mobile friendly.',
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
    title: 'Korelyy Tool Hub — 100% Free Online Tools',
    description:
      'Free online tools for productivity, image editing, PDF processing & AI workflows. No signup, 6 languages, mobile friendly.',
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

export default function RootRedirectPage() {
  return (
    <>
      {/* 爬虫/社交媒体读取 meta 后跳转：meta refresh 0s + 脚本兜底 */}
      <meta httpEquiv="refresh" content={`0; url=${DEFAULT_LANG}`} />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href={`${SITE_URL}${DEFAULT_LANG}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{window.location.replace('${DEFAULT_LANG}');}catch(e){window.location.href='${DEFAULT_LANG}';}})();`,
        }}
      />
      <noscript>
        <p>
          如果你没有被自动跳转到，请点击这里：
          <a href={DEFAULT_LANG}>Continue to Korelyy Tools ({DEFAULT_LANG})</a>
        </p>
      </noscript>
    </>
  );
}
