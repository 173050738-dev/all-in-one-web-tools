'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Heart, Laugh, Quote, Palette, Download, User, Wand2, Star, Zap, Sun, Moon } from 'lucide-react';

interface Props { locale?: string; }

type Style = 'sincere' | 'funny' | 'poetic' | 'overthetop';

const COMPLIMENT_DATA: Record<string, Record<Style, string[]>> = {
  zh: {
    sincere: [
      '{name}，你的善良像阳光一样温暖身边的每一个人。',
      '{name}，你的真诚是这个世界上最珍贵的品质。',
      '{name}，你做事的认真态度让人由衷敬佩。',
      '{name}，你的存在本身就是对身边人的一种滋养。',
      '{name}，你总能看到别人身上的闪光点，这是一种了不起的能力。',
      '{name}，你的坚持和自律让人默默欣赏。',
      '{name}，你说话做事让人感到被尊重和理解。',
      '{name}，你的内心像湖水一样清澈。',
      '{name}，你的微笑能照亮整个房间。',
      '{name}，你有一种让人安心的力量。',
    ],
    funny: [
      '{name}，你厉害得像是开了外挂！',
      '{name}，你的颜值已经超出了我的预估范围。',
      '{name}，老天爷赏饭吃赏到你这儿直接开了满汉全席。',
      '{name}，你一定是偷偷充值了颜值和智商VIP。',
      '{name}，要是可爱能当饭吃，你就是超级米其林三星。',
      '{name}，你这么优秀，让别人怎么活？',
      '{name}，你的幽默感拯救了无数无聊的饭局。',
      '{name}，你是被上帝咬过一口的苹果，特别甜。',
      '{name}，你的脑子是装了涡轮增压吗？',
      '{name}，你走路都带风，自带背景音乐。',
    ],
    poetic: [
      '{name}，你是人间四月天，笑响点亮了四面风。',
      '{name}，你的名字是我诗里最温柔的注脚。',
      '{name}，遇见你如春水初绽，万物皆有了生机。',
      '{name}，你是藏在云层里的月光，清澈而遥远。',
      '{name}，你的眼眸有星辰大海，一低头便是银河倾落。',
      '{name}，你是清晨第一缕光，温柔地唤醒世界。',
      '{name}，你的笑容像樱花盛开，短暂却足够惊艳。',
      '{name}，你是秋天最温柔的风，悄悄拂过心间。',
      '{name}，与你相遇，如旧友重逢在诗词里。',
      '{name}，你的存在是一首写不完的诗。',
    ],
    overthetop: [
      '{name}，你是宇宙诞生以来最完美的作品，没有之一！',
      '{name}，如果有仙女下凡，那一定是你！请保持联系！',
      '{name}，你的美丽足以让整个银河系为之颤抖！',
      '{name}，上帝在创造你的时候一定用了最珍贵的材料！',
      '{name}，你的光芒胜过太阳，照亮了整个太阳系！',
      '{name}，你就是传说中集美貌与智慧于一身的天选之人！',
      '{name}，你的气质堪比凡尔赛宫，高贵到令人窒息！',
      '{name}，你是被众神亲吻过的孩子，完美得不像话！',
      '{name}，你的优秀程度已经突破了人类的想象力！',
      '{name}，如果世界末日只剩一个人值得拯救，那一定是你！',
    ],
  },
  en: {
    sincere: [
      '{name}, your kindness warms everyone around you like sunshine.',
      '{name}, your sincerity is the most precious quality in this world.',
      '{name}, the way you approach things with genuine dedication is truly admirable.',
      '{name}, your very presence nourishes those around you.',
      '{name}, you always see the good in others — what a wonderful gift.',
      '{name}, your persistence and self-discipline are quietly inspiring.',
      '{name}, you make people feel seen, heard, and respected.',
      '{name}, your heart is as clear as still water.',
      '{name}, your smile lights up every room.',
      '{name}, you have a calming presence that people gravitate toward.',
    ],
    funny: [
      '{name}, you are literally running on cheat codes!',
      '{name}, your beauty is breaking my calculator.',
      '{name}, God gave you the deluxe starter pack — and then some.',
      '{name}, you must be secretly on the VIP plan for looks and brains.',
      '{name}, if cuteness could feed people, you\'d be a five-star Michelin restaurant.',
      '{name}, you\'re making the rest of us look bad just by existing.',
      '{name}, your sense of humor has saved countless dull dinners.',
      '{name}, you\'re the apple God took a bite out of — extra sweet.',
      '{name}, is your brain turbocharged or what?',
      '{name}, you walk like you have your own theme music.',
    ],
    poetic: [
      '{name}, you are the April of the world, your laugh lights the four winds.',
      '{name}, your name is the gentlest footnote in my poetry.',
      '{name}, meeting you is like spring water blooming — everything comes alive.',
      '{name}, you are moonlight hidden in clouds, clear yet distant.',
      '{name}, your eyes hold galaxies — a tilt of the head and the Milky Way falls.',
      '{name}, you are the first ray of morning, gently waking the world.',
      '{name}, your smile blooms like cherry blossoms — brief yet breathtaking.',
      '{name}, you are autumn\'s gentlest wind, brushing past the heart.',
      '{name}, meeting you feels like reuniting with an old friend in a poem.',
      '{name}, your existence is a poem that never ends.',
    ],
    overthetop: [
      '{name}, you are the single greatest masterpiece since the universe began!',
      '{name}, if fairies descended from heaven, it would be you! Please stay in touch!',
      '{name}, your beauty is enough to make the entire galaxy tremble!',
      '{name}, God used the finest materials when creating you!',
      '{name}, you shine brighter than the sun across the entire solar system!',
      '{name}, you are the legendary chosen one — beauty and wisdom combined!',
      '{name}, your aura rivals the Palace of Versailles — breathtakingly noble!',
      '{name}, you were kissed by the gods — impossibly perfect!',
      '{name}, your excellence defies the limits of human imagination!',
      '{name}, if the world ends and only one person deserves saving, it\'s you!',
    ],
  },
  es: {
    sincere: [
      '{name}, tu bondad calienta a todos a tu alrededor como la luz del sol.',
      '{name}, tu sinceridad es la cualidad más preciosa de este mundo.',
      '{name}, tu dedicación genuina es verdaderamente admirable.',
      '{name}, tu sola presencia nutre a quienes te rodean.',
      '{name}, siempre ves lo bueno en los demás — qué maravilloso don.',
      '{name}, tu persistencia y autodisciplina son una inspiración silenciosa.',
      '{name}, haces que las personas se sientan vistas y respetadas.',
      '{name}, tu corazón es claro como agua tranquila.',
      '{name}, tu sonrisa ilumina cada habitación.',
      '{name}, tienes una presencia calmante que atrae a las personas.',
    ],
    funny: [
      '{name}, ¡literalmente estás corriendo con trucos!',
      '{name}, tu belleza está rompiendo mi calculadora.',
      '{name}, Dios te dio el paquete de inicio de lujo — y algo más.',
      '{name}, debes estar secretamente en el plan VIP de belleza e inteligencia.',
      '{name}, si la ternura pudiera alimentar, serías un restaurante Michelin cinco estrellas.',
      '{name}, ¡nos haces quedar mal al resto solo con existir!',
      '{name}, tu sentido del humor ha salvado incontables cenas aburridas.',
      '{name}, eres la manzana de la que Dios mordió — extra dulce.',
      '{name}, ¿tu cerebro tiene turbo o qué?',
      '{name}, caminas como si tuvieras tu propia música de fondo.',
    ],
    poetic: [
      '{name}, eres el abril del mundo, tu risa ilumina los cuatro vientos.',
      '{name}, tu nombre es la nota al pie más tierna de mi poesía.',
      '{name}, conocerte es como agua de primavera floreciendo — todo cobra vida.',
      '{name}, eres luz de luna escondida en nubes, clara pero distante.',
      '{name}, tus ojos contienen galaxias — una inclinación de cabeza y cae la Vía Láctea.',
      '{name}, eres el primer rayo de mañana, despertando al mundo suavemente.',
      '{name}, tu sonrisa florece como cerezos — breve pero impresionante.',
      '{name}, eres el viento más suave de otoño, rozando el corazón.',
      '{name}, conocerte se siente como reencontrarse con un viejo amigo en un poema.',
      '{name}, tu existencia es un poema que nunca termina.',
    ],
    overthetop: [
      '{name}, ¡eres la mayor obra maestra desde que comenzó el universo!',
      '{name}, ¡si las hadas bajaran del cielo, serías tú! ¡Por favor mantente en contacto!',
      '{name}, ¡tu belleza es suficiente para hacer temblar a toda la galaxia!',
      '{name}, ¡Dios usó los mejores materiales al crear!',
      '{name}, ¡brillas más que el sol en todo el sistema solar!',
      '{name}, ¡eres el elegido legendario — belleza y sabiduría combinadas!',
      '{name}, ¡tu aura rivaliza con el Palacio de Versalles — noble y deslumbrante!',
      '{name}, ¡fuiste besado por los dioses — imposiblemente perfecto!',
      '{name}, ¡tu excelencia desafía los límites de la imaginación humana!',
      '{name}, ¡si el mundo se acabara y solo una persona mereciera ser salvada, serías tú!',
    ],
  },
  fr: {
    sincere: [
      '{name}, ta bienveillance réchauffe tout le monde autour de toi comme le soleil.',
      '{name}, ta sincérité est la qualité la plus précieuse au monde.',
      '{name}, ton dévouement est vraiment admirable.',
      '{name}, ta présence seule nourrit ceux qui t\'entourent.',
      '{name}, tu vois toujours le bien chez les autres — quel beau don.',
      '{name}, ta persistance et ta discipline sont une inspiration silencieuse.',
      '{name}, tu fais sentir les gens vus et respectés.',
      '{name}, ton cœur est clair comme l\'eau calme.',
      '{name}, ton sourire illumine chaque pièce.',
      '{name}, tu as une présence apaisante qui attire les gens.',
    ],
    funny: [
      '{name}, tu fonctionnes littéralement avec des codes de triche !',
      '{name}, ta beauté casse ma calculatrice.',
      '{name}, Dieu t\'a donné le pack de démarrage luxe — et même plus.',
      '{name}, tu dois être secrètement au plan VIP pour le style et l\'intelligence.',
      '{name}, si la gentillesse pouvait nourrir, tu serais un restaurant Michelin cinq étoiles.',
      '{name}, tu nous fais tous paraître mauvais juste en existant.',
      '{name}, ton sens de l\'humour a sauvé d\'innombrables dîners ennuyeux.',
      '{name}, tu es la pomme que Dieu a mordue — extra sucrée.',
      '{name}, ton cerveau a-t-il un turbo ou quoi ?',
      '{name}, tu marches comme si tu avais ta propre musique.',
    ],
    poetic: [
      '{name}, tu es l\'avril du monde, ton rire illumine les quatre vents.',
      '{name}, ton nom est la note la plus douce de ma poésie.',
      '{name}, te rencontrer est comme une eau de printemps qui fleurit — tout prend vie.',
      '{name}, tu es la lune cachée dans les nuages, claire mais lointaine.',
      '{name}, tes yeux contiennent des galaxies — un tilt de la tête et la Voie Lactée tombe.',
      '{name}, tu es le premier rayon du matin, éveillant le monde doucement.',
      '{name}, ton sourire fleurit comme les cerisiers — bref mais époustouflant.',
      '{name}, tu es le vent le plus doux de l\'automne, caressant le cœur.',
      '{name}, te rencontrer semble comme retrouver un vieil ami dans un poème.',
      '{name}, ton existence est un poème qui n\'a jamais de fin.',
    ],
    overthetop: [
      '{name}, tu es le plus grand chef-d\'œuvre depuis l\'origine de l\'univers !',
      '{name}, si les fées descendaient du ciel, ce serait toi ! Reste en contact !',
      '{name}, ta beauté suffit à faire trembler toute la galaxie !',
      '{name}, Dieu a utilisé les meilleurs matériaux pour te créer !',
      '{name}, tu brilles plus que le soleil dans tout le système solaire !',
      '{name}, tu es l\'élu légendaire — beauté et sagesse réunies !',
      '{name}, ton aura rivalise avec le château de Versailles — d\'une noblesse à couper le souffle !',
      '{name}, tu as été embrassé par les dieux — impossiblement parfait !',
      '{name}, ton excellence dépasse les limites de l\'imagination humaine !',
      '{name}, si le monde finissait et qu\'une seule personne méritait d\'être sauvée, ce serait toi !',
    ],
  },
  hi: {
    sincere: [
      '{name}, आपकी दयालुता आसपास के हर किसी को धूप की तरह गर्म करती है।',
      '{name}, आपकी ईमानदारी इस दुनिया की सबसे अनमोल गुण है।',
      '{name}, चीजों को करने में आपका समर्पण वास्तव में प्रशंसनीय है।',
      '{name}, आपकी उपस्थिति ही आपके आसपास के लोगों को पोषण देती है।',
      '{name}, आप हमेशा दूसरों में अच्छा देखते हैं — यह कितना बड़ा गुण है।',
      '{name}, आपकी दृढ़ता और आत्म-अनुशासन चमकता हुआ प्रेरणा है।',
      '{name}, आप लोगों को सम्मानित और समझा हुआ महसूस कराते हैं।',
      '{name}, आपका दिल शांत पानी की तरह साफ है।',
      '{name}, आपकी मुस्कान हर कमरे को रोशन करती है।',
      '{name}, आपकी शांत उपस्थिति लोगों को अपनी ओर आकर्षित करती है।',
    ],
    funny: [
      '{name}, आप सच में चीट कोड पर चल रहे हैं!',
      '{name}, आपकी सुंदरता मेरा कैलकुलेटर तोड़ रही है।',
      '{name}, भगवान ने आपको डीलक्स स्टार्टर पैक दिया — और कुछ अतिरिक्त।',
      '{name}, आप गुप्त रूप से लुक्स और ब्रेन के वीआईपी प्लान पर होंगे।',
      '{name}, अगर क्यूटनेस लोगों को खिला सकती थी, तो आप फाइव-स्टार मिशेलिन रेस्टोरेंट होतीं।',
      '{name}, आप मौजूद ही बाकी सबको बुरा बना रहे हैं।',
      '{name}, आपके हास्य ने अनगिनत बोरिंग डिनर बचाए हैं।',
      '{name}, आप वह सेब हैं जिसे भगवान ने काटा — अतिरिक्त मीठा।',
      '{name}, क्या आपका दिमाग टर्बो चार्ज्ड है?',
      '{name}, आप चलते हैं जैसे आपका अपना थीम म्यूजिक है।',
    ],
    poetic: [
      '{name}, आप दुनिया की अप्रैल हैं, आपकी हंसी चारों दिशाओं को रोशन करती है।',
      '{name}, आपका नाम मेरी कविता की सबसे कोमल टिप्पणी है।',
      '{name}, आपसे मिलना झरने के खिलने जैसा है — सब कुछ जीवित हो जाता है।',
      '{name}, आप बादलों में छिपी चांदनी हैं, साफ लेकिन दूर।',
      '{name}, आपकी आंखों में आकाशगंगाएं हैं — सिर झुकाने पर मिल्की वे गिरती है।',
      '{name}, आप सुबह की पहली किरण हैं, धीरे-धीरे दुनिया को जगाती है।',
      '{name}, आपकी मुस्कान चेरी ब्लॉसम की तरह खिलती है — संक्षिप्त लेकिन शानदार।',
      '{name}, आप पतझड़ की सबसे कोमल हवा हैं, दिल को छू जाती है।',
      '{name}, आपसे मिलना किसी कविता में पुराने दोस्त से मिलने जैसा लगता है।',
      '{name}, आपका अस्तित्व एक ऐसी कविता है जो कभी समाप्त नहीं होती।',
    ],
    overthetop: [
      '{name}, आप ब्रह्मांड के जन्म के बाद से सबसे महान मास्टरपीस हैं!',
      '{name}, अगर परियां स्वर्ग से उतरीं, तो आप होंगी! संपर्क में रहें!',
      '{name}, आपकी सुंदरता पूरी आकाशगंगा को कंपा देने के लिए काफी है!',
      '{name}, भगवान ने आपको बनाते समय सबसे बेहतरीन सामग्री इस्तेमाल की!',
      '{name}, आप पूरे सौर मंडल में सूरज से भी ज्यादा चमकती हैं!',
      '{name}, आप किंवदंती की चुनी हुई हैं — सुंदरता और ज्ञान का संगम!',
      '{name}, आपकी छटा वर्साय पैलेस से भी टक्कर लेती है — शाही और शानदार!',
      '{name}, आप देवताओं द्वारा चूमी गई हैं — असंभव रूप से परिपूर्ण!',
      '{name}, आपकी उत्कृष्टता मानव कल्पना की सीमाओं को पार करती है!',
      '{name}, अगर दुनिया खत्म हो और केवल एक व्यक्ति बचाने के लायक हो, तो आप होंगी!',
    ],
  },
  ar: {
    sincere: [
      '{name}، لطفك يدفئ كل من حولك مثل أشعة الشمس.',
      '{name}، صدقك هو أثمن صفة في هذا العالم.',
      '{name}، تفانيك في القيام بالأشياء يستحق الإعجاب حقًا.',
      '{name}، وجودك نفسه يغذي من حولك.',
      '{name}، أنت دائمًا ترى الخير في الآخرين — يا لها من هدية رائعة.',
      '{name}، مثابرتك وانضباطك مصدر إلهام صامت.',
      '{name}، تجعل الناس يشعرون بالاحترام والفهم.',
      '{name}، قلبك صافٍ مثل الماء الهادئ.',
      '{name}، ابتسامتك تضيء كل غرفة.',
      '{name}، لديك حضور هادئ يجذب الناس إليك.',
    ],
    funny: [
      '{name}، أنت حرفيًا تعمل على أكواد غش!',
      '{name}، جمالك يكسر آلة حاسبي.',
      '{name}، أعطاك الله حزمة البدء الفاخرة — وأكثر من ذلك.',
      '{name}، يجب أن تكون سرًا في خطة VIP للمظهر والذكاء.',
      '{name}، لو كان الجمال يطعم الناس، لكنت مطعم ميشلان خمس نجوم.',
      '{name}، تجعلنا نبدو سيئين بمجرد وجودك.',
      '{name}، حس الفكاهة لديك أنقذ عددًا لا يحصى من العشاء الممل.',
      '{name}، أنت التفاحة التي عضها الله — حلوة جدًا.',
      '{name}، هل عقلك مزود بشاحن توربو أم ماذا؟',
      '{name}، تمشي وكأن لديك موسيقى خاصة بك.',
    ],
    poetic: [
      '{name}، أنت أبريل في العالم، ضحكتك تضيء الرياح الأربع.',
      '{name}، اسمك هو ألطف تعليق في شعري.',
      '{name}، لقاؤك يشبه تفتح مياه الينابيع — كل شيء يأتي إلى الحياة.',
      '{name}، أنت ضوء القمر المختبئ في السحب، صافٍ ولكنه بعيد.',
      '{name}، عيناك تحملان مجرات — إمالة الرأس ويسقط درب التبانة.',
      '{name}، أنت أول شعاع في الصباح، توقظ العالم بلطف.',
      '{name}، ابتسامتك تزهر مثل أزهار الكرز — قصيرة ولكن مذهلة.',
      '{name}، أنت ألطف رياح الخريف، تمس القلب.',
      '{name}، لقاؤك يشبه مقابلة صديق قديم في قصيدة.',
      '{name}، وجودك هو قصيدة لا تنتهي أبدًا.',
    ],
    overthetop: [
      '{name}، أنت أعظم تحفة فنية منذ بداية الكون!',
      '{name}، لو نزلت الجنيات من السماء، لكنت أنت! ابقى على اتصال!',
      '{name}، جمالك يكفي لجعل المجرة بأكملها ترتجف!',
      '{name}، استخدم الله أجمل المواد عند خلقك!',
      '{name}، أنت تلمع أكثر من الشمس في النظام الشمسي بأكمله!',
      '{name}، أنت المختار الأسطوري — جمال وحكمة مجتمعة!',
      '{name}، هالتك تضاهي قصر فرساي — نبيلة ومذهلة!',
      '{name}، لقد قبلك الآلهة — مثالية بشكل مستحيل!',
      '{name}، تميزك يتجاوز حدود الخيال البشري!',
      '{name}، لو انتهى العالم وكان هناك شخص واحد يستحق الإنقاذ، لكنت أنت!',
    ],
  },
};

