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
