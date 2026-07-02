'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, Clock, Zap, Play, ArrowRight, ExternalLink, Star, Heart, Presentation, Image, FileText, Code, Share2, Palette, Globe, TrendingUp, Mail, Headphones, ShoppingCart, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { usePreferencesStore } from '@/stores/preferences';
import { logLike, logFavorite } from '@/utils/audit-log';
import type { Workflow } from '@/data/workflows';
import { getToolBySlug } from '@/data/tools';
import { resolveToolLink, isExternalTool, getToolDisplayLabel } from '@/lib/toolLinks';
import { translateWorkflow } from '@/lib/workflowTranslations';
import type { Locale } from '@/lib/workflowTranslations';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Presentation, Image, FileText, Code, Share2, Zap, Palette, Globe, TrendingUp, Mail, Headphones, ShoppingCart, Calendar };

const translations: Record<string, { back: string; steps: string; rating: string; youRated: string; clickToRate: string; ratings: string; aiRecommend: string; aiDesc: string; tryAi: string; notFound: string; }> = {
  es: { back: 'Volver a flujos', steps: 'Pasos', rating: 'Calificación', youRated: 'Calificaste', clickToRate: 'Haz clic para calificar', ratings: 'valoraciones', aiRecommend: 'Recomendación IA', aiDesc: '¿No sabes qué herramientas usar? Deja que la IA recomiende.', tryAi: 'Probar IA', notFound: 'Flujo no encontrado' },
  fr: { back: 'Retour aux flux', steps: 'Étapes', rating: 'Note', youRated: 'Vous avez noté', clickToRate: 'Cliquez pour noter', ratings: 'évaluations', aiRecommend: 'Recommandation IA', aiDesc: 'Pas sûr des outils? Laissez l\'IA recommander.', tryAi: 'Essayer IA', notFound: 'Flux non trouvé' },
  hi: { back: 'वर्कफ़्लो वापस', steps: 'चरण', rating: 'रेटिंग', youRated: 'आपने रेट किया', clickToRate: 'रेट करने के लिए क्लिक करें', ratings: 'रेटिंग', aiRecommend: 'AI सिफारिश', aiDesc: 'कौन से टूल्स इस्तेमाल करें? AI से सिफारिश लें।', tryAi: 'AI आज़माएं', notFound: 'वर्कफ़्लो नहीं मिला' },
  ar: { back: 'العودة إلى سير العمل', steps: 'الخطوات', rating: 'التقييم', youRated: 'لقد قيّمت', clickToRate: 'انقر للتقييم', ratings: 'تقييمات', aiRecommend: 'توصية الذكاء الاصطناعي', aiDesc: 'لست متأكدًا من الأدوات؟ دع الذكاء الاصطناعي يوصي.', tryAi: 'جرب الذكاء الاصطناعي', notFound: 'لم يتم العثور على سير العمل' },
};

