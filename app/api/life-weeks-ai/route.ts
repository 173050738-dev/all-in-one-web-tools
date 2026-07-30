import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { age, locale = 'zh' } = await req.json();

    if (typeof age !== 'number' || age < 0) {
      return NextResponse.json({ error: 'Valid age is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    const langLabel =
      locale === 'zh' ? '中文'
      : locale === 'es' ? 'español'
      : locale === 'fr' ? 'français'
      : locale === 'hi' ? 'हिन्दी'
      : locale === 'ar' ? 'العربية'
      : 'English';

    const systemPrompt = `你是一个人生规划顾问。根据用户的年龄，生成个性化的"人生阶段建议"和"反思提示"。要求积极正面、有启发性但不说教，结合实际可执行。只返回JSON：{"stage":"人生阶段名称","advice":["建议1","建议2","建议3"],"prompts":["反思问题1","反思问题2","反思问题3","反思问题4","反思问题5"]}。用${langLabel}输出。建议要具体、接地气，不要鸡汤套话。不涉及医疗/心理诊断。`;

    const userPrompt = `用户年龄：${age}岁\n请生成人生阶段建议和5个反思提示。`;

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
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
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

    if (!result.advice || !Array.isArray(result.advice)) {
      return NextResponse.json({ error: 'No advice generated' }, { status: 500 });
    }

    return NextResponse.json({
      stage: result.stage || '',
      advice: (result.advice || []).slice(0, 3).join('\n'),
      prompts: (result.prompts || []).slice(0, 5),
      source: 'ai',
    });
  } catch (error) {
    console.error('Life Weeks AI error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
