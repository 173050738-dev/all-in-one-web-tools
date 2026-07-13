'use client';

import { useState, useRef } from 'react';
import { Copy, Check, Shuffle, Lock, Unlock, Download, Palette, Pipette, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ColorPickerProps {
  locale?: string;
}

type PaletteMode = 'random' | 'analogous' | 'complementary' | 'triadic' | 'split' | 'tetradic';

const i18n = {
  zh: {
    title:"颜色选择器", subtitle:"HEX/RGB/HSL/HSV互转 + 配色方案生成，设计师必备",
    tabsPicker:"取色器", tabsPalette:"配色方案",
    picker:"选色器", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV",
    copy:"复制", copied:"已复制",
    preset:"常用色板", random:"随机色",
    gradient:"渐变预览", gradientFrom:"渐变起始", gradientTo:"渐变结束", copyCss:"复制CSS渐变",
    palette:"配色方案生成器",
    paletteSubtitle:"一键生成 5 色和谐配色方案，支持锁定色、复制 HEX、导出色板",
    paletteMode:"配色算法",
    modes:{
      random:"自由随机",
      analogous:"类似色",
      complementary:"互补色",
      triadic:"三角色",
      split:"分裂互补",
      tetradic:"四角色",
    },
    generate:"再生成一组",
    lockToggle:"锁定此色（再生成时不变）",
    copyAll:"复制全部 HEX",
    copiedAll:"已复制全部",
    export:"导出色板",
    exportCss:"导出 CSS 变量",
    exportText:"导出纯文本",
    exportPng:"导出 PNG 预览",
    locked:"已锁定", unlocked:"未锁定",
    hintLock:"锁定你满意的色，再生成只动未锁定的",
  },
  en: {
    title:"Color Picker", subtitle:"HEX/RGB/HSL/HSV conversion + harmonious palette generator",
    tabsPicker:"Picker", tabsPalette:"Palette",
    picker:"Picker", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV",
    copy:"Copy", copied:"Copied",
    preset:"Preset Palette", random:"Random",
    gradient:"Gradient Preview", gradientFrom:"From", gradientTo:"To", copyCss:"Copy CSS",
    palette:"Palette Generator",
    paletteSubtitle:"Generate 5-color harmonious palettes in one click — lock colors, copy HEX, export swatches",
    paletteMode:"Harmony mode",
    modes:{
      random:"Free random",
      analogous:"Analogous",
      complementary:"Complementary",
      triadic:"Triadic",
      split:"Split-complementary",
      tetradic:"Tetradic",
    },
    generate:"Generate new set",
    lockToggle:"Lock this color (preserved on regenerate)",
    copyAll:"Copy all HEX",
    copiedAll:"All copied",
    export:"Export palette",
    exportCss:"Export CSS variables",
    exportText:"Export plain text",
    exportPng:"Export PNG preview",
    locked:"Locked", unlocked:"Unlocked",
    hintLock:"Lock the colors you love — next generate only affects unlocked ones",
  },
  hi: {
    title:"कलर पिकर", subtitle:"HEX/RGB/HSL/HSV रूपांतरण + सामंजस्यपूर्ण पैलेट जेनरेटर",
    tabsPicker:"पिकर", tabsPalette:"पैलेट",
    picker:"पिकर", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV",
    copy:"कॉपी", copied:"कॉपी हुआ",
    preset:"प्रीसेट", random:"रैंडम",
    gradient:"ग्रेडियेंट", gradientFrom:"से", gradientTo:"तक", copyCss:"CSS कॉपी",
    palette:"पैलेट जेनरेटर",
    paletteSubtitle:"एक क्लिक में 5-रंग सामंजस्यपूर्ण पैलेट बनाएँ — रंग लॉक करें, HEX कॉपी करें, स्वैच निर्यात करें",
    paletteMode:"हार्मनी मोड",
    modes:{ random:"फ्री रैंडम", analogous:"एनालॉगस", complementary:"कम्प्लीमेंट्री", triadic:"ट्रायाडिक", split:"स्प्लिट-कम्प्लीमेंट्री", tetradic:"टेट्राडिक" },
    generate:"नया सेट बनाएँ",
    lockToggle:"इस रंग को लॉक करें (दोबारा बनाते समय बना रहे)",
    copyAll:"सभी HEX कॉपी",
    copiedAll:"सभी कॉपी हुए",
    export:"पैलेट निर्यात",
    exportCss:"CSS वेरिएबल निर्यात",
    exportText:"प्लेन टेक्स्ट निर्यात",
    exportPng:"PNG पूर्वावलोकन निर्यात",
    locked:"लॉक्ड", unlocked:"अनलॉक्ड",
    hintLock:"जो रंग आप पसंद करते हैं उन्हें लॉक करें — अगली बार बनाने पर केवल अनलॉक्ड रंग बदलेंगे",
  },
  fr: {
    title:"Sélecteur de Couleur", subtitle:"Conversion HEX/RGB/HSL/HSV + générateur de palette harmonieuse",
    tabsPicker:"Sélecteur", tabsPalette:"Palette",
    picker:"Palette", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV",
    copy:"Copier", copied:"Copié",
    preset:"Préréglages", random:"Aléatoire",
    gradient:"Dégradé", gradientFrom:"De", gradientTo:"À", copyCss:"Copier CSS",
    palette:"Générateur de Palette",
    paletteSubtitle:"Générez des palettes harmonieuses de 5 couleurs en un clic — verrouillage, copie HEX, export",
    paletteMode:"Mode d'harmonie",
    modes:{ random:"Aléatoire libre", analogous:"Analogue", complementary:"Complémentaire", triadic:"Triadique", split:"Complémentaire divisé", tetradic:"Tétradique" },
    generate:"Générer un nouveau jeu",
    lockToggle:"Verrouiller cette couleur (conservée à la régénération)",
    copyAll:"Copier tous les HEX",
    copiedAll:"Tous copiés",
    export:"Exporter la palette",
    exportCss:"Exporter variables CSS",
    exportText:"Exporter texte brut",
    exportPng:"Exporter aperçu PNG",
    locked:"Verrouillé", unlocked:"Déverrouillé",
    hintLock:"Verrouillez les couleurs que vous aimez — la prochaine génération ne touche qu'aux non verrouillées",
  },
  es: {
    title:"Selector de Color", subtitle:"Conversión HEX/RGB/HSL/HSV + generador de paleta armoniosa",
    tabsPicker:"Selector", tabsPalette:"Paleta",
    picker:"Selector", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV",
    copy:"Copiar", copied:"Copiado",
    preset:"Preajustes", random:"Aleatorio",
    gradient:"Gradiente", gradientFrom:"Desde", gradientTo:"Hasta", copyCss:"Copiar CSS",
    palette:"Generador de Paleta",
    paletteSubtitle:"Genera paletas armoniosas de 5 colores en un clic — bloquea, copia HEX, exporta",
    paletteMode:"Modo de armonía",
    modes:{ random:"Aleatorio libre", analogous:"Análogo", complementary:"Complementario", triadic:"Triádico", split:"Complementario dividido", tetradic:"Tetrádico" },
    generate:"Generar nuevo conjunto",
    lockToggle:"Bloquear este color (se conserva al regenerar)",
    copyAll:"Copiar todos los HEX",
    copiedAll:"Todos copiados",
    export:"Exportar paleta",
    exportCss:"Exportar variables CSS",
    exportText:"Exportar texto plano",
    exportPng:"Exportar vista previa PNG",
    locked:"Bloqueado", unlocked:"Desbloqueado",
    hintLock:"Bloquea los colores que te gustan — la próxima generación solo toca los desbloqueados",
  },
  ar: {
    title:"منتقي الألوان", subtitle:"تحويل HEX/RGB/HSL/HSV + مولد لوحة ألوان متناسقة",
    tabsPicker:"المحدد", tabsPalette:"اللوحة",
    picker:"المحدد", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV",
    copy:"نسخ", copied:"تم النسخ",
    preset:"إعدادات مسبقة", random:"عشوائي",
    gradient:"التدرج", gradientFrom:"من", gradientTo:"إلى", copyCss:"نسخ CSS",
    palette:"مولد لوحة الألوان",
    paletteSubtitle:"أنشئ لوحات متناسقة من 5 ألوان بنقرة واحدة — قفل الألوان، نسخ HEX، تصدير العينات",
    paletteMode:"وضع الانسجام",
    modes:{ random:"عشوائي حر", analogous:"مماثل", complementary:"مكمل", triadic:"ثلاثي", split:"مكمل منقسم", tetradic:"رباعي" },
    generate:"إنشاء مجموعة جديدة",
    lockToggle:"قفل هذا اللون (يُحفظ عند إعادة الإنشاء)",
    copyAll:"نسخ جميع HEX",
    copiedAll:"تم نسخ الكل",
    export:"تصدير اللوحة",
    exportCss:"تصدير متغيرات CSS",
    exportText:"تصدير نص عادي",
    exportPng:"تصدير معاينة PNG",
    locked:"مقفل", unlocked:"غير مقفل",
    hintLock:"اقفل الألوان التي تعجبك — الإنشاء التالي يلمس فقط الألوان غير المقفلة",
  },
};

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const presetColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B'
];

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const num = parseInt(h, 16);
  return {
    r: clamp((num >> 16) & 255, 0, 255),
    g: clamp((num >> 8) & 255, 0, 255),
    b: clamp(num & 255, 0, 255)
  };
}
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return '#' + toHex(r) + toHex(g) + toHex(b);
}
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = s / 100, ln = l / 100;
  if (s === 0) { const v = Math.round(ln * 255); return { r: v, g: v, b: v }; }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hueToRgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hn) * 255),
    b: Math.round(hueToRgb(p, q, hn - 1 / 3) * 255)
  };
}
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min; let h = 0;
  const s = max === 0 ? 0 : d / max; const v = max;
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}
function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = s / 100, vn = v / 100;
  const i = Math.floor(hn * 6); const f = hn * 6 - i;
  const p = vn * (1 - sn); const q = vn * (1 - f * sn); const t = vn * (1 - (1 - f) * sn);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = vn; g = t; b = p; break;
    case 1: r = q; g = vn; b = p; break;
    case 2: r = p; g = vn; b = t; break;
    case 3: r = p; g = q; b = vn; break;
    case 4: r = t; g = p; b = vn; break;
    case 5: r = vn; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function randomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

