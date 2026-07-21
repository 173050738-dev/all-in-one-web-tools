﻿﻿﻿const fs = require('fs');

const filePath = 'D:/projects/工具独立站/components/ToolCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startPattern = '  const toolPath = tool.slug && isInternalTool(tool.slug)';
const endPattern = '  return (';

const startIndex = content.indexOf(startPattern);
const endIndex = content.indexOf(endPattern, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Pattern not found');
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newCode = '  const toolPath = tool.slug ? //tool/ : /;\\n';

const result = before + newCode + after;

fs.writeFileSync(filePath, result, 'utf8');
console.log('Done!');
