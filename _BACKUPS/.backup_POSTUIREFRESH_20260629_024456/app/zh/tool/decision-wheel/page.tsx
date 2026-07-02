'use client';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DecisionWheel from '@/components/DecisionWheel';

import { useParams, usePathname } from 'next/navigation';
export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug: string };
  const pathname = usePathname();
  const pathLocale = (() => {
    const m = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const rawMatch = ((m && m[1]) ? m[1] : ''); return ['zh','en','hi','fr','es','ar'].includes(rawMatch) ? rawMatch : (resolvedParams?.locale || 'zh');
  })();
  const resolvedLocale = (resolvedParams?.locale && ['zh','en','hi','fr','es','ar'].includes(pathLocale)) ? resolvedParams.locale : pathLocale;
  const t = useTranslations('tool');

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex items-center gap-4 mb-6'>
        <a href={`/${resolvedLocale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'>
          <ArrowLeft className='h-5 w-5' />
          {t('back')}
        </a>
      </div>
      <DecisionWheel locale={resolvedLocale} />
    </div>
  );
}
