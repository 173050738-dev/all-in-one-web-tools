import type { Metadata } from 'next';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';
import ToolSeoContent from '@/components/ToolSeoContent';

const LOCALE: SeoLocale = 'hi';
const SLUG = 'name-constellation';

export async function generateMetadata(): Promise<Metadata> {
  return toolGenerateMetadata(LOCALE, SLUG);
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