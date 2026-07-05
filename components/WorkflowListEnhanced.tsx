'use client';
import { Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Zap,
  Clock,
  ChevronRight,
  Sparkles,
  Plus,
  FolderPlus,
  Search,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Star,
  Trophy,
  Flame,
  ListTodo,
  ArrowLeft,
  Layers,
  List,
  Filter,
  X,
  RotateCcw,
  CheckCircle,
  Circle,
  Globe2,
  Briefcase,
  Video,
  Code2,
  Users,
  School,
  Cpu,
  BriefcaseBusiness,
  Megaphone,
  FileText,
  ArrowRight,
  Construction,
} from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';
import type { Workflow } from '@/data/workflows';
import { resolveToolLink, isExternalTool, getToolDisplayLabel } from '@/lib/toolLinks';
import { translateWorkflow } from '@/lib/workflowTranslations';
import type { Locale } from '@/lib/workflowTranslations';
import type { Tool } from '@/data/tools';
import WorkflowCreator from './WorkflowCreator';
import { safeNavigate } from '@/lib/url-whitelist';
import { isTopWorkflowSlug } from '@/lib/topSlugs';

function getWorkflowDetailUrl(locale: string, workflow: { id: string; slug?: string; isCustom?: boolean }): string {
  if (workflow.isCustom) return `/${locale}/workflow/custom/${workflow.id}`;
  const slug = workflow.slug || workflow.id;
  if (isTopWorkflowSlug(slug)) return `/${locale}/workflow/${slug}`;
  return `/${locale}/workflow/detail/?slug=${encodeURIComponent(slug)}`;
}

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full min-h-[140px] rounded-xl border border-transparent col-span-full sm:col-span-2"
    />
  ),
});

