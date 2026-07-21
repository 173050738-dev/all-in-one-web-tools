import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;

const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    const { text, level, locale } = await request.json();

    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    const currentTime = Date.now();
    const existing = rateLimitStore.get(clientIp);
    
    if (existing && currentTime - existing.timestamp < RATE_LIMIT_WINDOW) {
      if (existing.count >= RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', message: locale === 'zh' ? '今日免费次数已用完' : 'Free daily limit exceeded' },
          { status: 429 }
        );
      }
      existing.count++;
    } else {
      rateLimitStore.set(clientIp, { count: 1, timestamp: currentTime });
    }

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required', message: locale === 'zh' ? '请输入待清洗的文案' : 'Please enter text to clean' }, { status: 400 });
    }

    const levelDesc = level === 'strong' ? '深度清洗，只保留核心信息，大幅度精简' : level === 'mid' ? '中等清洗，去除重复和空洞词，适当精简' : '轻度清洗，去除重复内容';

    const prompt = locale === 'zh' 
      ? `请对以下文案进行${levelDesc}，保留核心信息的同时优化表达，使文案更加精炼、专业：\n\n${text}\n\n请直接返回清洗后的文案，不要添加任何解释。`
      : `Please clean the following text with ${levelDesc}, optimize the expression while preserving core information, making it more concise and professional:\n\n${text}\n\nPlease return the cleaned text directly without any explanations.`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', message: locale === 'zh' ? '服务暂不可用' : 'Service unavailable' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: locale === 'zh' ? '你是一个专业的文案优化专家，擅长去除冗余、精简表达、提升文案质量。' : 'You are a professional copywriting optimization expert skilled in removing redundancy, concise expression, and improving copy quality.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'API error', message: locale === 'zh' ? '清洗失败，请重试' : 'Cleaning failed, please retry' },
        { status: response.status }
      );
    }

    const cleaned = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ success: true, cleaned });

  } catch (error) {
    console.error('Copy cleaner error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}