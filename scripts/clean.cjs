// scripts/clean.cjs — drop .next and out using Node filesystem (bypasses shell quirks)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
function rm(p) {
  const abs = path.join(ROOT, p);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { recursive: true, force: true, maxRetries: 3 });
    console.log('[clean] removed:', p);
  } else {
    console.log('[clean] not present:', p);
  }
}
rm('.next');
rm('out');
const mw = path.join(ROOT, 'middleware.ts');
const mwBak = path.join(ROOT, 'middleware.ts.bak');
if (fs.existsSync(mw)) {
  fs.renameSync(mw, mwBak);
  console.log('[clean] renamed middleware.ts -> .bak');
} else if (fs.existsSync(mwBak)) {
  console.log('[clean] middleware already backed up (as .bak)');
}
