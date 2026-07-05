'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Check, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const STORAGE_KEY = 'korelyy_newsletter_subscribers_v1';
const SUBSCRIBED_FLAG_KEY = 'korelyy_newsletter_subscribed_v1';

type SubscribeStatus = 'idle' | 'submitting' | 'success' | 'duplicate' | 'invalid' | 'error';

interface SubscriberRecord {
  email: string;
  locale: string;
  subscribedAt: string;
  source?: string;
  id: string;
}

function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const re = /^[^\s@"(),:;<>[\]\\]+@[^\s@"(),:;<>[\]\\]+\.[^\s@"(),:;<>[\]\\]{2,}$/;
  if (!re.test(email)) return false;
  const [local, domain] = email.split('@');
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop() || '';
  if (tld.length < 2) return false;
  return true;
}

function safeGetStorage(key: string, fallback: string = ''): string {
  try {
    if (typeof window === 'undefined') return fallback;
    const val = window.localStorage.getItem(key);
    return val || fallback;
  } catch {
    return fallback;
  }
}

function safeSetStorage(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function getSubscribers(): SubscriberRecord[] {
  const raw = safeGetStorage(STORAGE_KEY, '[]');
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SubscriberRecord[];
    return [];
  } catch {
    return [];
  }
}

function saveSubscribers(list: SubscriberRecord[]): boolean {
  try {
    return safeSetStorage(STORAGE_KEY, JSON.stringify(list));
  } catch {
    return false;
  }
}

