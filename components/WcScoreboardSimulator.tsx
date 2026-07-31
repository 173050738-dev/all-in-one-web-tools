'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Maximize, Plus, Trophy, Timer, Users } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    subtitle: '虚拟助威记分牌 · 进球烟花特效 · 全屏录视频 · 比赛时间模拟',
    homeTeamLabel: '主队名称',
    awayTeamLabel: '客队名称',
    initialScoreLabel: '初始比分',
    timeLabel: '比赛时间（分钟）',
    controlsLabel: '进球操作',
    goalHome: '主队进球 +',
    goalAway: '客队进球 +',
    startBtn: '开始比赛',
    pauseBtn: '暂停',
    resumeBtn: '继续',
    resetBtn: '重置比赛',
    fullscreenBtn: '全屏模式',
    homeScore: '主队',
    awayScore: '客队',
    running: '比赛中',
    paused: '已暂停',
    finished: '比赛结束',
    g1: '1 球',
    g2: '2 球',
    g3: '3 球',
    customLabel: '自定义',
    pickTeam: '选择国家队配色',
    minute: '分钟',
    addedTime: '伤停补时',
  },
  en: {
    subtitle: 'Virtual scoreboard · goal fireworks · fullscreen record · match timer',
    homeTeamLabel: 'Home team',
    awayTeamLabel: 'Away team',
    initialScoreLabel: 'Initial score',
    timeLabel: 'Match length (min)',
    controlsLabel: 'Goal controls',
    goalHome: 'Home goal +',
    goalAway: 'Away goal +',
    startBtn: 'Start match',
    pauseBtn: 'Pause',
    resumeBtn: 'Resume',
    resetBtn: 'Reset',
    fullscreenBtn: 'Fullscreen',
    homeScore: 'Home',
    awayScore: 'Away',
    running: 'LIVE',
    paused: 'Paused',
    finished: 'FT',
    g1: '+1',
    g2: '+2',
    g3: '+3',
    customLabel: 'Custom',
    pickTeam: 'Team colors',
    minute: 'min',
    addedTime: 'Added time',
  },
  fr: {
    subtitle: 'Tableau de score virtuel · feux d\'artifice · plein écran · chrono',
    homeTeamLabel: 'Équipe domicile',
    awayTeamLabel: 'Équipe extérieure',
    initialScoreLabel: 'Score initial',
    timeLabel: 'Durée (min)',
    controlsLabel: 'Contrôle but',
    goalHome: 'But domicile +',
    goalAway: 'But extérieur +',
    startBtn: 'Démarrer',
    pauseBtn: 'Pause',
    resumeBtn: 'Reprendre',
    resetBtn: 'Réinitialiser',
    fullscreenBtn: 'Plein écran',
    homeScore: 'DOM',
    awayScore: 'EXT',
    running: 'EN DIRECT',
    paused: 'Pause',
    finished: 'Fin',
    g1: '+1',
    g2: '+2',
    g3: '+3',
    customLabel: 'Perso',
    pickTeam: 'Couleurs équipe',
    minute: 'min',
    addedTime: 'Temps ajouté',
  },
  es: {
    subtitle: 'Marcador virtual · fuegos artificiales · pantalla completa · cronómetro',
    homeTeamLabel: 'Equipo local',
    awayTeamLabel: 'Equipo visitante',
    initialScoreLabel: 'Marcador inicial',
    timeLabel: 'Duración (min)',
    controlsLabel: 'Control de goles',
    goalHome: 'Gol local +',
    goalAway: 'Gol visitante +',
    startBtn: 'Iniciar',
    pauseBtn: 'Pausa',
    resumeBtn: 'Continuar',
    resetBtn: 'Reiniciar',
    fullscreenBtn: 'Pantalla completa',
    homeScore: 'LOC',
    awayScore: 'VIS',
    running: 'EN VIVO',
    paused: 'Pausa',
    finished: 'Final',
    g1: '+1',
    g2: '+2',
    g3: '+3',
    customLabel: 'Perso',
    pickTeam: 'Colores equipo',
    minute: 'min',
    addedTime: 'Tiempo añadido',
  },
  hi: {
    subtitle: 'वर्चुअल स्कोरबोर्ड · गोल आतिशबाज़ी · फुलस्क्रीन रिकॉर्ड · मैच टाइमर',
    homeTeamLabel: 'होम टीम',
    awayTeamLabel: 'अवे टीम',
    initialScoreLabel: 'प्रारंभिक स्कोर',
    timeLabel: 'मैच अवधि (मिनट)',
    controlsLabel: 'गोल नियंत्रण',
    goalHome: 'होम गोल +',
    goalAway: 'अवे गोल +',
    startBtn: 'शुरू करें',
    pauseBtn: 'रोकें',
    resumeBtn: 'जारी रखें',
    resetBtn: 'रीसेट',
    fullscreenBtn: 'फुलस्क्रीन',
    homeScore: 'होम',
    awayScore: 'अवे',
    running: 'लाइव',
    paused: 'रुका हुआ',
    finished: 'समाप्त',
    g1: '+1',
    g2: '+2',
    g3: '+3',
    customLabel: 'कस्टम',
    pickTeam: 'टीम रंग',
    minute: 'मिनट',
    addedTime: 'अतिरिक्त समय',
  },
  ar: {
    subtitle: 'لوحة نتائج افتراضية · الألعاب النارية · ملء الشاشة · توقيت المباراة',
    homeTeamLabel: 'الفريق المضيف',
    awayTeamLabel: 'الفريق الضيف',
    initialScoreLabel: 'النتيجة الأولية',
    timeLabel: 'مدة المباراة (دقيقة)',
    controlsLabel: 'تحكم الأهداف',
    goalHome: 'هدف المضيف +',
    goalAway: 'هدف الضيف +',
    startBtn: 'ابدأ',
    pauseBtn: 'إيقاف مؤقت',
    resumeBtn: 'استمرار',
    resetBtn: 'إعادة تعيين',
    fullscreenBtn: 'ملء الشاشة',
    homeScore: 'مضيف',
    awayScore: 'ضيف',
    running: 'مباشر',
    paused: 'متوقف',
    finished: 'انتهت',
    g1: '+1',
    g2: '+2',
    g3: '+3',
    customLabel: 'مخصص',
    pickTeam: 'ألوان الفريق',
    minute: 'دقيقة',
    addedTime: 'وقت إضافي',
  },
};

