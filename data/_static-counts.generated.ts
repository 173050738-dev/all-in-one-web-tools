// ============================================================
// 此文件由 scripts/build-data-bundles.cjs 自动生成，请勿手改！
// 预计算分类计数 / 总体统计，让 categories.ts 与首页首屏
// 不必顶层 import tools（1056 条工具 ≈ 几百 KB）。
// ============================================================

export const STATIC_TOTAL_TOOLS_COUNT: number = 1054;
export const STATIC_VERIFIED_TOOLS_COUNT: number = 1054;
export const STATIC_PENDING_TOOLS_COUNT: number = 0;

export const STATIC_CATEGORY_COUNTS: Record<string, number> = {
  "dev-tools": 168,
  "ai-tools": 30,
  "image-tools": 30,
  "pdf-tools": 14,
  "media-tools": 57,
  "productivity": 167,
  "design-tools": 44,
  "ecommerce": 10,
  "content-tools": 13,
  "marketing": 8,
  "seo-tools": 9,
  "social-media": 16,
  "customer-service": 12,
  "finance-tools": 35,
  "hr-tools": 13,
  "education": 44,
  "health": 44,
  "lifestyle": 158,
  "video-editing": 29,
  "audio-tools": 42,
  "3d-tools": 14,
  "data-viz": 24,
  "security": 24,
  "collaboration": 12,
  "file-tools": 15,
  "api-tools": 8,
};

export function getStaticCategoryCount(id: string): number {
  return STATIC_CATEGORY_COUNTS[id] || 0;
}

export function getStaticTotalTools(): number {
  return STATIC_TOTAL_TOOLS_COUNT;
}

export interface StaticComplianceStats {
  verifiedCount: number;
  pendingCount: number;
  totalCount: number;
}

export const STATIC_COMPLIANCE_STATS: StaticComplianceStats = {
  verifiedCount: 1054,
  pendingCount: 0,
  totalCount: 1054,
};
