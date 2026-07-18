'use client';
import { useEffect } from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ImageCompressor from '@/components/ImageCompressor';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import { categories } from '@/data/categories';

import { useParams, usePathname } from 'next/navigation';
const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathSlug = (() => {
    const m = pathname.match(/\/tool\/([^/]+)/);
    return m ? m[1] : undefined;
  })();
const pathLocale = (() => {
  const lm = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const rawLocale = (lm && lm[1]) ? lm[1] : ''; return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'en');
})();
const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;
  const t = useTranslations('tool');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');
  const tool = getToolBySlug((resolvedParams?.slug ?? pathSlug) as string);
  const __toolsT = useTranslations('tools');
  const __i18nSlug = (resolvedParams?.slug ?? pathSlug) as string;
  const __i18nName = (() => {
    const fb = tool?.name ?? '';
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = tool?.description ?? '';
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.description')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.description') : null)
      ?? fb;
  })();

  const toolsT = useTranslations('tools');
  const isZhLocal = resolvedLocale === 'zh';
  const translatedToolName = tool
    ? isZhLocal
      ? tool.name
      : (() => {
          try {
            const t = toolsT(`${tool.id}.name`);
            if (t && t !== `${tool.id}.name`) return t;
          } catch {}
          return tool.name;
        })()
    : undefined;
  const translatedToolDesc = tool
    ? isZhLocal
      ? tool.description
      : (() => {
          try {
            const t = toolsT(`${tool.id}.description`);
            if (t && t !== `${tool.id}.description`) return t;
          } catch {}
          return tool.description;
        })()
    : undefined;
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const { addToHistory } = usePreferencesStore();
  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
      document.title = translatedToolName ? `${translatedToolName} - Korelyy Tools` : `Korelyy Tools`;
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', translatedToolDesc || (tool ? tool.description : ''));
    }
  }, [tool]);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-wrap items-center gap-1.5 text-xs sm:text-sm mb-6'>
        <a href={`/${resolvedLocale}`} className='flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[28px]'>
          <Home className='h-4 w-4' />
          <span>{breadcrumbT('home')}</span>
        </a>
        {tool && (() => {
          const cat = categories.find((c) => c.id === tool.category);
          if (!cat) return null;
          return (
            <>
              <ChevronRight className='h-3.5 w-3.5 text-gray-400 shrink-0' />
              <a
                href={`/${resolvedLocale}?category=${cat.id}`}
                className='text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[180px]'
              >
                {sidebarT(cat.id)}
              </a>
            </>
          );
        })()}
        {tool && (
          <>
            <ChevronRight className='h-3.5 w-3.5 text-gray-400 shrink-0' />
            <span className='font-medium text-gray-900 dark:text-gray-100 truncate max-w-[260px]'>{__i18nName}</span>
          </>
        )}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <aside className='lg:col-span-2 hidden lg:block'>
          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('related')}</h3>
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} locale={resolvedLocale} />
            ))}
          </div>
        </aside>
        <main className='lg:col-span-7'>
          <ImageCompressor locale={resolvedLocale} />
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              Upload images, select compression mode and output format, then click compress. All processing happens locally in your browser - files are never uploaded to servers.
            </p>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                100% Local Processing
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                Compress to exact KB size
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                Batch compression support
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                JPG/PNG/WebP output
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                Before/After comparison
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                EXIF metadata removal
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
