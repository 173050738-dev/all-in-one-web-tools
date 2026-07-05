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
  'og-image.svg',
  'og-image.png',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'sw.js',
  'ads.txt',
];
const targets = [OUT];
if (fs.existsSync(VERCEL_OUT_STATIC)) targets.push(VERCEL_OUT_STATIC);
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
