const fs = require('fs');
const path = require('path');

const NOINDEX_TOOLS = [
  'seo-keyword-miner',
  'keyword-spinoff-generator'
];

const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];

// Auto-detect output directory (out/ for legacy, .vercel/output/static/ for ISR)
const ROOT = path.join(__dirname, '..');
let OUT_DIR;
if (fs.existsSync(path.join(ROOT, 'out'))) {
  OUT_DIR = path.join(ROOT, 'out');
} else if (fs.existsSync(path.join(ROOT, '.vercel', 'output', 'static'))) {
  OUT_DIR = path.join(ROOT, '.vercel', 'output', 'static');
} else {
  console.error('Error: No output directory found (out/ or .vercel/output/static/)');
  process.exit(1);
}

console.log(`Using output directory: ${path.relative(ROOT, OUT_DIR)}`);

let modifiedCount = 0;

LOCALES.forEach(locale => {
  NOINDEX_TOOLS.forEach(slug => {
    const htmlPath = path.join(OUT_DIR, locale, 'tool', slug, 'index.html');

    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');

      if (html.includes('noindex')) {
        console.log(`  SKIP ${locale}/tool/${slug} (already has noindex)`);
        return;
      }

      const noindexMeta = '<meta name="robots" content="noindex, nofollow">';

      const titleMatch = html.match(/<title>[^<]*<\/title>/);
      if (titleMatch) {
        html = html.replace(
          titleMatch[0],
          titleMatch[0] + noindexMeta
        );
      } else {
        html = html.replace(
          '<head>',
          '<head>' + noindexMeta
        );
      }

      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log(`  OK   ${locale}/tool/${slug} -> noindex injected`);
      modifiedCount++;
    } else {
      console.log(`  MISS ${locale}/tool/${slug} (file not found)`);
    }
  });
});

console.log(`\nDone: ${modifiedCount} files modified.`);