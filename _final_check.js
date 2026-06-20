const fs = require('fs');

function scanDir(dir, prefix) {
  const result = [];
  let entries;
  try { entries = fs.readdirSync(dir); } catch(e) { return result; }
  entries.forEach(f => {
    const p = dir + '/' + f;
    const s = fs.statSync(p);
    if (f.startsWith('node_modules') || f.startsWith('.git') || f.startsWith('.next') || f.startsWith('public')) return;
    if (s.isDirectory()) {
      result.push(...scanDir(p, prefix + f + '/'));
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f === '001_init.sql') {
      const c = fs.readFileSync(p, 'utf8');
      const m = c.match(/[\u4e00-\u9fff]{3,}/g);
      if (m) result.push(prefix + f + ': [' + m.length + ']');
    }
  });
  return result;
}

const dir = 'D:/projects/PDF工具/src';
const all = scanDir(dir, '').concat(scanDir('D:/projects/PDF工具/supabase', 'supabase/'));
console.log(all.length + ' files with Chinese:');
all.forEach(x => console.log('  ' + x));
