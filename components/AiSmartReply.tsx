'use client';

import { useState, useCallback } from 'react';
import { MessageCircle, RefreshCw, Copy, Check, Sparkles, Lightbulb, RotateCcw } from 'lucide-react';

interface AiSmartReplyProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 高情商回复助手',
    subtitle: '不知道怎么回？输入对方消息，AI 帮你想3条不尴尬的回复',
    incoming: '对方发来的消息',
    incomingPlaceholder: '粘贴对方发给你的消息原文...',
    relation: '对方身份',
    goal: '你的目标',
    generate: '✨ 生成回复',
    loading: '正在生成...',
    reply: '回复',
    reasoning: '为什么这么说',
    copy: '复制',
    copied: '已复制',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完（5次/天）',
    remaining: '今日剩余：',
    reset: '清空',
    required: '请输入对方消息',
  },
  en: {
    title: 'AI Smart Reply Assistant',
    subtitle: 'Don\'t know how to reply? Get 3 natural responses',
    incoming: 'Incoming Message',
    incomingPlaceholder: 'Paste the message you received...',
    relation: 'Relationship',
    goal: 'Your Goal',
    generate: '✨ Generate Replies',
    loading: 'Generating...',
    reply: 'Reply',
    reasoning: 'Why this works',
    copy: 'Copy',
    copied: 'Copied',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded (5/day)',
    remaining: 'Remaining today: ',
    reset: 'Clear',
    required: 'Please enter the message',
  },
  hi: {
    title: 'AI स्मार्ट रिप्लाई सहायक',
    subtitle: 'कैसे जवाब दें? 3 प्राकृतिक उत्तर पाएं',
    incoming: 'प्राप्त संदेश',
    incomingPlaceholder: 'संदेश पेस्ट करें...',
    relation: 'रिश्ता',
    goal: 'आपका लक्ष्य',
    generate: '✨ उत्तर बनाएं',
    loading: 'बना रहे हैं...',
    reply: 'उत्तर',
    reasoning: 'क्यों',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    error: 'विफल, पुनः प्रयास करें',
    rateLimit: 'दैनिक सीमा (5/दिन)',
    remaining: 'शेष: ',
    reset: 'साफ़ करें',
    required: 'संदेश दर्ज करें',
  },
  fr: {
    title: 'Assistant de réponses intelligentes IA',
    subtitle: 'Comment répondre? Obtenez 3 réponses naturelles',
    incoming: 'Message reçu',
    incomingPlaceholder: 'Collez le message reçu...',
    relation: 'Relation',
    goal: 'Votre objectif',
    generate: '✨ Générer',
    loading: 'Génération...',
    reply: 'Réponse',
    reasoning: 'Pourquoi',
    copy: 'Copier',
    copied: 'Copié',
    error: 'Échec, réessayez',
    rateLimit: 'Limite (5/jour)',
    remaining: 'Restant: ',
    reset: 'Effacer',
    required: 'Entrez le message',
  },
  es: {
    title: 'Asistente de respuestas inteligentes IA',
    subtitle: '¿Cómo responder? Obtén 3 respuestas naturales',
    incoming: 'Mensaje recibido',
    incomingPlaceholder: 'Pega el mensaje recibido...',
    relation: 'Relación',
    goal: 'Tu objetivo',
    generate: '✨ Generar',
    loading: 'Generando...',
    reply: 'Respuesta',
    reasoning: 'Por qué',
    copy: 'Copiar',
    copied: 'Copiado',
    error: 'Error, intenta de nuevo',
    rateLimit: 'Límite (5/día)',
    remaining: 'Restante: ',
    reset: 'Limpiar',
    required: 'Ingresa el mensaje',
  },
  ar: {
    title: 'مساعد الردود الذكية بالذكاء الاصطناعي',
    subtitle: 'كيف ترد؟ احصل على 3 ردود طبيعية',
    incoming: 'الرسالة الواردة',
    incomingPlaceholder: 'الصق الرسالة...',
    relation: 'العلاقة',
    goal: 'هدفك',
    generate: '✨ إنشاء',
    loading: 'جاري الإنشاء...',
    reply: 'الرد',
    reasoning: 'لماذا',
    copy: 'نسخ',
    copied: 'تم النسخ',
    error: 'فشل، حاول مرة أخرى',
    rateLimit: 'الحد (5/يوم)',
    remaining: 'المتبقي: ',
    reset: 'مسح',
    required: 'أدخل الرسالة',
  },
};

