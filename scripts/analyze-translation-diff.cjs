const fs=require('fs');const p=require('path');
const ROOT=p.resolve(__dirname,'..','public','locales');
const REPORT_DIR=p.resolve(__dirname,'reports');
if(!fs.existsSync(REPORT_DIR))fs.mkdirSync(REPORT_DIR,{recursive:true});
const srcAll=fs.readFileSync(p.resolve(__dirname,'apply-translation-dictionary.cjs'),'utf8');
const mark1='// ============================================================\n// 工具函数：翻译 name';
let dictPart=srcAll.slice(0,srcAll.indexOf(mark1));
dictPart=dictPart.replace(/^const fs = require\('fs'\);.*?const ROOT[^\n]*\n/s,'');
dictPart=dictPart.replace(/^\/\*[\s\S]*?\*\/\s*/,'');
eval(dictPart+';globalThis.__SF=SUFFIX_DICT;globalThis.__FN=FULLNAME_DICT;globalThis.__DD=typeof DESC_DICT!=="undefined"?DESC_DICT:{};globalThis.__DT=typeof DESC_BY_TID!=="undefined"?DESC_BY_TID:{};');
const SUFFIX_DICT=globalThis.__SF,FULLNAME_DICT=globalThis.__FN,DESC_DICT=globalThis.__DD,DESC_BY_TID=globalThis.__DT;
const SUFFIXES=Object.keys(SUFFIX_DICT).sort((a,b)=>b.length-a.length);
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function tName(n,l){
  if(FULLNAME_DICT[n]&&FULLNAME_DICT[n][l])return FULLNAME_DICT[n][l];
  for(const s of SUFFIXES){const r=new RegExp('\\s+'+esc(s)+'$');if(r.test(n)){const b=n.replace(r,'').trim();return b?b+' '+SUFFIX_DICT[s][l]:SUFFIX_DICT[s][l];}}
  for(const s of SUFFIXES){if(n.endsWith(s)){const b=n.slice(0,-s.length).replace(/[-\s]+$/,'');return b?b+' '+SUFFIX_DICT[s][l]:SUFFIX_DICT[s][l];}}
  return n;
}
function tDesc(tid,d,l){if(DESC_BY_TID[tid]&&DESC_BY_TID[tid][l])return DESC_BY_TID[tid][l];return(DESC_DICT[d]&&DESC_DICT[d][l])||d;}

