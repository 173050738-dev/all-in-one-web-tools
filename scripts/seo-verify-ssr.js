const https = require('https');
const http = require('http');

const URLs = [
  'http://localhost:3000/',
  'http://localhost:3000/en/',
  'http://localhost:3000/zh/',
  'http://localhost:3000/hi/',
  'http://localhost:3000/es/',
  'http://localhost:3000/fr/',
  'http://localhost:3000/ar/',
  'http://localhost:3000/zh/about/',
  'http://localhost:3000/zh/compliance/',
  'http://localhost:3000/zh/workflows/',
  'http://localhost:3000/zh/tool/uuid-generator/',
  'http://localhost:3000/zh/tool/regex-tester/',
  'http://localhost:3000/hi/tool/regex-tester/',
  'http://localhost:3000/en/tool/qr-code-generator/',
  'http://localhost:3000/sitemap.xml',
  'http://localhost:3000/robots.txt',
];

function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const u = new URL(url);
    const req = lib.request({
      method: 'GET',
      hostname: u.hostname,
      port: u.port || null,
      path: u.pathname + u.search,
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.on('error', reject);
    req.end();
  });
}

function matchCount(re, s) {
  const m = s.match(re);
  return m ? m.length : 0;
}

(async () => {
  for (const u of URLs) {
    console.log(`\n==== ${u} ====`);
    try {
      const r = await fetchHttp(u);
      console.log(`Status: ${r.status}`);
      if (u.endsWith('/sitemap.xml') || u.endsWith('/robots.txt')) {
        console.log('--- CONTENT PREVIEW (first 500 chars) ---');
        console.log(r.body.slice(0, 500));
        continue;
      }
      const title = (r.body.match(/<title>(.*?)<\/title>/s) || [])[1] || '';
      const desc = (r.body.match(/<meta[^>]+name=["']description["'][^>]*content=["'](.*?)["']/is) || [])[1] || '';
      const canon = (r.body.match(/<link[^>]+rel=["']canonical["'][^>]*href=["'](.*?)["']/is) || [])[1] || '';
      const hreflang = matchCount(/<link[^>]+rel=["']alternate["'][^>]+hreflang=/gi, r.body);
      const xdefault = /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']x-default["']/i.test(r.body);
      const ogTitle = (r.body.match(/<meta[^>]+property=["']og:title["'][^>]*content=["'](.*?)["']/is) || [])[1] || '';
      const ogUrl = (r.body.match(/<meta[^>]+property=["']og:url["'][^>]*content=["'](.*?)["']/is) || [])[1] || '';
      const jsonld = matchCount(/<script[^>]+type=["']application\/ld\+json["']/gi, r.body);
      const h1Count = matchCount(/<h1[\s>]/gi, r.body);
      const twitterImg = /<meta[^>]+name=["']twitter:image["']/i.test(r.body);
      console.log(`Title       : ${title.trim()}`);
      console.log(`Description : ${(desc || '').slice(0, 140)}`);
      console.log(`Canonical   : ${canon}`);
      console.log(`hreflang count: ${hreflang} (x-default: ${xdefault ? 'YES' : 'NO'})`);
      console.log(`og:title    : ${ogTitle.slice(0, 120)}`);
      console.log(`og:url      : ${ogUrl}`);
      console.log(`twitter:image set: ${twitterImg ? 'YES' : 'NO'}`);
      console.log(`JSON-LD blocks: ${jsonld}`);
      console.log(`H1 count     : ${h1Count}`);
    } catch (e) {
      console.log(`ERR: ${e.message}`);
    }
  }
})();
