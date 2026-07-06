'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { User, X, Save, Key, Globe, Calendar, ShieldCheck, AtSign, Award, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { saveLocale, SupportedLocale } from '@/lib/language-detection';
import { useLocaleSwitcher } from '@/lib/useLocaleSwitcher';

interface ProfilePanelProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_PW = 8;
const MAX_PW = 128;

function formatJoined(ts: number | undefined, locale: string): string {
  if (!ts) return '-';
  const d = new Date(ts * 1000);
  const loc = locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : locale === 'hi' ? 'hi-IN' : locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-SA' : 'en-US';
  try {
    return d.toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d.toLocaleDateString();
  }
}

export default function ProfilePanel({ locale, isOpen, onClose }: ProfilePanelProps) {
  const t = useTranslations('auth');
  const user = useAuthStore((s) => s.user);
  const lastError = useAuthStore((s) => s.lastError);
  const lastInfo = useAuthStore((s) => s.lastInfo);
  const setLastInfo = useAuthStore((s) => s.setLastInfo);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);
  const { switchLocale } = useLocaleSwitcher();

  const [name, setName] = useState('');
  const [selLocale, setSelLocale] = useState<string>(locale);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedFlash, setProfileSavedFlash] = useState(false);

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwChangedFlash, setPwChangedFlash] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user?.display_name ?? '');
      setSelLocale(user?.locale ?? locale);
      setOldPw('');
      setNewPw('');
      setNewPw2('');
      setSavingProfile(false);
      setChangingPw(false);
      setProfileSavedFlash(false);
      setPwChangedFlash(false);
      setLastInfo(null);
      useAuthStore.setState({ lastError: null });
    }
  }, [isOpen, user, locale, setLastInfo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (profileSavedFlash) {
      const t = setTimeout(() => setProfileSavedFlash(false), 1800);
      return () => clearTimeout(t);
    }
  }, [profileSavedFlash]);

  useEffect(() => {
    if (pwChangedFlash) {
      const t = setTimeout(() => setPwChangedFlash(false), 1800);
      return () => clearTimeout(t);
    }
  }, [pwChangedFlash]);

  const canSaveProfile =
    (name.trim() !== (user?.display_name ?? '').trim()) ||
    (selLocale !== (user?.locale ?? locale));

  const handleSaveProfile = async () => {
    if (savingProfile || !canSaveProfile) return;
    setSavingProfile(true);
    try {
      useAuthStore.setState({ lastError: null, lastInfo: null });
      const payload: { display_name?: string; locale?: string } = {};
      if (name.trim() !== (user?.display_name ?? '').trim()) {
        payload.display_name = name.trim();
      }
      if (selLocale !== (user?.locale ?? locale)) {
        payload.locale = selLocale as SupportedLocale;
      }
      const r = await updateProfile(payload);
      if (r.ok) {
        setProfileSavedFlash(true);
        if (payload.locale && payload.locale !== locale) {
          saveLocale(payload.locale as SupportedLocale);
          switchLocale(payload.locale as SupportedLocale);
        }
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const pwMismatch = newPw2.length > 0 && newPw !== newPw2;
  const canChangePw =
    oldPw.length > 0 &&
    newPw.length >= MIN_PW &&
    newPw.length <= MAX_PW &&
    newPw === newPw2;

  const handleChangePw = async () => {
    if (changingPw || !canChangePw) return;
    setChangingPw(true);
    try {
      useAuthStore.setState({ lastError: null, lastInfo: null });
      const r = await changePassword(oldPw, newPw);
      if (r.ok) {
        setPwChangedFlash(true);
        setOldPw('');
        setNewPw('');
        setNewPw2('');
      }
    } finally {
      setChangingPw(false);
    }
  };

  const errorKey = (k: string | null): string => {
    if (!k) return '';
    const stripped = k.startsWith('auth:') ? k.slice(5) : k;
    try {
      const tr = t(stripped);
      if (tr && tr !== stripped) return tr;
    } catch { /* ignore */ }
    return stripped;
  };

  const infoKey = (k: string | null): string => {
    if (!k) return '';
    const stripped = k.startsWith('auth:') ? k.slice(5) : k;
    try {
      const tr = t(stripped);
      if (tr && tr !== stripped) return tr;
    } catch { /* ignore */ }
    return stripped;
  };

  const providerKey = user?.auth_provider === 'google' ? 'provider-google' : 'provider-email';

  const planBadge = user?.plan === 'pro' ? t('badge-pro') : t('badge-free');
  const planBadgeColor =
    user?.plan === 'pro'
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';

  const localeOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const flashStyle =
    'absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full px-2 py-1 text-[10px] rounded-md bg-emerald-500 text-white whitespace-nowrap shadow-md animate-[fadeIn_.15s_ease-out]';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-20 left-3 right-3 sm:left-auto sm:right-4 lg:right-8 w-auto sm:w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 transform ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        } max-h-[80vh] flex flex-col`}
        ref={panelRef}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {t('profile-title')}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('profile-subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={t('profile-close')}
            title={t('profile-close')}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto [scrollbar-width:thin] space-y-5">
          <div className="flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 border border-indigo-100 dark:border-indigo-900/40">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-md">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full inline-flex items-center justify-center bg-gradient-to-br from-primary-400 to-indigo-500 text-white text-xl sm:text-2xl font-bold">
                  {(user?.display_name || user?.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                  {user?.display_name || user?.email?.split('@')[0] || '-'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${planBadgeColor} shrink-0`}>
                  {planBadge}
                </span>
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5">
                <AtSign className="w-3 h-3 opacity-60" />
                <span>{user?.email || '-'}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('profile-section-basic')}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {t('profile-name-label')}
                </label>
                <input
                  type="text"
                  value={name}
                  maxLength={64}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('profile-name-placeholder')}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                  <AtSign className="w-3 h-3 opacity-60" />
                  {t('profile-email-label')}
                </label>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3.5 py-2.5 text-sm text-gray-600 dark:text-gray-300 cursor-not-allowed select-none">
                  {user?.email || '-'}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 opacity-60" />
                  {t('profile-language-label')}
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {localeOptions.map((l) => {
                    const active = selLocale === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setSelLocale(l.code)}
                        className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs transition-colors ${
                          active
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 border border-gray-200 dark:border-gray-700'
                        }`}
                        title={l.name}
                      >
                        <span className="text-base leading-none">{l.flag}</span>
                        <span className="text-[10px] font-medium leading-none mt-0.5">{l.code === 'zh' ? '中' : l.code === 'en' ? 'EN' : l.code === 'es' ? 'ES' : l.code === 'hi' ? 'हिं' : l.code === 'fr' ? 'FR' : 'ع'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 opacity-60" />
                    {t('profile-provider-label')}
                  </label>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs text-gray-700 dark:text-gray-200">
                    {t(providerKey)}
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <Award className="w-3 h-3 opacity-60" />
                    {t('profile-plan-label')}
                  </label>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs">
                    <span className={`font-semibold ${planBadgeColor.replace('bg-', 'text-').replace('dark:', 'dark:').replace('/30', '').replace('/40', '')} bg-transparent`}>
                      {planBadge}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 opacity-60" />
                  {t('profile-joined-label')}
                </label>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs text-gray-700 dark:text-gray-200">
                  {formatJoined(user?.created_at, locale)}
                </div>
              </div>

              <div className="relative pt-1">
                <button
                  type="button"
                  disabled={!canSaveProfile || savingProfile}
                  onClick={handleSaveProfile}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-900/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
                >
                  {savingProfile ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingProfile ? t('profile-saving') : t('profile-save')}</span>
                </button>
                {profileSavedFlash && (
                  <div className={flashStyle}>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('profile-saved-tip')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Key className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('profile-section-security')}
              </h3>
            </div>

            {user?.auth_provider !== 'email' ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/20 px-3.5 py-3 text-xs text-amber-800 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />
                  <span>
                    {t('err-wrong-provider')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('profile-old-pw-label')}
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={oldPw}
                      onChange={(e) => setOldPw(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld((v) => !v)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-r-xl transition-colors"
                    >
                      {showOld ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('profile-new-pw-label')}
                    <span className="ml-2 text-[11px] font-normal text-gray-400 tabular-nums">
                      {newPw.length}/{MAX_PW}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder={t('profile-new-pw-placeholder')}
                      className={`w-full rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors ${
                        newPw.length > 0 && (newPw.length < MIN_PW || newPw.length > MAX_PW)
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
                          : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-r-xl transition-colors"
                    >
                      {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('password-confirm-label')}
                  </label>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPw2}
                    onChange={(e) => setNewPw2(e.target.value)}
                    placeholder={t('password-confirm-placeholder')}
                    className={`w-full rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors ${
                      pwMismatch
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
                        : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400'
                    }`}
                  />
                  {pwMismatch && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      {t('err-passwords-mismatch')}
                    </p>
                  )}
                </div>

                <div className="relative pt-1">
                  <button
                    type="button"
                    disabled={!canChangePw || changingPw}
                    onClick={handleChangePw}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-900/10 focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-colors"
                  >
                    {changingPw ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    <span>{changingPw ? t('profile-changing-pw') : t('profile-change-pw')}</span>
                  </button>
                  {pwChangedFlash && (
                    <div className={flashStyle}>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('profile-saved-tip')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(lastError || lastInfo) && (
            <div className="pt-2 space-y-2">
              {lastInfo && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200 animate-[fadeIn_.15s_ease-out]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{infoKey(lastInfo)}</span>
                  </div>
                </div>
              )}
              {lastError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-200 animate-[fadeIn_.15s_ease-out]">
                  <div className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <span>{errorKey(lastError)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
