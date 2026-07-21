'use client';

import { useState, useCallback } from 'react';
import { Clock, Calculator, Sparkles, Copy, Check, TrendingUp, AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface TimeEstimatorProps {
  locale?: string;
}

interface EstimationResult {
  totalHours: number;
  totalDays: number;
  hoursPerDay: number;
  breakdown: { step: string; hours: number; description: string }[];
  bufferHours: number;
  bufferPercentage: number;
  riskFactors: string[];
  recommendations: string[];
  summary: string;
  remaining?: number;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '工时预估器',
    subtitle: 'AI智能估算任务耗时',
    input: '输入任务描述',
    placeholder: '例如：写一篇博客文章、开发一个登录页面、准备演讲材料...',
    estimate: '⏱️ 估算工时',
    result: '预估结果',
    totalHours: '总工时',
    totalDays: '总天数',
    hoursPerDay: '每天工时',
    breakdown: '任务分解',
    step: '步骤',
    hours: '工时',
    description: '描述',
    buffer: '缓冲时间',
    bufferPercentage: '缓冲比例',
    riskFactors: '风险因素',
    recommendations: '建议',
    summary: '总结',
    copyResult: '复制结果',
    copied: '已复制',
    noResult: '请输入任务描述开始估算',
    complexity: '复杂度',
    experience: '经验水平',
    low: '低',
    medium: '中等',
    high: '高',
    beginner: '初级',
    intermediate: '中级',
    expert: '高级',
    loading: '正在估算...',
    error: '估算失败，请重试',
    dailyLimit: '今日免费次数已用完',
  },
  en: {
    title: 'Time Estimator',
    subtitle: 'AI-powered task duration estimation',
    input: 'Enter task description',
    placeholder: 'E.g., write a blog post, develop a login page, prepare presentation...',
    estimate: '⏱️ Estimate Time',
    result: 'Estimation Result',
    totalHours: 'Total Hours',
    totalDays: 'Total Days',
    hoursPerDay: 'Hours per Day',
    breakdown: 'Task Breakdown',
    step: 'Step',
    hours: 'Hours',
    description: 'Description',
    buffer: 'Buffer Time',
    bufferPercentage: 'Buffer Percentage',
    riskFactors: 'Risk Factors',
    recommendations: 'Recommendations',
    summary: 'Summary',
    copyResult: 'Copy Result',
    copied: 'Copied',
    noResult: 'Enter a task description to get started',
    complexity: 'Complexity',
    experience: 'Experience Level',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
    loading: 'Estimating...',
    error: 'Estimation failed, please retry',
    dailyLimit: 'Daily free limit exceeded',
  },
  hi: {
    title: 'टाइम एस्टीमेटर',
    subtitle: 'AI से शक्तिशालित कार्य अवधि अनुमान',
    input: 'कार्य का विवरण दर्ज करें',
    placeholder: 'उदाहरण: एक ब्लॉग पोस्ट लिखें, एक लॉगिन पेज विकसित करें...',
    estimate: '⏱️ समय अनुमान लगाएं',
    result: 'अनुमान परिणाम',
    totalHours: 'कुल घंटे',
    totalDays: 'कुल दिन',
    hoursPerDay: 'प्रतिदिन घंटे',
    breakdown: 'कार्य विभाजन',
    step: 'चरण',
    hours: 'घंटे',
    description: 'विवरण',
    buffer: 'बफर समय',
    bufferPercentage: 'बफर प्रतिशत',
    riskFactors: 'जोखिम कारक',
    recommendations: 'सिफारिशें',
    summary: 'सारांश',
    copyResult: 'परिणाम कॉपी',
    copied: 'कॉपी किया',
    noResult: 'अनुमान लगाने के लिए कार्य विवरण दर्ज करें',
    complexity: 'जटिलता',
    experience: 'अनुभव स्तर',
    low: 'निम्न',
    medium: 'मध्यम',
    high: 'उच्च',
    beginner: 'शुरुआती',
    intermediate: 'मध्यवर्ती',
    expert: 'विशेषज्ञ',
    loading: 'अनुमान लगाया जा रहा है...',
    error: 'अनुमान विफल, कृपया पुनः प्रयास करें',
    dailyLimit: 'दैनिक मुफ्त सीमा पार हो गई',
  },
  fr: {
    title: 'Estimateur de Temps',
    subtitle: 'Estimation de durée de tâche alimentée par AI',
    input: 'Entrez la description de la tâche',
    placeholder: 'Ex: écrire un article de blog, développer une page de connexion...',
    estimate: '⏱️ Estimer le Temps',
    result: 'Résultat de l\'Estimation',
    totalHours: 'Heures Totales',
    totalDays: 'Jours Totaux',
    hoursPerDay: 'Heures par Jour',
    breakdown: 'Détail de la Tâche',
    step: 'Étape',
    hours: 'Heures',
    description: 'Description',
    buffer: 'Temps de Tampon',
    bufferPercentage: 'Pourcentage de Tampon',
    riskFactors: 'Facteurs de Risque',
    recommendations: 'Recommandations',
    summary: 'Résumé',
    copyResult: 'Copier le Résultat',
    copied: 'Copié',
    noResult: 'Entrez une description de tâche pour commencer',
    complexity: 'Complexité',
    experience: 'Niveau d\'Expérience',
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
    loading: 'Estimation en cours...',
    error: 'Échec de l\'estimation, veuillez réessayer',
    dailyLimit: 'Limite gratuite quotidienne atteinte',
  },
  es: {
    title: 'Estimador de Tiempo',
    subtitle: 'Estimación de duración de tareas con AI',
    input: 'Ingresa la descripción de la tarea',
    placeholder: 'Ej: escribir un artículo de blog, desarrollar una página de login...',
    estimate: '⏱️ Estimar Tiempo',
    result: 'Resultado de la Estimación',
    totalHours: 'Horas Totales',
    totalDays: 'Días Totales',
    hoursPerDay: 'Horas por Día',
    breakdown: 'Desglose de Tarea',
    step: 'Paso',
    hours: 'Horas',
    description: 'Descripción',
    buffer: 'Tiempo de Buffer',
    bufferPercentage: 'Porcentaje de Buffer',
    riskFactors: 'Factores de Riesgo',
    recommendations: 'Recomendaciones',
    summary: 'Resumen',
    copyResult: 'Copiar Resultado',
    copied: 'Copiado',
    noResult: 'Ingresa una descripción de tarea para empezar',
    complexity: 'Complejidad',
    experience: 'Nivel de Experiencia',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    expert: 'Experto',
    loading: 'Estimando...',
    error: 'Estimación fallida, por favor reintente',
    dailyLimit: 'Límite gratuito diario superado',
  },
  ar: {
    title: 'مُقدّر الوقت',
    subtitle: 'تقدير مدة المهمة باستخدام AI',
    input: 'أدخل وصف المهمة',
    placeholder: 'مثل: كتابة مقال مدونة، تطوير صفحة تسجيل الدخول...',
    estimate: '⏱️ تقدير الوقت',
    result: 'نتيجة التقدير',
    totalHours: 'الساعات الكلية',
    totalDays: 'الأيام الكلية',
    hoursPerDay: 'الساعات في اليوم',
    breakdown: 'تفاصيل المهمة',
    step: 'الخطوة',
    hours: 'الساعات',
    description: 'الوصف',
    buffer: 'وقت الاحتياط',
    bufferPercentage: 'نسبة الاحتياط',
    riskFactors: 'عوامل المخاطر',
    recommendations: 'التوصيات',
    summary: 'الملخص',
    copyResult: 'نسخ النتيجة',
    copied: 'تم النسخ',
    noResult: 'أدخل وصف المهمة لتبدأ',
    complexity: 'المعقدة',
    experience: 'مستوى الخبرة',
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    expert: 'خبير',
    loading: 'جارٍ التقدير...',
    error: 'فشل التقدير، يرجى المحاولة مرة أخرى',
    dailyLimit: 'تم تجاوز الحد اليومي المجاني',
  },
};

