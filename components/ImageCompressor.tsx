'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Upload, Settings, Trash2, Image as ImageIcon, ArrowLeftRight, FileImage, X, Check, Sparkles } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'korelyy-image-compressor-settings';

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

type CompressionMode = 'quality' | 'targetSize';

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
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const settings = { quality, maxWidth, outputFormat, compressionMode, removeExif };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [quality, maxWidth, outputFormat, compressionMode, removeExif]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isProcessing && images.length > 0) {
          const pendingImages = images.filter(img => img.status === 'pending');
          if (pendingImages.length > 0) {
            compressImages();
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

        if (width > maxWidth) {
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

        if (compressionMode === 'targetSize' && targetSizeKB) {
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

    for (const img of doneImages) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      downloadSingleImage(img);
    }
  };

  const handleCompareMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparePosition(percent);
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

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
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
              </div>
            </div>

            <div>
              <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5'>
                {compressionMode === 'quality' ? t.quality : t.targetSize}
              </label>
              {compressionMode === 'quality' ? (
                <div>
                  <div className='flex items-center justify-between mb-1'>
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
                            {t.processing}
                          </span>
                        )}
                        {image.status === 'done' && (
                          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'>
                            <Check className='h-3 w-3 mr-1' />
                            {t.compressed}
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

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6'>
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
            <Download className='h-4 w-4 sm:h-5 sm:w-5' />
            {isBatchMode ? t.downloadAll : t.download}
          </button>
          {!isBatchMode && currentImage?.compressedUrl && !showCompare && (
            <button
              onClick={() => setShowCompare(true)}
              className='w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            >
              <ArrowLeftRight className='h-4 w-4 sm:h-5 sm:w-5' />
              {t.compare}
            </button>
          )}
          {!isBatchMode && currentImage?.compressedUrl && showCompare && (
            <button
              onClick={() => downloadSingleImage(currentImage)}
              className='w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            >
              <Download className='h-4 w-4 sm:h-5 sm:w-5' />
              {t.download}
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
      </div>
    </div>
  );
}
