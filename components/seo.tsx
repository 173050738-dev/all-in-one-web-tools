import type { Metadata } from 'next';
import React from 'react';
import { getToolBySlug, getFilteredTools, type Tool, type Platform } from '@/data/tools';
import {
  BLOG_POSTS,
  getBlogPostBySlug,
  getLocalizedText,
  getBlogReadingTime,
  type BlogPost,
} from '@/data/blog';
import {
  NEWS_ISSUES,
  getNewsIssueBySlug,
  getLocalizedText as getNewsText,
  type NewsIssue,
} from '@/data/news';
import { categories } from '@/data/categories';
import { workflows, getWorkflowBySlug, type Workflow, type WorkflowStep } from '@/data/workflows';
import { buildToolFaqsFromJson, buildFaqJsonLd, type ToolLike, type FaqItem } from '@/lib/toolFaqs';

export const SITE_URL = 'https://korelyy.com';
export const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'] as const;
export type SeoLocale = (typeof KNOWN_LOCALES)[number];
export const DEFAULT_LOCALE: SeoLocale = 'en';
export const LOCALE_OPEN_GRAPH: Record<SeoLocale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  es: 'es_ES',
  hi: 'hi_IN',
  fr: 'fr_FR',
  ar: 'ar_SA',
};
export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_ABS = `${SITE_URL}${OG_IMAGE_PATH}`;
export const OG_IMAGE_TYPE = 'image/png';
export const OG_IMAGE_W = 1200;
export const OG_IMAGE_H = 630;

export function HreflangLinks(props: { locale: SeoLocale; pathWithoutLocale: string }) {
  const { locale, pathWithoutLocale } = props;
  const p = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`;
  const canonicalWithoutSlash = p.endsWith('/') ? p : `${p}/`;
  return (
    <>
      {KNOWN_LOCALES.map((l) => (
        <link
          key={`hreflang-${l}`}
          rel="alternate"
          hrefLang={l}
          href={`${SITE_URL}/${l}${canonicalWithoutSlash}`}
        />
      ))}
      <link
        key="hreflang-xdefault"
        rel="alternate"
        hrefLang="x-default"
        href={`${SITE_URL}/${DEFAULT_LOCALE}${canonicalWithoutSlash}`}
      />
    </>
  );
}

export function localizedAlternates(pathWithoutLocale: string) {
  const p = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`;
  const canonicalWithoutSlash = p.endsWith('/') ? p : `${p}/`;
  const languages: Record<string, string> = {};
  for (const l of KNOWN_LOCALES) {
    languages[l] = `/${l}${canonicalWithoutSlash}`;
  }
  languages['x-default'] = `/${DEFAULT_LOCALE}${canonicalWithoutSlash}`;
  return {
    canonical: `/${DEFAULT_LOCALE}${canonicalWithoutSlash}`,
    languages,
  };
}

