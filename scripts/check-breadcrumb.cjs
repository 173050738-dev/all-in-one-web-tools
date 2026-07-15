const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'out', 'en', 'tool', 'password-generator', 'index.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const breadcrumbMatch = content.match(/"@type":"BreadcrumbList"[\s\S]*?"itemListElement":\s*\[([\s\S]*?)\]/);
if (breadcrumbMatch) {
  console.log('=== BreadcrumbList found ===');
  console.log(breadcrumbMatch[1]);
} else {
  console.log('BreadcrumbList not found');
}
