import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, locale = 'zh' } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
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
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const validSteps = (result.steps || []).filter(
      (s: { title: string; description: string }) => s.title && s.description
    );

    if (validSteps.length === 0) {
      return NextResponse.json({ error: 'No valid steps generated' }, { status: 500 });
    }

    return NextResponse.json({
      title: result.title || '',
      steps: validSteps,
      totalTime: result.totalTime || '',
      tips: result.tips || [],
    });
  } catch (error) {
    console.error('Task breakdown error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
