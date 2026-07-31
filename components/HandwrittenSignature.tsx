'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Pen, Copy, Check, Download, RotateCcw, Palette, Type, Sliders, Eraser, Sparkles, FilePen, Feather, Brush } from 'lucide-react';

interface Props { locale?: string; }

type FontStyle = 'elegant' | 'bold' | 'cursive' | 'modern' | 'traditional' | 'handwriting';

interface FontOption {
  id: FontStyle;
  label: string;
  labelEn: string;
  fontFamily: string;
  description: string;
  preview: string;
}

const FONT_OPTIONS: FontOption[] = [
  { id: 'elegant', label: '优雅', labelEn: 'Elegant', fontFamily: '"Great Vibes", "Dancing Script", "Brush Script MT", cursive', description: '优雅流畅，适合正式场合', preview: 'Aa' },
  { id: 'bold', label: '粗犷', labelEn: 'Bold', fontFamily: '"Pinyon Script", "Playfair Display", Georgia, serif', description: '大气磅礴，个性十足', preview: 'Aa' },
  { id: 'cursive', label: '手写', labelEn: 'Cursive', fontFamily: '"Dancing Script", "Pacifico", "Segoe Script", cursive', description: '自然流畅，日常手写风格', preview: 'Aa' },
  { id: 'modern', label: '现代', labelEn: 'Modern', fontFamily: '"Sacramento", "Allura", "Lucida Handwriting", cursive', description: '现代简约，时尚感强', preview: 'Aa' },
  { id: 'traditional', label: '传统', labelEn: 'Traditional', fontFamily: '"Ma Shan Zheng", "Zhi Mang Xing", "STKaiti", "KaiTi", serif', description: '中国风，毛笔书法韵味', preview: '签名' },
  { id: 'handwriting', label: '随意', labelEn: 'Handwriting', fontFamily: '"Caveat", "Comic Sans MS", "Bradley Hand", cursive', description: '轻松随意，日常便签风', preview: 'Aa' },
];

const COLORS = [
  { name: '黑色', value: '#1a1a1a' },
  { name: '深蓝', value: '#1e3a5f' },
  { name: '深灰', value: '#374151' },
  { name: '暗红', value: '#8b1a1a' },
  { name: '深棕', value: '#5c3d2e' },
  { name: '墨绿', value: '#1f4d3a' },
  { name: '紫色', value: '#4a2d7a' },
  { name: '酒红', value: '#7a2d3b' },
];

