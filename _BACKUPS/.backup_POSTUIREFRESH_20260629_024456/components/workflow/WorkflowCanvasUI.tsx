'use client';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  Save,
  Play,
  Search,
  UserCircle2,
  Crown,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import WorkflowLeftSider from './WorkflowLeftSider';
import ConfigDrawer from './ConfigDrawer';
import CanvasBottomBar from './CanvasBottomBar';
import {
  WorkflowNodeCard,
  WorkflowEmptyState,
  WorkflowNodeSkeleton,
  type WorkflowNodeData,
} from './WorkflowNode';

/* ========== i18n ========== */
const I18N = {
  brand: { zh: '自动化工作流 · Korelyy Flow', en: 'Automation Studio · Korelyy Flow', fr: 'Studio Auto · Korelyy Flow', es: 'Estudio Auto · Korelyy Flow', hi: 'स्टूडियो · Korelyy Flow', ar: 'استوديو · Korelyy Flow' },
  search: { zh: '搜索工具 / 模板 / 工作流…', en: 'Search tools / templates / workflows…', fr: 'Rechercher…', es: 'Buscar…', hi: 'खोजें…', ar: 'بحث…' },
  save: { zh: '保存', en: 'Save', fr: 'Enregistrer', es: 'Guardar', hi: 'सहेजें', ar: 'حفظ' },
  run: { zh: '运行工作流', en: 'Run Workflow', fr: 'Exécuter', es: 'Ejecutar', hi: 'चलाएं', ar: 'تشغيل' },
  member: { zh: 'Pro 会员', en: 'Pro Plan', fr: 'Plan Pro', es: 'Plan Pro', hi: 'प्रो प्लान', ar: 'خطة برو' },
  loading: { zh: '画布加载中…', en: 'Loading canvas…', fr: 'Chargement…', es: 'Cargando…', hi: 'लोड हो रहा है…', ar: 'جار التحميل…' },
  mobileList: { zh: '步骤列表视图（移动优化）', en: 'Step List (Mobile)', fr: 'Liste Étapes', es: 'Lista Pasos', hi: 'स्टेप लिस्ट', ar: 'قائمة الخطوات' },
  stepCount: { zh: '共 {n} 个步骤', en: '{n} Steps Total', fr: '{n} étapes', es: '{n} Pasos', hi: '{n} चरण', ar: '{n} خطوات' },
  titlePlaceholder: { zh: '未命名工作流', en: 'Untitled Workflow', fr: 'Workflow sans titre', es: 'Flujo sin título', hi: 'अनाम वर्कफ़्लो', ar: 'تدفق عمل بدون عنوان' },
};

type LocaleKey = keyof typeof I18N.brand;
const pick = (l: string, m: Record<string, string>) => m[l as LocaleKey] || m.en;

/* ========== 初始节点 Demo 数据 ========== */
const INITIAL_NODES: WorkflowNodeData[] = [
  {
    id: 'n-start',
    kind: 'start',
    title: '开始',
    status: 'success',
    posX: 60,
    posY: 240,
  },
  {
    id: 'n-1',
    kind: 'tool',
    category: 'developer',
    title: 'Base64 编解码',
    subtitle: '输入字符串 → 输出 Base64 结果，本地纯前端处理',
    status: 'success',
    posX: 320,
    posY: 160,
  },
  {
    id: 'n-2',
    kind: 'condition',
    title: '长度>10?',
    subtitle: 'Base64结果长度 > 10字符',
    status: 'running',
    posX: 620,
    posY: 200,
  },
  {
    id: 'n-3',
    kind: 'tool',
    category: 'content-creator',
    title: '二维码生成',
    subtitle: '文本或 URL → 高清二维码图片',
    status: 'idle',
    posX: 940,
    posY: 100,
  },
  {
    id: 'n-4',
    kind: 'tool',
    category: 'designer',
    title: '图片压缩 + 水印',
    subtitle: '外链 Photopea 自动打开处理',
    status: 'idle',
    posX: 940,
    posY: 320,
  },
  {
    id: 'n-end',
    kind: 'end',
    title: '完成',
    status: 'idle',
    posX: 1260,
    posY: 240,
  },
];

/* ========== Props ========== */
export interface WorkflowCanvasUIProps {
  locale?: string;
  initialLoading?: boolean;
}

/**
 * 工作流画布主页组件（单一集成）
 * - 三栏布局：左导航 / 中画布 / 右配置抽屉
 * - 顶部全局导航：品牌窄光带 / 搜索 / 保存 / 运行 / 用户入口
 * - 响应式：PC三栏 / 平板左栏折叠 / 移动端隐藏画布 → 步骤列表
 * - 纯客户端 React state，不耦合后端执行服务
 */
