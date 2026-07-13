/* eslint-disable */
/*
 * 构建时预生成静态数据子集脚本
 * 运行：node scripts/build-data-bundles.cjs
 * 作用：
 *  1) 生成 data/_static-counts.generated.ts — 预计算 categories/tools 的计数，让 categories.ts 不顶层 import tools
 *  2) 生成 data/_initial-home.generated.ts    — 首屏 20 条最热工具，让首页 HTML 不再内联 1056 条工具
 *
 * 注意：此脚本直接用 Node 原生 + fs 读取 data/tools.ts（通过正则快速解析，不依赖 TS 编译），
 *       保证在 "next build" 之前可独立运行（prebuild 阶段）。
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TOOLS_INDEX_JSON = path.join(PROJECT_ROOT, 'data', 'tools-index.json');
const TOOLS_DETAIL_JSON = path.join(PROJECT_ROOT, 'data', 'tools-detail.json');
const CATEGORIES_TS = path.join(PROJECT_ROOT, 'data', 'categories.ts');
const OUT_COUNTS = path.join(PROJECT_ROOT, 'data', '_static-counts.generated.ts');
const OUT_INITIAL = path.join(PROJECT_ROOT, 'data', '_initial-home.generated.ts');

function parseToolsFromSource(_srcUnused) {
  // 直接从真源 JSON 读取（tools-index.json = 薄索引，tools-detail.json = 详情），
  // 不再正则解析 data/tools.ts 的字面量数组，重构 tools.ts 不会破坏 prebuild。
  const indexArr = JSON.parse(fs.readFileSync(TOOLS_INDEX_JSON, 'utf8'));
  const detailMap = JSON.parse(fs.readFileSync(TOOLS_DETAIL_JSON, 'utf8'));
  if (!Array.isArray(indexArr)) throw new Error(`tools-index.json: expected array, got ${typeof indexArr}`);
  if (typeof detailMap !== 'object' || detailMap === null) throw new Error(`tools-detail.json: expected object, got ${typeof detailMap}`);

  return indexArr.map((idx) => {
    const det = detailMap[idx.slug] || { relatedTools: [] };
    const t = {
      id: idx.id || '',
      slug: idx.slug || '',
      name: idx.name || '',
      description: idx.description || '',
      category: idx.category || '',
      tags: Array.isArray(idx.tags) ? idx.tags : [],
      isFree: !!idx.isFree,
      isLimitedFree: idx.isLimitedFree !== undefined ? idx.isLimitedFree : undefined,
      icon: idx.icon || '',
      relatedTools: Array.isArray(det.relatedTools) ? det.relatedTools : [],
      externalUrl: idx.externalUrl !== undefined ? idx.externalUrl : undefined,
      likes: typeof idx.likes === 'number' ? idx.likes : 0,
      difficulty: idx.difficulty !== undefined ? idx.difficulty : undefined,
      complianceLevel: idx.complianceLevel !== undefined ? idx.complianceLevel : undefined,
      platform: idx.platform !== undefined ? idx.platform : undefined,
      accessTag: idx.accessTag !== undefined ? idx.accessTag : undefined,
      localProcessing: idx.localProcessing !== undefined ? idx.localProcessing : undefined,
      signup: Array.isArray(det.signup) ? det.signup : undefined,
      payment: Array.isArray(det.payment) ? det.payment : undefined,
    };
    // 兼容原先 parseToolsFromSource 返回的 _rawBlock（给下游生成 TS 字面量用）
    const parts = [];
    for (const [k, v] of Object.entries(t)) {
      if (v === undefined) continue;
      parts.push(`${k}:${JSON.stringify(v)}`);
    }
    t._rawBlock = '{' + parts.join(',') + '}';
    return t;
  });
}

function parseCategories(src) {
  const startRe = /export\s+const\s+categories\s*:\s*Category\[\]\s*=\s*\[/;
  const startMatch = src.match(startRe);
  if (!startMatch) throw new Error('categories.ts: array start not found');
  let i = startMatch.index + startMatch[0].length;
  const len = src.length;
  while (i < len && /\s/.test(src[i])) i++;
  const ids = [];
  while (i < len && src[i] === '{') {
    let depth = 0;
    let inStr = '';
    let escape = false;
    const start = i;
    while (i < len) {
      const c = src[i];
      if (inStr) {
        if (escape) { escape = false; i++; continue; }
        if (c === '\\') { escape = true; i++; continue; }
        if (c === inStr) { inStr = ''; i++; continue; }
        i++; continue;
      }
      if (c === '"' || c === "'" || c === '`') { inStr = c; i++; continue; }
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { i++; break; }
      }
      i++;
    }
    const block = src.slice(start, i);
    const idM = block.match(/(^|,|\{)\s*id\s*:\s*(['"`])([^'"`]+)\2/);
    if (idM) ids.push(idM[3]);
    while (i < len && (src[i] === ',' || /\s/.test(src[i]))) i++;
  }
  return ids;
}

function computeComplianceLevel(tool) {
  if (tool.complianceLevel) return tool.complianceLevel;
  const isCn = /中国|国内|备案|中文|[\\u4e00-\\u9fa5]{2,}/.test((tool.name || '') + (tool.description || ''));
  if (tool.signup?.includes('cn-phone') || tool.payment?.includes('alipay') || tool.payment?.includes('wechat')) return 'yellow';
  if (isCn) return 'yellow';
  return 'green';
}

function escapeTsString(s) {
  if (s == null) return 'undefined';
  s = String(s);
  return JSON.stringify(s);
}

function toolToTsLiteral(t, includeRawBlockLevel = 'medium') {
  // includeRawBlockLevel: 'full' (all fields) | 'medium' (首屏需要的字段) | 'lite' (只 id+slug+name+likes)
  const fields = {
    id: escapeTsString(t.id),
    slug: escapeTsString(t.slug),
    name: escapeTsString(t.name),
    description: escapeTsString(t.description),
    category: escapeTsString(t.category),
    tags: JSON.stringify(t.tags || []),
    isFree: String(!!t.isFree),
    icon: escapeTsString(t.icon),
    relatedTools: JSON.stringify(t.relatedTools || []),
    likes: String(t.likes || 0),
    difficulty: t.difficulty ? escapeTsString(t.difficulty) : 'undefined',
    complianceLevel: t.complianceLevel ? escapeTsString(t.complianceLevel) : 'undefined',
    platform: t.platform ? escapeTsString(t.platform) : 'undefined',
    accessTag: t.accessTag ? escapeTsString(t.accessTag) : 'undefined',
    localProcessing: t.localProcessing != null ? String(t.localProcessing) : 'undefined',
    signup: (t.signup && t.signup.length) ? JSON.stringify(t.signup) : 'undefined',
    payment: (t.payment && t.payment.length) ? JSON.stringify(t.payment) : 'undefined',
    externalUrl: t.externalUrl ? escapeTsString(t.externalUrl) : 'undefined',
    isLimitedFree: t.isLimitedFree != null ? String(t.isLimitedFree) : 'undefined',
  };
  if (includeRawBlockLevel === 'full') {
    return [
      '{',
      ...Object.entries(fields).map(([k, v], i, arr) => '  ' + k + ': ' + v + (i < arr.length - 1 ? ',' : '')),
      '}',
    ].join('\n');
  }
  // medium: 首页 ToolCard 需要的字段（去掉 signup/payment/externalUrl 大字段）
  const keepKeys = ['id','slug','name','description','category','tags','isFree','isLimitedFree','icon','relatedTools','likes','difficulty','complianceLevel','platform','accessTag','localProcessing'];
  return [
    '{',
    ...keepKeys.map((k, i) => '  ' + k + ': ' + fields[k] + (i < keepKeys.length - 1 ? ',' : '')),
    '}',
  ].join('\n');
}

function main() {
  // parseToolsFromSource 现在直接从真源 JSON 读（TOOLS_INDEX_JSON + TOOLS_DETAIL_JSON），不再解析 tools.ts 字面量
  const tools = parseToolsFromSource(null);
  const catsSrc = fs.readFileSync(CATEGORIES_TS, 'utf8');
  const categoryIds = parseCategories(catsSrc);

  // 计算每个分类计数（预计算常量）
  const countsByCat = {};
  for (const id of categoryIds) countsByCat[id] = 0;
  for (const t of tools) countsByCat[t.category] = (countsByCat[t.category] || 0) + 1;
  const total = tools.length;
  let verifiedCount = 0;
  let pendingCount = 0;
  for (const t of tools) {
    const lv = computeComplianceLevel(t);
    if (lv === 'red') pendingCount++; else verifiedCount++;
  }

  // 写出 static-counts
  const countsOut = [
    '// ============================================================',
    '// 此文件由 scripts/build-data-bundles.cjs 自动生成，请勿手改！',
    '// 预计算分类计数 / 总体统计，让 categories.ts 与首页首屏',
    '// 不必顶层 import tools（1056 条工具 ≈ 几百 KB）。',
    '// ============================================================',
    '',
    `export const STATIC_TOTAL_TOOLS_COUNT: number = ${total};`,
    `export const STATIC_VERIFIED_TOOLS_COUNT: number = ${verifiedCount};`,
    `export const STATIC_PENDING_TOOLS_COUNT: number = ${pendingCount};`,
    '',
    'export const STATIC_CATEGORY_COUNTS: Record<string, number> = {',
  ];
  for (const id of categoryIds) countsOut.push(`  ${JSON.stringify(id)}: ${countsByCat[id]},`);
  countsOut.push('};');
  countsOut.push('');
  countsOut.push('export function getStaticCategoryCount(id: string): number {');
  countsOut.push('  return STATIC_CATEGORY_COUNTS[id] || 0;');
  countsOut.push('}');
  countsOut.push('');
  countsOut.push('export function getStaticTotalTools(): number {');
  countsOut.push('  return STATIC_TOTAL_TOOLS_COUNT;');
  countsOut.push('}');
  countsOut.push('');
  countsOut.push('export interface StaticComplianceStats {');
  countsOut.push('  verifiedCount: number;');
  countsOut.push('  pendingCount: number;');
  countsOut.push('  totalCount: number;');
  countsOut.push('}');
  countsOut.push('');
  countsOut.push('export const STATIC_COMPLIANCE_STATS: StaticComplianceStats = {');
  countsOut.push(`  verifiedCount: ${verifiedCount},`);
  countsOut.push(`  pendingCount: ${pendingCount},`);
  countsOut.push(`  totalCount: ${total},`);
  countsOut.push('};');
  countsOut.push('');
  fs.writeFileSync(OUT_COUNTS, countsOut.join('\n'), 'utf8');
  console.log('[data-bundles] wrote', OUT_COUNTS, '(' + countsByCat.length + ' cats, total=' + total + ')');

  // 首屏 20 条最热工具（按 likes 倒序，过滤掉 red）
  const top = [...tools]
    .filter(t => computeComplianceLevel(t) !== 'red')
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 20);

  const initialOut = [
    '// ============================================================',
    '// 此文件由 scripts/build-data-bundles.cjs 自动生成，请勿手改！',
    '// 首页首屏只加载这 20 条工具（约 4KB），剩余 1036 条工具在',
    '// 水合完成后的 useEffect 中动态 import("@/data/tools") 懒加载。',
    '// 这样首页 HTML 内联数据从 205KB 降到 ~15KB，TTFB 可降到 2s 内。',
    '// ============================================================',
    '',
    'import type { Tool } from "./tools";',
    '',
    `export const INITIAL_HOME_TOOLS_COUNT = ${top.length};`,
    '',
    'export const INITIAL_HOME_TOOLS: Omit<Tool, "signup" | "payment" | "externalUrl">[] = [',
  ];
  for (const t of top) initialOut.push(toolToTsLiteral(t, 'medium') + ',');
  initialOut.push('];');
  initialOut.push('');
  initialOut.push('export const INITIAL_HOME_TOOL_IDS: string[] = INITIAL_HOME_TOOLS.map((t) => t.id);');
  initialOut.push('');
  fs.writeFileSync(OUT_INITIAL, initialOut.join('\n'), 'utf8');
  console.log('[data-bundles] wrote', OUT_INITIAL, '(' + top.length + ' initial tools)');

  // 同时打印报告
  console.log('');
  console.log('== Build Summary ==');
  console.log('Total tools parsed :', total);
  console.log('Verified / Pending :', verifiedCount, '/', pendingCount);
  console.log('Top 20 initial     :', top[0]?.name, '...', top[top.length - 1]?.name);
  console.log('');
}

main();
