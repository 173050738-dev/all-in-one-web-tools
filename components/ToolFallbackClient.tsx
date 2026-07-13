'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Home, ChevronRight, ExternalLink, ArrowLeft, ShieldCheck, Star, Heart, Lightbulb, ListChecks, Award, CheckCircle2, Wrench } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import { categories } from '@/data/categories';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import SafeLink from '@/components/SafeLink';
import { tagZhToEn, englishTags } from '@/data/english-tags';
import { logLike, logFavorite } from '@/utils/audit-log';
import { INTERNAL_TOOL_SLUGS } from '@/lib/toolLinks';
import ToolSeoContent from '@/components/ToolSeoContent';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full rounded-xl border border-transparent min-h-[90px] sm:min-h-[110px]"
    />
  ),
});

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

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

export default function ToolFallbackClient({ localeParam, slugParam }: { localeParam?: string; slugParam?: string }) {
  const resolvedParams = useParams() as unknown as { locale?: string; slug?: string };
  const pathname = usePathname();
  const router = useRouter();
  const pathLocaleMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const rawPathLocale = (pathLocaleMatch && pathLocaleMatch[1]) || '';
  const pathLocale = VALID_LOCALES.includes(rawPathLocale) ? rawPathLocale : 'en';
  const resolvedLocale = localeParam || (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale) ? resolvedParams.locale : pathLocale);

  const pathSlugMatch = pathname.match(/\/tool\/([^/]+)/);
  const pathSlug = pathSlugMatch ? pathSlugMatch[1] : undefined;
  const resolvedSlug = slugParam || resolvedParams?.slug || pathSlug || '';

  const isInternalTool = INTERNAL_TOOL_SLUGS.has(resolvedSlug);
  const internalToolUrl = `/${resolvedLocale}/tool/${resolvedSlug}`;

  const t = useTranslations('tool');
  const tcT = useTranslations('toolcard');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');
  const toolsT = useTranslations('tools');

  const tool = getToolBySlug(resolvedSlug);
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const category = tool ? categories.find((c) => c.id === tool.category) : undefined;

  /* 【P0 修复】 Zustand selector 订阅：
   * - 函数引用稳定（zustand useStore 下函数不会因 state 变化变引用），
   *   所以 selector 仅抽单个字段，避免 addToHistory 引起 store state 变化 →
   *   ToolFallbackClient 整组件重渲染 → 老 getToolBySlug 产生新对象引用 →
   *   useEffect deps 触发 addToHistory → 死循环 Error #185
   */
  const addToHistory = usePreferencesStore((s) => s.addToHistory);
  const toggleLike = usePreferencesStore((s) => s.toggleLike);
  const isLiked = usePreferencesStore((s) => s.isLiked);
  const toggleFavorite = usePreferencesStore((s) => s.toggleFavorite);
  const isFavorite = usePreferencesStore((s) => s.isFavorite);

  const safeTranslate = (key: string, fallback: string) => {
    try {
      const translated = toolsT(key);
      if (!translated) return fallback;
      if (translated === key) return fallback;
      if (translated.endsWith(`.${key}`)) return fallback;
      if (typeof translated === 'string' && /\.(scenario|tutorial|advantage)-\d+$/.test(translated)) return fallback;
      return translated;
    } catch {
      return fallback;
    }
  };

  const isZh = resolvedLocale === 'zh';
  const containsCjk = (s: string) => /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(s);
  const slugToTitle = (s: string) =>
    s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
  const translateToolField = (field: 'name' | 'description'): string => {
    if (!tool) return '';
    const fallback = field === 'name' ? tool.name : tool.description;
    if (isZh) return fallback;
    const slug = tool.slug || tool.id || '';
    const idAlt = tool.id && tool.id !== slug ? tool.id : '';
    const translated = safeTranslate(
      `${slug}.${field}`,
      idAlt ? safeTranslate(`${idAlt}.${field}`, fallback) : fallback
    );
    if (containsCjk(translated)) {
      if (field === 'name') return slugToTitle(slug || tool.id);
      return '';
    }
    return translated;
  };
  const toolName = translateToolField('name');
  const toolDescription = translateToolField('description');

  const translatedTags = useMemo(() => {
    if (!tool) return [];
    if (isZh) return tool.tags;
    if (Array.isArray(englishTags[tool.id]) && englishTags[tool.id].length > 0) return englishTags[tool.id];
    return tool.tags.map(tag => tagZhToEn[tag] || tag);
  }, [tool, isZh]);

  const liked = tool ? isLiked(tool.id) : false;
  const favorited = tool ? isFavorite(tool.id) : false;
  const totalLikes = tool ? (tool.likes || 0) + (liked ? 1 : 0) : 0;
  const formatLikes = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  useEffect(() => {
    if (isInternalTool) {
      router.replace(internalToolUrl);
      return;
    }
    if (!tool) return;
    addToHistory(tool.id);
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
  }, [isInternalTool, internalToolUrl, router, tool, toolName, toolDescription, addToHistory]);

  if (isInternalTool) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isZh ? '正在打开工具…' : 'Opening tool…'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isZh
            ? '若未自动跳转，请点击下方按钮直接进入工具页面。'
            : 'If you are not redirected automatically, click the button below to open the tool page.'}
        </p>
        <a
          href={internalToolUrl}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm sm:text-base font-semibold shadow-lg shadow-primary-600/20 transition-all duration-200 min-h-[52px]"
        >
          <Wrench className="h-5 w-5" />
          {isZh ? '立即打开工具' : 'Open Tool Now'}
        </a>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isZh ? '工具未找到' : 'Tool Not Found'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isZh ? '您访问的工具不存在或已被移除。' : 'The tool you requested does not exist or has been removed.'}
        </p>
        <a
          href={`/${resolvedLocale}`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors min-h-[48px]"
        >
          <ArrowLeft className="h-4 w-4" />
          {isZh ? '返回首页' : 'Back to Home'}
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs">
          <li>
            <a
              href={`/${resolvedLocale}`}
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
                  href={`/${resolvedLocale}?category=${category.id}`}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[160px]"
                >
                  {sidebarT(category.id)}
                </a>
              </li>
            </>
          )}
          <li aria-hidden="true">
            <ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" />
          </li>
          <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[220px]">
            {toolName}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <section className="flex-1 min-w-0">
          {tool.localProcessing && (
            <div
              role="note"
              className="mb-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-900/10 px-4 py-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-200"
            >
              {tcT('privacy-local-note')}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div
              className={[
                'h-2 flex-shrink-0',
                tool.complianceLevel === 'green'
                  ? 'bg-emerald-500 dark:bg-emerald-400'
                  : tool.complianceLevel === 'yellow'
                    ? 'bg-amber-400 dark:bg-amber-300'
                    : tool.complianceLevel === 'red'
                      ? 'bg-rose-500 dark:bg-rose-400'
                      : 'bg-[#34A89C]',
              ].join(' ')}
            />
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {toolName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (tool) {
                        toggleFavorite(tool.id);
                        logFavorite(tool.id);
                      }
                    }}
                    className={`px-2 py-1.5 rounded-md inline-flex items-center justify-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 ${favorited ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-orange-400'}`}
                    title={isZh ? '收藏到工具箱' : 'Save to Toolbox'}
                  >
                    <Star className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium hidden sm:inline">{isZh ? '收藏' : 'Save'}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (tool) {
                        toggleLike(tool.id);
                        logLike(tool.id);
                      }
                    }}
                    className={`px-2 py-1.5 rounded-md inline-flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 ${liked ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-red-400'}`}
                    title={isZh ? '点赞' : 'Like'}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium tabular-nums leading-none">{formatLikes(totalLikes)}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                {toolName}
              </h1>

              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {tool.difficulty && (
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 ${
                    tool.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : tool.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {tool.difficulty === 'easy' ? tcT('easy') : tool.difficulty === 'medium' ? tcT('medium') : tcT('advanced')}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 ${
                  tool.isLimitedFree ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : tool.isFree ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {tool.isLimitedFree ? (isZh ? '限次免费' : 'Freemium') : tool.isFree ? (isZh ? '免费' : 'Free') : (isZh ? '付费' : 'Paid')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                  <ShieldCheck className="h-3 w-3" />
                  {tcT('verified')}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {toolDescription}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-7">
                {translatedTags.slice(0, 6).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>

              {isInternalTool ? (
                <a
                  href={internalToolUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm sm:text-base font-semibold shadow-lg shadow-primary-600/20 transition-all duration-200 min-h-[52px]"
                >
                  <Wrench className="h-5 w-5" />
                  {isZh ? '立即使用工具' : 'Use Tool Now'}
                </a>
              ) : tool.externalUrl ? (
                <SafeLink
                  href={tool.externalUrl}
                  locale={resolvedLocale}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm sm:text-base font-semibold shadow-lg shadow-primary-600/20 transition-all duration-200 min-h-[52px]"
                >
                  <ExternalLink className="h-5 w-5" />
                  {isZh ? '访问官方网站' : 'Visit Official Website'}
                </SafeLink>
              ) : (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {isZh ? '此工具正在开发中，敬请期待。' : 'This tool is coming soon. Stay tuned!'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {t('section-scenarios')}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t('scenarios-hint')}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[1, 2, 3].map((i) => {
                  const key = `${resolvedSlug}.scenario-${i}`;
                  const fallback = t(`fallback-scenario-${i}`);
                  const text = safeTranslate(key, fallback);
                  return (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{text}</p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#5461A8]/10 dark:bg-[#5461A8]/20 flex items-center justify-center shrink-0">
                  <ListChecks className="w-[18px] h-[18px] text-[#5461A8] dark:text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {t('section-tutorial')}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t('tutorial-hint')}</p>
                </div>
              </div>
              <ol className="space-y-3.5">
                {[1, 2, 3, 4].map((i) => {
                  const key = `${resolvedSlug}.tutorial-${i}`;
                  const fallback = t(`fallback-tutorial-${i}`);
                  const text = safeTranslate(key, fallback);
                  return (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[#5461A8] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                        {i}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 pt-0.5">{text}</p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Award className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {t('section-advantages')}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t('advantages-hint')}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[1, 2, 3].map((i) => {
                  const key = `${resolvedSlug}.advantage-${i}`;
                  const fallback = t(`fallback-advantage-${i}`);
                  const text = safeTranslate(key, fallback);
                  return (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{text}</p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <AdSlot
              slot={`tool-${tool?.id || resolvedSlug}-banner-${category?.id || 'general'}`}
              size="banner"
            />
            <ToolSeoContent locale={resolvedLocale} slug={resolvedSlug} />
          </div>
        </section>

        <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 space-y-5">
          <AdSlot
            slot={`tool-${tool?.id || resolvedSlug}-rectangle-${category?.id || 'general'}`}
            size="rectangle"
          />
          {relatedTools.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {isZh ? '相关工具推荐' : 'Related Tools'}
              </h2>
              <div className="space-y-3">
                {relatedTools.slice(0, 4).map((rt) => (
                  <ToolCard key={rt.id} tool={rt} locale={resolvedLocale} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}
