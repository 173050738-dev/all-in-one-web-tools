const fs = require('fs');
const tools = ['compress','merge','split','rename','to-word'];
tools.forEach(t => {
  const c = fs.readFileSync(`D:/projects/PDF工具/src/app/tools/${t}/page.tsx`, 'utf8');
  const lines = c.split('\n');
  const re = /[\u4e00-\u9fff]{2,}/;
  let found = false;
  lines.forEach((l, i) => {
    if (re.test(l)) {
      // Check if it's in JSX context (between > and <) or a string literal
      const isJSX = />[^<]*[\u4e00-\u9fff]/.test(l) || /[\u4e00-\u9fff][^>]*</.test(l);
      const isString = /["'\`][^"'\`]*[\u4e00-\u9fff]/.test(l);
      if (isJSX || isString) {
        console.log(t + ': JSX/String at line ' + (i+1) + ': ' + l.trim());
        found = true;
      }
    }
  });
  if (!found) console.log(t + ': No JSX Chinese (comments only)');
});