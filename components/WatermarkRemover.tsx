'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Upload, Trash2, Image as ImageIcon, Eraser, Brush, Undo2, Redo2, Eye, EyeOff, X, Sparkles, Archive } from 'lucide-react';
import BuiltWithKorelyy from './BuiltWithKorelyy';

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

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalUrl: string;
  originalCanvas: HTMLCanvasElement | null;
  maskCanvas: HTMLCanvasElement | null;
  resultCanvas: HTMLCanvasElement | null;
  resultSize: number;
  status: 'pending' | 'painted' | 'processing' | 'done' | 'error';
  error?: string;
  maskHistory: ImageData[];
  historyIndex: number;
}

type ToolMode = 'brush' | 'eraser';

interface WatermarkRemoverProps {
  locale?: string;
}

export default function WatermarkRemover({ locale = 'zh' }: WatermarkRemoverProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      title: '图片去水印',
      subtitle: '100% 本地处理，文件不上传，更隐私更安全',
      upload: '点击或拖拽上传图片',
      formats: '支持 JPG、PNG、WebP 等格式',
      brushSize: '画笔大小',
      brush: '画笔',
      eraser: '橡皮',
      clearMask: '清除涂抹',
      undo: '撤销',
      redo: '重做',
      compare: '对比原图',
      remove: '去除水印',
      removing: '处理中...',
      download: '下载',
      downloadAll: '下载全部 ZIP',
      batch: '批量模式',
      batchRemove: '一键去除全部',
      clearAll: '清空全部',
      before: '原图',
      after: '修复后',
      noImages: '暂无图片',
      statusPending: '待处理',
      statusPainted: '已涂抹',
      statusDone: '已完成',
      statusError: '错误',
      tip: '💡 提示：用笔涂抹水印区域，越精准效果越好',
      notice: '⚠️ 仅用于您拥有版权或获得授权的图片',
      processing: '正在处理...',
      progress: '进度',
      images: '张图片',
      delete: '删除',
      features: '功能特点',
      localProcessing: '纯本地处理，保护隐私',
      smartInpaint: '智能修复算法',
      batchRemove: '批量去水印',
      zipDownload: 'ZIP 打包下载',
      undoRedo: '撤销/重做',
      comparePreview: '原图对比预览',
      dragDrop: '支持拖拽上传',
      guide: '使用指南',
      guideText: '上传图片后，用画笔涂抹水印区域，点击去除水印即可智能修复。完全本地处理，不上传服务器。',
      sidebarFeatures: '功能特点',
      confirmClear: '确定清空所有图片？',
    },
    en: {
      title: 'Watermark Remover',
      subtitle: '100% Local Processing, Files Never Uploaded, Private & Secure',
      upload: 'Click or drag to upload images',
      formats: 'Supports JPG, PNG, WebP and more',
      brushSize: 'Brush Size',
      brush: 'Brush',
      eraser: 'Eraser',
      clearMask: 'Clear Mask',
      undo: 'Undo',
      redo: 'Redo',
      compare: 'Compare',
      remove: 'Remove Watermark',
      removing: 'Processing...',
      download: 'Download',
      downloadAll: 'Download All ZIP',
      batch: 'Batch Mode',
      batchRemove: 'Remove All',
      clearAll: 'Clear All',
      before: 'Before',
      after: 'After',
      noImages: 'No images',
      statusPending: 'Pending',
      statusPainted: 'Marked',
      statusDone: 'Done',
      statusError: 'Error',
      tip: '💡 Tip: Paint precisely over the watermark for best results',
      notice: '⚠️ Only use on images you own or have permission for',
      processing: 'Processing...',
      progress: 'Progress',
      images: 'images',
      delete: 'Delete',
      features: 'Features',
      localProcessing: '100% Local Processing',
      smartInpaint: 'Smart Inpainting Algorithm',
      batchRemove: 'Batch Watermark Removal',
      zipDownload: 'ZIP Download',
      undoRedo: 'Undo/Redo',
      comparePreview: 'Before/After Comparison',
      dragDrop: 'Drag & Drop Support',
      guide: 'How to Use',
      guideText: 'Upload an image, paint over the watermark, then click remove. All processing happens locally in your browser.',
      sidebarFeatures: 'Features',
      confirmClear: 'Clear all images?',
    },
    es: {
      title: 'Quitar Marcas de Agua',
      subtitle: 'Procesamiento 100% local, los archivos nunca se suben',
      upload: 'Haz clic o arrastra para subir imágenes',
      formats: 'Compatible con JPG, PNG, WebP y más',
      brushSize: 'Tamaño del Pincel',
      brush: 'Pincel',
      eraser: 'Borrador',
      clearMask: 'Limpiar',
      undo: 'Deshacer',
      redo: 'Rehacer',
      compare: 'Comparar',
      remove: 'Quitar Marca',
      removing: 'Procesando...',
      download: 'Descargar',
      downloadAll: 'Descargar Todo ZIP',
      batch: 'Modo Lote',
      batchRemove: 'Quitar Todas',
      clearAll: 'Limpiar Todo',
      before: 'Antes',
      after: 'Después',
      noImages: 'Sin imágenes',
      statusPending: 'Pendiente',
      statusPainted: 'Marcado',
      statusDone: 'Listo',
      statusError: 'Error',
      tip: '💡 Consejo: Pinta con precisión para mejores resultados',
      notice: '⚠️ Usa solo en imágenes que posees o tienes permiso',
      processing: 'Procesando...',
      progress: 'Progreso',
      images: 'imágenes',
      delete: 'Eliminar',
      features: 'Características',
      localProcessing: 'Procesamiento 100% local',
      smartInpaint: 'Algoritmo de relleno inteligente',
      batchRemove: 'Eliminación por lotes',
      zipDownload: 'Descarga ZIP',
      undoRedo: 'Deshacer/Rehacer',
      comparePreview: 'Comparación Antes/Después',
      dragDrop: 'Soporte arrastrar y soltar',
      guide: 'Cómo usar',
      guideText: 'Sube una imagen, pinta sobre la marca de agua, luego haz clic en quitar. Todo el procesamiento es local.',
      sidebarFeatures: 'Características',
      confirmClear: '¿Limpiar todas las imágenes?',
    },
    fr: {
      title: 'Supprimer Filigrane',
      subtitle: 'Traitement 100% local, aucun téléchargement',
      upload: 'Cliquez ou glissez pour importer des images',
      formats: 'Prend en charge JPG, PNG, WebP et plus',
      brushSize: 'Taille du Pinceau',
      brush: 'Pinceau',
      eraser: 'Gomme',
      clearMask: 'Effacer',
      undo: 'Annuler',
      redo: 'Rétablir',
      compare: 'Comparer',
      remove: 'Supprimer',
      removing: 'Traitement...',
      download: 'Télécharger',
      downloadAll: 'Tout Télécharger ZIP',
      batch: 'Mode Lot',
      batchRemove: 'Tout Supprimer',
      clearAll: 'Tout Effacer',
      before: 'Avant',
      after: 'Après',
      noImages: 'Aucune image',
      statusPending: 'En attente',
      statusPainted: 'Marqué',
      statusDone: 'Terminé',
      statusError: 'Erreur',
      tip: '💡 Astuce : Peignez précisément pour de meilleurs résultats',
      notice: '⚠️ Utilisez uniquement sur vos images',
      processing: 'Traitement...',
      progress: 'Progrès',
      images: 'images',
      delete: 'Supprimer',
      features: 'Caractéristiques',
      localProcessing: 'Traitement 100% local',
      smartInpaint: 'Algorithme de retouche intelligent',
      batchRemove: 'Suppression par lots',
      zipDownload: 'Téléchargement ZIP',
      undoRedo: 'Annuler/Rétablir',
      comparePreview: 'Comparaison Avant/Après',
      dragDrop: 'Glisser-déposer',
      guide: "Guide d'utilisation",
      guideText: 'Importez une image, peignez sur le filigrane, puis cliquez sur supprimer. Tout se fait localement.',
      sidebarFeatures: 'Caractéristiques',
      confirmClear: 'Vider toutes les images ?',
    },
    hi: {
      title: 'वॉटरमार्क हटाएं',
      subtitle: '100% लोकल प्रोसेसिंग, कोई अपलोड नहीं',
      upload: 'क्लिक करें या ड्रैग करें',
      formats: 'JPG, PNG, WebP आदि का समर्थन',
      brushSize: 'ब्रश का आकार',
      brush: 'ब्रश',
      eraser: 'इरेज़र',
      clearMask: 'साफ़ करें',
      undo: 'वापस',
      redo: 'फिर से',
      compare: 'तुलना',
      remove: 'वॉटरमार्क हटाएं',
      removing: 'प्रोसेसिंग...',
      download: 'डाउनलोड',
      downloadAll: 'सभी डाउनलोड ZIP',
      batch: 'बैच मोड',
      batchRemove: 'सभी हटाएं',
      clearAll: 'सभी साफ़ करें',
      before: 'पहले',
      after: 'बाद में',
      noImages: 'कोई इमेज नहीं',
      statusPending: 'बाकी',
      statusPainted: 'चिह्नित',
      statusDone: 'हो गया',
      statusError: 'गलती',
      tip: '💡 सुझाव: बेहतर परिणाम के लिए सटीक रंगें',
      notice: '⚠️ केवल अपनी इमेजों पर उपयोग करें',
      processing: 'प्रोसेस हो रहा है...',
      progress: 'प्रगति',
      images: 'इमेज',
      delete: 'हटाएं',
      features: 'विशेषताएं',
      localProcessing: '100% लोकल प्रोसेसिंग',
      smartInpaint: 'स्मार्ट इनपेंटिंग एल्गोरिदम',
      batchRemove: 'बैच में हटाएं',
      zipDownload: 'ZIP डाउनलोड',
      undoRedo: 'अंडू/रिडू',
      comparePreview: 'पहले/बाद में तुलना',
      dragDrop: 'ड्रैग & ड्रॉप',
      guide: 'कैसे उपयोग करें',
      guideText: 'इमेज अपलोड करें, वॉटरमार्क पर रंगें, फिर हटाएं पर क्लिक करें। सब कुछ लोकल होता है।',
      sidebarFeatures: 'विशेषताएं',
      confirmClear: 'सभी इमेजें साफ़ करें?',
    },
    ar: {
      title: 'إزالة العلامة المائية',
      subtitle: 'معالجة محلية 100٪، لا يتم رفع الملفات',
      upload: 'انقر أو اسحب لرفع الصور',
      formats: 'يدعم JPG, PNG, WebP والمزيد',
      brushSize: 'حجم الفرشاة',
      brush: 'فرشاة',
      eraser: 'ممحاة',
      clearMask: 'مسح التحديد',
      undo: 'تراجع',
      redo: 'إعادة',
      compare: 'مقارنة',
      remove: 'إزالة العلامة',
      removing: 'قيد المعالجة...',
      download: 'تحميل',
      downloadAll: 'تحميل الكل ZIP',
      batch: 'وضع الدفعة',
      batchRemove: 'إزالة الكل',
      clearAll: 'مسح الكل',
      before: 'قبل',
      after: 'بعد',
      noImages: 'لا توجد صور',
      statusPending: 'قيد الانتظار',
      statusPainted: 'محدد',
      statusDone: 'مكتمل',
      statusError: 'خطأ',
      tip: '💡 نصيحة: ارسم بدقة للحصول على أفضل النتائج',
      notice: '⚠️ استخدم فقط على الصور التي تملكها',
      processing: 'قيد المعالجة...',
      progress: 'التقدم',
      images: 'صور',
      delete: 'حذف',
      features: 'الميزات',
      localProcessing: 'معالجة محلية 100%',
      smartInpaint: 'خوارزمية إصلاح ذكية',
      batchRemove: 'إزالة بالدفعات',
      zipDownload: 'تحميل ZIP',
      undoRedo: 'تراجع/إعادة',
      comparePreview: 'مقارنة قبل/بعد',
      dragDrop: 'دعم السحب والإفلات',
      guide: 'كيفية الاستخدام',
      guideText: 'ارفع صورة، ارسم على العلامة المائية، ثم انقر على إزالة. كل شيء يتم محلياً.',
      sidebarFeatures: 'الميزات',
      confirmClear: 'مسح جميع الصور؟',
    },
  };

  const t = translations[locale] || translations.en;

  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [toolMode, setToolMode] = useState<ToolMode>('brush');
  const [isComparing, setIsComparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedImage = images.find((img) => img.id === selectedId) || null;

  const loadImageToCanvas = useCallback((file: File): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const createMaskCanvas = useCallback((width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (fileArray.length === 0) return;

      const newImages: ImageItem[] = [];

      for (const file of fileArray) {
        try {
          const canvas = await loadImageToCanvas(file);
          const maskCanvas = createMaskCanvas(canvas.width, canvas.height);
          const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

          const maskCtx = maskCanvas.getContext('2d');
          const initialMaskData = maskCtx ? maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height) : new ImageData(maskCanvas.width, maskCanvas.height);

          newImages.push({
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalUrl: URL.createObjectURL(file),
            originalCanvas: canvas,
            maskCanvas,
            resultCanvas: null,
            resultSize: 0,
            status: 'pending',
            maskHistory: [initialMaskData],
            historyIndex: 0,
          });
        } catch (e) {
          console.error('Failed to load image:', e);
        }
      }

      setImages((prev) => {
        const updated = [...prev, ...newImages];
        if (!selectedId && newImages.length > 0) {
          setSelectedId(newImages[0].id);
        }
        return updated;
      });
    },
    [loadImageToCanvas, createMaskCanvas, selectedId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const updateCanvasDisplay = useCallback(() => {
    if (!selectedImage || !imageCanvasRef.current || !maskCanvasRef.current) return;

    const displayCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const container = canvasContainerRef.current;
    if (!container) return;

    const sourceCanvas = isComparing ? selectedImage.originalCanvas : selectedImage.resultCanvas || selectedImage.originalCanvas;
    if (!sourceCanvas) return;

    const maxWidth = container.clientWidth;
    const maxHeight = Math.min(window.innerHeight * 0.6, 600);
    const scale = Math.min(maxWidth / sourceCanvas.width, maxHeight / sourceCanvas.height, 1);

    const displayWidth = Math.floor(sourceCanvas.width * scale);
    const displayHeight = Math.floor(sourceCanvas.height * scale);

    displayCanvas.width = displayWidth;
    displayCanvas.height = displayHeight;
    maskCanvas.width = displayWidth;
    maskCanvas.height = displayHeight;

    const displayCtx = displayCanvas.getContext('2d');
    if (displayCtx) {
      displayCtx.drawImage(sourceCanvas, 0, 0, displayWidth, displayHeight);
    }

    if (selectedImage.maskCanvas && !isComparing) {
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.clearRect(0, 0, displayWidth, displayHeight);
        maskCtx.drawImage(selectedImage.maskCanvas, 0, 0, displayWidth, displayHeight);
      }
    }
  }, [selectedImage, isComparing]);

  useEffect(() => {
    updateCanvasDisplay();
  }, [updateCanvasDisplay]);

  useEffect(() => {
    const handleResize = () => updateCanvasDisplay();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasDisplay]);

  const getCanvasPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
      const canvas = maskCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ('touches' in e) {
        clientX = e.touches[0]?.clientX || 0;
        clientY = e.touches[0]?.clientY || 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const drawOnMask = useCallback(
    (x: number, y: number, lastX?: number, lastY?: number) => {
      if (!selectedImage || !selectedImage.maskCanvas) return;

      const displayCanvas = maskCanvasRef.current;
      const originalMask = selectedImage.maskCanvas;
      if (!displayCanvas || !originalMask) return;

      const scaleX = originalMask.width / displayCanvas.width;
      const scaleY = originalMask.height / displayCanvas.height;

      const origX = x * scaleX;
      const origY = y * scaleY;
      const origLastX = lastX !== undefined ? lastX * scaleX : origX;
      const origLastY = lastY !== undefined ? lastY * scaleY : origY;

      const ctx = originalMask.getContext('2d');
      const displayCtx = displayCanvas.getContext('2d');
      if (!ctx || !displayCtx) return;

      ctx.globalCompositeOperation = toolMode === 'brush' ? 'source-over' : 'destination-out';
      displayCtx.globalCompositeOperation = toolMode === 'brush' ? 'source-over' : 'destination-out';

      const radius = (brushSize * scaleX) / 2;
      const displayRadius = brushSize / 2;

      ctx.fillStyle = toolMode === 'brush' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 1)';
      displayCtx.fillStyle = toolMode === 'brush' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 0, 1)';

      ctx.beginPath();
      displayCtx.beginPath();

      if (lastX !== undefined && lastY !== undefined) {
        ctx.moveTo(origLastX, origLastY);
        ctx.lineTo(origX, origY);
        ctx.lineWidth = radius * 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        displayCtx.moveTo(lastX, lastY);
        displayCtx.lineTo(x, y);
        displayCtx.lineWidth = brushSize;
        displayCtx.lineCap = 'round';
        displayCtx.stroke();
      } else {
        ctx.arc(origX, origY, radius, 0, Math.PI * 2);
        ctx.fill();

        displayCtx.arc(x, y, displayRadius, 0, Math.PI * 2);
        displayCtx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      displayCtx.globalCompositeOperation = 'source-over';
    },
    [selectedImage, brushSize, toolMode]
  );

  const saveHistoryState = useCallback(() => {
    if (!selectedImage || !selectedImage.maskCanvas) return;

    const maskCtx = selectedImage.maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const maskData = maskCtx.getImageData(0, 0, selectedImage.maskCanvas.width, selectedImage.maskCanvas.height);

    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== selectedImage.id) return img;
        const newHistory = img.maskHistory.slice(0, img.historyIndex + 1);
        newHistory.push(maskData);
        if (newHistory.length > 50) newHistory.shift();
        return {
          ...img,
          maskHistory: newHistory,
          historyIndex: newHistory.length - 1,
          status: 'painted',
        };
      })
    );
  }, [selectedImage]);

  const handleDrawStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!selectedImage || isComparing) return;
      e.preventDefault();
      isDrawingRef.current = true;
      const pos = getCanvasPos(e);
      lastPosRef.current = pos;
      drawOnMask(pos.x, pos.y);
    },
    [selectedImage, isComparing, getCanvasPos, drawOnMask]
  );

  const handleDrawMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current || !selectedImage || isComparing) return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      const lastPos = lastPosRef.current;
      drawOnMask(pos.x, pos.y, lastPos?.x, lastPos?.y);
      lastPosRef.current = pos;
    },
    [selectedImage, isComparing, getCanvasPos, drawOnMask]
  );

  const handleDrawEnd = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      saveHistoryState();
    }
  }, [saveHistoryState]);

  const handleUndo = useCallback(() => {
    if (!selectedImage || selectedImage.historyIndex <= 0) return;

    const newIndex = selectedImage.historyIndex - 1;
    const historyData = selectedImage.maskHistory[newIndex];

    if (selectedImage.maskCanvas && historyData) {
      const maskCtx = selectedImage.maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.putImageData(historyData, 0, 0);
      }
    }

    setImages((prev) =>
      prev.map((img) =>
        img.id === selectedImage.id
          ? { ...img, historyIndex: newIndex, status: newIndex > 0 ? 'painted' : 'pending' }
          : img
      )
    );
    setTimeout(updateCanvasDisplay, 0);
  }, [selectedImage, updateCanvasDisplay]);

  const handleRedo = useCallback(() => {
    if (!selectedImage || selectedImage.historyIndex >= selectedImage.maskHistory.length - 1) return;

    const newIndex = selectedImage.historyIndex + 1;
    const historyData = selectedImage.maskHistory[newIndex];

    if (selectedImage.maskCanvas && historyData) {
      const maskCtx = selectedImage.maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.putImageData(historyData, 0, 0);
      }
    }

    setImages((prev) =>
      prev.map((img) =>
        img.id === selectedImage.id ? { ...img, historyIndex: newIndex, status: 'painted' } : img
      )
    );
    setTimeout(updateCanvasDisplay, 0);
  }, [selectedImage, updateCanvasDisplay]);

  const handleClearMask = useCallback(() => {
    if (!selectedImage || !selectedImage.maskCanvas) return;

    const maskCtx = selectedImage.maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, selectedImage.maskCanvas.width, selectedImage.maskCanvas.height);
    }

    saveHistoryState();
    setImages((prev) =>
      prev.map((img) => (img.id === selectedImage.id ? { ...img, status: 'pending', resultCanvas: null } : img))
    );
    setTimeout(updateCanvasDisplay, 0);
  }, [selectedImage, saveHistoryState, updateCanvasDisplay]);

  const inpaint = useCallback((sourceCanvas: HTMLCanvasElement, maskCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = sourceCanvas.width;
    resultCanvas.height = sourceCanvas.height;

    const resultCtx = resultCanvas.getContext('2d');
    if (!resultCtx) return sourceCanvas;

    resultCtx.drawImage(sourceCanvas, 0, 0);

    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    const sourceCtx = sourceCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!sourceCtx || !maskCtx) return resultCanvas;

    const sourceData = resultCtx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);
    const srcPixels = sourceData.data;
    const maskPixels = maskData.data;

    const isMasked = (i: number) => maskPixels[i * 4 + 3] > 128;

    const tempMask = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      tempMask[i] = isMasked(i) ? 1 : 0;
    }

    const inpaintRadius = Math.max(3, Math.floor(Math.min(width, height) * 0.01));

    for (let iter = 0; iter < 15; iter++) {
      let changed = false;
      const newPixels = new Uint8ClampedArray(srcPixels);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (!tempMask[idx]) continue;

          let r = 0,
            g = 0,
            b = 0,
            a = 0,
            count = 0;

          for (let dy = -inpaintRadius; dy <= inpaintRadius; dy++) {
            for (let dx = -inpaintRadius; dx <= inpaintRadius; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

              const nidx = ny * width + nx;
              if (tempMask[nidx]) continue;

              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > inpaintRadius) continue;

              const weight = 1 - dist / inpaintRadius;
              const pi = nidx * 4;

              r += srcPixels[pi] * weight;
              g += srcPixels[pi + 1] * weight;
              b += srcPixels[pi + 2] * weight;
              a += srcPixels[pi + 3] * weight;
              count += weight;
            }
          }

          if (count > 0) {
            const pi = idx * 4;
            newPixels[pi] = Math.round(r / count);
            newPixels[pi + 1] = Math.round(g / count);
            newPixels[pi + 2] = Math.round(b / count);
            newPixels[pi + 3] = Math.round(a / count);
            tempMask[idx] = 0;
            changed = true;
          }
        }
      }

      srcPixels.set(newPixels);
      if (!changed) break;
    }

    resultCtx.putImageData(sourceData, 0, 0);
    return resultCanvas;
  }, []);

  const processSingleImage = useCallback(
    (img: ImageItem): Promise<ImageItem> => {
      return new Promise((resolve) => {
        if (!img.originalCanvas || !img.maskCanvas) {
          resolve({ ...img, status: 'error', error: 'Missing canvas data' });
          return;
        }

        try {
          const resultCanvas = inpaint(img.originalCanvas, img.maskCanvas);

          resultCanvas.toBlob(
            (blob) => {
              resolve({
                ...img,
                resultCanvas,
                resultSize: blob?.size || 0,
                status: 'done',
              });
            },
            'image/png'
          );
        } catch (e) {
          resolve({ ...img, status: 'error', error: String(e) });
        }
      });
    },
    [inpaint]
  );

  const handleRemoveWatermark = useCallback(async () => {
    if (!selectedImage) return;

    setImages((prev) =>
      prev.map((img) => (img.id === selectedImage.id ? { ...img, status: 'processing' } : img))
    );

    const processed = await processSingleImage(selectedImage);

    setImages((prev) => prev.map((img) => (img.id === selectedImage.id ? processed : img)));
    setTimeout(updateCanvasDisplay, 0);
  }, [selectedImage, processSingleImage, updateCanvasDisplay]);

  const handleBatchRemove = useCallback(async () => {
    const paintedImages = images.filter((img) => img.status === 'painted' || img.status === 'pending');
    if (paintedImages.length === 0) return;

    setBatchProcessing(true);
    setBatchProgress({ current: 0, total: paintedImages.length });

    for (let i = 0; i < paintedImages.length; i++) {
      const img = paintedImages[i];
      setBatchProgress({ current: i, total: paintedImages.length });

      const processed = await processSingleImage(img);

      setImages((prev) => prev.map((im) => (im.id === img.id ? processed : im)));
    }

    setBatchProcessing(false);
    setBatchProgress({ current: paintedImages.length, total: paintedImages.length });
    setTimeout(updateCanvasDisplay, 0);
  }, [images, processSingleImage, updateCanvasDisplay]);

  const handleDownload = useCallback(() => {
    if (!selectedImage || !selectedImage.resultCanvas) return;

    selectedImage.resultCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = selectedImage.name.replace(/\.[^/.]+$/, '');
      a.download = `${baseName}_clean.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [selectedImage]);

  const handleDownloadAll = useCallback(async () => {
    const doneImages = images.filter((img) => img.status === 'done' && img.resultCanvas);
    if (doneImages.length === 0) return;

    const files: { name: string; data: ArrayBuffer }[] = [];

    for (const img of doneImages) {
      if (!img.resultCanvas) continue;
      const blob = await new Promise<Blob | null>((resolve) => {
        img.resultCanvas?.toBlob(resolve, 'image/png');
      });
      if (!blob) continue;

      const arrayBuffer = await blob.arrayBuffer();
      const baseName = img.name.replace(/\.[^/.]+$/, '');
      files.push({ name: `${baseName}_clean.png`, data: arrayBuffer });
    }

    if (files.length === 0) return;

    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermark-removed.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [images]);

  const handleDelete = useCallback(
    (id: string) => {
      setImages((prev) => {
        const filtered = prev.filter((img) => img.id !== id);
        if (selectedId === id) {
          setSelectedId(filtered.length > 0 ? filtered[0].id : null);
        }
        return filtered;
      });
    },
    [selectedId]
  );

  const handleClearAll = useCallback(() => {
    if (!confirm(t.confirmClear)) return;
    setImages([]);
    setSelectedId(null);
  }, [t.confirmClear]);

  const doneCount = images.filter((i) => i.status === 'done').length;
  const paintedCount = images.filter((i) => i.status === 'painted').length;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="lg:w-48 space-y-3 order-2 lg:order-1">
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{t.upload}</p>
            <p className="text-xs text-gray-400 mt-1">{t.formats}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {images.length} {t.images}
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  {t.clearAll}
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative group rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedId === img.id
                        ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900'
                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                    onClick={() => setSelectedId(img.id)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                      <img
                        src={img.resultCanvas ? img.resultCanvas.toDataURL() : img.originalUrl}
                        alt={img.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                      <p className="text-xs text-white truncate">{img.name}</p>
                      <p className="text-xs text-gray-300">
                        {img.status === 'done' && <span className="text-green-400">✓ {t.statusDone}</span>}
                        {img.status === 'painted' && <span className="text-yellow-400">{t.statusPainted}</span>}
                        {img.status === 'pending' && <span className="text-gray-400">{t.statusPending}</span>}
                        {img.status === 'processing' && <span className="text-blue-400">{t.processing}</span>}
                        {img.status === 'error' && <span className="text-red-400">{t.statusError}</span>}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(img.id);
                      }}
                      className="absolute top-1 end-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 order-1 lg:order-2">
          {!selectedImage ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all min-h-[400px] flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">{t.upload}</h3>
              <p className="text-sm text-gray-400">{t.formats}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setToolMode('brush')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      toolMode === 'brush'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Brush className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.brush}</span>
                  </button>
                  <button
                    onClick={() => setToolMode('eraser')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      toolMode === 'eraser'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Eraser className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.eraser}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-[120px] max-w-[200px]">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{t.brushSize}</span>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="flex-1 accent-primary-500"
                  />
                  <span className="text-xs text-gray-500 w-8 text-center">{brushSize}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleUndo}
                    disabled={selectedImage.historyIndex <= 0}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={t.undo}
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={selectedImage.historyIndex >= selectedImage.maskHistory.length - 1}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={t.redo}
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleClearMask}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors"
                    title={t.clearMask}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onMouseDown={() => setIsComparing(true)}
                    onMouseUp={() => setIsComparing(false)}
                    onMouseLeave={() => setIsComparing(false)}
                    onTouchStart={() => setIsComparing(true)}
                    onTouchEnd={() => setIsComparing(false)}
                    className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    title={t.compare}
                  >
                    {isComparing ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div
                ref={canvasContainerRef}
                className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]"
                style={{ cursor: toolMode === 'brush' ? 'crosshair' : 'cell' }}
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={handleDrawEnd}
                onMouseLeave={handleDrawEnd}
                onTouchStart={handleDrawStart}
                onTouchMove={handleDrawMove}
                onTouchEnd={handleDrawEnd}
              >
                <canvas
                  ref={imageCanvasRef}
                  className="max-w-full max-h-[60vh] object-contain"
                  style={{ imageRendering: 'auto' }}
                />
                <canvas
                  ref={maskCanvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ imageRendering: 'auto' }}
                />
                {isComparing && (
                  <div className="absolute top-4 start-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg">
                    {t.before}
                  </div>
                )}
                {selectedImage.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-white font-medium">{t.removing}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRemoveWatermark}
                  disabled={selectedImage.status === 'processing'}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                  {t.remove}
                </button>

                {selectedImage.status === 'done' && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    {t.download}
                  </button>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handleBatchRemove}
                      disabled={batchProcessing || paintedCount === 0}
                      className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      {batchProcessing ? `${t.processing} ${batchProgress.current}/${batchProgress.total}` : t.batchRemove}
                    </button>
                    {doneCount > 0 && (
                      <button
                        onClick={handleDownloadAll}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium rounded-xl transition-colors"
                      >
                        <Archive className="h-4 w-4" />
                        {t.downloadAll} ({doneCount})
                      </button>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">{t.tip}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">{t.notice}</p>
            </div>
          )}
        </div>

        <div className="lg:w-64 order-3">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t.guide}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{t.guideText}</p>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t.sidebarFeatures}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.localProcessing}
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.smartInpaint}
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.batchRemove}
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.zipDownload}
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.undoRedo}
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.comparePreview}
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {t.dragDrop}
              </li>
            </ul>
          </div>

          <BuiltWithKorelyy locale={locale} className="mt-4" />
        </div>
      </div>
    </div>
  );
}
