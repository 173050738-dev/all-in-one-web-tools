const fs = require('fs');
const path = require('path');

const SLUG = 'ai-copywriter';
const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];

LOCALES.forEach((locale) => {
  const pageDir = path.join(__dirname, '..', 'app', locale, 'tool', SLUG);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const pageContent = `import type { Metadata } from 'next';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = '${locale}';
const SLUG = '${SLUG}';

export async function generateMetadata(): Promise<Metadata> {
  return toolGenerateMetadata(LOCALE, SLUG);
}

export default function ToolDetailPage() {
  return (
    <>
      <ToolPageJsonLd locale={LOCALE} slug={SLUG} />
      <ClientPage />
    </>
  );
}`;

  const clientContent = `'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import AiCopywriterTool from '@/components/AiCopywriterTool';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';
import { getToolBySlug } from '@/data/tools';
import { usePreferencesStore } from '@/stores/preferences';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const SLUG = '${SLUG}';

export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathLocale = (() => {
    const lm = pathname.match(/^\\/([a-z]{2})(\\/|$)/);
    const rawLocale = lm && lm[1] ? lm[1] : '';
    return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'en');
  })();
  const resolvedLocale =
    resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)
      ? resolvedParams.locale
      : pathLocale;

  const tool = getToolBySlug(SLUG);
  const __toolsT = useTranslations('tools');
  const __i18nSlug = (resolvedParams?.slug ?? SLUG) as string;
  const __i18nName = (() => {
    const fb = tool?.nameEn ?? tool?.name ?? '';
    if (resolvedLocale === 'en' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = tool?.descriptionEn ?? tool?.description ?? '';
    if (resolvedLocale === 'en' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.description')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.description') : null)
      ?? fb;
  })();

  const { addToHistory } = usePreferencesStore();
  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
    }
  }, [tool, addToHistory]);

  return (
    <ToolDetailWrapper locale={resolvedLocale} slug={SLUG}>
      <AiCopywriterTool locale={resolvedLocale} />
    </ToolDetailWrapper>
  );
}`;

  fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent, 'utf8');
  fs.writeFileSync(path.join(pageDir, 'client.tsx'), clientContent, 'utf8');
  console.log(`Created ${locale} pages`);
});

console.log('All locale pages created');
