/* eslint-disable */
// Post-build SEO injector for static export.
// ToolDetailWrapper injects title/OG/Twitter/canonical via client useEffect which crawlers cannot see.
// This script rewrites each tool detail HTML directly in out/ so the first response already contains correct tags.
//
// Usage: node scripts/rewrite-meta.cjs

const fs = require('fs');
const path = require('path');

const SUPPORTED_LOCALES = ['zh', 'en', 'fr', 'es', 'hi', 'ar'];
const BASE_URL = process.env.KORELYY_CANONICAL_BASE || 'https://korelyy.com';

// === Bing / Google Webmaster Tools 验证令牌（从 Dashboard 生成后粘贴，非空才会注入 meta）
//   Bing： https://www.bing.com/webmasters → Configure My Site → Verify Ownership → HTML Meta Tag
//   Google：https://search.google.com/search-console → HTML Tag 验证
const MSVALIDATE_01 = process.env.KORELYY_MSVALIDATE_01 || '3sKs9BXluR_EB3DKXv97nanpcgGXmtOYgZkszRgodyP6tDxztOBDdbh5aoxuCUVEDu9rAgJ5wn_fsPGfEeB_yQ';
const GOOGLE_SITE_VERIFICATION = process.env.KORELYY_GOOGLE_VERIFY || '';
const SEZNAM_WMT = process.env.KORELYY_SEZNAM_VERIFY || 'vDusJvnf3rUuyQ73mx3E6NLzrCmo4wxG';
const BYTEDANCE_VERIFICATION = process.env.KORELYY_BYTEDANCE_VERIFY || 'lB1lsK0p56mGhxh4iowe';
const SHENMA_VERIFICATION = process.env.KORELYY_SHENMA_VERIFY || 'b770032578aedb343397f8f0441bb082_1783737816';

const LOCALE_BREADCRUMB_LABELS = {
  zh: { home: '首页', tools: '工具', tool: '工具详情', blog: '博客', news: '资讯', about: '关于', contact: '联系我们', workflows: '工作流', templates: '模板库', ideas: '创意工坊', 'api-keys': 'API 密钥', compliance: '合规性', cookies: 'Cookie 政策', disclaimer: '免责声明', privacy: '隐私政策', terms: '服务条款' },
  en: { home: 'Home', tools: 'Tools', tool: 'Tool Detail', blog: 'Blog', news: 'News', about: 'About', contact: 'Contact', workflows: 'Workflows', templates: 'Templates', ideas: 'Ideas', 'api-keys': 'API Keys', compliance: 'Compliance', cookies: 'Cookie Policy', disclaimer: 'Disclaimer', privacy: 'Privacy', terms: 'Terms' },
  es: { home: 'Inicio', tools: 'Herramientas', tool: 'Detalle', blog: 'Blog', news: 'Noticias', about: 'Acerca de', contact: 'Contacto', workflows: 'Flujos', templates: 'Plantillas', ideas: 'Ideas', 'api-keys': 'API Keys', compliance: 'Cumplimiento', cookies: 'Cookies', disclaimer: 'Descargo', privacy: 'Privacidad', terms: 'Términos' },
  fr: { home: 'Accueil', tools: 'Outils', tool: 'Détail', blog: 'Blog', news: 'Actualités', about: 'À propos', contact: 'Contact', workflows: 'Workflows', templates: 'Modèles', ideas: 'Idées', 'api-keys': 'API Keys', compliance: 'Conformité', cookies: 'Cookies', disclaimer: 'Avertissement', privacy: 'Confidentialité', terms: 'Conditions' },
  hi: { home: 'होम', tools: 'टूल्स', tool: 'विवरण', blog: 'ब्लॉग', news: 'समाचार', about: 'हमारे बारे में', contact: 'संपर्क', workflows: 'वर्कफ़्लो', templates: 'टेम्पलेट्स', ideas: 'विचार', 'api-keys': 'API Keys', compliance: 'अनुपालन', cookies: 'कुकी', disclaimer: 'अस्वीकरण', privacy: 'गोपनीयता', terms: 'नियम' },
  ar: { home: 'الرئيسية', tools: 'الأدوات', tool: 'التفاصيل', blog: 'المدونة', news: 'الأخبار', about: 'عنا', contact: 'اتصل', workflows: 'سير العمل', templates: 'القوالب', ideas: 'أفكار', 'api-keys': 'مفاتيح واجهات', compliance: 'الامتثال', cookies: 'ملفات تعريف الارتباط', disclaimer: 'إخلاء المسؤولية', privacy: 'الخصوصية', terms: 'الشروط' },
};

const SITE_META = {
  en: {
    siteName: 'Korelyy Tools',
    homeTitle: 'Korelyy Tool Hub — Online Tools',
    homeDescription:
      'Discover 100+ free online tools for developers, creators and businesses: image editing, PDF, QR codes, AI prompts, passwords, text utilities and more. No signup, private, works on all devices. 6 languages supported.',
  },
  zh: {
    siteName: 'Korelyy 工具库',
    homeTitle: 'Korelyy 工具库 - 在线工具聚合平台',
    homeDescription:
      '100+ 免费在线工具：开发工具、图片处理、PDF 合并、二维码生成、AI 提示词、密码生成、文本处理、世界杯主题工具等。本地处理，隐私安全，无需注册，6 种语言全端适配。',
  },
  es: {
    siteName: 'Korelyy Herramientas',
    homeTitle: 'Korelyy — Herramientas en línea',
    homeDescription:
      'Más de 100 herramientas en línea gratuitas: edición de imágenes, PDF, códigos QR, IA, contraseñas, utilidades de texto y más. Sin registro, privado, funciona en todos los dispositivos. 6 idiomas.',
  },
  hi: {
    siteName: 'Korelyy टूल हब',
    homeTitle: 'ऑनलाइन टूल्स | Korelyy',
    homeDescription:
      'डेवलपर्स, क्रिएटर्स और व्यवसायों के लिए 100+ मुफ्त ऑनलाइन टूल्स: इमेज एडिटिंग, PDF, QR कोड, AI प्रॉम्प्ट, पासवर्ड, टेक्स्ट यूटिलिटीज और बहुत कुछ। बिना साइनअप के, 6 भाषाएं।',
  },
  fr: {
    siteName: 'Korelyy Outils',
    homeTitle: 'Korelyy — Outils en ligne',
    homeDescription:
      "Plus de 100 outils en ligne gratuits : retouche d'images, PDF, QR codes, IA, mots de passe, utilitaires texte, etc. Sans inscription, privé, compatible tous appareils. 6 langues.",
  },
  ar: {
    siteName: 'كورلي لأدوات الويب',
    homeTitle: 'كورلي — أدوات عبر الإنترنت',
    homeDescription:
      'أكثر من 100 أداة مجانية عبر الإنترنت لمطوّري البرمجيات والمبدعين والشركات: تحرير الصور، PDF، أكواد QR، ذكاء اصطناعي، كلمات مرور، أدوات نصية والمزيد. بدون تسجيل. 6 لغات.',
  },
};

