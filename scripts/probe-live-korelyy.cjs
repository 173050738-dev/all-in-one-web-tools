const https = require('https');
const http = require('http');
const ROUTES = [
  'https://korelyy.com/zh/',
  'https://korelyy.com/en/',
  'https://korelyy.com/zh/tools/',
  'https://korelyy.com/zh/blog/',
  'https://korelyy.com/zh/tool/password-generator/',
  'https://korelyy.com/ar/blog/cadence-180-step-rate-training/'
];
let ok=0, fail=0, non200=0;
const failures = [];
function get(u){
  const lib = u.startsWith('https:') ? https : http;
  return new Promise(r=>{
    const req = lib.get(u,{timeout:60000,headers:{'Accept':'text/html','Cache-Control':'no-cache','User-Agent':'korelyy-post-deploy-check/1.0'}},res=>{
      let len=0; res.on('data',d=>len+=d.length);
      res.on('end',()=>{ const c=res.statusCode; if(c===200)ok++; else{non200++;failures.push(`${c} len=${len} ${u}`);} r();});
    });
    req.on('timeout',()=>{req.destroy(new Error('timeout'));});
    req.on('error',e=>{fail++;failures.push(`ERR:${e.message||e} ${u}`);r();});
  });
}
(async()=>{
  for(const u of ROUTES){ await get(u); process.stdout.write('\r ['+(ok+non200+fail)+'/'+ROUTES.length+'] ok='+ok+' !2xx='+non200+' err='+fail+'     '); }
  console.log('\n=== Live korelyy.com post-deploy HTTP check ===');
  console.log('  2xx :',ok);
  console.log('  !2xx:',non200);
  console.log('  err :',fail);
  if(failures.length){console.log('Failures:');for(const f of failures)console.log(' ',f);}
  process.exit(non200+fail>0?1:0);
})();
