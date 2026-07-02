'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, FileText, Trash2, Download } from 'lucide-react';

interface TextCounterProps {
  locale?: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: { title:"字数统计", subtitle:"实时字符/单词/行/段落统计", input:"输入或粘贴文本", placeholder:"在此输入要统计的文本...", chars:"字符（含空格）", charsNoSpace:"字符（不含空格）", cjkChars:"中文汉字数", asciiWords:"英文单词数", lines:"行数", nonEmptyLines:"非空行", paragraphs:"段落数（空行分隔）", sentences:"句子数（.?! 。？！分隔）", bytes:"字节数（UTF-8）", avgWordLen:"平均词长（字符）", readTimeMin:"预计阅读时间(分钟，200字/分)", density:"字符频率 TOP 10", clear:"清空", copyStats:"复制统计结果", sample:"加载示例文本" },
  en: { title:"Text Counter", subtitle:"Real-time chars/words/lines/paragraphs", input:"Enter or paste text", placeholder:"Paste text to count...", chars:"Characters (with spaces)", charsNoSpace:"Characters (no spaces)", cjkChars:"Chinese characters", asciiWords:"English words", lines:"Lines", nonEmptyLines:"Non-empty lines", paragraphs:"Paragraphs (blank separated)", sentences:"Sentences", bytes:"Bytes (UTF-8)", avgWordLen:"Avg word length (chars)", readTimeMin:"Est. read time (min, 200wpm)", density:"Top 10 char frequency", clear:"Clear", copyStats:"Copy stats", sample:"Load sample" },
  hi: { title:"टेक्स्ट काउंटर", subtitle:"रीयल-टाइम अक्षर/शब्द/लाइन/पैरा", input:"टेक्स्ट डालें", placeholder:"गिनने के लिए टेक्स्ट...", chars:"अक्षर (स्पेस सहित)", charsNoSpace:"अक्षर (स्पेस बिना)", cjkChars:"चीनी अक्षर", asciiWords:"अंग्रेजी शब्द", lines:"लाइनें", nonEmptyLines:"खाली नहीं लाइनें", paragraphs:"पैराग्राफ", sentences:"वाक्य", bytes:"बाइट्स", avgWordLen:"औसत शब्द लंबाई", readTimeMin:"पढ़ने का समय (मिनट)", density:"शीर्ष 10 अक्षर आवृत्ति", clear:"साफ़", copyStats:"कॉपी आँकड़े", sample:"सैंपल" },
  fr: { title:"Compteur de Texte", subtitle:"Caractères/mots/lignes/paragraphes", input:"Entrez le texte", placeholder:"Collez le texte...", chars:"Caractères (espaces)", charsNoSpace:"Caractères (sans)", cjkChars:"Car. chinois", asciiWords:"Mots anglais", lines:"Lignes", nonEmptyLines:"Lignes non vides", paragraphs:"Paragraphes", sentences:"Phrases", bytes:"Octets", avgWordLen:"Long. moyenne", readTimeMin:"Temps de lecture (min)", density:"Top 10 fréquence", clear:"Effacer", copyStats:"Copier stats", sample:"Exemple" },
  es: { title:"Contador de Texto", subtitle:"Caracteres/palabras/líneas/párrafos", input:"Introduzca texto", placeholder:"Pegue el texto...", chars:"Caracteres (con esp.)", charsNoSpace:"Caracteres (sin)", cjkChars:"Car. chinos", asciiWords:"Palabras inglés", lines:"Líneas", nonEmptyLines:"Líneas no vacías", paragraphs:"Párrafos", sentences:"Oraciones", bytes:"Bytes", avgWordLen:"Long. media", readTimeMin:"Tiempo lectura (min)", density:"Top 10 frecuencia", clear:"Limpiar", copyStats:"Copiar estadísticas", sample:"Ejemplo" },
  ar: { title:"عداد النص", subtitle:"أحرف/كلمات/أسطر/فقرات فورية", input:"أدخل النص", placeholder:"الصق النص هنا...", chars:"الأحرف (مع مسافات)", charsNoSpace:"الأحرف (بدون)", cjkChars:"أحرف صينية", asciiWords:"كلمات إنجليزية", lines:"الأسطر", nonEmptyLines:"أسطر غير فارغة", paragraphs:"الفقرات", sentences:"الجمل", bytes:"البايتات", avgWordLen:"متوسط طول الكلمة", readTimeMin:"وقت القراءة (دقيقة)", density:"أعلى 10 تكرارات للحرف", clear:"مسح", copyStats:"نسخ الإحصائيات", sample:"مثال" }
};

