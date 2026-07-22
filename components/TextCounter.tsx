'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Copy, Check, FileText, Trash2, Download, Upload, Settings, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

interface TextCounterProps {
  locale?: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: { title:"字数统计", subtitle:"实时字符/单词/行/段落统计", input:"输入或粘贴文本", placeholder:"在此输入要统计的文本...", chars:"字符（含空格）", charsNoSpace:"字符（不含空格）", cjkChars:"中文汉字数", asciiWords:"英文单词数", lines:"行数", nonEmptyLines:"非空行", paragraphs:"段落数（空行分隔）", sentences:"句子数（.?! 。？！分隔）", bytes:"字节数（UTF-8）", avgWordLen:"平均词长（字符）", readTimeMin:"预计阅读时间(分钟，200字/分)", density:"字符频率 TOP 10", clear:"清空", copyStats:"复制统计结果", sample:"加载示例文本", importFile:"导入文件", exportText:"导出文本", exportStats:"导出统计", settings:"统计设置", includeSpaces:"包含空格", includePunctuation:"包含标点", wordSeparator:"单词分隔符", ignoreNumbers:"忽略数字", exportFormat:"导出格式", plainText:"纯文本", csv:"CSV", json:"JSON" },
  en: { title:"Text Counter", subtitle:"Real-time chars/words/lines/paragraphs", input:"Enter or paste text", placeholder:"Paste text to count...", chars:"Characters (with spaces)", charsNoSpace:"Characters (no spaces)", cjkChars:"Chinese characters", asciiWords:"English words", lines:"Lines", nonEmptyLines:"Non-empty lines", paragraphs:"Paragraphs (blank separated)", sentences:"Sentences", bytes:"Bytes (UTF-8)", avgWordLen:"Avg word length (chars)", readTimeMin:"Est. read time (min, 200wpm)", density:"Top 10 char frequency", clear:"Clear", copyStats:"Copy stats", sample:"Load sample", importFile:"Import file", exportText:"Export text", exportStats:"Export stats", settings:"Stats settings", includeSpaces:"Include spaces", includePunctuation:"Include punctuation", wordSeparator:"Word separator", ignoreNumbers:"Ignore numbers", exportFormat:"Export format", plainText:"Plain text", csv:"CSV", json:"JSON" },
  hi: { title:"टेक्स्ट काउंटर", subtitle:"रीयल-टाइम अक्षर/शब्द/लाइन/पैरा", input:"टेक्स्ट डालें", placeholder:"गिनने के लिए टेक्स्ट...", chars:"अक्षर (स्पेस सहित)", charsNoSpace:"अक्षर (स्पेस बिना)", cjkChars:"चीनी अक्षर", asciiWords:"अंग्रेजी शब्द", lines:"लाइनें", nonEmptyLines:"खाली नहीं लाइनें", paragraphs:"पैराग्राफ", sentences:"वाक्य", bytes:"बाइट्स", avgWordLen:"औसत शब्द लंबाई", readTimeMin:"पढ़ने का समय (मिनट)", density:"शीर्ष 10 अक्षर आवृत्ति", clear:"साफ़", copyStats:"कॉपी आँकड़े", sample:"सैंपल", importFile:"फ़ाइल आयात करें", exportText:"टेक्स्ट निर्यात करें", exportStats:"आँकड़े निर्यात करें", settings:"सेटिंग्स", includeSpaces:"स्पेस शामिल करें", includePunctuation:"विराम चिह्न शामिल करें", wordSeparator:"शब्द विभाजक", ignoreNumbers:"संख्याएँ अनदेखा करें", exportFormat:"निर्यात प्रारूप", plainText:"सादा पाठ", csv:"CSV", json:"JSON" },
  fr: { title:"Compteur de Texte", subtitle:"Caractères/mots/lignes/paragraphes", input:"Entrez le texte", placeholder:"Collez le texte...", chars:"Caractères (espaces)", charsNoSpace:"Caractères (sans)", cjkChars:"Car. chinois", asciiWords:"Mots anglais", lines:"Lignes", nonEmptyLines:"Lignes non vides", paragraphs:"Paragraphes", sentences:"Phrases", bytes:"Octets", avgWordLen:"Long. moyenne", readTimeMin:"Temps de lecture (min)", density:"Top 10 fréquence", clear:"Effacer", copyStats:"Copier stats", sample:"Exemple", importFile:"Importer fichier", exportText:"Exporter texte", exportStats:"Exporter stats", settings:"Paramètres", includeSpaces:"Inclure espaces", includePunctuation:"Inclure ponctuation", wordSeparator:"Séparateur de mots", ignoreNumbers:"Ignorer nombres", exportFormat:"Format export", plainText:"Texte brut", csv:"CSV", json:"JSON" },
  es: { title:"Contador de Texto", subtitle:"Caracteres/palabras/líneas/párrafos", input:"Introduzca texto", placeholder:"Pegue el texto...", chars:"Caracteres (con esp.)", charsNoSpace:"Caracteres (sin)", cjkChars:"Car. chinos", asciiWords:"Palabras inglés", lines:"Líneas", nonEmptyLines:"Líneas no vacías", paragraphs:"Párrafos", sentences:"Oraciones", bytes:"Bytes", avgWordLen:"Long. media", readTimeMin:"Tiempo lectura (min)", density:"Top 10 frecuencia", clear:"Limpiar", copyStats:"Copiar estadísticas", sample:"Ejemplo", importFile:"Importar archivo", exportText:"Exportar texto", exportStats:"Exportar stats", settings:"Configuración", includeSpaces:"Incluir espacios", includePunctuation:"Incluir puntuación", wordSeparator:"Separador de palabras", ignoreNumbers:"Ignorar números", exportFormat:"Formato export", plainText:"Texto plano", csv:"CSV", json:"JSON" },
  ar: { title:"عداد النص", subtitle:"أحرف/كلمات/أسطر/فقرات فورية", input:"أدخل النص", placeholder:"الصق النص هنا...", chars:"الأحرف (مع مسافات)", charsNoSpace:"الأحرف (بدون)", cjkChars:"أحرف صينية", asciiWords:"كلمات إنجليزية", lines:"الأسطر", nonEmptyLines:"أسطر غير فارغة", paragraphs:"الفقرات", sentences:"الجمل", bytes:"البايتات", avgWordLen:"متوسط طول الكلمة", readTimeMin:"وقت القراءة (دقيقة)", density:"أعلى 10 تكرارات للحرف", clear:"مسح", copyStats:"نسخ الإحصائيات", sample:"مثال", importFile:"استيراد ملف", exportText:"تصدير نص", exportStats:"تصدير إحصائيات", settings:"إعدادات", includeSpaces:"تضمين المسافات", includePunctuation:"تضمين العلامات", wordSeparator:"فاصل الكلمات", ignoreNumbers:"تجاهل الأرقام", exportFormat:"تنسيق التصدير", plainText:"نص عادي", csv:"CSV", json:"JSON" }
};

