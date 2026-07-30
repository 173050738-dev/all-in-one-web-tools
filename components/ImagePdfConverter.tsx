'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImgIcon, FileText, Download, X, Settings, CheckCircle2, AlertCircle, Layers, TrendingUp, MoveHorizontal } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface ImagePdfConverterProps { locale?: string; }
type Mode = 'img2pdf' | 'pdf2img';

interface ImgItem {
  id: string; file: File; name: string;
  preview: string; width?: number; height?: number;
}

interface PdfPageResult {
  index: number;
  url: string;
  blob?: Blob;
}

const PAGE_PRESETS = [
  { id: 'a4', w: 595, h: 842, name: 'A4' },
  { id: 'a4l', w: 842, h: 595, name: 'A4 (横)' },
  { id: 'letter', w: 612, h: 792, name: 'Letter' },
  { id: 'fit', w: 0, h: 0, name: '原尺寸' },
];

const i18n: Record<string, any> = {
  en: {
    title: 'Image ↔ PDF Converter', sub: 'Combine images into one PDF, or extract every page of a PDF as images. 100% browser-local processing.',
    img2pdf: 'Images → PDF', pdf2img: 'PDF → Images',
    upload: 'Drop files here or click to select',
    pageSize: 'Page Size', orientation: 'Orientation',
    margin: 'Page Margin', quality: 'Image Quality',
    outputFormat: 'Output Format',
    generate: 'Generate PDF', extract: 'Extract Pages',
    download: 'Download', downloadAll: 'Download All',
    remove: 'Remove',
    tips_img: 'Drag to reorder pages (not supported yet). Add images and adjust page size — click Generate to create PDF.',
    tips_pdf: 'Upload one PDF file, then extract every page as individual PNG or JPG images.',
    pages: 'pages', processing: 'Processing', done: 'Done', error: 'Error',
    pageCount: '{n} images → {p} pages',
    extracted: '{n} pages extracted',
  },
  zh: {
    title: '图片 ↔ PDF 互转工具', sub: '把多张图片合成一个 PDF，或把 PDF 每页导出为图片。100% 浏览器本地处理，零上传。',
    img2pdf: '图片 → PDF', pdf2img: 'PDF → 图片',
    upload: '点击选择文件或拖到这里',
    pageSize: '纸张尺寸', orientation: '方向',
    margin: '页边距', quality: '导出质量',
    outputFormat: '图片格式',
    generate: '生成 PDF', extract: '导出每页',
    download: '下载', downloadAll: '下载全部',
    remove: '移除',
    tips_img: '添加图片后可调整纸张大小，点击生成 PDF。支持 JPG/PNG/WebP/GIF。',
    tips_pdf: '上传一个 PDF 文件，把每一页导出为 PNG 或 JPG 独立图片。',
    pages: '页', processing: '处理中', done: '完成', error: '错误',
    pageCount: '{n} 张图 → {p} 页',
    extracted: '已导出 {n} 页',
  },
  es: { title: 'Convertidor Imágenes ↔ PDF', sub: 'Combina imágenes en un PDF o extrae cada página del PDF como imagen. 100% local.',
    img2pdf: 'Imágenes → PDF', pdf2img: 'PDF → Imágenes',
    upload: 'Suelta archivos aquí o haz clic para seleccionar',
    pageSize: 'Tamaño de hoja', orientation: 'Orientación', margin: 'Margen', quality: 'Calidad', outputFormat: 'Formato',
    generate: 'Generar PDF', extract: 'Extraer páginas', download: 'Descargar', downloadAll: 'Descargar todo', remove: 'Quitar',
    tips_img: 'Añade imágenes, ajusta el tamaño, genera el PDF.',
    tips_pdf: 'Sube un PDF y extrae todas las páginas como imágenes.',
    pages: 'páginas', processing: 'Procesando', done: 'Listo', error: 'Error',
    pageCount: '{n} imágenes → {p} pág.', extracted: '{n} páginas extraídas',
  },
  fr: { title: 'Convertisseur Images ↔ PDF', sub: 'Combinez des images en PDF ou extrayez chaque page du PDF en image. 100% local.',
    img2pdf: 'Images → PDF', pdf2img: 'PDF → Images',
    upload: 'Déposez les fichiers ici ou cliquez',
    pageSize: 'Format', orientation: 'Orientation', margin: 'Marge', quality: 'Qualité', outputFormat: 'Format',
    generate: 'Générer le PDF', extract: 'Extraire', download: 'Télécharger', downloadAll: 'Tout télécharger', remove: 'Supprimer',
    tips_img: 'Ajoutez des images, ajustez la taille, générez.',
    tips_pdf: 'Téléversez un PDF, extrayez les pages en images.',
    pages: 'pages', processing: 'Traitement', done: 'Terminé', error: 'Erreur',
    pageCount: '{n} images → {p} pages', extracted: '{n} pages extraites',
  },
  hi: { title: 'छवियां ↔ PDF कनवर्टर', sub: 'छवियों को PDF में या PDF के हर पृष्ठ को छवि में बदलें। 100% स्थानीय।',
    img2pdf: 'छवियां → PDF', pdf2img: 'PDF → छवियां',
    upload: 'फ़ाइलें यहां ड्रॉप करें या चुनें',
    pageSize: 'पेज साइज़', orientation: 'ओरिएंटेशन', margin: 'मार्जिन', quality: 'गुणवत्ता', outputFormat: 'प्रारूप',
    generate: 'PDF बनाएं', extract: 'पेज निकालें', download: 'डाउनलोड', downloadAll: 'सभी डाउनलोड करें', remove: 'हटाएं',
    tips_img: 'छवियां जोड़ें, साइज़ चुनें, PDF बनाएं।',
    tips_pdf: 'एक PDF अपलोड करें और हर पेज को छवि के रूप में निकालें।',
    pages: 'पेज', processing: 'बन रहा है', done: 'हो गया', error: 'त्रुटि',
    pageCount: '{n} छवियां → {p} पेज', extracted: '{n} पेज निकाले गए',
  },
  ar: { title: 'محول الصور ↔ PDF', sub: 'اجمع صورًا في PDF واحد أو استخرج كل صفحة PDF كصورة. محلي 100%.',
    img2pdf: 'صور → PDF', pdf2img: 'PDF → صور',
    upload: 'أفلت الملفات هنا أو انقر للاختيار',
    pageSize: 'حجم الصفحة', orientation: 'الاتجاه', margin: 'الهامش', quality: 'الجودة', outputFormat: 'التنسيق',
    generate: 'إنشاء PDF', extract: 'استخراج الصفحات', download: 'تحميل', downloadAll: 'تحميل الكل', remove: 'إزالة',
    tips_img: 'أضف صورًا، اضبط الحجم، أنشئ PDF.',
    tips_pdf: 'ارفع PDFًا، استخرج كل صفحة كصورة منفصلة.',
    pages: 'صفحات', processing: 'قيد المعالجة', done: 'تم', error: 'خطأ',
    pageCount: '{n} صورة → {p} صفحة', extracted: 'تم استخراج {n} صفحة',
  },
};

