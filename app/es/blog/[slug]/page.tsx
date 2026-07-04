import type { Metadata } from 'next';
import {
  blogPostGenerateMetadata,
  BlogPostJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllBlogSlugs } from '@/data/blog';
import BlogPostView from '@/components/BlogPostView';

const LOCALE: SeoLocale = 'es';

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return blogPostGenerateMetadata(LOCALE, params.slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <BlogPostJsonLd locale={LOCALE} slug={params.slug} />
      <BlogPostView locale={LOCALE} slug={params.slug} />
    </>
  );
}
