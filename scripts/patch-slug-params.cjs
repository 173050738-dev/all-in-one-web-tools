const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'es', 'fr', 'ar', 'hi'];
const ROOT = 'd:/projects/工具独立站/app';

const blogTemplate = (locale) => `import type { Metadata } from 'next';
import {
  blogPostGenerateMetadata,
  BlogPostJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllBlogSlugs } from '@/data/blog';
import BlogPostView from '@/components/BlogPostView';

const LOCALE: SeoLocale = '${locale}';

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
`;

const newsTemplate = (locale) => `import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  newsIssueGenerateMetadata,
  NewsIssueJsonLd,
  type SeoLocale,
} from '@/components/seo';
import { getAllNewsSlugs, getNewsIssueBySlug } from '@/data/news';
import NewsPostView from '@/components/NewsPostView';

const LOCALE: SeoLocale = '${locale}';

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
`;

let ok = 0, fail = 0;
for (const l of LOCALES) {
  const blogFile = path.join(ROOT, l, 'blog', '[slug]', 'page.tsx');
  const newsFile = path.join(ROOT, l, 'news', '[slug]', 'page.tsx');
  try {
    fs.writeFileSync(blogFile, blogTemplate(l), 'utf8');
    console.log(`[OK] blog  ${l.padEnd(3)} -> ${blogFile}`);
    ok++;
  } catch (e) {
    console.log(`[FAIL] blog ${l.padEnd(3)} ${e.message}`);
    fail++;
  }
  try {
    fs.writeFileSync(newsFile, newsTemplate(l), 'utf8');
    console.log(`[OK] news  ${l.padEnd(3)} -> ${newsFile}`);
    ok++;
  } catch (e) {
    console.log(`[FAIL] news ${l.padEnd(3)} ${e.message}`);
    fail++;
  }
}
console.log(`\nDone: ok=${ok}, fail=${fail}`);
