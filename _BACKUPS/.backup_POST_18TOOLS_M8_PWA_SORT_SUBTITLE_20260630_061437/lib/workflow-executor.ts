import type {
  ExecutionStepResult,
  FlowEdge,
  FlowNode,
  StepStatus,
  WorkflowRunRecord,
} from '@/types/workflow-canvas';
import { getToolMeta } from './workflow-tool-registry';

export type ExecutionEvent =
  | { type: 'step-start'; nodeId: string }
  | { type: 'step-success'; nodeId: string; output: Record<string, unknown> }
  | { type: 'step-failed'; nodeId: string; error: string }
  | { type: 'step-waiting'; nodeId: string; prompt: string; externalUrl?: string }
  | { type: 'progress'; completed: number; total: number }
  | { type: 'complete'; record: WorkflowRunRecord }
  | { type: 'error'; message: string };

export type ExecutionListener = (event: ExecutionEvent) => void;

interface ExecutionContext {
  variables: Record<string, unknown>;
  results: Record<string, ExecutionStepResult>;
}

function resolveTemplate(value: string, ctx: ExecutionContext): string {
  return value.replace(/\{\{\s*([a-zA-Z0-9_.$]+)\s*\}\}/g, (_match, path) => {
    const parts = path.split('.');
    let current: unknown = ctx.variables;
    for (const p of parts) {
      if (current && typeof current === 'object' && p in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[p];
      } else {
        return '';
      }
    }
    return current == null ? '' : String(current);
  });
}

function topologicalSort(nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
  const idToNode: Record<string, FlowNode> = {};
  nodes.forEach((n) => (idToNode[n.id] = n));
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adj[n.id] = [];
  });
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (typeof inDegree[e.target] === 'number') inDegree[e.target] += 1;
  });
  const queue: string[] = [];
  Object.keys(inDegree).forEach((id) => {
    if (inDegree[id] === 0) queue.push(id);
  });
  const sorted: FlowNode[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (idToNode[id]) sorted.push(idToNode[id]);
    (adj[id] || []).forEach((nextId) => {
      inDegree[nextId] -= 1;
      if (inDegree[nextId] === 0) queue.push(nextId);
    });
  }
  const remaining = nodes.filter((n) => !sorted.find((s) => s.id === n.id));
  return [...sorted, ...remaining];
}

function getExecutableNodes(nodes: FlowNode[]): FlowNode[] {
  return nodes.filter((n) => n.type === 'tool' || n.type === 'end');
}

export class WorkflowExecutor {
  private nodes: FlowNode[];
  private edges: FlowEdge[];
  private listener: ExecutionListener;
  private ctx: ExecutionContext;
  private waitingNodeId: string | null = null;
  private aborted = false;

  constructor(nodes: FlowNode[], edges: FlowEdge[], listener: ExecutionListener) {
    this.nodes = nodes;
    this.edges = edges;
    this.listener = listener;
    this.ctx = { variables: {}, results: {} };
  }

  abort() {
    this.aborted = true;
  }

  isWaiting() {
    return this.waitingNodeId !== null;
  }

  getWaitingNodeId() {
    return this.waitingNodeId;
  }

  confirmStep(nodeId: string, manualOutput: Record<string, unknown> = {}) {
    if (this.waitingNodeId !== nodeId) return;
    this.waitingNodeId = null;
    const output: Record<string, unknown> = {
      confirmedAt: new Date().toISOString(),
      ...manualOutput,
    };
    this.finishStep(nodeId, 'success', output);
  }

  skipStep(nodeId: string) {
    if (this.waitingNodeId !== nodeId) return;
    this.waitingNodeId = null;
    this.finishStep(nodeId, 'skipped', { skipped: true });
  }

  failStep(nodeId: string, error: string) {
    if (this.waitingNodeId !== nodeId) return;
    this.waitingNodeId = null;
    this.finishStep(nodeId, 'failed', undefined, error);
  }