export default function TimeEstimator({ locale = 'zh' }: TimeEstimatorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [input, setInput] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [experience, setExperience] = useState('intermediate');
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    breakdown: true,
    risks: true,
    recommendations: true,
  });

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleEstimate = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/time-estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: input.trim(), complexity, experience, locale: resolvedLocale }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 && data.error === 'RATE_LIMIT') {
          setError(t('dailyLimit'));
        } else {
          setError(t('error'));
        }
        return;
      }

      setResult(data as EstimationResult);
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }, [input, complexity, experience, resolvedLocale, t]);

  const handleCopy = useCallback(async () => {
    if (!result) return;

    const text = [
      `${t('result')}:`,
      `${t('totalHours')}: ${result.totalHours}h`,
      `${t('totalDays')}: ${result.totalDays}d`,
      `${t('hoursPerDay')}: ${result.hoursPerDay}h`,
      '',
      `${t('breakdown')}:`,
      ...result.breakdown.map((b, i) => `${i + 1}. ${b.step}: ${b.hours}h - ${b.description}`),
      '',
      `${t('buffer')}: ${result.bufferHours}h (${result.bufferPercentage}%)`,
      '',
      `${t('riskFactors')}:`,
      ...result.riskFactors.map(r => `- ${r}`),
      '',
      `${t('recommendations')}:`,
      ...result.recommendations.map(r => `- ${r}`),
      '',
      `${t('summary')}: ${result.summary}`,
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
  }, [result, t]);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'>
            <Clock className='h-5 w-5 sm:h-6 sm:w-6' />
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
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors'
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleEstimate())}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                {t('complexity')}
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className='w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
              >
                <option value='low'>{t('low')}</option>
                <option value='medium'>{t('medium')}</option>
                <option value='high'>{t('high')}</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                {t('experience')}
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className='w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors'
              >
                <option value='beginner'>{t('beginner')}</option>
                <option value='intermediate'>{t('intermediate')}</option>
                <option value='expert'>{t('expert')}</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleEstimate}
            disabled={!input.trim() || loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? <Loader2 className='h-5 w-5 animate-spin' /> : <Calculator className='h-5 w-5' />}
            {loading ? t('loading') : t('estimate')}
          </button>

          {error && (
            <div className='p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'>
              <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                <AlertCircle className='h-5 w-5' />
                <span className='text-sm font-medium'>{error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-3 gap-3'>
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 text-center'>
                  <div className='text-xs text-green-600 dark:text-green-400 mb-1'>{t('totalHours')}</div>
                  <div className='text-2xl font-bold text-green-700 dark:text-green-400'>{result.totalHours}h</div>
                </div>
                <div className='rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 p-4 text-center'>
                  <div className='text-xs text-indigo-600 dark:text-indigo-400 mb-1'>{t('totalDays')}</div>
                  <div className='text-2xl font-bold text-indigo-700 dark:text-indigo-400'>{result.totalDays}d</div>
                </div>
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 text-center'>
                  <div className='text-xs text-blue-600 dark:text-blue-400 mb-1'>{t('hoursPerDay')}</div>
                  <div className='text-2xl font-bold text-blue-700 dark:text-blue-400'>{result.hoursPerDay}h</div>
                </div>
              </div>

              <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-amber-500' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{t('buffer')}</span>
                </div>
                <span className='font-semibold text-amber-600 dark:text-amber-400'>{result.bufferHours}h ({result.bufferPercentage}%)</span>
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
                <button
                  onClick={() => toggleSection('breakdown')}
                  className='w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='h-5 w-5 text-indigo-500' />
                    <span className='font-semibold text-gray-900 dark:text-gray-100'>{t('breakdown')}</span>
                  </div>
                  {expandedSections.breakdown ? <ChevronUp className='h-5 w-5 text-gray-500' /> : <ChevronDown className='h-5 w-5 text-gray-500' />}
                </button>
                {expandedSections.breakdown && (
                  <div className='px-4 pb-4 space-y-2'>
                    {result.breakdown.map((item, index) => (
                      <div key={index} className='flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400'>
                          {index + 1}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between'>
                            <span className='font-medium text-gray-900 dark:text-gray-100 truncate'>{item.step}</span>
                            <span className='flex-shrink-0 ml-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400'>{item.hours}h</span>
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-0.5'>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
                <button
                  onClick={() => toggleSection('risks')}
                  className='w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-5 w-5 text-amber-500' />
                    <span className='font-semibold text-gray-900 dark:text-gray-100'>{t('riskFactors')}</span>
                  </div>
                  {expandedSections.risks ? <ChevronUp className='h-5 w-5 text-gray-500' /> : <ChevronDown className='h-5 w-5 text-gray-500' />}
                </button>
                {expandedSections.risks && (
                  <div className='px-4 pb-4 space-y-2'>
                    {result.riskFactors.map((risk, index) => (
                      <div key={index} className='flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='flex-shrink-0 text-amber-500'>•</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
                <button
                  onClick={() => toggleSection('recommendations')}
                  className='w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <Sparkles className='h-5 w-5 text-green-500' />
                    <span className='font-semibold text-gray-900 dark:text-gray-100'>{t('recommendations')}</span>
                  </div>
                  {expandedSections.recommendations ? <ChevronUp className='h-5 w-5 text-gray-500' /> : <ChevronDown className='h-5 w-5 text-gray-500' />}
                </button>
                {expandedSections.recommendations && (
                  <div className='px-4 pb-4 space-y-2'>
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className='flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='flex-shrink-0 text-green-500'>✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 p-4 sm:p-5'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t('summary')}</h3>
                <p className='text-sm text-gray-700 dark:text-gray-300'>{result.summary}</p>
              </div>

              <button
                onClick={handleCopy}
                className='w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm'
              >
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                {copied ? t('copied') : t('copyResult')}
              </button>
            </div>
          )}

          <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 sm:p-5'>
            <div className='flex items-center gap-2 mb-3'>
              <Sparkles className='h-5 w-5 text-amber-600 dark:text-amber-400' />
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('tips')}</h3>
            </div>
            <ul className='space-y-2 text-sm text-gray-700 dark:text-gray-300'>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '提供详细的任务描述可获得更准确的估算' : 'Provide detailed task descriptions for more accurate estimates'}
              </li>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '缓冲时间用于应对意外情况，建议预留10-20%' : 'Buffer time accounts for unexpected issues, suggest reserving 10-20%'}
              </li>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '经验水平越高，完成任务的速度越快' : 'Higher experience level leads to faster task completion'}
              </li>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '建议使用总工时作为计划依据' : 'Use total hours for planning purposes'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}