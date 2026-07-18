const fs = require('fs');
const content = fs.readFileSync('data/blog-index.ts', 'utf8');
const lines = content.split('\n');
const lastIndex = lines.lastIndexOf('];');
console.log('Last ]; at line:', lastIndex + 1);
const count = content.split('"slug"').length - 1;
console.log('Total slugs:', count);