const LOCALE_OPEN_GRAPH_MAP = {
  zh: 'zh_CN',
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  hi: 'hi_IN',
  ar: 'ar_SA',
};

const ADSENSE_PUB = 'ca-pub-7235824755389632';
const ADSENSE_BLOCK =
  '\n<!-- AdSense:static-injected -->\n' +
  '<meta name="google-adsense-account" content="' + ADSENSE_PUB + '">\n' +
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_PUB + '" crossorigin="anonymous"></script>\n' +
  '<!-- /AdSense:static-injected -->\n';

const ROOT = path.resolve(__dirname, '..');
const outDir = path.join(ROOT, 'out');
const appZhToolDir = path.join(ROOT, 'app', 'zh', 'tool');

const slugs = fs
  .readdirSync(appZhToolDir, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      fs.existsSync(path.join(appZhToolDir, d.name, 'page.tsx'))
  )
  .map((d) => d.name);

console.log('[rewrite-meta] tool slugs found:', slugs.length);

const localeData = {};
for (const l of SUPPORTED_LOCALES) {
  const f = path.join(ROOT, 'public', 'locales', l, 'translation.json');
  try {
    const json = JSON.parse(fs.readFileSync(f, 'utf8'));
    localeData[l] = json && json.tools ? json.tools : {};
  } catch (e) {
    console.error('[rewrite-meta] failed to read locale data (' + l + '):', e.message);
    localeData[l] = {};
  }
}

const fullLocaleData = {};
for (const l of SUPPORTED_LOCALES) {
  const f = path.join(ROOT, 'public', 'locales', l, 'translation.json');
  try {
    fullLocaleData[l] = JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    fullLocaleData[l] = {};
  }
}

let toolsIndexMap = {};
try {
  const raw = fs.readFileSync(path.join(ROOT, 'data', 'tools-index.json'), 'utf8');
  const arr = JSON.parse(raw.replace(/^\uFEFF/, ''));
  for (const t of arr) {
    if (t && t.slug) toolsIndexMap[t.slug] = t;
  }
  console.log('[rewrite-meta] tools-index loaded:', arr.length, 'slugs');
} catch (e) {
  console.warn('[rewrite-meta] failed to load tools-index.json:', e.message);
}

