/* ==========================================================================
 * 翻译回写器：按字典精准替换占位的 name / description
 *  - name：按"品牌名 + 功能后缀"拆分，保留品牌，翻译后缀；纯功能词全译
 *  - description：按整段英文做 key 匹配翻译
 * ========================================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public', 'locales');

// ============================================================
// A. 功能词字典：name字段中出现的高频功能后缀
//    格式: { '功能词': { es, fr, ar, hi } }
//    匹配规则：末尾精确匹配 / 全词精确匹配
// ============================================================
const SUFFIX_DICT = {
  // ---- 通用功能（按首字母排序）----
  'News':           { es: 'Noticias',        fr: 'Actualités',    ar: 'أخبار',          hi: 'समाचार' },
  'Translate':      { es: 'Traductor',       fr: 'Traducteur',    ar: 'مترجم',           hi: 'अनुवादक' },
  'Writing':        { es: 'Redacción',       fr: 'Rédaction',     ar: 'الكتابة',         hi: 'लेखन' },
  'Images':         { es: 'Imágenes',        fr: 'Images',        ar: 'صور',             hi: 'छवियाँ' },
  'Photos':         { es: 'Fotos',           fr: 'Photos',        ar: 'صور',             hi: 'तस्वीरें' },
  'Icons':          { es: 'Iconos',          fr: 'Icônes',        ar: 'أيقونات',         hi: 'आइकन' },
  'Vectors':        { es: 'Vectores',        fr: 'Vecteurs',      ar: 'متجهات',          hi: 'वेक्टर' },
  'Fonts':          { es: 'Fuentes',         fr: 'Polices',       ar: 'خطوط',            hi: 'फ़ॉन्ट' },
  'PPT':            { es: 'Presentaciones',  fr: 'PowerPoint',    ar: 'عروض تقديمية',   hi: 'पीपीटी' },
  'Flowchart':      { es: 'Diagrama Flujo',  fr: 'Organigramme',  ar: 'مخطط انسيابي',    hi: 'फ्लोचार्ट' },
  'PDF':            { es: 'PDF',             fr: 'PDF',           ar: 'PDF',             hi: 'PDF' },
  'GIF':            { es: 'GIF',             fr: 'GIF',           ar: 'GIF',             hi: 'GIF' },
  'Audio':          { es: 'Audio',           fr: 'Audio',         ar: 'صوت',             hi: 'ऑडियो' },
  'Video':          { es: 'Vídeo',           fr: 'Vidéo',         ar: 'فيديو',           hi: 'वीडियो' },
  'Voice':          { es: 'Voz',             fr: 'Voix',          ar: 'صوت',             hi: 'आवाज़' },
  'Voiceover':      { es: 'Locución',        fr: 'Voix Off',      ar: 'تعليق صوتي',      hi: 'वॉइसओवर' },
  'Music':          { es: 'Música',          fr: 'Musique',       ar: 'موسيقى',          hi: 'संगीत' },
  'AI':             { es: 'IA',              fr: 'IA',            ar: 'ذكاء اصطناعي',    hi: 'एआई' },
  'CSS':            { es: 'CSS',             fr: 'CSS',           ar: 'CSS',             hi: 'CSS' },
  'JavaScript':     { es: 'JavaScript',      fr: 'JavaScript',    ar: 'JavaScript',      hi: 'जावास्क्रिप्ट' },
  'Js':             { es: 'JavaScript',      fr: 'JavaScript',    ar: 'جافاسكربت',       hi: 'जेएस' },
  'JSON':           { es: 'JSON',            fr: 'JSON',          ar: 'JSON',            hi: 'JSON' },
  'Jq':             { es: 'JQ',              fr: 'JQ',            ar: 'JQ',              hi: 'JQ' },
  'Joke':           { es: 'Chistes',         fr: 'Blagues',       ar: 'نكات',            hi: 'चुटकुले' },
  'IDE':            { es: 'IDE',             fr: 'IDE',           ar: 'بيئة تطوير',      hi: 'IDE' },
  'Docs':           { es: 'Documentos',      fr: 'Documentation', ar: 'وثائق',           hi: 'दस्तावेज़' },
  'Pages':          { es: 'Páginas',         fr: 'Pages',         ar: 'صفحات',           hi: 'पृष्ठ' },
  'Sheets':         { es: 'Hojas Cálculo',   fr: 'Tableurs',      ar: 'جداول بيانات',    hi: 'शीट्स' },
  'Slides':         { es: 'Diapositivas',    fr: 'Diapositives',  ar: 'الشرائح',         hi: 'स्लाइड्स' },
  'Playground':     { es: 'Zona Pruebas',    fr: 'Bac à Sable',   ar: 'ملعب تجريبي',     hi: 'प्लेग्राउंड' },
  'Garden':         { es: 'Jardín',          fr: 'Jardin',        ar: 'حديقة',           hi: 'गार्डन' },
  'Froggy':         { es: 'Rana',            fr: 'Grenouille',    ar: 'ضفدع',            hi: 'मेंढक' },
  'Tricks':         { es: 'Trucos',          fr: 'Astuces',       ar: 'نصائح',           hi: 'तरकीबें' },
  'Magazine':       { es: 'Revista',         fr: 'Magazine',      ar: 'مجلة',            hi: 'पत्रिका' },
  'Frontend':       { es: 'Frontend',        fr: 'Frontend',      ar: 'واجهة أمامية',    hi: 'फ्रंटएंड' },
  'Backend':        { es: 'Backend',         fr: 'Backend',       ar: 'الخلفية',         hi: 'बैकएंड' },
  'Edge':           { es: 'Edge',            fr: 'Edge',          ar: 'Edge',            hi: 'एज' },
  'Format':         { es: 'Formato',         fr: 'Format',        ar: 'تنسيق',           hi: 'स्वरूप' },
  'Compress':       { es: 'Compresor',       fr: 'Compresseur',   ar: 'ضاغط',            hi: 'संपीड़क' },
  'Remover':        { es: 'Eliminador',      fr: 'Suppresseur',   ar: 'إزالة',           hi: 'हटानेवाला' },
  'Bg':             { es: 'Fondo',           fr: 'Arrière-plan',  ar: 'خلفية',           hi: 'पृष्ठभूमि' },
  'Background':     { es: 'Fondo',           fr: 'Arrière-plan',  ar: 'خلفية',           hi: 'बैकग्राउंड' },
  'Whiteboard':     { es: 'Pizarrón Blanco', fr: 'Tableau Blanc', ar: 'سبورة بيضاء',     hi: 'व्हाइटबोर्ड' },
  'URL':            { es: 'URL',             fr: 'URL',           ar: 'رابط',            hi: 'URL' },
  'Transfer':       { es: 'Transferencia',   fr: 'Transfert',     ar: 'تحويل',           hi: 'ट्रांसफर' },
  'Anywhere':       { es: 'Anywhere',        fr: 'N\'importe Où', ar: 'في أي مكان',      hi: 'एनीव्हेयर' },
  'Encoder':        { es: 'Codificador',     fr: 'Encodeur',      ar: 'مشفر',            hi: 'एनकोडर' },
  'Monke':          { es: 'QR Mono',         fr: 'QR Singe',      ar: 'قرود كيو آر',     hi: 'क्यूआर मंकी' },
  'Template':       { es: 'Plantillas',      fr: 'Modèles',       ar: 'قوالب',           hi: 'टेम्पलेट' },
  'Template Gall':  { es: 'Galería Plant.',  fr: 'Galerie Modèles',ar: 'معرض القوالب',   hi: 'टेम्पलेट गैलरी' },
  'Gallery':        { es: 'Galería',         fr: 'Galerie',       ar: 'معرض',            hi: 'गैलरी' },
  'Launch':         { es: 'Lanzamientos',    fr: 'Lancements',    ar: 'إطلاقات',         hi: 'लॉन्च' },
  'Awesome':        { es: 'Impresionante',   fr: 'Impressionnant',ar: 'رائع',            hi: 'अद्भुत' },
  'Lists':          { es: 'Listas',          fr: 'Listes',        ar: 'قوائم',           hi: 'सूचियाँ' },
  'Brand':          { es: 'Marca',           fr: 'Marque',        ar: 'علامة تجارية',    hi: 'ब्रैंड' },
  'Logo':           { es: 'Logotipo',        fr: 'Logo',          ar: 'شعار',            hi: 'लोगो' },
  'Diffusion':      { es: 'Difusión',        fr: 'Diffusion',     ar: 'انتشار',          hi: 'डिफ्यूजन' },
  'Font Awesome':   { es: 'Font Awesome',    fr: 'Font Awesome',  ar: 'فونت أوسم',       hi: 'फ़ॉन्ट ऑसम' },
  'No-Code Builder':{ es: 'Constructor Visual',fr: 'Constructeur No-Code',ar: 'منشئ بدون كود',hi: 'नो-कोड बिल्डर' },
  'Builder':        { es: 'Constructor',     fr: 'Constructeur',  ar: 'منشئ',            hi: 'बिल्डर' },
  'Design':         { es: 'Diseño',          fr: 'Design',        ar: 'تصميم',           hi: 'डिज़ाइन' },
  'Scheduler':      { es: 'Agenda',          fr: 'Planificateur', ar: 'جدولة',           hi: 'शेड्यूलर' },
  'Automation':     { es: 'Automatización',  fr: 'Automatisation',ar: 'تشغيل آلي',       hi: 'ऑटोमेशन' },
  'Workspace':      { es: 'Espacio Trabajo', fr: 'Espace Travail',ar: 'مساحة العمل',     hi: 'वर्कस्पेस' },
  'Monitoring':     { es: 'Monitorización',  fr: 'Monitoring',    ar: 'مراقبة',          hi: 'मॉनिटरिंग' },
  'Deployment':     { es: 'Despliegue',      fr: 'Déploiement',   ar: 'نشر',             hi: 'डिप्लॉयमेंट' },
  'Resume':         { es: 'CV',              fr: 'CV',            ar: 'سيرة ذاتية',      hi: 'बायोडेटा' },
  'Portfolio Site': { es: 'Portafolio Web',  fr: 'Portfolio Web', ar: 'محفظة إلكترونية', hi: 'पोर्टफोलियो साइट' },
  'Notes':          { es: 'Notas',           fr: 'Notes',         ar: 'ملاحظات',         hi: 'नोट्स' },
  'Languages':      { es: 'Idiomas',         fr: 'Langues',       ar: 'لغات',            hi: 'भाषाएँ' },
  'Flashcards':     { es: 'Tarjetas',        fr: 'Cartes Mémoire',ar: 'بطاقات تعليمية',  hi: 'फ्लैशकार्ड' },
  'Scheduling':     { es: 'Citas',           fr: 'Planification', ar: 'جدولة مواعيد',    hi: 'शेड्यूलिंग' },
  'Hosting':        { es: 'Alojamiento',     fr: 'Hébergement',   ar: 'استضافة',         hi: 'होस्टिंग' },
  'Cloud':          { es: 'Cloud',           fr: 'Cloud',         ar: 'السحابة',         hi: 'क्लाउड' },
  'Network':        { es: 'Red',             fr: 'Réseau',        ar: 'شبكة',            hi: 'नेटवर्क' },
  'Tunnel':         { es: 'Túnel',           fr: 'Tunnel',        ar: 'نفق',             hi: 'टनल' },
  'Docker':         { es: 'Docker',          fr: 'Docker',        ar: 'دوكر',            hi: 'डॉकर' },
  'ORM':            { es: 'ORM',             fr: 'ORM',           ar: 'ORM',             hi: 'ORM' },
  'API':            { es: 'API',             fr: 'API',           ar: 'واجهة برمجة',     hi: 'एपीआई' },
  'Calc':           { es: 'Calculadora',     fr: 'Calculatrice',  ar: 'حاسبة',           hi: 'कैलक' },
  'Checker':        { es: 'Verificador',     fr: 'Vérificateur',  ar: 'مدقق',            hi: 'जाँचकर्ता' },
  'Analyzer':       { es: 'Analizador',      fr: 'Analyseur',     ar: 'محلل',            hi: 'विश्लेषक' },
  'Toolkit':        { es: 'Kit de Herram.',  fr: 'Boîte à Outils',ar: 'حزمة أدوات',      hi: 'टूलकिट' },
  'Recorder':       { es: 'Grabadora',       fr: 'Enregistreur',  ar: 'مسجل',            hi: 'रिकॉर्डर' },
  'Converter':      { es: 'Convertidor',     fr: 'Convertisseur', ar: 'محول',            hi: 'कनवर्टर' },
  'Generator':      { es: 'Generador',       fr: 'Générateur',    ar: 'مولد',            hi: 'जेनरेटर' },
  'Mixer':          { es: 'Mezclador',       fr: 'Mixeur',        ar: 'خلاط',            hi: 'मिक्सर' },
  'Player':         { es: 'Reproductor',     fr: 'Lecteur',       ar: 'مشغل',            hi: 'प्लेयर' },
  'Tracker':        { es: 'Rastreador',      fr: 'Traqueur',      ar: 'متتبع',           hi: 'ट्रैकर' },
  'Manager':        { es: 'Gestor',          fr: 'Gestionnaire',  ar: 'مدير',            hi: 'मैनेजर' },
  'White Noise':    { es: 'Ruido Blanco',    fr: 'Bruit Blanc',   ar: 'ضوضاء بيضاء',     hi: 'व्हाइट नॉइज़' },
  'Writer':         { es: 'Escritor',        fr: 'Rédacteur',     ar: 'كاتب',            hi: 'लेखक' },
  'Form':           { es: 'Formulario',      fr: 'Formulaire',    ar: 'نموذج',           hi: 'फ़ॉर्म' },
  'Database':       { es: 'Base de Datos',   fr: 'Base de Données',ar: 'قاعدة بيانات',   hi: 'डेटाबेस' },
  'Data':           { es: 'Datos',           fr: 'Données',       ar: 'بيانات',          hi: 'डेटा' },
  'Editor':         { es: 'Editor',          fr: 'Éditeur',       ar: 'محرر',            hi: 'एडिटर' },
  'Uncopy':         { es: 'Anti-Copia',      fr: 'Anti-Copie',    ar: 'مضاد للنسخ',      hi: 'अनकॉपी' },
  'Ink':            { es: 'Tinta',           fr: 'Encre',         ar: 'حبر',             hi: 'स्याही' },
  'Diff':           { es: 'Comparar',        fr: 'Comparaison',   ar: 'مقارنة',          hi: 'डिफ' },
  'Photo Triage':   { es: 'Tri de Fotos',    fr: 'Tri Photos',    ar: 'فرز الصور',       hi: 'फोटो ट्राइज' },
  'Studio':         { es: 'Estudio',         fr: 'Studio',        ar: 'استوديو',         hi: 'स्टूडियो' },
  'Suite':          { es: 'Suite',           fr: 'Suite',         ar: 'مجموعة متكاملة',  hi: 'सूट' },
  'App':            { es: 'App',             fr: 'App',           ar: 'تطبيق',           hi: 'ऐप' },
  '3D':             { es: '3D',              fr: '3D',            ar: 'ثلاثي الأبعاد',   hi: '3D' },
  'E-commerce':     { es: 'Comercio Electrón.',fr: 'E-commerce',   ar: 'التجارة الإلكتر.',hi: 'ई-कॉमर्स' },
  'Travel':         { es: 'Viajes',          fr: 'Voyages',       ar: 'سفر',             hi: 'यात्रा' },
  'Food':           { es: 'Comida',          fr: 'Cuisine',       ar: 'طعام',            hi: 'खाना' },
  'Social':         { es: 'Redes Sociales',  fr: 'Réseaux Soc.',  ar: 'وسائل التواصل',   hi: 'सोशल' },
  'Programming':    { es: 'Programación',    fr: 'Programmation', ar: 'برمجة',           hi: 'प्रोग्रामिंग' },
  'Sports':         { es: 'Deportes',        fr: 'Sports',        ar: 'رياضة',           hi: 'खेल' },
  'Fitness':        { es: 'Fitness',         fr: 'Fitness',       ar: 'لياقة بدنية',     hi: 'फिटनेस' },
  'Map':            { es: 'Mapa',            fr: 'Carte',         ar: 'خريطة',           hi: 'नक्शा' },
  'Payment':        { es: 'Pagos',           fr: 'Paiements',     ar: 'المدفوعات',       hi: 'भुगतान' },
  'Chat':           { es: 'Chat',            fr: 'Chat',          ar: 'دردشة',           hi: 'चैट' },
  'Accounting':     { es: 'Contabilidad',    fr: 'Comptabilité',  ar: 'محاسبة',          hi: 'अकाउंटिंग' },
  'Health':         { es: 'Salud',           fr: 'Santé',         ar: 'صحة',             hi: 'स्वास्थ्य' },
  'Collaboration':  { es: 'Colaboración',    fr: 'Collaboration', ar: 'تعاون',           hi: 'सहयोग' },
  'Automotive':     { es: 'Automoción',      fr: 'Automobile',    ar: 'سيارات',          hi: 'ऑटोमोटिव' },
  'Coin':           { es: 'Criptomoneda',    fr: 'Crypto',        ar: 'عملة رقمية',      hi: 'क्रिप्टो' },
  'Bmi':            { es: 'IMC',             fr: 'IMC',           ar: 'كتلة الجسم',      hi: 'BMI' },
  'Forecast':       { es: 'Pronóstico',      fr: 'Prévisions',    ar: 'توقعات',          hi: 'पूर्वानुमान' },
  'Kuma':           { es: 'Kuma',            fr: 'Kuma',          ar: 'كوما',            hi: 'कुमा' },
  'Desktop':        { es: 'Escritorio',      fr: 'Bureau',        ar: 'سطح المكتب',      hi: 'डेस्कटॉप' },
  'Diagram':        { es: 'Diagrama',        fr: 'Diagramme',     ar: 'مخطط',            hi: 'डायग्राम' },
  'Reader':         { es: 'Lector',          fr: 'Lecteur',       ar: 'قارئ',            hi: 'रीडर' },
  'Logs':           { es: 'Registros',       fr: 'Journaux',      ar: 'سجلات',           hi: 'लॉग्स' },
  'Visualization':  { es: 'Visualización',   fr: 'Visualisation', ar: 'تصور مرئي',       hi: 'विज़ुअलाइज़ेशन' },
  'Alerts':         { es: 'Alertas',         fr: 'Alertes',       ar: 'تنبيهات',         hi: 'अलर्ट' },
  'Status':         { es: 'Estado',          fr: 'Statut',        ar: 'الحالة',          hi: 'स्टेटस' },
  'WordPress':      { es: 'WordPress',       fr: 'WordPress',     ar: 'ووردبريس',        hi: 'वर्डप्रेस' },
  'B2B':            { es: 'B2B',             fr: 'B2B',           ar: 'الأعمال',         hi: 'बी2बी' },
  'Retail':         { es: 'Minorista',       fr: 'Vente au Détail',ar: 'تجزئة',           hi: 'रिटेल' },
  'Seller':         { es: 'Vendedor',        fr: 'Vendeur',       ar: 'بائع',            hi: 'सेलर' },
  'Auction':        { es: 'Subasta',         fr: 'Enchère',       ar: 'مزاد',            hi: 'नीलामी' },
  'Handcraft':      { es: 'Artesanía',       fr: 'Artisanat',     ar: 'حرف يدوية',       hi: 'हैंडक्राफ्ट' },
  'Email':          { es: 'Correo',          fr: 'Email',         ar: 'بريد إلكتروني',  hi: 'ईमेल' },
  'Marketing':      { es: 'Marketing',       fr: 'Marketing',     ar: 'تسويق',           hi: 'मार्केटिंग' },
  'SEO':            { es: 'SEO',             fr: 'SEO',           ar: 'تحسين محركات',   hi: 'SEO' },
  'Backlinks':      { es: 'Enlaces',         fr: 'Liens Retours', ar: 'روابط خلفية',     hi: 'बैकलिंक्स' },
  'Analytics':      { es: 'Analítica',       fr: 'Analytique',    ar: 'تحليلات',         hi: 'एनालिटिक्स' },
  'Heatmap':        { es: 'Mapa de Calor',   fr: 'Carte de Chaleur',ar: 'خريطة حرارية',   hi: 'हीटमैप' },
  'Product':        { es: 'Producto',        fr: 'Produit',       ar: 'منتج',            hi: 'प्रोडक्ट' },
  'Instagram':      { es: 'Instagram',       fr: 'Instagram',     ar: 'إنستغرام',        hi: 'इंस्टाग्राम' },
  'Twitter':        { es: 'Twitter',         fr: 'Twitter',       ar: 'تويتر',           hi: 'ट्विटर' },
  'Business':       { es: 'Negocios',        fr: 'Business',      ar: 'أعمال تجارية',    hi: 'बिज़नेस' },
  'Support':        { es: 'Soporte',         fr: 'Support',       ar: 'دعم',             hi: 'सपोर्ट' },
  'Hr':             { es: 'RRHH',            fr: 'RH',            ar: 'الموارد البشرية', hi: 'एचआर' },
  'Courses':        { es: 'Cursos',          fr: 'Cours',         ar: 'دورات تدريبية',  hi: 'कोर्स' },
  'Pro':            { es: 'Pro',             fr: 'Pro',           ar: 'محترف',           hi: 'प्रो' },
  'Service':        { es: 'Servicio',        fr: 'Service',       ar: 'خدمة',            hi: 'सर्विस' },
  'Live':           { es: 'En Vivo',         fr: 'Direct',        ar: 'مباشر',           hi: 'लाइव' },
  'Personal':       { es: 'Personal',        fr: 'Personnel',     ar: 'شخصي',            hi: 'पर्सनल' },
  'Budget':         { es: 'Presupuesto',     fr: 'Budget',        ar: 'الميزانية',       hi: 'बजट' },
};

// ============================================================
// B. 纯功能词（无品牌）name 的整串翻译
//    格式: { 'Full Name': {es, fr, ar, hi } }
// ============================================================
const FULLNAME_DICT = {
  'Background Remover':  { es: 'Quitar Fondo',      fr: 'Supprimer l\'Arrière-plan', ar: 'إزالة الخلفية',       hi: 'बैकग्राउंड हटाना' },
  '163 News':            { es: '163 Noticias',      fr: '163 Actualités',   ar: 'أخبار 163',        hi: '163 समाचार' },
  'Base64 Encoder':      { es: 'Codificador Base64',fr: 'Encodeur Base64',  ar: 'مشفر Base64',      hi: 'बेस64 एनकोडर' },
  'URL Encoder':         { es: 'Codificador URL',   fr: 'Encodeur URL',     ar: 'مشفر روابط',       hi: 'URL एनकोडर' },
  'Remove Music':        { es: 'Quitar Música',     fr: 'Retirer la Musique',ar: 'إزالة الموسيقى',  hi: 'संगीत हटाना' },
  'Code Screenshots':    { es: 'Capturas Código',   fr: 'Captures de Code', ar: 'لقطات أكواد',      hi: 'कोड स्क्रीनशॉट' },
  'Code Shots':          { es: 'Fotos de Código',   fr: 'Shots Code',       ar: 'لقطات أكواد',      hi: 'कोड शॉट्स' },
  'Background Mixer':    { es: 'Mezcla Ruido',      fr: 'Mixeur d\'Ambiance',ar: 'خلاط الخلفيات',   hi: 'बैकग्राउंड मिक्सर' },
  'Skill Matrix':        { es: 'Matriz Habilidades',fr: 'Matrice Compéten.',ar: 'مصفوفة المهارات',  hi: 'कौशल मैट्रिक्स' },
  'Data Exporter':       { es: 'Exportar Datos',    fr: 'Export. Données',  ar: 'تصدير البيانات',  hi: 'डेटा निर्यातकर्ता' },
  'No-Code Builder':     { es: 'Constructor Visual',fr: 'Constructeur No-Code',ar: 'منشئ بدون برمجة',hi: 'नो-कोड बिल्डर' },
  'Launches':            { es: 'Lanzamientos',      fr: 'Lancements',       ar: 'إطلاقات',         hi: 'लॉन्च' },
  'Template Gallery':    { es: 'Galería Plantillas',fr: 'Galerie Modèles',  ar: 'معرض القوالب',    hi: 'टेम्पलेट गैलरी' },
  'Creative Portfolios': { es: 'Portafolios Creat.',fr: 'Portfolio Créatif',ar: 'محافظ إبداعية',   hi: 'क्रिएटिव पोर्टफोलियो' },
  'Design Inspiration':  { es: 'Inspiración Diseño',fr: 'Inspiration Design',ar: 'إلهام التصميم',  hi: 'डिज़ाइन इंस्पिरेशन' },
  'Community Files':     { es: 'Archivos Comunidad',fr: 'Fichiers Communau.',ar: 'ملفات المجتمع',  hi: 'कम्युनिटी फ़ाइलें' },
  'Frontend Playground': { es: 'Zona Pruebas Front.',fr: 'Bac à Sable Web', ar: 'ملعب الواجهات',   hi: 'फ्रंटएंड प्लेग्राउंड' },
  'Dreamy Code Shots':   { es: 'Capturas Ensueño',  fr: 'Capt. Rêveuses',   ar: 'لقطات أحلامية',   hi: 'सुंदर कोड शॉट्स' },
  'Annotation App':      { es: 'Anotaciones PDF',   fr: 'Annotateur PDF',   ar: 'تطبيق التعليق',   hi: 'एनोटेशन ऐप' },
  'Swiss Knife':         { es: 'Navaja Suiza',      fr: 'Couteau Suisse',   ar: 'سكين سويسري',     hi: 'स्विस नाइफ' },
  'Bilingual Subtitles': { es: 'Subtítulos Bilingü.',fr: 'Sous-Titres Biling.',ar: 'ترجمة مزدوجة', hi: 'द्विभाषी सबटाइटल' },
  'English Checker':     { es: 'Corrector Inglés',  fr: 'Correct. Anglais',  ar: 'مدقق إنجليزي',    hi: 'अंग्रेज़ी जाँचकर्ता' },
  'Spaced Flashcards':   { es: 'Tarjetas Espaciadas',fr: 'Répétition Espacée',ar: 'بطاقات متباعدة', hi: 'अंतराल फ्लैशकार्ड' },
  'Bi-Directional Notes':{ es: 'Notas Bidirecc.',   fr: 'Notes Bidirectionn.',ar: 'ملاحظات ثنائية الاتجاه',hi:'द्वि-दिशात्मक नोट्स'},
  'Knowledge Base':      { es: 'Base Conocimiento', fr: 'Base Connaissances',ar: 'قاعدة المعرفة',   hi: 'नॉलेज बेस' },
  'Phone Discipline':    { es: 'Disciplina Móvil',  fr: 'Discipline Téléph.',ar: 'انضباط الهاتف',   hi: 'फ़ोन अनुशासन' },
  'Background Mixer':    { es: 'Mezclador Ambiente',fr: 'Mixeur d\'Ambiance',ar: 'خلاط الخلفية',    hi: 'बैकग्राउंड मिक्सर' },
  'Focus White Noise':   { es: 'Ruido Blanco Enfoq.',fr: 'Bruit Blanc Focus',ar: 'ضوضاء بيضاء للتركيز', hi:'फोकस व्हाइट नॉइज़' },
  'Unified Skill Track': { es: 'Rastreo Habilidades',fr: 'Suivi Compétences',ar: 'تتبع مهارات',      hi: 'एकीकृत कौशल ट्रैक' },
  'University Courses':  { es: 'Cursos Universit.', fr: 'Cours Universitaires',ar: 'كورس جامعي',     hi: 'विश्वविद्यालय पाठ्यक्रम' },
  'Job Interview Sim.':  { es: 'Simulador Entrev.', fr: 'Simul. Entretien',  ar: 'محاكاة مقابلة',   hi: 'जॉब इंटरव्यू सिम्युलेटर' },
  'ATS-Friendly Resume': { es: 'CV Optimizado ATS', fr: 'CV Optimisé ATS',   ar: 'سيرة متوافقة ATS',hi: 'ATS-अनुकूल बायोडेटा' },
  'Freelance Writing':   { es: 'Redacción Freela.', fr: 'Rédaction Indépen.',ar: 'كتابة مستقلة',    hi: 'फ्रीलांस राइटिंग' },
  'Business Name Ideas': { es: 'Ideas Nombre Empr.',fr: 'Idées Nom Entrepr.',ar: 'أفكار اسم مشروع',hi: 'बिज़नेस नाम आइडिया' },
  'Personality Tests':   { es: 'Test Personalidad', fr: 'Tests Personnalité',ar: 'اختبارات شخصية',  hi: 'पर्सनालिटी टेस्ट' },
  'Competitor Analysis': { es: 'Análisis Compet.',  fr: 'Analyse Concurr.',  ar: 'تحليل المنافسين', hi: 'प्रतिद्वंद्वी विश्लेषण' },
  'Trademark Check':     { es: 'Verificar Marca',   fr: 'Vérif. Marque',     ar: 'فحص العلامات',    hi: 'ट्रेडमार्क जाँच' },
  'Domain Name Ideas':   { es: 'Ideas Dominio',     fr: 'Idées Nom Domaine', ar: 'أفكار نطاق',      hi: 'डोमेन नाम आइडिया' },
  'Brand Color Palette': { es: 'Paleta Colores Mar.',fr: 'Palette Couleurs', ar: 'لوحة ألوان العلامة',hi: 'ब्रैंड रंग पैलेट' },
  'Stock Market Guide':  { es: 'Guía Bolsa',        fr: 'Guide Boursier',    ar: 'دليل سوق الأسهم', hi: 'शेयर बाज़ार गाइड' },
  'Freelance Rate Calc.':{ es: 'Calc. Tarifas Freel.',fr: 'Calc. Tarif Indé.',ar: 'حساب أسعار المستقلين',hi:'फ्रीलांस रेट कैलक' },
  'Time Tracker':        { es: 'Rastreador Tiempo', fr: 'Traqueur de Temps', ar: 'متتبع الوقت',     hi: 'टाइम ट्रैकर' },
  'Spending Tracking':   { es: 'Gasto Mensual',     fr: 'Suivi Dépenses',    ar: 'تتبع الإنفاق',    hi: 'खर्च ट्रैकिंग' },
  'Invest Tracking':     { es: 'Cartera Inversión', fr: 'Suivi Invest.',     ar: 'تتبع الاستثمار',  hi: 'निवेश ट्रैकिंग' },
  'Trip Budgeting':      { es: 'Presupuesto Viaje', fr: 'Budget Voyage',     ar: 'ميزانية السفر',   hi: 'यात्रा बजट' },
  'Budgeting Couple':    { es: 'Presupuesto Pareja',fr: 'Budget à Deux',     ar: 'ميزانية زوجية',   hi: 'कपल बजटिंग' },
  'Smart Grocery List':  { es: 'Lista Compra Inteli.',fr: 'Liste Courses Int.',ar: 'قائمة تسوق ذكية',hi:'स्मार्ट किराना सूची' },
  'Mileage Deductions':  { es: 'Deduc. Kilometraje',fr: 'Déduct. Kilométrage',ar: 'خصم الأميال',     hi: 'माइलेज कटौती' },
  'Tax Checklist Simpl.':{ es: 'Checklist Impuestos',fr: 'Checklist Impôts',  ar: 'قائمة ضرائب',     hi: 'कर चेकलिस्ट' },
  'Rent & Utility Sp.':  { es: 'Alquiler y Serv.',  fr: 'Loyer et Services', ar: 'إيجار ومرافق',    hi: 'किराया और यूटिलिटी' },
  'Shared Bill Splitt.': { es: 'Dividir Cuentas',   fr: 'Partage Factures',  ar: 'تقسيم الفواتير',  hi: 'साझा बिल बँटवारा' },
  'Currency Converter':  { es: 'Convertidor Divisas',fr: 'Convertisseur Dev.',ar: 'محلل عملات',      hi: 'मुद्रा परिवर्तक' },
  'Unit Converter':      { es: 'Convertidor Unid.', fr: 'Convertisseur Unité',ar: 'محول الوحدات',    hi: 'इकाई कनवर्टर' },
  'Color Space Convert.':{ es: 'Convertidor Color', fr: 'Convert. Couleur',  ar: 'تحويل الألوان',    hi: 'कलर स्पेस कनवर्टर' },
  'Markdown Convert':    { es: 'Convertidor Markdown',fr: 'Convert. Markdown',ar: 'محول ماركداون',  hi: 'मार्कडाउन कनवर्टर' },
  'Epoch & Unix Conver.':{ es: 'Convertidor Unix',  fr: 'Convert. Unix',     ar: 'محول يونكس',      hi: 'यूनिक्स कनवर्टर' },
  'Data Generate':       { es: 'Generar Datos',     fr: 'Générer Données',   ar: 'توليد بيانات',    hi: 'डेटा जेनरेट' },
  'Lorem Ipsum':         { es: 'Lorem Ipsum',       fr: 'Lorem Ipsum',       ar: 'لوريم إيبسوم',    hi: 'लोरेम इप्सम' },
  'Passphrase Generate': { es: 'Generar Contraseña',fr: 'Générateur Pass.',  ar: 'مولد كلمة المرور', hi: 'पासफ़्रेज़ जेनरेटर' },
  'QR & Barcode Scan':   { es: 'Lector QR / C.Barr.',fr: 'Lect. QR / Code-B.',ar: 'قارئ QR وباركود', hi: 'QR और बारकोड स्कैन' },
  'HTML Character Enti.':{ es: 'Entidades HTML',    fr: 'Entités HTML',      ar: 'رموز HTML',       hi: 'HTML कैरेक्टर एंटिटी' },
  'Hash Generator':      { es: 'Generador Hash',    fr: 'Générateur Hash',   ar: 'مولد هاش',        hi: 'हैश जेनरेटर' },
  'UUID Generate':       { es: 'Generar UUID',      fr: 'Générateur UUID',   ar: 'مولد UUID',       hi: 'UUID जेनरेटर' },
  'Random Generate':     { es: 'Aleatorio',         fr: 'Aléatoire',         ar: 'عشوائي',          hi: 'रैंडम जेनरेटर' },
  'Password Strength T.':{ es: 'Prueba Fortaleza',  fr: 'Test Force MDP',    ar: 'اختبار قوة كلمة المرور', hi: 'पासवर्ड स्ट्रेंथ टेस्ट' },
  'Regex Tester':        { es: 'Pruebas Regex',     fr: 'Testeur Regex',     ar: 'مختبر Regex',     hi: 'रीजेक्स टेस्टर' },
  'Cron Expression Gen.':{ es: 'Generar Cron',      fr: 'Générateur Cron',   ar: 'مولد كرون',       hi: 'क्रॉन जेनरेटर' },
  'Minify & Compress':   { es: 'Minificar Comp.',   fr: 'Minifier Comp.',    ar: 'تصغير وضغط',      hi: 'मिनिफाई और कंप्रेस' },
  'HTML/CSS/JS Formatt.':{ es: 'Formatear Web',     fr: 'Formateur Web',     ar: 'تنسيق الويب',     hi: 'HTML/CSS/JS फ़ॉर्मेटर' },
  'Image to Base64':     { es: 'Imagen a Base64',   fr: 'Image vers Base64', ar: 'صورة إلى Base64', hi: 'इमेज → Base64' },
  'Image Compression':   { es: 'Comprimir Imagen',  fr: 'Compresser Image',  ar: 'ضغط الصور',       hi: 'इमेज कंप्रेशन' },
  'Favicon Generator':   { es: 'Generar Favicon',   fr: 'Générateur Fav.',   ar: 'مولد فافيكون',    hi: 'फ़ेविकॉन जेनरेटर' },
  'Pixel & Retina B.':   { es: 'Píxeles Perfectos', fr: 'Pixels Rétina',     ar: 'بكسل ريتينا',     hi: 'पिक्सल और रेटिना' },
  'SVG Optimizer':       { es: 'Optimizar SVG',     fr: 'Optimiseur SVG',    ar: 'محسن SVG',        hi: 'SVG ऑप्टिमाइज़र' },
  'SVG & Vector Ed.':    { es: 'Editor SVG Vector', fr: 'Éditeur Vecteur',   ar: 'محرر SVG',         hi: 'SVG और वेक्टर एडिटर' },
  'Image Background Re.':{ es: 'Quitar Fondo Img.', fr: 'Supp. Arrière-plan',ar: 'إزالة خلفية الصورة',hi: 'इमेज बैकग्राउंड हटाना' },
  'Batch Watermark':     { es: 'Marca de Agua Lot.',fr: 'Filigrane par Lot', ar: 'علامة مائية جماعية', hi: 'बैच वॉटरमार्क' },
  'Picture in Picture':  { es: 'Imagen en Imagen',  fr: 'Image dans Image',  ar: 'صورة ضمن صورة',   hi: 'पिक्चर इन पिक्चर' },
  'Shortcut Key Find.':  { es: 'Atajos de Teclado', fr: 'Raccourcis Clavier',ar: 'اختصارات لوحة المفاتيح', hi: 'शॉर्टकट की खोज' },
  'Color Picker Eye':    { es: 'Cuentagotas Color', fr: 'Pipette Couleur',   ar: 'ماصق ألوان',      hi: 'कलर पिकर' },
  'PDF Cloud China':     { es: 'PDF en China',      fr: 'PDF Cloud Chine',   ar: 'خدمة PDF صينية',  hi: 'PDF चाइना क्लाउड' },
  'Annotator PDF':       { es: 'Anotador PDF',      fr: 'Annotateur PDF',    ar: 'محرر PDF',        hi: 'PDF एनोटेटर' },
  'OCR Text Recogn.':    { es: 'OCR Reconocer',     fr: 'OCR Reconnaissance',ar: 'التعرف الضوئي',   hi: 'OCR टेक्स्ट पहचान' },
  'PDF Sign':            { es: 'Firmar PDF',        fr: 'Signer PDF',        ar: 'توقيع PDF',       hi: 'PDF साइन' },
  'PDF Organizer':       { es: 'Organizador PDF',   fr: 'Organisateur PDF',  ar: 'منظم PDF',        hi: 'PDF ऑर्गनाइज़र' },
  'PDF to Word / Excel': { es: 'PDF a Word Excel',  fr: 'PDF ⇄ Word Excel',  ar: 'PDF ⇄ وورد اكسل', hi: 'PDF ⇄ वर्ड/एक्सेल' },
  'Image Converter':     { es: 'Convertidor Img.',  fr: 'Convertir Images',  ar: 'محول الصور',      hi: 'इमेज कनवर्टर' },
  'Video Converter':     { es: 'Convertidor Vídeo', fr: 'Convertir Vidéo',   ar: 'محول الفيديو',    hi: 'वीडियो कनवर्टर' },
  'Audio Editor':        { es: 'Editor Audio',      fr: 'Éditeur Audio',     ar: 'محرر الصوت',      hi: 'ऑडियो एडिटर' },
  'Audio & Video Conv.': { es: 'Conv. Audio Vídeo', fr: 'Conv. Audio Vidéo', ar: 'تحويل صوت وفيديو', hi: 'ऑडियो वीडियो कनवर्टर' },
  'Audio Merger':        { es: 'Unir Audio',        fr: 'Fusionner Audio',   ar: 'دمج الصوت',       hi: 'ऑडियो मर्जर' },
  'Audio Trim':          { es: 'Recortar Audio',    fr: 'Découper Audio',    ar: 'قص الصوت',        hi: 'ऑडियो ट्रिम' },
  'Audio Extract':       { es: 'Extraer Audio',     fr: 'Extraire Audio',    ar: 'استخراج الصوت',   hi: 'ऑडियो एक्सट्रैक्ट' },
  'Speed Adjust':        { es: 'Ajustar Velocidad', fr: 'Réglage Vitesse',   ar: 'ضبط السرعة',       hi: 'स्पीड एडजस्ट' },
  'GIF Maker':           { es: 'Crear GIF',         fr: 'Créateur GIF',      ar: 'صانع GIF',         hi: 'GIF मेकर' },
  'Face Swap Video':     { es: 'Cambio Cara Vid.',  fr: 'Échange Visage',    ar: 'تبديل الوجوه في الفيديو', hi: 'फेस स्वैप वीडियो' },
  'Auto Subtitle':       { es: 'Subtítulos Aut.',   fr: 'Sous-Titres Auto',  ar: 'ترجمة تلقائية',    hi: 'ऑटो सबटाइटल' },
  'Video Teleprompter':  { es: 'Teleprompter Vid.', fr: 'Téléprompteur',     ar: 'تيليبرومبتر',      hi: 'वीडियो टेलीप्रॉम्प्टर' },
  'AI Remove Music':     { es: 'Quitar Audio IA',   fr: 'Séparer Audio IA',  ar: 'إزالة الموسيقى ذكاء',hi:'AI म्यूज़िक हटाना' },
  'Green Screen Rem.':   { es: 'Quitar Fondo Verde',fr: 'Supp. Fond Vert',   ar: 'إزالة الخلفية الخضراء',hi: 'ग्रीन स्क्रीन हटाना'},
  'Video Stabilizer':    { es: 'Estabilizar Vídeo', fr: 'Stabil. Vidéo',     ar: 'تثبيت الفيديو',    hi: 'वीडियो स्टेबलाइज़र' },
  'Audio Restoration':   { es: 'Restaurar Audio',   fr: 'Restaurer Audio',   ar: 'استعادة الصوت',    hi: 'ऑडियो रिस्टोरेशन' },
  'AI Subtitle Transl.': { es: 'Trad. Subtítulos IA',fr: 'Trad. Sous-Titres IA', ar: 'ترجمة ذكاء اصطناعي', hi:'AI सबटाइटल अनुवाद' },
  'AIGC Tools Hub':      { es: 'Centro IA',         fr: 'Hub Outils IA',     ar: 'مركز أدوات ذكاء',  hi: 'AIGC टूल्स हब' },
  'Chatbot Hub':         { es: 'Centro Chatbots',   fr: 'Hub Chatbots',      ar: 'مركز الدردشات',    hi: 'चैटबॉट हब' },
  'AI Art Compare':      { es: 'Comparar Arte IA',  fr: 'Comparer Art IA',   ar: 'مقارنة فن ذكاء',   hi: 'AI आर्ट कंपेयर' },
  'AI Search':           { es: 'Buscador IA',       fr: 'Moteur IA',         ar: 'بحث ذكاء اصطناعي', hi: 'AI सर्च' },
  'Best GPTs':           { es: 'Top GPTs',          fr: 'Top GPTs',          ar: 'أفضل GPTs',       hi: 'सर्वश्रेष्ठ GPTs' },
  'LLM Leaderboard':     { es: 'Tabla LLM',         fr: 'Classement LLM',    ar: 'ترتيب النماذج',   hi: 'LLM लीडरबोर्ड' },
  'AI Detector':         { es: 'Detector IA',       fr: 'Détecteur IA',      ar: 'كاشف ذكاء',        hi: 'AI डिटेक्टर' },
  'Voice Cloning':       { es: 'Clonación Voz',     fr: 'Clonage Vocal',     ar: 'استنساخ الصوت',    hi: 'वॉइस क्लोनिंग' },
  'Text to Speech':      { es: 'Texto a Voz',       fr: 'Texte en Parole',   ar: 'نص إلى كلام',      hi: 'टेक्स्ट-टू-स्पीच' },
  'Lip Sync & Dubbing':  { es: 'Sincronía Labial',  fr: 'Sync Lèvres Doubl.',ar: 'مزامنة الشفتين',   hi: 'लिप सिंक और डबिंग' },
  'AI Talking Avatar':   { es: 'Avatar Parlante IA',fr: 'Avatar Parlant IA', ar: 'رافقة متحدثة',     hi: 'AI टॉकिंग अवतार' },
  'AI Presentation':     { es: 'Presentaciones IA', fr: 'Présentations IA',  ar: 'عروض تقديمية',     hi: 'AI प्रेजेंटेशन' },
  'AI Report Writer':    { es: 'Informe IA',        fr: 'Rédacteur Rapport', ar: 'كاتب تقارير',      hi: 'AI रिपोर्ट राइटर' },
  'Mind Map Generator':  { es: 'Mapas Mentales',    fr: 'Cartes Mentales',   ar: 'خرائط ذهنية',      hi: 'माइंड मैप जेनरेटर' },
  'AI SEO Optimizer':    { es: 'Optimizar SEO IA',  fr: 'Optimiser SEO IA',  ar: 'تحسين محركات الذكاء', hi: 'AI SEO ऑप्टिमाइज़र' },
  'Plagiarism Detector': { es: 'Detector Plagio',   fr: 'Détecteur Plagiat', ar: 'كاشف الانتحال',    hi: 'प्लैगरिज़्म डिटेक्टर' },
  'AI Paraphrasing':     { es: 'Parafrasear IA',    fr: 'Paraphraser IA',    ar: 'إعادة صياغة',      hi: 'AI पैराफ्रेज़िंग' },
  'Domain Age Check':    { es: 'Antigüedad Dominio',fr: 'Âge du Domaine',    ar: 'عمر النطاق',       hi: 'डोमेन आयु जाँच' },
  'Google Indexed Ch.':  { es: 'Índice Google',     fr: 'Indexation Google', ar: 'فهرسة جوجل',       hi: 'गूगल इंडेक्स चेक' },
  'Backlink Checker':    { es: 'Comprobar Enlaces', fr: 'Vérif. Backlinks',  ar: 'فحص الروابط',      hi: 'बैकलिंक जाँचकर्ता' },
  'SERP Preview':        { es: 'Vista Previa SERP', fr: 'Aperçu SERP',       ar: 'معاينة نتائج',     hi: 'SERP पूर्वावलोकन' },
  'Meta Tag Generator':  { es: 'Meta Etiquetas',    fr: 'Générateur Méta',   ar: 'مولد ميتا',        hi: 'मेटा टैग जेनरेटर' },
  'Redirect Checker':    { es: 'Redirecciones',     fr: 'Vérif. Redirections',ar: 'فحص إعادة التوجيه', hi: 'रीडायरेक्ट जाँचकर्ता' },
  'Mozilla Observatory': { es: 'Observatorio Moz.', fr: 'Observatoire Moz.', ar: 'مرصد موزيلا',      hi: 'मोज़िला ऑब्जर्वेटरी' },
  'Security Header T.':  { es: 'Headers Seguridad', fr: 'Test En-têtes',     ar: 'فحص رؤوس الأمان',  hi: 'सुरक्षा हेडर टेस्ट' },
  'SSL Decoder':         { es: 'Descodif. SSL',     fr: 'Décodeur SSL',      ar: 'فك تشفير SSL',     hi: 'SSL डिकोडर' },
  'TLS & Cipher T.':     { es: 'TLS y Cifrado',     fr: 'Test TLS',          ar: 'فحص TLS',          hi: 'TLS और सिफर टेस्ट' },
  'Broken Link Checker': { es: 'Enlaces Rotos',     fr: 'Liens Cassés',      ar: 'فحص الروابط الميتة',hi: 'टूटे लिंक जाँचकर्ता' },
  'Broken Redirect Ch.': { es: 'Redirecciones Rot.',fr: 'Redirections Cass.',ar: 'فحص إعادة التوجيه', hi: 'टूटी रीडायरेक्ट जाँच' },
  'What Is My UA':       { es: 'Mi User Agent',     fr: 'Mon User Agent',    ar: 'وكيل المستخدم',    hi: 'मेरा UA' },
  'SSL Checker':         { es: 'Verif. SSL',        fr: 'Vérificateur SSL',  ar: 'مدقق شهادة SSL',   hi: 'SSL जाँचकर्ता' },
  'DNS Traversal':       { es: 'Consulta DNS',      fr: 'Requête DNS',       ar: 'استعلام DNS',      hi: 'DNS ट्रैवर्सल' },
  'SSL Labs':            { es: 'Laboratorio SSL',   fr: 'SSL Labs',          ar: 'مختبر SSL',        hi: 'SSL लैब्स' },
  'Web Page Test':       { es: 'Prueba Página',     fr: 'Test Page',         ar: 'اختبار الصفحة',    hi: 'वेब पेज टेस्ट' },
  'Speed Test':          { es: 'Test Velocidad',    fr: 'Test Vitesse',      ar: 'اختبار السرعة',    hi: 'स्पीड टेस्ट' },
  'HTTP/2 Check':        { es: 'Verificar HTTP/2',  fr: 'Vérifier HTTP/2',   ar: 'فحص HTTP/2',       hi: 'HTTP/2 जाँच' },
  'HTTP Archive':        { es: 'Archivo HTTP',      fr: 'Archive HTTP',      ar: 'أرشيف HTTP',       hi: 'HTTP आर्काइव' },
  'Chrome UX Report':    { es: 'Informe Chrome UX', fr: 'Rapport Chrome UX', ar: 'تقرير Chrome UX',  hi: 'क्रोम UX रिपोर्ट' },
  'WordPress Plugins':   { es: 'Plugins WordPress', fr: 'Plugins WordPress', ar: 'إضافات ووردبريس',  hi: 'वर्डप्रेस प्लगइन' },
  'WordPress Theme Det.':{ es: 'Detectar Tema WP',  fr: 'Détecter Thème WP', ar: 'كشف ثيم ووردبريس', hi: 'वर्डप्रेस थीम डिटेक्टर' },
  'Shopify Theme Det.':  { es: 'Tema Shopify',      fr: 'Thème Shopify',     ar: 'ثيم شوبيفاي',      hi: 'शॉपिफ़ाई थीम डिटेक्टर' },
  'Tech Stack Detect':   { es: 'Detectar Stack',    fr: 'Détecter Stack',    ar: 'كشف التكنولوجيا',  hi: 'टेक स्टैक पहचान' },
  'Font Detector':       { es: 'Detectar Fuente',   fr: 'Détecter Police',   ar: 'كشف الخط',         hi: 'फ़ॉन्ट पहचान' },
  'Color Detector':      { es: 'Detectar Color',    fr: 'Détecter Couleur',  ar: 'كشف اللون',        hi: 'कलर पहचान' },
  'CSS Peeper':          { es: 'Inspector CSS',     fr: 'Pointeur CSS',      ar: 'مفتش CSS',         hi: 'CSS पीपर' },
  'SVG to Font':         { es: 'SVG a Fuente',      fr: 'SVG vers Police',   ar: 'SVG إلى خط',       hi: 'SVG → फ़ॉन्ट' },
  'Font Pairing':        { es: 'Combinar Fuentes',  fr: 'Associer Polices',  ar: 'اقتران الخطوط',    hi: 'फ़ॉन्ट पेयरिंग' },
  'Image Upscaler':      { es: 'Aumentar Resoluci.',fr: 'Agrandir Résolution', ar: 'دقة الصور',      hi: 'इमेज अपस्केलर' },
  'AI Background Gene.': { es: 'Fondos IA',         fr: 'Arrière-plans IA',  ar: 'خلفيات ذكاء اصطناعي', hi: 'AI बैकग्राउंड' },
  'Face Generator':      { es: 'Caras IA',          fr: 'Visages IA',        ar: 'وجوه مولدة',       hi: 'फेस जेनरेटर' },
  'Product Photo Studi.':{ es: 'Fotos Producto IA', fr: 'Photos Produit IA', ar: 'صور منتجات',       hi: 'प्रोडक्ट फोटो स्टूडियो' },
  'Color Extractor':     { es: 'Extraer Colores',   fr: 'Extraire Couleurs', ar: 'استخراج الألوان',  hi: 'कलर एक्सट्रैक्टर' },
  'Image Cartoonizer':   { es: 'Cartoon Imagen',    fr: 'Effet Cartoon',     ar: 'صورة كرتون',       hi: 'इमेज कार्टूनाइज़र' },
  'Free Stock Catalog':  { es: 'Catálogo Fotos',    fr: 'Catalogue Photos',  ar: 'كتالوج صور مجاني', hi: 'स्टॉक कैटलॉग' },
  'Remove Watermark':    { es: 'Quitar Marca Agua', fr: 'Retirer Filigrane', ar: 'إزالة العلامة',    hi: 'वॉटरमार्क हटाना' },
  'Image Editor AI':     { es: 'Editor Imagen IA',  fr: 'Éditeur Image IA',  ar: 'محرر الصور الذكي',  hi: 'इमेज एडिटर AI' },
  'AI Logo Generator':   { es: 'Generar Logotipo',  fr: 'Générateur Logo',   ar: 'مولد الشعار',      hi: 'AI लोगो जेनरेटर' },
  'Screenshot API':      { es: 'Captura de Web',    fr: 'Capture Web',       ar: 'لقطة شاشة للصفحات', hi: 'स्क्रीनशॉट API' },
  'Sitemap Generator':   { es: 'Generar Sitemap',   fr: 'Générateur Sitemap', ar: 'مولد الخريطة',     hi: 'साइटमैप जेनरेटर' },
  'Robots.txt Gener.':   { es: 'Robots.txt',        fr: 'Robots.txt',        ar: 'ملف الروبوتات',    hi: 'रोबोट्स.txt जेनरेटर' },
  'Hreflang Generator':  { es: 'Hreflang',          fr: 'Hreflang',          ar: 'Hreflang',         hi: 'Hreflang जेनरेटर' },
  'Structured Data Tes.':{ es: 'Datos Estructura.', fr: 'Données Structurées', ar: 'فحص البيانات',    hi: 'स्ट्रक्चर्ड डेटा' },
  'JSON-LD Playground':  { es: 'JSON-LD Pruebas',   fr: 'JSON-LD Bac à Sable', ar: 'تجربة JSON-LD',    hi: 'JSON-LD प्लेग्राउंड' },
  'Rich Results Test':   { es: 'Resultados Enriq.', fr: 'Test Résultats Ric.', ar: 'فحص النتائج',      hi: 'रिच रिजल्ट्स टेस्ट' },
  'Open Graph Debug':    { es: 'Depurar OpenGraph', fr: 'Débogage OpenGraph', ar: 'فحص OpenGraph',    hi: 'Open Graph डीबग' },
  'Twitter Card Valida.':{ es: 'Validar Twitter',   fr: 'Valid. Twitter',    ar: 'التحقق من تويتر',  hi: 'ट्विटर कार्ड वैलिडेशन' },
  'Image Sitemap Gen.':  { es: 'Sitemap Imágenes',  fr: 'Sitemap Images',    ar: 'خريطة الصور',      hi: 'इमेज साइटमैप' },
  'WebPage Size Analyz.':{ es: 'Tamaño Página',     fr: 'Poids de la Page',  ar: 'حجم الصفحة',       hi: 'वेबपेज साइज़ विश्लेषक' },
  'Word Counter':        { es: 'Contar Palabras',   fr: 'Compteur de Mots',  ar: 'عداد الكلمات',     hi: 'शब्द गणना' },
  'Reading Time Calc.':  { es: 'Tiempo Lectura',    fr: 'Temps de Lecture',  ar: 'وقت القراءة',      hi: 'रीडिंग टाइम कैलक' },
  'Case Converter':      { es: 'Cambiar Mayúsculas',fr: 'Convertir Casse',   ar: 'تحويل الحروف',     hi: 'केस कनवर्टर' },
  'Number to Words':     { es: 'Número a Texto',    fr: 'Nombre en Lettres', ar: 'الأرقام إلى نص',   hi: 'संख्या → शब्द' },
  'Title Capitalizatio.':{ es: 'Titulos',           fr: 'Titres',            ar: 'العناوين',         hi: 'शीर्षक कैपिटलाइज़ेशन' },
  'Text Cleaner':        { es: 'Limpiar Texto',     fr: 'Nettoyer Texte',    ar: 'تنظيف النص',       hi: 'टेक्स्ट क्लीनर' },
  'Diacritics Remover':  { es: 'Quitar Acentos',    fr: 'Retirer Accents',   ar: 'إزالة التشكيل',    hi: 'डायाक्रिटिक्स हटाना' },
  'List Tools':          { es: 'Utilidades Listas', fr: 'Outils Liste',      ar: 'أدوات القوائم',    hi: 'सूची उपकरण' },
  'Duplicate Removal':   { es: 'Quitar Duplicados', fr: 'Retirer Doublons',  ar: 'إزالة المكررات',   hi: 'डुप्लिकेट हटाना' },
  'Line Sorting':        { es: 'Ordenar Filas',     fr: 'Trier Lignes',      ar: 'فرز الأسطر',       hi: 'लाइन सॉर्टिंग' },
  'Diff Text Compare':   { es: 'Comparar Textos',   fr: 'Comparer Textes',   ar: 'مقارنة النصوص',    hi: 'टेक्स्ट डिफ' },
  'Empty Line Removal':  { es: 'Quitar Líneas Vac.',fr: 'Suppr. Lignes Vide', ar: 'إزالة السطور',     hi: 'खाली लाइन हटाना' },
  'Markdown to HTML':    { es: 'Markdown → HTML',   fr: 'Markdown → HTML',   ar: 'ماركداون إلى HTML', hi: 'मार्कडाउन → HTML' },
  'Markdown Preview':    { es: 'Vista Previa MD',   fr: 'Aperçu Markdown',   ar: 'معاينة Markdown',  hi: 'मार्कडाउन पूर्वावलोकन' },
  'Markdown Table Gen.': { es: 'Tablas Markdown',   fr: 'Tableaux Markdown', ar: 'جداول ماركداون',   hi: 'मार्कडाउन टेबल' },
  'HTML to Markdown':    { es: 'HTML → Markdown',   fr: 'HTML → Markdown',   ar: 'HTML إلى ماركداون', hi: 'HTML → मार्कडाउन' },
  'Table to Markdown':   { es: 'Tabla → Markdown',  fr: 'Tableau → Markdown', ar: 'جدول إلى ماركداون', hi: 'टेबल → मार्कडाउन' },
  'CSV to JSON':         { es: 'CSV → JSON',        fr: 'CSV → JSON',        ar: 'CSV → JSON',       hi: 'CSV → JSON' },
  'JSON to CSV':         { es: 'JSON → CSV',        fr: 'JSON → CSV',        ar: 'JSON → CSV',       hi: 'JSON → CSV' },
  'XML to JSON':         { es: 'XML → JSON',        fr: 'XML → JSON',        ar: 'XML → JSON',       hi: 'XML → JSON' },
  'JSON to XML':         { es: 'JSON → XML',        fr: 'JSON → XML',        ar: 'JSON → XML',       hi: 'JSON → XML' },
  'YAML to JSON':        { es: 'YAML → JSON',       fr: 'YAML → JSON',       ar: 'YAML → JSON',      hi: 'YAML → JSON' },
  'JSON to YAML':        { es: 'JSON → YAML',       fr: 'JSON → YAML',       ar: 'JSON → YAML',      hi: 'JSON → YAML' },
  'JSON Prettify':       { es: 'Embellecer JSON',   fr: 'Formatter JSON',    ar: 'تنسيق JSON',       hi: 'JSON प्रिटिफ़ाइ' },
  'SQL Formatter':       { es: 'Formatear SQL',     fr: 'Formateur SQL',     ar: 'تنسيق SQL',        hi: 'SQL फ़ॉर्मेटर' },
  'Base Converter':      { es: 'Convertir Base',    fr: 'Convertir Base',    ar: 'تحويل الأساس',     hi: 'बेस कनवर्टर' },
  'Age Calculator':      { es: 'Calc. Edad',        fr: 'Calc. Âge',         ar: 'حاسبة العمر',      hi: 'आयु कैलकुलेटर' },
  'Date Calculator':     { es: 'Calc. Fecha',       fr: 'Calc. Date',        ar: 'حاسبة التاريخ',    hi: 'दिनांक कैलकुलेटर' },
  'Time Calculator':     { es: 'Calc. Tiempo',      fr: 'Calc. Temps',       ar: 'حاسبة الوقت',      hi: 'समय कैलकुलेटर' },
  'Time Zone Converter': { es: 'Zonas Horarias',    fr: 'Fuseaux Horaires',  ar: 'المناطق الزمنية',  hi: 'टाइमज़ोन कनवर्टर' },
  'Countdown Calendar':  { es: 'Cuenta Regresiva',  fr: 'Compte à Rebours',  ar: 'عد تنازلي',        hi: 'काउंटडाउन कैलेंडर' },
  'Calendar Generator':  { es: 'Generar Calendario',fr: 'Générateur Calend.', ar: 'مولد التقويم',     hi: 'कैलेंडर जेनरेटर' },
  'Time Difference':     { es: 'Dif. Tiempo',       fr: 'Diff. Temps',       ar: 'فرق الوقت',        hi: 'समय अंतर' },
  'Standard Calculator': { es: 'Calculadora Estánd.',fr: 'Calculatrice',      ar: 'الآلة الحاسبة',    hi: 'स्टैंडर्ड कैलकुलेटर' },
  'Scientific Calcul.':  { es: 'Calculadora Cientí.',fr: 'Calc. Scientifique', ar: 'الحاسبة العلمية',  hi: 'साइंटिफिक कैलकुलेटर' },
  'Percentage Calcul.':  { es: 'Calc. Porcentaje',  fr: 'Calc. Pourcentage', ar: 'حاسبة النسبة',     hi: 'परसेंटेज कैलकुलेटर' },
  'Fraction Calcul.':    { es: 'Calc. Fracciones',  fr: 'Calc. Fractions',   ar: 'حاسبة الكسور',     hi: 'फ्रैक्शन कैलकुलेटर' },
  'Decimal  ↔  Fraction':{ es: 'Decimal ↔ Fracción',fr: 'Décimal ↔ Fraction',ar: 'عشري ↔ كسري',       hi: 'दशमलव ↔ फ्रैक्शन' },
  'Tip Calculator':      { es: 'Calc. Propina',     fr: 'Calc. Pourboire',   ar: 'حاسبة البقشيش',    hi: 'टिप कैलकुलेटर' },
  'Loan / Mortgage Cal': { es: 'Calc. Préstamos',   fr: 'Calc. Prêt Hyp.',   ar: 'حاسبة القروض',     hi: 'लोन/मॉर्टगेज कैलक' },
  'Compound Interest':   { es: 'Calc. Interés Comp.',fr: 'Int. Composé',      ar: 'الفائدة المركبة',  hi: 'चक्रवृद्धि ब्याज' },
  'Retirement Calcul.':  { es: 'Calc. Jubilación',  fr: 'Calc. Retraite',    ar: 'حاسبة التقاعد',    hi: 'रिटायरमेंट कैलकुलेटर' },
  'ROI Calculator':      { es: 'Calc. ROI',         fr: 'Calc. ROI',         ar: 'حاسبة العائد',      hi: 'ROI कैलकुलेटर' },
  'BMI Calculator':      { es: 'Calc. IMC',         fr: 'Calc. IMC',         ar: 'حاسبة كتلة الجسم', hi: 'BMI कैलकुलेटर' },
  'Ohm\'s Law Calc.':     { es: 'Ley de Ohm',       fr: 'Loi d\'Ohm',        ar: 'قانون أوم',        hi: 'ओम का नियम' },
  'Random Color':        { es: 'Color Aleatorio',   fr: 'Couleur Aléatoire', ar: 'لون عشوائي',       hi: 'रैंडम कलर' },
  'Color Converter':     { es: 'Convertir Color',   fr: 'Convert. Couleur',  ar: 'تحويل الألوان',     hi: 'कलर कनवर्टर' },
  'Color Contrast':      { es: 'Contraste Color',   fr: 'Contraste Couleur', ar: 'تباين الألوان',    hi: 'कलर कंट्रास्ट' },
  'Color Blender':       { es: 'Mezclar Colores',   fr: 'Mélanger Couleurs', ar: 'مزج الألوان',      hi: 'कलर ब्लेंडर' },
  'Color Shades & Tint': { es: 'Tonos de Color',    fr: 'Nuances Couleur',   ar: 'درجات الألوان',    hi: 'कलर शेड' },
  'Color Naming':        { es: 'Nombre del Color',  fr: 'Nom de Couleur',    ar: 'اسم اللون',        hi: 'कलर नेमिंग' },
  'Color Palette Gen.':  { es: 'Paleta de Colores', fr: 'Palette Couleurs',  ar: 'لوحة الألوان',     hi: 'कलर पैलेट जेनरेटर' },
  'Image Color Extract': { es: 'Extraer Paleta',    fr: 'Extraire Palette',  ar: 'استخراج الألوان',  hi: 'इमेज से रंग निकालना' },
  'Gradient Generator':  { es: 'Generar Gradiente', fr: 'Générateur Dégradé', ar: 'مولد التدرجات',    hi: 'ग्रेडिएंट जेनरेटर' },
  'Tailwind Shades':     { es: 'Tonos Tailwind',    fr: 'Nuances Tailwind',  ar: 'درجات Tailwind',   hi: 'टेलविंड शेड' },
  'Color Wheel':         { es: 'Rueda Cromática',   fr: 'Roue Chromatique',  ar: 'دائرة الألوان',    hi: 'कलर व्हील' },
  'CMYK Separation':     { es: 'Separación CMYK',   fr: 'Séparation CMYK',   ar: 'فصل CMYK',         hi: 'CMYK सेपरेशन' },
  'QR Code Generator':   { es: 'Generar QR',        fr: 'Générateur QR',     ar: 'مولد كيو آر',       hi: 'क्यूआर जेनरेटर' },
  'Barcode Generator':   { es: 'Generar Código Bar.',fr: 'Générateur Code-B.', ar: 'مولد الباركود',     hi: 'बारकोड जेनरेटर' },
  'Wi-Fi QR Generator':  { es: 'Wi-Fi QR',          fr: 'QR Wi-Fi',          ar: 'كيو آر واي فاي',    hi: 'Wi-Fi क्यूआर' },
  'vCard Generator':     { es: 'Tarjeta Virtual',   fr: 'Carte Virtuelle',   ar: 'بطاقة افتراضية',   hi: 'vCard जेनरेटर' },
  'YouTube Thumbnail D.':{ es: 'Miniatura YouTube', fr: 'Miniature YouTube', ar: 'صورة مصغرة يوتيوب', hi: 'YouTube थंबनेल' },
  'Twitter Video Down.': { es: 'Descarga Twitter',  fr: 'Télécharger Twitter',ar: 'تحميل تويتر',      hi: 'ट्विटर वीडियो' },
  'Instagram Download':  { es: 'Descargar Instagram',fr: 'Télécharger Insta.', ar: 'تحميل إنستغرام',   hi: 'इंस्टाग्राम डाउनलोड' },
  'Story Download':      { es: 'Descargar Historia',fr: 'Télécharger Stories', ar: 'تحميل ستوري',     hi: 'स्टोरी डाउनलोड' },
  'Privacy Policy Gen.': { es: 'Política Priv.',    fr: 'Politique Conf.',   ar: 'سياسة الخصوصية',   hi: 'प्राइवेसी पॉलिसी' },
  'Terms and Cond. Gen.':{ es: 'Términos y Cond.',  fr: 'Conditions Général.',ar: 'الشروط والأحكام',  hi: 'टर्म्स एंड कंडीशन' },
  'Disclaimer Generator':{ es: 'Descargo Responsa.',fr: 'Clause Non Respons.',ar: 'إخلاء المسؤولية',  hi: 'अस्वीकरण जेनरेटर' },
  'GDPR Cookie Consent': { es: 'Consentimiento Cookie', fr: 'Consentement Cookie', ar: 'ملفات تعريف الارتباط', hi: 'GDPR कुकी' },
  'DMCA Generator':      { es: 'Aviso DMCA',        fr: 'Avis DMCA',         ar: 'إشعار DMCA',       hi: 'DMCA जेनरेटर' },
  'Cloud Storage Calc.': { es: 'Coste Almacen.',    fr: 'Coût Stockage',     ar: 'تكلفة التخزين',    hi: 'क्लाउड स्टोरेज कैलक' },
  'CDN Pricing Compar.': { es: 'Comparativa CDN',   fr: 'Comparatif CDN',    ar: 'مقارنة CDN',       hi: 'CDN प्राइसिंग' },
  'Savings Calculator':  { es: 'Ahorro Cloud',      fr: 'Économies Cloud',   ar: 'توفير التكاليف',   hi: 'बचत कैलकुलेटर' },
  'Uptime Calculator':   { es: 'Disponibilidad',    fr: 'Taux de Disponib.', ar: 'وقت التشغيل',      hi: 'अपटाइम कैलकुलेटर' },
  'Data Transfer Calc.': { es: 'Transferencia Datos',fr: 'Transfert Données', ar: 'تحويل البيانات',   hi: 'डेटा ट्रांसफर कैलक' },
  'AWS Pricing':         { es: 'Precios AWS',       fr: 'Tarifs AWS',        ar: 'تسعير AWS',        hi: 'AWS प्राइसिंग' },
  'Cloud Carbon Calcula.':{ es: 'Huella Carbono',   fr: 'Empreinte Carbone', ar: 'بصمة الكربون',     hi: 'क्लाउड कार्बन कैलक' },
  'SEO Writing AI':      { es: 'Redact. SEO IA',    fr: 'Rédact. SEO IA',    ar: 'كتابة SEO',        hi: 'SEO राइटिंग AI' },
  'Instagram Hashtag G.':{ es: 'Etiquetas Insta.',  fr: 'Hashtags Instagram', ar: 'هاشتاغ إنستغرام',  hi: 'इंस्टाग्राम हैशटैग' },
  'Keyword Research':    { es: 'Investigar Palabras',fr: 'Mots-Clés',         ar: 'بحث الكلمات',      hi: 'कीवर्ड रिसर्च' },
  'YouTube SEO Tools':   { es: 'SEO para YouTube',  fr: 'SEO YouTube',       ar: 'تدوين يوتيوب',     hi: 'YouTube SEO' },
  'Email Finder':        { es: 'Buscar Correos',    fr: 'Trouver E-mail',    ar: 'البحث عن بريد',    hi: 'ईमेल फाइंडर' },
  'Email Verifier':      { es: 'Verificar Correo',  fr: 'Vérif. E-mail',     ar: 'تحقق البريد',      hi: 'ईमेल वेरिफायर' },
  'Cold Email Templat.': { es: 'Plantillas Frío',   fr: 'Modèles E-mail Fr.', ar: 'نموذج بريد بارد',  hi: 'कोल्ड ईमेल टेम्पलेट' },
  'A/B Test Significan.':{ es: 'Significancia A/B', fr: 'Signification A/B', ar: 'دلالة إحصائية A/B', hi: 'A/B सार्थकता' },
  'ARPU Calculator':     { es: 'Calc. ARPU',        fr: 'Calc. ARPU',        ar: 'حاسبة ARPU',       hi: 'ARPU कैलकुलेटर' },
  'Churn Rate Calc.':    { es: 'Calc. Rotación',    fr: 'Calc. Taux Attrit.', ar: 'معدل الدوران',     hi: 'चर्न रेट कैलकुलेटर' },
  'LTV Calculator':      { es: 'Calc. LTV',         fr: 'Calc. LTV',         ar: 'حاسبة القيمة',     hi: 'LTV कैलकुलेटर' },
  'Product Pricing Cal': { es: 'Calc. Precio Prod.',fr: 'Calc. Tarif Produit',ar: 'تسعير المنتجات',  hi: 'प्रोडक्ट प्राइसिंग' },
  'PayPal Fee Calcul.':  { es: 'Comisiones PayPal', fr: 'Frais PayPal',      ar: 'رسوم باي بال',     hi: 'PayPal फीस कैलक' },
  'Stripe Fee Calcul.':  { es: 'Comisiones Stripe', fr: 'Frais Stripe',      ar: 'رسوم سترايب',      hi: 'Stripe फीस कैलक' },
  'CCPA Opt-Out Gener.': { es: 'Exclusión CCPA',    fr: 'Opt-Out CCPA',      ar: 'انسحاب CCPA',      hi: 'CCPA ऑप्ट-आउट' },
  'Cookie Declaration':  { es: 'Declaración Cookie',fr: 'Déclaration Cookie', ar: 'إعلان ملفات تعريف', hi: 'कुकी डिक्लेरेशन' },
  'Non-Disclosure Agre.':{ es: 'Confidencialidad',  fr: 'Accord Confident.', ar: 'اتفاقية سرية',     hi: 'गोपनीयता समझौता' },
  'Invoice Generator':   { es: 'Generar Factura',   fr: 'Générateur Facture', ar: 'فواتير',           hi: 'इनवॉइस जेनरेटर' },
  'Receipt Generator':   { es: 'Generar Recibo',    fr: 'Générateur Reçu',   ar: 'إيصال',            hi: 'रिसीट जेनरेटर' },
  'Fake Address Gener.': { es: 'Dirección Falsa',   fr: 'Fausse Adresse',    ar: 'عنوان وهمي',       hi: 'नकली पता' },
  'Name Generator':      { es: 'Generar Nombres',   fr: 'Générateur Nom',    ar: 'مولد الأسماء',     hi: 'नाम जेनरेटर' },
  'Temporary Email':     { es: 'Correo Temp.',      fr: 'E-mail Temporaire', ar: 'بريد مؤقت',        hi: 'अस्थायी ईमेल' },
  'Disposable Phone #':  { es: 'Número Temp.',      fr: 'N° Temporaire',     ar: 'رقم مؤقت',         hi: 'डिस्पोज़ेबल नंबर' },
  'Work Permit Check':   { es: 'Permiso Laboral',   fr: 'Permis Travail',    ar: 'تصريح عمل',        hi: 'कार्य परमिट जाँच' },
  'Resume Tips':         { es: 'Consejos CV',       fr: 'Conseils CV',       ar: 'نصائح السيرة',     hi: 'बायोडेटा टिप्स' },
  'Interview Flashcard': { es: 'Tarjetas Entrev.',  fr: 'Cartes Entretien',  ar: 'بطاقات مقابلة',    hi: 'इंटरव्यू फ्लैशकार्ड' },
  'Salary Negotiation':  { es: 'Negociar Salario',  fr: 'Négocier Salaire',  ar: 'التفاوض الراتب',   hi: 'वेतन बातचीत' },
  'LinkedIn Optimize':   { es: 'Optimizar LinkedIn',fr: 'Optimiser LinkedIn', ar: 'تحسين لينكدإن',   hi: 'लिंक्डइन ऑप्टिमाइज़' },
  'Cover Letter AI':     { es: 'Carta Present. IA', fr: 'Lettre de Motiv. IA',ar: 'رسالة ترشيح',      hi: 'कवर लेटर AI' },
  'Salary Benchmark':    { es: 'Referencia Salarial',fr: 'Référence Salaire', ar: 'المرجعية الراتبية', hi: 'वेतन बेंचमार्क' },
  'Side Hustle Ideas':   { es: 'Ideas Ingreso Ext.',fr: 'Idées Revenu Compl.',ar: 'أفكار دخل إضافي',  hi: 'साइड हसल आइडिया' },
  'Freelance Contract G': { es: 'Contrato Freela.', fr: 'Contrat Indépen.',  ar: 'عقد مستقل',        hi: 'फ्रीलांस कॉन्ट्रैक्ट' },
  'Niche Validator':     { es: 'Validar Nicho',     fr: 'Valider Niche',     ar: 'التحقق من المجال',  hi: 'निच वैलिडेटर' },
  'Landing Page Copy.':  { es: 'Copy Landings',     fr: 'Copy Page d\'Att.',  ar: 'نص الصفحات',       hi: 'लैंडिंग पेज कॉपी' },
  'Elevator Pitch Gene.':{ es: 'Discurso Elevador', fr: 'Discours Ascenseur', ar: 'عرض تقديمي سريع',  hi: 'एलिवेटर पिच' },
  'Startup Valuation':   { es: 'Valoración Startu.',fr: 'Valorisation Start.',ar: 'تقييم الشركة الناشئة', hi: 'स्टार्टअप वैल्यूएशन' },
  'Pitch Deck Template': { es: 'Plantilla Pitch.',  fr: 'Pitch Deck',        ar: 'قالب العرض',       hi: 'पिच डेक टेम्पलेट' },
  'MVP Builder':         { es: 'Constructor MVP',   fr: 'Constructeur MVP',  ar: 'إنشاء MVP',         hi: 'MVP बिल्डर' },
  'Freelance Proposal G':{ es: 'Propuesta Freela.', fr: 'Proposition Indépen.', ar: 'اقتراح مستقل',   hi: 'फ्रीलांस प्रोपोज़ल' },
  'Content Calendar':    { es: 'Calendario Cont.',  fr: 'Calendrier Cont.',  ar: 'التقويم المحتوى',  hi: 'कंटेंट कैलेंडर' },
  'Headline Analyzer':   { es: 'Analizar Titulares',fr: 'Analyser Titres',   ar: 'تحليل العناوين',   hi: 'हेडलाइन विश्लेषक' },
  'Content Idea Brain.': { es: 'Lluvia Ideas Cont.',fr: 'Brainstorm Cont.',  ar: 'عصف ذهني محتوى',   hi: 'कंटेंट आइडिया' },
  'Readability Check':   { es: 'Comprob. Legib.',   fr: 'Test Lisibilité',   ar: 'اختبار القراءة',    hi: 'रीडेबिलिटी जाँच' },
  'Plagiarism Check':    { es: 'Detector Plagio',   fr: 'Détecteur Plagiat', ar: 'فحص الانتحال',     hi: 'प्लैगरिज़्म जाँच' },
  'SEO Meta Analyzer':   { es: 'Analizador SEO',    fr: 'Analyseur SEO',     ar: 'تحليل محركات',     hi: 'SEO मेटा विश्लेषक' },
  'YouTube Title & Thu.':{ es: 'Título y Miniatura',fr: 'Titre et Miniature', ar: 'عنوان ومصغرة',     hi: 'YouTube शीर्षक और थंबनेल' },
  'SEO Audit Report':    { es: 'Informe SEO',       fr: 'Rapport SEO',       ar: 'تقرير SEO',        hi: 'SEO ऑडिट रिपोर्ट' },
  'Keyword Clustering':  { es: 'Agrupar Palabras',  fr: 'Regrouper Mots',    ar: 'تجميع الكلمات',    hi: 'कीवर्ड क्लस्टरिंग' },
  'Competitor Content':  { es: 'Análisis Cont. Com.',fr: 'Cont. Concurren.', ar: 'تحليل المحتوى',    hi: 'प्रतिद्वंद्वी कंटेंट' },
  'Content Brief Gene.': { es: 'Resumen de Cont.',  fr: 'Brief Contenu',     ar: 'ملخص المحتوى',     hi: 'कंटेंट ब्रीफ़' },
  'Alt Text Generator':  { es: 'Texto Alternativo', fr: 'Texte Alternatif',  ar: 'النص البديل',      hi: 'ऑल्ट टेक्स्ट जेनरेटर' },
  'Brand Voice Analy.':  { es: 'Voz de la Marca',   fr: 'Voix de Marque',    ar: 'صوت العلامة',       hi: 'ब्रैंड वॉइस' },
  'Citation Builder':    { es: 'Construir Citas',   fr: 'Générateur Cit.',    ar: 'بناء الاستشهادات',  hi: 'उद्धरण बिल्डर' },
  'Reference Manager':   { es: 'Gest. Referencias', fr: 'Gest. Références',  ar: 'مدير المراجع',     hi: 'संदर्भ प्रबंधक' },
  'Literature Review A.': { es: 'Rev. Literaria IA',fr: 'Revue Litt. IA',    ar: 'مراجعة أدبية',     hi: 'साहित्य समीक्षा AI' },
  'Thesis Outline AI':   { es: 'Esquema Tesis IA',  fr: 'Plan Mémoire IA',   ar: 'مخطط أطروحة',      hi: 'थीसिस आउटलाइन AI' },
  'Paraphrasing Tool':   { es: 'Parafrasear',       fr: 'Paraphraser',       ar: 'إعادة الصياغة',    hi: 'पैराफ्रेज़िंग टूल' },
  'Proofreader Tool':    { es: 'Corrector',         fr: 'Correcteur',        ar: 'المصحح',           hi: 'प्रूफरीडर' },
  'Note Organization':   { es: 'Organizar Notas',   fr: 'Organiser Notes',   ar: 'ترتيب الملاحظات',  hi: 'नोट्स ऑर्गनाइज़ेशन' },
  'Focus Music':         { es: 'Música Enfoque',    fr: 'Musique Concentration', ar: 'موسيقى تركيز',   hi: 'फोकस संगीत' },
  'Pomodoro Timer':      { es: 'Temporizador Pom.', fr: 'Minuteur Pomodoro', ar: 'مؤقت بومودورو',    hi: 'पोमोडोरो टाइमर' },
  'Website Blocker':     { es: 'Bloqueador Web',    fr: 'Bloqueur Web',      ar: 'حظر المواقع',      hi: 'वेबसाइट ब्लॉकर' },
  'Project Time Tracker':{ es: 'Ges. Proyectos',    fr: 'Gest. de Projets',  ar: 'إدارة المشاريع',   hi: 'प्रोजेक्ट टाइम ट्रैकर' },
  'Kanban Board':        { es: 'Tablero Kanban',    fr: 'Tableau Kanban',    ar: 'لوحة كانبان',      hi: 'कैनबन बोर्ड' },
  'Meeting Scheduler':   { es: 'Agendar Reuniones', fr: 'Plan. Réunions',    ar: 'جدولة الاجتماعات',  hi: 'मीटिंग शेड्यूलर' },
  'Meeting Minutes AI':  { es: 'Actas Reunión IA',  fr: 'PV Réunion IA',     ar: 'محضر الاجتماع',     hi: 'मीटिंग मिनट्स AI' },
  'Habit Tracker':       { es: 'Seguimiento Hábit.',fr: 'Suivi Habitudes',   ar: 'تتبع العادات',     hi: 'आदत ट्रैकर' },
  'Water Reminder':      { es: 'Recordatorio Agua', fr: 'Rappel Eau',        ar: 'تذكير بالماء',     hi: 'पानी रिमाइंडर' },
  'Meal Planner':        { es: 'Plan Comidas',      fr: 'Plan Repas',        ar: 'تخطيط الوجبات',    hi: 'भोजन योजनाकार' },
  'Workout Generator':   { es: 'Plan Entrenamiento',fr: 'Plan Entraînement', ar: 'خطة تمرين',        hi: 'वर्कआउट जेनरेटर' },
  'Sleep Tracker':       { es: 'Seguimiento Sueño', fr: 'Suivi Sommeil',     ar: 'تتبع النوم',       hi: 'नींद ट्रैकर' },
  'Mood Tracker':        { es: 'Ánimo Diario',      fr: 'Humeur Quotidienne',ar: 'متابعة المزاج',    hi: 'मूड ट्रैकर' },
  'Screen Time Monitor': { es: 'Tiempo de Pantalla',fr: 'Temps Écran',       ar: 'وقت الشاشة',       hi: 'स्क्रीन टाइम मॉनिटर' },
  'Mind Journal':        { es: 'Diario Mental',     fr: 'Journal Intime',    ar: 'مفكرة ذهنية',      hi: 'माइंड जर्नल' },
  'Gratitude Journal':   { es: 'Diario Agradec.',  fr: 'Journal Gratitude', ar: 'مفكرة الشكر',      hi: 'धन्यवाद जर्नल' },
  'Budget Planner':      { es: 'Plan Presupuesto',  fr: 'Plan Budgétaire',   ar: 'ميزانية',          hi: 'बजट प्लानर' },
  'Expense Categorize':  { es: 'Categ. Gastos',     fr: 'Catégories Dépenses', ar: 'تصنيف المصاريف',  hi: 'खर्च वर्गीकरण' },
  'Savings Challenge':   { es: 'Reto Ahorro',       fr: 'Défi Épargne',      ar: 'تحدي الادخار',     hi: 'बचत चैलेंज' },
  'Net Worth Tracker':   { es: 'Patrimonio Neto',   fr: 'Patrimoine Net',    ar: 'صافي الثروة',      hi: 'नेट वर्थ ट्रैकर' },
  'Debt Snowball Cal.':  { es: 'Calc. Bola Nieve',  fr: 'Calc. Boule de Neig.', ar: 'كرة الثلج',       hi: 'डेट स्नोबॉल कैलक' },
  'Credit Score Simul.': { es: 'Simulador Crédito', fr: 'Simul. Crédit',     ar: 'محاكاة النقاط',    hi: 'क्रेडिट स्कोर सिम' },
  'Travel Itinerary AI': { es: 'Itinerario Viaje',  fr: 'Itinéraire IA',     ar: 'جدول السفر',       hi: 'यात्रा Itinerary AI' },
  'Packing List':        { es: 'Lista de Equipaje', fr: 'Liste Bagages',     ar: 'قائمة الحقائب',    hi: 'पैकिंग सूची' },
  'Flight Comparison':   { es: 'Comparar Vuelos',   fr: 'Comparateur Vols',  ar: 'مقارنة الرحلات',   hi: 'फ़्लाइट कंपेयरिज़न' },
  'Currency Travel Kit': { es: 'Kit Viaje Divisas', fr: 'Kit Devises Voyage', ar: 'حزمة العملة',      hi: 'ट्रैवल करेंसी किट' },
  'Local SIM Cards':     { es: 'Tarjetas SIM Loc.', fr: 'Cartes SIM Local',  ar: 'بطاقات SIM',       hi: 'स्थानीय सिम कार्ड' },
  'Travel Insurance Com':{ es: 'Comparar Seguros',  fr: 'Comparateur Assu.', ar: 'مقارنة التأمين',   hi: 'ट्रैवल इंश्योरेंस' },
  'Trip Cost Splitter':  { es: 'Dividir Gastos',    fr: 'Partager Dépenses', ar: 'تقسيم التكاليف',   hi: 'ट्रिप कॉस्ट बँटवारा' },
  'Visa & Passport Che.':{ es: 'Visado y Pasaporte',fr: 'Visa & Passeport',  ar: 'تأشيرة وجواز',     hi: 'वीज़ा और पासपोर्ट' },
  'Language Flashcards': { es: 'Tarjetas Idioma',   fr: 'Cartes Langues',    ar: 'بطاقات لغوية',     hi: 'लैंग्वेज फ्लैशकार्ड' },
  'Conversation Starte.':{ es: 'Iniciar Conversa.', fr: 'Début Conversati.', ar: 'بدء محادثة',       hi: 'बातचीत शुरुआत' },
  'Real-time Subtitle.': { es: 'Subtítulos en Viv.',fr: 'Sous-Titres Direct', ar: 'ترجمة مباشرة',     hi: 'रियल-टाइम सबटाइटल' },
  'Language Exchange Fi.':{ es: 'Compañero Idioma', fr: 'Partenaire Linguist.', ar: 'تبادل اللغة',     hi: 'लैंग्वेज एक्सचेंज' },
  'Culture Quiz':        { es: 'Quiz Cultural',     fr: 'Quiz Culturel',     ar: 'اختبار ثقافي',     hi: 'संस्कृति क्विज़' },
  'Movie & TV Tracking': { es: 'Seguir Películas',  fr: 'Suivi Films & Séries', ar: 'متابعة الأفلام',  hi: 'मूवी टीवी ट्रैकिंग' },
  'Game Tracker':        { es: 'Biblioteca Juegos', fr: 'Bibliothèque Jeux', ar: 'متابعة الألعاب',   hi: 'गेम ट्रैकर' },
  'Music Discovery':     { es: 'Descubrir Música',  fr: 'Découvrir Musique', ar: 'اكتشاف موسيقى',    hi: 'संगीत खोज' },
  'Book Recommendation': { es: 'Recomendar Libros', fr: 'Recommand. Livres', ar: 'اقتراحات كتب',     hi: 'बुक सुझाव' },
  'Podcast Tracker':     { es: 'Seguir Podcasts',   fr: 'Suivi Podcasts',    ar: 'متابعة بودكاست',   hi: 'पॉडकास्ट ट्रैकर' },
  'Recipe Finder':       { es: 'Buscar Recetas',    fr: 'Trouver Recettes',  ar: 'البحث عن وصفات',   hi: 'रेसिपी फाइंडर' },
  'Meal Prep Planner':   { es: 'Planificar Comida', fr: 'Plan Prépar. Repas', ar: 'التخطيط للوجبات', hi: 'मील प्रेप प्लानर' },
  'Wine Pairing AI':     { es: 'Maridaje Vinos IA', fr: 'Accord Mets Vins',  ar: 'اقتران النبيذ',    hi: 'वाइन पेयरिंग AI' },
  'Pantry Inventory':    { es: 'Inventario Despen.',fr: 'Inventaire Garde-M.', ar: 'مخزن المؤن',       hi: 'पेंट्री इन्वेंट्री' },
  'Gift Idea Generator': { es: 'Ideas de Regalo',   fr: 'Idées Cadeaux',     ar: 'أفكار هدايا',      hi: 'उपहार आइडिया' },
  'Pet Care Tracker':    { es: 'Cuidar Mascotas',   fr: 'Soins Animaux',     ar: 'رعاية الحيوانات',  hi: 'पेट केयर ट्रैकर' },
  'Plant Care Reminder': { es: 'Recordatorio Plant.',fr: 'Rappel Plantes',   ar: 'تذكير النباتات',   hi: 'प्लांट केयर रिमाइंडर' },
  'Family Tree Builder': { es: 'Árbol Genealógico', fr: 'Arbre Généalogique', ar: 'شجرة العائلة',     hi: 'फैमिली ट्री बिल्डर' },
  'Home Inventory':      { es: 'Inventario Hogar',  fr: 'Inventaire Maison', ar: 'مخزن المنزل',      hi: 'होम इन्वेंट्री' },
  'Document Organizer':  { es: 'Org. Documentos',   fr: 'Org. Documents',    ar: 'تنظيم المستندات',  hi: 'डॉक्यूमेंट ऑर्गनाइज़र' },
  'Home Maintenance Cal':{ es: 'Calend. Mantenim.', fr: 'Entretien Maison',  ar: 'صيانة المنزل',     hi: 'होम रखरखाव कैलेंडर' },
  'Furniture Measure.':  { es: 'Medir Muebles',     fr: 'Mesurer Meubles',   ar: 'قياس الأثاث',      hi: 'फर्नीचर माप' },
  'Interior Design AI':  { es: 'Diseño Interiores', fr: 'Design Intérieur',  ar: 'تصميم داخلي',      hi: 'इंटीरियर डिज़ाइन AI' },
  'Color Scheme':        { es: 'Combinación Color', fr: 'Schéma Couleur',    ar: 'ألوان متناسقة',    hi: 'कलर स्कीम' },
  'Floor Plan AI':       { es: 'Planos IA',         fr: 'Plans IA',          ar: 'مخططات ذكاء اصطناعي', hi: 'फ्लोर प्लान AI' },
  'Remodeling Calculat': { es: 'Calc. Renovaciones',fr: 'Calc. Rénovation',  ar: 'حاسبة التجديد',    hi: 'रीमॉडलिंग कैलकुलेटर' },
  'Virtual Staging':     { es: 'Escenografía Vir.', fr: 'Staging Virtuel',   ar: 'التنظير الافتراضي', hi: 'वर्चुअल स्टेजिंग' },
  'Paint Calculator':    { es: 'Calc. Pintura',     fr: 'Calc. Peinture',     ar: 'حاسبة الطلاء',     hi: 'पेंट कैलकुलेटर' },
  'Energy Usage Calcul.':{ es: 'Calc. Energía',     fr: 'Calc. Énergie',     ar: 'حاسبة الطاقة',     hi: 'एनर्जी कैलकुलेटर' },
  'Solar Calculator':    { es: 'Calc. Solar',       fr: 'Calc. Solaire',     ar: 'حاسبة الطاقة الشمسية', hi: 'सोलर कैलकुलेटर' },
  'Carbon Footprint Cal':{ es: 'Huella de Carbono', fr: 'Empreinte Carbone', ar: 'بصمة الكربون',     hi: 'कार्बन फुटप्रिंट' },
  'Energy Comparison':   { es: 'Comparar Energía',  fr: 'Comparateur Énerg.', ar: 'مقارنة الطاقة',    hi: 'एनर्जी कंपेयरिज़न' },
  'Power Consumption M.':{ es: 'Monitor Consumo',   fr: 'Surveiller Consom.', ar: 'مراقبة الاستهلاك', hi: 'बिजली खपत मॉनिटर' },
  'Home Security Score': { es: 'Seguridad Hogar',   fr: 'Sécurité Maison',   ar: 'أمن المنزل',       hi: 'होम सुरक्षा स्कोर' },
  'Emergency Prep Chec':{ es: 'Kit Emergencia',     fr: 'Kit Urgence',       ar: 'حالة الطوارئ',     hi: 'आपत्कालीन तैयारी' },
  'Wifi Placement':      { es: 'Ubicar Wifi',       fr: 'Emplacement Wifi',  ar: 'تحديد موقع الواي فاي', hi: 'Wifi प्लेसमेंट' },
  'Password Manager':    { es: 'Gestor Contraseñas',fr: 'Gestionnaire MDP',  ar: 'مدير كلمات المرور', hi: 'पासवर्ड मैनेजर' },
  '2FA Setup Guide':     { es: 'Guía Aut. 2 Fact.',fr: 'Guide 2FA',         ar: 'دليل المصادقة',    hi: '2FA गाइड' },
  'Data Backup Plan':    { es: 'Plan Respaldos',    fr: 'Plan Sauvegardes',  ar: 'خطة النسخ الاحتياطي', hi: 'डेटा बैकअप' },
  'File Conversion Hub': { es: 'Conversión Arch.',  fr: 'Conversion Fichiers', ar: 'تحويل الملفات',   hi: 'फ़ाइल कनवर्शन हब' },
  'Duplicate File Find': { es: 'Buscar Duplicados', fr: 'Trouver Doublons',  ar: 'بحث الملفات المكررة', hi: 'डुप्लिकेट फ़ाइल' },
  'Photo Metadata Remo': { es: 'Eliminar Metadata', fr: 'Supp. Métadonnées', ar: 'إزالة البيانات الوصفية', hi: 'फोटो मेटाडेटा हटाना' },
  'Large File Transfer': { es: 'Enviar Archivos',   fr: 'Envoyer Fichiers',  ar: 'إرسال الملفات',    hi: 'बड़ी फ़ाइल ट्रांसफर' },
  'Image Resize Batch':  { es: 'Redimensionar Lote',fr: 'Redimensionner Lot', ar: 'تغيير الدفعة',     hi: 'इमेज बैच रिसाइज़' },
  'Batch Rename':        { es: 'Renombrar Lote',    fr: 'Renommer en Lot',   ar: 'إعادة تسمية الدفعة', hi: 'बैच नाम बदलना' },
  'PDF OCR':             { es: 'PDF OCR',           fr: 'PDF OCR',           ar: 'التعرف الضوئي',    hi: 'PDF OCR' },
  'Video Trimmer':       { es: 'Cortar Vídeo',      fr: 'Découper Vidéo',    ar: 'قص الفيديو',       hi: 'वीडियो ट्रिमर' },
  'Audio to Text':       { es: 'Audio a Texto',     fr: 'Audio en Texte',    ar: 'الصوت إلى نص',     hi: 'ऑडियो-टू-टेक्स्ट' },
  'Ebook Converter':     { es: 'Convertir Ebook',   fr: 'Convertir Ebook',   ar: 'تحويل الكتب',      hi: 'ईबुक कनवर्टर' },
  'Pdf Scanner':         { es: 'Escáner PDF',       fr: 'Scanner PDF',       ar: 'ماسح PDF',         hi: 'PDF स्कैनर' },
  'Business Model Can.': { es: 'Modelo Negocio',    fr: 'Business Model Can.', ar: 'نموذج الأعمال',   hi: 'बिज़नेस मॉडल' },
  'RACI Matrix':         { es: 'Matriz RACI',       fr: 'Matrice RACI',      ar: 'مصفوفة RACI',      hi: 'RACI मैट्रिक्स' },
  'OKR Generator':       { es: 'Generar OKR',       fr: 'Générateur OKR',    ar: 'مولد OKR',         hi: 'OKR जेनरेटर' },
  'User Story Map':      { es: 'Mapa Historias',    fr: 'Carte Histoires',   ar: 'خريطة المستخدم',  hi: 'यूजर स्टोरी मैप' },
  'MoSCoW Prioritizat.': { es: 'Priorización Moscú',fr: 'Priorisation Mosc.', ar: 'أولويات موسكو',    hi: 'MoSCoW प्रायोरिटी' },
  'Issue Prioritizati.': { es: 'Priorizar Inciden.',fr: 'Prioriser Problèmes', ar: 'أولوية المشاكل',  hi: 'इश्यू प्रायोरिटी' },
  'User Persona':        { es: 'Persona Usuario',   fr: 'Persona Utilisateu.', ar: 'شخصية المستخدم', hi: 'यूजर पर्सना' },
  'Wireframe Tool':      { es: 'Wireframes',        fr: 'Wireframes',        ar: 'النموذج الاولي',   hi: 'वायरफ्रेम टूल' },
  'Design System Audit': { es: 'Audit Diseño',      fr: 'Audit Design',      ar: 'تدقيق التصميم',    hi: 'डिज़ाइन सिस्टम ऑडिट' },
  'A11y Checklist':      { es: 'Lista Accesib.',    fr: 'Liste Accessibilité', ar: 'قائمة الوصول',    hi: 'A11y चेकलिस्ट' },
  'Color Accessibility': { es: 'Accesibilidad Col.',fr: 'Accessibilité Coul.', ar: 'الالوان المتاحة',  hi: 'कलर एक्सेसिबिलिटी' },
  'Contrast Ratio Calc.':{ es: 'Calc. Contraste',   fr: 'Calc. Contraste',   ar: 'نسبة التباين',     hi: 'कंट्रास्ट अनुपात' },
  'Screen Reader Simul.':{ es: 'Simul. Lector Pan.',fr: 'Simul. Lect. Écran', ar: 'محاكي قارئ الشاشة', hi: 'स्क्रीन रीडर सिम' },
  'UX Research Toolkit': { es: 'Kit Investig. UX',  fr: 'Boîte UX',         ar: 'حزمة UX',          hi: 'UX रिसर्च टूलकिट' },
  'Survey Generator':    { es: 'Crear Encuestas',   fr: 'Générateur Sondage',ar: 'إنشاء استبيان',    hi: 'सर्वे जेनरेटर' },
  'NPS Calculator':      { es: 'Calc. NPS',         fr: 'Calc. NPS',         ar: 'حاسبة NPS',        hi: 'NPS कैलकुलेटर' },
  'Session Recorder':    { es: 'Grabador Sesiones', fr: 'Enregistreur Séance', ar: 'مسجل الجلسات',   hi: 'सेशन रिकॉर्डर' },
  'Heatmap Tool':        { es: 'Mapas de Calor',    fr: 'Heatmaps',          ar: 'الخرائط الحرارية', hi: 'हीटमैप टूल' },
  'A/B Testing':         { es: 'Pruebas A/B',       fr: 'Tests A/B',         ar: 'الاختبارات',       hi: 'A/B टेस्टिंग' },
  'Funnel Analysis':     { es: 'Análisis Embudo',   fr: 'Analyse Entonnoir', ar: 'تحليل القمع',      hi: 'फ़नल विश्लेषण' },
  'Cohort Analysis':     { es: 'Análisis Cohorte',  fr: 'Analyse Cohorte',   ar: 'تحليل الفوج',      hi: 'कोहोर्ट विश्लेषण' },
  'Design Critique AI':  { es: 'Crítica Diseño IA', fr: 'Critique Design IA', ar: 'نقد التصميم',      hi: 'डिज़ाइन क्रिटिक AI' },
  'Code Review Checkli.':{ es: 'Revisión Código',   fr: 'Liste Rev. Code',   ar: 'مراجعة الكود',     hi: 'कोड रिव्यू चेकलिस्ट' },
  'Pull Request Temp.':  { es: 'Plantilla PR',      fr: 'Modèle PR',         ar: 'نموذج طلب السحب',  hi: 'PR टेम्पलेट' },
  'Tech Debt Tracker':   { es: 'Seguir Deuda Téc.', fr: 'Suivi Dette Tech.', ar: 'متابعة الديون',    hi: 'टेक डेट ट्रैकर' },
  'Code Formatter':      { es: 'Formatear Código',  fr: 'Formateur Code',    ar: 'تنسيق الكود',      hi: 'कोड फ़ॉर्मेटर' },
  'Regex Cheatsheet':    { es: 'Chuletario Regex',  fr: 'Aide-Mémoire Regex', ar: 'مرجع Regex',      hi: 'रीजेक्स शीट' },
  'Git Cheatsheet':      { es: 'Chuletario Git',    fr: 'Aide-Mémoire Git',  ar: 'مرجع Git',         hi: 'Git शीट' },
  'Commit Message Gen.': { es: 'Generar Mensajes',  fr: 'Générateur Messag.', ar: 'مولد رسائل',       hi: 'कमिट मैसेज जेनरेटर' },
  'Semver Calculator':   { es: 'Calc. Semver',      fr: 'Calc. Semver',      ar: 'حاسبة النسخ',       hi: 'Semver कैलकुलेटर' },
  'Docker Run Gen.':     { es: 'Generar Docker',    fr: 'Générateur Docker', ar: 'مولد دوكر',         hi: 'डॉकर रन जेनरेटर' },
  'Kubernetes YAML Gen': { es: 'Generar K8s YAML',  fr: 'Générateur K8s',    ar: 'مولد YAML',         hi: 'K8s YAML जेनरेटर' },
  'Nginx Config Gen.':   { es: 'Generar Nginx',     fr: 'Générateur Nginx',  ar: 'مولد Nginx',        hi: 'Nginx कॉन्फ़िग' },
  'Regex 101':           { es: 'Regex 101',         fr: 'Regex 101',         ar: 'Regex 101',        hi: 'Regex 101' },
  'Debuggex':            { es: 'Debuggex',          fr: 'Debuggex',          ar: 'Debuggex',         hi: 'Debuggex' },
  'Stack Overflow':      { es: 'Stack Overflow',    fr: 'Stack Overflow',    ar: 'ستاك أوفرفلو',     hi: 'स्टैक ओवरफ़्लो' },
  'GitHub Compare View': { es: 'Comparador GitHub', fr: 'Comparateur GitHub', ar: 'مقارنة جيت هب',    hi: 'GitHub Compare' },
  'Gitignore Checker':   { es: 'Validador Gitignore',fr: 'Valide Gitignore', ar: 'فحص ملف الاستبعاد', hi: 'Gitignore जाँच' },
  'NPM Package Trends':  { es: 'Tendencias NPM',    fr: 'Tendances NPM',     ar: 'اتجاهات NPM',      hi: 'NPM ट्रेंड्स' },
  'Bundlephobia':        { es: 'Bundlephobia',      fr: 'Bundlephobia',      ar: 'باندل فوبيا',      hi: 'Bundlephobia' },
  'Bundle Size Analyzer':{ es: 'Analizador Bundle', fr: 'Analyseur Bundle',  ar: 'محلل الحزمة',      hi: 'बंडल साइज़' },
  'HTTP Status Codes':   { es: 'Códigos HTTP',      fr: 'Codes HTTP',        ar: 'رموز HTTP',        hi: 'HTTP स्टेटस' },
  'Crontab Guru':        { es: 'Crontab Guru',      fr: 'Crontab Guru',      ar: 'خبير Crontab',     hi: 'Crontab गुरु' },
  'Explain Shell':       { es: 'Explain Shell',     fr: 'Explain Shell',     ar: 'Explain Shell',    hi: 'Explain Shell' },
  'Shields.io':          { es: 'Shields.io',        fr: 'Shields.io',        ar: 'Shields.io',       hi: 'Shields.io' },
  'Choose a License':    { es: 'Elegir Licencia',   fr: 'Choisir Licence',   ar: 'اختيار ترخيص',     hi: 'लाइसेंस चुनें' },
  'MDN Web Docs':        { es: 'MDN Web Docs',      fr: 'MDN Web Docs',      ar: 'وثائق MDN',        hi: 'MDN वेब डॉक्स' },
  'W3C Markup Valid.':   { es: 'Validar HTML W3C',  fr: 'Valid. HTML W3C',   ar: 'فحص HTML',         hi: 'W3C वैलिडेशन' },
  'W3C CSS Validator':   { es: 'Validar CSS W3C',   fr: 'Valid. CSS W3C',    ar: 'فحص CSS W3C',      hi: 'CSS W3C वैलिडेशन' },
  'HTML Minifier':       { es: 'Minificar HTML',    fr: 'Minifier HTML',     ar: 'تصغير HTML',       hi: 'HTML मिनिफायर' },
  'CSS Minifier':        { es: 'Minificar CSS',     fr: 'Minifier CSS',      ar: 'تصغير CSS',        hi: 'CSS मिनिफायर' },
  'JavaScript Minifier': { es: 'Minificar JS',      fr: 'Minifier JS',       ar: 'تصغير JS',         hi: 'JS मिनिफायर' },
  'Emoji Finder':        { es: 'Buscar Emojis',     fr: 'Chercher Emojis',   ar: 'البحث عن إيموجي',  hi: 'इमोजी फाइंडर' },
  'Unicode Lookup':      { es: 'Buscar Unicode',    fr: 'Chercher Unicode',  ar: 'البحث عن يونيكود', hi: 'यूनिकोड लुकअप' },
  'Unminify & Decompre': { es: 'Descomprimir',      fr: 'Décompresser',      ar: 'فك الضغط',         hi: 'अनमिनिफ़ाई' },
  'Ping & Trace':        { es: 'Ping y Tracer',     fr: 'Ping et Tracer',    ar: 'بينج وتتبع',       hi: 'Ping और ट्रेस' },
  'Whois Lookup':        { es: 'Consulta Whois',    fr: 'Whois',             ar: 'بحث Whois',        hi: 'Whois लुकअप' },
  'IP Lookup':           { es: 'Consulta IP',       fr: 'Recherche IP',      ar: 'بحث عن IP',        hi: 'IP लुकअप' },
  'DNS Lookup':          { es: 'Consulta DNS',      fr: 'Recherche DNS',     ar: 'بحث DNS',          hi: 'DNS लुकअप' },
  'Blacklist Check':     { es: 'Listas Negras',     fr: 'Listes Noires',     ar: 'فحص القوائم السوداء', hi: 'ब्लैकलिस्ट जाँच' },
  'SSL Check':           { es: 'Prueba SSL',        fr: 'Test SSL',          ar: 'فحص شهادة SSL',    hi: 'SSL जाँच' },
  'Can I Use':           { es: 'Puedo Usar',        fr: 'Puis-je Utiliser',  ar: 'هل يمكنني استخدام', hi: 'Can I Use' },
  'Browser Support':     { es: 'Soporta Naveg.',    fr: 'Support Navigateu.', ar: 'دعم المتصفحات',    hi: 'ब्राउज़र सपोर्ट' },
  'Responsive Design T.':{ es: 'Diseño Sensible',   fr: 'Test Responsive',   ar: 'تصميم متجاوب',     hi: 'रेस्पॉन्सिव डिज़ाइन' },
  'Browser Resolution T':{ es: 'Resoluciones',      fr: 'Résolution Nav.',   ar: 'دقة الشاشة',       hi: 'ब्राउज़र रिज़ॉल्यूशन' },
  'Security Headers':    { es: 'Headers Seguridad', fr: 'En-têtes Sécurité', ar: 'رؤوس الأمان',      hi: 'सुरक्षा हेडर' },
  'XSS Escape Tool':     { es: 'Escapar XSS',       fr: 'Échapper XSS',      ar: 'الهروب من XSS',    hi: 'XSS एस्केप टूल' },
  'CSRF Token Generat.': { es: 'Token CSRF',        fr: 'Jeton CSRF',        ar: 'توكن CSRF',        hi: 'CSRF टोकन' },
  'SQL Injection Test':  { es: 'Prueba Inyección',  fr: 'Test Injection SQL', ar: 'اختبار الحقن',     hi: 'SQL इंजेक्शन' },
  'File Scanner':        { es: 'Escáner Archivos',  fr: 'Scan Fichiers',     ar: 'فحص الملفات',      hi: 'फ़ाइल स्कैनर' },
  'Password Manager (G.':{ es: 'Contraseñas Seg.',  fr: 'Gestionnaire MDP',  ar: 'مدير كلمات المرور', hi: 'पासवर्ड प्रबंधक' },
  'Encryption & Decrypt':{ es: 'Cifrar y Descifrar',fr: 'Chiffrement Déchif.', ar: 'التشفير وفك التشفير', hi: 'एनक्रिप्शन' },
  'PGP Key Generator':   { es: 'Generar PGP',       fr: 'Générateur PGP',    ar: 'مولد PGP',         hi: 'PGP की जेनरेटर' },
  'Code Obfuscator':     { es: 'Ofuscar Código',    fr: 'Obfusquer Code',    ar: 'تعتيم الكود',       hi: 'कोड ओबफस्केटर' },
  'VirusTotal Scan':     { es: 'Analizar Virus',    fr: 'Analyser Virus',    ar: 'فحص الفيروسات',     hi: 'वायरसटोटल स्कैन' },
  'Online Virus Scan':   { es: 'Analizar Virus Onl.',fr: 'Scan Virus Ligne',  ar: 'فحص الفيروسات',     hi: 'ऑनलाइन वायरस स्कैन' },
  'Font Generator':      { es: 'Generar Fuentes',   fr: 'Générateur Police', ar: 'مولد الخطوط',       hi: 'फ़ॉन्ट जेनरेटर' },
  'Meme Generator':      { es: 'Generar Memes',     fr: 'Générateur Mèmes',  ar: 'مولد الميمز',       hi: 'मीम जेनरेटर' },
  'TinyLetter (Newslet.)':{ es: 'Newsletter Peq.',  fr: 'Infolettre Simple', ar: 'نشرة بريدية',       hi: 'समाचार पत्रिका' },
  'Carrd (One-page Site)':{ es: 'Sitios de Una Pág.',fr: 'Sites Une Page',    ar: 'مواقع صفحة واحدة', hi: 'वन-पेज साइट' },
  'ConvertKit (Email M)':{ es: 'Email Marketing',   fr: 'Marketing E-mail',  ar: 'تسويق البريد',      hi: 'ईमेल मार्केटिंग' },
  'Notion (All-in-One)': { es: 'Notion Todo y Doc', fr: 'Tout-en-Un Notion', ar: 'نوتيون شامل',       hi: 'नोट्शन ऑल-इन-वन' },
  'Todoist (GTD)':       { es: 'Todoist GTD',       fr: 'Todoist GTD',       ar: 'تودوست GTD',        hi: 'Todoist GTD' },
  'Lumen5 (Vid AI)':     { es: 'Videos Automáticos',fr: 'Vidéo IA Lumen5',   ar: 'فيديوهات آلية',     hi: 'वीडियो AI' },
  'InVideo (Vid Edit)':  { es: 'Editor Video IA',   fr: 'Montage Vidéo',     ar: 'محرر الفيديو',      hi: 'इनवीडियो' },
  'Descript (Pod Edit)': { es: 'Podcast Editor',    fr: 'Éditeur Podcast',   ar: 'محرر بودكاست',      hi: 'डिस्क्रिप्ट' },
  'Gumroad (Digital Se)':{ es: 'Vender Digital',    fr: 'Vente Numérique',   ar: 'البيع الرقمي',      hi: 'गमरोड' },
  'Patreon (Membership)':{ es: 'Membresías',        fr: 'Membresies Patreon', ar: 'العضويات',         hi: 'पैट्रियन' },
  'Teachable (Courses)': { es: 'Cursos Online',     fr: 'Cours en Ligne',    ar: 'كورسات',            hi: 'टीचेबल' },
  'Thinkific (Premium)': { es: 'Cursos Premium',    fr: 'Cours Premium',     ar: 'كورسات مميزة',      hi: 'थिंकिफिक' },
  'Circle (Community)':  { es: 'Comunidad Privada', fr: 'Communauté Cercle', ar: 'مجتمع خاص',         hi: 'सर्कल कम्यूनिटी' },
  'Slack (Team Comm.)':  { es: 'Comunidad Equipo',  fr: 'Équipe Slack',      ar: 'فريق العمل سلاك',   hi: 'स्लैक टीम कम्यूनिकेशन' },
  'Notion Calendar':     { es: 'Calendario Notion', fr: 'Calendrier Notion', ar: 'تقويم نوتيون',      hi: 'नोट्शन कैलेंडर' },
  'Cron (Automation)':   { es: 'Automatización',    fr: 'Automatisation',    ar: 'التشغيل الآلي',     hi: 'क्रॉन ऑटोमेशन' },
  'Zapier (No-code Aut.':{ es: 'Integraciones',     fr: 'Intégrations Zapier', ar: 'التكامل',          hi: 'ज़ेपियर' },
  'n8n (Workflow Auto.)':{ es: 'Flujos de Trabajo', fr: 'Flux n8n',          ar: 'سير العمل',         hi: 'एन8एन' },
  'Airtable (DB + Vie)': { es: 'Base de Datos Vis.',fr: 'BD Visuelle Airtab.', ar: 'قاعدة بيانات',     hi: 'एयरटेबल' },
  'Webflow (No-code Si)':{ es: 'Sitios Visuales',   fr: 'Webflow Sites',     ar: 'مواقع بدون كود',    hi: 'वेबफ्लो' },
  'Typedream (No-code)': { es: 'Páginas Typedream', fr: 'Typedream Pages',   ar: 'صفحات تايب دريم',   hi: 'टाइपड्रीम' },
  'Framer (No-code Des)':{ es: 'Diseño Interactivo',fr: 'Design Framer',     ar: 'تصميم تعاملي',      hi: 'फ्रेमर' },
  'Figma (UI Design)':   { es: 'Diseño UI Figma',   fr: 'Design UI Figma',   ar: 'تصميم واجهات',      hi: 'फिग्मा UI' },
  'Maze (Usability Tes)':{ es: 'Pruebas Usabilidad',fr: 'Tests Utilisabilité', ar: 'فحص قابلية الاستخدام', hi: 'यूज़रबिलिटी' },
  'Linear (Issue Trac.)':{ es: 'Rastreo Inciden.',  fr: 'Gestion Problèmes', ar: 'متابعة القضايا',    hi: 'लीनियर' },
  'GitHub Project Mgt.': { es: 'Gestión Proyectos', fr: 'Gestion Projet GitHub', ar: 'مشاريع جيت هب',  hi: 'GitHub प्रोजेक्ट' },
  'Short.io (Short URL)':{ es: 'URL Corta',         fr: 'URL Courte',        ar: 'رابط قصير',         hi: 'शॉर्ट URL' },
  'Dub.co (Branded Lin.)':{ es: 'Enlaces de Marca', fr: 'Liens de Marque',   ar: 'روابط العلامات',    hi: 'ब्रांडेड लिंक' },
  'Linktree (Bio Link)': { es: 'Bio Link',          fr: 'Bio Link',          ar: 'رابط السيرة',       hi: 'लिंकट्री' },
  'Beacons (Creator Bi)':{ es: 'Bio Creador',       fr: 'Bio Créateur',      ar: 'الصفحة الشخصية',    hi: 'बीकन्स' },
  'Carrd Templates':     { es: 'Plantillas Carrd',  fr: 'Modèles Carrd',     ar: 'قوالب كارد',        hi: 'कार्ड टेम्पलेट' },
  'LottieFiles (Anim.)': { es: 'Animaciones Lottie',fr: 'Animations Lottie', ar: 'رسوم متحركة',       hi: 'लोटीफाइल्स' },
  'Framer Motion (Anim)':{ es: 'Animaciones Web',   fr: 'Animations Web',    ar: 'تحريكات الويب',     hi: 'फ्रेमर मोशन' },
  'AutoDraw (AI Drawin)':{ es: 'Dibujo Automático', fr: 'Dessin Automatique', ar: 'رسم تلقائي',       hi: 'ऑटोड्रॉ' },
  'Remove.bg':           { es: 'Quitar Fondo',      fr: 'Retirer l\'Arrière-plan', ar: 'إزالة الخلفية', hi: 'Remove.bg' },
  'Photopea (Photoshop)' :{ es: 'Editor Avanzado',  fr: 'Éditeur Avancé',    ar: 'محرر فوتوشوب',      hi: 'फोटोपिया' },
  'Pixlr (Photo Edit)':  { es: 'Editar Fotos',      fr: 'Photo Avancée',     ar: 'محرر الصور',        hi: 'पिक्सलर' },
  'Kapwing (Video Edit)':{ es: 'Editor Video',      fr: 'Monteur Vidéo',     ar: 'محرر الفيديو',      hi: 'कैपविंग' },
  'Canva (All Designs)': { es: 'Diseño con Canva',  fr: 'Design Canva',      ar: 'كانفا',             hi: 'कैनवा' },
  'FigJam (Whiteboard)': { es: 'Pizarrón Blanco',   fr: 'Tableau Blanc',     ar: 'سبورة بيضاء',       hi: 'फिगजैम' },
  'Miro (Whiteboard)':   { es: 'Pizarra Colabor.',  fr: 'Tableau Collabor.', ar: 'سبورة تعاونية',     hi: 'मीरो' },
  'Typefully (Twitter W)':{ es: 'Escritor Twitter', fr: 'Rédacteur Twitter', ar: 'كاتب تويتر',        hi: 'टाइपफुली' },
  'Hypefury (Schedule)': { es: 'Redes Sociales',    fr: 'Planification',      ar: 'جدولة المنشورات',   hi: 'हाइपफ्यूरी' },
  'Buffer (Social Sched)':{ es: 'Redes Buffer',     fr: 'Buffer Médias',     ar: 'بافر',              hi: 'बफ़र' },
  'Later (Instagram Pl.)':{ es: 'Plan Insta.',      fr: 'Planification Inst.', ar: 'تخطيط إنستغرام',   hi: 'लेटर' },
  'Planoly (Pinterest)': { es: 'Plan Pinterest',    fr: 'Planification Pint.', ar: 'تخطيط بينتريست',  hi: 'प्लैनोली' },
  'Metricool (Social A)':{ es: 'Analisis Redes',    fr: 'Analyse Médias',    ar: 'تحليل الشبكات',     hi: 'मेट्रीकूल' },
  'Brand24 (Monitoring)':{ es: 'Monitor de Marca',  fr: 'Surveillance Mar.', ar: 'مراقبة العلامات',   hi: 'ब्रांड24' },
  'Google Alerts':       { es: 'Alertas Google',    fr: 'Alertes Google',    ar: 'تنبيهات جوجل',      hi: 'गूगल अलर्ट' },
  'Ahrefs (Backlinks)':  { es: 'Enlaces Ahrefs',    fr: 'Backlinks Ahrefs',   ar: 'روابط Ahrefs',      hi: 'हरेफ्स' },
  'Semrush (SEO Suite)': { es: 'SEO con Semrush',   fr: 'SEO Semrush',       ar: 'Semrush SEO',       hi: 'सेमरश' },
  'SE Ranking (SEO)':    { es: 'Ranking SEO',       fr: 'Ranking SEO',       ar: 'SEO الترتيب',      hi: 'SE रैंकिंग' },
  'Surfer (Content SEO)':{ es: 'Contenido Surfer',  fr: 'Contenu Surfer',    ar: 'SEO المحتوى',       hi: 'सर्फर' },
  'AnswerThePublic (Se)':{ es: 'Preguntas Públicas',fr: 'Questions Publiques', ar: 'سؤال الجمهور',     hi: 'आंसर द पब्लिक' },
  'AlsoAsked (Related S)':{ es: 'Preguntas Rel.',   fr: 'Questions Connexes', ar: 'الاسئلة ذات الصلة', hi: 'ऑल्सो आस्क्ड' },
  'People Also Ask Ext.':{ es: 'Preguntas Relac.',  fr: 'Ext. Questions',     ar: 'ملحق الأسئلة',      hi: 'PAA एक्सटेंशन' },
  'Screenshot Machine':  { es: 'Capturas Web',      fr: 'Captures Web',      ar: 'لقطة شاشة',         hi: 'स्क्रीनशॉट मशीन' },
  'WPM Test (Typing)':   { es: 'Velocidad Escri.',  fr: 'Test Frappe',       ar: 'سرعة الكتابة',      hi: 'WPM टेस्ट' },
  'Monkeytype (Typing)': { es: 'Typing Monkeytype', fr: 'Typage',            ar: 'كتابة',             hi: 'मंकीटाइप' },
  'Keybr (Touch Typing)':{ es: 'Mecanografía',      fr: 'Frappe Tactile',    ar: 'الطباعة',           hi: 'कीबीआर' },
  'TypingClub (K-12)':   { es: 'Escuela de Tecla.', fr: 'École de Frappe',   ar: 'مدرسة الكتابة',     hi: 'टाइपिंग क्लब' },
  // ---- CUR_BETTER 反向补入 (2026-07-12) ----
  'Timestamp Converter':  { es: 'Convertidor de marca de tiempo',      fr: 'Convertisseur d\'horodatage', ar: 'محول الطابع الزمني',       hi: 'समय स्टाम्प कनवर्टर' },
  'Password Generator':  { es: 'Generador de Contraseñas',      fr: 'Générateur de Mots de Passe', ar: 'مولد كلمات المرور',       hi: 'पासवर्ड जनरेटर' },
  'Online Converter':  { es: 'en línea convertidor',      fr: 'en ligne convertisseur', ar: 'عبر الإنترنت محول',       hi: 'ऑनलाइन कनवर्टर' },
  'Online Password Generator':  { es: 'en línea contraseña generador',      fr: 'en ligne mot de passe générateur', ar: 'عبر الإنترنت كلمة المرور مولد',       hi: 'ऑनलाइन पासवर्ड जेनरेटर' },
  'Baidu OCR Service':  { es: 'Servicio OCR Baidu',      fr: 'Service OCR Baidu', ar: 'خدمة Baidu للتعرف البصري',       hi: 'Baidu OCR सेवा' },
  'Magisto AI Video Editor':  { es: 'Magisto Editor de Vídeo IA',      fr: 'Magisto Éditeur Vidéo IA', ar: 'Magisto محرر فيديو بالذكاء الاصطناعي',       hi: 'Magisto AI वीडियो एडिटर' },
};

// ============================================================
// C1. 按 tid 精确翻译 description（最优先，覆盖100个新增工具卡片）
//     格式: { 'tool-tid': { es, fr, ar, hi } }
// ============================================================
const DESC_BY_TID = {
  // ---------- 1. 日历会议排期 ----------
  'cal-com': {
    es: 'Alternativa open-source, gratuita y auto-alojable a Calendly. Dominio personalizado, logo, marca cero — ideal para SaaS.',
    fr: 'Alternative open-source, gratuite et auto-hébergeable à Calendly. Domaine personnalisé, logo, zéro branding — parfait pour les SaaS.',
    ar: 'بديل مفتوح المصدر ومجاني وذاتي الاستضافة لـ Calendly. نطاق مخصص وشعار وبدون علامة تجارية — مثالي لمنصات SaaS.',
    hi: 'Calendly का ओपन-सोर्स, फ्री, सेल्फ-होस्टेड विकल्प। कस्टम डोमेन, लोगो, जीरो ब्रांडिंग — SaaS के लिए परफेक्ट।'
  },
  'calendly-meeting': {
    es: 'Comparte un enlace de reserva; tus clientes eligen hora. Sincroniza con Google/Outlook/Feishu con recordatorios SMS + email.',
    fr: 'Partagez un lien de réservation ; vos clients choisissent leur horaire. Synchro Google/Outlook/Feishu avec doubles rappels SMS + e-mail.',
    ar: 'شارك رابط حجز شخصي؛ يختار العملاء الأوقات بأنفسهم. مزامنة تلقائية مع Google/Outlook/Feishu وتذكيرات بالرسائل والبريد.',
    hi: 'पर्सनल बुकिंग लिंक शेयर करें; क्लाइंट खुद टाइम चुनते हैं। Google/Outlook/Feishu के साथ ऑटो सिंक, SMS + ईमेल दोनों रिमाइंडर।'
  },
  'acuity-sched': {
    es: 'Citas y pagos para freelancers de servicios. Calendarios por servicio, depósitos, creación automática de Zoom y recordatorios masivos.',
    fr: 'Rendez-vous et paiements pour freelancers de services. Calendriers par prestation, acomptes, génération Zoom automatique et rappels groupés.',
    ar: 'المواعيد والمدفوعات لمقدمي الخدمات المستقلين. تقويمات لكل خدمة، ودائع، وإنشاء Zoom تلقائي وتذكيرات جماعية.',
    hi: 'सर्विस-फ्रीलांसर्स के लिए अपॉइंटमेंट और पेमेंट। पर-सर्विस कैलेंडर, डिपॉज़िट, ऑटो Zoom क्रिएशन और मास रिमाइंडर।'
  },
  'tencent-meeting': {
    es: 'El mejor software de reuniones en China. Enlaces con un clic; unirse desde WeChat sin app, 2000 participantes, pantalla compartida y actas con IA.',
    fr: 'La meilleure solution de visioconférence en Chine. Liens en un clic ; rejoindre depuis WeChat sans appli, 2000 participants, partage d\'écran et PV par IA.',
    ar: 'أفضل برنامج اجتماعات في الصين. روابط بنقرة واحدة؛ الانضمام عبر WeChat بدون تطبيق، 2000 مشارك، وشرح الشاشة ومحاضر بالذكاء الاصطناعي.',
    hi: 'चीन का नंबर 1 वीडियो मीटिंग। एक-क्लिक लिंक; बिना ऐप के WeChat से ज्वाइन, 2000 पार्टिसिपेंट, स्क्रीनशेयर और AI मिनट्स।'
  },
  'zoom-video': {
    es: 'El estándar mundial de videoconferencia. Multiplataforma, pantalla compartida, salas de descanso, grabación en la nube — claridad cristalina.',
    fr: 'La référence mondiale de la visioconférence. Multiplate-forme, partage d\'écran, salles de sous-groupes, enregistrement cloud — clarté cristalline.',
    ar: 'المعيار العالمي لمؤتمرات الفيديو. متعدد المنصات، ومشاركة الشاشة، وغرف فرعية، وتسجيل سحابي — وضوح فائق.',
    hi: 'विश्व की मानक वीडियो कॉन्फ्रेंसिंग। क्रॉस-प्लेटफॉर्म, स्क्रीन शेयर, ब्रेकआरट रूम, क्लाउड रिकॉर्डिंग — क्रिस्टल क्लियर क्वालिटी।'
  },
  'feishu-meeting': {
    es: 'Reuniones con Minutos de IA: transcripción en vivo, exportación a Word/Notion, identificación de ponentes y búsqueda por temas — 90% menos resúmenes.',
    fr: 'Réunions avec PV IA : transcription en direct, export Word/Notion, distinction des intervenants et recherche par thème — 90 % de récapitulatifs en moins.',
    ar: 'اجتماعات مع محاضر ذكاء اصطناعي: نسخ مباشر وتصدير إلى Word/Notion، وتحديد المتحدثين والبحث حسب الموضوع — تقليل 90% من الملخصات.',
    hi: 'AI मिनट्स वाली मीटिंग: लाइव ट्रांसक्रिप्शन, Word/Notion एक्सपोर्ट, स्पीकर पहचान और टॉपिक-वाइज़ सर्च — 90% कम रिकैप काम।'
  },

  // ---------- 2. 视频创作与直播 ----------
  'ray-so': {
    es: 'Capturas de código con estilo glassmorphic. Fondos degradados esmerilados con temas y sombras — imágenes para compartir más elegantes.',
    fr: 'Screenshots de code en glassmorphisme. Fonds dégradés givrés avec thèmes et ombres portées — des images de partage plus sophistiquées.',
    ar: 'لقطات كود بأسلوب الزجاجي. خلفيات متدرجة ضبابية مع سمات وظلال — صور مشاركة أنيقة لتطبيقاتك.',
    hi: 'ग्लासमॉर्फिक स्टाइल का कोड स्क्रीनशॉट। ग्रेडियंट फ्रॉस्टेड बैकग्राउंड, थीम, ड्रॉप शैडो — कूल शेयरिंग इमेज।'
  },
  'canva-video': {
    es: 'Crea vídeos cortos sin experiencia. Más de 10.000 plantillas con arrastrar y soltar, múltiples relaciones de aspecto, subtítulos y transiciones.',
    fr: 'Créez des vidéos courtes sans compétences. 10 000+ modèles en glisser-déposer, multi-formats, sous-titres et transitions.',
    ar: 'صنّع فيديوهات قصيرة بدون خبرة. أكثر من 10 آلاف قالب بالسحب والإفلات، وأبعاد متعددة، وترجمة وانتقالات.',
    hi: 'जीरो-स्किल शॉर्ट वीडियो क्रिएटर। 10,000+ ड्रैग-एंड-ड्रॉप टेम्पलेट, मल्टी-दिशा रेशियो, कैप्शन और ट्रांजीशन।'
  },
  'capcut-web': {
    es: 'Editor de vídeo online de ByteDance, sincronizado con CapCut móvil. Subtítulos inteligentes, tráiler con un clic, curvas de velocidad y LUTs.',
    fr: 'Éditeur vidéo en ligne de ByteDance, synchronisé avec CapCut mobile. Sous-titres intelligents, trailer en un clic, rampe de vitesse et LUTs.',
    ar: 'محرر فيديو عبر الإنترنت من ByteDance، متزامن مع الكاب متيت المحمول. ترجمة ذكية ومقطع دعائي بنقرة وسرعة متدرجة ومرشحات LUT.',
    hi: 'ByteDance का ऑनलाइन वीडियो एडिटर, मोबाइल CapCut के साथ सिंक। स्मार्ट कैप्शन, वन-क्लिक ट्रेलर, स्पीड रैम्पिंग और LUTs।'
  },
  'descript-video': {
    es: 'Edita vídeo editando texto. Transcripciones automáticas, doblaje IA, grabador de pantalla y de podcast — triplica la producción en solitario.',
    fr: 'Éditez la vidéo en éditant du texte. Transcriptions auto, doublage IA, enregistreur écran et podcast — la production solo est multipliée par 3.',
    ar: 'حرر الفيديو بتحرير النص. نسخ تلقائي ودوباج ذكاء اصطناعي ومسجل شاشة وبودكاست — ثلاثة أضعاف إنتاجية المحتوى الواحد.',
    hi: 'टेक्स्ट एडिट करके वीडियो एडिट करें। ऑटो ट्रांसक्रिप्शन, AI ओवरडब, स्क्रीन+पॉडकास्ट रिकॉर्डर — सोलो कंटेंट ट्रिपल!।'
  },
  'veed-io': {
    es: 'Estudio de vídeo todo en uno en el navegador: grabación, recorte, subtítulos automáticos, fondo verde, marca de agua y compresión.',
    fr: 'Studio vidéo tout-en-un dans le navigateur : enregistrement, découpage, sous-titres auto, chroma key, filigrane, compression.',
    ar: 'استوديو فيديو متكامل داخل المتصفح: تسجيل وقص وترجمة تلقائية وإزالة خلفية ووضع علامة مائية وضغط.',
    hi: 'ब्राउज़र में ऑल-इन-वन वीडियो स्टूडियो: रिकॉर्डिंग, ट्रिमिंग, ऑटो कैप्शन, बैकग्राउंड रिमूव, वॉटरमार्क, कंप्रेशन।'
  },
  'kapwing-tools': {
    es: 'Todo en uno para memes, vídeos cortos y GIFs. Texto, subtítulos, unión, recorte; plantillas de portada para WeChat y Xiaohongshu.',
    fr: 'Guichet unique pour memes, shorts et GIF. Ajout de texte, sous-titres, assemblage, découpage ; modèles de couverture WeChat et Xiaohongshu.',
    ar: 'واحة واحدة للميمات والفيديوهات القصيرة وGIF. إضافة نصوص وترجمة ولصق وقص وقوالب أغلفة لـ WeChat و Xiaohongshu.',
    hi: 'मीम, शॉर्ट्स और GIF के लिए वन-स्टॉप। टेक्स्ट/कैप्शन/स्टिचिंग/ट्रिमिंग, WeChat और रेडबुक के कवर टेम्पलेट भी।'
  },
  'wistia-hosting': {
    es: 'Alojamiento de vídeo HD sin anuncios para marketing. Mapas de calor de espectadores, captura de clientes potenciales y reproductor con marca.',
    fr: 'Hébergement vidéo HD sans pub pour le marketing. Heatmaps de spectateurs, collecte d\'e-mails et lecteur personnalisé.',
    ar: 'استضافة فيديو عالية الدقة بدون إعلانات للتسويق. خرائط حرارة المشاهدين وجلب العملاء وعلامة تجارية للمشغل.',
    hi: 'मार्केटिंग-ग्रेड विज्ञापन-रहित HD वीडियो होस्टिंग। व्यूअर हीटमैप, ईमेल लीड कैप्चर और ब्रांडेड प्लेयर।'
  },
  'vidyard-messages': {
    es: 'Graba mensajes de vídeo asíncronos de pantalla + cámara con seguimiento de visualización — mucho más claro que el texto escrito.',
    fr: 'Enregistrez des messages vidéo asynchrones écran + caméra avec suivi des visionnages — bien plus clair que du texte tapé.',
    ar: 'سجل رسائل فيديو غير متزامنة للشاشة والكاميرا مع تتبع المشاهدات — أوضح بكثير من الرسائل المكتوبة.',
    hi: 'स्क्रीन+फेस का एसिंक्रोनस वीडियो संदेश रिकॉर्ड करें, वॉच ट्रैकिंग के साथ — टाइप टेक्स्ट से कहीं ज्यादा क्लियर।'
  },
  'loom-recorder': {
    es: 'El #1 de grabación asíncrona de pantalla. Captura pantalla + rostro + voz, genera enlace compartible con comentarios por marca de tiempo.',
    fr: 'Le #1 de l\'enregistrement d\'écran asynchrone. Capture écran + visage + voix, génère un lien partageable avec commentaires horodatés.',
    ar: 'الأول عالمياً في تسجيل الشاشة غير المتزامن. يلتقط الشاشة والوجه والصوت وينشئ رابط مشاركة مع تعليقات لكل علامة زمنية.',
    hi: 'नंबर 1 एसिंक्रोनस स्क्रीन रिकॉर्डर। स्क्रीन + चेहरा + आवाज़ कैप्चर, टाइमस्टैम्प कमेंट के साथ शेयर करने योग्य लिंक।'
  },
  'screencastify-chrome': {
    es: 'Grabador de pantalla para Chrome con sesiones gratuitas de 30 min, superposición de webcam, anotaciones con bolígrafo, exportación a MP4 o Drive.',
    fr: 'Enregistreur d\'écran Chrome avec sessions gratuites de 30 min, overlay webcam, annotations stylo, export MP4 ou Google Drive en un clic.',
    ar: 'مسجل شاشة لكروم بجلسات مجانية 30 دقيقة، وفرض كاميرا الويب وتعليقات بالقلم وتصدير MP4 أو Google Drive بنقرة.',
    hi: 'Chrome का 30 मिनट फ्री स्क्रीन रिकॉर्डर, वेबकैम ओवरले, पेन एनोटेशन, वन-क्लिक MP4 या Google Drive एक्सपोर्ट।'
  },
  'streamyard-live': {
    es: 'Directos simultáneos a Douyin, Bilibili, Kuaishou, YouTube, Facebook, LinkedIn, con logo, ticker y superposiciones personalizadas.',
    fr: 'Diffusions en direct simultanées sur Douyin, Bilibili, Kuaishou, YouTube, Facebook, LinkedIn avec logo, bande défilante et overlays.',
    ar: 'بث مباشر متزامن لـ دويين وBilibili وKuaishou وYouTube وFacebook وLinkedIn، مع شعار وشريط إخباري وتراكب مخصص.',
    hi: 'ब्राउज़र से डायरेक्ट लाइव: टिकटॉक/Bilibili/वीडियो अकाउंट/YouTube/Facebook/LinkedIn, logo+टिकर+विजेट एक साथ।'
  },
  'restream-io': {
    es: 'Transmite una vez y llega a más de 30 plataformas sociales, con almacenamiento VOD, repeticiones y chat unificado. Imprescindible para livestreamers.',
    fr: 'Diffusez une fois et touchez 30+ plateformes sociales, stockage VOD, replays et chat unifié. Essentiel pour les créateurs de live commerce.',
    ar: 'ابث مرة وصل ل+30 منصة اجتماعية، مع تخزين الفيديوهات الطويلة والإعادة ونقاش موحد. أداة أساسية لبث التسوق المباشر.',
    hi: 'एक बार स्ट्रीम करें और 30+ सोशल प्लेटफॉर्म पर पहुंचें, VOD स्टोरेज, रिप्ले और यूनिफाइड चैट के साथ।'
  },
  'runway-gen': {
    es: 'Kit profesional de IA para creación de vídeo: texto a escena, movimiento de imágenes, chroma key con un clic y restauración de vídeos antiguos.',
    fr: 'Boîte à outils vidéo IA pro : texte vers scène, mouvement d\'image, chroma key en un clic, restauration et upscaling de vidéos anciennes.',
    ar: 'حزمة إبداع فيديو ذكاء اصطناعي احترافية: من نص إلى مشهد وحركة الصور، وإزالة خلفية بنقرة وتجديد الفيديوهات القديمة.',
    hi: 'प्रो AI वीडियो क्रिएशन टूलकिट: टेक्स्ट-टू-सीन, इमेज मोशन, वन-क्लिक क्रोमा की, पुराने वीडियो रिस्टोर और अपस्केल।'
  },
  'pika-labs': {
    es: 'Texto / imagen a animación HD con estilos anime, 3D, realista y cyberpunk. Prototipado rápido de títulos y demos de producto.',
    fr: 'Texte / image vers animation HD avec styles anime, 3D, réaliste et cyberpunk. Prototypage rapide pour titres et démos produit.',
    ar: 'نص أو صورة إلى رسوم متحركة عالية الدقة بأسلوب الأنمي وثلاثي الأبعاد والواقعي والسيبر بانك، لنماذج أولية سريعة.',
    hi: 'टेक्स्ट/इमेज-टू-HD एनिमेशन: anime/3D/रियलिस्टिक/साइबरपंक स्टाइल। टाइटल और प्रोडक्ट डेमो के लिए फास्ट प्रोटोटाइपिंग।'
  },
  'submagic-auto': {
    es: 'Genera automáticamente subtítulos de vídeo corto con resaltado de color, emojis y exportación SRT bilingüe — impulso viral para shorts.',
    fr: 'Génère automatiquement des sous-titres de shorts avec surlignage coloré, callouts emoji et export SRT bilingue — boost viral pour TikTok/Shorts.',
    ar: 'ينشئ تلقائياً ترجمة للفيديوهات القصيرة مع تلوين وتعليقات إيموجي وتصدير SRT ثنائي اللغة، لزيادة الانتشار الفيروسي.',
    hi: 'शॉर्ट्स के लिए ऑटो-कैप्शन: कलर हाइलाइट, इमोजी कॉलआउट और द्विभाषी SRT एक्सपोर्ट के साथ TikTok/viral के लिए।'
  },
  'opus-clip': {
    es: 'Corta 10 shorts virales de podcasts largos con apertura automática, puntuación de viralidad, subtítulos y B-ROLL — ahorra 80% del tiempo.',
    fr: 'Découpe 10 shorts viraux à partir de longs podcasts : accroches auto, score de viralité, sous-titres et B-ROLL — 80% de temps de studio économisé.',
    ar: 'يُقَطّع 10 مقاطع فيروسية من البودكاست الطويل مع خطاف تلقائي ونقاط انتشار وترجمة ومقاطع دعم — يوفر 80% من وقت التحرير.',
    hi: 'लंबे पॉडकास्ट से 10 वायरल शॉर्ट्स काटता है: ऑटो हुक्स, वायरलिटी स्कोर, कैप्शन और B-ROLL — 80% स्टूडियो टाइम बचता।'
  },
  'repurpose-io': {
    es: 'Pipeline automatizado de reutilización de contenido: YouTube a podcast, shorts, TikTok; post de blog a carruseles de LinkedIn.',
    fr: 'Pipeline automatisé de reformatage de contenu : YouTube vers podcast, shorts, TikTok ; article de blog vers carrousels LinkedIn.',
    ar: 'خط أنابيب آلي لإعادة استخدام المحتوى: يوتيوب إلى بودكاست ومقاطع قصيرة وتيك توك، ومن مدونة إلى معارض لينكدإن.',
    hi: 'ऑटोमेटेड कंटेंट रीपर्पोज़िंग पाइपलाइन: YouTube → पॉडकास्ट/शॉर्ट्स/TikTok; ब्लॉग पोस्ट → LinkedIn कैरूसेल्स।'
  },
  'riverside-fm': {
    es: 'Grabadora de entrevistas remotas de primera clase. Invitados entran por navegador, grabación local 4K multipista, directos y transcripción automática.',
    fr: 'Enregistreur d\'interviews à distance premium. Les invités rejoignent via navigateur, enregistrement local 4K multipiste, direct et transcription auto.',
    ar: 'مسجل مقابلات عن بعد فائق الجودة. يدخل الضيوف عبر المتصفح مع تسجيل محلي 4K متعدد المسارات وبث مباشر ونسخ تلقائي.',
    hi: 'प्रीमियम रिमोट इंटरव्यू रिकॉर्डर। गेस्ट ब्राउज़र से ज्वाइन, लोकल 4K मल्टीट्रैक रिकॉर्डिंग, लाइव स्ट्रीम और ऑटो ट्रांसक्रिप्शन।'
  },
  'streamlabs-obs': {
    es: 'Kit de embellecimiento para directos: overlays, efectos de donación, chatbots, juegos interactivos y alertas para nuevos streamers.',
    fr: 'Boîte à outils embellissement de streams : overlays, effets de dons, chatbots, jeux interactifs et alertes pour les nouveaux streamers.',
    ar: 'حزمة تجميل البث المباشر: شاشات متراكبة وتأثيرات التبرعات وروبوتات الدردشة وألعاب تفاعلية وتنبيهات للمبتدئين.',
    hi: 'लाइव स्ट्रीम की ब्यूटीफिकेशन टूलकिट: ओवरले, डोनेशन इफेक्ट्स, चैटबॉट्स, इंटरएक्टिव गेम और नए स्ट्रीमर्स के लिए अलर्ट।'
  },
  'motion-array': {
    es: 'Suscripción a todo tipo de recursos: plantillas PR/AE/FCPX, LUTs, transiciones, música SFX y archivos libres de derechos 8K.',
    fr: 'Abonnement tout-en-un aux ressources : templates PR/AE/FCPX, LUTs, transitions, SFX musique, images libres de droits 8K.',
    ar: 'اشتراك شامل للموارد: قوالب PR/AE/FCPX، ومرشحات ألوان LUTs، وانتقالات، وموسيقى مؤثرات، ومحتوى عالي الدقة 8K مجاني.',
    hi: 'ऑल-इन-वन सेट सब्सक्रिप्शन: PR/AE/FCPX टेम्पलेट्स, LUTs, ट्रांजीशन, SFX संगीत और 8K रॉयल्टी-फ्री स्टॉक।'
  },
  'artlist-io': {
    es: 'Suscripción de música libre de derechos estándar para creadores, con licencia global y cero reclamaciones de Content ID de YouTube.',
    fr: 'Abonnement de musique libre de droits standard pour créateurs, avec licence mondiale et zéro réclamation YouTube Content ID.',
    ar: 'اشتراك موسيقى خالية من حقوق الطبع عالمي لصانعي المحتوى، مع ترخيص عالمي وبدون أي مطالبات من Content ID YouTube.',
    hi: 'क्रिएटर्स के लिए स्टैंडर्ड रॉयल्टी-फ्री म्यूज़िक सब्सक्रिप्शन। ग्लोबल लाइसेंस और YouTube Content ID का कोई दावा नहीं।'
  },
  'epidemic-sound': {
    es: 'Más de 400.000 pistas + 100.000 SFX con suscripción ilimitada; ajuste automático de duración y protección 100% contra reclamaciones.',
    fr: '400K+ pistes + 100K SFX en abonnement illimité ; ajuste auto de la durée et protection 100% contre toute réclamation.',
    ar: '+400 ألف مقطع موسيقي و+100 ألف مؤثر صوتي باشتراك غير محدود، وتكييف تلقائي للمدة وحماية 100% ضد المطالبات.',
    hi: '400K+ ट्रैक + 100K SFX, अनलिमिटेड सब्सक्रिप्शन के साथ। ऑटो-ड्यूरेशन फिट और 100% क्लेम प्रोटेक्शन।'
  },
  'storyblocks-vid': {
    es: 'Suscripción 3 en 1 de vídeo, audio e imágenes; menor costo por activo para freelancers y estudios creativos.',
    fr: 'Abonnement 3-en-1 vidéo / audio / image ; coût par actif réduit pour les freelances et studios créatifs.',
    ar: 'اشتراك ثلاثي واحد للفيديو والصوت والصور؛ بتكلفة أقل لكل أصول للحرفيين المستقلين والاستوديوهات الإبداعية.',
    hi: '3-इन-1 वीडियो/ऑडियो/इमेज सब्सक्रिप्शन। फ्रीलांसर्स और क्रिएटिव स्टूडियो के लिए कम पर-असेट लागत।'
  },

  // ---------- 3. 素材图库 ----------
  'pixabay-video': {
    es: 'La mayor biblioteca gratuita CC0 con millones de vídeos HD/4K, imágenes, música y vectores. 100% gratuita para uso comercial, sin atribución.',
    fr: 'La plus grande bibliothèque gratuite CC0 : millions de vidéos HD/4K, images, musique, vecteurs. 100% gratuit pour usage commercial, aucune mention.',
    ar: 'أكبر مكتبة مجانية CC0 تضم ملايين الفيديوهات عالية الدقة والصور والموسيقى والمتجهات. مجانية 100% للاستخدام التجاري بدون نسب.',
    hi: 'सबसे बड़ी CC0 फ्री लाइब्रेरी: लाखों HD/4K वीडियो, इमेज, संगीत, वेक्टर्स। 100% फ्री कमर्शियल यूज़, बिना attribution के।'
  },
  'pexels-videos': {
    es: 'Banco gratuito seleccionado con alta calidad. Vídeos HD/4K, fotos — todos seleccionados a mano por humanos, uso comercial gratuito.',
    fr: 'Banque gratuite et triée sur le volet. Vidéos HD/4K, photos — tout sélectionné à la main par des humains, usage commercial gratuit.',
    ar: 'مكتبة مجانية مختارة بعناية بجودة عالية: فيديوهات وصور عالية الدقة مختارة يدوياً بشراكة مع أفضل المصورين.',
    hi: 'मैनुअली क्यूरेटेड उच्च-क्वालिटी फ्री स्टॉक। HD/4K वीडियो, फोटो — सब इंसानों द्वारा चुना हुआ, फ्री कमर्शियल यूज़।'
  },
  'unsplash-images': {
    es: 'Fotos HD gratuitas de grado diseñador de fotógrafos mundiales; libre para uso comercial con API REST pública para integración.',
    fr: 'Photos HD gratuites de qualité designer, issues de photographes du monde entier. Usage commercial libre + API REST publique.',
    ar: 'صور عالية الدقة مجانية بمستوى المصممين من مصورين عالميين؛ استخدام تجاري حر مع واجهة برمجة عامة للتكامل.',
    hi: 'ग्लोबल फोटोग्राफर्स की डिज़ाइनर-ग्रेड मुफ्त HD फ़ोटो; प्रोडक्ट इंटीग्रेशन के लिए पब्लिक REST API भी उपलब्ध।'
  },

  // ---------- 4. 设计协作文档 ----------
  'canva-design': {
    es: 'Diseño sin curva de aprendizaje para startups. Más de 1 millón de plantillas de logos, carteles, tarjetas y menús.',
    fr: 'Design sans courbe d\'apprentissage pour les startups. 1M+ templates : logos, affiches, cartes, PPT, menus, bannières.',
    ar: 'تصميم بدون منحنى تعلم للشركات الناشئة. +1 مليون قالب لوجوهات وملصقات وبطاقات وعروض تقديمية وقوائم وبانرات.',
    hi: 'स्टार्टअप्स के लिए जीरो-लर्निंग डिज़ाइन टूल। 1M+ टेम्पलेट्स: लोगो, पोस्टर, बिज़नेस कार्ड, पीपीटी, मेन्यू, बैनर।'
  },
  'figma-design': {
    es: 'La plataforma de diseño colaborativo UI/UX líder. Bibliotecas de componentes, prototipos interactivos, entrega DevMode.',
    fr: 'La plateforme de design collaboratif UI/UX leader. Bibliothèques de composants, prototypes interactifs, hand-off DevMode.',
    ar: 'منصة التصميم التعاوني الرائدة لـ UI/UX. مكتبات مكونات ونماذج أولية تفاعلية وتسليم تطبيقي عبر DevMode.',
    hi: 'इंडस्ट्री-लीडिंग UI/UX सहयोगात्मक डिज़ाइन प्लेटफॉर्म। कंपोनेंट लाइब्रेरी, इंटरैक्टिव प्रोटोटाइप, DevMode हैंडऑफ़।'
  },
  'feishu-docs': {
    es: 'Docs, Sheets, Bitable, Calendario, Reuniones y OKRs unificados. Gratis para equipos menores de 50 personas — alternativa china a Office 365.',
    fr: 'Docs, Sheets, Bitable, Calendrier, Réunions, OKRs unifiés. Gratuit pour équipes <50 — l\'alternative chinoise à Office 365.',
    ar: 'وثائق وجداول وقواعد بيانات وتقويم واجتماعات وأهداف OKRs موحدة. مجاني لفرق أقل من 50 شخصاً، بديل صيني لـ Office 365.',
    hi: 'डॉक्स, शीट्स, बाइटेबल, कैलेंडर, मीटिंग्स, OKR एक ही जगह। 50 से कम टीम के लिए फ्री — चाइना Office 365 विकल्प।'
  },
  'tencent-docs': {
    es: 'Los documentos y hojas de cálculo online más populares en China. Compartibles por WeChat, ver sin iniciar sesión, coedición en tiempo real.',
    fr: 'Les docs et feuilles en ligne les plus utilisés en Chine. Partageables WeChat, visualisation sans connexion, co-édition temps réel.',
    ar: 'أشهر مستندات وجداول بيانات عبر الإنترنت في الصين. قابلة للمشاركة عبر WeChat، وبدون تسجيل للعرض وتحرير جماعي لحظي.',
    hi: 'चीन में सबसे लोकप्रिय ऑनलाइन डॉक्स और शीट्स। WeChat से शेयर, बिना लॉगिन देखने योग्य, रीयल-टाइम मल्टी-यूजर एडिट।'
  },
  'notion-workspace': {
    es: 'Espacio de trabajo todo en uno para planes empresariales, SOP, CRM, tableros kanban y hojas de ruta — el cerebro digital de cada freelancer.',
    fr: 'Espace de travail tout-en-un pour business plans, SOP, CRM, kanban et roadmaps — le cerveau digital de chaque freelance.',
    ar: 'مساحة عمل متكاملة لخطط الأعمال والإجراءات الموحدة وإدارة العملاء ولوحات كانبان وخارطة الطريق، العقل الرقمي لكل حرفي مستقل.',
    hi: 'बिज़नेस प्लान, SOP, CRM, कैनबन बोर्ड और रोडमैप के लिए ऑल-इन-वन वर्कस्पेस — हर फ्रीलांसर का डिजिटल ब्रेन।'
  },
  'xmind-mindmap': {
    es: 'Mapas mentales para planificación empresarial con vistas de espina de pescado, organigrama, Gantt y matriz. Exportación PPT/Word/PDF con un clic.',
    fr: 'Cartes mentales business plan : vue poisson, organigramme, Gantt, matrice. Export PPT/Word/PDF en un clic.',
    ar: 'خرائط ذهنية لتخطيط الأعمال بعروض هيكلية وتنظيمية وجانت ومصفوفة، مع تصدير سهل إلى PPT/Word/PDF بنقرة واحدة.',
    hi: 'बिज़नेस प्लानिंग माइंडमैप: फिशबोन, ऑर्ग चार्ट, गैंट, मैट्रिक्स व्यू। वन-क्लिक PPT/Word/PDF एक्सपोर्ट।'
  },
  'processon-flow': {
    es: 'Flujogramas, mapas mentales, BPMN, ER, topologías de red y wireframes de primera clase. Más de 800.000 plantillas comunitarias.',
    fr: 'Organigrammes, cartes mentales, BPMN, ER, topologies réseau, wireframes premium. 800K+ templates communautaires.',
    ar: 'مخططات انسيابية وخرائط ذهنية وBPMN ومخططات كيانات وعلاقات وشبكات، وأكثر من 800 ألف قالب مجتمعي.',
    hi: 'प्रीमियम ऑनलाइन फ्लोचार्ट, माइंडमैप, BPMN, ER, नेटवर्क टोपोलॉजी, वायरफ्रेम। 800K+ कम्युनिटी टेम्पलेट्स।'
  },
  'whimsical-wire': {
    es: 'Kit rápido de prototipos para PM: wireframes de baja fidelidad, flujogramas, kanban y notas adhesivas. Especificaciones de 3 días para desarrolladores freelance.',
    fr: 'Kit de prototypage rapide PM : wireframes basse-fidélité, organigrammes, kanban, sticky notes. Spécifications en 3 jours pour devs freelance.',
    ar: 'حزمة نماذج أولية سريعة لمديري المشاريع: أسلاك خفيفة، ومخططات انسيابية ولوحات كانبان وملاحظات لاصقة.',
    hi: 'PM फास्ट प्रोटोटाइपिंग किट: लो-फाई वायरफ्रेम + फ्लोचार्ट + कैनबन + स्टिकी नोट्स। फ्रीलांस डेव्स के लिए 3-दिन का स्पेसिफिकेशन।'
  },
  'chuangkit-poster': {
    es: 'Diseño adaptado a China: menús de restaurantes, pósters de WeChat, volantes inmobiliarios, contratación, licencias de fuentes comerciales locales.',
    fr: 'Design adapté à la Chine : menus de restauration, affiches WeChat, flyers immobilier, recrutement, licences de polices locales.',
    ar: 'تصميم مخصص للسوق الصيني: قوائم المطاعم وملصقات WeChat ونشرات العقارات والتوظيف وتراخيص الخطوط المحلية.',
    hi: 'चाइना-टेलर्ड डिज़ाइन: खाना मेन्यू, WeChat पोस्टर, रियल एस्टेट फ्लायर, भर्ती, डोमेस्टिक कॉमर्शियल फॉन्ट लाइसेंसिंग।'
  },
  'markup-hero': {
    es: 'Capturas de pantalla largas anotadas + marcado PDF. Flechas, desenfoques, texto, mosaico, collages de varias imágenes y enlaces compartibles para clientes.',
    fr: 'Longues captures annotées + marquage PDF. Flèches, flous, texte, mosaïque, collages multi-images, liens partageables pour clients.',
    ar: 'لقطات شاشة طويلة مشروحة + علامات PDF: أسهم وضبابية ونص وفسيفساء وملصقات متعددة الصور وروابط مشاركة.',
    hi: 'एनोटेटेड लंबा स्क्रीनशॉट + PDF मार्किंग। एरो, ब्लर, टेक्स्ट, मोज़ेक, मल्टी इमेज कोलाज, क्लाइंट के लिए शेयर लिंक।'
  },
  'miro-whiteboard': {
    es: 'La pizarra colaborativa más potente del mundo. Mapas mentales, recorridos de usuario, análisis competitivo y retrospectivas.',
    fr: 'Le tableau blanc collaboratif le plus puissant au monde. Cartes mentales, user journeys, benchmark, stand-ups, rétrospectives.',
    ar: 'أقوى سبورة تعاونية في العالم. خرائط ذهنية ورحلات المستخدم وتحليل المنافسين والاجتماعات اليومية.',
    hi: 'दुनिया का सबसे मज़बूत सहयोगात्मक व्हाइटबोर्ड। माइंडमैप, यूजर जर्नी, कंपेटिटिव एनालिसिस, स्टैंड-अप, रेट्रो।'
  },
  'invision-freehand': {
    es: 'Tablero de revisión colaborativo InVision. Wireframes + incrustación de Figma, comentarios anclados, votación con notas adhesivas.',
    fr: 'Tableau de revue collaboratif InVision. Wireframes + embed Figma, commentaires épinglés, votes par post-it.',
    ar: 'لوحة مراجعة تعاونية من InVision: نماذج أولية مع دمج Figما، وتعليقات مثبتة وتصويت بالملاحظات اللاصقة.',
    hi: 'InVision का सहयोगात्मक रिव्यू बोर्ड। वायरफ्रेम + Figma एम्बेड, पिन कमेंट, स्टिकी-नोट वोटिंग।'
  },
  'figma-community': {
    es: 'Mina de oro de diseños gratuitos. Más de 1 millón de UI, dashboards, ilustraciones, iconos 3D y wireframes — duplícalos en Figma y edítalos.',
    fr: 'Mine d\'or de designs gratuits. 1M+ UI, tableaux de bord, illustrations, icônes 3D, wireframes — dupliquez dans Figma et éditez.',
    ar: 'منجم ذهبي للتصاميم المجانية: +1 مليون واجهة ولوحات بيانات ورسوم توضيحية وأيقونات ثلاثية الأبعاد، يمكن نسخها في فيجما.',
    hi: 'फ्री डिज़ाइन की सोने की खान। 1M+ App UI, डैश, इलस्ट्रेशन, 3D आइकन, वायरफ्रेम — Figma में डुप्लिकेट और एडिट करें।'
  },

  // ---------- 5. 数据表单电子签会计商务 ----------
  'airtable-db': {
    es: 'Base de datos relacional que parece Excel: CRM, proyectos, inventario, calendario de contenido, formularios y automatización — sin código.',
    fr: 'Base de données relationnelle qui ressemble à Excel : CRM, projets, inventaire, calendrier de contenu, formulaires et automatisation — sans code.',
    ar: 'قاعدة بيانات علائقية تشبه إكسل: إدارة العملاء والمشاريع والمخزون وتقويم المحتوى والنماذج والأتمتة — بدون برمجة.',
    hi: 'एक्सेल जैसी रिलेशनल डेटाबेस: CRM, प्रोजेक्ट, इन्वेंट्री, कंटेंट कैलेंडर, फ़ॉर्म + ऑटोमेशन — बिना कोड के।'
  },
  'feishu-bitable': {
    es: 'Airtable doméstico con kanban, Gantt, galería, formulario, automatización y relaciones entre tablas. Red doméstica rápida.',
    fr: 'Airtable domestique avec kanban, Gantt, galerie, formulaire, automatisation et relations inter-tableaux. Réseau domestique rapide.',
    ar: 'Airtable صيني مزود بلوحات كانبان وجانت ومعرض ونماذج وتشغيل آلي وعلاقات بين الجداول مع سرعة عالية.',
    hi: 'चाइना Airtable: कैनबन, गैंट, गैलरी, फ़ॉर्म, ऑटोमेशन और क्रॉस-टेबल रिलेशन के साथ, डोमेस्टिक फास्ट नेटवर्क।'
  },
  'tencent-survey': {
    es: 'Principal herramienta de investigación de mercado en China. Más de 30 tipos de preguntas, saltos lógicos, premios WeChat y panel de muestras.',
    fr: 'Leader des études de marché en Chine. 30+ types de questions, sauts logiques, récompenses WeChat, partage, panel d\'échantillons.',
    ar: 'أفضل أداة أبحاث سوق في الصين. +30 نوع سؤال، وقفزات منطقية، ومكافآت وىشات، ومشاركة، ولوحة عينات.',
    hi: 'चीन का टॉप मार्केट रिसर्च टूल। 30+ प्रश्न प्रकार, लॉजिक जंप, लकी मनी रिवॉर्ड, WeChat शेयर, सैंपल पैनल।'
  },
  'typeform-form': {
    es: 'Formularios de alta conversión, una pregunta a la vez, con tasa de finalización 3 veces mayor. Imprescindible para captación de clientes en el extranjero.',
    fr: 'Formulaires à fort taux de conversion, une question à la fois, +3x de complétion. Indispensable pour l\'onboarding de clients internationaux.',
    ar: 'نماذج عالية التحويل بسؤال واحد في كل مرة، بمعدل إكمال ثلاثي الأضعف. ضروري لجلب العملاء الدوليين.',
    hi: 'हाई-कन्वर्जन फॉर्म, एक समय में एक सवाल, 3x कंप्लीशन रेट। ओवरसीज़ क्लाइंट इंटेक के लिए मस्ट-हेव।'
  },
  'jotform-builder': {
    es: 'Más de 10.000 plantillas: reservas, registros, pagos, firmas, pedidos, aprobaciones, incorporación; arrastrar y soltar con Stripe y WeChat Pay.',
    fr: '10K+ templates : réservations, inscriptions, paiements, e-signatures, commandes, approbations, onboarding ; glisser-déposer avec Stripe/WeChat Pay.',
    ar: '+10 ألف قالب للحجوزات والتسجيلات والمدفوعات والتوقيعات الإلكترونية والطلبات والموافقات، بسحب وإفلات مع Stripe وWeChat Pay.',
    hi: '10K+ टेम्पलेट्स: बुकिंग, साइनअप, पेमेंट, ई-सिग्नेचर, ऑर्डर, अप्रुवल, ऑनबोर्डिंग; Stripe/WeChat Pay के साथ ड्रैग-एंड-ड्रॉप।'
  },
  'pandadoc-sign': {
    es: 'Propuestas, cotizaciones, contratos y acuerdos de confidencialidad con firmas legalmente vinculantes; +40% más de cierres en ventas B2B.',
    fr: 'Propositions, devis, contrats, NDAs avec e-signatures légalement contraignantes, suivi du temps — +40% de fermetures B2B.',
    ar: 'العروض والتسعيرات والعقود واتفاقيات السرية مع توقيعات إلكترونية ملزمة قانوناً؛ تزيد +40% من إغلاق المبيعات B2B.',
    hi: 'प्रोपोज़ल्स, कोट्स, कॉन्ट्रैक्ट्स, NDA, कानूनी रूप से बाध्यकारी ई-सिग्नेचर के साथ — B2B सेल्स में +40% क्लोज़ रेट।'
  },
  'fadada-sign': {
    es: 'Firmas electrónicas conforme a China: criptografía nacional, depósito notarial, admisibilidad judicial e integraciones API REST.',
    fr: 'Signatures électroniques conformes Chine : cryptographie nationale, dépôt notarial, recevabilité judiciaire, API REST.',
    ar: 'توقيعات إلكترونية متوافقة مع الصين: تشفير وطني، وإيداع كاتب العدل، والقبول القضائي، وتكامل واجهات برمجة.',
    hi: 'चाइना-कम्प्लाइंट ई-सिग्नेचर्स: नेशनल क्रिप्टोग्राफी, नोटरी डिपॉज़िट, जूडिशल एडमिसिबिलिटी, REST API इंटीग्रेशन।'
  },
  'shangshangqian': {
    es: 'Firmas electrónicas SaaS empresariales con más de 200 integraciones nativas; autenticación de nombre real, notario blockchain, firmas masivas.',
    fr: 'Signatures électroniques SaaS entreprise avec 200+ intégrations natives ; auth réel, notaire blockchain, signature de masse.',
    ar: 'توقيعات إلكترونية للمؤسسات بـ +200 تكامل أصلي، وتوثيق بالاسم الحقيقي، وكتابة عدلية بلوكتشين، وتوقيعات جماعية.',
    hi: 'एंटरप्राइज SaaS ई-सिग्नेचर्स: 200+ नेटिव इंटीग्रेशन, असली नाम सत्यापन, ब्लॉकचैन नोटराइज़ेशन, बल्क साइनिंग।'
  },
  'good-acc': {
    es: 'Contabilidad en la nube de Yonyou para microempresas: captura automática de facturas, contabilidad, presentación de impuestos con un clic y panel.',
    fr: 'Comptabilité cloud Yonyou pour micro-entreprises : capture auto des factures, comptabilité, déclaration TVA en 1 clic et dashboard propriétaire.',
    ar: 'محاسبة سحابية يونيويو للمشاريع الصغيرة: تلتقط الفواتير تلقائياً وترحل الحسابات وتقدم الضرائب بنقرة واحدة ولوحة قيادة.',
    hi: 'माइक्रो-बिज़नेस के लिए Yonyou क्लाउड अकाउंटिंग: ऑटो इनवॉइस कैप्चर, बुककीपिंग, वन-क्लिक टैक्स फाइलिंग, ओनर डैशबोर्ड।'
  },
  'mingpian全能王': {
    es: 'Reconoce tarjetas de visita con una foto y guárdalas automáticamente. CRM de seguimiento, recordatorios de agenda, deseos de fiestas — interoperable con tarjetas WeChat.',
    fr: 'Reconnaît les cartes de visite en une photo et les enregistre automatiquement. CRM de suivi, rappels agenda, vœux — interopérable cartes WeChat.',
    ar: 'يتعرف على بطاقات الأعمال بصورة واحدة ويخزنها تلقائياً: إدارة العملاء، وتذكيرات بالمواعيد، وتهنئة بالمناسبات مع دعم بطاقات WeChat.',
    hi: 'फोटो से सेकेंडों में बिज़नेस कार्ड पहचान और ऑटो इन्वेंट्री। CRM कस्टमर फॉलो-अप, शेड्यूल रिमाइंडर, त्योहारों की बधाई — WeChat कार्ड इंटरऑप।'
  },
  'aiqicha-query': {
    es: 'Búsqueda gratuita de registros empresariales de Baidu: información corporativa, accionistas, riesgos legales y propiedad intelectual. Imprescindible antes de colaborar.',
    fr: 'Recherche gratuite de registres d\'entreprises Baidu : infos société, actionnaires, risques juridiques, PI — à vérifier avant partenariat.',
    ar: 'بحث مجاني لشركات بايدو: بيانات الشركة والمساهمين والمخاطر القانونية والملكية الفكرية، لابد منه قبل أي تعاون.',
    hi: 'Baidu का फ्री बिज़नेस रजिस्ट्री सर्च: कॉर्पोरेट जानकारी, शेयरधारक, कानूनी जोखिम, IPR — पार्टनरशिप से पहले मस्ट-चेक।'
  },
  'tianyancha': {
    es: 'Los grandes datos de crédito empresarial más autoritarios de China; gráficos de relaciones, minería de beneficiarios finalistas e investigación exhaustiva.',
    fr: 'Les données de crédit d\'entreprise les plus autoritaires en Chine ; graphes de relations, détection UBO, due diligence profonde.',
    ar: 'بيانات الائتمان الشرعي الأكثر موثوقية في الصين؛ رسومات علاقاتية، والكشف عن المستفيدين الحقيقيين، والتدقيق العميق.',
    hi: 'चीन का सबसे अधिकृत बिज़नेस क्रेडिट बिग डेटा: रिलेशनशिप ग्राफ, UBO खनन, ड्यू डिलिजेंस डीप-डाइव।'
  },
  'harvest-invoice': {
    es: 'Tiempo + facturación online unificados; convierte automáticamente horas facturables en facturas, pagos con tarjeta/PayPal, recordatorios y panel.',
    fr: 'Temps + facturation en ligne unifiés ; convertit auto les heures facturables en factures, paiements CB/PayPal, rappels auto, dashboard AR.',
    ar: 'موحد للتوقيت والفوترة: يحول ساعات العمل الفوترة تلقائياً إلى فواتير مع مدفوعات بطاقات وباي بال وتذكيرات ولوحة.',
    hi: 'टाइम + ऑनलाइन इनवॉइसिंग यूनिफाइड; बिलेबल घंटे को ऑटो इनवॉइस में बदलें, कार्ड/PayPal पेमेंट, ऑटो रिमाइंडर, AR डैशबोर्ड।'
  },
  'freshbooks-cloud': {
    es: 'Contabilidad en la nube para freelancers y equipos <5. Tiempo, facturación, gastos, pagos online, packs fiscales — punto de referencia norteamericano.',
    fr: 'Comptabilité cloud pour freelances et équipes <5. Temps, facturation, dépenses, paiements en ligne, packs fiscaux — standard NA.',
    ar: 'محاسبة سحابية للحرفيين المستقلين والفرق أقل من 5 عضو: وقت، وفوترة، ومصاريف، ومدفوعات، وباقات ضريبية.',
    hi: 'फ्रीलांसर्स और <5 टीम के लिए क्लाउड अकाउंटिंग। टाइम, इनवॉइसिंग, ख़र्चे, ऑनलाइन पेमेंट, टैक्स पैक — अमेरिकी फ्रीलांसर्स का स्टैंडर्ड।'
  },
  'wave-invoicing': {
    es: 'Facturación + contabilidad verdaderamente gratuita para siempre. Facturas, clientes, conciliación bancaria, informes ilimitados — coste cero.',
    fr: 'Facturation + comptabilité vraiment gratuites à vie. Factures, clients, rapprochement bancaire, rapports — illimités, zéro coût.',
    ar: 'فوترة + محاسبة مجانية للأبد بدون أي شروط: فواتير غير محددة وعملاء وتسوية بنكية وتقارير بتكلفة صفر.',
    hi: 'सच में हमेशा के लिए फ्री इनवॉइसिंग + अकाउंटिंग। अनलिमिटेड इनवॉइस, क्लाइंट्स, बैंक रिकंसिलिएशन, रिपोर्ट्स — जीरो स्टार्टअप लागत।'
  },
  'toggl-track': {
    es: 'Imprescindible para freelancers por hora. Temporizadores con un clic, etiquetas de proyecto/cliente, informes semanales/mensuales — exporta directamente.',
    fr: 'Indispensable aux freelancers horaires. Minuteries en un clic, tags projet/client, rapports hebdo/mensuels — export direct vers facturation.',
    ar: 'ضروري للحرفيين بالساعة: مؤقت بنقرة واحدة، وعلامات للمشاريع والعملاء، وتقارير أسبوعية وشهرية، مع تصدير مباشر.',
    hi: 'ऑवरली फ्रीलांसर्स का मस्ट-हेव। वन-क्लिक टाइमर, प्रोजेक्ट/क्लाइंट टैग, साप्ताहिक/मासिक रिपोर्ट्स — इनवॉइस में सीधे एक्सपोर्ट।'
  },

  // ---------- 6. 开发者工具AI编程 ----------
  'trae-cn': {
    es: 'IDE chino con IA: modelos LLM, autocompletado, corrección automática de errores, generación de documentos y vista previa en vivo. Aumenta 10x la productividad.',
    fr: 'IDE chino propulsé par l\'IA : LLMs, auto-complétion, correction de bugs, génération de docs et preview en direct — 10x la productivité solo.',
    ar: 'بيئة تطوير صينية مدعومة بالذكاء الاصطناعي: نماذج لغة، وتكميل تلقائي، وإصلاح أخطاء، وتوليد وثائق ومعاينة مباشرة.',
    hi: 'LLM वाला चाइना AI-पावर्ड IDE: ऑटो-कंप्लीशन, ऑटो बग-फिक्स, डॉक जेनरेशन और लाइव पूर्वावलोकन — सोलो डेव 10x प्रोडक्टिविटी।'
  },
  'codeium-free': {
    es: 'Completación de código AI gratuita para siempre para más de 70 lenguajes en VSCode, JetBrains, Neovim y Vim. Chat + búsqueda + autocompletado.',
    fr: 'Complétion de code IA gratuite à vie pour 70+ langages sur VSCode, JetBrains, Neovim, Vim. Chat + recherche + autocomplete intégrés.',
    ar: 'إكمال كود ذكاء اصطناعي مجاني للأبد ل+70 لغة برمجة على VSCode وJetBrains وNeovim وVim مع دردشة وبحث وتكملة.',
    hi: '70+ लैंग्वेज़ के लिए हमेशा के लिए फ्री AI कोड कंप्लीशन। VSCode/JetBrains/Neovim/Vim पर चैट + सर्च + ऑटोकम्प्लीट एक ही जगह।'
  },
  'carbon-now': {
    es: 'Favorito de los bloggers técnicos. Pega código → imágenes con resaltado de sintaxis, fondo degradado, números de línea y esquinas redondeadas.',
    fr: 'Préféré des blogueurs tech. Collez du code → belles images avec coloration syntaxique, fond dégradé, numéros de ligne, coins arrondis.',
    ar: 'المفضل لمدون التقنية: الصق الكود، واحصل على صور جميلة مع تلوين بناء الجملة وخلفية متدرجة وأرقام أسطر وزوايا دائرية.',
    hi: 'टेक ब्लॉगर्स का फेवरेट। कोड पेस्ट करें → ग्रेडियंट बैकग्राउंड, लाइन नंबर, राउंडेड कॉर्नर के साथ सिंटैक्स हाईलाइटेड तस्वीरें।'
  },
  'codepen-io': {
    es: 'La mayor comunidad de inspiración frontend. Pens HTML/CSS/JS en vivo; animaciones, widgets interactivos y arte CSS — inspiración UI diaria.',
    fr: 'La plus grande communauté d\'inspiration frontend. Pens HTML/CSS/JS en direct ; animations, widgets interactifs, art CSS — UI inspi quotidienne.',
    ar: 'أكبر مجتمع إلهام للواجهة الأمامية. أكواد HTML/CSS/JS حية، رسوم متحركة، وعناصر تفاعلية وفن CSS للإلهام اليومي.',
    hi: 'सबसे बड़ा फ्रंटएंड इंस्पायरेशन कम्युनिटी। लाइव HTML/CSS/JS पेन; एनीमेशन, इंटरैक्टिव विजेट्स, CSS आर्ट — रोज़ का UI प्रेरणा।'
  },

  // ---------- 7. 自由职业接单 ----------
  'dida-365': {
    es: 'La app líder GTD en China: tareas + calendario + pomodoro + informes de enfoque, sincronización en la nube y recordatorios WeChat/DingTalk.',
    fr: 'L\'app GTD leader en Chine : tâches + calendrier + pomodoro + rapports de focus, synchro cloud et rappels WeChat / DingTalk.',
    ar: 'تطبيق GTD الرائد في الصين: مهام + تقويم + بومودورو + تقارير تركيز، مع مزامنة سحابية وتذكيرات WeChat وDingTalk.',
    hi: 'चीन में नंबर 1 GTD ऐप: todos + कैलेंडर + पोमोडोरो + फोकस रिपोर्ट, क्लाउड सिंक, WeChat/DingTalk रिमाइंडर।'
  },
  'upwork-market': {
    es: 'El mayor mercado global para freelancers. Desarrollo, diseño, redacción, traducción, SEO y datos — pagos en USD; la plataforma de referencia.',
    fr: 'Le plus grand marché mondial du freelance. Dev, design, copy, traduction, SEO, data — paiements en USD ; la plateforme de référence.',
    ar: 'أكبر سوق عالمي للحرفيين المستقلين: برمجة، وتصميم، وكتابة، وترجمة، وتحسين محركات، وبيانات، مع مدفوعات الدولار.',
    hi: 'सबसे बड़ा ग्लोबल फ्रीलांस मार्केटप्लेस। डेव, डिज़ाइन, कॉपी, ट्रांसलेट, SEO, डेटा; USD पेआउट — बेंचमार्क प्लेटफॉर्म।'
  },
  'fiverr-gig': {
    es: 'Microservicios desde 5 dólares: logotipos, vídeo, SEO y redacción empaquetados como Gigs — ventas globales fáciles para principiantes.',
    fr: 'Micro-services dès 5 $ : logo, vidéo, SEO, copywriting packagés en Gigs — débutants vendent facilement dans le monde entier.',
    ar: 'خدمات صغيرة تبدأ من 5 دولارات: شعارات، وفيديو، وتحسين محركات، وكتابة مغلفة كخدمات جاهزة للمبتدئين للبيع عالمياً.',
    hi: '$5 से शुरुआत वाले माइक्रो-सर्विसेज़: लोगो, वीडियो, SEO, कॉपीराइटिंग — Gigs के तौर पर पैक, शुरुआती के लिए आसान ग्लोबल सेल्स।'
  },
  'zbj-service': {
    es: 'La mayor plataforma de servicios creativos de China: logos, identidad visual, sitios, apps, redacción y traducción. Compara cotizaciones.',
    fr: 'La plus grande plateforme de services créatifs en Chine : logos, VI, sites, apps, copy, traduction. Comparez les devis des prestataires.',
    ar: 'أكبر منصة خدمات إبداعية في الصين: شعارات، هوية بصرية، مواقع، تطبيقات، وكتابة، وترجمة مع مقارنة عروض الأسعار.',
    hi: 'चीन का सबसे बड़ा क्रिएटिव सर्विस प्लेटफॉर्म: लोगो, VI, साइट्स, ऐप्स, कॉपी, ट्रांसलेशन। विक्रेताओं की कोट की तुलना करें।'
  },
  'yuanling-work': {
    es: 'Tablero doméstico de trabajos freelance y remotos; facturación por hora o depósito de garantía por proyecto; desarrollo, diseño, ops, PM.',
    fr: 'Plateforme chinoise de jobs freelance et remote ; paiement horaire ou acompte par projet, roles dev/design/ops/PM matchés.',
    ar: 'لوظائف الصينية المستقلة والعن بعد: فواتير بالساعة أو ضمانات لكل مشروع مع مطابقة أدوار برمجة، وتصميم، وتشغيل، ومدير مشاريع.',
    hi: 'डोमेस्टिक फ्रीलांस और रिमोट जॉब बोर्ड; घंटे का या प्रोजेक्ट एस्क्रो बिलिंग, डेव/डिज़ाइन/ऑप्स/PM रोल्स मैच।'
  },
  'pj-work': {
    es: 'Matching freelance exclusivo de tecnología en China. Desarrolladores verificados, depósito por hitos, entrega de código fuente y garantía de mantenimiento.',
    fr: 'Matching freelance tech-only en Chine. Développeurs vérifiés, acompte par jalons, livraison code source, garantie de maintenance.',
    ar: 'مطابقة مشاريع برمجة فقط في الصين: مطورون موثوقون، ودفعات لكل مرحلة، وتسليم أكواد مصدرية، وضمان صيانة ما بعد التسليم.',
    hi: 'केवल चाइना टेक फ्रीलांस मैचिंग। वेरिफाइड डेवलपर्स, मीलस्टोन एस्क्रो, सोर्स कोड डिलीवरी और रखरखाव की गारंटी।'
  },
  'andco-freelance': {
    es: 'Sistema operativo freelance propiedad de Fiverr: propuestas, contratos, acuerdos, tiempo, facturas, pagos, impuestos — 90% administrativo automatizado.',
    fr: 'OS freelance propriétaire de Fiverr : propositions, contrats, NDAs, temps, factures, paiements, docs fiscaux — 90% d\'admin automatisé.',
    ar: 'نظام تشغيل للحرفيين مملوك لـ Fiverr: عروض، عقود، واتفاقيات سرية، وتوقيت، وفواتير، ومدفوعات، ومستندات ضريبية مع أتمتة 90%.',
    hi: 'Fiverr के स्वामित्व वाला फ्रीलांस OS: प्रोपोज़ल, कॉन्ट्रैक्ट्स, NDA, टाइम, इनवॉइस, पेमेंट, टैक्स डॉक्स — 90% एडमिन ऑटो।'
  },
  'bonsai-suite': {
    es: 'Paquete premium para freelancers: más de 1.000 plantillas revisadas por abogados, propuestas con marca, facturas recurrentes e informes fiscales.',
    fr: 'Bundle freelance premium : 1000+ templates validés par des avocats, propositions branded, factures récurrentes, rapports fiscaux — pour $100K+ par an.',
    ar: 'حزمة ممتازة للحرفيين: +1000 قالب بمراجعة محاماة، وعروض بعلامتك التجارية، وفواتير دورية، وتقارير ضريبية للمحترفين.',
    hi: 'प्रीमियम फ्रीलांस बंडल: 1000+ वकील-वेटेड टेम्पलेट्स, ब्रांडेड प्रोपोज़ल्स, रिकरिंग इनवॉइस, टैक्स रिपोर्ट्स — $100K+ इनकम वालों के लिए।'
  },

  // ---------- 8. 学习简历效率笔记翻译语言 ----------
  'skillshare-learn': {
    es: 'El favorito para mejorar en freelance. Más de 28.000 clases de calidad en diseño, vídeo, código, marketing, escritura y emprendimiento.',
    fr: 'Le préféré des freelances pour monter en compétences. 28K+ cours de qualité : design, vidéo, code, marketing, écriture, photo, entrepreneuriat.',
    ar: 'الأفضل للحرفيين المستقلين لرفع المهارة: +28 ألف دورة عالية الجودة في التصميم والفيديو والبرمجة والتسويق والكتابة والعمل الحر.',
    hi: 'फ्रीलांसर अपस्किलिंग फेवरेट। 28K+ क्वालिटी क्लासेज़: डिज़ाइन, वीडियो, कोड, मार्केटिंग, राइटिंग, फोटोग्राफी, उद्यमिता।'
  },
  'coursera-plus': {
    es: 'Cursos de las mejores universidades y empresas. Certificados profesionales de Google, IBM y Meta reconocidos globalmente.',
    fr: 'Cours des meilleures universités et entreprises. Certificats de carrière Google, IBM, Meta reconnus mondialement.',
    ar: 'دورات من أفضل الجامعات والشركات عالمياً. شهادات مهنية من جوجل وIBM وميتا معترف بها دولياً لبناء مهارات منظمة.',
    hi: 'टॉप यूनिवर्सिटी और कॉर्पोरेशन के कोर्स। Google, IBM, Meta करियर सर्टिफिकेट्स ग्लोबली रिकग्नाइज़्ड — स्ट्रक्चर्ड स्किल-बिल्डिंग।'
  },
  'degreed-skill': {
    es: 'Seguimiento unificado de habilidades para libros, cursos, certificados, proyectos y artículos; genera un informe visual de matriz de habilidades.',
    fr: 'Suivi unifié des compétences : livres, cours, certifs, projets, articles — génère un rapport visuel de matrice de compétences pour les clients.',
    ar: 'متابعة موحدة لمهارات الكتب والدورات والشهادات والمشاريع والمقالات مع إنشاء تقرير مصفوفة مهارات بصري لعرضه على العملاء.',
    hi: 'किताबें, कोर्स, सर्ट, प्रोजेक्ट, आर्टिकल्स के लिए यूनिफाइड स्किल ट्रैकिंग — क्लाइंट्स के लिए विज़ुअल स्किल मैट्रिक्स रिपोर्ट।'
  },
  'canva-resume': {
    es: 'Más de 500 plantillas profesionales de CV: de una página, creativos, diseñadores, desarrolladores y PM. Exporta gratis a PDF/PNG.',
    fr: '500+ templates de CV pro : une page, créatif, designer, dev, PM. Export gratuit en PDF/PNG pour la recherche d\'emploi ou le freelance.',
    ar: '+500 قالب سيرة ذاتية احترافية: صفحة واحدة، إبداعية، ومصممين، ومبرمجين، ومديري مشاريع، مع تصدير مجاني إلى PDF/PNG.',
    hi: '500+ प्रोफेशनल रिज़्यूमे टेम्पलेट्स: वन-पेज, क्रिएटिव, डिज़ाइनर, डेव, पीएम। जॉब/फ्रीलांस हंट के लिए मुफ्त PDF/PNG एक्सपोर्ट।'
  },
  'standard-resume': {
    es: 'CV limpios compatibles con ATS para devs/diseñadores/PM. Rellena línea por línea, se autoformatea a la página preferida de reclutadores.',
    fr: 'CV propres compatibles ATS pour devs/designers/PMs. Remplissez ligne par ligne, auto-formatage en 1 page recruteur-friendly, import LinkedIn.',
    ar: 'سير ذاتية نظيفة متوافقة مع أنظمة ATS للمطورين والمصممين ومديري المشاريع مع ملء سطر بسطر وتنسيق تلقائي صفحة واحدة.',
    hi: 'डेव/डिज़ाइनर/PM के लिए ATS-फ्रेंडली क्लीन रिज़्यूमे। लाइन-बाय-लाइन भरें, रिक्रूटर पसंदीदा 1-पेज में ऑटो-फॉर्मेट, LinkedIn इम्पोर्ट।'
  },
  'read-cv': {
    es: 'Alternativa a LinkedIn para creativos. Mini portafolios + CV + comunidad; oportunidades de referencia seleccionadas y trabajos internos.',
    fr: 'Alternative LinkedIn pour travailleurs créatifs. Mini portfolios + CV + communauté, opportunités de parrainage curées et jobs internes.',
    ar: 'بديل لينكدإن للعاملين المبدعين: ملفات أعمال مصغرة + سير ذاتية + مجتمع، مع فرص إحالات مختارة ووظائف داخلية.',
    hi: 'क्रिएटिव्स का लिंक्डइन विकल्प। मिनी पोर्टफोलियो + रिज़्यूमे + कम्युनिटी, क्यूरेटेड रेफरल और आंतरिक नौकरियां।'
  },
  'tide-focus': {
    es: 'Concentración profunda 3 en 1: ruido blanco, Pomodoro 25/5 y estadísticas de enfoque. Sonidos ASMR de lluvia, café, océano y biblioteca.',
    fr: 'Concentration profonde 3-en-1 : bruit blanc, Pomodoro 25/5, stats de focus. Sons ASMR pluie, café, océan, bibliothèque.',
    ar: 'تركيز عميق ثلاثي في واحد: ضوضاء بيضاء، ومؤقت بومودورو 25/5، وإحصائيات تركيز مع أصوات أمطار ومقهى ومحيط ومكتبة.',
    hi: 'डीप फोकस 3-इन-1: व्हाइट नॉइज़, 25/5 पोमोडोरो, फोकस स्टैट्स। बारिश, कैफे, महासागर, पुस्तकालय ASMR — होम-ऑफिस विकर्षण दूर करें।'
  },
  'noisli-bg': {
    es: 'Mezcla y combina sonidos de fondo: cafetería, lluvia, mecanografía, fuego, pájaros y trenes. Volumen independiente, temporizador y mini editor de texto.',
    fr: 'Mixez des sons de fond : café, pluie, frappe, feu, oiseaux, train. Volume indépendant par canal, minuterie + mini éditeur de texte.',
    ar: 'امزج خلفيات صوتية متعددة: مقهى، ومطر، وكتابة، ونار، وطيور، وقطارات. مستوى صوت لكل قناة مع مؤقت ومحرر نصوص صغير.',
    hi: 'बैकग्राउंड साउंड मिक्स-एंड-मैच: कैफे, बारिश, टाइपिंग, आग, पक्षियों, ट्रेन। अलग-अलग वॉल्यूम, टाइमर + मिनी टेक्स्ट एडिटर।'
  },
  'forest-focus': {
    es: 'Planta árboles virtuales durante las sesiones; si abandonas antes, el árbol muere. Acumula monedas para plantar árboles REALES. Anti-procrastinación.',
    fr: 'Plantez des arbres virtuels pendant les sessions focus ; si vous quittez avant, l\'arbre meurt. Gagnez des pièces pour planter de VRAIS arbres.',
    ar: 'ازرع أشجار افتراضية أثناء الجلسات، إذا غادرت مبكراً تموت الشجرة، واجمع عملات لزراعة أشجار حقيقية في الحياة!',
    hi: 'फोकस सेशन में वर्चुअल ट्री लगाएं; जल्दी बाहर निकला तो पेड़ मर जाएगा। सिक्के जमा करें और असली पेड़ लगवाएं।'
  },
  'todoist-gtd': {
    es: 'Mundialmente famosa app GTD con análisis de fecha en lenguaje natural, proyectos, etiquetas, prioridades, reglas recurrentes y Karma.',
    fr: 'App GTD mondialement célèbre avec parsing de dates en langage naturel, projets, labels, priorités, règles récurrentes, Karma et tous les appareils.',
    ar: 'تطبيق GTD العالمي الشهير مع فهم التواريخ باللغة الطبيعية، ومشاريع، وعلامات، وأولويات، وقواعد متكررة، ودرجات كارما.',
    hi: 'विश्व प्रसिद्ध GTD ऐप: नेचुरल लैंग्वेज डेट पार्सिंग, प्रोजेक्ट, लेबल, प्रायोरिटी, रिकरिंग रूल्स, कर्मा और ऑल-डिवाइस सिंक।'
  },
  'ms-todo': {
    es: 'Tareas gratuitas de Microsoft con integración profunda de Outlook, Teams y Office. Vistas Mi Día / Planeado / Importante — flujo Office perfecto.',
    fr: 'Tâches Microsoft gratuites, intégration profonde Outlook, Teams, Office. Vues Mon Jour / Planifié / Important — sans couture au sein Office.',
    ar: 'مهام مجانية من مايكروسوفت مع تكامل عميق مع أوتلوك وتيمز وأوفيس. عروض: يومي/مخطط/مهم — سير عمل أوفيس سلس.',
    hi: 'फ्री Microsoft टास्क्स, गहरा Outlook/Teams/Office इंटीग्रेशन। "आज का दिन / नियोजित / महत्वपूर्ण" व्यू — सीलम ऑफिस वर्कफ़्लो।'
  },
  'obsidian-publish': {
    es: 'Notas markdown locales con enlaces bidireccionales. Gran cantidad de plugins y temas; ideal para Zettelkasten personal y documentación.',
    fr: 'Notes markdown locale-first avec liens bidirectionnels. Plugins et thèmes à gogo ; parfait pour Zettelkasten perso et docu produit.',
    ar: 'ملاحظات ماركداون محلية الصنع مع روابط ثنائية الاتجاه، وعدد كبير من الإضافات والسمات، مثالية لـ Zettelkasten وتوثيق المنتجات.',
    hi: 'लोकल-फर्स्ट मार्कडाउन द्वि-दिशात्मक लिंक वाले नोट्स। बहुत सारे प्लगइन और थीम — पर्सनल जेटलकास्टन और प्रोडक्ट डॉक्स के लिए बेस्ट।'
  },
  'roam-research': {
    es: 'La app original de notas bidireccionales. Notas diarias, referencias a nivel de bloque y vista de grafo para escritores, PMs e investigadores.',
    fr: 'L\'appli originelle de notes bidirectionnelles. Daily Notes, références au niveau bloc, vue graphe — écrivains, PMs, chercheurs adorent.',
    ar: 'التطبيق الأصلي للملاحظات ثنائية الاتجاه: ملاحظات يومية، ومراجع على مستوى الكتلة، وعرض بياني للكتّاب ومديري المشاريع والباحثين.',
    hi: 'ओरिजिनल द्वि-दिशात्मक नोट ऐप। डेली नोट्स, ब्लॉक-लेवल संदर्भ और ग्राफ़ व्यू — लेखक, PM और शोधकर्ताओं के पसंदीदा।'
  },
  'duolingo-web': {
    es: 'La app gratuita de idiomas #1 del mundo. Más de 40 idiomas con lecciones tipo juego, rachas y ligas — microestudio adictivo diario.',
    fr: 'L\'appli gratuite d\'apprentissage des langues #1 mondiale. 40+ langues avec cours type jeu, séries, ligues — micro-étude quotidienne addictive.',
    ar: 'التطبيق المجاني الأول عالمياً لتعلم اللغات: +40 لغة بدروس تفاعلية وشكل ألعاب، وسياسات متتالية وفرق تنافس.',
    hi: 'विश्व का नंबर 1 फ्री लैंग्वेज ऐप। 40+ भाषाएँ, गेम-जैसे लेसन, स्ट्रीक्स, लीग्स — दिन की आसान माइक्रो-स्टडी।'
  },
  'anki-web': {
    es: 'La app SRS estándar de oro. Mazos propios o compartidos para exámenes, medicina, derecho e idiomas; revisiones científicas.',
    fr: 'L\'appli SRS de référence. Decks créés par vous ou partagés pour examens, médecine, droit, langues — révision par courbe d\'oubli scientifique.',
    ar: 'التطبيق الذهبي المعيار للتكرار المباعد: مجموعات خاصة أو مشتركة للامتحانات والطب والقانون واللغات مع مراجعة علمية.',
    hi: 'गोल्ड स्टैंडर्ड SRS ऐप। परीक्षा, मेडिसिन, लॉ, लैंग्वेज़ के लिए खुद के या शेयर किए गए डेक्स। साइंटिफिक फॉरगेटिंग कर्व रिव्यू।'
  },
  'grammarly-check': {
    es: 'El asistente de escritura en inglés más popular. Gramática, tono, plagio y académico — esencial para escritores y traductores.',
    fr: 'L\'assistant d\'écriture anglaise le plus populaire. Grammaire, ton, plagiat, académique — essentiel pour les écrivains et traducteurs.',
    ar: 'المساعد الأكثر شعبية للكتابة باللغة الإنجليزية: قواعد، ونبرة، وانتحال، وكتابة أكاديمية — ضروري للكتاب والمترجمين.',
    hi: 'सबसे लोकप्रिय अंग्रेज़ी राइटिंग असिस्टेंट। ग्रामर, टोन, प्लेजरिज़म, अकादमिक चेक — लेखक और अनुवादकों के लिए आवश्यक।'
  },
  'netease-jianwai': {
    es: 'Traducción AI de subtítulos de NetEase: subtítulos bilingües, audio a texto, traducción de documentos. Red doméstica rápida con licencia ICP china.',
    fr: 'Traduction IA de sous-titres NetEase : sous-titres bilingues, audio-vers-texte, traduction de documents. Réseau domestique rapide, licence ICP.',
    ar: 'ترجمة ذكاء اصطناعي للترجمة من نت إيز: ترجمة ثنائية، وتحويل صوت إلى نص، وترجمة مستندات، بشبكة محلية سريعة وترخيص ICP.',
    hi: 'NetEase AI कैप्शन ट्रांसलेशन: द्विभाषी सबटाइटल्स, ऑडियो-टू-टेक्स्ट, डॉक्यूमेंट ट्रांसलेशन। चाइना हाई-स्पीड नेटवर्क और ICP लाइसेंस।'
  },
  'deepl-translate': {
    es: 'Traductor AI ampliamente reconocido como el mejor; más de 30 idiomas con conciencia contextual, además de traducción de documentos con formato.',
    fr: 'Traducteur IA unanimement reconnu comme le meilleur ; 30+ langues avec sensibilité contextuelle + traduction de documents formatés.',
    ar: 'مترجم ذكاء اصطناعي معترف به كالأفضل عالمياً: +30 لغة مع وعي سياقي وترجمة مستندات مع الحفاظ على التنسيق.',
    hi: 'व्यापक रूप से सर्वश्रेष्ठ माना जाने वाला AI ट्रांसलेटर। 30+ भाषाएँ संदर्भ जागरूकता के साथ-साथ स्वरूपित दस्तावेज़ों का अनुवाद।'
  },
  'ilovepdf-io': {
    es: 'La mejor herramienta PDF del mundo. Fusiona, divide, comprime, convierte a Word/Excel/PPT/Imagen, cifra, marca de agua, rota y OCR.',
    fr: 'Le meilleur outil PDF au monde. Fusion, division, compression, conversion Word/Excel/PPT/Image, chiffrement, filigrane, rotation, OCR — 25+ fonctions.',
    ar: 'أفضل أداة PDF في العالم: دمج، وتقسيم، وضغط، وتحويل إلى وورد/إكسل/PPT/صورة، وتشفير وعلامة مائية وتدوير وتعرف بصري.',
    hi: 'वर्ल्ड बेस्ट PDF टूल: मर्ज, स्प्लिट, कंप्रेस, वर्ड/एक्सेल/PPT/इमेज में कन्वर्ट, एन्क्रिप्ट, वॉटरमार्क, पेज रोटेट, OCR — 25+ एक्शन।'
  },
  'smallpdf-tools': {
    es: 'La navaja suiza del PDF. Más de 20 herramientas limpias y sin anuncios; integración en la nube con Google Drive y Dropbox.',
    fr: 'La boîte à outils PDF type couteau suisse. 20+ outils clean sans pub ; intégration cloud Google Drive, Dropbox, OneDrive — sauvegarde directe.',
    ar: 'الأداة السويسرية للملفات PDF: +20 أداة نظيفة بدون إعلانات مع تكامل درايف جوجل ودروب بوكس واون درايف.',
    hi: 'PDF का स्विस आर्मी चाकू। 20+ साफ़-सुथरे बिना विज्ञापन वाले टूल। Google Drive, Dropbox, OneDrive सिंक — क्लाउड में वापस सेव।'
  },
  'kami-pdf': {
    es: 'La app de anotación PDF favorita de K-12. Resalta, texto, voz, firma y dibuja sobre PDF/Word/imágenes; integración con Google Classroom.',
    fr: 'L\'appli d\'annotation PDF préférée du K-12. Surligne, texte, voix, signature et dessin sur PDF/Word/images — intégration Google Classroom.',
    ar: 'تطبيق الشرح المفضل للمرحلة الدراسية K-12: تظليل نصي وصوتي وتوقيع ورسم على PDF/وورد/صور مع تكامل جوجل كلاسروم.',
    hi: 'K-12 का पसंदीदा PDF एनोटेशन ऐप। PDF/वर्ड/इमेज पर हाइलाइट, टेक्स्ट, वॉइस, सिग्नेचर और ड्रॉ — Google Classroom इंटीग्रेशन।'
  },
  'lightpdf-cloud': {
    es: 'PDF cloud doméstico chino. Conversión Word/Excel/PPT/JPG/TXT, reconocimiento OCR, edición, firma y marca de agua conforme.',
    fr: 'PDF cloud chinois domestique. Conversion Word/Excel/PPT/JPG/TXT, OCR, édition, signature, marque d\'eau conforme.',
    ar: 'PDF سحابي صيني محلي: تحويل وورد/إكسل/PPT/JPG/TXT + التعرف الضوئي + تحرير + توقيع + علامة مائية قانونية.',
    hi: 'डोमेस्टिक चाइना PDF क्लाउड। Word/Excel/PPT/JPG/TXT रूपांतरण, OCR पढ़ना, एडिट, सिग्नेचर, कॉम्प्लाइंट वॉटरमार्क।'
  },

  // ---------- 9. 作品集社区展示 ----------
  'dribbble-design': {
    es: 'La plataforma principal de portafolios para diseñadores. UI/UX, ilustración, motion y branding. Publica obras para atraer consultas freelance.',
    fr: 'La plateforme portfolio de référence des designers. UI/UX, illustration, motion, branding. Postez vos œuvres pour attirer des clients freelance.',
    ar: 'منصة البورتفوليو الأولى للمصممين: واجهات/تجربة مستخدم/توضيح/موشن/براندينج. انشر أعمالك لجلب عملاء حرين.',
    hi: 'डिज़ाइनरों की शीर्ष पोर्टफोलियो प्लेटफॉर्म। UI/UX, इलस्ट्रेशन, मोशन, ब्रांडिंग। पोस्ट करें और फ्रीलांस इनक्वायरी पाएँ।'
  },
  'behance-portfolio': {
    es: 'Escaparate creativo de Adobe. Proyectos largos de gráfica, UI, arquitectura y fotografía; Adobe Talent conecta a empleos premium.',
    fr: 'Vitrines créatives d\'Adobe. Projets longs : graphisme, UI, architecture, photo — Adobe Talent connecte aux offres premium.',
    ar: 'عروض إبداعية أدوبي: مشاريع طويلة للجرافيك وUI والعمارة والتصوير؛ أدوبي تالنت يربطك بوظائف متميزة.',
    hi: 'Adobe का क्रिएटिव शोकेस। ग्राफिक, UI, आर्किटेक्चर, फोटोग्राफी लंबे प्रोजेक्ट्स — Adobe Talent प्रीमियम जॉब्स कनेक्ट करता है।'
  },
  'notion-templates': {
    es: 'Miles de plantillas gratuitas curadas de Notion: OKR, Segundo Cerebro, CRM, planificador de viajes, hábitos y presupuesto.',
    fr: 'Des milliers de templates Notion gratuits et triés sur le volet : OKR, Second Brain, CRM, trip planner, habit tracker, budget.',
    ar: 'آلاف قوالب نوشيون المجانية المختارة بعناية: OKR، دماغ ثانٍ، إدارة علاقات، مخطط سفر، متابعة العادات، ميزانية.',
    hi: 'हज़ारों क्यूरेटेड मुफ्त नोशन टेम्पलेट्स: OKR, सेकंड ब्रेन, CRM, ट्रिप प्लानर, आदत ट्रैकर, बजट — डुप्लिकेट और चलाएँ।'
  },
  'product-hunt': {
    es: 'El lugar para descubrir productos nuevos. Lanzamientos diarios de SaaS, herramientas, apps e IA. Los fundadores independientes investigan.',
    fr: 'Le lieu de découverte des nouveaux produits. Lancements SaaS, outils, apps, IA chaque jour. Les indiehackers étudient la concurrence et y lancent leurs produits.',
    ar: 'المكان المناسب لاكتشاف المنتجات الجديدة: إطلاق SaaS والأدوات والتطبيقات والذكاء الاصطناعي يوميًا. يدرس المؤسسون المنافسين هناك.',
    hi: 'नए प्रोडक्ट्स की खोज करने की जगह। SaaS, टूल्स, ऐप्स, AI के रोजाना लॉन्च। इंडीहैकर्स प्रतिद्वंदी रिसर्च + लॉन्च यहीं करते हैं।'
  },
  'hunt-webflow': {
    es: 'Constructor sin código pensado primero en diseñadores. Arrastrar y soltar, CMS, formularios, pagos, multilingüe y SEO; los freelancers crean sitios.',
    fr: 'Constructeur no-code d\'abord pour les designers. Glisser-déposer, CMS, formulaires, paiements, multilingue, SEO — freelances livrent en jours.',
    ar: 'منشئ بدون برمجة للمصممين أولاً: سحب وإفلات, CMS, نماذج, مدفوعات, متعدد اللغات, تحسين محركات؛ يبني الحرفيون مواقع بأيام.',
    hi: 'डिज़ाइनर-फर्स्ट नो-कोड बिल्डर। ड्रैग-एंड-ड्रॉप, CMS, फ़ॉर्म्स, पेमेंट्स, मल्टीलिंगुअल, SEO — फ्रीलांसर्स दिनों में डिलीवर करते हैं।'
  },
};

// ============================================================
// C. 描述(description)字段的英文整段翻译字典
//    先提取 en 中占位的 description，手工翻译最常用的 100 个
// ============================================================
const DESC_DICT = {
  'Online 163 news for news, portal, email, games. Works right in your browser — free, no ads, no sign up required.': {
    es: 'Noticias 163 online: noticias, portal, correo y juegos. Funciona directamente en el navegador, sin anuncios ni registro.',
    fr: 'Actualités 163 en ligne : portail, e-mail et jeux. Fonctionne dans le navigateur — gratuit, sans pub, aucune inscription.',
    ar: 'أخبار 163 عبر الإنترنت: الأخبار والبوابة والبريد والألعاب. يعمل في المتصفح، مجاني بدون إعلانات أو تسجيل.',
    hi: '163 ऑनलाइन समाचार, पोर्टल, ईमेल, गेम। ब्राउज़र में सीधे चलता है — मुफ़्त, बिना विज्ञापन, बिना साइनअप।'
  },
  'Encode and decode Base64 strings, files, and data URLs with live preview. RFC 4648 compliant — supports URL-safe variants and UTF-8 input of any script.': {
    es: 'Codifica y decodifica cadenas, archivos y URL de datos con vista previa. Compatible con RFC 4648 y variantes seguras para URL.',
    fr: 'Encode et décode Base64 : chaînes, fichiers et data URLs avec aperçu. Conforme RFC 4648, variantes URL-safe, UTF-8 multi-langues.',
    ar: 'ترميز وفك ترميز Base64 للسلاسل والملفات وعناوين البيانات مع معاينة فورية، متوافق مع RFC 4648.',
    hi: 'Base64 स्ट्रिंग, फ़ाइलें, डेटा URL को एनकोड/डिकोड करें, लाइव पूर्वावलोकन सहित। RFC 4648 मानक अनुसार।'
  },
  'Encode, decode, and percent-escape URLs and query strings according to RFC 3986. Also supports application/x-www-form-urlencoded parsing for query parameter debugging.': {
    es: 'Codifica, decodifica y escapa URLs y cadenas de consulta según RFC 3986. También parsea parámetros application/x-www-form-urlencoded.',
    fr: 'Encode, décode et échappe URLs et query strings (RFC 3986). Parse aussi application/x-www-form-urlencoded pour déboguer les paramètres.',
    ar: 'ترميز وفك ترميز وعلامة النسبة لعناوين URL ولسلاسل الاستعلام وفق RFC 3986، مع تحليل المعاملات.',
    hi: 'RFC 3986 के अनुसार URL और क्वेरी स्ट्रिंग को एनकोड/डिकोड करें। फॉर्म डिबगिंग सहायक के साथ।'
  },
};

// ============================================================
// 工具函数：翻译 name
// ============================================================
function translateName(enName, locale) {
  // 1) Full match first
  if (FULLNAME_DICT[enName] && FULLNAME_DICT[enName][locale]) return FULLNAME_DICT[enName][locale];
  // 2) Try Suffix match (longest → shortest so "Language Scheduling" beats "Scheduling")
  const suffixes = Object.keys(SUFFIX_DICT).sort((a, b) => b.length - a.length);
  for (const sfx of suffixes) {
    const re = new RegExp(`\\s+${sfx.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`); // 结尾空格+suffix
    if (re.test(enName)) {
      const brand = enName.replace(re, '').trim();
      return `${brand} ${SUFFIX_DICT[sfx][locale]}`;
    }
  }
  // 3) Fallback: check any substring suffix match for no-space compounds
  for (const sfx of suffixes) {
    if (enName.endsWith(sfx)) {
      const brand = enName.slice(0, -sfx.length).replace(/[-\s]+$/, '');
      return brand ? `${brand} ${SUFFIX_DICT[sfx][locale]}` : SUFFIX_DICT[sfx][locale];
    }
  }
  // 4) Unchanged (brand-only, keep English)
  return enName;
}

function translateDescription(tid, enDesc, locale) {
  if (DESC_BY_TID[tid] && DESC_BY_TID[tid][locale]) return DESC_BY_TID[tid][locale];
  return (DESC_DICT[enDesc] && DESC_DICT[enDesc][locale]) || enDesc;
}

// ============================================================
// 执行：遍历目标语言，仅回写仍等于en的占位值
// ============================================================
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'en', 'translation.json'), 'utf8'));
let totalUpdatedNames = 0, totalUpdatedDescs = 0;

for (const locale of ['es', 'fr', 'ar', 'hi']) {
  const filePath = path.join(ROOT, locale, 'translation.json');
  const obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!obj.tools) obj.tools = {};
  let names = 0, descs = 0;
  for (const toolId of Object.keys(en.tools || {})) {
    const enTool = en.tools[toolId];
    if (!enTool) continue;
    if (!obj.tools[toolId]) obj.tools[toolId] = {};
    // name
    if (obj.tools[toolId].name === enTool.name) {
      const candidate = translateName(enTool.name, locale);
      if (candidate !== enTool.name) {
        obj.tools[toolId].name = candidate;
        names++;
      }
    }
    // description
    if (obj.tools[toolId].description === enTool.description) {
      const candidate = translateDescription(toolId, enTool.description, locale);
      if (candidate !== enTool.description) {
        obj.tools[toolId].description = candidate;
        descs++;
      }
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`[${locale}] 回写：name=${names}个,  description=${descs}个，文件已保存: ${filePath}`);
  totalUpdatedNames += names;
  totalUpdatedDescs += descs;
}

console.log(`\n✅ 本次总更新：name=${totalUpdatedNames}处, description=${totalUpdatedDescs}处`);
console.log('(余下未覆盖的description会在后续批次按工具类别继续补充)');