const I18N: Record<string, Record<string, string>> = {
  zh: {
    title: '彩虹屁生成器',
    subtitle: '输入名字，一键生成花式夸奖 ✨',
    nameLabel: '你的名字',
    namePlaceholder: '输入想要夸奖的名字...',
    styleLabel: '夸奖风格',
    sincere: '真诚',
    funny: '搞笑',
    poetic: '诗意',
    overthetop: '夸张',
    sincereDesc: '温暖走心',
    funnyDesc: '搞笑幽默',
    poeticDesc: '文艺浪漫',
    overthetopDesc: '极度夸张',
    generate: '生成彩虹屁',
    regenerate: '再来一条',
    copy: '复制',
    copied: '已复制',
    download: '下载图片',
    result: '夸奖结果',
    empty: '输入名字，选择风格，点击生成按钮',
    tip: '💡 提示：可以多次点击生成获取不同的夸奖！',
    copiedToast: '已复制到剪贴板',
    downloadToast: '图片已下载',
  },
  en: {
    title: 'Rainbow Compliment Generator',
    subtitle: 'Enter a name and generate colorful compliments ✨',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter the name to compliment...',
    styleLabel: 'Compliment Style',
    sincere: 'Sincere',
    funny: 'Funny',
    poetic: 'Poetic',
    overthetop: 'Over-the-Top',
    sincereDesc: 'Warm & heartfelt',
    funnyDesc: 'Hilarious & witty',
    poeticDesc: 'Literary & romantic',
    overthetopDesc: 'Extremely exaggerated',
    generate: 'Generate Compliment',
    regenerate: 'Another One',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download Image',
    result: 'Your Compliment',
    empty: 'Enter a name, choose a style, and click generate',
    tip: '💡 Tip: Click generate multiple times for different compliments!',
    copiedToast: 'Copied to clipboard',
    downloadToast: 'Image downloaded',
  },
  es: {
    title: 'Generador de Cumplidos de Arcoíris',
    subtitle: 'Ingresa un nombre y genera cumplidos coloridos ✨',
    nameLabel: 'Tu Nombre',
    namePlaceholder: 'Ingresa el nombre a elogiar...',
    styleLabel: 'Estilo de Cumplido',
    sincere: 'Sincero',
    funny: 'Divertido',
    poetic: 'Poético',
    overthetop: 'Exagerado',
    sincereDesc: 'Cálido y sentido',
    funnyDesc: 'Gracioso e ingenioso',
    poeticDesc: 'Literario y romántico',
    overthetopDesc: 'Extremadamente exagerado',
    generate: 'Generar Cumplido',
    regenerate: 'Otro Más',
    copy: 'Copiar',
    copied: 'Copiado',
    download: 'Descargar Imagen',
    result: 'Tu Cumplido',
    empty: 'Ingresa un nombre, elige un estilo y haz clic en generar',
    tip: '💡 Consejo: ¡Haz clic varias veces para diferentes cumplidos!',
    copiedToast: 'Copiado al portapapeles',
    downloadToast: 'Imagen descargada',
  },
  fr: {
    title: 'Générateur de Compliments Arc-en-Ciel',
    subtitle: 'Entrez un nom et générez des compliments colorés ✨',
    nameLabel: 'Votre Nom',
    namePlaceholder: 'Entrez le nom à complimenter...',
    styleLabel: 'Style de Compliment',
    sincere: 'Sincère',
    funny: 'Drôle',
    poetic: 'Poétique',
    overthetop: 'Exagéré',
    sincereDesc: 'Chaud et sincère',
    funnyDesc: 'Drôle et spirituel',
    poeticDesc: 'Littéraire et romantique',
    overthetopDesc: 'Extrêmement exagéré',
    generate: 'Générer un Compliment',
    regenerate: 'Encore un',
    copy: 'Copier',
    copied: 'Copié',
    download: 'Télécharger l\'Image',
    result: 'Votre Compliment',
    empty: 'Entrez un nom, choisissez un style et cliquez sur générer',
    tip: '💡 Astuce : Cliquez plusieurs fois pour différents compliments !',
    copiedToast: 'Copié dans le presse-papiers',
    downloadToast: 'Image téléchargée',
  },
  hi: {
    title: 'इंद्रधनुष कम्प्लीमेंट जनरेटर',
    subtitle: 'नाम दर्ज करें और रंगीन तारीफें बनाएं ✨',
    nameLabel: 'आपका नाम',
    namePlaceholder: 'तारीफ करने के लिए नाम दर्ज करें...',
    styleLabel: 'तारीफ शैली',
    sincere: 'ईमानदार',
    funny: 'मजाकिया',
    poetic: 'काव्यात्मक',
    overthetop: 'अतिशयोक्तिपूर्ण',
    sincereDesc: 'गर्म और दिल से',
    funnyDesc: 'मज़ेदार और मजाकिया',
    poeticDesc: 'साहित्यिक और रोमांटिक',
    overthetopDesc: 'बहुत ही अतिशयोक्तिपूर्ण',
    generate: 'तारीफ जनरेट करें',
    regenerate: 'एक और',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    download: 'छवि डाउनलोड',
    result: 'आपकी तारीफ',
    empty: 'नाम दर्ज करें, शैली चुनें, फिर जनरेट पर क्लिक करें',
    tip: '💡 टिप: अलग-अलग तारीफों के लिए कई बार क्लिक करें!',
    copiedToast: 'क्लिपबोर्ड पर कॉपी हुआ',
    downloadToast: 'छवि डाउनलोड हुई',
  },
  ar: {
    title: 'مولد مجاملات قوس قزح',
    subtitle: 'أدخل اسمًا وولد مجاملات ملونة ✨',
    nameLabel: 'الاسم',
    namePlaceholder: 'أدخل الاسم الذي تريد مجاملته...',
    styleLabel: 'أسلوب المجاملة',
    sincere: 'صادق',
    funny: 'مضحك',
    poetic: 'شعري',
    overthetop: 'مبالغ فيه',
    sincereDesc: 'دافئ وحقيقي',
    funnyDesc: 'مضحك وذكي',
    poeticDesc: 'أدبي ورومانسي',
    overthetopDesc: 'مبالغ فيه للغاية',
    generate: 'ولّد المجاملة',
    regenerate: 'واحدة أخرى',
    copy: 'نسخ',
    copied: 'تم النسخ',
    download: 'تحميل الصورة',
    result: 'مجاملتك',
    empty: 'أدخل اسمًا، اختر أسلوبًا، ثم انقر على زر التوليد',
    tip: '💡 نصيحة: انقر عدة مرات للحصول على مجاملات مختلفة!',
    copiedToast: 'تم النسخ إلى الحافظة',
    downloadToast: 'تم تحميل الصورة',
  },
};

