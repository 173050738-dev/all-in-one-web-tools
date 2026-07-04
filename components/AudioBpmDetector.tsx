'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Activity,
  Upload,
  Mic,
  Play,
  Pause,
  RotateCcw,
  Hand,
  Zap,
  Music2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface AudioBpmDetectorProps {
  locale?: string;
}

type Mode = 'tap' | 'auto';

type TapHistory = { ts: number; interval: number | null }[];

export default function AudioBpmDetector({ locale = 'zh' }: AudioBpmDetectorProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'title': '音频 BPM 节拍测算器',
      'subtitle': '短视频卡点剪辑 / DJ 混音 / 舞蹈练习 / 剧情卡点必备。支持本地上传或麦克风实时检测，也可手动打点(Tempo Tap)精准测 BPM，100% 浏览器端处理。',
      'tip': '💡 提示：音乐鼓点清晰的快节奏歌建议用「自动检测」，上传文件或点麦克风即可。旋律柔和、节奏不明显的曲子建议切到「手动打点」模式：跟着节拍连点红色按钮 8 次以上，系统会自动算出平均 BPM（越点越准，实时更新）。',
      'features': '功能特点',
      'f1': '双模式：自动音频分析(Web Audio) + 手动 Tempo Tap，覆盖各种场景',
      'f2': '自动模式支持上传本地音频 / 麦克风实时输入，文件从不离开浏览器',
      'f3': '手动模式实时 BPM 曲线，可回看每一次击键间隔，支持一键重置',
      'f4': '支持 BPM 结果一键复制，方便填进剪映 / PR / DJ 软件 / DAW',
      'f5': '内置常用节拍速查表（慢歌/流行/舞曲/硬核）方便你对照',
      'f6': '响应式设计、触摸友好，手机端全屏使用无压力；6 种语言 UI',
      'mode.tap': '手动打点 (Tempo Tap)',
      'mode.auto': '自动检测 (音频分析)',
      'tap.tap': '跟着节拍连续点击 ⚡',
      'tap.tapHere': '在此处点击',
      'tap.currentBPM': '当前 BPM',
      'tap.avgBPM': '平均 BPM (取最近 {n} 次)',
      'tap.taps': '已点击 {n} 次',
      'tap.interval': '上一次间隔',
      'tap.ms': '毫秒',
      'tap.range': '最近 16 次间隔',
      'tap.reset': '重置打点记录',
      'auto.method': '音频来源',
      'auto.upload': '上传本地音频文件',
      'auto.mic': '使用麦克风实时输入',
      'auto.chooseFile': '选择文件',
      'auto.fileSelected': '已选择：{name}（{size}）',
      'auto.start': '开始检测',
      'auto.stop': '停止检测',
      'auto.detecting': '检测中… 请播放有清晰鼓点的片段 8–20 秒',
      'auto.result': '估算 BPM',
      'auto.confidence': '置信度',
      'auto.confidence.high': '高',
      'auto.confidence.mid': '中',
      'auto.confidence.low': '低（建议改用手动打点）',
      'auto.nofile': '请先选择音频文件或启用麦克风',
      'auto.bpmrange': '常见 BPM 速查',
      'slow': '慢歌 / 抒情 (60–90)',
      'pop': '流行 / Hip-Hop (90–110)',
      'dance': '电子 / House (110–130)',
      'edm': 'EDM / Trance (128–150)',
      'hard': 'Drum & Bass / Hardcore (150–180)',
      'action.copy': '复制 BPM 数值',
      'action.copied': '已复制',
      'mic.denied': '未获得麦克风权限，请在浏览器设置中允许，或改用上传文件模式。',
      'audio.err': '音频加载失败，请尝试其它文件（支持 mp3 / wav / m4a / ogg / flac）。',
      'size.note': '建议文件大小 < 20MB，时长 < 5 分钟。',
    },
    en: {
      'title': 'Audio BPM (Tempo) Detector',
      'subtitle': 'For beat-sync editing, DJ mixes, dance practice & story beats. Upload audio, mic live input, or manual Tempo Tap — all 100% in your browser.',
      'tip': '💡 Tip: Use "Auto" for tracks with clear drum beats. For mellow songs / ambient, switch to "Tempo Tap": tap the red button 8+ times in sync with the pulse — the average BPM gets more accurate with every tap.',
      'features': 'Features',
      'f1': 'Dual mode: Web Audio auto-detect + manual Tempo Tap for every scenario',
      'f2': 'Auto mode supports local audio upload + live mic, file never leaves your device',
      'f3': 'Tap mode shows live BPM curve, per-interval list, one-click reset',
      'f4': 'Copy BPM to clipboard for CapCut / Premiere / DJ tools / any DAW',
      'f5': 'Built-in BPM cheat-sheet (slow / pop / dance / EDM / hard)',
      'f6': 'Responsive, touch-friendly, fullscreen-safe on mobile. 6-language UI.',
      'mode.tap': 'Manual (Tempo Tap)',
      'mode.auto': 'Auto (Audio Analysis)',
      'tap.tap': 'Tap continuously to the beat ⚡',
      'tap.tapHere': 'TAP HERE',
      'tap.currentBPM': 'Current BPM',
      'tap.avgBPM': 'Average BPM (last {n})',
      'tap.taps': '{n} taps so far',
      'tap.interval': 'Last interval',
      'tap.ms': ' ms',
      'tap.range': 'Last 16 intervals',
      'tap.reset': 'Reset tap history',
      'auto.method': 'Audio source',
      'auto.upload': 'Upload local file',
      'auto.mic': 'Live microphone input',
      'auto.chooseFile': 'Choose file',
      'auto.fileSelected': 'Selected: {name} ({size})',
      'auto.start': 'Start detection',
      'auto.stop': 'Stop detection',
      'auto.detecting': 'Detecting… play a segment with clear beats for 8–20 seconds',
      'auto.result': 'Estimated BPM',
      'auto.confidence': 'Confidence',
      'auto.confidence.high': 'High',
      'auto.confidence.mid': 'Medium',
      'auto.confidence.low': 'Low (try Tempo Tap instead)',
      'auto.nofile': 'Choose a file first, or enable microphone.',
      'auto.bpmrange': 'Common BPM reference',
      'slow': 'Slow / Ballad (60–90)',
      'pop': 'Pop / Hip-Hop (90–110)',
      'dance': 'House / Dance (110–130)',
      'edm': 'EDM / Trance (128–150)',
      'hard': 'D&B / Hardcore (150–180)',
      'action.copy': 'Copy BPM value',
      'action.copied': 'Copied',
      'mic.denied': 'Microphone permission denied. Allow it in browser settings, or use upload mode.',
      'audio.err': 'Failed to load audio. Try another file (mp3 / wav / m4a / ogg / flac).',
      'size.note': 'Suggested file < 20MB, length < 5 minutes.',
    },
    fr: {
      'title': 'Détecteur BPM Audio',
      'subtitle': 'Pour montages vidéo synchronisés, mix DJ, danse. Téléversement, micro ou Tempo Tap manuel — 100% dans le navigateur.',
      'tip': '💡 Astuce : utilisez « Auto » pour des titres avec une pulse claire. Pour les titres doux, passez en « Tempo Tap » : cliquez 8+ fois sur le bouton rouge au rythme, la moyenne s\'affine progressivement.',
      'features': 'Fonctionnalités',
      'f1': 'Double mode : analyse Web Audio + Tempo Tap manuel pour tous les cas',
      'f2': 'Mode auto : fichier local ou micro en direct, aucune donnée envoyée',
      'f3': 'Mode Tap : BPM en direct, liste des intervalles, réinitialisation',
      'f4': 'Copie du BPM en un clic pour CapCut / Premiere / DAW',
      'f5': 'Aide-mémoire BPM (lent / pop / dance / EDM / hard)',
      'f6': 'Responsive, tactile, mobile-friendly. UI en 6 langues.',
      'mode.tap': 'Manuel (Tempo Tap)',
      'mode.auto': 'Auto (Analyse audio)',
      'tap.tap': 'Cliquez en rythme ⚡',
      'tap.tapHere': 'CLIQUEZ ICI',
      'tap.currentBPM': 'BPM courant',
      'tap.avgBPM': 'BPM moyen (derniers {n})',
      'tap.taps': '{n} clics',
      'tap.interval': 'Dernier intervalle',
      'tap.ms': ' ms',
      'tap.range': '16 derniers intervalles',
      'tap.reset': 'Réinitialiser',
      'auto.method': 'Source audio',
      'auto.upload': 'Téléverser un fichier',
      'auto.mic': 'Microphone en direct',
      'auto.chooseFile': 'Choisir un fichier',
      'auto.fileSelected': 'Sélection : {name} ({size})',
      'auto.start': 'Démarrer la détection',
      'auto.stop': 'Arrêter',
      'auto.detecting': 'Détection… jouez un passage avec des temps forts 8–20 s',
      'auto.result': 'BPM estimé',
      'auto.confidence': 'Confiance',
      'auto.confidence.high': 'Haute',
      'auto.confidence.mid': 'Moyenne',
      'auto.confidence.low': 'Basse (essayez le Tempo Tap)',
      'auto.nofile': 'Choisissez un fichier ou activez le micro.',
      'auto.bpmrange': 'BPM courants',
      'slow': 'Lent / Ballade (60–90)',
      'pop': 'Pop / Hip-Hop (90–110)',
      'dance': 'House / Dance (110–130)',
      'edm': 'EDM / Trance (128–150)',
      'hard': 'D&B / Hardcore (150–180)',
      'action.copy': 'Copier le BPM',
      'action.copied': 'Copié',
      'mic.denied': 'Accès micro refusé. Autorisez-le ou utilisez l\'envoi de fichier.',
      'audio.err': 'Échec chargement audio. Essayez un autre fichier (mp3/wav/m4a/ogg/flac).',
      'size.note': 'Fichier suggéré < 20Mo, durée < 5 min.',
    },
    es: {
      'title': 'Detector de BPM (Tempo) de Audio',
      'subtitle': 'Para edición sincronizada, mezcla DJ, baile. Subir archivo, micrófono o Tempo Tap manual — 100% en el navegador.',
      'tip': '💡 Consejo: usa «Auto» si la canción tiene beats claros. Para temas suaves, cambia a Tempo Tap: pulsa el botón rojo 8+ veces a tiempo, el promedio mejora con cada toque.',
      'features': 'Características',
      'f1': 'Doble modo: análisis Web Audio + Tempo Tap manual',
      'f2': 'Modo auto: archivo local o micrófono vivo, nada se sube',
      'f3': 'Modo Tap: BPM en vivo, intervalos, reinicio en 1 clic',
      'f4': 'Copia BPM al portapapeles para CapCut / Premiere / DAW',
      'f5': 'Hoja de referencia BPM (lento / pop / dance / EDM / duro)',
      'f6': 'Responsive, táctil, móvil listo. UI en 6 idiomas.',
      'mode.tap': 'Manual (Tempo Tap)',
      'mode.auto': 'Auto (Análisis de audio)',
      'tap.tap': 'Pulsa al ritmo ⚡',
      'tap.tapHere': 'PULSA AQUÍ',
      'tap.currentBPM': 'BPM actual',
      'tap.avgBPM': 'BPM promedio (últimos {n})',
      'tap.taps': '{n} pulsaciones',
      'tap.interval': 'Último intervalo',
      'tap.ms': ' ms',
      'tap.range': 'Últimos 16 intervalos',
      'tap.reset': 'Reiniciar',
      'auto.method': 'Fuente de audio',
      'auto.upload': 'Subir archivo local',
      'auto.mic': 'Micrófono en vivo',
      'auto.chooseFile': 'Seleccionar archivo',
      'auto.fileSelected': 'Seleccionado: {name} ({size})',
      'auto.start': 'Iniciar detección',
      'auto.stop': 'Detener',
      'auto.detecting': 'Detectando… reproduce un fragmento con beats 8–20 s',
      'auto.result': 'BPM estimado',
      'auto.confidence': 'Confianza',
      'auto.confidence.high': 'Alta',
      'auto.confidence.mid': 'Media',
      'auto.confidence.low': 'Baja (prueba Tempo Tap)',
      'auto.nofile': 'Selecciona un archivo o activa el micrófono.',
      'auto.bpmrange': 'BPM comunes',
      'slow': 'Lento / Balada (60–90)',
      'pop': 'Pop / Hip-Hop (90–110)',
      'dance': 'House / Dance (110–130)',
      'edm': 'EDM / Trance (128–150)',
      'hard': 'D&B / Hardcore (150–180)',
      'action.copy': 'Copiar BPM',
      'action.copied': 'Copiado',
      'mic.denied': 'Permiso de micrófono denegado. Actívalo o usa el modo subida.',
      'audio.err': 'Fallo al cargar audio. Prueba otro archivo (mp3/wav/m4a/ogg/flac).',
      'size.note': 'Archivo sugerido < 20MB, duración < 5 min.',
    },
    hi: {
      'title': 'ऑडियो BPM (टेम्पो) डिटेक्टर',
      'subtitle': 'बीट-सिंक एडिटिंग, डीजे मिक्स, डांस प्रैक्टिस के लिए। फाइल अपलोड, माइक लाइव, या मैनुअल टेम्पो टैप — 100% ब्राउज़र में।',
      'tip': '💡 सुझाव: स्पष्ट ड्रम बीट्स वाले गानों के लिए «ऑटो»। नरम गानों के लिए टेम्पो टैप पर जाएं: लाल बटन पर 8+ बार ताल में क्लिक करें — हर क्लिक के साथ औसत BPM और सटीक होता जाता है।',
      'features': 'विशेषताएं',
      'f1': 'डुअल मोड: Web Audio ऑटो + मैनुअल टेम्पो टैप',
      'f2': 'ऑटो मोड: लोकल फाइल / लाइव माइक, कुछ भी अपलोड नहीं',
      'f3': 'टैप मोड: लाइव BPM, अंतराल सूची, रीसेट',
      'f4': 'एक क्लिक में BPM कॉपी (CapCut / Premiere / DAW)',
      'f5': 'BPM चीट-शीट (धीमा / पॉप / डांस / EDM / हार्ड)',
      'f6': 'रेस्पॉन्सिव, टच फ्रेंडली, मोबाइल पर सुरक्षित। 6 भाषाएं।',
      'mode.tap': 'मैनुअल (टेम्पो टैप)',
      'mode.auto': 'ऑटो (ऑडियो विश्लेषण)',
      'tap.tap': 'ताल पर क्लिक करते रहें ⚡',
      'tap.tapHere': 'यहाँ टैप करें',
      'tap.currentBPM': 'वर्तमान BPM',
      'tap.avgBPM': 'औसत BPM (अंतिम {n})',
      'tap.taps': '{n} टैप्स',
      'tap.interval': 'अंतिम अंतराल',
      'tap.ms': ' मिली',
      'tap.range': 'अंतिम 16 अंतराल',
      'tap.reset': 'रीसेट',
      'auto.method': 'ऑडियो स्रोत',
      'auto.upload': 'लोकल फाइल अपलोड',
      'auto.mic': 'लाइव माइक',
      'auto.chooseFile': 'फाइल चुनें',
      'auto.fileSelected': 'चयनित: {name} ({size})',
      'auto.start': 'डिटेक्शन शुरू करें',
      'auto.stop': 'रोकें',
      'auto.detecting': 'पता लगाया जा रहा है… 8–20 सेकंड स्पष्ट बीट्स वाला हिस्सा चलाएं',
      'auto.result': 'अनुमानित BPM',
      'auto.confidence': 'विश्वास',
      'auto.confidence.high': 'उच्च',
      'auto.confidence.mid': 'मध्यम',
      'auto.confidence.low': 'कम (टेम्पो टैप आज़माएं)',
      'auto.nofile': 'पहले फाइल चुनें या माइक सक्षम करें।',
      'auto.bpmrange': 'सामान्य BPM संदर्भ',
      'slow': 'धीमा / गाना (60–90)',
      'pop': 'पॉप / हिप-हॉप (90–110)',
      'dance': 'हाउस / डांस (110–130)',
      'edm': 'EDM / ट्रान्स (128–150)',
      'hard': 'D&B / हार्डकोर (150–180)',
      'action.copy': 'BPM कॉपी करें',
      'action.copied': 'कॉपी हो गया',
      'mic.denied': 'माइक अनुमति अस्वीकृत। सेटिंग्स में अनुमति दें या अपलोड मोड का उपयोग करें।',
      'audio.err': 'ऑडियो लोड विफल। दूसरी फाइल आज़माएं (mp3 / wav / m4a / ogg / flac)।',
      'size.note': 'सुझाव: फाइल < 20MB, अवधि < 5 मिनट।',
    },
    ar: {
      'title': 'كاشف إيقاع BPM للصوت',
      'subtitle': 'للمونتاج المُزامن، وميكسات الدي جي، والرقص. ارفع الملف أو استخدم الميكروفون أو اضغط يدوياً — كل شيء في المتصفح.',
      'tip': '💡 نصيحة: استخدم «تلقائي» للأغاني ذات الإيقاعات الواضحة. للأغاني الهادئة، انتقل إلى «اضغط يدوياً»: اضغط على الزر الأحمر 8+ مرات متزامنة مع النبض، يتحسن المتوسط تدريجياً.',
      'features': 'الميزات',
      'f1': 'وضعان مزدوجان: تحليل تلقائي Web Audio + ضغط يدوي Tempo Tap',
      'f2': 'الوضع التلقائي: ملف محلي أو ميكروفون مباشر، لا يُرفع أي شيء',
      'f3': 'وضع الضغط: BPM مباشر، قائمة الفواصل، إعادة ضبط',
      'f4': 'انسخ BPM بنقرة واحدة إلى CapCut / Premiere / DAW',
      'f5': 'ورقة مرجعية لـ BPM الشائع (بطيء / بوب / رقص / EDM / قوي)',
      'f6': 'متجاوب، متجاوب مع اللمس، آمن على الهاتف. واجهة بـ 6 لغات.',
      'mode.tap': 'يدوي (Tempo Tap)',
      'mode.auto': 'تلقائي (تحليل صوتي)',
      'tap.tap': 'اضغط باستمرار على الإيقاع ⚡',
      'tap.tapHere': 'اضغط هنا',
      'tap.currentBPM': 'BPM الحالي',
      'tap.avgBPM': 'متوسط BPM (آخر {n})',
      'tap.taps': '{n} نقرة',
      'tap.interval': 'آخر فاصل',
      'tap.ms': ' مللي ثانية',
      'tap.range': 'آخر 16 فاصلًا',
      'tap.reset': 'إعادة ضبط',
      'auto.method': 'مصدر الصوت',
      'auto.upload': 'رفع ملف محلي',
      'auto.mic': 'ميكروفون مباشر',
      'auto.chooseFile': 'اختر ملفًا',
      'auto.fileSelected': 'محدد: {name} ({size})',
      'auto.start': 'ابدأ الكشف',
      'auto.stop': 'إيقاف',
      'auto.detecting': 'جارٍ الكشف… شغّل مقطعاً بنبضات واضحة لمدة 8–20 ثانية',
      'auto.result': 'BPM التقديري',
      'auto.confidence': 'الثقة',
      'auto.confidence.high': 'عالية',
      'auto.confidence.mid': 'متوسطة',
      'auto.confidence.low': 'منخفضة (جرّب الضغط اليدوي)',
      'auto.nofile': 'اختر ملفاً أولاً أو فعّل الميكروفون.',
      'auto.bpmrange': 'مرجع BPM الشائع',
      'slow': 'بطيء / بالاد (60–90)',
      'pop': 'بوب / هيب هوب (90–110)',
      'dance': 'هاوس / رقص (110–130)',
      'edm': 'EDM / ترانس (128–150)',
      'hard': 'D&B / هاردكور (150–180)',
      'action.copy': 'نسخ قيمة BPM',
      'action.copied': 'تم النسخ',
      'mic.denied': 'تم رفض إذن الميكروفون. اسمح به في الإعدادات أو استخدم وضع الرفع.',
      'audio.err': 'فشل تحميل الصوت. جرّب ملفاً آخر (mp3 / wav / m4a / ogg / flac).',
      'size.note': 'الملف المقترح < 20MB، المدة < 5 دقائق.',
    },
  };
  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)); });
      return str;
    };
  };
  const t = getT(locale);

  /* ---------- Tap Tempo state ---------- */
  const [history, setHistory] = useState<TapHistory>([]);
  const [tapPulse, setTapPulse] = useState(false);

  /* ---------- Auto mode state ---------- */
  const [mode, setMode] = useState<Mode>('tap');
  const [audioSource, setAudioSource] = useState<'upload' | 'mic'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>('');
  const [detecting, setDetecting] = useState(false);
  const [autoBpm, setAutoBpm] = useState<number | null>(null);
  const [autoConfidence, setAutoConfidence] = useState<0 | 1 | 2 | 3>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<{ tap?: boolean; auto?: boolean }>({});

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | MediaStreamAudioSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const rafRef = useRef<number | null>(null);
  const autoStateRef = useRef<{
    buffer: number[];
    lastBeatTime: number;
    beatIntervals: number[];
    startTime: number;
    lastEnergy: number;
    energyHistory: number[];
  }>({ buffer: [], lastBeatTime: 0, beatIntervals: [], startTime: 0, lastEnergy: 0, energyHistory: [] });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    return audioCtxRef.current!;
  };

  const stopAuto = useCallback(() => {
    try {
      if (sourceNodeRef.current && 'stop' in sourceNodeRef.current) {
        try { (sourceNodeRef.current as AudioBufferSourceNode).stop(0); } catch { /* noop */ }
      }
      if (sourceNodeRef.current && 'disconnect' in sourceNodeRef.current) {
        try { (sourceNodeRef.current as AudioNode).disconnect(); } catch { /* noop */ }
      }
      sourceNodeRef.current = null;
    } catch { /* noop */ }
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setDetecting(false);
  }, []);

  useEffect(() => () => {
    stopAuto();
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
  }, [stopAuto]);

  /* ---------- Tempo tap logic ---------- */
  const avgOfLast = (n: number) => {
    if (history.length < 2) return 0;
    const ints = history.slice(-n).map((h) => h.interval).filter((v): v is number => v != null && v > 0);
    if (ints.length === 0) return 0;
    return ints.reduce((a, b) => a + b, 0) / ints.length;
  };
  const medianOfLast = (n: number) => {
    const ints = history.slice(-n).map((h) => h.interval).filter((v): v is number => v != null && v > 0);
    if (ints.length === 0) return 0;
    const sorted = [...ints].sort((a, b) => a - b);
    const m = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
  };
  const tapAvgInterval = useMemo(() => {
    const n = Math.min(history.length, 16);
    return history.length >= 4 ? medianOfLast(n) : (history.length >= 2 ? avgOfLast(10) : 0);
  }, [history.length]);
  const tapBPM = tapAvgInterval > 0 ? Math.round(60_000 / tapAvgInterval) : 0;
  const lastInterval = history.length ? history[history.length - 1].interval : null;

  const onTap = () => {
    const now = performance.now();
    setTapPulse(true);
    setTimeout(() => setTapPulse(false), 120);
    setHistory((prev) => {
      if (prev.length === 0) return [{ ts: now, interval: null }];
      const lastTs = prev[prev.length - 1].ts;
      const diff = now - lastTs;
      // 超过 2.5 秒无点击视为新一轮（BPM<24 不合理）
      if (diff > 2500) return [{ ts: now, interval: null }];
      const next = [...prev, { ts: now, interval: diff }];
      // 限制历史长度，避免过大
      return next.slice(-40);
    });
  };
  const resetTap = () => setHistory([]);

  /* ---------- Auto detection setup ---------- */
  const onFileChoose = () => fileInputRef.current?.click();
  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setFileSize(`${(f.size / 1024 / 1024).toFixed(2)} MB`);
    try {
      const ctx = ensureCtx();
      const arr = await f.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arr.slice(0));
      audioBufferRef.current = decoded;
    } catch {
      setErrorMsg(t('audio.err'));
      audioBufferRef.current = null;
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const computeAutoBPMFromIntervals = () => {
    const { beatIntervals } = autoStateRef.current;
    if (beatIntervals.length < 4) { setAutoBpm(null); setAutoConfidence(0); return; }
    // 使用中位数稳定结果
    const sorted = [...beatIntervals].sort((a, b) => a - b);
    const m = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
    if (median <= 0) return;
    const raw = 60_000 / median;
    // 常见 BPM 取值区间：24–240
    let bpm = Math.round(raw);
    // 对常见倍频/半频纠错（例如 138 误判 69 或 276）
    while (bpm < 50) bpm *= 2;
    while (bpm > 200) bpm = Math.round(bpm / 2);
    setAutoBpm(bpm);
    const n = beatIntervals.length;
    // 置信度：击打次数越多且区间方差越小 → 越高
    const mean = beatIntervals.reduce((a, b) => a + b, 0) / beatIntervals.length;
    const variance = beatIntervals.reduce((s, v) => s + (v - mean) ** 2, 0) / beatIntervals.length;
    const cv = Math.sqrt(variance) / (mean || 1);
    let conf: 0 | 1 | 2 | 3 = 1;
    if (n >= 12 && cv < 0.08) conf = 3;
    else if (n >= 8 && cv < 0.14) conf = 2;
    else if (cv < 0.25) conf = 1;
    else conf = 0;
    setAutoConfidence(conf);
  };

  const startAuto = async () => {
    setErrorMsg(null);
    try {
      stopAuto();
      const ctx = ensureCtx();
      if (ctx.state === 'suspended') await ctx.resume();

      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.65;
      analyserRef.current.connect(ctx.destination);

      autoStateRef.current = {
        buffer: new Array(43).fill(0),
        lastBeatTime: 0,
        beatIntervals: [],
        startTime: ctx.currentTime,
        lastEnergy: 0,
        energyHistory: [],
      };

      if (audioSource === 'mic') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const src = ctx.createMediaStreamSource(stream);
        sourceNodeRef.current = src;
        src.connect(analyserRef.current);
      } else {
        if (!audioBufferRef.current) { setErrorMsg(t('auto.nofile')); return; }
        const src = ctx.createBufferSource();
        src.buffer = audioBufferRef.current;
        src.loop = true;
        sourceNodeRef.current = src;
        src.connect(analyserRef.current);
        try { src.start(0); } catch { /* noop */ }
      }

      setDetecting(true);
      setAutoBpm(null);
      setAutoConfidence(0);

      const tick = () => {
        const ana = analyserRef.current;
        if (!ana) return;
        const freq = new Uint8Array(ana.frequencyBinCount);
        ana.getByteFrequencyData(freq);
        // 低-中频段(鼓点 bass / kick)更有节拍信息，取 0..length/4 范围平均能量
        const lowBand = freq.subarray(0, Math.floor(freq.length / 4));
        let e = 0;
        for (let i = 0; i < lowBand.length; i++) e += lowBand[i];
        e = e / lowBand.length;
        const state = autoStateRef.current;
        state.energyHistory.push(e);
        if (state.energyHistory.length > 150) state.energyHistory.shift();
        // 动态阈值（短窗平均）
        const win = state.energyHistory.slice(-43);
        const localAvg = win.reduce((a, b) => a + b, 0) / Math.max(1, win.length);
        const threshold = localAvg * 1.35 + 6;
        const tNow = performance.now();
        const minGap = 260; // 最快 BPM≈230 对应 ~260ms
        if (e > threshold && e - state.lastEnergy > 6 && (tNow - state.lastBeatTime) > minGap) {
          if (state.lastBeatTime !== 0) {
            const interval = tNow - state.lastBeatTime;
            // 过滤超长间隔(BPM<40 不合理)
            if (interval < 1500) {
              state.beatIntervals.push(interval);
              if (state.beatIntervals.length > 120) state.beatIntervals.shift();
            }
          }
          state.lastBeatTime = tNow;
          computeAutoBPMFromIntervals();
        }
        state.lastEnergy = e;
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      if (audioSource === 'mic' && err && typeof err === 'object' && (err as { name?: string }).name === 'NotAllowedError') {
        setErrorMsg(t('mic.denied'));
      } else {
        setErrorMsg(t('audio.err'));
      }
      setDetecting(false);
    }
  };

  const recentIntervals = useMemo(() => {
    const arr = history.map((h) => h.interval).filter((v): v is number => v != null);
    return arr.slice(-16);
  }, [history]);

  const copyBpm = async (bpm: number, field: 'tap' | 'auto') => {
    try { await navigator.clipboard.writeText(String(bpm)); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = String(bpm);
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied((s) => ({ ...s, [field]: true }));
    setTimeout(() => setCopied((s) => ({ ...s, [field]: false })), 1600);
  };

  const ranges = [
    { key: 'slow', min: 60, max: 90, color: 'from-sky-400 to-cyan-400' },
    { key: 'pop', min: 90, max: 110, color: 'from-emerald-400 to-teal-400' },
    { key: 'dance', min: 110, max: 130, color: 'from-amber-400 to-orange-400' },
    { key: 'edm', min: 128, max: 150, color: 'from-fuchsia-400 to-pink-400' },
    { key: 'hard', min: 150, max: 180, color: 'from-rose-500 to-red-500' },
  ];
  const confidenceLabel = (c: 0 | 1 | 2 | 3) =>
    c >= 3 ? t('auto.confidence.high') : c >= 2 ? t('auto.confidence.mid') : t('auto.confidence.low');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-2">
                {([
                  { k: 'tap', label: t('mode.tap'), icon: Hand },
                  { k: 'auto', label: t('mode.auto'), icon: Zap },
                ] as { k: Mode; label: string; icon: typeof Hand }[]).map((opt) => (
                  <button
                    key={opt.k}
                    type="button"
                    onClick={() => { setMode(opt.k); if (opt.k === 'tap') stopAuto(); }}
                    className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all min-h-[48px] touch-manipulation flex items-center justify-center gap-2 ${
                      mode === opt.k
                        ? 'bg-rose-50 dark:bg-rose-900/25 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200 shadow-sm'
                        : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <opt.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* ============ TAP MODE ============ */}
              {mode === 'tap' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <button
                      type="button"
                      onPointerDown={(e) => { e.preventDefault(); onTap(); }}
                      className={`relative w-full h-52 sm:h-64 rounded-3xl overflow-hidden select-none touch-manipulation transition-all ${
                        tapPulse ? 'scale-[0.985]' : 'scale-100'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 transition-transform ${
                        tapPulse ? 'brightness-110' : ''
                      }`} />
                      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.35),transparent_60%)] ${tapPulse ? 'opacity-100' : 'opacity-60'}`} />
                      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white px-4">
                        <span className="text-sm sm:text-base font-medium opacity-80 mb-2 flex items-center gap-1.5">
                          <Music2 className="h-4 w-4" />
                          {t('tap.tap')}
                        </span>
                        <div className={`text-5xl sm:text-7xl font-black tabular-nums tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-all ${
                          tapPulse ? 'scale-110' : ''
                        }`}>
                          {tapBPM || <span className="opacity-50">--</span>}
                        </div>
                        <span className="text-sm sm:text-base font-semibold opacity-80 mt-2">BPM</span>
                        <div className="mt-3 text-xs sm:text-sm font-medium opacity-75">
                          {t('tap.taps', { n: history.length })}
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{t('tap.currentBPM')}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                          {tapBPM || '--'}
                        </div>
                        <button
                          type="button"
                          onClick={() => tapBPM && copyBpm(tapBPM, 'tap')}
                          disabled={!tapBPM}
                          className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-40 transition-colors touch-manipulation min-h-[36px]"
                          title={t('action.copy')}
                        >
                          {copied.tap ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        {t('tap.avgBPM', { n: Math.min(history.length, 16) })}
                      </div>
                      <div className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                        {tapBPM || '--'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{t('tap.interval')}</div>
                      <div className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                        {lastInterval != null ? `${lastInterval}${t('tap.ms')}` : '--'}
                      </div>
                    </div>
                  </div>

                  {recentIntervals.length > 0 && (
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t('tap.range')}
                        </h3>
                        <button
                          type="button"
                          onClick={resetTap}
                          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 flex items-center gap-1.5 min-h-[30px] touch-manipulation"
                        >
                          <RotateCcw className="h-3 w-3" />
                          {t('tap.reset')}
                        </button>
                      </div>
                      <div className="flex items-end gap-1 h-20">
                        {recentIntervals.map((iv, i) => {
                          const bpm = 60_000 / iv;
                          const clamped = Math.max(40, Math.min(200, bpm));
                          const h = ((clamped - 40) / 160) * 100;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                              <div className="w-full rounded-t-md bg-gradient-to-t from-rose-500 to-pink-400 transition-all" style={{ height: `${Math.max(6, h)}%` }} />
                              <div className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400 truncate w-full text-center">{Math.round(bpm)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============ AUTO MODE ============ */}
              {mode === 'auto' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {([
                      { k: 'upload', label: t('auto.upload'), icon: Upload },
                      { k: 'mic', label: t('auto.mic'), icon: Mic },
                    ] as const).map((opt) => (
                      <button
                        key={opt.k}
                        type="button"
                        onClick={() => { setAudioSource(opt.k); stopAuto(); setAutoBpm(null); setAutoConfidence(0); }}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all min-h-[48px] touch-manipulation flex items-center justify-center gap-2 ${
                          audioSource === opt.k
                            ? 'bg-rose-50 dark:bg-rose-900/25 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200 shadow-sm'
                            : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <opt.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {audioSource === 'upload' && (
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={onFileSelected}
                        className="hidden"
                      />
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={onFileChoose}
                          className="px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
                        >
                          <Upload className="h-4 w-4" />
                          {t('auto.chooseFile')}
                        </button>
                        <div className="flex-1 text-sm">
                          {fileName ? (
                            <div className="text-gray-800 dark:text-gray-100 font-medium truncate">
                              {t('auto.fileSelected', { name: fileName, size: fileSize })}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Volume2 className="h-3.5 w-3.5 opacity-60" />
                              {t('size.note')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {audioSource === 'mic' && (
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <Mic className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">{t('auto.mic')}</span>：{t('size.note')}
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 sm:p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-900/10 text-rose-700 dark:text-rose-200 flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {!detecting ? (
                      <button
                        type="button"
                        onClick={startAuto}
                        className="px-5 py-3 rounded-xl btn-primary font-semibold flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
                      >
                        <Play className="h-5 w-5" />
                        {t('auto.start')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopAuto}
                        className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 min-h-[48px] touch-manipulation"
                      >
                        <Pause className="h-5 w-5" />
                        {t('auto.stop')}
                      </button>
                    )}
                    {detecting && (
                      <div className="flex-1 flex items-center gap-2 text-sm text-rose-700 dark:text-rose-300 font-medium animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-3.5" />
                        {t('auto.detecting')}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/10">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('auto.result')}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                          {autoBpm || '--'}
                        </div>
                        <button
                          type="button"
                          onClick={() => autoBpm && copyBpm(autoBpm, 'auto')}
                          disabled={!autoBpm}
                          className="p-2 rounded-lg bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-200 disabled:opacity-40 transition-colors mb-2 touch-manipulation min-h-[36px]"
                          title={t('action.copy')}
                        >
                          {copied.auto ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      {autoBpm && (
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                          BPM · {t('auto.confidence')}:
                          <span className={`ml-1 font-semibold ${
                            autoConfidence >= 3 ? 'text-emerald-600 dark:text-emerald-300'
                              : autoConfidence >= 2 ? 'text-amber-600 dark:text-amber-300'
                              : 'text-rose-600 dark:text-rose-300'
                          }`}>
                            {confidenceLabel(autoConfidence)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">{t('auto.bpmrange')}</h3>
                      <ul className="space-y-2">
                        {ranges.map((r) => {
                          const active = !!autoBpm && autoBpm >= r.min && autoBpm <= r.max;
                          return (
                            <li
                              key={r.key}
                              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${
                                active
                                  ? 'bg-gradient-to-r text-white shadow-sm ' + r.color
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                            >
                              <span className="font-medium">{t(r.key)}</span>
                              <span className="tabular-nums text-xs opacity-90">{r.min}–{r.max}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 sm:p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-200 leading-relaxed">{t('tip')}</p>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t('features')}</h3>
            <ul className="space-y-3">
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
