const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'app');
const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

function walkToolPages() {
  const results = [];
  for (const locale of KNOWN_LOCALES) {
    const toolRoot = path.join(APP_DIR, locale, 'tool');
    if (!fs.existsSync(toolRoot)) continue;
    const children = fs.readdirSync(toolRoot, { withFileTypes: true });
    for (const dirent of children) {
      if (!dirent.isDirectory()) continue;
      const pagePath = path.join(toolRoot, dirent.name, 'page.tsx');
      if (!fs.existsSync(pagePath)) continue;
      results.push({
        locale,
        slug: dirent.name,
        pagePath,
        dir: path.join(toolRoot, dirent.name),
      });
    }
  }
  return results;
}

function buildRscPage(locale, slug, clientName) {
  return `import type { Metadata } from 'next';
import {
  toolGenerateMetadata,
  ToolPageJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './${clientName}';

const LOCALE: SeoLocale = '${locale}';
const SLUG = '${slug}';

export async function generateMetadata(): Promise<Metadata> {
  return toolGenerateMetadata(LOCALE, SLUG);
}

export default function ToolDetailPage() {
  return (
    <>
      <ToolPageJsonLd locale={LOCALE} slug={SLUG} />
      <ClientPage />
    </>
  );
}
`;
}

function sanitizeClient(contentRaw) {
  let c = contentRaw;
  if (c.startsWith('\uFEFF')) c = c.slice(1);
  return c.endsWith('\n') ? c : c + '\n';
}

function main() {
  const all = walkToolPages();
  console.log(`Found ${all.length} tool page routes`);
  let modeA = 0;
  let modeB = 0;
  let skipped = 0;

  for (const { locale, slug, pagePath, dir } of all) {
    const clientPath = path.join(dir, 'client.tsx');
    const raw = fs.readFileSync(pagePath, 'utf8');

    // ---- client.tsx 仅在首次不存在时创建；已存在则保留（避免二次覆盖真正的业务代码） ----
    if (!fs.existsSync(clientPath)) {
      fs.writeFileSync(clientPath, sanitizeClient(raw), 'utf8');
    } else if (!raw.includes('from \'@/components/seo\'')) {
      // page.tsx 还没改成 RSC，此时 client.tsx 已经存在说明是之前生成的；先不要改。
    }

    // 总是用 RSC 版本重写 page.tsx
    fs.writeFileSync(pagePath, buildRscPage(locale, slug, 'client'), 'utf8');

    // Detect mode (just for reporting)
    if (raw.includes('const SLUG = ') && raw.includes('ToolDetailWrapper')) {
      modeA++;
    } else {
      modeB++;
    }
  }

  console.log(`Mode A (ToolDetailWrapper + SLUG): ${modeA}`);
  console.log(`Mode B (inline page logic)       : ${modeB}`);
  console.log(`Skipped (already SEO'd)          : ${skipped}`);
  console.log(`Total processed                  : ${modeA + modeB}`);
}

main();
