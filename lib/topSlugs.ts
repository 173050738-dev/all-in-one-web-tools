import { INITIAL_HOME_TOOLS } from '@/data/_initial-home.generated';
import { workflows } from '@/data/workflows';

export const TOP_TOOL_SLUGS: string[] = INITIAL_HOME_TOOLS
  .slice(0, 20)
  .map((t) => t.slug);

const TOP_TOOL_SET = new Set(TOP_TOOL_SLUGS);
export function isTopToolSlug(slug: string): boolean {
  return TOP_TOOL_SET.has(slug);
}

export const TOP_WORKFLOW_SLUGS: string[] = workflows
  .slice(0, 10)
  .map((w) => w.slug);

const TOP_WORKFLOW_SET = new Set(TOP_WORKFLOW_SLUGS);
export function isTopWorkflowSlug(slug: string): boolean {
  return TOP_WORKFLOW_SET.has(slug);
}
