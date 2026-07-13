import type { StepConfig } from '@/types/workflow-canvas';
import { TOOLS_INDEX, type ToolIndexItem } from '@/data/tools';

export interface ToolExecutorMeta {
  slug: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
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

function buildExternalMeta(idx: ToolIndexItem): ToolExecutorMeta {
  const url = idx.externalUrl || '';
  return {
    slug: idx.slug,
    name: idx.name,
    category: idx.category,
    description: idx.description || '',
    tags: idx.tags || [],
    icon: idx.icon,
    executionType: 'external',
    config: {
      ...DEFAULT_EXTERNAL_CONFIG,
      externalUrl: url,
      values: {},
    },
  };
}

export const toolRegistry: Record<string, ToolExecutorMeta> = {};

TOOLS_INDEX.forEach((idx) => {
  toolRegistry[idx.slug] = buildExternalMeta(idx);
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
      if (m.name.toLowerCase().includes(q)) return true;
      if (m.slug.toLowerCase().includes(q)) return true;
      if (m.description && m.description.toLowerCase().includes(q)) return true;
      if (m.tags && m.tags.length) {
        for (const t of m.tags) {
          if (t.toLowerCase().includes(q)) return true;
        }
      }
      return false;
    })
    .slice(0, limit);
}
