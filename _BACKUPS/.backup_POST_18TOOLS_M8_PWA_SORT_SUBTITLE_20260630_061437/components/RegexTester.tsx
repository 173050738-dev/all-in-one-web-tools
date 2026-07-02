'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Info, Regex } from 'lucide-react';

interface RegexTesterProps {
  locale?: string;
}

const i18n = {
  zh: { title:"正则表达式测试器", subtitle:"在线调试 + 高亮匹配 + 模板库", regexInput:"正则表达式 (regex)", flags:"标志 (flags)", flagG:"全局 (g)", flagI:"忽略大小写 (i)", flagM:"多行 (m)", flagS:"点号匹配换行 (s)", flagU:"Unicode (u)", testText:"测试文本", matches:"匹配结果", matchCount:"匹配 {n} 处", noMatch:"无匹配", groups:"捕获分组 ($1,$2...)", replaceMode:"替换模式", replaceInput:"替换为 ($1 引用分组)", replaced:"替换结果", templates:"常用模板", sampleEmail:"邮箱 Email", samplePhone:"手机号", sampleUrl:"URL链接", sampleIp:"IPv4 地址", sampleIdCard:"身份证号", sampleDate:"日期 YYYY-MM-DD", sampleCn:"中文汉字", samplePassword:"强密码 8位+", copyMatch:"复制全部匹配", copied:"已复制", explain:"语法说明", errorInvalid:"正则语法错误: {msg}" },
  en: { title:"Regex Tester", subtitle:"Live debug + highlight + template library", regexInput:"Regular expression", flags:"Flags", flagG:"Global (g)", flagI:"Case Insensitive (i)", flagM:"Multiline (m)", flagS:"Dotall (s)", flagU:"Unicode (u)", testText:"Test text", matches:"Matches", matchCount:"{n} matches", noMatch:"No matches", groups:"Capture groups ($1,$2...)", replaceMode:"Replace mode", replaceInput:"Replace with ($1 refs)", replaced:"Replaced result", templates:"Common templates", sampleEmail:"Email", samplePhone:"Phone (CN)", sampleUrl:"URL", sampleIp:"IPv4", sampleIdCard:"ID card (CN)", sampleDate:"Date YYYY-MM-DD", sampleCn:"Chinese chars", samplePassword:"Strong password 8+", copyMatch:"Copy all matches", copied:"Copied", explain:"Syntax reference", errorInvalid:"Invalid regex: {msg}" },
  hi: { title:"रेगेक्स परीक्षक", subtitle:"लाइव डीबग + हाइलाइट + टेम्पलेट", regexInput:"नियमित अभिव्यक्ति", flags:"फ्लैग", flagG:"ग्लोबल (g)", flagI:"केस इग्नोर (i)", flagM:"मल्टीलाइन (m)", flagS:"डॉटॉल (s)", flagU:"यूनिकोड (u)", testText:"टेस्ट टेक्स्ट", matches:"मैच", matchCount:"{n} मैच", noMatch:"कोई मैच नहीं", groups:"ग्रुप", replaceMode:"रिप्लेस मोड", replaceInput:"से बदलें", replaced:"रिजल्ट", templates:"टेम्पलेट", sampleEmail:"ईमेल", samplePhone:"फ़ोन", sampleUrl:"URL", sampleIp:"IPv4", sampleIdCard:"आईडी", sampleDate:"दिनांक", sampleCn:"चीनी अक्षर", samplePassword:"पासवर्ड", copyMatch:"सभी मैच कॉपी", copied:"कॉपी हो गया", explain:"सिंटैक्स", errorInvalid:"गलत regex: {msg}" },
  fr: { title:"Testeur Regex", subtitle:"Debug en direct + surlignage", regexInput:"Expression régulière", flags:"Drapeaux", flagG:"Global (g)", flagI:"Insensible (i)", flagM:"Multiligne (m)", flagS:"Dotall (s)", flagU:"Unicode (u)", testText:"Texte test", matches:"Correspondances", matchCount:"{n} trouvés", noMatch:"Aucun", groups:"Groupes capturés", replaceMode:"Mode remplacement", replaceInput:"Remplacer par", replaced:"Résultat", templates:"Modèles courants", sampleEmail:"E-mail", samplePhone:"Téléphone", sampleUrl:"URL", sampleIp:"IPv4", sampleIdCard:"Carte ID", sampleDate:"Date", sampleCn:"Chinois", samplePassword:"Mot de passe", copyMatch:"Tout copier", copied:"Copié", explain:"Syntaxe", errorInvalid:"Regex invalide: {msg}" },
  es: { title:"Probador Regex", subtitle:"Depuración en vivo + resaltado", regexInput:"Expresión regular", flags:"Banderas", flagG:"Global (g)", flagI:"May/min (i)", flagM:"Multilínea (m)", flagS:"Dotall (s)", flagU:"Unicode (u)", testText:"Texto prueba", matches:"Coincidencias", matchCount:"{n} coincidencias", noMatch:"Ninguna", groups:"Grupos captura", replaceMode:"Modo reemplazo", replaceInput:"Reemplazar con", replaced:"Resultado", templates:"Plantillas", sampleEmail:"Correo", samplePhone:"Teléfono", sampleUrl:"URL", sampleIp:"IPv4", sampleIdCard:"DNI", sampleDate:"Fecha", sampleCn:"Chino", samplePassword:"Contraseña", copyMatch:"Copiar todo", copied:"Copiado", explain:"Sintaxis", errorInvalid:"Regex no válida: {msg}" },
  ar: { title:"مختبر Regex", subtitle:"تصحيح فوري + تمييز + قوالب", regexInput:"التعبير المنتظم", flags:"العلامات", flagG:"عام (g)", flagI:"تجاهل الحالة (i)", flagM:"متعدد الأسطر (m)", flagS:"Dotall (s)", flagU:"يونيكود (u)", testText:"نص الاختبار", matches:"التطابقات", matchCount:"{n} تطابق", noMatch:"لا تطابقات", groups:"مجموعات الالتقاط", replaceMode:"وضع الاستبدال", replaceInput:"استبدال بـ", replaced:"النتيجة", templates:"قوالب شائعة", sampleEmail:"بريد إلكتروني", samplePhone:"هاتف", sampleUrl:"رابط", sampleIp:"عنوان IPv4", sampleIdCard:"هوية", sampleDate:"تاريخ", sampleCn:"حروف صينية", samplePassword:"كلمة مرور", copyMatch:"نسخ جميع التطابقات", copied:"تم النسخ", explain:"مرجع الصياغة", errorInvalid:"Regex غير صالحة: {msg}" }
};

