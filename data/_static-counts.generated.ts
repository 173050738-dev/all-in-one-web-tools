// ============================================================
// 此文件由 scripts/build-data-bundles.cjs 自动生成，请勿手改！
// 预计算分类计数 / 总体统计，让 categories.ts 与首页首屏
// 不必顶层 import tools（1056 条工具 ≈ 几百 KB）。
// ============================================================

export const STATIC_TOTAL_TOOLS_COUNT: number = 1320;
export const STATIC_VERIFIED_TOOLS_COUNT: number = 1320;
export const STATIC_PENDING_TOOLS_COUNT: number = 0;

export const STATIC_CATEGORY_COUNTS: Record<string, number> = {
  "dev-tools": 179,
  "ai-tools": 33,
  "image-tools": 30,
  "pdf-tools": 18,
  "media-tools": 63,
  "productivity": 182,
  "design-tools": 55,
  "ecommerce": 10,
  "content-tools": 16,
  "marketing": 15,
  "seo-tools": 9,
  "social-media": 15,
  "customer-service": 10,
  "finance-tools": 41,
  "hr-tools": 21,
  "education": 52,
  "health": 228,
  "lifestyle": 158,
  "video-editing": 33,
  "audio-tools": 44,
  "3d-tools": 14,
  "data-viz": 23,
  "security": 23,
  "collaboration": 20,
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
  verifiedCount: 1320,
  pendingCount: 0,
  totalCount: 1320,
};
