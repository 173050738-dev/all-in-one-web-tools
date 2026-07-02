'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Type,
  Palette,
  Zap,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface DanmakuHandheldProps {
  locale?: string;
}

const presetTexts: Record<string, string>[] = [
  {
    zh: '我爱你',
    en: 'I LOVE YOU',
    hi: 'मैं तुमसे प्यार करता हूँ',
    fr: 'JE T\'AIME',
    es: 'TE AMO',
    ar: 'أحبك',
  },
  {
    zh: '生日快乐',
    en: 'HAPPY BIRTHDAY',
    hi: 'जन्मदिन मुबारक',
    fr: 'JOYEUX ANNIVERSAIRE',
    es: 'FELIZ CUMPLEAÑOS',
    ar: 'عيد ميلاد سعيد',
  },
  {
    zh: '加油',
    en: 'GO GO GO',
    hi: 'आगे बढ़ो',
    fr: 'ALLEZ ALLEZ',
    es: '¡ÁNIMO!',
    ar: 'هيا بنا',
  },
  {
    zh: '永远支持你',
    en: 'FOREVER SUPPORT',
    hi: 'हमेशा आपके साथ',
    fr: 'SOUTIEN À JAMAIS',
    es: 'SIEMPRE APOYO',
    ar: 'دعم للأبد',
  },
  {
    zh: '最棒的',
    en: 'THE BEST',
    hi: 'सबसे अच्छा',
    fr: 'LE MEILLEUR',
    es: 'EL MEJOR',
    ar: 'الأفضل',
  },
];

const presetColors: { name: Record<string, string>; value: string; bg: string }[] = [
  { name: { zh: '红色', en: 'Red', hi: 'लाल', fr: 'Rouge', es: 'Rojo', ar: 'أحمر' }, value: '#FF0000', bg: '#000000' },
  { name: { zh: '绿色', en: 'Green', hi: 'हरा', fr: 'Vert', es: 'Verde', ar: 'أخضر' }, value: '#00FF00', bg: '#000000' },
  { name: { zh: '蓝色', en: 'Blue', hi: 'नीला', fr: 'Bleu', es: 'Azul', ar: 'أزرق' }, value: '#00BFFF', bg: '#000000' },
  { name: { zh: '黄色', en: 'Yellow', hi: 'पीला', fr: 'Jaune', es: 'Amarillo', ar: 'أصفر' }, value: '#FFD700', bg: '#000000' },
  { name: { zh: '粉色', en: 'Pink', hi: 'गुलाबी', fr: 'Rose', es: 'Rosa', ar: 'وردي' }, value: '#FF69B4', bg: '#000000' },
  { name: { zh: '彩虹', en: 'Rainbow', hi: 'इंद्रधनुष', fr: 'Arc-en-ciel', es: 'Arcoíris', ar: 'قوس قزح' }, value: 'rainbow', bg: '#000000' },
  { name: { zh: '白字黑底', en: 'White/Black', hi: 'सफ़ेद/काला', fr: 'Blanc/Noir', es: 'Blanco/Negro', ar: 'أبيض/أسود' }, value: '#FFFFFF', bg: '#000000' },
  { name: { zh: '黑字白底', en: 'Black/White', hi: 'काला/सफ़ेद', fr: 'Noir/Blanc', es: 'Negro/Blanco', ar: 'أسود/أبيض' }, value: '#000000', bg: '#FFFFFF' },
];