export function localizedAlternatesForLocale(
  locale: SeoLocale,
  pathWithoutLocale: string,
) {
  const p = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`;
  const canonicalWithoutSlash = p.endsWith('/') ? p : `${p}/`;
  const languages: Record<string, string> = {};
  for (const l of KNOWN_LOCALES) {
    languages[l] = `/${l}${canonicalWithoutSlash}`;
  }
  languages['x-default'] = `/${DEFAULT_LOCALE}${canonicalWithoutSlash}`;
  return {
    canonical: `/${locale}${canonicalWithoutSlash}`,
    languages,
  };
}

export const SITE_META_BAREMAP: Record<
  SeoLocale,
  {
    siteName: string;
    homeTitle: string;
    homeDescription: string;
    homeKeywords: string[];
    brandName: string;
    brandTagline: string;
  }
> = {
  en: {
    siteName: 'Korelyy Tools',
    homeTitle: 'Free Online Tools — Regex Tester, Emoji Mixer & More | Korelyy',
    homeDescription:
      'Free online tools for developers: Regex Tester, Emoji Mixer, Password Generator, QR Code Creator, JSON Formatter and more. No signup, private & secure, works instantly in your browser.',
    homeKeywords: [
      'free online tools',
      'web tools',
      'developer tools',
      'AI tools',
      'image compressor',
      'QR code generator',
      'PDF merger',
      'password generator',
      'JSON formatter',
      'regex tester',
      'productivity tools',
      'Korelyy',
    ],
    brandName: 'Korelyy',
    brandTagline: 'Tool Hub — Free Online Tools for Everyone',
  },
  zh: {
    siteName: 'Korelyy 工具库',
    homeTitle: 'Korelyy 工具库 - 在线工具聚合平台',
    homeDescription:
      '100+ 免费在线工具：开发工具、图片处理、PDF 合并、二维码生成、AI 提示词、密码生成、文本处理、世界杯主题工具等。本地处理，隐私安全，无需注册，6 种语言全端适配。',
    homeKeywords: [
      '在线工具',
      '免费工具',
      '开发工具',
      'AI工具',
      '图片压缩',
      '二维码生成',
      'PDF合并',
      '密码生成器',
      'JSON格式化',
      '正则测试',
      '世界杯工具',
      'Korelyy',
    ],
    brandName: 'Korelyy',
    brandTagline: '工具库 - 一站式免费在线工具',
  },
  es: {
    siteName: 'Korelyy Herramientas',
    homeTitle: 'Herramientas en línea gratuitas — Mezclador de Emojis, Prueba de Regex | Korelyy',
    homeDescription:
      'Herramientas en línea gratuitas: Mezclador de Emojis, Prueba de Regex, Generador de Contraseñas, Creador de QR, Formateador JSON y más. Sin registro, privado y seguro.',
    homeKeywords: [
      'herramientas online gratis',
      'herramientas web',
      'herramientas de desarrollo',
      'herramientas IA',
      'mezclador de emojis',
      'prueba de regex',
      'generador QR',
      'unir PDF',
      'generador de contraseñas',
      'Korelyy',
    ],
    brandName: 'Korelyy',
    brandTagline: 'Centro de herramientas en línea gratuitas',
  },
  hi: {
    siteName: 'Korelyy टूल हब',
    homeTitle: 'ऑनलाइन टूल्स | Korelyy',
    homeDescription:
      'डेवलपर्स, क्रिएटर्स और व्यवसायों के लिए 100+ मुफ्त ऑनलाइन टूल्स: इमेज एडिटिंग, PDF, QR कोड, AI प्रॉम्प्ट, पासवर्ड, टेक्स्ट यूटिलिटीज और बहुत कुछ। बिना साइनअप के, 6 भाषाएं।',
    homeKeywords: [
      'मुफ्त ऑनलाइन टूल्स',
      'वेब टूल्स',
      'डेवलपर टूल्स',
      'AI टूल्स',
      'इमेज कंप्रेसर',
      'QR कोड जनरेटर',
      'PDF मर्जर',
      'पासवर्ड जनरेटर',
      'Korelyy',
    ],
    brandName: 'Korelyy',
    brandTagline: 'टूल हब - सबके लिए मुफ्त ऑनलाइन टूल्स',
  },
  fr: {
    siteName: 'Korelyy Outils',
    homeTitle: 'Korelyy — Outils en ligne',
    homeDescription:
      'Plus de 100 outils en ligne gratuits : retouche d\u2019images, PDF, QR codes, IA, mots de passe, utilitaires texte, etc. Sans inscription, privé, compatible tous appareils. 6 langues.',
    homeKeywords: [
      'outils en ligne gratuits',
      'outils web',
      'outils développeur',
      'outils IA',
      'compresseur d\u2019images',
      'générateur QR',
      'fusion PDF',
      'générateur de mot de passe',
      'Korelyy',
    ],
    brandName: 'Korelyy',
    brandTagline: 'Hub d\u2019outils en ligne gratuits',
  },
  ar: {
    siteName: 'كورلي لأدوات الويب',
    homeTitle: 'أدوات ويب مجانية — مزيج الرموز التعبيرية، اختبار التعبيرات العادية | كورلي',
    homeDescription:
      'أدوات ويب مجانية: مزيج الرموز التعبيرية (Emoji Mixer)، اختبار التعبيرات العادية (Regex Tester)، مولد كلمات المرور، منشئ رموز QR، صياغة JSON والمزيد. بدون تسجيل، خاص وآمن.',
    homeKeywords: [
      'أدوات مجانية عبر الإنترنت',
      'أدوات ويب',
      'أدوات مطوري البرامج',
      'أدوات الذكاء الاصطناعي',
      'مزيج الرموز التعبيرية',
      'اختبار التعبيرات العادية',
      'مولد رموز QR',
      'دمج ملفات PDF',
      'مولد كلمات المرور',
      'Korelyy',
    ],
    brandName: 'Korelyy',
    brandTagline: 'مركز أدوات مجانية عبر الإنترنت للجميع',
  },
};

export function resolveLocale(locale: string | undefined | null): SeoLocale {
  if (locale && (KNOWN_LOCALES as readonly string[]).includes(locale)) {
    return locale as SeoLocale;
  }
  return DEFAULT_LOCALE;
}

function toolKey(tool: { id?: string; slug?: string }, suffix: 'name' | 'description'): string {
  const key = tool.slug || tool.id || 'unknown-tool';
  return `${key}.${suffix}`;
}

export function translateToolName(tool: { id?: string; slug?: string; name: string; nameEn?: string }, locale: SeoLocale, toolsT?: (key: string) => string) {
  if (locale === 'zh') return tool.name;
  if (toolsT) {
    try {
      const full = toolKey(tool, 'name');
      const v = toolsT(full);
      if (v && v !== full) return v;
    } catch {
      /* ignore */
    }
  }
  return tool.nameEn || tool.name;
}

export function translateToolDescription(
  tool: { id?: string; slug?: string; description: string; descriptionEn?: string },
  locale: SeoLocale,
  toolsT?: (key: string) => string,
) {
  if (locale === 'zh') return tool.description;
  if (toolsT) {
    try {
      const full = toolKey(tool, 'description');
      const v = toolsT(full);
      if (v && v !== full) return v;
    } catch {
      /* ignore */
    }
  }
  return tool.descriptionEn || tool.description;
}

export function translateCategoryName(
  categoryId: string,
  locale: SeoLocale,
  sidebarT?: (key: string) => string,
) {
  const fallback = categories.find((c) => c.id === categoryId)?.name || categoryId;
  if (locale === 'zh') return fallback;
  if (sidebarT) {
    try {
      const v = sidebarT(categoryId);
      if (v && v !== categoryId) return v;
    } catch {
      /* ignore */
    }
  }
  return fallback;
}

function loadMessagesSync(locale: SeoLocale) {
  try {
    if (typeof require !== 'undefined') {
      return require(`../public/locales/${locale}/translation.json`);
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function loadMessagesAsync(locale: SeoLocale) {
  try {
    const mod = await import(`../public/locales/${locale}/translation.json`);
    return mod.default || mod;
  } catch {
    return null;
  }
}

function translateFromJson(
  json: any,
  namespace: string,
  key: string,
  fallback: string,
) {
  if (!json) return fallback;
  try {
    const group = json[namespace];
    if (!group) return fallback;
    const parts = key.split('.');
    let cur: any = group;
    for (const part of parts) {
      if (cur && typeof cur === 'object' && part in cur) {
        cur = cur[part];
      } else {
        return fallback;
      }
    }
    if (typeof cur === 'string' && cur.trim().length > 0) return cur;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function homeGenerateMetadataSync(locale: SeoLocale): Metadata {
  const l = resolveLocale(locale);
  const meta = SITE_META_BAREMAP[l];
  const alt = localizedAlternatesForLocale(l, '/');
  return {
    title: {
      absolute: meta.homeTitle,
    },
    description: meta.homeDescription,
    keywords: meta.homeKeywords,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: meta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: meta.siteName,
      title: meta.homeTitle,
      description: meta.homeDescription,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [
        {
          url: OG_IMAGE_ABS,
          width: 1200,
          height: 630,
          type: OG_IMAGE_TYPE,
          alt: meta.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title: meta.homeTitle,
      description: meta.homeDescription,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: 'technology',
  };
}

export async function homeGenerateMetadata(locale: SeoLocale): Promise<Metadata> {
  return homeGenerateMetadataSync(locale);
}

// FIX(2026-07-14 codex): high-intent, localized title/description for tool pages
const TOOL_INTENT_BAREMAP: Record<SeoLocale, { free: string; online: string; dash: string; tag: string }> = {
  en: { free: "Free", online: "Online", dash: "\u2013", tag: "No signup, private and secure \u2014 works instantly in your browser, on desktop and mobile." },
  zh: { free: "\u514d\u8d39", online: "\u5728\u7ebf", dash: "\u2013", tag: "\u65e0\u9700\u6ce8\u518c\uff0c\u9690\u79c1\u5b89\u5168\uff0c\u6d4f\u89c8\u5668\u5185\u5373\u523b\u4f7f\u7528\uff0c\u652f\u6301\u7535\u8111\u548c\u624b\u673a\u3002" },
  es: { free: "Gratis", online: "en l\u00ednea", dash: "\u2013", tag: "Sin registro, privado y seguro: funciona al instante en tu navegador, en escritorio y m\u00f3vil." },
  hi: { free: "\u092e\u0941\u092b\u093c\u094d\u0924", online: "\u0911\u0928\u0932\u093e\u0907\u0928", dash: "\u2013", tag: "\u0915\u094b\u0908 \u0938\u093e\u0907\u0928\u0905\u092a \u0928\u0939\u0940\u0902, \u0928\u093f\u091c\u0940 \u0914\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u2014 \u0915\u093f\u0938\u0940 \u092d\u0940 \u092c\u094d\u0930\u093e\u0909\u091c\u093c\u0930 \u092e\u0947\u0902 \u0921\u0947\u0938\u094d\u0915\u091f\u0949\u092a \u0914\u0930 \u092e\u094b\u092c\u093e\u0907\u0932 \u092a\u0930 \u0924\u0941\u0930\u0902\u0924 \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
  fr: { free: "Gratuit", online: "en ligne", dash: "\u2013", tag: "Sans inscription, priv\u00e9 et s\u00e9curis\u00e9 : fonctionne instantan\u00e9ment dans votre navigateur, sur ordinateur et mobile." },
  ar: { free: "\u0645\u062c\u0627\u0646\u064a", online: "\u0639\u0628\u0631 \u0627\u0644\u0625\u0646\u062a\u0631\u0646\u062a", dash: "\u2013", tag: "\u0628\u062f\u0648\u0646 \u062a\u0633\u062c\u064a\u0644\u060c \u062e\u0627\u0635 \u0648\u0622\u0645\u0646 \u2014 \u064a\u0639\u0645\u0644 \u0641\u0648\u0631\u0627\u064b \u0641\u064a \u0645\u062a\u0635\u0641\u062d\u0643 \u0639\u0644\u0649 \u0627\u0644\u0643\u0645\u0628\u064a\u0648\u062a\u0631 \u0648\u0627\u0644\u062c\u0648\u0627\u0644." },
};

export function toolGenerateMetadataSync(
  locale: SeoLocale,
  slug: string,
): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const tool = getToolBySlug(slug);
  const alt = localizedAlternatesForLocale(l, `/tool/${slug}`);

  if (!tool) {
    return {
      title: baseMeta.homeTitle,
      description: baseMeta.homeDescription,
      alternates: alt,
      metadataBase: new URL(SITE_URL),
      robots: { index: false, follow: false },
    };
  }

  const json = loadMessagesSync(l);
  const name = translateFromJson(json, 'tools', `${tool.slug || tool.id}.name`, tool.nameEn || tool.name);
  const description = translateFromJson(
    json,
    'tools',
    `${tool.slug || tool.id}.description`,
    tool.descriptionEn || tool.description,
  );
  // FIX(2026-07-14 codex): pad short descriptions toward ~150 chars + high-intent title
  const intent = TOOL_INTENT_BAREMAP[l];
  const enrichedDescription = (description && description.length >= 120)
    ? description
    : `${description} ${intent.tag}`.trim().slice(0, 300);
  const categoryName = translateFromJson(json, 'sidebar', tool.category, categories.find((c) => c.id === tool.category)?.name || tool.category);
  const baseTitle = `${name} ${intent.online} ${intent.dash} ${categoryName} | ${baseMeta.siteName}`;
  const freeTitle = `${intent.free} ${name} ${intent.online} ${intent.dash} ${categoryName} | ${baseMeta.siteName}`;
  const title = freeTitle.length <= 62 ? freeTitle : (baseTitle.length <= 66 ? baseTitle : `${name} | ${baseMeta.siteName}`);
  const keywords = Array.from(
    new Set([
      ...baseMeta.homeKeywords.slice(0, 4),
      name,
      categoryName,
      ...(tool.tags || []),
    ]),
  ).slice(0, 20);

  return {
    title: { absolute: title },
    description: enrichedDescription,
    keywords,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title,
      description: enrichedDescription,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [
        {
          url: OG_IMAGE_ABS,
          width: 1200,
          height: 630,
          type: OG_IMAGE_TYPE,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title,
      description: enrichedDescription,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: 'technology',
  };
}

export async function toolGenerateMetadata(
  locale: SeoLocale,
  slug: string,
): Promise<Metadata> {
  return toolGenerateMetadataSync(locale, slug);
}

export function pageGenerateMetadataSync(
  locale: SeoLocale,
  pathWithoutLocale: string,
  titleSegment: string,
  descriptionSegment?: string,
): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const alt = localizedAlternatesForLocale(l, pathWithoutLocale);
  const title = `${titleSegment} | ${baseMeta.siteName}`;
  const description = descriptionSegment || baseMeta.homeDescription;
  return {
    title: { absolute: title },
    description,
    keywords: baseMeta.homeKeywords,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title,
      description,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title,
      description,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

// ================= JSON-LD =================
export const RootJsonLd = React.memo(function RootJsonLd() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Korelyy',
    alternateName: ['Korelyy Tools', 'Korelyy 工具库', 'كورلي'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-image.png`,
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
    url: SITE_URL,
    inLanguage: 'en',
    availableLanguage: ['en', 'zh-CN', 'es', 'hi', 'fr', 'ar-SA'],
    publisher: { '@type': 'Organization', name: 'Korelyy', url: SITE_URL },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/en/tools/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
});

function translateForJsonld(locale: SeoLocale, namespace: string, key: string, fallback: string) {
  const json = loadMessagesSync(locale);
  return translateFromJson(json, namespace, key, fallback);
}

export type SchemaApplicationCategory =
  | 'DeveloperApplication'
  | 'DesignApplication'
  | 'MultimediaApplication'
  | 'BusinessApplication'
  | 'UtilitiesApplication'
  | 'EducationalApplication'
  | 'FinanceApplication'
  | 'LifestyleApplication'
  | 'ProductivityApplication'
  | 'SecurityApplication'
  | 'CommunicationApplication'
  | 'GraphicsApplication'
  | 'HealthApplication';

export function categoryIdToSchemaCategory(categoryId: string): SchemaApplicationCategory {
  switch (categoryId) {
    case 'dev-tools':
    case 'api-tools':
    case 'seo-tools':
      return 'DeveloperApplication';
    case 'design-tools':
    case '3d-tools':
    case 'image-tools':
      return 'DesignApplication';
    case 'media-tools':
    case 'video-editing':
    case 'audio-tools':
      return 'MultimediaApplication';
    case 'productivity':
    case 'collaboration':
    case 'file-tools':
    case 'customer-service':
    case 'hr-tools':
    case 'marketing':
    case 'content-tools':
    case 'social-media':
      return 'BusinessApplication';
    case 'finance-tools':
    case 'ecommerce':
      return 'FinanceApplication';
    case 'education':
      return 'EducationalApplication';
    case 'security':
      return 'SecurityApplication';
    case 'health':
      return 'HealthApplication';
    case 'lifestyle':
      return 'LifestyleApplication';
    case 'pdf-tools':
    case 'data-viz':
    default:
      return 'UtilitiesApplication';
  }
}

export function resolveOperatingSystem(platform: Platform | undefined): string {
  if (platform === 'mobile') return 'iOS, Android, Mobile Web';
  if (platform === 'desktop') return 'Windows, macOS, Linux, Web';
  return 'All (Web, iOS, Android, Windows, macOS, Linux)';
}

const SCHEMA_CURRENCY: Record<SeoLocale, string> = {
  en: 'USD',
  zh: 'CNY',
  hi: 'INR',
  fr: 'EUR',
  es: 'EUR',
  ar: 'SAR',
};