export default function WorkflowCanvasUI({
  locale = 'en',
  initialLoading = true,
}: WorkflowCanvasUIProps) {
  /* ------------------------------ 全局状态 ------------------------------ */
  /* — 空接口预留：真实环境对接后端拉取工作流详情 — */
  const _apiFetchWorkflowDetail = async () => {
    // TODO: 对接后端 /api/workflow/:slug 拉取详情，暂不实现
  };

  /* — 布局控制 — */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [loading, setLoading] = useState(initialLoading);
  const [activeMenu, setActiveMenu] = useState('myFlows');
  const [viewport, setViewport] = useState<{ w: number; h: number; isMobile: boolean; isTablet: boolean }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: false,
    isTablet: false,
  });

  /* — 画布控制 — */
  const [panActive, setPanActive] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n-2');
  const [testState, setTestState] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  /* — 节点数据 — */
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(() => INITIAL_NODES);

  /* — 拖拽相关 — */
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  /* ------------------------------ 生命周期：加载骨架屏 ------------------------------ */
  useEffect(() => {
    if (!initialLoading) return;
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [initialLoading]);

  /* ------------------------------ 响应式断点监听 ------------------------------ */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setViewport({
        w,
        h: window.innerHeight,
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
      });
      if (w < 1024) setLeftCollapsed(true);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ------------------------------ 节点操作方法（单一职责函数） ------------------------------ */
  const selectedNode = useMemo<WorkflowNodeData | null>(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(id);
    setDrawerOpen(true);
  }, []);

  const handleUpdateNode = useCallback(
    (patch: Partial<WorkflowNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((prev) => prev.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n)));
    },
    [selectedNodeId]
  );

  const handleCopyNode = useCallback(() => {
    if (!selectedNode) return;
    const copy: WorkflowNodeData = {
      ...selectedNode,
      id: `copy-${Date.now().toString(36)}`,
      posX: selectedNode.posX + 40,
      posY: selectedNode.posY + 40,
      status: 'idle',
    };
    setNodes((prev) => [...prev, copy]);
    setSelectedNodeId(copy.id);
  }, [selectedNode]);

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  const handleAddBranch = useCallback(
    (id: string) => {
      const parent = nodes.find((n) => n.id === id);
      if (!parent) return;
      const branch: WorkflowNodeData = {
        id: `br-${Date.now().toString(36)}`,
        kind: 'condition',
        title: '新分支条件',
        status: 'idle',
        posX: parent.posX + 320,
        posY: parent.posY + 60,
      };
      setNodes((prev) => [...prev, branch]);
    },
    [nodes]
  );

  const handleAddFirst = useCallback(() => {
    const first: WorkflowNodeData = {
      id: `n-${Date.now().toString(36)}`,
      kind: 'tool',
      category: 'developer',
      title: pick(locale, I18N.titlePlaceholder),
      subtitle: '',
      status: 'idle',
      posX: 360,
      posY: 240,
    };
    setNodes([first]);
    setSelectedNodeId(first.id);
    setDrawerOpen(true);
  }, [locale]);

  /* ------------------------------ 拖拽移动（纯本地state，不发后端） ------------------------------ */
  const onNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const target = nodes.find((n) => n.id === id);
    if (!target) return;
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: target.posX,
      origY: target.posY,
    };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (ev.clientX - dragRef.current.startX) * (100 / zoom);
      const dy = (ev.clientY - dragRef.current.startY) * (100 / zoom);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragRef.current?.id
            ? { ...n, posX: dragRef.current.origX + dx, posY: dragRef.current.origY + dy }
            : n
        )
      );
    };
    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [nodes, zoom]);

  /* ------------------------------ 节点 hover 同步 ------------------------------ */
  const handleHoverChange = useCallback((id: string, isHover: boolean) => {
    setHoverNodeId(isHover ? id : (cur) => (cur === id ? null : cur));
  }, []);

  /* ------------------------------ 测试节点运行（纯前端mock） ------------------------------ */
  const handleRunTest = useCallback(() => {
    setTestState('running');
    setTimeout(() => setTestState(Math.random() > 0.2 ? 'success' : 'error'), 1200);
  }, []);

  /* ------------------------------ 视口 & 画布缩放 ------------------------------ */
  const handleFit = useCallback(() => setZoom(100), []);

  /* ------------------------------ 移动端：步骤列表视图 ------------------------------ */
  const isMobile = viewport.isMobile;

  /* ============================================================
   * 渲染
   * ============================================================ */
  if (loading) {
    return <LoadingScaffold locale={locale} />;
  }

  /* — 移动端：转为步骤列表视图，避免画布挤压错乱 — */
  if (isMobile) {
    return (
      <MobileStepList
        locale={locale}
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={handleSelectNode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
        onCopyNode={handleCopyNode}
        onDeleteNode={handleDeleteNode}
        testState={testState}
        onRunTest={handleRunTest}
      />
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* ============================================================
       * ① 顶部全局导航（轻薄、无厚重色块 + 蓝紫窄光带）
       * ============================================================ */}
      <header className="relative h-[60px] flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-30">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-70" />
        <div className="h-full px-4 flex items-center gap-3">
          {/* — 左：品牌名称 — */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.1} />
            </div>
            <div className="min-w-0 hidden sm:block">
              <div className="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate tracking-tight">
                {pick(locale, I18N.brand)}
              </div>
            </div>
          </div>

          {/* — 中：搜索框 — */}
          <div className="flex-1 max-w-lg mx-auto w-full px-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.8} />
              <input
                type="text"
                placeholder={pick(locale, I18N.search)}
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-indigo-300 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* — 右：保存 / 运行 / 会员 / 头像 — */}
          <div className="flex items-center gap-1.5">
            <DeviceSwitcher viewport={viewport} />
            <button className="h-9 px-3 rounded-xl flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{pick(locale, I18N.save)}</span>
            </button>
            <button className="h-9 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{pick(locale, I18N.run)}</span>
            </button>
            <button className="h-9 px-2 rounded-xl hidden md:flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
              <span>{pick(locale, I18N.member)}</span>
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <UserCircle2 className="w-[22px] h-[22px]" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
       * ② 主区三栏布局
       * ============================================================ */}
      <div className="flex-1 min-h-0 flex">
        {/* —— 左：可折叠导航（平板自动折叠） —— */}
        {!viewport.isMobile && (
          <WorkflowLeftSider
            locale={locale}
            collapsed={viewport.isTablet ? true : leftCollapsed}
            activeId={activeMenu}
            onToggleCollapse={() => setLeftCollapsed((v) => !v)}
            onSelect={setActiveMenu}
          />
        )}

        {/* —— 中：画布（白底 + 淡蓝紫编织网格背景） —— */}
        <main
          className={[
            'flex-1 min-w-0 relative overflow-hidden',
            'bg-gradient-to-br from-white via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20',
          ].join(' ')}
        >
          {/* 网格背景（极淡编织纹理，独家差异化设计） */}
          {gridVisible && <CanvasGridBackground />}

          {/* 流动连线装饰（S型 start→1→2→3/4→end） */}
          <FlowConnectionLines nodes={nodes} hoverNodeId={hoverNodeId} />

          {/* — 画布节点渲染层 — */}
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              cursor: panActive ? 'grab' : 'default',
            }}
          >
            {nodes.length === 0 ? (
              <WorkflowEmptyState locale={locale} onAddFirst={handleAddFirst} />
            ) : (
              nodes.map((n) => (
                <WorkflowNodeCard
                  key={n.id}
                  locale={locale}
                  data={n}
                  selected={selectedNodeId === n.id}
                  hovered={hoverNodeId === n.id}
                  onMouseDown={onNodeMouseDown}
                  onSelect={handleSelectNode}
                  onCopy={handleCopyNode}
                  onDelete={handleDeleteNode}
                  onAddBranch={handleAddBranch}
                  onHoverChange={handleHoverChange}
                />
              ))
            )}
          </div>

          {/* — 底部工具栏 — */}
          <CanvasBottomBar
            locale={locale}
            zoom={zoom}
            panActive={panActive}
            gridVisible={gridVisible}
            onZoomChange={setZoom}
            onFit={handleFit}
            onTogglePan={() => setPanActive((v) => !v)}
            onToggleGrid={() => setGridVisible((v) => !v)}
          />

          {/* — 步骤数浮动徽标 — */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
            {pick(locale, I18N.stepCount).replace('{n}', String(nodes.length))}
          </div>
        </main>

        {/* —— 右：配置抽屉面板 —— */}
        <ConfigDrawer
          locale={locale}
          open={drawerOpen && !isMobile}
          onClose={() => setDrawerOpen(false)}
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onCopy={handleCopyNode}
          onDelete={handleDeleteNode}
          onRunTest={handleRunTest}
          testState={testState}
        />
      </div>

      {/* — 全局动画样式（注入一次，不修改 globals.css） — */}
      <InlineCanvasAnimations />
    </div>
  );
}

