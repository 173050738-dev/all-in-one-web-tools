import type { ToolDetailItem } from '@/data/tools-shared';
import _json from './tools-detail.json';

/**
 * 详情 map：按 slug → relatedTools/externalUrl/payment/signup + 多语言字段
 * JSON 文件在同级 tools-detail.json 存放。
 */
export const TOOLS_DETAIL_MAP = _json as unknown as Record<string, ToolDetailItem>;
