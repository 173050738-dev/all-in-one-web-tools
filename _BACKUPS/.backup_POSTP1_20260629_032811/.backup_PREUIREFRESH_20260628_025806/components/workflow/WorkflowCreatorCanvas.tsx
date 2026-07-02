'use client';
import { useState } from 'react';
import { X, Layers, List, Save, Check, Loader2, ArrowLeft } from 'lucide-react';
import WorkflowEditor from './WorkflowEditor';
import type { WorkflowEditorResult } from './WorkflowEditor';
import { usePreferencesStore } from '@/stores/preferences';
import type { CustomWorkflowStep } from '@/stores/preferences';

const T = {
  canvasMode: {
    zh: '画布模式',
    en: 'Canvas Mode',
    fr: 'Mode Toile',
    es: 'Modo Lienzo',
    hi: 'कैनवास मोड',
    ar: 'وضع قماش',
  },
  listMode: {
    zh: '列表模式',
    en: 'List Mode',
    fr: 'Mode Liste',
    es: 'Modo Lista',
    hi: 'सूची मोड',
    ar: 'وضع القائمة',
  },
};

function t(locale: string, key: keyof typeof T): string {
  return (T[key] as any)[locale] || T[key].en;
}

export interface CreatorCanvasProps {
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

export default function WorkflowCreatorCanvas(props: CreatorCanvasProps) {
  const { locale, onClose, initialWorkflow, editId } = props;
  const { addCustomWorkflow, updateCustomWorkflow } = usePreferencesStore();
  const [mode, setMode] = useState<'canvas' | 'list'>('canvas');

  const handleSave = (data: WorkflowEditorResult) => {
    const payload = {
      ...data,
      icon: initialWorkflow?.icon || data.icon,
      category: initialWorkflow?.category || data.category,
    };
    if (editId) {
      updateCustomWorkflow(editId, payload);
    } else {
      addCustomWorkflow(payload);
    }
    setTimeout(() => onClose(), 500);
  };

  if (mode === 'canvas') {
    return (
      <WorkflowEditor
        locale={locale}
        mode={editId ? 'edit' : 'create'}
        initial={initialWorkflow}
        workflowId={editId}
        onCancel={onClose}
        onSave={handleSave}
        onClose={onClose}
      />
    );
  }

  return null;
}

export function ModeToggle({
  mode,
  onChange,
  locale,
}: {
  mode: 'canvas' | 'list';
  onChange: (m: 'canvas' | 'list') => void;
  locale: string;
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-700/40">
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
          mode === 'list'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
        title={t(locale, 'listMode')}
      >
        <List className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t(locale, 'listMode')}</span>
      </button>
      <button
        onClick={() => onChange('canvas')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
          mode === 'canvas'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
        title={t(locale, 'canvasMode')}
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t(locale, 'canvasMode')}</span>
      </button>
    </div>
  );
}
