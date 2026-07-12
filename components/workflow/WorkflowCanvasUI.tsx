'use client';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  Save,
  Play,
  Search,
  UserCircle2,
  Crown,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  MessageSquarePlus,
  Layers,
  Download,
} from 'lucide-react';
import WorkflowLeftSider from './WorkflowLeftSider';
import ConfigDrawer from './ConfigDrawer';
import CanvasBottomBar from './CanvasBottomBar';
import {
  WorkflowNodeCard,
  WorkflowEmptyState,
  WorkflowNodeSkeleton,
  type WorkflowNodeData,
} from './WorkflowNode';

/* ========== i18n ========== */
const I18N = {
  brand: { zh: '自动化工作流 · Korelyy Flow', en: 'Automation Studio · Korelyy Flow', fr: 'Studio Auto · Korelyy Flow', es: 'Estudio Auto · Korelyy Flow', hi: 'स्टूडियो · Korelyy Flow', ar: 'استوديو · Korelyy Flow' },
  search: { zh: '搜索工具 / 模板 / 工作流…', en: 'Search tools / templates / workflows…', fr: 'Rechercher…', es: 'Buscar…', hi: 'खोजें…', ar: 'بحث…' },
  save: { zh: '保存', en: 'Save', fr: 'Enregistrer', es: 'Guardar', hi: 'सहेजें', ar: 'حفظ' },
  run: { zh: '运行工作流', en: 'Run Workflow', fr: 'Exécuter', es: 'Ejecutar', hi: 'चलाएं', ar: 'تشغيل' },
  member: { zh: 'Pro 会员', en: 'Pro Plan', fr: 'Plan Pro', es: 'Plan Pro', hi: 'प्रो प्लान', ar: 'خطة برو' },
  loading: { zh: '画布加载中…', en: 'Loading canvas…', fr: 'Chargement…', es: 'Cargando…', hi: 'लोड हो रहा है…', ar: 'جار التحميل…' },
  mobileList: { zh: '步骤列表视图（移动优化）', en: 'Step List (Mobile)', fr: 'Liste Étapes', es: 'Lista Pasos', hi: 'स्टेप लिस्ट', ar: 'قائمة الخطوات' },
  stepCount: { zh: '共 {n} 个步骤', en: '{n} Steps Total', fr: '{n} étapes', es: '{n} Pasos', hi: '{n} चरण', ar: '{n} خطوات' },
  titlePlaceholder: { zh: '未命名工作流', en: 'Untitled Workflow', fr: 'Workflow sans titre', es: 'Flujo sin título', hi: 'अनाम वर्कफ़्लो', ar: 'تدفق عمل بدون عنوان' },
  toolsPanel: { zh: '工具导航', en: 'Tools', fr: 'Outils', es: 'Herramientas', hi: 'टूल्स', ar: 'الأدوات' },
  inspectorPanel: { zh: '节点配置', en: 'Inspector', fr: 'Inspecteur', es: 'Inspector', hi: 'निरीक्षक', ar: 'المفتش' },
  mobileTitle: { zh: '画布功能请在桌面端使用', en: 'Use Canvas on Desktop', fr: 'Utilisez un ordinateur pour le Canevas', es: 'Usa escritorio para el Lienzo', hi: 'कैनवास के लिए डेस्कटॉप का उपयोग करें', ar: 'استخدم سطح المكتب للوحة' },
  mobileDesc: { zh: '工作流画布需要足够的屏幕空间用于拖拽节点和连接。当前屏幕尺寸较小，建议切换到电脑 Web 浏览器获得最佳体验。', en: 'Workflow canvas requires a larger screen to drag nodes & connections. Your viewport is too small — please switch to a desktop or laptop browser for the best experience.', fr: 'Le canevas de workflow nécessite un grand écran. Votre fenêtre est trop petite. Utilisez un navigateur de bureau.', es: 'El lienzo de workflow requiere una pantalla grande. Tu pantalla es demasiado pequeña. Usa un navegador de escritorio.', hi: 'वर्कफ़्लो कैनवास के लिए बड़ी स्क्रीन आवश्यक है। आपका व्यूपोर्ट छोटा है। डेस्कटॉप ब्राउज़र का उपयोग करें।', ar: 'تتطلب لوحة سير العمل شاشة أكبر. عرض الشاشة صغير جدًا. استخدم متصفح سطح المكتب.' },
  mobileHint: { zh: '建议窗口宽度 ≥ 1024px', en: 'Recommended width ≥ 1024px', fr: 'Largeur recommandée ≥ 1024px', es: 'Ancho recomendado ≥ 1024px', hi: 'अनुशंसित चौड़ाई ≥ 1024px', ar: 'العرض الموصى به ≥ 1024px' },
  toastSaved: { zh: '✓ 工作流已保存到本地', en: '✓ Workflow saved locally', fr: '✓ Workflow enregistré', es: '✓ Flujo guardado', hi: '✓ सहेजा गया', ar: '✓ تم الحفظ' },
  toastRunning: { zh: '▶ 开始运行工作流…', en: '▶ Running workflow…', fr: '▶ Exécution…', es: '▶ Ejecutando…', hi: '▶ चल रहा है…', ar: '▶ قيد التشغيل…' },
  toastRunSuccess: { zh: '✓ 工作流运行完成（演示模式）', en: '✓ Workflow completed (demo)', fr: '✓ Terminé (démo)', es: '✓ Completado (demo)', hi: '✓ पूर्ण हुआ (डेमो)', ar: '✓ اكتمل (عرض تجريبي)' },
  toastPro: { zh: '🔒 Pro 会员功能：高级工作流 + 无限运行次数', en: '🔒 Pro Plan: advanced workflows + unlimited runs', fr: '🔒 Plan Pro : workflows avancés + exécutions illimitées', es: '🔒 Plan Pro: flujos avanzados + ejecuciones ilimitadas', hi: '🔒 प्रो प्लान: उन्नत + असीमित रन', ar: '🔒 خطة برو: متقدم + تشغيلات غير محدودة' },
  toastSearch: { zh: '🔍 搜索已激活（演示模式）', en: '🔍 Search activated (demo)', fr: '🔍 Recherche activée (démo)', es: '🔍 Búsqueda activada (demo)', hi: '🔍 खोज सक्रिय (डेमो)', ar: '🔍 البحث مفعل (عرض تجريبي)' },
  toastProfile: { zh: '👤 个人中心（演示模式）', en: '👤 Profile (demo)', fr: '👤 Profil (démo)', es: '👤 Perfil (demo)', hi: '👤 प्रोफ़ाइल (डेमो)', ar: '👤 الملف الشخصي (عرض تجريبي)' },
  toastMenuNav: { zh: '📂 切换到 {m}（演示模式）', en: '📂 Switched to {m} (demo)', fr: '📂 Basculé vers {m} (démo)', es: '📂 Cambiado a {m} (demo)', hi: '📂 पर स्विच किया गया {m} (डेमो)', ar: '📂 تم التبديل إلى {m} (عرض تجريبي)' },
  toastUndo: { zh: '↶ 已撤销上一步', en: '↶ Undo last action', fr: '↶ Annulation', es: '↶ Deshacer', hi: '↶ पूर्ववत्', ar: '↶ تراجع' },
  toastRedo: { zh: '↷ 已重做', en: '↷ Redo', fr: '↷ Rétablir', es: '↷ Rehacer', hi: '↷ फिर से', ar: '↷ إعادة' },
  toastComment: { zh: '💬 注释已添加（演示模式）', en: '💬 Comment added (demo)', fr: '💬 Commentaire ajouté (démo)', es: '💬 Comentario añadido (demo)', hi: '💬 टिप्पणी जोड़ी गई (डेमो)', ar: '💬 تمت إضافة تعليق (عرض تجريبي)' },
  toastGroup: { zh: '📚 已选中 {n} 个节点并分组（演示模式）', en: '📚 Grouped {n} nodes (demo)', fr: '📚 {n} nœuds groupés (démo)', es: '📚 {n} nodos agrupados (demo)', hi: '📚 {n} नोड्स समूहित (डेमो)', ar: '📚 تم تجميع {n} عقدة (عرض تجريبي)' },
  toastExport: { zh: '⬇️ 工作流 JSON 已复制到剪贴板', en: '⬇️ Workflow JSON copied to clipboard', fr: '⬇️ JSON copié dans le presse-papiers', es: '⬇️ JSON copiado al portapapeles', hi: '⬇️ JSON क्लिपबोर्ड में कॉपी किया गया', ar: '⬇️ تم نسخ JSON إلى الحافظة' },
  toastStepCopied: { zh: '📋 步骤已复制', en: '📋 Step duplicated', fr: '📋 Étape dupliquée', es: '📋 Paso duplicado', hi: '📋 स्टेप कॉपी किया गया', ar: '📋 تم استنساخ الخطوة' },
  toastStepDeleted: { zh: '🗑️ 步骤已删除', en: '🗑️ Step deleted', fr: '🗑️ Étape supprimée', es: '🗑️ Paso eliminado', hi: '🗑️ स्टेप हटाया गया', ar: '🗑️ تم حذف الخطوة' },
  toastTestRunning: { zh: '🧪 正在测试步骤…', en: '🧪 Testing step…', fr: '🧪 Test en cours…', es: '🧪 Probando…', hi: '🧪 परीक्षण…', ar: '🧪 اختبار قيد التشغيل…' },
  toastTestSuccess: { zh: '✓ 步骤测试通过（演示模式）', en: '✓ Step test passed (demo)', fr: '✓ Test OK (démo)', es: '✓ Prueba exitosa (demo)', hi: '✓ परीक्षण सफल (डेमो)', ar: '✓ اختبار ناجح (عرض تجريبي)' },
  toastConfigSaved: { zh: '✓ 节点配置已保存', en: '✓ Node config saved', fr: '✓ Configuration enregistrée', es: '✓ Configuración guardada', hi: '✓ कॉन्फ़िग सहेजा गया', ar: '✓ تم حفظ الإعدادات' },
  toastKeyVault: { zh: '🔑 密钥库（演示模式）- 仅本地浏览器存储', en: '🔑 Key Vault (demo) - stored locally only', fr: '🔑 Coffre (démo) - stockage local uniquement', es: '🔑 Almacén (demo) - solo local', hi: '🔑 वॉल्ट (डेमो) - केवल स्थानीय', ar: '🔑 المخزن (عرض تجريبي) - محلي فقط' },
  toastUrlOpened: { zh: '🔗 外链工具已在新标签页打开', en: '🔗 External tool opened in new tab', fr: '🔗 Outil externe ouvert', es: '🔗 Herramienta externa abierta', hi: '🔗 बाहरी टूल खुल गया', ar: '🔗 تم فتح أداة خارجية' },
  toastDeviceMobile: { zh: '📱 已切换到：移动端布局（自适应）', en: '📱 Switched to: Mobile layout', fr: '📱 Passé en : Mode Mobile', es: '📱 Cambiado a: Móvil', hi: '📱 पर स्विच करें: मोबाइल', ar: '📱 تم التبديل إلى: الجوال' },
  toastDeviceTablet: { zh: '📟 已切换到：平板端布局', en: '📟 Switched to: Tablet layout', fr: '📟 Passé en : Mode Tablette', es: '📟 Cambiado a: Tableta', hi: '📟 पर स्विच करें: टैबलेट', ar: '📟 تم التبديل إلى: الجهاز اللوحي' },
  toastDeviceDesktop: { zh: '🖥️ 已切换到：桌面端布局', en: '🖥️ Switched to: Desktop layout', fr: '🖥️ Passé en : Mode Bureau', es: '🖥️ Cambiado a: Escritorio', hi: '🖥️ पर स्विच करें: डेस्कटॉप', ar: '🖥️ تم التبديل إلى: سطح المكتب' },
  toastTemplateApplied: { zh: '✨ 已应用模板：{name}', en: '✨ Template applied: {name}', fr: '✨ Modèle appliqué : {name}', es: '✨ Plantilla aplicada: {name}', hi: '✨ टेम्पलेट लगाया गया: {name}', ar: '✨ تم تطبيق القالب: {name}' },
  menuTools: { zh: '工具市场', en: 'Tool Store', fr: 'Boutique', es: 'Tienda', hi: 'टूल स्टोर', ar: 'متجر الأدوات' },
  menuFlows: { zh: '我的工作流', en: 'My Workflows', fr: 'Mes Workflows', es: 'Mis Flujos', hi: 'मेरे वर्कफ़्लो', ar: 'تدفقات العمل الخاصة بي' },
  menuTemplates: { zh: '模板商店', en: 'Templates', fr: 'Modèles', es: 'Plantillas', hi: 'टेम्पलेट', ar: 'القوالب' },
  menuIdeas: { zh: '威客接单', en: 'Gigs & Ideas', fr: 'Idées & Jobs', es: 'Ideas & Trabajos', hi: 'आइडिया और गिग्स', ar: 'الأفكار والعمل' },
  menuMe: { zh: '个人中心', en: 'Profile', fr: 'Profil', es: 'Perfil', hi: 'प्रोफ़ाइल', ar: 'الملف الشخصي' },
  menuAdmin: { zh: '管理后台', en: 'Admin Panel', fr: 'Administration', es: 'Panel Admin', hi: 'एडमिन पैनल', ar: 'لوحة الإدارة' },
  menuSettings: { zh: '设置', en: 'Settings', fr: 'Réglages', es: 'Ajustes', hi: 'सेटिंग्स', ar: 'الإعدادات' },
  tplBtn: { zh: '✨ 自动生成', en: '✨ Auto Create', fr: '✨ Générer auto', es: '✨ Crear auto', hi: '✨ स्वचालित रूप से बनाएं', ar: '✨ إنشاء تلقائي' },
  tplTitle: { zh: '选择模板，自动生成工作流', en: 'Choose a template to auto-generate', fr: 'Choisissez un modèle', es: 'Elija una plantilla', hi: 'एक टेम्पलेट चुनें', ar: 'اختر قالباً' },
  tplDesc: { zh: '一键生成完整流程，可自由修改节点参数', en: 'Generate full workflow in one click, editable nodes', fr: 'Générez en 1 clic, nœuds modifiables', es: 'Genere en 1 clic, nodos editables', hi: '1 क्लिक में जेनरेट करें, संपादन योग्य', ar: 'بضغطة واحدة، عقد قابلة للتعديل' },
  tplSteps: { zh: '{n} 个步骤', en: '{n} steps', fr: '{n} étapes', es: '{n} pasos', hi: '{n} चरण', ar: '{n} خطوات' },
  tplUse: { zh: '应用模板', en: 'Use Template', fr: 'Utiliser', es: 'Usar', hi: 'उपयोग करें', ar: 'استخدام' },
  tplClose: { zh: '关闭', en: 'Close', fr: 'Fermer', es: 'Cerrar', hi: 'बंद करें', ar: 'إغلاق' },
};