/* ============================================================
 * 子组件：Loading 骨架屏
 * ============================================================ */
function LoadingScaffold({ locale }: { locale: string }) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 flex flex-col">
      <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 animate-pulse" />
      <div className="flex-1 flex">
        <div className="w-[240px] border-r border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-3 space-y-2 hidden md:block">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-11 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="text-[11px] text-gray-400 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 animate-spin" />
            {pick(locale, I18N.loading)}
          </div>
          <div className="grid grid-cols-3 gap-8">
            <WorkflowNodeSkeleton />
            <WorkflowNodeSkeleton />
            <WorkflowNodeSkeleton />
          </div>
        </div>
        <div className="w-[360px] border-l border-gray-200 dark:border-gray-800 p-4 space-y-4 hidden lg:block">
          <div className="h-11 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 子组件：画布编织网格背景（独家差异化纹理）
 * ============================================================ */
function CanvasGridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* —— 淡灰细网格 —— */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgb(203 213 225 / 0.25) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgb(203 213 225 / 0.25) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgb(203 213 225 / 0.12) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgb(203 213 225 / 0.12) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '96px 96px',
        }}
      />
      {/* —— 极淡蓝紫编织纹理：斜向渐变条带 —— */}
      <div
        className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(120deg, transparent 0px, transparent 160px, rgb(99 102 241 / 0.04) 160px, rgb(139 92 246 / 0.06) 168px, transparent 176px, transparent 320px), repeating-linear-gradient(60deg, transparent 0px, transparent 200px, rgb(59 130 246 / 0.05) 200px, rgb(99 102 241 / 0.04) 210px, transparent 220px)',
        }}
      />
      {/* —— 四角柔光辉映：增加空间层次 —— */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );
}

