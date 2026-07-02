const fs = require('fs');
const path = require('path');

const langs = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];
const base = 'https://korelyy.com';

const workflows = [
  'ai-illustration','ai-novel','api-auto-doc','api-development','banner-design','business-plan',
  'client-email-followup','code-review','color-branding','comment-auto-reply','community-fission',
  'competitive-analysis','cross-border-finance','cross-border-listing','custom-tool-proposal',
  'database-design','db-backup-report','delivery-packager','deployment-ops','design-spec',
  'dev-tools','digital-human','douyin-copy','email-marketing','exam-prep','fiverr-proposal',
  'freelancer-competitor-monitor','frontend-debug','frontend-ui','gdpr-compliance-scan',
  'git-workflow','hourly-billing','image-process','inventory-alert','invoice-generator',
  'landing-page','livestream-slice','localize-western-sea','logo-design','meeting-minutes',
  'meta-ad-creative','multi-currency-pricing','multilingual-cs','multi-platform-distro',
  'multi-site-sync','nl-to-code','okr-setup','online-course','order-calendar-sync',
  'pdf-workflow','podcast-production','portfolio-auto-layout','poster-design','ppt-design',
  'prd-writing','private-domain-sop','product-image-ai','productivity-setup',
  'product-photography','reading-notes','resume-build','saas-analytics','seo-keyword',
  'seo-optimization','social-media','social-scheduling','social-weekly-report','student-paper',
  'study-abroad','tiktok-seeding','ui-component','uptime-alert','user-research',
  'video-creation','video-pipeline','viral-retrospective','vlog-workflow','wechat-article',
  'weekly-report','xiaohongshu-note'
];

const tools = [
  'avatar-decorator','base64-tool','caption-generator','case-converter','color-picker',
  'copy-cleaner','countdown','danmaku','decision-wheel','emoji-mixer','fortune-sticks',
  'grid-cutter','image-compressor','image-to-base64','json-formatter','keyword-spinoff-generator',
  'markdown-platform-adapter','markdown-preview','mortgage-calculator','password-generator',
  'pdf-merger','pinyin-annotator','qr-code-generator','random-number','regex-tester',
  'script-splitter','sentiment-analyzer','text-counter','text-to-speech','text-tools',
  'timestamp-converter','title-weight-checker','url-encode-decode','uuid-generator',
  'vertical-chinese-generator','wallpaper-maker'
];

const topPages = ['about','api-keys','batch-image-processor','compliance','contact','cookies','disclaimer','ideas','privacy','templates','terms'];

function urlEntry(loc, changefreq, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

let entries = [];
let count = 0;

// 1. Root
entries.push(urlEntry(base + '/', 'daily', '1.0'));
count++;

// 2. Language homepages
langs.forEach(lang => {
  const cfreq = (lang === 'en' || lang === 'zh') ? 'daily' : 'weekly';
  const pri = lang === 'zh' ? '1.0' : lang === 'en' ? '0.9' : (lang === 'es' || lang === 'fr') ? '0.8' : '0.7';
  entries.push(urlEntry(base + '/' + lang + '/', cfreq, pri));
  count++;
});

// 3. Top-level pages per language
topPages.forEach(page => {
  langs.forEach(lang => {
    const pri = (lang === 'en' || lang === 'zh') ? '0.7' : '0.5';
    entries.push(urlEntry(base + '/' + lang + '/' + page + '/', 'monthly', pri));
    count++;
  });
});

// 4. All tools per language
tools.forEach(tool => {
  langs.forEach(lang => {
    const pri = (lang === 'en' || lang === 'zh') ? '0.8' : '0.6';
    entries.push(urlEntry(base + '/' + lang + '/tool/' + tool + '/', 'monthly', pri));
    count++;
  });
});

// 5. Workflows list
langs.forEach(lang => {
  const pri = (lang === 'en' || lang === 'zh') ? '0.9' : '0.7';
  entries.push(urlEntry(base + '/' + lang + '/workflows/', 'weekly', pri));
  count++;
});

// 6. Workflow canvas
langs.forEach(lang => {
  entries.push(urlEntry(base + '/' + lang + '/workflow/canvas/', 'monthly', '0.6'));
  count++;
});

// 7. All workflow slugs
workflows.forEach(wf => {
  langs.forEach(lang => {
    const pri = (lang === 'en' || lang === 'zh') ? '0.8' : '0.6';
    entries.push(urlEntry(base + '/' + lang + '/workflow/' + wf + '/', 'weekly', pri));
    count++;
  });
});

console.log('Total URLs:', count);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

const outPath = 'D:/projects/工具独立站/public/sitemap.xml';
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Written:', outPath);
