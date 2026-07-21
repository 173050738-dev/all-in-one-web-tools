'use client';

import { useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Hash, Flame, TrendingUp, Heart } from 'lucide-react';

interface AiXiaohongshuTitleGeneratorToolProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '小红书标题 AI 生成器',
    subtitle: '输入笔记主题，AI 帮你生成爆款标题',
    topic: '笔记主题',
    topicPlaceholder: '请输入你的笔记主题或关键词...',
    content: '内容描述',
    contentPlaceholder: '请简要描述笔记内容，可多行输入...',
    type: '标题风格',
    typeHot: '爆款吸睛',
    typeEmotion: '情感共鸣',
    typeCuriosity: '好奇心',
    typePractical: '实用干货',
    typeStory: '故事叙述',
    typeQuestion: '提问互动',
    tone: '语气风格',
    formal: '正式/专业',
    friendly: '亲切/接地气',
    concise: '简洁/精炼',
    humorous: '幽默/风趣',
    persuasive: '说服/引流',
    academic: '专业/深度',
    generate: '✨ 生成标题',
    loading: '正在生成...',
    title: '标题',
    why: '创作思路',
    copyCopy: '复制',
    copied: '已复制',
    noResult: '请输入笔记主题开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'Xiaohongshu Title Generator',
    subtitle: 'Enter your topic and generate viral headlines',
    topic: 'Note Topic',
    topicPlaceholder: 'Enter your note topic or keywords...',
    content: 'Content Description',
    contentPlaceholder: 'Briefly describe your note content, multi-line supported...',
    type: 'Title Style',
    typeHot: 'Viral/Attention',
    typeEmotion: 'Emotional',
    typeCuriosity: 'Curiosity',
    typePractical: 'Practical',
    typeStory: 'Storytelling',
    typeQuestion: 'Question',
    tone: 'Tone Style',
    formal: 'Formal/Professional',
    friendly: 'Friendly/Casual',
    concise: 'Concise/Direct',
    humorous: 'Humorous/Funny',
    persuasive: 'Persuasive/Engaging',
    academic: 'Academic/Deep',
    generate: '✨ Generate Titles',
    loading: 'Generating...',
    title: 'Title',
    why: 'Why This Works',
    copyCopy: 'Copy',
    copied: 'Copied',
    noResult: 'Enter topic to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'Xiaohongshu शीर्षक जेनरेटर',
    subtitle: 'अपना विषय दर्ज करें और वायरल शीर्षक बनाएं',
    topic: 'नोट विषय',
    topicPlaceholder: 'अपने नोट विषय या कीवर्ड्स दर्ज करें...',
    content: 'सामग्री विवरण',
    contentPlaceholder: 'अपनी नोट सामग्री का संक्षिप्त विवरण दर्ज करें, बहु-पंक्ति समर्थित...',
    type: 'शीर्षक शैली',
    typeHot: 'वायरल/ध्यान आकर्षित',
    typeEmotion: 'भावनात्मक',
    typeCuriosity: 'जिज्ञासा',
    typePractical: 'व्यावहारिक',
    typeStory: 'कथानक',
    typeQuestion: 'प्रश्न',
    tone: 'टोन शैली',
    formal: 'औपचारिक/पेशेवर',
    friendly: 'दोस्ताना/आसान',
    concise: 'संक्षिप्त/प्रत्यक्ष',
    humorous: 'हास्यपूर्ण',
    persuasive: 'प्रेरणादायक/आकर्षक',
    academic: 'अकादमिक/गहरा',
    generate: '✨ शीर्षक बनाएं',
    loading: 'बनाया जा रहा है...',
    title: 'शीर्षक',
    why: 'यह क्यों काम करता है',
    copyCopy: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए विषय दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur de titres Xiaohongshu',
    subtitle: 'Entrez votre sujet et générez des titres viraux',
    topic: 'Sujet de note',
    topicPlaceholder: 'Entrez votre sujet ou mots-clés...',
    content: 'Description du contenu',
    contentPlaceholder: 'Décrivez brièvement votre contenu, plusieurs lignes supportées...',
    type: 'Style de titre',
    typeHot: 'Viral/Attention',
    typeEmotion: 'Émotionnel',
    typeCuriosity: 'Curiosité',
    typePractical: 'Pratique',
    typeStory: 'Récit',
    typeQuestion: 'Question',
    tone: 'Style de ton',
    formal: 'Formel/Professionnel',
    friendly: 'Amiable/Décontracté',
    concise: 'Concis/Direct',
    humorous: 'Humoristique',
    persuasive: 'Persuasif/Engageant',
    academic: 'Académique/Profond',
    generate: '✨ Générer des titres',
    loading: 'Génération...',
    title: 'Titre',
    why: 'Pourquoi ça marche',
    copyCopy: 'Copier',
    copied: 'Copié',
    noResult: 'Saisissez le sujet pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de títulos Xiaohongshu',
    subtitle: 'Ingresa tu tema y genera títulos virales',
    topic: 'Tema de nota',
    topicPlaceholder: 'Ingresa tu tema o palabras clave...',
    content: 'Descripción del contenido',
    contentPlaceholder: 'Describe brevemente tu contenido, se admite varias líneas...',
    type: 'Estilo de título',
    typeHot: 'Viral/Atractivo',
    typeEmotion: 'Emocional',
    typeCuriosity: 'Curiosidad',
    typePractical: 'Práctico',
    typeStory: 'Narrativa',
    typeQuestion: 'Pregunta',
    tone: 'Estilo de tono',
    formal: 'Formal/Profesional',
    friendly: 'Amigable/Informal',
    concise: 'Conciso/Directo',
    humorous: 'Humorístico',
    persuasive: 'Persuasivo/Atractivo',
    academic: 'Académico/Profundo',
    generate: '✨ Generar títulos',
    loading: 'Generando...',
    title: 'Título',
    why: '¿Por qué funciona?',
    copyCopy: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa el tema para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مُنشئ العناوين لـ Xiaohongshu',
    subtitle: 'أدخل موضوعك وإنشاء عناوين فيروسية',
    topic: 'موضوع الملاحظة',
    topicPlaceholder: 'أدخل موضوع الملاحظة أو الكلمات المفتاحية...',
    content: 'وصف المحتوى',
    contentPlaceholder: 'صف موجزاً محتوى ملاحظتك، يدعم الأسطر المتعددة...',
    type: 'أسلوب العنوان',
    typeHot: 'فيروسي/مُلهم',
    typeEmotion: 'عاطفي',
    typeCuriosity: 'فضول',
    typePractical: 'عملي',
    typeStory: 'قصة',
    typeQuestion: 'سؤال',
    tone: 'أسلوب النبرة',
    formal: 'رسمي/محترف',
    friendly: 'ودود/غير رسمي',
    concise: 'مختصر/مباشر',
    humorous: 'مزح',
    persuasive: 'قائل/جذاب',
    academic: 'أكاديمي/عميق',
    generate: '✨ إنشاء العناوين',
    loading: 'جاري الإنشاء...',
    title: 'العنوان',
    why: 'لماذا هذا يعمل',
    copyCopy: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل الموضوع لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const TITLE_TYPES = [
  { key: 'hot', icon: Flame, color: 'from-red-500 to-orange-500' },
  { key: 'emotion', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { key: 'curiosity', icon: Hash, color: 'from-purple-500 to-violet-500' },
  { key: 'practical', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
  { key: 'story', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  { key: 'question', icon: Hash, color: 'from-yellow-500 to-amber-500' },
];

const TONES = [
  { key: 'formal', color: 'from-blue-500 to-indigo-600' },
  { key: 'friendly', color: 'from-green-500 to-emerald-600' },
  { key: 'concise', color: 'from-gray-500 to-gray-700' },
  { key: 'humorous', color: 'from-pink-500 to-rose-600' },
  { key: 'persuasive', color: 'from-orange-500 to-amber-600' },
  { key: 'academic', color: 'from-purple-500 to-violet-600' },
];

interface TitleItem {
  title: string;
  why: string;
}

interface GenerateResult {
  items: TitleItem[];
  remaining: number | null;
}

export default function AiXiaohongshuTitleGeneratorTool({ locale = 'zh' }: AiXiaohongshuTitleGeneratorToolProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('hot');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-xiaohongshu-title-generator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          content: content.trim(),
          type: selectedType,
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
  }, [topic, content, selectedType, selectedTone, resolvedLocale]);

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
            <Sparkles className='h-5 w-5 sm:h-6 sm:w-6' />
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
              {t('topic')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={topic}
              onChange={(e) => { setTopic(e.target.value); setError(false); }}
              placeholder={t('topicPlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('content')}
            </label>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(false); }}
              placeholder={t('contentPlaceholder')}
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('type')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {TITLE_TYPES.map((typeItem) => {
                const Icon = typeItem.icon;
                return (
                  <button
                    key={typeItem.key}
                    onClick={() => setSelectedType(typeItem.key)}
                    className={`flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === typeItem.key
                        ? `text-white bg-gradient-to-br ${typeItem.color} shadow-md`
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {t(`type${typeItem.key.charAt(0).toUpperCase() + typeItem.key.slice(1)}`)}
                  </button>
                );
              })}
            </div>
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
            disabled={!topic.trim() || loading}
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
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('title')}</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5 flex flex-col'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span className='px-2 py-1 rounded-md bg-pink-100 dark:bg-pink-900/30 text-xs font-semibold text-pink-700 dark:text-pink-300'>
                        {t('title')} #{index + 1}
                      </span>
                      <button
                        onClick={() => handleCopy(item.title, index)}
                        className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                      >
                        {copiedIndex === index ? <Check className='h-3 w-3 text-green-600 dark:text-green-400' /> : <Copy className='h-3 w-3' />}
                        {copiedIndex === index ? t('copied') : t('copyCopy')}
                      </button>
                    </div>
                    <div className='flex-1'>
                      <p className='text-gray-800 dark:text-gray-200 leading-relaxed text-sm mb-4'>
                        {item.title}
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