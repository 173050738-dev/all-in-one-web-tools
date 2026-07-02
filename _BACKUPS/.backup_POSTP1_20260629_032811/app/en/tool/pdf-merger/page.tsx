'use client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Upload, FileText, Download, Home, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import { categories } from '@/data/categories';

import { useParams, usePathname } from 'next/navigation';
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
  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
      document.title = `${tool.name} - Korelyy Tools`;
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', tool.description);
    }
  }, [tool]);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} - Korelyy Tools`;
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', tool.description);
    }
  }, [tool]);

  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles([...files, ...newFiles]);
  };

  if (!tool) {
    return <div className='max-w-4xl mx-auto px-4 py-8'>Tool not found.</div>;
  }

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
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                <FileText className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{tool.name}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{tool.description}</p>
              </div>
            </div>
            <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-12 text-center'>
              <Upload className='h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4' />
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>Drag and drop PDF files here</p>
              <input type='file' accept='application/pdf' multiple onChange={handleFileUpload} className='hidden' id='pdf-upload' />
              <label htmlFor='pdf-upload' className='btn-primary cursor-pointer'>
                Select PDF Files
              </label>
            </div>
            {files.length > 0 && (
              <div className='mt-4 sm:mt-6 space-y-2'>
                {files.map((file, index) => (
                  <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                    <FileText className='h-5 w-5 text-gray-500' />
                    <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>{file.name}</span>
                    <span className='text-xs text-gray-500 dark:text-gray-500 flex-shrink-0'>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
                <button className='mt-4 btn-primary w-full'>
                  <Download className='h-4 w-4' />
                  Merge PDFs
                </button>
              </div>
            )}
          </div>
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>Select multiple PDF files and merge them into a single document.</p>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                Multi-file support
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                Drag and drop
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}