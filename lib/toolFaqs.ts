import type { Tool } from '@/data/tools';
import type { SeoLocale } from '@/components/seo';
import { KNOWN_LOCALES } from '@/components/seo';

export type FaqItem = { q: string; a: string };

export type ToolLike =
  | Tool
  | { slug: string; id?: string; name?: string; nameEn?: string; description?: string; descriptionEn?: string };

export type JsonMessages = Record<string, any>;

export type NsTranslator = (key: string) => string;

const FAQ_ORDER = ['free', 'signup', 'privacy', 'device'] as const;
type FaqKey = (typeof FAQ_ORDER)[number];

// 工具特定的FAQ（高潜力工具）
const TOOL_FAQ_I18N: Record<string, Record<SeoLocale, Array<{ q: string; a: string }>>> = {
  'emoji-mixer': {
    en: [
      { q: 'Can I combine any two emojis?', a: 'Yes, you can mix any standard Unicode emojis. Our algorithm blends colors and features intelligently for the best visual result.' },
      { q: 'How many emoji combinations are possible?', a: 'Over 10,000 unique combinations! Mix faces, animals, food, objects and more for endless creative possibilities.' },
      { q: 'Can I download my emoji mix?', a: 'Yes, you can download your custom emoji as a PNG image with transparent background, perfect for messaging apps and social media.' },
    ],
    zh: [
      { q: '可以组合任意两个表情符号吗？', a: '是的，你可以混合任意标准 Unicode 表情符号。我们的算法会智能融合颜色和特征，呈现最佳视觉效果。' },
      { q: '有多少种表情组合可能？', a: '超过 10,000 种独特组合！混合人脸、动物、食物、物品等，创意无限。' },
      { q: '可以下载我的表情混合结果吗？', a: '是的，你可以将自定义表情下载为带透明背景的 PNG 图片，非常适合聊天软件和社交媒体使用。' },
    ],
    es: [
      { q: '¿Puedo combinar cualquier emoji?', a: 'Sí, puedes mezclar cualquier emoji estándar Unicode. Nuestro algoritmo fusiona colores y características inteligentemente para el mejor resultado visual.' },
      { q: '¿Cuántas combinaciones de emoji son posibles?', a: '¡Más de 10.000 combinaciones únicas! Mezcla caras, animales, comida, objetos y más para posibilidades creativas infinitas.' },
      { q: '¿Puedo descargar mi mezcla de emojis?', a: 'Sí, puedes descargar tu emoji personalizado como imagen PNG con fondo transparente, ideal para aplicaciones de mensajería y redes sociales.' },
    ],
    fr: [
      { q: 'Puis-je combiner n\'importe quels emojis ?', a: 'Oui, vous pouvez mélanger n\'importe quels emojis Unicode standard. Notre algorithme fusionne intelligemment les couleurs et les caractéristiques pour le meilleur résultat visuel.' },
      { q: 'Combien de combinaisons emoji sont possibles ?', a: 'Plus de 10 000 combinaisons uniques ! Mélangez des visages, des animaux, de la nourriture, des objets et plus encore pour des possibilités créatives infinies.' },
      { q: 'Puis-je télécharger mon mélange d\'emojis ?', a: 'Oui, vous pouvez télécharger votre emoji personnalisé en PNG avec fond transparent, parfait pour les applications de messagerie et les réseaux sociaux.' },
    ],
    hi: [
      { q: 'क्या मैं किसी भी दो इमोजी को मिला सकता हूँ?', a: 'हाँ, आप किसी भी मानक यूनिकोड इमोजी को मिला सकते हैं। हमारा एल्गोरिदम सबसे अच्छा दृश्य परिणाम पाने के लिए चतुराई से रंगों और विशेषताओं को मिलाता है।' },
      { q: 'कितने इमोजी संयोजन संभव हैं?', a: '10,000 से अधिक अनोखे संयोजन! चेहरों, जानवरों, खाने-पीने की चीजों, वस्तुओं और बहुत कुछ को मिलाकर अनंत रचनात्मक संभावनाएँ प्राप्त करें।' },
      { q: 'क्या मैं अपने इमोजी मिश्रण को डाउनलोड कर सकता हूँ?', a: 'हाँ, आप अपने कस्टम इमोजी को पारदर्शी बैकग्राउंड वाली PNG इमेज के रूप में डाउनलोड कर सकते हैं, जो मैसेजिंग ऐप्स और सोशल मीडिया के लिए उत्तम है।' },
    ],
    ar: [
      { q: 'هل يمكنني الجمع بين أي ايموجيين؟', a: 'نعم، يمكنك مزج أي ايموجيين Unicode القياسية. خوارزميتنا تدمج الألوان والسمات بذكاء لأفضل نتيجة بصرية.' },
      { q: 'كم عدد مجموعات الأيموجيين الممكنة؟', a: 'أكثر من 10.000 مزيج فريد! مزج الوجوه والحيوانات والأطعمة والأشياء وغيرها لاحتمالات إبداعية لا نهائية.' },
      { q: 'هل يمكنني تنزيل مزيج الأيموجي الخاص بي؟', a: 'نعم، يمكنك تنزيل الأيموجي المخصص الخاص بك بصيغة PNG مع خلفية شفافة، مثالي لأجهزة المراسلة والوسائط الاجتماعية.' },
    ],
  },
  'markdown-platform-converter': {
    en: [
      { q: 'What is the difference between Markdown on Notion vs Obsidian vs GitHub?', a: 'Notion uses a proprietary Markdown variant with /-commands and inline database properties. Obsidian follows CommonMark closely with wiki-style [[links]]. GitHub uses GitHub Flavored Markdown (GFM) which adds task lists, tables, and strikethrough. Our converter handles all these differences, so you can move content between platforms without broken formatting.' },
      { q: 'Can I convert a full Notion page to GitHub Markdown?', a: 'Yes, paste your Notion-exported or copied Markdown into the converter. It automatically strips Notion-specific syntax like database properties and /-commands, and outputs clean GFM-compatible Markdown ready for GitHub READMEs or issues.' },
      { q: 'Does this tool convert images and links correctly?', a: 'Yes, standard image and link syntax is preserved. Our converter normalizes relative paths where possible and keeps inline image references intact. For platform-specific embed syntax (like Notion embeds), a clean fallback text is generated.' },
    ],
    zh: [
      { q: 'Notion、Obsidian 和 GitHub 的 Markdown 有什么区别？', a: 'Notion 使用专有 Markdown 变体，支持 /-命令和数据库属性。Obsidian 遵循 CommonMark 标准，使用 wiki 风格 [[链接]]。GitHub 使用 GitHub Flavored Markdown（GFM），增加任务列表、表格和删除线。我们的转换器处理所有这些差异，让你在不同平台间迁移内容而不损坏格式。' },
      { q: '可以把完整的 Notion 页面转成 GitHub Markdown 吗？', a: '可以，将 Notion 导出的 Markdown 粘贴到转换器中，它会自动去除 Notion 特有的数据库属性和 /-命令语法，输出干净的 GFM 兼容 Markdown，可直接用于 GitHub README 或 Issue。' },
      { q: '图片和链接能正确转换吗？', a: '可以，标准图片和链接语法会保留。转换器会尽可能规范化相对路径，保持内嵌图片引用完整。对于平台特有的嵌入语法（如 Notion embed），会生成干净的文本回退内容。' },
    ],
    es: [
      { q: '¿Cuál es la diferencia entre Markdown en Notion vs Obsidian vs GitHub?', a: 'Notion usa una variante de Markdown propietaria con comandos / y propiedades de base de datos inline. Obsidian sigue estrechamente CommonMark con [[enlaces]] estilo wiki. GitHub usa GitHub Flavored Markdown (GFM) que añade listas de tareas, tablas y tachado. Nuestro conversor maneja todas estas diferencias para que puedas mover contenido entre plataformas sin formato roto.' },
      { q: '¿Puedo convertir una página completa de Notion a Markdown de GitHub?', a: 'Sí, pega tu Markdown exportado o copiado de Notion en el conversor. Elimina automáticamente la sintaxis específica de Notion como propiedades de base de datos y comandos /, y produce un Markdown limpio compatible con GFM listo para READMEs o issues de GitHub.' },
      { q: '¿Esta herramienta convierte imágenes y enlaces correctamente?', a: 'Sí, la sintaxis estándar de imágenes y enlaces se conserva. Nuestro conversor normaliza rutas relativas cuando es posible y mantiene intactas las referencias de imágenes inline. Para la sintaxis de incrustación específica de la plataforma (como los embeds de Notion), se genera un texto de respaldo limpio.' },
    ],
    fr: [
      { q: 'Quelle est la différence entre Markdown sur Notion vs Obsidian vs GitHub ?', a: 'Notion utilise une variante Markdown propriétaire avec des commandes / et des propriétés de base de données inline. Obsidian suit de près CommonMark avec des [[liens]] de style wiki. GitHub utilise GitHub Flavored Markdown (GFM) qui ajoute des listes de tâches, des tableaux et du texte barré. Notre convertisseur gère toutes ces différences pour que vous puissiez déplacer du contenu entre les plates-formes sans formatage cassé.' },
      { q: 'Puis-je convertir une page Notion complète en Markdown GitHub ?', a: 'Oui, collez votre Markdown exporté ou copié depuis Notion dans le convertisseur. Il supprime automatiquement la syntaxe spécifique à Notion comme les propriétés de base de données et les commandes /, et produit un Markdown propre compatible GFM prêt pour les READMEs ou issues GitHub.' },
      { q: 'Cet outil convertit-il correctement les images et les liens ?', a: 'Oui, la syntaxe standard des images et liens est préservée. Notre convertisseur normalise les chemins relatifs lorsque possible et conserve intactes les références d\'images inline. Pour la syntaxe d\'intégration spécifique à la plate-forme (comme les embeds Notion), un texte de secours propre est généré.' },
    ],
    hi: [
      { q: 'Notion बनाम Obsidian बनाम GitHub में Markdown में क्या अंतर है?', a: 'Notion /-commands और इनलाइन डेटाबेस गुणों के साथ एक मालिकाना Markdown संस्करण का उपयोग करता है। Obsidian विकी-शैली [[links]] के साथ CommonMark का बारीकी से पालन करता है। GitHub GitHub Flavored Markdown (GFM) का उपयोग करता है जो टास्क सूचियों, तालिकाओं और स्ट्राइकथ्रू को जोड़ता है। हमारा कनवर्टर इन सभी अंतरों को संभालता है ताकि आप टूटे हुए फ़ॉर्मेटिंग के बिना प्लेटफ़ॉर्म के बीच सामग्री ले जा सकें।' },
      { q: 'क्या मैं एक पूर्ण Notion पेज को GitHub Markdown में बदल सकता हूँ?', a: 'हाँ, अपने Notion से निर्यातित या कॉपी किए गए Markdown को कनवर्टर में पेस्ट करें। यह स्वचालित रूप से Notion-विशिष्ट सिंटैक्स जैसे डेटाबेस गुणों और /-commands को हटा देता है, और GitHub READMEs या issues के लिए तैयार स्वच्छ GFM-संगत Markdown आउटपुट करता है।' },
      { q: 'क्या यह टूल छवियों और लिंक को सही ढंग से बदलता है?', a: 'हाँ, मानक छवि और लिंक सिंटैक्स संरक्षित है। हमारा कनवर्टर सापेक्ष पथों को सामान्य बनाता है जहाँ संभव हो और इनलाइन छवि संदर्भों को बरकरार रखता है। प्लेटफ़ॉर्म-विशिष्ट एम्बेड सिंटैक्स (जैसे Notion एम्बेड) के लिए, एक स्वच्छ फ़ॉलबैक टेक्स्ट बनाया जाता है।' },
    ],
    ar: [
      { q: 'ما الفرق بين Markdown في Notion مقابل Obsidian مقابل GitHub؟', a: 'تستخدم Notion متغير Markdown خاص مع أوامر / وخصائص قاعدة بيانات مضمنة. تتبع Obsidian CommonMark بشكل وثيق مع [[روابط]] نمط الويكي. تستخدم GitHub GitHub Flavored Markdown (GFM) الذي يضيف قوائم المهام والجداول والتسطير. يتعامل محولنا مع كل هذه الاختلافات حتى تتمكن من نقل المحتوى بين المنصات دون تنسيق مكسور.' },
      { q: 'هل يمكنني تحويل صفحة Notion كاملة إلى Markdown GitHub؟', a: 'نعم، الصق Markdown المُصدَّر أو المنسوخ من Notion في المحول. يقوم تلقائياً بإزالة الصياغة الخاصة بـ Notion مثل خصائص قاعدة البيانات وأوامر /، ويخرج Markdown نظيفاً متوافقاً مع GFM جاهز لـ READMEs أو issues على GitHub.' },
      { q: 'هل تحول هذه الأداة الصور والروابط بشكل صحيح؟', a: 'نعم، يتم الحفاظ على الصياغة القياسية للصور والروابط. يقوم محولنا بتوحيد المسارات النسبية حيثما كان ذلك ممكناً ويحافظ على مراجع الصور المضمنة سليمة. بالنسبة للصياغة المضمنة الخاصة بالمنصة (مثل عمليات تضمين Notion)، يتم إنشاء نص احتياطي نظيف.' },
    ],
  },
  'polyphonic-pinyin-annotator': {
    en: [
      { q: 'What does "polyphonic pinyin" mean?', a: 'Polyphonic characters are Chinese characters that have multiple pronunciations depending on context. For example, 行 can be pronounced as háng (row/business) or xíng (walk/okay). Our annotator automatically detects the correct pronunciation based on the surrounding words and adds the accurate pinyin annotation.' },
      { q: 'Is this tool useful for Chinese learners?', a: 'Yes, it is designed specifically for Chinese language learners who need accurate pinyin annotations for texts with polyphonic characters. Unlike basic pinyin tools that only show one pronunciation, our tool analyzes context to choose the correct one.' },
      { q: 'Can I paste long texts for annotation?', a: 'Yes, you can paste paragraphs or even full articles. The tool processes the entire text and adds pinyin annotations above each character, making it easy to read and learn.' },
    ],
    zh: [
      { q: '多音字拼音标注是什么意思？', a: '多音字是指根据上下文有不同发音的汉字。例如「行」可以读作 háng（行列/行业）或 xíng（行走/可以）。我们的标注器会根据上下文自动检测正确发音，添加准确的拼音标注。' },
      { q: '这个工具对中文学习者有用吗？', a: '是的，它是专门为需要多音字准确拼音标注的中文学习者设计的。与只显示一种发音的普通拼音工具不同，我们的工具会分析上下文选择正确发音。' },
      { q: '可以粘贴长文本进行标注吗？', a: '可以，你可以粘贴段落甚至整篇文章。工具会处理整个文本并在每个汉字上方添加拼音标注，方便阅读和学习。' },
    ],
    es: [
      { q: '¿Qué significa "pinyin polifónico"?', a: 'Los caracteres polifónicos son caracteres chinos que tienen múltiples pronunciaciones según el contexto. Por ejemplo, 行 puede pronunciarse como háng (fila/negocio) o xíng (caminar/está bien). Nuestro anotador detecta automáticamente la pronunciación correcta según las palabras circundantes y agrega la anotación de pinyin precisa.' },
      { q: '¿Esta herramienta es útil para estudiantes de chino?', a: 'Sí, está diseñada específicamente para estudiantes de chino que necesitan anotaciones de pinyin precisas para textos con caracteres polifónicos. A diferencia de las herramientas de pinyin básicas que solo muestran una pronunciación, nuestra herramienta analiza el contexto para elegir la correcta.' },
      { q: '¿Puedo pegar textos largos para anotación?', a: 'Sí, puedes pegar párrafos o incluso artículos completos. La herramienta procesa todo el texto y agrega anotaciones de pinyin sobre cada carácter, lo que facilita la lectura y el aprendizaje.' },
    ],
    fr: [
      { q: 'Que signifie "pinyin polyphonique" ?', a: 'Les caractères polyphoniques sont des caractères chinois qui ont plusieurs prononciations selon le contexte. Par exemple, 行 peut se prononcer háng (rang/entreprise) ou xíng (marcher/d\'accord). Notre annotateur détecte automatiquement la prononciation correcte en fonction des mots environnants et ajoute l\'annotation pinyin précise.' },
      { q: 'Cet outil est-il utile pour les apprenants de chinois ?', a: 'Oui, il est conçu spécifiquement pour les apprenants de chinois qui ont besoin d\'annotations pinyin précises pour les textes contenant des caractères polyphoniques. Contrairement aux outils pinyin de base qui ne montrent qu\'une seule prononciation, notre outil analyse le contexte pour choisir la bonne.' },
      { q: 'Puis-je coller des textes longs pour l\'annotation ?', a: 'Oui, vous pouvez coller des paragraphes ou même des articles complets. L\'outil traite tout le texte et ajoute des annotations pinyin au-dessus de chaque caractère, ce qui facilite la lecture et l\'apprentissage.' },
    ],
    hi: [
      { q: '"पॉलीफोनिक पिनयिन" का क्या मतलब है?', a: 'पॉलीफोनिक अक्षर वे चीनी अक्षर हैं जिनके उच्चारण संदर्भ के आधार पर कई होते हैं। उदाहरण के लिए, 行 को háng (पंक्ति/व्यवसाय) या xíng (चलना/ठीक है) के रूप में उच्चारित किया जा सकता है। हमारा एनोटेटर आसपास के शब्दों के आधार पर सही उच्चारण का स्वचालित रूप से पता लगाता है और सटीक पिनयिन एनोटेशन जोड़ता है।' },
      { q: 'क्या यह टूल चीनी शिक्षार्थियों के लिए उपयोगी है?', a: 'हाँ, यह विशेष रूप से चीनी भाषा शिक्षार्थियों के लिए डिज़ाइन किया गया है जिन्हें पॉलीफोनिक अक्षरों वाले ग्रंथों के लिए सटीक पिनयिन एनोटेशन की आवश्यकता है। बुनियादी पिनयिन टूल्स के विपरीत जो केवल एक उच्चारण दिखाते हैं, हमारा टूल सही चुनने के लिए संदर्भ का विश्लेषण करता है।' },
      { q: 'क्या मैं एनोटेशन के लिए लंबे ग्रंथों को पेस्ट कर सकता हूँ?', a: 'हाँ, आप पैराग्राफ या यहाँ तक कि पूरे लेख भी पेस्ट कर सकते हैं। टूल पूरे ग्रंथ को प्रोसेस करता है और प्रत्येक अक्षर के ऊपर पिनयिन एनोटेशन जोड़ता है, जिससे पढ़ना और सीखना आसान हो जाता है।' },
    ],
    ar: [
      { q: 'ماذا يعني "بينيين متعدد النطق"؟', a: 'الأحرف متعددة النطق هي أحرف صينية لها نطق متعدد حسب السياق. على سبيل المثال، يمكن نطق 行 كـ háng (صف/عمل) أو xíng (يمشي/حسناً). يكتشف المعلق لدينا تلقائياً النطق الصحيح بناءً على الكلمات المحيطة ويضيف شرح البينيين الدقيق.' },
      { q: 'هل هذه الأداة مفيدة لمتعلمي اللغة الصينية؟', a: 'نعم، وهي مصممة خصيصاً لمتعلمي اللغة الصينية الذين يحتاجون إلى شروح بينيين دقيقة للنصوص التي تحتوي على أحرف متعددة النطق. بخلاف أدوات البينيين الأساسية التي تعرض نطقاً واحداً فقط، تحلل أداتنا السياق لاختيار النطق الصحيح.' },
      { q: 'هل يمكنني لصق نصوص طويلة للتعليق؟', a: 'نعم، يمكنك لصق الفقرات أو حتى المقالات الكاملة. تعالج الأداة النص بالكامل وتضيف شروح البينيين فوق كل حرف، مما يسهل القراءة والتعلم.' },
    ],
  },
  'keyword-spinoff-generator': {
    en: [
      { q: 'What is a keyword spinoff in content marketing?', a: 'A keyword spinoff is a creative variation of a core keyword that captures related search intent. For example, from "dog food" you can spin off "homemade dog food recipes", "best dog food for allergies", "cheap dog food delivery", etc. This helps content creators cover more long-tail search terms without starting from scratch.' },
      { q: 'Can this tool generate puns for brand names?', a: 'Yes, the generator includes a pun mode that creates wordplay variations of your keywords. This is useful for brainstorming brand names, campaign slogans, social media hashtags, and viral content hooks.' },
      { q: 'How many keyword variations can I get at once?', a: 'The tool generates up to 20 unique keyword spinoffs per input. You can run it multiple times on the same keyword to get different angles and creative directions.' },
    ],
    zh: [
      { q: '内容营销中的关键词衍生是什么意思？', a: '关键词衍生是从核心关键词出发创造相关变体，捕捉更多搜索意图。例如从「狗粮」可以衍生出「自制狗粮食谱」「过敏狗狗粮推荐」「平价狗粮配送」等，帮助内容创作者覆盖更多长尾搜索词。' },
      { q: '这个工具可以生成品牌名称的谐音梗吗？', a: '可以，生成器包含谐音模式，可以创造关键词的文字游戏变体。这对头脑风暴品牌名、广告口号、社交媒体标签和病毒内容都很有用。' },
      { q: '一次可以生成多少个关键词变体？', a: '工具每次输入最多生成 20 个独特的关键词衍生，你可以对同一个关键词多次运行以获得不同角度和创意方向。' },
    ],
    es: [
      { q: '¿Qué es un spinoff de palabras clave en marketing de contenidos?', a: 'Un spinoff de palabras clave es una variación creativa de una palabra clave principal que captura la intención de búsqueda relacionada. Por ejemplo, de "comida para perros" puedes derivar "recetas caseras de comida para perros", "mejor comida para perros con alergias", "entrega barata de comida para perros", etc. Esto ayuda a los creadores de contenido a cubrir más términos de búsqueda de cola larga sin empezar desde cero.' },
      { q: '¿Esta herramienta puede generar juegos de palabras para nombres de marca?', a: 'Sí, el generador incluye un modo de juego de palabras que crea variaciones de juegos de palabras de tus palabras clave. Esto es útil para lluvia de ideas de nombres de marca, eslóganes de campaña, hashtags de redes sociales y ganchos de contenido viral.' },
      { q: '¿Cuántas variaciones de palabras clave puedo obtener a la vez?', a: 'La herramienta genera hasta 20 spinoffs de palabras clave únicos por entrada. Puedes ejecutarla varias veces con la misma palabra clave para obtener diferentes ángulos y direcciones creativas.' },
    ],
    fr: [
      { q: 'Qu\'est-ce qu\'un spinoff de mot-clé dans le marketing de contenu ?', a: 'Un spinoff de mot-clé est une variation créative d\'un mot-clé principal qui capture l\'intention de recherche associée. Par exemple, à partir de "nourriture pour chien", vous pouvez décliner "recettes de nourriture pour chien faites maison", "meilleure nourriture pour chien pour les allergies", "livraison de nourriture pour chien bon marché", etc. Cela aide les créateurs de contenu à couvrir plus de termes de recherche longue traîne sans partir de zéro.' },
      { q: 'Cet outil peut-il générer des jeux de mots pour les noms de marque ?', a: 'Oui, le générateur comprend un mode jeu de mots qui crée des variations de jeux de mots de vos mots-clés. Ceci est utile pour le brainstorming de noms de marque, slogans de campagne, hashtags de médias sociaux et accroches de contenu viral.' },
      { q: 'Combien de variations de mots-clés puis-je obtenir à la fois ?', a: 'L\'outil génère jusqu\'à 20 spinoffs de mots-clés uniques par entrée. Vous pouvez l\'exécuter plusieurs fois sur le même mot-clé pour obtenir des angles et directions créatives différentes.' },
    ],
    hi: [
      { q: 'सामग्री विपणन में कीवर्ड स्पिनऑफ क्या है?', a: 'एक कीवर्ड स्पिनऑफ एक मुख्य कीवर्ड का रचनात्मक रूपांतर है जो संबंधित खोज इरादे को पकड़ता है। उदाहरण के लिए, "dog food" से आप "homemade dog food recipes", "best dog food for allergies", "cheap dog food delivery" आदि बना सकते हैं। यह सामग्री निर्माताओं को खरोंच से शुरू किए बिना अधिक लंबे-पूंछ खोज शब्दों को कवर करने में मदद करता है।' },
      { q: 'क्या यह टूल ब्रांड नामों के लिए श्लेष उत्पन्न कर सकता है?', a: 'हाँ, जेनरेटर में एक श्लेष मोड शामिल है जो आपके कीवर्ड्स के शब्दplay रूपांतर बनाता है। यह ब्रांड नामों, अभियान नारों, सोशल मीडिया हैशटैग और वायरल सामग्री हुक के ब्रेनस्टॉर्मिंग के लिए उपयोगी है।' },
      { q: 'एक बार में कितने कीवर्ड रूपांतर प्राप्त कर सकता हूँ?', a: 'टूल प्रत्येक इनपुट के लिए अधिकतम 20 अद्वितीय कीवर्ड स्पिनऑफ़ उत्पन्न करता है। आप विभिन्न कोण और रचनात्मक दिशाएँ प्राप्त करने के लिए एक ही कीवर्ड पर कई बार चला सकते हैं।' },
    ],
    ar: [
      { q: 'ما هو سبينوف الكلمة المفتاحية في تسويق المحتوى؟', a: 'سبينوف الكلمة المفتاحية هو تباين إبداعي للكلمة المفتاحية الأساسية الذي يلتقط نية البحث ذات الصلة. على سبيل المثال، من "طعام الكلاب" يمكنك اشتقاق "وصفات طعام الكلاب المنزلية"، "أفضل طعام للكلاب المصابة بالحساسية"، "توصيل طعام الكلاب الرخيص"، إلخ. هذا يساعد منشئي المحتوى على تغطية المزيد من مصطلحات البحث الطويلة دون البدء من الصفر.' },
      { q: 'هل يمكن لهذه الأداة توليد ألعاب كلمات لأسماء العلامات التجارية؟', a: 'نعم، يتضمن المولد وضع لعب بالكلمات الذي يخلق تباينات لعب بالكلمات لكلماتك المفتاحية. هذا مفيد للعصف الذهني لأسماء العلامات التجارية، وشعارات الحملة، وهاشتاجات الوسائط الاجتماعية، وخطافات المحتوى الفيروسي.' },
      { q: 'كم عدد تباينات الكلمات المفتاحية التي يمكنني الحصول عليها في وقت واحد؟', a: 'تولد الأداة حتى 20 سبينوف فريد للكلمات المفتاحية لكل إدخال. يمكنك تشغيلها عدة مرات على نفس الكلمة المفتاحية للحصول على زوايا واتجاهات إبداعية مختلفة.' },
    ],
  },
  'caption-generator': {
    en: [
      { q: 'What types of social media captions can I generate?', a: 'You can generate captions for Instagram, TikTok, Twitter/X, LinkedIn, and Facebook. Each platform has optimized tone and length — short and punchy for TikTok, professional for LinkedIn, hashtag-rich for Instagram.' },
      { q: 'Can I customize the tone of the generated captions?', a: 'Yes, you can choose from casual, professional, funny, inspirational, or promotional tones. The generator adapts the vocabulary and sentence structure to match your chosen style.' },
      { q: 'Are the captions original or recycled from templates?', a: 'Every caption is generated fresh based on your input topic and selected tone. The tool uses a large vocabulary pool and sentence patterns to ensure variety, not cookie-cutter templates.' },
    ],
    zh: [
      { q: '可以生成哪些社交媒体的文案？', a: '可以生成 Instagram、TikTok、Twitter/X、LinkedIn 和 Facebook 的文案。每种平台都有优化的语气和长度——TikTok 简短有力，LinkedIn 专业正式，Instagram 配标签丰富。' },
      { q: '可以自定义文案的语气吗？', a: '可以，你可以选择随意、专业、幽默、励志或促销等语气。生成器会根据你选择的风格调整词汇和句式结构。' },
      { q: '生成的文案是原创还是套模板？', a: '每条文案都是根据你输入的主题和选择语气新鲜生成的，不是套用模板。工具使用大量词汇库和句式模式确保多样性。' },
    ],
    es: [
      { q: '¿Qué tipos de subtítulos de redes sociales puedo generar?', a: 'Puedes generar subtítulos para Instagram, TikTok, Twitter/X, LinkedIn y Facebook. Cada plataforma tiene un tono y longitud optimizados — cortos y contundentes para TikTok, profesionales para LinkedIn, ricos en hashtags para Instagram.' },
      { q: '¿Puedo personalizar el tono de los subtítulos generados?', a: 'Sí, puedes elegir entre tonos casuales, profesionales, divertidos, inspiradores o promocionales. El generador adapta el vocabulario y la estructura de oraciones para que coincidan con tu estilo elegido.' },
      { q: '¿Los subtítulos son originales o reciclados de plantillas?', a: 'Cada subtítulo se genera fresco según tu tema de entrada y tono seleccionado. La herramienta utiliza un gran vocabulario y patrones de oraciones para garantizar variedad, no plantillas de corte genérico.' },
    ],
    fr: [
      { q: 'Quels types de légendes de médias sociaux puis-je générer ?', a: 'Vous pouvez générer des légendes pour Instagram, TikTok, Twitter/X, LinkedIn et Facebook. Chaque plate-forme a un ton et une longueur optimisés — courts et percutants pour TikTok, professionnels pour LinkedIn, riches en hashtags pour Instagram.' },
      { q: 'Puis-je personnaliser le ton des légendes générées ?', a: 'Oui, vous pouvez choisir parmi des tons décontractés, professionnels, drôles, inspirants ou promotionnels. Le générateur adapte le vocabulaire et la structure des phrases pour correspondre à votre style choisi.' },
      { q: 'Les légendes sont-elles originales ou recyclées à partir de modèles ?', a: 'Chaque légende est générée fraîchement en fonction de votre sujet d\'entrée et du ton sélectionné. L\'outil utilise un grand pool de vocabulaire et de modèles de phrases pour garantir la variété, pas des modèles génériques.' },
    ],
    hi: [
      { q: 'मैं किस प्रकार के सोशल मीडिया कैप्शन बना सकता हूँ?', a: 'आप Instagram, TikTok, Twitter/X, LinkedIn और Facebook के लिए कैप्शन बना सकते हैं। प्रत्येक प्लेटफ़ॉर्म के लिए अनुकूलित टोन और लंबाई है — TikTok के लिए छोटे और प्रभावशाली, LinkedIn के लिए पेशेवर, Instagram के लिए हैशटैग-समृद्ध।' },
      { q: 'क्या मैं बनाए गए कैप्शन के टोन को कस्टमाइज़ कर सकता हूँ?', a: 'हाँ, आप कैज़ुअल, पेशेवर, मज़ेदार, प्रेरणादायक या प्रोमोशनल टोन में से चुन सकते हैं। जेनरेटर आपकी चुनी हुई शैली से मेल खाने के लिए शब्दावली और वाक्य संरचना को अनुकूलित करता है।' },
      { q: 'क्या कैप्शन मूल हैं या टेम्पलेट्स से रीसाइकल किए गए हैं?', a: 'प्रत्येक कैप्शन आपके इनपुट विषय और चुने हुए टोन के आधार पर ताज़ा बनाया जाता है। टूल विविधता सुनिश्चित करने के लिए बड़े शब्दावली पूल और वाक्य पैटर्न का उपयोग करता है, न कि कुकी-कटर टेम्पलेट्स।' },
    ],
    ar: [
      { q: 'ما هي أنواع التسميات التوضيحية للوسائط الاجتماعية التي يمكنني إنشاؤها؟', a: 'يمكنك إنشاء تسميات توضيحية لـ Instagram و TikTok و Twitter/X و LinkedIn و Facebook. لكل منصة نغمة وطول محسّن — قصيرة ومؤثرة لـ TikTok، احترافية لـ LinkedIn، غنية بالهاشتاجات لـ Instagram.' },
      { q: 'هل يمكنني تخصيص نغمة التسميات التوضيحية التي تم إنشاؤها؟', a: 'نعم، يمكنك الاختيار من بين النغمات العادية أو الاحترافية أو المضحكة أو الملهمة أو الترويجية. يكيف المولد المفردات وبنية الجمل لتتناسب مع أسلوبك المختار.' },
      { q: 'هل التسميات التوضيحية أصلية أم معاد تدويرها من القوالب؟', a: 'يتم إنشاء كل تسمية توضيحية حديثاً بناءً على موضوع الإدخال الخاص بك والنغمة المختارة. تستخدم الأداة مجموعة مفردات كبيرة وأنماط جمل لضمان التنوع، وليس قوالب قطع بسكويت.' },
    ],
  },
  'audio-bpm-detector': {
    en: [
      { q: 'What is BPM in music?', a: 'BPM stands for Beats Per Minute, which measures the tempo of a song. It indicates how many beats occur in one minute. A slow ballad might have 60 BPM, while an upbeat dance track can reach 140 BPM or higher.' },
      { q: 'Can I detect BPM from a YouTube video or streaming audio?', a: 'Yes, you can play any audio source near your device microphone and the detector will analyze the BPM in real-time. For best results, use a direct audio file upload for the most accurate reading.' },
      { q: 'Is this tool accurate for different music genres?', a: 'Yes, the BPM detector works accurately across genres including pop, rock, hip-hop, electronic, classical, and jazz. The algorithm is trained on a wide range of musical styles and handles tempo changes within a song well.' },
    ],
    zh: [
      { q: '音乐的 BPM 是什么？', a: 'BPM 是每分钟节拍数（Beats Per Minute），衡量歌曲速度。慢节奏情歌可能 60 BPM，快节奏舞曲可达 140 BPM 以上。' },
      { q: '可以检测 YouTube 视频或流媒体音频的 BPM 吗？', a: '可以，将任何音频源靠近设备麦克风，检测器会实时分析 BPM。如需最准确结果，直接上传音频文件效果最好。' },
      { q: '不同音乐类型都能准确检测吗？', a: '是的，BPM 检测器在流行、摇滚、嘻哈、电子、古典和爵士等类型中都能准确工作。算法经过多种音乐风格训练，也能较好地处理歌曲内的速度变化。' },
    ],
    es: [
      { q: '¿Qué es el BPM en la música?', a: 'BPM significa Beats Per Minute (pulsos por minuto), que mide el tempo de una canción. Indica cuántos pulsos ocurren en un minuto. Una balada lenta podría tener 60 BPM, mientras que una pista de baile alegre puede alcanzar 140 BPM o más.' },
      { q: '¿Puedo detectar el BPM de un video de YouTube o audio en streaming?', a: 'Sí, puedes reproducir cualquier fuente de audio cerca del micrófono de tu dispositivo y el detector analizará el BPM en tiempo real. Para obtener mejores resultados, usa una carga directa de archivo de audio para la lectura más precisa.' },
      { q: '¿Esta herramienta es precisa para diferentes géneros musicales?', a: 'Sí, el detector de BPM funciona con precisión en géneros que incluyen pop, rock, hip-hop, electrónica, clásica y jazz. El algoritmo está entrenado en una amplia gama de estilos musicales y maneja bien los cambios de tempo dentro de una canción.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que le BPM en musique ?', a: 'BPM signifie Beats Per Minute (battements par minute), qui mesure le tempo d\'une chanson. Il indique combien de battements se produisent en une minute. Une ballade lente pourrait avoir 60 BPM, tandis qu\'un morceau de danse entraînant peut atteindre 140 BPM ou plus.' },
      { q: 'Puis-je détecter le BPM d\'une vidéo YouTube ou d\'un audio en streaming ?', a: 'Oui, vous pouvez lire n\'importe quelle source audio près du microphone de votre appareil et le détecteur analysera le BPM en temps réel. Pour de meilleurs résultats, utilisez un téléchargement direct de fichier audio pour la lecture la plus précise.' },
      { q: 'Cet outil est-il précis pour différents genres musicaux ?', a: 'Oui, le détecteur de BPM fonctionne avec précision dans les genres incluant pop, rock, hip-hop, électronique, classique et jazz. L\'algorithme est entraîné sur un large éventail de styles musicaux et gère bien les changements de tempo au sein d\'une chanson.' },
    ],
    hi: [
      { q: 'संगीत में BPM क्या है?', a: 'BPM का मतलब Beats Per Minute (प्रति मिनट बीट्स) है, जो किसी गीत की गति को मापता है। यह इंगित करता है कि एक मिनट में कितने बीट्स होते हैं। एक धीमी गाथा में 60 BPM हो सकता है, जबकि एक उत्साही नृत्य ट्रैक 140 BPM या अधिक तक पहुंच सकता है।' },
      { q: 'क्या मैं YouTube वीडियो या स्ट्रीमिंग ऑडियो से BPM का पता लगा सकता हूँ?', a: 'हाँ, आप अपने डिवाइस के माइक्रोफोन के पास कोई भी ऑडियो सोर्स चला सकते हैं और डिटेक्टर वास्तविक समय में BPM का विश्लेषण करेगा। सबसे सटीक परिणामों के लिए, सीधी ऑडियो फ़ाइल अपलोड का उपयोग करें।' },
      { q: 'क्या यह टूल विभिन्न संगीत शैलियों के लिए सटीक है?', a: 'हाँ, BPM डिटेक्टर पॉप, रॉक, हिप-हॉप, इलेक्ट्रॉनिक, शास्त्रीय और जैज़ सहित शैलियों में सटीक रूप से काम करता है। एल्गोरिदम विभिन्न संगीत शैलियों पर प्रशिक्षित है और गीत के भीतर गति परिवर्तनों को अच्छी तरह से संभालता है।' },
    ],
    ar: [
      { q: 'ما هو BPM في الموسيقى؟', a: 'BPM تعني Beats Per Minute (نبضات في الدقيقة)، التي تقيس وتيرة الأغنية. تشير إلى عدد النبضات التي تحدث في الدقيقة الواحدة. قد تحتوي القصيدة البطيئة على 60 BPM، بينما يمكن أن يصل مسار الرقص السريع إلى 140 BPM أو أكثر.' },
      { q: 'هل يمكنني اكتشاف BPM من فيديو YouTube أو صوت بث مباشر؟', a: 'نعم، يمكنك تشغيل أي مصدر صوت بالقرب من ميكروفون جهازك وسيقوم الكاشف بتحليل BPM في الوقت الفعلي. للحصول على أفضل النتائج، استخدم تحميل ملف صوت مباشر للحصول على القراءة الأكثر دقة.' },
      { q: 'هل هذه الأداة دقيقة لأنواع الموسيقى المختلفة؟', a: 'نعم، يعمل كاشف BPM بدقة عبر الأنواع بما في ذلك البوب والروك والهيب هوب والإلكترونية والكلاسيكية والجاز. تم تدريب الخوارزمية على مجموعة واسعة من الأساليب الموسيقية وتتعامل مع تغييرات السرعة داخل الأغنية بشكل جيد.' },
    ],
  },
  'regex-tester': {
    en: [
      { q: 'How do I test a regex pattern against multiple strings?', a: 'Enter your regex pattern in the top field and add multiple test strings separated by new lines in the test area. The tool highlights matches in real-time and shows capture groups. You can also toggle flags like global (/g), case-insensitive (/i), and multiline (/m).' },
      { q: 'What regex flavors does this tester support?', a: 'This tester uses JavaScript/ECMAScript regex syntax, which covers most common patterns used in web development. It supports lookahead/lookbehind assertions, named capture groups, and Unicode property escapes.' },
      { q: 'Can I save and share my regex patterns?', a: 'Yes, you can save patterns to your browser local storage and come back to them later. You can also copy the regex as a shareable URL to send to colleagues.' },
    ],
    zh: [
      { q: '如何测试一个正则表达式对多个字符串的匹配？', a: '在顶部输入框输入正则表达式，在测试区域逐行输入多个测试字符串。工具会实时高亮匹配结果并显示捕获组。你也可以切换全局（/g）、不区分大小写（/i）、多行（/m）等标志。' },
      { q: '这个测试器支持哪些正则风格？', a: '本工具使用 JavaScript/ECMAScript 正则语法，涵盖 Web 开发中最常用的模式。支持正向/反向预查、命名捕获组和 Unicode 属性转义。' },
      { q: '可以保存和分享正则表达式吗？', a: '可以，将模式保存到浏览器本地存储，稍后可回来继续使用。也可以将正则复制为可分享的 URL 发送给同事。' },
    ],
    es: [
      { q: '¿Cómo pruebo un patrón regex contra múltiples cadenas?', a: 'Ingresa tu patrón regex en el campo superior y agrega múltiples cadenas de prueba separadas por líneas nuevas en el área de prueba. La herramienta resalta las coincidencias en tiempo real y muestra los grupos de captura. También puedes activar banderas como global (/g), sin distinguir mayúsculas (/i) y multilinea (/m).' },
      { q: '¿Qué variantes de regex admite este probador?', a: 'Este probador usa sintaxis regex de JavaScript/ECMAScript, que cubre la mayoría de los patrones comunes usados en desarrollo web. Admite aserciones de mira hacia adelante/mira hacia atrás, grupos de captura con nombre y escapes de propiedades Unicode.' },
      { q: '¿Puedo guardar y compartir mis patrones regex?', a: 'Sí, puedes guardar patrones en el almacenamiento local de tu navegador y volver a ellos más tarde. También puedes copiar el regex como URL compartible para enviar a colegas.' },
    ],
    fr: [
      { q: 'Comment tester un modèle regex contre plusieurs chaînes ?', a: 'Entrez votre modèle regex dans le champ supérieur et ajoutez plusieurs chaînes de test séparées par des sauts de ligne dans la zone de test. L\'outil met en évidence les correspondances en temps réel et affiche les groupes de capture. Vous pouvez également activer les drapeaux comme global (/g), insensible à la casse (/i) et multiligne (/m).' },
      { q: 'Quelles variantes de regex ce testeur prend-il en charge ?', a: 'Ce testeur utilise la syntaxe regex JavaScript/ECMAScript, qui couvre la plupart des modèles courants utilisés dans le développement web. Il prend en charge les assertions lookahead/lookbehind, les groupes de capture nommés et les échappements de propriétés Unicode.' },
      { q: 'Puis-je enregistrer et partager mes modèles regex ?', a: 'Oui, vous pouvez enregistrer les modèles dans le stockage local de votre navigateur et y revenir plus tard. Vous pouvez également copier le regex sous forme d\'URL partageable à envoyer à vos collègues.' },
    ],
    hi: [
      { q: 'मैं कई स्ट्रिंग्स के खिलाफ regex पैटर्न का परीक्षण कैसे करूँ?', a: 'ऊपरी फ़ील्ड में अपना regex पैटर्न दर्ज करें और टेस्ट एरिया में नई लाइनों से अलग किए गए कई टेस्ट स्ट्रिंग्स जोड़ें। टूल वास्तविक समय में मैचों को हाइलाइट करता है और कैप्चर ग्रुप दिखाता है। आप ग्लोबल (/g), केस-असंवेदी (/i), और मल्टीलाइन (/m) जैसे फ्लैग भी टॉगल कर सकते हैं।' },
      { q: 'यह टेस्टर कौन से regex फ्लेवर्स का समर्थन करता है?', a: 'यह टेस्टर JavaScript/ECMAScript regex सिंटैक्स का उपयोग करता है, जो वेब डेवलपमेंट में उपयोग किए जाने वाले अधिकांश सामान्य पैटर्न को कवर करता है। यह lookahead/lookbehind assertions, नामित कैप्चर ग्रुप और Unicode प्रॉपर्टी एस्केप का समर्थन करता है।' },
      { q: 'क्या मैं अपने regex पैटर्न को सहेज और साझा कर सकता हूँ?', a: 'हाँ, आप पैटर्न को अपने ब्राउज़र के लोकल स्टोरेज में सहेज सकते हैं और बाद में उन पर वापस आ सकते हैं। आप regex को साझा करने योग्य URL के रूप में भी कॉपी कर सकते हैं ताकि सहकर्मियों को भेज सकें।' },
    ],
    ar: [
      { q: 'كيف أختبر نمط regex مقابل سلاسل متعددة؟', a: 'أدخل نمط regex الخاص بك في الحقل العلوي وأضف سلاسل اختبار متعددة مفصولة بأسطر جديدة في منطقة الاختبار. تقوم الأداة بتسليط الضوء على المطابقات في الوقت الفعلي وتعرض مجموعات الالتقاط. يمكنك أيضاً تبديل الإعلامات مثل global (/g) و case-insensitive (/i) و multilinea (/m).' },
      { q: 'ما أنماط regex التي يدعمها هذا المختبر؟', a: 'يستخدم هذا المختبر صياغة regex لـ JavaScript/ECMAScript، التي تغطي معظم الأنماط الشائعة المستخدمة في تطوير الويب. يدعم تأكيدات lookahead/lookbehind ومجموعات الالتقاط المسماة وهروب خصائص Unicode.' },
      { q: 'هل يمكنني حفظ ومشاركة أنماط regex الخاصة بي؟', a: 'نعم، يمكنك حفظ الأنماط في التخزين المحلي لمتصفحك والعودة إليها لاحقاً. يمكنك أيضاً نسخ regex كعنوان URL قابل للمشاركة لإرساله إلى الزملاء.' },
    ],
  },
  'case-converter': {
    en: [
      { q: 'What text case formats are available?', a: 'The converter supports uppercase, lowercase, title case, sentence case, camelCase, PascalCase, kebab-case, snake_case, and alternating case. Each format is explained with examples so you can pick the right one for your use case.' },
      { q: 'Can I convert a list of words or lines at once?', a: 'Yes, paste multiple lines and each line is converted independently. This is useful for converting variable names, file names, or list items in bulk.' },
      { q: 'Is this tool useful for programming variable naming?', a: 'Absolutely. Developers often need to convert between camelCase (JavaScript variables), snake_case (Python/PHP), and kebab-case (CSS class names/URLs). Our tool makes this conversion instant.' },
    ],
    zh: [
      { q: '支持哪些文本格式转换？', a: '支持大写、小写、标题首字母大写、句首大写、驼峰式（camelCase）、帕斯卡式（PascalCase）、连字符式（kebab-case）、下划线式（snake_case）和交替大小写。每种格式都有示例说明。' },
      { q: '可以批量转换多行文本吗？', a: '可以，粘贴多行文本，每行会独立转换。这对批量转换变量名、文件名或列表项非常有用。' },
      { q: '这个工具对编程变量命名有用吗？', a: '非常有用。开发者经常需要在 camelCase（JavaScript 变量）、snake_case（Python/PHP）和 kebab-case（CSS 类名/URL）之间转换。本工具让转换瞬间完成。' },
    ],
    es: [
      { q: '¿Qué formatos de mayúsculas/minúsculas de texto están disponibles?', a: 'El conversor admite mayúsculas, minúsculas, formato título, formato oración, camelCase, PascalCase, kebab-case, snake_case y formato alterno. Cada formato se explica con ejemplos para que puedas elegir el adecuado para tu caso de uso.' },
      { q: '¿Puedo convertir una lista de palabras o líneas a la vez?', a: 'Sí, pega varias líneas y cada línea se convierte independientemente. Esto es útil para convertir nombres de variables, nombres de archivos o elementos de lista en masa.' },
      { q: '¿Esta herramienta es útil para nombrar variables de programación?', a: 'Absolutamente. Los desarrolladores a menudo necesitan convertir entre camelCase (variables JavaScript), snake_case (Python/PHP) y kebab-case (nombres de clases CSS/URLs). Nuestra herramienta hace esta conversión al instante.' },
    ],
    fr: [
      { q: 'Quels formats de casse de texte sont disponibles ?', a: 'Le convertisseur prend en charge les majuscules, les minuscules, la casse titre, la casse phrase, camelCase, PascalCase, kebab-case, snake_case et la casse alternée. Chaque format est expliqué avec des exemples pour que vous puissiez choisir le bon pour votre cas d\' utilisation.' },
      { q: 'Puis-je convertir une liste de mots ou de lignes à la fois ?', a: 'Oui, collez plusieurs lignes et chaque ligne est convertie indépendamment. Ceci est utile pour convertir en masse des noms de variables, des noms de fichiers ou des éléments de liste.' },
      { q: 'Cet outil est-il utile pour la nomination de variables de programmation ?', a: 'Absolument. Les développeurs ont souvent besoin de convertir entre camelCase (variables JavaScript), snake_case (Python/PHP) et kebab-case (noms de classe CSS/URL). Notre outil rend cette conversion instantanée.' },
    ],
    hi: [
      { q: 'कौन से टेक्स्ट केस फ़ॉर्मेट उपलब्ध हैं?', a: 'कनवर्टर uppercase, lowercase, title case, sentence case, camelCase, PascalCase, kebab-case, snake_case, और alternating case को सपोर्ट करता है। प्रत्येक फ़ॉर्मेट को उदाहरणों के साथ समझाया जाता है ताकि आप अपने उपयोग के लिए सही चुन सकें।' },
      { q: 'क्या मैं एक बार में शब्दों या लाइनों की सूची कनवर्ट कर सकता हूँ?', a: 'हाँ, कई लाइनें पेस्ट करें और प्रत्येक लाइन स्वतंत्र रूप से कनवर्ट होती है। यह वेरिएबल नाम, फ़ाइल नाम, या लिस्ट आइटम को बल्क में कनवर्ट करने के लिए उपयोगी है।' },
      { q: 'क्या यह टूल प्रोग्रामिंग वेरिएबल नामकरण के लिए उपयोगी है?', a: 'बिल्कुल। डेवलपर्स को अक्सर camelCase (JavaScript वेरिएबल्स), snake_case (Python/PHP), और kebab-case (CSS क्लास नेम/URLs) के बीच कनवर्ट करने की आवश्यकता होती है। हमारा टूल इस रूपांतरण को तुरंत कर देता है।' },
    ],
    ar: [
      { q: 'ما هي تنسيقات حالة النص المتاحة؟', a: 'يدعم المحول الأحرف الكبيرة، والأحرف الصغيرة، وحالة العنوان، وحالة الجملة، و camelCase، و PascalCase، و kebab-case، و snake_case، والحالة المتنوعة. يتم شرح كل تنسيق مع أمثلة حتى تتمكن من اختيار المناسب لحالة الاستخدام الخاصة بك.' },
      { q: 'هل يمكنني تحويل قائمة الكلمات أو الأسطر في وقت واحد؟', a: 'نعم، الصق عدة أسطر وسيتم تحويل كل سطر بشكل مستقل. هذا مفيد لتحويل أسماء المتغيرات أو أسماء الملفات أو عناصر القائمة بكميات كبيرة.' },
      { q: 'هل هذه الأداة مفيدة لتسمية متغيرات البرمجة؟', a: 'بالتأكيد. يحتاج المطورون غالباً إلى التحويل بين camelCase (متغيرات JavaScript) و snake_case (Python/PHP) و kebab-case (أسماء فئات CSS/URLs). تجعل أداتنا هذا التحويل فورياً.' },
    ],
  },
  'json-formatter': {
    en: [
      { q: 'Is my JSON data ever sent to a server?', a: 'No. All JSON parsing, formatting, and validation happens entirely in your browser. Nothing is uploaded to any server. Your data stays private on your machine.' },
      { q: 'What is the maximum JSON file size I can format?', a: 'The tool can handle files up to several megabytes, limited only by your browser memory. For very large files, we recommend using the tree view instead of full syntax highlighting for better performance.' },
      { q: 'Can I collapse and expand nested JSON objects?', a: 'Yes, the tree view allows you to collapse or expand nested objects and arrays with a single click. This makes it easy to navigate complex JSON structures with hundreds of nested fields.' },
      { q: 'Does this tool validate JSON while I type?', a: 'Yes, real-time validation with error highlighting. If your JSON is invalid, the tool shows the exact line and character position of the error, along with a helpful error message.' },
    ],
    zh: [
      { q: '我的 JSON 数据会被发送到服务器吗？', a: '不会。所有 JSON 解析、格式化和验证完全在浏览器本地完成，不上传任何数据到服务器。你的数据安全地留在自己的设备上。' },
      { q: '最多可以格式化多大的 JSON 文件？', a: '工具可以处理数 MB 的文件，仅受限于浏览器内存。对于超大文件，建议使用树状视图代替完整语法高亮以获得更好性能。' },
      { q: '可以折叠/展开嵌套的 JSON 对象吗？', a: '可以，树状视图支持一键折叠或展开嵌套的对象和数组，方便浏览有数百个嵌套字段的复杂 JSON 结构。' },
      { q: '输入时能实时验证 JSON 格式吗？', a: '可以，实时验证并高亮显示错误。如果 JSON 格式无效，工具会显示错误的具体行号和字符位置，并附带友好的错误提示信息。' },
    ],
    es: [
      { q: '¿Mis datos JSON se envían alguna vez a un servidor?', a: 'No. Todo el análisis, formateo y validación de JSON se realizan completamente en tu navegador. No se carga nada en ningún servidor. Tus datos permanecen privados en tu máquina.' },
      { q: '¿Cuál es el tamaño máximo de archivo JSON que puedo formatear?', a: 'La herramienta puede manejar archivos de hasta varios megabytes, limitada solo por la memoria de tu navegador. Para archivos muy grandes, recomendamos usar la vista de árbol en lugar del resaltado de sintaxis completo para un mejor rendimiento.' },
      { q: '¿Puedo contraer y expandir objetos JSON anidados?', a: 'Sí, la vista de árbol te permite contraer o expandir objetos y arreglos anidados con un solo clic. Esto facilita la navegación por estructuras JSON complejas con cientos de campos anidados.' },
      { q: '¿Esta herramienta valida JSON mientras escribo?', a: 'Sí, validación en tiempo real con resaltado de errores. Si tu JSON es inválido, la herramienta muestra la línea y posición exacta del carácter del error, junto con un mensaje de error útil.' },
    ],
    fr: [
      { q: 'Mes données JSON sont-elles jamais envoyées à un serveur ?', a: 'Non. Tout l\'analyse, le formatage et la validation de JSON se font entièrement dans votre navigateur. Rien n\'est téléversé sur un serveur. Vos données restent privées sur votre machine.' },
      { q: 'Quelle est la taille maximale de fichier JSON que je peux formater ?', a: 'L\'outil peut gérer des fichiers jusqu\'à plusieurs mégaoctets, limité uniquement par la mémoire de votre navigateur. Pour les très grands fichiers, nous recommandons d\'utiliser la vue arbre au lieu de la coloration syntaxique complète pour de meilleures performances.' },
      { q: 'Puis-je réduire et développer les objets JSON imbriqués ?', a: 'Oui, la vue arbre vous permet de réduire ou développer les objets et tableaux imbriqués en un seul clic. Cela facilite la navigation dans les structures JSON complexes avec des centaines de champs imbriqués.' },
      { q: 'Cet outil valide-t-il JSON pendant que je tape ?', a: 'Oui, validation en temps réel avec mise en évidence des erreurs. Si votre JSON est invalide, l\'outil affiche la ligne et la position exacte du caractère de l\'erreur, avec un message d\'erreur utile.' },
    ],
    hi: [
      { q: 'क्या मेरा JSON डेटा कभी सर्वर को भेजा जाता है?', a: 'नहीं। सभी JSON पार्सिंग, फ़ॉर्मेटिंग और वैलिडेशन पूरी तरह से आपके ब्राउज़र में होते हैं। कुछ भी किसी सर्वर पर अपलोड नहीं होता। आपका डेटा आपकी मशीन पर ही गोपनीय रहता है।' },
      { q: 'मैं अधिकतम कितने बड़े JSON फ़ाइल को फ़ॉर्मेट कर सकता हूँ?', a: 'टूल कई मेगाबाइट तक की फ़ाइलों को संभाल सकता है, केवल आपके ब्राउज़र मेमोरी तक सीमित है। बहुत बड़ी फ़ाइलों के लिए, बेहतर प्रदर्शन के लिए पूर्ण सिंटैक्स हाइलाइटिंग के बजाय ट्री व्यू का उपयोग करने की सलाह देते हैं।' },
      { q: 'क्या मैं नेस्टेड JSON ऑब्जेक्ट्स को कोलैप्स और एक्सपैंड कर सकता हूँ?', a: 'हाँ, ट्री व्यू आपको एक क्लिक के साथ नेस्टेड ऑब्जेक्ट्स और एरेज़ को कोलैप्स या एक्सपैंड करने की अनुमति देता है। यह सैकड़ों नेस्टेड फ़ील्ड्स के साथ जटिल JSON संरचनाओं को नेविगेट करना आसान बनाता है।' },
      { q: 'क्या यह टूल मेरे टाइप करते समय JSON को वैलिडेट करता है?', a: 'हाँ, एरर हाइलाइटिंग के साथ रियल-टाइम वैलिडेशन। यदि आपका JSON अमान्य है, तो टूल एरर की सटीक लाइन और कैरेक्टर पोजीशन दिखाता है, साथ ही एक सहायक एरर मैसेज भी देता है।' },
    ],
    ar: [
      { q: 'هل يتم إرسال بيانات JSON الخاصة بي إلى خادم؟', a: 'لا. يتم كل تحليل وتنسيق والتحقق من JSON بالكامل في متصفحك. لا يتم تحميل أي شيء على أي خادم. تبقى بياناتك خاصة على جهازك.' },
      { q: 'ما هو الحد الأقصى لحجم ملف JSON الذي يمكنني تنسيقه؟', a: 'يمكن للأداة التعامل مع ملفات حتى عدة ميغابايت، محدودة فقط بذاكرة متصفحك. للملفات الكبيرة جداً، نوصي باستخدام عرض الشجرة بدلاً من إبراز الصياغة الكامل لأداء أفضل.' },
      { q: 'هل يمكنني طي وتوسيع كائنات JSON المتداخلة؟', a: 'نعم، يتيح لك عرض الشجرة طي أو توسيع الكائنات والمصفوفات المتداخلة بنقرة واحدة. هذا يجعل من السهل التنقل في هياكل JSON المعقدة مع مئات الحقول المتداخلة.' },
      { q: 'هل هذه الأداة تتحقق من JSON أثناء الكتابة؟', a: 'نعم، تحقق في الوقت الفعلي مع إبراز الأخطاء. إذا كان JSON الخاص بك غير صالح، ستعرض الأداة السطر والموضع الدقيق للخطأ، مع رسالة خطأ مفيدة.' },
    ],
  },
  'image-compressor': {
    en: [
      { q: 'What image formats are supported for compression?', a: 'JPEG, PNG, WebP, and AVIF are supported. Each format uses different compression algorithms optimized for photos vs graphics vs web images. The tool shows the visual quality preview so you can compare before downloading.' },
      { q: 'Can I compress multiple images at once?', a: 'Yes, batch processing is supported. Upload multiple images and the tool compresses them all in parallel. You can download them individually or as a ZIP archive.' },
      { q: 'Does the compression reduce image quality significantly?', a: 'The tool lets you control the quality level (from 0-100%). At moderate settings (70-80%), the file size is typically reduced by 50-70% with minimal visible quality loss. You can preview the result before saving.' },
    ],
    zh: [
      { q: '支持哪些图片格式压缩？', a: '支持 JPEG、PNG、WebP 和 AVIF。每种格式使用不同的压缩算法，分别针对照片、图形和网络图片进行优化。工具显示视觉质量预览，方便下载前对比。' },
      { q: '可以同时压缩多张图片吗？', a: '可以，支持批量处理。上传多张图片，工具会并行压缩所有图片。可以单独下载或打包成 ZIP 文件下载。' },
      { q: '压缩会明显降低图片质量吗？', a: '工具允许你控制质量等级（0-100%）。在中等设置（70-80%）下，文件大小通常减少 50-70%，视觉质量损失最小。保存前可以预览效果。' },
    ],
    es: [
      { q: '¿Qué formatos de imagen se admiten para compresión?', a: 'Se admiten JPEG, PNG, WebP y AVIF. Cada formato utiliza diferentes algoritmos de compresión optimizados para fotos, gráficos e imágenes web. La herramienta muestra una vista previa de calidad visual para que puedas comparar antes de descargar.' },
      { q: '¿Puedo comprimir varias imágenes a la vez?', a: 'Sí, se admite el procesamiento por lotes. Sube varias imágenes y la herramienta las comprimirá todas en paralelo. Puedes descargarlas individualmente o como un archivo ZIP.' },
      { q: '¿La compresión reduce significativamente la calidad de la imagen?', a: 'La herramienta te permite controlar el nivel de calidad (de 0-100%). En ajustes moderados (70-80%), el tamaño del archivo se reduce típicamente en un 50-70% con una pérdida de calidad visual mínima. Puedes previsualizar el resultado antes de guardar.' },
    ],
    fr: [
      { q: 'Quels formats d\'image sont pris en charge pour la compression ?', a: 'JPEG, PNG, WebP et AVIF sont pris en charge. Chaque format utilise différents algorithmes de compression optimisés pour les photos, les graphiques et les images web. L\'outil affiche un aperçu de la qualité visuelle pour que vous puissiez comparer avant de télécharger.' },
      { q: 'Puis-je compresser plusieurs images à la fois ?', a: 'Oui, le traitement par lots est pris en charge. Téléchargez plusieurs images et l\'outil les compressera toutes en parallèle. Vous pouvez les télécharger individuellement ou sous forme d\'archive ZIP.' },
      { q: 'La compression réduit-elle significativement la qualité de l\'image ?', a: 'L\'outil vous permet de contrôler le niveau de qualité (de 0-100%). À des réglages modérés (70-80%), la taille du fichier est généralement réduite de 50-70% avec une perte de qualité visuelle minimale. Vous pouvez prévisualiser le résultat avant d\'enregistrer.' },
    ],
    hi: [
      { q: 'कौन से छवि प्रारूप संपीड़न के लिए समर्थित हैं?', a: 'JPEG, PNG, WebP और AVIF समर्थित हैं। प्रत्येक प्रारूप फोटो, ग्राफिक्स और वेब छवियों के लिए अनुकूलित विभिन्न संपीड़न एल्गोरिदम का उपयोग करता है। टूल विज़ुअल क्वालिटी प्रीव्यू दिखाता है ताकि आप डाउनलोड से पहले तुलना कर सकें।' },
      { q: 'क्या मैं एक बार में कई छवियों को संपीड़ित कर सकता हूँ?', a: 'हाँ, बैच प्रोसेसिंग समर्थित है। कई छवियों को अपलोड करें और टूल उन सभी को समानांतर में संपीड़ित करेगा। आप उन्हें व्यक्तिगत रूप से या ZIP आर्काइव के रूप में डाउनलोड कर सकते हैं।' },
      { q: 'क्या संपीड़न छवि की गुणवत्ता को काफी हद तक कम करता है?', a: 'टूल आपको गुणवत्ता स्तर (0-100%) को नियंत्रित करने देता है। मध्यम सेटिंग्स (70-80%) पर, फ़ाइल आकार आमतौर पर 50-70% तक कम हो जाता है जिसमें न्यूनतम दृश्य गुणवत्ता हानि होती है। आप सहेजने से पहले परिणाम का पूर्वावलोकन कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما هي تنسيقات الصور التي تدعمها للضغط؟', a: 'يتم دعم JPEG و PNG و WebP و AVIF. يستخدم كل تنسيق خوارزميات ضغط مختلفة محسّنة للصور الفوتوغرافية والرسومات وصور الويب. تعرض الأداة معاينة جودة بصرية حتى تتمكن من المقارنة قبل التنزيل.' },
      { q: 'هل يمكنني ضغط عدة صور في وقت واحد؟', a: 'نعم، تتم معالجة الدفعي. قم بتحميل عدة صور وسيقوم الضغط عليها جميعاً بالتوازي. يمكنك تنزيلها بشكل فردي أو كملف ZIP.' },
      { q: 'هل يقلل الضغط من جودة الصورة بشكل كبير؟', a: 'تتيح لك الأداة التحكم في مستوى الجودة (من 0-100%). في الإعدادات المتوسطة (70-80%)، يتم تقليل حجم الملف عادة بنسبة 50-70% مع الحد الأدنى من فقدان الجودة البصرية. يمكنك معاينة النتيجة قبل الحفظ.' },
    ],
  },
  'image-converter': {
    en: [
      { q: 'What image formats can I convert between?', a: 'Convert between JPEG, PNG, WebP, AVIF, BMP, GIF, and TIFF. Each format has different use cases — WebP/AVIF for web, JPEG for photos, PNG for graphics with transparency.' },
      { q: 'Can I convert multiple images at once?', a: 'Yes, batch conversion is supported. Upload multiple images and convert them all to the same format at once. Download individually or as a ZIP archive.' },
      { q: 'Does the conversion affect image quality?', a: 'For lossless formats like PNG/WebP, quality is preserved perfectly. For lossy formats like JPEG, you can control the quality slider (0-100%) to balance file size vs quality.' },
    ],
    zh: [
      { q: '支持哪些图片格式互转？', a: '支持 JPEG、PNG、WebP、AVIF、BMP、GIF 和 TIFF 互转。每种格式有不同用途——WebP/AVIF 适合网页，JPEG 适合照片，PNG 适合带透明的图形。' },
      { q: '可以同时转换多张图片吗？', a: '可以，支持批量转换。上传多张图片，一键全部转为同一格式。可单独下载或打包成 ZIP。' },
      { q: '转换会影响图片质量吗？', a: 'PNG/WebP 等无损格式质量完全保留。JPEG 等有损格式可通过质量滑块（0-100%）平衡文件大小与画质。' },
    ],
    es: [
      { q: '¿Entre qué formatos de imagen puedo convertir?', a: 'Convierte entre JPEG, PNG, WebP, AVIF, BMP, GIF y TIFF. Cada formato tiene diferentes casos de uso.' },
      { q: '¿Puedo convertir varias imágenes a la vez?', a: 'Sí, se admite la conversión por lotes. Sube varias imágenes y conviértelas todas al mismo formato.' },
      { q: '¿La conversión afecta la calidad de la imagen?', a: 'Para formatos sin pérdida como PNG/WebP, la calidad se conserva perfectamente. Para formatos con pérdida como JPEG, controla el deslizador de calidad.' },
    ],
    fr: [
      { q: 'Quels formats d\'image puis-je convertir ?', a: 'Convertissez entre JPEG, PNG, WebP, AVIF, BMP, GIF et TIFF. Chaque format a des cas d\'utilisation différents.' },
      { q: 'Puis-je convertir plusieurs images à la fois ?', a: 'Oui, la conversion par lots est prise en charge. Téléchargez plusieurs images et convertissez-les toutes au même format.' },
      { q: 'La conversion affecte-t-elle la qualité de l\'image ?', a: 'Les formats sans perte comme PNG/WebP préservent parfaitement la qualité. Pour les formats avec perte comme JPEG, utilisez le curseur de qualité.' },
    ],
    hi: [
      { q: 'मैं किन छवि प्रारूपों के बीच कन्वर्ट कर सकता हूँ?', a: 'JPEG, PNG, WebP, AVIF, BMP, GIF और TIFF के बीच कन्वर्ट करें।' },
      { q: 'क्या मैं एक बार में कई छवियों को कन्वर्ट कर सकता हूँ?', a: 'हाँ, बैच रूपांतरण समर्थित है। कई छवियों को अपलोड करें और एक ही प्रारूप में कन्वर्ट करें।' },
      { q: 'क्या रूपांतरण छवि की गुणवत्ता को प्रभावित करता है?', a: 'PNG/WebP जैसे हानिरहित प्रारूपों में गुणवत्ता पूरी तरह संरक्षित रहती है। JPEG जैसे हानिकारक प्रारूपों के लिए क्वालिटी स्लाइडर का उपयोग करें।' },
    ],
    ar: [
      { q: 'ما هي تنسيقات الصور التي يمكنني التحويل بينها؟', a: 'حوّل بين JPEG و PNG و WebP و AVIF و BMP و GIF و TIFF.' },
      { q: 'هل يمكنني تحويل عدة صور في وقت واحد؟', a: 'نعم، يتم دعم التحويل الدفعي. قم بتحميل عدة صور وحوّلها جميعاً إلى نفس التنسيق.' },
      { q: 'هل يؤثر التحويل على جودة الصورة؟', a: 'تُحافظ التنسيقات غير المفقودة مثل PNG/WebP على الجودة تماماً. بالنسبة للتنسيقات المفقودة مثل JPEG، استخدم شريط الجودة.' },
    ],
  },
  'unit-converter': {
    en: [
      { q: 'What categories of units can I convert?', a: 'Length (mm, cm, m, km, inches, feet, miles), weight (g, kg, lbs, oz), temperature (Celsius, Fahrenheit, Kelvin), area, volume, time, speed, and data storage (KB, MB, GB, TB).' },
      { q: 'Is the conversion accurate?', a: 'Yes, all conversions use internationally agreed standards. The tool uses exact conversion factors from NIST (National Institute of Standards and Technology) for length, weight, and temperature.' },
      { q: 'Can I convert currency here?', a: 'No, this tool handles physical and digital units only. Currency conversion requires live exchange rates which change constantly.' },
    ],
    zh: [
      { q: '支持哪些单位类别转换？', a: '长度（mm/cm/m/km/英寸/英尺/英里）、重量（g/kg/磅/盎司）、温度（摄氏度/华氏度/开尔文）、面积、体积、时间、速度、数据存储（KB/MB/GB/TB）。' },
      { q: '转换结果准确吗？', a: '准确。所有转换采用国际公认标准，使用 NIST（美国国家标准与技术研究院）的精确换算因子。' },
      { q: '可以转换货币吗？', a: '不行。本工具仅处理物理和数字单位。货币转换需要实时汇率，汇率随时变动。' },
    ],
    es: [
      { q: '¿Qué categorías de unidades puedo convertir?', a: 'Longitud (mm, cm, m, km, pulgadas, pies, millas), peso (g, kg, lbs, oz), temperatura (Celsius, Fahrenheit, Kelvin), área, volumen, tiempo, velocidad y almacenamiento de datos.' },
      { q: '¿La conversión es precisa?', a: 'Sí, todas las conversiones utilizan estándares acordados internacionalmente.' },
      { q: '¿Puedo convertir moneda aquí?', a: 'No, esta herramienta solo maneja unidades físicas y digitales.' },
    ],
    fr: [
      { q: 'Quelles catégories d\'unités puis-je convertir ?', a: 'Longueur (mm, cm, m, km, pouces, pieds, miles), poids (g, kg, lbs, oz), température (Celsius, Fahrenheit, Kelvin), superficie, volume, temps, vitesse et stockage de données.' },
      { q: 'La conversion est-elle précise ?', a: 'Oui, toutes les conversions utilisent des normes internationalement reconnues.' },
      { q: 'Puis-je convertir des devises ici ?', a: 'Non, cet outil gère uniquement les unités physiques et numériques.' },
    ],
    hi: [
      { q: 'मैं इकाइयों की कौन सी श्रेणियाँ कन्वर्ट कर सकता हूँ?', a: 'लंबाई (mm, cm, m, km, इंच, फीट, मील), वजन (g, kg, lbs, oz), तापमान (Celsius, Fahrenheit, Kelvin), क्षेत्रफल, आयतन, समय, गति और डेटा संग्रह।' },
      { q: 'क्या रूपांतरण सटीक है?', a: 'हाँ, सभी रूपांतरण अंतरराष्ट्रीय रूप से स्वीकृत मानकों का उपयोग करते हैं।' },
      { q: 'क्या मैं यहाँ मुद्रा कन्वर्ट कर सकता हूँ?', a: 'नहीं, यह टूल केवल भौतिक और डिजिटल इकाइयों को संभालता है।' },
    ],
    ar: [
      { q: 'ما هي فئات الوحدات التي يمكنني تحويلها؟', a: 'الطول (mm, cm, m, km, بوصة, قدم, ميل)، الوزن (g, kg, lbs, oz)، درجة الحرارة (Celsius, Fahrenheit, Kelvin)، المساحة، الحجم، الوقت، السرعة وتخزين البيانات.' },
      { q: 'هل التحويل دقيق؟', a: 'نعم، تستخدم جميع التحويلات المعايير المتفق عليها دولياً.' },
      { q: 'هل يمكنني تحويل العملات هنا؟', a: 'لا، تتعامل هذه الأداة فقط مع الوحدات المادية والرقمية.' },
    ],
  },
  'json-csv-converter': {
    en: [
      { q: 'How do I convert JSON to CSV and vice versa?', a: 'Paste your JSON or CSV text into the input area and click the convert button. For JSON to CSV, the tool flattens nested objects into dot-notation columns. For CSV to JSON, each row becomes a JSON object with the header row as keys.' },
      { q: 'How are nested JSON objects handled in CSV?', a: 'Nested objects are flattened using dot notation (e.g., address.city, address.zipcode). Arrays are joined with commas or you can choose to expand them into separate columns.' },
      { q: 'Is my data safe during conversion?', a: 'Yes, all processing happens in your browser. No data is sent to our servers. The tool works entirely client-side for privacy-sensitive data.' },
    ],
    zh: [
      { q: '如何将 JSON 转为 CSV 或反向转换？', a: '将 JSON 或 CSV 文本粘贴到输入区域，点击转换按钮。JSON 转 CSV 时，嵌套对象会被扁平化为点号分隔的列（如 address.city）。CSV 转 JSON 时，每行变为一个 JSON 对象，表头作为键。' },
      { q: '嵌套 JSON 对象在 CSV 中如何处理？', a: '嵌套对象使用点号表示法扁平化（如 address.city、address.zipcode）。数组用逗号连接，或可展开为独立列。' },
      { q: '转换过程中数据安全吗？', a: '安全。所有处理在浏览器本地完成，数据不上传服务器。完全客户端处理，适合隐私敏感数据。' },
    ],
    es: [
      { q: '¿Cómo convierto JSON a CSV y viceversa?', a: 'Pega tu texto JSON o CSV en el área de entrada y haz clic en el botón de convertir. Para JSON a CSV, las objetos anidados se aplanan en columnas con notación de puntos.' },
      { q: '¿Cómo se manejan los objetos JSON anidados en CSV?', a: 'Los objetos anidados se aplanan usando notación de puntos (ej: address.city). Las matrices se unen con comas.' },
      { q: '¿Mis datos están seguros durante la conversión?', a: 'Sí, todo el procesamiento ocurre en tu navegador. Ningún dato se envía a nuestros servidores.' },
    ],
    fr: [
      { q: 'Comment convertir JSON en CSV et inversement ?', a: 'Collez votre texte JSON ou CSV dans la zone d\'entrée et cliquez sur le bouton de conversion. Pour JSON vers CSV, les objets imbriqués sont aplatis en colonnes à notation par points.' },
      { q: 'Comment les objets JSON imbriqués sont-ils gérés en CSV ?', a: 'Les objets imbriqués sont aplatis avec la notation par points (ex: address.city). Les tableaux sont joints par des virgules.' },
      { q: 'Mes données sont-elles sûres pendant la conversion ?', a: 'Oui, tout le traitement se fait dans votre navigateur. Aucune donnée n\'est envoyée à nos serveurs.' },
    ],
    hi: [
      { q: 'मैं JSON को CSV में और विपरीत कैसे कन्वर्ट करूँ?', a: 'अपने JSON या CSV टेक्स्ट को इनपुट एरिया में पेस्ट करें और कन्वर्ट बटन पर क्लिक करें।' },
      { q: 'CSV में नेस्टेड JSON ऑब्जेक्ट्स कैसे हैंडल किए जाते हैं?', a: 'नेस्टेड ऑब्जेक्ट्स को डॉट नोटेशन (जैसे address.city) का उपयोग करके फ्लैट किया जाता है। Arrays को अल्पविराम से जोड़ा जाता है।' },
      { q: 'क्या रूपांतरण के दौरान मेरा डेटा सुरक्षित है?', a: 'हाँ, सभी प्रोसेसिंग आपके ब्राउज़र में होती है। कोई डेटा हमारे सर्वर पर नहीं भेजा जाता है।' },
    ],
    ar: [
      { q: 'كيف يمكنني تحويل JSON إلى CSV والعكس؟', a: 'الصق نص JSON أو CSV في منطقة الإدخال وانقر على زر التحويل.' },
      { q: 'كيف يتم التعامل مع كائنات JSON المتداخلة في CSV؟', a: 'يتم تسطيح الكائنات المتداخلة باستخدام تدوين النقطة (مثل address.city). يتم ضم المصفوفات بفواصل.' },
      { q: 'هل بياناتي آمنة أثناء التحويل؟', a: 'نعم، تتم جميع المعالجة في متصفحك. لا يتم إرسال أي بيانات إلى خوادمنا.' },
    ],
  },
  'css-gradient-generator': {
    en: [
      { q: 'What types of CSS gradients can I generate?', a: 'You can generate linear, radial, and conic gradients. Each type supports full customization including color stops, direction, angle, and position.' },
      { q: 'Can I preview the gradient in real-time?', a: 'Yes, the gradient updates in real-time as you adjust colors, positions, and parameters. You can see the final result instantly before exporting.' },
      { q: 'How do I export the generated CSS code?', a: 'Simply click the copy button to copy the CSS code to your clipboard. You can also customize the output format with vendor prefixes for broader browser support.' },
      { q: 'Can I use custom colors in the gradient?', a: 'Absolutely. You can input any valid CSS color format including hex, RGB, RGBA, HSL, and named colors. The tool also provides a color picker for visual selection.' },
      { q: 'Is the generated CSS compatible with all browsers?', a: 'Yes, the generated CSS follows standard CSS3 gradient syntax. For older browsers, you can enable vendor prefixes (-webkit-, -moz-, etc.) to ensure compatibility.' },
    ],
    zh: [
      { q: '可以生成哪些类型的 CSS 渐变？', a: '支持线性渐变、径向渐变和锥形渐变。每种类型都支持完全自定义，包括颜色停止点、方向、角度和位置。' },
      { q: '可以实时预览渐变效果吗？', a: '可以，调整颜色、位置和参数时渐变会实时更新，导出前即可看到最终效果。' },
      { q: '如何导出生成的 CSS 代码？', a: '点击复制按钮即可将 CSS 代码复制到剪贴板。还可以自定义输出格式，添加浏览器前缀以获得更广泛的兼容性。' },
      { q: '可以使用自定义颜色吗？', a: '当然可以。支持任何有效的 CSS 颜色格式，包括十六进制、RGB、RGBA、HSL 和命名颜色。还提供了颜色选择器进行可视化选择。' },
      { q: '生成的 CSS 兼容所有浏览器吗？', a: '是的，生成的 CSS 遵循标准 CSS3 渐变语法。对于旧浏览器，可以启用浏览器前缀（-webkit-、-moz- 等）来确保兼容性。' },
    ],
    es: [
      { q: '¿Qué tipos de gradientes CSS puedo generar?', a: 'Puedes generar gradientes lineales, radiales y cónicos. Cada tipo admite personalización completa, incluidos puntos de parada de color, dirección, ángulo y posición.' },
      { q: '¿Puedo ver el gradiente en tiempo real?', a: 'Sí, el gradiente se actualiza en tiempo real a medida que ajustas colores, posiciones y parámetros. Puedes ver el resultado final al instante antes de exportar.' },
      { q: '¿Cómo exporto el código CSS generado?', a: 'Simplemente haz clic en el botón de copiar para copiar el código CSS a tu portapapeles. También puedes personalizar el formato de salida con prefijos de proveedor para una compatibilidad más amplia.' },
      { q: '¿Puedo usar colores personalizados en el gradiente?', a: 'Absolutamente. Puedes ingresar cualquier formato de color CSS válido, incluidos hexadecimal, RGB, RGBA, HSL y colores con nombre. La herramienta también proporciona un selector de colores para selección visual.' },
      { q: '¿El CSS generado es compatible con todos los navegadores?', a: 'Sí, el CSS generado sigue la sintaxis estándar de gradientes CSS3. Para navegadores más antiguos, puedes habilitar prefijos de proveedor (-webkit-, -moz-, etc.) para garantizar la compatibilidad.' },
    ],
    fr: [
      { q: 'Quels types de dégradés CSS puis-je générer ?', a: 'Vous pouvez générer des dégradés linéaires, radiaux et coniques. Chaque type prend en charge une personnalisation complète, y compris les arrêts de couleur, la direction, l\'angle et la position.' },
      { q: 'Puis-je prévisualiser le dégradé en temps réel ?', a: 'Oui, le dégradé se met à jour en temps réel lorsque vous ajustez les couleurs, les positions et les paramètres. Vous pouvez voir le résultat final instantanément avant l\'exportation.' },
      { q: 'Comment exporter le code CSS généré ?', a: 'Cliquez simplement sur le bouton copier pour copier le code CSS dans votre presse-papiers. Vous pouvez également personnaliser le format de sortie avec des préfixes fournisseurs pour une compatibilité plus large.' },
      { q: 'Puis-je utiliser des couleurs personnalisées dans le dégradé ?', a: 'Absolument. Vous pouvez saisir tout format de couleur CSS valide, y compris hexadécimal, RGB, RGBA, HSL et les couleurs nommées. L\'outil fournit également un sélecteur de couleurs pour une sélection visuelle.' },
      { q: 'Le CSS généré est-il compatible avec tous les navigateurs ?', a: 'Oui, le CSS généré suit la syntaxe standard des dégradés CSS3. Pour les navigateurs plus anciens, vous pouvez activer les préfixes fournisseurs (-webkit-, -moz-, etc.) pour garantir la compatibilité.' },
    ],
    hi: [
      { q: 'मैं किस प्रकार के CSS ग्रेडिएंट उत्पन्न कर सकता हूँ?', a: 'आप रैखिक, रेडियल और शंक्वाकार ग्रेडिएंट उत्पन्न कर सकते हैं। प्रत्येक प्रकार रंग स्टॉप, दिशा, कोण और स्थिति सहित पूर्ण अनुकूलन का समर्थन करता है।' },
      { q: 'क्या मैं ग्रेडिएंट को रियल-टाइम में प्रीव्यू कर सकता हूँ?', a: 'हाँ, जैसे ही आप रंग, स्थिति और पैरामीटर समायोजित करते हैं, ग्रेडिएंट रियल-टाइम में अपडेट होता है। आप निर्यात से पहले अंतिम परिणाम तुरंत देख सकते हैं।' },
      { q: 'मैं तैयार किए गए CSS कोड को कैसे निर्यात करूँ?', a: 'CSS कोड को अपने क्लिपबोर्ड पर कॉपी करने के लिए बस कॉपी बटन पर क्लिक करें। आप व्यापक ब्राउज़र समर्थन के लिए वेंडर प्रीफिक्स के साथ आउटपुट फ़ॉर्मेट भी अनुकूलित कर सकते हैं।' },
      { q: 'क्या मैं ग्रेडिएंट में कस्टम रंगों का उपयोग कर सकता हूँ?', a: 'बिल्कुल। आप किसी भी वैध CSS रंग फ़ॉर्मेट में इनपुट कर सकते हैं, जिसमें hex, RGB, RGBA, HSL और नामित रंग शामिल हैं। टूल विज़ुअल चयन के लिए कलर पिकर भी प्रदान करता है।' },
      { q: 'क्या तैयार किया गया CSS सभी ब्राउज़रों के साथ संगत है?', a: 'हाँ, तैयार किया गया CSS मानक CSS3 ग्रेडिएंट सिंटैक्स का अनुसरण करता है। पुराने ब्राउज़रों के लिए, आप संगतता सुनिश्चित करने के लिए वेंडर प्रीफिक्स (-webkit-, -moz-, आदि) सक्षम कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما أنواع تدرجات CSS التي يمكنني إنشاؤها؟', a: 'يمكنك إنشاء تدرجات خطية وشعاعية ومخروطية. يدعم كل نوع تخصيصاً كاملاً بما في ذلك نقاط توقف اللون والاتجاه والزاوية والموضع.' },
      { q: 'هل يمكنني معاينة التدرج في الوقت الفعلي؟', a: 'نعم، يتم تحديث التدرج في الوقت الفعلي أثناء ضبط الألوان والمواضع والمعلمات. يمكنك رؤية النتيجة النهائية فوراً قبل التصدير.' },
      { q: 'كيف أقوم بتصدير كود CSS الذي تم إنشاؤه؟', a: 'ما عليك سوى النقر على زر النسخ لنسخ كود CSS إلى الحافظة. يمكنك أيضاً تخصيص تنسيق الإخراج مع بادئات البائعين للحصول على توافق أوسع.' },
      { q: 'هل يمكنني استخدام ألوان مخصصة في التدرج؟', a: 'بالتأكيد. يمكنك إدخال أي تنسيق لون CSS صالح بما في ذلك hex و RGB و RGBA و HSL والألوان المسماة. توفر الأداة أيضاً منتقي ألوان للتحديد البصري.' },
      { q: 'هل CSS الذي تم إنشاؤه متوافق مع جميع المتصفحات؟', a: 'نعم، يتبع CSS الذي تم إنشاؤه صياغة تدرجات CSS3 القياسية. بالنسبة للمتصفحات القديمة، يمكنك تمكين بادئات البائعين (-webkit- و -moz- وغيرها) لضمان التوافق.' },
    ],
  },
  'rainbow-compliment-generator': {
    en: [
      { q: 'What compliment styles are available?', a: 'We offer 4 styles: sincere (heartfelt and genuine), funny (silly and lighthearted), poetic (literary and romantic), and over-the-top (exaggerated and hilarious). Pick the one that fits your relationship with the recipient.' },
      { q: 'Can I customize the compliment?', a: 'Yes, enter the recipient\'s name and optional context (e.g., "my coworker", "my best friend") to make the compliment more personal and relevant.' },
      { q: 'Is there a limit to how many compliments I can generate?', a: 'No, generate as many as you want. Each click produces a unique compliment, so you can keep trying until you find the perfect one.' },
    ],
    zh: [
      { q: '有哪些赞美风格可选？', a: '我们提供4种风格：真诚型（发自内心）、搞笑型（轻松幽默）、诗意型（文学浪漫）、夸张型（极度夸张好笑）。选择适合你和对方关系的风格即可。' },
      { q: '可以自定义赞美内容吗？', a: '可以，输入对方的名字和可选的背景信息（如「我的同事」「我的闺蜜」），让赞美更加个性化。' },
      { q: '生成次数有限制吗？', a: '没有限制，想生成多少次就生成多少次。每次点击都会产生独特的赞美文案，直到你找到最满意的那条。' },
    ],
    es: [
      { q: '¿Qué estilos de cumplidos están disponibles?', a: 'Ofrecemos 4 estilos: sincero (corazón y genuino), divertido (tonto y ligero), poético (literario y romántico) y exagerado (exagerado e hilarante). Elige el que mejor se adapte a tu relación con el destinatario.' },
      { q: '¿Puedo personalizar el cumplido?', a: 'Sí, ingresa el nombre del destinatario y un contexto opcional (ej: "mi compañero de trabajo", "mi mejor amigo") para que el cumplido sea más personal y relevante.' },
      { q: '¿Hay un límite de cumplidos que puedo generar?', a: 'No, genera tantos como quieras. Cada clic produce un cumplido único, así que puedes seguir intentando hasta encontrar el perfecto.' },
    ],
    fr: [
      { q: 'Quels styles de compliments sont disponibles ?', a: 'Nous proposons 4 styles : sincère (cœur et authentique), drôle (silly et léger), poétique (littéraire et romantique) et exagéré (exagéré et hilarant). Choisissez celui qui convient le mieux à votre relation avec le destinataire.' },
      { q: 'Puis-je personnaliser le compliment ?', a: 'Oui, entrez le nom du destinataire et un contexte facultatif (ex : "mon collègue", "mon meilleur ami") pour rendre le compliment plus personnel et pertinent.' },
      { q: 'Y a-t-il une limite au nombre de compliments que je peux générer ?', a: 'Non, générez autant que vous voulez. Chaque clic produit un compliment unique, donc vous pouvez continuer jusqu\'à trouver le parfait.' },
    ],
    hi: [
      { q: 'कौन सी तारीफ शैलियाँ उपलब्ध हैं?', a: 'हम 4 शैलियाँ प्रदान करते हैं: ईमानदार (दिल से और असली), मज़ेदार (मूर्खतापूर्ण और हल्का), काव्यात्मक (साहित्यिक और रोमांटिक), और अतिशयोक्तिपूर्ण (अतिशयोक्तिपूर्ण और मज़ेदार)।' },
      { q: 'क्या मैं तारीफ को अनुकूलित कर सकता हूँ?', a: 'हाँ, प्राप्तकर्ता का नाम और वैकल्पिक संदर्भ दर्ज करें (जैसे "मेरा सहकर्मी", "मेरा सबसे अच्छा दोस्त") ताकि तारीफ अधिक व्यक्तिगत हो।' },
      { q: 'क्या मैं जितनी चाहें उतनी तारीफें बना सकता हूँ?', a: 'हाँ, कोई सीमा नहीं है। हर क्लिक एक अनोखी तारीफ बनाता है।' },
    ],
    ar: [
      { q: 'ما هي أساليب الثناء المتاحة؟', a: 'نقدم 4 أساليب: صادق (من القلب والحقيقي)، مضحك (سخيف وخفيف)، شعري (أدبي ورومانسي)، ومبالغ فيه (مبالغ فيه ومضحك).' },
      { q: 'هل يمكنني تخصيص المديح؟', a: 'نعم، أدخل اسم المتلقي وسياقاً اختيارياً (مثل "زميلي في العمل"، "صديقي المفضل") لجعل المديح أكثر شخصية.' },
      { q: 'هل هناك حد لعدد المديحات التي يمكنني إنشاؤها؟', a: 'لا، أنشئ بقدر ما تشاء. كل نقرة تنتج مديحاً فريداً.' },
    ],
  },
  'acrostic-poem-generator': {
    en: [
      { q: 'What is an acrostic poem?', a: 'An acrostic poem is a poem where the first character of each line spells out a word or phrase. For Chinese, we use the first character of each line to form the hidden word.' },
      { q: 'Can I use any keyword for the acrostic?', a: 'Yes, enter any Chinese word or phrase (2-8 characters). The generator creates a poem where each line\'s first character matches your keyword in sequence.' },
      { q: 'What poem styles are supported?', a: 'We support 7-character (七言) and 5-character (五言) classical Chinese poetry forms, with themes like blessing, love, business, scenery, and motivation.' },
    ],
    zh: [
      { q: '什么是藏头诗？', a: '藏头诗是一种将每行首字连起来组成一个词或短语的诗歌形式。中文藏头诗通常使用每行第一个字组成隐藏的关键词。' },
      { q: '可以用任意关键词生成吗？', a: '可以，输入任意中文词或短语（2-8个字），生成器会创作一首诗，每行首字依次对应你的关键词。' },
      { q: '支持哪些诗体？', a: '支持七言和五言两种古诗体，以及祝福、表白、商务、风景、励志等多种主题。' },
    ],
    es: [
      { q: '¿Qué es un poema acróstico?', a: 'Un poema acróstico es un poema donde el primer carácter de cada línea forma una palabra o frase. Para chino, usamos el primer carácter de cada línea para formar la palabra oculta.' },
      { q: '¿Puedo usar cualquier palabra clave para el acróstico?', a: 'Sí, ingresa cualquier palabra o frase china (2-8 caracteres). El generador crea un poema donde el primer carácter de cada línea coincide con tu palabra clave en secuencia.' },
      { q: '¿Qué estilos de poema se admiten?', a: 'Admitimos formas de poesía clásica china de 7 caracteres (七言) y 5 caracteres (五言), con temas como bendición, amor, negocios, paisaje y motivación.' },
    ],
    fr: [
      { q: 'Qu\'est-ce qu\'un poème acrostiche ?', a: 'Un poème acrostiche est un poème où le premier caractère de chaque ligne forme un mot ou une phrase. Pour le chinois, nous utilisons le premier caractère de chaque ligne pour former le mot caché.' },
      { q: 'Puis-je utiliser n\'importe quel mot-clé pour l\'acrostiche ?', a: 'Oui, entrez n\'importe quel mot ou phrase chinois (2-8 caractères). Le générateur crée un poème où le premier caractère de chaque ligne correspond à votre mot-clé en séquence.' },
      { q: 'Quels styles de poèmes sont pris en charge ?', a: 'Nous prenons en charge les formes de poésie classique chinoise de 7 caractères (七言) et 5 caractères (五言), avec des thèmes comme la bénédiction, l\'amour, les affaires, le paysage et la motivation.' },
    ],
    hi: [
      { q: 'एक व्यंजना कविता क्या है?', a: 'एक व्यंजना कविता वह कविता है जहाँ प्रत्येक पंक्ति का पहला अक्षर एक शब्द या वाक्यांश बनाता है।' },
      { q: 'क्या मैं व्यंजना के लिए किसी भी कीवर्ड का उपयोग कर सकता हूँ?', a: 'हाँ, कोई भी चीनी शब्द या वाक्यांश (2-8 अक्षर) दर्ज करें।' },
      { q: 'कौन सी कविता शैलियाँ समर्थित हैं?', a: 'हम 7-अक्षर (七言) और 5-अक्षर (五言) शास्त्रीय चीनी कविता रूपों का समर्थन करते हैं।' },
    ],
    ar: [
      { q: 'ما هي القصيدة الأخفائية؟', a: 'القصيدة الأخفائية هي قصيدة حيث تشكل الحرف الأول من كل سطر كلمة أو عبارة.' },
      { q: 'هل يمكنني استخدام أي كلمة مفتاحية للأخفائية؟', a: 'نعم، أدخل أي كلمة أو عبارة صينية (2-8 أحرف).' },
      { q: 'ما هي أنماط القصيدة المدعومة؟', a: 'ندعم أشكال الشعر الصيني الكلاسيكي المكون من 7 أحرف (七言) و 5 أحرف (五言).' },
    ],
  },
  'dream-interpreter': {
    en: [
      { q: 'How does the dream interpretation work?', a: 'The tool provides dual interpretation: a psychological analysis based on Freud\'s theories and a traditional Chinese interpretation based on the Zhougong dream dictionary (周公解梦).' },
      { q: 'Is dream interpretation scientifically accurate?', a: 'Dream interpretation is subjective and not a science. Our tool provides two different frameworks for understanding your dreams — one from Western psychology and one from Chinese traditional culture — for reflection and entertainment purposes only.' },
      { q: 'Can I interpret dreams in languages other than Chinese?', a: 'Yes, enter your dream keywords in any language. The Freudian analysis works universally, and the Zhougong dictionary interpretation is available for Chinese-related dream symbols.' },
    ],
    zh: [
      { q: '梦境解析是如何工作的？', a: '工具提供双重解读：基于弗洛伊德理论的心理学分析，以及基于周公解梦的中国传统解读。' },
      { q: '梦境解析有科学依据吗？', a: '梦境解析是主观的，不是科学。仅供反思和娱乐之用。' },
      { q: '可以用中文以外的语言解析梦境吗？', a: '可以，用任意语言输入你的梦境关键词。弗洛伊德分析具有普遍性。' },
    ],
    es: [
      { q: '¿Cómo funciona la interpretación de sueños?', a: 'La herramienta proporciona una doble interpretación: un análisis psicológico basado en las teorías de Freud y una interpretación tradicional china basada en el diccionario de sueños de Zhougong (周公解梦).' },
      { q: '¿La interpretación de sueños es científicamente precisa?', a: 'La interpretación de sueños es subjetiva y no es una ciencia. Es solo para fines de reflexión y entretenimiento.' },
      { q: '¿Puedo interpretar sueños en otros idiomas además del chino?', a: 'Sí, ingresa tus palabras clave de sueño en cualquier idioma.' },
    ],
    fr: [
      { q: 'Comment fonctionne l\'interprétation des rêves ?', a: 'L\'outil fournit une double interprétation : une analyse psychologique basée sur les théories de Freud et une interprétation traditionnelle chinoise basée sur le dictionnaire des rêves de Zhougong (周公解梦).' },
      { q: 'L\'interprétation des rêves est-elle scientifiquement précise ?', a: 'L\'interprétation des rêves est subjective et n\'est pas une science. À des fins de réflexion et de divertissement uniquement.' },
      { q: 'Puis-je interpréter les rêves dans des langues autres que le chinois ?', a: 'Oui, entrez vos mots-clés de rêve dans n\'importe quelle langue.' },
    ],
    hi: [
      { q: 'सपना व्याख्या कैसे काम करती है?', a: 'यह उपकरण दोहरी व्याख्या प्रदान करता है: फ्रायड के सिद्धांतों पर आधारित मनोवैज्ञानिक विश्लेषण और झोउगोंग सपना शब्दकोश पर आधारित पारंपरिक चीनी व्याख्या।' },
      { q: 'क्या सपना व्याख्या वैज्ञानिक रूप से सटीक है?', a: 'सपना व्याख्या व्यक्तिपरक है और विज्ञान नहीं है। केवल चिंतन और मनोरंजन उद्देश्यों के लिए।' },
      { q: 'क्या मैं चीनी के अलावा अन्य भाषाओं में सपनों की व्याख्या कर सकता हूँ?', a: 'हाँ, किसी भी भाषा में अपने सपने के कीवर्ड दर्ज करें।' },
    ],
    ar: [
      { q: 'كيف يعمل تفسير الأحلام؟', a: 'توفر الأداة تفسيراً مزدوجاً: تحليلاً نفسياً يعتمد على نظريات فرويد وتفسيراً صينياً تقليدياً يعتمد على قاموس أحلام تشو غونغ (周公解梦).' },
      { q: 'هل تفسير الأحلام دقيق علمياً؟', a: 'تفسير الأحلام ذاتي وليس علماً. لأغراض التأمل والترفيه فقط.' },
      { q: 'هل يمكنني تفسير الأحلام بلغات أخرى غير الصينية؟', a: 'نعم، أدخل كلمات مفتاحية لأحلامك بأي لغة.' },
    ],
  },
  'handwritten-signature-generator': {
    en: [
      { q: 'What signature styles are available?', a: 'We offer 5+ handwritten signature styles, ranging from elegant and formal to casual and artistic.' },
      { q: 'Can I adjust the stroke width and slant?', a: 'Yes, use the sliders to adjust stroke thickness and slant angle in real-time.' },
      { q: 'What export formats are supported?', a: 'Export your signature as PNG (with transparent background) or SVG (vector format, scalable without quality loss).' },
    ],
    zh: [
      { q: '有哪些签名风格可选？', a: '我们提供5种以上手写签名风格，从优雅正式到休闲艺术。' },
      { q: '可以调整笔画粗细和倾斜度吗？', a: '可以，使用滑块实时调整笔画粗细和倾斜角度。' },
      { q: '支持哪些导出格式？', a: '支持导出为 PNG（透明背景）或 SVG（矢量格式）。' },
    ],
    es: [
      { q: '¿Qué estilos de firma están disponibles?', a: 'Ofrecemos más de 5 estilos de firma manuscrita, desde elegantes y formales hasta casuales y artísticos.' },
      { q: '¿Puedo ajustar el grosor del trazo y la inclinación?', a: 'Sí, usa los controles deslizantes para ajustar el grosor del trazo y el ángulo de inclinación en tiempo real.' },
      { q: '¿Qué formatos de exportación se admiten?', a: 'Exporta tu firma como PNG (con fondo transparente) o SVG (formato vectorial).' },
    ],
    fr: [
      { q: 'Quels styles de signature sont disponibles ?', a: 'Nous proposons plus de 5 styles de signature manuscrite, allant de l\'élégant et formel au décontracté et artistique.' },
      { q: 'Puis-je ajuster l\'épaisseur du trait et l\'inclinaison ?', a: 'Oui, utilisez les curseurs pour ajuster l\'épaisseur du trait et l\'angle d\'inclinaison en temps réel.' },
      { q: 'Quels formats d\'exportation sont pris en charge ?', a: 'Exportez votre signature en PNG (avec fond transparent) ou SVG (format vectoriel).' },
    ],
    hi: [
      { q: 'कौन सी हस्ताक्षर शैलियाँ उपलब्ध हैं?', a: 'हम 5+ हस्तलिखित हस्ताक्षर शैलियाँ प्रदान करते हैं।' },
      { q: 'क्या मैं स्ट्रोक की चौड़ाई और झुकाव समायोजित कर सकता हूँ?', a: 'हाँ, स्लाइडर का उपयोग करें।' },
      { q: 'कौन से निर्यात प्रारूप समर्थित हैं?', a: 'PNG (पारदर्शी बैकग्राउंड) या SVG (वेक्टर प्रारूप)।' },
    ],
    ar: [
      { q: 'ما هي أنماط التوقيع المتاحة؟', a: 'نقدم أكثر من 5 أنماط توقيع مكتوب بخط اليد.' },
      { q: 'هل يمكنني ضبط سماكة الخط والميل؟', a: 'نعم، استخدم المنزلقات.' },
      { q: 'ما هي تنسيقات التصدير المدعومة؟', a: 'PNG (مع خلفية شفافة) أو SVG (تنسيق متجه).' },
    ],
  },
  'life-timeline': {
    en: [
      { q: 'How does the life timeline work?', a: 'Enter your birth date and life expectancy. The tool creates a grid where each cell represents one week of your life. Lived weeks are colored, remaining weeks are blank.' },
      { q: 'Can I mark important dates on the timeline?', a: 'Yes, click on any cell to mark important events like birthdays, anniversaries, or milestones.' },
      { q: 'Is my data stored online?', a: 'No, all data is stored locally in your browser. Your timeline never leaves your device.' },
    ],
    zh: [
      { q: '人生时间轴是如何工作的？', a: '输入你的出生日期和预期寿命，工具会创建一个网格，每格代表你生命中的一周。' },
      { q: '可以在时间轴上标记重要日期吗？', a: '可以，点击任意格子标记重要事件。' },
      { q: '我的数据存在网上吗？', a: '不，所有数据都存储在浏览器本地。' },
    ],
    es: [
      { q: '¿Cómo funciona la línea de tiempo de la vida?', a: 'Ingresa tu fecha de nacimiento y expectativa de vida. La herramienta crea una cuadrícula donde cada celda representa una semana de tu vida.' },
      { q: '¿Puedo marcar fechas importantes en la línea de tiempo?', a: 'Sí, haz clic en cualquier celda para marcar eventos importantes.' },
      { q: '¿Mis datos se almacenan en línea?', a: 'No, todos los datos se almacenan localmente en tu navegador.' },
    ],
    fr: [
      { q: 'Comment fonctionne la chronologie de la vie ?', a: 'Entrez votre date de naissance et votre espérance de vie. L\'outil crée une grille où chaque cellule représente une semaine de votre vie.' },
      { q: 'Puis-je marquer des dates importantes sur la chronologie ?', a: 'Oui, cliquez sur n\'importe quelle cellule pour marquer des événements importants.' },
      { q: 'Mes données sont-elles stockées en ligne ?', a: 'Non, toutes les données sont stockées localement dans votre navigateur.' },
    ],
    hi: [
      { q: 'जीवन समयरेखा कैसे काम करती है?', a: 'अपनी जन्मतिथि और जीवन प्रत्याशा दर्ज करें। उपकरण एक ग्रिड बनाता है जहाँ प्रत्येक सेल आपके जीवन के एक सप्ताह का प्रतिनिधित्व करता है।' },
      { q: 'क्या मैं समयरेखा पर महत्वपूर्ण तिथियों को चिह्नित कर सकता हूँ?', a: 'हाँ, किसी भी सेल पर क्लिक करें।' },
      { q: 'क्या मेरा डेटा ऑनलाइन संग्रहीत है?', a: 'नहीं, सभी डेटा आपके ब्राउज़र में स्थानीय रूप से संग्रहीत है।' },
    ],
    ar: [
      { q: 'كيف يعمل الخط الزمني للحياة؟', a: 'أدخل تاريخ ميلادك ومتوسط العمر المتوقع. تنشئ الأداة شبكة حيث تمثل كل خلية أسبوعاً من حياتك.' },
      { q: 'هل يمكنني تحديد تواريخ مهمة على الخط الزمني؟', a: 'نعم، انقر على أي خلية.' },
      { q: 'هل يتم تخزين بياناتي عبر الإنترنت؟', a: 'لا، يتم تخزين جميع البيانات محلياً في متصفحك.' },
    ],
  },
  'personality-test': {
    en: [
      { q: 'What is the personality test based on?', a: 'The test is inspired by the MBTI framework but simplified to 10 quick questions. It covers 4 dimensions: Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.' },
      { q: 'How long does the test take?', a: 'About 2-3 minutes. Each question is designed to be answered quickly with your first impression.' },
      { q: 'Is the test scientifically validated?', a: 'This is a simplified version for entertainment and self-reflection purposes only.' },
    ],
    zh: [
      { q: '性格测试的依据是什么？', a: '测试基于 MBTI 框架，但简化为10道快速题目。涵盖4个维度：外向/内向、感觉/直觉、思考/情感、判断/感知。' },
      { q: '测试需要多长时间？', a: '大约2-3分钟。' },
      { q: '测试有科学依据吗？', a: '这是一个简化版本，仅供娱乐和自我反思。' },
    ],
    es: [
      { q: '¿En qué se basa la prueba de personalidad?', a: 'La prueba se inspira en el marco MBTI pero se simplifica a 10 preguntas rápidas.' },
      { q: '¿Cuánto tarda la prueba?', a: 'Aproximadamente 2-3 minutos.' },
      { q: '¿La prueba está validada científicamente?', a: 'Esta es una versión simplificada con fines de entretenimiento y autorreflexión.' },
    ],
    fr: [
      { q: 'Sur quoi se base le test de personnalité ?', a: 'Le test s\'inspire du cadre MBTI mais est simplifié en 10 questions rapides.' },
      { q: 'Combien de temps dure le test ?', a: 'Environ 2-3 minutes.' },
      { q: 'Le test est-il scientifiquement validé ?', a: 'Il s\'agit d\'une version simplifiée à des fins de divertissement et d\'autoréflexion.' },
    ],
    hi: [
      { q: 'व्यक्तित्व परीक्षण किस पर आधारित है?', a: 'परीक्षण MBTI फ्रेमवर्क से प्रेरित है लेकिन 10 त्वरित प्रश्नों में सरलीकृत है।' },
      { q: 'परीक्षण में कितना समय लगता है?', a: 'लगभग 2-3 मिनट।' },
      { q: 'क्या परीक्षण वैज्ञानिक रूप से मान्य है?', a: 'यह मनोरंजन और आत्म-चिंतन उद्देश्यों के लिए एक सरलीकृत संस्करण है।' },
    ],
    ar: [
      { q: 'ما هو اختبار الشخصية القائم على؟', a: 'الاختبار مستوحى من إطار عمل MBTI ولكن تم تبسيطه إلى 10 أسئلة سريعة.' },
      { q: 'كم من الوقت يستغرق الاختبار؟', a: 'حوالي 2-3 دقائق.' },
      { q: 'هل الاختبار صالح علمياً؟', a: 'هذه نسخة مبسطة لأغراض الترفيه والتأمل الذاتي.' },
    ],
  },
  'fortune-drawing': {
    en: [
      { q: 'How does the fortune drawing work?', a: 'Think of a question, then click the fortune stick to draw a numbered fortune (签文). Each fortune includes a classical Chinese poem (签诗) and a detailed interpretation.' },
      { q: 'What do the fortune numbers mean?', a: 'Fortunes are numbered from 1 to 100, with traditional rankings like 上上 (most auspicious), 上 (auspicious), 中 (middle), 下 (below).' },
      { q: 'Is fortune drawing a form of divination?', a: 'Fortune drawing is a traditional Chinese cultural practice for guidance and reflection. It is not a science and should be used for entertainment purposes only.' },
    ],
    zh: [
      { q: '抽签占卜是如何工作的？', a: '心中默念一个问题，然后点击签文抽取编号签文。每支签都包含一首文言文签诗和详细的吉凶解读。' },
      { q: '签号代表什么？', a: '签文编号从1到100，有传统的吉凶等级：上上、上、中、下。' },
      { q: '抽签占卜是一种占卜形式吗？', a: '抽签是中国传统文化中的一种寻求指引和反思的方式。它不是科学，仅供娱乐。' },
    ],
    es: [
      { q: '¿Cómo funciona la extracción de fortuna?', a: 'Piensa en una pregunta, luego haz clic en el palo de fortuna para extraer una fortuna numerada (签文).' },
      { q: '¿Qué significan los números de fortuna?', a: 'Las fortunas están numeradas del 1 al 100, con clasificaciones tradicionales como 上上 (más auspicioso), 上 (auspicioso), 中 (medio), 下 (inferior).' },
      { q: '¿La extracción de fortuna es una forma de adivinación?', a: 'Es una práctica cultural tradicional china para orientación y reflexión. No es una ciencia.' },
    ],
    fr: [
      { q: 'Comment fonctionne le tirage de fortune ?', a: 'Pensez à une question, puis cliquez sur le bâton de fortune pour tirer une fortune numérotée (签文).' },
      { q: 'Que signifient les numéros de fortune ?', a: 'Les fortunes sont numérotées de 1 à 100, avec des classements traditionnels comme 上上 (le plus auspice), 上 (auspice), 中 (milieu), 下 (inférieur).' },
      { q: 'Le tirage de fortune est-il une forme de divination ?', a: 'C\'est une pratique culturelle traditionnelle chinoise. Ce n\'est pas une science.' },
    ],
    hi: [
      { q: 'भाग्य रेखांकन कैसे काम करता है?', a: 'एक प्रश्न पर सोचें, फिर एक क्रमांकित भाग्य (签文) निकालने के लिए भाग्य छड़ी पर क्लिक करें।' },
      { q: 'भाग्य संख्याओं का क्या मतलब है?', a: 'भाग्य 1 से 100 तक क्रमांकित हैं, पारंपरिक रैंकिंग के साथ।' },
      { q: 'क्या भाग्य रेखांकन भविष्यवाणी का एक रूप है?', a: 'यह एक पारंपरिक चीनी सांस्कृतिक अभ्यास है। यह विज्ञान नहीं है।' },
    ],
    ar: [
      { q: 'كيف يعمل سحب الحظ؟', a: 'فكر في سؤال، ثم انقر على عصا الحظ لسحب حظ مرقم (签文).' },
      { q: 'ما معنى أرقام الحظ؟', a: 'الأحظار مرقمة من 1 إلى 100 مع تصنيفات تقليدية.' },
      { q: 'هل سحب الحظ هو شكل من أشكال العرافة؟', a: 'إنها ممارسة ثقافية صينية تقليدية. إنه ليس علماً.' },
    ],
  },
  'love-letter-generator': {
    en: [
      { q: 'How personalized is the love letter?', a: 'The generator takes into account the recipient\'s personality type, relationship duration, and your preferred letter style (romantic, poetic, funny, or sincere).' },
      { q: 'Can I include an acrostic in the letter?', a: 'Yes, enable the acrostic option and enter a keyword (like your partner\'s name). The first letter of each line will spell out your chosen word.' },
      { q: 'Is there a limit to how many letters I can generate?', a: 'No, generate as many versions as you want until you find the perfect one.' },
    ],
    zh: [
      { q: '情书的个性化程度如何？', a: '生成器会考虑对方的性格类型、相处时长和你偏好的情书风格。' },
      { q: '可以在信中藏头诗吗？', a: '可以，开启藏头诗选项并输入关键词（如对方名字）。' },
      { q: '生成次数有限制吗？', a: '没有限制，想生成多少版本就生成多少。' },
    ],
    es: [
      { q: '¿Qué tan personalizada es la carta de amor?', a: 'El generador toma en cuenta el tipo de personalidad del destinatario, la duración de la relación y tu estilo de carta preferido.' },
      { q: '¿Puedo incluir un acróstico en la carta?', a: 'Sí, activa la opción de acróstico e ingresa una palabra clave.' },
      { q: '¿Hay un límite de cartas que puedo generar?', a: 'No, genera tantas versiones como quieras.' },
    ],
    fr: [
      { q: 'La lettre d\'amour est-elle personnalisée ?', a: 'Le générateur prend en compte le type de personnalité du destinataire, la durée de la relation et votre style préféré.' },
      { q: 'Puis-je inclure un acrostiche dans la lettre ?', a: 'Oui, activez l\'option acrostiche et entrez un mot-clé.' },
      { q: 'Y a-t-il une limite au nombre de lettres que je peux générer ?', a: 'Non, générez autant de versions que vous voulez.' },
    ],
    hi: [
      { q: 'प्रेम पत्र कितना व्यक्तिगत है?', a: 'जनरेटर प्राप्तकर्ता के व्यक्तित्व प्रकार, रिश्ते की अवधि, और आपकी पसंदीदा शैली को ध्यान में रखता है।' },
      { q: 'क्या मैं पत्र में व्यंजना शामिल कर सकता हूँ?', a: 'हाँ, व्यंजना विकल्प को सक्षम करें और एक कीवर्ड दर्ज करें।' },
      { q: 'क्या मैं जितने चाहें उतने पत्र बना सकता हूँ?', a: 'हाँ, कोई सीमा नहीं है।' },
    ],
    ar: [
      { q: 'ما مدى تخصيص رسالة الحب؟', a: 'يأخذ المنشئ في الاعتبار نوع شخصية المتلقي ومدة العلاقة وأسلوبك المفضل.' },
      { q: 'هل يمكنني تضمين أخفائية في الرسالة؟', a: 'نعم، قم بتمكين خيار الأخفائية وأدخل كلمة مفتاحية.' },
      { q: 'هل هناك حد لعدد الرسائل التي يمكنني إنشاؤها؟', a: 'لا، أنشئ بقدر ما تشاء.' },
    ],
  },
  'color-mood-board': {
    en: [
      { q: 'How does color psychology work?', a: 'Color psychology studies how colors affect our emotions and behavior. Different colors are associated with different moods.' },
      { q: 'Can I use custom mood keywords?', a: 'Yes, enter any mood or emotion word in any language. The tool matches your input to color psychology associations.' },
      { q: 'How many colors are in each palette?', a: 'Each palette contains 5 carefully chosen colors that harmonize with your input mood.' },
    ],
    zh: [
      { q: '色彩心理学是如何工作的？', a: '色彩心理学研究颜色如何影响我们的情绪和行为。不同颜色与不同情绪相关联。' },
      { q: '可以使用自定义情绪关键词吗？', a: '可以，用任意语言输入心情或情绪词。' },
      { q: '每个调色板包含多少颜色？', a: '每个调色板包含5种精心挑选的颜色。' },
    ],
    es: [
      { q: '¿Cómo funciona la psicología del color?', a: 'La psicología del color estudia cómo los colores afectan nuestras emociones y comportamiento.' },
      { q: '¿Puedo usar palabras clave de estado de ánimo personalizadas?', a: 'Sí, ingresa cualquier palabra de estado de ánimo o emoción en cualquier idioma.' },
      { q: '¿Cuántos colores hay en cada paleta?', a: 'Cada paleta contiene 5 colores cuidadosamente elegidos.' },
    ],
    fr: [
      { q: 'Comment fonctionne la psychologie des couleurs ?', a: 'La psychologie des couleurs étudie comment les couleurs affectent nos émotions et notre comportement.' },
      { q: 'Puis-je utiliser des mots-clés d\'humeur personnalisés ?', a: 'Oui, entrez n\'importe quel mot d\'humeur ou d\'émotion dans n\'importe quelle langue.' },
      { q: 'Combien de couleurs contient chaque palette ?', a: 'Chaque palette contient 5 couleurs soigneusement choisies.' },
    ],
    hi: [
      { q: 'रंग मनोविज्ञान कैसे काम करता है?', a: 'रंग मनोविज्ञान अध्ययन करता है कि रंग हमारी भावनाओं और व्यवहार को कैसे प्रभावित करते हैं।' },
      { q: 'क्या मैं कस्टम मूड कीवर्ड का उपयोग कर सकता हूँ?', a: 'हाँ, किसी भी भाषा में कोई भी मूड या भावना शब्द दर्ज करें।' },
      { q: 'प्रत्येक पैलेट में कितने रंग होते हैं?', a: 'प्रत्येक पैलेट में 5 सावधानी से चुने गए रंग होते हैं।' },
    ],
    ar: [
      { q: 'كيف يعمل علم نفس الألوان؟', a: 'يدرس علم نفس الألوان كيف تؤثر الألوان على عواطفنا وسلوكنا.' },
      { q: 'هل يمكنني استخدام كلمات مفتاحية للحالة المزاجية المخصصة؟', a: 'نعم، أدخل أي كلمة حالة مزاجية أو عاطفة بأي لغة.' },
      { q: 'كم عدد الألوان في كل لوحة؟', a: 'تحتوي كل لوحة على 5 ألوان مختارة بعناية.' },
    ],
  },
  'classical-chinese-converter': {
    en: [
      { q: 'What styles of classical Chinese are supported?', a: 'We support multiple classical Chinese styles including 文言文 (wenyan), 半文半白 (semi-classical), and various literary periods.' },
      { q: 'How accurate is the conversion?', a: 'The tool uses rule-based conversion with a classical Chinese dictionary. It handles common patterns well but may not perfectly capture the nuances of classical literature.' },
      { q: 'Can I convert classical Chinese back to modern Chinese?', a: 'The tool currently converts modern to classical Chinese only. For reverse conversion, we recommend using a classical Chinese dictionary.' },
    ],
    zh: [
      { q: '支持哪些古文风格？', a: '我们支持多种古文风格，包括文言文、半文半白等不同时期的文言文风格。' },
      { q: '转换的准确性如何？', a: '工具使用基于规则的转换和古文字典，能很好地处理常见模式，但可能无法完全捕捉古典文学的微妙之处。' },
      { q: '可以将古文转回现代文吗？', a: '工具目前只支持现代文转文言文。如需反向转换，建议使用古文字典。' },
    ],
    es: [
      { q: '¿Qué estilos de chino clásico se admiten?', a: 'Admitimos múltiples estilos de chino clásico, incluidos 文言文 (wenyan), 半文半白 (semi-clásico) y varios períodos literarios.' },
      { q: '¿Qué tan precisa es la conversión?', a: 'La herramienta utiliza conversión basada en reglas con un diccionario de chino clásico.' },
      { q: '¿Puedo convertir el chino clásico de vuelta a chino moderno?', a: 'La herramienta actualmente solo convierte de moderno a clásico.' },
    ],
    fr: [
      { q: 'Quels styles de chinois classique sont pris en charge ?', a: 'Nous prenons en charge plusieurs styles de chinois classique, notamment 文言文 (wenyan), 半文半白 (semi-classique) et diverses périodes littéraires.' },
      { q: 'La conversion est-elle précise ?', a: 'L\'outil utilise une conversion basée sur des règles avec un dictionnaire de chinois classique.' },
      { q: 'Puis-je reconvertir le chinois classique en chinois moderne ?', a: 'L\'outil convertit actuellement uniquement du moderne au classique.' },
    ],
    hi: [
      { q: 'कौन सी शास्त्रीय चीनी शैलियाँ समर्थित हैं?', a: 'हम 文言文 (wenyan), 半文半白 (अर्ध-शास्त्रीय) और विभिन्न साहित्यिक काल सहित कई शास्त्रीय चीनी शैलियों का समर्थन करते हैं।' },
      { q: 'रूपांतरण कितना सटीक है?', a: 'उपकरण एक शास्त्रीय चीनी शब्दकोश के साथ नियम-आधारित रूपांतरण का उपयोग करता है।' },
      { q: 'क्या मैं शास्त्रीय चीनी को वापस आधुनिक चीनी में बदल सकता हूँ?', a: 'उपकरण वर्तमान में केवल आधुनिक से शास्त्रीय चीनी में रूपांतरित करता है।' },
    ],
    ar: [
      { q: 'ما هي أنماط الصينية الكلاسيكية المدعومة؟', a: 'ندعم أنماطاً متعددة من الصينية الكلاسيكية، بما في ذلك 文言文 (wenyan)، 半文半白 (شبه كلاسيكي) وفترات أدبية مختلفة.' },
      { q: 'ما مدى دقة التحويل؟', a: 'تستخدم الأداة التحويل القائم على القواعد مع قاموس صيني كلاسيكي.' },
      { q: 'هل يمكنني تحويل الصينية الكلاسيكية مرة أخرى إلى الصينية الحديثة؟', a: 'تقوم الأداة حالياً بالتحويل فقط من الحديثة إلى الكلاسيكية.' },
    ],
  },
  'password-generator': {
    en: [
      { q: 'Is this password generator secure?', a: 'Yes, all passwords are generated locally in your browser using the Web Crypto API. Nothing is transmitted or stored on a server.' },
      { q: 'What types of passwords can I generate?', a: 'You can generate alphanumeric passwords, passwords with symbols, numeric PIN codes, and memorable passphrases with customizable length and character sets.' },
      { q: 'Are generated passwords stored anywhere?', a: 'No, generated passwords are never stored or logged. They exist only in your current browser session and disappear when you close the tab.' },
    ],
    zh: [
      { q: '这个密码生成器安全吗？', a: '是的，所有密码都在你的浏览器中使用 Web Crypto API 本地生成，不会传输或存储到任何服务器。' },
      { q: '可以生成哪些类型的密码？', a: '你可以生成字母数字密码、含符号密码、数字 PIN 码以及易记的密码短语，并可自定义长度和字符集。' },
      { q: '生成的密码会被存储吗？', a: '不会，生成的密码从不存储或记录，仅存在于当前浏览器会话中，关闭标签页即消失。' },
    ],
    es: [
      { q: '¿Es seguro este generador de contraseñas?', a: 'Sí, todas las contraseñas se generan localmente en tu navegador usando la API Web Crypto. Nada se transmite ni almacena.' },
      { q: '¿Qué tipos de contraseñas puedo generar?', a: 'Puedes generar contraseñas alfanuméricas, con símbolos, códigos PIN numéricos y frases de contraseña memorables con longitud y conjuntos de caracteres personalizables.' },
      { q: '¿Se almacenan las contraseñas generadas?', a: 'No, las contraseñas generadas nunca se almacenan ni registran. Solo existen en tu sesión actual del navegador.' },
    ],
    fr: [
      { q: 'Ce générateur de mots de passe est-il sécurisé ?', a: 'Oui, tous les mots de passe sont générés localement dans votre navigateur via l\'API Web Crypto. Rien n\'est transmis ni stocké.' },
      { q: 'Quels types de mots de passe puis-je générer ?', a: 'Vous pouvez générer des mots de passe alphanumériques, avec symboles, des codes PIN numériques et des phrases de passe mémorisables avec longueur et jeux de caractères personnalisables.' },
      { q: 'Les mots de passe générés sont-ils stockés ?', a: 'Non, les mots de passe générés ne sont jamais stockés ni enregistrés. Ils n\'existent que dans votre session de navigateur actuelle.' },
    ],
    hi: [
      { q: 'क्या यह पासवर्ड जनरेटर सुरक्षित है?', a: 'हाँ, सभी पासवर्ड आपके ब्राउज़र में Web Crypto API का उपयोग करके स्थानीय रूप से उत्पन्न होते हैं। कुछ भी ट्रांसमिट या स्टोर नहीं किया जाता।' },
      { q: 'मैं किस प्रकार के पासवर्ड उत्पन्न कर सकता हूँ?', a: 'आप अल्फ़ान्यूमेरिक, सिंबल वाले, न्यूमेरिक PIN कोड और याद रखने योग्य पासफ़्रेज़ उत्पन्न कर सकते हैं, जिनकी लंबाई और कैरेक्टर सेट कस्टमाइज़ कर सकते हैं।' },
      { q: 'क्या उत्पन्न पासवर्ड कहीं संग्रहीत होते हैं?', a: 'नहीं, उत्पन्न पासवर्ड कभी संग्रहीत या लॉग नहीं किए जाते। वे केवल आपके वर्तमान ब्राउज़र सत्र में मौजूद रहते हैं।' },
    ],
    ar: [
      { q: 'هل مولد كلمات المرور هذا آمن؟', a: 'نعم، يتم توليد جميع كلمات المرور محلياً في متصفحك باستخدام Web Crypto API. لا يتم نقل أو تخزين أي شيء.' },
      { q: 'ما أنواع كلمات المرور التي يمكنني توليدها؟', a: 'يمكنك توليد كلمات مرور أبجدية رقمية، ورموز، وأكواد PIN رقمية، وعبارات مرور يسهل تذكرها مع طول ومجموعات أحرف قابلة للتخصيص.' },
      { q: 'هل يتم تخزين كلمات المرور المولدة؟', a: 'لا، لا يتم تخزين أو تسجيل كلمات المرور المولدة أبداً. وهي موجودة فقط في جلسة المتصفح الحالية وتختفي عند إغلاق التبويب.' },
    ],
  },
  'uuid-generator': {
    en: [
      { q: 'What UUID versions are supported?', a: 'We support UUID v4 (fully random) and UUID v7 (time-sortable), the most commonly used versions in modern applications and databases.' },
      { q: 'Are generated UUIDs truly unique?', a: 'Yes, UUID v4 uses 122 bits of randomness, making accidental collisions practically impossible even when generating millions of IDs.' },
      { q: 'Can I generate bulk UUIDs at once?', a: 'Yes, you can generate up to thousands of UUIDs in a single click and copy them as a newline-separated list.' },
    ],
    zh: [
      { q: '支持哪些 UUID 版本？', a: '我们支持 UUID v4（完全随机）和 UUID v7（可按时间排序），是现代应用和数据库中最常用的版本。' },
      { q: '生成的 UUID 真的唯一吗？', a: '是的，UUID v4 使用 122 位随机数，即使生成数百万个 ID，意外碰撞的概率也几乎为零。' },
      { q: '可以一次批量生成 UUID 吗？', a: '可以，你可以一键生成多达数千个 UUID，并以换行分隔的列表形式复制。' },
    ],
    es: [
      { q: '¿Qué versiones de UUID se admiten?', a: 'Admitimos UUID v4 (totalmente aleatorio) y UUID v7 (ordenable por tiempo), las versiones más utilizadas en aplicaciones y bases de datos modernas.' },
      { q: '¿Los UUID generados son realmente únicos?', a: 'Sí, UUID v4 usa 122 bits de aleatoriedad, lo que hace que las colisiones accidentales sean prácticamente imposibles incluso generando millones de IDs.' },
      { q: '¿Puedo generar UUIDs en lote a la vez?', a: 'Sí, puedes generar hasta miles de UUIDs con un solo clic y copiarlos como una lista separada por saltos de línea.' },
    ],
    fr: [
      { q: 'Quelles versions d\'UUID sont prises en charge ?', a: 'Nous prenons en charge UUID v4 (entièrement aléatoire) et UUID v7 (triable par temps), les versions les plus utilisées dans les applications et bases de données modernes.' },
      { q: 'Les UUID générés sont-ils vraiment uniques ?', a: 'Oui, UUID v4 utilise 122 bits d\'aléatoire, ce qui rend les collisions accidentelles pratiquement impossibles même en générant des millions d\'ID.' },
      { q: 'Puis-je générer des UUID en lot à la fois ?', a: 'Oui, vous pouvez générer jusqu\'à des milliers d\'UUID en un clic et les copier sous forme de liste séparée par des sauts de ligne.' },
    ],
    hi: [
      { q: 'कौन से UUID संस्करण समर्थित हैं?', a: 'हम UUID v4 (पूरी तरह यादृच्छिक) और UUID v7 (समय-क्रमबद्ध) का समर्थन करते हैं, जो आधुनिक अनुप्रयोगों और डेटाबेस में सबसे अधिक उपयोग किए जाते हैं।' },
      { q: 'क्या उत्पन्न UUID वास्तव में अद्वितीय हैं?', a: 'हाँ, UUID v4 122 बिट्स की यादृच्छिकता का उपयोग करता है, जिससे लाखों ID उत्पन्न करने पर भी टकराव लगभग असंभव हो जाता है।' },
      { q: 'क्या मैं एक बार में बल्क UUID उत्पन्न कर सकता हूँ?', a: 'हाँ, आप एक क्लिक में हजारों UUID उत्पन्न कर सकते हैं और उन्हें नई लाइन से अलग सूची के रूप में कॉपी कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما هي إصدارات UUID المدعومة؟', a: 'ندعم UUID v4 (عشوائي بالكامل) و UUID v7 (قابل للفرز زمنياً)، وهي الإصدارات الأكثر استخداماً في التطبيقات وقواعد البيانات الحديثة.' },
      { q: 'هل معرفات UUID المولدة فريدة حقاً؟', a: 'نعم، يستخدم UUID v4 122 بت من العشوائية، مما يجعل التصادمات العرضية مستحيلة عملياً حتى عند توليد ملايين المعرفات.' },
      { q: 'هل يمكنني توليد UUIDs بالجملة دفعة واحدة؟', a: 'نعم، يمكنك توليد حتى آلاف UUIDs بنقرة واحدة ونسخها كقائمة مفصولة بأسطر جديدة.' },
    ],
  },
  'image-to-base64': {
    en: [
      { q: 'What image formats are supported?', a: 'We support PNG, JPEG, GIF, WebP, SVG, BMP, and ICO images for instant Base64 conversion.' },
      { q: 'Is there a file size limit?', a: 'Since all processing happens in your browser, very large images may slow down. We recommend keeping images under 10MB for best performance.' },
      { q: 'Does the tool upload my images?', a: 'No, images are processed entirely in your browser and never uploaded to any server, ensuring complete privacy.' },
    ],
    zh: [
      { q: '支持哪些图片格式？', a: '我们支持 PNG、JPEG、GIF、WebP、SVG、BMP 和 ICO 图片的即时 Base64 转换。' },
      { q: '有文件大小限制吗？', a: '由于所有处理都在浏览器中完成，过大的图片可能会变慢。建议图片保持在 10MB 以下以获得最佳性能。' },
      { q: '工具会上传我的图片吗？', a: '不会，图片完全在你的浏览器中处理，从不上传到任何服务器，确保完全隐私。' },
    ],
    es: [
      { q: '¿Qué formatos de imagen se admiten?', a: 'Admitimos imágenes PNG, JPEG, GIF, WebP, SVG, BMP e ICO para conversión instantánea a Base64.' },
      { q: '¿Hay un límite de tamaño de archivo?', a: 'Como todo el procesamiento ocurre en tu navegador, las imágenes muy grandes pueden ralentizarlo. Recomendamos mantener las imágenes por debajo de 10MB.' },
      { q: '¿La herramienta sube mis imágenes?', a: 'No, las imágenes se procesan completamente en tu navegador y nunca se suben a ningún servidor, garantizando total privacidad.' },
    ],
    fr: [
      { q: 'Quels formats d\'image sont pris en charge ?', a: 'Nous prenons en charge les images PNG, JPEG, GIF, WebP, SVG, BMP et ICO pour une conversion Base64 instantanée.' },
      { q: 'Y a-t-il une limite de taille de fichier ?', a: 'Comme tout le traitement se fait dans votre navigateur, les très grandes images peuvent ralentir. Nous recommandons de garder les images sous 10 Mo.' },
      { q: 'L\'outil télécharge-t-il mes images ?', a: 'Non, les images sont traitées entièrement dans votre navigateur et ne sont jamais téléchargées vers un serveur, garantissant une confidentialité totale.' },
    ],
    hi: [
      { q: 'कौन से इमेज प्रारूप समर्थित हैं?', a: 'हम तत्काल Base64 रूपांतरण के लिए PNG, JPEG, GIF, WebP, SVG, BMP और ICO छवियों का समर्थन करते हैं।' },
      { q: 'क्या कोई फ़ाइल आकार सीमा है?', a: 'चूंकि सभी प्रोसेसिंग आपके ब्राउज़र में होती है, बहुत बड़ी छवियां धीमी हो सकती हैं। सर्वोत्तम प्रदर्शन के लिए छवियों को 10MB से नीचे रखने की सिफारिश की जाती है।' },
      { q: 'क्या यह टूल मेरी छवियां अपलोड करता है?', a: 'नहीं, छवियां पूरी तरह से आपके ब्राउज़र में प्रोसेस होती हैं और कभी किसी सर्वर पर अपलोड नहीं होतीं, जिससे पूर्ण गोपनीयता सुनिश्चित होती है।' },
    ],
    ar: [
      { q: 'ما تنسيقات الصور المدعومة؟', a: 'ندعم صور PNG و JPEG و GIF و WebP و SVG و BMP و ICO للتحويل الفوري إلى Base64.' },
      { q: 'هل هناك حد لحجم الملف؟', a: 'نظراً لأن كل المعالجة تتم في متصفحك، فإن الصور الكبيرة جداً قد تبطئ الأداء. نوصي بإبقاء الصور أقل من 10 ميجابايت.' },
      { q: 'هل تقوم الأداة برفع صوري؟', a: 'لا، تتم معالجة الصور بالكامل في متصفحك ولا يتم رفعها أبداً إلى أي خادم، مما يضمن خصوصية كاملة.' },
    ],
  },
  'markdown-preview': {
    en: [
      { q: 'What markdown flavors are supported?', a: 'We support GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, autolinks, and fenced code blocks.' },
      { q: 'Can I export the preview?', a: 'Yes, you can export the rendered preview as a standalone HTML file or copy the formatted HTML to your clipboard.' },
      { q: 'Does it support syntax highlighting?', a: 'Yes, code blocks are highlighted with syntax coloring for over 180 programming languages and themes.' },
    ],
    zh: [
      { q: '支持哪些 Markdown 风格？', a: '我们支持 GitHub Flavored Markdown（GFM），包括表格、任务列表、删除线、自动链接和围栏代码块。' },
      { q: '可以导出预览吗？', a: '可以，你可以将渲染后的预览导出为独立的 HTML 文件，或将格式化后的 HTML 复制到剪贴板。' },
      { q: '支持语法高亮吗？', a: '是的，代码块支持超过 180 种编程语言和主题的语法着色高亮。' },
    ],
    es: [
      { q: '¿Qué sabores de Markdown se admiten?', a: 'Admitimos GitHub Flavored Markdown (GFM) incluyendo tablas, listas de tareas, tachado, enlaces automáticos y bloques de código cercados.' },
      { q: '¿Puedo exportar la vista previa?', a: 'Sí, puedes exportar la vista previa renderizada como un archivo HTML independiente o copiar el HTML formateado al portapapeles.' },
      { q: '¿Admite resaltado de sintaxis?', a: 'Sí, los bloques de código se resaltan con coloración de sintaxis para más de 180 lenguajes de programación y temas.' },
    ],
    fr: [
      { q: 'Quelles variantes de Markdown sont prises en charge ?', a: 'Nous prenons en charge GitHub Flavored Markdown (GFM) incluant tableaux, listes de tâches, barré, liens automatiques et blocs de code délimités.' },
      { q: 'Puis-je exporter l\'aperçu ?', a: 'Oui, vous pouvez exporter l\'aperçu rendu sous forme de fichier HTML autonome ou copier le HTML formaté dans le presse-papiers.' },
      { q: 'Prend-il en charge la coloration syntaxique ?', a: 'Oui, les blocs de code sont colorés avec une coloration syntaxique pour plus de 180 langages de programmation et thèmes.' },
    ],
    hi: [
      { q: 'कौन से Markdown स्वाद समर्थित हैं?', a: 'हम GitHub Flavored Markdown (GFM) का समर्थन करते हैं जिसमें टेबल, कार्य सूचियाँ, स्ट्राइकथ्रू, ऑटोलिंक और फेंस्ड कोड ब्लॉक शामिल हैं।' },
      { q: 'क्या मैं पूर्वावलोकन निर्यात कर सकता हूँ?', a: 'हाँ, आप रेंडर किए गए पूर्वावलोकन को स्टैंडअलोन HTML फ़ाइल के रूप में निर्यात कर सकते हैं या स्वरूपित HTML को क्लिपबोर्ड पर कॉपी कर सकते हैं।' },
      { q: 'क्या यह सिंटैक्स हाइलाइटिंग का समर्थन करता है?', a: 'हाँ, कोड ब्लॉक को 180 से अधिक प्रोग्रामिंग भाषाओं और थीम के लिए सिंटैक्स कलरिंग के साथ हाइलाइट किया जाता है।' },
    ],
    ar: [
      { q: 'ما أنواع Markdown المدعومة؟', a: 'ندعم GitHub Flavored Markdown (GFM) بما في ذلك الجداول وقوائم المهام والشطب والروابط التلقائية وكتل التعليمات البرمجية المسوّرة.' },
      { q: 'هل يمكنني تصدير المعاينة؟', a: 'نعم، يمكنك تصدير المعاينة المعروضة كملف HTML مستقل أو نسخ HTML المنسق إلى الحافظة.' },
      { q: 'هل يدعم تمييز بناء الجملة؟', a: 'نعم، يتم تمييز كتل التعليمات البرمجية بألوان بناء الجملة لأكثر من 180 لغة برمجة وسمات.' },
    ],
  },
  'url-encode-decode': {
    en: [
      { q: 'What is URL encoding?', a: 'URL encoding converts special characters into a percent-encoded format (like %20 for space) so they can be safely transmitted in a URL.' },
      { q: 'Which encoding standard is used?', a: 'We use percent-encoding per RFC 3986, the official standard for URI encoding used across the modern web.' },
      { q: 'Can it handle Unicode characters?', a: 'Yes, it correctly encodes Unicode characters including emoji and CJK characters using UTF-8 percent-encoding.' },
    ],
    zh: [
      { q: '什么是 URL 编码？', a: 'URL 编码将特殊字符转换为百分号编码格式（如空格变为 %20），以便在 URL 中安全传输。' },
      { q: '使用哪种编码标准？', a: '我们使用 RFC 3986 标准的百分号编码，这是现代网络 URI 编码的官方标准。' },
      { q: '能处理 Unicode 字符吗？', a: '可以，它能使用 UTF-8 百分号编码正确处理包括 emoji 和中日韩字符在内的 Unicode 字符。' },
    ],
    es: [
      { q: '¿Qué es la codificación URL?', a: 'La codificación URL convierte caracteres especiales en formato de codificación porcentual (como %20 para espacio) para transmitirlos de forma segura en una URL.' },
      { q: '¿Qué estándar de codificación se usa?', a: 'Usamos codificación porcentual según RFC 3986, el estándar oficial para codificación URI utilizado en la web moderna.' },
      { q: '¿Puede manejar caracteres Unicode?', a: 'Sí, codifica correctamente caracteres Unicode incluyendo emoji y caracteres CJK usando codificación porcentual UTF-8.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que l\'encodage URL ?', a: 'L\'encodage URL convertit les caractères spéciaux en format pourcent-encodé (comme %20 pour l\'espace) afin de les transmettre en toute sécurité dans une URL.' },
      { q: 'Quelle norme d\'encodage est utilisée ?', a: 'Nous utilisons l\'encodage pourcentage selon RFC 3986, la norme officielle d\'encodage URI utilisée sur le Web moderne.' },
      { q: 'Peut-il gérer les caractères Unicode ?', a: 'Oui, il encode correctement les caractères Unicode y compris les emoji et les caractères CJK avec l\'encodage UTF-8.' },
    ],
    hi: [
      { q: 'URL एन्कोडिंग क्या है?', a: 'URL एन्कोडिंग विशेष वर्णों को प्रतिशत-एन्कोडेड प्रारूप (जैसे स्पेस के लिए %20) में परिवर्तित करता है ताकि उन्हें URL में सुरक्षित रूप से प्रसारित किया जा सके।' },
      { q: 'कौन सा एन्कोडिंग मानक उपयोग किया जाता है?', a: 'हम RFC 3986 के अनुसार प्रतिशत-एन्कोडिंग का उपयोग करते हैं, जो आधुनिक वेब पर URI एन्कोडिंग के लिए आधिकारिक मानक है।' },
      { q: 'क्या यह Unicode वर्णों को संभाल सकता है?', a: 'हाँ, यह UTF-8 प्रतिशत-एन्कोडिंग का उपयोग करके emoji और CJK वर्णों सहित Unicode वर्णों को सही ढंग से एन्कोड करता है।' },
    ],
    ar: [
      { q: 'ما هو ترميز URL؟', a: 'ترميز URL يحول الأحرف الخاصة إلى صيغة مرمزة بنسبة مئوية (مثل %20 للمسافة) بحيث يمكن نقلها بأمان في عنوان URL.' },
      { q: 'ما معيار الترميز المستخدم؟', a: 'نستخدم الترميز بنسبة مئوية وفقاً لـ RFC 3986، المعيار الرسمي لترميز URI المستخدم في الويب الحديث.' },
      { q: 'هل يمكنه التعامل مع أحرف Unicode؟', a: 'نعم، يقوم بترميز أحرف Unicode بشكل صحيح بما في ذلك الإيموجي وأحرف CJK باستخدام ترميز UTF-8.' },
    ],
  },
  'text-counter': {
    en: [
      { q: 'What metrics does it count?', a: 'It counts characters, words, sentences, paragraphs, reading time, and estimated speaking time in real time as you type.' },
      { q: 'Does it count CJK characters correctly?', a: 'Yes, it correctly counts Chinese, Japanese, and Korean characters as individual words, unlike many counters that miscount them.' },
      { q: 'Is my text uploaded anywhere?', a: 'No, all counting happens locally in your browser. Your text never leaves your device.' },
    ],
    zh: [
      { q: '它能统计哪些指标？', a: '它在你输入时实时统计字符数、单词数、句子数、段落数、阅读时间和预计演讲时间。' },
      { q: '能正确统计中日韩字符吗？', a: '可以，它能将中文、日文和韩文字符作为单独的单词正确统计，不像许多计数器会错误统计。' },
      { q: '我的文本会被上传吗？', a: '不会，所有统计都在浏览器本地完成，你的文本永远不会离开你的设备。' },
    ],
    es: [
      { q: '¿Qué métricas cuenta?', a: 'Cuenta caracteres, palabras, oraciones, párrafos, tiempo de lectura y tiempo estimado de habla en tiempo real mientras escribes.' },
      { q: '¿Cuenta correctamente los caracteres CJK?', a: 'Sí, cuenta correctamente los caracteres chinos, japoneses y coreanos como palabras individuales, a diferencia de muchos contadores que los cuentan mal.' },
      { q: '¿Se sube mi texto a algún lugar?', a: 'No, todo el conteo ocurre localmente en tu navegador. Tu texto nunca sale de tu dispositivo.' },
    ],
    fr: [
      { q: 'Quelles métriques compte-t-il ?', a: 'Il compte les caractères, mots, phrases, paragraphes, le temps de lecture et le temps de parole estimé en temps réel pendant que vous tapez.' },
      { q: 'Compte-t-il correctement les caractères CJK ?', a: 'Oui, il compte correctement les caractères chinois, japonais et coréens comme des mots individuels, contrairement à de nombreux compteurs qui les comptent mal.' },
      { q: 'Mon texte est-il téléchargé quelque part ?', a: 'Non, tout le comptage se fait localement dans votre navigateur. Votre texte ne quitte jamais votre appareil.' },
    ],
    hi: [
      { q: 'यह कौन से मेट्रिक्स गिनता है?', a: 'यह आपके टाइप करते समय वर्ण, शब्द, वाक्य, पैराग्राफ, पढ़ने का समय और अनुमानित बोलने का समय वास्तविक समय में गिनता है।' },
      { q: 'क्या यह CJK वर्णों को सही ढंग से गिनता है?', a: 'हाँ, यह चीनी, जापानी और कोरियाई वर्णों को व्यक्तिगत शब्दों के रूप में सही ढंग से गिनता है, कई काउंटरों के विपरीत जो उन्हें गलत गिनते हैं।' },
      { q: 'क्या मेरा टेक्स्ट कहीं अपलोड होता है?', a: 'नहीं, सभी गिनती आपके ब्राउज़र में स्थानीय रूप से होती है। आपका टेक्स्ट कभी आपके डिवाइस से बाहर नहीं जाता।' },
    ],
    ar: [
      { q: 'ما المقاييس التي يحسبها؟', a: 'يحسب الأحرف والكلمات والجمل والفقرات ووقت القراءة ووقت التحدث المقدر في الوقت الفعلي أثناء الكتابة.' },
      { q: 'هل يحسب أحرف CJK بشكل صحيح؟', a: 'نعم، يحسب الأحرف الصينية واليابانية والكورية بشكل صحيح ككلمات فردية، على عكس العديد من العدادات التي تحسبها بشكل خاطئ.' },
      { q: 'هل يتم رفع نصي إلى أي مكان؟', a: 'لا، تتم جميع العمليات الحسابية محلياً في متصفحك. لا يغادر نصك جهازك أبداً.' },
    ],
  },
  'title-weight-checker': {
    en: [
      { q: 'What does title weight mean?', a: 'Title weight measures the SEO strength of a page title based on length, keyword placement, and relevance signals that affect search ranking.' },
      { q: 'How is the score calculated?', a: 'Titles are scored against best practices for length (50-60 characters), keyword position, power words, and click-through appeal.' },
      { q: 'What is a good title score?', a: 'A score above 80 indicates a well-optimized title. Below 60 suggests you should revise length, keyword placement, or wording.' },
    ],
    zh: [
      { q: '标题权重是什么意思？', a: '标题权重衡量页面标题的 SEO 强度，基于影响搜索排名的长度、关键词位置和相关性信号。' },
      { q: '分数是如何计算的？', a: '标题根据长度（50-60 字符）、关键词位置、力量词和点击吸引力的最佳实践进行评分。' },
      { q: '多少分算是好标题？', a: '80 分以上表示标题优化良好。低于 60 分建议修改长度、关键词位置或措辞。' },
    ],
    es: [
      { q: '¿Qué significa el peso del título?', a: 'El peso del título mide la fuerza SEO de un título de página según longitud, ubicación de palabras clave y señales de relevancia que afectan el ranking.' },
      { q: '¿Cómo se calcula la puntuación?', a: 'Los títulos se puntúan según mejores prácticas de longitud (50-60 caracteres), posición de palabras clave, palabras de poder y atractivo de clics.' },
      { q: '¿Cuál es una buena puntuación de título?', a: 'Una puntuación superior a 80 indica un título bien optimizado. Por debajo de 60 sugiere que debes revisar longitud, palabras clave o redacción.' },
    ],
    fr: [
      { q: 'Que signifie le poids du titre ?', a: 'Le poids du titre mesure la force SEO d\'un titre de page selon la longueur, le placement des mots-clés et les signaux de pertinence affectant le classement.' },
      { q: 'Comment le score est-il calculé ?', a: 'Les titres sont notés selon les bonnes pratiques de longueur (50-60 caractères), position des mots-clés, mots puissants et attrait de clic.' },
      { q: 'Qu\'est-ce qu\'un bon score de titre ?', a: 'Un score supérieur à 80 indique un titre bien optimisé. En dessous de 60, vous devriez réviser la longueur, les mots-clés ou la formulation.' },
    ],
    hi: [
      { q: 'टाइटल वेट का क्या अर्थ है?', a: 'टाइटल वेट लंबाई, कीवर्ड प्लेसमेंट और प्रासंगिकता संकेतों के आधार पर पेज शीर्षक की SEO ताकत को मापता है जो खोज रैंकिंग को प्रभावित करते हैं।' },
      { q: 'स्कोर की गणना कैसे की जाती है?', a: 'शीर्षकों को लंबाई (50-60 वर्ण), कीवर्ड स्थिति, पावर शब्दों और क्लिक-थ्रू आकर्षण की सर्वोत्तम प्रथाओं के विरुद्ध स्कोर किया जाता है।' },
      { q: 'एक अच्छा टाइटल स्कोर क्या है?', a: '80 से ऊपर का स्कोर एक अच्छी तरह से अनुकूलित शीर्षक दर्शाता है। 60 से नीचे लंबाई, कीवर्ड स्थिति या शब्दावली संशोधन का सुझाव देता है।' },
    ],
    ar: [
      { q: 'ماذا يعني وزن العنوان؟', a: 'يقيس وزن العنوان قوة SEO لعنوان الصفحة بناءً على الطول وموضع الكلمات الرئيسية وإشارات الصلة التي تؤثر على الترتيب.' },
      { q: 'كيف يتم حساب النتيجة؟', a: 'يتم تقييم العناوين وفقاً لأفضل الممارسات للطول (50-60 حرفاً) وموضع الكلمات الرئيسية والكلمات القوية وجاذبية النقر.' },
      { q: 'ما هي نتيجة العنوان الجيدة؟', a: 'النتيجة فوق 80 تشير إلى عنوان محسّن جيداً. أقل من 60 يقترح مراجعة الطول أو موضع الكلمات الرئيسية أو الصياغة.' },
    ],
  },
  'script-splitter': {
    en: [
      { q: 'What script formats are supported?', a: 'We support plain text scripts, teleprompter scripts, and structured screenplay formats for splitting into readable segments.' },
      { q: 'How does it split the script?', a: 'You can split by sentence, by word count, by character count, or by natural pauses for smooth teleprompter reading.' },
      { q: 'Can I customize the segments?', a: 'Yes, you can set custom segment length, adjust font size, and control scrolling speed for teleprompter mode.' },
    ],
    zh: [
      { q: '支持哪些脚本格式？', a: '我们支持纯文本脚本、提词器脚本和结构化剧本格式，可拆分为可读的段落。' },
      { q: '它是如何拆分脚本的？', a: '你可以按句子、按字数、按字符数或按自然停顿进行拆分，便于流畅的提词器阅读。' },
      { q: '可以自定义段落吗？', a: '可以，你可以设置自定义段落长度、调整字体大小，并控制提词器模式的滚动速度。' },
    ],
    es: [
      { q: '¿Qué formatos de guion se admiten?', a: 'Admitimos guiones de texto plano, guiones de teleprompter y formatos de guion estructurado para dividirlos en segmentos legibles.' },
      { q: '¿Cómo divide el guion?', a: 'Puedes dividir por oración, por recuento de palabras, por recuento de caracteres o por pausas naturales para una lectura fluida en teleprompter.' },
      { q: '¿Puedo personalizar los segmentos?', a: 'Sí, puedes establecer longitud de segmento personalizada, ajustar el tamaño de fuente y controlar la velocidad de desplazamiento.' },
    ],
    fr: [
      { q: 'Quels formats de script sont pris en charge ?', a: 'Nous prenons en charge les scripts en texte brut, les scripts pour prompteur et les formats de scénario structuré pour un découpage en segments lisibles.' },
      { q: 'Comment divise-t-il le script ?', a: 'Vous pouvez diviser par phrase, par nombre de mots, par nombre de caractères ou par pauses naturelles pour une lecture fluide au prompteur.' },
      { q: 'Puis-je personnaliser les segments ?', a: 'Oui, vous pouvez définir une longueur de segment personnalisée, ajuster la taille de police et contrôler la vitesse de défilement.' },
    ],
    hi: [
      { q: 'कौन से स्क्रिप्ट प्रारूप समर्थित हैं?', a: 'हम पठनीय खंडों में विभाजन के लिए सादे टेक्स्ट स्क्रिप्ट, टेलीप्रॉम्प्टर स्क्रिप्ट और संरचित स्क्रीनप्ले प्रारूपों का समर्थन करते हैं।' },
      { q: 'यह स्क्रिप्ट को कैसे विभाजित करता है?', a: 'आप वाक्य, शब्द संख्या, वर्ण संख्या या टेलीप्रॉम्प्टर पठन के लिए प्राकृतिक विरामों द्वारा विभाजित कर सकते हैं।' },
      { q: 'क्या मैं खंडों को कस्टमाइज़ कर सकता हूँ?', a: 'हाँ, आप कस्टम खंड लंबाई सेट कर सकते हैं, फ़ॉन्ट आकार समायोजित कर सकते हैं और टेलीप्रॉम्प्टर मोड के लिए स्क्रॉलिंग गति नियंत्रित कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما تنسيقات النصوص المدعومة؟', a: 'ندعم نصوص النص العادي ونصوص الموجه وأساليب السيناريو المنظمة لتقسيمها إلى مقاطع قابلة للقراءة.' },
      { q: 'كيف يقسم النص؟', a: 'يمكنك التقسيم حسب الجملة أو عدد الكلمات أو عدد الأحرف أو الوقفات الطبيعية لقراءة سلسة على الموجه.' },
      { q: 'هل يمكنني تخصيص المقاطع؟', a: 'نعم، يمكنك تعيين طول مقطع مخصص وضبط حجم الخط والتحكم في سرعة التمرير لوضع الموجه.' },
    ],
  },
  'copy-cleaner': {
    en: [
      { q: 'What formatting does it remove?', a: 'It strips fonts, colors, sizes, backgrounds, bold, italics, and other inline formatting from copied text, leaving clean plain text.' },
      { q: 'Does it preserve hyperlinks?', a: 'Yes, you can choose to keep hyperlinks as plain text URLs or strip them entirely, depending on your needs.' },
      { q: 'Is it private and secure?', a: 'Yes, all cleaning happens locally in your browser. Your text is never sent to any server.' },
    ],
    zh: [
      { q: '它会移除哪些格式？', a: '它会去除复制文本中的字体、颜色、大小、背景、加粗、斜体和其他内联格式，留下干净的纯文本。' },
      { q: '会保留超链接吗？', a: '会，你可以选择将超链接保留为纯文本 URL，或完全去除，取决于你的需要。' },
      { q: '它隐私安全吗？', a: '是的，所有清理都在浏览器本地完成，你的文本永远不会发送到任何服务器。' },
    ],
    es: [
      { q: '¿Qué formato elimina?', a: 'Elimina fuentes, colores, tamaños, fondos, negrita, cursiva y otro formato en línea del texto copiado, dejando texto plano limpio.' },
      { q: '¿Conserva los hipervínculos?', a: 'Sí, puedes elegir mantener los hipervínculos como URLs de texto plano o eliminarlos por completo.' },
      { q: '¿Es privado y seguro?', a: 'Sí, toda la limpieza ocurre localmente en tu navegador. Tu texto nunca se envía a ningún servidor.' },
    ],
    fr: [
      { q: 'Quelle mise en forme supprime-t-il ?', a: 'Il supprime les polices, couleurs, tailles, arrière-plans, gras, italiques et autres mises en forme en ligne du texte copié, laissant un texte brut propre.' },
      { q: 'Préserve-t-il les hyperliens ?', a: 'Oui, vous pouvez choisir de conserver les hyperliens sous forme d\'URL en texte brut ou de les supprimer entièrement.' },
      { q: 'Est-il privé et sécurisé ?', a: 'Oui, tout le nettoyage se fait localement dans votre navigateur. Votre texte n\'est jamais envoyé à un serveur.' },
    ],
    hi: [
      { q: 'यह कौन सा फ़ॉर्मेटिंग हटाता है?', a: 'यह कॉपी किए गए टेक्स्ट से फ़ॉन्ट, रंग, आकार, बैकग्राउंड, बोल्ड, इटैलिक्स और अन्य इनलाइन फ़ॉर्मेटिंग हटाता है, साफ़ प्लेन टेक्स्ट छोड़ता है।' },
      { q: 'क्या यह हाइपरलिंक संरक्षित रखता है?', a: 'हाँ, आप हाइपरलिंक को प्लेन टेक्स्ट URL के रूप में रखने या पूरी तरह हटाने का विकल्प चुन सकते हैं।' },
      { q: 'क्या यह निजी और सुरक्षित है?', a: 'हाँ, सभी सफाई आपके ब्राउज़र में स्थानीय रूप से होती है। आपका टेक्स्ट कभी किसी सर्वर पर नहीं भेजा जाता।' },
    ],
    ar: [
      { q: 'ما التنسيق الذي يزيله؟', a: 'يزيل الخطوط والألوان والأحجام والخلفيات والعريض والمائل والتنسيقات المضمنة الأخرى من النص المنسوخ، تاركاً نصاً عادياً نظيفاً.' },
      { q: 'هل يحافظ على الارتباطات التشعبية؟', a: 'نعم، يمكنك اختيار الاحتفاظ بالارتباطات التشعبية كعناوين URL نصية عادية أو إزالتها بالكامل.' },
      { q: 'هل هو خاص وآمن؟', a: 'نعم، تتم جميع عمليات التنظيف محلياً في متصفحك. لا يتم إرسال نصك أبداً إلى أي خادم.' },
    ],
  },
  'markdown-platform-adapter': {
    en: [
      { q: 'What platforms are supported?', a: 'We adapt markdown for GitHub, Notion, Obsidian, Dev.to, Hashnode, Medium, and other popular writing platforms.' },
      { q: 'Does it convert tables correctly?', a: 'Yes, it converts tables to the syntax each platform supports, including HTML fallbacks where markdown tables are not supported.' },
      { q: 'Can it batch process multiple documents?', a: 'Yes, you can convert a document and copy platform-specific versions, adapting syntax for each target platform.' },
    ],
    zh: [
      { q: '支持哪些平台？', a: '我们为 GitHub、Notion、Obsidian、Dev.to、Hashnode、Medium 及其他热门写作平台适配 Markdown。' },
      { q: '能正确转换表格吗？', a: '可以，它将表格转换为各平台支持的语法，在不支持 Markdown 表格的地方提供 HTML 回退。' },
      { q: '可以批量处理多个文档吗？', a: '可以，你可以转换文档并复制平台特定版本，为每个目标平台适配语法。' },
    ],
    es: [
      { q: '¿Qué plataformas se admiten?', a: 'Adaptamos markdown para GitHub, Notion, Obsidian, Dev.to, Hashnode, Medium y otras plataformas populares de escritura.' },
      { q: '¿Convierte las tablas correctamente?', a: 'Sí, convierte las tablas a la sintaxis que admite cada plataforma, incluidas alternativas HTML cuando no se admiten tablas markdown.' },
      { q: '¿Puede procesar varios documentos en lote?', a: 'Sí, puedes convertir un documento y copiar versiones específicas de cada plataforma, adaptando la sintaxis.' },
    ],
    fr: [
      { q: 'Quelles plateformes sont prises en charge ?', a: 'Nous adaptons le markdown pour GitHub, Notion, Obsidian, Dev.to, Hashnode, Medium et d\'autres plateformes d\'écriture populaires.' },
      { q: 'Convertit-il correctement les tableaux ?', a: 'Oui, il convertit les tableaux vers la syntaxe prise en charge par chaque plateforme, y compris des replis HTML lorsque les tableaux markdown ne sont pas supportés.' },
      { q: 'Peut-il traiter plusieurs documents par lot ?', a: 'Oui, vous pouvez convertir un document et copier des versions spécifiques à chaque plateforme, en adaptant la syntaxe.' },
    ],
    hi: [
      { q: 'कौन से प्लेटफ़ॉर्म समर्थित हैं?', a: 'हम GitHub, Notion, Obsidian, Dev.to, Hashnode, Medium और अन्य लोकप्रिय लेखन प्लेटफ़ॉर्म के लिए markdown अनुकूलित करते हैं।' },
      { q: 'क्या यह तालिकाओं और कोड ब्लॉकों को सही ढंग से परिवर्तित करता है?', a: 'हाँ, यह GFM तालिकाओं को प्लेटफ़ॉर्म-संगत समकक्षों में बदलता है और बाड़ वाले कोड ब्लॉक सिंटैक्स को समायोजित करता है ताकि वह प्रत्येक लक्ष्य प्लेटफ़ॉर्म पर सही ढंग से रेंडर हो।' },
      { q: 'क्या मैं कई दस्तावेज़ों को बैच प्रोसेस कर सकता हूँ?', a: 'हाँ, आप कई Markdown फ़ाइलें पेस्ट या अपलोड कर सकते हैं और उन सभी को एक ही बार में चुने हुए प्लेटफ़ॉर्म के प्रारूप में परिवर्तित कर सकते हैं।' },
    ],
    ar: [
      { q: 'لأي منصات يمكنني تكييف Markdown؟', a: 'تقوم الأداة بتكييف Markdown لـ GitHub و Notion و Obsidian و Medium و Dev.to و Hashnode ومنصات كتابة شائعة أخرى مع خصوصيات بناء الجملة الخاصة بها.' },
      { q: 'هل يحول الجداول وكتل الكود بشكل صحيح؟', a: 'نعم، يحول جداول GFM إلى ما يعادلها المتوافق مع المنصة ويضبط بناء جملة كتل الكود المسورة بحيث يتم عرضها بشكل صحيح على كل منصة مستهدفة.' },
      { q: 'هل يمكنني معالجة مستندات متعددة دفعة واحدة؟', a: 'نعم، يمكنك لصق أو تحميل ملفات Markdown متعددة وتحويلها جميعاً إلى تنسيق المنصة المختارة في عملية واحدة.' },
    ],
  },
  'vertical-chinese-generator': {
    en: [
      { q: 'What is vertical Chinese text?', a: 'Vertical Chinese is the traditional top-to-bottom, right-to-left writing direction used in classical Chinese books, calligraphy, and traditional publications.' },
      { q: 'Can I customize the layout?', a: 'Yes, you can adjust column count, character spacing, font style, and add traditional decorative borders to match your design needs.' },
      { q: 'Does it support traditional Chinese characters?', a: 'Yes, it fully supports both simplified and traditional Chinese characters, and can auto-convert between them for authentic vertical layouts.' },
    ],
    zh: [
      { q: '什么是竖排中文？', a: '竖排中文是古籍、书法和传统出版物中使用的从上到下、从右到左的传统书写方向。' },
      { q: '可以自定义布局吗？', a: '可以，调整列数、字间距、字体样式，并添加传统装饰边框，满足设计需求。' },
      { q: '支持繁体中文字符吗？', a: '支持，全面支持简体和繁体中文，并可在两者间自动转换，呈现地道的竖排效果。' },
    ],
    es: [
      { q: '¿Qué es el texto chino vertical?', a: 'El chino vertical es la dirección de escritura tradicional de arriba a abajo y de derecha a izquierda utilizada en libros clásicos chinos, caligrafía y publicaciones tradicionales.' },
      { q: '¿Puedo personalizar el diseño?', a: 'Sí, puedes ajustar el recuento de columnas, el espaciado de caracteres, el estilo de fuente y añadir bordes decorativos tradicionales para satisfacer tus necesidades de diseño.' },
      { q: '¿Admite caracteres chinos tradicionales?', a: 'Sí, es totalmente compatible con caracteres chinos simplificados y tradicionales, y puede convertir automáticamente entre ellos para diseños verticales auténticos.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que le texte chinois vertical ?', a: 'Le chinois vertical est la direction d\'écriture traditionnelle de haut en bas et de droite à gauche utilisée dans les livres classiques chinois, la calligraphie et les publications traditionnelles.' },
      { q: 'Puis-je personnaliser la mise en page ?', a: 'Oui, vous pouvez ajuster le nombre de colonnes, l\'espacement des caractères, le style de police et ajouter des bordures décoratives traditionnelles pour répondre à vos besoins de conception.' },
      { q: 'Prend-il en charge les caractères chinois traditionnels ?', a: 'Oui, il prend entièrement en charge les caractères chinois simplifiés et traditionnels, et peut convertir automatiquement entre les deux pour des mises en page verticales authentiques.' },
    ],
    hi: [
      { q: 'ऊर्ध्वाधर चीनी पाठ क्या है?', a: 'ऊर्ध्वाधर चीनी पारंपरिक शीर्ष-से-नीचे, दाएं-से-बाएं लेखन दिशा है जो शास्त्रीय चीनी पुस्तकों, सुलेख और पारंपरिक प्रकाशनों में उपयोग होती है।' },
      { q: 'क्या मैं लेआउट को अनुकूलित कर सकता हूँ?', a: 'हाँ, आप अपनी डिज़ाइन आवश्यकताओं को पूरा करने के लिए कॉलम संख्या, वर्ण रिक्ति, फ़ॉन्ट शैली समायोजित कर सकते हैं और पारंपरिक आलंकृत बॉर्डर जोड़ सकते हैं।' },
      { q: 'क्या यह पारंपरिक चीनी वर्णों का समर्थन करता है?', a: 'हाँ, यह सरलीकृत और पारंपरिक चीनी वर्णों दोनों का पूर्ण रूप से समर्थन करता है, और प्रामाणिक ऊर्ध्वाधर लेआउट के लिए उनके बीच स्वतः रूपांतरण कर सकता है।' },
    ],
    ar: [
      { q: 'ما هو النص الصيني العمودي؟', a: 'الصينية العمودية هي اتجاه الكتابة التقليدي من أعلى إلى أسفل ومن اليمين إلى اليسار المستخدم في الكتب الصينية الكلاسيكية والخط والمنشورات التقليدية.' },
      { q: 'هل يمكنني تخصيص التخطيط؟', a: 'نعم، يمكنك ضبط عدد الأعمدة، والمسافة بين الأحرف، ونمط الخط، وإضافة حدود زخرفية تقليدية لتلبية احتياجات التصميم الخاصة بك.' },
      { q: 'هل يدعم الأحرف الصينية التقليدية؟', a: 'نعم، يدعم بالكامل الأحرف الصينية المبسطة والتقليدية، ويمكن التحويل تلقائياً بينهما للتخطيطات العمودية الأصيلة.' },
    ],
  },
  'pinyin-annotator': {
    en: [
      { q: 'What is pinyin annotation?', a: 'Pinyin annotation adds ruby-style phonetic guides above Chinese characters showing the Romanized pronunciation with tone marks, helping learners read Chinese aloud.' },
      { q: 'Does it handle polyphonic characters?', a: 'Yes, the tool uses context-aware dictionaries to choose the correct pronunciation for polyphonic characters (多音字) that change sound based on usage.' },
      { q: 'Can I export the annotated text?', a: 'Yes, you can export annotated text as HTML with ruby tags, plain text with pinyin in parentheses, or as a printable PDF study sheet.' },
    ],
    zh: [
      { q: '什么是拼音标注？', a: '拼音标注在中文字符上方添加 ruby 样式的注音指南，显示带声调的罗马化发音，帮助学习者朗读中文。' },
      { q: '能处理多音字吗？', a: '能，工具使用上下文字典为多音字选择正确读音，根据用法变化判断声调。' },
      { q: '可以导出标注文本吗？', a: '可以，导出为带 ruby 标签的 HTML、括号内带拼音的纯文本，或可打印的 PDF 学习单。' },
    ],
    es: [
      { q: '¿Qué es la anotación pinyin?', a: 'La anotación pinyin añade guías fonéticas estilo ruby sobre los caracteres chinos que muestran la pronunciación romanizada con marcas de tono, ayudando a los estudiantes a leer chino en voz alta.' },
      { q: '¿Maneja caracteres polifónicos?', a: 'Sí, la herramienta utiliza diccionarios contextuales para elegir la pronunciación correcta de los caracteres polifónicos (多音字) que cambian de sonido según el uso.' },
      { q: '¿Puedo exportar el texto anotado?', a: 'Sí, puedes exportar el texto anotado como HTML con etiquetas ruby, texto plano con pinyin entre paréntesis, o como una hoja de estudio PDF imprimible.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que l\'annotation pinyin ?', a: 'L\'annotation pinyin ajoute des guides phonétiques de style ruby au-dessus des caractères chinois montrant la prononciation romanisée avec marques de ton, aidant les apprenants à lire le chinois à voix haute.' },
      { q: 'Gère-t-il les caractères polyphoniques ?', a: 'Oui, l\'outil utilise des dictionnaires contextuels pour choisir la bonne prononciation des caractères polyphoniques (多音字) qui changent de son selon l\'usage.' },
      { q: 'Puis-je exporter le texte annoté ?', a: 'Oui, vous pouvez exporter le texte annoté en HTML avec balises ruby, en texte brut avec pinyin entre parenthèses, ou en feuille d\'étude PDF imprimable.' },
    ],
    hi: [
      { q: 'पिनयिन एनोटेशन क्या है?', a: 'पिनयिन एनोटेशन चीनी वर्णों के ऊपर रूबी-शैली के ध्वन्यात्मक गाइड जोड़ता है जो टोन चिह्नों के साथ रोमनकृत उच्चारण दिखाते हैं, जो शिक्षार्थियों को चीनी पढ़ने में मदद करते हैं।' },
      { q: 'क्या यह बहुस्वरी वर्णों को संभालता है?', a: 'हाँ, उपकरण संदर्भ-जागरूक शब्दकोशों का उपयोग बहुस्वरी वर्णों (多音字) के लिए सही उच्चारण चुनने के लिए करता है जो उपयोग के आधार पर ध्वनि बदलते हैं।' },
      { q: 'क्या मैं एनोटेटेड पाठ निर्यात कर सकता हूँ?', a: 'हाँ, आप एनोटेटेड पाठ को रूबी टैग के साथ HTML, कोष्ठक में पिनयिन के साथ सादा पाठ, या प्रिंट करने योग्य PDF अध्ययन पत्र के रूप में निर्यात कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما هو التعليق الصوتي pinyin؟', a: 'يضيف التعليق الصوتي pinyin أدلة نطق صوتية بنمط ruby فوق الأحرف الصينية توضح النطق بالحروف اللاتينية مع علامات النبرة، مما يساعد المتعلمين على قراءة الصينية بصوت عالٍ.' },
      { q: 'هل يتعامل مع الأحرف متعددة الأصوات؟', a: 'نعم، تستخدم الأداة قواميس سياقية لاختيار النطق الصحيح للأحرف متعددة الأصوات (多音字) التي تتغير أصواتها بناءً على الاستخدام.' },
      { q: 'هل يمكنني تصدير النص المُعلَّق؟', a: 'نعم، يمكنك تصدير النص المُعلَّق كـ HTML مع وسوم ruby، أو نص عادي مع pinyin بين قوسين، أو كورقة دراسة PDF قابلة للطباعة.' },
    ],
  },
  'sentiment-analyzer': {
    en: [
      { q: 'What is sentiment analysis?', a: 'Sentiment analysis evaluates text to determine whether the emotional tone is positive, negative, or neutral, useful for reviews, feedback, and social media monitoring.' },
      { q: 'What languages does it support?', a: 'The analyzer supports English, Chinese, Spanish, French, Hindi, and Arabic, processing each with language-specific lexicons and rules.' },
      { q: 'How accurate is the sentiment scoring?', a: 'Accuracy is typically 80-90% for clear sentiment text using lexicon-based scoring; sarcasm and mixed-emotion text may score lower and need human review.' },
    ],
    zh: [
      { q: '什么是情感分析？', a: '情感分析评估文本，判断情绪倾向为正面、负面或中性，适用于评论、反馈和社交媒体监测。' },
      { q: '支持哪些语言？', a: '分析器支持英语、中文、西班牙语、法语、印地语和阿拉伯语，各自使用专属词库和规则处理。' },
      { q: '情感评分准确度如何？', a: '基于词库的评分对明确情感文本准确率通常为 80-90%；讽刺和混合情感文本评分较低，需人工复核。' },
    ],
    es: [
      { q: '¿Qué es el análisis de sentimiento?', a: 'El análisis de sentimiento evalúa el texto para determinar si el tono emocional es positivo, negativo o neutral, útil para reseñas, comentarios y monitoreo de redes sociales.' },
      { q: '¿Qué idiomas admite?', a: 'El analizador admite inglés, chino, español, francés, hindi y árabe, procesando cada uno con léxicos y reglas específicas del idioma.' },
      { q: '¿Qué tan precisa es la puntuación de sentimiento?', a: 'La precisión suele ser del 80-90% para texto de sentimiento claro usando puntuación basada en léxico; el sarcasmo y el texto de emociones mixtas pueden puntuar más bajo y necesitar revisión humana.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que l\'analyse de sentiment ?', a: 'L\'analyse de sentiment évalue le texte pour déterminer si le ton émotionnel est positif, négatif ou neutre, utile pour les avis, les retours et la surveillance des réseaux sociaux.' },
      { q: 'Quelles langues prend-elle en charge ?', a: 'L\'analyseur prend en charge l\'anglais, le chinois, l\'espagnol, le français, l\'hindi et l\'arabe, en traitant chacun avec des lexiques et des règles spécifiques à la langue.' },
      { q: 'Quelle est la précision de la notation de sentiment ?', a: 'La précision est généralement de 80-90 % pour les textes à sentiment clair utilisant une notation basée sur le lexique ; le sarcasme et les textes à émotions mixtes peuvent être notés plus bas et nécessiter une révision humaine.' },
    ],
    hi: [
      { q: 'भावना विश्लेषण क्या है?', a: 'भावना विश्लेषण पाठ का मूल्यांकन करता है यह निर्धारित करने के लिए कि भावनात्मक स्वर सकारात्मक, नकारात्मक या तटस्थ है, समीक्षाओं, प्रतिक्रिया और सोशल मीडिया निगरानी के लिए उपयोगी।' },
      { q: 'यह किन भाषाओं का समर्थन करता है?', a: 'विश्लेषक अंग्रेज़ी, चीनी, स्पेनिश, फ़्रेंच, हिंदी और अरबी का समर्थन करता है, प्रत्येक को भाषा-विशिष्ट शब्दावली और नियमों के साथ संसाधित करता है।' },
      { q: 'भावना स्कोरिंग कितनी सटीक है?', a: 'शब्दावली-आधारित स्कोरिंग का उपयोग करके स्पष्ट भावना पाठ के लिए सटीकता आमतौर पर 80-90% है; व्यंग्य और मिश्रित-भावना पाठ कम स्कोर कर सकते हैं और मानव समीक्षा की आवश्यकता हो सकती है।' },
    ],
    ar: [
      { q: 'ما هو تحليل المشاعر؟', a: 'يقيّم تحليل المشاعر النص لتحديد ما إذا كان النبرة العاطفية إيجابية أو سلبية أو محايدة، مفيد للمراجعات والملاحظات ومراقبة وسائل التواصل الاجتماعي.' },
      { q: 'ما اللغات التي يدعمها؟', a: 'يدعم المحلل الإنجليزية والصينية والإسبانية والفرنسية والهندية والعربية، معالجاً كل منها بقواميس وقواعد خاصة باللغة.' },
      { q: 'ما مدى دقة تسجيل المشاعر؟', a: 'الدقة عادة 80-90% للنصوص ذات المشاعر الواضحة باستخدام التسجيل القائم على القاموس؛ قد يسجل السخرية والنصوص ذات المشاعر المختلطة أقل ويحتاج إلى مراجعة بشرية.' },
    ],
  },
  'srt-subtitle-generator': {
    en: [
      { q: 'What subtitle formats does it support?', a: 'The tool generates SRT (SubRip) subtitles and can export to VTT, ASS, and plain text transcript formats for use across video platforms.' },
      { q: 'Can I adjust subtitle timing?', a: 'Yes, you can shift all subtitles by a set offset, split or merge entries, and fine-tune individual start and end timestamps.' },
      { q: 'Does it support multiple languages?', a: 'Yes, you can create subtitles in any language including CJK and RTL scripts, with optional bilingual dual-language subtitle output.' },
    ],
    zh: [
      { q: '支持哪些字幕格式？', a: '工具生成 SRT（SubRip）字幕，并可导出为 VTT、ASS 和纯文本转录格式，适用于各种视频平台。' },
      { q: '可以调整字幕时间吗？', a: '可以，按设定偏移量平移所有字幕，拆分或合并条目，并精细调整各条目的开始和结束时间戳。' },
      { q: '支持多种语言吗？', a: '支持，可创建任意语言字幕，包括中日韩和 RTL 文字，还可选输出双语对照字幕。' },
    ],
    es: [
      { q: '¿Qué formatos de subtítulos admite?', a: 'La herramienta genera subtítulos SRT (SubRip) y puede exportar a formatos VTT, ASS y transcripción de texto plano para su uso en plataformas de video.' },
      { q: '¿Puedo ajustar el tiempo de los subtítulos?', a: 'Sí, puedes desplazar todos los subtítulos por un desplazamiento establecido, dividir o fusionar entradas y ajustar finamente las marcas de tiempo de inicio y fin individuales.' },
      { q: '¿Admite varios idiomas?', a: 'Sí, puedes crear subtítulos en cualquier idioma, incluidos scripts CJK y RTL, con salida opcional de subtítulos bilingües de doble idioma.' },
    ],
    fr: [
      { q: 'Quels formats de sous-titres prend-il en charge ?', a: 'L\'outil génère des sous-titres SRT (SubRip) et peut exporter aux formats VTT, ASS et transcription en texte brut pour une utilisation sur les plateformes vidéo.' },
      { q: 'Puis-je ajuster le minutage des sous-titres ?', a: 'Oui, vous pouvez décaler tous les sous-titres d\'un décalage défini, diviser ou fusionner des entrées, et affiner individuellement les horodatages de début et de fin.' },
      { q: 'Prend-il en charge plusieurs langues ?', a: 'Oui, vous pouvez créer des sous-titres dans n\'importe quelle langue, y compris les écritures CJK et RTL, avec une sortie optionnelle de sous-titres bilingues.' },
    ],
    hi: [
      { q: 'यह कौन से उपशीर्षक प्रारूपों का समर्थन करता है?', a: 'यह उपकरण SRT (SubRip) उपशीर्षक उत्पन्न करता है और वीडियो प्लेटफ़ॉर्म पर उपयोग के लिए VTT, ASS और सादे पाठ प्रतिलेख प्रारूपों में निर्यात कर सकता है।' },
      { q: 'क्या मैं उपशीर्षक समय को समायोजित कर सकता हूँ?', a: 'हाँ, आप सभी उपशीर्षकों को एक निर्धारित ऑफ़सेट से विस्थापित कर सकते हैं, प्रविष्टियों को विभाजित या विलय कर सकते हैं, और व्यक्तिगत प्रारंभ और समाप्ति टाइमस्टैम्प को ठीक कर सकते हैं।' },
      { q: 'क्या यह कई भाषाओं का समर्थन करता है?', a: 'हाँ, आप CJK और RTL स्क्रिप्ट सहित किसी भी भाषा में उपशीर्षक बना सकते हैं, वैकल्पिक द्विभाषी दोहरी-भाषा उपशीर्षक आउटपुट के साथ।' },
    ],
    ar: [
      { q: 'ما تنسيقات الترجمة التي يدعمها؟', a: 'تنشئ الأداة ترجمات SRT (SubRip) ويمكن تصديرها إلى تنسيقات VTT و ASS ونص عادي للاستخدام عبر منصات الفيديو.' },
      { q: 'هل يمكنني ضبط توقيت الترجمة؟', a: 'نعم، يمكنك إزاحة جميع الترجمات بإزاحة محددة، وتقسيم أو دمج الإدخالات، وضبط الطوابع الزمنية الفردية للبداية والنهاية بدقة.' },
      { q: 'هل يدعم لغات متعددة؟', a: 'نعم، يمكنك إنشاء ترجمات بأي لغة بما في ذلك الكتابة CJK و RTL، مع إخراج ترجمة ثنائية اللغة اختياري.' },
    ],
  },
  'multi-timezone-publish-time': {
    en: [
      { q: 'What timezones are supported?', a: 'The tool supports all IANA timezones (UTC and every regional zone), covering all countries worldwide.' },
      { q: 'Can I schedule posts across multiple timezones?', a: 'Yes, set one reference time and instantly see the equivalent publish time in up to 12 timezones at once.' },
      { q: 'How does it handle daylight saving time (DST)?', a: 'The tool uses live IANA timezone data, so DST transitions are applied automatically based on each region\'s rules.' },
    ],
    zh: [
      { q: '支持哪些时区？', a: '支持所有 IANA 时区（UTC 及各地区的区域时区），覆盖全球所有国家。' },
      { q: '可以跨多个时区排期发布吗？', a: '可以，设定一个参考时间即可同时查看最多 12 个时区的对应发布时间。' },
      { q: '如何处理夏令时？', a: '工具使用实时 IANA 时区数据，会根据各地区的规则自动应用夏令时切换。' },
    ],
    es: [
      { q: '¿Qué zonas horarias se admiten?', a: 'La herramienta admite todas las zonas horarias de IANA (UTC y todas las regionales), cubriendo todos los países del mundo.' },
      { q: '¿Puedo programar publicaciones en varias zonas horarias?', a: 'Sí, establece una hora de referencia y ve al instante la hora de publicación equivalente en hasta 12 zonas horarias.' },
      { q: '¿Cómo maneja el horario de verano (DST)?', a: 'La herramienta utiliza datos de zonas horarias de IANA en vivo, por lo que las transiciones de DST se aplican automáticamente según las reglas de cada región.' },
    ],
    fr: [
      { q: 'Quels fuseaux horaires sont pris en charge ?', a: 'L\'outil prend en charge tous les fuseaux horaires IANA (UTC et toutes les zones régionales), couvrant tous les pays du monde.' },
      { q: 'Puis-je planifier des publications dans plusieurs fuseaux horaires ?', a: 'Oui, définissez une heure de référence et voyez instantanément l\'heure de publication équivalente dans jusqu\'à 12 fuseaux horaires.' },
      { q: 'Comment gère-t-il l\'heure d\'été (DST) ?', a: 'L\'outil utilise les données IANA en direct, donc les transitions DST sont appliquées automatiquement selon les règles de chaque région.' },
    ],
    hi: [
      { q: 'कौन से समय क्षेत्र समर्थित हैं?', a: 'यह उपकरण सभी IANA समय क्षेत्रों (UTC और सभी क्षेत्रीय क्षेत्रों) का समर्थन करता है, दुनिया भर के सभी देशों को कवर करता है।' },
      { q: 'क्या मैं कई समय क्षेत्रों में पोस्ट शेड्यूल कर सकता हूँ?', a: 'हाँ, एक संदर्भ समय सेट करें और एक साथ 12 समय क्षेत्रों में समान प्रकाशन समय देखें।' },
      { q: 'यह डेलाइट सेविंग टाइम (DST) को कैसे संभालता है?', a: 'यह उपकरण लाइव IANA समय क्षेत्र डेटा का उपयोग करता है, इसलिए DST परिवर्तन प्रत्येक क्षेत्र के नियमों के अनुसार स्वचालित रूप से लागू होते हैं।' },
    ],
    ar: [
      { q: 'ما المناطق الزمنية المدعومة؟', a: 'تدعم الأداة جميع المناطق الزمنية IANA (UTC وجميع المناطق الإقليمية)، وتغطي جميع دول العالم.' },
      { q: 'هل يمكنني جدولة المنشورات عبر مناطق زمنية متعددة؟', a: 'نعم، عيّن وقتًا مرجعيًا ورَ الوقت المكافئ للنشر فورًا في ما يصل إلى 12 منطقة زمنية.' },
      { q: 'كيف يتعامل مع التوقيت الصيفي (DST)؟', a: 'تستخدم الأداة بيانات IANA المباشرة، لذا يتم تطبيق تحويلات DST تلقائيًا وفقًا لقواعد كل منطقة.' },
    ],
  },
  'excel-formula-generator': {
    en: [
      { q: 'What Excel formulas are supported?', a: 'The generator covers common categories including lookup (VLOOKUP, XLOOKUP), logical (IF, IFS), text, date, math, and array formulas.' },
      { q: 'Can it explain how a formula works?', a: 'Yes, each generated formula includes a plain-language breakdown of every argument and how the result is computed.' },
      { q: 'Does it work with Google Sheets?', a: 'Most generated formulas are compatible with Google Sheets, and the tool flags functions that are Excel-only.' },
    ],
    zh: [
      { q: '支持哪些 Excel 公式？', a: '生成器涵盖常见类别，包括查找（VLOOKUP、XLOOKUP）、逻辑（IF、IFS）、文本、日期、数学和数组公式。' },
      { q: '可以解释公式的原理吗？', a: '可以，每个生成的公式都附带通俗的参数说明和结果计算方式解析。' },
      { q: '可以用于 Google Sheets 吗？', a: '大多数生成的公式与 Google Sheets 兼容，工具会标注仅 Excel 支持的函数。' },
    ],
    es: [
      { q: '¿Qué fórmulas de Excel se admiten?', a: 'El generador cubre categorías comunes como búsqueda (VLOOKUP, XLOOKUP), lógicas (IF, IFS), texto, fecha, matemáticas y fórmulas de matriz.' },
      { q: '¿Puede explicar cómo funciona una fórmula?', a: 'Sí, cada fórmula generada incluye una explicación en lenguaje sencillo de cada argumento y cómo se calcula el resultado.' },
      { q: '¿Funciona con Google Sheets?', a: 'La mayoría de las fórmulas generadas son compatibles con Google Sheets, y la herramienta marca las funciones exclusivas de Excel.' },
    ],
    fr: [
      { q: 'Quelles formules Excel sont prises en charge ?', a: 'Le générateur couvre les catégories courantes, notamment la recherche (VLOOKUP, XLOOKUP), logiques (IF, IFS), texte, date, mathématiques et formules matricielles.' },
      { q: 'Peut-il expliquer le fonctionnement d\'une formule ?', a: 'Oui, chaque formule générée est accompagnée d\'une explication claire de chaque argument et du calcul du résultat.' },
      { q: 'Fonctionne-t-il avec Google Sheets ?', a: 'La plupart des formules générées sont compatibles avec Google Sheets, et l\'outil signale les fonctions exclusives à Excel.' },
    ],
    hi: [
      { q: 'कौन सी Excel सूत्र समर्थित हैं?', a: 'जनरेटर VLOOKUP, XLOOKUP, IF, IFS, टेक्स्ट, दिनांक, गणित और सरणी सूत्र जैसी सामान्य श्रेणियों को कवर करता है।' },
      { q: 'क्या यह सूत्र कैसे काम करता है यह समझा सकता है?', a: 'हाँ, प्रत्येक उत्पन्न सूत्र में प्रत्येक तर्क की सरल व्याख्या और परिणाम की गणना का तरीका शामिल है।' },
      { q: 'क्या यह Google Sheets के साथ काम करता है?', a: 'अधिकांश उत्पन्न सूत्र Google Sheets के साथ संगत हैं, और उपकरण Excel-विशिष्ट फ़ंक्शन को चिह्नित करता है।' },
    ],
    ar: [
      { q: 'ما صيغ Excel المدعومة؟', a: 'يغطي المولد الفئات الشائعة بما في ذلك البحث (VLOOKUP، XLOOKUP)، والمنطقية (IF، IFS)، والنص، والتاريخ، والرياضيات، وصيغ المصفوفات.' },
      { q: 'هل يمكنه شرح كيفية عمل صيغة؟', a: 'نعم، كل صيغة تم إنشاؤها تأتي مع شرح بسيط لكل وسيطة وكيفية حساب النتيجة.' },
      { q: 'هل يعمل مع Google Sheets؟', a: 'معظم الصيغ التي تم إنشاؤها متوافقة مع Google Sheets، وتقوم الأداة بتمييز الوظائف الحصرية لـ Excel.' },
    ],
  },
  'ai-prompt-generator': {
    en: [
      { q: 'What AI models does it support?', a: 'The prompts are designed to work with major models including ChatGPT, Claude, Gemini, and other mainstream LLMs.' },
      { q: 'Can I customize the generated prompts?', a: 'Yes, you can edit any generated prompt, add context, and refine it before copying it to your AI tool.' },
      { q: 'Are the prompts free to use?', a: 'Yes, all prompts are generated locally in your browser and are completely free with no usage limits.' },
    ],
    zh: [
      { q: '支持哪些 AI 模型？', a: '提示词适用于主流模型，包括 ChatGPT、Claude、Gemini 等通用大语言模型。' },
      { q: '可以自定义生成的提示词吗？', a: '可以，您可以编辑任何生成的提示词、添加上下文，并在复制到 AI 工具前进行优化。' },
      { q: '提示词免费使用吗？', a: '是的，所有提示词均在浏览器本地生成，完全免费且无使用限制。' },
    ],
    es: [
      { q: '¿Qué modelos de IA admite?', a: 'Los prompts están diseñados para funcionar con modelos principales como ChatGPT, Claude, Gemini y otros LLM convencionales.' },
      { q: '¿Puedo personalizar los prompts generados?', a: 'Sí, puedes editar cualquier prompt generado, añadir contexto y refinarlo antes de copiarlo a tu herramienta de IA.' },
      { q: '¿Los prompts son gratuitos?', a: 'Sí, todos los prompts se generan localmente en tu navegador y son completamente gratuitos sin límites de uso.' },
    ],
    fr: [
      { q: 'Quels modèles d\'IA sont pris en charge ?', a: 'Les prompts sont conçus pour fonctionner avec les principaux modèles, notamment ChatGPT, Claude, Gemini et autres LLM courants.' },
      { q: 'Puis-je personnaliser les prompts générés ?', a: 'Oui, vous pouvez modifier tout prompt généré, ajouter du contexte et l\'affiner avant de le copier dans votre outil d\'IA.' },
      { q: 'Les prompts sont-ils gratuits ?', a: 'Oui, tous les prompts sont générés localement dans votre navigateur et sont entièrement gratuits sans limite d\'utilisation.' },
    ],
    hi: [
      { q: 'यह कौन से AI मॉडल का समर्थन करता है?', a: 'प्रॉम्प्ट्स ChatGPT, Claude, Gemini और अन्य मुख्यधारा के LLM सहित प्रमुख मॉडलों के साथ काम करने के लिए डिज़ाइन किए गए हैं।' },
      { q: 'क्या मैं उत्पन्न प्रॉम्प्ट्स को कस्टमाइज़ कर सकता हूँ?', a: 'हाँ, आप किसी भी उत्पन्न प्रॉम्प्ट को संपादित कर सकते हैं, संदर्भ जोड़ सकते हैं और इसे अपने AI टूल में कॉपी करने से पहले परिष्कृत कर सकते हैं।' },
      { q: 'क्या प्रॉम्प्ट्स उपयोग करने के लिए स्वतंत्र हैं?', a: 'हाँ, सभी प्रॉम्प्ट्स आपके ब्राउज़र में स्थानीय रूप से उत्पन्न होते हैं और पूरी तरह से निःशुल्क हैं।' },
    ],
    ar: [
      { q: 'ما نماذج الذكاء الاصطناعي المدعومة؟', a: 'تم تصميم المطالبات للعمل مع النماذج الرئيسية بما في ذلك ChatGPT و Claude و Gemini وغيرها من نماذج LLM السائدة.' },
      { q: 'هل يمكنني تخصيص المطالبات التي تم إنشاؤها؟', a: 'نعم، يمكنك تحرير أي مطالبة تم إنشاؤها، وإضافة سياق، وتحسينها قبل نسخها إلى أداة الذكاء الاصطناعي الخاصة بك.' },
      { q: 'هل المطالبات مجانية؟', a: 'نعم، يتم إنشاء جميع المطالبات محليًا في متصفحك وهي مجانية تمامًا دون قيود على الاستخدام.' },
    ],
  },
  'sora-prompt-generator': {
    en: [
      { q: 'What is Sora?', a: 'Sora is OpenAI\'s text-to-video AI model that generates short videos from natural language descriptions.' },
      { q: 'How do I write a good Sora prompt?', a: 'Be specific about scene, camera movement, lighting, duration, and style; concrete details produce more controllable results.' },
      { q: 'Can I save my generated prompts?', a: 'Yes, you can copy prompts to your clipboard or export them as a text file for later reuse.' },
    ],
    zh: [
      { q: 'Sora 是什么？', a: 'Sora 是 OpenAI 的文本转视频 AI 模型，可根据自然语言描述生成短视频。' },
      { q: '如何写出好的 Sora 提示词？', a: '详细描述场景、镜头运动、光线、时长和风格，具体细节能产生更可控的结果。' },
      { q: '可以保存生成的提示词吗？', a: '可以，您可以将提示词复制到剪贴板或导出为文本文件以便日后复用。' },
    ],
    es: [
      { q: '¿Qué es Sora?', a: 'Sora es el modelo de IA de texto a vídeo de OpenAI que genera vídeos cortos a partir de descripciones en lenguaje natural.' },
      { q: '¿Cómo escribo un buen prompt de Sora?', a: 'Sé específico sobre la escena, el movimiento de cámara, la iluminación, la duración y el estilo; los detalles concretos producen resultados más controlables.' },
      { q: '¿Puedo guardar mis prompts generados?', a: 'Sí, puedes copiar los prompts al portapapeles o exportarlos como archivo de texto para reutilizarlos más tarde.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que Sora ?', a: 'Sora est le modèle d\'IA texte-vers-vidéo d\'OpenAI qui génère des vidéos courtes à partir de descriptions en langage naturel.' },
      { q: 'Comment écrire un bon prompt Sora ?', a: 'Soyez précis sur la scène, le mouvement de caméra, l\'éclairage, la durée et le style ; les détails concrets produisent des résultats plus contrôlables.' },
      { q: 'Puis-je sauvegarder mes prompts générés ?', a: 'Oui, vous pouvez copier les prompts dans le presse-papiers ou les exporter en fichier texte pour les réutiliser.' },
    ],
    hi: [
      { q: 'Sora क्या है?', a: 'Sora OpenAI का टेक्स्ट-टू-वीडियो AI मॉडल है जो प्राकृतिक भाषा विवरण से लघु वीडियो उत्पन्न करता है।' },
      { q: 'मैं अच्छा Sora प्रॉम्प्ट कैसे लिखूँ?', a: 'दृश्य, कैमरा मूवमेंट, लाइटिंग, अवधि और शैली के बारे में विशिष्ट रहें; ठोस विवरण अधिक नियंत्रणीय परिणाम देते हैं।' },
      { q: 'क्या मैं अपने उत्पन्न प्रॉम्प्ट्स को सहेज सकता हूँ?', a: 'हाँ, आप प्रॉम्प्ट्स को क्लिपबोर्ड पर कॉपी कर सकते हैं या टेक्स्ट फ़ाइल के रूप में निर्यात कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما هو Sora؟', a: 'Sora هو نموذج الذكاء الاصطناعي للنص إلى فيديو من OpenAI الذي ينشئ مقاطع فيديو قصيرة من أوصاف اللغة الطبيعية.' },
      { q: 'كيف أكتب مطالبة Sora جيدة؟', a: 'كن محددًا بشأن المشهد وحركة الكاميرا والإضاءة والمدة والأسلوب؛ التفاصيل الملموسة تنتج نتائج أكثر قابلية للتحكم.' },
      { q: 'هل يمكنني حفظ المطالبات التي تم إنشاؤها؟', a: 'نعم، يمكنك نسخ المطالبات إلى الحافظة أو تصديرها كملف نصي لإعادة استخدامها لاحقًا.' },
    ],
  },
  'midjourney-prompt-generator': {
    en: [
      { q: 'What Midjourney versions are supported?', a: 'The generator supports prompts compatible with Midjourney v5, v6, and v7, including version-specific parameters and styling flags.' },
      { q: 'Can I add style parameters like --ar and --stylize?', a: 'Yes, you can configure aspect ratio, stylize, chaos, quality, and other parameters through the UI and they will be appended correctly.' },
      { q: 'How do I copy prompts to Midjourney?', a: 'Click the copy button to put the full prompt with parameters on your clipboard, then paste it into the Midjourney Discord or web app.' },
    ],
    zh: [
      { q: '支持哪些 Midjourney 版本？', a: '生成器支持与 Midjourney v5、v6、v7 兼容的提示词，包括各版本专属参数和风格标记。' },
      { q: '可以添加 --ar 和 --stylize 等风格参数吗？', a: '可以，通过界面配置宽高比、风格化、混乱度、质量等参数，系统会正确追加。' },
      { q: '如何将提示词复制到 Midjourney？', a: '点击复制按钮，将带参数的完整提示词放入剪贴板，然后粘贴到 Midjourney Discord 或网页应用。' },
    ],
    es: [
      { q: '¿Qué versiones de Midjourney se admiten?', a: 'El generador admite prompts compatibles con Midjourney v5, v6 y v7, incluidos parámetros y banderas de estilo específicos de cada versión.' },
      { q: '¿Puedo añadir parámetros de estilo como --ar y --stylize?', a: 'Sí, puedes configurar la relación de aspecto, stylize, chaos, quality y otros parámetros a través de la interfaz.' },
      { q: '¿Cómo copio los prompts a Midjourney?', a: 'Haz clic en el botón de copiar para poner el prompt completo con parámetros en el portapapeles, luego pégalo en Discord o la web de Midjourney.' },
    ],
    fr: [
      { q: 'Quelles versions de Midjourney sont prises en charge ?', a: 'Le générateur prend en charge les prompts compatibles avec Midjourney v5, v6 et v7, y compris les paramètres spécifiques à chaque version.' },
      { q: 'Puis-je ajouter des paramètres de style comme --ar et --stylize ?', a: 'Oui, vous pouvez configurer le ratio d\'aspect, stylize, chaos, quality et d\'autres paramètres via l\'interface.' },
      { q: 'Comment copier les prompts vers Midjourney ?', a: 'Cliquez sur le bouton copier pour mettre le prompt complet avec paramètres dans le presse-papiers, puis collez-le dans Discord ou l\'application web Midjourney.' },
    ],
    hi: [
      { q: 'कौन से Midjourney संस्करण समर्थित हैं?', a: 'जनरेटर Midjourney v5, v6 और v7 के साथ संगत प्रॉम्प्ट्स का समर्थन करता है, जिसमें संस्करण-विशिष्ट पैरामीटर शामिल हैं।' },
      { q: 'क्या मैं --ar और --stylize जैसे स्टाइल पैरामीटर जोड़ सकता हूँ?', a: 'हाँ, आप इंटरफ़ेस के माध्यम से पहलू अनुपात, stylize, chaos, quality और अन्य पैरामीटर कॉन्फ़िगर कर सकते हैं।' },
      { q: 'मैं प्रॉम्प्ट्स को Midjourney में कैसे कॉपी करूँ?', a: 'कॉपी बटन पर क्लिक करें और पूर्ण प्रॉम्प्ट को क्लिपबोर्ड पर रखें, फिर इसे Midjourney Discord में पेस्ट करें।' },
    ],
    ar: [
      { q: 'ما إصدارات Midjourney المدعومة؟', a: 'يدعم المولد المطالبات المتوافقة مع Midjourney v5 و v6 و v7، بما في ذلك المعلمات الخاصة بكل إصدار.' },
      { q: 'هل يمكنني إضافة معلمات النمط مثل --ar و --stylize؟', a: 'نعم، يمكنك تكوين نسبة العرض إلى الارتفاع و stylize و chaos و quality ومعلمات أخرى عبر الواجهة.' },
      { q: 'كيف أنسخ المطالبات إلى Midjourney؟', a: 'انقر على زر النسخ لوضع المطالبة الكاملة مع المعلمات في الحافظة، ثم الصقها في Discord أو تطبيق ويب Midjourney.' },
    ],
  },
  'video-prompt-generator': {
    en: [
      { q: 'What video AI tools does it support?', a: 'The tool creates prompts compatible with Sora, Runway, Pika, Kling, Veo, and other popular text-to-video models.' },
      { q: 'How should I structure a video prompt?', a: 'Start with subject and action, then add scene, camera, lighting, mood, and technical specs like resolution and duration.' },
      { q: 'Can I batch generate multiple prompts?', a: 'Yes, you can generate several prompt variations at once and export them as a list for testing different video models.' },
    ],
    zh: [
      { q: '支持哪些视频 AI 工具？', a: '工具生成与 Sora、Runway、Pika、Kling、Veo 等主流文本转视频模型兼容的提示词。' },
      { q: '视频提示词应如何组织？', a: '先写主体和动作，再添加场景、镜头、光线、氛围以及分辨率、时长等技术规格。' },
      { q: '可以批量生成多个提示词吗？', a: '可以，一次生成多个提示词变体并导出为列表，用于测试不同视频模型。' },
    ],
    es: [
      { q: '¿Qué herramientas de IA de vídeo admite?', a: 'La herramienta crea prompts compatibles con Sora, Runway, Pika, Kling, Veo y otros modelos populares de texto a vídeo.' },
      { q: '¿Cómo debo estructurar un prompt de vídeo?', a: 'Comienza con el sujeto y la acción, luego añade escena, cámara, iluminación, ambiente y especificaciones técnicas como resolución y duración.' },
      { q: '¿Puedo generar varios prompts en lote?', a: 'Sí, puedes generar varias variaciones de prompts a la vez y exportarlas como lista para probar diferentes modelos de vídeo.' },
    ],
    fr: [
      { q: 'Quels outils d\'IA vidéo sont pris en charge ?', a: 'L\'outil crée des prompts compatibles avec Sora, Runway, Pika, Kling, Veo et autres modèles populaires texte-vers-vidéo.' },
      { q: 'Comment structurer un prompt vidéo ?', a: 'Commencez par le sujet et l\'action, puis ajoutez la scène, la caméra, l\'éclairage, l\'ambiance et les specs techniques comme la résolution et la durée.' },
      { q: 'Puis-je générer plusieurs prompts en lot ?', a: 'Oui, vous pouvez générer plusieurs variantes de prompts à la fois et les exporter sous forme de liste pour tester différents modèles vidéo.' },
    ],
    hi: [
      { q: 'यह कौन से वीडियो AI टूल का समर्थन करता है?', a: 'यह उपकरण Sora, Runway, Pika, Kling, Veo और अन्य लोकप्रिय टेक्स्ट-टू-वीडियो मॉडल के साथ संगत प्रॉम्प्ट्स बनाता है।' },
      { q: 'मैं वीडियो प्रॉम्प्ट को कैसे संरचित करूँ?', a: 'विषय और क्रिया से शुरू करें, फिर दृश्य, कैमरा, लाइटिंग, मूड और रिज़ॉल्यूशन तथा अवधि जैसे तकनीकी विनिर्देश जोड़ें।' },
      { q: 'क्या मैं कई प्रॉम्प्ट्स बैच जनरेट कर सकता हूँ?', a: 'हाँ, आप एक बार में कई प्रॉम्प्ट वेरिएशन जनरेट कर सकते हैं और उन्हें सूची के रूप में निर्यात कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما أدوات ذكاء الفيديو الاصطناعي المدعومة؟', a: 'تنشئ الأداة مطالبات متوافقة مع Sora و Runway و Pika و Kling و Veo وغيرها من نماذج النص إلى فيديو الشائعة.' },
      { q: 'كيف يجب أن أهيكل مطالبة الفيديو؟', a: 'ابدأ بالموضوع والإجراء، ثم أضف المشهد والكاميرا والإضاءة والمزاج والمواصفات الفنية مثل الدقة والمدة.' },
      { q: 'هل يمكنني إنشاء مطالبات متعددة دفعة واحدة؟', a: 'نعم، يمكنك إنشاء عدة تنويعات للمطالبات مرة واحدة وتصديرها كقائمة لاختبار نماذج فيديو مختلفة.' },
    ],
  },
  'wc-2026-schedule': {
    en: [
      { q: 'Is the World Cup 2026 schedule accurate?', a: 'Yes, the schedule is based on the official FIFA match calendar, including dates, times, venues, and group stage assignments.' },
      { q: 'Can I filter matches by team?', a: 'Yes, you can select any of the 48 participating teams to see only their group and knockout matches.' },
      { q: 'Can I export matches to my calendar?', a: 'Yes, you can download an .ics file for selected matches or teams and import it into Google Calendar, Outlook, or Apple Calendar.' },
    ],
    zh: [
      { q: '2026 世界杯赛程准确吗？', a: '是的，赛程基于 FIFA 官方比赛日历，包括日期、时间、场馆和小组赛分组。' },
      { q: '可以按球队筛选比赛吗？', a: '可以，您可以选择 48 支参赛球队中的任意一支，仅查看其小组赛和淘汰赛。' },
      { q: '可以将比赛导出到日历吗？', a: '可以，您可以为选定比赛或球队下载 .ics 文件，并导入到 Google 日历、Outlook 或 Apple 日历。' },
    ],
    es: [
      { q: '¿Es preciso el calendario del Mundial 2026?', a: 'Sí, el calendario se basa en el calendario oficial de partidos de la FIFA, incluyendo fechas, horarios, sedes y asignaciones de fase de grupos.' },
      { q: '¿Puedo filtrar los partidos por equipo?', a: 'Sí, puedes seleccionar cualquiera de las 48 equipos participantes para ver solo sus partidos de fase de grupos y eliminatorias.' },
      { q: '¿Puedo exportar los partidos a mi calendario?', a: 'Sí, puedes descargar un archivo .ics para los partidos o equipos seleccionados e importarlo a Google Calendar, Outlook o Apple Calendar.' },
    ],
    fr: [
      { q: 'Le calendrier de la Coupe du Monde 2026 est-il exact ?', a: 'Oui, le calendrier est basé sur le calendrier officiel des matchs de la FIFA, incluant dates, horaires, stades et attributions de la phase de groupes.' },
      { q: 'Puis-je filtrer les matchs par équipe ?', a: 'Oui, vous pouvez sélectionner n\'importe laquelle des 48 équipes participantes pour ne voir que ses matchs de poule et à élimination directe.' },
      { q: 'Puis-je exporter les matchs vers mon calendrier ?', a: 'Oui, vous pouvez télécharger un fichier .ics pour les matchs ou équipes sélectionnés et l\'importer dans Google Calendar, Outlook ou Apple Calendar.' },
    ],
    hi: [
      { q: 'क्या विश्व कप 2026 कार्यक्रम सटीक है?', a: 'हाँ, कार्यक्रम आधिकारिक FIFA मैच कैलेंडर पर आधारित है, जिसमें तिथियां, समय, स्थान और ग्रुप चरण असाइनमेंट शामिल हैं।' },
      { q: 'क्या मैं टीम के अनुसार मैच फ़िल्टर कर सकता हूँ?', a: 'हाँ, आप 48 भाग लेने वाली टीमों में से किसी को भी चुन सकते हैं और केवल उनके ग्रुप और नॉकआउट मैच देख सकते हैं।' },
      { q: 'क्या मैं मैचों को अपने कैलेंडर में निर्यात कर सकता हूँ?', a: 'हाँ, आप चयनित मैचों या टीमों के लिए .ics फ़ाइल डाउनलोड कर सकते हैं और इसे Google Calendar, Outlook या Apple Calendar में आयात कर सकते हैं।' },
    ],
    ar: [
      { q: 'هل جدول كأس العالم 2026 دقيق؟', a: 'نعم، الجدول مبني على التقويم الرسمي لمباريات FIFA، بما في ذلك التواريخ والأوقات والملاعب وتعيينات دور المجموعات.' },
      { q: 'هل يمكنني تصفية المباريات حسب الفريق؟', a: 'نعم، يمكنك اختيار أي من الفرق الـ 48 المشاركة لرؤية مبارياتها في دور المجموعات والأدوار الإقصائية فقط.' },
      { q: 'هل يمكنني تصدير المباريات إلى تقويمي؟', a: 'نعم، يمكنك تنزيل ملف .ics للمباريات أو الفرق المحددة واستيراده إلى Google Calendar أو Outlook أو Apple Calendar.' },
    ],
  },
  'wc-champion-predictor': {
    en: [
      { q: 'How does the champion prediction work?', a: 'You fill in your predicted finishing positions for each group and knockout round, and the tool simulates the bracket to determine your champion.' },
      { q: 'Can I share my predictions?', a: 'Yes, you can export your bracket as an image or share a unique link to show your picks to friends.' },
      { q: 'Is this just for fun or based on real stats?', a: 'It is primarily a fan engagement tool for fun; results are driven by your picks, not statistical forecasting.' },
    ],
    zh: [
      { q: '冠军预测如何工作？', a: '您填写每个小组和淘汰轮次的预测排名，工具模拟对阵图来确定您的冠军。' },
      { q: '可以分享我的预测吗？', a: '可以，您可以将对阵图导出为图片或分享唯一链接，向朋友展示您的选择。' },
      { q: '这只是娱乐还是基于真实数据？', a: '这主要是面向球迷的娱乐工具，结果由您的选择驱动，而非统计预测。' },
    ],
    es: [
      { q: '¿Cómo funciona la predicción de campeón?', a: 'Rellenas las posiciones previstas para cada grupo y ronda eliminatoria, y la herramienta simula el cuadro para determinar tu campeón.' },
      { q: '¿Puedo compartir mis predicciones?', a: 'Sí, puedes exportar tu cuadro como imagen o compartir un enlace único para mostrar tus selecciones a tus amigos.' },
      { q: '¿Es solo por diversión o se basa en estadísticas reales?', a: 'Es principalmente una herramienta de participación para fans; los resultados dependen de tus selecciones, no de pronósticos estadísticos.' },
    ],
    fr: [
      { q: 'Comment fonctionne la prédiction du champion ?', a: 'Vous remplissez les positions prévues pour chaque groupe et tour à élimination directe, et l\'outil simule le tableau pour déterminer votre champion.' },
      { q: 'Puis-je partager mes prédictions ?', a: 'Oui, vous pouvez exporter votre tableau sous forme d\'image ou partager un lien unique pour montrer vos choix à vos amis.' },
      { q: 'Est-ce juste pour le fun ou basé sur des statistiques réelles ?', a: 'C\'est principalement un outil d\'engagement pour les fans ; les résultats sont déterminés par vos choix, pas par des prévisions statistiques.' },
    ],
    hi: [
      { q: 'चैंपियन पूर्वानुमान कैसे काम करता है?', a: 'आप प्रत्येक ग्रुप और नॉकआउट राउंड के लिए अपनी अनुमानित स्थिति भरते हैं, और उपकरण आपके चैंपियन को निर्धारित करने के लिए ब्रैकेट का अनुकरण करता है।' },
      { q: 'क्या मैं अपनी भविष्यवाणियाँ साझा कर सकता हूँ?', a: 'हाँ, आप अपने ब्रैकेट को छवि के रूप में निर्यात कर सकते हैं या अपने दोस्तों को दिखाने के लिए एक अद्वितीय लिंक साझा कर सकते हैं।' },
      { q: 'क्या यह केवल मनोरंजन के लिए है या वास्तविक आँकड़ों पर आधारित है?', a: 'यह मुख्य रूप से प्रशंसकों के लिए मनोरंजन उपकरण है; परिणाम आपके चुनाव द्वारा निर्धारित होते हैं, न कि सांख्यिकीय पूर्वानुमान द्वारा।' },
    ],
    ar: [
      { q: 'كيف يعمل توقع البطل؟', a: 'تقوم بملء المراكز المتوقعة لكل مجموعة وجولة خروج المغلوب، وتقوم الأداة بمحاكاة القرعة لتحديد بطلك.' },
      { q: 'هل يمكنني مشاركة توقعاتي؟', a: 'نعم، يمكنك تصدير القرعة كصورة أو مشاركة رابط فريد لإظهار اختياراتك لأصدقائك.' },
      { q: 'هل هذا للترفيه فقط أم مبني على إحصائيات حقيقية؟', a: 'إنه في المقام الأول أداة تفاعل للمشجعين للمرح؛ النتائج مدفوعة باختياراتك، وليس بالتنبؤ الإحصائي.' },
    ],
  },
  'wc-poster-generator': {
    en: [
      { q: 'What poster templates are available?', a: 'The tool offers multiple templates themed for group stage, knockout, final, and customizable team-vs-team match formats.' },
      { q: 'Can I customize text on the poster?', a: 'Yes, you can edit team names, match date, time, venue, and add your own tagline or hashtag.' },
      { q: 'Can I download the poster as an image?', a: 'Yes, you can download the finished poster as a high-resolution PNG suitable for social media or printing.' },
    ],
    zh: [
      { q: '有哪些海报模板？', a: '工具提供多个主题模板，包括小组赛、淘汰赛、决赛和可自定义的对阵格式。' },
      { q: '可以自定义海报文字吗？', a: '可以，您可以编辑球队名称、比赛日期、时间、场馆，并添加自己的标语或话题标签。' },
      { q: '可以下载海报为图片吗？', a: '可以，您可以将完成的海报下载为高分辨率 PNG，适合社交媒体或打印。' },
    ],
    es: [
      { q: '¿Qué plantillas de póster están disponibles?', a: 'La herramienta ofrece varias plantillas con temas de fase de grupos, eliminatoria, final y formatos personalizables de partido entre equipos.' },
      { q: '¿Puedo personalizar el texto del póster?', a: 'Sí, puedes editar nombres de equipos, fecha del partido, hora, sede y añadir tu propio eslogan o hashtag.' },
      { q: '¿Puedo descargar el póster como imagen?', a: 'Sí, puedes descargar el póster terminado como PNG de alta resolución, apto para redes sociales o impresión.' },
    ],
    fr: [
      { q: 'Quels modèles d\'affiche sont disponibles ?', a: 'L\'outil propose plusieurs modèles thématisés pour la phase de groupes, les éliminatoires, la finale et des formats de match personnalisables.' },
      { q: 'Puis-je personnaliser le texte de l\'affiche ?', a: 'Oui, vous pouvez modifier les noms d\'équipes, la date du match, l\'heure, le stade et ajouter votre propre slogan ou hashtag.' },
      { q: 'Puis-je télécharger l\'affiche comme image ?', a: 'Oui, vous pouvez télécharger l\'affiche finie en PNG haute résolution, adapté aux réseaux sociaux ou à l\'impression.' },
    ],
    hi: [
      { q: 'कौन से पोस्टर टेम्पलेट उपलब्ध हैं?', a: 'यह उपकरण ग्रुप चरण, नॉकआउट, फाइनल और अनुकूलन योग्य टीम-बनाम-टीम मैच प्रारूपों के लिए थीम वाले कई टेम्पलेट प्रदान करता है।' },
      { q: 'क्या मैं पोस्टर पर टेक्स्ट को कस्टमाइज़ कर सकता हूँ?', a: 'हाँ, आप टीम के नाम, मैच की तारीख, समय, स्थान संपादित कर सकते हैं और अपना स्लोगन या हैशटैग जोड़ सकते हैं।' },
      { q: 'क्या मैं पोस्टर को छवि के रूप में डाउनलोड कर सकता हूँ?', a: 'हाँ, आप समाप्त पोस्टर को सोशल मीडिया या प्रिंटिंग के लिए उपयुक्त उच्च-रिज़ॉल्यूशन PNG के रूप में डाउनलोड कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما قوالب الملصقات المتاحة؟', a: 'تقدم الأداة قوالب متعددة بموضوعات مرحلة المجموعات، خروج المغلوب، النهائي، وتنسيقات مباريات قابلة للتخصيص.' },
      { q: 'هل يمكنني تخصيص النص على الملصق؟', a: 'نعم، يمكنك تعديل أسماء الفرق وتاريخ المباراة والوقت والمكان وإضافة شعارك الخاص أو هاشتاغ.' },
      { q: 'هل يمكنني تنزيل الملصق كصورة؟', a: 'نعم، يمكنك تنزيل الملصق النهائي كملف PNG عالي الدقة مناسب لوسائل التواصل الاجتماعي أو الطباعة.' },
    ],
  },
  'wc-ascii-art': {
    en: [
      { q: 'What is ASCII art?', a: 'ASCII art is images created using only text characters, letting you share football-themed graphics in any text field that supports monospace fonts.' },
      { q: 'Can I customize the characters used?', a: 'Yes, you can change the character set, density, and width to control how detailed or compact your ASCII art appears.' },
      { q: 'Does it support national flags?', a: 'Yes, you can generate ASCII representations of national flags and team logos for the 48 World Cup participating nations.' },
    ],
    zh: [
      { q: 'ASCII 艺术是什么？', a: 'ASCII 艺术是仅使用文本字符创作的图像，可在任何支持等宽字体的文本区域分享足球主题图形。' },
      { q: '可以自定义使用的字符吗？', a: '可以，您可以更改字符集、密度和宽度，控制 ASCII 艺术的细节和紧凑程度。' },
      { q: '支持国旗吗？', a: '支持，您可以为 48 个世界杯参赛国家生成国旗和球队标志的 ASCII 图形。' },
    ],
    es: [
      { q: '¿Qué es el arte ASCII?', a: 'El arte ASCII son imágenes creadas usando solo caracteres de texto, lo que te permite compartir gráficos con temática de fútbol en cualquier campo de texto que admita fuentes monoespaciadas.' },
      { q: '¿Puedo personalizar los caracteres utilizados?', a: 'Sí, puedes cambiar el conjunto de caracteres, la densidad y el ancho para controlar qué tan detallado o compacto aparece tu arte ASCII.' },
      { q: '¿Admite banderas nacionales?', a: 'Sí, puedes generar representaciones ASCII de banderas nacionales y logotipos de equipos para las 48 naciones participantes en la Copa del Mundo.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que l\'art ASCII ?', a: 'L\'art ASCII consiste en des images créées uniquement avec des caractères texte, vous permettant de partager des graphismes sur le thème du football dans tout champ texte prenant en charge les polices à chasse fixe.' },
      { q: 'Puis-je personnaliser les caractères utilisés ?', a: 'Oui, vous pouvez modifier le jeu de caractères, la densité et la largeur pour contrôler le niveau de détail ou de compacité de votre art ASCII.' },
      { q: 'Prend-il en charge les drapeaux nationaux ?', a: 'Oui, vous pouvez générer des représentations ASCII des drapeaux nationaux et logos d\'équipes pour les 48 nations participantes à la Coupe du Monde.' },
    ],
    hi: [
      { q: 'ASCII कला क्या है?', a: 'ASCII कला केवल टेक्स्ट वर्णों का उपयोग करके बनाई गई छवियां हैं, जिससे आप किसी भी टेक्स्ट फ़ील्ड में फुटबॉल-थीम वाले ग्राफिक्स साझा कर सकते हैं।' },
      { q: 'क्या मैं उपयोग किए गए वर्णों को कस्टमाइज़ कर सकता हूँ?', a: 'हाँ, आप वर्ण सेट, घनत्व और चौड़ाई बदल सकते हैं ताकि आपकी ASCII कला कितनी विस्तृत या कॉम्पैक्ट दिखे, इसे नियंत्रित कर सकें।' },
      { q: 'क्या यह राष्ट्रीय झंडे का समर्थन करता है?', a: 'हाँ, आप 48 विश्व कप भागीदार राष्ट्रों के लिए राष्ट्रीय झंडों और टीम लोगो का ASCII प्रतिनिधित्व उत्पन्न कर सकते हैं।' },
    ],
    ar: [
      { q: 'ما هو فن ASCII؟', a: 'فن ASCII هو صور تم إنشاؤها باستخدام أحرف نصية فقط، مما يسمح لك بمشاركة رسومات بكرة القدم في أي حقل نصي يدعم الخطوط ثابتة العرض.' },
      { q: 'هل يمكنني تخصيص الأحرف المستخدمة؟', a: 'نعم، يمكنك تغيير مجموعة الأحرف والكثافة والعرض للتحكم في مدى تفصيل أو إحكام فن ASCII الخاص بك.' },
      { q: 'هل يدعم الأعلام الوطنية؟', a: 'نعم، يمكنك إنشاء تمثيلات ASCII للأعلام الوطنية وشعارات الفرق لـ 48 دولة مشاركة في كأس العالم.' },
    ],
  },
  'wc-fan-avatar': {
    en: [
      { q: 'How do I make a fan avatar?', a: 'Pick a template, choose your team, add your name or message, and the tool generates a downloadable avatar instantly.' },
      { q: 'Can I use my own photo?', a: 'Yes, you can upload a photo from your device and the tool will frame it with team colors and badges.' },
      { q: 'What team badges are available?', a: 'All 48 participating World Cup nations\' badges and color schemes are available for customization.' },
    ],
    zh: [
      { q: '如何制作球迷头像？', a: '选择模板、选择球队、添加您的名字或信息，工具会即时生成可下载的头像。' },
      { q: '可以使用我的照片吗？', a: '可以，您可以从设备上传照片，工具会用球队颜色和徽章为其加框。' },
      { q: '有哪些球队徽章？', a: '提供 48 个世界杯参赛国家的徽章和配色方案供自定义。' },
    ],
    es: [
      { q: '¿Cómo creo un avatar de aficionado?', a: 'Elige una plantilla, selecciona tu equipo, añade tu nombre o mensaje y la herramienta genera un avatar descargable al instante.' },
      { q: '¿Puedo usar mi propia foto?', a: 'Sí, puedes subir una foto desde tu dispositivo y la herramienta la enmarcará con los colores y escudos del equipo.' },
      { q: '¿Qué escudos de equipos están disponibles?', a: 'Están disponibles los escudos y esquemas de colores de las 48 naciones participantes en la Copa del Mundo.' },
    ],
    fr: [
      { q: 'Comment créer un avatar de supporter ?', a: 'Choisissez un modèle, sélectionnez votre équipe, ajoutez votre nom ou message, et l\'outil génère un avatar téléchargeable instantanément.' },
      { q: 'Puis-je utiliser ma propre photo ?', a: 'Oui, vous pouvez télécharger une photo depuis votre appareil et l\'outil l\'encadrera avec les couleurs et écussons de l\'équipe.' },
      { q: 'Quels écussons d\'équipe sont disponibles ?', a: 'Les écussons et schémas de couleurs des 48 nations participantes à la Coupe du Monde sont disponibles pour la personnalisation.' },
    ],
    hi: [
      { q: 'मैं फैन अवतार कैसे बनाऊँ?', a: 'टेम्पलेट चुनें, अपनी टीम चुनें, अपना नाम या संदेश जोड़ें, और उपकरण तुरंत एक डाउनलोड करने योग्य अवतार उत्पन्न करता है।' },
      { q: 'क्या मैं अपनी खुद की फ़ोटो का उपयोग कर सकता हूँ?', a: 'हाँ, आप अपने डिवाइस से एक फ़ोटो अपलोड कर सकते हैं और उपकरण इसे टीम रंगों और बैज के साथ फ़्रेम करेगा।' },
      { q: 'कौन से टीम बैज उपलब्ध हैं?', a: 'सभी 48 भाग लेने वाले विश्व कप राष्ट्रों के बैज और रंग योजनाएँ अनुकूलन के लिए उपलब्ध हैं।' },
    ],
    ar: [
      { q: 'كيف أصنع avatar مشجع؟', a: 'اختر قالبًا، اختر فريقك، أضف اسمك أو رسالتك، وستنشئ الأداة avatar قابل للتنزيل فورًا.' },
      { q: 'هل يمكنني استخدام صورتي الخاصة؟', a: 'نعم، يمكنك تحميل صورة من جهازك وستقوم الأداة بتأطيرها بألوان الفريق وشاراته.' },
      { q: 'ما شارات الفرق المتاحة؟', a: 'شارات وأنظمة ألوان جميع الدول الـ 48 المشاركة في كأس العالم متاحة للتخصيص.' },
    ],
  },
  'wc-scoreboard-simulator': {
    en: [
      { q: 'Can I simulate match scores?', a: 'Yes, you can input scores for any group or knockout match and the simulator updates the standings and bracket accordingly.' },
      { q: 'Does it track group standings live?', a: 'Yes, as you enter scores the tool recalculates points, goal difference, and rankings in real time using official tiebreaker rules.' },
      { q: 'Can I share my simulated results?', a: 'Yes, you can export the final standings and bracket as an image or share a link with your predicted outcomes.' },
    ],
    zh: [
      { q: '可以模拟比赛比分吗？', a: '可以，您可以为任意小组或淘汰赛输入比分，模拟器会相应更新积分和对阵图。' },
      { q: '可以实时追踪小组积分吗？', a: '可以，输入比分时，工具会使用官方排名规则实时重新计算积分、净胜球和排名。' },
      { q: '可以分享模拟结果吗？', a: '可以，您可以将最终积分和对阵图导出为图片或分享带预测结果的链接。' },
    ],
    es: [
      { q: '¿Puedo simular resultados de partidos?', a: 'Sí, puedes introducir resultados de cualquier partido de grupo o eliminatoria y el simulador actualiza la clasificación y el cuadro en consecuencia.' },
      { q: '¿Realiza un seguimiento de las clasificaciones de grupo en vivo?', a: 'Sí, al introducir los resultados la herramienta recalcula puntos, diferencia de goles y clasificaciones en tiempo real usando las reglas oficiales de desempate.' },
      { q: '¿Puedo compartir mis resultados simulados?', a: 'Sí, puedes exportar la clasificación final y el cuadro como imagen o compartir un enlace con tus resultados previstos.' },
    ],
    fr: [
      { q: 'Puis-je simuler des scores de match ?', a: 'Oui, vous pouvez saisir les scores de n\'importe quel match de groupe ou à élimination directe et le simulateur met à jour le classement et le tableau.' },
      { q: 'Suit-il les classements de groupe en direct ?', a: 'Oui, à mesure que vous saisissez les scores, l\'outil recalcule les points, la différence de buts et les classements en temps réel selon les règles officielles de départage.' },
      { q: 'Puis-je partager mes résultats simulés ?', a: 'Oui, vous pouvez exporter le classement final et le tableau sous forme d\'image ou partager un lien avec vos résultats prévus.' },
    ],
    hi: [
      { q: 'क्या मैं मैच स्कोर का अनुकरण कर सकता हूँ?', a: 'हाँ, आप किसी भी ग्रुप या नॉकआउट मैच के लिए स्कोर इनपुट कर सकते हैं और सिम्युलेटर तदनुसार स्टैंडिंग और ब्रैकेट को अपडेट करता है।' },
      { q: 'क्या यह ग्रुप स्टैंडिंग को लाइव ट्रैक करता है?', a: 'हाँ, जैसे ही आप स्कोर दर्ज करते हैं, उपकरण आधिकारिक टाईब्रेकर नियमों का उपयोग करके अंक, गोल अंतर और रैंकिंग को वास्तविक समय में पुनर्गणना करता है।' },
      { q: 'क्या मैं अपने अनुकरणित परिणाम साझा कर सकता हूँ?', a: 'हाँ, आप अंतिम स्टैंडिंग और ब्रैकेट को छवि के रूप में निर्यात कर सकते हैं या अपने अनुमानित परिणामों के साथ लिंक साझा कर सकते हैं।' },
    ],
    ar: [
      { q: 'هل يمكنني محاكاة نتائج المباريات؟', a: 'نعم، يمكنك إدخال النتائج لأي مباراة في المجموعات أو خروج المغلوب ويقوم المحاكي بتحديث الترتيب والقرعة وفقًا لذلك.' },
      { q: 'هل يتتبع ترتيب المجموعات مباشرة؟', a: 'نعم، أثناء إدخال النتائج تعيد الأداة حساب النقاط وفارق الأهداف والترتيب في الوقت الفعلي باستخدام قواعد كسر التعادل الرسمية.' },
      { q: 'هل يمكنني مشاركة نتائجي المحاكاة؟', a: 'نعم، يمكنك تصدير الترتيب النهائي والقرعة كصورة أو مشاركة رابط بنتائجك المتوقعة.' },
    ],
  },
  'wc-name-decorator': {
    en: [
      { q: 'How does the name decorator work?', a: 'Enter your name, choose a team theme, and the tool applies team colors, badges, and decorative elements around your text.' },
      { q: 'Can I choose my team\'s colors?', a: 'Yes, you can pick from all 48 participating nations\' official color palettes or set custom colors manually.' },
      { q: 'Can I download the decorated image?', a: 'Yes, you can export the decorated name as a PNG image for use as a profile picture, wallpaper, or social media post.' },
    ],
    zh: [
      { q: '名字装饰器如何工作？', a: '输入您的名字、选择球队主题，工具会在文字周围应用球队颜色、徽章和装饰元素。' },
      { q: '可以选择球队颜色吗？', a: '可以，您可以从 48 个参赛国家的官方配色中选择，或手动设置自定义颜色。' },
      { q: '可以下载装饰后的图片吗？', a: '可以，您可以将装饰后的名字导出为 PNG 图片，用作头像、壁纸或社交媒体帖子。' },
    ],
    es: [
      { q: '¿Cómo funciona el decorador de nombres?', a: 'Introduce tu nombre, elige un tema de equipo y la herramienta aplica colores, escudos y elementos decorativos alrededor de tu texto.' },
      { q: '¿Puedo elegir los colores de mi equipo?', a: 'Sí, puedes elegir entre las paletas oficiales de los 48 países participantes o configurar colores personalizados manualmente.' },
      { q: '¿Puedo descargar la imagen decorada?', a: 'Sí, puedes exportar el nombre decorado como imagen PNG para usarla como foto de perfil, fondo o publicación en redes sociales.' },
    ],
    fr: [
      { q: 'Comment fonctionne le décorateur de noms ?', a: 'Entrez votre nom, choisissez un thème d\'équipe, et l\'outil applique les couleurs, écussons et éléments décoratifs autour de votre texte.' },
      { q: 'Puis-je choisir les couleurs de mon équipe ?', a: 'Oui, vous pouvez choisir parmi les palettes officielles des 48 pays participants ou définir des couleurs personnalisées manuellement.' },
      { q: 'Puis-je télécharger l\'image décorée ?', a: 'Oui, vous pouvez exporter le nom décoré en image PNG pour l\'utiliser comme photo de profil, fond d\'écran ou publication sur les réseaux sociaux.' },
    ],
    hi: [
      { q: 'नाम डेकोरेटर कैसे काम करता है?', a: 'अपना नाम दर्ज करें, टीम थीम चुनें, और उपकरण आपके टेक्स्ट के चारों ओर टीम रंग, बैज और सजावटी तत्व लागू करता है।' },
      { q: 'क्या मैं अपनी टीम के रंग चुन सकता हूँ?', a: 'हाँ, आप सभी 48 भाग लेने वाले देशों के आधिकारिक रंग पैलेट में से चुन सकते हैं या कस्टम रंग मैन्युअल रूप से सेट कर सकते हैं।' },
      { q: 'क्या मैं सजाई गई छवि डाउनलोड कर सकता हूँ?', a: 'हाँ, आप सजाए गए नाम को PNG छवि के रूप में निर्यात कर सकते हैं और इसे प्रोफ़ाइल चित्र, वॉलपेपर या सोशल मीडिया पोस्ट के रूप में उपयोग कर सकते हैं।' },
    ],
    ar: [
      { q: 'كيف يعمل مزين الأسماء؟', a: 'أدخل اسمك، اختر سمة فريق، وتقوم الأداة بتطبيق ألوان الفريق والشارات والعناصر الزخرفية حول نصك.' },
      { q: 'هل يمكنني اختيار ألوان فريقي؟', a: 'نعم، يمكنك الاختيار من بين لوحات الألوان الرسمية لجميع الدول الـ 48 المشاركة أو تعيين ألوان مخصصة يدويًا.' },
      { q: 'هل يمكنني تنزيل الصورة المزينة؟', a: 'نعم، يمكنك تصدير الاسم المزين كصورة PNG لاستخدامها كصورة ملف شخصي أو خلفية أو منشور على وسائل التواصل الاجتماعي.' },
    ],
  },
  'chat-screenshot-generator': {
    en: [
      { q: 'Is the chat screenshot generator free?', a: 'Yes, 100% free with no signup, no watermark, and no limits on how many screenshots you can create.' },
      { q: 'Do the generated chat screenshots look realistic?', a: 'Yes, the tool replicates real messenger UI with avatars, timestamps, read receipts and bubble styles so screenshots look authentic.' },
      { q: 'Are my chats uploaded to your server?', a: 'No. All content is processed locally in your browser. Nothing you type ever leaves your device.' },
      { q: 'What message types are supported?', a: 'Text messages, image messages, voice clips, video stickers, link previews, system notifications and time dividers are all supported.' },
      { q: 'How do I download the generated screenshot?', a: 'Click the Download button and the screenshot will be saved as a high-resolution PNG image to your device.' },
    ],
    zh: [
      { q: '聊天记录生成器是否免费？', a: '是的，完全免费，无需注册、无水印，截图生成次数不限。' },
      { q: '生成的聊天截图是否逼真？', a: '是的，工具复刻了真实聊天软件的界面，包含头像、时间戳、已读回执和气泡样式，截图看起来非常逼真。' },
      { q: '聊天内容是否上传到服务器？', a: '不会。所有内容均在浏览器本地处理，您输入的任何内容都不会离开您的设备。' },
      { q: '支持哪些消息类型？', a: '支持文字消息、图片消息、语音条、视频贴纸、链接预览、系统通知和时间分隔符。' },
      { q: '如何下载生成的截图？', a: '点击下载按钮，截图将以高分辨率 PNG 图片形式保存到您的设备。' },
    ],
    es: [
      { q: '¿El generador de capturas de chat es gratis?', a: 'Sí, 100% gratis, sin registro, sin marca de agua y sin límite en la cantidad de capturas que puedes crear.' },
      { q: '¿Las capturas de chat generadas parecen realistas?', a: 'Sí, la herramienta replica la interfaz real de mensajería con avatares, marcas de tiempo, confirmaciones de lectura y estilos de burbujas para que las capturas se vean auténticas.' },
      { q: '¿Mis chats se suben a tu servidor?', a: 'No. Todo el contenido se procesa localmente en tu navegador. Nada de lo que escribes sale de tu dispositivo.' },
      { q: '¿Qué tipos de mensajes se admiten?', a: 'Se admiten mensajes de texto, imágenes, notas de voz, stickers de video, vistas previas de enlaces, notificaciones del sistema y separadores de tiempo.' },
      { q: '¿Cómo descargo la captura generada?', a: 'Haz clic en el botón de descarga y la captura se guardará como una imagen PNG de alta resolución en tu dispositivo.' },
    ],
    fr: [
      { q: 'Le générateur de captures de chat est-il gratuit ?', a: 'Oui, 100 % gratuit, sans inscription, sans filigrane et sans limite sur le nombre de captures que vous pouvez créer.' },
      { q: 'Les captures de chat générées semblent-elles réalistes ?', a: 'Oui, l\'outil reproduit l\'interface réelle de messagerie avec avatars, horodatages, confirmations de lecture et styles de bulles pour des captures authentiques.' },
      { q: 'Mes chats sont-ils téléchargés sur votre serveur ?', a: 'Non. Tout le contenu est traité localement dans votre navigateur. Rien de ce que vous tapez ne quitte votre appareil.' },
      { q: 'Quels types de messages sont pris en charge ?', a: 'Messages texte, images, notes vocales, autocollants vidéo, aperçus de liens, notifications système et séparateurs de temps sont pris en charge.' },
      { q: 'Comment télécharger la capture générée ?', a: 'Cliquez sur le bouton de téléchargement et la capture sera enregistrée sous forme d\'image PNG haute résolution sur votre appareil.' },
    ],
    hi: [
      { q: 'क्या चैट स्क्रीनशॉट जनरेटर मुफ़्त है?', a: 'हाँ, 100% मुफ़्त, बिना साइन अप, बिना वॉटरमार्क, और आप कितनी भी स्क्रीनशॉट बना सकते हैं उस पर कोई सीमा नहीं।' },
      { q: 'क्या जनरेट किए गए चैट स्क्रीनशॉट यथार्थवादी दिखते हैं?', a: 'हाँ, यह टूल अवतार, टाइमस्टैम्प, रीड रिसीट और बबल स्टाइल के साथ वास्तविक मैसेंजर UI की नकल करता है ताकि स्क्रीनशॉट प्रामाणिक दिखें।' },
      { q: 'क्या मेरी चैट्स आपके सर्वर पर अपलोड की जाती हैं?', a: 'नहीं। सभी सामग्री आपके ब्राउज़र में स्थानीय रूप से संसाधित होती है। आप जो भी टाइप करते हैं वह आपके डिवाइस से कभी बाहर नहीं जाता।' },
      { q: 'किन संदेश प्रकारों का समर्थन किया जाता है?', a: 'टेक्स्ट संदेश, छवि संदेश, वॉइस क्लिप, वीडियो स्टिकर, लिंक पूर्वावलोकन, सिस्टम सूचनाएं और समय विभाजक सभी समर्थित हैं।' },
      { q: 'मैं जनरेट किए गए स्क्रीनशॉट को कैसे डाउनलोड करूं?', a: 'डाउनलोड बटन पर क्लिक करें और स्क्रीनशॉट आपके डिवाइस पर उच्च-रिज़ॉल्यूशन PNG छवि के रूप में सहेजा जाएगा।' },
    ],
    ar: [
      { q: 'هل مولد لقطات الدردشة مجاني؟', a: 'نعم، مجاني 100% بدون تسجيل وبدون علامة مائية وبدون قيود على عدد اللقطات التي يمكنك إنشائها.' },
      { q: 'هل تبدو لقطات الدردشة المولدة واقعية؟', a: 'نعم، تحاكي الأداة واجهة المراسلة الحقيقية مع الصور الرمزية والطوابع الزمنية وإيصالات القراءة وأنماط الفقاعات لتبدو اللقطات أصلية.' },
      { q: 'هل يتم تحميل محادثاتي إلى خادمك؟', a: 'لا. تتم معالجة كل المحتوى محليًا في متصفحك. لا شيء مما تكتبه يغادر جهازك.' },
      { q: 'ما أنواع الرسائل المدعومة؟', a: 'الرسائل النصية، رسائل الصور، المقاطع الصوتية، ملصقات الفيديو، معاينات الروابط، إشعارات النظام وفواصل الوقت مدعومة جميعها.' },
      { q: 'كيف أقوم بتنزيل اللقطة المولدة؟', a: 'انقر على زر التنزيل وسيتم حفظ اللقطة كصورة PNG عالية الدقة على جهازك.' },
    ],
  },
  'meme-generator': {
    en: [
      { q: 'Is the meme generator free?', a: 'Yes, 100% free with no signup, no watermark, and no daily limits on the memes you can create.' },
      { q: 'What image formats are supported?', a: 'JPG, PNG, WEBP and GIF are supported for upload. Finished memes can be exported as PNG or JPG.' },
      { q: 'Is my data safe?', a: 'Yes. All editing happens locally in your browser — your images and text never leave your device or hit any server.' },
      { q: 'Can I customize the text position?', a: 'Yes, you can drag the caption anywhere on the image, and freely change font, size, color, outline and rotation.' },
      { q: 'How do I download my meme?', a: 'Click the Download button after editing. The meme will be saved as a PNG or JPG image to your device.' },
    ],
    zh: [
      { q: '表情包生成器是否免费？', a: '是的，完全免费，无需注册、无水印，每日生成次数不限。' },
      { q: '支持哪些图片格式？', a: '上传支持 JPG、PNG、WEBP 和 GIF 格式。完成的表情包可导出为 PNG 或 JPG。' },
      { q: '我的数据安全吗？', a: '安全。所有编辑均在浏览器本地进行——您的图片和文字永远不会离开您的设备，也不会上传到任何服务器。' },
      { q: '能否自定义文字位置？', a: '可以，您可以将文字拖动到图片上的任意位置，并自由调整字体、大小、颜色、描边和旋转角度。' },
      { q: '如何下载生成的表情包？', a: '编辑完成后点击下载按钮，表情包将以 PNG 或 JPG 图片形式保存到您的设备。' },
    ],
    es: [
      { q: '¿El generador de memes es gratis?', a: 'Sí, 100% gratis, sin registro, sin marca de agua y sin límites diarios en los memes que puedes crear.' },
      { q: '¿Qué formatos de imagen se admiten?', a: 'Se admiten JPG, PNG, WEBP y GIF para subir. Los memes terminados se pueden exportar como PNG o JPG.' },
      { q: '¿Mis datos están seguros?', a: 'Sí. Toda la edición se realiza localmente en tu navegador: tus imágenes y texto nunca salen de tu dispositivo ni tocan ningún servidor.' },
      { q: '¿Puedo personalizar la posición del texto?', a: 'Sí, puedes arrastrar el texto a cualquier parte de la imagen y cambiar libremente fuente, tamaño, color, contorno y rotación.' },
      { q: '¿Cómo descargo mi meme?', a: 'Haz clic en el botón de descarga después de editar. El meme se guardará como imagen PNG o JPG en tu dispositivo.' },
    ],
    fr: [
      { q: 'Le générateur de mèmes est-il gratuit ?', a: 'Oui, 100 % gratuit, sans inscription, sans filigrane et sans limites quotidiennes sur les mèmes que vous pouvez créer.' },
      { q: 'Quels formats d\'image sont pris en charge ?', a: 'JPG, PNG, WEBP et GIF sont pris en charge pour l\'import. Les mèmes terminés peuvent être exportés en PNG ou JPG.' },
      { q: 'Mes données sont-elles en sécurité ?', a: 'Oui. Toute l\'édition se fait localement dans votre navigateur — vos images et textes ne quittent jamais votre appareil ni n\'atteignent aucun serveur.' },
      { q: 'Puis-je personnaliser la position du texte ?', a: 'Oui, vous pouvez glisser la légende n\'importe où sur l\'image et changer librement la police, la taille, la couleur, le contour et la rotation.' },
      { q: 'Comment télécharger mon mème ?', a: 'Cliquez sur le bouton de téléchargement après l\'édition. Le mème sera enregistré sous forme d\'image PNG ou JPG sur votre appareil.' },
    ],
    hi: [
      { q: 'क्या मीम जनरेटर मुफ़्त है?', a: 'हाँ, 100% मुफ़्त, बिना साइन अप, बिना वॉटरमार्क, और आप जितने मीम बना सकते हैं उस पर कोई दैनिक सीमा नहीं।' },
      { q: 'किन छवि प्रारूपों का समर्थन किया जाता है?', a: 'अपलोड के लिए JPG, PNG, WEBP और GIF समर्थित हैं। तैयार मीम्स को PNG या JPG के रूप में निर्यात किया जा सकता है।' },
      { q: 'क्या मेरा डेटा सुरक्षित है?', a: 'हाँ। सभी संपादन आपके ब्राउज़र में स्थानीय रूप से होता है — आपकी छवियां और टेक्स्ट कभी आपके डिवाइस से बाहर नहीं जाते और न ही किसी सर्वर तक पहुंचते हैं।' },
      { q: 'क्या मैं टेक्स्ट की स्थिति को कस्टमाइज़ कर सकता हूं?', a: 'हाँ, आप कैप्शन को छवि पर कहीं भी खींच सकते हैं और फ़ॉन्ट, आकार, रंग, रूपरेखा और घुमाव को स्वतंत्र रूप से बदल सकते हैं।' },
      { q: 'मैं अपना मीम कैसे डाउनलोड करूं?', a: 'संपादन के बाद डाउनलोड बटन पर क्लिक करें। मीम आपके डिवाइस पर PNG या JPG छवि के रूप में सहेजा जाएगा।' },
    ],
    ar: [
      { q: 'هل مولد الميمز مجاني؟', a: 'نعم، مجاني 100% بدون تسجيل وبدون علامة مائية وبدون حدود يومية على الميمز التي يمكنك إنشائها.' },
      { q: 'ما تنسيقات الصور المدعومة؟', a: 'JPG وPNG وWEBP وGIF مدعومة للرفع. يمكن تصدير الميمز النهائية كـ PNG أو JPG.' },
      { q: 'هل بياناتي آمنة؟', a: 'نعم. تتم كل عمليات التحرير محليًا في متصفحك — صورك ونصوصك لا تغادر جهازك أبدًا ولا تصل إلى أي خادم.' },
      { q: 'هل يمكنني تخصيص موضع النص؟', a: 'نعم، يمكنك سحب التسمية التوضيحية إلى أي مكان على الصورة وتغيير الخط والحجم واللون والمخطط والدوران بحرية.' },
      { q: 'كيف أقوم بتنزيل الميم الخاص بي؟', a: 'انقر على زر التنزيل بعد التحرير. سيتم حفظ الميم كصورة PNG أو JPG على جهازك.' },
    ],
  },
  'daily-tarot': {
    en: [
      { q: 'How many times can I draw per day?', a: 'By default you draw one card per day so the reading stays meaningful, but you can reshuffle as many times as you want for reflection.' },
      { q: 'Are tarot readings accurate?', a: 'Tarot is best treated as a tool for self-reflection and entertainment rather than factual prediction. The value is in what the symbols trigger you to think about.' },
      { q: 'How many cards are in the deck?', a: 'A full deck has 78 cards: 22 Major Arcana and 56 Minor Arcana divided into four suits (Cups, Pentacles, Swords, Wands).' },
      { q: 'Are my reading results saved?', a: 'Yes, your daily draws are stored locally in your browser so you can look back at your history, but they never leave your device.' },
      { q: 'Is the daily tarot tool free?', a: 'Yes, 100% free with no signup and no limits. Draw a card every day and revisit past readings anytime.' },
    ],
    zh: [
      { q: '每天能抽几次塔罗牌？', a: '默认每天抽一张牌，让占卜保持意义，但您可以随心所欲地多次洗牌进行冥想反思。' },
      { q: '塔罗牌准不准？', a: '塔罗牌更适合作为自我反思和娱乐的工具，而非事实预测。其价值在于符号触发您思考的内容。' },
      { q: '塔罗牌组有多少张牌？', a: '完整牌组共 78 张：22 张大阿卡那和 56 张小阿卡那，小阿卡那分为四个花色（圣杯、星币、宝剑、权杖）。' },
      { q: '抽牌结果会保存吗？', a: '会，您的每日抽牌会保存在浏览器本地，您可以回看历史，但数据永远不会离开您的设备。' },
      { q: '每日塔罗牌占卜是否免费？', a: '是的，完全免费，无需注册，次数不限。每天抽一张牌，随时回顾过往占卜。' },
    ],
    es: [
      { q: '¿Cuántas veces puedo sacar al día?', a: 'Por defecto sacas una carta al día para que la lectura sea significativa, pero puedes barajar tantas veces como quieras para reflexionar.' },
      { q: '¿Las lecturas de tarot son precisas?', a: 'El tarot se considera mejor una herramienta de auto-reflexión y entretenimiento que una predicción factual. Su valor está en lo que los símbolos te hacen pensar.' },
      { q: '¿Cuántas cartas tiene la baraja?', a: 'Una baraja completa tiene 78 cartas: 22 Arcanos Mayores y 56 Arcanos Menores divididos en cuatro palos (Copas, Oros, Espadas, Bastos).' },
      { q: '¿Se guardan los resultados de mis lecturas?', a: 'Sí, tus cartas diarias se guardan localmente en tu navegador para que puedas revisar tu historial, pero nunca salen de tu dispositivo.' },
      { q: '¿La herramienta de tarot diario es gratis?', a: 'Sí, 100% gratis, sin registro y sin límites. Saca una carta cada día y revisa lecturas pasadas cuando quieras.' },
    ],
    fr: [
      { q: 'Combien de fois puis-je tirer par jour ?', a: 'Par défaut, vous tirez une carte par jour pour garder une lecture porteuse de sens, mais vous pouvez relancer les cartes autant de fois que vous le souhaitez pour réfléchir.' },
      { q: 'Les tirages de tarot sont-ils précis ?', a: 'Le tarot est mieux considéré comme un outil d\'introspection et de divertissement qu\'une prédiction factuelle. Sa valeur réside dans ce que les symboles vous amènent à penser.' },
      { q: 'Combien de cartes compte le jeu ?', a: 'Un jeu complet comporte 78 cartes : 22 Arcanes Majeurs et 56 Arcanes Mineurs répartis en quatre enseignes (Coupes, Deniers, Épées, Bâtons).' },
      { q: 'Mes résultats de tirage sont-ils sauvegardés ?', a: 'Oui, vos tirages quotidiens sont stockés localement dans votre navigateur pour que vous puissiez revoir votre historique, mais ils ne quittent jamais votre appareil.' },
      { q: 'L\'outil de tarot quotidien est-il gratuit ?', a: 'Oui, 100 % gratuit, sans inscription et sans limites. Tirez une carte chaque jour et revisitez les lectures passées à tout moment.' },
    ],
    hi: [
      { q: 'मैं प्रतिदिन कितनी बार ताश खींच सकता हूं?', a: 'डिफ़ॉल्ट रूप से आप प्रतिदिन एक कार्ड खींचते हैं ताकि रीडिंग अर्थपूर्ण बनी रहे, लेकिन आप चिंतन के लिए जितनी बार चाहें शफल कर सकते हैं।' },
      { q: 'क्या टैरो रीडिंग सटीक होती है?', a: 'टैरो को तथ्यात्मक भविष्यवाणी की तुलना में आत्म-निरीक्षण और मनोरंजन के उपकरण के रूप में देखा जाना चाहिए। इसका मूल्य उसमें है जो प्रतीक आपको सोचने पर मजबूर करते हैं।' },
      { q: 'डेक में कितने कार्ड होते हैं?', a: 'एक पूर्ण डेक में 78 कार्ड होते हैं: 22 मेजर आर्कैना और 56 माइनर आर्कैना जो चार सूट (कप, पेंटाकल्स, स्वॉर्ड्स, वांड्स) में विभाजित हैं।' },
      { q: 'क्या मेरे रीडिंग परिणाम सहेजे जाते हैं?', a: 'हाँ, आपके दैनिक ड्रॉ आपके ब्राउज़र में स्थानीय रूप से संग्रहीत होते हैं ताकि आप अपना इतिहास देख सकें, लेकिन वे कभी आपके डिवाइस से बाहर नहीं जाते।' },
      { q: 'क्या डेली टैरो टूल मुफ़्त है?', a: 'हाँ, 100% मुफ़्त, बिना साइन अप और बिना सीमा। प्रतिदिन एक कार्ड खींचें और कभी भी पिछली रीडिंग दोबारा देखें।' },
    ],
    ar: [
      { q: 'كم مرة يمكنني السحب في اليوم؟', a: 'افتراضيًا تسحب بطاقة واحدة يوميًا لتبقى القراءة ذات معنى، ولكن يمكنك إعادة الخلط كما تشاء للتأمل.' },
      { q: 'هل قراءات التارو دقيقة؟', a: 'يُعامل التارو أفضل كأداة للتأمل الذاتي والترفيه بدلاً من التنبؤ الواقعي. قيمته تكمن في ما تدفعك الرموز للتفكير فيه.' },
      { q: 'كم عدد البطاقات في المجموعة؟', a: 'تحتوي المجموعة الكاملة على 78 بطاقة: 22 أركانا كبرى و56 أركانا صغرى مقسمة إلى أربع بدلات (كؤوس، عملات، سيوف، عصي).' },
      { q: 'هل يتم حفظ نتائج قراءاتي؟', a: 'نعم، تُحفظ سحباتك اليومية محليًا في متصفحك ليمكنك مراجعة سجلِّك، لكنها لا تغادر جهازك أبدًا.' },
      { q: 'هل أداة التارو اليومي مجانية؟', a: 'نعم، مجانية 100% بدون تسجيل وبدون حدود. اسحب بطاقة كل يوم وراجع القراءات السابقة في أي وقت.' },
    ],
  },
  'id-photo-bg-changer': {
    en: [
      { q: 'What background colors are supported?', a: 'Common official colors including white, blue (multiple shades), red and gray, plus a custom color picker for any RGB value you need.' },
      { q: 'Are my photos uploaded to the server?', a: 'No. The background replacement runs entirely in your browser using local image processing. Your photos never leave your device.' },
      { q: 'How good is the cutout quality?', a: 'The tool uses an AI-based edge-detection model to handle hair, shoulders and fine details. Most ID photos come out clean with minimal manual touch-up.' },
      { q: 'What image formats are supported?', a: 'You can upload JPG, PNG and WEBP images. The finished photo can be exported as JPG or PNG at the resolution you choose.' },
      { q: 'How do I download the result?', a: 'After the background is replaced, click the Download button and the new ID photo will be saved to your device in your selected format and size.' },
    ],
    zh: [
      { q: '支持哪些背景色？', a: '支持常见的官方颜色，包括白色、蓝色（多种色调）、红色和灰色，并提供自定义颜色选择器，可设置任意 RGB 值。' },
      { q: '照片是否上传到服务器？', a: '不会。背景替换完全在浏览器本地通过图像处理完成，您的照片永远不会离开您的设备。' },
      { q: '抠图效果如何？', a: '工具采用基于 AI 的边缘检测模型，能够处理头发、肩膀和细节。大多数证件照都能干净抠出，几乎不需要手动修整。' },
      { q: '支持哪些图片格式？', a: '可上传 JPG、PNG 和 WEBP 图片。完成后的照片可按您选择的分辨率导出为 JPG 或 PNG。' },
      { q: '如何下载结果？', a: '背景替换完成后，点击下载按钮，新的证件照将按您选择的格式和尺寸保存到您的设备。' },
    ],
    es: [
      { q: '¿Qué colores de fondo se admiten?', a: 'Colores oficiales comunes incluyendo blanco, azul (varios tonos), rojo y gris, además de un selector de color personalizado para cualquier valor RGB que necesites.' },
      { q: '¿Mis fotos se suben al servidor?', a: 'No. El reemplazo del fondo se ejecuta completamente en tu navegador mediante procesamiento de imágenes local. Tus fotos nunca salen de tu dispositivo.' },
      { q: '¿Qué tan buena es la calidad del recorte?', a: 'La herramienta usa un modelo de detección de bordes basado en IA para manejar cabello, hombros y detalles finos. La mayoría de fotos de carné salen limpias con poco retoque manual.' },
      { q: '¿Qué formatos de imagen se admiten?', a: 'Puedes subir imágenes JPG, PNG y WEBP. La foto terminada se puede exportar como JPG o PNG en la resolución que elijas.' },
      { q: '¿Cómo descargo el resultado?', a: 'Después de reemplazar el fondo, haz clic en el botón de descarga y la nueva foto de carné se guardará en tu dispositivo en el formato y tamaño que seleccionaste.' },
    ],
    fr: [
      { q: 'Quelles couleurs de fond sont prises en charge ?', a: 'Les couleurs officielles courantes dont blanc, bleu (plusieurs nuances), rouge et gris, plus un sélecteur de couleur personnalisé pour toute valeur RGB dont vous avez besoin.' },
      { q: 'Mes photos sont-elles téléchargées sur le serveur ?', a: 'Non. Le remplacement du fond s\'exécute entièrement dans votre navigateur grâce à un traitement d\'image local. Vos photos ne quittent jamais votre appareil.' },
      { q: 'Quelle est la qualité du détourage ?', a: 'L\'outil utilise un modèle de détection des contours basé sur l\'IA pour gérer les cheveux, les épaules et les détails fins. La plupart des photos d\'identité sortent propres avec une retouche manuelle minimale.' },
      { q: 'Quels formats d\'image sont pris en charge ?', a: 'Vous pouvez importer des images JPG, PNG et WEBP. La photo finale peut être exportée en JPG ou PNG à la résolution de votre choix.' },
      { q: 'Comment télécharger le résultat ?', a: 'Après le remplacement du fond, cliquez sur le bouton de téléchargement et la nouvelle photo d\'identité sera enregistrée sur votre appareil au format et à la taille que vous avez choisis.' },
    ],
    hi: [
      { q: 'किन पृष्ठभूमि रंगों का समर्थन किया जाता है?', a: 'सफेद, नीला (कई रंग), लाल और ग्रे सहित सामान्य आधिकारिक रंग, साथ ही आपको आवश्यक किसी भी RGB मान के लिए कस्टम कलर पिकर।' },
      { q: 'क्या मेरी फ़ोटो सर्वर पर अपलोड की जाती हैं?', a: 'नहीं। बैकग्राउंड प्रतिस्थापन स्थानीय छवि प्रसंस्करण का उपयोग करके पूरी तरह से आपके ब्राउज़र में चलता है। आपकी फ़ोटो कभी आपके डिवाइस से बाहर नहीं जाती।' },
      { q: 'कटआउट की गुणवत्ता कैसी है?', a: 'यह टूल बाल, कंधे और बारीक विवरण को संभालने के लिए एआई-आधारित एज-डिटेक्शन मॉडल का उपयोग करता है। अधिकांश आईडी फ़ोटो न्यूनतम मैन्युअल टच-अप के साथ साफ निकलती हैं।' },
      { q: 'किन छवि प्रारूपों का समर्थन किया जाता है?', a: 'आप JPG, PNG और WEBP छवियां अपलोड कर सकते हैं। तैयार फ़ोटो को आपके द्वारा चुने गए रिज़ॉल्यूशन पर JPG या PNG के रूप में निर्यात किया जा सकता है।' },
      { q: 'मैं परिणाम कैसे डाउनलोड करूं?', a: 'बैकग्राउंड बदलने के बाद, डाउनलोड बटन पर क्लिक करें और नई आईडी फ़ोटो आपके द्वारा चुने गए प्रारूप और आकार में आपके डिवाइस पर सहेजी जाएगी।' },
    ],
    ar: [
      { q: 'ما ألوان الخلفية المدعومة؟', a: 'الألوان الرسمية الشائعة بما فيها الأبيض والأزرق (درجات متعددة) والأحمر والرمادي، بالإضافة إلى منتقي ألوان مخصص لأي قيمة RGB تحتاجها.' },
      { q: 'هل يتم تحميل صوري إلى الخادم؟', a: 'لا. يتم تشغيل استبدال الخلفية بالكامل في متصفحك باستخدام معالجة الصور المحلية. صورك لا تغادر جهازك أبدًا.' },
      { q: 'ما جودة القص؟', a: 'تستخدم الأداة نموذجًا للكشف عن الحواف قائمًا على الذكاء الاصطناعي للتعامل مع الشعر والأكتاف والتفاصيل الدقيقة. معظم صور الهوية تخرج نظيفة بأقل تعديل يدوي.' },
      { q: 'ما تنسيقات الصور المدعومة؟', a: 'يمكنك رفع صور JPG وPNG وWEBP. يمكن تصدير الصورة النهائية كـ JPG أو PNG بدقة تختارها.' },
      { q: 'كيف أقوم بتنزيل النتيجة؟', a: 'بعد استبدال الخلفية، انقر على زر التنزيل وسيتم حفظ صورة الهوية الجديدة على جهازك بالتنسيق والحجم الذي اخترته.' },
    ],
  },
  'game-sensitivity-converter': {
    en: [
      { q: 'Which games are supported?', a: 'Popular titles including CS2, Valorant, Apex Legends, Overwatch 2, Fortnite, Call of Duty, Rainbow Six Siege, PUBG and more — with new games added regularly.' },
      { q: 'Is the sensitivity conversion accurate?', a: 'Yes, conversions are based on each game\'s official sensitivity formula and FOV, so the feel of your aim transfers consistently across titles.' },
      { q: 'What is cm/360?', a: 'cm/360 is the centimeters of mouse travel needed to do a full 360° turn in-game. It is the most reliable way to compare aim across different games and DPI settings.' },
      { q: 'How do I choose a DPI?', a: 'Common values are 400, 800, 1600 and 3200. Most pros use 400 or 800 for precision. Pick the lowest DPI that still feels comfortable for desktop use and stick with it.' },
      { q: 'Is the converter free to use?', a: 'Yes, 100% free with no signup. Convert sensitivities for as many games as you like, anytime, right in your browser.' },
    ],
    zh: [
      { q: '支持哪些游戏？', a: '支持 CS2、Valorant、Apex英雄、守望先锋2、堡垒之夜、使命召唤、彩虹六号围攻、PUBG 等热门游戏，并定期添加新游戏。' },
      { q: '灵敏度转换是否准确？', a: '是的，转换基于每款游戏的官方灵敏度公式和 FOV，确保您的瞄准手感在不同游戏间保持一致。' },
      { q: '什么是 cm/360？', a: 'cm/360 指鼠标移动一整圈 360° 所需的厘米数。这是在不同游戏和 DPI 设置间比较瞄准手感最可靠的方式。' },
      { q: 'DPI 怎么选？', a: '常见值为 400、800、1600 和 3200。大多数职业选手使用 400 或 800 以确保精度。选择桌面操作仍舒适的最低 DPI 并固定使用。' },
      { q: '转换器是否免费？', a: '是的，完全免费，无需注册。可随时为任意多款游戏进行灵敏度转换，全部在浏览器中完成。' },
    ],
    es: [
      { q: '¿Qué juegos se admiten?', a: 'Títulos populares como CS2, Valorant, Apex Legends, Overwatch 2, Fortnite, Call of Duty, Rainbow Six Siege, PUBG y más, con juegos nuevos añadidos regularmente.' },
      { q: '¿La conversión de sensibilidad es precisa?', a: 'Sí, las conversiones se basan en la fórmula oficial de sensibilidad y FOV de cada juego, para que la sensación de tu puntería se transfiera de forma consistente entre títulos.' },
      { q: '¿Qué es cm/360?', a: 'cm/360 son los centímetros de movimiento del ratón necesarios para hacer un giro completo de 360° en el juego. Es la forma más fiable de comparar la puntería entre juegos y configuraciones de DPI.' },
      { q: '¿Cómo elijo un DPI?', a: 'Los valores comunes son 400, 800, 1600 y 3200. La mayoría de profesionales usan 400 u 800 por precisión. Elige el DPI más bajo que aún sea cómodo para el escritorio y mantente con él.' },
      { q: '¿El conversor es gratis?', a: 'Sí, 100% gratis y sin registro. Convierte sensibilidades para todos los juegos que quieras, cuando quieras, directamente en tu navegador.' },
    ],
    fr: [
      { q: 'Quels jeux sont pris en charge ?', a: 'Les titres populaires dont CS2, Valorant, Apex Legends, Overwatch 2, Fortnite, Call of Duty, Rainbow Six Siege, PUBG et plus, avec de nouveaux jeux ajoutés régulièrement.' },
      { q: 'La conversion de sensibilité est-elle précise ?', a: 'Oui, les conversions sont basées sur la formule de sensibilité officielle et le FOV de chaque jeu, pour que la sensation de votre visée se transfère de manière cohérente entre les titres.' },
      { q: 'Qu\'est-ce que cm/360 ?', a: 'cm/360 représente les centimètres de déplacement de la souris nécessaires pour faire un tour complet de 360° en jeu. C\'est le moyen le plus fiable de comparer la visée entre différents jeux et réglages DPI.' },
      { q: 'Comment choisir un DPI ?', a: 'Les valeurs courantes sont 400, 800, 1600 et 3200. La plupart des pros utilisent 400 ou 800 pour la précision. Choisissez le DPI le plus bas encore confortable pour le bureau et conservez-le.' },
      { q: 'Le convertisseur est-il gratuit ?', a: 'Oui, 100 % gratuit et sans inscription. Convertissez les sensibilités pour autant de jeux que vous le souhaitez, à tout moment, directement dans votre navigateur.' },
    ],
    hi: [
      { q: 'किन गेम्स का समर्थन किया जाता है?', a: 'CS2, Valorant, Apex Legends, Overwatch 2, Fortnite, Call of Duty, Rainbow Six Siege, PUBG और अन्य लोकप्रिय शीर्षक, नियमित रूप से नए गेम्स जोड़े जाते हैं।' },
      { q: 'क्या संवेदनशीलता रूपांतरण सटीक है?', a: 'हाँ, रूपांतरण प्रत्येक गेम के आधिकारिक संवेदनशीलता सूत्र और FOV पर आधारित हैं, ताकि आपके निशाने का अहसास शीर्षकों के बीच लगातार स्थानांतरित हो।' },
      { q: 'cm/360 क्या है?', a: 'cm/360 गेम में पूर्ण 360° घूमने के लिए आवश्यक माउस की यात्रा के सेंटीमीटर है। यह विभिन्न गेम्स और DPI सेटिंग्स के बीच निशाना तुलना करने का सबसे विश्वसनीय तरीका है।' },
      { q: 'मैं DPI कैसे चुनूं?', a: 'सामान्य मान 400, 800, 1600 और 3200 हैं। अधिकांश पेशेवर सटीकता के लिए 400 या 800 का उपयोग करते हैं। सबसे कम DPI चुनें जो डेस्कटॉप उपयोग के लिए भी आरामदायक हो और उसी पर टिके रहें।' },
      { q: 'क्या कनवर्टर मुफ़्त है?', a: 'हाँ, 100% मुफ़्त, बिना साइन अप। जितने चाहें गेम्स के लिए संवेदनशीलता कन्वर्ट करें, कभी भी, सीधे आपके ब्राउज़र में।' },
    ],
    ar: [
      { q: 'ما الألعاب المدعومة؟', a: 'الألقاب الشائعة مثل CS2 وValorant وApex Legends وOverwatch 2 وFortnite وCall of Duty وRainbow Six Siege وPUBG والمزيد، مع إضافة ألعاب جديدة بانتظام.' },
      { q: 'هل تحويل الحساسية دقيق؟', a: 'نعم، التحويلات مبنية على صيغة الحساسية الرسمية وFOV لكل لعبة، لتنتقل إحساس التصويب بشكل متسق بين الألقاب.' },
      { q: 'ما هو cm/360؟', a: 'cm/360 هو سنتيمترات حركة الماوس اللازمة لإجراء دورة كاملة 360° في اللعبة. وهو أكثر طريقة موثوقة لمقارنة التصويب بين الألعاب وإعدادات DPI المختلفة.' },
      { q: 'كيف أختار DPI؟', a: 'القيم الشائعة هي 400 و800 و1600 و3200. يستخدم معظم المحترفين 400 أو 800 للدقة. اختر أدنى DPI لا يزال مريحًا للاستخدام المكتبي والتزم به.' },
      { q: 'هل المحول مجاني؟', a: 'نعم، مجاني 100% بدون تسجيل. حوّل الحساسية لأي عدد من الألعاب تريده، في أي وقت، مباشرة في متصفحك.' },
    ],
  },
  'ai-name-generator': {
    en: [
      { q: 'What can I use the AI name generator for?', a: 'It generates meaningful names for babies, pets, pen names, gaming tags and online usernames — just enter the surname, gender and preferred style.' },
      { q: 'What naming styles does it support?', a: 'You can pick from styles like classical Chinese, modern, literary/poetic, western-inspired and cute. The AI adapts tone and references to match your choice.' },
      { q: 'Do the generated names have real meanings?', a: 'Yes. Each name comes with its meaning and origin explained, so it\'s not random — the AI picks characters with auspicious and pleasant connotations.' },
      { q: 'Can I specify the surname and gender?', a: 'Yes. Enter your surname and select a gender, and the generator builds names that flow naturally with that surname and fit the chosen gender.' },
      { q: 'Is it free and do I need to sign up?', a: 'It\'s 100% free with no signup. Everything runs in your browser, and your inputs are never stored on a server.' },
    ],
    zh: [
      { q: 'AI取名器可以为哪些场景取名？', a: '可以为宝宝、宠物、笔名、游戏ID、网名等场景取名，只需输入姓氏、性别和喜欢的风格即可生成。' },
      { q: '支持哪些取名风格？', a: '支持古风、现代、文艺诗意、西式、可爱等多种风格，AI 会根据所选风格调整用字和意境。' },
      { q: '生成的名字有寓意吗？', a: '有的。每个名字都会附带寓意和出处说明，并非随机拼凑，AI 会优先选用寓意美好、读音悦耳的字。' },
      { q: '可以指定姓氏和性别吗？', a: '可以。输入姓氏并选择性别后，生成器会生成与该姓氏搭配自然、符合性别气质的名字。' },
      { q: '免费使用吗，需要注册吗？', a: '完全免费，无需注册。所有计算在浏览器本地完成，输入内容不会上传服务器。' },
    ],
    es: [
      { q: '¿Para qué puedo usar el generador de nombres con IA?', a: 'Genera nombres con significado para bebés, mascotas, seudónimos, etiquetas de juegos y nombres de usuario en línea. Solo ingresa apellido, género y estilo.' },
      { q: '¿Qué estilos de nombres admite?', a: 'Puedes elegir entre estilos como chino clásico, moderno, literario/poético, de inspiración occidental y tierno. La IA adapta el tono y las referencias a tu elección.' },
      { q: '¿Los nombres generados tienen significado real?', a: 'Sí. Cada nombre incluye su significado y origen explicados. No es aleatorio: la IA elige caracteres con connotaciones auspiciosas y agradables.' },
      { q: '¿Puedo especificar el apellido y el género?', a: 'Sí. Ingresa el apellido y selecciona el género, y el generador crea nombres que combinan de forma natural con ese apellido y se ajustan al género elegido.' },
      { q: '¿Es gratis y necesito registrarme?', a: 'Es 100% gratis y sin registro. Todo funciona en tu navegador y tus datos nunca se almacenan en un servidor.' },
    ],
    fr: [
      { q: 'À quoi peut servir le générateur de noms IA ?', a: 'Il génère des noms à sens pour les bébés, animaux de compagnie, pseudonymes, pseudos de jeu et noms d\'utilisateur en ligne. Indiquez simplement le nom de famille, le genre et le style.' },
      { q: 'Quels styles de noms sont pris en charge ?', a: 'Vous pouvez choisir parmi des styles comme chinois classique, moderne, littéraire/poétique, d\'inspiration occidentale et mignon. L\'IA adapte le ton et les références à votre choix.' },
      { q: 'Les noms générés ont-ils une vraie signification ?', a: 'Oui. Chaque nom est accompagné de sa signification et de son origine. Ce n\'est pas aléatoire : l\'IA choisit des caractères aux connotations auspicielles et agréables.' },
      { q: 'Puis-je spécifier le nom de famille et le genre ?', a: 'Oui. Saisissez le nom de famille et sélectionnez le genre, et le générateur crée des noms qui s\'accordent naturellement avec ce nom de famille et correspondent au genre choisi.' },
      { q: 'Est-ce gratuit et dois-je m\'inscrire ?', a: 'C\'est 100 % gratuit sans inscription. Tout fonctionne dans votre navigateur et vos entrées ne sont jamais stockées sur un serveur.' },
    ],
    hi: [
      { q: 'AI नाम जनरेटर का उपयोग किसके लिए कर सकता हूँ?', a: 'यह शिशुओं, पालतू जानवरों, उपनामों, गेमिंग टैग और ऑनलाइन यूज़रनेम के लिए सार्थक नाम बनाता है — बस उपनाम, लिंग और पसंदीदा शैली दर्ज करें।' },
      { q: 'यह कौन सी नामकरण शैलियों का समर्थन करता है?', a: 'आप शास्त्रीय चीनी, आधुनिक, साहित्यिक/काव्यात्मक, पश्चिमी-प्रेरित और प्यारी जैसी शैलियों में से चुन सकते हैं। AI आपकी पसंद के अनुसार लहज़ा और संदर्भ बदलता है।' },
      { q: 'क्या जनरेट किए गए नामों का वास्तविक अर्थ होता है?', a: 'हाँ। प्रत्येक नाम के साथ इसका अर्थ और मूल समझाया गया है। यह यादृच्छिक नहीं है — AI शुभ और मनोहर अर्थ वाले अक्षरों को चुनता है।' },
      { q: 'क्या मैं उपनाम और लिंग निर्दिष्ट कर सकता हूँ?', a: 'हाँ। उपनाम दर्ज करें और लिंग चुनें, और जनरेटर उस उपनाम के साथ स्वाभाविक रूप से जुड़ने वाले और चुने गए लिंग के अनुरूप नाम बनाता है।' },
      { q: 'क्या यह मुफ़्त है और क्या मुझे साइन अप करना होगा?', a: 'यह 100% मुफ़्त है, साइन अप नहीं। सब कुछ आपके ब्राउज़र में चलता है और आपके इनपुट कभी सर्वर पर संग्रहीत नहीं होते।' },
    ],
    ar: [
      { q: 'لماذا يمكنني استخدام مولد الأسماء بالذكاء الاصطناعي؟', a: 'يولّد أسماء ذات معنى للأطفال والحيوانات الأليفة والأسماء المستعارة وعلامات الألعاب وأسماء المستخدمين عبر الإنترنت — ما عليك سوى إدخال اسم العائلة والجنس والأسلوب المفضل.' },
      { q: 'ما أساليب التسمية المدعومة؟', a: 'يمكنك الاختيار بين أساليب مثل الصينية الكلاسيكية والحديثة والأدبية/الشعرية والمستوحاة من الغرب واللطيفة. يكيّف الذكاء الاصطناعي النبرة والمراجع حسب اختيارك.' },
      { q: 'هل للأسماء المولّدة معاني حقيقية؟', a: 'نعم. يأتي كل اسم مع شرح معناه وأصله. الأمر ليس عشوائياً — يختار الذكاء الاصطناعي أحرفاً ذات دلالات ميمونة ومبهجة.' },
      { q: 'هل يمكنني تحديد اسم العائلة والجنس؟', a: 'نعم. أدخل اسم العائلة واختر الجنس، ويقوم المولّد بإنشاء أسماء تتوافق بشكل طبيعي مع اسم العائلة وتناسب الجنس المختار.' },
      { q: 'هل هو مجاني وهل أحتاج إلى التسجيل؟', a: 'مجاني 100% دون تسجيل. كل شيء يعمل في متصفحك ولا تُخزَّن مدخلاتك أبداً على خادم.' },
    ],
  },
  'ai-greeting-generator': {
    en: [
      { q: 'What occasions does the AI greeting generator support?', a: 'It covers birthdays, weddings, New Year, anniversaries, graduations, holidays and get-well messages — each with occasion-appropriate wording.' },
      { q: 'Can I customize the tone of the greeting?', a: 'Yes. Choose from tones like warm, formal, humorous, poetic or heartfelt, and the AI rewrites the message to match.' },
      { q: 'Can I include the recipient\'s name and relationship?', a: 'Yes. Enter the recipient\'s name and your relationship (friend, parent, colleague, partner) so the greeting feels personal rather than generic.' },
      { q: 'How long are the generated greetings?', a: 'Most greetings are 2–4 sentences — long enough to feel sincere but short enough to fit a card or message. You can regenerate for a longer or shorter version.' },
      { q: 'Is it free and does it work without signup?', a: 'It\'s 100% free with no signup required, and runs entirely in your browser.' },
    ],
    zh: [
      { q: 'AI祝福语生成器支持哪些场合？', a: '涵盖生日、婚礼、新年、纪念日、毕业、节日、探病等场合，每个场合都会使用贴合的措辞。' },
      { q: '可以调整祝福语的语气吗？', a: '可以。支持温馨、正式、幽默、文艺、深情等多种语气，AI 会根据所选语气重新组织语言。' },
      { q: '可以加入收件人名字和关系吗？', a: '可以。输入收件人名字和与你的关系（朋友、父母、同事、伴侣），让祝福语更贴心而不空泛。' },
      { q: '生成的祝福语大概多长？', a: '多数为 2-4 句，既能体现真诚又适合写在贺卡或发消息。可以重新生成更长或更短的版本。' },
      { q: '免费吗，需要注册吗？', a: '完全免费，无需注册，全部在浏览器中运行。' },
    ],
    es: [
      { q: '¿Qué ocasiones admite el generador de felicitaciones con IA?', a: 'Cubre cumpleaños, bodas, Año Nuevo, aniversarios, graduaciones, fiestas y mensajes de mejoría, cada uno con palabras adecuadas a la ocasión.' },
      { q: '¿Puedo personalizar el tono de la felicitación?', a: 'Sí. Elige entre tonos como cálido, formal, humorístico, poético o sincero, y la IA reescribe el mensaje para coincidir.' },
      { q: '¿Puedo incluir el nombre y la relación del destinatario?', a: 'Sí. Ingresa el nombre y la relación (amigo, padre, colega, pareja) para que la felicitación se sienta personal y no genérica.' },
      { q: '¿Qué longitud tienen las felicitaciones generadas?', a: 'La mayoría tienen de 2 a 4 oraciones, suficientes para sentirse sinceras pero aptas para una tarjeta o mensaje. Puedes regenerar una versión más larga o corta.' },
      { q: '¿Es gratis y funciona sin registro?', a: 'Es 100% gratis, sin registro, y funciona totalmente en tu navegador.' },
    ],
    fr: [
      { q: 'Quelles occasions le générateur de vœux IA prend-il en charge ?', a: 'Il couvre les anniversaires, mariages, Nouvel An, anniversaires de mariage, remises de diplômes, fêtes et messages de rétablissement, chacun avec des formulations adaptées.' },
      { q: 'Puis-je personnaliser le ton du message ?', a: 'Oui. Choisissez parmi des tons comme chaleureux, formel, humoristique, poétique ou sincère, et l\'IA réécrit le message en conséquence.' },
      { q: 'Puis-je inclure le nom et la relation du destinataire ?', a: 'Oui. Saisissez le nom et la relation (ami, parent, collègue, partenaire) pour que le message soit personnel plutôt que générique.' },
      { q: 'Quelle est la longueur des vœux générés ?', a: 'La plupart font 2 à 4 phrases, assez pour être sincères mais adaptées à une carte ou un message. Vous pouvez régénérer une version plus longue ou plus courte.' },
      { q: 'Est-ce gratuit et sans inscription ?', a: 'C\'est 100 % gratuit, sans inscription, et fonctionne entièrement dans votre navigateur.' },
    ],
    hi: [
      { q: 'AI शुभकामना जनरेटर कौन से अवसरों का समर्थन करता है?', a: 'यह जन्मदिन, शादियाँ, नया साल, वर्षगाँठ, स्नातक समारोह, त्योहार और शुभकामना संदेशों को कवर करता है — प्रत्येक अवसर के अनुरूप शब्दों के साथ।' },
      { q: 'क्या मैं शुभकामना के लहज़े को अनुकूलित कर सकता हूँ?', a: 'हाँ। गर्मजोशी भरा, औपचारिक, हास्यप्रद, काव्यात्मक या हृदयस्पर्शी जैसे लहज़ों में से चुनें, और AI संदेश को उसके अनुसार फिर से लिखता है।' },
      { q: 'क्या मैं प्राप्तकर्ता का नाम और रिश्ता शामिल कर सकता हूँ?', a: 'हाँ। प्राप्तकर्ता का नाम और रिश्ता (मित्र, अभिभावक, सहकर्मी, साथी) दर्ज करें ताकि शुभकामना व्यक्तिगत महसूस हो।' },
      { q: 'जनरेट की गई शुभकामनाएँ कितनी लंबी होती हैं?', a: 'अधिकांश 2-4 वाक्य होती हैं — ईमानदार लगने के लिए पर्याप्त लंबी और कार्ड या संदेश में फिट होने के लिए पर्याप्त छोटी। आप लंबी या छोटी संस्करण के लिए पुनः जनरेट कर सकते हैं।' },
      { q: 'क्या यह मुफ़्त है और बिना साइन अप के चलता है?', a: 'यह 100% मुफ़्त है, साइन अप की आवश्यकता नहीं, और पूरी तरह आपके ब्राउज़र में चलता है।' },
    ],
    ar: [
      { q: 'ما المناسبات التي يدعمها مولد التهاني بالذكاء الاصطناعي؟', a: 'يغطي أعياد الميلاد والزواج ورأس السنة والذكرى السنوية والتخرج والأعياد ورسائل الشفاء — لكل منها صياغة مناسبة للمناسبة.' },
      { q: 'هل يمكنني تخصيص نبرة التهنئة؟', a: 'نعم. اختر من نبرات مثل دافئة ورسمية وفكاهية وشاعرية وصادقة، ويعيد الذكاء الاصطناعي صياغة الرسالة لتتطابق.' },
      { q: 'هل يمكنني إدراج اسم المستلم وعلاقته؟', a: 'نعم. أدخل اسم المستلم وعلاقتك (صديق، والدين، زميل، شريك) لتكون التهنئة شخصية بدلاً من عامة.' },
      { q: 'ما طول التهاني المولّدة؟', a: 'معظمها من جملتين إلى أربع — طويلة بما يكفي لتكون صادقة وقصيرة بما يكفي لبطاقة أو رسالة. يمكنك إعادة التوليد للحصول على نسخة أطول أو أقصر.' },
      { q: 'هل هو مجاني ويعمل دون تسجيل؟', a: 'مجاني 100% دون تسجيل، ويعمل بالكامل في متصفحك.' },
    ],
  },
  'ai-weekly-report': {
    en: [
      { q: 'What structure does the generated weekly report follow?', a: 'It produces a structured report with four sections: weekly summary, key achievements, problems/blockers, and next-week plan — ready to paste into an email or doc.' },
      { q: 'What should I enter as input?', a: 'Just list your work bullets for the week in any order — tasks done, results, numbers, and any issues. The AI organizes them into the right sections.' },
      { q: 'Can I edit the report after it\'s generated?', a: 'Yes. The output is plain text you can copy and edit anywhere. Tweak wording or add details before sending it to your team or manager.' },
      { q: 'Can it handle multiple projects in one report?', a: 'Yes. List bullets across projects and the AI groups them by theme or project so the report stays clear instead of a flat list.' },
      { q: 'Is it free and is my data private?', a: 'It\'s free with no signup, and runs in your browser. Your work content is not stored on any server.' },
    ],
    zh: [
      { q: '生成的周报是什么结构？', a: '生成包含四部分的结构化周报：本周总结、主要成果、问题/阻塞、下周计划，可直接粘贴到邮件或文档中。' },
      { q: '我该输入什么内容？', a: '只需把本周工作要点按任意顺序列出——完成的任务、结果、数据和遇到的问题即可，AI 会自动归类到对应章节。' },
      { q: '生成后可以编辑吗？', a: '可以。输出是纯文本，可复制到任意地方编辑，发送前可调整措辞或补充细节。' },
      { q: '一个周报能包含多个项目吗？', a: '可以。把多个项目的工作要点列出，AI 会按主题或项目分组，让周报清晰而非平铺罗列。' },
      { q: '免费吗，数据安全吗？', a: '免费无需注册，在浏览器中运行，工作内容不会上传到任何服务器。' },
    ],
    es: [
      { q: '¿Qué estructura sigue el informe semanal generado?', a: 'Produce un informe estructurado con cuatro secciones: resumen semanal, logros clave, problemas/bloqueos y plan de la próxima semana, listo para pegar en un correo o documento.' },
      { q: '¿Qué debo ingresar?', a: 'Solo lista tus tareas de la semana en cualquier orden — tareas hechas, resultados, números y problemas. La IA las organiza en las secciones correctas.' },
      { q: '¿Puedo editar el informe después de generarlo?', a: 'Sí. La salida es texto plano que puedes copiar y editar donde quieras. Ajusta la redacción o agrega detalles antes de enviarlo.' },
      { q: '¿Puede manejar varios proyectos en un informe?', a: 'Sí. Lista las tareas de varios proyectos y la IA las agrupa por tema o proyecto para que el informe sea claro.' },
      { q: '¿Es gratis y son privados mis datos?', a: 'Es gratis, sin registro, y funciona en tu navegador. Tu contenido de trabajo no se almacena en ningún servidor.' },
    ],
    fr: [
      { q: 'Quelle structure suit le rapport hebdomadaire généré ?', a: 'Il produit un rapport structuré en quatre parties : résumé de la semaine, réalisations clés, problèmes/blocages et plan de la semaine suivante, prêt à coller dans un e-mail ou un document.' },
      { q: 'Que dois-je saisir ?', a: 'Listez simplement vos tâches de la semaine dans n\'importe quel ordre — tâches effectuées, résultats, chiffres et problèmes. L\'IA les organise dans les bonnes sections.' },
      { q: 'Puis-je modifier le rapport après sa génération ?', a: 'Oui. Le résultat est du texte brut que vous pouvez copier et modifier partout. Ajustez la formulation ou ajoutez des détails avant de l\'envoyer.' },
      { q: 'Peut-il gérer plusieurs projets dans un rapport ?', a: 'Oui. Listez les tâches de plusieurs projets et l\'IA les regroupe par thème ou projet pour que le rapport reste clair.' },
      { q: 'Est-ce gratuit et mes données sont-elles privées ?', a: 'C\'est gratuit, sans inscription, et fonctionne dans votre navigateur. Votre contenu de travail n\'est stocké sur aucun serveur.' },
    ],
    hi: [
      { q: 'जनरेट की गई साप्ताहिक रिपोर्ट की संरचना क्या है?', a: 'यह चार खंडों के साथ एक संरचित रिपोर्ट बनाता है: साप्ताहिक सारांश, प्रमुख उपलब्धियाँ, समस्याएँ/बाधाएँ और अगले सप्ताह की योजना — ईमेल या दस्तावेज़ में पेस्ट करने के लिए तैयार।' },
      { q: 'मुझे इनपुट के रूप में क्या दर्ज करना चाहिए?', a: 'बस अपने सप्ताह के कार्य बिंदु किसी भी क्रम में सूचीबद्ध करें — किए गए कार्य, परिणाम, संख्याएँ और कोई समस्याएँ। AI उन्हें सही खंडों में व्यवस्थित करता है।' },
      { q: 'क्या मैं जनरेट होने के बाद रिपोर्ट संपादित कर सकता हूँ?', a: 'हाँ। आउटपुट सादा पाठ है जिसे आप कहीं भी कॉपी और संपादित कर सकते हैं। भेजने से पहले शब्दों को समायोजित करें या विवरण जोड़ें।' },
      { q: 'क्या यह एक रिपोर्ट में कई प्रोजेक्ट संभाल सकता है?', a: 'हाँ। कई प्रोजेक्ट में बिंदु सूचीबद्ध करें और AI उन्हें विषय या प्रोजेक्ट के अनुसार समूहित करता है ताकि रिपोर्ट स्पष्ट रहे।' },
      { q: 'क्या यह मुफ़्त है और मेरा डेटा निजी है?', a: 'यह मुफ़्त है, साइन अप नहीं, और आपके ब्राउज़र में चलता है। आपकी कार्य सामग्री किसी सर्वर पर संग्रहीत नहीं होती।' },
    ],
    ar: [
      { q: 'ما هيكل التقرير الأسبوعي المولّد؟', a: 'ينتج تقريراً مهيكلاً بأربعة أقسام: ملخص الأسبوع، والإنجازات الرئيسية، والمشكلات/العوائق، وخطة الأسبوع التالي — جاهز للصقه في بريد إلكتروني أو مستند.' },
      { q: 'ما الذي يجب أن أدخله؟', a: 'ما عليك سوى سرد مهام الأسبوع بأي ترتيب — المهام المنجزة والنتائج والأرقام وأي مشكلات. ينظّمها الذكاء الاصطناعي في الأقسام الصحيحة.' },
      { q: 'هل يمكنني تعديل التقرير بعد توليده؟', a: 'نعم. المخرجات نص عادي يمكنك نسخه وتحريره في أي مكان. عدّل الصياغة أو أضف تفاصيل قبل إرساله.' },
      { q: 'هل يمكنه التعامل مع مشاريع متعددة في تقرير واحد؟', a: 'نعم. سرد المهام عبر المشاريع ويقوم الذكاء الاصطناعي بتجميعها حسب الموضوع أو المشروع ليبقى التقرير واضحاً.' },
      { q: 'هل هو مجاني وهل بياناتي خاصة؟', a: 'مجاني دون تسجيل، ويعمل في متصفحك. لا تُخزَّن محتويات عملك على أي خادم.' },
    ],
  },
  'ai-recipe-generator': {
    en: [
      { q: 'Can I generate recipes based on ingredients I already have?', a: 'Yes. List the ingredients in your fridge or pantry and the AI suggests recipes that use them, so you can cook without an extra trip to the store.' },
      { q: 'Does it support dietary restrictions?', a: 'Yes. You can specify vegetarian, vegan, low-carb, gluten-free, halal or allergy exclusions, and the recipes adapt accordingly.' },
      { q: 'Does the recipe include nutrition information?', a: 'Yes. Each recipe comes with approximate calories, protein, carbs and fat per serving, plus a clear ingredient list and step-by-step instructions.' },
      { q: 'Are the steps beginner-friendly?', a: 'Yes. Instructions are written in plain language with common techniques explained, and cooking times and temperatures are clearly stated.' },
      { q: 'Is it free and do I need an account?', a: 'It\'s 100% free with no account required, and everything runs in your browser.' },
    ],
    zh: [
      { q: '可以根据现有食材生成菜谱吗？', a: '可以。列出冰箱或橱柜里的食材，AI 会推荐使用这些食材的菜谱，无需额外跑去采购。' },
      { q: '支持饮食限制吗？', a: '支持。可指定素食、纯素、低碳水、无麸质、清真或排除过敏原，菜谱会相应调整。' },
      { q: '菜谱包含营养信息吗？', a: '包含。每份菜谱都附有每份的大致热量、蛋白质、碳水、脂肪，以及清晰的配料表和分步做法。' },
      { q: '步骤适合新手吗？', a: '适合。步骤用通俗语言书写，常见烹饪技巧会解释，烹饪时间和温度标注清晰。' },
      { q: '免费吗，需要账号吗？', a: '完全免费，无需账号，全部在浏览器中运行。' },
    ],
    es: [
      { q: '¿Puedo generar recetas según los ingredientes que ya tengo?', a: 'Sí. Lista los ingredientes de tu nevera o despensa y la IA sugiere recetas que los usan, para cocinar sin ir a comprar.' },
      { q: '¿Admite restricciones dietéticas?', a: 'Sí. Puedes especificar vegetariano, vegano, bajo en carbohidratos, sin gluten, halal o exclusiones de alergias, y las recetas se adaptan.' },
      { q: '¿La receta incluye información nutricional?', a: 'Sí. Cada receta trae calorías aproximadas, proteínas, carbohidratos y grasas por porción, además de lista de ingredientes y pasos.' },
      { q: '¿Los pasos son aptos para principiantes?', a: 'Sí. Las instrucciones usan lenguaje claro con técnicas comunes explicadas, y tiempos y temperaturas se indican claramente.' },
      { q: '¿Es gratis y necesito una cuenta?', a: 'Es 100% gratis, sin cuenta, y todo funciona en tu navegador.' },
    ],
    fr: [
      { q: 'Puis-je générer des recettes à partir des ingrédients que j\'ai déjà ?', a: 'Oui. Listez les ingrédients de votre frigo ou placard et l\'IA suggère des recettes qui les utilisent, pour cuisiner sans courses supplémentaires.' },
      { q: 'Cela prend-il en charge les régimes alimentaires ?', a: 'Oui. Vous pouvez spécifier végétarien, végétalien, faible en glucides, sans gluten, halal ou exclure des allergènes, et les recettes s\'adaptent.' },
      { q: 'La recette inclut-elle des informations nutritionnelles ?', a: 'Oui. Chaque recette indique les calories, protéines, glucides et lipides approximatifs par portion, ainsi qu\'une liste d\'ingrédients et des étapes.' },
      { q: 'Les étapes sont-elles adaptées aux débutants ?', a: 'Oui. Les instructions sont rédigées en langage clair avec les techniques courantes expliquées, et les temps et températures sont précisés.' },
      { q: 'Est-ce gratuit et ai-je besoin d\'un compte ?', a: 'C\'est 100 % gratuit, sans compte, et tout fonctionne dans votre navigateur.' },
    ],
    hi: [
      { q: 'क्या मैं अपने पास मौजूद सामग्री के आधार पर रेसिपी जनरेट कर सकता हूँ?', a: 'हाँ। अपने फ्रिज या पेंट्री में मौजूद सामग्री सूचीबद्ध करें और AI उनका उपयोग करने वाली रेसिपी सुझाता है, ताकि आप बिना खरीदारी के पका सकें।' },
      { q: 'क्या यह आहार सीमाओं का समर्थन करता है?', a: 'हाँ। आप शाकाहारी, वीगन, लो-कार्ब, ग्लूटन-फ्री, हलाल या एलर्जी बहिष्कार निर्दिष्ट कर सकते हैं, और रेसिपी उसी के अनुसार बदलती हैं।' },
      { q: 'क्या रेसिपी में पोषण जानकारी शामिल है?', a: 'हाँ। प्रत्येक रेसिपी में प्रति सर्विंग अनुमानित कैलोरी, प्रोटीन, कार्ब्स और वसा, साथ ही सामग्री सूची और चरण-दर-चरण निर्देश होते हैं।' },
      { q: 'क्या चरण शुरुआती लोगों के लिए अनुकूल हैं?', a: 'हाँ। निर्देश सादी भाषा में लिखे गए हैं, सामान्य तकनीकों को समझाया गया है, और पकाने का समय व तापमान स्पष्ट रूप से दिए गए हैं।' },
      { q: 'क्या यह मुफ़्त है और क्या मुझे खाता चाहिए?', a: 'यह 100% मुफ़्त है, खाते की आवश्यकता नहीं, और सब कुछ आपके ब्राउज़र में चलता है।' },
    ],
    ar: [
      { q: 'هل يمكنني توليد وصفات بناءً على المكونات المتوفرة لدي؟', a: 'نعم. اذكر المكونات في ثلاجتك أو خزانتك ويقترح الذكاء الاصطناعي وصفات تستخدمها، لتطبخ دون رحلة تسوق إضافية.' },
      { q: 'هل يدعم القيود الغذائية؟', a: 'نعم. يمكنك تحديد نباتي أو نباتي صرف أو منخفض الكربوهيدرات أو خالٍ من الغلوتين أو حلال أو استبعاد مسببات الحساسية، وتتكيّف الوصفات.' },
      { q: 'هل تتضمن الوصفة معلومات غذائية؟', a: 'نعم. تأتي كل وصفة مع سعرات حرارية وبروتين وكربوهيدرات ودهون تقريبية لكل حصة، بالإضافة إلى قائمة مكونات وخطوات.' },
      { q: 'هل الخطوات مناسبة للمبتدئين؟', a: 'نعم. التعليمات مكتوبة بلغة بسيطة مع شرح التقنيات الشائعة، وأوقات ودرجات الحرارة موضحة بوضوح.' },
      { q: 'هل هو مجاني وهل أحتاج إلى حساب؟', a: 'مجاني 100% دون حساب، وكل شيء يعمل في متصفحك.' },
    ],
  },
  'ai-regex-generator': {
    en: [
      { q: 'Do I need to know regex to use this tool?', a: 'No. Just describe what you want to match in plain English (e.g. "match all email addresses") and the AI builds the regex for you.' },
      { q: 'Does it explain the generated regex?', a: 'Yes. Each part of the pattern is broken down so you can understand what it does, which also helps you learn regex over time.' },
      { q: 'Can I test the regex against sample text?', a: 'Yes. Paste your test text and the tool highlights all matches, so you can verify the pattern works before using it in code.' },
      { q: 'Which regex flavors does it support?', a: 'It generates patterns compatible with JavaScript, Python, Java and PCRE by default, and you can note your target language for flavor-specific syntax.' },
      { q: 'Is it free and does it run in the browser?', a: 'It\'s 100% free, no signup, and runs entirely in your browser.' },
    ],
    zh: [
      { q: '需要懂正则才能用这个工具吗？', a: '不需要。用大白话描述你想匹配的内容（比如“匹配所有邮箱地址”），AI 会帮你生成正则。' },
      { q: '会解释生成的正则吗？', a: '会。每一段模式都会拆解说明，帮你理解作用，长期使用还能顺便学会正则。' },
      { q: '可以用示例文本测试正则吗？', a: '可以。粘贴测试文本后，工具会高亮所有匹配项，方便你在写进代码前验证模式是否正确。' },
      { q: '支持哪种正则语法？', a: '默认生成兼容 JavaScript、Python、Java 和 PCRE 的正则，也可以注明目标语言以生成特定语法的正则。' },
      { q: '免费吗，在浏览器中运行吗？', a: '完全免费，无需注册，全部在浏览器中运行。' },
    ],
    es: [
      { q: '¿Necesito saber regex para usar esta herramienta?', a: 'No. Solo describe lo que quieres coincidir en lenguaje sencillo (p. ej. "coincidir todos los correos") y la IA crea la regex.' },
      { q: '¿Explica la regex generada?', a: 'Sí. Cada parte del patrón se desglosa para que entiendas su función, lo que también te ayuda a aprender regex con el tiempo.' },
      { q: '¿Puedo probar la regex con texto de ejemplo?', a: 'Sí. Pega tu texto y la herramienta resalta todas las coincidencias, para verificar el patrón antes de usarlo en código.' },
      { q: '¿Qué variantes de regex admite?', a: 'Genera patrones compatibles con JavaScript, Python, Java y PCRE por defecto, y puedes indicar tu lenguaje para sintaxis específica.' },
      { q: '¿Es gratis y funciona en el navegador?', a: 'Es 100% gratis, sin registro, y funciona totalmente en tu navegador.' },
    ],
    fr: [
      { q: 'Dois-je connaître les regex pour utiliser cet outil ?', a: 'Non. Décrivez simplement ce que vous voulez faire correspondre en langage clair (par ex. « correspondre à toutes les adresses e-mail ») et l\'IA construit la regex.' },
      { q: 'Explique-t-il la regex générée ?', a: 'Oui. Chaque partie du motif est détaillée pour que vous compreniez son rôle, ce qui vous aide aussi à apprendre les regex.' },
      { q: 'Puis-je tester la regex sur un texte d\'exemple ?', a: 'Oui. Collez votre texte et l\'outil surligne toutes les correspondances, pour vérifier le motif avant de l\'utiliser dans le code.' },
      { q: 'Quelles variantes de regex sont prises en charge ?', a: 'Il génère des motifs compatibles avec JavaScript, Python, Java et PCRE par défaut, et vous pouvez indiquer votre langage pour une syntaxe spécifique.' },
      { q: 'Est-ce gratuit et cela fonctionne-t-il dans le navigateur ?', a: 'C\'est 100 % gratuit, sans inscription, et fonctionne entièrement dans votre navigateur.' },
    ],
    hi: [
      { q: 'क्या इस टूल का उपयोग करने के लिए मुझे रेगेक्स जानना चाहिए?', a: 'नहीं। बस सादे शब्दों में बताएँ कि आप क्या मैच करना चाहते हैं (जैसे "सभी ईमेल पते मैच करें") और AI आपके लिए रेगेक्स बनाता है।' },
      { q: 'क्या यह जनरेट की गई रेगेक्स समझाता है?', a: 'हाँ। पैटर्न के प्रत्येक भाग को तोड़कर समझाया जाता है ताकि आप समझ सकें कि यह क्या करता है, जो समय के साथ रेगेक्स सीखने में भी मदद करता है।' },
      { q: 'क्या मैं नमूना पाठ के साथ रेगेक्स का परीक्षण कर सकता हूँ?', a: 'हाँ। अपना परीक्षण पाठ पेस्ट करें और टूल सभी मैच हाईलाइट करता है, ताकि आप कोड में उपयोग करने से पहले पैटर्न सत्यापित कर सकें।' },
      { q: 'यह कौन से रेगेक्स स्वाद का समर्थन करता है?', a: 'यह डिफ़ॉल्ट रूप से JavaScript, Python, Java और PCRE संगत पैटर्न बनाता है, और आप स्वाद-विशिष्ट सिंटैक्स के लिए अपनी लक्षित भाषा नोट कर सकते हैं।' },
      { q: 'क्या यह मुफ़्त है और ब्राउज़र में चलता है?', a: 'यह 100% मुफ़्त है, साइन अप नहीं, और पूरी तरह आपके ब्राउज़र में चलता है।' },
    ],
    ar: [
      { q: 'هل أحتاج إلى معرفة التعبيرات النمطية لاستخدام هذه الأداة؟', a: 'لا. ما عليك سوى وصف ما تريد مطابقته بلغة بسيطة (مثل "مطابقة جميع عناوين البريد الإلكتروني") ويبني الذكاء الاصطناعي التعبير النمطي لك.' },
      { q: 'هل يشرح التعبير النمطي المولّد؟', a: 'نعم. يُفكَّك كل جزء من النمط لتفهم وظيفته، مما يساعدك أيضاً على تعلّم التعبيرات النمطية بمرور الوقت.' },
      { q: 'هل يمكنني اختبار التعبير النمطي على نص نموذجي؟', a: 'نعم. الصق نص الاختبار وتقوم الأداة بإبراز جميع المطابقات، لتتحقق من النمط قبل استخدامه في الكود.' },
      { q: 'ما أنواع التعبيرات النمطية المدعومة؟', a: 'يولّد أنماطاً متوافقة مع JavaScript وPython وJava وPCRE افتراضياً، ويمكنك تحديد لغتك المستهدفة لصياغة خاصة.' },
      { q: 'هل هو مجاني ويعمل في المتصفح؟', a: 'مجاني 100%، دون تسجيل، ويعمل بالكامل في متصفحك.' },
    ],
  },
};

