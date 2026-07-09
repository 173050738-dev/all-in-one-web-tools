const http = require('http');

const LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];

const PER_LOCALE = [
  { prefix: '', path: '' },
  { prefix: '', path: 'tools' },
  { prefix: '', path: 'blog' },
  { prefix: '', path: 'news' },
  { prefix: '', path: 'about' },
  { prefix: '', path: 'privacy' },
  { prefix: '', path: 'terms' },
  { prefix: 'tool/', path: 'password-generator' },
  { prefix: 'tool/', path: 'json-formatter' },
  { prefix: 'tool/', path: 'qr-code-generator' },
  { prefix: 'blog/', path: 'password-generator-security-myths-2026' },
  { prefix: 'blog/', path: 'beginner-5x5-linear' },
  { prefix: 'blog/', path: 'hrm-chest-vs-optical' },
  { prefix: 'news/', path: 'google-may-2026-core-update-recap' },
  { prefix: 'news/', path: 'typescript-5-8-release-2026' },
  { prefix: 'news/', path: 'react-19-server-components-update-2026' },
];

const routes = [];
for (const l of LOCALES) {
  for (const r of PER_LOCALE) {
    const p = r.path ? `/${l}/${r.prefix}${r.path}/` : `/${l}/`;
    routes.push(p);
  }
}

const TOTAL = routes.length;
console.log(`[probe-60] Total routes: ${TOTAL}  concurrency=2`);

const CONCURRENCY = 2;
let idx = 0;
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
      headers: { 'Accept': 'text/html,*/*', 'User-Agent': 'probe60/1.0' },
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

async function worker(wid) {
  while (true) {
    const myIdx = idx++;
    if (myIdx >= TOTAL) return;
    const r = routes[myIdx];
    await checkOne(`http://localhost:3100${r}`);
    process.stdout.write(`\r[${Math.min(idx, TOTAL)}/${TOTAL}] w${wid} ok=${ok} non2xx=${non200} fail=${fail}      `);
  }
}

(async () => {
  await Promise.all([worker(1), worker(2)]);
  const sec = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n\n=== Critical 60 HTTP Check (${sec}s, concurrency=2) ===`);
  console.log(`  OK(2xx/3xx) : ${ok}`);
  console.log(`  Non-2xx     : ${non200}`);
  console.log(`  Conn/Err    : ${fail}`);
  if (failures.length) {
    console.log('\n--- Failures ---');
    for (const [u, info] of failures) console.log(`  - ${u} :: ${info}`);
  }
  process.exit(non200 + fail > 0 ? 1 : 0);
})();
