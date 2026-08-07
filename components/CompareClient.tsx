'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, X, ArrowRight, Award, ShieldCheck, Zap, Globe, Code2, Heart, Star } from 'lucide-react';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'] as const;
type LocaleKey = (typeof VALID_LOCALES)[number];

const I18N: Record<string, {
  title: string;
  vs: string;
  winner: string;
  pickA: string;
  pickB: string;
  pickBoth: string;
  score_free: string;
  score_features: string;
  score_ease: string;
  score_speed: string;
  score_privacy: string;
  score_portable: string;
  free: string;
  features: string;
  ease: string;
  speed: string;
  privacy: string;
  portable: string;
  yes: string;
  no: string;
  conclusion: string;
  tryA: string;
  tryB: string;
  faq: string;
  faqWhich: string;
  faqFree: string;
  faqSignup: string;
  back: string;
}> = {
  en: {
    title: 'Head-to-Head Comparison',
    vs: 'vs',
    winner: '🏆 Winner:',
    pickA: 'Pick A for',
    pickB: 'Pick B for',
    pickBoth: 'Best of both: try them together',
    score_free: 'Free to Use',
    score_features: 'Features',
    score_ease: 'Ease of Use',
    score_speed: 'Speed',
    score_privacy: 'Privacy',
    score_portable: 'Portability',
    free: 'Free',
    features: 'Features',
    ease: 'Ease',
    speed: 'Speed',
    privacy: 'Privacy',
    portable: 'Portable',
    yes: 'Yes',
    no: 'No',
    conclusion: 'Bottom Line',
    tryA: 'Try A now',
    tryB: 'Try B now',
    faq: 'FAQ',
    faqWhich: 'Which one should I pick?',
    faqFree: 'Are these tools free?',
    faqSignup: 'Do I need to sign up?',
    back: 'Back to tools',
  },
  zh: {
    title: '正面对比',
    vs: '对比',
    winner: '🏆 推荐：',
    pickA: '选 A 的理由',
    pickB: '选 B 的理由',
    pickBoth: '两个都试：组合使用',
    score_free: '是否免费',
    score_features: '功能丰富度',
    score_ease: '上手难度',
    score_speed: '运行速度',
    score_privacy: '隐私安全',
    score_portable: '跨平台',
    free: '免费',
    features: '功能',
    ease: '易用',
    speed: '速度',
    privacy: '隐私',
    portable: '跨端',
    yes: '是',
    no: '否',
    conclusion: '总结',
    tryA: '立即试用 A',
    tryB: '立即试用 B',
    faq: '常见问题',
    faqWhich: '应该选哪个？',
    faqFree: '这些工具免费吗？',
    faqSignup: '需要注册吗？',
    back: '返回工具',
  },
  es: {
    title: 'Comparación cara a cara',
    vs: 'vs',
    winner: '🏆 Ganador:',
    pickA: 'Elige A para',
    pickB: 'Elige B para',
    pickBoth: 'Lo mejor de ambos: úsalos juntos',
    score_free: 'Gratis',
    score_features: 'Funciones',
    score_ease: 'Facilidad',
    score_speed: 'Velocidad',
    score_privacy: 'Privacidad',
    score_portable: 'Portabilidad',
    free: 'Gratis',
    features: 'Funciones',
    ease: 'Fácil',
    speed: 'Velocidad',
    privacy: 'Privacidad',
    portable: 'Portátil',
    yes: 'Sí',
    no: 'No',
    conclusion: 'Conclusión',
    tryA: 'Probar A ahora',
    tryB: 'Probar B ahora',
    faq: 'Preguntas frecuentes',
    faqWhich: '¿Cuál debería elegir?',
    faqFree: '¿Estas herramientas son gratis?',
    faqSignup: '¿Necesito registrarme?',
    back: 'Volver a herramientas',
  },
  fr: {
    title: 'Comparaison directe',
    vs: 'vs',
    winner: '🏆 Gagnant :',
    pickA: 'Choisissez A pour',
    pickB: 'Choisissez B pour',
    pickBoth: 'Le meilleur des deux : utilisez-les ensemble',
    score_free: 'Gratuit',
    score_features: 'Fonctionnalités',
    score_ease: 'Facilité',
    score_speed: 'Vitesse',
    score_privacy: 'Confidentialité',
    score_portable: 'Portabilité',
    free: 'Gratuit',
    features: 'Fonctions',
    ease: 'Facile',
    speed: 'Vitesse',
    privacy: 'Confidentialité',
    portable: 'Portable',
    yes: 'Oui',
    no: 'Non',
    conclusion: 'Conclusion',
    tryA: 'Essayer A maintenant',
    tryB: 'Essayer B maintenant',
    faq: 'FAQ',
    faqWhich: 'Lequel choisir ?',
    faqFree: 'Ces outils sont-ils gratuits ?',
    faqSignup: 'Dois-je m\'inscrire ?',
    back: 'Retour aux outils',
  },
  hi: {
    title: 'सीधी तुलना',
    vs: 'बनाम',
    winner: '🏆 विजेता:',
    pickA: 'A चुनें क्योंकि',
    pickB: 'B चुनें क्योंकि',
    pickBoth: 'दोनों का फायदा: साथ में आज़माएँ',
    score_free: 'मुफ्त',
    score_features: 'सुविधाएँ',
    score_ease: 'आसानी',
    score_speed: 'गति',
    score_privacy: 'गोपनीयता',
    score_portable: 'पोर्टेबिलिटी',
    free: 'मुफ्त',
    features: 'सुविधाएँ',
    ease: 'आसान',
    speed: 'गति',
    privacy: 'गोपनीय',
    portable: 'पोर्टेबल',
    yes: 'हाँ',
    no: 'नहीं',
    conclusion: 'निष्कर्ष',
    tryA: 'अभी A आज़माएँ',
    tryB: 'अभी B आज़माएँ',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    faqWhich: 'मुझे कौन सा चुनना चाहिए?',
    faqFree: 'क्या ये टूल मुफ्त हैं?',
    faqSignup: 'क्या मुझे साइन अप करना होगा?',
    back: 'टूल्स पर वापस',
  },
  ar: {
    title: 'مقارنة مباشرة',
    vs: 'مقابل',
    winner: '🏆 الفائز:',
    pickA: 'اختر A لـ',
    pickB: 'اختر B لـ',
    pickBoth: 'الأفضل من الاثنين: استخدمهما معاً',
    score_free: 'مجاني',
    score_features: 'الميزات',
    score_ease: 'السهولة',
    score_speed: 'السرعة',
    score_privacy: 'الخصوصية',
    score_portable: 'قابلية النقل',
    free: 'مجاني',
    features: 'الميزات',
    ease: 'سهل',
    speed: 'السرعة',
    privacy: 'الخصوصية',
    portable: 'محمول',
    yes: 'نعم',
    no: 'لا',
    conclusion: 'الخلاصة',
    tryA: 'جرب A الآن',
    tryB: 'جرب B الآن',
    faq: 'الأسئلة الشائعة',
    faqWhich: 'أي واحد يجب أن أختار؟',
    faqFree: 'هل هذه الأدوات مجانية؟',
    faqSignup: 'هل أحتاج للتسجيل؟',
    back: 'العودة إلى الأدوات',
  },
};

