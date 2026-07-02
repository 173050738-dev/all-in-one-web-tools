'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, RotateCcw, UserCircle, Check } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';
type Shape = 'circle' | 'square';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    subtitle: '选择支持的国家队，搭配足球/奖杯/美加墨元素生成专属球迷头像',
    teamLabel: '支持的国家队',
    shapeLabel: '头像形状',
    circle: '圆形',
    square: '方形',
    bgLabel: '背景主题',
    styleLabel: '风格/纹理',
    decoLabel: '装饰元素（叠加2-3个）',
    genBtn: '🎲 重新生成头像',
    downloadBtn: '下载透明底 PNG',
    tip: '可多次点击「重新生成」随机搭配。头像尺寸：方形 512×512 / 圆形 内径 512。',
    copiedTeam: '已选国家队：',
  },
  en: {
    subtitle: 'Pick your team, mix footy/trophy/NA2026 elements, generate a fan avatar',
    teamLabel: 'National team',
    shapeLabel: 'Avatar shape',
    circle: 'Circle',
    square: 'Square',
    bgLabel: 'Background theme',
    styleLabel: 'Style / texture',
    decoLabel: 'Decorations (2–3 stacked)',
    genBtn: '🎲 Regenerate',
    downloadBtn: 'Download PNG (transparent)',
    tip: 'Tap regenerate for fresh combos. Size: square 512 / circle inner 512.',
    copiedTeam: 'Selected team:',
  },
  fr: {
    subtitle: 'Choisissez votre équipe + éléments trophe/coupe/USA-MEX-CAN pour un avatar fan',
    teamLabel: 'Équipe nationale',
    shapeLabel: 'Forme',
    circle: 'Rond',
    square: 'Carré',
    bgLabel: 'Fond',
    styleLabel: 'Style / texture',
    decoLabel: 'Décorations (2–3)',
    genBtn: '🎲 Régénérer',
    downloadBtn: 'Télécharger PNG',
    tip: 'Touchez Régénérer pour de nouveaux styles. 512×512 px.',
    copiedTeam: 'Équipe :',
  },
  es: {
    subtitle: 'Elige tu selección y mezcla elementos fútbol/copa/USA-MEX-CAN para avatar hincha',
    teamLabel: 'Selección',
    shapeLabel: 'Forma',
    circle: 'Círculo',
    square: 'Cuadrado',
    bgLabel: 'Fondo',
    styleLabel: 'Estilo / textura',
    decoLabel: 'Decoraciones (2–3)',
    genBtn: '🎲 Regenerar',
    downloadBtn: 'Descargar PNG',
    tip: 'Toca Regenerar para nuevas combinaciones. 512×512.',
    copiedTeam: 'Selección:',
  },
  hi: {
    subtitle: 'अपनी टीम चुनें, फुटबॉल/ट्रॉफ़ी/NA2026 एलिमेंट्स से फैन अवतार बनाएँ',
    teamLabel: 'राष्ट्रीय टीम',
    shapeLabel: 'आकार',
    circle: 'गोल',
    square: 'वर्ग',
    bgLabel: 'बैकग्राउंड',
    styleLabel: 'स्टाइल',
    decoLabel: 'सजावट (2–3)',
    genBtn: '🎲 फिर से बनाएँ',
    downloadBtn: 'PNG डाउनलोड',
    tip: 'बार-बार दबाएँ नए स्टाइल के लिए। 512×512।',
    copiedTeam: 'चुनी गई टीम:',
  },
  ar: {
    subtitle: 'اختر منتخبك ودمج كرة القدم والكأس وعناصر أمريكا الشمالية لصورة ملف مشجع',
    teamLabel: 'المنتخب',
    shapeLabel: 'الشكل',
    circle: 'دائري',
    square: 'مربع',
    bgLabel: 'الخلفية',
    styleLabel: 'النمط',
    decoLabel: 'الزينة (2–3)',
    genBtn: '🎲 إنشاء جديد',
    downloadBtn: 'تحميل PNG شفاف',
    tip: 'اضغط على إنشاء جديد للحصول على تصميمات جديدة. 512×512.',
    copiedTeam: 'المنتخب المختار:',
  },
};

