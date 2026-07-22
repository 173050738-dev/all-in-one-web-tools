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
