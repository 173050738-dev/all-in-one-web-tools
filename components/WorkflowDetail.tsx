'use client';
import dynamic from 'next/dynamic';
import { Fragment, useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  Clock,
  Zap,
  Play,
  ArrowRight,
  ExternalLink,
  Presentation,
  Image,
  FileText,
  Code,
  Share2,
  GraduationCap,
  Video,
  Star,
  Heart,
  Palette,
  Globe,
  TrendingUp,
  Mail,
  Headphones,
  ShoppingCart,
  Calendar,
  Check,
  RotateCcw,
  Copy,
  QrCode,
  X,
  Edit3,
  Plus,
  Trash2,
  Save,
  Trophy,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { usePreferencesStore } from '@/stores/preferences';
import { logLike, logFavorite } from '@/utils/audit-log';
import type { Workflow } from '@/data/workflows';
import { getToolBySlug, tools } from '@/data/tools';
import { resolveToolLink, isExternalTool, getToolDisplayLabel } from '@/lib/toolLinks';
import { translateWorkflow } from '@/lib/workflowTranslations';
import type { Locale } from '@/lib/workflowTranslations';
import type { CustomWorkflowStep, CustomWorkflow } from '@/stores/preferences';

const KofiUnlockBanner = dynamic(() => import('@/components/KofiUnlockBanner'), { ssr: false });
const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="w-full min-h-[120px] sm:min-h-[130px] rounded-xl border border-transparent" />
  ),
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Presentation,
  Image,
  FileText,
  Code,
  Share2,
  GraduationCap,
  Video,
  Zap,
  Palette,
  Globe,
  TrendingUp,
  Mail,
  Headphones,
  ShoppingCart,
  Calendar,
};

