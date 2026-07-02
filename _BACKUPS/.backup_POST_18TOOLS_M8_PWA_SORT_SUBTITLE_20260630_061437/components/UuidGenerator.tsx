'use client';

import { useState, useCallback, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface UuidGeneratorProps {
  locale?: string;
}

export default function UuidGenerator({ locale = 'zh' }: UuidGeneratorProps) {
  const i18n: Record<string, Record<string, string>> = {
    zh: { title:"UUID生成器", subtitle:"支持v1/v4/v7格式，本地生成", quantity:"生成数量", version:"版本", uppercase:"大写", noDashes:"去掉短横线", generate:"生成", copyAll:"复制全部", copySingle:"复制", copied:"已复制", formatV1:"版本1 (基于时间)", formatV4:"版本4 (纯随机)", formatV7:"版本7 (时间戳+随机)" },
    en: { title:"UUID Generator", subtitle:"Support v1/v4/v7, generate locally", quantity:"Quantity", version:"Version", uppercase:"Uppercase", noDashes:"Remove dashes", generate:"Generate", copyAll:"Copy All", copySingle:"Copy", copied:"Copied", formatV1:"Version 1 (Time-based)", formatV4:"Version 4 (Random)", formatV7:"Version 7 (Unix time + random)" },
    hi: { title:"UUID जनरेटर", subtitle:"v1/v4/v7 सपोर्ट, स्थानीय जनरेट", quantity:"मात्रा", version:"संस्करण", uppercase:"बड़े अक्षर", noDashes:"डैश हटाएं", generate:"बनाएं", copyAll:"सभी कॉपी", copySingle:"कॉपी", copied:"कॉपी हुआ", formatV1:"संस्करण 1 (समय पर आधारित)", formatV4:"संस्करण 4 (रैंडम)", formatV7:"संस्करण 7 (समय + रैंडम)" },
    fr: { title:"Générateur UUID", subtitle:"Support v1/v4/v7, génération locale", quantity:"Quantité", version:"Version", uppercase:"Majuscules", noDashes:"Enlever les tirets", generate:"Générer", copyAll:"Tout copier", copySingle:"Copier", copied:"Copié", formatV1:"Version 1 (Temporel)", formatV4:"Version 4 (Aléatoire)", formatV7:"Version 7 (Temps + aléatoire)" },
    es: { title:"Generador UUID", subtitle:"Soporte v1/v4/v7, generación local", quantity:"Cantidad", version:"Versión", uppercase:"Mayúsculas", noDashes:"Quitar guiones", generate:"Generar", copyAll:"Copiar todo", copySingle:"Copiar", copied:"Copiado", formatV1:"Versión 1 (Basada en tiempo)", formatV4:"Versión 4 (Aleatoria)", formatV7:"Versión 7 (Tiempo + aleatorio)" },
    ar: { title:"مولد UUID", subtitle:"يدعم v1/v4/v7، توليد محلي", quantity:"الكمية", version:"الإصدار", uppercase:"أحرف كبيرة", noDashes:"إزالة الشرطات", generate:"توليد", copyAll:"نسخ الكل", copySingle:"نسخ", copied:"تم النسخ", formatV1:"الإصدار 1 (يعتمد على الوقت)", formatV4:"الإصدار 4 (عشوائي)", formatV7:"الإصدار 7 (وقت + عشوائي)" }
  };

  const dict = i18n[locale] || i18n.zh;
  const t = (key: string) => dict[key] ?? i18n.zh[key] ?? key;

  const [count, setCount] = useState<number>(5);
  const [version, setVersion] = useState<'v1' | 'v4' | 'v7'>('v4');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [noDashes, setNoDashes] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<number | -1>(-1);

  const generateV4 = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const generateV1 = (): string => {
    const timestamp = Date.now();
    const timeHex = timestamp.toString(16).padStart(16, '0');
    const rand1 = crypto.getRandomValues(new Uint8Array(2));
    const rand1Hex = Array.from(rand1).map(b => b.toString(16).padStart(2, '0')).join('');
    const rand2 = crypto.getRandomValues(new Uint8Array(8));
    rand2[0] = (rand2[0] & 0x3f) | 0x80;
    const rand2Hex = Array.from(rand2).map(b => b.toString(16).padStart(2, '0')).join('');
    const timeLow = timeHex.slice(8, 16);
    const timeMid = timeHex.slice(4, 8);
    const timeHighAndVersion = ((parseInt(timeHex.slice(0, 4), 16) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    return `${timeLow}-${timeMid}-${timeHighAndVersion}-${rand1Hex}-${rand2Hex}`;
  };

  const generateV7 = (): string => {
    const timestamp = Date.now();
    const time48 = BigInt(timestamp) & 0xffffffffffffn;
    const timeHex = time48.toString(16).padStart(12, '0');
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    bytes[0] = (bytes[0] & 0x0f) | 0x70;
    bytes[2] = (bytes[2] & 0x3f) | 0x80;
    const randHex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-${randHex.slice(0, 4)}-${randHex.slice(4, 8)}-${randHex.slice(8)}`;
  };

  const processUuid = (uuid: string): string => {
    let result = uuid;
    if (noDashes) result = result.replace(/-/g, '');
    if (uppercase) result = result.toUpperCase();
    return result;
  };

  const generateAll = useCallback(() => {
    const genFn = version === 'v1' ? generateV1 : version === 'v7' ? generateV7 : generateV4;
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(processUuid(genFn()));
    }
    setUuids(newUuids);
    setCopiedId(-1);
  }, [version, count, uppercase, noDashes]);

  useEffect(() => {
    generateAll();
  }, [generateAll]);

  const copySingle = async (index: number) => {
    try {
      await navigator.clipboard.writeText(uuids[index]);
      setCopiedId(index);
      setTimeout(() => setCopiedId(-1), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = uuids[index];
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(index);
      setTimeout(() => setCopiedId(-1), 2000);
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopiedId(-2);
      setTimeout(() => setCopiedId(-1), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = uuids.join('\n');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(-2);
      setTimeout(() => setCopiedId(-1), 2000);
    }
  };

  const quantityOptions = [1, 5, 10, 20, 50];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('title')}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('quantity')}</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {quantityOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('version')}</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as 'v1' | 'v4' | 'v7')}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="v1">{t('formatV1')}</option>
              <option value="v4">{t('formatV4')}</option>
              <option value="v7">{t('formatV7')}</option>
            </select>
          </div>

          <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors sm:mt-6">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('uppercase')}</span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors sm:mt-6">
            <input
              type="checkbox"
              checked={noDashes}
              onChange={(e) => setNoDashes(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('noDashes')}</span>
          </label>
        </div>

        <button
          onClick={generateAll}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl text-white font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {t('generate')}
        </button>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{uuids.length} {t('quantity').toLowerCase()}</span>
            <button
              onClick={copyAll}
              disabled={uuids.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {copiedId === -2 ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copiedId === -2 ? t('copied') : t('copyAll')}
            </button>
          </div>

          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={`${uuid}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 break-all select-all min-w-0">
                  {uuid}
                </div>
                <button
                  onClick={() => copySingle(index)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs font-medium"
                >
                  {copiedId === index ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === index ? t('copied') : t('copySingle')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
