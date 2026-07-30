'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, Star, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface NameConstellationProps {
  locale?: string;
}

interface Star {
  id: number;
  letter: string;
  x: number;
  y: number;
  color: string;
  size: number;
  brightness: number;
  meaning: string;
  energy: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
}

interface ConstellationData {
  stars: Star[];
  connections: Connection[];
  description: string;
  traits: string[];
  luckyColor: string;
  luckyNumber: number;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '名字星图', subtitle: '把你的名字变成独一无二的星空人格图谱',
    placeholder: '输入你的名字...', generate: '生成星图', regenerate: '重新生成',
    download: '下载 PNG', style: '星空风格',
    styles: ['银河', '极光', '暮光', '梦境'],
    empty: '输入名字，探索你的星图人格',
    loading: 'AI正在解读你的名字...',
    aiFail: 'AI暂时不可用，请稍后重试',
    traits: '性格特质', lucky: '幸运元素',
    luckyColor: '幸运色', luckyNumber: '幸运数字',
    meaning: '字母解读', zoom: '缩放',
    hint: '拖拽移动 · 滚轮缩放 · 点击星星查看解读',
    generated: '已生成',
  },
  en: {
    title: 'Name Constellation', subtitle: 'Transform your name into a unique star-map personality profile',
    placeholder: 'Enter your name...', generate: 'Generate Star Map', regenerate: 'Regenerate',
    download: 'Download PNG', style: 'Galaxy Style',
    styles: ['Milky Way', 'Aurora', 'Twilight', 'Dreamscape'],
    empty: 'Enter your name to explore your stellar personality',
    loading: 'AI is interpreting your name...',
    aiFail: 'AI temporarily unavailable, please retry',
    traits: 'Personality Traits', lucky: 'Lucky Elements',
    luckyColor: 'Lucky Color', luckyNumber: 'Lucky Number',
    meaning: 'Letter Reading', zoom: 'Zoom',
    hint: 'Drag to pan · Scroll to zoom · Click stars for meanings',
    generated: 'Generated',
  },
  es: {
    title: 'Constelación de Nombre', subtitle: 'Transforma tu nombre en un mapa estelar de personalidad único',
    placeholder: 'Ingresa tu nombre...', generate: 'Generar Mapa Estelar', regenerate: 'Regenerar',
    download: 'Descargar PNG', style: 'Estilo Galaxia',
    styles: ['Vía Láctea', 'Aurora', 'Crepúsculo', 'Sueño'],
    empty: 'Ingresa tu nombre para explorar tu personalidad estelar',
    loading: 'IA interpretando tu nombre...',
    aiFail: 'IA temporalmente no disponible, reintenta',
    traits: 'Rasgos de Personalidad', lucky: 'Elementos de Suerte',
    luckyColor: 'Color de Suerte', luckyNumber: 'Número de Suerte',
    meaning: 'Lectura de Letras', zoom: 'Zoom',
    hint: 'Arrastra para mover · Rueda para zoom · Haz clic en estrellas',
    generated: 'Generado',
  },
  fr: {
    title: 'Constellation du Nom', subtitle: 'Transformez votre nom en une carte stellaire de personnalité unique',
    placeholder: 'Entrez votre nom...', generate: 'Générer la Carte', regenerate: 'Régénérer',
    download: 'Télécharger PNG', style: 'Style Galaxie',
    styles: ['Voie Lactée', 'Aurore', 'Crépuscule', 'Rêve'],
    empty: 'Entrez votre nom pour explorer votre personnalité stellaire',
    loading: 'IA en train d\'interpréter votre nom...',
    aiFail: 'IA temporairement indisponible, réessayez',
    traits: 'Traits de Personnalité', lucky: 'Éléments de Chance',
    luckyColor: 'Couleur Chance', luckyNumber: 'Numéro Chance',
    meaning: 'Lecture des Lettres', zoom: 'Zoom',
    hint: 'Glissez pour déplacer · Molette pour zoomer · Cliquez les étoiles',
    generated: 'Généré',
  },
  hi: {
    title: 'नाम तारामंडल', subtitle: 'अपने नाम को एक अद्वितीय तारा-मानचित्र व्यक्तित्व प्रोफ़ाइल में बदलें',
    placeholder: 'अपना नाम दर्ज करें...', generate: 'तारा मानचित्र बनाएं', regenerate: 'पुनर्जन्म',
    download: 'PNG डाउनलोड', style: 'गैलेक्सी शैली',
    styles: ['मिल्की वे', 'अरोरा', 'ट्वाइलाइट', 'ड्रीमस्केप'],
    empty: 'अपना नाम दर्ज करें तारा व्यक्तित्व का पता लगाने के लिए',
    loading: 'AI आपके नाम की व्याख्या कर रहा है...',
    aiFail: 'AI अस्थायी रूप से अनुपलब्ध, पुनः प्रयास करें',
    traits: 'व्यक्तित्व लक्षण', lucky: 'भाग्यशाली तत्व',
    luckyColor: 'भाग्यशाली रंग', luckyNumber: 'भाग्यशाली संख्या',
    meaning: 'अक्षर व्याख्या', zoom: 'ज़ूम',
    hint: 'खींचें · स्क्रोल करें · तारों पर क्लिक करें',
    generated: 'बनाया गया',
  },
  ar: {
    title: 'كوكبة الاسم', subtitle: 'حوّل اسمك إلى خريطة نجوم شخصية فريدة',
    placeholder: 'أدخل اسمك...', generate: 'إنشاء خريطة النجوم', regenerate: 'إعادة إنشاء',
    download: 'تحميل PNG', style: 'نمط المجرة',
    styles: ['درب التبانة', 'الشفق القطبي', 'الشفق', 'الحلم'],
    empty: 'أدخل اسمك لاستكشاف شخصيتك النجمية',
    loading: 'يقوم الذكاء الاصطناعي بتفسير اسمك...',
    aiFail: 'الذكاء الاصطناعي غير متاح مؤقتاً، حاول مرة أخرى',
    traits: 'السمات الشخصية', lucky: 'عناصر الحظ',
    luckyColor: 'لون الحظ', luckyNumber: 'رقم الحظ',
    meaning: 'قراءة الحروف', zoom: 'تكبير',
    hint: 'اسحب للتحريك · عجلة للتكبير · انقر على النجوم',
    generated: 'تم الإنشاء',
  },
};

