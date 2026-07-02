// Post-build SEO injector for static export.
// ToolDetailWrapper injects title/OG/Twitter/canonical via client useEffect which crawlers cannot see.
// This script rewrites each tool detail HTML directly in out/ so the first response already contains correct tags.
//
// Usage: node scripts/rewrite-meta.cjs

const fs = require('fs');
const path = require('path');

const SUPPORTED_LOCALES = ['zh', 'en', 'fr', 'es', 'hi', 'ar'];
const BASE_URL = process.env.KORELYY_CANONICAL_BASE || 'https://korelyy.com';

const ADSENSE_PUB = 'ca-pub-7235824755389632';
const ADSENSE_BLOCK =
  '\n<!-- AdSense:static-injected -->\n' +
  '<meta name="google-adsense-account" content="' + ADSENSE_PUB + '">\n' +
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_PUB + '" crossorigin="anonymous"></script>\n' +
  '<!-- /AdSense:static-injected -->\n';

const ROOT = path.resolve(__dirname, '..');
const outDir = path.join(ROOT, 'out');
const appZhToolDir = path.join(ROOT, 'app', 'zh', 'tool');

const slugs = fs
  .readdirSync(appZhToolDir, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      fs.existsSync(path.join(appZhToolDir, d.name, 'page.tsx'))
  )
  .map((d) => d.name);

console.log('[rewrite-meta] tool slugs found:', slugs.length);

const localeData = {};
for (const l of SUPPORTED_LOCALES) {
  const f = path.join(ROOT, 'public', 'locales', l, 'translation.json');
  try {
    const json = JSON.parse(fs.readFileSync(f, 'utf8'));
    localeData[l] = json && json.tools ? json.tools : {};
  } catch (e) {
    console.error('[rewrite-meta] failed to read locale data (' + l + '):', e.message);
    localeData[l] = {};
  }
}

function escapeForHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildInjection({ name, description, canonical }) {
  const title = name + ' - Korelyy Tools';
  const desc = description || name;
  const t = escapeForHtml(title);
  const d = escapeForHtml(desc);
  const c = escapeForHtml(canonical);
  return (
    '\n<!-- SEO:static-injected -->\n' +
    '<title>' + t + '</title>\n' +
    '<meta name="description" content="' + d + '">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="Korelyy Tools">\n' +
    '<meta property="og:title" content="' + t + '">\n' +
    '<meta property="og:description" content="' + d + '">\n' +
    '<meta property="og:url" content="' + c + '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:title" content="' + t + '">\n' +
    '<meta name="twitter:description" content="' + d + '">\n' +
    '<link rel="canonical" href="' + c + '">\n' +
    '<!-- /SEO:static-injected -->\n'
  );
}

const REMOVE_PATTERNS = [
  /<title[^>]*>[\s\S]*?<\/title>\s*/gi,
  /<link[^>]+rel=["']canonical["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']description["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:type["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:site_name["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:title["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:description["'][^>]*\/?>\s*/gi,
  /<meta[^>]+property=["']og:url["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:card["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:title["'][^>]*\/?>\s*/gi,
  /<meta[^>]+name=["']twitter:description["'][^>]*\/?>\s*/gi,
];

function replaceHead(html, injection) {
  let h = html;
  for (const p of REMOVE_PATTERNS) h = h.replace(p, '');
  if (!/<\/head>/i.test(h)) {
    throw new Error('missing </head> in HTML');
  }
  return h.replace(/<\/head>/i, injection + '</head>');
}

let written = 0;
let skippedNoFile = 0;
let skippedNoTranslation = 0;

for (const l of SUPPORTED_LOCALES) {
  for (const slug of slugs) {
    const file = path.join(outDir, l, 'tool', slug, 'index.html');
    if (!fs.existsSync(file)) {
      skippedNoFile++;
      continue;
    }
    const tool = localeData[l] && localeData[l][slug] ? localeData[l][slug] : null;
    if (!tool || !tool.name) {
      skippedNoTranslation++;
      continue;
    }
    const canonical = BASE_URL.replace(/\/$/, '') + '/' + l + '/tool/' + slug + '/';
    const injection = buildInjection({
      name: tool.name,
      description: tool.description,
      canonical,
    });
    const html = fs.readFileSync(file, 'utf8');
    const next = replaceHead(html, injection);
    fs.writeFileSync(file, next, 'utf8');
    written++;
  }
}

function addAdsenseAll(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let added = 0;
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      added += addAdsenseAll(p);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      const html = fs.readFileSync(p, 'utf8');
      if (html.includes('<!-- AdSense:static-injected -->')) continue;
      if (!/<\/head>/i.test(html)) continue;
      const next = html.replace(/<\/head>/i, ADSENSE_BLOCK + '</head>');
      fs.writeFileSync(p, next, 'utf8');
      added++;
    }
  }
  return added;
}
const adsenseAdded = addAdsenseAll(outDir);
console.log('[rewrite-meta] adsense injected into pages:', adsenseAdded);

console.log(
  '[rewrite-meta] written=' +
    written +
    ' skippedNoFile=' +
    skippedNoFile +
    ' skippedNoTranslation=' +
    skippedNoTranslation
);
