'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Copy, Download, Sparkles, Type, RefreshCw } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    placeholder: '输入国家队名 / 球星名，如：阿根廷、Messi、巴西、姆巴佩…',
    subtitle: '生成足球风 ASCII 字符画 · 笔记结尾签名 · 评论区装饰图',
    densityLabel: '字符密度',
    densityLow: '精简（7行）',
    densityMid: '均衡（11行）',
    densityHigh: '细节（15行）',
    styleLabel: '字符集',
    styleFooty: '足球风 ⚽🏆',
    styleClassic: '经典 ASCII',
    styleBlock: '方块 █',
    styleDots: '点阵 ·',
    styleStars: '星光 ★☆',
    resultTitle: '字符画结果（一键复制/下载TXT）',
    copyBtn: '复制字符画',
    downloadBtn: '下载 .txt',
    copied: '已复制 ✓',
    emptyTip: '输入文字，立即生成足球风ASCII字符画',
    sampleTip: '提示：英文/拼音效果更均衡；中文自动转拼音后渲染；下载后粘贴到记事本可对齐',
    presetTip: '试试这些快捷：',
  },
  en: {
    placeholder: 'Enter team / player name, e.g. Argentina, Messi, Brazil, Mbappé…',
    subtitle: 'Football ASCII art — note signature · comment decoration · bio banner',
    densityLabel: 'Density',
    densityLow: 'Light (7 rows)',
    densityMid: 'Balanced (11 rows)',
    densityHigh: 'Detailed (15 rows)',
    styleLabel: 'Charset',
    styleFooty: 'Footy ⚽🏆',
    styleClassic: 'Classic ASCII',
    styleBlock: 'Block █',
    styleDots: 'Dots ·',
    styleStars: 'Stars ★☆',
    resultTitle: 'ASCII result (copy / download .txt)',
    copyBtn: 'Copy',
    downloadBtn: 'Download .txt',
    copied: 'Copied ✓',
    emptyTip: 'Enter text to generate football ASCII art',
    sampleTip: 'Tip: English letters render most balanced. Download & paste into Notepad for perfect alignment.',
    presetTip: 'Try presets:',
  },
  fr: {
    placeholder: 'Nom équipe / joueur : Argentine, Messi, Brésil, Mbappé…',
    subtitle: 'ASCII art foot — signature de note · déco commentaire · bio',
    densityLabel: 'Densité',
    densityLow: 'Léger (7 l.)',
    densityMid: 'Équilibré (11 l.)',
    densityHigh: 'Détaillé (15 l.)',
    styleLabel: 'Jeu de caractères',
    styleFooty: 'Foot ⚽🏆',
    styleClassic: 'ASCII classique',
    styleBlock: 'Bloc █',
    styleDots: 'Points ·',
    styleStars: 'Étoiles ★☆',
    resultTitle: 'Résultat ASCII (copier / .txt)',
    copyBtn: 'Copier',
    downloadBtn: 'Télécharger',
    copied: 'Copié ✓',
    emptyTip: 'Saisissez du texte',
    sampleTip: 'Les lettres anglaises s\'affichent le mieux. Téléchargez puis collez dans le Bloc-notes.',
    presetTip: 'Essayer :',
  },
  es: {
    placeholder: 'Equipo / jugador: Argentina, Messi, Brasil, Mbappé…',
    subtitle: 'Arte ASCII futbolístico — firmas · comentarios · banner',
    densityLabel: 'Densidad',
    densityLow: 'Ligero (7 f.)',
    densityMid: 'Equilibrado (11 f.)',
    densityHigh: 'Detallado (15 f.)',
    styleLabel: 'Juego caracteres',
    styleFooty: 'Fútbol ⚽🏆',
    styleClassic: 'ASCII clásico',
    styleBlock: 'Bloque █',
    styleDots: 'Puntos ·',
    styleStars: 'Estrellas ★☆',
    resultTitle: 'Resultado ASCII (copiar / .txt)',
    copyBtn: 'Copiar',
    downloadBtn: 'Descargar',
    copied: 'Copiado ✓',
    emptyTip: 'Escribe texto',
    sampleTip: 'Las letras en inglés se ven mejor. Descárgalo y pégalo en Bloc de notas.',
    presetTip: 'Probar:',
  },
  hi: {
    placeholder: 'टीम / खिलाड़ी का नाम: Argentina, Messi, Brazil, Mbappé…',
    subtitle: 'फुटबॉल ASCII आर्ट — नोट हस्ताक्षर · कमेंट सजावट',
    densityLabel: 'घनत्व',
    densityLow: 'हल्का (7 पंक्तियाँ)',
    densityMid: 'संतुलित (11 पंक्तियाँ)',
    densityHigh: 'विस्तृत (15 पंक्तियाँ)',
    styleLabel: 'अक्षर सेट',
    styleFooty: 'फुटबॉल ⚽🏆',
    styleClassic: 'क्लासिक ASCII',
    styleBlock: 'ब्लॉक █',
    styleDots: 'डॉट्स ·',
    styleStars: 'स्टार्स ★☆',
    resultTitle: 'ASCII परिणाम (कॉपी / डाउनलोड)',
    copyBtn: 'कॉपी',
    downloadBtn: 'डाउनलोड',
    copied: 'कॉपी हो गया ✓',
    emptyTip: 'टेक्स्ट डालें',
    sampleTip: 'अंग्रेज़ी अक्षर सबसे बेहतर दिखेंगे।',
    presetTip: 'प्रीसेट आज़माएँ:',
  },
  ar: {
    placeholder: 'اسم الفريق / اللاعب: Argentina, Messi, Brazil, Mbappé…',
    subtitle: 'فن ASCII كرة القدم — توقيع · تعليق · بايو',
    densityLabel: 'الكثافة',
    densityLow: 'خفيف (7 صفوف)',
    densityMid: 'متوازن (11 صفوف)',
    densityHigh: 'مفصل (15 صفوف)',
    styleLabel: 'مجموعة الأحرف',
    styleFooty: 'كرة القدم ⚽🏆',
    styleClassic: 'ASCII كلاسيكي',
    styleBlock: 'بلوك █',
    styleDots: 'نقاط ·',
    styleStars: 'نجوم ★☆',
    resultTitle: 'النتيجة (نسخ / تحميل)',
    copyBtn: 'نسخ',
    downloadBtn: 'تحميل',
    copied: 'تم النسخ ✓',
    emptyTip: 'أدخل نصاً',
    sampleTip: 'الحروف الإنجليزية أفضل تميل لعرض أفضل. قم بالتحميل واللصق في المفكرة.',
    presetTip: 'جرب هذه:',
  },
};

