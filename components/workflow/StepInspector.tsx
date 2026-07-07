'use client';
import { useMemo } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  SkipForward,
  AlertTriangle,
  Settings2,
  PlayCircle,
} from 'lucide-react';
import { getToolBySlug } from '@/data/tools';
import { getToolMeta } from '@/lib/workflow-tool-registry';
import type { InputFieldSchema } from '@/types/workflow-canvas';
import { safeNavigate } from '@/lib/url-whitelist';
import { resolveToolLink, isExternalTool, getToolDisplayLabel } from '@/lib/toolLinks';

const T = {
  properties: {
    zh: '属性配置',
    en: 'Properties',
    fr: 'Propriétés',
    es: 'Propiedades',
    hi: 'गुण',
    ar: 'الخصائص',
  },
  selectStep: {
    zh: '选择一个步骤来配置参数',
    en: 'Select a step to configure',
    fr: 'Sélectionnez une étape',
    es: 'Selecciona un paso',
    hi: 'चरण चुनें',
    ar: 'اختر خطوة للتكوين',
  },
  stepTitle: {
    zh: '步骤标题',
    en: 'Step Title',
    fr: 'Titre',
    es: 'Título',
    hi: 'शीर्षक',
    ar: 'العنوان',
  },
  stepDesc: {
    zh: '步骤描述',
    en: 'Description',
    fr: 'Description',
    es: 'Descripción',
    hi: 'विवरण',
    ar: 'الوصف',
  },
  toolLink: {
    zh: '打开工具',
    en: 'Open Tool',
    fr: 'Ouvrir',
    es: 'Abrir',
    hi: 'खोलें',
    ar: 'فتح',
  },
  autoOpen: {
    zh: '执行时自动打开',
    en: 'Auto-open on run',
    fr: 'Ouvrir auto.',
    es: 'Abrir auto.',
    hi: 'ऑटो-ओपन',
    ar: 'فتح تلقائي',
  },
  requireConfirm: {
    zh: '需要手动确认完成',
    en: 'Require manual confirm',
    fr: 'Confirmation req.',
    es: 'Confirmación req.',
    hi: 'मैनुअल कन्फर्म',
    ar: 'يتطلب تأكيد',
  },
  confirm: {
    zh: '我已完成此步骤',
    en: "I've completed this step",
    fr: "J'ai terminé",
    es: 'Completado',
    hi: 'पूर्ण कर दिया',
    ar: 'لقد أكملت',
  },
  skip: {
    zh: '跳过此步骤',
    en: 'Skip this step',
    fr: 'Passer',
    es: 'Omitir',
    hi: 'छोड़ें',
    ar: 'تخطي',
  },
  waiting: {
    zh: '等待您完成操作...',
    en: 'Waiting for you to complete...',
    fr: 'En attente...',
    es: 'Esperando...',
    hi: 'प्रतीक्षा में...',
    ar: 'في انتظارك...',
  },
  startNode: {
    zh: '开始节点',
    en: 'Start Node',
    fr: 'Début',
    es: 'Inicio',
    hi: 'शुरुआत',
    ar: 'بداية',
  },
  endNode: {
    zh: '结束节点',
    en: 'End Node',
    fr: 'Fin',
    es: 'Fin',
    hi: 'अंत',
    ar: 'نهاية',
  },
  startDesc: {
    zh: '工作流的起点，无需配置。',
    en: 'Workflow entry point. No config needed.',
    fr: "Point d'entrée. Aucune config.",
    es: 'Punto de entrada. Sin config.',
    hi: 'प्रवेश बिंदु। कोई कॉन्फ़िग नहीं।',
    ar: 'نقطة البداية. لا يوجد تكوين.',
  },
  endDesc: {
    zh: '工作流的终点，标记全部完成。',
    en: 'Marks workflow completion.',
    fr: 'Marque la fin du workflow.',
    es: 'Marca la finalización.',
    hi: 'कार्यप्रवाह का अंत।',
    ar: 'نهاية سير العمل.',
  },
  parameters: {
    zh: '参数',
    en: 'Parameters',
    fr: 'Paramètres',
    es: 'Parámetros',
    hi: 'पैरामीटर',
    ar: 'المعاملات',
  },
  execution: {
    zh: '执行控制',
    en: 'Execution',
    fr: 'Exécution',
    es: 'Ejecución',
    hi: 'निष्पादन',
    ar: 'التنفيذ',
  },
};

