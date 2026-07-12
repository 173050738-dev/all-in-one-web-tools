import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  newsIssueGenerateMetadata,
  NewsIssueJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllNewsSlugs, getNewsIssueBySlug } from '@/data/news';
import NewsPostView from '@/components/NewsPostView';

const LOCALE: SeoLocale = 'zh';

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return newsIssueGenerateMetadata(LOCALE, slug);
}

export default async function NewsIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getNewsIssueBySlug(slug);
  if (!issue) {
    notFound();
  }
  return (
    <>
      <NewsIssueJsonLd locale={LOCALE} slug={slug} />
      <NewsPostView locale={LOCALE} slug={slug} />
    </>
  );
}
