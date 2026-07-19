import type { Metadata } from 'next';
import {
  blogIndexGenerateMetadata,
  BlogIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import BlogIndexView from '@/components/BlogIndexView';

const LOCALE: SeoLocale = 'hi';

export async function generateMetadata(): Promise<Metadata> {
  return blogIndexGenerateMetadata(LOCALE);
}

export default function BlogIndexPage() {
  return (
    <>
      <BlogIndexJsonLd locale={LOCALE} />
      <BlogIndexView locale={LOCALE} />
    </>
  );
}
