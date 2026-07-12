import type { Metadata } from 'next';
import {
  blogPostGenerateMetadata,
  BlogPostJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllBlogSlugs } from '@/data/blog';
import BlogPostView from '@/components/BlogPostView';

const LOCALE: SeoLocale = 'zh';

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return blogPostGenerateMetadata(LOCALE, slug);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <BlogPostJsonLd locale={LOCALE} slug={slug} />
      <BlogPostView locale={LOCALE} slug={slug} />
    </>
  );
}
