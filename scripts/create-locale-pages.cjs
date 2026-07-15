const fs = require('fs');
const path = require('path');

const locales = ['fr', 'es', 'ar'];
const tools = ['task-breakdown', 'tone-changer', 'focus-timer', 'concept-explain', 'idea-to-action', 'time-estimator'];

const components = {
  'task-breakdown': 'TaskBreakdown',
  'tone-changer': 'ToneChanger',
  'focus-timer': 'FocusTimer',
  'concept-explain': 'ConceptExplainer',
  'idea-to-action': 'IdeaToAction',
  'time-estimator': 'TimeEstimator'
};

locales.forEach(locale => {
  tools.forEach(tool => {
    const dir = path.join(__dirname, '..', 'app', locale, 'tool', tool);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const pageContent = `import type { Metadata } from 'next';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = '${locale}';
const SLUG = '${tool}';

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
    
    const clientContent = `'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import ${components[tool]} from '@/components/${components[tool]}';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';
import { getToolBySlug } from '@/data/tools';
import { usePreferencesStore } from '@/stores/preferences';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const SLUG = '${tool}';

export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathLocale = (() => {
    const lm = pathname.match(/^\\/([a-z]{2})(\\/|$)/);
    const rawLocale = lm && lm[1] ? lm[1] : '';
    return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || '${locale}');
  })();
  const resolvedLocale =
    resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)
      ? resolvedParams.locale
      : pathLocale;

  const tool = getToolBySlug(SLUG);
  const __toolsT = useTranslations('tools');
  const __i18nSlug = (resolvedParams?.slug ?? SLUG) as string;
  const __i18nName = (() => {
    const fb = tool?.name ?? '';
    if (resolvedLocale === '${locale}' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = tool?.description ?? '';
    if (resolvedLocale === '${locale}' || !tool) return fb;
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
      <${components[tool]} locale={resolvedLocale} />
    </ToolDetailWrapper>
  );
}
`;
    
    fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf8');
    fs.writeFileSync(path.join(dir, 'client.tsx'), clientContent, 'utf8');
  });
});

console.log('Created all missing locale pages for French, Spanish, and Arabic');
