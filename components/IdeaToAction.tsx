'use client';

import { useState, useCallback } from 'react';
import { Rocket, RefreshCw, Copy, Check, Target, AlertTriangle, ArrowRight, Flag } from 'lucide-react';

interface IdeaToActionProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '创意行动器',
    subtitle: '将想法转化为行动清单',
    input: '输入你的想法或创意',
    placeholder: '例如：创建一个博客、开发一个App、创业、学习新技能...',
    generate: '🚀 转化为行动',
    loading: '正在分析想法...',
    coreGoal: '核心目标',
    priorityActions: '优先级行动',
    high: '高优先',
    medium: '中优先',
    low: '低优先',
    resourcesNeeded: '所需资源',
    estimatedTime: '预估时间',
    milestones: '里程碑',
    potentialChallenges: '潜在挑战',
    firstStep: '第一步',
    copyAll: '复制全部',
    copied: '已复制',
    noResult: '请输入想法开始转化',
    error: '转化失败，请重试',
  },
  en: {
    title: 'Idea Activator',
    subtitle: 'Turn ideas into actionable plans',
    input: 'Enter your idea or creative concept',
    placeholder: 'E.g., start a blog, build an app, start a business, learn new skills...',
    generate: '🚀 Activate Idea',
    loading: 'Analyzing idea...',
    coreGoal: 'Core Goal',
    priorityActions: 'Priority Actions',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    resourcesNeeded: 'Resources Needed',
    estimatedTime: 'Estimated Time',
    milestones: 'Milestones',
    potentialChallenges: 'Potential Challenges',
    firstStep: 'First Step',
    copyAll: 'Copy All',
    copied: 'Copied',
    noResult: 'Enter an idea to get started',
    error: 'Failed to activate, please retry',
  },
  hi: {
    title: 'आइडिया एक्टिवेटर',
    subtitle: 'विचारों को क्रियात्मक योजनाओं में बदलें',
    input: 'अपना विचार या रचनात्मक अवधारणा दर्ज करें',
    placeholder: 'उदाहरण: एक ब्लॉग शुरू करें, एक ऐप बनाएं, व्यवसाय शुरू करें...',
    generate: '🚀 विचार को सक्रिय करें',
    loading: 'विचार का विश्लेषण हो रहा है...',
    coreGoal: 'मुख्य लक्ष्य',
    priorityActions: 'प्राथमिकता क्रियाएं',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',
    resourcesNeeded: 'आवश्यक संसाधन',
    estimatedTime: 'अनुमानित समय',
    milestones: 'माइलस्टोन',
    potentialChallenges: 'संभावित चुनौतियां',
    firstStep: 'पहला कदम',
    copyAll: 'सभी कॉपी',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए एक विचार दर्ज करें',
    error: 'सक्रिय करने में विफल, कृपया पुनः प्रयास करें',
  },
  fr: {
    title: 'Activateur d\'Idées',
    subtitle: 'Transformez des idées en plans actionnables',
    input: 'Entrez votre idée ou concept créatif',
    placeholder: 'Ex: lancer un blog, développer une app, créer une entreprise...',
    generate: '🚀 Activer l\'Idée',
    loading: 'Analyse de l\'idée...',
    coreGoal: 'Objectif Principal',
    priorityActions: 'Actions Prioritaires',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
    resourcesNeeded: 'Ressources Nécessaires',
    estimatedTime: 'Temps Estimé',
    milestones: 'Jalons',
    potentialChallenges: 'Défis Potentiels',
    firstStep: 'Première Étape',
    copyAll: 'Copier tout',
    copied: 'Copié',
    noResult: 'Entrez une idée pour commencer',
    error: 'Échec de l\'activation, réessayez',
  },
  es: {
    title: 'Activador de Ideas',
    subtitle: 'Convierte ideas en planes accionables',
    input: 'Ingresa tu idea o concepto creativo',
    placeholder: 'Ej: iniciar un blog, desarrollar una app, emprender...',
    generate: '🚀 Activar Idea',
    loading: 'Analizando idea...',
    coreGoal: 'Objetivo Principal',
    priorityActions: 'Acciones Prioritarias',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    resourcesNeeded: 'Recursos Necesarios',
    estimatedTime: 'Tiempo Estimado',
    milestones: 'Hitos',
    potentialChallenges: 'Desafíos Potenciales',
    firstStep: 'Primer Paso',
    copyAll: 'Copiar todo',
    copied: 'Copiado',
    noResult: 'Ingresa una idea para empezar',
    error: 'Error al activar, intenta de nuevo',
  },
  ar: {
    title: 'مُنشِّط الأفكار',
    subtitle: 'حول الأفكار إلى خطط تنفيذية',
    input: 'أدخل فكرتك أو مفهومك الإبداعي',
    placeholder: 'مثل: بدء مدونة، تطوير تطبيق، بدء مشروع...',
    generate: '🚀 تنشيط الفكرة',
    loading: 'جاري تحليل الفكرة...',
    coreGoal: 'الهدف الرئيسي',
    priorityActions: 'الإجراءات ذات الأولوية',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    resourcesNeeded: 'الموارد المطلوبة',
    estimatedTime: 'الوقت المقدر',
    milestones: 'المواقع النقاطية',
    potentialChallenges: 'التحديات المحتملة',
    firstStep: 'الخطوة الأولى',
    copyAll: 'نسخ الكل',
    copied: 'تم النسخ',
    noResult: 'أدخل فكرة لتبدأ',
    error: 'فشل التنشيط، حاول مرة أخرى',
  },
};