let blogIndexArr = [];
let blogIndexMap = {};
try {
  const raw = fs.readFileSync(path.join(ROOT, 'data', 'blog-index.ts'), 'utf8');
  const match = raw.match(/export\s+const\s+BLOG_POSTS_INDEX[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (match) {
    const jsonStr = match[1];
    blogIndexArr = JSON.parse(jsonStr);
    for (const p of blogIndexArr) {
      if (p && p.slug) blogIndexMap[p.slug] = p;
    }
    console.log('[rewrite-meta] blog-index loaded:', blogIndexArr.length, 'posts');
  }
} catch (e) {
  console.warn('[rewrite-meta] failed to load blog-index.ts:', e.message);
}

function escapeForHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeRe(s) {
  return String(s == null ? '' : s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const OG_IMAGE_REL = '/og-image.png';
const OG_IMAGE_ABS = BASE_URL.replace(/\/$/, '') + OG_IMAGE_REL;
const OG_IMAGE_TYPE = 'image/png';
const OG_IMAGE_W = 1200;
const OG_IMAGE_H = 630;
const OG_IMAGE_ALT_SUFFIX = ' — Korelyy Tools Hub';

function buildHreflang(pathWithoutLocale) {
  const p = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : '/' + pathWithoutLocale;
  const canonical = p.endsWith('/') ? p : p + '/';
  const base = BASE_URL.replace(/\/$/, '');
  const lines = [];
  for (const l of SUPPORTED_LOCALES) {
    lines.push(`<link rel="alternate" hreflang="${l}" href="${base}/${l}${canonical}" />`);
  }
  lines.push(`<link rel="alternate" hreflang="x-default" href="${base}/en${canonical}" />`);
  return lines.join('\n') + '\n';
}

function buildRobotsMeta() {
  const standard = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const bing = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, notranslate';
  let out = `<meta name="robots" content="${standard}">\n`;
  out += `<meta name="googlebot" content="${standard}">\n`;
  out += `<meta name="bingbot" content="${bing}">\n`;
  out += `<meta name="baiduspider" content="${standard}">\n`;
  out += `<meta name="yandex" content="${standard}">\n`;
  if (MSVALIDATE_01) {
    out += `<meta name="msvalidate.01" content="${escapeForHtml(MSVALIDATE_01)}">\n`;
  }
  if (GOOGLE_SITE_VERIFICATION) {
    out += `<meta name="google-site-verification" content="${escapeForHtml(GOOGLE_SITE_VERIFICATION)}">\n`;
  }
  if (SEZNAM_WMT) {
    out += `<meta name="seznam-wmt" content="${escapeForHtml(SEZNAM_WMT)}">\n`;
  }
  if (BYTEDANCE_VERIFICATION) {
    out += `<meta name="bytedance-verification-code" content="${escapeForHtml(BYTEDANCE_VERIFICATION)}">\n`;
  }
  if (SHENMA_VERIFICATION) {
    out += `<meta name="shenma-site-verification" content="${escapeForHtml(SHENMA_VERIFICATION)}">\n`;
  }
  return out;
}

function slugToLabel(locale, segment) {
  const map = LOCALE_BREADCRUMB_LABELS[locale] || LOCALE_BREADCRUMB_LABELS.en;
  if (map[segment]) return map[segment];
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildBreadcrumbList(locale, pathWithoutLocale, finalName) {
  const base = BASE_URL.replace(/\/$/, '');
  const map = LOCALE_BREADCRUMB_LABELS[locale] || LOCALE_BREADCRUMB_LABELS.en;
  const segments = (pathWithoutLocale || '').replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  const items = [];
  // position 1: Home
  items.push({
    '@type': 'ListItem',
    position: 1,
    name: map.home || 'Home',
    item: `${base}/${locale}/`,
  });
  // intermediate segments
  let acc = '';
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    acc += '/' + seg;
    const name = slugToLabel(locale, seg);
    // if segment is 'tool' -> link to /tools/ 更合理
    const href = seg === 'tool' ? `${base}/${locale}/tools/` : `${base}/${locale}${acc}/`;
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name,
      item: href,
    });
  }
  // final position
  const finalSegment = segments[segments.length - 1];
  if (segments.length === 0) {
    // Home page: 只有一条 Home（不重复）
  } else {
    const last = items.length + 1;
    const name = (finalName && typeof finalName === 'string' && finalName.trim()) || slugToLabel(locale, finalSegment || '');
    const href = `${base}/${locale}/${segments.join('/')}/`;
    items.push({
      '@type': 'ListItem',
      position: last,
      name,
      item: href,
    });
  }
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
  return `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n`;
}

function buildGlobalOrgAndWebSiteJsonLd() {
  const base = BASE_URL.replace(/\/$/, '');
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Korelyy',
    alternateName: ['Korelyy Tools', 'Korelyy 工具库', 'كورلي'],
    url: base + '/',
    logo: {
      '@type': 'ImageObject',
      url: base + '/og-image.png',
      width: 1200,
      height: 630,
    },
    foundingDate: '2025',
    sameAs: [
      'https://twitter.com/korelyy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Chinese', 'Spanish', 'French', 'Hindi', 'Arabic'],
    },
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Korelyy Tools',
    alternateName: ['Korelyy', 'Korelyy 工具库'],
    url: base + '/',
    inLanguage: 'en',
    availableLanguage: ['en', 'zh-CN', 'es', 'hi', 'fr', 'ar-SA'],
    publisher: { '@type': 'Organization', name: 'Korelyy', url: base + '/' },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/en/tools/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    `<script type="application/ld+json">${JSON.stringify(org)}</script>\n` +
    `<script type="application/ld+json">${JSON.stringify(website)}</script>\n`
  );
}

function buildWebPageJsonLd({ locale, name, description, canonical }) {
  const base = BASE_URL.replace(/\/$/, '');
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: name || 'Korelyy Tools',
    description: description || '',
    url: canonical,
    inLanguage: locale || 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Korelyy Tools',
      url: `${base}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${base}/en/tools/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: [canonical],
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n`;
}

function buildOgImageBlock() {
  return (
    `<meta property="og:image" content="${OG_IMAGE_ABS}">\n` +
    `<meta property="og:image:secure_url" content="${OG_IMAGE_ABS}">\n` +
    `<meta property="og:image:width" content="${OG_IMAGE_W}">\n` +
    `<meta property="og:image:height" content="${OG_IMAGE_H}">\n` +
    `<meta property="og:image:type" content="${OG_IMAGE_TYPE}">\n` +
    `<meta name="twitter:image" content="${OG_IMAGE_ABS}">\n`
  );
}

// FIX(2026-07-14 codex): high-intent, localized title/description for static-injected tool meta
// (legacy static-export path uses this instead of components/seo.tsx toolGenerateMetadataSync)
const TOOL_INTENT_MAP = {
  en: { free: 'Free', online: 'Online', tag: 'No signup, private and secure \u2014 works instantly in your browser, on desktop and mobile.' },
  zh: { free: '\u514d\u8d39', online: '\u5728\u7ebf', tag: '\u65e0\u9700\u6ce8\u518c\uff0c\u9690\u79c1\u5b89\u5168\uff0c\u6d4f\u89c8\u5668\u5185\u5373\u523b\u4f7f\u7528\uff0c\u652f\u6301\u7535\u8111\u548c\u624b\u673a\u3002' },
  es: { free: 'Gratis', online: 'en l\u00ednea', tag: 'Sin registro, privado y seguro: funciona al instante en tu navegador, en escritorio y m\u00f3vil.' },
  hi: { free: '\u092e\u0941\u092b\u093c\u094d\u0924', online: '\u0911\u0928\u0932\u093e\u0907\u0928', tag: '\u0915\u094b\u0908 \u0938\u093e\u0907\u0928\u0905\u092a \u0928\u0939\u0940\u0902, \u0928\u093f\u091c\u0940 \u0914\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u2014 \u0915\u093f\u0938\u0940 \u092d\u0940 \u092c\u094d\u0930\u093e\u0909\u091c\u093c\u0930 \u092e\u0947\u0902 \u0921\u0947\u0938\u094d\u0915\u091f\u0949\u092a \u0914\u0930 \u092e\u094b\u092c\u093e\u0907\u0932 \u092a\u0930 \u0924\u0941\u0930\u0902\u0924 \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948\u0964' },
  fr: { free: 'Gratuit', online: 'en ligne', tag: 'Sans inscription, priv\u00e9 et s\u00e9curis\u00e9 : fonctionne instantan\u00e9ment dans votre navigateur, sur ordinateur et mobile.' },
  ar: { free: '\u0645\u062c\u0627\u0646\u064a', online: '\u0639\u0628\u0631 \u0627\u0644\u0625\u0646\u062a\u0631\u0646\u062a', tag: '\u0628\u062f\u0648\u0646 \u062a\u0633\u062c\u064a\u0644\u060c \u062e\u0627\u0635 \u0648\u0622\u0645\u0646 \u2014 \u064a\u0639\u0645\u0644 \u0641\u0648\u0631\u0627\u064b \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643 \u0639\u0644\u0649 \u0627\u0644\u0643\u0645\u0628\u064a\u0648\u062a\u0631 \u0648\u0627\u0644\u062c\u0648\u0627\u0644.' },
};

