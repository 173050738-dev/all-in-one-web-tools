import type { Metadata } from 'next';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

import ToolSeoContent from '@/components/ToolSeoContent';
const LOCALE: SeoLocale = 'es';
const SLUG = 'seo-keyword-miner';

export async function generateMetadata(): Promise<Metadata> {
  const meta = await toolGenerateMetadata(LOCALE, SLUG);
  return {
    ...meta,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ToolDetailPage() {
  return (
    <>
      <ToolPageJsonLd locale={LOCALE} slug={SLUG} />
      <ClientPage />
          <ToolSeoContent locale={LOCALE} slug={SLUG} />
    </>
  );
}
