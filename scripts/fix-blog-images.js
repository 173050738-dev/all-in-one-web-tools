const fs = require('fs');
const path = require('path');

const blogIndexPath = path.join(__dirname, '../data/blog-index.ts');
const blogDetailPath = path.join(__dirname, '../data/blog-detail.ts');

console.log('Reading blog-index.ts...');
let blogIndex = fs.readFileSync(blogIndexPath, 'utf8');

const invalidDomain = 'trae-api-cn.mchost.guru';
const validDomain = 'picsum.photos';

let count = 0;
blogIndex = blogIndex.replace(new RegExp(`"coverImage":\\s*"https://${invalidDomain}[^"]*"`, 'g'), (match) => {
  const slugMatch = match.match(/prompt=([^&]+)/);
  let seed = 1;
  if (slugMatch) {
    const prompt = slugMatch[1];
    seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
  }
  count++;
  return `"coverImage": "https://${validDomain}/800/450?random=${seed}&grayscale=false"`;
});

console.log(`Replaced ${count} invalid coverImage URLs in blog-index.ts`);

fs.writeFileSync(blogIndexPath, blogIndex, 'utf8');

console.log('Done!');
