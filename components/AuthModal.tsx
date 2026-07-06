'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore, type AuthMode } from '@/stores/auth';

declare global {
  interface Window {
    google?: any;
    __GOOGLE_GIS_LOADED__?: boolean;
  }
}

const MIN_PW = 8;
const MAX_PW = 128;

type Strength = { score: number; label: string; class: string };
type TFunc = (key: string) => string;

const passStrength = (raw: string): Strength => {
  const p = raw ?? '';
  if (!p) return { score: 0, label: 'pw-empty', class: 'bg-transparent' };
  let score = 0;
  if (p.length >= MIN_PW) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (p.length >= MAX_PW) score = Math.max(score, 4);
  const bars = [
    'bg-slate-700 dark:bg-slate-300',
    'bg-rose-500 dark:bg-rose-400',
    'bg-amber-500 dark:bg-amber-400',
    'bg-lime-500 dark:bg-lime-400',
    'bg-emerald-600 dark:bg-emerald-400',
  ];
  const labels = ['pw-empty', 'pw-weak', 'pw-fair', 'pw-good', 'pw-strong'];
  const idx = Math.max(0, Math.min(4, score));
  return { score: idx, label: labels[idx], class: bars[idx] };
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const looksGoodEmail = (v: string) => emailRe.test(v.trim());

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
  '295450124455-7bd26j2t8255e4qk4d8f61qk6r7l8t4c.apps.googleusercontent.com';

const FEATURE_GOOGLE_LOGIN =
  process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === '1' ||
  process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === 'true';

const useGoogleGIS = (onCredential: (credential: string) => void) => {
  const [gisReady, setGisReady] = useState<boolean>(
    typeof window !== 'undefined' && !!window.google?.accounts?.id,
  );
  const btnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const setup = () => {
      if (cancelled) return;
      const accounts = window.google?.accounts;
      if (!accounts?.id) return;
      accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp: { credential?: string }) => {
          if (resp?.credential) onCredential(resp.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      setGisReady(true);
      if (btnRef.current) {
        accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          logo_alignment: 'center',
          text: 'continue_with',
          shape: 'rectangular',
        });
      }
    };
    const tryLoad = () => {
      if (window.google?.accounts?.id) {
        setup();
        return;
      }
      if (!document.querySelector('script#google-gis-sdk')) {
        const s = document.createElement('script');
        s.id = 'google-gis-sdk';
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        s.referrerPolicy = 'strict-origin-when-cross-origin';
        s.onload = () => {
          window.__GOOGLE_GIS_LOADED__ = true;
          setup();
        };
        s.onerror = () => {
          if (!cancelled) setGisReady(false);
        };
        document.head.appendChild(s);
      } else {
        const timer = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(timer);
            setup();
          }
        }, 120);
        setTimeout(() => clearInterval(timer), 5000);
      }
    };
    tryLoad();
    return () => {
      cancelled = true;
    };
  }, [onCredential]);

  useEffect(() => {
    if (gisReady && btnRef.current && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        logo_alignment: 'center',
        text: 'continue_with',
        shape: 'rectangular',
      });
    }
  }, [gisReady]);

  return { btnRef, gisReady };
};

const closeBtn = (onClose: () => void) => (
  <button
    aria-label="Close"
    onClick={onClose}
    className="absolute right-2.5 top-2.5 sm:right-3.5 sm:top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors z-20"
  >
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  </button>
);

