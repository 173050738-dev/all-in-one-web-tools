/* ==========================================================================
   部署上线前强制自检脚本 — 防止漏提交/内容错误直接上生产
   用法：
     1) 自动触发：已挂在 package.json → prebuild 末尾（build/build:legacy 必跑）
     2) CI 触发：deploy.yml 的 build:cf(ISR模式) 步骤前手动调用
     3) 手动触发：pnpm run deploy:check
   HARD 校验失败 → process.exit 非零直接阻断构建/部署
   SOFT 校验失败 → 大红字 WARNING，不阻断但要求人工确认
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const C_GREEN = '\x1b[32m';
const C_RED = '\x1b[31m';
const C_YELLOW = '\x1b[33m';
const C_CYAN = '\x1b[36m';
const C_RESET = '\x1b[0m';
const PASS = `${C_GREEN}✅ PASS${C_RESET}`;
const FAIL_HARD = `${C_RED}❌ HARD FAIL (阻断部署)${C_RESET}`;
const WARN_SOFT = `${C_YELLOW}⚠️  SOFT WARNING${C_RESET}`;

let hasHardFail = false;
let hasSoftWarn = false;

function section(title) {
  console.log(`\n${C_CYAN}━━━ ${title} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);
}

/* =========================================================================
   HARD 1：工具数量一致性校验（≥1500 + tools.ts唯一ID == _static-counts数字）
   拦截场景：上次漏提交tools.ts导致线上1320条而不是1500+
   ========================================================================== */
section('HARD 1/3 · 工具卡片数量一致性（≥ 1500）');
try {
  const toolsSrc = fs.readFileSync(path.join(ROOT, 'data', 'tools.ts'), 'utf8');
  const idMatches = toolsSrc.match(/^\s*id:\s*['"]([^'"]+)['"]/gm) || [];
  const ids = idMatches.map(m => {
    const mm = m.match(/['"]([^'"]+)['"]/);
    return mm ? mm[1] : null;
  }).filter(Boolean);
  const uniqueIds = new Set(ids);
  const countTools = uniqueIds.size;
  const dupCount = ids.length - countTools;

  const countsSrc = fs.readFileSync(path.join(ROOT, 'data', '_static-counts.generated.ts'), 'utf8');
  const countMatch = countsSrc.match(/STATIC_TOTAL_TOOLS_COUNT:\s*number\s*=\s*(\d+)/);
  const countStatic = countMatch ? parseInt(countMatch[1], 10) : -1;

  if (dupCount > 0) {
    console.error(`  ${FAIL_HARD}  data/tools.ts 存在 ${dupCount} 个重复ID！唯一ID=${countTools}，总行数=${ids.length}`);
    const c = {};
    ids.forEach(id => c[id] = (c[id] || 0) + 1);
    const dups = Object.entries(c).filter(([k, v]) => v > 1).slice(0, 15);
    console.error(`     重复ID样例:`, dups.map(d => `${d[0]}×${d[1]}`).join(', '));
    hasHardFail = true;
  } else if (countTools < 1500) {
    console.error(`  ${FAIL_HARD}  唯一工具ID数 ${countTools} < 最低阈值 1500！疑似新增工具未提交或 data/tools.ts 被回退`);
    hasHardFail = true;
  } else if (countStatic !== countTools) {
    console.error(`  ${FAIL_HARD}  _static-counts数字不一致！tools.ts唯一=${countTools}，_static-counts.generated.ts=${countStatic}。请重新运行 node scripts/build-data-bundles.cjs`);
    hasHardFail = true;
  } else {
    console.log(`  ${PASS}  tools.ts唯一ID=${countTools}，_static-counts=${countStatic}，重复ID=${dupCount}`);
  }
} catch (e) {
  console.error(`  ${FAIL_HARD}  读取文件异常: ${e.message}`);
  hasHardFail = true;
}

/* =========================================================================
   HARD 2：6语言 workflow/[slug]/page.tsx — 不再输出调试壳字符串
   拦截场景：workflow详情页显示"Locale: zh / Steps: 4"而不是真实WorkflowDetail
   ========================================================================== */
