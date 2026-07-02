'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Download, ImagePlus, Palette, Move, Type, Check, RotateCcw, Trash2 } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';
type SizeKey = '9:16' | '3:4' | '2.35:1' | '16:9';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    subtitle: '自定义赛事封面海报 · 拖拽文字 · 叠加图片 · 无水印高清导出',
    sizeLabel: '海报尺寸',
    homeTeamLabel: '主队名称',
    awayTeamLabel: '客队名称',
    homeScoreLabel: '主队比分',
    awayScoreLabel: '客队比分',
    tagLabel: '赛事标签（半决赛 / 决赛）',
    bgThemeLabel: '背景主题',
    leftFlagLabel: '主队配色',
    rightFlagLabel: '客队配色',
    uploadLabel: '上传本地图片叠加',
    textColorLabel: '文字颜色',
    fontSizeLabel: '比分字号',
    dragTip: '点击选中文字，拖拽可移动位置',
    exportBtn: '导出高清 PNG',
    resetBtn: '重置布局',
    deleteImg: '删除图片',
    addImg: '＋ 添加叠加图',
    exported: '已导出 ✓',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    alignLabel: '比分对齐',
    weightLabel: '字重',
    weightNormal: '常规',
    weightBold: '粗体',
    weightBlack: '特粗',
  },
  en: {
    subtitle: 'Custom match poster · drag text · overlay images · HD PNG no watermark',
    sizeLabel: 'Poster size',
    homeTeamLabel: 'Home team',
    awayTeamLabel: 'Away team',
    homeScoreLabel: 'Home score',
    awayScoreLabel: 'Away score',
    tagLabel: 'Match tag (Semi / Final)',
    bgThemeLabel: 'Background',
    leftFlagLabel: 'Home colors',
    rightFlagLabel: 'Away colors',
    uploadLabel: 'Upload overlay image',
    textColorLabel: 'Text color',
    fontSizeLabel: 'Score font size',
    dragTip: 'Tap to select text, drag to reposition',
    exportBtn: 'Export HD PNG',
    resetBtn: 'Reset layout',
    deleteImg: 'Remove image',
    addImg: '＋ Add overlay',
    exported: 'Exported ✓',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    alignLabel: 'Score align',
    weightLabel: 'Weight',
    weightNormal: 'Regular',
    weightBold: 'Bold',
    weightBlack: 'Black',
  },
  fr: {
    subtitle: 'Affiche de match · texte déplaçable · superposition · HD PNG sans filigrane',
    sizeLabel: 'Taille',
    homeTeamLabel: 'Équipe domicile',
    awayTeamLabel: 'Équipe extérieure',
    homeScoreLabel: 'Score domicile',
    awayScoreLabel: 'Score extérieur',
    tagLabel: 'Étiquette (Demi / Finale)',
    bgThemeLabel: 'Arrière-plan',
    leftFlagLabel: 'Couleurs domicile',
    rightFlagLabel: 'Couleurs extérieur',
    uploadLabel: 'Importer une image',
    textColorLabel: 'Couleur texte',
    fontSizeLabel: 'Taille police score',
    dragTip: 'Touchez puis glissez pour déplacer',
    exportBtn: 'Exporter HD PNG',
    resetBtn: 'Réinitialiser',
    deleteImg: 'Supprimer',
    addImg: '＋ Ajouter image',
    exported: 'Exporté ✓',
    alignLeft: 'Gauche',
    alignCenter: 'Centre',
    alignRight: 'Droite',
    alignLabel: 'Alignement',
    weightLabel: 'Épaisseur',
    weightNormal: 'Normal',
    weightBold: 'Gras',
    weightBlack: 'Noir',
  },
  es: {
    subtitle: 'Póster de partido · texto arrastrable · superponer imagen · PNG HD sin marca',
    sizeLabel: 'Tamaño',
    homeTeamLabel: 'Equipo local',
    awayTeamLabel: 'Equipo visitante',
    homeScoreLabel: 'Goles local',
    awayScoreLabel: 'Goles visitante',
    tagLabel: 'Etiqueta (Semifinal / Final)',
    bgThemeLabel: 'Fondo',
    leftFlagLabel: 'Colores local',
    rightFlagLabel: 'Colores visitante',
    uploadLabel: 'Subir imagen',
    textColorLabel: 'Color texto',
    fontSizeLabel: 'Tamaño marcador',
    dragTip: 'Toca y arrastra para mover',
    exportBtn: 'Exportar PNG HD',
    resetBtn: 'Restablecer',
    deleteImg: 'Quitar',
    addImg: '＋ Añadir imagen',
    exported: 'Exportado ✓',
    alignLeft: 'Izq',
    alignCenter: 'Centro',
    alignRight: 'Der',
    alignLabel: 'Alineación',
    weightLabel: 'Peso',
    weightNormal: 'Normal',
    weightBold: 'Negrita',
    weightBlack: 'Black',
  },
  hi: {
    subtitle: 'मैच पोस्टर · टेक्स्ट खींचें · इमेज जोड़ें · HD PNG बिना वॉटरमार्क',
    sizeLabel: 'आकार',
    homeTeamLabel: 'होम टीम',
    awayTeamLabel: 'अवे टीम',
    homeScoreLabel: 'होम स्कोर',
    awayScoreLabel: 'अवे स्कोर',
    tagLabel: 'मैच टैग (सेमी / फाइनल)',
    bgThemeLabel: 'बैकग्राउंड',
    leftFlagLabel: 'होम रंग',
    rightFlagLabel: 'अवे रंग',
    uploadLabel: 'इमेज अपलोड',
    textColorLabel: 'टेक्स्ट रंग',
    fontSizeLabel: 'स्कोर फ़ॉन्ट',
    dragTip: 'चुनें और खींचें',
    exportBtn: 'HD PNG निर्यात',
    resetBtn: 'रीसेट',
    deleteImg: 'हटाएँ',
    addImg: '＋ इमेज जोड़ें',
    exported: 'निर्यात ✓',
    alignLeft: 'बायाँ',
    alignCenter: 'मध्य',
    alignRight: 'दायाँ',
    alignLabel: 'पंक्तिबद्ध',
    weightLabel: 'वेट',
    weightNormal: 'सामान्य',
    weightBold: 'बोल्ड',
    weightBlack: 'ब्लैक',
  },
  ar: {
    subtitle: 'ملصق المباراة · نص قابل للسحب · صور متراكبة · PNG HD بدون علامة مائية',
    sizeLabel: 'الحجم',
    homeTeamLabel: 'الفريق المضيف',
    awayTeamLabel: 'الفريق الضيف',
    homeScoreLabel: 'نتيجة المضيف',
    awayScoreLabel: 'نتيجة الضيف',
    tagLabel: 'التصنيف (نصف نهائي / نهائي)',
    bgThemeLabel: 'الخلفية',
    leftFlagLabel: 'ألوان المضيف',
    rightFlagLabel: 'ألوان الضيف',
    uploadLabel: 'رفع صورة',
    textColorLabel: 'لون النص',
    fontSizeLabel: 'حجم الخط',
    dragTip: 'اضغط واسحب للنقل',
    exportBtn: 'تصدير PNG عالي',
    resetBtn: 'إعادة ضبط',
    deleteImg: 'حذف',
    addImg: '＋ إضافة صورة',
    exported: 'تم التصدير ✓',
    alignLeft: 'يسار',
    alignCenter: 'وسط',
    alignRight: 'يمين',
    alignLabel: 'المحاذاة',
    weightLabel: 'الثقل',
    weightNormal: 'عادي',
    weightBold: 'عريض',
    weightBlack: 'أسود',
  },
};

