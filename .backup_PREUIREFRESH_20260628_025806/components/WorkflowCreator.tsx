'use client';
import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  Code,
  Search,
} from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';
import { tools, getToolBySlug } from '@/data/tools';
import type { CustomWorkflowStep } from '@/stores/preferences';

const translations: Record<string, Record<string, string>> = {
  zh: {
    'action.cancel': '取消',
    'action.save': '保存',
    'action.close': '关闭',
    'action.delete': '删除',
    'action.add': '添加步骤',
    'action.create': '创建工作流',
    'action.saved': '已保存',
    'action.saveChanges': '保存修改',
    'title.edit': '编辑工作流',
    'title.create': '新建工作流',
    'title.selectTool': '选择工具',
    'label.name': '工作流名称',
    'label.description': '工作流描述',
    'label.steps': '步骤列表',
    'placeholder.name': '例如：小红书图文制作流程',
    'placeholder.desc': '简要描述这个工作流的用途',
    'placeholder.stepTitle': '步骤标题',
    'placeholder.stepDesc': '步骤描述',
    'placeholder.searchTool': '搜索工具...',
    'state.emptySteps': '点击"添加步骤"开始创建',
    'state.noTools': '未找到相关工具',
    'estimatedTimeUnit': '分钟',
  },
  en: {
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'action.close': 'Close',
    'action.delete': 'Delete',
    'action.add': 'Add Step',
    'action.create': 'Create Workflow',
    'action.saved': 'Saved',
    'action.saveChanges': 'Save Changes',
    'title.edit': 'Edit Workflow',
    'title.create': 'Create Workflow',
    'title.selectTool': 'Select Tool',
    'label.name': 'Workflow Name',
    'label.description': 'Description',
    'label.steps': 'Steps',
    'placeholder.name': 'e.g. Blog Post Creation Workflow',
    'placeholder.desc': 'Briefly describe what this workflow is for',
    'placeholder.stepTitle': 'Step title',
    'placeholder.stepDesc': 'Step description',
    'placeholder.searchTool': 'Search tools...',
    'state.emptySteps': 'Click "Add Step" to start',
    'state.noTools': 'No tools found',
    'estimatedTimeUnit': 'min',
  },
  hi: {
    'action.cancel': 'रद्द करें',
    'action.save': 'सहेजें',
    'action.close': 'बंद करें',
    'action.delete': 'हटाएं',
    'action.add': 'चरण जोड़ें',
    'action.create': 'वर्कफ़्लो बनाएं',
    'action.saved': 'सहेजा गया',
    'action.saveChanges': 'बदलाव सहेजें',
    'title.edit': 'वर्कफ़्लो संपादित करें',
    'title.create': 'नया वर्कफ़्लो बनाएं',
    'title.selectTool': 'टूल चुनें',
    'label.name': 'वर्कफ़्लो का नाम',
    'label.description': 'विवरण',
    'label.steps': 'चरण',
    'placeholder.name': 'उदाहरण: ब्लॉग पोस्ट बनाने की प्रक्रिया',
    'placeholder.desc': 'संक्षेप में बताएं कि यह वर्कफ़्लो किस लिए है',
    'placeholder.stepTitle': 'चरण का शीर्षक',
    'placeholder.stepDesc': 'चरण का विवरण',
    'placeholder.searchTool': 'टूल्स खोजें...',
    'state.emptySteps': 'शुरू करने के लिए "चरण जोड़ें" पर क्लिक करें',
    'state.noTools': 'कोई टूल नहीं मिला',
    'estimatedTimeUnit': 'मिनट',
  },
  fr: {
    'action.cancel': 'Annuler',
    'action.save': 'Enregistrer',
    'action.close': 'Fermer',
    'action.delete': 'Supprimer',
    'action.add': 'Ajouter une Étape',
    'action.create': 'Créer Workflow',
    'action.saved': 'Enregistré',
    'action.saveChanges': 'Enregistrer Modifications',
    'title.edit': 'Modifier Workflow',
    'title.create': 'Nouveau Workflow',
    'title.selectTool': 'Sélectionner Outil',
    'label.name': 'Nom du Workflow',
    'label.description': 'Description',
    'label.steps': 'Étapes',
    'placeholder.name': 'ex: Processus de Création d\'Article',
    'placeholder.desc': 'Décrivez brièvement l\'utilité de ce workflow',
    'placeholder.stepTitle': 'Titre de l\'étape',
    'placeholder.stepDesc': 'Description de l\'étape',
    'placeholder.searchTool': 'Rechercher outils...',
    'state.emptySteps': 'Cliquez sur "Ajouter une Étape" pour commencer',
    'state.noTools': 'Aucun outil trouvé',
    'estimatedTimeUnit': 'min',
  },
  es: {
    'action.cancel': 'Cancelar',
    'action.save': 'Guardar',
    'action.close': 'Cerrar',
    'action.delete': 'Eliminar',
    'action.add': 'Añadir Paso',
    'action.create': 'Crear Flujo',
    'action.saved': 'Guardado',
    'action.saveChanges': 'Guardar Cambios',
    'title.edit': 'Editar Flujo',
    'title.create': 'Nuevo Flujo',
    'title.selectTool': 'Seleccionar Herramienta',
    'label.name': 'Nombre del Flujo',
    'label.description': 'Descripción',
    'label.steps': 'Pasos',
    'placeholder.name': 'ej: Flujo Creación de Artículos',
    'placeholder.desc': 'Describe brevemente para qué sirve este flujo',
    'placeholder.stepTitle': 'Título del paso',
    'placeholder.stepDesc': 'Descripción del paso',
    'placeholder.searchTool': 'Buscar herramientas...',
    'state.emptySteps': 'Haz clic en "Añadir Paso" para empezar',
    'state.noTools': 'No se encontraron herramientas',
    'estimatedTimeUnit': 'min',
  },
  ar: {
    'action.cancel': 'إلغاء',
    'action.save': 'حفظ',
    'action.close': 'إغلاق',
    'action.delete': 'حذف',
    'action.add': 'إضافة خطوة',
    'action.create': 'إنشاء سير عمل',
    'action.saved': 'تم الحفظ',
    'action.saveChanges': 'حفظ التغييرات',
    'title.edit': 'تعديل سير العمل',
    'title.create': 'سير عمل جديد',
    'title.selectTool': 'اختر أداة',
    'label.name': 'اسم سير العمل',
    'label.description': 'الوصف',
    'label.steps': 'الخطوات',
    'placeholder.name': 'مثال: عملية إنشاء مقال المدونة',
    'placeholder.desc': 'صف بإيجاز الغرض من سير العمل هذا',
    'placeholder.stepTitle': 'عنوان الخطوة',
    'placeholder.stepDesc': 'وصف الخطوة',
    'placeholder.searchTool': 'ابحث في الأدوات...',
    'state.emptySteps': 'انقر على "إضافة خطوة" للبدء',
    'state.noTools': 'لم يتم العثور على أدوات',
    'estimatedTimeUnit': 'دقيقة',
  },
};

