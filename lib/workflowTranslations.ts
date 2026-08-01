import type { Workflow, WorkflowStep } from '@/data/workflows';

export type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';

export interface WorkflowStepTranslation {
  title?: string;
  description?: string;
}

export interface WorkflowTranslation {
  title: string;
  description?: string;
  steps?: WorkflowStepTranslation[];
}

export type WorkflowSlug = string;

export const WORKFLOW_TRANSLATIONS: Record<WorkflowSlug, Record<Locale, WorkflowTranslation>> = {
  'ppt-design': {
    zh: {
      title: 'PPT设计工作流',
      description: '从找模板到配图到配色，一站式搞定精美PPT',
      steps: [
        { title: '找PPT模板', description: '在Canva中选择合适的PPT模板' },
        { title: '确定配色方案', description: '生成和谐的配色方案' },
        { title: '找配图素材', description: '下载高质量免费图片' },
        { title: '找图标素材', description: '下载配套的图标资源' },
        { title: '压缩图片', description: '压缩图片体积，方便插入PPT' },
      ],
    },
    en: {
      title: 'PPT Design Workflow',
      description: 'One-stop shop for stunning presentations: templates, images, colors & more',
      steps: [
        { title: 'Find PPT Templates', description: 'Browse suitable PPT templates in Canva' },
        { title: 'Define Color Scheme', description: 'Generate harmonious color palettes' },
        { title: 'Source Image Assets', description: 'Download high-quality free images' },
        { title: 'Source Icon Assets', description: 'Download matching icon resources' },
        { title: 'Compress Images', description: 'Reduce image size for easy PPT insertion' },
      ],
    },
    fr: {
      title: 'Flux de travail Conception PPT',
      description: 'Une solution complète pour des présentations percutantes : modèles, images, couleurs',
      steps: [
        { title: 'Trouver des Modèles PPT', description: 'Choisir des modèles PPT adaptés dans Canva' },
        { title: 'Définir la Palette de Couleurs', description: 'Générer des harmonies de couleurs' },
        { title: 'Rassembler les Images', description: 'Télécharger des images gratuites de haute qualité' },
        { title: 'Rassembler les Icônes', description: 'Télécharger des ressources icônes assorties' },
        { title: 'Compresser les Images', description: 'Réduire la taille pour insertion dans PPT' },
      ],
    },
    es: {
      title: 'Flujo de Diseño de PPT',
      description: 'Solución integral para presentaciones impresionantes: plantillas, imágenes y colores',
      steps: [
        { title: 'Buscar Plantillas PPT', description: 'Explorar plantillas de PPT adecuadas en Canva' },
        { title: 'Definir Esquema de Colores', description: 'Generar paletas de colores armoniosas' },
        { title: 'Buscar Imágenes', description: 'Descargar imágenes gratuitas de alta calidad' },
        { title: 'Buscar Iconos', description: 'Descargar recursos de iconos coincidentes' },
        { title: 'Comprimir Imágenes', description: 'Reducir tamaño para insertar en PPT' },
      ],
    },
    hi: {
      title: 'PPT डिज़ाइन वर्कफ़्लो',
      description: 'शानदार प्रेजेंटेशन के लिए एक स्टॉप सॉल्यूशन: टेम्पलेट्स, इमेजेस, रंग और बहुत कुछ',
      steps: [
        { title: 'PPT टेम्पलेट खोजें', description: 'Canva में उपयुक्त PPT टेम्पलेट्स ब्राउज़ करें' },
        { title: 'कलर स्कीम तय करें', description: 'सामंजस्यपूर्ण रंग पैलेट जेनरेट करें' },
        { title: 'इमेज सामग्री खोजें', description: 'उच्च गुणवत्ता वाली फ्री इमेजेस डाउनलोड करें' },
        { title: 'आइकन सामग्री खोजें', description: 'मेल खाते आइकन रिसोर्सेस डाउनलोड करें' },
        { title: 'इमेजेस कंप्रेस करें', description: 'PPT में आसानी से डालने के लिए साइज़ कम करें' },
      ],
    },
    ar: {
      title: 'سير عمل تصميم العروض التقديمية',
      description: 'حل متكامل لعروض تقديمية مذهلة: القوالب والصور والألوان والمزيد',
      steps: [
        { title: 'البحث عن قوالب PPT', description: 'تصفح قوالب PPT المناسبة في Canva' },
        { title: 'تحديد مخطط الألوان', description: 'إنشاء لوحات ألوان متناسقة' },
        { title: 'تجميع صور العرض', description: 'تنزيل صور عالية الجودة مجانية' },
        { title: 'تجميع أيقونات العرض', description: 'تنزيل موارد الأيقونات المتطابقة' },
        { title: 'ضغط الصور', description: 'تقليل حجم الصور لإدراجها في PPT بسهولة' },
      ],
    },
  },
  'image-process': {
    zh: {
      title: '图片处理工作流',
      description: '抠图、压缩、加水印一条龙',
      steps: [
        { title: '抠图去背景', description: '一键去除图片背景' },
        { title: '在线编辑', description: '在线PS，调整尺寸和效果' },
        { title: '压缩图片', description: '无损压缩图片体积' },
        { title: '格式转换', description: '转换为需要的图片格式' },
      ],
    },
    en: {
      title: 'Image Processing Workflow',
      description: 'All-in-one: background removal, compression, watermark & format conversion',
      steps: [
        { title: 'Remove Background', description: 'One-click image background removal' },
        { title: 'Online Editing', description: 'Online PS: adjust size and effects' },
        { title: 'Compress Images', description: 'Lossless image compression' },
        { title: 'Format Conversion', description: 'Convert to desired image format' },
      ],
    },
    fr: {
      title: 'Flux de travail Traitement d\'Images',
      description: 'Tout-en-un : détourage, compression, filigrane et conversion de format',
      steps: [
        { title: 'Supprimer l\'Arrière-plan', description: 'Suppression de fond en un clic' },
        { title: 'Édition en Ligne', description: 'PS en ligne : taille et effets' },
        { title: 'Compresser les Images', description: 'Compression d\'image sans perte' },
        { title: 'Conversion de Format', description: 'Convertir au format image souhaité' },
      ],
    },
    es: {
      title: 'Flujo de Procesamiento de Imágenes',
      description: 'Todo en uno: eliminación de fondo, compresión, marca de agua y conversión',
      steps: [
        { title: 'Quitar Fondo', description: 'Eliminación de fondo con un clic' },
        { title: 'Edición Online', description: 'PS online: ajustar tamaño y efectos' },
        { title: 'Comprimir Imágenes', description: 'Compresión de imágenes sin pérdida' },
        { title: 'Conversión de Formato', description: 'Convertir al formato de imagen deseado' },
      ],
    },
    hi: {
      title: 'इमेज प्रोसेसिंग वर्कफ़्लो',
      description: 'ऑल-इन-वन: बैकग्राउंड हटाना, कंप्रेशन, वॉटरमार्क और फ़ॉर्मेट रूपांतरण',
      steps: [
        { title: 'बैकग्राउंड हटाएं', description: 'एक क्लिक में इमेज बैकग्राउंड हटाएं' },
        { title: 'ऑनलाइन एडिटिंग', description: 'ऑनलाइन PS: साइज़ और इफ़ेक्ट्स एडजस्ट करें' },
        { title: 'इमेजेस कंप्रेस करें', description: 'लॉसलेस इमेज कंप्रेशन' },
        { title: 'फ़ॉर्मेट रूपांतरण', description: 'वांछित इमेज फ़ॉर्मेट में कनवर्ट करें' },
      ],
    },
    ar: {
      title: 'سير عمل معالجة الصور',
      description: 'كل شيء في مكان واحد: إزالة الخلفية والضغط والعلامة المائية وتحويل التنسيق',
      steps: [
        { title: 'إزالة الخلفية', description: 'إزالة خلفية الصورة بنقرة واحدة' },
        { title: 'التحرير عبر الإنترنت', description: 'PS عبر الإنترنت: ضبط الحجم والتأثيرات' },
        { title: 'ضغط الصور', description: 'ضغط الصور بدون فقدان الجودة' },
        { title: 'تحويل التنسيق', description: 'التحويل إلى تنسيق الصورة المطلوب' },
      ],
    },
  },
  'pdf-workflow': {
    zh: {
      title: 'PDF处理工作流',
      description: 'PDF压缩、合并、转换、翻译全套',
      steps: [
        { title: 'PDF基础处理', description: '合并、拆分、压缩PDF' },
        { title: '格式转换', description: 'PDF转Word/Excel/PPT' },
        { title: '文档翻译', description: '翻译PDF文档内容' },
      ],
    },
    en: {
      title: 'PDF Processing Workflow',
      description: 'Complete PDF solution: compress, merge, convert & translate',
      steps: [
        { title: 'Basic PDF Processing', description: 'Merge, split and compress PDFs' },
        { title: 'Format Conversion', description: 'PDF to Word/Excel/PPT conversion' },
        { title: 'Document Translation', description: 'Translate PDF document content' },
      ],
    },
    fr: {
      title: 'Flux de travail PDF',
      description: 'Solution PDF complète : compression, fusion, conversion et traduction',
      steps: [
        { title: 'Traitement PDF de Base', description: 'Fusionner, découper et compresser des PDFs' },
        { title: 'Conversion de Format', description: 'Conversion PDF vers Word/Excel/PPT' },
        { title: 'Traduction de Document', description: 'Traduire le contenu du document PDF' },
      ],
    },
    es: {
      title: 'Flujo de Trabajo PDF',
      description: 'Solución PDF completa: comprimir, fusionar, convertir y traducir',
      steps: [
        { title: 'Procesamiento Básico PDF', description: 'Fusionar, dividir y comprimir PDFs' },
        { title: 'Conversión de Formato', description: 'Conversión PDF a Word/Excel/PPT' },
        { title: 'Traducción de Documento', description: 'Traducir el contenido del documento PDF' },
      ],
    },
    hi: {
      title: 'PDF प्रोसेसिंग वर्कफ़्लो',
      description: 'संपूर्ण PDF समाधान: कंप्रेस, मर्ज, कनवर्ट और ट्रांसलेट',
      steps: [
        { title: 'बेसिक PDF प्रोसेसिंग', description: 'PDFs मर्ज, स्प्लिट और कंप्रेस करें' },
        { title: 'फ़ॉर्मेट रूपांतरण', description: 'PDF से Word/Excel/PPT रूपांतरण' },
        { title: 'दस्तावेज़ अनुवाद', description: 'PDF दस्तावेज़ की सामग्री का अनुवाद करें' },
      ],
    },
    ar: {
      title: 'سير عمل معالجة PDF',
      description: 'حل PDF كامل: الضغط والدمج والتحويل والترجمة',
      steps: [
        { title: 'المعالجة الأساسية لـ PDF', description: 'دمج وتقسيم وضغط ملفات PDF' },
        { title: 'تحويل التنسيق', description: 'تحويل PDF إلى Word/Excel/PPT' },
        { title: 'ترجمة المستند', description: 'ترجمة محتوى مستند PDF' },
      ],
    },
  },
  'amazon-product-launch': {
    zh: {
      title: "Amazon新品冷启动工作流",
      description: "从选品到上架到推广，30天打爆FBA新品全流程",
      steps: [
        { title: "选品调研", description: "搜索量、竞品、利润分析" },
        { title: "利润核算", description: "预估FBA费用和到手利润" },
        { title: "主图设计", description: "白底图+生活场景图+信息图" },
        { title: "Listing文案", description: "英文标题五点描述A+内容" },
        { title: "埋词优化", description: "关键词反查搜索频率排名" },
      ],
    },
    en: {
      title: "Amazon FBA New Product Launch (30-Day)",
      description: "Full 30-day product research → listing → ad stack for Amazon FBA new sellers",
      steps: [
        { title: "Product Research", description: "Analyze search volume, competition & profit margin" },
        { title: "Profit Calculation", description: "Estimate FBA fees & net payout per unit" },
        { title: "Main Image Design", description: "White background + lifestyle + infographic images" },
        { title: "Listing Copywriting", description: "English title, 5 bullets & A+ content" },
        { title: "Keyword Optimization", description: "Reverse-ASIN lookups & search frequency rank" },
      ],
    },
    fr: {
      title: "Lancement Produit Amazon FBA (30j)",
      description: "Recherche produit → fiche → pubs, 30 jours vendeurs FBA complet",
      steps: [
        { title: "Recherche produit", description: "Volume de recherche, concurrence, marge" },
        { title: "Calcul de rentabilité", description: "Estimation frais FBA et marge nette" },
        { title: "Visuelles produit", description: "Fond blanc + style de vie + infographies" },
        { title: "Rédaction fiche", description: "Titre anglais, 5 points + contenu A+" },
        { title: "Optimisation mots-clés", description: "Recherche inversée ASIN et fréquence" },
      ],
    },
    es: {
      title: "Lanzamiento Producto Amazon FBA (30d)",
      description: "Investigación → ficha → publicidad, 30 días completo FBA",
      steps: [
        { title: "Investigación producto", description: "Volumen, competencia, margen" },
        { title: "Cálculo rentabilidad", description: "Estimación tarifas FBA y margen neto" },
        { title: "Diseño imágenes", description: "Fondo blanco + estilo vida + infografías" },
        { title: "Redacción ficha", description: "Título, 5 bullets + contenido A+" },
        { title: "Optimización keywords", description: "Búsqueda inversa ASIN + frecuencia" },
      ],
    },
    hi: {
      title: "Amazon FBA नया प्रोडक्ट लॉन्च (30 दिन)",
      description: "उत्पाद शोध → लिस्टिंग → विज्ञापन, 30 दिन का पूरा FBA फ्लो",
      steps: [
        { title: "प्रोडक्ट रिसर्च", description: "खोज मात्रा, प्रतिद्वंद्वी, मार्जिन विश्लेषण" },
        { title: "लाभ गणना", description: "FBA शुल्क + शुद्ध लाभ अनुमान" },
        { title: "मुख्य इमेज डिज़ाइन", description: "सफ़ेद बैकग्राउंड + लाइफस्टाइल + इन्फोग्राफ़िक" },
        { title: "लिस्टिंग कॉपीराइटिंग", description: "अंग्रेज़ी शीर्षक, 5 बुलेट + A+" },
        { title: "कीवर्ड ऑप्टिमाइज़ेशन", description: "रिवर्स ASIN + खोज आवृत्ति" },
      ],
    },
    ar: {
      title: "إطلاق منتج أمازون FBA (30 يوماً)",
      description: "من البحث إلى القائمة والإعلان، تدفق كامل FBA 30 يوماً",
      steps: [
        { title: "بحث المنتج", description: "تحليل حجم البحث والمنافسين والهامش" },
        { title: "حساب الربحية", description: "تقدير رسوم FBA وصافي الربح" },
        { title: "تصميم الصور الرئيسية", description: "خلفية بيضاء + نمط حياة + إنفوجرافيك" },
        { title: "كتابة القائمة", description: "عنوان إنجليزي، 5 نقاط + محتوى A+" },
        { title: "تحسين الكلمات المفتاحية", description: "استعلام ASIN العكسي + تكرار البحث" },
      ],
    },
  },
  'shopify-dropshipping-store': {
    zh: {
      title: "Shopify独立站Dropshipping建站",
      description: "0库存模式下从0到1搭建Shopify独立站",
      steps: [
        { title: "注册开通", description: "选主题开店" },
        { title: "选品导入", description: "速卖通商品一键导入" },
        { title: "Logo品牌视觉", description: "设计店铺Logo和Banner" },
        { title: "产品页翻译", description: "多国语言文案翻译" },
        { title: "邮件营销", description: "弃购挽回邮件流" },
      ],
    },
    en: {
      title: "Shopify Dropshipping Store Build",
      description: "0-inventory Shopify store setup with Oberlo/DSers, Klaviyo & theme config",
      steps: [
        { title: "Store Registration", description: "Pick theme & open store" },
        { title: "Import Products", description: "One-click import from AliExpress" },
        { title: "Logo & Brand Visuals", description: "Design store logo & homepage banner" },
        { title: "Translate Product Pages", description: "Multi-language copy translation" },
        { title: "Email Marketing Setup", description: "Abandoned cart recovery email flows" },
      ],
    },
    fr: {
      title: "Création Boutique Shopify Dropshipping",
      description: "Boutique 0-stock avec Oberlo/DSers, Klaviyo + thème",
      steps: [
        { title: "Ouverture boutique", description: "Choisir thème, créer magasin" },
        { title: "Import produits", description: "Import 1-clic produits AliExpress" },
        { title: "Logo + charte visuelle", description: "Logo + bannière boutique" },
        { title: "Traduction fiches produits", description: "Traductions multilingues" },
        { title: "Emails marketing", description: "Flux emails récupération panier" },
      ],
    },
    es: {
      title: "Tienda Shopify Dropshipping",
      description: "Tienda 0 inventario Oberlo/DSers, Klaviyo + tema",
      steps: [
        { title: "Apertura tienda", description: "Elegir tema, crear tienda" },
        { title: "Importar productos", description: "Import 1-clic desde AliExpress" },
        { title: "Logo + identidad", description: "Logo y banner tienda" },
        { title: "Traducción fichas", description: "Traducciones multilengua" },
        { title: "Email marketing", description: "Flujos recuperación carrito" },
      ],
    },
    hi: {
      title: "Shopify Dropshipping स्टोर बनाना",
      description: "0 इन्वेंट्री Shopify स्टोर Oberlo/DSers, Klaviyo + थीम",
      steps: [
        { title: "स्टोर रजिस्ट्रेशन", description: "थीम चुनें, स्टोर बनाएं" },
        { title: "प्रोडक्ट आयात", description: "AliExpress से 1-क्लिक आयात" },
        { title: "लोगो + ब्रांड विज़ुअल", description: "दुकान का लोगो और बैनर" },
        { title: "प्रोडक्ट पेज अनुवाद", description: "बहुभाषी कॉपी अनुवाद" },
        { title: "ईमेल मार्केटिंग", description: "कार्ट छोड़ने पर रिकवरी ईमेल" },
      ],
    },
    ar: {
      title: "إنشاء متجر شوبيفاي دروبشيبينج",
      description: "متجر 0 مخزون مع Oberlo/DSers و Klaviyo",
      steps: [
        { title: "تسجيل المتجر", description: "اختيار القالب وإنشاء المتجر" },
        { title: "استيراد المنتجات", description: "استيراد منتجات علي إكسبريس بنقرة" },
        { title: "الهوية البصرية", description: "شعار وبانر المتجر" },
        { title: "ترجمة صفحات المنتج", description: "ترجمات متعددة اللغات" },
        { title: "التسويق بالبريد", description: "استعادة سلة التسوق المهجورة" },
      ],
    },
  },
  'temu-seller-onboarding': {
    zh: {
      title: "Temu全托管入驻开店",
      description: "半托管全流程资料准备+品控合规",
      steps: [
        { title: "执照翻译公证", description: "资料PDF合并压缩" },
        { title: "商品白底图", description: "批量做800x800白底" },
        { title: "商品资料翻译", description: "中文→英文合规描述" },
        { title: "资质文件合并", description: "营业执照+身份证+商标合并" },
        { title: "图片压缩", description: "图片大小控制在2MB内" },
      ],
    },
    en: {
      title: "Temu Full-Managed Seller Onboarding",
      description: "Documents, product images & qualifications for Temu Cross-Border / Full-Managed stores",
      steps: [
        { title: "License Translation & Notarization", description: "Merge & compress qualification PDFs" },
        { title: "Product White Background Images", description: "Batch-create 800×800 clean white photos" },
        { title: "Product Info Translation", description: "Chinese → English compliant descriptions" },
        { title: "Qualification File Merge", description: "Merge license, ID & trademark files" },
        { title: "Image Compression", description: "Keep all images under 2MB" },
      ],
    },
    fr: {
      title: "Inscription Vendeur Temu",
      description: "Documents, photos, qualifications Temu Full-Managed",
      steps: [
        { title: "Traduction + légalisation", description: "Fusionner et compresser PDF diplômes" },
        { title: "Photos fond blanc", description: "Créer 800x800 photos fonds blanc" },
        { title: "Traduction fiches", description: "CN → EN descriptifs conformes" },
        { title: "Fusion documents", description: "Licence + ID + marque fusion PDF" },
        { title: "Compression images", description: "Toutes <2MB" },
      ],
    },
    es: {
      title: "Alta Vendedor Temu",
      description: "Documentos, fotos, cualificaciones Temu Full-Managed",
      steps: [
        { title: "Traducción + legalización", description: "Fusionar y comprimir PDF licencias" },
        { title: "Fotos fondo blanco", description: "Lote 800x800 fotos limpias" },
        { title: "Traducción fichas", description: "CN → EN descripciones conformes" },
        { title: "Fusionar documentos", description: "Licencia + DNI + marca PDF" },
        { title: "Compresión imágenes", description: "Todas <2MB" },
      ],
    },
    hi: {
      title: "Temu Full-Managed सेलर ऑनबोर्डिंग",
      description: "दस्तावेज़, तस्वीरें, योग्यता फ़ाइलें Temu के लिए",
      steps: [
        { title: "लाइसेंस अनुवाद", description: "PDF दस्तावेज़ संयुक्त + संकुचित" },
        { title: "सफ़ेद बैकग्राउंड इमेज", description: "800×800 सफ़ेद तस्वीरें बनाएं" },
        { title: "उत्पाद विवरण अनुवाद", description: "चीनी → अंग्रेज़ी विवरण" },
        { title: "योग्यता फ़ाइलें विलय", description: "लाइसेंस + आईडी + ट्रेडमार्क मिलाएं" },
        { title: "इमेज संपीड़न", description: "सभी इमेज <2MB" },
      ],
    },
    ar: {
      title: "التسجيل كبائع تمو كامل الإدارة",
      description: "مستندات وصور ومؤهلات تمو",
      steps: [
        { title: "ترجمة وتوثيق الوثائق", description: "دمج وضغط ملفات PDF للوثائق" },
        { title: "صور خلفية بيضاء", description: "إنشاء صور 800x800 بيضاء" },
        { title: "ترجمة القوائم", description: "الصينية → الإنجليزية لوصف المنتجات" },
        { title: "دمج ملفات الأهلية", description: "الترخيص + الهوية + العلامة PDF" },
        { title: "ضغط الصور", description: "جميع الصور <2MB" },
      ],
    },
  },
  'ali-express-product-optimize': {
    zh: {
      title: "速卖通爆品搜索优化",
      description: "标题+主图+详情页SEO全链路优化",
      steps: [
        { title: "关键词挖掘", description: "抓取平台热搜长尾词" },
        { title: "主图AB测试素材", description: "3套不同卖点主图" },
        { title: "英文标题优化", description: "埋关键词≤128字符" },
        { title: "多语言详情页", description: "俄/西/法/葡4语翻译" },
        { title: "图片压缩", description: "首屏加载提速30%" },
      ],
    },
    en: {
      title: "AliExpress Bestseller SEO Optimize",
      description: "Title / main image / detail page SEO chain to boost AliExpress ranking",
      steps: [
        { title: "Keyword Mining", description: "Harvest platform hot long-tail keywords" },
        { title: "Main Image A/B Test Assets", description: "Create 3 distinct selling-point image sets" },
        { title: "English Title Optimization", description: "Embed keywords within ≤128 characters" },
        { title: "Multi-language Detail Pages", description: "RU / ES / FR / PT 4-language translation" },
        { title: "Image Compression", description: "Cut first-paint load time by 30%" },
      ],
    },
    fr: {
      title: "SEO Best-seller AliExpress",
      description: "Titre / image / fiche SEO pour AliExpress",
      steps: [
        { title: "Exploitation mots-clés", description: "Mots clés longue traîne plateforme" },
        { title: "Visuels tests A/B", description: "3 sets visuels angles distincts" },
        { title: "Optimisation titre EN", description: "Mots-clés ≤128 caractères" },
        { title: "Fiches multilingues", description: "RU / ES / FR / PT 4 langues" },
        { title: "Compression images", description: "-30% 1er affichage" },
      ],
    },
    es: {
      title: "SEO Bestseller AliExpress",
      description: "Título / imagen / ficha SEO AliExpress",
      steps: [
        { title: "Minería keywords", description: "Palabras larga cola plataforma" },
        { title: "Assets test A/B", description: "3 sets ángulos venta distintos" },
        { title: "Optim título EN", description: "Palabras clave ≤128 caracteres" },
        { title: "Fichas multilingüe", description: "RU / ES / FR / PT 4 idiomas" },
        { title: "Compresión imágenes", description: "-30% primera carga" },
      ],
    },
    hi: {
      title: "AliExpress बेस्टसेलर SEO ऑप्ट",
      description: "शीर्षक / मुख्य इमेज / विवरण SEO AliExpress के लिए",
      steps: [
        { title: "कीवर्ड खनन", description: "प्लेटफॉर्म लंबी पूंछ कीवर्ड" },
        { title: "A/B मुख्य इमेज", description: "3 अलग एंगल इमेज सेट" },
        { title: "अंग्रेज़ी शीर्षक", description: "≤128 अक्षर कीवर्ड भरे" },
        { title: "बहुभाषी पेज", description: "RU / ES / FR / PT 4 भाषाएँ" },
        { title: "इमेज संपीड़न", description: "पहला पेंट -30% तेज़" },
      ],
    },
    ar: {
      title: "تحسين سيو بائع أفضل مبيعات علي إكسبريس",
      description: "عنوان + صورة رئيسية + وصف سيو",
      steps: [
        { title: "تعدين الكلمات المفتاحية", description: "كلمات طويلة الذيل الخاصة بالمنصة" },
        { title: "اختبار A/B للصور الرئيسية", description: "3 مجموعات زوايا عرض مختلفة" },
        { title: "تحسين العنوان بالإنجليزية", description: "≤128 حرفاً كلمات مفتاحية" },
        { title: "صفحات متعددة اللغات", description: "الروسية / الإسبانية / الفرنسية / البرتغالية" },
        { title: "ضغط الصور", description: "أسرع بنسبة 30% للعرض الأول" },
      ],
    },
  },
  'tiktok-shop-us-entry': {
    zh: {
      title: "TikTok Shop美区开店入驻",
      description: "美区本土店/跨境店资质+类目审核全流程",
      steps: [
        { title: "资质PDF翻译", description: "营业执照/EIN/地址证明翻译公证" },
        { title: "品牌主页装修", description: "头像Banner品牌故事" },
        { title: "英文商家自我介绍", description: "品牌故事+售后政策文案" },
        { title: "客服模板", description: "10条常用回复英西双语" },
        { title: "商品首图5张", description: "5张按TikTok Shop规范800×800" },
      ],
    },
    en: {
      title: "TikTok Shop US Seller Entry",
      description: "US Cross-Border / Domestic TikTok Shop registration + category audit complete flow",
      steps: [
        { title: "Qualification PDF Translation", description: "License/EIN/address proof translated & notarized" },
        { title: "Brand Profile Makeover", description: "Avatar, banner & brand story assets" },
        { title: "English Seller Bio", description: "Brand story + after-sales policy copy" },
        { title: "Customer Service Templates", description: "10 common replies in English & Spanish" },
        { title: "5 Product Hero Images", description: "5 compliant 800×800 TikTok Shop images" },
      ],
    },
    fr: {
      title: "Ouverture TikTok Shop US",
      description: "Inscription boutique US + audit catégories complet",
      steps: [
        { title: "Traduction justificatifs", description: "Licence/EIN/adresse traduits & légalisés" },
        { title: "Habillage profil", description: "Avatar + bannière + story" },
        { title: "Bio vendeur EN", description: "Histoire marque + politique SAV" },
        { title: "Modèles SAV", description: "10 réponses EN/ES standard" },
        { title: "5 visuels produits", description: "5 images 800×800 conformes" },
      ],
    },
    es: {
      title: "Apertura TikTok Shop EE.UU.",
      description: "Registro tienda US + auditoría categorías completo",
      steps: [
        { title: "Traducción certificados", description: "Licencia/EIN/domicilio traducidos" },
        { title: "Branding perfil", description: "Avatar + banner + marca" },
        { title: "Bio vendedor EN", description: "Historia marca + política SAC" },
        { title: "Plantillas SAC", description: "10 respuestas EN/ES típicas" },
        { title: "5 imágenes producto", description: "5 fotos 800×800 conformes" },
      ],
    },
    hi: {
      title: "TikTok Shop अमेरिका खोलना",
      description: "US क्रॉस-बॉर्डर / घरेलू टिकटॉक शॉप + श्रेणी ऑडिट",
      steps: [
        { title: "योग्यता अनुवाद", description: "लाइसेंस/EIN/पत्ता अनुवादित" },
        { title: "ब्रांड प्रोफ़ाइल", description: "अवतार + बैनर + कहानी" },
        { title: "अंग्रेज़ी विक्रेता बायो", description: "ब्रांड कहानी + रिटर्न पॉलिसी" },
        { title: "ग्राहक सेवा टेम्पलेट", description: "10 आम जवाब EN/ES" },
        { title: "5 मुख्य इमेज", description: "5 800×800 TikTok शॉप इमेज" },
      ],
    },
    ar: {
      title: "فتح تيك توك شوب الولايات المتحدة",
      description: "US عبر الحدود / المحلي + تدقيق الفئات",
      steps: [
        { title: "ترجمة المستندات", description: "الترخيص/EIN/العنوان مترجمة ومصدقة" },
        { title: "الملف الشخصي للعلامة", description: "الصورة الرمزية + البانر + القصة" },
        { title: "نبذة البائع بالإنجليزية", description: "قصة العلامة + سياسة الإرجاع" },
        { title: "قوالب خدمة العملاء", description: "10 ردود نمطية EN/ES" },
        { title: "5 صور رئيسية للمنتج", description: "5 صور 800×800 تيك توك شوب" },
      ],
    },
  },
  'shein-supplier-onboard': {
    zh: {
      title: "SHEIN供应商入驻SOP",
      description: "模式一/模式二提报资料+样品+验厂准备",
      steps: [
        { title: "营业执照合并", description: "三证合一PDF合成" },
        { title: "样品拍图修图", description: "6张角度图+细节图" },
        { title: "工厂介绍PPT", description: "英文工厂能力介绍" },
        { title: "验厂资料翻译", description: "社会责任文件英翻" },
        { title: "报价单盖章签名", description: "Excel转PDF加水印" },
      ],
    },
    en: {
      title: "SHEIN Supplier Onboarding SOP",
      description: "Mode-1/Mode-2 submission, sample send, factory audit preparation package",
      steps: [
        { title: "Business License Merge", description: "3-into-1 PDF of business certificates" },
        { title: "Sample Photoshoot & Retouch", description: "6 angle + detail shots per SKU" },
        { title: "Factory Capability Deck", description: "English factory capability PPT" },
        { title: "Audit Document Translation", description: "Social compliance docs into English" },
        { title: "Stamp & Sign Quotation", description: "Excel → PDF quote with watermark & signature" },
      ],
    },
    fr: {
      title: "Onboarding Fournisseur SHEIN",
      description: "Dossier Mode-1/Mode-2 + échantillons + audit usine",
      steps: [
        { title: "Fusion Kbis", description: "Fusionner 3 certificats en 1 PDF" },
        { title: "Photos échantillons", description: "6 vues + détails par SKU" },
        { title: "Présentation usine", description: "PPT anglais capacités usine" },
        { title: "Traduction audit", description: "Documents sociaux → anglais" },
        { title: "Devis signé", description: "Excel → PDF signé & filigrane" },
      ],
    },
    es: {
      title: "Onboarding Proveedor SHEIN",
      description: "Dossier Modo-1/Modo-2 + muestras + auditoría fábrica",
      steps: [
        { title: "Fusionar licencia", description: "3 certificados → 1 PDF" },
        { title: "Fotos muestras", description: "6 ángulos + detalle SKU" },
        { title: "Deck fábrica", description: "PPT inglés capacidades fábrica" },
        { title: "Traducción auditoría", description: "Documentos sociales → inglés" },
        { title: "Presupuesto sellado", description: "Excel → PDF sello + firma" },
      ],
    },
    hi: {
      title: "SHEIN सप्लायर ऑनबोर्डिंग",
      description: "मोड-1/मोड-2 सबमिशन + नमूना + फैक्ट्री ऑडिट",
      steps: [
        { title: "बिज़नेस लाइसेंस विलय", description: "3 सर्टिफ़िकेट → 1 PDF" },
        { title: "नमूना फोटोशूट", description: "6 कोण + विवरण SKU प्रति" },
        { title: "फैक्ट्री क्षमता PPT", description: "अंग्रेज़ी फैक्ट्री प्रेजेंटेशन" },
        { title: "ऑडिट दस्तावेज़ अनुवाद", description: "सामाजिक दस्तावेज़ → अंग्रेज़ी" },
        { title: "हस्ताक्षरित कोट", description: "Excel → PDF, सील + वॉटरमार्क" },
      ],
    },
    ar: {
      title: "انضمام موردي شين",
      description: "تقديم نمط 1/2 + عينات + تدقيق المصنع",
      steps: [
        { title: "دمج تراخيص الأعمال", description: "3 شهادات → ملف PDF واحد" },
        { title: "جلسة تصوير للعينات", description: "6 زوايا + تفاصيل لكل SKU" },
        { title: "عرض تقديري لقدرات المصنع PPT", description: "عرض تقديمي بالإنجليزية" },
        { title: "ترجمة وثائق التدقيق", description: "وثائق اجتماعية → الإنجليزية" },
        { title: "عروض أسعار موقعة ومختومة", description: "Excel → PDF مع ختم" },
      ],
    },
  },
  'facebook-ads-product-test': {
    zh: {
      title: "Facebook CBO测品5步法",
      description: "广告素材+受众+预算完整测品框架",
      steps: [
        { title: "选品打分", description: "确认品有30%以上毛利" },
        { title: "广告素材3版", description: "3套不同卖点视频/图" },
        { title: "英文广告文案", description: "Primary text/Headline/CTA" },
        { title: "多语受众定位", description: "4种语言人群定向说明" },
        { title: "创意组素材切割", description: "1:1 / 4:5 / 9:16 三套尺寸" },
      ],
    },
    en: {
      title: "Facebook CBO Product Testing 5-Step",
      description: "Creative + audience + budget CBO framework for 5-day winning product testing",
      steps: [
        { title: "Product Score Check", description: "Confirm 30%+ gross margin threshold" },
        { title: "3 Ad Creative Versions", description: "3 distinct angle video/image ad sets" },
        { title: "English Ad Copy", description: "Primary text / Headline / CTA" },
        { title: "Multilingual Audience Notes", description: "4-language audience targeting notes" },
        { title: "Creative Size Cropping", description: "1:1 / 4:5 / 9:16 3 size sets" },
      ],
    },
    fr: {
      title: "Test Produit Facebook CBO 5 étapes",
      description: "Créatif + audience + budget CBO 5 jours",
      steps: [
        { title: "Score produit", description: "Marge brute mini 30% vérifiée" },
        { title: "3 versions créatifs", description: "3 sets visuels/vidéo angles différents" },
        { title: "Copies publicitaires", description: "Texte principal / Titre / CTA" },
        { title: "Notes audiences", description: "4 langues audience ciblées" },
        { title: "Découpe formats", description: "1:1 / 4:5 / 9:16 3 packs" },
      ],
    },
    es: {
      title: "Test Producto Facebook CBO 5 pasos",
      description: "Creativo + audiencia + presupuesto CBO 5 días",
      steps: [
        { title: "Score producto", description: "Margen bruto ≥30% confirmado" },
        { title: "3 versiones creativos", description: "3 sets video/imagen ángulos" },
        { title: "Copias anuncios", description: "Texto principal / Título / CTA" },
        { title: "Notas audiencias", description: "4 idiomas audiencias objetivo" },
        { title: "Corte formatos", description: "1:1 / 4:5 / 9:16 3 packs" },
      ],
    },
    hi: {
      title: "Facebook CBO प्रोडक्ट टेस्ट 5 स्टेप",
      description: "क्रिएटिव + दर्शक + बजट CBO 5 दिन",
      steps: [
        { title: "प्रोडक्ट स्कोर", description: "30%+ ग्रॉस मार्जिन पुष्टि" },
        { title: "3 क्रिएटिव संस्करण", description: "3 अलग एंगल वीडियो/इमेज" },
        { title: "विज्ञापन कॉपी", description: "प्राइमरी टेक्स्ट / हेडलाइन / CTA" },
        { title: "दर्शक नोट्स", description: "4 भाषाएँ लक्षित दर्शक" },
        { title: "साइज़ कट", description: "1:1 / 4:5 / 9:16 3 पैक" },
      ],
    },
    ar: {
      title: "اختبار منتج فيسبوك CBO بخطوات",
      description: "إبداعي + جمهور + ميزانية CBO 5 أيام",
      steps: [
        { title: "درجة المنتج", description: "هامش إجمالي 30%+ مؤكد" },
        { title: "3 إصدارات إبداعية", description: "3 مجموعات فيديو/صور بزوايا مختلفة" },
        { title: "نص الإعلان", description: "النص الأساسي / العنوان / CTA" },
        { title: "ملاحظات الجمهور", description: "4 لغات للجمهور المستهدف" },
        { title: "قص المقاسات", description: "1:1 / 4:5 / 9:16 3 مجموعات" },
      ],
    },
  },
  'google-shopping-merchant': {
    zh: {
      title: "Google Merchant Center购物广告开通",
      description: "Feed申诉+免税审核完整链路",
      steps: [
        { title: "退货政策整理PDF", description: "隐私/退货/运费政策3页合并" },
        { title: "英文隐私政策", description: "Shopify独立站用隐私模板" },
        { title: "隐私翻译4语", description: "英法西葡4语" },
        { title: "产品页合规图", description: "添加联系方式+地址合规截图" },
        { title: "申诉文件签名", description: "申诉PDF电子签名" },
      ],
    },
    en: {
      title: "Google Merchant Center Shopping Ads Open",
      description: "Feed submission, tax exemption, Misrepresentation appeal full checklist",
      steps: [
        { title: "Return Policy PDF Pack", description: "Privacy / Return / Shipping 3 policies merged" },
        { title: "English Privacy Policy", description: "Privacy policy template for Shopify stores" },
        { title: "4-Language Policy Versions", description: "EN/FR/ES/PT policy translations" },
        { title: "Compliance Screenshots", description: "Contact info & address proof snapshots" },
        { title: "Appeal E-Signature", description: "Signed appeal PDF submission" },
      ],
    },
    fr: {
      title: "Ouverture Google Merchant Center",
      description: "Soumission feed, exonération fiscale, recours complet",
      steps: [
        { title: "PDF politique retours", description: "Confidentialité / Retours / Livraison fusionnés" },
        { title: "Politique confidentialité", description: "Modèle Shopify anglais" },
        { title: "4 langues politiques", description: "EN/FR/ES/PT traductions" },
        { title: "Captures conformité", description: "Coordonnées & adresse preuves" },
        { title: "Signature recours", description: "PDF signé soumission recours" },
      ],
    },
    es: {
      title: "Apertura Google Merchant Center",
      description: "Feed, exención fiscal, recurso completo rechazo",
      steps: [
        { title: "PDF política devoluciones", description: "Privacidad / Devolución / Envío fusionados" },
        { title: "Política privacidad", description: "Plantilla Shopify inglesa" },
        { title: "4 idiomas políticas", description: "EN/FR/ES/PT traducciones" },
        { title: "Capturas conformidad", description: "Contacto + domicilio pruebas" },
        { title: "Firma recurso", description: "PDF firmado presentación recurso" },
      ],
    },
    hi: {
      title: "Google Merchant Center खोलना",
      description: "फ़ीड, कर छूट, गलत प्रतिनिधित्व अपील पूर्ण चेकलिस्ट",
      steps: [
        { title: "रिटर्न पॉलिसी PDF", description: "गोपनीयता / वापसी / शिपिंग विलय" },
        { title: "अंग्रेज़ी प्राइवेसी", description: "Shopify प्राइवेसी टेम्पलेट" },
        { title: "4 भाषा नीतियाँ", description: "EN/FR/ES/PT अनुवाद" },
        { title: "कंप्लायंस स्क्रीनशॉट", description: "संपर्क + पत्ता सबूत" },
        { title: "अपील ई-सिग्नेचर", description: "हस्ताक्षरित अपील PDF" },
      ],
    },
    ar: {
      title: "فتح مركز جوجل ميرشانت",
      description: "الخلاصة + الإعفاء الضريبي + الاستئناف الكامل",
      steps: [
        { title: "ملف PDF لسياسة الإرجاع", description: "الخصوصية / الإرجاع / الشحن مدمجة" },
        { title: "سياسة الخصوصية بالإنجليزية", description: "قالب سياسة خصوصية شوبيفاي" },
        { title: "4 سياسات لغوية", description: "ترجمات EN/FR/ES/PT" },
        { title: "لقطات شاشة الامتثال", description: "اتصال + دليل على العنوان" },
        { title: "توقيع الاستئناف الإلكتروني", description: "ملف استئناف موقع إلكترونياً" },
      ],
    },
  },
  'shopify-klaviyo-email-setup': {
    zh: {
      title: "Klaviyo邮件营销7大自动化流",
      description: "弃购/欢迎/POSTPURCHASE等邮件流配置",
      steps: [
        { title: "注册开通集成", description: "API连Shopify数据同步" },
        { title: "邮件文案框架", description: "6个自动化流英文文案" },
        { title: "邮件Banner", description: "节日/新品Banner图" },
        { title: "4语邮件模板", description: "法语西语葡语德语" },
        { title: "素材压缩", description: "邮件图片≤500KB" },
      ],
    },
    en: {
      title: "Klaviyo 7 Automation Email Flows",
      description: "Abandoned cart / Welcome / Post-purchase / Browse abandonment flows config",
      steps: [
        { title: "Klaviyo Integration", description: "API connect Shopify data sync" },
        { title: "Email Copy Framework", description: "6 automation flows English copy" },
        { title: "Email Banners", description: "Holiday / new-product email banners" },
        { title: "4-Language Email Templates", description: "FR / ES / PT / DE email templates" },
        { title: "Asset Compression", description: "Keep email images ≤500KB" },
      ],
    },
    fr: {
      title: "7 flux emails automatisés Klaviyo",
      description: "Panier abandonné / Bienvenue / Post-achat / Navigation",
      steps: [
        { title: "Intégration Klaviyo", description: "API connexion synchronisation Shopify" },
        { title: "Structure copies emails", description: "6 automatisations copies EN" },
        { title: "Bannières emails", description: "Fêtes / nouveautés bannières" },
        { title: "4 langues emails", description: "FR / ES / PT / DE modèles" },
        { title: "Compression assets", description: "Images <500KB" },
      ],
    },
    es: {
      title: "7 flujos email automáticos Klaviyo",
      description: "Carrito abandonado / Bienvenida / Post-venta / Navegación",
      steps: [
        { title: "Integración Klaviyo", description: "API sincronización Shopify" },
        { title: "Esquema copias", description: "6 automatizaciones copias EN" },
        { title: "Banners email", description: "Festivos / novedades banners" },
        { title: "4 idiomas emails", description: "FR / ES / PT / DE plantillas" },
        { title: "Compresión assets", description: "Imágenes <500KB" },
      ],
    },
    hi: {
      title: "Klaviyo 7 ऑटोमेशन ईमेल",
      description: "कार्ट छोड़ना / स्वागत / पोस्ट-पचास / ब्राउज़",
      steps: [
        { title: "Klaviyo इंटीग्रेशन", description: "API कनेक्ट Shopify सिंक" },
        { title: "ईमेल कॉपी ढांचा", description: "6 ऑटोमेशन EN कॉपी" },
        { title: "ईमेल बैनर", description: "छुट्टियां / नए उत्पाद बैनर" },
        { title: "4 भाषा ईमेल", description: "FR / ES / PT / DE टेम्पलेट" },
        { title: "असेट संपीड़न", description: "ईमेल इमेज <500KB" },
      ],
    },
    ar: {
      title: "7 تدفقات بريد كلايفيو التلقائية",
      description: "سلة مهجورة / ترحيب / بعد البيع / تصفح",
      steps: [
        { title: "دمج كلافييو", description: "ربط API ومزامنة شوبيفاي" },
        { title: "هيكل نصوص البريد", description: "6 أتمتة نصوص بالإنجليزية" },
        { title: "بانرات البريد", description: "العطلات / منتجات جديدة بانرات" },
        { title: "4 لغات بريد إلكتروني", description: "FR / ES / PT / DE قوالب" },
        { title: "ضغط الأصول", description: "صور البريد الإلكتروني <500KB" },
      ],
    },
  },
  'amazon-ppc-optimize-routine': {
    zh: {
      title: "Amazon SP广告每周优化SOP",
      description: "否定词/竞价/Bid+预算2周ROAS翻倍",
      steps: [
        { title: "搜索词报告导出", description: "高ACoS词导出分析" },
        { title: "否定词分组", description: "品牌/类目/无关三级分组" },
        { title: "英文否定词翻译", description: "中文关键词翻英文词根" },
        { title: "ACoS利润表", description: "每日ROI看板更新" },
        { title: "周报PPT模板", description: "每周投放数据汇报" },
      ],
    },
    en: {
      title: "Amazon SP Ads Weekly Optimization SOP",
      description: "Negatives / Bid+ / Budget 2-week ROAS doubling routine",
      steps: [
        { title: "Search Term Report Export", description: "Extract high-ACoS search terms for analysis" },
        { title: "Negative Keyword Grouping", description: "Brand / Category / Irrelevant 3-tier grouping" },
        { title: "English Negative Translation", description: "Chinese → English keyword root translation" },
        { title: "ACoS Profit Dashboard", description: "Daily ROI dashboard updates" },
        { title: "Weekly Report Deck Template", description: "Weekly performance reporting PPT" },
      ],
    },
    fr: {
      title: "Optimisation hebdo SP Amazon",
      description: "Négatifs / Bid+ / Budget ROAS ×2 en 2 semaines",
      steps: [
        { title: "Export rapport termes", description: "Extraire termes à haute ACoS" },
        { title: "Groupement négatifs", description: "Marque / Catégorie / Hors-sujet 3 niveaux" },
        { title: "Traduction négatifs", description: "FR → EN racines mots clés" },
        { title: "Tableau ACoS", description: "Mise à jour ROI quotidienne" },
        { title: "Modèle rapport hebdo", description: "Performance hebdo PPT" },
      ],
    },
    es: {
      title: "Optim semanal SP Ads Amazon",
      description: "Negativas / Bid+ / Presupuesto ROAS ×2 en 2 semanas",
      steps: [
        { title: "Export términos búsqueda", description: "Extraer términos alto ACoS" },
        { title: "Agrupación negativas", description: "Marca / Categoría / Irrelevante 3 niveles" },
        { title: "Traducción negativas", description: "ES → EN raíces keywords" },
        { title: "Tablero ACoS", description: "Actualización ROI diaria" },
        { title: "Plantilla informe semanal", description: "Rendimiento semanal PPT" },
      ],
    },
    hi: {
      title: "Amazon SP Ads साप्ताहिक ऑप्ट",
      description: "नेगेटिव्स / Bid+ / बजट 2 सप्ताह ROAS दोगुना",
      steps: [
        { title: "सर्च टर्म रिपोर्ट", description: "उच्च ACoS शब्द निकालें" },
        { title: "नेगेटिव कीवर्ड ग्रुपिंग", description: "ब्रांड / श्रेणी / अप्रासंगिक 3 स्तर" },
        { title: "अंग्रेज़ी नेगेटिव अनुवाद", description: "चीनी → अंग्रेज़ी रूट" },
        { title: "ACoS लाभ डैशबोर्ड", description: "ROI दैनिक अपडेट" },
        { title: "साप्ताहिक रिपोर्ट PPT", description: "साप्ताहिक प्रदर्शन रिपोर्ट" },
      ],
    },
    ar: {
      title: "تحسين أسبوعي إعلانات أمازون SP",
      description: "السلبيات / Bid+ / الميزانية ×2 ROAS في أسبوعين",
      steps: [
        { title: "تقرير مصطلحات البحث", description: "استخراج مصطلحات عالية ACoS" },
        { title: "تجميع الكلمات السلبية", description: "علامة تجارية / فئة / غير ذات صلة 3 مستويات" },
        { title: "ترجمة السلبيات للإنجليزية", description: "الجذور الإنجليزية للكلمات المفتاحية" },
        { title: "لوحة ACoS الربحية", description: "تحديث العائد يومياً" },
        { title: "تقرير أسبوعي PPT", description: "تقرير أداء أسبوعي" },
      ],
    },
  },
  'product-photo-batch-edit': {
    zh: {
      title: "跨境产品图批处理全流程",
      description: "100张抠图+800白底图+压缩500KB",
      steps: [
        { title: "一键抠图", description: "100张背景移除" },
        { title: "800×800白底图", description: "画布尺寸+居中+JPG导出" },
        { title: "压缩500KB", description: "PNG/JPG批量压缩" },
        { title: "卖点水印", description: "主图卖点标签叠加" },
        { title: "格式统一", description: "WebP/JPG双格式" },
      ],
    },
    en: {
      title: "Bulk E-Commerce Product Photo Edit",
      description: "100 images: background removal → 800×800 white → compressed ≤500KB",
      steps: [
        { title: "One-Click Background Removal", description: "Batch remove 100 image backgrounds" },
        { title: "800×800 White Canvas", description: "Uniform canvas, center & JPG export" },
        { title: "Compress to 500KB", description: "Batch PNG / JPG compression" },
        { title: "Selling-Point Watermarks", description: "Overlay feature callout badges on hero images" },
        { title: "Format Unification", description: "Dual WebP / JPG format output" },
      ],
    },
    fr: {
      title: "Édition photos E-commerce lot",
      description: "100 photos: fond → 800×800 blanc → <500KB",
      steps: [
        { title: "Retrait fond 1-clic", description: "100 fonds retirés" },
        { title: "Canevas 800×800", description: "Centrage + export JPG" },
        { title: "Compression 500KB", description: "PNG/JPG lot" },
        { title: "Badges ventes", description: "Superpositions arguments clés" },
        { title: "Uniformisation formats", description: "Dual WebP / JPG" },
      ],
    },
    es: {
      title: "Edición fotos E-commerce lote",
      description: "100 fotos: fondo → 800×800 blanco → <500KB",
      steps: [
        { title: "Quitar fondo 1 clic", description: "100 fondos eliminados" },
        { title: "Lienzo 800×800", description: "Centrado + export JPG" },
        { title: "Comprimir 500KB", description: "PNG/JPG lote" },
        { title: "Etiquetas venta", description: "Overlay argumentos venta" },
        { title: "Uniformar formatos", description: "Doble WebP / JPG" },
      ],
    },
    hi: {
      title: "E-com प्रोडक्ट इमेज बैच एडिट",
      description: "100 इमेज: बैक → 800×800 सफ़ेद → ≤500KB",
      steps: [
        { title: "1-क्लिक बैक हटाना", description: "100 बैकग्राउंड हटाएं" },
        { title: "800×800 कैनवास", description: "केंद्र + JPG निर्यात" },
        { title: "500KB संपीड़न", description: "PNG/JPG बैच" },
        { title: "सेलिंग पॉइंट वॉटरमार्क", description: "कॉलआउट ओवरले" },
        { title: "फ़ॉर्मेट एकरूप", description: "दोहरा WebP / JPG" },
      ],
    },
    ar: {
      title: "تعديل صور التجارة الإلكترونية بالجملة",
      description: "100 صورة: خلفية → 800×800 أبيض → ≤500KB",
      steps: [
        { title: "إزالة الخلفية بنقرة واحدة", description: "إزالة 100 خلفية" },
        { title: "قماش 800×800", description: "توسيط + تصدير JPG" },
        { title: "ضغط 500KB", description: "دفعة PNG/JPG" },
        { title: "علامة مائية لنقاط البيع", description: "تراكبات التسمية التوضيحية" },
        { title: "توحيد التنسيق", description: "مزدوج WebP / JPG" },
      ],
    },
  },
  'aliexpress-aftersale-template': {
    zh: {
      title: "速卖通客服16种售后话术模板",
      description: "物流/纠纷/好评/催评5语模板库",
      steps: [
        { title: "英文售后主模板", description: "16条场景核心英文模板" },
        { title: "西/俄/葡/法4语", description: "逐条翻译保持语气专业" },
        { title: "好评卡设计", description: "包裹卡感谢卡双面PDF" },
        { title: "模板PDF合并", description: "16模板一本PDF手册" },
        { title: "模板加水印", description: "店铺Logo水印防抄袭" },
      ],
    },
    en: {
      title: "AliExpress 16 After-Sales Templates",
      description: "Logistics / Dispute / Positive review / Re-order templates in 5 languages",
      steps: [
        { title: "English Master Templates", description: "16 scenario English core templates" },
        { title: "ES / RU / PT / FR Versions", description: "Line-by-line translation in 4 languages" },
        { title: "Review Request Card Design", description: "Double-sided PDF thank-you insert card" },
        { title: "Template PDF Merge", description: "16 templates compiled into 1 handbook PDF" },
        { title: "Template Watermarking", description: "Store-logo watermark to prevent theft" },
      ],
    },
    fr: {
      title: "16 modèles SAV AliExpress",
      description: "Logistique / Litige / Avis / Relance 5 langues",
      steps: [
        { title: "Modèles maîtres EN", description: "16 scénarios modèles anglais" },
        { title: "ES / RU / PT / FR", description: "Traductions ton professionnel" },
        { title: "Carte remerciement", description: "PDF carte 2 faces imprimable" },
        { title: "Fusion PDF modèles", description: "16 modèles → 1 PDF" },
        { title: "Filigrane logo", description: "Protection anti-plagiat" },
      ],
    },
    es: {
      title: "16 plantillas SAV AliExpress",
      description: "Logística / Disputa / Reseña / Re-pedido 5 idiomas",
      steps: [
        { title: "Plantillas madre EN", description: "16 escenarios plantillas inglés" },
        { title: "ES / RU / PT / FR", description: "Tonos profesionales traducidos" },
        { title: "Tarjeta agradecimiento", description: "PDF tarjeta imprimible dúplex" },
        { title: "Fusionar PDF plantillas", description: "16 plantillas → 1 PDF" },
        { title: "Marca de agua logo", description: "Protección anti-plagio" },
      ],
    },
    hi: {
      title: "AliExpress 16 SAV टेम्पलेट",
      description: "लॉजिस्टिक / विवाद / समीक्षा / फिर से ऑर्डर 5 भाषाएँ",
      steps: [
        { title: "अंग्रेज़ी मास्टर", description: "16 परिदृश्य मुख्य टेम्पलेट" },
        { title: "ES / RU / PT / FR", description: "पंक्तियों का पेशेवर अनुवाद" },
        { title: "रिव्यू कार्ड डिज़ाइन", description: "दो तरफ़ा धन्यवाद कार्ड PDF" },
        { title: "टेम्पलेट PDF विलय", description: "16 टेम्पलेट → 1 PDF" },
        { title: "लोगो वॉटरमार्क", description: "चोरी से बचाव" },
      ],
    },
    ar: {
      title: "16 قوالب دعم ما بعد البيع علي إكسبريس",
      description: "لوجستيات / نزاعات / مراجعات / إعادة الطلب 5 لغات",
      steps: [
        { title: "الرئيسية بالإنجليزية", description: "16 سيناريو قالب رئيسي" },
        { title: "ES / RU / PT / FR", description: "ترجمات احترافية للخطوط" },
        { title: "تصميم بطاقة مراجعة", description: "ملف مزدوج بطاقة شكر PDF" },
        { title: "دمج قوالب PDF", description: "16 قالب → 1 ملف PDF" },
        { title: "علامة مائية للشعار", description: "الحماية من السرقة" },
      ],
    },
  },
  'etsy-digital-product-publish': {
    zh: {
      title: "Etsy数字产品发布SEO",
      description: "可打印/数字下载品关键词+13张主图",
      steps: [
        { title: "关键词挖掘", description: "Etsy搜索量+竞争度查询" },
        { title: "10款数字产品", description: "Planner/WallArt/Checklist" },
        { title: "Listing英文文案", description: "Title/13Tags/Description模板" },
        { title: "Mockup图压缩", description: "≤1MB Etsy上传要求" },
        { title: "数字包打包PDF", description: "PDF加页加密码" },
      ],
    },
    en: {
      title: "Etsy Digital Product Launch & SEO",
      description: "Printable / downloadable listings SEO: titles, 13 tags, mockups, description",
      steps: [
        { title: "Keyword Research", description: "Etsy search volume + competition queries" },
        { title: "10 Digital Products", description: "Build planners, wall art, checklists" },
        { title: "English Listing Copy", description: "Title / 13 tags / description template" },
        { title: "Mockup Compression", description: "Keep Etsy-ready files under 1MB" },
        { title: "Digital Bundle PDF", description: "Password-protected deliverable PDF bundle" },
      ],
    },
    fr: {
      title: "Lancement produit numérique Etsy SEO",
      description: "Titres, 13 tags, maquettes et description imprimables",
      steps: [
        { title: "Mots-clés Etsy", description: "Volume + concurrence recherche" },
        { title: "10 produits numériques", description: "Planners, WallArt, Checklists" },
        { title: "Copies fiches EN", description: "Titre/13 tags/descriptions" },
        { title: "Compression maquettes", description: "≤1MB prêts Etsy" },
        { title: "Pack PDF produit", description: "Pages + mot de passe PDF" },
      ],
    },
    es: {
      title: "Lanzamiento Producto digital Etsy SEO",
      description: "Títulos, 13 tags, maquetas imprimibles y descripción",
      steps: [
        { title: "Keywords Etsy", description: "Volumen + competencia análisis" },
        { title: "10 productos digitales", description: "Planners, WallArt, Checklists" },
        { title: "Copias listings EN", description: "Título/13 tags/descripción" },
        { title: "Compresión maquetas", description: "≤1MB listos Etsy" },
        { title: "Pack PDF producto", description: "Páginas + contraseña PDF" },
      ],
    },
    hi: {
      title: "Etsy डिजिटल प्रोडक्ट लॉन्च SEO",
      description: "प्रिंट करने योग्य / डाउनलोड योग्य शीर्षक, 13 टैग, मॉकअप",
      steps: [
        { title: "Etsy कीवर्ड खोज", description: "खोज मात्रा + प्रतिस्पर्धा" },
        { title: "10 डिजिटल प्रोडक्ट", description: "Planner, WallArt, Checklists" },
        { title: "अंग्रेज़ी लिस्टिंग कॉपी", description: "शीर्षक / 13 टैग / विवरण" },
        { title: "मॉकअप संपीड़न", description: "≤1MB Etsy तैयार" },
        { title: "डिजिटल बंडल PDF", description: "पेज + पासवर्ड PDF" },
      ],
    },
    ar: {
      title: "إطلاق منتج رقمي إيتسي سيو",
      description: "قابل للطباعة / قابلة للتنزيل عنوان, 13 علامة, محاكاة",
      steps: [
        { title: "بحث كلمات مفتاحية إيتسي", description: "حجم البحث + تحليل المنافسين" },
        { title: "10 منتجات رقمية", description: "Planner, WallArt, Checklists" },
        { title: "نصوص قوائم الإنجليزية", description: "العنوان / 13 علامة / الوصف" },
        { title: "ضغط المحاكاة", description: "≤1MB جاهز لإيتسي" },
        { title: "الحزمة الرقمية PDF", description: "الصفحات + كلمة مرور PDF" },
      ],
    },
  },
  'shopify-app-10-install': {
    zh: {
      title: "Shopify新店必装10插件配置",
      description: "评论SEO促销弹窗ERP集成10件套",
      steps: [
        { title: "邮件营销", description: "弃购挽回自动化" },
        { title: "照片评论", description: "批量导入亚马逊评价" },
        { title: "隐私政策合并", description: "各插件要求的隐私条款" },
        { title: "弹窗素材", description: "弹窗15%优惠图" },
        { title: "弹窗4语翻译", description: "英法西葡4语" },
      ],
    },
    en: {
      title: "Shopify 10 Must-Have Apps Install",
      description: "Reviews / SEO / Popups / Email / ERP 10-app new-store stack config",
      steps: [
        { title: "Email Marketing Setup", description: "Abandoned cart automation activation" },
        { title: "Photo Review Importer", description: "Bulk Amazon review import (Loox)" },
        { title: "Privacy Policy Merge", description: "Consolidate app-required privacy clauses" },
        { title: "Popup Creative Assets", description: "15%-off popup banner creative" },
        { title: "4-Language Popups", description: "FR/ES/PT language popup translations" },
      ],
    },
    fr: {
      title: "Installation 10 apps Shopify",
      description: "Avis / SEO / Popups / Email / ERP 10 apps",
      steps: [
        { title: "Email marketing", description: "Récupération panier activée" },
        { title: "Avis photo", description: "Import avis Amazon (Loox)" },
        { title: "Fusion confidentialité", description: "Clause apps fusionnées" },
        { title: "Visuels popup", description: "-15% popup bannière" },
        { title: "4 langues popup", description: "FR/EN/ES/PT traducciones" },
      ],
    },
    es: {
      title: "Instalar 10 apps Shopify",
      description: "Reseñas / SEO / Popups / Email / ERP 10 apps",
      steps: [
        { title: "Email marketing", description: "Recuperación carrito activada" },
        { title: "Reseñas foto", description: "Importar reseñas Amazon (Loox)" },
        { title: "Fusionar privacidad", description: "Cláusulas apps fusionadas" },
        { title: "Assets popup", description: "Popup 15% descuento banner" },
        { title: "4 idiomas popup", description: "FR/EN/ES/PT traducciones" },
      ],
    },
    hi: {
      title: "Shopify 10 ज़रूरी ऐप्स",
      description: "समीक्षाएँ / SEO / पॉपअप / ईमेल / ERP 10 ऐप्स",
      steps: [
        { title: "ईमेल मार्केटिंग", description: "कार्ट रिकवरी ऑटो" },
        { title: "फोटो समीक्षाएँ", description: "Amazon से आयात (Loox)" },
        { title: "प्राइवेसी पॉलिसी विलय", description: "ऐप्स आवश्यक क्लॉज़ विलय" },
        { title: "पॉपअप क्रिएटिव", description: "15% छूट बैनर" },
        { title: "4 भाषा पॉपअप", description: "FR/EN/ES/PT अनुवाद" },
      ],
    },
    ar: {
      title: "تثبيت 10 تطبيقات ضرورية لشوبيفاي",
      description: "المراجعات / سيو / النوافذ المنبثقة / البريد / ERP 10 تطبيقات",
      steps: [
        { title: "التسويق بالبريد الإلكتروني", description: "استعادة سلة التسوق التلقائية" },
        { title: "مراجعات الصور", description: "الاستيراد من أمازون (Loox)" },
        { title: "دمج سياسة الخصوصية", description: "دمج البنود المطلوبة للتطبيقات" },
        { title: "الإبداعي المنبثق", description: "بانر خصم 15%" },
        { title: "4 لغات النوافذ المنبثقة", description: "ترجمات FR/EN/ES/PT" },
      ],
    },
  },
  'cross-border-logistics-cost-calc': {
    zh: {
      title: "跨境物流成本核价工作流",
      description: "货代报价+重量段+税费准确报价",
      steps: [
        { title: "货代报价单编码", description: "敏感报价加密存证" },
        { title: "重量体积计算器", description: "体积重/实重对比计费" },
        { title: "商业发票PDF", description: "商业发票模板PDF盖章" },
        { title: "清关文件翻译", description: "报关单中→英" },
        { title: "英文报价邮件", description: "报价邮件专业模板" },
      ],
    },
    en: {
      title: "Cross-Border Logistics Cost Calculator",
      description: "Freight forwarder quote sheet + weight tiers + duties accurate quoting workflow",
      steps: [
        { title: "Freight Quote Encoding", description: "Encrypt sensitive commercial quotes" },
        { title: "Weight & Volume Calculator", description: "Volumetric vs actual weight comparison billing" },
        { title: "Commercial Invoice PDF", description: "Stamped commercial invoice PDF template" },
        { title: "Customs Docs Translation", description: "Chinese → English customs declaration" },
        { title: "English Quotation Email", description: "Professional quotation email template" },
      ],
    },
    fr: {
      title: "Calculateur coûts logistiques",
      description: "Devis + tranches poids + droits douane",
      steps: [
        { title: "Encodage devis", description: "Devis sensibles cryptés" },
        { title: "Poids / volume", description: "Poids volumétrique vs réel" },
        { title: "Facture commerciale", description: "PDF modèle facture tamponnée" },
        { title: "Traduction douanes", description: "CN → EN déclaration" },
        { title: "Email devis EN", description: "Modèle email devis pro" },
      ],
    },
    es: {
      title: "Calculadora costes logísticos",
      description: "Presupuesto + tramos peso + derechos aduaneros",
      steps: [
        { title: "Codificar presupuesto", description: "Cotizaciones sensibles cifradas" },
        { title: "Peso / volumen", description: "Volumétrico vs real cobro" },
        { title: "Factura comercial", description: "PDF plantilla factura sellada" },
        { title: "Traducción aduanas", description: "CN → EN declaración" },
        { title: "Email cotización EN", description: "Plantilla email pro presupuesto" },
      ],
    },
    hi: {
      title: "क्रॉस-बॉर्डर लॉजिस्टिक्स लागत",
      description: "फ्रेट फॉरवर्डर कोट + वेट + शुल्क सटीक कोट",
      steps: [
        { title: "फ्रेट कोट एन्कोडिंग", description: "संवेदनशील बोली एन्क्रिप्ट" },
        { title: "वेट वॉल्यूम कैलकुलेटर", description: "वॉल्यूमेट्रिक बनाम वास्तविक वजन" },
        { title: "वाणिज्यिक चालान PDF", description: "सील वाला टेम्पलेट PDF" },
        { title: "कस्टम्स दस्तावेज़ अनुवाद", description: "चीनी → अंग्रेज़ी कस्टम्स" },
        { title: "अंग्रेज़ी कोट ईमेल", description: "पेशेवर ईमेल कोट" },
      ],
    },
    ar: {
      title: "حاسبة تكاليف اللوجستيات عبر الحدود",
      description: "عرض سعر شاحن + وزن + رسوم عرض سعر دقيق",
      steps: [
        { title: "ترميز عرض سعر الشحن", description: "تشفير عروض الأسعار الحساسة" },
        { title: "حاسبة حجم الوزن", description: "الحجمي مقابل الوزن الفعلي" },
        { title: "ملف PDF للفاتورة التجارية", description: "قالب PDF مختوم" },
        { title: "ترجمة وثائق الجمارك", description: "الصينية → الإنجليزية للجمارك" },
        { title: "عرض سعر البريد الإلكتروني بالإنجليزية", description: "عرض سعر بريد إلكتروني احترافي" },
      ],
    },
  },
  'amazon-brand-registry': {
    zh: {
      title: "Amazon品牌备案2.0流程",
      description: "R标+带TM标+备案成功+A+开通",
      steps: [
        { title: "商标证书PDF合成", description: "商标证+营业执照合成" },
        { title: "品牌官网截图", description: "制作.com店铺截图" },
        { title: "品牌官网About us", description: "品牌故事英文文案" },
        { title: "资料签名盖章", description: "品牌授权书" },
        { title: "品牌手册", description: "Logo规范PPT" },
      ],
    },
    en: {
      title: "Amazon Brand Registry 2.0 Full Process",
      description: "R/TM mark, official website, brand approval + A+ + Transparency activation",
      steps: [
        { title: "Trademark Certificate PDF Merge", description: "Combine TM & business license PDF" },
        { title: "Official Website Snapshot", description: "Create .com store presence screenshots" },
        { title: "Brand About Us Page", description: "English brand story website copy" },
        { title: "Sign & Stamp Documents", description: "Execute brand authorization letter" },
        { title: "Brand Guidelines Deck", description: "Logo & brand standards PPT" },
      ],
    },
    fr: {
      title: "Brand Registry Amazon 2.0",
      description: "Marque R/TM, site web, approbation + A+ + Transparency",
      steps: [
        { title: "Fusion certificats", description: "Marque + Kbis fusion PDF" },
        { title: "Captures site web", description: "Présence .com captures" },
        { title: "A propos site", description: "Histoire marque anglais" },
        { title: "Signature documents", description: "Courrier d’autorisation signé" },
        { title: "Livret de marque", description: "PPT règles logo / usage" },
      ],
    },
    es: {
      title: "Brand Registry Amazon 2.0",
      description: "Marca R/TM, web, aprobación + A+ + Transparency",
      steps: [
        { title: "Fusionar certificados", description: "Marca + licencia PDF" },
        { title: "Capturas web oficial", description: "Presencia .com pantallazos" },
        { title: "About us web", description: "Historia marca inglés" },
        { title: "Firmar documentos", description: "Carta autorización firmada" },
        { title: "Manual marca", description: "PPT logo / normas marca" },
      ],
    },
    hi: {
      title: "Amazon ब्रांड रजिस्ट्री 2.0",
      description: "R/TM मार्क, वेबसाइट, मंज़ूरी + A+ + ट्रांसपेरेंसी",
      steps: [
        { title: "ट्रेडमार्क सर्ट. विलय", description: "ट्रेडमार्क + लाइसेंस PDF" },
        { title: "ऑफिशियल वेब स्क्रीनशॉट्स", description: ".com मौजूदगी स्क्रीनशॉट" },
        { title: "ब्रांड कहानी About Us", description: "अंग्रेज़ी ब्रांड कहानी" },
        { title: "दस्तावेज़ हस्ताक्षर", description: "ब्रांड अनुमति पत्र" },
        { title: "ब्रांड गाइडलाइन PPT", description: "लोगो / ब्रांड मानक" },
      ],
    },
    ar: {
      title: "تسجيل العلامة التجارية أمازون 2.0",
      description: "العلامة التجارية R/TM، موقع ويب، الموافقة + A+ + الشفافية",
      steps: [
        { title: "دمج شهادات العلامة التجارية", description: "علامة تجارية + ترخيص PDF" },
        { title: "لقطات شاشة الموقع الرسمي", description: "وجود .com لقطات شاشة" },
        { title: "قصة العلامة عنا", description: "قصة العلامة بالإنجليزية" },
        { title: "توقيع الوثائق", description: "رسالة تفويض العلامة التجارية" },
        { title: "عرض تقديمي لإرشادات العلامة", description: "الشعار / معايير العلامة التجارية" },
      ],
    },
  },
  'tiktok-creative-script-7day': {
    zh: {
      title: "TikTok爆款7天脚本矩阵",
      description: "UGC口播+混剪+7款不同脚本批量跑",
      steps: [
        { title: "7套脚本框架", description: "15秒爆款脚本英文台词" },
        { title: "字幕卡片", description: "卖点弹出式字幕PNG" },
        { title: "台词母语化", description: "英文母语化表达校对" },
        { title: "封面16:9裁切", description: "9:16 封面高清" },
        { title: "产品透明图", description: "视频开头产品大特写" },
      ],
    },
    en: {
      title: "TikTok 7-Day Viral Script Matrix",
      description: "7 UGC talking-head scripts + B-roll batch filming schedule",
      steps: [
        { title: "7 Script Frameworks", description: "7 15-second English talking scripts" },
        { title: "Subtitle Cards", description: "Popup call-to-action PNG subtitle layers" },
        { title: "English Dialogue Polish", description: "Native English natural expression pass" },
        { title: "9:16 Cover Crop", description: "Crisp 9:16 thumbnail covers" },
        { title: "Product Transparent PNG", description: "Foreground product cutout for opening" },
      ],
    },
    fr: {
      title: "Matrice 7 jours scripts TikTok",
      description: "7 UGC face caméra + plan B-roll lot",
      steps: [
        { title: "7 structures", description: "7 scripts 15s anglais" },
        { title: "Cartes sous-titres", description: "PNG sous-titres arguments" },
        { title: "Anglais naturalisé", description: "Révision ton oral naturel" },
        { title: "Rogner 9:16", description: "Miniature 9:16 nette" },
        { title: "PNG produit transparent", description: "Produit 1er plan cutout" },
      ],
    },
    es: {
      title: "Matriz 7 días scripts TikTok",
      description: "7 UGC cara + B-roll rodaje lote",
      steps: [
        { title: "7 guiones", description: "7 de 15s inglés" },
        { title: "Tarjetas subtítulos", description: "PNG overlay subtítulos" },
        { title: "Inglés natural", description: "Revisión tono oral" },
        { title: "Recorte 9:16", description: "Miniatura 9:16 nítida" },
        { title: "Producto PNG transparente", description: "Primer plano producto cutout" },
      ],
    },
    hi: {
      title: "TikTok 7 दिन वायरल स्क्रिप्ट मैट्रिक्स",
      description: "7 UGC मुँह + B-roll शेड्यूल",
      steps: [
        { title: "7 स्क्रिप्ट फ्रेमवर्क", description: "7 15 सेकंड अंग्रेज़ी स्क्रिप्ट" },
        { title: "सबटाइटल कार्ड्स", description: "कॉलआउट PNG सबटाइटल" },
        { title: "अंग्रेज़ी नेचुरल रिविज़न", description: "मौखिक स्वाभाविक अंग्रेज़ी" },
        { title: "9:16 कवर क्रॉप", description: "9:16 स्पष्ट कवर थंबनेल" },
        { title: "प्रोडक्ट पारदर्शी PNG", description: "ओपनिंग फोरग्राउंड प्रोडक्ट कटआउट" },
      ],
    },
    ar: {
      title: "مصفوفة سكربتات تيك توك 7 أيام",
      description: "7 UGC أمامي + B-roll الجدولة الزمنية",
      steps: [
        { title: "7 أطر سيناريو", description: "7 سيناريو 15 ثانية بالإنجليزية" },
        { title: "بطاقات الترجمة", description: "ملفات PNG التسمية التوضيحية" },
        { title: "مراجعة طبيعية للإنجليزية", description: "إنجليزي شفهي طبيعي" },
        { title: "قص الغلاف 9:16", description: "غلاف مصغر 9:16 واضح" },
        { title: "صورة المنتج الشفافة PNG", description: "مقدمة المنتج الأمامي المقطوع" },
      ],
    },
  },
  'refund-and-chargeback-avoid': {
    zh: {
      title: "独立站拒付退款降低SOP",
      description: "邮箱+物流+申诉降低80%拒付率",
      steps: [
        { title: "英文售后安抚邮件", description: "36条自动回复模板" },
        { title: "已发货凭证PDF", description: "物流截图+签收证明合并" },
        { title: "法语西语邮件", description: "非英语国家客诉回复" },
        { title: "物流页面图", description: "物流查询页Banner说明" },
        { title: "申诉包PDF", description: "所有证据加签名合并" },
      ],
    },
    en: {
      title: "Refund & Chargeback Reduction SOP",
      description: "Email + logistics + evidence pack to cut chargebacks by 80%",
      steps: [
        { title: "English Post-Sales Retention Emails", description: "36 auto-reply customer-soothing templates" },
        { title: "Proof of Delivery PDF", description: "Logistics snapshots + POD consolidated" },
        { title: "FR / ES Customer Emails", description: "Non-English market ticket responses" },
        { title: "Tracking Page Banner", description: "Order tracking custom banner image" },
        { title: "Dispute Evidence Pack PDF", description: "Signed, consolidated evidence bundle" },
      ],
    },
    fr: {
      title: "Réduction Remboursements & Chargebacks",
      description: "Emails + suivi logistique + preuves -80% CB",
      steps: [
        { title: "36 modèles SAV", description: "36 réponses auto EN" },
        { title: "Preuves livraison", description: "Suivi + POD fusionnés PDF" },
        { title: "FR / ES tickets", description: "Réponses clients non anglophones" },
        { title: "Bannière suivi", description: "Bannière page suivi" },
        { title: "Dossier preuves", description: "Signé & fusionné preuves CB" },
      ],
    },
    es: {
      title: "Reducir Reembolsos & Chargebacks",
      description: "Emails + seguimiento + pruebas -80% CB",
      steps: [
        { title: "36 plantillas SAV", description: "36 respuestas auto EN" },
        { title: "Pruebas entrega", description: "Seguimiento + POD fusion PDF" },
        { title: "ES / FR tickets", description: "Respuestas mercado no inglés" },
        { title: "Banner seguimiento", description: "Banner página tracking" },
        { title: "Dossier pruebas", description: "Firmado & fusionado CB dossier" },
      ],
    },
    hi: {
      title: "रिफंड और Chargeback कम SOP",
      description: "ईमेल + लॉजिस्टिक्स + सबूत -80% CB",
      steps: [
        { title: "36 SAV अंग्रेज़ी टेम्पलेट", description: "36 स्वचालित उत्तर ईमेल" },
        { title: "डिलीवरी सबूत PDF", description: "लॉजिस्टिक स्क्रीनशॉट + POD विलय" },
        { title: "FR / ES कस्टमर ईमेल", description: "गैर-अंग्रेज़ी बाज़ार जवाब" },
        { title: "ट्रैकिंग पेज बैनर", description: "ऑर्डर ट्रैकिंग बैनर" },
        { title: "अपील सबूत पैक PDF", description: "हस्ताक्षरित एकत्रित सबूत" },
      ],
    },
    ar: {
      title: "الحد من المبالغ المستردة ومطالبات الدفع",
      description: "البريد الإلكتروني + اللوجستيات + الدليل -80% CB",
      steps: [
        { title: "36 قالب بريد إلكتروني للدعم بالإنجليزية", description: "36 رد بريد إلكتروني تلقائي" },
        { title: "ملف PDF دليل التسليم", description: "لقطات شاشة اللوجستيات + إثبات التسليم المدمج" },
        { title: "بريد العملاء FR / ES", description: "ردود السوق غير الإنجليزية" },
        { title: "بانر صفحة التتبع", description: "بانر تتبع الطلب" },
        { title: "حزمة دليل الاستئناف PDF", description: "الدليل مجمع وموقع" },
      ],
    },
  },
  'amazon-vine-review-seed': {
    zh: {
      title: "Amazon Vine种子评论计划",
      description: "0评价新品启动Vine+折扣换评合规",
      steps: [
        { title: "竞品评论分析", description: "TOP5差评点提炼卖点" },
        { title: "英文插页文案", description: "产品插页感谢卡说明" },
        { title: "感谢卡设计", description: "双面感谢卡PDF打印" },
        { title: "5A主图优化", description: "评论反馈到主图优化" },
        { title: "卡片压缩", description: "≤1MB可发邮件给Vine员" },
      ],
    },
    en: {
      title: "Amazon Vine Seed Reviews Launch",
      description: "Zero-review product Vine enrollment + inserts + compliant review extraction",
      steps: [
        { title: "Competitive Review Analysis", description: "TOP-5 competitor 1-star pain point distillation" },
        { title: "English Insert Copy", description: "Product thank-you card insert verbiage" },
        { title: "Thank-You Card Design", description: "Printable double-sided card PDF" },
        { title: "5A Main Image Optimize", description: "Iterate main images from review feedback" },
        { title: "Card Size Compression", description: "1MB max Vine-email ready file size" },
      ],
    },
    fr: {
      title: "Programme Vine Avis Amazon",
      description: "0 avis → Vine + cartes + extraction conforme",
      steps: [
        { title: "Analyse avis concurrence", description: "5 pires arguments TOP-5" },
        { title: "Copies carte insert", description: "Texte carte remerciement" },
        { title: "Carte impression", description: "PDF 2 faces prête imprimerie" },
        { title: "Optim 5A visuels", description: "Itérations via retours avis" },
        { title: "Taille email Vine", description: "≤1MB email aux Vineurs" },
      ],
    },
    es: {
      title: "Programa Vine Reseñas Amazon",
      description: "0 reseñas → Vine + tarjetas + extracción conforme",
      steps: [
        { title: "Análisis competencia", description: "TOP-5 puntos peores reviews" },
        { title: "Copias tarjeta insert", description: "Texto tarjeta agradecimiento" },
        { title: "Tarjeta imprenta", description: "PDF 2 caras imprenta" },
        { title: "Optim 5A imágenes", description: "Iteraciones feedback reseñas" },
        { title: "Tamaño email Vine", description: "≤1MB emails Vineurs" },
      ],
    },
    hi: {
      title: "Amazon वाइन सीड रिव्यू",
      description: "0 रिव्यू → वाइन + कार्ड + अनुपालन निष्कर्षण",
      steps: [
        { title: "प्रतिद्वंद्वी समीक्षा विश्लेषण", description: "TOP-5 नकारात्मक बिंदु" },
        { title: "इंसर्ट कार्ड अंग्रेज़ी", description: "धन्यवाद कार्ड संदेश" },
        { title: "थैंकयू कार्ड प्रिंट", description: "दो तरफ़ा मुद्रण योग्य PDF" },
        { title: "5A इमेज ऑप्ट", description: "रिव्यू फीडबैक से इटरेशन" },
        { title: "वाइन ईमेल साइज़", description: "≤1MB वाइनर के लिए तैयार" },
      ],
    },
    ar: {
      title: "برنامج فين للتقييمات البذرية أمازون",
      description: "0 تقييم → فين + بطاقة + استخراج الامتثال",
      steps: [
        { title: "تحليل مراجعات المنافسين", description: "أعلى 5 نقاط سلبية" },
        { title: "الإنجليزية لبطاقة الإدراج", description: "رسالة بطاقة الشكر" },
        { title: "طباعة بطاقة الشكر", description: "ملف مزدوج قابل للطباعة PDF" },
        { title: "تحسين الصور 5A", description: "التكرارات من ملاحظات المراجعات" },
        { title: "حجم بريد فين الإلكتروني", description: "≤1MB جاهز لـ Vineurs" },
      ],
    },
  },
  'etsy-seller-tags-seo': {
    zh: {
      title: "Etsy Listing标签SEO标题写满",
      description: "13Tags+Title埋词+Etsy排名上升10%",
      steps: [
        { title: "长尾词推荐", description: "13个精准Tags导出" },
        { title: "Title满140字符", description: "包含主词+属性+场景" },
        { title: "英文母语化", description: "Title读起来自然" },
        { title: "首图视频首帧", description: "首帧高点击高清封面" },
        { title: "竞品导出PDF", description: "TOP10竞品词频分析PDF" },
      ],
    },
    en: {
      title: "Etsy Seller Tags & Title SEO Fill",
      description: "13 Etsy Tags + 140-char fully-optimized title for +10% listing lift",
      steps: [
        { title: "Long-tail Tag Export", description: "13 precision Etsy tag suggestions" },
        { title: "140-Char Complete Title", description: "Include head keyword + attributes + use case" },
        { title: "English Natural Flow", description: "Read like a native, not a keyword list" },
        { title: "First-Frame Video Cover", description: "High-CTR first-frame thumbnail still" },
        { title: "Competitive Analysis PDF", description: "TOP-10 competitor keyword frequency PDF" },
      ],
    },
    fr: {
      title: "SEO tags + titre Etsy",
      description: "13 tags + 140 caractères optimisés +10%",
      steps: [
        { title: "Tags longue traîne", description: "Export 13 tags pertinents" },
        { title: "Titre 140 car.", description: "Mot principal + attributs + usage" },
        { title: "Anglais naturel", description: "Titre naturel humain" },
        { title: "Miniature vidéo", description: "1ère image cliquable" },
        { title: "Analyse concurrence PDF", description: "TOP-10 fréquence mots" },
      ],
    },
    es: {
      title: "SEO tags + título Etsy",
      description: "13 tags + 140 caracteres optim +10%",
      steps: [
        { title: "Tags larga cola", description: "Export 13 tags precisos" },
        { title: "Título 140 car.", description: "Mot principal + atributos + uso" },
        { title: "Inglés natural", description: "Título natural humano" },
        { title: "Primer frame video", description: "Click-through primera imagen" },
        { title: "Competencia PDF", description: "TOP-10 frecuencia palabra PDF" },
      ],
    },
    hi: {
      title: "Etsy 13 टैग + टाइटल SEO",
      description: "13 Etsy टैग + 140 अक्षर पूर्ण +10%",
      steps: [
        { title: "लॉन्ग-टेल टैग", description: "13 सटीक टैग निर्यात" },
        { title: "140-चर टाइटल", description: "मुख्य शब्द + विशेषताएँ + उपयोग" },
        { title: "अंग्रेज़ी नेचुरल", description: "मानव पठनीय शीर्षक" },
        { title: "पहला फ्रेम वीडियो कवर", description: "उच्च CTR थंबनेल स्टिल" },
        { title: "प्रतिस्पर्धी विश्लेषण PDF", description: "TOP-10 शब्द आवृत्ति PDF" },
      ],
    },
    ar: {
      title: "تحسين العلامات والعنوان إيتسي",
      description: "13 علامة إيتسي + 140 حرفاً كاملاً +10%",
      steps: [
        { title: "علامات الطويل الذيل", description: "تصدير 13 علامة دقيقة" },
        { title: "عنوان 140 حرفاً", description: "الكلمة الأساسية + السمات + الاستخدام" },
        { title: "إنجليزي طبيعي", description: "عنوان يمكن قراءته بواسطة الإنسان" },
        { title: "غلاف الإطار الأول للفيديو", description: "لقطات مصغرة عالية CTR" },
        { title: "ملف PDF تحليل المنافسين", description: "أعلى 10 ترددات كلمات PDF" },
      ],
    },
  },
  'shopify-pixel-capi-track': {
    zh: {
      title: "Meta Pixel+CAPI事件双追踪",
      description: "iOS17追踪率从25%拉到70%",
      steps: [
        { title: "Token编码", description: "访问Token本地加密存" },
        { title: "事件英文注释", description: "Purchase/AddToCart命名" },
        { title: "漏斗流程图", description: "事件埋点清单图" },
        { title: "审计PDF", description: "上线前测试结果汇总" },
        { title: "埋点文档翻译", description: "技术文档中译英" },
      ],
    },
    en: {
      title: "Shopify Meta Pixel + CAPI Dual Track",
      description: "iOS17 tracking recovery: Browser Pixel + Conversion API server-side events",
      steps: [
        { title: "Token Encoding", description: "Encrypt API access token at rest" },
        { title: "English Event Annotations", description: "Purchase / AddToCart event naming" },
        { title: "Funnel Flow Diagram", description: "Event instrumentation checklist diagram" },
        { title: "Audit PDF", description: "Pre-launch QA test results summary" },
        { title: "Instrumentation Docs Translation", description: "Tech doc CN → EN translation" },
      ],
    },
    fr: {
      title: "Suivi Pixel Meta + CAPI",
      description: "Récupération iOS17: Pixel + API conversions",
      steps: [
        { title: "Encodage Token", description: "Token API crypté local" },
        { title: "Événements EN", description: "Purchase / AddToCart nommage" },
        { title: "Schéma entonnoir", description: "Plan instrumentation diag" },
        { title: "PDF audit", description: "Tests pré-lancement bilan" },
        { title: "Traduction technique", description: "Tech doc CN → EN" },
      ],
    },
    es: {
      title: "Seguimiento Pixel Meta + CAPI",
      description: "Recuperación iOS17: Pixel + API conversiones",
      steps: [
        { title: "Codificar Token", description: "Token API cifrado almacén" },
        { title: "Eventos EN", description: "Purchase / AddToCart nombres" },
        { title: "Esquema embudo", description: "Mapa de instrumentación" },
        { title: "PDF auditoría", description: "QA pre-lanzamiento resumen" },
        { title: "Traducción técnica", description: "Tech doc CN → EN" },
      ],
    },
    hi: {
      title: "Meta Pixel + CAPI डुअल ट्रैक",
      description: "iOS17 रिकवरी: ब्राउज़र पिक्सेल + सर्वर CAPI",
      steps: [
        { title: "टोकन एन्कोडिंग", description: "API एक्सेस टोकन एन्क्रिप्ट" },
        { title: "Event नामकरण EN", description: "Purchase / AddToCart नाम" },
        { title: "फ़नल डायग्राम", description: "इंस्ट्रूमेंटेशन चेकलिस्ट" },
        { title: "ऑडिट PDF", description: "प्री-लॉन्च QA परिणाम" },
        { title: "तकनीकी दस्तावेज़ अनुवाद", description: "तकनीकी दस्तावेज़ CN → EN" },
      ],
    },
    ar: {
      title: "تتبع مزدوج ميتا بكسل و CAPI",
      description: "استعادة iOS17: بكسل المتصفح + خادم CAPI",
      steps: [
        { title: "ترميز الرمز المميز", description: "تشفير رمز الوصول إلى API" },
        { title: "تسمية الحدث بالإنجليزية", description: "Purchase / AddToCart الأسماء" },
        { title: "مخطط القمع", description: "قائمة مراجعة الأجهزة" },
        { title: "ملف PDF للتدقيق", description: "نتائج مراقبة الجودة قبل الإطلاق" },
        { title: "ترجمة الوثائق الفنية", description: "الوثائق الفنية CN → EN" },
      ],
    },
  },
  'amazon-a-plus-page-design': {
    zh: {
      title: "Amazon A+品牌故事6模块设计",
      description: "6模块A+图1920宽EBC页面",
      steps: [
        { title: "英文6模块文案", description: "品牌/对比/使用/FAQ/售后/场景" },
        { title: "A+6张图", description: "每张1920×600规范" },
        { title: "图注文字改英文", description: "母语化自然表达" },
        { title: "压缩≤3MB", description: "A+图片提交要求" },
        { title: "6图打包PDF", description: "设计稿+文案一起存档" },
      ],
    },
    en: {
      title: "Amazon A+ Brand Story 6-Module Design",
      description: "6-module 1920-wide EBC A+ content images + copy production",
      steps: [
        { title: "6-Module English Copy", description: "Brand / Compare / Usage / FAQ / Support / Scene copy" },
        { title: "6 A+ Artwork Panels", description: "Each 1920×600 compliant images" },
        { title: "English Caption Naturalisation", description: "Native caption copy pass" },
        { title: "3MB Compression", description: "Amazon A+ image size compliance" },
        { title: "6-Panel Pack PDF", description: "Design assets + copy consolidated archive" },
      ],
    },
    fr: {
      title: "Design 6 modules A+ Amazon",
      description: "6 modules EBC 1920 large + copies",
      steps: [
        { title: "Copies 6 modules", description: "Marque / Compare / Usage / FAQ / SAV / Scène" },
        { title: "6 visuels A+", description: "Chacun 1920×600 norme" },
        { title: "Légendes naturelles", description: "Anglais naturel sous-images" },
        { title: "Compression 3MB", description: "Taille acceptée Amazon" },
        { title: "Pack PDF 6 planches", description: "Fusion assets + copies" },
      ],
    },
    es: {
      title: "Diseño 6 módulos A+ Amazon",
      description: "6 módulos EBC 1920 ancho + copias",
      steps: [
        { title: "Copias 6 módulos", description: "Marca / Compara / Uso / FAQ / SAC / Escena" },
        { title: "6 imágenes A+", description: "Cada 1920×600 norma" },
        { title: "Leyendas naturales", description: "Inglés natural pies fotos" },
        { title: "Comprimir 3MB", description: "Tamaño aceptado Amazon" },
        { title: "Pack PDF 6 láminas", description: "Assets + copias fusion" },
      ],
    },
    hi: {
      title: "Amazon A+ ब्रांड स्टोरी 6 मॉड्यूल",
      description: "6-मॉड्यूल EBC 1920 चौड़ाई इमेज + कॉपी",
      steps: [
        { title: "6 मॉड्यूल कॉपी EN", description: "ब्रांड / Compare / उपयोग / FAQ / SAC / सीन" },
        { title: "6 A+ आर्टवर्क", description: "हरेक 1920×600 संगत" },
        { title: "इंग्लिश कैप्शन नेचुरल", description: "मूल रूप से पढ़ने योग्य" },
        { title: "3MB संपीड़न", description: "Amazon A+ साइज़ कंप्लायंस" },
        { title: "6-पैनल पैक PDF", description: "डिज़ाइन + कॉपी एकत्रित" },
      ],
    },
    ar: {
      title: "تصميم 6 وحدات قصة العلامة Amazon A+",
      description: "وحدات EBC 6 العرض 1920 الصور + النص",
      steps: [
        { title: "6 وحدات نص EN", description: "علامة تجارية / مقارنة / الاستخدام / الأسئلة الشائعة / الخدمات اللوجستية / المشهد" },
        { title: "6 أعمال فنية A+", description: "كل واحد 1920×600 متوافق" },
        { title: "تسمية توضيحية إنجليزية طبيعية", description: "قابلة للقراءة بشكل أصلي" },
        { title: "ضغط 3MB", description: "حجم الامتثال Amazon A+" },
        { title: "ملف PDF للحزمة المكونة من 6 لوحات", description: "التصميم + النص مجمع" },
      ],
    },
  },
  'temu-quality-compliance-photo': {
    zh: {
      title: "Temu质检拍照38张合规指南",
      description: "多角度+包装+材质+克重图",
      steps: [
        { title: "800×800裁切", description: "所有图片统一尺寸" },
        { title: "背景纯净", description: "抠白底或实景灰底" },
        { title: "单张≤500KB", description: "JPG压缩Temu可上传" },
        { title: "拼图长图", description: "6张拼一张传质检" },
        { title: "质检报告PDF", description: "图片+规格表合成PDF报" },
      ],
    },
    en: {
      title: "Temu QC 38-Photo Compliance Guide",
      description: "Multi-angle / packshot / material / weight 38-photo submission template",
      steps: [
        { title: "800×800 Crop", description: "All photos uniform dimensions" },
        { title: "Clean Background", description: "Cutout white or neutral grey studio background" },
        { title: "≤500KB Per Shot", description: "JPG compression Temu-upload ready" },
        { title: "6-Image Collage", description: "Merge 6 photos into one long collage" },
        { title: "QC Report PDF", description: "Photos + specification sheet consolidated report" },
      ],
    },
    fr: {
      title: "Guide 38 photos QC Temu",
      description: "Multi-angle / emballage / matière / poids 38 clichés",
      steps: [
        { title: "Rogner 800×800", description: "Uniforme dimensions" },
        { title: "Fond neutre", description: "Détourage gris/blanc studio" },
        { title: "<500KB unité", description: "JPG prêt Temu" },
        { title: "Collage 6 photos", description: "Longue image 6-en-1" },
        { title: "Rapport QC PDF", description: "Photos + spécification rapport" },
      ],
    },
    es: {
      title: "Guía 38 fotos QC Temu",
      description: "Multiangular / empaque / material / peso 38 fotos",
      steps: [
        { title: "Cortar 800×800", description: "Dimensiones uniforme" },
        { title: "Fondo neutro", description: "Recorte gris/blanco estudio" },
        { title: "<500KB cada", description: "JPG listo Temu" },
        { title: "Collage 6 fotos", description: "Foto larga 6-en-1" },
        { title: "Informe QC PDF", description: "Fotos + especificación informe" },
      ],
    },
    hi: {
      title: "Temu QC 38-फोटो गाइड",
      description: "बहु-कोण / पैक / सामग्री / वजन 38 तस्वीरें",
      steps: [
        { title: "800×800 क्रॉप", description: "सभी इमेज एक समान" },
        { title: "क्लीन बैकग्राउंड", description: "कटआउट सफ़ेद या स्टूडियो ग्रे" },
        { title: "≤500KB प्रति इमेज", description: "JPG Temu-तैयार" },
        { title: "6-इमेज कोलाज", description: "छह-में-एक लंबी कोलाज" },
        { title: "QC रिपोर्ट PDF", description: "तस्वीरें + विनिर्देश रिपोर्ट" },
      ],
    },
    ar: {
      title: "دليل 38 صورة مراقبة الجودة تمو",
      description: "متعدد الزوايا / العبوات / المادة / الوزن 38 صورة",
      steps: [
        { title: "قص 800×800", description: "جميع الصور الموحدة" },
        { title: "خلفية نظيفة", description: "مقطوعة أبيض أو رمادي الاستوديو" },
        { title: "≤500KB لكل صورة", description: "JPG جاهز لـ Temu" },
        { title: "كولاج 6 صور", description: "كولاج طويل ستة في واحد" },
        { title: "ملف PDF لتقرير مراقبة الجودة", description: "الصور + تقرير المواصفات" },
      ],
    },
  },
  'shopify-local-pickup-setup': {
    zh: {
      title: "Shopify本地自提+BOPIS配置",
      description: "线上下单线下自提节省运费",
      steps: [
        { title: "门店海报", description: "取货点指引双面海报" },
        { title: "邮件/短信自提文案", description: "英/西两语" },
        { title: "自提提醒4语", description: "英法西葡4语" },
        { title: "门店清单PDF", description: "地址+营业时间+电话" },
        { title: "取货码编码", description: "自提验证码加密存" },
      ],
    },
    en: {
      title: "Shopify BOPIS Local Pickup Setup",
      description: "Buy online, pickup in-store configuration for Shopify POS + inventory",
      steps: [
        { title: "Storefront Posters", description: "Double-sided pickup signage artwork" },
        { title: "Email / SMS Pickup Copy", description: "Bilingual EN / ES pickup copy" },
        { title: "4-Language Pickup Reminders", description: "FR / EN / ES / PT reminder emails" },
        { title: "Location Directory PDF", description: "Addresses / hours / phone numbers sheet" },
        { title: "Pickup Code Encoding", description: "Encrypt pickup verification codes stored" },
      ],
    },
    fr: {
      title: "Configuration Click & Collect Shopify",
      description: "Achat web + retrait magasin POS Shopify",
      steps: [
        { title: "Affiches magasins", description: "Signalétique 2 faces retrait" },
        { title: "SMS/email retrait", description: "Bilingue FR/EN" },
        { title: "4 langues rappels", description: "FR/EN/ES/PT emails" },
        { title: "PDF fiches magasins", description: "Adresse / horaires / téléphone" },
        { title: "Encodage retraits", description: "Codes vérif encryptés" },
      ],
    },
    es: {
      title: "Click & Collect Shopify BOPIS",
      description: "Compra online + recogida tienda Shopify POS",
      steps: [
        { title: "Carteles tiendas", description: "Señalética 2 caras recogida" },
        { title: "SMS/email recogida", description: "Bilingüe FR/EN" },
        { title: "4 idiomas recordatorios", description: "FR/EN/ES/PT emails" },
        { title: "PDF tiendas", description: "Dirección / horarios / teléfono" },
        { title: "Codificar códigos", description: "Códigos verificación cifrados" },
      ],
    },
    hi: {
      title: "Shopify BOPIS लोकल पिकअप",
      description: "ऑनलाइन खरीद + स्टोर पिकअप Shopify POS",
      steps: [
        { title: "स्टोर पोस्टर्स", description: "दो तरफ़ा साइनेज पोस्टर" },
        { title: "ईमेल / SMS पिकअप कॉपी", description: "द्विभाषी EN/ES" },
        { title: "4 भाषा अनुस्मारक", description: "FR/EN/ES/PT ईमेल" },
        { title: "स्थान निर्देश PDF", description: "पता / घंटे / फ़ोन" },
        { title: "पिकअप कोड एन्कोडिंग", description: "सत्यापन कोड एन्क्रिप्ट" },
      ],
    },
    ar: {
      title: "ضبط الاستلام المحلي شوبيفاي",
      description: "الشراء عبر الإنترنت + الاستلام في المتجر Shopify POS",
      steps: [
        { title: "ملصقات المتاجر", description: "ملصقات إشارية مزدوجة" },
        { title: "نص البريد الإلكتروني / الرسائل القصيرة للاستلام", description: "ثنائي اللغة EN/ES" },
        { title: "4 لغات للتذكير", description: "بريد إلكتروني FR/EN/ES/PT" },
        { title: "ملف PDF اتجاهات الموقع", description: "العنوان / الساعات / الهاتف" },
        { title: "ترميز رمز الاستلام", description: "تشفير رمز التحقق" },
      ],
    },
  },
  'amazon-ukca-ce-label': {
    zh: {
      title: "亚马逊UKCA/CE合规标签做图",
      description: "欧盟英国合规贴标外箱标图稿",
      steps: [
        { title: "英文合规文案", description: "警告语+品牌+型号+产地" },
        { title: "50×30外箱贴", description: "矢量高清CMYK可打印" },
        { title: "产品小吊牌", description: "对折卡吊牌设计稿" },
        { title: "多语警告语", description: "英法德西意5语警告" },
        { title: "打印稿PDF", description: "拼A4一版10个" },
      ],
    },
    en: {
      title: "Amazon UKCA & CE Label Artwork",
      description: "EU / UK compliance product label + carton label print-ready artwork",
      steps: [
        { title: "English Compliance Verbiage", description: "Warning text + brand + model + origin" },
        { title: "50×30 Carton Label", description: "CMYK print-ready carton label" },
        { title: "Product Hangtag", description: "Folded-card swing tag artwork" },
        { title: "Multi-language Warnings", description: "EN/FR/DE/ES/IT 5-language warnings" },
        { title: "A4 Print Sheet PDF", description: "Nest 10-up on A4 for print run" },
      ],
    },
    fr: {
      title: "Étiquettes UKCA/CE Amazon",
      description: "UE / Royaume-Uni produit + carton prêt imprimerie",
      steps: [
        { title: "Mentions légales EN", description: "Avertissements + marque + modèle + origine" },
        { title: "Étiquette carton 50×30", description: "CMYK vectorielle imprimable" },
        { title: "Étiquette suspendue", description: "Carte pliante modèle" },
        { title: "Avertissements multilingues", description: "EN/FR/DE/ES/IT 5 langues" },
        { title: "Planche A4 PDF", description: "10-up sur planche A4" },
      ],
    },
    es: {
      title: "Etiquetas UKCA/CE Amazon",
      description: "UE / RU etiquetas producto + caja listas imprenta",
      steps: [
        { title: "Texto legal EN", description: "Advertencias + marca + modelo + origen" },
        { title: "Etiqueta caja 50×30", description: "CMYK vectorial imprenta" },
        { title: "Etiqueta colgante", description: "Tarjeta doblada modelo" },
        { title: "Avisos multilingües", description: "EN/FR/DE/ES/IT 5 idiomas" },
        { title: "Plancha A4 PDF", description: "10-up plancha A4" },
      ],
    },
    hi: {
      title: "Amazon UKCA/CE लेबल आर्टवर्क",
      description: "यूरोपीय संघ / ब्रिटेन उत्पाद + बॉक्स लेबल मुद्रण-योग्य",
      steps: [
        { title: "अंग्रेज़ी कंप्लायंस टेक्स्ट", description: "चेतावनी + ब्रांड + मॉडल + मूल" },
        { title: "50×30 बॉक्स लेबल", description: "CMYK वेक्टर मुद्रण-योग्य" },
        { title: "प्रोडक्ट हैंगटैग", description: "फोल्ड कार्ड स्विंग टैग" },
        { title: "बहुभाषी चेतावनियाँ", description: "EN/FR/DE/ES/IT 5 भाषाएँ" },
        { title: "A4 शीट PDF", description: "A4 शीट 10-अप प्रिंट" },
      ],
    },
    ar: {
      title: "عمل ملصقات UKCA/CE أمازون",
      description: "الاتحاد الأوروبي / بريطانيا المنتج + ملصقات الصندوق قابلة للطباعة",
      steps: [
        { title: "نص الامتثال بالإنجليزية", description: "التحذيرات + العلامة التجارية + الموديل + الأصل" },
        { title: "ملصق صندوق 50×30", description: "CMYK متجه قابل للطباعة" },
        { title: "ملصق معلقة المنتج", description: "بطاقة مطوية ملصق متأرجح" },
        { title: "تحذيرات متعددة اللغات", description: "EN/FR/DE/ES/IT 5 لغات" },
        { title: "ملف PDF لورقة A4", description: "طباعة 10 نسخ على ورقة A4" },
      ],
    },
  },
  'facebook-pixel-audience-test': {
    zh: {
      title: "FB受众分层AB测试工作流",
      description: "冷受众/再营销/LLA同时跑找赢家",
      steps: [
        { title: "AB版广告文案", description: "同一素材两版不同文案" },
        { title: "素材版AB", description: "3套不同创意" },
        { title: "英语语法校对", description: "文案母语化润色" },
        { title: "不同尺寸切割", description: "Feed/Reels/Stories三套" },
        { title: "测试矩阵PDF", description: "20组矩阵存档PDF" },
      ],
    },
    en: {
      title: "FB Audience Split A/B Testing Workflow",
      description: "Cold / Retargeting / LLA simultaneous run to find winning audience",
      steps: [
        { title: "A/B Ad Copy Variants", description: "Same creative, 2 distinct copy angles" },
        { title: "Creative A/B 3 Sets", description: "3 distinct creative treatments" },
        { title: "English Grammar Polish", description: "Native-level grammatical polish" },
        { title: "Multi-Size Cropping", description: "Feed / Reels / Stories 3 size packs" },
        { title: "Test Matrix PDF", description: "20-cell experiment archive PDF" },
      ],
    },
    fr: {
      title: "Test A/B Audiences Facebook",
      description: "Froids / Remarketing / LLA parallèle",
      steps: [
        { title: "Copies A/B", description: "Même créatif, 2 copies angles" },
        { title: "3 traitements visuels", description: "3 traitements créatifs distincts" },
        { title: "Révision grammaire", description: "Anglais naturel niveau natif" },
        { title: "Découpe multi-format", description: "Feed / Reels / Stories 3 packs" },
        { title: "PDF matrice tests", description: "20 cellules expérimentales archive" },
      ],
    },
    es: {
      title: "Test A/B Audiencias Facebook",
      description: "Fríos / Remarketing / LLA paralelo",
      steps: [
        { title: "Copias A/B", description: "Mismo creativo, 2 ángulos" },
        { title: "3 tratamientos creativos", description: "3 tratamientos distintos" },
        { title: "Revisión gramática", description: "Inglés nivel nativo" },
        { title: "Corte multi-formatos", description: "Feed / Reels / Stories 3" },
        { title: "PDF matriz test", description: "20 celdas experimental archivo" },
      ],
    },
    hi: {
      title: "FB दर्शक A/B टेस्ट",
      description: "कोल्ड / रीटार्गेटिंग / LLA समानांतर चलाना",
      steps: [
        { title: "A/B कॉपी", description: "एक ही क्रिएटिव, 2 एंगल कॉपी" },
        { title: "3 क्रिएटिव वेरिएंट", description: "3 अलग दृश्य उपचार" },
        { title: "अंग्रेज़ी व्याकरण जाँच", description: "स्वाभाविक अंग्रेज़ी" },
        { title: "बहु-फ़ॉर्मेट क्रॉप", description: "फ़ीड / रील्स / स्टोरीज़ 3 साइज़" },
        { title: "टेस्ट मैट्रिक्स PDF", description: "20 सेल प्रयोगात्मक अभिलेख" },
      ],
    },
    ar: {
      title: "اختبار أ/ب لجماهير فيسبوك",
      description: "تشغيل كولد / إعادة الاستهداف / LLA بالتوازي",
      steps: [
        { title: "نص أ/ب", description: "نفس الإبداعي، زاويتان للنص" },
        { title: "3 متغيرات إبداعية", description: "3 معالجات بصرية مختلفة" },
        { title: "فحص قواعد اللغة الإنجليزية", description: "إنجليزي طبيعي" },
        { title: "قص متعدد التنسيقات", description: "خلاصة / بوبات / قصص 3 أحجام" },
        { title: "ملف PDF لمصفوفة الاختبار", description: "سجل تجريبي من 20 خلية" },
      ],
    },
  },
  'shopify-theme-mobile-speed': {
    zh: {
      title: "Shopify移动端速度优化",
      description: "GTMetrix分数从F→B 40分提升",
      steps: [
        { title: "首屏图压缩", description: "首图WebP 100KB以内" },
        { title: "格式转WebP", description: "全站PNG→WebP" },
        { title: "速度报告PDF", description: "GTMetrix优化前后对比" },
        { title: "首屏Hero图尺寸", description: "桌面/移动不同尺寸裁剪" },
        { title: "CSS图标编码", description: "小图标Base64减少HTTP" },
      ],
    },
    en: {
      title: "Shopify Mobile Theme Speed Optimization",
      description: "GTMetrix lift from Grade F → B, 40-point mobile speed improvement",
      steps: [
        { title: "Hero Image Compression", description: "WebP first-screen image ≤100KB" },
        { title: "Convert to WebP", description: "Site-wide PNG → WebP conversion" },
        { title: "Speed Report PDF", description: "GTMetrix before vs after comparison deck" },
        { title: "Responsive Hero Crops", description: "Separate desktop / mobile hero crops" },
        { title: "CSS Icon Encoding", description: "Small sprite icons Base64 to save HTTP requests" },
      ],
    },
    fr: {
      title: "Optim Vitesse Mobile Shopify",
      description: "GTMetrix F → B, +40 points mobile",
      steps: [
        { title: "Compression Hero", description: "WebP image 1ère <100KB" },
        { title: "Conversion WebP", description: "PNG → WebP site entier" },
        { title: "PDF bilan vitesse", description: "GTMetrix avant/après" },
        { title: "Hero responsives", description: "Rogner Desktop/Mobile distincts" },
        { title: "Icones CSS", description: "Petits sprites Base64 économie HTTP" },
      ],
    },
    es: {
      title: "Optim Velocidad Móvil Shopify",
      description: "GTMetrix F → B, +40 puntos mobile",
      steps: [
        { title: "Comprimir Hero", description: "WebP primer pantalla <100KB" },
        { title: "Conversión WebP", description: "PNG → WebP sitio entero" },
        { title: "PDF informe", description: "GTMetrix antes/después" },
        { title: "Hero responsivos", description: "Recortes Desktop/Mobile distintos" },
        { title: "Iconos CSS", description: "Pequeños sprites Base64 reducir HTTP" },
      ],
    },
    hi: {
      title: "Shopify मोबाइल थीम स्पीड ऑप्ट",
      description: "GTMetrix ग्रेड F → B, 40-अंक mobile सुधार",
      steps: [
        { title: "हीरो इमेज संपीड़न", description: "WebP पहली स्क्रीन <100KB" },
        { title: "WebP रूपांतरण", description: "साइट-वाइड PNG → WebP" },
        { title: "स्पीड रिपोर्ट PDF", description: "GTMetrix पहले/बाद में" },
        { title: "रिस्पॉन्सिव हीरो क्रॉप", description: "अलग डेस्कटॉप/मोबाइल क्रॉप" },
        { title: "CSS आइकन Base64", description: "छोटे स्प्राइट Base64 HTTP कम" },
      ],
    },
    ar: {
      title: "تحسين سرعة موبايل شوبيفاي",
      description: "درجة GTMetrix F → B، تحسين الهاتف المحمول بمقدار 40 نقطة",
      steps: [
        { title: "ضبط الصورة الرئيسية", description: "WebP أول شاشة <100KB" },
        { title: "تحويل WebP", description: "الموقع بالكامل PNG → WebP" },
        { title: "ملف PDF لتقرير السرعة", description: "GTMetrix قبل / بعد" },
        { title: "قص البطل المتجاوب", description: "قص منفصل لسطح المكتب / الهاتف المحمول" },
        { title: "أيقونات CSS Base64", description: "عفاريت صغيرة Base64 تقليل HTTP" },
      ],
    },
  },
  'coupang-korea-seller': {
    zh: {
      title: "韩国Coupang酷胖卖家入驻",
      description: "跨境店注册+CGF发货全流程",
      steps: [
        { title: "韩文翻译辅助", description: "店铺介绍/退换货政策" },
        { title: "中→韩商务翻译", description: "客服模板韩语版" },
        { title: "500×500主图", description: "符合Coupang规范" },
        { title: "资质PDF合并", description: "营业执照+护照+对公户" },
        { title: "韩文合规文档", description: "电子消费法条款PDF" },
      ],
    },
    en: {
      title: "Coupang Korea Seller Registration (CGF)",
      description: "Cross-border store registration + CGF / CGF Lite fulfillment setup",
      steps: [
        { title: "Korean Language Support", description: "Store intro & returns policy KOR copy" },
        { title: "ZH → KR Business Translation", description: "CS template Korean copy" },
        { title: "500×500 Main Images", description: "Coupang platform standard images" },
        { title: "Qualification PDF Merge", description: "License / Passport / bank file consolidation" },
        { title: "Korean Compliance Doc", description: "Electronic Consumer Act clause PDF" },
      ],
    },
    fr: {
      title: "Vendeur Corée Coupang (CGF)",
      description: "Inscription cross-border + CGF / CGF Lite expédition",
      steps: [
        { title: "Support coréen", description: "Présentation / SAV coréens" },
        { title: "ZH → KR pro", description: "Modèles SAV coréens" },
        { title: "500×500 photos", description: "Norme Coupang" },
        { title: "Fusion justificatifs", description: "Licence / Passeport / banque" },
        { title: "PDF conformité KR", description: "Loi consommation électronique" },
      ],
    },
    es: {
      title: "Vendedor Corea Coupang CGF",
      description: "Alta cross-border + CGF / CGF Lite envío",
      steps: [
        { title: "Soporte coreano", description: "Presentación / SAV coreanos" },
        { title: "ZH → KR profesional", description: "Plantillas SAV coreano" },
        { title: "500×500 fotos", description: "Norma Coupang" },
        { title: "Fusionar documentos", description: "Licencia / Pasaporte / banco" },
        { title: "PDF conformidad KR", description: "Ley consumidor electrónico" },
      ],
    },
    hi: {
      title: "कोरिया Coupang सेलर (CGF)",
      description: "क्रॉस-बॉर्डर रजिस्ट्रेशन + CGF / CGF Lite फुलफिलमेंट",
      steps: [
        { title: "कोरियन भाषा समर्थन", description: "स्टोर परिचय / SAV कोरियाई" },
        { title: "ZH → KR व्यावसायिक", description: "CS टेम्पलेट कोरियाई" },
        { title: "500×500 इमेज", description: "Coupang मानक" },
        { title: "योग्यता PDF विलय", description: "लाइसेंस / पासपोर्ट / बैंक" },
        { title: "KR कंप्लायंस PDF", description: "इलेक्ट्रॉनिक उपभोक्ता कानून" },
      ],
    },
    ar: {
      title: "التسجيل كبائع كوبانغ كوريا",
      description: "التسجيل عبر الحدود + CGF / CGF Lite الإنجاز",
      steps: [
        { title: "دعم اللغة الكورية", description: "مقدمة المتجر / الدعم الكورية" },
        { title: "الاحترافية ZH → KR", description: "قوالب CS الكورية" },
        { title: "500×500 صور", description: "معيار كوبانغ" },
        { title: "دمج ملفات أهلية PDF", description: "الترخيص / جواز السفر / البنك" },
        { title: "ملف PDF امتثال KR", description: "قانون المستهلك الإلكتروني" },
      ],
    },
  },
  'mercado-latam-entry': {
    zh: {
      title: "Mercado Libre拉美全站点开通",
      description: "巴西/墨西哥/阿根廷三国开店",
      steps: [
        { title: "西语/葡语模板", description: "Listing/售后双语模板" },
        { title: "中→西+中→葡", description: "合规条款翻译" },
        { title: "产品图600×600", description: "美客多标准图" },
        { title: "资质签名PDF", description: "公证文件合并盖章" },
        { title: "巴西站点节日素材", description: "巴西狂欢节/圣诞节素材包" },
      ],
    },
    en: {
      title: "Mercado Libre LatAm 3-Country Entry",
      description: "Brazil / Mexico / Argentina marketplace dual-shop 21-day plan",
      steps: [
        { title: "ES / PT Listing Templates", description: "Dual-language listing & CS templates" },
        { title: "ZH → ES + ZH → PT", description: "Compliance clauses translation" },
        { title: "600×600 Product Images", description: "Mercado Libre standard imagery" },
        { title: "Signed Qualification PDF", description: "Notarized & stamped merged documents" },
        { title: "Brazil Holiday Assets", description: "Carnival / Christmas holiday creative packs" },
      ],
    },
    fr: {
      title: "Mercado Libre 3 pays LatAm",
      description: "Brésil / Mexique / Argentine plan 21 jours",
      steps: [
        { title: "Modèles ES/PT", description: "Fiches + SAV bilingues" },
        { title: "ZH → ES + ZH → PT", description: "Traducciones conformidad" },
        { title: "600×600 visuels", description: "Standards Mercado Libre" },
        { title: "PDF signado & tampon", description: "Documentos legalizados fusionados" },
        { title: "Assets fiestas BR", description: "Carnaval / Navidad Brasil" },
      ],
    },
    es: {
      title: "Mercado Libre 3 países LatAm",
      description: "Brasil / México / Argentina plan 21 días",
      steps: [
        { title: "Plantillas ES/PT", description: "Fichas + SAV bilingües" },
        { title: "ZH → ES + ZH → PT", description: "Traducciones conformidad" },
        { title: "600×600 fotos", description: "Standard Mercado Libre" },
        { title: "PDF firmado y sellado", description: "Documentos legalizados fusionados" },
        { title: "Assets fiestas BR", description: "Carnaval / Navidad Brasil" },
      ],
    },
    hi: {
      title: "Mercado Libre LatAm 3 देश",
      description: "ब्राज़ील / मेक्सिको / अर्जेंटीना 21-दिन योजना",
      steps: [
        { title: "ES / PT टेम्पलेट", description: "लिस्टिंग + CS द्विभाषी" },
        { title: "ZH → ES + ZH → PT", description: "कंप्लायंस अनुवाद" },
        { title: "600×600 इमेज", description: "Mercado Libre मानक" },
        { title: "हस्ताक्षरित सील PDF", description: "नोटराइज़्ड विलय दस्तावेज़" },
        { title: "BR त्योहार क्रिएटिव", description: "कार्निवल / क्रिसमस ब्राज़ील" },
      ],
    },
    ar: {
      title: "دخول 3 دول لاتيني ميركادو ليبري",
      description: "البرازيل / المكسيك / الأرجنتين خطة 21 يوماً",
      steps: [
        { title: "قوالب ES / PT", description: "قوائم + CS ثنائي اللغة" },
        { title: "ZH → ES + ZH → PT", description: "ترجمات الامتثال" },
        { title: "600×600 صور", description: "معيار ميركادو ليبري" },
        { title: "ملف PDF مختوم وموقع", description: "وثائق موثقة ومدمجة" },
        { title: "إبداعي الأعياد البرازيلية", description: "كرنفال / عيد الميلاد البرازيل" },
      ],
    },
  },
  'india-meesho-seller': {
    zh: {
      title: "印度Meesho无货源卖家入驻",
      description: "印度市场0库存Dropshipping模式",
      steps: [
        { title: "英文listing", description: "标题/描述基础英文" },
        { title: "中→印地语", description: "印地语Listing翻译" },
        { title: "方图", description: "印度用户习惯方图" },
        { title: "节日素材", description: "排灯节/洒红节素材" },
        { title: "卖家手册PDF", description: "英文操作指南存档" },
      ],
    },
    en: {
      title: "India Meesho Dropshipping Seller Entry",
      description: "Indian zero-inventory Meesho onboarding in Hindi & English",
      steps: [
        { title: "English Listings", description: "Basic English title + description" },
        { title: "ZH → HI Translation", description: "Hindi-language listing translation" },
        { title: "Square Images", description: "Square layout preferred by Indian users" },
        { title: "Festival Assets", description: "Diwali / Holi creative packs" },
        { title: "Seller Handbook PDF", description: "English operation guide archive" },
      ],
    },
    fr: {
      title: "Meesho Inde Dropshipping",
      description: "0 stock Meesho inscription Hindi & Anglais",
      steps: [
        { title: "Listings anglais", description: "Base titre + descriptif" },
        { title: "ZH → HI", description: "Traduction listing Hindi" },
        { title: "Images carrées", description: "Format préféré utilisateurs IN" },
        { title: "Assets festivals", description: "Diwali / Holi packs" },
        { title: "Manuel vendeur PDF", description: "Guide opérationnel EN archive" },
      ],
    },
    es: {
      title: "Meesho India Dropshipping",
      description: "0 stock Meesho alta Hindi e inglés",
      steps: [
        { title: "Listados inglés", description: "Base título + descripción" },
        { title: "ZH → HI", description: "Traducción listing hindi" },
        { title: "Imágenes cuadradas", description: "Formato preferido usuarios IN" },
        { title: "Assets festivales", description: "Diwali / Holi packs" },
        { title: "Manual vendedor PDF", description: "Guía operativa EN archivo" },
      ],
    },
    hi: {
      title: "भारत Meesho ड्रॉपशिपिंग",
      description: "0 इन्वेंट्री Meesho हिंदी + अंग्रेज़ी रजिस्ट्रेशन",
      steps: [
        { title: "अंग्रेज़ी लिस्टिंग्स", description: "आधारभूत शीर्षक + विवरण" },
        { title: "ZH → HI अनुवाद", description: "लिस्टिंग हिंदी में" },
        { title: "स्क्वायर इमेज", description: "भारतीय उपयोगकर्ता पसंद" },
        { title: "त्योहार असेट्स", description: "दिवाली / होली पैक" },
        { title: "सेलर मैनुअल PDF", description: "अंग्रेज़ी संचालन गाइड" },
      ],
    },
    ar: {
      title: "التسجيل كبائع ميشو الهندي",
      description: "بدون مخزون ميشو التسجيل بالهندية والإنجليزية",
      steps: [
        { title: "قوائم بالإنجليزية", description: "عنوان ووصف أساسي" },
        { title: "الترجمة ZH → HI", description: "قوائم باللغة الهندية" },
        { title: "الصور المربعة", description: "تفضيل مستخدمي الهند" },
        { title: "أصول المهرجانات", description: "حزم ديبالي / هولي" },
        { title: "ملف PDF دليل البائع", description: "دليل التشغيل بالإنجليزية" },
      ],
    },
  },
  'southeast-shopee-lazada': {
    zh: {
      title: "东南亚Shopee/Lazada双店运营",
      description: "马来/泰国/菲律宾/越南4国双店",
      steps: [
        { title: "英文基础文案", description: "五国共通英文文案" },
        { title: "越/泰/马来语翻译", description: "3国本地化翻译" },
        { title: "产品主图", description: "平台标准尺寸" },
        { title: "9.9/11.11大促图", description: "东南亚大促模板" },
        { title: "多店运营SOP", description: "每个店铺运营节奏表PDF" },
      ],
    },
    en: {
      title: "SEA Shopee & Lazada 4-Country Ops",
      description: "Malaysia / Thailand / PH / Vietnam dual marketplace operation playbook",
      steps: [
        { title: "English Base Copy", description: "Universal English copy across 5 markets" },
        { title: "VI / TH / MS Language", description: "Localized translation for 3 languages" },
        { title: "Platform Product Images", description: "Platform standard main image sizes" },
        { title: "9.9/11.11 Big-Sale Banners", description: "SEA mega-sale creative templates" },
        { title: "Multi-Shop SOP PDF", description: "Per-shop operating cadence PDF handbook" },
      ],
    },
    fr: {
      title: "Shopee & Lazada SEA 4 pays",
      description: "MYS / THA / PHL / VNM double marketplace",
      steps: [
        { title: "Copies base anglais", description: "5 marchés universels" },
        { title: "VI / TH / MS", description: "Traductions 3 langues locales" },
        { title: "Visuels produits", description: "Standards plateformes" },
        { title: "9.9 / 11.11 bannières", description: "Templates grandes ventes SEA" },
        { title: "Multi-boutiques SOP PDF", description: "PDF rythme opérations / boutique" },
      ],
    },
    es: {
      title: "Shopee & Lazada SEA 4 países",
      description: "MYS / THA / PHL / VNM doble marketplace",
      steps: [
        { title: "Copias base inglés", description: "5 mercados universales" },
        { title: "VI / TH / MS", description: "Traducciones 3 idiomas locales" },
        { title: "Visuais produto", description: "Estándares plataformas" },
        { title: "9.9 / 11.11 banners", description: "Plantillas grandes ventas SEA" },
        { title: "Multi-tiendas SOP PDF", description: "Ritmo operaciones PDF / tienda" },
      ],
    },
    hi: {
      title: "Shopee & Lazada SEA 4 देश",
      description: "MYS / THA / PHL / VNM दोहरा मार्केटप्लेस प्लेबुक",
      steps: [
        { title: "अंग्रेज़ी बेस कॉपी", description: "5 बाज़ार सार्वभौमिक" },
        { title: "VI / TH / MS", description: "3 स्थानीय भाषाएँ अनुवाद" },
        { title: "प्रोडक्ट इमेज", description: "मानक प्लेटफ़ॉर्म" },
        { title: "9.9 / 11.11 बैनर्स", description: "SEA बड़ी बिक्री टेम्पलेट्स" },
        { title: "मल्टी-स्टोर SOP PDF", description: "संचालन ताल PDF / स्टोर" },
      ],
    },
    ar: {
      title: "تشغيل متاجر شوبي ولازادا 4 دول جنوب شرق آسيا",
      description: "MYS / THA / PHL / VNM كتاب مسار السوق المزدوج",
      steps: [
        { title: "النص الأساسي بالإنجليزية", description: "5 أسواق عالمية" },
        { title: "VI / TH / MS", description: "3 لغات محلية للترجمة" },
        { title: "صور المنتج", description: "معايير المنصة" },
        { title: "بانرات 9.9 / 11.11", description: "قوالب المبيعات الكبرى SEA" },
        { title: "ملف PDF الإجراءات الموحدة للمتاجر المتعددة", description: "مخطط الإيقاع PDF / المتجر" },
      ],
    },
  },
  'temu-tiktok-affiliate-sop': {
    zh: {
      title: "Temu×TikTok达人建联SOP",
      description: "达人邮箱建联+寄样+佣金矩阵",
      steps: [
        { title: "英文达人邀请邮件", description: "10种风格开场白模板" },
        { title: "产品卡", description: "产品单页PDF介绍" },
        { title: "美/英/澳母语化", description: "英语母语化达人邮件" },
        { title: "达人资料表PDF", description: "100位达人名单存档" },
        { title: "产品图邮件版", description: "邮件内图片≤200KB" },
      ],
    },
    en: {
      title: "Temu × TikTok Affiliate Outreach SOP",
      description: "Creator email outreach → sample gifting → commission attribution matrix",
      steps: [
        { title: "10-Flavor Creator Outreach", description: "10 opening-line email styles" },
        { title: "Sell Sheet PDF", description: "1-page product introduction PDF" },
        { title: "Native English (US/UK/AU)", description: "Native-style creator copy tone" },
        { title: "Creator Roster PDF", description: "100-creator contact list archive" },
        { title: "Email-Ready Images", description: "Product visuals ≤200KB for inbox" },
      ],
    },
    fr: {
      title: "Affiliation Temu×TikTok SOP",
      description: "Contact créateurs → envoi échantillons → matrice commission",
      steps: [
        { title: "10 styles emails", description: "10 ouvertures ton différents" },
        { title: "Fiche produit", description: "Présentation 1-page produit PDF" },
        { title: "Ton natif EN", description: "Style créateur US/UK/AU" },
        { title: "Tableau créateurs", description: "100 créateurs PDF archive" },
        { title: "Images email", description: "Visuels ≤200KB inbox" },
      ],
    },
    es: {
      title: "Afiliación Temu×TikTok SOP",
      description: "Contactar creadores → envío muestras → matriz comisión",
      steps: [
        { title: "10 estilos emails", description: "10 aperturas tonos distintos" },
        { title: "Ficha producto PDF", description: "Presentación 1-página" },
        { title: "Tono nativo EN", description: "Estilo creador US/UK/AU" },
        { title: "Tabla creadores PDF", description: "100 creadores archivo" },
        { title: "Imágenes email", description: "Visuais ≤200KB bandeja" },
      ],
    },
    hi: {
      title: "Temu×TikTok संबद्ध SOP",
      description: "क्रिएटर ईमेल → नमूना भेजें → कमीशन मैट्रिक्स",
      steps: [
        { title: "10 शैली क्रिएटर ईमेल", description: "10 ओपनिंग लाइन भिन्न स्टाइल" },
        { title: "सेल शीट PDF", description: "1-पृष्ठ उत्पाद परिचय" },
        { title: "मूल-अंग्रेज़ी टोन", description: "यूएस/यूके/ऑस्ट्रेलिया क्रिएटर जैसा" },
        { title: "क्रिएटर रोस्टर PDF", description: "100 क्रिएटर संपर्क अभिलेख" },
        { title: "ईमेल-तैयार इमेज", description: "≤200KB इनबॉक्स असेट्स" },
      ],
    },
    ar: {
      title: "السعي للعملاء المؤثرين تمو تيك توك",
      description: "البريد الإلكتروني للمنشئ → إرسال العينات → مصفوفة العمولة",
      steps: [
        { title: "10 أنماط بريد إلكتروني للمنشئين", description: "10 خطوط افتتاحية بأنماط مختلفة" },
        { title: "ملف PDF للورقة البيعية", description: "مقدمة المنتج من صفحة واحدة" },
        { title: "النبرة الإنجليزية الأصلية", description: "كمنشئي US/UK/AUS" },
        { title: "ملف PDF جدول المنشئين", description: "100 سجل اتصال بالمنشئين" },
        { title: "الصور الجاهزة للبريد", description: "≤200KB صندوق الوارد للأصول" },
      ],
    },
  },
  'amazon-coupon-ld-promotion': {
    zh: {
      title: "亚马逊Coupon+LD秒杀+7天 Deal排期",
      description: "Q4旺季促销日历排期+库存预估",
      steps: [
        { title: "利润盈亏算", description: "秒杀价/优惠券/Deal价利润" },
        { title: "英文促销邮件", description: "粉丝促销邮件模板" },
        { title: "A+促销图", description: "Deal促销期间主图打标" },
        { title: "欧洲5语", description: "英法德意西促销文案" },
        { title: "排期PDF", description: "Q4促销日历表分发团队" },
      ],
    },
    en: {
      title: "Amazon Coupon + LD + 7-Day Deal Plan",
      description: "Q4 holiday Deal calendar + inventory projection schedule",
      steps: [
        { title: "P&L Break-Even Calc", description: "LD / Coupon / 7-Day deal profit math" },
        { title: "Promo English Emails", description: "Fan-base promo email templates" },
        { title: "A+ Promo Badging", description: "Deal-period main image overlays" },
        { title: "EU 5-Language Promo", description: "EN/FR/DE/ES/IT copy for EU storefronts" },
        { title: "Q4 Calendar PDF", description: "Shared Q4 promo schedule team PDF" },
      ],
    },
    fr: {
      title: "Planning Coupons + LD / 7-Day Deal",
      description: "Planning Q4 soldes + prévision stock",
      steps: [
        { title: "Calcul seuil rentabilité", description: "LD / Coupon / Deal 7 jours" },
        { title: "Emails promo EN", description: "Modèles emails communauté" },
        { title: "Badges promo A+", description: "Incrustations période deals" },
        { title: "5 langues UE", description: "EN/FR/DE/ES/IT copies promo" },
        { title: "Planning Q4 PDF", description: "Planning partagé équipe Q4" },
      ],
    },
    es: {
      title: "Planificación Cupones + LD / 7-Day Deal",
      description: "Calendario Q4 + proyección stock",
      steps: [
        { title: "Cálculo umbral rentable", description: "LD / Cupón / Deal 7 días" },
        { title: "Emails promo EN", description: "Plantillas email comunidad" },
        { title: "Etiquetas promo A+", description: "Overlay superio periodo deals" },
        { title: "5 idiomas UE", description: "EN/FR/DE/ES/IT copias promo" },
        { title: "Calendario Q4 PDF", description: "Compartido equipo Q4" },
      ],
    },
    hi: {
      title: "Amazon कूपन + LD + 7-दिन Deal योजना",
      description: "Q4 छुट्टी Deal कैलेंडर + इन्वेंट्री प्रोजेक्शन",
      steps: [
        { title: "P&L ब्रेक-ईवन गणना", description: "LD / कूपन / 7-दिन लाभ गणित" },
        { title: "प्रोमो EN ईमेल", description: "फैन-बेस प्रोमो ईमेल" },
        { title: "A+ प्रोमो बैजिंग", description: "Deal अवधि मुख्य इमेज ओवरले" },
        { title: "EU 5 भाषा प्रोमो", description: "EN/FR/DE/ES/IT स्टोरफ्रंट" },
        { title: "Q4 कैलेंडर PDF", description: "साझा Q4 कैलेंडर" },
      ],
    },
    ar: {
      title: "جدولة كوبونات وصفقات أمازون الفصل الرابع",
      description: "تقويم صفقات عطلة Q4 + إسقاط المخزون",
      steps: [
        { title: "حساب التعادل في الربح والخسارة", description: "رياضيات الربح LD / كوبون / 7 أيام" },
        { title: "البريد الإلكتروني الترويجي EN", description: "بريد إلكتروني ترويجي لقاعدة المعجبين" },
        { title: "وسم العروض الترويجية A+", description: "تراكب الصورة الرئيسية لمدة الصفقة" },
        { title: "الترويج بخمس لغات للاتحاد الأوروبي", description: "EN/FR/DE/ES/IT واجهة المتجر" },
        { title: "ملف PDF للتقويم الفصل الرابع", description: "تقويم Q4 مشترك" },
      ],
    },
  },
  'return-refund-policy-pages': {
    zh: {
      title: "独立站合规政策5页写作",
      description: "隐私/退换货/服务条款/Shipping/Cookie合规",
      steps: [
        { title: "英文政策5篇", description: "GDPR/CCPA合规模板" },
        { title: "欧盟4语翻译", description: "英法德意西语政策" },
        { title: "政策PDF", description: "签字盖章存档" },
        { title: "政策页Icon", description: "5页Icon插图" },
        { title: "政策合并PDF", description: "5页合并成一份可下载" },
      ],
    },
    en: {
      title: "Shop 5 Legal Compliance Policy Pages",
      description: "GDPR / CCPA aligned Return / Privacy / Terms / Shipping / Cookie pages",
      steps: [
        { title: "5 English Policy Drafts", description: "GDPR/CCPA-compliant legal templates" },
        { title: "EU 4-Language Translation", description: "FR/DE/ES/IT policy translations" },
        { title: "Executed Policy PDF", description: "Signed & stamped compliance archive" },
        { title: "Policy Iconography", description: "5-page illustration set" },
        { title: "Consolidated Policy PDF", description: "5 policies combined downloadable PDF" },
      ],
    },
    fr: {
      title: "5 pages conformité légales",
      description: "Retour / Confidentialité / CGU / Livraison / Cookies RGPD/CCPA",
      steps: [
        { title: "5 textes légaux EN", description: "Modèles conformes RGPD/CCPA" },
        { title: "4 langues UE", description: "FR/DE/ES/IT traductions" },
        { title: "PDF signés & tamponnés", description: "Exécutés & archivés" },
        { title: "Iconographie pages", description: "5 illustrations pages" },
        { title: "PDF unique fusionné", description: "5 politiques PDF téléchargeable" },
      ],
    },
    es: {
      title: "5 páginas políticas legales",
      description: "Devolución / Privacidad / Términos / Envío / Cookies RGPD/CCPA",
      steps: [
        { title: "5 textos legales EN", description: "Plantillas RGPD/CCPA conformes" },
        { title: "4 idiomas UE", description: "FR/DE/ES/IT traducciones" },
        { title: "PDF firmados y sellados", description: "Ejecutados & archivados" },
        { title: "Iconografía páginas", description: "5 ilustraciones" },
        { title: "PDF único fusionado", description: "5 políticas descargable" },
      ],
    },
    hi: {
      title: "5 कानूनी नीतियों के पेज",
      description: "GDPR/CCPA संरेखित रिटर्न / गोपनीयता / शर्तें / शिपिंग / कुकीज़",
      steps: [
        { title: "5 अंग्रेज़ी क़ानूनी ड्राफ्ट", description: "GDPR/CCPA अनुरक्षण" },
        { title: "EU 4 भाषा अनुवाद", description: "FR/DE/ES/IT नीति" },
        { title: "निष्पादित नीति PDF", description: "हस्ताक्षरित सील संग्रह" },
        { title: "नीति आइकनोग्राफ़ी", description: "5-पृष्ठ दृष्टिकोण सेट" },
        { title: "एकीकृत नीति PDF", description: "5 नीतियाँ एक डाउनलोड योग्य" },
      ],
    },
    ar: {
      title: "5 صفحات سياسات امتثال قانونية",
      description: "محاذاة GDPR/CCPA إرجاع / خصوصية / شروط / شحن / ملفات تعريف الارتباط",
      steps: [
        { title: "5 مسودات قانونية بالإنجليزية", description: "احتفاظ GDPR/CCPA" },
        { title: "4 ترجمة لغوية للاتحاد الأوروبي", description: "سياسة FR/DE/ES/IT" },
        { title: "ملف PDF للسياسات المنفذة", description: "موقع وختم محفوظ" },
        { title: "أيقونات السياسات", description: "مجموعة المنظور البصري لـ 5 صفحات" },
        { title: "ملف PDF للسياسات الموحدة", description: "5 سياسات قابلة للتنزيل في ملف واحد" },
      ],
    },
  },
  'freelancer-upwork-profile-optimize': {
    zh: {
      title: "Upwork接单资料优化工作流",
      description: "Profile/Overview/Portfolio 5项分达90%",
      steps: [
        { title: "头像Banner设计", description: "专业头像+2000×600 Banner" },
        { title: "英文Overview文案", description: "150字以内职业概述" },
        { title: "作品集封面", description: "5个过往项目封面900×600" },
        { title: "英语母语润色", description: "所有文案母语级别修正" },
        { title: "简历PDF", description: "简历PDF英文无错字" },
      ],
    },
    en: {
      title: "Upwork Profile Optimization to 90%+",
      description: "Profile / Overview / Portfolio / employment history full polish",
      steps: [
        { title: "Avatar & Banner", description: "Pro headshot + 2000×600 banner" },
        { title: "English Overview Copy", description: "150-word professional overview" },
        { title: "Portfolio Cover Art", description: "5 past-project 900×600 cover tiles" },
        { title: "Native English Proofread", description: "Native-level editorial pass" },
        { title: "Resume PDF", description: "Error-free English resume PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Upwork Profile Optimization to 90%+",
      description: "(FR-Free) Profile / Overview / Portfolio / employment history full polish",
      steps: [
        { title: "Étape 1: Avatar & Banner", description: "Pro headshot + 2000×600 banner" },
        { title: "Étape 2: English Overview Copy", description: "150-word professional overview" },
        { title: "Étape 3: Portfolio Cover Art", description: "5 past-project 900×600 cover tiles" },
        { title: "Étape 4: Native English Proofread", description: "Native-level editorial pass" },
        { title: "Étape 5: Resume PDF", description: "Error-free English resume PDF" },
      ],
    },
    es: {
      title: "ES-Free: Upwork Profile Optimization to 90%+",
      description: "(ES-Free) Profile / Overview / Portfolio / employment history full polish",
      steps: [
        { title: "Paso 1: Avatar & Banner", description: "Pro headshot + 2000×600 banner" },
        { title: "Paso 2: English Overview Copy", description: "150-word professional overview" },
        { title: "Paso 3: Portfolio Cover Art", description: "5 past-project 900×600 cover tiles" },
        { title: "Paso 4: Native English Proofread", description: "Native-level editorial pass" },
        { title: "Paso 5: Resume PDF", description: "Error-free English resume PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Upwork Profile Optimization to 90%+",
      description: "(HI-फ्रीलांस) Profile / Overview / Portfolio / employment history full polish",
      steps: [
        { title: "चरण 1: Avatar & Banner", description: "Pro headshot + 2000×600 banner" },
        { title: "चरण 2: English Overview Copy", description: "150-word professional overview" },
        { title: "चरण 3: Portfolio Cover Art", description: "5 past-project 900×600 cover tiles" },
        { title: "चरण 4: Native English Proofread", description: "Native-level editorial pass" },
        { title: "चरण 5: Resume PDF", description: "Error-free English resume PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Upwork Profile Optimization to 90%+",
      description: "(AR-ح) Profile / Overview / Portfolio / employment history full polish",
      steps: [
        { title: "الخطوة 1: Avatar & Banner", description: "Pro headshot + 2000×600 banner" },
        { title: "الخطوة 2: English Overview Copy", description: "150-word professional overview" },
        { title: "الخطوة 3: Portfolio Cover Art", description: "5 past-project 900×600 cover tiles" },
        { title: "الخطوة 4: Native English Proofread", description: "Native-level editorial pass" },
        { title: "الخطوة 5: Resume PDF", description: "Error-free English resume PDF" },
      ],
    },
  },
  'fiverr-gig-creation-seo': {
    zh: {
      title: "Fiverr Gig SEO发布",
      description: "标题+Tags+价格套餐+缩略图高点击",
      steps: [
        { title: "英文Gig标题", description: "80字符内含关键词" },
        { title: "Gig缩略图", description: "3张不同卖点1280×769" },
        { title: "图片≤5MB", description: "Fiverr可压缩" },
        { title: "关键词灵感", description: "平台TOP10卖家标签" },
        { title: "FAQ文档PDF", description: "20条常问问题回答模板" },
      ],
    },
    en: {
      title: "Fiverr Gig SEO Publishing",
      description: "SEO Gig title + tags + pricing + high-CTR thumbnail images",
      steps: [
        { title: "SEO Gig Title", description: "80-char keyword-rich title" },
        { title: "Gig Thumbnails", description: "3 distinct 1280×769 selling-point images" },
        { title: "Image <5MB", description: "Fiverr-optimized image compression" },
        { title: "Keyword Inspiration", description: "TOP-10 seller tag mining" },
        { title: "FAQ Document PDF", description: "20-field Q&A answer template kit" },
      ],
    },
    fr: {
      title: "FR-Free: Fiverr Gig SEO Publishing",
      description: "(FR-Free) SEO Gig title + tags + pricing + high-CTR thumbnail images",
      steps: [
        { title: "Étape 1: SEO Gig Title", description: "80-char keyword-rich title" },
        { title: "Étape 2: Gig Thumbnails", description: "3 distinct 1280×769 selling-point images" },
        { title: "Étape 3: Image <5MB", description: "Fiverr-optimized image compression" },
        { title: "Étape 4: Keyword Inspiration", description: "TOP-10 seller tag mining" },
        { title: "Étape 5: FAQ Document PDF", description: "20-field Q&A answer template kit" },
      ],
    },
    es: {
      title: "ES-Free: Fiverr Gig SEO Publishing",
      description: "(ES-Free) SEO Gig title + tags + pricing + high-CTR thumbnail images",
      steps: [
        { title: "Paso 1: SEO Gig Title", description: "80-char keyword-rich title" },
        { title: "Paso 2: Gig Thumbnails", description: "3 distinct 1280×769 selling-point images" },
        { title: "Paso 3: Image <5MB", description: "Fiverr-optimized image compression" },
        { title: "Paso 4: Keyword Inspiration", description: "TOP-10 seller tag mining" },
        { title: "Paso 5: FAQ Document PDF", description: "20-field Q&A answer template kit" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Fiverr Gig SEO Publishing",
      description: "(HI-फ्रीलांस) SEO Gig title + tags + pricing + high-CTR thumbnail images",
      steps: [
        { title: "चरण 1: SEO Gig Title", description: "80-char keyword-rich title" },
        { title: "चरण 2: Gig Thumbnails", description: "3 distinct 1280×769 selling-point images" },
        { title: "चरण 3: Image <5MB", description: "Fiverr-optimized image compression" },
        { title: "चरण 4: Keyword Inspiration", description: "TOP-10 seller tag mining" },
        { title: "चरण 5: FAQ Document PDF", description: "20-field Q&A answer template kit" },
      ],
    },
    ar: {
      title: "AR-ح: Fiverr Gig SEO Publishing",
      description: "(AR-ح) SEO Gig title + tags + pricing + high-CTR thumbnail images",
      steps: [
        { title: "الخطوة 1: SEO Gig Title", description: "80-char keyword-rich title" },
        { title: "الخطوة 2: Gig Thumbnails", description: "3 distinct 1280×769 selling-point images" },
        { title: "الخطوة 3: Image <5MB", description: "Fiverr-optimized image compression" },
        { title: "الخطوة 4: Keyword Inspiration", description: "TOP-10 seller tag mining" },
        { title: "الخطوة 5: FAQ Document PDF", description: "20-field Q&A answer template kit" },
      ],
    },
  },
  'remote-interview-prep-pack': {
    zh: {
      title: "远程面试准备3件套",
      description: "简历/作品集/面试话术模拟",
      steps: [
        { title: "简历设计", description: "ATS可解析+PDF简历" },
        { title: "作品集PDF封面", description: "封面品牌化设计" },
        { title: "英文面试话术", description: "20个常见问题答案" },
        { title: "德语/法语翻译", description: "欧企岗位小语种简历" },
        { title: "全套PDF合并", description: "简历+作品+推荐信合成" },
      ],
    },
    en: {
      title: "Remote Interview Prep 3-Pack",
      description: "Resume, portfolio deck and interview Q&A simulation package",
      steps: [
        { title: "ATS Resume Design", description: "ATS-parsable branded PDF résumé" },
        { title: "Portfolio PDF Cover", description: "Branded front-matter portfolio design" },
        { title: "English Interview Scripts", description: "20 common Q&A rehearsed answers" },
        { title: "FR / DE Locale Résumé", description: "EU locale language résumé versions" },
        { title: "Full Package Merge", description: "Résumé + works + LOR combined PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Remote Interview Prep 3-Pack",
      description: "(FR-Free) Resume, portfolio deck and interview Q&A simulation package",
      steps: [
        { title: "Étape 1: ATS Resume Design", description: "ATS-parsable branded PDF résumé" },
        { title: "Étape 2: Portfolio PDF Cover", description: "Branded front-matter portfolio design" },
        { title: "Étape 3: English Interview Scripts", description: "20 common Q&A rehearsed answers" },
        { title: "Étape 4: FR / DE Locale Résumé", description: "EU locale language résumé versions" },
        { title: "Étape 5: Full Package Merge", description: "Résumé + works + LOR combined PDF" },
      ],
    },
    es: {
      title: "ES-Free: Remote Interview Prep 3-Pack",
      description: "(ES-Free) Resume, portfolio deck and interview Q&A simulation package",
      steps: [
        { title: "Paso 1: ATS Resume Design", description: "ATS-parsable branded PDF résumé" },
        { title: "Paso 2: Portfolio PDF Cover", description: "Branded front-matter portfolio design" },
        { title: "Paso 3: English Interview Scripts", description: "20 common Q&A rehearsed answers" },
        { title: "Paso 4: FR / DE Locale Résumé", description: "EU locale language résumé versions" },
        { title: "Paso 5: Full Package Merge", description: "Résumé + works + LOR combined PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Remote Interview Prep 3-Pack",
      description: "(HI-फ्रीलांस) Resume, portfolio deck and interview Q&A simulation package",
      steps: [
        { title: "चरण 1: ATS Resume Design", description: "ATS-parsable branded PDF résumé" },
        { title: "चरण 2: Portfolio PDF Cover", description: "Branded front-matter portfolio design" },
        { title: "चरण 3: English Interview Scripts", description: "20 common Q&A rehearsed answers" },
        { title: "चरण 4: FR / DE Locale Résumé", description: "EU locale language résumé versions" },
        { title: "चरण 5: Full Package Merge", description: "Résumé + works + LOR combined PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Remote Interview Prep 3-Pack",
      description: "(AR-ح) Resume, portfolio deck and interview Q&A simulation package",
      steps: [
        { title: "الخطوة 1: ATS Resume Design", description: "ATS-parsable branded PDF résumé" },
        { title: "الخطوة 2: Portfolio PDF Cover", description: "Branded front-matter portfolio design" },
        { title: "الخطوة 3: English Interview Scripts", description: "20 common Q&A rehearsed answers" },
        { title: "الخطوة 4: FR / DE Locale Résumé", description: "EU locale language résumé versions" },
        { title: "الخطوة 5: Full Package Merge", description: "Résumé + works + LOR combined PDF" },
      ],
    },
  },
  'freelance-contract-esign': {
    zh: {
      title: "自由职业合同电子签PDF",
      description: "Scope/交付/里程碑/Payment条款+签名",
      steps: [
        { title: "英文合同模板", description: "Scope+付款+版权完整条款" },
        { title: "客户母语版本", description: "西语/法语/德语版本" },
        { title: "合同PDF加密", description: "加水印+签名密码" },
        { title: "发票模板", description: "每月发票PDF模板" },
        { title: "多文件合并", description: "合同+SOW+报价单1份" },
      ],
    },
    en: {
      title: "Freelance Contract + E-Sign PDF",
      description: "Scope of work, milestones, payment terms & e-signature workflow",
      steps: [
        { title: "English Contract Template", description: "Complete Scope / pay / IP clauses" },
        { title: "Client Native Versions", description: "ES / FR / DE language variants" },
        { title: "Contract PDF Encrypt", description: "Watermark + password security" },
        { title: "Invoice Template Design", description: "Recurring monthly invoice PDF template" },
        { title: "Consolidated Document", description: "Contract + SOW + quote into one PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Freelance Contract + E-Sign PDF",
      description: "(FR-Free) Scope of work, milestones, payment terms & e-signature workflow",
      steps: [
        { title: "Étape 1: English Contract Template", description: "Complete Scope / pay / IP clauses" },
        { title: "Étape 2: Client Native Versions", description: "ES / FR / DE language variants" },
        { title: "Étape 3: Contract PDF Encrypt", description: "Watermark + password security" },
        { title: "Étape 4: Invoice Template Design", description: "Recurring monthly invoice PDF template" },
        { title: "Étape 5: Consolidated Document", description: "Contract + SOW + quote into one PDF" },
      ],
    },
    es: {
      title: "ES-Free: Freelance Contract + E-Sign PDF",
      description: "(ES-Free) Scope of work, milestones, payment terms & e-signature workflow",
      steps: [
        { title: "Paso 1: English Contract Template", description: "Complete Scope / pay / IP clauses" },
        { title: "Paso 2: Client Native Versions", description: "ES / FR / DE language variants" },
        { title: "Paso 3: Contract PDF Encrypt", description: "Watermark + password security" },
        { title: "Paso 4: Invoice Template Design", description: "Recurring monthly invoice PDF template" },
        { title: "Paso 5: Consolidated Document", description: "Contract + SOW + quote into one PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelance Contract + E-Sign PDF",
      description: "(HI-फ्रीलांस) Scope of work, milestones, payment terms & e-signature workflow",
      steps: [
        { title: "चरण 1: English Contract Template", description: "Complete Scope / pay / IP clauses" },
        { title: "चरण 2: Client Native Versions", description: "ES / FR / DE language variants" },
        { title: "चरण 3: Contract PDF Encrypt", description: "Watermark + password security" },
        { title: "चरण 4: Invoice Template Design", description: "Recurring monthly invoice PDF template" },
        { title: "चरण 5: Consolidated Document", description: "Contract + SOW + quote into one PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Freelance Contract + E-Sign PDF",
      description: "(AR-ح) Scope of work, milestones, payment terms & e-signature workflow",
      steps: [
        { title: "الخطوة 1: English Contract Template", description: "Complete Scope / pay / IP clauses" },
        { title: "الخطوة 2: Client Native Versions", description: "ES / FR / DE language variants" },
        { title: "الخطوة 3: Contract PDF Encrypt", description: "Watermark + password security" },
        { title: "الخطوة 4: Invoice Template Design", description: "Recurring monthly invoice PDF template" },
        { title: "الخطوة 5: Consolidated Document", description: "Contract + SOW + quote into one PDF" },
      ],
    },
  },
  'freelance-invoicing-track': {
    zh: {
      title: "客户开票+回款跟进SOP",
      description: "发票生成+3/7/14天催款邮件",
      steps: [
        { title: "英文催款邮件5条", description: "3天/7天/14天/最终通知" },
        { title: "发票设计", description: "A4带品牌Logo" },
        { title: "客户母语发票", description: "西/法语客户发票" },
        { title: "发票PDF加密", description: "防篡改+水印" },
        { title: "发票号编码", description: "发票号规则加密存" },
      ],
    },
    en: {
      title: "Freelance Invoicing & Payment Follow-Up",
      description: "Invoice generation + 3/7/14-day dunning email sequences",
      steps: [
        { title: "5 Dunning Emails", description: "3 / 7 / 14 / final notice templates" },
        { title: "Branded Invoice Design", description: "A4 branded invoice layout" },
        { title: "Client Native-Lang Invoice", description: "FR/ES customer invoice translation" },
        { title: "Invoice PDF Lock", description: "Anti-tamper watermark + encryption" },
        { title: "Invoice # Encoding", description: "Sequential invoice numbers stored encrypted" },
      ],
    },
    fr: {
      title: "FR-Free: Freelance Invoicing & Payment Follow-Up",
      description: "(FR-Free) Invoice generation + 3/7/14-day dunning email sequences",
      steps: [
        { title: "Étape 1: 5 Dunning Emails", description: "3 / 7 / 14 / final notice templates" },
        { title: "Étape 2: Branded Invoice Design", description: "A4 branded invoice layout" },
        { title: "Étape 3: Client Native-Lang Invoice", description: "FR/ES customer invoice translation" },
        { title: "Étape 4: Invoice PDF Lock", description: "Anti-tamper watermark + encryption" },
        { title: "Étape 5: Invoice # Encoding", description: "Sequential invoice numbers stored encrypted" },
      ],
    },
    es: {
      title: "ES-Free: Freelance Invoicing & Payment Follow-Up",
      description: "(ES-Free) Invoice generation + 3/7/14-day dunning email sequences",
      steps: [
        { title: "Paso 1: 5 Dunning Emails", description: "3 / 7 / 14 / final notice templates" },
        { title: "Paso 2: Branded Invoice Design", description: "A4 branded invoice layout" },
        { title: "Paso 3: Client Native-Lang Invoice", description: "FR/ES customer invoice translation" },
        { title: "Paso 4: Invoice PDF Lock", description: "Anti-tamper watermark + encryption" },
        { title: "Paso 5: Invoice # Encoding", description: "Sequential invoice numbers stored encrypted" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelance Invoicing & Payment Follow-Up",
      description: "(HI-फ्रीलांस) Invoice generation + 3/7/14-day dunning email sequences",
      steps: [
        { title: "चरण 1: 5 Dunning Emails", description: "3 / 7 / 14 / final notice templates" },
        { title: "चरण 2: Branded Invoice Design", description: "A4 branded invoice layout" },
        { title: "चरण 3: Client Native-Lang Invoice", description: "FR/ES customer invoice translation" },
        { title: "चरण 4: Invoice PDF Lock", description: "Anti-tamper watermark + encryption" },
        { title: "चरण 5: Invoice # Encoding", description: "Sequential invoice numbers stored encrypted" },
      ],
    },
    ar: {
      title: "AR-ح: Freelance Invoicing & Payment Follow-Up",
      description: "(AR-ح) Invoice generation + 3/7/14-day dunning email sequences",
      steps: [
        { title: "الخطوة 1: 5 Dunning Emails", description: "3 / 7 / 14 / final notice templates" },
        { title: "الخطوة 2: Branded Invoice Design", description: "A4 branded invoice layout" },
        { title: "الخطوة 3: Client Native-Lang Invoice", description: "FR/ES customer invoice translation" },
        { title: "الخطوة 4: Invoice PDF Lock", description: "Anti-tamper watermark + encryption" },
        { title: "الخطوة 5: Invoice # Encoding", description: "Sequential invoice numbers stored encrypted" },
      ],
    },
  },
  'upwork-proposal-10-template': {
    zh: {
      title: "Upwork提案Cover Letter10模板",
      description: "Web/Design/文案/翻译/营销10场景",
      steps: [
        { title: "英文10封提案", description: "10种岗位提案模板" },
        { title: "母语润色", description: "自然地道英语" },
        { title: "作品集缩略卡", description: "提案附作品集PDF" },
        { title: "作品PDF合并", description: "≤5MB可邮件发" },
        { title: "作品封面", description: "邮件封面图≤200KB" },
      ],
    },
    en: {
      title: "10 Upwork Cover Letter Templates",
      description: "10 niche Cover Letters: Dev / Design / Copy / Translate / Marketing …",
      steps: [
        { title: "10 Niche Proposals", description: "10 role-specific proposal templates" },
        { title: "Native English Polish", description: "Fluid, native tone & phrasing" },
        { title: "Portfolio Thumbnails", description: "Proposal-attached portfolio miniatures" },
        { title: "Portfolio PDF Merge", description: "≤5MB client-email ready PDF" },
        { title: "Email Cover Image", description: "Portfolio cover ≤200KB" },
      ],
    },
    fr: {
      title: "FR-Free: 10 Upwork Cover Letter Templates",
      description: "(FR-Free) 10 niche Cover Letters: Dev / Design / Copy / Translate / Marketing …",
      steps: [
        { title: "Étape 1: 10 Niche Proposals", description: "10 role-specific proposal templates" },
        { title: "Étape 2: Native English Polish", description: "Fluid, native tone & phrasing" },
        { title: "Étape 3: Portfolio Thumbnails", description: "Proposal-attached portfolio miniatures" },
        { title: "Étape 4: Portfolio PDF Merge", description: "≤5MB client-email ready PDF" },
        { title: "Étape 5: Email Cover Image", description: "Portfolio cover ≤200KB" },
      ],
    },
    es: {
      title: "ES-Free: 10 Upwork Cover Letter Templates",
      description: "(ES-Free) 10 niche Cover Letters: Dev / Design / Copy / Translate / Marketing …",
      steps: [
        { title: "Paso 1: 10 Niche Proposals", description: "10 role-specific proposal templates" },
        { title: "Paso 2: Native English Polish", description: "Fluid, native tone & phrasing" },
        { title: "Paso 3: Portfolio Thumbnails", description: "Proposal-attached portfolio miniatures" },
        { title: "Paso 4: Portfolio PDF Merge", description: "≤5MB client-email ready PDF" },
        { title: "Paso 5: Email Cover Image", description: "Portfolio cover ≤200KB" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: 10 Upwork Cover Letter Templates",
      description: "(HI-फ्रीलांस) 10 niche Cover Letters: Dev / Design / Copy / Translate / Marketing …",
      steps: [
        { title: "चरण 1: 10 Niche Proposals", description: "10 role-specific proposal templates" },
        { title: "चरण 2: Native English Polish", description: "Fluid, native tone & phrasing" },
        { title: "चरण 3: Portfolio Thumbnails", description: "Proposal-attached portfolio miniatures" },
        { title: "चरण 4: Portfolio PDF Merge", description: "≤5MB client-email ready PDF" },
        { title: "चरण 5: Email Cover Image", description: "Portfolio cover ≤200KB" },
      ],
    },
    ar: {
      title: "AR-ح: 10 Upwork Cover Letter Templates",
      description: "(AR-ح) 10 niche Cover Letters: Dev / Design / Copy / Translate / Marketing …",
      steps: [
        { title: "الخطوة 1: 10 Niche Proposals", description: "10 role-specific proposal templates" },
        { title: "الخطوة 2: Native English Polish", description: "Fluid, native tone & phrasing" },
        { title: "الخطوة 3: Portfolio Thumbnails", description: "Proposal-attached portfolio miniatures" },
        { title: "الخطوة 4: Portfolio PDF Merge", description: "≤5MB client-email ready PDF" },
        { title: "الخطوة 5: Email Cover Image", description: "Portfolio cover ≤200KB" },
      ],
    },
  },
  'freelance-client-onboarding': {
    zh: {
      title: "自由职业客户Onboarding欢迎包",
      description: "合同/问卷/Slack/Notion 4步到位",
      steps: [
        { title: "英文欢迎邮件", description: "5步客户上岗流程说明" },
        { title: "问卷图", description: "Airtable表单封面" },
        { title: "客户母语翻译", description: "非英语客户问卷" },
        { title: "NDA合同PDF", description: "保密协议+合同一起签" },
        { title: "欢迎包合并", description: "所有资料一份PDF" },
      ],
    },
    en: {
      title: "Client Onboarding Welcome Pack",
      description: "Contract / intake form / Slack / Notion 4-step onboarding experience",
      steps: [
        { title: "English Welcome Email", description: "5-step client kickoff email" },
        { title: "Intake Form Creative", description: "Airtable form header artwork" },
        { title: "Client Native Translation", description: "Non-English client intake translation" },
        { title: "NDA + Contract PDF", description: "NDA + contract signed as one" },
        { title: "Welcome Pack Merge", description: "All onboarding docs in single PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Client Onboarding Welcome Pack",
      description: "(FR-Free) Contract / intake form / Slack / Notion 4-step onboarding experience",
      steps: [
        { title: "Étape 1: English Welcome Email", description: "5-step client kickoff email" },
        { title: "Étape 2: Intake Form Creative", description: "Airtable form header artwork" },
        { title: "Étape 3: Client Native Translation", description: "Non-English client intake translation" },
        { title: "Étape 4: NDA + Contract PDF", description: "NDA + contract signed as one" },
        { title: "Étape 5: Welcome Pack Merge", description: "All onboarding docs in single PDF" },
      ],
    },
    es: {
      title: "ES-Free: Client Onboarding Welcome Pack",
      description: "(ES-Free) Contract / intake form / Slack / Notion 4-step onboarding experience",
      steps: [
        { title: "Paso 1: English Welcome Email", description: "5-step client kickoff email" },
        { title: "Paso 2: Intake Form Creative", description: "Airtable form header artwork" },
        { title: "Paso 3: Client Native Translation", description: "Non-English client intake translation" },
        { title: "Paso 4: NDA + Contract PDF", description: "NDA + contract signed as one" },
        { title: "Paso 5: Welcome Pack Merge", description: "All onboarding docs in single PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Client Onboarding Welcome Pack",
      description: "(HI-फ्रीलांस) Contract / intake form / Slack / Notion 4-step onboarding experience",
      steps: [
        { title: "चरण 1: English Welcome Email", description: "5-step client kickoff email" },
        { title: "चरण 2: Intake Form Creative", description: "Airtable form header artwork" },
        { title: "चरण 3: Client Native Translation", description: "Non-English client intake translation" },
        { title: "चरण 4: NDA + Contract PDF", description: "NDA + contract signed as one" },
        { title: "चरण 5: Welcome Pack Merge", description: "All onboarding docs in single PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Client Onboarding Welcome Pack",
      description: "(AR-ح) Contract / intake form / Slack / Notion 4-step onboarding experience",
      steps: [
        { title: "الخطوة 1: English Welcome Email", description: "5-step client kickoff email" },
        { title: "الخطوة 2: Intake Form Creative", description: "Airtable form header artwork" },
        { title: "الخطوة 3: Client Native Translation", description: "Non-English client intake translation" },
        { title: "الخطوة 4: NDA + Contract PDF", description: "NDA + contract signed as one" },
        { title: "الخطوة 5: Welcome Pack Merge", description: "All onboarding docs in single PDF" },
      ],
    },
  },
  'social-media-content-30day': {
    zh: {
      title: "自由职业社媒30天内容日历",
      description: "LinkedIn/Twitter/IG 3平台每天1帖",
      steps: [
        { title: "30条英文内容", description: "30天内容脚本" },
        { title: "30张配图", description: "不同品牌色统一" },
        { title: "图片压缩", description: "各平台最佳尺寸" },
        { title: "西/法语客群", description: "欧洲客户双语内容" },
        { title: "日历PDF", description: "30天排期表PDF下载" },
      ],
    },
    en: {
      title: "30-Day Social Media Content Calendar",
      description: "LinkedIn / Twitter / IG 3-platform 30-day daily content queue ready",
      steps: [
        { title: "30 English Posts", description: "30-day content script pipeline" },
        { title: "30 Matching Visuals", description: "Unified branded 30-image pack" },
        { title: "Platform-Optimized Sizes", description: "Per-platform optimal image sizing" },
        { title: "FR/ES Audience Variant", description: "FR/ES bilingual content variants" },
        { title: "Calendar Download PDF", description: "30-day editable calendar PDF" },
      ],
    },
    fr: {
      title: "FR-Free: 30-Day Social Media Content Calendar",
      description: "(FR-Free) LinkedIn / Twitter / IG 3-platform 30-day daily content queue ready",
      steps: [
        { title: "Étape 1: 30 English Posts", description: "30-day content script pipeline" },
        { title: "Étape 2: 30 Matching Visuals", description: "Unified branded 30-image pack" },
        { title: "Étape 3: Platform-Optimized Sizes", description: "Per-platform optimal image sizing" },
        { title: "Étape 4: FR/ES Audience Variant", description: "FR/ES bilingual content variants" },
        { title: "Étape 5: Calendar Download PDF", description: "30-day editable calendar PDF" },
      ],
    },
    es: {
      title: "ES-Free: 30-Day Social Media Content Calendar",
      description: "(ES-Free) LinkedIn / Twitter / IG 3-platform 30-day daily content queue ready",
      steps: [
        { title: "Paso 1: 30 English Posts", description: "30-day content script pipeline" },
        { title: "Paso 2: 30 Matching Visuals", description: "Unified branded 30-image pack" },
        { title: "Paso 3: Platform-Optimized Sizes", description: "Per-platform optimal image sizing" },
        { title: "Paso 4: FR/ES Audience Variant", description: "FR/ES bilingual content variants" },
        { title: "Paso 5: Calendar Download PDF", description: "30-day editable calendar PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: 30-Day Social Media Content Calendar",
      description: "(HI-फ्रीलांस) LinkedIn / Twitter / IG 3-platform 30-day daily content queue ready",
      steps: [
        { title: "चरण 1: 30 English Posts", description: "30-day content script pipeline" },
        { title: "चरण 2: 30 Matching Visuals", description: "Unified branded 30-image pack" },
        { title: "चरण 3: Platform-Optimized Sizes", description: "Per-platform optimal image sizing" },
        { title: "चरण 4: FR/ES Audience Variant", description: "FR/ES bilingual content variants" },
        { title: "चरण 5: Calendar Download PDF", description: "30-day editable calendar PDF" },
      ],
    },
    ar: {
      title: "AR-ح: 30-Day Social Media Content Calendar",
      description: "(AR-ح) LinkedIn / Twitter / IG 3-platform 30-day daily content queue ready",
      steps: [
        { title: "الخطوة 1: 30 English Posts", description: "30-day content script pipeline" },
        { title: "الخطوة 2: 30 Matching Visuals", description: "Unified branded 30-image pack" },
        { title: "الخطوة 3: Platform-Optimized Sizes", description: "Per-platform optimal image sizing" },
        { title: "الخطوة 4: FR/ES Audience Variant", description: "FR/ES bilingual content variants" },
        { title: "الخطوة 5: Calendar Download PDF", description: "30-day editable calendar PDF" },
      ],
    },
  },
  'freelance-portfolio-website': {
    zh: {
      title: "Notion+域名作品集网站搭建",
      description: "0代码1小时上线作品集",
      steps: [
        { title: "封面页Hero图", description: "1920×1080高像素" },
        { title: "过往项目封面", description: "统一尺寸项目卡" },
        { title: "英文About页", description: "自我介绍专业文案" },
        { title: "作品封面压缩", description: "快速加载" },
        { title: "作品备份PDF", description: "作品集备份离线版" },
      ],
    },
    en: {
      title: "Freelance Portfolio Site (No-Code)",
      description: "Notion + custom domain portfolio site live in under 2 hours",
      steps: [
        { title: "Hero Cover Art", description: "1920×1080 premium hero photography" },
        { title: "Case Study Cover Tiles", description: "Uniform-sized project cover thumbnails" },
        { title: "English About Page Copy", description: "Professional About page narrative" },
        { title: "Thumbnail Compression", description: "Fast page-load portfolio imagery" },
        { title: "Offline Backup PDF", description: "Exported portfolio offline backup PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Freelance Portfolio Site (No-Code)",
      description: "(FR-Free) Notion + custom domain portfolio site live in under 2 hours",
      steps: [
        { title: "Étape 1: Hero Cover Art", description: "1920×1080 premium hero photography" },
        { title: "Étape 2: Case Study Cover Tiles", description: "Uniform-sized project cover thumbnails" },
        { title: "Étape 3: English About Page Copy", description: "Professional About page narrative" },
        { title: "Étape 4: Thumbnail Compression", description: "Fast page-load portfolio imagery" },
        { title: "Étape 5: Offline Backup PDF", description: "Exported portfolio offline backup PDF" },
      ],
    },
    es: {
      title: "ES-Free: Freelance Portfolio Site (No-Code)",
      description: "(ES-Free) Notion + custom domain portfolio site live in under 2 hours",
      steps: [
        { title: "Paso 1: Hero Cover Art", description: "1920×1080 premium hero photography" },
        { title: "Paso 2: Case Study Cover Tiles", description: "Uniform-sized project cover thumbnails" },
        { title: "Paso 3: English About Page Copy", description: "Professional About page narrative" },
        { title: "Paso 4: Thumbnail Compression", description: "Fast page-load portfolio imagery" },
        { title: "Paso 5: Offline Backup PDF", description: "Exported portfolio offline backup PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelance Portfolio Site (No-Code)",
      description: "(HI-फ्रीलांस) Notion + custom domain portfolio site live in under 2 hours",
      steps: [
        { title: "चरण 1: Hero Cover Art", description: "1920×1080 premium hero photography" },
        { title: "चरण 2: Case Study Cover Tiles", description: "Uniform-sized project cover thumbnails" },
        { title: "चरण 3: English About Page Copy", description: "Professional About page narrative" },
        { title: "चरण 4: Thumbnail Compression", description: "Fast page-load portfolio imagery" },
        { title: "चरण 5: Offline Backup PDF", description: "Exported portfolio offline backup PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Freelance Portfolio Site (No-Code)",
      description: "(AR-ح) Notion + custom domain portfolio site live in under 2 hours",
      steps: [
        { title: "الخطوة 1: Hero Cover Art", description: "1920×1080 premium hero photography" },
        { title: "الخطوة 2: Case Study Cover Tiles", description: "Uniform-sized project cover thumbnails" },
        { title: "الخطوة 3: English About Page Copy", description: "Professional About page narrative" },
        { title: "الخطوة 4: Thumbnail Compression", description: "Fast page-load portfolio imagery" },
        { title: "الخطوة 5: Offline Backup PDF", description: "Exported portfolio offline backup PDF" },
      ],
    },
  },
  'time-tracking-client-report': {
    zh: {
      title: "工时记录+客户周报可视化",
      description: "Toggl+周报PDF每周自动",
      steps: [
        { title: "工时×费率估算", description: "月度收入预估" },
        { title: "周报图表", description: "周报图表设计" },
        { title: "英文周报说明", description: "进度+风险+下周计划" },
        { title: "法语/西语客户", description: "周报小语种版本" },
        { title: "周报签名PDF", description: "盖章确认工作" },
      ],
    },
    en: {
      title: "Time Tracking & Client Weekly Report",
      description: "Toggl time entries → visual client weekly report PDF generator",
      steps: [
        { title: "Hours × Rate Estimate", description: "Monthly revenue forecast calculator" },
        { title: "Report Charts Design", description: "Weekly progress data visualization" },
        { title: "English Report Narrative", description: "Status + risks + next-week copy" },
        { title: "FR/ES Report Variants", description: "Customer language weekly report versions" },
        { title: "Signed Report PDF", description: "Stamped, confirmed weekly report PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Time Tracking & Client Weekly Report",
      description: "(FR-Free) Toggl time entries → visual client weekly report PDF generator",
      steps: [
        { title: "Étape 1: Hours × Rate Estimate", description: "Monthly revenue forecast calculator" },
        { title: "Étape 2: Report Charts Design", description: "Weekly progress data visualization" },
        { title: "Étape 3: English Report Narrative", description: "Status + risks + next-week copy" },
        { title: "Étape 4: FR/ES Report Variants", description: "Customer language weekly report versions" },
        { title: "Étape 5: Signed Report PDF", description: "Stamped, confirmed weekly report PDF" },
      ],
    },
    es: {
      title: "ES-Free: Time Tracking & Client Weekly Report",
      description: "(ES-Free) Toggl time entries → visual client weekly report PDF generator",
      steps: [
        { title: "Paso 1: Hours × Rate Estimate", description: "Monthly revenue forecast calculator" },
        { title: "Paso 2: Report Charts Design", description: "Weekly progress data visualization" },
        { title: "Paso 3: English Report Narrative", description: "Status + risks + next-week copy" },
        { title: "Paso 4: FR/ES Report Variants", description: "Customer language weekly report versions" },
        { title: "Paso 5: Signed Report PDF", description: "Stamped, confirmed weekly report PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Time Tracking & Client Weekly Report",
      description: "(HI-फ्रीलांस) Toggl time entries → visual client weekly report PDF generator",
      steps: [
        { title: "चरण 1: Hours × Rate Estimate", description: "Monthly revenue forecast calculator" },
        { title: "चरण 2: Report Charts Design", description: "Weekly progress data visualization" },
        { title: "चरण 3: English Report Narrative", description: "Status + risks + next-week copy" },
        { title: "चरण 4: FR/ES Report Variants", description: "Customer language weekly report versions" },
        { title: "चरण 5: Signed Report PDF", description: "Stamped, confirmed weekly report PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Time Tracking & Client Weekly Report",
      description: "(AR-ح) Toggl time entries → visual client weekly report PDF generator",
      steps: [
        { title: "الخطوة 1: Hours × Rate Estimate", description: "Monthly revenue forecast calculator" },
        { title: "الخطوة 2: Report Charts Design", description: "Weekly progress data visualization" },
        { title: "الخطوة 3: English Report Narrative", description: "Status + risks + next-week copy" },
        { title: "الخطوة 4: FR/ES Report Variants", description: "Customer language weekly report versions" },
        { title: "الخطوة 5: Signed Report PDF", description: "Stamped, confirmed weekly report PDF" },
      ],
    },
  },
  'freelance-scope-creep-avoid': {
    zh: {
      title: "范围蔓延客户变更请求处理",
      description: "变更报价单+邮件沟通SOP",
      steps: [
        { title: "英文变更通知邮件", description: "专业礼貌的3封模板" },
        { title: "新工时报价", description: "变更工时+费用预估" },
        { title: "变更单图", description: "Scope Change单张PDF" },
        { title: "客户母语版本", description: "欧洲客户本地语" },
        { title: "变更单PDF签名", description: "客户确认签字归档" },
      ],
    },
    en: {
      title: "Scope Creep & Change Order SOP",
      description: "Client change request quote + polite communication email templates",
      steps: [
        { title: "3 Change Notice Emails", description: "Professional polite 3-email variants" },
        { title: "Effort + Cost Quotation", description: "Revised hours & incremental fee math" },
        { title: "Change Order Visual", description: "Single-page Scope Change PDF sheet" },
        { title: "Client Native Version", description: "EU locale local language versions" },
        { title: "Signed Change Order PDF", description: "Client countersigned change order" },
      ],
    },
    fr: {
      title: "FR-Free: Scope Creep & Change Order SOP",
      description: "(FR-Free) Client change request quote + polite communication email templates",
      steps: [
        { title: "Étape 1: 3 Change Notice Emails", description: "Professional polite 3-email variants" },
        { title: "Étape 2: Effort + Cost Quotation", description: "Revised hours & incremental fee math" },
        { title: "Étape 3: Change Order Visual", description: "Single-page Scope Change PDF sheet" },
        { title: "Étape 4: Client Native Version", description: "EU locale local language versions" },
        { title: "Étape 5: Signed Change Order PDF", description: "Client countersigned change order" },
      ],
    },
    es: {
      title: "ES-Free: Scope Creep & Change Order SOP",
      description: "(ES-Free) Client change request quote + polite communication email templates",
      steps: [
        { title: "Paso 1: 3 Change Notice Emails", description: "Professional polite 3-email variants" },
        { title: "Paso 2: Effort + Cost Quotation", description: "Revised hours & incremental fee math" },
        { title: "Paso 3: Change Order Visual", description: "Single-page Scope Change PDF sheet" },
        { title: "Paso 4: Client Native Version", description: "EU locale local language versions" },
        { title: "Paso 5: Signed Change Order PDF", description: "Client countersigned change order" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Scope Creep & Change Order SOP",
      description: "(HI-फ्रीलांस) Client change request quote + polite communication email templates",
      steps: [
        { title: "चरण 1: 3 Change Notice Emails", description: "Professional polite 3-email variants" },
        { title: "चरण 2: Effort + Cost Quotation", description: "Revised hours & incremental fee math" },
        { title: "चरण 3: Change Order Visual", description: "Single-page Scope Change PDF sheet" },
        { title: "चरण 4: Client Native Version", description: "EU locale local language versions" },
        { title: "चरण 5: Signed Change Order PDF", description: "Client countersigned change order" },
      ],
    },
    ar: {
      title: "AR-ح: Scope Creep & Change Order SOP",
      description: "(AR-ح) Client change request quote + polite communication email templates",
      steps: [
        { title: "الخطوة 1: 3 Change Notice Emails", description: "Professional polite 3-email variants" },
        { title: "الخطوة 2: Effort + Cost Quotation", description: "Revised hours & incremental fee math" },
        { title: "الخطوة 3: Change Order Visual", description: "Single-page Scope Change PDF sheet" },
        { title: "الخطوة 4: Client Native Version", description: "EU locale local language versions" },
        { title: "الخطوة 5: Signed Change Order PDF", description: "Client countersigned change order" },
      ],
    },
  },
  'freelance-niche-branding-kit': {
    zh: {
      title: "自由职业垂直领域品牌VI",
      description: "Logo/配色/字体/邮件签名4件套",
      steps: [
        { title: "主辅配色", description: "3色+中性色5个色阶" },
        { title: "Logo设计", description: "矢量Logo 2版" },
        { title: "邮件签名图", description: "600×200签名图" },
        { title: "品牌口号Slogan", description: "英文Slogan 3版" },
        { title: "VI手册PDF", description: "Logo/色/字体使用规范" },
      ],
    },
    en: {
      title: "Freelancer Personal Brand VI Kit",
      description: "Logo / palette / typography / email signature personal brand 4-piece",
      steps: [
        { title: "Primary & Accent Palette", description: "3 colors + 5-step neutral swatches" },
        { title: "Logo Design", description: "2 vector logo lockups" },
        { title: "Email Signature Graphic", description: "600×200 email signature tile" },
        { title: "Brand Taglines (EN)", description: "3 English Slogan candidates" },
        { title: "VI Standards PDF", description: "Logo / palette / font usage guide" },
      ],
    },
    fr: {
      title: "FR-Free: Freelancer Personal Brand VI Kit",
      description: "(FR-Free) Logo / palette / typography / email signature personal brand 4-piece",
      steps: [
        { title: "Étape 1: Primary & Accent Palette", description: "3 colors + 5-step neutral swatches" },
        { title: "Étape 2: Logo Design", description: "2 vector logo lockups" },
        { title: "Étape 3: Email Signature Graphic", description: "600×200 email signature tile" },
        { title: "Étape 4: Brand Taglines (EN)", description: "3 English Slogan candidates" },
        { title: "Étape 5: VI Standards PDF", description: "Logo / palette / font usage guide" },
      ],
    },
    es: {
      title: "ES-Free: Freelancer Personal Brand VI Kit",
      description: "(ES-Free) Logo / palette / typography / email signature personal brand 4-piece",
      steps: [
        { title: "Paso 1: Primary & Accent Palette", description: "3 colors + 5-step neutral swatches" },
        { title: "Paso 2: Logo Design", description: "2 vector logo lockups" },
        { title: "Paso 3: Email Signature Graphic", description: "600×200 email signature tile" },
        { title: "Paso 4: Brand Taglines (EN)", description: "3 English Slogan candidates" },
        { title: "Paso 5: VI Standards PDF", description: "Logo / palette / font usage guide" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelancer Personal Brand VI Kit",
      description: "(HI-फ्रीलांस) Logo / palette / typography / email signature personal brand 4-piece",
      steps: [
        { title: "चरण 1: Primary & Accent Palette", description: "3 colors + 5-step neutral swatches" },
        { title: "चरण 2: Logo Design", description: "2 vector logo lockups" },
        { title: "चरण 3: Email Signature Graphic", description: "600×200 email signature tile" },
        { title: "चरण 4: Brand Taglines (EN)", description: "3 English Slogan candidates" },
        { title: "चरण 5: VI Standards PDF", description: "Logo / palette / font usage guide" },
      ],
    },
    ar: {
      title: "AR-ح: Freelancer Personal Brand VI Kit",
      description: "(AR-ح) Logo / palette / typography / email signature personal brand 4-piece",
      steps: [
        { title: "الخطوة 1: Primary & Accent Palette", description: "3 colors + 5-step neutral swatches" },
        { title: "الخطوة 2: Logo Design", description: "2 vector logo lockups" },
        { title: "الخطوة 3: Email Signature Graphic", description: "600×200 email signature tile" },
        { title: "الخطوة 4: Brand Taglines (EN)", description: "3 English Slogan candidates" },
        { title: "الخطوة 5: VI Standards PDF", description: "Logo / palette / font usage guide" },
      ],
    },
  },
  'upwork-job-score-rubric': {
    zh: {
      title: "Upwork岗位打分过滤法",
      description: "预算/时长/反馈/历史5项打分",
      steps: [
        { title: "加权打分", description: "5个维度打分算法" },
        { title: "英文拒接邮件", description: "礼貌拒绝不匹配岗位" },
        { title: "英语润色", description: "自然" },
        { title: "打分卡片图", description: "给自己团队的流程" },
        { title: "筛选标准PDF", description: "未来招聘参考" },
      ],
    },
    en: {
      title: "Upwork Job Score Rubric Filter",
      description: "Budget / duration / feedback / history 5-factor weighted scoring filter",
      steps: [
        { title: "Weighted Scoring Algorithm", description: "5-dimension weighted score" },
        { title: "English Decline Email", description: "Polite job-decline letter template" },
        { title: "English Tone Polish", description: "Natural-sounding prose" },
        { title: "Scoring Cheat Sheet", description: "Visual team process card" },
        { title: "Criteria Handbook PDF", description: "Future-hiring standard PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Upwork Job Score Rubric Filter",
      description: "(FR-Free) Budget / duration / feedback / history 5-factor weighted scoring filter",
      steps: [
        { title: "Étape 1: Weighted Scoring Algorithm", description: "5-dimension weighted score" },
        { title: "Étape 2: English Decline Email", description: "Polite job-decline letter template" },
        { title: "Étape 3: English Tone Polish", description: "Natural-sounding prose" },
        { title: "Étape 4: Scoring Cheat Sheet", description: "Visual team process card" },
        { title: "Étape 5: Criteria Handbook PDF", description: "Future-hiring standard PDF" },
      ],
    },
    es: {
      title: "ES-Free: Upwork Job Score Rubric Filter",
      description: "(ES-Free) Budget / duration / feedback / history 5-factor weighted scoring filter",
      steps: [
        { title: "Paso 1: Weighted Scoring Algorithm", description: "5-dimension weighted score" },
        { title: "Paso 2: English Decline Email", description: "Polite job-decline letter template" },
        { title: "Paso 3: English Tone Polish", description: "Natural-sounding prose" },
        { title: "Paso 4: Scoring Cheat Sheet", description: "Visual team process card" },
        { title: "Paso 5: Criteria Handbook PDF", description: "Future-hiring standard PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Upwork Job Score Rubric Filter",
      description: "(HI-फ्रीलांस) Budget / duration / feedback / history 5-factor weighted scoring filter",
      steps: [
        { title: "चरण 1: Weighted Scoring Algorithm", description: "5-dimension weighted score" },
        { title: "चरण 2: English Decline Email", description: "Polite job-decline letter template" },
        { title: "चरण 3: English Tone Polish", description: "Natural-sounding prose" },
        { title: "चरण 4: Scoring Cheat Sheet", description: "Visual team process card" },
        { title: "चरण 5: Criteria Handbook PDF", description: "Future-hiring standard PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Upwork Job Score Rubric Filter",
      description: "(AR-ح) Budget / duration / feedback / history 5-factor weighted scoring filter",
      steps: [
        { title: "الخطوة 1: Weighted Scoring Algorithm", description: "5-dimension weighted score" },
        { title: "الخطوة 2: English Decline Email", description: "Polite job-decline letter template" },
        { title: "الخطوة 3: English Tone Polish", description: "Natural-sounding prose" },
        { title: "الخطوة 4: Scoring Cheat Sheet", description: "Visual team process card" },
        { title: "الخطوة 5: Criteria Handbook PDF", description: "Future-hiring standard PDF" },
      ],
    },
  },
  'cold-outreach-linkedin-dm': {
    zh: {
      title: "LinkedIn冷私信开发客户模板",
      description: "Hook+痛点+CTA 10版不同",
      steps: [
        { title: "10条英文DM", description: "10种不同人设模板" },
        { title: "母语润色", description: "地道英语语气" },
        { title: "个人资料Banner", description: "1584×396 LinkedIn Banner" },
        { title: "案例缩略图", description: "置顶项目案例封面" },
        { title: "客户名单PDF", description: "已开发客户跟进表" },
      ],
    },
    en: {
      title: "10 LinkedIn Cold DM Variants",
      description: "Hook → pain → credibility → CTA 10 different LinkedIn DM scripts",
      steps: [
        { title: "10 English DM Scripts", description: "10 persona-first DM templates" },
        { title: "Native Tone Polish", description: "Warm, idiomatic English tone" },
        { title: "LinkedIn Profile Banner", description: "1584×396 LinkedIn banner refresh" },
        { title: "Pinned Case Thumbnails", description: "Featured project case cover tiles" },
        { title: "CRM Roster PDF", description: "Outreach tracker status archive PDF" },
      ],
    },
    fr: {
      title: "FR-Free: 10 LinkedIn Cold DM Variants",
      description: "(FR-Free) Hook → pain → credibility → CTA 10 different LinkedIn DM scripts",
      steps: [
        { title: "Étape 1: 10 English DM Scripts", description: "10 persona-first DM templates" },
        { title: "Étape 2: Native Tone Polish", description: "Warm, idiomatic English tone" },
        { title: "Étape 3: LinkedIn Profile Banner", description: "1584×396 LinkedIn banner refresh" },
        { title: "Étape 4: Pinned Case Thumbnails", description: "Featured project case cover tiles" },
        { title: "Étape 5: CRM Roster PDF", description: "Outreach tracker status archive PDF" },
      ],
    },
    es: {
      title: "ES-Free: 10 LinkedIn Cold DM Variants",
      description: "(ES-Free) Hook → pain → credibility → CTA 10 different LinkedIn DM scripts",
      steps: [
        { title: "Paso 1: 10 English DM Scripts", description: "10 persona-first DM templates" },
        { title: "Paso 2: Native Tone Polish", description: "Warm, idiomatic English tone" },
        { title: "Paso 3: LinkedIn Profile Banner", description: "1584×396 LinkedIn banner refresh" },
        { title: "Paso 4: Pinned Case Thumbnails", description: "Featured project case cover tiles" },
        { title: "Paso 5: CRM Roster PDF", description: "Outreach tracker status archive PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: 10 LinkedIn Cold DM Variants",
      description: "(HI-फ्रीलांस) Hook → pain → credibility → CTA 10 different LinkedIn DM scripts",
      steps: [
        { title: "चरण 1: 10 English DM Scripts", description: "10 persona-first DM templates" },
        { title: "चरण 2: Native Tone Polish", description: "Warm, idiomatic English tone" },
        { title: "चरण 3: LinkedIn Profile Banner", description: "1584×396 LinkedIn banner refresh" },
        { title: "चरण 4: Pinned Case Thumbnails", description: "Featured project case cover tiles" },
        { title: "चरण 5: CRM Roster PDF", description: "Outreach tracker status archive PDF" },
      ],
    },
    ar: {
      title: "AR-ح: 10 LinkedIn Cold DM Variants",
      description: "(AR-ح) Hook → pain → credibility → CTA 10 different LinkedIn DM scripts",
      steps: [
        { title: "الخطوة 1: 10 English DM Scripts", description: "10 persona-first DM templates" },
        { title: "الخطوة 2: Native Tone Polish", description: "Warm, idiomatic English tone" },
        { title: "الخطوة 3: LinkedIn Profile Banner", description: "1584×396 LinkedIn banner refresh" },
        { title: "الخطوة 4: Pinned Case Thumbnails", description: "Featured project case cover tiles" },
        { title: "الخطوة 5: CRM Roster PDF", description: "Outreach tracker status archive PDF" },
      ],
    },
  },
  'freelance-upsell-crossell': {
    zh: {
      title: "老客户加购+交叉销售话术",
      description: "3/6/12月Retainer套餐话术",
      steps: [
        { title: "英文加购邮件", description: "月度/季度/年度邮件" },
        { title: "套餐报价算", description: "多档位价格表" },
        { title: "套餐图", description: "3档套餐对比图" },
        { title: "非英语客户", description: "小语种套餐邮件" },
        { title: "Retainer合同", description: "月度长期合同签" },
      ],
    },
    en: {
      title: "Retainer Upsell & Cross-Sell Scripts",
      description: "3 / 6 / 12-month retainer package offer & renewal scripts",
      steps: [
        { title: "Upsell Cadence Emails", description: "Monthly / Quarterly / Annual cadence" },
        { title: "Tiered Pricing Calculator", description: "3-tier retainer pricing table" },
        { title: "3-Tier Comparison Graphic", description: "Visual pricing matrix layout" },
        { title: "Non-English Client Variants", description: "FR/ES retainer offer translations" },
        { title: "Ongoing Retainer Contract", description: "Signed rolling retainer MSA" },
      ],
    },
    fr: {
      title: "FR-Free: Retainer Upsell & Cross-Sell Scripts",
      description: "(FR-Free) 3 / 6 / 12-month retainer package offer & renewal scripts",
      steps: [
        { title: "Étape 1: Upsell Cadence Emails", description: "Monthly / Quarterly / Annual cadence" },
        { title: "Étape 2: Tiered Pricing Calculator", description: "3-tier retainer pricing table" },
        { title: "Étape 3: 3-Tier Comparison Graphic", description: "Visual pricing matrix layout" },
        { title: "Étape 4: Non-English Client Variants", description: "FR/ES retainer offer translations" },
        { title: "Étape 5: Ongoing Retainer Contract", description: "Signed rolling retainer MSA" },
      ],
    },
    es: {
      title: "ES-Free: Retainer Upsell & Cross-Sell Scripts",
      description: "(ES-Free) 3 / 6 / 12-month retainer package offer & renewal scripts",
      steps: [
        { title: "Paso 1: Upsell Cadence Emails", description: "Monthly / Quarterly / Annual cadence" },
        { title: "Paso 2: Tiered Pricing Calculator", description: "3-tier retainer pricing table" },
        { title: "Paso 3: 3-Tier Comparison Graphic", description: "Visual pricing matrix layout" },
        { title: "Paso 4: Non-English Client Variants", description: "FR/ES retainer offer translations" },
        { title: "Paso 5: Ongoing Retainer Contract", description: "Signed rolling retainer MSA" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Retainer Upsell & Cross-Sell Scripts",
      description: "(HI-फ्रीलांस) 3 / 6 / 12-month retainer package offer & renewal scripts",
      steps: [
        { title: "चरण 1: Upsell Cadence Emails", description: "Monthly / Quarterly / Annual cadence" },
        { title: "चरण 2: Tiered Pricing Calculator", description: "3-tier retainer pricing table" },
        { title: "चरण 3: 3-Tier Comparison Graphic", description: "Visual pricing matrix layout" },
        { title: "चरण 4: Non-English Client Variants", description: "FR/ES retainer offer translations" },
        { title: "चरण 5: Ongoing Retainer Contract", description: "Signed rolling retainer MSA" },
      ],
    },
    ar: {
      title: "AR-ح: Retainer Upsell & Cross-Sell Scripts",
      description: "(AR-ح) 3 / 6 / 12-month retainer package offer & renewal scripts",
      steps: [
        { title: "الخطوة 1: Upsell Cadence Emails", description: "Monthly / Quarterly / Annual cadence" },
        { title: "الخطوة 2: Tiered Pricing Calculator", description: "3-tier retainer pricing table" },
        { title: "الخطوة 3: 3-Tier Comparison Graphic", description: "Visual pricing matrix layout" },
        { title: "الخطوة 4: Non-English Client Variants", description: "FR/ES retainer offer translations" },
        { title: "الخطوة 5: Ongoing Retainer Contract", description: "Signed rolling retainer MSA" },
      ],
    },
  },
  'freelance-testimonial-get': {
    zh: {
      title: "客户好评推荐信获取SOP",
      description: "项目结束24h内邮件+Google好评",
      steps: [
        { title: "英文索要好评邮件", description: "催评邮件模板3版" },
        { title: "感谢卡", description: "项目结束感谢卡片" },
        { title: "客户母语邮件", description: "小语种客户版本" },
        { title: "好评截图卡", description: "截图做社媒卡片" },
        { title: "好评本PDF", description: "所有好评合并PDF作品集" },
      ],
    },
    en: {
      title: "Client Testimonial & Review SOP",
      description: "Post-delivery 24h follow-up email + Google review request system",
      steps: [
        { title: "3 Testimonial Email Flavors", description: "3 polite ask-for-review templates" },
        { title: "Thank You Card Printable", description: "Post-engagement thank-you card art" },
        { title: "Client Native Language", description: "FR/ES thank-you variants" },
        { title: "Review Social Cards", description: "Screenshot → social card artwork" },
        { title: "Testimonial Book PDF", description: "All endorsements consolidated PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Client Testimonial & Review SOP",
      description: "(FR-Free) Post-delivery 24h follow-up email + Google review request system",
      steps: [
        { title: "Étape 1: 3 Testimonial Email Flavors", description: "3 polite ask-for-review templates" },
        { title: "Étape 2: Thank You Card Printable", description: "Post-engagement thank-you card art" },
        { title: "Étape 3: Client Native Language", description: "FR/ES thank-you variants" },
        { title: "Étape 4: Review Social Cards", description: "Screenshot → social card artwork" },
        { title: "Étape 5: Testimonial Book PDF", description: "All endorsements consolidated PDF" },
      ],
    },
    es: {
      title: "ES-Free: Client Testimonial & Review SOP",
      description: "(ES-Free) Post-delivery 24h follow-up email + Google review request system",
      steps: [
        { title: "Paso 1: 3 Testimonial Email Flavors", description: "3 polite ask-for-review templates" },
        { title: "Paso 2: Thank You Card Printable", description: "Post-engagement thank-you card art" },
        { title: "Paso 3: Client Native Language", description: "FR/ES thank-you variants" },
        { title: "Paso 4: Review Social Cards", description: "Screenshot → social card artwork" },
        { title: "Paso 5: Testimonial Book PDF", description: "All endorsements consolidated PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Client Testimonial & Review SOP",
      description: "(HI-फ्रीलांस) Post-delivery 24h follow-up email + Google review request system",
      steps: [
        { title: "चरण 1: 3 Testimonial Email Flavors", description: "3 polite ask-for-review templates" },
        { title: "चरण 2: Thank You Card Printable", description: "Post-engagement thank-you card art" },
        { title: "चरण 3: Client Native Language", description: "FR/ES thank-you variants" },
        { title: "चरण 4: Review Social Cards", description: "Screenshot → social card artwork" },
        { title: "चरण 5: Testimonial Book PDF", description: "All endorsements consolidated PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Client Testimonial & Review SOP",
      description: "(AR-ح) Post-delivery 24h follow-up email + Google review request system",
      steps: [
        { title: "الخطوة 1: 3 Testimonial Email Flavors", description: "3 polite ask-for-review templates" },
        { title: "الخطوة 2: Thank You Card Printable", description: "Post-engagement thank-you card art" },
        { title: "الخطوة 3: Client Native Language", description: "FR/ES thank-you variants" },
        { title: "الخطوة 4: Review Social Cards", description: "Screenshot → social card artwork" },
        { title: "الخطوة 5: Testimonial Book PDF", description: "All endorsements consolidated PDF" },
      ],
    },
  },
  'ai-tools-stack-15-freelancer': {
    zh: {
      title: "自由职业15款AI提效工具栈",
      description: "文案/设计/翻译/视频/SEO全套",
      steps: [
        { title: "文案AI", description: "所有文案类AI推荐" },
        { title: "配图AI", description: "一键生成设计" },
        { title: "翻译AI", description: "多语言翻译校对" },
        { title: "压缩AI", description: "图片视频" },
        { title: "工具栈手册", description: "15款工具使用说明PDF" },
      ],
    },
    en: {
      title: "15 AI Tools Stack for Freelancers",
      description: "Copy / Design / Translate / Video / SEO full AI productivity kit",
      steps: [
        { title: "Copy AI Roundup", description: "Curated copywriting AI recommendations" },
        { title: "Design AI Roundup", description: "One-click design AI picklist" },
        { title: "Translation AI Stack", description: "Multilingual translate + proof stack" },
        { title: "Media Compression AI", description: "Image / video compression AI tools" },
        { title: "Toolkit Handbook PDF", description: "15-tool usage playbook PDF" },
      ],
    },
    fr: {
      title: "FR-Free: 15 AI Tools Stack for Freelancers",
      description: "(FR-Free) Copy / Design / Translate / Video / SEO full AI productivity kit",
      steps: [
        { title: "Étape 1: Copy AI Roundup", description: "Curated copywriting AI recommendations" },
        { title: "Étape 2: Design AI Roundup", description: "One-click design AI picklist" },
        { title: "Étape 3: Translation AI Stack", description: "Multilingual translate + proof stack" },
        { title: "Étape 4: Media Compression AI", description: "Image / video compression AI tools" },
        { title: "Étape 5: Toolkit Handbook PDF", description: "15-tool usage playbook PDF" },
      ],
    },
    es: {
      title: "ES-Free: 15 AI Tools Stack for Freelancers",
      description: "(ES-Free) Copy / Design / Translate / Video / SEO full AI productivity kit",
      steps: [
        { title: "Paso 1: Copy AI Roundup", description: "Curated copywriting AI recommendations" },
        { title: "Paso 2: Design AI Roundup", description: "One-click design AI picklist" },
        { title: "Paso 3: Translation AI Stack", description: "Multilingual translate + proof stack" },
        { title: "Paso 4: Media Compression AI", description: "Image / video compression AI tools" },
        { title: "Paso 5: Toolkit Handbook PDF", description: "15-tool usage playbook PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: 15 AI Tools Stack for Freelancers",
      description: "(HI-फ्रीलांस) Copy / Design / Translate / Video / SEO full AI productivity kit",
      steps: [
        { title: "चरण 1: Copy AI Roundup", description: "Curated copywriting AI recommendations" },
        { title: "चरण 2: Design AI Roundup", description: "One-click design AI picklist" },
        { title: "चरण 3: Translation AI Stack", description: "Multilingual translate + proof stack" },
        { title: "चरण 4: Media Compression AI", description: "Image / video compression AI tools" },
        { title: "चरण 5: Toolkit Handbook PDF", description: "15-tool usage playbook PDF" },
      ],
    },
    ar: {
      title: "AR-ح: 15 AI Tools Stack for Freelancers",
      description: "(AR-ح) Copy / Design / Translate / Video / SEO full AI productivity kit",
      steps: [
        { title: "الخطوة 1: Copy AI Roundup", description: "Curated copywriting AI recommendations" },
        { title: "الخطوة 2: Design AI Roundup", description: "One-click design AI picklist" },
        { title: "الخطوة 3: Translation AI Stack", description: "Multilingual translate + proof stack" },
        { title: "الخطوة 4: Media Compression AI", description: "Image / video compression AI tools" },
        { title: "الخطوة 5: Toolkit Handbook PDF", description: "15-tool usage playbook PDF" },
      ],
    },
  },
  'freelance-tax-invoice-pack': {
    zh: {
      title: "自由职业报税资料包",
      description: "12个月发票+合同+收入汇总",
      steps: [
        { title: "年度收入/税算", description: "阶梯税率算预估" },
        { title: "英文税局邮件模板", description: "税局沟通邮件" },
        { title: "汇总仪表盘图", description: "可视化收入图" },
        { title: "12个月发票合并", description: "PDF归档按序" },
        { title: "合同+发票总PDF", description: "一本总档加密" },
      ],
    },
    en: {
      title: "Freelancer Year-End Tax Docs Pack",
      description: "12-month invoices / contracts / revenue summary for tax filing",
      steps: [
        { title: "Revenue + Tax Projection", description: "Progressive bracket tax estimate" },
        { title: "English Tax-Agency Templates", description: "Tax-authority communication templates" },
        { title: "Summary Dashboard Visual", description: "Revenue visualization dashboard" },
        { title: "12 Month Invoice Merge", description: "Chronologically archived invoice PDF" },
        { title: "Encrypted Master Pack", description: "Master contracts + invoices encrypted PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Freelancer Year-End Tax Docs Pack",
      description: "(FR-Free) 12-month invoices / contracts / revenue summary for tax filing",
      steps: [
        { title: "Étape 1: Revenue + Tax Projection", description: "Progressive bracket tax estimate" },
        { title: "Étape 2: English Tax-Agency Templates", description: "Tax-authority communication templates" },
        { title: "Étape 3: Summary Dashboard Visual", description: "Revenue visualization dashboard" },
        { title: "Étape 4: 12 Month Invoice Merge", description: "Chronologically archived invoice PDF" },
        { title: "Étape 5: Encrypted Master Pack", description: "Master contracts + invoices encrypted PDF" },
      ],
    },
    es: {
      title: "ES-Free: Freelancer Year-End Tax Docs Pack",
      description: "(ES-Free) 12-month invoices / contracts / revenue summary for tax filing",
      steps: [
        { title: "Paso 1: Revenue + Tax Projection", description: "Progressive bracket tax estimate" },
        { title: "Paso 2: English Tax-Agency Templates", description: "Tax-authority communication templates" },
        { title: "Paso 3: Summary Dashboard Visual", description: "Revenue visualization dashboard" },
        { title: "Paso 4: 12 Month Invoice Merge", description: "Chronologically archived invoice PDF" },
        { title: "Paso 5: Encrypted Master Pack", description: "Master contracts + invoices encrypted PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelancer Year-End Tax Docs Pack",
      description: "(HI-फ्रीलांस) 12-month invoices / contracts / revenue summary for tax filing",
      steps: [
        { title: "चरण 1: Revenue + Tax Projection", description: "Progressive bracket tax estimate" },
        { title: "चरण 2: English Tax-Agency Templates", description: "Tax-authority communication templates" },
        { title: "चरण 3: Summary Dashboard Visual", description: "Revenue visualization dashboard" },
        { title: "चरण 4: 12 Month Invoice Merge", description: "Chronologically archived invoice PDF" },
        { title: "चरण 5: Encrypted Master Pack", description: "Master contracts + invoices encrypted PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Freelancer Year-End Tax Docs Pack",
      description: "(AR-ح) 12-month invoices / contracts / revenue summary for tax filing",
      steps: [
        { title: "الخطوة 1: Revenue + Tax Projection", description: "Progressive bracket tax estimate" },
        { title: "الخطوة 2: English Tax-Agency Templates", description: "Tax-authority communication templates" },
        { title: "الخطوة 3: Summary Dashboard Visual", description: "Revenue visualization dashboard" },
        { title: "الخطوة 4: 12 Month Invoice Merge", description: "Chronologically archived invoice PDF" },
        { title: "الخطوة 5: Encrypted Master Pack", description: "Master contracts + invoices encrypted PDF" },
      ],
    },
  },
  'freelance-referral-program': {
    zh: {
      title: "老客户转介绍奖励计划",
      description: "10%推荐佣金规则+自动化邮件",
      steps: [
        { title: "英文推介计划说明", description: "计划+佣金+兑现规则" },
        { title: "奖励海报", description: "社交平台分享图" },
        { title: "客户母语", description: "双语客户说明" },
        { title: "推荐码编码", description: "每位客户专属推荐码" },
        { title: "计划PDF", description: "条款+合同+佣金表" },
      ],
    },
    en: {
      title: "Client Referral Reward Program",
      description: "10% referral commission structure + automated notification emails",
      steps: [
        { title: "English Program Terms", description: "Rules, reward, redemption flow" },
        { title: "Sharing Poster Artwork", description: "Shareable social poster visual" },
        { title: "Bilingual Client Copy", description: "EN + FR/ES bilingual variants" },
        { title: "Referral Code Encoding", description: "Per-client unique referral codes" },
        { title: "Program Contract PDF", description: "Terms + contract + commission sheet" },
      ],
    },
    fr: {
      title: "FR-Free: Client Referral Reward Program",
      description: "(FR-Free) 10% referral commission structure + automated notification emails",
      steps: [
        { title: "Étape 1: English Program Terms", description: "Rules, reward, redemption flow" },
        { title: "Étape 2: Sharing Poster Artwork", description: "Shareable social poster visual" },
        { title: "Étape 3: Bilingual Client Copy", description: "EN + FR/ES bilingual variants" },
        { title: "Étape 4: Referral Code Encoding", description: "Per-client unique referral codes" },
        { title: "Étape 5: Program Contract PDF", description: "Terms + contract + commission sheet" },
      ],
    },
    es: {
      title: "ES-Free: Client Referral Reward Program",
      description: "(ES-Free) 10% referral commission structure + automated notification emails",
      steps: [
        { title: "Paso 1: English Program Terms", description: "Rules, reward, redemption flow" },
        { title: "Paso 2: Sharing Poster Artwork", description: "Shareable social poster visual" },
        { title: "Paso 3: Bilingual Client Copy", description: "EN + FR/ES bilingual variants" },
        { title: "Paso 4: Referral Code Encoding", description: "Per-client unique referral codes" },
        { title: "Paso 5: Program Contract PDF", description: "Terms + contract + commission sheet" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Client Referral Reward Program",
      description: "(HI-फ्रीलांस) 10% referral commission structure + automated notification emails",
      steps: [
        { title: "चरण 1: English Program Terms", description: "Rules, reward, redemption flow" },
        { title: "चरण 2: Sharing Poster Artwork", description: "Shareable social poster visual" },
        { title: "चरण 3: Bilingual Client Copy", description: "EN + FR/ES bilingual variants" },
        { title: "चरण 4: Referral Code Encoding", description: "Per-client unique referral codes" },
        { title: "चरण 5: Program Contract PDF", description: "Terms + contract + commission sheet" },
      ],
    },
    ar: {
      title: "AR-ح: Client Referral Reward Program",
      description: "(AR-ح) 10% referral commission structure + automated notification emails",
      steps: [
        { title: "الخطوة 1: English Program Terms", description: "Rules, reward, redemption flow" },
        { title: "الخطوة 2: Sharing Poster Artwork", description: "Shareable social poster visual" },
        { title: "الخطوة 3: Bilingual Client Copy", description: "EN + FR/ES bilingual variants" },
        { title: "الخطوة 4: Referral Code Encoding", description: "Per-client unique referral codes" },
        { title: "الخطوة 5: Program Contract PDF", description: "Terms + contract + commission sheet" },
      ],
    },
  },
  'freelance-30-60-90-new-client': {
    zh: {
      title: "新客户30/60/90天里程碑交付",
      description: "阶段交付+演示会+签验收表",
      steps: [
        { title: "英文3阶段邮件", description: "每30天报告邮件" },
        { title: "报告图", description: "交付可视化" },
        { title: "德语/法语报告", description: "欧洲客户报告翻译" },
        { title: "验收报告签名", description: "客户签PDF" },
        { title: "所有报告合并", description: "项目总记录PDF" },
      ],
    },
    en: {
      title: "New Client 30/60/90 Milestone Delivery",
      description: "Phase deliverables, demo calls and sign-off acceptance forms",
      steps: [
        { title: "3 English Phase Emails", description: "30/60/90 reporting email cadence" },
        { title: "Deliverable Visuals", description: "Data-backed presentation graphics" },
        { title: "FR / DE Report Locale", description: "EU-market translated reports" },
        { title: "Signed Sign-Off Report", description: "Client countersigned acceptance PDF" },
        { title: "Report Pack Merge", description: "Full project history consolidated PDF" },
      ],
    },
    fr: {
      title: "FR-Free: New Client 30/60/90 Milestone Delivery",
      description: "(FR-Free) Phase deliverables, demo calls and sign-off acceptance forms",
      steps: [
        { title: "Étape 1: 3 English Phase Emails", description: "30/60/90 reporting email cadence" },
        { title: "Étape 2: Deliverable Visuals", description: "Data-backed presentation graphics" },
        { title: "Étape 3: FR / DE Report Locale", description: "EU-market translated reports" },
        { title: "Étape 4: Signed Sign-Off Report", description: "Client countersigned acceptance PDF" },
        { title: "Étape 5: Report Pack Merge", description: "Full project history consolidated PDF" },
      ],
    },
    es: {
      title: "ES-Free: New Client 30/60/90 Milestone Delivery",
      description: "(ES-Free) Phase deliverables, demo calls and sign-off acceptance forms",
      steps: [
        { title: "Paso 1: 3 English Phase Emails", description: "30/60/90 reporting email cadence" },
        { title: "Paso 2: Deliverable Visuals", description: "Data-backed presentation graphics" },
        { title: "Paso 3: FR / DE Report Locale", description: "EU-market translated reports" },
        { title: "Paso 4: Signed Sign-Off Report", description: "Client countersigned acceptance PDF" },
        { title: "Paso 5: Report Pack Merge", description: "Full project history consolidated PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: New Client 30/60/90 Milestone Delivery",
      description: "(HI-फ्रीलांस) Phase deliverables, demo calls and sign-off acceptance forms",
      steps: [
        { title: "चरण 1: 3 English Phase Emails", description: "30/60/90 reporting email cadence" },
        { title: "चरण 2: Deliverable Visuals", description: "Data-backed presentation graphics" },
        { title: "चरण 3: FR / DE Report Locale", description: "EU-market translated reports" },
        { title: "चरण 4: Signed Sign-Off Report", description: "Client countersigned acceptance PDF" },
        { title: "चरण 5: Report Pack Merge", description: "Full project history consolidated PDF" },
      ],
    },
    ar: {
      title: "AR-ح: New Client 30/60/90 Milestone Delivery",
      description: "(AR-ح) Phase deliverables, demo calls and sign-off acceptance forms",
      steps: [
        { title: "الخطوة 1: 3 English Phase Emails", description: "30/60/90 reporting email cadence" },
        { title: "الخطوة 2: Deliverable Visuals", description: "Data-backed presentation graphics" },
        { title: "الخطوة 3: FR / DE Report Locale", description: "EU-market translated reports" },
        { title: "الخطوة 4: Signed Sign-Off Report", description: "Client countersigned acceptance PDF" },
        { title: "الخطوة 5: Report Pack Merge", description: "Full project history consolidated PDF" },
      ],
    },
  },
  'freelancer-niche-positioning': {
    zh: {
      title: "自由职业利基定位3步法",
      description: "技能×行业×客群三维锁定高客单价",
      steps: [
        { title: "英文定位话术", description: "Elevator Pitch 3版" },
        { title: "服务矩阵图", description: "3×3定位矩阵" },
        { title: "个人介绍长图", description: "社交平台简介长图" },
        { title: "英语润色", description: "专业" },
        { title: "定位文件PDF", description: "品牌定位档案" },
      ],
    },
    en: {
      title: "Freelancer Niche Positioning 3-Step",
      description: "Skill × Industry × Audience 3D positioning lock for premium rates",
      steps: [
        { title: "English Pitch Scripts", description: "3 Elevator Pitch variants" },
        { title: "Service Matrix Diagram", description: "3×3 positioning matrix visual" },
        { title: "Long-Form Bio Graphic", description: "Extended social bio infographic" },
        { title: "English Editorial Polish", description: "Professional tone polish pass" },
        { title: "Positioning Archive PDF", description: "Brand positioning document PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Freelancer Niche Positioning 3-Step",
      description: "(FR-Free) Skill × Industry × Audience 3D positioning lock for premium rates",
      steps: [
        { title: "Étape 1: English Pitch Scripts", description: "3 Elevator Pitch variants" },
        { title: "Étape 2: Service Matrix Diagram", description: "3×3 positioning matrix visual" },
        { title: "Étape 3: Long-Form Bio Graphic", description: "Extended social bio infographic" },
        { title: "Étape 4: English Editorial Polish", description: "Professional tone polish pass" },
        { title: "Étape 5: Positioning Archive PDF", description: "Brand positioning document PDF" },
      ],
    },
    es: {
      title: "ES-Free: Freelancer Niche Positioning 3-Step",
      description: "(ES-Free) Skill × Industry × Audience 3D positioning lock for premium rates",
      steps: [
        { title: "Paso 1: English Pitch Scripts", description: "3 Elevator Pitch variants" },
        { title: "Paso 2: Service Matrix Diagram", description: "3×3 positioning matrix visual" },
        { title: "Paso 3: Long-Form Bio Graphic", description: "Extended social bio infographic" },
        { title: "Paso 4: English Editorial Polish", description: "Professional tone polish pass" },
        { title: "Paso 5: Positioning Archive PDF", description: "Brand positioning document PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelancer Niche Positioning 3-Step",
      description: "(HI-फ्रीलांस) Skill × Industry × Audience 3D positioning lock for premium rates",
      steps: [
        { title: "चरण 1: English Pitch Scripts", description: "3 Elevator Pitch variants" },
        { title: "चरण 2: Service Matrix Diagram", description: "3×3 positioning matrix visual" },
        { title: "चरण 3: Long-Form Bio Graphic", description: "Extended social bio infographic" },
        { title: "चरण 4: English Editorial Polish", description: "Professional tone polish pass" },
        { title: "चरण 5: Positioning Archive PDF", description: "Brand positioning document PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Freelancer Niche Positioning 3-Step",
      description: "(AR-ح) Skill × Industry × Audience 3D positioning lock for premium rates",
      steps: [
        { title: "الخطوة 1: English Pitch Scripts", description: "3 Elevator Pitch variants" },
        { title: "الخطوة 2: Service Matrix Diagram", description: "3×3 positioning matrix visual" },
        { title: "الخطوة 3: Long-Form Bio Graphic", description: "Extended social bio infographic" },
        { title: "الخطوة 4: English Editorial Polish", description: "Professional tone polish pass" },
        { title: "الخطوة 5: Positioning Archive PDF", description: "Brand positioning document PDF" },
      ],
    },
  },
  'freelance-eur-usd-invoice': {
    zh: {
      title: "欧元美元客户收款发票方案",
      description: "Wise/Payoneer多币种开票合规",
      steps: [
        { title: "汇率换算税", description: "汇率波动+税预估" },
        { title: "英文发票说明", description: "发票款项邮件" },
        { title: "发票设计", description: "符合欧盟/IRS规范" },
        { title: "欧盟语言", description: "德法西语版本" },
        { title: "发票PDF", description: "加密+签名" },
      ],
    },
    en: {
      title: "EUR / USD Multi-Currency Invoicing",
      description: "Wise / Payoneer multi-currency compliant invoicing & tax mapping",
      steps: [
        { title: "FX + Tax Projection", description: "FX volatility + tax estimate math" },
        { title: "English Invoice Cover Email", description: "Remittance advice email copy" },
        { title: "Regulatory Invoice Design", description: "EU / IRS compliant layout" },
        { title: "EU Language Versions", description: "FR/DE/ES invoice language" },
        { title: "Signed Invoice PDF", description: "Encrypted + countersigned invoice" },
      ],
    },
    fr: {
      title: "FR-Free: EUR / USD Multi-Currency Invoicing",
      description: "(FR-Free) Wise / Payoneer multi-currency compliant invoicing & tax mapping",
      steps: [
        { title: "Étape 1: FX + Tax Projection", description: "FX volatility + tax estimate math" },
        { title: "Étape 2: English Invoice Cover Email", description: "Remittance advice email copy" },
        { title: "Étape 3: Regulatory Invoice Design", description: "EU / IRS compliant layout" },
        { title: "Étape 4: EU Language Versions", description: "FR/DE/ES invoice language" },
        { title: "Étape 5: Signed Invoice PDF", description: "Encrypted + countersigned invoice" },
      ],
    },
    es: {
      title: "ES-Free: EUR / USD Multi-Currency Invoicing",
      description: "(ES-Free) Wise / Payoneer multi-currency compliant invoicing & tax mapping",
      steps: [
        { title: "Paso 1: FX + Tax Projection", description: "FX volatility + tax estimate math" },
        { title: "Paso 2: English Invoice Cover Email", description: "Remittance advice email copy" },
        { title: "Paso 3: Regulatory Invoice Design", description: "EU / IRS compliant layout" },
        { title: "Paso 4: EU Language Versions", description: "FR/DE/ES invoice language" },
        { title: "Paso 5: Signed Invoice PDF", description: "Encrypted + countersigned invoice" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: EUR / USD Multi-Currency Invoicing",
      description: "(HI-फ्रीलांस) Wise / Payoneer multi-currency compliant invoicing & tax mapping",
      steps: [
        { title: "चरण 1: FX + Tax Projection", description: "FX volatility + tax estimate math" },
        { title: "चरण 2: English Invoice Cover Email", description: "Remittance advice email copy" },
        { title: "चरण 3: Regulatory Invoice Design", description: "EU / IRS compliant layout" },
        { title: "चरण 4: EU Language Versions", description: "FR/DE/ES invoice language" },
        { title: "चरण 5: Signed Invoice PDF", description: "Encrypted + countersigned invoice" },
      ],
    },
    ar: {
      title: "AR-ح: EUR / USD Multi-Currency Invoicing",
      description: "(AR-ح) Wise / Payoneer multi-currency compliant invoicing & tax mapping",
      steps: [
        { title: "الخطوة 1: FX + Tax Projection", description: "FX volatility + tax estimate math" },
        { title: "الخطوة 2: English Invoice Cover Email", description: "Remittance advice email copy" },
        { title: "الخطوة 3: Regulatory Invoice Design", description: "EU / IRS compliant layout" },
        { title: "الخطوة 4: EU Language Versions", description: "FR/DE/ES invoice language" },
        { title: "الخطوة 5: Signed Invoice PDF", description: "Encrypted + countersigned invoice" },
      ],
    },
  },
  'freelancer-podcast-guest': {
    zh: {
      title: "自由职业播客嘉宾曝光获客",
      description: "行业播客Pitch+采访提纲准备",
      steps: [
        { title: "英文Pitch邮件", description: "10家播客Pitch模板" },
        { title: "嘉宾卡", description: "嘉宾社媒宣传图" },
        { title: "英语母语润色", description: "采访提纲润色" },
        { title: "采访回答要点", description: "10个常见问题稿" },
        { title: "媒体资料包PDF", description: "Media Kit下载" },
      ],
    },
    en: {
      title: "Podcast Guest Pitch & Prep Pack",
      description: "Industry podcast pitch email + talking point prep Media Kit",
      steps: [
        { title: "10 Podcast Pitches", description: "10 personalised outreach email templates" },
        { title: "Guest Promo Card", description: "Shareable guest social card" },
        { title: "Native English Outline Polish", description: "Talking points editorial polish" },
        { title: "Interview Q Prep Notes", description: "10 common-question talking points" },
        { title: "Media Kit Download PDF", description: "Guest appearance Media Kit" },
      ],
    },
    fr: {
      title: "FR-Free: Podcast Guest Pitch & Prep Pack",
      description: "(FR-Free) Industry podcast pitch email + talking point prep Media Kit",
      steps: [
        { title: "Étape 1: 10 Podcast Pitches", description: "10 personalised outreach email templates" },
        { title: "Étape 2: Guest Promo Card", description: "Shareable guest social card" },
        { title: "Étape 3: Native English Outline Polish", description: "Talking points editorial polish" },
        { title: "Étape 4: Interview Q Prep Notes", description: "10 common-question talking points" },
        { title: "Étape 5: Media Kit Download PDF", description: "Guest appearance Media Kit" },
      ],
    },
    es: {
      title: "ES-Free: Podcast Guest Pitch & Prep Pack",
      description: "(ES-Free) Industry podcast pitch email + talking point prep Media Kit",
      steps: [
        { title: "Paso 1: 10 Podcast Pitches", description: "10 personalised outreach email templates" },
        { title: "Paso 2: Guest Promo Card", description: "Shareable guest social card" },
        { title: "Paso 3: Native English Outline Polish", description: "Talking points editorial polish" },
        { title: "Paso 4: Interview Q Prep Notes", description: "10 common-question talking points" },
        { title: "Paso 5: Media Kit Download PDF", description: "Guest appearance Media Kit" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Podcast Guest Pitch & Prep Pack",
      description: "(HI-फ्रीलांस) Industry podcast pitch email + talking point prep Media Kit",
      steps: [
        { title: "चरण 1: 10 Podcast Pitches", description: "10 personalised outreach email templates" },
        { title: "चरण 2: Guest Promo Card", description: "Shareable guest social card" },
        { title: "चरण 3: Native English Outline Polish", description: "Talking points editorial polish" },
        { title: "चरण 4: Interview Q Prep Notes", description: "10 common-question talking points" },
        { title: "चरण 5: Media Kit Download PDF", description: "Guest appearance Media Kit" },
      ],
    },
    ar: {
      title: "AR-ح: Podcast Guest Pitch & Prep Pack",
      description: "(AR-ح) Industry podcast pitch email + talking point prep Media Kit",
      steps: [
        { title: "الخطوة 1: 10 Podcast Pitches", description: "10 personalised outreach email templates" },
        { title: "الخطوة 2: Guest Promo Card", description: "Shareable guest social card" },
        { title: "الخطوة 3: Native English Outline Polish", description: "Talking points editorial polish" },
        { title: "الخطوة 4: Interview Q Prep Notes", description: "10 common-question talking points" },
        { title: "الخطوة 5: Media Kit Download PDF", description: "Guest appearance Media Kit" },
      ],
    },
  },
  'freelance-ghostwriting-rate': {
    zh: {
      title: "代笔写作报价梯度计算器",
      description: "500/1500/3000词每档价格表",
      steps: [
        { title: "每档价格算", description: "每词价格+加急费" },
        { title: "英文报价邮件", description: "新客户报价信" },
        { title: "价格表图", description: "官网/社媒价格表" },
        { title: "非英语客户", description: "西/法语翻译" },
        { title: "报价单签名", description: "客户确认存档" },
      ],
    },
    en: {
      title: "Ghostwriting Rate Tier Calculator",
      description: "500 / 1500 / 3000 word tiered pricing and quoting templates",
      steps: [
        { title: "Per-Tier Price Model", description: "Per-word + rush-fee pricing matrix" },
        { title: "English Quote Email", description: "New-client quotation letter" },
        { title: "Rate Sheet Graphic", description: "Website / social rate table visual" },
        { title: "Non-English Locale", description: "FR/ES translated quotation" },
        { title: "Countersigned Quote", description: "Client acknowledged quotation PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Ghostwriting Rate Tier Calculator",
      description: "(FR-Free) 500 / 1500 / 3000 word tiered pricing and quoting templates",
      steps: [
        { title: "Étape 1: Per-Tier Price Model", description: "Per-word + rush-fee pricing matrix" },
        { title: "Étape 2: English Quote Email", description: "New-client quotation letter" },
        { title: "Étape 3: Rate Sheet Graphic", description: "Website / social rate table visual" },
        { title: "Étape 4: Non-English Locale", description: "FR/ES translated quotation" },
        { title: "Étape 5: Countersigned Quote", description: "Client acknowledged quotation PDF" },
      ],
    },
    es: {
      title: "ES-Free: Ghostwriting Rate Tier Calculator",
      description: "(ES-Free) 500 / 1500 / 3000 word tiered pricing and quoting templates",
      steps: [
        { title: "Paso 1: Per-Tier Price Model", description: "Per-word + rush-fee pricing matrix" },
        { title: "Paso 2: English Quote Email", description: "New-client quotation letter" },
        { title: "Paso 3: Rate Sheet Graphic", description: "Website / social rate table visual" },
        { title: "Paso 4: Non-English Locale", description: "FR/ES translated quotation" },
        { title: "Paso 5: Countersigned Quote", description: "Client acknowledged quotation PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Ghostwriting Rate Tier Calculator",
      description: "(HI-फ्रीलांस) 500 / 1500 / 3000 word tiered pricing and quoting templates",
      steps: [
        { title: "चरण 1: Per-Tier Price Model", description: "Per-word + rush-fee pricing matrix" },
        { title: "चरण 2: English Quote Email", description: "New-client quotation letter" },
        { title: "चरण 3: Rate Sheet Graphic", description: "Website / social rate table visual" },
        { title: "चरण 4: Non-English Locale", description: "FR/ES translated quotation" },
        { title: "चरण 5: Countersigned Quote", description: "Client acknowledged quotation PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Ghostwriting Rate Tier Calculator",
      description: "(AR-ح) 500 / 1500 / 3000 word tiered pricing and quoting templates",
      steps: [
        { title: "الخطوة 1: Per-Tier Price Model", description: "Per-word + rush-fee pricing matrix" },
        { title: "الخطوة 2: English Quote Email", description: "New-client quotation letter" },
        { title: "الخطوة 3: Rate Sheet Graphic", description: "Website / social rate table visual" },
        { title: "الخطوة 4: Non-English Locale", description: "FR/ES translated quotation" },
        { title: "الخطوة 5: Countersigned Quote", description: "Client acknowledged quotation PDF" },
      ],
    },
  },
  'freelance-video-editing-portfolio': {
    zh: {
      title: "视频剪辑自由职业作品集",
      description: "Showreel + 10项目案例长图",
      steps: [
        { title: "Showreel封面", description: "视频YouTube首帧" },
        { title: "案例缩略卡", description: "10案例卡片图" },
        { title: "英文案例介绍", description: "每个案例200字内说明" },
        { title: "图片压缩", description: "站点加载快" },
        { title: "作品本PDF", description: "离线作品集下载" },
      ],
    },
    en: {
      title: "Video Editor Portfolio & Showreel",
      description: "Showreel cut + 10 project case cards for freelance video editors",
      steps: [
        { title: "Showreel Thumbnail", description: "YouTube showreel opening frame" },
        { title: "10 Case Thumbnails", description: "10 project thumbnail cards" },
        { title: "English Case Synopses", description: "~200 word per project synopsis" },
        { title: "Web-Optimised Imagery", description: "Fast-loading portfolio thumbnails" },
        { title: "Offline Portfolio Book", description: "Downloadable offline casebook PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Video Editor Portfolio & Showreel",
      description: "(FR-Free) Showreel cut + 10 project case cards for freelance video editors",
      steps: [
        { title: "Étape 1: Showreel Thumbnail", description: "YouTube showreel opening frame" },
        { title: "Étape 2: 10 Case Thumbnails", description: "10 project thumbnail cards" },
        { title: "Étape 3: English Case Synopses", description: "~200 word per project synopsis" },
        { title: "Étape 4: Web-Optimised Imagery", description: "Fast-loading portfolio thumbnails" },
        { title: "Étape 5: Offline Portfolio Book", description: "Downloadable offline casebook PDF" },
      ],
    },
    es: {
      title: "ES-Free: Video Editor Portfolio & Showreel",
      description: "(ES-Free) Showreel cut + 10 project case cards for freelance video editors",
      steps: [
        { title: "Paso 1: Showreel Thumbnail", description: "YouTube showreel opening frame" },
        { title: "Paso 2: 10 Case Thumbnails", description: "10 project thumbnail cards" },
        { title: "Paso 3: English Case Synopses", description: "~200 word per project synopsis" },
        { title: "Paso 4: Web-Optimised Imagery", description: "Fast-loading portfolio thumbnails" },
        { title: "Paso 5: Offline Portfolio Book", description: "Downloadable offline casebook PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Video Editor Portfolio & Showreel",
      description: "(HI-फ्रीलांस) Showreel cut + 10 project case cards for freelance video editors",
      steps: [
        { title: "चरण 1: Showreel Thumbnail", description: "YouTube showreel opening frame" },
        { title: "चरण 2: 10 Case Thumbnails", description: "10 project thumbnail cards" },
        { title: "चरण 3: English Case Synopses", description: "~200 word per project synopsis" },
        { title: "चरण 4: Web-Optimised Imagery", description: "Fast-loading portfolio thumbnails" },
        { title: "चरण 5: Offline Portfolio Book", description: "Downloadable offline casebook PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Video Editor Portfolio & Showreel",
      description: "(AR-ح) Showreel cut + 10 project case cards for freelance video editors",
      steps: [
        { title: "الخطوة 1: Showreel Thumbnail", description: "YouTube showreel opening frame" },
        { title: "الخطوة 2: 10 Case Thumbnails", description: "10 project thumbnail cards" },
        { title: "الخطوة 3: English Case Synopses", description: "~200 word per project synopsis" },
        { title: "الخطوة 4: Web-Optimised Imagery", description: "Fast-loading portfolio thumbnails" },
        { title: "الخطوة 5: Offline Portfolio Book", description: "Downloadable offline casebook PDF" },
      ],
    },
  },
  'freelance-cold-call-script': {
    zh: {
      title: "自由职业冷电话脚本10版",
      description: "SDR/BDR/顾问式/简短/CEO等",
      steps: [
        { title: "英文10版话术", description: "10版不同场景" },
        { title: "母语润色", description: "自然地道英语" },
        { title: "话术卡片", description: "电话前提醒卡" },
        { title: "后续跟进邮件", description: "24小时内邮件" },
        { title: "话术本PDF", description: "打印随身带" },
      ],
    },
    en: {
      title: "Cold-Call Script Library (10 Flavors)",
      description: "SDR / BDR / consultative / short / CEO 10 different call scripts",
      steps: [
        { title: "10 English Script Sets", description: "10 scenario-specific scripts" },
        { title: "Native English Polish", description: "Idiomatic, natural delivery polish" },
        { title: "Pre-Call Cheat Cards", description: "Tear-off quick-reference card" },
        { title: "24h Follow-Up Email", description: "Post-call same-day follow-up" },
        { title: "Script Binder PDF", description: "Printable call script handbook PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Cold-Call Script Library (10 Flavors)",
      description: "(FR-Free) SDR / BDR / consultative / short / CEO 10 different call scripts",
      steps: [
        { title: "Étape 1: 10 English Script Sets", description: "10 scenario-specific scripts" },
        { title: "Étape 2: Native English Polish", description: "Idiomatic, natural delivery polish" },
        { title: "Étape 3: Pre-Call Cheat Cards", description: "Tear-off quick-reference card" },
        { title: "Étape 4: 24h Follow-Up Email", description: "Post-call same-day follow-up" },
        { title: "Étape 5: Script Binder PDF", description: "Printable call script handbook PDF" },
      ],
    },
    es: {
      title: "ES-Free: Cold-Call Script Library (10 Flavors)",
      description: "(ES-Free) SDR / BDR / consultative / short / CEO 10 different call scripts",
      steps: [
        { title: "Paso 1: 10 English Script Sets", description: "10 scenario-specific scripts" },
        { title: "Paso 2: Native English Polish", description: "Idiomatic, natural delivery polish" },
        { title: "Paso 3: Pre-Call Cheat Cards", description: "Tear-off quick-reference card" },
        { title: "Paso 4: 24h Follow-Up Email", description: "Post-call same-day follow-up" },
        { title: "Paso 5: Script Binder PDF", description: "Printable call script handbook PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Cold-Call Script Library (10 Flavors)",
      description: "(HI-फ्रीलांस) SDR / BDR / consultative / short / CEO 10 different call scripts",
      steps: [
        { title: "चरण 1: 10 English Script Sets", description: "10 scenario-specific scripts" },
        { title: "चरण 2: Native English Polish", description: "Idiomatic, natural delivery polish" },
        { title: "चरण 3: Pre-Call Cheat Cards", description: "Tear-off quick-reference card" },
        { title: "चरण 4: 24h Follow-Up Email", description: "Post-call same-day follow-up" },
        { title: "चरण 5: Script Binder PDF", description: "Printable call script handbook PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Cold-Call Script Library (10 Flavors)",
      description: "(AR-ح) SDR / BDR / consultative / short / CEO 10 different call scripts",
      steps: [
        { title: "الخطوة 1: 10 English Script Sets", description: "10 scenario-specific scripts" },
        { title: "الخطوة 2: Native English Polish", description: "Idiomatic, natural delivery polish" },
        { title: "الخطوة 3: Pre-Call Cheat Cards", description: "Tear-off quick-reference card" },
        { title: "الخطوة 4: 24h Follow-Up Email", description: "Post-call same-day follow-up" },
        { title: "الخطوة 5: Script Binder PDF", description: "Printable call script handbook PDF" },
      ],
    },
  },
  'freelance-wordpress-care-plan': {
    zh: {
      title: "WordPress维护月度套餐销售",
      description: "备份/更新/安全/小修改4档Care Plan",
      steps: [
        { title: "英文Care Plan说明", description: "套餐3档介绍文案" },
        { title: "套餐价格梯度", description: "Basic/Pro/Agency报价" },
        { title: "套餐对比图", description: "3档对比视觉图" },
        { title: "德法语", description: "欧洲客户套餐" },
        { title: "服务合同签", description: "客户确认长期" },
      ],
    },
    en: {
      title: "WordPress Care Plan Monthly Sales",
      description: "Backup / updates / security / tweaks 3-tier Care Plan offer",
      steps: [
        { title: "English Care Plan Deck", description: "3-tier service introduction deck" },
        { title: "Tiered Pricing Model", description: "Basic / Pro / Agency tier pricing" },
        { title: "Tiered Comparison Graphic", description: "Side-by-side 3-tier visual" },
        { title: "EU FR/DE Locale", description: "FR/DE European client versions" },
        { title: "Signed Care Contract", description: "Long-term service countersigned" },
      ],
    },
    fr: {
      title: "FR-Free: WordPress Care Plan Monthly Sales",
      description: "(FR-Free) Backup / updates / security / tweaks 3-tier Care Plan offer",
      steps: [
        { title: "Étape 1: English Care Plan Deck", description: "3-tier service introduction deck" },
        { title: "Étape 2: Tiered Pricing Model", description: "Basic / Pro / Agency tier pricing" },
        { title: "Étape 3: Tiered Comparison Graphic", description: "Side-by-side 3-tier visual" },
        { title: "Étape 4: EU FR/DE Locale", description: "FR/DE European client versions" },
        { title: "Étape 5: Signed Care Contract", description: "Long-term service countersigned" },
      ],
    },
    es: {
      title: "ES-Free: WordPress Care Plan Monthly Sales",
      description: "(ES-Free) Backup / updates / security / tweaks 3-tier Care Plan offer",
      steps: [
        { title: "Paso 1: English Care Plan Deck", description: "3-tier service introduction deck" },
        { title: "Paso 2: Tiered Pricing Model", description: "Basic / Pro / Agency tier pricing" },
        { title: "Paso 3: Tiered Comparison Graphic", description: "Side-by-side 3-tier visual" },
        { title: "Paso 4: EU FR/DE Locale", description: "FR/DE European client versions" },
        { title: "Paso 5: Signed Care Contract", description: "Long-term service countersigned" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: WordPress Care Plan Monthly Sales",
      description: "(HI-फ्रीलांस) Backup / updates / security / tweaks 3-tier Care Plan offer",
      steps: [
        { title: "चरण 1: English Care Plan Deck", description: "3-tier service introduction deck" },
        { title: "चरण 2: Tiered Pricing Model", description: "Basic / Pro / Agency tier pricing" },
        { title: "चरण 3: Tiered Comparison Graphic", description: "Side-by-side 3-tier visual" },
        { title: "चरण 4: EU FR/DE Locale", description: "FR/DE European client versions" },
        { title: "चरण 5: Signed Care Contract", description: "Long-term service countersigned" },
      ],
    },
    ar: {
      title: "AR-ح: WordPress Care Plan Monthly Sales",
      description: "(AR-ح) Backup / updates / security / tweaks 3-tier Care Plan offer",
      steps: [
        { title: "الخطوة 1: English Care Plan Deck", description: "3-tier service introduction deck" },
        { title: "الخطوة 2: Tiered Pricing Model", description: "Basic / Pro / Agency tier pricing" },
        { title: "الخطوة 3: Tiered Comparison Graphic", description: "Side-by-side 3-tier visual" },
        { title: "الخطوة 4: EU FR/DE Locale", description: "FR/DE European client versions" },
        { title: "الخطوة 5: Signed Care Contract", description: "Long-term service countersigned" },
      ],
    },
  },
  'freelance-notion-crm-build': {
    zh: {
      title: "Notion自建客户CRM看板",
      description: "线索/在谈/交付/售后4阶段自动化",
      steps: [
        { title: "CRM封面", description: "Notion数据库Page封面" },
        { title: "英文字段提示", description: "属性字段说明语" },
        { title: "客户ID编码", description: "客户唯一编号生成" },
        { title: "操作指南PDF", description: "新人手册" },
        { title: "模板备份PDF", description: "Notion离线备份" },
      ],
    },
    en: {
      title: "Notion CRM Dashboard Build",
      description: "Leads / active / delivery / after-sales 4-stage Notion CRM",
      steps: [
        { title: "CRM Database Cover", description: "Notion page cover artwork" },
        { title: "English Property Hints", description: "Per-field English helper text" },
        { title: "Client ID Encoding", description: "Unique customer ID generation" },
        { title: "SOP Handbook PDF", description: "Onboarding manual for team" },
        { title: "Offline Backup PDF", description: "Printable Notion template backup" },
      ],
    },
    fr: {
      title: "FR-Free: Notion CRM Dashboard Build",
      description: "(FR-Free) Leads / active / delivery / after-sales 4-stage Notion CRM",
      steps: [
        { title: "Étape 1: CRM Database Cover", description: "Notion page cover artwork" },
        { title: "Étape 2: English Property Hints", description: "Per-field English helper text" },
        { title: "Étape 3: Client ID Encoding", description: "Unique customer ID generation" },
        { title: "Étape 4: SOP Handbook PDF", description: "Onboarding manual for team" },
        { title: "Étape 5: Offline Backup PDF", description: "Printable Notion template backup" },
      ],
    },
    es: {
      title: "ES-Free: Notion CRM Dashboard Build",
      description: "(ES-Free) Leads / active / delivery / after-sales 4-stage Notion CRM",
      steps: [
        { title: "Paso 1: CRM Database Cover", description: "Notion page cover artwork" },
        { title: "Paso 2: English Property Hints", description: "Per-field English helper text" },
        { title: "Paso 3: Client ID Encoding", description: "Unique customer ID generation" },
        { title: "Paso 4: SOP Handbook PDF", description: "Onboarding manual for team" },
        { title: "Paso 5: Offline Backup PDF", description: "Printable Notion template backup" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Notion CRM Dashboard Build",
      description: "(HI-फ्रीलांस) Leads / active / delivery / after-sales 4-stage Notion CRM",
      steps: [
        { title: "चरण 1: CRM Database Cover", description: "Notion page cover artwork" },
        { title: "चरण 2: English Property Hints", description: "Per-field English helper text" },
        { title: "चरण 3: Client ID Encoding", description: "Unique customer ID generation" },
        { title: "चरण 4: SOP Handbook PDF", description: "Onboarding manual for team" },
        { title: "चरण 5: Offline Backup PDF", description: "Printable Notion template backup" },
      ],
    },
    ar: {
      title: "AR-ح: Notion CRM Dashboard Build",
      description: "(AR-ح) Leads / active / delivery / after-sales 4-stage Notion CRM",
      steps: [
        { title: "الخطوة 1: CRM Database Cover", description: "Notion page cover artwork" },
        { title: "الخطوة 2: English Property Hints", description: "Per-field English helper text" },
        { title: "الخطوة 3: Client ID Encoding", description: "Unique customer ID generation" },
        { title: "الخطوة 4: SOP Handbook PDF", description: "Onboarding manual for team" },
        { title: "الخطوة 5: Offline Backup PDF", description: "Printable Notion template backup" },
      ],
    },
  },
  'freelance-micro-saas-idea': {
    zh: {
      title: "自由职业→微SaaS产品化路径",
      description: "服务痛点→Notion/Form→付费订阅5步",
      steps: [
        { title: "英文Landing文案", description: "H1/Sub/CTA文案" },
        { title: "Landing配图", description: "Hero图/截图/Mockup" },
        { title: "图片压缩", description: "Landing页加载快" },
        { title: "优惠码编码", description: "首发优惠码生成" },
        { title: "产品路线图PDF", description: "Roadmap 12个月" },
      ],
    },
    en: {
      title: "Freelancer → Micro-SaaS Path",
      description: "Service pain → Notion MVP → paid subscription 5-step playbook",
      steps: [
        { title: "English Landing Copy", description: "H1 / subhead / CTA landing copy" },
        { title: "Landing Page Visuals", description: "Hero / screenshot / mockup artwork" },
        { title: "WebP Compression", description: "Fast-loading landing image assets" },
        { title: "Launch Code Encoding", description: "Launch coupon code generation" },
        { title: "Product Roadmap PDF", description: "12-month Roadmap document" },
      ],
    },
    fr: {
      title: "FR-Free: Freelancer → Micro-SaaS Path",
      description: "(FR-Free) Service pain → Notion MVP → paid subscription 5-step playbook",
      steps: [
        { title: "Étape 1: English Landing Copy", description: "H1 / subhead / CTA landing copy" },
        { title: "Étape 2: Landing Page Visuals", description: "Hero / screenshot / mockup artwork" },
        { title: "Étape 3: WebP Compression", description: "Fast-loading landing image assets" },
        { title: "Étape 4: Launch Code Encoding", description: "Launch coupon code generation" },
        { title: "Étape 5: Product Roadmap PDF", description: "12-month Roadmap document" },
      ],
    },
    es: {
      title: "ES-Free: Freelancer → Micro-SaaS Path",
      description: "(ES-Free) Service pain → Notion MVP → paid subscription 5-step playbook",
      steps: [
        { title: "Paso 1: English Landing Copy", description: "H1 / subhead / CTA landing copy" },
        { title: "Paso 2: Landing Page Visuals", description: "Hero / screenshot / mockup artwork" },
        { title: "Paso 3: WebP Compression", description: "Fast-loading landing image assets" },
        { title: "Paso 4: Launch Code Encoding", description: "Launch coupon code generation" },
        { title: "Paso 5: Product Roadmap PDF", description: "12-month Roadmap document" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Freelancer → Micro-SaaS Path",
      description: "(HI-फ्रीलांस) Service pain → Notion MVP → paid subscription 5-step playbook",
      steps: [
        { title: "चरण 1: English Landing Copy", description: "H1 / subhead / CTA landing copy" },
        { title: "चरण 2: Landing Page Visuals", description: "Hero / screenshot / mockup artwork" },
        { title: "चरण 3: WebP Compression", description: "Fast-loading landing image assets" },
        { title: "चरण 4: Launch Code Encoding", description: "Launch coupon code generation" },
        { title: "चरण 5: Product Roadmap PDF", description: "12-month Roadmap document" },
      ],
    },
    ar: {
      title: "AR-ح: Freelancer → Micro-SaaS Path",
      description: "(AR-ح) Service pain → Notion MVP → paid subscription 5-step playbook",
      steps: [
        { title: "الخطوة 1: English Landing Copy", description: "H1 / subhead / CTA landing copy" },
        { title: "الخطوة 2: Landing Page Visuals", description: "Hero / screenshot / mockup artwork" },
        { title: "الخطوة 3: WebP Compression", description: "Fast-loading landing image assets" },
        { title: "الخطوة 4: Launch Code Encoding", description: "Launch coupon code generation" },
        { title: "الخطوة 5: Product Roadmap PDF", description: "12-month Roadmap document" },
      ],
    },
  },
  'freelance-monthly-retro': {
    zh: {
      title: "自由职业每月复盘7指标",
      description: "收入/客户/工时/渠道ROI/健康5项",
      steps: [
        { title: "ROI/增长率算", description: "月环比/同比" },
        { title: "仪表盘图", description: "7指标可视化" },
        { title: "英文复盘邮件", description: "给自己或合伙人" },
        { title: "欧洲合作方", description: "外语月度复盘" },
        { title: "存档PDF", description: "每季度合并一本" },
      ],
    },
    en: {
      title: "Monthly Freelancer Retro 7 KPIs",
      description: "Revenue / clients / hours / channel ROI / wellness 5-point monthly review",
      steps: [
        { title: "ROI & Growth Calc", description: "MoM / YoY growth calculator" },
        { title: "Dashboard Visualization", description: "7 KPI performance dashboard art" },
        { title: "English Retro Narrative", description: "Self / partner retrospective notes" },
        { title: "EU Stakeholder Locale", description: "FR/DE partner retrospective translation" },
        { title: "Quarterly Archive PDF", description: "Quarterly bound retrospective PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Monthly Freelancer Retro 7 KPIs",
      description: "(FR-Free) Revenue / clients / hours / channel ROI / wellness 5-point monthly review",
      steps: [
        { title: "Étape 1: ROI & Growth Calc", description: "MoM / YoY growth calculator" },
        { title: "Étape 2: Dashboard Visualization", description: "7 KPI performance dashboard art" },
        { title: "Étape 3: English Retro Narrative", description: "Self / partner retrospective notes" },
        { title: "Étape 4: EU Stakeholder Locale", description: "FR/DE partner retrospective translation" },
        { title: "Étape 5: Quarterly Archive PDF", description: "Quarterly bound retrospective PDF" },
      ],
    },
    es: {
      title: "ES-Free: Monthly Freelancer Retro 7 KPIs",
      description: "(ES-Free) Revenue / clients / hours / channel ROI / wellness 5-point monthly review",
      steps: [
        { title: "Paso 1: ROI & Growth Calc", description: "MoM / YoY growth calculator" },
        { title: "Paso 2: Dashboard Visualization", description: "7 KPI performance dashboard art" },
        { title: "Paso 3: English Retro Narrative", description: "Self / partner retrospective notes" },
        { title: "Paso 4: EU Stakeholder Locale", description: "FR/DE partner retrospective translation" },
        { title: "Paso 5: Quarterly Archive PDF", description: "Quarterly bound retrospective PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Monthly Freelancer Retro 7 KPIs",
      description: "(HI-फ्रीलांस) Revenue / clients / hours / channel ROI / wellness 5-point monthly review",
      steps: [
        { title: "चरण 1: ROI & Growth Calc", description: "MoM / YoY growth calculator" },
        { title: "चरण 2: Dashboard Visualization", description: "7 KPI performance dashboard art" },
        { title: "चरण 3: English Retro Narrative", description: "Self / partner retrospective notes" },
        { title: "चरण 4: EU Stakeholder Locale", description: "FR/DE partner retrospective translation" },
        { title: "चरण 5: Quarterly Archive PDF", description: "Quarterly bound retrospective PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Monthly Freelancer Retro 7 KPIs",
      description: "(AR-ح) Revenue / clients / hours / channel ROI / wellness 5-point monthly review",
      steps: [
        { title: "الخطوة 1: ROI & Growth Calc", description: "MoM / YoY growth calculator" },
        { title: "الخطوة 2: Dashboard Visualization", description: "7 KPI performance dashboard art" },
        { title: "الخطوة 3: English Retro Narrative", description: "Self / partner retrospective notes" },
        { title: "الخطوة 4: EU Stakeholder Locale", description: "FR/DE partner retrospective translation" },
        { title: "الخطوة 5: Quarterly Archive PDF", description: "Quarterly bound retrospective PDF" },
      ],
    },
  },
  'freelance-ca-fiverr-level-up': {
    zh: {
      title: "Fiverr冲Top Rated Seller 6月计划",
      description: "按时交付率/评价/留存3指标达成",
      steps: [
        { title: "进度算", description: "每月评价数目标" },
        { title: "英文催评邮件", description: "订单后24h催评" },
        { title: "升级里程碑图", description: "每月进度图" },
        { title: "英语润色", description: "专业邮件" },
        { title: "升级手册", description: "TRS条件清单PDF" },
      ],
    },
    en: {
      title: "6-Month Fiverr → Top Rated Seller",
      description: "6-month plan for On-time / reviews / retention TRS badge targets",
      steps: [
        { title: "Progress Calculator", description: "Monthly review count targets" },
        { title: "English Post-Delivery Ask", description: "24h post-order review solicitation" },
        { title: "Milestone Progress Chart", description: "Monthly progress tracker visual" },
        { title: "English Tone Polish", description: "Professional copy polish pass" },
        { title: "TRS Condition Guide", description: "TRS requirements checklist PDF" },
      ],
    },
    fr: {
      title: "FR-Free: 6-Month Fiverr → Top Rated Seller",
      description: "(FR-Free) 6-month plan for On-time / reviews / retention TRS badge targets",
      steps: [
        { title: "Étape 1: Progress Calculator", description: "Monthly review count targets" },
        { title: "Étape 2: English Post-Delivery Ask", description: "24h post-order review solicitation" },
        { title: "Étape 3: Milestone Progress Chart", description: "Monthly progress tracker visual" },
        { title: "Étape 4: English Tone Polish", description: "Professional copy polish pass" },
        { title: "Étape 5: TRS Condition Guide", description: "TRS requirements checklist PDF" },
      ],
    },
    es: {
      title: "ES-Free: 6-Month Fiverr → Top Rated Seller",
      description: "(ES-Free) 6-month plan for On-time / reviews / retention TRS badge targets",
      steps: [
        { title: "Paso 1: Progress Calculator", description: "Monthly review count targets" },
        { title: "Paso 2: English Post-Delivery Ask", description: "24h post-order review solicitation" },
        { title: "Paso 3: Milestone Progress Chart", description: "Monthly progress tracker visual" },
        { title: "Paso 4: English Tone Polish", description: "Professional copy polish pass" },
        { title: "Paso 5: TRS Condition Guide", description: "TRS requirements checklist PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: 6-Month Fiverr → Top Rated Seller",
      description: "(HI-फ्रीलांस) 6-month plan for On-time / reviews / retention TRS badge targets",
      steps: [
        { title: "चरण 1: Progress Calculator", description: "Monthly review count targets" },
        { title: "चरण 2: English Post-Delivery Ask", description: "24h post-order review solicitation" },
        { title: "चरण 3: Milestone Progress Chart", description: "Monthly progress tracker visual" },
        { title: "चरण 4: English Tone Polish", description: "Professional copy polish pass" },
        { title: "चरण 5: TRS Condition Guide", description: "TRS requirements checklist PDF" },
      ],
    },
    ar: {
      title: "AR-ح: 6-Month Fiverr → Top Rated Seller",
      description: "(AR-ح) 6-month plan for On-time / reviews / retention TRS badge targets",
      steps: [
        { title: "الخطوة 1: Progress Calculator", description: "Monthly review count targets" },
        { title: "الخطوة 2: English Post-Delivery Ask", description: "24h post-order review solicitation" },
        { title: "الخطوة 3: Milestone Progress Chart", description: "Monthly progress tracker visual" },
        { title: "الخطوة 4: English Tone Polish", description: "Professional copy polish pass" },
        { title: "الخطوة 5: TRS Condition Guide", description: "TRS requirements checklist PDF" },
      ],
    },
  },
  'freelance-cold-email-sequence': {
    zh: {
      title: "冷开发邮件5步序列",
      description: "第1封/3天/7天/14天/关闭",
      steps: [
        { title: "英文5封序列", description: "5封不同角度邮件" },
        { title: "英语母语润色", description: "无销售感" },
        { title: "邮件签名图", description: "带社媒链接" },
        { title: "邮件图片≤100KB", description: "不进垃圾箱" },
        { title: "邮件脚本PDF", description: "团队分享存档" },
      ],
    },
    en: {
      title: "Cold Email 5-Step Sequence",
      description: "Day-1 / 3 / 7 / 14 / close 5-part cold email sequence library",
      steps: [
        { title: "5 English Sequence Letters", description: "5 distinct angle 5-email sequence" },
        { title: "Native English Polish", description: "Non-salesy, natural human tone" },
        { title: "Signature Social Graphic", description: "Social-linked email signature" },
        { title: "<100KB Email Images", description: "Light images to avoid spam folder" },
        { title: "Team Sequence Handbook", description: "Team-share sequence PDF archive" },
      ],
    },
    fr: {
      title: "FR-Free: Cold Email 5-Step Sequence",
      description: "(FR-Free) Day-1 / 3 / 7 / 14 / close 5-part cold email sequence library",
      steps: [
        { title: "Étape 1: 5 English Sequence Letters", description: "5 distinct angle 5-email sequence" },
        { title: "Étape 2: Native English Polish", description: "Non-salesy, natural human tone" },
        { title: "Étape 3: Signature Social Graphic", description: "Social-linked email signature" },
        { title: "Étape 4: <100KB Email Images", description: "Light images to avoid spam folder" },
        { title: "Étape 5: Team Sequence Handbook", description: "Team-share sequence PDF archive" },
      ],
    },
    es: {
      title: "ES-Free: Cold Email 5-Step Sequence",
      description: "(ES-Free) Day-1 / 3 / 7 / 14 / close 5-part cold email sequence library",
      steps: [
        { title: "Paso 1: 5 English Sequence Letters", description: "5 distinct angle 5-email sequence" },
        { title: "Paso 2: Native English Polish", description: "Non-salesy, natural human tone" },
        { title: "Paso 3: Signature Social Graphic", description: "Social-linked email signature" },
        { title: "Paso 4: <100KB Email Images", description: "Light images to avoid spam folder" },
        { title: "Paso 5: Team Sequence Handbook", description: "Team-share sequence PDF archive" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Cold Email 5-Step Sequence",
      description: "(HI-फ्रीलांस) Day-1 / 3 / 7 / 14 / close 5-part cold email sequence library",
      steps: [
        { title: "चरण 1: 5 English Sequence Letters", description: "5 distinct angle 5-email sequence" },
        { title: "चरण 2: Native English Polish", description: "Non-salesy, natural human tone" },
        { title: "चरण 3: Signature Social Graphic", description: "Social-linked email signature" },
        { title: "चरण 4: <100KB Email Images", description: "Light images to avoid spam folder" },
        { title: "चरण 5: Team Sequence Handbook", description: "Team-share sequence PDF archive" },
      ],
    },
    ar: {
      title: "AR-ح: Cold Email 5-Step Sequence",
      description: "(AR-ح) Day-1 / 3 / 7 / 14 / close 5-part cold email sequence library",
      steps: [
        { title: "الخطوة 1: 5 English Sequence Letters", description: "5 distinct angle 5-email sequence" },
        { title: "الخطوة 2: Native English Polish", description: "Non-salesy, natural human tone" },
        { title: "الخطوة 3: Signature Social Graphic", description: "Social-linked email signature" },
        { title: "الخطوة 4: <100KB Email Images", description: "Light images to avoid spam folder" },
        { title: "الخطوة 5: Team Sequence Handbook", description: "Team-share sequence PDF archive" },
      ],
    },
  },
  'freelance-retired-clients-reactivate': {
    zh: {
      title: "沉睡老客户唤醒邮件10版",
      description: "问候/节日/案例/涨价预警4角度",
      steps: [
        { title: "英文10版唤醒", description: "不同角度10封邮件" },
        { title: "案例故事英文", description: "最近成功案例" },
        { title: "母语润色", description: "友好温暖语气" },
        { title: "节日贺卡图", description: "节日祝福图片" },
        { title: "客户名单PDF", description: "跟进状态PDF存档" },
      ],
    },
    en: {
      title: "Dormant Client Reactivation Campaign",
      description: "Check-in / holiday / case-study / price-hike 10-email reactivation library",
      steps: [
        { title: "10 Reactivation Themes", description: "10 different angle reactivation emails" },
        { title: "Recent Case Study EN", description: "Recent customer success story copy" },
        { title: "Friendly Tone Polish", description: "Warm, relationship-first tone" },
        { title: "Holiday Card Visuals", description: "Seasonal greetings card artwork" },
        { title: "CRM Roster PDF", description: "Client status tracker PDF" },
      ],
    },
    fr: {
      title: "FR-Free: Dormant Client Reactivation Campaign",
      description: "(FR-Free) Check-in / holiday / case-study / price-hike 10-email reactivation library",
      steps: [
        { title: "Étape 1: 10 Reactivation Themes", description: "10 different angle reactivation emails" },
        { title: "Étape 2: Recent Case Study EN", description: "Recent customer success story copy" },
        { title: "Étape 3: Friendly Tone Polish", description: "Warm, relationship-first tone" },
        { title: "Étape 4: Holiday Card Visuals", description: "Seasonal greetings card artwork" },
        { title: "Étape 5: CRM Roster PDF", description: "Client status tracker PDF" },
      ],
    },
    es: {
      title: "ES-Free: Dormant Client Reactivation Campaign",
      description: "(ES-Free) Check-in / holiday / case-study / price-hike 10-email reactivation library",
      steps: [
        { title: "Paso 1: 10 Reactivation Themes", description: "10 different angle reactivation emails" },
        { title: "Paso 2: Recent Case Study EN", description: "Recent customer success story copy" },
        { title: "Paso 3: Friendly Tone Polish", description: "Warm, relationship-first tone" },
        { title: "Paso 4: Holiday Card Visuals", description: "Seasonal greetings card artwork" },
        { title: "Paso 5: CRM Roster PDF", description: "Client status tracker PDF" },
      ],
    },
    hi: {
      title: "HI-फ्रीलांस: Dormant Client Reactivation Campaign",
      description: "(HI-फ्रीलांस) Check-in / holiday / case-study / price-hike 10-email reactivation library",
      steps: [
        { title: "चरण 1: 10 Reactivation Themes", description: "10 different angle reactivation emails" },
        { title: "चरण 2: Recent Case Study EN", description: "Recent customer success story copy" },
        { title: "चरण 3: Friendly Tone Polish", description: "Warm, relationship-first tone" },
        { title: "चरण 4: Holiday Card Visuals", description: "Seasonal greetings card artwork" },
        { title: "चरण 5: CRM Roster PDF", description: "Client status tracker PDF" },
      ],
    },
    ar: {
      title: "AR-ح: Dormant Client Reactivation Campaign",
      description: "(AR-ح) Check-in / holiday / case-study / price-hike 10-email reactivation library",
      steps: [
        { title: "الخطوة 1: 10 Reactivation Themes", description: "10 different angle reactivation emails" },
        { title: "الخطوة 2: Recent Case Study EN", description: "Recent customer success story copy" },
        { title: "الخطوة 3: Friendly Tone Polish", description: "Warm, relationship-first tone" },
        { title: "الخطوة 4: Holiday Card Visuals", description: "Seasonal greetings card artwork" },
        { title: "الخطوة 5: CRM Roster PDF", description: "Client status tracker PDF" },
      ],
    },
  },
  'youtube-automation-faceless': {
    zh: {
      title: "YouTube无脸自动化频道启动",
      description: "配音/剪辑/字幕/封面冷启动",
      steps: [
        { title: "10个视频脚本", description: "10篇Hook+故事+CTA脚本" },
        { title: "封面缩略图", description: "1280×720高点击封面" },
        { title: "封面文字修", description: "英文标题高对比" },
        { title: "封面转JPG", description: "YT推荐格式" },
        { title: "封面≤2MB", description: "YT上传要求" },
      ],
    },
    en: {
      title: "YouTube Faceless Automation Channel Kickoff",
      description: "Voiceover / edit / captions / thumbnails cold-start for faceless YT",
      steps: [
        { title: "10 Video Scripts", description: "10 Hook → story → CTA scripts" },
        { title: "Thumbnail Design", description: "1280×720 high-CTR thumbnails" },
        { title: "Thumbnail Text Polish", description: "Native contrast-readable English titles" },
        { title: "JPG Export", description: "YouTube recommended JPG format" },
        { title: "2MB Max Thumbnails", description: "YouTube upload spec compliance" },
      ],
    },
    fr: {
      title: "FR-CC: YouTube Faceless Automation Channel Kickoff",
      description: "(FR-CC) Voiceover / edit / captions / thumbnails cold-start for faceless YT",
      steps: [
        { title: "Étape 1: 10 Video Scripts", description: "10 Hook → story → CTA scripts" },
        { title: "Étape 2: Thumbnail Design", description: "1280×720 high-CTR thumbnails" },
        { title: "Étape 3: Thumbnail Text Polish", description: "Native contrast-readable English titles" },
        { title: "Étape 4: JPG Export", description: "YouTube recommended JPG format" },
        { title: "Étape 5: 2MB Max Thumbnails", description: "YouTube upload spec compliance" },
      ],
    },
    es: {
      title: "ES-CC: YouTube Faceless Automation Channel Kickoff",
      description: "(ES-CC) Voiceover / edit / captions / thumbnails cold-start for faceless YT",
      steps: [
        { title: "Paso 1: 10 Video Scripts", description: "10 Hook → story → CTA scripts" },
        { title: "Paso 2: Thumbnail Design", description: "1280×720 high-CTR thumbnails" },
        { title: "Paso 3: Thumbnail Text Polish", description: "Native contrast-readable English titles" },
        { title: "Paso 4: JPG Export", description: "YouTube recommended JPG format" },
        { title: "Paso 5: 2MB Max Thumbnails", description: "YouTube upload spec compliance" },
      ],
    },
    hi: {
      title: "HI-सामग्री: YouTube Faceless Automation Channel Kickoff",
      description: "(HI-सामग्री) Voiceover / edit / captions / thumbnails cold-start for faceless YT",
      steps: [
        { title: "चरण 1: 10 Video Scripts", description: "10 Hook → story → CTA scripts" },
        { title: "चरण 2: Thumbnail Design", description: "1280×720 high-CTR thumbnails" },
        { title: "चरण 3: Thumbnail Text Polish", description: "Native contrast-readable English titles" },
        { title: "चरण 4: JPG Export", description: "YouTube recommended JPG format" },
        { title: "चरण 5: 2MB Max Thumbnails", description: "YouTube upload spec compliance" },
      ],
    },
    ar: {
      title: "AR-م: YouTube Faceless Automation Channel Kickoff",
      description: "(AR-م) Voiceover / edit / captions / thumbnails cold-start for faceless YT",
      steps: [
        { title: "الخطوة 1: 10 Video Scripts", description: "10 Hook → story → CTA scripts" },
        { title: "الخطوة 2: Thumbnail Design", description: "1280×720 high-CTR thumbnails" },
        { title: "الخطوة 3: Thumbnail Text Polish", description: "Native contrast-readable English titles" },
        { title: "الخطوة 4: JPG Export", description: "YouTube recommended JPG format" },
        { title: "الخطوة 5: 2MB Max Thumbnails", description: "YouTube upload spec compliance" },
      ],
    },
  },
  'instagram-reels-30day': {
    zh: {
      title: "IG Reels 30天涨粉1000计划",
      description: "选题+剪辑+发布节奏+互动",
      steps: [
        { title: "30条Reels脚本", description: "Hook/正文/CTA" },
        { title: "30张封面", description: "9:16封面文字" },
        { title: "9:16裁切", description: "标准竖屏" },
        { title: "压缩封面", description: "IG最佳" },
        { title: "排期PDF", description: "30天排期本" },
      ],
    },
    en: {
      title: "Instagram Reels 30-Day 1000 Followers",
      description: "30-day Reels topic, edit cadence, posting rhythm & engagement plan",
      steps: [
        { title: "30 Reels Scripts", description: "Hook / body / CTA for each day" },
        { title: "30 Cover Variants", description: "9:16 cover tiles for each Reel" },
        { title: "9:16 Crop to Spec", description: "Standard 9:16 vertical frame" },
        { title: "Optimized Export Size", description: "IG-optimal export dimensions" },
        { title: "30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Instagram Reels 30-Day 1000 Followers",
      description: "(FR-CC) 30-day Reels topic, edit cadence, posting rhythm & engagement plan",
      steps: [
        { title: "Étape 1: 30 Reels Scripts", description: "Hook / body / CTA for each day" },
        { title: "Étape 2: 30 Cover Variants", description: "9:16 cover tiles for each Reel" },
        { title: "Étape 3: 9:16 Crop to Spec", description: "Standard 9:16 vertical frame" },
        { title: "Étape 4: Optimized Export Size", description: "IG-optimal export dimensions" },
        { title: "Étape 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    es: {
      title: "ES-CC: Instagram Reels 30-Day 1000 Followers",
      description: "(ES-CC) 30-day Reels topic, edit cadence, posting rhythm & engagement plan",
      steps: [
        { title: "Paso 1: 30 Reels Scripts", description: "Hook / body / CTA for each day" },
        { title: "Paso 2: 30 Cover Variants", description: "9:16 cover tiles for each Reel" },
        { title: "Paso 3: 9:16 Crop to Spec", description: "Standard 9:16 vertical frame" },
        { title: "Paso 4: Optimized Export Size", description: "IG-optimal export dimensions" },
        { title: "Paso 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Instagram Reels 30-Day 1000 Followers",
      description: "(HI-सामग्री) 30-day Reels topic, edit cadence, posting rhythm & engagement plan",
      steps: [
        { title: "चरण 1: 30 Reels Scripts", description: "Hook / body / CTA for each day" },
        { title: "चरण 2: 30 Cover Variants", description: "9:16 cover tiles for each Reel" },
        { title: "चरण 3: 9:16 Crop to Spec", description: "Standard 9:16 vertical frame" },
        { title: "चरण 4: Optimized Export Size", description: "IG-optimal export dimensions" },
        { title: "चरण 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    ar: {
      title: "AR-م: Instagram Reels 30-Day 1000 Followers",
      description: "(AR-م) 30-day Reels topic, edit cadence, posting rhythm & engagement plan",
      steps: [
        { title: "الخطوة 1: 30 Reels Scripts", description: "Hook / body / CTA for each day" },
        { title: "الخطوة 2: 30 Cover Variants", description: "9:16 cover tiles for each Reel" },
        { title: "الخطوة 3: 9:16 Crop to Spec", description: "Standard 9:16 vertical frame" },
        { title: "الخطوة 4: Optimized Export Size", description: "IG-optimal export dimensions" },
        { title: "الخطوة 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
  },
  'tiktok-ugc-script-hook': {
    zh: {
      title: "TikTok爆款UGC脚本3秒Hook",
      description: "前3秒停留率≥60%脚本公式",
      steps: [
        { title: "50条Hook库", description: "3秒抓眼球Hook库" },
        { title: "字幕卡片", description: "10套字幕模板" },
        { title: "英语自然化", description: "口语化表达" },
        { title: "9:16截图", description: "封面截图设计" },
        { title: "脚本本PDF", description: "50条Hook打印" },
      ],
    },
    en: {
      title: "TikTok UGC 3-Second Hook Formula",
      description: "50 pre-built 3-second UGC hooks with ≥60% retention rate formula",
      steps: [
        { title: "50 Opening Hooks", description: "3-second stop-scroll hook library" },
        { title: "Subtitle Style Kit", description: "10 caption layout template pack" },
        { title: "Conversational English", description: "Spoken, non-scripted natural English" },
        { title: "9:16 Cover Frame", description: "9:16 cover still frame design" },
        { title: "Hook Library PDF", description: "Printable 50-hook playbook PDF" },
      ],
    },
    fr: {
      title: "FR-CC: TikTok UGC 3-Second Hook Formula",
      description: "(FR-CC) 50 pre-built 3-second UGC hooks with ≥60% retention rate formula",
      steps: [
        { title: "Étape 1: 50 Opening Hooks", description: "3-second stop-scroll hook library" },
        { title: "Étape 2: Subtitle Style Kit", description: "10 caption layout template pack" },
        { title: "Étape 3: Conversational English", description: "Spoken, non-scripted natural English" },
        { title: "Étape 4: 9:16 Cover Frame", description: "9:16 cover still frame design" },
        { title: "Étape 5: Hook Library PDF", description: "Printable 50-hook playbook PDF" },
      ],
    },
    es: {
      title: "ES-CC: TikTok UGC 3-Second Hook Formula",
      description: "(ES-CC) 50 pre-built 3-second UGC hooks with ≥60% retention rate formula",
      steps: [
        { title: "Paso 1: 50 Opening Hooks", description: "3-second stop-scroll hook library" },
        { title: "Paso 2: Subtitle Style Kit", description: "10 caption layout template pack" },
        { title: "Paso 3: Conversational English", description: "Spoken, non-scripted natural English" },
        { title: "Paso 4: 9:16 Cover Frame", description: "9:16 cover still frame design" },
        { title: "Paso 5: Hook Library PDF", description: "Printable 50-hook playbook PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: TikTok UGC 3-Second Hook Formula",
      description: "(HI-सामग्री) 50 pre-built 3-second UGC hooks with ≥60% retention rate formula",
      steps: [
        { title: "चरण 1: 50 Opening Hooks", description: "3-second stop-scroll hook library" },
        { title: "चरण 2: Subtitle Style Kit", description: "10 caption layout template pack" },
        { title: "चरण 3: Conversational English", description: "Spoken, non-scripted natural English" },
        { title: "चरण 4: 9:16 Cover Frame", description: "9:16 cover still frame design" },
        { title: "चरण 5: Hook Library PDF", description: "Printable 50-hook playbook PDF" },
      ],
    },
    ar: {
      title: "AR-م: TikTok UGC 3-Second Hook Formula",
      description: "(AR-م) 50 pre-built 3-second UGC hooks with ≥60% retention rate formula",
      steps: [
        { title: "الخطوة 1: 50 Opening Hooks", description: "3-second stop-scroll hook library" },
        { title: "الخطوة 2: Subtitle Style Kit", description: "10 caption layout template pack" },
        { title: "الخطوة 3: Conversational English", description: "Spoken, non-scripted natural English" },
        { title: "الخطوة 4: 9:16 Cover Frame", description: "9:16 cover still frame design" },
        { title: "الخطوة 5: Hook Library PDF", description: "Printable 50-hook playbook PDF" },
      ],
    },
  },
  'seo-blog-10-article-cluster': {
    zh: {
      title: "SEO博客话题簇10篇",
      description: "Pillar+Cluster架构+外链策略",
      steps: [
        { title: "英文10篇长文", description: "2000字每篇SEO" },
        { title: "母语校对", description: "英语/西语校对" },
        { title: "文章配图", description: "Pillar文章Hero图" },
        { title: "图片压缩", description: "页面加载速度" },
        { title: "外链计划PDF", description: "Outreach名单+话术" },
      ],
    },
    en: {
      title: "SEO Blog 10-Article Topic Cluster",
      description: "Pillar + Cluster architecture with internal link strategy & 10 long-form posts",
      steps: [
        { title: "10 English 2000-Word Articles", description: "Deep 2000-word each SEO copy" },
        { title: "Native + ES Proofread", description: "EN / ES editorial review pass" },
        { title: "Pillar Article Hero Images", description: "Pillar-page hero artwork set" },
        { title: "Image Compression", description: "Fast page-load size optimization" },
        { title: "Outreach Plan PDF", description: "Backlink prospect list + email templates" },
      ],
    },
    fr: {
      title: "FR-CC: SEO Blog 10-Article Topic Cluster",
      description: "(FR-CC) Pillar + Cluster architecture with internal link strategy & 10 long-form posts",
      steps: [
        { title: "Étape 1: 10 English 2000-Word Articles", description: "Deep 2000-word each SEO copy" },
        { title: "Étape 2: Native + ES Proofread", description: "EN / ES editorial review pass" },
        { title: "Étape 3: Pillar Article Hero Images", description: "Pillar-page hero artwork set" },
        { title: "Étape 4: Image Compression", description: "Fast page-load size optimization" },
        { title: "Étape 5: Outreach Plan PDF", description: "Backlink prospect list + email templates" },
      ],
    },
    es: {
      title: "ES-CC: SEO Blog 10-Article Topic Cluster",
      description: "(ES-CC) Pillar + Cluster architecture with internal link strategy & 10 long-form posts",
      steps: [
        { title: "Paso 1: 10 English 2000-Word Articles", description: "Deep 2000-word each SEO copy" },
        { title: "Paso 2: Native + ES Proofread", description: "EN / ES editorial review pass" },
        { title: "Paso 3: Pillar Article Hero Images", description: "Pillar-page hero artwork set" },
        { title: "Paso 4: Image Compression", description: "Fast page-load size optimization" },
        { title: "Paso 5: Outreach Plan PDF", description: "Backlink prospect list + email templates" },
      ],
    },
    hi: {
      title: "HI-सामग्री: SEO Blog 10-Article Topic Cluster",
      description: "(HI-सामग्री) Pillar + Cluster architecture with internal link strategy & 10 long-form posts",
      steps: [
        { title: "चरण 1: 10 English 2000-Word Articles", description: "Deep 2000-word each SEO copy" },
        { title: "चरण 2: Native + ES Proofread", description: "EN / ES editorial review pass" },
        { title: "चरण 3: Pillar Article Hero Images", description: "Pillar-page hero artwork set" },
        { title: "चरण 4: Image Compression", description: "Fast page-load size optimization" },
        { title: "चरण 5: Outreach Plan PDF", description: "Backlink prospect list + email templates" },
      ],
    },
    ar: {
      title: "AR-م: SEO Blog 10-Article Topic Cluster",
      description: "(AR-م) Pillar + Cluster architecture with internal link strategy & 10 long-form posts",
      steps: [
        { title: "الخطوة 1: 10 English 2000-Word Articles", description: "Deep 2000-word each SEO copy" },
        { title: "الخطوة 2: Native + ES Proofread", description: "EN / ES editorial review pass" },
        { title: "الخطوة 3: Pillar Article Hero Images", description: "Pillar-page hero artwork set" },
        { title: "الخطوة 4: Image Compression", description: "Fast page-load size optimization" },
        { title: "الخطوة 5: Outreach Plan PDF", description: "Backlink prospect list + email templates" },
      ],
    },
  },
  'notion-content-calendar': {
    zh: {
      title: "多平台内容日历Notion搭建",
      description: "YouTube/IG/TikTok/博客/Newsletter 5端",
      steps: [
        { title: "Notion封面图", description: "数据库封面设计" },
        { title: "字段标签", description: "内容字段英文标签" },
        { title: "内容ID编码", description: "内容唯一编号" },
        { title: "操作指南PDF", description: "团队使用手册" },
        { title: "备份PDF", description: "Notion离线备份" },
      ],
    },
    en: {
      title: "Notion Multi-Platform Content Calendar",
      description: "YouTube / IG / TikTok / Blog / Newsletter 5-endpoint unified calendar",
      steps: [
        { title: "Notion Database Cover", description: "Calendar DB cover artwork" },
        { title: "English Field Labels", description: "English schema property labels" },
        { title: "Content ID Encoding", description: "Unique content ID generator" },
        { title: "Team SOP Handbook PDF", description: "Team usage operation handbook" },
        { title: "Offline Backup Export", description: "Printable Notion offline backup" },
      ],
    },
    fr: {
      title: "FR-CC: Notion Multi-Platform Content Calendar",
      description: "(FR-CC) YouTube / IG / TikTok / Blog / Newsletter 5-endpoint unified calendar",
      steps: [
        { title: "Étape 1: Notion Database Cover", description: "Calendar DB cover artwork" },
        { title: "Étape 2: English Field Labels", description: "English schema property labels" },
        { title: "Étape 3: Content ID Encoding", description: "Unique content ID generator" },
        { title: "Étape 4: Team SOP Handbook PDF", description: "Team usage operation handbook" },
        { title: "Étape 5: Offline Backup Export", description: "Printable Notion offline backup" },
      ],
    },
    es: {
      title: "ES-CC: Notion Multi-Platform Content Calendar",
      description: "(ES-CC) YouTube / IG / TikTok / Blog / Newsletter 5-endpoint unified calendar",
      steps: [
        { title: "Paso 1: Notion Database Cover", description: "Calendar DB cover artwork" },
        { title: "Paso 2: English Field Labels", description: "English schema property labels" },
        { title: "Paso 3: Content ID Encoding", description: "Unique content ID generator" },
        { title: "Paso 4: Team SOP Handbook PDF", description: "Team usage operation handbook" },
        { title: "Paso 5: Offline Backup Export", description: "Printable Notion offline backup" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Notion Multi-Platform Content Calendar",
      description: "(HI-सामग्री) YouTube / IG / TikTok / Blog / Newsletter 5-endpoint unified calendar",
      steps: [
        { title: "चरण 1: Notion Database Cover", description: "Calendar DB cover artwork" },
        { title: "चरण 2: English Field Labels", description: "English schema property labels" },
        { title: "चरण 3: Content ID Encoding", description: "Unique content ID generator" },
        { title: "चरण 4: Team SOP Handbook PDF", description: "Team usage operation handbook" },
        { title: "चरण 5: Offline Backup Export", description: "Printable Notion offline backup" },
      ],
    },
    ar: {
      title: "AR-م: Notion Multi-Platform Content Calendar",
      description: "(AR-م) YouTube / IG / TikTok / Blog / Newsletter 5-endpoint unified calendar",
      steps: [
        { title: "الخطوة 1: Notion Database Cover", description: "Calendar DB cover artwork" },
        { title: "الخطوة 2: English Field Labels", description: "English schema property labels" },
        { title: "الخطوة 3: Content ID Encoding", description: "Unique content ID generator" },
        { title: "الخطوة 4: Team SOP Handbook PDF", description: "Team usage operation handbook" },
        { title: "الخطوة 5: Offline Backup Export", description: "Printable Notion offline backup" },
      ],
    },
  },
  'newsletter-launch-1000-subs': {
    zh: {
      title: "Newsletter冷启动1000订阅",
      description: "Landing+互推+首次发布7天",
      steps: [
        { title: "英文Landing文案", description: "Hero/卖点/CTA" },
        { title: "Landing Hero图", description: "邮箱订阅首屏图" },
        { title: "Welcome邮件", description: "欢迎序列3封" },
        { title: "西/法语版本", description: "双语Newsletter" },
        { title: "首期PDF", description: "第一期Newsletter存档" },
      ],
    },
    en: {
      title: "Newsletter 0 → 1000 Subscribers Launch",
      description: "Landing page → cross-promo → first issue send in 14 days",
      steps: [
        { title: "Landing Page Copy", description: "Hero / bullets / CTA landing copy" },
        { title: "Hero Creative", description: "Above-fold email-optin hero art" },
        { title: "Welcome Sequence", description: "3 onboarding welcome emails" },
        { title: "EN + FR/ES Variants", description: "Bilingual newsletter first issues" },
        { title: "First Issue Archive PDF", description: "First issue PDF archive copy" },
      ],
    },
    fr: {
      title: "FR-CC: Newsletter 0 → 1000 Subscribers Launch",
      description: "(FR-CC) Landing page → cross-promo → first issue send in 14 days",
      steps: [
        { title: "Étape 1: Landing Page Copy", description: "Hero / bullets / CTA landing copy" },
        { title: "Étape 2: Hero Creative", description: "Above-fold email-optin hero art" },
        { title: "Étape 3: Welcome Sequence", description: "3 onboarding welcome emails" },
        { title: "Étape 4: EN + FR/ES Variants", description: "Bilingual newsletter first issues" },
        { title: "Étape 5: First Issue Archive PDF", description: "First issue PDF archive copy" },
      ],
    },
    es: {
      title: "ES-CC: Newsletter 0 → 1000 Subscribers Launch",
      description: "(ES-CC) Landing page → cross-promo → first issue send in 14 days",
      steps: [
        { title: "Paso 1: Landing Page Copy", description: "Hero / bullets / CTA landing copy" },
        { title: "Paso 2: Hero Creative", description: "Above-fold email-optin hero art" },
        { title: "Paso 3: Welcome Sequence", description: "3 onboarding welcome emails" },
        { title: "Paso 4: EN + FR/ES Variants", description: "Bilingual newsletter first issues" },
        { title: "Paso 5: First Issue Archive PDF", description: "First issue PDF archive copy" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Newsletter 0 → 1000 Subscribers Launch",
      description: "(HI-सामग्री) Landing page → cross-promo → first issue send in 14 days",
      steps: [
        { title: "चरण 1: Landing Page Copy", description: "Hero / bullets / CTA landing copy" },
        { title: "चरण 2: Hero Creative", description: "Above-fold email-optin hero art" },
        { title: "चरण 3: Welcome Sequence", description: "3 onboarding welcome emails" },
        { title: "चरण 4: EN + FR/ES Variants", description: "Bilingual newsletter first issues" },
        { title: "चरण 5: First Issue Archive PDF", description: "First issue PDF archive copy" },
      ],
    },
    ar: {
      title: "AR-م: Newsletter 0 → 1000 Subscribers Launch",
      description: "(AR-م) Landing page → cross-promo → first issue send in 14 days",
      steps: [
        { title: "الخطوة 1: Landing Page Copy", description: "Hero / bullets / CTA landing copy" },
        { title: "الخطوة 2: Hero Creative", description: "Above-fold email-optin hero art" },
        { title: "الخطوة 3: Welcome Sequence", description: "3 onboarding welcome emails" },
        { title: "الخطوة 4: EN + FR/ES Variants", description: "Bilingual newsletter first issues" },
        { title: "الخطوة 5: First Issue Archive PDF", description: "First issue PDF archive copy" },
      ],
    },
  },
  'podcast-10-episode-launch': {
    zh: {
      title: "播客10期冷启动上线流程",
      description: "选题/嘉宾/剪辑/封面/分发",
      steps: [
        { title: "10期大纲", description: "每集结构+问题" },
        { title: "播客封面", description: "3000×3000封面图" },
        { title: "Shownotes英文", description: "每集Shownotes" },
        { title: "嘉宾封面", description: "嘉宾分享卡" },
        { title: "10期Shownotes", description: "Shownotes本PDF" },
      ],
    },
    en: {
      title: "Podcast 10-Episode Launch Plan",
      description: "Topics / guests / edit / cover / distribution 10-episode launch SOP",
      steps: [
        { title: "10 Episode Outlines", description: "Episode structure + question banks" },
        { title: "Podcast Cover Art", description: "3000×3000 podcast cover" },
        { title: "Shownotes (EN)", description: "Each episode Shownotes write-up" },
        { title: "Guest Social Cards", description: "Shareable guest announcement cards" },
        { title: "Shownotes Book PDF", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Podcast 10-Episode Launch Plan",
      description: "(FR-CC) Topics / guests / edit / cover / distribution 10-episode launch SOP",
      steps: [
        { title: "Étape 1: 10 Episode Outlines", description: "Episode structure + question banks" },
        { title: "Étape 2: Podcast Cover Art", description: "3000×3000 podcast cover" },
        { title: "Étape 3: Shownotes (EN)", description: "Each episode Shownotes write-up" },
        { title: "Étape 4: Guest Social Cards", description: "Shareable guest announcement cards" },
        { title: "Étape 5: Shownotes Book PDF", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    es: {
      title: "ES-CC: Podcast 10-Episode Launch Plan",
      description: "(ES-CC) Topics / guests / edit / cover / distribution 10-episode launch SOP",
      steps: [
        { title: "Paso 1: 10 Episode Outlines", description: "Episode structure + question banks" },
        { title: "Paso 2: Podcast Cover Art", description: "3000×3000 podcast cover" },
        { title: "Paso 3: Shownotes (EN)", description: "Each episode Shownotes write-up" },
        { title: "Paso 4: Guest Social Cards", description: "Shareable guest announcement cards" },
        { title: "Paso 5: Shownotes Book PDF", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Podcast 10-Episode Launch Plan",
      description: "(HI-सामग्री) Topics / guests / edit / cover / distribution 10-episode launch SOP",
      steps: [
        { title: "चरण 1: 10 Episode Outlines", description: "Episode structure + question banks" },
        { title: "चरण 2: Podcast Cover Art", description: "3000×3000 podcast cover" },
        { title: "चरण 3: Shownotes (EN)", description: "Each episode Shownotes write-up" },
        { title: "चरण 4: Guest Social Cards", description: "Shareable guest announcement cards" },
        { title: "चरण 5: Shownotes Book PDF", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    ar: {
      title: "AR-م: Podcast 10-Episode Launch Plan",
      description: "(AR-م) Topics / guests / edit / cover / distribution 10-episode launch SOP",
      steps: [
        { title: "الخطوة 1: 10 Episode Outlines", description: "Episode structure + question banks" },
        { title: "الخطوة 2: Podcast Cover Art", description: "3000×3000 podcast cover" },
        { title: "الخطوة 3: Shownotes (EN)", description: "Each episode Shownotes write-up" },
        { title: "الخطوة 4: Guest Social Cards", description: "Shareable guest announcement cards" },
        { title: "الخطوة 5: Shownotes Book PDF", description: "10-episode Shownotes compiled PDF" },
      ],
    },
  },
  'canva-template-shop-sell': {
    zh: {
      title: "Canva模板店20套售卖",
      description: "Planner/Social/Resume 20套模板上架",
      steps: [
        { title: "20套模板", description: "3大品类各特色" },
        { title: "英文Listing文案", description: "Title/Tags/说明" },
        { title: "Etsy关键词", description: "Etsy搜索词推荐" },
        { title: "Mockup预览", description: "每套模板预览图" },
        { title: "使用说明PDF", description: "顾客下载指南" },
      ],
    },
    en: {
      title: "Canva Template Shop 20 Templates Launch",
      description: "Planner / Social / Resume 20-sKU digital template shop upload",
      steps: [
        { title: "20 Template Builds", description: "3 category 20-template catalogue" },
        { title: "English Listing Copy", description: "Title / tags / description copy" },
        { title: "Etsy Keyword Research", description: "Etsy search term recommendation set" },
        { title: "Preview Mockups", description: "Per-template preview mockups" },
        { title: "Customer Guide PDF", description: "Post-download customer usage guide" },
      ],
    },
    fr: {
      title: "FR-CC: Canva Template Shop 20 Templates Launch",
      description: "(FR-CC) Planner / Social / Resume 20-sKU digital template shop upload",
      steps: [
        { title: "Étape 1: 20 Template Builds", description: "3 category 20-template catalogue" },
        { title: "Étape 2: English Listing Copy", description: "Title / tags / description copy" },
        { title: "Étape 3: Etsy Keyword Research", description: "Etsy search term recommendation set" },
        { title: "Étape 4: Preview Mockups", description: "Per-template preview mockups" },
        { title: "Étape 5: Customer Guide PDF", description: "Post-download customer usage guide" },
      ],
    },
    es: {
      title: "ES-CC: Canva Template Shop 20 Templates Launch",
      description: "(ES-CC) Planner / Social / Resume 20-sKU digital template shop upload",
      steps: [
        { title: "Paso 1: 20 Template Builds", description: "3 category 20-template catalogue" },
        { title: "Paso 2: English Listing Copy", description: "Title / tags / description copy" },
        { title: "Paso 3: Etsy Keyword Research", description: "Etsy search term recommendation set" },
        { title: "Paso 4: Preview Mockups", description: "Per-template preview mockups" },
        { title: "Paso 5: Customer Guide PDF", description: "Post-download customer usage guide" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Canva Template Shop 20 Templates Launch",
      description: "(HI-सामग्री) Planner / Social / Resume 20-sKU digital template shop upload",
      steps: [
        { title: "चरण 1: 20 Template Builds", description: "3 category 20-template catalogue" },
        { title: "चरण 2: English Listing Copy", description: "Title / tags / description copy" },
        { title: "चरण 3: Etsy Keyword Research", description: "Etsy search term recommendation set" },
        { title: "चरण 4: Preview Mockups", description: "Per-template preview mockups" },
        { title: "चरण 5: Customer Guide PDF", description: "Post-download customer usage guide" },
      ],
    },
    ar: {
      title: "AR-م: Canva Template Shop 20 Templates Launch",
      description: "(AR-م) Planner / Social / Resume 20-sKU digital template shop upload",
      steps: [
        { title: "الخطوة 1: 20 Template Builds", description: "3 category 20-template catalogue" },
        { title: "الخطوة 2: English Listing Copy", description: "Title / tags / description copy" },
        { title: "الخطوة 3: Etsy Keyword Research", description: "Etsy search term recommendation set" },
        { title: "الخطوة 4: Preview Mockups", description: "Per-template preview mockups" },
        { title: "الخطوة 5: Customer Guide PDF", description: "Post-download customer usage guide" },
      ],
    },
  },
  'medium-tow-articles-monthly': {
    zh: {
      title: "Medium每月4篇Partner Program",
      description: "选题+SEO+配图+投稿24小时",
      steps: [
        { title: "英文4篇", description: "2000字每篇深度" },
        { title: "英文母语润色", description: "语法+表达" },
        { title: "每篇Hero图", description: "1920×1080" },
        { title: "图片压缩", description: "快速加载" },
        { title: "4篇合并", description: "存档PDF每季度一本" },
      ],
    },
    en: {
      title: "Medium Partner Program 4× Monthly",
      description: "4 in-depth articles per month calibrated for Medium Partner payout",
      steps: [
        { title: "4 English Long Reads", description: "~2000-word premium depth essays each" },
        { title: "Native English Polish", description: "Grammar + expression editorial pass" },
        { title: "Hero Per Article", description: "1920×1080 per-article hero art" },
        { title: "Compress for Speed", description: "Fast-load image size control" },
        { title: "Quarterly Archive PDF", description: "Quarterly 4-pack compilation PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Medium Partner Program 4× Monthly",
      description: "(FR-CC) 4 in-depth articles per month calibrated for Medium Partner payout",
      steps: [
        { title: "Étape 1: 4 English Long Reads", description: "~2000-word premium depth essays each" },
        { title: "Étape 2: Native English Polish", description: "Grammar + expression editorial pass" },
        { title: "Étape 3: Hero Per Article", description: "1920×1080 per-article hero art" },
        { title: "Étape 4: Compress for Speed", description: "Fast-load image size control" },
        { title: "Étape 5: Quarterly Archive PDF", description: "Quarterly 4-pack compilation PDF" },
      ],
    },
    es: {
      title: "ES-CC: Medium Partner Program 4× Monthly",
      description: "(ES-CC) 4 in-depth articles per month calibrated for Medium Partner payout",
      steps: [
        { title: "Paso 1: 4 English Long Reads", description: "~2000-word premium depth essays each" },
        { title: "Paso 2: Native English Polish", description: "Grammar + expression editorial pass" },
        { title: "Paso 3: Hero Per Article", description: "1920×1080 per-article hero art" },
        { title: "Paso 4: Compress for Speed", description: "Fast-load image size control" },
        { title: "Paso 5: Quarterly Archive PDF", description: "Quarterly 4-pack compilation PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Medium Partner Program 4× Monthly",
      description: "(HI-सामग्री) 4 in-depth articles per month calibrated for Medium Partner payout",
      steps: [
        { title: "चरण 1: 4 English Long Reads", description: "~2000-word premium depth essays each" },
        { title: "चरण 2: Native English Polish", description: "Grammar + expression editorial pass" },
        { title: "चरण 3: Hero Per Article", description: "1920×1080 per-article hero art" },
        { title: "चरण 4: Compress for Speed", description: "Fast-load image size control" },
        { title: "चरण 5: Quarterly Archive PDF", description: "Quarterly 4-pack compilation PDF" },
      ],
    },
    ar: {
      title: "AR-م: Medium Partner Program 4× Monthly",
      description: "(AR-م) 4 in-depth articles per month calibrated for Medium Partner payout",
      steps: [
        { title: "الخطوة 1: 4 English Long Reads", description: "~2000-word premium depth essays each" },
        { title: "الخطوة 2: Native English Polish", description: "Grammar + expression editorial pass" },
        { title: "الخطوة 3: Hero Per Article", description: "1920×1080 per-article hero art" },
        { title: "الخطوة 4: Compress for Speed", description: "Fast-load image size control" },
        { title: "الخطوة 5: Quarterly Archive PDF", description: "Quarterly 4-pack compilation PDF" },
      ],
    },
  },
  'linkedin-personal-brand-30': {
    zh: {
      title: "LinkedIn 30天个人品牌打造",
      description: "每天1帖+每周1篇长文+评论20条",
      steps: [
        { title: "30条帖文", description: "B2B视角专业内容" },
        { title: "10张配图", description: "数据可视化图表" },
        { title: "英语润色", description: "商务英语" },
        { title: "长文封面", description: "LinkedIn文章封面" },
        { title: "30天排期", description: "日历PDF打印" },
      ],
    },
    en: {
      title: "LinkedIn 30-Day Personal Brand Build",
      description: "1 daily post + 1 weekly long-form + 20 comments engagement plan",
      steps: [
        { title: "30 English Post Queue", description: "B2B point-of-view 30-post pipeline" },
        { title: "10 Data Visuals", description: "10 chart / infographic assets" },
        { title: "Business English Polish", description: "Tone & register professional polish" },
        { title: "Long-Form Cover Art", description: "LinkedIn article cover visuals" },
        { title: "30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    fr: {
      title: "FR-CC: LinkedIn 30-Day Personal Brand Build",
      description: "(FR-CC) 1 daily post + 1 weekly long-form + 20 comments engagement plan",
      steps: [
        { title: "Étape 1: 30 English Post Queue", description: "B2B point-of-view 30-post pipeline" },
        { title: "Étape 2: 10 Data Visuals", description: "10 chart / infographic assets" },
        { title: "Étape 3: Business English Polish", description: "Tone & register professional polish" },
        { title: "Étape 4: Long-Form Cover Art", description: "LinkedIn article cover visuals" },
        { title: "Étape 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    es: {
      title: "ES-CC: LinkedIn 30-Day Personal Brand Build",
      description: "(ES-CC) 1 daily post + 1 weekly long-form + 20 comments engagement plan",
      steps: [
        { title: "Paso 1: 30 English Post Queue", description: "B2B point-of-view 30-post pipeline" },
        { title: "Paso 2: 10 Data Visuals", description: "10 chart / infographic assets" },
        { title: "Paso 3: Business English Polish", description: "Tone & register professional polish" },
        { title: "Paso 4: Long-Form Cover Art", description: "LinkedIn article cover visuals" },
        { title: "Paso 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: LinkedIn 30-Day Personal Brand Build",
      description: "(HI-सामग्री) 1 daily post + 1 weekly long-form + 20 comments engagement plan",
      steps: [
        { title: "चरण 1: 30 English Post Queue", description: "B2B point-of-view 30-post pipeline" },
        { title: "चरण 2: 10 Data Visuals", description: "10 chart / infographic assets" },
        { title: "चरण 3: Business English Polish", description: "Tone & register professional polish" },
        { title: "चरण 4: Long-Form Cover Art", description: "LinkedIn article cover visuals" },
        { title: "चरण 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
    ar: {
      title: "AR-م: LinkedIn 30-Day Personal Brand Build",
      description: "(AR-م) 1 daily post + 1 weekly long-form + 20 comments engagement plan",
      steps: [
        { title: "الخطوة 1: 30 English Post Queue", description: "B2B point-of-view 30-post pipeline" },
        { title: "الخطوة 2: 10 Data Visuals", description: "10 chart / infographic assets" },
        { title: "الخطوة 3: Business English Polish", description: "Tone & register professional polish" },
        { title: "الخطوة 4: Long-Form Cover Art", description: "LinkedIn article cover visuals" },
        { title: "الخطوة 5: 30-Day Calendar PDF", description: "Printable 30-day plan PDF" },
      ],
    },
  },
  'short-video-subtitle-batch': {
    zh: {
      title: "短视频字幕批量加双语",
      description: "剪映导出SRT+双语字幕烧录",
      steps: [
        { title: "英文台词翻译", description: "中文→英文字幕" },
        { title: "西/法语", description: "欧洲市场字幕" },
        { title: "字幕模板", description: "10套风格化字幕" },
        { title: "字幕卡片图", description: "封面字幕卡" },
        { title: "SRT包PDF", description: "10条SRT打包" },
      ],
    },
    en: {
      title: "Short-Video Bilingual Subtitle Batch",
      description: "CapCut SRT export → bilingual burned-in subtitles for 10 shorts at once",
      steps: [
        { title: "ZH → EN Subtitle Translate", description: "Chinese video → English subtitles" },
        { title: "FR / ES Locale Files", description: "Western EU subtitle sets" },
        { title: "Subtitle Style Templates", description: "10 design subtitle preset pack" },
        { title: "Cover Subtitle Card", description: "Cover-frame subtitle still" },
        { title: "SRT Bundle PDF", description: "10 SRT files archive reference PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Short-Video Bilingual Subtitle Batch",
      description: "(FR-CC) CapCut SRT export → bilingual burned-in subtitles for 10 shorts at once",
      steps: [
        { title: "Étape 1: ZH → EN Subtitle Translate", description: "Chinese video → English subtitles" },
        { title: "Étape 2: FR / ES Locale Files", description: "Western EU subtitle sets" },
        { title: "Étape 3: Subtitle Style Templates", description: "10 design subtitle preset pack" },
        { title: "Étape 4: Cover Subtitle Card", description: "Cover-frame subtitle still" },
        { title: "Étape 5: SRT Bundle PDF", description: "10 SRT files archive reference PDF" },
      ],
    },
    es: {
      title: "ES-CC: Short-Video Bilingual Subtitle Batch",
      description: "(ES-CC) CapCut SRT export → bilingual burned-in subtitles for 10 shorts at once",
      steps: [
        { title: "Paso 1: ZH → EN Subtitle Translate", description: "Chinese video → English subtitles" },
        { title: "Paso 2: FR / ES Locale Files", description: "Western EU subtitle sets" },
        { title: "Paso 3: Subtitle Style Templates", description: "10 design subtitle preset pack" },
        { title: "Paso 4: Cover Subtitle Card", description: "Cover-frame subtitle still" },
        { title: "Paso 5: SRT Bundle PDF", description: "10 SRT files archive reference PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Short-Video Bilingual Subtitle Batch",
      description: "(HI-सामग्री) CapCut SRT export → bilingual burned-in subtitles for 10 shorts at once",
      steps: [
        { title: "चरण 1: ZH → EN Subtitle Translate", description: "Chinese video → English subtitles" },
        { title: "चरण 2: FR / ES Locale Files", description: "Western EU subtitle sets" },
        { title: "चरण 3: Subtitle Style Templates", description: "10 design subtitle preset pack" },
        { title: "चरण 4: Cover Subtitle Card", description: "Cover-frame subtitle still" },
        { title: "चरण 5: SRT Bundle PDF", description: "10 SRT files archive reference PDF" },
      ],
    },
    ar: {
      title: "AR-م: Short-Video Bilingual Subtitle Batch",
      description: "(AR-م) CapCut SRT export → bilingual burned-in subtitles for 10 shorts at once",
      steps: [
        { title: "الخطوة 1: ZH → EN Subtitle Translate", description: "Chinese video → English subtitles" },
        { title: "الخطوة 2: FR / ES Locale Files", description: "Western EU subtitle sets" },
        { title: "الخطوة 3: Subtitle Style Templates", description: "10 design subtitle preset pack" },
        { title: "الخطوة 4: Cover Subtitle Card", description: "Cover-frame subtitle still" },
        { title: "الخطوة 5: SRT Bundle PDF", description: "10 SRT files archive reference PDF" },
      ],
    },
  },
  'ai-thumbnail-ab-generate': {
    zh: {
      title: "YouTube缩略图A/B生成10版",
      description: "5×2=10版高CTR缩略图",
      steps: [
        { title: "英文标题文案", description: "3种角度标题" },
        { title: "10版缩略图", description: "5标题×2风格" },
        { title: "1280×720裁切", description: "YT标准" },
        { title: "压缩≤2MB", description: "上传要求" },
        { title: "对比PDF", description: "10版并排对比会" },
      ],
    },
    en: {
      title: "AI YT Thumbnail A/B Generator",
      description: "5 titles × 2 layouts = 10 CTR-tested thumbnail iterations",
      steps: [
        { title: "3 Angle English Titles", description: "Distinct 3 angle title sets" },
        { title: "10 Thumbnail Variants", description: "5 titles × 2 design language = 10" },
        { title: "1280×720 Spec Crop", description: "YouTube 16:9 1280×720 standard" },
        { title: "≤2MB Compression", description: "YouTube file-size compliance" },
        { title: "A/B Comparison PDF", description: "10-variant comparison review deck" },
      ],
    },
    fr: {
      title: "FR-CC: AI YT Thumbnail A/B Generator",
      description: "(FR-CC) 5 titles × 2 layouts = 10 CTR-tested thumbnail iterations",
      steps: [
        { title: "Étape 1: 3 Angle English Titles", description: "Distinct 3 angle title sets" },
        { title: "Étape 2: 10 Thumbnail Variants", description: "5 titles × 2 design language = 10" },
        { title: "Étape 3: 1280×720 Spec Crop", description: "YouTube 16:9 1280×720 standard" },
        { title: "Étape 4: ≤2MB Compression", description: "YouTube file-size compliance" },
        { title: "Étape 5: A/B Comparison PDF", description: "10-variant comparison review deck" },
      ],
    },
    es: {
      title: "ES-CC: AI YT Thumbnail A/B Generator",
      description: "(ES-CC) 5 titles × 2 layouts = 10 CTR-tested thumbnail iterations",
      steps: [
        { title: "Paso 1: 3 Angle English Titles", description: "Distinct 3 angle title sets" },
        { title: "Paso 2: 10 Thumbnail Variants", description: "5 titles × 2 design language = 10" },
        { title: "Paso 3: 1280×720 Spec Crop", description: "YouTube 16:9 1280×720 standard" },
        { title: "Paso 4: ≤2MB Compression", description: "YouTube file-size compliance" },
        { title: "Paso 5: A/B Comparison PDF", description: "10-variant comparison review deck" },
      ],
    },
    hi: {
      title: "HI-सामग्री: AI YT Thumbnail A/B Generator",
      description: "(HI-सामग्री) 5 titles × 2 layouts = 10 CTR-tested thumbnail iterations",
      steps: [
        { title: "चरण 1: 3 Angle English Titles", description: "Distinct 3 angle title sets" },
        { title: "चरण 2: 10 Thumbnail Variants", description: "5 titles × 2 design language = 10" },
        { title: "चरण 3: 1280×720 Spec Crop", description: "YouTube 16:9 1280×720 standard" },
        { title: "चरण 4: ≤2MB Compression", description: "YouTube file-size compliance" },
        { title: "चरण 5: A/B Comparison PDF", description: "10-variant comparison review deck" },
      ],
    },
    ar: {
      title: "AR-م: AI YT Thumbnail A/B Generator",
      description: "(AR-م) 5 titles × 2 layouts = 10 CTR-tested thumbnail iterations",
      steps: [
        { title: "الخطوة 1: 3 Angle English Titles", description: "Distinct 3 angle title sets" },
        { title: "الخطوة 2: 10 Thumbnail Variants", description: "5 titles × 2 design language = 10" },
        { title: "الخطوة 3: 1280×720 Spec Crop", description: "YouTube 16:9 1280×720 standard" },
        { title: "الخطوة 4: ≤2MB Compression", description: "YouTube file-size compliance" },
        { title: "الخطوة 5: A/B Comparison PDF", description: "10-variant comparison review deck" },
      ],
    },
  },
  'blog-keyword-cluster': {
    zh: {
      title: "AHREFS关键词簇内容规划",
      description: "Pillar+Cluster 20词内外链计划",
      steps: [
        { title: "英文20标题", description: "20个标题含关键词" },
        { title: "Meta描述", description: "20条Meta Description" },
        { title: "关键词簇图", description: "思维导图可视化" },
        { title: "英语校对", description: "标题自然" },
        { title: "关键词PDF", description: "簇词库打印给团队" },
      ],
    },
    en: {
      title: "Ahrefs Keyword Cluster Content Plan",
      description: "Pillar + Cluster 20-keyword link building + content calendar",
      steps: [
        { title: "20 Keyword EN Titles", description: "20 optimized keyword titles" },
        { title: "Meta Description Set", description: "20 Meta Description write-ups" },
        { title: "Cluster Mind Map Visual", description: "Topic cluster mind map artwork" },
        { title: "English Natural Review", description: "Titles read like natural language" },
        { title: "Keyword Bible PDF", description: "Print for team: cluster keyword PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Ahrefs Keyword Cluster Content Plan",
      description: "(FR-CC) Pillar + Cluster 20-keyword link building + content calendar",
      steps: [
        { title: "Étape 1: 20 Keyword EN Titles", description: "20 optimized keyword titles" },
        { title: "Étape 2: Meta Description Set", description: "20 Meta Description write-ups" },
        { title: "Étape 3: Cluster Mind Map Visual", description: "Topic cluster mind map artwork" },
        { title: "Étape 4: English Natural Review", description: "Titles read like natural language" },
        { title: "Étape 5: Keyword Bible PDF", description: "Print for team: cluster keyword PDF" },
      ],
    },
    es: {
      title: "ES-CC: Ahrefs Keyword Cluster Content Plan",
      description: "(ES-CC) Pillar + Cluster 20-keyword link building + content calendar",
      steps: [
        { title: "Paso 1: 20 Keyword EN Titles", description: "20 optimized keyword titles" },
        { title: "Paso 2: Meta Description Set", description: "20 Meta Description write-ups" },
        { title: "Paso 3: Cluster Mind Map Visual", description: "Topic cluster mind map artwork" },
        { title: "Paso 4: English Natural Review", description: "Titles read like natural language" },
        { title: "Paso 5: Keyword Bible PDF", description: "Print for team: cluster keyword PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Ahrefs Keyword Cluster Content Plan",
      description: "(HI-सामग्री) Pillar + Cluster 20-keyword link building + content calendar",
      steps: [
        { title: "चरण 1: 20 Keyword EN Titles", description: "20 optimized keyword titles" },
        { title: "चरण 2: Meta Description Set", description: "20 Meta Description write-ups" },
        { title: "चरण 3: Cluster Mind Map Visual", description: "Topic cluster mind map artwork" },
        { title: "चरण 4: English Natural Review", description: "Titles read like natural language" },
        { title: "चरण 5: Keyword Bible PDF", description: "Print for team: cluster keyword PDF" },
      ],
    },
    ar: {
      title: "AR-م: Ahrefs Keyword Cluster Content Plan",
      description: "(AR-م) Pillar + Cluster 20-keyword link building + content calendar",
      steps: [
        { title: "الخطوة 1: 20 Keyword EN Titles", description: "20 optimized keyword titles" },
        { title: "الخطوة 2: Meta Description Set", description: "20 Meta Description write-ups" },
        { title: "الخطوة 3: Cluster Mind Map Visual", description: "Topic cluster mind map artwork" },
        { title: "الخطوة 4: English Natural Review", description: "Titles read like natural language" },
        { title: "الخطوة 5: Keyword Bible PDF", description: "Print for team: cluster keyword PDF" },
      ],
    },
  },
  'x-twitter-thread-hooks': {
    zh: {
      title: "X/Twitter爆款Thread 10版Hook",
      description: "每条Thread前3条引爆公式",
      steps: [
        { title: "10条Hook", description: "前3条Hook模板" },
        { title: "完整Thread", description: "每条10个连续推文" },
        { title: "配图5张", description: "配合推文5张图" },
        { title: "英语母语", description: "口语化自然" },
        { title: "Thread模板", description: "10版收藏PDF" },
      ],
    },
    en: {
      title: "X / Twitter Viral Thread Hook Library",
      description: "10 thread-opening Hook formulas + 10 complete thread libraries",
      steps: [
        { title: "10 Hook Templates", description: "10 first-3-tweets hook playbooks" },
        { title: "10 Complete Threads", description: "Each = 10 consecutive tweet thread" },
        { title: "5 Supporting Visuals", description: "Accompanying in-thread images" },
        { title: "Conversational Tone", description: "Oral-conversational English tone" },
        { title: "Thread Templates PDF", description: "10 template pack reference PDF" },
      ],
    },
    fr: {
      title: "FR-CC: X / Twitter Viral Thread Hook Library",
      description: "(FR-CC) 10 thread-opening Hook formulas + 10 complete thread libraries",
      steps: [
        { title: "Étape 1: 10 Hook Templates", description: "10 first-3-tweets hook playbooks" },
        { title: "Étape 2: 10 Complete Threads", description: "Each = 10 consecutive tweet thread" },
        { title: "Étape 3: 5 Supporting Visuals", description: "Accompanying in-thread images" },
        { title: "Étape 4: Conversational Tone", description: "Oral-conversational English tone" },
        { title: "Étape 5: Thread Templates PDF", description: "10 template pack reference PDF" },
      ],
    },
    es: {
      title: "ES-CC: X / Twitter Viral Thread Hook Library",
      description: "(ES-CC) 10 thread-opening Hook formulas + 10 complete thread libraries",
      steps: [
        { title: "Paso 1: 10 Hook Templates", description: "10 first-3-tweets hook playbooks" },
        { title: "Paso 2: 10 Complete Threads", description: "Each = 10 consecutive tweet thread" },
        { title: "Paso 3: 5 Supporting Visuals", description: "Accompanying in-thread images" },
        { title: "Paso 4: Conversational Tone", description: "Oral-conversational English tone" },
        { title: "Paso 5: Thread Templates PDF", description: "10 template pack reference PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: X / Twitter Viral Thread Hook Library",
      description: "(HI-सामग्री) 10 thread-opening Hook formulas + 10 complete thread libraries",
      steps: [
        { title: "चरण 1: 10 Hook Templates", description: "10 first-3-tweets hook playbooks" },
        { title: "चरण 2: 10 Complete Threads", description: "Each = 10 consecutive tweet thread" },
        { title: "चरण 3: 5 Supporting Visuals", description: "Accompanying in-thread images" },
        { title: "चरण 4: Conversational Tone", description: "Oral-conversational English tone" },
        { title: "चरण 5: Thread Templates PDF", description: "10 template pack reference PDF" },
      ],
    },
    ar: {
      title: "AR-م: X / Twitter Viral Thread Hook Library",
      description: "(AR-م) 10 thread-opening Hook formulas + 10 complete thread libraries",
      steps: [
        { title: "الخطوة 1: 10 Hook Templates", description: "10 first-3-tweets hook playbooks" },
        { title: "الخطوة 2: 10 Complete Threads", description: "Each = 10 consecutive tweet thread" },
        { title: "الخطوة 3: 5 Supporting Visuals", description: "Accompanying in-thread images" },
        { title: "الخطوة 4: Conversational Tone", description: "Oral-conversational English tone" },
        { title: "الخطوة 5: Thread Templates PDF", description: "10 template pack reference PDF" },
      ],
    },
  },
  'sponsored-content-brief': {
    zh: {
      title: "商单合作Brief模板+报价",
      description: "品牌Brief+报价单+交付清单",
      steps: [
        { title: "英文合作邮件", description: "Pitch/跟进/确认3版" },
        { title: "报价算", description: "阅读量×CPM×时长" },
        { title: "Media Kit", description: "2页媒体资料包" },
        { title: "品牌母语", description: "欧洲客户德语/法语" },
        { title: "合同签PDF", description: "盖章签名归档" },
      ],
    },
    en: {
      title: "Sponsorship Brief & Rate Card",
      description: "Brand collaboration brief, rate card & deliverable checklist templates",
      steps: [
        { title: "3 Partnership Email Flow", description: "Pitch / follow-up / confirm emails" },
        { title: "Rate Calculator", description: "Impressions × CPM × length math" },
        { title: "2-Page Media Kit", description: "2-page media / sponsorship kit" },
        { title: "EU FR/DE Locale", description: "FR/DE locale brand versions" },
        { title: "Signed Contract PDF", description: "Stamped & countersigned contract" },
      ],
    },
    fr: {
      title: "FR-CC: Sponsorship Brief & Rate Card",
      description: "(FR-CC) Brand collaboration brief, rate card & deliverable checklist templates",
      steps: [
        { title: "Étape 1: 3 Partnership Email Flow", description: "Pitch / follow-up / confirm emails" },
        { title: "Étape 2: Rate Calculator", description: "Impressions × CPM × length math" },
        { title: "Étape 3: 2-Page Media Kit", description: "2-page media / sponsorship kit" },
        { title: "Étape 4: EU FR/DE Locale", description: "FR/DE locale brand versions" },
        { title: "Étape 5: Signed Contract PDF", description: "Stamped & countersigned contract" },
      ],
    },
    es: {
      title: "ES-CC: Sponsorship Brief & Rate Card",
      description: "(ES-CC) Brand collaboration brief, rate card & deliverable checklist templates",
      steps: [
        { title: "Paso 1: 3 Partnership Email Flow", description: "Pitch / follow-up / confirm emails" },
        { title: "Paso 2: Rate Calculator", description: "Impressions × CPM × length math" },
        { title: "Paso 3: 2-Page Media Kit", description: "2-page media / sponsorship kit" },
        { title: "Paso 4: EU FR/DE Locale", description: "FR/DE locale brand versions" },
        { title: "Paso 5: Signed Contract PDF", description: "Stamped & countersigned contract" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Sponsorship Brief & Rate Card",
      description: "(HI-सामग्री) Brand collaboration brief, rate card & deliverable checklist templates",
      steps: [
        { title: "चरण 1: 3 Partnership Email Flow", description: "Pitch / follow-up / confirm emails" },
        { title: "चरण 2: Rate Calculator", description: "Impressions × CPM × length math" },
        { title: "चरण 3: 2-Page Media Kit", description: "2-page media / sponsorship kit" },
        { title: "चरण 4: EU FR/DE Locale", description: "FR/DE locale brand versions" },
        { title: "चरण 5: Signed Contract PDF", description: "Stamped & countersigned contract" },
      ],
    },
    ar: {
      title: "AR-م: Sponsorship Brief & Rate Card",
      description: "(AR-م) Brand collaboration brief, rate card & deliverable checklist templates",
      steps: [
        { title: "الخطوة 1: 3 Partnership Email Flow", description: "Pitch / follow-up / confirm emails" },
        { title: "الخطوة 2: Rate Calculator", description: "Impressions × CPM × length math" },
        { title: "الخطوة 3: 2-Page Media Kit", description: "2-page media / sponsorship kit" },
        { title: "الخطوة 4: EU FR/DE Locale", description: "FR/DE locale brand versions" },
        { title: "الخطوة 5: Signed Contract PDF", description: "Stamped & countersigned contract" },
      ],
    },
  },
  'carousel-post-10-template': {
    zh: {
      title: "10版LinkedIn/IG Carousel模板",
      description: "Listicle/教程/对比/故事/数据10种结构",
      steps: [
        { title: "10套Canva模板", description: "10套不同风格" },
        { title: "英文每页文案", description: "每套10页内容" },
        { title: "封面大标题", description: "10个高点击标题" },
        { title: "1080×1080裁切", description: "IG/LinkedIn方图" },
        { title: "每张≤1MB", description: "平台加载快" },
      ],
    },
    en: {
      title: "10 Carousel Post Templates (IG/LI)",
      description: "Listicle / how-to / comparison / story / data 10 carousel structures",
      steps: [
        { title: "10 Carousel Canva Templates", description: "10 distinct visual systems" },
        { title: "English Per-Slide Copy", description: "Each = 10 slides copy decks" },
        { title: "High-CTR Cover Titles", description: "10 attention-grab cover lines" },
        { title: "1080×1080 Crop", description: "IG/LinkedIn square format spec" },
        { title: "≤1MB per Slide", description: "Lightweight quick-load file size" },
      ],
    },
    fr: {
      title: "FR-CC: 10 Carousel Post Templates (IG/LI)",
      description: "(FR-CC) Listicle / how-to / comparison / story / data 10 carousel structures",
      steps: [
        { title: "Étape 1: 10 Carousel Canva Templates", description: "10 distinct visual systems" },
        { title: "Étape 2: English Per-Slide Copy", description: "Each = 10 slides copy decks" },
        { title: "Étape 3: High-CTR Cover Titles", description: "10 attention-grab cover lines" },
        { title: "Étape 4: 1080×1080 Crop", description: "IG/LinkedIn square format spec" },
        { title: "Étape 5: ≤1MB per Slide", description: "Lightweight quick-load file size" },
      ],
    },
    es: {
      title: "ES-CC: 10 Carousel Post Templates (IG/LI)",
      description: "(ES-CC) Listicle / how-to / comparison / story / data 10 carousel structures",
      steps: [
        { title: "Paso 1: 10 Carousel Canva Templates", description: "10 distinct visual systems" },
        { title: "Paso 2: English Per-Slide Copy", description: "Each = 10 slides copy decks" },
        { title: "Paso 3: High-CTR Cover Titles", description: "10 attention-grab cover lines" },
        { title: "Paso 4: 1080×1080 Crop", description: "IG/LinkedIn square format spec" },
        { title: "Paso 5: ≤1MB per Slide", description: "Lightweight quick-load file size" },
      ],
    },
    hi: {
      title: "HI-सामग्री: 10 Carousel Post Templates (IG/LI)",
      description: "(HI-सामग्री) Listicle / how-to / comparison / story / data 10 carousel structures",
      steps: [
        { title: "चरण 1: 10 Carousel Canva Templates", description: "10 distinct visual systems" },
        { title: "चरण 2: English Per-Slide Copy", description: "Each = 10 slides copy decks" },
        { title: "चरण 3: High-CTR Cover Titles", description: "10 attention-grab cover lines" },
        { title: "चरण 4: 1080×1080 Crop", description: "IG/LinkedIn square format spec" },
        { title: "चरण 5: ≤1MB per Slide", description: "Lightweight quick-load file size" },
      ],
    },
    ar: {
      title: "AR-م: 10 Carousel Post Templates (IG/LI)",
      description: "(AR-م) Listicle / how-to / comparison / story / data 10 carousel structures",
      steps: [
        { title: "الخطوة 1: 10 Carousel Canva Templates", description: "10 distinct visual systems" },
        { title: "الخطوة 2: English Per-Slide Copy", description: "Each = 10 slides copy decks" },
        { title: "الخطوة 3: High-CTR Cover Titles", description: "10 attention-grab cover lines" },
        { title: "الخطوة 4: 1080×1080 Crop", description: "IG/LinkedIn square format spec" },
        { title: "الخطوة 5: ≤1MB per Slide", description: "Lightweight quick-load file size" },
      ],
    },
  },
  'content-repurposing-7way': {
    zh: {
      title: "1条长文内容7端复用矩阵",
      description: "YT/博客/Newsletter/Thread/Carousel/邮件/TikTok",
      steps: [
        { title: "长文→7端脚本", description: "原内容改7种体裁" },
        { title: "7套尺寸", description: "横图/方图/竖图" },
        { title: "尺寸裁切", description: "平台最佳尺寸" },
        { title: "图片压缩", description: "各平台大小" },
        { title: "7端矩阵PDF", description: "复用指南存档" },
      ],
    },
    en: {
      title: "Single Long-Form → 7-Endpoint Repurpose",
      description: "Long-form blog repurposed to YT / IG / Newsletter / Thread / Carousel / Email / TikTok",
      steps: [
        { title: "7 Format Adaptation", description: "Transform piece into 7 genres" },
        { title: "7 Size Pack", description: "Landscape / Square / Portrait asset sizes" },
        { title: "Platform-Specific Crop", description: "Per-platform native aspect ratios" },
        { title: "Optimize Each Export", description: "Cross-platform file size tuning" },
        { title: "Repurpose SOP PDF", description: "7-endpoint repurposing handbook" },
      ],
    },
    fr: {
      title: "FR-CC: Single Long-Form → 7-Endpoint Repurpose",
      description: "(FR-CC) Long-form blog repurposed to YT / IG / Newsletter / Thread / Carousel / Email / TikTok",
      steps: [
        { title: "Étape 1: 7 Format Adaptation", description: "Transform piece into 7 genres" },
        { title: "Étape 2: 7 Size Pack", description: "Landscape / Square / Portrait asset sizes" },
        { title: "Étape 3: Platform-Specific Crop", description: "Per-platform native aspect ratios" },
        { title: "Étape 4: Optimize Each Export", description: "Cross-platform file size tuning" },
        { title: "Étape 5: Repurpose SOP PDF", description: "7-endpoint repurposing handbook" },
      ],
    },
    es: {
      title: "ES-CC: Single Long-Form → 7-Endpoint Repurpose",
      description: "(ES-CC) Long-form blog repurposed to YT / IG / Newsletter / Thread / Carousel / Email / TikTok",
      steps: [
        { title: "Paso 1: 7 Format Adaptation", description: "Transform piece into 7 genres" },
        { title: "Paso 2: 7 Size Pack", description: "Landscape / Square / Portrait asset sizes" },
        { title: "Paso 3: Platform-Specific Crop", description: "Per-platform native aspect ratios" },
        { title: "Paso 4: Optimize Each Export", description: "Cross-platform file size tuning" },
        { title: "Paso 5: Repurpose SOP PDF", description: "7-endpoint repurposing handbook" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Single Long-Form → 7-Endpoint Repurpose",
      description: "(HI-सामग्री) Long-form blog repurposed to YT / IG / Newsletter / Thread / Carousel / Email / TikTok",
      steps: [
        { title: "चरण 1: 7 Format Adaptation", description: "Transform piece into 7 genres" },
        { title: "चरण 2: 7 Size Pack", description: "Landscape / Square / Portrait asset sizes" },
        { title: "चरण 3: Platform-Specific Crop", description: "Per-platform native aspect ratios" },
        { title: "चरण 4: Optimize Each Export", description: "Cross-platform file size tuning" },
        { title: "चरण 5: Repurpose SOP PDF", description: "7-endpoint repurposing handbook" },
      ],
    },
    ar: {
      title: "AR-م: Single Long-Form → 7-Endpoint Repurpose",
      description: "(AR-م) Long-form blog repurposed to YT / IG / Newsletter / Thread / Carousel / Email / TikTok",
      steps: [
        { title: "الخطوة 1: 7 Format Adaptation", description: "Transform piece into 7 genres" },
        { title: "الخطوة 2: 7 Size Pack", description: "Landscape / Square / Portrait asset sizes" },
        { title: "الخطوة 3: Platform-Specific Crop", description: "Per-platform native aspect ratios" },
        { title: "الخطوة 4: Optimize Each Export", description: "Cross-platform file size tuning" },
        { title: "الخطوة 5: Repurpose SOP PDF", description: "7-endpoint repurposing handbook" },
      ],
    },
  },
  'niche-newsletter-monetize': {
    zh: {
      title: "垂直Newsletter变现4路径",
      description: "赞助/付费/联盟/数字产品4路",
      steps: [
        { title: "英文4版广告位说明", description: "赞助介绍4档" },
        { title: "定价梯度", description: "每档广告价格算" },
        { title: "Sponsor Kit", description: "2页广告资料包" },
        { title: "欧洲语言", description: "欧洲赞助商介绍" },
        { title: "Sponsor合同", description: "年度赞助合同签" },
      ],
    },
    en: {
      title: "Niche Newsletter Monetization 4-Path",
      description: "Sponsored / paid / affiliates / digital 4 monetization levers for newsletter",
      steps: [
        { title: "4 Ad-Tier English Decks", description: "4-tier sponsored introduction decks" },
        { title: "Tiered Pricing Model", description: "Per-ad pricing tier calculator" },
        { title: "2-Page Sponsor Kit", description: "2-page advertiser Media Kit" },
        { title: "EU Locale Decks", description: "EN/FR/ES sponsor intro translation" },
        { title: "Annual Sponsor Contract", description: "Annual sponsor countersigned contract" },
      ],
    },
    fr: {
      title: "FR-CC: Niche Newsletter Monetization 4-Path",
      description: "(FR-CC) Sponsored / paid / affiliates / digital 4 monetization levers for newsletter",
      steps: [
        { title: "Étape 1: 4 Ad-Tier English Decks", description: "4-tier sponsored introduction decks" },
        { title: "Étape 2: Tiered Pricing Model", description: "Per-ad pricing tier calculator" },
        { title: "Étape 3: 2-Page Sponsor Kit", description: "2-page advertiser Media Kit" },
        { title: "Étape 4: EU Locale Decks", description: "EN/FR/ES sponsor intro translation" },
        { title: "Étape 5: Annual Sponsor Contract", description: "Annual sponsor countersigned contract" },
      ],
    },
    es: {
      title: "ES-CC: Niche Newsletter Monetization 4-Path",
      description: "(ES-CC) Sponsored / paid / affiliates / digital 4 monetization levers for newsletter",
      steps: [
        { title: "Paso 1: 4 Ad-Tier English Decks", description: "4-tier sponsored introduction decks" },
        { title: "Paso 2: Tiered Pricing Model", description: "Per-ad pricing tier calculator" },
        { title: "Paso 3: 2-Page Sponsor Kit", description: "2-page advertiser Media Kit" },
        { title: "Paso 4: EU Locale Decks", description: "EN/FR/ES sponsor intro translation" },
        { title: "Paso 5: Annual Sponsor Contract", description: "Annual sponsor countersigned contract" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Niche Newsletter Monetization 4-Path",
      description: "(HI-सामग्री) Sponsored / paid / affiliates / digital 4 monetization levers for newsletter",
      steps: [
        { title: "चरण 1: 4 Ad-Tier English Decks", description: "4-tier sponsored introduction decks" },
        { title: "चरण 2: Tiered Pricing Model", description: "Per-ad pricing tier calculator" },
        { title: "चरण 3: 2-Page Sponsor Kit", description: "2-page advertiser Media Kit" },
        { title: "चरण 4: EU Locale Decks", description: "EN/FR/ES sponsor intro translation" },
        { title: "चरण 5: Annual Sponsor Contract", description: "Annual sponsor countersigned contract" },
      ],
    },
    ar: {
      title: "AR-م: Niche Newsletter Monetization 4-Path",
      description: "(AR-م) Sponsored / paid / affiliates / digital 4 monetization levers for newsletter",
      steps: [
        { title: "الخطوة 1: 4 Ad-Tier English Decks", description: "4-tier sponsored introduction decks" },
        { title: "الخطوة 2: Tiered Pricing Model", description: "Per-ad pricing tier calculator" },
        { title: "الخطوة 3: 2-Page Sponsor Kit", description: "2-page advertiser Media Kit" },
        { title: "الخطوة 4: EU Locale Decks", description: "EN/FR/ES sponsor intro translation" },
        { title: "الخطوة 5: Annual Sponsor Contract", description: "Annual sponsor countersigned contract" },
      ],
    },
  },
  'user-generated-content-campaign': {
    zh: {
      title: "UGC征集活动策划SOP",
      description: "征集规则+奖品+发布+精选四步",
      steps: [
        { title: "英文活动文案", description: "规则/奖品/期限说明" },
        { title: "活动海报", description: "3版海报+故事" },
        { title: "通知邮件", description: "入选/落选通知" },
        { title: "双语版", description: "英法双语活动" },
        { title: "UGC精选拼图", description: "每周精选拼图" },
      ],
    },
    en: {
      title: "UGC Campaign Planning SOP",
      description: "Prize rules, submissions process, publishing & feature selection SOP",
      steps: [
        { title: "English Campaign Copy", description: "Rules, prizes, deadlines clearly written" },
        { title: "3 Promotional Posters", description: "3 versions poster + story art" },
        { title: "Accept/Reject Emails", description: "Winner / non-winner notifications" },
        { title: "Bilingual EN/FR", description: "FR/EN bilingual campaign copy" },
        { title: "Weekly Winner Collage", description: "Weekly featured UGC collage art" },
      ],
    },
    fr: {
      title: "FR-CC: UGC Campaign Planning SOP",
      description: "(FR-CC) Prize rules, submissions process, publishing & feature selection SOP",
      steps: [
        { title: "Étape 1: English Campaign Copy", description: "Rules, prizes, deadlines clearly written" },
        { title: "Étape 2: 3 Promotional Posters", description: "3 versions poster + story art" },
        { title: "Étape 3: Accept/Reject Emails", description: "Winner / non-winner notifications" },
        { title: "Étape 4: Bilingual EN/FR", description: "FR/EN bilingual campaign copy" },
        { title: "Étape 5: Weekly Winner Collage", description: "Weekly featured UGC collage art" },
      ],
    },
    es: {
      title: "ES-CC: UGC Campaign Planning SOP",
      description: "(ES-CC) Prize rules, submissions process, publishing & feature selection SOP",
      steps: [
        { title: "Paso 1: English Campaign Copy", description: "Rules, prizes, deadlines clearly written" },
        { title: "Paso 2: 3 Promotional Posters", description: "3 versions poster + story art" },
        { title: "Paso 3: Accept/Reject Emails", description: "Winner / non-winner notifications" },
        { title: "Paso 4: Bilingual EN/FR", description: "FR/EN bilingual campaign copy" },
        { title: "Paso 5: Weekly Winner Collage", description: "Weekly featured UGC collage art" },
      ],
    },
    hi: {
      title: "HI-सामग्री: UGC Campaign Planning SOP",
      description: "(HI-सामग्री) Prize rules, submissions process, publishing & feature selection SOP",
      steps: [
        { title: "चरण 1: English Campaign Copy", description: "Rules, prizes, deadlines clearly written" },
        { title: "चरण 2: 3 Promotional Posters", description: "3 versions poster + story art" },
        { title: "चरण 3: Accept/Reject Emails", description: "Winner / non-winner notifications" },
        { title: "चरण 4: Bilingual EN/FR", description: "FR/EN bilingual campaign copy" },
        { title: "चरण 5: Weekly Winner Collage", description: "Weekly featured UGC collage art" },
      ],
    },
    ar: {
      title: "AR-م: UGC Campaign Planning SOP",
      description: "(AR-م) Prize rules, submissions process, publishing & feature selection SOP",
      steps: [
        { title: "الخطوة 1: English Campaign Copy", description: "Rules, prizes, deadlines clearly written" },
        { title: "الخطوة 2: 3 Promotional Posters", description: "3 versions poster + story art" },
        { title: "الخطوة 3: Accept/Reject Emails", description: "Winner / non-winner notifications" },
        { title: "الخطوة 4: Bilingual EN/FR", description: "FR/EN bilingual campaign copy" },
        { title: "الخطوة 5: Weekly Winner Collage", description: "Weekly featured UGC collage art" },
      ],
    },
  },
  'fashion-lookbook-content': {
    zh: {
      title: "时尚/穿搭Lookbook内容生产",
      description: "9图+Reels+博客+YT开箱",
      steps: [
        { title: "穿搭抠图", description: "商品图去背景" },
        { title: "9张拼图", description: "IG方图9宫格" },
        { title: "封面设计", description: "YT/博客封面" },
        { title: "英文搭配说明", description: "每件单品介绍" },
        { title: "图≤500KB", description: "IG上传快速" },
      ],
    },
    en: {
      title: "Fashion Lookbook Content Production",
      description: "9-grid / Reels / blog / YT unboxing fashion lookbook 4-platform kit",
      steps: [
        { title: "Outfit Cutouts", description: "Product PNG background removal" },
        { title: "9-Post Grid Layouts", description: "IG 9-square grid compositions" },
        { title: "YT / Blog Covers", description: "YouTube / blog cover artwork" },
        { title: "English Outfit Write-ups", description: "Per-piece ensemble description" },
        { title: "≤500KB IG Images", description: "Fast-load Instagram export sizes" },
      ],
    },
    fr: {
      title: "FR-CC: Fashion Lookbook Content Production",
      description: "(FR-CC) 9-grid / Reels / blog / YT unboxing fashion lookbook 4-platform kit",
      steps: [
        { title: "Étape 1: Outfit Cutouts", description: "Product PNG background removal" },
        { title: "Étape 2: 9-Post Grid Layouts", description: "IG 9-square grid compositions" },
        { title: "Étape 3: YT / Blog Covers", description: "YouTube / blog cover artwork" },
        { title: "Étape 4: English Outfit Write-ups", description: "Per-piece ensemble description" },
        { title: "Étape 5: ≤500KB IG Images", description: "Fast-load Instagram export sizes" },
      ],
    },
    es: {
      title: "ES-CC: Fashion Lookbook Content Production",
      description: "(ES-CC) 9-grid / Reels / blog / YT unboxing fashion lookbook 4-platform kit",
      steps: [
        { title: "Paso 1: Outfit Cutouts", description: "Product PNG background removal" },
        { title: "Paso 2: 9-Post Grid Layouts", description: "IG 9-square grid compositions" },
        { title: "Paso 3: YT / Blog Covers", description: "YouTube / blog cover artwork" },
        { title: "Paso 4: English Outfit Write-ups", description: "Per-piece ensemble description" },
        { title: "Paso 5: ≤500KB IG Images", description: "Fast-load Instagram export sizes" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Fashion Lookbook Content Production",
      description: "(HI-सामग्री) 9-grid / Reels / blog / YT unboxing fashion lookbook 4-platform kit",
      steps: [
        { title: "चरण 1: Outfit Cutouts", description: "Product PNG background removal" },
        { title: "चरण 2: 9-Post Grid Layouts", description: "IG 9-square grid compositions" },
        { title: "चरण 3: YT / Blog Covers", description: "YouTube / blog cover artwork" },
        { title: "चरण 4: English Outfit Write-ups", description: "Per-piece ensemble description" },
        { title: "चरण 5: ≤500KB IG Images", description: "Fast-load Instagram export sizes" },
      ],
    },
    ar: {
      title: "AR-م: Fashion Lookbook Content Production",
      description: "(AR-م) 9-grid / Reels / blog / YT unboxing fashion lookbook 4-platform kit",
      steps: [
        { title: "الخطوة 1: Outfit Cutouts", description: "Product PNG background removal" },
        { title: "الخطوة 2: 9-Post Grid Layouts", description: "IG 9-square grid compositions" },
        { title: "الخطوة 3: YT / Blog Covers", description: "YouTube / blog cover artwork" },
        { title: "الخطوة 4: English Outfit Write-ups", description: "Per-piece ensemble description" },
        { title: "الخطوة 5: ≤500KB IG Images", description: "Fast-load Instagram export sizes" },
      ],
    },
  },
  'b-roll-shot-list-template': {
    zh: {
      title: "视频B-roll分镜清单20镜头",
      description: "产品/人物/空镜/细节/转场20镜头",
      steps: [
        { title: "英文分镜脚本", description: "20镜头分镜" },
        { title: "分镜卡", description: "9格分镜表图" },
        { title: "英语/西班牙语", description: "团队外籍成员用" },
        { title: "拍摄说明", description: "每个镜头一句话" },
        { title: "打印版", description: "拍摄现场PDF随身" },
      ],
    },
    en: {
      title: "B-Roll Shot List 20-Lens Template",
      description: "Product / talent / establishing / detail / transition 20-shot storyboard",
      steps: [
        { title: "20-Shot English Script", description: "20-shot storyboard shot list" },
        { title: "9-Frame Storyboard Art", description: "9-panel storyboard layout visual" },
        { title: "EN / ES Crew Versions", description: "Bilingual EN/ES crew call sheets" },
        { title: "Shot Descriptions", description: "One-line each shot description" },
        { title: "On-Set Pocket PDF", description: "Printable on-location shoot PDF" },
      ],
    },
    fr: {
      title: "FR-CC: B-Roll Shot List 20-Lens Template",
      description: "(FR-CC) Product / talent / establishing / detail / transition 20-shot storyboard",
      steps: [
        { title: "Étape 1: 20-Shot English Script", description: "20-shot storyboard shot list" },
        { title: "Étape 2: 9-Frame Storyboard Art", description: "9-panel storyboard layout visual" },
        { title: "Étape 3: EN / ES Crew Versions", description: "Bilingual EN/ES crew call sheets" },
        { title: "Étape 4: Shot Descriptions", description: "One-line each shot description" },
        { title: "Étape 5: On-Set Pocket PDF", description: "Printable on-location shoot PDF" },
      ],
    },
    es: {
      title: "ES-CC: B-Roll Shot List 20-Lens Template",
      description: "(ES-CC) Product / talent / establishing / detail / transition 20-shot storyboard",
      steps: [
        { title: "Paso 1: 20-Shot English Script", description: "20-shot storyboard shot list" },
        { title: "Paso 2: 9-Frame Storyboard Art", description: "9-panel storyboard layout visual" },
        { title: "Paso 3: EN / ES Crew Versions", description: "Bilingual EN/ES crew call sheets" },
        { title: "Paso 4: Shot Descriptions", description: "One-line each shot description" },
        { title: "Paso 5: On-Set Pocket PDF", description: "Printable on-location shoot PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: B-Roll Shot List 20-Lens Template",
      description: "(HI-सामग्री) Product / talent / establishing / detail / transition 20-shot storyboard",
      steps: [
        { title: "चरण 1: 20-Shot English Script", description: "20-shot storyboard shot list" },
        { title: "चरण 2: 9-Frame Storyboard Art", description: "9-panel storyboard layout visual" },
        { title: "चरण 3: EN / ES Crew Versions", description: "Bilingual EN/ES crew call sheets" },
        { title: "चरण 4: Shot Descriptions", description: "One-line each shot description" },
        { title: "चरण 5: On-Set Pocket PDF", description: "Printable on-location shoot PDF" },
      ],
    },
    ar: {
      title: "AR-م: B-Roll Shot List 20-Lens Template",
      description: "(AR-م) Product / talent / establishing / detail / transition 20-shot storyboard",
      steps: [
        { title: "الخطوة 1: 20-Shot English Script", description: "20-shot storyboard shot list" },
        { title: "الخطوة 2: 9-Frame Storyboard Art", description: "9-panel storyboard layout visual" },
        { title: "الخطوة 3: EN / ES Crew Versions", description: "Bilingual EN/ES crew call sheets" },
        { title: "الخطوة 4: Shot Descriptions", description: "One-line each shot description" },
        { title: "الخطوة 5: On-Set Pocket PDF", description: "Printable on-location shoot PDF" },
      ],
    },
  },
  'content-team-style-guide': {
    zh: {
      title: "内容团队品牌语气指南",
      description: "词汇/标题/格式/禁用词4部分",
      steps: [
        { title: "英文指南6000字", description: "4部分完整" },
        { title: "指南封面", description: "A4可打印封面" },
        { title: "法/德语", description: "欧洲团队成员" },
        { title: "PDF签名", description: "团队确认" },
        { title: "附件合并", description: "指南+模板+例" },
      ],
    },
    en: {
      title: "Content Team Tone of Voice Guide",
      description: "Vocabulary / titles / formatting / forbidden words 4-section style guide",
      steps: [
        { title: "6000-Word EN Guide", description: "4-section comprehensive guide" },
        { title: "Printable Cover Art", description: "A4 printable style guide cover" },
        { title: "FR / DE Locale", description: "FR/DE EU team translations" },
        { title: "Team Sign-Off PDF", description: "Team countersigned standards" },
        { title: "Appendices Pack Merge", description: "Style guide + templates + examples" },
      ],
    },
    fr: {
      title: "FR-CC: Content Team Tone of Voice Guide",
      description: "(FR-CC) Vocabulary / titles / formatting / forbidden words 4-section style guide",
      steps: [
        { title: "Étape 1: 6000-Word EN Guide", description: "4-section comprehensive guide" },
        { title: "Étape 2: Printable Cover Art", description: "A4 printable style guide cover" },
        { title: "Étape 3: FR / DE Locale", description: "FR/DE EU team translations" },
        { title: "Étape 4: Team Sign-Off PDF", description: "Team countersigned standards" },
        { title: "Étape 5: Appendices Pack Merge", description: "Style guide + templates + examples" },
      ],
    },
    es: {
      title: "ES-CC: Content Team Tone of Voice Guide",
      description: "(ES-CC) Vocabulary / titles / formatting / forbidden words 4-section style guide",
      steps: [
        { title: "Paso 1: 6000-Word EN Guide", description: "4-section comprehensive guide" },
        { title: "Paso 2: Printable Cover Art", description: "A4 printable style guide cover" },
        { title: "Paso 3: FR / DE Locale", description: "FR/DE EU team translations" },
        { title: "Paso 4: Team Sign-Off PDF", description: "Team countersigned standards" },
        { title: "Paso 5: Appendices Pack Merge", description: "Style guide + templates + examples" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Content Team Tone of Voice Guide",
      description: "(HI-सामग्री) Vocabulary / titles / formatting / forbidden words 4-section style guide",
      steps: [
        { title: "चरण 1: 6000-Word EN Guide", description: "4-section comprehensive guide" },
        { title: "चरण 2: Printable Cover Art", description: "A4 printable style guide cover" },
        { title: "चरण 3: FR / DE Locale", description: "FR/DE EU team translations" },
        { title: "चरण 4: Team Sign-Off PDF", description: "Team countersigned standards" },
        { title: "चरण 5: Appendices Pack Merge", description: "Style guide + templates + examples" },
      ],
    },
    ar: {
      title: "AR-م: Content Team Tone of Voice Guide",
      description: "(AR-م) Vocabulary / titles / formatting / forbidden words 4-section style guide",
      steps: [
        { title: "الخطوة 1: 6000-Word EN Guide", description: "4-section comprehensive guide" },
        { title: "الخطوة 2: Printable Cover Art", description: "A4 printable style guide cover" },
        { title: "الخطوة 3: FR / DE Locale", description: "FR/DE EU team translations" },
        { title: "الخطوة 4: Team Sign-Off PDF", description: "Team countersigned standards" },
        { title: "الخطوة 5: Appendices Pack Merge", description: "Style guide + templates + examples" },
      ],
    },
  },
  'email-automation-flow-welcome': {
    zh: {
      title: "欢迎邮件序列7天7封",
      description: "教育+案例+信任→转化",
      steps: [
        { title: "英文7封邮件", description: "7封不同角度" },
        { title: "邮件Banner", description: "3张节日/新品Banner" },
        { title: "法语/西语", description: "双语序列" },
        { title: "Banner压缩", description: "≤300KB" },
        { title: "邮件脚本", description: "7封存档PDF" },
      ],
    },
    en: {
      title: "Welcome Email 7-Day 7-Email Series",
      description: "Educational → social proof → trust → conversion 7-email nurture flow",
      steps: [
        { title: "7 English Email Letters", description: "7 distinct angle email copy set" },
        { title: "3 Email Banner Creatives", description: "Holiday / new-product email banners" },
        { title: "FR / ES Locale Series", description: "Bilingual FR/ES parallel series" },
        { title: "≤300KB Banner Size", description: "Light email banner export spec" },
        { title: "Series Archive PDF", description: "7-email printed archive PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Welcome Email 7-Day 7-Email Series",
      description: "(FR-CC) Educational → social proof → trust → conversion 7-email nurture flow",
      steps: [
        { title: "Étape 1: 7 English Email Letters", description: "7 distinct angle email copy set" },
        { title: "Étape 2: 3 Email Banner Creatives", description: "Holiday / new-product email banners" },
        { title: "Étape 3: FR / ES Locale Series", description: "Bilingual FR/ES parallel series" },
        { title: "Étape 4: ≤300KB Banner Size", description: "Light email banner export spec" },
        { title: "Étape 5: Series Archive PDF", description: "7-email printed archive PDF" },
      ],
    },
    es: {
      title: "ES-CC: Welcome Email 7-Day 7-Email Series",
      description: "(ES-CC) Educational → social proof → trust → conversion 7-email nurture flow",
      steps: [
        { title: "Paso 1: 7 English Email Letters", description: "7 distinct angle email copy set" },
        { title: "Paso 2: 3 Email Banner Creatives", description: "Holiday / new-product email banners" },
        { title: "Paso 3: FR / ES Locale Series", description: "Bilingual FR/ES parallel series" },
        { title: "Paso 4: ≤300KB Banner Size", description: "Light email banner export spec" },
        { title: "Paso 5: Series Archive PDF", description: "7-email printed archive PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Welcome Email 7-Day 7-Email Series",
      description: "(HI-सामग्री) Educational → social proof → trust → conversion 7-email nurture flow",
      steps: [
        { title: "चरण 1: 7 English Email Letters", description: "7 distinct angle email copy set" },
        { title: "चरण 2: 3 Email Banner Creatives", description: "Holiday / new-product email banners" },
        { title: "चरण 3: FR / ES Locale Series", description: "Bilingual FR/ES parallel series" },
        { title: "चरण 4: ≤300KB Banner Size", description: "Light email banner export spec" },
        { title: "चरण 5: Series Archive PDF", description: "7-email printed archive PDF" },
      ],
    },
    ar: {
      title: "AR-م: Welcome Email 7-Day 7-Email Series",
      description: "(AR-م) Educational → social proof → trust → conversion 7-email nurture flow",
      steps: [
        { title: "الخطوة 1: 7 English Email Letters", description: "7 distinct angle email copy set" },
        { title: "الخطوة 2: 3 Email Banner Creatives", description: "Holiday / new-product email banners" },
        { title: "الخطوة 3: FR / ES Locale Series", description: "Bilingual FR/ES parallel series" },
        { title: "الخطوة 4: ≤300KB Banner Size", description: "Light email banner export spec" },
        { title: "الخطوة 5: Series Archive PDF", description: "7-email printed archive PDF" },
      ],
    },
  },
  'digital-planner-365-template': {
    zh: {
      title: "GoodNotes/Notability 365天电子计划本",
      description: "年/月/周日程+习惯+打卡",
      steps: [
        { title: "365页 Planner", description: "年/月/周/日" },
        { title: "英文使用说明", description: "1000字使用指南" },
        { title: "Listing标题", description: "Etsy/Shopify标题" },
        { title: "预览Mockup", description: "产品预览图5张" },
        { title: "使用指南PDF", description: "随下载附赠" },
      ],
    },
    en: {
      title: "GoodNotes 365-Day Digital Planner",
      description: "Year / month / week / day tracker + habit + check-in digital planner PDF",
      steps: [
        { title: "365-Day Planner Build", description: "Y / M / W / D structure build" },
        { title: "English Usage Guide", description: "1000-word user instructions" },
        { title: "Shop Listing Titles", description: "Etsy / Shopify product titles" },
        { title: "5 Preview Mockups", description: "5 preview / mockup image renders" },
        { title: "Bonus How-To PDF", description: "Download-bonus usage guide PDF" },
      ],
    },
    fr: {
      title: "FR-CC: GoodNotes 365-Day Digital Planner",
      description: "(FR-CC) Year / month / week / day tracker + habit + check-in digital planner PDF",
      steps: [
        { title: "Étape 1: 365-Day Planner Build", description: "Y / M / W / D structure build" },
        { title: "Étape 2: English Usage Guide", description: "1000-word user instructions" },
        { title: "Étape 3: Shop Listing Titles", description: "Etsy / Shopify product titles" },
        { title: "Étape 4: 5 Preview Mockups", description: "5 preview / mockup image renders" },
        { title: "Étape 5: Bonus How-To PDF", description: "Download-bonus usage guide PDF" },
      ],
    },
    es: {
      title: "ES-CC: GoodNotes 365-Day Digital Planner",
      description: "(ES-CC) Year / month / week / day tracker + habit + check-in digital planner PDF",
      steps: [
        { title: "Paso 1: 365-Day Planner Build", description: "Y / M / W / D structure build" },
        { title: "Paso 2: English Usage Guide", description: "1000-word user instructions" },
        { title: "Paso 3: Shop Listing Titles", description: "Etsy / Shopify product titles" },
        { title: "Paso 4: 5 Preview Mockups", description: "5 preview / mockup image renders" },
        { title: "Paso 5: Bonus How-To PDF", description: "Download-bonus usage guide PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: GoodNotes 365-Day Digital Planner",
      description: "(HI-सामग्री) Year / month / week / day tracker + habit + check-in digital planner PDF",
      steps: [
        { title: "चरण 1: 365-Day Planner Build", description: "Y / M / W / D structure build" },
        { title: "चरण 2: English Usage Guide", description: "1000-word user instructions" },
        { title: "चरण 3: Shop Listing Titles", description: "Etsy / Shopify product titles" },
        { title: "चरण 4: 5 Preview Mockups", description: "5 preview / mockup image renders" },
        { title: "चरण 5: Bonus How-To PDF", description: "Download-bonus usage guide PDF" },
      ],
    },
    ar: {
      title: "AR-م: GoodNotes 365-Day Digital Planner",
      description: "(AR-م) Year / month / week / day tracker + habit + check-in digital planner PDF",
      steps: [
        { title: "الخطوة 1: 365-Day Planner Build", description: "Y / M / W / D structure build" },
        { title: "الخطوة 2: English Usage Guide", description: "1000-word user instructions" },
        { title: "الخطوة 3: Shop Listing Titles", description: "Etsy / Shopify product titles" },
        { title: "الخطوة 4: 5 Preview Mockups", description: "5 preview / mockup image renders" },
        { title: "الخطوة 5: Bonus How-To PDF", description: "Download-bonus usage guide PDF" },
      ],
    },
  },
  'tiktok-shop-live-script': {
    zh: {
      title: "TikTok Shop直播脚本3小时场",
      description: "开场/选品/逼单/抽奖/收尾结构",
      steps: [
        { title: "英文脚本", description: "3小时完整话术" },
        { title: "逼单话术", description: "10条逼单节奏点" },
        { title: "直播间贴片", description: "背景板/优惠券图" },
        { title: "东南亚语言", description: "马来/越南/泰语" },
        { title: "直播流程PDF", description: "团队人手一份" },
      ],
    },
    en: {
      title: "TikTok Shop 3-Hour Live Show Script",
      description: "Opening → lineup → urgency → lucky draw → wrap structure",
      steps: [
        { title: "3-Hour EN Script", description: "Full 3-hour English livestream copy" },
        { title: "10 Urgency Beats", description: "10 CTA urgency driver beats" },
        { title: "Live Overlay Graphics", description: "Stream overlays & coupon assets" },
        { title: "SEA Language Variants", description: "MY / VN / TH local language packs" },
        { title: "Crew Run-of-Show PDF", description: "Printed show flow crew PDF" },
      ],
    },
    fr: {
      title: "FR-CC: TikTok Shop 3-Hour Live Show Script",
      description: "(FR-CC) Opening → lineup → urgency → lucky draw → wrap structure",
      steps: [
        { title: "Étape 1: 3-Hour EN Script", description: "Full 3-hour English livestream copy" },
        { title: "Étape 2: 10 Urgency Beats", description: "10 CTA urgency driver beats" },
        { title: "Étape 3: Live Overlay Graphics", description: "Stream overlays & coupon assets" },
        { title: "Étape 4: SEA Language Variants", description: "MY / VN / TH local language packs" },
        { title: "Étape 5: Crew Run-of-Show PDF", description: "Printed show flow crew PDF" },
      ],
    },
    es: {
      title: "ES-CC: TikTok Shop 3-Hour Live Show Script",
      description: "(ES-CC) Opening → lineup → urgency → lucky draw → wrap structure",
      steps: [
        { title: "Paso 1: 3-Hour EN Script", description: "Full 3-hour English livestream copy" },
        { title: "Paso 2: 10 Urgency Beats", description: "10 CTA urgency driver beats" },
        { title: "Paso 3: Live Overlay Graphics", description: "Stream overlays & coupon assets" },
        { title: "Paso 4: SEA Language Variants", description: "MY / VN / TH local language packs" },
        { title: "Paso 5: Crew Run-of-Show PDF", description: "Printed show flow crew PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: TikTok Shop 3-Hour Live Show Script",
      description: "(HI-सामग्री) Opening → lineup → urgency → lucky draw → wrap structure",
      steps: [
        { title: "चरण 1: 3-Hour EN Script", description: "Full 3-hour English livestream copy" },
        { title: "चरण 2: 10 Urgency Beats", description: "10 CTA urgency driver beats" },
        { title: "चरण 3: Live Overlay Graphics", description: "Stream overlays & coupon assets" },
        { title: "चरण 4: SEA Language Variants", description: "MY / VN / TH local language packs" },
        { title: "चरण 5: Crew Run-of-Show PDF", description: "Printed show flow crew PDF" },
      ],
    },
    ar: {
      title: "AR-م: TikTok Shop 3-Hour Live Show Script",
      description: "(AR-م) Opening → lineup → urgency → lucky draw → wrap structure",
      steps: [
        { title: "الخطوة 1: 3-Hour EN Script", description: "Full 3-hour English livestream copy" },
        { title: "الخطوة 2: 10 Urgency Beats", description: "10 CTA urgency driver beats" },
        { title: "الخطوة 3: Live Overlay Graphics", description: "Stream overlays & coupon assets" },
        { title: "الخطوة 4: SEA Language Variants", description: "MY / VN / TH local language packs" },
        { title: "الخطوة 5: Crew Run-of-Show PDF", description: "Printed show flow crew PDF" },
      ],
    },
  },
  'content-writer-pm-checklist': {
    zh: {
      title: "内容项目经理发布前18项清单",
      description: "SEO/格式/图片/CTA/互链18项",
      steps: [
        { title: "英文清单说明", description: "每1项解释目的" },
        { title: "清单卡片", description: "18项可视化卡片" },
        { title: "文章ID编码", description: "发布编号生成" },
        { title: "法/德语", description: "欧洲团队" },
        { title: "打印清单", description: "发布前逐项勾" },
      ],
    },
    en: {
      title: "Editorial Publish 18-Point Checklist",
      description: "SEO / formatting / images / CTA / internal-links 18-point pre-flight list",
      steps: [
        { title: "18-Item Rationale Doc", description: "Per-item why-this-matters explanation" },
        { title: "Card Format Cheat Sheet", description: "18-point visual checklist cards" },
        { title: "Article ID Encoding", description: "Publish sequence ID generator" },
        { title: "FR / DE Team Locale", description: "EU team translated checklist" },
        { title: "Printable Checklist", description: "Tick-off print-at-time-of-publish sheet" },
      ],
    },
    fr: {
      title: "FR-CC: Editorial Publish 18-Point Checklist",
      description: "(FR-CC) SEO / formatting / images / CTA / internal-links 18-point pre-flight list",
      steps: [
        { title: "Étape 1: 18-Item Rationale Doc", description: "Per-item why-this-matters explanation" },
        { title: "Étape 2: Card Format Cheat Sheet", description: "18-point visual checklist cards" },
        { title: "Étape 3: Article ID Encoding", description: "Publish sequence ID generator" },
        { title: "Étape 4: FR / DE Team Locale", description: "EU team translated checklist" },
        { title: "Étape 5: Printable Checklist", description: "Tick-off print-at-time-of-publish sheet" },
      ],
    },
    es: {
      title: "ES-CC: Editorial Publish 18-Point Checklist",
      description: "(ES-CC) SEO / formatting / images / CTA / internal-links 18-point pre-flight list",
      steps: [
        { title: "Paso 1: 18-Item Rationale Doc", description: "Per-item why-this-matters explanation" },
        { title: "Paso 2: Card Format Cheat Sheet", description: "18-point visual checklist cards" },
        { title: "Paso 3: Article ID Encoding", description: "Publish sequence ID generator" },
        { title: "Paso 4: FR / DE Team Locale", description: "EU team translated checklist" },
        { title: "Paso 5: Printable Checklist", description: "Tick-off print-at-time-of-publish sheet" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Editorial Publish 18-Point Checklist",
      description: "(HI-सामग्री) SEO / formatting / images / CTA / internal-links 18-point pre-flight list",
      steps: [
        { title: "चरण 1: 18-Item Rationale Doc", description: "Per-item why-this-matters explanation" },
        { title: "चरण 2: Card Format Cheat Sheet", description: "18-point visual checklist cards" },
        { title: "चरण 3: Article ID Encoding", description: "Publish sequence ID generator" },
        { title: "चरण 4: FR / DE Team Locale", description: "EU team translated checklist" },
        { title: "चरण 5: Printable Checklist", description: "Tick-off print-at-time-of-publish sheet" },
      ],
    },
    ar: {
      title: "AR-م: Editorial Publish 18-Point Checklist",
      description: "(AR-م) SEO / formatting / images / CTA / internal-links 18-point pre-flight list",
      steps: [
        { title: "الخطوة 1: 18-Item Rationale Doc", description: "Per-item why-this-matters explanation" },
        { title: "الخطوة 2: Card Format Cheat Sheet", description: "18-point visual checklist cards" },
        { title: "الخطوة 3: Article ID Encoding", description: "Publish sequence ID generator" },
        { title: "الخطوة 4: FR / DE Team Locale", description: "EU team translated checklist" },
        { title: "الخطوة 5: Printable Checklist", description: "Tick-off print-at-time-of-publish sheet" },
      ],
    },
  },
  'pinterest-pin-seo-rank': {
    zh: {
      title: "Pinterest Pin SEO 5万曝光",
      description: "20个Board+关键词Pin标题描述",
      steps: [
        { title: "20条Pin标题", description: "100字符满标题" },
        { title: "Pin描述100词", description: "含关键词长尾" },
        { title: "50张Pin图", description: "2:3 竖版规范" },
        { title: "1000×1500裁切", description: "Pinterest标准" },
        { title: "压缩≤2MB", description: "上传要求" },
      ],
    },
    en: {
      title: "Pinterest Pin SEO for 50K Impressions",
      description: "20 Board + keyword-optimized Pin titles / descriptions for 50K reach",
      steps: [
        { title: "20 Keyword Pin Titles", description: "Full 100-char long Pin titles" },
        { title: "100-Word Pin Descriptions", description: "Long-tail keyword-rich descriptions" },
        { title: "50 Vertical Pin Images", description: "2:3 aspect ratio pin artworks" },
        { title: "1000×1500 Spec Crop", description: "Pinterest 2:3 exact spec" },
        { title: "≤2MB File Size", description: "Pin upload compliance limits" },
      ],
    },
    fr: {
      title: "FR-CC: Pinterest Pin SEO for 50K Impressions",
      description: "(FR-CC) 20 Board + keyword-optimized Pin titles / descriptions for 50K reach",
      steps: [
        { title: "Étape 1: 20 Keyword Pin Titles", description: "Full 100-char long Pin titles" },
        { title: "Étape 2: 100-Word Pin Descriptions", description: "Long-tail keyword-rich descriptions" },
        { title: "Étape 3: 50 Vertical Pin Images", description: "2:3 aspect ratio pin artworks" },
        { title: "Étape 4: 1000×1500 Spec Crop", description: "Pinterest 2:3 exact spec" },
        { title: "Étape 5: ≤2MB File Size", description: "Pin upload compliance limits" },
      ],
    },
    es: {
      title: "ES-CC: Pinterest Pin SEO for 50K Impressions",
      description: "(ES-CC) 20 Board + keyword-optimized Pin titles / descriptions for 50K reach",
      steps: [
        { title: "Paso 1: 20 Keyword Pin Titles", description: "Full 100-char long Pin titles" },
        { title: "Paso 2: 100-Word Pin Descriptions", description: "Long-tail keyword-rich descriptions" },
        { title: "Paso 3: 50 Vertical Pin Images", description: "2:3 aspect ratio pin artworks" },
        { title: "Paso 4: 1000×1500 Spec Crop", description: "Pinterest 2:3 exact spec" },
        { title: "Paso 5: ≤2MB File Size", description: "Pin upload compliance limits" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Pinterest Pin SEO for 50K Impressions",
      description: "(HI-सामग्री) 20 Board + keyword-optimized Pin titles / descriptions for 50K reach",
      steps: [
        { title: "चरण 1: 20 Keyword Pin Titles", description: "Full 100-char long Pin titles" },
        { title: "चरण 2: 100-Word Pin Descriptions", description: "Long-tail keyword-rich descriptions" },
        { title: "चरण 3: 50 Vertical Pin Images", description: "2:3 aspect ratio pin artworks" },
        { title: "चरण 4: 1000×1500 Spec Crop", description: "Pinterest 2:3 exact spec" },
        { title: "चरण 5: ≤2MB File Size", description: "Pin upload compliance limits" },
      ],
    },
    ar: {
      title: "AR-م: Pinterest Pin SEO for 50K Impressions",
      description: "(AR-م) 20 Board + keyword-optimized Pin titles / descriptions for 50K reach",
      steps: [
        { title: "الخطوة 1: 20 Keyword Pin Titles", description: "Full 100-char long Pin titles" },
        { title: "الخطوة 2: 100-Word Pin Descriptions", description: "Long-tail keyword-rich descriptions" },
        { title: "الخطوة 3: 50 Vertical Pin Images", description: "2:3 aspect ratio pin artworks" },
        { title: "الخطوة 4: 1000×1500 Spec Crop", description: "Pinterest 2:3 exact spec" },
        { title: "الخطوة 5: ≤2MB File Size", description: "Pin upload compliance limits" },
      ],
    },
  },
  'ai-voiceover-podcast-auto': {
    zh: {
      title: "AI配音+自动剪辑播客",
      description: "ElevenLabs/Descript脚本一键生成",
      steps: [
        { title: "10集英文脚本", description: "每集2000字播客稿" },
        { title: "西语/法语脚本", description: "双语频道版本" },
        { title: "封面3000×3000", description: "Podcast封面设计" },
        { title: "每集方形卡片", description: "社交平台分享图" },
        { title: "Shownotes PDF", description: "10集Shownotes本" },
      ],
    },
    en: {
      title: "AI Voice-Over Automated Podcast",
      description: "ElevenLabs / Descripts fully automated podcast batch production",
      steps: [
        { title: "10 Episode EN Manuscripts", description: "~2000 word per episode EN scripts" },
        { title: "ES / FR Manuscript Pack", description: "Bilingual channel companion scripts" },
        { title: "3000×3000 Cover Art", description: "Podcast cover artwork" },
        { title: "Square Social Cards", description: "Square per-episode social graphics" },
        { title: "Shownotes PDF Book", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    fr: {
      title: "FR-CC: AI Voice-Over Automated Podcast",
      description: "(FR-CC) ElevenLabs / Descripts fully automated podcast batch production",
      steps: [
        { title: "Étape 1: 10 Episode EN Manuscripts", description: "~2000 word per episode EN scripts" },
        { title: "Étape 2: ES / FR Manuscript Pack", description: "Bilingual channel companion scripts" },
        { title: "Étape 3: 3000×3000 Cover Art", description: "Podcast cover artwork" },
        { title: "Étape 4: Square Social Cards", description: "Square per-episode social graphics" },
        { title: "Étape 5: Shownotes PDF Book", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    es: {
      title: "ES-CC: AI Voice-Over Automated Podcast",
      description: "(ES-CC) ElevenLabs / Descripts fully automated podcast batch production",
      steps: [
        { title: "Paso 1: 10 Episode EN Manuscripts", description: "~2000 word per episode EN scripts" },
        { title: "Paso 2: ES / FR Manuscript Pack", description: "Bilingual channel companion scripts" },
        { title: "Paso 3: 3000×3000 Cover Art", description: "Podcast cover artwork" },
        { title: "Paso 4: Square Social Cards", description: "Square per-episode social graphics" },
        { title: "Paso 5: Shownotes PDF Book", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: AI Voice-Over Automated Podcast",
      description: "(HI-सामग्री) ElevenLabs / Descripts fully automated podcast batch production",
      steps: [
        { title: "चरण 1: 10 Episode EN Manuscripts", description: "~2000 word per episode EN scripts" },
        { title: "चरण 2: ES / FR Manuscript Pack", description: "Bilingual channel companion scripts" },
        { title: "चरण 3: 3000×3000 Cover Art", description: "Podcast cover artwork" },
        { title: "चरण 4: Square Social Cards", description: "Square per-episode social graphics" },
        { title: "चरण 5: Shownotes PDF Book", description: "10-episode Shownotes compiled PDF" },
      ],
    },
    ar: {
      title: "AR-م: AI Voice-Over Automated Podcast",
      description: "(AR-م) ElevenLabs / Descripts fully automated podcast batch production",
      steps: [
        { title: "الخطوة 1: 10 Episode EN Manuscripts", description: "~2000 word per episode EN scripts" },
        { title: "الخطوة 2: ES / FR Manuscript Pack", description: "Bilingual channel companion scripts" },
        { title: "الخطوة 3: 3000×3000 Cover Art", description: "Podcast cover artwork" },
        { title: "الخطوة 4: Square Social Cards", description: "Square per-episode social graphics" },
        { title: "الخطوة 5: Shownotes PDF Book", description: "10-episode Shownotes compiled PDF" },
      ],
    },
  },
  'freelance-content-mrr-offer': {
    zh: {
      title: "内容创作者MRR产品打包",
      description: "Master Resell Rights+Done For You",
      steps: [
        { title: "英文产品说明", description: "MRR权限+使用范围" },
        { title: "价格梯度", description: "个人/团队/企业3档" },
        { title: "销售页", description: "Hero/定价/FAQ 3屏" },
        { title: "销售页文案", description: "长页销售文案" },
        { title: "产品手册PDF", description: "交付内容+MRR条款" },
      ],
    },
    en: {
      title: "Creator MRR Digital Product Pack",
      description: "Master Resell Rights + DFY done-for-you product bundle",
      steps: [
        { title: "English MRR Terms", description: "MRR license + use scope terms" },
        { title: "3-Tier Pricing Model", description: "Personal / team / enterprise tiers" },
        { title: "3-Screen Sales Page", description: "Hero / pricing / FAQ sales page" },
        { title: "Long-Form Sales Copy", description: "3 versions long-form sales letter" },
        { title: "Product Playbook PDF", description: "Deliverables + MRR terms handbook" },
      ],
    },
    fr: {
      title: "FR-CC: Creator MRR Digital Product Pack",
      description: "(FR-CC) Master Resell Rights + DFY done-for-you product bundle",
      steps: [
        { title: "Étape 1: English MRR Terms", description: "MRR license + use scope terms" },
        { title: "Étape 2: 3-Tier Pricing Model", description: "Personal / team / enterprise tiers" },
        { title: "Étape 3: 3-Screen Sales Page", description: "Hero / pricing / FAQ sales page" },
        { title: "Étape 4: Long-Form Sales Copy", description: "3 versions long-form sales letter" },
        { title: "Étape 5: Product Playbook PDF", description: "Deliverables + MRR terms handbook" },
      ],
    },
    es: {
      title: "ES-CC: Creator MRR Digital Product Pack",
      description: "(ES-CC) Master Resell Rights + DFY done-for-you product bundle",
      steps: [
        { title: "Paso 1: English MRR Terms", description: "MRR license + use scope terms" },
        { title: "Paso 2: 3-Tier Pricing Model", description: "Personal / team / enterprise tiers" },
        { title: "Paso 3: 3-Screen Sales Page", description: "Hero / pricing / FAQ sales page" },
        { title: "Paso 4: Long-Form Sales Copy", description: "3 versions long-form sales letter" },
        { title: "Paso 5: Product Playbook PDF", description: "Deliverables + MRR terms handbook" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Creator MRR Digital Product Pack",
      description: "(HI-सामग्री) Master Resell Rights + DFY done-for-you product bundle",
      steps: [
        { title: "चरण 1: English MRR Terms", description: "MRR license + use scope terms" },
        { title: "चरण 2: 3-Tier Pricing Model", description: "Personal / team / enterprise tiers" },
        { title: "चरण 3: 3-Screen Sales Page", description: "Hero / pricing / FAQ sales page" },
        { title: "चरण 4: Long-Form Sales Copy", description: "3 versions long-form sales letter" },
        { title: "चरण 5: Product Playbook PDF", description: "Deliverables + MRR terms handbook" },
      ],
    },
    ar: {
      title: "AR-م: Creator MRR Digital Product Pack",
      description: "(AR-م) Master Resell Rights + DFY done-for-you product bundle",
      steps: [
        { title: "الخطوة 1: English MRR Terms", description: "MRR license + use scope terms" },
        { title: "الخطوة 2: 3-Tier Pricing Model", description: "Personal / team / enterprise tiers" },
        { title: "الخطوة 3: 3-Screen Sales Page", description: "Hero / pricing / FAQ sales page" },
        { title: "الخطوة 4: Long-Form Sales Copy", description: "3 versions long-form sales letter" },
        { title: "الخطوة 5: Product Playbook PDF", description: "Deliverables + MRR terms handbook" },
      ],
    },
  },
  'case-study-writing-framework': {
    zh: {
      title: "客户成功案例4段式写模板",
      description: "背景/挑战/方案/结果4步框架",
      steps: [
        { title: "英文4段框架", description: "1500字每篇模板" },
        { title: "客户引言", description: "Pull Quote引言" },
        { title: "数据卡片", description: "关键成果数字图" },
        { title: "Logo拼图", description: "客户Logo墙" },
        { title: "Case PDF下载", description: "可公开下载版" },
      ],
    },
    en: {
      title: "Case Study 4-Stage Writing Framework",
      description: "Situation / Challenge / Solution / Results 4-part client success framework",
      steps: [
        { title: "4-Part EN Template", description: "~1500-word each 4-section template" },
        { title: "Customer Pull Quotes", description: "Endorsement pull-quote copy blocks" },
        { title: "Results Data Cards", description: "KPI / result number graphics" },
        { title: "Client Logo Showcase", description: "Trusted-by logo wall composition" },
        { title: "Public Download PDF", description: "Public-facing case study PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Case Study 4-Stage Writing Framework",
      description: "(FR-CC) Situation / Challenge / Solution / Results 4-part client success framework",
      steps: [
        { title: "Étape 1: 4-Part EN Template", description: "~1500-word each 4-section template" },
        { title: "Étape 2: Customer Pull Quotes", description: "Endorsement pull-quote copy blocks" },
        { title: "Étape 3: Results Data Cards", description: "KPI / result number graphics" },
        { title: "Étape 4: Client Logo Showcase", description: "Trusted-by logo wall composition" },
        { title: "Étape 5: Public Download PDF", description: "Public-facing case study PDF" },
      ],
    },
    es: {
      title: "ES-CC: Case Study 4-Stage Writing Framework",
      description: "(ES-CC) Situation / Challenge / Solution / Results 4-part client success framework",
      steps: [
        { title: "Paso 1: 4-Part EN Template", description: "~1500-word each 4-section template" },
        { title: "Paso 2: Customer Pull Quotes", description: "Endorsement pull-quote copy blocks" },
        { title: "Paso 3: Results Data Cards", description: "KPI / result number graphics" },
        { title: "Paso 4: Client Logo Showcase", description: "Trusted-by logo wall composition" },
        { title: "Paso 5: Public Download PDF", description: "Public-facing case study PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Case Study 4-Stage Writing Framework",
      description: "(HI-सामग्री) Situation / Challenge / Solution / Results 4-part client success framework",
      steps: [
        { title: "चरण 1: 4-Part EN Template", description: "~1500-word each 4-section template" },
        { title: "चरण 2: Customer Pull Quotes", description: "Endorsement pull-quote copy blocks" },
        { title: "चरण 3: Results Data Cards", description: "KPI / result number graphics" },
        { title: "चरण 4: Client Logo Showcase", description: "Trusted-by logo wall composition" },
        { title: "चरण 5: Public Download PDF", description: "Public-facing case study PDF" },
      ],
    },
    ar: {
      title: "AR-م: Case Study 4-Stage Writing Framework",
      description: "(AR-م) Situation / Challenge / Solution / Results 4-part client success framework",
      steps: [
        { title: "الخطوة 1: 4-Part EN Template", description: "~1500-word each 4-section template" },
        { title: "الخطوة 2: Customer Pull Quotes", description: "Endorsement pull-quote copy blocks" },
        { title: "الخطوة 3: Results Data Cards", description: "KPI / result number graphics" },
        { title: "الخطوة 4: Client Logo Showcase", description: "Trusted-by logo wall composition" },
        { title: "الخطوة 5: Public Download PDF", description: "Public-facing case study PDF" },
      ],
    },
  },
  'content-creator-media-kit-2026': {
    zh: {
      title: "博主品牌合作媒体资料包5页",
      description: "数据/受众/平台/价目/案例5页",
      steps: [
        { title: "CPM报价算", description: "CPM/CPE/CPV3档" },
        { title: "5页Canva模板", description: "A4品牌色" },
        { title: "英文自我介绍", description: "About us + 数据说明" },
        { title: "账号数据截图", description: "粉丝/播放马赛克" },
        { title: "资料包PDF", description: "发给品牌方2MB内" },
      ],
    },
    en: {
      title: "Creator 2026 Media Kit (5-Page)",
      description: "Stats / audience / platforms / pricing / past-work 5-page media kit",
      steps: [
        { title: "CPM Rate Calculator", description: "CPM / CPE / CPV 3-tier calculator" },
        { title: "5-Page Canva Layout", description: "A4 branded 5-page deck layout" },
        { title: "Bio + Stats EN Copy", description: "About + data narrative copy" },
        { title: "Account Snapshot Tiles", description: "Follower / play stat screenshots" },
        { title: "Brand-Ready PDF", description: "≤2MB brand-outreach ready kit" },
      ],
    },
    fr: {
      title: "FR-CC: Creator 2026 Media Kit (5-Page)",
      description: "(FR-CC) Stats / audience / platforms / pricing / past-work 5-page media kit",
      steps: [
        { title: "Étape 1: CPM Rate Calculator", description: "CPM / CPE / CPV 3-tier calculator" },
        { title: "Étape 2: 5-Page Canva Layout", description: "A4 branded 5-page deck layout" },
        { title: "Étape 3: Bio + Stats EN Copy", description: "About + data narrative copy" },
        { title: "Étape 4: Account Snapshot Tiles", description: "Follower / play stat screenshots" },
        { title: "Étape 5: Brand-Ready PDF", description: "≤2MB brand-outreach ready kit" },
      ],
    },
    es: {
      title: "ES-CC: Creator 2026 Media Kit (5-Page)",
      description: "(ES-CC) Stats / audience / platforms / pricing / past-work 5-page media kit",
      steps: [
        { title: "Paso 1: CPM Rate Calculator", description: "CPM / CPE / CPV 3-tier calculator" },
        { title: "Paso 2: 5-Page Canva Layout", description: "A4 branded 5-page deck layout" },
        { title: "Paso 3: Bio + Stats EN Copy", description: "About + data narrative copy" },
        { title: "Paso 4: Account Snapshot Tiles", description: "Follower / play stat screenshots" },
        { title: "Paso 5: Brand-Ready PDF", description: "≤2MB brand-outreach ready kit" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Creator 2026 Media Kit (5-Page)",
      description: "(HI-सामग्री) Stats / audience / platforms / pricing / past-work 5-page media kit",
      steps: [
        { title: "चरण 1: CPM Rate Calculator", description: "CPM / CPE / CPV 3-tier calculator" },
        { title: "चरण 2: 5-Page Canva Layout", description: "A4 branded 5-page deck layout" },
        { title: "चरण 3: Bio + Stats EN Copy", description: "About + data narrative copy" },
        { title: "चरण 4: Account Snapshot Tiles", description: "Follower / play stat screenshots" },
        { title: "चरण 5: Brand-Ready PDF", description: "≤2MB brand-outreach ready kit" },
      ],
    },
    ar: {
      title: "AR-م: Creator 2026 Media Kit (5-Page)",
      description: "(AR-م) Stats / audience / platforms / pricing / past-work 5-page media kit",
      steps: [
        { title: "الخطوة 1: CPM Rate Calculator", description: "CPM / CPE / CPV 3-tier calculator" },
        { title: "الخطوة 2: 5-Page Canva Layout", description: "A4 branded 5-page deck layout" },
        { title: "الخطوة 3: Bio + Stats EN Copy", description: "About + data narrative copy" },
        { title: "الخطوة 4: Account Snapshot Tiles", description: "Follower / play stat screenshots" },
        { title: "الخطوة 5: Brand-Ready PDF", description: "≤2MB brand-outreach ready kit" },
      ],
    },
  },
  'cooking-recipe-content-matrix': {
    zh: {
      title: "美食食谱内容4端矩阵",
      description: "短视频+博客+Pin+Newsletter 4端同步",
      steps: [
        { title: "英文食谱文案", description: "食材/步骤/营养说明" },
        { title: "食谱卡片", description: "IG/Pinterest食谱图" },
        { title: "步骤拼图", description: "步骤1-9拼图长图" },
        { title: "美食抠图", description: "菜品纯净背景" },
        { title: "食谱PDF下载", description: "Newsletter用户免费" },
      ],
    },
    en: {
      title: "Recipe Content 4-Endpoint Matrix",
      description: "Short video → blog → Pin → Newsletter recipe syndication workflow",
      steps: [
        { title: "English Recipe Write-up", description: "Ingredients / method / nutrition copy" },
        { title: "Recipe Graphic Cards", description: "IG / Pinterest recipe visual cards" },
        { title: "Step-by-Step Collage", description: "9-step visual collage longform art" },
        { title: "Food Plate Cutouts", description: "Transparent PNG dish cutouts" },
        { title: "Reader Recipe PDF", description: "Newsletter subscriber free recipe PDF" },
      ],
    },
    fr: {
      title: "FR-CC: Recipe Content 4-Endpoint Matrix",
      description: "(FR-CC) Short video → blog → Pin → Newsletter recipe syndication workflow",
      steps: [
        { title: "Étape 1: English Recipe Write-up", description: "Ingredients / method / nutrition copy" },
        { title: "Étape 2: Recipe Graphic Cards", description: "IG / Pinterest recipe visual cards" },
        { title: "Étape 3: Step-by-Step Collage", description: "9-step visual collage longform art" },
        { title: "Étape 4: Food Plate Cutouts", description: "Transparent PNG dish cutouts" },
        { title: "Étape 5: Reader Recipe PDF", description: "Newsletter subscriber free recipe PDF" },
      ],
    },
    es: {
      title: "ES-CC: Recipe Content 4-Endpoint Matrix",
      description: "(ES-CC) Short video → blog → Pin → Newsletter recipe syndication workflow",
      steps: [
        { title: "Paso 1: English Recipe Write-up", description: "Ingredients / method / nutrition copy" },
        { title: "Paso 2: Recipe Graphic Cards", description: "IG / Pinterest recipe visual cards" },
        { title: "Paso 3: Step-by-Step Collage", description: "9-step visual collage longform art" },
        { title: "Paso 4: Food Plate Cutouts", description: "Transparent PNG dish cutouts" },
        { title: "Paso 5: Reader Recipe PDF", description: "Newsletter subscriber free recipe PDF" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Recipe Content 4-Endpoint Matrix",
      description: "(HI-सामग्री) Short video → blog → Pin → Newsletter recipe syndication workflow",
      steps: [
        { title: "चरण 1: English Recipe Write-up", description: "Ingredients / method / nutrition copy" },
        { title: "चरण 2: Recipe Graphic Cards", description: "IG / Pinterest recipe visual cards" },
        { title: "चरण 3: Step-by-Step Collage", description: "9-step visual collage longform art" },
        { title: "चरण 4: Food Plate Cutouts", description: "Transparent PNG dish cutouts" },
        { title: "चरण 5: Reader Recipe PDF", description: "Newsletter subscriber free recipe PDF" },
      ],
    },
    ar: {
      title: "AR-م: Recipe Content 4-Endpoint Matrix",
      description: "(AR-م) Short video → blog → Pin → Newsletter recipe syndication workflow",
      steps: [
        { title: "الخطوة 1: English Recipe Write-up", description: "Ingredients / method / nutrition copy" },
        { title: "الخطوة 2: Recipe Graphic Cards", description: "IG / Pinterest recipe visual cards" },
        { title: "الخطوة 3: Step-by-Step Collage", description: "9-step visual collage longform art" },
        { title: "الخطوة 4: Food Plate Cutouts", description: "Transparent PNG dish cutouts" },
        { title: "الخطوة 5: Reader Recipe PDF", description: "Newsletter subscriber free recipe PDF" },
      ],
    },
  },
  'creator-sales-funnel-leadmagnet': {
    zh: {
      title: "创作者销售漏斗3级Lead Magnet",
      description: "免费→7$→97$三级产品",
      steps: [
        { title: "Lead Magnet封面", description: "免费Lead Magnet封面" },
        { title: "免费报告", description: "20页PDF英文报告" },
        { title: "英文销售页", description: "长页销售文案3版" },
        { title: "3档定价", description: "免费/7/97三档" },
        { title: "PDF全套", description: "报告+手册+销售页文案" },
      ],
    },
    en: {
      title: "Creator 3-Tier Sales Funnel + Lead Magnet",
      description: "Free → $7 → $97 tiered creator sales funnel + lead magnet",
      steps: [
        { title: "Lead Magnet Cover Art", description: "Free lead magnet cover design" },
        { title: "20-Page EN Free Report", description: "20-page English PDF report" },
        { title: "3 Versions Sales Page Copy", description: "3 long-form sales page variants" },
        { title: "3-Tier Pricing Setup", description: "Free / $7 / $97 tiered pricing build" },
        { title: "Funnel Assets PDF", description: "Report + handbook + sales copy bundle" },
      ],
    },
    fr: {
      title: "FR-CC: Creator 3-Tier Sales Funnel + Lead Magnet",
      description: "(FR-CC) Free → $7 → $97 tiered creator sales funnel + lead magnet",
      steps: [
        { title: "Étape 1: Lead Magnet Cover Art", description: "Free lead magnet cover design" },
        { title: "Étape 2: 20-Page EN Free Report", description: "20-page English PDF report" },
        { title: "Étape 3: 3 Versions Sales Page Copy", description: "3 long-form sales page variants" },
        { title: "Étape 4: 3-Tier Pricing Setup", description: "Free / $7 / $97 tiered pricing build" },
        { title: "Étape 5: Funnel Assets PDF", description: "Report + handbook + sales copy bundle" },
      ],
    },
    es: {
      title: "ES-CC: Creator 3-Tier Sales Funnel + Lead Magnet",
      description: "(ES-CC) Free → $7 → $97 tiered creator sales funnel + lead magnet",
      steps: [
        { title: "Paso 1: Lead Magnet Cover Art", description: "Free lead magnet cover design" },
        { title: "Paso 2: 20-Page EN Free Report", description: "20-page English PDF report" },
        { title: "Paso 3: 3 Versions Sales Page Copy", description: "3 long-form sales page variants" },
        { title: "Paso 4: 3-Tier Pricing Setup", description: "Free / $7 / $97 tiered pricing build" },
        { title: "Paso 5: Funnel Assets PDF", description: "Report + handbook + sales copy bundle" },
      ],
    },
    hi: {
      title: "HI-सामग्री: Creator 3-Tier Sales Funnel + Lead Magnet",
      description: "(HI-सामग्री) Free → $7 → $97 tiered creator sales funnel + lead magnet",
      steps: [
        { title: "चरण 1: Lead Magnet Cover Art", description: "Free lead magnet cover design" },
        { title: "चरण 2: 20-Page EN Free Report", description: "20-page English PDF report" },
        { title: "चरण 3: 3 Versions Sales Page Copy", description: "3 long-form sales page variants" },
        { title: "चरण 4: 3-Tier Pricing Setup", description: "Free / $7 / $97 tiered pricing build" },
        { title: "चरण 5: Funnel Assets PDF", description: "Report + handbook + sales copy bundle" },
      ],
    },
    ar: {
      title: "AR-م: Creator 3-Tier Sales Funnel + Lead Magnet",
      description: "(AR-م) Free → $7 → $97 tiered creator sales funnel + lead magnet",
      steps: [
        { title: "الخطوة 1: Lead Magnet Cover Art", description: "Free lead magnet cover design" },
        { title: "الخطوة 2: 20-Page EN Free Report", description: "20-page English PDF report" },
        { title: "الخطوة 3: 3 Versions Sales Page Copy", description: "3 long-form sales page variants" },
        { title: "الخطوة 4: 3-Tier Pricing Setup", description: "Free / $7 / $97 tiered pricing build" },
        { title: "الخطوة 5: Funnel Assets PDF", description: "Report + handbook + sales copy bundle" },
      ],
    },
  },
  'social-media-chat-content': {
    zh: {
      title: '社媒聊天截图创作',
      description: '生成聊天截图、制作表情包、压缩图片、生成分享二维码，一站式搞定社媒内容创作',
      steps: [
        { title: '生成聊天截图', description: '制作逼真的微信风格聊天截图，自定义头像昵称消息' },
        { title: '制作表情包', description: '上传图片添加上下文字，生成趣味表情包' },
        { title: '压缩图片', description: '无损压缩截图和表情包体积，方便上传社交平台' },
        { title: '生成分享二维码', description: '将内容链接生成二维码，便于扫码传播' },
      ],
    },
    en: {
      title: 'Social Media Chat Content Creation',
      description: 'Generate chat screenshots, make memes, compress images, and create sharing QR codes — all your social media content creation in one place',
      steps: [
        { title: 'Generate Chat Screenshots', description: 'Create realistic WeChat-style chat screenshots with custom avatars, nicknames, and messages' },
        { title: 'Create Memes', description: 'Upload images and add text to generate fun memes' },
        { title: 'Compress Images', description: 'Losslessly compress screenshots and memes for easy upload to social platforms' },
        { title: 'Generate Sharing QR Codes', description: 'Create QR codes from content links for easy scanning and sharing' },
      ],
    },
    fr: {
      title: 'Création de contenu de chat pour réseaux sociaux',
      description: 'Générez des captures d\'écran de chat, créez des mèmes, compressez des images et des QR codes de partage — tout votre contenu pour les réseaux sociaux au même endroit',
      steps: [
        { title: 'Générer des captures de chat', description: 'Créez des captures d\'écran de chat de style WeChat réalistes avec avatars, surnoms et messages personnalisés' },
        { title: 'Créer des mèmes', description: 'Téléchargez des images et ajoutez du texte pour générer des mèmes amusants' },
        { title: 'Compresser les images', description: 'Compressez sans perte les captures d\'écran et les mèmes pour un téléversement facile sur les plateformes sociales' },
        { title: 'Générer des QR codes de partage', description: 'Créez des QR codes à partir de liens de contenu pour un partage facile par scan' },
      ],
    },
    es: {
      title: 'Creación de contenido de chat para redes sociales',
      description: 'Genera capturas de pantalla de chat, crea memes, comprime imágenes y genera códigos QR para compartir — todo tu contenido para redes sociales en un solo lugar',
      steps: [
        { title: 'Generar capturas de chat', description: 'Crea capturas de pantalla de chat estilo WeChat realistas con avatares, apodos y mensajes personalizados' },
        { title: 'Crear memes', description: 'Sube imágenes y añade texto para generar memes divertidos' },
        { title: 'Comprimir imágenes', description: 'Comprime sin pérdida capturas de pantalla y memes para subirlos fácilmente a las plataformas sociales' },
        { title: 'Generar códigos QR de compartir', description: 'Crea códigos QR a partir de enlaces de contenido para compartirlos fácilmente al escanear' },
      ],
    },
    hi: {
      title: 'सोशल मीडिया चैट सामग्री निर्माण',
      description: 'चैट स्क्रीनशॉट बनाएं, मीम्स तैयार करें, छवियों को संपीड़ित करें और साझा करने वाले QR कोड जनरेट करें — सभी सोशल मीडिया सामग्री निर्माण एक ही जगह पर',
      steps: [
        { title: 'चैट स्क्रीनशॉट जनरेट करें', description: 'कस्टम अवतार, उपनाम और संदेशों के साथ यथार्थवादी वीचैट-शैली के चैट स्क्रीनशॉट बनाएं' },
        { title: 'मीम्स बनाएं', description: 'छवियां अपलोड करें और मजेदार मीम्स बनाने के लिए टेक्स्ट जोड़ें' },
        { title: 'छवियां संपीड़ित करें', description: 'सोशल प्लेटफॉर्म पर आसानी से अपलोड करने के लिए स्क्रीनशॉट और मीम्स को बिना क्षति के संपीड़ित करें' },
        { title: 'साझा करने वाले QR कोड जनरेट करें', description: 'आसान स्कैनिंग और साझा करने के लिए सामग्री लिंक से QR कोड बनाएं' },
      ],
    },
    ar: {
      title: 'إنشاء محتوى دردشة لوسائل التواصل الاجتماعي',
      description: 'أنشئ لقطات شاشة للمحادثات، وصنع الميمات، وضغط الصور، وتوليد رموز QR للمشاركة — كل إنشاء محتوى وسائل التواصل الاجتماعي في مكان واحد',
      steps: [
        { title: 'إنشاء لقطات شاشة للمحادثة', description: 'أنشئ لقطات شاشة لمحادثات بأسلوب WeChat واقعية مع صور رمزية وألقاب ورسائل مخصصة' },
        { title: 'إنشاء ميمات', description: 'ارفع الصور وأضف النصوص لإنشاء ميمات ممتعة' },
        { title: 'ضغط الصور', description: 'اضغط لقطات الشاشة والميمات بدون فقدان للجودة لسهولة رفعها على منصات التواصل الاجتماعي' },
        { title: 'توليد رموز QR للمشاركة', description: 'أنشئ رموز QR من روابط المحتوى لتسهيل مسحها ومشاركتها' },
      ],
    },
  },
  'meme-creation-flow': {
    zh: {
      title: '表情包制作流程',
      description: '从图片到表情包到 emoji 混搭，快速产出趣味内容',
      steps: [
        { title: '制作图片表情包', description: '上传图片添加文字，生成经典表情包格式' },
        { title: '压缩表情包', description: '压缩表情包图片体积，适配各平台大小限制' },
        { title: 'Emoji 混搭', description: '将多个 emoji 混合生成新表情，增加趣味性' },
      ],
    },
    en: {
      title: 'Meme Creation Flow',
      description: 'From images to memes to emoji mashups — quickly produce fun content',
      steps: [
        { title: 'Create Image Memes', description: 'Upload images and add text to generate classic meme formats' },
        { title: 'Compress Memes', description: 'Compress meme image sizes to fit platform size limits' },
        { title: 'Emoji Mashup', description: 'Mix multiple emojis to generate new expressions and add fun' },
      ],
    },
    fr: {
      title: 'Flux de création de mèmes',
      description: 'Des images aux mèmes en passant par les mashups d\'emojis — produisez rapidement du contenu amusant',
      steps: [
        { title: 'Créer des mèmes à partir d\'images', description: 'Téléchargez des images et ajoutez du texte pour générer des mèmes au format classique' },
        { title: 'Compresser les mèmes', description: 'Compressez la taille des images de mèmes pour respecter les limites de taille des plateformes' },
        { title: 'Mashup d\'emojis', description: 'Mélangez plusieurs emojis pour générer de nouvelles expressions et ajouter du fun' },
      ],
    },
    es: {
      title: 'Flujo de creación de memes',
      description: 'De imágenes a memes y combinaciones de emojis — produce contenido divertido rápidamente',
      steps: [
        { title: 'Crear memes de imágenes', description: 'Sube imágenes y añade texto para generar memes en formato clásico' },
        { title: 'Comprimir memes', description: 'Comprime el tamaño de las imágenes de los memes para ajustarse a los límites de tamaño de las plataformas' },
        { title: 'Combinación de emojis', description: 'Combina varios emojis para generar nuevas expresiones y añadir diversión' },
      ],
    },
    hi: {
      title: 'मीम निर्माण प्रवाह',
      description: 'छवियों से मीम्स तक, इमोजी मैशअप तक — जल्दी से मजेदार सामग्री तैयार करें',
      steps: [
        { title: 'छवि मीम्स बनाएं', description: 'क्लासिक मीम प्रारूप में छवियां अपलोड करें और टेक्स्ट जोड़ें' },
        { title: 'मीम्स संपीड़ित करें', description: 'प्लेटफॉर्म आकार सीमा के अनुसार मीम छवि आकार संपीड़ित करें' },
        { title: 'इमोजी मैशअप', description: 'मज़ा बढ़ाने के लिए कई इमोजी को मिलाकर नए भाव उत्पन्न करें' },
      ],
    },
    ar: {
      title: 'تدفق إنشاء الميمات',
      description: 'من الصور إلى الميمات إلى مزج الإيموجي — أنتج محتوى ممتعًا بسرعة',
      steps: [
        { title: 'إنشاء ميمات من الصور', description: 'ارفع الصور وأضف النصوص لإنشاء ميمات بتنسيق كلاسيكي' },
        { title: 'ضغط الميمات', description: 'اضغط حجم صور الميمات لتناسب حدود حجم المنصات' },
        { title: 'مزج الإيموجي', description: 'امزج عدة إيموجي لإنشاء تعبيرات جديدة وإضافة المرح' },
      ],
    },
  },
  'daily-fortune-telling': {
    zh: {
      title: '每日运势占卜',
      description: '塔罗牌抽牌、抽签算命、抽福签，每天测运势三件套',
      steps: [
        { title: '抽塔罗牌', description: '每日抽一张大阿卡纳牌，获取正逆位解读' },
        { title: '抽签算命', description: '抽一支签，查看今日运势箴言' },
        { title: '抽福签', description: '抽取福签，获取每日好运祝福' },
      ],
    },
    en: {
      title: 'Daily Fortune Telling',
      description: 'Tarot draw, fortune sticks, and blessing slips — your three-piece daily fortune toolkit',
      steps: [
        { title: 'Draw Tarot Cards', description: 'Draw a Major Arcana card daily for upright or reversed interpretation' },
        { title: 'Draw Fortune Sticks', description: 'Draw a fortune stick to read today\'s fortune maxim' },
        { title: 'Draw Blessing Slips', description: 'Draw a blessing slip for daily good luck wishes' },
      ],
    },
    fr: {
      title: 'Divination quotidienne',
      description: 'Tirage de tarot, bâtons de fortune et billets de bénédiction — votre trio d\'outils de fortune quotidien',
      steps: [
        { title: 'Tirer les cartes de tarot', description: 'Tirez chaque jour une carte d\'Arcane Majeur pour une interprétation à l\'endroit ou à l\'envers' },
        { title: 'Tirer un bâton de fortune', description: 'Tirez un bâton de fortune pour lire la maxime du jour' },
        { title: 'Tirer un billet de bénédiction', description: 'Tirez un billet de bénédiction pour des vœux de chance quotidiens' },
      ],
    },
    es: {
      title: 'Adivinación de fortuna diaria',
      description: 'Tirada de tarot, palillos de la fortuna y papeles de bendición — tu trío de herramientas de fortuna diaria',
      steps: [
        { title: 'Sacar cartas del tarot', description: 'Saca cada día una carta del Arcano Mayor para una interpretación al derecho o al revés' },
        { title: 'Sacar palillo de la fortuna', description: 'Saca un palillo de la fortuna para leer la máxima de tu suerte del día' },
        { title: 'Sacar papel de bendición', description: 'Saca un papel de bendición para deseos de buena suerte diarios' },
      ],
    },
    hi: {
      title: 'दैनिक भाग्य बताना',
      description: 'टैरो कार्ड निकालना, भाग्य छड़ी, और आशीर्वाद पर्ची — आपका दैनिक भाग्य टूलकिट तिकड़ी',
      steps: [
        { title: 'टैरो कार्ड निकालें', description: 'उलटे या सीधे अर्थ के लिए रोज़ एक मेजर आर्केना कार्ड निकालें' },
        { title: 'भाग्य छड़ी निकालें', description: 'आज के भाग्य वचन को पढ़ने के लिए एक भाग्य छड़ी निकालें' },
        { title: 'आशीर्वाद पर्ची निकालें', description: 'दैनिक सौभाग्य शुभकामनाओं के लिए एक आशीर्वाद पर्ची निकालें' },
      ],
    },
    ar: {
      title: 'عرافة الحظ اليومي',
      description: 'سحب التاروت وعصي الحظ وأوراق البركة — ثلاثيتك اليومية لأدوات الحظ',
      steps: [
        { title: 'سحب بطاقات التاروت', description: 'اسحب بطاقة من الأركانا الكبرى يوميًا للحصول على تفسير بالوضعية الصحيحة أو المقلوبة' },
        { title: 'سحب عصا الحظ', description: 'اسحب عصا الحظ لقراءة حكمة حظك اليوم' },
        { title: 'سحب أوراق البركة', description: 'اسحب ورقة بركة للحصول على أمنيات الحظ السعيد اليومي' },
      ],
    },
  },
  'id-photo-self-service': {
    zh: {
      title: '证件照自助制作',
      description: '换背景色、压缩体积、转PDF打印，在家自助制作证件照',
      steps: [
        { title: '替换背景色', description: '上传照片，一键替换蓝底/红底/白底' },
        { title: '压缩照片', description: '压缩证件照体积，满足网上报名大小要求' },
        { title: '转PDF打印', description: '将证件照转为PDF格式，方便打印店冲印' },
      ],
    },
    en: {
      title: 'ID Photo Self-Service',
      description: 'Change background color, compress file size, and convert to PDF for printing — make ID photos at home',
      steps: [
        { title: 'Replace Background Color', description: 'Upload a photo and one-click replace blue/red/white background' },
        { title: 'Compress Photo', description: 'Compress ID photo size to meet online registration size requirements' },
        { title: 'Convert to PDF for Printing', description: 'Convert ID photos to PDF format for easy photo shop printing' },
      ],
    },
    fr: {
      title: 'Création de photos d\'identité en libre-service',
      description: 'Changez la couleur de fond, compressez la taille du fichier et convertissez en PDF pour l\'impression — créez vos photos d\'identité à la maison',
      steps: [
        { title: 'Remplacer la couleur de fond', description: 'Téléchargez une photo et remplacez en un clic le fond bleu/rouge/blanc' },
        { title: 'Compresser la photo', description: 'Compressez la taille de la photo d\'identité pour répondre aux exigences de taille des inscriptions en ligne' },
        { title: 'Convertir en PDF pour impression', description: 'Convertissez les photos d\'identité en format PDF pour une impression facile en magasin' },
      ],
    },
    es: {
      title: 'Autoservicio de fotos de identificación',
      description: 'Cambia el color de fondo, comprime el tamaño del archivo y convierte a PDF para imprimir — haz fotos de identificación en casa',
      steps: [
        { title: 'Reemplazar el color de fondo', description: 'Sube una foto y reemplaza con un clic el fondo azul/rojo/blanco' },
        { title: 'Comprimir foto', description: 'Comprime el tamaño de la foto de identificación para cumplir con los requisitos de tamaño de inscripción en línea' },
        { title: 'Convertir a PDF para imprimir', description: 'Convierte las fotos de identificación a formato PDF para imprimir fácilmente en una tienda' },
      ],
    },
    hi: {
      title: 'पहचान फोटो स्व-सेवा',
      description: 'बैकग्राउंड रंग बदलें, फ़ाइल आकार संपीड़ित करें और प्रिंटिंग के लिए PDF में बदलें — घर पर पहचान फोटो बनाएं',
      steps: [
        { title: 'बैकग्राउंड रंग बदलें', description: 'एक फोटो अपलोड करें और एक क्लिक में नीले/लाल/सफेद बैकग्राउंड को बदलें' },
        { title: 'फोटो संपीड़ित करें', description: 'ऑनलाइन पंजीकरण आकार आवश्यकताओं को पूरा करने के लिए पहचान फोटो आकार संपीड़ित करें' },
        { title: 'प्रिंटिंग के लिए PDF में बदलें', description: 'आसान फोटो शॉप प्रिंटिंग के लिए पहचान फोटो को PDF प्रारूप में बदलें' },
      ],
    },
    ar: {
      title: 'خدمة ذاتية لصور الهوية',
      description: 'غيّر لون الخلفية، وضغط حجم الملف، وحوّل إلى PDF للطباعة — أنشئ صور الهوية في المنزل',
      steps: [
        { title: 'استبدال لون الخلفية', description: 'ارفع صورة واستبدل بنقرة واحدة الخلفية الزرقاء/الحمراء/البيضاء' },
        { title: 'ضغط الصورة', description: 'اضغط حجم صورة الهوية لتلبية متطلبات حجم التسجيل عبر الإنترنت' },
        { title: 'التحويل إلى PDF للطباعة', description: 'حوّل صور الهوية إلى تنسيق PDF لسهولة طباعتها في متجر الصور' },
      ],
    },
  },
  'fps-game-setup': {
    zh: {
      title: 'FPS游戏配置',
      description: '灵敏度转换、选角色、训练计时，FPS玩家上手配置三件套',
      steps: [
        { title: '转换灵敏度', description: '在不同FPS游戏间转换灵敏度，保持手感一致' },
        { title: '选角色/武器', description: '用转盘随机选择角色或武器，增加游戏乐趣' },
        { title: '训练计时', description: '设置专注训练计时器，科学安排练枪时间' },
      ],
    },
    en: {
      title: 'FPS Game Setup',
      description: 'Sensitivity conversion, character selection, and training timer — three-piece setup kit for FPS players',
      steps: [
        { title: 'Convert Sensitivity', description: 'Convert sensitivity between different FPS games to maintain consistent feel' },
        { title: 'Pick Character/Weapon', description: 'Use a spinning wheel to randomly pick characters or weapons and add fun to your game' },
        { title: 'Training Timer', description: 'Set a focused training timer to scientifically plan your aim practice time' },
      ],
    },
    fr: {
      title: 'Configuration de jeu FPS',
      description: 'Conversion de sensibilité, sélection de personnage et minuteur d\'entraînement — trio d\'outils de configuration pour les joueurs FPS',
      steps: [
        { title: 'Convertir la sensibilité', description: 'Convertissez la sensibilité entre différents jeux FPS pour garder une sensation cohérente' },
        { title: 'Choisir personnage/arme', description: 'Utilisez une roue pour choisir aléatoirement un personnage ou une arme et ajouter du fun au jeu' },
        { title: 'Minuteur d\'entraînement', description: 'Réglez un minuteur d\'entraînement concentré pour planifier scientifiquement votre temps de pratique de visée' },
      ],
    },
    es: {
      title: 'Configuración de juegos FPS',
      description: 'Conversión de sensibilidad, selección de personajes y temporizador de entrenamiento — trío de configuración para jugadores de FPS',
      steps: [
        { title: 'Convertir sensibilidad', description: 'Convierte la sensibilidad entre diferentes juegos FPS para mantener una sensación consistente' },
        { title: 'Elegir personaje/arma', description: 'Usa una ruleta para elegir al azar personajes o armas y añadir diversión al juego' },
        { title: 'Temporizador de entrenamiento', description: 'Configura un temporizador de entrenamiento enfocado para planificar científicamente tu tiempo de práctica de puntería' },
      ],
    },
    hi: {
      title: 'FPS गेम सेटअप',
      description: 'संवेदनशीलता रूपांतरण, चरित्र चयन, और प्रशिक्षण टाइमर — FPS खिलाड़ियों के लिए तीन-टुकड़ा सेटअप किट',
      steps: [
        { title: 'संवेदनशीलता रूपांतरित करें', description: 'सुसंगत अनुभव बनाए रखने के लिए विभिन्न FPS गेम के बीच संवेदनशीलता रूपांतरित करें' },
        { title: 'चरित्र/हथियार चुनें', description: 'गेम में मज़ा बढ़ाने के लिए स्पिनिंग व्हील का उपयोग करके बेतरतीब ढंग से चरित्र या हथियार चुनें' },
        { title: 'प्रशिक्षण टाइमर', description: 'अपने निशानेबाजी अभ्यास समय की वैज्ञानिक रूप से योजना के लिए एक केंद्रित प्रशिक्षण टाइमर सेट करें' },
      ],
    },
    ar: {
      title: 'إعداد ألعاب FPS',
      description: 'تحويل الحساسية، اختيار الشخصية، ومؤقت التدريب — ثلاثية أدوات الإعداد للاعبي FPS',
      steps: [
        { title: 'تحويل الحساسية', description: 'حوّل الحساسية بين ألعاب FPS المختلفة للحفاظ على إحساس متناسق' },
        { title: 'اختيار شخصية/سلاح', description: 'استخدم عجلة دوارة لاختيار شخصيات أو أسلحة عشوائيًا وإضافة المرح للعبتك' },
        { title: 'مؤقت التدريب', description: 'اضبط مؤقت تدريب مركّز لتنظيم وقت تدريب التصويب علميًا' },
      ],
    },
  },
  'romantic-writing-suite': {
    zh: {
      title: '浪漫文案创作',
      description: '情书、夸夸语、藏头诗、情绪色板，浪漫内容创作四件套',
      steps: [
        { title: '生成情书', description: '输入关键词，自动生成浪漫情书' },
        { title: '生成夸夸语', description: '生成彩虹屁般的夸赞文案，温暖人心' },
        { title: '作藏头诗', description: '输入名字，生成专属藏头诗' },
        { title: '配色情绪板', description: '根据情绪生成配色方案，搭配浪漫文案' },
      ],
    },
    en: {
      title: 'Romantic Writing Suite',
      description: 'Love letters, compliments, acrostic poems, and mood color palettes — four-piece romantic content creation kit',
      steps: [
        { title: 'Generate Love Letters', description: 'Enter keywords to automatically generate romantic love letters' },
        { title: 'Generate Compliments', description: 'Generate praise copy that warms hearts like rainbow flattery' },
        { title: 'Compose Acrostic Poems', description: 'Enter a name to generate a personalized acrostic poem' },
        { title: 'Mood Color Palette', description: 'Generate color schemes based on mood to pair with romantic copy' },
      ],
    },
    fr: {
      title: 'Suite d\'écriture romantique',
      description: 'Lettres d\'amour, compliments, poèmes acrostiches et palettes de couleurs d\'humeur — kit de création de contenu romantique en quatre pièces',
      steps: [
        { title: 'Générer des lettres d\'amour', description: 'Saisissez des mots-clés pour générer automatiquement des lettres d\'amour romantiques' },
        { title: 'Générer des compliments', description: 'Générez des textes de louanges qui réchauffent les cœurs comme des flatteries arc-en-ciel' },
        { title: 'Composer des poèmes acrostiches', description: 'Saisissez un nom pour générer un poème acrostiche personnalisé' },
        { title: 'Palette de couleurs d\'humeur', description: 'Générez des palettes de couleurs selon l\'humeur pour les assortir à des textes romantiques' },
      ],
    },
    es: {
      title: 'Suite de escritura romántica',
      description: 'Cartas de amor, halagos, poemas acrósticos y paletas de colores de humor — kit de creación de contenido romántico en cuatro piezas',
      steps: [
        { title: 'Generar cartas de amor', description: 'Introduce palabras clave para generar automáticamente cartas de amor románticas' },
        { title: 'Generar halagos', description: 'Genera textos de elogio que calientan el corazón como adulaciones arcoíris' },
        { title: 'Componer poemas acrósticos', description: 'Introduce un nombre para generar un poema acróstico personalizado' },
        { title: 'Paleta de colores de humor', description: 'Genera esquemas de colores según el humor para combinar con textos románticos' },
      ],
    },
    hi: {
      title: 'रोमांटिक लेखन सूट',
      description: 'प्रेम पत्र, प्रशंसा, अक्रोस्टिक कविताएं, और मूड रंग पैलेट — चार-टुकड़ा रोमांटिक सामग्री निर्माण किट',
      steps: [
        { title: 'प्रेम पत्र जनरेट करें', description: 'रोमांटिक प्रेम पत्र स्वचालित रूप से जनरेट करने के लिए कीवर्ड दर्ज करें' },
        { title: 'प्रशंसा जनरेट करें', description: 'इंद्रधनुष चापलस्य की तरह दिलों को गर्म करने वाले प्रशंसा टेक्स्ट जनरेट करें' },
        { title: 'अक्रोस्टिक कविता बनाएं', description: 'व्यक्तिगत अक्रोस्टिक कविता जनरेट करने के लिए एक नाम दर्ज करें' },
        { title: 'मूड रंग पैलेट', description: 'रोमांटिक टेक्स्ट के साथ जोड़ने के लिए मूड के आधार पर रंग योजनाएं जनरेट करें' },
      ],
    },
    ar: {
      title: 'مجموعة الكتابة الرومانسية',
      description: 'رسائل حب، مجاملات، قصائد أكروستيك، ولوحات ألوان مزاج — أداة من أربع قطع لإنشاء المحتوى الرومانسي',
      steps: [
        { title: 'توليد رسائل الحب', description: 'أدخل الكلمات الرئيسية لتوليد رسائل حب رومانسية تلقائيًا' },
        { title: 'توليد المجاملات', description: 'أنشئ نصوص مديح تُدفيء القلوب كالمجاملة القوس قزحية' },
        { title: 'تأليف قصائد أكروستيك', description: 'أدخل اسمًا لتوليد قصيدة أكروستيك مخصصة' },
        { title: 'لوحة ألوان المزاج', description: 'أنشئ أنظمة ألوان بناءً على المزاج لتنسيقها مع النصوص الرومانسية' },
      ],
    },
  },
  'dream-analysis-journal': {
    zh: {
      title: '梦境解析记录',
      description: '解梦、人生时间线、字数统计，记录与分析梦境三件套',
      steps: [
        { title: '解析梦境', description: '输入梦境内容，获取梦境解析与象征含义' },
        { title: '人生时间线', description: '以周为单位可视化人生，记录重要节点' },
        { title: '统计字数', description: '统计梦境记录的字数词数，方便整理归档' },
      ],
    },
    en: {
      title: 'Dream Analysis Journal',
      description: 'Dream interpretation, life timeline, and word count — three-piece kit for recording and analyzing dreams',
      steps: [
        { title: 'Analyze Dreams', description: 'Enter dream content to get dream interpretation and symbolic meanings' },
        { title: 'Life Timeline', description: 'Visualize your life in weeks and record important milestones' },
        { title: 'Count Words', description: 'Count words and characters of dream records for easy organization and archiving' },
      ],
    },
    fr: {
      title: 'Journal d\'analyse des rêves',
      description: 'Interprétation des rêves, chronologie de vie et comptage de mots — trio d\'outils pour enregistrer et analyser les rêves',
      steps: [
        { title: 'Analyser les rêves', description: 'Saisissez le contenu du rêve pour obtenir une interprétation et des significations symboliques' },
        { title: 'Chronologie de vie', description: 'Visualisez votre vie en semaines et enregistrez les étapes importantes' },
        { title: 'Compter les mots', description: 'Comptez les mots et caractères des enregistrements de rêves pour une organisation et un archivage faciles' },
      ],
    },
    es: {
      title: 'Diario de análisis de sueños',
      description: 'Interpretación de sueños, línea de tiempo de vida y conteo de palabras — trío de herramientas para registrar y analizar sueños',
      steps: [
        { title: 'Analizar sueños', description: 'Introduce el contenido del sueño para obtener una interpretación y significados simbólicos' },
        { title: 'Línea de tiempo de vida', description: 'Visualiza tu vida en semanas y registra los hitos importantes' },
        { title: 'Contar palabras', description: 'Cuenta palabras y caracteres de los registros de sueños para organizar y archivar fácilmente' },
      ],
    },
    hi: {
      title: 'स्वप्न विश्लेषण जर्नल',
      description: 'स्वप्न व्याख्या, जीवन समयरेखा, और शब्द गणना — स्वप्न रिकॉर्ड करने और विश्लेषण के लिए तीन-टुकड़ा किट',
      steps: [
        { title: 'स्वप्न विश्लेषण करें', description: 'स्वप्न व्याख्या और प्रतीकात्मक अर्थ प्राप्त करने के लिए स्वप्न सामग्री दर्ज करें' },
        { title: 'जीवन समयरेखा', description: 'सप्ताहों में अपने जीवन को विज़ुअलाइज़ करें और महत्वपूर्ण मील के पत्थर रिकॉर्ड करें' },
        { title: 'शब्द गणना करें', description: 'आसान व्यवस्थापन और संग्रह के लिए स्वप्न रिकॉर्ड के शब्दों और वर्णों की गणना करें' },
      ],
    },
    ar: {
      title: 'مذكرات تحليل الأحلام',
      description: 'تفسير الأحلام، الجدول الزمني للحياة، وعد الكلمات — ثلاثية أدوات لتسجيل وتحليل الأحلام',
      steps: [
        { title: 'تحليل الأحلام', description: 'أدخل محتوى الحلم للحصول على تفسير الحلم والمعاني الرمزية' },
        { title: 'الجدول الزمني للحياة', description: 'تصور حياتك بالأسابيع وسجّل المعالم المهمة' },
        { title: 'عد الكلمات', description: 'اعد كلمات وحروف سجلات الأحلام لسهولة التنظيم والأرشفة' },
      ],
    },
  },
  'chinese-writing-toolkit': {
    zh: {
      title: '中文创作套件',
      description: '文言文转换、拼音标注、竖排文字、藏头诗，中文创作四件套',
      steps: [
        { title: '转文言文', description: '将现代文转换为文言文风格，增添古韵' },
        { title: '标注拼音', description: '为中文文本标注拼音，方便朗读与学习' },
        { title: '生成竖排文字', description: '将文字转为竖排古风排版，适合古风设计' },
        { title: '作藏头诗', description: '输入主题字，生成专属藏头诗' },
      ],
    },
    en: {
      title: 'Chinese Writing Toolkit',
      description: 'Classical Chinese conversion, pinyin annotation, vertical text, and acrostic poems — four-piece Chinese writing kit',
      steps: [
        { title: 'Convert to Classical Chinese', description: 'Convert modern Chinese to classical style to add ancient charm' },
        { title: 'Annotate Pinyin', description: 'Add pinyin annotations to Chinese text for easy reading and learning' },
        { title: 'Generate Vertical Text', description: 'Convert text to vertical classical layout, suitable for vintage designs' },
        { title: 'Compose Acrostic Poems', description: 'Enter theme characters to generate personalized acrostic poems' },
      ],
    },
    fr: {
      title: 'Kit d\'écriture chinoise',
      description: 'Conversion en chinois classique, annotation pinyin, texte vertical et poèmes acrostiches — kit d\'écriture chinoise en quatre pièces',
      steps: [
        { title: 'Convertir en chinois classique', description: 'Convertissez le chinois moderne en style classique pour ajouter une touche ancienne' },
        { title: 'Annoter le pinyin', description: 'Ajoutez des annotations pinyin au texte chinois pour faciliter la lecture et l\'apprentissage' },
        { title: 'Générer du texte vertical', description: 'Convertissez le texte en mise en page verticale classique, adaptée aux designs vintage' },
        { title: 'Composer des poèmes acrostiches', description: 'Saisissez des caractères thématiques pour générer des poèmes acrostiches personnalisés' },
      ],
    },
    es: {
      title: 'Kit de escritura china',
      description: 'Conversión a chino clásico, anotación pinyin, texto vertical y poemas acrósticos — kit de escritura china en cuatro piezas',
      steps: [
        { title: 'Convertir a chino clásico', description: 'Convierte el chino moderno al estilo clásico para añadir un encanto antiguo' },
        { title: 'Anotar pinyin', description: 'Añade anotaciones pinyin al texto chino para facilitar la lectura y el aprendizaje' },
        { title: 'Generar texto vertical', description: 'Convierte el texto a un diseño vertical clásico, adecuado para diseños vintage' },
        { title: 'Componer poemas acrósticos', description: 'Introduce caracteres temáticos para generar poemas acrósticos personalizados' },
      ],
    },
    hi: {
      title: 'चीनी लेखन किट',
      description: 'शास्त्रीय चीनी रूपांतरण, पिनयिन एनोटेशन, लंबवर्ती पाठ, और अक्रोस्टिक कविताएं — चार-टुकड़ा चीनी लेखन किट',
      steps: [
        { title: 'शास्त्रीय चीनी में बदलें', description: 'प्राचीन आकर्षण जोड़ने के लिए आधुनिक चीनी को शास्त्रीय शैली में बदलें' },
        { title: 'पिनयिन एनोटेट करें', description: 'आसान पठन और सीखने के लिए चीनी पाठ में पिनयिन एनोटेशन जोड़ें' },
        { title: 'लंबवर्ती पाठ जनरेट करें', description: 'पाठ को लंबवर्ती शास्त्रीय लेआउट में बदलें, विंटेज डिज़ाइन के लिए उपयुक्त' },
        { title: 'अक्रोस्टिक कविता बनाएं', description: 'व्यक्तिगत अक्रोस्टिक कविताएं जनरेट करने के लिए थीम अक्षर दर्ज करें' },
      ],
    },
    ar: {
      title: 'مجموعة الكتابة الصينية',
      description: 'التحويل إلى الصينية الكلاسيكية، الترقيم البيني، النص العمودي، والقصائد الأكروستيكية — مجموعة من أربع قطع للكتابة الصينية',
      steps: [
        { title: 'التحويل إلى الصينية الكلاسيكية', description: 'حوّل الصينية الحديثة إلى النمط الكلاسيكي لإضافة سحر قديم' },
        { title: 'إضافة الترقيم البيني', description: 'أضف تعليقات البينين إلى النص الصيني لتسهيل القراءة والتعلم' },
        { title: 'توليد النص العمودي', description: 'حوّل النص إلى تخطيط كلاسيكي عمودي، مناسب للتصاميم الكلاسيكية' },
        { title: 'تأليف قصائد أكروستيك', description: 'أدخل أحرف الموضوع لتوليد قصائد أكروستيك مخصصة' },
      ],
    },
  },
};

const SUFFIX_MAP: Record<Locale, string> = {
  zh: '工作流',
  en: 'Workflow',
  fr: 'Flux de travail',
  es: 'Flujo de trabajo',
  hi: 'वर्कफ़्लो',
  ar: 'سير عمل',
};

const KEYWORD_MAP: Record<string, Record<Locale, string>> = {
  ppt: { zh: 'PPT', en: 'PPT', fr: 'PPT', es: 'PPT', hi: 'PPT', ar: 'PPT' },
  pdf: { zh: 'PDF', en: 'PDF', fr: 'PDF', es: 'PDF', hi: 'PDF', ar: 'PDF' },
  image: { zh: '图片', en: 'Image', fr: 'Image', es: 'Imagen', hi: 'इमेज', ar: 'صورة' },
  images: { zh: '图片', en: 'Images', fr: 'Images', es: 'Imágenes', hi: 'इमेजेस', ar: 'صور' },
  design: { zh: '设计', en: 'Design', fr: 'Conception', es: 'Diseño', hi: 'डिज़ाइन', ar: 'تصميم' },
  designer: { zh: '设计师', en: 'Designer', fr: 'Designer', es: 'Diseñador', hi: 'डिज़ाइनर', ar: 'مصمم' },
  dev: { zh: '开发', en: 'Dev', fr: 'Développement', es: 'Desarrollo', hi: 'डेव', ar: 'تطوير' },
  developer: { zh: '开发者', en: 'Developer', fr: 'Développeur', es: 'Desarrollador', hi: 'डेवलपर', ar: 'مطور' },
  process: { zh: '处理', en: 'Processing', fr: 'Traitement', es: 'Procesamiento', hi: 'प्रोसेसिंग', ar: 'معالجة' },
  processing: { zh: '处理', en: 'Processing', fr: 'Traitement', es: 'Procesamiento', hi: 'प्रोसेसिंग', ar: 'معالجة' },
  workflow: { zh: '工作流', en: 'Workflow', fr: 'Flux de travail', es: 'Flujo de trabajo', hi: 'वर्कफ़्लो', ar: 'سير عمل' },
  tool: { zh: '工具', en: 'Tool', fr: 'Outil', es: 'Herramienta', hi: 'टूल', ar: 'أداة' },
  tools: { zh: '工具', en: 'Tools', fr: 'Outils', es: 'Herramientas', hi: 'टूल्स', ar: 'أدوات' },
  social: { zh: '社交', en: 'Social', fr: 'Social', es: 'Social', hi: 'सोशल', ar: 'اجتماعي' },
  media: { zh: '媒体', en: 'Media', fr: 'Médias', es: 'Medios', hi: 'मीडिया', ar: 'وسائط' },
  video: { zh: '视频', en: 'Video', fr: 'Vidéo', es: 'Vídeo', hi: 'वीडियो', ar: 'فيديو' },
  audio: { zh: '音频', en: 'Audio', fr: 'Audio', es: 'Audio', hi: 'ऑडियो', ar: 'صوت' },
  content: { zh: '内容', en: 'Content', fr: 'Contenu', es: 'Contenido', hi: 'कंटेंट', ar: 'محتوى' },
  creator: { zh: '创作者', en: 'Creator', fr: 'Créateur', es: 'Creador', hi: 'क्रिएटर', ar: 'منشئ' },
  seo: { zh: 'SEO', en: 'SEO', fr: 'SEO', es: 'SEO', hi: 'SEO', ar: 'SEO' },
  api: { zh: 'API', en: 'API', fr: 'API', es: 'API', hi: 'API', ar: 'API' },
  ui: { zh: 'UI', en: 'UI', fr: 'UI', es: 'UI', hi: 'UI', ar: 'UI' },
  ux: { zh: 'UX', en: 'UX', fr: 'UX', es: 'UX', hi: 'UX', ar: 'UX' },
  ai: { zh: 'AI', en: 'AI', fr: 'IA', es: 'IA', hi: 'AI', ar: 'ذكاء اصطناعي' },
  logo: { zh: 'Logo', en: 'Logo', fr: 'Logo', es: 'Logo', hi: 'लोगो', ar: 'شعار' },
  banner: { zh: 'Banner', en: 'Banner', fr: 'Bannière', es: 'Banner', hi: 'बैनर', ar: 'بانر' },
  poster: { zh: '海报', en: 'Poster', fr: 'Affiche', es: 'Póster', hi: 'पोस्टर', ar: 'ملصق' },
  landing: { zh: '落地页', en: 'Landing Page', fr: 'Page d\'Atterrissage', es: 'Página de Aterrizaje', hi: 'लैंडिंग पेज', ar: 'الصفحة المقصودة' },
  page: { zh: '页面', en: 'Page', fr: 'Page', es: 'Página', hi: 'पेज', ar: 'صفحة' },
  pages: { zh: '页面', en: 'Pages', fr: 'Pages', es: 'Páginas', hi: 'पेजेस', ar: 'صفحات' },
  email: { zh: '邮件', en: 'Email', fr: 'E-mail', es: 'Correo', hi: 'ईमेल', ar: 'بريد إلكتروني' },
  marketing: { zh: '营销', en: 'Marketing', fr: 'Marketing', es: 'Marketing', hi: 'मार्केटिंग', ar: 'تسويق' },
  code: { zh: '代码', en: 'Code', fr: 'Code', es: 'Código', hi: 'कोड', ar: 'كود' },
  git: { zh: 'Git', en: 'Git', fr: 'Git', es: 'Git', hi: 'Git', ar: 'Git' },
  deploy: { zh: '部署', en: 'Deploy', fr: 'Déploiement', es: 'Despliegue', hi: 'डिप्लॉय', ar: 'نشر' },
  deployment: { zh: '部署', en: 'Deployment', fr: 'Déploiement', es: 'Despliegue', hi: 'डिप्लॉयमेंट', ar: 'نشر' },
  ops: { zh: '运维', en: 'Ops', fr: 'Ops', es: 'Ops', hi: 'ऑप्स', ar: 'العمليات' },
  database: { zh: '数据库', en: 'Database', fr: 'Base de données', es: 'Base de datos', hi: 'डेटाबेस', ar: 'قاعدة بيانات' },
  debug: { zh: '调试', en: 'Debug', fr: 'Débogage', es: 'Depuración', hi: 'डीबग', ar: 'تصحيح الأخطاء' },
  frontend: { zh: '前端', en: 'Frontend', fr: 'Frontend', es: 'Frontend', hi: 'फ्रंटएंड', ar: 'الواجهة الأمامية' },
  backend: { zh: '后端', en: 'Backend', fr: 'Backend', es: 'Backend', hi: 'बैकएंड', ar: 'الواجهة الخلفية' },
  review: { zh: '审查', en: 'Review', fr: 'Revue', es: 'Revisión', hi: 'रिव्यू', ar: 'مراجعة' },
  component: { zh: '组件', en: 'Component', fr: 'Composant', es: 'Componente', hi: 'कंपोनेंट', ar: 'مكون' },
  components: { zh: '组件', en: 'Components', fr: 'Composants', es: 'Componentes', hi: 'कंपोनेंट्स', ar: 'مكونات' },
  spec: { zh: '规范', en: 'Spec', fr: 'Spécifications', es: 'Especificación', hi: 'स्पेक', ar: 'مواصفات' },
  illustration: { zh: '插画', en: 'Illustration', fr: 'Illustration', es: 'Ilustración', hi: 'इलस्ट्रेशन', ar: 'توضيح' },
  novel: { zh: '小说', en: 'Novel', fr: 'Roman', es: 'Novela', hi: 'नॉवेल', ar: 'رواية' },
  article: { zh: '文章', en: 'Article', fr: 'Article', es: 'Artículo', hi: 'आर्टिकल', ar: 'مقالة' },
  report: { zh: '报告', en: 'Report', fr: 'Rapport', es: 'Informe', hi: 'रिपोर्ट', ar: 'تقرير' },
  weekly: { zh: '周报', en: 'Weekly', fr: 'Hebdomadaire', es: 'Semanal', hi: 'साप्ताहिक', ar: 'أسبوعي' },
  meeting: { zh: '会议', en: 'Meeting', fr: 'Réunion', es: 'Reunión', hi: 'मीटिंग', ar: 'اجتماع' },
  minutes: { zh: '纪要', en: 'Minutes', fr: 'Compte rendu', es: 'Minuta', hi: 'मिनट्स', ar: 'محضر' },
  business: { zh: '商业', en: 'Business', fr: 'Business', es: 'Negocio', hi: 'बिज़नेस', ar: 'أعمال' },
  plan: { zh: '计划', en: 'Plan', fr: 'Plan', es: 'Plan', hi: 'प्लान', ar: 'خطة' },
  plans: { zh: '计划', en: 'Plans', fr: 'Plans', es: 'Planes', hi: 'प्लान्स', ar: 'خطط' },
  product: { zh: '产品', en: 'Product', fr: 'Produit', es: 'Producto', hi: 'प्रोडक्ट', ar: 'منتج' },
  manager: { zh: '经理', en: 'Manager', fr: 'Manager', es: 'Gerente', hi: 'मैनेजर', ar: 'مدير' },
  prd: { zh: 'PRD', en: 'PRD', fr: 'PRD', es: 'PRD', hi: 'PRD', ar: 'PRD' },
  competitive: { zh: '竞品', en: 'Competitive', fr: 'Concurrentiel', es: 'Competitivo', hi: 'कम्पेटिटिव', ar: 'تنافسي' },
  analysis: { zh: '分析', en: 'Analysis', fr: 'Analyse', es: 'Análisis', hi: 'एनालिसिस', ar: 'تحليل' },
  user: { zh: '用户', en: 'User', fr: 'Utilisateur', es: 'Usuario', hi: 'यूज़र', ar: 'مستخدم' },
  research: { zh: '调研', en: 'Research', fr: 'Recherche', es: 'Investigación', hi: 'रिसर्च', ar: 'بحث' },
  community: { zh: '社群', en: 'Community', fr: 'Communauté', es: 'Comunidad', hi: 'कम्यूनिटी', ar: 'مجتمع' },
  fission: { zh: '裂变', en: 'Fission', fr: 'Fission', es: 'Fisión', hi: 'फिशन', ar: 'انشطار' },
  private: { zh: '私域', en: 'Private', fr: 'Privé', es: 'Privado', hi: 'प्राइवेट', ar: 'خاص' },
  domain: { zh: '域', en: 'Domain', fr: 'Domaine', es: 'Dominio', hi: 'डोमेन', ar: 'مجال' },
  sop: { zh: 'SOP', en: 'SOP', fr: 'Procédure', es: 'Procedimiento', hi: 'SOP', ar: 'إجراءات' },
  keyword: { zh: '关键词', en: 'Keyword', fr: 'Mot-clé', es: 'Palabra clave', hi: 'कीवर्ड', ar: 'كلمة مفتاحية' },
  keywords: { zh: '关键词', en: 'Keywords', fr: 'Mots-clés', es: 'Palabras clave', hi: 'कीवर्ड्स', ar: 'كلمات مفتاحية' },
  cross: { zh: '跨境', en: 'Cross-border', fr: 'Transfrontalier', es: 'Transfronterizo', hi: 'क्रॉस', ar: 'عبر الحدود' },
  border: { zh: '边境', en: 'Border', fr: 'Frontière', es: 'Frontera', hi: 'बॉर्डर', ar: 'حدود' },
  listing: { zh: 'Listing', en: 'Listing', fr: 'Annonce', es: 'Anuncio', hi: 'लिस्टिंग', ar: 'قائمة' },
  listings: { zh: 'Listings', en: 'Listings', fr: 'Annonces', es: 'Anuncios', hi: 'लिस्टिंग्स', ar: 'قوائم' },
  inventory: { zh: '库存', en: 'Inventory', fr: 'Inventaire', es: 'Inventario', hi: 'इन्वेंट्री', ar: 'مخزون' },
  alert: { zh: '告警', en: 'Alert', fr: 'Alerte', es: 'Alerta', hi: 'अलर्ट', ar: 'تنبيه' },
  gdpr: { zh: 'GDPR', en: 'GDPR', fr: 'RGPD', es: 'RGPD', hi: 'GDPR', ar: 'GDPR' },
  compliance: { zh: '合规', en: 'Compliance', fr: 'Conformité', es: 'Cumplimiento', hi: 'कम्प्लायंस', ar: 'الامتثال' },
  scan: { zh: '扫描', en: 'Scan', fr: 'Scan', es: 'Escaneo', hi: 'स्कैन', ar: 'مسح' },
  finance: { zh: '财务', en: 'Finance', fr: 'Finance', es: 'Finanzas', hi: 'फाइनेंस', ar: 'مالية' },
  currency: { zh: '币种', en: 'Currency', fr: 'Devise', es: 'Moneda', hi: 'करेंसी', ar: 'عملة' },
  pricing: { zh: '定价', en: 'Pricing', fr: 'Tarification', es: 'Precios', hi: 'प्राइसिंग', ar: 'التسعير' },
  multi: { zh: '多', en: 'Multi', fr: 'Multi', es: 'Multi', hi: 'मल्टी', ar: 'متعدد' },
  site: { zh: '站点', en: 'Site', fr: 'Site', es: 'Sitio', hi: 'साइट', ar: 'موقع' },
  sites: { zh: '站点', en: 'Sites', fr: 'Sites', es: 'Sitios', hi: 'साइट्स', ar: 'مواقع' },
  sync: { zh: '同步', en: 'Sync', fr: 'Sync', es: 'Sincronización', hi: 'सिंक', ar: 'مزامنة' },
  meta: { zh: 'Meta', en: 'Meta', fr: 'Meta', es: 'Meta', hi: 'मेटा', ar: 'ميتا' },
  ad: { zh: '广告', en: 'Ad', fr: 'Publicité', es: 'Anuncio', hi: 'विज्ञापन', ar: 'إعلان' },
  ads: { zh: '广告', en: 'Ads', fr: 'Publicités', es: 'Anuncios', hi: 'विज्ञापन', ar: 'إعلانات' },
  creative: { zh: '创意', en: 'Creative', fr: 'Créatif', es: 'Creativo', hi: 'क्रिएटिव', ar: 'إبداعي' },
  tiktok: { zh: 'TikTok', en: 'TikTok', fr: 'TikTok', es: 'TikTok', hi: 'TikTok', ar: 'تيك توك' },
  seeding: { zh: '种草', en: 'Seeding', fr: 'Amorçage', es: 'Difusión', hi: 'सीडिंग', ar: 'البذر' },
  cs: { zh: '客服', en: 'CS', fr: 'SAV', es: 'Atención al cliente', hi: 'ग्राहक सेवा', ar: 'خدمة العملاء' },
  multilingual: { zh: '多语言', en: 'Multilingual', fr: 'Multilingue', es: 'Multilingüe', hi: 'मल्टीलिंगुअल', ar: 'متعدد اللغات' },
  resume: { zh: '简历', en: 'Resume', fr: 'CV', es: 'Currículum', hi: 'रिज्यूमे', ar: 'السيرة الذاتية' },
  build: { zh: '制作', en: 'Build', fr: 'Création', es: 'Creación', hi: 'बिल्ड', ar: 'بناء' },
  student: { zh: '学生', en: 'Student', fr: 'Étudiant', es: 'Estudiante', hi: 'स्टूडेंट', ar: 'طالب' },
  paper: { zh: '论文', en: 'Paper', fr: 'Mémoire', es: 'Tesis', hi: 'पेपर', ar: 'ورقة بحثية' },
  exam: { zh: '考试', en: 'Exam', fr: 'Examen', es: 'Examen', hi: 'एग्जाम', ar: 'امتحان' },
  prep: { zh: '备考', en: 'Prep', fr: 'Préparation', es: 'Preparación', hi: 'प्रेप', ar: 'تحضير' },
  study: { zh: '学习', en: 'Study', fr: 'Étude', es: 'Estudio', hi: 'स्टडी', ar: 'دراسة' },
  abroad: { zh: '留学', en: 'Abroad', fr: 'Étranger', es: 'Extranjero', hi: 'अब्रोड', ar: 'الخارج' },
  reading: { zh: '阅读', en: 'Reading', fr: 'Lecture', es: 'Lectura', hi: 'रीडिंग', ar: 'قراءة' },
  notes: { zh: '笔记', en: 'Notes', fr: 'Notes', es: 'Notas', hi: 'नोट्स', ar: 'ملاحظات' },
  note: { zh: '笔记', en: 'Note', fr: 'Note', es: 'Nota', hi: 'नोट', ar: 'ملاحظة' },
  vlog: { zh: 'Vlog', en: 'Vlog', fr: 'Vlog', es: 'Vlog', hi: 'व्लॉग', ar: 'فلوغ' },
  livestream: { zh: '直播', en: 'Livestream', fr: 'Direct', es: 'Transmisión en vivo', hi: 'लाइवस्ट्रीम', ar: 'بث مباشر' },
  slice: { zh: '切片', en: 'Slice', fr: 'Extrait', es: 'Corte', hi: 'स्लाइस', ar: 'مقاطع' },
  digital: { zh: '数字', en: 'Digital', fr: 'Numérique', es: 'Digital', hi: 'डिजिटल', ar: 'رقمي' },
  human: { zh: '人', en: 'Human', fr: 'Humain', es: 'Humano', hi: 'ह्यूमन', ar: 'بشري' },
  okr: { zh: 'OKR', en: 'OKR', fr: 'OKR', es: 'OKR', hi: 'OKR', ar: 'OKR' },
  setup: { zh: '配置', en: 'Setup', fr: 'Configuration', es: 'Configuración', hi: 'सेटअप', ar: 'إعداد' },
  productivity: { zh: '效率', en: 'Productivity', fr: 'Productivité', es: 'Productividad', hi: 'प्रोडक्टिविटी', ar: 'الإنتاجية' },
  color: { zh: '配色', en: 'Color', fr: 'Couleur', es: 'Color', hi: 'कलर', ar: 'لون' },
  branding: { zh: '品牌', en: 'Branding', fr: 'Branding', es: 'Branding', hi: 'ब्रांडिंग', ar: 'الهوية البصرية' },
  scheduling: { zh: '排期', en: 'Scheduling', fr: 'Planification', es: 'Programación', hi: 'स्केडुलिंग', ar: 'الجدولة' },
  podcast: { zh: '播客', en: 'Podcast', fr: 'Podcast', es: 'Podcast', hi: 'पॉडकास्ट', ar: 'بودكاست' },
  production: { zh: '制作', en: 'Production', fr: 'Production', es: 'Producción', hi: 'प्रोडक्शन', ar: 'إنتاج' },
  course: { zh: '课程', en: 'Course', fr: 'Cours', es: 'Curso', hi: 'कोर्स', ar: 'دورة' },
  online: { zh: '在线', en: 'Online', fr: 'En ligne', es: 'Online', hi: 'ऑनलाइन', ar: 'عبر الإنترنت' },
  photography: { zh: '摄影', en: 'Photography', fr: 'Photographie', es: 'Fotografía', hi: 'फोटोग्राफी', ar: 'التصوير' },
  wechat: { zh: '公众号', en: 'WeChat', fr: 'WeChat', es: 'WeChat', hi: 'वीचैट', ar: 'ويشات' },
  xiaohongshu: { zh: '小红书', en: 'Xiaohongshu', fr: 'Xiaohongshu', es: 'Xiaohongshu', hi: 'शाओहोंग्शु', ar: 'شياوهونغشو' },
  douyin: { zh: '抖音', en: 'Douyin', fr: 'Douyin', es: 'Douyin', hi: 'दोइन', ar: 'دويين' },
  copy: { zh: '文案', en: 'Copy', fr: 'Copy', es: 'Copy', hi: 'कॉपी', ar: 'النص' },
  fiverr: { zh: 'Fiverr', en: 'Fiverr', fr: 'Fiverr', es: 'Fiverr', hi: 'फाइवर', ar: 'فايفر' },
  proposal: { zh: '提案', en: 'Proposal', fr: 'Proposition', es: 'Propuesta', hi: 'प्रोपोजल', ar: 'اقتراح' },
  portfolio: { zh: '作品集', en: 'Portfolio', fr: 'Portfolio', es: 'Portafolio', hi: 'पोर्टफोलियो', ar: 'محفظة أعمال' },
  auto: { zh: '自动', en: 'Auto', fr: 'Auto', es: 'Auto', hi: 'ऑटो', ar: 'تلقائي' },
  layout: { zh: '排版', en: 'Layout', fr: 'Mise en page', es: 'Maquetación', hi: 'लेआउट', ar: 'التخطيط' },
  delivery: { zh: '交付', en: 'Delivery', fr: 'Livraison', es: 'Entrega', hi: 'डिलीवरी', ar: 'تسليم' },
  packager: { zh: '打包', en: 'Packager', fr: 'Emballage', es: 'Empaquetado', hi: 'पैकेजर', ar: 'التغليف' },
  client: { zh: '客户', en: 'Client', fr: 'Client', es: 'Cliente', hi: 'क्लाइंट', ar: 'عميل' },
  followup: { zh: '跟进', en: 'Follow-up', fr: 'Suivi', es: 'Seguimiento', hi: 'फॉलोअप', ar: 'متابعة' },
  invoice: { zh: '发票', en: 'Invoice', fr: 'Facture', es: 'Factura', hi: 'इनवॉइस', ar: 'فاتورة' },
  generator: { zh: '生成器', en: 'Generator', fr: 'Générateur', es: 'Generador', hi: 'जेनरेटर', ar: 'مولد' },
  hourly: { zh: '计时', en: 'Hourly', fr: 'Horaire', es: 'Por hora', hi: 'अवरली', ar: 'بالساعة' },
  billing: { zh: '记账', en: 'Billing', fr: 'Facturation', es: 'Facturación', hi: 'बिलिंग', ar: 'الفوترة' },
  creation: { zh: '创作', en: 'Creation', fr: 'Création', es: 'Creación', hi: 'क्रिएशन', ar: 'إنشاء' },
  brand: { zh: '品牌', en: 'Brand', fr: 'Marque', es: 'Marca', hi: 'ब्रांड', ar: 'العلامة التجارية' },
  scheme: { zh: '方案', en: 'Scheme', fr: 'Schéma', es: 'Esquema', hi: 'स्कीम', ar: 'مخطط' },
};

export function autoTranslateSlugTitle(slug: string, locale: Locale): string {
  const parts = slug.split('-').filter(Boolean);
  const translatedParts: string[] = [];

  for (const part of parts) {
    const lowerPart = part.toLowerCase();
    if (KEYWORD_MAP[lowerPart] && KEYWORD_MAP[lowerPart][locale]) {
      translatedParts.push(KEYWORD_MAP[lowerPart][locale]);
    } else {
      if (locale === 'zh') {
        translatedParts.push(part);
      } else {
        translatedParts.push(part.charAt(0).toUpperCase() + part.slice(1));
      }
    }
  }

  let result: string;
  if (locale === 'zh') {
    result = translatedParts.join('');
  } else {
    result = translatedParts.join(' ');
  }

  const workflowTerms: Record<Locale, string[]> = {
    zh: ['工作流'],
    en: ['Workflow', 'workflow'],
    fr: ['Flux de travail', 'flux de travail'],
    es: ['Flujo de trabajo', 'flujo de trabajo'],
    hi: ['वर्कफ़्लो'],
    ar: ['سير عمل'],
  };

  const hasWorkflowTerm = translatedParts.some(p =>
    workflowTerms[locale].includes(p) ||
    workflowTerms[locale].some(t => p.toLowerCase().includes(t.toLowerCase()))
  );

  if (!hasWorkflowTerm && !result.includes(SUFFIX_MAP[locale])) {
    if (locale === 'zh') {
      result = result + SUFFIX_MAP[locale];
    } else {
      result = result + ' ' + SUFFIX_MAP[locale];
    }
  }

  return result;
}

const DIFFICULTY_MAP: Record<string, Record<Locale, string>> = {
  easy: { zh: '简单', en: 'Easy', fr: 'Facile', es: 'Fácil', hi: 'आसान', ar: 'سهل' },
  medium: { zh: '中等', en: 'Medium', fr: 'Moyen', es: 'Medio', hi: 'मध्यम', ar: 'متوسط' },
  advanced: { zh: '进阶', en: 'Advanced', fr: 'Avancé', es: 'Avanzado', hi: 'उन्नत', ar: 'متقدم' },
  '简单': { zh: '简单', en: 'Easy', fr: 'Facile', es: 'Fácil', hi: 'आसान', ar: 'سهل' },
  '中等': { zh: '中等', en: 'Medium', fr: 'Moyen', es: 'Medio', hi: 'मध्यम', ar: 'متوسط' },
  '进阶': { zh: '进阶', en: 'Advanced', fr: 'Avancé', es: 'Avanzado', hi: 'उन्नत', ar: 'متقدم' },
};

export function translateDifficulty(difficulty: string, locale: Locale): string {
  const key = difficulty.toLowerCase();
  if (DIFFICULTY_MAP[key]) {
    return DIFFICULTY_MAP[key][locale] || difficulty;
  }
  if (DIFFICULTY_MAP[difficulty]) {
    return DIFFICULTY_MAP[difficulty][locale] || difficulty;
  }
  return difficulty;
}

const TIME_PATTERNS: Array<{ pattern: RegExp; formats: Record<Locale, (m: RegExpMatchArray) => string> }> = [
  {
    pattern: /(\d+)\s*个月/,
    formats: {
      zh: (m) => `${m[1]}个月`,
      en: (m) => `${m[1]} months`,
      fr: (m) => `${m[1]} mois`,
      es: (m) => `${m[1]} meses`,
      hi: (m) => `${m[1]} महीने`,
      ar: (m) => `${m[1]} أشهر`,
    },
  },
  {
    pattern: /(\d+)\s*周/,
    formats: {
      zh: (m) => `${m[1]}周`,
      en: (m) => `${m[1]} week${parseInt(m[1]) > 1 ? 's' : ''}`,
      fr: (m) => `${m[1]} sem.`,
      es: (m) => `${m[1]} sem.`,
      hi: (m) => `${m[1]} सप्ताह`,
      ar: (m) => `${m[1]} أسابيع`,
    },
  },
  {
    pattern: /(\d+)\s*天/,
    formats: {
      zh: (m) => `${m[1]}天`,
      en: (m) => `${m[1]} day${parseInt(m[1]) > 1 ? 's' : ''}`,
      fr: (m) => `${m[1]}j`,
      es: (m) => `${m[1]}d`,
      hi: (m) => `${m[1]} दिन`,
      ar: (m) => `${m[1]} أيام`,
    },
  },
  {
    pattern: /半天/,
    formats: {
      zh: () => '半天',
      en: () => 'Half day',
      fr: () => '½ journée',
      es: () => 'Medio día',
      hi: () => 'आधा दिन',
      ar: () => 'نصف يوم',
    },
  },
  {
    pattern: /(\d+)\s*小时/,
    formats: {
      zh: (m) => `${m[1]}小时`,
      en: (m) => `${m[1]}h`,
      fr: (m) => `${m[1]}h`,
      es: (m) => `${m[1]}h`,
      hi: (m) => `${m[1]} घंटे`,
      ar: (m) => `${m[1]} ساعات`,
    },
  },
  {
    pattern: /(\d+)\s*分钟/,
    formats: {
      zh: (m) => `${m[1]}分钟`,
      en: (m) => `${m[1]} min`,
      fr: (m) => `${m[1]} min`,
      es: (m) => `${m[1]} min`,
      hi: (m) => `${m[1]} मिनट`,
      ar: (m) => `${m[1]} دقائق`,
    },
  },
  {
    pattern: /随时使用/,
    formats: {
      zh: () => '随时使用',
      en: () => 'Use anytime',
      fr: () => 'À utiliser à tout moment',
      es: () => 'Uso en cualquier momento',
      hi: () => 'कभी भी उपयोग करें',
      ar: () => 'الاستخدام في أي وقت',
    },
  },
  {
    pattern: /随时触发/,
    formats: {
      zh: () => '随时触发',
      en: () => 'Trigger anytime',
      fr: () => 'Déclencher à tout moment',
      es: () => 'Activar en cualquier momento',
      hi: () => 'कभी भी ट्रिगर करें',
      ar: () => 'تشغيل في أي وقت',
    },
  },
  {
    pattern: /每天自动/,
    formats: {
      zh: () => '每天自动',
      en: () => 'Daily auto',
      fr: () => 'Auto quotidien',
      es: () => 'Auto diario',
      hi: () => 'रोज़ाना ऑटो',
      ar: () => 'تلقائي يوميًا',
    },
  },
  {
    pattern: /每日自动/,
    formats: {
      zh: () => '每日自动',
      en: () => 'Daily auto',
      fr: () => 'Auto quotidien',
      es: () => 'Auto diario',
      hi: () => 'रोज़ाना ऑटो',
      ar: () => 'تلقائي يوميًا',
    },
  },
];

export function translateEstimatedTime(estimatedTime: string, locale: Locale): string {
  for (const { pattern, formats } of TIME_PATTERNS) {
    const match = estimatedTime.match(pattern);
    if (match) {
      return formats[locale](match);
    }
  }
  return estimatedTime;
}

export function translateWorkflow(wf: Workflow, locale: Locale): Workflow {
  const cloned: Workflow = JSON.parse(JSON.stringify(wf));
  const translations = WORKFLOW_TRANSLATIONS[wf.slug];
  const localeTranslations = translations?.[locale];
  const zhTranslations = translations?.['zh'];

  cloned.title = localeTranslations?.title
    ?? autoTranslateSlugTitle(wf.slug, locale)
    ?? cloned.title;

  cloned.description = localeTranslations?.description
    ?? zhTranslations?.description
    ?? cloned.description;

  if (localeTranslations?.steps || zhTranslations?.steps) {
    cloned.steps = cloned.steps.map((step: WorkflowStep, index: number) => {
      const stepClone: WorkflowStep = { ...step };
      const localeStep = localeTranslations?.steps?.[index];
      const zhStep = zhTranslations?.steps?.[index];
      stepClone.title = localeStep?.title ?? zhStep?.title ?? stepClone.title;
      stepClone.description = localeStep?.description ?? zhStep?.description ?? stepClone.description;
      return stepClone;
    });
  }

  return cloned;
}
