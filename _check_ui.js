const fs = require('fs');
['app/register/page.tsx','app/dashboard/page.tsx','components/Navbar.tsx'].forEach(f => {
  const c = fs.readFileSync('D:/projects/PDF工具/src/' + f, 'utf8');
  const lines = c.split('\n');
  console.log('=== ' + f + ' ===');
  lines.forEach((l, i) => {
    if (/[\u4e00-\u9fff]{2,}/.test(l)) console.log((i+1) + ': ' + l.trim());
  });
});