// Push all URLs in public/sitemap.xml to Bing / Yandex / IndexNow participating engines.
// Runs AFTER `next build` (because it reads sitemap.xml produced by scripts/build-sitemap-robots.mjs)
//
// Dry run (默认):   node scripts/indexnow-push.mjs
// Apply (真实推送):  node scripts/indexnow-push.mjs --apply
//
// Env vars:
//   INDEXNOW_KEY  — override key (default: read scripts/.indexnow-key cache or generate new 32-hex)

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const APPLY = process.argv.includes('--apply') || process.argv.includes('-a');
const SITEMAP_PATH = path.join(ROOT, 'public', 'sitemap.xml');
const KEY_CACHE = path.join(ROOT, 'scripts', '.indexnow-key');
const PUBLIC_DIR = path.join(ROOT, 'public');

const ENDPOINTS = [
  { name: 'Bing',       url: 'https://www.bing.com/indexnow' },
  { name: 'Yandex',     url: 'https://yandex.com/indexnow' },
  { name: 'IndexNow',   url: 'https://api.indexnow.org/indexnow' },
  { name: 'Yep',        url: 'https://api.yep.com/indexnow' },
];

function ensureKey() {
  let key = process.env.INDEXNOW_KEY || '';
  if (!key && fs.existsSync(KEY_CACHE)) {
    key = (fs.readFileSync(KEY_CACHE, 'utf8') || '').trim();
  }
  if (!key || !/^[A-Za-z0-9_-]{8,128}$/.test(key)) {
    console.log('[indexnow] generating new key (32-hex)');
    key = crypto.randomBytes(16).toString('hex');
    fs.mkdirSync(path.dirname(KEY_CACHE), { recursive: true });
    fs.writeFileSync(KEY_CACHE, key + '\n', 'utf8');
  }
  const keyFile = path.join(PUBLIC_DIR, `${key}.txt`);
  const existed = fs.existsSync(keyFile);
  if (!existed || (fs.readFileSync(keyFile, 'utf8') || '').trim() !== key) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(keyFile, key, 'utf8');
    console.log(`[indexnow] key file ${existed ? 'updated' : 'created'}: public/${key}.txt`);
  } else {
    console.log(`[indexnow] key file exists: public/${key}.txt`);
  }
  return key;
}

function extractUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`Sitemap not found at ${SITEMAP_PATH}. Run build-sitemap-robots first.`);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const re = /<loc>\s*([^\s<][^<]*?)\s*<\/loc>/gi;
  const set = new Set();
  let m;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1].trim();
    if (u) set.add(u);
  }
  const arr = [...set];
  console.log(`[indexnow] extracted ${arr.length} unique <loc> URLs from sitemap.xml`);
  return arr;
}

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function pushOne(endpoint, key, urls) {
  const u = new URL(endpoint.url);
  u.searchParams.set('key', key);
  const body = JSON.stringify({ host: 'korelyy.com', key, keyLocation: `https://korelyy.com/${key}.txt`, urlList: urls });
  if (!APPLY) return { name: endpoint.name, status: 'DRY', urls: urls.length };
  try {
    const res = await fetch(u.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Korelyy-IndexNow/1.0 (+https://korelyy.com)',
      },
      body,
    });
    return { name: endpoint.name, status: res.status, urls: urls.length, key };
  } catch (e) {
    return { name: endpoint.name, status: 'ERROR: ' + (e && e.message ? e.message : String(e)), urls: urls.length, key };
  }
}

(async function main() {
  const key = ensureKey();
  const allUrls = extractUrls();
  if (allUrls.length === 0) {
    console.warn('[indexnow] no URLs found in sitemap. Skip.');
    process.exit(0);
  }
  const batches = chunks(allUrls, 10000);
  console.log(`[indexnow] ${batches.length} batch(es) × ≤10000 URLs`);
  console.log(`[indexnow] APPLY mode = ${APPLY ? 'ON (real submission)' : 'OFF (dry run, re-run with --apply to push)'}`);
  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    console.log(`\n--- Batch ${bi + 1}/${batches.length} (${batch.length} URLs) ---`);
    const results = await Promise.all(ENDPOINTS.map((e) => pushOne(e, key, batch)));
    for (const r of results) {
      console.log(`  ${r.name.padEnd(10)} -> ${String(r.status).padEnd(16)} (${r.urls} urls)`);
    }
    // ---- Hint for 403: Bing/IndexNow require https://korelyy.com/<key>.txt accessible online ----
    const got403 = results.some((r) => r.status === 403);
    if (got403 && APPLY) {
      console.log('');
      console.log('  ⚠️  收到 403 (通常是 Bing 无法回源验证 key.txt)：');
      console.log(`     1) 请先部署包含 public/${key}.txt 的最新产物到线上`);
      console.log(`     2) 浏览器打开 https://korelyy.com/${key}.txt 确认能 200，且内容 = ${key}`);
      console.log(`     3) 部署完成后重新运行:  node scripts/indexnow-push.mjs --apply`);
    }
  }
  console.log('\n[indexnow] done.');
  if (!APPLY) {
    console.log('[indexnow] tip: 要推送给 Bing/Yandex，请用:');
    console.log('          node scripts/indexnow-push.mjs --apply');
  }
})().catch((e) => {
  console.error('[indexnow] fatal:', e && e.stack ? e.stack : e);
  process.exit(1);
});
