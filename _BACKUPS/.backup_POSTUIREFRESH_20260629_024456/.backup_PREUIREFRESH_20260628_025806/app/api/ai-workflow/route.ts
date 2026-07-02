import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';

export async function POST(req: NextRequest) {
  try {
    const { query, locale = 'zh' } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const toolList = tools.slice(0, 80).map(t => ({
      slug: t.slug,
      name: t.name,
      description: t.description,
      tags: t.tags,
      category: t.category,
      isFree: t.isFree,
    }));

    const systemPrompt = `你是一个工作流生成助手。根据用户的需求，从提供的工具列表中选择最合适的工具，生成一个完整的工作流。

工作流要求：
- 3-6个步骤
- 每个步骤对应一个工具
- 步骤之间要有逻辑顺序
- 每个步骤要有简短的标题和描述

请严格按照以下JSON格式返回（不要返回其他内容）：
{
  "title": "工作流标题",
  "description": "工作流简介",
  "icon": "Zap",
  "category": "content-creator",
  "tags": ["标签1", "标签2"],
  "estimatedTime": "预估时间",
  "difficulty": "easy",
  "steps": [
    {
      "toolSlug": "工具slug",
      "title": "步骤标题",
      "description": "步骤描述"
    }
  ]
}

可选icon值：Presentation, Image, FileText, Code, Share2, GraduationCap, Video, Zap, Palette, Globe, TrendingUp, Mail, Headphones, ShoppingCart, Calendar
可选category值：content-creator, developer, designer, student, office-worker, video-creator
可选difficulty值：easy, medium, advanced

工具列表：
${JSON.stringify(toolList, null, 2)}

语言：${locale === 'zh' ? '中文' : 'English'}`;

    const userPrompt = locale === 'zh'
      ? `用户需求：${query}\n\n请生成对应的工具工作流。`
      : `User need: ${query}\n\nPlease generate the corresponding tool workflow.`;

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
        temperature: 0.5,
        max_tokens: 800,
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

    const validSteps = (result.steps || [])
      .filter((s: { toolSlug: string; title: string; description: string }) => {
        const tool = tools.find(t => t.slug === s.toolSlug);
        return tool && s.title && s.description;
      })
      .slice(0, 6);

    if (validSteps.length === 0) {
      return NextResponse.json({ error: 'No valid workflow generated' }, { status: 500 });
    }

    return NextResponse.json({
      title: result.title || (locale === 'zh' ? 'AI生成的工作流' : 'AI Generated Workflow'),
      description: result.description || '',
      icon: result.icon || 'Zap',
      category: result.category || 'content-creator',
      tags: result.tags || [],
      estimatedTime: result.estimatedTime || (locale === 'zh' ? '视情况而定' : 'Depends'),
      difficulty: result.difficulty || 'easy',
      steps: validSteps,
    });
  } catch (error) {
    console.error('AI workflow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
