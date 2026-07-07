'use client';

import type { SeoLocale } from '@/components/seo';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Home, ChevronRight, ArrowLeft, Calendar, Clock, Sparkles,
  Tag, ExternalLink, BookmarkCheck, Share2, ChevronUp
} from 'lucide-react';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import NewsCard from '@/components/NewsCard';
import SafeLink from '@/components/SafeLink';
import { getToolBySlug } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { resolveToolLink } from '@/lib/toolLinks';
import {
  getNewsIssueBySlug,
  getAllNewsSlugs,
  getNewsIssuesList,
  type NewsIssue,
  type NewsItem,
  getLocalizedText,
  formatIssueDate,
} from '@/data/news';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content || typeof document === 'undefined') return;
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function NewsPostView({ locale, slug }: { locale: SeoLocale; slug: string }) {
  const t = useTranslations('news');
  const tc = useTranslations('toolcard');
  const br = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');

  const issue = useMemo<NewsIssue | undefined>(
    () => getNewsIssueBySlug(slug),
    [slug]
  );

  const [prevIssue, nextIssue] = useMemo(() => {
    if (!issue) return [undefined, undefined];
    const sorted = getNewsIssuesList(locale);
    const idx = sorted.findIndex(n => n.slug === issue.slug);
    return [sorted[idx + 1], sorted[idx - 1]];
  }, [issue, locale]);

  const relatedTools = useMemo(() => {
    if (!issue) return [];
    const seen = new Set<string>();
    const result: ReturnType<typeof getToolBySlug>[] = [];
    for (const item of issue.items) {
      if (!item.relatedToolSlugs) continue;
      for (const s of item.relatedToolSlugs) {
        if (seen.has(s)) continue;
        seen.add(s);
        const t2 = getToolBySlug(s);
        if (t2) result.push(t2);
      }
    }
    return result.slice(0, 4);
  }, [issue]);

  const editorPick = useMemo(() => {
    if (!issue || !issue.editorPick) return undefined;
    return issue.items.find(i => i.id === issue.editorPick);
  }, [issue]);

  useEffect(() => {
    if (!issue || typeof document === 'undefined') return;
    const title = getLocalizedText(issue.title, locale);
    const desc = getLocalizedText(issue.description, locale);
    const fullTitle = `${title} - Korelyy ${t('breadcrumb-news')}`;
    document.title = fullTitle;
    const canonical = `${window.location.origin}${window.location.pathname}`;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:site_name', 'Korelyy News');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'article:published_time', issue.publishedAt);
    setMeta('name', 'article:section', 'News');
    setMeta('property', 'og:url', canonical);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, [issue, locale, t]);

  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); } catch { /* noop */ }
  }, [slug]);

  const handleShare = async () => {
    if (!issue) return;
    const title = getLocalizedText(issue.title, locale);
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title, text: getLocalizedText(issue.subtitle, locale), url });
        return;
      }
    } catch { /* user cancel */ }
    try {
      await navigator.clipboard.writeText(url);
    } catch { /* noop */ }
  };

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('notfound-title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('notfound-desc')}
        </p>
        <Link
          href={`/${locale}/news`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors min-h-[48px]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back-to-list')}
        </Link>
      </div>
    );
  }

  const title = getLocalizedText(issue.title, locale);
  const subtitle = getLocalizedText(issue.subtitle, locale);
  const dateStr = formatIssueDate(issue.publishedAt, locale);
  const readingMin = issue.readingMinutes?.[locale as SeoLocale] || issue.readingMinutes?.en || 3;
  const tags = issue.tags.map(tg => getLocalizedText(tg, locale)).filter(Boolean);

  const renderItem = (item: NewsItem, idx: number) => {
    const cat = getLocalizedText(item.category, locale);
    const itemTitle = getLocalizedText(item.title, locale);
    const summary = getLocalizedText(item.summary, locale);
    const src = item.source ? getLocalizedText(item.source, locale) : '';
    const isEditorPick = issue.editorPick === item.id;

    return (
      <article
        key={item.id}
        id={`item-${idx + 1}`}
        className={`scroll-mt-24 rounded-2xl border ${isEditorPick ? 'border-[#34A89C]/30 bg-[#34A89C]/[0.03] dark:bg-[#34A89C]/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'} p-4 sm:p-5 lg:p-6 relative overflow-hidden`}
      >
        {isEditorPick && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#34A89C] text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-2.5 w-2.5" />
            {t('editor-pick')}
          </div>
        )}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <div className="shrink-0 hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-xl border border-gray-200 dark:border-gray-700">
            {item.emoji || '📰'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/20 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-700 dark:text-primary-300">
                {item.emoji && <span className="sm:hidden mr-0.5 text-sm">{item.emoji}</span>}
                {cat}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                #{String(idx + 1).padStart(2, '0')}
              </span>
              {src && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  · {src}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2">
              {itemTitle}
            </h3>
          </div>
        </div>
        <p className="text-[13px] sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
          {summary}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex flex-wrap items-center gap-2">
            {item.relatedToolSlugs && item.relatedToolSlugs.length > 0 && item.relatedToolSlugs.slice(0, 3).map(ts => {
              const tool = getToolBySlug(ts);
              if (!tool) return null;
              const link = resolveToolLink(tool.slug || tool.id, locale);
              return (
                <Link
                  key={ts}
                  href={link.url}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-[10px] font-medium text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <BookmarkCheck className="h-2.5 w-2.5" />
                  {tool.name}
                </Link>
              );
            })}
          </div>
          {item.sourceUrl && (
            <SafeLink
              href={item.sourceUrl}
              locale={locale}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('source-link')}
              <ExternalLink className="h-3 w-3" />
            </SafeLink>
          )}
        </div>
      </article>
    );
  };

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
          <li aria-hidden="true"><ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" /></li>
          <li>
            <a
              href={`/${locale}/news`}
              className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('breadcrumb-news')}
            </a>
          </li>
          <li aria-hidden="true"><ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" /></li>
          <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[260px]">
            #{issue.issueNo.toString().padStart(3, '0')}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <article className="flex-1 min-w-0">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('back-to-list')}
          </Link>

          <header className="rounded-3xl bg-gradient-to-br from-primary-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-primary-100 dark:border-gray-700 p-5 sm:p-7 lg:p-9 mb-5 sm:mb-7 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-cyan-200/30 dark:from-primary-900/20 dark:to-cyan-900/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-600 text-white text-[10px] font-bold uppercase tracking-[0.08em] shadow-sm">
                  Issue #{issue.issueNo.toString().padStart(3, '0')}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                  <span className="text-sm" aria-hidden>{issue.coverEmoji}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight tracking-tight mb-3">
                {title}
              </h1>
              <p className="text-sm sm:text-base lg:text-[15px] leading-relaxed text-gray-600 dark:text-gray-300 mb-5 max-w-2xl">
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateStr}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readingMin} {t('minutes')}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#34A89C]" />
                  {issue.items.length} {t('items-label')}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-colors min-h-[28px]"
                >
                  <Share2 className="h-3 w-3" />
                  {t('share')}
                </button>
              </div>
            </div>
          </header>

          {editorPick && (
            <div className="mb-5 sm:mb-6 rounded-2xl border-2 border-[#34A89C]/40 dark:border-[#34A89C]/30 bg-[#34A89C]/[0.03] dark:bg-[#34A89C]/5 p-4 sm:p-5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#34A89C]/10 text-[#34A89C] text-[10px] font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="h-3 w-3" />
                {t('editor-pick-full')}
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                {getLocalizedText(editorPick.title, locale)}
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
            {issue.items.map((item, idx) => renderItem(item, idx))}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 p-5 mb-8 sm:mb-10">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary-500" />
              {t('pager-nav-title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prevIssue ? (
                <Link
                  href={`/${locale}/news/${prevIssue.slug}`}
                  className="group p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors min-h-[68px]"
                >
                  <div className="text-[10px] text-gray-400 mb-1 inline-flex items-center gap-1">
                    <ArrowLeft className="h-2.5 w-2.5" />
                    {t('pager-prev')}
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {getLocalizedText(prevIssue.title, locale)}
                  </div>
                </Link>
              ) : <div className="hidden sm:block" />}
              {nextIssue ? (
                <Link
                  href={`/${locale}/news/${nextIssue.slug}`}
                  className="group p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors text-right min-h-[68px]"
                >
                  <div className="text-[10px] text-gray-400 mb-1 inline-flex items-center gap-1">
                    {t('pager-next')}
                    <ChevronRight className="h-2.5 w-2.5" />
                  </div>
                  <div className="text-xs sm:text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {getLocalizedText(nextIssue.title, locale)}
                  </div>
                </Link>
              ) : <div className="hidden sm:block" />}
            </div>
          </div>

          <div className="mb-8">
            <NewsletterSubscribe variant="banner" />
          </div>
        </article>

        <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 space-y-5 lg:sticky lg:top-4 self-start">
          {tags.length > 0 && (
            <div className="card-base rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary-500" />
                {t('post-tags-title')}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tg) => (
                  <span
                    key={tg}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 text-[11px] font-medium text-gray-600 dark:text-gray-300"
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {relatedTools.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 inline-flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-cyan-500" />
                {t('post-related-tools')}
              </h2>
              <div className="space-y-3">
                {relatedTools.map((rt) => rt ? (
                  <ToolCard key={rt.id} tool={rt} locale={locale} />
                ) : null)}
              </div>
            </div>
          )}

          <NewsletterSubscribe variant="card" />

          <Link
            href={`/${locale}/blog`}
            className="block rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 p-5 hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('sidebar-blog-title')}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {t('sidebar-blog-desc')}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
              {sidebarT('blog') || 'Blog'}
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:hidden sticky bottom-3 z-40 px-4 py-2.5 rounded-xl bg-gray-900/90 dark:bg-gray-100/90 backdrop-blur text-white dark:text-gray-900 text-xs font-semibold shadow-lg flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <ChevronUp className="h-4 w-4" />
            {t('back-to-top')}
          </button>
        </aside>
      </div>
    </div>
  );
}