interface Team48 { key: string; en: string; zh: string; colors: [string, string, string?]; }

const TEAMS_48: Team48[] = [
  { key:'ARG', en:'Argentina', zh:'阿根廷', colors:['#75AADB','#FFFFFF','#FCBF49'] },
  { key:'FRA', en:'France', zh:'法国', colors:['#002395','#FFFFFF','#ED2939'] },
  { key:'BRA', en:'Brazil', zh:'巴西', colors:['#009739','#FEDD00','#002776'] },
  { key:'ENG', en:'England', zh:'英格兰', colors:['#FFFFFF','#CF142B','#0F2243'] },
  { key:'ESP', en:'Spain', zh:'西班牙', colors:['#AA151B','#F1BF00','#001E62'] },
  { key:'GER', en:'Germany', zh:'德国', colors:['#000000','#DD0000','#FFCE00'] },
  { key:'POR', en:'Portugal', zh:'葡萄牙', colors:['#006600','#FF0000','#FFD700'] },
  { key:'NED', en:'Netherlands', zh:'荷兰', colors:['#FF6600','#21468B','#FFB800'] },
  { key:'ITA', en:'Italy', zh:'意大利', colors:['#008C45','#F4F5F0','#CD212A'] },
  { key:'USA', en:'USA', zh:'美国', colors:['#B31942','#FFFFFF','#0A3161'] },
  { key:'MEX', en:'Mexico', zh:'墨西哥', colors:['#006847','#FFFFFF','#CE1126'] },
  { key:'CAN', en:'Canada', zh:'加拿大', colors:['#FF0000','#FFFFFF','#C8102E'] },
  { key:'BEL', en:'Belgium', zh:'比利时', colors:['#000000','#FAE042','#ED2939'] },
  { key:'URU', en:'Uruguay', zh:'乌拉圭', colors:['#0038A8','#FFFFFF','#FCD116'] },
  { key:'CRO', en:'Croatia', zh:'克罗地亚', colors:['#00296B','#FFFFFF','#C71F37'] },
  { key:'JPN', en:'Japan', zh:'日本', colors:['#FFFFFF','#BC002D','#00008B'] },
  { key:'KOR', en:'South Korea', zh:'韩国', colors:['#FFFFFF','#C60C30','#003478'] },
  { key:'MAR', en:'Morocco', zh:'摩洛哥', colors:['#C1272D','#006233','#FFFFFF'] },
  { key:'SAU', en:'Saudi Arabia', zh:'沙特', colors:['#006C35','#FFFFFF','#CF142B'] },
  { key:'AUS', en:'Australia', zh:'澳大利亚', colors:['#00843D','#FFCD00','#00008B'] },
  { key:'DEN', en:'Denmark', zh:'丹麦', colors:['#C8102E','#FFFFFF','#000000'] },
  { key:'SUI', en:'Switzerland', zh:'瑞士', colors:['#FF0000','#FFFFFF','#D52B1E'] },
  { key:'SRB', en:'Serbia', zh:'塞尔维亚', colors:['#0C4076','#C6363C','#FFFFFF'] },
  { key:'CMR', en:'Cameroon', zh:'喀麦隆', colors:['#007A5E','#CE1126','#FCD116'] },
  { key:'SEN', en:'Senegal', zh:'塞内加尔', colors:['#00853F','#FDEF42','#E31B23'] },
  { key:'GHA', en:'Ghana', zh:'加纳', colors:['#CE1126','#FCD116','#006B3F'] },
  { key:'ECU', en:'Ecuador', zh:'厄瓜多尔', colors:['#FFDD00','#00205B','#EF3340'] },
  { key:'QAT', en:'Qatar', zh:'卡塔尔', colors:['#8A1538','#FFFFFF','#8A1538'] },
  { key:'IRN', en:'Iran', zh:'伊朗', colors:['#239F40','#FFFFFF','#DA0000'] },
  { key:'POL', en:'Poland', zh:'波兰', colors:['#FFFFFF','#DC143C','#FFFFFF'] },
  { key:'COL', en:'Colombia', zh:'哥伦比亚', colors:['#FCD116','#003893','#CE1126'] },
  { key:'PER', en:'Peru', zh:'秘鲁', colors:['#D91023','#FFFFFF','#D91023'] },
  { key:'CHI', en:'Chile', zh:'智利', colors:['#0039A6','#FFFFFF','#D8232A'] },
  { key:'PAR', en:'Paraguay', zh:'巴拉圭', colors:['#CE1126','#FFFFFF','#0038A8'] },
  { key:'VEN', en:'Venezuela', zh:'委内瑞拉', colors:['#CE1126','#FCD116','#00247D'] },
  { key:'BOL', en:'Bolivia', zh:'玻利维亚', colors:['#D31145','#F9E300','#007A33'] },
  { key:'CRC', en:'Costa Rica', zh:'哥斯达黎加', colors:['#CE1126','#FFFFFF','#002B7F'] },
  { key:'PAN', en:'Panama', zh:'巴拿马', colors:['#CE1126','#FFFFFF','#002B7F'] },
  { key:'HON', en:'Honduras', zh:'洪都拉斯', colors:['#002B7F','#FFFFFF','#CE1126'] },
  { key:'GUA', en:'Guatemala', zh:'危地马拉', colors:['#0068B3','#FFFFFF','#0068B3'] },
  { key:'CUB', en:'Cuba', zh:'古巴', colors:['#002A8F','#FFFFFF','#CF142B'] },
  { key:'HAI', en:'Haiti', zh:'海地', colors:['#00209F','#CE1126','#FFFFFF'] },
  { key:'JAM', en:'Jamaica', zh:'牙买加', colors:['#009B3A','#FED100','#000000'] },
  { key:'EGY', en:'Egypt', zh:'埃及', colors:['#CE1126','#FFFFFF','#CE1126'] },
  { key:'NGA', en:'Nigeria', zh:'尼日利亚', colors:['#008751','#FFFFFF','#008751'] },
  { key:'CIV', en:"Côte d'Ivoire", zh:'科特迪瓦', colors:['#F77F00','#FFFFFF','#009E60'] },
  { key:'RSA', en:'South Africa', zh:'南非', colors:['#007749','#FFB81C','#DE3831'] },
  { key:'TUN', en:'Tunisia', zh:'突尼斯', colors:['#CE1126','#FFFFFF','#CE1126'] },
];

