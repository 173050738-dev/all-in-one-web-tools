'use client';

import { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  ArrowLeftRight,
  BarChart3,
  Shrink,
  RotateCcw,
} from 'lucide-react';

interface CopyCleanerProps {
  locale?: string;
}

type Level = 'light' | 'mid' | 'strong';
type Mode = 'diff' | 'stats';
type TokenType = 'core' | 'repeat' | 'filler' | 'golden';

interface Token {
  text: string;
  type: TokenType;
}

interface SentenceInfo {
  original: string;
  separator: string;
  normalized: string;
  isRepeat: boolean;
  isGolden: boolean;
  isGoldenDedup: boolean;
  fillerRanges: [number, number][];
  tokens: Token[];
  cleaned: string;
  removed: boolean;
}

const i18n = {
  zh: {
    title: '文案灌水冗余清洗器',
    subtitle: '色块标注+一键精简，核心信息保留',
    input: '粘贴待洗稿文案',
    level: '清洗强度',
    light: '轻度清洗（只删重复）',
    mid: '中等清洗（删重复+空洞词）',
    strong: '深度清洗（保留核心句）',
    original: '原文',
    cleaned: '精简后',
    removedCount: '已删除 {n} 字，压缩率 {p}%',
    legendRepeat: '重复/铺垫',
    legendFiller: '无意义形容词/凑词',
    legendGolden: '重复金句（只留1次）',
    legendCore: '核心信息',
    compress: '一键精简 ↓',
    accept: '应用精简结果',
    diffMode: '并排对比模式',
    statsMode: '统计列表模式',
    stats: '冗余统计明细',
    repeatLines: '重复句子 {n} 条',
    fillerWords: '空洞词 {n} 处',
    goldenDedup: '金句去重 {n} 条',
    keepCore: '保留核心 {n} 字',
    copyCleaned: '复制精简版',
    exportBeforeAfter: '导出 原文+精简.txt',
    placeHolder: '今天给大家分享，今天给大家推荐，非常非常特别特别好看好用的一款产品，真的真的超级超级喜欢，强烈强烈推荐，这款产品呢可以说是，不买绝对会后悔系列，不买你就吃大亏了，我相信每一个姐妹都会爱上它的...',
  },
  en: {
    title: 'Copy Redundancy Cleaner',
    subtitle: 'Color-mark + one-click compress',
    input: 'Paste copy to clean',
    level: 'Strength',
    light: 'Light (remove dups)',
    mid: 'Medium (dups + fillers)',
    strong: 'Deep (core only)',
    original: 'Original',
    cleaned: 'Cleaned',
    removedCount: 'Removed {n} chars, saved {p}%',
    legendRepeat: 'Repetitive/Intro',
    legendFiller: 'Filler adjectives',
    legendGolden: 'Repeated lines',
    legendCore: 'Core info',
    compress: 'Compress ↓',
    accept: 'Apply cleaned',
    diffMode: 'Side-by-side',
    statsMode: 'Stats list',
    stats: 'Stats',
    repeatLines: 'Duplicate sentences {n}',
    fillerWords: 'Fillers {n}',
    goldenDedup: 'Repeated slogans {n}',
    keepCore: 'Kept {n} chars',
    copyCleaned: 'Copy cleaned',
    exportBeforeAfter: 'Export before+after.txt',
    placeHolder: "Today I'd really really like to share with you, a very very special product, super super like, highly highly recommend, this product is...",
  },
  hi: {
    title: 'कॉपी क्लीनर',
    subtitle: 'रंगीन मार्क+एक क्लिक कम्प्रेस',
    input: 'कॉपी पेस्ट करें',
    level: 'ताकत',
    light: 'हल्का',
    mid: 'मध्यम',
    strong: 'गहरा',
    original: 'असली',
    cleaned: 'साफ़',
    removedCount: '{n} अक्षर हटाए, बचाया {p}%',
    legendRepeat: 'दोहराव',
    legendFiller: 'भराई शब्द',
    legendGolden: 'दोहराए नारे',
    legendCore: 'मुख्य',
    compress: 'कम्प्रेस ↓',
    accept: 'लागू करें',
    diffMode: 'साइड-बाय-साइड',
    statsMode: 'स्टैट्स',
    stats: 'आँकड़े',
    repeatLines: 'डुप्लिकेट वाक्य {n}',
    fillerWords: 'भराई {n}',
    goldenDedup: 'दोहरे स्लोगन {n}',
    keepCore: '{n} अक्षर रखा',
    copyCleaned: 'साफ़ कॉपी',
    exportBeforeAfter: 'निर्यात पहले+बाद',
    placeHolder: 'आज मैं आपके साथ एक बहुत बहुत खास उत्साह के साथ साझा करना चाहता हूँ, बहुत बहुत पसंदीदा उत्पाद...',
  },
  fr: {
    title: 'Nettoyeur Redondance',
    subtitle: 'Surbrillance + compression 1 clic',
    input: 'Collez le texte',
    level: 'Force',
    light: 'Léger',
    mid: 'Moyen',
    strong: 'Profond',
    original: 'Original',
    cleaned: 'Nettoyé',
    removedCount: 'Retiré {n} car., gagné {p}%',
    legendRepeat: 'Répétitions',
    legendFiller: 'Remplissages',
    legendGolden: 'Slogans répétés',
    legendCore: 'Principal',
    compress: 'Compresser ↓',
    accept: 'Appliquer',
    diffMode: 'Côte à côte',
    statsMode: 'Statist.',
    stats: 'Stats',
    repeatLines: 'Doublons {n}',
    fillerWords: 'Remplissages {n}',
    goldenDedup: 'Slogans {n}',
    keepCore: 'Conservé {n} car.',
    copyCleaned: 'Copier nettoyé',
    exportBeforeAfter: 'Exporter avant+après',
    placeHolder: "Aujourd'hui je veux vraiment vraiment partager un produit très très très spécial, super super aimé...",
  },
  es: {
    title: 'Limpiador de Redundancia',
    subtitle: 'Marcado color + compresión 1 clic',
    input: 'Pegar el texto',
    level: 'Fuerza',
    light: 'Ligero',
    mid: 'Medio',
    strong: 'Profundo',
    original: 'Original',
    cleaned: 'Limpiado',
    removedCount: 'Eliminados {n} car., ahorrado {p}%',
    legendRepeat: 'Repeticiones',
    legendFiller: 'Rellenos',
    legendGolden: 'Lemas repetidos',
    legendCore: 'Principal',
    compress: 'Comprimir ↓',
    accept: 'Aplicar',
    diffMode: 'Uno al lado',
    statsMode: 'Estad.',
    stats: 'Estadísticas',
    repeatLines: 'Duplicados {n}',
    fillerWords: 'Rellenos {n}',
    goldenDedup: 'Lemas {n}',
    keepCore: 'Guardados {n} car.',
    copyCleaned: 'Copiar limpio',
    exportBeforeAfter: 'Exportar antes+después',
    placeHolder: 'Hoy quiero muy mucho compartir un producto muy muy muy especial, super super recomendado...',
  },
  ar: {
    title: 'منظف الفائض النص',
    subtitle: 'تمييز ملون + ضغط بنقرة',
    input: 'الصق النص',
    level: 'القوة',
    light: 'خفيف',
    mid: 'متوسط',
    strong: 'عميق',
    original: 'الأصلي',
    cleaned: 'المُنظّف',
    removedCount: 'تم حذف {n} حرف، وفّر {p}%',
    legendRepeat: 'التكرارات',
    legendFiller: 'كلمات زائدة',
    legendGolden: 'شعارات متكررة',
    legendCore: 'الأساسي',
    compress: 'ضغط ↓',
    accept: 'تطبيق',
    diffMode: 'جنباً إلى جنب',
    statsMode: 'إحصائيات',
    stats: 'الإحصائيات',
    repeatLines: 'جمل مكررة {n}',
    fillerWords: 'زائدات {n}',
    goldenDedup: 'شعارات مكررة {n}',
    keepCore: 'محفوظ {n} حرف',
    copyCleaned: 'نسخ المنظّف',
    exportBeforeAfter: 'تصدير قبل+بعد',
    placeHolder: 'اليوم أريد حقاً حقاً أن أشارك معكم منتجاً جداً جداً خاصاً، أحبه جداً جداً أوصي به بشدة...',
  },
};

