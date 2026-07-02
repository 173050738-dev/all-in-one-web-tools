'use client';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  Undo2,
  Redo2,
  MessageSquarePlus,
  Layers,
  Download,
  Grid3x3,
  type LucideIcon,
} from 'lucide-react';

/* ========== i18n ========== */
const I18N = {
  zoomIn: { zh: '放大 +', en: 'Zoom In', fr: 'Zoom +', es: 'Acercar', hi: 'ज़ूम इन', ar: 'تكبير' },
  zoomOut: { zh: '缩小 -', en: 'Zoom Out', fr: 'Zoom -', es: 'Alejar', hi: 'ज़ूम आउट', ar: 'تصغير' },
  fit: { zh: '适应画布', en: 'Fit View', fr: 'Adapter', es: 'Ajustar', hi: 'फिट करें', ar: 'ملاءمة' },
  pan: { zh: '手型平移', en: 'Pan Tool', fr: 'Déplacer', es: 'Mover', hi: 'पैन', ar: 'التحريك' },
  undo: { zh: '撤销', en: 'Undo', fr: 'Annuler', es: 'Deshacer', hi: 'पूर्ववत', ar: 'تراجع' },
  redo: { zh: '重做', en: 'Redo', fr: 'Rétablir', es: 'Rehacer', hi: 'फिर से', ar: 'إعادة' },
  comment: { zh: '添加注释', en: 'Add Comment', fr: 'Commenter', es: 'Comentar', hi: 'टिप्पणी', ar: 'تعليق' },
  group: { zh: '节点分组', en: 'Group Nodes', fr: 'Grouper', es: 'Agrupar', hi: 'समूह', ar: 'تجميع' },
  export: { zh: '导出 JSON', en: 'Export JSON', fr: 'Exporter JSON', es: 'Exportar JSON', hi: 'निर्यात', ar: 'تصدير' },
  grid: { zh: '网格切换', en: 'Grid Toggle', fr: 'Grille', es: 'Cuadrícula', hi: 'ग्रिड', ar: 'الشبكة' },
  zoomPct: { zh: '缩放', en: 'Zoom', fr: 'Zoom', es: 'Zoom', hi: 'ज़ूम', ar: 'تكبير' },
};

type LocaleKey = keyof typeof I18N.zoomIn;
const pick = (l: string, m: Record<string, string>) => m[l as LocaleKey] || m.en;

/* ========== 按钮定义 ========== */
type BtnKey = 'zoomIn' | 'zoomOut' | 'fit' | 'pan' | 'undo' | 'redo' | 'comment' | 'group' | 'export' | 'grid';
type SepKey = `sep${1 | 2 | 3 | 4}`;
interface BtnDef {
  key: BtnKey | SepKey;
  icon: LucideIcon;
  label: keyof typeof I18N;
  shortcut?: string;
}

const BUTTONS: BtnDef[] = [
  { key: 'undo', icon: Undo2, label: 'undo', shortcut: 'Ctrl+Z' },
  { key: 'redo', icon: Redo2, label: 'redo', shortcut: 'Ctrl+Y' },
  { key: 'sep1', icon: Grid3x3, label: 'grid' },
  { key: 'zoomOut', icon: ZoomOut, label: 'zoomOut', shortcut: '−' },
  { key: 'zoomIn', icon: ZoomIn, label: 'zoomIn', shortcut: '+' },
  { key: 'fit', icon: Maximize2, label: 'fit', shortcut: 'F' },
  { key: 'sep2', icon: Grid3x3, label: 'grid' },
  { key: 'pan', icon: Hand, label: 'pan' },
  { key: 'sep3', icon: Grid3x3, label: 'grid' },
  { key: 'comment', icon: MessageSquarePlus, label: 'comment' },
  { key: 'group', icon: Layers, label: 'group' },
  { key: 'sep4', icon: Grid3x3, label: 'grid' },
  { key: 'export', icon: Download, label: 'export' },
];

/* ========== Props ========== */
export interface CanvasBottomBarProps {
  locale?: string;
  zoom?: number;
  panActive?: boolean;
  gridVisible?: boolean;
  onZoomChange?: (zoom: number) => void;
  onFit?: () => void;
  onTogglePan?: () => void;
  onToggleGrid?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddComment?: () => void;
  onGroupNodes?: () => void;
  onExport?: () => void;
}

