'use client';

import { Suspense, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import {
  SUPPORTED_LOCALES,
  getEffectiveLocale,
  getSavedLocale,
  type SupportedLocale,
} from '@/lib/language-detection';
import { KNOWN_LOCALES, SITE_URL, DEFAULT_LOCALE } from '@/components/seo';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[60px] sm:h-[72px]" />,
});

const FeedbackWidget = dynamic(() => import('@/components/FeedbackWidget'), { ssr: false });

const STICKY_SLOT_HEIGHT_PX = 64;

type LocaleShellProps = {
  locale: string;
  messages: IntlMessages;
  children: React.ReactNode;
  dir?: 'ltr' | 'rtl';
};

type IntlMessages = Record<string, any>;

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function parsePathLocale(pathname: string): SupportedLocale | null {
  const first = pathname.split('/').filter(Boolean)[0];
  if (!first) return null;
  return (SUPPORTED_LOCALES as string[]).includes(first)
    ? (first as SupportedLocale)
    : null;
}

export default function LocaleShell({
  locale,
  messages,
  children,
  dir = 'ltr',
}: LocaleShellProps) {
  const [stickyHeight, setStickyHeight] = useState<string>(`${STICKY_SLOT_HEIGHT_PX}px`);
  const [autoLocaleReady, setAutoLocaleReady] = useState<boolean>(false);
  const [shouldShowChildren, setShouldShowChildren] = useState<boolean>(true);

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

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setAutoLocaleReady(true);
      return;
    }

    const pathname = window.location.pathname;
    const pathLocale = parsePathLocale(pathname);

    // 已经在带语言前缀的路径下：不做任何自动跳转，直接渲染
    if (pathLocale) {
      setAutoLocaleReady(true);
      setShouldShowChildren(true);
      return;
    }

    // 根路径或无 locale 前缀的路径 → 做首访自动跳转
    setShouldShowChildren(false);

    const saved = getSavedLocale();
    const target: SupportedLocale = saved ?? getEffectiveLocale();

    // 把剩余的路径段、query、hash 全部保留
    const rest = pathname.split('/').filter(Boolean).join('/');
    const query = window.location.search;
    const hash = window.location.hash;
    const redirectUrl = `/${target}${rest ? '/' + rest : ''}${query}${hash}`;

    // 延迟 1 帧，避免 SSR 水合时浏览器显示上一帧的英文
    requestAnimationFrame(() => {
      window.location.replace(redirectUrl);
    });

    // 跳转执行后，不再切回显示 children，避免英文闪屏
    setAutoLocaleReady(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const pathname = window.location.pathname;
    const pathLocale = parsePathLocale(pathname);
    if (!pathLocale) return;

    const restPath = pathname.slice(pathLocale.length + 1) || '/';
    const normalized = restPath.startsWith('/') ? restPath : `/${restPath}`;
    const canonical = normalized.endsWith('/') ? normalized : `${normalized}/`;

    const DATA_ATTR = 'data-korelyy-hreflang';
    Array.from(document.head.querySelectorAll(`link[${DATA_ATTR}]`)).forEach((el) => el.remove());

    const createLink = (hflang: string, locale: string) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.setAttribute('hrefLang', hflang);
      link.href = `${SITE_URL}/${locale}${canonical}`;
      link.setAttribute(DATA_ATTR, '1');
      return link;
    };

    for (const l of KNOWN_LOCALES) {
      document.head.appendChild(createLink(l, l));
    }
    document.head.appendChild(createLink('x-default', DEFAULT_LOCALE));
  }, []);

  function handleStickyClose() {
    setStickyHeight('0px');
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--ad-sticky-bottom-height', '0px');
    }
  }

  if (!shouldShowChildren) {
    return (
      <div dir={dir} className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen flex flex-col">
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        timeZone="Asia/Shanghai"
        now={new Date()}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[next-intl error]', error);
          }
        }}
        formats={{
          dateTime: {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
          },
          number: {
            currency: { style: 'currency', currency: 'USD' },
          },
        }}
      >
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
        <FeedbackWidget />
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
