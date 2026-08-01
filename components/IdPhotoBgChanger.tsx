'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, X, Eye, EyeOff, RefreshCw, Sparkles, Sliders } from 'lucide-react';
import BuiltWithKorelyy from './BuiltWithKorelyy';

interface IdPhotoBgChangerProps {
  locale?: string;
}

type BgKey = 'blue' | 'white' | 'red';

const BG_COLORS: { key: BgKey; hex: string }[] = [
  { key: 'blue', hex: '#438EDB' },
  { key: 'white', hex: '#FFFFFF' },
  { key: 'red', hex: '#D9001B' },
];

const i18n: Record<string, Record<string, string>> = {
  en: {
    title: 'ID Photo Background Changer',
    sub: 'Replace the background of your ID photo right in your browser. 100% local, no upload.',
    upload: 'Click or drop an ID photo here',
    formats: 'Supports JPG, PNG, WebP',
    bgColor: 'Background Color',
    blue: 'Blue',
    white: 'White',
    red: 'Red',
    tolerance: 'Tolerance',
    downloadPng: 'Download PNG',
    downloadJpg: 'Download JPG',
    reset: 'Reset',
    compare: 'Compare',
    original: 'Original',
    result: 'Result',
    tip: 'Tip: The background color is sampled from the 4 corners. Raise tolerance to remove more; lower it to keep more of the subject. Edges are smoothed automatically.',
    guide: 'How to Use',
    guideText: 'Upload an ID photo, pick a new background color, fine-tune the tolerance slider, then download as PNG or JPG. All processing happens locally in your browser — your photo never leaves your device.',
    features: 'Features',
    f1: '100% local, private',
    f2: 'Smart edge smoothing',
    f3: 'Blue / White / Red backgrounds',
    f4: 'PNG & JPG download',
    f5: '6 languages, RTL support',
    changePhoto: 'Change Photo',
    processing: 'Processing...',
  },
  zh: {
    title: '证件照背景替换器',
    sub: '在浏览器中直接替换证件照背景，100% 本地处理，不上传。',
    upload: '点击或拖拽上传证件照',
    formats: '支持 JPG、PNG、WebP',
    bgColor: '背景颜色',
    blue: '蓝色',
    white: '白色',
    red: '红色',
    tolerance: '容差',
    downloadPng: '下载 PNG',
    downloadJpg: '下载 JPG',
    reset: '重置',
    compare: '对比原图',
    original: '原图',
    result: '效果图',
    tip: '提示：背景色从图片四个角落自动采样。容差调大去除更多，调小保留更多主体，边缘会自动平滑过渡。',
    guide: '使用指南',
    guideText: '上传证件照，选择新的背景颜色，微调容差滑块，然后下载 PNG 或 JPG。全部处理在浏览器本地完成，照片不会离开你的设备。',
    features: '功能特点',
    f1: '100% 本地处理，保护隐私',
    f2: '智能边缘平滑',
    f3: '蓝 / 白 / 红三色背景',
    f4: 'PNG 与 JPG 下载',
    f5: '六语言 + RTL 支持',
    changePhoto: '更换照片',
    processing: '处理中...',
  },
  es: {
    title: 'Cambiar Fondo de Foto Carnet',
    sub: 'Reemplaza el fondo de tu foto carnet en el navegador. 100% local, sin subir.',
    upload: 'Haz clic o arrastra una foto aquí',
    formats: 'Admite JPG, PNG, WebP',
    bgColor: 'Color de Fondo',
    blue: 'Azul',
    white: 'Blanco',
    red: 'Rojo',
    tolerance: 'Tolerancia',
    downloadPng: 'Descargar PNG',
    downloadJpg: 'Descargar JPG',
    reset: 'Reiniciar',
    compare: 'Comparar',
    original: 'Original',
    result: 'Resultado',
    tip: 'Consejo: el color de fondo se muestrea desde las 4 esquinas. Sube la tolerancia para quitar más; bájala para conservar más del sujeto. Los bordes se suavizan solos.',
    guide: 'Cómo usar',
    guideText: 'Sube una foto, elige un nuevo color de fondo, ajusta la tolerancia y descarga en PNG o JPG. Todo se procesa localmente en tu navegador.',
    features: 'Características',
    f1: '100% local y privado',
    f2: 'Suavizado inteligente de bordes',
    f3: 'Fondos azul / blanco / rojo',
    f4: 'Descarga PNG y JPG',
    f5: '6 idiomas, soporte RTL',
    changePhoto: 'Cambiar foto',
    processing: 'Procesando...',
  },
  fr: {
    title: 'Changer le Fond de Photo d\'Identité',
    sub: 'Remplacez le fond de votre photo d\'identité dans le navigateur. 100% local, sans envoi.',
    upload: 'Cliquez ou déposez une photo ici',
    formats: 'Prend en charge JPG, PNG, WebP',
    bgColor: 'Couleur de Fond',
    blue: 'Bleu',
    white: 'Blanc',
    red: 'Rouge',
    tolerance: 'Tolérance',
    downloadPng: 'Télécharger PNG',
    downloadJpg: 'Télécharger JPG',
    reset: 'Réinitialiser',
    compare: 'Comparer',
    original: 'Original',
    result: 'Résultat',
    tip: 'Astuce : la couleur de fond est échantillonnée depuis les 4 coins. Augmentez la tolérance pour enlever plus ; diminuez-la pour garder plus du sujet. Les bords sont lissés automatiquement.',
    guide: 'Mode d\'emploi',
    guideText: 'Importez une photo, choisissez une nouvelle couleur de fond, ajustez la tolérance, puis téléchargez en PNG ou JPG. Tout est traité localement dans votre navigateur.',
    features: 'Caractéristiques',
    f1: '100% local et privé',
    f2: 'Lissage intelligent des bords',
    f3: 'Fonds bleu / blanc / rouge',
    f4: 'Téléchargement PNG et JPG',
    f5: '6 langues, support RTL',
    changePhoto: 'Changer la photo',
    processing: 'Traitement...',
  },
  hi: {
    title: 'आईडी फोटो बैकग्राउंड बदलें',
    sub: 'अपने ब्राउज़र में आईडी फोटो का बैकग्राउंड बदलें। 100% स्थानीय, कोई अपलोड नहीं।',
    upload: 'क्लिक करें या यहाँ फोटो ड्रॉप करें',
    formats: 'JPG, PNG, WebP समर्थित',
    bgColor: 'बैकग्राउंड रंग',
    blue: 'नीला',
    white: 'सफेद',
    red: 'लाल',
    tolerance: 'सहनशीलता',
    downloadPng: 'PNG डाउनलोड करें',
    downloadJpg: 'JPG डाउनलोड करें',
    reset: 'रीसेट',
    compare: 'तुलना करें',
    original: 'मूल',
    result: 'परिणाम',
    tip: 'सुझाव: बैकग्राउंड रंग 4 कोनों से नमूना लिया जाता है। अधिक हटाने के लिए सहनशीलता बढ़ाएं; विषय बनाए रखने के लिए घटाएं। किनारे स्वचालित चिकने होते हैं।',
    guide: 'कैसे उपयोग करें',
    guideText: 'एक फोटो अपलोड करें, नया बैकग्राउंड रंग चुनें, सहनशीलता स्लाइडर समायोजित करें, फिर PNG या JPG के रूप में डाउनलोड करें। सब कुछ आपके ब्राउज़र में स्थानीय रूप से होता है।',
    features: 'विशेषताएं',
    f1: '100% स्थानीय, निजी',
    f2: 'स्मार्ट एज स्मूदिंग',
    f3: 'नीला / सफेद / लाल बैकग्राउंड',
    f4: 'PNG और JPG डाउनलोड',
    f5: '6 भाषाएं, RTL समर्थन',
    changePhoto: 'फोटो बदलें',
    processing: 'प्रोसेस हो रहा है...',
  },
  ar: {
    title: 'تغيير خلفية صورة الهوية',
    sub: 'استبدل خلفية صورة هويتك مباشرة في المتصفح. 100% محلي، بدون رفع.',
    upload: 'انقر أو أسقط صورة هنا',
    formats: 'يدعم JPG و PNG و WebP',
    bgColor: 'لون الخلفية',
    blue: 'أزرق',
    white: 'أبيض',
    red: 'أحمر',
    tolerance: 'التفاوت',
    downloadPng: 'تحميل PNG',
    downloadJpg: 'تحميل JPG',
    reset: 'إعادة تعيين',
    compare: 'مقارنة',
    original: 'الأصل',
    result: 'النتيجة',
    tip: 'نصيحة: يتم أخذ عينة لون الخلفية من الزوايا الأربع. ارفع التفاوت لإزالة المزيد؛ اخفضه للاحتفاظ بالمزيد من الموضوع. يتم تنعيم الحواف تلقائيًا.',
    guide: 'كيفية الاستخدام',
    guideText: 'ارفع صورة، اختر لون خلفية جديد، اضبط شريط التفاوت، ثم حمّل بصيغة PNG أو JPG. تتم كل المعالجة محليًا في متصفحك.',
    features: 'الميزات',
    f1: '100% محلي وخاص',
    f2: 'تنعيم ذكي للحواف',
    f3: 'خلفيات أزرق / أبيض / أحمر',
    f4: 'تحميل PNG و JPG',
    f5: '6 لغات، دعم RTL',
    changePhoto: 'تغيير الصورة',
    processing: 'قيد المعالجة...',
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = hex.replace('#', '');
  return {
    r: parseInt(m.slice(0, 2), 16),
    g: parseInt(m.slice(2, 4), 16),
    b: parseInt(m.slice(4, 6), 16),
  };
}

export default function IdPhotoBgChanger({ locale = 'en' }: IdPhotoBgChangerProps) {
  const t = i18n[locale] || i18n.en;
  const isRtl = locale === 'ar';

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageName, setImageName] = useState('');
  const [bgKey, setBgKey] = useState<BgKey>('blue');
  const [tolerance, setTolerance] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const bgColor = BG_COLORS.find((c) => c.key === bgKey)!.hex;

  const drawToPreview = useCallback((canvas: HTMLCanvasElement) => {
    const preview = previewCanvasRef.current;
    const wrap = previewWrapRef.current;
    if (!preview || !wrap) return;
    const maxW = wrap.clientWidth || 400;
    const maxH = Math.min(window.innerHeight * 0.55, 560);
    const scale = Math.min(maxW / canvas.width, maxH / canvas.height, 1);
    const dw = Math.max(1, Math.floor(canvas.width * scale));
    const dh = Math.max(1, Math.floor(canvas.height * scale));
    preview.width = dw;
    preview.height = dh;
    const ctx = preview.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, dw, dh);
    ctx.drawImage(canvas, 0, 0, dw, dh);
  }, []);

  const processImage = useCallback(() => {
    const src = sourceCanvasRef.current;
    if (!src) return;
    setProcessing(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      try {
        const w = src.width;
        const h = src.height;
        const sctx = src.getContext('2d', { willReadFrequently: true });
        if (!sctx) {
          setProcessing(false);
          return;
        }
        const imgData = sctx.getImageData(0, 0, w, h);
        const px = imgData.data;

        // Sample 4 corners to determine background color
        const ss = Math.max(2, Math.floor(Math.min(w, h) * 0.03));
        let rS = 0,
          gS = 0,
          bS = 0,
          c = 0;
        const sampleCorner = (sx: number, sy: number) => {
          for (let y = sy; y < sy + ss && y < h; y++) {
            for (let x = sx; x < sx + ss && x < w; x++) {
              const i = (y * w + x) * 4;
              rS += px[i];
              gS += px[i + 1];
              bS += px[i + 2];
              c++;
            }
          }
        };
        sampleCorner(0, 0);
        sampleCorner(w - ss, 0);
        sampleCorner(0, h - ss);
        sampleCorner(w - ss, h - ss);
        const bgR = rS / c;
        const bgG = gS / c;
        const bgB = bS / c;

        const nb = hexToRgb(bgColor);
        // tolerance 0-100 -> RGB euclidean distance 0 - sqrt(3)*255 ≈ 441.673
        const threshold = (tolerance / 100) * 441.673;
        const band = Math.max(6, threshold * 0.18); // edge smoothing band

        const out = new Uint8ClampedArray(px.length);
        for (let i = 0; i < px.length; i += 4) {
          const r = px[i];
          const g = px[i + 1];
          const b = px[i + 2];
          const dr = r - bgR;
          const dg = g - bgG;
          const db = b - bgB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);
          // mask: 1 = background, 0 = foreground (subject)
          let mask: number;
          if (dist >= threshold) mask = 0;
          else if (dist <= threshold - band) mask = 1;
          else mask = (threshold - dist) / band; // smooth edge transition
          const inv = 1 - mask;
          out[i] = mask * nb.r + inv * r;
          out[i + 1] = mask * nb.g + inv * g;
          out[i + 2] = mask * nb.b + inv * b;
          out[i + 3] = 255;
        }

        const resCanvas = document.createElement('canvas');
        resCanvas.width = w;
        resCanvas.height = h;
        const rctx = resCanvas.getContext('2d');
        if (!rctx) {
          setProcessing(false);
          return;
        }
        const resData = new ImageData(out, w, h);
        rctx.putImageData(resData, 0, 0);
        resultCanvasRef.current = resCanvas;
        setHasResult(true);
        if (!showOriginal) drawToPreview(resCanvas);
      } catch (e) {
        console.error('process error', e);
      } finally {
        setProcessing(false);
      }
    });
  }, [bgColor, tolerance, drawToPreview, showOriginal]);

  // Real-time reprocess when image / bg / tolerance changes
  useEffect(() => {
    if (imageLoaded) processImage();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imageLoaded, bgKey, tolerance, processImage]);

  // Toggle original/result preview
  useEffect(() => {
    if (!imageLoaded) return;
    const target = showOriginal ? sourceCanvasRef.current : resultCanvasRef.current;
    if (target) drawToPreview(target);
  }, [showOriginal, imageLoaded, hasResult, drawToPreview]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Cap dimensions for performance
        const MAX = 2000;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          const s = Math.min(MAX / w, MAX / h);
          w = Math.max(1, Math.floor(w * s));
          h = Math.max(1, Math.floor(h * s));
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        sourceCanvasRef.current = canvas;
        resultCanvasRef.current = null;
        setImageName(file.name);
        setImageLoaded(true);
        setHasResult(false);
        setShowOriginal(false);
      };
      img.onerror = () => {
        console.error('image load failed');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const f = Array.from(files).find((x) => x.type.startsWith('image/'));
      if (f) loadFile(f);
    },
    [loadFile]
  );

  const handleDownload = useCallback(
    (format: 'png' | 'jpeg') => {
      const canvas = resultCanvasRef.current;
      if (!canvas) return;
      const base = imageName.replace(/\.[^/.]+$/, '') || 'id-photo';
      if (format === 'png') {
        // PNG: keep replaced background faithfully (lossless)
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${base}_bg.png`;
          a.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      } else {
        // JPG: no alpha channel — fill white first then composite
        const tmp = document.createElement('canvas');
        tmp.width = canvas.width;
        tmp.height = canvas.height;
        const tctx = tmp.getContext('2d');
        if (!tctx) return;
        tctx.fillStyle = '#FFFFFF';
        tctx.fillRect(0, 0, tmp.width, tmp.height);
        tctx.drawImage(canvas, 0, 0);
        tmp.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${base}_bg.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.92);
      }
    },
    [imageName]
  );

  const handleReset = useCallback(() => {
    sourceCanvasRef.current = null;
    resultCanvasRef.current = null;
    setImageLoaded(false);
    setHasResult(false);
    setImageName('');
    setShowOriginal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    const preview = previewCanvasRef.current;
    if (preview) {
      const c = preview.getContext('2d');
      c?.clearRect(0, 0, preview.width, preview.height);
    }
  }, []);

  // Redraw preview on resize
  useEffect(() => {
    const onResize = () => {
      const target = showOriginal ? sourceCanvasRef.current : resultCanvasRef.current;
      if (target) drawToPreview(target);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawToPreview, showOriginal]);

  const colorLabel = (k: BgKey) => (k === 'blue' ? t.blue : k === 'white' ? t.white : t.red);

  return (
    <div className="w-full max-w-5xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" size={22} />
          {t.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 lg:gap-6">
        {/* Main area */}
        <div className="space-y-4">
          {/* Upload zone / preview */}
          {!imageLoaded ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all min-h-[320px] flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
            >
              <ImageIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.upload}</p>
              <p className="text-xs text-gray-400 mt-1">{t.formats}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                ref={previewWrapRef}
                className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[280px]"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
                }}
              >
                <canvas ref={previewCanvasRef} className="max-w-full max-h-[60vh] object-contain" />
                {processing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">{t.processing}</p>
                    </div>
                  </div>
                )}
                {showOriginal && (
                  <div className="absolute top-3 start-3 px-3 py-1.5 bg-black/70 text-white text-xs rounded-lg">
                    {t.original}
                  </div>
                )}
                {!showOriginal && hasResult && (
                  <div className="absolute top-3 start-3 px-3 py-1.5 bg-indigo-600/80 text-white text-xs rounded-lg">
                    {t.result}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium min-h-[44px]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t.changePhoto}
                  </button>
                  <button
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onMouseLeave={() => setShowOriginal(false)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      setShowOriginal(true);
                    }}
                    onTouchEnd={() => setShowOriginal(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium min-h-[44px]"
                    title={t.compare}
                  >
                    {showOriginal ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {t.compare}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition text-sm font-medium min-h-[44px] ms-auto"
                  >
                    <X className="h-4 w-4" />
                    {t.reset}
                  </button>
                </div>

                {/* Background color swatches */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">{t.bgColor}</label>
                  <div className="flex flex-wrap gap-2">
                    {BG_COLORS.map((c) => {
                      const selected = c.key === bgKey;
                      const isWhite = c.key === 'white';
                      return (
                        <button
                          key={c.key}
                          onClick={() => setBgKey(c.key)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition min-h-[44px] text-sm font-medium ${
                            selected
                              ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                              : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                          }`}
                        >
                          <span
                            className="inline-block w-5 h-5 rounded-full border border-gray-300 dark:border-gray-500 flex-shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-gray-700 dark:text-gray-200">{colorLabel(c.key)}</span>
                          {selected && (
                            <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d={isWhite ? 'M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z' : 'M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z'}
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tolerance slider */}
                <div>
                  <label className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5" />
                      {t.tolerance}
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{tolerance}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full h-10 accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Downloads */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleDownload('png')}
                    disabled={!hasResult || processing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition min-h-[44px] flex-1 justify-center"
                  >
                    <Download className="h-4 w-4" />
                    {t.downloadPng}
                  </button>
                  <button
                    onClick={() => handleDownload('jpeg')}
                    disabled={!hasResult || processing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition min-h-[44px] flex-1 justify-center"
                  >
                    <Download className="h-4 w-4" />
                    {t.downloadJpg}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-1">{t.tip}</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">{t.guide}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t.guideText}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">{t.features}</h3>
            <ul className="space-y-2">
              {[t.f1, t.f2, t.f3, t.f4, t.f5].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <BuiltWithKorelyy locale={locale} />
        </div>
      </div>
    </div>
  );
}
