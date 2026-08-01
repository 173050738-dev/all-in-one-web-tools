'use client';

import { useState, useCallback } from 'react';
import { Gift, RefreshCw, Copy, Check, Sparkles, Heart, Cake, PartyPopper, Home, GraduationCap, TrendingUp, Moon, Calendar } from 'lucide-react';

interface AiGreetingGeneratorProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 祝福语生成器',
    subtitle: '输入场景和收件人，一键生成3条真挚动人的祝福语',
    occasion: '场景',
    occasionBirthday: '生日',
    occasionWedding: '婚礼',
    occasionNewyear: '新年',
    occasionSpringfestival: '春节',
    occasionMidautumn: '中秋',
    occasionHousewarming: '乔迁',
    occasionGraduation: '毕业',
    occasionPromotion: '升职',
    recipient: '收件人称呼',
    recipientPlaceholder: '请输入收件人称呼，如：王老师/小明/老妈...',
    message: '附加留言（可选）',
    messagePlaceholder: '可选：补充一些你想表达的内容、回忆或细节...',
    tone: '语气风格',
    toneWarm: '温馨',
    toneFormal: '正式',
    toneHumorous: '幽默',
    toneCreative: '创意',
    generate: '✨ 生成祝福语',
    loading: '正在生成...',
    greeting: '祝福语',
    tips: '送出建议',
    copyGreeting: '复制祝福语',
    copied: '已复制',
    noResult: '请输入收件人开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Greeting Generator',
    subtitle: 'Enter occasion and recipient to get 3 heartfelt greetings',
    occasion: 'Occasion',
    occasionBirthday: 'Birthday',
    occasionWedding: 'Wedding',
    occasionNewyear: 'New Year',
    occasionSpringfestival: 'Spring Festival',
    occasionMidautumn: 'Mid-Autumn',
    occasionHousewarming: 'Housewarming',
    occasionGraduation: 'Graduation',
    occasionPromotion: 'Promotion',
    recipient: 'Recipient',
    recipientPlaceholder: 'Enter recipient name, e.g. Mr. Lee, Mom, John...',
    message: 'Additional Message (optional)',
    messagePlaceholder: 'Optional: add any details, memories or thoughts you want to express...',
    tone: 'Tone',
    toneWarm: 'Warm',
    toneFormal: 'Formal',
    toneHumorous: 'Humorous',
    toneCreative: 'Creative',
    generate: '✨ Generate Greetings',
    loading: 'Generating...',
    greeting: 'Greeting',
    tips: 'Tips',
    copyGreeting: 'Copy',
    copied: 'Copied',
    noResult: 'Enter recipient to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI शुभकामना जनरेटर',
    subtitle: 'अवसर और प्राप्तकर्ता दर्ज करें और 3 हार्दिक शुभकामनाएं पाएं',
    occasion: 'अवसर',
    occasionBirthday: 'जन्मदिन',
    occasionWedding: 'शादी',
    occasionNewyear: 'नया साल',
    occasionSpringfestival: 'वसंत उत्सव',
    occasionMidautumn: 'मध्य शरद',
    occasionHousewarming: 'गृह प्रवेश',
    occasionGraduation: 'स्नातक',
    occasionPromotion: 'पदोन्नति',
    recipient: 'प्राप्तकर्ता',
    recipientPlaceholder: 'प्राप्तकर्ता का नाम दर्ज करें...',
    message: 'अतिरिक्त संदेश (वैकल्पिक)',
    messagePlaceholder: 'वैकल्पिक: कोई विवरण, स्मृतियां या विचार जोड़ें...',
    tone: 'टोन',
    toneWarm: 'गर्मजनक',
    toneFormal: 'औपचारिक',
    toneHumorous: 'हास्यपूर्ण',
    toneCreative: 'रचनात्मक',
    generate: '✨ शुभकामनाएं बनाएं',
    loading: 'बनाया जा रहा है...',
    greeting: 'शुभकामना',
    tips: 'सुझाव',
    copyGreeting: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए प्राप्तकर्ता दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur de félicitations AI',
    subtitle: 'Saisissez occasion et destinataire pour 3 félicitations sincères',
    occasion: 'Occasion',
    occasionBirthday: 'Anniversaire',
    occasionWedding: 'Mariage',
    occasionNewyear: 'Nouvel An',
    occasionSpringfestival: 'Fête du printemps',
    occasionMidautumn: 'Mi-automne',
    occasionHousewarming: 'Emménagement',
    occasionGraduation: 'Diplôme',
    occasionPromotion: 'Promotion',
    recipient: 'Destinataire',
    recipientPlaceholder: 'Entrez le nom du destinataire...',
    message: 'Message supplémentaire (optionnel)',
    messagePlaceholder: 'Optionnel: ajoutez détails, souvenirs ou pensées...',
    tone: 'Ton',
    toneWarm: 'Chaleureux',
    toneFormal: 'Formel',
    toneHumorous: 'Humoristique',
    toneCreative: 'Créatif',
    generate: '✨ Générer',
    loading: 'Génération...',
    greeting: 'Félicitation',
    tips: 'Conseils',
    copyGreeting: 'Copier',
    copied: 'Copié',
    noResult: 'Entrez le destinataire pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de felicitaciones AI',
    subtitle: 'Ingresa ocasión y destinatario para 3 felicitaciones sinceras',
    occasion: 'Ocasión',
    occasionBirthday: 'Cumpleaños',
    occasionWedding: 'Boda',
    occasionNewyear: 'Año Nuevo',
    occasionSpringfestival: 'Fiesta de primavera',
    occasionMidautumn: 'Medio otoño',
    occasionHousewarming: 'Inauguración',
    occasionGraduation: 'Graduación',
    occasionPromotion: 'Ascenso',
    recipient: 'Destinatario',
    recipientPlaceholder: 'Ingresa el nombre del destinatario...',
    message: 'Mensaje adicional (opcional)',
    messagePlaceholder: 'Opcional: añade detalles, recuerdos o pensamientos...',
    tone: 'Tono',
    toneWarm: 'Cálido',
    toneFormal: 'Formal',
    toneHumorous: 'Humorístico',
    toneCreative: 'Creativo',
    generate: '✨ Generar',
    loading: 'Generando...',
    greeting: 'Felicitación',
    tips: 'Consejos',
    copyGreeting: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa el destinatario para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مولد التهنئات AI',
    subtitle: 'أدخل المناسبة والمستلم للحصول على 3 تهنئات صادقة',
    occasion: 'المناسبة',
    occasionBirthday: 'عيد ميلاد',
    occasionWedding: 'زفاف',
    occasionNewyear: 'رأس السنة',
    occasionSpringfestival: 'مهرجان الربيع',
    occasionMidautumn: 'منتصف الخريف',
    occasionHousewarming: 'انتقال منزل',
    occasionGraduation: 'تخرج',
    occasionPromotion: 'ترقية',
    recipient: 'المستلم',
    recipientPlaceholder: 'أدخل اسم المستلم...',
    message: 'رسالة إضافية (اختياري)',
    messagePlaceholder: 'اختياري: أضف تفاصيل أو ذكريات أو أفكار...',
    tone: 'النبرة',
    toneWarm: 'دافئ',
    toneFormal: 'رسمي',
    toneHumorous: 'مزاح',
    toneCreative: 'إبداعي',
    generate: '✨ إنشاء التهنئات',
    loading: 'جاري الإنشاء...',
    greeting: 'التهنئة',
    tips: 'نصائح',
    copyGreeting: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل المستلم لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const OCCASIONS = [
  { key: 'birthday', label: 'occasionBirthday', icon: Cake },
  { key: 'wedding', label: 'occasionWedding', icon: Heart },
  { key: 'newyear', label: 'occasionNewyear', icon: Calendar },
  { key: 'springfestival', label: 'occasionSpringfestival', icon: PartyPopper },
  { key: 'midautumn', label: 'occasionMidautumn', icon: Moon },
  { key: 'housewarming', label: 'occasionHousewarming', icon: Home },
  { key: 'graduation', label: 'occasionGraduation', icon: GraduationCap },
  { key: 'promotion', label: 'occasionPromotion', icon: TrendingUp },
];

