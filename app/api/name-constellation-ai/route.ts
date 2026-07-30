import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { name, locale = 'zh', style = 0 } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

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

    const styleNames = ['milky-way', 'aurora', 'twilight', 'dreamscape'];
    const styleName = styleNames[style] || 'milky-way';

    const systemPrompt = `You are a mystical name analyst. Transform a person's name into a "star constellation" personality map.

For each letter in the name, assign:
- A unique meaning (1-3 words, e.g. "creative", "wise", "brave")
- A hex color from these palettes based on style "${styleName}":
  milky-way: ["#ffffff", "#ffd700", "#87ceeb", "#dda0dd", "#fffacd"]
  aurora: ["#7df9ff", "#0077b6", "#caf0f8", "#90e0ef", "#ade8f4"]
  twilight: ["#e0aaff", "#c77dff", "#9d4edd", "#7b2cbf", "#ffd6ff"]
  dreamscape: ["#f5e6ff", "#da8fff", "#b388ff", "#e1bee7", "#f8bbd0"]
- A size value (3-8 range)
- A brightness value (0.5-1.0)

Also generate:
- A connections list indicating which letters are "connected" (have compatible energies)
- A 2-3 sentence description of the name's personality profile
- 3-5 personality trait keywords
- A lucky color (hex) and lucky number (1-9)

Return ONLY valid JSON with this exact structure:
{
  "stars": [{"id":0, "letter":"A", "x":0, "y":0, "color":"#fff", "size":5, "brightness":0.8, "meaning":"creative", "energy":0.7}],
  "connections": [{"from":0, "to":1, "strength":0.8}],
  "description": "Your name contains...",
  "traits": ["trait1", "trait2"],
  "luckyColor": "#ffd700",
  "luckyNumber": 5
}

IMPORTANT RULES:
- Use the EXACT letters from the name, preserving case
- Each star's x,y should form a scattered constellation pattern (centered around 400,300, spread across 200px)
- Connections should only connect letters with compatible energies (30-70% of possible pairs)
- The description and traits must be in ${langLabel}
- Meanings can be in ${langLabel} or English, keep them short
- Make each name unique - never return the same pattern twice`;

    const userPrompt = `Name: "${name}"
Style: ${styleName}
Please generate the constellation map.`;

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
        temperature: 0.9,
        max_tokens: 2000,
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

    if (!result.stars || result.stars.length === 0) {
      return NextResponse.json({ error: 'No stars generated' }, { status: 500 });
    }

    // Validate and fix star positions if needed
    const stars = result.stars.map((s: any, i: number) => ({
      id: i,
      letter: String(s.letter || '?'),
      x: typeof s.x === 'number' ? s.x : 200 + i * 30,
      y: typeof s.y === 'number' ? s.y : 200 + (i % 3) * 40,
      color: String(s.color || '#ffffff'),
      size: Math.min(12, Math.max(2, Number(s.size) || 5)),
      brightness: Math.min(1, Math.max(0.3, Number(s.brightness) || 0.7)),
      meaning: String(s.meaning || ''),
      energy: Math.min(1, Math.max(0, Number(s.energy) || 0.5)),
    }));

    // Ensure x,y form a nice constellation
    const cx = 400, cy = 300;
    const n = stars.length;
    stars.forEach((s, i) => {
      const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
      const r = 80 + (i % 3) * 60 + (i * 7 % 30);
      s.x = cx + Math.cos(angle) * r + (i * 11 % 20) - 10;
      s.y = cy + Math.sin(angle) * r + (i * 13 % 20) - 10;
    });

    const connections = (result.connections || []).map((c: any) => ({
      from: Number(c.from) || 0,
      to: Number(c.to) || 0,
      strength: Math.min(1, Math.max(0.1, Number(c.strength) || 0.5)),
    }));

    // Generate connections if AI returned too few
    if (connections.length < Math.min(3, n)) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (dist < 150 && Math.random() > 0.5) {
            connections.push({ from: i, to: j, strength: Math.max(0.3, 1 - dist / 150) });
          }
        }
      }
    }

    return NextResponse.json({
      stars,
      connections,
      description: String(result.description || ''),
      traits: Array.isArray(result.traits) ? result.traits : [],
      luckyColor: String(result.luckyColor || '#ffffff'),
      luckyNumber: Math.min(9, Math.max(1, Number(result.luckyNumber) || 5)),
      source: 'ai',
    });
  } catch (error) {
    console.error('Name Constellation error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}