/* ==========================================================================
   部署后 HTTP 内容正确性验收脚本（只验内容，不止HTTP 200）
   用法：
     1) 验证自定义域：    node scripts/post-deploy-content-verify.cjs --site=https://korelyy.com
     2) 验证 Pages 临时域：node scripts/post-deploy-content-verify.cjs --site=https://xxx.pages.dev
     3) 本地开发环境：     node scripts/post-deploy-content-verify.cjs --site=http://localhost:3000
   检查项：
     HARD1  workflow详情页 — 不存在 Locale/Steps 调试壳字符串
     HARD2  EN首页工具卡片 — 连续CJK中文 < 3处（工具卡片零中文回退）
     HARD3  首页工具总数显示 — 数字在 [1500, 1700] 区间（防1300级别旧数据上线）
     SOFT   6个关键工具详情页 — 返回200且体积正常（>10KB，非空壳）
   ========================================================================== */
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ARGS = process.argv.slice(2).reduce((acc, arg) => {
  const [k, v] = arg.split('=');
  acc[k.replace(/^--/, '')] = v || true;
  return acc;
}, {});

const SITE = ARGS.site || process.env.VERIFY_SITE || 'https://korelyy.com';
const C_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 KorelyyPostDeployCheck/1.0';
const C_RED = '\x1b[31m'; const C_GREEN = '\x1b[32m'; const C_YELLOW = '\x1b[33m'; const C_CYAN = '\x1b[36m'; const C_RESET = '\x1b[0m';
const PASS = `${C_GREEN}✅ PASS${C_RESET}`; const FAIL_HARD = `${C_RED}❌ HARD FAIL${C_RESET}`; const WARN_SOFT = `${C_YELLOW}⚠️  SOFT${C_RESET}`;
let hardFail = 0; let softFail = 0;