const translations: Record<string, Record<string, string>> = {
  zh: {
    'action.back': '返回首页',
    'action.canvas': '画布新建',
    'action.listMode': '列表模式',
    'action.list': '列表',
    'action.continue': '继续',
    'action.createFirst': '创建第一个工作流（画布）',
    'action.add': '新建',
    'action.launch': '一键启动',
    'action.filter': '筛选',
    'action.reset': '重置',
    'action.apply': '应用筛选',
    'title': 'AI 工作流广场',
    'subtitle': '精选高效工作流，一键启动，步骤追踪，效率翻倍',
    'stats.total': '可用工作流',
    'stats.inProgress': '进行中',
    'stats.completed': '已完成',
    'stats.streak': '连续天数',
    'section.continue': '继续未完成',
    'section.recent': '最近使用',
    'section.trigger': '场景触发 · 一键启动',
    'section.apps': '已接入 400+ 应用',
    'tab.all': '全部',
    'tab.cross': '跨境卖家',
    'tab.freelancer': '自由职业',
    'tab.creator': '社媒创作者',
    'tab.dev': '独立开发者',
    'tab.office': '办公效率',
    'tab.marketing': '营销增长',
    'tab.student': '学生升学',
    'tab.inProgress': '进行中',
    'tab.completed': '已完成',
    'tab.mine': '我的',
    'tab.favorites': '收藏',
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.advanced': '进阶',
    'label.progress': '进度',
    'label.steps': '步',
    'label.done': '已完成',
    'label.mine': '我的',
    'label.openTool': '打开工具',
    'label.completeStep': '标记完成',
    'placeholder.search': '搜索工作流标题、描述、标签...',
    'filter.title': '高级筛选',
    'filter.difficulty': '难度',
    'filter.estimatedTime': '预估耗时',
    'filter.containsTool': '包含工具（Slug）',
    'filter.containsToolPlaceholder': '如：shopify、chatgpt、canva（多值用逗号分隔）',
    'filter.anyTime': '不限时长',
    'empty.mine': '还没有创建工作流',
    'empty.favorites': '还没有收藏的工作流',
    'empty.completed': '还没有完成的工作流',
    'empty.inProgress': '暂无进行中的工作流',
    'empty.all': '没有找到匹配的工作流',
    'empty.recent': '还没有启动过工作流，从下方挑一个开始吧！',
    'trigger.when': '触发条件',
    'trigger.then': '执行动作',
    'trigger.result': '预期产出',
    'apps.more': '查看全部工具 →',
    'state.loadingMore': '加载中...',
  },
  en: {
    'action.back': 'Back',
    'action.canvas': 'Canvas Editor',
    'action.listMode': 'List Mode',
    'action.list': 'List',
    'action.continue': 'Continue',
    'action.createFirst': 'Create Your First Workflow (Canvas)',
    'action.add': 'New',
    'action.launch': 'Launch',
    'action.filter': 'Filter',
    'action.reset': 'Reset',
    'action.apply': 'Apply Filters',
    'title': 'AI Workflow Hub',
    'subtitle': 'Curated workflows with step tracking to boost productivity',
    'stats.total': 'Total Workflows',
    'stats.inProgress': 'In Progress',
    'stats.completed': 'Completed',
    'stats.streak': 'Day Streak',
    'section.continue': 'Continue Where You Left Off',
    'section.recent': 'Recently Launched',
    'section.trigger': 'Trigger → Action Workflows',
    'section.apps': '400+ Apps Connected',
    'tab.all': 'All',
    'tab.cross': 'Cross-border Seller',
    'tab.freelancer': 'Freelancer',
    'tab.creator': 'Creator',
    'tab.dev': 'Indie Dev',
    'tab.office': 'Productivity',
    'tab.marketing': 'Marketing',
    'tab.student': 'Student',
    'tab.inProgress': 'In Progress',
    'tab.completed': 'Completed',
    'tab.mine': 'Mine',
    'tab.favorites': 'Favorites',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.advanced': 'Advanced',
    'label.progress': 'Progress',
    'label.steps': 'steps',
    'label.done': 'Done',
    'label.mine': 'Mine',
    'label.openTool': 'Open Tool',
    'label.completeStep': 'Mark Done',
    'placeholder.search': 'Search by title, description, tags...',
    'filter.title': 'Advanced Filters',
    'filter.difficulty': 'Difficulty',
    'filter.estimatedTime': 'Est. Time',
    'filter.containsTool': 'Contains Tool (slug)',
    'filter.containsToolPlaceholder': 'e.g. shopify, chatgpt, canva (comma-separated)',
    'filter.anyTime': 'Any Time',
    'empty.mine': "You haven't created any workflow yet",
    'empty.favorites': 'No favorite workflows yet',
    'empty.completed': 'No completed workflows yet',
    'empty.inProgress': 'No workflows in progress',
    'empty.all': 'No matching workflows found',
    'empty.recent': 'No workflows launched yet — try one below!',
    'trigger.when': 'When',
    'trigger.then': 'Do',
    'trigger.result': 'Result',
    'apps.more': 'Browse all tools →',
    'state.loadingMore': 'Loading more...',
  },
  hi: {
    'action.back': 'वापस',
    'action.canvas': 'कैनवास संपादक',
    'action.listMode': 'सूची मोड',
    'action.list': 'सूची',
    'action.continue': 'जारी रखें',
    'action.createFirst': 'अपना पहला वर्कफ़्लो बनाएं (कैनवास)',
    'action.add': 'नया',
    'action.launch': 'लॉन्च',
    'action.filter': 'फ़िल्टर',
    'action.reset': 'रीसेट',
    'action.apply': 'लागू करें',
    'title': 'AI वर्कफ़्लो हब',
    'subtitle': 'उत्पादकता बढ़ाने के लिए चरण ट्रैकिंग के साथ क्यूरेटेड वर्कफ़्लो',
    'stats.total': 'कुल वर्कफ़्लो',
    'stats.inProgress': 'प्रगति पर',
    'stats.completed': 'पूर्ण',
    'stats.streak': 'दिन का स्ट्रीक',
    'section.continue': 'जहाँ छोड़ा था वहाँ से जारी रखें',
    'section.recent': 'हाल ही में लॉन्च किए गए',
    'section.trigger': 'ट्रिगर → एक्शन वर्कफ़्लो',
    'section.apps': '400+ ऐप्स जुड़े हुए हैं',
    'tab.all': 'सभी',
    'tab.cross': 'क्रॉस-बॉर्डर',
    'tab.freelancer': 'फ्रीलांसर',
    'tab.creator': 'क्रिएटर',
    'tab.dev': 'इंडी डेव',
    'tab.office': 'प्रोडक्टिविटी',
    'tab.marketing': 'मार्केटिंग',
    'tab.student': 'स्टूडेंट',
    'tab.inProgress': 'प्रगति पर',
    'tab.completed': 'पूर्ण',
    'tab.mine': 'मेरे',
    'tab.favorites': 'पसंदीदा',
    'difficulty.easy': 'आसान',
    'difficulty.medium': 'मध्यम',
    'difficulty.advanced': 'उन्नत',
    'label.progress': 'प्रगति',
    'label.steps': 'चरण',
    'label.done': 'हो गया',
    'label.mine': 'मेरे',
    'label.openTool': 'ऐप खोलें',
    'label.completeStep': 'हो गया मार्क करें',
    'placeholder.search': 'खोजें...',
    'filter.title': 'उन्नत फ़िल्टर',
    'filter.difficulty': 'कठिनाई',
    'filter.estimatedTime': 'अनुमानित समय',
    'filter.containsTool': 'टूल शामिल करें',
    'filter.containsToolPlaceholder': 'जैसे: shopify, chatgpt, canva',
    'filter.anyTime': 'कोई भी समय',
    'empty.mine': 'आपने अभी कोई वर्कफ़्लो नहीं बनाया है',
    'empty.favorites': 'अभी कोई पसंदीदा वर्कफ़्लो नहीं',
    'empty.completed': 'अभी कोई पूर्ण वर्कफ़्लो नहीं',
    'empty.inProgress': 'प्रगति पर कोई वर्कफ़्लो नहीं',
    'empty.all': 'कोई मेल खाने वाला वर्कफ़्लो नहीं मिला',
    'empty.recent': 'अभी कोई वर्कफ़्लो लॉन्च नहीं किया गया!',
    'trigger.when': 'जब',
    'trigger.then': 'करें',
    'trigger.result': 'परिणाम',
    'apps.more': 'सभी टूल देखें →',
    'state.loadingMore': 'अधिक लोड हो रहा है...',
  },
  fr: {
    'action.back': 'Retour',
    'action.canvas': 'Éditeur Canevas',
    'action.listMode': 'Mode Liste',
    'action.list': 'Liste',
    'action.continue': 'Continuer',
    'action.createFirst': 'Créez votre Premier Workflow (Canevas)',
    'action.add': 'Nouveau',
    'action.launch': 'Lancer',
    'action.filter': 'Filtrer',
    'action.reset': 'Réinitialiser',
    'action.apply': 'Appliquer',
    'title': 'Hub Workflows IA',
    'subtitle': 'Workflows organisés avec suivi des étapes pour améliorer la productivité',
    'stats.total': 'Total Workflows',
    'stats.inProgress': 'En Cours',
    'stats.completed': 'Terminés',
    'stats.streak': 'Série de Jours',
    'section.continue': 'Reprendre là où vous en étiez',
    'section.recent': 'Lancés Récemment',
    'section.trigger': 'Déclencheur → Action',
    'section.apps': '400+ Apps Connectées',
    'tab.all': 'Tous',
    'tab.cross': 'Vendeur Int.',
    'tab.freelancer': 'Freelance',
    'tab.creator': 'Créateur',
    'tab.dev': 'Dev Indé.',
    'tab.office': 'Productivité',
    'tab.marketing': 'Marketing',
    'tab.student': 'Étudiant',
    'tab.inProgress': 'En Cours',
    'tab.completed': 'Terminés',
    'tab.mine': 'Mes',
    'tab.favorites': 'Favoris',
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.advanced': 'Avancé',
    'label.progress': 'Progrès',
    'label.steps': 'étapes',
    'label.done': 'Terminé',
    'label.mine': 'Mes',
    'label.openTool': 'Ouvrir',
    'label.completeStep': 'Terminé',
    'placeholder.search': 'Rechercher workflows...',
    'filter.title': 'Filtres Avancés',
    'filter.difficulty': 'Difficulté',
    'filter.estimatedTime': 'Durée Est.',
    'filter.containsTool': 'Contient Outil',
    'filter.containsToolPlaceholder': 'ex: shopify, chatgpt, canva',
    'filter.anyTime': 'Toute durée',
    'empty.mine': "Vous n'avez pas encore créé de workflow",
    'empty.favorites': 'Aucun workflow favori pour le moment',
    'empty.completed': 'Aucun workflow terminé pour le moment',
    'empty.inProgress': 'Aucun workflow en cours',
    'empty.all': 'Aucun workflow correspondant trouvé',
    'empty.recent': 'Aucun workflow lancé — essayez-en un ci-dessous !',
    'trigger.when': 'Quand',
    'trigger.then': 'Action',
    'trigger.result': 'Résultat',
    'apps.more': 'Voir tous les outils →',
    'state.loadingMore': 'Chargement...',
  },
  es: {
    'action.back': 'Volver',
    'action.canvas': 'Editor de Lienzo',
    'action.listMode': 'Modo Lista',
    'action.list': 'Lista',
    'action.continue': 'Continuar',
    'action.createFirst': 'Crea tu Primer Flujo (Lienzo)',
    'action.add': 'Nuevo',
    'action.launch': 'Lanzar',
    'action.filter': 'Filtrar',
    'action.reset': 'Reiniciar',
    'action.apply': 'Aplicar',
    'title': 'Centro de Flujos IA',
    'subtitle': 'Flujos seleccionados con seguimiento de pasos para aumentar la productividad',
    'stats.total': 'Total Flujos',
    'stats.inProgress': 'En Progreso',
    'stats.completed': 'Completados',
    'stats.streak': 'Racha de Días',
    'section.continue': 'Continuar donde lo dejaste',
    'section.recent': 'Lanzados Recientemente',
    'section.trigger': 'Disparador → Acción',
    'section.apps': '400+ Apps Conectadas',
    'tab.all': 'Todos',
    'tab.cross': 'Vend. Int.',
    'tab.freelancer': 'Freelance',
    'tab.creator': 'Creador',
    'tab.dev': 'Dev Ind.',
    'tab.office': 'Productividad',
    'tab.marketing': 'Marketing',
    'tab.student': 'Estudiante',
    'tab.inProgress': 'En Progreso',
    'tab.completed': 'Completados',
    'tab.mine': 'Míos',
    'tab.favorites': 'Favoritos',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.advanced': 'Avanzado',
    'label.progress': 'Progreso',
    'label.steps': 'pasos',
    'label.done': 'Hecho',
    'label.mine': 'Mío',
    'label.openTool': 'Abrir',
    'label.completeStep': 'Marcar Hecho',
    'placeholder.search': 'Buscar flujos...',
    'filter.title': 'Filtros Avanzados',
    'filter.difficulty': 'Dificultad',
    'filter.estimatedTime': 'Tiempo Est.',
    'filter.containsTool': 'Incluye Herramienta',
    'filter.containsToolPlaceholder': 'ej: shopify, chatgpt, canva',
    'filter.anyTime': 'Cualquier duración',
    'empty.mine': 'Todavía no has creado ningún flujo',
    'empty.favorites': 'Aún no hay flujos favoritos',
    'empty.completed': 'Aún no hay flujos completados',
    'empty.inProgress': 'No hay flujos en progreso',
    'empty.all': 'No se encontraron flujos coincidentes',
    'empty.recent': '¡Ningún flujo lanzado aún! Prueba uno abajo.',
    'trigger.when': 'Cuando',
    'trigger.then': 'Acción',
    'trigger.result': 'Resultado',
    'apps.more': 'Ver todas las herramientas →',
    'state.loadingMore': 'Cargando más...',
  },
  ar: {
    'action.back': 'رجوع',
    'action.canvas': 'محرر اللوحة',
    'action.listMode': 'وضع القائمة',
    'action.list': 'قائمة',
    'action.continue': 'متابعة',
    'action.createFirst': 'أنشئ أول سير عمل (لوحة)',
    'action.add': 'جديد',
    'action.launch': 'إطلاق',
    'action.filter': 'تصفية',
    'action.reset': 'إعادة تعيين',
    'action.apply': 'تطبيق',
    'title': 'مركز سير العمل بالذكاء الاصطناعي',
    'subtitle': 'سير عمل مختارة مع تتبع الخطوات لزيادة الإنتاجية',
    'stats.total': 'إجمالي سير العمل',
    'stats.inProgress': 'قيد التنفيذ',
    'stats.completed': 'مكتمل',
    'stats.streak': 'أيام متتالية',
    'section.continue': 'تابع من حيث توقفت',
    'section.recent': 'أُطلق مؤخراً',
    'section.trigger': 'محفز → إجراء',
    'section.apps': '+400 تطبيق متصل',
    'tab.all': 'الكل',
    'tab.cross': 'بائع عبر',
    'tab.freelancer': 'عامل حر',
    'tab.creator': 'مبدع',
    'tab.dev': 'مطور',
    'tab.office': 'الإنتاجية',
    'tab.marketing': 'التسويق',
    'tab.student': 'الطالب',
    'tab.inProgress': 'قيد التنفيذ',
    'tab.completed': 'مكتمل',
    'tab.mine': 'الخاص بي',
    'tab.favorites': 'المفضلة',
    'difficulty.easy': 'سهل',
    'difficulty.medium': 'متوسط',
    'difficulty.advanced': 'متقدم',
    'label.progress': 'التقدم',
    'label.steps': 'خطوات',
    'label.done': 'تم',
    'label.mine': 'خاص',
    'label.openTool': 'فتح التطبيق',
    'label.completeStep': 'تم التحديد',
    'placeholder.search': 'ابحث في سير العمل...',
    'filter.title': 'فلاتر متقدمة',
    'filter.difficulty': 'الصعوبة',
    'filter.estimatedTime': 'الوقت المقدر',
    'filter.containsTool': 'تضمين أداة',
    'filter.containsToolPlaceholder': 'مثال: shopify, chatgpt, canva',
    'filter.anyTime': 'أي مدة',
    'empty.mine': 'لم تقم بإنشاء أي سير عمل بعد',
    'empty.favorites': 'لا توجد سير عمل مفضلة بعد',
    'empty.completed': 'لا توجد سير عمل مكتملة بعد',
    'empty.inProgress': 'لا توجد سير عمل قيد التنفيذ',
    'empty.all': 'لم يتم العثور على سير عمل مطابق',
    'empty.recent': 'لم يتم إطلاق أي سير عمل بعد! جرب واحداً أدناه.',
    'trigger.when': 'عندما',
    'trigger.then': 'نفذ',
    'trigger.result': 'النتيجة',
    'apps.more': 'عرض جميع الأدوات →',
    'state.loadingMore': 'جارٍ تحميل المزيد...',
  },
};

