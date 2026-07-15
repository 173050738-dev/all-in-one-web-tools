const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'tools-detail.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newTools = {
  'task-breakdown': { relatedTools: [], signup: ['no-signup'] },
  'tone-changer': { relatedTools: [], signup: ['no-signup'] },
  'focus-timer': { relatedTools: [], signup: ['no-signup'] },
  'concept-explain': { relatedTools: [], signup: ['no-signup'] },
  'idea-to-action': { relatedTools: [], signup: ['no-signup'] },
  'time-estimator': { relatedTools: [], signup: ['no-signup'] },
};

Object.assign(data, newTools);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Added', Object.keys(newTools).length, 'new tools to tools-detail.json');
