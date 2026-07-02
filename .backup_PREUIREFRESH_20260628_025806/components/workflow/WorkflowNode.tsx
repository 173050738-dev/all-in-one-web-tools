'use client';
import { memo } from 'react';
import {
  Play,
  Flag,
  SplitSquareVertical,
  Copy,
  Trash2,
  Plus,
  Code,
  Shield,
  Palette,
  FileText,
  GraduationCap,
  Video,
  Sparkles,
  CircleDashed,
  type LucideIcon,
} from 'lucide-react';

/* ========== 类型定义 ========== */
export type WorkflowNodeKind = 'start' | 'tool' | 'condition' | 'end';

export type WorkflowNodeStatus = 'idle' | 'running' | 'success' | 'failed';

export interface WorkflowNodeData {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  subtitle?: string;
  category?: string;
  status?: WorkflowNodeStatus;
  iconKey?: string;
  posX: number;
  posY: number;
}

const I18N = {
  addBranch: { zh: '新增分支', en: 'Add Branch', fr: 'Branche', es: 'Rama', hi: 'शाखा', ar: 'فرع' },
  copy: { zh: '复制', en: 'Duplicate', fr: 'Dupliquer', es: 'Duplicar', hi: 'दोहराना', ar: 'نسخ' },
  del: { zh: '删除', en: 'Delete', fr: 'Supprimer', es: 'Eliminar', hi: 'हटाएं', ar: 'حذف' },
  start: { zh: '开始触发', en: 'Trigger', fr: 'Déclencheur', es: 'Disparador', hi: 'ट्रिगर', ar: 'مشغل' },
  end: { zh: '流程完成', en: 'Complete', fr: 'Terminer', es: 'Completar', hi: 'समाप्त', ar: 'اكتمل' },
  condition: { zh: '条件分支', en: 'Condition', fr: 'Condition', es: 'Condición', hi: 'शर्त', ar: 'شرط' },
  stepSuccess: { zh: '已完成', en: 'Success', fr: 'Réussi', es: 'Éxito', hi: 'सफल', ar: 'نجاح' },
  stepRunning: { zh: '执行中', en: 'Running', fr: 'En cours', es: 'En curso', hi: 'चल रहा है', ar: 'قيد التنفيذ' },
  stepFailed: { zh: '失败', en: 'Failed', fr: 'Échoué', es: 'Fallido', hi: 'असफल', ar: 'فشل' },
  stepIdle: { zh: '待执行', en: 'Idle', fr: 'En attente', es: 'Pendiente', hi: 'इंतज़ार', ar: 'قيد الانتظار' },
};

type LocaleKey = keyof typeof I18N.addBranch;
const pick = (l: string, m: Record<string, string>) => m[l as LocaleKey] || m.en;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  security: Shield,
  developer: Code,
  designer: Palette,
  'content-creator': Sparkles,
  'office-worker': FileText,
  student: GraduationCap,
  'video-creator': Video,
  default: Code,
};

