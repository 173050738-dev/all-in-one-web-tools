/* eslint-disable */
#!/usr/bin/env node
// ============================================================================
// scripts/add-tool-i18n.cjs
//
// 为单个工具生成 6 语言（zh/en/fr/es/hi/ar）名称和描述翻译，
// 并自动写入 public/locales/<locale>/translation.json 的 .tools 命名空间。
//
// 策略：
//   zh:            直接使用工具 data/tools.ts 中的 name / description（源文案）
//   en:            基于 slug 拆词 + english-tags.ts 生成 Name；描述用英语标准模板
//   fr / es / hi / ar:  基于「常用工具词词典」+「标准句型模板」组合翻译
//
// 幂等：
//   默认不覆盖已存在的翻译槽位（避免覆盖人工高质量翻译）。
//   加 --force 可强制覆盖指定工具的 6 语言 2 槽位全部重新生成。
//   加 --only <locale1,locale2> 只处理特定语言。
//
// 用法：
//   node scripts/add-tool-i18n.cjs <tool-id>
//   node scripts/add-tool-i18n.cjs regex-tester --force
//   node scripts/add-tool-i18n.cjs regex-tester --only en,fr
//   node scripts/add-tool-i18n.cjs regex-tester --dry-run   # 只打印不写入
// ============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS_TS = path.join(ROOT, 'data', 'tools.ts');
const EN_TAGS_TS = path.join(ROOT, 'data', 'english-tags.ts');
const LOCALES_DIR = path.join(ROOT, 'public', 'locales');
const KNOWN_LOCALES = ['zh', 'en', 'fr', 'es', 'hi', 'ar'];

