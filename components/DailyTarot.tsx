'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, RefreshCw, Lock, Check, Copy, Moon, Star, Eye } from 'lucide-react';

interface DailyTarotProps {
  locale?: string;
}

type Locale = 'zh' | 'en' | 'es' | 'fr' | 'hi' | 'ar';

interface TarotCard {
  id: number;
  roman: string;
  symbol: string;
  gradient: string;
  accent: string;
  name: Record<Locale, string>;
  keyword: Record<Locale, string>;
  upright: Record<Locale, string>;
  reversed: Record<Locale, string>;
}

interface DrawnCard {
  cardIndex: number;
  isReversed: boolean;
}

const STORAGE_DATE_KEY = 'tarot-last-draw-date';
const STORAGE_DATA_KEY = 'tarot-last-draw-data';

const LOCALE_LIST: Locale[] = ['zh', 'en', 'es', 'fr', 'hi', 'ar'];

function toLocale(input?: string): Locale {
  if (input && LOCALE_LIST.includes(input as Locale)) return input as Locale;
  return 'en';
}

// 22 Major Arcana with full 6-language content
const TAROT_CARDS: TarotCard[] = [
  {
    id: 0,
    roman: '0',
    symbol: '🌱',
    gradient: 'from-emerald-500 via-green-400 to-teal-500',
    accent: '#10b981',
    name: { zh: '愚者', en: 'The Fool', es: 'El Loco', fr: 'Le Mat', hi: 'मूर्ख', ar: 'المجنون' },
    keyword: { zh: '新的开始 · 天真', en: 'New beginnings · Innocence', es: 'Comienzos · Inocencia', fr: 'Débuts · Innocence', hi: 'नई शुरुआत · मासूमियत', ar: 'بدايات · براءة' },
    upright: {
      zh: '新旅程即将开启，怀着天真与勇气纵身一跃，宇宙会接住你。',
      en: 'A new journey begins. Take a leap of faith — the universe will catch you.',
      es: 'Comienza un nuevo viaje. Da un salto de fe, el universo te sostendrá.',
      fr: 'Un nouveau voyage commence. Faites un bond de foi, l\'univers vous rattrapera.',
      hi: 'एक नया सफर शुरू होता है। विश्वास का कदम उठाएं, ब्रह्मांड आपको संभालेगा।',
      ar: 'تبدأ رحلة جديدة. خذ قفزة إيمان، سيمسكك الكون.',
    },
    reversed: {
      zh: '鲁莽冒进，缺乏思考。在下决定前先停下来衡量风险。',
      en: 'Recklessness without thought. Pause and weigh risks before leaping.',
      es: 'Imprudencia sin pensar. Pausa y pesa los riesgos antes de saltar.',
      fr: 'Imprudence sans réflexion. Pausez et pesez les risques avant de sauter.',
      hi: 'बिना सोचे उतावलापन। कूदने से पहले जोखिम तौलें।',
      ar: 'تهور دون تفكير. توقف وازن المخاطر قبل القفز.',
    },
  },
  {
    id: 1,
    roman: 'I',
    symbol: '✨',
    gradient: 'from-violet-500 via-purple-400 to-fuchsia-500',
    accent: '#8b5cf6',
    name: { zh: '魔术师', en: 'The Magician', es: 'El Mago', fr: 'Le Bateleur', hi: 'जादूगर', ar: 'الساحر' },
    keyword: { zh: '显化 · 意志力', en: 'Manifestation · Willpower', es: 'Manifestación · Voluntad', fr: 'Manifestation · Volonté', hi: 'अभिव्यक्ति · इच्छाशक्ति', ar: 'تجلي · إرادة' },
    upright: {
      zh: '你拥有实现目标的所有工具。专注意志，愿望即可成真。',
      en: 'You have every tool to succeed. Focus your will, and wishes manifest.',
      es: 'Tienes todas las herramientas para triunfar. Enfoca tu voluntad.',
      fr: 'Vous avez tous les outils pour réussir. Concentrez votre volonté.',
      hi: 'सफल होने के सभी साधन आपके पास हैं। अपनी इच्छा केंद्रित करें।',
      ar: 'لديك كل الأدوات للنجاح. ركّز إرادتك تتجلى أمنياتك.',
    },
    reversed: {
      zh: '天赋未被善用，或被误导。重新校准你的初衷。',
      en: 'Talents unused or misused. Recalibrate your true intention.',
      es: 'Talentos sin usar o mal usados. Recalibra tu intención verdadera.',
      fr: 'Talents inutilisés ou mal utilisés. Recalibrez votre intention.',
      hi: 'प्रतिभाएं अप्रयुक्त या दुरुपयोग। अपनी अभिप्राय पुनः संरेखित करें।',
      ar: 'مواهب غير مستخدمة أو مُساءة استخدام. أعد ضبط نيتك.',
    },
  },
  {
    id: 2,
    roman: 'II',
    symbol: '🌙',
    gradient: 'from-indigo-500 via-blue-500 to-slate-600',
    accent: '#6366f1',
    name: { zh: '女祭司', en: 'The High Priestess', es: 'La Sacerdotisa', fr: 'La Papesse', hi: 'महापुरोहित', ar: 'الكاهنة العليا' },
    keyword: { zh: '直觉 · 神秘', en: 'Intuition · Mystery', es: 'Intuición · Misterio', fr: 'Intuition · Mystère', hi: 'अंतर्ज्ञान · रहस्य', ar: 'حدس · غموض' },
    upright: {
      zh: '倾听内在的声音，答案藏在静默与潜意识的深处。',
      en: 'Listen to your inner voice. Answers rest in silence and the subconscious.',
      es: 'Escucha tu voz interior. Las respuestas yacen en el silencio.',
      fr: 'Écoutez votre voix intérieure. Les réponses reposent dans le silence.',
      hi: 'अपनी आंतरिक आवाज़ सुनें। उत्तर नीरवता में छिपे हैं।',
      ar: 'استمع لصوتك الداخلي. الأجابات تسكن الصمت واللاوعي.',
    },
    reversed: {
      zh: '与直觉失联，秘密被掩盖。重新回归内在的智慧。',
      en: 'Disconnected from intuition, secrets hidden. Return to inner wisdom.',
      es: 'Desconectada de la intuición, secretos ocultos. Vuelve a tu sabiduría.',
      fr: 'Déconnectée de l\'intuition, secrets cachés. Revenez à la sagesse intérieure.',
      hi: 'अंतर्ज्ञान से विच्छिन्न, रहस्य छिपे। आंतरिक ज्ञान में लौटें।',
      ar: 'منفصل عن الحدس، أسرار مخفية. عُد إلى الحكمة الداخلية.',
    },
  },
  {
    id: 3,
    roman: 'III',
    symbol: '🌹',
    gradient: 'from-pink-500 via-rose-400 to-red-400',
    accent: '#ec4899',
    name: { zh: '皇后', en: 'The Empress', es: 'La Emperatriz', fr: 'L\'Impératrice', hi: 'सम्राज्ञी', ar: 'الإمبراطورة' },
    keyword: { zh: '丰盛 · 培育', en: 'Abundance · Nurturing', es: 'Abundancia · Cuidado', fr: 'Abondance · Nourrir', hi: 'प्रचुरता · पोषण', ar: 'وفرة · رعاية' },
    upright: {
      zh: '创造与丰盛正在绽放。温柔地培育，万物将繁荣生长。',
      en: 'Creativity and abundance blossom. Nurture gently, and all will flourish.',
      es: 'Creatividad y abundancia florecen. Cuida con ternura, todo florecerá.',
      fr: 'Créativité et abondance éclosent. Nourrissez avec douceur, tout fleurira.',
      hi: 'रचनात्मकता और प्रचुरता खिलते हैं। कोमलता से पालें, सब फलेगा।',
      ar: 'الإبداع والوفرة يتفتحان. رعِ بلطف، وكل شيء يزدهر.',
    },
    reversed: {
      zh: '过度依赖或创造受阻。重新连结自我关怀。',
      en: 'Overdependence or creative block. Reconnect with self-care.',
      es: 'Codependencia o bloqueo creativo. Reconecta con el autocuidado.',
      fr: 'Dépendance ou blocage créatif. Reconnectez-vous au soin de soi.',
      hi: 'अति-निर्भरता या रचनात्मक अवरोध। स्व-देखभाल से पुनः जुड़ें।',
      ar: 'اعتماد مفرط أو حظر إبداعي. أعد الاتصال بالعناية الذاتية.',
    },
  },
  {
    id: 4,
    roman: 'IV',
    symbol: '🏛',
    gradient: 'from-red-600 via-rose-500 to-orange-500',
    accent: '#dc2626',
    name: { zh: '皇帝', en: 'The Emperor', es: 'El Emperador', fr: 'L\'Empereur', hi: 'सम्राट', ar: 'الإمبراطور' },
    keyword: { zh: '权威 · 结构', en: 'Authority · Structure', es: 'Autoridad · Estructura', fr: 'Autorité · Structure', hi: 'अधिकार · संरचना', ar: 'سلطة · بنية' },
    upright: {
      zh: '以纪律与结构建立稳定。掌握权威，根基将更深。',
      en: 'Build stability through discipline and structure. Authority anchors deep.',
      es: 'Construye estabilidad con disciplina y estructura. La autoridad afianza.',
      fr: 'Bâtissez la stabilité par discipline et structure. L\'autorité ancre.',
      hi: 'अनुशासन और संरचना से स्थिरता बनाएं। अधिकार गहराई से जड़ता है।',
      ar: 'ابنِ الاستقرار بالانضباط والبنية. السلطة ترسخ بعمق.',
    },
    reversed: {
      zh: '过度控制或刚愎。松开掌控，让事物自然生长。',
      en: 'Domination or rigidity. Loosen control, allow natural growth.',
      es: 'Dominación o rigidez. Afloja el control, permite el crecimiento.',
      fr: 'Domination ou rigidité. Desserre le contrôle, laissez croître.',
      hi: 'प्रभुत्व या कठोरता। नियंत्रण ढीला करें, प्राकृतिक विकास दें।',
      ar: 'هيمنة أو جمود. فكّ السيطرة، اترك النمو الطبيعي.',
    },
  },
  {
    id: 5,
    roman: 'V',
    symbol: '📜',
    gradient: 'from-amber-500 via-yellow-400 to-orange-400',
    accent: '#f59e0b',
    name: { zh: '教皇', en: 'The Hierophant', es: 'El Sumo Sacerdote', fr: 'Le Pape', hi: 'पुरोहित', ar: 'البابا' },
    keyword: { zh: '传统 · 智慧', en: 'Tradition · Wisdom', es: 'Tradición · Sabiduría', fr: 'Tradition · Sagesse', hi: 'परंपरा · ज्ञान', ar: 'تقليد · حكمة' },
    upright: {
      zh: '向传统与导师寻求智慧，遵循既定的精神路径。',
      en: 'Seek wisdom from tradition and mentors. Follow the established path.',
      es: 'Busca sabiduría en tradición y mentores. Sigue el camino establecido.',
      fr: 'Cherchez la sagesse dans la tradition et les mentors. Suivez la voie établie.',
      hi: 'परंपरा और गुरुओं से ज्ञान लें। स्थापित मार्ग पर चलें।',
      ar: 'اطلب الحكمة من التقليد والمرشدين. اتبع الطريق القائم.',
    },
    reversed: {
      zh: '挑战常规，走非传统的路。质疑既定信念。',
      en: 'Challenge convention, walk an unconventional path. Question beliefs.',
      es: 'Desafía la convención, sigue un camino poco convencional. Cuestiona creencias.',
      fr: 'Défiez la convention, suivez une voie non conventionnelle. Questionnez les croyances.',
      hi: 'रिवाज़ चुनें, अपरंपरागत मार्ग अपनाएं। मान्यताओं पर सवाल उठाएं।',
      ar: 'تحدَّ التقليد، اسلك طريقاً غير مألوف. راجع المعتقدات.',
    },
  },
  {
    id: 6,
    roman: 'VI',
    symbol: '❤️',
    gradient: 'from-rose-500 via-pink-400 to-red-500',
    accent: '#f43f5e',
    name: { zh: '恋人', en: 'The Lovers', es: 'Los Enamorados', fr: 'L\'Amoureux', hi: 'प्रेमी', ar: 'العشاق' },
    keyword: { zh: '和谐 · 选择', en: 'Harmony · Choices', es: 'Armonía · Elecciones', fr: 'Harmonie · Choix', hi: 'सामंजस्य · चुनाव', ar: 'انسجام · خيارات' },
    upright: {
      zh: '爱与价值观的对齐。重要的关系或抉择正向你走来。',
      en: 'Love and values align. A meaningful relationship or choice approaches.',
      es: 'Amor y valores se alinean. Una relación o elección importante se acerca.',
      fr: 'Amour et valeurs s\'alignent. Une relation ou un choix important approche.',
      hi: 'प्रेम और मूल्य मिलते हैं। एक सार्थक संबंध या चुनाव समीप है।',
      ar: 'الحب والقيم يتطابقان. علاقة أو خيار مهم يقترب.',
    },
    reversed: {
      zh: '价值观失和或关系失衡。重新审视你的优先级。',
      en: 'Misaligned values or imbalance. Re-examine your priorities.',
      es: 'Valores desalineados o desequilibrio. Reexamina tus prioridades.',
      fr: 'Valeurs désalignées ou déséquilibre. Réexaminez vos priorités.',
      hi: 'मूल्य बेमेल या असंतुलन। अपनी प्राथमिकताएं पुनः जांचें।',
      ar: 'قيم غير متطابقة أو خلل. أعد فحص أولوياتك.',
    },
  },
  {
    id: 7,
    roman: 'VII',
    symbol: '🏇',
    gradient: 'from-blue-600 via-indigo-500 to-cyan-500',
    accent: '#2563eb',
    name: { zh: '战车', en: 'The Chariot', es: 'El Carro', fr: 'Le Chariot', hi: 'रथ', ar: 'المركبة' },
    keyword: { zh: '决心 · 胜利', en: 'Determination · Victory', es: 'Determinación · Victoria', fr: 'Détermination · Victoire', hi: 'दृढ़संकल्प · विजय', ar: 'عزيمة · نصر' },
    upright: {
      zh: '专注意志驱动前行，胜利属于坚定者。',
      en: 'Willpower drives you forward. Victory belongs to the determined.',
      es: 'La voluntad te impulsa. La victoria es de los determinados.',
      fr: 'La volonté vous pousse en avant. La victoire est aux déterminés.',
      hi: 'इच्छाशक्ति आपको आगे ले जाती है। विजय दृढ़संकल्पी की है।',
      ar: 'الإرادة تدفعك للأمام. النصر للعازمين.',
    },
    reversed: {
      zh: '失去方向或冲动失控。重新夺回掌控。',
      en: 'Loss of direction or impulsive aggression. Regain control.',
      es: 'Pérdida de dirección o agresión impulsiva. Recupera el control.',
      fr: 'Perte de direction ou agression impulsive. Reprenez le contrôle.',
      hi: 'दिशा खोना या आवेगी आक्रामकता। नियंत्रण पुनः पाएं।',
      ar: 'فقدان الاتجاه أو عدوان اندفاعي. استعد السيطرة.',
    },
  },
  {
    id: 8,
    roman: 'VIII',
    symbol: '🦁',
    gradient: 'from-orange-500 via-amber-400 to-yellow-400',
    accent: '#f97316',
    name: { zh: '力量', en: 'Strength', es: 'La Fuerza', fr: 'La Force', hi: 'शक्ति', ar: 'القوة' },
    keyword: { zh: '勇气 · 内在力量', en: 'Courage · Inner Power', es: 'Coraje · Poder Interior', fr: 'Courage · Force Intérieure', hi: 'साहस · आंतरिक शक्ति', ar: 'شجاعة · قوة داخلية' },
    upright: {
      zh: '以柔克刚，内在的力量与耐心驯服一切。',
      en: 'Gentle power tames all. Courage and patience prevail.',
      es: 'El poder suave domina todo. Coraje y paciencia prevalecen.',
      fr: 'La puissance douce dompte tout. Courage et patience priment.',
      hi: 'कोमल शक्ति सब को वश में करती है। साहस और धैर्य जीतते हैं।',
      ar: 'القوة اللينة تروّض كل شيء. الشجاعة والصبر يسودان.',
    },
    reversed: {
      zh: '自我怀疑或软弱。重建信心，相信你的力量。',
      en: 'Self-doubt or weakness. Rebuild confidence, trust your power.',
      es: 'Duda o debilidad. Reconstruye la confianza, confía en tu poder.',
      fr: 'Doute de soi ou faiblesse. Reconstruisez la confiance.',
      hi: 'आत्म-संदेह या दुर्बलता। आत्मविश्वास फिर बनाएं।',
      ar: 'شك في النفس أو ضعف. أعد بناء الثقة، ثق بقوتك.',
    },
  },
  {
    id: 9,
    roman: 'IX',
    symbol: '🏮',
    gradient: 'from-slate-600 via-gray-500 to-zinc-600',
    accent: '#475569',
    name: { zh: '隐士', en: 'The Hermit', es: 'El Ermitaño', fr: 'L\'Ermite', hi: 'संन्यासी', ar: 'الناسك' },
    keyword: { zh: '孤独 · 内省', en: 'Solitude · Introspection', es: 'Soledad · Introspección', fr: 'Solitude · Introspection', hi: 'एकांत · आत्मनिरीक्षण', ar: 'عزلة · تأمل' },
    upright: {
      zh: '退入孤独寻找答案，内在的光会指引方向。',
      en: 'Withdraw to find answers. The inner light will guide the way.',
      es: 'Retírate para hallar respuestas. La luz interior guiará.',
      fr: 'Retirez-vous pour trouver des réponses. La lumière intérieure guide.',
      hi: 'उत्तर खोजने एकांत में जाएं। आंतरिक प्रकाश मार्ग दिखाएगा।',
      ar: 'اعتزل لتجد الأجابات. النور الداخلي يهدي الطريق.',
    },
    reversed: {
      zh: '孤立或迷失。重新与他人和世界连结。',
      en: 'Isolation or feeling lost. Reconnect with others and the world.',
      es: 'Aislamiento o estar perdido. Reconecta con los demás y el mundo.',
      fr: 'Isolement ou égarement. Reconnectez-vous aux autres et au monde.',
      hi: 'विलगन या खोया हुआ। दूसरों और दुनिया से पुनः जुड़ें।',
      ar: 'عزلة أو ضياع. أعد الاتصال بالآخرين والعالم.',
    },
  },
  {
    id: 10,
    roman: 'X',
    symbol: '🎡',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    accent: '#7c3aed',
    name: { zh: '命运之轮', en: 'Wheel of Fortune', es: 'La Rueda de la Fortuna', fr: 'La Roue de Fortune', hi: 'भाग्य का पहिया', ar: 'عجلة الحظ' },
    keyword: { zh: '循环 · 命运', en: 'Cycles · Destiny', es: 'Ciclos · Destino', fr: 'Cycles · Destin', hi: 'चक्र · नियति', ar: 'دورات · قدر' },
    upright: {
      zh: '命运之轮转动，好运降临。变化是必然的。',
      en: 'The wheel turns, luck arrives. Change is inevitable.',
      es: 'La rueda gira, llega la suerte. El cambio es inevitable.',
      fr: 'La roue tourne, la chance arrive. Le changement est inévitable.',
      hi: 'पहिया घूमता है, भाग्य आता है। परिवर्तन अनिवार्य है।',
      ar: 'تدور العجلة، يأتي الحظ. التغيير حتمي.',
    },
    reversed: {
      zh: '逆境或抗拒变化。接纳你无法控制的事。',
      en: 'Setbacks or resisting change. Accept what you cannot control.',
      es: 'Contratiempos o resistencia al cambio. Acepta lo que no controlas.',
      fr: 'Revers ou résistance au changement. Acceptez ce qui échappe au contrôle.',
      hi: 'बाधाएं या परिवर्तन से प्रतिरोध। जो नियंत्रित नहीं, उसे स्वीकारें।',
      ar: 'نكسات أو مقاومة التغيير. تقبّل ما لا تتحكم به.',
    },
  },
  {
    id: 11,
    roman: 'XI',
    symbol: '⚖️',
    gradient: 'from-cyan-500 via-teal-400 to-blue-500',
    accent: '#06b6d4',
    name: { zh: '正义', en: 'Justice', es: 'La Justicia', fr: 'La Justice', hi: 'न्याय', ar: 'العدالة' },
    keyword: { zh: '公平 · 因果', en: 'Fairness · Cause & Effect', es: 'Equidad · Causa y Efecto', fr: 'Équité · Cause à Effet', hi: 'निष्पक्षता · कार्य-परिणाम', ar: 'عدل · سبب ونتيجة' },
    upright: {
      zh: '公平将得到伸张，因果轮回，平衡终将恢复。',
      en: 'Fairness prevails. Cause and effect restore balance.',
      es: 'La equidad prevalece. Causa y efecto restauran el equilibrio.',
      fr: 'L\'équité prévaut. Cause et effet restaurent l\'équilibre.',
      hi: 'निष्पक्षता प्रबल है। कार्य-परिणाम संतुलन लाते हैं।',
      ar: 'العدل يسود. السبب والنتيجة ي restoringان التوازن.',
    },
    reversed: {
      zh: '不公或失衡。审视自身的偏见与责任。',
      en: 'Unfairness or imbalance. Examine your own biases and responsibility.',
      es: 'Injusticia o desequilibrio. Examina tus propios sesgos y responsabilidades.',
      fr: 'Injustice ou déséquilibre. Examinez vos propres biais et responsabilités.',
      hi: 'अन्याय या असंतुलन। अपने पूर्वाग्रह जांचें।',
      ar: 'ظلم أو خلل. افحص تحيزاتك ومسؤولياتك.',
    },
  },
  {
    id: 12,
    roman: 'XII',
    symbol: '🙃',
    gradient: 'from-teal-500 via-cyan-400 to-blue-400',
    accent: '#14b8a6',
    name: { zh: '倒吊人', en: 'The Hanged Man', es: 'El Colgado', fr: 'Le Pendu', hi: 'लटका हुआ आदमी', ar: 'المعلق' },
    keyword: { zh: '牺牲 · 新视角', en: 'Sacrifice · New Perspective', es: 'Sacrificio · Nueva Perspectiva', fr: 'Sacrifice · Nouvelle Perspective', hi: 'त्याग · नया दृष्टिकोण', ar: 'تضحية · منظور جديد' },
    upright: {
      zh: '暂停脚步，换个角度看世界。放手即得到。',
      en: 'Pause, see the world from a new angle. Letting go brings gain.',
      es: 'Pausa, mira el mundo desde otro ángulo. Soltar trae ganancia.',
      fr: 'Pausez, voyez le monde sous un autre angle. Lâcher prise apporte.',
      hi: 'रुकें, दुनिया को नए कोण से देखें। छोड़ना लाभ देता है।',
      ar: 'توقف، انظر للعالم من زاوية جديدة. الترك يجلب المكسب.',
    },
    reversed: {
      zh: '停滞不前或犹豫不决。放下抗拒。',
      en: 'Stalling or indecision. Let go of resistance.',
      es: 'Estancamiento o indecisión. Suelta la resistencia.',
      fr: 'Stagnation ou indécision. Lâchez la résistance.',
      hi: 'रुकना या अनिर्णय। प्रतिरोध छोड़ें।',
      ar: 'توقف أو تردد. ترك المقاومة.',
    },
  },
  {
    id: 13,
    roman: 'XIII',
    symbol: '💀',
    gradient: 'from-gray-700 via-slate-600 to-zinc-700',
    accent: '#374151',
    name: { zh: '死神', en: 'Death', es: 'La Muerte', fr: 'La Mort', hi: 'मृत्यु', ar: 'الموت' },
    keyword: { zh: '结束 · 转变', en: 'Endings · Transformation', es: 'Finales · Transformación', fr: 'Fins · Transformation', hi: 'अंत · परिवर्तन', ar: 'نهايات · تحول' },
    upright: {
      zh: '一扇门关闭，另一扇门打开。拥抱必然的转变。',
      en: 'One door closes, another opens. Embrace necessary transformation.',
      es: 'Una puerta se cierra, otra se abre. Abraza la transformación.',
      fr: 'Une porte se ferme, une autre s\'ouvre. Embrassez la transformation.',
      hi: 'एक दरवाज़ा बंद, दूसरा खुलता। परिवर्तन गले लगाएं।',
      ar: 'باب يُغلق، آخر يُفتح. عانق التحول الضروري.',
    },
    reversed: {
      zh: '抗拒变化或停滞不前。接纳结束的必然性。',
      en: 'Resisting change, stagnation. Accept the necessity of endings.',
      es: 'Resistir el cambio, estancamiento. Acepta la necesidad de los finales.',
      fr: 'Résister au changement, stagnation. Acceptez la nécessité des fins.',
      hi: 'परिवर्तन से प्रतिरोध, ठहराव। अंत की आवश्यकता स्वीकारें।',
      ar: 'مقاومة التغيير، ركود. تقبّل ضرورة النهايات.',
    },
  },
  {
    id: 14,
    roman: 'XIV',
    symbol: '🕊️',
    gradient: 'from-sky-400 via-cyan-300 to-blue-300',
    accent: '#0ea5e9',
    name: { zh: '节制', en: 'Temperance', es: 'La Templanza', fr: 'Tempérance', hi: 'संयम', ar: 'الاعتدال' },
    keyword: { zh: '平衡 · 节制', en: 'Balance · Moderation', es: 'Equilibrio · Moderación', fr: 'Équilibre · Modération', hi: 'संतुलन · संयम', ar: 'توازن · اعتدال' },
    upright: {
      zh: '寻找中道，平衡与耐心将带来和谐。',
      en: 'Find the middle path. Balance and patience bring harmony.',
      es: 'Encuentra el camino medio. Equilibrio y paciencia traen armonía.',
      fr: 'Trouvez la voie du milieu. Équilibre et patience apportent l\'harmonie.',
      hi: 'मध्य मार्ग खोजें। संतुलन और धैर्य सामंजस्य लाते हैं।',
      ar: 'اجد الطريق الأوسط. التوازن والصبر يجلبان الانسجام.',
    },
    reversed: {
      zh: '失衡或过度。修复和谐，回归节制。',
      en: 'Imbalance or excess. Restore harmony, return to moderation.',
      es: 'Desequilibrio o exceso. Restaura la armonía, vuelve a la moderación.',
      fr: 'Déséquilibre ou excès. Restaurez l\'harmonie, revenez à la modération.',
      hi: 'असंतुलन या अति। सामंजस्य बहाल करें, संयम में लौटें।',
      ar: 'خلل أو إفراط. استعد الانسجام، عُد للاعتدال.',
    },
  },
  {
    id: 15,
    roman: 'XV',
    symbol: '😈',
    gradient: 'from-zinc-700 via-stone-700 to-red-900',
    accent: '#1f2937',
    name: { zh: '恶魔', en: 'The Devil', es: 'El Diablo', fr: 'Le Diable', hi: 'शैतान', ar: 'الشيطان' },
    keyword: { zh: '束缚 · 执着', en: 'Bondage · Attachment', es: 'Ataduras · Apego', fr: 'Liens · Attachement', hi: 'बंधन · आसक्ति', ar: 'قيود · تعلق' },
    upright: {
      zh: '审视那些束缚你的执着与欲望，看清锁链的真相。',
      en: 'Examine attachments and desires that bind you. See the chains clearly.',
      es: 'Examina los apegos y deseos que te atan. Ve las cadenas con claridad.',
      fr: 'Examinez les attachements qui vous lient. Voyez les chaînes.',
      hi: 'बांधने वाली आसक्तियों को जांचें। जंजीर स्पष्ट देखें।',
      ar: 'افحص التعلقات والرغبات التي تقيّدك. انظر القيود بوضوح.',
    },
    reversed: {
      zh: '挣脱束缚，重夺力量。锁链正在松开。',
      en: 'Breaking free, reclaiming power. The chains are loosening.',
      es: 'Liberándote, recuperando el poder. Las cadenas se aflojan.',
      fr: 'Se libérer, reprendre le pouvoir. Les chaînes se desserrent.',
      hi: 'मुक्त होना, शक्ति पुनः पाना। जंजीर ढीली हो रही हैं।',
      ar: 'التحرر، استعادة القوة. القيود ترخي.',
    },
  },
  {
    id: 16,
    roman: 'XVI',
    symbol: '🏰',
    gradient: 'from-stone-600 via-amber-700 to-red-800',
    accent: '#57534e',
    name: { zh: '塔', en: 'The Tower', es: 'La Torre', fr: 'La Maison Dieu', hi: 'मीनार', ar: 'البرج' },
    keyword: { zh: '剧变 · 启示', en: 'Upheaval · Revelation', es: 'Trastorno · Revelación', fr: 'Bouleversement · Révélation', hi: 'प्रलय · प्रकाश', ar: 'زلزال · كشف' },
    upright: {
      zh: '旧结构崩塌，真相显现。混乱之后是新生。',
      en: 'Old structures collapse, truth revealed. After chaos, rebirth.',
      es: 'Viejas estructuras colapsan, verdad revelada. Tras el caos, renacimiento.',
      fr: 'Les vieilles structures s\'effondrent, vérité révélée. Après le chaos, renaissance.',
      hi: 'पुरानी संरचनाएं गिरती हैं, सत्य प्रकट होता है। क्रांति के बाद पुनर्जन्म।',
      ar: 'بنى قديمة تنهار، حقيقة تنكشف. بعد الفوضى، ولادة جديدة.',
    },
    reversed: {
      zh: '逃避灾难或恐惧变化。抗拒只会延长痛苦。',
      en: 'Avoiding disaster, fearing change. Resistance prolongs the pain.',
      es: 'Evitar el desastre, temer el cambio. La resistencia prolonga el dolor.',
      fr: 'Éviter le désastre, craindre le changement. La résistance prolonge la douleur.',
      hi: 'विपद से भागना, परिवर्तन से डरना। प्रतिरोध दर्द बढ़ाता है।',
      ar: 'تجنب الكارثة، الخوف من التغيير. المقاومة تطيل الألم.',
    },
  },
  {
    id: 17,
    roman: 'XVII',
    symbol: '⭐',
    gradient: 'from-indigo-400 via-purple-300 to-blue-300',
    accent: '#818cf8',
    name: { zh: '星星', en: 'The Star', es: 'La Estrella', fr: 'L\'Étoile', hi: 'तारा', ar: 'النجمة' },
    keyword: { zh: '希望 · 灵感', en: 'Hope · Inspiration', es: 'Esperanza · Inspiración', fr: 'Espoir · Inspiration', hi: 'आशा · प्रेरणा', ar: 'أمل · إلهام' },
    upright: {
      zh: '黑暗之后是光明。希望与灵感重新注入心间。',
      en: 'After darkness, light. Hope and inspiration refill the heart.',
      es: 'Tras la oscuridad, luz. Esperanza e inspiración llenan el corazón.',
      fr: 'Après l\'obscurité, la lumière. Espoir et inspiration emplissent le cœur.',
      hi: 'अंधकार के बाद प्रकाश। आशा और प्रेरणा हृदय को भरते हैं।',
      ar: 'بعد الظلام، نور. الأمل والإلهام يملآن القلب.',
    },
    reversed: {
      zh: '绝望或失去信念。重新连接希望之光。',
      en: 'Despair or loss of faith. Reconnect with the light of hope.',
      es: 'Desesperación o pérdida de fe. Reconecta con la luz de la esperanza.',
      fr: 'Désespoir ou perte de foi. Reconnectez-vous à la lumière de l\'espoir.',
      hi: 'निराशा या विश्वाहानि। आशा के प्रकाश से पुनः जुड़ें।',
      ar: 'يأس أو فقدان إيمان. أعد الاتصال بنور الأمل.',
    },
  },
  {
    id: 18,
    roman: 'XVIII',
    symbol: '🌛',
    gradient: 'from-indigo-600 via-blue-700 to-slate-700',
    accent: '#4338ca',
    name: { zh: '月亮', en: 'The Moon', es: 'La Luna', fr: 'La Lune', hi: 'चंद्रमा', ar: 'القمر' },
    keyword: { zh: '幻象 · 直觉', en: 'Illusion · Intuition', es: 'Ilusión · Intuición', fr: 'Illusion · Intuition', hi: 'माया · अंतर्ज्ञान', ar: 'وهم · حدس' },
    upright: {
      zh: '并非一切如表面所示。倾听直觉，警惕幻象。',
      en: 'Not all is as it seems. Trust intuition, beware of illusions.',
      es: 'No todo es como parece. Confía en la intuición, cuidado con ilusiones.',
      fr: 'Rien n\'est comme il paraît. Fiez-vous à l\'intuition, méfiez des illusions.',
      hi: 'सब वैसा नहीं जैसा दिखता है। अंतर्ज्ञान पर भरोसा करें।',
      ar: 'ليس كل شيء كما يبدو. ثق بالحدس، احذر الأوهام.',
    },
    reversed: {
      zh: '迷雾消散，真相浮现。信任你内在的感知。',
      en: 'Fog lifts, truth emerges. Trust your inner perception.',
      es: 'La niebla se disipa, la verdad emerge. Confía en tu percepción.',
      fr: 'Le brouillard se lève, la vérité émerge. Fiez-vous à votre perception.',
      hi: 'धुंध छंटती है, सत्य प्रकट होता है। अपनी आतंरिक दृष्टि पर भरोसा करें।',
      ar: 'ينقشع الضباب، تبرز الحقيقة. ثق بإدراكك الداخلي.',
    },
  },
  {
    id: 19,
    roman: 'XIX',
    symbol: '☀️',
    gradient: 'from-yellow-400 via-amber-400 to-orange-400',
    accent: '#facc15',
    name: { zh: '太阳', en: 'The Sun', es: 'El Sol', fr: 'Le Soleil', hi: 'सूर्य', ar: 'الشمس' },
    keyword: { zh: '喜悦 · 成功', en: 'Joy · Success', es: 'Alegría · Éxito', fr: 'Joie · Succès', hi: 'आनंद · सफलता', ar: 'فرح · نجاح' },
    upright: {
      zh: '阳光普照，喜悦与成功降临。积极与丰盛。',
      en: 'Sunshine floods in. Joy, success, positivity and abundance arrive.',
      es: 'El sol brilla. Alegría, éxito, positividad y abundancia llegan.',
      fr: 'Le soleil inonde. Joie, succès, positivité et abondance arrivent.',
      hi: 'सूर्य चमकता है। आनंद, सफलता, सकारात्मकता और प्रचुरता आते हैं।',
      ar: 'الشمس تشرق. الفرح والنجاح والإيجابية والوفرة تأتي.',
    },
    reversed: {
      zh: '短暂的阴霾或喜悦减弱。乌云终会散去。',
      en: 'Temporary gloom or diminished joy. Clouds will pass.',
      es: 'Tristeza temporal o alegría disminuida. Las nubes pasarán.',
      fr: 'Tristesse passagère ou joie diminuée. Les nuages passeront.',
      hi: 'क्षणिक उदासी या कम आनंद। बादल गुज़र जाएंगे।',
      ar: 'كآبة مؤقتة أو فرح يخف. الغيوم ستمر.',
    },
  },
  {
    id: 20,
    roman: 'XX',
    symbol: '⚡',
    gradient: 'from-amber-500 via-yellow-500 to-orange-600',
    accent: '#d97706',
    name: { zh: '审判', en: 'Judgement', es: 'El Juicio', fr: 'Le Jugement', hi: 'निर्णय', ar: 'الدينونة' },
    keyword: { zh: '重生 · 觉醒', en: 'Rebirth · Awakening', es: 'Renacimiento · Despertar', fr: 'Renaissance · Éveil', hi: 'पुनर्जन्म · जागृति', ar: 'بعث · يقظة' },
    upright: {
      zh: '觉醒的召唤到来，向更高的使命重生。',
      en: 'A call to awaken. Rebirth toward a higher purpose.',
      es: 'Un llamado a despertar. Renacimiento hacia un propósito superior.',
      fr: 'Un appel à s\'éveiller. Renaissance vers un but supérieur.',
      hi: 'जागने का आह्वान। उच्च उद्देश्य की ओर पुनर्जन्म।',
      ar: 'نداء لليقظة. بعث نحو غاية أعلى.',
    },
    reversed: {
      zh: '自我怀疑或无视召唤。反思过往的功课。',
      en: 'Self-doubt or ignoring the call. Reflect on past lessons.',
      es: 'Duda o ignorar el llamado. Reflexiona sobre lecciones pasadas.',
      fr: 'Doute de soi ou ignorer l\'appel. Réfléchissez aux leçons passées.',
      hi: 'आत्म-संदेह या आह्वान अनदेखा। पिछले पाठों पर विचार करें।',
      ar: 'شك في النفس أو تجاهل النداء. تأمل في الدروس الماضية.',
    },
  },
  {
    id: 21,
    roman: 'XXI',
    symbol: '🌍',
    gradient: 'from-emerald-500 via-teal-400 to-cyan-500',
    accent: '#10b981',
    name: { zh: '世界', en: 'The World', es: 'El Mundo', fr: 'Le Monde', hi: 'विश्व', ar: 'العالم' },
    keyword: { zh: '完成 · 圆满', en: 'Completion · Wholeness', es: 'Completitud · Plenitud', fr: 'Achèvement · Plénitude', hi: 'पूर्णता · समग्रता', ar: 'اكتمال · كمال' },
    upright: {
      zh: '一个循环已经圆满完成。成就与整体感降临。',
      en: 'A cycle is fulfilled. Achievement and wholeness arrive.',
      es: 'Un ciclo se cumple. Logro y plenitud llegan.',
      fr: 'Un cycle s\'achève. Accomplissement et plénitude arrivent.',
      hi: 'एक चक्र पूर्ण होता है। उपलब्धि और समग्रता आते हैं।',
      ar: 'دورة تكتمل. إنجاز وكمال يحلان.',
    },
    reversed: {
      zh: '尚未完成或有延迟。最后几步仍需走完。',
      en: 'Incompletion or delay. The final steps remain to be walked.',
      es: 'Incompleto o retraso. Los pasos finales quedan por dar.',
      fr: 'Inachèvement ou retard. Les dernières étapes restent à parcourir.',
      hi: 'अधूरा या विलंब। अंतिम कदम बाकी हैं।',
      ar: 'نقص أو تأخير. الخطوات الأخيرة ما زالت منتظرة.',
    },
  },
];