const templates = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.source,
  phone: /^1[3-9]\d{9}$/.source,
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/.source,
  ip: /((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[01]?\d?\d)/.source,
  idcard: /\d{17}[\dXx]|\d{15}/.source,
  date: /\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])/.source,
  cn: /[\u4e00-\u9fff]+/.source,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.source,
};

const syntaxTokens = [
  { token: '.', desc: { zh: '匹配除换行符外的任意单个字符', en: 'Any char except newline', hi: 'कोई भी अक्षर', fr: 'Tout caractère', es: 'Cualquier carácter', ar: 'أي حرف' } },
  { token: '^', desc: { zh: '匹配字符串开头', en: 'Start of string', hi: 'शुरुआत', fr: 'Début de chaîne', es: 'Inicio de cadena', ar: 'بداية السلسلة' } },
  { token: '$', desc: { zh: '匹配字符串结尾', en: 'End of string', hi: 'अंत', fr: 'Fin de chaîne', es: 'Fin de cadena', ar: 'نهاية السلسلة' } },
  { token: '*', desc: { zh: '匹配前面的表达式 0 次或多次', en: '0 or more times', hi: '0 या अधिक', fr: '0 ou plus', es: '0 o más veces', ar: '0 أو أكثر' } },
  { token: '+', desc: { zh: '匹配前面的表达式 1 次或多次', en: '1 or more times', hi: '1 या अधिक', fr: '1 ou plus', es: '1 o más veces', ar: '1 أو أكثر' } },
  { token: '?', desc: { zh: '匹配前面的表达式 0 次或 1 次', en: '0 or 1 time', hi: '0 या 1', fr: '0 ou 1 fois', es: '0 o 1 vez', ar: '0 أو 1 مرة' } },
  { token: '{n,m}', desc: { zh: '匹配前面的表达式 n 到 m 次', en: 'n to m times', hi: 'n से m बार', fr: 'n à m fois', es: 'n a m veces', ar: 'من n إلى m مرة' } },
  { token: '[abc]', desc: { zh: '匹配方括号中的任意字符', en: 'Char in set', hi: 'सेट का अक्षर', fr: 'Caractère dans ensemble', es: 'Carácter en conjunto', ar: 'حرف في المجموعة' } },
  { token: '[^abc]', desc: { zh: '匹配不在方括号中的字符', en: 'Char not in set', hi: 'सेट में नहीं', fr: 'Caractère hors ensemble', es: 'Carácter fuera de conjunto', ar: 'حرف ليس في المجموعة' } },
  { token: '\\d', desc: { zh: '匹配数字 [0-9]', en: 'Digit [0-9]', hi: 'अंक [0-9]', fr: 'Chiffre [0-9]', es: 'Dígito [0-9]', ar: 'رقم [0-9]' } },
  { token: '\\w', desc: { zh: '匹配字母数字下划线', en: 'Word char [A-Za-z0-9_]', hi: 'शब्द अक्षर', fr: 'Caractère mot', es: 'Carácter palabra', ar: 'حرف كلمة' } },
  { token: '\\s', desc: { zh: '匹配空白字符', en: 'Whitespace', hi: 'व्हाइटस्पेस', fr: 'Espace blanc', es: 'Espacio en blanco', ar: 'مسافة بيضاء' } },
  { token: '(...)', desc: { zh: '捕获分组，可使用 $1 引用', en: 'Capture group', hi: 'कैप्चर ग्रुप', fr: 'Groupe capturé', es: 'Grupo captura', ar: 'مجموعة التقاط' } },
  { token: 'a|b', desc: { zh: '匹配 a 或 b', en: 'a or b', hi: 'a या b', fr: 'a ou b', es: 'a o b', ar: 'a أو b' } },
  { token: '\\b', desc: { zh: '单词边界', en: 'Word boundary', hi: 'शब्द सीमा', fr: 'Borne de mot', es: 'Límite palabra', ar: 'حد الكلمة' } },
];

