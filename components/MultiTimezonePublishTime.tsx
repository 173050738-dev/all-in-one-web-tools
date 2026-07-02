'use client';

import { useState, useMemo } from 'react';
import { Globe2, Clock, Copy, Check, Sun, Moon } from 'lucide-react';

interface MultiTimezonePublishTimeProps {
  locale?: string;
}

type TimezoneEntry = {
  id: string;
  iana: string;
  cityKey: string;
  region: 'na' | 'eu' | 'asia' | 'oceania' | 'me';
};

const TIMEZONES: TimezoneEntry[] = [
  { id: 'pst',  iana: 'America/Los_Angeles', cityKey: 'tz.la',    region: 'na' },
  { id: 'est',  iana: 'America/New_York',    cityKey: 'tz.nyc',   region: 'na' },
  { id: 'london', iana: 'Europe/London',     cityKey: 'tz.london', region: 'eu' },
  { id: 'paris',  iana: 'Europe/Paris',      cityKey: 'tz.paris',  region: 'eu' },
  { id: 'moscow', iana: 'Europe/Moscow',     cityKey: 'tz.moscow', region: 'eu' },
  { id: 'dubai',  iana: 'Asia/Dubai',        cityKey: 'tz.dubai',  region: 'me' },
  { id: 'delhi',  iana: 'Asia/Kolkata',      cityKey: 'tz.delhi',  region: 'asia' },
  { id: 'beijing',iana: 'Asia/Shanghai',     cityKey: 'tz.beijing',region: 'asia' },
  { id: 'seoul',  iana: 'Asia/Seoul',        cityKey: 'tz.seoul',  region: 'asia' },
  { id: 'tokyo',  iana: 'Asia/Tokyo',        cityKey: 'tz.tokyo',  region: 'asia' },
  { id: 'sydney', iana: 'Australia/Sydney',  cityKey: 'tz.sydney', region: 'oceania' },
];

const ACTIVE_HOUR_RANGES = [
  { start: 9,  end: 12, label: 'peak.morning' },
  { start: 18, end: 23, label: 'peak.evening' },
];

