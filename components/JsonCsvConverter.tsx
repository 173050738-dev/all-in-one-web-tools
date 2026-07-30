'use client';

import { useState, useMemo, useCallback } from 'react';
import { ArrowRightLeft, Copy, Download, FileJson, FileSpreadsheet, Settings, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface JsonCsvConverterProps { locale?: string; }

type Mode = 'json2csv' | 'csv2json';

const i18n: Record<string, any> = {
  en: {
    title: 'JSON ↔ CSV Converter',
    sub: 'Two-way JSON ↔ CSV conversion. Nested JSON flattening, custom delimiter, copy & download — all in your browser.',
    json2csv: 'JSON → CSV', csv2json: 'CSV → JSON',
    jsonInput: 'Paste JSON here...', csvInput: 'Paste CSV here...',
    output: 'Output', delimiter: 'Delimiter',
    flatten: 'Flatten nested JSON', separator: 'Key separator',
    copy: 'Copy', copied: 'Copied!', download: 'Download',
    rows: 'rows', cols: 'columns',
    processing: 'Converting...', done: 'Done', error: 'Error',
    preview: 'Preview', addRow: 'Add Row', addCol: 'Add Column', delRow: 'Del Row', delCol: 'Del Col',
    tips: 'JSON arrays of objects → CSV rows. Nested objects flatten with dot notation by default.',
  },
  zh: {
    title: 'JSON ↔ CSV 互转工具',
    sub: 'JSON ↔ CSV 双向转换。支持嵌套 JSON 扁平化、自定义分隔符、复制/下载，纯前端处理。',
    json2csv: 'JSON → CSV', csv2json: 'CSV → JSON',
    jsonInput: '粘贴 JSON 数据...', csvInput: '粘贴 CSV 数据...',
    output: '输出结果', delimiter: '分隔符',
    flatten: '扁平化嵌套 JSON', separator: '层级分隔符',
    copy: '复制', copied: '已复制！', download: '下载',
    rows: '行', cols: '列',
    processing: '转换中…', done: '完成', error: '错误',
    preview: '预览', addRow: '加一行', addCol: '加一列', delRow: '删最后一行', delCol: '删最后一列',
    tips: 'JSON 对象数组 → CSV 行。嵌套对象默认用点号（.）扁平化。',
  },
  es: {
    title: 'Convertidor JSON ↔ CSV',
    sub: 'Conversión bidireccional. Aplanado de JSON anidado, delimitador personalizado, copia y descarga.',
    json2csv: 'JSON → CSV', csv2json: 'CSV → JSON',
    jsonInput: 'Pega el JSON aquí...', csvInput: 'Pega el CSV aquí...',
    output: 'Salida', delimiter: 'Delimitador',
    flatten: 'Aplanar JSON anidado', separator: 'Separador de claves',
    copy: 'Copiar', copied: '¡Copiado!', download: 'Descargar',
    rows: 'filas', cols: 'columnas', processing: 'Convirtiendo...', done: 'Listo', error: 'Error',
    preview: 'Vista previa', addRow: '+ Fila', addCol: '+ Columna', delRow: '- Fila', delCol: '- Columna',
    tips: 'Arreglos JSON de objetos → filas CSV. Objetos anidados aplanados con notación de punto.',
  },
  fr: {
    title: 'Convertisseur JSON ↔ CSV',
    sub: 'Conversion bidirectionnelle. Aplatissement des JSON imbriqués, délimiteur personnalisé, copie et téléchargement.',
    json2csv: 'JSON → CSV', csv2json: 'CSV → JSON',
    jsonInput: 'Collez le JSON ici...', csvInput: 'Collez le CSV ici...',
    output: 'Sortie', delimiter: 'Délimiteur',
    flatten: 'Aplatir JSON imbriqué', separator: 'Séparateur de clés',
    copy: 'Copier', copied: 'Copié !', download: 'Télécharger',
    rows: 'lignes', cols: 'colonnes', processing: 'Conversion...', done: 'Terminé', error: 'Erreur',
    preview: 'Aperçu', addRow: '+ Ligne', addCol: '+ Colonne', delRow: '- Ligne', delCol: '- Colonne',
    tips: 'Tableaux JSON d\'objets → lignes CSV. Objets imbriqués aplatis avec notation par points.',
  },
  hi: {
    title: 'JSON ↔ CSV कनवर्टर',
    sub: 'दो-तरफा रूपांतरण। नेस्टेड JSON फ़्लैटन, कस्टम डिलिमिटर, कॉपी और डाउनलोड।',
    json2csv: 'JSON → CSV', csv2json: 'CSV → JSON',
    jsonInput: 'यहाँ JSON पेस्ट करें...', csvInput: 'यहाँ CSV पेस्ट करें...',
    output: 'आउटपुट', delimiter: 'डिलिमिटर',
    flatten: 'नेस्टेड JSON फ़्लैट करें', separator: 'कुंजी सेपरेटर',
    copy: 'कॉपी करें', copied: 'कॉपी हुआ!', download: 'डाउनलोड',
    rows: 'पंक्तियाँ', cols: 'कॉलम', processing: 'बदला जा रहा है...', done: 'हो गया', error: 'त्रुटि',
    preview: 'पूर्वावलोकन', addRow: '+ पंक्ति', addCol: '+ कॉलम', delRow: '- पंक्ति', delCol: '- कॉलम',
    tips: 'ऑब्जेक्ट्स का JSON ऐरे → CSV पंक्तियां। नेस्टेड ऑब्जेक्ट्स डॉट नोटेशन से फ़्लैट।',
  },
  ar: {
    title: 'محول JSON ↔ CSV',
    sub: 'تحويل ثنائي الاتجاه. تسطيح JSON المتداخل، محدد مخصص، نسخ وتحميل.',
    json2csv: 'JSON → CSV', csv2json: 'CSV → JSON',
    jsonInput: 'الصق JSON هنا...', csvInput: 'الصق CSV هنا...',
    output: 'النتيجة', delimiter: 'المحدد',
    flatten: 'تسطيح JSON المتداخل', separator: 'فاصل المفاتيح',
    copy: 'نسخ', copied: 'تم النسخ!', download: 'تحميل',
    rows: 'صفوف', cols: 'أعمدة', processing: 'قيد التحويل...', done: 'تم', error: 'خطأ',
    preview: 'معاينة', addRow: '+ صف', addCol: '+ عمود', delRow: '- صف', delCol: '- عمود',
    tips: 'مصفوفات كائنات JSON → صفوف CSV. كائنات متداخلة بمفصول النقطة.',
  },
};

const SAMPLE_JSON = `[
  { "id": 1, "name": "Alice", "age": 30, "address": { "city": "New York", "zip": "10001" }, "tags": ["dev", "design"] },
  { "id": 2, "name": "Bob",   "age": 25, "address": { "city": "Paris",    "zip": "75000" }, "tags": ["marketing"] }
]`;

const SAMPLE_CSV = `id,name,age,address.city,address.zip
1,Alice,30,New York,10001
2,Bob,25,Paris,75000`;

/* --- helpers --- */
function flattenObj(obj: any, prefix: string, sep: string, out: Record<string, any> = {}): Record<string, any> {
  for (const key of Object.keys(obj)) {
    const k = prefix ? `${prefix}${sep}${key}` : key;
    const v = obj[key];
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flattenObj(v, k, sep, out);
    } else if (Array.isArray(v)) {
      out[k] = JSON.stringify(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function setPath(obj: any, path: string[], value: any) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (cur[k] === undefined) cur[k] = {};
    cur = cur[k];
  }
  const last = path[path.length - 1];
  // Try to coerce numbers / booleans / null
  if (value === '') cur[last] = '';
  else if (value === 'true') cur[last] = true;
  else if (value === 'false') cur[last] = false;
  else if (value === 'null') cur[last] = null;
  else if (!isNaN(Number(value)) && value.trim() !== '') cur[last] = Number(value);
  else if (/^\[.*\]$|^\{.*\}$/.test(value.trim())) {
    try { cur[last] = JSON.parse(value); }
    catch { cur[last] = value; }
  } else cur[last] = value;
}

function unflattenObj(flat: Record<string, any>, sep: string): Record<string, any> {
  const res: Record<string, any> = {};
  for (const key of Object.keys(flat)) {
    setPath(res, key.split(sep), flat[key]);
  }
  return res;
}

function escapeCSV(v: any, delim: string): string {
  if (v === null || v === undefined) return '';
  let s = typeof v === 'string' ? v : String(v);
  if (s.includes(delim) || s.includes('"') || s.includes('\n')) {
    s = '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function jsonToCsv(json: string, flatten: boolean, sep: string, delim: string): { csv: string; rows: number; cols: number } {
  let arr: any[] = JSON.parse(json);
  if (!Array.isArray(arr)) {
    if (arr && typeof arr === 'object') arr = [arr];
    else throw new Error('Top-level JSON must be an array or object');
  }
  const flatArr = flatten ? arr.map(o => flattenObj(o, '', sep)) : arr.map(o => {
    const out: Record<string, any> = {};
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v !== null && typeof v === 'object') out[k] = JSON.stringify(v);
      else out[k] = v;
    }
    return out;
  });

  // Collect keys preserving order
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const o of flatArr) {
    for (const k of Object.keys(o)) {
      if (!seen.has(k)) { seen.add(k); headers.push(k); }
    }
  }

  const lines: string[] = [headers.map(h => escapeCSV(h, delim)).join(delim)];
  for (const o of flatArr) {
    lines.push(headers.map(h => escapeCSV(o[h], delim)).join(delim));
  }
  return { csv: lines.join('\n'), rows: flatArr.length, cols: headers.length };
}

