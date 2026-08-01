'use client';

import { useState, useCallback } from 'react';
import { Dumbbell, RefreshCw, Copy, Check, Sparkles, Apple, RotateCcw } from 'lucide-react';

interface AiWorkoutPlanProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 健身计划生成器',
    subtitle: '根据目标、体能、器械，一键生成专属训练计划',
    goal: '训练目标',
    level: '体能水平',
    equipment: '可用器械',
    days: '每周训练天数',
    generate: '✨ 生成训练计划',
    loading: '正在生成计划...',
    summary: '计划总览',
    day: '训练日',
    focus: '训练重点',
    exercises: '动作清单',
    duration: '时长',
    notes: '注意事项',
    nutrition: '饮食建议',
    copy: '复制全部',
    copied: '已复制',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完（5次/天）',
    remaining: '今日剩余：',
    reset: '清空',
  },
  en: {
    title: 'AI Workout Plan Generator',
    subtitle: 'Personalized training plan based on goal, level and equipment',
    goal: 'Goal',
    level: 'Fitness Level',
    equipment: 'Equipment',
    days: 'Days per Week',
    generate: '✨ Generate Plan',
    loading: 'Generating...',
    summary: 'Plan Overview',
    day: 'Day',
    focus: 'Focus',
    exercises: 'Exercises',
    duration: 'Duration',
    notes: 'Notes',
    nutrition: 'Nutrition Tips',
    copy: 'Copy All',
    copied: 'Copied',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded (5/day)',
    remaining: 'Remaining today: ',
    reset: 'Clear',
  },
  hi: {
    title: 'AI वर्कआउट प्लान जनरेटर',
    subtitle: 'लक्ष्य, स्तर और उपकरण के अनुसार व्यक्तिगत योजना',
    goal: 'लक्ष्य',
    level: 'स्तर',
    equipment: 'उपकरण',
    days: 'सप्ताह के दिन',
    generate: '✨ योजना बनाएं',
    loading: 'बना रहे हैं...',
    summary: 'योजना अवलोकन',
    day: 'दिन',
    focus: 'फोकस',
    exercises: 'व्यायाम',
    duration: 'अवधि',
    notes: 'नोट्स',
    nutrition: 'पोषण',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    error: 'विफल, पुनः प्रयास करें',
    rateLimit: 'दैनिक सीमा पूरी (5/दिन)',
    remaining: 'शेष: ',
    reset: 'साफ़ करें',
  },
  fr: {
    title: 'Générateur de plan d\'entraînement IA',
    subtitle: 'Plan personnalisé selon objectif, niveau et équipement',
    goal: 'Objectif',
    level: 'Niveau',
    equipment: 'Équipement',
    days: 'Jours/semaine',
    generate: '✨ Générer',
    loading: 'Génération...',
    summary: 'Aperçu',
    day: 'Jour',
    focus: 'Focus',
    exercises: 'Exercices',
    duration: 'Durée',
    notes: 'Notes',
    nutrition: 'Nutrition',
    copy: 'Copier',
    copied: 'Copié',
    error: 'Échec, réessayez',
    rateLimit: 'Limite atteinte (5/jour)',
    remaining: 'Restant: ',
    reset: 'Effacer',
  },
  es: {
    title: 'Generador de plan de entrenamiento IA',
    subtitle: 'Plan personalizado según objetivo, nivel y equipo',
    goal: 'Objetivo',
    level: 'Nivel',
    equipment: 'Equipo',
    days: 'Días/semana',
    generate: '✨ Generar',
    loading: 'Generando...',
    summary: 'Resumen',
    day: 'Día',
    focus: 'Enfoque',
    exercises: 'Ejercicios',
    duration: 'Duración',
    notes: 'Notas',
    nutrition: 'Nutrición',
    copy: 'Copiar',
    copied: 'Copiado',
    error: 'Error, intenta de nuevo',
    rateLimit: 'Límite alcanzado (5/día)',
    remaining: 'Restante: ',
    reset: 'Limpiar',
  },
  ar: {
    title: 'مولد خطط التمرين بالذكاء الاصطناعي',
    subtitle: 'خطة مخصصة حسب الهدف والمستوى والمعدات',
    goal: 'الهدف',
    level: 'المستوى',
    equipment: 'المعدات',
    days: 'أيام/أسبوع',
    generate: '✨ إنشاء',
    loading: 'جاري الإنشاء...',
    summary: 'نظرة عامة',
    day: 'اليوم',
    focus: 'التركيز',
    exercises: 'التمارين',
    duration: 'المدة',
    notes: 'ملاحظات',
    nutrition: 'التغذية',
    copy: 'نسخ',
    copied: 'تم النسخ',
    error: 'فشل، حاول مرة أخرى',
    rateLimit: 'الحد (5/يوم)',
    remaining: 'المتبقي: ',
    reset: 'مسح',
  },
};