const i18n: Record<Locale, Record<string, string>> = {
  zh: {
    title: '每日塔罗牌占卜',
    subtitle: '抽三张大牌，解读过去、现在与未来的轨迹',
    hint: '深呼吸，专注你的问题，然后点击抽牌',
    drawBtn: '抽牌',
    drawing: '正在抽牌...',
    positions: ['过去', '现在', '未来'],
    upright: '正位',
    reversed: '逆位',
    alreadyDrawn: '你今天已经抽过牌了',
    tomorrowHint: '每日只能抽一次，明天再来抽取新的塔罗牌',
    reviewBtn: '查看今日牌',
    cardLabel: '塔罗牌',
    keyword: '关键词',
    interpretation: '解读',
    copy: '复制结果',
    copied: '已复制',
    reset: '收起',
    reveal: '翻牌',
    cardBack: '塔罗',
    dateLabel: '抽取日期',
    intro: '塔罗牌不预测命运，而是映照你此刻的内心。三张牌阵对应过去、现在、未来，帮助你审视当下的选择与方向。',
  },
  en: {
    title: 'Daily Tarot Reading',
    subtitle: 'Draw three Major Arcana to read your past, present and future',
    hint: 'Breathe deeply, focus on your question, then draw',
    drawBtn: 'Draw Cards',
    drawing: 'Drawing...',
    positions: ['Past', 'Present', 'Future'],
    upright: 'Upright',
    reversed: 'Reversed',
    alreadyDrawn: 'You have already drawn today',
    tomorrowHint: 'You can only draw once per day. Come back tomorrow for a new reading.',
    reviewBtn: 'View Today\'s Draw',
    cardLabel: 'Tarot Card',
    keyword: 'Keyword',
    interpretation: 'Interpretation',
    copy: 'Copy Result',
    copied: 'Copied',
    reset: 'Collapse',
    reveal: 'Reveal',
    cardBack: 'Tarot',
    dateLabel: 'Drawn on',
    intro: 'Tarot does not predict fate — it mirrors your inner self. The three-card spread reflects past, present and future, helping you examine your current path.',
  },
  es: {
    title: 'Lectura de Tarot Diaria',
    subtitle: 'Saca tres Arcanos Mayores para leer tu pasado, presente y futuro',
    hint: 'Respira profundamente, enfoca tu pregunta, luego saca',
    drawBtn: 'Sacar Cartas',
    drawing: 'Sacando...',
    positions: ['Pasado', 'Presente', 'Futuro'],
    upright: 'Derecha',
    reversed: 'Invertida',
    alreadyDrawn: 'Ya has sacado hoy',
    tomorrowHint: 'Solo puedes sacar una vez al día. Vuelve mañana para una nueva lectura.',
    reviewBtn: 'Ver la Tirada de Hoy',
    cardLabel: 'Carta',
    keyword: 'Palabra Clave',
    interpretation: 'Interpretación',
    copy: 'Copiar',
    copied: 'Copiado',
    reset: 'Cerrar',
    reveal: 'Revelar',
    cardBack: 'Tarot',
    dateLabel: 'Sacada el',
    intro: 'El tarot no predice el destino, refleja tu interior. La tirada de tres cartas aborda pasado, presente y futuro, ayudándote a examinar tu camino.',
  },
  fr: {
    title: 'Tirage de Tarot Quotidien',
    subtitle: 'Tirez trois Arcanes Majeurs pour lire votre passé, présent et futur',
    hint: 'Respirez profondément, concentrez-vous sur votre question, puis tirez',
    drawBtn: 'Tirer les Cartes',
    drawing: 'Tirage...',
    positions: ['Passé', 'Présent', 'Futur'],
    upright: 'Droit',
    reversed: 'Renversé',
    alreadyDrawn: 'Vous avez déjà tiré aujourd\'hui',
    tomorrowHint: 'Un seul tirage par jour. Revenez demain pour une nouvelle lecture.',
    reviewBtn: 'Voir le Tirage du Jour',
    cardLabel: 'Carte',
    keyword: 'Mot-Clé',
    interpretation: 'Interprétation',
    copy: 'Copier',
    copied: 'Copié',
    reset: 'Réduire',
    reveal: 'Révéler',
    cardBack: 'Tarot',
    dateLabel: 'Tiré le',
    intro: 'Le tarot ne prédit pas le destin, il reflète votre intériorité. La tirage à trois cartes éclaire passé, présent et futur.',
  },
  hi: {
    title: 'दैनिक टैरो पठन',
    subtitle: 'तीन प्रमुख आर्केना खींचें और अपने अतीत, वर्तमान और भविष्य को जानें',
    hint: 'गहरी साँस लें, अपने प्रश्न पर ध्यान केंद्रित करें, फिर खींचें',
    drawBtn: 'कार्ड खींचें',
    drawing: 'खींच रहे हैं...',
    positions: ['अतीत', 'वर्तमान', 'भविष्य'],
    upright: 'सीधा',
    reversed: 'उल्टा',
    alreadyDrawn: 'आपने आज पहले ही खींच लिया है',
    tomorrowHint: 'आप दिन में केवल एक बार खींच सकते हैं। कल नए पठन के लिए लौटें।',
    reviewBtn: 'आज का पठन देखें',
    cardLabel: 'टैरो कार्ड',
    keyword: 'मुख्य शब्द',
    interpretation: 'व्याख्या',
    copy: 'कॉपी करें',
    copied: 'कॉपी हुआ',
    reset: 'सिकोड़ें',
    reveal: 'प्रकट करें',
    cardBack: 'टैरो',
    dateLabel: 'खींचा गया',
    intro: 'टैरो भाग्य नहीं बताता, यह आपके भीतर को दर्शाता है। तीन-कार्ड पठन अतीत, वर्तमान और भविष्य को प्रकाशित करता है।',
  },
  ar: {
    title: 'قراءة التاروت اليومية',
    subtitle: 'اسحب ثلاثة أوراق كبرى لقراءة ماضيك وحاضرك ومستقبلك',
    hint: 'تنفّس بعمق، ركّز على سؤالك، ثم اسحب',
    drawBtn: 'اسحب الأوراق',
    drawing: 'جارٍ السحب...',
    positions: ['الماضي', 'الحاضر', 'المستقبل'],
    upright: 'مستقيم',
    reversed: 'مقلوب',
    alreadyDrawn: 'لقد سحبت اليوم بالفعل',
    tomorrowHint: 'يمكنك السحب مرة واحدة فقط يومياً. عُد غداً لقراءة جديدة.',
    reviewBtn: 'اعرض سحبة اليوم',
    cardLabel: 'ورقة',
    keyword: 'كلمة مفتاحية',
    interpretation: 'تفسير',
    copy: 'نسخ',
    copied: 'تم النسخ',
    reset: 'طي',
    reveal: 'كشف',
    cardBack: 'تاروت',
    dateLabel: 'سُحبت في',
    intro: 'التاروت لا يتنبأ بالقدر، بل يعكس داخلك. سحبة الأوراق الثلاث تضيء الماضي والحاضر والمستقبل.',
  },
};