interface Palette {
  bgColor: string;
  star: string[];
  lineColor: string;
  accent: string;
}

const PALETTES: Record<string, Palette[]> = {
  zh: [
    { bgColor: '#0a0a2e', star: ['#ffffff', '#ffd700', '#87ceeb', '#dda0dd', '#fffacd'], lineColor: 'rgba(255,215,0,0.3)', accent: '#ffd700' },
    { bgColor: '#0d1b2a', star: ['#7df9ff', '#0077b6', '#caf0f8', '#90e0ef', '#ade8f4'], lineColor: 'rgba(125,249,255,0.3)', accent: '#7df9ff' },
    { bgColor: '#1a0a2e', star: ['#e0aaff', '#c77dff', '#9d4edd', '#7b2cbf', '#ffd6ff'], lineColor: 'rgba(224,170,255,0.3)', accent: '#e0aaff' },
    { bgColor: '#0f0c29', star: ['#f5e6ff', '#da8fff', '#b388ff', '#e1bee7', '#f8bbd0'], lineColor: 'rgba(245,230,255,0.3)', accent: '#f5e6ff' },
  ],
  en: [
    { bgColor: '#0a0a2e', star: ['#ffffff', '#ffd700', '#87ceeb', '#dda0dd', '#fffacd'], lineColor: 'rgba(255,215,0,0.3)', accent: '#ffd700' },
    { bgColor: '#0d1b2a', star: ['#7df9ff', '#0077b6', '#caf0f8', '#90e0ef', '#ade8f4'], lineColor: 'rgba(125,249,255,0.3)', accent: '#7df9ff' },
    { bgColor: '#1a0a2e', star: ['#e0aaff', '#c77dff', '#9d4edd', '#7b2cbf', '#ffd6ff'], lineColor: 'rgba(224,170,255,0.3)', accent: '#e0aaff' },
    { bgColor: '#0f0c29', star: ['#f5e6ff', '#da8fff', '#b388ff', '#e1bee7', '#f8bbd0'], lineColor: 'rgba(245,230,255,0.3)', accent: '#f5e6ff' },
  ],
};