const GoogleButton = ({
  onCredential,
  disabled,
  t,
}: {
  onCredential: (c: string) => void;
  disabled: boolean;
  t: TFunc;
}) => {
  const { btnRef, gisReady } = useGoogleGIS(onCredential);
  if (gisReady) {
    return (
      <div className={`w-full flex justify-center ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
        <div ref={btnRef} className="h-11 min-h-[44px]" />
      </div>
    );
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        try {
          const token = (window as any).__GOOGLE_FALLBACK_ID_TOKEN__;
          if (token) onCredential(token);
        } catch {}
      }}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span className="text-sm font-medium">{t('continue-google')}</span>
    </button>
  );
};

const EmailInput = ({
  value,
  onChange,
  label,
  placeholder,
  t,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
  t: TFunc;
  autoFocus?: boolean;
}) => {
  const bad = value.length > 0 && !looksGoodEmail(value);
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        {bad && <span className="text-rose-500">{t('err-invalid-email')}</span>}
      </span>
      <input
        type="email"
        autoFocus={autoFocus}
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors ${
          bad
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-slate-200 focus:border-indigo-500 dark:border-slate-700 dark:focus:border-indigo-400'
        }`}
      />
    </label>
  );
};

const PasswordInput = ({
  value,
  onChange,
  label,
  placeholder,
  t,
  autoFocus,
  showStrength,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
  t: TFunc;
  autoFocus?: boolean;
  showStrength?: boolean;
}) => {
  const [show, setShow] = useState(false);
  const s = passStrength(value);
  const showTooShort = value.length > 0 && value.length < MIN_PW;
  const showTooLong = value.length > MAX_PW;
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span className="text-slate-400 text-[11px] font-normal tabular-nums">
          {value.length}/{MAX_PW}
          {showTooShort && <span className="ml-2 text-rose-500">{t('err-password-short')}</span>}
          {showTooLong && <span className="ml-2 text-rose-500">{t('err-password-long')}</span>}
        </span>
      </span>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          autoFocus={autoFocus}
          autoComplete="current-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors ${
            showTooShort || showTooLong
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-200 focus:border-indigo-500 dark:border-slate-700 dark:focus:border-indigo-400'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          aria-label={show ? t('pw-hide') : t('pw-show')}
          className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-r-xl transition-colors"
        >
          {show ? (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          )}
        </button>
      </div>
      {showStrength && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-full rounded-full transition-colors ${i < s.score ? s.class : 'bg-slate-100 dark:bg-slate-800'}`}
              />
            ))}
          </div>
          <span
            className={`text-[11px] font-medium min-w-[52px] text-right ${value.length === 0 ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}
          >
            {t(s.label)}
          </span>
        </div>
      )}
    </label>
  );
};

const divider = (label: string) => (
  <div className="relative my-2">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200 dark:border-slate-700" />
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="bg-white dark:bg-slate-950 px-3 text-slate-400">{label}</span>
    </div>
  </div>
);

const translateErrorOrInfoKey = (k: string): string => {
  if (k.startsWith('auth:')) return k.slice(5);
  return k;
};

