import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';
import { getToolBySlug } from '@/data/tools';
import { STATIC_EXPORT_TOOL_SLUGS } from '@/lib/topSlugs';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';

const LOCALE: SeoLocale = 'en';

export function generateStaticParams() {
  return STATIC_EXPORT_TOOL_SLUGS.map(slug => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const base = toolGenerateMetadata(LOCALE, slug);
    const tool = getToolBySlug(slug);
    if (tool && tool.externalUrl) {
      return { ...base, robots: { index: false, follow: true } };
    }
    return base;
  } catch {
    return {
      title: `${slug} - Korelyy Tools`,
      description: `Discover ${slug} on Korelyy.`,
    };
  }
}

export default async function ToolDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  if (tool.externalUrl) {
    notFound();
  }
  return (
    <>
      <ToolPageJsonLd locale={LOCALE} slug={slug} />
      <ToolFallbackClient localeParam={LOCALE} slugParam={slug} />
    </>
  );
}
