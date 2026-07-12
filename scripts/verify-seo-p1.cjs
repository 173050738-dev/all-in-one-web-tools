const fs = require('fs');
const locales = ['en','zh','es','fr','hi','ar'];
const slugs = ['mortgage-calculator','text-to-speech'];
let ok = true;
for (const loc of locales) {
  try {
    const p = `public/locales/${loc}/translation.json`;
    const raw = fs.readFileSync(p, 'utf8');
    const json = JSON.parse(raw);
    for (const s of slugs) {
      const ns = json.tools && json.tools[s];
      if (!ns) {
        console.log(`[${loc}] ${s}: tools node missing`);
        ok = false;
        continue;
      }
      if (!ns.seo) {
        console.log(`[${loc}] ${s}: seo missing`);
        ok = false;
        continue;
      }
      const keys = ['intro','scenarios','tutorial','advantages','faqs'];
      for (const k of keys) {
        if (ns.seo[k] === undefined) {
          console.log(`[${loc}] ${s}.seo.${k} missing`);
          ok = false;
        }
      }
      if (!Array.isArray(ns.seo.faqs) || ns.seo.faqs.length !== 5) {
        console.log(`[${loc}] ${s}.faqs length: ${ns.seo.faqs ? ns.seo.faqs.length : 'missing'}`);
        ok = false;
      }
    }
    console.log(`[${loc}] OK`);
  } catch (e) {
    console.error(`[${loc}] JSON.parse FAIL: ` + e.message);
    ok = false;
  }
}
console.log(ok ? 'All 6 locales PASS' : 'VALIDATION FAILED');
process.exit(ok ? 0 : 1);
