import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { task, complexity, experience, locale = 'zh' } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const langLabel = locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';

    const systemPrompt = `你是一个专业的项目管理和工时估算专家。根据用户提供的任务描述、复杂度和经验水平，进行准确的工时估算。

估算内容包括：
1. 总工时估算（小时）
2. 分解任务步骤及每个步骤的工时
3. 潜在风险和意外情况的缓冲时间
4. 建议的进度安排

返回格式要求（必须是有效的 JSON）：
{
  "totalHours": 总工时数值,
  "totalDays": 总工作日数,
  "hoursPerDay": 每天工作小时数,
  "breakdown": [
    {
      "step": "任务步骤",
      "hours": 预估工时,
      "description": "步骤描述"
    }
  ],
  "bufferHours": 缓冲时间（小时）,
  "bufferPercentage": 缓冲百分比,
  "riskFactors": ["风险因素1", "风险因素2", "..."],
  "recommendations": ["建议1", "建议2", "..."],
  "summary": "估算总结"
}

请用 ${langLabel} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

    const userPrompt = locale === 'zh'
      ? `任务描述：${task}\n复杂度：${complexity || '中等'}\n经验水平：${experience || '中等'}\n\n请进行专业的工时估算并按JSON格式返回。`
      : locale === 'es'
      ? `Descripción de la tarea: ${task}\nComplejidad: ${complexity || 'media'}\nNivel de experiencia: ${experience || 'medio'}\n\nRealice una estimación de horas profesional y devuelva en formato JSON.`
      : locale === 'fr'
      ? `Description de la tâche: ${task}\nComplexité: ${complexity || 'moyenne'}\nNiveau d'expérience: ${experience || 'moyen'}\n\nEffectuez une estimation professionnelle du temps et retournez au format JSON.`
      : locale === 'hi'
      ? `कार्य विवरण: ${task}\nजटिलता: ${complexity || 'मध्यम'}\nअनुभव स्तर: ${experience || 'मध्यम'}\n\nपेशेवर टाइम एस्टीमेशन करें और JSON प्रारूप में लौटाएं।`
      : locale === 'ar'
      ? `وصف المهمة: ${task}\nالمعقدة: ${complexity || 'متوسطة'}\nمستوى الخبرة: ${experience || 'متوسط'}\n\nقم بإجراء تقدير وقت احترافي وارجع بالتنسيق JSON.`
      : `Task description: ${task}\nComplexity: ${complexity || 'medium'}\nExperience level: ${experience || 'medium'}\n\nPerform a professional time estimate and return in JSON format.`;

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
    console.error('Time estimator error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}