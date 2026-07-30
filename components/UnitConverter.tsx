'use client';

import { useState, useMemo } from 'react';
import { Ruler, ThermometerSun, Scale, Maximize, Box, Gauge, HardDrive, Clock, Calculator } from 'lucide-react';

interface UnitConverterProps { locale?: string; }

const i18n: Record<string, any> = {
  en: {
    title: 'Unit Converter',
    sub: 'Convert between units of length, weight, temperature, area, volume, speed, data storage and time. Real-time two-way.',
    categories: {
      length: 'Length', weight: 'Weight', temp: 'Temperature', area: 'Area',
      volume: 'Volume', speed: 'Speed', data: 'Data', time: 'Time',
    },
    from: 'From', to: 'To',
    result: 'Result',
    formula: 'Formula',
    recent: 'Recent searches',
    type: 'Type a number',
  },
  zh: {
    title: '万能单位换算器',
    sub: '长度、重量、温度、面积、体积、速度、存储、时间 八类常用单位实时双向换算。全本地计算。',
    categories: {
      length: '长度', weight: '重量', temp: '温度', area: '面积',
      volume: '体积', speed: '速度', data: '数据存储', time: '时间',
    },
    from: '从', to: '到',
    result: '结果', formula: '公式',
    recent: '最近使用', type: '输入数值',
  },
  es: {
    title: 'Convertidor de Unidades',
    sub: 'Longitud, peso, temperatura, área, volumen, velocidad, datos, tiempo — bidireccional en tiempo real.',
    categories: { length: 'Longitud', weight: 'Peso', temp: 'Temperatura', area: 'Área',
      volume: 'Volumen', speed: 'Velocidad', data: 'Datos', time: 'Tiempo' },
    from: 'De', to: 'A', result: 'Resultado', formula: 'Fórmula',
    recent: 'Recientes', type: 'Escribe un número',
  },
  fr: {
    title: 'Convertisseur d\'Unités',
    sub: 'Longueur, poids, température, surface, volume, vitesse, données, temps — bidirectionnel en temps réel.',
    categories: { length: 'Longueur', weight: 'Poids', temp: 'Température', area: 'Surface',
      volume: 'Volume', speed: 'Vitesse', data: 'Données', time: 'Temps' },
    from: 'De', to: 'Vers', result: 'Résultat', formula: 'Formule',
    recent: 'Récents', type: 'Entrez un nombre',
  },
  hi: {
    title: 'इकाई कनवर्टर',
    sub: 'लंबाई, वजन, तापमान, क्षेत्र, आयतन, गति, डेटा, समय — रियल-टाइम दो-तरफा रूपांतरण।',
    categories: { length: 'लंबाई', weight: 'वजन', temp: 'तापमान', area: 'क्षेत्र',
      volume: 'आयतन', speed: 'गति', data: 'डेटा', time: 'समय' },
    from: 'से', to: 'में', result: 'परिणाम', formula: 'सूत्र',
    recent: 'हाल के', type: 'नंबर दर्ज करें',
  },
  ar: {
    title: 'محول الوحدات',
    sub: 'الطول، الوزن، الحرارة، المساحة، الحجم، السرعة، البيانات، الوقت — تحويل ثنائي الاتجاه فوري.',
    categories: { length: 'الطول', weight: 'الوزن', temp: 'الحرارة', area: 'المساحة',
      volume: 'الحجم', speed: 'السرعة', data: 'البيانات', time: 'الوقت' },
    from: 'من', to: 'إلى', result: 'النتيجة', formula: 'الصيغة',
    recent: 'الأحدث', type: 'اكتب رقماً',
  },
};

const CAT_ICONS: Record<string, any> = {
  length: Ruler, weight: Scale, temp: ThermometerSun, area: Maximize,
  volume: Box, speed: Gauge, data: HardDrive, time: Clock,
};

// Each unit: name + factor to base unit (or special for temp)
type UnitDef = { id: string; name: string; base: number | string; };