function section(t) { console.log(`\n${C_CYAN}━━━ ${t} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPath(p, { retry = 4, expectStatus = [200], delayBetween = 2 } = {}) {
  const full = new URL(p, SITE).toString();
  const mod = full.startsWith('https://') ? https : http;
  for (let i = 1; i <= retry; i++) {
    try {
      const { statusCode, headers, body } = await new Promise((resolve, reject) => {
        const u = new URL(full);
        const req = mod.request({
          hostname: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80),
          path: u.pathname + u.search, method: 'GET',
          headers: {
            'User-Agent': C_UA,
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 20000,
        }, (res) => {
          const chunks = [];
          res.on('data', c => chunks.push(c));
          res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
        });
        req.on('timeout', () => { req.destroy(new Error('ETIMEDOUT')); });
        req.on('error', reject);
        req.end();
      });
      if (expectStatus.includes(statusCode)) return { ok: true, status: statusCode, body, url: full };
      if (i < retry) {
        console.log(`  retry=${i}  status=${statusCode}  ${full}`);
        await sleep(delayBetween * 1000);
        continue;
      }
      return { ok: false, status: statusCode, body, url: full };
    } catch (e) {
      if (i < retry) { console.log(`  retry=${i}  err=${e.message}  ${full}`); await sleep(delayBetween * 1000); continue; }
      return { ok: false, status: 'ERR_' + (e.code || 'UNKNOWN'), body: '', url: full, error: e.message };
    }
  }
}

// 简单HTML去标签后算CJK：<script>/<style> 块移除 → 去HTML标签 → 统计连续CJK
function stripHtml(s) {
  return (s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
}
function countCJK3Plus(text) {
  const cjkRe = /[\u4e00-\u9fa5\u3400-\u4dbf]{3,}/g;
  const matches = text.match(cjkRe) || [];
  return { count: matches.length, samples: matches.slice(0, 12) };
}

(async function main() {
  console.log(`${C_CYAN}
┌─────────────────────────────────────────────────────────────────────────┐
│ 📦 Korelyy 部署后内容正确性验收（不是只验 HTTP 200）                       │
│ 目标站点: ${SITE}${' '.repeat(Math.max(0, 60 - SITE.length - 5))}│
└─────────────────────────────────────────────────────────────────────────┘${C_RESET}`);

  // ------------------------------------------------------------------ HARD1
  section('HARD 1/3 · workflow详情页无调试壳（Locale/Steps 字符串）');
  {
    const res = await fetchPath('/zh/workflow/image-process/');
    if (!res.ok) {
      console.error(`  ${FAIL_HARD}  /zh/workflow/image-process/ → status=${res.status}  ${res.error ? res.error : ''}`);
      hardFail++;
    } else {
      const b = res.body;
      const debugSignatures = [
        /Locale:\s*\$\{p\.locale\}/,
        /Locale:\s*['"][a-z]{2}['"]\s*<\//,
        /Steps:\s*\d+\s*<\//,
        /Locale:\s*zh\s/,
      ];
      const found = debugSignatures.filter(re => re.test(b));
      if (found.length > 0) {
        console.error(`  ${FAIL_HARD}  workflow页仍包含调试壳标记！命中: ${found.map(r => String(r).slice(0,40)).join(', ')}。说明渲染回退到了调试代码。`);
        hardFail++;
      } else {
        // 再正向检查：是否有 WorkflowDetail 渲染产物（步骤卡片的痕迹）
        const hasWorkflowDetailMark = /步骤|Steps.*card|workflow-step|Step\s*1/i.test(stripHtml(b));
        if (hasWorkflowDetailMark) console.log(`  ${PASS}  workflow页无调试壳+有步骤卡片标记（size=${b.length} bytes）`);
        else console.log(`  ${WARN_SOFT}  workflow页没找到调试壳，但也未见步骤卡片标记（size=${b.length}，若线上内容不同请人工确认）`);
      }
    }
  }

  // ------------------------------------------------------------------ HARD2
  section('HARD 2/3 · EN 首页工具卡片 — 连续CJK中文回退数');
  {
    const res = await fetchPath('/en/');
    if (!res.ok) {
      console.error(`  ${FAIL_HARD}  /en/ → status=${res.status}`);
      hardFail++;
    } else {
      const clean = stripHtml(res.body);
      const { count, samples } = countCJK3Plus(clean);
      if (count > 3) {
        console.error(`  ${FAIL_HARD}  /en/ 去除标签后有 ${count} 处连续≥3个中文字符（工具卡片中文回退），样例: ${samples.join(' | ')}`);
        hardFail++;
      } else if (count >= 1) {
        console.log(`  ${WARN_SOFT}  /en/ 有 ${count} 处中文（可能是导航/banner的正常双语，数量≤3视为软提醒），样例: ${samples.join(' | ')}`);
        softFail++;
      } else {
        console.log(`  ${PASS}  /en/ 无连续中文字符（EN工具卡片全部英文展示，size=${res.body.length} bytes）`);
      }
    }
  }

  // ------------------------------------------------------------------ HARD3
  section('HARD 3/3 · 首页显示工具总数 ≈ 1500 级（非1300旧版）');
  {
    const res = await fetchPath('/zh/');
    if (!res.ok) {
      console.error(`  ${FAIL_HARD}  /zh/ → status=${res.status}`);
      hardFail++;
    } else {
      const b = res.body;
      // 找所有数字串，看有没有在 [1500,1700] 区间的（工具总数显示）
      const numbers = (b.match(/\b\d{4}\b/g) || []).map(Number);
      const hits = numbers.filter(n => n >= 1500 && n <= 1700);
      if (hits.length === 0) {
        // 二次兜底：没有4位数，检查有没有 ≤1400 的疑似旧版本数字
        const tooSmall = numbers.filter(n => n > 1000 && n <= 1400);
        if (tooSmall.length > 0) {
          console.error(`  ${FAIL_HARD}  首页没找到 1500~1700 工具总数，但找到了 ${tooSmall.join(', ')}（疑似 1300 旧版本上线，data/tools.ts没提交）`);
          hardFail++;
        } else {
          console.log(`  ${WARN_SOFT}  首页未提取到 1500~1700 区间数字（size=${b.length}，可能总数展示位未渲染），请人工确认卡片数量`);
          softFail++;
        }
      } else {
        console.log(`  ${PASS}  首页包含工具总数级别的数字: ${[...new Set(hits)].join(', ')}（1500+量级，符合预期）`);
      }
    }
  }

  // ------------------------------------------------------------------ SOFT
  section('SOFT · 6关键工具详情页抽样（200 + 体积＞10KB，非空壳）');
  {
    const samples = [
      '/zh/tool/qr-code-generator/',
      '/en/tool/base64-tool/',
      '/fr/tool/password-generator/',
      '/ar/tool/image-compressor/',
      '/hi/tool/grid-cutter/',
      '/es/tool/regex-tester/',
    ];
    let failed = 0;
    for (const p of samples) {
      const r = await fetchPath(p, { retry: 3 });
      const size = r.body.length;
      const statusOk = [200, 304].includes(r.status);
      const sizeOk = size > 10000;
      if (statusOk && sizeOk) console.log(`  ${PASS}  ${p}  status=${r.status}  size=${size} bytes`);
      else { console.log(`  ${WARN_SOFT}  ${p}  status=${r.status}  size=${size} bytes（${!statusOk?'非200; ':''}${!sizeOk?'体积偏小（空壳？）':''}`); failed++; }
    }
    if (failed > 0) softFail += failed;
  }

  // ------------------------------------------------------------------ 汇总
  console.log(`\n${C_CYAN}━━━ 部署验收结论 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);
  console.log(`  目标站点: ${SITE}`);
  console.log(`  HARD FAIL: ${hardFail} / 3     SOFT: ${softFail}`);
  if (hardFail > 0) {
    console.error(`\n${C_RED}❌ 部署验收不通过！${C_RESET} 有 ${hardFail} 项强校验失败，请回到修复清单处理后再重新验收。`);
    console.error(`   常见根因：① build 产物中 data/tools.ts 仍为旧 1320 条  ② workflow 页调试壳未替换  ③ EN 首页仍含大规模中文工具卡片`);
    process.exit(41);
  }
  console.log(`\n${C_GREEN}✅ 部署验收通过！${C_RESET} 三项 HARD 强校验全部达标，你可以在无痕窗口最终人工抽查（zh/workflow/image-process、EN首页无中文卡片、卡片数≈1500）。`);
  if (softFail > 0) console.log(`${C_YELLOW}⚠️  有 ${softFail} 项 SOFT 提醒（不阻断），请根据上方打印的样例判断是否为预期内差异。${C_RESET}`);
  process.exit(0);
})().catch(e => {
  console.error(`验收脚本崩溃: ${e.stack || e.message}`);
  process.exit(99);
});
