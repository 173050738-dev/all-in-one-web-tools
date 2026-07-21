'use client';

import { useState, useCallback } from 'react';
import { Star, RefreshCw, Copy, Check, Sparkles, ShoppingBag, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AiReviewGeneratorToolProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 评价生成器',
    subtitle: '输入产品信息，一键生成外卖/电商好评',
    product: '产品名称',
    productPlaceholder: '请输入产品名称...',
    selling: '产品特点',
    sellingPlaceholder: '请描述产品特点，可多行输入...',
    type: '评价类型',
    typePositive: '好评',
    typeNegative: '差评',
    typeNeutral: '中评',
    typeHumorous: '幽默评价',
    typeProfessional: '专业测评',
    tone: '语气风格',
    friendly: '友好/亲切',
    concise: '简洁/精炼',
    humorous: '幽默/风趣',
    detailed: '详细/走心',
    emotional: '情感/共鸣',
    platform: '目标平台',
    platformTaobao: '淘宝',
    platformJD: '京东',
    platformAmazon: '亚马逊',
    platformPinduoduo: '拼多多',
    platformWaimai: '外卖平台',
    generate: '✨ 生成评价',
    loading: '正在生成...',
    review: '评价',
    why: '创作思路',
    copyCopy: '复制评价',
    copied: '已复制',
    noResult: '请输入产品信息开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Review Generator',
    subtitle: 'Enter product details and generate high-quality reviews',
    product: 'Product Name',
    productPlaceholder: 'Enter product name...',
    selling: 'Product Features',
    sellingPlaceholder: 'Describe product features, multi-line supported...',
    type: 'Review Type',
    typePositive: 'Positive',
    typeNegative: 'Negative',
    typeNeutral: 'Neutral',
    typeHumorous: 'Humorous',
    typeProfessional: 'Professional',
    tone: 'Tone Style',
    friendly: 'Friendly/Warm',
    concise: 'Concise/Direct',
    humorous: 'Humorous/Funny',
    detailed: 'Detailed/Heartfelt',
    emotional: 'Emotional/Relatable',
    platform: 'Target Platform',
    platformTaobao: 'Taobao',
    platformJD: 'JD',
    platformAmazon: 'Amazon',
    platformPinduoduo: 'Pinduoduo',
    platformWaimai: 'Food Delivery',
    generate: '✨ Generate Review',
    loading: 'Generating...',
    review: 'Review',
    why: 'Why This Works',
    copyCopy: 'Copy',
    copied: 'Copied',
    noResult: 'Enter product details to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI रिव्यू जेनरेटर',
    subtitle: 'उत्पाद विवरण दर्ज करें और उच्च गुणवत्ता वाली समीक्षाएं बनाएं',
    product: 'उत्पाद का नाम',
    productPlaceholder: 'उत्पाद का नाम दर्ज करें...',
    selling: 'उत्पाद की विशेषताएं',
    sellingPlaceholder: 'उत्पाद की विशेषताओं का वर्णन करें, बहु-पंक्ति समर्थित...',
    type: 'समीक्षा प्रकार',
    typePositive: 'सकारात्मक',
    typeNegative: 'नकारात्मक',
    typeNeutral: 'तटस्थ',
    typeHumorous: 'हास्यपूर्ण',
    typeProfessional: 'पेशेवर',
    tone: 'टोन शैली',
    friendly: 'दोस्ताना/गर्म',
    concise: 'संक्षिप्त/प्रत्यक्ष',
    humorous: 'हास्यपूर्ण',
    detailed: 'विस्तृत/दिल से',
    emotional: 'भावनात्मक/संबंधित',
    platform: 'लक्ष्य प्लेटफॉर्म',
    platformTaobao: 'ताओबाओ',
    platformJD: 'JD',
    platformAmazon: 'अमेज़न',
    platformPinduoduo: 'पिंदुओदुओ',
    platformWaimai: 'फूड डिलीवरी',
    generate: '✨ समीक्षा बनाएं',
    loading: 'बनाया जा रहा है...',
    review: 'समीक्षा',
    why: 'यह क्यों काम करता है',
    copyCopy: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए उत्पाद विवरण दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur d\'avis AI',
    subtitle: 'Saisissez les détails du produit et générez des avis de haute qualité',
    product: 'Nom du produit',
    productPlaceholder: 'Entrez le nom du produit...',
    selling: 'Caractéristiques',
    sellingPlaceholder: 'Décrivez les caractéristiques, plusieurs lignes supportées...',
    type: 'Type d\'avis',
    typePositive: 'Positif',
    typeNegative: 'Négatif',
    typeNeutral: 'Neutre',
    typeHumorous: 'Humouristique',
    typeProfessional: 'Professionnel',
    tone: 'Style de ton',
    friendly: 'Amiable/Chaud',
    concise: 'Concis/Direct',
    humorous: 'Humouristique',
    detailed: 'Détaillé/Sincère',
    emotional: 'Émotionnel/Accessible',
    platform: 'Plateforme cible',
    platformTaobao: 'Taobao',
    platformJD: 'JD',
    platformAmazon: 'Amazon',
    platformPinduoduo: 'Pinduoduo',
    platformWaimai: 'Livraison de nourriture',
    generate: '✨ Générer avis',
    loading: 'Génération...',
    review: 'Avis',
    why: 'Pourquoi ça marche',
    copyCopy: 'Copier',
    copied: 'Copié',
    noResult: 'Saisissez les détails pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de Reseñas AI',
    subtitle: 'Ingresa detalles del producto y genera reseñas de alta calidad',
    product: 'Nombre del producto',
    productPlaceholder: 'Ingresa el nombre del producto...',
    selling: 'Características',
    sellingPlaceholder: 'Describe las características, se admite varias líneas...',
    type: 'Tipo de reseña',
    typePositive: 'Positiva',
    typeNegative: 'Negativa',
    typeNeutral: 'Neutral',
    typeHumorous: 'Humorística',
    typeProfessional: 'Profesional',
    tone: 'Estilo de tono',
    friendly: 'Amigable/Caluroso',
    concise: 'Conciso/Directo',
    humorous: 'Humorístico',
    detailed: 'Detallado/Sincero',
    emotional: 'Emocional/Accesible',
    platform: 'Plataforma objetivo',
    platformTaobao: 'Taobao',
    platformJD: 'JD',
    platformAmazon: 'Amazon',
    platformPinduoduo: 'Pinduoduo',
    platformWaimai: 'Entrega de comida',
    generate: '✨ Generar reseña',
    loading: 'Generando...',
    review: 'Reseña',
    why: '¿Por qué funciona?',
    copyCopy: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa detalles para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مُنشئ التقييمات بالذكاء الاصطناعي',
    subtitle: 'أدخل تفاصيل المنتج وإنشاء تقييمات عالية الجودة',
    product: 'اسم المنتج',
    productPlaceholder: 'أدخل اسم المنتج...',
    selling: 'الميزات',
    sellingPlaceholder: 'صف الميزات، يدعم الأسطر المتعددة...',
    type: 'نوع التقييم',
    typePositive: 'إيجابي',
    typeNegative: 'سلبي',
    typeNeutral: 'محايد',
    typeHumorous: 'مزح',
    typeProfessional: 'مهني',
    tone: 'أسلوب النبرة',
    friendly: 'ودود/دافئ',
    concise: 'مختصر/مباشر',
    humorous: 'مزح',
    detailed: 'مفصّل/صادق',
    emotional: 'عاطفي/قابل للوصول',
    platform: 'المنصة المستهدفة',
    platformTaobao: 'تاوباو',
    platformJD: 'JD',
    platformAmazon: 'أمازون',
    platformPinduoduo: 'بينغدو',
    platformWaimai: 'التوصيلات',
    generate: '✨ إنشاء تقييم',
    loading: 'جاري الإنشاء...',
    review: 'التقييم',
    why: 'لماذا هذا يعمل',
    copyCopy: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل التفاصيل لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const TONES = [
  { key: 'friendly', color: 'from-green-500 to-emerald-600' },
  { key: 'concise', color: 'from-gray-500 to-gray-700' },
  { key: 'humorous', color: 'from-pink-500 to-rose-600' },
  { key: 'detailed', color: 'from-blue-500 to-indigo-600' },
  { key: 'emotional', color: 'from-purple-500 to-violet-600' },
];

const REVIEW_TYPES = [
  { key: 'positive', icon: ThumbsUp },
  { key: 'negative', icon: ThumbsDown },
  { key: 'neutral', icon: MessageCircle },
  { key: 'humorous', icon: Sparkles },
  { key: 'professional', icon: Star },
];

const PLATFORMS = [
  { key: 'taobao', label: 'platformTaobao' },
  { key: 'jd', label: 'platformJD' },
  { key: 'amazon', label: 'platformAmazon' },
  { key: 'pinduoduo', label: 'platformPinduoduo' },
  { key: 'waimai', label: 'platformWaimai' },
];

interface ReviewItem {
  copy: string;
  why: string;
}

interface GenerateResult {
  items: ReviewItem[];
  remaining: number | null;
}

export default function AiReviewGeneratorTool({ locale = 'zh' }: AiReviewGeneratorToolProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [product, setProduct] = useState('');
  const [selling, setSelling] = useState('');
  const [selectedType, setSelectedType] = useState('positive');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [selectedPlatform, setSelectedPlatform] = useState('taobao');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!product.trim() || !selling.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-review-generator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product.trim(),
          selling: selling.trim(),
          type: selectedType,
          tone: selectedTone,
          platform: selectedPlatform,
          locale: resolvedLocale,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
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
  }, [product, selling, selectedType, selectedTone, selectedPlatform, resolvedLocale]);

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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'>
            <Star className='h-5 w-5 sm:h-6 sm:w-6' />
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
              {t('product')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={product}
              onChange={(e) => { setProduct(e.target.value); setError(false); }}
              placeholder={t('productPlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('selling')} <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={selling}
              onChange={(e) => { setSelling(e.target.value); setError(false); }}
              placeholder={t('sellingPlaceholder')}
              className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('type')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
              {REVIEW_TYPES.map((typeItem) => {
                const Icon = typeItem.icon;
                return (
                  <button
                    key={typeItem.key}
                    onClick={() => setSelectedType(typeItem.key)}
                    className={`flex flex-col items-center justify-center gap-1 min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedType === typeItem.key
                        ? 'text-white bg-gradient-to-br from-orange-500 to-red-500 shadow-md'
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
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
              {TONES.map((toneItem) => (
                <button
                  key={toneItem.key}
                  onClick={() => setSelectedTone(toneItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('platform')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
              {PLATFORMS.map((platformItem) => (
                <button
                  key={platformItem.key}
                  onClick={() => setSelectedPlatform(platformItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedPlatform === platformItem.key
                      ? 'text-white bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(platformItem.label)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!product.trim() || !selling.trim() || loading}
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
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('review')}</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5 flex flex-col'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span className='px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-xs font-semibold text-orange-700 dark:text-orange-300'>
                        {t('review')} #{index + 1}
                      </span>
                      <button
                        onClick={() => handleCopy(item.copy, index)}
                        className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                      >
                        {copiedIndex === index ? <Check className='h-3 w-3 text-green-600 dark:text-green-400' /> : <Copy className='h-3 w-3' />}
                        {copiedIndex === index ? t('copied') : t('copyCopy')}
                      </button>
                    </div>
                    <div className='flex-1'>
                      <p className='text-gray-800 dark:text-gray-200 leading-relaxed text-sm mb-4'>
                        {item.copy}
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