function parseCsv(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === delim) { cur.push(field); field = ''; }
      else if (ch === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
      else if (ch === '\r') { /* skip */ }
      else field += ch;
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows.filter(r => !(r.length === 1 && r[0] === ''));
}

function csvToJson(csv: string, delim: string, unflatten: boolean, sep: string): { json: string; rows: number; cols: number } {
  const rows = parseCsv(csv, delim);
  if (rows.length === 0) return { json: '[]', rows: 0, cols: 0 };
  const headers = rows[0];
  const data = rows.slice(1);
  const out: any[] = data.map(r => {
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => obj[h] = r[i] ?? '');
    return unflatten ? unflattenObj(obj, sep) : obj;
  });
  return {
    json: JSON.stringify(out, null, 2),
    rows: out.length,
    cols: headers.length,
  };
}

export default function JsonCsvConverter({ locale = 'zh' }: JsonCsvConverterProps) {
  const t = i18n[locale] || i18n.en;
  const [mode, setMode] = useState<Mode>('json2csv');
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [flatten, setFlatten] = useState(true);
  const [delim, setDelim] = useState(',');
  const [sep, setSep] = useState('.');
  const [copied, setCopied] = useState(false);

  const { output, stats, error } = useMemo(() => {
    try {
      if (mode === 'json2csv') {
        const trimmed = input.trim();
        if (!trimmed) return { output: '', stats: null, error: null };
        const r = jsonToCsv(trimmed, flatten, sep, delim);
        return { output: r.csv, stats: { rows: r.rows, cols: r.cols }, error: null };
      } else {
        const trimmed = input.trim();
        if (!trimmed) return { output: '', stats: null, error: null };
        const r = csvToJson(trimmed, delim, flatten, sep);
        return { output: r.json, stats: { rows: r.rows, cols: r.cols }, error: null };
      }
    } catch (e: any) {
      return { output: '', stats: null, error: e?.message || 'Conversion failed' };
    }
  }, [mode, input, flatten, sep, delim]);

  const swapMode = useCallback((m: Mode) => {
    setMode(m);
    setInput(m === 'json2csv' ? SAMPLE_JSON : SAMPLE_CSV);
  }, []);

  const doCopy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch {}
  };

  const doDownload = () => {
    if (!output) return;
    const ext = mode === 'json2csv' ? 'csv' : 'json';
    const mime = ext === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8';
    const blob = new Blob([ext === 'csv' ? '\ufeff' + output : output], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `converted.${ext}`;
    a.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <ArrowRightLeft className="text-sky-500" size={24} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.sub}</p>
      </div>

      {/* Mode switch */}
      <div className="flex gap-2 justify-center mb-4">
        <button onClick={() => swapMode('json2csv')}
          className={`px-4 py-2 rounded-xl min-h-[40px] text-sm font-medium transition ${
            mode === 'json2csv' ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}>
          <FileJson size={16} className="inline mr-1.5" />{t.json2csv}
        </button>
        <button onClick={() => swapMode('csv2json')}
          className={`px-4 py-2 rounded-xl min-h-[40px] text-sm font-medium transition ${
            mode === 'csv2json' ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}>
          <FileSpreadsheet size={16} className="inline mr-1.5" />{t.csv2json}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        {/* Settings */}
        <div className="flex flex-wrap items-center gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 min-h-[36px]">
            <input type="checkbox" checked={flatten} onChange={e => setFlatten(e.target.checked)}
              className="w-4 h-4 accent-sky-500" />
            {t.flatten}
          </label>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <span>{t.delimiter}:</span>
            <select value={delim} onChange={e => setDelim(e.target.value)}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[32px]">
              <option value=",">,</option>
              <option value=";">;</option>
              <option value="\t">\t (Tab)</option>
              <option value="|">|</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Settings size={12} />
            <span>{t.separator}:</span>
            <input type="text" value={sep} onChange={e => setSep(e.target.value || '.')} maxLength={3}
              className="w-14 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[32px] text-center" />
          </div>

          <div className="ms-auto flex items-center gap-2">
            <button onClick={doCopy} disabled={!output}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/30 text-xs flex items-center gap-1 min-h-[34px] disabled:opacity-40">
              {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              {copied ? t.copied : t.copy}
            </button>
            <button onClick={doDownload} disabled={!output}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-xs flex items-center gap-1 min-h-[34px] disabled:opacity-40">
              <Download size={12} /> {t.download}
            </button>
          </div>
        </div>

        {/* 2-col input + output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              {mode === 'json2csv' ? <FileJson size={12} /> : <FileSpreadsheet size={12} />}
              &nbsp;{mode === 'json2csv' ? t.jsonInput : t.csvInput}
            </div>
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              spellCheck={false}
              className="w-full h-[340px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-y"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              {mode === 'json2csv' ? <FileSpreadsheet size={12} /> : <FileJson size={12} />}
              &nbsp;{t.output}
              {stats && (
                <span className="ms-auto text-sky-600 dark:text-sky-400 font-medium">
                  {stats.rows} {t.rows} · {stats.cols} {t.cols}
                </span>
              )}
            </div>
            <textarea
              value={output} readOnly spellCheck={false}
              className={`w-full h-[340px] p-3 rounded-xl border text-xs sm:text-sm font-mono resize-y ${
                error
                  ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                  : 'border-sky-100 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-900/10 text-gray-700 dark:text-gray-200'
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 text-red-600 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <div><b>{t.error}:</b> {error}</div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2">
        <Settings size={12} className="inline mr-1" />
        {t.tips}
      </div>
    </div>
  );
}