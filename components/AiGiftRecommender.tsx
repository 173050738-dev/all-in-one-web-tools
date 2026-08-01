'use client';

import { useState, useCallback } from 'react';
import { Gift, RefreshCw, Copy, Check, Sparkles, ShoppingBag } from 'lucide-react';

interface AiGiftRecommenderProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 礼物推荐器',
    subtitle: '不知道送什么？输入对象和场合，AI 推荐5个不踩雷的礼物',
    recipient: '送礼对象',
    recipientPlaceholder: '如：女友 / 60岁爸爸 / 8岁侄子...',
    occasion: '送礼场合',
    budget: '预算（可选）',
    budgetPlaceholder: '如：200-500元',
    interest: '对方兴趣（可选）',
    interestPlaceholder: '如：摄影 / 健身 / 阅读...',
    generate: '✨ 推荐礼物',
    loading: '正在推荐...',
    gift: '礼物',
    reason: '推荐理由',
    price: '价位',
    where: '购买渠道',
    copy: '复制',
    copied: '已复制',
    error: '生成失败，请重试',
    rateLimit: '今日免费次数已用完（5次/天）',
    remaining: '今日剩余：',
    required: '请填写送礼对象',
  },
  en: {
    title: 'AI Gift Recommender',
    subtitle: 'Don\'t know what to gift? Get 5 safe, thoughtful picks',
    recipient: 'Recipient',
    recipientPlaceholder: 'e.g. girlfriend / 60yo dad / 8yo nephew...',
    occasion: 'Occasion',
    budget: 'Budget (optional)',
    budgetPlaceholder: 'e.g. $20-50',
    interest: 'Interests (optional)',
    interestPlaceholder: 'e.g. photography / fitness / reading...',
    generate: '✨ Recommend Gifts',
    loading: 'Recommending...',
    gift: 'Gift',
    reason: 'Why',
    price: 'Price',
    where: 'Where to Buy',
    copy: 'Copy',
    copied: 'Copied',
    error: 'Generation failed, please retry',
    rateLimit: 'Daily free limit exceeded (5/day)',
    remaining: 'Remaining today: ',
    required: 'Please enter recipient',
  },
  hi: {
    title: 'AI उपहार सुझानेवाला',
    subtitle: 'क्या दें? 5 सुरक्षित उपहार पाएं',
    recipient: 'प्राप्तकर्ता',
    recipientPlaceholder: 'जैसे: प्रेमिका / पिता / भतीजा...',
    occasion: 'अवसर',
    budget: 'बजट (वैकल्पिक)',
    budgetPlaceholder: 'जैसे: ₹1000-2000',
    interest: 'रुचि (वैकल्पिक)',
    interestPlaceholder: 'जैसे: फोटोग्राफी / फिटनेस...',
    generate: '✨ सुझाएं',
    loading: 'सुझा रहे हैं...',
    gift: 'उपहार',
    reason: 'क्यों',
    price: 'मूल्य',
    where: 'कहां',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    error: 'विफल, पुनः प्रयास करें',
    rateLimit: 'दैनिक सीमा (5/दिन)',
    remaining: 'शेष: ',
    required: 'प्राप्तकर्ता दर्ज करें',
  },
  fr: {
    title: 'Recommandeur de cadeaux IA',
    subtitle: 'Que offrir? Obtenez 5 idées sûres',
    recipient: 'Destinataire',
    recipientPlaceholder: 'ex: petite amie / père / neveu...',
    occasion: 'Occasion',
    budget: 'Budget (optionnel)',
    budgetPlaceholder: 'ex: 20-50€',
    interest: 'Intérêts (optionnel)',
    interestPlaceholder: 'ex: photo / fitness / lecture...',
    generate: '✨ Recommander',
    loading: 'Recommandation...',
    gift: 'Cadeau',
    reason: 'Pourquoi',
    price: 'Prix',
    where: 'Où acheter',
    copy: 'Copier',
    copied: 'Copié',
    error: 'Échec, réessayez',
    rateLimit: 'Limite (5/jour)',
    remaining: 'Restant: ',
    required: 'Entrez le destinataire',
  },
  es: {
    title: 'Recomendador de regalos IA',
    subtitle: '¿Qué regalar? Obtén 5 ideas seguras',
    recipient: 'Destinatario',
    recipientPlaceholder: 'ej: novia / padre / sobrino...',
    occasion: 'Ocasión',
    budget: 'Presupuesto (opcional)',
    budgetPlaceholder: 'ej: $20-50',
    interest: 'Intereses (opcional)',
    interestPlaceholder: 'ej: fotografía / fitness...',
    generate: '✨ Recomendar',
    loading: 'Recomendando...',
    gift: 'Regalo',
    reason: 'Por qué',
    price: 'Precio',
    where: 'Dónde comprar',
    copy: 'Copiar',
    copied: 'Copiado',
    error: 'Error, intenta de nuevo',
    rateLimit: 'Límite (5/día)',
    remaining: 'Restante: ',
    required: 'Ingresa destinatario',
  },
  ar: {
    title: 'موصي الهدايا بالذكاء الاصطناعي',
    subtitle: 'ماذا تقدم؟ احصل على 5 أفكار آمنة',
    recipient: 'المستلم',
    recipientPlaceholder: 'مثل: صديقة / والد / ابن أخ...',
    occasion: 'المناسبة',
    budget: 'الميزانية (اختياري)',
    budgetPlaceholder: 'مثل: 100-200 ريال',
    interest: 'الاهتمامات (اختياري)',
    interestPlaceholder: 'مثل: تصوير / لياقة...',
    generate: '✨ اقترح',
    loading: 'جاري الاقتراح...',
    gift: 'هدية',
    reason: 'لماذا',
    price: 'السعر',
    where: 'أين',
    copy: 'نسخ',
    copied: 'تم النسخ',
    error: 'فشل، حاول مرة أخرى',
    rateLimit: 'الحد (5/يوم)',
    remaining: 'المتبقي: ',
    required: 'أدخل المستلم',
  },
};

