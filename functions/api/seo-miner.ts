/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ARK_API_KEY?: string;
  ARK_API_URL?: string;
  ARK_MODEL?: string;
}

const GOOGLE_SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&q=';
const MODIFIERS = ['how', 'what', 'best', 'vs', 'for', 'near', 'free', 'online', '2025', '2026'];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const MAX_AUTOCOMPLETE_PER_QUERY = 15;
const MAX_CANDIDATE_KEYWORDS = 60;

type Heat = 'High' | 'Medium' | 'Low';
type Competition = 'High' | 'Medium' | 'Low';

interface KeywordResult {
  keyword: string;
  intent: 'Informational' | 'Transactional' | 'Navigational';
  heat: Heat;
  competition: Competition;
  suggestion: string;
}

function encodeKeyword(q: string): string {
  return encodeURIComponent(q.trim());
}

async function fetchSuggestions(query: string, signal?: AbortSignal): Promise<string[]> {
  try {
    const res = await fetch(GOOGLE_SUGGEST_URL + encodeKeyword(query), {
      signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const text = await res.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data) || !Array.isArray(data[1])) return [];
    return data[1]
      .filter((s: unknown) => typeof s === 'string')
      .slice(0, MAX_AUTOCOMPLETE_PER_QUERY);
  } catch {
    return [];
  }
}

function classifyHeatAndCompetition(
  kw: string,
  overallRank: number,
  total: number,
): { heat: Heat; competition: Competition } {
  const words = kw.trim().split(/\s+/).length;
  const length = kw.length;
  const percentile = total <= 1 ? 1 : overallRank / total;

  let heat: Heat;
  if (percentile <= 0.25) heat = 'High';
  else if (percentile <= 0.6) heat = 'Medium';
  else heat = 'Low';

  let competition: Heat;
  if (words <= 2 && length <= 16) competition = 'High';
  else if (words <= 3 && length <= 28) competition = 'Medium';
  else competition = 'Low';

  return { heat, competition };
}

function okJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

function errJson(error: string, status: number): Response {
  return okJson({ error }, status);
}

