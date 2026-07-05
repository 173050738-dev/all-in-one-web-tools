import type { SeoLocale } from '@/components/seo';
import Link from 'next/link';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import {
  NEWS_ISSUES,
  type NewsIssue,
  getLocalizedText,
  formatIssueDate,
} from '@/data/news';

interface NewsCardProps {
  issue: NewsIssue;
  locale: SeoLocale;
  featured?: boolean;
}

export default function NewsCard({ issue, locale, featured = false }: NewsCardProps) {
  const title = getLocalizedText(issue.title, locale);
  const subtitle = getLocalizedText(issue.subtitle, locale);
  const dateStr = formatIssueDate(issue.publishedAt, locale);
  const tags = issue.tags.slice(0, 3).map(t => getLocalizedText(t, locale)).filter(Boolean);
  const itemCount = issue.items.length;
  const readingMin = issue.readingMinutes?.[locale as SeoLocale] || issue.readingMinutes?.en || 3;

  if (featured) {
    return (
      <Link
        href={`/${locale}/news/${issue.slug}`}
        className="group block w-full rounded-3xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-white to-primary-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-5 sm:p-7 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-black/10 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="flex items-start justify-between sm:hidden mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-700 dark:text-primary-300">
              Issue #{issue.issueNo}
            </span>
            <span className="text-2xl" aria-hidden>{issue.coverEmoji}</span>
          </div>
          <div className="shrink-0 hidden sm:flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-primary-900/30 dark:to-cyan-900/30 text-4xl lg:text-5xl shadow-inner">
            {issue.coverEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-700 dark:text-primary-300">
                Issue #{issue.issueNo.toString().padStart(3, '0')}
              </span>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingMin} min
                </span>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{dateStr}</div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
              {subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/50 text-[10px] font-medium text-gray-600 dark:text-gray-400"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-900/20 text-[10px] font-medium text-cyan-700 dark:text-cyan-400">
                  {itemCount} items
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                阅读全文
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/news/${issue.slug}`}
      className="group card-base block w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 text-2xl border border-gray-100 dark:border-gray-700/50">
          {issue.coverEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[9px] font-bold uppercase tracking-[0.08em] text-gray-600 dark:text-gray-300">
              #{issue.issueNo.toString().padStart(3, '0')}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{dateStr}</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
      <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
        {subtitle}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingMin} min
          </span>
          <span>{itemCount} items</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-1.5 transition-all">
          <span>阅读</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export { NEWS_ISSUES };
