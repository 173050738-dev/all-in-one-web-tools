import { INITIAL_HOME_TOOLS } from '@/data/_initial-home.generated';
import { workflows } from '@/data/workflows';
import { INTERNAL_TOOL_SLUGS } from './toolLinks';
import { BLOG_POSTS_INDEX } from '@/data/blog-index';

export const TOP_TOOL_SLUGS: string[] = INITIAL_HOME_TOOLS
  .slice(0, 20)
  .map((t) => t.slug);

export const STATIC_EXPORT_TOOL_SLUGS: string[] = Array.from(INTERNAL_TOOL_SLUGS);

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

export const TOP_BLOG_SLUGS: string[] = BLOG_POSTS_INDEX
  .slice(0, 20)
  .map((p) => p.slug);

const TOP_BLOG_SET = new Set(TOP_BLOG_SLUGS);
export function isTopBlogSlug(slug: string): boolean {
  return TOP_BLOG_SET.has(slug);
}
