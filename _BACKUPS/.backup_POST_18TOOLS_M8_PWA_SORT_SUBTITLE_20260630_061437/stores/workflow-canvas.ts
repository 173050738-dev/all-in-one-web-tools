import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FlowEdge, FlowNode, WorkflowRunRecord } from '@/types/workflow-canvas';
import type { WorkflowExecutor } from '@/lib/workflow-executor';

export interface CanvasEditorState {
  workflowId: string | null;
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isRunning: boolean;
  currentRun: WorkflowRunRecord | null;
  nodeStatuses: Record<string, string>;
  panelLayout: 'split' | 'left-only' | 'right-only' | 'canvas-only';
  viewport: { x: number; y: number; zoom: number };
  executor: WorkflowExecutor | null;
  setWorkflowId: (id: string | null) => void;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  addNode: (node: FlowNode) => void;
  updateNode: (id: string, patch: Partial<FlowNode>) => void;
  updateNodeData: (id: string, patch: Record<string, unknown>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: FlowEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setPanelLayout: (layout: CanvasEditorState['panelLayout']) => void;
  setViewport: (vp: { x: number; y: number; zoom: number }) => void;
  reset: () => void;
  setIsRunning: (v: boolean) => void;
  setCurrentRun: (r: WorkflowRunRecord | null) => void;
  setNodeStatus: (nodeId: string, status: string) => void;
  clearNodeStatuses: () => void;
  setExecutor: (e: WorkflowExecutor | null) => void;
}

export const useWorkflowCanvasStore = create<CanvasEditorState>()(
  persist(
    (set) => ({
      workflowId: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      isRunning: false,
      currentRun: null,
      nodeStatuses: {},
      panelLayout: 'split',
      viewport: { x: 0, y: 0, zoom: 1 },
      executor: null,
      setWorkflowId: (id) => set({ workflowId: id }),
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
      updateNode: (id, patch) =>
        set((s) => ({
          nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
        })),
      updateNodeData: (id, patch) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...patch } as any } : n
          ),
        })),
      removeNode: (id) =>
        set((s) => ({
          nodes: s.nodes.filter((n) => n.id !== id),
          edges: s.edges.filter((e) => e.source !== id && e.target !== id),
          selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
        })),
      addEdge: (edge) =>
        set((s) => {
          const exists = s.edges.find(
            (e) => e.source === edge.source && e.target === edge.target
          );
          if (exists) return s;
          return { edges: [...s.edges, edge] };
        }),
      removeEdge: (id) =>
        set((s) => ({
          edges: s.edges.filter((e) => e.id !== id),
          selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
        })),
      selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
      selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
      setPanelLayout: (panelLayout) => set({ panelLayout }),
      setViewport: (viewport) => set({ viewport }),
      reset: () =>
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          selectedEdgeId: null,
          isRunning: false,
          currentRun: null,
          nodeStatuses: {},
          viewport: { x: 0, y: 0, zoom: 1 },
        }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setCurrentRun: (currentRun) => set({ currentRun }),
      setNodeStatus: (nodeId, status) =>
        set((s) => ({
          nodeStatuses: { ...s.nodeStatuses, [nodeId]: status },
        })),
      clearNodeStatuses: () => set({ nodeStatuses: {} }),
      setExecutor: (executor) => set({ executor }),
    }),
    {
      name: 'tool-hub-workflow-canvas',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        workflowId: s.workflowId,
        nodes: s.nodes,
        edges: s.edges,
        panelLayout: s.panelLayout,
        viewport: s.viewport,
      }),
    }
  )
);
