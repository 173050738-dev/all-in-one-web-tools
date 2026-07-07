import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';
import { tools, getToolBySlug } from '@/data/tools';
import { TOP_TOOL_SLUGS } from '@/lib/topSlugs';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';

const LOCALE: SeoLocale = 'zh';
const USE_STATIC_EXPORT = process.env.USE_STATIC_EXPORT === 'true' || process.env.USE_STATIC_EXPORT === '1';

export function generateStaticParams() {
  const list = USE_STATIC_EXPORT ? tools.map(t => t.slug) : TOP_TOOL_SLUGS;
  return list.map(slug => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    return toolGenerateMetadata(LOCALE, slug);
  } catch {
    return {
      title: `${slug} - Korelyy 工具聚合平台`,
      description: `在 Korelyy 发现 ${slug}。`,
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
