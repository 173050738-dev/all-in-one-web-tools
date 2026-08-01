'use client';

import { useState, useCallback } from 'react';
import { Gamepad2, RefreshCw, Copy, Check, Sparkles, Lightbulb } from 'lucide-react';

interface AiGameGuideProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 游戏攻略生成器',
    subtitle: '卡关了？输入游戏名和卡点，AI 帮你想3条通关思路',
    game: '游戏名称',
    gamePlaceholder: '如：原神 / 艾尔登法环 / 王者荣耀',
    level: '关卡 / 角色 / BOSS',
    levelPlaceholder: '如：风魔龙 / 史东薇尔城 / 上分铂金段位',
    platform: '平台',
    situation: '卡点描述',
    situationPlaceholder: '详细描述你卡在哪里、试过什么、遇到什么困难...',
    generate: '✨ 生成攻略',
    loading: '正在生成攻略...',
    strategy: '通关思路',
    tips: '避坑要点',
    copy: '复制',
    copied: '已复制',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完（5次/天）',
    remaining: '今日剩余：',
    required: '请填写游戏名和卡点描述',
  },
  en: {
    title: 'AI Game Guide Generator',
    subtitle: 'Stuck? Enter the game and your blocker, get 3 strategies',
    game: 'Game Name',
    gamePlaceholder: 'e.g. Genshin Impact / Elden Ring / League of Legends',
    level: 'Level / Character / Boss',
    levelPlaceholder: 'e.g. Stormterror / Stormveil Castle / Platinum rank',
    platform: 'Platform',
    situation: 'Blocker Description',
    situationPlaceholder: 'Describe where you are stuck, what you tried, what went wrong...',
    generate: '✨ Generate Guides',
    loading: 'Generating...',
    strategy: 'Strategy',
    tips: 'Tips',
    copy: 'Copy',
    copied: 'Copied',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded (5/day)',
    remaining: 'Remaining today: ',
    required: 'Game name and blocker description are required',
  },
  hi: {
    title: 'AI गेम गाइड जनरेटर',
    subtitle: 'अटक गए? गेम और समस्या दर्ज करें, 3 रणनीतियां पाएं',
    game: 'गेम का नाम',
    gamePlaceholder: 'जैसे: Genshin Impact / Elden Ring',
    level: 'स्तर / चरित्र / बॉस',
    levelPlaceholder: 'जैसे: Stormterror / Stormveil Castle',
    platform: 'प्लेटफ़ॉर्म',
    situation: 'समस्या विवरण',
    situationPlaceholder: 'विस्तार से बताएं कि कहां अटके, क्या कोशिश की...',
    generate: '✨ गाइड बनाएं',
    loading: 'बना रहे हैं...',
    strategy: 'रणनीति',
    tips: 'सुझाव',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    error: 'जनरेशन विफल, पुनः प्रयास करें',
    rateLimit: 'दैनिक मुफ्त सीमा पूरी (5/दिन)',
    remaining: 'आज शेष: ',
    required: 'गेम नाम और समस्या आवश्यक',
  },
  fr: {
    title: 'Générateur de guides de jeu IA',
    subtitle: 'Bloqué? Entrez le jeu et le problème, obtenez 3 stratégies',
    game: 'Nom du jeu',
    gamePlaceholder: 'ex: Genshin Impact / Elden Ring',
    level: 'Niveau / Personnage / Boss',
    levelPlaceholder: 'ex: Stormterror / Stormveil Castle',
    platform: 'Plateforme',
    situation: 'Description du blocage',
    situationPlaceholder: 'Décrivez où vous êtes bloqué, ce que vous avez essayé...',
    generate: '✨ Générer',
    loading: 'Génération...',
    strategy: 'Stratégie',
    tips: 'Conseils',
    copy: 'Copier',
    copied: 'Copié',
    error: 'Échec, réessayez',
    rateLimit: 'Limite quotidienne atteinte (5/jour)',
    remaining: 'Restant: ',
    required: 'Jeu et description requis',
  },
  es: {
    title: 'Generador de guías de juego IA',
    subtitle: '¿Atascado? Ingresa el juego y el problema, obtén 3 estrategias',
    game: 'Nombre del juego',
    gamePlaceholder: 'ej: Genshin Impact / Elden Ring',
    level: 'Nivel / Personaje / Jefe',
    levelPlaceholder: 'ej: Stormterror / Stormveil Castle',
    platform: 'Plataforma',
    situation: 'Descripción del problema',
    situationPlaceholder: 'Describe dónde estás atascado, qué intentaste...',
    generate: '✨ Generar',
    loading: 'Generando...',
    strategy: 'Estrategia',
    tips: 'Consejos',
    copy: 'Copiar',
    copied: 'Copiado',
    error: 'Error, intenta de nuevo',
    rateLimit: 'Límite diario alcanzado (5/día)',
    remaining: 'Restante: ',
    required: 'Juego y descripción son obligatorios',
  },
  ar: {
    title: 'مولد أدلة الألعاب بالذكاء الاصطناعي',
    subtitle: 'عالق؟ أدخل اللعبة والمشكلة، احصل على 3 استراتيجيات',
    game: 'اسم اللعبة',
    gamePlaceholder: 'مثل: Genshin Impact / Elden Ring',
    level: 'المستوى / الشخصية / الزعيم',
    levelPlaceholder: 'مثل: Stormterror / Stormveil Castle',
    platform: 'المنصة',
    situation: 'وصف المشكلة',
    situationPlaceholder: 'صف أين عالقت، ماذا جربت، ما الذي حدث...',
    generate: '✨ إنشاء',
    loading: 'جاري الإنشاء...',
    strategy: 'الاستراتيجية',
    tips: 'نصائح',
    copy: 'نسخ',
    copied: 'تم النسخ',
    error: 'فشل، حاول مرة أخرى',
    rateLimit: 'الحد اليومي (5/يوم)',
    remaining: 'المتبقي: ',
    required: 'اسم اللعبة والوصف مطلوبان',
  },
};

