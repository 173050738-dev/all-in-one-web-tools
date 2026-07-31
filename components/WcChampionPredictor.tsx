'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trophy, Download, Save, RotateCcw, Check, Plus, Trash2, X, Award, Medal } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    title: '个人冠军预测存档工具',
    subtitle: '选冠军/亚/季/第4名/黑马2队，填预测理由，生成专属预测卡片永久保存分享',
    champion: '冠军 🏆',
    runnerUp: '亚军 🥈',
    third: '季军 🥉',
    fourth: '第4名 🏅',
    dark: '黑马队伍（2队）',
    darkA: '黑马 A',
    darkB: '黑马 B',
    reasonLabel: '预测理由 / 夺冠分析（可写情感或数据）',
    reasonPlaceholder: '例如：阿根廷攻守均衡，梅西经验 + 新黄金一代崛起，美加墨三连冠梦；最大威胁是法国锋线爆点与主场氛围…',
    cardTitle: '🏆 我的 2026 美加墨世界杯预测',
    cardSubtitle: 'World Cup 2026 · My Champion Prediction Card',
    cardBy: 'By',
    cardReason: '预测理由',
    cardDark: '黑马球队',
    cardTop4: 'TOP 4 强',
    download: '下载预测卡片 PNG',
    save: '💾 存档到本地',
    saveNew: '📝 另存为新存档',
    reset: '↺ 清空重填',
    savedToast: '已永久保存 ✓ 赛后回来对照',
    loadedSaved: '已加载存档，你可以继续修改',
    emptyPick: '请选择球队',
    thanks: '⭐ 祝你预测全中！',
    savedHint: '💡 你的预测已保存到浏览器本地存储，赛后可回到此页对照结果。',
    archives: '📂 我的预测存档',
    load: '加载',
    delete: '删除',
    deleteConfirm: '确认删除这个存档？',
    noArchives: '还没有存档，填写后点击「存档到本地」吧',
    nickname: '用户昵称',
    nicknamePlaceholder: '球迷昵称（显示在卡片上）',
    unnamed: '未命名存档',
  },
  en: {
    title: 'My World Cup Champion Prediction',
    subtitle: 'Pick champion/runner/3rd/4th/2 dark horses + analysis → generate shareable card',
    champion: 'Champion 🏆',
    runnerUp: 'Runner-up 🥈',
    third: '3rd place 🥉',
    fourth: '4th place 🏅',
    dark: 'Dark Horses (2 teams)',
    darkA: 'Dark Horse A',
    darkB: 'Dark Horse B',
    reasonLabel: 'Prediction / analysis (emotion, stats, vibes)',
    reasonPlaceholder: 'e.g. Argentina balance + Messi experience + rising stars chasing 3-in-a-row; France\'s frontline & home crowd are main threats…',
    cardTitle: '🏆 My 2026 World Cup Prediction',
    cardSubtitle: 'FIFA World Cup 2026 · USA/MEX/CAN',
    cardBy: 'By',
    cardReason: 'Why I think so',
    cardDark: 'Dark Horses',
    cardTop4: 'Top 4',
    download: 'Download Prediction PNG',
    save: '💾 Save to archives',
    saveNew: '📝 Save as new archive',
    reset: '↺ Reset',
    savedToast: 'Saved ✓ come back after the tournament!',
    loadedSaved: 'Archive loaded. Keep editing!',
    emptyPick: 'Pick a team',
    thanks: '⭐ May your bracket be perfect!',
    savedHint: '💡 Your prediction is stored locally. Come back after matches to compare.',
    archives: '📂 My Prediction Archives',
    load: 'Load',
    delete: 'Delete',
    deleteConfirm: 'Delete this archive?',
    noArchives: 'No archives yet. Fill in and hit Save!',
    nickname: 'Nickname',
    nicknamePlaceholder: 'Fan nickname (shown on card)',
    unnamed: 'Unnamed archive',
  },
  fr: {
    title: 'Ma Prédiction Coupe du Monde',
    subtitle: 'Choisissez 1er/2e/3e/4e/2 outsiders + analyse → carte partageable',
    champion: 'Champion 🏆',
    runnerUp: '2e 🥈',
    third: '3e 🥉',
    fourth: '4e 🏅',
    dark: 'Outsiders (2 équipes)',
    darkA: 'Outsider A',
    darkB: 'Outsider B',
    reasonLabel: 'Analyse / prédiction',
    reasonPlaceholder: 'ex: équilibre argentin + expérience Messi + nouvelle génération. Menaces : attaque française + ambiance maison.',
    cardTitle: '🏆 Ma Prédiction 2026',
    cardSubtitle: 'Coupe du Monde 2026 · USA/MEX/CAN',
    cardBy: 'Par',
    cardReason: 'Pourquoi',
    cardDark: 'Outsiders',
    cardTop4: 'Top 4',
    download: 'Télécharger PNG',
    save: '💾 Sauvegarder',
    saveNew: '📝 Nouvelle sauvegarde',
    reset: '↺ Réinitialiser',
    savedToast: 'Sauvegardé ✓ revenez plus tard !',
    loadedSaved: 'Sauvegarde chargée. Continuez !',
    emptyPick: 'Choisissez une équipe',
    thanks: '⭐ Bonne chance !',
    savedHint: '💡 Prédiction enregistrée localement. Revenez comparer après le tournoi.',
    archives: '📂 Mes sauvegardes',
    load: 'Charger',
    delete: 'Supprimer',
    deleteConfirm: 'Supprimer cette sauvegarde ?',
    noArchives: 'Aucune sauvegarde. Remplissez puis sauvegardez !',
    nickname: 'Surnom',
    nicknamePlaceholder: 'Surnom du fan (affiché sur la carte)',
    unnamed: 'Sans nom',
  },
  es: {
    title: 'Mi Predicción del Mundial',
    subtitle: 'Elige campeón/subcampeón/3er/4º/2 caballos negros + análisis → tarjeta',
    champion: 'Campeón 🏆',
    runnerUp: 'Subcampeón 🥈',
    third: '3er puesto 🥉',
    fourth: '4º puesto 🏅',
    dark: 'Caballos negros (2 equipos)',
    darkA: 'Caballo negro A',
    darkB: 'Caballo negro B',
    reasonLabel: 'Análisis / por qué',
    reasonPlaceholder: 'ej: Argentina + Messi + nueva generación. Ataque francés y localía son la amenaza.',
    cardTitle: '🏆 Mi Predicción 2026',
    cardSubtitle: 'Mundial 2026 · USA/MEX/CAN',
    cardBy: 'Por',
    cardReason: 'Por qué pienso eso',
    cardDark: 'Caballos negros',
    cardTop4: 'Top 4',
    download: 'Descargar PNG',
    save: '💾 Guardar',
    saveNew: '📝 Nueva copia',
    reset: '↺ Reiniciar',
    savedToast: 'Guardado ✓ ¡vuelve después!',
    loadedSaved: 'Cargada tu archivo anterior.',
    emptyPick: 'Selecciona',
    thanks: '⭐ ¡Mucha suerte!',
    savedHint: '💡 Guardado local. Vuelve para comparar tras el mundial.',
    archives: '📂 Mis archivos',
    load: 'Cargar',
    delete: 'Borrar',
    deleteConfirm: '¿Borrar este archivo?',
    noArchives: 'Sin archivos. ¡Rellena y guarda!',
    nickname: 'Apodo',
    nicknamePlaceholder: 'Apodo del hincha (en la tarjeta)',
    unnamed: 'Sin nombre',
  },
  hi: {
    title: 'मेरी विश्व कप भविष्यवाणी',
    subtitle: 'चैंपियन / उप / 3rd / 4th / 2 डार्क हॉर्स चुनें + विश्लेषण → शेयर कार्ड',
    champion: 'चैंपियन 🏆',
    runnerUp: 'उपविजेता 🥈',
    third: 'तीसरा 🥉',
    fourth: 'चौथा 🏅',
    dark: 'डार्क हॉर्स (2 टीमें)',
    darkA: 'डार्क हॉर्स A',
    darkB: 'डार्क हॉर्स B',
    reasonLabel: 'विश्लेषण / क्यों',
    reasonPlaceholder: 'जैसे: अर्जेंटीना संतुलन + मेस्सी अनुभव + नई पीढ़ी। खतरा: फ्रांस की अटैक और घरेलू माहौल।',
    cardTitle: '🏆 मेरी भविष्यवाणी 2026',
    cardSubtitle: 'विश्व कप 2026 · USA/MEX/CAN',
    cardBy: 'द्वारा',
    cardReason: 'कारण',
    cardDark: 'डार्क हॉर्स',
    cardTop4: 'शीर्ष 4',
    download: 'PNG डाउनलोड',
    save: '💾 सेव करें',
    saveNew: '📝 नया सेव',
    reset: '↺ रीसेट',
    savedToast: 'सेव हो गया ✓ बाद में देखें',
    loadedSaved: 'पुरानी भविष्यवाणी लोड हुई। संपादित करें!',
    emptyPick: 'टीम चुनें',
    thanks: '⭐ शुभकामनाएँ!',
    savedHint: '💡 भविष्यवाणी लोकल सेव हुई। टूर्नामेंट के बाद वापस आकर तुलना करें।',
    archives: '📂 मेरी सेव की हुई',
    load: 'लोड करें',
    delete: 'हटाएँ',
    deleteConfirm: 'हटाएँ?',
    noArchives: 'कोई सेव नहीं। भरें और सेव करें!',
    nickname: 'निकनाम',
    nicknamePlaceholder: 'फैन नाम (कार्ड पर दिखेगा)',
    unnamed: 'बिना नाम',
  },
  ar: {
    title: 'توقعاتي لكأس العالم',
    subtitle: 'اختر البطل / وصيف / الثالث / الرابع / حصانين أسودين + تحليل → بطاقة',
    champion: 'البطل 🏆',
    runnerUp: 'الوصيف 🥈',
    third: 'المركز الثالث 🥉',
    fourth: 'المركز الرابع 🏅',
    dark: 'الحصان الأسود (فريقان)',
    darkA: 'الحصان الأسود أ',
    darkB: 'الحصان الأسود ب',
    reasonLabel: 'التحليل / السبب',
    reasonPlaceholder: 'مثال: الأرجنتين متوازنة + خبرة ميسي + جيل جديد. التهديد: هجوم فرنسا + الجمهور المحلي.',
    cardTitle: '🏆 توقعاتي 2026',
    cardSubtitle: 'كأس العالم 2026 · USA/MEX/CAN',
    cardBy: 'بواسطة',
    cardReason: 'لماذا؟',
    cardDark: 'الحصان الأسود',
    cardTop4: 'أفضل 4',
    download: 'تحميل PNG',
    save: '💾 حفظ',
    saveNew: '📝 حفظ جديد',
    reset: '↺ مسح',
    savedToast: 'تم الحفظ ✓ ارجع لاحقاً',
    loadedSaved: 'تم تحميل الأرشيف. أكمل التعديل.',
    emptyPick: 'اختر منتخباً',
    thanks: '⭐ بالتوفيق!',
    savedHint: '💡 تم الحفظ محلياً. ارجع للمقارنة بعد نهاية البطولة.',
    archives: '📂 ملفاتي المحفوظة',
    load: 'تحميل',
    delete: 'حذف',
    deleteConfirm: 'حذف هذا الملف؟',
    noArchives: 'لا ملفات بعد. املأ ثم احفظ!',
    nickname: 'اللقب',
    nicknamePlaceholder: 'اسم المشجع (على البطاقة)',
    unnamed: 'بدون اسم',
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
  { key:'COL', label:'哥伦比亚', en:'Colombia', colors:['#FCD116','#003893','#CE1126'], accent:'#FCD116' },
  { key:'CRC', label:'哥斯达黎加', en:'Costa Rica', colors:['#CE1126','#FFFFFF','#002B7F'], accent:'#002B7F' },
  { key:'EGY', label:'埃及', en:'Egypt', colors:['#CE1126','#FFFFFF','#000000'], accent:'#CE1126' },
  { key:'NGA', label:'尼日利亚', en:'Nigeria', colors:['#008751','#FFFFFF','#0067A5'], accent:'#008751' },
  { key:'SWE', label:'瑞典', en:'Sweden', colors:['#006AA7','#FECC00'], accent:'#FECC00' },
  { key:'PER', label:'秘鲁', en:'Peru', colors:['#D91023','#FFFFFF'], accent:'#D91023' },
  { key:'AUT', label:'奥地利', en:'Austria', colors:['#ED2939','#FFFFFF'], accent:'#ED2939' },
  { key:'UKR', label:'乌克兰', en:'Ukraine', colors:['#0057B8','#FFD700'], accent:'#FFD700' },
  { key:'JAM', label:'牙买加', en:'Jamaica', colors:['#009B3A','#000000','#FEDD00'], accent:'#FEDD00' },
  { key:'CHI', label:'智利', en:'Chile', colors:['#0039A6','#FFFFFF','#D52B1E'], accent:'#D52B1E' },
  { key:'HUN', label:'匈牙利', en:'Hungary', colors:['#CE2939','#FFFFFF'], accent:'#CE2939' },
  { key:'ALG', label:'阿尔及利亚', en:'Algeria', colors:['#006233','#FFFFFF','#CE1126'], accent:'#CE1126' },
  { key:'CZE', label:'捷克', en:'Czechia', colors:['#D7141A','#FFFFFF','#11457E'], accent:'#D7141A' },
  { key:'NOR', label:'挪威', en:'Norway', colors:['#EF2B2D','#FFFFFF','#002868'], accent:'#002868' },
  { key:'UZB', label:'乌兹别克斯坦', en:'Uzbekistan', colors:['#1C519A','#CE1126','#15A642'], accent:'#15A642' },
  { key:'VEN', label:'委内瑞拉', en:'Venezuela', colors:['#CE1126','#FCD116','#00247D'], accent:'#FCD116' },
  { key:'TUN', label:'突尼斯', en:'Tunisia', colors:['#CE1126','#FFFFFF'], accent:'#CE1126' },
  { key:'PAN', label:'巴拿马', en:'Panama', colors:['#CE1126','#FFFFFF','#005293'], accent:'#005293' },
];

