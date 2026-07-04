'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Download, Scissors, Film } from 'lucide-react';

interface ScriptSplitterProps {
  locale?: string;
}

type TokenType = 'narration' | 'dialogue' | 'pause';

interface Token {
  type: TokenType;
  text: string;
  person?: string;
  chars: number;
  dur: number;
  pauseDur?: number;
}

interface Segment {
  index: number;
  tokens: Token[];
  start: number;
  end: number;
  totalChars: number;
  totalDur: number;
  totalPause: number;
}

const i18n = {
  zh: { title:"口播脚本时长分割器", subtitle:"旁白/对话/停顿区分 + 15s/30s/60s/3min自动拆分", input:"粘贴口播脚本（旁白、对话:冒号、(停顿)括号、/ 斜杠等区分）", narration:"旁白", dialogue:"对话 [人物:内容]", pause:"(停顿 / /)", rate:"语速 (字/分)", slow:"慢速 180字/分", mid:"中速 220字/分", fast:"快速 260字/分", custom:"自定义", segMode:"按目标时长拆分", s15:"15秒短视频", s30:"30秒短视频", s60:"60秒 (1分钟)", s3min:"3分钟短片", autoSegment:"自动拆分 ↓", parts:"第{n}段", startEnd:"{s}s → {e}s", chars:"字数", duration:"时长(s)", cue:"卡点停顿", exportSrt:"导出 SRT 字幕", exportCue:"导出卡点标注 TXT", copyAll:"复制全部分段", legendNar:"旁白（黑色字数）", legendDia:"对话（蓝色字数）", legendPause:"停顿（灰色时长）", hintTip:"输入格式提示：\n旁白普通段落直接写；\n人物对话：小明:你好啊！\n(停顿 2秒) 或 // 代表停顿；\n空行代表镜头切换。" },
  en: { title:"Script Duration Splitter", subtitle:"Narration/Dialogue/Pause + 15s/30s/60s/3min split", input:"Paste script (lines, Person: dialogue, (pause N sec), //)", narration:"Narration", dialogue:"Dialogue Person:text", pause:"(Pause / /)", rate:"Words/min", slow:"Slow 180", mid:"Medium 220", fast:"Fast 260", custom:"Custom", segMode:"Target duration", s15:"15s short", s30:"30s short", s60:"60s 1min", s3min:"3min clip", autoSegment:"Auto split ↓", parts:"Seg {n}", startEnd:"{s}s → {e}s", chars:"Chars", duration:"Dur (s)", cue:"Cue/Pause", exportSrt:"Export SRT", exportCue:"Export cues.txt", copyAll:"Copy all", legendNar:"Narration (black)", legendDia:"Dialogue (blue)", legendPause:"Pause (gray)", hintTip:"Format:\nPlain = narration;\nPerson: line = dialogue;\n(Pause 2s) or // = pause;\nBlank line = scene cut." },
  hi: { title:"स्क्रिप्ट स्प्लिटर", subtitle:"कथन/संवाद/विराम + 15s/30s/60s/3min", input:"स्क्रिप्ट डालें", narration:"कथन", dialogue:"संवाद व्यक्ति:पंक्ति", pause:"(विराम)", rate:"शब्द/मिनट", slow:"धीमा 180", mid:"मध्यम 220", fast:"तेज 260", custom:"कस्टम", segMode:"लक्ष्य अवधि", s15:"15s", s30:"30s", s60:"60s 1मिनट", s3min:"3मिनट", autoSegment:"ऑटो स्प्लिट ↓", parts:"भाग {n}", startEnd:"{s}s → {e}s", chars:"अक्षर", duration:"समय (s)", cue:"क्यू/विराम", exportSrt:"SRT निर्यात", exportCue:"क्यू .txt निर्यात", copyAll:"सभी कॉपी", legendNar:"कथन", legendDia:"संवाद नीला", legendPause:"विराम ग्रे", hintTip:"फॉर्मेट: सादा=कथन; Person:पंक्ति=संवाद; (Pause 2s)=विराम" },
  fr: { title:"Séparateur de Script", subtitle:"Narration/Dial./Pause + 15/30/60s/3min", input:"Collez le script", narration:"Narration", dialogue:"Dial. Pers:texte", pause:"(Pause)", rate:"Mots/min", slow:"Lent 180", mid:"Moyen 220", fast:"Rapide 260", custom:"Perso", segMode:"Durée cible", s15:"15s", s30:"30s", s60:"60s 1min", s3min:"3min", autoSegment:"Auto ↓", parts:"Seg {n}", startEnd:"{s}s → {e}s", chars:"Car.", duration:"Durée (s)", cue:"Coupure", exportSrt:"Exporter SRT", exportCue:"Exporter cues", copyAll:"Tout copier", legendNar:"Narration", legendDia:"Dial. bleu", legendPause:"Pause grise", hintTip:"Format : simple = narration ; Pers:texte = dialogue ; (Pause 2s) = pause." },
  es: { title:"Divisor de Guion", subtitle:"Nar./Diálogo/Pausa + 15/30/60s/3min", input:"Pega el guion", narration:"Narración", dialogue:"Diálogo Pers:texto", pause:"(Pausa)", rate:"Palabras/min", slow:"Lento 180", mid:"Medio 220", fast:"Rápido 260", custom:"Pers.", segMode:"Duración obj.", s15:"15s", s30:"30s", s60:"60s 1min", s3min:"3min", autoSegment:"Auto ↓", parts:"Seg {n}", startEnd:"{s}s → {e}s", chars:"Car.", duration:"Dur (s)", cue:"Corte", exportSrt:"Exportar SRT", exportCue:"Exportar cues", copyAll:"Copiar todo", legendNar:"Narración", legendDia:"Diálogo azul", legendPause:"Pausa gris", hintTip:"Formato: simple = narración ; Pers:texto = diálogo ; (Pausa 2s) = pausa." },
  ar: { title:"قاسم مدة النص المكتوب", subtitle:"سرد/حوار/توقف + 15ث/30ث/60ث/3د", input:"الصق النص المكتوب", narration:"السرد", dialogue:"حوار شخص:نص", pause:"(توقف)", rate:"كلمة/دقيقة", slow:"بطيء 180", mid:"متوسط 220", fast:"سريع 260", custom:"مخصص", segMode:"المدة المستهدفة", s15:"15 ثانية", s30:"30 ثانية", s60:"60 ثانية 1د", s3min:"3 دقائق", autoSegment:"تقسيم تلقائي ↓", parts:"جزء {n}", startEnd:"{s}ث → {e}ث", chars:"حروف", duration:"المدة (ث)", cue:"علامة توقف", exportSrt:"تصدير SRT", exportCue:"تصدير علامات", copyAll:"نسخ الكل", legendNar:"سرد أسود", legendDia:"حوار أزرق", legendPause:"توقف رمادي", hintTip:"التنسيق: عادي = سرد؛ شخص:نص = حوار؛ (توقف 2 ث) = توقف." }
};

