'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RefreshCw, Waves, Sparkles, Radio } from 'lucide-react';

interface WaveArtProps {
  locale?: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '声音波形艺术图', subtitle: '把你的名字或一句话变成独一无二的视觉图腾',
    placeholder: '输入文字或名字...', generate: '生成', regenerate: '重新生成', download: '下载 PNG',
    style: '风格', minimal: '极简线条', neon: '霓虹', spectrum: '电台频谱',
    palette: '配色', inputTip: '支持中文、英文、数字，每个字符映射为独特频率',
    empty: '在上方输入文字，生成你的专属波形艺术', combined: '叠加模式',
    combinedTip: '把多个名字的波形叠加在一起（用 / 分隔）',
  },
  en: {
    title: 'Voice Wave Art', subtitle: 'Turn your name or a phrase into a unique visual totem',
    placeholder: 'Enter text or a name...', generate: 'Generate', regenerate: 'Regenerate', download: 'Download PNG',
    style: 'Style', minimal: 'Minimal Lines', neon: 'Neon Glow', spectrum: 'Radio Spectrum',
    palette: 'Palette', inputTip: 'Supports any language, numbers, symbols — each character maps to a unique frequency',
    empty: 'Enter text above to generate your wave art', combined: 'Overlay Mode',
    combinedTip: 'Overlay multiple name waves (separate with /)',
  },
  es: {
    title: 'Arte de Onda de Voz', subtitle: 'Convierte tu nombre o frase en un tótem visual único',
    placeholder: 'Ingresa texto o un nombre...', generate: 'Generar', regenerate: 'Regenerar', download: 'Descargar PNG',
    style: 'Estilo', minimal: 'Líneas Minimalistas', neon: 'Neón', spectrum: 'Espectro de Radio',
    palette: 'Paleta', inputTip: 'Soporta cualquier idioma, números, símbolos — cada carácter se asigna a una frecuencia única',
    empty: 'Ingresa texto arriba para generar tu arte de onda', combined: 'Modo Superposición',
    combinedTip: 'Superpón ondas de múltiples nombres (separa con /)',
  },
  fr: {
    title: 'Art d\'Onde Vocale', subtitle: 'Transformez votre nom ou une phrase en un totem visuel unique',
    placeholder: 'Entrez du texte ou un nom...', generate: 'Générer', regenerate: 'Régénérer', download: 'Télécharger PNG',
    style: 'Style', minimal: 'Lignes Minimalistes', neon: 'Néon', spectrum: 'Spectre Radio',
    palette: 'Palette', inputTip: 'Prend en charge toutes les langues, chiffres, symboles — chaque caractère correspond à une fréquence unique',
    empty: 'Entrez du texte ci-dessus pour générer votre art d\'onde', combined: 'Mode Superposition',
    combinedTip: 'Superposez les ondes de plusieurs noms (séparez par /)',
  },
  hi: {
    title: 'वॉइस वेव आर्ट', subtitle: 'अपने नाम या वाक्य को एक अनोखे दृश्य प्रतीक में बदलें',
    placeholder: 'टेक्स्ट या नाम दर्ज करें...', generate: 'बनाएं', regenerate: 'फिर से', download: 'PNG डाउनलोड',
    style: 'शैली', minimal: 'मिनिमल लाइन्स', neon: 'नियॉन', spectrum: 'रेडियो स्पेक्ट्रम',
    palette: 'पैलेट', inputTip: 'किसी भी भाषा, संख्या, प्रतीक का समर्थन — प्रत्येक अक्षर एक अद्वितीय आवृत्ति से मैप होता है',
    empty: 'अपनी वेव आर्ट बनाने के लिए ऊपर टेक्स्ट दर्ज करें', combined: 'ओवरले मोड',
    combinedTip: 'कई नामों की तरंगों को ओवरले करें (/ से अलग करें)',
  },
  ar: {
    title: 'فن الموجة الصوتية', subtitle: 'حوّل اسمك أو جملة إلى رمز بصري فريد',
    placeholder: 'أدخل نصًا أو اسمًا...', generate: 'إنشاء', regenerate: 'إعادة إنشاء', download: 'تحميل PNG',
    style: 'النمط', minimal: 'خطوط بسيطة', neon: 'نيون', spectrum: 'طيف الراديو',
    palette: 'لوحة الألوان', inputTip: 'يدعم جميع اللغات والأرقام والرموز — كل حرف يرتبط بتردد فريد',
    empty: 'أدخل نصًا أعلاه لإنشاء فن الموجة', combined: 'وضع التراكب',
    combinedTip: 'تراكب موجات أسماء متعددة (افصل بـ /)',
  },
};

const PALETTES = [
  { name: 'Ocean', colors: ['#0ea5e9', '#06b6d4', '#0891b2'] },
  { name: 'Sunset', colors: ['#f97316', '#ec4899', '#a855f7'] },
  { name: 'Forest', colors: ['#22c55e', '#10b981', '#14b8a6'] },
  { name: 'Mono', colors: ['#1f2937', '#4b5563', '#6b7280'] },
  { name: 'Gold', colors: ['#f59e0b', '#eab308', '#d97706'] },
];

