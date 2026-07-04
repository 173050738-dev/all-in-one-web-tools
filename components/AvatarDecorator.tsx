'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw, User, Sparkles, Crown, Heart, Star } from 'lucide-react';

interface AvatarDecoratorProps {
  locale?: string;
}

const borderStyles = [
  { id: 'none', nameKey: 'border.none', color: 'transparent' },
  { id: 'vip', nameKey: 'border.vip', color: 'linear-gradient(135deg, #FFD700, #FFA500)' },
  { id: 'rainbow', nameKey: 'border.rainbow', color: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)' },
  { id: 'pink', nameKey: 'border.pink', color: 'linear-gradient(135deg, #ff6b9d, #c44569)' },
  { id: 'blue', nameKey: 'border.blue', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'green', nameKey: 'border.green', color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { id: 'orange', nameKey: 'border.orange', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'silver', nameKey: 'border.silver', color: 'linear-gradient(135deg, #bdc3c7, #2c3e50)' },
];

const stickers = [
  { id: 'none', nameKey: 'sticker.none', emoji: '' },
  { id: 'crown', nameKey: 'sticker.crown', emoji: '👑', position: 'top-right' },
  { id: 'heart', nameKey: 'sticker.heart', emoji: '❤️', position: 'bottom-right' },
  { id: 'star', nameKey: 'sticker.star', emoji: '⭐', position: 'top-left' },
  { id: 'fire', nameKey: 'sticker.fire', emoji: '🔥', position: 'bottom-left' },
  { id: 'sparkles', nameKey: 'sticker.sparkles', emoji: '✨', position: 'top-right' },
  { id: 'rainbow', nameKey: 'sticker.rainbow', emoji: '🌈', position: 'top' },
  { id: 'diamond', nameKey: 'sticker.diamond', emoji: '💎', position: 'bottom-right' },
];

export default function AvatarDecorator({ locale = 'zh' }: AvatarDecoratorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [selectedBorder, setSelectedBorder] = useState('vip');
  const [selectedSticker, setSelectedSticker] = useState('none');
  const [borderWidth, setBorderWidth] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.back': '返回',
      'action.save': '保存头像',
      'action.reset': '重新选择',
      'title': '头像装饰器',
      'subtitle': '一键加V、渐变边框、可爱挂件',
      'section.borders': '边框样式',
      'section.stickers': '挂件装饰',
      'borderWidth': '边框粗细',
      'upload.title': '点击上传头像',
      'upload.hint': '支持 JPG、PNG 格式，正方形最佳',
      'previewAlt': '头像预览',
      'border.none': '无',
      'border.vip': 'V认证',
      'border.rainbow': '彩虹',
      'border.pink': '粉色',
      'border.blue': '蓝色',
      'border.green': '绿色',
      'border.orange': '橙色',
      'border.silver': '银色',
      'sticker.none': '无',
      'sticker.crown': '皇冠',
      'sticker.heart': '爱心',
      'sticker.star': '星星',
      'sticker.fire': '火焰',
      'sticker.sparkles': '闪光',
      'sticker.rainbow': '彩虹',
      'sticker.diamond': '钻石',
    },
    en: {
      'action.back': 'Back',
      'action.save': 'Save Avatar',
      'action.reset': 'Reselect',
      'title': 'Avatar Decorator',
      'subtitle': 'One-click V-badge, gradient borders, cute stickers',
      'section.borders': 'Border Styles',
      'section.stickers': 'Stickers',
      'borderWidth': 'Border Width',
      'upload.title': 'Click to upload avatar',
      'upload.hint': 'Supports JPG, PNG. Square works best.',
      'previewAlt': 'Avatar preview',
      'border.none': 'None',
      'border.vip': 'V-Badge',
      'border.rainbow': 'Rainbow',
      'border.pink': 'Pink',
      'border.blue': 'Blue',
      'border.green': 'Green',
      'border.orange': 'Orange',
      'border.silver': 'Silver',
      'sticker.none': 'None',
      'sticker.crown': 'Crown',
      'sticker.heart': 'Heart',
      'sticker.star': 'Star',
      'sticker.fire': 'Fire',
      'sticker.sparkles': 'Sparkles',
      'sticker.rainbow': 'Rainbow',
      'sticker.diamond': 'Diamond',
    },
    hi: {
      'action.back': 'वापस',
      'action.save': 'अवतार सहेजें',
      'action.reset': 'फिर से चुनें',
      'title': 'अवतार सजावटकर्ता',
      'subtitle': 'एक क्लिक में V-बैज, ग्रेडिएंट बॉर्डर, प्यारे स्टिकर',
      'section.borders': 'बॉर्डर स्टाइल',
      'section.stickers': 'स्टिकर',
      'borderWidth': 'बॉर्डर चौड़ाई',
      'upload.title': 'अवतार अपलोड करने के लिए क्लिक करें',
      'upload.hint': 'JPG, PNG सपोर्टेड। स्क्वायर सबसे अच्छा है।',
      'previewAlt': 'अवतार पूर्वावलोकन',
      'border.none': 'कोई नहीं',
      'border.vip': 'V-बैज',
      'border.rainbow': 'इंद्रधनुष',
      'border.pink': 'गुलाबी',
      'border.blue': 'नीला',
      'border.green': 'हरा',
      'border.orange': 'नारंगी',
      'border.silver': 'चांदी',
      'sticker.none': 'कोई नहीं',
      'sticker.crown': 'ताज',
      'sticker.heart': 'दिल',
      'sticker.star': 'स्टार',
      'sticker.fire': 'आग',
      'sticker.sparkles': 'चमक',
      'sticker.rainbow': 'इंद्रधनुष',
      'sticker.diamond': 'हीरा',
    },
    fr: {
      'action.back': 'Retour',
      'action.save': "Enregistrer l'avatar",
      'action.reset': 'Resélectionner',
      'title': "Décorateur d'Avatar",
      'subtitle': 'Badge V en un clic, bordures dégradées, autocollants mignons',
      'section.borders': 'Styles de Bordure',
      'section.stickers': 'Autocollants',
      'borderWidth': 'Épaisseur Bordure',
      'upload.title': "Cliquez pour télécharger l'avatar",
      'upload.hint': 'Prend en charge JPG, PNG. Le carré fonctionne mieux.',
      'previewAlt': 'Aperçu avatar',
      'border.none': 'Aucun',
      'border.vip': 'Badge V',
      'border.rainbow': 'Arc-en-ciel',
      'border.pink': 'Rose',
      'border.blue': 'Bleu',
      'border.green': 'Vert',
      'border.orange': 'Orange',
      'border.silver': 'Argent',
      'sticker.none': 'Aucun',
      'sticker.crown': 'Couronne',
      'sticker.heart': 'Cœur',
      'sticker.star': 'Étoile',
      'sticker.fire': 'Feu',
      'sticker.sparkles': 'Paillettes',
      'sticker.rainbow': 'Arc-en-ciel',
      'sticker.diamond': 'Diamant',
    },
    es: {
      'action.back': 'Volver',
      'action.save': 'Guardar Avatar',
      'action.reset': 'Reseleccionar',
      'title': 'Decorador de Avatar',
      'subtitle': 'Insignia V con un clic, bordes degradados, pegatinas lindas',
      'section.borders': 'Estilos de Borde',
      'section.stickers': 'Pegatinas',
      'borderWidth': 'Ancho de Borde',
      'upload.title': 'Haz clic para subir avatar',
      'upload.hint': 'Soporta JPG, PNG. Cuadrado funciona mejor.',
      'previewAlt': 'Vista previa avatar',
      'border.none': 'Ninguno',
      'border.vip': 'Insignia V',
      'border.rainbow': 'Arcoíris',
      'border.pink': 'Rosa',
      'border.blue': 'Azul',
      'border.green': 'Verde',
      'border.orange': 'Naranja',
      'border.silver': 'Plata',
      'sticker.none': 'Ninguno',
      'sticker.crown': 'Corona',
      'sticker.heart': 'Corazón',
      'sticker.star': 'Estrella',
      'sticker.fire': 'Fuego',
      'sticker.sparkles': 'Brillos',
      'sticker.rainbow': 'Arcoíris',
      'sticker.diamond': 'Diamante',
    },
    ar: {
      'action.back': 'رجوع',
      'action.save': 'حفظ الصورة الرمزية',
      'action.reset': 'إعادة الاختيار',
      'title': 'مزين الصور الرمزية',
      'subtitle': 'شارة V بنقرة واحدة، حدود متدرجة، ملصقات لطيفة',
      'section.borders': 'أنماط الحدود',
      'section.stickers': 'الملصقات',
      'borderWidth': 'عرض الحدود',
      'upload.title': 'انقر لتحميل الصورة الرمزية',
      'upload.hint': 'يدعم JPG و PNG. المربع الأفضل.',
      'previewAlt': 'معاينة الصورة الرمزية',
      'border.none': 'لا شيء',
      'border.vip': 'شارة V',
      'border.rainbow': 'قوس قزح',
      'border.pink': 'وردي',
      'border.blue': 'أزرق',
      'border.green': 'أخضر',
      'border.orange': 'برتقالي',
      'border.silver': 'فضي',
      'sticker.none': 'لا شيء',
      'sticker.crown': 'تاج',
      'sticker.heart': 'قلب',
      'sticker.star': 'نجمة',
      'sticker.fire': 'نار',
      'sticker.sparkles': 'بريق',
      'sticker.rainbow': 'قوس قزح',
      'sticker.diamond': 'ماس',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };
  const t = getT(locale);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const getBorderColors = useCallback((borderId: string): string[] => {
    const style = borderStyles.find(s => s.id === borderId);
    if (!style || borderId === 'none') return ['transparent', 'transparent'];
    
    if (borderId === 'rainbow') {
      return ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'];
    }
    if (borderId === 'vip') {
      return ['#FFD700', '#FFA500', '#FFD700'];
    }
    if (borderId === 'pink') return ['#ff6b9d', '#c44569'];
    if (borderId === 'blue') return ['#667eea', '#764ba2'];
    if (borderId === 'green') return ['#11998e', '#38ef7d'];
    if (borderId === 'orange') return ['#f093fb', '#f5576c'];
    if (borderId === 'silver') return ['#bdc3c7', '#2c3e50'];
    return ['#ddd', '#999'];
  }, []);

  const drawAvatar = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      const borderSize = selectedBorder === 'none' ? 0 : borderWidth;
      const avatarSize = size - borderSize * 2;
      const center = size / 2;

      if (selectedBorder !== 'none') {
        const colors = getBorderColors(selectedBorder);
        const gradient = ctx.createConicGradient(0, center, center);
        colors.forEach((color, i) => {
          gradient.addColorStop(i / (colors.length - 1), color);
        });
        ctx.beginPath();
        ctx.arc(center, center, size / 2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();

      const scale = Math.max(avatarSize / img.width, avatarSize / img.height);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;
      const x = center - scaledW / 2;
      const y = center - scaledH / 2;

      ctx.drawImage(img, x, y, scaledW, scaledH);
      ctx.restore();

      const sticker = stickers.find(s => s.id === selectedSticker);
      if (sticker && sticker.emoji) {
        const stickerSize = size * 0.25;
        let sx = center;
        let sy = center;

        switch (sticker.position) {
          case 'top-right':
            sx = size - stickerSize * 0.4;
            sy = stickerSize * 0.4;
            break;
          case 'top-left':
            sx = stickerSize * 0.4;
            sy = stickerSize * 0.4;
            break;
          case 'bottom-right':
            sx = size - stickerSize * 0.4;
            sy = size - stickerSize * 0.4;
            break;
          case 'bottom-left':
            sx = stickerSize * 0.4;
            sy = size - stickerSize * 0.4;
            break;
          case 'top':
            sx = center;
            sy = stickerSize * 0.3;
            break;
        }

        ctx.font = `${stickerSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, sx, sy);
      }

      if (selectedBorder === 'vip') {
        const vBadgeSize = size * 0.18;
        const vx = size - vBadgeSize * 0.3;
        const vy = size - vBadgeSize * 0.3;

        ctx.beginPath();
        ctx.arc(vx, vy, vBadgeSize * 0.6, 0, Math.PI * 2);
        const vGrad = ctx.createLinearGradient(vx - 30, vy - 30, vx + 30, vy + 30);
        vGrad.addColorStop(0, '#FFD700');
        vGrad.addColorStop(1, '#FFA500');
        ctx.fillStyle = vGrad;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = `bold ${vBadgeSize * 0.7}px Arial`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('V', vx, vy);
      }
    };
    img.src = image;
  }, [image, selectedBorder, selectedSticker, borderWidth, getBorderColors]);

  useEffect(() => {
    if (image) {
      drawAvatar();
    }
  }, [image, drawAvatar]);

  const downloadAvatar = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'avatar-decorated.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const reset = useCallback(() => {
    setImage(null);
    setSelectedBorder('vip');
    setSelectedSticker('none');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const currentBorder = borderStyles.find(s => s.id === selectedBorder);

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='mb-6'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4'
        >
          <RotateCcw className='h-4 w-4' />
          <span>{t('action.back')}</span>
        </button>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white'>
            <User className='h-6 w-6' />
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
          className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all'
        >
          <div className='w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center'>
            <Upload className='h-8 w-8 text-purple-500' />
          </div>
          <p className='text-gray-700 dark:text-gray-300 font-medium mb-1'>{t('upload.title')}</p>
          <p className='text-gray-500 dark:text-gray-500 text-sm'>{t('upload.hint')}</p>
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
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col items-center'>
              <div
                ref={previewRef}
                className='w-48 h-48 rounded-full overflow-hidden relative'
                style={{
                  background: currentBorder?.color || 'transparent',
                  padding: selectedBorder === 'none' ? 0 : borderWidth,
                }}
              >
                <img
                  src={image}
                  alt={t('previewAlt')}
                  className='w-full h-full object-cover rounded-full'
                />
                {selectedSticker !== 'none' && (
                  <div
                    className='absolute text-4xl'
                    style={{
                      top: stickers.find(s => s.id === selectedSticker)?.position?.includes('top') ? '5%' : 'auto',
                      bottom: stickers.find(s => s.id === selectedSticker)?.position?.includes('bottom') ? '5%' : 'auto',
                      left: stickers.find(s => s.id === selectedSticker)?.position?.includes('left') ? '5%' : 'auto',
                      right: stickers.find(s => s.id === selectedSticker)?.position?.includes('right') ? '5%' : 'auto',
                    }}
                  >
                    {stickers.find(s => s.id === selectedSticker)?.emoji}
                  </div>
                )}
              </div>
              <button
                onClick={reset}
                className='mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1'
              >
                <RotateCcw className='h-3.5 w-3.5' />
                {t('action.reset')}
              </button>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Sparkles className='h-4 w-4 text-yellow-500' />
              {t('section.borders')}
            </h3>
            <div className='grid grid-cols-4 gap-2 mb-4'>
              {borderStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedBorder(style.id)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedBorder === style.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div
                    className='w-10 h-10 mx-auto rounded-full'
                    style={{
                      background: style.color,
                      padding: style.id === 'none' ? 0 : 3,
                    }}
                  >
                    <div className='w-full h-full rounded-full bg-gray-200 dark:bg-gray-600' />
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1 text-center'>{t(style.nameKey)}</p>
                </button>
              ))}
            </div>
            {selectedBorder !== 'none' && (
              <div className='space-y-2'>
                <label className='text-sm text-gray-600 dark:text-gray-400'>{t('borderWidth')}</label>
                <input
                  type='range'
                  min='4'
                  max='20'
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500'
                />
              </div>
            )}
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Crown className='h-4 w-4 text-yellow-500' />
              {t('section.stickers')}
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {stickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => setSelectedSticker(sticker.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSticker === sticker.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className='text-2xl text-center'>
                    {sticker.emoji || '❌'}
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1 text-center'>{t(sticker.nameKey)}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={downloadAvatar}
            className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2'
          >
            <Download className='h-5 w-5' />
            {t('action.save')}
          </button>
        </div>
      )}
    </div>
  );
}
