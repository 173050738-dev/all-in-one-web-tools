import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, locale = 'zh' } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
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

    const systemPrompt = `你是一个声波艺术解读师。根据用户输入的文字，生成一段趣味"波形解读"——把每个字符的频率/振幅拟人化，写成性格分析风格的短文（像星座解读那样有趣但无害）。同时生成3条适合发社交媒体的配文。只返回JSON：{"reading":"解读文本80-150字","captions":["配文1","配文2","配文3"]}。用${langLabel}输出。解读要积极正面、有趣味，不要涉及负面性格判断或医疗/心理诊断。`;

    const userPrompt = `输入文字：${text}\n请生成波形解读和3条社交配文。`;

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
        temperature: 0.9,
        max_tokens: 800,
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

    if (!result.reading) {
      return NextResponse.json({ error: 'No reading generated' }, { status: 500 });
    }

    return NextResponse.json({
      reading: result.reading,
      captions: result.captions || [],
      source: 'ai',
    });
  } catch (error) {
    console.error('Wave Art AI error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
