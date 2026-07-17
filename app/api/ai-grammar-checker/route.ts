import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, goal = 'general', locale = 'zh' } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 4000) {
      return NextResponse.json({ error: 'Text too long (max 4000 chars)' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    let remaining: number | null = null;

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
          return NextResponse.json({
            error: 'RATE_LIMIT',
            message: locale === 'zh' ? '今日免费次数已用完(10次/天)' : locale === 'es' ? 'Límite gratuito diario agotado (10 veces/día)' : locale === 'fr' ? 'Limite gratuite quotidienne épuisée (10 fois/jour)' : locale === 'hi' ? 'आज की मुफ्त सीमा पूरी हो चुकी है (10 बार/दिन)' : locale === 'ar' ? 'الحد اليومي المجاني مستنفد (10 مرات/يوم)' : 'Daily free limit exceeded (10 times/day)',
          }, { status: 429 });
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

    const systemPrompt = `你是专业的多语言写作校对与润色专家。分析用户文本，检测语法/拼写/标点/用词问题，给出改写与评分。
必须只返回有效 JSON，不要任何解释文字、不要用\`\`\`包裹。结构：
{
  "corrections":[{"original":"错误片段","suggestion":"改后","type":"grammar|spelling|punctuation|wording","reason":"为什么(一句话)"}],
  "rewritten":"整段改写后的通顺全文",
  "score": 0-100 的整数,
  "scoreComment":"一句话可读性评价",
  "tone":"检测到的当前语气(如 formal/neutral/stiff/friendly)",
  "toneSuggestion":"若语气不佳给出调整建议，否则空字符串",
  "stats":{"words":字数,"sentences":句数,"issues":问题数}
}
按【写作目标 goal】调整改写风格(academic学术严谨/business-email商务礼貌/social社媒轻快/resume简历有力/casual日常/general通用)。
所有文字输出用 ${langLabel}。corrections 最多返回 20 条。若无错误，corrections 返回空数组、rewritten 返回原文。`;

    const userPrompt = locale === 'zh'
      ? `待校对文本：\n${text}\n\n写作目标：${goal}\n\n请按 JSON 结构返回校对结果。`
      : locale === 'es'
      ? `Texto para revisar:\n${text}\n\nObjetivo de escritura: ${goal}\n\nDevuelve el resultado en formato JSON.`
      : locale === 'fr'
      ? `Texte à corriger:\n${text}\n\nObjectif d'écriture: ${goal}\n\nRetournez le résultat au format JSON.`
      : locale === 'hi'
      ? `प्रूफ़रीडिंग के लिए टेक्स्ट:\n${text}\n\nलेखन लक्ष्य: ${goal}\n\nJSON प्रारूप में परिणाम लौटाएं।`
      : locale === 'ar'
      ? `نص للمراجعة:\n${text}\n\nهدف الكتابة: ${goal}\n\nأرجِع النتيجة بصيغة JSON.`
      : `Text to proofread:\n${text}\n\nWriting goal: ${goal}\n\nReturn the result as the required JSON.`;

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
        max_tokens: 2000,
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
      return NextResponse.json({ error: 'AI response parse error' }, { status: 502 });
    }

    return NextResponse.json({
      ...result,
      remaining,
    });
  } catch (error) {
    console.error('AI Grammar Checker error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}