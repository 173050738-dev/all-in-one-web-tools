'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Sparkles, Shuffle, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const faceEmojis = ['😀', '😂', '🥰', '😎', '🤔', '😴', '🤯', '🥺', '😈', '👻', '🤖', '👽', '🎃', '🤪', '😇', '😡', '🤗', '😋', '🤓', '😜'];
const animalEmojis = ['🐱', '🐶', '🐰', '🦊', '🐼', '🦁', '🐯', '🐨', '🐸', '🦄', '🐙', '🦋', '🐝', '🦊', '🐢', '🦉', '🐬', '🐳', '🦜', '🐺'];
const elementEmojis = ['❤️', '🔥', '💎', '⭐', '🌟', '💫', '🎉', '🎊', '🌈', '☀️', '🌙', '⚡', '💧', '🍀', '🌸', '🎀', '👑', '🎭', '🎈', '🎁'];
const accessoryEmojis = ['🕶️', '👓', '🎩', '🧢', '💄', '💍', '🧣', '🎀', '🧤', '👒', '🎤', '🎧', '📷', '🎸', '⚽', '🏀', '🎮', '💻', '📱', '🎯'];
const symbolEmojis = ['❤️', '✅', '❌', '⚠️', '💯', '💢', '💤', '🤫', '🤔', '💭', '💬', '📢', '🔔', '🎊', '🎉', '✨', '🌟', '💫', '⭐', '🔥'];

type Combination = {
  left: string;
  right: string;
  name: Record<string, string>;
};