const FAQ_I18N: Record<SeoLocale, Record<FaqKey, { q: string; a: string }>> = {
  en: {
    free: {
      q: 'Is {name} free to use?',
      a: 'Yes. {name} is 100% free for core features — no signup, no watermarks, no hidden paywalls on the tools you need day to day.',
    },
    signup: {
      q: 'Do I need to sign up to use {name}?',
      a: 'No. Open and use instantly in your browser. Nothing to install, no account required. Your preferences stay on your device.',
    },
    privacy: {
      q: 'Is my data safe with {name}?',
      a: 'Yes. {name} runs locally in your browser whenever technically possible — sensitive inputs are processed on your device, not on our servers. No tracking cookies.',
    },
    device: {
      q: 'Which devices does {name} work on?',
      a: 'Phones, tablets and desktops with any modern browser (Chrome, Safari, Edge, Firefox). Touch-friendly and responsive from 320px to 4K.',
    },
  },
  zh: {
    free: {
      q: '{name} 免费使用吗？',
      a: '是的，{name} 核心功能永久免费，无需注册登录，无水印、无隐藏付费墙，日常使用完全免费。',
    },
    signup: {
      q: '使用 {name} 需要注册吗？',
      a: '不需要。打开浏览器就能用，不用下载任何东西，不用注册账号。所有设置都保存在你自己的设备上。',
    },
    privacy: {
      q: '用 {name} 我的数据安全吗？',
      a: '安全。{name} 在技术允许的情况下全部在浏览器本地运行，敏感输入都在你设备上处理，不上传我们服务器。也没有追踪 Cookie。',
    },
    device: {
      q: '{name} 支持哪些设备？',
      a: '手机、平板、电脑都行，Chrome、Safari、Edge、Firefox 主流浏览器全支持，触摸友好、响应式适配从 320px 到 4K 屏幕。',
    },
  },
  es: {
    free: {
      q: '¿{name} es gratuito?',
      a: 'Sí. {name} es 100% gratuito en sus funciones básicas: sin registro, sin marcas de agua ni muros de pago ocultos en las herramientas que usas cada día.',
    },
    signup: {
      q: '¿Necesito registrarme para usar {name}?',
      a: 'No. Ábrelo directamente en tu navegador y úsalo al instante. Nada que instalar ni cuenta que crear. Tus preferencias se quedan en tu dispositivo.',
    },
    privacy: {
      q: '¿Son seguros mis datos con {name}?',
      a: 'Sí. {name} se ejecuta localmente en tu navegador siempre que es técnicamente posible. Las entradas sensibles se procesan en tu equipo, no en nuestros servidores. Sin cookies de seguimiento.',
    },
    device: {
      q: '¿En qué dispositivos funciona {name}?',
      a: 'Móviles, tabletas y escritorios con cualquier navegador moderno (Chrome, Safari, Edge, Firefox). Interfaz táctil y responsiva de 320 px a 4 K.',
    },
  },
  fr: {
    free: {
      q: '{name} est-il gratuit ?',
      a: 'Oui. {name} est 100 % gratuit sur les fonctions principales : pas d\'inscription, pas de filigrane, pas de paywall masqué sur les outils du quotidien.',
    },
    signup: {
      q: 'Dois-je m\'inscrire pour utiliser {name} ?',
      a: 'Non. Ouvrez et utilisez {name} directement dans votre navigateur. Rien à installer, aucun compte requis. Vos préférences restent sur votre appareil.',
    },
    privacy: {
      q: 'Mes données sont-elles en sécurité avec {name} ?',
      a: 'Oui. {name} s\'exécute localement dans votre navigateur dès que c\'est techniquement possible. Les saisies sensibles sont traitées sur votre appareil, pas sur nos serveurs. Aucun cookie de pistage.',
    },
    device: {
      q: 'Sur quels appareils fonctionne {name} ?',
      a: 'Téléphones, tablettes et ordinateurs avec un navigateur moderne (Chrome, Safari, Edge, Firefox). Interface tactile et responsive de 320 px à 4 K.',
    },
  },
  hi: {
    free: {
      q: 'क्या {name} मुफ़्त है?',
      a: 'हाँ। {name} कोर फ़ीचर्स 100% मुफ़्त हैं — कोई साइनअप नहीं, कोई वॉटरमार्क नहीं, रोज़ काम आने वाले टूल्स पर कोई छुपा पेड वॉल नहीं।',
    },
    signup: {
      q: 'क्या मुझे {name} इस्तेमाल करने के लिए साइनअप करना पड़ेगा?',
      a: 'नहीं। अपने ब्राउज़र में खोलें और तुरंत इस्तेमाल करें। कुछ इंस्टॉल नहीं, कोई अकाउंट नहीं। आपकी प्रेफरेंसेस आपके डिवाइस पर ही रहेंगी।',
    },
    privacy: {
      q: 'क्या {name} के साथ मेरा डेटा सुरक्षित है?',
      a: 'हाँ। {name} तकनीकी रूप से संभव हो तो हमेशा आपके ब्राउज़र में ही लोकल चलता है — सेंसिटिव इनपुट आपके डिवाइस पर प्रोसेस होते हैं, हमारे सर्वर पर नहीं। कोई ट्रैकिंग कुकीज़ नहीं।',
    },
    device: {
      q: '{name} किन डिवाइसों पर काम करता है?',
      a: 'फोन, टैबलेट और डेस्कटॉप — कोई भी मॉडर्न ब्राउज़र (Chrome, Safari, Edge, Firefox)। टच फ्रेंडली और 320px से 4K तक रेस्पॉन्सिव।',
    },
  },
  ar: {
    free: {
      q: 'هل {name} مجاني للاستخدام؟',
      a: 'نعم. {name} مجاني 100% للميزات الأساسية — بدون تسجيل، بدون علامات مائية، بدون جدران دفع مخفية على الأدوات التي تستخدمها يومياً.',
    },
    signup: {
      q: 'هل أحتاج إلى التسجيل لاستخدام {name}؟',
      a: 'لا. افتح واستخدم فوراً في متصفحك. لا شيء للتثبيت ولا حساب مطلوب. تفضيلاتك تبقى على جهازك.',
    },
    privacy: {
      q: 'هل بياناتي آمنة مع {name}؟',
      a: 'نعم. {name} يعمل محلياً داخل متصفحك كلما كان ذلك ممكناً تقنياً — المدخلات الحساسة تُعالج على جهازك وليس على خوادمنا. لا ملفات تعريف ارتباط للتتبع.',
    },
    device: {
      q: 'ما هي الأجهزة التي يعمل عليها {name}؟',
      a: 'الهواتف والأجهزة اللوحية وأجهزة المكتب مع أي متصفح حديث (Chrome، Safari، Edge، Firefox). واجهة متجاوبة ومناسبة لللمس من 320 بكسل إلى 4K.',
    },
  },
};