// ============================================================================
// 常用工具名词典：英 -> 法/西/印/阿  （工具类常用词根，新增时可继续扩展）
// ============================================================================
const WORD_DICT = {
  Generator:  { fr: 'Générateur',    es: 'Generador',      hi: 'जनरेटर',      ar: 'مولد' },
  Générateur: { fr: 'Générateur',    es: 'Generador',      hi: 'जनरेटर',      ar: 'مولد' },
  Generador:  { fr: 'Générateur',    es: 'Generador',      hi: 'जनरेटर',      ar: 'مولد' },
  Password:   { fr: 'Mot de Passe',  es: 'Contraseña',     hi: 'पासवर्ड',     ar: 'كلمة المرور' },
  Calculateur:{ fr: 'Calculateur',   es: 'Calculadora',    hi: 'कैलकुलेटर',   ar: 'آلة حاسبة' },
  Calculator: { fr: 'Calculateur',   es: 'Calculadora',    hi: 'कैलकुलेटर',   ar: 'آلة حاسبة' },
  Calculadora:{ fr: 'Calculateur',   es: 'Calculadora',    hi: 'कैलकुलेटर',   ar: 'آلة حاسبة' },
  Converter:  { fr: 'Convertisseur', es: 'Convertidor',    hi: 'कनवर्टर',     ar: 'محول' },
  Convertisseur:{ fr: 'Convertisseur',es: 'Convertidor',   hi: 'कनवर्टर',     ar: 'محول' },
  Convertidor:{ fr: 'Convertisseur', es: 'Convertidor',    hi: 'कनवर्टर',     ar: 'محول' },
  Editor:     { fr: 'Éditeur',       es: 'Editor',         hi: 'संपादक',      ar: 'محرر' },
  Compressor: { fr: 'Compresseur',   es: 'Compresor',      hi: 'कम्प्रेसर',   ar: 'ضاغط' },
  Compresseur:{ fr: 'Compresseur',   es: 'Compresor',      hi: 'कम्प्रेसर',   ar: 'ضاغط' },
  Compresor:  { fr: 'Compresseur',   es: 'Compresor',      hi: 'कम्प्रेसर',   ar: 'ضاغط' },
  Maker:      { fr: 'Créateur',      es: 'Creador',        hi: 'निर्माता',    ar: 'صانع' },
  Creator:    { fr: 'Créateur',      es: 'Creador',        hi: 'निर्माता',    ar: 'صانع' },
  Créateur:   { fr: 'Créateur',      es: 'Creador',        hi: 'निर्माता',    ar: 'صانع' },
  Creador:    { fr: 'Créateur',      es: 'Creador',        hi: 'निर्माता',    ar: 'صانع' },
  Resizer:    { fr: 'Redimensionneur',es: 'Redimensionador',hi: 'आकार बदलने वाला',ar: 'مغير الحجم' },
  Merger:     { fr: 'Fusionneur',    es: 'Fusionador',     hi: 'विलयकर्ता',   ar: 'مدمج' },
  Splitter:   { fr: 'Séparateur',    es: 'Divisor',        hi: 'विभाजक',      ar: 'فاصل' },
  Separator:  { fr: 'Séparateur',    es: 'Divisor',        hi: 'विभाजक',      ar: 'فاصل' },
  Divisor:    { fr: 'Séparateur',    es: 'Divisor',        hi: 'विभाजक',      ar: 'فاصل' },
  Scanner:    { fr: 'Scanner',       es: 'Escáner',        hi: 'स्कैनर',      ar: 'ماسح ضوئي' },
  Escaner:    { fr: 'Scanner',       es: 'Escáner',        hi: 'स्कैनर',      ar: 'ماسح ضوئي' },
  Encoder:    { fr: 'Encodeur',      es: 'Codificador',    hi: 'एन्कोडर',     ar: 'مشفر' },
  Decoder:    { fr: 'Décodeur',      es: 'Decodificador',  hi: 'डिकोडर',      ar: 'فك تشفير' },
  Encryptor:  { fr: 'Chiffreur',     es: 'Cifrador',       hi: 'एन्क्रिप्टर', ar: 'مشفر' },
  Decryptor:  { fr: 'Déchiffreur',   es: 'Descifrador',    hi: 'डिक्रिप्टर',  ar: 'فك التشفير' },
  Tester:     { fr: 'Testeur',       es: 'Probador',       hi: 'परीक्षक',     ar: 'مختبر' },
  Testeur:    { fr: 'Testeur',       es: 'Probador',       hi: 'परीक्षक',     ar: 'مختبر' },
  Probador:   { fr: 'Testeur',       es: 'Probador',       hi: 'परीक्षक',     ar: 'مختبر' },
  Checker:    { fr: 'Vérificateur',  es: 'Comprobador',    hi: 'जाँचकर्ता',   ar: 'مدقق' },
  Validator:  { fr: 'Validateur',    es: 'Validador',      hi: 'सत्यापनकर्ता',ar: 'مدقق صحة' },
  Analyzer:   { fr: 'Analyseur',     es: 'Analizador',     hi: 'विश्लेषक',    ar: 'محلل' },
  Analyseur:  { fr: 'Analyseur',     es: 'Analizador',     hi: 'विश्लेषक',    ar: 'محلل' },
  Analizador: { fr: 'Analyseur',     es: 'Analizador',     hi: 'विश्लेषक',    ar: 'محلل' },
  Viewer:     { fr: 'Afficheur',     es: 'Visualizador',   hi: 'दर्शक',       ar: 'عارض' },
  Visualizer: { fr: 'Visualiseur',   es: 'Visualizador',   hi: 'विज़ुअलाइज़र',ar: 'عارض بصري' },
  Builder:    { fr: 'Générateur',    es: 'Generador',      hi: 'बिल्डर',      ar: 'منشئ' },
  Randomizer: { fr: 'Aléatoriseur',  es: 'Aleatorizador',  hi: 'यादृच्छिककर्ता',ar: 'عشوائي' },
  Picker:     { fr: 'Sélecteur',     es: 'Selector',       hi: 'चुनने वाला',  ar: 'محدد' },
  Selector:   { fr: 'Sélecteur',     es: 'Selector',       hi: 'चुनने वाला',  ar: 'محدد' },
  Wheel:      { fr: 'Roue',          es: 'Rueda',          hi: 'पहिया',       ar: 'دوار' },
  Timer:      { fr: 'Minuteur',      es: 'Temporizador',   hi: 'टाइमर',       ar: 'مؤقت' },
  Minuteur:   { fr: 'Minuteur',      es: 'Temporizador',   hi: 'टाइमर',       ar: 'مؤقت' },
  Temporizador:{ fr: 'Minuteur',     es: 'Temporizador',   hi: 'टाइमर',       ar: 'مؤقت' },
  Counter:    { fr: 'Compteur',      es: 'Contador',       hi: 'काउंटर',      ar: 'عداد' },
  Compteur:   { fr: 'Compteur',      es: 'Contador',       hi: 'काउंटर',      ar: 'عداد' },
  Contador:   { fr: 'Compteur',      es: 'Contador',       hi: 'काउंटर',      ar: 'عداد' },
  Preview:    { fr: 'Aperçu',        es: 'Vista Previa',   hi: 'पूर्वावलोकन', ar: 'معاينة' },
  Downloader: { fr: 'Téléchargeur',  es: 'Descargador',    hi: 'डाउनलोडर',    ar: 'منزّل' },
  Uploader:   { fr: 'Téléverseur',   es: 'Cargador',       hi: 'अपलोडर',      ar: 'رافع' },
  Reader:     { fr: 'Lecteur',       es: 'Lector',         hi: 'पाठक',        ar: 'قارئ' },
  Lecteur:    { fr: 'Lecteur',       es: 'Lector',         hi: 'पाठक',        ar: 'قارئ' },
  Lector:     { fr: 'Lecteur',       es: 'Lector',         hi: 'पाठक',        ar: 'قارئ' },
  Search:     { fr: 'Recherche',     es: 'Búsqueda',       hi: 'खोज',         ar: 'بحث' },
  Image:      { fr: 'Image',         es: 'Imagen',         hi: 'छवि',         ar: 'صورة' },
  Text:       { fr: 'Texte',         es: 'Texto',          hi: 'पाठ',         ar: 'نص' },
  PDF:        { fr: 'PDF',           es: 'PDF',            hi: 'PDF',         ar: 'PDF' },
  Video:      { fr: 'Vidéo',         es: 'Vídeo',          hi: 'वीडियो',      ar: 'فيديو' },
  Audio:      { fr: 'Audio',         es: 'Audio',          hi: 'ऑडियो',       ar: 'صوت' },
  Regex:      { fr: 'Regex',         es: 'Regex',          hi: 'Regex',       ar: 'Regex' },
  Regular:    { fr: 'Expression Régulière', es: 'Expresión Regular', hi: 'नियमित अभिव्यक्ति', ar: 'تعبير عادي' },
  Color:      { fr: 'Couleur',       es: 'Color',          hi: 'रंग',         ar: 'لون' },
  Couleur:    { fr: 'Couleur',       es: 'Color',          hi: 'रंग',         ar: 'لون' },
  Grid:       { fr: 'Grille',        es: 'Cuadrícula',     hi: 'ग्रिड',       ar: 'شبكة' },
  Case:       { fr: 'Casse',         es: 'Mayúsculas/Minúsculas', hi: 'केस', ar: 'حالة الأحرف' },
  URL:        { fr: 'URL',           es: 'URL',            hi: 'URL',         ar: 'رابط' },
  Base64:     { fr: 'Base64',        es: 'Base64',         hi: 'Base64',      ar: 'Base64' },
  UUID:       { fr: 'UUID',          es: 'UUID',           hi: 'UUID',        ar: 'UUID' },
  QR:         { fr: 'QR',            es: 'QR',             hi: 'QR',          ar: 'QR' },
  Code:       { fr: 'Code',          es: 'Código',         hi: 'कोड',         ar: 'كود' },
  Barcode:    { fr: 'Code-Barres',   es: 'Código de Barras', hi: 'बारकोड',    ar: 'الباركود' },
  Markdown:   { fr: 'Markdown',      es: 'Markdown',       hi: 'Markdown',    ar: 'Markdown' },
  Number:     { fr: 'Nombre',        es: 'Número',         hi: 'संख्या',      ar: 'رقم' },
  Background: { fr: 'Arrière-Plan',  es: 'Fondo',          hi: 'पृष्ठभूमि',   ar: 'خلفية' },
  Remover:    { fr: 'Dissolvant',    es: 'Removedor',      hi: 'हटाने वाला',  ar: 'مزيل' },
  Cutter:     { fr: 'Découpeur',     es: 'Cortador',       hi: 'कटर',         ar: 'قاطع' },
  Speech:     { fr: 'Parole',        es: 'Habla',          hi: 'भाषण',        ar: 'كلام' },
  Danmaku:    { fr: 'Danmaku',       es: 'Danmaku',        hi: 'डैनमाकू',     ar: 'دانماكو' },
  Led:        { fr: 'DEL',           es: 'LED',            hi: 'LED',         ar: 'LED' },
  Handheld:   { fr: 'Portable',      es: 'Portátil',       hi: 'हैंडहेल्ड',   ar: 'يدوي' },
  Mortgage:   { fr: 'Hypothèque',    es: 'Hipoteca',       hi: 'बंधक',        ar: 'رهن عقاري' },
  Decision:   { fr: 'Décision',      es: 'Decisión',       hi: 'निर्णय',      ar: 'قرار' },
  Countdown:  { fr: 'Compte à Rebours', es: 'Cuenta Atrás', hi: 'काउंटडाउन', ar: 'العد التنازلي' },
  Fortune:    { fr: 'Voyance',       es: 'Adivinación',    hi: 'भविष्यवाणी',  ar: 'حظ' },
  Sticks:     { fr: 'Bâtonnets',     es: 'Palitos',        hi: 'स्टिक्स',     ar: 'العصي' },
  Emoji:      { fr: 'Emoji',         es: 'Emoji',          hi: 'इमोजी',       ar: 'إيموجي' },
  Mixer:      { fr: 'Mixeur',        es: 'Mezclador',      hi: 'मिक्सर',      ar: 'خلاط' },
};

