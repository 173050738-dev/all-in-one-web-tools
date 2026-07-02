'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import enMessages from '@/public/locales/en/translation.json';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[60px] sm:h-[72px]" />,
});

const STICKY_SLOT_HEIGHT_PX = 64;

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

  const [stickyHeight, setStickyHeight] = useState<string>(`${STICKY_SLOT_HEIGHT_PX}px`);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const closed = (() => {
      try {
        const raw = window.localStorage.getItem('korelyy:closed-ad-slots');
        if (!raw) return false;
        return (JSON.parse(raw) as string[]).includes('global-sticky-bottom');
      } catch {
        return false;
      }
    })();
    const h = closed ? '0px' : `${STICKY_SLOT_HEIGHT_PX}px`;
    setStickyHeight(h);
    document.documentElement.style.setProperty('--ad-sticky-bottom-height', h);
  }, []);

  function handleStickyClose() {
    setStickyHeight('0px');
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--ad-sticky-bottom-height', '0px');
    }
  }

  return (
    <div dir={dir} className="min-h-screen flex flex-col">
      <NextIntlClientProvider messages={mergedMessages} locale={locale}>
        <Header locale={locale} />
        <main
          className="flex-1"
          style={{ paddingBottom: `calc(var(--ad-sticky-bottom-height, ${stickyHeight}) + 8px)` }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
        <Footer />
        <CookieBanner />
        {/* ===== Ad Slot 1/3: Mobile Sticky Bottom ===== */}
        <div className="sm:hidden" suppressHydrationWarning>
          <AdSlot
            slot="global-sticky-bottom"
            size="sticky-bottom"
            closable
            onClose={handleStickyClose}
          />
        </div>
      </NextIntlClientProvider>
    </div>
  );
}