const translations: Record<string, Record<string, string>> = {
  zh: {
    'action.back': '返回工作流列表',
    'action.start': '开始执行',
    'action.completed': '已完成',
    'action.reset': '重置',
    'action.inProgress': '进行中',
    'action.share': '分享',
    'action.edit': '编辑',
    'action.add': '添加步骤',
    'action.save': '保存修改',
    'action.saveAs': '保存到我的工作流',
    'action.cancel': '取消',
    'action.close': '关闭',
    'action.confirm': '确认',
    'action.copy': '复制链接',
    'action.copied': '已复制',
    'action.editWorkflow': '编辑工作流',
    'action.saveAsMy': '另存为我的工作流',
    'action.selectTool': '选择工具',
    'action.searchTool': '搜索工具...',
    'action.noTools': '未找到相关工具',
    'action.noSteps': '还没有步骤，点击上方添加',
    'state.notFound': '工作流不存在',
    'state.myWorkflow': '我的工作流',
    'label.steps': '个步骤',
    'label.progress': '执行进度',
    'label.sectionSteps': '操作步骤',
    'label.rating': '工作流评分',
    'label.aiRecommend': '一键AI推荐',
    'label.aiRecommendDesc': '不确定用什么工具？让AI根据你的需求智能推荐。',
    'label.homepage': '去首页',
    'label.shareTitle': '分享工作流',
    'label.aiWorkflow': 'AI工作流',
    'label.scanQr': '扫码查看工作流',
    'label.shareHint': '对方打开链接后可保存到自己的工作流',
    'label.workflowName': '工作流名称',
    'label.workflowNamePh': '输入工作流名称',
    'label.description': '工作流描述',
    'label.descriptionPh': '简要描述这个工作流',
    'label.stepList': '步骤列表',
    'label.completeTitle': '🎉 太棒了！',
    'label.completeDesc': '你已完成「{title}」工作流，继续加油！',
    'label.completeDescEn': 'You completed "{title}" workflow!',
    'stats.steps': '步骤',
    'stats.minSaved': '分钟节省',
    'stats.totalDone': '累计完成',
    'achievement.title': '🏆 解锁成就',
    'achievement.firstWin': '初次完成',
    'achievement.efficiencyPro': '效率达人',
    'achievement.streak5': '连续5天',
    'achievement.persistent': '坚持者',
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.advanced': '进阶',
    'rating.rated': '你已打 {n} 星 · ',
    'rating.clickRate': '点击星星评分 · ',
    'rating.people': '人评价',
  },
  en: {
    'action.back': 'Back to workflows',
    'action.start': 'Start Workflow',
    'action.completed': 'Completed',
    'action.reset': 'Reset',
    'action.inProgress': 'In Progress',
    'action.share': 'Share',
    'action.edit': 'Edit',
    'action.add': 'Add Step',
    'action.save': 'Save',
    'action.saveAs': 'Save to My Workflows',
    'action.cancel': 'Cancel',
    'action.close': 'Close',
    'action.confirm': 'Confirm',
    'action.copy': 'Copy Link',
    'action.copied': 'Copied',
    'action.editWorkflow': 'Edit Workflow',
    'action.saveAsMy': 'Save as My Workflow',
    'action.selectTool': 'Select Tool',
    'action.searchTool': 'Search tools...',
    'action.noTools': 'No tools found',
    'action.noSteps': 'No steps yet, add one above',
    'state.notFound': 'Workflow not found',
    'state.myWorkflow': 'My Workflow',
    'label.steps': 'steps',
    'label.progress': 'Progress',
    'label.sectionSteps': 'Steps',
    'label.rating': 'Workflow Rating',
    'label.aiRecommend': 'AI Recommendation',
    'label.aiRecommendDesc': 'Not sure what tools to use? Let AI recommend based on your needs.',
    'label.homepage': 'Homepage',
    'label.shareTitle': 'Share Workflow',
    'label.aiWorkflow': 'AI Workflow',
    'label.scanQr': 'Scan to view workflow',
    'label.shareHint': 'Recipients can save to their own workflows',
    'label.workflowName': 'Workflow Name',
    'label.workflowNamePh': 'Enter workflow name',
    'label.description': 'Description',
    'label.descriptionPh': 'Brief description',
    'label.stepList': 'Steps',
    'label.completeTitle': '🎉 Awesome!',
    'label.completeDesc': 'You completed "{title}" workflow!',
    'label.completeDescEn': 'You completed "{title}" workflow!',
    'stats.steps': 'Steps',
    'stats.minSaved': 'Min Saved',
    'stats.totalDone': 'Total Done',
    'achievement.title': '🏆 Achievements Unlocked',
    'achievement.firstWin': 'First Win',
    'achievement.efficiencyPro': 'Efficiency Pro',
    'achievement.streak5': '5-Day Streak',
    'achievement.persistent': 'Persistent',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.advanced': 'Advanced',
    'rating.rated': 'You rated {n} stars · ',
    'rating.clickRate': 'Click stars to rate · ',
    'rating.people': 'ratings',
  },
  hi: {
    'action.back': 'वर्कफ़्लो सूची पर वापस',
    'action.start': 'वर्कफ़्लो शुरू करें',
    'action.completed': 'पूर्ण',
    'action.reset': 'रीसेट',
    'action.inProgress': 'प्रगति पर',
    'action.share': 'साझा करें',
    'action.edit': 'संपादित करें',
    'action.add': 'चरण जोड़ें',
    'action.save': 'सहेजें',
    'action.saveAs': 'मेरे वर्कफ़्लो में सहेजें',
    'action.cancel': 'रद्द करें',
    'action.close': 'बंद करें',
    'action.confirm': 'पुष्टि करें',
    'action.copy': 'लिंक कॉपी करें',
    'action.copied': 'कॉपी हो गया',
    'action.editWorkflow': 'वर्कफ़्लो संपादित करें',
    'action.saveAsMy': 'मेरे वर्कफ़्लो के रूप में सहेजें',
    'action.selectTool': 'टूल चुनें',
    'action.searchTool': 'टूल्स खोजें...',
    'action.noTools': 'कोई टूल नहीं मिला',
    'action.noSteps': 'अभी कोई चरण नहीं, ऊपर से जोड़ें',
    'state.notFound': 'वर्कफ़्लो नहीं मिला',
    'state.myWorkflow': 'मेरा वर्कफ़्लो',
    'label.steps': 'चरण',
    'label.progress': 'प्रगति',
    'label.sectionSteps': 'चरण',
    'label.rating': 'वर्कफ़्लो रेटिंग',
    'label.aiRecommend': 'AI अनुशंसा',
    'label.aiRecommendDesc': 'कौन से टूल उपयोग करें? AI को आपकी ज़रूरत के अनुसार अनुशंसा करने दें।',
    'label.homepage': 'होमपेज',
    'label.shareTitle': 'वर्कफ़्लो साझा करें',
    'label.aiWorkflow': 'AI वर्कफ़्लो',
    'label.scanQr': 'वर्कफ़्लो देखने के लिए स्कैन करें',
    'label.shareHint': 'प्राप्तकर्ता अपने स्वयं के वर्कफ़्लो में सहेज सकते हैं',
    'label.workflowName': 'वर्कफ़्लो का नाम',
    'label.workflowNamePh': 'वर्कफ़्लो का नाम दर्ज करें',
    'label.description': 'विवरण',
    'label.descriptionPh': 'संक्षिप्त विवरण',
    'label.stepList': 'चरण',
    'label.completeTitle': '🎉 बहुत बढ़िया!',
    'label.completeDesc': 'आपने "{title}" वर्कफ़्लो पूरा किया!',
    'label.completeDescEn': 'You completed "{title}" workflow!',
    'stats.steps': 'चरण',
    'stats.minSaved': 'मिनट बचे',
    'stats.totalDone': 'कुल पूर्ण',
    'achievement.title': '🏆 उपलब्धियाँ अनलॉक',
    'achievement.firstWin': 'पहली जीत',
    'achievement.efficiencyPro': 'दक्षता प्रो',
    'achievement.streak5': '5-दिन की स्ट्रीक',
    'achievement.persistent': 'निरंतर',
    'difficulty.easy': 'आसान',
    'difficulty.medium': 'मध्यम',
    'difficulty.advanced': 'उन्नत',
    'rating.rated': 'आपने {n} स्टार दिए · ',
    'rating.clickRate': 'रेट करने के लिए स्टार पर क्लिक करें · ',
    'rating.people': 'मूल्यांकन',
  },
  fr: {
    'action.back': 'Retour aux workflows',
    'action.start': 'Démarrer le Workflow',
    'action.completed': 'Terminé',
    'action.reset': 'Réinitialiser',
    'action.inProgress': 'En Cours',
    'action.share': 'Partager',
    'action.edit': 'Modifier',
    'action.add': 'Ajouter une Étape',
    'action.save': 'Enregistrer',
    'action.saveAs': 'Enregistrer dans Mes Workflows',
    'action.cancel': 'Annuler',
    'action.close': 'Fermer',
    'action.confirm': 'Confirmer',
    'action.copy': 'Copier le Lien',
    'action.copied': 'Copié',
    'action.editWorkflow': 'Modifier le Workflow',
    'action.saveAsMy': 'Enregistrer comme Mon Workflow',
    'action.selectTool': 'Sélectionner Outil',
    'action.searchTool': 'Rechercher outils...',
    'action.noTools': 'Aucun outil trouvé',
    'action.noSteps': 'Aucune étape, ajoutez-en une ci-dessus',
    'state.notFound': 'Workflow non trouvé',
    'state.myWorkflow': 'Mon Workflow',
    'label.steps': 'étapes',
    'label.progress': 'Progrès',
    'label.sectionSteps': 'Étapes',
    'label.rating': 'Note du Workflow',
    'label.aiRecommend': 'Recommandation IA',
    'label.aiRecommendDesc': 'Pas sûr des outils? Laissez l\'IA recommander selon vos besoins.',
    'label.homepage': 'Accueil',
    'label.shareTitle': 'Partager le Workflow',
    'label.aiWorkflow': 'Workflow IA',
    'label.scanQr': 'Scanner pour voir le workflow',
    'label.shareHint': 'Les destinataires peuvent enregistrer dans leurs propres workflows',
    'label.workflowName': 'Nom du Workflow',
    'label.workflowNamePh': 'Entrez le nom du workflow',
    'label.description': 'Description',
    'label.descriptionPh': 'Brève description',
    'label.stepList': 'Étapes',
    'label.completeTitle': '🎉 Génial!',
    'label.completeDesc': 'Vous avez terminé le workflow "{title}"!',
    'label.completeDescEn': 'You completed "{title}" workflow!',
    'stats.steps': 'Étapes',
    'stats.minSaved': 'Min Gagnées',
    'stats.totalDone': 'Total Terminés',
    'achievement.title': '🏆 Succès Débloqués',
    'achievement.firstWin': 'Première Victoire',
    'achievement.efficiencyPro': 'Pro de l\'Efficacité',
    'achievement.streak5': 'Série 5 Jours',
    'achievement.persistent': 'Persévérant',
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.advanced': 'Avancé',
    'rating.rated': 'Vous avez noté {n} étoiles · ',
    'rating.clickRate': 'Cliquez sur les étoiles pour noter · ',
    'rating.people': 'notes',
  },
  es: {
    'action.back': 'Volver a flujos',
    'action.start': 'Iniciar Flujo',
    'action.completed': 'Completado',
    'action.reset': 'Restablecer',
    'action.inProgress': 'En Progreso',
    'action.share': 'Compartir',
    'action.edit': 'Editar',
    'action.add': 'Añadir Paso',
    'action.save': 'Guardar',
    'action.saveAs': 'Guardar en Mis Flujos',
    'action.cancel': 'Cancelar',
    'action.close': 'Cerrar',
    'action.confirm': 'Confirmar',
    'action.copy': 'Copiar Enlace',
    'action.copied': 'Copiado',
    'action.editWorkflow': 'Editar Flujo',
    'action.saveAsMy': 'Guardar como Mi Flujo',
    'action.selectTool': 'Seleccionar Herramienta',
    'action.searchTool': 'Buscar herramientas...',
    'action.noTools': 'No se encontraron herramientas',
    'action.noSteps': 'No hay pasos, añade uno arriba',
    'state.notFound': 'Flujo no encontrado',
    'state.myWorkflow': 'Mi Flujo',
    'label.steps': 'pasos',
    'label.progress': 'Progreso',
    'label.sectionSteps': 'Pasos',
    'label.rating': 'Valoración del Flujo',
    'label.aiRecommend': 'Recomendación IA',
    'label.aiRecommendDesc': '¿No sabes qué herramientas usar? Deja que la IA recomiende según tus necesidades.',
    'label.homepage': 'Inicio',
    'label.shareTitle': 'Compartir Flujo',
    'label.aiWorkflow': 'Flujo IA',
    'label.scanQr': 'Escanea para ver el flujo',
    'label.shareHint': 'Los destinatarios pueden guardar en sus propios flujos',
    'label.workflowName': 'Nombre del Flujo',
    'label.workflowNamePh': 'Introduce nombre del flujo',
    'label.description': 'Descripción',
    'label.descriptionPh': 'Descripción breve',
    'label.stepList': 'Pasos',
    'label.completeTitle': '🎉 ¡Increíble!',
    'label.completeDesc': '¡Completaste el flujo "{title}"!',
    'label.completeDescEn': 'You completed "{title}" workflow!',
    'stats.steps': 'Pasos',
    'stats.minSaved': 'Min Ahorrados',
    'stats.totalDone': 'Total Hechos',
    'achievement.title': '🏆 Logros Desbloqueados',
    'achievement.firstWin': 'Primera Victoria',
    'achievement.efficiencyPro': 'Pro de Eficiencia',
    'achievement.streak5': 'Racha 5 Días',
    'achievement.persistent': 'Persistente',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.advanced': 'Avanzado',
    'rating.rated': 'Puntuaste {n} estrellas · ',
    'rating.clickRate': 'Haz clic en estrellas para valorar · ',
    'rating.people': 'valoraciones',
  },
  ar: {
    'action.back': 'العودة إلى قائمة سير العمل',
    'action.start': 'بدء سير العمل',
    'action.completed': 'مكتمل',
    'action.reset': 'إعادة تعيين',
    'action.inProgress': 'قيد التنفيذ',
    'action.share': 'مشاركة',
    'action.edit': 'تعديل',
    'action.add': 'إضافة خطوة',
    'action.save': 'حفظ',
    'action.saveAs': 'حفظ في سير العمل الخاص بي',
    'action.cancel': 'إلغاء',
    'action.close': 'إغلاق',
    'action.confirm': 'تأكيد',
    'action.copy': 'نسخ الرابط',
    'action.copied': 'تم النسخ',
    'action.editWorkflow': 'تعديل سير العمل',
    'action.saveAsMy': 'حفظ كسير العمل الخاص بي',
    'action.selectTool': 'اختر أداة',
    'action.searchTool': 'ابحث في الأدوات...',
    'action.noTools': 'لم يتم العثور على أدوات',
    'action.noSteps': 'لا توجد خطوات بعد، أضف أعلاه',
    'state.notFound': 'سير العمل غير موجود',
    'state.myWorkflow': 'سير العمل الخاص بي',
    'label.steps': 'خطوات',
    'label.progress': 'التقدم',
    'label.sectionSteps': 'الخطوات',
    'label.rating': 'تقييم سير العمل',
    'label.aiRecommend': 'توصية الذكاء الاصطناعي',
    'label.aiRecommendDesc': 'لست متأكداً من الأدوات؟ دع الذكاء الاصطناعي يوصي بناءً على احتياجاتك.',
    'label.homepage': 'الصفحة الرئيسية',
    'label.shareTitle': 'مشاركة سير العمل',
    'label.aiWorkflow': 'سير عمل ذكاء اصطناعي',
    'label.scanQr': 'امسح لعرض سير العمل',
    'label.shareHint': 'يمكن للمستلمين الحفظ في سير العمل الخاص بهم',
    'label.workflowName': 'اسم سير العمل',
    'label.workflowNamePh': 'أدخل اسم سير العمل',
    'label.description': 'الوصف',
    'label.descriptionPh': 'وصف موجز',
    'label.stepList': 'الخطوات',
    'label.completeTitle': '🎉 رائع!',
    'label.completeDesc': 'لقد أكملت سير العمل "{title}"!',
    'label.completeDescEn': 'You completed "{title}" workflow!',
    'stats.steps': 'خطوات',
    'stats.minSaved': 'دقائق موفرة',
    'stats.totalDone': 'إجمالي المكتمل',
    'achievement.title': '🏆 إنجازات مفتوحة',
    'achievement.firstWin': 'أول فوز',
    'achievement.efficiencyPro': 'محترف الكفاءة',
    'achievement.streak5': 'تتابع 5 أيام',
    'achievement.persistent': 'مثابر',
    'difficulty.easy': 'سهل',
    'difficulty.medium': 'متوسط',
    'difficulty.advanced': 'متقدم',
    'rating.rated': 'لقد قمت بتقييم {n} نجوم · ',
    'rating.clickRate': 'انقر على النجوم للتقييم · ',
    'rating.people': 'تقييمات',
  },
};

