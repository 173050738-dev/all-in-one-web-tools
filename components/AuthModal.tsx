'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, Loader2, User } from 'lucide-react';
import { useAuthStore, type AuthMode } from '@/stores/auth';

export default function AuthModal() {
  const t = useTranslations('auth');
  const tG = useTranslations();
  const { modalOpen, modalMode, setModal, setMode, login, register, status, lastError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [locale, setLocale] = useState<'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar'>('en');

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Detect locale for registration payload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    const code = m?.[1] as string | undefined;
    const supported: ReadonlyArray<'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar'> = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];
    type LocaleKey = typeof supported[number];
    const isLocale = (x: string | undefined): x is LocaleKey => !!x && (supported as ReadonlyArray<string>).includes(x);
    setLocale(isLocale(code) ? code : 'en');
  }, [modalOpen]);

  // Reset state on open
  useEffect(() => {
    if (modalOpen) {
      setEmail('');
      setPassword('');
      setShowPw(false);
      setEmailErr(null);
      setPwErr(null);
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [modalOpen, modalMode]);

  // ESC to close + lock body scroll
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [modalOpen, setModal]);

  const validateEmail = (v: string): string | null => {
    if (!v.trim()) return t('err-invalid-email');
    const re = /^[^\s@"(),:;<>[\]\\]+@[^\s@"(),:;<>[\]\\]+\.[^\s@"(),:;<>[\]\\]{2,}$/;
    if (!re.test(v.trim())) return t('err-invalid-email');
    return null;
  };

  const validatePw = (v: string, mode: AuthMode): string | null => {
    if (!v) return t('err-password-short');
    if (v.length < 8) return t('err-password-short');
    if (mode === 'register' && v.length > 128) return t('err-password-long');
    return null;
  };

  const submitting = status === 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ee = validateEmail(email);
    const pe = validatePw(password, modalMode);
    setEmailErr(ee);
    setPwErr(pe);
    if (ee || pe) return;
    if (modalMode === 'login') {
      await login({ email: email.trim(), password });
    } else {
      await register({ email: email.trim(), password, locale });
    }
  };

  const handleGoogle = async () => {
    // Stub — OAuth flow configured via backend env.GOOGLE_OAUTH_CLIENT_ID
    // Friendly hint until credentials are provisioned
    try {
      await login({ email: '__google_stub__', password: 'ignored' });
    } catch {
      /* error handled via store lastError */
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setModal(false);
  };

  if (!modalOpen) return null;

  const isLogin = modalMode === 'login';
  // lastError format from store: 'auth:err-xxx' → strip prefix when looking up in auth namespace
  let errMsg: string | null = null;
  if (lastError) {
    const key = lastError.startsWith('auth:') ? lastError.slice(5) : lastError;
    errMsg = t.has(key) ? t(key) : (tG.has(lastError) ? tG(lastError) : lastError);
  }
  const rtl = locale === 'ar';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm animate-in fade-in duration-150"
      dir={rtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-[440px] max-h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700/60 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
      >
        {/* Blob deco */}
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-primary-100/60 dark:bg-primary-900/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-cyan-100/50 dark:bg-cyan-900/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div id="auth-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {isLogin ? t('login') : t('register')}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                Korelyy Tools
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label={t('close-aria')}
            onClick={() => setModal(false)}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 active:scale-95 transition-all min-h-[44px]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="relative px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 max-h-[calc(92vh-104px)] overflow-y-auto scroll-smooth"
          noValidate
        >
          {/* Tab toggle */}
          <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-700/60 p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all min-h-[40px] ${
                  modalMode === m
                    ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t(m)}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 px-0.5">
                {t('email-label')}
              </label>
              <div className="relative">
                <Mail className={`absolute ${rtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`} />
                <input
                  id="auth-email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(validateEmail(e.target.value)); }}
                  onBlur={() => setEmailErr(validateEmail(email))}
                  placeholder={t('email-placeholder')}
                  aria-invalid={!!emailErr}
                  aria-describedby={emailErr ? 'auth-email-err' : undefined}
                  className={`w-full ${rtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-3 rounded-xl border bg-white dark:bg-gray-900/50 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all min-h-[48px] ${
                    emailErr
                      ? 'border-rose-300 dark:border-rose-800/60 ring-2 ring-rose-100 dark:ring-rose-900/40'
                      : 'border-gray-200 dark:border-gray-700 focus:border-primary-300 dark:focus:border-primary-700 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/40'
                  } text-gray-900 dark:text-gray-100`}
                  name="korelyy-auth-email"
                />
              </div>
              {emailErr && (
                <p id="auth-email-err" className="mt-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 px-0.5">
                  {emailErr}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="auth-pw" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 px-0.5">
                {t('password-label')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${rtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`} />
                <input
                  id="auth-pw"
                  type={showPw ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (pwErr) setPwErr(validatePw(e.target.value, modalMode)); }}
                  onBlur={() => setPwErr(validatePw(password, modalMode))}
                  placeholder={t('password-placeholder')}
                  aria-invalid={!!pwErr}
                  aria-describedby={pwErr ? 'auth-pw-err' : undefined}
                  className={`w-full ${rtl ? 'pr-9 pl-12' : 'pl-9 pr-12'} py-3 rounded-xl border bg-white dark:bg-gray-900/50 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all min-h-[48px] ${
                    pwErr
                      ? 'border-rose-300 dark:border-rose-800/60 ring-2 ring-rose-100 dark:ring-rose-900/40'
                      : 'border-gray-200 dark:border-gray-700 focus:border-primary-300 dark:focus:border-primary-700 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/40'
                  } text-gray-900 dark:text-gray-100`}
                  name="korelyy-auth-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className={`absolute ${rtl ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 min-h-[36px]`}
                >
                  {showPw ? '•••' : 'ABC'}
                </button>
              </div>
              {pwErr ? (
                <p id="auth-pw-err" className="mt-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 px-0.5">
                  {pwErr}
                </p>
              ) : modalMode === 'register' ? (
                <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 px-0.5 leading-relaxed">
                  {t('password-hint')}
                </p>
              ) : null}
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline min-h-[28px] px-1"
                  onClick={() => { /* TODO: password reset flow */ }}
                >
                  {t('forgot-password')}
                </button>
              </div>
            )}

            {/* Server error */}
            {errMsg && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-900/15 border border-rose-200/70 dark:border-rose-800/40 px-3 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-300 leading-relaxed">
                {errMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-md shadow-primary-600/15 transition-all min-h-[48px]"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isLogin ? t('submit-login') : t('submit-register')}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div aria-hidden className="flex-1 h-px bg-gray-200 dark:bg-gray-700/70" />
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {t('or-continue-with')}
              </span>
              <div aria-hidden className="flex-1 h-px bg-gray-200 dark:bg-gray-700/70" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-100 text-sm font-semibold transition-all min-h-[48px]"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.63 32.833 29.22 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.64-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.231-2.231 4.156-4.083 5.57l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.64-.389-3.917z"/>
              </svg>
              <span>{t('google-login')}</span>
            </button>

            {/* Mode switch */}
            <div className="pt-1 text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <button
                type="button"
                onClick={() => setMode(isLogin ? 'register' : 'login')}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline min-h-[28px] px-1"
              >
                {t(isLogin ? 'switch-to-register' : 'switch-to-login')}
              </button>
            </div>

            {/* Legal + guest note */}
            <div className="pt-1 space-y-2">
              <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 text-center">
                {isLogin ? t('guest-note') : t('legal-note')}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