const SIZE_PRESETS: Record<SizeKey, { w: number; h: number; label: string }> = {
  '9:16':   { w: 1080, h: 1920, label: '9:16 竖屏 (1080×1920)' },
  '3:4':    { w: 1080, h: 1440, label: '3:4 标准 (1080×1440)' },
  '2.35:1': { w: 1920, h: 817,  label: '2.35:1 宽屏 (1920×817)' },
  '16:9':   { w: 1920, h: 1080, label: '16:9 横屏 (1920×1080)' },
};

const BG_THEMES: { key: string; zh: string; en: string; stops: string[] }[] = [
  { key:'wc2026', zh:'2026主题深蓝', en:'2026 Navy', stops:['#0b1e4a','#1a3c8f','#5461A8'] },
  { key:'gold',   zh:'金杯荣耀',    en:'Gold Glory', stops:['#7c2d12','#ca8a04','#fde047'] },
  { key:'sunset', zh:'日落球场',    en:'Sunset',     stops:['#f97316','#ef4444','#7c2d92'] },
  { key:'ocean',  zh:'海洋球场',    en:'Ocean',      stops:['#0f766e','#0ea5e9','#1e3a8a'] },
  { key:'emerald',zh:'绿茵风暴',    en:'Pitch',      stops:['#064e3b','#059669','#34d399'] },
  { key:'noir',   zh:'纯黑高端',    en:'Noir',       stops:['#0a0a0a','#1f1f1f','#2a2a2a'] },
  { key:'paper',  zh:'复古报纸',    en:'Paper',      stops:['#F5F1E8','#EDE7D9','#DDD4C1'] },
  { key:'storm',  zh:'暗夜闪电',    en:'Storm',      stops:['#111827','#334155','#6366F1'] },
];

