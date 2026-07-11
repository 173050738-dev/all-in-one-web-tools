import type { Tool } from '@/data/tools';
import type { SeoLocale } from '@/components/seo';
import { KNOWN_LOCALES } from '@/components/seo';

export type FaqItem = { q: string; a: string };

export type ToolLike =
  | Tool
  | { slug: string; id?: string; name?: string; nameEn?: string; description?: string; descriptionEn?: string };

export type JsonMessages = Record<string, any>;

export type NsTranslator = (key: string) => string;

const FAQ_ORDER = ['free', 'signup', 'privacy', 'device'] as const;
type FaqKey = (typeof FAQ_ORDER)[number];

const FAQ_I18N: Record<SeoLocale, Record<FaqKey, { q: string; a: string }>> = {
  en: {
    free: {
      q: 'Is {name} free to use?',
      a: 'Yes. {name} is 100% free for core features — no signup, no watermarks, no hidden paywalls on the tools you need day to day.',
    },
    signup: {
      q: 'Do I need to sign up to use {name}?',
      a: 'No. Open and use instantly in your browser. Nothing to install, no account required. Your preferences stay on your device.',
    },
    privacy: {
      q: 'Is my data safe with {name}?',
      a: 'Yes. {name} runs locally in your browser whenever technically possible — sensitive inputs are processed on your device, not on our servers. No tracking cookies.',
    },
    device: {
      q: 'Which devices does {name} work on?',
      a: 'Phones, tablets and desktops with any modern browser (Chrome, Safari, Edge, Firefox). Touch-friendly and responsive from 320px to 4K.',
    },
  },
  zh: {
    free: {
      q: '{name} 免费使用吗？',
      a: '是的，{name} 核心功能永久免费，无需注册登录，无水印、无隐藏付费墙，日常使用完全免费。',
    },
    signup: {
      q: '使用 {name} 需要注册吗？',
      a: '不需要。打开浏览器就能用，不用下载任何东西，不用注册账号。所有设置都保存在你自己的设备上。',
    },
    privacy: {
      q: '用 {name} 我的数据安全吗？',
      a: '安全。{name} 在技术允许的情况下全部在浏览器本地运行，敏感输入都在你设备上处理，不上传我们服务器。也没有追踪 Cookie。',
    },
    device: {
      q: '{name} 支持哪些设备？',
      a: '手机、平板、电脑都行，Chrome、Safari、Edge、Firefox 主流浏览器全支持，触摸友好、响应式适配从 320px 到 4K 屏幕。',
    },
  },
  es: {
    free: {
      q: '¿{name} es gratuito?',
      a: 'Sí. {name} es 100% gratuito en sus funciones básicas: sin registro, sin marcas de agua ni muros de pago ocultos en las herramientas que usas cada día.',
    },
    signup: {
      q: '¿Necesito registrarme para usar {name}?',
      a: 'No. Ábrelo directamente en tu navegador y úsalo al instante. Nada que instalar ni cuenta que crear. Tus preferencias se quedan en tu dispositivo.',
    },
    privacy: {
      q: '¿Son seguros mis datos con {name}?',
      a: 'Sí. {name} se ejecuta localmente en tu navegador siempre que es técnicamente posible. Las entradas sensibles se procesan en tu equipo, no en nuestros servidores. Sin cookies de seguimiento.',
    },
    device: {
      q: '¿En qué dispositivos funciona {name}?',
      a: 'Móviles, tabletas y escritorios con cualquier navegador moderno (Chrome, Safari, Edge, Firefox). Interfaz táctil y responsiva de 320 px a 4 K.',
    },
  },
  fr: {
    free: {
      q: '{name} est-il gratuit ?',
      a: 'Oui. {name} est 100 % gratuit sur les fonctions principales : pas d\'inscription, pas de filigrane, pas de paywall masqué sur les outils du quotidien.',
    },
    signup: {
      q: 'Dois-je m\'inscrire pour utiliser {name} ?',
      a: 'Non. Ouvrez et utilisez {name} directement dans votre navigateur. Rien à installer, aucun compte requis. Vos préférences restent sur votre appareil.',
    },
    privacy: {
      q: 'Mes données sont-elles en sécurité avec {name} ?',
      a: 'Oui. {name} s\'exécute localement dans votre navigateur dès que c\'est techniquement possible. Les saisies sensibles sont traitées sur votre appareil, pas sur nos serveurs. Aucun cookie de pistage.',
    },
    device: {
      q: 'Sur quels appareils fonctionne {name} ?',
      a: 'Téléphones, tablettes et ordinateurs avec un navigateur moderne (Chrome, Safari, Edge, Firefox). Interface tactile et responsive de 320 px à 4 K.',
    },
  },
  hi: {
    free: {
      q: 'क्या {name} मुफ़्त है?',
      a: 'हाँ। {name} कोर फ़ीचर्स 100% मुफ़्त हैं — कोई साइनअप नहीं, कोई वॉटरमार्क नहीं, रोज़ काम आने वाले टूल्स पर कोई छुपा पेड वॉल नहीं।',
    },
    signup: {
      q: 'क्या मुझे {name} इस्तेमाल करने के लिए साइनअप करना पड़ेगा?',
      a: 'नहीं। अपने ब्राउज़र में खोलें और तुरंत इस्तेमाल करें। कुछ इंस्टॉल नहीं, कोई अकाउंट नहीं। आपकी प्रेफरेंसेस आपके डिवाइस पर ही रहेंगी।',
    },
    privacy: {
      q: 'क्या {name} के साथ मेरा डेटा सुरक्षित है?',
      a: 'हाँ। {name} तकनीकी रूप से संभव हो तो हमेशा आपके ब्राउज़र में ही लोकल चलता है — सेंसिटिव इनपुट आपके डिवाइस पर प्रोसेस होते हैं, हमारे सर्वर पर नहीं। कोई ट्रैकिंग कुकीज़ नहीं।',
    },
    device: {
      q: '{name} किन डिवाइसों पर काम करता है?',
      a: 'फोन, टैबलेट और डेस्कटॉप — कोई भी मॉडर्न ब्राउज़र (Chrome, Safari, Edge, Firefox)। टच फ्रेंडली और 320px से 4K तक रेस्पॉन्सिव।',
    },
  },
  ar: {
    free: {
      q: 'هل {name} مجاني للاستخدام؟',
      a: 'نعم. {name} مجاني 100% للميزات الأساسية — بدون تسجيل، بدون علامات مائية، بدون جدران دفع مخفية على الأدوات التي تستخدمها يومياً.',
    },
    signup: {
      q: 'هل أحتاج إلى التسجيل لاستخدام {name}؟',
      a: 'لا. افتح واستخدم فوراً في متصفحك. لا شيء للتثبيت ولا حساب مطلوب. تفضيلاتك تبقى على جهازك.',
    },
    privacy: {
      q: 'هل بياناتي آمنة مع {name}؟',
      a: 'نعم. {name} يعمل محلياً داخل متصفحك كلما كان ذلك ممكناً تقنياً — المدخلات الحساسة تُعالج على جهازك وليس على خوادمنا. لا ملفات تعريف ارتباط للتتبع.',
    },
    device: {
      q: 'ما هي الأجهزة التي يعمل عليها {name}؟',
      a: 'الهواتف والأجهزة اللوحية وأجهزة المكتب مع أي متصفح حديث (Chrome، Safari، Edge، Firefox). واجهة متجاوبة ومناسبة لللمس من 320 بكسل إلى 4K.',
    },
  },
};

