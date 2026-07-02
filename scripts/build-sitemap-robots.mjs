// Build public/sitemap.xml and public/robots.txt for static export (output: 'export')
// Run: node scripts/build-sitemap-robots.mjs
// Runs automatically after `next build` via package.json postbuild hook

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const SITE_URL = 'https://korelyy.com';
const KNOWN_LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];
const DEFAULT_LOCALE = 'en';

// ---------------- Extract tool slugs from data/tools.ts via regex ----------------
const toolsPath = path.join(ROOT, 'data', 'tools.ts');
const toolsSrc = fs.readFileSync(toolsPath, 'utf-8');
const slugRegex = /slug:\s*['"`]([^'"`]+)['"`]/g;
const toolSlugs = new Set();
let m;
while ((m = slugRegex.exec(toolsSrc)) !== null) {
  if (m[1]) toolSlugs.add(m[1]);
}
console.log(`[sitemap-build] Found ${toolSlugs.size} tool slugs`);

// ---------------- Page entries ----------------
const staticPages = [
  { path: '/', changeFreq: 'daily', priority: 1.0 },
  { path: '/about', changeFreq: 'monthly', priority: 0.4 },
  { path: '/compliance', changeFreq: 'weekly', priority: 0.5 },
  { path: '/workflows', changeFreq: 'weekly', priority: 0.6 },
  { path: '/workflow/canvas', changeFreq: 'monthly', priority: 0.4 },
  { path: '/workflow/custom', changeFreq: 'monthly', priority: 0.4 },
];

const toolEntries = [...toolSlugs].map((slug) => ({
  path: `/tool/${slug}`,
  changeFreq: 'weekly',
  priority: 0.8,
}));

const allPages = [...staticPages, ...toolEntries];
console.log(`[sitemap-build] ${allPages.length} page entries (×${KNOWN_LOCALES.length} locales = ${allPages.length * KNOWN_LOCALES.length} URLs)`);

// ---------------- Generate sitemap.xml ----------------
const now = new Date().toISOString();
const XMLNS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"';

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${XMLNS}>\n`;

for (const page of allPages) {
  const base = page.path === '/' ? '' : page.path;
  for (const l of KNOWN_LOCALES) {
    const url = `${SITE_URL}/${l}${base}/`;
    const priority = (l === DEFAULT_LOCALE ? page.priority : page.priority * 0.9).toFixed(2);
    const alternates = KNOWN_LOCALES.map(
      (ll) => `    <xhtml:link rel="alternate" hreflang="${ll}" href="${SITE_URL}/${ll}${base}/"/>`,
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${DEFAULT_LOCALE}${base}/"/>`;
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changeFreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `${alternates}\n${xDefault}\n`;
    xml += `  </url>\n`;
  }
}

xml += `</urlset>\n`;

const publicDir = path.join(ROOT, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf-8');
console.log(`[sitemap-build] Wrote ${sitemapPath} (${Math.round(xml.length / 1024)} KB)`);

// ---------------- Generate robots.txt ----------------
const robots = `# Korelyy robots.txt
# Generated automatically — do not edit by hand.
# Rebuilt via scripts/build-sitemap-robots.mjs on every build.

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: Baiduspider
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: ${SITE_URL}/sitemap.xml

Host: ${SITE_URL}
`;

const robotsPath = path.join(publicDir, 'robots.txt');
fs.writeFileSync(robotsPath, robots, 'utf-8');
console.log(`[sitemap-build] Wrote ${robotsPath} (${robots.length} bytes)`);
