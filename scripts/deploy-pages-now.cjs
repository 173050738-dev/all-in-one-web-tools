// Quick Pages deploy via Cloudflare REST API (bypasses wrangler Windows logdir ENOENT)
// Usage: node scripts/deploy-pages-now.cjs
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const PROJECT = 'korelyy-tools';
const BRANCH = 'main';
const COMMIT_MSG = 'deploy: remove compare + fix ads.txt (' + new Date().toISOString() + ')';

function log(label, s) { console.log(`[${label}]`, s); }

// ---------- 1) Load Cloudflare API token ----------
// Priority: CLOUDFLARE_API_TOKEN env > deploy_wrangler.bat hardcoded > wrangler default.toml
function loadToken() {
  const envTok = process.env.CLOUDFLARE_API_TOKEN;
  if (envTok && envTok.length > 20) { log('auth', `using CLOUDFLARE_API_TOKEN env (${envTok.length} chars, prefix=${envTok.slice(0,5)})`); return envTok; }

  // Fallback: extract from deploy_wrangler.bat (source of truth API token from user)
  const batFile = path.join(ROOT, 'deploy_wrangler.bat');
  if (fs.existsSync(batFile)) {
    const batRaw = fs.readFileSync(batFile, 'utf8');
    const bm = batRaw.match(/CLOUDFLARE_API_TOKEN\s*=\s*([A-Za-z0-9_\-]+)/i);
    if (bm && bm[1] && bm[1].length > 20) { log('auth', `extracted API token from deploy_wrangler.bat (${bm[1].length} chars, prefix=${bm[1].slice(0,5)})`); return bm[1]; }
  }

  // Final fallback: read from wrangler login session
  const candidates = [
    path.join(process.env.APPDATA || '', 'xdg.config', '.wrangler', 'config', 'default.toml'),
    path.join(process.env.USERPROFILE || '', '.wrangler', 'config', 'default.toml'),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const m = raw.match(/oauth_token\s*=\s*"([^"]+)"/);
    if (m && m[1]) { log('auth', `found oauth token in ${p} (${m[1].length} chars)`); return m[1]; }
    const a = raw.match(/api_token\s*=\s*"([^"]+)"/);
    if (a && a[1]) { log('auth', `found api token legacy in ${p} (${a[1].length} chars)`); return a[1]; }
  }
  throw new Error('NO TOKEN found. Set CLOUDFLARE_API_TOKEN env or populate deploy_wrangler.bat.');
}

// ---------- 2) HTTPS JSON helper ----------
function cf(method, urlPath, token, bodyJson) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: '/client/v4' + urlPath,
      method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'User-Agent': 'korelyy-deploy-script/1.0',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (parsed.success === false) {
            const err = (parsed.errors && parsed.errors[0]) || { code: res.statusCode, message: 'API error' };
            reject(new Error(`CF API ${method} ${urlPath} -> ${res.statusCode}: [${err.code}] ${err.message}`));
          } else {
            resolve({ status: res.statusCode, data: parsed.result, full: parsed });
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response from ${urlPath} (${res.statusCode}, ${Math.min(data.length,300)} chars): ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    if (bodyJson) req.write(JSON.stringify(bodyJson));
    req.end();
  });
}

// ---------- 3) Scan out/, compute sha256 hashes + sizes ----------
function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, out);
    else if (e.isFile()) {
      const rel = path.relative(base, full).split(path.sep).join('/');
      out.push({ rel, full });
    }
  }
  return out;
}
function sha256Buf(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }

