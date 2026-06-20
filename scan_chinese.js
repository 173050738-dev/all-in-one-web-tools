const fs = require('fs');
const path = require('path');
const results = [];

function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) scan(full);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (/[\u4e00-\u9fff]/.test(content)) results.push(full);
    }
  }
}

scan('D:/projects/PDF工具/src');
console.log(results.length + ' files with Chinese text:');
results.forEach(f => console.log(f));