const STATUS_STYLES: Record<WorkflowNodeStatus, { ring: string; dot: string; text: string }> = {
  idle: {
    ring: 'ring-gray-200 dark:ring-gray-700',
    dot: 'bg-gray-400',
    text: 'text-gray-500 dark:text-gray-400',
  },
  running: {
    ring: 'ring-blue-300 dark:ring-blue-700',
    dot: 'bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse',
    text: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    ring: 'ring-green-300 dark:ring-green-700',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  failed: {
    ring: 'ring-red-300 dark:ring-red-700',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
};

/* ========== Props ========== */
export interface WorkflowNodeCardProps {
  data: WorkflowNodeData;
  locale?: string;
  selected?: boolean;
  hovered?: boolean;
  onMouseDown?: (e: React.MouseEvent, id: string) => void;
  onSelect?: (id: string) => void;
  onCopy?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddBranch?: (id: string) => void;
  onHoverChange?: (id: string, isHover: boolean) => void;
}

/**
 * 画布节点组件（单一职责）
 * - 支持4种形态：start(圆) / tool(方) / condition(菱) / end(圆)
 * - 选中态：外层流动蓝紫柔光环
 * - hover：浮动快捷操作（新增分支/复制/删除）
 * - 纯本地state交互，不调用后端
 */
export const WorkflowNodeCard = memo(function WorkflowNodeCard(
  props: WorkflowNodeCardProps
) {
  const {
    data,
    locale = 'en',
    selected = false,
    hovered = false,
    onMouseDown,
    onSelect,
    onCopy,
    onDelete,
    onAddBranch,
    onHoverChange,
  } = props;

  const status = data.status || 'idle';
  const statusStyle = STATUS_STYLES[status];

  const Icon =
    data.kind === 'start'
      ? Play
      : data.kind === 'end'
      ? Flag
      : data.kind === 'condition'
      ? SplitSquareVertical
      : CATEGORY_ICONS[data.category || 'default'] || CATEGORY_ICONS.default;

  /* — 空接口预留：真实环境可对接节点运行数据 — */
  const _apiFetchNodeDetail = async () => {
    // TODO: 调用后端接口拉节点详情，暂不实现
  };

  const handleMouseEnter = () => onHoverChange?.(data.id, true);
  const handleMouseLeave = () => onHoverChange?.(data.id, false);

  /* ============================================================
   * 1. START节点：圆形，带蓝紫渐变
   * ========================================================== */
  if (data.kind === 'start') {
    return (
      <div
        className="relative"
        style={{ transform: `translate(${data.posX}px, ${data.posY}px)` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {selected && <NodeGlowRing />}
        <div
          onMouseDown={(e) => onMouseDown?.(e, data.id)}
          onClick={() => onSelect?.(data.id)}
          className={[
            'relative w-[120px] h-[120px] rounded-full flex flex-col items-center justify-center cursor-move select-none transition-all duration-300',
            'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25',
            selected ? 'scale-[1.03] shadow-2xl shadow-emerald-500/30' : '',
          ].join(' ')}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-1.5">
            <Icon className="w-5 h-5 fill-current ml-0.5" strokeWidth={2.2} />
          </div>
          <div className="text-[13px] font-bold tracking-wide">{pick(locale, I18N.start)}</div>
        </div>
      </div>
    );
  }

  /* ============================================================
   * 2. END节点：圆形，玫瑰红渐变
   * ============================================================ */
  if (data.kind === 'end') {
    return (
      <div
        className="relative"
        style={{ transform: `translate(${data.posX}px, ${data.posY}px)` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {selected && <NodeGlowRing shape="circle" />}
        <div
          onMouseDown={(e) => onMouseDown?.(e, data.id)}
          onClick={() => onSelect?.(data.id)}
          className={[
            'relative w-[120px] h-[120px] rounded-full flex flex-col items-center justify-center cursor-move select-none transition-all duration-300',
            'bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/25',
            selected ? 'scale-[1.03] shadow-2xl shadow-rose-500/30' : '',
          ].join(' ')}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-1.5">
            <Icon className="w-5 h-5 fill-current" strokeWidth={2.2} />
          </div>
          <div className="text-[13px] font-bold tracking-wide">{pick(locale, I18N.end)}</div>
        </div>
      </div>
    );
  }

  /* ============================================================
   * 3. CONDITION节点：菱形条件分支
   * ============================================================ */
  if (data.kind === 'condition') {
    return (
      <div
        className="relative"
        style={{ transform: `translate(${data.posX}px, ${data.posY}px)` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {selected && <NodeGlowRing shape="diamond" />}
        {hovered && (
          <NodeQuickActions
            locale={locale}
            onCopy={() => onCopy?.(data.id)}
            onDelete={() => onDelete?.(data.id)}
            onAddBranch={() => onAddBranch?.(data.id)}
          />
        )}
        <div
          onMouseDown={(e) => onMouseDown?.(e, data.id)}
          onClick={() => onSelect?.(data.id)}
          className={[
            'w-[150px] h-[150px] rotate-45 cursor-move select-none transition-all duration-300 rounded-[20px]',
            'bg-gradient-to-br from-amber-400 via-orange-500 to-red-400 shadow-lg shadow-orange-500/25',
            selected ? 'scale-[1.03] shadow-2xl shadow-orange-500/30' : '',
          ].join(' ')}
        >
          <div className="-rotate-45 w-full h-full flex flex-col items-center justify-center text-white">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-1.5">
              <Icon className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div className="text-[13px] font-bold tracking-wide text-center leading-snug">
              {data.title || pick(locale, I18N.condition)}
            </div>
            {data.subtitle && (
              <div className="text-[10px] mt-0.5 opacity-90">{data.subtitle}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
   * 4. TOOL节点：矩形工具执行卡（最常用）
   * ============================================================ */
  return (
    <div
      className="relative"
      style={{ transform: `translate(${data.posX}px, ${data.posY}px)` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* — 选中态流动柔光环 — */}
      {selected && <NodeGlowRing shape="rect" />}
      {/* — hover 快捷操作浮条 — */}
      {hovered && !selected && (
        <NodeQuickActions
          locale={locale}
          onCopy={() => onCopy?.(data.id)}
          onDelete={() => onDelete?.(data.id)}
          onAddBranch={() => onAddBranch?.(data.id)}
        />
      )}
      <div
        onMouseDown={(e) => onMouseDown?.(e, data.id)}
        onClick={() => onSelect?.(data.id)}
        className={[
          'group relative w-[240px] sm:w-[260px] rounded-xl bg-white dark:bg-gray-900 cursor-move select-none transition-all duration-200',
          'border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md',
          `ring-2 ${statusStyle.ring}`,
          selected ? 'scale-[1.015] shadow-xl shadow-indigo-500/10' : '',
        ].join(' ')}
      >
        {/* — 左侧蓝紫渐变条带（独家记忆点） — */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-gradient-to-b from-indigo-500 via-blue-500 to-violet-500 opacity-90" />
        <div className="p-3 pl-4">
          <div className="flex items-start gap-2.5">
            {/* — 图标：微量蓝紫渐变填充 — */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 dark:from-indigo-950/50 dark:via-blue-950/50 dark:to-violet-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Icon className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">
                    {(data.category || 'Tool').replace(/-/g, ' ')}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                    {data.title || pick(locale, I18N.stepIdle)}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full ${statusStyle.dot} flex-shrink-0`} />
              </div>
              {data.subtitle && (
                <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                  {data.subtitle}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.text} bg-gray-100 dark:bg-gray-800`}>
                  {pick(
                    locale,
                    status === 'success'
                      ? I18N.stepSuccess
                      : status === 'running'
                      ? I18N.stepRunning
                      : status === 'failed'
                      ? I18N.stepFailed
                      : I18N.stepIdle
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* — 上下连接锚点（蓝紫渐变小圆） — */}
        <NodeHandleAnchor position="top" />
        <NodeHandleAnchor position="bottom" />
        <NodeHandleAnchor position="left" />
        <NodeHandleAnchor position="right" />
      </div>
    </div>
  );
});

/* ========== 子组件：选中态柔光环 ========== */
function NodeGlowRing({
  shape = 'rect',
}: {
  shape?: 'rect' | 'circle' | 'diamond';
}) {
  const base =
    'absolute -inset-3 pointer-events-none bg-gradient-to-br from-indigo-500/25 via-blue-500/20 to-violet-500/25 blur-2xl animate-flow-pulse';
  if (shape === 'circle') return <div className={`${base} rounded-full -inset-4`} />;
  if (shape === 'diamond') return <div className={`${base} rotate-45 rounded-2xl`} />;
  return <div className={`${base} rounded-2xl`} />;
}

/* ========== 子组件：hover快捷操作浮条 ========== */
function NodeQuickActions({
  locale,
  onCopy,
  onDelete,
  onAddBranch,
}: {
  locale: string;
  onCopy?: () => void;
  onDelete?: () => void;
  onAddBranch?: () => void;
}) {
  const btnCls =
    'w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-indigo-500 hover:via-blue-500 hover:to-violet-500 transition-all shadow-sm hover:shadow-md';
  return (
    <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-1.5 py-1 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/5 animate-fade-in-up">
      <button
        className={btnCls}
        onClick={onAddBranch}
        title={pick(locale, I18N.addBranch)}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
      <button
        className={btnCls}
        onClick={onCopy}
        title={pick(locale, I18N.copy)}
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button
        className={`${btnCls} hover:!from-rose-500 hover:!via-pink-500 hover:!to-fuchsia-500`}
        onClick={onDelete}
        title={pick(locale, I18N.del)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ========== 子组件：节点连接锚点 ========== */
function NodeHandleAnchor({
  position,
}: {
  position: 'top' | 'bottom' | 'left' | 'right';
}) {
  const posCls = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
    right: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
  }[position];
  return (
    <div
      className={`absolute z-10 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${posCls}`}
    />
  );
}

/* ========== 画布 Loading 骨架节点 ========== */
export function WorkflowNodeSkeleton() {
  return (
    <div className="w-[260px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 pl-4 animate-pulse">
      <div className="flex items-start gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-3.5 w-40 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-2.5 w-56 rounded-full bg-gray-100 dark:bg-gray-800/70" />
        </div>
      </div>
    </div>
  );
}

/* ========== 空画布状态 ========== */
export function WorkflowEmptyState({
  locale = 'en',
  onAddFirst,
}: {
  locale?: string;
  onAddFirst?: () => void;
}) {
  const EMP = {
    title: { zh: '画布还是空的', en: 'Empty Canvas', fr: 'Toile Vide', es: 'Lienzo Vacío', hi: 'खाली कैनवास', ar: 'قماش فارغ' },
    desc: {
      zh: '点击下方按钮添加第一个工具节点，开始构建您的自动化工作流',
      en: 'Add your first tool node below to start building your automation workflow',
      fr: 'Ajoutez votre premier outil pour commencer',
      es: 'Añade tu primera herramienta',
      hi: 'अपना पहला टूल जोड़ें',
      ar: 'أضف أول أداة للبدء',
    },
    cta: { zh: '+ 添加首个节点', en: '+ Add First Node', fr: '+ Ajouter', es: '+ Añadir', hi: '+ जोड़ें', ar: '+ إضافة' },
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="relative w-24 h-24 mx-auto mb-5">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-violet-500/10 animate-pulse" />
          <div className="absolute inset-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
            <CircleDashed className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {pick(locale, EMP.title)}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed mb-5">
          {pick(locale, EMP.desc)}
        </p>
        <button
          onClick={onAddFirst}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          {pick(locale, EMP.cta)}
        </button>
      </div>
    </div>
  );
}