const OCCASIONS: Array<{ key: string; label: Record<string, string> }> = [
  { key: 'birthday', label: { zh: '生日', en: 'Birthday', hi: 'जन्मदिन', fr: 'Anniversaire', es: 'Cumpleaños', ar: 'عيد ميلاد' } },
  { key: 'anniversary', label: { zh: '纪念日', en: 'Anniversary', hi: 'वर्षगांठ', fr: 'Anniversaire couple', es: 'Aniversario', ar: 'ذكرى' } },
  { key: 'festival', label: { zh: '节日', en: 'Festival', hi: 'त्योहार', fr: 'Fête', es: 'Fiesta', ar: 'عطلة' } },
  { key: 'thanks', label: { zh: '答谢', en: 'Thanks', hi: 'धन्यवाद', fr: 'Remerciement', es: 'Gracias', ar: 'شكر' } },
  { key: 'apology', label: { zh: '道歉', en: 'Apology', hi: 'माफ़ी', fr: 'Excuse', es: 'Disculpa', ar: 'اعتذار' } },
];

interface GiftItem {
  gift: string;
  reason: string;
  priceRange: string;
  whereToBuy: string;
}

export default function AiGiftRecommender({ locale = 'zh' }: AiGiftRecommenderProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;
  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('birthday');
  const [budget, setBudget] = useState('');
  const [interest, setInterest] = useState('');
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!recipient.trim()) return;
    setLoading(true);
    setError(false);
    setRateLimitError(false);
    setItems([]);
    try {
      const response = await fetch('/api/ai-gift-recommender/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: recipient.trim(), occasion, budget: budget.trim(), interest: interest.trim(), locale: resolvedLocale }),
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
  }, [recipient, occasion, budget, interest, resolvedLocale]);

  const handleCopy = useCallback(async (item: GiftItem, index: number) => {
    const text = `${item.gift} (${item.priceRange})\n${item.reason}\n${item.whereToBuy}`;
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
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25'>
            <Gift className='h-5 w-5 sm:h-6 sm:w-6' />
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('recipient')} <span className='text-red-500'>*</span></label>
            <input type='text' value={recipient} onChange={(e) => { setRecipient(e.target.value); setError(false); }} placeholder={t('recipientPlaceholder')} className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('occasion')}</label>
            <div className='grid grid-cols-3 sm:grid-cols-5 gap-2'>
              {OCCASIONS.map((o) => (
                <button key={o.key} onClick={() => setOccasion(o.key)} className={`min-h-[44px] px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${occasion === o.key ? 'text-white bg-gradient-to-br from-amber-500 to-yellow-600 shadow-md' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                  {o.label[resolvedLocale]}
                </button>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('budget')}</label>
              <input type='text' value={budget} onChange={(e) => setBudget(e.target.value)} placeholder={t('budgetPlaceholder')} className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('interest')}</label>
              <input type='text' value={interest} onChange={(e) => setInterest(e.target.value)} placeholder={t('interestPlaceholder')} className='w-full h-12 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent' />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!recipient.trim() || loading} className='w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-3 rounded-lg btn-primary text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? <RefreshCw className='h-5 w-5 animate-spin' /> : <Sparkles className='h-5 w-5' />}
            {loading ? t('loading') : t('generate')}
          </button>

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
                    <div className='flex items-center gap-2'>
                      <span className='px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-xs font-semibold text-amber-700 dark:text-amber-300'>#{index + 1}</span>
                      <span className='text-base font-bold text-gray-900 dark:text-gray-100'>{item.gift}</span>
                    </div>
                    <button onClick={() => handleCopy(item, index)} className='flex items-center gap-1 px-3 py-1.5 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[32px]'>
                      {copiedIndex === index ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
                      {copiedIndex === index ? t('copied') : t('copy')}
                    </button>
                  </div>
                  <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>{item.reason}</p>
                  <div className='flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700'>
                    {item.priceRange && (
                      <span className='px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-300'>{t('price')}: {item.priceRange}</span>
                    )}
                    {item.whereToBuy && (
                      <span className='flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300'>
                        <ShoppingBag className='h-3 w-3' />
                        {item.whereToBuy}
                      </span>
                    )}
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
