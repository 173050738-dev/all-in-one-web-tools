'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowUpDown, Trash2 } from 'lucide-react';

interface UrlEncodeDecodeProps {
  locale?: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: { title:"URL 编码解码", subtitle:"Percent-Encoding / Base64 / HTML 实体", modeUrl:"URL编解码", modeBase64:"Base64编解码", modeHtml:"HTML实体", encode:"编码", decode:"解码", input:"输入", output:"输出", copy:"复制", copied:"已复制", swap:"↕ 互换", clear:"清空", safeChars:"安全字符保留", sampleUrl:"https://你好世界.com/path?name=张三&id=123&query=测试内容&special=!@#$%^&*()[]{};:'\",<>/?`~", sampleBase64:"SGVsbG8gV29ybGQhIOS4reaWh+S4r+eUqOaItw==", sampleHtml:"<div class=\"container\">你好 & 欢迎 <script>alert(1)</script></div>" },
  en: { title:"URL Encode/Decode", subtitle:"Percent / Base64 / HTML Entity", modeUrl:"URL Encode/Decode", modeBase64:"Base64 Encode/Decode", modeHtml:"HTML Entities", encode:"Encode", decode:"Decode", input:"Input", output:"Output", copy:"Copy", copied:"Copied", swap:"↕ Swap", clear:"Clear", safeChars:"Safe chars", sampleUrl:"https://example.com/path?name=John&id=123&query=Hello World!&special=!@#$%^&*()[]{};:'\",<>/?`~", sampleBase64:"SGVsbG8gV29ybGQhIENvZGUgaXMgZnVuIQ==", sampleHtml:"<div class=\"container\">Hello & Welcome <script>alert(1)</script></div>" },
  hi: { title:"URL एन्कोड/डिकोड", subtitle:"पर्सेंट / Base64 / HTML एंटिटी", modeUrl:"URL", modeBase64:"Base64", modeHtml:"HTML एंटिटी", encode:"एन्कोड", decode:"डिकोड", input:"इनपुट", output:"आउटपुट", copy:"कॉपी", copied:"कॉपी हुआ", swap:"↕ बदलें", clear:"साफ़ करें", safeChars:"सेफ अक्षर", sampleUrl:"https://उदाहरण.इन/पाथ?name=राम&id=123", sampleBase64:"SGVsbG8gV29ybGQh", sampleHtml:"<b>नमस्ते</b> & स्वागत" },
  fr: { title:"Encodage URL", subtitle:"Pourcentage / Base64 / Entités HTML", modeUrl:"URL", modeBase64:"Base64", modeHtml:"Entités HTML", encode:"Encoder", decode:"Décoder", input:"Entrée", output:"Sortie", copy:"Copier", copied:"Copié", swap:"↕ Échanger", clear:"Effacer", safeChars:"Caract. sûrs", sampleUrl:"https://exemple.fr/chemin?nom=Jean&id=123", sampleBase64:"SGVsbG8gV29ybGQh", sampleHtml:"<div>Bonjour & Bienvenue</div>" },
  es: { title:"Codificación URL", subtitle:"Porcentaje / Base64 / Entidades HTML", modeUrl:"URL", modeBase64:"Base64", modeHtml:"Entidades HTML", encode:"Codificar", decode:"Decodificar", input:"Entrada", output:"Salida", copy:"Copiar", copied:"Copiado", swap:"↕ Intercambiar", clear:"Limpiar", safeChars:"Seguros", sampleUrl:"https://ejemplo.es/ruta?nombre=Juan&id=123", sampleBase64:"SGVsbG8gV29ybGQh", sampleHtml:"<div>Hola & Bienvenido</div>" },
  ar: { title:"ترميز عنوان URL", subtitle:"نسبة مئوية / Base64 / كيانات HTML", modeUrl:"URL", modeBase64:"Base64", modeHtml:"كيانات HTML", encode:"ترميز", decode:"فك ترميز", input:"إدخال", output:"إخراج", copy:"نسخ", copied:"تم النسخ", swap:"↕ تبديل", clear:"مسح", safeChars:"أحرف آمنة", sampleUrl:"https://مثال.كوم/مسار?اسم=احمد", sampleBase64:"SGVsbG8gV29ybGQh", sampleHtml:"<div>مرحباً و أهلاً بك</div>" }
};

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
type Mode = 'url' | 'base64' | 'html';

