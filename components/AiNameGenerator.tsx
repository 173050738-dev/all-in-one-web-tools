'use client';

import { useState, useCallback } from 'react';
import { Baby, RefreshCw, Copy, Check, Sparkles, User, Heart, Globe, BookOpen } from 'lucide-react';

interface AiNameGeneratorProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 取名生成器',
    subtitle: '根据姓氏、性别和风格，一键生成5个有寓意的名字',
    type: '取名类型',
    typeBaby: '宝宝名字',
    typePet: '宠物名字',
    typeNickname: '网名/昵称',
    typeEnglish: '英文名',
    surname: '姓氏',
    surnamePlaceholder: '请输入姓氏...',
    gender: '性别',
    genderMale: '男',
    genderFemale: '女',
    genderNeutral: '中性',
    style: '风格偏好',
    styleClassic: '古风/传统',
    styleModern: '现代/简约',
    styleCute: '可爱/俏皮',
    stylePowerful: '霸气/豪迈',
    stylePoetic: '诗意/文雅',
    generate: '✨ 生成名字',
    loading: '正在生成...',
    name: '名字',
    meaning: '寓意',
    origin: '出处/典故',
    copyName: '复制名字',
    copied: '已复制',
    noResult: '请输入姓氏开始生成',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完',
    remaining: '今日剩余次数：',
    required: '此项必填',
  },
  en: {
    title: 'AI Name Generator',
    subtitle: 'Enter surname, gender and style to get 5 meaningful names',
    type: 'Name Type',
    typeBaby: 'Baby Name',
    typePet: 'Pet Name',
    typeNickname: 'Nickname',
    typeEnglish: 'English Name',
    surname: 'Surname',
    surnamePlaceholder: 'Enter surname...',
    gender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderNeutral: 'Neutral',
    style: 'Style',
    styleClassic: 'Classic/Traditional',
    styleModern: 'Modern/Minimal',
    styleCute: 'Cute/Playful',
    stylePowerful: 'Powerful/Bold',
    stylePoetic: 'Poetic/Elegant',
    generate: '✨ Generate Names',
    loading: 'Generating...',
    name: 'Name',
    meaning: 'Meaning',
    origin: 'Origin',
    copyName: 'Copy',
    copied: 'Copied',
    noResult: 'Enter surname to start',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded',
    remaining: 'Remaining today: ',
    required: 'Required field',
  },
  hi: {
    title: 'AI नाम जनरेटर',
    subtitle: 'उपनाम, लिंग और शैली दर्ज करें और 5 अर्थपूर्ण नाम पाएं',
    type: 'नाम प्रकार',
    typeBaby: 'बेबी नाम',
    typePet: 'पालतू नाम',
    typeNickname: 'उपनाम',
    typeEnglish: 'अंग्रेजी नाम',
    surname: 'उपनाम',
    surnamePlaceholder: 'उपनाम दर्ज करें...',
    gender: 'लिंग',
    genderMale: 'पुरुष',
    genderFemale: 'महिला',
    genderNeutral: 'तटस्थ',
    style: 'शैली',
    styleClassic: 'पारंपरिक',
    styleModern: 'आधुनिक/सरल',
    styleCute: 'प्यारा',
    stylePowerful: 'शक्तिशाली',
    stylePoetic: 'काव्यात्मक',
    generate: '✨ नाम बनाएं',
    loading: 'बनाया जा रहा है...',
    name: 'नाम',
    meaning: 'अर्थ',
    origin: 'उत्पत्ति',
    copyName: 'कॉपी करें',
    copied: 'कॉपी किया',
    noResult: 'शुरू करने के लिए उपनाम दर्ज करें',
    error: 'जनरेशन विफल, कृपया पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी हो चुकी है',
    remaining: 'आज शेष: ',
    required: 'आवश्यक क्षेत्र',
  },
  fr: {
    title: 'Générateur de noms AI',
    subtitle: 'Saisissez nom, genre et style pour 5 noms significatifs',
    type: 'Type de nom',
    typeBaby: 'Nom de bébé',
    typePet: 'Nom d\'animal',
    typeNickname: 'Pseudo',
    typeEnglish: 'Nom anglais',
    surname: 'Nom de famille',
    surnamePlaceholder: 'Entrez le nom de famille...',
    gender: 'Genre',
    genderMale: 'Masculin',
    genderFemale: 'Féminin',
    genderNeutral: 'Neutre',
    style: 'Style',
    styleClassic: 'Classique/Traditionnel',
    styleModern: 'Moderne/Minimal',
    styleCute: 'Mignon',
    stylePowerful: 'Puissant',
    stylePoetic: 'Poétique/Élégant',
    generate: '✨ Générer',
    loading: 'Génération...',
    name: 'Nom',
    meaning: 'Signification',
    origin: 'Origine',
    copyName: 'Copier',
    copied: 'Copié',
    noResult: 'Entrez le nom pour commencer',
    error: 'Échec de la génération, réessayez',
    rateLimit: 'Limite gratuite quotidienne atteinte',
    remaining: 'Restant aujourd\'hui: ',
    required: 'Champ requis',
  },
  es: {
    title: 'Generador de nombres AI',
    subtitle: 'Ingresa apellido, género y estilo para 5 nombres significativos',
    type: 'Tipo de nombre',
    typeBaby: 'Nombre de bebé',
    typePet: 'Nombre de mascota',
    typeNickname: 'Apodo',
    typeEnglish: 'Nombre en inglés',
    surname: 'Apellido',
    surnamePlaceholder: 'Ingresa el apellido...',
    gender: 'Género',
    genderMale: 'Masculino',
    genderFemale: 'Femenino',
    genderNeutral: 'Neutral',
    style: 'Estilo',
    styleClassic: 'Clásico/Tradicional',
    styleModern: 'Moderno/Minimal',
    styleCute: 'Lindo',
    stylePowerful: 'Poderoso',
    stylePoetic: 'Poético/Elegante',
    generate: '✨ Generar',
    loading: 'Generando...',
    name: 'Nombre',
    meaning: 'Significado',
    origin: 'Origen',
    copyName: 'Copiar',
    copied: 'Copiado',
    noResult: 'Ingresa el apellido para empezar',
    error: 'Error al generar, intenta de nuevo',
    rateLimit: 'Límite gratuito diario alcanzado',
    remaining: 'Restante hoy: ',
    required: 'Campo obligatorio',
  },
  ar: {
    title: 'مولد الأسماء AI',
    subtitle: 'أدخل اسم العائلة والجنس والأسلوب للحصول على 5 أسماء ذات معنى',
    type: 'نوع الاسم',
    typeBaby: 'اسم طفل',
    typePet: 'اسم حيوان أليف',
    typeNickname: 'اسم مستعار',
    typeEnglish: 'اسم إنجليزي',
    surname: 'اسم العائلة',
    surnamePlaceholder: 'أدخل اسم العائلة...',
    gender: 'الجنس',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    genderNeutral: 'محايد',
    style: 'الأسلوب',
    styleClassic: 'كلاسيكي/تقليدي',
    styleModern: 'حديث/بسيط',
    styleCute: 'لطيف',
    stylePowerful: 'قوي',
    stylePoetic: 'شاعري/أنيق',
    generate: '✨ إنشاء الأسماء',
    loading: 'جاري الإنشاء...',
    name: 'الاسم',
    meaning: 'المعنى',
    origin: 'الأصل',
    copyName: 'نسخ',
    copied: 'تم النسخ',
    noResult: 'أدخل اسم العائلة لتبدأ',
    error: 'فشل الإنشاء، حاول مرة أخرى',
    rateLimit: 'تم الوصول إلى الحد اليومي المجاني',
    remaining: 'المتبقي اليوم: ',
    required: 'حقل إجباري',
  },
};

