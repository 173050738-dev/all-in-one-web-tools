'use client';

import { Search, Sparkles, Code, Palette, GraduationCap, Briefcase, Video, X, ArrowRight, Wand2, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { tools } from '@/data/tools';
import { searchTools } from '@/data/search';
import { scenes } from '@/data/scenes';
import { usePreferencesStore } from '@/stores/preferences';
import { resolveToolLink } from '@/lib/toolLinks';

const ENABLE_AI_FEATURES = true;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Code,
  Palette,
  GraduationCap,
  Briefcase,
  Video,
};

interface SearchDropdownProps {
  locale: string;
  isMobile?: boolean;
}

const sceneNames: Record<string, Record<string, string>> = {
  'content-creator': {
    zh: '内容创作',
    en: 'Content Creator',
  },
  'developer': {
    zh: '开发者',
    en: 'Developer',
  },
  'designer': {
    zh: '设计师',
    en: 'Designer',
  },
  'student': {
    zh: '学生学习',
    en: 'Student',
  },
  'office-worker': {
    zh: '办公效率',
    en: 'Office Work',
  },
  'video-creator': {
    zh: '视频创作',
    en: 'Video Creator',
  },
};

const sceneDescs: Record<string, Record<string, string>> = {
  'content-creator': {
    zh: '做图、写文案、抠图一站式',
    en: 'Design, copywriting, background removal',
  },
  'developer': {
    zh: '写代码、调试、查文档',
    en: 'Coding, debugging, documentation',
  },
  'designer': {
    zh: 'UI设计、配色、找素材',
    en: 'UI design, colors, assets',
  },
  'student': {
    zh: '写论文、翻译、PDF处理',
    en: 'Papers, translation, PDF tools',
  },
  'office-worker': {
    zh: '办公、文档、效率提升',
    en: 'Office, docs, productivity',
  },
  'video-creator': {
    zh: '剪辑、配音、数字人',
    en: 'Editing, voiceover, AI avatars',
  },
};

