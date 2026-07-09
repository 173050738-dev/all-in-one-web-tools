const https = require('https');
const ROUTES = [
  {key:'PWD',url:'https://korelyy.com/zh/tool/password-generator/',asserts:[
    {desc:'密码生成器真实功能工作区',rx:/密码生成器|password generator/i},
    {desc:'滑块控件（密码长度<slider>）',rx:/<input[^>]*type="range"[^>]*|<(?:div|span)[^>]*role="slider"/i},
    {desc:'复选框（大写/小写/数字/特殊符号）至少4个',rx:/type="checkbox"[^>]*[^]*?type="checkbox"[^>]*[^]*?type="checkbox"[^>]*[^]*?type="checkbox"/i},
    {desc:'"复制密码"或"重新生成"按钮',rx:/复制密码|重新生成|copy|regenerate/i},
    {desc:'AdSense ca-pub-7235824755389632 脚本（CSP放行）',rx:/adsbygoogle\.js[^>]*ca-pub-7235824755389632/},
    {desc:'NOT: "正在开发中"占位旧模式',rx:/正在开发中|敬请期待|coming soon/i,negate:true,tag:'旧bug占位文本（不应出现）'}
  ]},
  {key:'ARBLOG',url:'https://korelyy.com/ar/blog/cadence-180-step-rate-training/',asserts:[
    {desc:'阿拉伯语标题正常渲染',rx:/180|تردد|كادنس/i},
    {desc:'公历日期"5 يوليو 2026"或等价公历（非回历1448 هـ）',rx:/(5|٥) (يوليو|جويلية|يوليه) 2026|2026(?!.*?هـ|١٤٤٨|مح)/i,tag:'公历日期（非回历/无阿拉伯数字年份1448/1447/1446/1445/1444/1443/1442/1441/1440）'},
    {desc:'NOT: 回历Hijri年份符号 هـ',rx:/هـ|١٤٤[٠-٩]|144[0-9].*[هج]/i,negate:true,tag:'回历日期（不应出现）'},
    {desc:'AdSense ca-pub脚本存在',rx:/adsbygoogle\.js[^>]*ca-pub-7235824755389632/}
  ]},
  {key:'ESBLOG',url:'https://korelyy.com/es/blog/password-generator-security-myths-2026/',asserts:[
    {desc:'西语博客标题渲染',rx:/mitos|contraseñas|desmentidos|owasp|nist/i},
    {desc:'NOT: NEWS_ISSUES循环引用Error',rx:/Cannot access .*NEWS_ISSUES.*before initialization|NEWS_ISSUES.*error|循环引用/i,negate:true,tag:'循环引用错误（不应出现）'},
    {desc:'NOT: sync-dynamic-apis Next警告',rx:/sync-dynamic-apis|async.*params.*warn/i,negate:true,tag:'动态路由params未await警告（不应出现）'},
    {desc:'NOT: Hydration Mismatch真实业务错误',rx:/Hydration failed because the initial UI does not match(?!.*data-trae-ref)/i,negate:true,tag:'Hydration不匹配（非data-trae-ref误报类）'},
    {desc:'AdSense ca-pub脚本存在',rx:/adsbygoogle\.js[^>]*ca-pub-7235824755389632/}
  ]}
];
let cspReport = {};
async function fetch(u){
  return new Promise((res,rej)=>{
    const req = https.get(u,{timeout:60000,headers:{'Accept':'text/html,application/xhtml+xml','Cache-Control':'no-cache','User-Agent':'Korelyy-Prod-SelfTest/1.0'}},r=>{
      let body=''; r.setEncoding('utf8');
      const csp = r.headers['content-security-policy']||r.headers['content-security-policy-report-only']||'';
      cspReport[u] = {status:r.statusCode, cspHeader: csp.length>200? csp.slice(0,200)+'...' : csp};
      r.on('data',d=>body+=d);
      r.on('end',()=>res({status:r.statusCode, body, csp}));
    });
    req.on('timeout',()=>req.destroy(new Error('timeout')));
    req.on('error',e=>rej(e));
  });
}
(async()=>{
  console.log('=== korelyy.com 生产环境自检（3页 HTTP+HTML断言+响应头） ===\n');
  let allPass = true;
  for(const r of ROUTES){
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐',r.key,'→',r.url);
    let page; try{ page = await fetch(r.url); }catch(e){ console.log('  ❌ NETWORK ERROR:',e.message||e); allPass=false; continue; }
    console.log('  HTTP status :',page.status);
    console.log('  CSP header  :',cspReport[r.url].cspHeader);
    if(page.csp){
      const needDomains = [/pagead2\.googlesyndication\.com/,/googleads\.g\.doubleclick\.net/,/googleadservices\.com/];
      const hit = needDomains.filter(d=>d.test(page.csp));
      console.log('  CSP AdSense domains hit:',hit.length+'/'+needDomains.length, hit.map(x=>x.toString().slice(1,-1)).join(', '));
      if(hit.length<needDomains.length) allPass=false;
    }
    if(page.status!==200){ console.log('  ❌ HTTP非200，终止断言'); allPass=false; continue; }
    let pagePass=true;
    for(const a of r.asserts){
      const ok = a.negate? !a.rx.test(page.body) : a.rx.test(page.body);
      const tag = (a.tag||a.desc) + (a.negate?' [反向断言]':'');
      console.log('  ',ok?'✅':'❌', tag, ok?'':'（实际HTML匹配到'+(a.negate?'非法':'期望')+'片段）');
      if(!ok){ console.log('      Sample match preview:',(page.body.match(a.rx)||['<no-match>'])[0].toString().slice(0,120)); pagePass=false; allPass=false; }
    }
    console.log('  → 本页断言结果:',pagePass?'✅ PASS':'❌ FAIL');
  }
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('最终总体结论：',allPass?'✅ 全部通过 ❗':'❌ 存在失败项 ⚠️');
  process.exit(allPass?0:1);
})();