const sampleTexts: Record<string, string> = {
  zh: "人工智能正在改变世界的方方面面。\n\n深度学习是机器学习的一个子集，它使用多层神经网络来学习数据的表示。\n\n近年来，大语言模型（LLM）取得了突破性进展，例如 GPT、BERT 等模型在自然语言处理任务中表现出色。\n\n这些技术不仅在学术研究中产生了深远影响，也在工业界得到了广泛应用：智能客服、内容生成、代码辅助、翻译服务等等。\n\nThe quick brown fox jumps over the lazy dog. This English sentence contains every letter of the alphabet at least once! Is it true? Let's check...",
  en: "Artificial intelligence is changing every aspect of our world.\n\nDeep learning is a subset of machine learning that uses multi-layer neural networks to learn representations of data.\n\nIn recent years, Large Language Models (LLMs) have made breakthrough progress. Models like GPT, BERT, and others have shown remarkable performance in natural language processing tasks.\n\nThese technologies have not only had a profound impact on academic research but have also been widely applied in industry: intelligent customer service, content generation, code assistance, translation services, and more.\n\n敏捷的棕色狐狸跳过懒狗。这句话包含了所有的英文字母！真的吗？让我们检查一下……",
  hi: "कृत्रिम बुद्धिमत्ता हमारी दुनिया के हर पहलू को बदल रही है।\n\nगहरी सीखना मशीन सीखने का एक सबसेट है जो डेटा के प्रतिनिधित्व को सीखने के लिए बहु-स्तर तंत्रिका नेटवर्क का उपयोग करता है।\n\nहाल के वर्षों में, बड़ी भाषा मॉडल (LLMs) ने सफलता प्राप्त की है।\n\nThe quick brown fox jumps over the lazy dog. What a wonderful sentence!",
  fr: "L'intelligence artificielle change tous les aspects de notre monde.\n\nL'apprentissage profond est un sous-ensemble de l'apprentissage automatique qui utilise des réseaux de neurones multicouches.\n\nCes dernières années, les Grands Modèles de Langage (LLM) ont réalisé des progrès révolutionnaires.\n\nThe quick brown fox jumps over the lazy dog! Cette phrase est très célèbre.",
  es: "La inteligencia artificial está cambiando todos los aspectos de nuestro mundo.\n\nEl aprendizaje profundo es un subconjunto del aprendizaje automático que utiliza redes neuronales multicapa.\n\nEn los últimos años, los Grandes Modelos de Lenguaje (LLM) han logrado avances revolucionarios.\n\nThe quick brown fox jumps over the lazy dog. ¡Esta frase es famosa!",
  ar: "الذكاء الاصطناعي يغير كل جوانب عالمنا.\n\nالتعلم العميق هو جزء من التعلم الآلي يستخدم الشبكات العصبية متعددة الطبقات.\n\nفي السنوات الأخيرة، حققت نماذج اللغة الكبرى (LLM) تقدماً ثورياً.\n\nThe quick brown fox jumps over the lazy dog! هذه الجملة مشهورة جداً."
};

