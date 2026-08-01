'use client';

import { useState, useCallback } from 'react';
import { FileText, RefreshCw, Copy, Check, Sparkles, Briefcase, ListChecks, Award, CalendarClock } from 'lucide-react';

interface AiWeeklyReportProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 周报生成器',
    subtitle: '输入本周工作内容，一键生成结构化周报（含四大固定章节）',
    role: '职位',
    rolePlaceholder: '请输入你的职位，如：前端工程师/产品经理...',
    tasks: '本周工作内容',
    tasksPlaceholder: '请输入本周完成的工作，可多行...\n例如：\n- 完成登录模块开发\n- 修复3个线上bug\n- 参与需求评审',
    achievements: '已取得成果（可选）',
    achievementsPlaceholder: '可选：本周的关键产出、量化结果...',
    plans: '下周计划（可选）',
    plansPlaceholder: '可选：下周准备做的事情...',
    generate: '✨ 生成周报',
    loading: '正在生成...',
    report: '周报预览',
    copyReport: '复制周报',
    copied: '已复制',
    noResult: '请输入职位和工作内容开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Weekly Report Generator',
    subtitle: 'Enter this week\'s tasks to get a structured weekly report',
    role: 'Role',
    rolePlaceholder: 'Enter your role, e.g. Frontend Engineer, PM...',
    tasks: 'This Week\'s Tasks',
    tasksPlaceholder: 'Enter what you did this week, multi-line supported...\ne.g.:\n- Built login module\n- Fixed 3 bugs\n- Joined requirement review',
    achievements: 'Achievements (optional)',
    achievementsPlaceholder: 'Optional: key outputs, quantified results...',
    plans: 'Next Week Plan (optional)',
    plansPlaceholder: 'Optional: what you plan to do next week...',
    generate: '✨ Generate Report',
    loading: 'Generating...',
    report: 'Report Preview',
    copyReport: 'Copy',
    copied: 'Copied',
    noResult: 'Enter role and tasks to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI साप्ताहिक रिपोर्ट जनरेटर',
    subtitle: 'इस सप्ताह के कार्य दर्ज करें और संरचित साप्ताहिक रिपोर्ट पाएं',
    role: 'पद',
    rolePlaceholder: 'अपना पद दर्ज करें, जैसे फ्रंटएंड इंजीनियर...',
    tasks: 'इस सप्ताह के कार्य',
    tasksPlaceholder: 'इस सप्ताह क्या किया, बहु-पंक्ति समर्थित...',
    achievements: 'उपलब्धियां (वैकल्पिक)',
    achievementsPlaceholder: 'वैकल्पिक: मुख्य आउटपुट, मात्रात्मक परिणाम...',
    plans: 'अगले सप्ताह की योजना (वैकल्पिक)',
    plansPlaceholder: 'वैकल्पिक: अगले सप्ताह की योजनाएं...',
    generate: '✨ रिपोर्ट बनाएं',
    loading: 'बनाया जा रहा है...',
    report: 'रिपोर्ट पूर्वावलोकन',
    copyReport: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए पद और कार्य दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur de rapport hebdomadaire AI',
    subtitle: 'Saisissez les tâches de la semaine pour un rapport structuré',
    role: 'Poste',
    rolePlaceholder: 'Entrez votre poste, ex: Ingénieur frontend...',
    tasks: 'Tâches de la semaine',
    tasksPlaceholder: 'Entrez ce que vous avez fait, multi-lignes supportées...',
    achievements: 'Résultats (optionnel)',
    achievementsPlaceholder: 'Optionnel: résultats clés, résultats quantifiés...',
    plans: 'Plan semaine prochaine (optionnel)',
    plansPlaceholder: 'Optionnel: ce que vous prévoyez la semaine prochaine...',
    generate: '✨ Générer',
    loading: 'Génération...',
    report: 'Aperçu du rapport',
    copyReport: 'Copier',
    copied: 'Copié',
    noResult: 'Entrez poste et tâches pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de informe semanal AI',
    subtitle: 'Ingresa las tareas de la semana para un informe estructurado',
    role: 'Puesto',
    rolePlaceholder: 'Ingresa tu puesto, ej: Ingeniero frontend...',
    tasks: 'Tareas de la semana',
    tasksPlaceholder: 'Ingresa lo que hiciste, se admiten varias líneas...',
    achievements: 'Logros (opcional)',
    achievementsPlaceholder: 'Opcional: resultados clave, resultados cuantificados...',
    plans: 'Plan próxima semana (opcional)',
    plansPlaceholder: 'Opcional: lo que planeas hacer la próxima semana...',
    generate: '✨ Generar',
    loading: 'Generando...',
    report: 'Vista previa del informe',
    copyReport: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa puesto y tareas para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مولد التقرير الأسبوعي AI',
    subtitle: 'أدخل مهام هذا الأسبوع للحصول على تقرير أسبوعي منظم',
    role: 'المنصب',
    rolePlaceholder: 'أدخل منصبك، مثال: مهندس واجهة أمامية...',
    tasks: 'مهام هذا الأسبوع',
    tasksPlaceholder: 'أدخل ما فعلته هذا الأسبوع، يدعم أسطر متعددة...',
    achievements: 'الإنجازات (اختياري)',
    achievementsPlaceholder: 'اختياري: المخرجات الرئيسية، النتائج الكمية...',
    plans: 'خطة الأسبوع القادم (اختياري)',
    plansPlaceholder: 'اختياري: ما تخطط لفعله الأسبوع القادم...',
    generate: '✨ إنشاء التقرير',
    loading: 'جاري الإنشاء...',
    report: 'معاينة التقرير',
    copyReport: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل المنصب والمهام لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

