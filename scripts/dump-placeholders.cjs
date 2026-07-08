const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public', 'locales');
const TARGETS = ['es', 'fr', 'ar', 'hi'];

function load(p) {
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);
}
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
}

const enFlat = flatten(load(path.join(ROOT, 'en', 'translation.json')));
const data = {};
const enValueFreq = new Map(); // enValue -> count(how many locales use it as placeholder)
const enValueSampleKeys = new Map(); // enValue -> sample key

for (const loc of TARGETS) {
  const f = flatten(load(path.join(ROOT, loc, 'translation.json')));
  const placeholders = [];
  for (const [k, enVal] of enFlat.entries()) {
    const v = f.get(k);
    if (typeof enVal === 'string' && typeof v === 'string' && enVal === v && enVal.length > 0) {
      placeholders.push({ k, v: enVal });
      enValueFreq.set(enVal, (enValueFreq.get(enVal) || 0) + 1);
      if (!enValueSampleKeys.has(enVal)) enValueSampleKeys.set(enVal, k);
    }
  }
  data[loc] = placeholders;
  console.log(`${loc}: ${placeholders.length} placeholders`);
}

// Top 50 most frequent EN placeholder values (those repeated across multiple keys / all 4 langs)
console.log('\n=== Top 50 高频英文占位值（按出现key数排序，4种语言都占位即x4） ===');
const top = [...enValueFreq.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 80);
for (let i = 0; i < top.length; i++) {
  const [val, freq] = top[i];
  const sample = enValueSampleKeys.get(val);
  const short = val.length > 110 ? val.slice(0, 110) + '…' : val.replace(/\n/g, '\\n');
  console.log(`${String(i + 1).padStart(2)}. freq=${String(freq).padEnd(3)} | sampleKey=${String(sample).padEnd(35)} | "${short}"`);
}

// 分类：按前缀
const CATS = [
  { name: 'categories', prefix: 'categories.' },
  { name: 'badges',     prefix: 'badges.' },
  { name: 'tools',      prefix: 'tools.' },
  { name: 'nav',        prefix: 'nav.' },
  { name: 'buttons',    prefix: 'buttons.' },
  { name: 'toast',      prefix: 'toast.' },
  { name: 'common',     prefix: 'common.' },
  { name: 'home',       prefix: 'home.' },
  { name: 'toolPage',   prefix: 'toolPage.' },
  { name: 'auth',       prefix: 'auth.' },
  { name: 'errors',     prefix: 'errors.' },
  { name: 'difficulty', prefix: 'difficulty.' },
];
console.log('\n=== 按命名空间统计占位分布（es 作为样本） ===');
const esPH = data.es;
for (const cat of CATS) {
  const n = esPH.filter(p => p.k.startsWith(cat.prefix)).length;
  console.log(`${cat.prefix.padEnd(16)} -> ${n} placeholders`);
}
const rest = esPH.filter(p => !CATS.some(c => p.k.startsWith(c.prefix))).length;
console.log(`(other namespaces) -> ${rest} placeholders`);

// 导出所有占位值供翻译字典使用
const uniqueValues = [...enValueFreq.keys()];
const outPath = path.resolve(__dirname, '_tmp_placeholder_values.json');
fs.writeFileSync(outPath, JSON.stringify(uniqueValues, null, 2));
console.log(`\n共 ${uniqueValues.length} 个唯一英文占位值，保存至: ${outPath}`);
