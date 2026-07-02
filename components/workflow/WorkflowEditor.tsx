'use client';
import { useMemo, useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { X, Save, Check, Loader2 } from 'lucide-react';
import WorkflowCanvas from './WorkflowCanvas';
import {
  graphToLinearSteps,
  linearStepsToGraph,
} from '@/lib/workflow-graph-adapter';
import type { CustomWorkflowStep } from '@/stores/preferences';
import { useWorkflowCanvasStore } from '@/stores/workflow-canvas';

const T = {
  cancel: {
    zh: '取消',
    en: 'Cancel',
    fr: 'Annuler',
    es: 'Cancelar',
    hi: 'रद्द करें',
    ar: 'إلغاء',
  },
  save: {
    zh: '保存',
    en: 'Save',
    fr: 'Enregistrer',
    es: 'Guardar',
    hi: 'सहेजें',
    ar: 'حفظ',
  },
  saved: {
    zh: '已保存',
    en: 'Saved',
    fr: 'Enregistré',
    es: 'Guardado',
    hi: 'सहेजा गया',
    ar: 'تم الحفظ',
  },
  titleCreate: {
    zh: '工作流编排',
    en: 'Workflow Editor',
    fr: 'Éditeur de Workflow',
    es: 'Editor de Workflow',
    hi: 'वर्कफ़्लो संपादक',
    ar: 'محرر سير العمل',
  },
  titleEdit: {
    zh: '编辑工作流',
    en: 'Edit Workflow',
    fr: 'Modifier',
    es: 'Editar',
    hi: 'संपादित करें',
    ar: 'تعديل',
  },
  namePlaceholder: {
    zh: '工作流名称',
    en: 'Workflow name',
    fr: 'Nom du workflow',
    es: 'Nombre del workflow',
    hi: 'कार्यप्रवाह नाम',
    ar: 'اسم سير العمل',
  },
  descPlaceholder: {
    zh: '简要描述这个工作流...',
    en: 'Brief description...',
    fr: 'Brève description...',
    es: 'Descripción breve...',
    hi: 'संक्षिप्त विवरण...',
    ar: 'وصف موجز...',
  },
  emptySteps: {
    zh: '请从左侧工具面板拖入至少一个工具节点',
    en: 'Please add at least one tool from the left panel',
    fr: 'Ajoutez au moins un outil',
    es: 'Añade al menos una herramienta',
    hi: 'कम से कम एक टूल जोड़ें',
    ar: 'أضف أداة واحدة على الأقل',
  },
};

function t(locale: string, key: keyof typeof T): string {
  return (T[key] as any)[locale] || T[key].en;
}

export interface WorkflowEditorResult {
  title: string;
  description: string;
  steps: CustomWorkflowStep[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  icon: string;
  category: string;
  tags: string[];
}

export interface WorkflowEditorProps {
  locale?: string;
  mode?: 'create' | 'edit';
  initial?: {
    title?: string;
    description?: string;
    steps?: CustomWorkflowStep[];
    icon?: string;
    category?: string;
  };
  workflowId?: string;
  onCancel: () => void;
  onSave: (data: WorkflowEditorResult) => void;
  onClose?: () => void;
}

export default function WorkflowEditor(props: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner {...props} />
    </ReactFlowProvider>
  );
}

function WorkflowEditorInner({
  locale = 'en',
  mode = 'create',
  initial,
  workflowId,
  onCancel,
  onSave,
  onClose,
}: WorkflowEditorProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [stepsSnapshot, setStepsSnapshot] = useState<CustomWorkflowStep[]>(
    initial?.steps || []
  );
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const canvasNodes = useWorkflowCanvasStore((s) => s.nodes);
  const canvasEdges = useWorkflowCanvasStore((s) => s.edges);

  const initialGraph = useMemo(() => {
    const steps = initial?.steps || [];
    return linearStepsToGraph(steps);
  }, [initial?.steps]);

  useEffect(() => {
    // Sync estimated difficulty & time
  }, [stepsSnapshot]);

  const handleSaveData = (data: { nodes: any[]; edges: any[] }) => {
    const steps = graphToLinearSteps(data.nodes, data.edges);
    setStepsSnapshot(steps);
  };

  const handleClickSave = async () => {
    if (!title.trim()) return;
    const finalSteps =
      stepsSnapshot.length > 0
        ? stepsSnapshot
        : graphToLinearSteps(canvasNodes as any, canvasEdges as any);
    if (finalSteps.length === 0) return;
    setSaveState('saving');
    const totalMin = Math.max(5, finalSteps.length * 5);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const estimatedTime = h > 0 ? (locale === 'zh' ? `${h}小时${m}分钟` : `${h}h ${m}min`) : `${m}分钟`;
    const difficulty: 'easy' | 'medium' | 'advanced' =
      finalSteps.length <= 3 ? 'easy' : finalSteps.length <= 6 ? 'medium' : 'advanced';
    const result: WorkflowEditorResult = {
      title: title.trim(),
      description: description.trim(),
      steps: finalSteps,
      estimatedTime,
      difficulty,
      icon: initial?.icon || 'Zap',
      category: initial?.category || 'content-creator',
      tags: [],
    };
    await new Promise((r) => setTimeout(r, 450));
    try {
      onSave(result);
      setSaveState('saved');
    } catch (e) {
      setSaveState('idle');
    }
  };

  const canSave = title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900 md:rounded-2xl md:m-4 md:shadow-2xl md:border md:border-gray-200 md:dark:border-gray-700 md:overflow-hidden">
      {/* Header */}
      <div className="h-14 sm:h-16 flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={onClose || onCancel}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="min-w-0 flex-1 hidden sm:block">
          <div className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">
            {mode === 'edit' ? t(locale, 'titleEdit') : t(locale, 'titleCreate')}
          </div>
          <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title || (mode === 'edit' ? t(locale, 'titleEdit') : t(locale, 'titleCreate'))}
          </div>
        </div>
        <div className="flex-1 sm:hidden">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t(locale, 'namePlaceholder')}
            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm">
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t(locale, 'namePlaceholder')}
            className="flex-1 min-w-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t(locale, 'descPlaceholder')}
            className="flex-1 min-w-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 hidden md:block"
          />
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
        <button
          onClick={onCancel}
          className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1.5 active:scale-[0.98] transition-colors"
        >
          {t(locale, 'cancel')}
        </button>
        <button
          onClick={handleClickSave}
          disabled={!canSave || saveState === 'saving'}
          className={`h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 active:scale-[0.98] transition-all ${
            saveState === 'saved'
              ? 'bg-green-500 text-white shadow-sm shadow-green-500/25'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {saveState === 'saved' ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t(locale, 'saved')}
            </>
          ) : saveState === 'saving' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              ...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t(locale, 'save')}
            </>
          )}
        </button>
      </div>

      {/* Body: Canvas fills everything */}
      <div className="flex-1 min-h-0 relative">
        <WorkflowCanvas
          locale={locale}
          initialNodes={initialGraph.nodes}
          initialEdges={initialGraph.edges}
          workflowId={workflowId || `editor-${mode}`}
          onSave={handleSaveData}
        />
      </div>
    </div>
  );
}
