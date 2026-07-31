'use client';

import { useState, useRef } from 'react';
import { Heart, Copy, Check, Sparkles, RefreshCw, Download, Palette, Type, MessageSquare } from 'lucide-react';

interface LoveLetterGeneratorProps {
  locale?: string;
}

type Style = 'romantic' | 'poetic' | 'humorous' | 'sincere';

interface StyleTemplate {
  zh: string[];
  en: string[];
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '情书生成器',
    subtitle: '为你的心上人生成一封独一无二的情书',
    recipientLabel: '收件人姓名',
    recipientPlaceholder: '例如：亲爱的小雨',
    yearsLabel: '相伴年数',
    yearsPlaceholder: '例如：3',
    styleLabel: '情书风格',
    styleRomantic: '浪漫',
    stylePoetic: '诗意',
    styleHumorous: '幽默',
    styleSincere: '真诚',
    keywordsLabel: '关键词/回忆',
    keywordsPlaceholder: '用逗号分隔，如：第一次相遇,海边散步,深夜长谈',
    generate: '生成情书',
    generating: '生成中...',
    regenerate: '换一封',
    copy: '复制',
    copied: '已复制',
    exportPng: '导出图片',
    addAcrostic: '加入藏头诗',
    acrosticPlaceholder: '例如：我爱你',
    resultTitle: '你的情书',
    tip: '提示：添加更多关键词，让情书更有温度',
  },
  en: {
    title: 'Love Letter Generator',
    subtitle: 'Create a unique love letter for your beloved',
    recipientLabel: 'Recipient Name',
    recipientPlaceholder: 'e.g. My dearest',
    yearsLabel: 'Years Together',
    yearsPlaceholder: 'e.g. 3',
    styleLabel: 'Letter Style',
    styleRomantic: 'Romantic',
    stylePoetic: 'Poetic',
    styleHumorous: 'Humorous',
    styleSincere: 'Sincere',
    keywordsLabel: 'Keywords / Memories',
    keywordsPlaceholder: 'Separate by commas, e.g. first meeting, beach walks, late night talks',
    generate: 'Generate Letter',
    generating: 'Generating...',
    regenerate: 'Regenerate',
    copy: 'Copy',
    copied: 'Copied',
    exportPng: 'Export Image',
    addAcrostic: 'Add Acrostic Poem',
    acrosticPlaceholder: 'e.g. LOVE',
    resultTitle: 'Your Love Letter',
    tip: 'Tip: Add more keywords to make the letter more personal',
  },
  es: {
    title: 'Generador de Cartas de Amor',
    subtitle: 'Crea una carta de amor única para tu ser querido',
    recipientLabel: 'Nombre del Destinatario',
    recipientPlaceholder: 'ej. Mi querida',
    yearsLabel: 'Años Juntos',
    yearsPlaceholder: 'ej. 3',
    styleLabel: 'Estilo de Carta',
    styleRomantic: 'Romántico',
    stylePoetic: 'Poético',
    styleHumorous: 'Humorístico',
    styleSincere: 'Sincero',
    keywordsLabel: 'Palabras Clave / Recuerdos',
    keywordsPlaceholder: 'Separar por comas, ej. primer encuentro, paseos por la playa',
    generate: 'Generar Carta',
    generating: 'Generando...',
    regenerate: 'Regenerar',
    copy: 'Copiar',
    copied: 'Copiado',
    exportPng: 'Exportar Imagen',
    addAcrostic: 'Añadir Acróstico',
    acrosticPlaceholder: 'ej. AMOR',
    resultTitle: 'Tu Carta de Amor',
    tip: 'Consejo: Añade más palabras clave para personalizar',
  },
  fr: {
    title: 'Générateur de Lettres d\'Amour',
    subtitle: 'Créez une lettre d\'amour unique pour votre bien-aimé',
    recipientLabel: 'Nom du Destinataire',
    recipientPlaceholder: 'ex. Ma chérie',
    yearsLabel: 'Années Ensemble',
    yearsPlaceholder: 'ex. 3',
    styleLabel: 'Style de Lettre',
    styleRomantic: 'Romantique',
    stylePoetic: 'Poétique',
    styleHumorous: 'Humouristique',
    styleSincere: 'Sincère',
    keywordsLabel: 'Mots-clés / Souvenirs',
    keywordsPlaceholder: 'Séparer par des virgules, ex. première rencontre, promenades sur la plage',
    generate: 'Générer',
    generating: 'Génération...',
    regenerate: 'Régénérer',
    copy: 'Copier',
    copied: 'Copié',
    exportPng: 'Exporter Image',
    addAcrostic: 'Ajouter un Acrostiche',
    acrosticPlaceholder: 'ex. AMOUR',
    resultTitle: 'Votre Lettre d\'Amour',
    tip: 'Conseil : Ajoutez plus de mots-clés pour personnaliser',
  },
  hi: {
    title: 'लव लेटर जनरेटर',
    subtitle: 'अपने प्रिय के लिए एक अनोखा प्रेम पत्र बनाएं',
    recipientLabel: 'प्राप्तकर्ता का नाम',
    recipientPlaceholder: 'जैसे: मेरे प्रिय',
    yearsLabel: 'एक साथ वर्ष',
    yearsPlaceholder: 'जैसे: 3',
    styleLabel: 'पत्र शैली',
    styleRomantic: 'रोमांटिक',
    stylePoetic: 'काव्यात्मक',
    styleHumorous: 'हास्य',
    styleSincere: 'ईमानदार',
    keywordsLabel: 'कीवर्ड / यादें',
    keywordsPlaceholder: 'अल्पविराम से अलग करें, जैसे: पहली मुलाकात, समुद्री सैर',
    generate: 'जनरेट करें',
    generating: 'जनरेट हो रहा है...',
    regenerate: 'पुनः जनरेट',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    exportPng: 'छवि निर्यात',
    addAcrostic: 'तुकबंदी जोड़ें',
    acrosticPlaceholder: 'जैसे: प्यार',
    resultTitle: 'आपका प्रेम पत्र',
    tip: 'सुझाव: और अधिक कीवर्ड जोड़ें',
  },
  ar: {
    title: 'مولد رسائل الحب',
    subtitle: 'أنشئ رسالة حب فريدة لمن تحب',
    recipientLabel: 'اسم المستلم',
    recipientPlaceholder: 'مثال: حبيبتي',
    yearsLabel: 'سنوات معاً',
    yearsPlaceholder: 'مثال: 3',
    styleLabel: 'أسلوب الرسالة',
    styleRomantic: 'رومانسي',
    stylePoetic: 'شعري',
    styleHumorous: 'فكاهي',
    styleSincere: 'صادق',
    keywordsLabel: 'كلمات مفتاحية / ذكريات',
    keywordsPlaceholder: 'افصل بفواصل، مثال: اللقاء الأول، مشي على الشاطئ',
    generate: 'إنشاء الرسالة',
    generating: 'جاري الإنشاء...',
    regenerate: 'إعادة إنشاء',
    copy: 'نسخ',
    copied: 'تم النسخ',
    exportPng: 'تصدير صورة',
    addAcrostic: 'إضافة قصيدة حروف',
    acrosticPlaceholder: 'مثال: حب',
    resultTitle: 'رسالة حبك',
    tip: 'نصيحة: أضف المزيد من الكلمات المفتاحية',
  },
};