const getT = (loc: string) => {
  const dict = translations[loc] || translations.zh;
  return (key: string) => dict[key] ?? translations.zh[key] ?? key;
};

type TabType = 'all' | 'cross' | 'freelancer' | 'creator' | 'dev' | 'office' | 'marketing' | 'student' | 'inprogress' | 'completed' | 'mine' | 'favorites';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'advanced';
type TimeFilter = 'all' | 'lt30' | 'lt60' | 'gt60';

const PERSONA_CATEGORY_MAP: Record<string, string[]> = {
  cross: ['cross-border-seller', 'ecommerce-ops', 'ecommerce', 'marketing-ops'],
  freelancer: ['freelancer', 'consulting'],
  creator: ['social-creator', 'content-creator'],
  dev: ['indie-developer', 'developer'],
  office: ['productivity', 'student-essay', 'office-work', 'personal-finance'],
  marketing: ['marketing-ops', 'growth-marketing', 'branding', 'seo-optimization'],
  student: ['student-essay', 'research', 'student-exam'],
};

const TRIGGER_TEMPLATES: Record<string, Array<{ trigger: string; action: string; result: string; workflowIds: string[]; accent: string }>> = {
  zh: [
    {
      trigger: 'Shopify 收到新订单',
      action: '自动归档 + 生成利润测算表',
      result: '财务报表自动入账 + 看板更新',
      workflowIds: ['cross-border-finance'],
      accent: 'from-blue-500 to-indigo-500',
    },
    {
      trigger: '竞品出现爆款关键词',
      action: '4 语言 Listing + SEO 页生成',
      result: '1 天完成 Shopify/Etsy 10 条 Listing 上架',
      workflowIds: ['cross-border-listing'],
      accent: 'from-purple-500 to-pink-500',
    },
    {
      trigger: 'Fiverr 收到英文需求单',
      action: 'AI 拆解 + Proposal 报价 PDF',
      result: '2 分钟输出专业英文提案，响应率翻倍',
      workflowIds: ['fiverr-proposal'],
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      trigger: '新品上市（有白底图）',
      action: '场景建模 + GDPR 合规素材包',
      result: '10 张合规商用主图 + 4 场景详情页',
      workflowIds: ['product-image-ai'],
      accent: 'from-amber-500 to-orange-500',
    },
    {
      trigger: 'TikTok/YouTube 发布新品视频',
      action: '脚本→配音→字幕→封面 4 件套',
      result: '批量输出 10 条视频，节省 80% 剪辑时间',
      workflowIds: ['video-pipeline'],
      accent: 'from-rose-500 to-red-500',
    },
    {
      trigger: '海外客户发送 4 语种消息',
      action: 'FAQ 自动匹配 + 无人值守接单',
      result: '客服响应从 4 小时 → 4 秒',
      workflowIds: ['multilingual-cs'],
      accent: 'from-cyan-500 to-sky-500',
    },
  ],
  en: [
    {
      trigger: 'New Shopify Order',
      action: 'Auto-archive + Profit sheet',
      result: 'Books closed & dashboard updated',
      workflowIds: ['cross-border-finance'],
      accent: 'from-blue-500 to-indigo-500',
    },
    {
      trigger: 'Competitor keyword found',
      action: '4-lang Listing + SEO',
      result: '10 Shopify/Etsy listings in 1 day',
      workflowIds: ['cross-border-listing'],
      accent: 'from-purple-500 to-pink-500',
    },
    {
      trigger: 'Fiverr new inquiry',
      action: 'AI breakdown + Proposal PDF',
      result: 'Pro proposal in 2 min → 2x reply rate',
      workflowIds: ['fiverr-proposal'],
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      trigger: 'New product (white bg pic)',
      action: 'Scene generation + GDPR check',
      result: '10 compliant commercial images',
      workflowIds: ['product-image-ai'],
      accent: 'from-amber-500 to-orange-500',
    },
    {
      trigger: 'New TikTok / YouTube launch',
      action: 'Script→Voice→Captions→Cover',
      result: '10 videos at once, -80% edit time',
      workflowIds: ['video-pipeline'],
      accent: 'from-rose-500 to-red-500',
    },
    {
      trigger: '4-lang customer message',
      action: 'FAQ matching + auto-reply',
      result: 'Reply time 4h → 4 seconds',
      workflowIds: ['multilingual-cs'],
      accent: 'from-cyan-500 to-sky-500',
    },
  ],
  hi: [
    { trigger: 'नया Shopify ऑर्डर', action: 'ऑटो-आर्काइव + प्रॉफिट शीट', result: 'खाते सीधे डैशबोर्ड में अपडेट', workflowIds: ['cross-border-finance'], accent: 'from-blue-500 to-indigo-500' },
    { trigger: 'कॉम्पेटिटर कीवर्ड मिला', action: '4-भाषा Listing + SEO', result: '1 दिन में 10 Listing लाइव', workflowIds: ['cross-border-listing'], accent: 'from-purple-500 to-pink-500' },
    { trigger: 'Fiverr नया इन्वायरी', action: 'AI ब्रेकडाउन + Proposal PDF', result: '2 मिनट में प्रो प्रपोज़ल → 2x जवाब', workflowIds: ['fiverr-proposal'], accent: 'from-emerald-500 to-teal-500' },
    { trigger: 'नया प्रोडक्ट (व्हाइट बैकग्राउंड)', action: 'Scene + GDPR चेक', result: '10 शुद्ध व्यावसायिक इमेज', workflowIds: ['product-image-ai'], accent: 'from-amber-500 to-orange-500' },
    { trigger: 'नया TikTok वीडियो', action: 'Script→Voice→Caption→Cover', result: '10 वीडियो 1 बार में, -80% समय', workflowIds: ['video-pipeline'], accent: 'from-rose-500 to-red-500' },
    { trigger: '4-भाषा कस्टमर मैसेज', action: 'FAQ मैच + ऑटो रिप्लाई', result: 'रिप्लाई 4 घंटे → 4 सेकंड', workflowIds: ['multilingual-cs'], accent: 'from-cyan-500 to-sky-500' },
  ],
  fr: [
    { trigger: 'Nouvelle commande Shopify', action: 'Archivage auto + Fiche profit', result: 'Comptabilité & dashboard à jour', workflowIds: ['cross-border-finance'], accent: 'from-blue-500 to-indigo-500' },
    { trigger: 'Mot-clé compétiteur', action: 'Listing 4-langues + SEO', result: '10 listings Shopify/Etsy en 1 jour', workflowIds: ['cross-border-listing'], accent: 'from-purple-500 to-pink-500' },
    { trigger: 'Nouvelle demande Fiverr', action: 'Décomposition IA + PDF Proposal', result: 'Pro pro en 2 min → 2x de réponses', workflowIds: ['fiverr-proposal'], accent: 'from-emerald-500 to-teal-500' },
    { trigger: 'Nouveau produit (fond blanc)', action: 'Scènes + Conformité RGPD', result: '10 images commerciales conformes', workflowIds: ['product-image-ai'], accent: 'from-amber-500 to-orange-500' },
    { trigger: 'Lancement TikTok/YouTube', action: 'Script→Voix→Sous-titres→Vignette', result: '10 vidéos, -80% temps de montage', workflowIds: ['video-pipeline'], accent: 'from-rose-500 to-red-500' },
    { trigger: 'Message client 4 langues', action: 'FAQ + Réponse auto', result: 'Temps de réponse 4h → 4s', workflowIds: ['multilingual-cs'], accent: 'from-cyan-500 to-sky-500' },
  ],
  es: [
    { trigger: 'Nuevo pedido Shopify', action: 'Archivo auto + Hoja de ganancias', result: 'Contabilidad actualizada al instante', workflowIds: ['cross-border-finance'], accent: 'from-blue-500 to-indigo-500' },
    { trigger: 'Keyword competidor', action: 'Listing 4 idiomas + SEO', result: '10 listings Shopify/Etsy en 1 día', workflowIds: ['cross-border-listing'], accent: 'from-purple-500 to-pink-500' },
    { trigger: 'Nueva consulta Fiverr', action: 'Desglose IA + PDF Proposal', result: 'Propuesta en 2 min → 2x respuestas', workflowIds: ['fiverr-proposal'], accent: 'from-emerald-500 to-teal-500' },
    { trigger: 'Nuevo producto (fondo blanco)', action: 'Escenas + Cumplimiento RGPD', result: '10 imágenes comerciales válidas', workflowIds: ['product-image-ai'], accent: 'from-amber-500 to-orange-500' },
    { trigger: 'Lanzamiento TikTok/YouTube', action: 'Guion→Voz→Subtítulos→Portada', result: '10 vídeos, -80% tiempo edición', workflowIds: ['video-pipeline'], accent: 'from-rose-500 to-red-500' },
    { trigger: 'Mensaje 4 idiomas', action: 'FAQ + Respuesta auto', result: 'Respuesta 4h → 4 segundos', workflowIds: ['multilingual-cs'], accent: 'from-cyan-500 to-sky-500' },
  ],
  ar: [
    { trigger: 'طلب Shopify جديد', action: 'أرشفة تلقائية + أرباح', result: 'المحاسبة تُحدث فوراً', workflowIds: ['cross-border-finance'], accent: 'from-blue-500 to-indigo-500' },
    { trigger: 'كلمة مفتاحية منافس', action: 'Listing بأربع لغات + SEO', result: '10 قوائم في يوم واحد', workflowIds: ['cross-border-listing'], accent: 'from-purple-500 to-pink-500' },
    { trigger: 'استفسار Fiverr جديد', action: 'تحليل + PDF اقتراح', result: 'اقتراح احترافي بـ 2 دقيقة', workflowIds: ['fiverr-proposal'], accent: 'from-emerald-500 to-teal-500' },
    { trigger: 'منتج جديد (خلفية بيضاء)', action: 'مشاهد + تحقق GDPR', result: '10 صور تجارية سليمة', workflowIds: ['product-image-ai'], accent: 'from-amber-500 to-orange-500' },
    { trigger: 'إطلاق TikTok/YouTube', action: 'سيناريو→صوت→ترجمة→غلاف', result: '10 فيديوهات فوراً', workflowIds: ['video-pipeline'], accent: 'from-rose-500 to-red-500' },
    { trigger: 'رسالة بأربع لغات', action: 'الأسئلة + رد تلقائي', result: 'رد من 4 ساعات → 4 ثوانٍ', workflowIds: ['multilingual-cs'], accent: 'from-cyan-500 to-sky-500' },
  ],
};