interface Team {
  key: string;
  label: string;
  en: string;
  colors: [string, string, string?];
  accent: string;
}
const TEAMS: Team[] = [
  { key:'ARG', label:'阿根廷', en:'Argentina', colors:['#75AADB','#FFFFFF','#FCBF49'], accent:'#F6B400' },
  { key:'FRA', label:'法国', en:'France', colors:['#002395','#FFFFFF','#ED2939'], accent:'#ED2939' },
  { key:'BRA', label:'巴西', en:'Brazil', colors:['#009739','#FEDD00','#002776'], accent:'#FEDD00' },
  { key:'ENG', label:'英格兰', en:'England', colors:['#FFFFFF','#CF142B'], accent:'#0F2243' },
  { key:'ESP', label:'西班牙', en:'Spain', colors:['#AA151B','#F1BF00'], accent:'#001E62' },
  { key:'GER', label:'德国', en:'Germany', colors:['#000000','#DD0000','#FFCE00'], accent:'#FFCE00' },
  { key:'POR', label:'葡萄牙', en:'Portugal', colors:['#006600','#FF0000'], accent:'#FFD700' },
  { key:'NED', label:'荷兰', en:'Netherlands', colors:['#FF6600','#21468B'], accent:'#FFB800' },
  { key:'ITA', label:'意大利', en:'Italy', colors:['#008C45','#F4F5F0','#CD212A'], accent:'#0056A4' },
  { key:'USA', label:'美国', en:'USA', colors:['#B31942','#FFFFFF','#0A3161'], accent:'#0A3161' },
  { key:'MEX', label:'墨西哥', en:'Mexico', colors:['#006847','#FFFFFF','#CE1126'], accent:'#D4AF37' },
  { key:'CAN', label:'加拿大', en:'Canada', colors:['#FF0000','#FFFFFF'], accent:'#C8102E' },
  { key:'BEL', label:'比利时', en:'Belgium', colors:['#000000','#FAE042','#ED2939'], accent:'#ED2939' },
  { key:'URU', label:'乌拉圭', en:'Uruguay', colors:['#0038A8','#FFFFFF'], accent:'#FCD116' },
  { key:'CRO', label:'克罗地亚', en:'Croatia', colors:['#00296B','#FFFFFF','#C71F37'], accent:'#C71F37' },
  { key:'JPN', label:'日本', en:'Japan', colors:['#FFFFFF','#BC002D'], accent:'#00008B' },
  { key:'KOR', label:'韩国', en:'South Korea', colors:['#FFFFFF','#C60C30','#003478'], accent:'#003478' },
  { key:'MAR', label:'摩洛哥', en:'Morocco', colors:['#C1272D','#006233'], accent:'#006233' },
  { key:'SAU', label:'沙特', en:'Saudi Arabia', colors:['#006C35','#FFFFFF'], accent:'#CF142B' },
  { key:'AUS', label:'澳大利亚', en:'Australia', colors:['#00843D','#FFCD00','#00008B'], accent:'#FFCD00' },
  { key:'DEN', label:'丹麦', en:'Denmark', colors:['#C8102E','#FFFFFF'], accent:'#C8102E' },
  { key:'SUI', label:'瑞士', en:'Switzerland', colors:['#FF0000','#FFFFFF'], accent:'#D52B1E' },
  { key:'SRB', label:'塞尔维亚', en:'Serbia', colors:['#0C4076','#C6363C','#FFFFFF'], accent:'#C6363C' },
  { key:'CMR', label:'喀麦隆', en:'Cameroon', colors:['#007A5E','#CE1126','#FCD116'], accent:'#FCD116' },
  { key:'SEN', label:'塞内加尔', en:'Senegal', colors:['#00853F','#FDEF42','#E31B23'], accent:'#E31B23' },
  { key:'GHA', label:'加纳', en:'Ghana', colors:['#CE1126','#FCD116','#006B3F'], accent:'#000000' },
  { key:'ECU', label:'厄瓜多尔', en:'Ecuador', colors:['#FFDD00','#00205B','#EF3340'], accent:'#00205B' },
  { key:'QAT', label:'卡塔尔', en:'Qatar', colors:['#8A1538','#FFFFFF'], accent:'#8A1538' },
  { key:'IRN', label:'伊朗', en:'Iran', colors:['#239F40','#FFFFFF','#DA0000'], accent:'#239F40' },
  { key:'POL', label:'波兰', en:'Poland', colors:['#FFFFFF','#DC143C'], accent:'#DC143C' },
];

