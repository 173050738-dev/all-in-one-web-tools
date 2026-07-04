'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Crown, Lock, Unlock, X, FileText } from 'lucide-react';
import {
  buildKofiUrl,
  getToolUnlockSpec,
  KOFI_TIERS,
  type KofiTierId,
} from '@/lib/monetization';

type Props = {
  slug: string;
  locale: string;
  variant?: 'top' | 'bottom' | 'export';
};

const CLOSE_KEY_PREFIX = 'kofi-banner-closed:';
const CLOSE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const MEMBER_KEY = 'kofi-member';
const ACTIVATE_CODE_REGEX = /^KOFI-[A-Z0-9]{6,12}$/;

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-50 min-h-[44px] touch-manipulation';

function useIsClosed(slug: string): [boolean, () => void] {
  const key = `${CLOSE_KEY_PREFIX}${slug}`;
  const [closed, setClosed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return false;
      const until = Number(raw) || 0;
      return Date.now() < until;
    } catch {
      return false;
    }
  });

  const close = () => {
    setClosed(true);
    try {
      window.localStorage.setItem(key, String(Date.now() + CLOSE_DURATION_MS));
    } catch {
      /* ignore */
    }
  };

  return [closed, close];
}

interface KofiMember {
  tx?: string;
  tier: string;
  createdAt: number;
  expiresAt: number;
}

function useKofiTxUnlock(txWelcome: string, txInvalid: string) {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tx = params.get('tx');
    const tier = params.get('tier');
    if (tx && tier) {
      try {
        const member: KofiMember = {
          tx,
          tier,
          createdAt: Date.now(),
          expiresAt: Date.now() + 30 * 86400 * 1000,
        };
        window.localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
        window.history.replaceState({}, '', window.location.pathname);
        setToast(txWelcome);
        const id = setTimeout(() => setToast(null), 2000);
        return () => clearTimeout(id);
      } catch {
        setToast(txInvalid);
        const id = setTimeout(() => setToast(null), 2000);
        return () => clearTimeout(id);
      }
    }
  }, [txWelcome, txInvalid]);
  return toast;
}

interface KofiMemberState {
  isMember: boolean;
  tier: string;
  expiresAt: number;
  remainingDays: number;
}

function useKofiMember(): KofiMemberState {
  const read = (): KofiMemberState => {
    if (typeof window === 'undefined') {
      return { isMember: false, tier: '', expiresAt: 0, remainingDays: 0 };
    }
    try {
      const raw = window.localStorage.getItem(MEMBER_KEY);
      if (!raw) return { isMember: false, tier: '', expiresAt: 0, remainingDays: 0 };
      const parsed: KofiMember = JSON.parse(raw);
      if (!parsed || !parsed.expiresAt || Date.now() >= parsed.expiresAt) {
        try { window.localStorage.removeItem(MEMBER_KEY); } catch { /* ignore */ }
        return { isMember: false, tier: '', expiresAt: 0, remainingDays: 0 };
      }
      const remainingDays = Math.max(1, Math.ceil((parsed.expiresAt - Date.now()) / 86400 / 1000));
      return { isMember: true, tier: parsed.tier || '', expiresAt: parsed.expiresAt, remainingDays };
    } catch {
      return { isMember: false, tier: '', expiresAt: 0, remainingDays: 0 };
    }
  };
  const [state, setState] = useState<KofiMemberState>(read);
  useEffect(() => {
    setState(read());
    const id = setInterval(() => setState(read()), 60000);
    return () => clearInterval(id);
  }, []);
  return state;
}

type KofiKeys = {
  supportUs: string;
  closeAria: string;
  getStarted: string;
  or: string;
  learnMore: string;
  perMonth: string;
  oneTime: string;
  team: string;
  includes: string;
  activateCode: string;
  activatePlaceholder: string;
  activateSubmit: string;
  activateSuccess: string;
  activateFail: string;
  memberBadge: string;
  memberExpires: string;
  txWelcome: string;
  txInvalid: string;
  premiumContent: string;
  freeContent: string;
  exportPdf: string;
  printHint: string;
  backToCompare: string;
};

