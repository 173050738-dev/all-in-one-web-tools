'use client';

import { useState, useCallback, useMemo } from 'react';
import { Clock, Calculator, Sparkles, Copy, Check, TrendingUp, AlertCircle } from 'lucide-react';

interface TimeEstimatorProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '工时预估器',
    subtitle: '基于经验估算任务耗时',
    input: '输入任务描述',
    placeholder: '例如：写一篇博客文章、开发一个登录页面、准备演讲材料...',
    estimate: '⏱️ 估算工时',
    result: '预估耗时',
    optimistic: '乐观估计',
    realistic: '实际估计',
    pessimistic: '悲观估计',
    uncertainty: '不确定性',
    tips: '估算建议',
    copyResult: '复制结果',
    copied: '已复制',
    noResult: '请输入任务描述开始估算',
  },
  en: {
    title: 'Time Estimator',
    subtitle: 'Estimate task duration based on experience',
    input: 'Enter task description',
    placeholder: 'E.g., write a blog post, develop a login page, prepare presentation...',
    estimate: '⏱️ Estimate Time',
    result: 'Estimated Time',
    optimistic: 'Optimistic',
    realistic: 'Realistic',
    pessimistic: 'Pessimistic',
    uncertainty: 'Uncertainty',
    tips: 'Estimation Tips',
    copyResult: 'Copy Result',
    copied: 'Copied',
    noResult: 'Enter a task description to get started',
  },
  hi: {
    title: 'टाइम एस्टीमेटर',
    subtitle: 'अनुभव के आधार पर कार्य की अवधि का अनुमान लगाएं',
    input: 'कार्य का विवरण दर्ज करें',
    placeholder: 'उदाहरण: एक ब्लॉग पोस्ट लिखें, एक लॉगिन पेज विकसित करें...',
    estimate: '⏱️ समय अनुमान लगाएं',
    result: 'अनुमानित समय',
    optimistic: 'आशावादी',
    realistic: 'वास्तविक',
    pessimistic: 'निराशावादी',
    uncertainty: 'अनिश्चितता',
    tips: 'अनुमान युक्तियां',
    copyResult: 'परिणाम कॉपी',
    copied: 'कॉपी किया',
    noResult: 'अनुमान लगाने के लिए कार्य विवरण दर्ज करें',
  },
  fr: {
    title: 'Estimateur de Temps',
    subtitle: 'Estimez la durée des tâches basée sur l\'expérience',
    input: 'Entrez la description de la tâche',
    placeholder: 'Ex: écrire un article de blog, développer une page de connexion...',
    estimate: '⏱️ Estimer le Temps',
    result: 'Temps Estimé',
    optimistic: 'Optimiste',
    realistic: 'Réaliste',
    pessimistic: 'Pessimiste',
    uncertainty: 'Incértain',
    tips: 'Conseils d\'Estimation',
    copyResult: 'Copier le Résultat',
    copied: 'Copié',
    noResult: 'Entrez une description de tâche pour commencer',
  },
  es: {
    title: 'Estimador de Tiempo',
    subtitle: 'Estima la duración de las tareas basado en la experiencia',
    input: 'Ingresa la descripción de la tarea',
    placeholder: 'Ej: escribir un artículo de blog, desarrollar una página de login...',
    estimate: '⏱️ Estimar Tiempo',
    result: 'Tiempo Estimado',
    optimistic: 'Optimista',
    realistic: 'Realista',
    pessimistic: 'Pesimista',
    uncertainty: 'Incertidumbre',
    tips: 'Consejos de Estimación',
    copyResult: 'Copiar Resultado',
    copied: 'Copiado',
    noResult: 'Ingresa una descripción de tarea para empezar',
  },
  ar: {
    title: 'مُقدّر الوقت',
    subtitle: 'قدّر مدة المهمة بناءً على الخبرة',
    input: 'أدخل وصف المهمة',
    placeholder: 'مثل: كتابة مقال مدونة، تطوير صفحة تسجيل الدخول...',
    estimate: '⏱️ تقدير الوقت',
    result: 'الوقت المقدر',
    optimistic: 'مُتفائل',
    realistic: 'واقعي',
    pessimistic: 'مُشعر باليأس',
    uncertainty: 'عدم اليقين',
    tips: 'نصائح التقدير',
    copyResult: 'نسخ النتيجة',
    copied: 'تم النسخ',
    noResult: 'أدخل وصف المهمة لتبدأ',
  },
};

const TASK_PATTERNS: Record<string, { min: number; max: number; label: string }[]> = {
  write: [
    { min: 1, max: 2, label: 'short article' },
    { min: 2, max: 4, label: 'medium article' },
    { min: 4, max: 8, label: 'long article' },
    { min: 0.5, max: 1, label: 'email' },
    { min: 1, max: 3, label: 'report' },
  ],
  develop: [
    { min: 2, max: 4, label: 'simple page' },
    { min: 4, max: 8, label: 'feature' },
    { min: 1, max: 2, label: 'bug fix' },
    { min: 8, max: 20, label: 'complex feature' },
  ],
  design: [
    { min: 1, max: 2, label: 'simple design' },
    { min: 3, max: 6, label: 'UI mockup' },
    { min: 4, max: 8, label: 'brand identity' },
  ],
  prepare: [
    { min: 1, max: 3, label: 'presentation' },
    { min: 2, max: 4, label: 'meeting' },
    { min: 0.5, max: 1, label: 'notes' },
  ],
  learn: [
    { min: 4, max: 8, label: 'basic concept' },
    { min: 8, max: 20, label: 'skill' },
    { min: 20, max: 40, label: 'advanced topic' },
  ],
  research: [
    { min: 1, max: 3, label: 'quick research' },
    { min: 3, max: 6, label: 'deep research' },
    { min: 6, max: 12, label: 'comprehensive' },
  ],
  meeting: [
    { min: 0.5, max: 1, label: 'quick sync' },
    { min: 1, max: 2, label: 'team meeting' },
    { min: 2, max: 4, label: 'workshop' },
  ],
  review: [
    { min: 0.5, max: 1, label: 'code review' },
    { min: 1, max: 2, label: 'document review' },
    { min: 2, max: 4, label: 'project review' },
  ],
};

