const fs = require('fs');
const path = require('path');
const ROOT = 'd:\\projects\\工具独立站\\public\\locales';
const LOCALES = ['en', 'zh', 'es', 'fr', 'ar', 'hi'];
const errors = [];
const warns = [];

// ===== 1. UTF-8 No BOM =====
console.log('===== [1/4] UTF-8 No BOM =====');
for (const loc of LOCALES) {
  const fp = path.join(ROOT, loc, 'translation.json');
  const buf = fs.readFileSync(fp).slice(0, 3);
  const bom = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
  if (bom) { errors.push(`[BOM] ${fp} 包含 UTF-8 BOM，应移除！`); }
  else { console.log(`  ✓ ${loc}: No BOM`); }
}

// ===== 2. 结构对齐 =====
console.log('\n===== [2/4] Top-level & Tools key 完全对齐 en =====');
const json = {};
for (const loc of LOCALES) json[loc] = JSON.parse(fs.readFileSync(path.join(ROOT, loc, 'translation.json'), 'utf8'));

const en = json['en'];
const enTopKeys = Object.keys(en).sort().join(',');
const enTids = Object.keys(en.tools || {}).sort();
for (const loc of LOCALES.filter(l => l !== 'en')) {
  const topKeys = Object.keys(json[loc]).sort().join(',');
  if (topKeys !== enTopKeys) {
    errors.push(`[TOP-KEY] ${loc} ≠ en. 缺: ${diff(enTopKeys.split(','), Object.keys(json[loc]).sort()).join(',')}`);
  } else { console.log(`  ✓ ${loc} top-level keys 对齐`); }
  const tids = Object.keys(json[loc].tools || {}).sort();
  if (tids.join(',') !== enTids.join(',')) {
    const missing = enTids.filter(t => !tids.includes(t));
    const extra = tids.filter(t => !enTids.includes(t));
    errors.push(`[TOOLS] ${loc} 缺 ${missing.length} 个tid, 多 ${extra.length} 个tid。 缺前10: ${missing.slice(0,10).join(',')}`);
  } else { console.log(`  ✓ ${loc} tools tid 完全对齐 en (${enTids.length} 条)`); }

  // each tool has name + description
  for (const tid of enTids) {
    const t = json[loc].tools[tid] || {};
    if (typeof t.name !== 'string' || typeof t.description !== 'string') {
      errors.push(`[FIELD] ${loc}/${tid} 缺 name/description 字段`);
    }
  }
}

// ===== 3. 100个新增工具的 name 和 description 不再=EN =====
console.log('\n===== [3/4] 新增100个工具 name/desc 非EN占位检查 =====');
const newlyAdded = ['cal-com','ray-so','canva-video','capcut-web','descript-video','veed-io','kapwing-tools','wistia-hosting','vidyard-messages','loom-recorder','screencastify-chrome','streamyard-live','restream-io','runway-gen','pika-labs','submagic-auto','opus-clip','repurpose-io','riverside-fm','streamlabs-obs','motion-array','artlist-io','epidemic-sound','storyblocks-vid','pixabay-video','pexels-videos','unsplash-images','canva-design','figma-design','feishu-docs','tencent-docs','notion-workspace','xmind-mindmap','processon-flow','whimsical-wire','chuangkit-poster','markup-hero','airtable-db','feishu-bitable','tencent-survey','typeform-form','jotform-builder','pandadoc-sign','fadada-sign','shangshangqian','good-acc','mingpian全能王','aiqicha-query','tianyancha','trae-cn','codeium-free','dida-365','upwork-market','fiverr-gig','zbj-service','yuanling-work','pj-work','toggl-track','harvest-invoice','freshbooks-cloud','wave-invoicing','andco-freelance','bonsai-suite','calendly-meeting','acuity-sched','tencent-meeting','zoom-video','feishu-meeting','miro-whiteboard','invision-freehand','skillshare-learn','coursera-plus','degreed-skill','canva-resume','standard-resume','read-cv','tide-focus','noisli-bg','forest-focus','todoist-gtd','ms-todo','obsidian-publish','roam-research','duolingo-web','anki-web','grammarly-check','netease-jianwai','deepl-translate','ilovepdf-io','smallpdf-tools','kami-pdf','lightpdf-cloud','carbon-now','codepen-io','figma-community','dribbble-design','behance-portfolio','notion-templates','product-hunt','hunt-webflow'];
for (const loc of ['es','fr','ar','hi']) {
  let missed = 0;
  for (const tid of newlyAdded) {
    if (!en.tools[tid]) continue;
    const enName = en.tools[tid].name;
    const enDesc = en.tools[tid].description;
    if (json[loc].tools[tid].name === enName && !['PDF','API','CSS','JSON'].includes(enName.split(' ').slice(-1)[0])) {
      warns.push(`  ⚠ [NAME=EN] ${loc}/${tid}: name 仍=EN (${enName.slice(0,25)})`); missed++;
    }
    if (json[loc].tools[tid].description === enDesc) {
      errors.push(`  ✗ [DESC=EN] ${loc}/${tid}: description 仍=EN！`); missed++;
    }
  }
  console.log(`  [${loc}] 新增100工具未命中率: ${missed}/100`);
}

// ===== 4. AR/HI 字体 RTL 检查 =====
console.log('\n===== [4/4] AR/HI 字体 & RTL 自检 =====');
let arCount = 0, hiCount = 0;
const AR_RE = /[\u0600-\u06FF\u0750-\u077F]/;
const HI_RE = /[\u0900-\u097F]/;
for (const tid of newlyAdded) {
  if (!en.tools[tid]) continue;
  if (AR_RE.test(json['ar'].tools[tid].name + json['ar'].tools[tid].description)) arCount++;
  if (HI_RE.test(json['hi'].tools[tid].name + json['hi'].tools[tid].description)) hiCount++;
}
console.log(`  ✓ ar 包含阿拉伯字母条目: ${arCount}/${newlyAdded.length}`);
console.log(`  ✓ hi 包含天城文字母条目: ${hiCount}/${newlyAdded.length}`);
if (arCount < 80) warns.push('AR 覆盖率偏低，建议抽查');
if (hiCount < 80) warns.push('HI 覆盖率偏低，建议抽查');

console.log(`\n========== 汇总 ==========`);
console.log(`  ERROR: ${errors.length}`);
console.log(`  WARN:  ${warns.length}`);
if (errors.length) {
  console.log('\n❌ 需要修复的 ERROR:');
  for (const e of errors.slice(0, 20)) console.log('  ' + e);
  process.exit(1);
} else {
  console.log('\n✅ 一致性校验通过！');
  if (warns.length) {
    console.log(`⚠  仅有警告（非致命，供参考）前 8 条：`);
    for (const w of warns.slice(0, 8)) console.log('  ' + w);
  }
}

function diff(a, b) { const sb = new Set(b); return a.filter(x => !sb.has(x)); }
