const https = require('https');
async function full(u){
  return new Promise((res,rej)=>{
    const req=https.get(u,{timeout:60000,headers:{'Accept':'text/html','Cache-Control':'no-cache','User-Agent':'Korelyy-Diag/1.0'}},r=>{
      let body=''; r.setEncoding('utf8');
      const headers = JSON.parse(JSON.stringify(r.headers));
      r.on('data',d=>body+=d);
      r.on('end',()=>res({status:r.statusCode,headers,body}));
    });
    req.on('timeout',()=>req.destroy(new Error('timeout')));
    req.on('error',e=>rej(e));
  });
}
(async()=>{
  const r = await full('https://korelyy.com/zh/tool/password-generator/');
  console.log('=== HTTP /zh/tool/password-generator ===');
  console.log('Status:', r.status);
  console.log('CSP-full:', (r.headers['content-security-policy']||'').slice(0,900));
  console.log('CSP-report-only:', (r.headers['content-security-policy-report-only']||'').slice(0,300));
  const idx = r.body.indexOf('敬请期待');
  if(idx>=0){
    console.log('\n=== 命中"敬请期待"上下文（前后各200字符） ===');
    console.log(r.body.slice(Math.max(0,idx-220), idx+320));
  } else console.log('\n无敬请期待');
  const idx2 = r.body.indexOf('正在开发中');
  if(idx2>=0){
    console.log('\n=== 命中"正在开发中"上下文 ===');
    console.log(r.body.slice(Math.max(0,idx2-220), idx2+320));
  }
  const idx3 = r.body.indexOf('router.replace'); // 新修复代码特征
  console.log('\n新修复代码特征 router.replace:', idx3>=0?'FOUND ✅':'NOT FOUND ❌（使用旧代码）');
  const idx4 = r.body.indexOf('INTERNAL_TOOL_SLUGS');
  console.log('新白名单 INTERNAL_TOOL_SLUGS:', idx4>=0?'FOUND ✅':'NOT FOUND ❌（使用旧代码）');
  console.log('\n=== AdSense script presence ===');
  const s1 = r.body.indexOf('ca-pub-7235824755389632');
  console.log('ca-pub-7235824755389632:', s1>=0?'FOUND':'NOT FOUND');
  const s2 = r.body.indexOf('window.adsbygoogle');
  console.log('adsbygoogle init push:', s2>=0?'FOUND ✅':'NOT FOUND ❌（layout.tsx init脚本未注入）');
})();