const TYPES = [
  { key: 'baby', label: 'typeBaby', icon: Baby },
  { key: 'pet', label: 'typePet', icon: Heart },
  { key: 'nickname', label: 'typeNickname', icon: Globe },
  { key: 'english', label: 'typeEnglish', icon: User },
];

const GENDERS = [
  { key: 'male', label: 'genderMale' },
  { key: 'female', label: 'genderFemale' },
  { key: 'neutral', label: 'genderNeutral' },
];

const STYLES = [
  { key: 'classic', label: 'styleClassic' },
  { key: 'modern', label: 'styleModern' },
  { key: 'cute', label: 'styleCute' },
  { key: 'powerful', label: 'stylePowerful' },
  { key: 'poetic', label: 'stylePoetic' },
];

interface NameItem {
  name: string;
  meaning: string;
  origin: string;
}

interface GenerateResult {
  items: NameItem[];
  remaining: number | null;
}

export default function AiNameGenerator({ locale = 'zh' }: AiNameGeneratorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [surname, setSurname] = useState('');
  const [selectedType, setSelectedType] = useState('baby');
  const [selectedGender, setSelectedGender] = useState('neutral');
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!surname.trim()) {
      return;
    }

    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setResult(null);

    try {
      const response = await fetch('/api/ai-name-generator/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          surname: surname.trim(),
          gender: selectedGender,
          style: selectedStyle,
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
  }, [surname, selectedType, selectedGender, selectedStyle, resolvedLocale]);

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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25'>
            <Baby className='h-5 w-5 sm:h-6 sm:w-6' />
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
              {t('type')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {TYPES.map((typeItem) => {
                const Icon = typeItem.icon;
                return (
                  <button
                    key={typeItem.key}
                    onClick={() => setSelectedType(typeItem.key)}
                    className={`flex flex-col items-center justify-center gap-1 min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedType === typeItem.key
                        ? 'text-white bg-gradient-to-br from-rose-500 to-pink-600 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {t(typeItem.label)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('surname')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={surname}
              onChange={(e) => { setSurname(e.target.value); setError(false); }}
              placeholder={t('surnamePlaceholder')}
              className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('gender')}
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {GENDERS.map((genderItem) => (
                <button
                  key={genderItem.key}
                  onClick={() => setSelectedGender(genderItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGender === genderItem.key
                      ? 'text-white bg-gradient-to-br from-rose-500 to-pink-600 shadow-md scale-[1.02]'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(genderItem.label)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('style')}
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
              {STYLES.map((styleItem) => (
                <button
                  key={styleItem.key}
                  onClick={() => setSelectedStyle(styleItem.key)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedStyle === styleItem.key
                      ? 'text-white bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(styleItem.label)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!surname.trim() || loading}
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
              <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('name')}</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5 flex flex-col'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-2'>
                        <span className='px-2 py-1 rounded-md bg-rose-100 dark:bg-rose-900/30 text-xs font-semibold text-rose-700 dark:text-rose-300'>
                          #{index + 1}
                        </span>
                        <span className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{item.name}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.name, index)}
                        className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors min-h-[32px]'
                      >
                        {copiedIndex === index ? <Check className='h-3 w-3 text-green-600 dark:text-green-400' /> : <Copy className='h-3 w-3' />}
                        {copiedIndex === index ? t('copied') : t('copyName')}
                      </button>
                    </div>
                    <div className='flex-1 space-y-3'>
                      <div className='flex items-start gap-2'>
                        <Sparkles className='h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0' />
                        <div>
                          <p className='text-xs font-medium text-rose-700 dark:text-rose-400 mb-1'>{t('meaning')}</p>
                          <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{item.meaning}</p>
                        </div>
                      </div>
                      <div className='flex items-start gap-2'>
                        <BookOpen className='h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0' />
                        <div>
                          <p className='text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1'>{t('origin')}</p>
                          <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{item.origin}</p>
                        </div>
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