interface Tm { key: string; en: string; zh: string; colors: [string, string, string?]; }

const TEAMS: Tm[] = [
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
  { key:'KOR', en:'S.Korea', zh:'韩国', colors:['#FFFFFF','#C60C30','#003478'] },
  { key:'MAR', en:'Morocco', zh:'摩洛哥', colors:['#C1272D','#006233','#FFFFFF'] },
  { key:'SAU', en:'Saudi', zh:'沙特', colors:['#006C35','#FFFFFF','#CF142B'] },
  { key:'AUS', en:'Australia', zh:'澳大利亚', colors:['#00843D','#FFCD00','#00008B'] },
  { key:'DEN', en:'Denmark', zh:'丹麦', colors:['#C8102E','#FFFFFF','#000000'] },
  { key:'SUI', en:'Switzerland', zh:'瑞士', colors:['#FF0000','#FFFFFF','#D52B1E'] },
  { key:'SRB', en:'Serbia', zh:'塞尔维亚', colors:['#0C4076','#C6363C','#FFFFFF'] },
  { key:'CMR', en:'Cameroon', zh:'喀麦隆', colors:['#007A5E','#CE1126','#FCD116'] },
  { key:'SEN', en:'Senegal', zh:'塞内加尔', colors:['#00853F','#FDEF42','#E31B23'] },
  { key:'GHA', en:'Ghana', zh:'加纳', colors:['#CE1126','#FCD116','#006B3F'] },
  { key:'COL', en:'Colombia', zh:'哥伦比亚', colors:['#FCD116','#003893','#CE1126'] },
  { key:'CHI', en:'Chile', zh:'智利', colors:['#0039A6','#FFFFFF','#D8232A'] },
  { key:'EGY', en:'Egypt', zh:'埃及', colors:['#CE1126','#FFFFFF','#CE1126'] },
  { key:'NGA', en:'Nigeria', zh:'尼日利亚', colors:['#008751','#FFFFFF','#008751'] },
  { key:'CIV', en:'Ivory Coast', zh:'科特迪瓦', colors:['#F77F00','#FFFFFF','#009E60'] },
  { key:'POL', en:'Poland', zh:'波兰', colors:['#FFFFFF','#DC143C','#FFFFFF'] },
];