const UNITS: Record<string, UnitDef[]> = {
  length: [
    { id: 'm', name: 'Meter (m)', base: 1 },
    { id: 'km', name: 'Kilometer (km)', base: 1000 },
    { id: 'cm', name: 'Centimeter (cm)', base: 0.01 },
    { id: 'mm', name: 'Millimeter (mm)', base: 0.001 },
    { id: 'mi', name: 'Mile (mi)', base: 1609.344 },
    { id: 'yd', name: 'Yard (yd)', base: 0.9144 },
    { id: 'ft', name: 'Foot (ft)', base: 0.3048 },
    { id: 'in', name: 'Inch (in)', base: 0.0254 },
  ],
  weight: [
    { id: 'kg', name: 'Kilogram (kg)', base: 1 },
    { id: 'g', name: 'Gram (g)', base: 0.001 },
    { id: 'mg', name: 'Milligram (mg)', base: 1e-6 },
    { id: 't', name: 'Metric Ton (t)', base: 1000 },
    { id: 'lb', name: 'Pound (lb)', base: 0.45359237 },
    { id: 'oz', name: 'Ounce (oz)', base: 0.0283495 },
    { id: 'jin', name: '斤 (jin)', base: 0.5 },
  ],
  temp: [
    { id: 'c', name: 'Celsius (°C)', base: 'C' },
    { id: 'f', name: 'Fahrenheit (°F)', base: 'F' },
    { id: 'k', name: 'Kelvin (K)', base: 'K' },
  ],
  area: [
    { id: 'm2', name: 'Square Meter (m²)', base: 1 },
    { id: 'km2', name: 'Square Kilometer (km²)', base: 1e6 },
    { id: 'ha', name: 'Hectare (ha)', base: 10000 },
    { id: 'mu', name: '亩 (mu)', base: 666.666 },
    { id: 'acre', name: 'Acre', base: 4046.86 },
    { id: 'ft2', name: 'Square Foot (ft²)', base: 0.092903 },
    { id: 'in2', name: 'Square Inch (in²)', base: 0.00064516 },
  ],
  volume: [
    { id: 'l', name: 'Liter (L)', base: 1 },
    { id: 'ml', name: 'Milliliter (mL)', base: 0.001 },
    { id: 'm3', name: 'Cubic Meter (m³)', base: 1000 },
    { id: 'gal', name: 'US Gallon (gal)', base: 3.78541 },
    { id: 'qt', name: 'US Quart (qt)', base: 0.946353 },
    { id: 'cup', name: 'US Cup', base: 0.236588 },
    { id: 'floz', name: 'US Fl oz', base: 0.0295735 },
  ],
  speed: [
    { id: 'ms', name: 'Meters/second (m/s)', base: 1 },
    { id: 'kmh', name: 'Km/h (km/h)', base: 0.277778 },
    { id: 'mph', name: 'Miles/hour (mph)', base: 0.44704 },
    { id: 'kn', name: 'Knot (kn)', base: 0.514444 },
    { id: 'fts', name: 'Foot/second (ft/s)', base: 0.3048 },
  ],
  data: [
    { id: 'b', name: 'Bit (bit)', base: 0.125 },
    { id: 'B', name: 'Byte (B)', base: 1 },
    { id: 'KB', name: 'Kilobyte (KB)', base: 1024 },
    { id: 'MB', name: 'Megabyte (MB)', base: 1048576 },
    { id: 'GB', name: 'Gigabyte (GB)', base: 1073741824 },
    { id: 'TB', name: 'Terabyte (TB)', base: 1099511627776 },
    { id: 'PB', name: 'Petabyte (PB)', base: 1125899906842624 },
  ],
  time: [
    { id: 'ms', name: 'Millisecond', base: 0.001 },
    { id: 's', name: 'Second', base: 1 },
    { id: 'min', name: 'Minute', base: 60 },
    { id: 'h', name: 'Hour', base: 3600 },
    { id: 'd', name: 'Day', base: 86400 },
    { id: 'wk', name: 'Week', base: 604800 },
    { id: 'mo', name: 'Month (30d)', base: 2592000 },
    { id: 'yr', name: 'Year (365d)', base: 31536000 },
  ],
};

const UNIT_NAMES_LOCAL: Record<string, Record<string, string>> = {
  length: { km: '公里', cm: '厘米', mm: '毫米', mi: '英里', yd: '码', ft: '英尺', in: '英寸', m: '米' },
  weight: { kg: '千克', g: '克', mg: '毫克', t: '吨', lb: '磅', oz: '盎司', jin: '斤' },
  area: { m2: '平方米', km2: '平方公里', ha: '公顷', mu: '亩', acre: '英亩', ft2: '平方英尺', in2: '平方英寸' },
  volume: { l: '升', ml: '毫升', m3: '立方米', gal: '加仑', qt: '夸脱', cup: '杯', floz: '液盎司' },
  speed: { ms: '米/秒', kmh: '公里/时', mph: '英里/时', kn: '节', fts: '英尺/秒' },
  data: { b: '位', B: '字节', KB: '千字节', MB: '兆字节', GB: '吉字节', TB: '太字节', PB: '拍字节' },
  time: { ms: '毫秒', s: '秒', min: '分', h: '时', d: '天', wk: '周', mo: '月', yr: '年' },
};

function convert(cat: string, value: number, from: string, to: string): number {
  if (cat === 'temp') {
    // Convert to Celsius first
    let c: number;
    if (from === 'c') c = value;
    else if (from === 'f') c = (value - 32) * 5 / 9;
    else c = value - 273.15;
    if (to === 'c') return c;
    if (to === 'f') return c * 9 / 5 + 32;
    return c + 273.15;
  }
  const units = UNITS[cat];
  const fu = units.find(u => u.id === from);
  const tu = units.find(u => u.id === to);
  if (!fu || !tu) return NaN;
  const fFactor = fu.base as number;
  const tFactor = tu.base as number;
  return value * fFactor / tFactor;
}

