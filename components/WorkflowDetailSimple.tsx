'use client';
import dynamic from 'next/dynamic';
import { Fragment, useState, useEffect, useMemo } from 'react';
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
import { resolveToolLink, isExternalTool, getToolDisplayLabel } from '@/lib/toolLinks';
import { translateWorkflow } from '@/lib/workflowTranslations';
import type { Locale } from '@/lib/workflowTranslations';

const KofiUnlockBanner = dynamic(() => import('@/components/KofiUnlockBanner'), { ssr: false });
const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="w-full min-h-[110px] sm:min-h-[120px] rounded-xl border border-transparent" />
  ),
});

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

const translations: Record<string, Record<string, string>> = {
  zh: {
    'action.back': '返回工作流列表',
    'state.notFound': '工作流不存在',
    'label.steps': '步骤',
    'label.rating': '工作流评分',
    'label.aiRecommend': '一键AI推荐',
    'label.aiRecommendDesc': '不确定用什么工具？让AI根据你的需求智能推荐。',
    'label.homepage': '去首页',
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.advanced': '进阶',
    'rating.people': '人评价',
  },
  en: {
    'action.back': 'Back to workflows',
    'state.notFound': 'Workflow not found',
    'label.steps': 'Steps',
    'label.rating': 'Workflow Rating',
    'label.aiRecommend': 'AI Recommendation',
    'label.aiRecommendDesc': 'Not sure what tools to use? Let AI recommend based on your needs.',
    'label.homepage': 'Homepage',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.advanced': 'Advanced',
    'rating.people': 'ratings',
  },
  hi: {
    'action.back': 'वर्कफ़्लो सूची पर वापस',
    'state.notFound': 'वर्कफ़्लो नहीं मिला',
    'label.steps': 'चरण',
    'label.rating': 'वर्कफ़्लो रेटिंग',
    'label.aiRecommend': 'AI अनुशंसा',
    'label.aiRecommendDesc': 'कौन से टूल उपयोग करें? AI को आपकी ज़रूरत के अनुसार अनुशंसा करने दें।',
    'label.homepage': 'होमपेज',
    'difficulty.easy': 'आसान',
    'difficulty.medium': 'मध्यम',
    'difficulty.advanced': 'उन्नत',
    'rating.people': 'मूल्यांकन',
  },
  fr: {
    'action.back': 'Retour aux workflows',
    'state.notFound': 'Workflow non trouvé',
    'label.steps': 'Étapes',
    'label.rating': 'Note du Workflow',
    'label.aiRecommend': 'Recommandation IA',
    'label.aiRecommendDesc': 'Pas sûr des outils? Laissez l\'IA recommander selon vos besoins.',
    'label.homepage': 'Accueil',
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.advanced': 'Avancé',
    'rating.people': 'notes',
  },
  es: {
    'action.back': 'Volver a flujos',
    'state.notFound': 'Flujo no encontrado',
    'label.steps': 'Pasos',
    'label.rating': 'Valoración del Flujo',
    'label.aiRecommend': 'Recomendación IA',
    'label.aiRecommendDesc': '¿No sabes qué herramientas usar? Deja que la IA recomiende según tus necesidades.',
    'label.homepage': 'Inicio',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.advanced': 'Avanzado',
    'rating.people': 'valoraciones',
  },
  ar: {
    'action.back': 'العودة إلى قائمة سير العمل',
    'state.notFound': 'سير العمل غير موجود',
    'label.steps': 'الخطوات',
    'label.rating': 'تقييم سير العمل',
    'label.aiRecommend': 'توصية الذكاء الاصطناعي',
    'label.aiRecommendDesc': 'لست متأكداً من الأدوات؟ دع الذكاء الاصطناعي يوصي بناءً على احتياجاتك.',
    'label.homepage': 'الصفحة الرئيسية',
    'difficulty.easy': 'سهل',
    'difficulty.medium': 'متوسط',
    'difficulty.advanced': 'متقدم',
    'rating.people': 'تقييمات',
  },
};

const getT = (loc: string) => {
  const dict = translations[loc] || translations.zh;
  return (key: string) => dict[key] ?? translations.zh[key] ?? key;
};

interface WorkflowDetailSimpleProps {
  slug: string;
  locale: string;
  workflow?: Workflow;
}

