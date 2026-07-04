'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import {
  Zap,
  ChevronLeft,
  Clock,
  Play,
  ArrowRight,
  Save,
  Code,
  FileText,
  Image,
  Presentation,
  Share2,
  GraduationCap,
  Video,
  Palette,
  Globe,
  TrendingUp,
  Mail,
  Headphones,
  ShoppingCart,
  Calendar,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { usePreferencesStore } from '@/stores/preferences';
import { getToolBySlug } from '@/data/tools';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Presentation,
  Image,
  FileText,
  Code,
  Share2,
  GraduationCap,
  Video,
  Zap,
  Palette,
  Globe,
  TrendingUp,
  Mail,
  Headphones,
  ShoppingCart,
  Calendar,
};

export default function WorkflowSharePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'zh';
  const { addCustomWorkflow } = usePreferencesStore();
  const [workflow, setWorkflow] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = searchParams.get('d');
    if (!data) {
      setError(locale === 'zh' ? '无效的分享链接' : 'Invalid share link');
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(data)));
      const parsed = JSON.parse(decoded);
      setWorkflow({
        title: parsed.t,
        description: parsed.d,
        steps: parsed.s,
        icon: parsed.i || 'Zap',
        category: parsed.c || 'content-creator',
        estimatedTime: parsed.e || '10分钟',
        difficulty: parsed.diff || 'easy',
      });
    } catch {
      setError(locale === 'zh' ? '分享数据解析失败' : 'Failed to parse share data');
    }
  }, [searchParams, locale]);

  const handleSave = () => {
    if (!workflow) return;
    addCustomWorkflow({
      title: workflow.title,
      description: workflow.description,
      steps: workflow.steps,
      icon: workflow.icon,
      category: workflow.category,
      tags: [],
      estimatedTime: workflow.estimatedTime,
      difficulty: workflow.difficulty,
      isShared: true,
    });
    setSaved(true);
    setTimeout(() => {
      router.push(`/${locale}/workflows`);
    }, 1500);
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

  const Icon = workflow?.icon ? (iconMap[workflow.icon] || Zap) : Zap;

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='workflows' />

        <div className='flex-1 min-w-0'>
          <a
            href={`/${locale}/workflows`}
            className='inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-3 sm:mb-4 transition-colors'
          >
            <ChevronLeft className='w-3.5 h-3.5' />
            {locale === 'zh' ? '返回工作流列表' : 'Back to workflows'}
          </a>

          {error ? (
            <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center'>
              <div className='w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center'>
                <Code className='w-6 h-6 sm:w-7 sm:h-7 text-red-500' />
              </div>
              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>{error}</p>
              <a
                href={`/${locale}/workflows`}
                className='inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-[11px] sm:text-xs'
              >
                {locale === 'zh' ? '返回工作流' : 'Back to Workflows'}
              </a>
            </div>
          ) : workflow ? (
            <>
              <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-5 sm:mb-6'>
                <div className='flex items-start justify-between mb-3 sm:mb-5'>
                  <div className='flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0'>
                    <div className='p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0'>
                      <Icon className='w-5 h-5 sm:w-6 sm:h-6' />
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-1.5 mb-0.5'>
                        <span className='text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'>
                          {locale === 'zh' ? '分享的工作流' : 'Shared Workflow'}
                        </span>
                      </div>
                      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 truncate'>
                        {workflow.title}
                      </h1>
                      <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                        {workflow.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4'>
                  <div className={`flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium ${getDifficultyStyle(workflow.difficulty)}`}>
                    {getDifficultyText(workflow.difficulty)}
                  </div>
                  <div className='flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                    <Clock className='w-3 h-3' />
                    {workflow.estimatedTime}
                  </div>
                  <div className='flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
                    <Play className='w-3 h-3' />
                    {workflow.steps.length} {locale === 'zh' ? '个步骤' : 'steps'}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`w-full py-2.5 sm:py-3 text-[11px] sm:text-xs font-medium rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                    saved
                      ? 'bg-green-500 text-white shadow-green-500/25'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-purple-500/25'
                  }`}
                >
                  <Save className='w-4 h-4 sm:w-5 sm:h-5' />
                  {saved
                    ? (locale === 'zh' ? '已保存，正在跳转...' : 'Saved, redirecting...')
                    : (locale === 'zh' ? '保存到我的工作流' : 'Save to My Workflows')}
                </button>
              </div>

              <div className='space-y-2.5 sm:space-y-3'>
                <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2 sm:mb-2.5'>
                  <span className='w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[11px] sm:text-xs font-bold'>
                    {workflow.steps.length}
                  </span>
                  {locale === 'zh' ? '操作步骤' : 'Steps'}
                </h2>

                {workflow.steps.map((step: any, index: number) => {
                  const tool = getToolBySlug(step.toolSlug);
                  const isLast = index === workflow.steps.length - 1;

                  return (
                    <div key={index} className='relative'>
                      <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
                        <div className='flex items-start gap-2.5 sm:gap-3'>
                          <div className='flex flex-col items-center flex-shrink-0'>
                            <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-[11px] shadow-lg shadow-primary-500/25'>
                              {index + 1}
                            </div>
                            {!isLast && (
                              <div className='w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1' style={{ minHeight: '20px' }} />
                            )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-[11px] sm:text-xs mb-0.5'>
                              {step.title}
                            </h3>
                            <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mb-2.5 leading-relaxed'>
                              {step.description}
                            </p>
                            {tool && tool.externalUrl && (
                              <a
                                href={tool.externalUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-1 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors group'
                              >
                                {tool.name}
                                <ArrowRight className='w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform' />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className='text-center py-10 sm:py-12'>
              <div className='w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse'>
                <Code className='w-6 h-6 sm:w-7 sm:h-7 text-gray-400' />
              </div>
              <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>
                {locale === 'zh' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
