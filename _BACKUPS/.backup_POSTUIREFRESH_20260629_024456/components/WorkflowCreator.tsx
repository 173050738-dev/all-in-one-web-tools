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
        estimatedTime: `${steps.length * 5}分钟`,
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
            {editId
              ? (locale === 'zh' ? '编辑工作流' : 'Edit Workflow')
              : (locale === 'zh' ? '新建工作流' : 'Create Workflow')}
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
                {locale === 'zh' ? '工作流名称' : 'Workflow Name'} *
              </label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                placeholder={locale === 'zh' ? '例如：小红书图文制作流程' : 'e.g. Blog Post Creation Workflow'}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                {locale === 'zh' ? '工作流描述' : 'Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all'
                placeholder={locale === 'zh' ? '简要描述这个工作流的用途' : 'Briefly describe what this workflow is for'}
              />
            </div>

            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {locale === 'zh' ? '步骤列表' : 'Steps'} *
                </label>
                <button
                  onClick={() => setShowToolPicker(true)}
                  className='text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 font-medium'
                >
                  <Plus className='w-3.5 h-3.5' />
                  {locale === 'zh' ? '添加步骤' : 'Add Step'}
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
                          placeholder={locale === 'zh' ? '步骤标题' : 'Step title'}
                        />
                        <input
                          type='text'
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          className='w-full bg-transparent text-xs text-gray-500 dark:text-gray-400 focus:outline-none'
                          placeholder={locale === 'zh' ? '步骤描述' : 'Step description'}
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
                      {locale === 'zh' ? '点击"添加步骤"开始创建' : 'Click "Add Step" to start'}
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
            {locale === 'zh' ? '取消' : 'Cancel'}
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
              ? (locale === 'zh' ? '已保存' : 'Saved')
              : (editId ? (locale === 'zh' ? '保存修改' : 'Save Changes') : (locale === 'zh' ? '创建工作流' : 'Create Workflow'))}
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
                  {locale === 'zh' ? '选择工具' : 'Select Tool'}
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
                  placeholder={locale === 'zh' ? '搜索工具...' : 'Search tools...'}
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
                  {locale === 'zh' ? '未找到相关工具' : 'No tools found'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
