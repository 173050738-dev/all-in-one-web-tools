/**
 * scripts/split-tools-data.cjs
 * -------------------------------------------------------
 * 把完整工具数据（tools-index.json + tools-detail.json 合并）按
 * INDEX_KEYS / DETAIL_KEYS 重新拆分，输出新 JSON 与 TS 包装层：
 *   1) data/tools-index.json / data/tools-index.ts   薄索引（首页/卡片/搜索必须字段）
 *   2) data/tools-detail.json / data/tools-detail.ts slug → { relatedTools, payment, signup }
 *      详情页才需要的关联/支付/注册信息
 *   3) data/tools-shared.ts  公共类型 + computeComplianceLevel 纯函数
 *   4) data/tools.ts         向后兼容：合并 index+detail 后原样导出
 *
 * 用法：node scripts/split-tools-data.cjs
 * 注意：首次拆分时需从 tools.ts 提取源大数组（见 git 历史版本），后续微调 INDEX/DETAIL KEYS
 *      时直接运行本脚本即可，脚本会从现有 index+detail 还原完整 TOOLS，再按新规则拆分。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX_JSON = path.join(ROOT, 'data', 'tools-index.json');
const DETAIL_JSON = path.join(ROOT, 'data', 'tools-detail.json');
const SRC = path.join(ROOT, 'data', 'tools.ts');

if (!fs.existsSync(INDEX_JSON) || !fs.existsSync(DETAIL_JSON)) {
  console.error('[split-tools] FATAL: tools-index.json or tools-detail.json not found.');
  console.error('  Run from git history the original splitter to produce these JSONs first.');
  process.exit(1);
}

console.log('[split-tools] Reading existing index/detail JSON to reconstruct full TOOLS');
const indexArr0 = JSON.parse(fs.readFileSync(INDEX_JSON, 'utf8'));
const detailMap0 = JSON.parse(fs.readFileSync(DETAIL_JSON, 'utf8'));

/* 合并 index（数组）+ detail（slug->obj map）还原完整 TOOLS 数组 */
const TOOLS = indexArr0.map((idxItem) => {
  const d = detailMap0[idxItem.slug] ?? {};
  return { ...idxItem, ...d };
});
console.log('[split-tools] Reconstructed tools:', TOOLS.length);

/* 统计各字段占体积（给以后拆分参考） */
(function profileSize() {
  const sizePerField = {};
  for (const t of TOOLS) {
    for (const k of Object.keys(t)) {
      const v = JSON.stringify(t[k] ?? '');
      sizePerField[k] = (sizePerField[k] || 0) + v.length;
    }
  }
  const sorted = Object.entries(sizePerField).sort((a, b) => b[1] - a[1]);
  console.log('[split-tools] Field size profile (top 10):');
  for (const [k, sz] of sorted.slice(0, 10)) {
    console.log('   ', k.padEnd(20), Math.round(sz / 1024), 'KB');
  }
})();

/* 薄索引：首页/列表筛选必须字段 + ToolCard 展示必须字段
 *   computeComplianceLevel 需要 externalUrl（41KB）才能判断合规等级 → 必须放 index
 *   searchTools 搜索需要 tags（45KB）匹配 → 必须放 index
 *   ToolCard 翻译标题/描述/标签需要 nameEn/descriptionEn/tagsEn（285KB）→ 必须放 index
 *   → 虽然多 371KB，但这些是首页卡片展示/搜索/合规检查必需的，放 detail 会导致功能异常 */
const INDEX_KEYS = [
  'id','slug','name','description','category','tags',
  'nameEn','descriptionEn','tagsEn',
  'isFree','isLimitedFree','icon','externalUrl',
  'likes','difficulty','complianceLevel','platform',
  'accessTag','localProcessing'
];

/* 详情 map：
 *  重/关联字段：relatedTools/payment/signup（约 144KB） */
const DETAIL_KEYS = [
  'relatedTools','payment','signup'
];

function pickKeys(obj, keys) {
  const o = {};
  keys.forEach((k) => { if (k in obj) o[k] = obj[k]; });
  return o;
}

