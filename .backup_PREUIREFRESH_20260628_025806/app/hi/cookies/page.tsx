'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getCookiePreferences, setCookiePreferences } from '@/lib/cookies';
import { Shield, BarChart3, Megaphone, Info } from 'lucide-react';

export default function CookiesPage() {
  const t = useTranslations('cookie-settings');
  const [preferences, setPreferences] = useState(getCookiePreferences());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setCookiePreferences({ ...preferences, consentDate: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cookieTypes = [
    {
      key: 'necessary',
      icon: Shield,
      title: '必要Cookie',
      description: '这些Cookie对于网站的基本功能至关重要，无法关闭。它们包括会话管理、安全验证和负载均衡等功能，确保您能够正常浏览和使用网站的核心服务。',
      required: true,
    },
    {
      key: 'analytics',
      icon: BarChart3,
      title: '分析Cookie',
      description: '这些Cookie帮助我们了解您如何使用我们的网站，包括您访问的页面、停留时间和遇到的错误。收集的数据用于改进网站性能和用户体验，所有数据均以匿名形式处理。',
      required: false,
    },
    {
      key: 'advertising',
      icon: Megaphone,
      title: '广告Cookie',
      description: '这些Cookie用于向您展示更相关的广告内容，限制同一广告的展示次数，并衡量广告活动的效果。它们由我们或第三方广告合作伙伴设置，仅在您同意后激活。',
      required: false,
    },
  ];

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{t('title')}</h1>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>最后更新：2026年6月21日</p>

      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8'>
        <div className='flex items-start gap-3'>
          <Info className='h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
          <div>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              Cookie是存储在您设备上的小型文本文件，用于改善您的浏览体验。您可以在下方管理各类Cookie的偏好设置。请注意，禁用某些Cookie可能会影响网站功能。
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        {cookieTypes.map((type) => {
          const Icon = type.icon;
          const isEnabled = type.required || preferences[type.key as keyof typeof preferences];

          return (
            <div key={type.key} className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
              <div className='p-6'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-start gap-4 flex-1'>
                    <div className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{type.title}</h3>
                        {type.required && (
                          <span className='px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'>
                            始终启用
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!type.required) {
                        setPreferences({ ...preferences, [type.key]: !preferences[type.key as keyof typeof preferences] });
                        setSaved(false);
                      }
                    }}
                    disabled={type.required}
                    className={`w-12 h-7 rounded-full flex items-center transition-all duration-200 flex-shrink-0 ${
                      isEnabled
                        ? 'bg-primary-600 justify-end'
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    } ${type.required ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-90'}`}
                  >
                    <div className='w-5 h-5 bg-white rounded-full shadow-md mx-1 transition-transform duration-200' />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className='pt-4'>
          <button
            onClick={handleSave}
            className='w-full px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md active:scale-[0.98] transform duration-150'
          >
            {saved ? '偏好设置已保存' : '保存偏好设置'}
          </button>
          {saved && (
            <p className='text-center text-sm text-green-600 dark:text-green-400 mt-2'>
              您的Cookie偏好设置已成功保存并生效
            </p>
          )}
        </div>

        <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            您可以随时返回此页面更改Cookie设置。如需了解更多信息，请查看我们的
            <a href='/zh/privacy' className='text-primary-600 hover:underline'>隐私政策</a>。
          </p>
        </div>
      </div>
    </div>
  );
}