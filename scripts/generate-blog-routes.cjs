// Generate the 12 thin blog route files:
//   6 locales × (blog/page.tsx + blog/[slug]/page.tsx)
// Run manually: node scripts/generate-blog-routes.cjs
// Runs as part of prebuild automatically.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

for (const locale of LOCALES) {
  const localeDir = path.join(ROOT, 'app', locale);
  const blogDir = path.join(localeDir, 'blog');
  const slugDir = path.join(blogDir, '[slug]');

  fs.mkdirSync(blogDir, { recursive: true });
  fs.mkdirSync(slugDir, { recursive: true });

  const indexContent = `import type { Metadata } from 'next';
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

  fs.writeFileSync(path.join(blogDir, 'page.tsx'), indexContent, 'utf-8');

  const postContent = `import type { Metadata } from 'next';
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

  fs.writeFileSync(path.join(slugDir, 'page.tsx'), postContent, 'utf-8');
  console.log(`[generate-blog-routes] OK → app/${locale}/blog/(page + [slug]/page).tsx`);
}

console.log(`[generate-blog-routes] Done. ${LOCALES.length} locales × 2 files = ${LOCALES.length * 2} files`);
