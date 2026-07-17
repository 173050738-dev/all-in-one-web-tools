import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, kind = 'image', lang = 'en', locale = 'en' } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: 'Prompt too long (max 2000 chars)' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    let remaining: number | null = null;
    let shouldProceed = true;

    try {
      const { env } = getRequestContext();
      if (env.DB) {
        const ip = req.headers.get('cf-connecting-ip') || 'unknown';
        const day = new Date().toISOString().split('T')[0];
        const key = `${ip}:${day}`;

        const result = await env.DB.prepare('SELECT count FROM ai_usage WHERE k = ?')
          .bind(key)
          .first();

        const used = result?.count || 0;
        if (used >= 10) {
          shouldProceed = false;
          const msg = locale === 'zh'
            ? '今日免费次数已用完(10次/天)'
            : locale === 'es'
            ? 'Límite gratuito diario agotado (10 veces/día)'
            : locale === 'fr'
            ? 'Limite gratuite quotidienne épuisée (10 fois/jour)'
            : locale === 'hi'
            ? 'आज की मुफ्त सीमा पूरी हो चुकी है (10 बार/दिन)'
            : locale === 'ar'
            ? 'الحد اليومي المجاني مستنفد (10 مرات/يوم)'
            : 'Daily free limit exceeded (10 times/day)';
          return NextResponse.json({ error: 'RATE_LIMIT', message: msg }, { status: 429 });
        }

        remaining = Math.max(0, 10 - used - 1);

        await env.DB.prepare('INSERT INTO ai_usage (k, count, day) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET count = count + 1')
          .bind(key, day)
          .run();
      }
    } catch (dbError) {
      console.error('D1 rate limit error:', dbError);
      remaining = null;
    }

    if (!shouldProceed) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

    const isImage = kind === 'image';
    const langLabel = lang === 'zh' ? '中文' : 'English';

    const systemPrompt = `你是一个专业的 AI ${isImage ? '图像' : '视频'} 提示词优化专家。你的任务是把用户提供的原始 prompt 优化成更专业、更出效果的高质量提示词。

优化要点：
- 补充细节，让画面更丰富
- 调整描述顺序，主体在前，细节在后
- 保留原始 prompt 的核心意思，不偏离主题
- 用 ${langLabel} 输出
- 只返回优化后的提示词文本，不要任何解释、不要 markdown、不要用引号包裹

返回格式（必须是有效的 JSON）：
{
  "refined": "优化后的提示词"
}`;

    const userPrompt = lang === 'zh'
      ? `原始提示词：\n${prompt}\n\n请优化成更专业的${isImage ? '图像' : '视频'}生成提示词。`
      : `Original prompt:\n${prompt}\n\nRefine it into a more professional ${isImage ? 'image' : 'video'} generation prompt.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
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
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      return NextResponse.json({ refined: prompt, remaining });
    }

    return NextResponse.json({
      refined: result.refined || prompt,
      remaining,
    });
  } catch (error) {
    console.error('Prompt refine error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