export default function DanmakuHandheld({ locale = 'zh' }: DanmakuHandheldProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      title: '弹幕手持',
      subtitle: '手机秒变手持弹幕，演唱会/接机/应援必备神器',
      inputText: '弹幕文字',
      placeholder: '输入要显示的文字...',
      speed: '滚动速度',
      fontSize: '字体大小',
      color: '颜色样式',
      presets: '快捷文字',
      play: '开始滚动',
      pause: '暂停',
      reset: '重置',
      fullscreen: '全屏',
      tip: '💡 提示：横屏手机效果更佳！点击全屏按钮进入横屏模式，举高手机就能当应援牌用啦。',
      features: '功能特点',
      f1: '超大字号，远距离也清晰',
      f2: '多种颜色和彩虹效果',
      f3: '可调节滚动速度',
      f4: '支持全屏显示',
      f5: '内置常用快捷文字',
      f6: '完全免费，无广告',
      slow: '慢',
      fast: '快',
      small: '小',
      big: '大',
      previewHint: '点击"开始滚动"预览效果',
    },
    en: {
      title: 'LED Banner',
      subtitle: 'Turn your phone into an LED banner. Perfect for concerts and events.',
      inputText: 'Text',
      placeholder: 'Enter text to display...',
      speed: 'Speed',
      fontSize: 'Font Size',
      color: 'Color Style',
      presets: 'Quick Text',
      play: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      fullscreen: 'Fullscreen',
      tip: '💡 Tip: Use landscape mode for best effect! Click fullscreen and hold your phone sideways.',
      features: 'Features',
      f1: 'Huge font, visible from far away',
      f2: 'Multiple colors & rainbow effect',
      f3: 'Adjustable scroll speed',
      f4: 'Fullscreen display',
      f5: 'Built-in quick text presets',
      f6: '100% free, no ads',
      slow: 'Slow',
      fast: 'Fast',
      small: 'Small',
      big: 'Big',
      previewHint: 'Click "Start" to preview',
    },
    hi: {
      title: 'एलईडी बैनर',
      subtitle: 'अपने फोन को एलईडी बैनर में बदलें। कॉन्सर्ट और इवेंट्स के लिए बिल्कुल सही।',
      inputText: 'टेक्स्ट',
      placeholder: 'दिखाने के लिए टेक्स्ट दर्ज करें...',
      speed: 'गति',
      fontSize: 'फ़ॉन्ट साइज़',
      color: 'कलर स्टाइल',
      presets: 'क्विक टेक्स्ट',
      play: 'शुरू',
      pause: 'रोकें',
      reset: 'रीसेट',
      fullscreen: 'फ़ुलस्क्रीन',
      tip: '💡 सुझाव: सबसे अच्छे प्रभाव के लिए लैंडस्केप मोड का उपयोग करें!',
      features: 'विशेषताएँ',
      f1: 'बहुत बड़ा फ़ॉन्ट, दूर से भी दिखाई देता है',
      f2: 'कई रंग और इंद्रधनुष प्रभाव',
      f3: 'समायोज्य स्क्रॉल गति',
      f4: 'फ़ुलस्क्रीन डिस्प्ले',
      f5: 'अंतर्निहित क्विक टेक्स्ट',
      f6: '100% मुफ्त, कोई विज्ञापन नहीं',
      slow: 'धीमा',
      fast: 'तेज़',
      small: 'छोटा',
      big: 'बड़ा',
      previewHint: 'पूर्वावलोकन के लिए "शुरू" दबाएँ',
    },
    fr: {
      title: 'Bannière LED',
      subtitle: 'Transformez votre téléphone en bannière LED. Parfait pour concerts et événements.',
      inputText: 'Texte',
      placeholder: 'Entrez le texte à afficher...',
      speed: 'Vitesse',
      fontSize: 'Taille de Police',
      color: 'Style de Couleur',
      presets: 'Texte Rapide',
      play: 'Démarrer',
      pause: 'Pause',
      reset: 'Réinitialiser',
      fullscreen: 'Plein Écran',
      tip: '💡 Astuce : Utilisez le mode paysage pour un meilleur effet !',
      features: 'Fonctionnalités',
      f1: 'Police énorme, visible de loin',
      f2: 'Plusieurs couleurs et effet arc-en-ciel',
      f3: 'Vitesse de défilement réglable',
      f4: 'Affichage plein écran',
      f5: 'Textes rapides intégrés',
      f6: '100% gratuit, sans publicité',
      slow: 'Lent',
      fast: 'Rapide',
      small: 'Petit',
      big: 'Grand',
      previewHint: 'Cliquez sur "Démarrer" pour prévisualiser',
    },
    es: {
      title: 'Banner LED',
      subtitle: 'Convierte tu teléfono en un banner LED. Perfecto para conciertos y eventos.',
      inputText: 'Texto',
      placeholder: 'Introduce el texto a mostrar...',
      speed: 'Velocidad',
      fontSize: 'Tamaño de Fuente',
      color: 'Estilo de Color',
      presets: 'Texto Rápido',
      play: 'Iniciar',
      pause: 'Pausa',
      reset: 'Reiniciar',
      fullscreen: 'Pantalla Completa',
      tip: '💡 Consejo: ¡Usa el modo apaisado para mejor efecto!',
      features: 'Características',
      f1: 'Fuente enorme, visible desde lejos',
      f2: 'Múltiples colores y efecto arcoíris',
      f3: 'Velocidad de desplazamiento ajustable',
      f4: 'Visualización a pantalla completa',
      f5: 'Textos rápidos integrados',
      f6: '100% gratuito, sin anuncios',
      slow: 'Lento',
      fast: 'Rápido',
      small: 'Pequeño',
      big: 'Grande',
      previewHint: 'Pulsa "Iniciar" para ver la vista previa',
    },
    ar: {
      title: 'لافتة LED',
      subtitle: 'حوّل هاتفك إلى لافتة LED. مثالي للحفلات الموسيقية والمناسبات.',
      inputText: 'النص',
      placeholder: 'أدخل النص المراد عرضه...',
      speed: 'السرعة',
      fontSize: 'حجم الخط',
      color: 'نمط اللون',
      presets: 'نصوص سريعة',
      play: 'ابدأ',
      pause: 'إيقاف مؤقت',
      reset: 'إعادة ضبط',
      fullscreen: 'ملء الشاشة',
      tip: '💡 نصيحة: استخدم الوضع الأفقي لأفضل نتيجة!',
      features: 'الميزات',
      f1: 'خط ضخم، يظهر من بعيد',
      f2: 'ألوان متعددة وتأثير قوس قزح',
      f3: 'سرعة تمرير قابلة للتعديل',
      f4: 'عرض ملء الشاشة',
      f5: 'نصوص سريعة مدمجة',
      f6: 'مجاني 100%، بدون إعلانات',
      slow: 'بطيء',
      fast: 'سريع',
      small: 'صغير',
      big: 'كبير',
      previewHint: 'اضغط "ابدأ" للمعاينة',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string) => dict[key] ?? translations.zh[key] ?? key;
  };

  const t = getT(locale);
  const getPresetText = (p: Record<string, string>) => p[locale] ?? p.en ?? p.zh;
  const getDefaultText = () => {
    const def = presetTexts[0];
    return def[locale] ?? def.en ?? def.zh;
  };
  const getColorName = (n: Record<string, string>) => n[locale] ?? n.en ?? n.zh;

  const [text, setText] = useState(getDefaultText());
  const [speed, setSpeed] = useState(5);
  const [fontSize, setFontSize] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);

  const currentColor = presetColors[colorIndex];
  const isRainbow = currentColor.value === 'rainbow';

  useEffect(() => {
    if (!isPlaying || !containerRef.current || !textRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const container = containerRef.current;
    const textEl = textRef.current;
    const containerWidth = container.offsetWidth;
    const textWidth = textEl.offsetWidth;

    positionRef.current = containerWidth;

    const animate = () => {
      positionRef.current -= speed * 0.5;
      if (positionRef.current < -textWidth) {
        positionRef.current = containerWidth;
      }
      if (textEl) {
        textEl.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed, text]);

  const togglePlay = () => {
    if (!text.trim()) return;
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    positionRef.current = 0;
    if (textRef.current) {
      textRef.current.style.transform = 'translateX(0)';
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const rainbowStyle = isRainbow
    ? {
        background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'rainbow 2s linear infinite',
      }
    : { color: currentColor.value };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <style>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'>
                <Smartphone className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div
                ref={containerRef}
                className='relative w-full h-32 sm:h-40 rounded-xl overflow-hidden flex items-center'
                style={{ backgroundColor: currentColor.bg }}
              >
                <div
                  ref={textRef}
                  className='whitespace-nowrap font-bold whitespace-nowrap'
                  style={{
                    fontSize: `${fontSize}px`,
                    ...rainbowStyle,
                    textShadow: isRainbow ? 'none' : `0 0 10px ${currentColor.value}40`,
                    paddingLeft: '100%',
                  }}
                >
                  {text || ' '}
                </div>
                {!isPlaying && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-gray-500 text-sm'>
                      {t('previewHint')}
                    </span>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t('inputText')}
                    </label>
                    <input
                      type='text'
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        reset();
                      }}
                      placeholder={t('placeholder')}
                      className='w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500'
                    />
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('speed')}</label>
                      <span className='text-xs text-gray-500'>{t('slow')} <ChevronRight className='w-3 h-3 inline' /> {t('fast')}</span>
                    </div>
                    <input
                      type='range'
                      min='1'
                      max='20'
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500'
                    />
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('fontSize')}</label>
                      <span className='text-xs text-gray-500'>{t('small')} <ChevronRight className='w-3 h-3 inline' /> {t('big')}</span>
                    </div>
                    <input
                      type='range'
                      min='30'
                      max='150'
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500'
                    />
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t('color')}
                    </label>
                    <div className='grid grid-cols-4 gap-2'>
                      {presetColors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => { setColorIndex(i); reset(); }}
                          className={`aspect-square rounded-lg border-2 transition-all ${
                            colorIndex === i
                              ? 'border-pink-500 scale-110 shadow-lg'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                          }`}
                          style={{
                            background: c.value === 'rainbow'
                              ? 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)'
                              : c.value,
                            backgroundColor: c.bg,
                          }}
                          title={getColorName(c.name)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t('presets')}
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {presetTexts.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => { setText(getPresetText(p)); reset(); }}
                          className='px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors'
                        >
                          {getPresetText(p)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <button
                  onClick={togglePlay}
                  disabled={!text.trim()}
                  className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                >
                  {isPlaying ? <Pause className='h-4 w-4 sm:h-5 sm:w-5' /> : <Play className='h-4 w-4 sm:h-5 sm:w-5' />}
                  {isPlaying ? t('pause') : t('play')}
                </button>
                <button
                  onClick={reset}
                  className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium'
                >
                  <RotateCcw className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t('reset')}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium'
                >
                  <Maximize2 className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t('fullscreen')}
                </button>
              </div>

              <div className='p-3 sm:p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-pink-700 dark:text-pink-300'>
                  {t('tip')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-3'>
              {['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map((key, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0' />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
