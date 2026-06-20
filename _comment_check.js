const fs = require('fs');
const files = [
  'app/tools/compress/page.tsx',
  'app/tools/merge/page.tsx',
  'app/tools/rename/page.tsx'
];
files.forEach(f => {
  const c = fs.readFileSync('D:/projects/PDF工具/src/' + f, 'utf8');
  const lines = c.split('\n');
  console.log('=== ' + f + ' ===');
  let printLine = false;
  lines.forEach((l, i) => {
    if (/[\u4e00-\u9fff]{3,}/.test(l)) {
      // Show context: is it a comment?
      const trimmed = l.trim();
      const isComment = trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');
      console.log((i+1) + ': [' + (isComment ? 'COMMENT' : 'CODE') + '] ' + trimmed);
      printLine = true;
    }
  });
  if (!printLine) console.log('  CLEAN');
});