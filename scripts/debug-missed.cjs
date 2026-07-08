const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'en', 'translation.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(ROOT, 'es', 'translation.json'), 'utf8'));

// 收集前 30 个 es 仍占位的 name 看规律
const missed = [];
for (const tid of Object.keys(en.tools || {})) {
  const enName = en.tools[tid].name;
  if (es.tools[tid].name === enName) missed.push({ tid, enName });
}
console.log(`es仍占位数: ${missed.length}`);
console.log('\n=== 前60个未命中（为什么没匹配 SUFFIX_DICT？） ===');
for (const x of missed.slice(0, 60)) {
  const words = x.enName.split(' ');
  console.log(`  tid=${x.tid.padEnd(28)} name="${x.enName}"  后缀="${words[words.length-1]}"  词数=${words.length}`);
}
// 统计出现频率最高的"末尾词"
const tailFreq = new Map();
for (const x of missed) {
  const t = x.enName.split(' ').slice(-1)[0];
  tailFreq.set(t, (tailFreq.get(t)||0)+1);
}
console.log('\n=== Top 30 出现频率最高的"末尾词"（未匹配） ===');
const top = [...tailFreq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,30);
for (const [t,n] of top) console.log(`  "${t}" -> ${n}`);