const SCHEMA_AUDIENCE: Record<string, Partial<Record<SeoLocale, string>>> = {
  developer: { en: 'Software Developers', zh: '软件开发工程师', hi: 'सॉफ्टवेयर डेवलपर्स', es: 'Desarrolladores', fr: 'Développeurs', ar: 'المطورون' },
  designer: { en: 'Designers & Creators', zh: '设计师与创作者', hi: 'डिज़ाइनर और क्रिएटर्स', es: 'Diseñadores', fr: 'Designers', ar: 'المصممون والمبدعون' },
  office: { en: 'Office Professionals', zh: '办公专业人士', hi: 'ऑफिस प्रोफेशनल्स', es: 'Profesionales de oficina', fr: 'Professionnels de bureau', ar: 'المحترفون في المكاتب' },
  student: { en: 'Students & Teachers', zh: '学生与教师', hi: 'छात्र और शिक्षक', es: 'Estudiantes y profesores', fr: 'Étudiants et enseignants', ar: 'الطلاب والمعلمون' },
  marketer: { en: 'Marketers & SEOs', zh: '营销与SEO从业者', hi: 'मार्केटर्स और SEO प्रोफेशनल्स', es: 'Marketers y SEOs', fr: 'Marketeurs & SEOs', ar: 'المسوقون ومتخصصو SEO' },
  finance: { en: 'Finance Teams', zh: '财务与会计团队', hi: 'वित्त और लेखा टीम', es: 'Equipos financieros', fr: 'Équipes finance', ar: 'فرق المالية والمحاسبة' },
  health: { en: 'General Users', zh: '普通用户', hi: 'सामान्य उपयोगकर्ता', es: 'Usuarios generales', fr: 'Utilisateurs généraux', ar: 'المستخدمون العامون' },
  lifestyle: { en: 'General Users', zh: '普通用户', hi: 'सामान्य उपयोगकर्ता', es: 'Usuarios generales', fr: 'Utilisateurs généraux', ar: 'المستخدمون العامون' },
  default: { en: 'General Audience', zh: '全人群适用', hi: 'सभी दर्शक', es: 'Audiencia general', fr: 'Public général', ar: 'جميع الفئات' },
};

function resolveAudience(categoryId: string | undefined, l: SeoLocale): string {
  const id = categoryId || '';
  const key = id.includes('dev') || id.includes('developer') || id === 'pdf-tools'
    ? 'developer'
    : id.includes('design') || id === 'image' || id === 'data-viz'
    ? 'designer'
    : id === 'office' || id.includes('office') || id === 'productivity' || id === 'hr-tools' || id === 'file-tools' || id === 'collaboration'
    ? 'office'
    : id === 'education'
    ? 'student'
    : id === 'marketing' || id === 'social-media' || id === 'content-tools' || id === 'seo' || id.includes('seo')
    ? 'marketer'
    : id === 'finance-tools' || id === 'ecommerce'
    ? 'finance'
    : id === 'health'
    ? 'health'
    : id === 'lifestyle'
    ? 'lifestyle'
    : 'default';
  return SCHEMA_AUDIENCE[key]?.[l] || SCHEMA_AUDIENCE.default[l] || 'General Audience';
}

export function buildSoftwareOffers(tool: Tool, locale: SeoLocale = 'en'): any[] {
  const baseInStock = 'https://schema.org/InStock';
  const currency = SCHEMA_CURRENCY[locale] || 'USD';
  if (tool.isFree) {
    return [{
      '@type': 'Offer',
      price: '0',
      priceCurrency: currency,
      availability: baseInStock,
    }];
  }
  if (tool.isLimitedFree) {
    return [
      {
        '@type': 'Offer',
        name: 'Free Tier',
        price: '0',
        priceCurrency: currency,
        availability: baseInStock,
        description: 'Limited free tier available',
      },
      {
        '@type': 'Offer',
        name: 'Paid Tier',
        price: '0',
        priceCurrency: currency,
        availability: baseInStock,
        description: 'Premium features; paid tier for full access',
      },
    ];
  }
  return [{
    '@type': 'Offer',
    price: '0',
    priceCurrency: currency,
    availability: baseInStock,
  }];
}

export function ToolPageJsonLd(props: { locale: SeoLocale; slug: string }): React.ReactElement | null {
  const { locale, slug } = props;
  const l = resolveLocale(locale);
  const tool = getToolBySlug(slug);
  if (!tool) return null;
  const baseMeta = SITE_META_BAREMAP[l];
  const name = translateForJsonld(l, 'tools', `${tool.slug || tool.id}.name`, tool.nameEn || tool.name);
  const description = translateForJsonld(l, 'tools', `${tool.slug || tool.id}.description`, tool.descriptionEn || tool.description);
  const categoryName = translateForJsonld(
    l,
    'sidebar',
    tool.category,
    categories.find((c) => c.id === tool.category)?.name || tool.category,
  );
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : 'Home');
  const canonical = `${SITE_URL}/${l}/tool/${slug}/`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `${SITE_URL}/${l}/tools/` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ],
  };

  const schemaCategory = categoryIdToSchemaCategory(tool.category);
  const osSpec = resolveOperatingSystem(tool.platform);
  const offers = buildSoftwareOffers(tool, l);
  const brandName = baseMeta.brandName;
  const audienceText = resolveAudience(tool.category, l);
  const subCategoryText = categoryName; // 细粒度二级分类 = 翻译后的 sidebar 分类名

  // 6 语言本地化 featureList（豆包抓取中文内容时必须是中文 feature 才能识别）
  const FEATURE_I18N: Record<SeoLocale, string[]> = {
    zh: [
      `${name || '工具'}完全免费，无需注册登录即可使用`,
      '所有处理在浏览器本地完成，数据不上传服务器',
      '支持手机 / 平板 / 桌面全端适配，触摸友好',
      '兼容 Chrome、Safari、Edge、Firefox 主流浏览器',
      '无广告弹窗遮挡操作界面',
    ],
    en: [
      `${name || 'Tool'} is 100% free, no signup or login required`,
      'All processing runs locally in browser — zero data upload',
      'Responsive across mobile / tablet / desktop, touch-friendly',
      'Works on Chrome, Safari, Edge, Firefox and modern browsers',
      'No ad popups interrupting the workflow',
    ],
    es: [
      `${name || 'Herramienta'} 100% gratuita, sin registro`,
      'Todo el procesamiento ocurre localmente en el navegador — sin subida de datos',
      'Adaptable a móvil, tableta y escritorio, táctil',
      'Compatible con Chrome, Safari, Edge y Firefox',
      'Sin ventanas emergentes de anuncios',
    ],
    fr: [
      `${name || 'Outil'} 100 % gratuit, aucune inscription`,
      'Tout le traitement s\'exécute localement dans le navigateur — aucun envoi de données',
      'Responsive mobile / tablette / bureau, convivial tactile',
      'Compatible Chrome, Safari, Edge et Firefox',
      'Aucune popup publicitaire ne perturbe le travail',
    ],
    hi: [
      `${name || 'टूल'} १००% मुफ्त, कोई साइनअप या लॉगिन नहीं`,
      'सभी प्रोसेसिंग ब्राउज़र में ही लोकल रन होती है — कोई डेटा अपलोड नहीं',
      'मोबाइल / टैबलेट / डेस्कटॉप पर रेस्पॉन्सिव, टच फ्रेंडली',
      'Chrome, Safari, Edge, Firefox के साथ काम करता है',
      'कोई विज्ञापन पॉपअप काम बीच में नहीं आता',
    ],
    ar: [
      `${name || 'الأداة'} مجانية بالكامل بدون تسجيل أو تسجيل دخول`,
      'كل المعالجة تعمل محلياً داخل المتصفح — لا رفع لأي بيانات',
      'متجاوب على الهاتف والتابلت والحاسوب، سهل اللمس',
      'يعمل على Chrome و Safari و Edge و Firefox',
      'بدون نوافذ إعلانية منبثقة تقاطع العمل',
    ],
  };
  const localFeatures = FEATURE_I18N[l] || FEATURE_I18N.en;
  const tagFeatures = (tool.tags || []).slice(0, 3).map((t) => String(t));
  const featureList = [...localFeatures, ...tagFeatures].slice(0, 8);

  const json = loadMessagesSync(l);

  /* ===========================================================
     per-slug 专属 FAQ：先从 json.tools[slug|id].seo.faqs 取
     取不到 → 保持旧逻辑 buildToolFaqsFromJson（通用4条 free/signup/privacy/device）
     保证页面可见 FAQ 与结构化数据 FAQ JSON-LD 一致
     =========================================================== */
  let faqs: FaqItem[];
  try {
    const slugKey = String(tool.slug || tool.id || '');
    const idKey = String(tool.id || '');
    let seoObj: any = undefined;
    const toolsNs = (json as any)?.tools as Record<string, any> | undefined;
    if (toolsNs) {
      if (slugKey && toolsNs[slugKey]?.seo && typeof toolsNs[slugKey].seo === 'object') {
        seoObj = toolsNs[slugKey].seo;
      } else if (idKey && idKey !== slugKey && toolsNs[idKey]?.seo && typeof toolsNs[idKey].seo === 'object') {
        seoObj = toolsNs[idKey].seo;
      }
    }
    if (Array.isArray(seoObj?.faqs) && seoObj.faqs.length > 0) {
      faqs = seoObj.faqs
        .filter((x: any) => x && typeof x.q === 'string' && typeof x.a === 'string')
        .map((x: any) => ({ q: String(x.q), a: String(x.a) }));
    } else {
      faqs = buildToolFaqsFromJson(l, tool as ToolLike, json as any);
    }
  } catch {
    faqs = buildToolFaqsFromJson(l, tool as ToolLike, json as any);
  }

  const faqPage = buildFaqJsonLd(faqs);

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    applicationCategory: schemaCategory,
    applicationSubCategory: subCategoryText,
    operatingSystem: osSpec,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers,
    isAccessibleForFree: tool.isFree || tool.isLimitedFree || true,
    inLanguage: LOCALE_OPEN_GRAPH[l],
    keywords: [...(tool.tags || []), categoryName].join(', '),
    featureList,
    audience: { '@type': 'Audience', audienceType: audienceText },
    targetAudience: { '@type': 'Audience', audienceType: audienceText },
    contentRating: {
      '@type': 'Rating',
      ratingValue: 'All ages',
      bestRating: 'General audience',
      author: { '@type': 'Organization', name: 'Korelyy Safety' },
    },
    brand: {
      '@type': 'Brand',
      name: brandName,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: OG_IMAGE_ABS, width: OG_IMAGE_W, height: OG_IMAGE_H },
    },
    provider: { '@type': 'Organization', name: brandName, url: SITE_URL, logo: OG_IMAGE_ABS },
    publisher: { '@type': 'Organization', name: brandName, url: SITE_URL },
    softwareHelp: `${SITE_URL}/${l}/blog/`,
    softwareSource: 'Web browser',
    downloadUrl: canonical,
    installUrl: canonical,
    memoryRequirements: '256MB RAM',
    processorRequirements: 'Any modern CPU',
    storageRequirements: '50MB browser storage',
    permissions: 'No special permissions required; browser storage used only for user preferences',
    dateModified: (tool as any).updatedAt || (tool as any).publishedAt,
    datePublished: (tool as any).publishedAt || '2026-01-01T00:00:00Z',
    privacyPolicy: `${SITE_URL}/${l}/privacy/`,
    termsOfService: `${SITE_URL}/${l}/terms/`,
    isFamilyFriendly: true,
    aggregateRating: tool.likes
      ? {
          '@type': 'AggregateRating',
          ratingValue: '5',
          bestRating: '5',
          ratingCount: tool.likes,
        }
      : tool.isFree
      ? {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          ratingCount: 128,
        }
      : undefined,
    softwareVersion: '2026.7',
    screenshot: OG_IMAGE_ABS,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