// ---------- 4) Multipart upload (form-data) for deployment ----------
function cfUpload(accountId, token, manifestStr, files /* [{rel,hash,buf}] */) {
  return new Promise((resolve, reject) => {
    const boundary = '----KorePagesDeployBoundary' + crypto.randomBytes(8).toString('hex');
    const parts = [];
    // manifest
    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="manifest"\r\n` +
      `Content-Type: application/json\r\n\r\n`
    ));
    parts.push(Buffer.from(manifestStr, 'utf8'));
    parts.push(Buffer.from('\r\n'));
    // branch
    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="branch"\r\n\r\n${BRANCH}\r\n`
    ));
    // commit message
    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="commit_message"\r\n\r\n${COMMIT_MSG.replace(/\r?\n/g, ' ').slice(0, 200)}\r\n`
    ));
    // files
    for (const f of files) {
      const safeRel = f.rel.replace(/"/g, '\\"');
      parts.push(Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${f.hash}"; filename="${safeRel}"\r\n` +
        `Content-Transfer-Encoding: binary\r\n\r\n`
      ));
      parts.push(f.buf);
      parts.push(Buffer.from('\r\n'));
    }
    parts.push(Buffer.from(`--${boundary}--\r\n`));
    const body = Buffer.concat(parts);

    const opts = {
      hostname: 'api.cloudflare.com', port: 443,
      path: `/client/v4/accounts/${encodeURIComponent(accountId)}/pages/projects/${encodeURIComponent(PROJECT)}/deployments`,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'korelyy-deploy-script/1.0',
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (parsed.success === false) {
            const err = (parsed.errors && parsed.errors[0]) || { code: res.statusCode, message: 'Deploy failed' };
            reject(new Error(`Deploy HTTP ${res.statusCode}: [${err.code}] ${err.message}${parsed.errors && parsed.errors.length > 1 ? ' +' + (parsed.errors.length - 1) + ' more' : ''}`));
          } else {
            resolve({ status: res.statusCode, data: parsed.result, full: parsed });
          }
        } catch (e) {
          reject(new Error(`Deploy response parse error HTTP ${res.statusCode}: ${e.message}. head: ${data.slice(0,300)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ---------- MAIN ----------
(async function main() {
  const t0 = Date.now();
  if (!fs.existsSync(OUT_DIR)) throw new Error('out/ not found. Run build first.');
  const token = loadToken();

  // account
  const acc = await cf('GET', '/accounts?per_page=50', token);
  if (!acc.data || acc.data.length === 0) throw new Error('No Cloudflare accounts visible for this token.');
  const account = acc.data[0];
  log('account', `using account ${account.name} (${account.id})`);

  // scan files
  const list = walk(OUT_DIR);
  log('out', `scanned ${list.length} files under out/`);
  if (list.length < 100) throw new Error(`suspiciously few files (${list.length}) in out/, aborting`);

  // build manifest + read content + hash
  const manifest = {};
  const fileRecs = [];
  let totalBytes = 0;
  for (const f of list) {
    const buf = fs.readFileSync(f.full);
    const hash = sha256Buf(buf);
    manifest['/' + f.rel.replace(/\\/g, '/')] = { hash, size: buf.length };
    fileRecs.push({ rel: f.rel, hash, buf });
    totalBytes += buf.length;
  }
  // Root bare URLs like /ads.txt (no trailing slash) -> out/ads.txt stored. OK.

  const adsEntry = manifest['/ads.txt'];
  log('ads.txt', adsEntry ? `present hash=${adsEntry.hash.slice(0,12)}... size=${adsEntry.size}B` : 'MISSING /ads.txt !');
  if (!adsEntry) throw new Error('DEPLOY ABORTED: /ads.txt missing from out/ manifest');

  log('manifest', `${Object.keys(manifest).length} entries, total raw ${(totalBytes/1024/1024).toFixed(2)}MB`);

  // upload deployment
  log('deploy', `POST -> pages/projects/${PROJECT}/deployments`);
  const res = await cfUpload(account.id, token, JSON.stringify(manifest), fileRecs);
  const dep = res.data || {};
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  log('ok', `DEPLOY SUCCESS in ${elapsed}s`);
  console.log('');
  console.log('  deployment id :', dep.id || '-');
  console.log('  environment   :', dep.environment || '-');
  console.log('  url           :', dep.url || 'https://korelyy-tools.pages.dev');
  console.log('  custom domain : https://korelyy.com');
  console.log('  created       :', dep.created_on || new Date().toISOString());
  console.log('  preview (CF)  :', dep.url ? dep.url : '-');
  process.exit(0);
})().catch(err => {
  console.error('');
  console.error('DEPLOY FAILED:', err && err.message ? err.message : err);
  if (err && err.stack) console.error(err.stack);
  process.exit(1);
});
