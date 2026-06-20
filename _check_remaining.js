const fs = require('fs');
const files = [
  'app/register/page.tsx',
  'app/dashboard/page.tsx',
  'components/Navbar.tsx',
  'app/tools/compress/page.tsx',
  'app/tools/merge/page.tsx',
  'app/tools/split/page.tsx',
  'app/tools/rename/page.tsx',
  'app/tools/to-word/page.tsx',
  'app/pricing/page.tsx'
];
files.forEach(f => {
  const p = 'D:/projects/PDF工具/src/' + f;
  if (!fs.existsSync(p)) { console.log(f + ': NOT FOUND'); return; }
  const c = fs.readFileSync(p, 'utf8');
  const m = c.match(/[\u4e00-\u9fff]{3,}/g);
  console.log(f + ': ' + (m ? '[' + m.length + '] ' + m.join(', ') : 'CLEAN'));
});