type LocaleKey = keyof typeof I18N.brand;
const pick = (l: string, m: Record<string, string>) => m[l as LocaleKey] || m.en;

/* ========== 菜单ID → 文案Key 映射 ========== */
const MENU_NAME_KEY: Record<string, keyof typeof I18N> = {
  tools: 'menuTools',
  myFlows: 'menuFlows',
  templates: 'menuTemplates',
  ideas: 'menuIdeas',
  me: 'menuMe',
  admin: 'menuAdmin',
  settings: 'menuSettings',
};

/* ========== 节点连接线类型 ========== */
interface WorkflowEdge {
  from: string;
  to: string;
  style?: 'solid' | 'dash';
}

/* ========== 预设模板定义：一键生成完整流程，用户可自由修改节点 ========== */
interface WorkflowTemplate {
  id: string;
  emoji: string;
  gradient: string;
  names: Record<LocaleKey, string>;
  descriptions: Record<LocaleKey, string>;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'image-pipeline',
    emoji: '🖼️',
    gradient: 'from-sky-400 via-cyan-400 to-teal-400',
    names: { zh: '图片处理流水线', en: 'Image Pipeline', fr: 'Pipeline Image', es: 'Pipeline Imágenes', hi: 'इमेज पाइपलाइन', ar: 'خط أنابيب الصور' },
    descriptions: { zh: '上传图片 → 压缩 → 加水印 → 生成二维码分享', en: 'Upload → Compress → Watermark → QR Share', fr: 'Upload → Compresser → Filigrane → QR', es: 'Subir → Comprimir → Marca → QR', hi: 'अपलोड → संपीड़न → वॉटरमार्क → QR', ar: 'رفع → ضغط → علامة مائية → QR' },
    nodes: [
      { id: 'tpl-start', kind: 'start', title: '开始', status: 'idle', posX: 60, posY: 240 },
      { id: 'tpl-1', kind: 'tool', category: 'designer', title: '图片批量上传', subtitle: '支持 JPG / PNG / WebP，单张 ≤ 20MB', status: 'idle', posX: 320, posY: 240 },
      { id: 'tpl-2', kind: 'tool', category: 'designer', title: '智能压缩 80%', subtitle: '保持视觉质量前提下体积缩小 4-10 倍', status: 'idle', posX: 620, posY: 120 },
      { id: 'tpl-3', kind: 'tool', category: 'designer', title: '品牌水印叠加', subtitle: '右下角添加 Logo + 文字 + 透明度 30%', status: 'idle', posX: 620, posY: 360 },
      { id: 'tpl-4', kind: 'condition', title: '是否分享?', subtitle: '用户勾选"生成分享图"才执行后续步骤', status: 'idle', posX: 940, posY: 240 },
      { id: 'tpl-5', kind: 'tool', category: 'content-creator', title: '二维码生成', subtitle: '将处理后图片 URL 生成高清下载二维码', status: 'idle', posX: 1260, posY: 240 },
      { id: 'tpl-end', kind: 'end', title: '完成', status: 'idle', posX: 1560, posY: 240 },
    ],
    edges: [
      { from: 'tpl-start', to: 'tpl-1', style: 'solid' },
      { from: 'tpl-1', to: 'tpl-2', style: 'dash' },
      { from: 'tpl-1', to: 'tpl-3', style: 'dash' },
      { from: 'tpl-2', to: 'tpl-4', style: 'solid' },
      { from: 'tpl-3', to: 'tpl-4', style: 'solid' },
      { from: 'tpl-4', to: 'tpl-5', style: 'solid' },
      { from: 'tpl-5', to: 'tpl-end', style: 'solid' },
    ],
  },
  {
    id: 'content-moderation',
    emoji: '🛡️',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-400',
    names: { zh: 'UGC 内容审核', en: 'Content Moderation', fr: 'Modération Contenu', es: 'Moderación Contenido', hi: 'सामग्री मॉडरेशन', ar: 'مراجعة المحتوى' },
    descriptions: { zh: '文本→敏感词→AI审核→人工复核→结果回调', en: 'Text → Keyword → AI → Review → Callback', fr: 'Texte → Mot-clé → IA → Revue', es: 'Texto → Palabra → IA → Revisión', hi: 'टेक्स्ट → कीवर्ड → AI → समीक्षा', ar: 'نص → كلمة → ذكاء → مراجعة' },
    nodes: [
      { id: 'tpl-start', kind: 'start', title: '开始', status: 'idle', posX: 60, posY: 240 },
      { id: 'tpl-1', kind: 'tool', category: 'developer', title: '接收 Webhook', subtitle: '用户提交内容后自动触发，支持签名校验', status: 'idle', posX: 320, posY: 240 },
      { id: 'tpl-2', kind: 'tool', category: 'content-creator', title: '本地敏感词过滤', subtitle: '3 万 + 中文词库，支持正则和白名单', status: 'idle', posX: 620, posY: 240 },
      { id: 'tpl-3', kind: 'condition', title: '命中敏感词?', subtitle: '直接拒绝 vs 进入 AI 深度审核', status: 'idle', posX: 940, posY: 240 },
      { id: 'tpl-4', kind: 'tool', category: 'developer', title: 'AI 语义分析 (LLM)', subtitle: '调用 LLM 判断是否违规，输出风险等级', status: 'idle', posX: 1260, posY: 120 },
      { id: 'tpl-5', kind: 'tool', category: 'content-creator', title: '人工复核队列', subtitle: 'AI 置信度 < 0.8 时推送运营台审核', status: 'idle', posX: 1260, posY: 360 },
      { id: 'tpl-6', kind: 'tool', category: 'developer', title: '业务回调通知', subtitle: 'POST 结果到业务服务器，支持重试 3 次', status: 'idle', posX: 1580, posY: 240 },
      { id: 'tpl-end', kind: 'end', title: '完成', status: 'idle', posX: 1880, posY: 240 },
    ],
    edges: [
      { from: 'tpl-start', to: 'tpl-1', style: 'solid' },
      { from: 'tpl-1', to: 'tpl-2', style: 'solid' },
      { from: 'tpl-2', to: 'tpl-3', style: 'solid' },
      { from: 'tpl-3', to: 'tpl-4', style: 'dash' },
      { from: 'tpl-3', to: 'tpl-5', style: 'dash' },
      { from: 'tpl-4', to: 'tpl-6', style: 'solid' },
      { from: 'tpl-5', to: 'tpl-6', style: 'solid' },
      { from: 'tpl-6', to: 'tpl-end', style: 'solid' },
    ],
  },
  {
    id: 'data-sync',
    emoji: '🔄',
    gradient: 'from-emerald-400 via-green-400 to-lime-400',
    names: { zh: '跨平台数据同步', en: 'Data Sync Pipeline', fr: 'Sync Données', es: 'Sincronización Datos', hi: 'डेटा सिंक्रोनाइज़ेशन', ar: 'مزامنة البيانات' },
    descriptions: { zh: '定时拉取 → 清洗 → 格式转换 → 写入目标库', en: 'Scheduled Pull → Clean → Transform → Write', fr: 'Planifié → Nettoyer → Transformer', es: 'Programado → Limpiar → Transformar', hi: 'टाइम → साफ → ट्रांसफॉर्म', ar: 'مجدول → تنظيف → تحويل' },
    nodes: [
      { id: 'tpl-start', kind: 'start', title: '开始', status: 'idle', posX: 60, posY: 240 },
      { id: 'tpl-1', kind: 'tool', category: 'developer', title: '定时触发器 Cron', subtitle: '每日 02:00 UTC+8 自动执行，支持手动触发', status: 'idle', posX: 320, posY: 240 },
      { id: 'tpl-2', kind: 'tool', category: 'developer', title: 'MySQL 源表读取', subtitle: 'SELECT 增量字段，按 updated_at 分页拉取', status: 'idle', posX: 620, posY: 120 },
      { id: 'tpl-3', kind: 'tool', category: 'developer', title: 'Excel FTP 下载', subtitle: '连接 FTP/SFTP 下载每日销售报表', status: 'idle', posX: 620, posY: 360 },
      { id: 'tpl-4', kind: 'tool', category: 'developer', title: '字段映射 & 清洗', subtitle: '去空格、类型转换、时区统一、空值填充', status: 'idle', posX: 960, posY: 240 },
      { id: 'tpl-5', kind: 'condition', title: '数据质量合格?', subtitle: '校验行数、必填字段、唯一性约束', status: 'idle', posX: 1280, posY: 240 },
      { id: 'tpl-6', kind: 'tool', category: 'developer', title: '写入 Postgres 目标', subtitle: 'UPSERT 模式，写入前备份当天快照', status: 'idle', posX: 1600, posY: 240 },
      { id: 'tpl-7', kind: 'tool', category: 'content-creator', title: '飞书 / 钉钉通知', subtitle: '同步成功 N 条 / 失败 M 条 摘要推送', status: 'idle', posX: 1920, posY: 240 },
      { id: 'tpl-end', kind: 'end', title: '完成', status: 'idle', posX: 2220, posY: 240 },
    ],
    edges: [
      { from: 'tpl-start', to: 'tpl-1', style: 'solid' },
      { from: 'tpl-1', to: 'tpl-2', style: 'dash' },
      { from: 'tpl-1', to: 'tpl-3', style: 'dash' },
      { from: 'tpl-2', to: 'tpl-4', style: 'solid' },
      { from: 'tpl-3', to: 'tpl-4', style: 'solid' },
      { from: 'tpl-4', to: 'tpl-5', style: 'solid' },
      { from: 'tpl-5', to: 'tpl-6', style: 'solid' },
      { from: 'tpl-6', to: 'tpl-7', style: 'solid' },
      { from: 'tpl-7', to: 'tpl-end', style: 'solid' },
    ],
  },
  {
    id: 'qr-campaign',
    emoji: '📲',
    gradient: 'from-violet-400 via-purple-400 to-indigo-400',
    names: { zh: '营销二维码批量生成', en: 'QR Campaign', fr: 'Campagne QR', es: 'Campaña QR', hi: 'QR अभियान', ar: 'حملة QR' },
    descriptions: { zh: 'CSV导入→URL参数拼接→批量二维码→打包下载', en: 'CSV → URL Params → Batch QR → ZIP', fr: 'CSV → Paramètres → QR Lot → ZIP', es: 'CSV → Parámetros → QR Lote → ZIP', hi: 'CSV → पैरामीटर → QR → ZIP', ar: 'CSV → متغيرات → QR دفعة → ZIP' },
    nodes: [
      { id: 'tpl-start', kind: 'start', title: '开始', status: 'idle', posX: 60, posY: 240 },
      { id: 'tpl-1', kind: 'tool', category: 'content-creator', title: 'CSV 文件上传', subtitle: '包含列：uid、渠道、落地页 base_url', status: 'idle', posX: 320, posY: 240 },
      { id: 'tpl-2', kind: 'tool', category: 'developer', title: 'URL 参数拼接', subtitle: 'base_url?ch=渠道&uid=xxx&utm_source=korelyy', status: 'idle', posX: 620, posY: 240 },
      { id: 'tpl-3', kind: 'condition', title: '是否加 Logo?', subtitle: '中间嵌入品牌 Logo（PNG透明底）', status: 'idle', posX: 940, posY: 240 },
      { id: 'tpl-4', kind: 'tool', category: 'designer', title: 'Logo 合成渲染', subtitle: 'Logo 缩放 + 白底圆角 + 18% 容错块', status: 'idle', posX: 1260, posY: 120 },
      { id: 'tpl-5', kind: 'tool', category: 'content-creator', title: '批量二维码生成', subtitle: '高清 1200x1200 PNG，命名：渠道_uid.png', status: 'idle', posX: 1260, posY: 360 },
      { id: 'tpl-6', kind: 'tool', category: 'developer', title: 'ZIP 打包下载', subtitle: '所有 PNG + CSV 汇总表一起压缩输出', status: 'idle', posX: 1580, posY: 240 },
      { id: 'tpl-end', kind: 'end', title: '完成', status: 'idle', posX: 1880, posY: 240 },
    ],
    edges: [
      { from: 'tpl-start', to: 'tpl-1', style: 'solid' },
      { from: 'tpl-1', to: 'tpl-2', style: 'solid' },
      { from: 'tpl-2', to: 'tpl-3', style: 'solid' },
      { from: 'tpl-3', to: 'tpl-4', style: 'dash' },
      { from: 'tpl-3', to: 'tpl-5', style: 'dash' },
      { from: 'tpl-4', to: 'tpl-6', style: 'solid' },
      { from: 'tpl-5', to: 'tpl-6', style: 'solid' },
      { from: 'tpl-6', to: 'tpl-end', style: 'solid' },
    ],
  },
  {
    id: 'lead-nurture',
    emoji: '💌',
    gradient: 'from-amber-400 via-orange-400 to-red-400',
    names: { zh: '潜客培育自动化', en: 'Lead Nurturing', fr: 'Nutrition Lead', es: 'Nutrición Lead', hi: 'लीड परवर्तन', ar: 'رعاية العملاء' },
    descriptions: { zh: '线索导入→打分→分层→邮件/短信自动化触达', en: 'Import → Score → Segment → Email/SMS', fr: 'Import → Score → Segment → Email', es: 'Importar → Puntuación → Segmento', hi: 'इम्पोर्ट → स्कोर → सेगमेंट → ईमेल', ar: 'استيراد → تقييم → شريحة → بريد' },
    nodes: [
      { id: 'tpl-start', kind: 'start', title: '开始', status: 'idle', posX: 60, posY: 240 },
      { id: 'tpl-1', kind: 'tool', category: 'content-creator', title: '表单 / CRM 线索导入', subtitle: '从落地页表单或 Salesforce CRM 拉取潜客', status: 'idle', posX: 320, posY: 240 },
      { id: 'tpl-2', kind: 'tool', category: 'developer', title: '线索打分 Engine', subtitle: '行业+职位+公司规模+行为权重合成 0-100 分', status: 'idle', posX: 620, posY: 240 },
      { id: 'tpl-3', kind: 'condition', title: '分数 ≥ 60?', subtitle: '高分直接给销售，低分进入培育序列', status: 'idle', posX: 940, posY: 240 },
      { id: 'tpl-4', kind: 'tool', category: 'content-creator', title: '高分 → 销售分配', subtitle: '按地区/行业 Round-Robin 分配销售，邮件+短信通知', status: 'idle', posX: 1260, posY: 120 },
      { id: 'tpl-5', kind: 'tool', category: 'content-creator', title: '低分 → D+3 欢迎邮件', subtitle: '模板：产品价值 + 客户案例 PDF 下载', status: 'idle', posX: 1260, posY: 280 },
      { id: 'tpl-6', kind: 'tool', category: 'content-creator', title: '低分 → D+7 案例 SMS', subtitle: '同行业标杆案例 + 预约 Demo 落地页短链', status: 'idle', posX: 1260, posY: 420 },
      { id: 'tpl-7', kind: 'tool', category: 'content-creator', title: '效果数据回写 CRM', subtitle: '打开率、点击率、预约率自动同步到线索卡片', status: 'idle', posX: 1620, posY: 240 },
      { id: 'tpl-end', kind: 'end', title: '完成', status: 'idle', posX: 1920, posY: 240 },
    ],
    edges: [
      { from: 'tpl-start', to: 'tpl-1', style: 'solid' },
      { from: 'tpl-1', to: 'tpl-2', style: 'solid' },
      { from: 'tpl-2', to: 'tpl-3', style: 'solid' },
      { from: 'tpl-3', to: 'tpl-4', style: 'dash' },
      { from: 'tpl-3', to: 'tpl-5', style: 'dash' },
      { from: 'tpl-5', to: 'tpl-6', style: 'solid' },
      { from: 'tpl-4', to: 'tpl-7', style: 'solid' },
      { from: 'tpl-6', to: 'tpl-7', style: 'solid' },
      { from: 'tpl-7', to: 'tpl-end', style: 'solid' },
    ],
  },
];

