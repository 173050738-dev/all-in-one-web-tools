'use client';
import { useTranslations, useLocale } from 'next-intl';

const VALID_LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const safeLocale = VALID_LOCALES.includes(locale) ? locale : 'en';
  const basePath = `/${safeLocale}`;

  return (
    <footer className='bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-7'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-5'>
          <div>
            <a href={`${basePath}/about`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('about')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('about-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/privacy`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('privacy')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('privacy-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/disclaimer`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('disclaimer')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('disclaimer-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/cookies`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('cookies')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('cookies-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/contact`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('contact')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('contact-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/compliance`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('compliance')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('compliance-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/blog`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 text-xs sm:text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('blog')}</h3>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>{t('blog-desc')}</p>
            </a>
          </div>
        </div>
        <div className='mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-gray-200 dark:border-gray-800 text-center'>
          <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