type OptItem = { key: string; label: Record<string, string> };
const OPTIONS: { goal: OptItem[]; level: OptItem[]; equipment: OptItem[]; days: string[] } = {
  goal: [
    { key: 'fat_loss', label: { zh: '减脂', en: 'Fat Loss', hi: 'वसा हानि', fr: 'Perte de graisse', es: 'Pérdida de grasa', ar: 'فقدان دهون' } },
    { key: 'muscle', label: { zh: '增肌', en: 'Muscle Gain', hi: 'मांसपेशी', fr: 'Prise de muscle', es: 'Ganancia muscular', ar: 'بناء عضلات' } },
    { key: 'shaping', label: { zh: '塑形', en: 'Shaping', hi: 'शेपिंग', fr: 'Tonification', es: 'Tonificación', ar: 'نحت' } },
    { key: 'fitness', label: { zh: '体能', en: 'Fitness', hi: 'फिटनेस', fr: 'Condition', es: 'Condición', ar: 'لياقة' } },
  ],
  level: [
    { key: 'beginner', label: { zh: '初级', en: 'Beginner', hi: 'शुरुआती', fr: 'Débutant', es: 'Principiante', ar: 'مبتدئ' } },
    { key: 'intermediate', label: { zh: '中级', en: 'Intermediate', hi: 'मध्यवर्ती', fr: 'Intermédiaire', es: 'Intermedio', ar: 'متوسط' } },
    { key: 'advanced', label: { zh: '高级', en: 'Advanced', hi: 'उन्नत', fr: 'Avancé', es: 'Avanzado', ar: 'متقدم' } },
  ],
  equipment: [
    { key: 'bodyweight', label: { zh: '徒手', en: 'Bodyweight', hi: 'शारीरिक', fr: 'Poids du corps', es: 'Peso corporal', ar: 'وزن الجسم' } },
    { key: 'dumbbell', label: { zh: '哑铃', en: 'Dumbbells', hi: 'डम्बल', fr: 'Haltères', es: 'Mancuernas', ar: 'دمبل' } },
    { key: 'gym', label: { zh: '健身房', en: 'Full Gym', hi: 'जिम', fr: 'Salle de sport', es: 'Gimnasio', ar: 'صالة' } },
    { key: 'home', label: { zh: '家用', en: 'Home', hi: 'घर', fr: 'Maison', es: 'Casa', ar: 'منزل' } },
  ],
  days: ['2', '3', '4', '5'],
};

interface DayItem {
  day: string;
  focus: string;
  exercises: string;
  duration: string;
  notes: string;
}