function fmt(n: number): string {
  if (isNaN(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12) return n.toExponential(4);
  if (abs < 0.0001) return n.toExponential(4);
  return Number(n.toFixed(8)).toString();
}

export default function UnitConverter({ locale = 'zh' }: UnitConverterProps) {
  const t = i18n[locale] || i18n.en;
  const [cat, setCat] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>(UNITS.length[0].id);
  const [toUnit, setToUnit] = useState<string>(UNITS.length[1].id);
  const [fromVal, setFromVal] = useState<string>('1');
  const [toVal, setToVal] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'from' | 'to'>('from');

  const units = useMemo(() => UNITS[cat], [cat]);

  // Keep units valid on category change
  const onCatChange = (c: string) => {
    setCat(c);
    const us = UNITS[c];
    setFromUnit(us[0].id);
    setToUnit(us[Math.min(1, us.length - 1)].id);
    setFromVal('1');
    setToVal('');
    setLastChanged('from');
  };

  const from = useMemo(() => {
    const n = parseFloat(fromVal);
    if (isNaN(n)) return NaN;
    return convert(cat, n, fromUnit, toUnit);
  }, [cat, fromVal, fromUnit, toUnit]);

  const to = useMemo(() => {
    const n = parseFloat(toVal);
    if (isNaN(n)) return NaN;
    return convert(cat, n, toUnit, fromUnit);
  }, [cat, toVal, fromUnit, toUnit]);

  const displayResult = lastChanged === 'from' ? fmt(from) : fmt(to);
  const resultTarget = lastChanged === 'from' ? toVal : fromVal;
  const resultUnit = lastChanged === 'from' ? toUnit : fromUnit;
  const sourceVal = lastChanged === 'from' ? fromVal : toVal;
  const sourceUnit = lastChanged === 'from' ? fromUnit : toUnit;

  // Build local unit names
  const unitName = (u: UnitDef) => {
    if (locale === 'zh' && UNIT_NAMES_LOCAL[cat]?.[u.id]) return UNIT_NAMES_LOCAL[cat][u.id];
    return u.name;
  };

  const catIds = Object.keys(UNITS);
  const swapUnits = () => {
    setFromUnit(toUnit); setToUnit(fromUnit);
    setFromVal(resultTarget || '');
    setToVal(sourceVal || '');
    setLastChanged(lastChanged === 'from' ? 'to' : 'from');
  };

  return (
    <div className="w-full max-w-4xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <Calculator className="text-sky-500" size={24} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.sub}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 mb-5 justify-center sm:justify-start">
          {catIds.map(cid => {
            const Ico = CAT_ICONS[cid] || Ruler;
            return (
              <button
                key={cid} onClick={() => onCatChange(cid)}
                className={`px-3 py-2 rounded-xl min-h-[38px] text-xs sm:text-sm transition flex items-center gap-1.5 ${
                  cat === cid
                    ? 'bg-sky-500 text-white shadow-md font-medium'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Ico size={14} />
                {t.categories[cid] || cid}
              </button>
            );
          })}
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-start">
          {/* From */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
            <div className="text-[10px] text-gray-500 mb-1">{t.from}</div>
            <input
              type="number" value={fromVal}
              onChange={e => { setFromVal(e.target.value); setLastChanged('from'); }}
              className="w-full text-2xl font-bold bg-transparent outline-none text-gray-800 dark:text-gray-100 mb-2 py-1"
              placeholder={t.type}
            />
            <select
              value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 min-h-[38px]"
            >
              {units.map(u => <option key={u.id} value={u.id}>{unitName(u)}</option>)}
            </select>
          </div>

          <div className="flex md:flex-col items-center justify-center gap-2 py-2">
            <button onClick={swapUnits}
              className="p-2 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 hover:bg-sky-200 transition"
              title="Swap units"
            >
              <Ruler size={16} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </div>

          {/* To */}
          <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-100 dark:border-sky-800/30">
            <div className="text-[10px] text-sky-600 dark:text-sky-400 mb-1">{t.to}</div>
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-300 mb-2 py-1 break-all min-h-[36px]">
              {displayResult}
            </div>
            <select
              value={toUnit} onChange={e => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 dark:border-sky-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 min-h-[38px]"
            >
              {units.map(u => <option key={u.id} value={u.id}>{unitName(u)}</option>)}
            </select>
          </div>
        </div>

        {/* Formula */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
          <Ruler size={14} className="mt-0.5 text-gray-400 flex-shrink-0" />
          <div>
            <b>{t.formula}:</b> {fmt(parseFloat(sourceVal || '0'))} {unitName(units.find(u => u.id === sourceUnit)!)}
            &nbsp;=&nbsp;
            <b className="text-sky-600 dark:text-sky-400">
              {fmt(convert(cat, parseFloat(sourceVal || '0'), sourceUnit, resultUnit))}
            </b>
            &nbsp;{unitName(units.find(u => u.id === resultUnit)!)}
          </div>
        </div>

        {/* Common references */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 10, 100, 1000].map(v => (
            <button key={v} onClick={() => { setFromVal(String(v)); setLastChanged('from'); }}
              className="px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/30 transition min-h-[36px]">
              {v} {unitName(units.find(u => u.id === fromUnit)!)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}