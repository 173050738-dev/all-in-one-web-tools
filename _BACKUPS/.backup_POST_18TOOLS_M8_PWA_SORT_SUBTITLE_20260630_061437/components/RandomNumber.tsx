'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Dices,
  Copy,
  Check,
  RefreshCw,
  Download,
  AlertCircle,
} from 'lucide-react';

interface RandomNumberProps {
  locale?: string;
}

export default function RandomNumber({ locale = 'zh' }: RandomNumberProps) {
  const i18n = {
    zh: { title: '随机数生成器', subtitle: '自定义范围，批量不重复', min: '最小值', max: '最大值', count: '生成数量', unique: '不重复（不能重复）', decimal: '小数位数（0=整数）', sort: '排序结果', sortNone: '不排序', sortAsc: '升序', sortDesc: '降序', generate: '生成', again: '重新生成', copy: '复制', copied: '已复制', download: '下载 TXT', errorMinMax: '最小值必须小于最大值', errorRangeTooBig: '范围太小不足以生成不重复数字', seed: '示例结果', rangeTip: '范围提示：{count}个数在 [{min},{max}]' },
    en: { title: 'Random Number Generator', subtitle: 'Custom range, batch unique', min: 'Min', max: 'Max', count: 'Count', unique: 'Unique', decimal: 'Decimal places (0=integer)', sort: 'Sort results', sortNone: 'None', sortAsc: 'Ascending', sortDesc: 'Descending', generate: 'Generate', again: 'Regenerate', copy: 'Copy', copied: 'Copied', download: 'Download TXT', errorMinMax: 'Min must be smaller than Max', errorRangeTooBig: 'Range too small for unique count', seed: 'Sample results', rangeTip: 'Range: {count} numbers in [{min},{max}]' },
    hi: { title: 'रैंडम नंबर जनरेटर', subtitle: 'कस्टम रेंज, बैच में अनोखे', min: 'न्यून', max: 'अधिक', count: 'गिनती', unique: 'अनोखे', decimal: 'दशमलव स्थान (0=पूर्णांक)', sort: 'क्रमबद्ध', sortNone: 'नहीं', sortAsc: 'बढ़ता', sortDesc: 'घटता', generate: 'बनाएं', again: 'फिर से', copy: 'कॉपी', copied: 'कॉपी हुआ', download: 'TXT डाउनलोड', errorMinMax: 'न्यून < अधिक', errorRangeTooBig: 'रेंज छोटी है', seed: 'सैंपल परिणाम', rangeTip: 'रेंज: {count} संख्या [{min},{max}]' },
    fr: { title: 'Générateur Aléatoire', subtitle: 'Plage perso, lots uniques', min: 'Min', max: 'Max', count: 'Nb', unique: 'Unique', decimal: 'Décimales (0=entier)', sort: 'Tri', sortNone: 'Aucun', sortAsc: 'Croiss.', sortDesc: 'Décroiss.', generate: 'Générer', again: 'Régénérer', copy: 'Copier', copied: 'Copié', download: 'Télécharger', errorMinMax: 'Min < Max requis', errorRangeTooBig: 'Plage trop petite', seed: 'Exemple', rangeTip: '{count} nombres dans [{min},{max}]' },
    es: { title: 'Generador Aleatorio', subtitle: 'Rango personalizado, únicos', min: 'Mín', max: 'Máx', count: 'Cantidad', unique: 'Únicos', decimal: 'Decimales (0=entero)', sort: 'Orden', sortNone: 'Ninguno', sortAsc: 'Ascend.', sortDesc: 'Descend.', generate: 'Generar', again: 'Regenerar', copy: 'Copiar', copied: 'Copiado', download: 'Descargar', errorMinMax: 'Mín < Máx requerido', errorRangeTooBig: 'Rango muy pequeño', seed: 'Ejemplo', rangeTip: '{count} números en [{min},{max}]' },
    ar: { title: 'مولد أرقام عشوائية', subtitle: 'نطاق مخصص، أرقام فريدة', min: 'الأدنى', max: 'الأعلى', count: 'العدد', unique: 'فريدة', decimal: 'الكسور العشرية (0=صحيح)', sort: 'الترتيب', sortNone: 'بدون', sortAsc: 'تصاعدي', sortDesc: 'تنازلي', generate: 'توليد', again: 'إعادة', copy: 'نسخ', copied: 'تم النسخ', download: 'تحميل', errorMinMax: 'الأدنى يجب أن يكون أقل من الأعلى', errorRangeTooBig: 'النطاق صغير جدًا', seed: 'نتائج عينة', rangeTip: '{count} أرقام في [{min},{max}]' },
  };

  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('6');
  const [unique, setUnique] = useState(true);
  const [decimal, setDecimal] = useState(0);
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [results, setResults] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getT = (loc: string) => {
    const dict = i18n[loc as keyof typeof i18n] || i18n.zh;
    return (key: keyof typeof dict, vars?: Record<string, string | number>) => {
      let str = (dict[key] ?? i18n.zh[key]) as string;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };
  const t = getT(locale);

  const generateNumbers = useCallback(() => {
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    const countNum = parseInt(count);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum) || countNum <= 0) {
      setErrorMsg(null);
      setResults([]);
      return;
    }

    if (!(maxNum > minNum)) {
      setErrorMsg(t('errorMinMax'));
      setResults([]);
      return;
    }

    const nums: number[] = [];

    if (decimal === 0) {
      const minInt = Math.ceil(minNum);
      const maxInt = Math.floor(maxNum);
      const range = maxInt - minInt + 1;

      if (unique) {
        if (range < countNum) {
          setErrorMsg(t('errorRangeTooBig'));
          setResults([]);
          return;
        }
        const set = new Set<number>();
        while (set.size < countNum) {
          const n = Math.floor(Math.random() * range) + minInt;
          set.add(n);
        }
        nums.push(...set);
      } else {
        for (let i = 0; i < countNum; i++) {
          nums.push(Math.floor(Math.random() * range) + minInt);
        }
      }
    } else {
      if (unique) {
        const set = new Set<number>();
        let attempts = 0;
        while (set.size < countNum && attempts < 5000) {
          const raw = Math.random() * (maxNum - minNum) + minNum;
          const n = parseFloat(raw.toFixed(decimal));
          if (n >= minNum && n <= maxNum) {
            set.add(n);
          }
          attempts++;
        }
        if (set.size < countNum) {
          setErrorMsg(t('errorRangeTooBig'));
          setResults([]);
          return;
        }
        nums.push(...set);
      } else {
        for (let i = 0; i < countNum; i++) {
          const raw = Math.random() * (maxNum - minNum) + minNum;
          nums.push(parseFloat(raw.toFixed(decimal)));
        }
      }
    }

    if (sort === 'asc') nums.sort((a, b) => a - b);
    else if (sort === 'desc') nums.sort((a, b) => b - a);

    setErrorMsg(null);
    setResults(nums);
    setCopied(false);
  }, [min, max, count, unique, decimal, sort, t]);

  useEffect(() => {
    generateNumbers();
  }, []);

  const copyToClipboard = async () => {
    if (results.length === 0) return;
    const text = results.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadTxt = () => {
    if (results.length === 0) return;
    const text = results.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'random-numbers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatNum = (n: number) => {
    if (decimal === 0) return String(n);
    return n.toFixed(decimal);
  };

  const countNum = parseInt(count) || 0;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'>
                <Dices className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('min')}</label>
                  <input
                    type='number'
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className='w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('max')}</label>
                  <input
                    type='number'
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className='w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('count')}</label>
                  <input
                    type='number'
                    min='1'
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className='w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('decimal')}</label>
                  <select
                    value={decimal}
                    onChange={(e) => setDecimal(parseInt(e.target.value))}
                    className='w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t('sort')}</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'none' | 'asc' | 'desc')}
                    className='w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                  >
                    <option value='none'>{t('sortNone')}</option>
                    <option value='asc'>{t('sortAsc')}</option>
                    <option value='desc'>{t('sortDesc')}</option>
                  </select>
                </div>
                <div className='flex items-end'>
                  <label className='flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
                    <input
                      type='checkbox'
                      checked={unique}
                      onChange={(e) => setUnique(e.target.checked)}
                      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('unique')}</span>
                  </label>
                </div>
              </div>

              <div className='p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-blue-700 dark:text-blue-300'>
                  {t('rangeTip', { count: countNum, min, max })}
                </p>
              </div>

              {errorMsg && (
                <div className='flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'>
                  <AlertCircle className='h-5 w-5 flex-shrink-0 mt-0.5' />
                  <span className='text-sm'>{errorMsg}</span>
                </div>
              )}

              <button
                onClick={generateNumbers}
                className='w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg btn-primary font-medium text-base'
              >
                <Dices className='h-5 w-5' />
                {t('generate')}
              </button>

              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    {results.length > 0 ? t('seed') : t('seed')}
                  </h3>
                  <span className='text-xs text-gray-400'>{results.length}</span>
                </div>

                {results.length > 0 && results.length <= 12 ? (
                  <div className='flex flex-wrap gap-2'>
                    {results.map((n, i) => (
                      <span
                        key={i}
                        className='bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full px-4 py-2 font-mono text-sm'
                      >
                        {formatNum(n)}
                      </span>
                    ))}
                  </div>
                ) : results.length > 12 ? (
                  <textarea
                    readOnly
                    value={results.map(formatNum).join('\n')}
                    rows={Math.min(results.length, 15)}
                    className='w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none'
                  />
                ) : null}
              </div>

              <div className='grid grid-cols-3 gap-3 pt-2'>
                <button
                  onClick={generateNumbers}
                  disabled={results.length === 0}
                  className='flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm'
                >
                  <RefreshCw className='h-4 w-4' />
                  <span className='hidden sm:inline'>{t('again')}</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={results.length === 0}
                  className='flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm'
                >
                  {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  <span className='hidden sm:inline'>{copied ? t('copied') : t('copy')}</span>
                </button>
                <button
                  onClick={downloadTxt}
                  disabled={results.length === 0}
                  className='flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm'
                >
                  <Download className='h-4 w-4' />
                  <span className='hidden sm:inline'>{t('download')}</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('title')}</h3>
            <ul className='space-y-3'>
              {[
                t('subtitle'),
                t('rangeTip', { count: countNum, min, max }),
              ].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0' />
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
