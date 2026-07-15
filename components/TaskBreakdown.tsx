'use client';

import { useState, useCallback } from 'react';
import { ListTodo, Play, RefreshCw, Copy, Check, Clock, Lightbulb, Target, ChevronRight } from 'lucide-react';

interface TaskBreakdownProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '任务拆解器',
    subtitle: '将模糊目标拆解为可执行步骤',
    input: '输入你的目标或任务',
    placeholder: '例如：准备期末考试、策划一场旅行、学习一门新语言...',
    generate: '🔧 开始拆解',
    loading: '正在分析任务...',
    titleResult: '拆解结果',
    totalTime: '总预估时间',
    tips: '执行建议',
    step: '步骤',
    expectedOutput: '预期产出',
    estimatedTime: '预估时间',
    copyAll: '复制全部',
    copied: '已复制',
    noResult: '请输入目标开始拆解',
    error: '拆解失败，请重试',
  },
  en: {
    title: 'Task Breaker',
    subtitle: 'Break down vague goals into actionable steps',
    input: 'Enter your goal or task',
    placeholder: 'E.g., prepare for final exams, plan a trip, learn a new language...',
    generate: '🔧 Break It Down',
    loading: 'Analyzing task...',
    titleResult: 'Breakdown Result',
    totalTime: 'Total Estimated Time',
    tips: 'Execution Tips',
    step: 'Step',
    expectedOutput: 'Expected Output',
    estimatedTime: 'Estimated Time',
    copyAll: 'Copy All',
    copied: 'Copied',
    noResult: 'Enter a goal to get started',
    error: 'Failed to breakdown, please retry',
  },
  hi: {
    title: 'टास्क ब्रेकर',
    subtitle: 'अस्पष्ट लक्ष्यों को क्रियाशील कदमों में तोड़ें',
    input: 'अपना लक्ष्य या कार्य दर्ज करें',
    placeholder: 'उदाहरण: फाइनल परीक्षाओं की तैयारी करें, एक यात्रा की योजना बनाएं...',
    generate: '🔧 तोड़ना शुरू करें',
    loading: 'कार्य का विश्लेषण हो रहा है...',
    titleResult: 'टूटने का परिणाम',
    totalTime: 'कुल अनुमानित समय',
    tips: 'निष्पादन युक्तियां',
    step: 'कदम',
    expectedOutput: 'अपेक्षित आउटपुट',
    estimatedTime: 'अनुमानित समय',
    copyAll: 'सभी कॉपी',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए एक लक्ष्य दर्ज करें',
    error: 'टूटने में विफल, कृपया पुनः प्रयास करें',
  },
  fr: {
    title: 'Déconstructeur de Tâches',
    subtitle: 'Décomposez les objectifs vagues en étapes exécutables',
    input: 'Entrez votre objectif ou tâche',
    placeholder: 'Ex: préparer les examens, planifier un voyage, apprendre une langue...',
    generate: '🔧 Décomposer',
    loading: 'Analyse de la tâche...',
    titleResult: 'Résultat de la décomposition',
    totalTime: 'Temps estimé total',
    tips: 'Conseils d\'exécution',
    step: 'Étape',
    expectedOutput: 'Résultat attendu',
    estimatedTime: 'Temps estimé',
    copyAll: 'Copier tout',
    copied: 'Copié',
    noResult: 'Entrez un objectif pour commencer',
    error: 'Échec de la décomposition, réessayez',
  },
  es: {
    title: 'Descomponedor de Tareas',
    subtitle: 'Divide objetivos vagos en pasos ejecutables',
    input: 'Ingresa tu objetivo o tarea',
    placeholder: 'Ej: preparar exámenes finales, planificar un viaje, aprender un idioma...',
    generate: '🔧 Descomponer',
    loading: 'Analizando tarea...',
    titleResult: 'Resultado de la descomposición',
    totalTime: 'Tiempo estimado total',
    tips: 'Consejos de ejecución',
    step: 'Paso',
    expectedOutput: 'Salida esperada',
    estimatedTime: 'Tiempo estimado',
    copyAll: 'Copiar todo',
    copied: 'Copiado',
    noResult: 'Ingresa un objetivo para empezar',
    error: 'Error al descomponer, intenta de nuevo',
  },
  ar: {
    title: 'مُحلِّل المهام',
    subtitle: 'قم بتقسيم الأهداف الغامضة إلى خطوات تنفيذية',
    input: 'أدخل هدفك أو مهمتك',
    placeholder: 'مثل: استعداد للامتحانات النهائية، تخطيط رحلة، تعلم لغة جديدة...',
    generate: '🔧 ابدأ التحليل',
    loading: 'جاري تحليل المهمة...',
    titleResult: 'نتيجة التحليل',
    totalTime: 'المجموع الزمني المقدر',
    tips: 'نصائح التنفيذ',
    step: 'الخطوة',
    expectedOutput: 'المخرجات المتوقعة',
    estimatedTime: 'الوقت المقدر',
    copyAll: 'نسخ الكل',
    copied: 'تم النسخ',
    noResult: 'أدخل هدفاً لتبدأ',
    error: 'فشل التحليل، حاول مرة أخرى',
  },
};

interface Step {
  number: number;
  title: string;
  description: string;
  expectedOutput: string;
  estimatedTime: string;
}

interface BreakdownResult {
  title: string;
  steps: Step[];
  totalTime: string;
  tips: string[];
}

export default function TaskBreakdown({ locale = 'zh' }: TaskBreakdownProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [input, setInput] = useState('');
  const [result, setResult] = useState<BreakdownResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await fetch('/api/task-breakdown/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input.trim(), locale: resolvedLocale }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        title: data.title,
        steps: data.steps,
        totalTime: data.totalTime,
        tips: data.tips,
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
      t('titleResult') + ': ' + (result.title || input),
      '',
      ...result.steps.map((s) => [
        `${s.number}. ${s.title}`,
        t('estimatedTime') + ': ' + s.estimatedTime,
        t('expectedOutput') + ': ' + s.expectedOutput,
        s.description,
      ].join('\n')),
      '',
      t('totalTime') + ': ' + result.totalTime,
      '',
      t('tips') + ':',
      ...result.tips.map((tip) => '- ' + tip),
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
  }, [result, input, resolvedLocale]);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'>
            <ListTodo className='h-5 w-5 sm:h-6 sm:w-6' />
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
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!input.trim() || loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Play className='h-5 w-5' />
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
                  <Target className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                  <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>{t('titleResult')}</h2>
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm'
                >
                  {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  {copied ? t('copied') : t('copyAll')}
                </button>
              </div>

              {result.totalTime && (
                <div className='flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/30'>
                  <Clock className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                  <span className='font-semibold text-amber-800 dark:text-amber-300'>{t('totalTime')}: {result.totalTime}</span>
                </div>
              )}

              <div className='space-y-3'>
                {result.steps.map((step) => (
                  <div
                    key={step.number}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm'>
                        {step.number}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{step.title}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{step.description}</p>
                        <div className='flex flex-wrap gap-3 text-xs'>
                          <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'>
                            <Clock className='h-3 w-3' />
                            {step.estimatedTime}
                          </div>
                          <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'>
                            <ChevronRight className='h-3 w-3' />
                            {step.expectedOutput}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.tips && result.tips.length > 0 && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Lightbulb className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('tips')}</h3>
                  </div>
                  <ul className='space-y-2'>
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className='flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='text-amber-500'>•</span>
                        {tip}
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
