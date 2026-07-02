'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Sparkles,
  ArrowRightLeft,
  FileDown,
  FileSearch,
} from 'lucide-react';

interface MarkdownPlatformConverterProps {
  locale?: string;
}

type PlatformKey = 'md' | 'gzh' | 'xhs' | 'zhihu' | 'bili';

const PLATFORMS: { key: PlatformKey; icon: string }[] = [
  { key: 'md', icon: 'MD' },
  { key: 'gzh', icon: '公' },
  { key: 'xhs', icon: '书' },
  { key: 'zhihu', icon: '知' },
  { key: 'bili', icon: 'B' },
];

export default function MarkdownPlatformConverter({ locale = 'zh' }: MarkdownPlatformConverterProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'title': '多平台 Markdown 互转工具',
      'subtitle': '公众号 / B 站专栏 / 知乎 / 小红书图文博主必备。支持标准 Markdown 与各大平台排版的双向互转，自动适配标题层级、空行、#标签、段落间距、代码块降级，一键复制。',
      'tip': '💡 提示：先在左侧选择「来源平台」粘贴原文，再在右侧选择「目标平台」实时看到转换结果。点击中间的 ⇄ 箭头可一键交换源与目标。常见用例：把知乎文章复制到小红书（自动追加 #标签、加大换行间距）、把公众号排版转为干净 Markdown 存储、把 B 站专栏搬运到知乎（修正引用/代码块格式）。',
      'features': '功能特点',
      'f1': '5 种平台双向互转：Markdown ↔ 公众号 ↔ 小红书 ↔ 知乎 ↔ B 站专栏，共 20 条转换路径',
      'f2': '自动识别并适配：标题层级 (# → emoji 或 加粗大字)、有序/无序列表、引用块样式',
      'f3': '平台特有元素处理：小红书自动/手动 #标签、公众号空行间距、B站 「」 引号、知乎 @ 人物标签',
      'f4': '代码块/表格 智能降级：不支持富代码块的平台可自动转「文字说明 + 纯文本」或直接删除',
      'f5': '一键交换源/目标、复制结果、下载为 .md 文件，触摸按钮均 ≥ 44px 高度',
      'f6': '100% 浏览器端处理，内容从不上传；响应式设计 + 6 种语言 UI',
      'src.platform': '来源平台',
      'tgt.platform': '目标平台',
      'swap': '交换源与目标',
      'src.input': '在此粘贴来源内容',
      'result': '转换结果',
      'p.md': '标准 Markdown',
      'p.gzh': '微信公众号',
      'p.xhs': '小红书图文',
      'p.zhihu': '知乎',
      'p.bili': 'B 站专栏',
      'code.mode': '代码/表格处理策略',
      'code.keep': '保留为纯文本',
      'code.remove': '直接删除',
      'code.note': '转为文字说明（推荐用于小红书/公众号）',
      'xhs.tags': '小红书 #标签（空格/换行分隔，留空则自动提取关键词）',
      'xhs.maxTags': '最多追加标签数',
      'gzh.lineSpacing': '公众号段前段后空行',
      'gzh.lv0': '紧凑（0 空行）',
      'gzh.lv1': '标准（1 空行）',
      'gzh.lv2': '宽松（2 空行）',
      'action.copy': '复制转换结果',
      'action.copied': '已复制',
      'action.download': '下载 .md 文件',
      'action.sample': '🎯 加载示例（知乎 → 小红书）',
      'placeholder':
`# 为什么 2026 年我还在用 Markdown

## 一句话原因

> 它让我专注**内容本身**，而不是格式。

## 三大优点

1. 纯文本，Git 友好
2. 迁移零成本
3. 写作速度比 Word 快 3 倍

### 适用场景

- 技术博客
- 公众号排版
- 小红书图文脚本
- B 站专栏

\`\`\`js
// 核心：Write once, publish everywhere.
const content = "# hello";
publish(content, ['xhs', 'gzh', 'zhihu']);
\`\`\`

| 平台 | 支持 Markdown | 备注 |
| ---- | ------------- | ---- |
| 知乎 | ✅ 大部分 | 公式友好 |
| 公众号 | ❌ | 富文本粘贴 |
| 小红书 | ❌ | 用 #标签 引流 |`,
      'empty': '左侧粘贴内容后，这里实时显示转换结果。',
      'chars': '字',
      'lines': '行',
    },
    en: {
      'title': 'Cross-Platform Markdown Converter',
      'subtitle': 'For WeChat / Bilibili / Zhihu / Xiaohongshu creators. Two-way conversion between standard Markdown and major platforms. Headings, spacing, hashtags, code block downgrade auto-adapted, one-click copy.',
      'tip': '💡 Tip: Pick your source platform on the left, paste content, then pick a target platform on the right — results update live. Tap the ⇄ icon to swap source/target instantly. Common use cases: turn Zhihu posts into Xiaohongshu-ready text (with #tags & wide spacing), clean WeChat formatting into Markdown for storage, or port Bilibili columns to Zhihu.',
      'features': 'Features',
      'f1': '5 platforms, 2-way: Markdown ↔ WeChat ↔ Xiaohongshu ↔ Zhihu ↔ Bilibili, 20 conversion paths total',
      'f2': 'Auto-adapts: heading levels (# → emoji / bold), ordered & unordered lists, quote block styles',
      'f3': 'Platform specifics: Xiaohongshu #tags, WeChat paragraph spacing, Bilibili 「」 quotes, Zhihu @ mentions',
      'f4': 'Smart code/table downgrade: pure-text / remove / text-note modes for platforms without rich blocks',
      'f5': 'One-tap swap / copy / download .md, every touch button ≥ 44px',
      'f6': '100% in-browser, nothing uploaded. Responsive & 6-language UI.',
      'src.platform': 'Source',
      'tgt.platform': 'Target',
      'swap': 'Swap src / tgt',
      'src.input': 'Paste source content here',
      'result': 'Converted result',
      'p.md': 'Standard Markdown',
      'p.gzh': 'WeChat Public',
      'p.xhs': 'Xiaohongshu',
      'p.zhihu': 'Zhihu',
      'p.bili': 'Bilibili Column',
      'code.mode': 'Code / Table handling',
      'code.keep': 'Keep as plain text',
      'code.remove': 'Remove entirely',
      'code.note': 'Convert to text note (recommended for XHS/WeChat)',
      'xhs.tags': 'Xiaohongshu #tags (space/newline separated; empty = auto keywords)',
      'xhs.maxTags': 'Max #tags to append',
      'gzh.lineSpacing': 'WeChat blank-line spacing',
      'gzh.lv0': 'Compact (0 blank lines)',
      'gzh.lv1': 'Standard (1 blank line)',
      'gzh.lv2': 'Loose (2 blank lines)',
      'action.copy': 'Copy result',
      'action.copied': 'Copied',
      'action.download': 'Download .md',
      'action.sample': '🎯 Load sample (Zhihu → Xiaohongshu)',
      'placeholder':
`# Why I still use Markdown in 2026

## One-sentence reason

> Lets me focus on **content**, not formatting.

## Three perks

1. Plain text, Git-friendly
2. Zero migration cost
3. 3× faster writing than Word

### Good for

- Tech blogs
- WeChat layouts
- Xiaohongshu scripts
- Bilibili columns`,
      'empty': 'Paste content on the left — the converted result appears here.',
      'chars': ' chars',
      'lines': ' lines',
    },
    fr: {
      'title': 'Convertisseur Markdown Multi-Plateforme',
      'subtitle': 'Pour créateurs WeChat / Bilibili / Zhihu / Xiaohongshu. Conversion bidirectionnelle entre Markdown et plateformes. Titres, espaces, #tags, blocs de code auto-adaptés, copie en 1 clic.',
      'tip': '💡 Astuce : choisissez la source, collez, puis la cible. Cliquez sur ⇄ pour inverser. Cas d\'usage : Zhihu → Xiaohongshu (#tags + espaces), WeChat → Markdown propre, etc.',
      'features': 'Fonctionnalités',
      'f1': '5 plateformes bidirectionnelles : 20 combinaisons de conversion',
      'f2': 'Auto-adapte niveaux de titres, listes, citations',
      'f3': 'Détails plateformes : #tags Xiaohongshu, espaces WeChat, guillemets Bilibili « »',
      'f4': 'Code / tableaux : texte brut / suppression / note texte',
      'f5': 'Échange / copie / téléchargement .md, boutons ≥ 44px',
      'f6': '100% local, aucun envoi. Responsive + 6 langues.',
      'src.platform': 'Source',
      'tgt.platform': 'Cible',
      'swap': 'Inverser source/cible',
      'src.input': 'Collez le contenu source ici',
      'result': 'Résultat converti',
      'p.md': 'Markdown standard',
      'p.gzh': 'WeChat Public',
      'p.xhs': 'Xiaohongshu',
      'p.zhihu': 'Zhihu',
      'p.bili': 'Bilibili',
      'code.mode': 'Traitement code / tableaux',
      'code.keep': 'Garder texte brut',
      'code.remove': 'Supprimer',
      'code.note': 'Transformer en note (recommandé XHS/WeChat)',
      'xhs.tags': '#tags Xiaohongshu (espace/saut de ligne ; vide = auto)',
      'xhs.maxTags': 'Max #tags ajoutés',
      'gzh.lineSpacing': 'Espaces WeChat entre paragraphes',
      'gzh.lv0': 'Compact (0 lignes vides)',
      'gzh.lv1': 'Standard (1 ligne)',
      'gzh.lv2': 'Large (2 lignes)',
      'action.copy': 'Copier le résultat',
      'action.copied': 'Copié',
      'action.download': 'Télécharger .md',
      'action.sample': '🎯 Charger exemple (Zhihu → Xiaohongshu)',
      'placeholder': '# Titre\n\nParagraphe avec **gras**.\n\n1. Liste\n2. Liste',
      'empty': 'Collez du contenu à gauche, le résultat apparaît ici.',
      'chars': ' car.',
      'lines': ' lignes',
    },
    es: {
      'title': 'Convertidor Markdown Multiplataforma',
      'subtitle': 'Para creadores WeChat / Bilibili / Zhihu / Xiaohongshu. Conversión bidireccional entre Markdown estándar y plataformas. Títulos, espacios, #tags, bloques de código auto adaptados, copia en 1 clic.',
      'tip': '💡 Consejo: elige el origen, pega, luego el destino. Toca ⇄ para intercambiarlos. Casos comunes: Zhihu → Xiaohongshu (#tags + espacios), WeChat → Markdown limpio, etc.',
      'features': 'Características',
      'f1': '5 plataformas bidireccionales: 20 rutas de conversión',
      'f2': 'Auto-adapta niveles de título, listas, citas',
      'f3': 'Especificos: #tags Xiaohongshu, espaciado WeChat, comillas Bilibili « »',
      'f4': 'Código / tablas: texto plano / eliminar / nota',
      'f5': 'Intercambio / copia / descarga .md, botones ≥ 44px',
      'f6': '100% local, nada se sube. Responsive + 6 idiomas.',
      'src.platform': 'Origen',
      'tgt.platform': 'Destino',
      'swap': 'Intercambiar origen/destino',
      'src.input': 'Pega el contenido origen aquí',
      'result': 'Resultado convertido',
      'p.md': 'Markdown estándar',
      'p.gzh': 'WeChat Público',
      'p.xhs': 'Xiaohongshu',
      'p.zhihu': 'Zhihu',
      'p.bili': 'Bilibili',
      'code.mode': 'Manejo de código / tablas',
      'code.keep': 'Mantener texto plano',
      'code.remove': 'Eliminar',
      'code.note': 'Convertir en nota (recomendado XHS/WeChat)',
      'xhs.tags': '#tags Xiaohongshu (espacio/salto; vacío = auto)',
      'xhs.maxTags': 'Máx #tags a añadir',
      'gzh.lineSpacing': 'Espaciado entre párrafos WeChat',
      'gzh.lv0': 'Compacto (0 líneas)',
      'gzh.lv1': 'Estándar (1 línea)',
      'gzh.lv2': 'Amplio (2 líneas)',
      'action.copy': 'Copiar resultado',
      'action.copied': 'Copiado',
      'action.download': 'Descargar .md',
      'action.sample': '🎯 Cargar ejemplo (Zhihu → Xiaohongshu)',
      'placeholder': '# Título\n\nPárrafo con **negrita**.\n\n1. Lista\n2. Lista',
      'empty': 'Pega contenido a la izquierda, el resultado aparece aquí.',
      'chars': ' car.',
      'lines': ' líneas',
    },
    hi: {
      'title': 'मल्टी-प्लेटफ़ॉर्म मार्कडाउन कनवर्टर',
      'subtitle': 'WeChat / Bilibili / Zhihu / Xiaohongshu क्रिएटर्स के लिए। स्टैंडर्ड मार्कडाउन और प्लेटफ़ॉर्म के बीच दोतरफ़ा रूपांतरण। शीर्षक, स्पेसिंग, #टैग्स, कोड ब्लॉक ऑटो-अडैप्ट, 1 क्लिक में कॉपी।',
      'tip': '💡 सुझाव: बाएं स्रोत चुनें, पेस्ट करें, फिर दाएं लक्ष्य चुनें। ⇄ पर क्लिक करके स्रोत/लक्ष्य बदलें। सामान्य उपयोग: Zhihu → Xiaohongshu (#टैग्स + स्पेस), WeChat → साफ़ मार्कड़ौन, आदि।',
      'features': 'विशेषताएं',
      'f1': '5 प्लेटफ़ॉर्म दोतरफ़ा: 20 कन्वर्ज़न पाथ',
      'f2': 'ऑटो शीर्षक, सूचियाँ, उद्धरण शैलियाँ',
      'f3': 'प्लेटफ़ॉर्म विशिष्ट: #टैग XHS, WeChat स्पेसिंग, Bilibili उद्धरण',
      'f4': 'कोड/टेबल डाउनग्रेड: टेक्स्ट / हटाएँ / नोट',
      'f5': 'एक क्लिक में स्वैप / कॉपी / .md डाउनलोड, बटन ≥ 44px',
      'f6': '100% स्थानीय, कुछ भी अपलोड नहीं। रेस्पॉन्सिव + 6 भाषाएँ।',
      'src.platform': 'स्रोत',
      'tgt.platform': 'लक्ष्य',
      'swap': 'स्रोत/लक्ष्य बदलें',
      'src.input': 'यहाँ स्रोत सामग्री पेस्ट करें',
      'result': 'परिवर्तित परिणाम',
      'p.md': 'स्टैंडर्ड मार्कडाउन',
      'p.gzh': 'WeChat पब्लिक',
      'p.xhs': 'Xiaohongshu',
      'p.zhihu': 'Zhihu',
      'p.bili': 'Bilibili',
      'code.mode': 'कोड / टेबल हैंडलिंग',
      'code.keep': 'सादा टेक्स्ट रखें',
      'code.remove': 'हटाएँ',
      'code.note': 'टेक्स्ट नोट में बदलें (XHS/WeChat के लिए)',
      'xhs.tags': 'XHS #टैग्स (स्पेस/नई लाइन; खाली = ऑटो)',
      'xhs.maxTags': 'अधिकतम #टैग्स',
      'gzh.lineSpacing': 'WeChat अनुच्छेद बीच की रिक्त पंक्तियाँ',
      'gzh.lv0': 'संकुचित (0 रिक्त पंक्ति)',
      'gzh.lv1': 'मानक (1 पंक्ति)',
      'gzh.lv2': 'शिथिल (2 पंक्तियाँ)',
      'action.copy': 'परिणाम कॉपी करें',
      'action.copied': 'कॉपी हो गया',
      'action.download': '.md डाउनलोड करें',
      'action.sample': '🎯 उदाहरण लोड करें (Zhihu → Xiaohongshu)',
      'placeholder': '# शीर्षक\n\nसामान्य **बोल्ड**।\n\n1. सूची\n2. सूची',
      'empty': 'बाएं सामग्री पेस्ट करें, परिणाम यहां दिखाई देता है।',
      'chars': ' अक्षर',
      'lines': ' पंक्तियाँ',
    },
    ar: {
      'title': 'محول ماركداون متعدد المنصات',
      'subtitle': 'لمنشئي المحتوى على WeChat / Bilibili / Zhihu / Xiaohongshu. تحويل ثنائي الاتجاه بين ماركداون القياسي والمنصات. عناوين، مسافات، #وسوم، كود مُحسّن تلقائياً، نسخ بنقرة.',
      'tip': '💡 نصيحة: اختر المصدر على اليسار والصق، ثم اختر الوجهة على اليمين. اضغط ⇄ لتبديل المصدر والوجهة. حالات الاستخدام: Zhihu → Xiaohongshu (#وسوم + مسافات)، WeChat → ماركداون نظيف، إلخ.',
      'features': 'الميزات',
      'f1': '5 منصات ثنائية الاتجاه: 20 مسار تحويل',
      'f2': 'تكييف عناوين، قوائم، تنسيقات الاقتباسات',
      'f3': 'خصائص المنصات: #وسوم XHS، تباعد WeChat، علامات اقتباس Bilibili',
      'f4': 'تنزيل الكود/الجداول: نص عادي / إزالة / ملاحظة',
      'f5': 'تبديل / نسخ / تنزيل .md، أزرار ≥ 44px',
      'f6': 'محلي 100%، لا رفع. متجاوب + 6 لغات.',
      'src.platform': 'المصدر',
      'tgt.platform': 'الوجهة',
      'swap': 'تبديل مصدر/وجهة',
      'src.input': 'الصق محتوى المصدر هنا',
      'result': 'النتيجة المحوّلة',
      'p.md': 'ماركداون قياسي',
      'p.gzh': 'WeChat العام',
      'p.xhs': 'Xiaohongshu',
      'p.zhihu': 'Zhihu',
      'p.bili': 'Bilibili',
      'code.mode': 'معالجة الكود/الجداول',
      'code.keep': 'إبقاء كنص عادي',
      'code.remove': 'إزالة',
      'code.note': 'تحويل إلى ملاحظة (موصى به XHS/WeChat)',
      'xhs.tags': '#وسوم XHS (فراغ/سطر جديد؛ فارغ = تلقائي)',
      'xhs.maxTags': 'الحد الأقصى #وسوم',
      'gzh.lineSpacing': 'تباعد WeChat بين الفقرات',
      'gzh.lv0': 'مضغوط (0 أسطر فارغة)',
      'gzh.lv1': 'قياسي (1 سطر)',
      'gzh.lv2': 'رحب (2 أسطر)',
      'action.copy': 'نسخ النتيجة',
      'action.copied': 'تم النسخ',
      'action.download': 'تنزيل .md',
      'action.sample': '🎯 تحميل مثال (Zhihu → Xiaohongshu)',
      'placeholder': '# عنوان\n\nفقرة **عريضة**.\n\n1. قائمة\n2. قائمة',
      'empty': 'الصق محتوى في اليسار، تظهر النتيجة هنا.',
      'chars': ' حرف',
      'lines': ' أسطر',
    },
  };
  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)); });
      return str;
    };
  };
  const t = getT(locale);

  const [src, setSrc] = useState<PlatformKey>('md');
  const [tgt, setTgt] = useState<PlatformKey>('xhs');
  const [text, setText] = useState('');
  const [codeMode, setCodeMode] = useState<'keep' | 'remove' | 'note'>('note');
  const [xhsTags, setXhsTags] = useState('');
  const [xhsMax, setXhsMax] = useState(8);
  const [gzhSpace, setGzhSpace] = useState<0 | 1 | 2>(2);
  const [copied, setCopied] = useState(false);

  const HASH_RE = /^#{1,6}\s+/;
  const UL_RE = /^(\s*)[-*+]\s+/;
  const OL_RE = /^(\s*)\d+\.\s+/;
  const QUOTE_RE = /^>\s?/;

  /* ---------------- Convert helpers ---------------- */
  const stripMarkdownInline = (line: string) =>
    line
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, a, b) => (a === b ? a : `${a} (${b})`))
      .replace(/~~(.+?)~~/g, '$1');

  /* Parse: flatten blocks (code, table, quote, heading, list, para) */
  type Block =
    | { kind: 'h'; level: number; text: string }
    | { kind: 'ul'; indent: number; text: string }
    | { kind: 'ol'; indent: number; num: number; text: string }
    | { kind: 'q'; text: string }
    | { kind: 'code'; lang: string; body: string }
    | { kind: 'table'; rows: string[][] }
    | { kind: 'p'; text: string }
    | { kind: 'blank' };

  const parseToBlocks = (raw: string, source: PlatformKey): Block[] => {
    const srcText = source === 'md' ? raw : normaliseForeignToMd(raw, source);
    const lines = srcText.replace(/\r\n/g, '\n').split('\n');
    const blocks: Block[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { blocks.push({ kind: 'blank' }); i++; continue; }

      // fenced code block
      const fence = /^```(\w*)\s*$/.exec(line);
      if (fence) {
        const lang = fence[1] || '';
        const buf: string[] = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        blocks.push({ kind: 'code', lang, body: buf.join('\n') });
        continue;
      }

      // table detection: header + separator
      if (line.includes('|') && i + 1 < lines.length && /^[\s|:\-]+$/.test(lines[i + 1])) {
        const isSepRow = (s: string) => /^\s*\|?[\s|:\-]+\|?\s*$/.test(s);
        if (isSepRow(lines[i + 1])) {
          const parseRow = (s: string) =>
            s.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
          const rows: string[][] = [parseRow(line)];
          i += 2;
          while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
            rows.push(parseRow(lines[i]));
            i++;
          }
          blocks.push({ kind: 'table', rows });
          continue;
        }
      }

      const hMatch = /^(#{1,6})\s+(.*)$/.exec(line);
      if (hMatch) { blocks.push({ kind: 'h', level: hMatch[1].length, text: hMatch[2].trim() }); i++; continue; }

      const ulMatch = UL_RE.exec(line);
      if (ulMatch) {
        blocks.push({ kind: 'ul', indent: ulMatch[1].length, text: stripMarkdownInline(line.replace(UL_RE, '')) });
        i++; continue;
      }
      const olMatch = OL_RE.exec(line);
      if (olMatch) {
        const num = parseInt(/^(\s*)(\d+)\./.exec(line)?.[2] ?? '1', 10);
        blocks.push({ kind: 'ol', indent: olMatch[1].length, num, text: stripMarkdownInline(line.replace(OL_RE, '')) });
        i++; continue;
      }
      const qMatch = QUOTE_RE.exec(line);
      if (qMatch) {
        const buf: string[] = [];
        while (i < lines.length && QUOTE_RE.test(lines[i])) { buf.push(lines[i].replace(QUOTE_RE, '')); i++; }
        blocks.push({ kind: 'q', text: buf.join(' ').trim() });
        continue;
      }

      // paragraph: merge following non-blank non-special lines
      const buf: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim() &&
        !HASH_RE.test(lines[i]) &&
        !UL_RE.test(lines[i]) &&
        !OL_RE.test(lines[i]) &&
        !QUOTE_RE.test(lines[i]) &&
        !/^```/.test(lines[i])
      ) {
        buf.push(lines[i]); i++;
      }
      blocks.push({ kind: 'p', text: buf.join(' ') });
    }
    return blocks;
  };

  /* Convert foreign-platform text into a rough Markdown before
     block parsing. This handles "source=gzh/xhs/zhihu/bili". */
  const normaliseForeignToMd = (raw: string, from: PlatformKey): string => {
    if (from === 'md') return raw;
    let s = raw.replace(/\r\n/g, '\n');
    const lines = s.split('\n');
    const out: string[] = [];
    for (const line0 of lines) {
      let line = line0;
      // Xiaohongshu trailing #tags strip into note
      if (from === 'xhs') {
        // Strip leading #hashtag tokens at paragraph start? keep inline.
      }
      // Quote styles → "> "
      line = line.replace(/^「(.+?)」\s*$/, '> $1');
      line = line.replace(/^『(.+?)』\s*$/, '> $1');
      line = line.replace(/^“(.+?)”\s*$/, '> $1');
      // Bold replacements
      line = line.replace(/【(.+?)】/g, '**$1**');
      line = line.replace(/\u3000/g, ' ');
      // Zhihu @xxx → links kept as plain
      // Heuristic heading markers
      if (/^\s*(一|二|三|四|五|六|七|八|九|十)[、\.]\s*\S/.test(line)) line = '## ' + line;
      if (/^\s*Part\s*\d+[：:\-]\s*/i.test(line)) line = '## ' + line;
      if (/^\s*\d{1,2}[\.、]\s+\S/.test(line) && line.length < 60 && !OL_RE.test(line)) {
        line = line.replace(/^(\s*)(\d{1,2})[\.、]\s+/, '$1$2. ');
      }
      // Remove emoji-only "decorative lines" kept as blanks
      if (/^[\s✅🔥💡🎯🔴⚫🟠✨❤️💬📌👇]+$/.test(line) && line.trim().length < 10) {
        out.push('');
        continue;
      }
      out.push(line);
    }
    // Strip any Xiaohongshu tag block at the very end (lines of #tags)
    if (from === 'xhs') {
      let k = out.length - 1;
      while (k >= 0 && /^\s*#\S+(\s+#\S+)*\s*$/.test(out[k])) k--;
      if (k < out.length - 1) out.length = k + 1;
    }
    return out.join('\n');
  };

  /* Render blocks into the target platform format */
  const renderBlocks = (blocks: Block[], target: PlatformKey): string => {
    const paraGap = target === 'gzh' ? '\n'.repeat(gzhSpace + 1) :
                    target === 'xhs' ? '\n\n' :
                    target === 'bili' ? '\n\n' : '\n\n';
    const out: string[] = [];
    let olCounter = 0;

    for (const b of blocks) {
      switch (b.kind) {
        case 'blank': { out.push(''); break; }
        case 'h': {
          const txt = stripMarkdownInline(b.text);
          if (target === 'md' || target === 'zhihu') {
            out.push(`${'#'.repeat(Math.max(1, Math.min(6, b.level)))} ${txt}`);
          } else if (target === 'gzh') {
            if (b.level <= 1) out.push(`【${txt}】`);
            else if (b.level === 2) out.push(`◆ ${txt}`);
            else out.push(`・${txt}`);
          } else if (target === 'xhs') {
            const emoji = b.level <= 1 ? '💫' : b.level === 2 ? '✨' : '▪️';
            out.push(`${emoji} ${txt}`);
          } else if (target === 'bili') {
            if (b.level <= 1) out.push(`◉ ${txt}`);
            else out.push(`○ ${txt}`);
          }
          break;
        }
        case 'ul': {
          const txt = stripMarkdownInline(b.text);
          const indent = ''.padStart(Math.floor(b.indent / 2), target === 'md' ? '  ' : '  ');
          if (target === 'md' || target === 'zhihu') out.push(`${indent}- ${txt}`);
          else if (target === 'gzh') out.push(`${indent}· ${txt}`);
          else if (target === 'xhs') out.push(`${indent}▫️ ${txt}`);
          else if (target === 'bili') out.push(`${indent}• ${txt}`);
          break;
        }
        case 'ol': {
          olCounter++;
          const txt = stripMarkdownInline(b.text);
          if (target === 'md' || target === 'zhihu') out.push(`${olCounter}. ${txt}`);
          else if (target === 'gzh') out.push(`${olCounter}）${txt}`);
          else if (target === 'xhs') out.push(`${olCounter}️⃣ ${txt}`);
          else if (target === 'bili') out.push(`${olCounter}. ${txt}`);
          break;
        }
        case 'q': {
          const txt = stripMarkdownInline(b.text);
          if (target === 'md' || target === 'zhihu') out.push(`> ${txt}`);
          else if (target === 'bili') out.push(`「${txt}」`);
          else if (target === 'gzh') out.push(`『${txt}』`);
          else if (target === 'xhs') out.push(`💭 ${txt}`);
          break;
        }
        case 'code': {
          if (codeMode === 'remove') break;
          if (codeMode === 'note') {
            const note = target === 'xhs' ? '【代码片段】' : target === 'gzh' ? '▎代码片段：' : '[代码片段]';
            const plain = b.body.replace(/\n/g, target === 'xhs' ? ' ｜ ' : ' · ');
            if (target === 'md' || target === 'zhihu') {
              out.push(`${note}（建议复制后查看）：\n${b.body.split('\n').map((l) => '    ' + l).join('\n')}`);
            } else {
              out.push(`${note} ${plain}`);
            }
          } else {
            if (target === 'md' || target === 'zhihu') out.push('```' + (b.lang || '') + '\n' + b.body + '\n```');
            else out.push(b.body.split('\n').map((l) => `  ${l}`).join('\n'));
          }
          break;
        }
        case 'table': {
          if (codeMode === 'remove') break;
          const [header, ...rest] = b.rows;
          if (codeMode === 'note' || target !== 'md' && target !== 'zhihu') {
            if (target === 'xhs') out.push('📋 【表格说明】');
            else if (target === 'gzh') out.push('▎表格说明：');
            else out.push('[表格]');
            rest.forEach((row, i) => {
              const parts = row.map((c, j) => `${header[j] ?? ''}：${c}`).filter(Boolean);
              out.push(`${i + 1}. ${parts.join(' / ')}`);
            });
          } else {
            // md/zhihu standard table
            if (header) {
              out.push('| ' + header.join(' | ') + ' |');
              out.push('| ' + header.map(() => '---').join(' | ') + ' |');
            }
            rest.forEach((r) => out.push('| ' + r.join(' | ') + ' |'));
          }
          break;
        }
        case 'p': {
          out.push(stripMarkdownInline(b.text));
          olCounter = 0;
          break;
        }
      }
    }

    // Build final with spacing rules
    const joined = (() => {
      const compact: string[] = [];
      let blankCount = 0;
      // Collapse 2+ blanks into one, then apply gap
      for (const l of out) {
        if (l === '') { blankCount++; continue; }
        if (compact.length && blankCount > 0) compact.push('');
        compact.push(l);
        blankCount = 0;
      }
      return compact.join(paraGap);
    })();

    // Xiaohongshu: append #tags block
    if (target === 'xhs') {
      const userTags = xhsTags
        .split(/[\s,，]+/g)
        .map((s) => s.replace(/^#+/, '').trim())
        .filter(Boolean);
      let finalTags = userTags.length > 0 ? userTags : autoKeywordsFromBlocks(blocks);
      finalTags = finalTags.slice(0, Math.max(1, xhsMax));
      const tagBlock = finalTags.map((t) => `#${t}`).join(' ');
      if (tagBlock) {
        return joined + (joined.endsWith('\n') ? '' : '\n\n') + tagBlock;
      }
    }

    // WeChat soft-spacing tweaks
    if (target === 'gzh') {
      // Ensure each visual section has at least one newline, wrap final for readability
      return joined.replace(/\n{3,}/g, '\n\n');
    }
    return joined;
  };

  const autoKeywordsFromBlocks = (bs: Block[]): string[] => {
    const bag = new Map<string, number>();
    const push = (w: string) => {
      if (w.length < 2 || w.length > 10) return;
      if (/^(的|了|和|是|在|我|有|也|就|不|都|一|个|这|那|上|下|中|与|及|对|把|被|给|让|向|从|到|之|等)$/.test(w)) return;
      bag.set(w, (bag.get(w) || 0) + 1);
    };
    for (const b of bs) {
      if (b.kind === 'h' || b.kind === 'p' || b.kind === 'ul' || b.kind === 'ol' || b.kind === 'q') {
        const t = (b as { text: string }).text.replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, ' ');
        const zhWords = (t.match(/[\u4e00-\u9fa5]{2,4}/g) || []);
        zhWords.forEach(push);
        (t.match(/[A-Za-z][A-Za-z0-9]+/g) || []).forEach((w) => push(w.toLowerCase()));
      }
    }
    const arr = Array.from(bag.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w);
    return arr;
  };

  /* ---------------- End conversion logic ---------------- */

  const converted = useMemo(() => {
    if (!text.trim()) return '';
    try {
      const blocks = parseToBlocks(text, src);
      return renderBlocks(blocks, tgt);
    } catch {
      return t('empty');
    }
  }, [text, src, tgt, codeMode, xhsTags, xhsMax, gzhSpace, locale]);

  const charCount = converted.replace(/\s/g, '').length;
  const lineCount = converted ? converted.split('\n').length : 0;

  const swap = () => {
    const oldSrc = src, oldTgt = tgt;
    setSrc(oldTgt); setTgt(oldSrc);
    setText(converted);
  };

  const copyOut = async () => {
    try { await navigator.clipboard.writeText(converted); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = converted; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  const download = () => {
    const blob = new Blob([converted], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `korelyy-${src}-to-${tgt}.md`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const loadSample = () => {
    setSrc('md'); setTgt('xhs');
    setText(t('placeholder'));
    setCodeMode('note');
  };

  const pLabel = (k: PlatformKey) => t(`p.${k}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/25">
                <ArrowLeftRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Platform selector + swap */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t('src.platform')}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setSrc(p.key)}
                        className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border min-w-[80px] min-h-[40px] touch-manipulation transition-all ${
                          src === p.key
                            ? 'bg-sky-50 dark:bg-sky-900/25 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-200 shadow-sm'
                            : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-5 h-5 inline-flex items-center justify-center rounded bg-white/70 dark:bg-gray-800 text-[10px] font-black border border-gray-200 dark:border-gray-600 text-sky-700 dark:text-sky-300">{p.icon}</span>
                          {pLabel(p.key)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-center justify-center pt-5">
                  <button
                    type="button"
                    onClick={swap}
                    className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 hover:text-sky-600 hover:border-sky-300 transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
                    title={t('swap')}
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t('tgt.platform')}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setTgt(p.key)}
                        className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border min-w-[80px] min-h-[40px] touch-manipulation transition-all ${
                          tgt === p.key
                            ? 'bg-teal-50 dark:bg-teal-900/25 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-200 shadow-sm'
                            : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-5 h-5 inline-flex items-center justify-center rounded bg-white/70 dark:bg-gray-800 text-[10px] font-black border border-gray-200 dark:border-gray-600 text-teal-700 dark:text-teal-300">{p.icon}</span>
                          {pLabel(p.key)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile-only swap */}
              <div className="flex sm:hidden justify-center">
                <button
                  type="button"
                  onClick={swap}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 text-sm font-medium flex items-center gap-2 touch-manipulation min-h-[40px]"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  {t('swap')}
                </button>
              </div>

              {/* Left / Right text panes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      <FileSearch className="h-4 w-4 text-sky-500" />
                      {t('src.input')}
                    </label>
                    <button
                      type="button"
                      onClick={loadSample}
                      className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-200 border border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors min-h-[32px] touch-manipulation"
                    >
                      {t('action.sample')}
                    </button>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('placeholder')}
                    rows={14}
                    className="input-base w-full resize-y text-sm leading-relaxed min-h-[260px] touch-manipulation font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-500" />
                      {t('result')}
                    </label>
                    <div className="text-xs text-gray-500 dark:text-gray-400 tabular-nums flex items-center gap-2">
                      <span>{charCount}{t('chars')}</span>
                      <span className="opacity-60">·</span>
                      <span>{lineCount}{t('lines')}</span>
                    </div>
                  </div>
                  <textarea
                    value={converted}
                    readOnly
                    placeholder={t('empty')}
                    rows={14}
                    className="input-base w-full resize-y text-sm leading-relaxed min-h-[260px] bg-white/70 dark:bg-gray-900/40 touch-manipulation font-mono"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={copyOut}
                      disabled={!converted}
                      className="px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-1.5 min-h-[42px] touch-manipulation"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? t('action.copied') : t('action.copy')}
                    </button>
                    <button
                      type="button"
                      onClick={download}
                      disabled={!converted}
                      className="px-3.5 py-2.5 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-1.5 min-h-[42px] touch-manipulation"
                    >
                      <FileDown className="h-4 w-4" />
                      {t('action.download')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t('code.mode')}</h3>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { k: 'keep', label: t('code.keep') },
                      { k: 'remove', label: t('code.remove') },
                      { k: 'note', label: t('code.note') },
                    ] as const).map((o) => (
                      <button
                        key={o.k}
                        type="button"
                        onClick={() => setCodeMode(o.k)}
                        className={`px-2 py-2 rounded-lg text-[11px] sm:text-xs font-medium border transition-all min-h-[42px] touch-manipulation ${
                          codeMode === o.k
                            ? 'bg-teal-50 dark:bg-teal-900/25 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-200'
                            : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {tgt === 'xhs' ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Xiaohongshu</h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={xhsTags}
                        onChange={(e) => setXhsTags(e.target.value)}
                        placeholder={t('xhs.tags')}
                        className="input-base w-full h-9 text-sm touch-manipulation"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{t('xhs.maxTags')}</span>
                          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 tabular-nums">{xhsMax}</span>
                        </div>
                        <input
                          type="range" min={3} max={20} step={1}
                          value={xhsMax}
                          onChange={(e) => setXhsMax(parseInt(e.target.value))}
                          className="w-full accent-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : tgt === 'gzh' ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">WeChat</h3>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { k: 0, label: t('gzh.lv0') },
                        { k: 1, label: t('gzh.lv1') },
                        { k: 2, label: t('gzh.lv2') },
                      ] as const).map((o) => (
                        <button
                          key={o.k}
                          type="button"
                          onClick={() => setGzhSpace(o.k)}
                          className={`px-2 py-2 rounded-lg text-[11px] sm:text-xs font-medium border transition-all min-h-[42px] touch-manipulation ${
                            gzhSpace === o.k
                              ? 'bg-sky-50 dark:bg-sky-900/25 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-200'
                              : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 mt-0.5 text-teal-500 shrink-0" />
                    {locale === 'zh'
                      ? '当前目标平台无需额外参数，已自动应用其排版规则（标题符号、列表、引用样式等）。'
                      : 'No extra options for this target platform — styling rules applied automatically (bullets, quotes, headings).'}
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                <p className="text-xs sm:text-sm text-sky-700 dark:text-sky-200 leading-relaxed">{t('tip')}</p>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t('features')}</h3>
            <ul className="space-y-3">
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
