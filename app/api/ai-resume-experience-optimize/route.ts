import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { position, experience, skills, achievements, tone, locale = 'en' } = await req.json();

    if (!position?.trim()) {
      return NextResponse.json({ error: 'Position is required' }, { status: 400 });
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

    const targetTone = toneMap[tone] || toneMap.formal;

    const systemPrompt = `你是一个专业的简历优化专家。根据用户提供的职位、工作经历、技能和成就信息，帮助优化简历内容。

优化原则：
- 使用行动动词开头（如：负责、主导、完成、优化、提升等）
- 突出量化成果（数据、百分比、规模）
- 匹配目标职位的关键词
- 结构清晰，重点突出
- 语言简洁有力

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "copy": "优化后的简历经历描述",
      "why": "优化要点说明"
    }
  ]
}

请生成【3条】优化后的简历经历描述。用 ${langLabel} 输出。每条描述要专业、有说服力。`;

    const userPrompt = locale === 'zh'
      ? `目标职位：${position}\n\n工作经历：${experience || ''}\n\n技能：${skills || ''}\n\n成就：${achievements || ''}\n\n语气风格：${targetTone}\n\n请优化简历经历描述。`
      : locale === 'es'
      ? `Puesto objetivo: ${position}\n\nExperiencia laboral: ${experience || ''}\n\nHabilidades: ${skills || ''}\n\nLogros: ${achievements || ''}\n\nEstilo de tono: ${targetTone}\n\nOptimiza la descripción de experiencia laboral.`
      : locale === 'fr'
      ? `Poste cible: ${position}\n\nExpérience professionnelle: ${experience || ''}\n\nCompétences: ${skills || ''}\n\nRéalisations: ${achievements || ''}\n\nStyle de ton: ${targetTone}\n\nOptimisez la description de l'expérience professionnelle.`
      : locale === 'hi'
      ? `लक्ष्य पद: ${position}\n\nकार्य अनुभव: ${experience || ''}\n\nकौशल: ${skills || ''}\n\nउपलब्धियां: ${achievements || ''}\n\nटोन शैली: ${targetTone}\n\nकार्य अनुभव का विवरण अनुकूलित करें।`
      : locale === 'ar'
      ? `المنصب المستهدف: ${position}\n\nالخبرة الوظيفية: ${experience || ''}\n\nالمهارات: ${skills || ''}\n\nالإنجازات: ${achievements || ''}\n\nأسلوب النبرة: ${targetTone}\n\nقم بتحسين وصف الخبرة الوظيفية.`
      : `Target position: ${position}\n\nWork experience: ${experience || ''}\n\nSkills: ${skills || ''}\n\nAchievements: ${achievements || ''}\n\nTone style: ${targetTone}\n\nOptimize the work experience description.`;

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
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    return NextResponse.json({
      items: result.items.slice(0, 3),
      remaining,
    });
  } catch (error) {
    console.error('AI Resume Optimizer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