function t(locale: string, key: keyof typeof T): string {
  return (T[key] as any)[locale] || T[key].en;
}

interface Props {
  locale?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  executorRef?: React.MutableRefObject<any>;
  nodes: any[];
  selectedNodeId: string | null;
  onUpdateNode: (id: string, patch: Record<string, unknown>) => void;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
  nodeStatuses?: Record<string, string>;
  executor?: any;
}

export default function StepInspector({
  locale = 'en',
  onClose,
  showCloseButton = true,
  executorRef,
  nodes,
  selectedNodeId,
  onUpdateNode,
  onUpdateNodeData,
  nodeStatuses = {},
  executor,
}: Props) {
  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  if (!node) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#5461A8] dark:text-[#B2BADE]" />
          <div className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex-1">
            {t(locale, 'properties')}
          </div>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 sm:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center">
              <Settings2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t(locale, 'selectStep')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const data = node.data;
  const status = nodeStatuses[node.id] || (data.kind === 'tool' ? data.status : 'idle');
  const isWaiting = status === 'running' && executor?.getWaitingNodeId?.() === node.id;

  const meta = data.kind === 'tool' ? getToolMeta(data.toolSlug) : null;
  const tool = data.kind === 'tool' ? getToolBySlug(data.toolSlug) : null;
  const schema = meta?.config?.inputSchema || [];
  const values =
    (data.kind === 'tool' && (data.config?.values as Record<string, unknown>)) || {};
  const externalUrl =
    (data.kind === 'tool' && data.config?.externalUrl) || tool?.externalUrl || '';
  const resolvedToolLink =
    data.kind === 'tool' && data.toolSlug ? resolveToolLink(data.toolSlug, locale) : null;
  const hasToolLink = !!externalUrl || (resolvedToolLink && resolvedToolLink.type !== 'fallback');
  const finalToolUrl = externalUrl || resolvedToolLink?.url || '';
  const autoOpen =
    data.kind === 'tool' ? data.config?.autoOpen ?? true : false;
  const waitConfirm =
    data.kind === 'tool' ? data.config?.waitForManualConfirm ?? true : false;

  const updateField = (key: string, value: unknown) => {
    if (data.kind !== 'tool') return;
    const newValues = { ...values, [key]: value };
    onUpdateNodeData(node.id, {
      config: { ...(data.config || {}), values: newValues },
    });
  };

  const updateMeta = (patch: Record<string, unknown>) => {
    onUpdateNodeData(node.id, patch);
  };

  const updateExecConfig = (key: 'autoOpen' | 'waitForManualConfirm', value: boolean) => {
    if (data.kind !== 'tool') return;
    onUpdateNodeData(node.id, {
      config: { ...(data.config || {}), [key]: value },
    });
  };

  const openUrl = () => {
    if (finalToolUrl && typeof window !== 'undefined') {
      const target = (!externalUrl && (resolvedToolLink?.type === 'internal' || resolvedToolLink?.type === 'detail')) ? '_self' : '_blank';
      safeNavigate(finalToolUrl, target);
    }
  };

  const handleConfirm = () => {
    const ex = executor || executorRef?.current;
    if (ex && ex.getWaitingNodeId?.() === node.id) {
      ex.confirmStep(node.id, { manual: true });
    }
  };

  const handleSkip = () => {
    const ex = executor || executorRef?.current;
    if (ex && ex.getWaitingNodeId?.() === node.id) {
      ex.skipStep(node.id);
    }
  };

  let headerTitle = '';
  let HeaderIcon: any = Settings2;
  if (data.kind === 'start') {
    headerTitle = t(locale, 'startNode');
    HeaderIcon = PlayCircle;
  } else if (data.kind === 'end') {
    headerTitle = t(locale, 'endNode');
    HeaderIcon = CheckCircle2;
  } else {
    headerTitle = data.title || tool?.name || 'Step';
    HeaderIcon = Settings2;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-start gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#F5F6FB] dark:bg-[#3a406a]/30 text-[#5461A8] dark:text-[#B2BADE] flex items-center justify-center flex-shrink-0 mt-0.5">
          <HeaderIcon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
            {t(locale, 'properties')}
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {headerTitle}
          </div>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isWaiting && (
          <div className="m-3 p-3 rounded-xl border border-[#E0E3F2] dark:border-[#3a406a]/60 bg-[#F5F6FB] dark:bg-[#3a406a]/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#5461A8] dark:text-[#B2BADE] flex-shrink-0" />
              <div className="text-xs font-semibold text-[#2A3154] dark:text-[#B2BADE] flex-1">
                {t(locale, 'waiting')}
              </div>
            </div>
            {hasToolLink && (
              <button
                onClick={openUrl}
                className="w-full mb-2 py-2 px-3 text-xs font-medium bg-white dark:bg-gray-800 text-[#5461A8] dark:text-[#B2BADE] rounded-lg border border-[#E0E3F2] dark:border-[#3a406a]/60 hover:bg-[#F5F6FB] dark:hover:bg-[#3a406a]/40 flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t(locale, 'toolLink')}
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSkip}
                className="py-2 px-3 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1"
              >
                <SkipForward className="w-3.5 h-3.5" />
                {t(locale, 'skip')}
              </button>
              <button
                onClick={handleConfirm}
                className="py-2 px-3 text-xs font-medium bg-[#5461A8] dark:bg-[#6975ba] text-white rounded-lg hover:bg-[#4450a0] shadow-sm flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t(locale, 'confirm')}
              </button>
            </div>
          </div>
        )}

        <div className="p-3 space-y-4">
          {(data.kind === 'start' || data.kind === 'end') ? (
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
              {data.kind === 'start' ? t(locale, 'startDesc') : t(locale, 'endDesc')}
            </div>
          ) : (
            <>
              <Section label={t(locale, 'stepTitle')}>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateMeta({ title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40"
                />
              </Section>
              <Section label={t(locale, 'stepDesc')}>
                <textarea
                  rows={2}
                  value={data.description || ''}
                  onChange={(e) => updateMeta({ description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40 resize-none"
                />
              </Section>
              {hasToolLink && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                    URL
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={finalToolUrl}
                      readOnly
                      className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300 truncate"
                    />
                    <button
                      onClick={openUrl}
                      className="px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1 flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
              {schema.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    {t(locale, 'parameters')}
                  </div>
                  <div className="space-y-3">
                    {schema.map((field) => (
                      <InputField
                        key={field.key}
                        field={field}
                        value={values[field.key]}
                        onChange={(v) => updateField(field.key, v)}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {t(locale, 'execution')}
                </div>
                <div className="space-y-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <Toggle
                    label={t(locale, 'autoOpen')}
                    checked={autoOpen}
                    onChange={(v) => updateExecConfig('autoOpen', v)}
                  />
                  <Toggle
                    label={t(locale, 'requireConfirm')}
                    checked={waitConfirm}
                    onChange={(v) => updateExecConfig('waitForManualConfirm', v)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function InputField({
  field,
  value,
  onChange,
}: {
  field: InputFieldSchema;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const strValue = value == null ? '' : String(value);
  const base =
    'w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5461A8]/40';

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-300 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          rows={2}
          value={strValue}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} resize-none`}
        />
      ) : field.type === 'select' ? (
        <select
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === 'boolean' ? (
        <label className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded accent-[#5461A8]"
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {field.placeholder || field.label}
          </span>
        </label>
      ) : (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          value={strValue}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)
          }
          className={base}
        />
      )}
      {field.description && (
        <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
          {field.description}
        </p>
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-[#5461A8] dark:bg-[#6975ba]' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
