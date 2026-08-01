import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { ingredients, cuisine = 'any', difficulty = 'easy', servings = '2', diet = 'none', locale = 'en' } = await req.json();

    if (!ingredients?.trim()) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const cuisineMap: Record<string, string> = {
      chinese: locale === 'zh' ? '中式' : locale === 'es' ? 'china' : locale === 'fr' ? 'chinoise' : locale === 'hi' ? 'चीनी' : locale === 'ar' ? 'صيني' : 'Chinese',
      western: locale === 'zh' ? '西式' : locale === 'es' ? 'occidental' : locale === 'fr' ? 'occidental' : locale === 'hi' ? 'पश्चिमी' : locale === 'ar' ? 'غربي' : 'Western',
      japanese: locale === 'zh' ? '日式' : locale === 'es' ? 'japonesa' : locale === 'fr' ? 'japonaise' : locale === 'hi' ? 'जापानी' : locale === 'ar' ? 'ياباني' : 'Japanese',
      korean: locale === 'zh' ? '韩式' : locale === 'es' ? 'coreana' : locale === 'fr' ? 'coréenne' : locale === 'hi' ? 'कोरियाई' : locale === 'ar' ? 'كوري' : 'Korean',
      southeast: locale === 'zh' ? '东南亚' : locale === 'es' ? 'sudeste asiático' : locale === 'fr' ? 'sud-est asiatique' : locale === 'hi' ? 'दक्षिण पूर्व एशियाई' : locale === 'ar' ? 'جنوب شرق آسيوي' : 'Southeast Asian',
      any: locale === 'zh' ? '不限' : locale === 'es' ? 'cualquiera' : locale === 'fr' ? 'toute' : locale === 'hi' ? 'कोई भी' : locale === 'ar' ? 'أي' : 'Any',
    };

    const difficultyMap: Record<string, string> = {
      easy: locale === 'zh' ? '简单' : locale === 'es' ? 'fácil' : locale === 'fr' ? 'facile' : locale === 'hi' ? 'आसान' : locale === 'ar' ? 'سهل' : 'easy',
      medium: locale === 'zh' ? '中等' : locale === 'es' ? 'media' : locale === 'fr' ? 'moyenne' : locale === 'hi' ? 'मध्यम' : locale === 'ar' ? 'متوسط' : 'medium',
      hard: locale === 'zh' ? '复杂' : locale === 'es' ? 'difícil' : locale === 'fr' ? 'difficile' : locale === 'hi' ? 'कठिन' : locale === 'ar' ? 'صعب' : 'hard',
    };

    const dietMap: Record<string, string> = {
      none: locale === 'zh' ? '无限制' : locale === 'es' ? 'sin restricción' : locale === 'fr' ? 'aucune' : locale === 'hi' ? 'कोई नहीं' : locale === 'ar' ? 'بدون' : 'none',
      vegetarian: locale === 'zh' ? '素食' : locale === 'es' ? 'vegetariano' : locale === 'fr' ? 'végétarien' : locale === 'hi' ? 'शाकाहारी' : locale === 'ar' ? 'نباتي' : 'vegetarian',
      lowcalorie: locale === 'zh' ? '低卡' : locale === 'es' ? 'bajo en calorías' : locale === 'fr' ? 'faible calorie' : locale === 'hi' ? 'कम कैलोरी' : locale === 'ar' ? 'منخفض السعرات' : 'low-calorie',
      glutenfree: locale === 'zh' ? '无麸质' : locale === 'es' ? 'sin gluten' : locale === 'fr' ? 'sans gluten' : locale === 'hi' ? 'ग्लूटेन मुक्त' : locale === 'ar' ? 'خالٍ من الغلوتين' : 'gluten-free',
    };

    const targetCuisine = cuisineMap[cuisine] || cuisineMap.any;
    const targetDifficulty = difficultyMap[difficulty] || difficultyMap.easy;
    const targetDiet = dietMap[diet] || dietMap.none;

    const systemPrompt = `你是一个专业厨师和营养师。根据用户提供的食材和偏好，生成详细菜谱。

返回格式要求（必须是有效的 JSON）：
{
  "recipes": [
    {
      "name": "菜名",
      "ingredients": ["材料1（用量）", "材料2（用量）"],
      "steps": ["步骤1", "步骤2", "步骤3"],
      "tips": "烹饪小贴士",
      "nutrition": "营养信息（含热量/蛋白质/脂肪等）"
    }
  ]
}

请生成【2个】菜谱。用 ${langLabel} 输出。菜谱要切实可行，步骤清晰可执行，营养信息要真实合理。`;

    const userPrompt = locale === 'zh'
      ? `食材：${ingredients}\n菜系：${targetCuisine}\n难度：${targetDifficulty}\n人数：${servings}人份\n饮食限制：${targetDiet}\n\n请生成2个菜谱。`
      : locale === 'es'
      ? `Ingredientes: ${ingredients}\nCocina: ${targetCuisine}\nDificultad: ${targetDifficulty}\nPorciones: ${servings}\nDieta: ${targetDiet}\n\nGenera 2 recetas.`
      : locale === 'fr'
      ? `Ingrédients: ${ingredients}\nCuisine: ${targetCuisine}\nDifficulté: ${targetDifficulty}\nPortions: ${servings}\nRégime: ${targetDiet}\n\nGénérez 2 recettes.`
      : locale === 'hi'
      ? `सामग्री: ${ingredients}\nभोजन: ${targetCuisine}\nकठिनाई: ${targetDifficulty}\nहिस्से: ${servings}\nआहार: ${targetDiet}\n\n2 रेसिपी बनाएं।`
      : locale === 'ar'
      ? `المكونات: ${ingredients}\nالمطبخ: ${targetCuisine}\nالصعوبة: ${targetDifficulty}\nالحصص: ${servings}\nالحمية: ${targetDiet}\n\nأنشئ وصفتين.`
      : `Ingredients: ${ingredients}\nCuisine: ${targetCuisine}\nDifficulty: ${targetDifficulty}\nServings: ${servings}\nDiet: ${targetDiet}\n\nGenerate 2 recipes.`;

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
        max_tokens: 3000,
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

    if (!result.recipes || !Array.isArray(result.recipes)) {
      return NextResponse.json({ error: 'No recipes generated' }, { status: 500 });
    }

    return NextResponse.json({
      recipes: result.recipes.slice(0, 2),
      remaining,
    });
  } catch (error) {
    console.error('AI Recipe Generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