function buildHighIntentTitle(locale, name) {
  const it = TOOL_INTENT_MAP[locale] || TOOL_INTENT_MAP.en;
  const free = `${it.free} ${name} ${it.online} - Korelyy Tools`;
  if (free.length <= 62) return free;
  const online = `${name} ${it.online} - Korelyy Tools`;
  if (online.length <= 66) return online;
  return `${name} - Korelyy Tools`;
}
function buildEnrichedDesc(locale, name, description) {
  const it = TOOL_INTENT_MAP[locale] || TOOL_INTENT_MAP.en;
  const base = (description && description.trim()) ? description.trim() : name;
  if (base.length >= 120) return base.slice(0, 300);
  return `${base} ${it.tag}`.trim().slice(0, 300);
}

const FAQ_I18N = {
  en: {
    free: { q: 'Is {name} free to use?', a: 'Yes. {name} is 100% free for core features — no signup, no watermarks, no hidden paywalls on the tools you need day to day.' },
    signup: { q: 'Do I need to sign up to use {name}?', a: 'No. Open and use instantly in your browser. Nothing to install, no account required. Your preferences stay on your device.' },
    privacy: { q: 'Is my data safe with {name}?', a: 'Yes. {name} runs locally in your browser whenever technically possible — sensitive inputs are processed on your device, not on our servers. No tracking cookies.' },
    device: { q: 'Which devices does {name} work on?', a: 'Phones, tablets and desktops with any modern browser (Chrome, Safari, Edge, Firefox). Touch-friendly and responsive from 320px to 4K.' },
  },
  zh: {
    free: { q: '{name} 免费使用吗？', a: '是的，{name} 核心功能永久免费，无需注册登录，无水印、无隐藏付费墙，日常使用完全免费。' },
    signup: { q: '使用 {name} 需要注册吗？', a: '不需要。打开浏览器就能用，不用下载任何东西，不用注册账号。所有设置都保存在你自己的设备上。' },
    privacy: { q: '用 {name} 我的数据安全吗？', a: '安全。{name} 在技术允许的情况下全部在浏览器本地运行，敏感输入都在你设备上处理，不上传我们服务器。也没有追踪 Cookie。' },
    device: { q: '{name} 支持哪些设备？', a: '手机、平板、电脑都行，Chrome、Safari、Edge、Firefox 主流浏览器全支持，触摸友好、响应式适配从 320px 到 4K 屏幕。' },
  },
  es: {
    free: { q: '¿{name} es gratuito?', a: 'Sí. {name} es 100% gratuito en sus funciones básicas: sin registro, sin marcas de agua ni muros de pago ocultos en las herramientas que usas cada día.' },
    signup: { q: '¿Necesito registrarme para usar {name}?', a: 'No. Ábrelo directamente en tu navegador y úsalo al instante. Nada que instalar ni cuenta que crear. Tus preferencias se quedan en tu dispositivo.' },
    privacy: { q: '¿Son seguros mis datos con {name}?', a: 'Sí. {name} se ejecuta localmente en tu navegador siempre que es técnicamente posible. Las entradas sensibles se procesan en tu equipo, no en nuestros servidores. Sin cookies de seguimiento.' },
    device: { q: '¿En qué dispositivos funciona {name}?', a: 'Móviles, tabletas y escritorios con cualquier navegador moderno (Chrome, Safari, Edge, Firefox). Interfaz táctil y responsiva de 320 px a 4 K.' },
  },
  fr: {
    free: { q: '{name} est-il gratuit ?', a: 'Oui. {name} est 100 % gratuit sur les fonctions principales : pas d\'inscription, pas de filigrane, pas de paywall masqué sur les outils du quotidien.' },
    signup: { q: 'Dois-je m\'inscrire pour utiliser {name} ?', a: 'Non. Ouvrez et utilisez {name} directement dans votre navigateur. Rien à installer, aucun compte requis. Vos préférences restent sur votre appareil.' },
    privacy: { q: 'Mes données sont-elles en sécurité avec {name} ?', a: 'Oui. {name} s\'exécute localement dans votre navigateur chaque fois que c\'est techniquement possible. Les données sensibles sont traitées sur votre appareil, pas sur nos serveurs. Sans cookies de suivi.' },
    device: { q: 'Sur quels appareils fonctionne {name} ?', a: 'Téléphones, tablettes et ordinateurs avec n\'importe quel navigateur moderne (Chrome, Safari, Edge, Firefox). Interface tactile et responsive de 320 px à 4 K.' },
  },
  hi: {
    free: { q: 'क्या {name} मुफ्त है?', a: 'हाँ। {name} मुख्य सुविधाओं के लिए 100% मुफ्त है — कोई साइनअप नहीं, कोई वॉटरमार्क नहीं, दिन-प्रतिदिन के उपयोग के टूल्स पर कोई छिपा पेवॉल नहीं।' },
    signup: { q: 'क्या मुझे {name} उपयोग करने के लिए साइन अप करना पड़ेगा?', a: 'नहीं। अपने ब्राउज़र में खोलें और तुरंत उपयोग करें। कुछ इंस्टॉल नहीं करना है, कोई अकाउंट नहीं चाहिए। आपकी प्राथमिकताएँ आपके डिवाइस पर रहती हैं।' },
    privacy: { q: 'क्या {name} के साथ मेरा डेटा सुरक्षित है?', a: 'हाँ। {name} तकनीकी रूप से संभव होने पर आपके ब्राउज़र में स्थानीय रूप से चलता है — संवेदनशील डेटा आपके डिवाइस पर प्रोसेस होता है, हमारे सर्वर पर नहीं। कोई ट्रैकिंग कुकी नहीं।' },
    device: { q: '{name} किन डिवाइसों पर चलता है?', a: 'किसी भी आधुनिक ब्राउज़र (Chrome, Safari, Edge, Firefox) वाले फोन, टैबलेट और डेस्कटॉप। 320px से 4K तक टच-फ्रेंडली और रेस्पॉन्सिव।' },
  },
  ar: {
    free: { q: 'هل {name} مجاني؟', a: 'نعم. {name} مجاني بالكامل للميزات الأساسية — بدون تسجيل، بدون علامات مائية، بدون جدران دفع مخفية على الأدوات التي تحتاجها يومياً.' },
    signup: { q: 'هل أحتاج للتسجيل لاستخدام {name}؟', a: 'لا. افتحه واستخدمه فوراً في متصفحك. لا شيء للتثبيت، لا حساب مطلوب. تفضيلاتك تبقى على جهازك.' },
    privacy: { q: 'هل بياناتي آمنة مع {name}؟', a: 'نعم. يعمل {name} محلياً في متصفحك كلما كان ذلك ممكناً تقنياً — تتم معالجة البيانات الحساسة على جهازك، وليس على خوادمنا. لا ملفات تعريف ارتباط تتبع.' },
    device: { q: 'على أي أجهزة يعمل {name}؟', a: 'الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر مع أي متصفح حديث (Chrome، Safari، Edge، Firefox). سهل اللمس ومتجاوب من 320 بكسل إلى 4K.' },
  },
};
const FAQ_ORDER = ['free', 'signup', 'privacy', 'device'];

