'use client';

import { useState, useCallback } from 'react';
import { Briefcase, RefreshCw, Copy, Check, Sparkles, Target, Award, Wrench } from 'lucide-react';

interface AiResumeExperienceOptimizeToolProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '简历经历 AI 优化',
    subtitle: '输入职位信息，AI 帮你优化简历经历描述',
    position: '目标职位',
    positionPlaceholder: '请输入你申请的职位名称...',
    experience: '工作经历',
    experiencePlaceholder: '请输入你的工作经历描述，可多行输入...',
    skills: '核心技能',
    skillsPlaceholder: '请输入你的核心技能，用逗号分隔...',
    achievements: '主要成就',
    achievementsPlaceholder: '请输入你的主要成就，可多行输入...',
    tone: '优化风格',
    star: 'STAR法则',
    quant: '量化导向',
    concise: '简洁/精炼',
    formal: '正式/专业',
    achievement: '成果导向',
    action: '行动导向',
    generate: '✨ 优化简历',
    loading: '正在优化...',
    copy: '优化后描述',
    why: '优化要点',
    copyCopy: '复制',
    copied: '已复制',
    noResult: '请输入目标职位开始优化',
    error: '优化失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Resume Experience Optimizer',
    subtitle: 'Enter position details and optimize your resume experience',
    position: 'Target Position',
    positionPlaceholder: 'Enter the position you are applying for...',
    experience: 'Work Experience',
    experiencePlaceholder: 'Enter your work experience description, multi-line supported...',
    skills: 'Core Skills',
    skillsPlaceholder: 'Enter your core skills, separated by commas...',
    achievements: 'Key Achievements',
    achievementsPlaceholder: 'Enter your key achievements, multi-line supported...',
    tone: 'Optimization Style',
    star: 'STAR Method',
    quant: 'Quantification',
    concise: 'Concise/Direct',
    formal: 'Formal/Professional',
    achievement: 'Achievement Focused',
    action: 'Action Oriented',
    generate: '✨ Optimize Resume',
    loading: 'Optimizing...',
    copy: 'Optimized Copy',
    why: 'Why This Works',
    copyCopy: 'Copy',
    copied: 'Copied',
    noResult: 'Enter target position to start',
    error: 'Optimization failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI रिज्यूमे अनुभव अनुकूलन',
    subtitle: 'पद विवरण दर्ज करें और अपने रिज्यूमे अनुभव को अनुकूलित करें',
    position: 'लक्ष्य पद',
    positionPlaceholder: 'जिस पद के लिए आप आवेदन करते हैं उसे दर्ज करें...',
    experience: 'कार्य अनुभव',
    experiencePlaceholder: 'अपने कार्य अनुभव का विवरण दर्ज करें, बहु-पंक्ति समर्थित...',
    skills: 'मुख्य कौशल',
    skillsPlaceholder: 'अपने मुख्य कौशल दर्ज करें, अल्पविराम से अलग किए गए...',
    achievements: 'प्रमुख उपलब्धियां',
    achievementsPlaceholder: 'अपनी प्रमुख उपलब्धियां दर्ज करें, बहु-पंक्ति समर्थित...',
    tone: 'अनुकूलन शैली',
    star: 'STAR विधि',
    quant: 'मात्रात्मक',
    concise: 'संक्षिप्त/प्रत्यक्ष',
    formal: 'औपचारिक/पेशेवर',
    achievement: 'उपलब्धि केंद्रित',
    action: 'क्रिया उन्मुख',
    generate: '✨ रिज्यूमे अनुकूलित करें',
    loading: 'अनुकूलन किया जा रहा है...',
    copy: 'अनुकूलित कॉपी',
    why: 'यह क्यों काम करता है',
    copyCopy: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए लक्ष्य पद दर्ज करें',
    error: 'अनुकूलन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Optimiseur AI d\'expérience professionnelle',
    subtitle: 'Saisissez les détails du poste et optimisez votre expérience',
    position: 'Poste cible',
    positionPlaceholder: 'Entrez le poste pour lequel vous postulez...',
    experience: 'Expérience professionnelle',
    experiencePlaceholder: 'Entrez votre expérience professionnelle, plusieurs lignes supportées...',
    skills: 'Compétences clés',
    skillsPlaceholder: 'Entrez vos compétences clés, séparées par des virgules...',
    achievements: 'Réalisations clés',
    achievementsPlaceholder: 'Entrez vos réalisations clés, plusieurs lignes supportées...',
    tone: 'Style d\'optimisation',
    star: 'Méthode STAR',
    quant: 'Quantification',
    concise: 'Concis/Direct',
    formal: 'Formel/Professionnel',
    achievement: 'Axé sur les réalisations',
    action: 'Axé sur l\'action',
    generate: '✨ Optimiser le CV',
    loading: 'Optimisation...',
    copy: 'Texte optimisé',
    why: 'Pourquoi ça marche',
    copyCopy: 'Copier',
    copied: 'Copié',
    noResult: 'Saisissez le poste cible pour commencer',
    error: 'Échec de l\'optimisation, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Optimizador AI de Experiencia Laboral',
    subtitle: 'Ingresa detalles del puesto y optimiza tu experiencia laboral',
    position: 'Puesto objetivo',
    positionPlaceholder: 'Ingresa el puesto al que aplicas...',
    experience: 'Experiencia laboral',
    experiencePlaceholder: 'Ingresa tu experiencia laboral, se admite varias líneas...',
    skills: 'Habilidades clave',
    skillsPlaceholder: 'Ingresa tus habilidades clave, separadas por comas...',
    achievements: 'Logros clave',
    achievementsPlaceholder: 'Ingresa tus logros clave, se admite varias líneas...',
    tone: 'Estilo de optimización',
    star: 'Método STAR',
    quant: 'Cuantificación',
    concise: 'Conciso/Directo',
    formal: 'Formal/Profesional',
    achievement: 'Enfocado en logros',
    action: 'Orientado a acción',
    academic: 'Académico/Profesional',
    generate: '✨ Optimizar CV',
    loading: 'Optimizando...',
    copy: 'Texto optimizado',
    why: '¿Por qué funciona?',
    copyCopy: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa el puesto objetivo para empezar',
    error: 'Error al optimizar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مُحسن الخبرة الوظيفية بالذكاء الاصطناعي',
    subtitle: 'أدخل تفاصيل المنصب و оптиimize خبرتك الوظيفية',
    position: 'المنصب المستهدف',
    positionPlaceholder: 'أدخل المنصب الذي تتقدم له...',
    experience: 'الخبرة الوظيفية',
    experiencePlaceholder: 'أدخل وصف خبرتك الوظيفية، يدعم الأسطر المتعددة...',
    skills: 'المهارات الرئيسية',
    skillsPlaceholder: 'أدخل مهاراتك الرئيسية، مفصلة بفواصل...',
    achievements: 'الإنجازات الرئيسية',
    achievementsPlaceholder: 'أدخل إنجازاتك الرئيسية، يدعم الأسطر المتعددة...',
    tone: 'أسلوب النبرة',
    formal: 'رسمي/تجاري',
    friendly: 'ودود/غير رسمي',
    concise: 'مختصر/مباشر',
    humorous: 'مزح',
    persuasive: 'قائل/تسويقي',
    academic: 'أكاديمي/محترف',
    generate: '✨ تحسين السيرة الذاتية',
    loading: 'جاري التحسين...',
    copy: 'النص المحسن',
    why: 'لماذا هذا يعمل',
    copyCopy: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل المنصب المستهدف لتبدأ',
    error: 'فشل التحسين، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const TONES = [
  { key: 'formal', color: 'from-blue-500 to-indigo-600' },
  { key: 'friendly', color: 'from-green-500 to-emerald-600' },
  { key: 'concise', color: 'from-gray-500 to-gray-700' },
  { key: 'humorous', color: 'from-pink-500 to-rose-600' },
  { key: 'persuasive', color: 'from-orange-500 to-amber-600' },
  { key: 'academic', color: 'from-purple-500 to-violet-600' },
];

