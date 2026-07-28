import type { Metadata } from 'next';
import {
  blogPostGenerateMetadata,
  BlogPostJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllBlogSlugs } from '@/data/blog';
import { getBlogPostIndexBySlug } from '@/data/blog-index';
import { TOP_BLOG_SLUGS } from '@/lib/topSlugs';
import BlogPostView from '@/components/BlogPostView';

const LOCALE: SeoLocale = 'en';
const USE_STATIC_EXPORT = process.env.USE_STATIC_EXPORT === 'true' || process.env.USE_STATIC_EXPORT === '1';

export function generateStaticParams() {
  const list = USE_STATIC_EXPORT ? getAllBlogSlugs() : TOP_BLOG_SLUGS;
  return list.map((slug) => ({ slug }));
}

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return blogPostGenerateMetadata(LOCALE, params.slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const idx = getBlogPostIndexBySlug(params.slug);
  const title = idx?.title?.[LOCALE] || 'Korelyy Blog';
  return (
    <>
      <BlogPostJsonLd locale={LOCALE} slug={params.slug} />
      <BlogPostView locale={LOCALE} slug={params.slug} title={title} />
    </>
  );
}
