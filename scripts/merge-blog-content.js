const fs = require('fs');
const path = require('path');

const blogDetailPath = path.join(__dirname, '../data/blog-detail.ts');
const newContentPath = path.join(__dirname, '../data/blog-content-new.json');

console.log('Reading blog-content-new.json...');
const newContent = JSON.parse(fs.readFileSync(newContentPath, 'utf8'));

console.log('Reading blog-detail.ts...');
let blogDetail = fs.readFileSync(blogDetailPath, 'utf8');

function expandLanguage(obj) {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(expandLanguage);
    }
    const result = {};
    for (const key of Object.keys(obj)) {
      if (key === 'type') {
        result[key] = obj[key];
      } else if (key === 'text' || key === 'sub') {
        result[key] = {
          en: obj[key].en || '',
          zh: obj[key].zh || obj[key].en || '',
          es: obj[key].en || '',
          fr: obj[key].en || '',
          hi: obj[key].en || '',
          ar: obj[key].en || ''
        };
      } else if (key === 'items') {
        result[key] = obj[key].map(item => ({
          en: item.en || '',
          zh: item.zh || item.en || '',
          es: item.en || '',
          fr: item.en || '',
          hi: item.en || '',
          ar: item.en || ''
        }));
      } else {
        result[key] = expandLanguage(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

console.log('Processing new blog content...');
const entries = [];
for (const [slug, content] of Object.entries(newContent)) {
  const expandedContent = content.map(block => expandLanguage(block));
  const jsonStr = JSON.stringify(expandedContent, null, 2);
  const tsStr = jsonStr.replace(/"([^"]+)":/g, (match, p1) => {
    if (['type', 'kind', 'link', 'lang'].includes(p1)) {
      return match;
    }
    return `${p1}:`;
  });
  const entry = `  "${slug}": ${tsStr}`;
  entries.push(entry);
}

const contentToAdd = ',\n' + entries.join(',\n');

const closingBracketIndex = blogDetail.lastIndexOf('};');
if (closingBracketIndex === -1) {
  console.error('Could not find closing bracket in blog-detail.ts');
  process.exit(1);
}

const newBlogDetail = blogDetail.slice(0, closingBracketIndex) + contentToAdd + '\n};';

console.log('Writing to blog-detail.ts...');
fs.writeFileSync(blogDetailPath, newBlogDetail, 'utf8');

console.log(`Successfully merged ${Object.keys(newContent).length} blog posts!`);
console.log(`Total blog posts in blog-detail.ts: ${Object.keys(newContent).length + 2}`);
