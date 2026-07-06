/* eslint-disable */
// scripts/post-build.cjs — restore middleware, copy CF static assets to out/ (legacy) AND .vercel/output/static (next-on-pages ISR).
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const VERCEL_OUT_STATIC = path.join(ROOT, '.vercel', 'output', 'static');
const PUB = path.join(ROOT, 'public');

function ensureDir(dir) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return true;
  } catch (e) {
    return false;
  }
}
ensureDir(OUT);

const mwBak = path.join(ROOT, 'middleware.ts.bak');
const mw = path.join(ROOT, 'middleware.ts');
if (fs.existsSync(mwBak)) {
  fs.renameSync(mwBak, mw);
  console.log('[post-build] restored middleware.ts from .bak');
} else if (fs.existsSync(mw)) {
  console.log('[post-build] middleware.ts already in place');
} else {
  console.warn('[post-build] no middleware.ts/.bak found (proceeding without)');
}

const COPY_FILES = [
  '_headers',
  '_redirects',
  '_worker.js',
  'favicon.svg',
  'og-image.png',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'sw.js',
  'ads.txt',
];

// ============================================================
// SEO: 为所有已静态导出的 HTML 注入 6 语言 hreflang 链接
// output:'export' 时 Next Metadata alternates.languages 不会落盘到 <head>，
// 这里在产物构建后批量补，保证 Google 读取静态 HTML 时就能拿到 hreflang。
// ============================================================
const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];
const DEFAULT_LOCALE = 'en';
const SITE_URL = 'https://korelyy.com';

function listHtmlFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listHtmlFiles(p, acc);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) acc.push(p);
  }
  return acc;
}

function pathWithoutLocaleAndSuffix(fileAbs, rootOut) {
  const rel = path.relative(rootOut, fileAbs).split(path.sep).join('/');
  const withoutIndex = rel.endsWith('/index.html')
    ? rel.slice(0, -'/index.html'.length)
    : rel.endsWith('.html')
      ? rel.slice(0, -'.html'.length)
      : rel;
  const parts = withoutIndex.split('/').filter(Boolean);
  if (parts.length >= 1 && KNOWN_LOCALES.includes(parts[0])) {
    parts.shift();
  }
  return '/' + parts.join('/') + (parts.length === 0 ? '/' : '/');
}

function buildHreflangBlock(pathWithoutLocale) {
  const canonical = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`;
  const norm = canonical.endsWith('/') ? canonical : `${canonical}/`;
  const links = [];
  for (const l of KNOWN_LOCALES) {
    links.push(
      `  <link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${norm}" data-korelyy-hreflang-inject="1" />`
    );
  }
  links.push(
    `  <link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LOCALE}${norm}" data-korelyy-hreflang-inject="1" />`
  );
  return `\n${links.join('\n')}\n`;
}

function injectHreflangToHtml(html, hreflangBlock) {
  if (html.includes('data-korelyy-hreflang-inject=')) return html;
  const marker = '</head>';
  const idx = html.lastIndexOf(marker);
  if (idx === -1) return html;
  return html.slice(0, idx) + hreflangBlock + html.slice(idx);
}

const targets = [OUT];
if (fs.existsSync(VERCEL_OUT_STATIC)) targets.push(VERCEL_OUT_STATIC);

function runInjectHreflang(target) {
  const htmlFiles = listHtmlFiles(target);
  let injected = 0;
  let skipped = 0;
  for (const file of htmlFiles) {
    try {
      const original = fs.readFileSync(file, 'utf8');
      const restPath = pathWithoutLocaleAndSuffix(file, target);
      const block = buildHreflangBlock(restPath);
      const next = injectHreflangToHtml(original, block);
      if (next !== original) {
        fs.writeFileSync(file, next, 'utf8');
        injected++;
      } else {
        skipped++;
      }
    } catch (e) {
      console.warn('[post-build] inject hreflang skip', path.relative(ROOT, file), e?.code || e?.message);
    }
  }
  console.log(
    `[post-build] SEO hreflang injected for ${injected} files (skipped ${skipped}) → ${path.relative(ROOT, target)}`
  );
}
for (const target of targets) {
  if (fs.existsSync(target)) runInjectHreflang(target);
}

let copied = 0;
for (const target of targets) {
  ensureDir(target);
  for (const f of COPY_FILES) {
    const src = path.join(PUB, f);
    const dst = path.join(target, f);
    if (fs.existsSync(src)) {
      try { fs.copyFileSync(src, dst); copied++; }
      catch (e) { console.warn('[post-build] skip copy', f, '→', target, e.code || e.message); }
    }
  }
  if (fs.existsSync(path.join(PUB, 'favicon.svg'))) {
    try { fs.copyFileSync(path.join(PUB, 'favicon.svg'), path.join(target, 'favicon.ico')); copied++; }
    catch (e) { console.warn('[post-build] skip favicon.ico →', target, e.code || e.message); }
  }
}
// --- Guarantee ads.txt in out/ and .vercel/output/static (source of truth: post-build) ---
const adsTxtContent =
  '# AdSense ads.txt for Korelyy Tools — https://korelyy.com\n' +
  'google.com, pub-7235824755389632, DIRECT, f08c47fec0942fa0\n';
for (const target of targets) {
  ensureDir(target);
  try {
    const adsTxtPath = path.join(target, 'ads.txt');
    fs.writeFileSync(adsTxtPath, adsTxtContent, 'utf8');
    const sz = fs.statSync(adsTxtPath).size;
    console.log('[post-build] wrote ads.txt (' + sz + ' bytes) → ' + path.relative(ROOT, target));
    copied++;
  } catch (e) {
    console.warn('[post-build] skip ads.txt →', target, e.code || e.message);
  }
}
console.log('[post-build] copied', copied, 'static files to targets:', targets.map(t => path.relative(ROOT, t)).join(','));