const STORAGE_KEY = 'korelyy-text-counter';
const STORAGE_KEY_SETTINGS = 'korelyy-text-counter-settings';

export default function TextCounter({ locale = 'zh' }: TextCounterProps) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [includeSpaces, setIncludeSpaces] = useState(true);
  const [includePunctuation, setIncludePunctuation] = useState(true);
  const [ignoreNumbers, setIgnoreNumbers] = useState(false);
  const [exportFormat, setExportFormat] = useState<'plain' | 'csv' | 'json'>('plain');
  const [shareCopied, setShareCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setText(decodeURIComponent(stored));
      } catch {
        setText(stored);
      }
    }
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        setText(decodeURIComponent(atob(hash)));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.includeSpaces !== undefined) setIncludeSpaces(settings.includeSpaces);
        if (settings.includePunctuation !== undefined) setIncludePunctuation(settings.includePunctuation);
        if (settings.ignoreNumbers !== undefined) setIgnoreNumbers(settings.ignoreNumbers);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, encodeURIComponent(text));
  }, [text]);

  useEffect(() => {
    const settings = { includeSpaces, includePunctuation, ignoreNumbers };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [includeSpaces, includePunctuation, ignoreNumbers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCopyStats();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stats, locale]);

  const handleShare = async () => {
    if (!text.trim()) return;
    const encoded = btoa(encodeURIComponent(text));
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const t = (key: string): string => {
    const dict = i18n[locale] || i18n.zh;
    return dict[key] ?? i18n.zh[key] ?? key;
  };

  const stats = useMemo(() => {
    let filteredText = text;
    
    if (!includeSpaces) {
      filteredText = filteredText.replace(/\s/g, '');
    }
    
    if (!includePunctuation) {
      filteredText = filteredText.replace(/[.,;:!?。，；：！？、'"()[\]{}<>]/g, '');
    }
    
    const chars = filteredText.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const cjkChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    
    let asciiWords = 0;
    if (!ignoreNumbers) {
      asciiWords = (text.trim().match(/[A-Za-z]+/g) || []).length;
    } else {
      asciiWords = (text.trim().match(/[A-Za-z]+/g) || []).length;
    }
    
    const wordPattern = ignoreNumbers ? /[A-Za-z]+/g : /[A-Za-z0-9]+/g;
    const actualAsciiWords = (text.trim().match(wordPattern) || []).length;
    
    const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length;
    const nonEmptyLines = (text.match(/^.*\S+.*$/gm) || []).length;
    const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(s => s.length).length;
    const sentences = (text.match(/[^.!?。？！]*[.!?。？！]+|[^.!?。？！]+$/g) || []).filter(s => s.trim().length > 0).length;
    const bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).byteLength : 0;
    const avgWordLen = actualAsciiWords > 0 ? Math.round((charsNoSpace / actualAsciiWords) * 10) / 10 : 0;
    const readTimeMin = Math.ceil((cjkChars + actualAsciiWords) / 200);

    const freqMap = new Map<string, number>();
    for (const ch of text) {
      if (/\s/.test(ch)) continue;
      if (!includePunctuation && /[.,;:!?。，；：！？、'"()[\]{}<>]/.test(ch)) continue;
      freqMap.set(ch, (freqMap.get(ch) || 0) + 1);
    }
    const totalNonSpace = charsNoSpace;
    const topFreq = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ch, count]) => ({
        ch,
        count,
        percent: totalNonSpace > 0 ? (count / totalNonSpace) * 100 : 0
      }));

    return {
      chars,
      charsNoSpace,
      cjkChars,
      asciiWords: actualAsciiWords,
      lines,
      nonEmptyLines,
      paragraphs,
      sentences,
      bytes,
      avgWordLen,
      readTimeMin,
      topFreq
    };
  }, [text, includeSpaces, includePunctuation, ignoreNumbers]);

  const handleClear = () => {
    setText('');
    setCopied(false);
  };

  const handleSample = () => {
    setText(sampleTexts[locale] || sampleTexts.zh);
    setCopied(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleExportText = () => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-counter-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportStats = () => {
    let content = '';
    let filename = '';
    
    if (exportFormat === 'json') {
      content = JSON.stringify({
        timestamp: new Date().toISOString(),
        ...stats,
        settings: { includeSpaces, includePunctuation, ignoreNumbers }
      }, null, 2);
      filename = `text-counter-stats-${new Date().toISOString().split('T')[0]}.json`;
    } else if (exportFormat === 'csv') {
      content = [
        '指标,数值',
        `${t('chars')},${stats.chars}`,
        `${t('charsNoSpace')},${stats.charsNoSpace}`,
        `${t('cjkChars')},${stats.cjkChars}`,
        `${t('asciiWords')},${stats.asciiWords}`,
        `${t('lines')},${stats.lines}`,
        `${t('nonEmptyLines')},${stats.nonEmptyLines}`,
        `${t('paragraphs')},${stats.paragraphs}`,
        `${t('sentences')},${stats.sentences}`,
        `${t('bytes')},${stats.bytes}`,
        `${t('avgWordLen')},${stats.avgWordLen}`,
        `${t('readTimeMin')},${stats.readTimeMin}`
      ].join('\n');
      filename = `text-counter-stats-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      content = [
        `=== ${t('title')} ===`,
        ``,
        `${t('chars')}: ${stats.chars}`,
        `${t('charsNoSpace')}: ${stats.charsNoSpace}`,
        `${t('cjkChars')}: ${stats.cjkChars}`,
        `${t('asciiWords')}: ${stats.asciiWords}`,
        `${t('lines')}: ${stats.lines}`,
        `${t('nonEmptyLines')}: ${stats.nonEmptyLines}`,
        `${t('paragraphs')}: ${stats.paragraphs}`,
        `${t('sentences')}: ${stats.sentences}`,
        `${t('bytes')}: ${stats.bytes}`,
        `${t('avgWordLen')}: ${stats.avgWordLen}`,
        `${t('readTimeMin')}: ${stats.readTimeMin}`,
        ``,
        `=== ${t('density')} ===`
      ].join('\n');
      stats.topFreq.forEach(item => {
        content += `\n${item.ch}: ${item.count} (${item.percent.toFixed(1)}%)`;
      });
      filename = `text-counter-stats-${new Date().toISOString().split('T')[0]}.txt`;
    }
    
    const blob = new Blob([content], { type: exportFormat === 'json' ? 'application/json' : exportFormat === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyStats = async () => {
    const statsText = [
      `${t('chars')}: ${stats.chars}`,
      `${t('charsNoSpace')}: ${stats.charsNoSpace}`,
      `${t('cjkChars')}: ${stats.cjkChars}`,
      `${t('asciiWords')}: ${stats.asciiWords}`,
      `${t('lines')}: ${stats.lines}`,
      `${t('nonEmptyLines')}: ${stats.nonEmptyLines}`,
      `${t('paragraphs')}: ${stats.paragraphs}`,
      `${t('sentences')}: ${stats.sentences}`,
      `${t('bytes')}: ${stats.bytes}`,
      `${t('avgWordLen')}: ${stats.avgWordLen}`,
      `${t('readTimeMin')}: ${stats.readTimeMin}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(statsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = statsText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statCards = [
    { key: 'chars', value: stats.chars, label: t('chars') },
    { key: 'charsNoSpace', value: stats.charsNoSpace, label: t('charsNoSpace') },
    { key: 'cjkChars', value: stats.cjkChars, label: t('cjkChars') },
    { key: 'asciiWords', value: stats.asciiWords, label: t('asciiWords') },
    { key: 'lines', value: stats.lines, label: t('lines') },
    { key: 'nonEmptyLines', value: stats.nonEmptyLines, label: t('nonEmptyLines') },
    { key: 'paragraphs', value: stats.paragraphs, label: t('paragraphs') },
    { key: 'sentences', value: stats.sentences, label: t('sentences') }
  ];

  const longStatCard = [
    { key: 'bytes', value: stats.bytes, label: t('bytes') },
    { key: 'avgWordLen', value: stats.avgWordLen, label: t('avgWordLen') },
    { key: 'readTimeMin', value: stats.readTimeMin, label: t('readTimeMin') }
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'>
            <FileText className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
          </div>
        </div>

        <div className='space-y-4 sm:space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              {t('input')}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('placeholder')}
              className='w-full h-80 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors'
            />
          </div>

          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              <button
                onClick={handleImport}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                <Upload className='h-4 w-4' />
                {t('importFile')}
              </button>
              <button
                onClick={handleExportText}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                <Download className='h-4 w-4' />
                {t('exportText')}
              </button>
              <button
                onClick={handleSample}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                {t('sample')}
              </button>
              <button
                onClick={handleClear}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                <Trash2 className='h-4 w-4' />
                {t('clear')}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  showSettings 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Settings className='h-4 w-4' />
                {t('settings')}
                {showSettings ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleExportStats}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                {t('exportStats')}
              </button>
              <button
                onClick={handleShare}
                disabled={!text.trim()}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium'
              >
                {shareCopied ? <Check className='h-4 w-4' /> : <Share2 className='h-4 w-4' />}
                {shareCopied ? (locale === 'zh' ? '已分享' : locale === 'en' ? 'Shared' : 'Shared') : (locale === 'zh' ? '分享' : locale === 'en' ? 'Share' : 'Share')}
              </button>
              <button
                onClick={handleCopyStats}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg btn-primary text-sm font-medium'
              >
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                {copied ? (locale === 'zh' ? '已复制' : locale === 'en' ? 'Copied' : t('copyStats')) : t('copyStats')}
              </button>
            </div>
          </div>

          {showSettings && (
            <div className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={includeSpaces}
                    onChange={(e) => setIncludeSpaces(e.target.checked)}
                    className='w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{t('includeSpaces')}</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={includePunctuation}
                    onChange={(e) => setIncludePunctuation(e.target.checked)}
                    className='w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{t('includePunctuation')}</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={ignoreNumbers}
                    onChange={(e) => setIgnoreNumbers(e.target.checked)}
                    className='w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{t('ignoreNumbers')}</span>
                </label>
                <div className='flex flex-col'>
                  <label className='text-sm text-gray-700 dark:text-gray-300 mb-1.5'>{t('exportFormat')}</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'plain' | 'csv' | 'json')}
                    className='w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='plain'>{t('plainText')}</option>
                    <option value='csv'>{t('csv')}</option>
                    <option value='json'>{t('json')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type='file'
            accept='.txt,.md,.json'
            onChange={handleFileChange}
            className='hidden'
          />

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
            {statCards.map((card) => (
              <div
                key={card.key}
                className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4'
              >
                <div className='text-xl font-bold text-primary-600 dark:text-primary-400'>
                  {card.value.toLocaleString()}
                </div>
                <div className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1'>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
            {longStatCard.map((card) => (
              <div
                key={card.key}
                className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4'
              >
                <div className='text-xl font-bold text-primary-600 dark:text-primary-400'>
                  {card.value.toLocaleString()}
                </div>
                <div className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1'>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 sm:p-6'>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              {t('density')}
            </h3>
            {stats.topFreq.length > 0 ? (
              <div className='space-y-2'>
                {stats.topFreq.map((item, idx) => (
                  <div key={`${item.ch}-${idx}`} className='flex items-center gap-3'>
                    <div className='w-8 text-center font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded py-1'>
                      {item.ch === ' ' ? '␣' : item.ch}
                    </div>
                    <div className='flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded transition-all duration-300'
                        style={{ width: `${Math.max(item.percent, 1)}%` }}
                      />
                    </div>
                    <div className='w-16 text-right text-xs text-gray-600 dark:text-gray-400 font-mono'>
                      {item.count} ({item.percent.toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
                {t('placeholder')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
