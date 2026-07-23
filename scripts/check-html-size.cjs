const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

function checkPage(locale, pagePath) {
  const fullPath = path.join(outDir, locale, pagePath, 'index.html');
  if (!fs.existsSync(fullPath)) {
    console.log(`${locale}/${pagePath}: 文件不存在`);
    return;
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  const inlineSize = scripts.reduce((a, m) => a + m[1].length, 0);
  const next_fSize = scripts.filter(m => m[1].includes('__next_f')).reduce((a, m) => a + m[1].length, 0);
  console.log(`${locale}/${pagePath}: HTML=${(html.length/1024).toFixed(1)}KB, 内联脚本=${(inlineSize/1024).toFixed(1)}KB, __next_f=${(next_fSize/1024).toFixed(1)}KB`);
}

console.log('=== 优化后页面体积 ===\n');
checkPage('zh', '');
checkPage('en', '');
checkPage('ar', '');
checkPage('zh', 'tool/text-counter');
checkPage('zh', 'blog');
checkPage('zh', 'workflows');
