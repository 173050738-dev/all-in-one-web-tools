import type { ToolIndexItem } from '@/data/tools-shared';
import _json from './tools-index.json';

/**
 * 薄索引：ToolCard/SearchDropdown/HomeDashboard 列表需要的字段。
 * 真实 JSON 文件在同级 tools-index.json 存放，TS 侧直接 import + 类型断言。
 */
export const TOOLS_INDEX = _json as unknown as ToolIndexItem[];