function resolveLocale(l: string | SeoLocale): SeoLocale {
  return (KNOWN_LOCALES as readonly string[]).includes(l as string) ? (l as SeoLocale) : 'en';
}

export function replaceName(text: string, name: string): string {
  if (!text) return text;
  const safe = name || 'This tool';
  return text.replace(/\{name\}/g, safe);
}

export function resolveToolNameFromJson(locale: SeoLocale, tool: ToolLike, json: JsonMessages): string {
  const l = resolveLocale(locale);
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.nameEn || tool.name || slug || 'This tool';
  try {
    const ns = json?.tools || null;
    if (ns) {
      if (slug && ns[slug]?.name && typeof ns[slug].name === 'string' && ns[slug].name.trim()) return ns[slug].name;
      if (tool.id && String(tool.id) !== slug && ns[String(tool.id)]?.name && typeof ns[String(tool.id)].name === 'string' && ns[String(tool.id)].name.trim()) return ns[String(tool.id)].name;
    }
  } catch { /* ignore */ }
  return fallback;
}

export function resolveToolNameClient(locale: string, tool: ToolLike, translate: NsTranslator): string {
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.nameEn || tool.name || slug || 'This tool';
  const tryKey = (k: string) => {
    try {
      const v = translate(k);
      if (v && v !== k && typeof v === 'string' && !/^\s*$/.test(v)) return v;
    } catch { /* ignore */ }
    return null;
  };
  if (slug) {
    const v1 = tryKey(`${slug}.name`); if (v1) return v1;
  }
  if (tool.id && String(tool.id) !== slug) {
    const v2 = tryKey(`${String(tool.id)}.name`); if (v2) return v2;
  }
  return fallback;
}