function i18n(locale: string): KofiKeys {
  const zh: KofiKeys = {
    supportUs: '支持 Korelyy 继续维护免费工具',
    closeAria: '关闭解锁横幅（7 天内不再显示）',
    getStarted: '立即解锁',
    or: '或',
    learnMore: '了解 Ko-fi',
    perMonth: '每月',
    oneTime: '一次性',
    team: '团队授权',
    includes: '包含',
    activateCode: '输入激活码',
    activatePlaceholder: '粘贴激活码（如 KOFI-XXXX）',
    activateSubmit: '激活',
    activateSuccess: '激活成功！感谢支持 ❤️',
    activateFail: '激活码无效，请检查或通过下方按钮解锁',
    memberBadge: '支持者会员',
    memberExpires: '有效期至 {date}',
    txWelcome: '欢迎，打赏成功！已解锁所有高级内容 🎉',
    txInvalid: '打赏校验失败，请手动输入激活码或重新支付',
    premiumContent: '解锁高级内容',
    freeContent: '当前免费功能',
    exportPdf: '导出 PDF 报告',
    printHint: '会员：无水印高清版 / 游客：带水印 30 秒试用版',
    backToCompare: '返回对比',
  };
  const en: KofiKeys = {
    supportUs: 'Support Korelyy & keep free tools alive',
    closeAria: 'Dismiss unlock banner (hidden for 7 days)',
    getStarted: 'Unlock now',
    or: 'or',
    learnMore: 'Visit Ko-fi',
    perMonth: 'per month',
    oneTime: 'one-time',
    team: 'Team seat',
    includes: 'Includes',
    activateCode: 'Enter activation code',
    activatePlaceholder: 'Paste code (e.g. KOFI-XXXX)',
    activateSubmit: 'Activate',
    activateSuccess: 'Activated! Thanks for your support ❤️',
    activateFail: 'Invalid code, please check or unlock via the buttons below',
    memberBadge: 'Supporter Member',
    memberExpires: 'Valid until {date}',
    txWelcome: 'Welcome! Payment successful — all premium content unlocked 🎉',
    txInvalid: 'Payment verification failed, please enter a code manually or re-pay',
    premiumContent: 'Premium Unlocked',
    freeContent: 'Free Features',
    exportPdf: 'Export PDF Report',
    printHint: 'Members: watermark-free HD / Guests: 30s trial with watermark',
    backToCompare: 'Back to Compare',
  };
  const hi: KofiKeys = {
    supportUs: 'Korelyy को मुफ्त टूल्स बनाए रखने में सहयोग करें',
    closeAria: 'अनलॉक बैनर बंद करें (7 दिनों के लिए छिपा रहेगा)',
    getStarted: 'अभी अनलॉक करें',
    or: 'या',
    learnMore: 'Ko-fi पर जाएँ',
    perMonth: 'प्रति माह',
    oneTime: 'एक बार',
    team: 'टीम लाइसेंस',
    includes: 'शामिल हैं',
    activateCode: 'सक्रियण कोड दर्ज करें',
    activatePlaceholder: 'कोड पेस्ट करें (जैसे KOFI-XXXX)',
    activateSubmit: 'सक्रिय करें',
    activateSuccess: 'सक्रिय सफल! आपके समर्थन के लिए धन्यवाद ❤️',
    activateFail: 'अमान्य कोड, कृपया जाँचें या नीचे दिए गए बटन से अनलॉक करें',
    memberBadge: 'समर्थक सदस्य',
    memberExpires: 'तक वैध {date}',
    txWelcome: 'स्वागत है! भुगतान सफल — सभी प्रीमियम सामग्री अनलॉक 🎉',
    txInvalid: 'भुगतान सत्यापन विफल, कृपया मैन्युअली कोड दर्ज करें या पुनः भुगतान करें',
    premiumContent: 'प्रीमियम अनलॉक',
    freeContent: 'निःशुल्क सुविधाएँ',
    exportPdf: 'PDF रिपोर्ट निर्यात करें',
    printHint: 'सदस्य: बिना वॉटरमार्क HD / अतिथि: वॉटरमार्क सहित 30s परीक्षण',
    backToCompare: 'तुलना पर वापस जाएँ',
  };
  const fr: KofiKeys = {
    supportUs: 'Soutenez Korelyy et gardez les outils gratuits en ligne',
    closeAria: 'Fermer la bannière (cachée pendant 7 jours)',
    getStarted: 'Déverrouiller maintenant',
    or: 'ou',
    learnMore: 'Voir Ko-fi',
    perMonth: 'par mois',
    oneTime: 'paiement unique',
    team: 'Licence équipe',
    includes: 'Inclut',
    activateCode: 'Saisir le code d\'activation',
    activatePlaceholder: 'Coller le code (ex. KOFI-XXXX)',
    activateSubmit: 'Activer',
    activateSuccess: 'Activé ! Merci pour votre soutien ❤️',
    activateFail: 'Code invalide, merci de vérifier ou débloquer via les boutons ci-dessous',
    memberBadge: 'Membre Supporter',
    memberExpires: 'Valide jusqu\'au {date}',
    txWelcome: 'Bienvenue ! Paiement réussi — tout le contenu premium est déverrouillé 🎉',
    txInvalid: 'Échec de la vérification du paiement, saisissez un code manuellement ou repayez',
    premiumContent: 'Premium Débloqué',
    freeContent: 'Fonctionnalités gratuites',
    exportPdf: 'Exporter le rapport PDF',
    printHint: 'Membres : HD sans filigrane / Invités : essai 30s avec filigrane',
    backToCompare: 'Retour à la comparaison',
  };
  const es: KofiKeys = {
    supportUs: 'Apoya a Korelyy y mantén las herramientas gratuitas',
    closeAria: 'Cerrar banner (oculto por 7 días)',
    getStarted: 'Desbloquear ahora',
    or: 'o',
    learnMore: 'Visitar Ko-fi',
    perMonth: 'por mes',
    oneTime: 'pago único',
    team: 'Licencia por equipo',
    includes: 'Incluye',
    activateCode: 'Introducir código de activación',
    activatePlaceholder: 'Pega el código (ej. KOFI-XXXX)',
    activateSubmit: 'Activar',
    activateSuccess: '¡Activado! Gracias por tu apoyo ❤️',
    activateFail: 'Código inválido, por favor revisa o desbloquea con los botones de abajo',
    memberBadge: 'Miembro Seguidor',
    memberExpires: 'Válido hasta {date}',
    txWelcome: '¡Bienvenido! Pago exitoso — todo el contenido premium desbloqueado 🎉',
    txInvalid: 'Fallo en verificación de pago, introduce un código manualmente o paga de nuevo',
    premiumContent: 'Premium Desbloqueado',
    freeContent: 'Características gratuitas',
    exportPdf: 'Exportar informe PDF',
    printHint: 'Miembros: HD sin marca / Invitados: prueba 30s con marca de agua',
    backToCompare: 'Volver a Comparar',
  };
  const ar: KofiKeys = {
    supportUs: 'ادعم Korelyy للحفاظ على الأدوات المجانية',
    closeAria: 'إغلاق البانر (مخفي لمدة 7 أيام)',
    getStarted: 'افتح الآن',
    or: 'أو',
    learnMore: 'زيارة Ko-fi',
    perMonth: 'شهرياً',
    oneTime: 'دفعة واحدة',
    team: 'ترخيص الفريق',
    includes: 'يشمل',
    activateCode: 'أدخل رمز التفعيل',
    activatePlaceholder: 'الصق الرمز (مثل KOFI-XXXX)',
    activateSubmit: 'تفعيل',
    activateSuccess: 'تم التفعيل! شكراً لدعمك ❤️',
    activateFail: 'رمز غير صالح، يرجى التحقق أو الفتح عبر الأزرار أدناه',
    memberBadge: 'عضو داعم',
    memberExpires: 'صالح حتى {date}',
    txWelcome: 'أهلاً بك! نجاح الدفع — تم فتح جميع المحتويات المميزة 🎉',
    txInvalid: 'فشل التحقق من الدفع، يرجى إدخال رمز يدوياً أو إعادة الدفع',
    premiumContent: 'المحتوى المميز المفتوح',
    freeContent: 'الميزات المجانية',
    exportPdf: 'تصدير تقرير PDF',
    printHint: 'الأعضاء: وضوح عالي بدون علامة مائية / الضيوف: تجربة 30 ثانية مع علامة مائية',
    backToCompare: 'العودة للمقارنة',
  };
  if (locale === 'zh') return zh;
  if (locale === 'hi') return hi;
  if (locale === 'fr') return fr;
  if (locale === 'es') return es;
  if (locale === 'ar') return ar;
  return en;
}