  async run(workflowId: string): Promise<WorkflowRunRecord | null> {
    this.aborted = false;
    const ordered = topologicalSort(this.nodes, this.edges);
    const execNodes = getExecutableNodes(ordered);
    const total = execNodes.length;
    const startedAt = Date.now();
    const allResults: ExecutionStepResult[] = [];
    let completed = 0;

    const record: WorkflowRunRecord = {
      id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      workflowId,
      startedAt,
      status: 'running',
      results: allResults,
      totalSteps: total,
      completedSteps: 0,
    };

    this.emit({ type: 'progress', completed: 0, total });

    for (const node of execNodes) {
      if (this.aborted) {
        record.status = 'failed';
        record.finishedAt = Date.now();
        return record;
      }

      if (node.type === 'end') {
        const res: ExecutionStepResult = {
          nodeId: node.id,
          status: 'success',
          startedAt: Date.now(),
          finishedAt: Date.now(),
          output: { endedAt: new Date().toISOString() },
        };
        allResults.push(res);
        completed += 1;
        this.emit({ type: 'step-success', nodeId: node.id, output: res.output! });
        this.emit({ type: 'progress', completed, total });
        continue;
      }

      const result = await this.executeSingle(node);
      allResults.push(result);
      if (result.status === 'success' || result.status === 'skipped') {
        completed += 1;
      }
      this.emit({ type: 'progress', completed, total });

      if (result.status === 'failed') {
        record.status = 'failed';
        record.finishedAt = Date.now();
        record.completedSteps = completed;
        this.emit({ type: 'complete', record });
        return record;
      }

      if (this.aborted) break;
    }

    record.status = completed === total ? 'success' : 'running';
    record.finishedAt = Date.now();
    record.completedSteps = completed;
    this.emit({ type: 'complete', record });
    return record;
  }

  private emit(event: ExecutionEvent) {
    try {
      this.listener(event);
    } catch (e) {
      // listener errors should not break the engine
    }
  }

  private finishStep(
    nodeId: string,
    status: StepStatus,
    output?: Record<string, unknown>,
    error?: string
  ) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const existing = this.ctx.results[nodeId];
    const finishedAt = Date.now();
    const result: ExecutionStepResult = {
      nodeId,
      status,
      startedAt: existing?.startedAt || finishedAt - 1,
      finishedAt,
      output,
      error,
    };
    this.ctx.results[nodeId] = result;
    if (output && node.data.kind === 'tool') {
      this.ctx.variables[`step_${nodeId}`] = output;
    }
    if (status === 'success') {
      this.emit({ type: 'step-success', nodeId, output: output || {} });
    } else if (status === 'failed') {
      this.emit({ type: 'step-failed', nodeId, error: error || 'Failed' });
    }
  }

  private async executeSingle(node: FlowNode): Promise<ExecutionStepResult> {
    const startedAt = Date.now();
    if (node.data.kind !== 'tool') {
      return {
        nodeId: node.id,
        status: 'skipped',
        startedAt,
        finishedAt: Date.now(),
      };
    }

    this.emit({ type: 'step-start', nodeId: node.id });
    this.ctx.results[node.id] = { nodeId: node.id, status: 'running', startedAt };

    const meta = getToolMeta(node.data.toolSlug);
    const data = node.data;
    const config = { ...meta?.config, ...data.config };

    if (config.autoOpen && config.externalUrl) {
      try {
        const resolvedUrl = resolveTemplate(config.externalUrl, this.ctx);
        if (typeof window !== 'undefined') {
          window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
        }
      } catch (e) {
        // ignore popup errors, user can open manually
      }
    }

    const prompt = meta
      ? `Please complete the task in ${meta.name}, then confirm.`
      : 'Please complete this step then confirm.';

    this.waitingNodeId = node.id;
    this.emit({
      type: 'step-waiting',
      nodeId: node.id,
      prompt,
      externalUrl: config.externalUrl,
    });

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.aborted) {
          clearInterval(checkInterval);
          this.waitingNodeId = null;
          resolve({
            nodeId: node.id,
            status: 'failed',
            startedAt,
            finishedAt: Date.now(),
            error: 'Aborted',
          });
          return;
        }
        const r = this.ctx.results[node.id];
        if (r && r.status !== 'running' && r.finishedAt) {
          clearInterval(checkInterval);
          resolve(r);
        }
      }, 120);
    });
  }
}
