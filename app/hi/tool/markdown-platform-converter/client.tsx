'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import MarkdownPlatformConverter from '@/components/MarkdownPlatformConverter';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';
import { getToolBySlug } from '@/data/tools';
import { usePreferencesStore } from '@/stores/preferences';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const SLUG = 'markdown-platform-converter';

export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathLocale = (() => {
    const lm = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const rawLocale = lm && lm[1] ? lm[1] : '';
    return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'hi');
  })();
  const resolvedLocale =
    resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)
      ? resolvedParams.locale
      : pathLocale;

  const tool = getToolBySlug(SLUG);
  // ===== Korelyy: i18n for tool name/description (auto-injected) =====
  const __toolsT = useTranslations('tools');
  const __i18nSlug = (resolvedParams?.slug ?? SLUG) as string;
  const __i18nName = (() => {
    const fb = !tool ? '' : (resolvedLocale === 'zh' ? (tool.name ?? '') : (((tool as any).nameEn ?? '') || (tool.name ?? '')));
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = !tool ? '' : (resolvedLocale === 'zh' ? (tool.description ?? '') : (((tool as any).descriptionEn ?? '') || (tool.description ?? '')));
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.description')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.description') : null)
      ?? fb;
  })();

  const { addToHistory } = usePreferencesStore();  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
    }
  }, [tool, addToHistory]);

  return (
    <ToolDetailWrapper locale={resolvedLocale} slug={SLUG}>
      <MarkdownPlatformConverter locale={resolvedLocale} />
    </ToolDetailWrapper>
  );
}
