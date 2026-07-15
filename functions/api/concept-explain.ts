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
    let payload: { concept?: string; locale?: string } = {};
    try {
      payload = (await context.request.json()) as { concept?: string; locale?: string };
    } catch {
      return errJson('Invalid JSON body', 400);
    }

    const { concept, locale = 'zh' } = payload;

    if (!concept?.trim()) {
      return errJson('Concept is required', 400);
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return errJson('API key not configured', 500);
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个专业的概念解释助手。用简单易懂的语言解释复杂概念，就像给小学生讲解一样。

解释要求：
1. 用简单的语言，避免专业术语
2. 给出生活化的例子帮助理解
3. 解释核心原理和关键点
4. 如果是技术概念，用类比的方式解释

返回格式要求（必须是有效的 JSON）：
{
  "concept": "要解释的概念",
  "simpleExplanation": "简单易懂的解释",
  "analogy": "生活化类比（帮助理解）",
  "keyPoints": ["关键点1", "关键点2", "关键点3"],
  "example": "一个实际例子",
  "relatedConcepts": ["相关概念1", "相关概念2"]
}

请用 ${langLabel} 输出。`;

    const userPrompt = locale === 'zh'
      ? `请用简单易懂的语言解释这个概念：${concept}`
      : locale === 'es'
      ? `Explica este concepto en lenguaje simple: ${concept}`
      : locale === 'fr'
      ? `Expliquez ce concept en langage simple: ${concept}`
      : locale === 'hi'
      ? `इस अवधारणा को सरल भाषा में समझाइए: ${concept}`
      : locale === 'ar'
      ? `أشرح هذا المفهوم بلغة بسيطة: ${concept}`
      : `Explain this concept in simple terms: ${concept}`;

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

    if (!result.simpleExplanation) {
      return errJson('No explanation generated', 500);
    }

    return okJson({
      concept: concept,
      simpleExplanation: result.simpleExplanation,
      analogy: result.analogy || '',
      keyPoints: result.keyPoints || [],
      example: result.example || '',
      relatedConcepts: result.relatedConcepts || [],
    });
  } catch (error) {
    console.error('Concept explain error:', error);
    return errJson('Internal server error', 500);
  }
};