interface GenerateResult {
  report: string;
  remaining: number | null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">$1</code>');
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      closeList();
      continue;
    }

    const h1Match = line.match(/^#\s+(.*)/);
    if (h1Match) {
      closeList();
      html.push(`<h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-3">${renderInline(h1Match[1])}</h2>`);
      continue;
    }

    const h2Match = line.match(/^##\s+(.*)/);
    if (h2Match) {
      closeList();
      html.push(`<h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">${renderInline(h2Match[1])}</h3>`);
      continue;
    }

    const h3Match = line.match(/^###\s+(.*)/);
    if (h3Match) {
      closeList();
      html.push(`<h4 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">${renderInline(h3Match[1])}</h4>`);
      continue;
    }

    const liMatch = line.match(/^[-*]\s+(.*)/);
    if (liMatch) {
      if (!inList) {
        html.push('<ul class="space-y-1.5 mb-3 ps-5 list-disc">');
        inList = true;
      }
      html.push(`<li class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">${renderInline(liMatch[1])}</li>`);
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      if (!inList) {
        html.push('<ul class="space-y-1.5 mb-3 ps-5 list-decimal">');
        inList = true;
      }
      html.push(`<li class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">${renderInline(olMatch[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-2">${renderInline(line)}</p>`);
  }

  closeList();
  return html.join('\n');
}

export default function AiWeeklyReport({ locale = 'zh' }: AiWeeklyReportProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState('');
  const [achievements, setAchievements] = useState('');
  const [plans, setPlans] = useState('');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!role.trim() || !tasks.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-weekly-report/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: role.trim(),
          tasks: tasks.trim(),
          achievements: achievements.trim() || undefined,
          plans: plans.trim() || undefined,
          locale: resolvedLocale,
        }),
      });

      if (response.status === 429) {
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
        report: data.report || '',
        remaining: data.remaining,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [role, tasks, achievements, plans, resolvedLocale]);

  const handleCopy = useCallback(async () => {
    if (!result?.report) return;
    try {
      await navigator.clipboard.writeText(result.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.report;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25'>
            <FileText className='h-5 w-5 sm:h-6 sm:w-6' />
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
            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              <Briefcase className='h-4 w-4 text-blue-500' />
              {t('role')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={role}
              onChange={(e) => { setRole(e.target.value); setError(false); }}
              placeholder={t('rolePlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              <ListChecks className='h-4 w-4 text-blue-500' />
              {t('tasks')} <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={tasks}
              onChange={(e) => { setTasks(e.target.value); setError(false); }}
              placeholder={t('tasksPlaceholder')}
              className='w-full h-40 sm:h-48 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-colors'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
            <div>
              <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                <Award className='h-4 w-4 text-blue-500' />
                {t('achievements')}
              </label>
              <textarea
                value={achievements}
                onChange={(e) => { setAchievements(e.target.value); setError(false); }}
                placeholder={t('achievementsPlaceholder')}
                className='w-full h-24 sm:h-28 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors'
              />
            </div>

            <div>
              <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                <CalendarClock className='h-4 w-4 text-blue-500' />
                {t('plans')}
              </label>
              <textarea
                value={plans}
                onChange={(e) => { setPlans(e.target.value); setError(false); }}
                placeholder={t('plansPlaceholder')}
                className='w-full h-24 sm:h-28 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors'
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!role.trim() || !tasks.trim() || loading}
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

          {result && result.report && (
            <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <FileText className='h-5 w-5 text-blue-500' />
                  <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('report')}</h3>
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                >
                  {copied ? <Check className='h-4 w-4 text-green-600 dark:text-green-400' /> : <Copy className='h-4 w-4' />}
                  {copied ? t('copied') : t('copyReport')}
                </button>
              </div>
              <div
                className='markdown-body'
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.report) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