function resolveLocale(l: string | SeoLocale): SeoLocale {
  return (KNOWN_LOCALES as readonly string[]).includes(l as string) ? (l as SeoLocale) : 'en';
}

export function replaceName(text: string, name: string): string {
  if (!text) return text;
  const safe = name || 'This tool';
  return text.replace(/\{name\}/g, safe);
}

export function resolveToolNameFromJson(locale: SeoLocale, tool: ToolLike, json: JsonMessages): string {
  const l = resolveLocale(locale);
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.nameEn || tool.name || slug || 'This tool';
  try {
    const ns = json?.tools || null;
    if (ns) {
      if (slug && ns[slug]?.name && typeof ns[slug].name === 'string' && ns[slug].name.trim()) return ns[slug].name;
      if (tool.id && String(tool.id) !== slug && ns[String(tool.id)]?.name && typeof ns[String(tool.id)].name === 'string' && ns[String(tool.id)].name.trim()) return ns[String(tool.id)].name;
    }
  } catch { /* ignore */ }
  return fallback;
}

export function resolveToolNameClient(locale: string, tool: ToolLike, translate: NsTranslator): string {
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.nameEn || tool.name || slug || 'This tool';
  const tryKey = (k: string) => {
    try {
      const v = translate(k);
      if (v && v !== k && typeof v === 'string' && !/^\s*$/.test(v)) return v;
    } catch { /* ignore */ }
    return null;
  };
  if (slug) {
    const v1 = tryKey(`${slug}.name`); if (v1) return v1;
  }
  if (tool.id && String(tool.id) !== slug) {
    const v2 = tryKey(`${String(tool.id)}.name`); if (v2) return v2;
  }
  return fallback;
}

export function resolveToolDescriptionFromJson(locale: SeoLocale, tool: ToolLike, json: JsonMessages): string {
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.descriptionEn || tool.description || '';
  try {
    const ns = json?.tools || null;
    if (ns) {
      if (slug && ns[slug]?.description && typeof ns[slug].description === 'string' && ns[slug].description.trim()) return ns[slug].description;
      if (tool.id && String(tool.id) !== slug && ns[String(tool.id)]?.description && typeof ns[String(tool.id)].description === 'string' && ns[String(tool.id)].description.trim()) return ns[String(tool.id)].description;
    }
  } catch { /* ignore */ }
  return fallback;
}

export function resolveToolDescriptionClient(locale: string, tool: ToolLike, translate: NsTranslator): string {
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.descriptionEn || tool.description || '';
  const tryKey = (k: string) => {
    try {
      const v = translate(k);
      if (v && v !== k && typeof v === 'string' && !/^\s*$/.test(v)) return v;
    } catch { /* ignore */ }
    return null;
  };
  if (slug) {
    const v1 = tryKey(`${slug}.description`); if (v1) return v1;
  }
  if (tool.id && String(tool.id) !== slug) {
    const v2 = tryKey(`${String(tool.id)}.description`); if (v2) return v2;
  }
  return fallback;
}

export function buildToolFaqsFromJson(locale: SeoLocale, tool: ToolLike, _json: JsonMessages): FaqItem[] {
  const l = resolveLocale(locale);
  const name = resolveToolNameFromJson(locale, tool, _json);
  const bundle = FAQ_I18N[l] || FAQ_I18N.en;
  return FAQ_ORDER.map((k) => {
    const row = bundle[k];
    return {
      q: replaceName(row.q, name),
      a: replaceName(row.a, name),
    };
  });
}

export function buildToolFaqsFromTranslator(locale: string, tool: ToolLike, translate: NsTranslator): FaqItem[] {
  const l = resolveLocale(locale);
  const name = resolveToolNameClient(locale, tool, translate);
  const bundle = FAQ_I18N[l] || FAQ_I18N.en;
  return FAQ_ORDER.map((k) => {
    const row = bundle[k];
    return {
      q: replaceName(row.q, name),
      a: replaceName(row.a, name),
    };
  });
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
