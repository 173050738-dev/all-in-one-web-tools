'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { saveLocale, SupportedLocale, SUPPORTED_LOCALES } from './language-detection';

/**
 * 客户端无刷新语言切换 Hook
 * 使用 Next.js 的 router.push 实现无刷新切换
 * 切换后立即写入 localStorage
 */
export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = useCallback((newLocale: SupportedLocale) => {
    // 保存到 localStorage
    saveLocale(newLocale);

    // 解析当前路径，替换语言前缀
    const segments = pathname.split('/').filter(Boolean);
    
    // 如果当前路径有语言前缀，替换它
    if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)) {
      const newPath = '/' + newLocale + (segments.length > 1 ? '/' + segments.slice(1).join('/') : '');
      router.push(newPath);
    } else {
      // 如果没有语言前缀，添加新的语言前缀
      router.push('/' + newLocale + (pathname !== '/' ? pathname : ''));
    }
  }, [router, pathname]);

  return { switchLocale };
}