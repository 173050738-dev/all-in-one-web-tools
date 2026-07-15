'use client';

import { useState, useCallback } from 'react';
import { Lightbulb, RefreshCw, Copy, Check, BookOpen, ArrowRight, Link2 } from 'lucide-react';

interface ConceptExplainerProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '概念易懂器',
    subtitle: '用简单语言解释复杂概念',
    input: '输入你想理解的概念',
    placeholder: '例如：量子计算、区块链、相对论、人工智能...',
    generate: '💡 开始解释',
    loading: '正在分析概念...',
    simpleExplanation: '简单解释',
    analogy: '生活化类比',
    keyPoints: '关键点',
    example: '实际例子',
    relatedConcepts: '相关概念',
    copyAll: '复制全部',
    copied: '已复制',
    noResult: '请输入概念开始解释',
    error: '解释失败，请重试',
  },
  en: {
    title: 'Concept Simplifier',
    subtitle: 'Explain complex concepts in simple terms',
    input: 'Enter the concept you want to understand',
    placeholder: 'E.g., quantum computing, blockchain, relativity, AI...',
    generate: '💡 Simplify',
    loading: 'Analyzing concept...',
    simpleExplanation: 'Simple Explanation',
    analogy: 'Analogy',
    keyPoints: 'Key Points',
    example: 'Example',
    relatedConcepts: 'Related Concepts',
    copyAll: 'Copy All',
    copied: 'Copied',
    noResult: 'Enter a concept to get started',
    error: 'Failed to explain, please retry',
  },
  hi: {
    title: 'कॉन्सेप्ट सिम्पलिफायर',
    subtitle: 'जटिल अवधारणाओं को सरल भाषा में समझाएं',
    input: 'वह अवधारणा दर्ज करें जिसे आप समझना चाहते हैं',
    placeholder: 'उदाहरण: क्वांटम कंप्यूटिंग, ब्लॉकचेन, सापेक्षता...',
    generate: '💡 सरल बनाएं',
    loading: 'अवधारणा का विश्लेषण हो रहा है...',
    simpleExplanation: 'सरल व्याख्या',
    analogy: 'उदाहरण',
    keyPoints: 'मुख्य बिंदु',
    example: 'उदाहरण',
    relatedConcepts: 'संबंधित अवधारणाएं',
    copyAll: 'सभी कॉपी',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए एक अवधारणा दर्ज करें',
    error: 'व्याख्या विफल, कृपया पुनः प्रयास करें',
  },
  fr: {
    title: 'Simplificateur de Concepts',
    subtitle: 'Expliquez des concepts complexes en langage simple',
    input: 'Entrez le concept que vous voulez comprendre',
    placeholder: 'Ex: calcul quantique, blockchain, relativité, IA...',
    generate: '💡 Simplifier',
    loading: 'Analyse du concept...',
    simpleExplanation: 'Explication Simple',
    analogy: 'Analogie',
    keyPoints: 'Points Clés',
    example: 'Exemple',
    relatedConcepts: 'Concepts Associés',
    copyAll: 'Copier tout',
    copied: 'Copié',
    noResult: 'Entrez un concept pour commencer',
    error: 'Échec de l\'explication, réessayez',
  },
  es: {
    title: 'Simplificador de Conceptos',
    subtitle: 'Explica conceptos complejos en términos sencillos',
    input: 'Ingresa el concepto que quieres entender',
    placeholder: 'Ej: computación cuántica, blockchain, relatividad, IA...',
    generate: '💡 Simplificar',
    loading: 'Analizando concepto...',
    simpleExplanation: 'Explicación Sencilla',
    analogy: 'Analogía',
    keyPoints: 'Puntos Clave',
    example: 'Ejemplo',
    relatedConcepts: 'Conceptos Relacionados',
    copyAll: 'Copiar todo',
    copied: 'Copiado',
    noResult: 'Ingresa un concepto para empezar',
    error: 'Error al explicar, intenta de nuevo',
  },
  ar: {
    title: 'مُبسِّط المفاهيم',
    subtitle: 'أشرح المفاهيم المعقدة بلغة بسيطة',
    input: 'أدخل المفهوم الذي ترغب في فهمه',
    placeholder: 'مثل: الحوسبة الكمومية، التسلسل الحلقي، النسبية، الذكاء الاصطناعي...',
    generate: '💡 أبسط',
    loading: 'جاري تحليل المفهوم...',
    simpleExplanation: 'شرح بسيط',
    analogy: 'مثل',
    keyPoints: 'النقاط الرئيسية',
    example: 'مثال',
    relatedConcepts: 'المفاهيم ذات الصلة',
    copyAll: 'نسخ الكل',
    copied: 'تم النسخ',
    noResult: 'أدخل مفهوماً لتبدأ',
    error: 'فشل الشرح، حاول مرة أخرى',
  },
};

interface ExplainResult {
  concept: string;
  simpleExplanation: string;
  analogy: string;
  keyPoints: string[];
  example: string;
  relatedConcepts: string[];
}

export default function ConceptExplainer({ locale = 'zh' }: ConceptExplainerProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [input, setInput] = useState('');
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleExplain = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await fetch('/api/concept-explain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: input.trim(), locale: resolvedLocale }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        concept: data.concept,
        simpleExplanation: data.simpleExplanation,
        analogy: data.analogy,
        keyPoints: data.keyPoints,
        example: data.example,
        relatedConcepts: data.relatedConcepts,
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
      `${t('simpleExplanation')}:`,
      result.simpleExplanation,
      '',
      `${t('analogy')}:`,
      result.analogy,
      '',
      `${t('keyPoints')}:`,
      ...result.keyPoints.map((p) => '- ' + p),
      '',
      `${t('example')}:`,
      result.example,
      '',
      `${t('relatedConcepts')}:`,
      result.relatedConcepts.join(', '),
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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'>
            <Lightbulb className='h-5 w-5 sm:h-6 sm:w-6' />
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
            <input
              type='text'
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder={t('placeholder')}
              className='w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              onKeyPress={(e) => e.key === 'Enter' && handleExplain()}
            />
          </div>

          <button
            onClick={handleExplain}
            disabled={!input.trim() || loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Lightbulb className='h-5 w-5' />
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
                  <BookOpen className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>{result.concept}</h2>
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm'
                >
                  {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  {copied ? t('copied') : t('copyAll')}
                </button>
              </div>

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 sm:p-5'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t('simpleExplanation')}</h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{result.simpleExplanation}</p>
              </div>

              {result.analogy && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowRight className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('analogy')}</h3>
                  </div>
                  <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{result.analogy}</p>
                </div>
              )}

              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('keyPoints')}</h3>
                  <ul className='space-y-2'>
                    {result.keyPoints.map((point, idx) => (
                      <li key={idx} className='flex items-start gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold'>
                          {idx + 1}
                        </span>
                        <span className='text-gray-700 dark:text-gray-300'>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.example && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 sm:p-5'>
                  <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t('example')}</h3>
                  <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{result.example}</p>
                </div>
              )}

              {result.relatedConcepts && result.relatedConcepts.length > 0 && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Link2 className='h-5 w-5 text-gray-600 dark:text-gray-400' />
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('relatedConcepts')}</h3>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {result.relatedConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className='px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm'
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
