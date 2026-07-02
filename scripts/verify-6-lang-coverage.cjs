#!/usr/bin/env node
// ============================================================================
// scripts/verify-6-lang-coverage.cjs
//
// 新增工具卡片前的 6 语言翻译完整性校验。
//   - 遍历 data/tools.ts 所有工具 id
//   - 对 zh/en/fr/es/hi/ar 6 种语言，检查 public/locales/<locale>/translation.json
//     中的 .tools[id].name 和 .tools[id].description 是否存在
//   - 有缺失时打印缺失清单并 process.exit(1)（可挂 CI）
//   - 全通过时打印覆盖率并 process.exit(0)
//
// 用法：
//   node scripts/verify-6-lang-coverage.cjs          # 校验全部
//   node scripts/verify-6-lang-coverage.cjs --json    # 同时输出 JSON 报告
// ============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS_TS = path.join(ROOT, 'data', 'tools.ts');
const LOCALES_DIR = path.join(ROOT, 'public', 'locales');
const KNOWN_LOCALES = ['zh', 'en', 'fr', 'es', 'hi', 'ar'];
const SLOTS = ['name', 'description'];

function extractToolIds(toolsTsContent) {
  const ids = [];
  const re = /\bid:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(toolsTsContent)) !== null) {
    if (m[1] && !ids.includes(m[1])) ids.push(m[1]);
  }
  return ids;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const jsonReport = args.has('--json');

  if (!fs.existsSync(TOOLS_TS)) {
    console.error('ERROR: data/tools.ts not found at', TOOLS_TS);
    process.exit(2);
  }
  for (const locale of KNOWN_LOCALES) {
    const p = path.join(LOCALES_DIR, locale, 'translation.json');
    if (!fs.existsSync(p)) {
      console.error(`ERROR: translation.json missing for locale [${locale}] at ${p}`);
      process.exit(2);
    }
  }

  const toolIds = extractToolIds(fs.readFileSync(TOOLS_TS, 'utf8'));
  console.log(`\n[verify-6-lang] 发现工具总数: ${toolIds.length}`);
  console.log(`[verify-6-lang] 目标语言: ${KNOWN_LOCALES.join(', ')}  (${SLOTS.length} 个槽位: ${SLOTS.join(', ')})`);
  console.log(`[verify-6-lang] 预期总槽位: ${toolIds.length} × ${KNOWN_LOCALES.length} × ${SLOTS.length} = ${toolIds.length * KNOWN_LOCALES.length * SLOTS.length}\n`);

  const localeData = {};
  for (const locale of KNOWN_LOCALES) {
    try {
      localeData[locale] = JSON.parse(
        fs.readFileSync(path.join(LOCALES_DIR, locale, 'translation.json'), 'utf8'),
      );
      if (!localeData[locale].tools || typeof localeData[locale].tools !== 'object') {
        console.error(`ERROR: locale [${locale}] missing .tools namespace`);
        process.exit(2);
      }
    } catch (err) {
      console.error(`ERROR: failed to parse ${locale}/translation.json:`, err.message);
      process.exit(2);
    }
  }

  const missing = [];
  let filledSlots = 0;
  const totalSlots = toolIds.length * KNOWN_LOCALES.length * SLOTS.length;
  const perLocaleMissing = Object.fromEntries(KNOWN_LOCALES.map(l => [l, 0]));

  for (const id of toolIds) {
    for (const locale of KNOWN_LOCALES) {
      const toolNode = localeData[locale].tools[id];
      for (const slot of SLOTS) {
        const ok =
          toolNode &&
          typeof toolNode === 'object' &&
          typeof toolNode[slot] === 'string' &&
          toolNode[slot].trim().length > 0;
        if (ok) {
          filledSlots += 1;
        } else {
          missing.push({ toolId: id, locale, slot });
          perLocaleMissing[locale] += 1;
        }
      }
    }
  }

  const coverage = totalSlots === 0 ? 100 : (filledSlots / totalSlots) * 100;
  const pass = missing.length === 0;

  if (pass) {
    console.log('✅  PASS — 6 语言 2 槽位 100% 覆盖！');
  } else {
    console.log(`❌  FAIL — 缺失 ${missing.length} / ${totalSlots} 个翻译槽位\n`);
    console.log('=== 缺失清单 ===');
    const byTool = {};
    for (const m of missing) {
      (byTool[m.toolId] = byTool[m.toolId] || []).push(`${m.locale}.${m.slot}`);
    }
    for (const toolId of Object.keys(byTool).sort()) {
      console.log(`  · ${toolId}:  [${byTool[toolId].join(', ')}]`);
    }
    console.log('\n=== 各语言缺失数 ===');
    for (const locale of KNOWN_LOCALES) {
      const percentLocale =
        toolIds.length * SLOTS.length === 0
          ? 100
          : ((toolIds.length * SLOTS.length - perLocaleMissing[locale]) / (toolIds.length * SLOTS.length)) * 100;
      console.log(
        `  · ${locale.padEnd(4)} : missing ${String(perLocaleMissing[locale]).padStart(4)}  slots  (覆盖率 ${percentLocale.toFixed(2)}%)`,
      );
    }
  }

  console.log(
    `\n[verify-6-lang] 汇总: 已填充 ${filledSlots} / ${totalSlots}   覆盖率 ${coverage.toFixed(2)}%`,
  );

  if (jsonReport) {
    const report = {
      at: new Date().toISOString(),
      toolIds,
      totalTools: toolIds.length,
      locales: KNOWN_LOCALES,
      slots: SLOTS,
      totalSlots,
      filledSlots,
      coveragePct: Number(coverage.toFixed(2)),
      missing,
      perLocaleMissing,
      pass,
    };
    const out = path.join(ROOT, '.verify-6-lang-report.json');
    fs.writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(`[verify-6-lang] JSON 报告: ${out}`);
  }

  process.exit(pass ? 0 : 1);
}

main();
