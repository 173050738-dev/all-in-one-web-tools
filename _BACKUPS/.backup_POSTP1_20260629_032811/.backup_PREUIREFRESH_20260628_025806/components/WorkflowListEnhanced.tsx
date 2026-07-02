'use client';
import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';
import { workflows } from '@/data/workflows';
import WorkflowCreator from './WorkflowCreator';
import WorkflowCreatorCanvas from './workflow/WorkflowCreatorCanvas';

const translations: Record<string, Record<string, string>> = {
  zh: {
    'action.back': '返回首页',
    'action.canvas': '画布新建',
    'action.listMode': '列表模式',
    'action.list': '列表',
    'action.continue': '继续',
    'action.createFirst': '创建第一个工作流（画布）',
    'action.add': '新建',
    'title': 'AI 工作流广场',
    'subtitle': '精选高效工作流，一键启动，步骤追踪，效率翻倍',
    'stats.total': '可用工作流',
    'stats.inProgress': '进行中',
    'stats.completed': '已完成',
    'stats.streak': '连续天数',
    'section.continue': '继续未完成',
    'section.recommended': '热门推荐',
    'tab.all': '全部',
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
    'placeholder.search': '搜索工作流...',
    'empty.mine': '还没有创建工作流',
    'empty.favorites': '还没有收藏的工作流',
    'empty.completed': '还没有完成的工作流',
    'empty.inProgress': '暂无进行中的工作流',
    'empty.all': '没有找到匹配的工作流',
  },
  en: {
    'action.back': 'Back',
    'action.canvas': 'Canvas Editor',
    'action.listMode': 'List Mode',
    'action.list': 'List',
    'action.continue': 'Continue',
    'action.createFirst': 'Create Your First Workflow (Canvas)',
    'action.add': 'New',
    'title': 'AI Workflow Hub',
    'subtitle': 'Curated workflows with step tracking to boost productivity',
    'stats.total': 'Total Workflows',
    'stats.inProgress': 'In Progress',
    'stats.completed': 'Completed',
    'stats.streak': 'Day Streak',
    'section.continue': 'Continue Where You Left Off',
    'section.recommended': 'Recommended for You',
    'tab.all': 'All',
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
    'placeholder.search': 'Search workflows...',
    'empty.mine': "You haven't created any workflow yet",
    'empty.favorites': 'No favorite workflows yet',
    'empty.completed': 'No completed workflows yet',
    'empty.inProgress': 'No workflows in progress',
    'empty.all': 'No matching workflows found',
  },
  hi: {
    'action.back': 'वापस',
    'action.canvas': 'कैनवास संपादक',
    'action.listMode': 'सूची मोड',
    'action.list': 'सूची',
    'action.continue': 'जारी रखें',
    'action.createFirst': 'अपना पहला वर्कफ़्लो बनाएं (कैनवास)',
    'action.add': 'नया',
    'title': 'AI वर्कफ़्लो हब',
    'subtitle': 'उत्पादकता बढ़ाने के लिए चरण ट्रैकिंग के साथ क्यूरेटेड वर्कफ़्लो',
    'stats.total': 'कुल वर्कफ़्लो',
    'stats.inProgress': 'प्रगति पर',
    'stats.completed': 'पूर्ण',
    'stats.streak': 'दिन का स्ट्रीक',
    'section.continue': 'जहाँ छोड़ा था वहाँ से जारी रखें',
    'section.recommended': 'आपके लिए अनुशंसित',
    'tab.all': 'सभी',
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
    'placeholder.search': 'वर्कफ़्लो खोजें...',
    'empty.mine': 'आपने अभी कोई वर्कफ़्लो नहीं बनाया है',
    'empty.favorites': 'अभी कोई पसंदीदा वर्कफ़्लो नहीं',
    'empty.completed': 'अभी कोई पूर्ण वर्कफ़्लो नहीं',
    'empty.inProgress': 'प्रगति पर कोई वर्कफ़्लो नहीं',
    'empty.all': 'कोई मेल खाने वाला वर्कफ़्लो नहीं मिला',
  },
  fr: {
    'action.back': 'Retour',
    'action.canvas': 'Éditeur Canevas',
    'action.listMode': 'Mode Liste',
    'action.list': 'Liste',
    'action.continue': 'Continuer',
    'action.createFirst': 'Créez votre Premier Workflow (Canevas)',
    'action.add': 'Nouveau',
    'title': 'Hub Workflows IA',
    'subtitle': 'Workflows organisés avec suivi des étapes pour améliorer la productivité',
    'stats.total': 'Total Workflows',
    'stats.inProgress': 'En Cours',
    'stats.completed': 'Terminés',
    'stats.streak': 'Série de Jours',
    'section.continue': 'Reprendre là où vous en étiez',
    'section.recommended': 'Recommandé pour Vous',
    'tab.all': 'Tous',
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
    'label.mine': 'Moi',
    'placeholder.search': 'Rechercher workflows...',
    'empty.mine': "Vous n'avez pas encore créé de workflow",
    'empty.favorites': 'Aucun workflow favori pour le moment',
    'empty.completed': 'Aucun workflow terminé pour le moment',
    'empty.inProgress': 'Aucun workflow en cours',
    'empty.all': 'Aucun workflow correspondant trouvé',
  },
  es: {
    'action.back': 'Volver',
    'action.canvas': 'Editor de Lienzo',
    'action.listMode': 'Modo Lista',
    'action.list': 'Lista',
    'action.continue': 'Continuar',
    'action.createFirst': 'Crea tu Primer Flujo (Lienzo)',
    'action.add': 'Nuevo',
    'title': 'Centro de Flujos IA',
    'subtitle': 'Flujos seleccionados con seguimiento de pasos para aumentar la productividad',
    'stats.total': 'Total Flujos',
    'stats.inProgress': 'En Progreso',
    'stats.completed': 'Completados',
    'stats.streak': 'Racha de Días',
    'section.continue': 'Continuar donde lo dejaste',
    'section.recommended': 'Recomendado para Ti',
    'tab.all': 'Todos',
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
    'placeholder.search': 'Buscar flujos...',
    'empty.mine': 'Todavía no has creado ningún flujo',
    'empty.favorites': 'Aún no hay flujos favoritos',
    'empty.completed': 'Aún no hay flujos completados',
    'empty.inProgress': 'No hay flujos en progreso',
    'empty.all': 'No se encontraron flujos coincidentes',
  },
  ar: {
    'action.back': 'رجوع',
    'action.canvas': 'محرر اللوحة',
    'action.listMode': 'وضع القائمة',
    'action.list': 'قائمة',
    'action.continue': 'متابعة',
    'action.createFirst': 'أنشئ أول سير عمل (لوحة)',
    'action.add': 'جديد',
    'title': 'مركز سير العمل بالذكاء الاصطناعي',
    'subtitle': 'سير عمل مختارة مع تتبع الخطوات لزيادة الإنتاجية',
    'stats.total': 'إجمالي سير العمل',
    'stats.inProgress': 'قيد التنفيذ',
    'stats.completed': 'مكتمل',
    'stats.streak': 'أيام متتالية',
    'section.continue': 'تابع من حيث توقفت',
    'section.recommended': 'موصى به لك',
    'tab.all': 'الكل',
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
    'placeholder.search': 'ابحث في سير العمل...',
    'empty.mine': 'لم تقم بإنشاء أي سير عمل بعد',
    'empty.favorites': 'لا توجد سير عمل مفضلة بعد',
    'empty.completed': 'لا توجد سير عمل مكتملة بعد',
    'empty.inProgress': 'لا توجد سير عمل قيد التنفيذ',
    'empty.all': 'لم يتم العثور على سير عمل مطابق',
  },
};