const TONES = [
  { key: 'warm', label: 'toneWarm' },
  { key: 'formal', label: 'toneFormal' },
  { key: 'humorous', label: 'toneHumorous' },
  { key: 'creative', label: 'toneCreative' },
];

interface GreetingItem {
  greeting: string;
  tips: string;
}

interface GenerateResult {
  items: GreetingItem[];
  remaining: number | null;
}

export default function AiGreetingGenerator({ locale = 'zh' }: AiGreetingGeneratorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [occasion, setOccasion] = useState('birthday');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState('warm');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!recipient.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-greeting-generator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          recipient: recipient.trim(),
          message: message.trim() || undefined,
          tone: selectedTone,
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
        items: data.items || [],
        remaining: data.remaining,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [occasion, recipient, message, selectedTone, resolvedLocale]);

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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'>
            <Gift className='h-5 w-5 sm:h-6 sm:w-6' />
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
              {t('occasion')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {OCCASIONS.map((occItem) => {
                const Icon = occItem.icon;
                return (
                  <button
                    key={occItem.key}
                    onClick={() => setOccasion(occItem.key)}
                    className={`flex flex-col items-center justify-center gap-1 min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      occasion === occItem.key
                        ? 'text-white bg-gradient-to-br from-pink-500 to-rose-600 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {t(occItem.label)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('recipient')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={recipient}
              onChange={(e) => { setRecipient(e.target.value); setError(false); }}
              placeholder={t('recipientPlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('message')}
            </label>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setError(false); }}
              placeholder={t('messagePlaceholder')}
              className='w-full h-24 sm:h-28 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('tone')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {TONES.map((toneItem) => (
                <button
                  key={toneItem.key}
                  onClick={() => setSelectedTone(toneItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTone === toneItem.key
                      ? 'text-white bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md scale-[1.02]'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(toneItem.label)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!recipient.trim() || loading}
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
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('greeting')}</h3>
              <div className='space-y-4 sm:space-y-5'>
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span className='px-2 py-1 rounded-md bg-pink-100 dark:bg-pink-900/30 text-xs font-semibold text-pink-700 dark:text-pink-300'>
                        {t('greeting')} #{index + 1}
                      </span>
                      <button
                        onClick={() => handleCopy(item.greeting, index)}
                        className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                      >
                        {copiedIndex === index ? <Check className='h-3 w-3 text-green-600 dark:text-green-400' /> : <Copy className='h-3 w-3' />}
                        {copiedIndex === index ? t('copied') : t('copyGreeting')}
                      </button>
                    </div>
                    <p className='text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base whitespace-pre-wrap mb-3'>
                      {item.greeting}
                    </p>
                    <div className='p-2 sm:p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30'>
                      <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                        <span className='font-medium text-amber-700 dark:text-amber-400'>{t('tips')}: </span>
                        {item.tips}
                      </p>
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
