'use client';

import { useState, useCallback } from 'react';
import { Camera, RefreshCw, Copy, Check, Sparkles, RotateCcw } from 'lucide-react';

interface AiMomentsCaptionProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 朋友圈文案生成器',
    subtitle: '输入场景或心情，AI 帮你写3条不撞款的朋友圈',
    scene: '照片/场景描述',
    scenePlaceholder: '如：周末在咖啡店看书 / 海边日落 / 加班到深夜...',
    mood: '心情（可选）',
    moodPlaceholder: '如：开心 / 怀念 / 累但充实...',
    style: '文案风格',
    generate: '✨ 生成文案',
    loading: '正在生成...',
    caption: '文案',
    vibe: '风格',
    copy: '复制',
    copied: '已复制',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完（5次/天）',
    remaining: '今日剩余：',
    reset: '清空',
    required: '请描述场景',
  },
  en: {
    title: 'AI Moments Caption Generator',
    subtitle: 'Describe the scene or mood, get 3 unique captions',
    scene: 'Scene / Photo Description',
    scenePlaceholder: 'e.g. weekend coffee shop / seaside sunset / late night work...',
    mood: 'Mood (optional)',
    moodPlaceholder: 'e.g. happy / nostalgic / tired but fulfilled...',
    style: 'Style',
    generate: '✨ Generate',
    loading: 'Generating...',
    caption: 'Caption',
    vibe: 'Vibe',
    copy: 'Copy',
    copied: 'Copied',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded (5/day)',
    remaining: 'Remaining today: ',
    reset: 'Clear',
    required: 'Please describe the scene',
  },
  hi: {
    title: 'AI मोमेंट्स कैप्शन जनरेटर',
    subtitle: 'दृश्य या मूड दर्ज करें, 3 अद्वितीय कैप्शन पाएं',
    scene: 'दृश्य विवरण',
    scenePlaceholder: 'जैसे: कॉफी शॉप / समुद्र तट / देर रात काम...',
    mood: 'मूड (वैकल्पिक)',
    moodPlaceholder: 'जैसे: खुश / उदासीन / थका हुआ...',
    style: 'शैली',
    generate: '✨ बनाएं',
    loading: 'बना रहे हैं...',
    caption: 'कैप्शन',
    vibe: 'अंदाज',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    error: 'विफल, पुनः प्रयास करें',
    rateLimit: 'दैनिक सीमा (5/दिन)',
    remaining: 'शेष: ',
    reset: 'साफ़ करें',
    required: 'दृश्य दर्ज करें',
  },
  fr: {
    title: 'Générateur de légendes IA',
    subtitle: 'Décrivez la scène, obtenez 3 légendes uniques',
    scene: 'Description de la scène',
    scenePlaceholder: 'ex: café du week-end / coucher de soleil...',
    mood: 'Humeur (optionnel)',
    moodPlaceholder: 'ex: heureux / nostalgique...',
    style: 'Style',
    generate: '✨ Générer',
    loading: 'Génération...',
    caption: 'Légende',
    vibe: 'Style',
    copy: 'Copier',
    copied: 'Copié',
    error: 'Échec, réessayez',
    rateLimit: 'Limite atteinte (5/jour)',
    remaining: 'Restant: ',
    reset: 'Effacer',
    required: 'Décrivez la scène',
  },
  es: {
    title: 'Generador de leyendas IA',
    subtitle: 'Describe la escena, obtén 3 leyendas únicas',
    scene: 'Descripción de la escena',
    scenePlaceholder: 'ej: cafetería / atardecer / trabajo nocturno...',
    mood: 'Estado de ánimo (opcional)',
    moodPlaceholder: 'ej: feliz / nostálgico...',
    style: 'Estilo',
    generate: '✨ Generar',
    loading: 'Generando...',
    caption: 'Leyenda',
    vibe: 'Estilo',
    copy: 'Copiar',
    copied: 'Copiado',
    error: 'Error, intenta de nuevo',
    rateLimit: 'Límite (5/día)',
    remaining: 'Restante: ',
    reset: 'Limpiar',
    required: 'Describe la escena',
  },
  ar: {
    title: 'مولد تعليقات اللحظات بالذكاء الاصطناعي',
    subtitle: 'صف المشهد، احصل على 3 تعليقات فريدة',
    scene: 'وصف المشهد',
    scenePlaceholder: 'مثل: مقهى / غروب / عمل متأخر...',
    mood: 'المزاج (اختياري)',
    moodPlaceholder: 'مثل: سعيد / حنين...',
    style: 'الأسلوب',
    generate: '✨ إنشاء',
    loading: 'جاري الإنشاء...',
    caption: 'التعليق',
    vibe: 'الأسلوب',
    copy: 'نسخ',
    copied: 'تم النسخ',
    error: 'فشل، حاول مرة أخرى',
    rateLimit: 'الحد (5/يوم)',
    remaining: 'المتبقي: ',
    reset: 'مسح',
    required: 'صف المشهد',
  },
};

