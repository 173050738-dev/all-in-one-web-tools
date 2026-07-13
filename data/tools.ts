import type { Tool, ToolIndexItem, ToolDetailItem, ComplianceLevel, Difficulty, Platform, AccessTag, PaymentMethod, SignupType } from '@/data/tools-shared';
import { computeComplianceLevel } from '@/data/tools-shared';
import { TOOLS_INDEX } from '@/data/tools-index';
import { TOOLS_DETAIL_MAP } from '@/data/tools-detail';

export type { Tool, ComplianceLevel, Difficulty, Platform, AccessTag, PaymentMethod, SignupType, ToolIndexItem, ToolDetailItem };
export { computeComplianceLevel, TOOLS_INDEX };

/* ========================= 懒初始化：真正按需才做 1537 条合并 ========================= */
let _tools: Tool[] | null = null;
function ensureTools(): Tool[] {
  if (_tools) return _tools;
  _tools = TOOLS_INDEX.map((idx: ToolIndexItem): Tool => {
    const det: ToolDetailItem = TOOLS_DETAIL_MAP[idx.slug] || { relatedTools: [] };
    return { ...(idx as any), ...(det as any) };
  });
  return _tools;
}

function mergeToolFromIndexAndDetail(idx: ToolIndexItem): Tool {
  const det = TOOLS_DETAIL_MAP[idx.slug] || { relatedTools: [] };
  return { ...(idx as any), ...(det as any) };
}

const _toolsProxy: Tool[] = new Proxy<Tool[]>([] as unknown as Tool[], {
  get(target, prop, receiver) {
    const real = ensureTools();
    const v = (real as any)[prop];
    return typeof v === 'function' ? v.bind(real) : v;
  },
  ownKeys() { return Reflect.ownKeys(ensureTools()); },
  getOwnPropertyDescriptor(_, prop) { return Reflect.getOwnPropertyDescriptor(ensureTools(), prop); },
  has(_, prop) { return Reflect.has(ensureTools(), prop); },
  getPrototypeOf() { return Reflect.getPrototypeOf(ensureTools()); },
});

/**
 * 兼容层：合并薄索引 + 详情 map 回原 Tool[] 结构。
 * 任何仍从 @/data/tools 导入的旧代码无需改动。
 * 懒加载：只有真正访问 tools 时才执行 1537 条合并，首屏不触发。
 * 新代码应直接使用下方 *Index* 系列函数，完全不加载详情。
 */
export const tools: Tool[] = _toolsProxy as Tool[];

/* ========== 原查询函数（兼容层）：按需懒初始化，不立刻 merge ========== */
export function getToolBySlug(slug: string): Tool | undefined {
  const idx = TOOLS_INDEX.find((t) => t.slug === slug);
  if (!idx) return undefined;
  return mergeToolFromIndexAndDetail(idx);
}

export function getToolById(id: string): Tool | undefined {
  const idx = TOOLS_INDEX.find((t) => t.id === id);
  if (!idx) return undefined;
  return mergeToolFromIndexAndDetail(idx);
}

export const getToolsByCategory = (category: string): Tool[] =>
  ensureTools().filter((tool) => tool.category === category && tool.complianceLevel !== 'red' && !tool.externalUrl);

export const getRelatedTools = (tool: Tool): Tool[] =>
  tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined && t.complianceLevel !== 'red');

export const getFilteredTools = (complianceFilter?: 'green' | 'yellow' | 'all'): Tool[] => {
  let filtered = ensureTools().filter((tool) => {
    if (tool.externalUrl) return false;
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

/* ========== tools-index 便捷查询（首页/列表/HistoryPanel/WorkflowCreator 等用，100% 不加载详情 ========== */
export function getToolIndexBySlug(slug: string): ToolIndexItem | undefined {
  return TOOLS_INDEX.find((t) => t.slug === slug);
}

export function getToolIndexById(id: string): ToolIndexItem | undefined {
  return TOOLS_INDEX.find((t) => t.id === id);
}

export function getToolsIndexByCategory(category: string): ToolIndexItem[] {
  return TOOLS_INDEX.filter((t) => t.category === category && !t.externalUrl);
}

export function searchToolIndex(query: string, limit = 30): ToolIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS_INDEX.filter((t) => !t.externalUrl).slice(0, limit);
  return TOOLS_INDEX
    .filter((t) => {
      if (t.externalUrl) return false;
      if (t.name && t.name.toLowerCase().includes(q)) return true;
      if (t.description && t.description.toLowerCase().includes(q)) return true;
      if (t.slug && t.slug.toLowerCase().includes(q)) return true;
      if (t.tags && t.tags.length) {
        for (const tag of t.tags) {
          if (tag.toLowerCase().includes(q)) return true;
        }
      }
      if (t.nameEn && t.nameEn.toLowerCase().includes(q)) return true;
      if (t.descriptionEn && t.descriptionEn.toLowerCase().includes(q)) return true;
      return false;
    })
    .slice(0, limit);
}
