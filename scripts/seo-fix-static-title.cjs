// Fix static routes where TITLE_SEGMENT already contains " | brand" causing double brand
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const targets = [
  ['about', 'About Us'],
  ['compliance', 'Compliance'],
  ['workflows', 'Workflows'],
  ['workflow/canvas', 'Canvas'],
  ['workflow/custom', 'Custom Workflow'],
];
const LOCALES = ['en', 'zh', 'es', 'hi', 'fr', 'ar'];
const NAME_MAP = {
  '/about': { en: 'About Us', zh: '关于我们', es: 'Sobre nosotros', hi: 'हमारे बारे में', fr: 'À propos', ar: 'من نحن' },
  '/compliance': { en: 'Compliance', zh: '合规透明', es: 'Cumplimiento', hi: 'अनुपालन', fr: 'Conformité', ar: 'الامتثال' },
  '/workflows': { en: 'Workflows', zh: '工作流', es: 'Flujos', hi: 'वर्कफ़्लो', fr: 'Workflows', ar: 'سير العمل' },
  '/workflow/canvas': { en: 'Canvas', zh: '画布', es: 'Lienzo', hi: 'कैनवास', fr: 'Canvas', ar: 'اللوحة' },
  '/workflow/custom': { en: 'Custom Workflow', zh: '自定义工作流', es: 'Personalizado', hi: 'कस्टम', fr: 'Personnalisé', ar: 'مخصص' },
};

let count = 0;
for (const [p] of targets) {
  for (const l of LOCALES) {
    const key = '/' + p;
    const pagePath = path.join(ROOT, 'app', l, p, 'page.tsx');
    if (!fs.existsSync(pagePath)) continue;
    const src = fs.readFileSync(pagePath, 'utf-8');
    const titleVal = NAME_MAP[key]?.[l] || targets.find((x) => x[0] === p)?.[1] || p;
    // Replace TITLE_SEGMENT = "anything-with-or-without-pipe"
    const newSrc = src.replace(
      /(const\s+TITLE_SEGMENT\s*=\s*")[^"\n]*(")/,
      (_m, pre, post) => `${pre}${titleVal}${post}`,
    );
    if (newSrc !== src) {
      fs.writeFileSync(pagePath, newSrc, 'utf-8');
      count++;
    }
  }
}
console.log(`[title-fix] Updated ${count} static route TITLE_SEGMENT entries`);
