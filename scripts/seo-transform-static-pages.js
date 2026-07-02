const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'app');
const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

const STATIC_ROUTES = [
  { pathWithoutLocale: '/about',        hasClientImport: true,  defaultTitle: null, breadcrumbNameMap: { en: 'About Us',      zh: '关于我们',    es: 'Sobre nosotros', hi: 'हमारे बारे में', fr: 'À propos de nous', ar: 'من نحن' } },
  { pathWithoutLocale: '/compliance',   hasClientImport: false, defaultTitle: null, breadcrumbNameMap: { en: 'Compliance',    zh: '合规透明',    es: 'Cumplimiento',  hi: 'अनुपालन',       fr: 'Conformité',      ar: 'الامتثال' } },
  { pathWithoutLocale: '/workflows',    hasClientImport: false, defaultTitle: null, breadcrumbNameMap: { en: 'Workflows',     zh: '工作流',      es: 'Flujos de trabajo', hi: 'वर्कफ़्लो',    fr: 'Workflows',        ar: 'سير العمل' } },
  { pathWithoutLocale: '/workflow/canvas', hasClientImport: true,  defaultTitle: null, breadcrumbNameMap: { en: 'Canvas',    zh: '画布',        es: 'Lienzo',        hi: 'कैनवास',        fr: 'Canvas',           ar: 'اللوحة' } },
  { pathWithoutLocale: '/workflow/custom',hasClientImport: false, defaultTitle: null, breadcrumbNameMap: { en: 'Custom',    zh: '自定义工作流',es: 'Personalizado', hi: 'कस्टम',        fr: 'Personnalisé',    ar: 'مخصص' } },
];