export default function ImagePdfConverter({ locale = 'zh' }: ImagePdfConverterProps) {
  const t = i18n[locale] || i18n.en;
  const [mode, setMode] = useState<Mode>('img2pdf');
  const [imgs, setImgs] = useState<ImgItem[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageResult[]>([]);
  const [pagePreset, setPagePreset] = useState('a4');
  const [margin, setMargin] = useState(20);
  const [quality, setQuality] = useState(92);
  const [outFmt, setOutFmt] = useState<'png' | 'jpeg'>('png');
  const [status, setStatus] = useState<'idle' | 'proc' | 'done' | 'err'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [info, setInfo] = useState('');
  const imgInput = useRef<HTMLInputElement>(null);
  const pdfInput = useRef<HTMLInputElement>(null);
  const pdfjsLibRef = useRef<any>(null);

  const loadPdfjs = async (): Promise<any> => {
    if (pdfjsLibRef.current) return pdfjsLibRef.current;
    const SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    if (!(window as any).pdfjsLib) {
      await new Promise<void>((res, rej) => {
        const s = document.createElement('script');
        s.src = SCRIPT; s.onload = () => res(); s.onerror = () => rej(new Error('Failed to load PDF.js'));
        document.head.appendChild(s);
      });
    }
    const lib = (window as any).pdfjsLib;
    if (lib && !lib.GlobalWorkerOptions.workerSrc) {
      try { lib.GlobalWorkerOptions.workerSrc = WORKER; } catch {}
    }
    pdfjsLibRef.current = lib;
    return lib;
  };

  const addImages = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    const ni: ImgItem[] = arr.map(f => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file: f, name: f.name, preview: URL.createObjectURL(f),
    }));
    setImgs(p => [...p, ...ni]);
    setPdfBlob(null); setStatus('idle'); setInfo('');
  }, []);

  const setPdf = useCallback((f: File) => {
    setPdfFile(f); setPages([]); setStatus('idle'); setErrMsg(''); setInfo('');
  }, []);

  const removeImg = useCallback((id: string) => {
    setImgs(p => {
      const i = p.find(x => x.id === id);
      if (i?.preview) URL.revokeObjectURL(i.preview);
      return p.filter(x => x.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    imgs.forEach(i => i.preview && URL.revokeObjectURL(i.preview));
    pages.forEach(p => p.url && URL.revokeObjectURL(p.url));
    setImgs([]); setPdfFile(null); setPages([]);
    setPdfBlob(null); setStatus('idle'); setInfo(''); setErrMsg('');
  }, [imgs, pages]);

  /* ---------------- Images → PDF (uses pdf-lib) ---------------- */
  const imgToPdf = useCallback(async () => {
    if (imgs.length === 0) return;
    setStatus('proc'); setErrMsg(''); setPdfBlob(null);
    try {
      const pdfDoc = await PDFDocument.create();
      const preset = PAGE_PRESETS.find(p => p.id === pagePreset) || PAGE_PRESETS[0];
      for (const item of imgs) {
        const bytes = await item.file.arrayBuffer();
        let img: any;
        try {
          if (item.file.type === 'image/png') img = await pdfDoc.embedPng(bytes);
          else if (item.file.type === 'image/jpeg') img = await pdfDoc.embedJpg(bytes);
          else {
            // Convert non-PNG/JPG via canvas → PNG
            const blob = await new Promise<Blob>((resolve, reject) => {
              const im = new Image();
              im.onload = () => {
                const c = document.createElement('canvas');
                c.width = im.naturalWidth; c.height = im.naturalHeight;
                c.getContext('2d')!.drawImage(im, 0, 0);
                c.toBlob(b => b ? resolve(b) : reject(new Error('canvas')), 'image/png');
              };
              im.onerror = () => reject(new Error('img load fail'));
              im.src = item.preview;
            });
            img = await pdfDoc.embedPng(await blob.arrayBuffer());
          }
        } catch { continue; }
        const pw = preset.w || img.width + margin * 2;
        const ph = preset.h || img.height + margin * 2;
        const page = pdfDoc.addPage([pw, ph]);
        const iw = pw - margin * 2;
        const ih = ph - margin * 2;
        const r = Math.min(iw / img.width, ih / img.height);
        const dw = img.width * r;
        const dh = img.height * r;
        const dx = margin + (iw - dw) / 2;
        const dy = margin + (ih - dh) / 2;
        page.drawImage(img, { x: dx, y: ph - dh - dy, width: dw, height: dh });
      }
      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setPdfBlob(blob);
      setStatus('done');
      setInfo(t.pageCount.replace('{n}', String(imgs.length)).replace('{p}', String(imgs.length)));
    } catch (e: any) {
      console.error(e);
      setErrMsg(e?.message || 'Failed to build PDF');
      setStatus('err');
    }
  }, [imgs, pagePreset, margin, t]);

  /* ---------------- PDF → Images (uses pdf.js CDN) ---------------- */
  const pdfToImages = useCallback(async () => {
    if (!pdfFile) return;
    setStatus('proc'); setErrMsg(''); setPages([]);
    try {
      const pdfjs = await loadPdfjs();
      const buf = await pdfFile.arrayBuffer();
      const loading = await pdfjs.getDocument({ data: buf }).promise;
      const total = loading.numPages;
      const results: PdfPageResult[] = [];
      const scale = quality / 40;
      for (let i = 1; i <= total; i++) {
        const page = await loading.getPage(i);
        const vp = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        if (outFmt === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        const blob: Blob = await new Promise((res, rej) => {
          canvas.toBlob(b => b ? res(b) : rej(new Error('blob fail')),
            outFmt === 'jpeg' ? 'image/jpeg' : 'image/png', quality / 100);
        });
        results.push({ index: i, url: URL.createObjectURL(blob), blob });
      }
      setPages(results);
      setStatus('done');
      setInfo(t.extracted.replace('{n}', String(results.length)));
    } catch (e: any) {
      console.error(e);
      setErrMsg(e?.message || 'Failed to extract');
      setStatus('err');
    }
  }, [pdfFile, quality, outFmt, t]);

  const downloadPdf = () => {
    if (!pdfBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(pdfBlob);
    a.download = `images-to-pdf-${Date.now()}.pdf`;
    a.click();
  };

  const downloadPage = (p: PdfPageResult) => {
    const a = document.createElement('a');
    a.href = p.url;
    a.download = `page-${p.index.toString().padStart(3, '0')}.${outFmt === 'jpeg' ? 'jpg' : 'png'}`;
    a.click();
  };

  const downloadAllPages = () => {
    pages.forEach((p, idx) => setTimeout(() => downloadPage(p), idx * 180));
  };

  return (
    <div className="w-full max-w-5xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <MoveHorizontal className="text-sky-500" size={24} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.sub}</p>
      </div>

      {/* Mode switch */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => { setMode('img2pdf'); clearAll(); }}
          className={`px-4 py-2 rounded-xl min-h-[40px] text-sm font-medium transition ${
            mode === 'img2pdf' ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          <ImgIcon size={16} className="inline mr-1.5" />{t.img2pdf}
        </button>
        <button
          onClick={() => { setMode('pdf2img'); clearAll(); }}
          className={`px-4 py-2 rounded-xl min-h-[40px] text-sm font-medium transition ${
            mode === 'pdf2img' ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          <FileText size={16} className="inline mr-1.5" />{t.pdf2img}
        </button>
      </div>

      {mode === 'img2pdf' ? (
        <>
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.pageSize}</label>
                <select
                  value={pagePreset}
                  onChange={e => setPagePreset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[40px]"
                >
                  {PAGE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.margin}: {margin}pt</label>
                <input type="range" min={0} max={60} value={margin}
                  onChange={e => setMargin(+e.target.value)} className="w-full h-10 accent-sky-500" />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={imgToPdf}
                  disabled={imgs.length === 0 || status === 'proc'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[40px] font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Layers size={16} /> {t.generate}
                </button>
                {imgs.length > 0 && (
                  <button onClick={clearAll} className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 min-h-[40px]">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Upload */}
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                dragOver ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={() => imgInput.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files); }}
            >
              <input ref={imgInput} type="file" accept="image/*" multiple className="hidden"
                onChange={e => e.target.files && addImages(e.target.files)} />
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600 dark:text-gray-300">{t.upload}</p>
            </div>

            {/* Images grid */}
            {imgs.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-4">
                {imgs.map((i, idx) => (
                  <div key={i.id} className="relative group">
                    <img src={i.preview} alt={i.name}
                      className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-white" />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </div>
                    <button
                      onClick={() => removeImg(i.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100"
                    ><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {status === 'done' && pdfBlob && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
                  <CheckCircle2 size={18} /> {info}
                </div>
                <button onClick={downloadPdf}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition min-h-[40px] font-medium flex items-center gap-2">
                  <Download size={16} /> {t.download}
                </button>
              </div>
            )}
            {status === 'err' && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 text-red-600 dark:text-red-300 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {errMsg}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2">
            <Layers size={12} className="inline mr-1" /> {t.tips_img}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.outputFormat}</label>
                <select value={outFmt} onChange={e => setOutFmt(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[40px]">
                  <option value="png">PNG</option>
                  <option value="jpeg">JPG</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.quality}: {quality}%</label>
                <input type="range" min={20} max={100} value={quality}
                  onChange={e => setQuality(+e.target.value)} className="w-full h-10 accent-sky-500" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={pdfToImages} disabled={!pdfFile || status === 'proc'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[40px] font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                  <TrendingUp size={16} /> {t.extract}
                </button>
                {pdfFile && (
                  <button onClick={clearAll} className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 min-h-[40px]">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Upload PDF */}
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                dragOver ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={() => pdfInput.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault(); setDragOver(false);
                const f = [...e.dataTransfer.files].find(x => x.type === 'application/pdf');
                if (f) setPdf(f);
              }}
            >
              <input ref={pdfInput} type="file" accept="application/pdf" className="hidden"
                onChange={e => e.target.files?.[0] && setPdf(e.target.files[0])} />
              <FileText className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600 dark:text-gray-300">{t.upload}</p>
              {pdfFile && <p className="text-xs text-sky-600 mt-2">{pdfFile.name} ({(pdfFile.size/1024/1024).toFixed(2)} MB)</p>}
            </div>

            {status === 'done' && pages.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 mb-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
                  <CheckCircle2 size={18} /> {info}
                </div>
                <button onClick={downloadAllPages}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition min-h-[40px] font-medium flex items-center gap-2">
                  <Download size={16} /> {t.downloadAll}
                </button>
              </div>
            )}

            {status === 'err' && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 text-red-600 dark:text-red-300 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {errMsg}
              </div>
            )}

            {pages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {pages.map(p => (
                  <div key={p.index} className="border border-gray-100 dark:border-gray-700 rounded-xl p-2 bg-gray-50 dark:bg-gray-900/50">
                    <img src={p.url} alt={`page ${p.index}`}
                      className="w-full h-32 object-contain rounded-lg bg-white mb-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-300">#{p.index.toString().padStart(3, '0')}</span>
                      <button onClick={() => downloadPage(p)}
                        className="p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2">
            <Settings size={12} className="inline mr-1" /> {t.tips_pdf}
          </div>
        </>
      )}
    </div>
  );
}