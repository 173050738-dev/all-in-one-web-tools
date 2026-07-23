'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Upload, Settings, Trash2, Image as ImageIcon, ArrowLeftRight, FileImage, X, Check, Sparkles, Archive, Share2 } from 'lucide-react';
import BuiltWithKorelyy from './BuiltWithKorelyy';

const STORAGE_KEY_SETTINGS = 'korelyy-image-compressor-settings';

function crc32(buf: ArrayBuffer): number {
  const bytes = new Uint8Array(buf);
  let crc = -1;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function createZipBlob(files: { name: string; data: ArrayBuffer }[]): Blob {
  const parts: ArrayBuffer[] = [];
  const centralDir: ArrayBuffer[] = [];
  let offset = 0;
  const dosDate = 0x4A21;
  const dosTime = 0x4B62;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.byteLength;

    const local = new ArrayBuffer(30 + nameBytes.length);
    const localView = new DataView(local);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, size, true);
    localView.setUint32(22, size, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    new Uint8Array(local, 30).set(nameBytes);

    parts.push(local, file.data);

    const central = new ArrayBuffer(46 + nameBytes.length);
    const centralView = new DataView(central);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, size, true);
    centralView.setUint32(24, size, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    new Uint8Array(central, 46).set(nameBytes);

    centralDir.push(central);
    offset += 30 + nameBytes.length + size;
  }

  const centralDirStart = offset;
  let centralDirSize = 0;
  for (const c of centralDir) centralDirSize += c.byteLength;

  const endRecord = new ArrayBuffer(22);
  const endView = new DataView(endRecord);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralDirSize, true);
  endView.setUint32(16, centralDirStart, true);
  endView.setUint16(20, 0, true);

  return new Blob([...parts, ...centralDir, endRecord], { type: 'application/zip' });
}

interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalUrl: string;
  compressedUrl: string | null;
  compressedSize: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp';

type CompressionMode = 'quality' | 'targetSize' | 'convert';

interface PresetSize {
  name: Record<string, string>;
  width: number;
  height?: number;
}

const presetSizes: PresetSize[] = [
  { name: { zh: '原图', en: 'Original', es: 'Original', fr: 'Original', hi: 'मूल', ar: 'الأصل' }, width: 9999 },
  { name: { zh: 'Instagram (1080px)', en: 'Instagram (1080px)', es: 'Instagram (1080px)', fr: 'Instagram (1080px)', hi: 'इंस्टाग्राम (1080px)', ar: 'إنستغرام (1080px)' }, width: 1080 },
  { name: { zh: '微信头像 (400px)', en: 'WeChat Avatar (400px)', es: 'Avatar WeChat (400px)', fr: 'Avatar WeChat (400px)', hi: 'व्हाट्सएप अवतार (400px)', ar: 'أوتار ويشات (400px)' }, width: 400 },
  { name: { zh: '护照照片 (413px)', en: 'Passport Photo (413px)', es: 'Foto Pasaporte (413px)', fr: 'Photo Passeport (413px)', hi: 'पासपोर्ट फोटो (413px)', ar: 'صورة جواز السفر (413px)' }, width: 413 },
  { name: { zh: 'Facebook (1200px)', en: 'Facebook (1200px)', es: 'Facebook (1200px)', fr: 'Facebook (1200px)', hi: 'फेसबुक (1200px)', ar: 'فيسبوك (1200px)' }, width: 1200 },
  { name: { zh: 'Twitter (1200px)', en: 'Twitter (1200px)', es: 'Twitter (1200px)', fr: 'Twitter (1200px)', hi: 'ट्विटर (1200px)', ar: 'تويتر (1200px)' }, width: 1200 },
  { name: { zh: 'Full HD (1920px)', en: 'Full HD (1920px)', es: 'Full HD (1920px)', fr: 'Full HD (1920px)', hi: 'फुल HD (1920px)', ar: 'فول HD (1920px)' }, width: 1920 },
];

interface ImageCompressorProps {
  locale?: string;
}

