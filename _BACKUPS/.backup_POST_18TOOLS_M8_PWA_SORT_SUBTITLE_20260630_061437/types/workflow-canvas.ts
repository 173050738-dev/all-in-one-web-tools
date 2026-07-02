import type { Edge, Node, Position } from '@xyflow/react';

export type NodeKind = 'start' | 'tool' | 'end';

export type StepStatus = 'idle' | 'running' | 'success' | 'failed' | 'skipped';

export interface InputFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string | number | boolean;
  description?: string;
}

export interface OutputFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'object' | 'file';
  description?: string;
}

export interface StepConfig {
  inputSchema?: InputFieldSchema[];
  outputSchema?: OutputFieldSchema[];
  values?: Record<string, unknown>;
  externalUrl?: string;
  autoOpen?: boolean;
  waitForManualConfirm?: boolean;
}

export interface ToolNodeData {
  kind: 'tool';
  toolSlug: string;
  title: string;
  description: string;
  status: StepStatus;
  config: StepConfig;
  error?: string;
  onDelete?: (nodeId: string) => void;
  onSelect?: (nodeId: string) => void;
}

export interface StartNodeData {
  kind: 'start';
  title: string;
  onSelect?: (nodeId: string) => void;
}

export interface EndNodeData {
  kind: 'end';
  title: string;
  status: StepStatus;
  onSelect?: (nodeId: string) => void;
}

export type FlowNodeData = ToolNodeData | StartNodeData | EndNodeData;

export interface FlowEdgeData {
  label?: string;
  condition?: string;
}

export type FlowNode = Node<Record<string, unknown> & FlowNodeData, NodeKind>;
export type FlowEdge = Edge<Record<string, unknown> & FlowEdgeData>;

export interface WorkflowCanvasState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  viewport: { x: number; y: number; zoom: number };
}

export interface ExecutionStepResult {
  nodeId: string;
  status: StepStatus;
  output?: Record<string, unknown>;
  error?: string;
  startedAt: number;
  finishedAt?: number;
}

export interface WorkflowRunRecord {
  id: string;
  workflowId: string;
  startedAt: number;
  finishedAt?: number;
  status: StepStatus | 'running';
  results: ExecutionStepResult[];
  totalSteps: number;
  completedSteps: number;
}

export const DEFAULT_HANDLE_POSITION: Position = 'Left' as any;
export const DEFAULT_TARGET_HANDLE_POSITION: Position = 'Right' as any;