function genId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch { /* fallthrough */ }
  return 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export default function NewsletterSubscribe({ variant = 'card' }: { variant?: 'card' | 'banner' | 'inline' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscribeStatus>('idle');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribeForm, setShowUnsubscribeForm] = useState(false);
  const [unsubscribedOk, setUnsubscribedOk] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const t = useTranslations('newsletter');
  const resolvedParams = useParams() as unknown as { locale?: string };
  const pathname = usePathname();
  const pathLocaleMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const rawPathLocale = (pathLocaleMatch && pathLocaleMatch[1]) || '';
  const pathLocale = VALID_LOCALES.includes(rawPathLocale) ? rawPathLocale : 'en';
  const locale = VALID_LOCALES.includes(resolvedParams?.locale || '') ? (resolvedParams.locale as string) : pathLocale;

  useEffect(() => {
    const flag = safeGetStorage(SUBSCRIBED_FLAG_KEY);
    const lastEmail = safeGetStorage('korelyy_newsletter_last_email');
    if (flag === '1' && lastEmail) {
      setIsSubscribed(true);
      setCurrentEmail(lastEmail);
    }
  }, []);

  const handleSubscribe = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      setStatus('invalid');
      return;
    }
    setStatus('submitting');
    try {
      await new Promise(r => setTimeout(r, 500));
      const list = getSubscribers();
      const exists = list.some(s => s.email.toLowerCase() === trimmed);
      if (exists) {
        setStatus('duplicate');
        setIsSubscribed(true);
        setCurrentEmail(trimmed);
        safeSetStorage(SUBSCRIBED_FLAG_KEY, '1');
        safeSetStorage('korelyy_newsletter_last_email', trimmed);
        return;
      }
      const newRecord: SubscriberRecord = {
        id: genId(),
        email: trimmed,
        locale,
        subscribedAt: new Date().toISOString(),
        source: typeof window !== 'undefined' ? window.location.pathname : undefined,
      };
      const nextList = [...list, newRecord];
      saveSubscribers(nextList);
      safeSetStorage(SUBSCRIBED_FLAG_KEY, '1');
      safeSetStorage('korelyy_newsletter_last_email', trimmed);
      setIsSubscribed(true);
      setCurrentEmail(trimmed);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }, [email, locale]);

  const handleUnsubscribe = useCallback(() => {
    const list = getSubscribers();
    const trimmed = currentEmail.trim().toLowerCase();
    const filtered = list.filter(s => s.email.toLowerCase() !== trimmed);
    if (filtered.length < list.length) {
      saveSubscribers(filtered);
    }
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(SUBSCRIBED_FLAG_KEY);
        window.localStorage.removeItem('korelyy_newsletter_last_email');
      }
    } catch { /* ignore */ }
    setIsSubscribed(false);
    setCurrentEmail('');
    setUnsubscribedOk(true);
    setShowUnsubscribeForm(false);
    setStatus('idle');
    setTimeout(() => setUnsubscribedOk(false), 4000);
  }, [currentEmail]);

  const statusMessage = (() => {
    switch (status) {
      case 'success': return t('status-success');
      case 'duplicate': return t('status-duplicate');
      case 'invalid': return t('status-invalid');
      case 'error': return t('status-error');
      case 'submitting': return t('status-submitting');
      default: return '';
    }
  })();

  const isCompact = variant === 'inline';
  const isBanner = variant === 'banner';

  if (isSubscribed && !showUnsubscribeForm) {
    return (
      <div className={`rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4 sm:p-5 ${isBanner ? 'w-full' : ''}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-0.5">
                {t('subscribed-title')}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300/90 break-all">
                {t('subscribed-to')} <span className="font-mono text-[11px]">{currentEmail}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowUnsubscribeForm(true)}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors min-h-[36px]"
          >
            {t('unsubscribe')}
          </button>
        </div>
      </div>
    );
  }

  if (showUnsubscribeForm) {
    return (
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 p-4 sm:p-5">
        <div className="text-sm font-semibold text-rose-900 dark:text-rose-100 mb-2">
          {t('unsubscribe-confirm-title')}
        </div>
        <div className="text-xs text-rose-700 dark:text-rose-300/90 mb-3 break-all">
          {t('unsubscribe-confirm-to')} <span className="font-mono text-[11px]">{currentEmail}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleUnsubscribe}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors min-h-[40px]"
          >
            {t('unsubscribe-confirm')}
          </button>
          <button
            type="button"
            onClick={() => setShowUnsubscribeForm(false)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[40px]"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    );
  }

  if (unsubscribedOk) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
              {t('unsubscribed-title')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('unsubscribed-desc')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const containerClass = isCompact
    ? 'w-full'
    : isBanner
      ? 'w-full bg-gradient-to-br from-primary-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-primary-100 dark:border-gray-700 rounded-2xl p-5 sm:p-6'
      : 'card-base bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700';

  return (
    <div className={containerClass}>
      {!isCompact && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Mail className={`h-4 w-4 ${isBanner ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`} />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t('eyebrow')}
            </span>
          </div>
          <div className={`text-base sm:text-lg font-bold ${isBanner ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'} mb-1`}>
            {t('title')}
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${isBanner ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
            {t('description')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubscribe} className={isCompact ? 'space-y-2' : 'space-y-3'}>
        <div className={`flex ${isCompact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'} gap-2`}>
          <div className="flex-1 relative min-w-0">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="email"
              inputMode="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'invalid' || status === 'duplicate' || status === 'success' || status === 'error') {
                  setStatus('idle');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubscribe();
                }
              }}
              placeholder={t('placeholder')}
              aria-label={t('placeholder')}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white dark:bg-gray-900/50 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all min-h-[44px] ${
                status === 'invalid' || status === 'error'
                  ? 'border-rose-300 dark:border-rose-800/60 ring-2 ring-rose-100 dark:ring-rose-900/40 text-gray-900 dark:text-gray-100'
                  : status === 'success' || status === 'duplicate'
                    ? 'border-emerald-300 dark:border-emerald-800/60 ring-2 ring-emerald-100 dark:ring-emerald-900/40 text-gray-900 dark:text-gray-100'
                    : 'border-gray-200 dark:border-gray-700 focus:border-primary-300 dark:focus:border-primary-700 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/40 text-gray-900 dark:text-gray-100'
              }`}
              name="korelyy-newsletter-email"
              id="korelyy-newsletter-email"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary shrink-0 px-4 sm:px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all min-h-[44px] inline-flex items-center justify-center gap-1.5"
          >
            <span>{t('button')}</span>
            {status !== 'submitting' && !isCompact && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-500" />
            <span>{t('privacy-note')}</span>
          </div>
          {statusMessage && (
            <div
              className={`text-[11px] font-medium ${
                status === 'success' || status === 'duplicate'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : status === 'invalid' || status === 'error'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-gray-500 dark:text-gray-400'
              }`}
              role={status === 'success' || status === 'error' ? 'status' : undefined}
              aria-live={status === 'success' || status === 'error' ? 'polite' : undefined}
            >
              {statusMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
