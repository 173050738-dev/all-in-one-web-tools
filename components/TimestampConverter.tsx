'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Clock, ArrowRightLeft } from 'lucide-react';

interface TimestampConverterProps {
  locale?: string;
}

export default function TimestampConverter({ locale = 'zh' }: TimestampConverterProps) {
  const i18n: Record<string, Record<string, string>> = {
    zh: { title:"时间戳转换", subtitle:"Unix时间戳 ↔ 可读日期", nowBtn:"获取当前", inputHint:"请输入10位秒或13位毫秒时间戳", second:"秒 (s)", millisecond:"毫秒 (ms)", toDate:"转日期", dateInput:"日期时间", toTs:"转时间戳", localTz:"本地时区", utc:"UTC (世界时)", gmt8:"GMT+8", result:"转换结果", copy:"复制", copied:"已复制", iso:"ISO格式", format:"自定义格式" },
    en: { title:"Timestamp Converter", subtitle:"Unix timestamp ↔ readable date", nowBtn:"Now", inputHint:"Enter 10-digit sec or 13-digit ms timestamp", second:"Second (s)", millisecond:"Millisecond (ms)", toDate:"To Date", dateInput:"Date Time", toTs:"To Timestamp", localTz:"Local TZ", utc:"UTC", gmt8:"GMT+8", result:"Result", copy:"Copy", copied:"Copied", iso:"ISO Format", format:"Custom format" },
    hi: { title:"समय स्टाम्प कनवर्टर", subtitle:"Unix समय स्टाम्प ↔ दिनांक", nowBtn:"अभी", inputHint:"10 अंक सेकंड या 13 अंक मिलीसेकंड", second:"सेकंड (s)", millisecond:"मिलीसेकंड (ms)", toDate:"दिनांक", dateInput:"दिनांक समय", toTs:"समय स्टाम्प", localTz:"स्थानीय TZ", utc:"UTC", gmt8:"GMT+8", result:"परिणाम", copy:"कॉपी", copied:"कॉपी हुआ", iso:"ISO फॉर्मेट", format:"कस्टम फॉर्मेट" },
    fr: { title:"Convertisseur d'Horodatage", subtitle:"Horodatage Unix ↔ date lisible", nowBtn:"Maintenant", inputHint:"Entrez 10 chiffres s ou 13 ms", second:"Seconde (s)", millisecond:"Milliseconde (ms)", toDate:"Vers Date", dateInput:"Date/Heure", toTs:"Horodatage", localTz:"Fuseau local", utc:"UTC", gmt8:"GMT+8", result:"Résultat", copy:"Copier", copied:"Copié", iso:"Format ISO", format:"Format perso" },
    es: { title:"Convertidor de Marca de Tiempo", subtitle:"Marca Unix ↔ fecha legible", nowBtn:"Ahora", inputHint:"Introduce 10 dígitos s o 13 ms", second:"Segundo (s)", millisecond:"Milisegundo (ms)", toDate:"A Fecha", dateInput:"Fecha/Hora", toTs:"Marca de tiempo", localTz:"Zona local", utc:"UTC", gmt8:"GMT+8", result:"Resultado", copy:"Copiar", copied:"Copiado", iso:"Formato ISO", format:"Formato pers." },
    ar: { title:"محول الطابع الزمني", subtitle:"طابع زمني يونكس ↔ تاريخ مقروء", nowBtn:"الآن", inputHint:"أدخل 10 أرقام ثانية أو 13 مللي ثانية", second:"ثانية (s)", millisecond:"مللي ثانية (ms)", toDate:"إلى تاريخ", dateInput:"التاريخ والوقت", toTs:"الطابع الزمني", localTz:"المنطقة المحلية", utc:"UTC", gmt8:"GMT+8", result:"النتيجة", copy:"نسخ", copied:"تم النسخ", iso:"تنسيق ISO", format:"تنسيق مخصص" }
  };

  const dict = i18n[locale] || i18n.zh;
  const t = (key: string) => dict[key] ?? i18n.zh[key] ?? key;

  const [timestampInput, setTimestampInput] = useState<string>('');
  const [tsUnit, setTsUnit] = useState<'s' | 'ms'>('s');
  const [dateInput, setDateInput] = useState<string>('');
  const [timezone, setTimezone] = useState<'local' | 'utc' | 'gmt8'>('local');
  const [dateResults, setDateResults] = useState<{ label: string; value: string }[]>([]);
  const [tsResults, setTsResults] = useState<{ label: string; value: string }[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const getAdjustedDate = useCallback((date: Date, tz: 'local' | 'utc' | 'gmt8'): {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
    getHours: () => number;
    getMinutes: () => number;
    getSeconds: () => number;
    getDay: () => number;
    toLocaleString: () => string;
    toISOString: () => string;
    toUTCString: () => string;
  } => {
    if (tz === 'local') {
      return {
        getFullYear: () => date.getFullYear(),
        getMonth: () => date.getMonth(),
        getDate: () => date.getDate(),
        getHours: () => date.getHours(),
        getMinutes: () => date.getMinutes(),
        getSeconds: () => date.getSeconds(),
        getDay: () => date.getDay(),
        toLocaleString: () => date.toLocaleString(),
        toISOString: () => date.toISOString(),
        toUTCString: () => date.toUTCString(),
      };
    } else if (tz === 'utc') {
      return {
        getFullYear: () => date.getUTCFullYear(),
        getMonth: () => date.getUTCMonth(),
        getDate: () => date.getUTCDate(),
        getHours: () => date.getUTCHours(),
        getMinutes: () => date.getUTCMinutes(),
        getSeconds: () => date.getUTCSeconds(),
        getDay: () => date.getUTCDay(),
        toLocaleString: () => date.toLocaleString('en-US', { timeZone: 'UTC' }),
        toISOString: () => date.toISOString(),
        toUTCString: () => date.toUTCString(),
      };
    } else {
      const gmt8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return {
        getFullYear: () => gmt8Date.getUTCFullYear(),
        getMonth: () => gmt8Date.getUTCMonth(),
        getDate: () => gmt8Date.getUTCDate(),
        getHours: () => gmt8Date.getUTCHours(),
        getMinutes: () => gmt8Date.getUTCMinutes(),
        getSeconds: () => gmt8Date.getUTCSeconds(),
        getDay: () => gmt8Date.getUTCDay(),
        toLocaleString: () => gmt8Date.toLocaleString('en-US', { timeZone: 'UTC' }),
        toISOString: () => {
          const y = gmt8Date.getUTCFullYear();
          const m = pad(gmt8Date.getUTCMonth() + 1);
          const d = pad(gmt8Date.getUTCDate());
          const hh = pad(gmt8Date.getUTCHours());
          const mm = pad(gmt8Date.getUTCMinutes());
          const ss = pad(gmt8Date.getUTCSeconds());
          return `${y}-${m}-${d}T${hh}:${mm}:${ss}+08:00`;
        },
        toUTCString: () => gmt8Date.toUTCString().replace('GMT', 'GMT+0800'),
      };
    }
  }, []);

  const getWeekday = useCallback((day: number, loc: string): string => {
    const weekdays: Record<string, string[]> = {
      zh: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
      fr: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
      es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    };
    const list = weekdays[loc] || weekdays.zh;
    return list[day] || list[0];
  }, []);

  const getRelativeTime = useCallback((targetMs: number, loc: string): string => {
    const now = Date.now();
    const diff = now - targetMs;
    const absDiff = Math.abs(diff);
    const isPast = diff >= 0;

    const rel: Record<string, { justNow: string; mins: (n: number) => string; hours: (n: number) => string; days: (n: number) => string; future: string }> = {
      zh: { justNow: '刚刚', mins: (n) => `${n}分钟前`, hours: (n) => `${n}小时前`, days: (n) => `${n}天前`, future: '未来' },
      en: { justNow: 'just now', mins: (n) => `${n} min ago`, hours: (n) => `${n} hr ago`, days: (n) => `${n} days ago`, future: 'in future' },
      hi: { justNow: 'अभी', mins: (n) => `${n} मिनट पहले`, hours: (n) => `${n} घंटे पहले`, days: (n) => `${n} दिन पहले`, future: 'भविष्य में' },
      fr: { justNow: 'à l\'instant', mins: (n) => `il y a ${n} min`, hours: (n) => `il y a ${n} h`, days: (n) => `il y a ${n} j`, future: 'dans le futur' },
      es: { justNow: 'ahora mismo', mins: (n) => `hace ${n} min`, hours: (n) => `hace ${n} h`, days: (n) => `hace ${n} d`, future: 'en el futuro' },
      ar: { justNow: 'الآن', mins: (n) => `قبل ${n} دقيقة`, hours: (n) => `قبل ${n} ساعة`, days: (n) => `قبل ${n} يوم`, future: 'في المستقبل' },
    };
    const r = rel[loc] || rel.zh;

    if (!isPast) {
      const futureAbs = absDiff;
      if (futureAbs < 60000) return r.future;
      if (futureAbs < 3600000) return r.future + ` (${Math.floor(futureAbs / 60000)}m)`;
      if (futureAbs < 86400000) return r.future + ` (${Math.floor(futureAbs / 3600000)}h)`;
      return r.future + ` (${Math.floor(futureAbs / 86400000)}d)`;
    }

    if (absDiff < 60000) return r.justNow;
    if (absDiff < 3600000) return r.mins(Math.floor(absDiff / 60000));
    if (absDiff < 86400000) return r.hours(Math.floor(absDiff / 3600000));
    return r.days(Math.floor(absDiff / 86400000));
  }, []);

  const convertToDate = useCallback((input?: string) => {
    const value = input ?? timestampInput;
    if (!value || isNaN(Number(value))) {
      setDateResults([]);
      return;
    }
    const num = Number(value);
    const ms = tsUnit === 's' ? num * 1000 : num;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setDateResults([]);
      return;
    }

    const ad = getAdjustedDate(date, timezone);
    const y = ad.getFullYear();
    const m = pad(ad.getMonth() + 1);
    const d = pad(ad.getDate());
    const hh = pad(ad.getHours());
    const mm = pad(ad.getMinutes());
    const ss = pad(ad.getSeconds());

    const labels: Record<string, string[]> = {
      zh: ['日期时间 (本地)', '标准格式', 'ISO 8601', 'RFC 2822', '星期', '相对时间'],
      en: ['Date/Time', 'Standard Format', 'ISO 8601', 'RFC 2822', 'Weekday', 'Relative Time'],
      hi: ['दिनांक/समय', 'मानक फॉर्मेट', 'ISO 8601', 'RFC 2822', 'सप्ताह का दिन', 'सापेक्ष समय'],
      fr: ['Date/Heure', 'Format Standard', 'ISO 8601', 'RFC 2822', 'Jour', 'Temps Relatif'],
      es: ['Fecha/Hora', 'Formato Estándar', 'ISO 8601', 'RFC 2822', 'Día', 'Tiempo Relativo'],
      ar: ['التاريخ/الوقت', 'التنسيق القياسي', 'ISO 8601', 'RFC 2822', 'اليوم', 'الوقت النسبي'],
    };
    const l = labels[locale] || labels.zh;

    const results = [
      { label: l[0], value: ad.toLocaleString() },
      { label: l[1], value: `${y}-${m}-${d} ${hh}:${mm}:${ss}` },
      { label: l[2], value: ad.toISOString() },
      { label: l[3], value: ad.toUTCString() },
      { label: l[4], value: getWeekday(ad.getDay(), locale) },
      { label: l[5], value: getRelativeTime(ms, locale) },
    ];
    setDateResults(results);
  }, [timestampInput, tsUnit, timezone, locale, getAdjustedDate, getWeekday, getRelativeTime]);

  const handleNow = () => {
    const nowS = Math.floor(Date.now() / 1000).toString();
    setTimestampInput(nowS);
    setTsUnit('s');
    convertToDate(nowS);
  };

  const convertToTs = useCallback(() => {
    if (!dateInput) {
      setTsResults([]);
      return;
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setTsResults([]);
      return;
    }
    const tsSec = Math.floor(date.getTime() / 1000);
    const tsMs = date.getTime();

    const labels: Record<string, string[]> = {
      zh: ['秒时间戳', '毫秒时间戳', 'ISO格式'],
      en: ['Timestamp (s)', 'Timestamp (ms)', 'ISO Format'],
      hi: ['सेकंड स्टाम्प', 'मिलीसेकंड स्टाम्प', 'ISO फॉर्मेट'],
      fr: ['Horodatage (s)', 'Horodatage (ms)', 'Format ISO'],
      es: ['Marca (s)', 'Marca (ms)', 'Formato ISO'],
      ar: ['الطابع الزمني (ث)', 'الطابع الزمني (ملث)', 'تنسيق ISO'],
    };
    const l = labels[locale] || labels.zh;

    setTsResults([
      { label: l[0], value: tsSec.toString() },
      { label: l[1], value: tsMs.toString() },
      { label: l[2], value: date.toISOString() },
    ]);
  }, [dateInput, locale]);

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('title')}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('toDate')}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  placeholder={t('inputHint')}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors font-mono text-sm"
                />
                <button
                  onClick={handleNow}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-colors text-sm whitespace-nowrap border border-gray-200 dark:border-gray-700"
                >
                  <Clock className="h-4 w-4" />
                  {t('nowBtn')}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                <button
                  onClick={() => setTsUnit('s')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    tsUnit === 's'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {t('second')}
                </button>
                <button
                  onClick={() => setTsUnit('ms')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    tsUnit === 'ms'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {t('millisecond')}
                </button>
              </div>

              <div className="flex items-center gap-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                <button
                  onClick={() => setTimezone('local')}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    timezone === 'local'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {t('localTz')}
                </button>
                <button
                  onClick={() => setTimezone('utc')}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    timezone === 'utc'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {t('utc')}
                </button>
                <button
                  onClick={() => setTimezone('gmt8')}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    timezone === 'gmt8'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {t('gmt8')}
                </button>
              </div>

              <button
                onClick={() => convertToDate()}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors text-sm"
              >
                {t('toDate')}
              </button>
            </div>
          </div>

          {dateResults.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('result')}</p>
              <div className="space-y-2">
                {dateResults.map((r, i) => (
                  <div
                    key={`date-${i}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="w-32 sm:w-40 flex-shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {r.label}
                    </div>
                    <div className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 break-all select-all min-w-0">
                      {r.value}
                    </div>
                    <button
                      onClick={() => copyValue(`date-${i}`, r.value)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs font-medium"
                    >
                      {copiedKey === `date-${i}` ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey === `date-${i}` ? t('copied') : t('copy')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('toTs')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('dateInput')}</label>
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              onClick={convertToTs}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors text-sm"
            >
              {t('toTs')}
            </button>
          </div>

          {tsResults.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('result')}</p>
              <div className="space-y-2">
                {tsResults.map((r, i) => (
                  <div
                    key={`ts-${i}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="w-32 sm:w-40 flex-shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {r.label}
                    </div>
                    <div className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 break-all select-all min-w-0">
                      {r.value}
                    </div>
                    <button
                      onClick={() => copyValue(`ts-${i}`, r.value)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs font-medium"
                    >
                      {copiedKey === `ts-${i}` ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey === `ts-${i}` ? t('copied') : t('copy')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