const getT = (loc: string) => {
  const dict = translations[loc] || translations.zh;
  return (key: string) => dict[key] ?? translations.zh[key] ?? key;
};

interface WorkflowCreatorProps {
  locale: string;
  onClose: () => void;
  initialWorkflow?: {
    title?: string;
    description?: string;
    steps?: CustomWorkflowStep[];
    icon?: string;
    category?: string;
  };
  editId?: string;
}

export default function WorkflowCreator({ locale, onClose, initialWorkflow, editId }: WorkflowCreatorProps) {
  const { addCustomWorkflow, updateCustomWorkflow } = usePreferencesStore();
  const t = getT(locale);

  const [title, setTitle] = useState(initialWorkflow?.title || '');
  const [description, setDescription] = useState(initialWorkflow?.description || '');
  const [steps, setSteps] = useState<CustomWorkflowStep[]>(initialWorkflow?.steps || []);
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const filteredTools = tools
    .filter(t =>
      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(toolSearch.toLowerCase()))
    )
    .slice(0, 30);

  const addStep = (toolSlug: string) => {
    const tool = getToolBySlug(toolSlug);
    if (!tool) return;
    setSteps([
      ...steps,
      {
        toolSlug,
        title: tool.name,
        description: tool.description.slice(0, 60),
      },
    ]);
    setShowToolPicker(false);
    setToolSearch('');
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= steps.length) return;
    const newSteps = [...steps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    setSteps(newSteps);
  };

  const updateStep = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (!title.trim() || steps.length === 0) return;

    if (editId) {
      updateCustomWorkflow(editId, {
        title,
        description,
        steps,
      });
    } else {
      addCustomWorkflow({
        title,
        description,
        steps,
        icon: 'Zap',
        category: 'content-creator',
        tags: [],
        estimatedTime: `${steps.length * 5}${t('estimatedTimeUnit')}`,
        difficulty: 'easy',
      });
    }

    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={onClose}>
      <div
        className='w-full sm:max-w-2xl bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg'>
            {editId ? t('title.edit') : t('title.create')}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4 overflow-y-auto flex-1'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                {t('label.name')} *
              </label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                placeholder={t('placeholder.name')}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                {t('label.description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                placeholder={t('placeholder.desc')}
              />
            </div>

            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {t('label.steps')} *
                </label>
                <button
                  onClick={() => setShowToolPicker(true)}
                  className='text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 font-medium'
                >
                  <Plus className='w-3.5 h-3.5' />
                  {t('action.add')}
                </button>
              </div>

              <div className='space-y-2'>
                {steps.map((step, index) => {
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
                          disabled={index === steps.length - 1}
                          className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors'
                        >
                          <ChevronLeft className='w-3 h-3 -rotate-90' />
                        </button>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <input
                          type='text'
                          value={step.title}
                          onChange={(e) => updateStep(index, 'title', e.target.value)}
                          className='w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none mb-1'
                          placeholder={t('placeholder.stepTitle')}
                        />
                        <input
                          type='text'
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          className='w-full bg-transparent text-xs text-gray-500 dark:text-gray-400 focus:outline-none'
                          placeholder={t('placeholder.stepDesc')}
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
                {steps.length === 0 && (
                  <div className='text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl'>
                    <div className='w-12 h-12 mx-auto mb-2 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
                      <Plus className='w-6 h-6 text-gray-400' />
                    </div>
                    <p className='text-sm text-gray-400 dark:text-gray-500'>
                      {t('state.emptySteps')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2'>
          <button
            onClick={onClose}
            className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-[0.98]'
          >
            {t('action.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || steps.length === 0 || saved}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
              saved
                ? 'bg-green-500 text-white shadow-green-500/25'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Save className='w-4 h-4' />
            {saved
              ? t('action.saved')
              : editId ? t('action.saveChanges') : t('action.create')}
          </button>
        </div>
      </div>

      {showToolPicker && (
        <div className='fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowToolPicker(false)}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2 mb-3'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex-1'>
                  {t('title.selectTool')}
                </h3>
                <button
                  onClick={() => setShowToolPicker(false)}
                  className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder={t('placeholder.searchTool')}
                  className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                  autoFocus
                />
              </div>
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
                  {t('state.noTools')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
