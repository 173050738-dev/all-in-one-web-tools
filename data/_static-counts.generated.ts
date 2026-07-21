// ============================================================
// 此文件由 scripts/build-data-bundles.cjs 自动生成，请勿手改！
// 预计算分类计数 / 总体统计，让 categories.ts 与首页首屏
// 不必顶层 import tools（1056 条工具 ≈ 几百 KB）。
// ============================================================

export const STATIC_TOTAL_TOOLS_COUNT: number = 1557;
export const STATIC_VERIFIED_TOOLS_COUNT: number = 1557;
export const STATIC_PENDING_TOOLS_COUNT: number = 0;

export const STATIC_CATEGORY_COUNTS: Record<string, number> = {
  "dev-tools": 195,
  "ai-tools": 47,
  "image-tools": 38,
  "pdf-tools": 19,
  "media-tools": 65,
  "productivity": 209,
  "design-tools": 82,
  "ecommerce": 15,
  "content-tools": 24,
  "marketing": 23,
  "seo-tools": 14,
  "social-media": 18,
  "customer-service": 10,
  "finance-tools": 44,
  "hr-tools": 21,
  "education": 64,
  "health": 235,
  "lifestyle": 159,
  "video-editing": 33,
  "audio-tools": 49,
  "3d-tools": 14,
  "data-viz": 26,
  "security": 27,
  "collaboration": 24,
  "file-tools": 19,
  "api-tools": 12,
  "game-tools": 61,
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
  verifiedCount: 1557,
  pendingCount: 0,
  totalCount: 1557,
};