export default function WorkflowDetailClient({ slug, locale, workflow }: { slug: string; locale: string; workflow: Workflow | undefined }) {
  const t = translations[locale] || translations['fr'];
  const tw = useMemo(() => workflow ? translateWorkflow(workflow, locale as Locale) : undefined, [workflow, locale]);
  const displayWorkflow = tw || workflow;
  const { toggleLike, isLiked, toggleFavorite, isFavorite, setWorkflowRating, getWorkflowRating } = usePreferencesStore();
  const [hoverRating, setHoverRating] = useState(0);
  const userRating = getWorkflowRating(displayWorkflow?.id || '');
  const avgRating = 4.5;
  const ratingCount = 128;

  if (!displayWorkflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='text-center py-12'><p className='text-gray-500 dark:text-gray-400'>{t.notFound}</p></div>
      </div>
    );
  }

  const Icon = iconMap[displayWorkflow.icon] || Zap;
  const getDifficultyStyle = (d: string) => d === 'easy' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : d === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : d === 'advanced' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='workflows' />
        <div className='flex-1 min-w-0'>
          <a href={`/${locale}/workflows`} className='inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-[#5461A8] dark:hover:text-[#B2BADE] mb-4 transition-colors'>
            <ChevronLeft className='w-4 h-4' />{t.back}
          </a>

          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8 mb-6'>
            <div className='flex items-start justify-between mb-4 sm:mb-6'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#F5F6FB] to-[#ECEEF8] dark:from-[#3a406a]/30 dark:to-[#4a527a]/30 text-[#5461A8] dark:text-[#B2BADE]'>
                  <Icon className='w-6 h-6 sm:w-8 sm:h-8' />
                </div>
                <div>
                  <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1'>{displayWorkflow.title}</h1>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>{displayWorkflow.description}</p>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1 flex-shrink-0 hidden sm:flex'>
                <div className='flex items-center gap-1'>
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(displayWorkflow.id); logFavorite(displayWorkflow.id); }} className={`p-1.5 rounded-lg transition-all hover:scale-105 ${isFavorite(displayWorkflow.id) ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/30' : 'bg-gray-100 text-gray-400 hover:text-amber-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-amber-400'}`}>
                    <Star className={`w-4 h-4 ${isFavorite(displayWorkflow.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); toggleLike(displayWorkflow.id); logLike(displayWorkflow.id); }} className={`p-1.5 rounded-lg transition-all hover:scale-105 ${isLiked(displayWorkflow.id) ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${isLiked(displayWorkflow.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyStyle(displayWorkflow.difficulty)}`}>{displayWorkflow.difficulty}</div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'><Clock className='w-3.5 h-3.5' />{displayWorkflow.estimatedTime}</div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#F5F6FB] dark:bg-[#3a406a]/20 text-[#5461A8] dark:text-[#B2BADE]'><Play className='w-3.5 h-3.5' />{displayWorkflow.steps.length} {t.steps}</div>
            </div>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
              <span className='w-8 h-8 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 flex items-center justify-center text-[#5461A8] dark:text-[#B2BADE] text-sm font-bold'>{displayWorkflow.steps.length}</span>
              {t.steps}
            </h2>
            {displayWorkflow.steps.map((step, index) => {
              const tool = getToolBySlug(step.toolSlug);
              const isLast = index === displayWorkflow.steps.length - 1;
              return (
                <div key={index} className='relative'>
                  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-[#5461A8]/40 dark:hover:border-[#B2BADE]/40 hover:shadow-md transition-all'>
                    <div className='flex items-start gap-3 sm:gap-4'>
                      <div className='flex flex-col items-center flex-shrink-0'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#5461A8] to-[#6975ba] text-white flex items-center justify-center font-bold text-sm shadow-[#5461A8]/15 shadow-lg'>{index + 1}</div>
                        {!isLast && <div className='w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1 min-h-[20px]' style={{ minHeight: '20px' }} />}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1'>{step.title}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{step.description}</p>
                        {(() => {
                          const resolved = resolveToolLink(step.toolSlug, locale);
                          const link = tool?.externalUrl
                            ? { type: 'external' as const, url: tool.externalUrl, label: tool.name }
                            : tool && tool.slug
                              ? { type: 'internal' as const, url: `/${locale}/tool/${tool.slug}`, label: tool.name }
                              : { type: resolved.type, url: resolved.url || `/${locale}`, label: getToolDisplayLabel(step.toolSlug) || (tool?.name ?? (resolved.displayName || String(step.toolSlug || '').toUpperCase())) };
                          const isExt = link.type === 'external';
                          return (
                            <a href={link.url} target={isExt ? '_blank' : '_self'} rel={isExt ? 'noopener noreferrer' : ''} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors group ${isExt ? 'bg-[#E8F4F2] dark:bg-[#2a4a46]/30 text-[#34A89C] hover:bg-[#D7EAE7] dark:hover:bg-[#2a4a46]/50' : 'bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE] hover:bg-[#ECEEF8] dark:hover:bg-[#3a406a]/50'}`}>
                              {link.label}
                              {isExt && <ExternalLink className='w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform' />}
                            </a>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base'>{t.rating}</h3>
              <div className='flex items-center gap-1.5'><span className='text-lg sm:text-xl font-bold text-[#5461A8] dark:text-[#B2BADE]'>{avgRating}</span><span className='text-xs text-gray-500 dark:text-gray-400'>/ 5.0</span></div>
            </div>
            <div className='flex items-center gap-2 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setWorkflowRating(displayWorkflow.id, star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className='p-0.5 transition-transform hover:scale-110 active:scale-95'>
                  <Star className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${(hoverRating || userRating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                </button>
              ))}
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {userRating > 0 ? `${t.youRated} ${userRating} · ` : `${t.clickToRate} · `}{ratingCount} {t.ratings}
            </p>
          </div>

          <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-white dark:bg-gray-800 text-purple-500 flex-shrink-0'><Zap className='w-5 h-5' /></div>
              <div>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base'>{t.aiRecommend}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{t.aiDesc}</p>
                <a href={`/${locale}`} className='inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:shadow-md transition-all group'>
                  {t.tryAi}<ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
