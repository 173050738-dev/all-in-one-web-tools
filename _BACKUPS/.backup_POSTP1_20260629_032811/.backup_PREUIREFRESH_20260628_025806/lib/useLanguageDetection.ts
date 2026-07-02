'use client';

import { useEffect, useState } from 'react';
import { SupportedLocale, getEffectiveLocale, switchLocale, SUPPORTED_LOCALES } from './language-detection';

/**
 * 语言检测 Hook
 * - 优先读取 localStorage 中的用户手动选择
 * - 无记录则自动识别浏览器首选语言
 * - 识别失败默认回退为英文
 */
export function useLanguageDetection() {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 初始化语言检测
    const detectedLocale = getEffectiveLocale();
    setLocale(detectedLocale);
    setIsInitialized(true);

    // 监听语言切换事件
    const handleLocaleChange = (e: CustomEvent<{ locale: SupportedLocale }>) => {
      setLocale(e.detail.locale);
    };

    window.addEventListener('localechange', handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener('localechange', handleLocaleChange as EventListener);
    };
  }, []);

  return {
    locale,
    isInitialized,
    switchLocale,
    supportedLocales: SUPPORTED_LOCALES,
  };
}

/**
 * 语言切换函数（用于手动切换）
 */
export function useLocaleSwitch() {
  const [, setLocale] = useState<SupportedLocale>('en');

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    switchLocale(newLocale);
    setLocale(newLocale);
  };

  return handleLocaleChange;
}
