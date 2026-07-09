const http = require('http');

const LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

const CORE = [
  { category: 'home', slugs: [''] },
  { category: 'static', slugs: ['tools', 'blog', 'news', 'workflows', 'about', 'privacy', 'terms', 'disclaimer'] },
  { category: 'selftool', slugs: ['password-generator', 'json-formatter', 'base64-tool', 'qr-code-generator', 'markdown-preview', 'timestamp-converter', 'pdf-merger', 'image-compressor', 'uuid-generator', 'regex-tester'] },
  { category: 'blog', slugs: ['password-generator-security-myths-2026', 'qr-code-generator-business-use-cases', 'pdf-tools-ultimate-guide-2026', 'what-is-regular-expression', 'beginner-5x5-linear', 'hrm-chest-vs-optical'] },
  { category: 'news', slugs: ['google-may-2026-core-update-recap', 'apple-intelligence-privacy-first-2026', 'cloudflare-workers-ai-ga-2026', 'vite-7-release-2026', 'typescript-5-8-release-2026', 'react-19-server-components-update-2026'] },
];

const routes = [];
for (const l of LOCALES) {
  for (const group of CORE) {
    for (const s of group.slugs) {
      let p;
      if (group.category === 'home') p = `/${l}/`;
      else if (group.category === 'selftool') p = `/${l}/tool/${s}/`;
      else if (group.category === 'blog') p = `/${l}/blog/${s}/`;
      else if (group.category === 'news') p = `/${l}/news/${s}/`;
      else p = `/${l}/${s}/`;
      routes.push(p);
    }
  }
}

const TOTAL = routes.length;
console.log(`[probe-105] Total critical routes: ${TOTAL}`);

let ok = 0, non200 = 0, fail = 0;
const failures = [];
const start = Date.now();

function checkOne(url) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (type, info) => {
      if (done) return;
      done = true;
      if (type === 'ok') ok++;
      else if (type === 'non200') { non200++; failures.push([url, info]); }
      else { fail++; failures.push([url, info]); }
      resolve();
    };
    const req = http.get(url, {
      timeout: 90000,
      headers: { 'Accept': 'text/html,*/*', 'User-Agent': 'probe105/1.0' },
    }, (res) => {
      res.resume();
      res.on('end', () => {
        const code = res.statusCode;
        if (code === 200 || code === 304 || code === 307 || code === 308) finish('ok');
        else finish('non200', 'HTTP ' + code);
      });
    });
    req.on('timeout', () => req.destroy(new Error('timeout 90s')));
    req.on('error', (e) => finish('fail', e.message || String(e)));
  });
}

(async () => {
  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    await checkOne(`http://localhost:3100${r}`);
    process.stdout.write(`\r[${i + 1}/${TOTAL}] ok=${ok} non200=${non200} fail=${fail}      `);
  }
  const sec = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n\n=== Critical 105 HTTP Check (${sec}s) ===`);
  console.log(`  OK       : ${ok}`);
  console.log(`  Non-2xx  : ${non200}`);
  console.log(`  Fail/Err : ${fail}`);
  if (failures.length) {
    console.log('\n--- Failures ---');
    for (const [u, info] of failures.slice(0, 30)) console.log(`  - ${u} :: ${info}`);
    if (failures.length > 30) console.log(`  ... and ${failures.length - 30} more`);
  }
  process.exit(non200 + fail > 0 ? 1 : 0);
})();
