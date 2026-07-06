/// <reference types="@cloudflare/workers-types" />
// Cloudflare Pages Functions: POST /api/ai-recommend
// 部署时会自动打包，不受 Next.js output:'export' 静态导出剥离影响。
//
// Cloudflare Pages Dashboard → Functions → Settings → Environment Variables:
//   DEEPSEEK_API_KEY      = <sk-...>  (Secret)
//   DEEPSEEK_API_URL      = https://api.deepseek.com/v1/chat/completions  (optional)
//   DEEPSEEK_MODEL        = deepseek-chat  (optional)

import { tools } from '../../data/tools';

export interface Env {
  DB?: D1Database;
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  DEEPSEEK_MODEL?: string;
}

type RecommendResult = {
  reason: string;
  tools: Array<{
    slug: string;
    id?: string;
    name?: string;
    description?: string;
    tags?: unknown;
    category?: string;
    isFree?: boolean;
    aiReason?: string;
  }>;
};

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

function pickToolList(limit = 60) {
  return tools.slice(0, limit).map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    tags: t.tags,
    category: t.category,
    isFree: t.isFree,
  }));
}

export const onRequestOptions: PagesFunction<Env> = async () => corsPreflight();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;
  let payload: { query?: string; locale?: string } = {};
  try {
    payload = (await context.request.json()) as { query?: string; locale?: string };
  } catch {
    return errJson('Invalid JSON body', 400);
  }
  const query = typeof payload?.query === 'string' ? payload.query.trim() : '';
  const locale = ['en', 'zh', 'es', 'hi', 'fr', 'ar'].includes(payload?.locale ?? '') ? (payload.locale as 'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar') : 'zh';
  if (!query) return errJson('Query is required', 400);

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // 未配置时走关键字 fallback，避免 500
    const fallback = fuzzyRecommend(query, locale).slice(0, 5);
    return okJson({
      reason: locale === 'zh' ? '（AI Key 未配置，以下为关键字匹配结果）' : '(AI key not configured; keyword fallback shown)',
      tools: fallback,
    });
  }
  const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

  const toolList = pickToolList(60);
  const systemPrompt = `You are Korelyy Tools recommendation assistant. Based on user natural language need, recommend 5-10 most relevant tools from the provided tool list. Respond strictly in JSON format {reason: string, tools: [{slug: string, reason: string}]}. The tool slug must exactly match entries — never invent slugs.

Language for reason: ${locale === 'zh' ? 'Simplified Chinese' : 'English'}

Tool list JSON:
${JSON.stringify(toolList)}`;
  const userPrompt = locale === 'zh'
    ? `用户需求：${query}\n请输出严格 JSON：{reason, tools:[{slug, reason}]}`
    : `User need: ${query}\nRespond strictly with JSON: {reason, tools:[{slug, reason}]}`;

  let aiResp: Response;
  try {
    aiResp = await fetch(apiUrl, {
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
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (e) {
    console.error('[ai-recommend] upstream fetch failed:', e);
    return okJson({
      reason: locale === 'zh' ? '（AI 暂不可用，以下为关键字匹配）' : '(AI unavailable; keyword fallback shown)',
      tools: fuzzyRecommend(query, locale).slice(0, 5),
    });
  }

  if (!aiResp.ok) {
    const txt = await aiResp.text().catch(() => '');
    console.error('[ai-recommend] upstream error:', aiResp.status, txt.slice(0, 400));
    return okJson({
      reason: locale === 'zh' ? '（AI 暂不可用，关键字匹配）' : '(AI unavailable; keyword fallback shown)',
      tools: fuzzyRecommend(query, locale).slice(0, 5),
    });
  }

  let result: RecommendResult = { reason: '', tools: [] };
  try {
    const data = await aiResp.json() as any;
    const content = data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content) as Partial<RecommendResult> & { tools?: any[] };
    const reason = typeof parsed?.reason === 'string' ? parsed.reason : '';
    const recommended = (Array.isArray(parsed?.tools) ? parsed.tools : [])
      .map((t: any) => {
        const slug = typeof t?.slug === 'string' ? t.slug : (typeof t?.id === 'string' ? t.id : '');
        if (!slug) return null;
        const tool = tools.find((x) => x.slug === slug);
        if (!tool) return null;
        return { ...tool, aiReason: typeof t?.reason === 'string' ? t.reason : '' };
      })
      .filter(Boolean) as RecommendResult['tools'];
    result = { reason, tools: recommended.slice(0, 5) };
    if (result.tools.length === 0) {
      result.tools = fuzzyRecommend(query, locale).slice(0, 3);
    }
  } catch (e) {
    console.error('[ai-recommend] parse failed:', e);
    result = {
      reason: '',
      tools: fuzzyRecommend(query, locale).slice(0, 5),
    };
  }
  return okJson(result);
};

function fuzzyRecommend(query: string, locale: 'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar'): RecommendResult['tools'] {
  const q = query.toLowerCase();
  const scored = tools
    .map((t) => {
      const hay = [
        t.slug,
        t.name,
        typeof t.description === 'string' ? t.description : '',
        Array.isArray(t.tags) ? t.tags.join(' ') : '',
        t.category || '',
      ].join(' ').toLowerCase();
      let score = 0;
      for (const tok of q.split(/[\s,，。、]+/).filter(Boolean)) {
        if (hay.includes(tok)) score += Math.max(1, 6 - tok.length);
      }
      return { tool: t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => ({ ...x.tool, aiReason: locale === 'zh' ? '关键词匹配' : 'Keyword match' }));
  return scored;
}