type StyleType = 'minimal' | 'neon' | 'spectrum';

// Map a character code to frequency and amplitude
function charToWave(charCode: number, index: number) {
  const freq = ((charCode * 7 + index * 13) % 60) / 10 + 0.5; // 0.5 - 6.5
  const amp = ((charCode * 11 + index * 17) % 80) / 100 + 0.2; // 0.2 - 1.0
  const phase = ((charCode * 23 + index * 31) % 628) / 100; // 0 - 6.28
  return { freq, amp, phase };
}

export default function WaveArt({ locale = 'zh' }: WaveArtProps) {
  const t = i18n[locale] || i18n.zh;
  const [text, setText] = useState('');
  const [style, setStyle] = useState<StyleType>('minimal');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [seed, setSeed] = useState(0);
  const [combined, setCombined] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 800;
    const H = 320;
    canvas.width = W;
    canvas.height = H;

    // Background
    if (style === 'neon') {
      ctx.fillStyle = '#0a0a0f';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, W, H);

    const palette = PALETTES[paletteIdx];
    const inputs = combined ? text.split('/').map(s => s.trim()).filter(Boolean) : [text];
    const centerY = H / 2;

    inputs.forEach((inputText, layer) => {
      const chars = Array.from(inputText);
      if (chars.length === 0) return;
      const color = palette.colors[layer % palette.colors.length];
      const layerOffset = combined ? (layer - (inputs.length - 1) / 2) * 20 : 0;

      if (style === 'spectrum') {
        // Bar style spectrum
        const barCount = Math.max(chars.length * 12, 60);
        const barWidth = W / barCount;
        for (let i = 0; i < barCount; i++) {
          const charIdx = i % chars.length;
          const charCode = chars[charIdx].charCodeAt(0);
          const { amp, freq, phase } = charToWave(charCode, charIdx);
          const x = i * barWidth;
          const t = (i / barCount) * Math.PI * 2 * freq + phase + seed * 0.5;
          const h = Math.abs(Math.sin(t)) * amp * (H * 0.35);
          const y = centerY - h / 2 + layerOffset;
          ctx.fillStyle = color;
          ctx.globalAlpha = combined ? 0.7 : 0.85;
          ctx.fillRect(x + 1, y, barWidth - 2, h);
        }
        ctx.globalAlpha = 1;
      } else {
        // Line style (minimal or neon)
        ctx.beginPath();
        const steps = W;
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W;
          let y = centerY + layerOffset;
          chars.forEach((ch, ci) => {
            const charCode = ch.charCodeAt(0);
            const { freq, amp, phase } = charToWave(charCode, ci);
            const t = (i / steps) * Math.PI * 2 * freq + phase + seed * 0.5;
            y += Math.sin(t) * amp * (H * 0.12) / chars.length;
          });
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (style === 'neon') {
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.shadowBlur = 8;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // Add subtle text watermark
    ctx.fillStyle = style === 'neon' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'end';
    ctx.fillText('Korelyy', W - 12, H - 10);
  }, [text, style, paletteIdx, seed, combined]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `wave-art-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          maxLength={60}
          className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{t.inputTip}</p>
      </div>

      {/* Style selector */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.style}:</span>
          {([
            { key: 'minimal', label: t.minimal, icon: Sparkles },
            { key: 'neon', label: t.neon, icon: Waves },
            { key: 'spectrum', label: t.spectrum, icon: Radio },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setStyle(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition min-h-[44px] ${
                style === key
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Palette selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.palette}:</span>
        {PALETTES.map((p, i) => (
          <button
            key={i}
            onClick={() => setPaletteIdx(i)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg min-h-[44px] transition border-2 ${
              paletteIdx === i ? 'border-sky-400' : 'border-transparent'
            }`}
            title={p.name}
          >
            <span className="flex gap-0.5">
              {p.colors.map((c, ci) => (
                <span key={ci} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </span>
          </button>
        ))}
      </div>

      {/* Combined mode toggle */}
      <div className="mb-4">
        <button
          onClick={() => setCombined(!combined)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition min-h-[44px] ${
            combined ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          <input type="checkbox" checked={combined} readOnly className="accent-purple-500" />
          <span className="font-medium">{t.combined}</span>
        </button>
        {combined && <p className="mt-1 text-xs text-gray-400 ms-10">{t.combinedTip}</p>}
      </div>

      {/* Canvas */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 mb-4">
        {text.trim() ? (
          <canvas ref={canvasRef} className="w-full block" style={{ maxWidth: '100%', height: 'auto' }} />
        ) : (
          <div className="h-[320px] flex items-center justify-center text-gray-300 dark:text-gray-600">
            <div className="text-center">
              <Waves size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">{t.empty}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {text.trim() && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setSeed(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-h-[44px] font-medium"
          >
            <RefreshCw size={18} />
            {t.regenerate}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[44px] font-medium shadow-md"
          >
            <Download size={18} />
            {t.download}
          </button>
        </div>
      )}
    </div>
  );
}
