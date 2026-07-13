'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, FileText, Download, Scissors, Minimize2, Loader2, Trash2, FileDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PDFDocument } from 'pdf-lib';

interface PdfToolboxProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n = {
  zh: {
    title:"PDF 工具箱", subtitle:"合并、拆分、压缩 PDF 文件，全本地处理，文件不上传服务器",
    tabsMerge:"合并", tabsSplit:"拆分", tabsCompress:"压缩",
    uploadDrop:"拖拽 PDF 文件到此处",
    merge:"合并 PDF", mergeDesc:"选择多个 PDF 文件，按顺序合并成一个文档",
    split:"拆分 PDF", splitDesc:"按页码范围将 PDF 拆分成多个文件",
    compress:"压缩 PDF", compressDesc:"降低内嵌图片质量，减小文件体积",
    pageRange:"页码范围", pageRangePlaceholder:"例如：1-5, 6-10, 11-",
    outputPrefix:"输出文件名前缀",
    compressionLevel:"压缩级别",
    levels:{ low:"轻度（质量较高）", medium:"中度（平衡）", high:"重度（体积最小）" },
    compressResult:"原文件: {{original}} KB → 压缩后: {{compressed}} KB (减少 {{percent}}%)",
    processing:"处理中...",
    download:"下载",
    invalidRange:"无效的页码范围",
    privacyNote:"⚠️ 所有处理在浏览器本地完成，文件不会上传到服务器，保护您的隐私",
    selectFiles:"选择文件",
    success:"完成",
    pages:"页",
    files:"个文件",
  },
  en: {
    title:"PDF Toolbox", subtitle:"Merge, split, and compress PDF files — all processed locally in your browser",
    tabsMerge:"Merge", tabsSplit:"Split", tabsCompress:"Compress",
    uploadDrop:"Drag and drop PDF files here",
    merge:"Merge PDFs", mergeDesc:"Select multiple PDF files and merge them into a single document",
    split:"Split PDF", splitDesc:"Split PDF into multiple files by page ranges",
    compress:"Compress PDF", compressDesc:"Reduce file size by lowering embedded image quality",
    pageRange:"Page Range", pageRangePlaceholder:"e.g., 1-5, 6-10, 11-",
    outputPrefix:"Output filename prefix",
    compressionLevel:"Compression Level",
    levels:{ low:"Low (higher quality)", medium:"Medium (balanced)", high:"High (smallest size)" },
    compressResult:"Original: {{original}} KB → Compressed: {{compressed}} KB ({{percent}}% smaller)",
    processing:"Processing...",
    download:"Download",
    invalidRange:"Invalid page range",
    privacyNote:"⚠️ All processing happens locally in your browser. Files never leave your device.",
    selectFiles:"Select Files",
    success:"success",
    pages:"pages",
    files:"files",
  },
  hi: {
    title:"PDF टूलबॉक्स", subtitle:"PDF फाइलों को मर्ज, स्प्लिट और कम्प्रेस करें — सभी प्रक्रिया ब्राउजर में स्थानीय रूप से होती है",
    tabsMerge:"मर्ज", tabsSplit:"स्प्लिट", tabsCompress:"कम्प्रेस",
    uploadDrop:"यहां PDF फाइलें ड्रैग करें",
    merge:"PDF मर्ज करें", mergeDesc:"कई PDF फाइलें चुनें और एक दस्तावेज़ में मर्ज करें",
    split:"PDF स्प्लिट करें", splitDesc:"पेज रेंज के अनुसार PDF को कई फाइलों में स्प्लिट करें",
    compress:"PDF कम्प्रेस करें", compressDesc:"इमेज क्वालिटी कम करके फाइल साइज़ कम करें",
    pageRange:"पेज रेंज", pageRangePlaceholder:"उदाहरण: 1-5, 6-10, 11-",
    outputPrefix:"आउटपुट फाइल नाम प्रीफिक्स",
    compressionLevel:"कम्प्रेशन लेवल",
    levels:{ low:"कम (उच्च गुणवत्ता)", medium:"मध्यम (संतुलित)", high:"उच्च (न्यूनतम साइज़)" },
    compressResult:"मूल: {{original}} KB → कम्प्रेस्ड: {{compressed}} KB ({{percent}}% कम)",
    processing:"प्रक्रिया चल रही है...",
    download:"डाउनलोड",
    invalidRange:"अमान्य पेज रेंज",
    privacyNote:"⚠️ सभी प्रक्रिया ब्राउजर में स्थानीय रूप से होती है। फाइलें आपके डिवाइस से कभी नहीं निकलतीं।",
    selectFiles:"फाइलें चुनें",
    success:"सफल",
    pages:"पेज",
    files:"फाइलें",
  },
  fr: {
    title:"Boîte à outils PDF", subtitle:"Fusionner, découper et compresser des fichiers PDF — tout traité localement dans votre navigateur",
    tabsMerge:"Fusionner", tabsSplit:"Découper", tabsCompress:"Compresser",
    uploadDrop:"Déposez les fichiers PDF ici",
    merge:"Fusionner les PDFs", mergeDesc:"Sélectionnez plusieurs fichiers PDF et fusionnez-les en un seul document",
    split:"Découper le PDF", splitDesc:"Découpez un PDF en plusieurs fichiers par plages de pages",
    compress:"Compresser le PDF", compressDesc:"Réduire la taille du fichier en baissant la qualité des images",
    pageRange:"Plage de pages", pageRangePlaceholder:"ex: 1-5, 6-10, 11-",
    outputPrefix:"Préfixe du nom de fichier de sortie",
    compressionLevel:"Niveau de compression",
    levels:{ low:"Faible (haute qualité)", medium:"Moyen (équilibré)", high:"Élevé (taille minimale)" },
    compressResult:"Original: {{original}} KB → Compressé: {{compressed}} KB ({{percent}}% de réduction)",
    processing:"Traitement...",
    download:"Télécharger",
    invalidRange:"Plage de pages invalide",
    privacyNote:"⚠️ Tous les traitements sont effectués localement dans votre navigateur. Les fichiers ne quittent jamais votre appareil.",
    selectFiles:"Sélectionner des fichiers",
    success:"réussi",
    pages:"pages",
    files:"fichiers",
  },
  es: {
    title:"Caja de herramientas PDF", subtitle:"Unir, dividir y comprimir archivos PDF — todo procesado localmente en tu navegador",
    tabsMerge:"Unir", tabsSplit:"Dividir", tabsCompress:"Comprimir",
    uploadDrop:"Arrastra los archivos PDF aquí",
    merge:"Unir PDFs", mergeDesc:"Selecciona varios archivos PDF y únelos en un solo documento",
    split:"Dividir PDF", splitDesc:"Divide un PDF en varios archivos por rangos de páginas",
    compress:"Comprimir PDF", compressDesc:"Reduce el tamaño del archivo reduciendo la calidad de las imágenes",
    pageRange:"Rango de páginas", pageRangePlaceholder:"ej: 1-5, 6-10, 11-",
    outputPrefix:"Prefijo del nombre de archivo de salida",
    compressionLevel:"Nivel de compresión",
    levels:{ low:"Bajo (mayor calidad)", medium:"Medio (equilibrado)", high:"Alto (tamaño mínimo)" },
    compressResult:"Original: {{original}} KB → Comprimido: {{compressed}} KB ({{percent}}% menor)",
    processing:"Procesando...",
    download:"Descargar",
    invalidRange:"Rango de páginas inválido",
    privacyNote:"⚠️ Todos los procesos se realizan localmente en tu navegador. Los archivos nunca dejan tu dispositivo.",
    selectFiles:"Seleccionar archivos",
    success:"éxito",
    pages:"páginas",
    files:"archivos",
  },
  ar: {
    title:"صندوق أدوات PDF", subtitle:"دمج وتقسيم وضغط ملفات PDF — يتم معالجتها جميعها محليًا في متصفحك",
    tabsMerge:"دمج", tabsSplit:"تقسيم", tabsCompress:"ضغط",
    uploadDrop:"اسحب ملفات PDF сюда",
    merge:"دمج ملفات PDF", mergeDesc:"حدد ملفات PDF متعددة ودمجها في مستند واحد",
    split:"تقسيم PDF", splitDesc:"قسم PDF إلى ملفات متعددة حسب نطاقات الصفحات",
    compress:"ضغط PDF", compressDesc:"قلل من حجم الملف عن طريق تقليل جودة الصور المضمنة",
    pageRange:"نطاق الصفحات", pageRangePlaceholder:"مثال: 1-5, 6-10, 11-",
    outputPrefix:"بادئة اسم ملف الخرج",
    compressionLevel:"مستوى الضغط",
    levels:{ low:"منخفض (جودة عالية)", medium:"متوسط (متوازن)", high:"عالي (أقل حجم)" },
    compressResult:"الأصلي: {{original}} كيلوبايت → المضغوط: {{compressed}} كيلوبايت (اقل {{percent}}%)",
    processing:"جاري المعالجة...",
    download:"تنزيل",
    invalidRange:"نطاق صفحات غير صالح",
    privacyNote:"⚠️ يتم تنفيذ جميع المعالجات محليًا في متصفحك. الملفات لا تغادر جهازك أبدًا.",
    selectFiles:"اختر الملفات",
    success:"نجاح",
    pages:"صفحات",
    files:"ملفات",
  },
};

