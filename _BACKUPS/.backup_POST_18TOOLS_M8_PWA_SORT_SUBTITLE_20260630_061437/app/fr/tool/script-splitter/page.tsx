'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import ScriptSplitter from '@/components/ScriptSplitter';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';
import { getToolBySlug } from '@/data/tools';
import { usePreferencesStore } from '@/stores/preferences';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const SLUG = 'script-splitter';

export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathLocale = (() => {
    const lm = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const rawLocale = lm && lm[1] ? lm[1] : '';
    return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'zh');
  })();
  const resolvedLocale =
    resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)
      ? resolvedParams.locale
      : pathLocale;

  const tool = getToolBySlug(SLUG);
  const { addToHistory } = usePreferencesStore();

  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
      document.title = `${tool.name} - Korelyy Tools`;
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        const m = document.createElement('meta');
        m.name = 'description';
        document.head.appendChild(m);
      }
      (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.setAttribute(
        'content',
        tool.description,
      );
    }
  }, [tool, addToHistory]);

  return (
    <ToolDetailWrapper locale={resolvedLocale} slug={SLUG}>
      <ScriptSplitter locale={resolvedLocale} />
    </ToolDetailWrapper>
  );
}
