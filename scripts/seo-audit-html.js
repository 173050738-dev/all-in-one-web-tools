const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = [
  path.join(ROOT, 'app'),
  path.join(ROOT, 'components'),
];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git'];

function walk(dir, acc) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of ents) {
    if (EXCLUDE_DIRS.includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.isFile() && /\.tsx?$/i.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = SCAN_DIRS.flatMap(d => walk(d, []));
console.log(`Scanning ${files.length} files...`);

const imgNoAlt = [];
const externalLinks = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');

  // --- <img ... 检查 alt ---
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 多行 img 合并：简单起见，以行号触发；跨多行 img 可能漏，但本项目 img 多单行写
    // 匹配 <img  ...  >
    const imgStart = line.indexOf('<img');
    if (imgStart === -1) continue;
    const end = line.indexOf('/>', imgStart);
    const close = line.indexOf('>', imgStart);
    const imgEnd = end === -1 ? close : (close === -1 ? -1 : Math.min(end, close));
    if (imgEnd === -1) continue;
    const tag = line.slice(imgStart, imgEnd + 1);
    if (!/\salt\s*=/.test(tag) && !/\salt\s*=\s*\{/.test(tag) && !/\salt\s*=\s*"/.test(tag) && !/\salt\s*=\s*'/.test(tag)) {
      // 允许显式 alt="" 或 alt={''} 或 alt={null}（装饰性图）
      const pureAltEmpty = /\salt\s*=\s*""|\salt\s*=\s*''|\salt\s*=\s*\{\s*(""|''|null)\s*\}/.test(tag);
      if (!pureAltEmpty) imgNoAlt.push({ file: rel, line: i + 1, tag });
    }
  }

  // --- 外链 nofollow ---
  // 用正则找 href="http*"
  const hrefRe = /<a\b[^>]*?href\s*=\s*(["'])((?:https?:|\/\/)[^"'>]+)\1[^>]*>/gi;
  let m;
  while ((m = hrefRe.exec(src)) !== null) {
    const tag = m[0];
    const url = m[2];
    if (/korelyy\.com|localhost|127\.0\.0\.1/i.test(url)) continue;
    if (/rel\s*=\s*(["'])[^"']*nofollow[^"']*\1/i.test(tag)) continue;
    const ln = src.slice(0, m.index).split('\n').length;
    externalLinks.push({ file: rel, line: ln, url, tag: tag.slice(0, 200) });
  }
}

console.log('\n==== IMG missing alt (not empty) ====');
imgNoAlt.slice(0, 50).forEach(x => console.log(`${x.file}:${x.line}  ${x.tag.slice(0, 160)}`));
console.log(`Total: ${imgNoAlt.length}`);

console.log('\n==== External link missing nofollow ====');
externalLinks.slice(0, 50).forEach(x => console.log(`${x.file}:${x.line}  ${x.url}`));
console.log(`Total: ${externalLinks.length}`);