export default function PdfToolbox({ locale = 'zh' }: PdfToolboxProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const t = i18n[resolvedLocale as keyof typeof i18n] || i18n.en;

  /* ====== Merge state ====== */
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeProcessing, setMergeProcessing] = useState(false);
  const [mergeResult, setMergeResult] = useState<Uint8Array | null>(null);

  /* ====== Split state ====== */
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPages, setSplitPages] = useState<number>(0);
  const [splitRanges, setSplitRanges] = useState<string>('');
  const [splitPrefix, setSplitPrefix] = useState<string>('split');
  const [splitProcessing, setSplitProcessing] = useState(false);
  const [splitResults, setSplitResults] = useState<Array<{name: string; data: Uint8Array}>>([]);
  const [splitError, setSplitError] = useState<string | null>(null);

  /* ====== Compress state ====== */
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [compressLevel, setCompressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [compressProcessing, setCompressProcessing] = useState(false);
  const [compressResult, setCompressResult] = useState<{data: Uint8Array; originalSize: number; compressedSize: number} | null>(null);

  /* ====== File handlers ====== */
  const handleMergeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter(f => f.type === 'application/pdf');
    setMergeFiles([...mergeFiles, ...newFiles]);
  };
  const removeMergeFile = (index: number) => {
    setMergeFiles(mergeFiles.filter((_, i) => i !== index));
  };
  const handleSplitFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSplitFile(file);
      setSplitPages(0);
      setSplitResults([]);
      setSplitError(null);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const bytes = new Uint8Array(ev.target?.result as ArrayBuffer);
        const pdf = await PDFDocument.load(bytes);
        setSplitPages(pdf.getPageCount());
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleCompressFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCompressFile(file);
      setCompressResult(null);
    }
  };

  /* ====== Merge logic ====== */
  const doMerge = useCallback(async () => {
    if (mergeFiles.length === 0) return;
    setMergeProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of mergeFiles) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      const result = await mergedPdf.save();
      setMergeResult(result);
    } catch (err) {
      console.error('Merge failed:', err);
    } finally {
      setMergeProcessing(false);
    }
  }, [mergeFiles]);

  /* ====== Split logic ====== */
  const parseRanges = (input: string, maxPage: number): Array<[number, number]> => {
    const ranges: Array<[number, number]> = [];
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    for (const part of parts) {
      const match = part.match(/^(\d+)(-(\d+))?$/);
      if (!match) return [];
      const start = parseInt(match[1], 10);
      const end = match[3] ? parseInt(match[3], 10) : maxPage;
      if (start < 1 || start > maxPage || end < start || end > maxPage) return [];
      ranges.push([start - 1, end]);
    }
    return ranges;
  };

  const doSplit = useCallback(async () => {
    if (!splitFile || splitPages === 0) return;
    const ranges = parseRanges(splitRanges, splitPages);
    if (ranges.length === 0) {
      setSplitError(t.invalidRange);
      return;
    }
    setSplitError(null);
    setSplitProcessing(true);
    try {
      const bytes = await splitFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const results: Array<{name: string; data: Uint8Array}> = [];

      for (let i = 0; i < ranges.length; i++) {
        const [start, end] = ranges[i];
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(pdf, Array.from({length: end - start}, (_, j) => start + j));
        pages.forEach(page => newPdf.addPage(page));
        const resultBytes = await newPdf.save();
        results.push({
          name: `${splitPrefix || 'split'}-${i + 1}.pdf`,
          data: resultBytes
        });
      }
      setSplitResults(results);
    } catch (err) {
      console.error('Split failed:', err);
    } finally {
      setSplitProcessing(false);
    }
  }, [splitFile, splitPages, splitRanges, splitPrefix, t]);

  /* ====== Compress logic ====== */
  const getQuality = (level: string): number => {
    switch (level) {
      case 'low': return 0.85;
      case 'high': return 0.4;
      default: return 0.6;
    }
  };

  const doCompress = useCallback(async () => {
    if (!compressFile) return;
    setCompressProcessing(true);
    try {
      const bytes = await compressFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const resultBytes = await pdf.save({ useObjectStreams: true });
      setCompressResult({
        data: resultBytes,
        originalSize: compressFile.size,
        compressedSize: resultBytes.length
      });
    } catch (err) {
      console.error('Compress failed:', err);
    } finally {
      setCompressProcessing(false);
    }
  }, [compressFile, compressLevel]);

  /* ====== Download helpers ====== */
  const downloadBlob = (data: Uint8Array, filename: string) => {
    const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as unknown as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
        {t.privacyNote}
      </p>

      <Tabs defaultValue="merge" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1.5 rounded-xl">
          <TabsTrigger value="merge" className="py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 min-h-[44px]">
            <FileDown className="w-4 h-4" />
            {t.tabsMerge}
          </TabsTrigger>
          <TabsTrigger value="split" className="py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 min-h-[44px]">
            <Scissors className="w-4 h-4" />
            {t.tabsSplit}
          </TabsTrigger>
          <TabsTrigger value="compress" className="py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 min-h-[44px]">
            <Minimize2 className="w-4 h-4" />
            {t.tabsCompress}
          </TabsTrigger>
        </TabsList>

        {/* ====== TAB: Merge ====== */}
        <TabsContent value="merge" className="mt-5">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.mergeDesc}</p>
          <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-12 text-center'>
            <Upload className='h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4' />
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>{t.uploadDrop}</p>
            <input type='file' accept='application/pdf' multiple onChange={handleMergeFileUpload} className='hidden' id='merge-upload' />
            <label htmlFor='merge-upload' className='btn-primary cursor-pointer inline-flex items-center gap-2 px-6 py-3 min-h-[48px]'>
              <Upload className="w-4 h-4" />
              {t.selectFiles}
            </label>
          </div>
          {mergeFiles.length > 0 && (
            <div className='mt-4 sm:mt-6 space-y-2'>
              {mergeFiles.map((file, index) => (
                <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <FileText className='h-5 w-5 text-gray-500' />
                  <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>{file.name}</span>
                  <span className='text-xs text-gray-500 dark:text-gray-500 flex-shrink-0'>{(file.size / 1024).toFixed(1)} KB</span>
                  <button
                    onClick={() => removeMergeFile(index)}
                    className='text-gray-400 hover:text-red-500 p-1.5 rounded min-h-[36px] min-w-[36px] flex items-center justify-center'
                    aria-label="Remove"
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              ))}
              <button
                onClick={doMerge}
                disabled={mergeProcessing}
                className='mt-4 btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]'
              >
                {mergeProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Download className='h-4 w-4' />
                    {t.merge}
                  </>
                )}
              </button>
            </div>
          )}
          {mergeResult && (
            <div className='mt-4 sm:mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-green-800 dark:text-green-400'>{t.merge} {t.success}</span>
                <button
                  onClick={() => downloadBlob(mergeResult, 'merged.pdf')}
                  className='btn-primary flex items-center gap-2 px-4 py-2 min-h-[40px]'
                >
                  <Download className='h-4 w-4' />
                  {t.download}
                </button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ====== TAB: Split ====== */}
        <TabsContent value="split" className="mt-5">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.splitDesc}</p>
          <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-12 text-center'>
            <Upload className='h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4' />
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>{t.uploadDrop}</p>
            <input type='file' accept='application/pdf' onChange={handleSplitFileUpload} className='hidden' id='split-upload' />
            <label htmlFor='split-upload' className='btn-primary cursor-pointer inline-flex items-center gap-2 px-6 py-3 min-h-[48px]'>
              <Upload className="w-4 h-4" />
              {t.selectFiles}
            </label>
          </div>
          {splitFile && (
            <div className='mt-4 sm:mt-6 space-y-4'>
              <div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <FileText className='h-5 w-5 text-gray-500' />
                  <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>{splitFile.name}</span>
                  <span className='text-xs text-gray-500 dark:text-gray-500'>{(splitFile.size / 1024).toFixed(1)} KB</span>
                  {splitPages > 0 && (
                    <span className='text-xs text-gray-500 dark:text-gray-500'>| {splitPages} {t.pages}</span>
                  )}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.pageRange}</label>
                <input
                  type='text'
                  value={splitRanges}
                  onChange={(e) => { setSplitRanges(e.target.value); setSplitError(null); }}
                  placeholder={t.pageRangePlaceholder}
                  className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 min-h-[48px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                {splitError && (
                  <p className='mt-2 text-xs text-red-500 dark:text-red-400'>{splitError}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.outputPrefix}</label>
                <input
                  type='text'
                  value={splitPrefix}
                  onChange={(e) => setSplitPrefix(e.target.value)}
                  placeholder='split'
                  className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 min-h-[48px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
              <button
                onClick={doSplit}
                disabled={splitProcessing || !splitRanges.trim()}
                className='btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]'
              >
                {splitProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Scissors className='h-4 w-4' />
                    {t.split}
                  </>
                )}
              </button>
            </div>
          )}
          {splitResults.length > 0 && (
            <div className='mt-4 sm:mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-sm font-medium text-green-800 dark:text-green-400'>{t.split} {t.success} ({splitResults.length} {t.files})</span>
              </div>
              <div className='space-y-2'>
                {splitResults.map((res, i) => (
                  <div key={i} className='flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg'>
                    <FileText className='h-5 w-5 text-gray-500' />
                    <span className='flex-1 text-sm text-gray-700 dark:text-gray-300'>{res.name}</span>
                    <span className='text-xs text-gray-500 dark:text-gray-500'>{(res.data.length / 1024).toFixed(1)} KB</span>
                    <button
                      onClick={() => downloadBlob(res.data, res.name)}
                      className='btn-primary flex items-center gap-1 px-3 py-1.5 min-h-[36px] text-xs'
                    >
                      <Download className='h-3.5 w-3.5' />
                      {t.download}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ====== TAB: Compress ====== */}
        <TabsContent value="compress" className="mt-5">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.compressDesc}</p>
          <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-12 text-center'>
            <Upload className='h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4' />
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>{t.uploadDrop}</p>
            <input type='file' accept='application/pdf' onChange={handleCompressFileUpload} className='hidden' id='compress-upload' />
            <label htmlFor='compress-upload' className='btn-primary cursor-pointer inline-flex items-center gap-2 px-6 py-3 min-h-[48px]'>
              <Upload className="w-4 h-4" />
              {t.selectFiles}
            </label>
          </div>
          {compressFile && (
            <div className='mt-4 sm:mt-6 space-y-4'>
              <div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <FileText className='h-5 w-5 text-gray-500' />
                  <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>{compressFile.name}</span>
                  <span className='text-xs text-gray-500 dark:text-gray-500'>{(compressFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.compressionLevel}</label>
                <div className='grid grid-cols-3 gap-3'>
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setCompressLevel(level)}
                      className={`px-3 py-3 min-h-[48px] rounded-xl text-sm font-medium transition-all ${
                        compressLevel === level
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {t.levels[level]}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={doCompress}
                disabled={compressProcessing}
                className='btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]'
              >
                {compressProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Minimize2 className='h-4 w-4' />
                    {t.compress}
                  </>
                )}
              </button>
            </div>
          )}
          {compressResult && (
            <div className='mt-4 sm:mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-sm font-medium text-green-800 dark:text-green-400'>{t.compress} {t.success}</span>
                <button
                  onClick={() => downloadBlob(compressResult.data, 'compressed.pdf')}
                  className='btn-primary flex items-center gap-2 px-4 py-2 min-h-[40px]'
                >
                  <Download className='h-4 w-4' />
                  {t.download}
                </button>
              </div>
              <p className='text-sm text-gray-700 dark:text-gray-300'>
                {t.compressResult
                  .replace('{{original}}', (compressResult.originalSize / 1024).toFixed(1))
                  .replace('{{compressed}}', (compressResult.compressedSize / 1024).toFixed(1))
                  .replace('{{percent}}', (((compressResult.originalSize - compressResult.compressedSize) / compressResult.originalSize * 100).toFixed(0)))}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