interface Score { free: number; features: number; ease: number; speed: number; privacy: number; portable: number; }
interface ToolInfo { slug: string; name: string; pickFor: string; score: Score; }

const COMPARISONS: Record<string, { a: ToolInfo; b: ToolInfo; conclusion: string; }> = {
  'json-formatter-vs-json-csv-converter': {
    a: { slug: 'json-formatter', name: 'JSON Formatter', pickFor: 'beautifying, validating, and inspecting JSON structure', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'json-csv-converter', name: 'JSON CSV Converter', pickFor: 'converting tabular data between JSON and CSV formats', score: { free: 5, features: 4, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Use JSON Formatter for everyday code work and debugging. Use JSON CSV Converter when moving data between APIs and spreadsheets.',
  },
  'image-compressor-vs-image-converter': {
    a: { slug: 'image-compressor', name: 'Image Compressor', pickFor: 'shrinking photo file size for web/email without quality loss', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'image-converter', name: 'Image Converter', pickFor: 'changing format (PNG ↔ JPG ↔ WebP ↔ favicon)', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Compress first, then convert. Together they cover 90% of web image prep needs.',
  },
  'password-generator-vs-uuid-generator': {
    a: { slug: 'password-generator', name: 'Password Generator', pickFor: 'human-memorable yet strong passwords for accounts', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'uuid-generator', name: 'UUID Generator', pickFor: 'database keys, session tokens, and non-human identifiers', score: { free: 5, features: 4, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Passwords are for humans to remember, UUIDs are for systems to track. Different jobs.',
  },
  'emoji-mixer-vs-meme-generator': {
    a: { slug: 'emoji-mixer', name: 'Emoji Mixer', pickFor: 'combining two emojis into a unique custom emoji', score: { free: 5, features: 4, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'meme-generator', name: 'Meme Generator', pickFor: 'creating text-on-image memes with classic templates', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Emoji Mixer is for quick reactions and chat. Meme Generator is for shareable social content.',
  },
  'regex-tester-vs-ai-regex-generator': {
    a: { slug: 'regex-tester', name: 'Regex Tester', pickFor: 'validating and debugging regex patterns you already have', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'ai-regex-generator', name: 'AI Regex Generator', pickFor: 'writing a regex from a plain English description', score: { free: 5, features: 4, ease: 5, speed: 4, privacy: 5, portable: 5 } },
    conclusion: 'Use AI Regex Generator when you do not know regex. Use Regex Tester to verify what you get.',
  },
  'random-number-vs-password-generator': {
    a: { slug: 'random-number', name: 'Random Number', pickFor: 'dice rolls, lotteries, sampling, and quick picks', score: { free: 5, features: 4, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'password-generator', name: 'Password Generator', pickFor: 'cryptographically strong account passwords', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Random numbers for games, passwords for security. Never use Random Number for passwords.',
  },
  'ai-copywriter-vs-tone-changer': {
    a: { slug: 'ai-copywriter', name: 'AI Copywriter', pickFor: 'generating fresh marketing or social media copy from scratch', score: { free: 5, features: 5, ease: 5, speed: 4, privacy: 4, portable: 5 } },
    b: { slug: 'tone-changer', name: 'Tone Changer', pickFor: 'rewriting existing copy to sound formal/casual/friendly', score: { free: 5, features: 4, ease: 5, speed: 4, privacy: 4, portable: 5 } },
    conclusion: 'AI Copywriter for new content, Tone Changer for polishing what you already wrote.',
  },
  'color-picker-vs-css-gradient-generator': {
    a: { slug: 'color-picker', name: 'Color Picker', pickFor: 'choosing a single solid color and grabbing its hex/RGB', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'css-gradient-generator', name: 'CSS Gradient Generator', pickFor: 'building multi-stop linear or radial gradients', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Color Picker for one color, Gradient Generator for blends. Use both when designing UI.',
  },
  'unit-converter-vs-hash-generator': {
    a: { slug: 'unit-converter', name: 'Unit Converter', pickFor: 'converting length, weight, temperature, and other units', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'hash-generator', name: 'Hash Generator', pickFor: 'generating MD5, SHA-1, SHA-256 fingerprints of text', score: { free: 5, features: 4, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'Unit Converter for the physical world, Hash Generator for the digital world. Different problems.',
  },
  'qr-code-generator-vs-image-to-base64': {
    a: { slug: 'qr-code-generator', name: 'QR Code Generator', pickFor: 'encoding URLs/contacts into scannable QR images', score: { free: 5, features: 5, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    b: { slug: 'image-to-base64', name: 'Image to Base64', pickFor: 'embedding images inline in HTML/CSS without external files', score: { free: 5, features: 4, ease: 5, speed: 5, privacy: 5, portable: 5 } },
    conclusion: 'QR Code is for print/real-world scanning. Image to Base64 is for inline web embeds.',
  },
};

const SCORE_LABELS = ['free', 'features', 'ease', 'speed', 'privacy', 'portable'] as const;

function StarBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < value ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
        />
      ))}
    </div>
  );
}

export default function CompareClient() {
  const params = useParams() as { locale?: string; slug?: string };
  const locale = (params.locale && (VALID_LOCALES as readonly string[]).includes(params.locale) ? params.locale : 'en') as LocaleKey;
  const slug = (params.slug || '').toLowerCase();
  const t = I18N[locale] || I18N.en;
  const isRtl = locale === 'ar';
  const comp = COMPARISONS[slug];

  if (!comp) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">404 — Comparison Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This comparison page does not exist yet.</p>
          <Link href={`/${locale}/tools/`} className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium min-h-[48px]">
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const aTotal = Object.values(comp.a.score).reduce((s, n) => s + n, 0);
  const bTotal = Object.values(comp.b.score).reduce((s, n) => s + n, 0);
  const winner: 'a' | 'b' | 'tie' = aTotal > bTotal ? 'a' : bTotal > aTotal ? 'b' : 'tie';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6">
          <Link href={`/${locale}/tools/`} className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 min-h-[40px]">
            ← {t.back}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {comp.a.name} <span className="text-gray-400 dark:text-gray-500 font-normal">{t.vs}</span> {comp.b.name}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.title}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold mb-3">
                {comp.a.name.charAt(0)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{comp.a.name}</h2>
              <Link href={`/${locale}/tool/${comp.a.slug}/`} className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium min-h-[40px]">
                {t.tryA} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {winner === 'a' && (
                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-md">
                  <Award className="h-3 w-3" /> {t.winner}
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50">
              <div className="text-3xl sm:text-4xl font-black text-gray-300 dark:text-gray-600 my-1">VS</div>
              {winner === 'tie' && <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{t.winner} TIE</div>}
            </div>
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold mb-3">
                {comp.b.name.charAt(0)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{comp.b.name}</h2>
              <Link href={`/${locale}/tool/${comp.b.slug}/`} className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium min-h-[40px]">
                {t.tryB} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {winner === 'b' && (
                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-md">
                  <Award className="h-3 w-3" /> {t.winner}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary-500" /> {t.features}
          </h3>
          <div className="space-y-3">
            {SCORE_LABELS.map((key) => {
              const aVal = comp.a.score[key];
              const bVal = comp.b.score[key];
              return (
                <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{aVal}/5</span>
                    <div className="w-full max-w-[180px]"><StarBar value={aVal} /></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {t[`score_${key}` as keyof typeof t]}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{bVal}/5</span>
                    <div className="w-full max-w-[180px]"><StarBar value={bVal} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50 rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-bold text-primary-900 dark:text-primary-200 mb-2 flex items-center gap-2">
              <Check className="h-4 w-4" /> {t.pickA} {comp.a.name}
            </h3>
            <p className="text-sm text-primary-800 dark:text-primary-300">{comp.a.pickFor}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <Check className="h-4 w-4" /> {t.pickB} {comp.b.name}
            </h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-300">{comp.b.pickFor}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-800/40 p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
            <Award className="h-4 w-4" /> {t.conclusion}
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">{comp.conclusion}</p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            💡 {t.pickBoth}: <Link href={`/${locale}/tool/${comp.a.slug}/`} className="underline">{comp.a.name}</Link> + <Link href={`/${locale}/tool/${comp.b.slug}/`} className="underline">{comp.b.name}</Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">{t.faq}</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t.faqWhich}</p>
              <p className="text-gray-700 dark:text-gray-300">{comp.conclusion}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t.faqFree}</p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500 shrink-0" /> {t.yes}, both are 100% free.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t.faqSignup}</p>
              <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500 shrink-0" /> No signup, no login, runs locally in your browser.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
