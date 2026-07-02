const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];
const HOME_TEXT = {
  en: 'Home',
  zh: '首页',
  es: 'Inicio',
  fr: 'Accueil',
  hi: 'होम',
  ar: 'الرئيسية',
};

let modifiedTranslations = 0;
let modifiedPages = 0;
let skippedPages = 0;

// ---------- Part 1: 各语言翻译加 breadcrumb.home ----------
for (const locale of LOCALES) {
  const f = path.join(ROOT, 'public', 'locales', locale, 'translation.json');
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"breadcrumb"')) {
    console.log(`  [skip] ${locale} already has breadcrumb key`);
    continue;
  }
  const insertText = `,\n  "breadcrumb": {\n    "home": "${HOME_TEXT[locale]}"\n  }`;
  const idx = content.lastIndexOf('}');
  if (idx < 0) continue;
  let insertAt = idx;
  const before = content.slice(0, idx);
  const trimmedBefore = before.replace(/\s+$/, '');
  if (trimmedBefore.endsWith(',')) {
    content = trimmedBefore + insertText + '\n' + content.slice(idx);
  } else {
    content = trimmedBefore + insertText + '\n' + content.slice(idx);
  }
  fs.writeFileSync(f, content, 'utf8');
  modifiedTranslations++;
  console.log(`  [OK] ${locale}/translation.json added breadcrumb.home = ${HOME_TEXT[locale]}`);
}

// ---------- Part 2: 批量改工具详情页面包屑 ----------
const OLD_BREADCRUMB_RE = /\{resolvedLocale === 'zh' \? '首页' : resolvedLocale === 'hi' \? 'होम' : resolvedLocale === 'ar' \? 'الرئيسية' : resolvedLocale === 'es' \? 'Inicio' : resolvedLocale === 'fr' \? 'Accueil' : 'Home'\}/g;

const OLD_CAT_RE = /\{cat\.name\}/g;

const OLD_T_IMPORT = /const t = useTranslations\('tool'\);/g;

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(full);
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      const parts = full.split(path.sep);
      if (parts.includes('tool') && LOCALES.some(loc => parts.includes(loc))) {
        let src = fs.readFileSync(full, 'utf8');
        let changed = false;

        if (OLD_BREADCRUMB_RE.test(src)) {
          src = src.replace(OLD_BREADCRUMB_RE, "{breadcrumbT('home')}");
          changed = true;
        } else {
          // 已经改过的跳过计数
        }

        if (OLD_CAT_RE.test(src)) {
          src = src.replace(OLD_CAT_RE, "{sidebarT(cat.id)}");
          changed = true;
        }

        const needImport = src.includes("breadcrumbT('home')") || src.includes("sidebarT(cat.id)");
        if (needImport && OLD_T_IMPORT.test(src)) {
          const hasBreadcrumbImport = src.includes("useTranslations('breadcrumb')");
          const hasSidebarImport = src.includes("useTranslations('sidebar')");
          if (!hasBreadcrumbImport || !hasSidebarImport) {
            const extras = [];
            if (!hasBreadcrumbImport) extras.push("const breadcrumbT = useTranslations('breadcrumb');");
            if (!hasSidebarImport) extras.push("const sidebarT = useTranslations('sidebar');");
            src = src.replace(OLD_T_IMPORT, `const t = useTranslations('tool');\n  ${extras.join('\n  ')}`);
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(full, src, 'utf8');
          modifiedPages++;
        } else {
          skippedPages++;
        }
      }
    }
  }
}

processDir(path.join(ROOT, 'app'));

console.log(`\n========== 修复总结 ==========`);
console.log(`  翻译文件修改: ${modifiedTranslations} 个`);
console.log(`  工具详情页修改: ${modifiedPages} 个`);
console.log(`  工具详情页跳过(已修复): ${skippedPages} 个`);
