import { Suspense, useMemo } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import enMessages from '@/public/locales/en/translation.json';

type LocaleShellProps = {
  locale: string;
  messages: IntlMessages;
  children: React.ReactNode;
  dir?: 'ltr' | 'rtl';
};

type IntlMessages = Record<string, any>;

function deepMergeFallback(target: any, fallback: any): any {
  if (target === null || target === undefined) return fallback;
  if (
    fallback === null ||
    typeof fallback !== 'object' ||
    Array.isArray(fallback)
  ) {
    return target;
  }
  if (typeof target !== 'object' || Array.isArray(target)) {
    return target;
  }
  if (Object.keys(target).length === 0) return fallback;
  const out: any = { ...target };
  for (const k of Object.keys(fallback)) {
    const tv = out[k];
    const fv = fallback[k];
    if (
      tv !== null &&
      typeof tv === 'object' &&
      !Array.isArray(tv) &&
      fv !== null &&
      typeof fv === 'object' &&
      !Array.isArray(fv)
    ) {
      out[k] = deepMergeFallback(tv, fv);
    } else if (tv === undefined || tv === null || (typeof tv === 'object' && !Array.isArray(tv) && Object.keys(tv).length === 0)) {
      out[k] = fv;
    }
  }
  return out;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function LocaleShell({
  locale,
  messages,
  children,
  dir = 'ltr',
}: LocaleShellProps) {
  const mergedMessages = useMemo(() => {
    if (locale === 'en') return messages;
    return deepMergeFallback(messages, enMessages as any);
  }, [locale, messages]);

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col"
    >
      <NextIntlClientProvider messages={mergedMessages} locale={locale}>
        <Header locale={locale} />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
        <Footer />
        <CookieBanner />
      </NextIntlClientProvider>
    </div>
  );
}
