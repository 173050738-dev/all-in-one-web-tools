'use client';

import { Home, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { getToolBySlug, getRelatedTools, ToolMeta } from '@/data/tools';
import { categories } from '@/data/categories';
import ToolCard from '@/components/ToolCard';
import { englishTags } from '@/data/english-tags';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full max-w-[300px] min-h-[250px] rounded-xl border border-transparent"
    />
  ),
});

type ToolDetailWrapperProps = {
  locale: string;
  slug: string;
  /** 工具主体 UI（密码生成器 / PDF 合并 / ... 具体组件） */
  children: ReactNode;
};

export default function ToolDetailWrapper({ locale, slug, children }: ToolDetailWrapperProps) {
  const t = useTranslations('tool');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');
  const toolsT = useTranslations('tools');

  const tool: ToolMeta | undefined = getToolBySlug(slug);
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const category = tool ? categories.find((c) => c.id === tool.category) : undefined;

  const toolName = locale === 'zh'
    ? tool?.name
    : tool && englishTags[tool.id]
      ? toolsT(`${tool.id}.name`)
      : tool?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* ===== Breadcrumb ===== */}
      <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
          <li>
            <a
              href={`/${locale}`}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[28px]"
            >
              <Home className="h-4 w-4" />
              <span>{breadcrumbT('home')}</span>
            </a>
          </li>
          {category && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              </li>
              <li>
                <a
                  href={`/${locale}?category=${category.id}`}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[180px]"
                >
                  {sidebarT(category.id)}
                </a>
              </li>
            </>
          )}
          {tool && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              </li>
              <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[260px]">
                {toolName}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* ===== Main + Sidebar (2-col on desktop) ===== */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* 左：工具主体 */}
        <section className="flex-1 min-w-0" aria-label="Tool workspace">
          {children}
        </section>

        {/* 右：侧栏广告 + 相关工具（移动端移到底部） */}
        <aside
          aria-label="Related tools & sponsorships"
          className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 space-y-5"
        >
          {/* ===== Ad Slot 2/3: Tool Detail Rectangle 300×250 ===== */}
          <div className="lg:sticky lg:top-24 space-y-5">
            <AdSlot
              slot={`tool-${slug}-rectangle`}
              size="rectangle"
              closable
              showPlaceholder
            />

            {/* 相关工具 */}
            {relatedTools.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  {t('related')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3">
                  {relatedTools.slice(0, lgSidebarMaxRelated(relatedTools.length)).map((rt) => (
                    <ToolCard key={rt.id} tool={rt} locale={locale} size="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function lgSidebarMaxRelated(len: number): number {
  return Math.min(len, 3);
}
