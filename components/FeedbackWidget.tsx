'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';

// ============================================================
// 意见收集箱 · Formspree 接入
// 注册后把下面这行替换成你的 endpoint，例如：
//   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
// 留空时组件仍显示，但提交会提示"暂未开放"。
const FORMSPREE_ENDPOINT = '';
// ============================================================

type FeedbackType = 'bug' | 'idea' | 'praise' | 'other';
type Status = 'idle' | 'sending' | 'ok' | 'error' | 'disabled';

export default function FeedbackWidget() {
  const locale = useLocale();
  const t = i18n(locale);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('idea');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      if (status === 'ok') {
        setStatus('idle');
        setMessage('');
        setEmail('');
        setType('idea');
      }
    }, 200);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!FORMSPREE_ENDPOINT) {
      setStatus('disabled');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim(),
          page: typeof window !== 'undefined' ? window.location.href : '',
          locale,
        }),
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const types: Array<{ id: FeedbackType; label: string; emoji: string }> = [
    { id: 'idea', label: t.idea, emoji: '💡' },
    { id: 'bug', label: t.bug, emoji: '🐞' },
    { id: 'praise', label: t.praise, emoji: '❤️' },
    { id: 'other', label: t.other, emoji: '💬' },
  ];

  return (
    <>
      {/* 浮动触发按钮：右下角，避开移动端底部广告位 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.title}
        className="fixed z-[55] bottom-20 sm:bottom-6 right-3 sm:right-5 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold pl-3 pr-3.5 py-2.5 min-h-[44px] shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        <span className="hidden xs:inline sm:inline">{t.btn}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-label={t.title}>
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{t.title}</h3>
              <button onClick={close} aria-label={t.close} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {status === 'ok' ? (
              <div className="px-5 py-8 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{t.thanks}</p>
                <button onClick={close} className="px-5 py-2.5 min-h-[44px] rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">{t.done}</button>
              </div>
            ) : (
              <form onSubmit={submit} className="px-4 sm:px-5 py-4 space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.subtitle}</p>
                <div className="grid grid-cols-4 gap-2">
                  {types.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setType(it.id)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[11px] font-medium min-h-[56px] justify-center transition-all ${
                        type === it.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-lg">{it.emoji}</span>
                      {it.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder={t.placeholder}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
                {status === 'error' && <p className="text-xs text-rose-500">{t.errorMsg}</p>}
                {status === 'disabled' && <p className="text-xs text-amber-500">{t.disabledMsg}</p>}
                <button
                  type="submit"
                  disabled={status === 'sending' || !message.trim()}
                  className="w-full py-2.5 min-h-[44px] rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {status === 'sending' ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function i18n(locale: string) {
  switch (locale) {
    case 'zh':
      return { title: '意见反馈', btn: '反馈', subtitle: '你的每条建议都会帮 Korelyy 变得更好。', idea: '建议', bug: '问题', praise: '夸夸', other: '其他', placeholder: '想说点什么？（体验、想要的功能、遇到的问题…）', emailPlaceholder: '邮箱（选填，方便我们回复你）', send: '提交反馈', sending: '提交中…', thanks: '收到啦，非常感谢你的反馈！', done: '完成', close: '关闭', errorMsg: '提交失败，请稍后再试。', disabledMsg: '反馈通道即将开放，敬请期待。' };
    case 'hi':
      return { title: 'प्रतिक्रिया', btn: 'फ़ीडबैक', subtitle: 'आपकी हर राय Korelyy को बेहतर बनाती है।', idea: 'सुझाव', bug: 'समस्या', praise: 'तारीफ़', other: 'अन्य', placeholder: 'आप क्या कहना चाहेंगे?', emailPlaceholder: 'ईमेल (वैकल्पिक)', send: 'भेजें', sending: 'भेज रहे हैं…', thanks: 'धन्यवाद! आपकी प्रतिक्रिया मिल गई।', done: 'हो गया', close: 'बंद करें', errorMsg: 'भेजने में विफल, बाद में प्रयास करें।', disabledMsg: 'फ़ीडबैक जल्द ही उपलब्ध होगा।' };
    case 'es':
      return { title: 'Comentarios', btn: 'Opinar', subtitle: 'Cada sugerencia ayuda a mejorar Korelyy.', idea: 'Idea', bug: 'Error', praise: 'Elogio', other: 'Otro', placeholder: '¿Qué nos quieres decir?', emailPlaceholder: 'Email (opcional)', send: 'Enviar', sending: 'Enviando…', thanks: '¡Gracias por tus comentarios!', done: 'Listo', close: 'Cerrar', errorMsg: 'Error al enviar, inténtalo más tarde.', disabledMsg: 'El canal estará disponible pronto.' };
    case 'fr':
      return { title: 'Retour', btn: 'Avis', subtitle: 'Chaque suggestion aide à améliorer Korelyy.', idea: 'Idée', bug: 'Bug', praise: 'Bravo', other: 'Autre', placeholder: 'Que voulez-vous nous dire ?', emailPlaceholder: 'E-mail (facultatif)', send: 'Envoyer', sending: 'Envoi…', thanks: 'Merci pour votre retour !', done: 'Terminé', close: 'Fermer', errorMsg: 'Échec de l\'envoi, réessayez plus tard.', disabledMsg: 'Le canal sera bientôt disponible.' };
    case 'ar':
      return { title: 'ملاحظاتك', btn: 'رأيك', subtitle: 'كل اقتراح يساعد على تحسين Korelyy.', idea: 'فكرة', bug: 'خطأ', praise: 'إشادة', other: 'أخرى', placeholder: 'ماذا تريد أن تخبرنا؟', emailPlaceholder: 'البريد (اختياري)', send: 'إرسال', sending: 'جارٍ الإرسال…', thanks: 'شكراً على ملاحظاتك!', done: 'تم', close: 'إغلاق', errorMsg: 'فشل الإرسال، حاول لاحقاً.', disabledMsg: 'ستتوفر القناة قريباً.' };
    default:
      return { title: 'Feedback', btn: 'Feedback', subtitle: 'Every suggestion helps make Korelyy better.', idea: 'Idea', bug: 'Bug', praise: 'Praise', other: 'Other', placeholder: 'What would you like to tell us? (experience, feature requests, issues…)', emailPlaceholder: 'Email (optional, so we can reply)', send: 'Send feedback', sending: 'Sending…', thanks: 'Got it — thank you for your feedback!', done: 'Done', close: 'Close', errorMsg: 'Failed to send, please try again later.', disabledMsg: 'Feedback channel opening soon.' };
  }
}