export default function SearchDropdown({ locale, isMobile = false }: SearchDropdownProps) {
  const { searchQuery, setSearchQuery } = usePreferencesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [_isAiModeRaw, _setIsAiModeRaw] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ reason: string; tools: any[] } | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsT = useTranslations('tools');

  const safeTranslate = (key: string, fallback: string) => {
    try {
      const v = toolsT(key);
      if (v && v !== key) return v;
    } catch { /* fallthrough */ }
    return fallback;
  };
  const translateField = (tool: any, field: 'name' | 'description') => {
    const fallback = field === 'name' ? (tool.name || '') : (tool.description || '');
    if (locale === 'zh') return fallback;
    const slug = tool.slug || tool.id || '';
    const altId = tool.id && tool.id !== tool.slug ? tool.id : '';
    return safeTranslate(`${slug}.${field}`, altId ? safeTranslate(`${altId}.${field}`, fallback) : fallback);
  };

  const isAiMode = ENABLE_AI_FEATURES && _isAiModeRaw;
  const setIsAiMode = (v: boolean | ((p: boolean) => boolean)) => {
    if (!ENABLE_AI_FEATURES) return;
    _setIsAiModeRaw(v);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('korelyy_search_history');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    try {
      localStorage.setItem('korelyy_search_history', JSON.stringify(newHistory));
    } catch {}
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('korelyy_search_history');
    } catch {}
  };

  const getToolLinkAttrs = (toolSlug: string | undefined, toolId: string) => {
    const link = resolveToolLink(toolSlug || toolId, locale);
    const isExt = link.type === 'external';
    return {
      href: link.url,
      target: isExt ? '_blank' : '_self',
      rel: isExt ? 'noopener noreferrer' : '',
    };
  };

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(tools, searchQuery).slice(0, 6);
  }, [searchQuery]);

  const fetchAiRecommend = useCallback(async () => {
    if (!ENABLE_AI_FEATURES) return;
    if (!searchQuery.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, locale }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        (error as { name?: string }).name === 'AbortError'
      ) {
        // 用户切换页面/取消请求 — 正常场景，不打日志
        return;
      }
      console.error('AI recommend error:', error);
    } finally {
      setIsAiLoading(false);
    }
  }, [searchQuery, locale]);

  const handleAiClick = () => {
    if (!searchQuery.trim()) {
      setIsAiMode(true);
      inputRef.current?.focus();
      return;
    }
    setIsAiMode(true);
    fetchAiRecommend();
  };

  const handleBackToSearch = () => {
    setIsAiMode(false);
    setAiResult(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSceneClick = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      const firstTool = tools.find(t => t.slug === scene.toolSlugs[0]);
      if (firstTool) {
        setSearchQuery(sceneNames[sceneId]?.[locale] || sceneNames[sceneId]?.['en'] || sceneId);
      }
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const placeholder = isAiMode
    ? (locale === 'zh' ? '描述你的需求，AI帮你找工具...' : 'Describe your need, AI finds tools...')
    : (locale === 'zh' ? '搜索工具，或试试"做PPT"、"抠图"' : 'Search tools, try "PPT" or "remove bg"');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isAiMode && searchQuery.trim()) {
        addToHistory(searchQuery.trim());
        fetchAiRecommend();
      } else if (searchQuery.trim()) {
        addToHistory(searchQuery.trim());
      }
    }
  };

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <div className='relative'>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] ${isAiMode ? 'text-purple-400' : 'text-gray-400'}`} />
        <input
          ref={inputRef}
          type='text'
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-full pl-10 pr-28 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow ${
            isMobile ? 'min-h-[48px] text-[15px]' : 'min-h-[46px] sm:min-h-[44px] text-sm'
          } ${
            isAiMode
              ? 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'
              : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500'
          }`}
        />
        <div className='absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1'>
          {searchQuery && (
            <button
              onClick={handleClear}
              className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors'
              aria-label={locale === 'zh' ? '清除' : 'Clear'}
            >
              <X className='h-4 w-4 text-gray-500 dark:text-gray-400' />
            </button>
          )}
          {ENABLE_AI_FEATURES && (
            <button
              onClick={isAiMode ? handleBackToSearch : handleAiClick}
              className={`min-h-[38px] min-w-[60px] px-2.5 sm:px-3 flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all ${
                isAiMode
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] shadow-sm'
              }`}
            >
              {isAiLoading ? (
                <Loader2 className='h-4 w-4 animate-spin flex-shrink-0' />
              ) : (
                <Wand2 className='h-4 w-4 flex-shrink-0' />
              )}
              <span>{isAiMode ? (locale === 'zh' ? '返回' : 'Back') : (locale === 'zh' ? 'AI' : 'AI')}</span>
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className={`absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200 ${isMobile ? 'fixed inset-x-3 top-[calc(7.25rem+env(safe-area-inset-top))] max-h-[min(72vh,calc(100dvh-7.25rem-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]' : 'w-full'}`}>
          {isAiMode ? (
            <div className='py-2 max-h-[min(74vh,calc(100dvh-12rem-env(safe-area-inset-bottom)))] overflow-y-auto overscroll-contain'>
              {isAiLoading ? (
                <div className='px-4 py-12 text-center'>
                  <Loader2 className='w-8 h-8 text-purple-500 mx-auto mb-3 animate-spin' />
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {locale === 'zh' ? 'AI正在思考中...' : 'AI is thinking...'}
                  </p>
                </div>
              ) : aiResult && aiResult.tools.length > 0 ? (
                <>
                  <div className='px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-100 dark:border-purple-900/30'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Wand2 className='w-4 h-4 text-purple-500' />
                      <span className='text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider'>
                        {locale === 'zh' ? 'AI 推荐' : 'AI Recommendation'}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>{aiResult.reason}</p>
                  </div>
                  {aiResult.tools.map((tool: any) => {
                    const attrs = getToolLinkAttrs(tool.slug, tool.id);
                    return (
                    <a
                      key={tool.id}
                      {...attrs}
                      className='flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition-colors'
                    >
                      <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center'>
                        <Wand2 className='w-4 h-4 text-purple-500' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                          {translateField(tool, 'name')}
                        </p>
                        <p className='text-xs text-purple-600 dark:text-purple-400 mt-1'>
                          {tool.aiReason}
                        </p>
                      </div>
                      {tool.isFree && (
                        <span className='flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full'>
                          {locale === 'zh' ? '免费' : 'Free'}
                        </span>
                      )}
                    </a>
                    ); })}
                  <div className='px-4 py-2 border-t border-gray-100 dark:border-gray-700'>
                    <button
                      onClick={handleBackToSearch}
                      className='text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    >
                      {locale === 'zh' ? '← 返回普通搜索' : '← Back to search'}
                    </button>
                  </div>
                </>
              ) : !searchQuery.trim() ? (
                <div className='px-4 py-8 text-center'>
                  <Wand2 className='w-10 h-10 text-purple-400 mx-auto mb-3' />
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    {locale === 'zh' ? 'AI 智能推荐' : 'AI Smart Recommendation'}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                    {locale === 'zh' ? '描述你的需求，AI帮你找到最合适的工具' : 'Describe your need, AI finds the best tools'}
                  </p>
                  <div className='flex flex-wrap gap-1.5 justify-center'>
                    {(locale === 'zh' ? ['做PPT用什么工具', '图片压缩加水印', '写论文找资料', '开发工具推荐'] : ['Tools for PPT design', 'Image compress + watermark', 'Research paper tools', 'Developer tools']).map((q) => (
                      <button
                        key={q}
                        onClick={() => { setSearchQuery(q); fetchAiRecommend(); }}
                        className='px-3 py-1.5 min-h-[38px] inline-flex items-center text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-colors active:scale-[0.98]'
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className='px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-100 dark:border-purple-900/30'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Wand2 className='w-4 h-4 text-purple-500' />
                      <span className='text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider'>
                        {locale === 'zh' ? 'AI 推荐' : 'AI Recommendation'}
                      </span>
                    </div>
                  </div>
                  <div className='py-2'>
                    {results.length > 0 ? (
                      results.map((tool) => (
                        <a
                          key={tool.id}
                          {...getToolLinkAttrs(tool.slug, tool.id)}
                          className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition-colors'
                        >
                          <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
                            <Search className='w-4 h-4 text-gray-400' />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                              {translateField(tool, 'name')}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5'>
                              {translateField(tool, 'description')}
                            </p>
                          </div>
                          {tool.isFree && (
                            <span className='flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full'>
                              {locale === 'zh' ? '免费' : 'Free'}
                            </span>
                          )}
                        </a>
                      ))
                    ) : (
                      <div className='px-4 py-8 text-center'>
                        <Search className='w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2' />
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {locale === 'zh' ? '没找到相关工具' : 'No tools found'}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : !searchQuery.trim() ? (
            <div className='p-3 sm:p-4 max-h-[min(74vh,calc(100dvh-12rem-env(safe-area-inset-bottom)))] overflow-y-auto overscroll-contain'>
              {!isAiMode && searchHistory.length > 0 && (
                <div className='mb-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <Search className='w-4 h-4 text-gray-400' />
                      <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        {locale === 'zh' ? '搜索历史' : 'Search History'}
                      </span>
                    </div>
                    <button
                      onClick={clearHistory}
                      className='px-2 py-1.5 min-h-[36px] inline-flex items-center rounded-md text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                    >
                      {locale === 'zh' ? '清空' : 'Clear'}
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {searchHistory.map((q) => (
                      <button
                        key={q}
                        onClick={() => setSearchQuery(q)}
                        className='px-3 py-1.5 min-h-[38px] inline-flex items-center text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors truncate max-w-[180px] active:scale-[0.98]'
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className='flex items-center gap-2 mb-3'>
                <Sparkles className='w-4 h-4 text-primary-500' />
                <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  {locale === 'zh' ? '热门场景' : 'Popular Scenarios'}
                </span>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {scenes.map((scene) => {
                  const IconComponent = iconMap[scene.icon];
                  return (
                    <button
                      key={scene.id}
                      onClick={() => handleSceneClick(scene.id)}
                      className='flex items-start gap-2.5 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-[0.98] transition-all text-left group'
                    >
                      <div className='flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center'>
                        {IconComponent && <IconComponent className='w-4.5 h-4.5 text-primary-600 dark:text-primary-400' />}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                          {sceneNames[scene.id]?.[locale] || sceneNames[scene.id]?.['en']}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5'>
                          {sceneDescs[scene.id]?.[locale] || sceneDescs[scene.id]?.['en']}
                        </p>
                      </div>
                      <ArrowRight className='w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1' />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className='py-2 max-h-[min(74vh,calc(100dvh-12rem-env(safe-area-inset-bottom)))] overflow-y-auto overscroll-contain'>
              {results.length > 0 ? (
                <>
                  <div className='px-4 py-2 sticky top-0 bg-white dark:bg-gray-800'>
                    <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      {locale === 'zh' ? `找到 ${results.length} 个工具` : `${results.length} tools found`}
                    </span>
                  </div>
                  {results.map((tool) => {
                      const attrs = getToolLinkAttrs(tool.slug, tool.id);
                      return (
                        <a
                          key={tool.id}
                          {...attrs}
                          className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition-colors'
                        >
                      <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
                        <Search className='w-4 h-4 text-gray-400' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                          {tool.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5'>
                          {tool.description}
                        </p>
                      </div>
                      {tool.isFree && (
                        <span className='flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full'>
                          {locale === 'zh' ? '免费' : 'Free'}
                        </span>
                      )}
                    </a>
                      ); })}
                </>
              ) : (
                <div className='px-4 py-10 text-center'>
                  <Search className='w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3' />
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {locale === 'zh' ? '没找到相关工具' : 'No tools found'}
                  </p>
                  <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                    {locale === 'zh' ? '试试其他关键词' : 'Try other keywords'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
