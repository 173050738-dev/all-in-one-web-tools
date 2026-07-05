import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  newsIssueGenerateMetadata,
  NewsIssueJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllNewsSlugs, getNewsIssueBySlug } from '@/data/news';
import NewsPostView from '@/components/NewsPostView';

const LOCALE: SeoLocale = 'fr';

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return newsIssueGenerateMetadata(LOCALE, params.slug);
}

export default function NewsIssuePage({ params }: { params: { slug: string } }) {
  const issue = getNewsIssueBySlug(params.slug);
  if (!issue) {
    notFound();
  }
  return (
    <>
      <NewsIssueJsonLd locale={LOCALE} slug={params.slug} />
      <NewsPostView locale={LOCALE} slug={params.slug} />
    </>
  );
}