const presetCombinations: Combination[] = [
  { left: '😀', right: '🔥', name: { zh: '火到爆', en: 'On Fire', hi: 'आग में', fr: 'En Feu', es: 'En Llamas', ar: 'باللهب' } },
  { left: '😎', right: '👑', name: { zh: '大佬', en: 'The Boss', hi: 'द बॉस', fr: 'Le Patron', es: 'El Jefe', ar: 'الرئيس' } },
  { left: '🥰', right: '❤️', name: { zh: '爱意满满', en: 'Full of Love', hi: 'प्यार से भरा', fr: 'Plein d\'Amour', es: 'Lleno de Amor', ar: 'مليء بالحب' } },
  { left: '👻', right: '🎃', name: { zh: '万圣节', en: 'Halloween', hi: 'हेलोवीन', fr: 'Halloween', es: 'Halloween', ar: 'هالوين' } },
  { left: '🤖', right: '⚡', name: { zh: '机械觉醒', en: 'Robot Awakening', hi: 'रोबोट जागृति', fr: 'Réveil Robot', es: 'Despertar Robot', ar: 'صحوة الروبوت' } },
  { left: '🐱', right: '👑', name: { zh: '猫主子', en: 'Royal Cat', hi: 'शाही बिल्ली', fr: 'Chat Royal', es: 'Gato Real', ar: 'قطة ملكية' } },
  { left: '🐶', right: '❤️', name: { zh: '修勾爱你', en: 'Puppy Love', hi: 'पपी लव', fr: 'Amour de Chiot', es: 'Amor de Cachorro', ar: 'حب الجرو' } },
  { left: '😴', right: '💤', name: { zh: '困到不行', en: 'So Sleepy', hi: 'बहुत नींद', fr: 'Très Somnolent', es: 'Muy Dormido', ar: 'نعاس شديد' } },
  { left: '🤯', right: '💥', name: { zh: '脑袋爆炸', en: 'Mind Blown', hi: 'हैरान कर देने वाला', fr: 'Explosion Cérébrale', es: 'Mente Explotada', ar: 'انفجار عقلي' } },
  { left: '🥺', right: '💧', name: { zh: '委屈巴巴', en: 'Feeling Wronged', hi: 'निराश महसूस', fr: 'Se Sentir Lésé', es: 'Sintiéndose Agraviado', ar: 'يشعر بالظلم' } },
  { left: '😈', right: '🔥', name: { zh: '小恶魔', en: 'Little Devil', hi: 'छोटा शैतान', fr: 'Petit Diable', es: 'Diablillo', ar: 'شيطان صغير' } },
  { left: '🦄', right: '🌈', name: { zh: '彩虹独角兽', en: 'Rainbow Unicorn', hi: 'इंद्रधनुष घोड़ा', fr: 'Licorne Arc-en-ciel', es: 'Unicornio Arcoíris', ar: 'يونيكورن قوس قزح' } },
  { left: '🐱', right: '🕶️', name: { zh: '酷猫', en: 'Cool Cat', hi: 'कूल बिल्ली', fr: 'Chat Cool', es: 'Gato Genial', ar: 'قطة باردة' } },
  { left: '🐶', right: '🎸', name: { zh: '摇滚狗', en: 'Rock Dog', hi: 'रॉक डॉग', fr: 'Chien Rock', es: 'Perro Rock', ar: 'كلب راك' } },
  { left: '🤖', right: '👑', name: { zh: '机械帝王', en: 'Robot King', hi: 'रोबोट राजा', fr: 'Roi Robot', es: 'Rey Robot', ar: 'ملك الروبوت' } },
  { left: '👻', right: '⚡', name: { zh: '闪电幽灵', en: 'Electric Ghost', hi: 'विद्युत भूत', fr: 'Fantôme Électrique', es: 'Fantasma Eléctrico', ar: 'شبح كهربائي' } },
  { left: '😇', right: '🌟', name: { zh: '天使之光', en: 'Angel Light', hi: 'एंजल लाइट', fr: 'Lumière d\'Ange', es: 'Luz de Ángel', ar: 'ضوء الملاك' } },
  { left: '🎃', right: '🦉', name: { zh: '猫头鹰南瓜', en: 'Owl Pumpkin', hi: 'उल्लू कद्दू', fr: 'Chouette Citrouille', es: 'Búho Calabaza', ar: 'بومة القرع' } },
  { left: '🐼', right: '🎋', name: { zh: '竹林熊猫', en: 'Bamboo Panda', hi: 'बांस पांडा', fr: 'Panda Bambou', es: 'Panda Bambu', ar: 'باندا البامبو' } },
  { left: '🦁', right: '👑', name: { zh: '狮子王', en: 'Lion King', hi: 'सिंह राजा', fr: 'Roi Lion', es: 'Rey León', ar: 'ملك الأسد' } },
  { left: '🐯', right: '🔥', name: { zh: '火虎', en: 'Fire Tiger', hi: 'फायर टाइगर', fr: 'Tigre de Feu', es: 'Tigre de Fuego', ar: 'نمر النار' } },
  { left: '🐨', right: '🌿', name: { zh: '桉树考拉', en: 'Eucalyptus Koala', hi: 'युकलिप्टस कोआला', fr: 'Koala Eucalyptus', es: 'Koala Eucalipto', ar: 'كوالا الأوكاليبتوس' } },
  { left: '🐸', right: '💧', name: { zh: '水滴青蛙', en: 'Water Frog', hi: 'वॉटर फ्रॉग', fr: 'Grenouille d\'Eau', es: 'Rana de Agua', ar: 'ضفدع الماء' } },
  { left: '🦋', right: '🌸', name: { zh: '花蝴蝶', en: 'Flower Butterfly', hi: 'फ्लावर बटरफ्लाई', fr: 'Papillon Fleur', es: 'Mariposa Flor', ar: 'فراشة الزهرة' } },
  { left: '🐝', right: '🍯', name: { zh: '蜜蜂蜂蜜', en: 'Honey Bee', hi: 'हनी बी', fr: 'Abeille Miel', es: 'Abeja Miel', ar: 'نحل العسل' } },
  { left: '🦊', right: '🌙', name: { zh: '月下狐狸', en: 'Moon Fox', hi: 'चंद्रमा लोमड़ी', fr: 'Renard de Lune', es: 'Zorro de Luna', ar: 'ثعلب القمر' } },
  { left: '🐢', right: '🌊', name: { zh: '海龟', en: 'Sea Turtle', hi: 'समुद्री कछुआ', fr: 'Tortue Marine', es: 'Tortuga Marina', ar: 'سلحفاة البحر' } },
  { left: '🦉', right: '📚', name: { zh: '智慧猫头鹰', en: 'Wise Owl', hi: 'ज्ञानी उल्लू', fr: 'Chouette Sage', es: 'Búho Sabio', ar: 'بومة حكيمة' } },
  { left: '🐬', right: '🌊', name: { zh: '海豚海浪', en: 'Dolphin Wave', hi: 'डॉल्फिन वेव', fr: 'Dauphin Onde', es: 'Delfín Ola', ar: 'دلفين الموجة' } },
  { left: '🐳', right: '🌊', name: { zh: '鲸鱼海洋', en: 'Whale Ocean', hi: 'व्हेल ओशन', fr: 'Baleine Océan', es: 'Ballena Océano', ar: 'حوت المحيط' } },
];

