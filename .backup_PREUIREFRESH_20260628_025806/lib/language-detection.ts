/**
 * 语言检测和自动切换工具
 * 功能：
 * 1. 自动检测浏览器语言
 * 2. 优先读取 localStorage 中用户手动选择的语言
 * 3. 无记录则自动识别浏览器首选语言
 * 4. 识别失败默认回退为英文
 * 5. 语言切换后自动保存到 localStorage
 */

export type SupportedLocale = 'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

// 语言显示名称
export const LOCALE_NAMES: Record<SupportedLocale, { code: string; name: string; native: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr' },
  zh: { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', dir: 'ltr' },
  es: { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
  hi: { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  fr: { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
};

// localStorage key
const LOCALE_STORAGE_KEY = 'tool-station-locale';

/**
 * 获取浏览器首选语言
 */
export function getBrowserLanguage(): SupportedLocale {
  if (typeof navigator === 'undefined') return 'en';
  
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const lowerLang = browserLang.toLowerCase();
  
  // 精确匹配
  if (SUPPORTED_LOCALES.includes(lowerLang as SupportedLocale)) {
    return lowerLang as SupportedLocale;
  }
  
  // 前缀匹配 (如 "zh-CN" 匹配 "zh")
  const prefix = lowerLang.split('-')[0];
  if (SUPPORTED_LOCALES.includes(prefix as SupportedLocale)) {
    return prefix as SupportedLocale;
  }
  
  // 西班牙语变体匹配（拉美地区）
  const spanishVariants = ['es-419', 'es-mx', 'es-ar', 'es-co', 'es-pe', 'es-cl', 'es-ve', 'es-ec'];
  if (spanishVariants.some(v => lowerLang.startsWith(v))) {
    return 'es';
  }
  
  // 法语变体匹配
  const frenchVariants = ['fr-ca', 'fr-be', 'fr-ch', 'fr-lu', 'fr-ma', 'fr-tn', 'fr-dz'];
  if (frenchVariants.some(v => lowerLang.startsWith(v))) {
    return 'fr';
  }
  
  // 阿拉伯语变体匹配
  const arabicVariants = ['ar-sa', 'ar-ae', 'ar-eg', 'ar-ma', 'ar-dz', 'ar-tn', 'ar-ly', 'ar-jo', 'ar-iq', 'ar-kw', 'ar-qa', 'ar-bh', 'ar-om', 'ar-ye', 'ar-sd', 'ar-sy', 'ar-ps'];
  if (arabicVariants.some(v => lowerLang.startsWith(v))) {
    return 'ar';
  }
  
  // 印地语变体匹配
  const hindiVariants = ['hi-in', 'hi-latn'];
  if (hindiVariants.some(v => lowerLang.startsWith(v))) {
    return 'hi';
  }
  
  // 默认回退英文
  return 'en';
}

/**
 * 从 localStorage 读取用户手动选择的语言
 */
export function getSavedLocale(): SupportedLocale | null {
  if (typeof localStorage === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.includes(saved as SupportedLocale)) {
      return saved as SupportedLocale;
    }
  } catch {
    // 忽略错误
  }
  return null;
}

/**
 * 保存用户手动选择的语言到 localStorage
 */
export function saveLocale(locale: SupportedLocale): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // 忽略错误
  }
}

/**
 * 获取最终应该使用的语言
 * 优先级：localStorage用户选择 > 浏览器语言 > 默认英文
 */
export function getEffectiveLocale(): SupportedLocale {
  // 1. 优先读取 localStorage 中的用户手动选择
  const savedLocale = getSavedLocale();
  if (savedLocale) return savedLocale;
  
  // 2. 自动识别浏览器首选语言
  return getBrowserLanguage();
}

/**
 * 切换语言（用户手动操作）
 * 会自动保存到 localStorage
 */
export function switchLocale(locale: SupportedLocale): void {
  saveLocale(locale);
  
  // 触发页面重新渲染
  if (typeof window !== 'undefined') {
    // 更新 zustand store
    const event = new CustomEvent('localechange', { detail: { locale } });
    window.dispatchEvent(event);
    
    // 触发页面跳转
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    
    // 如果当前在语言路径下，更换路径
    if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)) {
      window.location.replace(`/${locale}/${segments.slice(1).join('/')}`);
    } else {
      // 在根路径，直接替换
      window.location.replace(`/${locale}`);
    }
  }
}

/**
 * 初始化语言检测
 * 在应用启动时调用
 */
export function initLanguageDetection(): SupportedLocale {
  const effectiveLocale = getEffectiveLocale();
  return effectiveLocale;
}

/**
 * React Hook: 使用语言检测
 */
export { useLanguageDetection } from './useLanguageDetection';