// ============================================================================
// 描述句型模板：英/法/西/印/阿（非 zh），用 <NAME> 和 <KW1>,<KW2>,<KW3> 占位符拼装
// ============================================================================
const DESC_TEMPLATES = {
  en: [
    'Online <NAME> tool with features: <KW1>, <KW2>, <KW3>. Works right in your browser — free, secure, and no install required.',
    'Free <NAME>: supports <KW1>, <KW2>, and more. 100% local processing on your device for maximum privacy.',
    '<NAME> online editor. Customize <KW1>, tune <KW2>, export instantly. Cross-device, no signup.',
  ],
  fr: [
    'Outil <NAME> en ligne avec fonctionnalités : <KW1>, <KW2>, <KW3>. Fonctionne directement dans votre navigateur — gratuit, sécurisé et aucune installation requise.',
    '<NAME> gratuit : prend en charge <KW1>, <KW2> et plus. Traitement 100% local sur votre appareil pour une confidentialité maximale.',
    'Éditeur <NAME> en ligne. Personnalisez <KW1>, ajustez <KW2>, exportez instantanément. Multi-appareils, aucune inscription.',
  ],
  es: [
    'Herramienta <NAME> en línea con funciones: <KW1>, <KW2>, <KW3>. Funciona directamente en tu navegador — gratis, seguro y sin necesidad de instalar nada.',
    '<NAME> gratuita: admite <KW1>, <KW2> y más. Procesamiento 100% local en tu dispositivo para máxima privacidad.',
    'Editor <NAME> en línea. Personaliza <KW1>, ajusta <KW2>, exporta al instante. Multiplataforma, sin registro.',
  ],
  hi: [
    'ऑनलाइन <NAME> टूल — फीचर्स: <KW1>, <KW2>, <KW3>. सीधे आपके ब्राउज़र में काम करता है — निःशुल्क, सुरक्षित और कोई इंस्टॉल नहीं चाहिए।',
    'निःशुल्क <NAME>: <KW1>, <KW2> और अधिक को सपोर्ट करता है। अधिकतम गोपनीयता के लिए आपके डिवाइस पर 100% लोकल प्रोसेसिंग।',
    'ऑनलाइन <NAME> एडिटर। <KW1> को कस्टमाइज़ करें, <KW2> को ट्यून करें, तुरंत एक्सपोर्ट करें। क्रॉस-डिवाइस, कोई साइनअप नहीं।',
  ],
  ar: [
    'أداة <NAME> عبر الإنترنت مع الميزات: <KW1> و <KW2> و <KW3>. تعمل مباشرة في متصفحك — مجانية وآمنة ولا تتطلب أي تثبيت.',
    '<NAME> مجاني: يدعم <KW1> و <KW2> والمزيد. معالجة محلية بالكامل على جهازك لضمان أقصى درجات الخصوصية.',
    'محرر <NAME> عبر الإنترنت. خصّص <KW1> واضبط <KW2> وصدر فورًا. يعمل على جميع الأجهزة بدون تسجيل.',
  ],
};