const BG_THEMES: { key: string; label: string; stops: string[] }[] = [
  { key:'classic', label:'经典配色', stops:['#0b1e4a','#1a3c8f','#0b1e4a'] },
  { key:'sunset', label:'日落', stops:['#f97316','#ef4444','#7c2d92'] },
  { key:'ocean', label:'海洋', stops:['#0f766e','#0ea5e9','#1e3a8a'] },
  { key:'gold', label:'金杯', stops:['#7c2d12','#ca8a04','#fde047'] },
  { key:'emerald', label:'绿茵', stops:['#064e3b','#059669','#34d399'] },
  { key:'storm', label:'风暴', stops:['#1e293b','#334155','#64748b'] },
];

interface Props { locale?: Locale; }

const WcFanAvatar: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const [teamKey, setTeamKey] = useState<string>('ARG');
  const [shape, setShape] = useState<Shape>('circle');
  const [bgKey, setBgKey] = useState<string>('classic');
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 10_000));
  const [downloaded, setDownloaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const team = useMemo(() => TEAMS.find((x) => x.key === teamKey) ?? TEAMS[0], [teamKey]);
  const bg = useMemo(() => BG_THEMES.find((x) => x.key === bgKey) ?? BG_THEMES[0], [bgKey]);

  const SIZE = 512;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    c.width = SIZE; c.height = SIZE;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Clip
    ctx.save();
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
    }
    // Gradient bg
    const g = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    g.addColorStop(0, bg.stops[0]);
    g.addColorStop(0.5, bg.stops[1]);
    g.addColorStop(1, bg.stops[2] ?? bg.stops[0]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Stripes from team colors
    const stripes = Math.min(18, 7 + (seed % 10));
    for (let i = 0; i < stripes; i++) {
      const col = team.colors[i % team.colors.length] ?? '#ffffff';
      ctx.globalAlpha = 0.05 + ((seed + i) % 7) * 0.02;
      ctx.fillStyle = col;
      const x = -SIZE + (i * ((SIZE * 2) / stripes));
      ctx.save();
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate((-Math.PI / 6) + ((seed % 5) * (Math.PI / 20)));
      ctx.fillRect(x - SIZE, -SIZE, (SIZE * 2) / stripes + 40, SIZE * 3);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Big badge circle center
    const cx = SIZE / 2, cy = SIZE / 2;
    const r = 170 + (seed % 30);
    const grd = ctx.createRadialGradient(cx - r / 3, cy - r / 3, r / 10, cx, cy, r);
    grd.addColorStop(0, team.colors[1] ?? '#ffffff');
    grd.addColorStop(0.75, team.colors[0]);
    grd.addColorStop(1, team.accent);
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    // Inner ring
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, cy, r - 10, 0, Math.PI * 2); ctx.stroke();

    // Team badge: 3-letter code with accent outline
    ctx.fillStyle = team.accent;
    ctx.font = 'bold 104px "Arial Black", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 6;
    ctx.strokeText(team.key, cx, cy - 4);
    ctx.fillText(team.key, cx, cy - 4);
    // Country name EN small below
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 6;
    ctx.fillText(team.en.toUpperCase().slice(0, 14), cx, cy + 80);
    ctx.shadowBlur = 0;

    // Decorations randomized (2 to 3): ball, trophy, star, usa/mex/can maple/flag corner
    const rng = (n: number) => (Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5);
    const decos = [1,2,3].map((_, i) => Math.floor(rng(i + 1) * 6));
    const drawBall = (x: number, y: number, s: number) => {
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.strokeStyle = '#111'; ctx.lineWidth = Math.max(2, s / 12); ctx.stroke();
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2 + seed * 0.1;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * (s * 0.4), y + Math.sin(a) * (s * 0.4));
        ctx.quadraticCurveTo(x, y, x + Math.cos(a + Math.PI * 2 / 5) * (s * 0.38), y + Math.sin(a + Math.PI * 2 / 5) * (s * 0.38));
        ctx.strokeStyle = '#111'; ctx.lineWidth = Math.max(1.5, s / 18); ctx.stroke();
      }
    };
    const drawTrophy = (x: number, y: number, s: number) => {
      ctx.fillStyle = '#f4c430';
      ctx.strokeStyle = '#7a4d00'; ctx.lineWidth = Math.max(2, s / 20);
      ctx.beginPath();
      ctx.moveTo(x - s, y - s * 1.1);
      ctx.lineTo(x + s, y - s * 1.1);
      ctx.lineTo(x + s * 0.85, y - s * 0.2);
      ctx.lineTo(x + s * 0.35, y + s * 0.1);
      ctx.lineTo(x + s * 0.5, y + s * 1.1);
      ctx.lineTo(x - s * 0.5, y + s * 1.1);
      ctx.lineTo(x - s * 0.35, y + s * 0.1);
      ctx.lineTo(x - s * 0.85, y - s * 0.2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };
    const drawStar = (x: number, y: number, s: number, col: string) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = k % 2 === 0 ? s : s * 0.45;
        const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    };
    const drawMaple = (x: number, y: number, s: number) => {
      ctx.fillStyle = '#E60012';
      ctx.strokeStyle = '#9a000c'; ctx.lineWidth = Math.max(2, s / 18);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s * 0.45, y - s * 0.35);
      ctx.lineTo(x + s, y - s * 0.1);
      ctx.lineTo(x + s * 0.6, y + s * 0.2);
      ctx.lineTo(x + s * 0.75, y + s * 0.95);
      ctx.lineTo(x, y + s * 0.55);
      ctx.lineTo(x - s * 0.75, y + s * 0.95);
      ctx.lineTo(x - s * 0.6, y + s * 0.2);
      ctx.lineTo(x - s, y - s * 0.1);
      ctx.lineTo(x - s * 0.45, y - s * 0.35);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };
    const drawEagle = (x: number, y: number, s: number) => {
      ctx.fillStyle = '#0A3161'; ctx.strokeStyle = '#B31942'; ctx.lineWidth = Math.max(2, s / 18);
      ctx.beginPath();
      ctx.moveTo(x - s, y + s * 0.2);
      ctx.quadraticCurveTo(x, y - s * 1.2, x + s, y + s * 0.2);
      ctx.quadraticCurveTo(x + s * 0.4, y + s * 0.4, x, y + s);
      ctx.quadraticCurveTo(x - s * 0.4, y + s * 0.4, x - s, y + s * 0.2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    };
    const drawCactus = (x: number, y: number, s: number) => {
      ctx.fillStyle = '#006847'; ctx.strokeStyle = '#003822'; ctx.lineWidth = Math.max(2, s / 20);
      const w = s * 0.45;
      ctx.beginPath();
      ctx.roundRect?.(x - w / 2, y - s, w, s * 2, s * 0.3);
      if (!ctx.roundRect) { ctx.rect(x - w / 2, y - s, w, s * 2); }
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - s * 0.85, y - s * 0.2, s * 0.35, s * 1.1, s * 0.2);
      else ctx.rect(x - s * 0.85, y - s * 0.2, s * 0.35, s * 1.1);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x + s * 0.5, y - s * 0.4, s * 0.35, s * 1.2, s * 0.2);
      else ctx.rect(x + s * 0.5, y - s * 0.4, s * 0.35, s * 1.2);
      ctx.fill(); ctx.stroke();
    };

    // Position decos around badge
    const spots = [
      { x: SIZE - 80, y: 80 }, { x: 80, y: 80 }, { x: 80, y: SIZE - 80 },
      { x: SIZE - 80, y: SIZE - 80 }, { x: SIZE / 2, y: 70 }, { x: SIZE / 2, y: SIZE - 60 },
    ];
    const used = new Set<number>();
    (decos as number[]).forEach((kind, i) => {
      let idx = Math.floor(rng(i * 13) * spots.length) % spots.length;
      let tries = 0;
      while (used.has(idx) && tries < 6) { idx = (idx + 1) % spots.length; tries++; }
      used.add(idx);
      const p = spots[idx];
      const s = 28 + Math.floor(rng(i * 17) * 10);
      switch (kind) {
        case 0: drawBall(p.x, p.y, s); break;
        case 1: drawTrophy(p.x, p.y + 6, s * 0.7); break;
        case 2: drawStar(p.x, p.y, s, team.accent); break;
        case 3: drawEagle(p.x, p.y, s); break; // USA
        case 4: drawMaple(p.x, p.y, s); break; // CAN
        case 5: drawCactus(p.x, p.y, s); break; // MEX
      }
    });

    // Scattered tiny stars
    for (let k = 0; k < 18; k++) {
      const x = 30 + Math.floor(rng(k + 100) * (SIZE - 60));
      const y = 30 + Math.floor(rng(k + 200) * (SIZE - 60));
      const d = Math.hypot(x - cx, y - cy);
      if (d < r + 18) continue;
      drawStar(x, y, 4 + Math.floor(rng(k + 300) * 6), '#ffffff');
    }
    ctx.restore();

    // Outline
    ctx.save();
    if (shape === 'circle') {
      ctx.strokeStyle = team.accent; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 4, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 16, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.strokeStyle = team.accent; ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, SIZE - 10, SIZE - 10);
    }
    ctx.restore();
  }, [team, shape, bg, seed]);

  const handleDownload = () => {
    const c = canvasRef.current; if (!c) return;
    try {
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wc2026-fan-${team.key}-${shape}-${seed}.png`;
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
        setDownloaded(true); setTimeout(() => setDownloaded(false), 1400);
      }, 'image/png');
    } catch {}
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="w-5 h-5 text-[color:var(--color-primary)]" />
            <h2 className="text-[18px] font-bold">{locale === 'zh' ? '世界杯专属球迷头像生成器' : 'World Cup Fan Avatar'}</h2>
          </div>
          <p className="text-[13px] text-[color:var(--color-text-secondary)] mb-4">{t.subtitle}</p>

          <label className="block text-[13px] font-medium mb-2 mt-3">{t.teamLabel}</label>
          <select
            value={teamKey}
            onChange={(e) => setTeamKey(e.target.value)}
            className="input-base w-full !h-11 text-[14px]"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            {TEAMS.map((tm) => (<option key={tm.key} value={tm.key}>{tm.en} {tm.label} ({tm.key})</option>))}
          </select>
          <div className="text-[12px] text-[color:var(--color-text-secondary)] mt-1">
            {t.copiedTeam} <span className="font-semibold">{team.en} {team.label}</span>
          </div>

          <label className="block text-[13px] font-medium mb-2 mt-4">{t.shapeLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            {(['circle','square'] as const).map((s) => (
              <button key={s} type="button" onClick={() => setShape(s)}
                className={`!h-11 rounded-[var(--radius-md)] border text-[14px] touch-manipulation ${shape === s ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}>
                {s === 'circle' ? t.circle : t.square}
              </button>
            ))}
          </div>

          <label className="block text-[13px] font-medium mb-2 mt-4">{t.bgLabel}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BG_THEMES.map((b) => (
              <button key={b.key} type="button" onClick={() => setBgKey(b.key)}
                className={`!h-11 rounded-[var(--radius-md)] border text-[13px] touch-manipulation overflow-hidden relative ${bgKey === b.key ? 'ring-2 ring-[color:var(--color-primary)]' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${b.stops[0]}, ${b.stops[1]} 45%, ${b.stops[2] ?? b.stops[0]})`,
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44,
                  color: '#fff', border: bgKey === b.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                }}>
                <span className="relative z-10 drop-shadow">{b.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-2">
            <button type="button" onClick={() => setSeed(Math.floor(Math.random() * 100_000))}
              className="btn-primary w-full !h-12 text-[15px] inline-flex items-center justify-center gap-2 touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}>
              <RotateCcw className="w-4 h-4" />{t.genBtn}
            </button>
            <button type="button" onClick={handleDownload}
              className="w-full !h-12 rounded-[var(--radius-md)] border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary)] font-semibold text-[15px] inline-flex items-center justify-center gap-2 bg-[color:var(--color-bg-primary)] hover:bg-[color:var(--color-primary)] hover:text-white transition touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}>
              {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {t.downloadBtn}
            </button>
          </div>

          <div className="mt-4 text-[12px] text-[color:var(--color-text-secondary)] leading-relaxed">{t.tip}</div>
        </div>

        <div className="lg:col-span-3 card-base p-5 flex items-center justify-center">
          <div className="w-full max-w-[480px]">
            <canvas ref={canvasRef} width={SIZE} height={SIZE}
              className="w-full h-auto rounded-[var(--radius-xl)] bg-transparent select-none"
              style={{ imageRendering: 'auto', aspectRatio: '1 / 1' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WcFanAvatar;
