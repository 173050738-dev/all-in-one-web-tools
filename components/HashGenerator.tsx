'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, FileText, Hash, Upload, Trash2, Key } from 'lucide-react';

interface HashGeneratorProps {
  locale?: string;
}

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

const ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

const i18n = {
  zh: {
    title: '哈希生成器',
    subtitle: '文本/文件哈希计算 — MD5、SHA-1、SHA-256、SHA-384、SHA-512，纯本地运算',
    inputType: '输入类型',
    text: '文本',
    file: '文件',
    inputPlaceholder: '在此输入文本进行哈希计算...',
    chooseFile: '选择文件',
    dragHint: '拖拽文件到此处，或点击选择',
    hashType: '哈希算法',
    generate: '生成哈希',
    generating: '计算中...',
    clear: '清空',
    copy: '复制',
    copied: '已复制',
    output: '哈希结果',
    error: '错误',
    fileInfo: '文件信息',
    fileName: '文件名',
    fileSize: '大小',
    noInput: '请输入文本或选择文件',
    features: '功能特性',
    feat1: '5 种哈希算法',
    feat2: '文本 + 文件支持',
    feat3: '纯本地运算，不上传',
    feat4: '一键复制结果',
  },
  en: {
    title: 'Hash Generator',
    subtitle: 'Text/file hashing — MD5, SHA-1, SHA-256, SHA-384, SHA-512, 100% local',
    inputType: 'Input Type',
    text: 'Text',
    file: 'File',
    inputPlaceholder: 'Enter text to hash...',
    chooseFile: 'Choose File',
    dragHint: 'Drop file here or click to select',
    hashType: 'Hash Algorithm',
    generate: 'Generate Hash',
    generating: 'Computing...',
    clear: 'Clear',
    copy: 'Copy',
    copied: 'Copied',
    output: 'Hash Result',
    error: 'Error',
    fileInfo: 'File Info',
    fileName: 'Name',
    fileSize: 'Size',
    noInput: 'Please enter text or select a file',
    features: 'Features',
    feat1: '5 hash algorithms',
    feat2: 'Text + File support',
    feat3: '100% local, no upload',
    feat4: 'One-click copy',
  },
  es: {
    title: 'Generador de Hash',
    subtitle: 'Hash de texto/archivo — MD5, SHA-1, SHA-256, SHA-384, SHA-512, 100% local',
    inputType: 'Tipo de Entrada',
    text: 'Texto',
    file: 'Archivo',
    inputPlaceholder: 'Ingresa texto para hash...',
    chooseFile: 'Elegir Archivo',
    dragHint: 'Suelta el archivo aquí o haz clic para seleccionar',
    hashType: 'Algoritmo de Hash',
    generate: 'Generar Hash',
    generating: 'Calculando...',
    clear: 'Limpiar',
    copy: 'Copiar',
    copied: 'Copiado',
    output: 'Resultado del Hash',
    error: 'Error',
    fileInfo: 'Info del Archivo',
    fileName: 'Nombre',
    fileSize: 'Tamaño',
    noInput: 'Por favor ingresa texto o selecciona un archivo',
    features: 'Características',
    feat1: '5 algoritmos de hash',
    feat2: 'Texto + Archivo',
    feat3: '100% local, sin subida',
    feat4: 'Copiar con un clic',
  },
  fr: {
    title: 'Générateur de Hash',
    subtitle: 'Hash texte/fichier — MD5, SHA-1, SHA-256, SHA-384, SHA-512, 100% local',
    inputType: 'Type d\'entrée',
    text: 'Texte',
    file: 'Fichier',
    inputPlaceholder: 'Entrez le texte à hacher...',
    chooseFile: 'Choisir un fichier',
    dragHint: 'Déposez le fichier ici ou cliquez pour sélectionner',
    hashType: 'Algorithme',
    generate: 'Générer',
    generating: 'Calcul...',
    clear: 'Effacer',
    copy: 'Copier',
    copied: 'Copié',
    output: 'Résultat',
    error: 'Erreur',
    fileInfo: 'Info fichier',
    fileName: 'Nom',
    fileSize: 'Taille',
    noInput: 'Veuillez entrer du texte ou sélectionner un fichier',
    features: 'Fonctionnalités',
    feat1: '5 algorithmes de hash',
    feat2: 'Texte + Fichier',
    feat3: '100% local, pas d\'upload',
    feat4: 'Copier en un clic',
  },
  hi: {
    title: 'हैश जनरेटर',
    subtitle: 'टेक्स्ट/फ़ाइल हैशिंग — MD5, SHA-1, SHA-256, SHA-384, SHA-512, 100% स्थानीय',
    inputType: 'इनपुट प्रकार',
    text: 'टेक्स्ट',
    file: 'फ़ाइल',
    inputPlaceholder: 'हैश करने के लिए टेक्स्ट दर्ज करें...',
    chooseFile: 'फ़ाइल चुनें',
    dragHint: 'यहाँ फ़ाइल छोड़ें या चयन करने के लिए क्लिक करें',
    hashType: 'हैश एल्गोरिदम',
    generate: 'हैश जनरेट करें',
    generating: 'गणना हो रही है...',
    clear: 'साफ़ करें',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया',
    output: 'हैश परिणाम',
    error: 'त्रुटि',
    fileInfo: 'फ़ाइल जानकारी',
    fileName: 'नाम',
    fileSize: 'आकार',
    noInput: 'कृपया टेक्स्ट दर्ज करें या फ़ाइल चुनें',
    features: 'विशेषताएँ',
    feat1: '5 हैश एल्गोरिदम',
    feat2: 'टेक्स्ट + फ़ाइल',
    feat3: '100% स्थानीय, कोई अपलोड नहीं',
    feat4: 'एक-क्लिक कॉपी',
  },
  ar: {
    title: 'مولد الهاش',
    subtitle: 'هاش النص/الملف — MD5، SHA-1، SHA-256، SHA-384، SHA-512، محلي 100%',
    inputType: 'نوع الإدخال',
    text: 'نص',
    file: 'ملف',
    inputPlaceholder: 'أدخل النص للتجزئة...',
    chooseFile: 'اختر ملفاً',
    dragHint: 'أفلت الملف هنا أو انقر للتحديد',
    hashType: 'خوارزمية الهاش',
    generate: 'إنشاء الهاش',
    generating: 'جاري الحساب...',
    clear: 'مسح',
    copy: 'نسخ',
    copied: 'تم النسخ',
    output: 'نتيجة الهاش',
    error: 'خطأ',
    fileInfo: 'معلومات الملف',
    fileName: 'الاسم',
    fileSize: 'الحجم',
    noInput: 'يرجى إدخال نص أو اختيار ملف',
    features: 'الميزات',
    feat1: '5 خوارزميات هاش',
    feat2: 'نص + ملف',
    feat3: 'محلي 100%، لا رفع',
    feat4: 'نسخ بنقرة واحدة',
  },
};

