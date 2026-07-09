const https = require('https');
const CF_ACCOUNT_ID = 'vz4Ptyx9uKfOxoyGMh53LsiSYoVvAGzktgqj52y352bb84fc'.replace(/^cfut_/, '');
const CF_API_TOKEN  = 'qGAHPAS4jR7WubMle8StgFE1dAfJUbsk4PDOLa6P1e4c8a75'.replace(/^cfk_/, '');

function cf(method, path, body){
  const opts = {
    hostname:'api.cloudflare.com', method, path: '/client/v4'+path,
    headers: {
      'Authorization':'Bearer '+CF_API_TOKEN,
      'Content-Type':'application/json'
    }, timeout:60000
  };
  return new Promise((res,rej)=>{
    const req = https.request(opts, r=>{
      let d=''; r.setEncoding('utf8');
      r.on('data',c=>d+=c);
      r.on('end',()=>{
        try{ const j=JSON.parse(d); res(j); }catch(e){ res({httpStatus:r.statusCode, raw:d.slice(0,400)}); }
      });
    });
    req.on('error',e=>rej(e));
    req.on('timeout',()=>req.destroy(new Error('CF API timeout')));
    if(body) req.write(JSON.stringify(body));
    req.end();
  });
}
(async()=>{
  console.log('=== 步骤1: List Pages projects ===');
  const p = await cf('GET','/accounts/'+CF_ACCOUNT_ID+'/pages/projects');
  if(p.errors && p.errors.length){ console.log('❌ CF API auth errors:', JSON.stringify(p.errors)); console.log('  maybe token invalid. Trying list projects...'); return; }
  const projs = p.result||[];
  console.log('Pages projects count:', projs.length);
  for(const x of projs.slice(0,5)){
    console.log('  -',x.name,'| subdomain:',x.subdomain,'| repo:', (x.source&&x.source.config) ? (x.source.config.owner+'/'+x.source.config.repo_name) : '<none>','| sourceType:', x.source? x.source.type : '<none>');
    console.log('    latestDeploy:', x.latest_deployment? x.latest_deployment.status+' '+x.latest_deployment.environment : 'none');
  }
  if(!projs.length){ console.log('No pages projects found.'); return; }
  const projectName = projs.find(x=>x.subdomain && x.subdomain.toLowerCase().includes('korelyy'))?.name || projs[0].name;
  console.log('\n=== 步骤2: project =', projectName,'=> Trigger production deploy (从仓库主分支拉最新) ===');
  const path = '/accounts/'+CF_ACCOUNT_ID+'/pages/projects/'+encodeURIComponent(projectName)+'/deployments';
  const dep = await cf('POST', path, { branch:'main' });
  if(dep.success===true && dep.result){ console.log('✅ Deployment triggered:', dep.result.id,'| url:', dep.result.url||'','| status:', dep.result.status); }
  else if(dep.errors && dep.errors.length){ console.log('❌ Trigger errors:', JSON.stringify(dep.errors)); console.log('Trying list deployments first...');
    const list = await cf('GET', path+'?per_page=3');
    console.log('Last 3 deploys:', JSON.stringify((list.result||[]).map(d=>({id:d.id,status:d.status,branch:d.deployment_trigger?.metadata?.branch,created:d.created_on})),null,2));
  }
  else{ console.log('Response:', JSON.stringify(dep).slice(0,600)); }
})();
