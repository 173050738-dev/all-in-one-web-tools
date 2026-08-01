import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { description, language = 'general', testString, locale = 'en' } = await req.json();

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const languageMap: Record<string, string> = {
      javascript: locale === 'zh' ? 'JavaScript' : locale === 'es' ? 'JavaScript' : locale === 'fr' ? 'JavaScript' : locale === 'hi' ? 'JavaScript' : locale === 'ar' ? 'JavaScript' : 'JavaScript',
      python: locale === 'zh' ? 'Python' : 'Python',
      java: locale === 'zh' ? 'Java' : 'Java',
      go: locale === 'zh' ? 'Go' : 'Go',
      general: locale === 'zh' ? '通用（PCRE 风格）' : locale === 'es' ? 'general (estilo PCRE)' : locale === 'fr' ? 'général (style PCRE)' : locale === 'hi' ? 'सामान्य (PCRE शैली)' : locale === 'ar' ? 'عام (نمط PCRE)' : 'general (PCRE style)',
    };

    const targetLanguage = languageMap[language] || languageMap.general;

    const systemPrompt = `你是一个正则表达式专家。根据用户的自然语言描述，生成正确的正则表达式，并解释每个部分的含义。

返回格式要求（必须是有效的 JSON）：
{
  "regex": "正则表达式（仅模式本身，不含语言特定分隔符/标志）",
  "explanation": "逐段解释每个部分的作用，例如：^ 表示开头，[a-z] 匹配小写字母等",
  "matches": ["在测试字符串中匹配到的字符串列表，如无测试字符串则为空数组"],
  "testCode": "对应语言的测试代码片段（字符串）"
}

注意：
- regex 字段只输出纯正则模式本身（如 ^[a-z]+$），不要包含 /.../ 分隔符或标志
- 如果提供了测试字符串，必须在 matches 数组中列出所有匹配到的子串
- testCode 要根据目标语言生成可运行的示例代码
- 用 ${langLabel} 输出 explanation，regex/testCode 保持代码形式`;

    const testStrSection = testString?.trim() ? `\n${locale === 'zh' ? '测试字符串' : locale === 'es' ? 'Cadena de prueba' : locale === 'fr' ? 'Chaîne de test' : locale === 'hi' ? 'परीक्षण स्ट्रिंग' : locale === 'ar' ? 'سلسلة الاختبار' : 'Test string'}: ${testString.trim()}` : '';

    const userPrompt = locale === 'zh'
      ? `需求描述：${description}\n目标语言：${targetLanguage}${testStrSection}\n\n请生成正则表达式并解释。`
      : locale === 'es'
      ? `Descripción: ${description}\nLenguaje: ${targetLanguage}${testStrSection}\n\nGenera la expresión regular y explícala.`
      : locale === 'fr'
      ? `Description: ${description}\nLangage: ${targetLanguage}${testStrSection}\n\nGénérez l'expression régulière et expliquez-la.`
      : locale === 'hi'
      ? `विवरण: ${description}\nभाषा: ${targetLanguage}${testStrSection}\n\nरेगुलर एक्सप्रेशन बनाएं और समझाएं।`
      : locale === 'ar'
      ? `الوصف: ${description}\nاللغة: ${targetLanguage}${testStrSection}\n\nأنشئ التعبير النمطي واشرحه.`
      : `Description: ${description}\nLanguage: ${targetLanguage}${testStrSection}\n\nGenerate the regex and explain it.`;

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
        if (used >= 5) {
          shouldProceed = false;
          return NextResponse.json({
            error: 'RATE_LIMIT',
            message: locale === 'zh' ? '今日免费次数已用完(5次/天)' : locale === 'es' ? 'Límite gratuito diario agotado (5 veces/día)' : locale === 'fr' ? 'Limite gratuite quotidienne épuisée (5 fois/jour)' : locale === 'hi' ? 'आज की मुफ्त सीमा पूरी हो चुकी है (5 बार/दिन)' : locale === 'ar' ? 'الحد اليومي المجاني مستنفد (5 مرات/يوم)' : 'Daily free limit exceeded (5 times/day)',
          }, { status: 429 });
        }

        remaining = Math.max(0, 5 - used - 1);

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
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    if (!result.regex || typeof result.regex !== 'string') {
      return NextResponse.json({ error: 'No regex generated' }, { status: 500 });
    }

    return NextResponse.json({
      regex: result.regex,
      explanation: result.explanation || '',
      matches: Array.isArray(result.matches) ? result.matches : [],
      testCode: result.testCode || '',
      remaining,
    });
  } catch (error) {
    console.error('AI Regex Generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