interface PredictionArchive {
  id: string;
  name: string;
  savedAt: number;
  champ: string;
  runUp: string;
  third: string;
  fourth: string;
  darkA: string;
  darkB: string;
  reason: string;
  nick: string;
}

interface Props { locale?: Locale; }
const SAVE_KEY = 'wc2026_predictions';

const WcChampionPredictor: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const [champ, setChamp] = useState<string>('ARG');
  const [runUp, setRunUp] = useState<string>('FRA');
  const [third, setThird] = useState<string>('BRA');
  const [fourth, setFourth] = useState<string>('ENG');
  const [darkA, setDarkA] = useState<string>('MAR');
  const [darkB, setDarkB] = useState<string>('JPN');
  const [reason, setReason] = useState<string>(
    locale === 'zh'
      ? '阿根廷攻守均衡，梅西大赛经验 + 新黄金一代崛起，美加墨冲击三连冠。最大威胁：法国姆巴佩爆点 + 美国主场气氛加成；黑马看好摩洛哥铁血防守与日本传控突破。'
      : 'Argentina have balance, Messi big-game experience and a rising golden generation chasing 3-in-a-row. Main threat: France\'s Mbappé spark + home-field energy. Dark horses: Morocco rock-solid defence + Japan possession play.'
  );
  const [nick, setNick] = useState<string>('');
  const [archives, setArchives] = useState<PredictionArchive[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [showDelConfirm, setShowDelConfirm] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getTeam = (key: string): Team | undefined => TEAMS.find(x => x.key === key);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setArchives(arr);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (!toast) return; const tm = setTimeout(() => setToast(null), 2400); return () => clearTimeout(tm); }, [toast]);

  const writeArchives = (arr: PredictionArchive[]) => {
    setArchives(arr);
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(arr)); } catch {}
  };

  const handleSave = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const archive: PredictionArchive = {
      id, savedAt: Date.now(),
      name: `${getTeam(champ)?.en ?? 'TBD'} ${new Date().toLocaleDateString()}` || t.unnamed,
      champ, runUp, third, fourth, darkA, darkB, reason, nick,
    };
    const next = [archive, ...archives].slice(0, 20);
    writeArchives(next);
    setToast(t.savedToast);
  };

  const handleLoad = (a: PredictionArchive) => {
    setChamp(a.champ); setRunUp(a.runUp); setThird(a.third); setFourth(a.fourth);
    setDarkA(a.darkA); setDarkB(a.darkB); setReason(a.reason ?? ''); setNick(a.nick ?? '');
    setToast(t.loadedSaved);
  };

  const handleDelete = (id: string) => {
    writeArchives(archives.filter(a => a.id !== id));
    setShowDelConfirm(null);
  };

  const handleReset = () => {
    setChamp(''); setRunUp(''); setThird(''); setFourth(''); setDarkA(''); setDarkB(''); setReason(''); setNick('');
  };

  const drawTeamBadge = (ctx: CanvasRenderingContext2D, teamKey: string, cx: number, cy: number, r: number, ring?: string) => {
    const team = getTeam(teamKey);
    const a = team?.colors?.[0] ?? '#1e293b';
    const b = team?.colors?.[1] ?? '#f8fafc';
    const c = team?.colors?.[2];
    const accent = team?.accent ?? ring ?? 'rgba(255,255,255,0.9)';
    const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    g.addColorStop(0, a); g.addColorStop(0.5, b); if (c) g.addColorStop(1, c);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ring ?? accent; ctx.lineWidth = Math.max(2, r * 0.09);
    ctx.beginPath(); ctx.arc(cx, cy, r - 2, 0, Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - 4, 0, Math.PI * 2); ctx.clip();
    ctx.globalAlpha = 0.18; ctx.fillStyle = '#000';
    for (let i = -2; i <= 2; i++) { ctx.fillRect(cx - r, cy + i * r * 0.35, r * 2, r * 0.12); }
    ctx.restore();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${Math.round(r * 0.42)}px Arial Black, Arial`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = r * 0.1;
    ctx.fillText((team?.key ?? 'TBD').slice(0, 3).toUpperCase(), cx, cy);
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const W = c.width = 1080, H = c.height = 1440;
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a0f3b'); bg.addColorStop(0.35, '#13217a');
    bg.addColorStop(0.55, '#0d4d92'); bg.addColorStop(0.78, '#2a8a8b'); bg.addColorStop(1, '#d4a24c');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const trio = [['#B31942','#FFFFFF','#0A3161'], ['#FF0000','#FFFFFF'], ['#006847','#FFFFFF','#CE1126']];
    let fx = W - 320;
    trio.forEach((cols, i) => {
      const w = 86, h = 58;
      ctx.save();
      ctx.fillStyle = cols[0]; ctx.fillRect(fx, 50 + i * 66, w, h);
      ctx.fillStyle = cols[1] ?? cols[0]; ctx.fillRect(fx, 50 + i * 66 + h * 0.33, w, h / 3);
      if (cols[2]) { ctx.fillStyle = cols[2]; ctx.fillRect(fx, 50 + i * 66 + h * 0.66, w, h / 3); }
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.strokeRect(fx + 0.5, 50 + i * 66 + 0.5, w - 1, h - 1);
      ctx.restore();
    });
    ctx.save();
    for (let i = 0; i < 26; i++) {
      const x = 40 + (i * 97) % (W - 80);
      const y = 60 + ((i * 131) % (H - 120));
      const s = 14 + ((i * 17) % 26);
      ctx.globalAlpha = 0.08; ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.2; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * s * 0.7, y + Math.sin(a) * s * 0.7); ctx.strokeStyle = '#000'; ctx.stroke();
      }
    }
    ctx.restore();

    const hy = 80;
    roundRect(ctx, 48, hy, W - 96, 130, 26);
    const hg = ctx.createLinearGradient(0, hy, 0, hy + 130);
    hg.addColorStop(0, 'rgba(0,0,0,0.35)'); hg.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = hg; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    roundRect(ctx, 48, hy, W - 96, 130, 26); ctx.stroke();
    ctx.fillStyle = '#FFD56A';
    drawStar(ctx, 100, hy + 65, 24, 5);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Arial Black", Arial';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(t.cardTitle, 146, hy + 58);
    ctx.font = '20px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(t.cardSubtitle, 146, hy + 100);

    const ccx = W / 2, ccy = 420;
    ctx.save();
    const cg = ctx.createRadialGradient(ccx, ccy, 10, ccx, ccy, 260);
    cg.addColorStop(0, 'rgba(255,213,106,0.45)'); cg.addColorStop(1, 'rgba(255,213,106,0)');
    ctx.fillStyle = cg; ctx.fillRect(ccx - 270, ccy - 270, 540, 540);
    ctx.restore();
    drawTrophy(ctx, ccx - 160, ccy - 210, 46, '#FFD56A');
    drawTrophy(ctx, ccx + 114, ccy - 210, 46, '#FFD56A');
    drawTeamBadge(ctx, champ || '', ccx, ccy, 110, '#FFD56A');
    ctx.fillStyle = '#fff'; ctx.font = 'bold 52px "Arial Black", Arial'; ctx.textAlign = 'center';
    ctx.fillText(getTeam(champ)?.en ?? t.emptyPick, ccx, ccy + 170);
    ctx.fillStyle = '#FFD56A'; ctx.font = 'bold 26px Arial';
    ctx.fillText('★  ' + t.champion + '  ★', ccx, ccy + 220);

    const ry = 760;
    const colW = (W - 96 - 48) / 3;
    const medals: { key: string; label: string; color: string; val: string; ring: string; pos: number }[] = [
      { key: runUp, label: t.runnerUp, color: '#C0C0C0', val: '🥈', ring: '#E5E7EB', pos: 2 },
      { key: third, label: t.third, color: '#CD7F32', val: '🥉', ring: '#CD7F32', pos: 3 },
      { key: fourth, label: t.fourth, color: '#9CA3AF', val: '🏅', ring: '#93C5FD', pos: 4 },
    ];
    medals.forEach((m, i) => {
      const x = 48 + i * (colW + 24);
      roundRect(ctx, x, ry, colW, 180, 24);
      const rg = ctx.createLinearGradient(0, ry, 0, ry + 180);
      rg.addColorStop(0, 'rgba(255,255,255,0.14)'); rg.addColorStop(1, 'rgba(255,255,255,0.05)');
      ctx.fillStyle = rg; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; roundRect(ctx, x, ry, colW, 180, 24); ctx.stroke();
      const badgeX = x + 58;
      drawTeamBadge(ctx, m.key || '', badgeX, ry + 90, 46, m.ring);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Arial Black", Arial'; ctx.textAlign = 'left';
      ctx.fillText(getTeam(m.key)?.en ?? t.emptyPick, x + 120, ry + 80);
      ctx.fillStyle = m.color; ctx.font = 'bold 18px Arial';
      ctx.fillText(m.val + ' ' + m.label, x + 120, ry + 118);
    });

    const sy = 970;
    roundRect(ctx, 48, sy, W - 96, 120, 24);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    roundRect(ctx, 48, sy, W - 96, 120, 24); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    const top4 = [champ, runUp, third, fourth].map(k => getTeam(k)?.en ?? '—').join(' · ');
    ctx.fillText('🏅 ' + t.cardTop4 + '：' + top4, 80, sy + 40);
    [champ, runUp, third, fourth].forEach((k, i) => drawTeamBadge(ctx, k || '', 150 + i * 90, sy + 82, 24));
    ctx.fillStyle = '#FFB74D'; ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    const darks = [darkA, darkB].map(k => getTeam(k)?.en ?? '—').join(' / ');
    ctx.fillText('🎯 ' + t.cardDark + ': ' + darks, W - 80, sy + 40);
    drawTeamBadge(ctx, darkA || '', W - 160, sy + 82, 24);
    drawTeamBadge(ctx, darkB || '', W - 90, sy + 82, 24);

    const rY = 1110;
    roundRect(ctx, 48, rY, W - 96, 180, 24);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    roundRect(ctx, 48, rY, W - 96, 180, 24); ctx.stroke();
    ctx.fillStyle = '#FFE8A3'; ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left'; ctx.fillText('✦ ' + t.cardReason, 80, rY + 38);
    ctx.fillStyle = '#ffffff'; ctx.font = '17px Arial';
    const lines = wrapText(ctx, reason || '—', W - 190, 130);
    lines.forEach((ln, i) => ctx.fillText(ln, 80, rY + 72 + i * 28));

    const fy = H - 82;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(48, fy, W - 96, 56);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.strokeRect(48.5, fy + 0.5, W - 97, 55);
    ctx.fillStyle = '#93C5FD'; ctx.font = '16px Arial';
    ctx.fillText(`© 2026 World Cup Predictor · ${t.cardBy} ${nick || (locale === 'zh' ? '匿名球迷' : 'Anonymous Fan')} · ${new Date().toISOString().slice(0,10)}`, 80, fy + 32);

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      const rr = Math.min(r, w/2, h/2);
      ctx.beginPath(); ctx.moveTo(x+rr,y);
      ctx.lineTo(x+w-rr,y); ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
      ctx.lineTo(x+w,y+h-rr); ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
      ctx.lineTo(x+rr,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
      ctx.lineTo(x,y+rr); ctx.quadraticCurveTo(x,y,x+rr,y);
      ctx.closePath();
    }
    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, spikes: number) {
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? s : s * 0.45;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    }
    function drawTrophy(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, col: string) {
      ctx.save();
      ctx.fillStyle = col; ctx.strokeStyle = '#7a4d00'; ctx.lineWidth = Math.max(2, s / 18);
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + s * 1.2, y);
      ctx.lineTo(x + s, y + s * 0.9);
      ctx.lineTo(x + s * 0.4, y + s * 1.1);
      ctx.lineTo(x + s * 0.6, y + s * 2.4);
      ctx.lineTo(x + s * 0.1, y + s * 2.4);
      ctx.lineTo(x + s * 0.3, y + s * 1.1);
      ctx.lineTo(x + s * 0.2, y + s * 0.9);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxH: number) {
      const out: string[] = [];
      let buf = '';
      const maxLines = Math.max(1, Math.floor(maxH / 28));
      for (const ch of text) {
        const test = buf + ch;
        if (ctx.measureText(test).width > maxW && buf) {
          out.push(buf.trimEnd());
          if (out.length >= maxLines) {
            const last = out[out.length - 1];
            out[out.length - 1] = last.slice(0, Math.max(0, last.length - 2)) + '…';
            return out;
          }
          buf = ch;
        } else buf = test;
      }
      if (buf && out.length < maxLines) out.push(buf);
      return out;
    }
  }, [champ, runUp, third, fourth, darkA, darkB, reason, nick, locale, t]);

  const handleDownload = () => {
    const c = canvasRef.current; if (!c) return;
    try {
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const teamName = getTeam(champ)?.en ?? 'card';
        a.download = `wc2026-prediction-${teamName}-${Date.now().toString(36)}.png`;
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
      }, 'image/png');
    } catch {}
  };

  const opts = useMemo(() => [<option key="__" value="">{t.emptyPick}</option>, ...TEAMS.map((tm) => <option key={tm.key} value={tm.key}>{tm.en} {tm.label} ({tm.key})</option>)], [t.emptyPick]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="card-base p-5 sm:p-6 mb-5 relative overflow-hidden">
        {toast && (
          <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] shadow-lg inline-flex items-center gap-2">
            <Check className="w-4 h-4"/> {toast}
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-[color:var(--color-primary)]" />
          <h1 className="text-[18px] font-bold">{t.title}</h1>
        </div>
        <p className="text-[13px] text-[color:var(--color-text-secondary)] mb-4">{t.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Pick label={t.champion} color="from-amber-400 to-yellow-600" value={champ} onChange={setChamp} options={opts} />
          <Pick label={t.runnerUp} color="from-slate-300 to-slate-500" value={runUp} onChange={setRunUp} options={opts} />
          <Pick label={t.third} color="from-orange-400 to-amber-700" value={third} onChange={setThird} options={opts} />
          <Pick label={t.fourth} color="from-slate-400 to-slate-600" value={fourth} onChange={setFourth} options={opts} />
          <Pick label={t.darkA} color="from-fuchsia-500 to-violet-700" value={darkA} onChange={setDarkA} options={opts} />
          <Pick label={t.darkB} color="from-fuchsia-500 to-violet-700" value={darkB} onChange={setDarkB} options={opts} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div className="sm:col-span-1">
            <label className="block text-[13px] font-medium mb-2 inline-flex items-center gap-1"><Award className="w-4 h-4 text-sky-500"/> {t.nickname}</label>
            <input value={nick} onChange={(e)=>setNick(e.target.value)} className="input-base w-full !h-11 text-[14px]" style={{ minHeight: 44 }} placeholder={t.nicknamePlaceholder} />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[13px] font-medium mb-2 inline-flex items-center gap-1"><Medal className="w-4 h-4 text-amber-500"/> {t.reasonLabel}</label>
            <textarea value={reason} onChange={(e)=>setReason(e.target.value)} rows={3}
              placeholder={t.reasonPlaceholder}
              className="input-base w-full resize-y text-[13px] sm:text-[14px]" style={{ minHeight: 88 }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleDownload}
            className="btn-primary !h-12 !px-5 text-[14px] inline-flex items-center gap-2 touch-manipulation"
            style={{ touchAction:'manipulation', minHeight: 48 }}>
            <Download className="w-5 h-5"/> {t.download}
          </button>
          <button type="button" onClick={handleSave}
            className="!h-12 !px-5 rounded-[var(--radius-md)] border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary)] font-semibold inline-flex items-center gap-2 text-[14px] bg-[color:var(--color-bg-primary)] hover:bg-[color:var(--color-primary)] hover:text-white transition touch-manipulation"
            style={{ touchAction:'manipulation', minHeight: 48 }}>
            <Plus className="w-5 h-5"/> {t.save}
          </button>
          <button type="button" onClick={handleReset}
            className="!h-12 !px-5 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] inline-flex items-center gap-2 text-[14px] touch-manipulation"
            style={{ touchAction:'manipulation', minHeight: 48 }}>
            <RotateCcw className="w-5 h-5"/> {t.reset}
          </button>
        </div>
      </div>

      <div className="card-base p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Save className="w-4 h-4 text-[color:var(--color-primary)]"/>
          <h3 className="text-[15px] font-semibold">{t.archives} <span className="text-[12px] font-normal text-[color:var(--color-text-secondary)]">({archives.length})</span></h3>
        </div>
        {archives.length === 0 ? (
          <div className="text-[13px] text-[color:var(--color-text-secondary)] py-4 text-center border border-dashed rounded-lg">
            {t.noArchives}
          </div>
        ) : (
          <div className="space-y-2 max-h-[320px] overflow-auto">
            {archives.map((a) => (
              <div key={a.id} className="flex items-center gap-2 p-2 sm:p-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex shrink-0 -space-x-1">
                    {[a.champ, a.runUp].filter(Boolean).map((k, i) => {
                      const tm = getTeam(k as string);
                      if (!tm) return null;
                      const c0 = tm.colors[0];
                      const c1 = tm.colors[1] ?? c0;
                      const bg = 'linear-gradient(135deg, ' + c0 + ', ' + c1 + ')';
                      return (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full border-2 border-white shadow"
                          style={{ background: bg }}
                        />
                      );
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate">{a.name}</div>
                    <div className="text-[11px] text-[color:var(--color-text-secondary)]">{new Date(a.savedAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {showDelConfirm === a.id ? (
                    <>
                      <button type="button" onClick={() => handleDelete(a.id)}
                        className="!h-9 !px-2.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[12px] font-medium inline-flex items-center gap-1 touch-manipulation" style={{ minHeight: 36 }}>
                        <Check className="w-3.5 h-3.5"/> {locale === 'zh' ? '确认' : 'Confirm'}
                      </button>
                      <button type="button" onClick={() => setShowDelConfirm(null)}
                        className="!h-9 !px-2.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[12px] font-medium inline-flex items-center gap-1 touch-manipulation" style={{ minHeight: 36 }}>
                        <X className="w-3.5 h-3.5"/>
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleLoad(a)}
                        className="!h-9 !px-2.5 rounded-md bg-[color:var(--color-primary)] text-white text-[12px] font-medium inline-flex items-center gap-1 touch-manipulation" style={{ minHeight: 36 }}>
                        {t.load}
                      </button>
                      <button type="button" onClick={() => setShowDelConfirm(a.id)}
                        className="!h-9 !px-2 rounded-md border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:text-red-600 hover:border-red-300 text-[12px] inline-flex items-center gap-1 touch-manipulation" style={{ minHeight: 36 }}>
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-base p-3 sm:p-5">
        <canvas ref={canvasRef} width={1080} height={1440}
          className="w-full h-auto rounded-[var(--radius-xl)] bg-[#0a0f3b] shadow-xl select-none"
          style={{ aspectRatio: '1080/1440' }} />
      </div>
    </div>
  );
};

interface PickProps {
  label: string; color: string; value: string; onChange: (v: string) => void; options: React.ReactNode;
}
const Pick: React.FC<PickProps> = ({ label, color, value, onChange, options }) => (
  <div>
    <label className="block text-[13px] font-medium mb-2">{label}</label>
    <div className={`relative rounded-[var(--radius-lg)] bg-gradient-to-r ${color} p-[2px]`}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="block w-full !h-11 pl-3 pr-8 rounded-[calc(var(--radius-lg)-2px)] bg-[color:var(--color-bg-primary)] text-[14px] font-medium touch-manipulation"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor:'transparent', minHeight: 44 }}>
        {options}
      </select>
    </div>
  </div>
);

export default WcChampionPredictor;