async function computeHash(data: ArrayBuffer, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === 'MD5') {
    return computeMD5(data);
  }
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Minimal MD5 implementation for browsers
function computeMD5(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  const bitLen = bytes.length * 8;

  // Pre-processing: adding padding bits
  const msg = new Uint8Array(bytes.length + 8);
  msg.set(bytes);
  msg[bytes.length] = 0x80;
  msg[msg.length - 4] = (bitLen >>> 24) & 0xff;
  msg[msg.length - 3] = (bitLen >>> 16) & 0xff;
  msg[msg.length - 2] = (bitLen >>> 8) & 0xff;
  msg[msg.length - 1] = bitLen & 0xff;

  // Initialize hash values
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  // Per-round shift amounts
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  // Process each 512-bit (64-byte) chunk
  for (let i = 0; i < msg.length; i += 64) {
    const w = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      w[j] = (msg[i + j * 4]) |
        (msg[i + j * 4 + 1] << 8) |
        (msg[i + j * 4 + 2] << 16) |
        (msg[i + j * 4 + 3] << 24);
    }

    let a = a0, b = b0, c = c0, d = d0;

    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }
      const temp = d;
      d = c;
      c = b;
      b = b + rotateLeft(a + f + w[g] + k[j], s[j]);
      a = temp;
    }

    a0 += a;
    b0 += b;
    c0 += c;
    d0 += d;
  }

  return [a0, b0, c0, d0].map(v => {
    const hex = v.toString(16);
    return hex.padStart(8, '0');
  }).join('');
}

const k = new Uint32Array(64);
for (let i = 0; i < 64; i++) {
  k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
}

function rotateLeft(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function HashGenerator({ locale = 'en' }: HashGeneratorProps) {
  const t = i18n[locale] || i18n.en;

  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleGenerate = useCallback(async () => {
    setError('');
    setResult('');

    if (inputMode === 'text' && !text) {
      setError(t.noInput);
      return;
    }
    if (inputMode === 'file' && !file) {
      setError(t.noInput);
      return;
    }

    setLoading(true);
    try {
      let data: ArrayBuffer;
      if (inputMode === 'text') {
        data = new TextEncoder().encode(text);
      } else {
        data = await file!.arrayBuffer();
      }
      const hash = await computeHash(data, algorithm);
      setResult(hash);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [inputMode, text, file, algorithm, t.noInput]);

  const handleFile = useCallback((f: File | null) => {
    setFile(f);
    setResult('');
    setError('');
  }, []);

  const clearAll = useCallback(() => {
    setText('');
    setFile(null);
    setResult('');
    setError('');
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.title}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 space-y-5">
          {/* Input Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.inputType}</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setInputMode('text'); setResult(''); setError(''); }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'text'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" />
                {t.text}
              </button>
              <button
                onClick={() => { setInputMode('file'); setResult(''); setError(''); }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'file'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-1.5" />
                {t.file}
              </button>
            </div>
          </div>

          {/* Text Input */}
          {inputMode === 'text' && (
            <div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full h-40 sm:h-48 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* File Input */}
          {inputMode === 'file' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                dragOver
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
              }`}
              onClick={() => {
                const input = document.getElementById('hash-file-input') as HTMLInputElement;
                input?.click();
              }}
            >
              <input
                id="hash-file-input"
                type="file"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              {file ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>{t.dragHint}</p>
                </div>
              )}
            </div>
          )}

          {/* Algorithm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.hashType}</label>
            <div className="grid grid-cols-5 gap-2">
              {ALGORITHMS.map(algo => (
                <button
                  key={algo}
                  onClick={() => setAlgorithm(algo)}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    algorithm === algo
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <Hash className="w-4 h-4" />
              {loading ? t.generating : t.generate}
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t.clear}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.output}</label>
                <button
                  onClick={copyResult}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <div className="p-3 rounded-lg bg-gray-900 text-green-400 text-xs font-mono break-all">
                {result}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {algorithm} · {result.length} 字符
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}