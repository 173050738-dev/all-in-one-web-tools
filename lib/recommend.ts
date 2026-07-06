import type { Tool } from '@/data/tools';

export interface HistoryItem {
  toolId: string;
  timestamp: number;
}

export interface RecommendProfile {
  history: HistoryItem[];
  likedIds: string[];
  favoriteIds: string[];
  isAuthed: boolean;
  preferredLocale?: string;
}

interface ToolLite extends Pick<Tool, 'id' | 'slug' | 'category' | 'tags' | 'likes' | 'isFree'> {}

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function timeDecay(ts: number, now: number): number {
  const age = Math.max(0, now - ts);
  const halfLifeHours = 72;
  const decay = Math.exp(-(age / (halfLifeHours * HOUR)) * Math.LN2);
  return decay;
}

export function buildRecommendedOrder<T extends ToolLite>(
  pool: T[],
  profile: RecommendProfile,
  now: number = Date.now(),
): T[] {
  const byId = new Map<string, T>();
  const byAny = new Map<string, T>();
  for (const t of pool) {
    byId.set(t.id, t);
    byAny.set(t.id, t);
    if (t.slug) byAny.set(t.slug, t);
  }
  function resolve(anyKey: string): T | undefined {
    return byAny.get(anyKey);
  }

  const historySet = new Map<string, number>();
  const rawHistory = new Map<string, number>();
  for (const h of profile.history) {
    const prev = rawHistory.get(h.toolId) ?? 0;
    rawHistory.set(h.toolId, Math.max(prev, timeDecay(h.timestamp, now)));
    const t = resolve(h.toolId);
    if (t) historySet.set(t.id, Math.max(historySet.get(t.id) ?? 0, rawHistory.get(h.toolId)!));
  }

  function normalizeIds(list: string[]): Set<string> {
    const out = new Set<string>();
    for (const k of list) {
      const t = resolve(k);
      if (t) out.add(t.id);
      else out.add(k);
    }
    return out;
  }
  const likedSet = normalizeIds(profile.likedIds);
  const favSet = normalizeIds(profile.favoriteIds);

  const categoryCount = new Map<string, number>();
  const tagCount = new Map<string, number>();
  let totalSignal = 0;

  function bumpFromTool(anyKey: string, weight: number) {
    const t = resolve(anyKey);
    if (!t) return;
    totalSignal += weight;
    if (t.category) categoryCount.set(t.category, (categoryCount.get(t.category) ?? 0) + weight);
    for (const tag of t.tags ?? []) {
      if (!tag) continue;
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + weight * 0.6);
    }
  }

  for (const [id, decay] of rawHistory) bumpFromTool(id, 1.2 * decay + 0.1);
  for (const id of profile.likedIds) bumpFromTool(id, 3.2);
  for (const id of profile.favoriteIds) bumpFromTool(id, 5.5);

  const categoryBoostBase = totalSignal > 0 ? Math.min(1.8, 1 + Math.log2(1 + totalSignal / 5)) : 1;

  const maxCatCount = Math.max(1, ...Array.from(categoryCount.values()));
  const maxTagCount = Math.max(1, ...Array.from(tagCount.values()));

  const likedIdsSet = new Set<string>([...likedSet, ...favSet, ...historySet.keys()]);

  const scored = pool.map((tool) => {
    let score = 0;

    if (historySet.has(tool.id)) score += 3.8 * (historySet.get(tool.id) ?? 0);
    if (likedSet.has(tool.id)) score += 4.2;
    if (favSet.has(tool.id)) score += 6.5;

    const catW = categoryCount.get(tool.category);
    if (catW) {
      const rel = catW / maxCatCount;
      score += 2.4 * rel * categoryBoostBase;
    }

    let tagHits = 0;
    for (const tag of tool.tags ?? []) {
      const w = tagCount.get(tag);
      if (w) tagHits += w / maxTagCount;
    }
    if (tagHits > 0) score += Math.min(2.8, tagHits * 2.2);

    const popularity = Math.log10(1 + Math.max(0, (tool.likes ?? 0)));
    score += popularity * (profile.isAuthed ? 0.45 : 0.9);
    if (tool.isFree) score += 0.35;

    const seenBoost = likedIdsSet.has(tool.id) ? 1.05 : 1.25;
    score *= seenBoost;

    return { tool, score };
  });

  scored.sort((a, b) => b.score - a.score + Math.random() * 0.02 - 0.01);

  if (totalSignal > 0 && profile.isAuthed) return scored.map((s) => s.tool);

  // ============== 游客 / 冷启动：「热度 + 分类多样性」重排 ==============
  const perCategoryQuota = 2;
  const remainingQuota = new Map<string, number>();
  const ordered: T[] = [];
  const used = new Set<string>();
  let round = 0;
  let safety = 0;
  while (ordered.length < pool.length && safety++ < pool.length + 50) {
    let pickedAny = false;
    for (const s of scored) {
      if (used.has(s.tool.id)) continue;
      const cat = s.tool.category ?? '__other__';
      const currentLimit = perCategoryQuota + Math.floor(round / 2);
      const have = remainingQuota.get(cat) ?? 0;
      if (have >= currentLimit) continue;
      remainingQuota.set(cat, have + 1);
      used.add(s.tool.id);
      ordered.push(s.tool);
      pickedAny = true;
      if (ordered.length >= pool.length) break;
    }
    if (!pickedAny) break;
    round++;
  }
  for (const s of scored) {
    if (!used.has(s.tool.id)) ordered.push(s.tool);
  }
  return ordered;
}