const VALID_LOCALES = Object.keys(i18n) as (keyof typeof i18n)[];

type SegMode = 15 | 30 | 60 | 180;

const SEG_MODES: { key: SegMode; label: keyof typeof i18n.zh }[] = [
  { key: 15, label: 's15' },
  { key: 30, label: 's30' },
  { key: 60, label: 's60' },
  { key: 180, label: 's3min' },
];

const RATE_PRESETS = [
  { key: 'slow', value: 180, label: 'slow' as keyof typeof i18n.zh },
  { key: 'mid', value: 220, label: 'mid' as keyof typeof i18n.zh },
  { key: 'fast', value: 260, label: 'fast' as keyof typeof i18n.zh },
];

function formatSRTTime(seconds: number): string {
  const totalMs = Math.floor(seconds * 1000);
  const h = Math.floor(totalMs / 3600000);
  const m = Math.floor((totalMs % 3600000) / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function parseTokens(input: string, rate: number): Token[] {
  const lines = input.split('\n');
  const tokens: Token[] = [];
  const dialogueRegex = /^([^:：]{1,10})[:：](.+)$/;
  const pauseRegex = /^\s*\(\s*(?:暂停|停顿|pause|विराम|توقف|Pausa)\s*(\d*\.?\d*)\s*(?:秒|s|分钟|m|ث|د)?\s*\)\s*$/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) continue;

    if (line === '//' || line === '/') {
      tokens.push({ type: 'pause', text: line, chars: 0, dur: 1, pauseDur: 1 });
      continue;
    }

    const pauseMatch = line.match(pauseRegex);
    if (pauseMatch) {
      const dur = pauseMatch[1] ? parseFloat(pauseMatch[1]) : 1;
      tokens.push({ type: 'pause', text: line, chars: 0, dur, pauseDur: dur });
      continue;
    }

    const dialogMatch = line.match(dialogueRegex);
    if (dialogMatch) {
      const person = dialogMatch[1].trim();
      const text = dialogMatch[2].trim();
      const chars = text.length;
      const dur = chars / rate * 60;
      tokens.push({ type: 'dialogue', text, person, chars, dur });
      continue;
    }

    const chars = line.length;
    const dur = chars / rate * 60;
    tokens.push({ type: 'narration', text: line, chars, dur });
  }

  return tokens;
}