/* ============== Palette harmony algorithms ============== */
/*
 * 各配色算法基于"锚色相 anchorHue"返回 5 个 hue 偏移度
 * 返回 number[] 长度=5，每项是相对 0-360 的 hue 偏移
 */
function paletteHues(mode: PaletteMode, anchorHue: number): number[] {
  const norm = (x: number) => ((x % 360) + 360) % 360;
  switch (mode) {
    case 'analogous':      return [-30, -15,   0,  15,  30].map(d => norm(anchorHue + d));
    case 'complementary':  return [  0,  15,  30, 180, 195].map(d => norm(anchorHue + d));
    case 'triadic':        return [  0, 120, 135, 240, 255].map(d => norm(anchorHue + d));
    case 'split':          return [  0, 150, 165, 195, 210].map(d => norm(anchorHue + d));
    case 'tetradic':       return [  0,  90, 180, 270,  45].map(d => norm(anchorHue + d));
    case 'random':
    default:               return [0,1,2,3,4].map(() => Math.floor(Math.random() * 360));
  }
}

function generatePalette(
  mode: PaletteMode,
  baseHex: string | null,
  prevPalette: string[] | null,
  locks: boolean[]
): string[] {
  // 如果有之前锁定的色，优先保留
  const result: string[] = prevPalette && prevPalette.length === 5 ? [...prevPalette] : Array.from({ length: 5 }, randomHex);

  // 锚色相：从第一个未锁定色的 HSL 取，或随机 0-360
  let anchorHue = Math.floor(Math.random() * 360);
  if (baseHex) {
    const baseHsl = rgbToHsl(hexToRgb(baseHex).r, hexToRgb(baseHex).g, hexToRgb(baseHex).b);
    anchorHue = baseHsl.h;
  } else {
    const firstUnlocked = locks.findIndex(l => !l);
    if (firstUnlocked !== -1 && prevPalette) {
      const c = prevPalette[firstUnlocked];
      if (c) {
        const hsl = rgbToHsl(hexToRgb(c).r, hexToRgb(c).g, hexToRgb(c).b);
        anchorHue = hsl.h;
      }
    }
  }

  const hues = paletteHues(mode, anchorHue);
  // 饱和 & 亮度：在"好看"区间随机，避免过暗/过灰/过脏
  const randomSat = () => clamp(55 + Math.random() * 40, 30, 95);  // 55–95，偶尔 30–95
  const randomLum = () => clamp(38 + Math.random() * 32, 28, 78);  // 38–70，偶尔 28–78

  for (let i = 0; i < 5; i++) {
    if (locks[i]) continue;  // 锁定的不重算
    if (mode === 'random') {
      result[i] = randomHex();
    } else {
      const rgb = hslToRgb(hues[i], randomSat(), randomLum());
      result[i] = rgbToHex(rgb.r, rgb.g, rgb.b);
    }
  }
  return result;
}