const I18N: Record<string, Record<string, string>> = {
  zh: {
    title: '手写签名生成器',
    subtitle: '生成个性化手写风格签名，支持多种字体和导出格式',
    nameLabel: '签名内容',
    namePlaceholder: '输入你的名字...',
    fontLabel: '字体风格',
    colorLabel: '签名颜色',
    widthLabel: '笔画粗细',
    slantLabel: '倾斜角度',
    slantLeft: '左倾',
    slantRight: '右倾',
    exportPNG: '导出 PNG (透明背景)',
    exportSVG: '导出 SVG (矢量)',
    copySVG: '复制 SVG 代码',
    reset: '重置',
    pngDownloaded: 'PNG 已下载',
    svgDownloaded: 'SVG 已下载',
    svgCopied: 'SVG 代码已复制',
    empty: '输入名字生成签名',
    saveHint: '💡 PNG 背景透明，可用于邮件签名、文档签署等',
  },
  en: {
    title: 'Handwritten Signature Generator',
    subtitle: 'Create personalized handwritten signatures with multiple fonts and export formats',
    nameLabel: 'Signature Text',
    namePlaceholder: 'Enter your name...',
    fontLabel: 'Font Style',
    colorLabel: 'Signature Color',
    widthLabel: 'Stroke Width',
    slantLabel: 'Slant Angle',
    slantLeft: 'Left',
    slantRight: 'Right',
    exportPNG: 'Export PNG (Transparent)',
    exportSVG: 'Export SVG (Vector)',
    copySVG: 'Copy SVG Code',
    reset: 'Reset',
    pngDownloaded: 'PNG downloaded',
    svgDownloaded: 'SVG downloaded',
    svgCopied: 'SVG code copied',
    empty: 'Enter a name to generate signature',
    saveHint: '💡 PNG has transparent background — perfect for email signatures and documents',
  },
  es: {
    title: 'Generador de Firmas Manuscritas',
    subtitle: 'Crea firmas manuscritas personalizadas con múltiples fuentes y formatos',
    nameLabel: 'Texto de Firma',
    namePlaceholder: 'Ingresa tu nombre...',
    fontLabel: 'Estilo de Fuente',
    colorLabel: 'Color de Firma',
    widthLabel: 'Grosor del Trazo',
    slantLabel: 'Ángulo de Inclinación',
    slantLeft: 'Izq',
    slantRight: 'Der',
    exportPNG: 'Exportar PNG (Transparente)',
    exportSVG: 'Exportar SVG (Vectorial)',
    copySVG: 'Copiar Código SVG',
    reset: 'Reiniciar',
    pngDownloaded: 'PNG descargado',
    svgDownloaded: 'SVG descargado',
    svgCopied: 'Código SVG copiado',
    empty: 'Ingresa un nombre para generar firma',
    saveHint: '💡 PNG con fondo transparente — ideal para firmas de correo y documentos',
  },
  fr: {
    title: 'Générateur de Signatures Manuscrites',
    subtitle: 'Créez des signatures manuscrites personnalisées avec plusieurs polices et formats',
    nameLabel: 'Texte de Signature',
    namePlaceholder: 'Entrez votre nom...',
    fontLabel: 'Style de Police',
    colorLabel: 'Couleur de Signature',
    widthLabel: 'Épaisseur du Trait',
    slantLabel: 'Angle d\'Inclinaison',
    slantLeft: 'Gauche',
    slantRight: 'Droite',
    exportPNG: 'Exporter PNG (Transparent)',
    exportSVG: 'Exporter SVG (Vectoriel)',
    copySVG: 'Copier le Code SVG',
    reset: 'Réinitialiser',
    pngDownloaded: 'PNG téléchargé',
    svgDownloaded: 'SVG téléchargé',
    svgCopied: 'Code SVG copié',
    empty: 'Entrez un nom pour générer la signature',
    saveHint: '💡 PNG avec fond transparent — parfait pour les signatures et documents',
  },
  hi: {
    title: 'हस्तलिखित हस्ताक्षर जनरेटर',
    subtitle: 'विभिन्न फ़ॉन्ट और प्रारूपों के साथ व्यक्तिगत हस्तलिखित हस्ताक्षर बनाएं',
    nameLabel: 'हस्ताक्षर पाठ',
    namePlaceholder: 'अपना नाम दर्ज करें...',
    fontLabel: 'फ़ॉन्ट शैली',
    colorLabel: 'हस्ताक्षर रंग',
    widthLabel: 'स्ट्रोक चौड़ाई',
    slantLabel: 'झुकाव कोण',
    slantLeft: 'बायाँ',
    slantRight: 'दायाँ',
    exportPNG: 'PNG निर्यात करें (पारदर्शी)',
    exportSVG: 'SVG निर्यात करें (वेक्टर)',
    copySVG: 'SVG कोड कॉपी करें',
    reset: 'रीसेट',
    pngDownloaded: 'PNG डाउनलोड',
    svgDownloaded: 'SVG डाउनलोड',
    svgCopied: 'SVG कोड कॉपी',
    empty: 'हस्ताक्षर जनरेट करने के लिए नाम दर्ज करें',
    saveHint: '💡 PNG में पारदर्शी पृष्ठभूमि है — ईमेल हस्ताक्षर और दस्तावेज़ों के लिए आदर्श',
  },
  ar: {
    title: 'مولد التوقيعات اليدوية',
    subtitle: 'أنشئ توقيعات يدوية مخصصة بخطوط وتنسيقات متعددة',
    nameLabel: 'نص التوقيع',
    namePlaceholder: 'أدخل اسمك...',
    fontLabel: 'نمط الخط',
    colorLabel: 'لون التوقيع',
    widthLabel: 'سُمك الخط',
    slantLabel: 'زاوية الميلان',
    slantLeft: 'يسار',
    slantRight: 'يمين',
    exportPNG: 'تصدير PNG (شفاف)',
    exportSVG: 'تصدير SVG (متجه)',
    copySVG: 'نسخ كود SVG',
    reset: 'إعادة تعيين',
    pngDownloaded: 'تم تحميل PNG',
    svgDownloaded: 'تم تحميل SVG',
    svgCopied: 'تم نسخ كود SVG',
    empty: 'أدخل اسمًا لإنشاء التوقيع',
    saveHint: '💡 PNG بخلفية شفافة — مثالي لتوقيعات البريد والوثائق',
  },
};