interface CopyItem {
  copy: string;
  why: string;
}

interface GenerateResult {
  items: CopyItem[];
  remaining: number | null;
}

export default function AiResumeExperienceOptimizeTool({ locale = 'zh' }: AiResumeExperienceOptimizeToolProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [selectedTone, setSelectedTone] = useState('formal');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!position.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-resume-experience-optimize/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: position.trim(),
          experience: experience.trim(),
          skills: skills.trim(),
          achievements: achievements.trim(),
          tone: selectedTone,
          locale: resolvedLocale,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setRateLimitError(true);
        return;
      }

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        items: data.items || [],
        remaining: data.remaining,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [position, experience, skills, achievements, selectedTone, resolvedLocale]);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'>
            <Briefcase className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
          </div>
        </div>

        {((result && result.remaining !== null) || rateLimitError) && (
          <div className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm ${
            rateLimitError 
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300'
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'
          }`}>
            {rateLimitError ? t('rateLimit') : `${t('remaining')}${result?.remaining ?? 0}`}
          </div>
        )}

        <div className='space-y-4 sm:space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('position')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={position}
              onChange={(e) => { setPosition(e.target.value); setError(false); }}
              placeholder={t('positionPlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('experience')}
            </label>
            <textarea
              value={experience}
              onChange={(e) => { setExperience(e.target.value); setError(false); }}
              placeholder={t('experiencePlaceholder')}
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('skills')}
            </label>
            <input
              type='text'
              value={skills}
              onChange={(e) => { setSkills(e.target.value); setError(false); }}
              placeholder={t('skillsPlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('achievements')}
            </label>
            <textarea
              value={achievements}
              onChange={(e) => { setAchievements(e.target.value); setError(false); }}
              placeholder={t('achievementsPlaceholder')}
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('tone')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {TONES.map((toneItem) => (
                <button
                  key={toneItem.key}
                  onClick={() => setSelectedTone(toneItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTone === toneItem.key
                      ? `text-white bg-gradient-to-br ${toneItem.color} shadow-md scale-[1.02]`
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(toneItem.key)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!position.trim() || loading}
            className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Sparkles className='h-5 w-5' />
            )}
            {loading ? t('loading') : t('generate')}
          </button>

          {error && !rateLimitError && (
            <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'>
              <p className='text-sm text-red-700 dark:text-red-300'>{t('error')}</p>
            </div>
          )}

          {result && result.items.length > 0 && (
            <div className='space-y-4 sm:space-y-6'>
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('copy')}</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5 flex flex-col'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span className='px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-700 dark:text-blue-300'>
                        {t('copy')} #{index + 1}
                      </span>
                      <button
                        onClick={() => handleCopy(item.copy, index)}
                        className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                      >
                        {copiedIndex === index ? <Check className='h-3 w-3 text-green-600 dark:text-green-400' /> : <Copy className='h-3 w-3' />}
                        {copiedIndex === index ? t('copied') : t('copyCopy')}
                      </button>
                    </div>
                    <div className='flex-1'>
                      <p className='text-gray-800 dark:text-gray-200 leading-relaxed text-sm mb-4'>
                        {item.copy}
                      </p>
                      <div className='p-2 sm:p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30'>
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                          <span className='font-medium text-blue-700 dark:text-blue-400'>{t('why')}: </span>
                          {item.why}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
