import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';

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

    const toolList = tools.slice(0, 60).map(t => ({
      slug: t.slug,
      name: t.name,
      description: t.description,
      tags: t.tags,
      category: t.category,
      isFree: t.isFree,
    }));

    const systemPrompt = `你是 Korelyy Tools 工具推荐助手。根据用户自然语言描述，从 data/tools.ts 的工具列表中推荐 5-10 个最相关的工具，以 JSON 数组返回。工具 id 必须严格与 allTools 中一致，不得编造。返回格式为 [{id, reason}]。

工具列表：
${JSON.stringify(toolList, null, 2)}

语言：${locale === 'zh' ? '中文' : 'English'}`;

    const userPrompt = locale === 'zh'
      ? `用户需求：${query}\n\n请推荐最合适的工具。`
      : `User need: ${query}\n\nPlease recommend the most suitable tools.`;

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
        temperature: 0.3,
        max_tokens: 500,
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
      result = { reason: '', tools: [] };
    }

    const recommendedTools = (result.tools || [])
      .map((t: { slug: string; reason: string }) => {
        const tool = tools.find(tool => tool.slug === t.slug);
        return tool ? { ...tool, aiReason: t.reason } : null;
      })
      .filter(Boolean)
      .slice(0, 5);

    return NextResponse.json({
      reason: result.reason || '',
      tools: recommendedTools,
    });
  } catch (error) {
    console.error('AI recommend error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