export default function UrlEncodeDecode({ locale = 'zh' }: UrlEncodeDecodeProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const t = i18n[resolvedLocale] || i18n.zh;

  const [mode, setMode] = useState<Mode>('url');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [outputKey, setOutputKey] = useState<string | null>(null);
  const [safeChars, setSafeChars] = useState<boolean>(true);

  const userEditedRef = useRef<boolean>(false);
  const initializedRef = useRef<Record<Mode, boolean>>({ url: false, base64: false, html: false });

  const getSampleForMode = (m: Mode) => {
    if (m === 'url') return t.sampleUrl;
    if (m === 'base64') return t.sampleBase64;
    return t.sampleHtml;
  };

  useEffect(() => {
    if (!initializedRef.current[mode] && !userEditedRef.current) {
      setInput(getSampleForMode(mode));
      initializedRef.current[mode] = true;
    }
  }, [mode]);

  const handleInputChange = (value: string) => {
    userEditedRef.current = true;
    setInput(value);
  };

  const encodeUrl = (x: string): string => {
    if (safeChars) {
      return encodeURIComponent(x);
    }
    return x.split('').map(c => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`).join('');
  };

  const decodeUrl = (x: string): string => {
    try {
      return decodeURIComponent(x);
    } catch (e) {
      if (e instanceof URIError) {
        return 'Error: Invalid percent-encoded sequence';
      }
      return 'Error: ' + (e as Error).message;
    }
  };

  const encodeBase64 = (x: string): string => {
    const bytes = new TextEncoder().encode(x);
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  };

  const decodeBase64 = (x: string): string => {
    try {
      const binary = atob(x);
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
      return 'Error: Invalid Base64 string';
    }
  };

  const encodeHtml = (x: string): string => {
    return x
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const decodeHtml = (x: string): string => {
    let result = x
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&');

    result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    return result;
  };

  const handleEncode = () => {
    let result = '';
    if (mode === 'url') result = encodeUrl(input);
    else if (mode === 'base64') result = encodeBase64(input);
    else result = encodeHtml(input);
    setOutput(result);
    setOutputKey(Date.now().toString());
  };

  const handleDecode = () => {
    let result = '';
    if (mode === 'url') result = decodeUrl(input);
    else if (mode === 'base64') result = decodeBase64(input);
    else result = decodeHtml(input);
    setOutput(result);
    setOutputKey(Date.now().toString());
  };

  const handleSwap = () => {
    const oldInput = input;
    setInput(output);
    setOutput(oldInput);
    userEditedRef.current = true;
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    userEditedRef.current = true;
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setOutputKey('copied');
      setTimeout(() => setOutputKey(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setOutputKey('copied');
      setTimeout(() => setOutputKey(null), 2000);
    }
  };

  const tabs: { key: Mode; label: string }[] = [
    { key: 'url', label: t.modeUrl },
    { key: 'base64', label: t.modeBase64 },
    { key: 'html', label: t.modeHtml },
  ];

  const isRtl = resolvedLocale === 'ar';

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' dir={isRtl ? 'rtl' : 'ltr'}>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
              </div>
            </div>

            <div className='flex items-center justify-center mb-6'>
              <div className='inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-800'>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setMode(tab.key)}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-medium transition-all ${
                      mode === tab.key
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'url' && (
              <div className='flex items-center gap-3 mb-4'>
                <label className='inline-flex items-center gap-2 cursor-pointer select-none'>
                  <input
                    type='checkbox'
                    checked={safeChars}
                    onChange={(e) => setSafeChars(e.target.checked)}
                    className='w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500'
                  />
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t.safeChars}</span>
                </label>
              </div>
            )}

            <div className='flex flex-col lg:flex-row items-stretch gap-4'>
              <div className='flex-1 flex flex-col'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t.input}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className='w-full h-[300px] p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  placeholder={t.input}
                />
              </div>

              <div className='flex lg:flex-col items-center justify-center gap-2 lg:gap-3 py-2 lg:py-0'>
                <button
                  onClick={handleEncode}
                  className='w-full lg:w-auto px-4 py-3 rounded-lg btn-primary font-medium flex items-center justify-center gap-2 min-w-[100px]'
                >
                  {t.encode}
                </button>
                <button
                  onClick={handleDecode}
                  className='w-full lg:w-auto px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 min-w-[100px]'
                >
                  {t.decode}
                </button>
                <button
                  onClick={handleSwap}
                  className='w-full lg:w-auto px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 min-w-[100px]'
                  title={t.swap}
                >
                  <ArrowUpDown className='h-4 w-4' />
                  <span className='hidden sm:inline'>{t.swap}</span>
                </button>
                <button
                  onClick={handleClear}
                  className='w-full lg:w-auto px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 min-w-[100px]'
                  title={t.clear}
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='hidden sm:inline'>{t.clear}</span>
                </button>
              </div>

              <div className='flex-1 flex flex-col'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t.output}
                </label>
                <textarea
                  key={outputKey || 'output'}
                  value={output}
                  readOnly
                  className='w-full h-[300px] p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none'
                  placeholder={t.output}
                />
              </div>
            </div>

            <div className='mt-4'>
              <button
                onClick={handleCopy}
                disabled={!output}
                className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto sm:min-w-[140px]'
              >
                {outputKey === 'copied' ? (
                  <>
                    <Check className='h-4 w-4 sm:h-5 sm:w-5' />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className='h-4 w-4 sm:h-5 sm:w-5' />
                    {t.copy}
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>
              {mode === 'url' && (t.modeUrl)}
              {mode === 'base64' && (t.modeBase64)}
              {mode === 'html' && (t.modeHtml)}
            </h3>
            <ul className='space-y-3'>
              {mode === 'url' && [
                resolvedLocale === 'zh' ? '标准 Percent-Encoding (RFC 3986)' : mode === 'url' && resolvedLocale === 'en' ? 'Standard Percent-Encoding (RFC 3986)' : 'Encoding estándar',
                resolvedLocale === 'zh' ? '支持中文及多语言字符' : resolvedLocale === 'en' ? 'Supports Chinese & multilingual' : 'Soporta múltiples idiomas',
                resolvedLocale === 'zh' ? '可选：全部编码或保留安全字符' : resolvedLocale === 'en' ? 'Optional: Safe chars preserved' : 'Opcional: caracteres seguros',
                resolvedLocale === 'zh' ? '实时编码 / 解码' : resolvedLocale === 'en' ? 'Real-time encode / decode' : 'Codificar / decodificar',
              ].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0' />
                  {feature}
                </li>
              ))}
              {mode === 'base64' && [
                resolvedLocale === 'zh' ? '标准 Base64 编码 (RFC 4648)' : resolvedLocale === 'en' ? 'Standard Base64 (RFC 4648)' : 'Base64 estándar',
                resolvedLocale === 'zh' ? 'UTF-8 编码，完美支持中文' : resolvedLocale === 'en' ? 'UTF-8 for Chinese support' : 'UTF-8 para soporte chino',
                resolvedLocale === 'zh' ? '双向编码 / 解码' : resolvedLocale === 'en' ? 'Bidirectional encode/decode' : 'Bidireccional',
                resolvedLocale === 'zh' ? '本地处理，安全可靠' : resolvedLocale === 'en' ? 'Local processing, secure' : 'Procesamiento local',
              ].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0' />
                  {feature}
                </li>
              ))}
              {mode === 'html' && [
                resolvedLocale === 'zh' ? '5 种常用实体转义' : resolvedLocale === 'en' ? '5 common entity escapes' : '5 entidades comunes',
                resolvedLocale === 'zh' ? '支持数字实体 (&#123; / &#xAB;)' : resolvedLocale === 'en' ? 'Supports numeric entities' : 'Soporta entidades numéricas',
                resolvedLocale === 'zh' ? 'XSS 防护转义' : resolvedLocale === 'en' ? 'XSS protection escaping' : 'Protección XSS',
                resolvedLocale === 'zh' ? '本地处理，隐私安全' : resolvedLocale === 'en' ? 'Local, private & secure' : 'Local y seguro',
              ].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0' />
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