function extractTitleDescFromMetadata(text, fallback) {
  const mTitle = text.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  const mDesc = text.match(/description\s*:\s*(?:['"`]([^'"`]+)['"`]|\s*['"`]([^'"`]+)['"`])/);
  const title = mTitle ? mTitle[1] : fallback?.title;
  const descRaw = mDesc ? (mDesc[1] || mDesc[2]) : fallback?.description;
  const description = (descRaw || '').trim();
  return { title, description };
}

function buildRscPage({ locale, route, existingTitle, existingDescription }) {
  const title = existingTitle || route.breadcrumbNameMap[locale];
  const description = existingDescription || '';
  const pathEscaped = JSON.stringify(route.pathWithoutLocale);
  const titleEscaped = JSON.stringify(title);
  const descEscaped = JSON.stringify(description);
  const b1 = JSON.stringify(route.breadcrumbNameMap[locale]);
  return `import type { Metadata } from 'next';
import {
  pageGenerateMetadataSync,
  PageBreadcrumbJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = '${locale}';
const PATH_WITHOUT_LOCALE = ${pathEscaped};
const TITLE_SEGMENT = ${titleEscaped};
const DESC_SEGMENT = ${descEscaped};
const SELF_BREADCRUMB_NAME = ${b1};

const HOME_BREADCRUMB: Record<SeoLocale, string> = {
  en: 'Home',
  zh: '首页',
  es: 'Inicio',
  hi: 'होम',
  fr: 'Accueil',
  ar: 'الرئيسية',
};

export function generateMetadata(): Metadata {
  return pageGenerateMetadataSync(LOCALE, PATH_WITHOUT_LOCALE, TITLE_SEGMENT, DESC_SEGMENT || undefined);
}

export default function StaticPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        locale={LOCALE}
        segments={[
          { name: HOME_BREADCRUMB[LOCALE], path: '/' },
          { name: SELF_BREADCRUMB_NAME },
        ]}
      />
      <ClientPage />
    </>
  );
}
`;
}

function buildRscPageDirect({ locale, route, existingTitle, existingDescription }) {
  const title = existingTitle || route.breadcrumbNameMap[locale];
  const description = existingDescription || '';
  const pathEscaped = JSON.stringify(route.pathWithoutLocale);
  const titleEscaped = JSON.stringify(title);
  const descEscaped = JSON.stringify(description);
  return `import type { Metadata } from 'next';
import {
  pageGenerateMetadataSync,
  PageBreadcrumbJsonLd,
  type SeoLocale,
} from '@/components/seo';
import InnerPage from './inner';

const LOCALE: SeoLocale = '${locale}';
const PATH_WITHOUT_LOCALE = ${pathEscaped};
const TITLE_SEGMENT = ${titleEscaped};
const DESC_SEGMENT = ${descEscaped};

export function generateMetadata(): Metadata {
  return pageGenerateMetadataSync(LOCALE, PATH_WITHOUT_LOCALE, TITLE_SEGMENT, DESC_SEGMENT || undefined);
}

const BREADCRUMB_NAME_MAP: Record<SeoLocale, string> = {
  en: 'Home', zh: '首页', es: 'Inicio', hi: 'होम', fr: 'Accueil', ar: 'الرئيسية',
};
const SELF_NAME_MAP: Record<string, Record<SeoLocale, string>> = {
  '/about': { en: 'About Us', zh: '关于我们', es: 'Sobre nosotros', hi: 'हमारे बारे में', fr: 'À propos', ar: 'من نحن' },
  '/compliance': { en: 'Compliance', zh: '合规透明', es: 'Cumplimiento', hi: 'अनुपालन', fr: 'Conformité', ar: 'الامتثال' },
  '/workflows': { en: 'Workflows', zh: '工作流', es: 'Flujos', hi: 'वर्कफ़्लो', fr: 'Workflows', ar: 'سير العمل' },
  '/workflow/canvas': { en: 'Canvas', zh: '画布', es: 'Lienzo', hi: 'कैनवास', fr: 'Canvas', ar: 'اللوحة' },
  '/workflow/custom': { en: 'Custom Workflow', zh: '自定义工作流', es: 'Personalizado', hi: 'कस्टम', fr: 'Personnalisé', ar: 'مخصص' },
};

export default function StaticPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        locale={LOCALE}
        segments={[
          { name: BREADCRUMB_NAME_MAP[LOCALE], path: '/' },
          { name: SELF_NAME_MAP[PATH_WITHOUT_LOCALE]?.[LOCALE] || TITLE_SEGMENT },
        ]}
      />
      <InnerPage />
    </>
  );
}
`;
}

function processRoute(route) {
  let count = 0;
  const locales = route.pathWithoutLocale === '/workflow/custom' ? ['zh'] : KNOWN_LOCALES;
  for (const locale of locales) {
    const dir = path.join(APP_DIR, locale, ...route.pathWithoutLocale.split('/').filter(Boolean));
    const pagePath = path.join(dir, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;
    let raw = fs.readFileSync(pagePath, 'utf8');
    // 如果当前 page.tsx 是之前生成的 SEO'd 包装，把它当做"原代码"回溯为 client/inner
    const alreadyWrapped = raw.includes('from \'@/components/seo\'');
    const clientPath = path.join(dir, 'client.tsx');
    const innerPath = path.join(dir, 'inner.tsx');
    if (alreadyWrapped) {
      const usesClient = fs.existsSync(clientPath);
      const usesInner = fs.existsSync(innerPath);
      if (usesClient) raw = fs.readFileSync(clientPath, 'utf8');
      else if (usesInner) raw = fs.readFileSync(innerPath, 'utf8');
      // else: 没备份，没法回滚；保留现包装（但会重写page层）
    }
    const extracted = extractTitleDescFromMetadata(raw, { title: route.breadcrumbNameMap[locale] });
    const isClient = raw.includes('\'use client\'') || raw.includes('"use client"');
    if (!isClient) {
      const innerPathFinal = innerPath;
      if (!fs.existsSync(innerPathFinal)) {
        // 防止写入和 raw 相同的内容（在已经 SEO'd 情形）重复落盘
        fs.writeFileSync(innerPathFinal, raw.endsWith('\n') ? raw : raw + '\n', 'utf8');
      }
      fs.writeFileSync(pagePath, buildRscPageDirect({ locale, route, existingTitle: extracted.title, existingDescription: extracted.description }), 'utf8');
    } else {
      if (!fs.existsSync(clientPath)) {
        fs.writeFileSync(clientPath, raw.endsWith('\n') ? raw : raw + '\n', 'utf8');
      }
      fs.writeFileSync(pagePath, buildRscPage({ locale, route, existingTitle: extracted.title, existingDescription: extracted.description }), 'utf8');
    }
    count++;
  }
  return count;
}

function main() {
  let total = 0;
  for (const route of STATIC_ROUTES) {
    const c = processRoute(route);
    total += c;
    console.log(`${route.pathWithoutLocale}  ->  ${c} locales updated`);
  }
  console.log(`Total static routes updated: ${total}`);
}

main();
