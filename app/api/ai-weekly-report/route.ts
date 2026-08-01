import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { role, tasks, achievements, plans, locale = 'en' } = await req.json();

    if (!role?.trim() || !tasks?.trim()) {
      return NextResponse.json({ error: 'Role and tasks are required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const sectionLabels = {
      summary: locale === 'zh' ? '本周总结' : locale === 'es' ? 'Resumen de la semana' : locale === 'fr' ? 'Résumé de la semaine' : locale === 'hi' ? 'इस सप्ताह का सारांश' : locale === 'ar' ? 'ملخص الأسبوع' : 'This Week Summary',
      achievements: locale === 'zh' ? '主要成果' : locale === 'es' ? 'Logros principales' : locale === 'fr' ? 'Principaux résultats' : locale === 'hi' ? 'मुख्य उपलब्धियां' : locale === 'ar' ? 'الإنجازات الرئيسية' : 'Main Achievements',
      issues: locale === 'zh' ? '问题与风险' : locale === 'es' ? 'Problemas y riesgos' : locale === 'fr' ? 'Problèmes et risques' : locale === 'hi' ? 'समस्याएं और जोखिम' : locale === 'ar' ? 'المشكلات والمخاطر' : 'Issues & Risks',
      plans: locale === 'zh' ? '下周计划' : locale === 'es' ? 'Plan de la próxima semana' : locale === 'fr' ? 'Plan de la semaine prochaine' : locale === 'hi' ? 'अगले सप्ताह की योजना' : locale === 'ar' ? 'خطة الأسبوع القادم' : 'Next Week Plan',
    };

    const systemPrompt = `你是一个职场写作助手。根据用户提供的工作内容，生成结构化的周报。包含：本周总结、主要成果、问题与风险、下周计划。

输出要求：
- 使用 markdown 格式
- 使用一级标题 # 周报标题
- 使用二级标题 ## 划分以下四个固定章节：
  ## ${sectionLabels.summary}
  ## ${sectionLabels.achievements}
  ## ${sectionLabels.issues}
  ## ${sectionLabels.plans}
- 每个章节内容要充实具体，可用列表 - 呈现
- 用 ${langLabel} 输出

返回格式要求（必须是有效的 JSON）：
{
  "report": "周报全文（markdown 格式字符串）"
}`;

    const achievementsSection = achievements?.trim() ? `\n${locale === 'zh' ? '已取得成果' : locale === 'es' ? 'Logros obtenidos' : locale === 'fr' ? 'Résultats obtenus' : locale === 'hi' ? 'प्राप्त उपलब्धियां' : locale === 'ar' ? 'الإنجازات المحققة' : 'Achievements made'}: ${achievements.trim()}` : '';
    const plansSection = plans?.trim() ? `\n${locale === 'zh' ? '下周计划' : locale === 'es' ? 'Plan de próxima semana' : locale === 'fr' ? 'Plan de la semaine prochaine' : locale === 'hi' ? 'अगले सप्ताह की योजना' : locale === 'ar' ? 'خطة الأسبوع القادم' : 'Next week plan'}: ${plans.trim()}` : '';

    const userPrompt = locale === 'zh'
      ? `职位：${role}\n本周工作内容：\n${tasks}${achievementsSection}${plansSection}\n\n请生成结构化周报。`
      : locale === 'es'
      ? `Puesto: ${role}\nTareas de esta semana:\n${tasks}${achievementsSection}${plansSection}\n\nGenera un informe semanal estructurado.`
      : locale === 'fr'
      ? `Poste: ${role}\nTâches de cette semaine:\n${tasks}${achievementsSection}${plansSection}\n\nGénérez un rapport hebdomadaire structuré.`
      : locale === 'hi'
      ? `पद: ${role}\nइस सप्ताह के कार्य:\n${tasks}${achievementsSection}${plansSection}\n\nएक संरचित साप्ताहिक रिपोर्ट बनाएं।`
      : locale === 'ar'
      ? `المنصب: ${role}\nمهام هذا الأسبوع:\n${tasks}${achievementsSection}${plansSection}\n\nأنشئ تقريراً أسبوعياً منظماً.`
      : `Role: ${role}\nThis week's tasks:\n${tasks}${achievementsSection}${plansSection}\n\nGenerate a structured weekly report.`;

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
        temperature: 0.6,
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

    if (!result.report || typeof result.report !== 'string') {
      return NextResponse.json({ error: 'No report generated' }, { status: 500 });
    }

    return NextResponse.json({
      report: result.report,
      remaining,
    });
  } catch (error) {
    console.error('AI Weekly Report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
