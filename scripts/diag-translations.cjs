/* 诊断 6 语言 translation.json 对齐 & 英文占位统计
 * 输出: {missingKeys, extraKeys, placeholderCount, translatedCount}
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public', 'locales');
const LOCALES = ['en', 'zh', 'es', 'fr', 'ar', 'hi'];
const TARGETS = ['es', 'fr', 'ar', 'hi'];

function loadJson(p) {
  const raw = fs.readFileSync(p, 'utf8');
  // strip BOM
  const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
  try { return JSON.parse(clean); } catch (e) {
    console.error('JSON parse error in', p, ':', e.message);
    process.exit(1);
  }
}

// flatten nested object to "a.b.c" => value
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out.set(key, v);
    }
  }
  return out;
}

const flat = {};
for (const loc of LOCALES) {
  const file = path.join(ROOT, loc, 'translation.json');
  if (!fs.existsSync(file)) { console.error('Missing:', file); process.exit(1); }
  flat[loc] = loadJson(file);
}

const enFlat = flatten(flat.en);
const zhFlat = flatten(flat.zh);
const enKeys = new Set(enFlat.keys());

console.log('\n=== 1. Key 数量 & 与 en 对齐 ===');
console.log(`en keys (baseline): ${enKeys.size}`);
for (const loc of LOCALES.filter(l => l !== 'en')) {
  const f = flatten(flat[loc]);
  const keys = new Set(f.keys());
  const missing = [...enKeys].filter(k => !keys.has(k));
  const extra = [...keys].filter(k => !enKeys.has(k));
  console.log(`${loc.padEnd(4)} keys=${String(keys.size).padEnd(6)} missing=${String(missing.length).padEnd(4)} extra=${extra.length}`);
  if (missing.length) console.log(`  missing sample: ${missing.slice(0,10).join(' | ')}`);
  if (extra.length)   console.log(`  extra   sample: ${extra.slice(0,10).join(' | ')}`);
}

console.log('\n=== 2. 英文占位检测（目标语言value === en对应value视为占位） ===');
for (const loc of TARGETS) {
  const f = flatten(flat[loc]);
  let placeholder = 0, translated = 0, missing = 0, empty = 0;
  for (const [k, enVal] of enFlat.entries()) {
    if (!f.has(k)) { missing++; continue; }
    const v = f.get(k);
    if (v === '' || v == null) { empty++; continue; }
    if (typeof enVal === 'string' && v === enVal) placeholder++;
    else translated++;
  }
  const total = placeholder + translated + missing + empty;
  const pct = total ? ((translated / (translated + placeholder)) * 100).toFixed(1) : '0';
  console.log(`${loc.padEnd(4)}: 已翻译=${String(translated).padEnd(5)} 英文占位=${String(placeholder).padEnd(5)} 缺失key=${String(missing).padEnd(4)} 空值=${empty}   翻译率(排除缺失)=${pct}%`);
}

console.log('\n=== 3. zh vs en 参考（确认中文不是占位） ===');
{
  const f = zhFlat;
  let placeholder = 0, translated = 0, missing = 0;
  for (const [k, enVal] of enFlat.entries()) {
    if (!f.has(k)) { missing++; continue; }
    const v = f.get(k);
    if (typeof enVal === 'string' && v === enVal) placeholder++;
    else translated++;
  }
  const pct = ((translated / (translated + placeholder || 1)) * 100).toFixed(1);
  console.log(`zh  : 已翻译=${String(translated).padEnd(5)} 英文占位=${String(placeholder).padEnd(5)} 缺失key=${String(missing).padEnd(4)}   非占位率=${pct}%`);
}

console.log('\n=== 4. 新增100工具（tools.*）占位 vs 翻译 ===');
const TOOL_PREFIX = 'tools.';
const enToolKeys = [...enKeys].filter(k => k.startsWith(TOOL_PREFIX));
console.log(`发现 ${enToolKeys.length} 个 tools.* 类型的 key`);
for (const loc of TARGETS) {
  const f = flatten(flat[loc]);
  let placeholder = 0, translated = 0, missing = 0;
  for (const k of enToolKeys) {
    if (!f.has(k)) { missing++; continue; }
    const v = f.get(k);
    const enVal = enFlat.get(k);
    if (typeof enVal === 'string' && v === enVal) placeholder++;
    else translated++;
  }
  const pct = ((translated / (translated + placeholder || 1)) * 100).toFixed(1);
  console.log(`${loc.padEnd(4)} tools: 已翻译=${String(translated).padEnd(5)} 英文占位=${String(placeholder).padEnd(5)} 缺失key=${String(missing).padEnd(4)} 翻译率=${pct}%`);
}

// 输出一份完整缺失key列表供后续脚本使用
const missingReport = {};
for (const loc of TARGETS) {
  const f = flatten(flat[loc]);
  const keys = new Set(f.keys());
  missingReport[loc] = [...enKeys].filter(k => !keys.has(k));
}
const reportPath = path.resolve(__dirname, '_tmp_missing_keys_report.json');
fs.writeFileSync(reportPath, JSON.stringify(missingReport, null, 2));
console.log('\n详细缺失key列表已保存:', reportPath);
