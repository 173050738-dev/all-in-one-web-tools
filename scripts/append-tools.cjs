/* eslint-disable */
const fs = require('fs');
const toolsPath = 'd:\\projects\\工具独立站\\data\\tools.ts';
const appendPath = 'd:\\projects\\工具独立站\\scripts\\sports-append.txt';
let tools = fs.readFileSync(toolsPath, 'utf8');
const append = fs.readFileSync(appendPath, 'utf8');

const idx = tools.lastIndexOf('  },\n];');
if (idx === -1) {
  console.log('MARKER NOT FOUND');
  process.exit(1);
}

const head = tools.slice(0, idx + 5);
const tail = tools.slice(idx + 5);
const replaced = head + append + tail;
fs.writeFileSync(toolsPath, replaced, 'utf8');
console.log('Write OK, new length=' + replaced.length);
