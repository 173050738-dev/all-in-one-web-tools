// Generate the thin route files for:
//   6 locales × (blog/page.tsx + blog/[slug]/page.tsx)
//   + 6 locales × (news/page.tsx + news/[slug]/page.tsx)
// Run manually: node scripts/generate-blog-routes.cjs
// Runs as part of prebuild automatically.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

for (const locale of LOCALES) {
  const localeDir = path.join(ROOT, 'app', locale);
  const blogDir = path.join(localeDir, 'blog');
  const blogSlugDir = path.join(blogDir, '[slug]');
  const newsDir = path.join(localeDir, 'news');
  const newsSlugDir = path.join(newsDir, '[slug]');

  fs.mkdirSync(blogDir, { recursive: true });
  fs.mkdirSync(blogSlugDir, { recursive: true });
  fs.mkdirSync(newsDir, { recursive: true });
  fs.mkdirSync(newsSlugDir, { recursive: true });

  const blogIndexContent = `import type { Metadata } from 'next';
import {
  blogIndexGenerateMetadata,
  BlogIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import BlogIndexView from '@/components/BlogIndexView';

const LOCALE: SeoLocale = '${locale}';

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
`;

  fs.writeFileSync(path.join(blogDir, 'page.tsx'), blogIndexContent, 'utf-8');

  const blogPostContent = `import type { Metadata } from 'next';
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
`;

  fs.writeFileSync(path.join(blogSlugDir, 'page.tsx'), blogPostContent, 'utf-8');
  console.log(`[generate-blog-routes] OK → app/${locale}/blog/(page + [slug]/page).tsx`);

  const newsIndexContent = `import type { Metadata } from 'next';
import {
  newsIndexGenerateMetadata,
  NewsIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import NewsIndexView from '@/components/NewsIndexView';

const LOCALE: SeoLocale = '${locale}';

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
`;

  fs.writeFileSync(path.join(newsDir, 'page.tsx'), newsIndexContent, 'utf-8');

  const newsSlugContent = `import type { Metadata } from 'next';
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
`;

  fs.writeFileSync(path.join(newsSlugDir, 'page.tsx'), newsSlugContent, 'utf-8');
  console.log(`[generate-blog-routes] OK → app/${locale}/news/(page + [slug]/page).tsx`);
}

console.log(`[generate-blog-routes] Done. ${LOCALES.length} locales × 4 files = ${LOCALES.length * 4} files (blog + news)`);