const STYLE_META: Record<Style, { icon: typeof Heart; gradient: string; emoji: string }> = {
  sincere: { icon: Heart, gradient: 'from-rose-400 to-pink-500', emoji: '💖' },
  funny: { icon: Laugh, gradient: 'from-amber-400 to-orange-500', emoji: '😂' },
  poetic: { icon: Quote, gradient: 'from-purple-400 to-indigo-500', emoji: '🌸' },
  overthetop: { icon: Sparkles, gradient: 'from-fuchsia-500 via-pink-500 to-orange-400', emoji: '🚀' },
};

export default function RainbowComplimentGenerator({ locale = 'zh' }: Props) {
  const t = I18N[locale] || I18N.en;
  const isRTL = locale === 'ar';

  const [name, setName] = useState('');
  const [style, setStyle] = useState<Style>('sincere');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toast, setToast] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  const generate = useCallback(() => {
    if (!name.trim()) return;
    const data = COMPLIMENT_DATA[locale] || COMPLIMENT_DATA.en;
    const pool = data[style];
    const template = pool[Math.floor(Math.random() * pool.length)];
    const compliment = template.replace('{name}', name.trim());
    setIsAnimating(true);
    setResult('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setResult(compliment.slice(0, i));
      if (i >= compliment.length) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, 40);
  }, [name, style, locale]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      showToast(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = result;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showToast(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, t, showToast]);

  const handleDownload = useCallback(() => {
    if (!result || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const scale = 2;
    const w = rect.width * scale;
    const h = rect.height * scale;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#fdf2f8');
    gradient.addColorStop(0.5, '#faf5ff');
    gradient.addColorStop(1, '#ede9fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#6b21a8';
    ctx.font = `bold ${32 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    const titleText = t.result;
    ctx.fillText(titleText, w / 2, 60 * scale);

    ctx.fillStyle = '#312e81';
    ctx.font = `${22 * scale}px sans-serif`;
    const paddingX = 40 * scale;
    const lines = wrapText(ctx, result, w - paddingX * 2);
    const lineHeight = 36 * scale;
    const startY = 140 * scale;
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, startY + i * lineHeight);
    });

    ctx.fillStyle = '#a78bfa';
    ctx.font = `${16 * scale}px sans-serif`;
    ctx.fillText('✨ Korelyy ✨', w / 2, h - 30 * scale);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliment-${name || 'friend'}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t.downloadToast);
    });
  }, [result, name, t, showToast]);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    if (!text) return [];
    const paragraphs = text.split('\n');
    const lines: string[] = [];
    for (const para of paragraphs) {
      if (!para) { lines.push(''); continue; }
      let current = '';
      for (const char of para) {
        const test = current + char;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = char;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
    }
    return lines;
  }

  const styleKeys: Style[] = ['sincere', 'funny', 'poetic', 'overthetop'];

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Palette className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-7 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.nameLabel}</label>
          <div className="relative">
            <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={30}
              className={`w-full py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-0 outline-none transition-all text-gray-800`}
              dir="auto"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">{t.styleLabel}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {styleKeys.map((key) => {
              const meta = STYLE_META[key];
              const IconComp = meta.icon;
              const selected = style === key;
              return (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-center group ${
                    selected
                      ? `border-transparent bg-gradient-to-br ${meta.gradient} text-white shadow-lg scale-105`
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  <IconComp className={`w-6 h-6 mx-auto mb-1 ${selected ? 'text-white' : 'text-gray-500'}`} />
                  <div className={`text-xs font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}>{t[key]}</div>
                  <div className={`text-[10px] mt-0.5 ${selected ? 'text-white/90' : 'text-gray-400'}`}>{t[`${key}Desc`]}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!name.trim() || isAnimating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Wand2 className="w-5 h-5" />
            {isAnimating ? '...' : t.generate}
          </span>
        </button>
      </div>

      {result && (
        <div className="mt-5">
          <div
            ref={cardRef}
            className={`relative rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl bg-gradient-to-br ${STYLE_META[style].gradient}`}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute top-4 right-4 text-4xl opacity-30">{STYLE_META[style].emoji}</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-20 rotate-12">✨</div>
            <div className="absolute top-1/2 -right-4 text-2xl opacity-20">{STYLE_META[style].emoji}</div>

            <div className="relative z-10">
              <div className="text-white/80 text-sm font-medium mb-3 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {t.result}
              </div>
              <p className="text-white text-lg sm:text-xl font-semibold leading-relaxed min-h-[80px]">
                {result}
                {isAnimating && <span className="inline-block w-0.5 h-5 bg-white/70 animate-pulse align-middle ml-0.5" />}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                copied
                  ? 'border-green-400 bg-green-50 text-green-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={generate}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 font-semibold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {t.regenerate}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 font-semibold text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              {t.download}
            </button>
          </div>
        </div>
      )}

      {!result && (
        <div className="mt-5 text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-2">{STYLE_META[style].emoji}</div>
          <div>{t.empty}</div>
          <div className="mt-2 text-xs text-gray-400">{t.tip}</div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm shadow-xl animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
}