const STYLES: Array<{ key: string; label: Record<string, string> }> = [
  { key: 'mixed', label: { zh: '混合三种', en: 'Mixed (3 styles)', hi: 'तीन मिश्रित', fr: 'Mixte (3 styles)', es: 'Mixto (3 estilos)', ar: 'ثلاثة مختلطة' } },
  { key: 'literary', label: { zh: '文艺', en: 'Literary', hi: 'साहित्यिक', fr: 'Littéraire', es: 'Literario', ar: 'أدبي' } },
  { key: 'humorous', label: { zh: '幽默', en: 'Humorous', hi: 'हास्य', fr: 'Humoristique', es: 'Humorístico', ar: 'فكاهي' } },
  { key: 'minimal', label: { zh: '简约', en: 'Minimal', hi: 'न्यूनतम', fr: 'Minimaliste', es: 'Minimalista', ar: 'بسيط' } },
  { key: 'emotional', label: { zh: '走心', en: 'Emotional', hi: 'भावनात्मक', fr: 'Émotionnel', es: 'Emocional', ar: 'عاطفي' } },
];

interface CaptionItem {
  caption: string;
  vibe: string;
}

export default function AiMomentsCaption({ locale = 'zh' }: AiMomentsCaptionProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;
  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [scene, setScene] = useState('');
  const [mood, setMood] = useState('');
  const [style, setStyle] = useState('mixed');
  const [items, setItems] = useState<CaptionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!scene.trim()) return;
    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setItems([]);
    try {
      const response = await fetch('/api/ai-moments-caption/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scene: scene.trim(), mood: mood.trim(), style, locale: resolvedLocale }),
      });
      if (response.status === 429) { setRateLimitError(true); return; }
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setItems(data.items || []);
      setRemaining(data.remaining);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [scene, mood, style, resolvedLocale]);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleReset = useCallback(() => {
    setScene('');
    setMood('');
    setStyle('mixed');
    setItems([]);
    setError(false);
    setRateLimitError(false);
    setRemaining(null);
    setCopiedIndex(null);
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'>
            <Camera className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
          </div>
        </div>

        {((remaining !== null) || rateLimitError) && (
          <div className={`p-3 sm:p-4 rounded-lg mb-4 text-sm ${rateLimitError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 text-blue-700'}`}>
            {rateLimitError ? t('rateLimit') : `${t('remaining')}${remaining ?? 0}`}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('scene')} <span className='text-red-500'>*</span></label>
            <textarea value={scene} onChange={(e) => { setScene(e.target.value); setError(false); }} placeholder={t('scenePlaceholder')} rows={3} className='w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-y' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('mood')}</label>
            <input type='text' value={mood} onChange={(e) => setMood(e.target.value)} placeholder={t('moodPlaceholder')} className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('style')}</label>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
              {STYLES.map((s) => (
                <button key={s.key} onClick={() => setStyle(s.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${style === s.key ? 'text-white bg-gradient-to-br from-pink-500 to-rose-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {s.label[resolvedLocale]}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!scene.trim() || loading} className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : <Sparkles className='h-5 w-5' />}
            {loading ? t('loading') : t('generate')}
          </button>

          {(items.length > 0 || scene || mood) && (
            <button onClick={handleReset} className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-all'>
              <RotateCcw className='h-4 w-4' />
              {t('reset')}
            </button>
          )}

          {error && !rateLimitError && (
            <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'>
              <p className='text-sm text-red-700 dark:text-red-300'>{t('error')}</p>
            </div>
          )}

          {items.length > 0 && (
            <div className='space-y-3'>
              {items.map((item, index) => (
                <div key={index} className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='px-2 py-1 rounded-md bg-pink-100 dark:bg-pink-900/30 text-xs font-semibold text-pink-700 dark:text-pink-300'>{item.vibe}</span>
                    <button onClick={() => handleCopy(item.caption, index)} className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[32px]'>
                      {copiedIndex === index ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
                      {copiedIndex === index ? t('copied') : t('copy')}
                    </button>
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>{item.caption}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