const getT = (loc: string) => {
  const dict = translations[loc] || translations.zh;
  return (key: string, vars?: Record<string, string | number>) => {
    let str = dict[key] ?? translations.zh[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };
};

interface WorkflowDetailProps {
  slug: string;
  locale: string;
  workflow?: Workflow;
  isCustom?: boolean;
  customWorkflow?: CustomWorkflow;
}

export default function WorkflowDetail({
  slug,
  locale,
  workflow: workflowProp,
  isCustom = false,
  customWorkflow,
}: WorkflowDetailProps) {
  const t = getT(locale);

  const {
    toggleLike,
    isLiked,
    toggleFavorite,
    isFavorite,
    setWorkflowRating,
    getWorkflowRating,
    startWorkflowProgress,
    toggleStepComplete,
    getWorkflowProgress,
    clearWorkflowProgress,
    recordWorkflowComplete,
    addCustomWorkflow,
    updateCustomWorkflow,
    workflowStats,
    toggleWorkflowFavorite,
    isWorkflowFavorite,
  } = usePreferencesStore();

  const [hoverRating, setHoverRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [editSteps, setEditSteps] = useState<CustomWorkflowStep[]>([]);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [adMounted, setAdMounted] = useState(false);

  const [resolvedWorkflow, setResolvedWorkflow] = useState<Workflow | undefined>(workflowProp);
  const [wfLoaded, setWfLoaded] = useState<boolean>(!!workflowProp || isCustom);

  useEffect(() => {
    setAdMounted(true);
  }, []);

  useEffect(() => {
    if (isCustom || workflowProp || wfLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/data/workflows');
        if (cancelled) return;
        const found = (mod.getWorkflowBySlug || (() => undefined))(slug);
        if (found && !cancelled) setResolvedWorkflow(found as Workflow);
      } catch (e) {
        // 静默
      } finally {
        if (!cancelled) setWfLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, isCustom, workflowProp, wfLoaded]);

  const currentWorkflow = useMemo(() => {
    if (isCustom) return customWorkflow;
    return resolvedWorkflow ? translateWorkflow(resolvedWorkflow, locale as Locale) : undefined;
  }, [isCustom, customWorkflow, resolvedWorkflow, locale]);
  const workflowId = currentWorkflow?.id || '';
  const showKofi = useMemo(() => locale === 'zh' || locale === 'en' || true, [locale]);
  const userRating = getWorkflowRating(workflowId);
  const progress = getWorkflowProgress(workflowId);
  const totalSteps = currentWorkflow?.steps.length || 0;
  const completedCount = progress?.completedSteps.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isCompleted = progress?.completedAt ? true : completedCount === totalSteps && totalSteps > 0;
  const isStarted = !!progress;

  const avgRating = 4.5;
  const ratingCount = 128;

  const Icon = currentWorkflow?.icon ? (iconMap[currentWorkflow.icon] || Zap) : Zap;

  useEffect(() => {
    if (isCompleted && !progress?.completedAt && currentWorkflow) {
      recordWorkflowComplete(workflowId, totalSteps);
      setShowCompleteModal(true);
    }
  }, [isCompleted]);

  const handleStart = () => {
    startWorkflowProgress(workflowId, isCustom ? 'custom' : 'official', totalSteps);
  };

  const handleReset = () => {
    clearWorkflowProgress(workflowId);
    setShowCompleteModal(false);
  };

  const handleStepToggle = (index: number) => {
    if (!isStarted) {
      handleStart();
    }
    toggleStepComplete(workflowId, index);
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const generateShareUrl = () => {
    if (!currentWorkflow) return '';
    const data = {
      t: currentWorkflow.title,
      d: currentWorkflow.description,
      s: currentWorkflow.steps,
      i: currentWorkflow.icon || 'Zap',
      c: currentWorkflow.category || 'content-creator',
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return `${window.location.origin}/${locale}/workflow/share?d=${encoded}`;
  };

  const handleCopyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openEditModal = () => {
    if (!currentWorkflow) return;
    setEditTitle(currentWorkflow.title);
    setEditDescription(currentWorkflow.description || '');
    setEditSteps([...currentWorkflow.steps]);
    setShowEditModal(true);
  };

  const handleSaveAsCustom = () => {
    if (!currentWorkflow) return;
    const newWorkflow = {
      title: editTitle || currentWorkflow.title,
      description: editDescription || currentWorkflow.description,
      steps: editSteps,
      icon: currentWorkflow.icon || 'Zap',
      category: currentWorkflow.category || 'content-creator',
      tags: (currentWorkflow as any).tags || [],
      estimatedTime: (currentWorkflow as any).estimatedTime || '10分钟',
      difficulty: ((currentWorkflow as any).difficulty as 'easy' | 'medium' | 'advanced') || 'easy',
    };
    addCustomWorkflow(newWorkflow);
    setShowEditModal(false);
  };

  const handleUpdateCustom = () => {
    if (!customWorkflow) return;
    updateCustomWorkflow(customWorkflow.id, {
      title: editTitle,
      description: editDescription,
      steps: editSteps,
    });
    setShowEditModal(false);
  };

  const addStep = (toolSlug: string) => {
    const tool = getToolBySlug(toolSlug);
    if (!tool) return;
    setEditSteps([
      ...editSteps,
      {
        toolSlug,
        title: tool.name,
        description: tool.description.slice(0, 50),
      },
    ]);
    setShowToolPicker(false);
    setToolSearchQuery('');
  };

  const removeStep = (index: number) => {
    setEditSteps(editSteps.filter((_, i) => i !== index));
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editSteps.length) return;
    const newSteps = [...editSteps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    setEditSteps(newSteps);
  };

  const filteredTools = tools
    .filter(t =>
      t.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(toolSearchQuery.toLowerCase()))
    )
    .slice(0, 20);

  if (!currentWorkflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='text-center py-12'>
          <p className='text-gray-500 dark:text-gray-400'>
            {t('state.notFound')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='workflows' />

        <div className='flex-1 min-w-0'>
          <a
            href={`/${locale}/workflows`}
            className='inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors'
          >
            <ChevronLeft className='w-4 h-4' />
            {t('action.back')}
          </a>

          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 lg:p-8 mb-6'>
            <div className='flex items-start justify-between mb-4 sm:mb-6'>
              <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
                <div className='p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-600 dark:text-primary-400 flex-shrink-0'>
                  <Icon className='w-6 h-6 sm:w-8 sm:h-8' />
                </div>
                <div className='min-w-0'>
                  <h1 className='text-lg sm:text-xl lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 truncate'>
                    {currentWorkflow.title}
                  </h1>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2'>
                    {currentWorkflow.description}
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1 flex-shrink-0 ml-3'>
                <div className='flex items-center gap-1'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWorkflowFavorite(workflowId);
                      logFavorite(workflowId);
                    }}
                    className={`p-1.5 rounded-lg transition-all hover:scale-105 ${
                      isWorkflowFavorite(workflowId)
                        ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30'
                        : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-orange-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isWorkflowFavorite(workflowId) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(workflowId);
                      logLike(workflowId);
                    }}
                    className={`p-1.5 rounded-lg transition-all hover:scale-105 ${
                      isLiked(workflowId)
                        ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
                        : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked(workflowId) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className='p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:text-primary-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-primary-400 transition-all hover:scale-105'
                  >
                    <Share2 className='w-4 h-4' />
                  </button>
                  <button
                    onClick={openEditModal}
                    className='p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:text-primary-500 dark:bg-gray-700 dark:text-gray-500 dark:hover:text-primary-400 transition-all hover:scale-105'
                  >
                    <Edit3 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-2 mb-4'>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyStyle(currentWorkflow.difficulty || 'easy')}`}>
                {t(`difficulty.${currentWorkflow.difficulty || 'easy'}`)}
              </div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                <Clock className='w-3.5 h-3.5' />
                {(currentWorkflow as any).estimatedTime || '10分钟'}
              </div>
              <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
                <Play className='w-3.5 h-3.5' />
                {totalSteps} {t('label.steps')}
              </div>
              {isCustom && (
                <div className='flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'>
                  {t('state.myWorkflow')}
                </div>
              )}
            </div>

            {isStarted && (
              <div className='mb-2'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {t('label.progress')}
                  </span>
                  <span className='text-sm font-bold text-primary-600 dark:text-primary-400'>
                    {completedCount}/{totalSteps} ({progressPercent}%)
                  </span>
                </div>
                <div className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500'
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className='flex gap-2 mt-4'>
              {!isStarted ? (
                <button
                  onClick={handleStart}
                  className='flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2'
                >
                  <Play className='w-4 h-4 sm:w-5 sm:h-5' />
                  {t('action.start')}
                </button>
              ) : isCompleted ? (
                <>
                  <div className='flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-green-500 text-white rounded-xl flex items-center justify-center gap-2'>
                    <Check className='w-4 h-4 sm:w-5 sm:h-5' />
                    {t('action.completed')}
                  </div>
                  <button
                    onClick={handleReset}
                    className='px-4 py-2.5 sm:py-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98] flex items-center gap-2'
                  >
                    <RotateCcw className='w-4 h-4' />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleReset}
                    className='px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98] flex items-center gap-2'
                  >
                    <RotateCcw className='w-4 h-4' />
                    <span className='hidden sm:inline'>{t('action.reset')}</span>
                  </button>
                  <div className='flex-1 py-2.5 text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center gap-2'>
                    {t('action.inProgress')}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
              <span className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-bold'>
                {totalSteps}
              </span>
              {t('label.sectionSteps')}
            </h2>

            {currentWorkflow.steps.map((step: CustomWorkflowStep, index: number) => {
              const tool = getToolBySlug(step.toolSlug);
              const isLast = index === currentWorkflow.steps.length - 1;
              const isStepCompleted = progress?.completedSteps.includes(index);

              return (
                <Fragment key={index}>
                  <div className='relative'>
                    <div className={`bg-white dark:bg-gray-800 rounded-xl border p-4 sm:p-5 transition-all ${
                      isStepCompleted
                        ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md'
                    }`}>
                      <div className='flex items-start gap-3 sm:gap-4'>
                        <div className='flex flex-col items-center flex-shrink-0'>
                          <button
                            onClick={() => handleStepToggle(index)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
                              isStepCompleted
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25'
                                : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/25 hover:scale-105'
                            }`}
                          >
                            {isStepCompleted ? <Check className='w-4 h-4 sm:w-5 sm:h-5' /> : index + 1}
                          </button>
                          {!isLast && (
                            <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${isStepCompleted ? 'bg-green-300 dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ minHeight: '20px' }} />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-1'>
                            <h3 className={`font-semibold text-sm sm:text-base ${isStepCompleted ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                              {step.title}
                            </h3>
                          </div>
                          <p className={`text-sm mb-3 ${isStepCompleted ? 'text-[#34A89C]' : 'text-gray-600 dark:text-gray-400'}`}>
                            {step.description}
                          </p>
                          {(() => {
                            const resolved = resolveToolLink(step.toolSlug, locale);
                            const link = tool?.externalUrl
                              ? { type: 'external' as const, url: tool.externalUrl, label: tool.name }
                              : tool && tool.slug
                                ? { type: 'internal' as const, url: `/${locale}/tool/${tool.slug}`, label: tool.name }
                                : { type: resolved.type, url: resolved.url, label: getToolDisplayLabel(step.toolSlug) || (tool?.name ?? (resolved.displayName || String(step.toolSlug || '').toUpperCase())) };
                            const isExt = link.type === 'external';
                            return (
                              <a
                                href={link.url}
                                target={isExt ? '_blank' : '_self'}
                                rel={isExt ? 'noopener noreferrer' : ''}
                                onClick={() => {
                                  if (!isStepCompleted && isStarted) {
                                    handleStepToggle(index);
                                  }
                                }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors group ${
                                  isExt
                                    ? 'bg-[#E8F4F2] dark:bg-[#2a4a46]/30 text-[#34A89C] hover:bg-[#D7EAE7] dark:hover:bg-[#2a4a46]/50'
                                    : 'bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE] hover:bg-[#ECEEF8] dark:hover:bg-[#3a406a]/50'
                                }`}
                              >
                                {link.label}
                                {isExt && <ExternalLink className='w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform' />}
                              </a>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  {adMounted && index === 3 && !isLast && (
                    <div data-ad-slot-wrap='workflow-step4-below' className='my-1'>
                      <AdSlot
                        slot={`workflow-step4-${workflowId || 'wf'}-${locale}`}
                        size='in-feed'
                        showPlaceholder={true}
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          <div className='mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base'>
                {t('label.rating')}
              </h3>
              <div className='flex items-center gap-1.5'>
                <span className='text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400'>{avgRating}</span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>/ 5.0</span>
              </div>
            </div>
            <div className='flex items-center gap-2 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setWorkflowRating(workflowId, star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className='p-0.5 transition-transform hover:scale-110 active:scale-95'
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                      (hoverRating || userRating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {userRating > 0
                ? t('rating.rated', { n: userRating })
                : t('rating.clickRate')}
              {ratingCount} {t('rating.people')}
            </p>
          </div>

          <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-lg bg-white dark:bg-gray-800 text-purple-500 flex-shrink-0'>
                <Zap className='w-5 h-5' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base'>
                  {t('label.aiRecommend')}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                  {t('label.aiRecommendDesc')}
                </p>
              </div>
              <a
                href={`/${locale}`}
                className='inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:shadow-md transition-all group flex-shrink-0'
              >
                <span className='hidden sm:inline'>{t('label.homepage')}</span>
                <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
              </a>
            </div>
          </div>
          {showKofi && <KofiUnlockBanner slug={'workflow-'+workflowId} locale={locale} variant="top" />}
          {adMounted && (
            <div data-ad-slot-wrap='workflow-footer' className='mt-4 sm:mt-6'>
              <AdSlot
                slot={`workflow-bottom-${workflowId || 'wf'}-${locale}`}
                size='in-feed'
                showPlaceholder={true}
              />
            </div>
          )}
          {showKofi && <KofiUnlockBanner slug={'workflow-'+workflowId} locale={locale} variant="bottom" />}
        </div>
      </div>

      {showShareModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowShareModal(false)}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                {t('label.shareTitle')}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-4 overflow-y-auto'>
              <div className='bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-2xl p-5 sm:p-6 mb-5 text-white shadow-xl'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='p-2.5 bg-white/20 backdrop-blur rounded-xl'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <span className='text-xs px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium'>
                    {t('label.aiWorkflow')}
                  </span>
                </div>
                <h3 className='text-lg sm:text-xl font-bold mb-1.5 line-clamp-1'>
                  {currentWorkflow.title}
                </h3>
                <p className='text-sm text-white/80 line-clamp-2 mb-4'>
                  {currentWorkflow.description}
                </p>
                <div className='flex items-center gap-3 text-sm'>
                  <span className='flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full'>
                    <Clock className='w-3.5 h-3.5' />
                    {(currentWorkflow as any).estimatedTime || '10分钟'}
                  </span>
                  <span className='flex items-center gap-1 bg-white/15 backdrop-blur px-2.5 py-1 rounded-full'>
                    <Play className='w-3.5 h-3.5' />
                    {currentWorkflow.steps.length} {t('label.steps')}
                  </span>
                </div>
              </div>

              <div className='flex flex-col items-center py-2'>
                <div className='w-40 h-40 bg-white rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 mb-4'>
                  <QrCode className='w-32 h-32 text-gray-800' />
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-4'>
                  {t('label.scanQr')}
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={handleCopyLink}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                  {copied ? t('action.copied') : t('action.copy')}
                </button>
              </div>
              <p className='text-xs text-gray-400 dark:text-gray-500 text-center mt-4'>
                {t('label.shareHint')}
              </p>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowEditModal(false)}>
          <div
            className='w-full sm:max-w-2xl bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                {isCustom ? t('action.editWorkflow') : t('action.saveAsMy')}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-4 overflow-y-auto flex-1'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    {t('label.workflowName')}
                  </label>
                  <input
                    type='text'
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                    placeholder={t('label.workflowNamePh')}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    {t('label.description')}
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                    placeholder={t('label.descriptionPh')}
                  />
                </div>
                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {t('label.stepList')}
                    </label>
                    <button
                      onClick={() => setShowToolPicker(true)}
                      className='text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1'
                    >
                      <Plus className='w-3.5 h-3.5' />
                      {t('action.add')}
                    </button>
                  </div>
                  <div className='space-y-2'>
                    {editSteps.map((step, index) => {
                      const tool = getToolBySlug(step.toolSlug);
                      return (
                        <div key={index} className='flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
                          <div className='flex flex-col items-center gap-0.5 flex-shrink-0 pt-1'>
                            <button
                              onClick={() => moveStep(index, index - 1)}
                              disabled={index === 0}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors'
                            >
                              <ChevronLeft className='w-3 h-3 rotate-90' />
                            </button>
                            <div className='w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center'>
                              {index + 1}
                            </div>
                            <button
                              onClick={() => moveStep(index, index + 1)}
                              disabled={index === editSteps.length - 1}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors'
                            >
                              <ChevronLeft className='w-3 h-3 -rotate-90' />
                            </button>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <input
                              type='text'
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [...editSteps];
                                newSteps[index].title = e.target.value;
                                setEditSteps(newSteps);
                              }}
                              className='w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none mb-1'
                            />
                            <input
                              type='text'
                              value={step.description}
                              onChange={(e) => {
                                const newSteps = [...editSteps];
                                newSteps[index].description = e.target.value;
                                setEditSteps(newSteps);
                              }}
                              className='w-full bg-transparent text-xs text-gray-500 dark:text-gray-400 focus:outline-none'
                            />
                            {tool && (
                              <p className='text-xs text-primary-600 dark:text-primary-400 mt-1'>
                                {tool.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeStep(index)}
                            className='p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      );
                    })}
                    {editSteps.length === 0 && (
                      <div className='text-center py-8 text-gray-400 dark:text-gray-500 text-sm'>
                        {t('action.noSteps')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2'>
              <button
                onClick={() => setShowEditModal(false)}
                className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98]'
              >
                {t('action.cancel')}
              </button>
              <button
                onClick={isCustom ? handleUpdateCustom : handleSaveAsCustom}
                disabled={editSteps.length === 0 || !editTitle.trim()}
                className='flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2'
              >
                <Save className='w-4 h-4' />
                {isCustom ? t('action.save') : t('action.saveAs')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToolPicker && (
        <div className='fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowToolPicker(false)}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2 mb-3'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex-1'>
                  {t('action.selectTool')}
                </h3>
                <button
                  onClick={() => setShowToolPicker(false)}
                  className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              <input
                type='text'
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                placeholder={t('action.searchTool')}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                autoFocus
              />
            </div>
            <div className='overflow-y-auto flex-1'>
              {filteredTools.length > 0 ? (
                <div className='p-2'>
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => addStep(tool.slug)}
                      className='w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3'
                    >
                      <div className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0'>
                        <Code className='w-4 h-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                          {tool.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {tool.tags.slice(0, 2).join(' · ')}
                        </p>
                      </div>
                      <Plus className='w-4 h-4 text-gray-400 flex-shrink-0' />
                    </button>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12 text-gray-400 dark:text-gray-500 text-sm'>
                  {t('action.noTools')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center'>
            <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-bounce'>
              <Trophy className='w-10 h-10 text-white' />
            </div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
              {t('label.completeTitle')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              {t('label.completeDesc', { title: currentWorkflow.title })}
            </p>
            <div className='grid grid-cols-3 gap-3 mb-6'>
              <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <p className='text-xl font-bold text-primary-600 dark:text-primary-400'>{totalSteps}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{t('stats.steps')}</p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <p className='text-xl font-bold text-green-600 dark:text-green-400'>{Math.round(totalSteps * 5)}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{t('stats.minSaved')}</p>
              </div>
              <div className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3'>
                <p className='text-xl font-bold text-purple-600 dark:text-purple-400'>{workflowStats.totalCompleted}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{t('stats.totalDone')}</p>
              </div>
            </div>

            <div className='bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6'>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-3'>
                {t('achievement.title')}
              </p>
              <div className='flex gap-3 justify-center flex-wrap'>
                <div className='flex flex-col items-center'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg'>
                    🎯
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                    {t('achievement.firstWin')}
                  </p>
                </div>
                {totalSteps >= 3 && (
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shadow-lg'>
                      ⚡
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                      {t('achievement.efficiencyPro')}
                    </p>
                  </div>
                )}
                {workflowStats.totalCompleted >= 5 && (
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-xl shadow-lg'>
                      🔥
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                      {t('achievement.streak5')}
                    </p>
                  </div>
                )}
                {workflowStats.streakDays >= 3 && (
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-xl shadow-lg'>
                      🌟
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                      {t('achievement.persistent')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setShowCompleteModal(false)}
                className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98]'
              >
                {t('action.close')}
              </button>
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  setShowShareModal(true);
                }}
                className='flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2'
              >
                <Share2 className='w-4 h-4' />
                {t('action.share')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
