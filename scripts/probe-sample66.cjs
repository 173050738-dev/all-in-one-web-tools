const http = require('http');
const LOCALES = ['en','zh','es','hi','fr','ar'];
const PATHS = ['','tools','blog','news','about','privacy','tool/password-generator','tool/json-formatter','blog/password-generator-security-myths-2026','blog/beginner-5x5-linear','news/weekly-issue-004'];
const routes = [];
for (const l of LOCALES) for (const p of PATHS) routes.push(p ? `/${l}/${p}/` : `/${l}/`);

let ok=0, fail=0, non200=0;
const failures = [];
function c(u){
  return new Promise(r=>{
    http.get(u,{timeout:90000,headers:{'Accept':'text/html','User-Agent':'samp66/1.0'}},res=>{
      res.resume();
      res.on('end',()=>{ const c=res.statusCode; if(c===200||c===304){ok++;}else{non200++;failures.push(`${c} ${u}`);} r();});
    }).on('timeout',function(){this.destroy(new Error('t/o'));}).on('error',e=>{fail++;failures.push(`ERR:${e.message||e} ${u}`);r();});
  });
}
(async()=>{
  let i=0;
  while(i<routes.length){const b=routes.slice(i,i+2);await Promise.all(b.map(r=>c('http://localhost:3100'+r)));i+=2;process.stdout.write('\r['+i+'/'+routes.length+'] ok='+ok+' non2xx='+non200+' fail='+fail+'     ');}
  console.log('\n=== Sample 66 routes (6x11) ===');
  console.log('  2xx :',ok);
  console.log('  !2xx:',non200);
  console.log('  err :',fail);
  if(failures.length){console.log('Failures:');for(const f of failures.slice(0,20))console.log(' ',f);}
  process.exit(non200+fail>0?1:0);
})();
