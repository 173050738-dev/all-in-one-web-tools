import type { Metadata } from 'next';
import {
  blogIndexGenerateMetadata,
  BlogIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getBlogPostsList } from '@/data/blog-index';
import BlogIndexView from '@/components/BlogIndexView';

const LOCALE: SeoLocale = 'zh';

export async function generateMetadata(): Promise<Metadata> {
  return blogIndexGenerateMetadata(LOCALE);
}

export default function BlogIndexPage() {
  const initialPosts = getBlogPostsList(LOCALE, 30);
  return (
    <>
      <BlogIndexJsonLd locale={LOCALE} />
      <BlogIndexView locale={LOCALE} initialPosts={initialPosts} />
    </>
  );
}
