import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { competitors, locale = 'zh' } = await req.json();

    if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
      return NextResponse.json({ error: 'Competitors data is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const competitorText = competitors.map((c: any, i: number) => 
      `${i + 1}. 名称: ${c.name || '未命名'}, 链接: ${c.url || '无'}, 价格: ${c.price || '未定价'}, 评分: ${c.rating || '无'}, 评价数: ${c.reviews || '无'}`
    ).join('\n');

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个专业的电商竞品分析专家。根据用户提供的竞品信息，进行全面的竞品分析。

分析内容包括：
1. 价格分析：对比各竞品的价格水平，判断价位等级（低价/中价/高价/高端）
2. 评价分析：分析评分和评价数，判断好评率
3. 关键词分析：从产品名称中提取核心关键词，找出Top 5关键词
4. 卖点分析：分析各竞品的强势卖点和薄弱点
5. 优化建议：基于分析结果，给出具体的优化建议

返回格式要求（必须是有效的 JSON）：
{
  "avgPrice": 平均价格数值,
  "totalCompetitors": 竞品数量,
  "competitors": [
    {
      "name": "竞品名称",
      "price": "价格",
      "rating": "评分",
      "reviews": "评价数",
      "priceLevel": "low|medium|high|premium",
      "pricePosition": "priceAbove|priceBelow|priceAverage",
      "positiveRate": "好评率",
      "topKeywords": ["关键词1", "关键词2", "..."],
      "strongPoints": ["强势点1", "强势点2", "..."],
      "weakPoints": ["薄弱点1", "薄弱点2", "..."],
      "recommendations": ["建议1", "建议2", "..."]
    }
  ],
  "summary": "总体分析总结"
}

请用 ${langLabel} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

    const userPrompt = locale === 'zh'
      ? `竞品信息：\n${competitorText}\n\n请进行全面的竞品分析并按JSON格式返回。`
      : locale === 'es'
      ? `Información de competidores:\n${competitorText}\n\nRealice un análisis completo de competidores y devuelva en formato JSON.`
      : locale === 'fr'
      ? `Informations sur les concurrents:\n${competitorText}\n\nEffectuez une analyse complète des concurrents et retournez au format JSON.`
      : locale === 'hi'
      ? `प्रतिस्पर्धी की जानकारी:\n${competitorText}\n\nप्रतिस्पर्धियों का पूर्ण विश्लेषण करें और JSON प्रारूप में लौटाएं।`
      : locale === 'ar'
      ? `معلومات المنافسين:\n${competitorText}\n\nقم بإجراء تحليل شامل للمنافسين وارجع بالتنسيق JSON.`
      : `Competitor information:\n${competitorText}\n\nPerform a comprehensive competitor analysis and return in JSON format.`;

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
    console.error('Competitor analyzer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}