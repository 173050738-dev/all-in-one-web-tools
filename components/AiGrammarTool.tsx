'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { RefreshCw, Copy, Check, Sparkles, Target, FileText, Star, MessageSquare } from 'lucide-react';

interface AiGrammarToolProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 写作校对器',
    subtitle: '粘贴文本，AI 检测语法问题并给出改写建议',
    text: '待校对文本',
    textPlaceholder: '请粘贴需要校对的文本内容...',
    goal: '写作目标',
    goalGeneral: '通用',
    goalAcademic: '学术',
    goalBusinessEmail: '商务邮件',
    goalSocial: '社媒',
    goalResume: '简历',
    goalCasual: '日常',
    check: '✨ 开始校对',
    loading: '正在分析...',
    score: '可读性评分',
    corrections: '纠错清单',
    noIssues: '未发现明显问题',
    rewritten: '改写结果',
    tone: '语气分析',
    toneSuggestion: '语气建议',
    statsWords: '字数',
    statsSentences: '句数',
    statsIssues: '问题数',
    typeGrammar: '语法',
    typeSpelling: '拼写',
    typePunctuation: '标点',
    typeWording: '用词',
    copy: '复制',
    copied: '已复制',
    noResult: '请输入文本开始校对',
    error: '校对失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    textTooLong: '文本过长（最多4000字符）',
  },
  en: {
    title: 'AI Grammar & Writing Checker',
    subtitle: 'Paste text and get grammar fixes, rewrite suggestions and readability score',
    text: 'Text to Check',
    textPlaceholder: 'Paste your text here for proofreading...',
    goal: 'Writing Goal',
    goalGeneral: 'General',
    goalAcademic: 'Academic',
    goalBusinessEmail: 'Business Email',
    goalSocial: 'Social Media',
    goalResume: 'Resume',
    goalCasual: 'Casual',
    check: '✨ Check Grammar',
    loading: 'Analyzing...',
    score: 'Readability Score',
    corrections: 'Corrections',
    noIssues: 'No obvious issues found',
    rewritten: 'Rewritten Text',
    tone: 'Tone Analysis',
    toneSuggestion: 'Tone Suggestion',
    statsWords: 'Words',
    statsSentences: 'Sentences',
    statsIssues: 'Issues',
    typeGrammar: 'Grammar',
    typeSpelling: 'Spelling',
    typePunctuation: 'Punctuation',
    typeWording: 'Wording',
    copy: 'Copy',
    copied: 'Copied',
    noResult: 'Enter text to start checking',
    error: 'Checking failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    textTooLong: 'Text too long (max 4000 characters)',
  },
  hi: {
    title: 'AI व्याकरण और लेखन जांचकर्ता',
    subtitle: 'पाठ पेस्ट करें और व्याकरण सुधार, पुनर्लेखन सुझाव और पठनीयता स्कोर प्राप्त करें',
    text: 'जांच के लिए पाठ',
    textPlaceholder: 'प्रूफ़रीडिंग के लिए अपना पाठ यहां पेस्ट करें...',
    goal: 'लेखन लक्ष्य',
    goalGeneral: 'सामान्य',
    goalAcademic: 'अकादमिक',
    goalBusinessEmail: 'व्यावसायिक ईमेल',
    goalSocial: 'सोशल मीडिया',
    goalResume: 'रिज्यूमे',
    goalCasual: 'आम दिनचर्या',
    check: '✨ व्याकरण जांचें',
    loading: 'विश्लेषण किया जा रहा है...',
    score: 'पठनीयता स्कोर',
    corrections: 'सुधार',
    noIssues: 'कोई स्पष्ट समस्या नहीं मिली',
    rewritten: 'पुनर्लिखित पाठ',
    tone: 'टोन विश्लेषण',
    toneSuggestion: 'टोन सुझाव',
    statsWords: 'शब्द',
    statsSentences: 'वाक्य',
    statsIssues: 'समस्याएं',
    typeGrammar: 'व्याकरण',
    typeSpelling: 'वर्तनी',
    typePunctuation: 'विराम चिह्न',
    typeWording: 'शब्दों का प्रयोग',
    copy: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'जांच शुरू करने के लिए पाठ दर्ज करें',
    error: 'जांच विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    textTooLong: 'पाठ बहुत लंबा है (अधिकतम 4000 वर्ण)',
  },
  fr: {
    title: 'Vérificateur AI de grammaire et d\'écriture',
    subtitle: 'Collez votre texte et obtenez des corrections, des suggestions de réécriture et un score de lisibilité',
    text: 'Texte à vérifier',
    textPlaceholder: 'Collez votre texte ici pour la vérification...',
    goal: 'Objectif d\'écriture',
    goalGeneral: 'Général',
    goalAcademic: 'Académique',
    goalBusinessEmail: 'Email professionnel',
    goalSocial: 'Réseaux sociaux',
    goalResume: 'CV',
    goalCasual: 'Décontracté',
    check: '✨ Vérifier la grammaire',
    loading: 'Analyse...',
    score: 'Score de lisibilité',
    corrections: 'Corrections',
    noIssues: 'Aucun problème évident trouvé',
    rewritten: 'Texte réécrit',
    tone: 'Analyse du ton',
    toneSuggestion: 'Suggestion de ton',
    statsWords: 'Mots',
    statsSentences: 'Phrases',
    statsIssues: 'Problèmes',
    typeGrammar: 'Grammaire',
    typeSpelling: 'Orthographe',
    typePunctuation: 'Ponctuation',
    typeWording: 'Formulation',
    copy: 'Copier',
    copied: 'Copié',
    noResult: 'Entrez du texte pour commencer',
    error: 'Échec de la vérification, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    textTooLong: 'Texte trop long (max 4000 caractères)',
  },
  es: {
    title: 'Verificador AI de gramática y escritura',
    subtitle: 'Pega tu texto y obtén correcciones, sugerencias de reescritura y puntuación de legibilidad',
    text: 'Texto a verificar',
    textPlaceholder: 'Pega tu texto aquí para revisar...',
    goal: 'Objetivo de escritura',
    goalGeneral: 'General',
    goalAcademic: 'Académico',
    goalBusinessEmail: 'Correo corporativo',
    goalSocial: 'Redes sociales',
    goalResume: 'Currículum',
    goalCasual: 'Informal',
    check: '✨ Verificar gramática',
    loading: 'Analizando...',
    score: 'Puntuación de legibilidad',
    corrections: 'Correcciones',
    noIssues: 'No se encontraron problemas evidentes',
    rewritten: 'Texto reescrito',
    tone: 'Análisis de tono',
    toneSuggestion: 'Sugerencia de tono',
    statsWords: 'Palabras',
    statsSentences: 'Oraciones',
    statsIssues: 'Problemas',
    typeGrammar: 'Gramática',
    typeSpelling: 'Ortografía',
    typePunctuation: 'Puntuación',
    typeWording: 'Redacción',
    copy: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa texto para empezar',
    error: 'Error en la verificación, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    textTooLong: 'Texto demasiado largo (máx 4000 caracteres)',
  },
  ar: {
    title: 'مُراجع النصوص والقواعد AI',
    subtitle: 'لصق النص واحصل على تصليح القواعد، مقترحات إعادة الكتابة ونقاط القراءة',
    text: 'النص المراد مراجعته',
    textPlaceholder: 'لصق نصك هنا لمراجعته...',
    goal: 'هدف الكتابة',
    goalGeneral: 'عام',
    goalAcademic: 'أكاديمي',
    goalBusinessEmail: 'بريد عمل',
    goalSocial: 'الوسائط الاجتماعية',
    goalResume: 'السيرة الذاتية',
    goalCasual: 'غير رسمي',
    check: '✨ مراجعة القواعد',
    loading: 'جاري التحليل...',
    score: 'نقاط القراءة',
    corrections: 'التصليحات',
    noIssues: 'لم يتم العثور على مشكلات واضحة',
    rewritten: 'النص المعاد كتابته',
    tone: 'تحليل النبرة',
    toneSuggestion: 'مقترح النبرة',
    statsWords: 'كلمات',
    statsSentences: 'جمل',
    statsIssues: 'مشكلات',
    typeGrammar: 'قواعد',
    typeSpelling: 'Орфография',
    typePunctuation: 'علامات ترقيم',
    typeWording: 'الصياغة',
    copy: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل النص لبدء المراجعة',
    error: 'فشل المراجعة، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    textTooLong: 'النص طويل جدًا (أقصى 4000 حرف)',
  },
};