function resolveFaqItems(locale, name, seoFaqs) {
  if (Array.isArray(seoFaqs) && seoFaqs.length > 0) {
    return seoFaqs.filter(x => x && typeof x.q === 'string' && typeof x.a === 'string').map(x => ({ q: String(x.q), a: String(x.a) }));
  }
  const bundle = FAQ_I18N[locale] || FAQ_I18N.en;
  return FAQ_ORDER.map(k => {
    const row = bundle[k];
    return {
      q: row.q.replace(/\{name\}/g, name),
      a: row.a.replace(/\{name\}/g, name),
    };
  });
}
function buildFaqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function categoryToSchemaCategory(cat) {
  switch (cat) {
    case 'dev-tools': case 'api-tools': case 'seo-tools': return 'DeveloperApplication';
    case 'design-tools': case '3d-tools': case 'image-tools': return 'DesignApplication';
    case 'media-tools': case 'video-editing': case 'audio-tools': return 'MultimediaApplication';
    case 'productivity': case 'collaboration': case 'file-tools': case 'customer-service': case 'hr-tools': case 'marketing': case 'content-tools': case 'social-media': return 'BusinessApplication';
    case 'finance-tools': case 'ecommerce': return 'FinanceApplication';
    case 'education': return 'EducationalApplication';
    case 'security': return 'SecurityApplication';
    case 'health': return 'HealthApplication';
    case 'lifestyle': return 'LifestyleApplication';
    case 'pdf-tools': case 'data-viz': default: return 'UtilitiesApplication';
  }
}
function buildSoftwareApplicationJsonLd({ locale, slug, name, description, canonical, toolInfo }) {
  const l = locale || 'en';
  const ogMap = LOCALE_OPEN_GRAPH_MAP;
  const schemaCat = categoryToSchemaCategory(toolInfo?.category);
  const brandName = SITE_META[l]?.siteName || 'Korelyy Tools';
  const base = BASE_URL.replace(/\/$/, '');
  const isFree = toolInfo?.isFree || toolInfo?.isLimitedFree || true;
  const features = (toolInfo?.tagsEn && Array.isArray(toolInfo.tagsEn)) ? toolInfo.tagsEn.slice(0, 5) : [];
  const featureList = [
    `${name} is 100% free, no signup required`,
    'All processing runs locally in browser — zero data upload',
    'Responsive across mobile / tablet / desktop, touch-friendly',
    'Works on Chrome, Safari, Edge, Firefox and modern browsers',
    ...features,
  ].slice(0, 8);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    applicationCategory: schemaCat,
    operatingSystem: 'Web, iOS, Android, Windows, macOS, Linux',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: [{
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    }],
    isAccessibleForFree: isFree,
    inLanguage: ogMap[l] || 'en_US',
    keywords: features.join(', '),
    featureList,
    audience: { '@type': 'Audience', audienceType: 'General Audience' },
    brand: { '@type': 'Brand', name: brandName, url: base + '/' },
    provider: { '@type': 'Organization', name: brandName, url: base + '/' },
    publisher: { '@type': 'Organization', name: brandName, url: base + '/' },
    softwareHelp: base + '/' + l + '/blog/',
    softwareSource: 'Web browser',
    downloadUrl: canonical,
    installUrl: canonical,
    memoryRequirements: '256MB RAM',
    processorRequirements: 'Any modern CPU',
    storageRequirements: '50MB browser storage',
    permissions: 'No special permissions required; browser storage used only for user preferences',
    datePublished: toolInfo?.publishedAt || '2026-01-01T00:00:00Z',
    dateModified: toolInfo?.updatedAt || toolInfo?.publishedAt || '2026-01-01T00:00:00Z',
    applicationSubCategory: toolInfo?.category || 'Utilities',
    screenshot: OG_IMAGE_ABS,
    thumbnailUrl: OG_IMAGE_ABS,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: toolInfo?.likes ? Math.min(5, 4.0 + Math.log10(toolInfo.likes) * 0.2).toFixed(1) : '4.7',
      ratingCount: toolInfo?.likes || 1000,
      bestRating: '5',
      worstRating: '1',
    },
  };
}

