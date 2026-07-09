'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Grid3X3, RotateCcw, Image as ImageIcon, Check, Inbox } from 'lucide-react';
import { usePipelineStore, type PipelinePayload } from '@/stores/pipeline';

interface GridCutterProps {
  locale?: string;
}

export default function GridCutter({ locale = 'zh' }: GridCutterProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      back: '返回',
      title: '九宫格切图',
      subtitle: '一键切成9张图，发朋友圈神器',
      uploadTitle: '点击上传图片',
      uploadSub: '支持 JPG、PNG 格式，自动裁成正方形',
      preview: '原图预览',
      reselect: '重新选择',
      processing: '处理中...',
      startCut: '开始切图',
      complete: '切图完成！',
      downloadAll: '下载全部',
      tip: '按顺序保存到相册，发朋友圈更有逼格 ✨',
      slice: '切片',
      received: '已从「图片压缩」接收图片',
    },
    en: {
      back: 'Back',
      title: 'Grid Cutter',
      subtitle: 'Split images into 9 tiles with one click — perfect for Instagram!',
      uploadTitle: 'Click to upload image',
      uploadSub: 'Supports JPG, PNG. Auto-crops to square.',
      preview: 'Original Preview',
      reselect: 'Reselect',
      processing: 'Processing...',
      startCut: 'Start Cutting',
      complete: 'Done!',
      downloadAll: 'Download All',
      tip: 'Save in order to your gallery. Perfect for social posts ✨',
      slice: 'Slice',
      received: 'Image received from Image Compressor',
    },
    hi: {
      back: 'वापस',
      title: 'ग्रिड कटर',
      subtitle: 'एक क्लिक में इमेज को 9 टाइल्स में बाँटें — सोशल मीडिया के लिए बिल्कुल सही!',
      uploadTitle: 'इमेज अपलोड करने के लिए क्लिक करें',
      uploadSub: 'JPG, PNG सपोर्टेड। स्वयं-क्रॉप स्क्वायर में।',
      preview: 'असली पूर्वावलोकन',
      reselect: 'फिर से चुनें',
      processing: 'प्रोसेसिंग...',
      startCut: 'काटना शुरू करें',
      complete: 'हो गया!',
      downloadAll: 'सभी डाउनलोड',
      tip: 'गैलरी में क्रम से सेव करें। सोशल पोस्ट के लिए बेहतरीन ✨',
      slice: 'टाइल',
      received: 'इमेज कंप्रेसर से छवि प्राप्त हुई',
    },
    fr: {
      back: 'Retour',
      title: 'Découpeur Grille',
      subtitle: 'Divisez vos images en 9 carreaux en un clic — parfait pour Instagram !',
      uploadTitle: 'Cliquez pour télécharger une image',
      uploadSub: 'Prend en charge JPG, PNG. Recadrage automatique en carré.',
      preview: 'Aperçu Original',
      reselect: 'Resélectionner',
      processing: 'Traitement...',
      startCut: 'Démarrer la Découpe',
      complete: 'Terminé !',
      downloadAll: 'Tout Télécharger',
      tip: 'Enregistrez dans l\'ordre dans votre galerie. Parfait pour les posts ✨',
      slice: 'Carreau',
      received: 'Image reçue du Compresseur d\'Images',
    },
    es: {
      back: 'Volver',
      title: 'Cortador en Cuadrícula',
      subtitle: 'Divide imágenes en 9 baldosas con un clic — ¡perfecto para Instagram!',
      uploadTitle: 'Haz clic para subir imagen',
      uploadSub: 'Soporte JPG, PNG. Recorte automático a cuadrado.',
      preview: 'Vista Previa Original',
      reselect: 'Reseleccionar',
      processing: 'Procesando...',
      startCut: 'Empezar Corte',
      complete: '¡Listo!',
      downloadAll: 'Descargar Todo',
      tip: 'Guarda en orden en tu galería. Perfecto para publicaciones ✨',
      slice: 'Baldosa',
      received: 'Imagen recibida del Compresor de Imágenes',
    },
    ar: {
      back: 'رجوع',
      title: 'قاطع الشبكة',
      subtitle: 'قسّم الصور إلى 9 مربعات بنقرة واحدة — مثالي لمنشورات السوشيال ميديا!',
      uploadTitle: 'انقر لرفع الصورة',
      uploadSub: 'يدعم JPG و PNG. اقتصاص تلقائي لشكل مربع.',
      preview: 'معاينة الأصل',
      reselect: 'إعادة الاختيار',
      processing: 'جاري المعالجة...',
      startCut: 'ابدأ القطع',
      complete: 'تم!',
      downloadAll: 'تحميل الكل',
      tip: 'احفظ بالترتيب في المعرض. مثالي للمنشورات ✨',
      slice: 'مربع',
      received: 'تم استلام الصورة من ضاغط الصور',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string) => dict[key] ?? translations.zh[key] ?? key;
  };

  const t = getT(locale);

  const [image, setImage] = useState<string | null>(null);
  const [slices, setSlices] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receivedFrom, setReceivedFrom] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const store = usePipelineStore.getState?.();
      const payload = store ? (store.consumePayload ? (store.consumePayload() as PipelinePayload | null) : null) : null;
      if (payload && payload.kind === 'image' && payload.dataUrl) {
        setImage(payload.dataUrl);
        setSlices([]);
        setReceivedFrom(payload.source || 'image-compressor');
        if (typeof window !== 'undefined') {
          try { window.setTimeout(() => setReceivedFrom(null), 8000); } catch {}
        }
      }
    } catch (e) {
      // ignore SSR / store errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setSlices([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      const sliceSize = Math.floor(size / 3);
      const outputSize = 1080;

      const newSlices: string[] = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          canvas.width = outputSize;
          canvas.height = outputSize;

          ctx.drawImage(
            img,
            startX + col * sliceSize,
            startY + row * sliceSize,
            sliceSize,
            sliceSize,
            0,
            0,
            outputSize,
            outputSize
          );

          newSlices.push(canvas.toDataURL('image/jpeg', 0.95));
        }
      }

      setSlices(newSlices);
      setIsProcessing(false);
    };
    img.src = image;
  }, [image]);

  const downloadSlice = useCallback((dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.download = `grid-${index + 1}.jpg`;
    link.href = dataUrl;
    link.click();
  }, []);

  const downloadAll = useCallback(() => {
    slices.forEach((slice, index) => {
      setTimeout(() => downloadSlice(slice, index), index * 200);
    });
  }, [slices, downloadSlice]);

  const reset = useCallback(() => {
    setImage(null);
    setSlices([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='mb-6'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4'
        >
          <RotateCcw className='h-4 w-4' />
          <span>{t('back')}</span>
        </button>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl text-white'>
            <Grid3X3 className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-all'
        >
          <div className='w-16 h-16 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center'>
            <Upload className='h-8 w-8 text-pink-500' />
          </div>
          <p className='text-gray-700 dark:text-gray-300 font-medium mb-1'>{t('uploadTitle')}</p>
          <p className='text-gray-500 dark:text-gray-500 text-sm'>{t('uploadSub')}</p>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
        </div>
      ) : (
        <div className='space-y-6'>
          {receivedFrom && (
            <div className='flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs sm:text-sm'>
              <Inbox className='h-4 w-4 sm:h-4 sm:w-4 shrink-0' />
              <span>{t('received')}</span>
            </div>
          )}
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('preview')}</h3>
              <button
                onClick={reset}
                className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1'
              >
                <RotateCcw className='h-3.5 w-3.5' />
                {t('reselect')}
              </button>
            </div>
            <div className='relative max-w-sm mx-auto'>
              <img
                src={image}
                alt={t('preview')}
                className='w-full aspect-square object-cover rounded-xl'
              />
              <div className='absolute inset-0 pointer-events-none'>
                <div className='w-full h-full grid grid-cols-3 grid-rows-3'>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className='border border-white/50' />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {slices.length === 0 && (
            <button
              onClick={processImage}
              disabled={isProcessing}
              className='w-full py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  {t('processing')}
                </>
              ) : (
                <>
                  <Grid3X3 className='h-5 w-5' />
                  {t('startCut')}
                </>
              )}
            </button>
          )}

          {slices.length > 0 && (
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                  <Check className='h-5 w-5 text-green-500' />
                  {t('complete')}
                </h3>
                <button
                  onClick={downloadAll}
                  className='px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-1.5'
                >
                  <Download className='h-4 w-4' />
                  {t('downloadAll')}
                </button>
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>{t('tip')}</p>
              <div className='grid grid-cols-3 gap-2'>
                {slices.map((slice, index) => (
                  <div
                    key={index}
                    onClick={() => downloadSlice(slice, index)}
                    className='relative aspect-square rounded-lg overflow-hidden cursor-pointer group'
                  >
                    <img src={slice} alt={`${t('slice')} ${index + 1}`} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center'>
                      <Download className='h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                    </div>
                    <div className='absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-medium'>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
