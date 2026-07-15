'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, RefreshCw, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface ToneChangerProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '语气转换器',
    subtitle: '一键改变文本语气风格',
    input: '输入要转换的文本',
    placeholder: '输入你想要转换语气的文本...',
    tone: '选择目标语气',
    formal: '正式/商务',
    friendly: '友好/亲切',
    concise: '简洁/精炼',
    humorous: '幽默/风趣',
    persuasive: '说服/营销',
    academic: '学术/专业',
    generate: '✨ 转换语气',
    loading: '正在转换...',
    original: '原始文本',
    rewritten: '转换后',
    explanation: '转换说明',
    copyResult: '复制结果',
    copied: '已复制',
    noResult: '请输入文本开始转换',
    error: '转换失败，请重试',
  },
  en: {
    title: 'Tone Shifter',
    subtitle: 'Change text tone with one click',
    input: 'Enter text to transform',
    placeholder: 'Enter text you want to change the tone of...',
    tone: 'Select target tone',
    formal: 'Formal/Business',
    friendly: 'Friendly/Casual',
    concise: 'Concise/To-the-point',
    humorous: 'Humorous/Funny',
    persuasive: 'Persuasive/Marketing',
    academic: 'Academic/Professional',
    generate: '✨ Shift Tone',
    loading: 'Transforming...',
    original: 'Original',
    rewritten: 'Rewritten',
    explanation: 'Transformation Notes',
    copyResult: 'Copy Result',
    copied: 'Copied',
    noResult: 'Enter text to get started',
    error: 'Failed to transform, please retry',
  },
  hi: {
    title: 'टोन शिफ्टर',
    subtitle: 'एक क्लिक से टेक्स्ट टोन बदलें',
    input: 'परिवर्तित करने के लिए टेक्स्ट दर्ज करें',
    placeholder: 'टोन बदलने के लिए अपना टेक्स्ट दर्ज करें...',
    tone: 'लक्ष्य टोन चुनें',
    formal: 'औपचारिक/व्यावसायिक',
    friendly: 'दोस्ताना/आसान',
    concise: 'संक्षिप्त',
    humorous: 'हास्यपूर्ण',
    persuasive: 'प्रेरणादायक/विपणन',
    academic: 'अकादमिक/पेशेवर',
    generate: '✨ टोन बदलें',
    loading: 'परिवर्तन हो रहा है...',
    original: 'मूल',
    rewritten: 'फिर से लिखा',
    explanation: 'परिवर्तन नोट्स',
    copyResult: 'परिणाम कॉपी',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए टेक्स्ट दर्ज करें',
    error: 'परिवर्तन विफल, कृपया पुनः प्रयास करें',
  },
  fr: {
    title: 'Changeur de Ton',
    subtitle: 'Changez le ton du texte en un clic',
    input: 'Entrez le texte à transformer',
    placeholder: 'Entrez le texte dont vous voulez changer le ton...',
    tone: 'Sélectionnez le ton cible',
    formal: 'Formel/Affaires',
    friendly: 'Amiable/Décontracté',
    concise: 'Concis/Direct',
    humorous: 'Humoristique',
    persuasive: 'Persuasif/Marketing',
    academic: 'Académique/Professionnel',
    generate: '✨ Changer le Ton',
    loading: 'Transformation...',
    original: 'Original',
    rewritten: 'Réécrit',
    explanation: 'Notes de transformation',
    copyResult: 'Copier le résultat',
    copied: 'Copié',
    noResult: 'Entrez du texte pour commencer',
    error: 'Échec de la transformation, réessayez',
  },
  es: {
    title: 'Cambiador de Tono',
    subtitle: 'Cambia el tono del texto con un clic',
    input: 'Ingresa el texto a transformar',
    placeholder: 'Ingresa el texto del que quieras cambiar el tono...',
    tone: 'Selecciona el tono objetivo',
    formal: 'Formal/Negocios',
    friendly: 'Amigable/Informal',
    concise: 'Conciso/Directo',
    humorous: 'Humorístico',
    persuasive: 'Persuasivo/Marketing',
    academic: 'Académico/Profesional',
    generate: '✨ Cambiar Tono',
    loading: 'Transformando...',
    original: 'Original',
    rewritten: 'Reescrito',
    explanation: 'Notas de transformación',
    copyResult: 'Copiar Resultado',
    copied: 'Copiado',
    noResult: 'Ingresa texto para empezar',
    error: 'Error al transformar, intenta de nuevo',
  },
  ar: {
    title: 'مُحول النبرات',
    subtitle: 'قم بتغيير نبرة النص بنقرة واحدة',
    input: 'أدخل النص المراد تحويله',
    placeholder: 'أدخل النص الذي ترغب في تغيير نبرته...',
    tone: 'اختر النبرة المستهدفة',
    formal: 'رسمي/تجاري',
    friendly: 'ودود/غير رسمي',
    concise: 'مختصر/مباشر',
    humorous: 'مزح',
    persuasive: 'قائل/تسويقي',
    academic: 'أكاديمي/محترف',
    generate: '✨ تحول النبرة',
    loading: 'جاري التحول...',
    original: 'الأصلي',
    rewritten: 'المُعاد كتابته',
    explanation: 'ملاحظات التحول',
    copyResult: 'نسخ النتيجة',
    copied: 'تم النسخ',
    noResult: 'أدخل نصاً لتبدأ',
    error: 'فشل التحول، حاول مرة أخرى',
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

interface TransformResult {
  original: string;
  rewritten: string;
  tone: string;
  explanation: string;
}

export default function ToneChanger({ locale = 'zh' }: ToneChangerProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [input, setInput] = useState('');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [result, setResult] = useState<TransformResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleTransform = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await fetch('/api/tone-changer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim(), tone: selectedTone, locale: resolvedLocale }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        original: data.original,
        rewritten: data.rewritten,
        tone: data.tone,
        explanation: data.explanation,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [input, selectedTone, resolvedLocale]);

  const handleCopy = useCallback(async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.rewritten;
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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'>
            <MessageSquare className='h-5 w-5 sm:h-6 sm:w-6' />
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
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors'
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
            onClick={handleTransform}
            disabled={!input.trim() || loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <RefreshCw className='h-5 w-5 animate-spin' />
            ) : (
              <Sparkles className='h-5 w-5' />
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
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 text-xs font-semibold text-gray-600 dark:text-gray-400'>
                      {t('original')}
                    </span>
                  </div>
                  <p className='text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap'>
                    {result.original}
                  </p>
                </div>

                <div className='rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10 p-4 sm:p-5'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-xs font-semibold text-purple-700 dark:text-purple-300'>
                      {t('rewritten')}
                    </span>
                    <button
                      onClick={handleCopy}
                      className='flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors'
                    >
                      {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
                      {copied ? t('copied') : t('copyResult')}
                    </button>
                  </div>
                  <p className='text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap'>
                    {result.rewritten}
                  </p>
                </div>
              </div>

              {result.explanation && (
                <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 sm:p-5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <ArrowRight className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('explanation')}</h3>
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>{result.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