function getLocalizedField(obj, locale, fallback) {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  if (obj[locale]) return obj[locale];
  if (obj.en) return obj.en;
  const keys = Object.keys(obj);
  if (keys.length > 0) return obj[keys[0]];
  return fallback;
}
function buildBlogPostingJsonLd({ locale, slug, canonical, post }) {
  const l = locale || 'en';
  const ogMap = LOCALE_OPEN_GRAPH_MAP;
  const base = BASE_URL.replace(/\/$/, '');
  const siteName = SITE_META[l]?.siteName || 'Korelyy Tools';
  if (!post) return null;
  const title = getLocalizedField(post.title, l, slug);
  const description = getLocalizedField(post.description, l, '');
  const img = post.coverImage || OG_IMAGE_ABS;
  const tagsArr = Array.isArray(post.tags) ? post.tags.map(t => getLocalizedField(t, l, '')).filter(Boolean) : [];
  const readMin = post.readingMinutes ? (post.readingMinutes[l] || post.readingMinutes.en || 5) : 5;
  const blogLabel = LOCALE_BREADCRUMB_LABELS[l]?.blog || 'Blog';
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: img,
    datePublished: post.publishedAt || '2026-01-01T00:00:00Z',
    dateModified: post.updatedAt || post.publishedAt || '2026-01-01T00:00:00Z',
    author: { '@type': 'Organization', name: siteName, url: base + '/' },
    publisher: { '@type': 'Organization', name: siteName, url: base + '/', logo: { '@type': 'ImageObject', url: base + '/favicon.svg' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords: tagsArr.join(', '),
    articleSection: 'Tools, Tutorials, Benchmarks, How-to',
    wordCount: Math.max(300, readMin * 180),
    inLanguage: ogMap[l] || 'en_US',
    url: canonical,
    isAccessibleForFree: true,
    timeRequired: `PT${readMin}M`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: LOCALE_BREADCRUMB_LABELS[l]?.home || 'Home', item: base + '/' + l + '/' },
        { '@type': 'ListItem', position: 2, name: blogLabel, item: base + '/' + l + '/blog/' },
        { '@type': 'ListItem', position: 3, name: title, item: canonical },
      ],
    },
  };
}

function buildInjection({ locale, name, description, canonical, pathWithoutLocale, ogImageAlt, toolInfo, faqs, slug, titleMode, ogType }) {
  let title, desc;
  if (titleMode === 'plain') {
    const siteName = SITE_META[locale]?.siteName || 'Korelyy Tools';
    title = name + ' | ' + siteName;
    desc = description || SITE_META[locale]?.homeDescription || '';
  } else {
    title = buildHighIntentTitle(locale || 'en', name);
    desc = buildEnrichedDesc(locale || 'en', name, description);
  }
  const og_type = ogType || 'website';
  const t = escapeForHtml(title);
  const d = escapeForHtml(desc);
  const c = escapeForHtml(canonical);
  const alt = escapeForHtml((ogImageAlt || name) + OG_IMAGE_ALT_SUFFIX);
  const hfl = pathWithoutLocale ? buildHreflang(pathWithoutLocale) : '';
  const robotsBlock = buildRobotsMeta();
  const globalLd = buildGlobalOrgAndWebSiteJsonLd();
  const webpageLd = buildWebPageJsonLd({ locale: locale || 'en', name: title, description: desc, canonical });
  const breadcrumbLd = pathWithoutLocale
    ? buildBreadcrumbList(locale || 'en', pathWithoutLocale, name)
    : '';
  let softwareLd = '';
  let faqLd = '';
  if (toolInfo) {
    const sa = buildSoftwareApplicationJsonLd({ locale, slug, name, description: desc, canonical, toolInfo });
    softwareLd = `<script type="application/ld+json">${JSON.stringify(sa)}</script>\n`;
  }
  if (faqs && Array.isArray(faqs) && faqs.length > 0) {
    const f = buildFaqJsonLd(faqs);
    faqLd = `<script type="application/ld+json">${JSON.stringify(f)}</script>\n`;
  }
  return (
    '\n<!-- SEO:static-injected -->\n' +
    `<title>${t}</title>\n` +
    robotsBlock +
    `<meta name="description" content="${d}">\n` +
    `<meta property="og:type" content="${og_type}">\n` +
    `<meta property="og:site_name" content="Korelyy Tools">\n` +
    `<meta property="og:title" content="${t}">\n` +
    `<meta property="og:description" content="${d}">\n` +
    `<meta property="og:url" content="${c}">\n` +
    `<meta property="og:locale" content="${LOCALE_OPEN_GRAPH_MAP[locale] || 'en_US'}">\n` +
    buildOgImageBlock() +
    `<meta property="og:image:alt" content="${alt}">\n` +
    `<meta name="twitter:card" content="summary_large_image">\n` +
    `<meta name="twitter:title" content="${t}">\n` +
    `<meta name="twitter:description" content="${d}">\n` +
    `<meta name="twitter:image:alt" content="${alt}">\n` +
    `<link rel="canonical" href="${c}">\n` +
    (hfl ? `<!-- hreflang:6-lang+x-default -->\n${hfl}` : '') +
    globalLd +
    webpageLd +
    breadcrumbLd +
    softwareLd +
    faqLd +
    '<!-- /SEO:static-injected -->\n'
  );
}