// 启发式分类规则
function classify(tid,enName,cur,dict,locale){
  // 1) DIRTY_TID: tid 明显暗示的关键字段不在 EN name 里（比如 *color* tid 里 name 却是 PDF）
  const tidLow=tid.toLowerCase(),enLow=enName.toLowerCase();
  const colorClues=['color','colour','picker'];
  if(colorClues.some(c=>tidLow.includes(c))&&!['color','colour','picker'].some(c=>enLow.includes(c)))
    return{tag:'DIRTY_TID',reason:`tid含color/picker线索但EN名「${enName}」无color/picker语义`};
  if(tidLow.includes('qr')&&!enLow.includes('qr'))
    return{tag:'DIRTY_TID',reason:`tid含qr线索但EN名「${enName}」无QR语义`};
  if(tidLow.includes('password')&&!enLow.includes('password')&&!enLow.includes('pass'))
    return{tag:'DIRTY_TID',reason:`tid含password线索但EN名「${enName}」无password语义`};
  if(tidLow.includes('pdf')&&!enLow.includes('pdf'))
    return{tag:'DIRTY_TID',reason:`tid含pdf线索但EN名「${enName}」无PDF语义`};
  if(tidLow.includes('image')&&!enLow.includes('image')&&!enLow.includes('photo')&&!enLow.includes('img'))
    return{tag:'DIRTY_TID',reason:`tid含image线索但EN名「${enName}」无image语义`};
  if(tidLow.includes('markdown')&&!enLow.includes('markdown')&&!enLow.includes('md'))
    return{tag:'DIRTY_TID',reason:`tid含markdown线索但EN名「${enName}」无markdown语义`};
  if(tidLow.includes('emoji')&&!enLow.includes('emoji'))
    return{tag:'DIRTY_TID',reason:`tid含emoji线索但EN名「${enName}」无emoji语义`};
  // 2) CUR_BETTER: 字典产出「半英半本地」结构（保留英文品牌词后面直接跟本地词），但当前已经是全本地意译
  const dictHasEnBrand=/^[A-Za-z][\w\-\.\+]*\s+[^\x00-\x7F]/.test(dict);// 英文词+空格+非ASCII（本地词）
  const curIsLocal=/^[^\x00-\x7F]/.test(cur);// 以非ASCII开头=全本地化
  const dictHalfLocal=/[A-Za-z]\s/.test(dict)&&/[^\x00-\x7F]/.test(dict);// 混英+本地
  if(curIsLocal&&dictHalfLocal&&!cur.includes(' ')&&locale!=='hi')// hi 里经常是 Devanagari 空格
    return{tag:'CUR_BETTER',reason:'当前是完整本地词开头，字典是半英半本地拼接'};
  // 3) CUR 信息更全（包含更多语义词）→ CUR_BETTER
  const curWords=new Set(cur.toLowerCase().split(/[\s\-.,:;()\/"'`\u00A0\u2000-\u206F]+/).filter(Boolean));
  const dictWords=new Set(dict.toLowerCase().split(/[\s\-.,:;()\/"'`\u00A0\u2000-\u206F]+/).filter(Boolean));
  let curExtra=0;for(const w of curWords)if(!dictWords.has(w)&&!/^(de|del|al|la|le|les|des|du|el|los|las|of|the|a|an|di|da|do|das|den|der|die|und|oder|en|et|ou|à|á|é|í|ó|ú|ñ|ş|ă|â|ê|ô|ç|i|ı|ş|ğ|ü|ö|ı)$/.test(w))curExtra++;
  const lenRatio=cur.length/Math.max(1,dict.length);
  if(curExtra>=2&&lenRatio>1.4)
    return{tag:'CUR_BETTER',reason:`当前比字典多出${curExtra}个语义词（长度${cur.length} vs ${dict.length}），信息更完整`};
  // 4) DICT_BETTER: 字典用了 FULLNAME 精确匹配（整词译法更权威）或字典更短且不丢失关键语义
  if(FULLNAME_DICT[enName])
    return{tag:'DICT_BETTER',reason:'字典命中FULLNAME_DICT精确条目，译法更统一'};
  if(dict.length<cur.length*0.75&&curExtra<2)
    return{tag:'DICT_BETTER',reason:'字典更简洁（约短25%+）且不丢失关键语义'};
  // 5) 默认 TOSSUP
  return{tag:'TOSSUP',reason:'两者质量相当或差异微妙，默认保留当前不覆盖'};
}

const en=JSON.parse(fs.readFileSync(p.join(ROOT,'en','translation.json'),'utf8'));
const tids=Object.keys(en.tools||{});
const LOCALES=['es','fr','ar','hi'];
const byLocale={},byTag={DIRTY_TID:[],DICT_BETTER:[],CUR_BETTER:[],TOSSUP:[]};
const totals={es:0,fr:0,ar:0,hi:0};
for(const locale of LOCALES){
  const o=JSON.parse(fs.readFileSync(p.join(ROOT,locale,'translation.json'),'utf8'));
  const list=[];
  for(const tid of tids){
    const et=en.tools[tid];if(!et)continue;const t=o.tools[tid]||{};
    const cand=tName(et.name,locale);if(cand===et.name||cand===t.name)continue;
    const cls=classify(tid,et.name,t.name,cand,locale);
    const row={tid,en_name:et.name,cur_name:t.name,dict_name:cand,...cls,locale};
    list.push(row);byTag[cls.tag].push(row);
  }
  byLocale[locale]=list;totals[locale]=list.length;
}
// 写报告
const outFile=p.join(REPORT_DIR,`translation-diff-${new Date().toISOString().slice(0,10).replace(/-/g,'')}.json`);
const tagSummary={};for(const k in byTag)tagSummary[k]=byTag[k].length;
fs.writeFileSync(outFile,JSON.stringify({
  generatedAt:new Date().toISOString(),
  totalTools:tids.length,
  byLocale:Object.fromEntries(Object.entries(totals)),
  byTag:tagSummary,
  byLocaleDetails:byLocale,
  byTagDetails:byTag
},null,2)+'\n','utf8');
console.log('报告写入:',outFile);
console.log('\n按语言不一致数:',JSON.stringify(totals));
console.log('按分类数量:',JSON.stringify(tagSummary));
console.log('\n===== DIRTY_TID 列表(高优先级修) =====');
for(const r of byTag.DIRTY_TID.slice(0,30))console.log('  ·',r.tid.padEnd(28),'EN='+r.en_name,'|',r.locale,':',r.reason);
console.log(`DIRTY_TID 共${byTag.DIRTY_TID.length}条，按tid去重=`,(new Set(byTag.DIRTY_TID.map(r=>r.tid))).size);
console.log('\n===== CUR_BETTER 样例(前12条，建议反向补回FULLNAME_DICT) =====');
for(const r of byTag.CUR_BETTER.slice(0,12))console.log('  ·',r.tid.padEnd(26),r.locale,': EN「'+r.en_name+'」 → 当前「'+r.cur_name+'」（字典='+r.dict_name+'）原因:'+r.reason);
console.log('\n===== DICT_BETTER 样例(前12条，将直接回写) =====');
for(const r of byTag.DICT_BETTER.slice(0,12))console.log('  ·',r.tid.padEnd(26),r.locale,': EN「'+r.en_name+'」 → 字典「'+r.dict_name+'」（当前='+r.cur_name+'）原因:'+r.reason);