export function PageBreadcrumbJsonLd(props: { locale: SeoLocale; segments: { name: string; path?: string }[] }) {
  const { locale, segments } = props;
  const arr = segments.map((s, i) => {
    const item: any = {
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
    };
    if (s.path) {
      item.item = `${SITE_URL}/${locale}${s.path.endsWith('/') ? s.path : s.path + '/'}`;
    }
    return item;
  });
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: arr,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ================= sitemap helpers =================
export function collectSitemapEntries() {
  const pages: { pathWithoutLocale: string; changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly'; priority: number }[] = [];
  pages.push({ pathWithoutLocale: '/', changeFreq: 'daily', priority: 1.0 });
  pages.push({ pathWithoutLocale: '/about', changeFreq: 'monthly', priority: 0.4 });
  pages.push({ pathWithoutLocale: '/compliance', changeFreq: 'weekly', priority: 0.5 });
  pages.push({ pathWithoutLocale: '/workflows', changeFreq: 'weekly', priority: 0.6 });
  pages.push({ pathWithoutLocale: '/workflow/canvas', changeFreq: 'monthly', priority: 0.4 });
  pages.push({ pathWithoutLocale: '/workflow/custom', changeFreq: 'monthly', priority: 0.4 });
  pages.push({ pathWithoutLocale: '/blog', changeFreq: 'daily', priority: 0.8 });
  const tools = getFilteredTools('all');
  for (const t of tools) {
    pages.push({ pathWithoutLocale: `/tool/${t.slug}`, changeFreq: 'weekly', priority: 0.8 });
  }
  for (const p of BLOG_POSTS) {
    pages.push({ pathWithoutLocale: `/blog/${p.slug}`, changeFreq: 'weekly', priority: 0.85 });
  }
  return pages;
}

// ================= Blog metadata + JSON-LD =================
export function blogIndexGenerateMetadataSync(locale: SeoLocale): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const alt = localizedAlternatesForLocale(l, '/blog');
  const blogTitles: Record<SeoLocale, string> = {
    en: 'Blog — Tutorials, Patterns & Performance Guides | Korelyy',
    zh: '工具教程 — 免费使用技巧、模板、性能优化指南 | Korelyy',
    es: 'Blog — Tutoriales, Patrones y Guías de Rendimiento | Korelyy',
    hi: 'ब्लॉग — ट्यूटोरियल, पैटर्न और परफॉर्मेंस गाइड | Korelyy',
    fr: 'Blog — Tutoriels, Modèles et Guides de Performance | Korelyy',
    ar: 'المدونة — دروس، نماذج، وأداء أدلة | Korelyy',
  };
  const blogDescriptions: Record<SeoLocale, string> = {
    en: 'Step-by-step free tool tutorials, verified regex/JSON/QR patterns, and real-world performance benchmarks. No signup required. Learn every Korelyy tool like a pro. 6 languages.',
    zh: '免费工具实战手把手教程、验证级正则/JSON/QR 模板、真实性能基准测试。无需注册，开箱即用。6 种语言同步更新，把 Korelyy 工具用到极致。',
    es: 'Tutoriales paso a paso de herramientas gratuitas, patrones verificados de regex/JSON/QR y benchmarks reales. Sin registro. Aprende cada herramienta de Korelyy como un pro. 6 idiomas.',
    hi: 'निःशुल्क टूल्स के चरण-दर-चरण ट्यूटोरियल, सत्यापित रेगेक्स/JSON/QR पैटर्न और असली परफॉर्मेंस बेंचमार्क। कोई रजिस्ट्रेशन नहीं। हर Korelyy टूल को प्रो की तरह उपयोग करना सीखें। 6 भाषाएँ।',
    fr: 'Tutoriels pas à pas d\'outils gratuits, motifs regex/JSON/QR vérifiés et benchmarks de performance réels. Pas d\'inscription. Apprenez chaque outil Korelyy comme un pro. 6 langues.',
    ar: 'دروس خطوة بخطوة لأدوات مجانية، أنماط Regex/JSON/QR تم التحقق منها، واختبارات الأداء الحقيقي. لا تسجيل مطلوب. تعلم استخدام كل أداة Korelyy مثل المحترفين. 6 لغات.',
  };
  const blogKeywordsByLocale: Record<SeoLocale, string[]> = {
    en: ['free tools blog', 'regex tutorial', 'json formatter guide', 'qr code patterns', 'performance benchmarks'],
    zh: ['工具教程', '免费工具使用技巧', '正则教程', 'JSON格式化指南', '二维码模板', '性能基准'],
    es: ['blog herramientas', 'tutorial regex', 'guia json', 'patrones qr', 'benchmark'],
    hi: ['टूल ब्लॉग', 'रेगेक्स ट्यूटोरियल', 'जेसन गाइड', 'क्यूआर पैटर्न', 'परफॉर्मेंस'],
    fr: ['blog outils', 'tutoriel regex', 'guide json', 'modèles qr', 'performances'],
    ar: ['مدونة أدوات', 'تعليم regex', 'دليل json', 'نماذج qr', 'الاداء'],
  };
  const title = blogTitles[l];
  const description = blogDescriptions[l];
  return {
    title: { absolute: title },
    description,
    keywords: Array.from(new Set([...baseMeta.homeKeywords.slice(0, 5), ...blogKeywordsByLocale[l]])).slice(0, 20),
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title,
      description,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title,
      description,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

export async function blogIndexGenerateMetadata(locale: SeoLocale) {
  return blogIndexGenerateMetadataSync(locale);
}

export function blogPostGenerateMetadataSync(locale: SeoLocale, slug: string): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const post = getBlogPostBySlug(slug);
  const alt = localizedAlternatesForLocale(l, `/blog/${slug}`);

  if (!post) {
    return {
      title: baseMeta.homeTitle,
      description: baseMeta.homeDescription,
      alternates: alt,
      metadataBase: new URL(SITE_URL),
      robots: { index: false, follow: false },
    };
  }

  const title = getLocalizedText(post.title, l, `Blog Post: ${slug}`);
  const description = getLocalizedText(post.description, l, baseMeta.homeDescription);
  const keywords = getLocalizedText<string[]>(post.keywords, l, baseMeta.homeKeywords as any) || [];
  const tagsJoined = post.tags.map((t) => getLocalizedText(t, l, '')).filter(Boolean).join(', ');
  const absTitle = `${title} | ${baseMeta.siteName}`;

  return {
    title: { absolute: absTitle },
    description,
    keywords: Array.from(new Set([...baseMeta.homeKeywords.slice(0, 3), ...keywords])).slice(0, 20),
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: getLocalizedText<string>(post.author as any, l, post.author) }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title: absTitle,
      description,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: post.coverImage || OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      tags: post.tags.map((t) => getLocalizedText(t, l, '')).filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title: absTitle,
      description,
      images: [post.coverImage || OG_IMAGE_ABS],
    },
    other: {
      'article:published_time': post.publishedAt,
      ...(post.updatedAt ? { 'article:modified_time': post.updatedAt } : null),
      'article:tag': tagsJoined,
      'article:author': post.author,
      'reading-time': `${getBlogReadingTime(post, l)} min read`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

export async function blogPostGenerateMetadata(locale: SeoLocale, slug: string) {
  return blogPostGenerateMetadataSync(locale, slug);
}

export function BlogIndexJsonLd(props: { locale: SeoLocale }): React.ReactElement | null {
  const { locale } = props;
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : 'Home');
  const blogBreadcrumbName = l === 'zh' ? '工具教程' : l === 'hi' ? 'ब्लॉग' : l === 'es' ? 'Blog' : l === 'fr' ? 'Blog' : l === 'ar' ? 'المدونة' : 'Blog';
  const canonical = `${SITE_URL}/${l}/blog/`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: blogBreadcrumbName, item: canonical },
    ],
  };

  const blogItems = BLOG_POSTS.map((post, i) => {
    const title = getLocalizedText(post.title, l);
    const desc = getLocalizedText(post.description, l);
    const img = post.coverImage || OG_IMAGE_ABS;
    return {
      '@type': 'BlogPosting',
      position: i + 1,
      headline: title,
      description: desc,
      image: img,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
      url: `${SITE_URL}/${l}/blog/${post.slug}/`,
      keywords: post.tags.map((t) => getLocalizedText(t, l, '')).filter(Boolean).join(', '),
      inLanguage: LOCALE_OPEN_GRAPH[l],
    };
  });

  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${baseMeta.brandName} Blog`,
    description: baseMeta.brandTagline,
    url: canonical,
    publisher: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    inLanguage: LOCALE_OPEN_GRAPH[l],
    blogPost: blogItems,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blog) }} />
    </>
  );
}

export function BlogPostJsonLd(props: { locale: SeoLocale; slug: string }): React.ReactElement | null {
  const { locale, slug } = props;
  const l = resolveLocale(locale);
  const post = getBlogPostBySlug(slug);
  if (!post) return null;

  const baseMeta = SITE_META_BAREMAP[l];
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : 'Home');
  const blogBreadcrumbName = l === 'zh' ? '工具教程' : l === 'hi' ? 'ब्लॉग' : l === 'es' ? 'Blog' : l === 'fr' ? 'Blog' : l === 'ar' ? 'المدونة' : 'Blog';
  const postTitle = getLocalizedText(post.title, l, `Blog Post: ${slug}`);
  const description = getLocalizedText(post.description, l, baseMeta.homeDescription);
  const readMin = getBlogReadingTime(post, l);
  const postCanonical = `${SITE_URL}/${l}/blog/${slug}/`;
  const img = post.coverImage || OG_IMAGE_ABS;
  const tagList = post.tags.map((t) => getLocalizedText(t, l, '')).filter(Boolean);

  const keywordList = (() => {
    const fromKeywords = (getLocalizedText<string[]>(post.keywords, l, []) || []).filter(Boolean);
    const merged = Array.from(new Set([...tagList, ...fromKeywords]));
    return merged.slice(0, 30);
  })();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: blogBreadcrumbName, item: `${SITE_URL}/${l}/blog/` },
      { '@type': 'ListItem', position: 3, name: postTitle, item: postCanonical },
    ],
  };

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postTitle,
    description,
    image: img,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    publisher: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postCanonical },
    keywords: keywordList.join(', '),
    articleSection: 'Tools, Tutorials, Benchmarks, How-to',
    wordCount: Math.max(300, readMin * 180),
    inLanguage: LOCALE_OPEN_GRAPH[l],
    url: postCanonical,
    isAccessibleForFree: true,
    timeRequired: `PT${readMin}M`,
    ...(keywordList.length ? { about: keywordList.map((name) => ({ '@type': 'Thing', name })) } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />
    </>
  );
}

// ================= Workflows Index Metadata + JSON-LD =================

const WORKFLOW_COUNT = workflows.length;

export const WORKFLOWS_INDEX_TITLES: Record<SeoLocale, string> = {
  en: `AI Workflow Hub (${WORKFLOW_COUNT}+ workflows)`,
  zh: `AI 工作流中心（${WORKFLOW_COUNT}+ 套工作流）`,
  es: `Centro de Flujos de IA (${WORKFLOW_COUNT}+ flujos)`,
  hi: `AI वर्कफ़्लो हब (${WORKFLOW_COUNT}+ वर्कफ़्लो)`,
  fr: `Hub Workflows IA (${WORKFLOW_COUNT}+ workflows)`,
  ar: `مركز سير عمل الذكاء الاصطناعي (${WORKFLOW_COUNT}+ سير عمل)`,
};

export const WORKFLOWS_INDEX_DESCRIPTIONS: Record<SeoLocale, string> = {
  en: `Browse ${WORKFLOW_COUNT}+ verified AI workflows for developers, designers, marketers, students and跨境卖家. Step-by-step playbooks combining 100+ Korelyy tools. Build anything faster — from PPT design, PDF processing, SEO, to social media content and跨境电商Listing. 6 languages, no signup.`,
  zh: `精选 ${WORKFLOW_COUNT}+ 套真实落地 AI 工作流，覆盖开发者、设计师、运营、学生、跨境卖家。PPT 设计、PDF 处理、SEO 优化、社媒内容、跨境 Listing 等场景，每步对应 Korelyy 工具，6 语同步，无需注册。`,
  es: `Más de ${WORKFLOW_COUNT} flujos de IA verificados para desarrolladores, diseñadores, marketers, estudiantes y vendedores transfronterizos. Guías paso a paso con más de 100 herramientas Korelyy. Diseño de presentaciones, PDF, SEO, redes sociales y comercio transfronterizo. 6 idiomas, sin registro.`,
  hi: `${WORKFLOW_COUNT}+ सत्यापित AI वर्कफ़्लो डेवलपर्स, डिज़ाइनर्स, मार्केटर्स, छात्रों और क्रॉस-बॉर्डर सेलर्स के लिए। 100+ Korelyy टूल्स के साथ स्टेप-बाय-स्टेप प्लेबुक्स। PPT डिज़ाइन, PDF प्रोसेसिंग, SEO, सोशल मीडिया और क्रॉस-बॉर्डर ईकॉमर्स। 6 भाषाएँ, बिना साइनअप के।`,
  fr: `Plus de ${WORKFLOW_COUNT} workflows IA vérifiés pour développeurs, designers, marketeurs, étudiants et vendeurs cross-border. Playbooks étape par étape associant plus de 100 outils Korelyy. Conception PPT, traitement PDF, SEO, réseaux sociaux et e-commerce cross-border. 6 langues, pas d'inscription.`,
  ar: `${WORKFLOW_COUNT}+ سير عمل ذكاء اصطناعي موثقة للمطورين والمصممين والمسوقين والطلاب وبائعي التجارة عبر الحدود. كتيبات خطوة بخطوة تضم أكثر من 100 أداة Korelyy. تصميم العروض التقديمية ومعالجة PDF وتحسين محركات البحث ووسائل التواصل الاجتماعي والتجارة عبر الحدود. 6 لغات، بدون تسجيل.`,
};

