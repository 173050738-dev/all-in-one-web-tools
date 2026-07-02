const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];

let processed = 0;
let skipped = 0;

const LOCALE_BLOCK_MARKER = `const pathLocale = (() => {
  const lm = pathname.match(/^\\/([a-z]{2})(\\/|$)/);
  return VALID_LOCALES.includes(lm?.[1]) ? lm[1] : (resolvedParams?.locale || 'zh');
})();`;

const RESOLVED_LOCALE_MARKER = `const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;`;

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const hasPathLocale = src.includes("const pathLocale = (() => {");
  const hasResolvedLocale = /const resolvedLocale\s*=/.test(src);
  const hasOldResolvedParamsLocaleRef = /\$\{resolvedParams\.locale\}/.test(src) ||
    /href=\{`\/\$\{resolvedParams\.locale\}`/.test(src);

  if (hasPathLocale && hasResolvedLocale && !hasOldResolvedParamsLocaleRef) {
    skipped++;
    return;
  }

  // 1. 如果没有 VALID_LOCALES 常量，加在 usePathname() 下面附近
  if (!src.includes("const VALID_LOCALES = [")) {
    const importsEnd = src.indexOf("const usePathnameResult");
    const idx = importsEnd > -1 ? importsEnd : src.indexOf('const pathname = usePathname');
    if (idx > -1) {
      const insertAt = src.indexOf('\n', idx);
      if (insertAt > -1) {
        src = src.slice(0, insertAt + 1) +
          "  const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];\n" +
          src.slice(insertAt + 1);
        changed = true;
      }
    }
  }

  // 2. 替换所有 ${resolvedParams.locale} -> ${resolvedLocale}
  const refRE = /\$\{resolvedParams\.locale\}/g;
  if (refRE.test(src)) {
    src = src.replace(refRE, '${resolvedLocale}');
    changed = true;
  }

  // 3. 替换 href={`/${resolvedParams.locale} 形式
  const hrefRE = /href=\{`\/\$\{resolvedParams\.locale\}/g;
  if (hrefRE.test(src)) {
    src = src.replace(hrefRE, 'href={`/${resolvedLocale}');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    processed++;
  } else {
    skipped++;
  }
}

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(full);
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      const parts = full.split(path.sep);
      if (parts.includes('tool') && LOCALES.some(loc => parts.includes(loc))) {
        processFile(full);
      }
    }
  }
}

processDir(path.join(ROOT, 'app'));
console.log(`处理完成：修复 ${processed}，跳过 ${skipped}`);