const getT = (loc: string) => {
  const dict = translations[loc] || translations.zh;
  return (key: string) => dict[key] ?? translations.zh[key] ?? key;
};

type TabType = 'all' | 'official' | 'mine' | 'inprogress' | 'completed' | 'favorites';

export default function WorkflowListEnhanced({ locale }: { locale: string }) {
  const {
    customWorkflows,
    workflowProgress,
    favoriteWorkflows,
    workflowStats,
    toggleWorkflowFavorite,
  } = usePreferencesStore();
  const t = getT(locale);

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [showCreatorCanvas, setShowCreatorCanvas] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex-1 min-w-0'>
        <div className='animate-pulse space-y-4'>
          <div className='h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-xl' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const officialWorkflows = workflows;

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

    if (activeTab === 'all' || activeTab === 'official' || activeTab === 'favorites' || activeTab === 'inprogress' || activeTab === 'completed') {
      officialWorkflows.forEach(w => {
        all.push({
          ...w,
          slug: w.slug,
          isCustom: false,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'mine' || activeTab === 'favorites' || activeTab === 'inprogress' || activeTab === 'completed') {
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

  const filterByTab = (list: any[]) => {
    switch (activeTab) {
      case 'mine':
        return list.filter(w => w.isCustom);
      case 'official':
        return list.filter(w => !w.isCustom);
      case 'inprogress':
        return list.filter(w => inProgressIds.includes(w.id));
      case 'completed':
        return list.filter(w => completedIds.includes(w.id));
      case 'favorites':
        return list.filter(w => isFavorite(w.id));
      default:
        return list;
    }
  };

  const filterBySearch = (list: any[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(w =>
      w.title.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.tags.some((tt: string) => tt.toLowerCase().includes(q))
    );
  };

  const displayedWorkflows = filterBySearch(filterByTab(getAllWorkflows()));

  const getProgressInfo = (id: string) => {
    const progress = workflowProgress[id];
    if (!progress) return null;
    const total = progress.totalSteps || 0;
    const completed = progress.completedSteps.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent, isComplete: !!progress.completedAt };
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

  const iconMap: Record<string, any> = {
    Presentation: Sparkles,
    Image: Sparkles,
    FileText: Sparkles,
    Code: Sparkles,
    Share2: Sparkles,
    GraduationCap: Sparkles,
    Video: Sparkles,
    Zap,
    Palette: Sparkles,
    Globe: Sparkles,
    TrendingUp,
    Mail: Sparkles,
    Headphones: Sparkles,
    ShoppingCart: Sparkles,
    Calendar: Sparkles,
  };

  const tabs: { key: TabType; labelKey: string; icon: any }[] = [
    { key: 'all', labelKey: 'tab.all', icon: ListTodo },
    { key: 'inprogress', labelKey: 'tab.inProgress', icon: Clock3 },
    { key: 'completed', labelKey: 'tab.completed', icon: CheckCircle2 },
    { key: 'mine', labelKey: 'tab.mine', icon: FolderPlus },
    { key: 'favorites', labelKey: 'tab.favorites', icon: Star },
  ];

  return (
    <div className='flex-1 min-w-0'>
      <div className='flex items-center gap-4 mb-4'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'>
          <ArrowLeft className='h-5 w-5' />
          <span className='text-sm font-medium'>{t('action.back')}</span>
        </a>
      </div>

      <div className='flex items-center justify-between mb-4 sm:mb-6 gap-3 flex-wrap'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2'>
            <Sparkles className='w-7 h-7 sm:w-8 sm:h-8 text-primary-500' />
            {t('title')}
          </h1>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            {t('subtitle')}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowCreatorCanvas(true)}
            className='inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all'
          >
            <Layers className='w-5 h-5' />
            {t('action.canvas')}
          </button>
          <button
            onClick={() => setShowCreator(true)}
            className='inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-xs sm:text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-colors'
            title={t('action.listMode')}
          >
            <List className='w-4 h-4' />
            <span className='hidden sm:inline'>{t('action.list')}</span>
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6'>
        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center'>
              <ListTodo className='w-4 h-4 text-primary-600 dark:text-primary-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {officialWorkflows.length + customWorkflows.length}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t('stats.total')}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center'>
              <Clock3 className='w-4 h-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {inProgressIds.length}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t('stats.inProgress')}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center'>
              <CheckCircle2 className='w-4 h-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {workflowStats.totalCompleted}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t('stats.completed')}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center'>
              <Flame className='w-4 h-4 text-orange-600 dark:text-orange-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {workflowStats.streakDays}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t('stats.streak')}
          </p>
        </div>
      </div>

      {inProgressIds.length > 0 && (
        <div className='mb-5 sm:mb-6'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
            <Clock3 className='w-5 h-5 text-blue-500' />
            {t('section.continue')}
          </h2>
          <div className='flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
            {getAllWorkflows()
              .filter(w => inProgressIds.includes(w.id))
              .slice(0, 5)
              .map((workflow) => {
                const Icon = iconMap[workflow.icon] || Zap;
                const progress = getProgressInfo(workflow.id);
                const detailUrl = workflow.isCustom
                  ? `/${locale}/workflow/custom/${workflow.id}`
                  : `/${locale}/workflow/${workflow.slug}`;
                return (
                  <a
                    key={workflow.id}
                    href={detailUrl}
                    className='flex-shrink-0 w-64 sm:w-72 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group'
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='p-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'>
                        <Icon className='w-5 h-5' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                          {workflow.title}
                        </h3>
                      </div>
                    </div>
                    <div className='mb-2'>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-gray-600 dark:text-gray-400'>
                          {t('label.progress')}
                        </span>
                        <span className='font-medium text-blue-600 dark:text-blue-400'>
                          {progress?.percent || 0}%
                        </span>
                      </div>
                      <div className='h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all'
                          style={{ width: `${progress?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className='flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium'>
                      {t('action.continue')}
                      <ChevronRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
                    </div>
                  </a>
                );
              })}
          </div>
        </div>
      )}

      {workflowStats.totalCompleted === 0 && activeTab === 'all' && !searchQuery && (
        <div className='mb-5 sm:mb-6'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-yellow-500' />
            {t('section.recommended')}
          </h2>
          <div className='flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide'>
            {officialWorkflows.slice(0, 4).map((workflow) => {
              const Icon = iconMap[workflow.icon] || Zap;
              return (
                <a
                  key={workflow.id}
                  href={`/${locale}/workflow/${workflow.slug}`}
                  className='flex-shrink-0 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all group'
                >
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='p-2 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-600 dark:text-primary-400'>
                      <Icon className='w-5 h-5' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1'>
                      {workflow.title}
                    </h3>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2'>
                    {workflow.description}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-gray-400'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {workflow.estimatedTime}
                    </span>
                    <span className='flex items-center gap-1'>
                      <ListTodo className='w-3 h-3' />
                      {workflow.steps.length} {t('label.steps')}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className='relative mb-4 sm:mb-5'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('placeholder.search')}
          className='w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
        />
      </div>

      <div className='flex gap-2 overflow-x-auto pb-1 mb-4 sm:mb-5 scrollbar-hide -mx-1 px-1'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            <tab.icon className='w-4 h-4' />
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {displayedWorkflows.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          {displayedWorkflows.map((workflow) => {
            const Icon = iconMap[workflow.icon] || Zap;
            const progress = getProgressInfo(workflow.id);
            const detailUrl = workflow.isCustom
              ? `/${locale}/workflow/custom/${workflow.id}`
              : `/${locale}/workflow/${workflow.slug}`;

            return (
              <a
                key={workflow.id}
                href={detailUrl}
                className='group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-500/5 dark:hover:shadow-primary-500/5 transition-all cursor-pointer relative overflow-hidden'
              >
                {progress && !progress.isComplete && progress.percent > 0 && (
                  <div className='absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700'>
                    <div
                      className='h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all'
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                )}

                <div className='flex items-start justify-between gap-3 mb-3'>
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div className='p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform'>
                      <Icon className='w-5 h-5 sm:w-6 sm:h-6' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-1.5 mb-0.5 flex-wrap'>
                        {workflow.isCustom && (
                          <span className='text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium'>
                            {t('label.mine')}
                          </span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getDifficultyStyle(workflow.difficulty)}`}>
                          {t(`difficulty.${workflow.difficulty}`)}
                        </span>
                      </div>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate text-sm sm:text-base'>
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
                    className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                      isFavorite(workflow.id)
                        ? 'text-yellow-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite(workflow.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]'>
                  {workflow.description}
                </p>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3.5 h-3.5' />
                      {workflow.estimatedTime}
                    </span>
                    <span className='flex items-center gap-1'>
                      <ListTodo className='w-3.5 h-3.5' />
                      {workflow.steps.length} {t('label.steps')}
                    </span>
                    {progress && !progress.isComplete && progress.percent > 0 && (
                      <span className='flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium'>
                        {progress.percent}%
                      </span>
                    )}
                    {progress?.isComplete && (
                      <span className='flex items-center gap-1 text-green-600 dark:text-green-400 font-medium'>
                        <CheckCircle2 className='w-3.5 h-3.5' />
                        {t('label.done')}
                      </span>
                    )}
                  </div>
                  <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all' />
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-12 sm:py-16'>
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
          <p className='text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base'>
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
          {activeTab === 'mine' && (
            <button
              onClick={() => setShowCreatorCanvas(true)}
              className='inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors'
            >
              <Layers className='w-4 h-4' />
              {t('action.createFirst')}
            </button>
          )}
        </div>
      )}

      {showCreator && (
        <WorkflowCreator
          locale={locale}
          onClose={() => setShowCreator(false)}
        />
      )}

      {showCreatorCanvas && (
        <WorkflowCreatorCanvas
          locale={locale}
          onClose={() => setShowCreatorCanvas(false)}
        />
      )}
    </div>
  );
}