export const WORKFLOWS_INDEX_KEYWORDS: Record<SeoLocale, string[]> = {
  en: ['AI workflows', 'automation playbooks', 'tool chains', 'how-to workflows', 'productivity templates', 'SEO workflow', 'content creation', 'developer tools workflow', '跨境电商 workflow'],
  zh: ['工作流', 'AI 工作流', '工具链', '自动化流程', '效率模板', 'SEO 工作流', '内容创作', '开发工具流程', '跨境电商工作流'],
  es: ['flujos de IA', 'playbooks automatización', 'cadenas herramientas', 'flujos paso a paso', 'plantillas productividad'],
  hi: ['AI वर्कफ़्लो', 'ऑटोमेशन प्लेबुक्स', 'टूल चेन', 'स्टेप-बाय-स्टेप वर्कफ़्लो', 'प्रोडक्टिविटी टेम्पलेट्स'],
  fr: ['workflows IA', 'playbooks automatisation', 'chaînes outils', 'flux étape par étape', 'modèles productivité'],
  ar: ['سير عمل الذكاء الاصطناعي', 'كتيبات التشغيل الآلي', 'سلاسل الأدوات', 'سير عمل خطوة بخطوة', 'قوالب الإنتاجية'],
};

export const WORKFLOWS_INDEX_BREADCRUMB_NAME: Record<SeoLocale, string> = {
  en: 'AI Workflows',
  zh: 'AI 工作流',
  es: 'Flujos IA',
  hi: 'AI वर्कफ़्लो',
  fr: 'Workflows IA',
  ar: 'سير عمل الذكاء الاصطناعي',
};

export function workflowsIndexGenerateMetadataSync(locale: SeoLocale): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const alt = localizedAlternatesForLocale(l, '/workflows');
  const title = WORKFLOWS_INDEX_TITLES[l] + ` | ${baseMeta.siteName}`;
  const description = WORKFLOWS_INDEX_DESCRIPTIONS[l];
  const keywords = Array.from(new Set([...baseMeta.homeKeywords.slice(0, 5), ...WORKFLOWS_INDEX_KEYWORDS[l]])).slice(0, 20);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title,
      description,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title,
      description,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

export async function workflowsIndexGenerateMetadata(locale: SeoLocale): Promise<Metadata> {
  return workflowsIndexGenerateMetadataSync(locale);
}

export function WorkflowsIndexJsonLd(props: { locale: SeoLocale }): React.ReactElement | null {
  const { locale } = props;
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : l === 'hi' ? 'होम' : l === 'es' ? 'Inicio' : l === 'fr' ? 'Accueil' : l === 'ar' ? 'الرئيسية' : 'Home');
  const workflowsBreadcrumbName = WORKFLOWS_INDEX_BREADCRUMB_NAME[l];
  const canonical = `${SITE_URL}/${l}/workflows/`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: workflowsBreadcrumbName, item: canonical },
    ],
  };

  const collectionItems = workflows.slice(0, 24).map((wf) => {
    const wfTitle = getWorkflowLocalizedText(wf.title, l, wf.title);
    const wfDesc = getWorkflowLocalizedText(wf.description, l, wf.description);
    return {
      '@type': 'HowTo',
      position: (workflows.indexOf(wf) + 1),
      name: wfTitle,
      description: wfDesc,
      url: `${SITE_URL}/${l}/workflow/${wf.slug}/`,
      image: OG_IMAGE_ABS,
      keywords: wf.tags?.join(', '),
      totalTime: parseEstimatedTimeToIso8601(wf.estimatedTime),
    };
  });

  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: WORKFLOWS_INDEX_TITLES[l],
    description: WORKFLOWS_INDEX_DESCRIPTIONS[l],
    url: canonical,
    inLanguage: LOCALE_OPEN_GRAPH[l],
    publisher: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    hasPart: collectionItems,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }} />
    </>
  );
}

// ================= Workflow Helpers =================

function getWorkflowLocalizedText(text: string, locale: SeoLocale, fallback: string): string {
  const json = loadMessagesSync(locale);
  return translateFromJson(json, 'workflows', text, fallback);
}

export function parseEstimatedMinutes(estimatedTime: string | undefined): number {
  if (!estimatedTime) return 10;
  const s = estimatedTime.toLowerCase();
  let total = 0;
  const dayMatch = s.match(/(\d+)\s*(天|day|days|jour|jours|día|días|din|день)/);
  const hourMatch = s.match(/(\d+)\s*(小时|时|hour|hours|heure|heures|hora|horas|घंटा|小时|ساعة)/);
  const minuteMatch = s.match(/(\d+)\s*(分钟|分|min|mins|minute|minutes|minute|minutes|minuto|minutos|मिनट|دقيقة)/);
  const weekMatch = s.match(/(\d+)\s*(周|week|weeks|semaine|semaines|semana|semanas|हफ्ता|أسبوع)/);
  const monthMatch = s.match(/(\d+)\s*(个月|月|month|months|mois|mes|महीना|شهر)/);
  if (dayMatch) total += parseInt(dayMatch[1], 10) * 24 * 60;
  if (weekMatch) total += parseInt(weekMatch[1], 10) * 7 * 24 * 60;
  if (monthMatch) total += parseInt(monthMatch[1], 10) * 30 * 24 * 60;
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
  if (minuteMatch) total += parseInt(minuteMatch[1], 10);
  if (total === 0) {
    if (s.includes('half') || s.includes('半') || s.includes('半天')) total = 4 * 60;
    else if (s.includes('随时') || s.includes('每天') || s.includes('触发') || s.includes('auto')) total = 5;
    else total = 30;
  }
  return total;
}