// ============================================================================
// CLI 参数解析
// ============================================================================
function parseArgs(argv) {
  const positional = [];
  let only = new Set(KNOWN_LOCALES);
  let force = false;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') force = true;
    else if (a === '--dry-run') dryRun = true;
    else if (a === '--only' && i + 1 < argv.length) {
      only = new Set(argv[++i].split(',').map(s => s.trim()).filter(Boolean));
    } else if (a.startsWith('--only=')) {
      only = new Set(a.slice('--only='.length).split(',').map(s => s.trim()).filter(Boolean));
    } else if (!a.startsWith('--')) {
      positional.push(a);
    }
  }
  return { toolId: positional[0], only, force, dryRun };
}

// ============================================================================
// data/tools.ts 解析：提取单工具元数据
// ============================================================================
function extractOneTool(content, targetId) {
  // 定位: id: 'xxx' 之后的平衡 {} 段
  const findMatchingBrace = (str, start) => {
    let depth = 0; let i = start;
    for (; i < str.length; i++) {
      const c = str[i];
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  };
  const reId = new RegExp(`\\bid:\\s*['"](${escapeReg(targetId)})['"]`, 'g');
  let m;
  while ((m = reId.exec(content)) !== null) {
    const openIdx = content.lastIndexOf('{', m.index);
    if (openIdx === -1) continue;
    const closeIdx = findMatchingBrace(content, openIdx);
    if (closeIdx === -1) continue;
    const block = content.slice(openIdx, closeIdx + 1);
    const slug = grabStr(block, 'slug');
    const name = grabStr(block, 'name');
    const description = grabStr(block, 'description');
    const tags = grabStrArr(block, 'tags');
    return { id: targetId, slug: slug || targetId, name, description, tags };
  }
  return null;
}
function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function grabStr(block, key) {
  const m = block.match(new RegExp(`\\b${key}:\\s*['"]([^'"\\n]*?)['"]`));
  return m ? m[1] : '';
}
function grabStrArr(block, key) {
  const m = block.match(new RegExp(`\\b${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  const items = [];
  const re = /['"]([^'"\n]*?)['"]/g;
  let it; while ((it = re.exec(m[1])) !== null) items.push(it[1]);
  return items;
}

// english-tags.ts: { id: ['kw1', 'kw2'] } 解析
function extractEnglishTags(content) {
  const map = {};
  const blockRe = /['"]([^'"]+)['"]\s*:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    const id = m[1];
    const kws = [];
    const kwRe = /['"]([^'"\n]*?)['"]/g;
    let k; while ((k = kwRe.exec(m[2])) !== null) kws.push(k[1]);
    map[id] = kws;
  }
  return map;
}

// ============================================================================
// 翻译生成核心逻辑
// ============================================================================
function slugToWords(slug) {
  return slug
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    // 去掉常见前缀词（gospinwheel, korelyy 等品牌前缀）
    .filter(w => !['gospinwheel', 'korelyy', 'kt', 'tool', 'tools', 'go'].includes(w.toLowerCase()));
}
function titleCase(words) {
  return words
    .map(w => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ');
}

// ============================================================================
// Tag → 工具名「名词」化：把动词形式（generate / compress 等）和小写词转成常见工具类名词（Generator / Compressor）
// 优先级：先查 WORD_DICT 的 key（大小写不敏感），再查下表动词→名词映射
// ============================================================================
const VERB_TO_NOUN = {
  generate: 'Generator', generates: 'Generator', generating: 'Generator',
  create: 'Creator', creates: 'Creator', created: 'Creator', making: 'Maker',
  make: 'Maker', makes: 'Maker', build: 'Builder', building: 'Builder',
  compute: 'Calculator', calculate: 'Calculator', calculating: 'Calculator',
  convert: 'Converter', converting: 'Converter', transform: 'Converter',
  edit: 'Editor', editing: 'Editor', modify: 'Editor',
  compress: 'Compressor', compressing: 'Compressor', zip: 'Compressor',
  encode: 'Encoder', encoding: 'Encoder', decode: 'Decoder', decoding: 'Decoder',
  encrypt: 'Encryptor', encrypting: 'Encryptor', decrypt: 'Decryptor', decrypting: 'Decryptor',
  scan: 'Scanner', scanning: 'Scanner',
  test: 'Tester', testing: 'Tester', check: 'Checker', checking: 'Checker',
  validate: 'Validator', validating: 'Validator', verify: 'Validator', verifying: 'Validator',
  analyze: 'Analyzer', analysing: 'Analyzer', analyzing: 'Analyzer',
  visualise: 'Visualizer', visualize: 'Visualizer', view: 'Viewer', viewing: 'Viewer',
  preview: 'Preview', resize: 'Resizer', resizing: 'Resizer',
  merge: 'Merger', merging: 'Merger', combine: 'Merger', split: 'Splitter', splitting: 'Splitter',
  separate: 'Separator', pick: 'Picker', picking: 'Picker', select: 'Selector', selecting: 'Selector',
  randomize: 'Randomizer', randomise: 'Randomizer', shuffle: 'Randomizer',
  count: 'Counter', counting: 'Counter', time: 'Timer', countdown: 'Countdown',
  search: 'Search', find: 'Search', read: 'Reader', reading: 'Reader',
  write: 'Editor', writing: 'Editor', type: 'Editor',
  upload: 'Uploader', uploading: 'Uploader', download: 'Downloader', downloading: 'Downloader',
  remove: 'Remover', removing: 'Remover', cut: 'Cutter', cutting: 'Cutter',
  compare: 'Analyzer', compare: 'Comparer', diff: 'Analyzer',
  format: 'Formatter', formatting: 'Formatter', beautify: 'Formatter',
  escape: 'Encoder', unescape: 'Decoder', parse: 'Parser', parsing: 'Parser',
  render: 'Renderer', rendering: 'Renderer', draw: 'Editor',
  predict: 'Predictor', predicting: 'Predictor', classify: 'Classifier',
  hash: 'Encoder', hashish: 'Encoder', checksum: 'Checker',
  export: 'Exporter', import: 'Importer', mix: 'Mixer', mixing: 'Mixer',
};

const TOOL_CLASS_NOUNS = new Set(Object.values(VERB_TO_NOUN));

function tagToNounWord(tag) {
  if (!tag) return '';
  const low = tag.toLowerCase();
  if (VERB_TO_NOUN[low]) return VERB_TO_NOUN[low];
  const titled = titleCase([tag]);
  if (WORD_DICT[titled]) return titled;
  return titled;
}

function isToolClassNoun(word) {
  if (!word) return false;
  if (TOOL_CLASS_NOUNS.has(word)) return true;
  // 常见工具类后缀：-er, -or, -tor, -sor, -eur, -ant, -ent, -ist, -al, -ment, -tion, -type ending words
  const suffixRe = /(er|or|tor|sor|eur|ant|ent|ist|ator|izer|iser)$/i;
  if (suffixRe.test(word) && WORD_DICT[word]) return true;
  return false;
}

function generateEnglishName(tool, enTags) {
  // 策略：
  //   - 遍历 enTags，找到第一个能判定为工具类名词（Generator/Calculator 等）的 tag → headNoun
  //     它之前的所有非工具类 tag 拼成 qualifier（Password / Color / Regex / Image ...）
  //   - 否则退回：slug 末尾词若能转成工具类名词则 headNoun，前面词做 qualifier
  let headNoun = '';
  let qualifier = '';
  if (enTags && enTags.length > 0) {
    let headIdx = -1;
    for (let i = 0; i < enTags.length; i++) {
      const candidate = tagToNounWord(enTags[i]);
      if (isToolClassNoun(candidate)) {
        headNoun = candidate;
        headIdx = i;
        break;
      }
    }
    // 没找到 → 再用 slug 末尾词找
    if (!headNoun) {
      const slugWords = slugToWords(tool.slug);
      for (let i = slugWords.length - 1; i >= 0 && !headNoun; i--) {
        const cand = tagToNounWord(slugWords[i]);
        if (isToolClassNoun(cand)) { headNoun = cand; }
      }
    }
    // 拼接 qualifier：enTags[0..headIdx-1] 中「非工具类」的词，或者 slug 前半段
    const qualPool = [];
    if (headIdx > 0) {
      for (let i = 0; i < headIdx; i++) qualPool.push(tagToNounWord(enTags[i]));
    } else if (enTags.length) {
      for (let i = 0; i < enTags.length; i++) {
        const w = tagToNounWord(enTags[i]);
        if (!isToolClassNoun(w)) qualPool.push(w);
      }
      if (!qualPool.length) {
        const slugWords = slugToWords(tool.slug).slice(0, -1);
        for (const w of slugWords) qualPool.push(titleCase([w]));
      }
    }
    qualifier = Array.from(new Set(qualPool.filter(Boolean))).slice(0, 2).join(' ');
  }
  if (!headNoun) {
    const slugWords = slugToWords(tool.slug);
    const last = slugWords.length ? titleCase([slugWords[slugWords.length - 1]]) : '';
    headNoun = tagToNounWord(last) || last || titleCase([tool.id]);
    qualifier = titleCase(slugWords.slice(0, -1));
  }
  if (qualifier && qualifier.toLowerCase() === headNoun.toLowerCase()) qualifier = '';
  const parts = [qualifier, headNoun].filter(Boolean);
  const name = parts.join(' ').trim();
  return name.length >= 3 ? name : (titleCase(slugToWords(tool.slug)) || titleCase([tool.id]));
}

function translateWordToLocale(englishWord, locale) {
  const entry = WORD_DICT[englishWord];
  if (entry && entry[locale]) return entry[locale];
  return englishWord;
}

function translateEnName(enName, locale) {
  if (locale === 'zh') return enName;
  // 按空格/非字母断词后查词典，没有的保留原词
  const tokens = enName.split(/(\s+|[-\/])/);
  let out = '';
  for (const tok of tokens) {
    if (/^[\s\-\/]+$/.test(tok)) { out += tok; continue; }
    if (!tok) continue;
    const head = tok[0].toUpperCase() + tok.slice(1);
    const tr = translateWordToLocale(head, locale);
    if (locale === 'fr' && tr) {
      out += (tr[0] || '').toUpperCase() + tr.slice(1);
    } else if (locale === 'es' && tr) {
      out += (tr[0] || '').toUpperCase() + tr.slice(1);
    } else if (locale === 'hi' && tr) {
      out += tr;
    } else if (locale === 'ar' && tr) {
      out += tr;
    } else {
      out += tr || tok;
    }
    out += ' ';
  }
  const cleaned = out.replace(/\s+/g, ' ').trim();
  return cleaned || enName;
}

function pickDescription(tool, locale, enName, enTags) {
  const kws = []
    .concat(enTags || [])
    .concat(slugToWords(tool.slug))
    .concat(tool.tags || [])
    .slice(0, 3);
  while (kws.length < 3) kws.push(kws[kws.length - 1] || 'customization');
  const KW1 = (locale === 'en') ? (kws[0] || '') : translateWordToLocale(titleCase([kws[0] || 'customization']), locale);
  const KW2 = (locale === 'en') ? (kws[1] || kws[0] || '') : translateWordToLocale(titleCase([kws[1] || kws[0] || 'customization']), locale);
  const KW3 = (locale === 'en') ? (kws[2] || kws[1] || '') : translateWordToLocale(titleCase([kws[2] || kws[1] || 'flexibility']), locale);
  const tplArr = DESC_TEMPLATES[locale] || DESC_TEMPLATES.en;
  const nameKW = locale === 'en' ? enName : translateEnName(enName, locale);
  const tpl = tplArr[Math.abs(hashStr(tool.id + locale)) % tplArr.length];
  return tpl
    .replace(/<NAME>/g, nameKW)
    .replace(/<KW1>/g, KW1 || nameKW)
    .replace(/<KW2>/g, KW2 || nameKW)
    .replace(/<KW3>/g, KW3 || nameKW)
    .replace(/\s+/g, ' ')
    .trim();
}
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); }

function generateAllLocales(tool, enTagsArr, onlySet) {
  const enName = generateEnglishName(tool, enTagsArr);
  const out = {};
  for (const locale of KNOWN_LOCALES) {
    if (!onlySet.has(locale)) continue;
    let name, description;
    if (locale === 'zh') {
      name = tool.name;
      description = tool.description;
    } else {
      name = locale === 'en' ? enName : translateEnName(enName, locale);
      description = pickDescription(tool, locale, enName, enTagsArr);
    }
    out[locale] = { name, description };
  }
  return out;
}

// ============================================================================
// 写入 translation.json（2 空格缩进 JSON，保持原结构其余不动）
// ============================================================================
function readLocaleJSON(locale) {
  return JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, locale, 'translation.json'), 'utf8'),
  );
}
function writeLocaleJSON(locale, obj) {
  fs.writeFileSync(
    path.join(LOCALES_DIR, locale, 'translation.json'),
    JSON.stringify(obj, null, 2) + '\n',
    'utf8',
  );
}

function applyTranslations(toolId, localeTrans, force) {
  const summary = {};
  for (const locale of Object.keys(localeTrans)) {
    const data = readLocaleJSON(locale);
    if (!data.tools || typeof data.tools !== 'object') data.tools = {};
    const existing = data.tools[toolId] || {};
    const next = { ...existing };
    const actions = { locale, added: 0, skipped: 0, overwritten: 0 };
    for (const slot of ['name', 'description']) {
      const hasExisting = typeof existing[slot] === 'string' && existing[slot].trim().length > 0;
      if (!hasExisting || force) {
        if (hasExisting && force) actions.overwritten++;
        else actions.added++;
        next[slot] = localeTrans[locale][slot];
      } else {
        actions.skipped++;
      }
    }
    data.tools[toolId] = next;
    writeLocaleJSON(locale, data);
    summary[locale] = actions;
  }
  return summary;
}

// ============================================================================
// main
// ============================================================================
function main() {
  const { toolId, only, force, dryRun } = parseArgs(process.argv.slice(2));
  if (!toolId) {
    console.error('USAGE: node scripts/add-tool-i18n.cjs <tool-id> [--force] [--dry-run] [--only en,zh,fr]');
    console.error('');
    console.error('  <tool-id>       对应 data/tools.ts 中的 id 字段');
    console.error('  --force         即使某槽位已有翻译也强制覆盖');
    console.error('  --dry-run       只打印生成结果，不写入文件');
    console.error('  --only x,y,z    只处理指定语言（zh/en/fr/es/hi/ar）');
    process.exit(2);
  }
  for (const l of Array.from(only)) if (!KNOWN_LOCALES.includes(l)) {
    console.error(`ERROR: 未知语言 [${l}]，可选: ${KNOWN_LOCALES.join(', ')}`);
    process.exit(2);
  }

  if (!fs.existsSync(TOOLS_TS)) {
    console.error('ERROR: data/tools.ts 未找到');
    process.exit(2);
  }
  const tool = extractOneTool(fs.readFileSync(TOOLS_TS, 'utf8'), toolId);
  if (!tool) {
    console.error(`ERROR: 在 data/tools.ts 中未找到工具 id="${toolId}"，请确认已在 tools 数组中添加。`);
    process.exit(3);
  }
  if (!tool.name || !tool.description) {
    console.error(`ERROR: 工具 [${toolId}] 缺少 name / description 中文字段，无法生成 zh 翻译。`);
    process.exit(3);
  }

  let enTags = [];
  try {
    enTags = extractEnglishTags(fs.readFileSync(EN_TAGS_TS, 'utf8'))[toolId] || [];
  } catch {
    enTags = [];
  }

  const localeTrans = generateAllLocales(tool, enTags, only);
  console.log(`\n[add-tool-i18n] 工具: ${toolId}`);
  console.log(`                    slug: ${tool.slug}`);
  console.log(`                    中文名称: ${tool.name}`);
  console.log(`                    english-tags: [${enTags.join(', ')}]`);
  console.log(`\n[add-tool-i18n] 预览翻译结果:`);
  for (const locale of Object.keys(localeTrans)) {
    const tr = localeTrans[locale];
    console.log(`  [${locale.padEnd(4)}] name=${tr.name}`);
    console.log(`         desc=${tr.description}`);
  }
  if (dryRun) {
    console.log('\n[add-tool-i18n] --dry-run 模式，未写入文件。');
    process.exit(0);
  }
  const summary = applyTranslations(toolId, localeTrans, force);
  console.log('\n[add-tool-i18n] 写入统计:');
  for (const locale of Object.keys(summary)) {
    const a = summary[locale];
    console.log(
      `  [${locale.padEnd(4)}] added=${a.added}  overwritten=${a.overwritten}  kept-existing=${a.skipped}`,
    );
  }
  console.log('\n✅ 完成！建议运行校验脚本：');
  console.log('   node scripts/verify-6-lang-coverage.cjs\n');
}
main();