export default function AiWorkoutPlan({ locale = 'zh' }: AiWorkoutPlanProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;
  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [goal, setGoal] = useState('fat_loss');
  const [level, setLevel] = useState('beginner');
  const [equipment, setEquipment] = useState('bodyweight');
  const [days, setDays] = useState('3');
  const [summary, setSummary] = useState('');
  const [items, setItems] = useState<DayItem[]>([]);
  const [nutritionTips, setNutritionTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setItems([]);
    setSummary('');
    setNutritionTips('');
    try {
      const response = await fetch('/api/ai-workout-plan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, level, equipment, daysPerWeek: days, locale: resolvedLocale }),
      });
      if (response.status === 429) { setRateLimitError(true); return; }
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary || '');
      setItems(data.items || []);
      setNutritionTips(data.nutritionTips || '');
      setRemaining(data.remaining);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [goal, level, equipment, days, resolvedLocale]);

  const handleCopyAll = useCallback(async () => {
    const text = `${summary}\n\n${items.map((it) => `${it.day} | ${it.focus} | ${it.duration}\n${it.exercises}\n${it.notes}`).join('\n\n')}\n\n${nutritionTips}`;
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summary, items, nutritionTips]);

  const handleReset = useCallback(() => {
    setGoal('fat_loss');
    setLevel('beginner');
    setEquipment('bodyweight');
    setDays('3');
    setSummary('');
    setItems([]);
    setNutritionTips('');
    setError(false);
    setRateLimitError(false);
    setRemaining(null);
    setCopied(false);
  }, []);

  const renderOptions = (key: 'goal' | 'level' | 'equipment', value: string, setter: (v: string) => void) => (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
      {OPTIONS[key].map((opt) => (
        <button key={opt.key} onClick={() => setter(opt.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${value === opt.key ? 'text-white bg-gradient-to-br from-orange-500 to-red-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
          {opt.label[resolvedLocale]}
        </button>
      ))}
    </div>
  );

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25'>
            <Dumbbell className='h-5 w-5 sm:h-6 sm:w-6' />
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('goal')}</label>
            {renderOptions('goal', goal, setGoal)}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('level')}</label>
            <div className='grid grid-cols-3 gap-2'>
              {OPTIONS.level.map((opt) => (
                <button key={opt.key} onClick={() => setLevel(opt.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${level === opt.key ? 'text-white bg-gradient-to-br from-orange-500 to-red-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {opt.label[resolvedLocale]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('equipment')}</label>
            {renderOptions('equipment', equipment, setEquipment)}
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('days')}</label>
            <div className='grid grid-cols-4 gap-2'>
              {OPTIONS.days.map((d) => (
                <button key={d} onClick={() => setDays(d)} className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-medium transition-all ${days === d ? 'text-white bg-gradient-to-br from-orange-500 to-red-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading} className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : <Sparkles className='h-5 w-5' />}
            {loading ? t('loading') : t('generate')}
          </button>

          {(items.length > 0 || summary || nutritionTips) && (
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
            <div className='space-y-4'>
              {summary && (
                <div className='p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50'>
                  <p className='text-xs font-medium text-orange-700 dark:text-orange-400 mb-1'>{t('summary')}</p>
                  <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>{summary}</p>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>{t('day')}</h3>
                <button onClick={handleCopyAll} className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[32px]'>
                  {copied ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
                  {copied ? t('copied') : t('copy')}
                </button>
              </div>
              {items.map((item, index) => (
                <div key={index} className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-5'>
                  <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <span className='px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-xs font-semibold text-orange-700 dark:text-orange-300'>{item.day}</span>
                    <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>{item.focus}</span>
                    <span className='ml-auto px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300'>{item.duration}</span>
                  </div>
                  <div className='space-y-2'>
                    <div>
                      <p className='text-xs font-medium text-orange-700 dark:text-orange-400 mb-1'>{t('exercises')}</p>
                      <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>{item.exercises}</p>
                    </div>
                    {item.notes && (
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{t('notes')}: {item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
              {nutritionTips && (
                <div className='p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Apple className='h-4 w-4 text-green-600' />
                    <p className='text-xs font-medium text-green-700 dark:text-green-400'>{t('nutrition')}</p>
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>{nutritionTips}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