interface PriorityAction {
  priority: string;
  action: string;
  description: string;
  resourcesNeeded: string[];
  estimatedTime: string;
}

interface ActionResult {
  idea: string;
  coreGoal: string;
  priorityActions: PriorityAction[];
  milestones: string[];
  potentialChallenges: string[];
  firstStep: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'from-red-500 to-orange-500',
  medium: 'from-amber-500 to-yellow-500',
  low: 'from-green-500 to-emerald-500',
};

export default function IdeaToAction({ locale = 'zh' }: IdeaToActionProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [input, setInput] = useState('');
  const [result, setResult] = useState<ActionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleActivate = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await fetch('/api/idea-to-action/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: input.trim(), locale: resolvedLocale }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        idea: data.idea,
        coreGoal: data.coreGoal,
        priorityActions: data.priorityActions,
        milestones: data.milestones,
        potentialChallenges: data.potentialChallenges,
        firstStep: data.firstStep,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [input, resolvedLocale]);

  const handleCopy = useCallback(async () => {
    if (!result) return;

    const text = [
      `${t('coreGoal')}: ${result.coreGoal}`,
      '',
      `${t('priorityActions')}:`,
      ...result.priorityActions.map((a) => [
        `[${t(a.priority)}] ${a.action}`,
        a.description,
        `${t('estimatedTime')}: ${a.estimatedTime}`,
        `${t('resourcesNeeded')}: ${a.resourcesNeeded.join(', ')}`,
      ].join('\n')),
      '',
      `${t('milestones')}:`,
      ...result.milestones.map((m) => '- ' + m),
      '',
      `${t('potentialChallenges')}:`,
      ...result.potentialChallenges.map((c) => '- ' + c),
      '',
      `${t('firstStep')}: ${result.firstStep}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, resolvedLocale]);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'>
            <Rocket className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
          </div>
        </div>

        <div className='space-y-4 sm:space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('input')}
            </label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder={t('placeholder')}
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <button
            onClick={handleActivate}
            disabled={!input.trim() || loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Rocket className='h-5 w-5' />
            )}
            {loading ? t('loading') : t('generate')}
          </button>

          {error && (
            <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'>
              <p className='text-sm text-red-700 dark:text-red-300'>{t('error')}</p>
            </div>
          )}

          {result && (
            <div className='space-y-4 sm:space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Target className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                  <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>{t('priorityActions')}</h2>
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm'
                >
                  {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  {copied ? t('copied') : t('copyAll')}
                </button>
              </div>

              {result.coreGoal && (
                <div className='flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/30'>
                  <Target className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                  <span className='font-semibold text-emerald-800 dark:text-emerald-300'>{t('coreGoal')}: {result.coreGoal}</span>
                </div>
              )}

              <div className='space-y-3'>
                {result.priorityActions.map((action, idx) => (
                  <div
                    key={idx}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'
                  >
                    <div className='flex items-start gap-3'>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${PRIORITY_COLORS[action.priority] || PRIORITY_COLORS.medium} text-white flex items-center justify-center font-bold text-sm`}>
                        {idx + 1}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{action.action}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            action.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : action.priority === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}>
                            {t(action.priority)}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{action.description}</p>
                        <div className='flex flex-wrap gap-3 text-xs'>
                          <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'>
                            <Flag className='h-3 w-3' />
                            {action.estimatedTime}
                          </div>
                          {action.resourcesNeeded && action.resourcesNeeded.length > 0 && (
                            <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'>
                              {action.resourcesNeeded.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.firstStep && (
                <div className='rounded-xl border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowRight className='h-5 w-5 text-green-600 dark:text-green-400' />
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('firstStep')}</h3>
                  </div>
                  <p className='text-gray-800 dark:text-gray-200 font-medium'>{result.firstStep}</p>
                </div>
              )}

              {result.milestones && result.milestones.length > 0 && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('milestones')}</h3>
                  <ul className='space-y-2'>
                    {result.milestones.map((milestone, idx) => (
                      <li key={idx} className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='text-green-500'>✓</span>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.potentialChallenges && result.potentialChallenges.length > 0 && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <AlertTriangle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('potentialChallenges')}</h3>
                  </div>
                  <ul className='space-y-2'>
                    {result.potentialChallenges.map((challenge, idx) => (
                      <li key={idx} className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='text-amber-500'>⚠</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
