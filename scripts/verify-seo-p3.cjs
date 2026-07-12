const fs = require('fs');
const locales = ['en','zh','es','fr','hi','ar'];
const slugs = ['timestamp-converter','base64-tool'];
let ok = true;
for (const loc of locales) {
  try {
    const p = `public/locales/${loc}/translation.json`;
    const raw = fs.readFileSync(p, 'utf8');
    const json = JSON.parse(raw);
    for (const s of slugs) {
      const ns = json.tools && json.tools[s];
      if (!ns) { console.log(`[${loc}] ${s}: tools node missing`); ok=false; continue; }
      if (!ns.seo) { console.log(`[${loc}] ${s}: seo missing`); ok=false; continue; }
      const keys = ['intro','scenarios','tutorial','advantages','faqs'];
      for (const k of keys) {
        if (ns.seo[k] === undefined) { console.log(`[${loc}] ${s}.seo.${k} missing`); ok=false; }
      }
      if (!Array.isArray(ns.seo.scenarios) || ns.seo.scenarios.length !== 3) {
        console.log(`[${loc}] ${s}.scenarios 长度: ${ns.seo.scenarios ? ns.seo.scenarios.length : '缺失'}`); ok=false;
      }
      if (!Array.isArray(ns.seo.tutorial) || ns.seo.tutorial.length !== 4) {
        console.log(`[${loc}] ${s}.tutorial 长度: ${ns.seo.tutorial ? ns.seo.tutorial.length : '缺失'}`); ok=false;
      }
      if (!Array.isArray(ns.seo.advantages) || ns.seo.advantages.length !== 3) {
        console.log(`[${loc}] ${s}.advantages 长度: ${ns.seo.advantages ? ns.seo.advantages.length : '缺失'}`); ok=false;
      }
      if (!Array.isArray(ns.seo.faqs) || ns.seo.faqs.length !== 5) {
        console.log(`[${loc}] ${s}.faqs 长度: ${ns.seo.faqs ? ns.seo.faqs.length : '缺失'}`); ok=false;
      } else {
        ns.seo.faqs.forEach((f, i) => {
          if (!f || typeof f.q !== 'string' || typeof f.a !== 'string') {
            console.log(`[${loc}] ${s}.faqs[${i}] 缺少q/a`); ok=false;
          }
        });
      }
    }
    console.log(`[${loc}] OK (${slugs.length} tools)`);
  } catch (e) {
    console.error(`[${loc}] JSON.parse FAIL: ` + e.message);
    ok = false;
  }
}
console.log(ok ? 'All 6 locales × 2 tools PASS' : 'VALIDATION FAILED');
process.exit(ok ? 0 : 1);