export default function ImageCompressor({ locale = 'zh' }: ImageCompressorProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      title: '图片压缩器',
      subtitle: '100% 本地处理，文件不上传，更隐私更安全',
      upload: '点击或拖拽上传图片',
      formats: '支持 JPG、PNG、WebP、GIF 等格式',
      original: '原图',
      compressed: '压缩后',
      quality: '压缩质量',
      maxWidth: '最大宽度',
      targetSize: '目标大小',
      targetSizePlaceholder: '输入目标大小（如 100）',
      targetSizeUnit: 'KB',
      compressionMode: '压缩模式',
      modeQuality: '质量优先',
      modeSize: '目标大小',
      outputFormat: '输出格式',
      formatOriginal: '保持原格式',
      formatJpeg: 'JPG',
      formatPng: 'PNG',
      formatWebp: 'WebP',
      removeExif: '移除 EXIF 元数据（保护隐私）',
      compress: '开始压缩',
      processing: '压缩中...',
      download: '下载压缩图',
      downloadAll: '打包下载全部',
      delete: '删除',
      clearAll: '清空全部',
      compare: '前后对比',
      before: '原图',
      after: '压缩后',
      save: '已节省',
      settings: '压缩设置',
      features: '功能特点',
      localProcessing: '纯本地处理，保护隐私',
      targetSizeCompress: '精确压到指定大小',
      batchCompress: '支持批量压缩',
      formatConvert: '多种输出格式',
      comparePreview: '实时对比预览',
      dragDrop: '支持拖拽上传',
      tips: '💡 提示：目标大小模式下，程序会自动调整质量以逼近目标',
      maxSizeWarning: '⚠️ 目标大小过小，可能无法达到',
      selectImages: '选择图片',
      noImages: '暂无图片',
      batchMode: '批量模式',
      singleMode: '单图模式',
      switchMode: '切换模式',
      totalSaved: '总共节省',
      file: '个文件',
      confirmClear: '确定清空所有图片？',
      guide: '使用指南',
      guideText: '上传图片后选择压缩模式和输出格式，点击压缩即可快速减小图片文件大小，完全本地处理，不上传服务器。',
      sidebarFeatures: '功能特点',
      modeConvert: '仅转换格式',
      compressionPreset: '压缩预设',
      presetSmall: '小体积',
      presetBalanced: '均衡',
      presetHigh: '高质量',
      zipDownload: '打包下载 ZIP',
      zipReady: 'ZIP 已就绪',
      converting: '转换中...',
      converted: '已转换',
      shareCard: '分享我的结果',
      downloadShare: '下载分享图',
      shareSaved: '节省',
      builtWith: '基于 Korelyy 构建',
      freeTools: '免费工具 · 六语言',
      shareDesc: '用 Korelyy 压缩了图片，节省了',
    },
    en: {
      title: 'Image Compressor',
      subtitle: '100% Local Processing, Files Never Uploaded',
      upload: 'Click or drag to upload images',
      formats: 'Supports JPG, PNG, WebP, GIF and more',
      original: 'Original',
      compressed: 'Compressed',
      quality: 'Compression Quality',
      maxWidth: 'Max Width',
      targetSize: 'Target Size',
      targetSizePlaceholder: 'Enter target size (e.g. 100)',
      targetSizeUnit: 'KB',
      compressionMode: 'Compression Mode',
      modeQuality: 'Quality First',
      modeSize: 'Target Size',
      outputFormat: 'Output Format',
      formatOriginal: 'Keep Original',
      formatJpeg: 'JPG',
      formatPng: 'PNG',
      formatWebp: 'WebP',
      removeExif: 'Remove EXIF metadata (privacy)',
      compress: 'Compress Now',
      processing: 'Compressing...',
      download: 'Download',
      downloadAll: 'Download All',
      delete: 'Delete',
      clearAll: 'Clear All',
      compare: 'Before/After',
      before: 'Before',
      after: 'After',
      save: 'Saved',
      settings: 'Compression Settings',
      features: 'Features',
      localProcessing: '100% Local Processing',
      targetSizeCompress: 'Compress to exact size',
      batchCompress: 'Batch compression',
      formatConvert: 'Multiple output formats',
      comparePreview: 'Before/After comparison',
      dragDrop: 'Drag & drop support',
      tips: '💡 Tip: In Target Size mode, quality is auto-adjusted to match target',
      maxSizeWarning: '⚠️ Target size too small, may not be achievable',
      selectImages: 'Select Images',
      noImages: 'No images',
      batchMode: 'Batch Mode',
      singleMode: 'Single Mode',
      switchMode: 'Switch Mode',
      totalSaved: 'Total Saved',
      file: 'files',
      confirmClear: 'Clear all images?',
      guide: 'How to Use',
      guideText: 'Upload images, select compression mode and output format, then click compress to reduce file size. All processing happens locally - no uploads.',
      sidebarFeatures: 'Features',
      modeConvert: 'Convert Only',
      compressionPreset: 'Compression Preset',
      presetSmall: 'Small',
      presetBalanced: 'Balanced',
      presetHigh: 'High Quality',
      zipDownload: 'Download ZIP',
      zipReady: 'ZIP Ready',
      converting: 'Converting...',
      converted: 'Converted',
      shareCard: 'Share My Result',
      downloadShare: 'Download Share Card',
      shareSaved: 'Saved',
      builtWith: 'Built with Korelyy',
      freeTools: 'Free Tools · 6 Languages',
      shareDesc: 'Compressed with Korelyy, saved',
    },
    es: {
      title: 'Compresor de Imágenes',
      subtitle: 'Procesamiento 100% local, los archivos nunca se suben',
      upload: 'Haga clic o arrastre para subir imágenes',
      formats: 'Compatible con JPG, PNG, WebP, GIF y más',
      original: 'Original',
      compressed: 'Comprimido',
      quality: 'Calidad de compresión',
      maxWidth: 'Ancho máximo',
      targetSize: 'Tamaño objetivo',
      targetSizePlaceholder: 'Ingrese tamaño objetivo (ej. 100)',
      targetSizeUnit: 'KB',
      compressionMode: 'Modo de compresión',
      modeQuality: 'Calidad primero',
      modeSize: 'Tamaño objetivo',
      outputFormat: 'Formato de salida',
      formatOriginal: 'Mantener original',
      formatJpeg: 'JPG',
      formatPng: 'PNG',
      formatWebp: 'WebP',
      removeExif: 'Eliminar metadatos EXIF (privacidad)',
      compress: 'Comprimir ahora',
      processing: 'Comprimiendo...',
      download: 'Descargar',
      downloadAll: 'Descargar todo',
      delete: 'Eliminar',
      clearAll: 'Limpiar todo',
      compare: 'Antes/Después',
      before: 'Antes',
      after: 'Después',
      save: 'Ahorrado',
      settings: 'Configuración',
      features: 'Características',
      localProcessing: 'Procesamiento 100% local',
      targetSizeCompress: 'Comprimir a tamaño exacto',
      batchCompress: 'Compresión por lotes',
      formatConvert: 'Varios formatos de salida',
      comparePreview: 'Comparación Antes/Después',
      dragDrop: 'Soporte arrastrar y soltar',
      tips: '💡 Consejo: En modo Tamaño Objetivo, la calidad se ajusta automáticamente',
      maxSizeWarning: '⚠️ Tamaño objetivo demasiado pequeño',
      selectImages: 'Seleccionar imágenes',
      noImages: 'Sin imágenes',
      batchMode: 'Modo por lotes',
      singleMode: 'Modo individual',
      switchMode: 'Cambiar modo',
      totalSaved: 'Total ahorrado',
      file: 'archivos',
      confirmClear: '¿Limpiar todas las imágenes?',
      guide: 'Cómo usar',
      guideText: 'Sube imágenes, selecciona el modo de compresión y el formato de salida, luego haz clic en comprimir para reducir el tamaño del archivo.',
      sidebarFeatures: 'Características',
      modeConvert: 'Solo Convertir',
      compressionPreset: 'Preajuste de Compresión',
      presetSmall: 'Pequeño',
      presetBalanced: 'Equilibrado',
      presetHigh: 'Alta Calidad',
      zipDownload: 'Descargar ZIP',
      zipReady: 'ZIP Listo',
      converting: 'Convirtiendo...',
      converted: 'Convertido',
      shareCard: 'Compartir Mi Resultado',
      downloadShare: 'Descargar Tarjeta',
      shareSaved: 'Ahorrado',
      builtWith: 'Hecho con Korelyy',
      freeTools: 'Herramientas Gratis · 6 Idiomas',
      shareDesc: 'Comprimido con Korelyy, ahorrado',
    },
    fr: {
      title: 'Compresseur d\'Images',
      subtitle: 'Traitement 100% local, les fichiers ne sont jamais téléchargés',
      upload: 'Cliquez ou glissez pour télécharger des images',
      formats: 'Prend en charge JPG, PNG, WebP, GIF et plus',
      original: 'Original',
      compressed: 'Compressé',
      quality: 'Qualité de compression',
      maxWidth: 'Largeur maximale',
      targetSize: 'Taille cible',
      targetSizePlaceholder: 'Entrez la taille cible (ex. 100)',
      targetSizeUnit: 'Ko',
      compressionMode: 'Mode de compression',
      modeQuality: 'Qualité d\'abord',
      modeSize: 'Taille cible',
      outputFormat: 'Format de sortie',
      formatOriginal: 'Conserver original',
      formatJpeg: 'JPG',
      formatPng: 'PNG',
      formatWebp: 'WebP',
      removeExif: 'Supprimer les métadonnées EXIF',
      compress: 'Compresser maintenant',
      processing: 'Compression...',
      download: 'Télécharger',
      downloadAll: 'Télécharger tout',
      delete: 'Supprimer',
      clearAll: 'Vider tout',
      compare: 'Avant/Après',
      before: 'Avant',
      after: 'Après',
      save: 'Économisé',
      settings: 'Paramètres',
      features: 'Caractéristiques',
      localProcessing: 'Traitement 100% local',
      targetSizeCompress: 'Compresser à taille exacte',
      batchCompress: 'Compression par lots',
      formatConvert: 'Plusieurs formats de sortie',
      comparePreview: 'Comparaison Avant/Après',
      dragDrop: 'Glisser-déposer',
      tips: '💡 Astuce: En mode Taille Cible, la qualité s\'ajuste automatiquement',
      maxSizeWarning: '⚠️ Taille cible trop petite',
      selectImages: 'Sélectionner des images',
      noImages: 'Aucune image',
      batchMode: 'Mode batch',
      singleMode: 'Mode individuel',
      switchMode: 'Changer de mode',
      totalSaved: 'Total économisé',
      file: 'fichiers',
      confirmClear: 'Vider toutes les images ?',
      guide: 'Guide d\'utilisation',
      guideText: 'Téléchargez des images, sélectionnez le mode de compression et le format de sortie, puis cliquez sur compresser pour réduire la taille du fichier.',
      sidebarFeatures: 'Caractéristiques',
      modeConvert: 'Convertir Seulement',
      compressionPreset: 'Préréglage de Compression',
      presetSmall: 'Petit',
      presetBalanced: 'Équilibré',
      presetHigh: 'Haute Qualité',
      zipDownload: 'Télécharger ZIP',
      zipReady: 'ZIP Prêt',
      converting: 'Conversion...',
      converted: 'Converti',
      shareCard: 'Partager Mon Résultat',
      downloadShare: 'Télécharger la Carte',
      shareSaved: 'Économisé',
      builtWith: 'Fait avec Korelyy',
      freeTools: 'Outils Gratuits · 6 Langues',
      shareDesc: 'Compressé avec Korelyy, économisé',
    },
    hi: {
      title: 'इमेज कंप्रेसर',
      subtitle: '100% लोकल प्रोसेसिंग, फाइलें कभी अपलोड नहीं होतीं',
      upload: 'चित्र अपलोड करने के लिए क्लिक या ड्रैग करें',
      formats: 'JPG, PNG, WebP, GIF आदि का समर्थन करता है',
      original: 'मूल',
      compressed: 'संपीड़ित',
      quality: 'संपीड़न गुणवत्ता',
      maxWidth: 'अधिकतम चौड़ाई',
      targetSize: 'लक्ष्य आकार',
      targetSizePlaceholder: 'लक्ष्य आकार दर्ज करें (उदा. 100)',
      targetSizeUnit: 'KB',
      compressionMode: 'संपीड़न मोड',
      modeQuality: 'गुणवत्ता प्राथमिक',
      modeSize: 'लक्ष्य आकार',
      outputFormat: 'आउटपुट प्रारूप',
      formatOriginal: 'मूल बनाए रखें',
      formatJpeg: 'JPG',
      formatPng: 'PNG',
      formatWebp: 'WebP',
      removeExif: 'EXIF मेटाडेटा हटाएं (गोपनीयता)',
      compress: 'अब संपीड़ित करें',
      processing: 'संपीड़न हो रहा है...',
      download: 'डाउनलोड',
      downloadAll: 'सभी डाउनलोड करें',
      delete: 'हटाएं',
      clearAll: 'सभी साफ करें',
      compare: 'पहले/बाद में',
      before: 'पहले',
      after: 'बाद में',
      save: 'बचाया',
      settings: 'संपीड़न सेटिंग्स',
      features: 'विशेषताएं',
      localProcessing: '100% लोकल प्रोसेसिंग',
      targetSizeCompress: 'सटीक आकार तक संपीड़ित करें',
      batchCompress: 'बैच संपीड़न',
      formatConvert: 'कई आउटपुट प्रारूप',
      comparePreview: 'पहले/बाद में तुलना',
      dragDrop: 'ड्रैग & ड्रॉप समर्थन',
      tips: '💡 टिप: लक्ष्य आकार मोड में, गुणवत्ता स्वचालित रूप से समायोजित होती है',
      maxSizeWarning: '⚠️ लक्ष्य आकार बहुत छोटा है',
      selectImages: 'चित्र चुनें',
      noImages: 'कोई चित्र नहीं',
      batchMode: 'बैच मोड',
      singleMode: 'सिंगल मोड',
      switchMode: 'मोड बदलें',
      totalSaved: 'कुल बचाया',
      file: 'फाइलें',
      confirmClear: 'सभी चित्र साफ करना चाहते हैं?',
      guide: 'उपयोग का मार्गदर्शन',
      guideText: 'चित्र अपलोड करें, संपीड़न मोड और आउटपुट प्रारूप चुनें, फिर फ़ाइल आकार को कम करने के लिए संपीड़ित करें।',
      sidebarFeatures: 'विशेषताएं',
      modeConvert: 'केवल कनवर्ट करें',
      compressionPreset: 'कंप्रेशन प्रीसेट',
      presetSmall: 'छोटा',
      presetBalanced: 'संतुलित',
      presetHigh: 'उच्च गुणवत्ता',
      zipDownload: 'ZIP डाउनलोड',
      zipReady: 'ZIP तैयार',
      converting: 'कनवर्ट हो रहा है...',
      converted: 'कनवर्ट हुआ',
      shareCard: 'अपना परिणाम साझा करें',
      downloadShare: 'कार्ड डाउनलोड करें',
      shareSaved: 'बचाया',
      builtWith: 'Korelyy के साथ बनाया गया',
      freeTools: 'मुफ्त उपकरण · 6 भाषाएं',
      shareDesc: 'Korelyy के साथ कंप्रेस किया, बचाया',
    },
    ar: {
      title: 'مضاغط الصور',
      subtitle: 'معالجة 100% محلية، لا يتم رفع الملفات أبدًا',
      upload: 'انقر أو اسحب لرفع الصور',
      formats: 'يدعم JPG، PNG، WebP، GIF وغيرها',
      original: 'الأصل',
      compressed: 'المضغوط',
      quality: 'جودة الضغط',
      maxWidth: 'العرض الأقصى',
      targetSize: 'الحجم المستهدف',
      targetSizePlaceholder: 'أدخل الحجم المستهدف (مثل 100)',
      targetSizeUnit: 'كيلوبايت',
      compressionMode: 'وضع الضغط',
      modeQuality: 'الجودة أولاً',
      modeSize: 'الحجم المستهدف',
      outputFormat: 'تنسيق الخرج',
      formatOriginal: 'احتفاظ بالأساسي',
      formatJpeg: 'JPG',
      formatPng: 'PNG',
      formatWebp: 'WebP',
      removeExif: 'إزالة بيانات EXIF (للخصوصية)',
      compress: 'ابدأ الضغط',
      processing: 'جارٍ الضغط...',
      download: 'تنزيل',
      downloadAll: 'تنزيل الكل',
      delete: 'حذف',
      clearAll: 'مسح الكل',
      compare: 'قبل/بعد',
      before: 'قبل',
      after: 'بعد',
      save: 'الموفور',
      settings: 'إعدادات الضغط',
      features: 'الميزات',
      localProcessing: 'معالجة 100% محلية',
      targetSizeCompress: 'ضغط إلى حجم محدد',
      batchCompress: 'ضغط جماعي',
      formatConvert: 'عدة تنسيقات خرج',
      comparePreview: 'مقارنة قبل/بعد',
      dragDrop: 'دعم السحب والإفلات',
      tips: '💡 ملاحظة: في وضع الحجم المستهدف، يتم ضبط الجودة تلقائيًا',
      maxSizeWarning: '⚠️ الحجم المستهدف صغير جدًا',
      selectImages: 'اختر الصور',
      noImages: 'لا توجد صور',
      batchMode: 'وضع الجماعي',
      singleMode: 'وضع المفرد',
      switchMode: 'تبديل الوضع',
      totalSaved: 'المجموع الموفور',
      file: 'ملفات',
      confirmClear: 'هل تريد مسح جميع الصور؟',
      guide: 'دليل الاستخدام',
      guideText: 'قم برفع الصور، اختر وضع الضغط ومنتج التنسيق، ثم انقر على الضغط لتقليل حجم الملف.',
      sidebarFeatures: 'الميزات',
      modeConvert: 'تحويل فقط',
      compressionPreset: 'إعداد مسبق للضغط',
      presetSmall: 'صغير',
      presetBalanced: 'متوازن',
      presetHigh: 'جودة عالية',
      zipDownload: 'تنزيل ZIP',
      zipReady: 'ZIP جاهز',
      converting: 'جاري التحويل...',
      converted: 'تم التحويل',
      shareCard: 'مشاركة نتيجتي',
      downloadShare: 'تنزيل البطاقة',
      shareSaved: 'الموفور',
      builtWith: 'صنع مع Korelyy',
      freeTools: 'أدوات مجانية · 6 لغات',
      shareDesc: 'تم الضغط بواسطة Korelyy، تم توفير',
    },
  };

  const t = translations[locale];

  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState<number>(0.7);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [targetSizeKB, setTargetSizeKB] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [compressionMode, setCompressionMode] = useState<CompressionMode>('quality');
  const [removeExif, setRemoveExif] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [comparePosition, setComparePosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [qualityPreset, setQualityPreset] = useState<'small' | 'balanced' | 'high'>('balanced');
  const [zipReady, setZipReady] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.quality !== undefined) setQuality(settings.quality);
        if (settings.maxWidth !== undefined) setMaxWidth(settings.maxWidth);
        if (settings.outputFormat !== undefined) setOutputFormat(settings.outputFormat as OutputFormat);
        if (settings.compressionMode !== undefined) setCompressionMode(settings.compressionMode as CompressionMode);
        if (settings.removeExif !== undefined) setRemoveExif(settings.removeExif);
        if (settings.qualityPreset !== undefined) setQualityPreset(settings.qualityPreset);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const settings = { quality, maxWidth, outputFormat, compressionMode, removeExif, qualityPreset };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [quality, maxWidth, outputFormat, compressionMode, removeExif, qualityPreset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isProcessing && images.length > 0) {
          const pendingImages = images.filter(img => img.status === 'pending');
          if (pendingImages.length > 0) {
            processAllImages();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, images]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compareContainerRef = useRef<HTMLDivElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getOutputMimeType = (originalType: string): string => {
    switch (outputFormat) {
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return originalType;
    }
  };

  const getOutputExtension = (originalName: string): string => {
    switch (outputFormat) {
      case 'jpeg':
        return '.jpg';
      case 'png':
        return '.png';
      case 'webp':
        return '.webp';
      default:
        const ext = originalName.split('.').pop()?.toLowerCase();
        return ext ? `.${ext}` : '.jpg';
    }
  };

  const compressToTargetSize = useCallback(async (img: HTMLImageElement, canvas: HTMLCanvasElement, targetBytes: number, mimeType: string): Promise<{ dataUrl: string; size: number }> => {
    let low = 0.01;
    let high = 1;
    let bestQuality = 0.7;
    let bestSize = Infinity;
    const tolerance = targetBytes * 0.1;

    for (let i = 0; i < 15; i++) {
      const mid = (low + high) / 2;
      const dataUrl = canvas.toDataURL(mimeType, mid);
      const size = Math.floor((dataUrl.split(',')[1].length * 3) / 4);

      if (size <= targetBytes + tolerance) {
        if (size > bestSize) {
          bestSize = size;
          bestQuality = mid;
        }
        low = mid;
      } else {
        high = mid;
      }
    }

    const finalDataUrl = canvas.toDataURL(mimeType, bestQuality);
    const finalSize = Math.floor((finalDataUrl.split(',')[1].length * 3) / 4);
    return { dataUrl: finalDataUrl, size: finalSize };
  }, []);

  const applyPreset = (preset: 'small' | 'balanced' | 'high') => {
    setQualityPreset(preset);
    switch (preset) {
      case 'small': setQuality(0.3); setMaxWidth(1280); break;
      case 'balanced': setQuality(0.7); setMaxWidth(1920); break;
      case 'high': setQuality(0.92); setMaxWidth(3840); break;
    }
  };

  const compressImage = useCallback(async (imageFile: ImageFile): Promise<{ compressedUrl: string; compressedSize: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve({ compressedUrl: '', compressedSize: 0 });
          return;
        }

        let width = img.width;
        let height = img.height;

        if (compressionMode !== 'convert' && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ compressedUrl: '', compressedSize: 0 });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = getOutputMimeType(imageFile.file.type);

        if (compressionMode === 'convert') {
          const convertedDataUrl = canvas.toDataURL(mimeType, 1.0);
          const base64Length = convertedDataUrl.split(',')[1].length;
          const estimatedSize = Math.floor((base64Length * 3) / 4);
          resolve({ compressedUrl: convertedDataUrl, compressedSize: estimatedSize });
        } else if (compressionMode === 'targetSize' && targetSizeKB) {
          const targetBytes = parseInt(targetSizeKB) * 1024;
          compressToTargetSize(img, canvas, targetBytes, mimeType).then((result) => {
            resolve({ compressedUrl: result.dataUrl, compressedSize: result.size });
          });
        } else {
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          const base64Length = compressedDataUrl.split(',')[1].length;
          const estimatedSize = Math.floor((base64Length * 3) / 4);
          resolve({ compressedUrl: compressedDataUrl, compressedSize: estimatedSize });
        }
      };
      img.onerror = () => {
        resolve({ compressedUrl: '', compressedSize: 0 });
      };
      img.src = imageFile.originalUrl;
    });
  }, [maxWidth, quality, outputFormat, compressionMode, targetSizeKB, compressToTargetSize]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const imageFiles: ImageFile[] = files
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        originalSize: file.size,
        originalUrl: '',
        compressedUrl: null,
        compressedSize: 0,
        status: 'pending',
      }));

    imageFiles.forEach((imgFile) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) =>
          prev.map((i) => (i.id === imgFile.id ? { ...i, originalUrl: ev.target?.result as string } : i))
        );
      };
      reader.readAsDataURL(imgFile.file);
    });

    setImages((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAllImages = () => {
    if (confirm(t.confirmClear)) {
      setImages([]);
      setShowCompare(false);
    }
  };

  const processAllImages = async () => {
    setIsProcessing(true);
    const pendingImages = images.filter((i) => i.status === 'pending');

    for (const imgFile of pendingImages) {
      setImages((prev) =>
        prev.map((i) => (i.id === imgFile.id ? { ...i, status: 'processing' } : i))
      );

      const result = await compressImage(imgFile);

      setImages((prev) =>
        prev.map((i) =>
          i.id === imgFile.id
            ? {
                ...i,
                compressedUrl: result.compressedUrl,
                compressedSize: result.compressedSize,
                status: result.compressedUrl ? 'done' : 'error',
              }
            : i
        )
      );
    }

    setIsProcessing(false);
    if (images.length === 1 && !isBatchMode) {
      setShowCompare(true);
    }
  };

  const downloadSingleImage = (image: ImageFile) => {
    if (!image.compressedUrl) return;
    const link = document.createElement('a');
    const ext = getOutputExtension(image.name);
    link.download = `compressed_${image.name.replace(/\.[^/.]+$/, '')}${ext}`;
    link.href = image.compressedUrl;
    link.click();
  };

  const downloadAllImages = async () => {
    const doneImages = images.filter((i) => i.status === 'done' && i.compressedUrl);
    if (doneImages.length === 0) return;

    if (doneImages.length === 1) {
      downloadSingleImage(doneImages[0]);
      return;
    }

    const filesForZip: { name: string; data: ArrayBuffer }[] = [];
    for (const img of doneImages) {
      const base64 = img.compressedUrl!.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const ext = getOutputExtension(img.name);
      const baseName = img.name.replace(/\.[^/.]+$/, '');
      filesForZip.push({ name: `${baseName}${ext}`, data: bytes.buffer });
    }

    const zipBlob = createZipBlob(filesForZip);
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_images_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(url);
    setZipReady(true);
    setTimeout(() => setZipReady(false), 3000);
  };

  const handleCompareMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparePosition(percent);
  };

  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generateShareCard = async () => {
    const doneImages = images.filter((i) => i.status === 'done' && i.compressedUrl);
    if (doneImages.length === 0) return;

    setShareLoading(true);
    setShareError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1400;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1400);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Korelyy Image Compressor', 600, 80);

      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(t.subtitle.slice(0, 40), 600, 120);

      const cardTop = 160;
      const cardHeight = 480;
      const cardWidth = 480;
      const gap = 40;

      const drawImageCard = (image: HTMLImageElement, x: number, label: string, size: string) => {
        ctx.fillStyle = '#f3f4f6';
        ctx.beginPath();
        roundRect(ctx, x, cardTop, cardWidth, cardHeight, 16);
        ctx.fill();

        const padding = 20;
        const imgSize = Math.min(cardWidth - padding * 2, cardHeight - 80);
        const imgX = x + (cardWidth - imgSize) / 2;
        const imgY = cardTop + padding;

        const scale = imgSize / Math.max(image.width, image.height);
        const drawW = image.width * scale;
        const drawH = image.height * scale;
        const drawX = imgX + (imgSize - drawW) / 2;
        const drawY = imgY + (imgSize - drawH) / 2;

        ctx.drawImage(image, drawX, drawY, drawW, drawH);

        ctx.fillStyle = '#374151';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + cardWidth / 2, cardTop + cardHeight - 35);

        ctx.fillStyle = '#6b7280';
        ctx.font = '16px sans-serif';
        ctx.fillText(size, x + cardWidth / 2, cardTop + cardHeight - 15);
      };

      const firstImage = doneImages[0];
      const [originalImg, compressedImg] = await Promise.all([
        loadImage(firstImage.originalUrl),
        loadImage(firstImage.compressedUrl!),
      ]);

      const savedBytes = firstImage.originalSize - (firstImage.compressedSize || 0);
      const savedPercent = Math.round((savedBytes / firstImage.originalSize) * 100);

      drawImageCard(originalImg, 120, t.before, formatSize(firstImage.originalSize));
      drawImageCard(compressedImg, 120 + cardWidth + gap, t.after, formatSize(firstImage.compressedSize || 0));

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 64px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`↓ ${savedPercent}%`, 600, 740);

      ctx.fillStyle = '#6b7280';
      ctx.font = '24px sans-serif';
      ctx.fillText(`${t.shareSaved} ${formatSize(savedBytes)}`, 600, 780);

      if (doneImages.length > 1) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '18px sans-serif';
        ctx.fillText(`+${doneImages.length - 1} more files compressed`, 600, 815);
      }

      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(100, 860, 1000, 2);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Made with ❤️ by Korelyy.com', 600, 920);

      ctx.fillStyle = '#6b7280';
      ctx.font = '20px sans-serif';
      ctx.fillText(t.freeTools, 600, 960);

      ctx.fillStyle = '#f3f4f6';
      ctx.beginPath();
      roundRect(ctx, 350, 1000, 500, 140, 16);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('korelyy.com', 600, 1060);

      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Free Online Image Tools', 600, 1100);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('No upload · 100% local · 6 languages', 600, 1135);

      canvas.toBlob((blob) => {
        if (!blob) {
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `korelyy_share_${Date.now()}.png`;
          a.click();
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `korelyy_share_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate share card:', err);
      setShareError('Failed to generate share card. Please try again.');
    } finally {
      setShareLoading(false);
      setTimeout(() => setShareError(null), 3000);
    }
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const totalOriginalSize = images.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, i) => sum + (i.compressedSize || 0), 0);
  const totalSaved = totalOriginalSize > 0 && totalCompressedSize > 0
    ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
    : 0;

  const currentImage = images[0];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
            <ImageIcon className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div className='flex-1'>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1'>
              <Sparkles className='h-3.5 w-3.5' />
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={() => setIsBatchMode(!isBatchMode)}
            className='flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm'
          >
            {isBatchMode ? t.singleMode : t.batchMode}
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center mb-4 sm:mb-6 cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileSelect}
            multiple={isBatchMode}
            className='hidden'
          />
          <Upload className='h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4' />
          <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-1'>
            {t.upload}
          </p>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
            {t.formats}
            {isBatchMode && <span className='ml-1'>{t.batchMode}</span>}
          </p>
        </div>

        <div className='space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
          <div className='flex items-center gap-2'>
            <Settings className='h-4 w-4 sm:h-5 sm:w-5 text-gray-500' />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t.settings}</span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
            <div>
              <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5'>
                {t.compressionMode}
              </label>
              <div className='flex gap-1'>
                <button
                  onClick={() => setCompressionMode('quality')}
                  className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    compressionMode === 'quality'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t.modeQuality}
                </button>
                <button
                  onClick={() => setCompressionMode('targetSize')}
                  className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    compressionMode === 'targetSize'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t.modeSize}
                </button>
                <button
                  onClick={() => setCompressionMode('convert')}
                  className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    compressionMode === 'convert'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t.modeConvert}
                </button>
              </div>
            </div>

            <div>
              <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5'>
                {compressionMode === 'quality' ? t.quality : compressionMode === 'convert' ? t.modeConvert : t.targetSize}
              </label>
              {compressionMode === 'quality' ? (
                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <span className='text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium'>
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    type='range'
                    min='0.1'
                    max='1'
                    step='0.05'
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500'
                  />
                  <div className='flex gap-1 mt-2'>
                    <button
                      onClick={() => applyPreset('small')}
                      className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                        qualityPreset === 'small'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t.presetSmall}
                    </button>
                    <button
                      onClick={() => applyPreset('balanced')}
                      className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                        qualityPreset === 'balanced'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t.presetBalanced}
                    </button>
                    <button
                      onClick={() => applyPreset('high')}
                      className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                        qualityPreset === 'high'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t.presetHigh}
                    </button>
                  </div>
                </div>
              ) : compressionMode === 'convert' ? (
                <div className='flex items-center h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                  {t.converting}
                </div>
              ) : (
                <div className='flex gap-1'>
                  <input
                    type='number'
                    min='1'
                    max='10240'
                    placeholder={t.targetSizePlaceholder}
                    value={targetSizeKB}
                    onChange={(e) => setTargetSizeKB(e.target.value)}
                    className='flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                  <span className='flex items-center px-2 sm:px-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                    {t.targetSizeUnit}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5'>
                {t.outputFormat}
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                className='w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <option value='original'>{t.formatOriginal}</option>
                <option value='jpeg'>{t.formatJpeg}</option>
                <option value='png'>{t.formatPng}</option>
                <option value='webp'>{t.formatWebp}</option>
              </select>
            </div>

            {compressionMode !== 'convert' && (
            <div>
              <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5'>
                {t.maxWidth}
              </label>
              <select
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                className='w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                {presetSizes.map((preset) => (
                  <option key={preset.width} value={preset.width}>
                    {preset.name[locale]}
                  </option>
                ))}
              </select>
            </div>
            )}

            <div className='flex items-end'>
              <label className='flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full'>
                <input
                  type='checkbox'
                  checked={removeExif}
                  onChange={(e) => setRemoveExif(e.target.checked)}
                  className='w-4 h-4 text-primary-500 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 focus:ring-primary-500'
                />
                <span className='text-xs sm:text-sm text-gray-700 dark:text-gray-300'>
                  {t.removeExif}
                </span>
              </label>
            </div>
          </div>

          {compressionMode === 'targetSize' && targetSizeKB && parseInt(targetSizeKB) < 10 && (
            <p className='text-xs text-amber-600 dark:text-amber-400'>{t.maxSizeWarning}</p>
          )}
        </div>

        {images.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400'>
            <FileImage className='h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 opacity-50' />
            <p className='text-sm sm:text-base'>{t.noImages}</p>
          </div>
        ) : isBatchMode ? (
          <div className='space-y-3 sm:space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {images.length} {t.file}
              </span>
              <button
                onClick={clearAllImages}
                className='flex items-center gap-1 text-xs sm:text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400'
              >
                <Trash2 className='h-4 w-4' />
                {t.clearAll}
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
              {images.map((image) => (
                <div
                  key={image.id}
                  className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'
                >
                  <div className='flex gap-2 p-2 sm:p-3'>
                    <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0'>
                      <img
                        src={image.compressedUrl || image.originalUrl}
                        alt={image.name}
                        className='w-full h-full object-contain'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2'>
                        <p className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate'>
                          {image.name}
                        </p>
                        <button
                          onClick={() => removeImage(image.id)}
                          className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors'
                        >
                          <X className='h-3.5 w-3.5' />
                        </button>
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          {formatSize(image.originalSize)}
                        </span>
                        {image.status === 'done' && (
                          <>
                            <ArrowLeftRight className='h-3 w-3 text-gray-400' />
                            <span className='text-xs text-green-600 dark:text-green-400'>
                              {formatSize(image.compressedSize)}
                            </span>
                            <span className='text-xs text-green-500'>
                              (-{Math.round(((image.originalSize - image.compressedSize) / image.originalSize) * 100)}%)
                            </span>
                          </>
                        )}
                      </div>
                      <div className='mt-2'>
                        {image.status === 'pending' && (
                          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                            {t.noImages}
                          </span>
                        )}
                        {image.status === 'processing' && (
                          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'>
                            {compressionMode === 'convert' ? t.converting : t.processing}
                          </span>
                        )}
                        {image.status === 'done' && (
                          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'>
                            <Check className='h-3 w-3 mr-1' />
                            {compressionMode === 'convert' ? t.converted : t.compressed}
                          </span>
                        )}
                        {image.status === 'error' && (
                          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'>
                            Error
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {image.status === 'done' && (
                    <div className='px-2 sm:px-3 pb-2 sm:pb-3'>
                      <button
                        onClick={() => downloadSingleImage(image)}
                        className='w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-500 text-white text-xs sm:text-sm hover:bg-primary-600 transition-colors'
                      >
                        <Download className='h-4 w-4' />
                        {t.download}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalOriginalSize > 0 && totalCompressedSize > 0 && (
              <div className='flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                <span className='text-sm font-medium text-green-700 dark:text-green-400'>
                  {t.totalSaved}: {formatSize(totalOriginalSize - totalCompressedSize)} ({totalSaved}%)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className='space-y-4 sm:space-y-6'>
            {showCompare && currentImage?.compressedUrl && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t.compare}</label>
                  <button
                    onClick={() => setShowCompare(false)}
                    className='text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  >
                    {t.delete}
                  </button>
                </div>
                <div
                  ref={compareContainerRef}
                  className='relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-48 sm:h-64 lg:h-80 cursor-crosshair'
                  onMouseMove={handleCompareMove}
                  onTouchMove={handleCompareMove}
                  onMouseLeave={() => {}}
                >
                  <img
                    src={currentImage.originalUrl}
                    alt={t.before}
                    className='absolute inset-0 w-full h-full object-contain'
                  />
                  <div
                    className='absolute inset-0 overflow-hidden'
                    style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
                  >
                    <img
                      src={currentImage.compressedUrl}
                      alt={t.after}
                      className='absolute inset-0 w-full h-full object-contain'
                    />
                  </div>
                  <div
                    className='absolute top-0 bottom-0 w-0.5 bg-white dark:bg-gray-800 shadow-md'
                    style={{ left: `${comparePosition}%` }}
                  >
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center'>
                      <ArrowLeftRight className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                    </div>
                  </div>
                  <div className='absolute top-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs'>
                    {t.before}
                  </div>
                  <div className='absolute top-2 right-2 px-2 py-1 rounded bg-black/50 text-white text-xs'>
                    {t.after}
                  </div>
                </div>
              </div>
            )}

            {!showCompare && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{t.original}</label>
                    <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                      {formatSize(currentImage?.originalSize || 0)}
                    </span>
                  </div>
                  <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800'>
                    <img
                      src={currentImage?.originalUrl}
                      alt={t.original}
                      className='w-full h-40 sm:h-48 lg:h-56 object-contain'
                    />
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{t.compressed}</label>
                    <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                      {currentImage?.compressedSize ? formatSize(currentImage.compressedSize) : '--'}
                      {currentImage?.compressedSize && currentImage.originalSize && (
                        <span className='text-green-500 ml-1'>
                          (-{Math.round(((currentImage.originalSize - currentImage.compressedSize) / currentImage.originalSize) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800'>
                    {currentImage?.compressedUrl ? (
                      <img
                        src={currentImage.compressedUrl}
                        alt={t.compressed}
                        className='w-full h-40 sm:h-48 lg:h-56 object-contain'
                      />
                    ) : (
                      <div className='w-full h-40 sm:h-48 lg:h-56 flex flex-col items-center justify-center text-gray-400'>
                        <ImageIcon className='h-8 w-8 mb-2' />
                        <span className='text-xs sm:text-sm'>{t.noImages}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6'>
          <button
            onClick={processAllImages}
            disabled={isProcessing || images.length === 0}
            className='w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isProcessing ? t.processing : t.compress}
          </button>
          <button
            onClick={() => {
              if (!isBatchMode && currentImage?.compressedUrl) {
                downloadSingleImage(currentImage);
              } else {
                downloadAllImages();
              }
            }}
            disabled={!images.some((i) => i.status === 'done')}
            className='w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isBatchMode && images.filter(i => i.status === 'done').length > 1 ? <Archive className='h-4 w-4 sm:h-5 sm:w-5' /> : <Download className='h-4 w-4 sm:h-5 sm:w-5' />}
            {isBatchMode && images.filter(i => i.status === 'done').length > 1 ? t.zipDownload : isBatchMode ? t.downloadAll : t.download}
            {zipReady && <Check className='h-4 w-4 text-green-500' />}
          </button>
          <button
            onClick={generateShareCard}
            disabled={!images.some((i) => i.status === 'done') || shareLoading}
            className='w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {shareLoading ? (
              <span className='animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full' />
            ) : (
              <Share2 className='h-4 w-4 sm:h-5 sm:w-5' />
            )}
            {shareLoading ? 'Generating...' : t.downloadShare}
          </button>
          {shareError && (
            <div className='col-span-full text-center text-sm text-red-500 mt-2'>
              {shareError}
            </div>
          )}
          {!isBatchMode && currentImage?.compressedUrl && !showCompare && (
            <button
              onClick={() => setShowCompare(true)}
              className='w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            >
              <ArrowLeftRight className='h-4 w-4 sm:h-5 sm:w-5' />
              {t.compare}
            </button>
          )}
        </div>

        <div className='mt-6 card p-4 sm:p-6'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t.features}</h3>
          <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
            <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
              {t.localProcessing}
            </li>
            <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
              {t.targetSizeCompress}
            </li>
            <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
              {t.batchCompress}
            </li>
            <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
              {t.formatConvert}
            </li>
            <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
              {t.comparePreview}
            </li>
            <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
              {t.dragDrop}
            </li>
          </ul>
        </div>

        <canvas ref={canvasRef} className='hidden' />
        <BuiltWithKorelyy locale={locale} />
      </div>
    </div>
  );
}
