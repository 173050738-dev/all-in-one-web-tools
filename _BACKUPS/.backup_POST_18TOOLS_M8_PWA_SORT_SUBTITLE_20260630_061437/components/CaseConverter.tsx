'use client';

import { useState } from 'react';
import { Copy, Check, Trash2, ArrowDownUp } from 'lucide-react';

interface CaseConverterProps {
  locale?: string;
}

const i18n = {
  zh: { title:"大小写转换", subtitle:"一键切换多种命名格式", input:"输入文本", output:"转换结果", upper:"全大写 UPPER", lower:"全小写 lower", title:"标题首字母大写 Title Case", sentence:"句首大写 Sentence", camel:"小驼峰 camelCase", pascal:"大驼峰 PascalCase", snake:"下划线 snake_case", kebab:"短横线 kebab-case", constant:"全大写下划线 CONSTANT_CASE", capital:"每个单词首字母大写 Capitalize", copy:"复制", copied:"已复制", swap:"大小写互换 Swap", clear:"清空", stats:"统计：字符 {chars} / 单词 {words} / 行 {lines}" },
  en: { title:"Case Converter", subtitle:"One-click many naming formats", input:"Input Text", output:"Output", upper:"UPPER CASE", lower:"lower case", title:"Title Case", sentence:"Sentence case", camel:"camelCase", pascal:"PascalCase", snake:"snake_case", kebab:"kebab-case", constant:"CONSTANT_CASE", capital:"Capitalize", copy:"Copy", copied:"Copied", swap:"Swap Case", clear:"Clear", stats:"Stats: chars {chars} / words {words} / lines {lines}" },
  hi: { title:"केस कनवर्टर", subtitle:"एक क्लिक में कई फॉर्मेट", input:"टेक्स्ट डालें", output:"परिणाम", upper:"बड़े अक्षर", lower:"छोटे अक्षर", title:"शीर्षक केस", sentence:"वाक्य केस", camel:"camelCase", pascal:"PascalCase", snake:"snake_case", kebab:"kebab-case", constant:"CONSTANT_CASE", capital:"पहला अक्षर बड़ा", copy:"कॉपी", copied:"कॉपी हुआ", swap:"अदला-बदली", clear:"साफ़ करें", stats:"अक्षर {chars} / शब्द {words} / लाइन {lines}" },
  fr: { title:"Convertisseur de Casse", subtitle:"Plusieurs formats en un clic", input:"Texte", output:"Résultat", upper:"MAJUSCULES", lower:"minuscules", title:"Titre", sentence:"Phrase", camel:"camelCase", pascal:"PascalCase", snake:"snake_case", kebab:"kebab-case", constant:"CONSTANTE", capital:"Première lettre", copy:"Copier", copied:"Copié", swap:"Inverser", clear:"Effacer", stats:"Caractères {chars} / mots {words} / lignes {lines}" },
  es: { title:"Convertidor de Mayúsculas", subtitle:"Muchos formatos en un clic", input:"Texto", output:"Resultado", upper:"MAYÚSCULAS", lower:"minúsculas", title:"Título", sentence:"Frase", camel:"camelCase", pascal:"PascalCase", snake:"snake_case", kebab:"kebab-case", constant:"CONSTANTES", capital:"Primera letra", copy:"Copiar", copied:"Copiado", swap:"Intercambiar", clear:"Limpiar", stats:"Caracteres {chars} / palabras {words} / líneas {lines}" },
  ar: { title:"محول حالة الأحرف", subtitle:"صيغ عديدة بنقرة واحدة", input:"النص", output:"النتيجة", upper:"كبيرة", lower:"صغيرة", title:"عنوان", sentence:"جملة", camel:"camelCase", pascal:"PascalCase", snake:"snake_case", kebab:"kebab-case", constant:"ثابتة", capital:"الحرف الأول كبير", copy:"نسخ", copied:"تم النسخ", swap:"تبديل", clear:"مسح", stats:"حروف {chars} / كلمات {words} / أسطر {lines}" }
};

const VALID_LOCALES = Object.keys(i18n) as (keyof typeof i18n)[];

function toTitleCase(s: string): string {
  return s.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function toSentenceCase(s: string): string {
  if (!s) return s;
  let result = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  result = result.replace(/([.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  return result;
}

function toCamelCase(s: string): string {
  const words = s.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return '';
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

function toPascalCase(s: string): string {
  const words = s.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return '';
  return words
    .map((w) => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

function toSnakeCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

function toKebabCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toConstantCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase();
}

function toCapitalize(s: string): string {
  return s.replace(/[a-zA-Z0-9]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function swapCase(s: string): string {
  return s.replace(/[a-zA-Z]/g, (c) => {
    if (c === c.toUpperCase()) return c.toLowerCase();
    return c.toUpperCase();
  });
}

export default function CaseConverter({ locale = 'zh' }: CaseConverterProps) {
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

  const [input, setInput] = useState('Hello World case converter Example_text');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const chars = input.length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const lines = input.split('\n').length;

  const results: { key: string; label: string; value: string }[] = [
    { key: 'upper', label: t('upper'), value: input.toUpperCase() },
    { key: 'lower', label: t('lower'), value: input.toLowerCase() },
    { key: 'title', label: t('title'), value: toTitleCase(input) },
    { key: 'sentence', label: t('sentence'), value: toSentenceCase(input) },
    { key: 'camel', label: t('camel'), value: toCamelCase(input) },
    { key: 'pascal', label: t('pascal'), value: toPascalCase(input) },
    { key: 'snake', label: t('snake'), value: toSnakeCase(input) },
    { key: 'kebab', label: t('kebab'), value: toKebabCase(input) },
    { key: 'constant', label: t('constant'), value: toConstantCase(input) },
    { key: 'capital', label: t('capital'), value: toCapitalize(input) },
  ];

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setLastAction('copy-' + key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setLastAction('copy-' + key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setLastAction('clear');
  };

  const handleSwap = () => {
    setInput(swapCase(input));
    setLastAction('swap');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
            <ArrowDownUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('input')}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-mono text-sm sm:text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('input')}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('clear')}
                </button>
                <button
                  onClick={handleSwap}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <ArrowDownUp className="h-4 w-4" />
                  {t('swap')}
                </button>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {t('stats', { chars, words, lines })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('output')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {results.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {item.label}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.value, item.key)}
                      disabled={!item.value}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium flex-shrink-0"
                    >
                      {copiedKey === item.key ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" />
                          {t('copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          {t('copy')}
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={item.value}
                    readOnly
                    rows={3}
                    className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm resize-none focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
