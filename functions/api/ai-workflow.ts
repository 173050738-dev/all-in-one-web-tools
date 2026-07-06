/// <reference types="@cloudflare/workers-types" />
// Cloudflare Pages Functions: POST /api/ai-workflow
// 不受 Next.js output:'export' 静态导出剥离影响。
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

type Step = {
  toolSlug?: string;
  title: string;
  description: string;
  toolName?: string;
  purpose?: string;
  inputFromPrev?: string;
  outputToNext?: string;
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

  const toolList = tools.slice(0, 80).map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    tags: t.tags,
    category: t.category,
    isFree: t.isFree,
  }));

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return okJson(
      {
        title: locale === 'zh' ? '示例工作流（AI 未配置）' : 'Sample workflow (AI not configured)',
        description:
          locale === 'zh'
            ? '请在 Pages Functions 配置 DEEPSEEK_API_KEY 环境变量以启用 AI 工作流生成。'
            : 'Configure DEEPSEEK_API_KEY env var in Pages Functions to enable AI workflow generation.',
        icon: 'Zap',
        category: 'content-creator',
        tags: [],
        estimatedTime: locale === 'zh' ? '视情况而定' : 'Depends',
        difficulty: 'easy',
        steps: keywordWorkflow(query, locale),
      },
      200
    );
  }
  const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

  const systemPrompt = `You are Korelyy Tools workflow planner. Given user task description, recommend 2-5 chained tools from the provided list. Each step explains: tool slug (toolSlug = exact slug from list; don't invent), title, description, inputFromPrev (what it takes from previous step, empty for first), outputToNext (what it passes to next). Respond strictly JSON:
{title:string, description:string, icon:string, category:string, tags:string[], estimatedTime:string, difficulty:"easy"|"medium"|"advanced", steps:[{toolSlug,title,description,inputFromPrev,outputToNext}]}
Language: ${locale === 'zh' ? 'Simplified Chinese for all text fields' : 'English for all text fields'}
Tool list JSON:
${JSON.stringify(toolList)}`;
  const userPrompt =
    locale === 'zh'
      ? `用户任务：${query}\n请输出严格 JSON：{title,description,icon,category,tags,estimatedTime,difficulty,steps:[...]}`
      : `User task: ${query}\nRespond strictly with JSON object as described.`;

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
        temperature: 0.5,
        max_tokens: 800,
      }),
    });
  } catch (e) {
    console.error('[ai-workflow] upstream fetch failed:', e);
    return okJson({
      title: locale === 'zh' ? '关键字工作流（AI 暂不可用）' : 'Keyword workflow (AI unavailable)',
      description: '',
      icon: 'Zap',
      category: 'content-creator',
      tags: [],
      estimatedTime: locale === 'zh' ? '视情况而定' : 'Depends',
      difficulty: 'easy',
      steps: keywordWorkflow(query, locale),
    });
  }

  if (!aiResp.ok) {
    const txt = await aiResp.text().catch(() => '');
    console.error('[ai-workflow] upstream error:', aiResp.status, txt.slice(0, 400));
    return okJson({
      title: locale === 'zh' ? '关键字工作流（AI 暂不可用）' : 'Keyword workflow (AI unavailable)',
      description: '',
      icon: 'Zap',
      category: 'content-creator',
      tags: [],
      estimatedTime: locale === 'zh' ? '视情况而定' : 'Depends',
      difficulty: 'easy',
      steps: keywordWorkflow(query, locale),
    });
  }

  try {
    const data = (await aiResp.json()) as any;
    const content = data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content) as any;
    const validSteps = (Array.isArray(parsed?.steps) ? parsed.steps : [])
      .filter((s: Step) => {
        const toolSlug = typeof s?.toolSlug === 'string' ? s.toolSlug : '';
        const ok = !!(toolSlug && typeof s.title === 'string' && typeof s.description === 'string' && tools.find((t) => t.slug === toolSlug));
        return ok;
      })
      .slice(0, 6);
    if (validSteps.length === 0) {
      return okJson({
        title:
          locale === 'zh' ? '关键字工作流（AI 未产出有效步骤）' : 'Keyword workflow (AI produced no valid steps)',
        description: '',
        icon: 'Zap',
        category: 'content-creator',
        tags: [],
        estimatedTime: locale === 'zh' ? '视情况而定' : 'Depends',
        difficulty: 'easy',
        steps: keywordWorkflow(query, locale),
      });
    }
    return okJson({
      title: typeof parsed?.title === 'string' ? parsed.title : locale === 'zh' ? 'AI 生成的工作流' : 'AI Generated Workflow',
      description: typeof parsed?.description === 'string' ? parsed.description : '',
      icon: typeof parsed?.icon === 'string' ? parsed.icon : 'Zap',
      category: typeof parsed?.category === 'string' ? parsed.category : 'content-creator',
      tags: Array.isArray(parsed?.tags) ? parsed.tags.filter((x: unknown) => typeof x === 'string').slice(0, 8) : [],
      estimatedTime: typeof parsed?.estimatedTime === 'string' ? parsed.estimatedTime : locale === 'zh' ? '视情况而定' : 'Depends',
      difficulty: ['easy', 'medium', 'advanced'].includes(parsed?.difficulty) ? parsed.difficulty : 'easy',
      steps: validSteps,
    });
  } catch (e) {
    console.error('[ai-workflow] parse failed:', e);
    return errJson('Failed to parse AI response', 500);
  }
};

function keywordWorkflow(query: string, locale: 'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar'): Step[] {
  const q = query.toLowerCase();
  const hits = tools
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
    .slice(0, 4);
  if (hits.length === 0) {
    return [
      {
        toolSlug: 'markdown-preview',
        title: locale === 'zh' ? '先用 Markdown 编辑器整理需求' : 'Draft the task in Markdown first',
        description: locale === 'zh' ? '描述任务背景和输入输出。' : 'Describe task scope and inputs/outputs.',
        inputFromPrev: '',
        outputToNext: locale === 'zh' ? '结构化描述' : 'Structured brief',
      },
    ];
  }
  return hits.map((x, idx) => ({
    toolSlug: x.tool.slug,
    title: x.tool.name || x.tool.slug,
    description: typeof x.tool.description === 'string' ? x.tool.description : '',
    inputFromPrev: idx === 0 ? '' : locale === 'zh' ? '上一步输出' : 'Previous output',
    outputToNext: idx === hits.length - 1 ? locale === 'zh' ? '最终成果' : 'Final result' : locale === 'zh' ? '中间结果' : 'Intermediate result',
  }));
}
