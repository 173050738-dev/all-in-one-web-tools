'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import ToolCard from '@/components/ToolCard';
import SearchDropdown from '@/components/SearchDropdown';
import { tools, computeComplianceLevel } from '@/data/tools';
import { categories, getCategoryCount } from '@/data/categories';
import { usePreferencesStore } from '@/stores/preferences';
import { Layers } from 'lucide-react';
import { searchTools } from '@/data/search';

const INITIAL_COUNT = 15;
const LOAD_MORE_COUNT = 15;

export default function DashboardPage() {
  const locale = 'ar';
  const t = useTranslations('dashboard');
  const tSidebar = useTranslations('sidebar');
  const tcT = useTranslations('toolcard');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'free'>('newest');
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const { searchQuery, likedTools } = usePreferencesStore();
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredTools = useMemo(() => {
    let result = [...tools];
    if (searchQuery.trim()) {
      result = searchTools(result, searchQuery);
    }
    if (selectedCategory !== 'all') {
      result = result.filter((tool) => tool.category === selectedCategory);
    }
    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'newest') {
      result = [...result].reverse();
    } else if (sortBy === 'free') {
      result = result.filter((tool) => tool.isFree);
    }
    result = result.filter((tool) => computeComplianceLevel(tool) !== 'red');
    return result;
  }, [selectedCategory, sortBy, searchQuery]);

  // 重置显示数量当筛选条件变化时
  useEffect(() => {
    setDisplayCount(INITIAL_COUNT);
  }, [selectedCategory, sortBy, searchQuery]);

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredTools.length) {
          setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredTools.length));
        }
      },
      { rootMargin: '200px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [displayCount, filteredTools.length]);

  const displayedTools = filteredTools.slice(0, displayCount);
  const hasMore = displayCount < filteredTools.length;

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='mb-4 sm:mb-6 lg:mb-8'>
        <div className='mb-4 sm:mb-5 max-w-3xl mx-auto'>
          <SearchDropdown locale={locale} />
        </div>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2'>{t('title')}</h1>
        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
      </div>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
      />
        <div className='flex-1 min-w-0'>
          <div className='mb-3 sm:mb-4 -mx-3 sm:-mx-4 px-3 sm:px-4'>
            <div className='flex items-center gap-2 overflow-x-auto pb-1 category-scroll' style={{ scrollbarWidth: 'thin' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                全部
              </button>
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id);
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                  >
                    {tSidebar(cat.id)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6'>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              {tcT('showing')} {displayedTools.length} / {filteredTools.length} {tcT('toolsCount')}
            </p>
            <div className='flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1'>
              <a
                href={`/${locale}/workflows`}
                className='flex items-center gap-1 whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95'
              >
                <Layers className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                Workflows
              </a>
              <div className='w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5 sm:mx-1 hidden sm:block' />
              <button
                onClick={() => setSortBy('newest')}
                className={`whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${sortBy === 'newest' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {t('sort-newest')}
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${sortBy === 'popular' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {t('sort-popular')}
              </button>
              <button
                onClick={() => setSortBy('free')}
                className={`whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${sortBy === 'free' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {t('sort-free')}
              </button>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4'>
            {displayedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale='ar' />
            ))}
          </div>
          {filteredTools.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
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
            </div>
          )}
          {hasMore && (
            <div ref={loaderRef} className='flex justify-center py-4'>
              <div className='w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}