/* ========== Toast 类型 ========== */
type ToastType = 'success' | 'info' | 'warn';
interface ToastItem {
  id: number;
  type: ToastType;
  text: string;
}

/* ========== Toast 组件（右上角滑入） ========== */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[999] space-y-2 max-w-[360px] w-[calc(100vw-2rem)] sm:w-auto pointer-events-none">
      {toasts.map((t) => {
        const Icon = t.type === 'success' ? CheckCircle2 : t.type === 'warn' ? AlertTriangle : Info;
        const color =
          t.type === 'success'
            ? 'border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-200 bg-emerald-50/90 dark:bg-emerald-950/70'
            : t.type === 'warn'
              ? 'border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-200 bg-amber-50/90 dark:bg-amber-950/70'
              : 'border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-200 bg-indigo-50/90 dark:bg-indigo-950/70';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 px-3.5 py-2.5 rounded-2xl border shadow-xl backdrop-blur-md animate-[slideIn_.25s_ease-out] ${color}`}
          >
            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={2} />
            <div className="flex-1 text-xs font-semibold leading-snug pt-0.5 break-words">{t.text}</div>
            <button
              onClick={() => onDismiss(t.id)}
              className="w-6 h-6 -mr-1 -mt-0.5 rounded-lg flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ========== 默认连线路径（初始 Demo 数据） ========== */
const INITIAL_EDGES: WorkflowEdge[] = [
  { from: 'n-start', to: 'n-1', style: 'solid' },
  { from: 'n-1', to: 'n-2', style: 'solid' },
  { from: 'n-2', to: 'n-3', style: 'dash' },
  { from: 'n-2', to: 'n-4', style: 'dash' },
  { from: 'n-3', to: 'n-end', style: 'solid' },
  { from: 'n-4', to: 'n-end', style: 'solid' },
];

/* ========== 初始节点 Demo 数据 ========== */
const INITIAL_NODES: WorkflowNodeData[] = [
  {
    id: 'n-start',
    kind: 'start',
    title: '开始',
    status: 'success',
    posX: 60,
    posY: 240,
  },
  {
    id: 'n-1',
    kind: 'tool',
    category: 'developer',
    title: 'Base64 编解码',
    subtitle: '输入字符串 → 输出 Base64 结果，本地纯前端处理',
    status: 'success',
    posX: 320,
    posY: 160,
  },
  {
    id: 'n-2',
    kind: 'condition',
    title: '长度>10?',
    subtitle: 'Base64结果长度 > 10字符',
    status: 'running',
    posX: 620,
    posY: 200,
  },
  {
    id: 'n-3',
    kind: 'tool',
    category: 'content-creator',
    title: '二维码生成',
    subtitle: '文本或 URL → 高清二维码图片',
    status: 'idle',
    posX: 940,
    posY: 100,
  },
  {
    id: 'n-4',
    kind: 'tool',
    category: 'designer',
    title: '图片压缩 + 水印',
    subtitle: '外链 Photopea 自动打开处理',
    status: 'idle',
    posX: 940,
    posY: 320,
  },
  {
    id: 'n-end',
    kind: 'end',
    title: '完成',
    status: 'idle',
    posX: 1260,
    posY: 240,
  },
];

/* ========== Props ========== */
export interface WorkflowCanvasUIProps {
  locale?: string;
  initialLoading?: boolean;
  initialNodes?: unknown[];
  initialEdges?: unknown[];
  workflowId?: string;
  onSave?: (data: { nodes: unknown[]; edges: unknown[] }) => void;
}

/**
 * 工作流画布主页组件（单一集成）
 * - 三栏布局：左导航 / 中画布 / 右配置抽屉
 * - 顶部全局导航：品牌窄光带 / 搜索 / 保存 / 运行 / 用户入口
 * - 响应式：PC三栏 / 平板左栏折叠 / 移动端隐藏画布 → 步骤列表
 * - 纯客户端 React state，不耦合后端执行服务
 */
export default function WorkflowCanvasUI({
  locale = 'en',
  initialLoading = true,
}: WorkflowCanvasUIProps) {
  /* ------------------------------ 全局状态 ------------------------------ */
  /* — 空接口预留：真实环境对接后端拉取工作流详情 — */
  const _apiFetchWorkflowDetail = async () => {
    // TODO: 对接后端 /api/workflow/:slug 拉取详情，暂不实现
  };

  /* — 布局控制 — */
  const [leftCollapsed, setLeftCollapsed] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(initialLoading);
  const [activeMenu, setActiveMenu] = useState('myFlows');
  const [viewport, setViewport] = useState<{ w: number; h: number; isMobile: boolean; isTablet: boolean; isSmallViewport: boolean }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: false,
    isTablet: false,
    isSmallViewport: false,
  });

  /* — 画布控制 — */
  const [panActive, setPanActive] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n-2');
  const [testState, setTestState] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  /* — 节点数据 + 连接边 — */
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(() => INITIAL_NODES);
  const [edges, setEdges] = useState<WorkflowEdge[]>(() => INITIAL_EDGES);

  /* — 拖拽相关 — */
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  /* — Toast 提示 — */
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);
  const showToast = useCallback((type: ToastType, text: string, durationMs = 2600) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    if (durationMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    }
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* — 撤销 / 重做历史栈（浅拷贝 nodes + edges 快照） — */
  type CanvasSnap = { n: WorkflowNodeData[]; e: WorkflowEdge[] };
  const undoStack = useRef<CanvasSnap[]>([]);
  const redoStack = useRef<CanvasSnap[]>([]);
  const pushHistory = useCallback((prevNodes: WorkflowNodeData[], prevEdges?: WorkflowEdge[]) => {
    undoStack.current.push({
      n: JSON.parse(JSON.stringify(prevNodes)),
      e: JSON.parse(JSON.stringify(prevEdges ?? edges)),
    });
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
  }, [edges]);
  const handleUndo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (!prev) {
      showToast('info', pick(locale, I18N.toastUndo));
      return;
    }
    setEdges((curE) => {
      setNodes((curN) => {
        redoStack.current.push({
          n: JSON.parse(JSON.stringify(curN)),
          e: JSON.parse(JSON.stringify(curE)),
        });
        return prev.n;
      });
      return prev.e;
    });
    showToast('info', pick(locale, I18N.toastUndo));
  }, [locale, showToast]);
  const handleRedo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) {
      showToast('info', pick(locale, I18N.toastRedo));
      return;
    }
    setEdges((curE) => {
      setNodes((curN) => {
        undoStack.current.push({
          n: JSON.parse(JSON.stringify(curN)),
          e: JSON.parse(JSON.stringify(curE)),
        });
        return next.n;
      });
      return next.e;
    });
    showToast('info', pick(locale, I18N.toastRedo));
  }, [locale, showToast]);

  /* — 手动快捷键 Ctrl+Z / Ctrl+Y — */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo]);

  /* ------------------------------ 生命周期：加载骨架屏 ------------------------------ */
  useEffect(() => {
    if (!initialLoading) return;
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [initialLoading]);

  /* ------------------------------ 响应式断点监听 ------------------------------ */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setViewport({
        w,
        h: window.innerHeight,
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
        isSmallViewport: w < 1024,
      });
      if (w < 1024) setLeftCollapsed(true);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ------------------------------ 节点操作方法（单一职责函数） ------------------------------ */
  const selectedNode = useMemo<WorkflowNodeData | null>(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id);
    setDrawerOpen(true);
  }, []);

  const handleUpdateNode = useCallback(
    (patch: Partial<WorkflowNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((prev) => {
        pushHistory(prev);
        return prev.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n));
      });
    },
    [selectedNodeId, pushHistory]
  );

  const handleCopyNode = useCallback(() => {
    if (!selectedNode) return;
    const copy: WorkflowNodeData = {
      ...selectedNode,
      id: `copy-${Date.now().toString(36)}`,
      posX: selectedNode.posX + 40,
      posY: selectedNode.posY + 40,
      status: 'idle',
    };
    pushHistory(nodes, edges);
    setNodes((prev) => [...prev, copy]);
    setSelectedNodeId(copy.id);
    showToast('success', pick(locale, I18N.toastStepCopied));
  }, [selectedNode, locale, showToast, pushHistory, nodes, edges]);

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    pushHistory(nodes, edges);
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) => prev.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId));
    setSelectedNodeId(null);
    showToast('warn', pick(locale, I18N.toastStepDeleted));
  }, [selectedNodeId, locale, showToast, pushHistory, nodes, edges]);

  const handleAddBranch = useCallback(
    (id: string) => {
      const parent = nodes.find((n) => n.id === id);
      if (!parent) return;
      const branch: WorkflowNodeData = {
        id: `br-${Date.now().toString(36)}`,
        kind: 'condition',
        title: '新分支条件',
        status: 'idle',
        posX: parent.posX + 320,
        posY: parent.posY + 60,
      };
      setNodes((prev) => {
        pushHistory(prev);
        return [...prev, branch];
      });
      showToast('success', pick(locale, I18N.toastConfigSaved));
    },
    [nodes, locale, showToast, pushHistory]
  );

  const handleAddFirst = useCallback(() => {
    const first: WorkflowNodeData = {
      id: `n-${Date.now().toString(36)}`,
      kind: 'tool',
      category: 'developer',
      title: pick(locale, I18N.titlePlaceholder),
      subtitle: '',
      status: 'idle',
      posX: 360,
      posY: 240,
    };
    setNodes((prev) => {
      pushHistory(prev);
      return [first];
    });
    setSelectedNodeId(first.id);
    setDrawerOpen(true);
  }, [locale, pushHistory]);

  /* ------------------------------ 拖拽移动（纯本地state，不发后端） ------------------------------ */
  const onNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const target = nodes.find((n) => n.id === id);
    if (!target) return;
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: target.posX,
      origY: target.posY,
    };
    const snapshot = JSON.parse(JSON.stringify(nodes));
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (ev.clientX - dragRef.current.startX) * (100 / zoom);
      const dy = (ev.clientY - dragRef.current.startY) * (100 / zoom);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragRef.current?.id
            ? { ...n, posX: dragRef.current.origX + dx, posY: dragRef.current.origY + dy }
            : n
        )
      );
    };
    const onUp = () => {
      if (dragRef.current) {
        pushHistory(snapshot);
      }
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [nodes, zoom, pushHistory]);

  /* ------------------------------ 节点 hover 同步 ------------------------------ */
  const handleHoverChange = useCallback((id: string, isHover: boolean) => {
    setHoverNodeId(isHover ? id : (cur) => (cur === id ? null : cur));
  }, []);

  /* ------------------------------ 测试节点运行（纯前端mock） ------------------------------ */
  const handleRunTest = useCallback(() => {
    showToast('info', pick(locale, I18N.toastTestRunning));
    setTestState('running');
    setTimeout(() => {
      const ok = Math.random() > 0.15;
      setTestState(ok ? 'success' : 'error');
      if (ok) showToast('success', pick(locale, I18N.toastTestSuccess));
    }, 1400);
  }, [locale, showToast]);

  /* ------------------------------ 保存配置（节点保存按钮） ------------------------------ */
  const handleSaveNodeConfig = useCallback((patch: Partial<WorkflowNodeData>) => {
    if (!selectedNodeId) return;
    setNodes((prev) => {
      pushHistory(prev);
      return prev.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n));
    });
    showToast('success', pick(locale, I18N.toastConfigSaved));
  }, [selectedNodeId, locale, showToast, pushHistory]);

  /* ------------------------------ 顶部工具栏按钮 ------------------------------ */
  /* 搜索框 */
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    showToast('info', pick(locale, I18N.toastSearch) + ': ' + searchQuery.trim());
  }, [locale, showToast, searchQuery]);

  /* 保存工作流到 localStorage */
  const handleSaveWorkflow = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const payload = { savedAt: Date.now(), locale, nodes: JSON.parse(JSON.stringify(nodes)) };
        const k = 'korelyy.workflow.canvas.snapshot';
        window.localStorage.setItem(k, JSON.stringify(payload));
      }
      showToast('success', pick(locale, I18N.toastSaved));
    } catch {
      showToast('warn', pick(locale, I18N.toastSaved));
    }
  }, [locale, nodes, showToast]);

  /* 运行工作流（全局 mock） */
  const handleRunWorkflow = useCallback(() => {
    showToast('info', pick(locale, I18N.toastRunning));
    setNodes((prev) => prev.map((n) => ({ ...n, status: n.kind === 'start' ? 'success' : 'running' as WorkflowNodeData['status'] })));
    setTimeout(() => {
      setNodes((prev) => prev.map((n) => ({ ...n, status: 'success' })));
      showToast('success', pick(locale, I18N.toastRunSuccess));
    }, 2200);
  }, [locale, showToast]);

  /* Pro 会员 CTA */
  const handleProClick = useCallback(() => {
    showToast('warn', pick(locale, I18N.toastPro));
  }, [locale, showToast]);

  /* 用户头像入口 */
  const handleProfileClick = useCallback(() => {
    showToast('info', pick(locale, I18N.toastProfile));
  }, [locale, showToast]);

  /* 左侧菜单切换 */
  const handleMenuSelect = useCallback((id: string) => {
    setActiveMenu(id);
    const key = MENU_NAME_KEY[id];
    const name = key ? pick(locale, I18N[key] as Record<string, string>) : id;
    showToast('info', pick(locale, I18N.toastMenuNav).replace('{m}', name));
  }, [locale, showToast]);

  /* 设备预览切换（仅改变状态，不改变组件行为） */
  const deviceIdxRef = useRef(0);
  const handleDeviceSwitch = useCallback(() => {
    deviceIdxRef.current = (deviceIdxRef.current + 1) % 3;
    const keys = [I18N.toastDeviceDesktop, I18N.toastDeviceTablet, I18N.toastDeviceMobile];
    const mode = keys[deviceIdxRef.current];
    showToast('info', pick(locale, mode));
  }, [locale, showToast]);

  /* 应用模板：一键生成完整工作流 */
  const handleApplyTemplate = useCallback((template: WorkflowTemplate) => {
    // 1) 给每个节点生成唯一 ID，避免重复
    const suffix = Date.now().toString(36).slice(-4);
    const newNodes = template.nodes.map<WorkflowNodeData>((n) => ({
      ...n,
      id: `${n.id}-${suffix}`,
    }));
    // 2) 把旧 nodes 推入历史栈，支持撤销
    setNodes((prev) => {
      pushHistory(prev);
      return newNodes;
    });
    // 3) 选中第一个工具节点并打开配置抽屉，方便用户立即修改
    const firstTool = newNodes.find((n) => n.kind === 'tool');
    setSelectedNodeId(firstTool?.id ?? newNodes[0]?.id ?? null);
    setDrawerOpen(true);
    setZoom(100);
    setTemplatePickerOpen(false);
    // 4) Toast 提示
    const name = pick(locale, template.names as Record<string, string>);
    showToast('success', pick(locale, I18N.toastTemplateApplied).replace('{name}', name));
  }, [locale, showToast, pushHistory]);

  /* ------------------------------ 底部画布控制栏按钮 ------------------------------ */
  /* 添加注释 */
  const handleAddComment = useCallback(() => {
    showToast('info', pick(locale, I18N.toastComment));
  }, [locale, showToast]);

  /* 节点分组 */
  const handleGroupNodes = useCallback(() => {
    const count = selectedNodeId ? 1 : Math.min(nodes.length, 3);
    showToast('info', pick(locale, I18N.toastGroup).replace('{n}', String(count)));
  }, [locale, showToast, nodes.length, selectedNodeId]);

  /* 导出 JSON */
  const handleExport = useCallback(async () => {
    try {
      const payload = { version: 1, locale, exportedAt: new Date().toISOString(), nodes };
      const text = JSON.stringify(payload, null, 2);
      if (typeof navigator !== 'undefined' && (navigator as any).clipboard?.writeText) {
        await (navigator as any).clipboard.writeText(text);
      }
      showToast('success', pick(locale, I18N.toastExport));
    } catch {
      showToast('warn', pick(locale, I18N.toastExport));
    }
  }, [locale, nodes, showToast]);

  /* ------------------------------ 右侧配置抽屉额外功能 ------------------------------ */
  /* 外链 URL 打开 */
  const handleOpenExternalUrl = useCallback((url?: string) => {
    if (!url || typeof window === 'undefined') return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast('success', pick(locale, I18N.toastUrlOpened));
    } catch {
      showToast('warn', pick(locale, I18N.toastUrlOpened));
    }
  }, [locale, showToast]);

  /* 从密钥库选择 */
  const handleKeyVaultOpen = useCallback(() => {
    showToast('warn', pick(locale, I18N.toastKeyVault));
  }, [locale, showToast]);

  /* ------------------------------ 视口 & 画布缩放 ------------------------------ */
  const handleFit = useCallback(() => setZoom(100), []);

  /* ------------------------------ 移动端 / 小视口拦截 ------------------------------ */
  const isMobile = viewport.isMobile;
  const isSmallViewport = viewport.isSmallViewport;

  /* ============================================================
   * 渲染
   * ============================================================ */
  if (loading) {
    return <LoadingScaffold locale={locale} />;
  }

  /* — 小视口（<1024px）：全屏提示使用桌面端，避免画布操作错乱 — */
  if (isSmallViewport) {
    return (
      <div className="w-full h-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-[#F5F6FB] dark:bg-[#3a406a]/40 flex items-center justify-center gap-2 sm:gap-3">
            <Monitor className="w-9 h-9 sm:w-12 sm:h-12 text-[#5461A8] dark:text-[#B2BADE]" strokeWidth={1.75} />
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" strokeWidth={1.5} />
            <Smartphone className="w-7 h-7 sm:w-9 sm:h-9 text-gray-400" strokeWidth={1.75} />
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {pick(locale, I18N.mobileTitle)}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8">
            {pick(locale, I18N.mobileDesc)}
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
            <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium tabular-nums">{pick(locale, I18N.mobileHint)}</span>
          </div>

          <div className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
            Desktop-only · 仅桌面端可用 · Bureau uniquement · Solo escritorio · केवल डेस्कटॉप · سطح المكتب فقط
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Toast 全局提示 */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ============================================================
       * ① 顶部全局导航（轻薄、无厚重色块 + 蓝紫窄光带）
       * ============================================================ */}
      <header className="relative h-[60px] flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-30">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-70" />
        <div className="h-full px-4 flex items-center gap-3">
          {/* — 左：品牌名称 — */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.1} />
            </div>
            <div className="min-w-0 hidden sm:block">
              <div className="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate tracking-tight">
                {pick(locale, I18N.brand)}
              </div>
            </div>
          </div>

          {/* — 中：搜索框 — */}
          <div className="flex-1 max-w-lg mx-auto w-full px-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.8} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                }}
                placeholder={pick(locale, I18N.search)}
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-indigo-300 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* — 右：保存 / 运行 / 会员 / 头像 — */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTemplatePickerOpen(true)}
              className="h-9 px-3 rounded-xl flex items-center gap-1.5 border border-indigo-200/70 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 dark:from-indigo-950/40 dark:to-blue-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:scale-[1.02] active:scale-[0.97] transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
              <span className="hidden sm:inline">{pick(locale, I18N.tplBtn)}</span>
            </button>
            <div onClick={handleDeviceSwitch} className="cursor-pointer">
              <DeviceSwitcher viewport={viewport} />
            </div>
            <button
              onClick={handleSaveWorkflow}
              className="h-9 px-3 rounded-xl flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.97] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{pick(locale, I18N.save)}</span>
            </button>
            <button
              onClick={handleRunWorkflow}
              className="h-9 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{pick(locale, I18N.run)}</span>
            </button>
            <button
              onClick={handleProClick}
              className="h-9 px-2 rounded-xl hidden md:flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:scale-[1.02] active:scale-[0.97] transition-transform"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
              <span>{pick(locale, I18N.member)}</span>
            </button>
            <button
              onClick={handleProfileClick}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.95] transition-colors"
              title={pick(locale, I18N.menuMe)}
            >
              <UserCircle2 className="w-[22px] h-[22px]" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
       * ② 主区三栏布局
       * ============================================================ */}
      <div className="flex-1 min-h-0 flex">
        {/* —— 左：可折叠导航（默认折叠） —— */}
        {!leftCollapsed && (
          <WorkflowLeftSider
            locale={locale}
            collapsed={false}
            activeId={activeMenu}
            onToggleCollapse={() => setLeftCollapsed(true)}
            onSelect={handleMenuSelect}
          />
        )}

        {/* —— 中：画布（白底 + 淡蓝紫编织网格背景） —— */}
        <main
          className={[
            'flex-1 min-w-0 relative overflow-hidden',
            'bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20',
          ].join(' ')}
        >
          {/* 网格背景（极淡编织纹理，独家差异化设计） */}
          {gridVisible && <CanvasGridBackground />}

          {/* — 画布节点渲染层（含连线，统一坐标系） — */}
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              cursor: panActive ? 'grab' : 'default',
            }}
          >
            {/* 流动连接线（与节点在同一 scale 容器内，保证缩放时坐标对齐） */}
            <FlowConnectionLines nodes={nodes} edges={edges} hoverNodeId={hoverNodeId} />

            {nodes.length === 0 ? (
              <WorkflowEmptyState locale={locale} onAddFirst={handleAddFirst} />
            ) : (
              nodes.map((n) => (
                <WorkflowNodeCard
                  key={n.id}
                  locale={locale}
                  data={n}
                  selected={selectedNodeId === n.id}
                  hovered={hoverNodeId === n.id}
                  onMouseDown={onNodeMouseDown}
                  onSelect={handleSelectNode}
                  onCopy={handleCopyNode}
                  onDelete={handleDeleteNode}
                  onAddBranch={handleAddBranch}
                  onHoverChange={handleHoverChange}
                />
              ))
            )}
          </div>

          {/* — 左侧悬浮展开按钮（当左栏折叠时显示） — */}
          {leftCollapsed && (
            <button
              onClick={() => setLeftCollapsed(false)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 group flex items-stretch shadow-lg hover:shadow-xl rounded-r-xl overflow-hidden transition-all"
              title={pick(locale, I18N.toolsPanel)}
            >
              <div className="w-1 bg-primary-500/0 group-hover:bg-indigo-500 transition-colors" />
              <div className="w-7 h-28 bg-white dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5 text-gray-400 group-hover:text-[#5461A8] dark:group-hover:text-[#B2BADE] transition-colors">
                <LayoutGrid className="w-4 h-4" />
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          )}

          {/* — 右侧悬浮展开按钮（当右栏折叠时显示） — */}
          {!drawerOpen && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 group flex items-stretch shadow-lg hover:shadow-xl rounded-l-xl overflow-hidden transition-all"
              title={pick(locale, I18N.inspectorPanel)}
            >
              <div className="w-7 h-28 bg-white dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5 text-gray-400 group-hover:text-[#5461A8] dark:group-hover:text-[#B2BADE] transition-colors">
                <Settings className="w-4 h-4" />
                <ChevronLeft className="w-3.5 h-3.5" />
              </div>
              <div className="w-1 bg-primary-500/0 group-hover:bg-indigo-500 transition-colors" />
            </button>
          )}

          {/* — 底部工具栏 — */}
          <CanvasBottomBar
            locale={locale}
            zoom={zoom}
            panActive={panActive}
            gridVisible={gridVisible}
            onZoomChange={setZoom}
            onFit={handleFit}
            onTogglePan={() => setPanActive((v) => !v)}
            onToggleGrid={() => setGridVisible((v) => !v)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onAddComment={handleAddComment}
            onGroupNodes={handleGroupNodes}
            onExport={handleExport}
          />

          {/* — 步骤数浮动徽标 — */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
            {pick(locale, I18N.stepCount).replace('{n}', String(nodes.length))}
          </div>
        </main>

        {/* —— 右：配置抽屉面板 —— */}
        {drawerOpen && (
          <ConfigDrawer
            locale={locale}
            open={true}
            onClose={() => setDrawerOpen(false)}
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onCopy={handleCopyNode}
            onDelete={handleDeleteNode}
            onRunTest={handleRunTest}
            onSaveConfig={handleSaveNodeConfig}
            onOpenExternalUrl={handleOpenExternalUrl}
            onSelectFromVault={handleKeyVaultOpen}
            testState={testState}
          />
        )}
      </div>

      {/* — 模板选择弹窗 — */}
      {templatePickerOpen && (
        <TemplatePicker
          locale={locale}
          templates={WORKFLOW_TEMPLATES}
          onClose={() => setTemplatePickerOpen(false)}
          onApply={handleApplyTemplate}
        />
      )}

      {/* — 全局动画样式（注入一次，不修改 globals.css） — */}
      <InlineCanvasAnimations />
    </div>
  );
}

/* ============================================================
 * 子组件：模板选择弹窗
 * ============================================================ */
function TemplatePicker({
  locale,
  templates,
  onClose,
  onApply,
}: {
  locale: string;
  templates: WorkflowTemplate[];
  onClose: () => void;
  onApply: (tpl: WorkflowTemplate) => void;
}) {
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-[fadeIn_.18s_ease-out]"
        onClick={onClose}
      />
      {/* 弹窗卡片 */}
      <div className="relative w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl shadow-black/20 animate-[popIn_.22s_cubic-bezier(.2,.9,.3,1.2)] flex flex-col">
        {/* 头部 */}
        <header className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-7 pb-4 sm:pb-5 border-b border-gray-100 dark:border-gray-800/80 bg-gradient-to-br from-white via-white to-indigo-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                {pick(locale, I18N.tplTitle)}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {pick(locale, I18N.tplDesc)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.94] transition-all"
            title={pick(locale, I18N.tplClose)}
          >
            <X className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </header>

        {/* 模板网格 */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {templates.map((tpl) => {
              const name = pick(locale, tpl.names as Record<string, string>);
              const desc = pick(locale, tpl.descriptions as Record<string, string>);
              const steps = tpl.nodes.length;
              return (
                <div
                  key={tpl.id}
                  className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-transparent hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* 顶部渐变封面 */}
                  <div className={`relative h-24 sm:h-28 bg-gradient-to-br ${tpl.gradient} overflow-hidden flex-shrink-0`}>
                    {/* 背景装饰 */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20 blur-xl" />
                    <div className="absolute -left-5 -bottom-4 w-16 h-16 rounded-full bg-white/15 blur-lg" />
                    {/* 大 Emoji */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl drop-shadow-sm select-none">
                      {tpl.emoji}
                    </div>
                    {/* 步骤数小胶囊 */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/85 dark:bg-gray-900/85 backdrop-blur text-[10px] font-bold text-gray-700 dark:text-gray-200 shadow-sm tabular-nums">
                      {pick(locale, I18N.tplSteps).replace('{n}', String(steps))}
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col min-h-[140px]">
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-gray-900 dark:text-gray-100 mb-1.5 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-1">
                      {desc}
                    </p>

                    {/* 节点缩略预览（4个占位点） */}
                    <div className="flex items-center gap-1 mb-4 overflow-hidden">
                      {tpl.nodes.slice(0, 6).map((n, i) => {
                        const dotColor =
                          n.kind === 'start'
                            ? 'bg-emerald-400'
                            : n.kind === 'end'
                            ? 'bg-rose-400'
                            : n.kind === 'condition'
                            ? 'bg-amber-400'
                            : 'bg-indigo-400';
                        return (
                          <div key={i} className="flex items-center gap-1 flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full ${dotColor} opacity-80`} />
                            {i < Math.min(tpl.nodes.length, 6) - 1 && (
                              <div className="w-3.5 h-px bg-gray-200 dark:bg-gray-700" />
                            )}
                          </div>
                        );
                      })}
                      {tpl.nodes.length > 6 && (
                        <span className="text-[10px] font-semibold text-gray-400 ml-1 flex-shrink-0">
                          +{tpl.nodes.length - 6}
                        </span>
                      )}
                    </div>

                    {/* 应用按钮 */}
                    <button
                      onClick={() => onApply(tpl)}
                      className="w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.97] transition-all mt-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                      {pick(locale, I18N.tplUse)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 子组件：Loading 骨架屏
 * ============================================================ */
