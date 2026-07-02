import type { Metadata } from 'next';
import React from 'react';
import { getToolBySlug, getFilteredTools } from '@/data/tools';
import { categories } from '@/data/categories';

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
export const OG_IMAGE_PATH = '/og-image.svg';
export const OG_IMAGE_ABS = `${SITE_URL}${OG_IMAGE_PATH}`;

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
    homeTitle: 'Korelyy Tool Hub — 100% Free Online Tools',
    homeDescription:
      'Discover 100+ free online tools for developers, creators and businesses: image editing, PDF, QR codes, AI prompts, passwords, text utilities and more. No signup, private, works on all devices. 6 languages supported.',
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
    homeTitle: 'Korelyy 工具库 - 免费在线工具聚合平台',
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
    homeTitle: 'Korelyy — Herramientas en línea 100% gratuitas',
    homeDescription:
      'Más de 100 herramientas en línea gratuitas: edición de imágenes, PDF, códigos QR, IA, contraseñas, utilidades de texto y más. Sin registro, privado, funciona en todos los dispositivos. 6 idiomas.',
    homeKeywords: [
      'herramientas online gratis',
      'herramientas web',
      'herramientas de desarrollo',
      'herramientas IA',
      'compresor de imágenes',
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
    homeTitle: 'टूल हब - 100% मुफ्त ऑनलाइन टूल्स | Korelyy',
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
    homeTitle: 'Korelyy — Outils en ligne 100 % gratuits',
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
    homeTitle: 'كورلي — أدوات عبر الإنترنت مجانية 100%',
    homeDescription:
      'أكثر من 100 أداة مجانية عبر الإنترنت: تحرير الصور، وحدات PDF، رموز QR، أدوات الذكاء الاصطناعي، كلمات مرور، أدوات نصية، وغير ذلك. بدون تسجيل، خاص، يعمل على جميع الأجهزة. 6 لغات.',
    homeKeywords: [
      'أدوات مجانية عبر الإنترنت',
      'أدوات ويب',
      'أدوات مطوري البرامج',
      'أدوات الذكاء الاصطناعي',
      'ضاغط الصور',
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

export function translateToolName(tool: { id?: string; slug?: string; name: string }, locale: SeoLocale, toolsT?: (key: string) => string) {
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
  return tool.name;
}

export function translateToolDescription(
  tool: { id?: string; slug?: string; description: string },
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
  return tool.description;
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
          type: 'image/svg+xml',
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
  const name = translateFromJson(json, 'tools', `${tool.slug || tool.id}.name`, tool.name);
  const description = translateFromJson(
    json,
    'tools',
    `${tool.slug || tool.id}.description`,
    tool.description,
  );
  const categoryName = translateFromJson(json, 'sidebar', tool.category, categories.find((c) => c.id === tool.category)?.name || tool.category);
  const title = `${name} — ${categoryName} | ${baseMeta.siteName}`;
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
      images: [
        {
          url: OG_IMAGE_ABS,
          width: 1200,
          height: 630,
          type: 'image/svg+xml',
          alt: name,
        },
      ],
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
      images: [{ url: OG_IMAGE_ABS, width: 1200, height: 630, type: 'image/svg+xml', alt: title }],
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
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: [
      'https://twitter.com/korelyy',
    ],
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Korelyy Tools',
    alternateName: ['Korelyy', 'Korelyy 工具库'],
    url: SITE_URL,
    inLanguage: 'en',
    availableLanguage: ['en', 'zh-CN', 'es', 'hi', 'fr', 'ar-SA'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/en/?q={search_term_string}`,
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

export function ToolPageJsonLd(props: { locale: SeoLocale; slug: string }): React.ReactElement | null {
  const { locale, slug } = props;
  const l = resolveLocale(locale);
  const tool = getToolBySlug(slug);
  if (!tool) return null;
  const baseMeta = SITE_META_BAREMAP[l];
  const name = translateForJsonld(l, 'tools', `${tool.slug || tool.id}.name`, tool.name);
  const description = translateForJsonld(l, 'tools', `${tool.slug || tool.id}.description`, tool.description);
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
      { '@type': 'ListItem', position: 2, name: categoryName },
      { '@type': 'ListItem', position: 3, name },
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: canonical,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    ],
    isAccessibleForFree: true,
    inLanguage: LOCALE_OPEN_GRAPH[l],
    keywords: [...(tool.tags || []), categoryName].join(', '),
    publisher: { '@type': 'Organization', name: baseMeta.brandName, url: SITE_URL },
    aggregateRating: tool.likes
      ? {
          '@type': 'AggregateRating',
          ratingValue: '5',
          bestRating: '5',
          ratingCount: tool.likes,
        }
      : undefined,
    featureList: [
      'No registration required',
      'Runs locally in browser',
      'Data privacy friendly',
      'All devices supported',
    ],
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
  const tools = getFilteredTools('all');
  for (const t of tools) {
    pages.push({ pathWithoutLocale: `/tool/${t.slug}`, changeFreq: 'weekly', priority: 0.8 });
  }
  return pages;
}
