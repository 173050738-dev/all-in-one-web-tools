'use client';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type Connection,
  type Node,
  type NodeTypes,
  type NodeChange,
  type EdgeChange,
  type ReactFlowInstance,
  type BackgroundVariant,
} from '@xyflow/react';
import { shallow } from 'zustand/shallow';
import '@xyflow/react/dist/style.css';
import {
  Play,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Settings,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { flowNodeTypes } from './FlowNodes';
import ToolPalette from './ToolPalette';
import StepInspector from './StepInspector';
import {
  useWorkflowCanvasStore,
} from '@/stores/workflow-canvas';
import type {
  FlowNode,
  FlowEdge,
  FlowNodeData,
} from '@/types/workflow-canvas';
import type { ToolExecutorMeta } from '@/lib/workflow-tool-registry';
import { getToolMeta } from '@/lib/workflow-tool-registry';
import { WorkflowExecutor, type ExecutionEvent } from '@/lib/workflow-executor';

const nodeTypes: NodeTypes = flowNodeTypes as any;

const T = {
  run: {
    zh: '运行',
    en: 'Run',
    fr: 'Exécuter',
    es: 'Ejecutar',
    hi: 'चलाएं',
    ar: 'تشغيل',
  },
  stop: {
    zh: '停止',
    en: 'Stop',
    fr: 'Arrêter',
    es: 'Detener',
    hi: 'रोकें',
    ar: 'إيقاف',
  },
  reset: {
    zh: '重置',
    en: 'Reset',
    fr: 'Réinitialiser',
    es: 'Reiniciar',
    hi: 'रीसेट',
    ar: 'إعادة تعيين',
  },
  fit: {
    zh: '适应画布',
    en: 'Fit View',
    fr: 'Adapter',
    es: 'Ajustar',
    hi: 'फिट करें',
    ar: 'ملاءمة',
  },
  statusIdle: {
    zh: '就绪',
    en: 'Ready',
    fr: 'Prêt',
    es: 'Listo',
    hi: 'तैयार',
    ar: 'جاهز',
  },
  statusRunning: {
    zh: '执行中…',
    en: 'Running…',
    fr: 'En cours…',
    es: 'En curso…',
    hi: 'चल रहा है…',
    ar: 'قيد التنفيذ…',
  },
  statusSuccess: {
    zh: '完成',
    en: 'Done',
    fr: 'Terminé',
    es: 'Completado',
    hi: 'पूर्ण',
    ar: 'اكتمل',
  },
  progress: {
    zh: '进度',
    en: 'Progress',
    fr: 'Progrès',
    es: 'Progreso',
    hi: 'प्रगति',
    ar: 'التقدم',
  },
  toolsPanel: {
    zh: '工具',
    en: 'Tools',
    fr: 'Outils',
    es: 'Herramientas',
    hi: 'टूल्स',
    ar: 'الأدوات',
  },
  inspectorPanel: {
    zh: '属性',
    en: 'Inspector',
    fr: 'Inspecteur',
    es: 'Inspector',
    hi: 'निरीक्षक',
    ar: 'المفتش',
  },
  dragHint: {
    zh: '从左侧面板拖入工具',
    en: 'Drag tools from left panel',
    fr: 'Glissez des outils',
    es: 'Arrastra herramientas',
    hi: 'टूल्स खींचें',
    ar: 'اسحب الأدوات',
  },
};

function t(locale: string, key: keyof typeof T): string {
  return (T[key] as any)[locale] || T[key].en;
}

interface WorkflowCanvasProps {
  locale?: string;
  initialNodes?: FlowNode[];
  initialEdges?: FlowEdge[];
  workflowId?: string;
  onSave?: (data: { nodes: FlowNode[]; edges: FlowEdge[] }) => void;
  readOnly?: boolean;
}

const DEFAULT_START_NODE: FlowNode = {
  id: 'node_start',
  type: 'start',
  position: { x: 40, y: 200 },
  data: {
    kind: 'start',
    title: 'Start',
  } as any,
};

const DEFAULT_END_NODE: FlowNode = {
  id: 'node_end',
  type: 'end',
  position: { x: 620, y: 200 },
  data: {
    kind: 'end',
    title: 'End',
    status: 'idle',
  } as any,
};

const DEFAULT_EDGE: FlowEdge = {
  id: 'edge_start_end',
  source: 'node_start',
  target: 'node_end',
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#cbd5e1', strokeWidth: 2 },
};

export default function WorkflowCanvas({
  locale = 'en',
  initialNodes,
  initialEdges,
  workflowId,
  onSave,
  readOnly = false,
}: WorkflowCanvasProps) {
  // Single source of truth: Zustand store
  const [
    nodes,
    edges,
    selectedNodeId,
    nodeStatuses,
    setStoreNodes,
    setStoreEdges,
    updateNode,
    updateNodeData,
    selectNode,
    selectEdge,
    setWorkflowId,
    setExecutor,
    setNodeStatus,
    setCurrentRun,
    clearNodeStatuses,
    setIsRunning,
  ] = useWorkflowCanvasStore(
    (s) => [
      s.nodes,
      s.edges,
      s.selectedNodeId,
      s.nodeStatuses,
      s.setNodes,
      s.setEdges,
      s.updateNode,
      s.updateNodeData,
      s.selectNode,
      s.selectEdge,
      s.setWorkflowId,
      s.setExecutor,
      s.setNodeStatus,
      s.setCurrentRun,
      s.clearNodeStatuses,
      s.setIsRunning,
    ],
    shallow
  );

  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [runProgress, setRunProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const executorRef = useRef<WorkflowExecutor | null>(null);
  const didInitRef = useRef(false);
  const [mobile, setMobile] = useState(false);

  // Initial hydration from props or defaults -> Zustand (runs ONCE)
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const startNodes: FlowNode[] =
      (initialNodes && initialNodes.length > 0)
        ? initialNodes
        : (nodes && nodes.length > 0)
        ? nodes
        : [DEFAULT_START_NODE, DEFAULT_END_NODE];
    const startEdges: FlowEdge[] =
      (initialEdges && initialEdges.length > 0)
        ? initialEdges
        : (edges && edges.length > 0)
        ? edges
        : [DEFAULT_EDGE];

    setStoreNodes(startNodes);
    setStoreEdges(startEdges);
    if (workflowId) setWorkflowId(workflowId);

    setTimeout(() => fitView({ padding: 0.2, duration: 200 }), 50);

    return () => {
      if (executorRef.current) executorRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile detection
  useEffect(() => {
    const check = () => {
      if (typeof window !== 'undefined') setMobile(window.innerWidth < 768);
    };
    check();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
  }, []);

  // Node / Edge change handlers -> write directly to Zustand
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setStoreNodes(applyNodeChanges(changes, nodes as any[]) as FlowNode[]);
    },
    [nodes, setStoreNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setStoreEdges(applyEdgeChanges(changes, edges as any[]) as FlowEdge[]);
    },
    [edges, setStoreEdges]
  );

  const onConnect = useCallback(
    (conn: Connection) =>
      setStoreEdges(
        addEdge(
          {
            ...conn,
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            animated: false,
          } as any,
          edges as any[]
        ) as FlowEdge[]
      ),
    [edges, setStoreEdges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (readOnly) return;
      const slug = e.dataTransfer.getData('application/tool-slug');
      if (!slug) return;
      const meta = getToolMeta(slug);
      if (!meta) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addToolNode(meta, position.x, position.y);
    },
    [screenToFlowPosition, readOnly]
  );

  const addToolNode = useCallback(
    (meta: ToolExecutorMeta, x?: number, y?: number) => {
      if (readOnly) return;
      const count = (nodes as any[]).filter((n) => n.type === 'tool').length;
      const id = `node_tool_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      let posX = x;
      let posY = y;
      if (posX == null || posY == null) {
        posX = 300 + count * 40;
        posY = 200 + (count % 3) * 120;
      }
      const newNode: FlowNode = {
        id,
        type: 'tool',
        position: { x: posX, y: posY },
        data: {
          kind: 'tool',
          toolSlug: meta.slug,
          title: meta.name,
          description: (meta as any).description || '',
          status: 'idle',
          config: { ...meta.config },
        } as any,
      };
      setStoreNodes([...(nodes as FlowNode[]), newNode]);
    },
    [readOnly, nodes, setStoreNodes]
  );

  const handleToolPaletteDragStart = useCallback(
    (e: React.DragEvent, meta: ToolExecutorMeta) => {
      e.dataTransfer.setData('application/tool-slug', meta.slug);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleSelectNode = useCallback(
    (id: string) => {
      selectNode(id);
      if (mobile) setRightOpen(true);
    },
    [selectNode, mobile]
  );

  const onNodeClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      handleSelectNode(node.id);
    },
    [handleSelectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  // updateNode wrapper that writes to Zustand data.status directly
  const updateNodeStatus = useCallback(
    (nodeId: string, status: string, error?: string) => {
      const patch: Record<string, unknown> = { status };
      if (error !== undefined) patch.error = error;
      updateNodeData(nodeId, patch);
    },
    [updateNodeData]
  );

  const handleResetStatus = useCallback(() => {
    (nodes as FlowNode[]).forEach((n) => {
      if (n.data && ('status' in n.data)) {
        updateNodeData(n.id, { status: 'idle', error: undefined });
      }
    });
    clearNodeStatuses();
    setRunStatus('idle');
    setRunProgress({ done: 0, total: 0 });
    executorRef.current = null;
    setExecutor(null);
  }, [nodes, updateNodeData, clearNodeStatuses, setExecutor]);

  const handleExecutionEvent = useCallback(
    (event: ExecutionEvent) => {
      switch (event.type) {
        case 'step-start':
          setRunStatus('running');
          updateNodeStatus(event.nodeId, 'running');
          setNodeStatus(event.nodeId, 'running');
          break;
        case 'step-success':
          updateNodeStatus(event.nodeId, 'success');
          setNodeStatus(event.nodeId, 'success');
          break;
        case 'step-failed':
          updateNodeStatus(event.nodeId, 'failed', event.error);
          setNodeStatus(event.nodeId, 'failed');
          break;
        case 'step-waiting':
          break;
        case 'progress':
          setRunProgress({ done: event.completed, total: event.total });
          break;
        case 'complete':
          setRunStatus(event.record.status === 'success' ? 'success' : 'failed');
          setCurrentRun(event.record);
          break;
        case 'error':
          setRunStatus('failed');
          break;
      }
    },
    [updateNodeStatus, setNodeStatus, setCurrentRun]
  );

  const handleRun = useCallback(async () => {
    if (runStatus === 'running') return;
    handleResetStatus();
    await new Promise((r) => setTimeout(r, 50));
    setRunStatus('running');

    const toolCount = (nodes as FlowNode[]).filter((n) => n.type === 'tool').length;
    setRunProgress({ done: 0, total: toolCount });

    const executor = new WorkflowExecutor(
      nodes as FlowNode[],
      edges as FlowEdge[],
      handleExecutionEvent
    );
    executorRef.current = executor;
    setExecutor(executor);
    setIsRunning(true);

    try {
      const record = await executor.run(workflowId || 'inline-workflow');
      if (!record) {
        setRunStatus('idle');
      } else if (record.status === 'failed') {
        setRunStatus('failed');
      }
      onSave?.({ nodes: nodes as FlowNode[], edges: edges as FlowEdge[] });
    } catch (_e) {
      setRunStatus('failed');
    } finally {
      setIsRunning(false);
    }
  }, [
    runStatus,
    handleResetStatus,
    nodes,
    edges,
    workflowId,
    handleExecutionEvent,
    onSave,
    setExecutor,
    setIsRunning,
  ]);

  const handleStop = useCallback(() => {
    if (executorRef.current) {
      executorRef.current.abort();
      executorRef.current = null;
      setExecutor(null);
    }
    setRunStatus('idle');
    setRunProgress({ done: 0, total: 0 });
    handleResetStatus();
  }, [handleResetStatus, setExecutor]);

  const handleSaveSnapshot = useCallback(() => {
    onSave?.({ nodes: nodes as FlowNode[], edges: edges as FlowEdge[] });
  }, [onSave, nodes, edges]);

  const progressPct =
    runProgress.total > 0 ? Math.round((runProgress.done / runProgress.total) * 100) : 0;

  const executor = executorRef.current;

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Toolbar */}
      <div className="h-12 sm:h-14 flex items-center gap-2 px-2 sm:px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <button
          onClick={() => setLeftOpen((v) => !v)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          title={t(locale, 'toolsPanel')}
        >
          {leftOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <LayoutGrid className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          {(runStatus as string) === 'running' || (runStatus as string) === 'success' ? (
            <div className="flex items-center gap-2 flex-1 max-w-sm mx-auto">
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    (runStatus as string) === 'success'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gradient-to-r from-primary-400 to-primary-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-medium tabular-nums text-gray-600 dark:text-gray-300 w-16 text-right">
                {runProgress.done}/{runProgress.total}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/60">
              {(runStatus as string) === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (runStatus as string) === 'failed' ? (
                <Info className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Info className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {(runStatus as string) === 'idle'
                  ? t(locale, 'statusIdle')
                  : (runStatus as string) === 'running'
                  ? t(locale, 'statusRunning')
                  : t(locale, 'statusSuccess')}
              </span>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => zoomOut()}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomIn()}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2, duration: 200 })}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={t(locale, 'fit')}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:border-gray-700 mx-1 hidden sm:block" />

        {runStatus !== 'idle' && (
          <button
            onClick={handleResetStatus}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={t(locale, 'reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {(runStatus as string) === 'running' ? (
          <button
            onClick={handleStop}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/25 flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{t(locale, 'stop')}</span>
          </button>
        ) : (
          <button
            onClick={handleRun}
            disabled={readOnly}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm shadow-primary-500/25 flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
          >
            {(runStatus as string) === 'running' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {t(locale, 'run')}
          </button>
        )}

        <button
          onClick={() => setRightOpen((v) => !v)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          title={t(locale, 'inspectorPanel')}
        >
          {rightOpen ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left: Tool Palette */}
        {leftOpen && !readOnly && (
          <div className={`${mobile ? 'absolute left-0 top-0 bottom-0 shadow-lg' : ''} w-60 sm:w-64 md:w-72 flex-shrink-0 h-full overflow-hidden border-r border-gray-200 dark:border-gray-700 z-20 md:static bg-white dark:bg-gray-800`}>
            <ToolPalette
              locale={locale}
              onAddNode={(meta) => addToolNode(meta)}
              onDragStart={handleToolPaletteDragStart}
              showCloseButton={mobile}
              onClose={() => setLeftOpen(false)}
            />
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 min-w-0 h-full relative">
          <ReactFlow<any>
            nodes={nodes as any}
            edges={edges as any}
            nodeTypes={nodeTypes as any}
            onNodesChange={onNodesChange as any}
            onEdgesChange={onEdgesChange as any}
            onConnect={onConnect as any}
            onInit={setRfInstance as any}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick as any}
            onPaneClick={onPaneClick}
            fitView
            attributionPosition="bottom-right"
            proOptions={{ hideAttribution: true }}
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable={!readOnly}
            panOnDrag
            zoomOnScroll
            panOnScroll={false}
            minZoom={0.2}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#94a3b8', strokeWidth: 2 },
            }}
            className="touch-none"
          >
            <Background
              variant={'dots' as BackgroundVariant}
              gap={20}
              size={1}
              color="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
            <Controls
              showInteractive={false}
              className="!absolute !bottom-3 !left-3 !rounded-xl !border !border-gray-200 dark:!border-gray-700 !shadow-md !overflow-hidden [&>button]:!w-9 [&>button]:!h-9 [&>button]:!bg-white dark:[&>button]:!bg-gray-800 [&>button]:!border-0 [&>button]:!border-b [&>button]:!border-gray-200 dark:[&>button]:!border-gray-700 last:[&>button]:!border-b-0"
            />
            <div className="hidden md:block">
              <MiniMap
                pannable
                zoomable
                nodeStrokeWidth={2}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  width: 160,
                  height: 110,
                  borderRadius: 12,
                  border: '1px solid',
                  borderColor: 'rgb(226 232 240)',
                  background: 'white',
                  overflow: 'hidden',
                }}
                className="dark:[&>svg]:!bg-gray-800 [&>svg]:bg-white"
                maskColor="rgba(148,163,184,0.12)"
                nodeColor={(n) => {
                  if (n.type === 'start') return '#10b981';
                  if (n.type === 'end') return '#f43f5e';
                  const status = (n.data as any)?.status;
                  if (status === 'running') return '#6366f1';
                  if (status === 'success') return '#10b981';
                  if (status === 'failed') return '#ef4444';
                  return '#818cf8';
                }}
                nodeStrokeColor="white"
              />
            </div>
          </ReactFlow>

          {!leftOpen && !mobile && !readOnly && (
            <div
              className="absolute top-3 left-12 z-10 px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pointer-events-none"
            >
              <LayoutGrid className="w-3 h-3" />
              {t(locale, 'dragHint')}
            </div>
          )}
        </div>

        {/* Right: Inspector — pure props, no direct Zustand subscription */}
        {rightOpen && (
          <div className={`${mobile ? 'absolute right-0 top-0 bottom-0 shadow-lg' : ''} w-64 sm:w-72 md:w-80 flex-shrink-0 h-full overflow-hidden border-l border-gray-200 dark:border-gray-700 z-20 md:static bg-white dark:bg-gray-800`}>
            <StepInspector
              locale={locale}
              showCloseButton={mobile}
              onClose={() => setRightOpen(false)}
              executorRef={executorRef as any}
              nodes={nodes as any[]}
              selectedNodeId={selectedNodeId}
              onUpdateNode={updateNode}
              onUpdateNodeData={updateNodeData}
              nodeStatuses={nodeStatuses}
              executor={executor as any}
            />
          </div>
        )}

        {/* Mobile overlay mask when sidebar is open */}
        {mobile && (leftOpen || rightOpen) && (
          <div
            className="md:hidden absolute inset-0 bg-black/30 backdrop-blur-[1px] z-10"
            onClick={() => {
              setLeftOpen(false);
              setRightOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
