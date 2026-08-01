'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import IdPhotoBgChanger from '@/components/IdPhotoBgChanger';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';
import { usePreferencesStore } from '@/stores/preferences';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const SLUG = 'id-photo-bg-changer';

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

  const { addToHistory } = usePreferencesStore();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/data/tools');
        if (cancelled) return;
        const found = (mod.getToolBySlug || (() => undefined))(SLUG);
        if (found) addToHistory(found.id);
      } catch (e) {
      }
    })();
    return () => { cancelled = true; };
  }, [addToHistory]);

  return (
    <ToolDetailWrapper locale={resolvedLocale} slug={SLUG}>
      <IdPhotoBgChanger locale={resolvedLocale} />
    </ToolDetailWrapper>
  );
}