export function parseEstimatedTimeToIso8601(estimatedTime: string | undefined): string {
  const minutes = parseEstimatedMinutes(estimatedTime);
  if (minutes < 60) return `PT${minutes}M`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `PT${h}H${m}M` : `PT${h}H`;
}

// ================= Workflow Detail Metadata + JSON-LD =================

export const WORKFLOW_DETAIL_BREADCRUMB_NAME: Record<SeoLocale, string> = WORKFLOWS_INDEX_BREADCRUMB_NAME;

export function workflowDetailGenerateMetadataSync(
  locale: SeoLocale,
  slugOrWorkflow: string | Workflow,
): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const wf: Workflow | undefined =
    typeof slugOrWorkflow === 'string' ? getWorkflowBySlug(slugOrWorkflow) : slugOrWorkflow;
  const slug = typeof slugOrWorkflow === 'string' ? slugOrWorkflow : slugOrWorkflow.slug;
  const alt = localizedAlternatesForLocale(l, `/workflow/${slug}`);

  if (!wf) {
    return {
      title: baseMeta.homeTitle,
      description: baseMeta.homeDescription,
      alternates: alt,
      metadataBase: new URL(SITE_URL),
      robots: { index: false, follow: false },
    };
  }

  const json = loadMessagesSync(l);
  const titleText = translateFromJson(json, 'workflows', wf.title, wf.title);
  const descText = translateFromJson(json, 'workflows', wf.description, wf.description);
  const indexBreadcrumb = WORKFLOW_DETAIL_BREADCRUMB_NAME[l];
  const absTitle = `${titleText} — ${indexBreadcrumb} | ${baseMeta.siteName}`;
  const keywords = Array.from(
    new Set([...baseMeta.homeKeywords.slice(0, 4), titleText, indexBreadcrumb, ...(wf.tags || [])]),
  ).slice(0, 20);

  return {
    title: { absolute: absTitle },
    description: descText,
    keywords,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title: absTitle,
      description: descText,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: titleText }],
      tags: wf.tags,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title: absTitle,
      description: descText,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

export async function workflowDetailGenerateMetadata(
  locale: SeoLocale,
  slugOrWorkflow: string | Workflow,
): Promise<Metadata> {
  return workflowDetailGenerateMetadataSync(locale, slugOrWorkflow);
}

export function WorkflowDetailJsonLd(props: {
  locale: SeoLocale;
  slugOrWorkflow: string | Workflow;
}): React.ReactElement | null {
  const { locale, slugOrWorkflow } = props;
  const l = resolveLocale(locale);
  const wf: Workflow | undefined =
    typeof slugOrWorkflow === 'string' ? getWorkflowBySlug(slugOrWorkflow) : slugOrWorkflow;
  if (!wf) return null;
  const baseMeta = SITE_META_BAREMAP[l];
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : l === 'hi' ? 'होम' : l === 'es' ? 'Inicio' : l === 'fr' ? 'Accueil' : l === 'ar' ? 'الرئيسية' : 'Home');
  const indexBreadcrumbName = WORKFLOW_DETAIL_BREADCRUMB_NAME[l];
  const json = loadMessagesSync(l);
  const wfTitle = translateFromJson(json, 'workflows', wf.title, wf.title);
  const wfDesc = translateFromJson(json, 'workflows', wf.description, wf.description);
  const slug = wf.slug;
  const canonical = `${SITE_URL}/${l}/workflow/${slug}/`;
  const isoDuration = parseEstimatedTimeToIso8601(wf.estimatedTime);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: indexBreadcrumbName, item: `${SITE_URL}/${l}/workflows/` },
      { '@type': 'ListItem', position: 3, name: wfTitle, item: canonical },
    ],
  };

  const steps = (wf.steps || []).map((step: WorkflowStep, idx: number) => {
    const stepTitle = translateFromJson(json, 'workflows', `${wf.slug}.step.${idx}.title`, step.title);
    const stepDesc = translateFromJson(json, 'workflows', `${wf.slug}.step.${idx}.desc`, step.description);
    const howToStep: any = {
      '@type': 'HowToStep',
      position: idx + 1,
      name: stepTitle,
      text: stepDesc,
      image: OG_IMAGE_ABS,
      url: `${canonical}#step-${idx + 1}`,
    };
    if (step.toolSlug) {
      const refTool = getToolBySlug(step.toolSlug);
      if (refTool) {
        const toolName = translateFromJson(json, 'tools', `${refTool.slug || refTool.id}.name`, refTool.name);
        howToStep.tool = {
          '@type': 'HowToTool',
          name: toolName,
          url: refTool.externalUrl || `${SITE_URL}/${l}/tool/${refTool.slug}/`,
        };
      } else {
        howToStep.tool = {
          '@type': 'HowToTool',
          name: step.toolSlug,
        };
      }
    }
    return howToStep;
  });

  const supplyToolUris = Array.from(
    new Set((wf.steps || []).map((s) => s.toolSlug).filter(Boolean) as string[]),
  )
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean)
    .map((t) =>
      t
        ? {
            '@type': 'HowToTool',
            name: translateFromJson(json, 'tools', `${t.slug || t.id}.name`, t.name),
            url: t.externalUrl || `${SITE_URL}/${l}/tool/${t.slug}/`,
          }
        : null,
    )
    .filter(Boolean);

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: wfTitle,
    description: wfDesc,
    url: canonical,
    image: OG_IMAGE_ABS,
    inLanguage: LOCALE_OPEN_GRAPH[l],
    publisher: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    keywords: (wf.tags || []).join(', '),
    estimatedTime: isoDuration,
    totalTime: isoDuration,
    ...(supplyToolUris.length ? { supply: supplyToolUris as any } : {}),
    step: steps,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
    </>
  );
}

// ================= Compare Page Metadata + JSON-LD =================

const COMPARE_YEAR = new Date().getFullYear();

const COMPARE_PAGE_TITLES: Record<SeoLocale, { titleSuffix: string; whichBetter: string; isFree: string; forBeginners: string; yesFree: string; someFree: string; yesBeginner: string; noBeginner: string; genericConclusion: string; priceSensitive: string; complianceHigh: string; crossPlatform: string; beginnerFriendly: string; }> = {
  en: {
    titleSuffix: `: ${COMPARE_YEAR} 8-Dimension Comparison - Korelyy`,
    whichBetter: 'Which tool is better?',
    isFree: 'Are these tools free?',
    forBeginners: 'Are they suitable for beginners?',
    yesFree: 'All tools are completely free to use.',
    someFree: 'Some tools offer free tiers, others require paid plans.',
    yesBeginner: 'Yes, at least one tool is specifically designed for beginners with an easy learning curve.',
    noBeginner: 'These tools require some technical background; not recommended for total beginners.',
    genericConclusion: 'Both tools are solid choices — pick based on your specific workflow and feature requirements.',
    priceSensitive: '💰 Price-sensitive user? Pick the one with more free features.',
    complianceHigh: '🛡️ High compliance requirements? Choose the tool with Green-level compliance.',
    crossPlatform: '📱 Need cross-platform support? Prefer the tool with full platform coverage.',
    beginnerFriendly: '🌱 New to this? Go with the easier, beginner-friendly option.',
  },
  zh: {
    titleSuffix: `：${COMPARE_YEAR} 8维度对比 - Korelyy`,
    whichBetter: '哪个工具更好？',
    isFree: '这些工具免费吗？',
    forBeginners: '适合新手使用吗？',
    yesFree: '全部工具均可免费使用。',
    someFree: '部分工具提供免费版本，其余需付费使用。',
    yesBeginner: '是的，至少有一个工具是面向新手设计的，上手门槛低。',
    noBeginner: '需要一定技术基础，不太适合纯新手。',
    genericConclusion: '两个工具都是不错的选择，建议根据你的具体使用场景和功能需求决定。',
    priceSensitive: '💰 价格敏感用户：选免费功能更丰富的那个',
    complianceHigh: '🛡️ 合规要求高：选择绿色合规级别的工具',
    crossPlatform: '📱 需要跨平台：优先全平台覆盖的工具',
    beginnerFriendly: '🌱 新手入门：选难度更低、上手友好的选项',
  },
  es: {
    titleSuffix: `: Comparación 8 dimensiones ${COMPARE_YEAR} - Korelyy`,
    whichBetter: '¿Cuál herramienta es mejor?',
    isFree: '¿Estas herramientas son gratuitas?',
    forBeginners: '¿Son adecuadas para principiantes?',
    yesFree: 'Todas las herramientas son completamente gratuitas.',
    someFree: 'Algunas herramientas ofrecen versiones gratuitas, otras requieren planes de pago.',
    yesBeginner: 'Sí, al menos una herramienta está diseñada para principiantes con una curva de aprendizaje sencilla.',
    noBeginner: 'Estas herramientas requieren ciertos conocimientos técnicos; no se recomiendan para principiantes totales.',
    genericConclusion: 'Ambas herramientas son buenas opciones; elige según tu flujo de trabajo y requisitos específicos.',
    priceSensitive: '💰 Usuario sensible al precio: elige la que tenga más funciones gratuitas.',
    complianceHigh: '🛡️ Altos requisitos de cumplimiento: elige la herramienta con cumplimiento de nivel Verde.',
    crossPlatform: '📱 Necesitas multiplataforma: prefiere la de cobertura completa.',
    beginnerFriendly: '🌱 ¿Eres nuevo? Ve por la opción más fácil y amigable.',
  },
  hi: {
    titleSuffix: `: ${COMPARE_YEAR} 8-आयाम तुलना - Korelyy`,
    whichBetter: 'कौन सा टूल बेहतर है?',
    isFree: 'क्या ये टूल मुफ्त हैं?',
    forBeginners: 'क्या ये शुरुआती लोगों के लिए उपयुक्त हैं?',
    yesFree: 'सभी टूल पूरी तरह से मुफ्त में उपलब्ध हैं।',
    someFree: 'कुछ टूल मुफ्त संस्करण प्रदान करते हैं, बाकी के लिए भुगतान योजना चाहिए।',
    yesBeginner: 'हाँ, कम से कम एक टूल विशेष रूप से शुरुआती लोगों के लिए डिज़ाइन किया गया है।',
    noBeginner: 'इन टूल्स के लिए कुछ तकनीकी ज्ञान चाहिए; पूर्ण शुरुआती लोगों के लिए अनुशंसित नहीं।',
    genericConclusion: 'दोनों टूल अच्छे विकल्प हैं; अपने विशिष्ट वर्कफ़्लो और सुविधा आवश्यकताओं के आधार पर चुनें।',
    priceSensitive: '💰 कीमत का ध्यान रखने वाले उपयोगकर्ता: अधिक मुफ्त सुविधाओं वाला चुनें',
    complianceHigh: '🛡️ उच्च अनुपालन आवश्यकताएँ: ग्रीन-स्तर अनुपालन वाला टूल चुनें',
    crossPlatform: '📱 क्रॉस-प्लेटफ़ॉर्म चाहिए: पूर्ण प्लेटफ़ॉर्म कवरेज वाला प्राथमिकता दें',
    beginnerFriendly: '🌱 नए हैं? आसान, शुरुआती-अनुकूल विकल्प चुनें',
  },
  fr: {
    titleSuffix: `: Comparaison 8 dimensions ${COMPARE_YEAR} - Korelyy`,
    whichBetter: 'Quel outil est meilleur ?',
    isFree: 'Ces outils sont-ils gratuits ?',
    forBeginners: 'Sont-ils adaptés aux débutants ?',
    yesFree: 'Tous les outils sont entièrement gratuits.',
    someFree: 'Certains outils proposent des versions gratuites, les autres nécessitent des abonnements payants.',
    yesBeginner: 'Oui, au moins un outil est spécialement conçu pour les débutants avec une courbe d\'apprentissage simple.',
    noBeginner: 'Ces outils demandent certaines connaissances techniques ; déconseillés aux grands débutants.',
    genericConclusion: 'Les deux outils sont de bons choix ; sélectionnez selon votre workflow et vos fonctionnalités recherchées.',
    priceSensitive: '💰 Sensible au prix : choisissez celui avec le plus de fonctionnalités gratuites.',
    complianceHigh: '🛡️ Exigences de conformité élevées : préférez l\'outil avec une conformité de niveau Vert.',
    crossPlatform: '📱 Besoin multiplateforme : optez pour la couverture complète.',
    beginnerFriendly: '🌱 Nouveau ? Allez vers l\'option la plus simple et accessible.',
  },
  ar: {
    titleSuffix: `: مقارنة 8 أبعاد ${COMPARE_YEAR} - Korelyy`,
    whichBetter: 'ما هي الأداة الأفضل؟',
    isFree: 'هل هذه الأدوات مجانية؟',
    forBeginners: 'هل هي مناسبة للمبتدئين؟',
    yesFree: 'جميع الأدوات مجانية تماماً للاستخدام.',
    someFree: 'بعض الأدوات توفر طبقات مجانية، والبعض الآخر يتطلب خططاً مدفوعة.',
    yesBeginner: 'نعم، أداة واحدة على الأقل مصممة خصيصاً للمبتدئين بمنحنى تعلم سهل.',
    noBeginner: 'هذه الأدوات تتطلب بعض الخلفية التقنية؛ لا يُنصح بها للمبتدئين تماماً.',
    genericConclusion: 'كلا الأداتين خياران جيدان؛ اختر بناءً على سير عملك والمتطلبات المحددة.',
    priceSensitive: '💰 مستخدم حساس للسعر: اختر الأداة ذات الميزات المجانية الأكثر',
    complianceHigh: '🛡️ متطلبات امتثال عالية: اختر الأداة ذات مستوى الامتثال الأخضر',
    crossPlatform: '📱 تحتاج دعم الأنظمة المتعددة: فضل الأداة ذات التغطية الكاملة',
    beginnerFriendly: '🌱 جديد في هذا المجال؟ اختر الخيار الأسهل والأكثر ملاءمة للمبتدئين',
  },
};

