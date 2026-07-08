const fs = require('fs');
const path = require('path');

console.log('1. 验证6语言translation.json合法性...');
const locales = ['zh','en','es','fr','ar','hi'];
let okCount = 0;
for(const lang of locales){
  try{
    const p = path.join(__dirname, '..', 'public', 'locales', lang, 'translation.json');
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    const keys = Object.keys(raw.tools || {}).length;
    console.log(`   ✅ ${lang}: tools条目数 = ${keys}`);
    okCount++;
  }catch(e){
    console.error(`   ❌ ${lang} 解析失败: ${e.message}`);
  }
}
console.log(`   翻译文件通过: ${okCount}/6\n`);

console.log('2. 验证data/tools.ts新工具id/slug/name完整性...');
try{
  // 用正则提取新追加的100个工具块
  const toolsPath = path.join(__dirname, '..', 'data', 'tools.ts');
  const src = fs.readFileSync(toolsPath, 'utf8');
  
  // 统计全部工具id数量
  const idMatches = src.match(/id:\s*'([^']+)'/g);
  const slugMatches = src.match(/slug:\s*'([^']+)'/g);
  const urlMatches = src.match(/externalUrl:\s*'([^']+)'/g);
  const totalIds = idMatches ? idMatches.length : 0;
  
  console.log(`   总工具数量id: ${totalIds}`);
  console.log(`   slug定义数量: ${slugMatches?.length || 0}`);
  console.log(`   externalUrl数量: ${urlMatches?.length || 0}`);
  
  // 检查新增100个工具的id集合
  const justNewIds = new Set();
  const blocks = src.split(/\n\s*\{\s*\n\s*id:\s*/g).slice(1).map(s => s.trimStart());
  for(const b of blocks.slice(blocks.length-100)){
    const id = b.match(/^'([^']+)'/)?.[1];
    if(id) justNewIds.add(id);
  }
  
  // 检查我们知道的典型新id
  const expectedSample = [
    'canva-video', 'capcut-web', 'tide-focus', 'hunt-webflow',
    'upwork-market', 'fiverr-gig', 'toggl-track', 'calendly-meeting'
  ];
  let hits = 0;
  for(const e of expectedSample){
    if(justNewIds.has(e)) hits++;
    else console.warn(`   ⚠️ 缺少预期新工具id: ${e}`);
  }
  console.log(`   抽样命中: ${hits}/${expectedSample.length}`);
  console.log(`   新增id集合大小: ${justNewIds.size}\n`);
  
  // 检查新工具全部 complianceLevel=green 且 platform=all
  const recent100 = blocks.slice(blocks.length-100);
  let greenCount = 0, allPlatform = 0;
  for(const b of recent100){
    if(/complianceLevel:\s*'green'/.test(b)) greenCount++;
    if(/platform:\s*'all'/.test(b)) allPlatform++;
  }
  console.log(`3. 合规性&平台验证(新增100个)`);
  console.log(`   合规(green): ${greenCount}/100`);
  console.log(`   平台(all=手机+电脑): ${allPlatform}/100`);
  
  // 检查违禁关键词
  console.log(`\n4. 违禁关键词扫描(破解/盗版/激活/去水印/代理/翻墙/外挂/生成人脸)`);
  const redFlags = ['破解','盗版','激活码','注册机','去水印','翻墙','代理IP','外挂','短信轰炸','生成证件','虚假定位','生成人脸','换脸','伪造','票据'];
  const flaggedIds = [];
  for(const block of recent100){
    const id = block.match(/^'([^']+)'/)?.[1] || '';
    const low = block.toLowerCase();
    for(const k of redFlags){
      if(low.includes(k.toLowerCase())){
        flaggedIds.push({id, keyword:k});
        break;
      }
    }
  }
  if(flaggedIds.length === 0){
    console.log(`   ✅ 无违禁关键词，全部合规`);
  } else {
    console.log(`   ❌ 违禁命中:`);
    flaggedIds.forEach(f => console.log(`      - ${f.id} (关键词:${f.keyword})`));
  }
  
  console.log('\n🎉 验证完成!');
}catch(e){
  console.error('   ❌ data/tools.ts 解析失败:', e.message);
  process.exit(1);
}