const COLOR_SWATCHES = [
  '#ffffff','#000000','#FFD56A','#ff5a8a','#6ec8ff','#34A89C','#ef4444','#22c55e',
  '#eab308','#f97316','#a855f7','#06b6d4','#f472b6','#3730a3','#b91c1c','#fef3c7',
];

type Align = 'left' | 'center' | 'right';
type Weight = 400 | 700 | 900;

interface TextEl {
  id: 'score' | 'hometeam' | 'awayteam' | 'tag';
  x: number; y: number;
}

interface ImgLayer {
  id: string;
  src: string;
  w: number; h: number;
  x: number; y: number;
  scale: number;
}

interface Props { locale?: Locale; }

const WcPosterGenerator: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [sizeKey, setSizeKey] = useState<SizeKey>('16:9');
  const [homeTeam, setHomeTeam] = useState<string>('ARGENTINA');
  const [awayTeam, setAwayTeam] = useState<string>('FRANCE');
  const [scoreH, setScoreH] = useState<number>(2);
  const [scoreA, setScoreA] = useState<number>(1);
  const [matchTag, setMatchTag] = useState<string>(locale === 'zh' ? '半决赛' : 'SEMIFINAL');
  const [bgKey, setBgKey] = useState<string>('wc2026');
  const [leftKey, setLeftKey] = useState<string>('ARG');
  const [rightKey, setRightKey] = useState<string>('FRA');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSizePx, setFontSizePx] = useState<number>(200);
  const [align, setAlign] = useState<Align>('center');
  const [weight, setWeight] = useState<Weight>(900);
  const [selId, setSelId] = useState<string | null>('score');
  const [imgs, setImgs] = useState<ImgLayer[]>([]);
  const [exported, setExported] = useState(false);
  const [renderTick, setRenderTick] = useState(0);

  const SIZE = SIZE_PRESETS[sizeKey];
  const BG = useMemo(() => BG_THEMES.find((b) => b.key === bgKey) ?? BG_THEMES[0], [bgKey]);
  const LT = useMemo(() => TEAMS_48.find((x) => x.key === leftKey) ?? TEAMS_48[0], [leftKey]);
  const RT = useMemo(() => TEAMS_48.find((x) => x.key === rightKey) ?? TEAMS_48[1], [rightKey]);

  const defaultPos = useMemo(() => {
    const H = SIZE.h, W = SIZE.w;
    return {
      score:    { x: W / 2, y: H * 0.52 },
      hometeam: { x: W * 0.28, y: H * 0.40 },
      awayteam: { x: W * 0.72, y: H * 0.40 },
      tag:      { x: W / 2, y: H * 0.20 },
    };
  }, [SIZE]);

  const [els, setEls] = useState<Record<TextEl['id'], TextEl>>(() => ({
    score:    { id:'score',    ...defaultPos.score },
    hometeam: { id:'hometeam', ...defaultPos.hometeam },
    awayteam: { id:'awayteam', ...defaultPos.awayteam },
    tag:      { id:'tag',      ...defaultPos.tag },
  }));

  useEffect(() => {
    setEls({
      score:    { id:'score',    ...defaultPos.score },
      hometeam: { id:'hometeam', ...defaultPos.hometeam },
      awayteam: { id:'awayteam', ...defaultPos.awayteam },
      tag:      { id:'tag',      ...defaultPos.tag },
    });
  }, [defaultPos]);

  const drawFlagBadge = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, tm: Team48, dir: 1 | -1) => {
    ctx.save();
    const grd = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grd.addColorStop(0, tm.colors[0]);
    grd.addColorStop(0.55, tm.colors[1] ?? '#ffffff');
    if (tm.colors[2]) grd.addColorStop(1, tm.colors[2]); else grd.addColorStop(1, tm.colors[0]);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = Math.max(4, r * 0.05);
    ctx.beginPath(); ctx.arc(cx, cy, r - r * 0.04, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r - r * 0.04, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.font = `900 ${Math.floor(r * 0.48)}px "Arial Black", Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = Math.max(2, r * 0.03);
    ctx.strokeText(tm.key, cx, cy);
    ctx.fillText(tm.key, cx, cy);
    ctx.restore();
  };

  const drawBall = (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2);
    const grd = ctx.createRadialGradient(cx - s * 0.35, cy - s * 0.35, s * 0.1, cx, cy, s);
    grd.addColorStop(0, '#ffffff'); grd.addColorStop(1, '#d7d9de');
    ctx.fillStyle = grd; ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = Math.max(1.5, s / 14); ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (s * 0.38), cy + Math.sin(a) * (s * 0.38));
      ctx.quadraticCurveTo(cx, cy,
        cx + Math.cos(a + Math.PI * 2 / 5) * (s * 0.36),
        cy + Math.sin(a + Math.PI * 2 / 5) * (s * 0.36));
      ctx.strokeStyle = '#111'; ctx.lineWidth = Math.max(1.2, s / 20); ctx.stroke();
    }
    const pentAngles = [0,1,2,3,4].map(i => (i / 5) * Math.PI * 2 - Math.PI / 2);
    for (let i = 0; i < 5; i++) {
      const a1 = pentAngles[i], a2 = pentAngles[(i + 1) % 5];
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * s * 0.38, cy + Math.sin(a1) * s * 0.38);
      ctx.lineTo(cx + Math.cos((a1 + a2) / 2) * s * 0.55, cy + Math.sin((a1 + a2) / 2) * s * 0.55);
      ctx.lineTo(cx + Math.cos(a2) * s * 0.38, cy + Math.sin(a2) * s * 0.38);
      ctx.closePath(); ctx.fillStyle = '#111'; ctx.fill();
    }
    ctx.restore();
  };

  const render = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const W = c.width = SIZE.w, H = c.height = SIZE.h;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, BG.stops[0]); g.addColorStop(0.5, BG.stops[1]); g.addColorStop(1, BG.stops[2] ?? BG.stops[0]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    const rng = (n: number) => (Math.sin(n * 9301.37) * 0.5 + 0.5);
    for (let k = 0; k < 60; k++) {
      const x = rng(k + 1) * W, y = rng(k + 50) * H, s = 0.6 + rng(k + 99) * 1.8;
      ctx.globalAlpha = 0.05 + rng(k + 150) * 0.08;
      ctx.fillStyle = BG.key === 'paper' ? '#8a7a55' : (BG.key === 'noir' ? '#ffffff' : '#ffffff');
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    const gridColor = BG.key === 'paper' ? 'rgba(90,70,40,0.08)' : 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    const step = Math.max(40, Math.min(W, H) / 18);
    for (let x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const isWide = W >= H;
    const flagR = Math.min(W, H) * (isWide ? 0.16 : 0.13);
    const leftCX = isWide ? W * 0.18 : W * 0.25;
    const rightCX = isWide ? W * 0.82 : W * 0.75;
    const flagCY = isWide ? H * 0.30 : H * 0.24;
    drawFlagBadge(ctx, leftCX, flagCY, flagR, LT, 1);
    drawFlagBadge(ctx, rightCX, flagCY, flagR, RT, -1);

    const ballCount = isWide ? 4 : 3;
    for (let i = 0; i < ballCount; i++) {
      const bx = isWide ? W * (0.08 + i * 0.28) : W * (0.18 + (i % 2) * 0.64);
      const by = isWide ? H * (0.88 - (i % 2) * 0.08) : H * (0.78 + Math.floor(i / 2) * 0.16);
      const bs = Math.min(W, H) * (0.04 + rng(i + 7) * 0.015);
      drawBall(ctx, bx, by, bs, 0.65);
    }
    drawBall(ctx, W / 2, H * (isWide ? 0.80 : 0.88), Math.min(W, H) * 0.07, 0.9);

    const topAccentY = H * 0.08;
    ctx.save();
    const accentG = ctx.createLinearGradient(W * 0.2, topAccentY, W * 0.8, topAccentY);
    accentG.addColorStop(0, LT.colors[0]); accentG.addColorStop(0.5, '#ffffff'); accentG.addColorStop(1, RT.colors[0]);
    ctx.fillStyle = accentG;
    const barH = Math.max(4, H * 0.005);
    ctx.fillRect(W * 0.15, topAccentY - barH / 2, W * 0.7, barH);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `600 ${Math.floor(H * 0.022)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const worldCupText = locale === 'zh' ? 'FIFA 世界杯 2026 · 美加墨' : 'FIFA WORLD CUP 2026 · NA';
    ctx.fillText(worldCupText, W / 2, topAccentY - H * 0.025);
    ctx.restore();

    for (const layer of imgs) {
      try {
        const imgEl = (imgCacheRef.current as any)[layer.id];
        if (imgEl && imgEl.complete && imgEl.naturalWidth) {
          const iw = layer.w * layer.scale, ih = layer.h * layer.scale;
          ctx.save();
          ctx.globalAlpha = 0.98;
          ctx.drawImage(imgEl, layer.x - iw / 2, layer.y - ih / 2, iw, ih);
          ctx.restore();
        }
      } catch {}
    }

    const weightStr = weight === 400 ? '400' : weight === 700 ? '700' : '900';
    const weightName = weight === 400 ? 'Inter' : weight === 700 ? 'Arial' : '"Arial Black"';
    ctx.textBaseline = 'middle';

    ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
    const scoreTxt = `${scoreH}  -  ${scoreA}`;
    const scoreFont = Math.max(48, Math.floor(fontSizePx * (H / 1080)));
    ctx.font = `${weightStr} ${scoreFont}px ${weightName}, sans-serif`;
    const se = els.score;
    if (selId === 'score') {
      const m = ctx.measureText(scoreTxt);
      const bx = se.x - (align === 'center' ? m.width / 2 : align === 'right' ? m.width : 0) - 18;
      const by = se.y - scoreFont * 0.65;
      const bw = m.width + 36, bh = scoreFont * 1.3;
      ctx.fillStyle = 'rgba(84,97,168,0.18)';
      ctx.strokeStyle = 'rgba(84,97,168,0.7)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = Math.max(3, scoreFont / 32);
    ctx.strokeText(scoreTxt, se.x, se.y);
    ctx.fillStyle = textColor;
    ctx.fillText(scoreTxt, se.x, se.y);

    const tagFont = Math.max(20, Math.floor(H * 0.03));
    ctx.font = `700 ${tagFont}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    const te = els.tag;
    const tagPadX = 26, tagPadY = 14;
    const tagW = ctx.measureText(matchTag).width + tagPadX * 2;
    const tagX = te.x - tagW / 2, tagY = te.y - (tagFont * 0.6 + tagPadY);
    const tagH = tagFont * 1.2 + tagPadY * 2;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tagX, tagY, tagW, tagH, 14); else ctx.rect(tagX, tagY, tagW, tagH);
    ctx.fill();
    ctx.strokeStyle = LT.colors[0]; ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tagX, tagY, tagW, tagH, 14); else ctx.rect(tagX, tagY, tagW, tagH);
    ctx.stroke();
    if (selId === 'tag') {
      ctx.strokeStyle = 'rgba(84,97,168,0.9)'; ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(tagX - 6, tagY - 6, tagW + 12, tagH + 12, 18);
      else ctx.rect(tagX - 6, tagY - 6, tagW + 12, tagH + 12);
      ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillText(matchTag, te.x, te.y);

    const teamFont = Math.max(24, Math.floor(H * 0.042));
    ctx.font = `800 ${teamFont}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    const drawTeam = (txt: string, pos: TextEl, which: 'home' | 'away') => {
      if (selId === (which === 'home' ? 'hometeam' : 'awayteam')) {
        const m = ctx.measureText(txt);
        const bx = pos.x - m.width / 2 - 14;
        const by = pos.y - teamFont * 0.6;
        ctx.fillStyle = 'rgba(52,168,156,0.15)';
        ctx.strokeStyle = 'rgba(52,168,156,0.8)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(bx, by, m.width + 28, teamFont * 1.2); ctx.fill(); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = Math.max(2, teamFont / 36);
      ctx.strokeText(txt, pos.x, pos.y);
      ctx.fillStyle = textColor;
      ctx.fillText(txt, pos.x, pos.y);
    };
    drawTeam(homeTeam.toUpperCase(), els.hometeam, 'home');
    drawTeam(awayTeam.toUpperCase(), els.awayteam, 'away');

    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `400 ${Math.max(12, Math.floor(H * 0.014))}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('© Fan Poster · No Watermark', W - 24, H - 20);

  }, [SIZE, BG, LT, RT, scoreH, scoreA, matchTag, els, selId, sizeKey, renderTick, textColor, fontSizePx, align, weight, imgs, locale]);

  const imgCacheRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => { render(); }, [render]);

  useEffect(() => {
    for (const layer of imgs) {
      if ((imgCacheRef.current as any)[layer.id]) continue;
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => setRenderTick((x) => x + 1);
      el.src = layer.src;
      (imgCacheRef.current as any)[layer.id] = el;
    }
  }, [imgs]);

  const canvasToRealXY = (clientX: number, clientY: number) => {
    const c = canvasRef.current; if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * SIZE.w;
    const y = ((clientY - r.top) / r.height) * SIZE.h;
    return { x, y };
  };

  const dragStateRef = useRef<{ id: string | null; dx: number; dy: number; kind: 'text' | 'img' | null }>({ id: null, dx: 0, dy: 0, kind: null });

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = canvasToRealXY(e.clientX, e.clientY);
    let found: { id: string; dx: number; dy: number; kind: 'text' | 'img' } | null = null;
    for (let i = imgs.length - 1; i >= 0; i--) {
      const l = imgs[i];
      const iw = l.w * l.scale, ih = l.h * l.scale;
      if (p.x >= l.x - iw / 2 && p.x <= l.x + iw / 2 && p.y >= l.y - ih / 2 && p.y <= l.y + ih / 2) {
        found = { id: l.id, dx: p.x - l.x, dy: p.y - l.y, kind: 'img' }; break;
      }
    }
    if (!found) {
      const c = canvasRef.current?.getContext('2d');
      if (c) {
        const order: TextEl['id'][] = ['score', 'hometeam', 'awayteam', 'tag'];
        for (const id of order) {
          const el = els[id];
          let label = '', fsize = 24;
          if (id === 'score') { label = `${scoreH}  -  ${scoreA}`; fsize = Math.max(48, Math.floor(fontSizePx * (SIZE.h / 1080))); }
          else if (id === 'tag') { label = matchTag; fsize = Math.max(20, Math.floor(SIZE.h * 0.03)); }
          else if (id === 'hometeam') { label = homeTeam; fsize = Math.max(24, Math.floor(SIZE.h * 0.042)); }
          else { label = awayTeam; fsize = Math.max(24, Math.floor(SIZE.h * 0.042)); }
          c.font = id === 'score' ? `900 ${fsize}px "Arial Black", sans-serif` : `800 ${fsize}px Inter, Arial, sans-serif`;
          const m = c.measureText(label.toUpperCase());
          const w = m.width + 36, h = fsize * 1.3;
          const bx = el.x - w / 2, by = el.y - h / 2;
          if (p.x >= bx && p.x <= bx + w && p.y >= by && p.y <= by + h) {
            found = { id, dx: p.x - el.x, dy: p.y - el.y, kind: 'text' };
            break;
          }
        }
      }
    }
    if (found) {
      setSelId(found.id);
      dragStateRef.current = { id: found.id, dx: found.dx, dy: found.dy, kind: found.kind };
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    } else {
      setSelId(null);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragStateRef.current.id) return;
    const p = canvasToRealXY(e.clientX, e.clientY);
    const id = dragStateRef.current.id!;
    if (dragStateRef.current.kind === 'img') {
      setImgs((arr) => arr.map((l) => l.id === id ? { ...l, x: p.x - dragStateRef.current.dx, y: p.y - dragStateRef.current.dy } : l));
    } else {
      setEls((prev) => ({ ...prev, [id]: { ...prev[id as TextEl['id']], x: p.x - dragStateRef.current.dx, y: p.y - dragStateRef.current.dy } }));
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragStateRef.current = { id: null, dx: 0, dy: 0, kind: null };
    try { (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId); } catch {}
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const maxDim = Math.min(SIZE.w, SIZE.h) * 0.5;
        const ratio = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
        const layer: ImgLayer = {
          id: `img_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
          src,
          w: img.naturalWidth * ratio,
          h: img.naturalHeight * ratio,
          x: SIZE.w / 2, y: SIZE.h / 2,
          scale: 1,
        };
        setImgs((arr) => [...arr, layer]);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const exportPNG = () => {
    const c = canvasRef.current; if (!c) return;
    const prevSel = selId; setSelId(null);
    setTimeout(() => {
      try {
        c.toBlob((blob) => {
          if (!blob) { setSelId(prevSel); return; }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const slug = `${LT.key}-${RT.key}-${scoreH}-${scoreA}`.replace(/[^A-Za-z0-9-]/g, '');
          a.download = `wc2026-poster-${slug}-${sizeKey.replace(':','x')}.png`;
          document.body.appendChild(a); a.click();
          setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
          setExported(true); setTimeout(() => setExported(false), 1600);
          setSelId(prevSel);
        }, 'image/png', 1.0);
      } catch { setSelId(prevSel); }
    }, 30);
  };

  const resetLayout = () => {
    setEls({
      score:    { id:'score',    ...defaultPos.score },
      hometeam: { id:'hometeam', ...defaultPos.hometeam },
      awayteam: { id:'awayteam', ...defaultPos.awayteam },
      tag:      { id:'tag',      ...defaultPos.tag },
    });
    setImgs([]);
    imgCacheRef.current = {};
    setSelId('score');
    setRenderTick((x) => x + 1);
  };

  return (
    <div ref={wrapRef} className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 card-base p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-[color:var(--color-primary)]" />
            <h2 className="text-[18px] font-bold">{locale === 'zh' ? '世界杯赛事封面海报生成器' : 'World Cup Match Poster'}</h2>
          </div>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">{t.subtitle}</p>

          <div>
            <label className="block text-[13px] font-medium mb-2">{t.sizeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SIZE_PRESETS) as SizeKey[]).map((k) => (
                <button key={k} type="button" onClick={() => setSizeKey(k)}
                  className={`!h-11 px-2 text-[12px] rounded-[var(--radius-md)] border touch-manipulation ${sizeKey === k ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white' : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]'}`}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}>
                  {SIZE_PRESETS[k].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.homeTeamLabel}</label>
              <input value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}
                className="input-base w-full !h-11 text-[13px]"
                style={{ touchAction: 'manipulation' }} />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.awayTeamLabel}</label>
              <input value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}
                className="input-base w-full !h-11 text-[13px]"
                style={{ touchAction: 'manipulation' }} />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.homeScoreLabel}</label>
              <input type="number" min={0} max={20} value={scoreH}
                onChange={(e) => setScoreH(Math.max(0, Math.min(20, parseInt(e.target.value || '0', 10))))}
                className="input-base w-full !h-11 text-[13px]" style={{ touchAction: 'manipulation' }} />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.awayScoreLabel}</label>
              <input type="number" min={0} max={20} value={scoreA}
                onChange={(e) => setScoreA(Math.max(0, Math.min(20, parseInt(e.target.value || '0', 10))))}
                className="input-base w-full !h-11 text-[13px]" style={{ touchAction: 'manipulation' }} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.tagLabel}</label>
            <input value={matchTag} onChange={(e) => setMatchTag(e.target.value)}
              className="input-base w-full !h-11 text-[13px]" style={{ touchAction: 'manipulation' }} />
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-2">{t.bgThemeLabel}</label>
            <div className="grid grid-cols-4 gap-2">
              {BG_THEMES.map((b) => (
                <button key={b.key} type="button" onClick={() => setBgKey(b.key)}
                  className={`!h-11 rounded-[var(--radius-md)] border text-[11px] touch-manipulation relative overflow-hidden ${bgKey === b.key ? 'ring-2 ring-[color:var(--color-primary)]' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${b.stops[0]}, ${b.stops[1]} 45%, ${b.stops[2] ?? b.stops[0]})`,
                    minHeight: 44, border: bgKey === b.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    color: b.key === 'paper' ? '#5a4a25' : (b.key === 'gold' ? '#2a1800' : '#fff'),
                    touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                  }}>
                  <span className="drop-shadow relative z-10">{locale === 'zh' ? b.zh : b.en}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.leftFlagLabel}</label>
              <select value={leftKey} onChange={(e) => setLeftKey(e.target.value)}
                className="input-base w-full !h-11 text-[12px]" style={{ touchAction: 'manipulation' }}>
                {TEAMS_48.map((t) => (<option key={t.key} value={t.key}>{t.en} ({t.key})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.rightFlagLabel}</label>
              <select value={rightKey} onChange={(e) => setRightKey(e.target.value)}
                className="input-base w-full !h-11 text-[12px]" style={{ touchAction: 'manipulation' }}>
                {TEAMS_48.map((t) => (<option key={t.key} value={t.key}>{t.en} ({t.key})</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.alignLabel}</label>
              <div className="grid grid-cols-3 gap-1">
                {(['left','center','right'] as Align[]).map((a) => (
                  <button key={a} type="button" onClick={() => setAlign(a)}
                    className={`!h-11 text-[12px] rounded-[var(--radius-md)] border touch-manipulation ${align === a ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white' : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]'}`}
                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}>
                    {a === 'left' ? t.alignLeft : a === 'center' ? t.alignCenter : t.alignRight}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.weightLabel}</label>
              <div className="grid grid-cols-3 gap-1">
                {([400,700,900] as Weight[]).map((w) => (
                  <button key={w} type="button" onClick={() => setWeight(w)}
                    className={`!h-11 text-[12px] rounded-[var(--radius-md)] border touch-manipulation ${weight === w ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white' : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]'}`}
                    style={{
                      fontWeight: w,
                      touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44,
                    }}>
                    {w === 400 ? t.weightNormal : w === 700 ? t.weightBold : t.weightBlack}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">
              {t.fontSizeLabel}: <span className="font-semibold text-[color:var(--color-primary)]">{fontSizePx}px</span>
            </label>
            <input type="range" min={80} max={360} step={4} value={fontSizePx}
              onChange={(e) => setFontSizePx(parseInt(e.target.value, 10))}
              className="w-full accent-[color:var(--color-primary)]" style={{ touchAction: 'manipulation' }} />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-2 text-[color:var(--color-text-secondary)]">
              <Type className="w-3 h-3 inline mr-1" />{t.textColorLabel}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_SWATCHES.map((col) => (
                <button key={col} type="button" onClick={() => setTextColor(col)}
                  className={`w-8 !h-8 rounded-full border-2 touch-manipulation ${textColor === col ? 'ring-2 ring-[color:var(--color-primary)] ring-offset-2' : ''}`}
                  style={{ background: col, borderColor: '#d1d5db', minHeight: 32, touchAction: 'manipulation' }} />
              ))}
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-[color:var(--color-border)] bg-transparent cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-2 flex items-center gap-1">
              <ImagePlus className="w-4 h-4 text-[color:var(--accent-teal)]" />{t.uploadLabel}
            </label>
            <input ref={fileRef} type="file" accept="image/*" hidden
              onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="btn-primary !h-11 !px-4 inline-flex items-center gap-1 text-[13px] touch-manipulation"
                style={{ touchAction: 'manipulation', minHeight: 44 }}>
                {t.addImg}
              </button>
              {imgs.map((l) => (
                <div key={l.id} className="inline-flex items-center gap-1 !h-11 px-2 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
                  <div className="w-7 h-7 rounded overflow-hidden bg-black/5">
                    <img src={l.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input type="range" min={0.25} max={1.5} step={0.05} value={l.scale}
                    onChange={(e) => setImgs((arr) => arr.map((x) => x.id === l.id ? { ...x, scale: parseFloat(e.target.value) } : x))}
                    className="w-20 accent-[color:var(--color-primary)]" />
                  <button type="button" onClick={() => setImgs((arr) => arr.filter((x) => x.id !== l.id))}
                    className="text-red-500 p-1" style={{ touchAction: 'manipulation', minHeight: 32 }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-[color:var(--color-text-secondary)] mt-2 flex items-center gap-1">
              <Move className="w-3 h-3" />{t.dragTip}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button type="button" onClick={exportPNG}
              className="btn-primary w-full !h-12 text-[15px] inline-flex items-center justify-center gap-2 touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}>
              {exported ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {exported ? t.exported : t.exportBtn}
            </button>
            <button type="button" onClick={resetLayout}
              className="w-full !h-11 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] text-[14px] inline-flex items-center justify-center gap-2 touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}>
              <RotateCcw className="w-4 h-4" />{t.resetBtn}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 card-base p-3 sm:p-5 flex items-center justify-center bg-black/3">
          <div className="w-full" style={{ aspectRatio: `${SIZE.w} / ${SIZE.h}`, maxHeight: '85vh' }}>
            <canvas
              ref={canvasRef}
              width={SIZE.w}
              height={SIZE.h}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="w-full h-auto rounded-[var(--radius-lg)] shadow-xl select-none cursor-move bg-black"
              style={{ imageRendering: 'auto', touchAction: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WcPosterGenerator;
