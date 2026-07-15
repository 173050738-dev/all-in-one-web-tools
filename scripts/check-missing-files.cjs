const fs = require('fs');
const path = require('path');

const locales = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
const tools = ['task-breakdown', 'tone-changer', 'focus-timer', 'concept-explain', 'idea-to-action', 'time-estimator'];

let missing = [];

locales.forEach(locale => {
  tools.forEach(tool => {
    const pagePath = path.join(__dirname, '..', 'app', locale, 'tool', tool, 'page.tsx');
    const clientPath = path.join(__dirname, '..', 'app', locale, 'tool', tool, 'client.tsx');
    
    if (!fs.existsSync(pagePath)) {
      missing.push(`page.tsx: /${locale}/tool/${tool}/page.tsx`);
    }
    if (!fs.existsSync(clientPath)) {
      missing.push(`client.tsx: /${locale}/tool/${tool}/client.tsx`);
    }
  });
});

if (missing.length === 0) {
  console.log('All files are present!');
} else {
  console.log('Missing files:');
  missing.forEach(m => console.log('  -', m));
}
