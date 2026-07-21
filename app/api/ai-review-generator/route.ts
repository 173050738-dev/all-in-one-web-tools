import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { product, selling, type, tone, platform, locale = 'en' } = await req.json();

    if (!product?.trim() || !selling?.trim()) {
      return NextResponse.json({ error: 'Product name and feelings are required' }, { status: 400 });
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

    const systemPrompt = `你是一个专业的电商评价生成专家。根据用户提供的商品信息和简单感受，生成自然真实的评价。

评价类型：
- 好评：积极正面，突出优点
- 中评：客观中立，优缺点都提
- 差评：负面反馈，指出问题

目标平台：
- 淘宝：语气亲切，使用表情符号
- 拼多多：接地气，强调性价比
- 美团/饿了么：关注配送速度和服务
- 京东：强调品质和物流

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "review": "生成的评价内容"
    }
  ]
}

请生成【3条】候选评价。用 ${langLabel} 输出。评价要口语化，像真实用户写的，不要太官方太生硬。`;

    const userPrompt = locale === 'zh'
      ? `产品名：${product}\n\n核心卖点：${selling}\n\n评价类型：${type || '广告标题'}\n\n目标平台：${platform || '通用'}\n\n语气风格：${targetTone}\n\n请生成3条评价。`
      : locale === 'es'
      ? `Nombre del producto: ${product}\n\nPuntos de venta: ${selling}\n\nTipo de texto: ${type || 'título de anuncio'}\n\nPlataforma objetivo: ${platform || 'general'}\n\nEstilo de tono: ${targetTone}\n\nGenera 3 copys de marketing.`
      : locale === 'fr'
      ? `Nom du produit: ${product}\n\nPoints de vente: ${selling}\n\nType de texte: ${type || 'titre de publicité'}\n\nPlateforme cible: ${platform || 'générale'}\n\nStyle de ton: ${targetTone}\n\nGénérez 3 copies marketing.`
      : locale === 'hi'
      ? `उत्पाद का नाम: ${product}\n\nबिक्री बिंदु: ${selling}\n\nपाठ प्रकार: ${type || 'विज्ञापन शीर्षक'}\n\nलक्ष्य प्लेटफॉर्म: ${platform || 'सामान्य'}\n\nटोन शैली: ${targetTone}\n\n3 मार्केटिंग कॉपी बनाएं।`
      : locale === 'ar'
      ? `اسم المنتج: ${product}\n\nنقاط البيع: ${selling}\n\nنوع النص: ${type || 'عنوان الإعلان'}\n\nالمنصة المستهدفة: ${platform || 'عام'}\n\nأسلوب النبرة: ${targetTone}\n\nأنشئ 3 نسخ تسويقية.`
      : `Product name: ${product}\n\nFeelings: ${selling}\n\nReview type: ${type || 'ad headline'}\n\nTarget platform: ${platform || 'general'}\n\nTone style: ${targetTone}\n\nGenerate 3 reviews.`;

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
    const content = data.choices?.[0]?.message?.content || '{}';

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    if (!result.items || !Array.isArray(result.items)) {
      return NextResponse.json({ error: 'No reviews generated' }, { status: 500 });
    }

    return NextResponse.json({
      items: result.items.slice(0, 3),
      remaining,
    });
  } catch (error) {
    console.error('AI Copywriter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}