function formatDate(ts: number, locale: string) {
  try {
    return new Date(ts).toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale);
  } catch {
    return new Date(ts).toISOString().slice(0, 10);
  }
}

export default function KofiUnlockBanner({ slug, locale, variant = 'top' }: Props) {
  const t = useMemo(() => i18n(locale), [locale]);
  const spec = useMemo(() => getToolUnlockSpec(slug, locale), [slug, locale]);
  const [topClosed, closeTop] = useIsClosed(`${slug}-top`);
  const member = useKofiMember();
  const txToast = useKofiTxUnlock(t.txWelcome, t.txInvalid);
  const [activateOpen, setActivateOpen] = useState(false);
  const [activateCode, setActivateCode] = useState('');
  const [activateToast, setActivateToast] = useState<string | null>(null);
  const [exportHintToast, setExportHintToast] = useState<string | null>(null);
  const isRTL = locale === 'ar';

  const monthly = buildKofiUrl('monthly', slug, locale);
  const lifetime = buildKofiUrl('one_time', slug, locale);

  const handleActivate = () => {
    const code = activateCode.trim().toUpperCase();
    if (ACTIVATE_CODE_REGEX.test(code)) {
      try {
        const m: KofiMember = {
          tier: 'manual',
          createdAt: Date.now(),
          expiresAt: Date.now() + 30 * 86400 * 1000,
        };
        window.localStorage.setItem(MEMBER_KEY, JSON.stringify(m));
        window.dispatchEvent(new Event('storage'));
      } catch { /* ignore */ }
      setActivateToast(t.activateSuccess);
      setActivateCode('');
      setActivateOpen(false);
      setTimeout(() => setActivateToast(null), 2500);
      setTimeout(() => window.location.reload(), 300);
    } else {
      setActivateToast(t.activateFail);
      setTimeout(() => setActivateToast(null), 2500);
    }
  };

  const handleExportClick = () => {
    if (!member.isMember) {
      try { document.body.classList.add('pdf-watermark'); } catch { /* ignore */ }
      setExportHintToast(t.printHint);
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          try { document.body.classList.remove('pdf-watermark'); } catch { /* ignore */ }
        }, 1000);
        setExportHintToast(null);
      }, 400);
    } else {
      try { document.body.classList.remove('pdf-watermark'); } catch { /* ignore */ }
      window.print();
    }
  };

  const ToastLayer = (message: string | null, key: string) =>
    message ? (
      <div
        key={key}
        className={`fixed z-[9999] left-1/2 -translate-x-1/2 bottom-5 sm:bottom-8 px-4 py-3 rounded-xl bg-gray-900/95 dark:bg-gray-100/95 text-white dark:text-gray-900 text-sm shadow-2xl max-w-[92vw] backdrop-blur ${isRTL ? 'text-right' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        role="status"
      >
        {message}
      </div>
    ) : null;

  if (variant === 'export') {
    return (
      <>
        <button
          type="button"
          onClick={handleExportClick}
          className={`${BUTTON_BASE} px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 whitespace-nowrap`}
          aria-label={t.exportPdf}
          title={t.printHint}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">{t.exportPdf}</span>
          <span className="sm:hidden">PDF</span>
        </button>
        {ToastLayer(exportHintToast, 'eh')}
        <style>{`
          @media print {
            body.pdf-watermark::after {
              content: "Sample Watermark - Korelyy Member Required";
              position: fixed;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: rgba(200,50,50,0.08);
              font-size: 80pt;
              transform: rotate(-30deg);
              z-index: 9999;
              pointer-events: none;
            }
          }
        `}</style>
      </>
    );
  }

  if (variant === 'top' && member.isMember) {
    const expiresLabel = t.memberExpires.replace('{date}', formatDate(member.expiresAt, locale));
    return (
      <>
        <div
          role="complementary"
          aria-label="Ko-fi member badge"
          className={`relative w-full overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/30 px-3 sm:px-4 py-2.5 sm:py-3 mb-5 sm:mb-6 ${isRTL ? 'text-right' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className="hidden sm:flex shrink-0 w-9 h-9 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 items-center justify-center"
                aria-hidden="true"
              >
                <Crown className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold">
                  <Crown className="h-3.5 w-3.5" />
                  {t.memberBadge}
                </span>
                <span className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-200/85">
                  {expiresLabel} · {member.remainingDays}d
                </span>
              </div>
            </div>
            <a
              href={monthly}
              rel="nofollow noopener sponsored"
              target="_blank"
              className={`${BUTTON_BASE} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-amber-600 text-white hover:bg-amber-500 shadow-sm`}
            >
              {t.premiumContent}
            </a>
          </div>
        </div>
        {ToastLayer(txToast, 'ttx')}
        {ToastLayer(activateToast, 'tac')}
      </>
    );
  }

  if (variant === 'top') {
    if (topClosed) return null;
    return (
      <>
        <div
          role="complementary"
          aria-label="Ko-fi support banner"
          className={`relative w-full overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/30 px-4 sm:px-5 py-3 sm:py-3.5 mb-5 sm:mb-6 ${isRTL ? 'text-right' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className={`flex items-start gap-3 sm:gap-4 ${isRTL ? 'pl-9' : 'pr-9'}`}>
            <div
              className="hidden sm:flex shrink-0 w-10 h-10 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 items-center justify-center"
              aria-hidden="true"
            >
              <Crown className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-[15px] font-semibold text-amber-900 dark:text-amber-100 leading-snug">
                {t.supportUs}
              </p>
              {spec && (
                <p className="mt-1 text-xs sm:text-sm text-amber-800/90 dark:text-amber-200/85 line-clamp-2">
                  <Lock className="inline h-3.5 w-3.5 mr-1 align-[-2px]" aria-hidden="true" />
                  {spec.unlockItems[0]} · {spec.unlockItems[1]}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href={lifetime}
                  rel="nofollow noopener sponsored"
                  target="_blank"
                  className={`${BUTTON_BASE} bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700 shadow-sm shadow-amber-900/10`}
                >
                  <Unlock className="h-4 w-4" />
                  {KOFI_TIERS[1].price}
                  {KOFI_TIERS[1].suffix || ''} · {t.getStarted}
                </a>
                <a
                  href={monthly}
                  rel="nofollow noopener sponsored"
                  target="_blank"
                  className={`${BUTTON_BASE} border border-amber-300/70 dark:border-amber-500/40 text-amber-800 dark:text-amber-100 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 bg-white/40 dark:bg-white/0`}
                >
                  {KOFI_TIERS[0].price}
                  {KOFI_TIERS[0].suffix || ''}
                </a>
                <button
                  type="button"
                  onClick={() => setActivateOpen((v) => !v)}
                  className={`${BUTTON_BASE} px-3 py-2 text-xs sm:text-sm border border-dashed border-amber-300/70 dark:border-amber-500/40 text-amber-800/90 dark:text-amber-200/90 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 bg-transparent`}
                >
                  {t.or} {t.activateCode}
                </button>
              </div>
              {activateOpen && (
                <div className="mt-3 flex flex-wrap items-stretch gap-2">
                  <input
                    type="text"
                    value={activateCode}
                    onChange={(e) => setActivateCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleActivate(); }}
                    placeholder={t.activatePlaceholder}
                    className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-lg border border-amber-300/70 dark:border-amber-500/40 bg-white dark:bg-gray-900/60 text-amber-900 dark:text-amber-100 placeholder:text-amber-700/60 dark:placeholder:text-amber-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[44px]"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={handleActivate}
                    className={`${BUTTON_BASE} bg-amber-700 text-white hover:bg-amber-600`}
                  >
                    {t.activateSubmit}
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={closeTop}
            aria-label={t.closeAria}
            className={`absolute top-2 p-2 min-h-[40px] min-w-[40px] rounded-lg text-amber-700/80 hover:text-amber-900 hover:bg-amber-200/60 dark:text-amber-200/80 dark:hover:text-amber-50 dark:hover:bg-amber-800/40 transition-colors touch-manipulation ${isRTL ? 'left-2' : 'right-2'}`}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        {ToastLayer(txToast, 'ttx')}
        {ToastLayer(activateToast, 'tac')}
      </>
    );
  }

  if (!spec) return null;

  return (
    <>
      <section
        aria-labelledby="kofi-bottom-title"
        className={`w-full mt-8 sm:mt-10 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm overflow-hidden ${isRTL ? 'text-right' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="shrink-0 w-10 h-10 rounded-lg bg-white/15 text-white flex items-center justify-center"
                aria-hidden="true"
              >
                <Crown className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 id="kofi-bottom-title" className="text-base sm:text-lg font-semibold text-white truncate">
                  {spec.unlockTitle}
                </h2>
                <p className="text-sm text-amber-50/90 line-clamp-1">{t.supportUs}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {KOFI_TIERS.map((tier) => {
                const url = buildKofiUrl(tier.id as KofiTierId, slug, locale);
                return (
                  <a
                    key={tier.id}
                    href={url}
                    rel="nofollow noopener sponsored"
                    target="_blank"
                    className={`${BUTTON_BASE} ${
                      tier.id === 'one_time'
                        ? 'bg-white text-amber-700 hover:bg-amber-50 shadow-sm'
                        : 'bg-white/15 text-white hover:bg-white/25 border border-white/25'
                    }`}
                  >
                    {tier.price}
                    {tier.suffix || ''}
                    {!tier.suffix && tier.id === 'commercial' && (
                      <span className="hidden sm:inline text-xs font-medium opacity-80"> {t.team}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px md:bg-gray-200 dark:md:bg-gray-800 divide-y md:divide-y-0 divide-gray-200 dark:divide-gray-800 px-4 sm:px-6 py-5 sm:py-6">
          <div className="pr-0 md:pr-6 py-1 md:py-0">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              </span>
              {t.freeContent}
            </h3>
            <ul className="mt-3 space-y-2">
              {spec.freeItems.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                  />
                  <span className="min-w-0 break-words">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pl-0 md:pl-6 pt-4 md:pt-0">
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/50 items-center justify-center"
                aria-hidden="true"
              >
                <Unlock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
              </span>
              {t.premiumContent}
            </h3>
            <ul className="mt-3 space-y-2">
              {spec.unlockItems.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-100">
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 h-4 w-4 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 inline-flex items-center justify-center"
                  >
                    <span className="block h-1 w-1.5 rounded-sm bg-current" />
                  </span>
                  <span className="min-w-0 break-words font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-5 sm:pb-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
          <div className="pt-4 sm:pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <button
                type="button"
                onClick={() => setActivateOpen((v) => !v)}
                className={`${BUTTON_BASE} px-3 sm:px-4 py-2 text-xs sm:text-sm border border-dashed border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent`}
              >
                {t.or} {t.activateCode}
              </button>
              <a
                href="https://ko-fi.com/korelyy"
                rel="nofollow noopener sponsored"
                target="_blank"
                className="text-xs sm:text-sm text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 underline-offset-4 hover:underline"
              >
                {t.learnMore}
              </a>
            </div>
            {activateOpen && (
              <div className="flex flex-wrap items-stretch gap-2">
                <input
                  type="text"
                  value={activateCode}
                  onChange={(e) => setActivateCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleActivate(); }}
                  placeholder={t.activatePlaceholder}
                  className="flex-1 min-w-[220px] px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[44px]"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleActivate}
                  className={`${BUTTON_BASE} bg-amber-600 text-white hover:bg-amber-500 shadow-sm`}
                >
                  {t.activateSubmit}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {ToastLayer(txToast, 'ttx')}
      {ToastLayer(activateToast, 'tac')}
    </>
  );
}
