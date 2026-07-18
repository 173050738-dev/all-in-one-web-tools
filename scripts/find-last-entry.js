const fs = require('fs');
const content = fs.readFileSync('data/blog-detail.ts', 'utf8');
const searchStr = '"future-of-ai-content-creation-2026-trends": [';
const idx = content.lastIndexOf(searchStr);
console.log('Found at:', idx);
console.log('Context:', content.substring(idx, Math.min(idx + 300, content.length)));
