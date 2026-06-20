const fs = require('fs');

// compress line 189
const compress = fs.readFileSync('D:/projects/PDF工具/src/app/tools/compress/page.tsx', 'utf8').split('\n');
console.log('=== compress line 185-195 ===');
for (let i = 184; i < 195 && i < compress.length; i++) console.log((i+1) + ': ' + compress[i].trim());

// merge line 88
const merge = fs.readFileSync('D:/projects/PDF工具/src/app/tools/merge/page.tsx', 'utf8').split('\n');
console.log('\n=== merge line 85-95 ===');
for (let i = 84; i < 95 && i < merge.length; i++) console.log((i+1) + ': ' + merge[i].trim());

// rename line 117 and 230
const rename = fs.readFileSync('D:/projects/PDF工具/src/app/tools/rename/page.tsx', 'utf8').split('\n');
console.log('\n=== rename line 114-120 ===');
for (let i = 113; i < 120 && i < rename.length; i++) console.log((i+1) + ': ' + rename[i].trim());
console.log('\n=== rename line 227-233 ===');
for (let i = 226; i < 233 && i < rename.length; i++) console.log((i+1) + ': ' + rename[i].trim());