/* ============== Main Component ============== */
export default function ColorPicker({ locale = 'zh' }: ColorPickerProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const t = i18n[resolvedLocale as keyof typeof i18n] || i18n.zh;

  /* Picker state */
  const [color, setColor] = useState('#6366F1');
  const [gradientFrom, setGradientFrom] = useState('#6366F1');
  const [gradientTo, setGradientTo] = useState('#EC4899');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  /* Palette state */
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('analogous');
  const [palette, setPalette] = useState<string[]>(() =>
    generatePalette('analogous', '#6366F1', null, [false, false, false, false, false])
  );
  const [locks, setLocks] = useState<boolean[]>([false, false, false, false, false]);
  const [paletteCopiedIdx, setPaletteCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ======= Picker helpers ======= */
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const hexStr = color.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hsvStr = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  const gradientCss = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    });
  };

  /* ======= Palette helpers ======= */
  const toggleLock = (i: number) => {
    const nl = [...locks]; nl[i] = !nl[i]; setLocks(nl);
  };
  const regenPalette = () => {
    setPalette(prev => generatePalette(paletteMode, null, prev, locks));
  };
  const updatePaletteColorAt = (idx: number, newHex: string) => {
    // 允许用户点色块后编辑 HEX 输入框，自行改为任意色
    let h = (newHex || '').replace(/[^0-9a-fA-F#]/g, '');
    if (!h.startsWith('#')) h = '#' + h;
    if (h.length === 4 || h.length === 7) {
      // 用 rgbToHex 规范化并验证是合法色
      try {
        const n = hexToRgb(h);
        if (!isNaN(n.r)) {
          const np = [...palette]; np[idx] = rgbToHex(n.r, n.g, n.b); setPalette(np);
          return;
        }
      } catch {/* ignore invalid */}
    }
    // 否则写当前值，不抛错
  };
  const copyPaletteColor = (i: number) => {
    navigator.clipboard.writeText(palette[i]).then(() => {
      setPaletteCopiedIdx(i);
      setTimeout(() => setPaletteCopiedIdx(null), 1600);
    });
  };
  const copyAllHex = () => {
    navigator.clipboard.writeText(palette.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    });
  };
  const exportCssVars = () => {
    const lines = palette.map((c, i) => `  --palette-${i + 1}: ${c};`).join('\n');
    const str = `:root {\n${lines}\n}`;
    navigator.clipboard.writeText(str);
  };
  const exportPlainText = () => navigator.clipboard.writeText(palette.join('\n'));
  const exportPng = () => {
    const cellW = 220, cellH = 180;
    const width = 5 * cellW;
    const height = cellH + 60;
    const c = canvasRef.current ?? document.createElement('canvas');
    c.width = width; c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = palette[i];
      ctx.fillRect(i * cellW, 0, cellW, cellH);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 22px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = paletteLuminance(palette[i]) < 0.5 ? '#ffffff' : '#0f172a';
      ctx.fillText(palette[i], i * cellW + cellW / 2, cellH / 2);
    }
    // footer
    ctx.fillStyle = '#f9fafb'; ctx.fillRect(0, cellH, width, 60);
    ctx.fillStyle = '#374151';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'middle';
    ctx.fillText('Korelyy Color Palette  ·  korelyy.com', 24, cellH + 30);
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `korelyy-palette-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const paletteLuminance = (hex: string) => {
    const rgb = hexToRgb(hex);
    return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  };

  const paletteModes: Array<{ key: PaletteMode; label: string }> = [
    { key: 'random',        label: t.modes.random },
    { key: 'analogous',     label: t.modes.analogous },
    { key: 'complementary', label: t.modes.complementary },
    { key: 'triadic',       label: t.modes.triadic },
    { key: 'split',         label: t.modes.split },
    { key: 'tetradic',      label: t.modes.tetradic },
  ];

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 p-4 sm:p-6 space-y-6">
      {/* hidden canvas for PNG export */}
      <canvas ref={canvasRef} className="hidden" />

      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="picker" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1.5 rounded-xl">
          <TabsTrigger value="picker" className="py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 min-h-[44px]">
            <Pipette className="w-4 h-4" />
            {t.tabsPicker}
          </TabsTrigger>
          <TabsTrigger value="palette" className="py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 min-h-[44px]">
            <Palette className="w-4 h-4" />
            {t.tabsPalette}
          </TabsTrigger>
        </TabsList>

        {/* ========== TAB 1: Picker (original content preserved) ========== */}
        <TabsContent value="picker" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.picker}</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value.toUpperCase())}
                  className="w-full h-[180px] rounded-xl border-0 cursor-pointer bg-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.preset}</label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="aspect-square min-h-[44px] min-w-[44px] rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setColor(randomHex())}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors min-h-[48px]"
              >
                <Shuffle className="w-4 h-4" />
                {t.random}
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: 'hex', label: t.hex, value: hexStr },
                { key: 'rgb', label: t.rgb, value: rgbStr },
                { key: 'hsl', label: t.hsl, value: hslStr },
                { key: 'hsv', label: t.hsv, value: hsvStr }
              ].map((item) => (
                <div key={item.key} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</span>
                    <button
                      onClick={() => handleCopy(item.key, item.value)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {copiedField === item.key ? (
                        <><Check className="w-3.5 h-3.5 text-green-500" />{t.copied}</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" />{t.copy}</>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-sm text-gray-900 dark:text-white break-all">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.gradient}</h2>

            <div
              className="w-full h-40 rounded-2xl border border-gray-200 dark:border-gray-700"
              style={{ background: gradientCss }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.gradientFrom}</label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
                  <input
                    type="color"
                    value={gradientFrom}
                    onChange={(e) => setGradientFrom(e.target.value.toUpperCase())}
                    className="w-12 h-12 min-w-[48px] rounded-lg border-0 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{gradientFrom.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.gradientTo}</label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
                  <input
                    type="color"
                    value={gradientTo}
                    onChange={(e) => setGradientTo(e.target.value.toUpperCase())}
                    className="w-12 h-12 min-w-[48px] rounded-lg border-0 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{gradientTo.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CSS</span>
                <button
                  onClick={() => handleCopy('gradient', `background: ${gradientCss};`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {copiedField === 'gradient' ? (
                    <><Check className="w-3.5 h-3.5 text-green-500" />{t.copied}</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />{t.copyCss}</>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-gray-900 dark:text-white break-all">background: {gradientCss};</div>
            </div>
          </div>
        </TabsContent>

        {/* ========== TAB 2: Palette Generator (NEW) ========== */}
        <TabsContent value="palette" className="mt-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t.palette}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.paletteSubtitle}</p>
          </div>

          {/* Controls row: mode + generate + copy + export */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center mt-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{t.paletteMode}</label>
              <select
                value={paletteMode}
                onChange={(e) => setPaletteMode(e.target.value as PaletteMode)}
                className="min-h-[44px] flex-1 sm:w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {paletteModes.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={regenPalette}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors min-h-[44px]"
            >
              <Shuffle className="w-4 h-4" />
              {t.generate}
            </button>

            <button
              onClick={copyAllHex}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors min-h-[44px]"
            >
              {copiedAll ? (
                <><Check className="w-4 h-4 text-green-500" />{t.copiedAll}</>
              ) : (
                <><Copy className="w-4 h-4" />{t.copyAll}</>
              )}
            </button>

            {/* Export dropdown-like split into 3 quick buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={exportCssVars}
                title={t.exportCss}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium transition-colors min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" />
                CSS
              </button>
              <button
                onClick={exportPlainText}
                title={t.exportText}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium transition-colors min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" />
                TXT
              </button>
              <button
                onClick={exportPng}
                title={t.exportPng}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium transition-colors min-h-[44px]"
              >
                <Download className="w-3.5 h-3.5" />
                PNG
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
            <span>💡</span>
            <span>{t.hintLock}</span>
          </p>

          {/* 5 Swatches — responsive: horizontal on sm+, vertical stacked on mobile */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2">
            {palette.map((c, i) => {
              const lum = paletteLuminance(c);
              const lightText = lum < 0.5;
              const isLocked = locks[i];
              return (
                <div
                  key={i}
                  className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-col h-full"
                >
                  {/* Swatch (large clickable area, min 44px) */}
                  <button
                    onClick={() => copyPaletteColor(i)}
                    title={c}
                    className="relative w-full aspect-square sm:aspect-[4/5] min-h-[140px] sm:min-h-[200px] transition-transform group-hover:brightness-95 active:scale-[0.99] flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {/* big HEX in middle (use contrast color) */}
                    <div
                      className={`font-mono text-2xl sm:text-3xl font-bold tracking-wide select-none ${lightText ? 'text-white' : 'text-gray-900'}`}
                    >
                      {paletteCopiedIdx === i ? (
                        <span className="inline-flex items-center gap-2">
                          <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                        </span>
                      ) : c}
                    </div>
                    {/* lock badge top */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLock(i); }}
                      title={isLocked ? t.locked : t.unlocked}
                      className={`absolute top-2 start-2 inline-flex items-center justify-center w-9 h-9 min-h-[36px] rounded-full shadow-sm transition ${
                        isLocked
                          ? 'bg-white/90 dark:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-300 dark:ring-indigo-500/40'
                          : 'bg-white/60 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 opacity-0 sm:opacity-0 group-hover:opacity-100 focus:opacity-100'
                      }`}
                      aria-label={t.lockToggle}
                    >
                      {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    {/* copier hint bottom */}
                    <div
                      className={`absolute bottom-2 start-2 end-2 text-center text-xs font-medium px-2 py-1 rounded-lg ${
                        paletteCopiedIdx === i
                          ? (lightText ? 'bg-white/90 text-green-600' : 'bg-black/80 text-green-300')
                          : (lightText ? 'bg-white/70 text-gray-700' : 'bg-black/50 text-gray-100')
                      }`}
                    >
                      {paletteCopiedIdx === i ? t.copied : `↗ ${t.copy}`}
                    </div>
                  </button>

                  {/* Swatch footer: editable HEX input */}
                  <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => updatePaletteColorAt(i, e.target.value)}
                      onBlur={(e) => updatePaletteColorAt(i, e.target.value)}
                      spellCheck={false}
                      className="w-full text-center font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-2 min-h-[40px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={`HEX ${i + 1}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
