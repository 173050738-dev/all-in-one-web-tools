import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;

const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    const { theme, emotion, keywords, locale } = await request.json();

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

    const prompt = locale === 'zh' 
      ? `请为我生成5条${theme}主题的${emotion}风格朋友圈文案，每条文案要简短有趣，适合社交媒体发布。${keywords ? '包含关键词：' + keywords.join('、') : ''}不要太长，每条不超过40个字。`
      : `Generate 5 social media captions about ${theme} with ${emotion} tone. ${keywords ? 'Include keywords: ' + keywords.join(', ') : ''} Keep them short, engaging and suitable for social media. Each caption should be under 60 characters.`;

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
          { role: 'system', content: locale === 'zh' ? '你是一个专业的文案创作助手，擅长创作各种风格的社交媒体文案。' : 'You are a professional copywriting assistant skilled in creating social media captions.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'API error', message: locale === 'zh' ? '生成失败，请重试' : 'Generation failed, please retry' },
        { status: response.status }
      );
    }

    const content = data.choices?.[0]?.message?.content || '';
    const captions = content.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, '').trim()).slice(0, 5);

    return NextResponse.json({ success: true, captions });

  } catch (error) {
    console.error('Caption generator error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}