function getPalette(locale: string, idx: number): Palette {
  const palettes = PALETTES[locale] || PALETTES.en;
  return palettes[idx % palettes.length];
}

export default function NameConstellation({ locale = 'zh' }: NameConstellationProps) {
  const t = i18n[locale] || i18n.en;
  const [name, setName] = useState('');
  const [styleIdx, setStyleIdx] = useState(0);
  const [data, setData] = useState<ConstellationData | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [, forceUpdate] = useState(0);

  const viewStateRef = useRef({ offsetX: 0, offsetY: 0, scale: 1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; dragging: boolean }>({ startX: 0, startY: 0, dragging: false });
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const timeRef = useRef(0);
  const styleIdxRef = useRef(styleIdx);
  const localeRef = useRef(locale);
  const nameRef = useRef(name);
  const dataRef = useRef<ConstellationData | null>(null);
  const selectedStarRef = useRef<Star | null>(null);

  useEffect(() => { styleIdxRef.current = styleIdx; }, [styleIdx]);
  useEffect(() => { localeRef.current = locale; }, [locale]);
  useEffect(() => { nameRef.current = name; }, [name]);
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { selectedStarRef.current = selectedStar; }, [selectedStar]);

  const generateLocalFallback = useCallback((inputName: string): ConstellationData => {
    const chars = inputName.replace(/\s/g, '').split('');
    const pal = getPalette(localeRef.current, styleIdxRef.current);
    const stars: Star[] = [];
    const connections: Connection[] = [];

    const cx = 400, cy = 300;
    const radius = Math.min(180, 40 + chars.length * 12);

    chars.forEach((ch, i) => {
      const angle = (i / Math.max(chars.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const r = radius + (i % 2 === 0 ? 0 : radius * 0.4);
      const x = cx + Math.cos(angle) * r + (i * 7 % 30) - 15;
      const y = cy + Math.sin(angle) * r + (i * 13 % 30) - 15;
      const meaningKeys = ['独特', '智慧', '勇气', '温柔', '创造', '坚韧', '直觉', '热情', '稳重', '梦想'];
      const meaningEn = ['unique', 'wise', 'brave', 'gentle', 'creative', 'resilient', 'intuitive', 'passionate', 'steady', 'dreamy'];
      const loc = localeRef.current;
      const meaning = loc === 'zh' ? meaningKeys[i % meaningKeys.length] : meaningEn[i % meaningEn.length];
      stars.push({
        id: i,
        letter: ch.toUpperCase(),
        x, y,
        color: pal.star[i % pal.star.length],
        size: 4 + (i % 4) * 1.5,
        brightness: 0.6 + (i % 5) * 0.1,
        meaning,
        energy: 0.5 + (i * 7 % 50) / 100,
      });
    });

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
        if (dist < 120) {
          connections.push({ from: i, to: j, strength: Math.max(0.3, 1 - dist / 120) });
        }
      }
    }

    const loc = localeRef.current;
    const descZh = `你的名字「${inputName}」蕴含着独特的星辰能量。${chars.length}个字母如同${chars.length}颗星辰，在你的人格星图中各自闪耀。它们之间的连线构成了你独一无二的性格图谱——既有${stars[0]?.meaning || ''}的底色，又融合了${stars[stars.length - 1]?.meaning || ''}的光芒。`;
    const descEn = `Your name "${inputName}" contains unique stellar energy. Each of the ${chars.length} letters shines as a star in your personality constellation. Their connections form your one-of-a-kind character map — grounded in ${stars[0]?.meaning || ''} and radiating ${stars[stars.length - 1]?.meaning || ''}.`;

    const traitsZh = ['富有想象力', '情感丰富', '直觉敏锐', '富有创造力', '善于表达'];
    const traitsEn = ['Imaginative', 'Emotionally Rich', 'Intuitive', 'Creative', 'Expressive'];

    return {
      stars,
      connections,
      description: loc === 'zh' ? descZh : descEn,
      traits: loc === 'zh' ? traitsZh : traitsEn,
      luckyColor: pal.accent,
      luckyNumber: chars.reduce((s, c) => s + c.toUpperCase().charCodeAt(0), 0) % 9 + 1,
    };
  }, []);

  const generate = useCallback(async () => {
    if (!nameRef.current.trim()) return;
    setAiLoading(true);
    setAiError(false);
    setSelectedStar(null);
    try {
      const res = await fetch('/api/name-constellation-ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameRef.current.trim(), locale: localeRef.current, style: styleIdxRef.current }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.stars && json.stars.length > 0) {
          setData(json);
          dataRef.current = json;
          starsRef.current = json.stars;
          connectionsRef.current = json.connections || [];
          viewStateRef.current = { offsetX: 0, offsetY: 0, scale: 1 };
          setAiLoading(false);
          return;
        }
      }
      throw new Error('AI failed');
    } catch {
      setAiError(true);
      const fallback = generateLocalFallback(nameRef.current.trim());
      setData(fallback);
      dataRef.current = fallback;
      starsRef.current = fallback.stars;
      connectionsRef.current = fallback.connections;
      viewStateRef.current = { offsetX: 0, offsetY: 0, scale: 1 };
    }
    setAiLoading(false);
  }, [generateLocalFallback]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pal = getPalette(localeRef.current, styleIdxRef.current);

    ctx.clearRect(0, 0, w, h);

    const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
    grd.addColorStop(0, pal.bgColor);
    grd.addColorStop(1, '#000000');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    const stars = starsRef.current;
    const connections = connectionsRef.current;
    const vs = viewStateRef.current;
    const t = timeRef.current;

    ctx.save();
    ctx.translate(vs.offsetX, vs.offsetY);
    ctx.scale(vs.scale, vs.scale);

    // Background stars
    const bgStars = 80;
    for (let i = 0; i < bgStars; i++) {
      const sx = (Math.sin(i * 127.1 + t * 0.0001) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 311.7 + t * 0.0001) * 0.5 + 0.5) * h;
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.002 + i));
      ctx.fillStyle = `rgba(255,255,255,${0.15 * twinkle})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 + twinkle * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connections
    connections.forEach(conn => {
      const s1 = stars[conn.from];
      const s2 = stars[conn.to];
      if (!s1 || !s2) return;
      const alpha = conn.strength * (0.6 + 0.4 * Math.sin(t * 0.003 + conn.from + conn.to));
      ctx.strokeStyle = pal.lineColor.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.lineWidth = 0.5 + conn.strength * 1.5;
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      const mx = (s1.x + s2.x) / 2 + Math.sin(t * 0.002 + conn.from) * 10;
      const my = (s1.y + s2.y) / 2 + Math.cos(t * 0.002 + conn.to) * 10;
      ctx.quadraticCurveTo(mx, my, s2.x, s2.y);
      ctx.stroke();
    });

    // Stars
    const selStar = selectedStarRef.current;
    stars.forEach(star => {
      const twinkle = 0.7 + 0.3 * Math.sin(t * 0.004 + star.id * 1.5);
      const size = star.size * twinkle;
      const isSelected = selStar?.id === star.id;

      // Glow
      const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 4);
      glow.addColorStop(0, star.color + 'cc');
      glow.addColorStop(0.3, star.color + '44');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(star.x, star.y, size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Letter
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, star.size * 1.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(star.letter, star.x, star.y);
    });

    // Title
    if (dataRef.current) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(nameRef.current.toUpperCase(), w / 2, 20);
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      timeRef.current += 16;
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(1, 1);
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: true };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    viewStateRef.current.offsetX += dx;
    viewStateRef.current.offsetY += dy;
    forceUpdate(n => n + 1);
  };

  const handleMouseUp = () => {
    dragRef.current.dragging = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dataRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const vs = viewStateRef.current;
    const wx = (mx - vs.offsetX) / vs.scale;
    const wy = (my - vs.offsetY) / vs.scale;

    const stars = starsRef.current;
    let closest: Star | null = null;
    let minDist = 30 * vs.scale;
    for (const s of stars) {
      const d = Math.hypot(s.x - wx, s.y - wy);
      if (d < minDist) { minDist = d; closest = s; }
    }
    setSelectedStar(closest);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    viewStateRef.current.scale = Math.max(0.3, Math.min(3, viewStateRef.current.scale * delta));
    forceUpdate(n => n + 1);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !dataRef.current) return;
    const link = document.createElement('a');
    link.download = `name-constellation-${nameRef.current || 'star'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleReset = () => {
    viewStateRef.current = { offsetX: 0, offsetY: 0, scale: 1 };
    setSelectedStar(null);
  };

  const zoomIn = () => {
    viewStateRef.current.scale = Math.min(3, viewStateRef.current.scale * 1.2);
    forceUpdate(n => n + 1);
  };

  const zoomOut = () => {
    viewStateRef.current.scale = Math.max(0.3, viewStateRef.current.scale / 1.2);
    forceUpdate(n => n + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <Star className="text-sky-500" size={28} />
          {t.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder={t.placeholder}
            className="flex-1 px-4 py-3 text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[44px] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-700 transition"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
          <button
            onClick={generate}
            disabled={aiLoading || !name.trim()}
            className="px-5 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[44px] font-medium shadow-md flex items-center gap-2 disabled:opacity-60"
          >
            {aiLoading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span className="hidden sm:inline">{aiLoading ? t.loading : t.generate}</span>
          </button>
        </div>

        {/* Style selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t.style}:</span>
          {t.styles.map((s, i) => (
            <button
              key={i}
              onClick={() => setStyleIdx(i)}
              className={`px-3 py-1.5 text-xs rounded-full border transition min-h-[32px] ${
                styleIdx === i
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {aiError && (
          <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
            {t.aiFail}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-black"
        style={{ cursor: data ? 'grab' : 'default' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
        />

        {!data && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <Star size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t.empty}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="text-xs text-white/60 bg-black/30 px-2 py-1 rounded">{t.hint}</div>
            <div className="flex gap-2 pointer-events-auto">
              <button onClick={zoomIn} className="p-1.5 bg-black/40 hover:bg-black/60 rounded text-white" aria-label="zoom in">
                <ZoomIn size={16} />
              </button>
              <button onClick={zoomOut} className="p-1.5 bg-black/40 hover:bg-black/60 rounded text-white" aria-label="zoom out">
                <ZoomOut size={16} />
              </button>
              <button onClick={handleReset} className="p-1.5 bg-black/40 hover:bg-black/60 rounded text-white" aria-label="reset view">
                <Move size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {data && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Description */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-sky-500" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {data.description}
            </p>

            {/* Traits */}
            <div className="mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t.traits}:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.traits.map((trait, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Lucky */}
            <div className="mt-3 flex gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t.luckyColor}:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: data.luckyColor }} />
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{data.luckyColor}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t.luckyNumber}:</span>
                <div className="text-lg font-bold text-sky-500">{data.luckyNumber}</div>
              </div>
            </div>
          </div>

          {/* Star detail / Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            {selectedStar ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {t.meaning}: <span className="text-sky-500">{selectedStar.letter}</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                  {selectedStar.meaning}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedStar.color }} />
                  <span className="text-xs font-mono text-gray-500">{selectedStar.color}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <Star size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">{t.hint}</p>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[40px] font-medium text-sm"
              >
                <Download size={16} />
                {t.download}
              </button>
              <button
                onClick={generate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[40px] font-medium text-sm"
              >
                <RefreshCw size={16} />
                {t.regenerate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}