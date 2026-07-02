'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  ChevronRight,
  Search,
  TrendingUp,
  Star,
  Play,
  Bookmark,
  Filter,
  Layers,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  Users,
  Briefcase,
  Palette,
  Code,
  GraduationCap,
  Film,
  Megaphone,
  ArrowLeft,
} from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';
import { workflows, Workflow } from '@/data/workflows';
import { translateWorkflow } from '@/lib/workflowTranslations';
import type { Locale } from '@/lib/workflowTranslations';
import { useRouter } from 'next/navigation';

const translations: Record<string, Record<string, string>> = {
  zh: {
    'action.back': '返回首页',
    'action.browse': '浏览模板',
    'action.myWorkflows': '我的工作流',
    'action.start': '开始使用',
    'action.createNow': '立即创建',
    'banner.featured': '精选工作流模板',
    'banner.title': '一键开启高效工作流',
    'banner.subtitle': '精选 20+ 专业工作流模板，涵盖设计、开发、运营、学习等场景，帮你节省 80% 的重复工作时间',
    'banner.stat1': '20+ 精选模板',
    'banner.stat2': '即开即用',
    'banner.stat3': '完全免费',
    'placeholder.search': '搜索工作流模板...',
    'sort.popular': '最受欢迎',
    'sort.newest': '最新发布',
    'sort.easiest': '最简单',
    'category.all': '全部',
    'category.content-creator': '内容创作者',
    'category.designer': '设计师',
    'category.developer': '开发者',
    'category.office-worker': '职场办公',
    'category.student': '学生学习',
    'category.video-creator': '视频创作者',
    'section.featured': '精选推荐',
    'section.all': '全部模板',
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.advanced': '进阶',
    'state.emptyTitle': '没有找到匹配的模板',
    'state.emptyDesc': '试试其他关键词或分类',
    'cta.title': '想创建自己的工作流？',
    'cta.subtitle': '完全自定义你的工作流程，组合任意工具，打造专属效率工具',
    'label.steps': '步骤',
  },
  en: {
    'action.back': 'Back',
    'action.browse': 'Browse Templates',
    'action.myWorkflows': 'My Workflows',
    'action.start': 'Start Now',
    'action.createNow': 'Create Now',
    'banner.featured': 'Featured Workflow Templates',
    'banner.title': 'Start Efficient Workflows with One Click',
    'banner.subtitle': '20+ professional workflow templates for design, development, operations, and learning. Save 80% of your time on repetitive tasks.',
    'banner.stat1': '20+ Templates',
    'banner.stat2': 'Ready to Use',
    'banner.stat3': '100% Free',
    'placeholder.search': 'Search workflow templates...',
    'sort.popular': 'Most Popular',
    'sort.newest': 'Newest',
    'sort.easiest': 'Easiest',
    'category.all': 'All',
    'category.content-creator': 'Content Creator',
    'category.designer': 'Designer',
    'category.developer': 'Developer',
    'category.office-worker': 'Office Work',
    'category.student': 'Student',
    'category.video-creator': 'Video Creator',
    'section.featured': 'Featured',
    'section.all': 'All Templates',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.advanced': 'Advanced',
    'state.emptyTitle': 'No matching templates found',
    'state.emptyDesc': 'Try other keywords or categories',
    'cta.title': 'Want to create your own workflow?',
    'cta.subtitle': 'Fully customize your workflow, combine any tools, and build your own productivity system.',
    'label.steps': 'steps',
  },
  hi: {
    'action.back': 'वापस',
    'action.browse': 'टेम्पलेट्स ब्राउज़ करें',
    'action.myWorkflows': 'मेरे वर्कफ़्लो',
    'action.start': 'अभी शुरू करें',
    'action.createNow': 'अभी बनाएं',
    'banner.featured': 'फीचर्ड वर्कफ़्लो टेम्पलेट्स',
    'banner.title': 'एक क्लिक में कुशल वर्कफ़्लो शुरू करें',
    'banner.subtitle': 'डिज़ाइन, डेवलपमेंट, ऑपरेशन्स और सीखने के लिए 20+ प्रोफेशनल वर्कफ़्लो टेम्पलेट्स। दोहराए जाने वाले कार्यों पर अपना 80% समय बचाएं।',
    'banner.stat1': '20+ टेम्पलेट्स',
    'banner.stat2': 'तुरंत उपयोग योग्य',
    'banner.stat3': '100% निःशुल्क',
    'placeholder.search': 'वर्कफ़्लो टेम्पलेट्स खोजें...',
    'sort.popular': 'सबसे लोकप्रिय',
    'sort.newest': 'नवीनतम',
    'sort.easiest': 'सबसे आसान',
    'category.all': 'सभी',
    'category.content-creator': 'कंटेंट क्रिएटर',
    'category.designer': 'डिज़ाइनर',
    'category.developer': 'डेवलपर',
    'category.office-worker': 'ऑफिस कार्य',
    'category.student': 'छात्र',
    'category.video-creator': 'वीडियो क्रिएटर',
    'section.featured': 'विशेष रूप से चुना गया',
    'section.all': 'सभी टेम्पलेट्स',
    'difficulty.easy': 'आसान',
    'difficulty.medium': 'मध्यम',
    'difficulty.advanced': 'उन्नत',
    'state.emptyTitle': 'कोई मेल खाने वाला टेम्पलेट नहीं मिला',
    'state.emptyDesc': 'अन्य कीवर्ड या श्रेणियाँ आज़माएं',
    'cta.title': 'अपना खुद का वर्कफ़्लो बनाना चाहते हैं?',
    'cta.subtitle': 'अपने वर्कफ़्लो को पूरी तरह से कस्टमाइज़ करें, किसी भी टूल को जोड़ें।',
    'label.steps': 'चरण',
  },
  fr: {
    'action.back': 'Retour',
    'action.browse': 'Parcourir les Modèles',
    'action.myWorkflows': 'Mes Workflows',
    'action.start': 'Commencer',
    'action.createNow': 'Créer Maintenant',
    'banner.featured': 'Modèles de Workflow en Vedette',
    'banner.title': 'Démarrez des Workflows Efficaces en un Clic',
    'banner.subtitle': '20+ modèles de workflow professionnels pour le design, le développement, les opérations et l\'apprentissage. Gagnez 80% de temps sur les tâches répétitives.',
    'banner.stat1': '20+ Modèles',
    'banner.stat2': 'Prêt à l\'Emploi',
    'banner.stat3': '100% Gratuit',
    'placeholder.search': 'Rechercher des modèles de workflow...',
    'sort.popular': 'Plus Populaires',
    'sort.newest': 'Plus Récents',
    'sort.easiest': 'Plus Simples',
    'category.all': 'Tous',
    'category.content-creator': 'Créateur de Contenu',
    'category.designer': 'Designer',
    'category.developer': 'Développeur',
    'category.office-worker': 'Travail de Bureau',
    'category.student': 'Étudiant',
    'category.video-creator': 'Créateur Vidéo',
    'section.featured': 'En Vedette',
    'section.all': 'Tous les Modèles',
    'difficulty.easy': 'Facile',
    'difficulty.medium': 'Moyen',
    'difficulty.advanced': 'Avancé',
    'state.emptyTitle': 'Aucun modèle correspondant',
    'state.emptyDesc': 'Essayez d\'autres mots-clés ou catégories',
    'cta.title': 'Vous voulez créer votre propre workflow?',
    'cta.subtitle': 'Personnalisez entièrement votre workflow, combinez n\'importe quels outils.',
    'label.steps': 'étapes',
  },
  es: {
    'action.back': 'Volver',
    'action.browse': 'Ver Plantillas',
    'action.myWorkflows': 'Mis Flujos',
    'action.start': 'Empezar Ahora',
    'action.createNow': 'Crear Ahora',
    'banner.featured': 'Plantillas de Flujo Destacadas',
    'banner.title': 'Inicia Flujos Eficaces con un Clic',
    'banner.subtitle': '20+ plantillas de flujo profesionales para diseño, desarrollo, operaciones y aprendizaje. Ahorra 80% del tiempo en tareas repetitivas.',
    'banner.stat1': '20+ Plantillas',
    'banner.stat2': 'Listas para Usar',
    'banner.stat3': '100% Gratis',
    'placeholder.search': 'Buscar plantillas de flujo...',
    'sort.popular': 'Más Populares',
    'sort.newest': 'Más Recientes',
    'sort.easiest': 'Más Fáciles',
    'category.all': 'Todos',
    'category.content-creator': 'Creador de Contenido',
    'category.designer': 'Diseñador',
    'category.developer': 'Desarrollador',
    'category.office-worker': 'Trabajo de Oficina',
    'category.student': 'Estudiante',
    'category.video-creator': 'Creador de Video',
    'section.featured': 'Destacados',
    'section.all': 'Todas las Plantillas',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Medio',
    'difficulty.advanced': 'Avanzado',
    'state.emptyTitle': 'No se encontraron plantillas coincidentes',
    'state.emptyDesc': 'Prueba otras palabras clave o categorías',
    'cta.title': '¿Quieres crear tu propio flujo?',
    'cta.subtitle': 'Personaliza completamente tu flujo, combina cualquier herramienta.',
    'label.steps': 'pasos',
  },
  ar: {
    'action.back': 'رجوع',
    'action.browse': 'تصفح القوالب',
    'action.myWorkflows': 'تدفقات العمل الخاصة بي',
    'action.start': 'ابدأ الآن',
    'action.createNow': 'أنشئ الآن',
    'banner.featured': 'قوالب سير العمل المميزة',
    'banner.title': 'ابدأ سير عمل فعال بنقرة واحدة',
    'banner.subtitle': 'أكثر من 20 قالب سير عمل احترافي للتصميم والتطوير والعمليات والتعلم. وفر 80% من وقتك في المهام المتكررة.',
    'banner.stat1': 'أكثر من 20 قالباً',
    'banner.stat2': 'جاهز للاستخدام',
    'banner.stat3': 'مجاني تماماً',
    'placeholder.search': 'ابحث في قوالب سير العمل...',
    'sort.popular': 'الأكثر شيوعاً',
    'sort.newest': 'الأحدث',
    'sort.easiest': 'الأسهل',
    'category.all': 'الكل',
    'category.content-creator': 'منشئ المحتوى',
    'category.designer': 'المصمم',
    'category.developer': 'المطور',
    'category.office-worker': 'عمل المكتب',
    'category.student': 'الطالب',
    'category.video-creator': 'منشئ الفيديو',
    'section.featured': 'مميز',
    'section.all': 'جميع القوالب',
    'difficulty.easy': 'سهل',
    'difficulty.medium': 'متوسط',
    'difficulty.advanced': 'متقدم',
    'state.emptyTitle': 'لم يتم العثور على قوالب مطابقة',
    'state.emptyDesc': 'جرب كلمات مفتاحية أو فئات أخرى',
    'cta.title': 'هل تريد إنشاء سير عمل خاص بك؟',
    'cta.subtitle': 'خصص سير عملك بالكامل، واجمع أي أدوات.',
    'label.steps': 'خطوات',
  },
};

