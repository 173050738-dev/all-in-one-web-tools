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
  'image-compressor': {
    en: [
      { q: 'How much can I compress an image?', a: 'Typically 50-80% reduction in file size with minimal quality loss. Results vary based on original image format and content.' },
      { q: 'What image formats are supported?', a: 'JPG, PNG, WEBP, and GIF. We also support batch compression for multiple images at once.' },
      { q: 'Is my image data safe?', a: 'Yes, all image processing happens locally in your browser. Your images never leave your device.' },
    ],
    zh: [
      { q: '图片可以压缩多少？', a: '通常可以减少 50-80% 的文件大小，同时保持最小的质量损失。结果取决于原始图片格式和内容。' },
      { q: '支持哪些图片格式？', a: '支持 JPG、PNG、WEBP 和 GIF 格式。我们还支持批量压缩多张图片。' },
      { q: '我的图片数据安全吗？', a: '安全，所有图片处理都在浏览器本地进行，你的图片不会离开你的设备。' },
    ],
    es: [
      { q: '¿Cuánto puedo comprimir una imagen?', a: 'Normalmente una reducción del 50-80% en el tamaño del archivo con pérdida mínima de calidad. Los resultados varían según el formato y el contenido de la imagen original.' },
      { q: '¿Qué formatos de imagen se admiten?', a: 'JPG, PNG, WEBP y GIF. También admitimos compresión por lotes para varias imágenes a la vez.' },
      { q: '¿Es seguro mi datos de imagen?', a: 'Sí, todo el procesamiento de imágenes se realiza localmente en tu navegador. Tus imágenes nunca dejan tu dispositivo.' },
    ],
    fr: [
      { q: 'De combien puis-je compresser une image ?', a: 'Généralement une réduction de 50-80% de la taille du fichier avec une perte de qualité minimale. Les résultats varient selon le format et le contenu de l\'image originale.' },
      { q: 'Quels formats d\'image sont pris en charge ?', a: 'JPG, PNG, WEBP et GIF. Nous prenons également en charge la compression par lots pour plusieurs images à la fois.' },
      { q: 'Mes données d\'image sont-elles sûres ?', a: 'Oui, tout le traitement d\'image se fait localement dans votre navigateur. Vos images ne quittent jamais votre appareil.' },
    ],
    hi: [
      { q: 'मैं एक छवि को कितना संपीड़ित कर सकता हूँ?', a: 'आमतौर पर गुणवत्ता में न्यूनतम हानि के साथ फ़ाइल आकार में 50-80% की कमी। परिणाम मूल छवि प्रारूप और सामग्री के आधार पर बदलते हैं।' },
      { q: 'कौन से छवि प्रारूप समर्थित हैं?', a: 'JPG, PNG, WEBP और GIF। हम एक साथ कई छवियों के लिए बैच संपीड़न भी समर्थित करते हैं।' },
      { q: 'क्या मेरी छवि डेटा सुरक्षित है?', a: 'हाँ, सभी छवि प्रसंस्करण आपके ब्राउज़र में स्थानीय रूप से होता है। आपकी छवियाँ कभी भी आपके डिवाइस को नहीं छोड़तीं।' },
    ],
    ar: [
      { q: 'كم يمكنني ضغط الصورة؟', a: 'عادةً يتم تقليل حجم الملف بنسبة 50-80% مع فقدان جودة طفيف. النتائج تختلف بناءً على تنسيق الصورة الأصلية ومحتواها.' },
      { q: 'ما تنسيقات الصور المدعومة؟', a: 'JPG، PNG، WEBP و GIF. نحن أيضًا ندعم الضغط الجماعي لعدة صور في وقت واحد.' },
      { q: 'هل بيانات صوري آمنة؟', a: 'نعم، جميع معالجات الصور تحدث محلياً داخل متصفحك. صورك لا تترك جهازك أبداً.' },
    ],
  },
  'regex-tester': {
    en: [
      { q: 'What regex flavors are supported?', a: 'JavaScript (ECMAScript) by default. We also support Python, Go, and Java regex syntax modes.' },
      { q: 'Can I test regex against large text?', a: 'Yes, our tester handles large text inputs efficiently. Results are shown in real-time as you type.' },
      { q: 'Does it support capture groups?', a: 'Yes, all capture groups are highlighted and numbered, making it easy to debug complex patterns.' },
    ],
    zh: [
      { q: '支持哪些正则表达式语法？', a: '默认支持 JavaScript (ECMAScript)。我们还支持 Python、Go 和 Java 正则语法模式。' },
      { q: '可以测试大文本吗？', a: '可以，我们的测试器能高效处理大文本输入。结果会实时显示。' },
      { q: '支持捕获组吗？', a: '支持，所有捕获组都会高亮并编号，方便调试复杂模式。' },
    ],
    es: [
      { q: '¿Qué variantes de regex se admiten?', a: 'JavaScript (ECMAScript) por defecto. También admitimos modos de sintaxis regex de Python, Go y Java.' },
      { q: '¿Puedo probar regex contra texto largo?', a: 'Sí, nuestro probador maneja eficientemente entradas de texto largas. Los resultados se muestran en tiempo real mientras escribes.' },
      { q: '¿Admite grupos de captura?', a: 'Sí, todos los grupos de captura se resaltan y numeran, facilitando la depuración de patrones complejos.' },
    ],
    fr: [
      { q: 'Quels types de regex sont pris en charge ?', a: 'JavaScript (ECMAScript) par défaut. Nous prenons également en charge les modes de syntaxe regex Python, Go et Java.' },
      { q: 'Puis-je tester des regex sur du texte long ?', a: 'Oui, notre testeur gère efficacement les entrées de texte longues. Les résultats sont affichés en temps réel lors de la saisie.' },
      { q: 'Prend-il en charge les groupes de capture ?', a: 'Oui, tous les groupes de capture sont mis en évidence et numérotés, ce qui facilite le débogage de modèles complexes.' },
    ],
    hi: [
      { q: 'कौन से regex फ्लेवर्स समर्थित हैं?', a: 'डिफ़ॉल्ट रूप से JavaScript (ECMAScript)। हम Python, Go और Java regex सिंटैक्स मोड भी समर्थित करते हैं।' },
      { q: 'क्या मैं बड़े टेक्स्ट के खिलाफ regex का परीक्षण कर सकता हूँ?', a: 'हाँ, हमारा टेस्टर बड़े टेक्स्ट इनपुट को कुशलतापूर्वक संभालता है। परिणाम आपके टाइप करते समय वास्तविक समय में दिखाए जाते हैं।' },
      { q: 'क्या यह कैप्चर ग्रुप्स का समर्थन करता है?', a: 'हाँ, सभी कैप्चर ग्रुप्स हाइलाइट और क्रमांकित होते हैं, जिससे जटिल पैटर्न को डिबग करना आसान होता है।' },
    ],
    ar: [
      { q: 'ما أنماط regex المدعومة؟', a: 'JavaScript (ECMAScript) افتراضياً. نحن أيضاً ندعم أنماط بناء الجملة regex لـ Python و Go و Java.' },
      { q: 'هل يمكنني اختبار regex على نص كبير؟', a: 'نعم، أداة الاختبار لدينا تتعامل بكفاءة مع مدخلات النص الطويلة. تظهر النتائج في الوقت الحقيقي أثناء الكتابة.' },
      { q: 'هل تدعم مجموعات الالتقاط؟', a: 'نعم، يتم تسليط الضوء على جميع مجموعات الالتقاط وترقيمها، مما يسهل تصليح الأخطاء في الأنماط المعقدة.' },
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