export default function WorkflowDetailSimple({
  slug,
  locale,
  workflow: workflowProp,
}: WorkflowDetailSimpleProps) {
  const t = getT(locale);
  const { toggleLike, isLiked, toggleWorkflowFavorite, isWorkflowFavorite } = usePreferencesStore();

  const [resolvedWorkflow, setResolvedWorkflow] = useState<Workflow | undefined>(workflowProp);
  const [wfLoaded, setWfLoaded] = useState<boolean>(!!workflowProp);
  useEffect(() => {
    if (workflowProp || wfLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/data/workflows');
        if (cancelled) return;
        const found = (mod.getWorkflowBySlug || (() => undefined))(slug);
        if (found && !cancelled) setResolvedWorkflow(found as Workflow);
      } catch (e) {
        // 静默：懒加载失败不阻断渲染，走 notFound 分支
      } finally {
        if (!cancelled) setWfLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, workflowProp, wfLoaded]);

  const translatedWorkflow = useMemo(
    () => (resolvedWorkflow ? translateWorkflow(resolvedWorkflow, locale as Locale) : undefined),
    [resolvedWorkflow, locale],
  );
  const displayWorkflow = translatedWorkflow || resolvedWorkflow;

  const workflowId = displayWorkflow?.id || '';
  const showKofi = useMemo(() => locale === 'zh' || locale === 'en' || true, [locale]);
  const [adMounted, setAdMounted] = useState(false);
  useEffect(() => { setAdMounted(true); }, []);
  const totalSteps = displayWorkflow?.steps.length || 0;

  const avgRating = 4.5;
  const ratingCount = 128;

  const Icon = displayWorkflow?.icon ? (iconMap[displayWorkflow.icon] || Zap) : Zap;

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

  if (!displayWorkflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='text-center py-12'>
          <p className='text-gray-500 dark:text-gray-400'>{t('state.notFound')}</p>
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
            className='inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-3 sm:mb-4 transition-colors'
          >
            <ChevronLeft className='w-3.5 h-3.5' />
            {t('action.back')}
          </a>

          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-5 sm:mb-6'>
            <div className='flex items-start justify-between mb-3 sm:mb-5'>
              <div className='flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0'>
                <div className='p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-600 dark:text-primary-400 flex-shrink-0'>
                  <Icon className='w-5 h-5 sm:w-6 sm:h-6' />
                </div>
                <div className='min-w-0'>
                  <h1 className='text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1 truncate'>
                    {displayWorkflow.title}
                  </h1>
                  <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                    {displayWorkflow.description}
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1 flex-shrink-0 ml-2.5'>
                <div className='flex items-center gap-1'>
                  {/* 收藏/点赞：可见盒子严格 = 难度/限时免费 badge（px-1.5 py-0.5 rounded-md），外层透明区保证 40px 触控 */}
                  <div className='flex items-center justify-center min-w-[40px] min-h-[40px] -mx-1 -my-1'>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWorkflowFavorite(workflowId);
                        logFavorite(workflowId);
                      }}
                      className={`px-1.5 py-0.5 rounded-md transition-all hover:scale-105 active:scale-95 ${
                        isWorkflowFavorite(workflowId)
                          ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30'
                          : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-orange-400'
                      }`}
                      title='Save'
                    >
                      <Star className={`h-3 w-3 ${isWorkflowFavorite(workflowId) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className='flex items-center justify-center min-w-[40px] min-h-[40px] -mx-1 -my-1'>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(workflowId);
                        logLike(workflowId);
                      }}
                      className={`px-1.5 py-0.5 rounded-md transition-all hover:scale-105 active:scale-95 ${
                        isLiked(workflowId)
                          ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
                          : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-red-400'
                      }`}
                      title='Like'
                    >
                      <Heart className={`h-3 w-3 ${isLiked(workflowId) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4'>
              <div className={`flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium ${getDifficultyStyle(displayWorkflow.difficulty)}`}>
                {t(`difficulty.${displayWorkflow.difficulty}`)}
              </div>
              <div className='flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                <Clock className='w-3 h-3' />
                {displayWorkflow.estimatedTime}
              </div>
              <div className='flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
                <Play className='w-3 h-3' />
                {totalSteps} {t('label.steps').toLowerCase()}
              </div>
            </div>
          </div>

          <div className='space-y-2.5 sm:space-y-3'>
            <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2 sm:mb-2.5'>
              <span className='w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[11px] sm:text-xs font-bold'>
                {totalSteps}
              </span>
              {t('label.steps')}
            </h2>

            {displayWorkflow.steps.map((step, index) => {
              const tool = getToolBySlug(step.toolSlug);
              const isLast = index === displayWorkflow.steps.length - 1;

              return (
                <Fragment key={index}>
                  <div className='relative'>
                    <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
                      <div className='flex items-start gap-2.5 sm:gap-3'>
                        <div className='flex flex-col items-center flex-shrink-0'>
                          <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-[11px] shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/25'>
                            {index + 1}
                          </div>
                          {!isLast && (
                            <div className='w-0.5 flex-1 mt-1 min-h-[20px] bg-gray-200 dark:bg-gray-700' style={{ minHeight: '20px' }} />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-0.5'>
                            <h3 className='font-semibold text-[11px] sm:text-xs text-gray-900 dark:text-gray-100'>
                              {step.title}
                            </h3>
                          </div>
                          <p className='text-[11px] sm:text-xs mb-2.5 text-gray-600 dark:text-gray-400 leading-relaxed'>
                            {step.description}
                          </p>
                          {(() => {
                            const resolved = resolveToolLink(step.toolSlug, locale);
                            const link = tool?.externalUrl
                              ? { type: 'external' as const, url: tool.externalUrl, label: tool.name }
                              : tool && tool.slug
                                ? { type: 'internal' as const, url: `/${locale}/tool/${tool.slug}`, label: tool.name }
                                : { type: resolved.type, url: resolved.url, label: getToolDisplayLabel(step.toolSlug) || (tool?.name ?? (resolved.displayName || String(step.toolSlug || '').toUpperCase())) };
                            const isExt = link.type === 'external';
                            return (
                              <a
                                href={link.url}
                                target={isExt ? '_blank' : '_self'}
                                rel={isExt ? 'noopener noreferrer' : ''}
                                className={`inline-flex items-center justify-center gap-1 min-h-[40px] px-3 text-[10px] sm:text-[11px] font-medium rounded-lg transition-colors group active:scale-[0.98] ${
                                  isExt
                                    ? 'bg-[#E8F4F2] dark:bg-[#2a4a46]/30 text-[#34A89C] hover:bg-[#D7EAE7] dark:hover:bg-[#2a4a46]/50'
                                    : 'bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE] hover:bg-[#ECEEF8] dark:hover:bg-[#3a406a]/50'
                                }`}
                              >
                                {link.label}
                                {isExt && <ExternalLink className='w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform' />}
                              </a>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  {adMounted && index === 3 && !isLast && (
                    <div data-ad-slot-wrap='wf-simple-step4-below' className='my-1'>
                      <AdSlot
                        slot={`wf-simple-step4-${workflowId || 'wf'}-${locale}`}
                        size='in-feed'
                        showPlaceholder={true}
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div className='mt-5 sm:mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
            <div className='flex items-center justify-between mb-2.5 sm:mb-3'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-[11px] sm:text-xs'>
                {t('label.rating')}
              </h3>
              <div className='flex items-center gap-1'>
                <span className='text-base sm:text-lg font-bold text-primary-600 dark:text-primary-400'>{avgRating}</span>
                <span className='text-[10px] text-gray-500 dark:text-gray-400'>/ 5.0</span>
              </div>
            </div>
            <p className='text-[10px] text-gray-500 dark:text-gray-400'>
              {ratingCount} {t('rating.people')}
            </p>
          </div>

          <div className='mt-5 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30'>
            <div className='flex items-start gap-2.5'>
              <div className='p-1.5 rounded-lg bg-white dark:bg-gray-800 text-purple-500 flex-shrink-0'>
                <Zap className='w-4 h-4 sm:w-5 sm:h-5' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-0.5 text-[11px] sm:text-xs'>
                  {t('label.aiRecommend')}
                </h3>
                <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mb-2.5 leading-relaxed'>
                  {t('label.aiRecommendDesc')}
                </p>
              </div>
              <a
                href={`/${locale}`}
                className='inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:shadow-md transition-all group flex-shrink-0'
              >
                <span className='hidden sm:inline'>{t('label.homepage')}</span>
                <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
          </div>
          {showKofi && <KofiUnlockBanner slug={'workflow-'+workflowId} locale={locale} variant="top" />}
          {adMounted && (
            <div data-ad-slot-wrap='wf-simple-footer' className='mt-3 sm:mt-5'>
              <AdSlot
                slot={`wf-simple-bottom-${workflowId || 'wf'}-${locale}`}
                size='in-feed'
                showPlaceholder={true}
              />
            </div>
          )}
          {showKofi && <KofiUnlockBanner slug={'workflow-'+workflowId} locale={locale} variant="bottom" />}
        </div>
      </div>
    </div>
  );
}
