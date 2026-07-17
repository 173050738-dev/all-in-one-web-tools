const fs = require('fs');
const path = require('path');

const pageTemplate = `import type { Metadata } from 'next';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = '__LOCALE__';
const SLUG = '__SLUG__';

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
}
`;

const clientTemplate = `'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import PromptGeneratorTool from '@/components/PromptGeneratorTool';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';
import { getToolBySlug } from '@/data/tools';
import { usePreferencesStore } from '@/stores/preferences';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const SLUG = '__SLUG__';

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
      <PromptGeneratorTool locale={resolvedLocale} defaultModel='__MODEL__' />
    </ToolDetailWrapper>
  );
}
`;

const tools = [
  { slug: 'ai-prompt-generator', model: 'universal-image' },
  { slug: 'sora-prompt-generator', model: 'sora' },
  { slug: 'midjourney-prompt-generator', model: 'midjourney' },
  { slug: 'video-prompt-generator', model: 'universal-video' },
];

const locales = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

let created = 0;
for (const tool of tools) {
  for (const locale of locales) {
    const dir = path.join(__dirname, '..', 'app', locale, 'tool', tool.slug);
    fs.mkdirSync(dir, { recursive: true });

    const pageContent = pageTemplate
      .replace(/__LOCALE__/g, locale)
      .replace(/__SLUG__/g, tool.slug);

    const clientContent = clientTemplate
      .replace(/__SLUG__/g, tool.slug)
      .replace(/__MODEL__/g, tool.model);

    fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf8');
    fs.writeFileSync(path.join(dir, 'client.tsx'), clientContent, 'utf8');
    created += 2;
    console.log(`Created: app/${locale}/tool/${tool.slug}/page.tsx + client.tsx`);
  }
}

console.log(`\nDone: ${created} files created`);
