#!/usr/bin/env node
/**
 * 冒烟脚本：自研工具 × 6 语言 × 落地页 全量 HTTP 200 自检
 *
 * 用法：
 *   node scripts/smoke-internal-tools.cjs                  # 默认 http://localhost:3000
 *   BASE_URL=https://your-site.com node scripts/smoke-internal-tools.cjs
 *   BASE_URL=http://localhost:8080 CONCURRENCY=10 TIMEOUT=8000 node scripts/smoke-internal-tools.cjs
 *
 * 检查维度：
 *   - 48 自研工具静态页:   /{locale}/tool/{slug}            (6 语言 = 288 个 URL)
 *   - 通用 detail 落地页:  /{locale}/tool/detail/?slug=xxx  (抽 3 语言 × 2 slug = 6 个 URL，确保客户端渲染 fallback 可用)
 *   - 核心首页:            /{locale}                        (6 个 URL)
 *   总计约 300 个 URL。
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '8', 10);
const TIMEOUT_MS = parseInt(process.env.TIMEOUT || '10000', 10);
const RETRY = parseInt(process.env.RETRY || '2', 10);

const LOCALES = ['zh', 'en', 'es', 'fr', 'hi', 'ar'];

// === 与 deploy.yml 保持一致的自研工具白名单（48 个）===
const INTERNAL_SLUGS = [
  'avatar-decorator',
  'audio-bpm-detector',
  'base64-tool',
  'caption-generator',
  'case-converter',
  'color-picker',
  'copy-cleaner',
  'countdown',
  'danmaku',
  'decision-wheel',
  'emoji-mixer',
  'fortune-sticks',
  'grid-cutter',
  'image-compressor',
  'image-to-base64',
  'json-formatter',
  'keyword-spinoff-generator',
  'markdown-platform-adapter',
  'markdown-platform-converter',
  'markdown-preview',
  'mortgage-calculator',
  'multi-timezone-publish-time',
  'password-generator',
  'pdf-merger',
  'pinyin-annotator',
  'polyphonic-pinyin-annotator',
  'qr-code-generator',
  'random-number',
  'regex-tester',
  'script-splitter',
  'sentiment-analyzer',
  'srt-subtitle-generator',
  'text-counter',
  'text-to-speech',
  'text-tools',
  'timestamp-converter',
  'title-weight-checker',
  'url-encode-decode',
  'uuid-generator',
  'vertical-chinese-generator',
  'wallpaper-maker',
  'wc-2026-schedule',
  'wc-ascii-art',
  'wc-champion-predictor',
  'wc-fan-avatar',
  'wc-name-decorator',
  'wc-poster-generator',
  'wc-scoreboard-simulator',
];

function buildUrls() {
  const urls = [];
  // 1) 自研工具静态落地页
  for (const locale of LOCALES) {
    for (const slug of INTERNAL_SLUGS) {
      urls.push(`${BASE_URL}/${locale}/tool/${slug}`);
    }
  }
  // 2) 首页
  for (const locale of LOCALES) {
    urls.push(`${BASE_URL}/${locale}`);
  }
  // 3) 通用 /tool/detail/?slug= 客户端渲染 fallback 落地页（抽取代表样本）
  const sampleForDetail = ['color-picker', 'wc-scoreboard-simulator'];
  for (const locale of ['zh', 'en', 'fr']) {
    for (const slug of sampleForDetail) {
      urls.push(`${BASE_URL}/${locale}/tool/detail/?slug=${slug}`);
    }
  }
  // 4) /tools 列表页
  for (const locale of LOCALES) {
    urls.push(`${BASE_URL}/${locale}/tools`);
  }
  return urls;
}

function httpGet(urlStr) {
  return new Promise((resolve) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        method: 'GET',
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        headers: {
          'User-Agent': 'smoke-internal-tools/1.0',
          'Accept': 'text/html,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        // 只看响应头即可，body 不消费也行，但读取少量用于判断空响应
        const chunks = [];
        let size = 0;
        res.on('data', (c) => {
          chunks.push(c);
          size += c.length;
          if (size > 2048) {
            res.destroy();
          }
        });
        res.on('end', () => resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400, bodyBytes: size }));
        res.on('close', () => resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400, bodyBytes: size }));
        res.on('error', (e) => resolve({ status: 0, ok: false, error: e.message, bodyBytes: size }));
      }
    );
    req.on('timeout', () => { req.destroy(new Error('ETIMEDOUT')); });
    req.on('error', (e) => resolve({ status: 0, ok: false, error: e.message, bodyBytes: 0 }));
    req.end();
  });
}

async function fetchWithRetry(url) {
  let lastRes = null;
  for (let i = 0; i <= RETRY; i++) {
    const res = await httpGet(url);
    lastRes = res;
    if (res.ok && res.bodyBytes > 0) return { ...res, tries: i + 1 };
    if (i < RETRY) await new Promise((r) => setTimeout(r, 250 * (i + 1)));
  }
  return { ...lastRes, tries: RETRY + 1 };
}

async function run() {
  const urls = buildUrls();
  const total = urls.length;
  console.log(`\n=== smoke-internal-tools ===`);
  console.log(`BASE_URL     : ${BASE_URL}`);
  console.log(`CONCURRENCY  : ${CONCURRENCY}   TIMEOUT: ${TIMEOUT_MS}ms   RETRY: ${RETRY}`);
  console.log(`INTERNAL_SLUGS: ${INTERNAL_SLUGS.length}   LOCALES: ${LOCALES.length}`);
  console.log(`TOTAL URLS   : ${total}\n`);

  const results = new Array(total);
  let idx = 0;
  let done = 0;
  const startTs = Date.now();

  function tick() {
    const elapsed = ((Date.now() - startTs) / 1000).toFixed(1);
    process.stdout.write(`  progress: ${done}/${total}  (${Math.round(done / total * 100)}%)  elapsed ${elapsed}s\r`);
  }

  async function worker() {
    while (idx < total) {
      const i = idx++;
      const url = urls[i];
      results[i] = await fetchWithRetry(url);
      done++;
      if (done % 20 === 0) tick();
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, total) }, () => worker());
  await Promise.all(workers);
  tick();
  process.stdout.write('\n\n');

  // === 汇总报告 ===
  const okList = [];
  const failList = [];
  for (let i = 0; i < total; i++) {
    const r = results[i];
    if (r.ok && r.bodyBytes > 0) okList.push({ url: urls[i], ...r });
    else failList.push({ url: urls[i], ...r });
  }

  const okRate = ((okList.length / total) * 100).toFixed(1);
  console.log(`-------------------------------------------------------------`);
  console.log(` RESULT: ${okList.length}/${total}  OK   (${okRate}%)   FAIL: ${failList.length}`);
  console.log(` TIME  : ${((Date.now() - startTs) / 1000).toFixed(1)}s`);
  console.log(`-------------------------------------------------------------`);

  if (failList.length === 0) {
    console.log(`\n✅ ALL PASS — 自研工具、首页、/tools、/tool/detail 全部 200/非空`);
    process.exit(0);
  }

  console.log(`\n❌ FAILURES (${failList.length}):`);
  for (const f of failList.slice(0, 50)) {
    const reason = f.status === 0
      ? `ERROR: ${f.error || 'unknown'}`
      : `HTTP ${f.status} (bytes=${f.bodyBytes})`;
    console.log(`   - [tries=${f.tries}] ${reason}   ${f.url}`);
  }
  if (failList.length > 50) console.log(`   ... 还有 ${failList.length - 50} 条失败未列出`);

  console.log(`\n❌ 自检未通过，退出码 1`);
  process.exit(1);
}

run().catch((e) => { console.error('FATAL:', e); process.exit(2); });