/* ============================================================
 * 子组件：SVG流动连接线（start → 1 → 2 → 3/4 → end）
 * 悬停画布时加蓝紫流动光影，常态柔和纯色
 * ============================================================ */
function FlowConnectionLines({
  nodes,
  hoverNodeId,
}: {
  nodes: WorkflowNodeData[];
  hoverNodeId: string | null;
}) {
  const id = (s: string) => nodes.find((n) => n.id === s);
  const a = id('n-start'), b = id('n-1'), c = id('n-2'), d = id('n-3'), e = id('n-4'), f = id('n-end');
  const pairs: Array<[WorkflowNodeData | undefined, WorkflowNodeData | undefined, string]> = [
    [a, b, 'solid'],
    [b, c, 'solid'],
    [c, d, 'dash'],
    [c, e, 'dash'],
    [d, f, 'solid'],
    [e, f, 'solid'],
  ];
  const hasHover = hoverNodeId != null;
  const getCenter = (n?: WorkflowNodeData, kind?: WorkflowNodeData['kind']) => {
    if (!n) return { x: 0, y: 0 };
    const offsetX = kind === 'start' || kind === 'end' ? 60 : kind === 'condition' ? 75 : 130;
    const offsetY = kind === 'start' || kind === 'end' ? 60 : kind === 'condition' ? 75 : 50;
    return { x: n.posX + offsetX, y: n.posY + offsetY };
  };
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
      <defs>
        <linearGradient id="wf-line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="wf-line-soft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {pairs.map(([s, t, style], i) => {
        if (!s || !t) return null;
        const p1 = getCenter(s, s.kind);
        const p2 = getCenter(t, t.kind);
        const dx = Math.max(60, Math.abs(p2.x - p1.x) / 2);
        const path = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
        const isHighlight = hasHover;
        return (
          <g key={i}>
            <path
              d={path}
              fill="none"
              strokeWidth={isHighlight ? 4 : 2.5}
              strokeLinecap="round"
              stroke={isHighlight ? 'url(#wf-line-grad)' : 'url(#wf-line-soft)'}
              strokeDasharray={style === 'dash' ? '10 8' : undefined}
              className={isHighlight ? 'transition-all duration-500' : ''}
              style={
                isHighlight
                  ? {
                      filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.35))',
                      animation: 'flow-dash 1.6s linear infinite',
                      strokeDashoffset: 0,
                    }
                  : undefined
              }
            />
            {/* 端点小圆 */}
            <circle cx={p1.x} cy={p1.y} r={3.5} fill="#6366f1" opacity="0.9" />
            <circle cx={p2.x} cy={p2.y} r={3.5} fill="#8b5cf6" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
 * 子组件：设备图标（PC/平板/移动）
 * ============================================================ */
function DeviceSwitcher({ viewport }: { viewport: { isMobile: boolean; isTablet: boolean } }) {
  const Icon = viewport.isMobile ? Smartphone : viewport.isTablet ? Tablet : Monitor;
  const cls = viewport.isMobile
    ? 'text-rose-500'
    : viewport.isTablet
    ? 'text-amber-500'
    : 'text-indigo-500';
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${cls}`}>
      <Icon className="w-4 h-4" strokeWidth={1.8} />
    </div>
  );
}

/* ============================================================
 * 子组件：移动端步骤列表视图（替代画布防错乱）
 * ============================================================ */
function MobileStepList({
  locale,
  nodes,
  selectedNodeId,
  onSelectNode,
  drawerOpen,
  setDrawerOpen,
  selectedNode,
  onUpdateNode,
  onCopyNode,
  onDeleteNode,
  testState,
  onRunTest,
}: {
  locale: string;
  nodes: WorkflowNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  selectedNode: WorkflowNodeData | null;
  onUpdateNode: (p: Partial<WorkflowNodeData>) => void;
  onCopyNode: () => void;
  onDeleteNode: () => void;
  testState: 'idle' | 'running' | 'success' | 'error';
  onRunTest: () => void;
}) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* —— 移动端顶栏 —— */}
      <div className="relative h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-3 flex items-center gap-2 flex-shrink-0">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-70" />
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 flex-1 truncate">
          {pick(locale, I18N.mobileList)}
        </div>
        <div className="px-2 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center">
          {pick(locale, I18N.stepCount).replace('{n}', String(nodes.length))}
        </div>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="h-8 px-3 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white text-xs font-bold"
        >
          {selectedNodeId ? '✓' : '+'}
        </button>
      </div>

      {/* —— 步骤垂直列表 —— */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {nodes.length === 0 ? (
          <WorkflowEmptyState locale={locale} />
        ) : (
          nodes.map((n, idx) => (
            <MobileStepRow
              key={n.id}
              locale={locale}
              index={idx}
              data={n}
              isLast={idx === nodes.length - 1}
              selected={selectedNodeId === n.id}
              onClick={() => onSelectNode(n.id)}
            />
          ))
        )}
      </div>

      {/* —— 底部抽屉：选中节点配置 —— */}
      {drawerOpen && selectedNode && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative max-h-[78vh] overflow-hidden rounded-t-3xl bg-white dark:bg-gray-900 shadow-2xl animate-slide-up">
            <div className="mx-auto mt-2 mb-1 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <ConfigDrawer
              locale={locale}
              open
              onClose={() => setDrawerOpen(false)}
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              onCopy={onCopyNode}
              onDelete={onDeleteNode}
              onRunTest={onRunTest}
              testState={testState}
            />
          </div>
        </div>
      )}
      <InlineCanvasAnimations />
    </div>
  );
}

function MobileStepRow({
  locale: _locale,
  index,
  data,
  isLast,
  selected,
  onClick,
}: {
  locale: string;
  index: number;
  data: WorkflowNodeData;
  isLast: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const statusColor = {
    idle: 'bg-gray-400',
    running: 'bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse',
    success: 'bg-emerald-500',
    failed: 'bg-rose-500',
  }[data.status || 'idle'];
  const kindIcon = {
    start: '▶',
    tool: '⚙',
    condition: '◆',
    end: '■',
  }[data.kind];
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={[
          'w-full relative p-3 rounded-2xl flex items-center gap-3 text-left transition-all',
          'border',
          selected
            ? 'bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-violet-500/10 border-indigo-300 dark:border-indigo-700 shadow-md shadow-indigo-500/10 scale-[1.01]'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        ].join(' ')}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base bg-gray-100 dark:bg-gray-800">
          {kindIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">
            Step {index + 1}
          </div>
          <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100 truncate">
            {data.title}
          </div>
          {data.subtitle && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {data.subtitle}
            </div>
          )}
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColor} flex-shrink-0`} />
      </button>
      {!isLast && (
        <div className="absolute left-[22px] top-full w-0.5 h-4 bg-gradient-to-b from-indigo-400 to-violet-400 opacity-60" />
      )}
    </div>
  );
}

/* ============================================================
 * 子组件：一次性注入动画 keyframes（不修改 globals.css）
 * ============================================================ */
function InlineCanvasAnimations() {
  return (
    <style jsx global>{`
      @keyframes flow-dash {
        to {
          stroke-dashoffset: -36;
        }
      }
      @keyframes flow-pulse {
        0%, 100% {
          opacity: 0.7;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.04);
        }
      }
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .animate-flow-pulse {
        animation: flow-pulse 2.8s ease-in-out infinite;
      }
      .animate-fade-in-up {
        animation: fade-in-up 180ms ease-out both;
      }
      .animate-slide-up {
        animation: slide-up 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}</style>
  );
}
