const fs=require('fs');const p=require('path');
const ROOT=p.resolve(__dirname,'..','public','locales');
const REPORT=p.resolve(__dirname,'reports','translation-diff-20260712.json');
const SCRIPT=p.resolve(__dirname,'apply-translation-dictionary.cjs');

// =================== 1) 修 DIRTY_TID: en.tools.color-picker ===================
const enPath=p.join(ROOT,'en','translation.json');
const en=JSON.parse(fs.readFileSync(enPath,'utf8'));
console.log('[1/4] DIRTY_TID(color-picker) 修前:', JSON.stringify(en.tools['color-picker']));
en.tools['color-picker']={
  name:'Color Picker',
  description:'Free online color picker with eyedropper, HEX/RGB/HSL/HSV/CMYK conversion, color palette generator, gradient builder, contrast checker (WCAG AA/AAA) and Tailwind/Material design swatches — all in the browser.'
};
fs.writeFileSync(enPath,JSON.stringify(en,null,2)+'\n','utf8');
console.log('       修后:', JSON.stringify(en.tools['color-picker']));
console.log('       已保存:',enPath);

// =================== 2) 读报告 DICT_BETTER / CUR_BETTER ===================
const {byTagDetails}=JSON.parse(fs.readFileSync(REPORT,'utf8'));
const DICT_BETTER=byTagDetails.DICT_BETTER;
const CUR_BETTER_ENAMES=[...new Set(byTagDetails.CUR_BETTER.map(r=>r.en_name))];
// 对应每个 CUR_BETTER en_name -> 找对应 tid
const CUR_BETTER_ROWS=[];
for(const r of byTagDetails.CUR_BETTER){if(!CUR_BETTER_ROWS.find(x=>x.tid===r.tid))CUR_BETTER_ROWS.push(r);}
const TIDS=[...new Set(CUR_BETTER_ROWS.map(r=>r.tid))];
console.log(`\n[2/4] 待处理: DICT_BETTER=${DICT_BETTER.length} CUR_BETTER 涉及tid=${TIDS.length}`);

// 加载 4 个翻译文件，用于 CUR_BETTER 补齐 4 语言
const LOCALES=['es','fr','ar','hi'];
const files={};
for(const l of LOCALES)files[l]=JSON.parse(fs.readFileSync(p.join(ROOT,l,'translation.json'),'utf8'));

// =================== 3) DICT_BETTER 回写 4 个翻译文件 ===================
const byFile={};for(const r of DICT_BETTER){(byFile[r.locale]=byFile[r.locale]||[]).push(r);}
for(const locale in byFile){
  const f=p.join(ROOT,locale,'translation.json');
  const obj=files[locale];
  let c=0;
  for(const r of byFile[locale]){
    if(!obj.tools[r.tid])obj.tools[r.tid]={};
    obj.tools[r.tid].name=r.dict_name;c++;
  }
  fs.writeFileSync(f,JSON.stringify(obj,null,2)+'\n','utf8');
  console.log(`       DICT_BETTER 回写 ${locale}: ${c} 条 → ${f}`);
}

// =================== 4) CUR_BETTER 反向补 FULLNAME_DICT（4 语言从翻译文件拿齐） ===================
let src=fs.readFileSync(SCRIPT,'utf8');
const mark1='// ============================================================\n// 工具函数：翻译 name';
let dictPart=src.slice(0,src.indexOf(mark1));
dictPart=dictPart.replace(/^const fs = require\('fs'\);.*?const ROOT[^\n]*\n/s,'');
dictPart=dictPart.replace(/^\/\*[\s\S]*?\*\/\s*/,'');
eval(dictPart+';globalThis.__FULL=FULLNAME_DICT;');const FULL=globalThis.__FULL;
const fullMark=`const FULLNAME_DICT = {`;
const fullStart=src.indexOf(fullMark)+fullMark.length;
const fullEnd=src.indexOf('\n};',fullStart);

// 找 CUR_BETTER 里的唯一 tid 对应 en_name 和 4 语言 cur_name
const toAdd=[];
for(const tid of TIDS){
  const row=CUR_BETTER_ROWS.find(r=>r.tid===tid);if(!row)continue;
  const enName=row.en_name;if(FULL[enName]){console.log(`       跳过「${enName}」: FULLNAME_DICT 已存在`);continue;}
  const cur={};let ok=true;
  for(const l of LOCALES){
    const n=files[l].tools?.[tid]?.name;if(!n){ok=false;break;}
    cur[l]=n;
  }
  if(!ok){console.log(`       跳过 tid=${tid}(${enName}): 有 1+ 语言 name 为空`);continue;}
  toAdd.push({enName,cur});
}
const added=toAdd.length;
if(added>0){
  const lines=[];
  for(const {enName,cur} of toAdd){
    const q=s=>String(s).replace(/'/g,"\\'");
    lines.push(`  '${q(enName)}':  { es: '${q(cur.es)}',      fr: '${q(cur.fr)}', ar: '${q(cur.ar)}',       hi: '${q(cur.hi)}' }`);
  }
  const toInsert=`\n  // ---- CUR_BETTER 反向补入 (${new Date().toISOString().slice(0,10)}) ----\n`+lines.join(',\n')+',';
  const newSrc=src.slice(0,fullEnd)+toInsert+src.slice(fullEnd);
  fs.writeFileSync(SCRIPT,newSrc,'utf8');
  console.log(`       FULLNAME_DICT 新增 ${added} 条 → ${SCRIPT}`);
  for(const {enName,cur} of toAdd)console.log(`          + 「${enName}」= es:${cur.es} | fr:${cur.fr} | ar:${cur.ar} | hi:${cur.hi}`);
}else{
  console.log('       FULLNAME_DICT 新增 0 条');
}
console.log('\n[4/4] ✅ 脚本执行结束');
