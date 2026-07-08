'use client';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Play,
  Flag,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  SkipForward,
  Circle,
  ExternalLink,
  Code,
} from 'lucide-react';
import type { FlowNode } from '@/types/workflow-canvas';
import { getToolBySlug } from '@/data/tools';
import { useWorkflowCanvasStore } from '@/stores/workflow-canvas';

const STATUS_STYLES: Record<string, { ring: string; bg: string; icon: any }> = {
  idle: {
    ring: 'ring-gray-200 dark:ring-gray-700',
    bg: 'bg-white dark:bg-gray-800',
    icon: Circle,
  },
  running: {
    ring: 'ring-primary-300 dark:ring-primary-600',
    bg: 'bg-primary-50/60 dark:bg-primary-900/20',
    icon: Loader2,
  },
  success: {
    ring: 'ring-green-300 dark:ring-green-700',
    bg: 'bg-green-50/60 dark:bg-green-900/20',
    icon: CheckCircle2,
  },
  failed: {
    ring: 'ring-red-300 dark:ring-red-700',
    bg: 'bg-red-50/60 dark:bg-red-900/20',
    icon: XCircle,
  },
  skipped: {
    ring: 'ring-yellow-300 dark:ring-yellow-700',
    bg: 'bg-yellow-50/60 dark:bg-yellow-900/20',
    icon: SkipForward,
  },
};

const STATUS_COLORS: Record<string, string> = {
  idle: 'text-gray-400 dark:text-gray-500',
  running: 'text-primary-500',
  success: 'text-green-500',
  failed: 'text-red-500',
  skipped: 'text-yellow-500',
};

export const StartNode = memo(function StartNode(props: NodeProps<any>) {
  const { selected } = props;
  return (
    <div
      className={`relative w-[200px] sm:w-[220px] rounded-xl border shadow-sm ring-2 transition-all ${
        selected
          ? 'ring-primary-400 border-primary-300 shadow-primary-100'
          : 'ring-emerald-200 dark:ring-emerald-800 border-emerald-200 dark:border-emerald-800'
      } bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30`}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ visibility: 'hidden' }}
      />
      <div className="p-3 sm:p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Start
            </div>
            <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 truncate">
              Trigger Workflow
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-gray-900"
      />
    </div>
  );
});

export const EndNode = memo(function EndNode(props: NodeProps<FlowNode>) {
  const { selected, data } = props;
  const status = data.kind === 'end' ? data.status : 'idle';
  const style = STATUS_STYLES[status] || STATUS_STYLES.idle;
  const StatusIcon = style.icon;
  return (
    <div
      className={`relative w-[200px] sm:w-[220px] rounded-xl border shadow-sm ring-2 transition-all ${
        selected
          ? 'ring-primary-400 border-primary-300'
          : `ring-rose-200 dark:ring-rose-800 border-rose-200 dark:border-rose-800 ${style.bg}`
      } bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-rose-500 !border-2 !border-white dark:!border-gray-900"
      />
      <div className="p-3 sm:p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 flex-shrink-0">
            <Flag className="w-4 h-4 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold">
              End
            </div>
            <div className="text-sm font-semibold text-rose-900 dark:text-rose-100 truncate flex items-center gap-1.5">
              Workflow Complete
              {status !== 'idle' && (
                <StatusIcon
                  className={`w-3.5 h-3.5 ${STATUS_COLORS[status]} ${
                    status === 'running' ? 'animate-spin' : ''
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
});

export const ToolNode = memo(function ToolNode(props: NodeProps<any>) {
  const { id, selected, data } = props;
  const removeNode = useWorkflowCanvasStore((s) => s.removeNode);
  const selectNode = useWorkflowCanvasStore((s) => s.selectNode);
  if (data.kind !== 'tool') return null;

  const status = data.status;
  const style = STATUS_STYLES[status] || STATUS_STYLES.idle;
  const StatusIcon = style.icon;
  const tool = getToolBySlug(data.toolSlug);
  const hasExternal = !!tool?.externalUrl;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNode(id);
  };

  const leftAccentColor = tool?.category
    ? getCategoryAccent(tool.category)
    : 'bg-primary-500';

  return (
    <div
      className={`group relative w-[240px] sm:w-[260px] rounded-xl shadow-sm ring-2 transition-all ${
        selected
          ? 'ring-primary-400 border-primary-300 shadow-lg shadow-primary-100 scale-[1.01]'
          : `${style.ring} border-gray-200 dark:border-gray-700 hover:shadow-md`
      } ${style.bg}`}
      onClick={() => selectNode(id)}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${leftAccentColor}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-gray-400 dark:!bg-gray-500 !border-2 !border-white dark:!border-gray-900 !-left-[7px]"
      />
      <div className="p-3 sm:p-3.5 pl-4">
        <div className="flex items-start gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              status === 'running'
                ? 'bg-primary-100 dark:bg-primary-900/40'
                : status === 'success'
                ? 'bg-green-100 dark:bg-green-900/40'
                : status === 'failed'
                ? 'bg-red-100 dark:bg-red-900/40'
                : 'bg-gray-100 dark:bg-gray-700/60'
            }`}
          >
            <Code
              className={`w-4 h-4 ${
                status === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : status === 'failed'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-primary-600 dark:text-primary-400'
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  {tool?.category || 'Tool'}
                  {hasExternal && (
                    <ExternalLink className="w-2.5 h-2.5 inline ml-1 -translate-y-px opacity-60" />
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {data.title || tool?.name || 'Step'}
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <div
                  className={`w-5 h-5 flex items-center justify-center ${STATUS_COLORS[status]}`}
                >
                  <StatusIcon
                    className={`w-4 h-4 ${status === 'running' ? 'animate-spin' : ''}`}
                  />
                </div>
                <button
                  onClick={handleDelete}
                  className="w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete step"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            {data.description && (
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>
        </div>
        {data.error && (
          <div className="mt-2 px-2 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-[11px] text-red-600 dark:text-red-400 line-clamp-2">
            {data.error}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary-500 !border-2 !border-white dark:!border-gray-900 !-right-[7px]"
      />
    </div>
  );
});

function getCategoryAccent(category: string): string {
  const map: Record<string, string> = {
    security: 'bg-emerald-500',
    developer: 'bg-blue-500',
    designer: 'bg-pink-500',
    'content-creator': 'bg-orange-500',
    'office-worker': 'bg-violet-500',
    student: 'bg-cyan-500',
    'video-creator': 'bg-rose-500',
  };
  return map[category] || 'bg-primary-500';
}

export const flowNodeTypes = {
  start: StartNode,
  tool: ToolNode,
  end: EndNode,
};
