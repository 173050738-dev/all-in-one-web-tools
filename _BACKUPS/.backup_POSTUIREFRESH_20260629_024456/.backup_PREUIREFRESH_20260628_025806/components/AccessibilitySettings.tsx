'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Accessibility, X, Contrast, Type } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';

interface AccessibilitySettingsProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySettings({ locale, isOpen, onClose }: AccessibilitySettingsProps) {
  const t = useTranslations('accessibility');
  const { elderMode, highContrast, toggleElderMode, toggleHighContrast } = usePreferencesStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div 
        ref={panelRef}
        className="fixed top-20 left-3 right-3 sm:left-auto sm:right-4 lg:right-8 w-auto sm:w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 transform opacity-100 translate-x-0 max-h-[70vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                {locale === 'zh' ? '无障碍设置' : 'Accessibility'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'zh' ? '优化您的浏览体验' : 'Optimize your browsing experience'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Elder Mode */}
          <div 
            className={`p-3 rounded-xl border-2 transition-colors cursor-pointer ${
              elderMode 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={toggleElderMode}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                elderMode ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Type className={`w-4 h-4 ${elderMode ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                  {locale === 'zh' ? '老年友好模式' : 'Elder-Friendly Mode'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '放大字体，简化界面' 
                    : 'Larger fonts, simplified'}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                elderMode 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {elderMode && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div 
            className={`p-3 rounded-xl border-2 transition-colors cursor-pointer ${
              highContrast 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={toggleHighContrast}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                highContrast ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Contrast className={`w-4 h-4 ${highContrast ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                  {locale === 'zh' ? '高对比度模式' : 'High Contrast Mode'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '增强文字与背景对比度' 
                    : 'Enhanced text contrast'}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                highContrast 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {highContrast && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            {highContrast && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <div className="flex justify-center gap-1">
                  <span className="w-5 h-5 rounded bg-white border border-gray-400"></span>
                  <span className="w-5 h-5 rounded bg-black"></span>
                  <span className="w-5 h-5 rounded bg-yellow-400 border border-black"></span>
                  <span className="w-5 h-5 rounded bg-blue-600"></span>
                  <span className="w-5 h-5 rounded bg-red-600"></span>
                </div>
              </div>
            )}
          </div>

          {/* Keyboard shortcut hint */}
          <div className="pt-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {locale === 'zh' 
                ? '提示：在辅助功能设置中也可以切换这些模式'
                : 'Tip: You can also toggle these modes in accessibility settings'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
