'use client';

import { useState, useMemo, useRef } from 'react';
import { Check, Copy, Download } from 'lucide-react';

interface VerticalChineseGeneratorProps {
  locale?: string;
}

const i18n = {
  zh: { title:"竖排国风文案生成器", subtitle:"右→左竖排中文 + SVG透明图导出，小红书国风专用", input:"输入横排中文（每行一句/一段，按竖排从右到左排列）", demoSample:"加载示例：将进酒", demoPoem:"君不见黄河之水天上来\n奔流到海不复回\n君不见高堂明镜悲白发\n朝如青丝暮成雪\n人生得意须尽欢\n莫使金樽空对月", fontSize:"字号 (px)", fontSizeMin:18, fontSizeMax:64, lineGap:"字距 (字/行数)", lineGapMin:2, lineGapMax:32, colGap:"列距 (px)", colGapMin:8, colGapMax:120, flowerDeco:"花体装饰符号", decoNone:"无", deco1:"❀ 牡丹式", deco2:"❋ 梅菊式", deco3:"✿ 莲荷式", deco4:"❁ 兰竹式", strokeColor:"文字颜色 (深色)", bgColor:"SVG背景", bgTransparent:"透明", bgRice:"米白宣纸", bgInk:"墨黑背景", orientation:"竖排方向", rtl:"从右至左（传统）", ltr:"从左至右（现代）", outText:"竖排纯文本复制", outSvg:"下载 SVG 矢量图（透明背景可直接用）", outPng:"下载 PNG（可选）", preview:"预览区（真实竖排渲染）", copyText:"📋 复制竖排文本", downloadSvg:"⬇️ 下载 SVG", copyHtml:"📋 复制 HTML/CSS 代码", placeHolder:"每行一段，将从右至左排列，如：\n春眠不觉晓\n处处闻啼鸟\n夜来风雨声\n花落知多少" },
  en: { title:"Vertical Chinese Layout Generator", subtitle:"Right→Left vertical + SVG export", input:"Input horizontal Chinese, 1 line = 1 column", demoSample:"Load sample poem", demoPoem:"Line 1 sample text\nLine 2\nLine 3", fontSize:"Font size (px)", fontSizeMin:18, fontSizeMax:64, lineGap:"Line gap (chars)", lineGapMin:2, lineGapMax:32, colGap:"Column gap (px)", colGapMin:8, colGapMax:120, flowerDeco:"Decorative", decoNone:"None", deco1:"❀ Peony", deco2:"❋ Plum", deco3:"✿ Lotus", deco4:"❁ Orchid", strokeColor:"Text color", bgColor:"SVG bg", bgTransparent:"Transparent", bgRice:"Rice paper", bgInk:"Ink black", orientation:"Orientation", rtl:"Right→Left (trad.)", ltr:"Left→Right (modern)", outText:"Vertical plain text", outSvg:"Download SVG (transparent)", outPng:"Download PNG", preview:"Preview", copyText:"📋 Copy vertical text", downloadSvg:"⬇️ Download SVG", copyHtml:"📋 Copy HTML/CSS", placeHolder:"Each line = 1 column; renders R→L:\nLine one here\nLine two here" },
  hi: { title:"वर्टिकल चीनी लेआउट", subtitle:"दाएं→बाएं वर्टिकल + SVG निर्यात", input:"क्षैतिज चाइनीज डालें, 1 लाइन = 1 कॉलम", demoSample:"उदाहरण कविता लोड", demoPoem:"पंक्ति एक उदाहरण\nपंक्ति दो", fontSize:"फ़ॉन्ट साइज़", fontSizeMin:18, fontSizeMax:64, lineGap:"लाइन अंतर", lineGapMin:2, lineGapMax:32, colGap:"कॉलम अंतर", colGapMin:8, colGapMax:120, flowerDeco:"सजावट", decoNone:"नहीं", deco1:"❀ पियोनी", deco2:"❋ बेर", deco3:"✿ कमल", deco4:"❁ ऑर्किड", strokeColor:"टेक्स्ट रंग", bgColor:"SVG बैकग्राउंड", bgTransparent:"पारदर्शी", bgRice:"चावल कागज", bgInk:"स्याही काला", orientation:"दिशा", rtl:"दाएं→बाएं (परंपरा)", ltr:"बाएं→दाएं", outText:"वर्टिकल पाठ", outSvg:"SVG डाउनलोड", outPng:"PNG डाउनलोड", preview:"प्रीव्यू", copyText:"📋 कॉपी वर्टिकल", downloadSvg:"⬇️ SVG डाउनलोड", copyHtml:"📋 HTML/CSS कॉपी", placeHolder:"हर लाइन = एक कॉलम" },
  fr: { title:"Générateur Chinois Vertical", subtitle:"D→G vertical + export SVG", input:"Texte chinois, 1 ligne = 1 colonne", demoSample:"Charger poème exemple", demoPoem:"Ligne un exemple\nLigne deux", fontSize:"Taille police", fontSizeMin:18, fontSizeMax:64, lineGap:"Espacement lignes", lineGapMin:2, lineGapMax:32, colGap:"Espacement colonnes", colGapMin:8, colGapMax:120, flowerDeco:"Décoratif", decoNone:"Aucun", deco1:"❀ Pivoine", deco2:"❋ Prune", deco3:"✿ Lotus", deco4:"❁ Orchidée", strokeColor:"Couleur texte", bgColor:"Fond SVG", bgTransparent:"Transparent", bgRice:"Papier riz", bgInk:"Encre noire", orientation:"Orientation", rtl:"D→G (traditionnel)", ltr:"G→D", outText:"Texte vertical", outSvg:"Télécharger SVG", outPng:"Télécharger PNG", preview:"Aperçu", copyText:"📋 Copier texte", downloadSvg:"⬇️ Télécharger SVG", copyHtml:"📋 Copier HTML/CSS", placeHolder:"Chaque ligne = 1 colonne" },
  es: { title:"Generador Chino Vertical", subtitle:"D→I vertical + export SVG", input:"Texto chino horizontal", demoSample:"Cargar poema ejemplo", demoPoem:"Línea uno ejemplo\nLínea dos", fontSize:"Tamaño fuente", fontSizeMin:18, fontSizeMax:64, lineGap:"Espac. líneas", lineGapMin:2, lineGapMax:32, colGap:"Espac. columnas", colGapMin:8, colGapMax:120, flowerDeco:"Decorativo", decoNone:"Ninguno", deco1:"❀ Peonía", deco2:"❋ Ciruelo", deco3:"✿ Loto", deco4:"❁ Orquídea", strokeColor:"Color texto", bgColor:"Fondo SVG", bgTransparent:"Transparente", bgRice:"Papel de arroz", bgInk:"Tinta negra", orientation:"Orientación", rtl:"D→I (tradicional)", ltr:"I→D", outText:"Texto vertical", outSvg:"Descargar SVG", outPng:"Descargar PNG", preview:"Vista previa", copyText:"📋 Copiar texto", downloadSvg:"⬇️ Descargar SVG", copyHtml:"📋 Copiar HTML/CSS", placeHolder:"Cada línea = 1 columna" },
  ar: { title:"مولد النص الصيني العمودي", subtitle:"يمين→يسار عمودي + تصدير SVG", input:"النص الصيني الأفقي، كل سطر = عمود", demoSample:"تحميل قصيدة مثال", demoPoem:"سطر واحد مثال\nالسطر الثاني", fontSize:"حجم الخط", fontSizeMin:18, fontSizeMax:64, lineGap:"تباعد الأسطر", lineGapMin:2, lineGapMax:32, colGap:"تباعد الأعمدة", colGapMin:8, colGapMax:120, flowerDeco:"زخرفي", decoNone:"لا شيء", deco1:"❀ زنبق الماء", deco2:"❋ الخوخ", deco3:"✿ اللوتس", deco4:"❁ السحلبية", strokeColor:"لون النص", bgColor:"خلفية SVG", bgTransparent:"شفاف", bgRice:"ورق الأرز", bgInk:"حبر أسود", orientation:"الاتجاه", rtl:"يمين→يسار (تقليدي)", ltr:"يسار→يمين", outText:"نص عمودي", outSvg:"تنزيل SVG", outPng:"تنزيل PNG", preview:"المعاينة", copyText:"📋 نسخ النص", downloadSvg:"⬇️ تنزيل SVG", copyHtml:"📋 نسخ HTML/CSS", placeHolder:"كل سطر = عمود واحد" }
};

