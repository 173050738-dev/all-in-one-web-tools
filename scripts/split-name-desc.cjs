const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'en', 'translation.json'), 'utf8'));

const es = JSON.parse(fs.readFileSync(path.join(ROOT, 'es', 'translation.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(ROOT, 'fr', 'translation.json'), 'utf8'));
const ar = JSON.parse(fs.readFileSync(path.join(ROOT, 'ar', 'translation.json'), 'utf8'));
const hi = JSON.parse(fs.readFileSync(path.join(ROOT, 'hi', 'translation.json'), 'utf8'));

let namePlaceholder = 0, descPlaceholder = 0;
let brandLikeName = 0, descLikeName = 0;
const descPHSet = new Set();
const namePHList = [];

// 判断是否看起来像品牌名（CamelCase/专有词组成，不含空格动词）
const BRAND_PATTERNS = [
  /^\S+$/,                      // 无空格单词 (Grammarly, Unsplash, Deepl, Calendly)
  /^[A-Z][a-z]+\s[A-Z][a-z]+$/, // 两个单词每词首字母大写 (Bear Notes, Remove Bg -> 不对，Bg大写B)
  /\.com$/, /\.io$/, /\.app$/, // 域名
  /^\d+News$/,                  // 163News 类
];
const DESCRIPTIVE_WORDS = ['Free', 'Editor', 'Compress', 'Remover', 'Maker', 'Generator', 'Converter',
  'Merger', 'Splitter', 'Downloader', 'Player', 'Viewer', 'Reader', 'Recorder', 'Translator',
  'Analyzer', 'Checker', 'Formatter', 'Builder', 'Designer', 'Writer', 'Studio', 'Suite',
  'Toolkit', 'Manager', 'Tracker', 'Planner', 'Scheduler', 'Hosting', 'Browser', 'Search',
  'Library', 'Template', 'Gallery', 'Launch', 'Playground', 'Garden', 'Froggy', 'Tricks',
  'Pages', 'Docs', 'Magazine', 'Images', 'Icons', 'Fonts', 'PDF', 'GIF', 'Audio', 'Video',
  'Voice', 'Music', 'CSS', 'JavaScript', 'JSON', 'JQ', 'AI', 'IDE', 'No-Code'];

for (const toolId of Object.keys(en.tools || {})) {
  const enName = en.tools[toolId].name || '';
  const enDesc = en.tools[toolId].description || '';
  for (const [loc, obj] of [['es', es], ['fr', fr], ['ar', ar], ['hi', hi]]) {
    const t = (obj.tools && obj.tools[toolId]) || {};
    // name
    if (t.name === enName && enName.length > 0) {
      namePlaceholder++;
      if (loc === 'es') namePHList.push({ toolId, name: enName });
    }
    // description
    if (t.description === enDesc && enDesc.length > 0) {
      descPlaceholder++;
      if (loc === 'es') descPHSet.add(toolId + '::' + enDesc.slice(0, 40));
    }
  }
}

// 分类名字：品牌 vs 描述性
function isBrandLikeName(n) {
  if (!n) return false;
  // 有空格且含描述性单词 → 描述性名称
  for (const w of DESCRIPTIVE_WORDS) {
    const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (re.test(n)) return false;
  }
  // 全大写缩写 (CSS, PDF, AI) 保留；多个描述性单词
  if (/^[A-Z]{2,}$/.test(n)) return true;
  // 单单词 + 首字母大写 → 品牌
  if (/^[A-Z][a-z0-9]+$/.test(n)) return true;
  // 驼峰 (CodePen, FaceBook)
  if (/^[A-Z][a-z0-9]+[A-Z][a-zA-Z0-9]+$/.test(n)) return true;
  // 默认：无空格 → 品牌；有空格且不匹配描述词 → 品牌
  return !n.includes(' ');
}

for (const { name } of namePHList) {
  if (isBrandLikeName(name)) brandLikeName++;
  else descLikeName++;
}

console.log(`\n=== es 样本：名字段占位 ${namePHList.length} 个 ===`);
console.log(`  品牌名(保留原英文): ${brandLikeName} (建议不翻译)`);
console.log(`  描述性名称(需翻译): ${descLikeName}`);
console.log(`\n描述字段占位(4语言合计): ${descPlaceholder} 个（es样本:${descPHSet.size}个唯一工具）`);

// 打印描述性名称样例
console.log('\n=== 需翻译的描述性名称(前40) ===');
const needTranslate = namePHList.filter(x => !isBrandLikeName(x.name)).slice(0, 40);
for (const { toolId, name } of needTranslate) console.log(`  ${toolId.padEnd(26)} | "${name}"`);

console.log('\n=== 保留的品牌名(前40) ===');
const keep = namePHList.filter(x => isBrandLikeName(x.name)).slice(0, 40);
for (const { toolId, name } of keep) console.log(`  ${toolId.padEnd(26)} | "${name}"`);

// 打印需要翻译的description样例（5条）
console.log('\n=== 需要翻译的 description 样例（前5条） ===');
let c = 0;
for (const toolId of Object.keys(en.tools || {})) {
  const enDesc = en.tools[toolId].description || '';
  if (es.tools[toolId].description === enDesc) {
    const short = enDesc.length > 140 ? enDesc.slice(0, 140) + '…' : enDesc;
    console.log(`  [${toolId}] ${short}`);
    if (++c >= 5) break;
  }
}
