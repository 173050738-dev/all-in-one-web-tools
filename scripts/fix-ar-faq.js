const fs = require('fs');
const path = require('path');

const arFile = path.join(__dirname, '../public/locales/ar/translation.json');
let content = fs.readFileSync(arFile, 'utf8');

content = content.replace(/多张/g, 'عدة');

fs.writeFileSync(arFile, content, 'utf8');
console.log('Fixed Arabic FAQ');
