'use client';

import { useState, useRef, useEffect } from 'react';
import { Shuffle, Sparkles, Copy, Check, RotateCcw, MessageCircle, Search } from 'lucide-react';

interface FortuneDrawingProps {
  locale?: string;
}

interface Fortune {
  number: number;
  level: string;
  levelKey: number;
  poem: string;
  poemTranslation: string;
  interpretation: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '抽签占卜',
    subtitle: '传统中国式抽签，解读你的运势',
    questionLabel: '请输入你的问题',
    questionPlaceholder: '例如：我最近的工作运会如何？',
    shakeHint: '静下心来，默念你的问题，然后摇动摇签筒',
    shake: '摇签',
    drawing: '抽签中...',
    result: '抽签结果',
    stickNumber: '第 {n} 签',
    level: '签等级',
    poem: '签诗',
    translation: '白话解读',
    interpretation: '详细释义',
    share: '分享',
    copy: '复制',
    copied: '已复制',
    retry: '重新抽签',
    levels: ['上上签', '上签', '中签', '下签', '下下签'],
    levelColors: [
      'from-red-600 via-red-500 to-yellow-400',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-green-500 via-emerald-400 to-teal-400',
      'from-blue-500 via-indigo-400 to-slate-400',
      'from-gray-500 via-slate-500 to-zinc-600',
    ],
    emptyError: '请先输入你的问题',
    questionLabelShort: '所问',
    thanks: '感谢使用抽签占卜',
  },
  en: {
    title: 'Fortune Drawing',
    subtitle: 'Traditional Chinese fortune sticks to divine your luck',
    questionLabel: 'Enter your question',
    questionPlaceholder: 'e.g. How will my career go recently?',
    shakeHint: 'Calm your mind, think of your question, then shake the cylinder',
    shake: 'Shake',
    drawing: 'Drawing...',
    result: 'Your Fortune',
    stickNumber: 'Stick #{n}',
    level: 'Fortune Level',
    poem: 'Poem',
    translation: 'Translation',
    interpretation: 'Interpretation',
    share: 'Share',
    copy: 'Copy',
    copied: 'Copied',
    retry: 'Draw Again',
    levels: ['Great Fortune', 'Good Fortune', 'Middle Fortune', 'Small Fortune', 'Misfortune'],
    levelColors: [
      'from-red-600 via-red-500 to-yellow-400',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-green-500 via-emerald-400 to-teal-400',
      'from-blue-500 via-indigo-400 to-slate-400',
      'from-gray-500 via-slate-500 to-zinc-600',
    ],
    emptyError: 'Please enter your question first',
    questionLabelShort: 'Question',
    thanks: 'Thank you for using Fortune Drawing',
  },
  es: {
    title: 'Sorteo de Fortuna',
    subtitle: 'Palos de fortuna tradicionales chinos para adivinar tu suerte',
    questionLabel: 'Introduce tu pregunta',
    questionPlaceholder: 'ej. ¿Cómo irá mi carrera recientemente?',
    shakeHint: 'Calma tu mente, piensa en tu pregunta y luego saca un palo',
    shake: 'Sacar',
    drawing: 'Sacando...',
    result: 'Tu Fortuna',
    stickNumber: 'Palo #{n}',
    level: 'Nivel de Fortuna',
    poem: 'Poema',
    translation: 'Traducción',
    interpretation: 'Interpretación',
    share: 'Compartir',
    copy: 'Copiar',
    copied: 'Copiado',
    retry: 'Sacar de Nuevo',
    levels: ['Gran Fortuna', 'Buena Fortuna', 'Fortuna Media', 'Poca Fortuna', 'Mala Suerte'],
    levelColors: [
      'from-red-600 via-red-500 to-yellow-400',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-green-500 via-emerald-400 to-teal-400',
      'from-blue-500 via-indigo-400 to-slate-400',
      'from-gray-500 via-slate-500 to-zinc-600',
    ],
    emptyError: 'Por favor introduce tu pregunta primero',
    questionLabelShort: 'Pregunta',
    thanks: 'Gracias por usar el sorteo de fortuna',
  },
  fr: {
    title: 'Tirage de Fortune',
    subtitle: 'Bâtons de fortune chinois traditionnels pour prédire votre chance',
    questionLabel: 'Entrez votre question',
    questionPlaceholder: 'ex. Comment se passera ma carrière ?',
    shakeHint: 'Calmez votre esprit, pensez à votre question, puis tirez',
    shake: 'Tirer',
    drawing: 'Tirage...',
    result: 'Votre Fortune',
    stickNumber: 'Bâton #{n}',
    level: 'Niveau de Fortune',
    poem: 'Poème',
    translation: 'Traduction',
    interpretation: 'Interprétation',
    share: 'Partager',
    copy: 'Copier',
    copied: 'Copié',
    retry: 'Recommencer',
    levels: ['Grande Fortune', 'Bonne Fortune', 'Fortune Moyenne', 'Petite Fortune', 'Malchance'],
    levelColors: [
      'from-red-600 via-red-500 to-yellow-400',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-green-500 via-emerald-400 to-teal-400',
      'from-blue-500 via-indigo-400 to-slate-400',
      'from-gray-500 via-slate-500 to-zinc-600',
    ],
    emptyError: 'Veuillez entrer votre question d\'abord',
    questionLabelShort: 'Question',
    thanks: 'Merci d\'avoir utilisé le tirage de fortune',
  },
  hi: {
    title: 'भाग्य ड्राइंग',
    subtitle: 'पारंपरिक चीनी भाग्य स्टिक्स आपके भाग्य का अनुमान लगाने के लिए',
    questionLabel: 'अपना प्रश्न दर्ज करें',
    questionPlaceholder: 'जैसे: मेरा करियर कैसा रहेगा?',
    shakeHint: 'अपने मन को शांत करें, प्रश्न सोचें, फिर स्टिक निकालें',
    shake: 'हिलाएं',
    drawing: 'निकाल रहे हैं...',
    result: 'आपका भाग्य',
    stickNumber: 'स्टिक #{n}',
    level: 'भाग्य स्तर',
    poem: 'कविता',
    translation: 'अनुवाद',
    interpretation: 'व्याख्या',
    share: 'साझा करें',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    retry: 'फिर निकालें',
    levels: ['महान भाग्य', 'अच्छा भाग्य', 'मध्यम भाग्य', 'छोटा भाग्य', 'दुर्भाग्य'],
    levelColors: [
      'from-red-600 via-red-500 to-yellow-400',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-green-500 via-emerald-400 to-teal-400',
      'from-blue-500 via-indigo-400 to-slate-400',
      'from-gray-500 via-slate-500 to-zinc-600',
    ],
    emptyError: 'कृपया पहले अपना प्रश्न दर्ज करें',
    questionLabelShort: 'प्रश्न',
    thanks: 'भाग्य ड्राइंग का उपयोग करने के लिए धन्यवाद',
  },
  ar: {
    title: 'سحب الحظ',
    subtitle: 'أعمدة الحظ الصينية التقليدية لتخمين حظك',
    questionLabel: 'أدخل سؤالك',
    questionPlaceholder: 'مثال: كيف سيكون حظي في العمل؟',
    shakeHint: 'اهدأ عقلك، فكر في سؤالك، ثم اهز الأسطوانة',
    shake: 'اهتز',
    drawing: 'يسحب...',
    result: 'حظك',
    stickNumber: 'العود #{n}',
    level: 'مستوى الحظ',
    poem: 'القصيدة',
    translation: 'الترجمة',
    interpretation: 'التفسير',
    share: 'مشاركة',
    copy: 'نسخ',
    copied: 'تم النسخ',
    retry: 'إعادة السحب',
    levels: ['حظ عظيم', 'حظ جيد', 'حظ متوسط', 'حظ قليل', 'حظ سيء'],
    levelColors: [
      'from-red-600 via-red-500 to-yellow-400',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-green-500 via-emerald-400 to-teal-400',
      'from-blue-500 via-indigo-400 to-slate-400',
      'from-gray-500 via-slate-500 to-zinc-600',
    ],
    emptyError: 'يرجى إدخال سؤالك أولاً',
    questionLabelShort: 'السؤال',
    thanks: 'شكراً لاستخدام سحب الحظ',
  },
};