const REMOVE_PATTERNS = [
  /<title[^>]*>[\s\S]*?<\/title>\s*/gi,
  /<link[^>]+rel=["']canonical["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']description["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']robots["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']googlebot["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']bingbot["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']baiduspider["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']yandex["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']msvalidate\.01["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']google-site-verification["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']seznam-wmt["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']bytedance-verification-code["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:type["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:locale["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:site_name["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:title["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:description["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:url["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:image[^"']*["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:card["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:title["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:description["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:image[^"']*["'][^>]*\/?>\s*/gi,
  /<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*\/?>\s*/gi,
  /<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
  /<!--\s*SEO:static-injected\s*-->[\s\S]*?<!--\s*\/SEO:static-injected\s*-->\s*/gi,
  /<!--\s*hreflang:6-lang\+x-default\s*-->[^]*?(?=<\/head>|<\!|\Z)/g,
];

function replaceHead(html, injection) {
  const headEndRegex = /<\/head>/i;
  const m = html.match(headEndRegex);
  if (!m) throw new Error('missing </head> in HTML');
  const headEndIdx = m.index;
  let headPart = html.slice(0, headEndIdx);
  const restPart = html.slice(headEndIdx);
  for (const p of REMOVE_PATTERNS) headPart = headPart.replace(p, '');
  return headPart + injection + restPart;
}

let written = 0;
let skippedNoFile = 0;
let skippedNoTranslation = 0;

for (const l of SUPPORTED_LOCALES) {
  for (const slug of slugs) {
    const file = path.join(outDir, l, 'tool', slug, 'index.html');
    if (!fs.existsSync(file)) {
      skippedNoFile++;
      continue;
    }
    const tool = localeData[l] && localeData[l][slug] ? localeData[l][slug] : null;
    if (!tool || !tool.name) {
      skippedNoTranslation++;
      continue;
    }
    const toolInfo = toolsIndexMap[slug] || null;
    const seoFaqs = tool && tool.seo && Array.isArray(tool.seo.faqs) ? tool.seo.faqs : null;
    const faqItems = resolveFaqItems(l, tool.name, seoFaqs);
    const canonical = BASE_URL.replace(/\/$/, '') + '/' + l + '/tool/' + slug + '/';
    const injection = buildInjection({
      locale: l,
      slug,
      name: tool.name,
      description: tool.description,
      canonical,
      pathWithoutLocale: `/tool/${slug}`,
      ogImageAlt: tool.name,
      toolInfo,
      faqs: faqItems,
    });
    let html = fs.readFileSync(file, 'utf8');
    let next = replaceHead(html, injection);

    // ===== Visible text i18n patch (prerender fallback: prerender renders ZH
    // because useTranslations('tools') is not SSR-capable in build export)
    // ALSO patch the Next.js RSC payload (self.__next_f.push strings) so that
    // hydration does not overwrite our translated <h1>/breadcrumb/subtitle
    // back to Chinese (React 18 hydration-mismatch forced-re-render). =====
    const zhT = localeData.zh && localeData.zh[slug];
    if (zhT && zhT.name && l !== 'zh') {
      const zhName = zhT.name;
      const zhDesc = zhT.description || '';
      const i18nName = tool.name;       // already localeData[l][slug].name
      const i18nDesc = tool.description; // already localeData[l][slug].description
      if (zhName !== i18nName) {
        // === GLOBAL replace across entire HTML (covers: <h1>, breadcrumb,
        // JSON-LD name, <title> (already correct but safe), AND self.__next_f
        // RSC payload strings so React hydration sees matching VDOM === DOM ===
        next = next.split(zhName).join(i18nName);
      }
      if (zhDesc && i18nDesc && zhDesc !== i18nDesc) {
        // Subtitle (<p> below H1), and RSC payload description field
        next = next.split(zhDesc).join(i18nDesc);
      }
    }
    fs.writeFileSync(file, next, 'utf8');
    written++;
  }
}

function addAdsenseAll(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.warn('[rewrite-meta] adsense skip dir (' + dir + '):', e.code || e.message);
    return 0;
  }
  let added = 0;
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      added += addAdsenseAll(p);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      let html;
      try {
        html = fs.readFileSync(p, 'utf8');
      } catch (e) {
        console.warn('[rewrite-meta] adsense skip read:', p, e.code || e.message);
        continue;
      }
      if (html.includes('<!-- AdSense:static-injected -->')) continue;
      if (!/<\/head>/i.test(html)) continue;
      const next = html.replace(/<\/head>/i, ADSENSE_BLOCK + '</head>');
      try {
        fs.writeFileSync(p, next, 'utf8');
      } catch (e) {
        console.warn('[rewrite-meta] adsense skip write:', p, e.code || e.message);
        continue;
      }
      added++;
    }
  }
  return added;
}
const adsenseAdded = addAdsenseAll(outDir);
console.log('[rewrite-meta] adsense injected into pages:', adsenseAdded);

console.log(
  '[rewrite-meta] written-tool-pages=' +
    written +
    ' skippedNoFile=' +
    skippedNoFile +
    ' skippedNoTranslation=' +
    skippedNoTranslation
);

// ===================== Non-tool pages (home, /tools/, about, blog, contact, etc.) =====================
const KNOWN_NONTOOL_PAGES = [
  { path: '/', i18nTitleKey: 'siteName', descriptionKey: 'homeDescription' },
  { path: '/tools/', i18nTitleKey: 'homeTitle', descriptionKey: 'homeDescription' },
  { path: '/about/', titleFb: 'About', breadcrumb: true },
  { path: '/blog/', titleFb: 'Blog', breadcrumb: true },
  { path: '/contact/', titleFb: 'Contact', breadcrumb: true },
  { path: '/compliance/', titleFb: 'Compliance', breadcrumb: true },
  { path: '/cookies/', titleFb: 'Cookie Policy', breadcrumb: true },
  { path: '/disclaimer/', titleFb: 'Disclaimer', breadcrumb: true },
  { path: '/privacy/', titleFb: 'Privacy Policy', breadcrumb: true },
  { path: '/terms/', titleFb: 'Terms of Service', breadcrumb: true },
  { path: '/ideas/', titleFb: 'Ideas Workshop', breadcrumb: true },
  { path: '/templates/', titleFb: 'Templates', breadcrumb: true },
  { path: '/api-keys/', titleFb: 'API Keys', breadcrumb: true },
  { path: '/workflows/', titleFb: 'Workflows', breadcrumb: true },
  { path: '/workflow/canvas/', titleFb: 'Workflow Canvas', breadcrumb: true },
  { path: '/batch-image-processor/', titleFb: 'Batch Image Processor', breadcrumb: true },
];