const RELATIONS: Array<{ key: string; label: Record<string, string> }> = [
  { key: 'partner', label: { zh: '情侣', en: 'Partner', hi: 'साथी', fr: 'Partenaire', es: 'Pareja', ar: 'شريك' } },
  { key: 'boss', label: { zh: '领导', en: 'Boss', hi: 'बॉस', fr: 'Patron', es: 'Jefe', ar: 'مدير' } },
  { key: 'client', label: { zh: '客户', en: 'Client', hi: 'ग्राहक', fr: 'Client', es: 'Cliente', ar: 'عميل' } },
  { key: 'friend', label: { zh: '朋友', en: 'Friend', hi: 'दोस्त', fr: 'Ami', es: 'Amigo', ar: 'صديق' } },
  { key: 'family', label: { zh: '家人', en: 'Family', hi: 'परिवार', fr: 'Famille', es: 'Familia', ar: 'عائلة' } },
  { key: 'crush', label: { zh: '暗恋', en: 'Crush', hi: 'क्रश', fr: 'Craquage', es: 'Interés', ar: 'إعجاب' } },
];

const GOALS: Array<{ key: string; label: Record<string, string> }> = [
  { key: 'reply', label: { zh: '得体回复', en: 'Reply', hi: 'उत्तर', fr: 'Répondre', es: 'Responder', ar: 'رد' } },
  { key: 'refuse', label: { zh: '委婉拒绝', en: 'Refuse', hi: 'अस्वीकार', fr: 'Refuser', es: 'Rechazar', ar: 'رفض' } },
  { key: 'accept', label: { zh: '答应', en: 'Accept', hi: 'स्वीकार', fr: 'Accepter', es: 'Aceptar', ar: 'قبول' } },
  { key: 'icebreak', label: { zh: '破冰', en: 'Ice-break', hi: 'बर्फ तोड़ना', fr: 'Briser glace', es: 'Romper hielo', ar: 'كسر الجليد' } },
  { key: 'negotiate', label: { zh: '谈判', en: 'Negotiate', hi: 'बातचीत', fr: 'Négocier', es: 'Negociar', ar: 'تفاوض' } },
];

interface ReplyItem {
  reply: string;
  reasoning: string;
}

export default function AiSmartReply({ locale = 'zh' }: AiSmartReplyProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;
  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [incomingText, setIncomingText] = useState('');
  const [relation, setRelation] = useState('friend');
  const [goal, setGoal] = useState('reply');
  const [items, setItems] = useState<ReplyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!incomingText.trim()) return;
    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setItems([]);
    try {
      const response = await fetch('/api/ai-smart-reply/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomingText: incomingText.trim(), relation, goal, locale: resolvedLocale }),
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
  }, [incomingText, relation, goal, resolvedLocale]);

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
    setIncomingText('');
    setRelation('friend');
    setGoal('reply');
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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25'>
            <MessageCircle className='h-5 w-5 sm:h-6 sm:w-6' />
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('incoming')} <span className='text-red-500'>*</span></label>
            <textarea value={incomingText} onChange={(e) => { setIncomingText(e.target.value); setError(false); }} placeholder={t('incomingPlaceholder')} rows={4} className='w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('relation')}</label>
            <div className='grid grid-cols-3 sm:grid-cols-6 gap-2'>
              {RELATIONS.map((r) => (
                <button key={r.key} onClick={() => setRelation(r.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${relation === r.key ? 'text-white bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {r.label[resolvedLocale]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('goal')}</label>
            <div className='grid grid-cols-3 sm:grid-cols-5 gap-2'>
              {GOALS.map((g) => (
                <button key={g.key} onClick={() => setGoal(g.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${goal === g.key ? 'text-white bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {g.label[resolvedLocale]}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!incomingText.trim() || loading} className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : <Sparkles className='h-5 w-5' />}
            {loading ? t('loading') : t('generate')}
          </button>

          {(items.length > 0 || incomingText) && (
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
                    <span className='px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900/30 text-xs font-semibold text-teal-700 dark:text-teal-300'>#{index + 1}</span>
                    <button onClick={() => handleCopy(item.reply, index)} className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[32px]'>
                      {copiedIndex === index ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
                      {copiedIndex === index ? t('copied') : t('copy')}
                    </button>
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-2'>{item.reply}</p>
                  <div className='flex items-start gap-2 pt-2 border-t border-gray-100 dark:border-gray-700'>
                    <Lightbulb className='h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0' />
                    <p className='text-xs text-gray-500 dark:text-gray-400'>{t('reasoning')}: {item.reasoning}</p>
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