const FORTUNES: Fortune[] = [
  {
    number: 1, level: '上上签', levelKey: 0,
    poem: '紫气东来福满门，金榜题名步步升。贵人相助前程远，心想事成万事兴。',
    poemTranslation: 'Purple mist brings fortune from the east, golden name rises step by step. Nobles help your journey far, all your wishes come true.',
    interpretation: '此签乃帝王之象，大吉大利。紫气东来象征祥瑞将至，金榜题名代表事业有成。近期你将获得贵人相助，前途光明，万事顺遂。宜把握机遇，大展宏图。',
  },
  {
    number: 2, level: '上上签', levelKey: 0,
    poem: '日出扶桑万丈光，云开雾散见青天。乘风破浪正其时，一帆风顺到彼岸。',
    poemTranslation: 'Sun rises from Fusang with boundless light, clouds disperse to reveal clear sky. It\'s time to ride the wind and waves, sail smoothly to the other shore.',
    interpretation: '此签象征黑暗即将过去，光明即将到来。目前的困境只是暂时的，云开雾散后将迎来大好局面。此时正是勇往直前的好时机，乘风破浪必能到达理想的彼岸。',
  },
  {
    number: 3, level: '上签', levelKey: 1,
    poem: '春风得意马蹄疾，一日看尽长安花。好事连连喜事多，锦绣前程正可期。',
    poemTranslation: 'Spring breeze carries the proud horse fast, in one day sees all Chang\'an flowers. Good events come one after another, a splendid future awaits.',
    interpretation: '此签主事业顺利，春风得意。近期你的事业将迎来快速发展期，可能会有升迁或重要突破。感情方面也将有所收获，是诸事顺心的好时光。',
  },
  {
    number: 4, level: '上签', levelKey: 1,
    poem: '松鹤延年福寿长，芝兰玉树满庭芳。家和万事心安乐，福禄寿喜齐临门。',
    poemTranslation: 'Pine and crane extend your years of life, orchids and jade trees fill the court with fragrance. Harmony brings peace of mind, fortune, longevity and joy arrive together.',
    interpretation: '此签主家庭和睦、身体健康。松鹤延年象征长寿，芝兰玉树代表优秀的晚辈。家和万事兴，家庭和谐是最大的福气，福禄寿喜将一起降临。',
  },
  {
    number: 5, level: '上签', levelKey: 1,
    poem: '书山有路勤为径，学海无涯苦作舟。宝剑锋从磨砺出，梅花香自苦寒来。',
    poemTranslation: 'Mountains of books have diligence as their path, seas of learning have hardship as their boat. Sword edges come from sharpening, plum blossoms fragrance from bitter cold.',
    interpretation: '此签主努力终有回报。书山有路、学海无涯，你的坚持和努力终将得到认可。宝剑锋从磨砺出，梅花香自苦寒来——经历的苦越多，收获的甜就越美。',
  },
  {
    number: 6, level: '中签', levelKey: 2,
    poem: '随缘随分莫强求，顺其自然福自悠。守得云开见月明，静待花开终有时。',
    poemTranslation: 'Follow fate, don\'t force things, let nature take its course and happiness will come. Wait for clouds to clear and see the moon, wait quietly for flowers to bloom.',
    interpretation: '此签主顺其自然。有些事情强求不得，不如随遇而安。守得云开见月明，静待花开终有时——耐心等待，事情终会向好的方向发展。不要焦虑，时机未到而已。',
  },
  {
    number: 7, level: '中签', levelKey: 2,
    poem: '知足常乐心自宽，有容乃大天地间。得失之间随缘看，平安便是福之源。',
    poemTranslation: 'Contentment brings joy and a broad heart, tolerance makes the world your home. Gains and losses are all fate, peace is the source of all fortune.',
    interpretation: '此签主知足常乐。人生在世，不可能事事如意，重要的是知足。得失之间要看淡，平安健康才是最大的福气。保持一颗宽容的心，天地自然宽广。',
  },
  {
    number: 8, level: '中签', levelKey: 2,
    poem: '行路多艰需忍耐，山穷水复疑无路。柳暗花明又一村，守正待时终有成。',
    poemTranslation: 'The road is hard, need patience, mountains end and waters end—no way? Then willows bright and flowers bloom, another village appears. Stay upright, bide your time, success will come.',
    interpretation: '此签主先苦后甜。山穷水复疑无路，柳暗花明又一村——眼前的困难看似无解，但坚持下去就会有转机。守正待时，终有所成。现在需要的是忍耐和坚持。',
  },
  {
    number: 9, level: '中签', levelKey: 2,
    poem: '平淡生活滋味长，粗茶淡饭亦添香。不争不抢随缘过，自在心安是良方。',
    poemTranslation: 'Plain and simple life has long-lasting flavor, coarse tea and plain rice carry fragrance. Don\'t compete, let fate guide your way, peace of mind is the best medicine.',
    interpretation: '此签主平平淡淡才是真。不必追求轰轰烈烈，平淡生活中自有真滋味。不争不抢，自在心安，这才是最好的生活方式。知足者常乐，简单者幸福。',
  },
  {
    number: 10, level: '中签', levelKey: 2,
    poem: '小富由勤大富命，命中有时终须有。脚踏实地稳步走，不负年华不负心。',
    poemTranslation: 'Small wealth comes from diligence, great wealth from fate. What\'s yours will come to you. Walk step by step, don\'t waste time or heart.',
    interpretation: '此签主勤劳致富、知足安分。小富由勤，大富由命。脚踏实地做好本职工作，不贪求意外之财。你不负时光，时光定不负你。',
  },
  {
    number: 11, level: '下签', levelKey: 3,
    poem: '风雨飘摇路难行，孤舟蓑笠独飘零。忍得一时之气短，方保百年之身安。',
    poemTranslation: 'Wind and rain make the road hard, a lone boat drifts in raincoat and hat. Endure a moment of anger, protect a century of peace.',
    interpretation: '此签主近期不顺，宜忍不宜争。风雨飘摇之时，独木难行。此时最重要的是忍耐，不要冲动行事。忍得一时之气，方保百年之安。退一步海阔天空。',
  },
  {
    number: 12, level: '下签', levelKey: 3,
    poem: '是非缠身莫辩明，清者自清浊自浊。闭门修心避祸端，静待风平浪自静。',
    poemTranslation: 'Surrounded by right and wrong, don\'t argue. The pure stay pure, the turbid stay turbid. Close the door, cultivate the heart, avoid disaster. Wait for winds to calm.',
    interpretation: '此签主是非缠身，宜静不宜动。近期可能会有是非之事缠身，此时不必争辩，清者自清。闭门修心，静待风平。此时最忌与人发生口角，保持沉默是金。',
  },
  {
    number: 13, level: '下签', levelKey: 3,
    poem: '乌云蔽日不见光，暂守寒蛰伏锋芒。他年若得风雷动，一跃冲天任翱翔。',
    poemTranslation: 'Dark clouds hide the sun, stay dormant and hide your edge. When thunder comes another year, leap to the sky and soar.',
    interpretation: '此签主蛰伏待机。乌云蔽日之时，不要轻举妄动。暂时收敛锋芒，静待时机。他年风雷动，一跃冲天——现在的蛰伏是为了将来的腾飞。',
  },
  {
    number: 14, level: '下签', levelKey: 3,
    poem: '人情冷暖世态凉，锦上添花处处逢。雪中送炭能有几，自保为上莫求人。',
    poemTranslation: 'Worldly warmth and cold, the state of things is cool. Flowers on brocade are everywhere, but charcoal in snow—how rare. Protect yourself first, don\'t seek others.',
    interpretation: '此签主世态炎凉，人情冷暖。锦上添花者众，雪中送炭者寡。此时要认清身边的人，不要轻易相信他人。自保为上，凡事多一个心眼。',
  },
  {
    number: 15, level: '下下签', levelKey: 4,
    poem: '屋漏偏逢连夜雨，船迟又遇打头风。福无双至祸不单，守正避凶待春归。',
    poemTranslation: 'A leaking roof meets overnight rain, a late ship meets headwinds. Fortune doesn\'t come alone, disaster doesn\'t come singly. Stay upright, avoid evil, wait for spring.',
    interpretation: '此签主诸事不顺，祸不单行。屋漏偏逢连夜雨，船迟又遇打头风——屋漏加雨、船迟遇风，真是雪上加霜。此时最需冷静，守正避凶，等待春归。切忌冲动决策。',
  },
  {
    number: 16, level: '下下签', levelKey: 4,
    poem: '寒蝉凄切对长亭，骤雨初歇酒醒迟。聚散离合皆是缘，且将新火试新茶。',
    poemTranslation: 'Cicadas cry coldly by the long pavilion, sudden rain stops, wine wakes late. Gather and part, all is fate, try new fire for new tea.',
    interpretation: '此签主聚散离合，缘分已尽。寒蝉凄切，骤雨初歇——一段关系或一个阶段可能即将结束。但请记住，聚散离合皆是缘分。且将新火试新茶，新的开始就在前方。',
  },
  {
    number: 17, level: '上签', levelKey: 1,
    poem: '月满西楼照九洲，清风明月伴君游。千里姻缘一线牵，有情人终成眷属。',
    poemTranslation: 'Full moon over west tower lights the world, clear wind and moon accompany your journey. Thousand-mile fate ties with one thread, true lovers finally unite.',
    interpretation: '此签主姻缘美满。月满西楼，千里姻缘——如果你在感情上有所期盼，此签预示着美好的姻缘即将到来。有情人终成眷属，缘分到了自然会在一起。',
  },
  {
    number: 18, level: '上签', levelKey: 1,
    poem: '蟠桃熟时王母来，瑶池仙乐奏天边。福禄寿三星高照，喜临门好事连连。',
    poemTranslation: 'When peaches ripen, the Queen Mother comes, fairy music plays at the Jade Pool. Fortune, Longevity and Prosperity shine above, joy arrives one after another.',
    interpretation: '此签主喜事连连，福星高照。蟠桃成熟、瑶池仙乐——象征着美好的庆祝时刻。福禄寿三星高照，近期家中或事业上会有可喜之事，值得庆贺。',
  },
  {
    number: 19, level: '中签', levelKey: 2,
    poem: '云淡风轻过眼前，花开花落两由之。得失荣枯皆是命，一蓑烟雨任平生。',
    poemTranslation: 'Clouds light, wind gentle, passing before the eyes, flowers bloom and fall as they will. Gain and loss, honor and shame are all fate, one raincoat and misty rain for life.',
    interpretation: '此签主豁达洒脱。花开花落两由之，一蓑烟雨任平生——人生的得失荣枯都是缘分，不必太在意。保持豁达的心态，顺其自然地面对人生的起伏。',
  },
  {
    number: 20, level: '中签', levelKey: 2,
    poem: '十年磨剑霜刃寒，一朝试锋天下惊。莫嫌蛰伏时光久，利器终有出头日。',
    poemTranslation: 'Ten years grinding a sword, frost-cold blade, one day trying its edge shakes the world. Don\'t hate the long dormant time, sharp tools will have their day.',
    interpretation: '此签主厚积薄发。十年磨剑，一朝试锋——长期的积累和磨练终将得到回报。蛰伏的时光虽然漫长，但你的努力不会白费。坚持下去，终有出头之日。',
  },
];

