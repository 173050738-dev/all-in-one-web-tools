/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  DEEPSEEK_MODEL?: string;
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
    let payload: { query?: string; locale?: string } = {};
    try {
      payload = (await context.request.json()) as { query?: string; locale?: string };
    } catch {
      return errJson('Invalid JSON body', 400);
    }

    const { query, locale = 'zh' } = payload;

    if (!query?.trim()) {
      return errJson('Query is required', 400);
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return errJson('API key not configured', 500);
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个专业的任务拆解助手。根据用户的模糊目标，将其拆解为 5-8 个具体、可执行的步骤。每个步骤应该清晰、明确，有可衡量的产出。

返回格式要求（必须是有效的 JSON）：
{
  "title": "拆解后的任务标题",
  "steps": [
    {
      "number": 1,
      "title": "步骤标题",
      "description": "详细说明这一步要做什么",
      "expectedOutput": "预期产出或结果",
      "estimatedTime": "预估时间"
    }
  ],
  "totalTime": "总预估时间",
  "tips": ["执行建议1", "执行建议2"]
}

请用 ${langLabel} 输出。`;

    const userPrompt = locale === 'zh'
      ? `用户目标：${query}\n\n请将这个目标拆解为具体的执行步骤。`
      : locale === 'es'
      ? `Objetivo del usuario: ${query}\n\nDesglose este objetivo en pasos ejecutables.`
      : locale === 'fr'
      ? `Objectif utilisateur: ${query}\n\nDécomposez cet objectif en étapes exécutables.`
      : locale === 'hi'
      ? `उपयोगकर्ता लक्ष्य: ${query}\n\nइस लक्ष्य को विशिष्ट कदमों में तोड़ें।`
      : locale === 'ar'
      ? `الهدف: ${query}\n\nقم بتقسيم هذا الهدف إلى خطوات تنفيذية.`
      : `User goal: ${query}\n\nBreak this goal into actionable steps.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return errJson('AI service unavailable', 502);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      return errJson('Failed to parse AI response', 500);
    }

    const validSteps = (result.steps || []).filter(
      (s: { title: string; description: string }) => s.title && s.description
    );

    if (validSteps.length === 0) {
      return errJson('No valid steps generated', 500);
    }

    return okJson({
      title: result.title || '',
      steps: validSteps,
      totalTime: result.totalTime || '',
      tips: result.tips || [],
    });
  } catch (error) {
    console.error('Task breakdown error:', error);
    return errJson('Internal server error', 500);
  }
};