'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { SeoLocale } from '@/components/seo';
import { getBlogPostBySlug, getBlogPostsList } from '@/data/blog';
import { getLocalizedText, getBlogReadingTime } from '@/data/blog';
import BlogContentRenderer from '@/components/BlogContentRenderer';
import BlogPostCard from '@/components/BlogPostCard';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="w-full min-h-[120px] rounded-xl border border-transparent" />
  ),
});

interface Props {
  locale: SeoLocale;
  slug: string;
}

export default function BlogPostView({ locale, slug }: Props) {
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const title = getLocalizedText(post.title, locale, post.slug);
  const description = getLocalizedText(post.description, locale, '');
  const readMin = getBlogReadingTime(post, locale);
  const tags = useMemo(
    () => post.tags.map((t) => getLocalizedText(t, locale, '')).filter(Boolean),
    [post, locale],
  );
  const related = useMemo(
    () => getBlogPostsList(locale, 10).filter((p) => p.slug !== slug).slice(0, 3),
    [locale, slug],
  );
  const date = useMemo(() => {
    try {
      return new Date(post.updatedAt || post.publishedAt).toLocaleDateString(
        locale === 'zh' ? 'zh-CN' : locale === 'hi' ? 'hi-IN' : locale,
        { year: 'numeric', month: 'long', day: 'numeric' },
      );
    } catch {
      return (post.updatedAt || post.publishedAt).slice(0, 10);
    }
  }, [post, locale]);

  const i18n = useMemo(() => {
    switch (locale) {
      case 'zh':
        return {
          back: '← 返回博客列表',
          by: '作者',
          updated: '更新',
          reading: '阅读',
          share: '分享',
          related: '你可能还喜欢',
          tags: '标签',
          updatedTag: 'Updated',
          ctaTitle: '把教程里的模板拿来就用',
          ctaText: '去 Korelyy 工具箱试试 100+ 现成模板 →',
        };
      case 'hi':
        return {
          back: '← ब्लॉग लिस्ट पर वापस',
          by: 'लेखक',
          updated: 'अपडेट',
          reading: 'पढ़ने का समय',
          share: 'शेयर',
          related: 'आपको पसंद आ सकता है',
          tags: 'टैग',
          updatedTag: 'अपडेटेड',
          ctaTitle: 'ट्यूटोरियल के पैटर्न को सीधे उपयोग करें',
          ctaText: 'Korelyy टूलबॉक्स में 100+ रेडी टेम्पलेट आज़माएं →',
        };
      case 'es':
        return {
          back: '← Volver a la lista',
          by: 'Autor',
          updated: 'Actualizado',
          reading: 'Lectura',
          share: 'Compartir',
          related: 'También te puede gustar',
          tags: 'Etiquetas',
          updatedTag: 'Actualizado',
          ctaTitle: 'Usa los patrones del tutorial al instante',
          ctaText: 'Prueba 100+ plantillas listas en Korelyy →',
        };
      case 'fr':
        return {
          back: '← Retour à la liste',
          by: 'Auteur',
          updated: 'Mis à jour',
          reading: 'Lecture',
          share: 'Partager',
          related: 'Vous aimerez peut-être aussi',
          tags: 'Tags',
          updatedTag: 'Mis à jour',
          ctaTitle: 'Utilisez les modèles du tutoriel immédiatement',
          ctaText: 'Essayez 100+ gabarits prêts sur Korelyy →',
        };
      case 'ar':
        return {
          back: '← العودة للقائمة',
          by: 'الكاتب',
          updated: 'تحديث',
          reading: 'وقت القراءة',
          share: 'مشاركة',
          related: 'قد يعجبك أيضاً',
          tags: 'الوسوم',
          updatedTag: 'مُحدَّث',
          ctaTitle: 'استخدم أنماط الدرس فوراً',
          ctaText: 'جرب 100+ قالب جاهز في Korelyy →',
        };
      default:
        return {
          back: '← Back to all posts',
          by: 'By',
          updated: 'Updated',
          reading: 'Read',
          share: 'Share',
          related: 'You might also like',
          tags: 'Tags',
          updatedTag: 'Updated',
          ctaTitle: 'Put the tutorial patterns to work instantly',
          ctaText: 'Try 100+ ready templates in Korelyy Toolbox →',
        };
    }
  }, [locale]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-5">
        <Link
          href={`/${locale}/blog/`}
          className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
          prefetch={false}
        >
          {i18n.back}
        </Link>
      </div>

      <article>
        <header className="mb-6 sm:mb-8 border-b border-gray-200/70 dark:border-gray-800/70 pb-6 sm:pb-8">
          {tags.length > 0 && (
            <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] sm:text-[11px] font-medium rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100/70 dark:border-indigo-900/60"
                >
                  {t}
                </span>
              ))}
              {post.updatedAt && (
                <span className="text-[10px] sm:text-[11px] font-medium rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100/70 dark:border-emerald-900/60">
                  {i18n.updatedTag}
                </span>
              )}
            </div>
          )}

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-1 sm:mb-2">
            {title}
          </h1>

          {description && (
            <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-600 dark:text-gray-400 max-w-3xl">
              {description}
            </p>
          )}

          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400 flex items-center justify-center text-white font-bold text-[11px]"
              >
                {post.author.slice(0, 1).toUpperCase()}
              </div>
              <div className="leading-5">
                <div className="font-semibold text-gray-700 dark:text-gray-300">
                  {i18n.by} {post.author}
                </div>
                <div>
                  <time dateTime={post.updatedAt || post.publishedAt}>{date}</time>
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  <span>
                    {readMin} min {i18n.reading}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <BlogContentRenderer blocks={post.content} locale={locale} />

        <div className="not-prose mt-8 sm:mt-10">
          <AdSlot
            slot={`blog-bottom-${post.slug}-${locale}`}
            size="banner"
            showPlaceholder={true}
          />
        </div>

        {post.relatedToolSlugs && post.relatedToolSlugs.length > 0 && (
          <div className="mt-6 sm:mt-8 rounded-2xl border border-indigo-200/70 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 via-white to-white dark:from-indigo-950/60 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-5 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-2.5 sm:mb-3">
              {i18n.ctaTitle}
            </h2>
            <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {post.relatedToolSlugs.map((toolSlug) => {
                const toolLink = `/${locale}/tool/${toolSlug}/`;
                return (
                  <Link
                    key={toolSlug}
                    href={toolLink}
                    prefetch={false}
                    className="group rounded-xl bg-white dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800/80 p-3 sm:p-4 hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 capitalize text-xs sm:text-sm">
                        {toolSlug.replace(/-/g, ' ')}
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-indigo-500 transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 sm:mt-4">
              <Link
                href={`/${locale}/`}
                prefetch={false}
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {i18n.ctaText}
              </Link>
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-posts-title"
          className="mt-8 sm:mt-10"
        >
          <h2
            id="related-posts-title"
            className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-4 sm:mb-5"
          >
            {i18n.related}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {related.map((p) => (
              <BlogPostCard key={p.slug} post={p} locale={locale} layout="card" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