const KEYWORDS: Record<string, string[]> = {
  write: ['写', '撰写', '编辑', '文章', '博客', '报告', '邮件', '文案', 'document', 'write', 'article', 'blog', 'report', 'email', 'copy'],
  develop: ['开发', '编程', '代码', '功能', '修复', 'build', 'develop', 'code', 'feature', 'bug', 'implement'],
  design: ['设计', 'UI', '界面', '品牌', 'logo', 'design', 'UI', 'brand', 'mockup'],
  prepare: ['准备', '演讲', '演示', '会议', '材料', 'prepare', 'presentation', 'meeting', 'material'],
  learn: ['学习', '教程', '课程', 'skill', 'learn', 'study', 'course', 'tutorial'],
  research: ['调研', '研究', '分析', 'research', 'analyze', 'study'],
  meeting: ['会议', '讨论', 'sync', 'meeting', 'discussion', 'call'],
  review: ['审查', '审核', 'review', 'check', 'audit'],
};

export default function TimeEstimator({ locale = 'zh' }: TimeEstimatorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ optimistic: number; realistic: number; pessimistic: number; uncertainty: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const estimateTime = useCallback((task: string): { optimistic: number; realistic: number; pessimistic: number } | null => {
    const lowerTask = task.toLowerCase();

    for (const [category, patterns] of Object.entries(TASK_PATTERNS)) {
      if (KEYWORDS[category]?.some((kw) => lowerTask.includes(kw))) {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const optimistic = pattern.min;
        const pessimistic = pattern.max;
        const realistic = Math.round(((optimistic * 4) + pessimistic) / 5 * 10) / 10;
        return { optimistic, realistic, pessimistic };
      }
    }

    const wordCount = task.split(' ').length;
    if (wordCount <= 3) {
      return { optimistic: 1, realistic: 2, pessimistic: 4 };
    } else if (wordCount <= 6) {
      return { optimistic: 2, realistic: 4, pessimistic: 8 };
    } else {
      return { optimistic: 4, realistic: 8, pessimistic: 16 };
    }
  }, []);

  const handleEstimate = useCallback(() => {
    if (!input.trim()) return;

    const estimation = estimateTime(input.trim());
    if (estimation) {
      const range = estimation.pessimistic - estimation.optimistic;
      let uncertainty: string;
      if (range <= 2) uncertainty = 'low';
      else if (range <= 6) uncertainty = 'medium';
      else uncertainty = 'high';

      setResult({ ...estimation, uncertainty });
    }
  }, [input, estimateTime]);

  const handleCopy = useCallback(async () => {
    if (!result) return;

    const text = [
      `${t('result')}:`,
      `${t('optimistic')}: ${result.optimistic}h`,
      `${t('realistic')}: ${result.realistic}h`,
      `${t('pessimistic')}: ${result.pessimistic}h`,
      `${t('uncertainty')}: ${t(result.uncertainty)}`,
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

  const uncertaintyColor = result?.uncertainty === 'high' ? 'text-red-500' : result?.uncertainty === 'medium' ? 'text-amber-500' : 'text-green-500';

  const uncertaintyLabel = result?.uncertainty === 'high' ? 'high' : result?.uncertainty === 'medium' ? 'medium' : 'low';

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
              onKeyPress={(e) => e.key === 'Enter' && handleEstimate()}
            />
          </div>

          <button
            onClick={handleEstimate}
            disabled={!input.trim()}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Calculator className='h-5 w-5' />
            {t('estimate')}
          </button>

          {result && (
            <div className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-3 gap-3'>
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 text-center'>
                  <div className='text-xs text-green-600 dark:text-green-400 mb-1'>{t('optimistic')}</div>
                  <div className='text-2xl font-bold text-green-700 dark:text-green-400'>{result.optimistic}h</div>
                </div>
                <div className='rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 p-4 text-center'>
                  <div className='text-xs text-indigo-600 dark:text-indigo-400 mb-1'>{t('realistic')}</div>
                  <div className='text-2xl font-bold text-indigo-700 dark:text-indigo-400'>{result.realistic}h</div>
                </div>
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 text-center'>
                  <div className='text-xs text-red-600 dark:text-red-400 mb-1'>{t('pessimistic')}</div>
                  <div className='text-2xl font-bold text-red-700 dark:text-red-400'>{result.pessimistic}h</div>
                </div>
              </div>

              <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                  <AlertCircle className={`h-5 w-5 ${uncertaintyColor}`} />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{t('uncertainty')}</span>
                </div>
                <span className={`font-semibold ${uncertaintyColor}`}>{t(uncertaintyLabel)}</span>
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
                {locale === 'zh' ? '乐观估计：一切顺利，没有意外' : 'Optimistic: Everything goes smoothly, no surprises'}
              </li>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '实际估计：考虑常见延误和调整' : 'Realistic: Account for common delays and adjustments'}
              </li>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '悲观估计：考虑最坏情况' : 'Pessimistic: Account for worst-case scenarios'}
              </li>
              <li className='flex items-start gap-2'>
                <TrendingUp className='h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5' />
                {locale === 'zh' ? '建议使用实际估计作为计划依据' : 'Use realistic estimate for planning'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
