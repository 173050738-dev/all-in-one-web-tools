// scripts/post-build.cjs — restore middleware, copy CF static assets to out/ root.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const PUB = path.join(ROOT, 'public');

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
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'sw.js',
  'ads.txt',
];
let copied = 0;
for (const f of COPY_FILES) {
  const src = path.join(PUB, f);
  const dst = path.join(OUT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    copied++;
  }
}
// duplicate favicon.svg as favicon.ico for CF Pages fallback (browsers MIME-sniff)
if (fs.existsSync(path.join(PUB, 'favicon.svg'))) {
  fs.copyFileSync(path.join(PUB, 'favicon.svg'), path.join(OUT, 'favicon.ico'));
  copied++;
}
console.log('[post-build] copied', copied, 'static files to out/');
