'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Copy,
  Check,
  Download,
  Trash2,
  Image as ImageIcon,
  FileText,
  X,
} from 'lucide-react';

interface ImageToBase64Props {
  locale?: string;
}

interface ImageItem {
  file: File;
  dataUrl: string;
  base64: string;
  id: string;
}

const i18n = {
  zh: {
    title: '图片转Base64',
    subtitle: '纯前端本地转换，不上传服务器',
    dragArea: '拖拽图片到这里，或点击上传',
    support: '支持 JPG / PNG / WebP / SVG / GIF，单文件≤10MB',
    preview: '预览',
    filename: '文件名',
    size: '大小',
    mime: '类型',
    output: 'Base64编码输出',
    copied: '已复制',
    copy: '复制',
    copyShort: '复制 DataURL',
    download: '下载 .txt',
    clear: '清空',
    noFile: '尚未选择图片',
    dropHint: '释放以上传',
    maxSize: '文件太大！最大10MB',
  },
  en: {
    title: 'Image to Base64',
    subtitle: 'Local conversion, no server upload',
    dragArea: 'Drop images here, or click to upload',
    support: 'Support JPG/PNG/WebP/SVG/GIF, each file ≤10MB',
    preview: 'Preview',
    filename: 'Filename',
    size: 'Size',
    mime: 'Type',
    output: 'Base64 Output',
    copied: 'Copied',
    copy: 'Copy',
    copyShort: 'Copy DataURL',
    download: 'Download .txt',
    clear: 'Clear',
    noFile: 'No image selected',
    dropHint: 'Release to upload',
    maxSize: 'File too large! Max 10MB',
  },
  hi: {
    title: 'इमेज से Base64',
    subtitle: 'स्थानीय रूपांतरण, सर्वर अपलोड नहीं',
    dragArea: 'यहां इमेज छोड़ें या अपलोड करें',
    support: 'JPG/PNG/WebP/SVG/GIF, फ़ाइल ≤10MB',
    preview: 'प्रीव्यू',
    filename: 'फ़ाइल नाम',
    size: 'आकार',
    mime: 'प्रकार',
    output: 'Base64 आउटपुट',
    copied: 'कॉपी हुआ',
    copy: 'कॉपी',
    copyShort: 'DataURL कॉपी',
    download: 'Download .txt',
    clear: 'साफ़ करें',
    noFile: 'कोई इमेज नहीं',
    dropHint: 'अपलोड के लिए छोड़ें',
    maxSize: 'फ़ाइल बड़ी है! अधिकतम 10MB',
  },
  fr: {
    title: 'Image vers Base64',
    subtitle: 'Conversion locale, aucun upload',
    dragArea: 'Déposez les images ici, ou cliquez pour télécharger',
    support: 'JPG/PNG/WebP/SVG/GIF, ≤10MB/fichier',
    preview: 'Aperçu',
    filename: 'Nom',
    size: 'Taille',
    mime: 'Type',
    output: 'Sortie Base64',
    copied: 'Copié',
    copy: 'Copier',
    copyShort: 'Copier DataURL',
    download: 'Télécharger .txt',
    clear: 'Effacer',
    noFile: 'Aucune image',
    dropHint: 'Relâchez pour télécharger',
    maxSize: 'Fichier trop grand! Max 10MB',
  },
  es: {
    title: 'Imagen a Base64',
    subtitle: 'Conversión local, sin subida al servidor',
    dragArea: 'Suelta imágenes aquí o haz clic para subir',
    support: 'JPG/PNG/WebP/SVG/GIF, ≤10MB',
    preview: 'Vista previa',
    filename: 'Nombre',
    size: 'Tamaño',
    mime: 'Tipo',
    output: 'Salida Base64',
    copied: 'Copiado',
    copy: 'Copiar',
    copyShort: 'Copiar DataURL',
    download: 'Descargar .txt',
    clear: 'Limpiar',
    noFile: 'Sin imagen',
    dropHint: 'Suelta para subir',
    maxSize: '¡Archivo demasiado grande! Máx 10MB',
  },
  ar: {
    title: 'صورة إلى Base64',
    subtitle: 'تحويل محلي، لا تحميل للخادم',
    dragArea: 'أفل الصور هنا أو انقر للتحميل',
    support: 'JPG/PNG/WebP/SVG/GIF، كل ملف ≤10ميجا',
    preview: 'معاينة',
    filename: 'اسم الملف',
    size: 'الحجم',
    mime: 'النوع',
    output: 'إخراج Base64',
    copied: 'تم النسخ',
    copy: 'نسخ',
    copyShort: 'نسخ DataURL',
    download: 'تحميل .txt',
    clear: 'مسح',
    noFile: 'لا توجد صورة',
    dropHint: 'أفل للتحميل',
    maxSize: 'ملف كبير جدًا! الحد الأقصى 10MB',
  },
};

const MAX_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function ImageToBase64({ locale = 'zh' }: ImageToBase64Props) {
  const t = i18n[locale as keyof typeof i18n] || i18n.zh;
  const inputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<ImageItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      let hasOversized = false;

      fileArray.forEach((file) => {
        if (file.size > MAX_SIZE) {
          hasOversized = true;
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const base64 = dataUrl.split(',')[1] || '';
          const newItem: ImageItem = {
            file,
            dataUrl,
            base64,
            id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          };
          setItems((prev) => [...prev, newItem]);
        };
        reader.readAsDataURL(file);
      });

      if (hasOversized) {
        setErrorMsg(t.maxSize);
        setTimeout(() => setErrorMsg(null), 3000);
      }
    },
    [t.maxSize],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadTxt = (item: ImageItem) => {
    const blob = new Blob([item.dataUrl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.file.name.replace(/\.[^.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setCopiedId(null);
    setErrorMsg(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-12">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25">
                <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.clear}
                </button>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6">
              <label
                className={`block border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 bg-white dark:bg-gray-800/30'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900/20">
                    <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-primary-500" />
                  </div>
                  <div className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                    {isDragOver ? t.dropHint : t.dragArea}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t.support}
                  </div>
                </div>
              </label>

              {errorMsg && (
                <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <span className="text-sm text-red-700 dark:text-red-300">{errorMsg}</span>
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">{t.noFile}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/30"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0 w-32 h-32 mx-auto sm:mx-0 rounded-xl bg-gray-100 dark:bg-gray-700/50 overflow-hidden">
                          <img
                            src={item.dataUrl}
                            alt={item.file.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {t.filename}
                              </span>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {item.file.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {t.size}
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {formatSize(item.file.size)}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {t.mime}
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {item.file.type || '—'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-col gap-2 flex-wrap sm:items-end">
                            <button
                              onClick={() => copyToClipboard(item.id + '-b64', item.base64)}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium"
                            >
                              {copiedId === item.id + '-b64' ? (
                                <>
                                  <Check className="h-4 w-4 text-green-500" />
                                  {t.copied}
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  {t.copy}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(item.id + '-url', item.dataUrl)}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg btn-primary text-xs sm:text-sm font-medium"
                            >
                              {copiedId === item.id + '-url' ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  {t.copied}
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  {t.copyShort}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => downloadTxt(item)}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Download className="h-4 w-4" />
                              {t.download}
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-xs sm:text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t.output}
                        </label>
                        <textarea
                          readOnly
                          value={item.dataUrl}
                          className="w-full font-mono text-xs h-28 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
