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
    let payload: { idea?: string; locale?: string } = {};
    try {
      payload = (await context.request.json()) as { idea?: string; locale?: string };
    } catch {
      return errJson('Invalid JSON body', 400);
    }

    const { idea, locale = 'zh' } = payload;

    if (!idea?.trim()) {
      return errJson('Idea is required', 400);
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return errJson('API key not configured', 500);
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个创意转化助手。将用户的想法、灵感或模糊的创意转化为结构化的行动清单。

转化要求：
1. 识别核心目标
2. 拆解为具体的执行步骤
3. 给出优先级排序
4. 识别潜在资源需求
5. 估算时间

返回格式要求（必须是有效的 JSON）：
{
  "idea": "原始想法",
  "coreGoal": "核心目标",
  "priorityActions": [
    {
      "priority": "high|medium|low",
      "action": "具体行动",
      "description": "详细说明",
      "resourcesNeeded": ["资源1", "资源2"],
      "estimatedTime": "预估时间"
    }
  ],
  "milestones": ["里程碑1", "里程碑2", "里程碑3"],
  "potentialChallenges": ["挑战1", "挑战2"],
  "firstStep": "第一步应该做什么"
}

请用 ${langLabel} 输出。`;

    const userPrompt = locale === 'zh'
      ? `我的想法：${idea}\n\n请将这个想法转化为具体的行动清单。`
      : locale === 'es'
      ? `Mi idea: ${idea}\n\nConvierte esta idea en una lista de acciones concretas.`
      : locale === 'fr'
      ? `Mon idée: ${idea}\n\nConvertissez cette idée en une liste d'actions concrètes.`
      : locale === 'hi'
      ? `मेरा विचार: ${idea}\n\nइस विचार को क्रियाओं की सूची में बदलें।`
      : locale === 'ar'
      ? `فكري: ${idea}\n\nقم بتحويل هذه الفكرة إلى قائمة إجراءات محددة.`
      : `My idea: ${idea}\n\nConvert this idea into a concrete action list.`;

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
        temperature: 0.7,
        max_tokens: 1500,
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

    const validActions = (result.priorityActions || []).filter(
      (a: { action: string }) => a.action
    );

    if (validActions.length === 0) {
      return errJson('No valid actions generated', 500);
    }

    return okJson({
      idea: idea,
      coreGoal: result.coreGoal || '',
      priorityActions: validActions,
      milestones: result.milestones || [],
      potentialChallenges: result.potentialChallenges || [],
      firstStep: result.firstStep || '',
    });
  } catch (error) {
    console.error('Idea to action error:', error);
    return errJson('Internal server error', 500);
  }
};