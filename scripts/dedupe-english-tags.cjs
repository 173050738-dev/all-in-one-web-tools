const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'english-tags.ts');
let src = fs.readFileSync(file, 'utf8');
const lines = src.split(/\r?\n/);
const seen = new Map(); // key -> line index kept
const dups = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^\s*"([^"]+)"\s*:\s*"([^"]*)",?\s*$/);
  if (!m) continue;
  const key = m[1];
  const val = m[2];
  if (seen.has(key)) {
    const firstIdx = seen.get(key);
    const firstLine = lines[firstIdx];
    const fm = firstLine.match(/^\s*"[^"]+"\s*:\s*"([^"]*)",?\s*$/);
    const firstVal = fm ? fm[1] : '';
    // Prefer the value that contains ASCII (english) and not pure CJK
    const isEnglish = (s) => /[A-Za-z]/.test(s) && !/[\u4e00-\u9fff]/.test(s);
    const keepSecond = !isEnglish(firstVal) && isEnglish(val);
    const dropIdx = keepSecond ? firstIdx : i;
    if (keepSecond) seen.set(key, i);
    dups.push({ key, first: firstIdx + 1, second: i + 1, firstVal, secondVal: val, dropIdx });
    lines[dropIdx] = '__DELETE_ME__';
  } else {
    seen.set(key, i);
  }
}
const newLines = lines.filter(l => l !== '__DELETE_ME__');
const after = newLines.length;
console.error('Duplicates found:', dups.length);
dups.forEach(d => console.error(`  [${d.key}] L${d.first}="${d.firstVal}" vs L${d.second}="${d.secondVal}" → drop L${d.dropIdx + 1}`));
fs.writeFileSync(file, newLines.join('\n'), 'utf8');
console.error('Wrote', after, 'lines (was', lines.length, ')');
