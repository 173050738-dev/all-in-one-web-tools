'use client';
import {
  ChevronLeft,
  Clock,
  Zap,
  Play,
  ArrowRight,
  ExternalLink,
  Presentation,
  Image,
  FileText,
  Code,
  Share2,
  GraduationCap,
  Video,
  Star,
  Heart,
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
import { logLike, logFavorite } from '@/utils/audit-log';
import type { Workflow } from '@/data/workflows';
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

interface WorkflowDetailSimpleProps {
  slug: string;
  locale: string;
  workflow?: Workflow;
}

export default function WorkflowDetailSimple({
  slug,
  locale,
  workflow,
}: WorkflowDetailSimpleProps) {
  const { toggleLike, isLiked, toggleWorkflowFavorite, isWorkflowFavorite } = usePreferencesStore();

  const workflowId = workflow?.id || '';
  const totalSteps = workflow?.steps.length || 0;

  const avgRating = 4.5;
  const ratingCount = 128;

  const Icon = workflow?.icon ? (iconMap[workflow.icon] || Zap) : Zap;

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
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'advanced': return 'Advanced';
      default: return '';
    }
  };

  if (!workflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='text-center py-12'>
          <p className='text-gray-500 dark:text-gray-400'>Workflow not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='workflows' />

        <div className='flex-1 min-w-0'>
          <a
            href={`/${locale}/workflows`}
            className='inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors'
          >
            <ChevronLeft className='w-4 h-4' />
            Back to workflows
          </a>

          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8 mb-6'>
            <div className='flex items-start justify-between mb-4 sm:mb-6'>
              <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                <div className='p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-600 dark:text-primary-400 flex-shrink-0'>
                  <Icon className='w-6 h-6 sm:w-8 sm:h-8' />
                </div>
                <div className='min-w-0'>
                  <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 truncate'>
                    {workflow.title}
                  </h1>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2'>
                    {workflow.description}
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1 flex-shrink-0 ml-3'>
                <div className='flex items-center gap-1'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWorkflowFavorite(workflowId);
                      logFavorite(workflowId);
                    }}
                    className={`p-1.5 rounded-lg transition-all hover:scale-105 ${
                      isWorkflowFavorite(workflowId)
                        ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30'
                        : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-orange-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isWorkflowFavorite(workflowId) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(workflowId);
                      logLike(workflowId);
                    }}
                    className={`p-1.5 rounded-lg transition-all hover:scale-105 ${
                      isLiked(workflowId)
                        ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
                        : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked(workflowId) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-2 mb-4'>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyStyle(workflow.difficulty)}`}>
                {getDifficultyText(workflow.difficulty)}
              </div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                <Clock className='w-3.5 h-3.5' />
                {workflow.estimatedTime}
              </div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
                <Play className='w-3.5 h-3.5' />
                {totalSteps} steps
              </div>
            </div>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
              <span className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold'>
                {totalSteps}
              </span>
              Steps
            </h2>

            {workflow.steps.map((step, index) => {
              const tool = getToolBySlug(step.toolSlug);
              const isLast = index === workflow.steps.length - 1;

              return (
                <div key={index} className='relative'>
                  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5'>
                    <div className='flex items-start gap-3 sm:gap-4'>
                      <div className='flex flex-col items-center flex-shrink-0'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/25'>
                          {index + 1}
                        </div>
                        {!isLast && (
                          <div className='w-0.5 flex-1 mt-1 min-h-[20px] bg-gray-200 dark:bg-gray-700' style={{ minHeight: '20px' }} />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2 mb-1'>
                          <h3 className='font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                            {step.title}
                          </h3>
                        </div>
                        <p className='text-sm mb-3 text-gray-600 dark:text-gray-400'>
                          {step.description}
                        </p>
                        {tool && (
                          <a
                            href={tool.externalUrl || `/${locale}/tool/${tool.slug}`}
                            target={tool.externalUrl ? '_blank' : '_self'}
                            rel={tool.externalUrl ? 'noopener noreferrer' : ''}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors group'
                          >
                            {tool.name}
                            <ExternalLink className='w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform' />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base'>
                Workflow Rating
              </h3>
              <div className='flex items-center gap-1.5'>
                <span className='text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400'>{avgRating}</span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>/ 5.0</span>
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {ratingCount} ratings
            </p>
          </div>

          <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-white dark:bg-gray-800 text-purple-500 flex-shrink-0'>
                <Zap className='w-5 h-5' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base'>
                  AI Recommendation
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                  Not sure what tools to use? Let AI recommend based on your needs.
                </p>
              </div>
              <a
                href={`/${locale}`}
                className='inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:shadow-md transition-all group flex-shrink-0'
              >
                <span className='hidden sm:inline'>Homepage</span>
                <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