export function resolveToolDescriptionFromJson(locale: SeoLocale, tool: ToolLike, json: JsonMessages): string {
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.descriptionEn || tool.description || '';
  try {
    const ns = json?.tools || null;
    if (ns) {
      if (slug && ns[slug]?.description && typeof ns[slug].description === 'string' && ns[slug].description.trim()) return ns[slug].description;
      if (tool.id && String(tool.id) !== slug && ns[String(tool.id)]?.description && typeof ns[String(tool.id)].description === 'string' && ns[String(tool.id)].description.trim()) return ns[String(tool.id)].description;
    }
  } catch { /* ignore */ }
  return fallback;
}

export function resolveToolDescriptionClient(locale: string, tool: ToolLike, translate: NsTranslator): string {
  const slug = String(tool.slug || tool.id || '');
  const fallback = tool.descriptionEn || tool.description || '';
  const tryKey = (k: string) => {
    try {
      const v = translate(k);
      if (v && v !== k && typeof v === 'string' && !/^\s*$/.test(v)) return v;
    } catch { /* ignore */ }
    return null;
  };
  if (slug) {
    const v1 = tryKey(`${slug}.description`); if (v1) return v1;
  }
  if (tool.id && String(tool.id) !== slug) {
    const v2 = tryKey(`${String(tool.id)}.description`); if (v2) return v2;
  }
  return fallback;
}

