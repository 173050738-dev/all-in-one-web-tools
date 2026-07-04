'use client';

import { Home, ChevronRight, ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useMemo } from 'react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import { categories } from '@/data/categories';
import ToolCard from '@/components/ToolCard';
import { englishTags } from '@/data/english-tags';
import { shouldShowKofiBanner } from '@/lib/monetization';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full max-w-[300px] min-h-[250px] rounded-xl border border-transparent"
    />
  ),
});

const KofiUnlockBanner = dynamic(() => import('@/components/KofiUnlockBanner').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <>
      <div aria-hidden="true" className="w-full h-[72px] sm:h-[88px] mb-5 sm:mb-6 rounded-xl border border-transparent" />
      <div aria-hidden="true" className="w-full h-[260px] mt-8 sm:mt-10 rounded-2xl border border-transparent" />
    </>
  ),
});

const ToolRelatedGuides = dynamic(
  () => import('@/components/ToolRelatedGuides').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="w-full mt-10 sm:mt-12 h-[220px] sm:h-[240px] rounded-3xl border border-transparent"
      />
    ),
  },
);

type ToolDetailWrapperProps = {
  locale: string;
  slug: string;
  /** 工具主体 UI（密码生成器 / PDF 合并 / ... 具体组件） */
  children: ReactNode;
};

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function ToolDetailWrapper({ locale, slug, children }: ToolDetailWrapperProps) {
  const t = useTranslations('tool');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');
  const toolsT = useTranslations('tools');
  const tcT = useTranslations('toolcard');

  const tool = getToolBySlug(slug);
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const category = tool ? categories.find((c) => c.id === tool.category) : undefined;

  const showKofi = useMemo(() => shouldShowKofiBanner(slug), [slug]);

  const isZh = locale === 'zh';
  const hasEnTag = !!tool && !!englishTags[tool.id];
  function translateToolField(field: 'name' | 'description') {
    if (!tool) return undefined;
    const fallback = field === 'name' ? tool.name : tool.description;
    if (isZh) return fallback;
    const candidates: string[] = [];
    if (tool.slug) candidates.push(`${tool.slug}.${field}`);
    if (tool.id && tool.id !== tool.slug) candidates.push(`${tool.id}.${field}`);
    try {
      for (const key of candidates) {
        const v = toolsT(key);
        if (v && v !== key) return v;
      }
    } catch {
      /* fallthrough */
    }
    return fallback;
  }
  const toolName = translateToolField('name');
  const toolDescription = translateToolField('description');

  useEffect(() => {
    if (!tool) return;
    const title = toolName ? `${toolName} - Korelyy Tools` : 'Korelyy Tools';
    document.title = title;
    const desc = toolDescription || tool.description;
    const canonical = `${window.location.origin}${window.location.pathname}`;

    setMeta('name', 'description', desc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Korelyy Tools');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', canonical);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }, [tool, toolName, toolDescription]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* ===== Breadcrumb ===== */}
      <nav aria-label="Breadcrumb" className="mb-3.5 sm:mb-5">
        <ol className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs">
          <li>
            <a
              href={`/${locale}`}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[24px]"
            >
              <Home className="h-3 w-3" />
              <span>{breadcrumbT('home')}</span>
            </a>
          </li>
          {category && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" />
              </li>
              <li>
                <a
                  href={`/${locale}?category=${category.id}`}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[160px]"
                >
                  {sidebarT(category.id)}
                </a>
              </li>
            </>
          )}
          {tool && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" />
              </li>
              <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[220px]">
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
          {showKofi && <KofiUnlockBanner slug={slug} locale={locale} variant="top" />}
          {tool?.localProcessing && (
            <div
              role="note"
              className="mb-4 sm:mb-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-900/10 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs leading-relaxed text-emerald-800 dark:text-emerald-200"
            >
              {tcT('privacy-local-note')}
            </div>
          )}
          {children}
          {showKofi && <KofiUnlockBanner slug={slug} locale={locale} variant="bottom" />}
          <ToolRelatedGuides
            toolSlug={slug}
            locale={locale as any}
          />
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

            {/* ====== Advanced filter accordion (default collapsed, never on homepage) ====== */}
            <details
              className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 overflow-hidden"
              aria-label={tcT('advanced-filter')}
            >
              <summary
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).click();
                  }
                }}
                className="px-3.5 sm:px-4 py-3 text-xs font-semibold text-gray-900 dark:text-gray-100 cursor-pointer select-none list-none flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  {tcT('advanced-filter')}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-3.5 sm:px-4 pb-3.5 pt-1 space-y-2.5 border-t border-gray-100 dark:border-gray-700/60">
                <div>
                  <label htmlFor="p2-compliance" className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {tcT('compliance-level')}
                  </label>
                  <select
                    id="p2-compliance"
                    defaultValue=""
                    className="w-full min-h-[36px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-2.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-400 outline-none"
                  >
                    <option value="">{tcT('filter-all')}</option>
                    <option value="green">{tcT('compliance-green')}</option>
                    <option value="yellow">{tcT('compliance-yellow')}</option>
                    <option value="red">{tcT('compliance-red')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="p2-access" className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {tcT('access-level')}
                  </label>
                  <select
                    id="p2-access"
                    defaultValue=""
                    className="w-full min-h-[36px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-2.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-400 outline-none"
                  >
                    <option value="">{tcT('filter-all')}</option>
                    <option value="direct">{tcT('access-direct')}</option>
                    <option value="vpn-required">{tcT('access-vpn-required')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="p2-signup" className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {tcT('signup-requirement')}
                  </label>
                  <select
                    id="p2-signup"
                    defaultValue=""
                    className="w-full min-h-[36px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-2.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-400 outline-none"
                  >
                    <option value="">{tcT('filter-all')}</option>
                    <option value="no-signup">{tcT('signup-no-signup')}</option>
                    <option value="email">{tcT('signup-email')}</option>
                    <option value="global-phone">{tcT('signup-global-phone')}</option>
                    <option value="cn-phone">{tcT('signup-cn-phone')}</option>
                    <option value="cc-required">{tcT('signup-cc-required')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="p2-local" className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {tcT('privacy-heading')}
                  </label>
                  <select
                    id="p2-local"
                    defaultValue=""
                    className="w-full min-h-[36px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-2.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-400 outline-none"
                  >
                    <option value="">{tcT('filter-all')}</option>
                    <option value="1">{tcT('privacy-local-processing')}</option>
                    <option value="0">{tcT('privacy-cloud-processing')}</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="w-full min-h-[40px] rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/90 dark:hover:bg-primary-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors px-3 py-2 mt-1"
                  onClick={() => {
                    if (typeof window === 'undefined') return;
                    const params = new URLSearchParams();
                    const getVal = (id: string) => (document.getElementById(id) as HTMLSelectElement | null)?.value ?? '';
                    const c = getVal('p2-compliance');
                    const a = getVal('p2-access');
                    const s = getVal('p2-signup');
                    const lp = getVal('p2-local');
                    if (c) params.set('compliance', c);
                    if (a) params.set('access', a);
                    if (s) params.set('signup', s);
                    if (lp === '1') params.set('localProcessing', '1');
                    if (lp === '0') params.set('localProcessing', '0');
                    const qs = params.toString();
                    window.location.href = `/${locale}${qs ? `?${qs}` : ''}`;
                  }}
                >
                  <Search className="h-3.5 w-3.5" />
                  {tcT('apply-filter')}
                </button>
              </div>
            </details>
            {/* ====== End advanced filter ====== */}

            {/* 相关工具 */}
            {relatedTools.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  {t('related')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3">
                  {relatedTools.slice(0, lgSidebarMaxRelated(relatedTools.length)).map((rt) => (
                    <ToolCard key={rt.id} tool={rt} locale={locale} />
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
