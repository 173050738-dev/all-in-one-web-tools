'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';

import { useParams, usePathname } from 'next/navigation';
import PdfToolbox from '@/components/PdfToolbox';
const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
export default function PdfMergerPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathSlug = (() => {
    const m = pathname.match(/\/tool\/([^/]+)/);
    return m ? m[1] : undefined;
  })();
const pathLocale = (() => {
  const lm = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const rawLocale = (lm && lm[1]) ? lm[1] : ''; return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'zh');
})();
const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;
  const t = useTranslations('tool');
  const tool = getToolBySlug((resolvedParams?.slug ?? pathSlug) as string);
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const { addToHistory } = usePreferencesStore();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex items-center gap-4 mb-6'>
        <a href={`/${resolvedLocale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600'>
          <ArrowLeft className='h-5 w-5' />
          {t('back')}
        </a>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <aside className='lg:col-span-2 hidden lg:block'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('related')}</h3>
          {relatedTools.map((t) => <ToolCard key={t.id} tool={t} locale={resolvedLocale} />)}
        </aside>
        <main className='lg:col-span-7'>
          <PdfToolbox locale={resolvedLocale} />
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('features')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