const errorOrInfo = (err: string | null, info: string | null, t: TFunc) => {
  if (err) {
    const key = translateErrorOrInfoKey(err);
    const text = (() => {
      try { return t(key); } catch { return key; }
    })();
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-200 animate-[fadeIn_.15s_ease-out]">
        <div className="flex items-start gap-2">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <span>{text}</span>
        </div>
      </div>
    );
  }
  if (info) {
    const key = translateErrorOrInfoKey(info);
    const text = (() => {
      try { return t(key); } catch { return key; }
    })();
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200 animate-[fadeIn_.15s_ease-out]">
        <div className="flex items-start gap-2">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{text}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AuthModal() {
  const t = useTranslations('auth');
  const locale = useLocale() || 'en';

  const modalOpen = useAuthStore((s) => s.modalOpen);
  const modalMode = useAuthStore((s) => s.modalMode);
  const setModal = useAuthStore((s) => s.setModal);
  const setMode = useAuthStore((s) => s.setMode);
  const setResetToken = useAuthStore((s) => s.setResetToken);
  const lastError = useAuthStore((s) => s.lastError);
  const lastInfo = useAuthStore((s) => s.lastInfo);
  const setLastInfo = useAuthStore((s) => s.setLastInfo);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loginGoogle = useAuthStore((s) => s.loginGoogle);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const status = useAuthStore((s) => s.status);
  const resetToken = useAuthStore((s) => s.resetToken);
  const resetExpiresIn = useAuthStore((s) => s.resetExpiresIn);

  const loading = status === 'loading';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [resetPw, setResetPw] = useState('');
  const [resetPw2, setResetPw2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!modalOpen) {
      setEmail('');
      setPassword('');
      setPassword2('');
      setResetPw('');
      setResetPw2('');
      setSubmitting(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) setModal(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modalOpen, setModal]);

  const close = useCallback(() => setModal(false), [setModal]);

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await loginGoogle(credential, locale);
      } finally {
        setSubmitting(false);
      }
    },
    [loginGoogle, locale, submitting],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitting) return;
    const em = email.trim();

    if (modalMode === 'login') {
      if (!looksGoodEmail(em)) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-invalid-email' });
        return;
      }
      if (password.length < MIN_PW || password.length > MAX_PW) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-password-short' });
        return;
      }
      setSubmitting(true);
      try {
        await login({ email: em, password });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (modalMode === 'register') {
      if (!looksGoodEmail(em)) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-invalid-email' });
        return;
      }
      if (password.length < MIN_PW || password.length > MAX_PW) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-password-short' });
        return;
      }
      if (password !== password2) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-passwords-mismatch' });
        return;
      }
      setSubmitting(true);
      try {
        await register({ email: em, password, locale });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (modalMode === 'forgot') {
      if (!looksGoodEmail(em)) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-invalid-email' });
        return;
      }
      setSubmitting(true);
      try {
        const r = await forgotPassword(em);
        if (r.ok) {
          const storeResetToken = useAuthStore.getState().resetToken;
          if (storeResetToken) {
            setResetPw('');
            setResetPw2('');
            setMode('reset');
          }
        }
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (modalMode === 'reset') {
      if (!resetToken) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-reset-missing-token' });
        return;
      }
      if (resetPw.length < MIN_PW || resetPw.length > MAX_PW) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-password-short' });
        return;
      }
      if (resetPw !== resetPw2) {
        setLastInfo(null);
        useAuthStore.setState({ lastError: 'auth:err-passwords-mismatch' });
        return;
      }
      setSubmitting(true);
      try {
        const r = await resetPassword(resetToken, resetPw);
        if (r.ok) {
          setResetToken(null);
        }
      } finally {
        setSubmitting(false);
      }
      return;
    }
  };

  const busy = loading || submitting;

  const head = (() => {
    switch (modalMode) {
      case 'login': return { title: t('sign-in'), sub: t('sign-in-sub') };
      case 'register': return { title: t('create-account'), sub: t('create-account-sub') };
      case 'forgot': return { title: t('forgot-password'), sub: t('forgot-password-sub') };
      case 'reset': return { title: t('reset-password'), sub: t('reset-password-sub') };
      default: return { title: t('sign-in'), sub: t('sign-in-sub') };
    }
  })();

  return (
    <>
      <style jsx global>{`
        @keyframes authFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes authPopIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        aria-hidden={!modalOpen}
        data-panel="header_auth"
        className={`fixed inset-0 z-[9998] items-center justify-center px-3 sm:px-4 md:px-6 ${modalOpen ? 'flex' : 'hidden'}`}
      >
        <div
          onClick={close}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[authFadeIn_.18s_ease-out]"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="relative z-10 w-full max-w-[400px] sm:max-w-md md:max-w-lg rounded-xl sm:rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-black/5 animate-[authPopIn_.2s_ease-out] overflow-hidden max-h-[92svh]"
        >
          {closeBtn(close)}
          <div className="overflow-y-auto overflow-x-hidden max-h-[92svh] [scrollbar-width:thin]">
          <div className="px-5 pt-5 pb-2 sm:px-7 sm:pt-7 md:px-8 md:pt-8">
            <h2 id="auth-modal-title" className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              {head.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{head.sub}</p>
          </div>

          <form onSubmit={onSubmit} className="px-5 py-4 space-y-3 sm:px-7 sm:py-5 sm:space-y-4 md:px-8 md:py-6" noValidate>
            {(modalMode === 'login' || modalMode === 'register') && FEATURE_GOOGLE_LOGIN && (
              <>
                <div className="space-y-4 pb-1">
                  <GoogleButton onCredential={handleGoogleCredential} disabled={busy} t={t} />
                </div>
                {divider(t('or-email'))}
              </>
            )}

            {(modalMode === 'login' || modalMode === 'register' || modalMode === 'forgot') && (
              <EmailInput
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (lastError) useAuthStore.setState({ lastError: null });
                }}
                label={t('email-label')}
                placeholder={t('email-placeholder')}
                t={t}
                autoFocus
              />
            )}

            {(modalMode === 'login' || modalMode === 'register') && (
              <PasswordInput
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  if (lastError) useAuthStore.setState({ lastError: null });
                }}
                label={t('password-label')}
                placeholder={t('password-placeholder')}
                t={t}
                showStrength={modalMode === 'register'}
              />
            )}

            {modalMode === 'register' && (
              <PasswordInput
                value={password2}
                onChange={(v) => {
                  setPassword2(v);
                  if (lastError) useAuthStore.setState({ lastError: null });
                }}
                label={t('password-confirm-label')}
                placeholder={t('password-confirm-placeholder')}
                t={t}
              />
            )}

            {modalMode === 'reset' && (
              <div className="space-y-4">
                {resetToken && (
                  <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2.5 text-sm text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800/60 dark:text-indigo-200">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>
                        {t('reset-token-ready')}
                        {resetExpiresIn != null && (
                          <span className="ml-1 opacity-80">
                            ({Math.ceil(resetExpiresIn / 60)}{t('reset-expires-min')})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
                <PasswordInput
                  value={resetPw}
                  onChange={(v) => {
                    setResetPw(v);
                    if (lastError) useAuthStore.setState({ lastError: null });
                  }}
                  label={t('password-label')}
                  placeholder={t('password-placeholder')}
                  t={t}
                  showStrength
                  autoFocus
                />
                <PasswordInput
                  value={resetPw2}
                  onChange={(v) => {
                    setResetPw2(v);
                    if (lastError) useAuthStore.setState({ lastError: null });
                  }}
                  label={t('password-confirm-label')}
                  placeholder={t('password-confirm-placeholder')}
                  t={t}
                />
              </div>
            )}

            {modalMode === 'login' && (
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    useAuthStore.setState({ lastError: null, lastInfo: null });
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  {t('forgot-password')}
                </button>
              </div>
            )}

            {errorOrInfo(lastError, lastInfo, t)}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {busy && (
                <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              <span>
                {modalMode === 'login' && t('sign-in')}
                {modalMode === 'register' && t('create-account')}
                {modalMode === 'forgot' && t('send-reset-link')}
                {modalMode === 'reset' && t('update-password')}
              </span>
            </button>

            <div className="pt-1 text-center text-sm text-slate-500 dark:text-slate-400">
              {modalMode === 'login' && (
                <span>
                  {t('no-account')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    {t('create-account')}
                  </button>
                </span>
              )}
              {modalMode === 'register' && (
                <span>
                  {t('has-account')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    {t('sign-in')}
                  </button>
                </span>
              )}
              {modalMode === 'forgot' && (
                <span>
                  {t('remember-password')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      useAuthStore.setState({ lastInfo: null });
                    }}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    {t('sign-in')}
                  </button>
                </span>
              )}
              {modalMode === 'reset' && (
                <span>
                  {t('need-new-token')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setResetToken(null);
                      setMode('forgot');
                      useAuthStore.setState({ lastInfo: null, lastError: null });
                    }}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    {t('request-another')}
                  </button>
                </span>
              )}
            </div>
          </form>

          <div className="px-5 pb-5 pt-0 sm:px-7 sm:pb-6 md:px-8 border-t border-slate-100 dark:border-slate-800/60">
            <p className="mt-3 sm:mt-4 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
              {t('footer-legal')}
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