const fillerWordsZH = [
  '非常非常非常', '真的真的真的', '强烈强烈推荐', '特别特别', '非常非常', '超级超级', '强烈强烈', '真的真的',
  '家人们谁懂啊', '我不允许还有人不知道', '今天给大家分享', '今天给大家推荐', '姐妹们兄弟们',
  '有一说一', '该说不说', '话不多说', '先上结论', '讲真', '说实话', '老实说', '平心而论', '客观来讲',
  '可以这么说', '可以说是', '毫不夸张', '毫不夸张地说', '真的是绝绝子', 'yyds绝绝子', '好看到爆', '美到爆炸',
  '狠狠', '力荐力荐', '疯狂疯狂', '巨巨', '贼老', '忒', '挺', '蛮', '算是', '可以说', '就是', '总之呢',
  '那么', '这个呢', '然后呢', '就是说', '还是', '真的很', '可以说是', '我认为', '我觉得', '个人觉得',
  '大概', '大致', '基本上', '实际上', '其实', '真的是', '极其', '十分', '超级', '真的', '特别', '非常',
  '这一点', '那个', '这种', '那种', '其实呢', '然后呢', '就是说', '那么呢', '所以说',
];

const fillerWordsEN = [
  'very very very', 'really really really', 'very very', 'really really', 'super super', 'basically', 'actually',
  'to be honest', 'honestly', 'in my opinion', 'I think', 'I feel', 'kind of', 'sort of',
  'you know', 'let me just', 'so yeah', 'and all that', 'literally literally',
];