const GOALS = [
  { key: 'general', label: 'goalGeneral' },
  { key: 'academic', label: 'goalAcademic' },
  { key: 'business-email', label: 'goalBusinessEmail' },
  { key: 'social', label: 'goalSocial' },
  { key: 'resume', label: 'goalResume' },
  { key: 'casual', label: 'goalCasual' },
];

interface Correction {
  original: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'wording';
  reason: string;
}

interface GrammarResult {
  corrections: Correction[];
  rewritten: string;
  score: number;
  scoreComment: string;
  tone: string;
  toneSuggestion: string;
  stats: {
    words: number;
    sentences: number;
    issues: number;
  };
  remaining: number | null;
}

export default function AiGrammarTool({ locale = 'zh' }: AiGrammarToolProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [text, setText] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('general');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheck = useCallback(async () => {
    if (!text.trim()) return;
    if (text.length > 4000) return;

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-grammar-checker/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          goal: selectedGoal,
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
        corrections: data.corrections || [],
        rewritten: data.rewritten || '',
        score: data.score || 0,
        scoreComment: data.scoreComment || '',
        tone: data.tone || '',
        toneSuggestion: data.toneSuggestion || '',
        stats: data.stats || { words: 0, sentences: 0, issues: 0 },
        remaining: data.remaining,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [text, selectedGoal, resolvedLocale]);

  const handleCopy = useCallback(async (textToCopy: string, index: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }, []);

  const getTypeLabel = (type: string): string => {
    return t(`type${type.charAt(0).toUpperCase() + type.slice(1)}`) || type;
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'grammar': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'spelling': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'punctuation': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'wording': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'>
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('text')} <span className='text-red-500'>*</span>
              <span className='text-gray-400 font-normal ms-2'>{text.length}/4000</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setError(false); }}
              placeholder={t('textPlaceholder')}
              className={`w-full h-40 sm:h-48 p-3 sm:p-4 rounded-lg border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-colors ${
                text.length > 4000 
                  ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            />
            {text.length > 4000 && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400'>{t('textTooLong')}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('goal')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {GOALS.map((goalItem) => (
                <button
                  key={goalItem.key}
                  onClick={() => setSelectedGoal(goalItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    selectedGoal === goalItem.key
                      ? 'text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md scale-[1.02]'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Target className='h-4 w-4' />
                  {t(goalItem.label)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={mounted && (!text.trim() || text.length > 4000 || loading)}
            className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Sparkles className='h-5 w-5' />
            )}
            {loading ? t('loading') : t('check')}
          </button>

          {error && !rateLimitError && (
            <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'>
              <p className='text-sm text-red-700 dark:text-red-300'>{t('error')}</p>
            </div>
          )}

          {result && (
            <div className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='sm:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Star className='h-5 w-5 text-amber-500' />
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('score')}</h3>
                  </div>
                  <div className='flex items-end gap-4'>
                    <span className='text-4xl sm:text-5xl font-bold text-emerald-600 dark:text-emerald-400'>{result.score}</span>
                    <span className='text-2xl text-gray-400'>/100</span>
                  </div>
                  <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{result.scoreComment}</p>
                </div>

                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('statsWords')}</h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-500 dark:text-gray-400'>{t('statsWords')}</span>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>{result.stats.words}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-500 dark:text-gray-400'>{t('statsSentences')}</span>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>{result.stats.sentences}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-500 dark:text-gray-400'>{t('statsIssues')}</span>
                      <span className={`font-medium ${result.stats.issues > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {result.stats.issues}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                <div className='flex items-center gap-2 mb-4'>
                  <MessageSquare className='h-5 w-5 text-blue-500' />
                  <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('corrections')}</h3>
                </div>

                {result.corrections.length === 0 ? (
                  <p className='text-center py-6 text-gray-500 dark:text-gray-400'>{t('noIssues')}</p>
                ) : (
                  <div className='space-y-3'>
                    {result.corrections.map((correction, index) => (
                      <div
                        key={index}
                        className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                      >
                        <div className='flex flex-wrap items-center gap-2 mb-2'>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeColor(correction.type)}`}>
                            {getTypeLabel(correction.type)}
                          </span>
                        </div>
                        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
                          <span className='text-red-600 dark:text-red-400 line-through'>{correction.original}</span>
                          <span className='text-gray-400'>→</span>
                          <span className='text-green-600 dark:text-green-400 font-medium'>{correction.suggestion}</span>
                        </div>
                        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{correction.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-purple-500' />
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('rewritten')}</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(result.rewritten, 0)}
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                  >
                    {copiedIndex === 0 ? <Check className='h-4 w-4 text-green-600 dark:text-green-400' /> : <Copy className='h-4 w-4' />}
                    {copiedIndex === 0 ? t('copied') : t('copy')}
                  </button>
                </div>
                <textarea
                  value={result.rewritten}
                  readOnly
                  className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none cursor-default'
                />
              </div>

              {result.tone && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Target className='h-5 w-5 text-indigo-500' />
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('tone')}</h3>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-sm font-medium text-indigo-700 dark:text-indigo-300'>
                      {result.tone}
                    </span>
                  </div>
                  {result.toneSuggestion && (
                    <div className='mt-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30'>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        <span className='font-medium text-blue-700 dark:text-blue-400'>{t('toneSuggestion')}: </span>
                        {result.toneSuggestion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}