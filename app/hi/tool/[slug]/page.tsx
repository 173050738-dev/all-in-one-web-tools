import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';
import { getToolBySlug } from '@/data/tools';
import { TOP_TOOL_SLUGS } from '@/lib/topSlugs';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';

const LOCALE: SeoLocale = 'hi';

export function generateStaticParams() {
  return TOP_TOOL_SLUGS.map(slug => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    return toolGenerateMetadata(LOCALE, slug);
  } catch {
    return {
      title: `${slug} - Korelyy टूल्स`,
      description: `Korelyy पर ${slug} खोजें।`,
    };
  }
}

export default async function ToolDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  return (
    <>
      <ToolPageJsonLd locale={LOCALE} slug={slug} />
      <ToolFallbackClient localeParam={LOCALE} slugParam={slug} />
    </>
  );
}
