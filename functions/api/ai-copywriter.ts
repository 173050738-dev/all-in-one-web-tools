/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB?: D1Database;
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  DEEPSEEK_MODEL?: string;
}

function okJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

function errJson(error: string, status: number): Response {
  return okJson({ error }, status);
}

function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => corsPreflight();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const env = context.env;
    let payload: { product?: string; selling?: string; type?: string; tone?: string; platform?: string; locale?: string } = {};
    try {
      payload = (await context.request.json()) as { product?: string; selling?: string; type?: string; tone?: string; platform?: string; locale?: string };
    } catch {
      return errJson('Invalid JSON body', 400);
    }

    const { product, selling, type, tone, platform, locale = 'en' } = payload;

    if (!product?.trim() || !selling?.trim()) {
      return errJson('Product and selling points are required', 400);
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return errJson('API key not configured', 500);
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

    const systemPrompt = `你是一个专业的营销文案生成专家。根据用户提供的产品信息和需求，生成高质量的营销文案。

文案类型：
- 广告标题：吸引眼球的短标题，适合投放广告
- 产品描述：详细介绍产品特点和优势
- 社媒帖子：适合社交媒体平台的文案
- 邮件主题：吸引打开的邮件标题
- 落地页首屏：落地页顶部的核心文案

目标平台：
- 通用：适用于多个平台
- 独立站：电商独立站
- Instagram：图片社交平台
- Facebook：社交网络
- X：原Twitter，短文本平台

语气风格：
- 正式/商务：专业严谨
- 友好/亲切：轻松随和
- 简洁/精炼：言简意赅
- 幽默/风趣：轻松有趣
- 说服/营销：有说服力
- 学术/专业：专业权威

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "copy": "生成的文案内容",
      "why": "为什么这样写（一句话说明）"
    }
  ]
}

请生成【3条】候选文案。用 ${langLabel} 输出。文案要真实可信，不夸大不吹牛，不编造虚假数据。`;

    const userPrompt = locale === 'zh'
      ? `产品名：${product}\n\n核心卖点：${selling}\n\n文案类型：${type || '广告标题'}\n\n目标平台：${platform || '通用'}\n\n语气风格：${targetTone}\n\n请生成3条营销文案。`
      : locale === 'es'
      ? `Nombre del producto: ${product}\n\nPuntos de venta: ${selling}\n\nTipo de texto: ${type || 'título de anuncio'}\n\nPlataforma objetivo: ${platform || 'general'}\n\nEstilo de tono: ${targetTone}\n\nGenera 3 copys de marketing.`
      : locale === 'fr'
      ? `Nom du produit: ${product}\n\nPoints de vente: ${selling}\n\nType de texte: ${type || 'titre de publicité'}\n\nPlateforme cible: ${platform || 'générale'}\n\nStyle de ton: ${targetTone}\n\nGénérez 3 copies marketing.`
      : locale === 'hi'
      ? `उत्पाद का नाम: ${product}\n\nबिक्री बिंदु: ${selling}\n\nपाठ प्रकार: ${type || 'विज्ञापन शीर्षक'}\n\nलक्ष्य प्लेटफॉर्म: ${platform || 'सामान्य'}\n\nटोन शैली: ${targetTone}\n\n3 मार्केटिंग कॉपी बनाएं।`
      : locale === 'ar'
      ? `اسم المنتج: ${product}\n\nنقاط البيع: ${selling}\n\nنوع النص: ${type || 'عنوان الإعلان'}\n\nالمنصة المستهدفة: ${platform || 'عام'}\n\nأسلوب النبرة: ${targetTone}\n\nأنشئ 3 نسخ تسويقية.`
      : `Product name: ${product}\n\nSelling points: ${selling}\n\nCopy type: ${type || 'ad headline'}\n\nTarget platform: ${platform || 'general'}\n\nTone style: ${targetTone}\n\nGenerate 3 marketing copies.`;

    let remaining: number | null = null;

    try {
      if (env.DB) {
        const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
        const day = new Date().toISOString().split('T')[0];
        const key = `${ip}:${day}`;

        const result = await env.DB.prepare('SELECT count FROM ai_usage WHERE k = ?')
          .bind(key)
          .first();

        const used = result?.count || 0;
        if (used >= 5) {
          const message = locale === 'zh' ? '今日免费次数已用完(5次/天)' : locale === 'es' ? 'Límite gratuito diario agotado (5 veces/día)' : locale === 'fr' ? 'Limite gratuite quotidienne épuisée (5 fois/jour)' : locale === 'hi' ? 'आज की मुफ्त सीमा पूरी हो चुकी है (5 बार/दिन)' : locale === 'ar' ? 'الحد اليومي المجاني مستنفد (5 مرات/يوم)' : 'Daily free limit exceeded (5 times/day)';
          return okJson({ error: 'RATE_LIMIT', message }, { status: 429 });
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
      return errJson('AI service unavailable', 502);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      return errJson('Failed to parse AI response', 500);
    }

    if (!result.items || !Array.isArray(result.items)) {
      return errJson('No copy generated', 500);
    }

    return okJson({
      items: result.items.slice(0, 3),
      remaining,
    });
  } catch (error) {
    console.error('AI Copywriter error:', error);
    return errJson('Internal server error', 500);
  }
};