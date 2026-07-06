'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import ToolCard from '@/components/ToolCard';
import SearchDropdown from '@/components/SearchDropdown';
import type { Tool, ComplianceLevel } from '@/data/tools';
import { INITIAL_HOME_TOOLS } from '@/data/_initial-home.generated';
import { categories, setDynamicCategoryCounts, getCategoryCount } from '@/data/categories';
import { usePreferencesStore } from '@/stores/preferences';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';
import { buildRecommendedOrder, type RecommendProfile } from '@/lib/recommend';
import { Layers, Search, Sparkles, Flame, BookOpen } from 'lucide-react';

type ComplianceFn = (tool: Tool) => ComplianceLevel;
type SearchToolsFn = (pool: Tool[], q: string) => Tool[];

interface DynamicBundle {
  tools: Tool[];
  computeComplianceLevel: ComplianceFn;
  searchTools: SearchToolsFn;
}

const INITIAL_COUNT = 15;
const LOAD_MORE_COUNT = 15;

type SortMode = 'newest' | 'popular' | 'free' | 'recommended';

const HEADER_ACTION_BTN_BASE = [
  'flex', 'items-center', 'justify-center',
  'gap-1', 'whitespace-nowrap',
  'px-2 sm:px-2.5', 'py-1 sm:py-1.5',
  'min-h-[32px]',
  'rounded-lg',
  'text-[11px] sm:text-xs', 'font-medium',
  'transition-colors', 'active:scale-95',
].join(' ');

const CATEGORY_CHIP_BASE = [
  'flex-shrink-0', 'whitespace-nowrap',
  'inline-flex', 'items-center', 'justify-center',
  'px-2.5 sm:px-3', 'py-1 sm:py-1.5',
  'min-h-[32px]',
  'rounded-lg',
  'text-[11px] sm:text-xs', 'font-medium',
  'transition-colors',
].join(' ');

// ===== 首屏用的轻量版本工具（INITIAL_HOME_TOOLS），几 KB 就可完成首屏渲染 =====
function initialComputeComplianceLevel(tool: Tool | (Omit<Tool, 'signup' | 'payment' | 'externalUrl'>)): ComplianceLevel {
  if (tool.complianceLevel) return tool.complianceLevel as ComplianceLevel;
  const name = tool.name || '';
  const desc = tool.description || '';
  if ((tool as any).signup?.includes('cn-phone') || (tool as any).payment?.includes('alipay') || (tool as any).payment?.includes('wechat')) return 'yellow';
  const cnSignal = /[\u4e00-\u9fa5]{2,}|国内|备案|中文|中国/.test(name + desc);
  if (cnSignal) return 'yellow';
  return 'green';
}

function initialSearchTools(pool: Tool[], q: string): Tool[] {
  const query = q.trim().toLowerCase();
  if (!query) return pool;
  return pool.filter((t) => {
    const hay = [
      t.name,
      t.description,
      t.slug,
      t.category,
      (t.tags || []).join(' '),
    ].join(' ').toLowerCase();
    return hay.includes(query);
  });
}

function applyFilterAndSort(
  pool: Tool[],
  selectedCategory: string,
  sortBy: SortMode,
  searchQuery: string,
  complianceFn: ComplianceFn,
  searchFn: SearchToolsFn,
): Tool[] {
  let result = [...pool] as Tool[];
  if (searchQuery.trim()) result = searchFn(result, searchQuery);
  if (selectedCategory !== 'all') result = result.filter((tool) => tool.category === selectedCategory);
  if (sortBy === 'popular') {
    result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sortBy === 'newest') {
    result = [...result].reverse();
  } else if (sortBy === 'free') {
    result = result.filter((tool) => tool.isFree);
  }
  result = result.filter((tool) => complianceFn(tool as Tool) !== 'red');
  return result;
}

