import type { FlowEdge, FlowNode } from '@/types/workflow-canvas';
import type { CustomWorkflowStep } from '@/stores/preferences';
import { getToolMeta } from './workflow-tool-registry';

export interface LinearWorkflow {
  title?: string;
  description?: string;
  steps: CustomWorkflowStep[];
}

export function linearStepsToGraph(steps: CustomWorkflowStep[]): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const H_GAP = 280;
  const START_X = 40;
  const BASE_Y = 220;

  nodes.push({
    id: 'node_start',
    type: 'start',
    position: { x: START_X, y: BASE_Y },
    data: { kind: 'start', title: 'Start' } as any,
  });

  let lastId = 'node_start';

  steps.forEach((step, idx) => {
    const meta = getToolMeta(step.toolSlug);
    const nodeId = `node_step_${idx}`;
    nodes.push({
      id: nodeId,
      type: 'tool',
      position: {
        x: START_X + H_GAP * (idx + 1),
        y: BASE_Y + (idx % 2 === 0 ? -40 : 40),
      },
      data: {
        kind: 'tool',
        toolSlug: step.toolSlug,
        title: step.title,
        description: step.description || meta?.config?.inputSchema?.[0]?.description || '',
        status: 'idle',
        config: { ...(meta?.config || {}) },
      } as any,
    });
    edges.push({
      id: `edge_${lastId}_${nodeId}`,
      source: lastId,
      target: nodeId,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    });
    lastId = nodeId;
  });

  nodes.push({
    id: 'node_end',
    type: 'end',
    position: { x: START_X + H_GAP * (steps.length + 1), y: BASE_Y },
    data: { kind: 'end', title: 'End', status: 'idle' } as any,
  });
  edges.push({
    id: `edge_${lastId}_node_end`,
    source: lastId,
    target: 'node_end',
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
  });

  return { nodes, edges };
}

export function graphToLinearSteps(
  nodes: FlowNode[],
  edges: FlowEdge[]
): CustomWorkflowStep[] {
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
  const sorted: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(id);
    (adj[id] || []).forEach((next) => {
      inDegree[next] -= 1;
      if (inDegree[next] === 0) queue.push(next);
    });
  }

  const steps: CustomWorkflowStep[] = [];
  sorted.forEach((id) => {
    const n = idToNode[id];
    if (!n) return;
    if (n.type !== 'tool') return;
    const d = n.data as any;
    if (d.kind !== 'tool') return;
    steps.push({
      toolSlug: d.toolSlug,
      title: d.title || '',
      description: d.description || '',
    });
  });
  return steps;
}

export function emptyGraph(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  return linearStepsToGraph([]);
}
