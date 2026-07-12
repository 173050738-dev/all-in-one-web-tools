import type { Tool, ToolIndexItem, ToolDetailItem, ComplianceLevel, Difficulty, Platform, AccessTag, PaymentMethod, SignupType } from '@/data/tools-shared';
import { computeComplianceLevel } from '@/data/tools-shared';
import { TOOLS_INDEX } from '@/data/tools-index';
import { TOOLS_DETAIL_MAP } from '@/data/tools-detail';

/**
 * 兼容层：合并薄索引 + 详情 map 回原 Tool[] 结构。
 * 任何仍从 @/data/tools 导入的旧代码无需改动。
 * 新代码应直接从 @/data/tools-index / @/data/tools-detail 动态导入按需加载。
 */
export const tools: Tool[] = TOOLS_INDEX.map((idx: ToolIndexItem): Tool => {
  const det: ToolDetailItem = TOOLS_DETAIL_MAP[idx.slug] || { relatedTools: [] };
  return { ...(idx as any), ...(det as any) };
});

export type { Tool, ComplianceLevel, Difficulty, Platform, AccessTag, PaymentMethod, SignupType, ToolIndexItem, ToolDetailItem };
export { computeComplianceLevel };

/* 原查询函数（兼容层直接从合并数组查，性能一致） */
export const getToolBySlug = (slug: string): Tool | undefined =>
  tools.find((tool) => tool.slug === slug);

export const getToolsByCategory = (category: string): Tool[] =>
  tools.filter((tool) => tool.category === category && tool.complianceLevel !== 'red');

export const getRelatedTools = (tool: Tool): Tool[] =>
  tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined && t.complianceLevel !== 'red');

export const getFilteredTools = (complianceFilter?: 'green' | 'yellow' | 'all'): Tool[] => {
  let filtered = tools.filter((tool) => {
    const level = tool.complianceLevel || computeComplianceLevel(tool);
    return level !== 'red';
  });
  if (complianceFilter && complianceFilter !== 'all') {
    filtered = filtered.filter((tool) => {
      const level = tool.complianceLevel || computeComplianceLevel(tool);
      return level === complianceFilter;
    });
  }
  return filtered;
};

/* tools-index 便捷查询（首页/列表页用，不加载详情） */
export function getToolIndexBySlug(slug: string): ToolIndexItem | undefined {
  return TOOLS_INDEX.find((t) => t.slug === slug);
}

export function getToolsIndexByCategory(category: string): ToolIndexItem[] {
  return TOOLS_INDEX.filter((t) => t.category === category);
}
