const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TARGET_VAR_RE = /BULK_UPLOAD_CONCURRENCY2\s*=\s*(\d+)/g;
const TARGET_LINE_RE = /(\s+)(BULK_UPLOAD_CONCURRENCY2)\s*=\s*\d+\s*;/;
const TARGET_NEW_VAL = 1;

function print(msg) {
  const ts = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  console.log(`[${ts}] ${msg}`);
}

function findWranglerCliJs() {
  const candidates = [];
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    candidates.push(path.join(globalRoot, 'wrangler', 'wrangler-dist', 'cli.js'));
  } catch (_) {}
  try {
    const npmBinGlobal = execSync('npm bin -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    candidates.push(path.resolve(npmBinGlobal, '..', 'lib', 'node_modules', 'wrangler', 'wrangler-dist', 'cli.js'));
  } catch (_) {}
  candidates.push(path.join(process.cwd(), 'node_modules', 'wrangler', 'wrangler-dist', 'cli.js'));
  const PNPM_HOME = process.env.PNPM_HOME || process.env.APPDATA ? path.join(process.env.APPDATA, 'npm-global', 'node_modules', 'wrangler', 'wrangler-dist', 'cli.js') : null;
  if (PNPM_HOME) candidates.push(PNPM_HOME);
  candidates.push('D:\\npm-global\\node_modules\\wrangler\\wrangler-dist\\cli.js');
  candidates.push(path.join(require('os').homedir(), '.local', 'share', 'pnpm', 'global', '5', 'node_modules', 'wrangler', 'wrangler-dist', 'cli.js'));
  const seen = new Set();
  for (const c of candidates) {
    if (!c || seen.has(c)) continue;
    seen.add(c);
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function patchFile(cliJsPath, targetVal = TARGET_NEW_VAL) {
  const original = fs.readFileSync(cliJsPath, 'utf8');
  const matches = [...original.matchAll(TARGET_VAR_RE)];
  if (matches.length === 0) {
    print(`❌ 没在文件里找到 BULK_UPLOAD_CONCURRENCY2 变量，请确认 wrangler 版本是否变更 minify 名称`);
    return false;
  }
  let changed = false;
  for (const m of matches) {
    const oldVal = parseInt(m[1], 10);
    if (oldVal === targetVal) {
      print(`  ✅ BULK_UPLOAD_CONCURRENCY2 已经是 ${targetVal}，无需修复`);
      return true;
    }
  }
  const patched = original.replace(TARGET_LINE_RE, (match, indent, varName) => {
    const oldMatch = match.match(TARGET_VAR_RE);
    const oldVal = oldMatch ? parseInt(oldMatch[0].split('=')[1].trim(), 10) : '?';
    const newLine = `${indent}${varName} = ${targetVal};`;
    print(`  ✏️  Patching: "${match.trim()}" (原值 ${oldVal})  →  "${newLine.trim()}" (新值 ${targetVal})`);
    changed = true;
    return newLine;
  });
  if (!changed) {
    print(`❌ 没有需要替换的内容（正则匹配失败）`);
    return false;
  }
  fs.writeFileSync(cliJsPath, patched, 'utf8');
  const verify = fs.readFileSync(cliJsPath, 'utf8');
  const verifyMatch = verify.match(TARGET_VAR_RE);
  if (verifyMatch && verifyMatch[0].includes(`= ${targetVal}`)) {
    print(`✅ Patch 应用成功！wrangler 上传并发已永久强制改为 ${targetVal}`);
    return true;
  }
  print(`❌ Patch 应用后验证失败，请检查文件权限`);
  return false;
}

function main() {
  print('=== Wrangler Pages 上传并发 Patch Tool (BULK_UPLOAD_CONCURRENCY2) ===');
  const cliJsPath = findWranglerCliJs();
  if (!cliJsPath) {
    print('❌ 找不到 wrangler 的 cli.js 路径。请尝试：pnpm add -D wrangler 或 npm i -g wrangler');
    process.exit(1);
  }
  const stats = fs.statSync(cliJsPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  print(`📁 找到 wrangler: ${cliJsPath} (${sizeMB} MB, 修改时间: ${stats.mtime.toLocaleString('zh-CN')})`);
  const ok = patchFile(cliJsPath, TARGET_NEW_VAL);
  process.exit(ok ? 0 : 1);
}

main();