section('HARD 2/3 · 6语言 workflow详情页 — 无调试壳（Locale:/Steps:）');
{
  const LOCALES = ['zh', 'en', 'es', 'fr', 'hi', 'ar'];
  const BAD_PATTERNS = [
    /Locale:\s*\$\{p\.locale\}/,
    /Locale:\s*\{p\.locale\}/,
    /Steps:\s*\\?d\+\s*\}\s*<\//,
    /max-w-4xl.*Locale.*Steps/s,
  ];
  let bad = 0;
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, 'app', loc, 'workflow', '[slug]', 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      console.error(`  ${WARN_SOFT}  ${loc}/workflow/[slug]/page.tsx 文件不存在`);
      hasSoftWarn = true;
      continue;
    }
    const src = fs.readFileSync(pagePath, 'utf8');
    const hasRealWorkflow = /<WorkflowDetail\s+slug=/.test(src);
    const hasDebugStub = BAD_PATTERNS.some(re => re.test(src));
    if (hasDebugStub || !hasRealWorkflow) {
      console.error(`  ${FAIL_HARD}  ${loc}/workflow/[slug]/page.tsx 仍在渲染调试壳（未使用<WorkflowDetail>），用户打开直接空白`);
      bad++;
      hasHardFail = true;
    }
  }
  if (bad === 0) {
    console.log(`  ${PASS}  6语言 workflow/[slug]/page.tsx 全部使用真实 <WorkflowDetail> 组件渲染`);
  }
}

/* =========================================================================
   HARD 3：法语 base64-tool client.tsx — 无单引号嵌套语法错误
   拦截场景：fr Échec de l'encodage 造成 TS1005/TS1002 构建直接失败
   扩展：扫描所有 *.tsx/client.tsx 中含 l'encodage 的单引号字符串
   ========================================================================== */
