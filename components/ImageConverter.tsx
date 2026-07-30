'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImgIcon, Download, X, Settings, CheckCircle2, AlertCircle, ArrowRightLeft } from 'lucide-react';

interface ImageConverterProps { locale?: string; }

interface ConvertItem {
  id: string;
  file: File;
  name: string;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  outputBlob?: Blob;
  outputName?: string;
  error?: string;
  sizeIn?: number;
  sizeOut?: number;
}

type TargetFormat = 'png' | 'jpeg' | 'webp';

const i18n: Record<string, any> = {
  en: {
    title: 'Image Format Converter', sub: 'Convert PNG, JPG, WebP, GIF between formats. Batch supported, 100% local in your browser.',
    upload: 'Drop images here or click to select', or: 'or drag & drop',
    fromFormat: 'Source', targetFormat: 'Convert to',
    quality: 'Quality',
    convert: 'Convert All',
    downloadAll: 'Download All',
    remove: 'Remove', retry: 'Retry',
    formats: { png: 'PNG', jpeg: 'JPG', webp: 'WebP' },
    results: 'Results',
    tips: 'Supports PNG ↔ JPG ↔ WebP conversion. Transparent PNG→JPG gets white background. Quality slider only applies to JPG and WebP.',
    processing: 'Converting', done: 'Done', error: 'Error',
    allDone: 'Converted {n} images',
  },
  zh: {
    title: '图片格式转换器', sub: 'PNG/JPG/WebP/GIF 多格式互转，支持批量、质量调节，100% 本地浏览器处理不上传。',
    upload: '点击选择图片或拖到这里', or: '支持拖拽上传',
    fromFormat: '原格式', targetFormat: '转为',
    quality: '质量',
    convert: '全部转换',
    downloadAll: '下载全部',
    remove: '移除', retry: '重试',
    formats: { png: 'PNG', jpeg: 'JPG', webp: 'WebP' },
    results: '转换结果',
    tips: '支持 PNG↔JPG↔WebP 互转。PNG 透明背景转 JPG 会自动填充白色背景。质量滑块只对 JPG/WebP 生效。',
    processing: '转换中', done: '完成', error: '错误',
    allDone: '已转换 {n} 张图片',
  },
  es: { title: 'Convertidor de Imágenes', sub: 'Convierte PNG, JPG, WebP, GIF entre formatos. Lote admitido, 100% local en el navegador.',
    upload: 'Suelta imágenes aquí o haz clic para seleccionar', or: 'o arrastra y suelta',
    fromFormat: 'Origen', targetFormat: 'Convertir a',
    quality: 'Calidad', convert: 'Convertir Todos', downloadAll: 'Descargar Todos',
    remove: 'Quitar', retry: 'Reintentar', formats: { png: 'PNG', jpeg: 'JPG', webp: 'WebP' },
    results: 'Resultados', tips: 'Admite conversión PNG ↔ JPG ↔ WebP. PNG transparente → JPG obtiene fondo blanco.',
    processing: 'Convirtiendo', done: 'Listo', error: 'Error', allDone: '{n} imágenes convertidas', },
  fr: { title: 'Convertisseur d\'Images', sub: 'Convertissez PNG, JPG, WebP, GIF entre formats. Par lot, 100% local dans votre navigateur.',
    upload: 'Déposez les images ici ou cliquez pour sélectionner', or: 'ou glissez-déposez',
    fromFormat: 'Source', targetFormat: 'Convertir en',
    quality: 'Qualité', convert: 'Convertir Tout', downloadAll: 'Tout Télécharger',
    remove: 'Supprimer', retry: 'Réessayer', formats: { png: 'PNG', jpeg: 'JPG', webp: 'WebP' },
    results: 'Résultats', tips: 'Prend en charge la conversion PNG ↔ JPG ↔ WebP.',
    processing: 'Conversion', done: 'Terminé', error: 'Erreur', allDone: '{n} images converties', },
  hi: { title: 'छवि प्रारूप कनवर्टर', sub: 'PNG, JPG, WebP, GIF को एक दूसरे में बदलें। बैच समर्थित, 100% स्थानीय ब्राउज़र में।',
    upload: 'यहाँ छवियां ड्रॉप करें या चुनें', or: 'या ड्रैग एंड ड्रॉप करें',
    fromFormat: 'स्रोत', targetFormat: 'में बदलें',
    quality: 'गुणवत्ता', convert: 'सभी बदलें', downloadAll: 'सभी डाउनलोड करें',
    remove: 'हटाएं', retry: 'पुनः प्रयास करें', formats: { png: 'PNG', jpeg: 'JPG', webp: 'WebP' },
    results: 'परिणाम', tips: 'PNG ↔ JPG ↔ WebP रूपांतरण समर्थित।',
    processing: 'बदला जा रहा है', done: 'हो गया', error: 'त्रुटि', allDone: '{n} छवियां बदली गईं', },
  ar: { title: 'محول تنسيق الصور', sub: 'تحويل PNG و JPG و WebP و GIF بين التنسيقات. يدعم المجموعة، 100% محلي في المتصفح.',
    upload: 'أفلت الصور هنا أو انقر للاختيار', or: 'أو اسحب وأفلت',
    fromFormat: 'المصدر', targetFormat: 'تحويل إلى',
    quality: 'الجودة', convert: 'تحويل الكل', downloadAll: 'تحميل الكل',
    remove: 'إزالة', retry: 'إعادة المحاولة', formats: { png: 'PNG', jpeg: 'JPG', webp: 'WebP' },
    results: 'النتائج', tips: 'يدعم التحويل بين PNG و JPG و WebP.',
    processing: 'جاري التحويل', done: 'تم', error: 'خطأ', allDone: '{n} صورة تم تحويلها', },
};