export default function HandwrittenSignature({ locale = 'zh' }: Props) {
  const t = I18N[locale] || I18N.en;
  const isRTL = locale === 'ar';

  const [name, setName] = useState('');
  const [fontId, setFontId] = useState<FontStyle>('elegant');
  const [color, setColor] = useState('#1a1a1a');
  const [width, setWidth] = useState(3);
  const [slant, setSlant] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  const currentFont = FONT_OPTIONS.find((f) => f.id === fontId) || FONT_OPTIONS[0];

  const drawSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const text = name.trim();
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (!text) return;

    ctx.save();

    const fontSize = Math.min(h * 0.55, (h * 0.55 * 6) / Math.max(text.length, 3));
    const finalFontSize = Math.max(fontSize, 24);

    ctx.font = `bold ${finalFontSize}px ${currentFont.fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = finalFontSize * 1.2;

    const centerX = w / 2;
    const centerY = h / 2;

    const angleRad = (slant * Math.PI) / 180;
    ctx.translate(centerX, centerY);
    ctx.rotate(angleRad);
    ctx.translate(-centerX, -centerY);

    if (fontId === 'elegant' || fontId === 'cursive') {
      ctx.shadowColor = color + '40';
      ctx.shadowBlur = width * 2;
      ctx.shadowOffsetX = width * 0.5;
      ctx.shadowOffsetY = width * 0.5;
    }

    ctx.fillText(text, centerX, centerY);

    if (fontId === 'bold') {
      ctx.lineWidth = width * 0.3;
      ctx.strokeStyle = color;
      ctx.strokeText(text, centerX, centerY);
    }

    ctx.restore();

    if (fontId === 'traditional' || fontId === 'handwriting') {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.font = `${Math.max(finalFontSize * 0.8, 20)}px ${currentFont.fontFamily}`;
      ctx.fillStyle = color;
      ctx.fillText(text, centerX + 2, centerY + 2);
      ctx.restore();
    }
  }, [name, fontId, color, width, slant, currentFont]);

  useEffect(() => {
    drawSignature();
  }, [drawSignature]);

  const getSVGString = useCallback(() => {
    if (!name.trim()) return '';
    const text = name.trim();
    const w = 500;
    const h = 200;
    const fontSize = 72;
    const angleRad = (slant * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const tx = w / 2;
    const ty = h / 2;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <g transform="translate(${tx},${ty}) rotate(${slant}) translate(${-tx},${-ty})">
    <text x="${tx}" y="${ty}" font-family="${currentFont.fontFamily}" font-size="${fontSize}" font-weight="bold" fill="${color}" text-anchor="middle" dominant-baseline="central">${text}</text>
  </g>
</svg>`;
  }, [name, color, slant, currentFont]);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim()) return;

    const outCanvas = document.createElement('canvas');
    const scale = 2;
    outCanvas.width = canvas.width * scale;
    outCanvas.height = canvas.height * scale;
    const ctx = outCanvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    const text = name.trim();
    const w = canvas.width;
    const h = canvas.height;

    const fontSize = Math.min(h * 0.55, (h * 0.55 * 6) / Math.max(text.length, 3));
    const finalFontSize = Math.max(fontSize, 24);

    ctx.font = `bold ${finalFontSize}px ${currentFont.fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const centerX = w / 2;
    const centerY = h / 2;
    const angleRad = (slant * Math.PI) / 180;

    ctx.translate(centerX, centerY);
    ctx.rotate(angleRad);
    ctx.translate(-centerX, -centerY);

    ctx.fillText(text, centerX, centerY);

    if (fontId === 'bold') {
      ctx.lineWidth = width * 0.3;
      ctx.strokeStyle = color;
      ctx.strokeText(text, centerX, centerY);
    }

    ctx.restore();

    outCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signature-${name.trim() || 'sig'}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t.pngDownloaded);
    }, 'image/png');
  }, [name, color, slant, currentFont, width, fontId, t, showToast]);

  const exportSVG = useCallback(() => {
    const svgStr = getSVGString();
    if (!svgStr) return;

    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signature-${name.trim() || 'sig'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.svgDownloaded);
  }, [getSVGString, name, t, showToast]);

  const copySVG = useCallback(async () => {
    const svgStr = getSVGString();
    if (!svgStr) return;
    try {
      await navigator.clipboard.writeText(svgStr);
      setCopied(true);
      showToast(t.svgCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = svgStr;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showToast(t.svgCopied);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getSVGString, t, showToast]);

  const resetAll = useCallback(() => {
    setName('');
    setFontId('elegant');
    setColor('#1a1a1a');
    setWidth(3);
    setSlant(0);
  }, []);

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Pen className="w-8 h-8 text-teal-500" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-5 sm:p-7 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.nameLabel}</label>
          <div className="relative">
            <FilePen className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={40}
              className={`w-full py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl border-2 border-teal-200 focus:border-teal-400 focus:ring-0 outline-none transition-all text-gray-800`}
              dir="auto"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">{t.fontLabel}</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {FONT_OPTIONS.map((font) => {
              const selected = fontId === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => setFontId(font.id)}
                  className={`relative p-2.5 rounded-xl border-2 transition-all duration-200 text-center overflow-hidden ${
                    selected
                      ? 'border-transparent bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-teal-300 hover:bg-white'
                  }`}
                  title={font.description}
                >
                  <div className={`text-xl mb-0.5 ${selected ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: font.fontFamily }}>
                    {font.preview}
                  </div>
                  <div className={`text-[10px] font-bold ${selected ? 'text-white' : 'text-gray-500'}`}>
                    {locale === 'zh' ? font.label : font.labelEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.colorLabel}</label>
            <div className="flex gap-1.5 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c.value ? 'border-teal-500 scale-110 shadow-md' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <label className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-teal-400 transition-colors">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-0 h-0 opacity-0"
                />
                <Palette className="w-3 h-3 text-gray-400" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.widthLabel}: {width}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.slantLabel}: {slant}°</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{t.slantLeft}</span>
              <input
                type="range"
                min={-30}
                max={30}
                value={slant}
                onChange={(e) => setSlant(Number(e.target.value))}
                className="flex-1 accent-teal-500"
              />
              <span className="text-xs text-gray-400">{t.slantRight}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
          <div className="relative bg-white rounded-lg border-2 border-dashed border-gray-200 overflow-hidden" style={{ minHeight: '160px' }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={160}
              className="w-full h-auto"
              style={{ maxHeight: '200px' }}
            />
            {!name.trim() && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm pointer-events-none">
                {t.empty}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">{t.saveHint}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={exportPNG}
            disabled={!name.trim()}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={exportSVG}
            disabled={!name.trim()}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm shadow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={copySVG}
            disabled={!name.trim()}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              copied
                ? 'border-green-400 bg-green-50 text-green-600'
                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? t.copied : t.copySVG}
          </button>
          <button
            onClick={resetAll}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50 font-semibold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            {t.reset}
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}