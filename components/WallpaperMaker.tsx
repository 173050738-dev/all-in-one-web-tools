'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Type, Palette, Shuffle, Image as ImageIcon } from 'lucide-react';

interface WallpaperMakerProps {
  locale?: string;
}

export default function WallpaperMaker({ locale = 'zh' }: WallpaperMakerProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.back': '返回',
      'title': '手机壁纸工坊',
      'subtitle': '渐变+文字，打造专属壁纸',
      'gradient.title': '渐变颜色',
      'gradient.sunset': '日落',
      'gradient.ocean': '海洋',
      'gradient.forest': '森林',
      'gradient.purple': '紫霞',
      'gradient.pink': '樱花',
      'gradient.orange': '暖阳',
      'gradient.blue': '冰蓝',
      'gradient.mint': '薄荷',
      'gradient.peach': '蜜桃',
      'gradient.lavender': '薰衣草',
      'gradient.midnight': '午夜',
      'gradient.candy': '糖果',
      'gradient.aurora': '极光',
      'gradient.flame': '火焰',
      'gradient.emerald': '翡翠',
      'gradient.golden': '金色',
      'text.title': '文字设置',
      'text.placeholder': '输入你想写的文字...',
      'text.white': '⬜ 白字',
      'text.black': '⬛ 黑字',
      'text.fontSize': '字号大小',
      'font.normal': '默认',
      'font.bold': '粗体',
      'font.light': '细体',
      'font.italic': '斜体',
      'align.left': '左对齐',
      'align.center': '居中',
      'align.right': '右对齐',
      'preset.title': '💡 推荐文案',
      'preset.1': '今天也要加油鸭',
      'preset.2': '一切都是最好的安排',
      'preset.3': '愿你被世界温柔以待',
      'preset.4': '保持热爱，奔赴山海',
      'preset.5': '未来可期',
      'preset.6': '好事正在路上',
      'preset.7': '做自己的太阳',
      'preset.8': '生活明朗，万物可爱',
      'random': '随机一个',
      'preview': '预览文字',
      'download': '下载壁纸 (1080×1920)',
      'tip': '📱 适配大部分手机屏幕，点击保存到相册即可设置',
    },
    en: {
      'action.back': 'Back',
      'title': 'Wallpaper Studio',
      'subtitle': 'Gradient + Text, create your own wallpaper',
      'gradient.title': 'Gradient Colors',
      'gradient.sunset': 'Sunset',
      'gradient.ocean': 'Ocean',
      'gradient.forest': 'Forest',
      'gradient.purple': 'Purple',
      'gradient.pink': 'Sakura',
      'gradient.orange': 'Sunny',
      'gradient.blue': 'Ice Blue',
      'gradient.mint': 'Mint',
      'gradient.peach': 'Peach',
      'gradient.lavender': 'Lavender',
      'gradient.midnight': 'Midnight',
      'gradient.candy': 'Candy',
      'gradient.aurora': 'Aurora',
      'gradient.flame': 'Flame',
      'gradient.emerald': 'Emerald',
      'gradient.golden': 'Golden',
      'text.title': 'Text Settings',
      'text.placeholder': 'Enter your text...',
      'text.white': '⬜ White',
      'text.black': '⬛ Black',
      'text.fontSize': 'Font Size',
      'font.normal': 'Normal',
      'font.bold': 'Bold',
      'font.light': 'Light',
      'font.italic': 'Italic',
      'align.left': 'Left',
      'align.center': 'Center',
      'align.right': 'Right',
      'preset.title': '💡 Suggested Quotes',
      'preset.1': 'Stay positive today',
      'preset.2': 'Everything happens for a reason',
      'preset.3': 'May you be treated kindly',
      'preset.4': 'Keep loving, keep living',
      'preset.5': 'The future is bright',
      'preset.6': 'Good things are coming',
      'preset.7': 'Be your own sunshine',
      'preset.8': 'Life is beautiful',
      'random': 'Randomize',
      'preview': 'Preview text',
      'download': 'Download (1080×1920)',
      'tip': '📱 Fits most phone screens. Save to gallery and set as wallpaper',
    },
    hi: {
      'action.back': 'वापस',
      'title': 'वॉलपेपर स्टूडियो',
      'subtitle': 'ग्रेडिएंट + टेक्स्ट, अपना वॉलपेपर बनाएं',
      'gradient.title': 'ग्रेडिएंट रंग',
      'gradient.sunset': 'सूर्यास्त',
      'gradient.ocean': 'समुद्र',
      'gradient.forest': 'जंगल',
      'gradient.purple': 'बैंगनी',
      'gradient.pink': 'गुलाबी',
      'gradient.orange': 'नारंगी',
      'gradient.blue': 'बर्फीला नीला',
      'gradient.mint': 'पुदीना',
      'gradient.peach': 'पीच',
      'gradient.lavender': 'लैवेंडर',
      'gradient.midnight': 'आधी रात',
      'gradient.candy': 'कैंडी',
      'gradient.aurora': 'अरोरा',
      'gradient.flame': 'आग',
      'gradient.emerald': 'पन्ना',
      'gradient.golden': 'सुनहरा',
      'text.title': 'टेक्स्ट सेटिंग्स',
      'text.placeholder': 'अपना टेक्स्ट दर्ज करें...',
      'text.white': '⬜ सफेद',
      'text.black': '⬛ काला',
      'text.fontSize': 'फ़ॉन्ट आकार',
      'font.normal': 'सामान्य',
      'font.bold': 'बोल्ड',
      'font.light': 'पतला',
      'font.italic': 'इटैलिक',
      'align.left': 'बाईं ओर',
      'align.center': 'बीच में',
      'align.right': 'दाईं ओर',
      'preset.title': '💡 सुझाव',
      'preset.1': 'आज मोटिवेट रहें',
      'preset.2': 'सब कुछ किसी कारण से होता है',
      'preset.3': 'भगवान आपका भला करे',
      'preset.4': 'प्यार करते रहें',
      'preset.5': 'भविष्य उज्ज्वल है',
      'preset.6': 'अच्छी चीजें आ रही हैं',
      'preset.7': 'खुद का सूर्य बनें',
      'preset.8': 'जिंदगी खूबसूरत है',
      'random': 'यादृच्छिक',
      'preview': 'पूर्वावलोकन',
      'download': 'डाउनलोड (1080×1920)',
      'tip': '📱 अधिकांश फोन स्क्रीन के अनुकूल। गैलरी में सेव करें और वॉलपेपर सेट करें',
    },
    fr: {
      'action.back': 'Retour',
      'title': 'Studio Fond d\'Écran',
      'subtitle': 'Dégradé + Texte, créez votre wallpaper personnalisé',
      'gradient.title': 'Couleurs Dégradées',
      'gradient.sunset': 'Coucher',
      'gradient.ocean': 'Océan',
      'gradient.forest': 'Forêt',
      'gradient.purple': 'Violet',
      'gradient.pink': 'Rose',
      'gradient.orange': 'Orange',
      'gradient.blue': 'Bleu Glace',
      'gradient.mint': 'Menthe',
      'gradient.peach': 'Pêche',
      'gradient.lavender': 'Lavande',
      'gradient.midnight': 'Nuit',
      'gradient.candy': 'Bonbon',
      'gradient.aurora': 'Aurore',
      'gradient.flame': 'Flamme',
      'gradient.emerald': 'Émeraude',
      'gradient.golden': 'Doré',
      'text.title': 'Paramètres Texte',
      'text.placeholder': 'Entrez votre texte...',
      'text.white': '⬜ Blanc',
      'text.black': '⬛ Noir',
      'text.fontSize': 'Taille Police',
      'font.normal': 'Normal',
      'font.bold': 'Gras',
      'font.light': 'Fin',
      'font.italic': 'Italique',
      'align.left': 'Gauche',
      'align.center': 'Centre',
      'align.right': 'Droite',
      'preset.title': '💡 Citations Suggérées',
      'preset.1': 'Restez positif',
      'preset.2': 'Tout arrive pour une raison',
      'preset.3': 'Soyez heureux',
      'preset.4': 'Aimez la vie',
      'preset.5': 'Avenir radieux',
      'preset.6': 'De bonnes choses arrivent',
      'preset.7': 'Soyez votre soleil',
      'preset.8': 'La vie est belle',
      'random': 'Aléatoire',
      'preview': 'Aperçu',
      'download': 'Télécharger (1080×1920)',
      'tip': '📱 Convient à la plupart des écrans. Enregistrez et définissez comme fond d\'écran',
    },
    es: {
      'action.back': 'Volver',
      'title': 'Estudio de Fondos',
      'subtitle': 'Gradiente + Texto, crea tu wallpaper personalizado',
      'gradient.title': 'Colores de Gradiente',
      'gradient.sunset': 'Atardecer',
      'gradient.ocean': 'Océano',
      'gradient.forest': 'Bosque',
      'gradient.purple': 'Púrpura',
      'gradient.pink': 'Rosa',
      'gradient.orange': 'Naranja',
      'gradient.blue': 'Azul Hielo',
      'gradient.mint': 'Menta',
      'gradient.peach': 'Melocotón',
      'gradient.lavender': 'Lavanda',
      'gradient.midnight': 'Noche',
      'gradient.candy': 'Dulce',
      'gradient.aurora': 'Aurora',
      'gradient.flame': 'Llama',
      'gradient.emerald': 'Esmeralda',
      'gradient.golden': 'Dorado',
      'text.title': 'Ajustes de Texto',
      'text.placeholder': 'Escribe tu texto...',
      'text.white': '⬜ Blanco',
      'text.black': '⬛ Negro',
      'text.fontSize': 'Tamaño Fuente',
      'font.normal': 'Normal',
      'font.bold': 'Negrita',
      'font.light': 'Ligera',
      'font.italic': 'Cursiva',
      'align.left': 'Izquierda',
      'align.center': 'Centro',
      'align.right': 'Derecha',
      'preset.title': '💡 Frases Sugeridas',
      'preset.1': 'Mantente positivo',
      'preset.2': 'Todo pasa por algo',
      'preset.3': 'Sé feliz',
      'preset.4': 'Ama la vida',
      'preset.5': 'Futuro brillante',
      'preset.6': 'Cosas buenas vienen',
      'preset.7': 'Sé tu propio sol',
      'preset.8': 'La vida es bella',
      'random': 'Aleatorio',
      'preview': 'Vista previa',
      'download': 'Descargar (1080×1920)',
      'tip': '📱 Ajusta a la mayoría de pantallas. Guarda y pon como fondo',
    },
    ar: {
      'action.back': 'رجوع',
      'title': 'استوديو الخلفية',
      'subtitle': 'تدرج + نص، أنشئ خلفيتك الخاصة',
      'gradient.title': 'ألوان التدرج',
      'gradient.sunset': 'غروب',
      'gradient.ocean': 'بحر',
      'gradient.forest': 'غابة',
      'gradient.purple': 'بنفسجي',
      'gradient.pink': 'وردي',
      'gradient.orange': 'برتقالي',
      'gradient.blue': 'أزرق ثلجي',
      'gradient.mint': 'نعناع',
      'gradient.peach': 'خوخي',
      'gradient.lavender': 'خزامى',
      'gradient.midnight': 'منتصف الليل',
      'gradient.candy': 'حلوى',
      'gradient.aurora': 'شفق قطبي',
      'gradient.flame': 'لهب',
      'gradient.emerald': 'زمردي',
      'gradient.golden': 'ذهبي',
      'text.title': 'إعدادات النص',
      'text.placeholder': 'أدخل النص...',
      'text.white': '⬜ أبيض',
      'text.black': '⬛ أسود',
      'text.fontSize': 'حجم الخط',
      'font.normal': 'عادي',
      'font.bold': 'عريض',
      'font.light': 'خفيف',
      'font.italic': 'مائل',
      'align.left': 'يسار',
      'align.center': 'وسط',
      'align.right': 'يمين',
      'preset.title': '💡 اقتراحات',
      'preset.1': 'ابقَ إيجابياً',
      'preset.2': 'كل شيء يحدث لسبب',
      'preset.3': 'كن سعيداً',
      'preset.4': 'أحب الحياة',
      'preset.5': 'المستقبل مشرق',
      'preset.6': 'أشياء جيدة قادمة',
      'preset.7': 'كن شمسك نفسك',
      'preset.8': 'الحياة جميلة',
      'random': 'عشوائي',
      'preview': 'معاينة',
      'download': 'تحميل (1080×1920)',
      'tip': '📱 يناسب معظم الشاشات. احفظ في المعرض واجعله خلفية',
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

  const gradients = [
    { id: 'sunset', colors: ['#ff6b6b', '#feca57'] },
    { id: 'ocean', colors: ['#2e86de', '#00d2d3'] },
    { id: 'forest', colors: ['#10ac84', '#1dd1a1'] },
    { id: 'purple', colors: ['#a55eea', '#8854d0'] },
    { id: 'pink', colors: ['#fd79a8', '#e84393'] },
    { id: 'orange', colors: ['#fd9644', '#fa8231'] },
    { id: 'blue', colors: ['#45aaf2', '#2d98da'] },
    { id: 'mint', colors: ['#26de81', '#20bf6b'] },
    { id: 'peach', colors: ['#fc5c65', '#fd9644'] },
    { id: 'lavender', colors: ['#a55eea', '#d6a2e8'] },
    { id: 'midnight', colors: ['#1e272e', '#485460'] },
    { id: 'candy', colors: ['#ff6b9d', '#c44569'] },
    { id: 'aurora', colors: ['#00d2d3', '#54a0ff'] },
    { id: 'flame', colors: ['#ff4757', '#ff6348'] },
    { id: 'emerald', colors: ['#00b894', '#55efc4'] },
    { id: 'golden', colors: ['#fdcb6e', '#e17055'] },
  ];

  const fontStyles = [
    { id: 'normal', key: 'font.normal', weight: 'normal', style: 'normal' },
    { id: 'bold', key: 'font.bold', weight: 'bold', style: 'normal' },
    { id: 'light', key: 'font.light', weight: '300', style: 'normal' },
    { id: 'italic', key: 'font.italic', weight: 'normal', style: 'italic' },
  ];

  const presetTexts = [
    t('preset.1'),
    t('preset.2'),
    t('preset.3'),
    t('preset.4'),
    t('preset.5'),
    t('preset.6'),
    t('preset.7'),
    t('preset.8'),
  ];

  const [selectedGradient, setSelectedGradient] = useState('sunset');
  const [text, setText] = useState(t('preset.1'));
  const [fontSize, setFontSize] = useState(48);
  const [fontStyle, setFontStyle] = useState('bold');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<CanvasTextAlign>('center');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const gradient = gradients.find(g => g.id === selectedGradient) || gradients[0];

  const drawWallpaper = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const gradientObj = ctx.createLinearGradient(0, 0, width, height);
    gradientObj.addColorStop(0, gradient.colors[0]);
    gradientObj.addColorStop(1, gradient.colors[1]);
    ctx.fillStyle = gradientObj;
    ctx.fillRect(0, 0, width, height);

    if (text) {
      const style = fontStyles.find(f => f.id === fontStyle) || fontStyles[0];
      ctx.fillStyle = textColor;
      ctx.font = `${style.weight} ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';

      let x = width / 2;
      if (textAlign === 'left') x = width * 0.1;
      if (textAlign === 'right') x = width * 0.9;

      const lines = text.split('\n');
      const lineHeight = fontSize * 1.4;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
      });
    }
  }, [gradient, text, fontSize, fontStyle, textColor, textAlign]);

  useEffect(() => {
    drawWallpaper();
  }, [drawWallpaper]);

  const downloadWallpaper = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'wallpaper.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const randomize = useCallback(() => {
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const randomText = presetTexts[Math.floor(Math.random() * presetTexts.length)];
    setSelectedGradient(randomGradient.id);
    setText(randomText);
  }, [presetTexts]);

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
          <div className='p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white'>
            <ImageIcon className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Palette className='h-4 w-4 text-indigo-500' />
              {t('gradient.title')}
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {gradients.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGradient(g.id)}
                  className={`aspect-square rounded-xl transition-all ${
                    selectedGradient === g.id
                      ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                  }}
                  title={t(`gradient.${g.id}`)}
                />
              ))}
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Type className='h-4 w-4 text-indigo-500' />
              {t('text.title')}
            </h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
              rows={3}
              placeholder={t('text.placeholder')}
            />
            <div className='mt-3 grid grid-cols-2 gap-2'>
              <button
                onClick={() => setTextColor('#ffffff')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  textColor === '#ffffff'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('text.white')}
              </button>
              <button
                onClick={() => setTextColor('#1a1a2e')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  textColor === '#1a1a2e'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('text.black')}
              </button>
            </div>

            <div className='mt-3 space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-sm text-gray-600 dark:text-gray-400'>{t('text.fontSize')}</label>
                <span className='text-sm text-gray-500'>{fontSize}px</span>
              </div>
              <input
                type='range'
                min='24'
                max='96'
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500'
              />
            </div>

            <div className='mt-3 flex gap-2'>
              {fontStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFontStyle(style.id)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    fontStyle === style.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  style={{ fontWeight: style.weight, fontStyle: style.style }}
                >
                  {t(style.key)}
                </button>
              ))}
            </div>

            <div className='mt-3 flex gap-2'>
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setTextAlign(align)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    textAlign === align
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(`align.${align}`)}
                </button>
              ))}
            </div>

            <div className='mt-3'>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{t('preset.title')}</p>
              <div className='flex flex-wrap gap-1.5'>
                {presetTexts.map((pt, i) => (
                  <button
                    key={i}
                    onClick={() => setText(pt)}
                    className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    {pt.length > 8 ? pt.slice(0, 8) + '...' : pt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={randomize}
            className='w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2'
          >
            <Shuffle className='h-5 w-5' />
            {t('random')}
          </button>
        </div>

        <div className='space-y-4'>
          <div className='flex justify-center'>
            <div
              ref={previewRef}
              className='w-64 h-[450px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-gray-200 dark:border-gray-700'
              style={{
                background: `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]})`,
              }}
            >
              <div className='absolute inset-0 flex items-center justify-center p-8'>
                <p
                  style={{
                    color: textColor,
                    fontSize: `${fontSize * 0.35}px`,
                    fontWeight: fontStyles.find(f => f.id === fontStyle)?.weight || 'normal',
                    fontStyle: fontStyles.find(f => f.id === fontStyle)?.style || 'normal',
                    textAlign: textAlign,
                    lineHeight: 1.4,
                  }}
                >
                  {text || t('preview')}
                </p>
              </div>
              <div className='absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full' />
            </div>
          </div>

          <button
            onClick={downloadWallpaper}
            className='w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2'
          >
            <Download className='h-5 w-5' />
            {t('download')}
          </button>

          <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
            {t('tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