const indexArr = TOOLS.map((t) => pickKeys(t, INDEX_KEYS));
const detailMap = Object.fromEntries(TOOLS.map((t) => [t.slug, pickKeys(t, DETAIL_KEYS)]));

console.log('[split-tools] Index entries:', indexArr.length);
console.log('[split-tools] Detail map keys:', Object.keys(detailMap).length);

/* ---------------------------------------------------------------- */
/* 3) data/tools-shared.ts（公共类型 + 纯函数）                       */
/* ---------------------------------------------------------------- */
const SHARED_TS = `export type Difficulty = 'easy' | 'medium' | 'advanced';
export type ComplianceLevel = 'green' | 'yellow' | 'red';
export type Platform = 'desktop' | 'mobile' | 'all';
export type AccessTag = 'direct' | 'vpn-required';
export type PaymentMethod = 'alipay' | 'wechat' | 'visa' | 'mastercard';
export type SignupType = 'no-signup' | 'email' | 'cn-phone' | 'global-phone' | 'cc-required' | 'wechat' | 'phone';

export interface ToolIndexItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nameEn?: string;
  descriptionEn?: string;
  tagsEn?: string[];
  isFree: boolean;
  isLimitedFree?: boolean;
  icon: string;
  externalUrl?: string;
  likes?: number;
  difficulty?: Difficulty;
  complianceLevel?: ComplianceLevel;
  platform?: Platform;
  accessTag?: AccessTag;
  localProcessing?: boolean;
}

export interface ToolDetailItem {
  relatedTools: string[];
  payment?: PaymentMethod[];
  signup?: SignupType[];
}

/** 完整 Tool 类型（= 薄索引 + 详情，兼容原先 Tool 接口 100%） */
export interface Tool extends ToolIndexItem, ToolDetailItem {}

/* ---------------- 合规等级计算（原 computeComplianceLevel ） ---------------- */
const verifiedDomains = [
  'baidu.com', 'bilibili.com', 'douyin.com', 'ele.me', 'alipay.com', 'taobao.com', 'tmall.com',
  'jd.com', 'meituan.com', 'ctrip.com', 'xiaohongshu.com', 'weibo.com', 'zhihu.com', 'qq.com',
  '163.com', 'sogou.com', 'so.com', '360.cn', 'weixin.qq.com', 'weixin.com', 'wechat.com',
  'xiaomi.com', 'huawei.com', 'oppo.com', 'vivo.com', 'lenovo.com', 'dell.com.cn', 'hp.com.cn',
  'sony.com.cn', 'samsung.com.cn', 'apple.com.cn', 'microsoft.com.cn', 'google.cn', 'bing.com',
  'github.com', 'github.io', 'gitlab.com', 'npmjs.com', 'nodejs.org', 'python.org', 'php.net',
  'react.dev', 'vuejs.org', 'nextjs.org', 'tailwindcss.com', 'developer.aliyun.com',
  'cloud.tencent.com', 'segmentfault.com', 'gitee.com', 'csdn.net', 'cnblogs.com',
  'zh.wikipedia.org', 'wikipedia.org', 'stackoverflow.com', 'stackexchange.com',
  'www.autohome.com.cn', 'www.dongchedi.com', 'www.chinaunicom.com.cn', 'www.chinamobile.com',
  'www.cctv.com', 'www.xinhuanet.com', 'www.people.com.cn', 'www.sina.com.cn', 'www.sohu.com',
  'www.douban.com', 'www.dianping.com', 'www.juejin.cn', 'www.iqiyi.com', 'www.youku.com',
];

const blockedKeywords = ['crack', 'pirate', '破解', '盗版', '激活', '注册机', 'keygen', 'serial', 'hack', '入侵', '攻击', '病毒', '恶意', '色情', '成人', '赌博', '博彩', '毒品', '违法'];

export function computeComplianceLevel(tool: Pick<Tool, 'complianceLevel' | 'externalUrl' | 'name'>): ComplianceLevel {
  if (tool.complianceLevel) return tool.complianceLevel;
  if (!tool.externalUrl) return 'green';
  const lowerName = tool.name.toLowerCase();
  for (const keyword of blockedKeywords) {
    if (lowerName.includes(keyword.toLowerCase())) return 'red';
  }
  try {
    const parsed = new URL(tool.externalUrl);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname.endsWith('.cn') || hostname.includes('.cn.')) return 'green';
    for (const domain of verifiedDomains) {
      if (hostname === domain || hostname.endsWith(\`.\${domain}\`)) return 'green';
    }
    return 'yellow';
  } catch {
    return 'yellow';
  }
}
`;

