import './globals.css';
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: {
    default: 'Tool Hub - Free Online Tools',
    template: '%s | Korelyy Tools',
  },
  description: 'Discover thousands of free online tools for productivity, creativity, and more.',
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://www.korelyy.com'),
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
const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

async function detectLocaleFromCookie(): Promise<string> {
  try {
    const ck = (await cookies()).get('NEXT_LOCALE');
    if (ck && KNOWN_LOCALES.includes(ck.value)) return ck.value;
  } catch {
    /* cookies() only available in server components & requests */
  }
  return 'en';
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await detectLocaleFromCookie();
  const dir: 'ltr' | 'rtl' = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
