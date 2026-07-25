import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/data/tools';
import { COMPARE_PAIRS, getComparePairBySlug } from '@/data/compare-pages';
import {
  compareGenerateMetadataSync,
  ComparePageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import CompareClient from './CompareClient';

const LOCALE: SeoLocale = 'zh';

export function generateStaticParams() {
  return COMPARE_PAIRS.map((p) => ({ 'compare-slug': p.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'compare-slug': string }>;
}): Promise<Metadata> {
  const { 'compare-slug': compareSlug } = await params;
  const pair = getComparePairBySlug(compareSlug);
  if (!pair) {
    return {
      title: 'Compare Tools - Korelyy',
      description: 'Compare free online tools on Korelyy.',
    };
  }
  const tools = pair.toolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
  return compareGenerateMetadataSync({
    locale: LOCALE,
    tools,
    canonical: `/compare/${compareSlug}/`,
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ 'compare-slug': string }>;
}) {
  const { 'compare-slug': compareSlug } = await params;
  const pair = getComparePairBySlug(compareSlug);
  if (!pair) {
    notFound();
  }
  const tools = pair.toolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
  if (tools.length < 2) {
    notFound();
  }

  return (
    <>
      <ComparePageJsonLd
        locale={LOCALE}
        tools={tools}
        canonical={`/compare/${compareSlug}/`}
      />
      <CompareClient
        locale={LOCALE}
        pairSlug={compareSlug}
        toolsData={JSON.parse(JSON.stringify(tools))}
        pairData={JSON.parse(JSON.stringify(pair))}
      />
    </>
  );
}