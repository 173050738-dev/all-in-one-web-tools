'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Locale = 'en' | 'zh' | 'es' | 'fr' | 'hi' | 'ar';
const SUPPORTED: Locale[] = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];
const DEFAULT_LOCALE: Locale = 'en';

type Dict = {
  dir: 'ltr' | 'rtl';
  h1: string;
  h2: string;
  desc: string;
  home: string;
  back: string;
  blog: string;
  homeHref: string;
  blogHref: string;
};

const I18N: Record<Locale, Dict> = {
  en: {
    dir: 'ltr',
    h1: '404',
    h2: 'This page could not be found.',
    desc: 'The page you are looking for does not exist or has been moved. Try searching for tools or go back home.',
    home: 'Back to Home',
    back: 'Go Back',
    blog: 'Browse Blog',
    homeHref: '/en',
    blogHref: '/en/blog',
  },
  zh: {
    dir: 'ltr',
    h1: '404',
    h2: '抱歉，页面未找到',
    desc: '您访问的页面不存在或已被移动。尝试搜索工具或返回首页继续浏览。',
    home: '返回首页',
    back: '返回上一页',
    blog: '浏览博客',
    homeHref: '/zh',
    blogHref: '/zh/blog',
  },
  es: {
    dir: 'ltr',
    h1: '404',
    h2: 'Página No Encontrada',
    desc: 'La página que buscas no existe o ha sido movida. Intenta buscar herramientas o vuelve a la página principal.',
    home: 'Volver al Inicio',
    back: 'Atrás',
    blog: 'Ver Blog',
    homeHref: '/es',
    blogHref: '/es/blog',
  },
  fr: {
    dir: 'ltr',
    h1: '404',
    h2: "Page Introuvable",
    desc: "La page que vous recherchez n'existe pas ou a été déplacée. Essayez de rechercher des outils ou retournez à l'accueil.",
    home: "Retour à l'Accueil",
    back: 'Retour',
    blog: 'Voir le Blog',
    homeHref: '/fr',
    blogHref: '/fr/blog',
  },
  hi: {
    dir: 'ltr',
    h1: '404',
    h2: 'पेज नहीं मिला',
    desc: 'जिस पेज की आप तलाश कर रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है। टूल खोजने का प्रयास करें या होमपेज पर वापस जाएं।',
    home: 'होमपेज पर वापस जाएं',
    back: 'वापस जाएं',
    blog: 'ब्लॉग देखें',
    homeHref: '/hi',
    blogHref: '/hi/blog',
  },
  ar: {
    dir: 'rtl',
    h1: '404',
    h2: 'الصفحة غير موجودة',
    desc: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. حاول البحث عن أدوات أو عد إلى الصفحة الرئيسية.',
    home: 'العودة للرئيسية',
    back: 'العودة للسابق',
    blog: 'تصفح المدونة',
    homeHref: '/ar',
    blogHref: '/ar/blog',
  },
};

function detectLocaleFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  if (first && (SUPPORTED as string[]).includes(first)) return first as Locale;
  return DEFAULT_LOCALE;
}

export default function RootLocaleAwareNotFound() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPathname(window.location.pathname);
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const locale = useMemo<Locale>(() => detectLocaleFromPath(pathname), [pathname]);
  const t = I18N[locale];

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4 py-12 sm:py-16"
      dir={t.dir}
    >
      <div className="text-center max-w-lg w-full">
        <div className="mb-6 sm:mb-8">
          <p className="text-7xl sm:text-9xl font-black text-primary-500 dark:text-primary-400 leading-none select-none">
            {t.h1}
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
          {t.h2}
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
          {t.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={t.homeHref}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md touch-manipulation"
          >
            <Home className="w-4 h-4" />
            {t.home}
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>

          <Link
            href={t.blogHref}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          >
            <Search className="w-4 h-4" />
            {t.blog}
          </Link>
        </div>
      </div>
    </div>
  );
}
