'use client';

import { useState, useCallback } from 'react';
import { Regex, RefreshCw, Copy, Check, Sparkles, Code2, FileText, CheckCircle2, XCircle } from 'lucide-react';

interface AiRegexGeneratorProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 正则表达式生成器',
    subtitle: '用自然语言描述需求，AI 生成正则并解释每段含义',
    description: '需求描述',
    descriptionPlaceholder: '请用自然语言描述你要匹配的内容...\n例如：匹配一个合法的邮箱地址\n匹配中国大陆手机号\n提取文本中所有 URL',
    language: '目标语言',
    langJavascript: 'JavaScript',
    langPython: 'Python',
    langJava: 'Java',
    langGo: 'Go',
    langGeneral: '通用',
    testString: '测试字符串（可选）',
    testStringPlaceholder: '可选：粘贴一段文本，AI 会列出匹配到的子串...',
    generate: '✨ 生成正则',
    loading: '正在生成...',
    regex: '正则表达式',
    explanation: '逐段解释',
    matches: '匹配结果',
    testCode: '测试代码',
    copyRegex: '复制正则',
    copyCode: '复制代码',
    copied: '已复制',
    noMatch: '未匹配到任何内容',
    noResult: '请输入需求描述开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Regex Generator',
    subtitle: 'Describe what you want to match in plain language',
    description: 'Description',
    descriptionPlaceholder: 'Describe what you want to match in plain language...\ne.g. Match a valid email address\nMatch a Chinese mainland phone number\nExtract all URLs from text',
    language: 'Target Language',
    langJavascript: 'JavaScript',
    langPython: 'Python',
    langJava: 'Java',
    langGo: 'Go',
    langGeneral: 'General',
    testString: 'Test String (optional)',
    testStringPlaceholder: 'Optional: paste a text and AI will list matched substrings...',
    generate: '✨ Generate Regex',
    loading: 'Generating...',
    regex: 'Regex',
    explanation: 'Explanation',
    matches: 'Matches',
    testCode: 'Test Code',
    copyRegex: 'Copy Regex',
    copyCode: 'Copy Code',
    copied: 'Copied',
    noMatch: 'No matches found',
    noResult: 'Enter description to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI रेगुलर एक्सप्रेशन जनरेटर',
    subtitle: 'सादे भाषा में वर्णन करें और AI रेगुलर एक्सप्रेशन बनाएगा',
    description: 'विवरण',
    descriptionPlaceholder: 'सादे भाषा में बताएं कि क्या मैच करना है...',
    language: 'लक्ष्य भाषा',
    langJavascript: 'JavaScript',
    langPython: 'Python',
    langJava: 'Java',
    langGo: 'Go',
    langGeneral: 'सामान्य',
    testString: 'परीक्षण स्ट्रिंग (वैकल्पिक)',
    testStringPlaceholder: 'वैकल्पिक: एक पाठ पेस्ट करें और AI मैच की गई स्ट्रिंग दिखाएगा...',
    generate: '✨ रेगुलर एक्सप्रेशन बनाएं',
    loading: 'बनाया जा रहा है...',
    regex: 'रेगुलर एक्सप्रेशन',
    explanation: 'व्याख्या',
    matches: 'मैच',
    testCode: 'परीक्षण कोड',
    copyRegex: 'कॉपी करें',
    copyCode: 'कोड कॉपी करें',
    copied: 'कॉपी किया',
    noMatch: 'कोई मैच नहीं मिला',
    noResult: 'शुरू करने के लिए विवरण दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur d\'expressions régulières AI',
    subtitle: 'Décrivez en langage naturel et l\'AI génère le regex',
    description: 'Description',
    descriptionPlaceholder: 'Décrivez ce que vous voulez matcher en langage naturel...',
    language: 'Langage cible',
    langJavascript: 'JavaScript',
    langPython: 'Python',
    langJava: 'Java',
    langGo: 'Go',
    langGeneral: 'Général',
    testString: 'Chaîne de test (optionnel)',
    testStringPlaceholder: 'Optionnel: collez un texte et l\'AI listera les correspondances...',
    generate: '✨ Générer',
    loading: 'Génération...',
    regex: 'Expression régulière',
    explanation: 'Explication',
    matches: 'Correspondances',
    testCode: 'Code de test',
    copyRegex: 'Copier',
    copyCode: 'Copier le code',
    copied: 'Copié',
    noMatch: 'Aucune correspondance',
    noResult: 'Entrez la description pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de expresiones regulares AI',
    subtitle: 'Describe en lenguaje natural y la AI genera el regex',
    description: 'Descripción',
    descriptionPlaceholder: 'Describe en lenguaje natural lo que quieres coincidir...',
    language: 'Lenguaje objetivo',
    langJavascript: 'JavaScript',
    langPython: 'Python',
    langJava: 'Java',
    langGo: 'Go',
    langGeneral: 'General',
    testString: 'Cadena de prueba (opcional)',
    testStringPlaceholder: 'Opcional: pega un texto y la AI listará las coincidencias...',
    generate: '✨ Generar',
    loading: 'Generando...',
    regex: 'Expresión regular',
    explanation: 'Explicación',
    matches: 'Coincidencias',
    testCode: 'Código de prueba',
    copyRegex: 'Copiar',
    copyCode: 'Copiar código',
    copied: 'Copiado',
    noMatch: 'Sin coincidencias',
    noResult: 'Ingresa la descripción para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مولد التعبيرات النمطية AI',
    subtitle: 'صف باللغة الطبيعية وأنشئ AI التعبير النمطي',
    description: 'الوصف',
    descriptionPlaceholder: 'صف باللغة الطبيعية ما تريد مطابقته...',
    language: 'اللغة المستهدفة',
    langJavascript: 'JavaScript',
    langPython: 'Python',
    langJava: 'Java',
    langGo: 'Go',
    langGeneral: 'عام',
    testString: 'سلسلة الاختبار (اختياري)',
    testStringPlaceholder: 'اختياري: الصق نصاً وسيسرد AI المطابقات...',
    generate: '✨ إنشاء التعبير',
    loading: 'جاري الإنشاء...',
    regex: 'التعبير النمطي',
    explanation: 'الشرح',
    matches: 'المطابقات',
    testCode: 'كود الاختبار',
    copyRegex: 'نسخ',
    copyCode: 'نسخ الكود',
    copied: 'تم النسخ',
    noMatch: 'لا توجد مطابقات',
    noResult: 'أدخل الوصف لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const LANGUAGES = [
  { key: 'javascript', label: 'langJavascript' },
  { key: 'python', label: 'langPython' },
  { key: 'java', label: 'langJava' },
  { key: 'go', label: 'langGo' },
  { key: 'general', label: 'langGeneral' },
];

