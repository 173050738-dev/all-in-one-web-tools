const https = require('https');
const KEYWORDS = ['创客贴','剪映','菲格玛','Product Hunt','Notion','Canva','Ray.so','DeepL','CodePen','Dribbble','Figma','Obsidian','Roam Research','Todoist','Forest','iLovePDF','SmallPDF','Coursera','Grammarly','Duolingo','Anki','Read.cv','Notion AI','Kami','LightPDF','Standard Resume','Canva Resume','Degreed','NetEase','JianWai'];
https.get('https://korelyy.com/zh/',{timeout:60000,headers:{'Accept':'text/html','User-Agent':'feature-check/1.0','Cache-Control':'no-cache'}},res=>{
  let body='';
  res.on('data',d=>body+=d.toString('utf8'));
  res.on('end',()=>{
    console.log('=== New-tools feature probes on live korelyy.com/zh/ ===');
    console.log('HTTP status :',res.statusCode);
    console.log('HTML length :',body.length);
    console.log('Title       :',(body.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'N/A');
    const found=[];const missing=[];
    for(const k of KEYWORDS){ if(body.includes(k)) found.push(k); else missing.push(k); }
    console.log('Hit new-tool keywords ('+found.length+'/'+KEYWORDS.length+') :',found.join(', '));
    if(missing.length) console.log('Not found (may not on page 1):',missing.join(', '));
    const internal = body.includes('正在开发中') && body.includes('密码生成器'); // old bug signature
    console.log('Old "in-dev placeholder" bug pattern (hit = NOT deployed yet):', !!internal);
    const arDateFix = /calendar:\s*['"]gregory['"]/; // from our fix
    console.log('AR-date-calendar-gregory fix (hit = deployed new build):', arDateFix.test(body));
    const adsByGoogle = /adsbygoogle\.js.*ca-pub-7235824755389632/;
    console.log('AdSense ca-pub script present (CSP fix deploy indicator):', adsByGoogle.test(body));
  });
}).on('error',e=>console.error('ERR:',e.message||e));
