import type { StepConfig } from '@/types/workflow-canvas';
import { tools, getToolBySlug, type Tool } from '@/data/tools';

export interface ToolExecutorMeta {
  slug: string;
  name: string;
  category: string;
  icon?: string;
  executionType: 'external' | 'builtin';
  config: StepConfig;
}

const DEFAULT_EXTERNAL_CONFIG: StepConfig = {
  autoOpen: true,
  waitForManualConfirm: true,
  inputSchema: [
    {
      key: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Any notes or parameters for this step...',
      description: 'Optional context to remind yourself when this step runs',
    },
  ],
  outputSchema: [
    {
      key: 'confirmedAt',
      label: 'Confirmed At',
      type: 'text',
      description: 'Timestamp when user marked this step complete',
    },
    {
      key: 'notes',
      label: 'Output Notes',
      type: 'text',
      description: 'Any notes captured after completion',
    },
  ],
  values: {},
};

function buildExternalMeta(tool: Tool): ToolExecutorMeta {
  const url = tool.externalUrl || '';
  return {
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    icon: (tool as any).icon,
    executionType: 'external',
    config: {
      ...DEFAULT_EXTERNAL_CONFIG,
      externalUrl: url,
      values: {},
    },
  };
}

export const toolRegistry: Record<string, ToolExecutorMeta> = {};

tools.forEach((tool) => {
  toolRegistry[tool.slug] = buildExternalMeta(tool);
});

export function getToolMeta(slug: string): ToolExecutorMeta | undefined {
  return toolRegistry[slug];
}

export function listToolMetaByCategory(): Record<string, ToolExecutorMeta[]> {
  const groups: Record<string, ToolExecutorMeta[]> = {};
  Object.values(toolRegistry).forEach((m) => {
    if (!groups[m.category]) groups[m.category] = [];
    groups[m.category].push(m);
  });
  return groups;
}

export function searchTools(query: string, limit = 30): ToolExecutorMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return Object.values(toolRegistry).slice(0, limit);
  return Object.values(toolRegistry)
    .filter((m) => {
      const t = getToolBySlug(m.slug);
      if (!t) return false;
      return (
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    })
    .slice(0, limit);
}