export default function ImageConverter({ locale = 'zh' }: ImageConverterProps) {
  const t = i18n[locale] || i18n.en;
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('jpeg');
  const [quality, setQuality] = useState(85);
  const [dragOver, setDragOver] = useState(false);
  const [allDoneCount, setAllDoneCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newItems: ConvertItem[] = fileArray.map(f => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      file: f, name: f.name,
      preview: URL.createObjectURL(f),
      status: 'pending', sizeIn: f.size,
    }));
    setItems(prev => [...prev, ...newItems]);
    setAllDoneCount(0);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const it = prev.find(p => p.id === id);
      if (it?.preview) URL.revokeObjectURL(it.preview);
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const convertOne = (file: File, format: TargetFormat, q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d')!;
          if (format === 'jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
          canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error('toBlob returned null'));
          }, mime, q / 100);
        } catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const doConvert = useCallback(async () => {
    const pending = items.filter(i => i.status === 'pending' || i.status === 'error');
    for (const item of pending) {
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'processing' } : p));
      try {
        const blob = await convertOne(item.file, targetFormat, quality);
        const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
        const base = item.name.replace(/\.[^.]+$/, '');
        const newName = `${base}.${ext}`;
        setItems(prev => prev.map(p => p.id === item.id
          ? { ...p, status: 'done', outputBlob: blob, outputName: newName, sizeOut: blob.size }
          : p));
      } catch (e: any) {
        setItems(prev => prev.map(p => p.id === item.id
          ? { ...p, status: 'error', error: e.message || 'Conversion failed' }
          : p));
      }
    }
    setTimeout(() => {
      setItems(prev => {
        const done = prev.filter(p => p.status === 'done').length;
        setAllDoneCount(done);
        return prev;
      });
    }, 50);
  }, [items, targetFormat, quality]);

  const downloadOne = useCallback((item: ConvertItem) => {
    if (!item.outputBlob || !item.outputName) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(item.outputBlob);
    a.download = item.outputName;
    a.click();
  }, []);

  const downloadAll = useCallback(() => {
    const dones = items.filter(i => i.status === 'done' && i.outputBlob);
    dones.forEach((d, idx) => {
      setTimeout(() => downloadOne(d), idx * 150);
    });
  }, [items, downloadOne]);

  const clearAll = useCallback(() => {
    items.forEach(i => i.preview && URL.revokeObjectURL(i.preview));
    setItems([]);
    setAllDoneCount(0);
  }, [items]);

  const fmtSize = (n: number) => {
    if (!n) return '';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
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

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.targetFormat}</label>
            <select
              value={targetFormat}
              onChange={e => setTargetFormat(e.target.value as TargetFormat)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              {Object.entries(t.formats).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t.quality}: {quality}%</label>
            <input
              type="range" min={10} max={100} value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="w-full h-10 accent-sky-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={doConvert}
              disabled={items.filter(i => i.status === 'pending' || i.status === 'error').length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[40px] font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Settings size={16} className="animate-spin" style={{ animationPlayState: items.some(i => i.status === 'processing') ? 'running' : 'paused' }} />
              {t.convert}
            </button>
            <button
              onClick={downloadAll}
              disabled={items.filter(i => i.status === 'done').length === 0}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition min-h-[40px] font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              <span className="hidden sm:inline">{t.downloadAll}</span>
            </button>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[40px]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Upload zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center cursor-pointer transition ${
            dragOver
              ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        >
          <input
            ref={fileInputRef}
            type="file" accept="image/*" multiple
            className="hidden"
            onChange={e => e.target.files && addFiles(e.target.files)}
          />
          <Upload className="mx-auto mb-2 text-gray-400" size={36} />
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t.upload}</p>
          <p className="text-xs text-gray-400 mt-1">{t.or}</p>
        </div>
        {allDoneCount > 0 && (
          <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={14} />
            {t.allDone.replace('{n}', String(allDoneCount))}
          </div>
        )}
      </div>

      {/* Item list */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {t.results} ({items.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{item.name}</div>
                  <div className="text-[10px] text-gray-500 flex gap-2 items-center flex-wrap mt-0.5">
                    <span>{fmtSize(item.sizeIn)}</span>
                    {item.sizeOut && item.status === 'done' && (
                      <>
                        <span>→</span>
                        <span className={item.sizeOut < item.sizeIn ? 'text-emerald-600' : 'text-amber-600'}>
                          {fmtSize(item.sizeOut)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {item.status === 'done' && <CheckCircle2 size={12} className="text-emerald-500" />}
                    {item.status === 'processing' && <Settings size={12} className="text-sky-500 animate-spin" />}
                    {item.status === 'error' && <AlertCircle size={12} className="text-red-500" />}
                    <span className={`text-[10px] ${
                      item.status === 'done' ? 'text-emerald-600'
                        : item.status === 'error' ? 'text-red-500'
                        : item.status === 'processing' ? 'text-sky-600' : 'text-gray-500'
                    }`}>
                      {item.status === 'done' ? t.done : item.status === 'error' ? (item.error || t.error)
                        : item.status === 'processing' ? t.processing : `→ ${t.formats[targetFormat]}`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {item.status === 'done' ? (
                    <button
                      onClick={() => downloadOne(item)}
                      className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                    >
                      <Download size={14} />
                    </button>
                  ) : item.status === 'error' ? (
                    <button
                      onClick={doConvert}
                      className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition text-[10px]"
                    >
                      {t.retry}
                    </button>
                  ) : null}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2">
        <ImgIcon size={12} className="inline mr-1" />
        {t.tips}
      </div>
    </div>
  );
}