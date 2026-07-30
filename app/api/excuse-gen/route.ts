import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { scenario, mode, locale = 'zh', customScenario } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    const langLabel =
      locale === 'zh' ? '中文'
      : locale === 'es' ? 'español'
      : locale === 'fr' ? 'français'
      : locale === 'hi' ? 'हिन्दी'
      : locale === 'ar' ? 'العربية'
      : 'English';

    const scenarioMap: Record<string, Record<string, string>> = {
      zh: { late: '迟到', 'skip-work': '不想上班', 'cancel-plans': '不想赴约', deadline: 'deadline拖了' },
      en: { late: 'running late', 'skip-work': 'skip work', 'cancel-plans': 'cancel plans', deadline: 'missed deadline' },
      es: { late: 'llegar tarde', 'skip-work': 'faltar al trabajo', 'cancel-plans': 'cancelar planes', deadline: 'plazo vencido' },
      fr: { late: 'en retard', 'skip-work': 'rater le travail', 'cancel-plans': 'annuler un plan', deadline: 'deadline manquée' },
      hi: { late: 'देर से पहुंचना', 'skip-work': 'काम छोड़ना', 'cancel-plans': 'योजना रद्द', deadline: 'समयसीमा छूटी' },
      ar: { late: 'تأخرت', 'skip-work': 'غياب عن العمل', 'cancel-plans': 'إلغاء خطة', deadline: 'فات الموعد' },
    };

    const modeDescMap: Record<string, Record<string, string>> = {
      zh: { serious: '真实可信、日常生活中真的会用的借口', ridiculous: '荒诞搞笑、离谱但好笑的借口' },
      en: { serious: 'plausible and realistic excuse you would actually use', ridiculous: 'absurd and hilarious excuse' },
      es: { serious: 'excusa creíble y realista que realmente usarías', ridiculous: 'excusa absurda y divertida' },
      fr: { serious: 'excuse crédible et réaliste que vous utiliseriez vraiment', ridiculous: 'excuse absurde et drôle' },
      hi: { serious: 'विश्वसनीय और यथार्थवादी बहाना जो आप वास्तव में उपयोग करेंगे', ridiculous: 'बेतुका और मज़ेदार बहाना' },
      ar: { serious: 'عذر واقعي ومصداق يمكنك استخدامه فعلاً', ridiculous: 'عذر سخيف ومضحك' },
    };

    const actualScenario = customScenario?.trim() || scenarioMap[locale]?.[scenario] || scenario;
    const modeDesc = modeDescMap[locale]?.[mode] || modeDescMap.en[mode];

    const systemPrompt = `你是一个借口生成器。根据场景和模式生成一条借口。${modeDesc}。只返回JSON：{"excuse":"借口内容","explanation":"一句话解释为什么可信/好笑"}。用${langLabel}输出。借口要简短（1-2句话），口语化，不要编造违法/伤害性内容。`;

    const userPrompt = `场景：${actualScenario}\n模式：${mode === 'serious' ? '正经' : '离谱'}\n请生成1条借口。`;

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
        temperature: mode === 'ridiculous' ? 1.0 : 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
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

    if (!result.excuse) {
      return NextResponse.json({ error: 'No excuse generated' }, { status: 500 });
    }

    return NextResponse.json({
      excuse: result.excuse,
      explanation: result.explanation || '',
      source: 'ai',
    });
  } catch (error) {
    console.error('Excuse Gen error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