function LoadingScaffold({ locale }: { locale: string }) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 flex flex-col">
      <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 animate-pulse" />
      <div className="flex-1 flex">
        <div className="w-[240px] border-r border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3 space-y-2 hidden md:block">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-11 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="text-[11px] text-gray-400 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 animate-spin" />
            {pick(locale, I18N.loading)}
          </div>
          <div className="grid grid-cols-3 gap-8">
            <WorkflowNodeSkeleton />
            <WorkflowNodeSkeleton />
            <WorkflowNodeSkeleton />
          </div>
        </div>
        <div className="w-[360px] border-l border-gray-200 dark:border-gray-800 p-4 space-y-4 hidden lg:block">
          <div className="h-11 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 子组件：画布编织网格背景（独家差异化纹理）
 * ============================================================ */
function CanvasGridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* —— 淡灰细网格 —— */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgb(203 213 225 / 0.25) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgb(203 213 225 / 0.25) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgb(203 213 225 / 0.12) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgb(203 213 225 / 0.12) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '96px 96px',
        }}
      />
      {/* —— 极淡蓝紫编织纹理：斜向渐变条带 —— */}
      <div
        className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(120deg, transparent 0px, transparent 160px, rgb(99 102 241 / 0.04) 160px, rgb(139 92 246 / 0.06) 168px, transparent 176px, transparent 320px), repeating-linear-gradient(60deg, transparent 0px, transparent 200px, rgb(59 130 246 / 0.05) 200px, rgb(99 102 241 / 0.04) 210px, transparent 220px)',
        }}
      />
      {/* —— 四角柔光辉映：增加空间层次 —— */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );
}

