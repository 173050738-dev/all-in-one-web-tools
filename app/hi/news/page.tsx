import type { Metadata } from 'next';
import {
  newsIndexGenerateMetadata,
  NewsIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import NewsIndexView from '@/components/NewsIndexView';

const LOCALE: SeoLocale = 'hi';

export async function generateMetadata(): Promise<Metadata> {
  return newsIndexGenerateMetadata(LOCALE);
}

export default function NewsIndexPage() {
  return (
    <>
      <NewsIndexJsonLd locale={LOCALE} />
      <NewsIndexView locale={LOCALE} />
    </>
  );
}