export default function HomeDashboardView({ locale }: { locale: string }) {
  const t = useTranslations('dashboard');
  const tSidebar = useTranslations('sidebar');
  const tcT = useTranslations('toolcard');
  const tNav2 = useTranslations('nav2');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const authedStatus = useAuthStore((s) => s.status);
  const isAuthed = authedStatus === 'authed';
  const [sortBy, setSortBy] = useState<SortMode>('newest');
  const authHistory = useAuthStore((s) => s.favorites).slice();
  const favs = useFavoritesStore((s) => s);
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const { searchQuery } = usePreferencesStore();
  const loaderRef = useRef<HTMLDivElement>(null);
  const sortBySetRef = useRef(false);
  useEffect(() => {
    if (sortBySetRef.current) return;
    sortBySetRef.current = true;
    if (isAuthed) setSortBy('recommended');
  }, [isAuthed]);

  // ===== 动态大 bundle：初始 null，useEffect 中 import('@/data/tools') 水合后填入 =====
  const [bundle, setBundle] = useState<DynamicBundle | null>(null);
  const bundleLoadedRef = useRef(false);

  useEffect(() => {
    if (bundleLoadedRef.current) return;
    bundleLoadedRef.current = true;
    (async () => {
      try {
        const [toolsMod, searchMod] = await Promise.all([
          import('@/data/tools'),
          import('@/data/search'),
        ]);
        const fullTools: Tool[] = (toolsMod.tools || []) as Tool[];

        // 刷新分类计数为真实值
        const countTable: Record<string, number> = {};
        for (const t of fullTools) {
          const lv = toolsMod.computeComplianceLevel(t);
          if (lv === 'red') continue; // 与首页 filter 保持一致
          countTable[t.category] = (countTable[t.category] || 0) + 1;
        }
        setDynamicCategoryCounts(countTable);

        setBundle({
          tools: fullTools,
          computeComplianceLevel: toolsMod.computeComplianceLevel,
          searchTools: searchMod.searchTools as SearchToolsFn,
        });
      } catch (e) {
        // 懒加载失败，继续保持首屏 initial 20 条，不影响首屏渲染
        console.warn('[HomeDashboardView] lazy load tools bundle failed:', e);
      }
    })();
  }, []);

  // ===== 始终按"当前 bundle"（首屏 initial，激活后全量）来计算 filtered =====
  const currentPool: Tool[] = useMemo<Tool[]>(() => {
    return (bundle ? bundle.tools : (INITIAL_HOME_TOOLS as Tool[])) as Tool[];
  }, [bundle]);

  const computeCL: ComplianceFn = useMemo(
    () => (bundle ? bundle.computeComplianceLevel : initialComputeComplianceLevel),
    [bundle],
  );
  const searchFn: SearchToolsFn = useMemo(
    () => (bundle ? bundle.searchTools : initialSearchTools),
    [bundle],
  );

  const filteredTools = useMemo(() => {
    const effectiveSort: SortMode = sortBy === 'recommended' ? 'newest' : sortBy;
    const base = applyFilterAndSort(currentPool, selectedCategory, effectiveSort, searchQuery, computeCL, searchFn);
    if (sortBy !== 'recommended') return base;
    const history = (() => {
      const m = new Map<string, { toolId: string; timestamp: number }>();
      const list1 = favs.recentlyUsedTools ?? [];
      const list2 = favs.history ?? [];
      for (let i = 0; i < list1.length; i++) {
        const h = list1[i];
        const prev = m.get(h.toolId);
        if (!prev || prev.timestamp < h.timestamp) m.set(h.toolId, h);
      }
      for (let i = 0; i < list2.length; i++) {
        const h = list2[i];
        const prev = m.get(h.toolId);
        if (!prev || prev.timestamp < h.timestamp) m.set(h.toolId, h);
      }
      return Array.from(m.values());
    })();
    const favoriteIds = Array.from(new Set<string>([
      ...(favs.favoriteTools ?? []),
      ...(favs.favoritedTools ?? []),
      ...(authHistory ?? []),
    ]));
    const profile: RecommendProfile = {
      history,
      likedIds: favs.likedTools ?? [],
      favoriteIds,
      isAuthed,
      preferredLocale: locale,
    };
    return buildRecommendedOrder(base, profile);
  }, [currentPool, selectedCategory, sortBy, searchQuery, computeCL, searchFn, favs, authHistory, isAuthed, locale]);

  // bundle 加载完 / 筛选变化时，重置显示数量
  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
  }, [selectedCategory, sortBy, searchQuery, bundle]);

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredTools.length) {
          setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredTools.length));
        }
      },
      { rootMargin: '200px' },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [displayCount, filteredTools.length]);

  const displayedTools = filteredTools.slice(0, displayCount);
  const hasMore = displayCount < filteredTools.length;

  // 空态的热门 5 推荐（同样基于当前 pool）
  const top5ForEmpty = useMemo(() => {
    return [...currentPool]
      .filter((tool) => computeCL(tool) !== 'red')
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 5);
  }, [currentPool, computeCL]);

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='mb-4 sm:mb-6 lg:mb-8'>
          <div className='mb-4 sm:mb-5 max-w-3xl mx-auto'>
            <SearchDropdown locale={locale} />
          </div>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A2C2D] dark:text-gray-100 mb-1 sm:mb-2'>{t('title')}</h1>
          <p className='text-sm sm:text-base text-[#466B6C] dark:text-gray-400'>{t('subtitle')}</p>
        </div>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            locale={locale}
            activePage='home'
          />
          <div className='flex-1 min-w-0'>
            <div className='mb-2.5 sm:mb-3.5 -mx-3 sm:-mx-4 px-3 sm:px-4'>
              <div className='flex items-center gap-1.5 overflow-x-auto pb-1 category-scroll' style={{ scrollbarWidth: 'thin' }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`${CATEGORY_CHIP_BASE} ${selectedCategory === 'all' ? 'bg-[#0F5759] text-white hover:bg-[#0C4849]' : 'bg-gray-100 dark:bg-gray-800 text-[#466B6C] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {tSidebar('all')}
                </button>
                {categories.map((cat) => {
                  const count = getCategoryCount(cat.id);
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`${CATEGORY_CHIP_BASE} ${selectedCategory === cat.id ? 'bg-[#0F5759] text-white hover:bg-[#0C4849]' : 'bg-gray-100 dark:bg-gray-800 text-[#466B6C] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      {tSidebar(cat.id)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3 sm:mb-5'>
              <p className='text-[11px] sm:text-xs text-[#466B6C] dark:text-gray-400'>
                {tcT('showing')} {displayedTools.length} / {filteredTools.length} {tcT('toolsCount')}
                {!bundle && (
                  <span className='ml-2 text-[#0F5759]/70 dark:text-emerald-300/80'>·</span>
                )}
              </p>
              <div className='flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1'>
                <a
                  href={`/${locale}/workflows`}
                  className={`${HEADER_ACTION_BTN_BASE} bg-primary-600 text-white hover:bg-primary-700 border border-primary-700/20`}
                >
                  <Layers className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                  {tNav2('workflows')}
                </a>
                <a
                  href={`/${locale}/blog`}
                  className={`${HEADER_ACTION_BTN_BASE} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700`}
                >
                  <BookOpen className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                  {tNav2('blog')}
                </a>
                <div className='w-px h-8 bg-gray-200 dark:bg-gray-700 mx-0.5 hidden sm:block' />
                <label className={`${HEADER_ACTION_BTN_BASE} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent`}>
                  <span className='text-gray-500 dark:text-gray-400 whitespace-nowrap'>{t('sort-by-label')}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortMode)}
                    className='bg-transparent border-none outline-none appearance-none pr-0 -mr-0.5 text-[11px] sm:text-xs font-medium text-gray-900 dark:text-gray-100 cursor-pointer min-h-[24px]'
                    aria-label={t('sort-by-label')}
                  >
                    <option value='recommended'>{t('sort-recommended')}</option>
                    <option value='newest'>{t('sort-newest')}</option>
                    <option value='popular'>{t('sort-popular')}</option>
                    <option value='free'>{t('sort-free')}</option>
                  </select>
                </label>
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4'>
              {displayedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool as any} locale={locale} selectable={selectedCategory !== 'all' || searchQuery.trim() !== ''} />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-[#466B6C] dark:text-gray-400 mb-4'>
                  {selectedCategory !== 'all' && searchQuery.trim()
                    ? tcT('noResultsWithSearchAndCategory', { query: searchQuery })
                    : searchQuery.trim()
                    ? tcT('noResultsWithSearch')
                    : tcT('noToolsInCategory')}
                </p>
                {selectedCategory !== 'all' && searchQuery.trim() && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className='inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium min-h-[40px]'
                  >
                    {tcT('viewAllCategories')}
                  </button>
                )}
                {(searchQuery.trim() || selectedCategory !== 'all') ? (
                  <>
                    <div className="my-6 h-px bg-gray-100 dark:bg-gray-800 mx-auto w-40" aria-hidden="true" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      {t('try-these-categories')}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                      {(() => {
                        const picks = ['dev', 'ai', 'image', 'pdf', 'media', 'productivity'];
                        const picked = picks
                          .map((id) => categories.find((c) => c.id === id || c.id.endsWith('-' + id) || c.id.startsWith(id + '-')))
                          .filter(Boolean);
                        return picked.map((cat) => (
                          <button
                            key={cat!.id}
                            onClick={() => setSelectedCategory(cat!.id)}
                            className={`${CATEGORY_CHIP_BASE} bg-gray-50 dark:bg-gray-800/70 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 gap-1`}
                          >
                            <Search className="h-3 w-3 opacity-60" />
                            {tSidebar(cat!.id)}
                          </button>
                        ));
                      })()}
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 inline-flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-rose-500" />
                      {t('try-these-tools')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3 max-w-6xl mx-auto text-left">
                      {top5ForEmpty.map((tool) => (
                        <ToolCard key={tool.id} tool={tool as any} locale={locale} selectable={selectedCategory !== 'all' || searchQuery.trim() !== ''} />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}
            {hasMore && (
              <div ref={loaderRef} className='flex justify-center py-4'>
                <div className='w-6 h-6 border-2 border-[#0F5759] border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
