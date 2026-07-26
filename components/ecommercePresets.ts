// ecommercePresets.ts - Platform presets, translations, ZIP utilities, and image processing
// Shared between EcommerceImageProcessor component and any future ecommerce tools

export interface SizeTemplate {
  id: string;
  label: Record<string, string>;
  width: number;
  height: number;
  maxSizeMB: number;
  format: 'jpeg' | 'png' | 'webp';
}

export interface PlatformPreset {
  id: string;
  name: Record<string, string>;
  region: string;
  icon: string;
  templates: SizeTemplate[];
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'amazon',
    name: { zh: '亚马逊 Amazon', en: 'Amazon', es: 'Amazon', fr: 'Amazon', hi: 'अमेज़न', ar: 'أمازون' },
    region: 'Global',
    icon: '🛒',
    templates: [
      { id: 'amazon-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 2000, height: 2000, maxSizeMB: 10, format: 'jpeg' },
      { id: 'amazon-thumb', label: { zh: '缩略图', en: 'Thumbnail', es: 'Miniatura', fr: 'Vignette', hi: 'थंबनेल', ar: 'صورة مصغرة' }, width: 500, height: 500, maxSizeMB: 2, format: 'jpeg' },
    ],
  },
  {
    id: 'ebay',
    name: { zh: 'eBay', en: 'eBay', es: 'eBay', fr: 'eBay', hi: 'eBay', ar: 'eBay' },
    region: 'Global',
    icon: '🏷️',
    templates: [
      { id: 'ebay-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 1200, height: 1200, maxSizeMB: 8, format: 'jpeg' },
    ],
  },
  {
    id: 'shopify',
    name: { zh: 'Shopify', en: 'Shopify', es: 'Shopify', fr: 'Shopify', hi: 'Shopify', ar: 'Shopify' },
    region: 'Global',
    icon: '🛍️',
    templates: [
      { id: 'shopify-product', label: { zh: '产品图', en: 'Product', es: 'Producto', fr: 'Produit', hi: 'उत्पाद', ar: 'المنتج' }, width: 2048, height: 2048, maxSizeMB: 10, format: 'jpeg' },
      { id: 'shopify-banner', label: { zh: '横幅', en: 'Banner', es: 'Banner', fr: 'Bannière', hi: 'बैनर', ar: 'بانر' }, width: 1920, height: 600, maxSizeMB: 5, format: 'jpeg' },
    ],
  },
  {
    id: 'etsy',
    name: { zh: 'Etsy', en: 'Etsy', es: 'Etsy', fr: 'Etsy', hi: 'Etsy', ar: 'Etsy' },
    region: 'Global',
    icon: '🎨',
    templates: [
      { id: 'etsy-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 2000, height: 2000, maxSizeMB: 10, format: 'jpeg' },
    ],
  },
  {
    id: 'walmart',
    name: { zh: '沃尔玛 Walmart', en: 'Walmart', es: 'Walmart', fr: 'Walmart', hi: 'वॉलमार्ट', ar: 'وولمارت' },
    region: 'US',
    icon: '🏪',
    templates: [
      { id: 'walmart-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 2000, height: 2000, maxSizeMB: 10, format: 'jpeg' },
    ],
  },
  {
    id: 'tiktok-shop',
    name: { zh: 'TikTok Shop', en: 'TikTok Shop', es: 'TikTok Shop', fr: 'TikTok Shop', hi: 'टिकटॉक शॉप', ar: 'تيك توك شوب' },
    region: 'Global',
    icon: '🎵',
    templates: [
      { id: 'ttshop-product', label: { zh: '产品图', en: 'Product', es: 'Producto', fr: 'Produit', hi: 'उत्पाद', ar: 'المنتج' }, width: 1200, height: 1200, maxSizeMB: 5, format: 'jpeg' },
      { id: 'ttshop-cover', label: { zh: '短视频封面', en: 'Video Cover', es: 'Portada Video', fr: 'Couverture Vidéo', hi: 'वीडियो कवर', ar: 'غطاء الفيديو' }, width: 1080, height: 1920, maxSizeMB: 5, format: 'jpeg' },
    ],
  },
  {
    id: 'taobao',
    name: { zh: '淘宝 Taobao', en: 'Taobao', es: 'Taobao', fr: 'Taobao', hi: 'ताओबाओ', ar: 'تاوباو' },
    region: 'China',
    icon: '🛒',
    templates: [
      { id: 'tb-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 800, height: 800, maxSizeMB: 3, format: 'jpeg' },
      { id: 'tb-detail', label: { zh: '详情页', en: 'Detail Page', es: 'Página Detalle', fr: 'Page Détail', hi: 'विवरण पेज', ar: 'صفحة التفاصيل' }, width: 750, height: 0, maxSizeMB: 5, format: 'jpeg' },
    ],
  },
  {
    id: 'jd',
    name: { zh: '京东 JD', en: 'JD.com', es: 'JD.com', fr: 'JD.com', hi: 'जेडी', ar: 'JD.com' },
    region: 'China',
    icon: '🏬',
    templates: [
      { id: 'jd-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 800, height: 800, maxSizeMB: 3, format: 'jpeg' },
    ],
  },
  {
    id: 'pinduoduo',
    name: { zh: '拼多多 PDD', en: 'Pinduoduo', es: 'Pinduoduo', fr: 'Pinduoduo', hi: 'पिंडुओडुओ', ar: 'بين دوان دوان' },
    region: 'China',
    icon: '🛍️',
    templates: [
      { id: 'pdd-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 750, height: 750, maxSizeMB: 3, format: 'jpeg' },
    ],
  },
  {
    id: 'xiaohongshu',
    name: { zh: '小红书 RedNote', en: 'RedNote', es: 'RedNote', fr: 'RedNote', hi: 'लाल नोट', ar: 'ريد نوت' },
    region: 'China',
    icon: '📕',
    templates: [
      { id: 'xhs-cover', label: { zh: '封面图', en: 'Cover Image', es: 'Portada', fr: 'Couverture', hi: 'कवर', ar: 'الغلاف' }, width: 1080, height: 1440, maxSizeMB: 5, format: 'jpeg' },
    ],
  },
  {
    id: 'shopee',
    name: { zh: 'Shopee', en: 'Shopee', es: 'Shopee', fr: 'Shopee', hi: 'शॉपी', ar: 'شوبي' },
    region: 'SE Asia',
    icon: '🛒',
    templates: [
      { id: 'shopee-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 1024, height: 1024, maxSizeMB: 2, format: 'jpeg' },
    ],
  },
  {
    id: 'lazada',
    name: { zh: 'Lazada', en: 'Lazada', es: 'Lazada', fr: 'Lazada', hi: 'लाज़ादा', ar: 'لازادا' },
    region: 'SE Asia',
    icon: '🛍️',
    templates: [
      { id: 'laz-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 1000, height: 1000, maxSizeMB: 3, format: 'jpeg' },
    ],
  },
  {
    id: 'mercado',
    name: { zh: 'Mercado Libre', en: 'Mercado Libre', es: 'Mercado Libre', fr: 'Mercado Libre', hi: 'मर्काडो लिब्रे', ar: 'ميركادو ليبر' },
    region: 'Latin America',
    icon: '🛒',
    templates: [
      { id: 'merc-main', label: { zh: '主图', en: 'Main Image', es: 'Imagen Principal', fr: 'Image Principale', hi: 'मुख्य छवि', ar: 'الصورة الرئيسية' }, width: 1200, height: 1200, maxSizeMB: 6, format: 'jpeg' },
    ],
  },
  {
    id: 'custom',
    name: { zh: '自定义', en: 'Custom', es: 'Personalizado', fr: 'Personnalisé', hi: 'कस्टम', ar: 'مخصص' },
    region: 'Any',
    icon: '⚙️',
    templates: [
      { id: 'custom-800', label: { zh: '800×800', en: '800×800', es: '800×800', fr: '800×800', hi: '800×800', ar: '800×800' }, width: 800, height: 800, maxSizeMB: 5, format: 'jpeg' },
      { id: 'custom-1200', label: { zh: '1200×1200', en: '1200×1200', es: '1200×1200', fr: '1200×1200', hi: '1200×1200', ar: '1200×1200' }, width: 1200, height: 1200, maxSizeMB: 5, format: 'jpeg' },
      { id: 'custom-1920', label: { zh: '1920×1080', en: '1920×1080', es: '1920×1080', fr: '1920×1080', hi: '1920×1080', ar: '1920×1080' }, width: 1920, height: 1080, maxSizeMB: 5, format: 'jpeg' },
    ],
  },
];

export const REGION_LABELS: Record<string, Record<string, string>> = {
  Global: { zh: '全球', en: 'Global', es: 'Global', fr: 'Global', hi: 'ग्लोबल', ar: 'عالمي' },
  China: { zh: '中国', en: 'China', es: 'China', fr: 'Chine', hi: 'चीन', ar: 'الصين' },
  'SE Asia': { zh: '东南亚', en: 'SE Asia', es: 'Asia SE', fr: 'Asie SE', hi: 'दक्षिण पूर्व एशिया', ar: 'جنوب شرق آسيا' },
  US: { zh: '美国', en: 'US', es: 'EE.UU.', fr: 'États-Unis', hi: 'अमेरिका', ar: 'الولايات المتحدة' },
  'Latin America': { zh: '拉美', en: 'Latin America', es: 'Latinoamérica', fr: 'Amérique Latine', hi: 'लैटिन अमेरिका', ar: 'أمريكا اللاتينية' },
  Any: { zh: '通用', en: 'Any', es: 'Cualquiera', fr: 'Tous', hi: 'कोई भी', ar: 'أي' },
};

// ============ TRANSLATIONS ============
export const translations: Record<string, Record<string, string>> = {
  zh: {
    title: '电商图片批量处理',
    subtitle: '全球主流电商平台图片一键合规 · 100%本地处理',
    upload: '点击或拖拽上传图片',
    formats: '支持 JPG、PNG、WebP 格式',
    selectPlatform: '选择电商平台',
    selectSize: '选择尺寸模板',
    customSize: '自定义尺寸',
    width: '宽度(px)',
    height: '高度(px)',
    cropMode: '裁剪模式',
    cropCenter: '居中裁剪',
    cropContain: '等比缩放',
    cropFill: '拉伸填充',
    compress: '智能压缩',
    compressHint: '自动压缩至平台要求体积内',
    quality: '压缩质量',
    watermark: '水印设置',
    watermarkText: '文字水印',
    watermarkTextPlaceholder: '输入水印文字',
    watermarkPosition: '水印位置',
    positionTL: '左上',
    positionTR: '右上',
    positionBL: '左下',
    positionBR: '右下',
    positionCENTER: '居中',
    watermarkSize: '水印大小',
    watermarkOpacity: '水印透明度',
    watermarkColor: '水印颜色',
    addWatermark: '添加水印',
    removeWatermark: '移除水印',
    process: '开始批量处理',
    processing: '处理中...',
    download: '下载',
    downloadAll: '打包下载全部',
    delete: '删除',
    clearAll: '清空全部',
    preview: '预览对比',
    before: '原图',
    after: '处理后',
    settings: '处理设置',
    platformPresets: '平台预设',
    sizeTemplates: '尺寸模板',
    totalProcessed: '已处理',
    totalSaved: '节省',
    noImages: '暂无图片，请先上传',
    features: '核心功能',
    feature1: '全球主流电商平台预设',
    feature2: '批量处理 · 实时预览',
    feature3: '智能压缩至平台要求',
    feature4: '文字水印防盗图',
    feature5: 'ZIP打包按平台分类',
    feature6: '100%纯本地处理',
    guide: '使用指南',
    guideText: '选择平台和尺寸模板 → 上传图片 → 可选加水印 → 点击处理 → 下载ZIP直接上架',
    processingAll: '批量处理中...',
    successCount: '张图片处理成功',
    failCount: '张图片处理失败',
    retry: '重试',
    newTab: '新窗口打开',
    allDone: '全部完成',
    processingHint: '纯本地处理，文件不上传服务器',
    maxSizeWarn: '图片已自动压缩至平台限制内',
    dragHint: '拖拽图片到此处',
    file: '个文件',
    selectImages: '选择图片',
  },
  en: {
    title: 'Ecommerce Image Batch Processor',
    subtitle: 'One-click compliance for global ecommerce platforms · 100% local',
    upload: 'Click or drag to upload images',
    formats: 'Supports JPG, PNG, WebP',
    selectPlatform: 'Select Platform',
    selectSize: 'Select Size Template',
    customSize: 'Custom Size',
    width: 'Width (px)',
    height: 'Height (px)',
    cropMode: 'Crop Mode',
    cropCenter: 'Center Crop',
    cropContain: 'Fit (no crop)',
    cropFill: 'Stretch Fill',
    compress: 'Smart Compress',
    compressHint: 'Auto-compress to platform size limit',
    quality: 'Quality',
    watermark: 'Watermark',
    watermarkText: 'Text Watermark',
    watermarkTextPlaceholder: 'Enter watermark text',
    watermarkPosition: 'Position',
    positionTL: 'Top Left',
    positionTR: 'Top Right',
    positionBL: 'Bottom Left',
    positionBR: 'Bottom Right',
    positionCENTER: 'Center',
    watermarkSize: 'Size',
    watermarkOpacity: 'Opacity',
    watermarkColor: 'Color',
    addWatermark: 'Add Watermark',
    removeWatermark: 'Remove Watermark',
    process: 'Batch Process',
    processing: 'Processing...',
    download: 'Download',
    downloadAll: 'Download All (ZIP)',
    delete: 'Delete',
    clearAll: 'Clear All',
    preview: 'Preview',
    before: 'Original',
    after: 'Processed',
    settings: 'Settings',
    platformPresets: 'Platform Presets',
    sizeTemplates: 'Size Templates',
    totalProcessed: 'Processed',
    totalSaved: 'Saved',
    noImages: 'No images yet. Upload first.',
    features: 'Features',
    feature1: 'Global ecommerce presets',
    feature2: 'Batch processing · real-time preview',
    feature3: 'Smart compression to platform limits',
    feature4: 'Text watermark',
    feature5: 'ZIP download by platform',
    feature6: '100% local processing',
    guide: 'How to Use',
    guideText: 'Select platform & size → Upload images → Add watermark if needed → Click process → Download ZIP',
    processingAll: 'Processing batch...',
    successCount: 'images processed',
    failCount: 'images failed',
    retry: 'Retry',
    newTab: 'Open in new tab',
    allDone: 'All done',
    processingHint: '100% local — files never uploaded',
    maxSizeWarn: 'Auto-compressed to platform limit',
    dragHint: 'Drag images here',
    file: 'files',
    selectImages: 'Select Images',
  },
  es: {
    title: 'Procesador de Imágenes Ecommerce',
    subtitle: 'Cumplimiento con un clic para plataformas globales · 100% local',
    upload: 'Haga clic o arrastre para subir imágenes',
    formats: 'Compatible con JPG, PNG, WebP',
    selectPlatform: 'Seleccionar Plataforma',
    selectSize: 'Seleccionar Plantilla',
    customSize: 'Tamaño Personalizado',
    width: 'Ancho (px)',
    height: 'Alto (px)',
    cropMode: 'Modo de Recorte',
    cropCenter: 'Recorte Central',
    cropContain: 'Ajustar',
    cropFill: 'Rellenar',
    compress: 'Compresión Inteligente',
    compressHint: 'Auto-comprimir al límite',
    quality: 'Calidad',
    watermark: 'Marca de Agua',
    watermarkText: 'Marca de Agua Texto',
    watermarkTextPlaceholder: 'Ingrese texto',
    watermarkPosition: 'Posición',
    positionTL: 'Arriba Izq',
    positionTR: 'Arriba Der',
    positionBL: 'Abajo Izq',
    positionBR: 'Abajo Der',
    positionCENTER: 'Centro',
    watermarkSize: 'Tamaño',
    watermarkOpacity: 'Opacidad',
    watermarkColor: 'Color',
    addWatermark: 'Agregar',
    removeWatermark: 'Quitar',
    process: 'Procesar Lotes',
    processing: 'Procesando...',
    download: 'Descargar',
    downloadAll: 'Descargar Todo (ZIP)',
    delete: 'Eliminar',
    clearAll: 'Limpiar Todo',
    preview: 'Vista Previa',
    before: 'Original',
    after: 'Procesado',
    settings: 'Ajustes',
    platformPresets: 'Preajustes',
    sizeTemplates: 'Plantillas',
    totalProcessed: 'Procesado',
    totalSaved: 'Ahorrado',
    noImages: 'Sin imágenes. Suba primero.',
    features: 'Características',
    feature1: 'Preajustes globales',
    feature2: 'Procesamiento por lotes',
    feature3: 'Compresión inteligente',
    feature4: 'Marca de agua',
    feature5: 'Descarga ZIP',
    feature6: '100% local',
    guide: 'Cómo Usar',
    guideText: 'Seleccione plataforma → Suba imágenes → Procese → Descargue',
    processingAll: 'Procesando...',
    successCount: 'imágenes procesadas',
    failCount: 'imágenes fallidas',
    retry: 'Reintentar',
    newTab: 'Abrir en nueva pestaña',
    allDone: 'Todo listo',
    processingHint: '100% local — archivos nunca subidos',
    maxSizeWarn: 'Auto-comprimida al límite',
    dragHint: 'Arrastre imágenes aquí',
    file: 'archivos',
    selectImages: 'Seleccionar Imágenes',
  },
  fr: {
    title: 'Proceseur d\'Images Ecommerce',
    subtitle: 'Conformité en un clic pour plateformes mondiales · 100% local',
    upload: 'Cliquez ou glissez pour télécharger',
    formats: 'Compatible JPG, PNG, WebP',
    selectPlatform: 'Sélectionner la Plateforme',
    selectSize: 'Sélectionner le Modèle',
    customSize: 'Taille Personnalisée',
    width: 'Largeur (px)',
    height: 'Hauteur (px)',
    cropMode: 'Mode de Rognage',
    cropCenter: 'Rognage Central',
    cropContain: 'Adapter',
    cropFill: 'Remplir',
    compress: 'Compression Intelligente',
    compressHint: 'Auto-compresser à la limite',
    quality: 'Qualité',
    watermark: 'Filigrane',
    watermarkText: 'Filigrane Texte',
    watermarkTextPlaceholder: 'Entrez le texte',
    watermarkPosition: 'Position',
    positionTL: 'Haut Gauche',
    positionTR: 'Haut Droit',
    positionBL: 'Bas Gauche',
    positionBR: 'Bas Droit',
    positionCENTER: 'Centre',
    watermarkSize: 'Taille',
    watermarkOpacity: 'Opacité',
    watermarkColor: 'Couleur',
    addWatermark: 'Ajouter',
    removeWatermark: 'Retirer',
    process: 'Traiter par Lots',
    processing: 'Traitement...',
    download: 'Télécharger',
    downloadAll: 'Tout Télécharger (ZIP)',
    delete: 'Supprimer',
    clearAll: 'Tout Effacer',
    preview: 'Aperçu',
    before: 'Original',
    after: 'Traité',
    settings: 'Paramètres',
    platformPresets: 'Préférences',
    sizeTemplates: 'Modèles',
    totalProcessed: 'Traité',
    totalSaved: 'Économisé',
    noImages: 'Aucune image. Téléchargez d\'abord.',
    features: 'Fonctionnalités',
    feature1: 'Préférences mondiales',
    feature2: 'Traitement par lots',
    feature3: 'Compression intelligente',
    feature4: 'Filigrane texte',
    feature5: 'Téléchargement ZIP',
    feature6: '100% local',
    guide: 'Comment Utiliser',
    guideText: 'Sélectionnez plateforme → Téléchargez → Traitez → Téléchargez',
    processingAll: 'Traitement...',
    successCount: 'images traitées',
    failCount: 'images échouées',
    retry: 'Réessayer',
    newTab: 'Ouvrir dans un nouvel onglet',
    allDone: 'Tout prêt',
    processingHint: '100% local — fichiers jamais téléchargés',
    maxSizeWarn: 'Auto-compressée',
    dragHint: 'Glissez les images ici',
    file: 'fichiers',
    selectImages: 'Sélectionner',
  },
  hi: {
    title: 'ईकॉमर्स इमेज बैच प्रोसेसर',
    subtitle: 'ग्लोबल प्लेटफ़ॉर्म के लिए वन-क्लिक · 100% लोकल',
    upload: 'अपलोड करने के लिए क्लिक या ड्रैग करें',
    formats: 'JPG, PNG, WebP सपोर्ट',
    selectPlatform: 'प्लेटफ़ॉर्म चुनें',
    selectSize: 'साइज़ चुनें',
    customSize: 'कस्टम साइज़',
    width: 'चौड़ाई (px)',
    height: 'ऊंचाई (px)',
    cropMode: 'क्रॉप मोड',
    cropCenter: 'सेंटर क्रॉप',
    cropContain: 'फिट',
    cropFill: 'स्ट्रेच',
    compress: 'स्मार्ट कंप्रेस',
    compressHint: 'लिमिट तक ऑटो-कंप्रेस',
    quality: 'क्वालिटी',
    watermark: 'वॉटरमार्क',
    watermarkText: 'टेक्स्ट वॉटरमार्क',
    watermarkTextPlaceholder: 'टेक्स्ट दर्ज करें',
    watermarkPosition: 'पोज़िशन',
    positionTL: 'ऊपर बायाँ',
    positionTR: 'ऊपर दायाँ',
    positionBL: 'नीचे बायाँ',
    positionBR: 'नीचे दायाँ',
    positionCENTER: 'सेंटर',
    watermarkSize: 'साइज़',
    watermarkOpacity: 'ओपेसिटी',
    watermarkColor: 'रंग',
    addWatermark: 'जोड़ें',
    removeWatermark: 'हटाएं',
    process: 'बैच प्रोसेस',
    processing: 'प्रोसेसिंग...',
    download: 'डाउनलोड',
    downloadAll: 'सभी डाउनलोड (ZIP)',
    delete: 'हटाएं',
    clearAll: 'सभी साफ करें',
    preview: 'प्रीव्यू',
    before: 'मूल',
    after: 'प्रोसेस्ड',
    settings: 'सेटिंग्स',
    platformPresets: 'प्रीसेट',
    sizeTemplates: 'टेम्पलेट',
    totalProcessed: 'प्रोसेस्ड',
    totalSaved: 'बचाया',
    noImages: 'कोई इमेज नहीं. पहले अपलोड करें.',
    features: 'विशेषताएं',
    feature1: 'ग्लोबल प्रीसेट',
    feature2: 'बैच प्रोसेसिंग',
    feature3: 'स्मार्ट कंप्रेशन',
    feature4: 'टेक्स्ट वॉटरमार्क',
    feature5: 'ZIP डाउनलोड',
    feature6: '100% लोकल',
    guide: 'कैसे उपयोग करें',
    guideText: 'प्लेटफ़ॉर्म चुनें → अपलोड करें → प्रोसेस करें → डाउनलोड करें',
    processingAll: 'प्रोसेसिंग...',
    successCount: 'इमेज प्रोसेस्ड',
    failCount: 'इमेज फेल्ड',
    retry: 'रीट्राई',
    newTab: 'नई टैब में खोलें',
    allDone: 'सभी हो गया',
    processingHint: '100% लोकल — फाइलें कभी अपलोड नहीं',
    maxSizeWarn: 'ऑटो-कंप्रेस्ड',
    dragHint: 'इमेज यहां ड्रैग करें',
    file: 'फाइलें',
    selectImages: 'चुनें',
  },
  ar: {
    title: 'معالج صور التجارة الإلكترونية',
    subtitle: 'امتثال بنقرة واحدة للمنصات العالمية · 100% محلي',
    upload: 'انقر أو اسحب للرفع',
    formats: 'يدعم JPG, PNG, WebP',
    selectPlatform: 'اختر المنصة',
    selectSize: 'اختر الحجم',
    customSize: 'حجم مخصص',
    width: 'العرض (px)',
    height: 'الارتفاع (px)',
    cropMode: 'وضع القص',
    cropCenter: 'قص مركزي',
    cropContain: 'احتواء',
    cropFill: 'تمدد',
    compress: 'ضغط ذكي',
    compressHint: 'ضغط تلقائي للحد',
    quality: 'الجودة',
    watermark: 'علامة مائية',
    watermarkText: 'علامة مائية نصية',
    watermarkTextPlaceholder: 'أدخل النص',
    watermarkPosition: 'الموضع',
    positionTL: 'أعلى يسار',
    positionTR: 'أعلى يمين',
    positionBL: 'أسفل يسار',
    positionBR: 'أسفل يمين',
    positionCENTER: 'وسط',
    watermarkSize: 'الحجم',
    watermarkOpacity: 'الشفافية',
    watermarkColor: 'اللون',
    addWatermark: 'إضافة',
    removeWatermark: 'إزالة',
    process: 'معالجة دفعة',
    processing: 'جارٍ المعالجة...',
    download: 'تنزيل',
    downloadAll: 'تنزيل الكل (ZIP)',
    delete: 'حذف',
    clearAll: 'مسح الكل',
    preview: 'معاينة',
    before: 'الأصل',
    after: 'معالج',
    settings: 'الإعدادات',
    platformPresets: 'الإعدادات',
    sizeTemplates: 'القوالب',
    totalProcessed: 'معالج',
    totalSaved: 'الموفور',
    noImages: 'لا توجد صور. ارفع أولاً.',
    features: 'الميزات',
    feature1: 'إعدادات عالمية',
    feature2: 'معالجة دفعة',
    feature3: 'ضغط ذكي',
    feature4: 'علامة مائية نصية',
    feature5: 'تنزيل ZIP',
    feature6: '100% محلي',
    guide: 'كيفية الاستخدام',
    guideText: 'اختر المنصة → ارفع → عالج → نزّل',
    processingAll: 'معالجة...',
    successCount: 'صورة تمت معالجتها',
    failCount: 'صورة فشلت',
    retry: 'إعادة المحاولة',
    newTab: 'فتح في تبويب جديد',
    allDone: 'تم بنجاح',
    processingHint: '100% محلي — لا يتم رفع الملفات',
    maxSizeWarn: 'تم ضغطه تلقائياً',
    dragHint: 'اسحب الصور هنا',
    file: 'ملفات',
    selectImages: 'اختر الصور',
  },
};

// ============ ZIP UTILITIES ============
export function crc32(buf: ArrayBuffer): number {
  const bytes = new Uint8Array(buf);
  let crc = -1;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

export function createZipBlob(files: { name: string; data: ArrayBuffer }[]): Blob {
  const parts: ArrayBuffer[] = [];
  const centralDir: ArrayBuffer[] = [];
  let offset = 0;
  const dosDate = 0x4A21;
  const dosTime = 0x4B62;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.byteLength;

    const local = new ArrayBuffer(30 + nameBytes.length);
    const localView = new DataView(local);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0x0800, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, size, true);
    localView.setUint32(22, size, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    new Uint8Array(local, 30).set(nameBytes);

    parts.push(local, file.data);

    const central = new ArrayBuffer(46 + nameBytes.length);
    const centralView = new DataView(central);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, size, true);
    centralView.setUint32(24, size, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    new Uint8Array(central, 46).set(nameBytes);

    centralDir.push(central);
    offset += 30 + nameBytes.length + size;
  }

  const centralDirStart = offset;
  let centralDirSize = 0;
  for (const c of centralDir) centralDirSize += c.byteLength;

  const endRecord = new ArrayBuffer(22);
  const endView = new DataView(endRecord);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralDirSize, true);
  endView.setUint32(16, centralDirStart, true);
  endView.setUint16(20, 0, true);

  return new Blob([...parts, ...centralDir, endRecord], { type: 'application/zip' });
}

// ============ IMAGE PROCESSING ============
export type CropMode = 'center' | 'contain' | 'fill';
export type WatermarkPosition = 'tl' | 'tr' | 'bl' | 'br' | 'center';
export type OutputFormat = 'jpeg' | 'png' | 'webp';

export interface ProcessOptions {
  template: SizeTemplate;
  cropMode: CropMode;
  quality: number;
  watermarkEnabled: boolean;
  watermarkText: string;
  watermarkPosition: WatermarkPosition;
  watermarkSize: number;
  watermarkOpacity: number;
  watermarkColor: string;
}

export async function processImage(
  imageUrl: string,
  options: ProcessOptions
): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const template = options.template;
        const targetW = template.width;
        const autoHeight = !template.height;
        const targetH = autoHeight ? Math.round(img.height * (targetW / img.width)) : template.height;

        const canvas = document.createElement('canvas');
        let dstW = targetW;
        let dstH = targetH;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        if (options.cropMode === 'contain' && !autoHeight) {
          const scale = Math.min(targetW / img.width, targetH / img.height);
          dstW = Math.round(img.width * scale);
          dstH = Math.round(img.height * scale);
        }

        canvas.width = dstW;
        canvas.height = dstH;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, dstW, dstH);

        if (autoHeight) {
          ctx.drawImage(img, 0, 0, dstW, dstH);
        } else if (options.cropMode === 'center') {
          const srcAspect = img.width / img.height;
          const dstAspect = targetW / targetH;
          let drawW = img.width;
          let drawH = img.height;
          let offsetX = 0;
          let offsetY = 0;

          if (srcAspect > dstAspect) {
            drawH = img.height;
            drawW = img.height * dstAspect;
            offsetX = (img.width - drawW) / 2;
            offsetY = 0;
          } else {
            drawW = img.width;
            drawH = img.width / dstAspect;
            offsetY = (img.height - drawH) / 2;
            offsetX = 0;
          }
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH, 0, 0, dstW, dstH);
        } else if (options.cropMode === 'contain') {
          ctx.drawImage(img, 0, 0, dstW, dstH);
        } else {
          ctx.drawImage(img, 0, 0, dstW, dstH);
        }

        // Apply watermark
        if (options.watermarkEnabled && options.watermarkText) {
          ctx.save();
          const wmSize = Math.max(12, Math.round(dstW * (options.watermarkSize / 800)));
          ctx.font = `bold ${wmSize}px sans-serif`;
          ctx.fillStyle = options.watermarkColor;
          ctx.globalAlpha = options.watermarkOpacity;

          const textMetrics = ctx.measureText(options.watermarkText);
          const textW = textMetrics.width;
          const textH = wmSize;
          const padding = wmSize * 0.5;

          let wx = dstW / 2;
          let wy = dstH / 2;

          switch (options.watermarkPosition) {
            case 'tl':
              ctx.textAlign = 'left';
              ctx.textBaseline = 'top';
              wx = textW / 2 + padding;
              wy = textH / 2 + padding;
              break;
            case 'tr':
              ctx.textAlign = 'right';
              ctx.textBaseline = 'top';
              wx = dstW - textW / 2 - padding;
              wy = textH / 2 + padding;
              break;
            case 'bl':
              ctx.textAlign = 'left';
              ctx.textBaseline = 'bottom';
              wx = textW / 2 + padding;
              wy = dstH - textH / 2 - padding;
              break;
            case 'br':
              ctx.textAlign = 'right';
              ctx.textBaseline = 'bottom';
              wx = dstW - textW / 2 - padding;
              wy = dstH - textH / 2 - padding;
              break;
            case 'center':
            default:
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              wx = dstW / 2;
              wy = dstH / 2;
              break;
          }

          ctx.fillText(options.watermarkText, wx, wy);
          ctx.restore();
        }

        // Output format
        let mimeType: string;
        switch (template.format) {
          case 'png': mimeType = 'image/png'; break;
          case 'webp': mimeType = 'image/webp'; break;
          default: mimeType = 'image/jpeg';
        }

        // Smart compression to fit within size limit
        const maxBytes = template.maxSizeMB * 1024 * 1024;
        let finalDataUrl: string;
        let finalSize: number;

        if (maxBytes > 0 && template.format !== 'png') {
          let low = 0.1;
          let high = options.quality;
          let bestQuality = 0.5;
          let bestSize = Infinity;

          for (let i = 0; i < 12; i++) {
            const mid = (low + high) / 2;
            const dataUrl = canvas.toDataURL(mimeType, mid);
            const size = Math.floor((dataUrl.split(',')[1].length * 3) / 4);

            if (size <= maxBytes) {
              if (size > bestSize) {
                bestSize = size;
                bestQuality = mid;
              }
              low = mid;
            } else {
              high = mid;
            }
          }

          finalDataUrl = canvas.toDataURL(mimeType, bestQuality);
          finalSize = Math.floor((finalDataUrl.split(',')[1].length * 3) / 4);
        } else {
          finalDataUrl = canvas.toDataURL(mimeType, options.quality);
          finalSize = Math.floor((finalDataUrl.split(',')[1].length * 3) / 4);
        }

        resolve({ dataUrl: finalDataUrl, size: finalSize });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

export function getExtension(format: OutputFormat): string {
  switch (format) {
    case 'png': return '.png';
    case 'webp': return '.webp';
    default: return '.jpg';
  }
}

export function buildFileName(platformId: string, templateId: string, originalName: string, format: OutputFormat): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const ext = getExtension(format);
  return `${platformId}_${templateId}_${baseName}${ext}`;
}
