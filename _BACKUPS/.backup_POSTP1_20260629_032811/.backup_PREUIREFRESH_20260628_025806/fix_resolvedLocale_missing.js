const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];

let fixed = 0;
let skipped = 0;

const PATH_LOCALE_END = `})();
const pathSlug`;

const INSERT_AFTER_PATHLOCALE = `})();
const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;
const pathSlug`;

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 已经有 resolvedLocale 声明的跳过
  if (/const resolvedLocale\s*=\s*\(resolvedParams/.test(src)) {
    skipped++;
    return;
  }

  // 如果有 VALID_LOCALES + pathLocale 的结尾 })()\n + const pathSlug
  // 插入 resolvedLocale 声明
  if (src.includes(PATH_LOCALE_END) && !src.includes("const resolvedLocale =")) {
    src = src.replace(PATH_LOCALE_END, INSERT_AFTER_PATHLOCALE);
    changed = true;
  }

  // 再做保险：如果只有 pathLocale，但没有 const resolvedLocale，也插入
  if (src.includes("const pathLocale = (() => {") && !/const resolvedLocale\s*=/.test(src)) {
    const re = /(const pathLocale = \(\(\) => \{\s*[\s\S]*?\}\)\(\);)(\s*const pathSlug)/;
    const m = src.match(re);
    if (m) {
      const full = m[0];
      const insert = "const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;\n";
      const replaced = full.replace(m[2], insert + m[2].trimStart() ? m[2].replace(/^\s*/, '\n' + insert) : m[2]);
      // 更稳妥：直接 split
      src = src.replace(re, (match, g1, g2) => {
        return g1 + '\n' + insert + (g2.startsWith('\n') ? g2 : '\n' + g2);
      });
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, src, 'utf8');
    fixed++;
  } else if (!changed) {
    skipped++;
  }
}

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) processDir(full);
    else if (entry.isFile() && entry.name === 'page.tsx') {
      const parts = full.split(path.sep);
      if (parts.includes('tool') && LOCALES.some(l => parts.includes(l))) {
        processFile(full);
      }
    }
  }
}

processDir(path.join(ROOT, 'app'));
console.log(`修复resolvedLocale缺失：已修复 ${fixed}，跳过 ${skipped}`);