const PERSONA_TABS: Array<{ key: TabType; labelKey: string; icon: any; color: string }> = [
  { key: 'all', labelKey: 'tab.all', icon: Sparkles, color: 'text-gray-600 dark:text-gray-400' },
  { key: 'cross', labelKey: 'tab.cross', icon: Globe2, color: 'text-blue-600 dark:text-blue-400' },
  { key: 'freelancer', labelKey: 'tab.freelancer', icon: Briefcase, color: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'creator', labelKey: 'tab.creator', icon: Video, color: 'text-pink-600 dark:text-pink-400' },
  { key: 'dev', labelKey: 'tab.dev', icon: Code2, color: 'text-indigo-600 dark:text-indigo-400' },
  { key: 'office', labelKey: 'tab.office', icon: BriefcaseBusiness, color: 'text-amber-600 dark:text-amber-400' },
  { key: 'marketing', labelKey: 'tab.marketing', icon: Megaphone, color: 'text-rose-600 dark:text-rose-400' },
  { key: 'student', labelKey: 'tab.student', icon: School, color: 'text-cyan-600 dark:text-cyan-400' },
];

const STATE_TABS: Array<{ key: TabType; labelKey: string; icon: any }> = [
  { key: 'inprogress', labelKey: 'tab.inProgress', icon: Clock3 },
  { key: 'completed', labelKey: 'tab.completed', icon: CheckCircle2 },
  { key: 'mine', labelKey: 'tab.mine', icon: FolderPlus },
  { key: 'favorites', labelKey: 'tab.favorites', icon: Star },
];