type MatchState = 'idle' | 'running' | 'paused' | 'finished';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; max: number;
  size: number; color: string;
  kind: 'spark' | 'burst' | 'trail';
  grav?: number;
}

interface Props { locale?: Locale; }

const WcScoreboardSimulator: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const fsRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);

  const [homeTeam, setHomeTeam] = useState<string>('ARGENTINA');
  const [awayTeam, setAwayTeam] = useState<string>('FRANCE');
  const [homeKey, setHomeKey] = useState<string>('ARG');
  const [awayKey, setAwayKey] = useState<string>('FRA');
  const [scoreH, setScoreH] = useState<number>(0);
  const [scoreA, setScoreA] = useState<number>(0);
  const [totalMin, setTotalMin] = useState<number>(90);
  const [addedMin, setAddedMin] = useState<number>(0);
  const [curSec, setCurSec] = useState<number>(0);
  const [state, setState] = useState<MatchState>('idle');
  const [isFs, setIsFs] = useState(false);

  const [bounceH, setBounceH] = useState(0);
  const [bounceA, setBounceA] = useState(0);
  const [flashSide, setFlashSide] = useState<'home' | 'away' | null>(null);

  const HT = useMemo(() => TEAMS.find(x => x.key === homeKey) ?? TEAMS[0], [homeKey]);
  const AT = useMemo(() => TEAMS.find(x => x.key === awayKey) ?? TEAMS[1], [awayKey]);

  useEffect(() => { setHomeTeam(HT.en.toUpperCase()); }, [HT]);
  useEffect(() => { setAwayTeam(AT.en.toUpperCase()); }, [AT]);

  const totalSec = useMemo(() => {
    const add = state === 'finished' ? 0 : addedMin * 60;
    return totalMin * 60 + add;
  }, [totalMin, addedMin, state]);

  const elapsedMin = Math.floor(curSec / 60);
  const elapsedSecPadded = String(curSec % 60).padStart(2, '0');

  useEffect(() => {
    if (state !== 'running') return;
    const startTs = performance.now() - (curSec * 1000);
    let raf = 0;
    const loop = (ts: number) => {
      const nowSec = Math.floor((ts - startTs) / 1000);
      if (nowSec >= totalSec) {
        setCurSec(totalSec);
        setState('finished');
        return;
      }
      setCurSec(nowSec);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state, totalSec]);

  const spawnFireworks = useCallback((cx: number, cy: number, color: string, scale = 1) => {
    const count = Math.floor(80 * scale);
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = (1.5 + Math.random() * 5) * scale;
      particlesRef.current.push({
        x: cx, y: cy, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
        life: 0, max: 60 + Math.random() * 40, size: 1.5 + Math.random() * 3 * scale,
        color: Math.random() < 0.5 ? color : ['#FFD56A','#ffffff','#ff9060','#ff5a8a','#6ec8ff'][Math.floor(Math.random()*5)],
        kind: Math.random() < 0.3 ? 'burst' : 'spark',
        grav: 0.05 + Math.random() * 0.06,
      });
    }
    for (let tr = 0; tr < 10; tr++) {
      const ang = Math.random() * Math.PI * 2;
      particlesRef.current.push({
        x: cx, y: cy, vx: Math.cos(ang) * 2, vy: Math.sin(ang) * 2 - 3,
        life: 0, max: 40 + Math.random() * 30, size: 1.5, color,
        kind: 'trail', grav: 0.08,
      });
    }
  }, []);

  useEffect(() => {
    const fx = fxRef.current;
    if (!fx) return;
    const draw = () => {
      tickRef.current++;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = fx.clientWidth, h = fx.clientHeight;
      if (fx.width !== w * dpr) { fx.width = w * dpr; fx.height = h * dpr; }
      const ctx = fx.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        const ps = particlesRef.current;
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          if (p.grav) p.vy += p.grav;
          p.vx *= 0.99; p.vy *= 0.99;
          const a = 1 - p.life / p.max;
          if (a <= 0 || p.life >= p.max) { ps.splice(i, 1); continue; }
          ctx.save();
          ctx.globalAlpha = Math.max(0, a);
          if (p.kind === 'burst') {
            const r = p.size * (1 + a * 0.8);
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2);
            g.addColorStop(0, p.color);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, r * 2, 0, Math.PI * 2); ctx.fill();
          } else if (p.kind === 'trail') {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.globalAlpha = Math.max(0, a * 0.7);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
            ctx.stroke();
          } else {
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
        if (flashSide) {
          ctx.save();
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          const col = flashSide === 'home' ? (HT.colors[0]) : (AT.colors[0]);
          grad.addColorStop(0, flashSide === 'home' ? col : 'rgba(255,255,255,0)');
          grad.addColorStop(0.5, 'rgba(255,255,255,0.25)');
          grad.addColorStop(1, flashSide === 'away' ? col : 'rgba(255,255,255,0)');
          const alpha = Math.max(0, 0.45 - (tickRef.current % 60) * 0.012);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
          if (tickRef.current % 60 === 0) setFlashSide(null);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [flashSide, HT, AT]);

  const triggerGoal = useCallback((side: 'home' | 'away', n: number) => {
    if (side === 'home') {
      setScoreH((s) => s + n);
      setBounceH((b) => b + 1);
    } else {
      setScoreA((s) => s + n);
      setBounceA((b) => b + 1);
    }
    setFlashSide(side);
    const fx = fxRef.current;
    if (fx) {
      const w = fx.clientWidth, h = fx.clientHeight;
      const baseX = side === 'home' ? w * 0.22 : w * 0.78;
      const baseY = h * 0.55;
      const color = side === 'home' ? HT.colors[0] : AT.colors[0];
      const scale = n === 1 ? 1 : n === 2 ? 1.35 : 1.8;
      spawnFireworks(baseX, baseY, color, scale);
      spawnFireworks(baseX + (side === 'home' ? -80 : 80), baseY - 80, '#FFD56A', scale * 0.6);
      for (let k = 0; k < n; k++) {
        setTimeout(() => {
          spawnFireworks(baseX + (Math.random() - 0.5) * 180, baseY + (Math.random() - 0.5) * 120, color, 0.8 + Math.random() * 0.5);
        }, 120 * k + 60);
      }
    }
  }, [HT, AT, spawnFireworks]);

  const startMatch = () => { setCurSec(0); setState('running'); };
  const togglePause = () => { setState(state === 'running' ? 'paused' : 'running'); };
  const resetMatch = () => { setState('idle'); setCurSec(0); setScoreH(0); setScoreA(0); particlesRef.current = []; };

  const toggleFullscreen = async () => {
    const el = fsRef.current; if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen?.();
        setIsFs(true);
      } else {
        await document.exitFullscreen?.();
        setIsFs(false);
      }
    } catch {}
  };

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const fmtTime = () => {
    const m = Math.min(elapsedMin, totalMin);
    let tag = '';
    if (state === 'running' || state === 'paused') {
      if (elapsedMin > totalMin) tag = `+${elapsedMin - totalMin}`;
    }
    return `${m}'${tag ? tag : ''}`;
  };

  const stateLabel = state === 'running' ? t.running : state === 'paused' ? t.paused : state === 'finished' ? t.finished : '';

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div ref={fsRef} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 card-base p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-[color:var(--color-primary)]" />
              <h1 className="text-[18px] font-bold">{locale === 'zh' ? '世界杯助威记分牌模拟器' : 'World Cup Scoreboard'}</h1>
            </div>
            <p className="text-[13px] text-[color:var(--color-text-secondary)]">{t.subtitle}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.homeTeamLabel}</label>
                <input value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}
                  className="input-base w-full !h-11 text-[13px]" style={{ touchAction: 'manipulation' }} />
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.awayTeamLabel}</label>
                <input value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}
                  className="input-base w-full !h-11 text-[13px]" style={{ touchAction: 'manipulation' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">🏳️ {t.pickTeam} · {t.homeScore}</label>
                <select value={homeKey} onChange={(e) => setHomeKey(e.target.value)}
                  className="input-base w-full !h-11 text-[12px]" style={{ touchAction: 'manipulation' }}>
                  {TEAMS.map((t) => (<option key={t.key} value={t.key}>{t.en} ({t.key})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">🏳️ {t.pickTeam} · {t.awayScore}</label>
                <select value={awayKey} onChange={(e) => setAwayKey(e.target.value)}
                  className="input-base w-full !h-11 text-[12px]" style={{ touchAction: 'manipulation' }}>
                  {TEAMS.map((t) => (<option key={t.key} value={t.key}>{t.en} ({t.key})</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">{t.initialScoreLabel}</label>
              <div className="grid grid-cols-4 gap-2 items-center">
                <div>
                  <input type="number" min={0} max={30} value={scoreH}
                    onChange={(e) => setScoreH(Math.max(0, Math.min(30, parseInt(e.target.value || '0', 10))))}
                    className="input-base w-full !h-11 text-center text-[18px] font-bold" style={{ touchAction: 'manipulation' }} />
                </div>
                <div className="text-center text-[20px] font-bold text-[color:var(--color-text-secondary)]">VS</div>
                <div>
                  <input type="number" min={0} max={30} value={scoreA}
                    onChange={(e) => setScoreA(Math.max(0, Math.min(30, parseInt(e.target.value || '0', 10))))}
                    className="input-base w-full !h-11 text-center text-[18px] font-bold" style={{ touchAction: 'manipulation' }} />
                </div>
                <button type="button" onClick={resetMatch}
                  className="!h-11 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] text-[12px] inline-flex items-center justify-center gap-1 touch-manipulation"
                  style={{ touchAction: 'manipulation', minHeight: 44 }}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]"><Timer className="w-3 h-3 inline mr-1" />{t.timeLabel}</label>
                <select value={totalMin} onChange={(e) => setTotalMin(parseInt(e.target.value, 10))}
                  className="input-base w-full !h-11 text-[12px]" style={{ touchAction: 'manipulation' }}>
                  {[10, 30, 45, 60, 75, 90, 120].map(m => (
                    <option key={m} value={m}>{m} {t.minute}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1 text-[color:var(--color-text-secondary)]">⏱️ {t.addedTime}</label>
                <select value={addedMin} onChange={(e) => setAddedMin(parseInt(e.target.value, 10))}
                  className="input-base w-full !h-11 text-[12px]" style={{ touchAction: 'manipulation' }}>
                  {[0, 1, 2, 3, 4, 5, 7, 10].map(m => (<option key={m} value={m}>+{m} {t.minute}</option>))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[13px] font-semibold flex items-center gap-1">
                <Plus className="w-4 h-4 text-[color:var(--accent-teal)]" />{t.controlsLabel}
              </div>
              <div>
                <div className="text-[12px] font-medium mb-2 text-[color:var(--color-text-secondary)]">
                  <Users className="w-3 h-3 inline mr-1" />{t.goalHome} · <span className="font-semibold" style={{ color: HT.colors[0] }}>{homeTeam.slice(0, 18)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map(n => (
                    <button key={`h-${n}`} type="button" onClick={() => triggerGoal('home', n)}
                      className="!h-12 rounded-[var(--radius-md)] text-white font-bold text-[15px] touch-manipulation inline-flex items-center justify-center gap-1"
                      style={{
                        background: `linear-gradient(135deg, ${HT.colors[0]}, ${HT.colors[2] ?? HT.colors[1] ?? HT.colors[0]})`,
                        minHeight: 48, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}>
                      <Plus className="w-4 h-4" />{n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-medium mb-2 text-[color:var(--color-text-secondary)]">
                  <Users className="w-3 h-3 inline mr-1" />{t.goalAway} · <span className="font-semibold" style={{ color: AT.colors[0] }}>{awayTeam.slice(0, 18)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map(n => (
                    <button key={`a-${n}`} type="button" onClick={() => triggerGoal('away', n)}
                      className="!h-12 rounded-[var(--radius-md)] text-white font-bold text-[15px] touch-manipulation inline-flex items-center justify-center gap-1"
                      style={{
                        background: `linear-gradient(135deg, ${AT.colors[0]}, ${AT.colors[2] ?? AT.colors[1] ?? AT.colors[0]})`,
                        minHeight: 48, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}>
                      <Plus className="w-4 h-4" />{n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-3 gap-2">
                {state === 'idle' ? (
                  <button type="button" onClick={startMatch}
                    className="btn-primary col-span-3 !h-12 text-[15px] inline-flex items-center justify-center gap-2 touch-manipulation"
                    style={{ touchAction: 'manipulation', minHeight: 48 }}>
                    <Play className="w-4 h-4" />{t.startBtn}
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={togglePause}
                      className={`!h-12 rounded-[var(--radius-md)] text-[14px] font-semibold touch-manipulation inline-flex items-center justify-center gap-1 ${state === 'paused' ? 'btn-primary' : 'bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border)] text-[color:var(--color-text-primary)]'}`}
                      style={{ touchAction: 'manipulation', minHeight: 48 }}>
                      {state === 'running' ? <><Pause className="w-4 h-4" />{t.pauseBtn}</> : <><Play className="w-4 h-4" />{t.resumeBtn}</>}
                    </button>
                    <button type="button" onClick={resetMatch}
                      className="!h-12 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] text-[14px] font-semibold inline-flex items-center justify-center gap-1 touch-manipulation"
                      style={{ touchAction: 'manipulation', minHeight: 48 }}>
                      <RotateCcw className="w-4 h-4" />{t.resetBtn}
                    </button>
                    <button type="button" onClick={toggleFullscreen}
                      className="!h-12 rounded-[var(--radius-md)] border border-[color:var(--color-primary)] text-[color:var(--color-primary)] font-semibold text-[14px] bg-[color:var(--color-bg-primary)] inline-flex items-center justify-center gap-1 hover:bg-[color:var(--color-primary)] hover:text-white transition touch-manipulation"
                      style={{ touchAction: 'manipulation', minHeight: 48 }}>
                      <Maximize className="w-4 h-4" />
                      {isFs ? '✓' : t.fullscreenBtn}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="card-base p-3 sm:p-4 overflow-hidden relative" style={{
              background: 'linear-gradient(180deg, #0a0f25 0%, #0b1e4a 50%, #0a0f25 100%)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                <canvas ref={fxRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }} />
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex items-stretch w-full" style={{
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75), rgba(0,0,0,0.55))',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    margin: '10px',
                    overflow: 'hidden',
                  }}>
                    <ScoreSide tm={HT} name={homeTeam} score={scoreH} scoreBounce={bounceH} side="home" locale={locale} />
                    <div className="flex flex-col items-center justify-center px-3 sm:px-5 py-2 sm:py-3" style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                      borderLeft: '1px solid rgba(255,255,255,0.1)',
                      borderRight: '1px solid rgba(255,255,255,0.1)',
                      minWidth: '22%',
                    }}>
                      <div className="text-[10px] sm:text-[11px] font-bold text-white/60 tracking-wider">
                        {stateLabel}
                      </div>
                      <div className="text-[22px] sm:text-[34px] font-black text-white leading-none mt-1 tabular-nums" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                        {fmtTime()}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-white/50 mt-1 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{
                          background: state === 'running' ? '#22c55e' : state === 'paused' ? '#eab308' : state === 'finished' ? '#ef4444' : '#6b7280',
                          boxShadow: state === 'running' ? '0 0 6px #22c55e' : 'none',
                        }} />
                        {totalMin}{t.minute} {addedMin > 0 ? `+${addedMin}` : ''}
                      </div>
                    </div>
                    <ScoreSide tm={AT} name={awayTeam} score={scoreA} scoreBounce={bounceA} side="away" locale={locale} />
                  </div>

                  <div className="flex-1 flex items-center justify-center px-4 pb-4">
                    <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <FlagBadge tm={HT} size={0.18} />
                        <div className="text-white font-bold text-[14px] sm:text-[18px] text-center tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                          {homeTeam.slice(0, 14)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-6 px-3 sm:px-6 py-3 rounded-2xl" style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}>
                        <Bouncy value={scoreH} bounce={bounceH} color={HT.colors[0]} />
                        <div className="text-white/40 font-black text-[28px] sm:text-[46px]">:</div>
                        <Bouncy value={scoreA} bounce={bounceA} color={AT.colors[0]} />
                      </div>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <FlagBadge tm={AT} size={0.18} />
                        <div className="text-white font-bold text-[14px] sm:text-[18px] text-center tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                          {awayTeam.slice(0, 14)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-white/50 text-[10px] sm:text-[11px] pb-2 tracking-wider">
                    FIFA WORLD CUP 2026 · 美加墨 · FAN SCOREBOARD
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button type="button" onClick={togglePause}
                disabled={state === 'idle' || state === 'finished'}
                className={`!h-11 rounded-[var(--radius-md)] text-[13px] font-semibold touch-manipulation inline-flex items-center justify-center gap-1 ${state !== 'idle' && state !== 'finished' ? (state === 'paused' ? 'btn-primary' : 'bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border)]') : 'bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border)] opacity-50'}`}
                style={{ touchAction: 'manipulation', minHeight: 44 }}>
                {state === 'paused' ? <><Play className="w-4 h-4" />{t.resumeBtn}</> : <><Pause className="w-4 h-4" />{t.pauseBtn}</>}
              </button>
              <button type="button" onClick={resetMatch}
                className="!h-11 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] text-[13px] font-semibold inline-flex items-center justify-center gap-1 touch-manipulation"
                style={{ touchAction: 'manipulation', minHeight: 44 }}>
                <RotateCcw className="w-4 h-4" />{t.resetBtn}
              </button>
              <button type="button" onClick={toggleFullscreen}
                className="!h-11 rounded-[var(--radius-md)] border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary)] font-semibold text-[13px] bg-[color:var(--color-bg-primary)] inline-flex items-center justify-center gap-1 hover:bg-[color:var(--color-primary)] hover:text-white transition touch-manipulation"
                style={{ touchAction: 'manipulation', minHeight: 44 }}>
                <Maximize className="w-4 h-4" />{t.fullscreenBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlagBadge: React.FC<{ tm: Tm; size: number }> = ({ tm, size }) => {
  return (
    <div className="flex items-center justify-center" style={{
      width: '72px', height: '72px',
      maxWidth: '20vw', maxHeight: '20vw',
    }}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id={`g-${tm.key}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tm.colors[0]} />
            <stop offset="55%" stopColor={tm.colors[1] ?? '#ffffff'} />
            <stop offset="100%" stopColor={tm.colors[2] ?? tm.colors[0]} />
          </linearGradient>
          <radialGradient id={`glow-${tm.key}`}>
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill={`url(#g-${tm.key})`} stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="46" fill={`url(#glow-${tm.key})`} />
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
        <text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="900"
          fontFamily="Arial Black, Arial, sans-serif" fill="rgba(0,0,0,0.5)"
          stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
          {tm.key}
        </text>
      </svg>
    </div>
  );
};

const ScoreSide: React.FC<{ tm: Tm; name: string; score: number; scoreBounce: number; side: 'home' | 'away'; locale: Locale }> = ({ tm, name, score, scoreBounce, side, locale }) => {
  return (
    <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3" style={{
      background: side === 'home'
        ? `linear-gradient(90deg, ${tm.colors[0]}33, transparent)`
        : `linear-gradient(-90deg, ${tm.colors[0]}33, transparent)`,
      justifyContent: side === 'home' ? 'flex-start' : 'flex-end',
    }}>
      {side === 'home' && <div style={{
        width: '40px', height: '40px', flexShrink: 0,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${tm.colors[0]}, ${tm.colors[1] ?? '#fff'} 55%, ${tm.colors[2] ?? tm.colors[0]})`,
        border: '2px solid rgba(255,255,255,0.6)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }} className="flex items-center justify-center text-white text-[12px] font-black"
      >{tm.key}</div>}
      <div className={side === 'home' ? '' : 'items-end text-right'} style={{
        display: 'flex', flexDirection: 'column', minWidth: 0,
      }}>
        <div className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase leading-none" style={{
          justifyContent: side === 'home' ? 'flex-start' : 'flex-end', display: 'flex',
        }}>{side === 'home' ? 'HOME' : 'AWAY'}</div>
        <div className="text-white font-bold text-[14px] sm:text-[18px] truncate max-w-[140px] sm:max-w-[220px] leading-tight mt-0.5" style={{
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          textAlign: side === 'home' ? 'left' : 'right',
        }}>{name}</div>
      </div>
      {side === 'away' && <div style={{
        width: '40px', height: '40px', flexShrink: 0,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${tm.colors[0]}, ${tm.colors[1] ?? '#fff'} 55%, ${tm.colors[2] ?? tm.colors[0]})`,
        border: '2px solid rgba(255,255,255,0.6)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }} className="flex items-center justify-center text-white text-[12px] font-black"
      >{tm.key}</div>}
    </div>
  );
};

const Bouncy: React.FC<{ value: number; bounce: number; color: string }> = ({ value, bounce, color }) => {
  const [scale, setScale] = useState(1);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (bounce === 0) return;
    let p = 0;
    const start = performance.now();
    const dur = 650;
    setPhase((x) => x + 1);
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      const s = 1 + (Math.sin(ease * Math.PI * 3.5) * Math.exp(-t * 5)) * 0.35;
      setScale(s);
      if (t < 1) requestAnimationFrame(tick); else setScale(1);
    };
    requestAnimationFrame(tick);
  }, [bounce]);
  return (
    <div key={`${value}-${bounce}-${phase}`} className="text-white font-black leading-none tabular-nums" style={{
      fontSize: 'clamp(44px, 9vw, 92px)',
      fontFamily: '"Arial Black", Arial, sans-serif',
      textShadow: `0 0 30px ${color}66, 0 4px 14px rgba(0,0,0,0.6)`,
      transform: `scale(${scale}) translateY(${(1 - scale) * -10}px)`,
      transition: 'transform 15ms linear',
      lineHeight: 1,
      minWidth: '1ch',
      textAlign: 'center',
    }}>
      {value}
    </div>
  );
};

export default WcScoreboardSimulator;
