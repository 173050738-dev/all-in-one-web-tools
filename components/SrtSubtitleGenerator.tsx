'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Captions,
  Download,
  Copy,
  Check,
  FileText,
  Settings2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SrtSubtitleGeneratorProps {
  locale?: string;
}

type SplitMode = 'punctuation' | 'chars' | 'duration';

type SubCue = {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
};

export default function SrtSubtitleGenerator({ locale = 'zh' }: SrtSubtitleGeneratorProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'title': '本地 SRT 字幕生成器',
      'subtitle': '剪辑博主高频工具。粘贴文案一键按标点/字数/时长均匀拆分生成标准 SRT 字幕，纯本地处理不上传任何内容。',
      'tip': '💡 提示：先粘贴你的口播文案，在「拆分方式」里选择：1) 按标点（智能分句，适合中文口播）；2) 按字数（如每句 12 字，适合短视频卡画面）；3) 按时长均匀（输入视频总时长自动均分）。导出可下载 .srt 或直接复制文本贴到剪映 / PR。',
      'features': '功能特点',
      'f1': '三种拆分模式：按标点 / 按字数 / 按总时长均匀',
      'f2': '自定义每句字数、起始时间偏移、整体字幕时长',
      'f3': '标准 SRT 时间轴格式修正（毫秒四舍五入、HH:MM:SS,mmm）',
      'f4': '一键下载 .srt 文件或复制全部文本到剪映 / PR / Final Cut',
      'f5': '支持中文、英文、日文、阿拉伯语等任意 Unicode 文本',
      'f6': '100% 浏览器端处理，你的文案从不离开你的电脑',
      'script.placeholder': '在此粘贴你的口播文案…\n\n例如：大家好，欢迎来到 Korelyy 工具站。今天我们来聊一聊怎么把一篇几千字的文案，一键变成可以直接剪辑的字幕文件。',
      'script.label': '口播文案',
      'split.mode': '拆分方式',
      'mode.punctuation': '按标点分句（推荐）',
      'mode.chars': '按字数拆分',
      'mode.duration': '按总时长均匀',
      'chars.per.line': '每句字数',
      'total.duration': '视频总时长',
      'seconds': '秒',
      'start.offset': '起始时间偏移',
      'milliseconds': '毫秒',
      'gap.between': '句间留白(ms)',
      'preview': '字幕预览（共 {n} 条）',
      'index': '序号',
      'timerange': '时间',
      'content': '内容',
      'no.cues': '暂无字幕预览，请先输入文案并调整参数。',
      'action.reset': '重置参数',
      'action.download': '下载 .srt',
      'action.copy': '复制 SRT 文本',
      'action.copied': '已复制',
      'filename': '文件名',
      'default.filename': 'korelyy-subtitles',
      'chars': '字',
      'cues': '条字幕',
    },
    en: {
      'title': 'Local SRT Subtitle Generator',
      'subtitle': 'A go-to tool for video editors. Paste your script, split by punctuation / char count / duration, and export standard SRT — all processed locally, nothing uploaded.',
      'tip': '💡 Tip: Paste your script first, then choose a split mode: 1) Punctuation (smart sentence split, great for voiceover scripts). 2) Character count (e.g. 20 chars per line for short-form clips). 3) Even duration spread (punch in total video length). Export via .srt download or copy text straight into Premiere / DaVinci / CapCut.',
      'features': 'Features',
      'f1': '3 split modes: punctuation / char-count / even-duration',
      'f2': 'Customizable chars per line, start-offset, total duration',
      'f3': 'Standard SRT timestamp format (HH:MM:SS,mmm, ms rounding)',
      'f4': 'One-click .srt download or copy raw text to Premiere / CapCut / FCP',
      'f5': 'Works with Chinese, English, Japanese, Arabic — any Unicode text',
      'f6': '100% in-browser. Your script never leaves your device.',
      'script.placeholder': 'Paste your voiceover script here…\n\nExample: Hey everyone, welcome back to Korelyy Tools. Today we will look at how to turn a thousand-word script into ready-to-edit subtitles in one click.',
      'script.label': 'Voiceover Script',
      'split.mode': 'Split Mode',
      'mode.punctuation': 'By punctuation (recommended)',
      'mode.chars': 'By character count',
      'mode.duration': 'Even by total duration',
      'chars.per.line': 'Chars per line',
      'total.duration': 'Total video length',
      'seconds': ' sec',
      'start.offset': 'Start offset',
      'milliseconds': ' ms',
      'gap.between': 'Gap between lines (ms)',
      'preview': 'Preview ({n} cues)',
      'index': '#',
      'timerange': 'Time',
      'content': 'Text',
      'no.cues': 'No cues yet. Paste a script and adjust the options.',
      'action.reset': 'Reset',
      'action.download': 'Download .srt',
      'action.copy': 'Copy SRT Text',
      'action.copied': 'Copied',
      'filename': 'File name',
      'default.filename': 'korelyy-subtitles',
      'chars': ' chars',
      'cues': ' cues',
    },
    fr: {
      'title': 'Générateur de Sous-Titres SRT Local',
      'subtitle': 'Outil essentiel pour monteurs vidéo. Collez votre texte, découpez par ponctuation / nombre de caractères / durée, exportez en SRT — tout en local.',
      'tip': '💡 Astuce : Collez d\'abord votre texte puis choisissez un mode : 1) Ponctuation (découpage intelligent). 2) Nombre de caractères (p. ex. 25 par ligne). 3) Répartition égale par durée. Téléchargez le .srt ou copiez le texte dans Premiere / CapCut / Final Cut.',
      'features': 'Fonctionnalités',
      'f1': '3 modes de découpage : ponctuation / caractères / durée',
      'f2': 'Caractères par ligne, décalage, durée totale personnalisables',
      'f3': 'Horodatage SRT standard (HH:MM:SS,mmm)',
      'f4': 'Téléchargement .srt ou copie du texte en un clic',
      'f5': 'Compatible chinois, anglais, japonais, arabe (tout Unicode)',
      'f6': '100% dans le navigateur, aucune donnée envoyée',
      'script.placeholder': 'Collez votre script voix off ici…',
      'script.label': 'Script Voix Off',
      'split.mode': 'Mode de Découpage',
      'mode.punctuation': 'Par ponctuation (recommandé)',
      'mode.chars': 'Par nombre de caractères',
      'mode.duration': 'Réparti par durée totale',
      'chars.per.line': 'Caractères par ligne',
      'total.duration': 'Durée totale vidéo',
      'seconds': ' s',
      'start.offset': 'Décalage de début',
      'milliseconds': ' ms',
      'gap.between': 'Pause entre lignes (ms)',
      'preview': 'Aperçu ({n} lignes)',
      'index': '#',
      'timerange': 'Temps',
      'content': 'Texte',
      'no.cues': 'Aucune ligne pour le moment. Collez un script et ajustez les options.',
      'action.reset': 'Réinitialiser',
      'action.download': 'Télécharger .srt',
      'action.copy': 'Copier le texte SRT',
      'action.copied': 'Copié',
      'filename': 'Nom de fichier',
      'default.filename': 'korelyy-sous-titres',
      'chars': ' car.',
      'cues': ' lignes',
    },
    es: {
      'title': 'Generador Local de Subtítulos SRT',
      'subtitle': 'Herramienta esencial para editores. Pega tu guion, divide por puntuación / caracteres / duración y exporta SRT — todo procesado localmente.',
      'tip': '💡 Consejo: Pega tu guion primero y elige un modo: 1) Puntuación (recomendado para locuciones). 2) Número de caracteres (p. ej. 20 por línea). 3) Reparto uniforme por duración. Descarga el .srt o copia directamente a Premiere / CapCut.',
      'features': 'Características',
      'f1': '3 modos de división: puntuación / caracteres / duración',
      'f2': 'Personaliza caracteres por línea, desfase y duración total',
      'f3': 'Marcas de tiempo SRT estándar (HH:MM:SS,mmm)',
      'f4': 'Descarga .srt o copia el texto en un clic',
      'f5': 'Funciona con chino, inglés, japonés, árabe (Unicode)',
      'f6': '100% en el navegador, nada se sube a servidores',
      'script.placeholder': 'Pega aquí tu guion de locución…',
      'script.label': 'Guion de Locución',
      'split.mode': 'Modo de División',
      'mode.punctuation': 'Por puntuación (recomendado)',
      'mode.chars': 'Por número de caracteres',
      'mode.duration': 'Uniforme por duración total',
      'chars.per.line': 'Caracteres por línea',
      'total.duration': 'Duración total del vídeo',
      'seconds': ' seg',
      'start.offset': 'Desfase inicial',
      'milliseconds': ' ms',
      'gap.between': 'Pausa entre líneas (ms)',
      'preview': 'Vista previa ({n} líneas)',
      'index': '#',
      'timerange': 'Tiempo',
      'content': 'Texto',
      'no.cues': 'Sin líneas aún. Pega un guion y ajusta las opciones.',
      'action.reset': 'Restablecer',
      'action.download': 'Descargar .srt',
      'action.copy': 'Copiar texto SRT',
      'action.copied': 'Copiado',
      'filename': 'Nombre de archivo',
      'default.filename': 'korelyy-subtitulos',
      'chars': ' car.',
      'cues': ' líneas',
    },
    hi: {
      'title': 'स्थानीय SRT सबटाइटल जनरेटर',
      'subtitle': 'वीडियो एडिटर्स के लिए आवश्यक टूल। अपनी स्क्रिप्ट पेस्ट करें, विराम / अक्षर संख्या / अवधि के अनुसार विभाजित करें, SRT निर्यात करें — सब स्थानीय।',
      'tip': '💡 सुझाव: पहले स्क्रिप्ट पेस्ट करें, फिर मोड चुनें: 1) विराम चिह्न (बुद्धिमान वाक्य विभाजन)। 2) अक्षर संख्या। 3) कुल अवधि में समान बंटवारा। .srt डाउनलोड करें या सीधे CapCut / Premiere में पेस्ट करें।',
      'features': 'विशेषताएं',
      'f1': '3 विभाजन मोड: विराम / अक्षर संख्या / अवधि',
      'f2': 'प्रति लाइन अक्षर, प्रारंभिक ऑफसेट, कुल अवधि अनुकूलन योग्य',
      'f3': 'मानक SRT टाइमस्टैम्प (HH:MM:SS,mmm)',
      'f4': 'एक क्लिक में .srt डाउनलोड या टेक्स्ट कॉपी',
      'f5': 'चीनी, अंग्रेजी, जापानी, अरबी — सभी Unicode के साथ काम करता है',
      'f6': '100% ब्राउज़र में, आपकी स्क्रिप्ट कभी भी अपलोड नहीं होती',
      'script.placeholder': 'अपनी वॉइसओवर स्क्रिप्ट यहां पेस्ट करें…',
      'script.label': 'वॉइसओवर स्क्रिप्ट',
      'split.mode': 'विभाजन मोड',
      'mode.punctuation': 'विराम चिह्न द्वारा (अनुशंसित)',
      'mode.chars': 'अक्षर संख्या द्वारा',
      'mode.duration': 'कुल अवधि में समान',
      'chars.per.line': 'प्रति लाइन अक्षर',
      'total.duration': 'कुल वीडियो लंबाई',
      'seconds': ' सेकंड',
      'start.offset': 'प्रारंभिक ऑफसेट',
      'milliseconds': ' मिलीसेकंड',
      'gap.between': 'लाइनों के बीच अंतराल (मिली)',
      'preview': 'पूर्वावलोकन ({n} लाइनें)',
      'index': '#',
      'timerange': 'समय',
      'content': 'टेक्स्ट',
      'no.cues': 'अभी कोई लाइन नहीं। स्क्रिप्ट पेस्ट करें और विकल्प समायोजित करें।',
      'action.reset': 'रीसेट',
      'action.download': '.srt डाउनलोड करें',
      'action.copy': 'SRT टेक्स्ट कॉपी करें',
      'action.copied': 'कॉपी हो गया',
      'filename': 'फ़ाइल का नाम',
      'default.filename': 'korelyy-sabtitls',
      'chars': ' अक्षर',
      'cues': ' लाइनें',
    },
    ar: {
      'title': 'مولد ترجمات SRT المحلي',
      'subtitle': 'أداة أساسية لمحرري الفيديو. الصق النص، قسم حسب علامات الترقيم / عدد الأحرف / المدة، ثم صدّر SRT — كل شيء محلياً دون رفع.',
      'tip': '💡 نصيحة: الصق النص أولاً ثم اختر الوضع: 1) حسب علامات الترقيم (موصى به). 2) حسب عدد الأحرف. 3) توزيع متساوٍ حسب المدة الإجمالية. حمل الملف .srt أو انسخه مباشرة إلى بريمير / كاب كت.',
      'features': 'الميزات',
      'f1': '3 أوضاع تقسيم: علامات ترقيم / عدد أحرف / مدة إجمالية',
      'f2': 'تحكم في الأحرف لكل سطر، الإزاحة الأولية، والمدة الإجمالية',
      'f3': 'طوابع زمنية SRT قياسية (HH:MM:SS,mmm)',
      'f4': 'تحميل .srt أو نسخ النص بنقرة واحدة',
      'f5': 'يدعم الصينية والإنجليزية واليابانية والعربية — أي نص Unicode',
      'f6': 'يعمل 100% في المتصفح، نصك لا يغادر جهازك أبداً',
      'script.placeholder': 'الصق سكريبت التعليق الصوتي هنا…',
      'script.label': 'سكريبت التعليق الصوتي',
      'split.mode': 'وضع التقسيم',
      'mode.punctuation': 'حسب علامات الترقيم (موصى به)',
      'mode.chars': 'حسب عدد الأحرف',
      'mode.duration': 'متساوي حسب المدة الإجمالية',
      'chars.per.line': 'الأحرف لكل سطر',
      'total.duration': 'المدة الإجمالية للفيديو',
      'seconds': ' ثانية',
      'start.offset': 'الإزاحة الأولية',
      'milliseconds': ' مللي ثانية',
      'gap.between': 'فاصل بين الأسطر (مللي ثانية)',
      'preview': 'معاينة ({n} سطر)',
      'index': '#',
      'timerange': 'الوقت',
      'content': 'النص',
      'no.cues': 'لا توجد أسطر بعد. الصق سكريبتاً واضبط الخيارات.',
      'action.reset': 'إعادة ضبط',
      'action.download': 'تحميل .srt',
      'action.copy': 'نسخ نص SRT',
      'action.copied': 'تم النسخ',
      'filename': 'اسم الملف',
      'default.filename': 'korelyy-tarjamat',
      'chars': ' حرف',
      'cues': ' سطر',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };
  const t = getT(locale);
  const rtl = locale === 'ar';

  const [script, setScript] = useState('');
  const [mode, setMode] = useState<SplitMode>('punctuation');
  const [charsPerLine, setCharsPerLine] = useState(18);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [startOffsetMs, setStartOffsetMs] = useState(0);
  const [gapMs, setGapMs] = useState(120);
  const [filename, setFilename] = useState('korelyy-subtitles');
  const [copied, setCopied] = useState(false);

  const charCount = script.replace(/\s/g, '').length;

  const splitByPunctuation = (text: string): string[] => {
    if (!text) return [];
    const normalized = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
    if (!normalized) return [];
    const parts: string[] = [];
    let buf = '';
    for (let i = 0; i < normalized.length; i++) {
      const c = normalized[i];
      buf += c;
      if (/[。！？!?；;\n]/.test(c) || (c === '.' && /[\u4e00-\u9fa5A-Za-z0-9]/.test(normalized[i - 1] ?? '') && /\s/.test(normalized[i + 1] ?? ''))) {
        const seg = buf.trim();
        if (seg) parts.push(seg);
        buf = '';
      }
    }
    if (buf.trim()) parts.push(buf.trim());
    return parts.filter((p) => p.length > 0);
  };

  const splitByChars = (text: string, limit: number): string[] => {
    if (!text || limit <= 0) return [];
    const cleaned = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
    if (!cleaned) return [];
    const out: string[] = [];
    let i = 0;
    while (i < cleaned.length) {
      let end = Math.min(i + limit, cleaned.length);
      let chunk = cleaned.slice(i, end);
      if (end < cleaned.length) {
        const lastPunct = /[，,。！？!?；;、]/.exec(chunk.split('').reverse().join(''));
        if (lastPunct && lastPunct.index !== undefined) {
          const idxFromEnd = lastPunct.index;
          const cutAt = chunk.length - idxFromEnd;
          if (cutAt > Math.floor(limit * 0.5)) {
            chunk = chunk.slice(0, cutAt);
            end = i + cutAt;
          }
        }
      }
      chunk = chunk.trim();
      if (chunk) out.push(chunk);
      i = end;
      while (i < cleaned.length && /\s/.test(cleaned[i])) i++;
    }
    return out;
  };

  const cues = useMemo<SubCue[]>(() => {
    let segments: string[] = [];
    if (mode === 'punctuation') {
      segments = splitByPunctuation(script);
    } else if (mode === 'chars') {
      segments = splitByChars(script, Math.max(1, charsPerLine));
    } else {
      const puncSegs = splitByPunctuation(script);
      segments = puncSegs.length > 0 ? puncSegs : splitByChars(script, Math.max(1, charsPerLine));
    }
    const n = segments.length;
    if (n === 0) return [];

    const totalMs = Math.max(1, totalSeconds) * 1000;
    const gapTotal = Math.max(0, gapMs) * Math.max(0, n - 1);
    const speakMs = Math.max(totalMs - gapTotal - Math.max(0, startOffsetMs), n * 200);
    const perCue = Math.floor(speakMs / n);
    let cursor = Math.max(0, startOffsetMs);
    const result: SubCue[] = [];
    segments.forEach((s, i) => {
      const start = cursor;
      const end = cursor + perCue;
      result.push({ index: i + 1, startMs: start, endMs: end, text: s });
      cursor = end + Math.max(0, gapMs);
    });
    return result;
  }, [script, mode, charsPerLine, totalSeconds, startOffsetMs, gapMs]);

  const fmtTime = (ms: number) => {
    const clamped = Math.max(0, Math.floor(ms));
    const hh = Math.floor(clamped / 3_600_000);
    const mm = Math.floor((clamped % 3_600_000) / 60_000);
    const ss = Math.floor((clamped % 60_000) / 1000);
    const mmm = clamped % 1000;
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const pad3 = (n: number) => String(n).padStart(3, '0');
    return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)},${pad3(mmm)}`;
  };

  const srtText = useMemo(() => {
    return cues
      .map(
        (c) =>
          `${c.index}\n${fmtTime(c.startMs)} --> ${fmtTime(c.endMs)}\n${c.text}\n`
      )
      .join('\n')
      .trim() + (cues.length ? '\n' : '');
  }, [cues]);

  const downloadSrt = useCallback(() => {
    if (!cues.length) return;
    const blob = new Blob([srtText], { type: 'application/x-subrip;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (filename || 'subtitles').replace(/[\\/:*?"<>|]/g, '_');
    a.href = url;
    a.download = `${safeName}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [cues, srtText, filename]);

  const copySrt = async () => {
    if (!srtText) return;
    try {
      await navigator.clipboard.writeText(srtText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = srtText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resetAll = () => {
    setScript('');
    setMode('punctuation');
    setCharsPerLine(18);
    setTotalSeconds(60);
    setStartOffsetMs(0);
    setGapMs(120);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                <Captions className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t('script.label')}
                  </label>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                    <span className="tabular-nums">
                      <Sparkles className="h-3 w-3 inline mr-1 text-violet-500" />
                      {charCount}{t('chars')}
                    </span>
                    <span className="tabular-nums text-violet-600 dark:text-violet-400 font-medium">
                      {cues.length}{t('cues')}
                    </span>
                  </div>
                </div>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder={t('script.placeholder')}
                  rows={8}
                  className="input-base w-full resize-y text-sm leading-relaxed min-h-[180px] touch-manipulation"
                  dir={rtl ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Settings2 className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('split.mode')}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                  {([
                    { key: 'punctuation', label: t('mode.punctuation') },
                    { key: 'chars', label: t('mode.chars') },
                    { key: 'duration', label: t('mode.duration') },
                  ] as { key: SplitMode; label: string }[]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setMode(opt.key)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all min-h-[44px] touch-manipulation text-left ${
                        mode === opt.key
                          ? 'bg-violet-50 dark:bg-violet-900/25 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-200 shadow-sm'
                          : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t('chars.per.line')}
                      </label>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tabular-nums">{charsPerLine}</span>
                    </div>
                    <input
                      type="range" min={4} max={80} step={1}
                      value={charsPerLine}
                      onChange={(e) => setCharsPerLine(parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t('total.duration')}
                      </label>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                        {totalSeconds}{t('seconds')}
                      </span>
                    </div>
                    <input
                      type="number" min={1} step={1}
                      value={totalSeconds}
                      onChange={(e) => setTotalSeconds(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-base w-full h-9 text-sm tabular-nums touch-manipulation"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t('start.offset')}
                      </label>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                        {startOffsetMs}{t('milliseconds')}
                      </span>
                    </div>
                    <input
                      type="number" min={0} step={100}
                      value={startOffsetMs}
                      onChange={(e) => setStartOffsetMs(Math.max(0, parseInt(e.target.value) || 0))}
                      className="input-base w-full h-9 text-sm tabular-nums touch-manipulation"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t('gap.between')}
                      </label>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                        {gapMs}{t('milliseconds')}
                      </span>
                    </div>
                    <input
                      type="range" min={0} max={1500} step={40}
                      value={gapMs}
                      onChange={(e) => setGapMs(parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">{t('filename')}</label>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder={t('default.filename')}
                    className="input-base w-full h-9 text-sm touch-manipulation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('action.reset')}
                </button>
                <button
                  type="button"
                  onClick={copySrt}
                  disabled={!cues.length}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? t('action.copied') : t('action.copy')}
                </button>
                <button
                  type="button"
                  onClick={downloadSrt}
                  disabled={!cues.length}
                  className="px-4 py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
                >
                  <Download className="h-4 w-4" />
                  {t('action.download')}
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t('preview', { n: cues.length })}
                  </h3>
                </div>
                {cues.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('no.cues')}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 backdrop-blur-sm">
                          <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                            <th className="px-3 py-2 font-medium w-12">{t('index')}</th>
                            <th className="px-3 py-2 font-medium w-52 tabular-nums">{t('timerange')}</th>
                            <th className="px-3 py-2 font-medium">{t('content')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {cues.map((c) => (
                            <tr key={c.index} className="hover:bg-violet-50/40 dark:hover:bg-violet-900/10">
                              <td className="px-3 py-2.5 tabular-nums text-gray-500 dark:text-gray-400 align-top">{c.index}</td>
                              <td className="px-3 py-2.5 tabular-nums text-xs text-gray-600 dark:text-gray-300 align-top whitespace-nowrap">
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{fmtTime(c.startMs)}</span>
                                <span className="text-gray-400 mx-1">→</span>
                                <span className="text-rose-600 dark:text-rose-400 font-mono">{fmtTime(c.endMs)}</span>
                              </td>
                              <td className="px-3 py-2.5 text-gray-800 dark:text-gray-200 align-top leading-relaxed" dir={rtl ? 'rtl' : 'ltr'}>
                                {c.text}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <p className="text-xs sm:text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                  {t('tip')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t('features')}</h3>
            <ul className="space-y-3">
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