const PLATFORMS: Array<{ key: string; label: Record<string, string> }> = [
  { key: 'general', label: { zh: '通用', en: 'General', hi: 'सामान्य', fr: 'Général', es: 'General', ar: 'عام' } },
  { key: 'pc', label: { zh: 'PC', en: 'PC', hi: 'PC', fr: 'PC', es: 'PC', ar: 'PC' } },
  { key: 'mobile', label: { zh: '手机', en: 'Mobile', hi: 'मोबाइल', fr: 'Mobile', es: 'Móvil', ar: 'جوال' } },
  { key: 'console', label: { zh: '主机', en: 'Console', hi: 'कंसोल', fr: 'Console', es: 'Consola', ar: 'كونسول' } },
];

interface GuideItem {
  title: string;
  strategy: string;
  tips: string;
}

export default function AiGameGuide({ locale = 'zh' }: AiGameGuideProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;
  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [game, setGame] = useState('');
  const [level, setLevel] = useState('');
  const [platform, setPlatform] = useState('general');
  const [situation, setSituation] = useState('');
  const [items, setItems] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!game.trim() || !situation.trim()) return;
    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setItems([]);
    try {
      const response = await fetch('/api/ai-game-guide/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: game.trim(), level: level.trim(), platform, situation: situation.trim(), locale: resolvedLocale }),
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
  }, [game, level, platform, situation, resolvedLocale]);

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

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'>
            <Gamepad2 className='h-5 w-5 sm:h-6 sm:w-6' />
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('game')} <span className='text-red-500'>*</span></label>
            <input type='text' value={game} onChange={(e) => { setGame(e.target.value); setError(false); }} placeholder={t('gamePlaceholder')} className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('level')}</label>
            <input type='text' value={level} onChange={(e) => setLevel(e.target.value)} placeholder={t('levelPlaceholder')} className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('platform')}</label>
            <div className='grid grid-cols-4 gap-2'>
              {PLATFORMS.map((p) => (
                <button key={p.key} onClick={() => setPlatform(p.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${platform === p.key ? 'text-white bg-gradient-to-br from-violet-500 to-purple-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {p.label[resolvedLocale]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('situation')} <span className='text-red-500'>*</span></label>
            <textarea value={situation} onChange={(e) => { setSituation(e.target.value); setError(false); }} placeholder={t('situationPlaceholder')} rows={4} className='w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y' />
          </div>

          <button onClick={handleGenerate} disabled={!game.trim() || !situation.trim() || loading} className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : <Sparkles className='h-5 w-5' />}
            {loading ? t('loading') : t('generate')}
          </button>

          {error && !rateLimitError && (
            <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50'>
              <p className='text-sm text-red-700 dark:text-red-300'>{t('error')}</p>
            </div>
          )}

          {items.length > 0 && (
            <div className='space-y-4'>
              {items.map((item, index) => (
                <div key={index} className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <span className='px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-xs font-semibold text-violet-700 dark:text-violet-300'>#{index + 1}</span>
                      <span className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'>{item.title}</span>
                    </div>
                    <button onClick={() => handleCopy(`${item.title}\n\n${item.strategy}\n\n${item.tips}`, index)} className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[32px]'>
                      {copiedIndex === index ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
                      {copiedIndex === index ? t('copied') : t('copy')}
                    </button>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-2'>
                      <Sparkles className='h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-xs font-medium text-violet-700 dark:text-violet-400 mb-1'>{t('strategy')}</p>
                        <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>{item.strategy}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-2'>
                      <Lightbulb className='h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-xs font-medium text-amber-700 dark:text-amber-400 mb-1'>{t('tips')}</p>
                        <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>{item.tips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