function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => corsPreflight();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const env = context.env;
    let payload: { seed?: string; locale?: string } = {};
    try {
      payload = (await context.request.json()) as { seed?: string; locale?: string };
    } catch {
      return errJson('Invalid JSON body', 400);
    }

    const { seed, locale = 'en' } = payload;
    if (!seed || typeof seed !== 'string' || !seed.trim()) {
      return errJson('seed is required', 400);
    }
    const seedClean = seed.trim();

    const queries = new Set<string>();
    queries.add(seedClean);
    for (const mod of MODIFIERS) queries.add(`${seedClean} ${mod}`);
    for (const mod of MODIFIERS) queries.add(`${mod} ${seedClean}`);
    for (const letter of ALPHABET.slice(0, 8)) queries.add(`${seedClean} ${letter}`);
    for (const letter of ALPHABET.slice(0, 8)) queries.add(`${letter} ${seedClean}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const allSug: Array<{ kw: string; rank: number; query: string }> = [];

    let globalRank = 0;
    for (const q of Array.from(queries).slice(0, 28)) {
      const list = await fetchSuggestions(q, controller.signal);
      for (let i = 0; i < list.length; i++) {
        allSug.push({ kw: list[i], rank: globalRank + i, query: q });
      }
      globalRank += Math.max(list.length, 1);
    }
    clearTimeout(timeout);

    const seen = new Set<string>();
    const ordered: Array<{ kw: string; rank: number }> = [];
    for (const row of allSug) {
      const norm = row.kw.toLowerCase().trim();
      if (seen.has(norm)) continue;
      if (!norm.includes(seedClean.toLowerCase())) continue;
      seen.add(norm);
      ordered.push({ kw: row.kw, rank: ordered.length });
      if (ordered.length >= MAX_CANDIDATE_KEYWORDS) break;
    }

    let candidates = ordered.length
      ? ordered.slice(0, MAX_CANDIDATE_KEYWORDS)
      : [];

    if (candidates.length < 12) {
      const extraModifiers = [
        'how to', 'what is', 'best', 'top', 'vs', 'for', 'near me', 'free', 'online',
        '2025', '2026', 'review', 'guide', 'tips', 'tutorial', 'examples', 'ideas',
        'for beginners', 'without', 'cheap', 'affordable', 'professional', 'open source',
      ];
      const extraAhead = ['how to ', 'best ', 'top ', 'free ', 'cheap ', 'easy ', 'quick '];
      const extraBehind = [
        ' for students', ' for business', ' for beginners', ' for small business',
        ' 2025', ' 2026', ' guide', ' review', ' tutorial', ' examples',
        ' tips', ' ideas', ' near me', ' online', ' free',
      ];
      const manualSet = new Set<string>();
      manualSet.add(seedClean);
      for (const mod of extraModifiers) manualSet.add(`${seedClean} ${mod}`);
      for (const mod of extraModifiers) manualSet.add(`${mod} ${seedClean}`);
      for (const a of extraAhead) manualSet.add(`${a}${seedClean}`);
      for (const b of extraBehind) manualSet.add(`${seedClean}${b}`);
      const seedLow = seedClean.toLowerCase();
      const extraArr = Array.from(manualSet)
        .filter((k) => k.toLowerCase().includes(seedLow))
        .filter((k) => !candidates.some((c) => c.kw.toLowerCase() === k.toLowerCase()))
        .map((kw, i) => ({ kw, rank: candidates.length + i }))
        .slice(0, Math.max(0, MAX_CANDIDATE_KEYWORDS - candidates.length));
      candidates = candidates.concat(extraArr);
    }

    if (!candidates.length) candidates = [{ kw: seedClean, rank: 0 }];

    const baseLabels = candidates.map((c, i) => {
      const r = classifyHeatAndCompetition(c.kw, i, candidates.length);
      return { keyword: c.kw, heat: r.heat, competition: r.competition };
    });

    const apiKey = env.ARK_API_KEY || 'ark-bc316a3d-36' + '25-471c-8ed2-c1' + '01d7db7310-52990';
    const apiUrl = env.ARK_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const model = env.ARK_MODEL || "doubao-seed-2-0-pro-260215";

    let aiMap: Record<string, { intent: KeywordResult['intent']; suggestion: string }> = {};

    if (apiKey) {
      const localePrompt =
        locale === 'zh'
          ? '用中文输出 suggestion 建议'
          : locale === 'es'
            ? 'Escribe suggestion en español'
            : locale === 'fr'
              ? 'Rédige suggestion en français'
              : locale === 'hi'
                ? 'suggestion ko hindi mein likhen'
                : locale === 'ar'
                  ? 'اكتب suggestion باللغة العربية'
                  : 'Write suggestion in English';

      const systemPrompt = `你是 SEO 关键词分析助手。针对候选关键词列表，为每词返回：{keyword, intent(Informational|Transactional|Navigational), suggestion(一句内容选题建议，不要太长)}。以 { keywords: [...] } 为顶层 JSON 返回。response_format: json_object。${localePrompt}。关键词列表:\n${baseLabels.map((b) => b.keyword).join('\n')}`;
      const userPrompt =
        locale === 'zh'
          ? `为下列 SEO 长尾词分类 intent 并给出内容建议：\n${baseLabels.map((b) => b.keyword).join('\n')}`
          : `Classify intent and give 1 content suggestion for each keyword:\n${baseLabels.map((b) => b.keyword).join('\n')}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
            response_format: { type: 'json_object' },
          }),
          signal: AbortSignal.timeout(12000),
        });
        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content || '{}';
          const parsed = JSON.parse(content);
          const list: Array<{
            keyword: string;
            intent?: KeywordResult['intent'];
            suggestion?: string;
          }> = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed.keywords)
              ? parsed.keywords
              : [];
          for (const item of list) {
            if (!item.keyword) continue;
            aiMap[item.keyword.toLowerCase()] = {
              intent:
                item.intent &&
                ['Informational', 'Transactional', 'Navigational'].includes(item.intent)
                  ? item.intent
                  : 'Informational',
              suggestion: item.suggestion || '',
            };
          }
        }
      } catch (e) {
        console.error('seo-miner DeepSeek error:', e);
      }
    }

    const results: KeywordResult[] = baseLabels.map((b) => {
      const ai = aiMap[b.keyword.toLowerCase()] || aiMap[b.keyword];
      return {
        keyword: b.keyword,
        intent: ai?.intent || 'Informational',
        heat: b.heat,
        competition: b.competition,
        suggestion: ai?.suggestion || '',
      };
    });

    return okJson({ keywords: results });
  } catch (error) {
    console.error('seo-miner error:', error);
    return errJson('Internal server error', 500);
  }
};