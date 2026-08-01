import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { occasion = 'birthday', recipient, message, tone = 'warm', locale = 'en' } = await req.json();

    if (!recipient?.trim()) {
      return NextResponse.json({ error: 'Recipient is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const occasionMap: Record<string, string> = {
      birthday: locale === 'zh' ? '生日' : locale === 'es' ? 'cumpleaños' : locale === 'fr' ? 'anniversaire' : locale === 'hi' ? 'जन्मदिन' : locale === 'ar' ? 'عيد ميلاد' : 'birthday',
      wedding: locale === 'zh' ? '婚礼' : locale === 'es' ? 'boda' : locale === 'fr' ? 'mariage' : locale === 'hi' ? 'शादी' : locale === 'ar' ? 'زفاف' : 'wedding',
      newyear: locale === 'zh' ? '新年' : locale === 'es' ? 'año nuevo' : locale === 'fr' ? 'nouvel an' : locale === 'hi' ? 'नया साल' : locale === 'ar' ? 'رأس السنة' : 'new year',
      springfestival: locale === 'zh' ? '春节' : locale === 'es' ? 'fiesta de primavera' : locale === 'fr' ? 'fête du printemps' : locale === 'hi' ? 'वसंत उत्सव' : locale === 'ar' ? 'مهرجان الربيع' : 'spring festival',
      midautumn: locale === 'zh' ? '中秋' : locale === 'es' ? 'medio otoño' : locale === 'fr' ? 'mi-automne' : locale === 'hi' ? 'मध्य शरद' : locale === 'ar' ? 'منتصف الخريف' : 'mid-autumn',
      housewarming: locale === 'zh' ? '乔迁' : locale === 'es' ? 'inauguración' : locale === 'fr' ? 'emménagement' : locale === 'hi' ? 'गृह प्रवेश' : locale === 'ar' ? 'انتقال منزل' : 'housewarming',
      graduation: locale === 'zh' ? '毕业' : locale === 'es' ? 'graduación' : locale === 'fr' ? 'diplôme' : locale === 'hi' ? 'स्नातक' : locale === 'ar' ? 'تخرج' : 'graduation',
      promotion: locale === 'zh' ? '升职' : locale === 'es' ? 'ascenso' : locale === 'fr' ? 'promotion' : locale === 'hi' ? 'पदोन्नति' : locale === 'ar' ? 'ترقية' : 'promotion',
    };

    const toneMap: Record<string, string> = {
      warm: locale === 'zh' ? '温馨' : locale === 'es' ? 'cálido' : locale === 'fr' ? 'chaleureux' : locale === 'hi' ? 'गर्मजनक' : locale === 'ar' ? 'دافئ' : 'warm',
      formal: locale === 'zh' ? '正式' : locale === 'es' ? 'formal' : locale === 'fr' ? 'formel' : locale === 'hi' ? 'औपचारिक' : locale === 'ar' ? 'رسمي' : 'formal',
      humorous: locale === 'zh' ? '幽默' : locale === 'es' ? 'humorístico' : locale === 'fr' ? 'humoristique' : locale === 'hi' ? 'हास्यपूर्ण' : locale === 'ar' ? 'مزاح' : 'humorous',
      creative: locale === 'zh' ? '创意' : locale === 'es' ? 'creativo' : locale === 'fr' ? 'créatif' : locale === 'hi' ? 'रचनात्मक' : locale === 'ar' ? 'إبداعي' : 'creative',
    };

    const targetOccasion = occasionMap[occasion] || occasionMap.birthday;
    const targetTone = toneMap[tone] || toneMap.warm;

    const systemPrompt = `你是一个专业的祝福语创作专家。根据场景和收件人，生成真挚动人的祝福语。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "greeting": "祝福语内容",
      "tips": "送出建议（如何送出、何时送、搭配什么礼物等）"
    }
  ]
}

请生成【3条】祝福语。用 ${langLabel} 输出。祝福语要真挚动人、避免套话，每条不超过150字。`;

    const extraMsg = message?.trim() ? `\n${locale === 'zh' ? '附加留言' : locale === 'es' ? 'Mensaje adicional' : locale === 'fr' ? 'Message supplémentaire' : locale === 'hi' ? 'अतिरिक्त संदेश' : locale === 'ar' ? 'رسالة إضافية' : 'Additional message'}: ${message.trim()}` : '';

    const userPrompt = locale === 'zh'
      ? `场景：${targetOccasion}\n收件人：${recipient}\n语气：${targetTone}${extraMsg}\n\n请生成3条祝福语。`
      : locale === 'es'
      ? `Ocasión: ${targetOccasion}\nDestinatario: ${recipient}\nTono: ${targetTone}${extraMsg}\n\nGenera 3 felicitaciones.`
      : locale === 'fr'
      ? `Occasion: ${targetOccasion}\nDestinataire: ${recipient}\nTon: ${targetTone}${extraMsg}\n\nGénérez 3 félicitations.`
      : locale === 'hi'
      ? `अवसर: ${targetOccasion}\nप्राप्तकर्ता: ${recipient}\nटोन: ${targetTone}${extraMsg}\n\n3 शुभकामनाएं बनाएं।`
      : locale === 'ar'
      ? `المناسبة: ${targetOccasion}\nالمستلم: ${recipient}\nالنبرة: ${targetTone}${extraMsg}\n\nأنشئ 3 تهنئات.`
      : `Occasion: ${targetOccasion}\nRecipient: ${recipient}\nTone: ${targetTone}${extraMsg}\n\nGenerate 3 greetings.`;

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
        temperature: 0.85,
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

    if (!result.items || !Array.isArray(result.items)) {
      return NextResponse.json({ error: 'No greetings generated' }, { status: 500 });
    }

    return NextResponse.json({
      items: result.items.slice(0, 3),
      remaining,
    });
  } catch (error) {
    console.error('AI Greeting Generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