const TEMPLATES: Record<Style, StyleTemplate> = {
  romantic: {
    zh: [
      `亲爱的 {recipient}：\n\n在遇见你之前，我从未想过生活会如此美好。{years}年了，每一个平凡的日子都因为有你而闪闪发光。\n\n还记得{keywords}吗？那些画面至今仍在我脑海中浮现，温暖如初。\n\n你是我所有浪漫想象的具象，是我每天醒来最期待的理由。你的笑容是我的日出，你的拥抱是我的港湾。\n\n谢谢你选择了我，让我成为世界上最幸运的人。我会用余生去守护你、珍惜你、爱你。\n\n永远爱你的`,
      `{recipient}：\n\n有一些话藏在心里太久了，今天终于想告诉你。在过去的{years}年里，你是我生命中最美丽的意外。\n\n每当我想起{keywords}，心里就涌起满满的温暖。那些时刻，是我珍藏的宝藏。\n\n你是我的诗，我的歌，我的远方。和你在一起的每一刻，都让我相信爱情。\n\n我承诺，无论风雨，我都会牵着你的手。谢谢你成为我的答案。\n\n你的`,
      `亲爱的 {recipient}：\n\n{years}年的时光，说长不长，说短不短，但足以让我确定一件事——你就是我生命中最美好的遇见。\n\n你还记得{keywords}吗？那一刻，我就知道，我要和你一起走过所有的春夏秋冬。\n\n你的存在本身就是一首最美的情诗。我喜欢你笑起来眼睛弯弯的样子，喜欢你认真做事时的侧脸，喜欢一切关于你的细节。\n\n此生有你，夫复何求？\n\n永远爱你的`,
    ],
    en: [
      `My dearest {recipient},\n\nBefore I met you, I never imagined life could be this beautiful. {years} years have passed, and every ordinary day shines brighter because of you.\n\nDo you remember {keywords}? Those moments still play in my mind, warm as ever.\n\nYou are the embodiment of all my romantic dreams, the reason I look forward to waking up each day. Your smile is my sunrise, your embrace is my harbor.\n\nThank you for choosing me, making me the luckiest person alive. I will spend my life protecting you, cherishing you, loving you.\n\nForever yours,`,
      `{recipient},\n\nThere are words I\'ve kept in my heart for too long. After {years} years, you are the most beautiful surprise in my life.\n\nWhen I think of {keywords}, warmth fills my heart. Those moments are my treasures.\n\nYou are my poem, my song, my horizon. Every moment with you makes me believe in love.\n\nI promise, through rain and shine, I will hold your hand. Thank you for being my answer.\n\nYours always,`,
      `My beloved {recipient},\n\n{years} years - not too long, not too short, but enough for me to know: you are the best thing that ever happened to me.\n\nDo you remember {keywords}? In that moment, I knew I wanted to walk every season of life with you.\n\nYour very existence is the most beautiful love poem. I love the way your eyes curve when you smile, the profile when you\'re focused, every detail about you.\n\nWith you in this life, what more could I ask for?\n\nForever yours,`,
    ],
  },
  poetic: {
    zh: [
      `吾爱 {recipient}：\n\n岁月如诗，光阴似箭。{years}载春秋，转眼而过，而你始终是我诗中最美的篇章。\n\n忆往昔，{keywords}，恍若昨日。时光流转，你仍是我心中不变的风景。\n\n你是清风明月，是星辰大海，是人间四月天。有你的日子，万物皆可爱；无你的时光，四季都失色。\n\n愿以我心，换你一世欢颜；愿以我身，为你遮风挡雨。此生此世，不离不弃。\n\n执子之手，与子偕老。\n\n你的`,
      `致我心中的{recipient}：\n\n人生若只如初见，何事秋风悲画扇。{years}年了，你仍是我初见时的模样——清澈眼眸，温柔笑容。\n\n曾记否？{keywords}。那一天，我的世界春暖花开。\n\n你是我读千遍仍不厌的诗，是我听万次仍心动的歌。与你相遇，是我此生最美的际遇。\n\n愿得一心人，白首不相离。\n\n你的`,
      `{recipient}：\n\n山有木兮木有枝，心悦君兮君不知。{years}年了，有些话藏在心底已久。\n\n{keywords}，那一刻便注定了今生的缘分。你是我前世五百次回眸换来的相守。\n\n世间万物皆有尽，唯我对你之情无尽。愿为你采撷星辰，愿为你描画彩虹。\n\n死生契阔，与子成说。\n\n你的`,
    ],
    en: [
      `My love {recipient},\n\nTime flows like poetry, years pass like an arrow. {years} springs and autumns have flown, yet you remain the most beautiful chapter in my poem.\n\nI recall {keywords} as if it were yesterday. Through time\'s passage, you are the constant in my heart.\n\nYou are the clear wind and bright moon, the stars and the sea, the April of this world. With you, everything is lovely; without you, seasons lose their color.\n\nI give my heart to see you smile forever; I give my being to shelter you from wind and rain. This life, I will never leave your side.\n\nHand in hand, growing old together.\n\nYours,`,
      `To my {recipient},\n\nIf life were only like our first meeting, why would autumn fans bring sorrow? {years} years have passed, yet you remain as you were - clear eyes, gentle smile.\n\nRemember? {keywords}. On that day, spring blossomed in my world.\n\nYou are the poem I never tire of reading, the song that moves me every time. Meeting you was the most beautiful encounter of my life.\n\nTo have one heart, never to part till white hair.\n\nYours,`,
      `{recipient},\n\nTrees have their branches, my heart has you. {years} years, some words I\'ve kept deep inside.\n\n{keywords} - that moment sealed our fate. You are the reunion of five hundred past-life glances.\n\nAll things in this world have an end, but my love for you has none. I\'d pluck stars for you, paint rainbows for you.\n\nThrough life and death, I\'ll hold your hand.\n\nYours,`,
    ],
  },
  humorous: {
    zh: [
      `嘿 {recipient}：\n\n{years}年了，你还没厌倦我？真是奇迹！好吧，我也承认，你还挺有意思的。\n\n还记得{keywords}吗？我当时就想："这个人好像还不错"，后来发现你不仅不错，简直是完美。\n\n和你在一起的日子，我从一个正常的人变成了一个整天傻笑的人。朋友圈都以为我中了彩票，其实是中了你的毒。\n\n谢谢你容忍我的臭脾气、坏习惯和偶尔的脑洞大开。作为回报，我决定永远不让你后悔选择了我。\n\n爱你的（虽然你有时候真的很烦人）`,
      `{recipient}：\n\n我写这封信是因为{years}年了，你值得一封正式的感谢信。感谢你没有在我犯错的时候离开，感谢你容忍我。\n\n{keywords}，那是我们最开始的样子——两个不太完美的人，莫名其妙地走到了一起。\n\n现在你变成了我的起床气安抚者、心情调节器和永远的避风港。而我，变成了一个更有趣的人（至少我妈这么说）。\n\n继续保持，不要退货哦。\n\n你的专属麻烦精`,
      `嗨 {recipient}：\n\n{years}年了！说真的，我也没想到我们能撑这么久。你真的很有耐心。\n\n还记得{keywords}吗？那时候我还是个冷静理智的人，现在呢？看到你就变成傻子。\n\n朋友都说我变傻了，我说这是爱情的力量。其实就是被你传染的。\n\n不管怎样，谢谢你选中了我。我保证继续做你的头号粉丝和终身损友。\n\n永远在你身边的（虽然有时候会迟到）`,
    ],
    en: [
      `Hey {recipient},\n\n{years} years and you still haven\'t gotten tired of me? What a miracle! Well, I have to admit, you\'re pretty amazing.\n\nRemember {keywords}? I thought to myself, "This person seems okay," then discovered you\'re not just okay - you\'re perfect.\n\nSince being with you, I\'ve gone from a normal person to one who giggles all day. My friends think I won the lottery, but it\'s just your influence.\n\nThanks for tolerating my bad temper, weird habits, and occasional brain farts. In return, I promise to never let you regret choosing me.\n\nLove you (even when you\'re really annoying),`,
      `{recipient},\n\nI\'m writing this because {years} years in, you deserve a proper thank-you. Thanks for not leaving when I messed up, thanks for putting up with me.\n\n{keywords} - that was us at the beginning: two imperfect people who somehow ended up together.\n\nNow you\'ve become my morning-soother, mood-adjuster, and safe harbor. And I? I\'ve become a more interesting person (at least my mom says so).\n\nKeep it up. No returns allowed.\n\nYour personal troublemaker,`,
      `Hi {recipient},\n\n{years} years! Honestly, I never thought we\'d last this long. You\'re really patient.\n\nRemember {keywords}? I used to be calm and rational. Now? I turn into an idiot whenever I see you.\n\nMy friends say I\'ve lost it. I say it\'s the power of love. Really, it\'s just your fault.\n\nAnyway, thanks for picking me. I promise to keep being your #1 fan and lifelong partner in crime.\n\nForever by your side (though sometimes late),`,
    ],
  },
  sincere: {
    zh: [
      `{recipient}：\n\n我想认真地写这封信。{years}年了，有很多话想对你说。\n\n谢谢你。谢谢你出现在我的生命里，谢谢你陪我走过这么多日子。{keywords}——那些时刻，是我人生中最珍贵的回忆。\n\n我不是一个很会说甜言蜜语的人，但我想让你知道：和你在一起的每一天，我都很幸福。\n\n你让我变得更好，让我看到了世界更美好的一面。你的善良、你的坚强、你的笑容，都在默默改变着我。\n\n我承诺，无论顺境逆境，我都会陪在你身边。不是因为义务，而是因为我想。\n\n我爱你。\n\n你的`,
      `亲爱的 {recipient}：\n\n写下这封信的时候，我心里很平静，也很充实。{years}年了，我们一起经历了很多。\n\n{keywords}，那些画面历历在目。我想让你知道，每一个和你在一起的时刻，我都在认真珍惜。\n\n你说过，爱是在一起吃很多很多顿饭。我想补充：爱是在一起度过很多很多个平凡的日子。\n\n谢谢你成为我的日常。谢谢你让平凡变得美好。\n\n我会一直在。\n\n你的`,
      `{recipient}：\n\n有些话放在心里很久了，今天想坦白告诉你。\n\n{years}年了，我最想感谢你的，是你让我学会了什么是真正的爱。不是激情澎湃，而是细水长流。\n\n{keywords}——那一刻，我就确定了，你是我想要共度一生的人。\n\n我可能不会是最浪漫的人，但我会是最真诚的人。我可能不会说很多情话，但我会用每一天来证明。\n\n余生很长，请多指教。\n\n你的`,
    ],
    en: [
      `{recipient},\n\nI want to write this letter seriously. {years} years, and there\'s so much I want to say.\n\nThank you. Thank you for being in my life, for walking beside me through all these days. {keywords} - those moments are my most cherished memories.\n\nI\'m not good with sweet words, but I want you to know: every day with you makes me happy.\n\nYou make me a better person. Your kindness, your strength, your smile - they quietly change me every day.\n\nI promise, through good times and bad, I will stand by you. Not out of obligation, but because I want to.\n\nI love you.\n\nYours,`,
      `Dear {recipient},\n\nWriting this letter, my heart feels peaceful and full. {years} years have passed, we\'ve experienced so much together.\n\n{keywords} - those images are vivid in my mind. I want you to know I cherish every moment with you.\n\nYou once said love is about sharing many meals together. I\'d add: love is about sharing many ordinary days together.\n\nThank you for being my ordinary. Thank you for making ordinary beautiful.\n\nI\'ll always be here.\n\nYours,`,
      `{recipient},\n\nThere are words I\'ve held in my heart for a long time. Today, I want to be honest with you.\n\n{years} years. What I\'m most grateful for is that you taught me what real love is. Not passionate waves, but a steady current.\n\n{keywords} - in that moment, I knew you were the one I wanted to spend my life with.\n\nI may not be the most romantic person, but I will be the most sincere. I may not say many sweet words, but I will prove it every day.\n\nLife is long. Please keep teaching me.\n\nYours,`,
    ],
  },
};

