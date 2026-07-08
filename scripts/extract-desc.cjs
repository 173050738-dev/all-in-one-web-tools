const fs = require('fs');
const en = JSON.parse(fs.readFileSync('d:\\projects\\工具独立站\\public\\locales\\en\\translation.json', 'utf-8'));
const es = JSON.parse(fs.readFileSync('d:\\projects\\工具独立站\\public\\locales\\es\\translation.json', 'utf-8'));

const all = Object.keys(en.tools || {});
const untranslated = [];
for (const tid of all) {
  if (!es.tools[tid]) continue;
  if (es.tools[tid].description === en.tools[tid].description) {
    untranslated.push({ tid, desc: en.tools[tid].description.slice(0, 120) });
  }
}
console.log(`=== description仍使用英文占位：${untranslated.length} 条 ===\n`);
for (const x of untranslated) {
  console.log(`tid=${x.tid}`);
  console.log(`  EN: ${x.desc}`);
  console.log('');
}
