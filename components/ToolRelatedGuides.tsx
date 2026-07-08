'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import type { SeoLocale } from '@/components/seo';
import { getBlogPostsByToolSlug } from '@/data/blog';
import { getLocalizedText, getBlogReadingTime } from '@/data/blog';

interface Props {
  toolSlug: string;
  locale: SeoLocale;
}

export default function ToolRelatedGuides({ toolSlug, locale }: Props) {
  const posts = useMemo(() => getBlogPostsByToolSlug(toolSlug), [toolSlug]);
  const heading = useMemo(() => {
    switch (locale) {
      case 'zh':
        return '📚 相关指南 & 模板';
      case 'hi':
        return '📚 संबंधित गाइड और टेम्पलेट';
      case 'es':
        return '📚 Guías y plantillas relacionadas';
      case 'fr':
        return '📚 Guides et modèles associés';
      case 'ar':
        return '📚 أدلة وقوالب ذات صلة';
      default:
        return '📚 Related Guides & Templates';
    }
  }, [locale]);
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby="tool-related-guides-title"
      className="w-full mt-10 sm:mt-12"
    >
      <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5">
        <h2
          id="tool-related-guides-title"
          className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          {heading}
        </h2>
        <Link
          href={`/${locale}/blog/`}
          className="text-[13px] sm:text-[14px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
          prefetch={false}
        >
          <span className="hidden sm:inline">View all guides →</span>
          <span className="sm:hidden">All →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {posts.map((post) => {
          const title = getLocalizedText(post.title, locale, post.slug);
          const desc = getLocalizedText(post.description, locale, '');
          const readMin = getBlogReadingTime(post, locale);
          const href = `/${locale}/blog/${post.slug}/`;
          const tags = post.tags
            .map((t) => getLocalizedText(t, locale, ''))
            .filter(Boolean)
            .slice(0, 2);
          return (
            <article
              key={post.slug}
              className="group relative rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 p-4 sm:p-5 hover:border-indigo-200/80 dark:hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-black/20 transition-all"
            >
              <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400 mb-2">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(
                    locale === 'zh' ? 'zh-CN' : locale === 'hi' ? 'hi-IN' : locale,
                    { year: 'numeric', month: 'short', day: 'numeric' },
                  )}
                </time>
                <span aria-hidden="true">·</span>
                <span>{readMin} min</span>
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <Link
                  href={href}
                  prefetch={false}
                  className="stretched-link focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
                >
                  {title}
                </Link>
              </h3>
              {desc && (
                <p className="mt-2 text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 leading-6 line-clamp-2">
                  {desc}
                </p>
              )}
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] rounded-full px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/70 dark:border-gray-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
