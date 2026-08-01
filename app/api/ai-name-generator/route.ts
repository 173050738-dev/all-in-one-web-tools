import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { type = 'baby', surname, gender = 'neutral', style = 'classic', locale = 'en' } = await req.json();

    if (!surname?.trim()) {
      return NextResponse.json({ error: 'Surname is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const typeMap: Record<string, string> = {
      baby: locale === 'zh' ? '宝宝名字' : locale === 'es' ? 'nombre de bebé' : locale === 'fr' ? 'nom de bébé' : locale === 'hi' ? 'बेबी नाम' : locale === 'ar' ? 'اسم طفل' : 'baby name',
      pet: locale === 'zh' ? '宠物名字' : locale === 'es' ? 'nombre de mascota' : locale === 'fr' ? 'nom d\'animal' : locale === 'hi' ? 'पालतू नाम' : locale === 'ar' ? 'اسم حيوان أليف' : 'pet name',
      nickname: locale === 'zh' ? '网名/昵称' : locale === 'es' ? 'apodo' : locale === 'fr' ? 'pseudo' : locale === 'hi' ? 'उपनाम' : locale === 'ar' ? 'اسم مستعار' : 'nickname',
      english: locale === 'zh' ? '英文名' : locale === 'es' ? 'nombre en inglés' : locale === 'fr' ? 'nom anglais' : locale === 'hi' ? 'अंग्रेजी नाम' : locale === 'ar' ? 'اسم إنجليزي' : 'English name',
    };

    const genderMap: Record<string, string> = {
      male: locale === 'zh' ? '男' : locale === 'es' ? 'masculino' : locale === 'fr' ? 'masculin' : locale === 'hi' ? 'पुरुष' : locale === 'ar' ? 'ذكر' : 'male',
      female: locale === 'zh' ? '女' : locale === 'es' ? 'femenino' : locale === 'fr' ? 'féminin' : locale === 'hi' ? 'महिला' : locale === 'ar' ? 'أنثى' : 'female',
      neutral: locale === 'zh' ? '中性' : locale === 'es' ? 'neutral' : locale === 'fr' ? 'neutre' : locale === 'hi' ? 'तटस्थ' : locale === 'ar' ? 'محايد' : 'neutral',
    };

    const styleMap: Record<string, string> = {
      classic: locale === 'zh' ? '古风/传统' : locale === 'es' ? 'clásico' : locale === 'fr' ? 'classique' : locale === 'hi' ? 'पारंपरिक' : locale === 'ar' ? 'كلاسيكي' : 'classic/traditional',
      modern: locale === 'zh' ? '现代/简约' : locale === 'es' ? 'moderno' : locale === 'fr' ? 'moderne' : locale === 'hi' ? 'आधुनिक' : locale === 'ar' ? 'حديث' : 'modern',
      cute: locale === 'zh' ? '可爱/俏皮' : locale === 'es' ? 'lindo' : locale === 'fr' ? 'mignon' : locale === 'hi' ? 'प्यारा' : locale === 'ar' ? 'لطيف' : 'cute',
      powerful: locale === 'zh' ? '霸气/豪迈' : locale === 'es' ? 'poderoso' : locale === 'fr' ? 'puissant' : locale === 'hi' ? 'शक्तिशाली' : locale === 'ar' ? 'قوي' : 'powerful',
      poetic: locale === 'zh' ? '诗意/文雅' : locale === 'es' ? 'poético' : locale === 'fr' ? 'poétique' : locale === 'hi' ? 'काव्यात्मक' : locale === 'ar' ? 'شاعري' : 'poetic',
    };

    const targetType = typeMap[type] || typeMap.baby;
    const targetGender = genderMap[gender] || genderMap.neutral;
    const targetStyle = styleMap[style] || styleMap.classic;

    const systemPrompt = `你是一个专业的起名专家。根据用户提供的姓氏、性别和风格偏好，生成好听有寓意的名字。每个名字附带寓意解释和出处。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "name": "名字",
      "meaning": "寓意解释",
      "origin": "出处/典故"
    }
  ]
}

请生成【5个】名字。用 ${langLabel} 输出。寓意要真实可信，出处准确，不编造典故。`;

    const userPrompt = locale === 'zh'
      ? `类型：${targetType}\n姓氏：${surname}\n性别：${targetGender}\n风格：${targetStyle}\n\n请生成5个有寓意的名字。`
      : locale === 'es'
      ? `Tipo: ${targetType}\nApellido: ${surname}\nGénero: ${targetGender}\nEstilo: ${targetStyle}\n\nGenera 5 nombres con significado.`
      : locale === 'fr'
      ? `Type: ${targetType}\nNom de famille: ${surname}\nGenre: ${targetGender}\nStyle: ${targetStyle}\n\nGénérez 5 noms avec signification.`
      : locale === 'hi'
      ? `प्रकार: ${targetType}\nउपनाम: ${surname}\nलिंग: ${targetGender}\nशैली: ${targetStyle}\n\n5 अर्थपूर्ण नाम बनाएं।`
      : locale === 'ar'
      ? `النوع: ${targetType}\nاسم العائلة: ${surname}\nالجنس: ${targetGender}\nالأسلوب: ${targetStyle}\n\nأنشئ 5 أسماء ذات معنى.`
      : `Type: ${targetType}\nSurname: ${surname}\nGender: ${targetGender}\nStyle: ${targetStyle}\n\nGenerate 5 meaningful names.`;

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
        temperature: 0.9,
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
      return NextResponse.json({ error: 'No names generated' }, { status: 500 });
    }

    return NextResponse.json({
      items: result.items.slice(0, 5),
      remaining,
    });
  } catch (error) {
    console.error('AI Name Generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
