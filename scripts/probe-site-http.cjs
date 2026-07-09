const http = require('http');
const LOCALES = ['en', 'zh', 'es', 'fr', 'ar', 'hi'];

const STATIC_PAGES = [
  '', 'tools', 'blog', 'news', 'workflows', 'ideas', 'templates',
  'about', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer',
  'compliance', 'api-keys', 'batch-image-processor',
  'workflow/share', 'workflow/detail', 'workflow/custom', 'workflow/canvas',
  'tool/detail',
];

const INTERNAL_TOOLS = [
  'password-generator', 'json-formatter', 'base64-tool', 'qr-code-generator',
  'markdown-platform-converter', 'srt-subtitle-generator', 'polyphonic-pinyin-annotator',
  'wc-2026-schedule', 'multi-timezone-publish-time', 'audio-bpm-detector',
  'image-compressor', 'pdf-merger', 'uuid-generator', 'regex-tester',
  'text-counter', 'timestamp-converter', 'case-converter', 'url-encode-decode',
  'color-picker', 'markdown-preview', 'copy-cleaner', 'pinyin-annotator',
  'random-number', 'script-splitter', 'sentiment-analyzer', 'text-to-speech',
  'caption-generator', 'avatar-decorator', 'countdown', 'danmaku',
  'decision-wheel', 'emoji-mixer', 'fortune-sticks', 'grid-cutter',
  'image-to-base64', 'keyword-spinoff-generator', 'markdown-platform-adapter',
  'mortgage-calculator', 'text-tools', 'title-weight-checker',
  'vertical-chinese-generator', 'wallpaper-maker',
  'wc-ascii-art', 'wc-champion-predictor', 'wc-fan-avatar',
  'wc-name-decorator', 'wc-poster-generator', 'wc-scoreboard-simulator',
];

const BLOG_SLUGS = [
  'what-is-regular-expression', 'regex-email-phone-url-patterns',
  'pdf-tools-ultimate-guide-2026', 'qr-code-generator-business-use-cases',
  'password-generator-security-myths-2026', 'json-formatter-complete-guide',
  'swimming-tutorial-1-2026', 'docker-tutorial-2-2026',
  'korelyyops-tutorial-3-2026', 'indiemonetize-tutorial-4-2026',
  'beginner-5x5-linear', 'hrm-chest-vs-optical',
];

const routes = [];
for (const l of LOCALES) {
  for (const p of STATIC_PAGES) {
    const path = p ? `/${l}/${p}/` : `/${l}/`;
    routes.push(path.replace(/\/+$/, '/'));
  }
  for (const t of INTERNAL_TOOLS) routes.push(`/${l}/tool/${t}/`);
  for (const b of BLOG_SLUGS) routes.push(`/${l}/blog/${b}/`);
}

const deduped = Array.from(new Set(routes));
console.log(`Total routes to check: ${deduped.length}`);

const CONCURRENCY = 3;
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
      timeout: 60000,
      headers: { 'Accept': 'text/html,*/*', 'User-Agent': 'probe/1.0' },
    }, (res) => {
      // ignore body; just drain socket
      res.resume();
      res.on('end', () => {
        const code = res.statusCode;
        if (code === 200 || code === 304) finish('ok');
        else finish('non200', 'HTTP ' + code);
      });
    });
    req.on('timeout', () => {
      req.destroy(new Error('timeout 60s'));
    });
    req.on('error', (e) => finish('fail', e.message || String(e)));
  });
}

async function worker() {
  while (true) {
    const myIdx = idx++;
    if (myIdx >= deduped.length) return;
    const r = deduped[myIdx];
    await checkOne(`http://localhost:3100${r}`);
    process.stdout.write(`\r[${Math.min(idx, deduped.length)}/${deduped.length}] ok=${ok} non200=${non200} fail=${fail}       `);
  }
}

(async function main() {
  const workers = [];
  for (let w = 0; w < CONCURRENCY; w++) workers.push(worker());
  await Promise.all(workers);

  const sec = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n\n=== HTTP Bulk Check Result (${sec}s) ===`);
  console.log(`  OK (2xx)    : ${ok}`);
  console.log(`  Non-2xx     : ${non200}`);
  console.log(`  Conn/Err    : ${fail}`);
  console.log(`  Total probed: ${ok + non200 + fail}`);
  if (failures.length) {
    console.log(`\n--- Failures (${failures.length}) ---`);
    // Group by error msg to reduce noise
    const byMsg = new Map();
    for (const [url, msg] of failures) {
      if (!byMsg.has(msg)) byMsg.set(msg, []);
      byMsg.get(msg).push(url);
    }
    for (const [msg, list] of byMsg) {
      console.log(`\n  [${msg}]  ×${list.length}`);
      for (const u of list.slice(0, 15)) console.log(`    - ${u}`);
      if (list.length > 15) console.log(`    ... and ${list.length - 15} more`);
    }
  } else {
    console.log(`\n✅ All ${ok} routes HTTP 200!`);
  }
  process.exit(failures.length ? 1 : 0);
})();
