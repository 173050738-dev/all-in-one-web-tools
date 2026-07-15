const fs = require('fs');
const path = require('path');

function updateTranslations(locale, translations) {
  const filePath = path.join(__dirname, '..', 'public', 'locales', locale, 'translation.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.tools) {
    data.tools = {};
  }
  
  Object.assign(data.tools, translations);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${locale} translations`);
}

const translations = {
  'ai-copywriter': {
    name: 'AI 营销文案生成器',
    description: '输入产品信息，AI 一键生成高质量营销文案',
    seo: {
      intro: 'AI 营销文案生成器是一款强大的文案创作工具，利用先进的人工智能技术，帮助您快速生成专业的营销文案。无论您需要广告标题、产品描述、社交媒体帖子还是邮件主题，只需输入产品名称和核心卖点，即可获得3条经过优化的高质量文案建议。AI 会根据您选择的语气风格和目标平台，生成最适合的文案内容，让您的营销更具说服力和吸引力。',
      scenarios: [
        '电商卖家需要撰写产品描述时，输入产品信息快速生成专业文案',
        '社交媒体运营者发布帖子前，让 AI 帮您写出吸引人的文案',
        '营销人员制作广告时，生成多个版本的广告标题进行测试'
      ],
      tutorial: [
        '在产品名称输入框中输入您的产品名称',
        '在核心卖点输入框中详细描述产品的优势和特点',
        '选择合适的文案类型、语气风格和目标平台',
        '点击生成按钮，AI 将为您生成3条高质量文案'
      ],
      advantages: [
        '基于先进 AI 技术，生成的文案质量高、说服力强',
        '支持多种文案类型和语气风格，满足不同场景需求',
        '一键复制功能，方便快捷地使用生成的文案'
      ],
      faqs: [
        { q: '生成的文案是否可以直接使用？', a: '是的，生成的文案经过优化，可以直接用于营销推广。您也可以根据需要进行微调。' },
        { q: '支持哪些目标平台？', a: '支持通用平台、独立站、Instagram、Facebook、X 等多个平台的文案生成。' },
        { q: '每天可以使用多少次？', a: '免费用户每天可使用5次。如需更多次数，敬请期待后续升级。' },
        { q: '生成的文案是否会泄露我的产品信息？', a: '不会。您的输入信息仅用于生成文案，不会被保存或用于其他用途。' },
        { q: '支持哪些语言？', a: '目前支持中文、英文、法语、西班牙语、印地语和阿拉伯语。' }
      ]
    }
  }
};

updateTranslations('zh', translations);
console.log('Chinese translations added');

const enTranslations = {
  'ai-copywriter': {
    name: 'AI Copywriter',
    description: 'Generate high-quality marketing copy with AI',
    seo: {
      intro: 'AI Copywriter is a powerful copywriting tool that leverages advanced artificial intelligence to help you quickly generate professional marketing copy. Whether you need ad headlines, product descriptions, social media posts, or email subjects, simply enter your product name and selling points, and you will receive 3 optimized high-quality copy suggestions. AI will generate the most suitable copy based on your chosen tone style and target platform, making your marketing more persuasive and engaging.',
      scenarios: [
        'E-commerce sellers can quickly generate professional copy when writing product descriptions',
        'Social media operators can let AI help write engaging copy before posting',
        'Marketers can generate multiple versions of ad headlines for testing'
      ],
      tutorial: [
        'Enter your product name in the product name input field',
        'Describe your product advantages and features in detail in the selling points input field',
        'Select the appropriate copy type, tone style, and target platform',
        'Click the generate button and AI will generate 3 high-quality copies for you'
      ],
      advantages: [
        'Powered by advanced AI technology, generating high-quality, persuasive copy',
        'Supports multiple copy types and tone styles to meet different scenario needs',
        'One-click copy function for quick and easy use of generated copy'
      ],
      faqs: [
        { q: 'Can the generated copy be used directly?', a: 'Yes, the generated copy is optimized and can be directly used for marketing. You can also make adjustments as needed.' },
        { q: 'Which target platforms are supported?', a: 'Supports copy generation for general platforms, Shopify, Instagram, Facebook, X, and more.' },
        { q: 'How many times can I use it per day?', a: 'Free users can use it 5 times per day. More usage is coming soon.' },
        { q: 'Will my product information be leaked?', a: 'No. Your input is only used to generate copy and will not be saved or used for other purposes.' },
        { q: 'Which languages are supported?', a: 'Currently supports Chinese, English, French, Spanish, Hindi, and Arabic.' }
      ]
    }
  }
};

updateTranslations('en', enTranslations);
console.log('English translations added');

const frTranslations = {
  'ai-copywriter': {
    name: 'Rédacteur AI',
    description: 'Générez du contenu marketing de haute qualité avec AI',
    seo: {
      intro: 'Le Rédacteur AI est un outil puissant de rédaction qui utilise l\'intelligence artificielle avancée pour vous aider à générer rapidement du contenu marketing professionnel. Que vous ayez besoin de titres publicitaires, de descriptions de produits, de publications sur les réseaux sociaux ou de sujets d\'email, il vous suffit d\'entrer le nom de votre produit et vos points forts, et vous recevrez 3 suggestions de contenu de haute qualité optimisées. L\'AI générera le contenu le plus adapté en fonction du ton et de la plateforme cible que vous choisissez, rendant votre marketing plus persuasif et plus attractif.',
      scenarios: [
        'Les vendeurs e-commerce peuvent générer rapidement du contenu professionnel en écrivant des descriptions de produits',
        'Les gestionnaires de réseaux sociaux peuvent laisser l\'AI les aider à écrire du contenu engageant avant de publier',
        'Les marketeurs peuvent générer plusieurs versions de titres publicitaires pour les tester'
      ],
      tutorial: [
        'Entrez le nom de votre produit dans le champ de saisie',
        'Décrivez en détail les avantages et les caractéristiques de votre produit dans le champ des points forts',
        'Sélectionnez le type de contenu, le ton et la plateforme cible appropriés',
        'Cliquez sur le bouton générer et l\'AI vous générera 3 contenus de haute qualité'
      ],
      advantages: [
        'Alimenté par une technologie AI avancée, génère un contenu de haute qualité et persuasif',
        'Prend en charge plusieurs types de contenu et de tons pour répondre aux besoins de différents scénarios',
        'Fonction de copie en un clic pour utiliser rapidement le contenu généré'
      ],
      faqs: [
        { q: 'Le contenu généré peut-il être utilisé directement ?', a: 'Oui, le contenu généré est optimisé et peut être utilisé directement pour le marketing. Vous pouvez également apporter des ajustements si nécessaire.' },
        { q: 'Quelles plateformes cibles sont prises en charge ?', a: 'Prend en charge la génération de contenu pour les plateformes générales, Shopify, Instagram, Facebook, X, etc.' },
        { q: 'Combien de fois puis-je l\'utiliser par jour ?', a: 'Les utilisateurs gratuits peuvent l\'utiliser 5 fois par jour. Plus d\'utilisations sont à venir.' },
        { q: 'Mes informations sur le produit seront-elles divulguées ?', a: 'Non. Vos entrées ne sont utilisées que pour générer du contenu et ne seront pas sauvegardées ou utilisées à d\'autres fins.' },
        { q: 'Quelles langues sont prises en charge ?', a: 'Prend actuellement en charge le chinois, l\'anglais, le français, l\'espagnol, l\'hindi et l\'arabe.' }
      ]
    }
  }
};

updateTranslations('fr', frTranslations);
console.log('French translations added');

const esTranslations = {
  'ai-copywriter': {
    name: 'Redactor AI',
    description: 'Genera contenido marketing de alta calidad con AI',
    seo: {
      intro: 'Redactor AI es una herramienta potente de redacción que aprovecha la inteligencia artificial avanzada para ayudarte a generar rápidamente contenido marketing profesional. Ya sea que necesites títulos de anuncios, descripciones de productos, publicaciones en redes sociales o asuntos de correo electrónico, simplemente ingresa el nombre de tu producto y tus puntos de venta, y recibirás 3 sugerencias de contenido de alta calidad optimizadas. La AI generará el contenido más adecuado según el estilo de tono y la plataforma objetivo que elijas, haciendo que tu marketing sea más persuasivo y atractivo.',
      scenarios: [
        'Los vendedores de comercio electrónico pueden generar rápidamente contenido profesional al escribir descripciones de productos',
        'Los operadores de redes sociales pueden dejar que la AI les ayude a escribir contenido atractivo antes de publicar',
        'Los profesionales del marketing pueden generar múltiples versiones de títulos de anuncios para probarlos'
      ],
      tutorial: [
        'Ingresa el nombre de tu producto en el campo de entrada',
        'Describe en detalle las ventajas y características de tu producto en el campo de puntos de venta',
        'Selecciona el tipo de contenido, estilo de tono y plataforma objetivo apropiados',
        'Haz clic en el botón generar y la AI te generará 3 contenidos de alta calidad'
      ],
      advantages: [
        'Alimentado por tecnología AI avanzada, genera contenido de alta calidad y persuasivo',
        'Soporta múltiples tipos de contenido y estilos de tono para satisfacer necesidades de diferentes escenarios',
        'Función de copia en un solo clic para usar rápidamente el contenido generado'
      ],
      faqs: [
        { q: '¿El contenido generado se puede usar directamente?', a: 'Sí, el contenido generado está optimizado y se puede usar directamente para marketing. También puedes hacer ajustes según sea necesario.' },
        { q: '¿Qué plataformas objetivo se admiten?', a: 'Admite la generación de contenido para plataformas generales, Shopify, Instagram, Facebook, X y más.' },
        { q: '¿Cuántas veces puedo usarlo por día?', a: 'Los usuarios gratuitos pueden usarlo 5 veces por día. Más usos estarán disponibles pronto.' },
        { q: '¿Se filtrarán mis datos del producto?', a: 'No. Tu entrada solo se usa para generar contenido y no se guardará ni se usará para otros fines.' },
        { q: '¿Qué idiomas se admiten?', a: 'Actualmente admite chino, inglés, francés, español, hindi y árabe.' }
      ]
    }
  }
};

updateTranslations('es', esTranslations);
console.log('Spanish translations added');

const hiTranslations = {
  'ai-copywriter': {
    name: 'AI कॉपीराइटर',
    description: 'AI के साथ उच्च गुणवत्ता वाली विपणन कॉपी बनाएं',
    seo: {
      intro: 'AI कॉपीराइटर एक शक्तिशाली कॉपीराइटिंग टूल है जो उन्नत कृत्रिम बुद्धिमत्ता का उपयोग करते हुए आपको व्यावसायिक विपणन कॉपी तेजी से बनाने में मदद करता है। चाहे आपको विज्ञापन शीर्षक, उत्पाद विवरण, सोशल मीडिया पोस्ट या ईमेल विषय चाहिए, बस अपने उत्पाद का नाम और बिक्री बिंदु दर्ज करें, और आपको 3 अनुकूलित उच्च गुणवत्ता वाली कॉपी सुझाव प्राप्त होंगे। AI आपके द्वारा चुने गए टोन शैली और लक्ष्य प्लेटफॉर्म के आधार पर सबसे उपयुक्त कॉपी तैयार करेगा, जिससे आपका विपणन अधिक प्रेरणादायक और आकर्षक होगा।',
      scenarios: [
        'ई-कॉमर्स विक्रेता उत्पाद विवरण लिखते समय तेजी से व्यावसायिक कॉपी बना सकते हैं',
        'सोशल मीडिया ऑपरेटर पोस्ट करने से पहले AI को आकर्षक कॉपी लिखने में मदद करने के लिए छोड़ सकते हैं',
        'मार्केटर परीक्षण के लिए विज्ञापन शीर्षकों के कई संस्करण बना सकते हैं'
      ],
      tutorial: [
        'उत्पाद नाम इनपुट फील्ड में अपने उत्पाद का नाम दर्ज करें',
        'बिक्री बिंदु इनपुट फील्ड में अपने उत्पाद के लाभों और विशेषताओं का विस्तार से वर्णन करें',
        'उपयुक्त कॉपी प्रकार, टोन शैली और लक्ष्य प्लेटफॉर्म चुनें',
        'जनरेट बटन पर क्लिक करें और AI आपके लिए 3 उच्च गुणवत्ता वाली कॉपी बनाएगा'
      ],
      advantages: [
        'उन्नत AI प्रौद्योगिकी द्वारा संचालित, उच्च गुणवत्ता, प्रेरणादायक कॉपी बनाता है',
        'विभिन्न परिदृश्यों की जरूरतों को पूरा करने के लिए कई प्रकार की कॉपी और टोन शैलियों का समर्थन करता है',
        'बनाई हुई कॉपी का तेजी से उपयोग करने के लिए एक-क्लिक कॉपी फ़ंक्शन'
      ],
      faqs: [
        { q: 'बनाई हुई कॉपी को सीधे उपयोग किया जा सकता है?', a: 'हां, बनाई हुई कॉपी अनुकूलित है और सीधे विपणन के लिए उपयोग की जा सकती है। आप जरूरत पड़ने पर इसमें समायोजन भी कर सकते हैं।' },
        { q: 'किन लक्ष्य प्लेटफॉर्मों का समर्थन किया जाता है?', a: 'सामान्य प्लेटफॉर्मों, शॉपिफाई, इंस्टाग्राम, फेसबुक, X आदि के लिए कॉपी उत्पादन का समर्थन करता है।' },
        { q: 'प्रतिदिन कितनी बार इस्तेमाल किया जा सकता है?', a: 'नि:शुल्क उपयोगकर्ता प्रतिदिन इसे 5 बार उपयोग कर सकते हैं। अधिक उपयोग जल्द ही उपलब्ध होगा।' },
        { q: 'क्या मेरी उत्पाद जानकारी लीक होगी?', a: 'नहीं। आपका इनपुट केवल कॉपी बनाने के लिए उपयोग किया जाता है और इसे सहेजा या अन्य उद्देश्यों के लिए उपयोग नहीं किया जाएगा।' },
        { q: 'किन भाषाओं का समर्थन किया जाता है?', a: 'वर्तमान में चीनी, अंग्रेजी, फ्रांसीसी, स्पेनिश, हिंदी और अरबी का समर्थन करता है।' }
      ]
    }
  }
};

updateTranslations('hi', hiTranslations);
console.log('Hindi translations added');

const arTranslations = {
  'ai-copywriter': {
    name: 'مُنشئ النصوص التسويقية',
    description: 'إنشاء نصوص تسويقية عالية الجودة مع AI',
    seo: {
      intro: 'مُنشئ النصوص التسويقية هو أداة كتابة نصوص قوية تستخدم تقنية الذكاء الاصطناعي المتقدمة لمساعدتك على إنشاء نصوص تسويقية احترافية بسرعة. سواء كنت بحاجة لعناوين إعلانات، أو وصفات منتجات، أو منشورات على وسائل التواصل الاجتماعي، أو موضوعات بريد إلكتروني، فكل ما عليك هو إدخال اسم منتجك ونقاط البيع، وسوف تحصل على 3 مقترحات نصوص عالية الجودة ومُحسنة. سيقوم الذكاء الاصطناعي بإنشاء النص الأكثر ملاءمة بناءً على أسلوب النبرة والمنصة المستهدفة التي تختارها، مما يجعل تسويقك أكثر ق说服力ً و吸引力.',
      scenarios: [
        'يمكن لمتجعي التجارة الإلكترونية إنشاء نصوص احترافية بسرعة عند كتابة وصفات المنتجات',
        'يمكن لمشغلي وسائل التواصل الاجتماعي ترك الذكاء الاصطناعي يساعدهم في كتابة نصوص جذابة قبل النشر',
        'يمكن لمسؤولي التسويق إنشاء نسخ متعددة من عناوين الإعلانات للاختبار'
      ],
      tutorial: [
        'أدخل اسم منتجك في حقل إدخال اسم المنتج',
        'صف مزايا وميزات منتجك بالتفصيل في حقل نقاط البيع',
        'حدد نوع النص، أسلوب النبرة والمنصة المستهدفة المناسبة',
        'انقر على زر الإنشاء، وسوف يقوم الذكاء الاصطناعي بإنشاء 3 نصوص عالية الجودة لك'
      ],
      advantages: [
        'مدعوم بتقنية AI متقدمة، يُنشئ نصوص عالية الجودة وقوية',
        'يدعم أنواع مختلفة من النصوص وأسلوبات النبرة لتلبية احتياجات السيناريوهات المختلفة',
        'وظيفة النسخ في نقر واحد لاستخدام السريع للنصوص التي تم إنشاؤها'
      ],
      faqs: [
        { q: 'هل يمكن استخدام النصوص التي تم إنشاؤها مباشرة؟', a: 'نعم، النصوص التي تم إنشاؤها مُحسنة ويمكن استخدامها مباشرة للتسويق. يمكنك أيضًا إجراء تعديلات حسب الحاجة.' },
        { q: 'ما المنصات المستهدفة المدعومة؟', a: 'يدعم إنشاء نصوص للمنصات العامة، شوبيفاي، إنستغرام، فيسبوك، X وغيرها.' },
        { q: 'كم مرة يمكنني استخدامه يوميًا؟', a: 'يمكن للمستخدمين المجانيين استخدامه 5 مرات يوميًا. المزيد من الاستخدامات ستصبح متاحة قريبًا.' },
        { q: 'هل ستُكشف معلومات منتجي؟', a: 'لا. مدخلاتك تُستخدم فقط لإنشاء النصوص ولن يتم حفظها أو استخدامها لأغراض أخرى.' },
        { q: 'ما اللغات المدعومة؟', a: 'يدعم حاليًا الصينية، الإنجليزية، الفرنسية، الإسبانية، الهندية والعربية.' }
      ]
    }
  }
};

updateTranslations('ar', arTranslations);
console.log('Arabic translations added');

console.log('\nAll translations added successfully!');