const sampleTextZh = `联系方式：
邮箱：admin@example.com, support@test.org.cn
手机：13812345678, 15900001111
网站：https://www.example.com/path?query=1
IP地址：192.168.1.100, 10.0.0.1
日期：2024-01-15, 2023/12/25
身份证：110101199001011234
中文内容：这是一段中文测试文本，用于正则匹配测试。
密码示例：MyP@ssw0rd!`;

export default function RegexTester({ locale = 'zh' }: RegexTesterProps) {
  const [regexStr, setRegexStr] = useState('');
  const [flagsStr, setFlagsStr] = useState('g');
  const [testStr, setTestStr] = useState(sampleTextZh);
  const [replaceWith, setReplaceWith] = useState('');
  const [replaceMode, setReplaceMode] = useState(false);
  const [copiedMatches, setCopiedMatches] = useState(false);
  const [copiedReplaced, setCopiedReplaced] = useState(false);

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

  const flagConfig = [
    { key: 'g', labelKey: 'flagG' as const },
    { key: 'i', labelKey: 'flagI' as const },
    { key: 'm', labelKey: 'flagM' as const },
    { key: 's', labelKey: 'flagS' as const },
    { key: 'u', labelKey: 'flagU' as const },
  ];

  const toggleFlag = (flag: string) => {
    if (flagsStr.includes(flag)) {
      setFlagsStr(flagsStr.replace(flag, ''));
    } else {
      setFlagsStr(flagsStr + flag);
    }
  };

  const result = useMemo(() => {
    if (!regexStr) {
      return { regex: null, errorMsg: null, matches: [], replacedResult: '', highlightedParts: null };
    }

    let regex: RegExp | null = null;
    let errorMsg: string | null = null;

    try {
      regex = new RegExp(regexStr, flagsStr);
    } catch (e) {
      errorMsg = e instanceof SyntaxError ? e.message : String(e);
      return { regex, errorMsg, matches: [], replacedResult: '', highlightedParts: null };
    }

    const matches: Array<{ text: string; index: number; groups: string[] }> = [];

    if (flagsStr.includes('g')) {
      let m;
      const re = new RegExp(regexStr, flagsStr);
      while ((m = re.exec(testStr)) !== null) {
        matches.push({
          text: m[0],
          index: m.index,
          groups: m.slice(1),
        });
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
      }
    } else {
      const m = regex.exec(testStr);
      if (m) {
        matches.push({
          text: m[0],
          index: m.index,
          groups: m.slice(1),
        });
      }
    }

    let replacedResult = '';
    if (replaceMode) {
      try {
        replacedResult = testStr.replace(regex, replaceWith);
      } catch {
        replacedResult = testStr;
      }
    }

    const parts: Array<{ text: string; isMatch: boolean }> = [];
    let lastEnd = 0;
    for (const match of matches) {
      if (match.index > lastEnd) {
        parts.push({ text: testStr.slice(lastEnd, match.index), isMatch: false });
      }
      parts.push({ text: match.text, isMatch: true });
      lastEnd = match.index + match.text.length;
    }
    if (lastEnd < testStr.length) {
      parts.push({ text: testStr.slice(lastEnd), isMatch: false });
    }
    if (matches.length === 0 && testStr) {
      parts.push({ text: testStr, isMatch: false });
    }

    return { regex, errorMsg, matches, replacedResult, highlightedParts: parts };
  }, [regexStr, flagsStr, testStr, replaceMode, replaceWith]);

  const copyAllMatches = async () => {
    const all = result.matches.map((m) => m.text).join('\n');
    if (!all) return;
    try {
      await navigator.clipboard.writeText(all);
      setCopiedMatches(true);
      setTimeout(() => setCopiedMatches(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = all;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedMatches(true);
      setTimeout(() => setCopiedMatches(false), 2000);
    }
  };

  const copyReplaced = async () => {
    if (!result.replacedResult) return;
    try {
      await navigator.clipboard.writeText(result.replacedResult);
      setCopiedReplaced(true);
      setTimeout(() => setCopiedReplaced(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.replacedResult;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedReplaced(true);
      setTimeout(() => setCopiedReplaced(false), 2000);
    }
  };

  const templateButtons = [
    { key: 'email', tpl: templates.email, labelKey: 'sampleEmail' as const },
    { key: 'phone', tpl: templates.phone, labelKey: 'samplePhone' as const },
    { key: 'url', tpl: templates.url, labelKey: 'sampleUrl' as const },
    { key: 'ip', tpl: templates.ip, labelKey: 'sampleIp' as const },
    { key: 'idcard', tpl: templates.idcard, labelKey: 'sampleIdCard' as const },
    { key: 'date', tpl: templates.date, labelKey: 'sampleDate' as const },
    { key: 'cn', tpl: templates.cn, labelKey: 'sampleCn' as const },
    { key: 'password', tpl: templates.password, labelKey: 'samplePassword' as const },
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <div className='lg:col-span-5 space-y-4 sm:space-y-6'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'>
                <Regex className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('regexInput')}
                </label>
                <input
                  type='text'
                  value={regexStr}
                  onChange={(e) => setRegexStr(e.target.value)}
                  placeholder='e.g. \\d+ or [a-zA-Z]+'
                  className='w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                />
                {result.errorMsg && (
                  <div className='mt-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                    <p className='text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium'>
                      {t('errorInvalid', { msg: result.errorMsg })}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('flags')}: <span className='font-mono text-blue-600 dark:text-blue-400'>{flagsStr || '-'}</span>
                </label>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {flagConfig.map((fg) => (
                    <label
                      key={fg.key}
                      className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                        flagsStr.includes(fg.key)
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={flagsStr.includes(fg.key)}
                        onChange={() => toggleFlag(fg.key)}
                        className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                      <span className='text-gray-700 dark:text-gray-300 truncate'>{t(fg.labelKey)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('templates')}</h3>
            <div className='grid grid-cols-2 gap-2'>
              {templateButtons.map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setRegexStr(tb.tpl)}
                  className='px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-xs sm:text-sm text-left truncate'
                >
                  {t(tb.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='lg:col-span-7 space-y-4 sm:space-y-6'>
          <div className='card p-4 sm:p-6'>
            <div className='space-y-4 sm:space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('testText')}
                </label>
                <textarea
                  value={testStr}
                  onChange={(e) => setTestStr(e.target.value)}
                  className='w-full h-64 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none'
                />
              </div>

              <div className='flex border-b border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => setReplaceMode(false)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    !replaceMode
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {t('matches')}
                  {!replaceMode && result.matches.length > 0 && (
                    <span className='ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs'>
                      {result.matches.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setReplaceMode(true)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    replaceMode
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {t('replaceMode')}
                </button>
              </div>

              {!replaceMode ? (
                <div className='space-y-4'>
                  {result.highlightedParts && (
                    <div className='p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 min-h-[80px] max-h-60 overflow-auto'>
                      <div className='font-mono text-sm whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100'>
                        {result.highlightedParts.map((part, i) =>
                          part.isMatch ? (
                            <mark
                              key={i}
                              className='bg-yellow-200 dark:bg-yellow-700/60 text-gray-900 dark:text-gray-100 px-0.5 rounded'
                            >
                              {part.text}
                            </mark>
                          ) : (
                            <span key={i}>{part.text}</span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {result.matches.length > 0
                        ? t('matchCount', { n: result.matches.length })
                        : t('noMatch')}
                    </span>
                    {result.matches.length > 0 && (
                      <button
                        onClick={copyAllMatches}
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm'
                      >
                        {copiedMatches ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
                        {copiedMatches ? t('copied') : t('copyMatch')}
                      </button>
                    )}
                  </div>

                  {result.matches.length > 0 && (
                    <ul className='space-y-2 max-h-72 overflow-auto'>
                      {result.matches.map((m, idx) => (
                        <li
                          key={idx}
                          className='p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        >
                          <div className='flex items-start gap-2 sm:gap-3 flex-wrap'>
                            <span className='flex-shrink-0 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold'>
                              #{idx + 1}
                            </span>
                            <span className='text-xs text-gray-500 dark:text-gray-400 flex-shrink-0'>
                              index: {m.index}
                            </span>
                            <code className='flex-1 min-w-0 px-2 py-0.5 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 font-mono text-xs sm:text-sm break-all'>
                              {m.text}
                            </code>
                          </div>
                          {m.groups.length > 0 && (
                            <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50'>
                              <p className='text-xs text-gray-500 dark:text-gray-400 mb-1.5'>{t('groups')}</p>
                              <div className='flex flex-wrap gap-1.5'>
                                {m.groups.map((g, gi) => (
                                  <span
                                    key={gi}
                                    className='px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-mono'
                                  >
                                    ${gi + 1}: {g || '(empty)'}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t('replaceInput')}
                    </label>
                    <input
                      type='text'
                      value={replaceWith}
                      onChange={(e) => setReplaceWith(e.target.value)}
                      placeholder='e.g. [$1] or replacement text'
                      className='w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                    />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {t('replaced')}
                      </label>
                      {result.replacedResult && (
                        <button
                          onClick={copyReplaced}
                          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm'
                        >
                          {copiedReplaced ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
                        </button>
                      )}
                    </div>
                    <div className='p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 min-h-[120px] max-h-72 overflow-auto'>
                      <div className='font-mono text-sm whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100'>
                        {result.replacedResult || testStr}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='lg:col-span-12'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-2 mb-3 sm:mb-4'>
              <Info className='h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0' />
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('explain')}</h3>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3'>
              {syntaxTokens.map((st) => (
                <div
                  key={st.token}
                  className='p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                >
                  <code className='inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-xs sm:text-sm font-semibold mb-1.5'>
                    {st.token}
                  </code>
                  <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {(st.desc as Record<string, string>)[locale] || st.desc.zh}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
