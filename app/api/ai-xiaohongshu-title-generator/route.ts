import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { topic, content, type, tone, locale = 'en' } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const toneMap: Record<string, string> = {
      formal: locale === 'zh' ? '正式/商务' : locale === 'es' ? 'formal' : locale === 'fr' ? 'formel' : locale === 'hi' ? 'औपचारिक' : locale === 'ar' ? 'رسمي' : 'formal/business',
      friendly: locale === 'zh' ? '友好/亲切' : locale === 'es' ? 'amigable' : locale === 'fr' ? 'amiable' : locale === 'hi' ? 'दोस्ताना' : locale === 'ar' ? 'ودود' : 'friendly/casual',
      concise: locale === 'zh' ? '简洁/精炼' : locale === 'es' ? 'conciso' : locale === 'fr' ? 'concis' : locale === 'hi' ? 'संक्षिप्त' : locale === 'ar' ? 'مختصر' : 'concise/to-the-point',
      humorous: locale === 'zh' ? '幽默/风趣' : locale === 'es' ? 'humorístico' : locale === 'fr' ? 'humoristique' : locale === 'hi' ? 'हास्यपूर्ण' : locale === 'ar' ? 'مزح' : 'humorous/funny',
      persuasive: locale === 'zh' ? '说服/营销' : locale === 'es' ? 'persuasivo' : locale === 'fr' ? 'persuasif' : locale === 'hi' ? 'प्रेरणादायक' : locale === 'ar' ? 'قائل' : 'persuasive/marketing',
      academic: locale === 'zh' ? '学术/专业' : locale === 'es' ? 'académico' : locale === 'fr' ? 'académique' : locale === 'hi' ? 'अकादमिक' : locale === 'ar' ? 'أكاديمي' : 'academic/professional',
    };

    const targetTone = toneMap[tone] || toneMap.friendly;

    const systemPrompt = `你是一个专业的小红书标题创作专家。根据用户提供的主题和内容描述，生成吸引人的小红书标题。

小红书标题特点：
- 使用 emoji 表情增加吸引力
- 口语化、亲切自然
- 使用悬念、数字、感叹号等技巧
- 包含关键词便于搜索
- 激发好奇心和点击欲望

标题类型：
- 爆款：夸张吸睛，引发强烈好奇
- 种草：分享好物，激发购买欲
- 测评：真实体验，对比分析
- 干货：实用技巧，知识分享
- 情感：共鸣故事，情感触动

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "title": "生成的标题",
      "why": "创作思路"
    }
  ]
}

请生成【5条】候选标题。用 ${langLabel} 输出。标题要符合小红书风格，使用适当的emoji。`;

    const userPrompt = locale === 'zh'
      ? `主题关键词：${topic}\n\n内容描述：${content || ''}\n\n标题类型：${type || '爆款'}\n\n语气风格：${targetTone}\n\n请生成5条小红书标题。`
      : locale === 'es'
      ? `Palabra clave del tema: ${topic}\n\nDescripción del contenido: ${content || ''}\n\nTipo de título: ${type || 'viral'}\n\nEstilo de tono: ${targetTone}\n\nGenera 5 títulos para Xiaohongshu.`
      : locale === 'fr'
      ? `Mot-clé du thème: ${topic}\n\nDescription du contenu: ${content || ''}\n\nType de titre: ${type || 'viral'}\n\nStyle de ton: ${targetTone}\n\nGénérez 5 titres pour Xiaohongshu.`
      : locale === 'hi'
      ? `विषय कुंजी शब्द: ${topic}\n\nसामग्री का विवरण: ${content || ''}\n\nशीर्षक प्रकार: ${type || 'वायरल'}\n\nटोन शैली: ${targetTone}\n\nXiaohongshu के लिए 5 शीर्षक बनाएं।`
      : locale === 'ar'
      ? `كلمة مفتاحية الموضوع: ${topic}\n\nوصف المحتوى: ${content || ''}\n\nنوع العنوان: ${type || 'فيروسي'}\n\nأسلوب النبرة: ${targetTone}\n\nأنشئ 5 عناوين لـ Xiaohongshu.`
      : `Topic keyword: ${topic}\n\nContent description: ${content || ''}\n\nTitle type: ${type || 'viral'}\n\nTone style: ${targetTone}\n\nGenerate 5 Xiaohongshu titles.`;

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
        temperature: 0.8,
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
    const contentText = data.choices?.[0]?.message?.content || '{}';

    let result;
    try {
      result = JSON.parse(contentText);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    if (!result.items || !Array.isArray(result.items)) {
      return NextResponse.json({ error: 'No titles generated' }, { status: 500 });
    }

    return NextResponse.json({
      items: result.items.slice(0, 5),
      remaining,
    });
  } catch (error) {
    console.error('AI Xiaohongshu Title Generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
