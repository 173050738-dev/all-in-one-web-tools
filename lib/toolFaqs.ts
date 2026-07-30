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