export default function WorkflowListEnhanced({ locale }: { locale: string }) {
  const {
    customWorkflows,
    workflowProgress,
    favoriteWorkflows,
    workflowStats,
    toggleWorkflowFavorite,
    startWorkflowProgress,
    toggleStepComplete,
  } = usePreferencesStore();
  const t = getT(locale);

  // ============================================================
  // 懒加载 workflows + tools 两大数组：
  // SSR/首屏 HTML 不再内联 300KB+workflows + 200KB+tools 大常量，
  // 水合完成后动态 import，避免 TTFB 飙升到 4~7s。
  // 变量名故意保持 workflows/tools 不变，下游所有 .filter/.find/.map 零改动。
  // ============================================================
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let wfArr: Workflow[] = [];
        let tlArr: Tool[] = [];
        try {
          const [wfMod, toolsMod] = await Promise.all([
            import('@/data/workflows'),
            import('@/data/tools'),
          ]);
          wfArr = (wfMod.workflows || []) as Workflow[];
          tlArr = (toolsMod.tools || []) as Tool[];
        } catch (importErr) {
          if (typeof window !== 'undefined') {
            try { console.warn('[workflows] lazy chunk import failed, falling back:', importErr); } catch {}
          }
        }
        if (cancelled) return;
        setWorkflows(wfArr);
        setTools(tlArr);
        setDataLoaded(true);
      } catch (err) {
        if (cancelled) return;
        try { console.error('[workflows] data load critical error:', err); } catch {}
        setLoadError(err instanceof Error ? err : new Error(String(err)));
        setWorkflows([]);
        setTools([]);
        setDataLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [showCreatorCanvas, setShowCreatorCanvas] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [time, setTime] = useState<TimeFilter>('all');
  const [toolSlugs, setToolSlugs] = useState('');

  const [visibleCount, setVisibleCount] = useState(10);
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const sentinelCallback = useCallback((el: HTMLDivElement | null) => { setSentinelEl(el); }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVisibleCount(10);
  }, [activeTab, searchQuery, difficulty, time, toolSlugs, locale]);

  const officialWorkflows = useMemo(
    () => workflows.map((w) => translateWorkflow(w, locale as Locale)),
    [workflows, locale],
  );
  const triggerTemplates = TRIGGER_TEMPLATES[locale] || TRIGGER_TEMPLATES.zh;

  const inProgressIds = Object.entries(workflowProgress)
    .filter(([, p]) => p && p.completedSteps.length > 0 && !p.completedAt)
    .map(([id]) => id);

  const completedIds = Object.entries(workflowProgress)
    .filter(([, p]) => p && p.completedAt)
    .map(([id]) => id);

  const isFavorite = (id: string) => favoriteWorkflows.includes(id);

  const getAllWorkflows = () => {
    const all: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      icon: string;
      category: string;
      steps: any[];
      tags: string[];
      estimatedTime: string;
      difficulty: string;
      isCustom: boolean;
    }> = [];

    if (activeTab !== 'mine') {
      officialWorkflows.forEach(w => {
        all.push({ ...w, slug: w.slug, isCustom: false });
      });
    }
    if (activeTab === 'mine' || activeTab === 'all' || activeTab === 'inprogress' || activeTab === 'completed' || activeTab === 'favorites') {
      customWorkflows.forEach(w => {
        all.push({
          id: w.id,
          slug: w.id,
          title: w.title,
          description: w.description,
          icon: w.icon || 'Zap',
          category: w.category || 'custom',
          steps: w.steps,
          tags: w.tags || [],
          estimatedTime: w.estimatedTime || `${w.steps.length * 5}min`,
          difficulty: w.difficulty || 'easy',
          isCustom: true,
        });
      });
    }
    return all;
  };

  const matchesPersonaTab = (cat: string, wfSteps: any[]) => {
    if (activeTab === 'all' || activeTab === 'inprogress' || activeTab === 'completed' || activeTab === 'mine' || activeTab === 'favorites') return true;
    const allowed = PERSONA_CATEGORY_MAP[activeTab] || [];
    if (allowed.includes(cat)) return true;
    // 工具 slug 匹配：如 dev tab 匹配步骤含 github/notion/figma/canvas 等工具的
    const slugSignature: Record<string, TabType[]> = {
      shopify: ['cross'],
      etsy: ['cross'],
      shopline: ['cross'],
      shoplazza: ['cross'],
      fiverr: ['freelancer'],
      upwork: ['freelancer'],
      behance: ['freelancer', 'creator'],
      dribbble: ['freelancer', 'creator'],
      tiktok: ['creator'],
      douyin: ['creator'],
      youtube: ['creator'],
      instagram: ['creator'],
      pinterest: ['creator', 'marketing'],
      github: ['dev'],
      notino: ['dev'],
      vercel: ['dev'],
      notion: ['dev', 'office'],
      miro: ['dev', 'office'],
      excalidraw: ['dev', 'office'],
      slack: ['office', 'dev'],
      'google-workspace': ['office'],
      canva: ['marketing', 'creator'],
      semrush: ['marketing'],
      hubspot: ['marketing'],
      ga4: ['marketing'],
      kissmetrics: ['marketing'],
      grammarly: ['student', 'office'],
      quillbot: ['student', 'office'],
      zotero: ['student'],
    };
    let matched = false;
    wfSteps.forEach(s => {
      const tabs = slugSignature[s.toolSlug];
      if (tabs?.includes(activeTab)) matched = true;
    });
    return matched;
  };

  const filterByTab = (list: any[]) => {
    switch (activeTab) {
      case 'mine': return list.filter(w => w.isCustom);
      case 'inprogress': return list.filter(w => inProgressIds.includes(w.id));
      case 'completed': return list.filter(w => completedIds.includes(w.id));
      case 'favorites': return list.filter(w => isFavorite(w.id));
      default: return list.filter(w => !w.isCustom || activeTab === 'all').filter(w => matchesPersonaTab(w.category, w.steps));
    }
  };

  const filterBySearch = (list: any[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(w =>
      w.title.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.tags.some((tt: string) => tt.toLowerCase().includes(q)) ||
      w.steps.some((s: any) =>
        String(s.title || '').toLowerCase().includes(q) ||
        String(s.toolSlug || '').toLowerCase().includes(q)
      )
    );
  };

  const parseMinutes = (t: string): number => {
    const s = (t || '').toString();
    const m1 = s.match(/(\d+(?:\.\d+)?)\s*(h|小时|钟头)/);
    const m2 = s.match(/(\d+(?:\.\d+)?)\s*(min|分钟|分)/);
    if (m1) return Math.round(parseFloat(m1[1]) * 60);
    if (m2) return Math.round(parseFloat(m2[1]));
    if (/天|day/i.test(s)) return 1440;
    return 0;
  };

  const filterByAdvanced = (list: any[]) => {
    let out = list;
    if (difficulty !== 'all') out = out.filter(w => w.difficulty === difficulty);
    const timeVal: string = time;
    if (timeVal !== 'all') {
      out = out.filter(w => {
        const m = parseMinutes(w.estimatedTime);
        if (!m) return timeVal === 'all';
        if (timeVal === 'lt30') return m < 30;
        if (timeVal === 'lt60') return m < 60;
        if (timeVal === 'gt60') return m >= 60;
        return true;
      });
    }
    const slugList = toolSlugs.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (slugList.length) {
      out = out.filter(w => w.steps.some((s: any) => slugList.includes(String(s.toolSlug || '').toLowerCase())));
    }
    return out;
  };

  const displayedWorkflows = filterByAdvanced(filterBySearch(filterByTab(getAllWorkflows())));

  useEffect(() => {
    const el = sentinelEl;
    if (!el) return;
    if (visibleCount >= displayedWorkflows.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisibleCount((v) => Math.min(v + 10, displayedWorkflows.length));
          }
        }
      },
      { root: null, rootMargin: '240px 0px', threshold: 0 },
    );
    io.observe(el);
    return () => { io.disconnect(); };
  }, [visibleCount, displayedWorkflows.length, sentinelEl]);

  const getProgressInfo = (id: string) => {
    const progress = workflowProgress[id];
    if (!progress) return null;
    const total = progress.totalSteps || 0;
    const completed = progress.completedSteps.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent, isComplete: !!progress.completedAt, lastActiveAt: progress.lastActiveAt, startedAt: progress.startedAt };
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-[#E8F4F2] text-[#34A89C] dark:bg-[#2a4a46]/30 dark:text-[#74c5bc]';
      case 'medium': return 'bg-[#F5F6FB] text-[#5461A8] dark:bg-[#3a406a]/40 dark:text-[#B2BADE]';
      case 'advanced': return 'bg-[#E3E5F3] text-[#3d498a] dark:bg-[#3a406a]/60 dark:text-[#D9DCF0]';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const iconMap: Record<string, any> = {
    Presentation: Sparkles,
    Image: Sparkles,
    FileText: Sparkles,
    Code: Code2,
    Share2: Sparkles,
    GraduationCap: School,
    Video: Video,
    Zap,
    Palette: Sparkles,
    Globe: Globe2,
    TrendingUp,
    Mail: Sparkles,
    Headphones: Sparkles,
    ShoppingCart: Sparkles,
    Calendar: Sparkles,
    Search,
    Briefcase,
    Megaphone,
    Users,
    Calculator: FileText,
    Shield: Sparkles,
    Upload: Sparkles,
    Package: Sparkles,
    Cpu,
  };

  const recentWorkflows = useMemo(() => {
    const arr = getAllWorkflows()
      .map(w => ({ wf: w, prog: getProgressInfo(w.id) }))
      .filter(x => x.prog && x.prog.lastActiveAt > 0)
      .sort((a, b) => (b.prog!.lastActiveAt - a.prog!.lastActiveAt))
      .slice(0, 5)
      .map(x => x.wf);
    return arr;
  }, [workflowProgress, customWorkflows]);

  const topApps = useMemo(() => {
    const topIds = [
      'amazon', 'shopify', 'chatgpt', 'notion', 'github', 'canva', 'figma', 'google-docs',
      'google-sheets', 'whatsapp-business', 'tiktok', 'instagram', 'youtube', 'linkedin',
      'etsy', 'fiverr', 'upwork', 'dropbox', 'slack', 'zoom', 'stripe', 'paypal', 'semrush',
      'hubspot', 'ga4', 'mailchimp', 'quickbooks', 'capcut', 'grammarly', 'elevenlabs',
      'midjourney', 'dall-e-3', 'vercel', 'postman', 'mysql',
    ];
    const map = new Map<string, any>();
    tools.forEach(tl => map.set(tl.id, tl));
    return topIds.map(id => map.get(id)).filter(Boolean).slice(0, 30);
  }, [mounted]);

  const handleStartWorkflow = (wf: any) => {
    if (wf && wf.steps && wf.steps.length && !getProgressInfo(wf.id)) {
      startWorkflowProgress(wf.id, wf.isCustom ? 'custom' : 'official', wf.steps.length);
    }
  };

  const handleToggleStep = (e: React.MouseEvent, wfId: string, stepIndex: number, totalSteps: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!getProgressInfo(wfId)) {
      startWorkflowProgress(wfId, officialWorkflows.some(x => x.id === wfId) ? 'official' : 'custom', totalSteps);
    }
    toggleStepComplete(wfId, stepIndex);
  };

  const triggerWf = (ids: string[]) => {
    const id = ids[0];
    const wf = officialWorkflows.find(w => w.id === id);
    if (wf) handleStartWorkflow(wf);
  };

  const resetFilters = () => {
    setDifficulty('all');
    setTime('all');
    setToolSlugs('');
    setShowFilter(false);
  };

  const personaKeyIsState = (k: TabType) => ['inprogress', 'completed', 'mine', 'favorites'].includes(k);

  return (
    <div className='flex-1 min-w-0'>
      {!mounted ? (
        <div className='animate-pulse space-y-4'>
          <div className='h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-xl' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className='flex items-center gap-2 mb-2.5 sm:mb-3'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5461A8] dark:hover:text-[#B2BADE] transition-colors'>
          <ArrowLeft className='h-4 w-4' />
          <span className='text-[11px] sm:text-xs font-medium'>{t('action.back')}</span>
        </a>
      </div>

      <div className='flex items-center justify-between mb-3 sm:mb-5 gap-2.5 flex-wrap'>
        <div>
          <h1 className='text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-0.5 sm:mb-1 flex items-center gap-2'>
            <Sparkles className='w-5 h-5 sm:w-6 sm:h-6 text-[#5461A8]' />
            {t('title')}
          </h1>
          <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400'>
            {t('subtitle')}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowFilter(true)}
            className='inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-[11px] sm:text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-colors'
          >
            <Filter className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>{t('action.filter')}</span>
          </button>
          <button
            onClick={() => setShowCreatorCanvas(true)}
            className='inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#5461A8] hover:bg-[#4a579a] text-white font-medium text-[11px] sm:text-xs rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all'
          >
            <Layers className='w-4 h-4' />
            {t('action.canvas')}
          </button>
          <button
            onClick={() => setShowCreator(true)}
            className='inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-[11px] sm:text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-colors'
            title={t('action.listMode')}
          >
            <List className='w-3.5 h-3.5' />
            <span className='hidden sm:inline'>{t('action.list')}</span>
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 sm:mb-5'>
        <div className='relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 sm:p-3 overflow-hidden'>
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]' />
          <div className='flex items-center gap-2 mb-1 pt-0.5'>
            <div className='w-7 h-7 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 flex items-center justify-center'>
              <ListTodo className='w-3.5 h-3.5 text-[#5461A8] dark:text-[#B2BADE]' />
            </div>
          </div>
          <p className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'>
            {officialWorkflows.length + customWorkflows.length}
          </p>
          <p className='text-[11px] text-gray-500 dark:text-gray-400'>
            {t('stats.total')}
          </p>
        </div>
        <div className='relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 sm:p-3 overflow-hidden'>
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]/60' />
          <div className='flex items-center gap-2 mb-1 pt-0.5'>
            <div className='w-7 h-7 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 flex items-center justify-center'>
              <Clock3 className='w-3.5 h-3.5 text-[#5461A8] dark:text-[#B2BADE]' />
            </div>
          </div>
          <p className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'>
            {inProgressIds.length}
          </p>
          <p className='text-[11px] text-gray-500 dark:text-gray-400'>
            {t('stats.inProgress')}
          </p>
        </div>
        <div className='relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 sm:p-3 overflow-hidden'>
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]' />
          <div className='flex items-center gap-2 mb-1 pt-0.5'>
            <div className='w-7 h-7 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 flex items-center justify-center'>
              <CheckCircle2 className='w-3.5 h-3.5 text-[#34A89C]' />
            </div>
          </div>
          <p className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'>
            {workflowStats.totalCompleted}
          </p>
          <p className='text-[11px] text-gray-500 dark:text-gray-400'>
            {t('stats.completed')}
          </p>
        </div>
        <div className='relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 sm:p-3 overflow-hidden'>
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]/60' />
          <div className='flex items-center gap-2 mb-1 pt-0.5'>
            <div className='w-7 h-7 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 flex items-center justify-center'>
              <Flame className='w-3.5 h-3.5 text-[#5461A8] dark:text-[#B2BADE]' />
            </div>
          </div>
          <p className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'>
            {workflowStats.streakDays}
          </p>
          <p className='text-[11px] text-gray-500 dark:text-gray-400'>
            {t('stats.streak')}
          </p>
        </div>
      </div>

      {/* ===== A) Trigger-Action 场景卡（Zapier 风格） ===== */}
      <div className='mb-5 sm:mb-6'>
        <h2 className='text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-2.5 flex items-center gap-2'>
          <Zap className='w-4 h-4 text-yellow-500' />
          {t('section.trigger')}
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3'>
          {triggerTemplates.map((tr, idx) => {
            const wf = officialWorkflows.find(w => w.id === tr.workflowIds[0]);
            const href = wf ? getWorkflowDetailUrl(locale, wf) : `/${locale}/workflows`;
            return (
              <a
                key={idx}
                href={href}
                onClick={() => triggerWf(tr.workflowIds)}
                className='group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60 hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden'
              >
                <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]' />
                <div className='relative pt-0.5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-[#5461A8] shadow-sm'>
                      {t('trigger.when')}
                    </span>
                    <span className='text-[11px] font-medium text-gray-800 dark:text-gray-200 line-clamp-1'>{tr.trigger}</span>
                  </div>
                  <div className='flex items-start gap-2 mb-3'>
                    <div className='w-7 h-7 flex-shrink-0 rounded-lg bg-[#34A89C] flex items-center justify-center text-white shadow-sm'>
                      <ArrowRight className='w-3.5 h-3.5' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='text-[10px] text-gray-500 dark:text-gray-400 mb-0.5'>{t('trigger.then')}</div>
                      <div className='text-[11px] font-semibold text-gray-900 dark:text-gray-100 line-clamp-2'>{tr.action}</div>
                    </div>
                  </div>
                  <div className='mb-3 pl-9'>
                    <div className='text-[10px] text-gray-500 dark:text-gray-400 mb-0.5'>{t('trigger.result')}</div>
                    <div className='text-[11px] leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2'>{tr.result}</div>
                  </div>
                  <div className='flex items-center justify-between pl-9'>
                    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-[#5461A8] shadow-sm hover:bg-[#4a579a] hover:scale-105 active:scale-[0.98] transition-all'>
                      {t('action.launch')}
                      <ChevronRight className='w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform' />
                    </span>
                    {wf && (
                      <div className='text-[10px] text-gray-400 dark:text-gray-500'>
                        {wf.steps.length} {t('label.steps')} · {wf.estimatedTime}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ===== E) 顶部横滑 30 个国民 App / 工具 引流条 ===== */}
      <div className='mb-5 sm:mb-6'>
        <div className='flex items-center justify-between mb-2 sm:mb-2.5'>
          <h2 className='text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
            <Cpu className='w-4 h-4 text-[#5461A8]' />
            {t('section.apps')}
          </h2>
          <a href={`/${locale}`} className='text-[11px] sm:text-xs font-medium text-[#5461A8] dark:text-[#B2BADE] hover:text-[#4a579a] dark:hover:text-[#D9DCF0] flex items-center gap-1'>
            {t('apps.more')}
            <ChevronRight className='w-2.5 h-2.5' />
          </a>
        </div>
        <div className='flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
          {topApps.map(tl => {
            const Icon = iconMap['Zap'] || Zap;
            return (
              <a
                key={tl.id}
                href={resolveToolLink(tl.id, locale).url}
                target={isExternalTool(tl.id) ? '_blank' : undefined}
                rel={isExternalTool(tl.id) ? 'noopener noreferrer' : undefined}
                className='flex-shrink-0 w-18 sm:w-22 flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60 hover:shadow-md hover:-translate-y-0.5 transition-all group'
                title={tl.name}
              >
                <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#34A89C] group-hover:scale-110 transition-transform'>
                  <Icon className='w-4 h-4 sm:w-5 sm:h-5' />
                </div>
                <span className='text-[10px] sm:text-[11px] font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-2 leading-tight'>
                  {tl.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {inProgressIds.length > 0 && (
        <div className='mb-4 sm:mb-5'>
          <h2 className='text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-2.5 flex items-center gap-2'>
            <Clock3 className='w-4 h-4 text-blue-500' />
            {t('section.continue')}
          </h2>
          <div className='flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
            {getAllWorkflows()
              .filter(w => inProgressIds.includes(w.id))
              .slice(0, 5)
              .map((workflow) => {
                const Icon = iconMap[workflow.icon] || Zap;
                const progress = getProgressInfo(workflow.id);
                const detailUrl = getWorkflowDetailUrl(locale, workflow);
                return (
                  <a
                    key={workflow.id}
                    href={detailUrl}
                    className='relative flex-shrink-0 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all group overflow-hidden'
                  >
                    <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]' />
                    <div className='flex items-center gap-2 mb-1.5 pt-0.5'>
                      <div className='p-1.5 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE]'>
                        <Icon className='w-4 h-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-[11px] sm:text-xs truncate group-hover:text-[#5461A8] dark:group-hover:text-[#B2BADE] transition-colors'>
                          {workflow.title}
                        </h3>
                      </div>
                    </div>
                    <div className='mb-1.5'>
                      <div className='flex justify-between text-[11px] mb-0.5'>
                        <span className='text-gray-600 dark:text-gray-400'>{t('label.progress')}</span>
                        <span className='font-medium text-[#5461A8] dark:text-[#B2BADE]'>{progress?.percent || 0}%</span>
                      </div>
                      <div className='h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-[#5461A8] rounded-full transition-all'
                          style={{ width: `${progress?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className='flex items-center gap-1 text-[11px] text-[#5461A8] dark:text-[#B2BADE] font-medium'>
                      {t('action.continue')}
                      <ChevronRight className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
                    </div>
                  </a>
                );
              })}
          </div>
        </div>
      )}

      {/* ===== D) 最近启动 MRU 条 ===== */}
      <div className='mb-4 sm:mb-5'>
        <h2 className='text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-2.5 flex items-center gap-2'>
          <RotateCcw className='w-4 h-4 text-green-500' />
          {t('section.recent')}
        </h2>
        {recentWorkflows.length > 0 ? (
          <div className='flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
            {recentWorkflows.map((workflow) => {
              const Icon = iconMap[workflow.icon] || Zap;
              const progress = getProgressInfo(workflow.id);
              const detailUrl = workflow.isCustom
                ? `/${locale}/workflow/custom/${workflow.id}`
                : `/${locale}/workflow/${workflow.slug}`;
              return (
                <a
                  key={workflow.id}
                  href={detailUrl}
                  onClick={() => handleStartWorkflow(workflow)}
                  className='relative flex-shrink-0 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60 hover:shadow-md transition-all group overflow-hidden'
                >
                  <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]/80' />
                  <div className='flex items-center gap-2 mb-1.5 pt-0.5'>
                    <div className='p-1.5 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#34A89C]'>
                      <Icon className='w-4 h-4' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-[11px] sm:text-xs truncate group-hover:text-[#5461A8] dark:group-hover:text-[#B2BADE] transition-colors'>
                        {workflow.title}
                      </h3>
                    </div>
                  </div>
                  <p className='text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5 min-h-[32px]'>
                    {workflow.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500'>
                      <Clock className='w-3 h-3' />
                      {workflow.estimatedTime}
                    </div>
                    {progress && (
                      <span className={`text-[11px] font-semibold ${progress.isComplete ? 'text-[#34A89C]' : 'text-[#5461A8] dark:text-[#B2BADE]'}`}>
                        {progress.isComplete ? t('label.done') : `${progress.percent}%`}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className='rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4 text-center'>
            <div className='inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>
              <RotateCcw className='w-3.5 h-3.5' />
              <span>{t('empty.recent')}</span>
            </div>
          </div>
        )}
      </div>

      <div className='relative mb-3 sm:mb-4'>
        <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('placeholder.search')}
          className='w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] sm:text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40 focus:border-[#5461A8]/60 transition-all'
        />
      </div>

      {/* ===== C) 角色 Persona Tabs ===== */}
      <div className='flex flex-col sm:flex-row sm:items-start gap-2.5 mb-3 sm:mb-4'>
        <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 flex-1'>
          {PERSONA_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-[#5461A8] text-white border-[#5461A8] shadow-sm shadow-[#5461A8]/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${active ? 'text-white' : tab.color}`} />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </div>
        <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 flex-shrink-0'>
          {STATE_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100 shadow-lg shadow-gray-900/25 dark:shadow-gray-100/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <tab.icon className='w-3.5 h-3.5' />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 骨架屏：首屏不依赖 workflows/tools 两大数组，显示 shimmer，避免 HTML 内联 500KB+ 大常量 */}
      {!dataLoaded && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-1' aria-hidden='true'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex flex-col animate-pulse min-h-[260px]'>
              <div className='flex items-start justify-between gap-2.5 mb-2.5'>
                <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                  <div className='p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 w-10 h-10 sm:w-11 sm:h-11' />
                  <div className='min-w-0 flex-1 space-y-1.5'>
                    <div className='flex items-center gap-1.5'>
                      <div className='h-3.5 w-12 bg-gray-100 dark:bg-gray-700 rounded-full' />
                      <div className='h-3.5 w-10 bg-gray-100 dark:bg-gray-700 rounded-full' />
                    </div>
                    <div className='h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded' />
                  </div>
                </div>
                <div className='w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-lg' />
              </div>
              <div className='h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1' />
              <div className='h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2.5' />
              <div className='space-y-1 mb-2.5'>
                <div className='h-5 w-full bg-gray-100 dark:bg-gray-800 rounded-lg' />
                <div className='h-5 w-full bg-gray-100 dark:bg-gray-800 rounded-lg' />
                <div className='h-5 w-full bg-gray-100 dark:bg-gray-800 rounded-lg' />
                <div className='h-5 w-full bg-gray-100 dark:bg-gray-800 rounded-lg' />
                <div className='h-5 w-full bg-gray-100 dark:bg-gray-800 rounded-lg' />
              </div>
              <div className='flex items-center justify-between mt-auto pt-2.5 border-t border-gray-100 dark:border-gray-700/50 gap-2.5'>
                <div className='flex items-center gap-1.5'>
                  <div className='h-4 w-4 bg-gray-100 dark:bg-gray-700 rounded' />
                  <div className='h-3 w-14 bg-gray-100 dark:bg-gray-700 rounded' />
                </div>
                <div className='h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded-full' />
              </div>
            </div>
          ))}
        </div>
      )}

      {dataLoaded && displayedWorkflows.length > 0 ? (
        <>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3'>
          {displayedWorkflows.slice(0, visibleCount).flatMap((workflow, idx) => {
            const Icon = iconMap[workflow.icon] || Zap;
            const progress = getProgressInfo(workflow.id);
            const detailUrl = workflow.isCustom
              ? `/${locale}/workflow/custom/${workflow.id}`
              : `/${locale}/workflow/${workflow.slug}`;
            const completedSet = new Set((workflowProgress as any)[workflow.id]?.completedSteps || []);
            const card = (
              <a
                key={workflow.id}
                href={detailUrl}
                className='group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col'
              >
                {progress && !progress.isComplete && progress.percent > 0 && (
                  <div className='absolute top-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700'>
                    <div
                      className='h-full bg-[#5461A8] transition-all'
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                )}
                {progress && progress.isComplete && (
                  <div className='absolute top-0 left-0 right-0 h-0.5 bg-[#34A89C]' />
                )}

                <div className='flex items-start justify-between gap-2.5 mb-2.5'>
                  <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                    <div className='p-2 sm:p-2.5 rounded-xl bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE] flex-shrink-0 group-hover:scale-110 transition-transform'>
                      <Icon className='w-4 h-4 sm:w-5 sm:h-5' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-1.5 mb-0.5 flex-wrap'>
                        {workflow.isCustom && (
                          <span className='text-[10px] px-1.5 py-0.5 rounded bg-[#F5F6FB] dark:bg-[#3a406a]/40 text-[#5461A8] dark:text-[#B2BADE] font-medium'>
                            {t('label.mine')}
                          </span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getDifficultyStyle(workflow.difficulty)}`}>
                          {t(`difficulty.${workflow.difficulty}`)}
                        </span>
                      </div>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#5461A8] dark:group-hover:text-[#B2BADE] transition-colors truncate text-xs sm:text-sm'>
                        {workflow.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWorkflowFavorite(workflow.id);
                    }}
                    className={`p-1 rounded-lg transition-all flex-shrink-0 ${
                      isFavorite(workflow.id)
                        ? 'text-yellow-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite(workflow.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mb-2.5 line-clamp-2 min-h-[32px] leading-relaxed'>
                  {workflow.description}
                </p>

                {/* ===== B) 5 步可打勾 + 跳工具页 ===== */}
                <div className='mb-2.5 space-y-1'>
                  {workflow.steps.slice(0, 5).map((step: any, i: number) => {
                    const done = completedSet.has(i);
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                          done
                            ? 'bg-[#E8F4F2] dark:bg-[#2a4a46]/30'
                            : 'bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <button
                          onClick={(e) => handleToggleStep(e, workflow.id, i, workflow.steps.length)}
                          title={t('label.completeStep')}
                          className={`flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
                            done
                              ? 'bg-[#34A89C] border-[#34A89C] text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-[#5461A8] dark:hover:border-[#5461A8]'
                          }`}
                        >
                          {done ? <CheckCircle className='w-3 h-3' /> : <Circle className='w-2.5 h-2.5 text-transparent group-hover:text-gray-300 dark:group-hover:text-gray-600' />}
                        </button>
                        <div className='min-w-0 flex-1'>
                          <div className={`text-[11px] sm:text-xs font-medium truncate ${done ? 'text-[#34A89C] dark:text-[#74c5bc] line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                            <span className='text-gray-400 dark:text-gray-500 mr-1'>{i + 1}.</span>
                            {step.title}
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const link = resolveToolLink(step.toolSlug, locale);
                            safeNavigate(link.url, link.type === 'external' ? '_blank' : undefined);
                          }}
                          title={`${t('label.openTool')}: ${getToolDisplayLabel(step.toolSlug) || step.toolSlug}${isExternalTool(step.toolSlug) ? '（外部）' : ''}`}
                          className={`flex-shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors h-[18px] ${
                            isExternalTool(step.toolSlug)
                              ? 'text-[#34A89C] hover:bg-[#E8F4F2] dark:hover:bg-[#2a4a46]/30'
                              : 'text-[#5461A8] dark:text-[#B2BADE] hover:bg-[#F5F6FB] dark:hover:bg-[#3a406a]/30'
                          }`}
                        >
                          <ArrowRight className='w-2.5 h-2.5' />
                        </button>
                      </div>
                    );
                  })}
                  {workflow.steps.length > 5 && (
                    <div className='text-[11px] text-gray-400 dark:text-gray-500 pl-7'>
                      + {workflow.steps.length - 5} {t('label.steps')} …
                    </div>
                  )}
                </div>

                <div className='flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700/50 gap-2.5'>
                  <div className='flex items-center gap-2.5 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap'>
                    <span className='flex items-center gap-0.5'>
                      <Clock className='w-3 h-3' />
                      {workflow.estimatedTime}
                    </span>
                    <span className='flex items-center gap-0.5'>
                      <ListTodo className='w-3 h-3' />
                      {workflow.steps.length} {t('label.steps')}
                    </span>
                    {progress && !progress.isComplete && progress.percent > 0 && (
                      <span className='flex items-center gap-0.5 text-[#5461A8] dark:text-[#B2BADE] font-medium'>
                        {progress.percent}%
                      </span>
                    )}
                    {progress?.isComplete && (
                      <span className='flex items-center gap-0.5 text-[#34A89C] font-medium'>
                        <CheckCircle2 className='w-3 h-3' />
                        {t('label.done')}
                      </span>
                    )}
                  </div>
                  <ChevronRight className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#5461A8] dark:group-hover:text-[#B2BADE] group-hover:translate-x-0.5 transition-all flex-shrink-0' />
                </div>
              </a>
            );
            // ===== Ad Slot 3/3: Workflows In-feed (第 3 张卡片后插入) =====
            if (idx === 2) {
              return [
                card,
                <AdSlot
                  key="wf-infeed-ad-1"
                  slot="workflows-infeed-1"
                  size="in-feed"
                  closable
                  showPlaceholder
                />,
              ];
            }
            return [card];
          })}
        </div>
        {visibleCount < displayedWorkflows.length && (
          <>
            <div ref={sentinelCallback} className='h-4 w-full' aria-hidden='true' />
            <div className='flex justify-center pt-2 pb-2 mt-5 sm:mt-6'>
              <div className='flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>
                <div className='h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-[#5461A8] dark:border-t-[#B2BADE] animate-spin' />
                <span>{t('state.loadingMore')} ({visibleCount} / {displayedWorkflows.length})</span>
              </div>
            </div>
          </>
        )}
        </>
      ) : null}

      {dataLoaded && displayedWorkflows.length === 0 && (
        <div className='text-center py-6 sm:p-8'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
            {activeTab === 'mine' ? (
              <FolderPlus className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            ) : activeTab === 'favorites' ? (
              <Star className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            ) : activeTab === 'completed' ? (
              <Trophy className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            ) : (
              <Search className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' />
            )}
          </div>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5'>
            {activeTab === 'mine'
              ? t('empty.mine')
              : activeTab === 'favorites'
              ? t('empty.favorites')
              : activeTab === 'completed'
              ? t('empty.completed')
              : activeTab === 'inprogress'
              ? t('empty.inProgress')
              : t('empty.all')}
          </h2>
          <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4'>
            {activeTab === 'mine'
              ? t('empty.mine')
              : activeTab === 'favorites'
              ? t('empty.favorites')
              : activeTab === 'completed'
              ? t('empty.completed')
              : activeTab === 'inprogress'
              ? t('empty.inProgress')
              : t('empty.all')}
          </p>
          {(difficulty !== 'all' || time !== 'all' || toolSlugs) && (
            <button
              onClick={resetFilters}
              className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[11px] sm:text-xs font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-3'
            >
              <RotateCcw className='w-4 h-4' />
              {t('action.reset')}
            </button>
          )}
          {activeTab === 'mine' && (
            <button
              onClick={() => setShowCreatorCanvas(true)}
              className='inline-flex items-center gap-2 px-4 py-2 bg-[#5461A8] text-white text-[11px] sm:text-xs font-medium rounded-xl hover:bg-[#4a579a] transition-colors'
            >
              <Layers className='w-4 h-4' />
              {t('action.createFirst')}
            </button>
          )}
        </div>
      )}

      {/* ===== F) 高级筛选抽屉（Zapier 风格侧滑） ===== */}
      {showFilter && (
        <>
          <div
            className='fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm'
            onClick={() => setShowFilter(false)}
          />
          <div className='fixed right-0 top-0 z-50 h-full w-full sm:w-[380px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]'>
            <div className='flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                <Filter className='w-5 h-5 text-[#5461A8]' />
                {t('filter.title')}
              </h3>
              <button
                onClick={() => setShowFilter(false)}
                className='p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-4 sm:p-5 space-y-6'>
              <div>
                <label className='text-sm font-medium text-gray-800 dark:text-gray-200 block mb-2'>
                  {t('filter.difficulty')}
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {(['all', 'easy', 'medium', 'advanced'] as DifficultyFilter[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
                        difficulty === d
                          ? 'bg-[#5461A8] text-white border-[#5461A8] shadow-sm shadow-[#5461A8]/20'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60'
                      }`}
                    >
                      {d === 'all' ? t('action.reset') : t(`difficulty.${d}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-800 dark:text-gray-200 block mb-2'>
                  {t('filter.estimatedTime')}
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {([['all', t('filter.anyTime')], ['lt30', '< 30 min'], ['lt60', '< 60 min'], ['gt60', '≥ 60 min']] as Array<[TimeFilter, string]>).map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => setTime(v)}
                      className={`py-2 px-2 rounded-lg text-[11px] font-medium transition-all border ${
                        time === v
                          ? 'bg-[#5461A8] text-white border-[#5461A8] shadow-sm shadow-[#5461A8]/20'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-800 dark:text-gray-200 block mb-2'>
                  {t('filter.containsTool')}
                </label>
                <input
                  type='text'
                  value={toolSlugs}
                  onChange={(e) => setToolSlugs(e.target.value)}
                  placeholder={t('filter.containsToolPlaceholder')}
                  className='w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40 focus:border-[#5461A8]/60 transition-all'
                />
                <div className='mt-2 flex flex-wrap gap-1.5'>
                  {['shopify', 'chatgpt', 'canva', 'notion', 'github', 'fiverr', 'tiktok', 'midjourney', 'vercel', 'slack'].map(slug => (
                    <button
                      key={slug}
                      onClick={() => setToolSlugs(prev => prev ? `${prev}, ${slug}` : slug)}
                      className='text-[11px] px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#F5F6FB] hover:text-[#5461A8] dark:hover:bg-[#3a406a]/30 dark:hover:text-[#B2BADE] transition-colors'
                    >
                      + {slug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='border-t border-gray-200 dark:border-gray-800 p-4 sm:p-5 flex gap-3'>
              <button
                onClick={resetFilters}
                className='flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
              >
                <RotateCcw className='w-4 h-4' />
                {t('action.reset')}
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className='flex-[1.5] inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#5461A8] hover:bg-[#4a579a] text-white text-sm font-semibold rounded-xl shadow-sm shadow-[#5461A8]/25 hover:shadow-md hover:shadow-[#5461A8]/30 transition-all'
              >
                <CheckCircle2 className='w-4 h-4' />
                {t('action.apply')} · {displayedWorkflows.length}
              </button>
            </div>
          </div>
        </>
      )}

      {showCreator && (
        <WorkflowCreator
          locale={locale}
          onClose={() => setShowCreator(false)}
        />
      )}

      {showCreatorCanvas && (
        <CanvasComingSoonModal
          locale={locale}
          onClose={() => setShowCreatorCanvas(false)}
        />
      )}
        </>
      )}
    </div>
  );
}

const COMING_SOON: Record<string, Record<string, string>> = {
  zh: {
    title: '新建画布功能 · 即将上线',
    subtitle: '拖拽式画布编排、节点连线、模板生成、AI 自动构建正在紧锣密鼓开发中',
    eta: '预计上线：2026 年 Q3',
    feature1: '🎯 拖拽式画布：零代码编排复杂工作流',
    feature2: '🔗 节点自动连线：智能锚点对齐 + 贝塞尔曲线',
    feature3: '🧠 AI 智能生成：一句话描述自动生成完整流程',
    feature4: '📦 50+ 模板市场：行业模板一键导入复用',
    close: '知道了，返回列表',
  },
  en: {
    title: 'Canvas Editor · Coming Soon',
    subtitle: 'Drag-and-drop canvas editor, node connection lines, templates, AI workflow builder are in development',
    eta: 'ETA: Q3 2026',
    feature1: '🎯 Drag & Drop Canvas: Build complex workflows with zero code',
    feature2: '🔗 Auto Connection Lines: Smart anchor align + bezier curves',
    feature3: '🧠 AI Generator: Describe in one sentence, auto-build the flow',
    feature4: '📦 50+ Templates: Industry-ready templates ready to import',
    close: 'Got it, back to list',
  },
  hi: {
    title: 'कैनवास एडिटर · जल्द आ रहा है',
    subtitle: 'ड्रैग एंड ड्रॉप कैनवास, नोड कनेक्शन, टेम्पलेट्स, AI जनरेटर विकास में हैं',
    eta: 'लॉन्च: Q3 2026',
    feature1: '🎯 ड्रैग एंड ड्रॉप कैनवास: बिना कोड के जटिल वर्कफ़्लो बनाएं',
    feature2: '🔗 ऑटो कनेक्शन लाइन्स: स्मार्ट एंकर + बेजियर कर्व्स',
    feature3: '🧠 AI जनरेटर: एक वाक्य में वर्णन करें, फ्लो अपने आप बनेगा',
    feature4: '📦 50+ टेम्पलेट्स: उद्योग के तैयार टेम्पलेट्स इम्पोर्ट करें',
    close: 'ठीक है, सूची पर वापस जाएं',
  },
  fr: {
    title: 'Éditeur Canevas · Bientôt disponible',
    subtitle: 'Éditeur glisser-déposer, connexions entre nœuds, templates et générateur IA en développement',
    eta: 'Disponible : T3 2026',
    feature1: '🎯 Canevas Glisser-Déposer : Créez des workflows complexes sans code',
    feature2: '🔗 Connexions Auto : Ancrages intelligents + courbes de Bézier',
    feature3: '🧠 Générateur IA : Décrivez en une phrase, le workflow se crée seul',
    feature4: '📦 50+ Templates : Templates prêts à l\'emploi à importer',
    close: 'Compris, retour à la liste',
  },
  es: {
    title: 'Editor de Lienzo · Próximamente',
    subtitle: 'Editor de arrastrar y soltar, conexiones, plantillas y generador IA en desarrollo',
    eta: 'Fecha: Q3 2026',
    feature1: '🎯 Lienzo Arrastrar-Soltar: Crea flujos complejos sin código',
    feature2: '🔗 Conexiones Auto: Anclajes inteligentes + curvas Bézier',
    feature3: '🧠 Generador IA: Describe en una frase, el flujo se crea solo',
    feature4: '📦 50+ Plantillas: Listas para importar y usar',
    close: 'Entendido, volver a la lista',
  },
  ar: {
    title: 'محرر اللوحة · قريباً',
    subtitle: 'محرر السحب والإفلات، خطوط الربط، القوالب والمولد بالذكاء الاصطناعي قيد التطوير',
    eta: 'التاريخ: Q3 2026',
    feature1: '🎯 لوحة السحب والإفلات: أنشئ سير عمل معقد بدون برمجة',
    feature2: '🔗 خطوط ربط تلقائية: مراكز ذكية + منحنيات بيزيه',
    feature3: '🧠 المولد الذكي: صف في جملة واحدة، ينشئ السير تلقائياً',
    feature4: '📦 50+ قالب: قوالب صناعية جاهزة للاستيراد',
    close: 'تم الفهم، العودة للقائمة',
  },
};

function getCS(locale: string, key: string): string {
  const dict = COMING_SOON[locale] || COMING_SOON.zh;
  return dict[key] ?? COMING_SOON.zh[key] ?? key;
}

function CanvasComingSoonModal({ locale, onClose }: { locale: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900 md:rounded-2xl md:m-4 md:shadow-2xl md:border md:border-gray-200 md:dark:border-gray-700 md:overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
      {/* Header */}
      <div className="h-14 sm:h-16 flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-indigo-500" />
            Canvas Editor
          </div>
          <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {getCS(locale, 'title')}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/40 dark:via-blue-950/40 dark:to-cyan-950/40 border border-indigo-200/50 dark:border-indigo-800/40">
          <Clock className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            {getCS(locale, 'eta')}
          </span>
        </div>
        <button
          onClick={onClose}
          className="hidden sm:inline-flex h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-sm shadow-indigo-500/25 items-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {getCS(locale, 'close')}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="min-h-full flex items-center justify-center px-4 sm:px-8 py-10 sm:py-16">
          <div className="max-w-2xl w-full flex flex-col items-center text-center">
            <div className="relative mb-8 sm:mb-10">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500" />
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 shadow-xl flex items-center justify-center">
                <Layers className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={1.8} />
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center rotate-12 border border-gray-100 dark:border-gray-700">
                <Construction className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" strokeWidth={2} />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3 sm:mb-4">
              {getCS(locale, 'title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-8 sm:mb-10">
              {getCS(locale, 'subtitle')}
            </p>

            <div className="w-full max-w-lg grid gap-2.5 sm:gap-3 mb-8 sm:mb-10">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((fk, i) => (
                <div
                  key={fk}
                  className="flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
                  </div>
                  <p className="text-xs sm:text-sm md:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    {getCS(locale, fk)}
                  </p>
                </div>
              ))}
            </div>

            <div className="sm:hidden w-full space-y-3">
              <button
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-sm font-bold shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                {getCS(locale, 'close')}
              </button>
              <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                {getCS(locale, 'eta')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300/40 dark:via-gray-600/40 to-transparent" />
    </div>
  );
}