const categoryInfo: Record<string, { icon: any; color: string }> = {
  'content-creator': { icon: Megaphone, color: 'bg-[#5461A8]' },
  'designer': { icon: Palette, color: 'bg-[#5461A8]' },
  'developer': { icon: Code, color: 'bg-[#34A89C]' },
  'office-worker': { icon: Briefcase, color: 'bg-[#5461A8]' },
  'student': { icon: GraduationCap, color: 'bg-[#5461A8]' },
  'video-creator': { icon: Film, color: 'bg-[#34A89C]' },
};

const difficultyColor: Record<string, string> = {
  easy: 'bg-[#E8F4F2] text-[#34A89C] dark:bg-[#2a4a46]/30 dark:text-[#74c5bc]',
  medium: 'bg-[#F5F6FB] text-[#5461A8] dark:bg-[#3a406a]/40 dark:text-[#B2BADE]',
  advanced: 'bg-[#E3E5F3] text-[#3d498a] dark:bg-[#3a406a]/60 dark:text-[#D9DCF0]',
};

const getT = (loc: string) => {
  const dict = translations[loc] || translations.zh;
  return (key: string) => dict[key] ?? translations.zh[key] ?? key;
};

export default function WorkflowTemplates({ locale }: { locale: string }) {
  const router = useRouter();
  const { favoriteWorkflows, toggleWorkflowFavorite } = usePreferencesStore();
  const t = getT(locale);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'easiest'>('popular');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- ALL HOOKS MUST BE DECLARED BEFORE ANY EARLY RETURN (Rules of Hooks) ---
  const translatedWorkflows = useMemo(
    () => workflows.map((w) => translateWorkflow(w, locale as Locale)),
    [workflows, locale],
  );

  const categories = Object.entries(categoryInfo);

  const filteredWorkflows = useMemo(() => {
    return translatedWorkflows.filter(w => {
      const matchesSearch = !searchQuery ||
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || w.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [translatedWorkflows, searchQuery, activeCategory]);

  const sortedWorkflows = useMemo(() => {
    return [...filteredWorkflows].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return 0;
        case 'easiest': {
          const order: Record<string, number> = { easy: 0, medium: 1, advanced: 2 };
          return order[a.difficulty] - order[b.difficulty];
        }
        case 'popular':
        default:
          return b.steps.length - a.steps.length;
      }
    });
  }, [filteredWorkflows, sortBy]);

  const featuredWorkflows = workflows.slice(0, 3);

  const isFavorite = (id: string) => favoriteWorkflows.includes(id);

  const handleStartWorkflow = (slug: string) => {
    router.push(`/${locale}/workflow/${slug}`);
  };

  if (!mounted) {
    return (
      <div className='flex-1 min-w-0'>
        <div className='animate-pulse space-y-6'>
          <div className='h-48 bg-gray-200 dark:bg-gray-700 rounded-3xl' />
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className='h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 min-w-0 space-y-6 sm:space-y-8'>
      <div className='flex items-center gap-4'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5461A8] dark:hover:text-[#B2BADE] transition-colors'>
          <ArrowLeft className='h-5 w-5' />
          <span className='text-sm font-medium'>{t('action.back')}</span>
        </a>
      </div>

      <div className='relative overflow-hidden bg-[#2A3154] rounded-2xl p-6 sm:p-8 lg:p-10 text-white border border-gray-200/10'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl' />

        <div className='relative z-10 max-w-2xl'>
          <div className='inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm mb-4'>
            <Sparkles className='h-4 w-4' />
            <span>{t('banner.featured')}</span>
          </div>

          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-3'>
            {t('banner.title')}
          </h1>

          <p className='text-white/80 text-base sm:text-lg mb-6'>
            {t('banner.subtitle')}
          </p>

          <div className='flex flex-wrap gap-3'>
            <button
              onClick={() => {
                const el = document.getElementById('templates-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-600 rounded-xl font-medium hover:bg-white/90 transition-colors shadow-lg'
            >
              <Zap className='h-4 w-4' />
              {t('action.browse')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/workflows`)}
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur text-white rounded-xl font-medium hover:bg-white/30 transition-colors'
            >
              <Layers className='h-4 w-4' />
              {t('action.myWorkflows')}
            </button>
          </div>

          <div className='flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/20'>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-300' />
              <span className='text-sm'>{t('banner.stat1')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-300' />
              <span className='text-sm'>{t('banner.stat2')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-300' />
              <span className='text-sm'>{t('banner.stat3')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder={t('placeholder.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40 focus:border-[#5461A8]/60 transition-all'
            />
          </div>
          <div className='flex gap-2 overflow-x-auto pb-1 sm:pb-0'>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className='px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40 flex-shrink-0'
            >
              <option value='popular'>{t('sort.popular')}</option>
              <option value='newest'>{t('sort.newest')}</option>
              <option value='easiest'>{t('sort.easiest')}</option>
            </select>
          </div>
        </div>

        <div className='flex gap-2 mt-4 overflow-x-auto pb-1 -mx-1 px-1'>
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#E9EBF5] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE]'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className='h-3.5 w-3.5' />
            {t('category.all')}
          </button>
          {categories.map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === key
                    ? 'bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE]'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='h-3.5 w-3.5' />
                {t(`category.${key}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Flame className='h-5 w-5 text-orange-500' />
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
              {t('section.featured')}
            </h2>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
          {featuredWorkflows.map((workflow, index) => (
            <FeaturedTemplateCard
              key={workflow.id}
              workflow={workflow}
              rank={index + 1}
              locale={locale}
              isFavorite={isFavorite(workflow.id)}
              onToggleFavorite={() => toggleWorkflowFavorite(workflow.id)}
              onStart={() => handleStartWorkflow(workflow.slug)}
            />
          ))}
        </div>
      </div>

      <div id='templates-grid'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Layers className='h-5 w-5 text-purple-500' />
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
              {t('section.all')}
            </h2>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              ({sortedWorkflows.length})
            </span>
          </div>
        </div>

        {sortedWorkflows.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-700'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <Search className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {t('state.emptyTitle')}
            </h3>
            <p className='text-gray-500 dark:text-gray-400'>
              {t('state.emptyDesc')}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
            {sortedWorkflows.map((workflow) => (
              <TemplateCard
                key={workflow.id}
                workflow={workflow}
                locale={locale}
                isFavorite={isFavorite(workflow.id)}
                onToggleFavorite={() => toggleWorkflowFavorite(workflow.id)}
                onStart={() => handleStartWorkflow(workflow.slug)}
              />
            ))}
          </div>
        )}
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Award className='h-5 w-5 text-green-600 dark:text-green-400' />
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                {t('cta.title')}
              </h3>
            </div>
            <p className='text-gray-600 dark:text-gray-300'>
              {t('cta.subtitle')}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/workflows`)}
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#5461A8] hover:bg-[#4a579a] text-white rounded-xl font-medium transition-all shadow-sm shadow-[#5461A8]/20 hover:shadow-md hover:shadow-[#5461A8]/30 whitespace-nowrap active:scale-[0.98]'
          >
            <Zap className='h-4 w-4' />
            {t('action.createNow')}
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedTemplateCard({
  workflow,
  rank,
  locale,
  isFavorite,
  onToggleFavorite,
  onStart,
}: {
  workflow: Workflow;
  rank: number;
  locale: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStart: () => void;
}) {
  const catInfo = categoryInfo[workflow.category];
  const Icon = catInfo?.icon || Zap;
  const t = getT(locale);

  return (
    <div className='group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60 transition-all duration-300'>
      <div className={`h-1 ${catInfo?.color || 'bg-[#34A89C]'}`} />

      <div className='p-5'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <div className={`w-11 h-11 ${catInfo?.color || 'bg-[#5461A8]'} rounded-xl flex items-center justify-center text-white shadow-md`}>
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-[#5461A8] dark:text-[#B2BADE] bg-[#F5F6FB] dark:bg-[#3a406a]/30 px-2 py-0.5 rounded-full'>
                  #{rank}
                </span>
              </div>
              <h3 className='font-bold text-gray-900 dark:text-white mt-1'>
                {workflow.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2'>
          {workflow.description}
        </p>

        <div className='flex flex-wrap gap-2 mb-4'>
          {workflow.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className='text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md'
            >
              {tag}
            </span>
          ))}
        </div>

        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4'>
          <div className='flex items-center gap-1'>
            <Layers className='h-3.5 w-3.5' />
            <span>{workflow.steps.length} {t('label.steps')}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-3.5 w-3.5' />
            <span>{workflow.estimatedTime}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[workflow.difficulty]}`}>
            {t(`difficulty.${workflow.difficulty}`)}
          </span>
        </div>

        <button
          onClick={onStart}
          className='w-full flex items-center justify-center gap-2 py-2.5 bg-[#5461A8] hover:bg-[#4a579a] active:scale-[0.98] text-white rounded-xl font-medium transition-all shadow-sm'
        >
          <Play className='h-4 w-4' />
          {t('action.start')}
        </button>
      </div>
    </div>
  );
}

function TemplateCard({
  workflow,
  locale,
  isFavorite,
  onToggleFavorite,
  onStart,
}: {
  workflow: Workflow;
  locale: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStart: () => void;
}) {
  const catInfo = categoryInfo[workflow.category];
  const Icon = catInfo?.icon || Zap;
  const t = getT(locale);

  return (
    <div className='group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-[#5461A8]/40 dark:hover:border-[#5461A8]/60 transition-all duration-300 relative overflow-hidden'>
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${catInfo?.color || 'bg-[#34A89C]'}`} />
      <div className='flex items-start justify-between mb-3 pt-0.5'>
        <div className={`w-10 h-10 ${catInfo?.color || 'bg-[#5461A8]'} rounded-xl flex items-center justify-center text-white shadow-sm`}>
          <Icon className='h-4.5 w-4.5' />
        </div>
        <button
          onClick={onToggleFavorite}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite
              ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h3 className='font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
        {workflow.title}
      </h3>

      <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
        {workflow.description}
      </p>

      <div className='flex flex-wrap gap-1.5 mb-4'>
        {workflow.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className='text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md'
          >
            {tag}
          </span>
        ))}
      </div>

      <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4'>
        <div className='flex items-center gap-1'>
          <Layers className='h-3 w-3' />
          <span>{workflow.steps.length}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Clock className='h-3 w-3' />
          <span>{workflow.estimatedTime}</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${difficultyColor[workflow.difficulty]}`}>
          {t(`difficulty.${workflow.difficulty}`)}
        </span>
      </div>

      <button
        onClick={onStart}
        className='w-full flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-[#F5F6FB] dark:hover:bg-[#3a406a]/30 hover:text-[#5461A8] dark:hover:text-[#B2BADE] transition-colors text-sm'
      >
        <Play className='h-3.5 w-3.5' />
        {t('action.start')}
        <ChevronRight className='h-3.5 w-3.5 ml-0.5' />
      </button>
    </div>
  );
}
