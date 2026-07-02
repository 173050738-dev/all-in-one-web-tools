'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { RotateCcw, Shuffle, Dices, Sparkles, Plus, X, Check } from 'lucide-react';

interface FortuneSticksProps {
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.back': '返回',
      'action.add': '添加',
      'action.draw': '求一支签',
      'action.shaking': '摇签中...',
      'action.answer': '告诉我答案',
      'action.thinking': '思考中...',
      'action.start': '开始抽取',
      'action.drawing': '抽取中...',
      'action.retry': '再来一次',
      'title': '随机抽签筒',
      'subtitle': '求签、抽决定、纠结症救星',
      'mode.fortune': '🎋 求签',
      'mode.yesno': '✅ 是/否',
      'mode.custom': '🎯 自定义',
      'optionList': '🎯 选项列表',
      'placeholder': '添加选项...',
      'minOptions': '至少需要2个选项哦~',
      'cylinderSign': '签',
      'thinkQuestion': '默念你的问题，然后点击按钮',
      'stick.prefix': '第',
      'stick.suffix': '签',
      'level.1': '上上签',
      'level.2': '上签',
      'level.3': '上签',
      'level.4': '中上签',
      'level.5': '中签',
      'level.6': '中签',
      'level.7': '中下签',
      'level.8': '下签',
      'text.1': '万事如意，心想事成',
      'text.2': '一帆风顺，前程似锦',
      'text.3': '贵人相助，左右逢源',
      'text.4': '稳步上升，厚积薄发',
      'text.5': '平平安安，顺其自然',
      'text.6': '有得有失，知足常乐',
      'text.7': '谨慎行事，三思后行',
      'text.8': '时运不济，静待时机',
      'detail.1': '此签大吉，诸事顺遂，贵人相助，前程似锦。',
      'detail.2': '事业有成，财运亨通，家庭和睦，身体康健。',
      'detail.3': '外出遇贵，事业上升，财运渐旺，喜事临门。',
      'detail.4': '脚踏实地，努力前行，终有所成，不可急躁。',
      'detail.5': '守旧为宜，不宜冒进，静待时机，可保平安。',
      'detail.6': '得失相伴，不必强求，心态平和，自有福报。',
      'detail.7': '近期多舛，需防小人，凡事谨慎，可保无虞。',
      'detail.8': '诸事不顺，宜静不宜动，修身养性，等待转机。',
      'yesno.1': '一定行！',
      'yesno.2': '没问题~',
      'yesno.3': '必须的！',
      'yesno.4': '可以试试',
      'yesno.5': '再想想吧',
      'yesno.6': '随缘就好',
      'yesno.7': '不太建议',
      'yesno.8': '算了算了',
      'default.0': '吃火锅',
      'default.1': '吃烧烤',
      'default.2': '吃日料',
      'default.3': '吃沙拉',
    },
    en: {
      'action.back': 'Back',
      'action.add': 'Add',
      'action.draw': 'Draw a Stick',
      'action.shaking': 'Shaking...',
      'action.answer': 'Tell Me',
      'action.thinking': 'Thinking...',
      'action.start': 'Start Drawing',
      'action.drawing': 'Drawing...',
      'action.retry': 'Try Again',
      'title': 'Random Fortune Sticks',
      'subtitle': 'Fortune sticks, decision maker, cure for indecisiveness',
      'mode.fortune': '🎋 Fortune',
      'mode.yesno': '✅ Yes/No',
      'mode.custom': '🎯 Custom',
      'optionList': '🎯 Options',
      'placeholder': 'Add option...',
      'minOptions': 'Need at least 2 options~',
      'cylinderSign': '签',
      'thinkQuestion': 'Think of your question, then click',
      'stick.prefix': 'No. ',
      'stick.suffix': '',
      'level.1': 'Great Fortune',
      'level.2': 'Good Fortune',
      'level.3': 'Good Fortune',
      'level.4': 'Above Average',
      'level.5': 'Average',
      'level.6': 'Average',
      'level.7': 'Below Average',
      'level.8': 'Misfortune',
      'text.1': 'All wishes come true',
      'text.2': 'Smooth sailing ahead',
      'text.3': 'Noble people help you',
      'text.4': 'Steady progress',
      'text.5': 'Peace and safety',
      'text.6': 'Count your blessings',
      'text.7': 'Think twice before acting',
      'text.8': 'Wait for better timing',
      'detail.1': 'Great luck. Everything goes well. Help from noble people awaits.',
      'detail.2': 'Career success. Good fortune. Family harmony. Health.',
      'detail.3': 'Meeting noble people. Career advancement. Increasing wealth.',
      'detail.4': 'Stay grounded. Work hard. Success will come. No rush.',
      'detail.5': 'Better to maintain status quo. Wait for the right moment.',
      'detail.6': 'Gains and losses go hand in hand. Be content.',
      'detail.7': 'Be cautious recently. Beware of villains.',
      'detail.8': 'Things are rough. Stay calm, improve yourself, wait for turn.',
      'yesno.1': 'Definitely!',
      'yesno.2': 'No problem~',
      'yesno.3': 'Absolutely!',
      'yesno.4': 'Give it a try',
      'yesno.5': 'Think again',
      'yesno.6': 'Let it be',
      'yesno.7': 'Not recommended',
      'yesno.8': 'Forget it',
      'default.0': 'Hotpot',
      'default.1': 'BBQ',
      'default.2': 'Sushi',
      'default.3': 'Salad',
    },
    hi: {
      'action.back': 'वापस',
      'action.add': 'जोड़ें',
      'action.draw': 'स्टिक निकालें',
      'action.shaking': 'हिला रहा है...',
      'action.answer': 'मुझे बताओ',
      'action.thinking': 'सोच रहा है...',
      'action.start': 'ड्रॉ शुरू करें',
      'action.drawing': 'निकाल रहा है...',
      'action.retry': 'फिर से प्रयास करें',
      'title': 'यादृच्छिक भाग्य स्टिक्स',
      'subtitle': 'भाग्य स्टिक्स, निर्णय लेने वाला',
      'mode.fortune': '🎋 भाग्य',
      'mode.yesno': '✅ हाँ/नहीं',
      'mode.custom': '🎯 कस्टम',
      'optionList': '🎯 विकल्प',
      'placeholder': 'विकल्प जोड़ें...',
      'minOptions': 'कम से कम 2 विकल्प चाहिए~',
      'cylinderSign': '签',
      'thinkQuestion': 'अपना सवाल सोचें, फिर क्लिक करें',
      'stick.prefix': '#',
      'stick.suffix': '',
      'level.1': 'श्रेष्ठ भाग्य',
      'level.2': 'अच्छा भाग्य',
      'level.3': 'अच्छा भाग्य',
      'level.4': 'औसत से ऊपर',
      'level.5': 'औसत',
      'level.6': 'औसत',
      'level.7': 'औसत से नीचे',
      'level.8': 'दुर्भाग्य',
      'text.1': 'सभी इच्छाएं पूरी हों',
      'text.2': 'आगे की यात्रा सहज हो',
      'text.3': 'मदद मिलेगी',
      'text.4': 'स्थिर प्रगति',
      'text.5': 'शांति और सुरक्षा',
      'text.6': 'अपने आशीर्वाद गिनें',
      'text.7': 'कार्य करने से पहले सोचें',
      'text.8': 'बेहतर समय की प्रतीक्षा करें',
      'detail.1': 'बड़ी किस्मत। सब कुछ अच्छा होगा।',
      'detail.2': 'करियर सफलता। अच्छा भाग्य। परिवार सौहार्द।',
      'detail.3': 'उच्च व्यक्तियों से मदद। करियर में प्रगति।',
      'detail.4': 'मेहनत करें। सफलता आएगी। जल्दी मत करें।',
      'detail.5': 'स्थिति बनाए रखें। सही समय की प्रतीक्षा करें।',
      'detail.6': 'लाभ और हाथ साथ जाते हैं। संतुष्ट रहें।',
      'detail.7': 'हाल ही में सावधान रहें।',
      'detail.8': 'चीजें मुश्किल हैं। शांत रहें, बेहतर समय की प्रतीक्षा करें।',
      'yesno.1': 'बिल्कुल!',
      'yesno.2': 'कोई दिक्कत नहीं~',
      'yesno.3': 'ज़रूर!',
      'yesno.4': 'प्रयास करें',
      'yesno.5': 'फिर सोचें',
      'yesno.6': 'जैसा हो वैसा रहने दें',
      'yesno.7': 'अनुशंसित नहीं',
      'yesno.8': 'छोड़ दें',
      'default.0': 'हॉटपॉट',
      'default.1': 'बीबीक्यू',
      'default.2': 'सुशी',
      'default.3': 'सलाद',
    },
    fr: {
      'action.back': 'Retour',
      'action.add': 'Ajouter',
      'action.draw': 'Tirer un Bâton',
      'action.shaking': 'En mouvement...',
      'action.answer': 'Dis-moi',
      'action.thinking': 'Réfléchit...',
      'action.start': 'Commencer',
      'action.drawing': 'Tirage...',
      'action.retry': 'Réessayer',
      'title': 'Tirage au Sort',
      'subtitle': 'Bâtons de fortune, aide à la décision',
      'mode.fortune': '🎋 Fortune',
      'mode.yesno': '✅ Oui/Non',
      'mode.custom': '🎯 Personnalisé',
      'optionList': '🎯 Options',
      'placeholder': 'Ajouter une option...',
      'minOptions': 'Besoin d\'au moins 2 options~',
      'cylinderSign': '签',
      'thinkQuestion': 'Pensez à votre question, puis cliquez',
      'stick.prefix': 'N°',
      'stick.suffix': '',
      'level.1': 'Très Bonne Fortune',
      'level.2': 'Bonne Fortune',
      'level.3': 'Bonne Fortune',
      'level.4': 'Au-dessus de la Moyenne',
      'level.5': 'Moyenne',
      'level.6': 'Moyenne',
      'level.7': 'Sous la Moyenne',
      'level.8': 'Malchance',
      'text.1': 'Tous les vœux se réalisent',
      'text.2': 'Voyage sans encombre',
      'text.3': 'Aide des nobles',
      'text.4': 'Progrès constant',
      'text.5': 'Paix et sécurité',
      'text.6': 'Comptez vos bénédictions',
      'text.7': 'Réfléchissez avant d\'agir',
      'text.8': 'Attendez le bon moment',
      'detail.1': 'Grande chance. Tout se passe bien.',
      'detail.2': 'Succès carrière. Bonne fortune. Harmonie familiale.',
      'detail.3': 'Rencontres positives. Avancement carrière.',
      'detail.4': 'Restez ancré. Travaillez dur. Le succès viendra.',
      'detail.5': 'Gardez le statu quo. Attendez le bon moment.',
      'detail.6': 'Gains et pertes vont ensemble. Soyez content.',
      'detail.7': 'Soyez prudent récemment.',
      'detail.8': 'Choses difficiles. Restez calme, attendez le tournant.',
      'yesno.1': 'Absolument!',
      'yesno.2': 'Pas de problème~',
      'yesno.3': 'Certainement!',
      'yesno.4': 'Essayez',
      'yesno.5': 'Réfléchissez encore',
      'yesno.6': 'Laissez aller',
      'yesno.7': 'Non recommandé',
      'yesno.8': 'Oubliez ça',
      'default.0': 'Fondue',
      'default.1': 'BBQ',
      'default.2': 'Sushi',
      'default.3': 'Salade',
    },
    es: {
      'action.back': 'Volver',
      'action.add': 'Añadir',
      'action.draw': 'Sacar un Palo',
      'action.shaking': 'Agitando...',
      'action.answer': 'Dime',
      'action.thinking': 'Pensando...',
      'action.start': 'Empezar',
      'action.drawing': 'Sacando...',
      'action.retry': 'Intentar de Nuevo',
      'title': 'Palos de la Fortuna',
      'subtitle': 'Palos de fortuna, toma de decisiones',
      'mode.fortune': '🎋 Fortuna',
      'mode.yesno': '✅ Sí/No',
      'mode.custom': '🎯 Personalizado',
      'optionList': '🎯 Opciones',
      'placeholder': 'Añadir opción...',
      'minOptions': 'Necesitas al menos 2 opciones~',
      'cylinderSign': '签',
      'thinkQuestion': 'Piensa en tu pregunta, luego haz clic',
      'stick.prefix': 'N°',
      'stick.suffix': '',
      'level.1': 'Gran Fortuna',
      'level.2': 'Buena Fortuna',
      'level.3': 'Buena Fortuna',
      'level.4': 'Por Encima del Promedio',
      'level.5': 'Promedio',
      'level.6': 'Promedio',
      'level.7': 'Debajo del Promedio',
      'level.8': 'Mala Suerte',
      'text.1': 'Todos los deseos se cumplen',
      'text.2': 'Viaje tranquilo',
      'text.3': 'Ayuda de nobles',
      'text.4': 'Progreso constante',
      'text.5': 'Paz y seguridad',
      'text.6': 'Cuenta tus bendiciones',
      'text.7': 'Piensa antes de actuar',
      'text.8': 'Espera el momento adecuado',
      'detail.1': 'Mucha suerte. Todo va bien.',
      'detail.2': 'Éxito laboral. Buena fortuna. Armonía familiar.',
      'detail.3': 'Conocidos útiles. Avance profesional.',
      'detail.4': 'Trabaja duro. El éxito llegará. No te apresures.',
      'detail.5': 'Mantén el statu quo. Espera el momento.',
      'detail.6': 'Ganancias y pérdidas van juntas. Sé contento.',
      'detail.7': 'Ten cuidado recientemente.',
      'detail.8': 'Cosas difíciles. Mantén la calma, espera el cambio.',
      'yesno.1': '¡Definitivamente!',
      'yesno.2': '~Sin problema~',
      'yesno.3': '¡Claro que sí!',
      'yesno.4': 'Inténtalo',
      'yesno.5': 'Piénsalo de nuevo',
      'yesno.6': 'Déjalo estar',
      'yesno.7': 'No recomendado',
      'yesno.8': 'Olvídalo',
      'default.0': 'Hotpot',
      'default.1': 'BBQ',
      'default.2': 'Sushi',
      'default.3': 'Ensalada',
    },
    ar: {
      'action.back': 'رجوع',
      'action.add': 'إضافة',
      'action.draw': 'سحب عود',
      'action.shaking': 'يهتز...',
      'action.answer': 'أخبرني',
      'action.thinking': 'يفكر...',
      'action.start': 'ابدأ السحب',
      'action.drawing': 'يسحب...',
      'action.retry': 'حاول مرة أخرى',
      'title': 'أعمدة الحظ العشوائية',
      'subtitle': 'أعمدة الحظ، مساعد في اتخاذ القرارات',
      'mode.fortune': '🎋 حظ',
      'mode.yesno': '✅ نعم/لا',
      'mode.custom': '🎯 مخصص',
      'optionList': '🎯 الخيارات',
      'placeholder': 'إضافة خيار...',
      'minOptions': 'تحتاج إلى خيارين على الأقل~',
      'cylinderSign': '签',
      'thinkQuestion': 'فكر في سؤالك، ثم انقر',
      'stick.prefix': '#',
      'stick.suffix': '',
      'level.1': 'حظ عظيم',
      'level.2': 'حظ جيد',
      'level.3': 'حظ جيد',
      'level.4': 'فوق المتوسط',
      'level.5': 'متوسط',
      'level.6': 'متوسط',
      'level.7': 'تحت المتوسط',
      'level.8': 'حظ سيء',
      'text.1': 'كل الأمنيات تتحقق',
      'text.2': 'رحلة سلسة',
      'text.3': 'مساعدة من أشخاص كرام',
      'text.4': 'تقدم مستمر',
      'text.5': 'سلام وأمان',
      'text.6': 'عد نعماك',
      'text.7': 'فكر قبل أن تفعل',
      'text.8': 'انتظر الوقت المناسب',
      'detail.1': 'حظ كبير. كل شيء يسير بشكل جيد.',
      'detail.2': 'نجاح مهني. حظ سعيد. انسجام عائلي.',
      'detail.3': 'لقاءات مفيدة. تقدم مهني.',
      'detail.4': 'اعمل بجد. النجاح قادم. لا تستعجل.',
      'detail.5': 'حافظ على الوضع الراهن. انتظر الوقت المناسب.',
      'detail.6': 'الأرباح والخسائر معاً. كن راضياً.',
      'detail.7': 'كن حذراً مؤخراً.',
      'detail.8': 'أمور صعبة. هدئ، انتظر التحول.',
      'yesno.1': 'بالتأكيد!',
      'yesno.2': 'لا مشكلة~',
      'yesno.3': 'بالطبع!',
      'yesno.4': 'جرب',
      'yesno.5': 'فكر مرة أخرى',
      'yesno.6': 'دعه يمر',
      'yesno.7': 'غير مستحسن',
      'yesno.8': 'انسَ الأمر',
      'default.0': 'هوت بوت',
      'default.1': 'شواء',
      'default.2': 'سوشي',
      'default.3': 'سلطة',
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

export default function FortuneSticks({ locale = 'zh' }: FortuneSticksProps) {
  const [mode, setMode] = useState<'fortune' | 'yesno' | 'custom'>('fortune');
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [customResult, setCustomResult] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const t = getT(locale);

  useEffect(() => {
    if (!loaded) {
      setCustomOptions([
        t('default.0'),
        t('default.1'),
        t('default.2'),
        t('default.3'),
      ]);
      setLoaded(true);
    }
  }, [loaded, locale, t]);

  const getFortuneSticks = () => {
    return Array.from({ length: 8 }, (_, i) => ({
      number: `${t('stick.prefix')}${i + 1}${t('stick.suffix')}`,
      level: t(`level.${i + 1}`),
      text: t(`text.${i + 1}`),
      detail: t(`detail.${i + 1}`),
    }));
  };

  const getYesNoOptions = () => {
    const colors = [
      'text-green-500', 'text-green-500', 'text-green-500', 'text-green-400',
      'text-yellow-500', 'text-yellow-500', 'text-orange-500', 'text-red-500',
    ];
    const emojis = ['🌟', '✅', '💯', '👍', '🤔', '🌿', '🚫', '❌'];
    return Array.from({ length: 8 }, (_, i) => ({
      result: t(`yesno.${i + 1}`),
      emoji: emojis[i],
      color: colors[i],
    }));
  };

  const drawFortune = useCallback(() => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const fortuneSticks = getFortuneSticks();
      const randomIndex = Math.floor(Math.random() * fortuneSticks.length);
      setResult(fortuneSticks[randomIndex]);
      setIsShaking(false);
      setShowResult(true);
    }, 1500);
  }, [isShaking, locale]);

  const drawYesNo = useCallback(() => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const yesNoOptions = getYesNoOptions();
      const randomIndex = Math.floor(Math.random() * yesNoOptions.length);
      setResult(yesNoOptions[randomIndex]);
      setIsShaking(false);
      setShowResult(true);
    }, 1000);
  }, [isShaking, locale]);

  const drawCustom = useCallback(() => {
    if (isShaking || customOptions.length < 2) return;
    setIsShaking(true);
    setCustomResult('');
    setShowResult(false);

    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * customOptions.length);
      setCustomResult(customOptions[randomIndex]);
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * customOptions.length);
        setCustomResult(customOptions[finalIndex]);
        setIsShaking(false);
        setShowResult(true);
      }
    }, 100);
  }, [isShaking, customOptions]);

  const addOption = useCallback(() => {
    if (newOption.trim() && !customOptions.includes(newOption.trim())) {
      setCustomOptions([...customOptions, newOption.trim()]);
      setNewOption('');
    }
  }, [newOption, customOptions]);

  const removeOption = useCallback((index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  }, [customOptions]);

  const reset = useCallback(() => {
    setResult(null);
    setCustomResult('');
    setShowResult(false);
  }, []);

  const getLevelColor = (level: string) => {
    const i = Array.from({ length: 8 }, (_, x) => t(`level.${x + 1}`)).indexOf(level);
    if (i === 0) return 'from-red-500 to-pink-500';
    if (i === 1 || i === 2) return 'from-orange-400 to-yellow-400';
    if (i === 3) return 'from-green-400 to-emerald-400';
    if (i === 4 || i === 5) return 'from-blue-400 to-cyan-400';
    if (i === 6) return 'from-purple-400 to-pink-400';
    return 'from-gray-400 to-slate-500';
  };

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
          <div className='p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white'>
            <Dices className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl'>
        <button
          onClick={() => { setMode('fortune'); reset(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'fortune'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t('mode.fortune')}
        </button>
        <button
          onClick={() => { setMode('yesno'); reset(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'yesno'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t('mode.yesno')}
        </button>
        <button
          onClick={() => { setMode('custom'); reset(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'custom'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t('mode.custom')}
        </button>
      </div>

      <div className='space-y-6'>
        {mode === 'fortune' && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div
              ref={containerRef}
              className='flex flex-col items-center'
            >
              <div
                className={`w-32 h-40 relative mb-6 ${
                  isShaking ? 'animate-bounce' : ''
                }`}
                style={{
                  animation: isShaking ? 'shake 0.1s infinite' : 'none',
                }}
              >
                <div className='absolute inset-0 bg-gradient-to-b from-red-500 to-red-700 rounded-t-full rounded-b-3xl shadow-xl'>
                  <div className='absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl'>
                    {t('cylinderSign')}
                  </div>
                </div>
              </div>

              {showResult && result && (
                <div
                  className={`w-full max-w-sm p-5 rounded-xl bg-gradient-to-br ${getLevelColor(result.level)} text-white text-center shadow-lg`}
                  style={{
                    animation: 'fadeInUp 0.5s ease-out',
                  }}
                >
                  <p className='text-sm opacity-80 mb-1'>{result.number}</p>
                  <p className='text-2xl font-bold mb-1'>{result.level}</p>
                  <p className='text-lg mb-2'>{result.text}</p>
                  <p className='text-sm opacity-90'>{result.detail}</p>
                </div>
              )}

              <button
                onClick={drawFortune}
                disabled={isShaking}
                className='mt-6 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 flex items-center gap-2'
              >
                {isShaking ? (
                  <>
                    <Sparkles className='h-5 w-5 animate-spin' />
                    {t('action.shaking')}
                  </>
                ) : (
                  <>
                    <Shuffle className='h-5 w-5' />
                    {t('action.draw')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {mode === 'yesno' && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='text-center'>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>{t('thinkQuestion')}</p>
              
              <div
                className={`w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center ${
                  isShaking ? 'animate-pulse' : ''
                }`}
              >
                {showResult && result ? (
                  <div className='text-center text-white'>
                    <div className='text-5xl mb-2'>{result.emoji}</div>
                    <p className={`text-xl font-bold ${result.color}`} style={{ color: 'white' }}>{result.result}</p>
                  </div>
                ) : (
                  <span className='text-6xl'>❓</span>
                )}
              </div>

              <button
                onClick={drawYesNo}
                disabled={isShaking}
                className='px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 flex items-center gap-2 mx-auto'
              >
                {isShaking ? (
                  <>
                    <Sparkles className='h-5 w-5 animate-spin' />
                    {t('action.thinking')}
                  </>
                ) : (
                  <>
                    <Dices className='h-5 w-5' />
                    {t('action.answer')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {mode === 'custom' && (
          <div className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('optionList')}</h3>
              
              <div className='flex gap-2 mb-3'>
                <input
                  type='text'
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addOption()}
                  placeholder={t('placeholder')}
                  className='flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
                <button
                  onClick={addOption}
                  className='px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors'
                >
                  <Plus className='h-5 w-5' />
                </button>
              </div>

              <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
                {customOptions.map((option, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-sm'
                  >
                    {option}
                    <button
                      onClick={() => removeOption(index)}
                      className='ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
              </div>

              {customOptions.length < 2 && (
                <p className='text-sm text-red-500 mt-2'>{t('minOptions')}</p>
              )}
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center'>
              <div
                className={`w-48 h-48 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center ${
                  isShaking ? 'animate-pulse' : ''
                }`}
              >
                {showResult && customResult ? (
                  <div className='text-center text-white px-4'>
                    <Check className='h-12 w-12 mx-auto mb-2' />
                    <p className='text-xl font-bold'>{customResult}</p>
                  </div>
                ) : (
                  <span className='text-6xl'>🎲</span>
                )}
              </div>

              <button
                onClick={drawCustom}
                disabled={isShaking || customOptions.length < 2}
                className='px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center gap-2 mx-auto'
              >
                {isShaking ? (
                  <>
                    <Sparkles className='h-5 w-5 animate-spin' />
                    {t('action.drawing')}
                  </>
                ) : (
                  <>
                    <Shuffle className='h-5 w-5' />
                    {t('action.start')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {showResult && (
          <button
            onClick={reset}
            className='w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2'
          >
            <RotateCcw className='h-5 w-5' />
            {t('action.retry')}
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