export default function MultiTimezonePublishTime({ locale = 'zh' }: MultiTimezonePublishTimeProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'title': '多时区发布时间计算器',
      'subtitle': '跨境、海外自媒体必备 — 输入本地时间一键换算全球 11 个主要城市，识别夏令时，可视化粉丝活跃时段。',
      'tip': '💡 提示：选择你本地的目标发布时间（默认当前时间），下方卡片自动换算各时区对应时间。绿色高亮表示该城市处于粉丝活跃时段（上午 9–12 点、晚上 6–11 点），方便你选出覆盖最多受众的发布窗口。',
      'features': '功能特点',
      'f1': '11 个主要城市覆盖：美西/美东/伦敦/巴黎/莫斯科/迪拜/新德里/北京/首尔/东京/悉尼',
      'f2': '自动识别夏令时(DST)，无需手动加减时间',
      'f3': '可视化粉丝活跃时段（早高峰 & 晚高峰）高亮',
      'f4': '一键复制单条或全部时区换算结果',
      'f5': '纯浏览器端计算，100% 隐私安全，不依赖网络',
      'f6': '完全免费、无次数限制、支持中文/英文/法语等 6 种语言',
      'pick.local': '选择目标发布时间（本地时区）',
      'or.use.now': '或使用当前时间',
      'now': '当前时间',
      'local.time': '本地时间',
      'copy.single': '复制',
      'copy.all': '复制全部结果',
      'copied': '已复制',
      'active.window': '粉丝活跃窗口',
      'na': '北美',
      'eu': '欧洲',
      'me': '中东',
      'asia': '亚洲',
      'oceania': '大洋洲',
      'peak.morning': '早高峰',
      'peak.evening': '晚高峰',
      'tz.la': '洛杉矶 (美西 PST/PDT)',
      'tz.nyc': '纽约 (美东 EST/EDT)',
      'tz.london': '伦敦 (GMT/BST)',
      'tz.paris': '巴黎 (CET/CEST)',
      'tz.moscow': '莫斯科 (MSK)',
      'tz.dubai': '迪拜 (GST)',
      'tz.delhi': '新德里 (IST)',
      'tz.beijing': '北京/上海 (CST)',
      'tz.seoul': '首尔 (KST)',
      'tz.tokyo': '东京 (JST)',
      'tz.sydney': '悉尼 (AEST/AEDT)',
      'dst.on': '夏令时',
      'dst.off': '标准时间',
      'date': '日期',
      'time': '时间',
    },
    en: {
      'title': 'Multi-Timezone Publish Time Calculator',
      'subtitle': 'For cross-border creators & global marketers — pick your local time, instantly see when it lands in 11 major cities with DST-aware conversion and active-hour highlights.',
      'tip': '💡 Tip: Choose your target publish time in your local timezone. The cards below auto-update. Green highlights mark peak fan-active windows (9am–12pm & 6pm–11pm local), helping you pick the slot that reaches the most audiences.',
      'features': 'Features',
      'f1': '11 key cities: LA, NYC, London, Paris, Moscow, Dubai, New Delhi, Beijing, Seoul, Tokyo, Sydney',
      'f2': 'Automatic Daylight Saving Time (DST) detection — no manual math',
      'f3': 'Visual peak-hours highlighting (morning + evening windows)',
      'f4': 'One-click copy for single city or all results',
      'f5': 'Runs 100% locally in your browser, private & offline-capable',
      'f6': 'Completely free, unlimited use, 6-language UI',
      'pick.local': 'Pick target publish time (your local TZ)',
      'or.use.now': 'Or use right now',
      'now': 'Now',
      'local.time': 'Local Time',
      'copy.single': 'Copy',
      'copy.all': 'Copy All',
      'copied': 'Copied',
      'active.window': 'Active Window',
      'na': 'North America',
      'eu': 'Europe',
      'me': 'Middle East',
      'asia': 'Asia',
      'oceania': 'Oceania',
      'peak.morning': 'Morning peak',
      'peak.evening': 'Evening peak',
      'tz.la': 'Los Angeles (PST/PDT)',
      'tz.nyc': 'New York (EST/EDT)',
      'tz.london': 'London (GMT/BST)',
      'tz.paris': 'Paris (CET/CEST)',
      'tz.moscow': 'Moscow (MSK)',
      'tz.dubai': 'Dubai (GST)',
      'tz.delhi': 'New Delhi (IST)',
      'tz.beijing': 'Beijing / Shanghai (CST)',
      'tz.seoul': 'Seoul (KST)',
      'tz.tokyo': 'Tokyo (JST)',
      'tz.sydney': 'Sydney (AEST/AEDT)',
      'dst.on': 'DST',
      'dst.off': 'Standard',
      'date': 'Date',
      'time': 'Time',
    },
    fr: {
      'title': 'Calculateur d\'Heure de Publication Multi-Fuseaux',
      'subtitle': 'Pour créateurs transfrontaliers & marketeurs mondiaux — choisissez une heure locale, obtenez-la instantanément dans 11 grandes villes avec décalage DST et surlignage des heures actives.',
      'tip': '💡 Astuce : Choisissez l\'heure de publication cible dans votre fuseau. Les cartes se mettent à jour. Le vert indique les fenêtres d\'audience actives (9h–12h & 18h–23h locales).',
      'features': 'Fonctionnalités',
      'f1': '11 villes clés : LA, NYC, Londres, Paris, Moscou, Dubaï, New Delhi, Pékin, Séoul, Tokyo, Sydney',
      'f2': 'Détection automatique de l\'heure d\'été (DST)',
      'f3': 'Surlignage visuel des pics d\'audience matin & soir',
      'f4': 'Copie en un clic pour une ville ou tous les résultats',
      'f5': 'Calcul 100% local dans le navigateur, privé & hors-ligne',
      'f6': 'Gratuit, illimité, interface en 6 langues',
      'pick.local': 'Heure de publication cible (votre fuseau local)',
      'or.use.now': 'Ou utiliser maintenant',
      'now': 'Maintenant',
      'local.time': 'Heure Locale',
      'copy.single': 'Copier',
      'copy.all': 'Tout Copier',
      'copied': 'Copié',
      'active.window': 'Fenêtre Active',
      'na': 'Amérique du Nord',
      'eu': 'Europe',
      'me': 'Moyen-Orient',
      'asia': 'Asie',
      'oceania': 'Océanie',
      'peak.morning': 'Pic matin',
      'peak.evening': 'Pic soir',
      'tz.la': 'Los Angeles (PST/PDT)',
      'tz.nyc': 'New York (EST/EDT)',
      'tz.london': 'Londres (GMT/BST)',
      'tz.paris': 'Paris (CET/CEST)',
      'tz.moscow': 'Moscou (MSK)',
      'tz.dubai': 'Dubaï (GST)',
      'tz.delhi': 'New Delhi (IST)',
      'tz.beijing': 'Pékin / Shanghai (CST)',
      'tz.seoul': 'Séoul (KST)',
      'tz.tokyo': 'Tokyo (JST)',
      'tz.sydney': 'Sydney (AEST/AEDT)',
      'dst.on': 'HE',
      'dst.off': 'Normale',
      'date': 'Date',
      'time': 'Heure',
    },
    es: {
      'title': 'Calculadora de Hora de Publicación Multi-Zona',
      'subtitle': 'Para creadores transfronterizos y marketers globales — elige una hora local y obtén la equivalencia en 11 ciudades con detección DST y resaltado de horas activas.',
      'tip': '💡 Consejo: Elige la hora de publicación en tu zona horaria. Las tarjetas se actualizan solas. El verde marca las ventanas de audiencia activa (9–12h y 18–23h locales).',
      'features': 'Características',
      'f1': '11 ciudades clave: LA, NYC, Londres, París, Moscú, Dubái, Nueva Delhi, Pekín, Seúl, Tokio, Sídney',
      'f2': 'Detección automática del horario de verano (DST)',
      'f3': 'Resaltado visual de los picos de audiencia mañana y noche',
      'f4': 'Copiar en un clic para una ciudad o todos los resultados',
      'f5': 'Cálculo 100% local en el navegador, privado y sin red',
      'f6': 'Gratis, ilimitado, interfaz en 6 idiomas',
      'pick.local': 'Hora de publicación objetivo (su zona local)',
      'or.use.now': 'O usar ahora mismo',
      'now': 'Ahora',
      'local.time': 'Hora Local',
      'copy.single': 'Copiar',
      'copy.all': 'Copiar Todo',
      'copied': 'Copiado',
      'active.window': 'Ventana Activa',
      'na': 'Norteamérica',
      'eu': 'Europa',
      'me': 'Medio Oriente',
      'asia': 'Asia',
      'oceania': 'Oceanía',
      'peak.morning': 'Pico mañana',
      'peak.evening': 'Pico noche',
      'tz.la': 'Los Ángeles (PST/PDT)',
      'tz.nyc': 'Nueva York (EST/EDT)',
      'tz.london': 'Londres (GMT/BST)',
      'tz.paris': 'París (CET/CEST)',
      'tz.moscow': 'Moscú (MSK)',
      'tz.dubai': 'Dubái (GST)',
      'tz.delhi': 'Nueva Delhi (IST)',
      'tz.beijing': 'Pekín / Shanghái (CST)',
      'tz.seoul': 'Seúl (KST)',
      'tz.tokyo': 'Tokio (JST)',
      'tz.sydney': 'Sídney (AEST/AEDT)',
      'dst.on': 'Verano',
      'dst.off': 'Estándar',
      'date': 'Fecha',
      'time': 'Hora',
    },
    hi: {
      'title': 'मल्टी-टाइमज़ोन प्रकाशन समय कैलकुलेटर',
      'subtitle': 'क्रॉस-बॉर्डर क्रिएटर्स और वैश्विक मार्केटर्स के लिए — अपने स्थानीय समय को चुनें, तुरंत 11 प्रमुख शहरों में DST के साथ कन्वर्ट करें।',
      'tip': '💡 सुझाव: अपने लक्षित प्रकाशन समय को चुनें। कार्ड स्वयं अपडेट होंगे। हरा दर्शाता है शीर्ष दर्शक-सक्रिय विंडो (9–12 बजे और 18–23 बजे)।',
      'features': 'विशेषताएं',
      'f1': '11 महत्वपूर्ण शहर: LA, NYC, लंदन, पेरिस, मॉस्को, दुबई, नई दिल्ली, बीजिंग, सियोल, टोक्यो, सिडनी',
      'f2': 'स्वचालित डेलाइट सेविंग टाइम (DST) पहचान',
      'f3': 'शीर्ष घंटों का विजुअल हाइलाइट (सुबह + शाम विंडो)',
      'f4': 'एक क्लिक में कॉपी (एक शहर या सभी परिणाम)',
      'f5': '100% स्थानीय रूप से ब्राउज़र में, गोपनीय & ऑफलाइन',
      'f6': 'बिल्कुल मुफ्त, असीमित उपयोग, 6 भाषाएं',
      'pick.local': 'लक्षित प्रकाशन समय चुनें (आपका स्थानीय TZ)',
      'or.use.now': 'या अभी का समय उपयोग करें',
      'now': 'अभी',
      'local.time': 'स्थानीय समय',
      'copy.single': 'कॉपी',
      'copy.all': 'सभी कॉपी करें',
      'copied': 'कॉपी हो गया',
      'active.window': 'सक्रिय विंडो',
      'na': 'उत्तरी अमेरिका',
      'eu': 'यूरोप',
      'me': 'मध्य पूर्व',
      'asia': 'एशिया',
      'oceania': 'ओशनिया',
      'peak.morning': 'सुबह शीर्ष',
      'peak.evening': 'शाम शीर्ष',
      'tz.la': 'लॉस एंजिल्स (PST/PDT)',
      'tz.nyc': 'न्यूयॉर्क (EST/EDT)',
      'tz.london': 'लंदन (GMT/BST)',
      'tz.paris': 'पेरिस (CET/CEST)',
      'tz.moscow': 'मॉस्को (MSK)',
      'tz.dubai': 'दुबई (GST)',
      'tz.delhi': 'नई दिल्ली (IST)',
      'tz.beijing': 'बीजिंग / शंघाई (CST)',
      'tz.seoul': 'सियोल (KST)',
      'tz.tokyo': 'टोक्यो (JST)',
      'tz.sydney': 'सिडनी (AEST/AEDT)',
      'dst.on': 'DST',
      'dst.off': 'मानक',
      'date': 'तारीख',
      'time': 'समय',
    },
    ar: {
      'title': 'حاسبة وقت النشر متعدد المناطق الزمنية',
      'subtitle': 'للمنشئين عبر الحدود والمسوقين العالميين — اختر وقتك المحلي، واحصل على المكافئ فوراً في 11 مدينة رئيسية مع اكتشاف التوقيت الصيفي وتظليل ساعات النشاط.',
      'tip': '💡 نصيحة: اختر وقت النشر المستهدف في منطقتك الزمنية. البطاقات تتحدث تلقائياً. اللون الأخضر يرمز إلى نوافذ نشاط الجمهور (9–12 صباحاً و 6–11 مساءً).',
      'features': 'الميزات',
      'f1': '11 مدينة رئيسية: لوس أنجلوس، نيويورك، لندن، باريس، موسكو، دبي، نيودلهي، بكين، سيول، طوكيو، سيدني',
      'f2': 'اكتشاف تلقائي للتوقيت الصيفي (DST)',
      'f3': 'تظليل بصري لساعات الذروة صباحاً ومساءً',
      'f4': 'نسخ بنقرة واحدة لمدينة واحدة أو كل النتائج',
      'f5': 'يعمل 100% محلياً في المتصفح، خاص وبدون اتصال',
      'f6': 'مجاني تماماً، استخدام غير محدود، واجهة بـ 6 لغات',
      'pick.local': 'اختر وقت النشر المستهدف (منطقتك الزمنية)',
      'or.use.now': 'أو استخدم الوقت الحالي',
      'now': 'الآن',
      'local.time': 'الوقت المحلي',
      'copy.single': 'نسخ',
      'copy.all': 'نسخ الكل',
      'copied': 'تم النسخ',
      'active.window': 'نافذة نشطة',
      'na': 'أمريكا الشمالية',
      'eu': 'أوروبا',
      'me': 'الشرق الأوسط',
      'asia': 'آسيا',
      'oceania': 'أوقيانوسيا',
      'peak.morning': 'ذروة الصباح',
      'peak.evening': 'ذروة المساء',
      'tz.la': 'لوس أنجلوس (PST/PDT)',
      'tz.nyc': 'نيويورك (EST/EDT)',
      'tz.london': 'لندن (GMT/BST)',
      'tz.paris': 'باريس (CET/CEST)',
      'tz.moscow': 'موسكو (MSK)',
      'tz.dubai': 'دبي (GST)',
      'tz.delhi': 'نيودلهي (IST)',
      'tz.beijing': 'بكين / شنغهاي (CST)',
      'tz.seoul': 'سيول (KST)',
      'tz.tokyo': 'طوكيو (JST)',
      'tz.sydney': 'سيدني (AEST/AEDT)',
      'dst.on': 'صيفي',
      'dst.off': 'قياسي',
      'date': 'التاريخ',
      'time': 'الوقت',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };
  const t = getT(locale);
  const rtl = locale === 'ar';

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const toLocalInputValue = (d: Date) => {
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${y}-${m}-${day}T${hh}:${mm}`;
  };

  const [targetInput, setTargetInput] = useState<string>(toLocalInputValue(now));
  const [copyAllState, setCopyAllState] = useState<{ [k: string]: boolean }>({});
  const [allCopied, setAllCopied] = useState(false);

  const targetDate = useMemo(() => {
    const parsed = new Date(targetInput);
    return Number.isNaN(parsed.getTime()) ? now : parsed;
  }, [targetInput, now.getTime()]);

  const zoneResults = useMemo(() => {
    return TIMEZONES.map((tz) => {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.iana,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        const parts = fmt.formatToParts(targetDate);
        const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
        const year = +get('year');
        const month = +get('month');
        const day = +get('day');
        const hour = +get('hour');
        const minute = +get('minute');

        const jan = new Date(targetDate.getFullYear(), 0, 1);
        const jul = new Date(targetDate.getFullYear(), 6, 1);
        const stdOffset = (-(jan.getTimezoneOffset()) * 60 * 1000);
        const tzStd = new Date(jan.getTime() + stdOffset);
        const fmtJan = new Intl.DateTimeFormat('en-US', { timeZone: tz.iana, hour: '2-digit', hour12: false }).formatToParts(tzStd);
        const janHour = +(fmtJan.find((p) => p.type === 'hour')?.value ?? '00');
        const isDst = (() => {
          try {
            const test1 = new Date(Date.UTC(year, 0, 1, 12));
            const test2 = new Date(Date.UTC(year, 6, 1, 12));
            const fmt1 = new Intl.DateTimeFormat('en-US', { timeZone: tz.iana, hour: '2-digit', hour12: false }).formatToParts(test1);
            const fmt2 = new Intl.DateTimeFormat('en-US', { timeZone: tz.iana, hour: '2-digit', hour12: false }).formatToParts(test2);
            const h1 = +(fmt1.find((p) => p.type === 'hour')?.value ?? '00');
            const h2 = +(fmt2.find((p) => p.type === 'hour')?.value ?? '00');
            return h1 !== h2 ? (Math.abs(hour - ((h1 + 12) % 24)) > Math.abs(hour - ((h2 + 12) % 24)) ? false : true) : false;
          } catch {
            return false;
          }
        })();

        const activePeak = ACTIVE_HOUR_RANGES.find((r) => hour >= r.start && hour < r.end);
        return {
          tz,
          year, month, day, hour, minute,
          isDst,
          peakLabel: activePeak ? t(activePeak.label) : null,
          isActive: !!activePeak,
        };
      } catch {
        return {
          tz,
          year: targetDate.getFullYear(),
          month: targetDate.getMonth() + 1,
          day: targetDate.getDate(),
          hour: targetDate.getHours(),
          minute: targetDate.getMinutes(),
          isDst: false,
          peakLabel: null,
          isActive: false,
        };
      }
    });
  }, [targetDate, locale]);

  const groupedByRegion = useMemo(() => {
    const groups: Record<string, typeof zoneResults> = {};
    zoneResults.forEach((r) => {
      if (!groups[r.tz.region]) groups[r.tz.region] = [];
      groups[r.tz.region].push(r);
    });
    return groups;
  }, [zoneResults]);

  const setNow = () => {
    setTargetInput(toLocalInputValue(new Date()));
  };

  const copySingle = async (tzId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopyAllState((s) => ({ ...s, [tzId]: true }));
    setTimeout(() => {
      setCopyAllState((s) => ({ ...s, [tzId]: false }));
    }, 1600);
  };

  const copyAll = async () => {
    const lines = zoneResults.map((r) => {
      const dateStr = `${r.year}-${pad(r.month)}-${pad(r.day)}`;
      const timeStr = `${pad(r.hour)}:${pad(r.minute)}`;
      return `${t(r.tz.cityKey)}: ${dateStr} ${timeStr}`;
    });
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1600);
  };

  const localDateStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(targetDate.getDate())}`;
  const localTimeStr = `${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/25">
                <Globe2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('pick.local')}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="datetime-local"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="input-base flex-1 min-h-[44px] touch-manipulation text-base"
                  />
                  <button
                    type="button"
                    onClick={setNow}
                    className="px-4 py-2.5 min-h-[44px] rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <Clock className="h-4 w-4" />
                    {t('now')}
                  </button>
                </div>
                <div className="mt-3 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('local.time')}</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                      {localDateStr} · {localTimeStr}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                    <Sun className="h-3 w-3" />
                    {t('active.window')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyAll}
                  className="px-4 py-2 rounded-lg btn-primary flex items-center gap-2 text-sm font-medium min-h-[40px] touch-manipulation"
                >
                  {allCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {allCopied ? t('copied') : t('copy.all')}
                </button>
              </div>

              <div className="space-y-5">
                {(['na', 'eu', 'me', 'asia', 'oceania'] as const).map((region) => {
                  const items = groupedByRegion[region];
                  if (!items?.length) return null;
                  return (
                    <div key={region}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2">
                          {t(region)}
                        </span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {items.map((r) => {
                          const dateStr = `${r.year}-${pad(r.month)}-${pad(r.day)}`;
                          const timeStr = `${pad(r.hour)}:${pad(r.minute)}`;
                          const isNight = r.hour < 6 || r.hour >= 22;
                          const singleLine = `${t(r.tz.cityKey)}: ${dateStr} ${timeStr}`;
                          return (
                            <div
                              key={r.tz.id}
                              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                                r.isActive
                                  ? 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                      {t(r.tz.cityKey)}
                                    </span>
                                    <span
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                        r.isDst
                                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                      }`}
                                    >
                                      {r.isDst ? t('dst.on') : t('dst.off')}
                                    </span>
                                    {isNight && !r.isActive && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300">
                                        <Moon className="h-2.5 w-2.5" />
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                                    <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                                      {timeStr}
                                    </span>
                                    <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
                                      {dateStr}
                                    </span>
                                  </div>
                                  {r.peakLabel && (
                                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                                      <Sun className="h-3 w-3" />
                                      {r.peakLabel}
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => copySingle(r.tz.id, singleLine)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 min-h-[36px] touch-manipulation"
                                  title={t('copy.single')}
                                >
                                  {copyAllState[r.tz.id] ? (
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  {t('tip')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t('features')}</h3>
            <ul className="space-y-3">
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
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