const sampleTexts: Record<string, string> = {
  zh: "人工智能正在改变世界的方方面面。\n\n深度学习是机器学习的一个子集，它使用多层神经网络来学习数据的表示。\n\n近年来，大语言模型（LLM）取得了突破性进展，例如 GPT、BERT 等模型在自然语言处理任务中表现出色。\n\n这些技术不仅在学术研究中产生了深远影响，也在工业界得到了广泛应用：智能客服、内容生成、代码辅助、翻译服务等等。\n\nThe quick brown fox jumps over the lazy dog. This English sentence contains every letter of the alphabet at least once! Is it true? Let's check...",
  en: "Artificial intelligence is changing every aspect of our world.\n\nDeep learning is a subset of machine learning that uses multi-layer neural networks to learn representations of data.\n\nIn recent years, Large Language Models (LLMs) have made breakthrough progress. Models like GPT, BERT, and others have shown remarkable performance in natural language processing tasks.\n\nThese technologies have not only had a profound impact on academic research but have also been widely applied in industry: intelligent customer service, content generation, code assistance, translation services, and more.\n\n敏捷的棕色狐狸跳过懒狗。这句话包含了所有的英文字母！真的吗？让我们检查一下……",
  hi: "कृत्रिम बुद्धिमत्ता हमारी दुनिया के हर पहलू को बदल रही है।\n\nगहरी सीखना मशीन सीखने का एक सबसेट है जो डेटा के प्रतिनिधित्व को सीखने के लिए बहु-स्तर तंत्रिका नेटवर्क का उपयोग करता है।\n\nहाल के वर्षों में, बड़ी भाषा मॉडल (LLMs) ने सफलता प्राप्त की है।\n\nThe quick brown fox jumps over the lazy dog. What a wonderful sentence!",
  fr: "L'intelligence artificielle change tous les aspects de notre monde.\n\nL'apprentissage profond est un sous-ensemble de l'apprentissage automatique qui utilise des réseaux de neurones multicouches.\n\nCes dernières années, les Grands Modèles de Langage (LLM) ont réalisé des progrès révolutionnaires.\n\nThe quick brown fox jumps over the lazy dog! Cette phrase est très célèbre.",
  es: "La inteligencia artificial está cambiando todos los aspectos de nuestro mundo.\n\nEl aprendizaje profundo es un subconjunto del aprendizaje automático que utiliza redes neuronales multicapa.\n\nEn los últimos años, los Grandes Modelos de Lenguaje (LLM) han logrado avances revolucionarios.\n\nThe quick brown fox jumps over the lazy dog. ¡Esta frase es famosa!",
  ar: "الذكاء الاصطناعي يغير كل جوانب عالمنا.\n\nالتعلم العميق هو جزء من التعلم الآلي يستخدم الشبكات العصبية متعددة الطبقات.\n\nفي السنوات الأخيرة، حققت نماذج اللغة الكبرى (LLM) تقدماً ثورياً.\n\nThe quick brown fox jumps over the lazy dog! هذه الجملة مشهورة جداً."
};

export default function TextCounter({ locale = 'zh' }: TextCounterProps) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const t = (key: string): string => {
    const dict = i18n[locale] || i18n.zh;
    return dict[key] ?? i18n.zh[key] ?? key;
  };

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const cjkChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const asciiWords = (text.trim().match(/[A-Za-z]+/g) || []).length;
    const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length;
    const nonEmptyLines = (text.match(/^.*\S+.*$/gm) || []).length;
    const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(s => s.length).length;
    const sentences = (text.match(/[^.!?。？！]*[.!?。？！]+|[^.!?。？！]+$/g) || []).filter(s => s.trim().length > 0).length;
    const bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).byteLength : 0;
    const avgWordLen = asciiWords > 0 ? Math.round((charsNoSpace / asciiWords) * 10) / 10 : 0;
    const readTimeMin = Math.ceil((cjkChars + asciiWords) / 200);

    const freqMap = new Map<string, number>();
    for (const ch of text) {
      if (/\s/.test(ch)) continue;
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
      asciiWords,
      lines,
      nonEmptyLines,
      paragraphs,
      sentences,
      bytes,
      avgWordLen,
      readTimeMin,
      topFreq
    };
  }, [text]);

  const handleClear = () => {
    setText('');
    setCopied(false);
  };

  const handleSample = () => {
    setText(sampleTexts[locale] || sampleTexts.zh);
    setCopied(false);
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
            <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
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
            <div className='flex items-center gap-2'>
              <button
                onClick={handleSample}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                <Download className='h-4 w-4' />
                {t('sample')}
              </button>
              <button
                onClick={handleClear}
                className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium'
              >
                <Trash2 className='h-4 w-4' />
                {t('clear')}
              </button>
            </div>
            <button
              onClick={handleCopyStats}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg btn-primary text-sm font-medium'
            >
              {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              {copied ? (locale === 'zh' ? '已复制' : locale === 'en' ? 'Copied' : t('copyStats')) : t('copyStats')}
            </button>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
            {statCards.map((card) => (
              <div
                key={card.key}
                className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4'
              >
                <div className='text-2xl font-bold text-primary-600 dark:text-primary-400'>
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
                <div className='text-2xl font-bold text-primary-600 dark:text-primary-400'>
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
