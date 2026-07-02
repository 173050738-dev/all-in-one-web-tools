'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { getCookiePreferences, setCookiePreferences, hasCookieConsent } from '@/lib/cookies';

export default function CookieBanner() {
  const t = useTranslations('cookie-banner');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!hasCookieConsent()) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      advertising: true,
      consentDate: new Date().toISOString(),
    });
    setShowBanner(false);
  };

  const handleReject = () => {
    setCookiePreferences({
      necessary: true,
      analytics: false,
      advertising: false,
      consentDate: new Date().toISOString(),
    });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-3 sm:p-4 shadow-2xl'>
      <div className='max-w-7xl mx-auto px-1 sm:px-0'>
        <div className='flex flex-col gap-3 sm:gap-4'>
          <div className='flex-1'>
            <h4 className='font-semibold text-sm sm:text-base mb-1'>{t('title')}</h4>
            <p className='text-xs sm:text-sm text-gray-300 leading-relaxed'>{t('description')}</p>
          </div>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3'>
            <button
              onClick={handleReject}
              className='px-3 sm:px-4 py-2.5 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors text-sm font-medium min-h-[44px] flex items-center justify-center'
            >
              {t('reject')}
            </button>
            <button
              onClick={handleAccept}
              className='px-3 sm:px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors text-sm font-medium min-h-[44px] flex items-center justify-center'
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
