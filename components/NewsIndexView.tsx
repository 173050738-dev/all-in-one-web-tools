'use client';

import type { SeoLocale } from '@/components/seo';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Home, ChevronRight, Newspaper, Sparkles, Search, Tag, Archive } from 'lucide-react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { NEWS_ISSUES, getNewsIssuesList, formatIssueDate } from '@/data/news';

export default function NewsIndexView({ locale }: { locale: SeoLocale }) {
  const t = useTranslations('news');
  const br = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');

  const issues = useMemo(() => getNewsIssuesList(locale), [locale]);

  const featuredIssue = issues[0];
  const restIssues = issues.slice(1);

  const totalItems = issues.reduce((sum, i) => sum + i.items.length, 0);

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const issue of issues) {
      for (const tg of issue.tags) {
        const k = tg[locale] || tg.en || '';
        if (!k) continue;
        map.set(k, (map.get(k) || 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [issues, locale]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs">
          <li>
            <a
              href={`/${locale}`}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[24px]"
            >
              <Home className="h-3 w-3" />
              <span>{br('home')}</span>
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" />
          </li>
          <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100">
            {t('breadcrumb-news')}
          </li>
        </ol>
      </nav>

      <section className="rounded-3xl bg-gradient-to-br from-primary-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-primary-100 dark:border-gray-700 p-5 sm:p-7 lg:p-9 mb-6 sm:mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-cyan-200/30 dark:from-primary-900/20 dark:to-cyan-900/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-700 dark:text-primary-300 mb-3">
            <Newspaper className="h-3 w-3" />
            {t('eyebrow')}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight tracking-tight">
            {t('hero-title')}
          </h1>
          <p className="text-sm sm:text-base lg:text-[15px] leading-relaxed text-gray-600 dark:text-gray-300 mb-5 max-w-2xl">
            {t('hero-description')}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-1.5">
              <Archive className="h-4 w-4 text-primary-500" />
              <span>{issues.length} {t('issues-label')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span>{totalItems} {t('items-label')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Search className="h-4 w-4 text-emerald-500" />
              <span>{t('avg-readtime')} {issues.reduce((s, i) => s + (i.readingMinutes?.[locale as SeoLocale] || i.readingMinutes?.en || 3), 0) / issues.length | 0} {t('minutes')}</span>
            </div>
          </div>
          <div className="max-w-md">
            <NewsletterSubscribe variant="inline" />
          </div>
        </div>
      </section>

      {featuredIssue && (
        <section className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
              <Sparkles className="h-4 w-4 text-primary-500" />
              {t('latest-issue')}
            </h2>
            <Link
              href={`/${locale}/news/${featuredIssue.slug}`}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1"
            >
              {t('read-latest')}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <NewsCard issue={featuredIssue} locale={locale} featured />
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          {restIssues.length > 0 && (
            <section>
              <h2 className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                <Archive className="h-4 w-4 text-gray-500" />
                {t('archive-title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {restIssues.map((issue) => (
                  <NewsCard key={issue.slug} issue={issue} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 space-y-5">
          <div className="card-base rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary-500" />
              {t('sidebar-tags-title')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(([tag, count]) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-default"
                >
                  {tag}
                  <span className="text-[9px] text-gray-400 dark:text-gray-500">×{count}</span>
                </span>
              ))}
            </div>
          </div>

          <NewsletterSubscribe variant="card" />

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              {t('sidebar-rules-title')}
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              {[
                t('sidebar-rules-1'),
                t('sidebar-rules-2'),
                t('sidebar-rules-3'),
                t('sidebar-rules-4'),
              ].map((rule, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#34A89C]/10 text-[#34A89C] dark:bg-[#34A89C]/20 flex items-center justify-center text-[9px] font-bold leading-none">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t('sidebar-blog-title')}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {t('sidebar-blog-desc')}
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors min-h-[36px]"
            >
              {sidebarT('blog') || 'Blog'}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