const SHARED_PATH = path.join(ROOT, 'data', 'tools-shared.ts');
fs.writeFileSync(SHARED_PATH, SHARED_TS);
console.log('[split-tools] Wrote:', path.relative(ROOT, SHARED_PATH),
            Math.round(fs.statSync(SHARED_PATH).size / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 4) data/tools-index.ts + tools-index.json                        */
/* ---------------------------------------------------------------- */
/* 真实 JSON 文件（Next/TS 原生支持 JSON import，绕开 union type 爆炸） */
const INDEX_JSON_PATH = path.join(ROOT, 'data', 'tools-index.json');
fs.writeFileSync(INDEX_JSON_PATH, JSON.stringify(indexArr));
console.log('[split-tools] Wrote:', path.relative(ROOT, INDEX_JSON_PATH),
            Math.round(fs.statSync(INDEX_JSON_PATH).size / 1024), 'KB');

const INDEX_TS_PATH = path.join(ROOT, 'data', 'tools-index.ts');
const INDEX_TS_TPL = `import type { ToolIndexItem } from '@/data/tools-shared';
import _json from './tools-index.json';

/**
 * 薄索引：ToolCard/SearchDropdown/HomeDashboard 列表需要的字段。
 * 真实 JSON 文件在同级 tools-index.json 存放，TS 侧直接 import + 类型断言。
 */
export const TOOLS_INDEX = _json as unknown as ToolIndexItem[];
`;
fs.writeFileSync(INDEX_TS_PATH, INDEX_TS_TPL);
console.log('[split-tools] Wrote:', path.relative(ROOT, INDEX_TS_PATH),
            Math.round(fs.statSync(INDEX_TS_PATH).size / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 5) data/tools-detail.ts + tools-detail.json                      */
/* ---------------------------------------------------------------- */
const DETAIL_JSON_PATH = path.join(ROOT, 'data', 'tools-detail.json');
fs.writeFileSync(DETAIL_JSON_PATH, JSON.stringify(detailMap));
console.log('[split-tools] Wrote:', path.relative(ROOT, DETAIL_JSON_PATH),
            Math.round(fs.statSync(DETAIL_JSON_PATH).size / 1024), 'KB');

const DETAIL_TS_PATH = path.join(ROOT, 'data', 'tools-detail.ts');
const DETAIL_TS_TPL = `import type { ToolDetailItem } from '@/data/tools-shared';
import _json from './tools-detail.json';

/**
 * 详情 map：按 slug → relatedTools/externalUrl/payment/signup + 多语言字段
 * JSON 文件在同级 tools-detail.json 存放。
 */
export const TOOLS_DETAIL_MAP = _json as unknown as Record<string, ToolDetailItem>;
`;
fs.writeFileSync(DETAIL_TS_PATH, DETAIL_TS_TPL);
console.log('[split-tools] Wrote:', path.relative(ROOT, DETAIL_TS_PATH),
            Math.round(fs.statSync(DETAIL_TS_PATH).size / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 6) 重写 data/tools.ts（向后兼容合并层）                              */
/* ---------------------------------------------------------------- */
const COMPAT_TS = `import type { Tool, ToolIndexItem, ToolDetailItem, ComplianceLevel, Difficulty, Platform, AccessTag, PaymentMethod, SignupType } from '@/data/tools-shared';
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
`;

fs.writeFileSync(SRC, COMPAT_TS);
console.log('[split-tools] Rewrote:', path.relative(ROOT, SRC),
            Math.round(fs.statSync(SRC).size / 1024), 'KB');

console.log('[split-tools] OK. Verify with: pnpm tsc --noEmit -p tsconfig.json 2>&1 | head -40');