export default function CopyCleaner({ locale = 'zh' }: CopyCleanerProps) {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [level, setLevel] = useState<Level>('mid');
  const [mode, setMode] = useState<Mode>('diff');
  const [processed, setProcessed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentences, setSentences] = useState<SentenceInfo[]>([]);

  const t = (key: keyof typeof i18n.zh, vars?: Record<string, string | number>) => {
    const dict = (i18n as Record<string, Record<string, string>>)[locale] || i18n.zh;
    let str = dict[key] ?? (i18n.zh as Record<string, string>)[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  const fillerWords = locale === 'zh' ? fillerWordsZH : fillerWordsEN;

  const normalizeSentence = (s: string): string => {
    return s.trim().replace(/[\s，。！？!?；;,.，。、：:（）()""''「」『』【】\[\]《》<>/\\\-—…·]/g, '').toLowerCase();
  };

  const splitSentences = (text: string): { text: string; sep: string }[] => {
    const result: { text: string; sep: string }[] = [];
    const regex = /([。！？!?；;\n]+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const sentenceText = text.slice(lastIndex, match.index);
      result.push({ text: sentenceText, sep: match[0] });
      lastIndex = regex.lastIndex;
    }
    const remaining = text.slice(lastIndex);
    if (remaining.length > 0) {
      result.push({ text: remaining, sep: '' });
    }
    return result;
  };

  const findFillerRanges = (text: string): [number, number][] => {
    const ranges: [number, number][] = [];
    let lowerText = text;
    fillerWords.forEach((word) => {
      let idx = 0;
      while ((idx = lowerText.indexOf(word, idx)) !== -1) {
        ranges.push([idx, idx + word.length]);
        idx += word.length;
      }
    });
    ranges.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const r of ranges) {
      if (merged.length === 0 || r[0] >= merged[merged.length - 1][1]) {
        merged.push(r);
      } else {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
      }
    }
    return merged;
  };

  const buildTokens = (text: string, ranges: [number, number][], isRepeat: boolean, isGoldenDedup: boolean): Token[] => {
    const tokens: Token[] = [];
    if (ranges.length === 0) {
      tokens.push({
        text,
        type: isGoldenDedup ? 'golden' : isRepeat ? 'repeat' : 'core',
      });
      return tokens;
    }
    let cursor = 0;
    for (const [start, end] of ranges) {
      if (start > cursor) {
        const baseType = isGoldenDedup ? 'golden' : isRepeat ? 'repeat' : 'core';
        tokens.push({ text: text.slice(cursor, start), type: baseType });
      }
      tokens.push({ text: text.slice(start, end), type: 'filler' });
      cursor = end;
    }
    if (cursor < text.length) {
      const baseType = isGoldenDedup ? 'golden' : isRepeat ? 'repeat' : 'core';
      tokens.push({ text: text.slice(cursor), type: baseType });
    }
    return tokens;
  };

  const removeFillersFromString = (text: string): string => {
    let result = text;
    const sortedFillers = [...fillerWords].sort((a, b) => b.length - a.length);
    for (const word of sortedFillers) {
      while (result.indexOf(word) !== -1) {
        result = result.split(word).join('');
      }
    }
    result = result.replace(/[ \t]{2,}/g, ' ').trim();
    return result;
  };

  const mergeRedundantAdverbs = (text: string): string => {
    if (locale !== 'zh') return text;
    let result = text;
    const patterns = [
      /(.)\1{2,}/g,
    ];
    for (const p of patterns) {
      result = result.replace(p, '$1');
    }
    return result;
  };

  const hasMeaningfulContent = (text: string): boolean => {
    if (text.length >= 4) return true;
    if (/\d/.test(text)) return true;
    const nounPatterns = /[的了是在和与及或但却并而则也都就又还再已被把让使让叫称说看听读写学做工打跑跳走坐站睡吃喝买买卖卖去来回出入上下左右前后东西南北春夏秋冬年月日时分秒元角分个只条件把台辆艘架层次回合场顿杯瓶袋箱包桶盘碗勺筷刀叉针线布衣裙鞋帽袜书本纸笔字句段篇章节目部首封页期届次档位路号线条款项则例规法律条框架项科目项]/;
    return nounPatterns.test(text);
  };

  const process = () => {
    if (!inputText.trim()) {
      setSentences([]);
      setCleanedText('');
      setProcessed(false);
      return;
    }
    const parts = splitSentences(inputText);
    const seenNormals = new Map<string, number>();
    const goldenSeen = new Set<string>();
    const result: SentenceInfo[] = [];
    let repeatCount = 0;
    let fillerCount = 0;
    let goldenCount = 0;
    let keptChars = 0;
    parts.forEach(({ text: sText, sep }) => {
      const normalized = normalizeSentence(sText);
      if (!normalized) {
        result.push({
          original: sText,
          separator: sep,
          normalized: '',
          isRepeat: false,
          isGolden: false,
          isGoldenDedup: false,
          fillerRanges: [],
          tokens: [{ text: sText, type: 'core' }],
          cleaned: sText,
          removed: false,
        });
        return;
      }
      const prevCount = seenNormals.get(normalized) || 0;
      seenNormals.set(normalized, prevCount + 1);
      const isRepeat = prevCount > 0 && level >= 'light';
      const isGolden = normalized.length >= 10 && prevCount > 0;
      const isGoldenDedup = isGolden && goldenSeen.has(normalized) && level >= 'mid';
      if (isGolden) goldenSeen.add(normalized);
      const fillerRanges = level >= 'mid' ? findFillerRanges(sText) : [];
      fillerCount += fillerRanges.length;
      if (isRepeat) repeatCount++;
      if (isGoldenDedup) goldenCount++;
      const tokens = buildTokens(sText, fillerRanges, isRepeat, isGoldenDedup);
      let cleaned = sText;
      let removed = false;
      if (level >= 'mid') {
        cleaned = removeFillersFromString(cleaned);
      }
      cleaned = mergeRedundantAdverbs(cleaned);
      if (level === 'strong') {
        if (!hasMeaningfulContent(cleaned) && cleaned.length < 4) {
          removed = true;
        }
      }
      if (isGoldenDedup) removed = true;
      if (isRepeat && level === 'strong') removed = true;
      if (!removed) {
        keptChars += cleaned.length;
      }
      result.push({
        original: sText,
        separator: sep,
        normalized,
        isRepeat,
        isGolden,
        isGoldenDedup,
        fillerRanges,
        tokens,
        cleaned,
        removed,
      });
    });
    setSentences(result);
    let cleanedOutput = '';
    result.forEach((s) => {
      if (!s.removed) {
        cleanedOutput += s.cleaned + s.separator;
      }
    });
    cleanedOutput = cleanedOutput.replace(/\n{3,}/g, '\n\n').trim();
    setCleanedText(cleanedOutput);
    setProcessed(true);
  };

  const originalLen = inputText.length;
  const cleanedLen = cleanedText.length;
  const removedCount = Math.max(0, originalLen - cleanedLen);
  const compressionPct = originalLen > 0 ? Math.round((removedCount / originalLen) * 100) : 0;

  const stats = useMemo(() => {
    let repeatLines = 0;
    let fillerCount = 0;
    let goldenCount = 0;
    sentences.forEach((s) => {
      if (s.isRepeat) repeatLines++;
      fillerCount += s.fillerRanges.length;
      if (s.isGoldenDedup) goldenCount++;
    });
    return { repeatLines, fillerCount, goldenCount, keptChars: cleanedLen };
  }, [sentences, cleanedLen]);

  const applyCleaned = () => {
    setInputText(cleanedText);
    setCleanedText('');
    setSentences([]);
    setProcessed(false);
  };

  const copyCleaned = async () => {
    if (!cleanedText) return;
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = cleanedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportBeforeAfter = () => {
    const content = `===== ORIGINAL / 原文 =====\n\n${inputText}\n\n===== CLEANED / 精简后 =====\n\n${cleanedText}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'before-after.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderToken = (token: Token, sIdx: number, tIdx: number) => {
    const clsMap: Record<TokenType, string> = {
      core: 'text-gray-900 dark:text-gray-100',
      repeat: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 rounded px-0.5',
      filler: 'bg-gray-200 text-gray-400 dark:bg-gray-700/60 dark:text-gray-500 line-through rounded px-0.5',
      golden: 'bg-gray-100 text-gray-400 dark:bg-gray-700/40 dark:text-gray-500 line-through rounded px-0.5',
    };
    return (
      <span key={`${sIdx}-${tIdx}`} className={clsMap[token.type]}>
        {token.text}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
            <Shrink className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('level')}</label>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {(['light', 'mid', 'strong'] as Level[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md font-medium transition-all ${
                    level === lv
                      ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {t(lv)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit mb-4">
            <button
              onClick={() => setMode('diff')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md font-medium transition-all ${
                mode === 'diff'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              {t('diffMode')}
            </button>
            <button
              onClick={() => setMode('stats')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md font-medium transition-all ${
                mode === 'stats'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              {t('statsMode')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('input')}</label>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setProcessed(false);
              }}
              placeholder={t('placeHolder')}
              rows={8}
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            onClick={process}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-lg btn-primary font-semibold text-base"
          >
            <Sparkles className="h-5 w-5" />
            {t('compress')}
          </button>
        </div>

        {processed && (
          <>
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {t('removedCount', { n: removedCount, p: compressionPct })}
                </div>
                <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                  {originalLen} → {cleanedLen}
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, compressionPct)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                {t('legendRepeat')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400 line-through" />
                {t('legendFiller')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 line-through" />
                {t('legendGolden')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {t('legendCore')}
              </span>
            </div>
          </>
        )}
      </div>

      {processed && mode === 'diff' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('original')}</h3>
            <div className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 min-h-[200px] max-h-[500px] overflow-auto text-sm leading-relaxed whitespace-pre-wrap break-words">
              {sentences.map((s, sIdx) => (
                <span key={sIdx}>
                  {s.removed ? (
                    <span className="opacity-40 line-through">
                      {s.tokens.map((tok, tIdx) => renderToken(tok, sIdx, tIdx))}
                    </span>
                  ) : (
                    s.tokens.map((tok, tIdx) => renderToken(tok, sIdx, tIdx))
                  )}
                  <span>{s.separator}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('cleaned')}</h3>
            <textarea
              value={cleanedText}
              onChange={(e) => setCleanedText(e.target.value)}
              rows={14}
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>
      )}

      {processed && mode === 'stats' && (
        <div className="card p-4 sm:p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-5">{t('stats')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/60 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-100 dark:border-orange-800/30">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {stats.repeatLines}
              </div>
              <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">
                {t('repeatLines', { n: stats.repeatLines })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-700/30 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                {stats.fillerCount}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('fillerWords', { n: stats.fillerCount })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-800/50 dark:to-slate-700/20 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 dark:text-slate-300 mb-1">
                {stats.goldenCount}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t('goldenDedup', { n: stats.goldenCount })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-100 dark:border-emerald-800/30">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {stats.keptChars}
              </div>
              <div className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                {t('keepCore', { n: stats.keptChars })}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-xs sm:text-sm">
            {sentences.filter(s => s.isRepeat || s.fillerRanges.length > 0 || s.isGoldenDedup).map((s, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {s.isRepeat && (
                    <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 font-medium">
                      {t('legendRepeat')}
                    </span>
                  )}
                  {s.fillerRanges.length > 0 && (
                    <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-medium">
                      {t('legendFiller')} ×{s.fillerRanges.length}
                    </span>
                  )}
                  {s.isGoldenDedup && (
                    <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-medium">
                      {t('legendGolden')}
                    </span>
                  )}
                </div>
                <div className="text-gray-700 dark:text-gray-300 line-clamp-2">
                  {s.original}{s.separator}
                </div>
              </div>
            ))}
            {sentences.filter(s => s.isRepeat || s.fillerRanges.length > 0 || s.isGoldenDedup).length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                ✨ 文案很干净，没有发现冗余
              </div>
            )}
          </div>
        </div>
      )}

      {processed && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={applyCleaned}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors font-medium text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            {t('accept')}
          </button>
          <button
            onClick={copyCleaned}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary font-medium text-sm"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? '✓' : t('copyCleaned')}
          </button>
          <button
            onClick={exportBeforeAfter}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            <Download className="h-4 w-4" />
            {t('exportBeforeAfter')}
          </button>
        </div>
      )}
    </div>
  );
}