interface GenerateResult {
  regex: string;
  explanation: string;
  matches: string[];
  testCode: string;
  remaining: number | null;
}

export default function AiRegexGenerator({ locale = 'zh' }: AiRegexGeneratorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [description, setDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-regex-generator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          language: selectedLanguage,
          testString: testString.trim() || undefined,
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
        regex: data.regex || '',
        explanation: data.explanation || '',
        matches: data.matches || [],
        testCode: data.testCode || '',
        remaining: data.remaining,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [description, selectedLanguage, testString, resolvedLocale]);

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'>
            <Regex className='h-5 w-5 sm:h-6 sm:w-6' />
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
              <FileText className='h-4 w-4 text-indigo-500' />
              {t('description')} <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(false); }}
              placeholder={t('descriptionPlaceholder')}
              className='w-full h-28 sm:h-32 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('language')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
              {LANGUAGES.map((langItem) => (
                <button
                  key={langItem.key}
                  onClick={() => setSelectedLanguage(langItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedLanguage === langItem.key
                      ? 'text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(langItem.label)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('testString')}
            </label>
            <textarea
              value={testString}
              onChange={(e) => { setTestString(e.target.value); setError(false); }}
              placeholder={t('testStringPlaceholder')}
              className='w-full h-24 sm:h-28 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors font-mono text-sm'
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!description.trim() || loading}
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

          {result && result.regex && (
            <div className='space-y-4 sm:space-y-6'>
              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <Regex className='h-5 w-5 text-indigo-500' />
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('regex')}</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(result.regex, 'regex')}
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                  >
                    {copiedField === 'regex' ? <Check className='h-4 w-4 text-green-600 dark:text-green-400' /> : <Copy className='h-4 w-4' />}
                    {copiedField === 'regex' ? t('copied') : t('copyRegex')}
                  </button>
                </div>
                <pre className='p-3 sm:p-4 rounded-lg bg-gray-900 dark:bg-black/40 text-green-400 text-sm sm:text-base font-mono overflow-x-auto whitespace-pre-wrap break-all'>
/{result.regex}/g
                </pre>
              </div>

              {result.explanation && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <FileText className='h-5 w-5 text-blue-500' />
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('explanation')}</h3>
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>{result.explanation}</p>
                </div>
              )}

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                <div className='flex items-center gap-2 mb-3'>
                  {result.matches.length > 0 ? (
                    <CheckCircle2 className='h-5 w-5 text-green-500' />
                  ) : (
                    <XCircle className='h-5 w-5 text-gray-400' />
                  )}
                  <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('matches')}</h3>
                </div>
                {result.matches.length === 0 ? (
                  <p className='text-sm text-gray-500 dark:text-gray-400'>{t('noMatch')}</p>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {result.matches.map((match, index) => (
                      <span
                        key={index}
                        className='px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-sm font-mono text-green-700 dark:text-green-300 break-all'
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {result.testCode && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <Code2 className='h-5 w-5 text-purple-500' />
                      <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('testCode')}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(result.testCode, 'code')}
                      className='flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                    >
                      {copiedField === 'code' ? <Check className='h-4 w-4 text-green-600 dark:text-green-400' /> : <Copy className='h-4 w-4' />}
                      {copiedField === 'code' ? t('copied') : t('copyCode')}
                    </button>
                  </div>
                  <pre className='p-3 sm:p-4 rounded-lg bg-gray-900 dark:bg-black/40 text-gray-100 text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words'>
{result.testCode}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
