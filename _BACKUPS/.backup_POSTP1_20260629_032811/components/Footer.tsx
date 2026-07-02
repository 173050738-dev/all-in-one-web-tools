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
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6'>
          <div>
            <a href={`${basePath}/privacy`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('privacy')}</h3>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('privacy-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/disclaimer`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('disclaimer')}</h3>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('disclaimer-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/cookies`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('cookies')}</h3>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('cookies-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/contact`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('contact')}</h3>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('contact-desc')}</p>
            </a>
          </div>
          <div>
            <a href={`${basePath}/compliance`} className='block group'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>{t('compliance')}</h3>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{t('compliance-desc')}</p>
            </a>
          </div>
        </div>
        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

