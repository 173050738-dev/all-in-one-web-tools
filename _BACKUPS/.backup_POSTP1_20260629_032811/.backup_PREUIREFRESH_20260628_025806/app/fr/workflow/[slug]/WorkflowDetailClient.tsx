'use client';
import { useState } from 'react';
import { ChevronLeft, Clock, Zap, Play, ArrowRight, ExternalLink, Star, Heart, Presentation, Image, FileText, Code, Share2, Palette, Globe, TrendingUp, Mail, Headphones, ShoppingCart, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { usePreferencesStore } from '@/stores/preferences';
import { logLike, logFavorite } from '@/utils/audit-log';
import type { Workflow } from '@/data/workflows';
import { getToolBySlug } from '@/data/tools';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Presentation, Image, FileText, Code, Share2, Zap, Palette, Globe, TrendingUp, Mail, Headphones, ShoppingCart, Calendar };

const translations: Record<string, { back: string; steps: string; rating: string; youRated: string; clickToRate: string; ratings: string; aiRecommend: string; aiDesc: string; tryAi: string; notFound: string; }> = {
  es: { back: 'Volver a flujos', steps: 'Pasos', rating: 'Calificación', youRated: 'Calificaste', clickToRate: 'Haz clic para calificar', ratings: 'valoraciones', aiRecommend: 'Recomendación IA', aiDesc: '¿No sabes qué herramientas usar? Deja que la IA recomiende.', tryAi: 'Probar IA', notFound: 'Flujo no encontrado' },
  fr: { back: 'Retour aux flux', steps: 'Étapes', rating: 'Note', youRated: 'Vous avez noté', clickToRate: 'Cliquez pour noter', ratings: 'évaluations', aiRecommend: 'Recommandation IA', aiDesc: 'Pas sûr des outils? Laissez l\'IA recommander.', tryAi: 'Essayer IA', notFound: 'Flux non trouvé' },
  hi: { back: 'वर्कफ़्लो वापस', steps: 'चरण', rating: 'रेटिंग', youRated: 'आपने रेट किया', clickToRate: 'रेट करने के लिए क्लिक करें', ratings: 'रेटिंग', aiRecommend: 'AI सिफारिश', aiDesc: 'कौन से टूल्स इस्तेमाल करें? AI से सिफारिश लें।', tryAi: 'AI आज़माएं', notFound: 'वर्कफ़्लो नहीं मिला' },
  ar: { back: 'العودة إلى سير العمل', steps: 'الخطوات', rating: 'التقييم', youRated: 'لقد قيّمت', clickToRate: 'انقر للتقييم', ratings: 'تقييمات', aiRecommend: 'توصية الذكاء الاصطناعي', aiDesc: 'لست متأكدًا من الأدوات؟ دع الذكاء الاصطناعي يوصي.', tryAi: 'جرب الذكاء الاصطناعي', notFound: 'لم يتم العثور على سير العمل' },
};

export default function WorkflowDetailClient({ slug, locale, workflow }: { slug: string; locale: string; workflow: Workflow | undefined }) {
  const t = translations[locale] || translations['fr'];
  const { toggleLike, isLiked, toggleFavorite, isFavorite, setWorkflowRating, getWorkflowRating } = usePreferencesStore();
  const [hoverRating, setHoverRating] = useState(0);
  const userRating = getWorkflowRating(workflow?.id || '');
  const avgRating = 4.5;
  const ratingCount = 128;

  if (!workflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='text-center py-12'><p className='text-gray-500 dark:text-gray-400'>{t.notFound}</p></div>
      </div>
    );
  }

  const Icon = iconMap[workflow.icon] || Zap;
  const getDifficultyStyle = (d: string) => d === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : d === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : d === 'advanced' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='workflows' />
        <div className='flex-1 min-w-0'>
          <a href={`/${locale}/workflows`} className='inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors'>
            <ChevronLeft className='w-4 h-4' />{t.back}
          </a>

          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8 mb-6'>
            <div className='flex items-start justify-between mb-4 sm:mb-6'>
              <div className='flex items-center gap-3 sm:gap-4'>
                <div className='p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-600 dark:text-primary-400'>
                  <Icon className='w-6 h-6 sm:w-8 sm:h-8' />
                </div>
                <div>
                  <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1'>{workflow.title}</h1>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>{workflow.description}</p>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1 flex-shrink-0 hidden sm:flex'>
                <div className='flex items-center gap-1'>
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(workflow.id); logFavorite(workflow.id); }} className={`p-1.5 rounded-lg transition-all hover:scale-105 ${isFavorite(workflow.id) ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-orange-400'}`}>
                    <Star className={`w-4 h-4 ${isFavorite(workflow.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); toggleLike(workflow.id); logLike(workflow.id); }} className={`p-1.5 rounded-lg transition-all hover:scale-105 ${isLiked(workflow.id) ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${isLiked(workflow.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyStyle(workflow.difficulty)}`}>{workflow.difficulty}</div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'><Clock className='w-3.5 h-3.5' />{workflow.estimatedTime}</div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'><Play className='w-3.5 h-3.5' />{workflow.steps.length} {t.steps}</div>
            </div>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
              <span className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold'>{workflow.steps.length}</span>
              {t.steps}
            </h2>
            {workflow.steps.map((step, index) => {
              const tool = getToolBySlug(step.toolSlug);
              const isLast = index === workflow.steps.length - 1;
              return (
                <div key={index} className='relative'>
                  <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all'>
                    <div className='flex items-start gap-3 sm:gap-4'>
                      <div className='flex flex-col items-center flex-shrink-0'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/25'>{index + 1}</div>
                        {!isLast && <div className='w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1 min-h-[20px]' style={{ minHeight: '20px' }} />}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1'>{step.title}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{step.description}</p>
                        {tool && (
                          <a href={tool.externalUrl || `/${locale}/tool/${tool.slug}`} target={tool.externalUrl ? '_blank' : '_self'} rel={tool.externalUrl ? 'noopener noreferrer' : ''} className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors group'>
                            {tool.name}<ExternalLink className='w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform' />
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
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base'>{t.rating}</h3>
              <div className='flex items-center gap-1.5'><span className='text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400'>{avgRating}</span><span className='text-xs text-gray-500 dark:text-gray-400'>/ 5.0</span></div>
            </div>
            <div className='flex items-center gap-2 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setWorkflowRating(workflow.id, star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className='p-0.5 transition-transform hover:scale-110 active:scale-95'>
                  <Star className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${(hoverRating || userRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
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