export function buildToolFaqsFromJson(locale: SeoLocale, tool: ToolLike, _json: JsonMessages): FaqItem[] {
  const l = resolveLocale(locale);
  const name = resolveToolNameFromJson(locale, tool, _json);
  const bundle = FAQ_I18N[l] || FAQ_I18N.en;
  
  // 通用FAQ
  const generalFaqs = FAQ_ORDER.map((k) => {
    const row = bundle[k];
    return {
      q: replaceName(row.q, name),
      a: replaceName(row.a, name),
    };
  });
  
  // 工具特定FAQ
  const slug = String(tool.slug || tool.id || '');
  const toolSpecificFaqs = TOOL_FAQ_I18N[slug]?.[l] || [];
  
  // 合并通用FAQ和工具特定FAQ
  return [...generalFaqs, ...toolSpecificFaqs];
}

export function buildToolFaqsFromTranslator(locale: string, tool: ToolLike, translate: NsTranslator): FaqItem[] {
  const l = resolveLocale(locale);
  const name = resolveToolNameClient(locale, tool, translate);
  const bundle = FAQ_I18N[l] || FAQ_I18N.en;
  
  // 通用FAQ
  const generalFaqs = FAQ_ORDER.map((k) => {
    const row = bundle[k];
    return {
      q: replaceName(row.q, name),
      a: replaceName(row.a, name),
    };
  });
  
  // 工具特定FAQ
  const slug = String(tool.slug || tool.id || '');
  const toolSpecificFaqs = TOOL_FAQ_I18N[slug]?.[l] || [];
  
  // 合并通用FAQ和工具特定FAQ
  return [...generalFaqs, ...toolSpecificFaqs];
}

export function hasToolSpecificFaqs(slug: string, locale: string): boolean {
  const l = resolveLocale(locale);
  const arr = TOOL_FAQ_I18N[slug]?.[l];
  return Array.isArray(arr) && arr.length > 0;
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