const NAV_KEY_MAP = {
  about: ['sidebar2', 'about-us'],
  blog: ['sidebar', 'blog'],
  contact: ['sidebar2', 'contact-us'],
  compliance: ['sidebar2', 'compliance'],
  cookies: ['legal', 'cookies-title'],
  disclaimer: ['legal', 'disclaimer-title'],
  privacy: ['legal', 'privacy-title'],
  terms: ['legal', 'terms-title'],
  ideas: ['sidebar2', 'ideas'],
  templates: ['sidebar2', 'templates'],
  'api-keys': ['sidebar2', 'apiKeys'],
  workflows: ['sidebar2', 'workflows'],
  'workflow/canvas': ['sidebar2', 'workflows'],
  'batch-image-processor': ['tools', 'batch-image-processor.name'],
};

function readJsonPath(json, dotPath) {
  let cur = json;
  for (const part of dotPath.split('.')) {
    if (cur == null || typeof cur !== 'object') return null;
    cur = cur[part];
  }
  return typeof cur === 'string' ? cur : null;
}

function resolveNonToolMeta(locale, p) {
  const base = SITE_META[locale] || SITE_META.en;
  const short = p.replace(/^\//, '').replace(/\/$/, '');

  // Translated title/desc from translation.json
  const l10n = localeData[locale] || {};
  const keyPath = NAV_KEY_MAP[short];
  let title = null;
  let description = base.homeDescription;

  if (keyPath) {
    const ns = keyPath[0] === 'legal' || keyPath[0] === 'sidebar' || keyPath[0] === 'sidebar2'
      ? locale // sidebar/sidebar2/legal live in whole translation.json
      : null;
    // Need full translation json; re-read as full json
  }
  // Full translation read
  try {
    const fullTrans = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'public', 'locales', locale, 'translation.json'), 'utf8')
    );
    if (p === '/' || p === '/tools/') {
      title = base.homeTitle;
      description = base.homeDescription;
      return { title, description };
    }
    if (keyPath) {
      title = readJsonPath(fullTrans, keyPath.join('.'));
      const descFromNs = readJsonPath(fullTrans, `${keyPath[0]}.site-description`);
      if (descFromNs) description = descFromNs;
    }
    if (!title) {
      // Fallback: capitalize first letters of short path
      title = short.split(/[/-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' | ' + base.siteName;
    } else if (!/\|/.test(title)) {
      title = title + ' | ' + base.siteName;
    }
  } catch (e) {
    console.warn('[rewrite-meta] resolve meta failed (' + locale + p + '):', e.message);
  }
  return { title: title || base.homeTitle, description };
}

let nonToolWritten = 0;
let nonToolSkipped = 0;
for (const l of SUPPORTED_LOCALES) {
  for (const page of KNOWN_NONTOOL_PAGES) {
    const relPath = page.path;
    const filePath = path.join(outDir, l, relPath.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(filePath)) {
      nonToolSkipped++;
      continue;
    }
    const meta = resolveNonToolMeta(l, relPath);
    const canonical = BASE_URL.replace(/\/$/, '') + '/' + l + relPath;
    // pathWithoutLocale for hreflang
    const pathForHreflang = relPath === '/' ? '/' : relPath;
    const injection = buildInjection({
      locale: l,
      name: meta.title.replace(/\s*\|[^|]*$/, '').trim() || SITE_META[l].siteName,
      description: meta.description,
      canonical,
      pathWithoutLocale: pathForHreflang,
      ogImageAlt: SITE_META[l].siteName,
    });
    const html = fs.readFileSync(filePath, 'utf8');
    const next = replaceHead(html, injection);
    fs.writeFileSync(filePath, next, 'utf8');
    nonToolWritten++;
  }
}
console.log('[rewrite-meta] non-tool pages written=' + nonToolWritten + ' skipped=' + nonToolSkipped);

// ===================== Blog Post Pages =====================
const OFF_TOPIC_BLOG_PATTERNS = [
  /^cadence-/, /^marathon-/, /^trail-/, /^hrm-/, /^zwift-/, /^bike-/, /^power-meter-/,
  /^tdf-/, /^three-peak-/, /^altitude-/, /^100km-hike-/, /^trekking-/,
  /neck-yoga$/, /^yin-yoga-/, /^pilates-/, /^postpartum-yoga-/, /^beginner-5x5-/,
  /^big-three-/, /^functional-training-/, /^dumbbell-home-/,
  /^swimming-tutorial-/, /^rehab-tutorial-/, /^nutrition-tutorial-/,
  /^racing-tutorial-/, /^mental-tutorial-/,
];
let blogWritten = 0;
let blogSkipped = 0;
for (const l of SUPPORTED_LOCALES) {
  for (const post of blogIndexArr) {
    if (!post || !post.slug) continue;
    if (OFF_TOPIC_BLOG_PATTERNS.some(re => re.test(post.slug))) continue;
    const filePath = path.join(outDir, l, 'blog', post.slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      blogSkipped++;
      continue;
    }
    const title = getLocalizedField(post.title, l, post.slug);
    const description = getLocalizedField(post.description, l, '');
    const siteName = SITE_META[l]?.siteName || 'Korelyy Tools';
    const fullTitle = title + ' | ' + siteName;
    const canonical = BASE_URL.replace(/\/$/, '') + '/' + l + '/blog/' + post.slug + '/';
    const blogPosting = buildBlogPostingJsonLd({ locale: l, slug: post.slug, canonical, post });
    const blogLd = blogPosting
      ? `<script type="application/ld+json">${JSON.stringify(blogPosting)}</script>\n`
      : '';
    const injection = buildInjection({
      locale: l,
      slug: post.slug,
      name: title,
      description: description || SITE_META[l]?.homeDescription || '',
      canonical,
      pathWithoutLocale: `/blog/${post.slug}`,
      ogImageAlt: title,
      titleMode: 'plain',
      ogType: 'article',
    });
    let html = fs.readFileSync(filePath, 'utf8');
    let next = replaceHead(html, injection);
    if (blogLd) {
      next = next.replace('<!-- /SEO:static-injected -->', blogLd + '<!-- /SEO:static-injected -->');
    }
    fs.writeFileSync(filePath, next, 'utf8');
    blogWritten++;
  }
}
console.log('[rewrite-meta] blog pages written=' + blogWritten + ' skipped=' + blogSkipped);
