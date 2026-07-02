const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];

let fixed = 0;
let skipped = 0;

// 定位：pathSlug 块以 })(); 结尾，并且前面有 VALID_LOCALES 和 pathLocale
function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');

  // 已有 resolvedLocale 声明 → 跳过
  if (/const resolvedLocale\s*=\s*\(resolvedParams/.test(src)) {
    skipped++;
    return;
  }

  // 用更简单的锚点：找到 "const pathSlug = (() => {" 这个块的结束 })();"
  // 然后立刻在它后面插入 resolvedLocale
  const anchor = /const pathSlug = \(\(\) => \{[\s\S]*?\}\)\(\);/;
  const m = src.match(anchor);
  if (!m) {
    skipped++;
    return;
  }

  const pos = m.index + m[0].length;
  const after = src.slice(pos);
  const before = src.slice(0, pos);

  const insert = `\nconst resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;`;

  src = before + insert + after;
  fs.writeFileSync(file, src, 'utf8');
  fixed++;
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
console.log(`简化版修复 resolvedLocale 缺失：已修复 ${fixed}，跳过 ${skipped}`);
