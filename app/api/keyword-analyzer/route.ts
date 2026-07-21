import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { keywords, locale = 'zh' } = await req.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: 'Keywords data is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const keywordsText = keywords.map((k: string, i: number) => `${i + 1}. ${k}`).join('\n');

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个专业的电商SEO关键词分析专家。根据用户提供的关键词，进行全面的关键词分析。

分析内容包括：
1. 搜索量预估：根据关键词热度给出搜索量等级（高/中/低）
2. 竞争度分析：评估关键词竞争程度（激烈/中等/低）
3. 出价建议：根据竞争度给出建议出价范围
4. 相关性分析：分析关键词之间的关联度
5. 长尾词推荐：为每个关键词推荐3-5个相关长尾词
6. 语义扩展：扩展相关语义关键词

返回格式要求（必须是有效的 JSON）：
{
  "totalKeywords": 关键词总数,
  "keywords": [
    {
      "keyword": "关键词",
      "searchVolume": "搜索量等级(low|medium|high)",
      "competition": "竞争度(low|medium|high|veryHigh)",
      "suggestedBid": "建议出价",
      "difficulty": 难度分数(1-100),
      "relatedKeywords": ["相关词1", "相关词2", "..."],
      "longTailKeywords": ["长尾词1", "长尾词2", "..."],
      "semanticKeywords": ["语义扩展词1", "..."],
      "intention": "用户意图(informational|navigational|transactional|commercial)"
    }
  ],
  "summary": "总体分析总结"
}

请用 ${langLabel} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

    const userPrompt = locale === 'zh'
      ? `关键词列表：\n${keywordsText}\n\n请进行全面的关键词分析并按JSON格式返回。`
      : locale === 'es'
      ? `Lista de palabras clave:\n${keywordsText}\n\nRealice un análisis completo de palabras clave y devuelva en formato JSON.`
      : locale === 'fr'
      ? `Liste de mots clés:\n${keywordsText}\n\nEffectuez une analyse complète des mots clés et retournez au format JSON.`
      : locale === 'hi'
      ? `कीवर्ड सूची:\n${keywordsText}\n\nकीवर्डों का पूर्ण विश्लेषण करें और JSON प्रारूप में लौटाएं।`
      : locale === 'ar'
      ? `قائمة الكلمات المفتاحية:\n${keywordsText}\n\nقم بإجراء تحليل شامل للكلمات المفتاحية وارجع بالتنسيق JSON.`
      : `Keyword list:\n${keywordsText}\n\nPerform a comprehensive keyword analysis and return in JSON format.`;

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
    console.error('Keyword analyzer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}