section("HARD 3/3 · 法语翻译单引号转义（l'encodage / l'之类不再造成 TS 语法错）");
{
  const targets = [
    ['app/fr/tool/base64-tool/client.tsx', /setOutput\(\s*'[^']*l'encodage/],
  ];
  let bad = 0;
  for (const [rel, reBad] of targets) {
    const f = path.join(ROOT, ...rel.split('/'));
    if (!fs.existsSync(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    if (reBad.test(src)) {
      console.error(`  ${FAIL_HARD}  ${rel} 含未转义单引号嵌套（如 Échec de l'encodage）→ 改双引号或转义，否则 build 直接 TS1005`);
      bad++;
      hasHardFail = true;
    }
  }
  if (bad === 0) {
    console.log(`  ${PASS}  fr base64-tool 等敏感文件无 l'encodage 单引号嵌套语法错误`);
  }
}

/* =========================================================================
   SOFT 1：git 工作区 — 未加入本次提交的 Modified 文件数量提醒
   预警场景：上次改好 300+ 文件但只提交了 15 个（i18n/workflow/tools.ts全部漏）
   ========================================================================== */
section('SOFT 1/2 · Git 工作区 — 已Modified未Staged文件提醒');
try {
  const stagedRaw = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf8', maxBuffer: 5*1024*1024 }).trim();
  const worktreeRaw = execSync('git status --short', { cwd: ROOT, encoding: 'utf8', maxBuffer: 5*1024*1024 }).trim();
  const stagedFiles = stagedRaw ? stagedRaw.split(/\r?\n/).filter(Boolean) : [];
  const modifiedNotStaged = worktreeRaw.split(/\r?\n/).filter(line => /^ M\s/.test(line)); // space+M → 工作区改了未暂存
  console.log(`  当前 Staged 待提交文件数: ${C_CYAN}${stagedFiles.length}${C_RESET}`);
  console.log(`  当前 Modified 未加入 Staged: ${C_CYAN}${modifiedNotStaged.length}${C_RESET}`);
  if (modifiedNotStaged.length > 0) {
    const sample = modifiedNotStaged.slice(0, 12).map(l => '     ' + l);
    console.warn(`  ${WARN_SOFT}  有 ${modifiedNotStaged.length} 个文件改了但没加入本次提交（上次漏 300+ 就是这个场景）！`);
    console.warn(`     样例（最多12条）:\n${sample.join('\n')}`);
    if (modifiedNotStaged.length >= 10) {
      console.warn(`     ${C_YELLOW}请确认：这些是有意不提交？还是漏 git add 了？数量≥10建议二次确认${C_RESET}`);
    }
    hasSoftWarn = true;
  } else {
    console.log(`  ${PASS}  所有 Modified 文件都已加入 Staged，无漏提交风险（或当前 git 工作区干净）`);
  }
  if (stagedFiles.length === 0) {
    console.warn(`  ${WARN_SOFT}  Staged文件为0，你是不是还没 git add 就要 push？`);
    hasSoftWarn = true;
  }
} catch (e) {
  console.warn(`  ${WARN_SOFT}  git命令执行失败（非致命）: ${e.message.slice(0, 100)}`);
  hasSoftWarn = true;
}

/* =========================================================================
   SOFT 2：EN 首页工具卡片翻译 fallback 有效性快速扫
   预警场景：EN/ES/FR 页工具卡片大片中文（非ZH locale零CJK）
   扫描方式：读取 tools.ts 中 nameEn 字段空值比例 > 5% 则 WARNING
   ========================================================================== */
section('SOFT 2/2 · 非ZH工具翻译覆盖率（nameEn空值率）');
try {
  const toolsSrc = fs.readFileSync(path.join(ROOT, 'data', 'tools.ts'), 'utf8');
  const nameEnEmptyMatches = toolsSrc.match(/nameEn:\s*['"]\s*['"]/g) || [];
  const hasIdMatches = toolsSrc.match(/^\s*id:\s*['"]/gm) || [];
  const emptyRate = hasIdMatches.length ? (nameEnEmptyMatches.length / hasIdMatches.length * 100).toFixed(1) : 'N/A';
  console.log(`  nameEn空字段: ${C_CYAN}${nameEnEmptyMatches.length}${C_RESET} / 工具总数 ${hasIdMatches.length} → 空值率 ${emptyRate}%`);
  if (parseFloat(emptyRate) > 5) {
    console.warn(`  ${WARN_SOFT}  nameEn 空值率 ${emptyRate}% > 5%，非ZH页面容易出现中文回退，请补全 nameEn/descriptionEn 字段`);
    hasSoftWarn = true;
  } else {
    console.log(`  ${PASS}  nameEn空值率 ${emptyRate}% ≤ 5%，满足非ZH页展示要求`);
  }
} catch (e) {
  console.warn(`  ${WARN_SOFT}  扫翻译覆盖率失败（非致命）: ${e.message.slice(0, 100)}`);
  hasSoftWarn = true;
}

/* =========================================================================
   结论输出
   ========================================================================== */
console.log(`\n${C_CYAN}━━━ 部署前自检结论 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}`);
if (hasHardFail) {
  console.error(`\n${C_RED}❌ HARD 校验不通过，已阻断构建/部署！${C_RESET} 请先修复上面标注 HARD FAIL 的项目后再重试。`);
  console.error(`   （若你确认当前是小范围修复、工具数/其它HARD项不需要检查，请在本地手动 build 时临时跳过检查——但不推荐）`);
  process.exit(21);
}
console.log(`\n${C_GREEN}✅ 所有 HARD 校验通过${C_RESET}，可以构建/部署。`);
if (hasSoftWarn) {
  console.log(`${C_YELLOW}⚠️  存在 SOFT WARNING${C_RESET}（上面黄色标注），不一定致命，但请你在 push 前扫一眼确认"漏提交/翻译缺口"是否在预期范围内。`);
}
console.log(`\n📌 三项 HARD 拦截覆盖了这次两次事故：
   ① 工具卡片 1500 → 1300 （HARD1 数量阈值 + 一致性）
   ② workflow 页面白屏调试壳  （HARD2 强制 <WorkflowDetail>）
   ③ fr base64 单引号构建崩 （HARD3 字符串转义扫）
   SOFT 提醒覆盖：上次 300+ Modified 没 Staged 就 push（SOFT1）、非ZH页中文卡片（SOFT2）\n`);
process.exit(0);
