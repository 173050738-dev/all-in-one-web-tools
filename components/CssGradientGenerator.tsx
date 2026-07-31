'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, RotateCcw, Download, Palette, Eye, Code2, Layers, Shuffle } from 'lucide-react';

interface CssGradientGeneratorProps {
  locale?: string;
}

type GradientType = 'linear' | 'radial' | 'conic';

interface ColorStop {
  color: string;
  position: number;
}

const PRESET_GRADIENTS: { name: string; stops: ColorStop[]; angle: number; type: GradientType }[] = [
  { name: 'Sunset', stops: [{ color: '#FF6B6B', position: 0 }, { color: '#FFD93D', position: 50 }, { color: '#6BCB77', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Ocean', stops: [{ color: '#2E3192', position: 0 }, { color: '#1BFFFF', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Violet', stops: [{ color: '#4776E6', position: 0 }, { color: '#8E54E9', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Peach', stops: [{ color: '#FFB88C', position: 0 }, { color: '#DE6262', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Forest', stops: [{ color: '#134E5E', position: 0 }, { color: '#71B280', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Night', stops: [{ color: '#141E30', position: 0 }, { color: '#243B55', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Candy', stops: [{ color: '#FC466B', position: 0 }, { color: '#3F5EFB', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Aurora', stops: [{ color: '#00C9FF', position: 0 }, { color: '#92FE9D', position: 100 }], angle: 135, type: 'linear' },
];

const i18n = {
  zh: {
    title: 'CSS 渐变生成器',
    subtitle: '可视化编辑 CSS 线性/径向/圆锥渐变，一键复制代码，支持导出图片',
    type: '渐变类型',
    linear: '线性',
    radial: '径向',
    conic: '圆锥',
    direction: '角度',
    stops: '色标',
    addStop: '添加色标',
    removeStop: '删除',
    cssCode: 'CSS 代码',
    copyCss: '复制代码',
    copied: '已复制',
    copy: '复制',
    presets: '预设渐变',
    randomize: '随机',
    download: '下载图片',
    preview: '预览',
    code: '代码',
    angleLabel: '角度 (°)',
    radialPosition: '圆心位置',
    center: '中心',
    topLeft: '左上',
    top: '上',
    topRight: '右上',
    left: '左',
    right: '右',
    bottomLeft: '左下',
    bottom: '下',
    bottomRight: '右下',
  },
  en: {
    title: 'CSS Gradient Generator',
    subtitle: 'Visual editor for linear/radial/conic CSS gradients — copy code, export as image',
    type: 'Gradient Type',
    linear: 'Linear',
    radial: 'Radial',
    conic: 'Conic',
    direction: 'Angle',
    stops: 'Color Stops',
    addStop: 'Add Stop',
    removeStop: 'Remove',
    cssCode: 'CSS Code',
    copyCss: 'Copy CSS',
    copied: 'Copied',
    copy: 'Copy',
    presets: 'Presets',
    randomize: 'Random',
    download: 'Download PNG',
    preview: 'Preview',
    code: 'Code',
    angleLabel: 'Angle (°)',
    radialPosition: 'Radial Position',
    center: 'Center',
    topLeft: 'Top Left',
    top: 'Top',
    topRight: 'Top Right',
    left: 'Left',
    right: 'Right',
    bottomLeft: 'Bottom Left',
    bottom: 'Bottom',
    bottomRight: 'Bottom Right',
  },
  es: {
    title: 'Generador de Gradientes CSS',
    subtitle: 'Editor visual de gradientes CSS lineales/radiales/cónicos — copia código, exporta imagen',
    type: 'Tipo de Gradiente',
    linear: 'Lineal',
    radial: 'Radial',
    conic: 'Cónico',
    direction: 'Ángulo',
    stops: 'Puntos de Color',
    addStop: 'Añadir',
    removeStop: 'Eliminar',
    cssCode: 'Código CSS',
    copyCss: 'Copiar CSS',
    copied: 'Copiado',
    copy: 'Copiar',
    presets: 'Preajustes',
    randomize: 'Aleatorio',
    download: 'Descargar PNG',
    preview: 'Vista Previa',
    code: 'Código',
    angleLabel: 'Ángulo (°)',
    radialPosition: 'Posición Radial',
    center: 'Centro',
    topLeft: 'Superior Izq',
    top: 'Superior',
    topRight: 'Superior Der',
    left: 'Izquierda',
    right: 'Derecha',
    bottomLeft: 'Inferior Izq',
    bottom: 'Inferior',
    bottomRight: 'Inferior Der',
  },
  fr: {
    title: 'Générateur de Dégradé CSS',
    subtitle: 'Éditeur visuel de dégradés CSS linéaires/radiaux/coniques — copiez le code, exportez en image',
    type: 'Type de Dégradé',
    linear: 'Linéaire',
    radial: 'Radial',
    conic: 'Conique',
    direction: 'Angle',
    stops: 'Points de Couleur',
    addStop: 'Ajouter',
    removeStop: 'Supprimer',
    cssCode: 'Code CSS',
    copyCss: 'Copier',
    copied: 'Copié',
    copy: 'Copier',
    presets: 'Préréglages',
    randomize: 'Aléatoire',
    download: 'Télécharger PNG',
    preview: 'Aperçu',
    code: 'Code',
    angleLabel: 'Angle (°)',
    radialPosition: 'Position Radiale',
    center: 'Centre',
    topLeft: 'Supérieur Gauche',
    top: 'Supérieur',
    topRight: 'Supérieur Droit',
    left: 'Gauche',
    right: 'Droit',
    bottomLeft: 'Inférieur Gauche',
    bottom: 'Inférieur',
    bottomRight: 'Inférieur Droit',
  },
  hi: {
    title: 'CSS ग्रेडिएंट जनरेटर',
    subtitle: 'रैखिक/रेडियल/कोनिक CSS ग्रेडिएंट का विज़ुअल एडिटर — कोड कॉपी करें, इमेज एक्सपोर्ट करें',
    type: 'ग्रेडिएंट प्रकार',
    linear: 'रैखिक',
    radial: 'रेडियल',
    conic: 'कोनिक',
    direction: 'कोण',
    stops: 'रंग स्टॉप',
    addStop: 'स्टॉप जोड़ें',
    removeStop: 'हटाएं',
    cssCode: 'CSS कोड',
    copyCss: 'CSS कॉपी करें',
    copied: 'कॉपी हो गया',
    copy: 'कॉपी',
    presets: 'प्रीसेट',
    randomize: 'यादृच्छिक',
    download: 'PNG डाउनलोड',
    preview: 'पूर्वावलोकन',
    code: 'कोड',
    angleLabel: 'कोण (°)',
    radialPosition: 'रेडियल स्थिति',
    center: 'केंद्र',
    topLeft: 'ऊपर बायाँ',
    top: 'ऊपर',
    topRight: 'ऊपर दायाँ',
    left: 'बायाँ',
    right: 'दायाँ',
    bottomLeft: 'नीचे बायाँ',
    bottom: 'नीचे',
    bottomRight: 'नीचे दायाँ',
  },
  ar: {
    title: 'مولد تدرجات CSS',
    subtitle: 'محرر مرئي لتدرجات CSS الخطية/الشعاعية/المخروطية — انسخ الكود، صدّر كصورة',
    type: 'نوع التدرج',
    linear: 'خطي',
    radial: 'شعاعي',
    conic: 'مخروطي',
    direction: 'الزاوية',
    stops: 'نقاط الألوان',
    addStop: 'إضافة نقطة',
    removeStop: 'حذف',
    cssCode: 'كود CSS',
    copyCss: 'نسخ الكود',
    copied: 'تم النسخ',
    copy: 'نسخ',
    presets: 'الإعدادات المسبقة',
    randomize: 'عشوائي',
    download: 'تحميل PNG',
    preview: 'معاينة',
    code: 'الكود',
    angleLabel: 'الزاوية (°)',
    radialPosition: 'الموضع الشعاعي',
    center: 'مركز',
    topLeft: 'أعلى يسار',
    top: 'أعلى',
    topRight: 'أعلى يمين',
    left: 'يسار',
    right: 'يمين',
    bottomLeft: 'أسفل يسار',
    bottom: 'أسفل',
    bottomRight: 'أسفل يمين',
  },
};

const RADIAL_POSITIONS = ['center', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left', 'top left'];

function getGradientCss(type: GradientType, stops: ColorStop[], angle: number, radialPos: string): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted.map(s => `${s.color} ${s.position}%`).join(', ');

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopsStr})`;
  } else if (type === 'radial') {
    return `radial-gradient(circle at ${radialPos}, ${stopsStr})`;
  } else {
    return `conic-gradient(from ${angle}deg at center, ${stopsStr})`;
  }
}

function getRandomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 20);
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export default function CssGradientGenerator({ locale = 'en' }: CssGradientGeneratorProps) {
  const t = i18n[locale] || i18n.en;

  const [type, setType] = useState<GradientType>('linear');
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#667EEA', position: 0 },
    { color: '#764BA2', position: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [radialPos, setRadialPos] = useState('center');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const gradientCss = getGradientCss(type, stops, angle, radialPos);
  const fullCss = `background: ${gradientCss};`;

  const updateStop = useCallback((index: number, field: 'color' | 'position', value: string | number) => {
    setStops(prev => {
      const next = [...prev];
      if (field === 'position') {
        next[index] = { ...next[index], position: Math.max(0, Math.min(100, Number(value))) };
      } else {
        next[index] = { ...next[index], color: value as string };
      }
      return next;
    });
  }, []);

  const addStop = useCallback(() => {
    if (stops.length >= 8) return;
    setStops(prev => {
      const newPos = 50;
      const newStops = [...prev, { color: getRandomColor(), position: newPos }];
      return newStops;
    });
  }, [stops.length]);

  const removeStop = useCallback((index: number) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter((_, i) => i !== index));
  }, [stops.length]);

  const randomize = useCallback(() => {
    const count = 2 + Math.floor(Math.random() * 3);
    const newStops: ColorStop[] = [];
    for (let i = 0; i < count; i++) {
      newStops.push({
        color: getRandomColor(),
        position: Math.round((i / (count - 1)) * 100),
      });
    }
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  }, []);

  const applyPreset = useCallback((preset: typeof PRESET_GRADIENTS[number]) => {
    setStops(preset.stops.map(s => ({ ...s })));
    setAngle(preset.angle);
    setType(preset.type);
  }, []);

  const copyCss = useCallback(() => {
    navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullCss]);

  const downloadPng = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sorted = [...stops].sort((a, b) => a.position - b.position);
    if (type === 'linear') {
      const rad = (angle * Math.PI) / 180;
      const x0 = canvas.width / 2 - Math.cos(rad) * canvas.width;
      const y0 = canvas.height / 2 - Math.sin(rad) * canvas.height;
      const x1 = canvas.width / 2 + Math.cos(rad) * canvas.width;
      const y1 = canvas.height / 2 + Math.sin(rad) * canvas.height;
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      sorted.forEach(s => grad.addColorStop(s.position / 100, s.color));
      ctx.fillStyle = grad;
    } else if (type === 'radial') {
      let cx = canvas.width / 2, cy = canvas.height / 2;
      const posMap: Record<string, [number, number]> = {
        center: [0.5, 0.5], top: [0.5, 0], bottom: [0.5, 1], left: [0, 0.5], right: [1, 0.5],
        'top left': [0, 0], 'top right': [1, 0], 'bottom left': [0, 1], 'bottom right': [1, 1],
      };
      const pos = posMap[radialPos] || [0.5, 0.5];
      cx = pos[0] * canvas.width;
      cy = pos[1] * canvas.height;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) / 2);
      sorted.forEach(s => grad.addColorStop(s.position / 100, s.color));
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createConicGradient((angle * Math.PI) / 180, canvas.width / 2, canvas.height / 2);
      sorted.forEach(s => grad.addColorStop(s.position / 100, s.color));
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = `css-gradient-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [type, stops, angle, radialPos]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.title}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Preview */}
        <div className="relative">
          <div
            className="w-full h-48 sm:h-64 md:h-72 transition-all duration-300"
            style={{ background: gradientCss }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={downloadPng}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 text-xs font-medium shadow-sm backdrop-blur transition-colors"
              title={t.download}
            >
              <Download className="w-3.5 h-3.5" />
              PNG
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Gradient Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.type}</label>
            <div className="flex gap-2">
              {(['linear', 'radial', 'conic'] as GradientType[]).map(gt => (
                <button
                  key={gt}
                  onClick={() => setType(gt)}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    type === gt
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t[gt]}
                </button>
              ))}
            </div>
          </div>

          {/* Angle / Radial Position */}
          {type === 'linear' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.angleLabel}: {angle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={e => setAngle(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          )}

          {type === 'radial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.radialPosition}</label>
              <div className="grid grid-cols-3 gap-1.5">
                {RADIAL_POSITIONS.map(pos => (
                  <button
                    key={pos}
                    onClick={() => setRadialPos(pos)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                      radialPos === pos
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t[pos.replace(' ', '') as keyof typeof t] || pos}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'conic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.angleLabel}: {angle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={e => setAngle(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          )}

          {/* Color Stops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.stops}</label>
              <div className="flex gap-2">
                <button
                  onClick={addStop}
                  disabled={stops.length >= 8}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + {t.addStop}
                </button>
                <button
                  onClick={randomize}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Shuffle className="w-3 h-3" />
                  {t.randomize}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={e => updateStop(i, 'color', e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={e => updateStop(i, 'color', e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-mono text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={e => updateStop(i, 'position', e.target.value)}
                    className="w-16 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500 outline-none text-center"
                  />
                  <span className="text-xs text-gray-400">%</span>
                  <button
                    onClick={() => removeStop(i)}
                    disabled={stops.length <= 2}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title={t.removeStop}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.presets}</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_GRADIENTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(p)}
                  className="group relative h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-primary-500 transition-all"
                  style={{
                    background: `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
                  }}
                  title={p.name}
                >
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 text-white text-[10px] font-medium transition-opacity">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CSS Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cssCode}</label>
              <button
                onClick={copyCss}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.copied : t.copyCss}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-gray-900 text-green-400 text-xs font-mono overflow-x-auto">
              <code>{fullCss}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}