const ACRISTIC_POEMS: Record<Style, string[]> = {
  romantic: [
    '你的名字是我诗的开头，',
    '爱是心底最温柔的涟漪，',
    '每一天都因你而不同，',
    '永远在你身边，从不厌倦。',
  ],
  poetic: [
    '愿以此生共韶华，',
    '爱意如水润心田，',
    '年年岁岁情不变，',
    '生生世世永相随。',
  ],
  humorous: [
    '你是我的小可爱，',
    '爱你像爱玩手机，',
    '每天都要见一面，',
    '不然我就耍赖皮。',
  ],
  sincere: [
    '你是我最好的遇见，',
    '爱你不需要理由，',
    '每一个平凡的日子，',
    '都因有你而闪光。',
  ],
};

function interpolate(template: string, recipient: string, years: string, keywords: string): string {
  let result = template;
  if (recipient) result = result.replace('{recipient}', recipient);
  else result = result.replace('{recipient}', '');
  if (years) result = result.replace('{years}', years);
  else result = result.replace('{years}', '');
  if (keywords) result = result.replace('{keywords}', keywords);
  else result = result.replace('{keywords}', '');
  return result;
}

export default function LoveLetterGenerator({ locale = 'zh' }: LoveLetterGeneratorProps) {
  const t = i18n[locale] || i18n.zh;
  const isRTL = locale === 'ar';

  const [recipient, setRecipient] = useState('');
  const [years, setYears] = useState('');
  const [style, setStyle] = useState<Style>('romantic');
  const [keywords, setKeywords] = useState('');
  const [acrostic, setAcrostic] = useState(false);
  const [acrosticWord, setAcrosticWord] = useState('');
  const [letter, setLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [templateIdx, setTemplateIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const templateSet = TEMPLATES[style];
      const tplList = locale === 'en' ? templateSet.en : templateSet.zh;
      const nextIdx = templateIdx + 1 >= tplList.length ? 0 : templateIdx + 1;
      setTemplateIdx(nextIdx);

      let result = interpolate(tplList[templateIdx], recipient, years, keywords);

      if (acrostic) {
        const poems = ACRISTIC_POEMS[style];
        result += '\n\n' + (locale === 'en' ? 'Acrostic:' : '藏头诗：') + '\n';
        if (acrosticWord && acrosticWord.length > 0) {
          const chars = locale === 'zh' ? acrosticWord.split('') : acrosticWord.split('');
          chars.forEach((char, i) => {
            if (poems[i]) {
              result += poems[i] + '\n';
            }
          });
        } else {
          poems.forEach((line) => {
            result += line + '\n';
          });
        }
      }

      setLetter(result.trim());
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = async () => {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !letter) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lines = letter.split('\n');
    const padding = 40;
    const lineHeight = 28;
    const W = 600;
    const H = padding * 2 + lines.length * lineHeight + 60;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#fef3c7');
    gradient.addColorStop(1, '#fce7f3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#7f1d1d';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.resultTitle, W / 2, padding + 20);

    ctx.font = '16px serif';
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + 60 + i * lineHeight);
    });

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Korelyy', W - 10, H - 10);

    const link = document.createElement('a');
    link.download = `love-letter-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center justify-center gap-2">
          <Heart className="text-pink-500" size={28} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.recipientLabel}</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={t.recipientPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.yearsLabel}</label>
            <input
              type="text"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder={t.yearsPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition min-h-[44px]"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.styleLabel}</label>
          <div className="grid grid-cols-4 gap-2">
            {(['romantic', 'poetic', 'humorous', 'sincere'] as Style[]).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition min-h-[44px] ${
                  style === s
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {t[`style${s.charAt(0).toUpperCase() + s.slice(1)}` as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.keywordsLabel}</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={t.keywordsPlaceholder}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acrostic}
              onChange={(e) => setAcrostic(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{t.addAcrostic}</span>
          </label>
          {acrostic && (
            <input
              type="text"
              value={acrosticWord}
              onChange={(e) => setAcrosticWord(e.target.value)}
              placeholder={t.acrosticPlaceholder}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition min-h-[44px]"
            />
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">{t.tip}</p>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-bold rounded-xl hover:shadow-xl transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 min-h-[48px]"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              {t.generating}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {t.generate}
            </>
          )}
        </button>
      </div>

      {letter && (
        <>
          <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-6 shadow-sm mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-pink-700 dark:text-pink-400 mb-4">
              <MessageSquare size={16} />
              {t.resultTitle}
            </h3>
            <div
              className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 backdrop-blur-sm"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <p
                className="text-gray-800 dark:text-gray-200 leading-loose whitespace-pre-line"
                style={{ fontFamily: locale === 'zh' ? 'KaiTi, STKaiti, serif' : 'Georgia, serif' }}
              >
                {letter}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[44px] font-medium"
            >
              <RefreshCw size={18} />
              {t.regenerate}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition min-h-[44px] font-medium shadow-md"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={handleExportPng}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition min-h-[44px] font-medium shadow-md"
            >
              <Download size={18} />
              {t.exportPng}
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  );
}