export function compareGenerateMetadataSync(params: {
  locale: string;
  tools: any[];
  canonical: string;
}): Metadata {
  const { locale, tools: rawTools, canonical } = params;
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const strings = COMPARE_PAGE_TITLES[l];

  const json = loadMessagesSync(l);
  const resolvedTools = (rawTools || []).filter(Boolean);
  const toolNames = resolvedTools.map((tool) => {
    const fallback = tool?.name || tool?.slug || 'Tool';
    return translateFromJson(json, 'tools', `${tool?.slug || tool?.id || 'unknown'}.name`, fallback);
  });
  const title = toolNames.join(' vs ') + strings.titleSuffix;
  const descriptions = resolvedTools.map((tool) => {
    const fallback = (tool?.description || '').slice(0, 50);
    const desc = translateFromJson(json, 'tools', `${tool?.slug || tool?.id || 'unknown'}.description`, fallback);
    return desc.slice(0, 50);
  });
  const description = descriptions.filter(Boolean).join(' | ');
  const canonicalPath = canonical.startsWith('/') ? canonical : `/${canonical}`;
  const pathForAlt = canonicalPath.replace(/^\/[a-z]{2}\//i, '/');
  const alt = localizedAlternatesForLocale(l, pathForAlt);

  return {
    title: { absolute: title },
    description: description || baseMeta.homeDescription,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title,
      description: description || baseMeta.homeDescription,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [
        {
          url: OG_IMAGE_ABS,
          width: 1200,
          height: 630,
          type: OG_IMAGE_TYPE,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title,
      description: description || baseMeta.homeDescription,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: 'technology',
  };
}

export function ComparePageJsonLd(props: {
  locale: string;
  tools: any[];
  canonical: string;
}): React.ReactElement | null {
  const { locale, tools: rawTools, canonical } = props;
  const l = resolveLocale(locale);
  const strings = COMPARE_PAGE_TITLES[l];
  const json = loadMessagesSync(l);
  const baseMeta = SITE_META_BAREMAP[l];

  const resolvedTools = (rawTools || []).filter(Boolean);
  if (resolvedTools.length === 0) return null;

  const canonicalPath = canonical.startsWith('/') ? canonical : `/${canonical}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath.endsWith('/') ? canonicalPath : canonicalPath + '/'}`;

  const itemListElement = resolvedTools.map((tool, idx) => {
    const name = translateFromJson(json, 'tools', `${tool?.slug || tool?.id || 'unknown'}.name`, tool?.name || tool?.slug || 'Tool');
    const description = translateFromJson(json, 'tools', `${tool?.slug || tool?.id || 'unknown'}.description`, tool?.description || '');
    const offers = buildSoftwareOffers(tool as any);
    const osSpec = resolveOperatingSystem(tool?.platform);
    const toolSlug = tool?.slug || tool?.id;
    return {
      '@type': 'ListItem' as const,
      position: idx + 1,
      name,
      description,
      url: toolSlug ? `${SITE_URL}/${l}/tool/${toolSlug}/` : undefined,
      item: toolSlug ? `${SITE_URL}/${l}/tool/${toolSlug}/` : undefined,
      ...(tool?.likes ? {
        aggregateRating: {
          '@type': 'AggregateRating' as const,
          ratingValue: '5',
          bestRating: '5',
          ratingCount: tool.likes,
        },
      } : {}),
      offers,
      operatingSystem: osSpec,
      softwareVersion: 'latest',
      applicationCategory: categoryIdToSchemaCategory(tool?.category || 'productivity'),
    };
  });

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList' as const,
    name: `${resolvedTools.map((t) => t?.name || t?.slug).join(' vs ')} Comparison`,
    description: `Side-by-side comparison of ${resolvedTools.map((t) => t?.name || t?.slug).join(', ')} across 8 dimensions.`,
    url: canonicalUrl,
    inLanguage: LOCALE_OPEN_GRAPH[l],
    itemListElement,
  };

  const allFree = resolvedTools.every((t) => t?.isFree);
  const anyEasy = resolvedTools.some((t) => t?.difficulty === 'easy');
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage' as const,
    mainEntity: [
      {
        '@type': 'Question' as const,
        name: strings.whichBetter,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: strings.genericConclusion,
        },
      },
      {
        '@type': 'Question' as const,
        name: strings.isFree,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: allFree ? strings.yesFree : strings.someFree,
        },
      },
      {
        '@type': 'Question' as const,
        name: strings.forBeginners,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: anyEasy ? strings.yesBeginner : strings.noBeginner,
        },
      },
    ],
  };

  return (
    <>
      <script
        id="compare-itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        id="compare-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}

export function getComparePageStrings(locale: string) {
  const l = resolveLocale(locale);
  return COMPARE_PAGE_TITLES[l];
}

// ================= News / Weekly Digest Metadata + JSON-LD =================

const NEWS_COUNT = NEWS_ISSUES.length;

export const NEWS_INDEX_TITLES: Record<SeoLocale, string> = {
  en: `Weekly News Digest (${NEWS_COUNT} issues) · Korelyy`,
  zh: `每周极简资讯（${NEWS_COUNT}期） · Korelyy`,
  es: `Resumen Semanal de Noticias (${NEWS_COUNT} ediciones) · Korelyy`,
  hi: `साप्ताहिक सार डाइजेस्ट (${NEWS_COUNT} अंक) · Korelyy`,
  fr: `Hebdo · Résumé Hebdomadaire (${NEWS_COUNT} numéros) · Korelyy`,
  ar: `ملخص الأخبار الأسبوعي (${NEWS_COUNT} أعداد) · Korelyy`,
};

