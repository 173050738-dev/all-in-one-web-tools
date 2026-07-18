const fs = require('fs');
const path = require('path');

const blogDetailPath = path.join(__dirname, '../data/blog-detail.ts');
let content = fs.readFileSync(blogDetailPath, 'utf8');

const lines = content.split('\n');
let i = lines.length - 1;

while (i >= 0 && !lines[i].includes('};')) {
  i--;
}

const lastValidLine = i;
console.log('Found }; at line:', lastValidLine + 1);

const newContent = content.substring(0, content.lastIndexOf('};')) + '};';
fs.writeFileSync(blogDetailPath, newContent, 'utf8');
console.log('Fixed blog-detail.ts - removed malformed entries');