/* ============================================================
 * 子组件：SVG 流动连接线（根据 edges 动态渲染）
 * 悬停画布时加蓝紫流动光影，常态柔和纯色
 * ============================================================ */
function FlowConnectionLines({
  nodes,
  edges,
  hoverNodeId,
}: {
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
  hoverNodeId: string | null;
}) {
  const findNode = (s: string) => nodes.find((n) => n.id === s);
  const pairs = edges.map<[WorkflowNodeData | undefined, WorkflowNodeData | undefined, string]>((e) => [
    findNode(e.from),
    findNode(e.to),
    e.style ?? 'solid',
  ]);
  const hasHover = hoverNodeId != null;
  const getCenter = (n?: WorkflowNodeData, kind?: WorkflowNodeData['kind']) => {
    if (!n) return { x: 0, y: 0 };
    const offsetX = kind === 'start' || kind === 'end' ? 60 : kind === 'condition' ? 75 : 130;
    const offsetY = kind === 'start' || kind === 'end' ? 60 : kind === 'condition' ? 75 : 50;
    return { x: n.posX + offsetX, y: n.posY + offsetY };
  };
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
      <defs>
        <linearGradient id="wf-line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="wf-line-soft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {pairs.map(([s, t, style], i) => {
        if (!s || !t) return null;
        const p1 = getCenter(s, s.kind);
        const p2 = getCenter(t, t.kind);
        const dx = Math.max(60, Math.abs(p2.x - p1.x) / 2);
        const path = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
        const isHighlight = hasHover;
        return (
          <g key={i}>
            <path
              d={path}
              fill="none"
              strokeWidth={isHighlight ? 4 : 2.5}
              strokeLinecap="round"
              stroke={isHighlight ? 'url(#wf-line-grad)' : 'url(#wf-line-soft)'}
              strokeDasharray={style === 'dash' ? '10 8' : undefined}
              className={isHighlight ? 'transition-all duration-500' : ''}
              style={
                isHighlight
                  ? {
                      filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.35))',
                      animation: 'flow-dash 1.6s linear infinite',
                      strokeDashoffset: 0,
                    }
                  : undefined
              }
            />
            {/* 端点小圆 */}
            <circle cx={p1.x} cy={p1.y} r={3.5} fill="#6366f1" opacity="0.9" />
            <circle cx={p2.x} cy={p2.y} r={3.5} fill="#8b5cf6" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
 * 子组件：设备图标（PC/平板/移动）
 * ============================================================ */
function DeviceSwitcher({ viewport }: { viewport: { isMobile: boolean; isTablet: boolean } }) {
  const Icon = viewport.isMobile ? Smartphone : viewport.isTablet ? Tablet : Monitor;
  const cls = viewport.isMobile
    ? 'text-rose-500'
    : viewport.isTablet
    ? 'text-amber-500'
    : 'text-indigo-500';
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${cls}`}>
      <Icon className="w-4 h-4" strokeWidth={1.8} />
    </div>
  );
}

/* ============================================================
 * 子组件：移动端步骤列表视图（替代画布防错乱）
 * ============================================================ */
function MobileStepList({
  locale,
  nodes,
  selectedNodeId,
  onSelectNode,
  drawerOpen,
  setDrawerOpen,
  selectedNode,
  onUpdateNode,
  onCopyNode,
  onDeleteNode,
  testState,
  onRunTest,
}: {
  locale: string;
  nodes: WorkflowNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  selectedNode: WorkflowNodeData | null;
  onUpdateNode: (p: Partial<WorkflowNodeData>) => void;
  onCopyNode: () => void;
  onDeleteNode: () => void;
  testState: 'idle' | 'running' | 'success' | 'error';
  onRunTest: () => void;
}) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* —— 移动端顶栏 —— */}
      <div className="relative h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-3 flex items-center gap-2 flex-shrink-0">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-70" />
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 flex-1 truncate">
          {pick(locale, I18N.mobileList)}
        </div>
        <div className="px-2 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center">
          {pick(locale, I18N.stepCount).replace('{n}', String(nodes.length))}
        </div>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="h-8 px-3 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white text-xs font-bold"
        >
          {selectedNodeId ? '✓' : '+'}
        </button>
      </div>

      {/* —— 步骤垂直列表 —— */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {nodes.length === 0 ? (
          <WorkflowEmptyState locale={locale} />
        ) : (
          nodes.map((n, idx) => (
            <MobileStepRow
              key={n.id}
              locale={locale}
              index={idx}
              data={n}
              isLast={idx === nodes.length - 1}
              selected={selectedNodeId === n.id}
              onClick={() => onSelectNode(n.id)}
            />
          ))
        )}
      </div>

      {/* —— 底部抽屉：选中节点配置 —— */}
      {drawerOpen && selectedNode && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative max-h-[78vh] overflow-hidden rounded-t-3xl bg-white dark:bg-gray-900 shadow-2xl animate-slide-up">
            <div className="mx-auto mt-2 mb-1 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <ConfigDrawer
              locale={locale}
              open
              onClose={() => setDrawerOpen(false)}
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              onCopy={onCopyNode}
              onDelete={onDeleteNode}
              onRunTest={onRunTest}
              testState={testState}
            />
          </div>
        </div>
      )}
      <InlineCanvasAnimations />
    </div>
  );
}

function MobileStepRow({
  locale: _locale,
  index,
  data,
  isLast,
  selected,
  onClick,
}: {
  locale: string;
  index: number;
  data: WorkflowNodeData;
  isLast: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const statusColor = {
    idle: 'bg-gray-400',
    running: 'bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse',
    success: 'bg-emerald-500',
    failed: 'bg-rose-500',
  }[data.status || 'idle'];
  const kindIcon = {
    start: '▶',
    tool: '⚙',
    condition: '◆',
    end: '■',
  }[data.kind];
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={[
          'w-full relative p-3 rounded-2xl flex items-center gap-3 text-left transition-all',
          'border',
          selected
            ? 'bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-violet-500/10 border-indigo-300 dark:border-indigo-700 shadow-md shadow-indigo-500/10 scale-[1.01]'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        ].join(' ')}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base bg-gray-100 dark:bg-gray-800">
          {kindIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">
            Step {index + 1}
          </div>
          <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100 truncate">
            {data.title}
          </div>
          {data.subtitle && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {data.subtitle}
            </div>
          )}
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColor} flex-shrink-0`} />
      </button>
      {!isLast && (
        <div className="absolute left-[22px] top-full w-0.5 h-4 bg-gradient-to-b from-indigo-400 to-violet-400 opacity-60" />
      )}
    </div>
  );
}

/* ============================================================
 * 子组件：一次性注入动画 keyframes（不修改 globals.css）
 * ============================================================ */
function InlineCanvasAnimations() {
  return (
    <style jsx global>{`
      @keyframes flow-dash {
        to {
          stroke-dashoffset: -36;
        }
      }
      @keyframes flow-pulse {
        0%, 100% {
          opacity: 0.7;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.04);
        }
      }
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes popIn {
        0% { opacity: 0; transform: scale(.92) translateY(6px); }
        60% { opacity: 1; }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      .animate-flow-pulse {
        animation: flow-pulse 2.8s ease-in-out infinite;
      }
      .animate-fade-in-up {
        animation: fade-in-up 180ms ease-out both;
      }
      .animate-slide-up {
        animation: slide-up 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}</style>
  );
}