function getRandomFortune(): Fortune {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}

export default function FortuneDrawing({ locale = 'zh' }: FortuneDrawingProps) {
  const t = i18n[locale] || i18n.zh;
  const isRTL = locale === 'ar';

  const [question, setQuestion] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const cylinderRef = useRef<HTMLDivElement>(null);
  const shakeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current);
      }
    };
  }, []);

  const handleShake = () => {
    if (isShaking) return;
    if (!question.trim()) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }
    setError(false);
    setShowResult(false);
    setFortune(null);
    setIsShaking(true);

    let shakeCount = 0;
    const maxShakes = 30;
    shakeIntervalRef.current = window.setInterval(() => {
      shakeCount++;
      if (shakeCount >= maxShakes) {
        if (shakeIntervalRef.current) {
          clearInterval(shakeIntervalRef.current);
          shakeIntervalRef.current = null;
        }
        const drawn = getRandomFortune();
        setFortune(drawn);
        setIsShaking(false);
        setTimeout(() => setShowResult(true), 50);
      }
    }, 80);
  };

  const handleReset = () => {
    setShowResult(false);
    setFortune(null);
    setQuestion('');
    setError(false);
  };

  const handleCopy = async () => {
    if (!fortune) return;
    const level = t.levels[fortune.levelKey];
    const text = `${t.stickNumber.replace('{n}', String(fortune.number))} ${level}\n\n${fortune.poem}\n\n${fortune.interpretation}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const displayPoem = locale === 'en' && fortune ? fortune.poemTranslation : fortune?.poem || '';
  const displayTranslation = fortune?.poemTranslation || '';

  return (
    <div className="max-w-2xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="bg-gradient-to-b from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6 shadow-sm">
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
            <MessageCircle size={16} />
            {t.questionLabel}
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.questionPlaceholder}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-red-200 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition resize-none"
          />
          {error && (
            <p className="text-sm text-red-500 mt-1 animate-pulse">{t.emptyError}</p>
          )}
        </div>

        <div className="text-center text-sm text-red-600 dark:text-red-400 mb-4 italic">
          {t.shakeHint}
        </div>

        <div className="flex justify-center mb-6">
          <div
            ref={cylinderRef}
            className={`relative ${isShaking ? 'fortune-shake' : ''}`}
            style={{ width: 160, height: 200 }}
          >
            <div
              className="absolute inset-0 rounded-t-[60px] rounded-b-[30px] shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, #b91c1c 0%, #991b1b 40%, #7f1d1d 100%)',
                border: '3px solid #92400e',
              }}
            >
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold shadow-inner"
                style={{
                  background: 'radial-gradient(circle, #fbbf24 0%, #d97706 70%)',
                  color: '#7f1d1d',
                  border: '3px solid #f59e0b',
                }}
              >
                福
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full"
                    style={{
                      height: `${60 + Math.random() * 30}px`,
                      background: 'linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)',
                      transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
            {isShaking && (
              <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-pulse" />
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleShake}
            disabled={isShaking}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {isShaking ? (
              <>
                <Shuffle className="w-5 h-5 animate-spin" />
                {t.drawing}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {t.shake}
              </>
            )}
          </button>
        </div>
      </div>

      {showResult && fortune && (
        <div className="mt-6 animate-fadeInUp">
          <div className={`rounded-2xl bg-gradient-to-br ${t.levelColors[fortune.levelKey]} p-6 text-white shadow-xl mb-4`}>
            <div className="text-center">
              <p className="text-sm opacity-80 mb-1">{t.stickNumber.replace('{n}', String(fortune.number))}</p>
              <h3 className="text-3xl font-bold mb-2">{t.levels[fortune.levelKey]}</h3>
              <div className="w-16 h-0.5 bg-white/50 mx-auto" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm mb-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
              <Sparkles size={16} />
              {locale === 'en' ? t.poem : '签诗'}
            </h4>
            <div className="text-center py-3" dir={isRTL ? 'rtl' : 'ltr'}>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100 leading-loose whitespace-pre-line" style={{ fontFamily: locale === 'zh' ? 'serif' : 'inherit' }}>
                {fortune.poem}
              </p>
            </div>
            {locale === 'en' && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  {fortune.poemTranslation}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm mb-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
              <MessageCircle size={16} />
              {t.interpretation}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {locale === 'en' ? fortune.poemTranslation : fortune.interpretation}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[44px] font-medium"
            >
              <RotateCcw size={18} />
              {t.retry}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition min-h-[44px] font-medium shadow-md"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          10% { transform: rotate(-8deg) translateY(-2px); }
          20% { transform: rotate(8deg) translateY(0); }
          30% { transform: rotate(-6deg) translateY(2px); }
          40% { transform: rotate(6deg) translateY(0); }
          50% { transform: rotate(-4deg) translateY(-1px); }
          60% { transform: rotate(4deg) translateY(1px); }
          70% { transform: rotate(-2deg) translateY(0); }
          80% { transform: rotate(2deg) translateY(0); }
          90% { transform: rotate(-1deg) translateY(0); }
        }
        .fortune-shake {
          animation: shake 0.3s infinite;
          transform-origin: bottom center;
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
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}