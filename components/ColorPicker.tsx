'use client';

import { useState } from 'react';
import { Copy, Check, Shuffle } from 'lucide-react';

interface ColorPickerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"颜色选择器", subtitle:"HEX/RGB/HSL/HSV互转，渐变生成", picker:"选色器", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV", copy:"复制", copied:"已复制", preset:"常用色板", random:"随机色", gradient:"渐变预览", gradientFrom:"渐变起始", gradientTo:"渐变结束", copyCss:"复制CSS渐变" },
  en: { title:"Color Picker", subtitle:"HEX/RGB/HSL/HSV conversion + gradient", picker:"Picker", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV", copy:"Copy", copied:"Copied", preset:"Preset Palette", random:"Random", gradient:"Gradient Preview", gradientFrom:"From", gradientTo:"To", copyCss:"Copy CSS" },
  hi: { title:"कलर पिकर", subtitle:"HEX/RGB/HSL/HSV रूपांतरण", picker:"पिकर", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV", copy:"कॉपी", copied:"कॉपी हुआ", preset:"प्रीसेट", random:"रैंडम", gradient:"ग्रेडियेंट", gradientFrom:"से", gradientTo:"तक", copyCss:"CSS कॉपी" },
  fr: { title:"Sélecteur de Couleur", subtitle:"Conversion HEX/RGB/HSL/HSV + dégradé", picker:"Palette", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV", copy:"Copier", copied:"Copié", preset:"Préréglages", random:"Aléatoire", gradient:"Dégradé", gradientFrom:"De", gradientTo:"À", copyCss:"Copier CSS" },
  es: { title:"Selector de Color", subtitle:"Conversión HEX/RGB/HSL/HSV + gradiente", picker:"Selector", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV", copy:"Copiar", copied:"Copiado", preset:"Preajustes", random:"Aleatorio", gradient:"Gradiente", gradientFrom:"Desde", gradientTo:"Hasta", copyCss:"Copiar CSS" },
  ar: { title:"منتقي الألوان", subtitle:"تحويل HEX/RGB/HSL/HSV + تدرج", picker:"المحدد", hex:"HEX", rgb:"RGB", hsl:"HSL", hsv:"HSV", copy:"نسخ", copied:"تم النسخ", preset:"إعدادات مسبقة", random:"عشوائي", gradient:"التدرج", gradientFrom:"من", gradientTo:"إلى", copyCss:"نسخ CSS" }
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
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
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
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
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
  const hn = (h % 360) / 360;
  const sn = s / 100, ln = l / 100;
  if (s === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
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
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const hn = (h % 360) / 360;
  const sn = s / 100, vn = v / 100;
  const i = Math.floor(hn * 6);
  const f = hn * 6 - i;
  const p = vn * (1 - sn);
  const q = vn * (1 - f * sn);
  const t = vn * (1 - (1 - f) * sn);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = vn; g = t; b = p; break;
    case 1: r = q; g = vn; b = p; break;
    case 2: r = p; g = vn; b = t; break;
    case 3: r = p; g = q; b = vn; break;
    case 4: r = t; g = p; b = vn; break;
    case 5: r = vn; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function randomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

export default function ColorPicker({ locale = 'zh' }: ColorPickerProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const t = i18n[resolvedLocale as keyof typeof i18n] || i18n.zh;

  const [color, setColor] = useState('#6366F1');
  const [gradientFrom, setGradientFrom] = useState('#6366F1');
  const [gradientTo, setGradientTo] = useState('#EC4899');
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleRandom = () => {
    const rand = randomHex();
    setColor(rand);
  };

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

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
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="aspect-square rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleRandom}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
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
                className="w-12 h-12 rounded-lg border-0 cursor-pointer bg-transparent flex-shrink-0"
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
                className="w-12 h-12 rounded-lg border-0 cursor-pointer bg-transparent flex-shrink-0"
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
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
    </div>
  );
}