const DECO_SYMBOLS: Record<string, string> = {
  deco1: '❀',
  deco2: '❋',
  deco3: '✿',
  deco4: '❁',
};

const BG_OPTIONS = ['transparent', 'rice', 'ink'] as const;
type BgOption = typeof BG_OPTIONS[number];

const BG_FILL: Record<BgOption, string | null> = {
  transparent: null,
  rice: '#FBF5E6',
  ink: '#0A0A0A',
};

const DEFAULT_STROKE = '#1F2937';
const INK_STROKE = '#FFFFFF';

export default function VerticalChineseGenerator({ locale = 'zh' }: VerticalChineseGeneratorProps) {
  const t = (i18n as any)[locale] || (i18n as any).zh;

  const [inputText, setInputText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [lineGap, setLineGap] = useState(8);
  const [colGap, setColGap] = useState(40);
  const [flowerDeco, setFlowerDeco] = useState<'decoNone' | 'deco1' | 'deco2' | 'deco3' | 'deco4'>('decoNone');
  const [strokeColor, setStrokeColor] = useState(DEFAULT_STROKE);
  const [bgOption, setBgOption] = useState<BgOption>('transparent');
  const [orientation, setOrientation] = useState<'rtl' | 'ltr'>('rtl');
  const [copyTextState, setCopyTextState] = useState(false);
  const [copyHtmlState, setCopyHtmlState] = useState(false);

  const lines = useMemo(() => inputText.split('\n').filter(l => l.trim().length > 0), [inputText]);

  const arrangedLines = useMemo(() => {
    if (orientation === 'rtl') {
      return [...lines].reverse();
    }
    return lines;
  }, [lines, orientation]);

  const decoSymbol = flowerDeco !== 'decoNone' ? DECO_SYMBOLS[flowerDeco] : null;

  const maxColHeight = useMemo(() => {
    if (arrangedLines.length === 0) return 1;
    let max = 0;
    for (const line of arrangedLines) {
      let len = line.length;
      if (decoSymbol) len += 2;
      if (len > max) max = len;
    }
    return Math.max(1, max);
  }, [arrangedLines, decoSymbol]);

  const numCols = arrangedLines.length;
  const padding = Math.max(fontSize, 32);
  const colWidth = fontSize + colGap;
  const rowHeight = fontSize + lineGap;

  const svgWidth = padding * 2 + Math.max(0, numCols - 1) * colWidth + fontSize;
  const svgHeight = padding * 2 + Math.max(0, maxColHeight - 1) * rowHeight + fontSize;

  const effectiveStrokeColor = bgOption === 'ink' ? INK_STROKE : strokeColor;
  const bgFill = BG_FILL[bgOption];

  const svgString = useMemo(() => {
    let parts: string[] = [];
    parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">`);
    if (bgFill) {
      parts.push(`<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="${bgFill}"/>`);
    }
    arrangedLines.forEach((line, colIdx) => {
      const x = padding + colIdx * colWidth + fontSize / 2;
      let charIdx = 0;
      if (decoSymbol) {
        const y = padding + charIdx * rowHeight + fontSize * 0.8;
        parts.push(`<text x="${x}" y="${y}" font-family="Noto Serif SC, FangSong, SimSun, serif" font-size="${fontSize}" fill="${effectiveStrokeColor}" text-anchor="middle">${decoSymbol}</text>`);
        charIdx++;
      }
      for (const ch of line) {
        const y = padding + charIdx * rowHeight + fontSize * 0.8;
        parts.push(`<text x="${x}" y="${y}" font-family="Noto Serif SC, FangSong, SimSun, serif" font-size="${fontSize}" fill="${effectiveStrokeColor}" text-anchor="middle">${ch}</text>`);
        charIdx++;
      }
      if (decoSymbol) {
        const y = padding + charIdx * rowHeight + fontSize * 0.8;
        parts.push(`<text x="${x}" y="${y}" font-family="Noto Serif SC, FangSong, SimSun, serif" font-size="${fontSize}" fill="${effectiveStrokeColor}" text-anchor="middle">${decoSymbol}</text>`);
        charIdx++;
      }
    });
    parts.push(`</svg>`);
    return parts.join('\n');
  }, [arrangedLines, decoSymbol, svgWidth, svgHeight, padding, colWidth, rowHeight, fontSize, effectiveStrokeColor, bgFill]);

  const verticalText = useMemo(() => {
    const cols = arrangedLines.map(line => {
      let colText = line;
      if (decoSymbol) {
        colText = decoSymbol + colText + decoSymbol;
      }
      return colText.split('');
    });
    const nrows = maxColHeight;
    const linesOut: string[] = [];
    for (let r = 0; r < nrows; r++) {
      let rowStr = '';
      for (let c = 0; c < cols.length; c++) {
        rowStr += cols[c][r] ?? '\u3000';
      }
      linesOut.push(rowStr);
    }
    return linesOut.join('\u2028');
  }, [arrangedLines, decoSymbol, maxColHeight]);

  const htmlCssCode = useMemo(() => {
    const wmClass = orientation === 'rtl' ? 'vertical-rl' : 'vertical-lr';
    const bgStyle = bgFill ? `background-color:${bgFill};` : '';
    return `<style>
.vertical-chinese-output {
  display: flex;
  gap: ${colGap}px;
  padding: ${padding}px;
  font-family: "Noto Serif SC", FangSong, SimSun, serif;
  font-size: ${fontSize}px;
  line-height: ${1 + lineGap / fontSize};
  color: ${effectiveStrokeColor};
  ${bgStyle}
}
.vertical-chinese-output .v-col {
  writing-mode: ${wmClass};
  text-orientation: upright;
  letter-spacing: ${lineGap}px;
}
</style>
<div class="vertical-chinese-output">
${arrangedLines.map(line => {
  let txt = line;
  if (decoSymbol) txt = decoSymbol + txt + decoSymbol;
  return `  <div class="v-col">${txt}</div>`;
}).join('\n')}
</div>`;
  }, [arrangedLines, colGap, padding, fontSize, lineGap, effectiveStrokeColor, bgFill, orientation, decoSymbol]);

  const previewBgClass = bgOption === 'ink'
    ? 'bg-[#0A0A0A]'
    : bgOption === 'rice'
      ? 'bg-[#FBF5E6]'
      : 'bg-white dark:bg-gray-800/50';
  const previewTextClass = bgOption === 'ink' ? 'text-white' : 'text-gray-900 dark:text-gray-100';

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vertical-chinese.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadDemo = () => {
    setInputText(t.demoPoem);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/25">
            <span className="text-lg sm:text-xl font-serif">書</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.input}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.placeHolder}
                rows={6}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none font-serif"
              />
              <button
                onClick={loadDemo}
                className="mt-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
              >
                {t.demoSample}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.fontSize}</label>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{fontSize}</span>
                </div>
                <input
                  type="range"
                  min={t.fontSizeMin}
                  max={t.fontSizeMax}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>{t.fontSizeMin}</span>
                  <span>{Math.round((t.fontSizeMin + t.fontSizeMax) / 2)}</span>
                  <span>{t.fontSizeMax}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.lineGap}</label>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{lineGap}</span>
                </div>
                <input
                  type="range"
                  min={t.lineGapMin}
                  max={t.lineGapMax}
                  value={lineGap}
                  onChange={(e) => setLineGap(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>{t.lineGapMin}</span>
                  <span>{Math.round((t.lineGapMin + t.lineGapMax) / 2)}</span>
                  <span>{t.lineGapMax}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.colGap}</label>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{colGap}</span>
                </div>
                <input
                  type="range"
                  min={t.colGapMin}
                  max={t.colGapMax}
                  value={colGap}
                  onChange={(e) => setColGap(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>{t.colGapMin}</span>
                  <span>{Math.round((t.colGapMin + t.colGapMax) / 2)}</span>
                  <span>{t.colGapMax}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.flowerDeco}</label>
              <div className="grid grid-cols-5 gap-2">
                {(['decoNone', 'deco1', 'deco2', 'deco3', 'deco4'] as const).map((key) => (
                  <label
                    key={key}
                    className={`flex items-center justify-center p-2.5 rounded-lg text-xs cursor-pointer transition-all border ${
                      flowerDeco === key
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="flowerDeco"
                      checked={flowerDeco === key}
                      onChange={() => setFlowerDeco(key)}
                      className="sr-only"
                    />
                    {t[key]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.strokeColor}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgOption === 'ink' ? INK_STROKE : strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  disabled={bgOption === 'ink'}
                  className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {bgOption === 'ink' ? INK_STROKE : strokeColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.bgColor}</label>
              <div className="grid grid-cols-3 gap-2">
                {BG_OPTIONS.map((bg) => (
                  <label
                    key={bg}
                    className={`flex items-center justify-center p-2.5 rounded-lg text-xs cursor-pointer transition-all border ${
                      bgOption === bg
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bgOption"
                      checked={bgOption === bg}
                      onChange={() => setBgOption(bg)}
                      className="sr-only"
                    />
                    {t[`bg${bg.charAt(0).toUpperCase() + bg.slice(1)}`]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.orientation}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['rtl', 'ltr'] as const).map((o) => (
                  <label
                    key={o}
                    className={`flex items-center justify-center p-2.5 rounded-lg text-xs cursor-pointer transition-all border ${
                      orientation === o
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="orientation"
                      checked={orientation === o}
                      onChange={() => setOrientation(o)}
                      className="sr-only"
                    />
                    {t[o]}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.preview}</label>
            <div
              className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto min-h-[400px] max-h-[600px] ${previewBgClass} transition-colors`}
            >
              {arrangedLines.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-sm text-gray-400">
                  {t.placeHolder.slice(0, 30)}...
                </div>
              ) : (
                <div
                  className={`flex p-8 ${previewTextClass} font-serif`}
                  style={{
                    gap: `${colGap}px`,
                    fontSize: `${fontSize}px`,
                    lineHeight: `${1 + lineGap / fontSize}`,
                  }}
                >
                  {arrangedLines.map((line, i) => {
                    let txt = line;
                    if (decoSymbol) txt = decoSymbol + txt + decoSymbol;
                    return (
                      <div
                        key={i}
                        style={{
                          writingMode: orientation === 'rtl' ? 'vertical-rl' : 'vertical-lr',
                          textOrientation: 'upright',
                          letterSpacing: `${lineGap}px`,
                        }}
                      >
                        {txt}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => copyToClipboard(verticalText, setCopyTextState)}
            disabled={arrangedLines.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {copyTextState ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
            {copyTextState ? '✓' : t.copyText}
          </button>
          <button
            onClick={downloadSvg}
            disabled={arrangedLines.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            {t.downloadSvg}
          </button>
          <button
            onClick={() => copyToClipboard(htmlCssCode, setCopyHtmlState)}
            disabled={arrangedLines.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {copyHtmlState ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
            {copyHtmlState ? '✓' : t.copyHtml}
          </button>
        </div>
      </div>
    </div>
  );
}