// Mulberry32 seeded PRNG — so the daily draw is fixed per calendar day.
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function drawThreeCards(seed: number): DrawnCard[] {
  const rng = mulberry32(seed);
  const indices = Array.from({ length: TAROT_CARDS.length }, (_, i) => i);
  // Fisher–Yates shuffle using seeded RNG
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const picked = indices.slice(0, 3);
  return picked.map((cardIndex) => ({
    cardIndex,
    isReversed: rng() < 0.5,
  }));
}

function formatDate(ts: number, locale: Locale): string {
  try {
    const langMap: Record<Locale, string> = {
      zh: 'zh-CN',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      hi: 'hi-IN',
      ar: 'ar-EG',
    };
    return new Intl.DateTimeFormat(langMap[locale], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toDateString();
  }
}

export default function DailyTarot({ locale = 'en' }: DailyTarotProps) {
  const loc = toLocale(locale);
  const t = i18n[loc];
  const isRTL = loc === 'ar';

  const [drawnCards, setDrawnCards] = useState<DrawnCard[] | null>(null);
  const [drawnAt, setDrawnAt] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasTodayDraw, setHasTodayDraw] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const drawTimers = useRef<number[]>([]);

  useEffect(() => {
    setHydrated(true);
    try {
      const lastDate = localStorage.getItem(STORAGE_DATE_KEY);
      const lastData = localStorage.getItem(STORAGE_DATA_KEY);
      const todayKey = getTodayKey();
      if (lastDate === todayKey && lastData) {
        const parsed = JSON.parse(lastData) as { cards: DrawnCard[]; ts: number };
        if (parsed && Array.isArray(parsed.cards) && parsed.cards.length === 3) {
          setDrawnCards(parsed.cards);
          setDrawnAt(parsed.ts);
          setHasTodayDraw(true);
          setShowResult(true);
          setRevealed([true, true, true]);
        }
      }
    } catch {
      // ignore corrupted storage
    }
    return () => {
      drawTimers.current.forEach((id) => window.clearTimeout(id));
      drawTimers.current = [];
    };
  }, []);

  const handleDraw = useCallback(() => {
    if (isDrawing) return;
    setIsDrawing(true);
    setRevealed([false, false, false]);
    setShowResult(false);

    const seed = getDailySeed();
    const cards = drawThreeCards(seed);
    const ts = Date.now();

    try {
      localStorage.setItem(STORAGE_DATE_KEY, getTodayKey());
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ cards, ts }));
    } catch {
      // storage might be unavailable; UI still works
    }

    setDrawnCards(cards);
    setDrawnAt(ts);
    setHasTodayDraw(true);
    setShowResult(true);

    cards.forEach((_, idx) => {
      const id = window.setTimeout(() => {
        setRevealed((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, 400 + idx * 600);
      drawTimers.current.push(id);
    });

    window.setTimeout(() => setIsDrawing(false), 400 + cards.length * 600 + 200);
  }, [isDrawing]);

  const handleReview = () => {
    setShowResult(true);
    setRevealed([true, true, true]);
  };

  const handleCollapse = () => {
    setShowResult(false);
  };

  const handleCopy = async () => {
    if (!drawnCards) return;
    const lines: string[] = [];
    lines.push(`${t.title} — ${drawnAt ? formatDate(drawnAt, loc) : ''}`);
    lines.push('');
    drawnCards.forEach((dc, i) => {
      const card = TAROT_CARDS[dc.cardIndex];
      const orient = dc.isReversed ? t.reversed : t.upright;
      const interp = dc.isReversed ? card.reversed[loc] : card.upright[loc];
      lines.push(`【${t.positions[i]}】${card.name[loc]} (${orient})`);
      lines.push(`${t.keyword}: ${card.keyword[loc]}`);
      lines.push(`${t.interpretation}: ${interp}`);
      lines.push('');
    });
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked; silently ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <style jsx>{`
        .tarot-card-3d {
          perspective: 1200px;
        }
        .tarot-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .tarot-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .tarot-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 14px;
          overflow: hidden;
        }
        .tarot-card-face--back {
          transform: rotateY(0deg);
        }
        .tarot-card-face--front {
          transform: rotateY(180deg);
        }
        @keyframes tarotFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .tarot-float {
          animation: tarotFloat 3s ease-in-out infinite;
        }
        @keyframes tarotShuffle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-3deg); }
          75% { transform: translateY(-2px) rotate(3deg); }
        }
        .tarot-shuffle {
          animation: tarotShuffle 0.4s ease-in-out infinite;
        }
        @keyframes tarotFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tarot-fade-in {
          animation: tarotFadeIn 0.5s ease-out both;
        }
        .tarot-card-symbol {
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
        }
      `}</style>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
          <Moon className="w-6 h-6 text-violet-500" />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-violet-200 dark:border-violet-800/60 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-indigo-950/40 p-5 sm:p-6 shadow-sm">
        <p className="text-xs sm:text-sm text-violet-700/80 dark:text-violet-300/80 leading-relaxed mb-5 text-center max-w-2xl mx-auto">
          {t.intro}
        </p>

        {!showResult && !isDrawing && (
          <div className="flex flex-col items-center gap-5 py-6">
            <div className="relative h-44 w-32 sm:h-52 sm:w-36">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-xl shadow-lg tarot-float"
                  style={{
                    transform: `translate(${(i - 1.5) * 6}px, ${-i * 3}px) rotate(${(i - 1.5) * 4}deg)`,
                    animationDelay: `${i * 0.2}s`,
                    background:
                      'linear-gradient(135deg, #3b0764 0%, #5b21b6 40%, #6d28d9 70%, #4c1d95 100%)',
                    border: '2px solid rgba(245, 208, 254, 0.4)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-8 h-8 text-violet-200/70" />
                  </div>
                  <div className="absolute top-2 left-2 right-2 flex justify-between">
                    <Sparkles className="w-3 h-3 text-violet-200/60" />
                    <Sparkles className="w-3 h-3 text-violet-200/60" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-[9px] tracking-widest text-violet-200/70 uppercase">
                      {t.cardBack}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-violet-600 dark:text-violet-300 italic text-center max-w-md">
              {t.hint}
            </p>

            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              <Sparkles className="w-5 h-5" />
              {t.drawBtn}
            </button>
          </div>
        )}

        {isDrawing && (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="relative h-40 w-32">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-xl shadow-xl tarot-shuffle"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    background:
                      'linear-gradient(135deg, #3b0764 0%, #5b21b6 50%, #4c1d95 100%)',
                    border: '2px solid rgba(245, 208, 254, 0.4)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-7 h-7 text-violet-200/70 tarot-shuffle" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-violet-600 dark:text-violet-300 animate-pulse">
              {t.drawing}
            </p>
          </div>
        )}

        {showResult && drawnCards && (
          <div className="tarot-fade-in">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              {drawnCards.map((dc, idx) => {
                const card = TAROT_CARDS[dc.cardIndex];
                const isRevealed = revealed[idx];
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-semibold text-violet-700 dark:text-violet-300 mb-2">
                      {t.positions[idx]}
                    </span>
                    <div className="tarot-card-3d w-full" style={{ aspectRatio: '2 / 3' }}>
                      <div className={`tarot-card-inner ${isRevealed ? 'is-flipped' : ''}`}>
                        <div
                          className="tarot-card-face tarot-card-face--back flex items-center justify-center"
                          style={{
                            background:
                              'linear-gradient(135deg, #3b0764 0%, #5b21b6 45%, #6d28d9 75%, #4c1d95 100%)',
                            border: '2px solid rgba(245, 208, 254, 0.45)',
                          }}
                        >
                          <div className="absolute inset-1.5 rounded-lg border border-violet-300/30 flex items-center justify-center">
                            <Star className="w-7 h-7 sm:w-9 sm:h-9 text-violet-200/70" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <Sparkles className="w-3 h-3 text-violet-200/60" />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Sparkles className="w-3 h-3 text-violet-200/60" />
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-center">
                            <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-violet-200/70 uppercase">
                              {t.cardBack}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`tarot-card-face tarot-card-face--front bg-gradient-to-b ${card.gradient} flex flex-col items-center justify-between p-2 sm:p-3 text-white`}
                          style={{ border: '2px solid rgba(255,255,255,0.45)' }}
                        >
                          <div className="w-full flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-bold tracking-wider opacity-90">
                              {card.roman}
                            </span>
                            {dc.isReversed ? (
                              <span className="text-[8px] sm:text-[10px] font-semibold bg-black/30 px-1.5 py-0.5 rounded">
                                {t.reversed}
                              </span>
                            ) : (
                              <span className="text-[8px] sm:text-[10px] font-semibold bg-white/25 px-1.5 py-0.5 rounded">
                                {t.upright}
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-3xl sm:text-5xl tarot-card-symbol ${dc.isReversed ? 'rotate-180' : ''}`}
                          >
                            {card.symbol}
                          </div>
                          <div className="w-full text-center">
                            <div className="text-[11px] sm:text-sm font-bold leading-tight">
                              {card.name[loc]}
                            </div>
                            <div className="text-[8px] sm:text-[10px] opacity-80 mt-0.5 leading-tight">
                              {card.keyword[loc]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {revealed.every(Boolean) && (
              <div className="tarot-fade-in space-y-3">
                {drawnCards.map((dc, idx) => {
                  const card = TAROT_CARDS[dc.cardIndex];
                  const orient = dc.isReversed ? t.reversed : t.upright;
                  const interp = dc.isReversed ? card.reversed[loc] : card.upright[loc];
                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-violet-200/60 dark:border-violet-800/60 p-3 sm:p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-xl sm:text-2xl shadow-md ${dc.isReversed ? 'rotate-180' : ''}`}
                        >
                          {card.symbol}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                              {t.positions[idx]}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                              {card.name[loc]}
                            </span>
                            <span
                              className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-semibold ${dc.isReversed ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}
                            >
                              {orient}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {card.keyword[loc]}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                            {interp}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {drawnAt && (
                  <div className="text-center text-xs text-violet-600/70 dark:text-violet-400/70 pt-1">
                    {t.dateLabel}: {formatDate(drawnAt, loc)}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition min-h-[44px] font-medium shadow-md"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? t.copied : t.copy}
                  </button>
                  {hydrated && hasTodayDraw && (
                    <button
                      onClick={handleCollapse}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[44px] font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t.reset}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-violet-600/80 dark:text-violet-400/80 bg-violet-100/60 dark:bg-violet-900/30 rounded-lg p-2.5 mt-2">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t.tomorrowHint}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {!showResult && hasTodayDraw && hydrated && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-300 bg-violet-100/70 dark:bg-violet-900/30 rounded-lg px-4 py-2.5">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>{t.alreadyDrawn}</span>
            </div>
            <button
              onClick={handleReview}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl transition-all min-h-[48px]"
            >
              <Eye className="w-5 h-5" />
              {t.reviewBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