/**
 * 画布底部工具栏
 * - 缩放控制 / 手型平移 / 撤销重做 / 注释 / 分组 / 导出JSON
 * - 按钮 hover 浮现蓝紫渐变底色 + tooltip
 * - 纯本地 state 交互，不调用后端
 */
export default function CanvasBottomBar({
  locale = 'en',
  zoom = 100,
  panActive = false,
  gridVisible = true,
  onZoomChange,
  onFit,
  onTogglePan,
  onToggleGrid,
  onUndo,
  onRedo,
  onAddComment,
  onGroupNodes,
  onExport,
}: CanvasBottomBarProps) {
  /* — 空接口预留：真实环境对接后端 undo/redo 历史栈 — */
  const _apiFetchHistory = async () => {
    // TODO: 对接后端历史记录接口
  };

  const handleZoomIn = () => onZoomChange?.(Math.min(200, zoom + 10));
  const handleZoomOut = () => onZoomChange?.(Math.max(25, zoom - 10));

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 pointer-events-auto">
      <div
        className={[
          'h-11 px-2 rounded-2xl flex items-center gap-1',
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl',
          'border border-gray-200/80 dark:border-gray-800/80',
          'shadow-2xl shadow-black/10',
        ].join(' ')}
      >
        {BUTTONS.map((b, i) => {
          /* — 分隔符 — */
          if ((b.key as string).startsWith('sep')) {
            return (
              <div
                key={`sep-${i}`}
                className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1 first:hidden last:hidden"
              />
            );
          }

          const Icon = b.icon;
          const onClick = {
            zoomIn: handleZoomIn,
            zoomOut: handleZoomOut,
            fit: onFit,
            pan: onTogglePan,
            grid: onToggleGrid,
            undo: onUndo,
            redo: onRedo,
            comment: onAddComment,
            group: onGroupNodes,
            export: onExport,
          }[b.key as BtnKey];

          /* — 特殊：网格按钮（中间分隔符后的第一个真实按钮才是网格切换） — */
          if (b.key === 'grid') return null;
          /* — 特殊：分隔符后面第一个，即索引2的位置，插入网格按钮 — */
          if (i === 2) {
            return (
              <ToolButton
                key="grid-btn"
                Icon={Grid3x3}
                label={pick(locale, I18N.grid)}
                active={gridVisible}
                onClick={onToggleGrid}
              />
            );
          }

          const isActive = b.key === 'pan' ? panActive : false;
          return (
            <ToolButton
              key={b.key}
              Icon={Icon}
              label={pick(locale, I18N[b.label] as Record<string, string>)}
              shortcut={b.shortcut}
              onClick={onClick}
              active={isActive}
            />
          );
        })}

        {/* — 缩放比例显示 — */}
        <div className="h-7 pl-2 ml-1 border-l border-gray-200 dark:border-gray-800 flex items-center gap-1.5 pr-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {pick(locale, I18N.zoomPct)}
          </span>
          <span className="text-[12px] font-bold tabular-nums text-gray-800 dark:text-gray-200 min-w-[38px] text-center">
            {zoom}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ========== 子组件：工具栏按钮（带渐变hover + tooltip） ========== */
function ToolButton({
  Icon,
  label,
  shortcut,
  onClick,
  active,
}: {
  Icon: LucideIcon;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={[
          'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150',
          active
            ? 'bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 text-white shadow-md shadow-indigo-500/30 scale-[1.05]'
            : 'text-gray-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-indigo-500 hover:via-blue-500 hover:to-violet-500 hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.96]',
        ].join(' ')}
      >
        <Icon className="w-[17px] h-[17px]" strokeWidth={1.9} />
      </button>

      {/* — Tooltip 悬浮提示 — */}
      <div
        className={[
          'absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 rounded-lg',
          'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
          'text-[11px] font-medium whitespace-nowrap shadow-xl',
          'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-150 z-50',
        ].join(' ')}
      >
        {label}
        {shortcut && (
          <span className="ml-2 px-1.5 py-0.5 rounded bg-white/10 dark:bg-gray-200 text-[10px] font-mono">
            {shortcut}
          </span>
        )}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1.5 h-1.5 rotate-45 bg-gray-900 dark:bg-white" />
      </div>
    </div>
  );
}