interface EmojiMixerProps {
  locale?: string;
}

type CategoryType = 'faces' | 'animals' | 'elements' | 'accessories' | 'symbols';

export default function EmojiMixer({ locale = 'zh' }: EmojiMixerProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      back: '返回',
      title: 'Emoji 表情合成器',
      subtitle: '将两个表情叠加合成，创造独一无二的表情贴纸！',
      mix: '开始合成',
      random: '随机',
      faces: '表情脸',
      animals: '动物',
      elements: '元素',
      accessories: '配饰',
      symbols: '符号',
      tip: '💡 点击选择主体和元素，然后点"开始合成"',
      result: '合成结果',
      copy: '复制',
      copied: '已复制',
      saveImg: '保存图片',
      hotCombos: '🔥 热门组合',
      mystery: '神秘组合',
      size: '尺寸',
      size256: '小 (256px)',
      size512: '中 (512px)',
      size1024: '大 (1024px)',
      downloadPng: '下载 PNG',
      copyPng: '复制到剪贴板',
    },
    en: {
      back: 'Back',
      title: 'Emoji Mixer',
      subtitle: 'Combine two emojis to create unique sticker art!',
      mix: 'Mix It',
      random: 'Random',
      faces: 'Faces',
      animals: 'Animals',
      elements: 'Elements',
      accessories: 'Accessories',
      symbols: 'Symbols',
      tip: '💡 Select main emoji and element, then click "Mix It"',
      result: 'Result',
      copy: 'Copy',
      copied: 'Copied',
      saveImg: 'Save Image',
      hotCombos: '🔥 Hot Combos',
      mystery: 'Mystery Mix',
      size: 'Size',
      size256: 'Small (256px)',
      size512: 'Medium (512px)',
      size1024: 'Large (1024px)',
      downloadPng: 'Download PNG',
      copyPng: 'Copy to Clipboard',
    },
    hi: {
      back: 'वापस',
      title: 'इमोजी मिक्सर',
      subtitle: 'दो इमोजी को मिलाकर अनोखे स्टिकर आर्ट बनाएँ!',
      mix: 'मिलाएँ',
      random: 'रैंडम',
      faces: 'चेहरे',
      animals: 'पशु',
      elements: 'तत्व',
      accessories: 'सामान',
      symbols: 'प्रतीक',
      tip: '💡 मुख्य इमोजी और तत्व चुनें, फिर "मिलाएँ" दबाएँ',
      result: 'परिणाम',
      copy: 'कॉपी करें',
      copied: 'कॉपी हो गया',
      saveImg: 'इमेज सेव करें',
      hotCombos: '🔥 लोकप्रिय कॉम्बो',
      mystery: 'रहस्यमय मिक्स',
      size: 'आकार',
      size256: 'छोटा (256px)',
      size512: 'मध्यम (512px)',
      size1024: 'बड़ा (1024px)',
      downloadPng: 'PNG डाउनलोड करें',
      copyPng: 'क्लिपबोर्ड पर कॉपी करें',
    },
    fr: {
      back: 'Retour',
      title: 'Mixeur d\'Emojis',
      subtitle: 'Combinez deux emojis pour créer un art de sticker unique !',
      mix: 'Mélanger',
      random: 'Aléatoire',
      faces: 'Visages',
      animals: 'Animaux',
      elements: 'Éléments',
      accessories: 'Accessoires',
      symbols: 'Symboles',
      tip: '💡 Sélectionnez l\'emoji principal et l\'élément, puis cliquez sur "Mélanger"',
      result: 'Résultat',
      copy: 'Copier',
      copied: 'Copié',
      saveImg: 'Sauvegarder',
      hotCombos: '🔥 Combos Populaires',
      mystery: 'Mix Mystère',
      size: 'Taille',
      size256: 'Petit (256px)',
      size512: 'Moyen (512px)',
      size1024: 'Grand (1024px)',
      downloadPng: 'Télécharger PNG',
      copyPng: 'Copier dans le Presse-papiers',
    },
    es: {
      back: 'Volver',
      title: 'Mezclador de Emojis',
      subtitle: 'Combina dos emojis para crear arte de sticker único!',
      mix: 'Mezclar',
      random: 'Aleatorio',
      faces: 'Caras',
      animals: 'Animales',
      elements: 'Elementos',
      accessories: 'Accesorios',
      symbols: 'Símbolos',
      tip: '💡 Selecciona el emoji principal y el elemento, luego pulsa "Mezclar"',
      result: 'Resultado',
      copy: 'Copiar',
      copied: 'Copiado',
      saveImg: 'Guardar Imagen',
      hotCombos: '🔥 Combos Populares',
      mystery: 'Mezcla Misteriosa',
      size: 'Tamaño',
      size256: 'Pequeño (256px)',
      size512: 'Medio (512px)',
      size1024: 'Grande (1024px)',
      downloadPng: 'Descargar PNG',
      copyPng: 'Copiar al Portapapeles',
    },
    ar: {
      back: 'رجوع',
      title: 'خلاط الإيموجي',
      subtitle: 'اجمع إيموجيين لخلق فن ملصق فريد!',
      mix: 'اخلط',
      random: 'عشوائي',
      faces: 'الوجوه',
      animals: 'الحيوانات',
      elements: 'العناصر',
      accessories: 'الإكسسوارات',
      symbols: 'الرموز',
      tip: '💡 اختر الإيموجي الرئيسي والعنصر، ثم اضغط "اخلط"',
      result: 'النتيجة',
      copy: 'نسخ',
      copied: 'تم النسخ',
      saveImg: 'حفظ الصورة',
      hotCombos: '🔥 التركيبات الشائعة',
      mystery: 'خلقة سرية',
      size: 'الحجم',
      size256: 'صغير (256px)',
      size512: 'متوسط (512px)',
      size1024: 'كبير (1024px)',
      downloadPng: 'تنزيل PNG',
      copyPng: 'نسخ إلى الحافظة',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.en;
    return (key: string) => dict[key] ?? translations.en[key] ?? key;
  };

  const t = getT(locale);
  const getName = (n: Record<string, string>) => n[locale] ?? n.en ?? n.zh;

  const [leftEmoji, setLeftEmoji] = useState('😀');
  const [rightEmoji, setRightEmoji] = useState('🔥');
  const [resultName, setResultName] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryType>('faces');
  const [outputSize, setOutputSize] = useState(512);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoryEmojis: Record<CategoryType, string[]> = {
    faces: faceEmojis,
    animals: animalEmojis,
    elements: elementEmojis,
    accessories: accessoryEmojis,
    symbols: symbolEmojis,
  };

  const categoryIcons: Record<CategoryType, string> = {
    faces: '😀',
    animals: '🐱',
    elements: '⭐',
    accessories: '👑',
    symbols: '❤️',
  };

  const mixEmojis = useCallback(() => {
    setIsAnimating(true);

    const preset = presetCombinations.find(
      c => (c.left === leftEmoji && c.right === rightEmoji) ||
           (c.left === rightEmoji && c.right === leftEmoji)
    );

    setTimeout(() => {
      if (preset) {
        setResultName(getName(preset.name));
      } else {
        setResultName(t('mystery'));
      }
      setIsAnimating(false);
    }, 800);
  }, [leftEmoji, rightEmoji, locale]);

  const randomMix = useCallback(() => {
    const categories = ['faces', 'animals'] as CategoryType[];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const randomFace = categoryEmojis[randomCat][Math.floor(Math.random() * categoryEmojis[randomCat].length)];
    
    const elementCats = ['elements', 'accessories'] as CategoryType[];
    const randomElementCat = elementCats[Math.floor(Math.random() * elementCats.length)];
    const randomElement = categoryEmojis[randomElementCat][Math.floor(Math.random() * categoryEmojis[randomElementCat].length)];
    
    setLeftEmoji(randomFace);
    setRightEmoji(randomElement);
    
    setTimeout(() => {
      mixEmojis();
    }, 100);
  }, [mixEmojis]);

  const drawResult = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const size = outputSize;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, '#fef3c7');
    gradient.addColorStop(1, '#fde68a');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2);
    ctx.fill();

    const mainSize = size * 0.6;
    const accessorySize = size * 0.25;
    
    ctx.font = `bold ${mainSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(leftEmoji, size/2, size/2);

    ctx.font = `bold ${accessorySize}px Arial`;
    ctx.globalAlpha = 0.9;
    ctx.fillText(rightEmoji, size * 0.7, size * 0.75);
    ctx.globalAlpha = 1;
  }, [leftEmoji, rightEmoji, outputSize]);

  useEffect(() => {
    drawResult();
  }, [drawResult]);

  const copyPng = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  }, []);

  const downloadPng = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `emoji-mix-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const scrollEmojis = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
          <div className='p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white'>
            <Sparkles className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      <div className='space-y-6'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-center gap-4 mb-6'>
            <div
              onClick={() => setActiveTab('faces')}
              className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform border-2 border-dashed border-gray-200 dark:border-gray-600'
            >
              {leftEmoji}
            </div>
            <div className='text-3xl text-gray-300'>+</div>
            <div
              onClick={() => setActiveTab('elements')}
              className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform border-2 border-dashed border-gray-200 dark:border-gray-600'
            >
              {rightEmoji}
            </div>
            <div className='text-3xl text-gray-300'>=</div>
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-yellow-300 dark:border-yellow-700 ${
                isAnimating ? 'animate-bounce' : ''
              }`}
            >
              {isAnimating ? (
                <span className='text-4xl sm:text-5xl'>❓</span>
              ) : (
                <canvas 
                  ref={canvasRef} 
                  className='w-full h-full object-cover'
                  width={100}
                  height={100}
                />
              )}
            </div>
          </div>

          {resultName && !isAnimating && (
            <div className='text-center mb-4'>
              <span className='inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-medium rounded-full'>
                ✨ {resultName} ✨
              </span>
            </div>
          )}

          <div className='flex gap-3 justify-center'>
            <button
              onClick={mixEmojis}
              disabled={isAnimating}
              className='px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center gap-2'
            >
              <Sparkles className='h-4 w-4' />
              {t('mix')}
            </button>
            <button
              onClick={randomMix}
              className='px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2'
            >
              <Shuffle className='h-4 w-4' />
              {t('random')}
            </button>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 overflow-x-auto'>
            {(Object.keys(categoryEmojis) as CategoryType[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === cat
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {categoryIcons[cat]} {t(cat)}
              </button>
            ))}
          </div>

          <div className='relative'>
            <button
              onClick={() => scrollEmojis('left')}
              className='absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            
            <div 
              ref={scrollRef}
              className='flex gap-2 overflow-x-auto px-10 py-2 scrollbar-hide'
            >
              {categoryEmojis[activeTab].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (activeTab === 'faces' || activeTab === 'animals') {
                      setLeftEmoji(emoji);
                    } else {
                      setRightEmoji(emoji);
                    }
                  }}
                  className={`min-w-[44px] h-[44px] flex items-center justify-center text-xl sm:text-2xl rounded-xl transition-all hover:scale-110 ${
                    (['faces', 'animals'].includes(activeTab) && leftEmoji === emoji) ||
                    (!['faces', 'animals'].includes(activeTab) && rightEmoji === emoji)
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 scale-110'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => scrollEmojis('right')}
              className='absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>

          <p className='text-xs text-gray-500 dark:text-gray-400 text-center mt-3'>
            {t('tip')}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('size')}</h3>
          <div className='flex gap-2'>
            {[
              { value: 256, label: 'size256' },
              { value: 512, label: 'size512' },
              { value: 1024, label: 'size1024' },
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => setOutputSize(size.value)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  outputSize === size.value
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {t(size.label)}
              </button>
            ))}
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>🎉 {t('result')}</h3>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-yellow-300 dark:border-yellow-700'>
              <canvas 
                ref={canvasRef} 
                className='w-full h-full object-cover'
                width={200}
                height={200}
              />
            </div>
            <div className='flex gap-2'>
              <button
                onClick={copyPng}
                className='px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5 shadow-sm'
              >
                {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                {copied ? t('copied') : t('copyPng')}
              </button>
              <button
                onClick={downloadPng}
                className='px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors flex items-center gap-1.5 shadow-sm'
              >
                <Download className='h-4 w-4' />
                {t('downloadPng')}
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('hotCombos')}</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            {presetCombinations.map((combo, index) => (
              <button
                key={index}
                onClick={() => {
                  setLeftEmoji(combo.left);
                  setRightEmoji(combo.right);
                  setResultName(getName(combo.name));
                }}
                className='p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-center'
              >
                <div className='text-xl mb-1'>{combo.left}{combo.right}</div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{getName(combo.name)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
