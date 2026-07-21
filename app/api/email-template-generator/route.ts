import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { subject, product, audience, tone, locale = 'zh' } = await req.json();

    if (!subject || !product) {
      return NextResponse.json({ error: 'Subject and product are required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个专业的邮件营销专家。根据用户提供的主题、产品信息、目标受众和语气，生成高质量的邮件模板。

生成内容包括：
1. 邮件主题行（3个变体）
2. 邮件正文（完整的HTML格式邮件内容）
3. 邮件签名
4. 行动号召（CTA）

返回格式要求（必须是有效的 JSON）：
{
  "subjects": ["主题1", "主题2", "主题3"],
  "body": "邮件正文内容（包含段落、列表、加粗等格式）",
  "signature": "邮件签名",
  "cta": "行动号召文案",
  "tips": ["优化建议1", "优化建议2", "..."]
}

请用 ${langLabel} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

    const userPrompt = locale === 'zh'
      ? `邮件主题：${subject}\n产品信息：${product}\n目标受众：${audience || '普通消费者'}\n语气风格：${tone || '专业友好'}\n\n请生成高质量的邮件模板并按JSON格式返回。`
      : locale === 'es'
      ? `Asunto del correo: ${subject}\nInformación del producto: ${product}\nPúblico objetivo: ${audience || 'consumidores generales'}\nTono: ${tone || 'profesional y amigable'}\n\nGenera una plantilla de correo de alta calidad y devuelve en formato JSON.`
      : locale === 'fr'
      ? `Objet du mail: ${subject}\nInformations sur le produit: ${product}\nPublic cible: ${audience || 'consommateurs généraux'}\nTonalité: ${tone || 'professionnelle et amicale'}\n\nGénérez un modèle de courrier électronique de haute qualité et retournez au format JSON.`
      : locale === 'hi'
      ? `ईमेल विषय: ${subject}\nउत्पाद जानकारी: ${product}\nलक्षित दर्शक: ${audience || 'सामान्य उपभोक्ता'}\nस्वर शैली: ${tone || 'पेशेवर और दोस्ताना'}\n\nउच्च गुणवत्ता का ईमेल टेम्पलेट उत्पन्न करें और JSON प्रारूप में लौटाएं।`
      : locale === 'ar'
      ? `موضوع البريد: ${subject}\nمعلومات المنتج: ${product}\nالجمهور المستهدف: ${audience || 'المستهلكون العاديون'}\nالنبرة: ${tone || 'محترفة ودружية'}\n\nقم بإنشاء قالب بريد إلكتروني عالي الجودة وارجع بالتنسيق JSON.`
      : `Email subject: ${subject}\nProduct information: ${product}\nTarget audience: ${audience || 'general consumers'}\nTone: ${tone || 'professional and friendly'}\n\nGenerate a high-quality email template and return in JSON format.`;

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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Email template generator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}