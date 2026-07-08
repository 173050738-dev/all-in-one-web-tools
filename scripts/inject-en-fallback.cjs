const fs = require('fs');
const path = require('path');

const TOOLS_TS = path.join(__dirname, '..', 'data', 'tools.ts');
const EN_TRANSLATION = path.join(__dirname, '..', 'public', 'locales', 'en', 'translation.json');
const TAG_MAP = path.join(__dirname, '..', 'data', 'english-tags.ts');

let src = fs.readFileSync(TOOLS_TS, 'utf8');

// ===== Step 1: 给 Tool interface 加 3 个可选字段 =====
console.log('1. 给 Tool interface 加 nameEn / descriptionEn / tagsEn 字段...');
const ifaceMatch = src.match(/export interface Tool \{([\s\S]*?)\n\}\s*\n/);
if (!ifaceMatch) {
  console.error('   ❌ 找不到 Tool interface 定义');
  process.exit(1);
}
const originalIface = ifaceMatch[0];
if (originalIface.includes('nameEn')) {
  console.log('   ⏭️  Tool interface 已包含 nameEn，跳过');
} else {
  const tagsFieldMatch = originalIface.match(/\n\s*tags:\s*string\[\];/);
  if (!tagsFieldMatch) {
    console.error('   ❌ 找不到 tags 字段位置');
    process.exit(1);
  }
  const insertion = tagsFieldMatch[0] + `\n  nameEn?: string;\n  descriptionEn?: string;\n  tagsEn?: string[];`;
  const newIface = originalIface.replace(tagsFieldMatch[0], insertion);
  src = src.replace(originalIface, newIface);
  console.log('   ✅ Tool interface 已注入 3 个可选字段');
}

// ===== Step 2: 读取 en translation.json 工具翻译 =====
console.log('\n2. 读取 en/translation.json...');
let enJson;
try {
  enJson = JSON.parse(fs.readFileSync(EN_TRANSLATION, 'utf8'));
} catch (e) {
  console.error('   ❌ en translation.json 解析失败:', e.message);
  process.exit(2);
}
const enTools = (enJson && enJson.tools) || {};
console.log(`   en tools translation 条目数: ${Object.keys(enTools).length}`);

// ===== Step 3: 读取 english-tags.ts 映射 =====
console.log('\n3. 读取 english-tags.ts 映射...');
const tagMapSrc = fs.readFileSync(TAG_MAP, 'utf8');
const zhToEn = {};
let tagCount = 0;
const re = /"([^"]+)"\s*:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(tagMapSrc)) !== null) {
  zhToEn[m[1]] = m[2];
  tagCount++;
}
console.log(`   中文标签→英文 映射数: ${tagCount}`);

// ===== Step 4: 遍历每个工具对象，注入 nameEn / descriptionEn / tagsEn =====
console.log('\n4. 遍历工具对象，注入英文 fallback 字段...');

// 工具对象起始行 =   { id: 'xxx', ... 结束是 },
// 按块解析：匹配从 "  {" 开始，到下一个 "\n  },\n" 结束的块（注意可能是最后一块，结束是 }\n];
// 用更保守的方法：逐个抓 id 出现的位置，取到 } 结尾为止
const blockRegex = /\{\s*\n\s*id:\s*'([^']+)'[\s\S]*?\n\s*\},\n?/g;
let blockMatch;
let patchedCount = 0;
let addedEn = 0;
const toReplace = [];

while ((blockMatch = blockRegex.exec(src)) !== null) {
  const fullBlock = blockMatch[0];
  const id = blockMatch[1];
  const en = enTools[id];

  // 已经有 nameEn 就跳过（防止重复注入）
  if (fullBlock.includes('nameEn:') || fullBlock.includes('descriptionEn:')) {
    patchedCount++;
    continue;
  }

  // 找到 tags: [...] 这一项，在它后面注入 nameEn/descriptionEn/tagsEn
  // tags 的模式是 tags: ['xxx', 'xxx', ...]，后面可能有逗号或无逗号
  const tagsLineRegex = /(tags:\s*\[([^\]]*)\][,\s]*\n)/;
  const tagsMatch = fullBlock.match(tagsLineRegex);
  if (!tagsMatch) continue;

  const tagsRawString = tagsMatch[2] || '';
  const tags = tagsRawString.split(/,/g).map(s => s.trim().replace(/^'/, '').replace(/'$/, '')).filter(Boolean);
  const tagsEn = tags.map(t => zhToEn[t] || t);

  const nameEn = en && en.name ? en.name : null;
  const descEn = en && en.description ? en.description : null;

  // 构造注入的字符串（注意转义单引号和反斜杠）
  function escapeStr(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  const parts = [];
  if (nameEn) parts.push(`nameEn: '${escapeStr(nameEn)}'`);
  if (descEn) parts.push(`descriptionEn: '${escapeStr(descEn)}'`);
  if (tagsEn.length > 0) {
    const tagsEnLit = `[${tagsEn.map(t => `'${escapeStr(t)}'`).join(', ')}]`;
    parts.push(`tagsEn: ${tagsEnLit}`);
  }
  if (parts.length === 0) continue;

  const injectText = `${parts.join(', ')},\n`;
  const newBlock = fullBlock.replace(tagsMatch[1], tagsMatch[1] + '    ' + injectText);
  toReplace.push({ from: fullBlock, to: newBlock, id });
}

console.log(`   已含 nameEn/descriptionEn 跳过: ${patchedCount} 条`);
console.log(`   待注入: ${toReplace.length} 条`);

// Apply replacements
for (const { from, to, id } of toReplace) {
  if (src.includes(from)) {
    src = src.replace(from, to);
    addedEn++;
  } else {
    console.warn(`   ⚠️  无法匹配 id=${id} 的块，跳过注入`);
  }
}

// ===== Step 5: 写回 =====
fs.writeFileSync(TOOLS_TS, src, 'utf8');
console.log(`\n5. ✅ 已写入 data/tools.ts，成功注入 ${addedEn} 个工具的英文 fallback 字段`);

// ===== Step 6: 验证抽样 =====
console.log('\n6. 抽样验证:');
const verifyIds = ['canva-video', 'capcut-web', 'tide-focus', 'upwork-market', 'qr-code-generator'];
const newSrc = fs.readFileSync(TOOLS_TS, 'utf8');
for (const id of verifyIds) {
  const regex = new RegExp(`id:\\s*'${id}'[\\s\\S]*?(?=\\n\\s*\\},\\n?)`, 'm');
  const mm = newSrc.match(regex);
  if (mm) {
    const hasNameEn = /nameEn:\s*'/.test(mm[0]);
    const hasDescEn = /descriptionEn:\s*'/.test(mm[0]);
    const hasTagsEn = /tagsEn:\s*\[/.test(mm[0]);
    console.log(`   id=${id}: nameEn=${hasNameEn} descEn=${hasDescEn} tagsEn=${hasTagsEn}`);
  } else {
    console.log(`   id=${id}: ❌ 找不到`);
  }
}
console.log('\n🎉 完成');