function segmentTokens(tokens: Token[], segDur: number): Segment[] {
  if (tokens.length === 0) return [];

  const segments: Segment[] = [];
  let currentTokens: Token[] = [];
  let currentDur = 0;
  let currentChars = 0;
  let currentPause = 0;
  let cumulativeStart = 0;

  for (const token of tokens) {
    if (currentDur + token.dur > segDur && currentTokens.length > 0) {
      segments.push({
        index: segments.length + 1,
        tokens: [...currentTokens],
        start: cumulativeStart,
        end: cumulativeStart + currentDur,
        totalChars: currentChars,
        totalDur: currentDur,
        totalPause: currentPause,
      });
      cumulativeStart += currentDur;
      currentTokens = [];
      currentDur = 0;
      currentChars = 0;
      currentPause = 0;
    }

    currentTokens.push(token);
    currentDur += token.dur;
    currentChars += token.chars;
    if (token.type === 'pause') {
      currentPause += token.dur;
    }
  }

  if (currentTokens.length > 0) {
    segments.push({
      index: segments.length + 1,
      tokens: currentTokens,
      start: cumulativeStart,
      end: cumulativeStart + currentDur,
      totalChars: currentChars,
      totalDur: currentDur,
      totalPause: currentPause,
    });
  }

  return segments;
}

