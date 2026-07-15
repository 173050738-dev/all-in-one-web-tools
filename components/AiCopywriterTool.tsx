'use client';

import { useState, useCallback } from 'react';
import { PenLine, RefreshCw, Copy, Check, Sparkles, Target, MessageSquare, Globe } from 'lucide-react';

interface AiCopywriterToolProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 营销文案生成器',
    subtitle: '输入产品信息，一键生成高质量营销文案',
    product: '产品名称',
    productPlaceholder: '请输入你的产品名称...',
    selling: '核心卖点',
    sellingPlaceholder: '请输入产品的核心卖点，可多行输入...',
    type: '文案类型',
    typeAdHeadline: '广告标题',
    typeProductDesc: '产品描述',
    typeSocialPost: '社媒帖子',
    typeEmailSubject: '邮件主题',
    typeLandingHero: '落地页首屏',
    tone: '语气风格',
    formal: '正式/商务',
    friendly: '友好/亲切',
    concise: '简洁/精炼',
    humorous: '幽默/风趣',
    persuasive: '说服/营销',
    academic: '学术/专业',
    platform: '目标平台',
    platformGeneral: '通用',
    platformShopify: '独立站',
    platformInstagram: 'Instagram',
    platformFacebook: 'Facebook',
    platformX: 'X',
    generate: '✨ 生成文案',
    loading: '正在生成...',
    copy: '文案',
    why: '创作思路',
    copyCopy: '复制文案',
    copied: '已复制',
    noResult: '请输入产品信息开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Copywriter',
    subtitle: 'Enter product details and generate high-quality marketing copy',
    product: 'Product Name',
    productPlaceholder: 'Enter your product name...',
    selling: 'Selling Points',
    sellingPlaceholder: 'Enter your product selling points, multi-line supported...',
    type: 'Copy Type',
    typeAdHeadline: 'Ad Headline',
    typeProductDesc: 'Product Description',
    typeSocialPost: 'Social Post',
    typeEmailSubject: 'Email Subject',
    typeLandingHero: 'Landing Hero',
    tone: 'Tone Style',
    formal: 'Formal/Business',
    friendly: 'Friendly/Casual',
    concise: 'Concise/Direct',
    humorous: 'Humorous/Funny',
    persuasive: 'Persuasive/Marketing',
    academic: 'Academic/Professional',
    platform: 'Target Platform',
    platformGeneral: 'General',
    platformShopify: 'Shopify',
    platformInstagram: 'Instagram',
    platformFacebook: 'Facebook',
    platformX: 'X',
    generate: '✨ Generate Copy',
    loading: 'Generating...',
    copy: 'Copy',
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
    title: 'AI कॉपीराइटर',
    subtitle: 'उत्पाद विवरण दर्ज करें और उच्च गुणवत्ता वाली विपणन कॉपी बनाएं',
    product: 'उत्पाद का नाम',
    productPlaceholder: 'अपने उत्पाद का नाम दर्ज करें...',
    selling: 'बिक्री बिंदु',
    sellingPlaceholder: 'उत्पाद के बिक्री बिंदु दर्ज करें, बहु-पंक्ति समर्थित...',
    type: 'कॉपी प्रकार',
    typeAdHeadline: 'विज्ञापन शीर्षक',
    typeProductDesc: 'उत्पाद विवरण',
    typeSocialPost: 'सोशल पोस्ट',
    typeEmailSubject: 'ईमेल विषय',
    typeLandingHero: 'लैंडिंग हीरो',
    tone: 'टोन शैली',
    formal: 'औपचारिक/व्यावसायिक',
    friendly: 'दोस्ताना/आसान',
    concise: 'संक्षिप्त/प्रत्यक्ष',
    humorous: 'हास्यपूर्ण',
    persuasive: 'प्रेरणादायक/विपणन',
    academic: 'अकादमिक/पेशेवर',
    platform: 'लक्ष्य प्लेटफॉर्म',
    platformGeneral: 'सामान्य',
    platformShopify: 'शॉपिफाई',
    platformInstagram: 'इंस्टाग्राम',
    platformFacebook: 'फेसबुक',
    platformX: 'X',
    generate: '✨ कॉपी बनाएं',
    loading: 'बनाया जा रहा है...',
    copy: 'कॉपी',
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
    title: 'Rédacteur AI',
    subtitle: 'Saisissez les détails du produit et générez du marketing de haute qualité',
    product: 'Nom du produit',
    productPlaceholder: 'Entrez le nom de votre produit...',
    selling: 'Points de vente',
    sellingPlaceholder: 'Entrez les points de vente de votre produit, plusieurs lignes supportées...',
    type: 'Type de texte',
    typeAdHeadline: 'Titre publicitaire',
    typeProductDesc: 'Description produit',
    typeSocialPost: 'Publication sociale',
    typeEmailSubject: 'Objet email',
    typeLandingHero: 'Hero landing',
    tone: 'Style de ton',
    formal: 'Formel/Affaires',
    friendly: 'Amiable/Décontracté',
    concise: 'Concis/Direct',
    humorous: 'Humoristique',
    persuasive: 'Persuasif/Marketing',
    academic: 'Académique/Professionnel',
    platform: 'Plateforme cible',
    platformGeneral: 'Générale',
    platformShopify: 'Shopify',
    platformInstagram: 'Instagram',
    platformFacebook: 'Facebook',
    platformX: 'X',
    generate: '✨ Générer',
    loading: 'Génération...',
    copy: 'Texte',
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
    title: 'Redactor AI',
    subtitle: 'Ingresa detalles del producto y genera contenido de marketing de alta calidad',
    product: 'Nombre del producto',
    productPlaceholder: 'Ingresa el nombre de tu producto...',
    selling: 'Puntos de venta',
    sellingPlaceholder: 'Ingresa los puntos de venta de tu producto, se admite varias líneas...',
    type: 'Tipo de texto',
    typeAdHeadline: 'Título de anuncio',
    typeProductDesc: 'Descripción del producto',
    typeSocialPost: 'Publicación social',
    typeEmailSubject: 'Asunto de correo',
    typeLandingHero: 'Hero landing',
    tone: 'Estilo de tono',
    formal: 'Formal/Negocios',
    friendly: 'Amigable/Informal',
    concise: 'Conciso/Directo',
    humorous: 'Humorístico',
    persuasive: 'Persuasivo/Marketing',
    academic: 'Académico/Profesional',
    platform: 'Plataforma objetivo',
    platformGeneral: 'General',
    platformShopify: 'Shopify',
    platformInstagram: 'Instagram',
    platformFacebook: 'Facebook',
    platformX: 'X',
    generate: '✨ Generar',
    loading: 'Generando...',
    copy: 'Texto',
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
    title: 'مُنشئ النصوص التسويقية',
    subtitle: 'أدخل تفاصيل المنتج وإنشاء نصوص تسويقية عالية الجودة',
    product: 'اسم المنتج',
    productPlaceholder: 'أدخل اسم منتجك...',
    selling: 'نقاط البيع',
    sellingPlaceholder: 'أدخل نقاط بيع منتجك، يدعم الأسطر المتعددة...',
    type: 'نوع النص',
    typeAdHeadline: 'عنوان الإعلان',
    typeProductDesc: 'وصف المنتج',
    typeSocialPost: 'منشور اجتماعي',
    typeEmailSubject: 'موضوع البريد',
    typeLandingHero: 'هيرو اللاندنج',
    tone: 'أسلوب النبرة',
    formal: 'رسمي/تجاري',
    friendly: 'ودود/غير رسمي',
    concise: 'مختصر/مباشر',
    humorous: 'مزح',
    persuasive: 'قائل/تسويقي',
    academic: 'أكاديمي/محترف',
    platform: 'المنصة المستهدفة',
    platformGeneral: 'عام',
    platformShopify: 'شوبيفاي',
    platformInstagram: 'إنستغرام',
    platformFacebook: 'فيسبوك',
    platformX: 'X',
    generate: '✨ إنشاء النص',
    loading: 'جاري الإنشاء...',
    copy: 'النص',
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
  { key: 'formal', color: 'from-blue-500 to-indigo-600' },
  { key: 'friendly', color: 'from-green-500 to-emerald-600' },
  { key: 'concise', color: 'from-gray-500 to-gray-700' },
  { key: 'humorous', color: 'from-pink-500 to-rose-600' },
  { key: 'persuasive', color: 'from-orange-500 to-amber-600' },
  { key: 'academic', color: 'from-purple-500 to-violet-600' },
];