const PRESETS = [
  { label: 'Messi', value: 'MESSI' },
  { label: 'ARG', value: 'ARGENTINA' },
  { label: 'CR7', value: 'RONALDO' },
  { label: 'BRA', value: 'BRASIL' },
  { label: '⚽', value: 'GOAT GOAT' },
];

const STYLES: Array<{ key: string; chars: string[] }> = [
  { key: 'footy', chars: [' ', '.', 'o', 'O', '*', '#', '@', '8'] },
  { key: 'classic', chars: [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'] },
  { key: 'block', chars: [' ', '░', '▒', '▓', '█', '█', '█', '█'] },
  { key: 'dots', chars: [' ', '.', '•', '●', '◉', '●', '●', '●'] },
  { key: 'stars', chars: [' ', '✦', '✧', '★', '☆', '✶', '✷', '✸'] },
];

const PIXEL_FONT: Record<string, number[][]> = (() => {
  const raw: Record<string, string[]> = {
    A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
    D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
    G: ['01111', '10000', '10000', '10011', '10001', '10001', '01111'],
    H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
    J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
    K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
    L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
    N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
    R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
    V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
    W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
    X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
    Y: ['10001', '10001', '10001', '01010', '00100', '00100', '00100'],
    Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
    '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
    '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
    '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
    '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
    '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
    '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
    '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
    '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
    '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
    '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
    ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
    '-': ['00000', '00000', '00000', '01110', '00000', '00000', '00000'],
    "'": ['00100', '00100', '00000', '00000', '00000', '00000', '00000'],
    '.': ['00000', '00000', '00000', '00000', '00000', '00000', '00100'],
    '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
    '?': ['01110', '10001', '00001', '00010', '00100', '00000', '00100'],
    '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  };
  const out: Record<string, number[][]> = {};
  for (const k in raw) out[k] = raw[k].map((row) => row.split('').map((c) => parseInt(c, 10)));
  return out;
})();

const PINYIN_PAIRS: [string, string][] = [
  ['阿','A'],['根','GEN'],['廷','TING'],['美','MEI'],['西','XI'],['巴','BA'],['法','FA'],['国','GUO'],['英','YING'],['德','DE'],
  ['巴','BA'],['西','XI'],['意','YI'],['大','DA'],['利','LI'],['牙','YA'],['班','BAN'],['葡','PU'],['萄','TAO'],['荷','HE'],['兰','LAN'],
  ['日','RI'],['本','BEN'],['韩','HAN'],['哥','GE'],['墨','MO'],['加','JIA'],['拿','NA'],['克','KE'],['隆','LONG'],['哥','GE'],['伦','LUN'],
  ['比','BI'],['时','SHI'],['瑞','RUI'],['典','DIAN'],['乌','WU'],['拉','LA'],['圭','GUI'],['智','ZHI'],['秘','MI'],['鲁','LU'],['乌','WU'],
  ['拉','LA'],['圭','GUI'],['智','ZHI'],['秘','MI'],['鲁','LU'],['智','ZHI'],['澳','AO'],['塞','SAI'],['尔','ER'],['维','WEI'],['亚','YA'],
  ['内','NEI'],['日','RI'],['加','JIA'],['拿','NA'],['大','DA'],['哥','GE'],['斯','SI'],['达','DA'],['黎','LI'],['马','MA'],['洛','LUO'],
  ['摩','MO'],['洛','LUO'],['哥','GE'],['突','TU'],['尼','NI'],['斯','SI'],['阿','A'],['尔','ER'],['及','JI'],['利','LI'],['比','BI'],
  ['沙','SHA'],['特','TE'],['阿','A'],['拉','LA'],['伯','BO'],['卡','KA'],['塔','TA'],['尔','ER'],['卡','KA'],['塔','TA'],['阿','A'],
  ['曼','MAN'],['厄','E'],['瓜','GUA'],['多','DUO'],['尔','ER'],['加','JIA'],['纳','NA'],['塞','SAI'],['内','NEI'],['加','JIA'],['尔','ER'],
  ['塞','SAI'],['内','NEI'],['加','JIA'],['尔','ER'],['塞内加尔','SENEGAL'],['加','JIA'],['纳','NA'],['蓬','PENG'],['达','DA'],
  ['卢','LU'],['旺','WANG'],['达','DA'],['斯','SI'],['伊','YI'],['朗','LANG'],['阿','A'],['富','FU'],['汗','HAN'],['越','YUE'],
  ['南','NAN'],['韩','HAN'],['朝','CHAO'],['鲜','XIAN'],['印','YIN'],['度','DU'],['新','XIN'],['加','JIA'],['坡','PO'],['马','MA'],
  ['来','LAI'],['西','XI'],['亚','YA'],['泰','TAI'],['国','GUO'],['越','YUE'],['南','NAN'],['菲','FEI'],['律','LV'],['宾','BIN'],
  ['印','YIN'],['尼','NI'],['澳','AO'],['尼','NI'],['亚','YA'],['新','XIN'],['西','XI'],['兰','LAN'],['阿','A'],['曼','MAN'],
  ['埃','AI'],['塞','SAI'],['俄','E'],['乌','WU'],['克','KE'],['兰','LAN'],['芬','FEN'],['波','BO'],['黑','HEI'],['山','SHAN'],
  ['塞','SAI'],['尔','ER'],['维','WEI'],['亚','YA'],['斯','SI'],['洛','LUO'],['伐','FA'],['克','KE'],['阿','A'],['尔','ER'],
  ['巴','BA'],['拿','NA'],['马','MA'],['斯','SI'],['里','LI'],['尼','NI'],['亚','YA'],['土','TU'],['耳','ER'],['其','QI'],
  ['希','XI'],['腊','LA'],['希','XI'],['腊','LA'],['希','XI'],['腊','LA'],['希','XI'],['腊','LA'],['希','XI'],['腊','LA'],
  ['葡','PU'],['萄','TAO'],['牙','YA'],['西','XI'],['班','BAN'],['牙','YA'],['德','DE'],['国','GUO'],['法','FA'],['国','GUO'],
  ['荷','HE'],['兰','LAN'],['比','BI'],['利','LI'],['时','SHI'],['瑞','RUI'],['士','SHI'],['奥','AO'],['地','DI'],['利','LI'],
];
const PINYIN_TABLE: Record<string, string> = PINYIN_PAIRS.reduce((acc, [k, v]) => {
  if (!(k in acc)) acc[k] = v;
  return acc;
}, {} as Record<string, string>);

function toAsciiSlug(input: string): string {
  let out = '';
  for (const ch of input) {
    if (/[A-Za-z0-9 \-'.!?/]/.test(ch)) out += ch.toUpperCase();
    else if (PINYIN_TABLE[ch]) out += PINYIN_TABLE[ch];
    else {
      const cp = ch.codePointAt(0) ?? 0;
      if (cp < 128) out += ch.toUpperCase();
    }
  }
  return out.trim() || 'GOAT';
}

interface Props {
  locale?: Locale;
}

const WcAsciiArt: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const [text, setText] = useState<string>(locale === 'zh' ? 'MESSI 10' : 'MESSI 10');
  const [density, setDensity] = useState<'7' | '11' | '15'>('11');
  const [style, setStyle] = useState<'footy' | 'classic' | 'block' | 'dots' | 'stars'>('footy');
  const [copied, setCopied] = useState(false);
  const [frameTick, setFrameTick] = useState(0);

  useEffect(() => { if (!copied) return; const tm = setTimeout(() => setCopied(false), 1500); return () => clearTimeout(tm); }, [copied]);

  const ascii = useMemo(() => {
    const slug = toAsciiSlug(text);
    if (!slug) return '';
    const rowsBase = 7;
    const targetRows = parseInt(density, 10);
    const horizScale = Math.max(1, Math.floor(targetRows / rowsBase));
    const vertScale = horizScale;
    const chars = (STYLES.find((s) => s.key === style) ?? STYLES[0]).chars;
    const len = chars.length;
    const output: string[] = [];
    for (let row = 0; row < rowsBase; row++) {
      const segments: string[] = [];
      for (const ch of slug) {
        const glyph = PIXEL_FONT[ch] ?? PIXEL_FONT['?'] ?? PIXEL_FONT[' '];
        const line = glyph[row] ?? [0,0,0,0,0];
        for (let x = 0; x < line.length; x++) {
          const bit = line[x];
          const idx = Math.min(len - 1, Math.floor(bit * (len - 1)));
          segments.push(chars[idx]);
        }
        segments.push('  ');
      }
      let lineStr = segments.join('');
      for (let vs = 0; vs < vertScale; vs++) {
        const expanded = lineStr.split('').map((c) => c.repeat(Math.max(1, horizScale * 2))).join('');
        output.push(expanded);
      }
    }
    const border = '═'.repeat(Math.max(10, output[0]?.length ?? 20));
    const withFrame: string[] = [];
    withFrame.push(`╔${border}╗`);
    withFrame.push(`║  ⚽ ${slug.slice(0, Math.max(1, border.length - 12)).padEnd(border.length - 8)}  ║`);
    withFrame.push(`╠${'═'.repeat(border.length)}╣`);
    for (const ln of output) withFrame.push(`║ ${ln.padEnd(border.length - 2).slice(0, border.length - 2)} ║`);
    withFrame.push(`╚${border}╝`);
    withFrame.push(`   🏆 World Cup 2026 美加墨 • Fan ASCII Art  🏆`);
    return withFrame.join('\n');
  }, [text, density, style, frameTick]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(ascii); setCopied(true); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = ascii; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); setCopied(true);
    }
  };
  const handleDownload = () => {
    const blob = new Blob([ascii], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wc-ascii-${( toAsciiSlug(text).slice(0, 12) || 'art')}.txt`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="card-base p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Type className="w-5 h-5 text-[color:var(--color-primary)]" />
          <h1 className="text-[18px] font-bold">{locale === 'zh' ? '球员国旗字符画生成器' : 'Football ASCII Art'}</h1>
        </div>
        <p className="text-[13px] text-[color:var(--color-text-secondary)] mb-4">{t.subtitle}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          className="input-base w-full !min-h-[88px] resize-y text-[14px] font-mono"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        />
        <div className="mt-3 text-[12px] text-[color:var(--color-text-secondary)] mb-3">{t.sampleTip}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-[12px] font-medium text-[color:var(--color-text-secondary)] mb-2">{t.styleLabel}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStyle(s.key as 'footy' | 'classic' | 'block' | 'dots' | 'stars')}
                  className={`!h-11 px-3 text-[13px] rounded-[var(--radius-md)] border touch-manipulation ${style === s.key ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white' : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]'}`}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
                >
                  {t[`style${s.key.charAt(0).toUpperCase()}${s.key.slice(1)}` as keyof typeof t] as string ?? s.key}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-medium text-[color:var(--color-text-secondary)] mb-2">{t.densityLabel}</div>
            <div className="grid grid-cols-3 gap-2">
              {(['7','11','15'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d as any)}
                  className={`!h-11 text-[13px] rounded-[var(--radius-md)] border touch-manipulation ${density === d ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white' : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]'}`}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
                >
                  {t[`density${d === '7' ? 'Low' : d === '11' ? 'Mid' : 'High'}` as keyof typeof t] as string ?? d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[12px] text-[color:var(--color-text-secondary)] mb-2">{t.presetTip}</div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setText(p.value)}
                className="!h-9 px-3 text-[12px] rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-tertiary)] touch-manipulation"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 36 }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFrameTick((f) => f + 1)}
              className="!h-9 px-3 text-[12px] rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] hover:border-[color:var(--color-primary)] inline-flex items-center gap-1 touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 36 }}
            >
              <RefreshCw className="w-3 h-3" />
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="card-base p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-[15px] font-semibold">{t.resultTitle}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-primary !h-10 !px-4 inline-flex items-center gap-2 touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t.copied : t.copyBtn}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="!h-10 !px-4 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] inline-flex items-center gap-2 text-[14px] touch-manipulation"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
            >
              <Download className="w-4 h-4" />
              {t.downloadBtn}
            </button>
          </div>
        </div>
        <pre className="w-full overflow-auto max-h-[520px] p-4 rounded-[var(--radius-lg)] bg-[#0b1020] text-[#d9e6ff] border border-[color:var(--color-border)] font-mono text-[11px] sm:text-[12px] md:text-[13px] leading-[1.15]" style={{ whiteSpace: 'pre' }}>{ascii || t.emptyTip}</pre>
      </div>
    </div>
  );
};

import { Check } from 'lucide-react';
export default WcAsciiArt;