export default function ScriptSplitter({ locale = 'zh' }: ScriptSplitterProps) {
  const dict = (VALID_LOCALES.includes(locale as keyof typeof i18n) ? i18n[locale as keyof typeof i18n] : i18n.zh) as typeof i18n.zh;

  const t = (key: keyof typeof dict, vars?: Record<string, string | number>) => {
    let str = dict[key] ?? i18n.zh[key];
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  const [input, setInput] = useState('');
  const [rate, setRate] = useState(220);
  const [ratePreset, setRatePreset] = useState<string>('mid');
  const [segMode, setSegMode] = useState<SegMode>(30);
  const [copied, setCopied] = useState(false);
  const [copiedSeg, setCopiedSeg] = useState<number | null>(null);

  const tokens = useMemo(() => parseTokens(input, rate), [input, rate]);

  const segments = useMemo(() => segmentTokens(tokens, segMode), [tokens, segMode]);

  const totalChars = tokens.reduce((s, t) => s + t.chars, 0);
  const totalDur = tokens.reduce((s, t) => s + t.dur, 0);

  const handleRatePreset = (preset: string, value: number) => {
    setRatePreset(preset);
    setRate(value);
  };

  const handleCustomRate = (val: number) => {
    setRatePreset('custom');
    setRate(Math.max(1, val));
  };

  const copyToClipboard = async (text: string, segIdx?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (segIdx !== undefined) {
        setCopiedSeg(segIdx);
        setTimeout(() => setCopiedSeg(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (segIdx !== undefined) {
        setCopiedSeg(segIdx);
        setTimeout(() => setCopiedSeg(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const getAllSegmentsText = () => {
    return segments.map((seg) => {
      const lines = seg.tokens.map((tk) => {
        if (tk.type === 'dialogue') return `${tk.person}:${tk.text}`;
        if (tk.type === 'pause') return `(停顿 ${tk.pauseDur}s)`;
        return tk.text;
      }).join('\n');
      return `[${t('parts', { n: seg.index })} ${t('startEnd', { s: seg.start.toFixed(1), e: seg.end.toFixed(1) })}]\n${lines}`;
    }).join('\n\n');
  };

  const generateSRT = () => {
    const lines: string[] = [];
    let srtIndex = 1;
    for (const seg of segments) {
      for (const tk of seg.tokens) {
        if (tk.type === 'pause') continue;
        const tkStart = seg.start + seg.tokens.slice(0, seg.tokens.indexOf(tk)).reduce((s, x) => s + x.dur, 0);
        const tkEnd = tkStart + tk.dur;
        lines.push(String(srtIndex));
        lines.push(`${formatSRTTime(tkStart)} --> ${formatSRTTime(tkEnd)}`);
        lines.push(tk.type === 'dialogue' ? `${tk.person}:${tk.text}` : tk.text);
        lines.push('');
        srtIndex++;
      }
    }
    return lines.join('\n');
  };

  const generateCues = () => {
    const lines: string[] = [];
    for (const seg of segments) {
      lines.push(`[SEG ${seg.index}] ${seg.start.toFixed(1)}s → ${seg.end.toFixed(1)}s`);
      for (const tk of seg.tokens) {
        if (tk.type === 'narration') {
          lines.push(`[旁白] ${tk.text}`);
        } else if (tk.type === 'dialogue') {
          lines.push(`[对话 ${tk.person}] ${tk.text}`);
        } else if (tk.type === 'pause') {
          lines.push(`[停顿 ${tk.pauseDur?.toFixed(1)}s]`);
        }
      }
      lines.push('');
    }
    return lines.join('\n');
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySegment = (seg: Segment) => {
    const lines = seg.tokens.map((tk) => {
      if (tk.type === 'dialogue') return `${tk.person}:${tk.text}`;
      if (tk.type === 'pause') return `(停顿 ${tk.pauseDur}s)`;
      return tk.text;
    }).join('\n');
    copyToClipboard(lines, seg.index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
            <Film className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('input')}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-mono text-sm sm:text-base resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={t('input')}
              />
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-4">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono leading-relaxed">
                {t('hintTip')}
              </pre>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rate')}
              </label>
              <div className="flex flex-wrap gap-2">
                {RATE_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => handleRatePreset(preset.key, preset.value)}
                    className={`px-3 sm:px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      ratePreset === preset.key
                        ? 'bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-500/25'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {t(preset.label)}
                  </button>
                ))}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('custom')}</span>
                  <input
                    type="number"
                    min={1}
                    value={rate}
                    onChange={(e) => handleCustomRate(parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('segMode')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SEG_MODES.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setSegMode(mode.key)}
                    className={`px-3 py-3 rounded-xl border text-sm font-medium transition-colors ${
                      segMode === mode.key
                        ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/25'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {t(mode.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('chars')}</div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{totalChars.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('duration')}</div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{totalDur.toFixed(1)}s</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-3 h-3 rounded-sm bg-gray-800 dark:bg-gray-200 inline-block"></span>
                  {t('legendNar')}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                  {t('legendDia')}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-3 h-3 rounded-sm bg-gray-400 dark:bg-gray-500 inline-block"></span>
                  {t('legendPause')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium shadow-lg shadow-purple-500/25">
                <Scissors className="h-4 w-4" />
                {t('autoSegment')}
              </div>
            </div>
          </div>
        </div>

        {segments.length > 0 && (
          <div className="space-y-4 mb-6">
            {segments.map((seg) => (
              <div
                key={seg.index}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-semibold">
                      {t('parts', { n: seg.index })}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {t('startEnd', { s: seg.start.toFixed(1), e: seg.end.toFixed(1) })}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                      {t('chars')}: <span className="font-semibold text-gray-900 dark:text-gray-100">{seg.totalChars}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                      {t('duration')}: <span className="font-semibold text-gray-900 dark:text-gray-100">{seg.totalDur.toFixed(1)}s</span>
                    </span>
                    {seg.totalPause > 0 && (
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                        {t('cue')}: <span className="font-semibold text-gray-500 dark:text-gray-400">{seg.totalPause.toFixed(1)}s</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copySegment(seg)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm font-medium transition-colors"
                  >
                    {copiedSeg === seg.index ? (
                      <><Check className="h-3.5 w-3.5 text-green-500" /></>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /></>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  {seg.tokens.map((tk, idx) => {
                    if (tk.type === 'narration') {
                      return (
                        <div key={idx} className="flex items-start gap-2 py-1">
                          <span className="text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed flex-1">{tk.text}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap pt-0.5">{tk.chars}c {tk.dur.toFixed(1)}s</span>
                        </div>
                      );
                    }
                    if (tk.type === 'dialogue') {
                      return (
                        <div key={idx} className="flex items-start gap-2 py-1 pl-3 border-l-2 border-blue-400 dark:border-blue-500">
                          <span className="text-blue-600 dark:text-blue-400 text-sm sm:text-base font-semibold whitespace-nowrap">{tk.person}:</span>
                          <span className="text-blue-700 dark:text-blue-300 text-sm sm:text-base leading-relaxed flex-1">{tk.text}</span>
                          <span className="text-xs text-blue-400 dark:text-blue-500/70 font-mono whitespace-nowrap pt-0.5">{tk.chars}c {tk.dur.toFixed(1)}s</span>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="flex items-center gap-2 py-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-mono">
                          ⏸ {tk.pauseDur?.toFixed(1)}s
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{t('cue')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {segments.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => downloadFile(generateSRT(), 'script.srt', 'text/plain;charset=utf-8')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              {t('exportSrt')}
            </button>
            <button
              onClick={() => downloadFile(generateCues(), 'cues.txt', 'text/plain;charset=utf-8')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              {t('exportCue')}
            </button>
            <button
              onClick={() => copyToClipboard(getAllSegmentsText())}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 transition-colors text-sm font-medium"
            >
              {copied ? (
                <><Check className="h-4 w-4" /></>
              ) : (
                <><Copy className="h-4 w-4" /></>
              )}
              {t('copyAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
