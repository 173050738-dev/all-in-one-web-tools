'use client';
import { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  ChevronRight,
  Sparkles,
  Plus,
  FolderPlus,
  Search,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Star,
  Trophy,
  Flame,
  ListTodo,
  ArrowLeft,
  Layers,
  List,
} from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';
import { workflows } from '@/data/workflows';
import WorkflowCreator from './WorkflowCreator';
import WorkflowCreatorCanvas from './workflow/WorkflowCreatorCanvas';

type TabType = 'all' | 'official' | 'mine' | 'inprogress' | 'completed' | 'favorites';

export default function WorkflowListEnhanced({ locale }: { locale: string }) {
  const {
    customWorkflows,
    workflowProgress,
    favoriteWorkflows,
    workflowStats,
    toggleWorkflowFavorite,
  } = usePreferencesStore();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [showCreatorCanvas, setShowCreatorCanvas] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex-1 min-w-0'>
        <div className='animate-pulse space-y-4'>
          <div className='h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-xl' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const officialWorkflows = workflows;
  
  const inProgressIds = Object.entries(workflowProgress)
    .filter(([, p]) => p && p.completedSteps.length > 0 && !p.completedAt)
    .map(([id]) => id);
  
  const completedIds = Object.entries(workflowProgress)
    .filter(([, p]) => p && p.completedAt)
    .map(([id]) => id);

  const isFavorite = (id: string) => favoriteWorkflows.includes(id);

  const getAllWorkflows = () => {
    const all: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      icon: string;
      category: string;
      steps: any[];
      tags: string[];
      estimatedTime: string;
      difficulty: string;
      isCustom: boolean;
    }> = [];

    if (activeTab === 'all' || activeTab === 'official' || activeTab === 'favorites' || activeTab === 'inprogress' || activeTab === 'completed') {
      officialWorkflows.forEach(w => {
        all.push({
          ...w,
          slug: w.slug,
          isCustom: false,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'mine' || activeTab === 'favorites' || activeTab === 'inprogress' || activeTab === 'completed') {
      customWorkflows.forEach(w => {
        all.push({
          id: w.id,
          slug: w.id,
          title: w.title,
          description: w.description,
          icon: w.icon || 'Zap',
          category: w.category || 'custom',
          steps: w.steps,
          tags: w.tags || [],
          estimatedTime: w.estimatedTime || `${w.steps.length * 5}分钟`,
          difficulty: w.difficulty || 'easy',
          isCustom: true,
        });
      });
    }

    return all;
  };

  const filterByTab = (list: any[]) => {
    switch (activeTab) {
      case 'mine':
        return list.filter(w => w.isCustom);
      case 'official':
        return list.filter(w => !w.isCustom);
      case 'inprogress':
        return list.filter(w => inProgressIds.includes(w.id));
      case 'completed':
        return list.filter(w => completedIds.includes(w.id));
      case 'favorites':
        return list.filter(w => isFavorite(w.id));
      default:
        return list;
    }
  };

  const filterBySearch = (list: any[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(w =>
      w.title.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.tags.some((t: string) => t.toLowerCase().includes(q))
    );
  };

  const displayedWorkflows = filterBySearch(filterByTab(getAllWorkflows()));

  const getProgressInfo = (id: string) => {
    const progress = workflowProgress[id];
    if (!progress) return null;
    const total = progress.totalSteps || 0;
    const completed = progress.completedSteps.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent, isComplete: !!progress.completedAt };
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return locale === 'zh' ? '简单' : 'Easy';
      case 'medium': return locale === 'zh' ? '中等' : 'Medium';
      case 'advanced': return locale === 'zh' ? '进阶' : 'Advanced';
      default: return '';
    }
  };

  const iconMap: Record<string, any> = {
    Presentation: Sparkles,
    Image: Sparkles,
    FileText: Sparkles,
    Code: Sparkles,
    Share2: Sparkles,
    GraduationCap: Sparkles,
    Video: Sparkles,
    Zap,
    Palette: Sparkles,
    Globe: Sparkles,
    TrendingUp,
    Mail: Sparkles,
    Headphones: Sparkles,
    ShoppingCart: Sparkles,
    Calendar: Sparkles,
  };

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: 'all', label: locale === 'zh' ? '全部' : 'All', icon: ListTodo },
    { key: 'inprogress', label: locale === 'zh' ? '进行中' : 'In Progress', icon: Clock3 },
    { key: 'completed', label: locale === 'zh' ? '已完成' : 'Completed', icon: CheckCircle2 },
    { key: 'mine', label: locale === 'zh' ? '我的' : 'Mine', icon: FolderPlus },
    { key: 'favorites', label: locale === 'zh' ? '收藏' : 'Favorites', icon: Star },
  ];

  return (
    <div className='flex-1 min-w-0'>
      <div className='flex items-center gap-4 mb-4'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'>
          <ArrowLeft className='h-5 w-5' />
          <span className='text-sm font-medium'>{locale === 'zh' ? '返回首页' : 'Back'}</span>
        </a>
      </div>

      <div className='flex items-center justify-between mb-4 sm:mb-6 gap-3 flex-wrap'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2'>
            <Sparkles className='w-7 h-7 sm:w-8 sm:h-8 text-primary-500' />
            {locale === 'zh' ? 'AI 工作流广场' : 'AI Workflow Hub'}
          </h1>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            {locale === 'zh'
              ? '精选高效工作流，一键启动，步骤追踪，效率翻倍'
              : 'Curated workflows with step tracking to boost productivity'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowCreatorCanvas(true)}
            className='inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all'
          >
            <Layers className='w-5 h-5' />
            {locale === 'zh' ? '画布新建' : 'Canvas Editor'}
          </button>
          <button
            onClick={() => setShowCreator(true)}
            className='inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-colors'
            title={locale === 'zh' ? '列表模式' : 'List Mode'}
          >
            <List className='w-4 h-4' />
            <span className='hidden sm:inline'>{locale === 'zh' ? '列表' : 'List'}</span>
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6'>
        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center'>
              <ListTodo className='w-4 h-4 text-primary-600 dark:text-primary-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {officialWorkflows.length + customWorkflows.length}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {locale === 'zh' ? '可用工作流' : 'Total Workflows'}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center'>
              <Clock3 className='w-4 h-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {inProgressIds.length}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {locale === 'zh' ? '进行中' : 'In Progress'}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center'>
              <CheckCircle2 className='w-4 h-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {workflowStats.totalCompleted}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {locale === 'zh' ? '已完成' : 'Completed'}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center'>
              <Flame className='w-4 h-4 text-orange-600 dark:text-orange-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {workflowStats.streakDays}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {locale === 'zh' ? '连续天数' : 'Day Streak'}
          </p>
        </div>
      </div>

      {inProgressIds.length > 0 && (
        <div className='mb-5 sm:mb-6'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
            <Clock3 className='w-5 h-5 text-blue-500' />
            {locale === 'zh' ? '继续未完成' : 'Continue Where You Left Off'}
          </h2>
          <div className='flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
            {getAllWorkflows()
              .filter(w => inProgressIds.includes(w.id))
              .slice(0, 5)
              .map((workflow) => {
                const Icon = iconMap[workflow.icon] || Zap;
                const progress = getProgressInfo(workflow.id);
                const detailUrl = workflow.isCustom
                  ? `/${locale}/workflow/custom/${workflow.id}`
                  : `/${locale}/workflow/${workflow.slug}`;
                return (
                  <a
                    key={workflow.id}
                    href={detailUrl}
                    className='flex-shrink-0 w-64 sm:w-72 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group'
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='p-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'>
                        <Icon className='w-5 h-5' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                          {workflow.title}
                        </h3>
                      </div>
                    </div>
                    <div className='mb-2'>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-gray-600 dark:text-gray-400'>
                          {locale === 'zh' ? '进度' : 'Progress'}
                        </span>
                        <span className='font-medium text-blue-600 dark:text-blue-400'>
                          {progress?.percent || 0}%
                        </span>
                      </div>
                      <div className='h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all'
                          style={{ width: `${progress?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className='flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium'>
                      {locale === 'zh' ? '继续' : 'Continue'}
                      <ChevronRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
                    </div>
                  </a>
                );
              })}
          </div>
        </div>
      )}

      {workflowStats.totalCompleted === 0 && activeTab === 'all' && !searchQuery && (
        <div className='mb-5 sm:mb-6'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-yellow-500' />
            {locale === 'zh' ? '热门推荐' : 'Recommended for You'}
          </h2>
          <div className='flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
            {officialWorkflows.slice(0, 4).map((workflow) => {
              const Icon = iconMap[workflow.icon] || Zap;
              return (
                <a
                  key={workflow.id}
                  href={`/${locale}/workflow/${workflow.slug}`}
                  className='flex-shrink-0 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all group'
                >
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='p-2 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-600 dark:text-primary-400'>
                      <Icon className='w-5 h-5' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1'>
                      {workflow.title}
                    </h3>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2'>
                    {workflow.description}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-gray-400'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {workflow.estimatedTime}
                    </span>
                    <span className='flex items-center gap-1'>
                      <ListTodo className='w-3 h-3' />
                      {workflow.steps.length} {locale === 'zh' ? '步' : 'steps'}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className='relative mb-4 sm:mb-5'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={locale === 'zh' ? '搜索工作流...' : 'Search workflows...'}
          className='w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
        />
      </div>

      <div className='flex gap-2 overflow-x-auto pb-1 mb-4 sm:mb-5 scrollbar-hide -mx-1 px-1'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            <tab.icon className='w-4 h-4' />
            {tab.label}
          </button>
        ))}
      </div>

      {displayedWorkflows.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          {displayedWorkflows.map((workflow) => {
            const Icon = iconMap[workflow.icon] || Zap;
            const progress = getProgressInfo(workflow.id);
            const detailUrl = workflow.isCustom
              ? `/${locale}/workflow/custom/${workflow.id}`
              : `/${locale}/workflow/${workflow.slug}`;

            return (
              <a
                key={workflow.id}
                href={detailUrl}
                className='group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-500/5 dark:hover:shadow-primary-500/5 transition-all cursor-pointer relative overflow-hidden'
              >
                {progress && !progress.isComplete && progress.percent > 0 && (
                  <div className='absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700'>
                    <div
                      className='h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all'
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                )}

                <div className='flex items-start justify-between gap-3 mb-3'>
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div className='p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform'>
                      <Icon className='w-5 h-5 sm:w-6 sm:h-6' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-1.5 mb-0.5 flex-wrap'>
                        {workflow.isCustom && (
                          <span className='text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium'>
                            {locale === 'zh' ? '我的' : 'Mine'}
                          </span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getDifficultyStyle(workflow.difficulty)}`}>
                          {getDifficultyText(workflow.difficulty)}
                        </span>
                      </div>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate text-sm sm:text-base'>
                        {workflow.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWorkflowFavorite(workflow.id);
                    }}
                    className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                      isFavorite(workflow.id)
                        ? 'text-yellow-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite(workflow.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]'>
                  {workflow.description}
                </p>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3.5 h-3.5' />
                      {workflow.estimatedTime}
                    </span>
                    <span className='flex items-center gap-1'>
                      <ListTodo className='w-3.5 h-3.5' />
                      {workflow.steps.length} {locale === 'zh' ? '步' : 'steps'}
                    </span>
                    {progress && !progress.isComplete && progress.percent > 0 && (
                      <span className='flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium'>
                        {progress.percent}%
                      </span>
                    )}
                    {progress?.isComplete && (
                      <span className='flex items-center gap-1 text-green-600 dark:text-green-400 font-medium'>
                        <CheckCircle2 className='w-3.5 h-3.5' />
                        {locale === 'zh' ? '已完成' : 'Done'}
                      </span>
                    )}
                  </div>
                  <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all' />
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-12 sm:py-16'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
            {activeTab === 'mine' ? (
              <FolderPlus className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            ) : activeTab === 'favorites' ? (
              <Star className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            ) : activeTab === 'completed' ? (
              <Trophy className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            ) : (
              <Search className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            )}
          </div>
          <p className='text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base'>
            {activeTab === 'mine'
              ? (locale === 'zh' ? '还没有创建工作流' : "You haven't created any workflow yet")
              : activeTab === 'favorites'
              ? (locale === 'zh' ? '还没有收藏的工作流' : 'No favorite workflows yet')
              : activeTab === 'completed'
              ? (locale === 'zh' ? '还没有完成的工作流' : 'No completed workflows yet')
              : activeTab === 'inprogress'
              ? (locale === 'zh' ? '暂无进行中的工作流' : 'No workflows in progress')
              : (locale === 'zh' ? '没有找到匹配的工作流' : 'No matching workflows found')}
          </p>
          {activeTab === 'mine' && (
            <button
              onClick={() => setShowCreatorCanvas(true)}
              className='inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors'
            >
              <Layers className='w-4 h-4' />
              {locale === 'zh' ? '创建第一个工作流（画布）' : 'Create Your First Workflow (Canvas)'}
            </button>
          )}
        </div>
      )}

      {showCreator && (
        <WorkflowCreator
          locale={locale}
          onClose={() => setShowCreator(false)}
        />
      )}

      {showCreatorCanvas && (
        <WorkflowCreatorCanvas
          locale={locale}
          onClose={() => setShowCreatorCanvas(false)}
        />
      )}
    </div>
  );
}
