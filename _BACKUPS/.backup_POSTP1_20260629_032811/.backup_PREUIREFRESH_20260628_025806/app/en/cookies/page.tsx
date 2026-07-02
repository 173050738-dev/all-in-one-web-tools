'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, BarChart3, Target, Check } from 'lucide-react';

export default function CookieSettingsPage() {
  const t = useTranslations('cookie-settings');
  const [necessary, setNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{t('title')}</h1>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
        Customize your cookie preferences
      </p>

      <div className='space-y-4'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <div className='flex items-start gap-4'>
            <div className='p-2 rounded-lg bg-green-100 dark:bg-green-900/30'>
              <Shield className='h-5 w-5 text-green-600 dark:text-green-400' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('necessary')}</h3>
                <span className='text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
                  Always Active
                </span>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{t('necessary-desc')}</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <div className='flex items-start gap-4'>
            <div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30'>
              <BarChart3 className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('analytics')}</h3>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${analytics ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${analytics ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{t('analytics-desc')}</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <div className='flex items-start gap-4'>
            <div className='p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30'>
              <Target className='h-5 w-5 text-purple-600 dark:text-purple-400' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('advertising')}</h3>
                <button
                  onClick={() => setAdvertising(!advertising)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${advertising ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${advertising ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{t('advertising-desc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <button
          onClick={handleSave}
          className='px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2'
        >
          {saved ? (
            <>
              <Check className='h-4 w-4' />
              Saved!
            </>
          ) : (
            t('save')
          )}
        </button>
      </div>
    </div>
  );
}