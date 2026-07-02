'use client';
import { useState, useEffect } from 'react';
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
  Check,
  RotateCcw,
  Copy,
  QrCode,
  X,
  Edit3,
  Plus,
  Trash2,
  Save,
  Trophy,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { usePreferencesStore } from '@/stores/preferences';
import { logLike, logFavorite } from '@/utils/audit-log';
import type { Workflow } from '@/data/workflows';
import { getToolBySlug, tools } from '@/data/tools';
import type { CustomWorkflowStep, CustomWorkflow } from '@/stores/preferences';

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

interface WorkflowDetailProps {
  slug: string;
  locale: string;
  workflow?: Workflow;
  isCustom?: boolean;
  customWorkflow?: CustomWorkflow;
}

export default function WorkflowDetail({
  slug,
  locale,
  workflow,
  isCustom = false,
  customWorkflow,
}: WorkflowDetailProps) {
  const {
    toggleLike,
    isLiked,
    toggleFavorite,
    isFavorite,
    setWorkflowRating,
    getWorkflowRating,
    startWorkflowProgress,
    toggleStepComplete,
    getWorkflowProgress,
    clearWorkflowProgress,
    recordWorkflowComplete,
    addCustomWorkflow,
    updateCustomWorkflow,
    workflowStats,
    toggleWorkflowFavorite,
    isWorkflowFavorite,
  } = usePreferencesStore();

  const [hoverRating, setHoverRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [editSteps, setEditSteps] = useState<CustomWorkflowStep[]>([]);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentWorkflow = isCustom ? customWorkflow : workflow;
  const workflowId = currentWorkflow?.id || '';
  const userRating = getWorkflowRating(workflowId);
  const progress = getWorkflowProgress(workflowId);
  const totalSteps = currentWorkflow?.steps.length || 0;
  const completedCount = progress?.completedSteps.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isCompleted = progress?.completedAt ? true : completedCount === totalSteps && totalSteps > 0;
  const isStarted = !!progress;

  const avgRating = 4.5;
  const ratingCount = 128;

  const Icon = currentWorkflow?.icon ? (iconMap[currentWorkflow.icon] || Zap) : Zap;

  useEffect(() => {
    if (isCompleted && !progress?.completedAt && currentWorkflow) {
      recordWorkflowComplete(workflowId, totalSteps);
      setShowCompleteModal(true);
    }
  }, [isCompleted]);

  const handleStart = () => {
    startWorkflowProgress(workflowId, isCustom ? 'custom' : 'official', totalSteps);
  };

  const handleReset = () => {
    clearWorkflowProgress(workflowId);
    setShowCompleteModal(false);
  };

  const handleStepToggle = (index: number) => {
    if (!isStarted) {
      handleStart();
    }
    toggleStepComplete(workflowId, index);
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

  const generateShareUrl = () => {
    if (!currentWorkflow) return '';
    const data = {
      t: currentWorkflow.title,
      d: currentWorkflow.description,
      s: currentWorkflow.steps,
      i: currentWorkflow.icon || 'Zap',
      c: currentWorkflow.category || 'content-creator',
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return `${window.location.origin}/${locale}/workflow/share?d=${encoded}`;
  };

  const handleCopyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openEditModal = () => {
    if (!currentWorkflow) return;
    setEditTitle(currentWorkflow.title);
    setEditDescription(currentWorkflow.description || '');
    setEditSteps([...currentWorkflow.steps]);
    setShowEditModal(true);
  };

  const handleSaveAsCustom = () => {
    if (!currentWorkflow) return;
    const newWorkflow = {
      title: editTitle || currentWorkflow.title,
      description: editDescription || currentWorkflow.description,
      steps: editSteps,
      icon: currentWorkflow.icon || 'Zap',
      category: currentWorkflow.category || 'content-creator',
      tags: (currentWorkflow as any).tags || [],
      estimatedTime: (currentWorkflow as any).estimatedTime || '10分钟',
      difficulty: ((currentWorkflow as any).difficulty as 'easy' | 'medium' | 'advanced') || 'easy',
    };
    addCustomWorkflow(newWorkflow);
    setShowEditModal(false);
  };

  const handleUpdateCustom = () => {
    if (!customWorkflow) return;
    updateCustomWorkflow(customWorkflow.id, {
      title: editTitle,
      description: editDescription,
      steps: editSteps,
    });
    setShowEditModal(false);
  };

  const addStep = (toolSlug: string) => {
    const tool = getToolBySlug(toolSlug);
    if (!tool) return;
    setEditSteps([
      ...editSteps,
      {
        toolSlug,
        title: tool.name,
        description: tool.description.slice(0, 50),
      },
    ]);
    setShowToolPicker(false);
    setToolSearchQuery('');
  };

  const removeStep = (index: number) => {
    setEditSteps(editSteps.filter((_, i) => i !== index));
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editSteps.length) return;
    const newSteps = [...editSteps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    setEditSteps(newSteps);
  };

  const filteredTools = tools
    .filter(t =>
      t.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(toolSearchQuery.toLowerCase()))
    )
    .slice(0, 20);

  if (!currentWorkflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='text-center py-12'>
          <p className='text-gray-500 dark:text-gray-400'>
            {locale === 'zh' ? '工作流不存在' : 'Workflow not found'}
          </p>
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
            {locale === 'zh' ? '返回工作流列表' : 'Back to workflows'}
          </a>

          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8 mb-6'>
            <div className='flex items-start justify-between mb-4 sm:mb-6'>
              <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                <div className='p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-600 dark:text-primary-400 flex-shrink-0'>
                  <Icon className='w-6 h-6 sm:w-8 sm:h-8' />
                </div>
                <div className='min-w-0'>
                  <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 truncate'>
                    {currentWorkflow.title}
                  </h1>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2'>
                    {currentWorkflow.description}
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
                  <button
                    onClick={() => setShowShareModal(true)}
                    className='p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:text-primary-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-primary-400 transition-all hover:scale-105'
                  >
                    <Share2 className='w-4 h-4' />
                  </button>
                  <button
                    onClick={openEditModal}
                    className='p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:text-primary-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-primary-400 transition-all hover:scale-105'
                  >
                    <Edit3 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-2 mb-4'>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyStyle(currentWorkflow.difficulty || 'easy')}`}>
                {getDifficultyText(currentWorkflow.difficulty || 'easy')}
              </div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                <Clock className='w-3.5 h-3.5' />
                {(currentWorkflow as any).estimatedTime || '10分钟'}
              </div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
                <Play className='w-3.5 h-3.5' />
                {totalSteps} {locale === 'zh' ? '个步骤' : 'steps'}
              </div>
              {isCustom && (
                <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'>
                  {locale === 'zh' ? '我的工作流' : 'My Workflow'}
                </div>
              )}
            </div>

            {isStarted && (
              <div className='mb-2'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {locale === 'zh' ? '执行进度' : 'Progress'}
                  </span>
                  <span className='text-sm font-bold text-primary-600 dark:text-primary-400'>
                    {completedCount}/{totalSteps} ({progressPercent}%)
                  </span>
                </div>
                <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500'
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className='flex gap-2 mt-4'>
              {!isStarted ? (
                <button
                  onClick={handleStart}
                  className='flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2'
                >
                  <Play className='w-4 h-4 sm:w-5 sm:h-5' />
                  {locale === 'zh' ? '开始执行' : 'Start Workflow'}
                </button>
              ) : isCompleted ? (
                <>
                  <div className='flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-green-500 text-white rounded-xl flex items-center justify-center gap-2'>
                    <Check className='w-4 h-4 sm:w-5 sm:h-5' />
                    {locale === 'zh' ? '已完成' : 'Completed'}
                  </div>
                  <button
                    onClick={handleReset}
                    className='px-4 py-2.5 sm:py-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98] flex items-center gap-2'
                  >
                    <RotateCcw className='w-4 h-4' />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleReset}
                    className='px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98] flex items-center gap-2'
                  >
                    <RotateCcw className='w-4 h-4' />
                    <span className='hidden sm:inline'>{locale === 'zh' ? '重置' : 'Reset'}</span>
                  </button>
                  <div className='flex-1 py-2.5 text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center gap-2'>
                    {locale === 'zh' ? '进行中' : 'In Progress'}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
              <span className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold'>
                {totalSteps}
              </span>
              {locale === 'zh' ? '操作步骤' : 'Steps'}
            </h2>

            {currentWorkflow.steps.map((step: CustomWorkflowStep, index: number) => {
              const tool = getToolBySlug(step.toolSlug);
              const isLast = index === currentWorkflow.steps.length - 1;
              const isStepCompleted = progress?.completedSteps.includes(index);

              return (
                <div key={index} className='relative'>
                  <div className={`bg-white dark:bg-gray-800 rounded-xl border p-4 sm:p-5 transition-all ${
                    isStepCompleted
                      ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md'
                  }`}>
                    <div className='flex items-start gap-3 sm:gap-4'>
                      <div className='flex flex-col items-center flex-shrink-0'>
                        <button
                          onClick={() => handleStepToggle(index)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
                            isStepCompleted
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25'
                              : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/25 hover:scale-105'
                          }`}
                        >
                          {isStepCompleted ? <Check className='w-4 h-4 sm:w-5 sm:h-5' /> : index + 1}
                        </button>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${isStepCompleted ? 'bg-green-300 dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ minHeight: '20px' }} />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2 mb-1'>
                          <h3 className={`font-semibold text-sm sm:text-base ${isStepCompleted ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                            {step.title}
                          </h3>
                        </div>
                        <p className={`text-sm mb-3 ${isStepCompleted ? 'text-green-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                          {step.description}
                        </p>
                        {tool && (
                          <a
                            href={tool.externalUrl || `/${locale}/tool/${tool.slug}`}
                            target={tool.externalUrl ? '_blank' : '_self'}
                            rel={tool.externalUrl ? 'noopener noreferrer' : ''}
                            onClick={() => {
                              if (!isStepCompleted && isStarted) {
                                handleStepToggle(index);
                              }
                            }}
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
                {locale === 'zh' ? '工作流评分' : 'Workflow Rating'}
              </h3>
              <div className='flex items-center gap-1.5'>
                <span className='text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400'>{avgRating}</span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>/ 5.0</span>
              </div>
            </div>
            <div className='flex items-center gap-2 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setWorkflowRating(workflowId, star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className='p-0.5 transition-transform hover:scale-110 active:scale-95'
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                      (hoverRating || userRating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {userRating > 0
                ? (locale === 'zh' ? `你已打 ${userRating} 星 · ` : `You rated ${userRating} stars · `)
                : (locale === 'zh' ? '点击星星评分 · ' : 'Click stars to rate · ')}
              {ratingCount} {locale === 'zh' ? '人评价' : 'ratings'}
            </p>
          </div>

          <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-white dark:bg-gray-800 text-purple-500 flex-shrink-0'>
                <Zap className='w-5 h-5' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base'>
                  {locale === 'zh' ? '一键AI推荐' : 'AI Recommendation'}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                  {locale === 'zh' ? '不确定用什么工具？让AI根据你的需求智能推荐。' : 'Not sure what tools to use? Let AI recommend based on your needs.'}
                </p>
              </div>
              <a
                href={`/${locale}`}
                className='inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:shadow-md transition-all group flex-shrink-0'
              >
                <span className='hidden sm:inline'>{locale === 'zh' ? '去首页' : 'Homepage'}</span>
                <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowShareModal(false)}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                {locale === 'zh' ? '分享工作流' : 'Share Workflow'}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-4 overflow-y-auto'>
              <div className='bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-2xl p-5 sm:p-6 mb-5 text-white shadow-xl'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='p-2.5 bg-white/20 backdrop-blur rounded-xl'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <span className='text-xs px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium'>
                    {locale === 'zh' ? 'AI工作流' : 'AI Workflow'}
                  </span>
                </div>
                <h3 className='text-lg sm:text-xl font-bold mb-1.5 line-clamp-1'>
                  {currentWorkflow.title}
                </h3>
                <p className='text-sm text-white/80 line-clamp-2 mb-4'>
                  {currentWorkflow.description}
                </p>
                <div className='flex items-center gap-3 text-sm'>
                  <span className='flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full'>
                    <Clock className='w-3.5 h-3.5' />
                    {(currentWorkflow as any).estimatedTime || '10分钟'}
                  </span>
                  <span className='flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full'>
                    <Play className='w-3.5 h-3.5' />
                    {currentWorkflow.steps.length} {locale === 'zh' ? '步骤' : 'steps'}
                  </span>
                </div>
              </div>

              <div className='flex flex-col items-center py-2'>
                <div className='w-40 h-40 bg-white rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 mb-4'>
                  <QrCode className='w-32 h-32 text-gray-800' />
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-4'>
                  {locale === 'zh' ? '扫码查看工作流' : 'Scan to view workflow'}
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={handleCopyLink}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                  {copied ? (locale === 'zh' ? '已复制' : 'Copied') : (locale === 'zh' ? '复制链接' : 'Copy Link')}
                </button>
              </div>
              <p className='text-xs text-gray-400 dark:text-gray-500 text-center mt-4'>
                {locale === 'zh' ? '对方打开链接后可保存到自己的工作流' : 'Recipients can save to their own workflows'}
              </p>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowEditModal(false)}>
          <div
            className='w-full sm:max-w-2xl bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                {isCustom ? (locale === 'zh' ? '编辑工作流' : 'Edit Workflow') : (locale === 'zh' ? '另存为我的工作流' : 'Save as My Workflow')}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-4 overflow-y-auto flex-1'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    {locale === 'zh' ? '工作流名称' : 'Workflow Name'}
                  </label>
                  <input
                    type='text'
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                    placeholder={locale === 'zh' ? '输入工作流名称' : 'Enter workflow name'}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    {locale === 'zh' ? '工作流描述' : 'Description'}
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                    placeholder={locale === 'zh' ? '简要描述这个工作流' : 'Brief description'}
                  />
                </div>
                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {locale === 'zh' ? '步骤列表' : 'Steps'}
                    </label>
                    <button
                      onClick={() => setShowToolPicker(true)}
                      className='text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1'
                    >
                      <Plus className='w-3.5 h-3.5' />
                      {locale === 'zh' ? '添加步骤' : 'Add Step'}
                    </button>
                  </div>
                  <div className='space-y-2'>
                    {editSteps.map((step, index) => {
                      const tool = getToolBySlug(step.toolSlug);
                      return (
                        <div key={index} className='flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
                          <div className='flex flex-col items-center gap-0.5 flex-shrink-0 pt-1'>
                            <button
                              onClick={() => moveStep(index, index - 1)}
                              disabled={index === 0}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors'
                            >
                              <ChevronLeft className='w-3 h-3 rotate-90' />
                            </button>
                            <div className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center'>
                              {index + 1}
                            </div>
                            <button
                              onClick={() => moveStep(index, index + 1)}
                              disabled={index === editSteps.length - 1}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors'
                            >
                              <ChevronLeft className='w-3 h-3 -rotate-90' />
                            </button>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <input
                              type='text'
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [...editSteps];
                                newSteps[index].title = e.target.value;
                                setEditSteps(newSteps);
                              }}
                              className='w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none mb-1'
                            />
                            <input
                              type='text'
                              value={step.description}
                              onChange={(e) => {
                                const newSteps = [...editSteps];
                                newSteps[index].description = e.target.value;
                                setEditSteps(newSteps);
                              }}
                              className='w-full bg-transparent text-xs text-gray-500 dark:text-gray-400 focus:outline-none'
                            />
                            {tool && (
                              <p className='text-xs text-primary-600 dark:text-primary-400 mt-1'>
                                {tool.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeStep(index)}
                            className='p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      );
                    })}
                    {editSteps.length === 0 && (
                      <div className='text-center py-8 text-gray-400 dark:text-gray-500 text-sm'>
                        {locale === 'zh' ? '还没有步骤，点击上方添加' : 'No steps yet, add one above'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2'>
              <button
                onClick={() => setShowEditModal(false)}
                className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98]'
              >
                {locale === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={isCustom ? handleUpdateCustom : handleSaveAsCustom}
                disabled={editSteps.length === 0 || !editTitle.trim()}
                className='flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2'
              >
                <Save className='w-4 h-4' />
                {isCustom ? (locale === 'zh' ? '保存修改' : 'Save') : (locale === 'zh' ? '保存到我的工作流' : 'Save to My Workflows')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToolPicker && (
        <div className='fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowToolPicker(false)}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2 mb-3'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex-1'>
                  {locale === 'zh' ? '选择工具' : 'Select Tool'}
                </h3>
                <button
                  onClick={() => setShowToolPicker(false)}
                  className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              <input
                type='text'
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                placeholder={locale === 'zh' ? '搜索工具...' : 'Search tools...'}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                autoFocus
              />
            </div>
            <div className='overflow-y-auto flex-1'>
              {filteredTools.length > 0 ? (
                <div className='p-2'>
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => addStep(tool.slug)}
                      className='w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3'
                    >
                      <div className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0'>
                        <Code className='w-4 h-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                          {tool.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {tool.tags.slice(0, 2).join(' · ')}
                        </p>
                      </div>
                      <Plus className='w-4 h-4 text-gray-400 flex-shrink-0' />
                    </button>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12 text-gray-400 dark:text-gray-500 text-sm'>
                  {locale === 'zh' ? '未找到相关工具' : 'No tools found'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center'>
            <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-bounce'>
              <Trophy className='w-10 h-10 text-white' />
            </div>
            <h3 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
              {locale === 'zh' ? '🎉 太棒了！' : '🎉 Awesome!'}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              {locale === 'zh'
                ? `你已完成「${currentWorkflow.title}」工作流，继续加油！`
                : `You completed "${currentWorkflow.title}" workflow!`}
            </p>
            <div className='grid grid-cols-3 gap-3 mb-6'>
              <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <p className='text-xl font-bold text-primary-600 dark:text-primary-400'>{totalSteps}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{locale === 'zh' ? '步骤' : 'Steps'}</p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <p className='text-xl font-bold text-green-600 dark:text-green-400'>{Math.round(totalSteps * 5)}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{locale === 'zh' ? '分钟节省' : 'Min Saved'}</p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <p className='text-xl font-bold text-purple-600 dark:text-purple-400'>{workflowStats.totalCompleted}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{locale === 'zh' ? '累计完成' : 'Total Done'}</p>
              </div>
            </div>

            <div className='bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6'>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-3'>
                {locale === 'zh' ? '🏆 解锁成就' : '🏆 Achievements Unlocked'}
              </p>
              <div className='flex gap-3 justify-center flex-wrap'>
                <div className='flex flex-col items-center'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg'>
                    🎯
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                    {locale === 'zh' ? '初次完成' : 'First Win'}
                  </p>
                </div>
                {totalSteps >= 3 && (
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shadow-lg'>
                      ⚡
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                      {locale === 'zh' ? '效率达人' : 'Efficiency Pro'}
                    </p>
                  </div>
                )}
                {workflowStats.totalCompleted >= 5 && (
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-xl shadow-lg'>
                      🔥
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                      {locale === 'zh' ? '连续5天' : '5-Day Streak'}
                    </p>
                  </div>
                )}
                {workflowStats.streakDays >= 3 && (
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-xl shadow-lg'>
                      🌟
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                      {locale === 'zh' ? '坚持者' : 'Persistent'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setShowCompleteModal(false)}
                className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98]'
              >
                {locale === 'zh' ? '关闭' : 'Close'}
              </button>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setShowShareModal(true);
                }}
                className='flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2'
              >
                <Share2 className='w-4 h-4' />
                {locale === 'zh' ? '分享' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