const COPY_TYPES = [
  { key: 'ad-headline', icon: MessageSquare },
  { key: 'product-description', icon: PenLine },
  { key: 'social-post', icon: Globe },
  { key: 'email-subject', icon: Target },
  { key: 'landing-hero', icon: Sparkles },
];

const PLATFORMS = [
  { key: 'general', label: 'platformGeneral' },
  { key: 'shopify', label: 'platformShopify' },
  { key: 'instagram', label: 'platformInstagram' },
  { key: 'facebook', label: 'platformFacebook' },
  { key: 'x', label: 'platformX' },
];

interface CopyItem {
  copy: string;
  why: string;
}

interface GenerateResult {
  items: CopyItem[];
  remaining: number | null;
}

export default function AiCopywriterTool({ locale = 'zh' }: AiCopywriterToolProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [product, setProduct] = useState('');
  const [selling, setSelling] = useState('');
  const [selectedType, setSelectedType] = useState('ad-headline');
  const [selectedTone, setSelectedTone] = useState('persuasive');
  const [selectedPlatform, setSelectedPlatform] = useState('general');
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
      const response = await fetch('/api/ai-copywriter/', {
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
            <PenLine className='h-5 w-5 sm:h-6 sm:w-6' />
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
              {COPY_TYPES.map((typeItem) => {
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
                    {t(`type${typeItem.key.charAt(0).toUpperCase() + typeItem.key.slice(1).replace(/-/g, '')}`)}
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
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('copy')}</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5 flex flex-col'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <span className='px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-xs font-semibold text-orange-700 dark:text-orange-300'>
                        {t('copy')} #{index + 1}
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