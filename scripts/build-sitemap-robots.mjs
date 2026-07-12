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

// ---------------- Tool slugs = 实际静态导出的工具（真实存在，避免 404 死链） ----------------
const topSlugsSrc = fs.readFileSync(path.join(ROOT, 'lib', 'topSlugs.ts'), 'utf-8');
const toolLinksSrc = fs.readFileSync(path.join(ROOT, 'lib', 'toolLinks.ts'), 'utf-8');
const toolSlugs = new Set();
// (1) INTERNAL_TOOL_SLUGS = new Set<string>([ '...', ... ])
const internalBlock = toolLinksSrc.match(/INTERNAL_TOOL_SLUGS\s*=\s*new Set<string>\(\[([\s\S]*?)\]\)/);
if (internalBlock) {
  for (const mm of internalBlock[1].matchAll(/['"`]([^'"`]+)['"`]/g)) toolSlugs.add(mm[1]);
}
// (2) TOP_TOOL_SLUGS 来自 INITIAL_HOME_TOOLS 前20（在 data/_initial-home.generated.ts）
const homeSrc = fs.readFileSync(path.join(ROOT, 'data', '_initial-home.generated.ts'), 'utf-8');
const homeSlugs = [...homeSrc.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)].map(x => x[1]).slice(0, 20);
for (const s of homeSlugs) toolSlugs.add(s);
console.log(`[sitemap-build] Found ${toolSlugs.size} tool slugs`);

// ---------------- Extract blog slugs from data/blog.ts via regex ----------------
const blogPath = path.join(ROOT, 'data', 'blog.ts');
const blogSrc = fs.existsSync(blogPath) ? fs.readFileSync(blogPath, 'utf-8') : '';
const blogSlugRegex = /slug:\s*['"`]([^'"`]+)['"`]/g;
const blogSlugs = new Set();
let mb;
while ((mb = blogSlugRegex.exec(blogSrc)) !== null) {
  if (mb[1]) blogSlugs.add(mb[1]);
}
console.log(`[sitemap-build] Found ${blogSlugs.size} blog slugs`);

// ---------------- Extract news slugs from data/news.ts via regex ----------------
const newsPath = path.join(ROOT, 'data', 'news.ts');
const newsSrc = fs.existsSync(newsPath) ? fs.readFileSync(newsPath, 'utf-8') : '';
const newsSlugRegex = /slug:\s*['"`]([^'"`]+)['"`]/g;
const newsSlugs = new Set();
let mn;
while ((mn = newsSlugRegex.exec(newsSrc)) !== null) {
  if (mn[1] && !['news', 'weekly', 'issue'].includes(mn[1])) newsSlugs.add(mn[1]);
}
console.log(`[sitemap-build] Found ${newsSlugs.size} news slugs`);

// ---------------- Page entries ----------------
const staticPages = [
  { path: '/', changeFreq: 'daily', priority: 1.0 },
  { path: '/about', changeFreq: 'monthly', priority: 0.4 },
  { path: '/compliance', changeFreq: 'weekly', priority: 0.5 },
  { path: '/workflows', changeFreq: 'weekly', priority: 0.6 },
  { path: '/workflow/canvas', changeFreq: 'monthly', priority: 0.4 },
  { path: '/workflow/custom', changeFreq: 'monthly', priority: 0.4 },
  { path: '/blog', changeFreq: 'daily', priority: 0.85 },
  { path: '/news', changeFreq: 'weekly', priority: 0.85 },
];

const toolEntries = [...toolSlugs].map((slug) => ({
  path: `/tool/${slug}`,
  changeFreq: 'weekly',
  priority: 0.8,
}));

const blogEntries = [...blogSlugs].map((slug) => ({
  path: `/blog/${slug}`,
  changeFreq: 'weekly',
  priority: 0.9,
}));

const newsEntries = [...newsSlugs].map((slug) => ({
  path: `/news/${slug}`,
  changeFreq: 'weekly',
  priority: 0.9,
}));

const allPages = [...staticPages, ...toolEntries, ...blogEntries, ...newsEntries];
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

// ---------------- Generate locale-specific sitemaps (zh / fr / en for 头条 & 海外SEO) ----------------
const XMLNS_LOCALE = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
function buildLocaleSitemap(locale) {
  let lxml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${XMLNS_LOCALE}>\n`;
  for (const page of allPages) {
    const base = page.path === '/' ? '' : page.path;
    const url = `${SITE_URL}/${locale}${base}/`;
    const priority = (locale === DEFAULT_LOCALE ? page.priority : page.priority * 0.92).toFixed(2);
    lxml += `  <url>\n`;
    lxml += `    <loc>${url}</loc>\n`;
    lxml += `    <lastmod>${now}</lastmod>\n`;
    lxml += `    <changefreq>${page.changeFreq}</changefreq>\n`;
    lxml += `    <priority>${priority}</priority>\n`;
    lxml += `  </url>\n`;
  }
  lxml += `</urlset>\n`;
  const p = path.join(publicDir, `sitemap-${locale}.xml`);
  fs.writeFileSync(p, lxml, 'utf-8');
  console.log(`[sitemap-build] Wrote ${p} for locale=${locale} (${Math.round(lxml.length / 1024)} KB, ${allPages.length} URLs)`);
}
['zh', 'fr', 'en', 'hi', 'es', 'ar'].forEach(buildLocaleSitemap);

// ---------------- Generate sitemap-index.xml (aggregates locale sitemaps only — no full sitemap to avoid duplicate URL) ----------------
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const l of KNOWN_LOCALES) {
  indexXml += `  <sitemap>\n    <loc>${SITE_URL}/sitemap-${l}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
}
indexXml += `</sitemapindex>\n`;
const indexPath = path.join(publicDir, 'sitemap-index.xml');
fs.writeFileSync(indexPath, indexXml, 'utf-8');
console.log(`[sitemap-build] Wrote ${indexPath} (${indexXml.length} bytes)`);

// ---------------- Generate robots.txt ----------------
const robots = `# Korelyy robots.txt
# Generated automatically — do not edit by hand.
# Rebuilt via scripts/build-sitemap-robots.mjs on every build.

User-agent: *
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Disallow: /api/
Disallow: /_next/

# ======== 头条搜索 / 豆包 专属爬虫（豆包抓取依赖头条搜索爬虫，必须单独放行）========
# ToutiaoSpider = 头条搜索主爬虫（zhanzhang.toutiao.com 绑定域名后爬取来源）
User-agent: ToutiaoSpider
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /tool/
Allow: /workflows/
Allow: /templates/
Allow: /about/
Allow: /compliance/
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
# 头条爬虫相对温和，Crawl-delay 不设置避免降低抓取频率

# ByteSpider = 字节跳动通用爬虫（豆包大模型训练/搜索补充抓取）
User-agent: ByteSpider
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /tool/
Allow: /workflows/
Allow: /templates/
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=

# Bytespider (全小写，部分豆包爬虫节点UA变体)
User-agent: Bytespider
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /tool/
Allow: /workflows/
Allow: /templates/
Disallow: /api/
Disallow: /_next/
Disallow: /*?_rsc=

User-agent: Googlebot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
Crawl-delay: 1

User-agent: Googlebot-Image
Allow: /
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Crawl-delay: 2

User-agent: Googlebot-News
Allow: /blog/
Allow: /news/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

User-agent: Googlebot-Video
Allow: /
Disallow: /api/
Disallow: /_next/
Crawl-delay: 2

User-agent: Bingbot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
Crawl-delay: 1

User-agent: Yandex
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

User-agent: PetalBot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
Crawl-delay: 1

User-agent: Yeti
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
Crawl-delay: 1

User-agent: SeznamBot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

User-agent: Bravebot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
Crawl-delay: 1

User-agent: YepBot
Allow: /
Allow: /blog/
Allow: /news/
Allow: /tools/
Allow: /workflows/
Allow: /templates/
Allow: /og-image.png
Disallow: /api/
Disallow: /_next/
Disallow: /ideas
Disallow: /*?_rsc=
Crawl-delay: 1

# ======== Sitemaps（分语言版本由 sitemap-index.xml 统一索引）========
Sitemap: ${SITE_URL}/sitemap-index.xml

Host: ${SITE_URL}
`;

const robotsPath = path.join(publicDir, 'robots.txt');
fs.writeFileSync(robotsPath, robots, 'utf-8');
console.log(`[sitemap-build] Wrote ${robotsPath} (${robots.length} bytes)`);
