const https = require('https');
https.get('https://korelyy.com/zh/',{headers:{'User-Agent':'csp-check/1.0','Cache-Control':'no-cache'}},r=>{
  let csp = r.headers['content-security-policy']||'';
  console.log('HTTP status:',r.statusCode);
  console.log('\n=== CSP Full Header (length='+csp.length+') ===\n');
  csp.split(';').map(s=>s.trim()).forEach(part=>{
    const match = part.match(/^([\w-]+-src|default-src|report-uri|report-to|upgrade-insecure-requests|block-all-mixed-content)\s*(.*)$/);
    if(match){
      console.log('  ['+match[1]+']');
      const need = {
        'script-src':['pagead2.googlesyndication.com','googleads.g.doubleclick.net','www.googleadservices.com'],
        'img-src':   ['pagead2.googlesyndication.com','googleads.g.doubleclick.net','www.googleadservices.com'],
        'connect-src':['pagead2.googlesyndication.com','googleads.g.doubleclick.net','www.googleadservices.com'],
        'frame-src':['googleads.g.doubleclick.net','tpc.googlesyndication.com']
      };
      if(need[match[1]]){
        for(const d of need[match[1]]){
          const hit = match[2].includes(d);
          console.log('    '+ (hit?'✅':'❌')+' '+d);
        }
      } else {
        console.log('    (',(match[2]||'').slice(0,80),match[2].length>80?'...':'',')');
      }
    } else if(part) console.log('  [META] '+part);
  });
}).on('error',e=>console.error('ERR:',e.message));
