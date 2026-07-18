const fs = require('fs');
const content = fs.readFileSync('data/blog-detail.ts', 'utf8');
const regex = /"[^"]+": \[/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  console.log(count + ':', match[0]);
}
console.log('Total slugs:', count);