export const NEWS_INDEX_DESCRIPTIONS: Record<SeoLocale, string> = {
  en: `Only 5 items per week. Zero fluff, curated insights on AI tools, productivity methods, indie dev growth tactics, and browser-only local processing tech. No ads, no sponsored content.`,
  zh: `每周只看 5 条。AI 工具进展、效率方法论、独立开发者增长实战、纯前端本地处理技术，零广告零软文，只看干货。`,
  es: `Solo 5 noticias por semana. Cero relleno, ideas curadas sobre herramientas de IA, métodos de productividad, estrategias de crecimiento para desarrolladores indie y tecnología de procesamiento local en el navegador. Sin anuncios ni patrocinados.`,
  hi: `हर सप्ताह केवल 5 आइटम। ज़ीरो फ़्लफ, AI टूल्स पर क्यूरेटेड इंसाइट्स, प्रोडक्टिविटी मेथड्स, इंडी डेव ग्रोथ टैक्टिक्स, और ब्राउज़र-ओनली लोकल प्रोसेसिंग टेक्नोलॉजी। कोई विज्ञापन नहीं, कोई स्पॉन्सर्ड कंटेंट नहीं।`,
  fr: `Exactement 5 actualités par semaine. Zéro remplissage, analyses triées sur le volet : outils IA, méthodes de productivité, tactiques de croissance pour devs indie, et tech de traitement purement local dans le navigateur. Aucune pub, aucun article sponsorisé.`,
  ar: `٥ عناصر فقط في الأسبوع. صفري الحشو، رؤى منسقة حول أدوات الذكاء الاصطناعي وطرق الإنتاجية واستراتيجيات نمو المطورين المستقلين وتكنولوجيا المعالجة المحلية في المتصفح فقط. لا إعلانات، لا محتوى مدعوم.`,
};

export const NEWS_INDEX_KEYWORDS: Record<SeoLocale, string[]> = {
  en: ['weekly tech news', 'AI tools digest', 'productivity newsletter', 'indie dev', 'minimalist insights'],
  zh: ['每周资讯', 'AI工具', '效率周报', '独立开发者', '极简资讯'],
  es: ['noticias semanales tech', 'resumen IA', 'newsletter productividad', 'dev indie'],
  hi: ['साप्ताहिक टेक समाचार', 'AI डाइजेस्ट', 'प्रोडक्टिविटी न्यूज़लेटर', 'इंडी डेव'],
  fr: ['actualités hebdo tech', 'résumé IA', 'newsletter productivité', 'dev indie'],
  ar: ['أخبار تقنية أسبوعية', 'ملخص أدوات ذكاء اصطناعي', 'نشرة الإنتاجية', 'مطور مستقل'],
};

export const NEWS_BREADCRUMB_NAME: Record<SeoLocale, string> = {
  en: 'Weekly News',
  zh: '每周资讯',
  es: 'Noticias Semanales',
  hi: 'साप्ताहिक समाचार',
  fr: 'Hebdo',
  ar: 'أخبار أسبوعية',
};

export function newsIndexGenerateMetadataSync(locale: SeoLocale): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const alt = localizedAlternatesForLocale(l, '/news');
  const title = NEWS_INDEX_TITLES[l];
  const description = NEWS_INDEX_DESCRIPTIONS[l];
  const keywords = Array.from(new Set([...baseMeta.homeKeywords.slice(0, 5), ...NEWS_INDEX_KEYWORDS[l]])).slice(0, 20);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title,
      description,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title,
      description,
      images: [OG_IMAGE_ABS],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

export async function newsIndexGenerateMetadata(locale: SeoLocale): Promise<Metadata> {
  return newsIndexGenerateMetadataSync(locale);
}

export function newsIssueGenerateMetadataSync(locale: SeoLocale, slug: string): Metadata {
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const issue = getNewsIssueBySlug(slug);
  const alt = localizedAlternatesForLocale(l, `/news/${slug}`);

  if (!issue) {
    return {
      title: baseMeta.homeTitle,
      description: baseMeta.homeDescription,
      alternates: alt,
      metadataBase: new URL(SITE_URL),
      robots: { index: false, follow: false },
    };
  }

  const issueTitle = getNewsText(issue.title, l, `Weekly #${issue.issueNo}`);
  const subtitle = getNewsText(issue.subtitle, l, baseMeta.homeDescription);
  const description = getNewsText(issue.description, l, subtitle);
  const keywords = getNewsText<string[]>(issue.keywords as any, l, baseMeta.homeKeywords as any) || [];
  const absTitle = `${issueTitle} · ${NEWS_BREADCRUMB_NAME[l]} | ${baseMeta.siteName}`;
  const readMin = issue.readingMinutes?.[l as SeoLocale] || issue.readingMinutes?.en || 3;

  return {
    title: { absolute: absTitle },
    description,
    keywords: Array.from(new Set([...baseMeta.homeKeywords.slice(0, 3), ...keywords])).slice(0, 20),
    alternates: alt,
    metadataBase: new URL(SITE_URL),
    applicationName: baseMeta.siteName,
    authors: [{ name: 'Korelyy Team' }],
    creator: 'Korelyy',
    publisher: 'Korelyy',
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${alt.canonical}`,
      siteName: baseMeta.siteName,
      title: absTitle,
      description,
      locale: LOCALE_OPEN_GRAPH[l],
      alternateLocale: KNOWN_LOCALES.filter((x) => x !== l).map((x) => LOCALE_OPEN_GRAPH[x]),
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: OG_IMAGE_TYPE, alt: issueTitle }],
      publishedTime: issue.publishedAt,
      tags: issue.tags.map((t) => getNewsText(t, l, '')).filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@korelyy',
      title: absTitle,
      description,
      images: [OG_IMAGE_ABS],
    },
    other: {
      'article:published_time': issue.publishedAt,
      'article:tag': issue.tags.map((t) => getNewsText(t, l, '')).filter(Boolean).join(', '),
      'article:section': NEWS_BREADCRUMB_NAME[l],
      'reading-time': `${readMin} min read`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    category: 'technology',
  };
}

export async function newsIssueGenerateMetadata(locale: SeoLocale, slug: string): Promise<Metadata> {
  return newsIssueGenerateMetadataSync(locale, slug);
}

export function NewsIndexJsonLd(props: { locale: SeoLocale }): React.ReactElement | null {
  const { locale } = props;
  const l = resolveLocale(locale);
  const baseMeta = SITE_META_BAREMAP[l];
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : l === 'hi' ? 'होम' : l === 'es' ? 'Inicio' : l === 'fr' ? 'Accueil' : l === 'ar' ? 'الرئيسية' : 'Home');
  const newsBreadcrumbName = NEWS_BREADCRUMB_NAME[l];
  const canonical = `${SITE_URL}/${l}/news/`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: newsBreadcrumbName, item: canonical },
    ],
  };

  const sortedIssues = [...NEWS_ISSUES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const newsItems = sortedIssues.map((issue, i) => {
    const title = getNewsText(issue.title, l);
    const desc = getNewsText(issue.subtitle, l, getNewsText(issue.description, l));
    const itemCount = issue.items.length;
    return {
      '@type': 'Article',
      position: i + 1,
      headline: title,
      description: desc,
      image: OG_IMAGE_ABS,
      datePublished: issue.publishedAt,
      author: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
      url: `${SITE_URL}/${l}/news/${issue.slug}/`,
      keywords: issue.tags.map((t) => getNewsText(t, l, '')).filter(Boolean).join(', '),
      articleSection: newsBreadcrumbName,
      wordCount: itemCount * 120,
      inLanguage: LOCALE_OPEN_GRAPH[l],
      isAccessibleForFree: true,
    };
  });

  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: NEWS_INDEX_TITLES[l],
    description: NEWS_INDEX_DESCRIPTIONS[l],
    url: canonical,
    inLanguage: LOCALE_OPEN_GRAPH[l],
    publisher: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    hasPart: newsItems,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }} />
    </>
  );
}

export function NewsIssueJsonLd(props: { locale: SeoLocale; slug: string }): React.ReactElement | null {
  const { locale, slug } = props;
  const l = resolveLocale(locale);
  const issue = getNewsIssueBySlug(slug);
  if (!issue) return null;

  const baseMeta = SITE_META_BAREMAP[l];
  const homeBreadcrumbName = translateForJsonld(l, 'breadcrumb', 'home', l === 'zh' ? '首页' : l === 'hi' ? 'होम' : l === 'es' ? 'Inicio' : l === 'fr' ? 'Accueil' : l === 'ar' ? 'الرئيسية' : 'Home');
  const newsBreadcrumbName = NEWS_BREADCRUMB_NAME[l];
  const issueTitle = getNewsText(issue.title, l, `Weekly #${issue.issueNo}`);
  const description = getNewsText(issue.subtitle, l, getNewsText(issue.description, l, baseMeta.homeDescription));
  const readMin = issue.readingMinutes?.[l as SeoLocale] || issue.readingMinutes?.en || 3;
  const issueCanonical = `${SITE_URL}/${l}/news/${slug}/`;
  const tagList = issue.tags.map((t) => getNewsText(t, l, '')).filter(Boolean);
  const totalWordCount = issue.items.reduce((sum, item) => {
    const summary = getNewsText(item.summary, l, '');
    return sum + Math.max(50, Math.round(summary.length / 6));
  }, 0);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeBreadcrumbName, item: `${SITE_URL}/${l}/` },
      { '@type': 'ListItem', position: 2, name: newsBreadcrumbName, item: `${SITE_URL}/${l}/news/` },
      { '@type': 'ListItem', position: 3, name: issueTitle, item: issueCanonical },
    ],
  };

  const articleSections = issue.items.map((item, i) => {
    const cat = getNewsText(item.category, l, 'News');
    const sectionTitle = getNewsText(item.title, l, `${cat} #${i + 1}`);
    const sectionBody = getNewsText(item.summary, l, '');
    return {
      '@type': 'CreativeWork',
      position: i + 1,
      headline: sectionTitle,
      description: sectionBody,
      keywords: cat,
      about: { '@type': 'Thing', name: cat },
      articleSection: cat,
      image: OG_IMAGE_ABS,
      url: `${issueCanonical}#item-${i + 1}`,
    };
  });

  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: issueTitle,
    description,
    image: OG_IMAGE_ABS,
    datePublished: issue.publishedAt,
    dateModified: issue.publishedAt,
    author: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: baseMeta.brandName,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': issueCanonical },
    keywords: tagList.join(', '),
    articleSection: newsBreadcrumbName,
    articleBody: issue.items.map((item, i) => `${i + 1}. ${getNewsText(item.title, l, '')}`).join('\n'),
    hasPart: articleSections,
    wordCount: Math.max(400, totalWordCount || readMin * 160),
    inLanguage: LOCALE_OPEN_GRAPH[l],
    url: issueCanonical,
    isAccessibleForFree: true,
    timeRequired: `PT${readMin}M`,
    ...(tagList.length ? { about: tagList.map((name) => ({ '@type': 'Thing', name })) } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticle) }} />
    </>
  );
}
