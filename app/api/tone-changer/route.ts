import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, tone, locale = 'zh' } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
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

    const systemPrompt = `你是一个专业的语气转换助手。根据用户提供的文本和目标语气，重写文本使其符合指定的语气风格。

语气类型说明：
- 正式/商务：适合商务邮件、正式报告等场合
- 友好/亲切：适合朋友交流、社交媒体等场合
- 简洁/精炼：去除冗余，直接表达核心内容
- 幽默/风趣：添加轻松幽默的表达方式
- 说服/营销：具有说服力，适合营销文案
- 学术/专业：严谨专业，适合学术写作

返回格式要求（必须是有效的 JSON）：
{
  "original": "原始文本",
  "rewritten": "转换后的文本",
  "tone": "使用的语气",
  "explanation": "转换说明（简要说明做了哪些改动）"
}

请用 ${langLabel} 输出。保持原文的核心意思不变。`;

    const userPrompt = locale === 'zh'
      ? `原始文本：${text}\n\n目标语气：${targetTone}\n\n请转换语气并重写。`
      : locale === 'es'
      ? `Texto original: ${text}\n\nTono objetivo: ${targetTone}\n\nReescribe con el tono especificado.`
      : locale === 'fr'
      ? `Texte original: ${text}\n\nTon cible: ${targetTone}\n\nRéécrivez avec le ton spécifié.`
      : locale === 'hi'
      ? `मूल पाठ: ${text}\n\nलक्ष्य टोन: ${targetTone}\n\nनिर्दिष्ट टोन के साथ फिर से लिखें।`
      : locale === 'ar'
      ? `النص الأصلي: ${text}\n\nالنبرة المستهدفة: ${targetTone}\n\nأعد كتابته بالنبرة المحددة.`
      : `Original text: ${text}\n\nTarget tone: ${targetTone}\n\nRewrite with the specified tone.`;

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
        temperature: 0.7,
        max_tokens: 1500,
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

    if (!result.rewritten) {
      return NextResponse.json({ error: 'No rewritten text generated' }, { status: 500 });
    }

    return NextResponse.json({
      original: text,
      rewritten: result.rewritten,
      tone: tone,
      explanation: result.explanation || '',
    });
  } catch (error) {
    console.error('Tone changer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
