'use client';
import { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  ChevronRight,
  Search,
  TrendingUp,
  Star,
  Play,
  Bookmark,
  Filter,
  Layers,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  Users,
  Briefcase,
  Palette,
  Code,
  GraduationCap,
  Film,
  Megaphone,
  ArrowLeft,
} from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';
import { workflows, Workflow } from '@/data/workflows';
import { useRouter } from 'next/navigation';

const categoryInfo: Record<string, { name: string; icon: any; color: string }> = {
  'content-creator': { name: '内容创作者', icon: Megaphone, color: 'from-pink-500 to-rose-500' },
  'designer': { name: '设计师', icon: Palette, color: 'from-purple-500 to-indigo-500' },
  'developer': { name: '开发者', icon: Code, color: 'from-blue-500 to-cyan-500' },
  'office-worker': { name: '职场办公', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
  'student': { name: '学生学习', icon: GraduationCap, color: 'from-yellow-500 to-orange-500' },
  'video-creator': { name: '视频创作者', icon: Film, color: 'from-red-500 to-pink-500' },
};

const difficultyText: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  advanced: '进阶',
};

const difficultyColor: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function WorkflowTemplates({ locale }: { locale: string }) {
  const router = useRouter();
  const { favoriteWorkflows, toggleWorkflowFavorite } = usePreferencesStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'easiest'>('popular');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex-1 min-w-0'>
        <div className='animate-pulse space-y-6'>
          <div className='h-48 bg-gray-200 dark:bg-gray-700 rounded-3xl' />
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className='h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.entries(categoryInfo);
  
  const filteredWorkflows = workflows.filter(w => {
    const matchesSearch = !searchQuery || 
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || w.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0;
      case 'easiest':
        const order = { easy: 0, medium: 1, advanced: 2 };
        return order[a.difficulty] - order[b.difficulty];
      case 'popular':
      default:
        return b.steps.length - a.steps.length;
    }
  });

  const featuredWorkflows = workflows.slice(0, 3);
  
  const isFavorite = (id: string) => favoriteWorkflows.includes(id);

  const handleStartWorkflow = (slug: string) => {
    router.push(`/${locale}/workflow/${slug}`);
  };

  return (
    <div className='flex-1 min-w-0 space-y-6 sm:space-y-8'>
      <div className='flex items-center gap-4'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
          <ArrowLeft className='h-5 w-5' />
          <span className='text-sm font-medium'>{locale === 'zh' ? '返回首页' : 'Back'}</span>
        </a>
      </div>

      <div className='relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 lg:p-10 text-white'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl' />
        
        <div className='relative z-10 max-w-2xl'>
          <div className='inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm mb-4'>
            <Sparkles className='h-4 w-4' />
            <span>{locale === 'zh' ? '精选工作流模板' : 'Featured Workflow Templates'}</span>
          </div>
          
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-3'>
            {locale === 'zh' ? '一键开启高效工作流' : 'Start Efficient Workflows with One Click'}
          </h1>
          
          <p className='text-white/80 text-base sm:text-lg mb-6'>
            {locale === 'zh' 
              ? '精选 20+ 专业工作流模板，涵盖设计、开发、运营、学习等场景，帮你节省 80% 的重复工作时间'
              : '20+ professional workflow templates for design, development, operations, and learning. Save 80% of your time on repetitive tasks.'}
          </p>
          
          <div className='flex flex-wrap gap-3'>
            <button 
              onClick={() => {
                const el = document.getElementById('templates-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-600 rounded-xl font-medium hover:bg-white/90 transition-colors shadow-lg'
            >
              <Zap className='h-4 w-4' />
              {locale === 'zh' ? '浏览模板' : 'Browse Templates'}
            </button>
            <button 
              onClick={() => router.push(`/${locale}/workflows`)}
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur text-white rounded-xl font-medium hover:bg-white/30 transition-colors'
            >
              <Layers className='h-4 w-4' />
              {locale === 'zh' ? '我的工作流' : 'My Workflows'}
            </button>
          </div>
          
          <div className='flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/20'>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-300' />
              <span className='text-sm'>{locale === 'zh' ? '20+ 精选模板' : '20+ Templates'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-300' />
              <span className='text-sm'>{locale === 'zh' ? '即开即用' : 'Ready to Use'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-300' />
              <span className='text-sm'>{locale === 'zh' ? '完全免费' : '100% Free'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder={locale === 'zh' ? '搜索工作流模板...' : 'Search workflow templates...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
            />
          </div>
          <div className='flex gap-2 overflow-x-auto pb-1 sm:pb-0'>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className='px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 flex-shrink-0'
            >
              <option value='popular'>{locale === 'zh' ? '最受欢迎' : 'Most Popular'}</option>
              <option value='newest'>{locale === 'zh' ? '最新发布' : 'Newest'}</option>
              <option value='easiest'>{locale === 'zh' ? '最简单' : 'Easiest'}</option>
            </select>
          </div>
        </div>
        
        <div className='flex gap-2 mt-4 overflow-x-auto pb-1 -mx-1 px-1'>
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className='h-3.5 w-3.5' />
            {locale === 'zh' ? '全部' : 'All'}
          </button>
          {categories.map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === key
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='h-3.5 w-3.5' />
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Flame className='h-5 w-5 text-orange-500' />
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
              {locale === 'zh' ? '精选推荐' : 'Featured'}
            </h2>
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
          {featuredWorkflows.map((workflow, index) => (
            <FeaturedTemplateCard
              key={workflow.id}
              workflow={workflow}
              rank={index + 1}
              locale={locale}
              isFavorite={isFavorite(workflow.id)}
              onToggleFavorite={() => toggleWorkflowFavorite(workflow.id)}
              onStart={() => handleStartWorkflow(workflow.slug)}
            />
          ))}
        </div>
      </div>

      <div id='templates-grid'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Layers className='h-5 w-5 text-purple-500' />
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
              {locale === 'zh' ? '全部模板' : 'All Templates'}
            </h2>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              ({sortedWorkflows.length})
            </span>
          </div>
        </div>
        
        {sortedWorkflows.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <Search className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {locale === 'zh' ? '没有找到匹配的模板' : 'No matching templates found'}
            </h3>
            <p className='text-gray-500 dark:text-gray-400'>
              {locale === 'zh' ? '试试其他关键词或分类' : 'Try other keywords or categories'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
            {sortedWorkflows.map((workflow) => (
              <TemplateCard
                key={workflow.id}
                workflow={workflow}
                locale={locale}
                isFavorite={isFavorite(workflow.id)}
                onToggleFavorite={() => toggleWorkflowFavorite(workflow.id)}
                onStart={() => handleStartWorkflow(workflow.slug)}
              />
            ))}
          </div>
        )}
      </div>

      <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 border border-green-100 dark:border-green-800'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Award className='h-5 w-5 text-green-600 dark:text-green-400' />
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                {locale === 'zh' ? '想创建自己的工作流？' : 'Want to create your own workflow?'}
              </h3>
            </div>
            <p className='text-gray-600 dark:text-gray-300'>
              {locale === 'zh' 
                ? '完全自定义你的工作流程，组合任意工具，打造专属效率工具'
                : 'Fully customize your workflow, combine any tools, and build your own productivity system.'}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/workflows`)}
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-green-200 dark:shadow-green-900/30 whitespace-nowrap'
          >
            <Zap className='h-4 w-4' />
            {locale === 'zh' ? '立即创建' : 'Create Now'}
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedTemplateCard({ 
  workflow, 
  rank, 
  locale, 
  isFavorite, 
  onToggleFavorite, 
  onStart 
}: { 
  workflow: Workflow; 
  rank: number; 
  locale: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStart: () => void;
}) {
  const catInfo = categoryInfo[workflow.category];
  const Icon = catInfo?.icon || Zap;
  
  return (
    <div className='group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300'>
      <div className={`h-2 bg-gradient-to-r ${catInfo?.color || 'from-purple-500 to-pink-500'}`} />
      
      <div className='p-5'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <div className={`w-11 h-11 bg-gradient-to-br ${catInfo?.color || 'from-purple-500 to-pink-500'} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full'>
                  #{rank}
                </span>
              </div>
              <h3 className='font-bold text-gray-900 dark:text-white mt-1'>
                {workflow.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite 
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2'>
          {workflow.description}
        </p>
        
        <div className='flex flex-wrap gap-2 mb-4'>
          {workflow.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className='text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md'
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4'>
          <div className='flex items-center gap-1'>
            <Layers className='h-3.5 w-3.5' />
            <span>{workflow.steps.length} {locale === 'zh' ? '步骤' : 'steps'}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-3.5 w-3.5' />
            <span>{workflow.estimatedTime}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[workflow.difficulty]}`}>
            {difficultyText[workflow.difficulty]}
          </span>
        </div>
        
        <button
          onClick={onStart}
          className='w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/30 group-hover:shadow-xl'
        >
          <Play className='h-4 w-4' />
          {locale === 'zh' ? '开始使用' : 'Start Now'}
        </button>
      </div>
    </div>
  );
}

function TemplateCard({ 
  workflow, 
  locale, 
  isFavorite, 
  onToggleFavorite, 
  onStart 
}: { 
  workflow: Workflow; 
  locale: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStart: () => void;
}) {
  const catInfo = categoryInfo[workflow.category];
  const Icon = catInfo?.icon || Zap;
  
  return (
    <div className='group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300'>
      <div className='flex items-start justify-between mb-3'>
        <div className={`w-10 h-10 bg-gradient-to-br ${catInfo?.color || 'from-purple-500 to-pink-500'} rounded-xl flex items-center justify-center text-white shadow-md`}>
          <Icon className='h-4.5 w-4.5' />
        </div>
        <button
          onClick={onToggleFavorite}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite 
              ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <h3 className='font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
        {workflow.title}
      </h3>
      
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
        {workflow.description}
      </p>
      
      <div className='flex flex-wrap gap-1.5 mb-4'>
        {workflow.tags.slice(0, 2).map(tag => (
          <span 
            key={tag}
            className='text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md'
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4'>
        <div className='flex items-center gap-1'>
          <Layers className='h-3 w-3' />
          <span>{workflow.steps.length}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Clock className='h-3 w-3' />
          <span>{workflow.estimatedTime}</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${difficultyColor[workflow.difficulty]}`}>
          {difficultyText[workflow.difficulty]}
        </span>
      </div>
      
      <button
        onClick={onStart}
        className='w-full flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm'
      >
        <Play className='h-3.5 w-3.5' />
        {locale === 'zh' ? '开始使用' : 'Start'}
        <ChevronRight className='h-3.5 w-3.5 ml-0.5' />
      </button>
    </div>
  );
}
