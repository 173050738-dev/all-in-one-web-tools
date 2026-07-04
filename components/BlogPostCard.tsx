'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import type { SeoLocale } from '@/components/seo';
import type { BlogPost } from '@/data/blog';
import { getLocalizedText, getBlogReadingTime } from '@/data/blog';

interface Props {
  post: BlogPost;
  locale: SeoLocale;
  layout?: 'card' | 'compact';
}

export default function BlogPostCard({ post, locale, layout = 'card' }: Props) {
  const title = getLocalizedText(post.title, locale, post.slug);
  const description = getLocalizedText(post.description, locale, '');
  const readMin = getBlogReadingTime(post, locale);
  const date = formatDate(post.publishedAt, locale);
  const tags = post.tags.map((t) => getLocalizedText(t, locale, '')).filter(Boolean);
  const href = `/${locale}/blog/${post.slug}/`;

  const i18n = useMemo(() => {
    switch (locale) {
      case 'zh':
        return { read: '阅读文章', minute: (n: number) => `${n} 分钟阅读` };
      case 'hi':
        return { read: 'लेख पढ़ें', minute: (n: number) => `${n} मिनट पढ़ने का समय` };
      case 'es':
        return { read: 'Leer artículo', minute: (n: number) => `${n} min de lectura` };
      case 'fr':
        return { read: 'Lire l\'article', minute: (n: number) => `${n} min de lecture` };
      case 'ar':
        return { read: 'اقرأ المقالة', minute: (n: number) => `${n} دقيقة قراءة` };
      default:
        return { read: 'Read article', minute: (n: number) => `${n} min read` };
    }
  }, [locale]);

  if (layout === 'compact') {
    return (
      <article className="group relative w-full rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2">
          <time dateTime={post.publishedAt}>{date}</time>
          <span aria-hidden="true">·</span>
          <span>{i18n.minute(readMin)}</span>
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Link href={href} prefetch={false} className="stretched-link focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md">
            {title}
          </Link>
        </h3>
        {description && (
          <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </article>
    );
  }

  return (
    <article className="group relative w-full h-full overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all flex flex-col">
      <Link href={href} prefetch={false} className="block focus:outline-none flex-1 flex flex-col h-full">
        <div className="p-3.5 sm:p-4 lg:p-5 flex-1 flex flex-col min-h-0">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 flex-shrink-0">
            <time
              dateTime={post.publishedAt}
              className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {date}
            </time>
            <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">
              ·
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
              {i18n.minute(readMin)}
            </span>
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="ml-0.5 text-[10px] sm:text-[11px] font-medium rounded-full px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100/70 dark:border-indigo-900/60"
              >
                {t}
              </span>
            ))}
          </div>

          <h2 className="text-xs sm:text-sm lg:text-sm font-bold text-gray-900 dark:text-white tracking-tight leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h2>

          {description && (
            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
              {description}
            </p>
          )}

          <div className="mt-auto pt-3 sm:pt-4 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
            {i18n.read}
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function formatDate(iso: string, locale: SeoLocale): string {
  try {
    const d = new Date(iso);
    const intl = new Intl.DateTimeFormat(
      locale === 'zh' ? 'zh-CN' : locale === 'hi' ? 'hi-IN' : locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' },
    );
    return intl.format(d);
  } catch {
    return iso.slice(0, 10);
  }
}
