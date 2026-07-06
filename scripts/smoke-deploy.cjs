/* eslint-disable */
const BASE = process.env.KORELYY_SMOKE_BASE || 'https://5c7b1057.korelyy-tools.pages.dev';

async function head(path, extraHeaders = {}) {
  const res = await fetch(BASE + path, {
    method: 'GET',
    redirect: 'manual',
    headers: { 'User-Agent': 'korelyy-smoke-test/1.0', ...extraHeaders },
  });
  return { status: res.status, location: res.headers.get('location') || '' };
}

async function full(path) {
  const res = await fetch(BASE + path, {
    headers: { 'User-Agent': 'korelyy-smoke-test/1.0' },
  });
  return { status: res.status, html: await res.text() };
}

function findMeta(html, attr, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    '<meta[^>]+' + attr + '="' + escaped + '"[^>]*content="([^"]*)"',
    'i'
  );
  const m = html.match(re);
  return m ? m[1] : null;
}

let FAIL = 0;
function check(label, cond, detail = '') {
  const tag = cond ? 'PASS' : 'FAIL';
  if (!cond) FAIL += 1;
  console.log('  [' + tag + '] ' + label + (detail ? '  · ' + detail : ''));
}

(async () => {
  console.log('Base URL: ' + BASE);
  console.log('');

  console.log('=== 1) Accept-Language zh-CN → 307 /zh');
  let r = await head('/', { 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8' });
  check('307 + /zh suffix', r.status === 307 && r.location.endsWith('/zh'), 'status=' + r.status + ' loc=' + r.location);

  console.log('');
  console.log('=== 2) Accept-Language es-MX (拉美西语) → 307 /es');
  r = await head('/', { 'Accept-Language': 'es-MX,es;q=0.9,en;q=0.1' });
  check('307 + /es suffix', r.status === 307 && r.location.endsWith('/es'), 'status=' + r.status + ' loc=' + r.location);

  console.log('');
  console.log('=== 3) Accept-Language=en + Cookie korelyy-locale=zh → 307 /zh (Cookie优先)');
  r = await head('/', {
    'Accept-Language': 'en-US,en;q=0.9',
    Cookie: 'korelyy-locale=zh',
  });
  check('307 + /zh suffix (ignores en Accept-Language)', r.status === 307 && r.location.endsWith('/zh'), 'status=' + r.status + ' loc=' + r.location);

  console.log('');
  console.log('=== 4) Accept-Language=en + Cookie korelyy-locale=fr → 307 /fr');
  r = await head('/', {
    'Accept-Language': 'en-US,en;q=0.9',
    Cookie: 'korelyy-locale=fr',
  });
  check('307 + /fr suffix', r.status === 307 && r.location.endsWith('/fr'), 'status=' + r.status + ' loc=' + r.location);

  console.log('');
  console.log('=== 5) /zh/tool/title-weight-checker → 200 + 中文 Meta + canonical + 「内容创作」导航');
  let page = await full('/zh/tool/title-weight-checker');
  check('200 status', page.status === 200, 'status=' + page.status + ' len=' + page.html.length);
  const zhTitle = page.html.match(/<title>([^<]+)<\/title>/)?.[1] || null;
  const ogTitle = findMeta(page.html, 'property', 'og:title');
  const ogDesc = findMeta(page.html, 'property', 'og:description');
  const ogType = findMeta(page.html, 'property', 'og:type');
  const ogSite = findMeta(page.html, 'property', 'og:site_name');
  const ogUrl = findMeta(page.html, 'property', 'og:url');
  const twCard = findMeta(page.html, 'name', 'twitter:card');
  const twTitle = findMeta(page.html, 'name', 'twitter:title');
  const twDesc = findMeta(page.html, 'name', 'twitter:description');
  const zhDesc = findMeta(page.html, 'name', 'description');
  const hasCanonical = /<link[^>]+rel="canonical"/.test(page.html);
  const hasContentTools = page.html.includes('内容创作') || page.html.includes('content-tools');
  check('<title> 包含「标题权重」', !!zhTitle && zhTitle.includes('标题权重'), zhTitle || 'null');
  check('meta description 非空 (>10 chars)', !!zhDesc && zhDesc.length > 10, zhDesc ? 'len=' + zhDesc.length : 'null');
  check('og:type = website', ogType === 'website', ogType);
  check('og:site_name = Korelyy Tools', ogSite === 'Korelyy Tools', ogSite);
  check('og:title 包含「标题权重」', !!ogTitle && ogTitle.includes('标题权重'), ogTitle);
  check('og:description 非空', !!ogDesc && ogDesc.length > 10, ogDesc ? 'len=' + ogDesc.length : 'null');
  check('og:url 非空且为 https', !!ogUrl && ogUrl.startsWith('https://'), ogUrl);
  check('twitter:card = summary_large_image', twCard === 'summary_large_image', twCard);
  check('twitter:title 包含「标题权重」', !!twTitle && twTitle.includes('标题权重'), twTitle);
  check('twitter:description 非空', !!twDesc && twDesc.length > 10, twDesc ? 'len=' + twDesc.length : 'null');
  check('<link rel="canonical" 存在', hasCanonical);
  check('导航分类含「内容创作」', hasContentTools);

  console.log('');
  console.log('=== 6) /en/tool/title-weight-checker → 200 + 英文 Meta');
  page = await full('/en/tool/title-weight-checker');
  check('200 status', page.status === 200, 'status=' + page.status + ' len=' + page.html.length);
  const enTitle = page.html.match(/<title>([^<]+)<\/title>/)?.[1] || null;
  const enOgTitle = findMeta(page.html, 'property', 'og:title');
  const enTwTitle = findMeta(page.html, 'name', 'twitter:title');
  const enDesc = findMeta(page.html, 'name', 'description');
  check('<title> 英文 (含 Title 或 Weight)', !!enTitle && /title|weight/i.test(enTitle), enTitle || 'null');
  check('og:title 英文 (标题里含 Title/Weight)', !!enOgTitle && /title|weight/i.test(enOgTitle), enOgTitle);
  check('twitter:title 英文', !!enTwTitle && /title|weight/i.test(enTwTitle), enTwTitle);
  check('description 英文非空', !!enDesc && enDesc.length > 10, enDesc ? 'len=' + enDesc.length : 'null');

  console.log('');
  console.log('=== 7) 6 种语言首页 200 渲染');
  const langs = ['zh', 'en', 'fr', 'es', 'hi', 'ar'];
  for (const l of langs) {
    const s = (await full('/' + l + '/')).status;
    check('/' + l + '/ 200', s === 200, 'status=' + s);
  }

  console.log('');
  console.log('=== 8) 静态资源不重定向（robots.txt 200）');
  const robots = await head('/robots.txt');
  check('robots.txt 200', robots.status === 200, 'status=' + robots.status);
  const manifest = await head('/site.webmanifest');
  check('site.webmanifest 200', manifest.status === 200, 'status=' + manifest.status);
  const sw = await head('/sw.js');
  check('sw.js 200', sw.status === 200, 'status=' + sw.status);

  console.log('');
  if (FAIL === 0) {
    console.log('✅ ALL SMOKE TESTS PASSED');
    process.exit(0);
  } else {
    console.log('❌ ' + FAIL + ' TEST(S) FAILED');
    process.exit(1);
  }
})().catch((e) => {
  console.error('UNEXPECTED ERROR:', e);
  process.exit(2);
});
