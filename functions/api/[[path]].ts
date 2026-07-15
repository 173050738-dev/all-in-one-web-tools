/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB?: D1Database;
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  DEEPSEEK_MODEL?: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

function errJson(error: string, status: number): Response {
  return json({ error }, status);
}

const langLabel = (locale: string): string => {
  return locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';
};

const toneMap: Record<string, Record<string, string>> = {
  zh: { formal: '正式/商务', friendly: '友好/亲切', concise: '简洁/精炼', humorous: '幽默/风趣', persuasive: '说服/营销', academic: '学术/专业' },
  en: { formal: 'formal/business', friendly: 'friendly/casual', concise: 'concise/to-the-point', humorous: 'humorous/funny', persuasive: 'persuasive/marketing', academic: 'academic/professional' },
  es: { formal: 'formal', friendly: 'amigable', concise: 'conciso', humorous: 'humorístico', persuasive: 'persuasivo', academic: 'académico' },
  fr: { formal: 'formel', friendly: 'amiable', concise: 'concis', humorous: 'humoristique', persuasive: 'persuasif', academic: 'académique' },
  hi: { formal: 'औपचारिक', friendly: 'दोस्ताना', concise: 'संक्षिप्त', humorous: 'हास्यपूर्ण', persuasive: 'प्रेरणादायक', academic: 'अकादमिक' },
  ar: { formal: 'رسمي', friendly: 'ودود', concise: 'مختصر', humorous: 'مزح', persuasive: 'قائل', academic: 'أكاديمي' },
};

async function callDeepseek(env: Env, systemPrompt: string, userPrompt: string, jsonResponse = false): Promise<string> {
  const apiKey = env.DEEPSEEK_API_KEY;
  const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

  if (!apiKey) throw new Error('API key not configured');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: jsonResponse ? { type: 'json_object' } : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepSeek API error:', response.status, errorText);
    throw new Error('AI service unavailable');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function checkRateLimit(env: Env, request: Request, limit: number = 5): Promise<{ remaining: number | null; blocked: boolean; message: string }> {
  if (!env.DB) return { remaining: null, blocked: false, message: '' };
  
  try {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const day = new Date().toISOString().split('T')[0];
    const key = `${ip}:${day}`;

    const result = await env.DB.prepare('SELECT count FROM ai_usage WHERE k = ?')
      .bind(key)
      .first();

    const used = result?.count || 0;
    if (used >= limit) {
      return { remaining: 0, blocked: true, message: 'Daily free limit exceeded' };
    }

    await env.DB.prepare('INSERT INTO ai_usage (k, count, day) VALUES (?, 1, ?) ON CONFLICT(k) DO UPDATE SET count = count + 1')
      .bind(key, day)
      .run();

    return { remaining: Math.max(0, limit - used - 1), blocked: false, message: '' };
  } catch (dbError) {
    console.error('D1 rate limit error:', dbError);
    return { remaining: null, blocked: false, message: '' };
  }
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return errJson('Method not allowed', 405);
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');

  let payload: Record<string, unknown> = {};
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return errJson('Invalid JSON body', 400);
  }

  const locale = (payload.locale as string) || 'zh';

  try {
    switch (path) {
        case '/api/tone-changer':
        case '/api/tone-changer/': {
          const text = payload.text as string;
          const tone = (payload.tone as string) || 'friendly';
          if (!text?.trim()) return errJson('Text is required', 400);
          const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.friendly || 'friendly';
          const systemPrompt = `你是一个专业的语气转换助手。根据用户提供的文本和目标语气，重写文本使其符合指定的语气风格。语气类型说明：正式/商务、友好/亲切、简洁/精炼、幽默/风趣、说服/营销、学术/专业。请用 ${langLabel(locale)} 输出。保持原文的核心意思不变。`;
          const userPrompt = locale === 'zh' ? `原始文本：${text}\n\n目标语气：${targetTone}\n\n请转换语气并重写。` : locale === 'es' ? `Texto original: ${text}\n\nTono objetivo: ${targetTone}\n\nReescribe con el tono especificado.` : locale === 'fr' ? `Texte original: ${text}\n\nTon cible: ${targetTone}\n\nRéécrivez avec le ton spécifié.` : locale === 'hi' ? `मूल पाठ: ${text}\n\nलक्ष्य टोन: ${targetTone}\n\nनिर्दिष्ट टोन के साथ फिर से लिखें।` : locale === 'ar' ? `النص الأصلي: ${text}\n\nالنبرة المستهدفة: ${targetTone}\n\nأعد كتابته بالنبرة المحددة.` : `Original text: ${text}\n\nTarget tone: ${targetTone}\n\nRewrite with the specified tone.`;
          const content = await callDeepseek(env, systemPrompt, userPrompt);
          return json({ original: text, rewritten: content, tone, explanation: '' });
        }

        case '/api/task-breakdown':
        case '/api/task-breakdown/': {
          const task = payload.task as string;
          if (!task?.trim()) return errJson('Task is required', 400);
          const systemPrompt = `你是一个高效的任务分解助手。根据用户提供的任务描述，将其分解为具体的、可执行的步骤。分解原则：步骤清晰具体、按逻辑顺序排列、考虑依赖关系、给出时间估算。请用 ${langLabel(locale)} 输出。`;
          const userPrompt = locale === 'zh' ? `任务描述：${task}\n\n请将此任务分解为具体步骤。` : locale === 'es' ? `Descripción de la tarea: ${task}\n\nDescomponga esta tarea en pasos específicos.` : locale === 'fr' ? `Description de la tâche: ${task}\n\nDécomposez cette tâche en étapes spécifiques.` : locale === 'hi' ? `कार्य विवरण: ${task}\n\nइस कार्य को विशिष्ट चरणों में विभाजित करें।` : locale === 'ar' ? `وصف المهمة: ${task}\n\nقم بتفكيك هذه المهمة إلى خطوات محددة.` : `Task description: ${task}\n\nBreak down this task into specific steps.`;
          const content = await callDeepseek(env, systemPrompt, userPrompt);
          return json({ task, steps: content, explanation: '' });
        }

        case '/api/concept-explain':
        case '/api/concept-explain/': {
          const concept = payload.concept as string;
          const depth = (payload.depth as string) || 'simple';
          if (!concept?.trim()) return errJson('Concept is required', 400);
          const depthDesc = depth === 'simple' ? '简单易懂，适合初学者' : depth === 'medium' ? '中等深度，适合有一定基础' : '深入详细，适合专业人士';
          const systemPrompt = `你是一个专业的知识讲解助手。根据用户提供的概念和深度要求，用通俗易懂的方式解释复杂概念。解释原则：从基础定义开始、结合实例说明、使用比喻帮助理解、结构清晰有条理。请用 ${langLabel(locale)} 输出。`;
          const userPrompt = locale === 'zh' ? `概念：${concept}\n\n讲解深度：${depthDesc}\n\n请解释这个概念。` : locale === 'es' ? `Concepto: ${concept}\n\nProfundidad de explicación: ${depth === 'simple' ? 'simple para principiantes' : depth === 'medium' ? 'medio para con conocimientos básicos' : 'profundo para profesionales'}\n\nExplica este concepto.` : locale === 'fr' ? `Concept: ${concept}\n\nProfondeur d'explication: ${depth === 'simple' ? 'simple pour débutants' : depth === 'medium' ? 'moyen pour personnes avec des bases' : 'profond pour professionnels'}\n\nExpliquez ce concept.` : locale === 'hi' ? `संकल्पना: ${concept}\n\nव्याख्या की गहराई: ${depth === 'simple' ? 'शुरुआती के लिए सरल' : depth === 'medium' ? 'कुछ आधार के साथ मध्यम' : 'पेशेवरों के लिए गहरा'}\n\nइस अवधारणा की व्याख्या करें।` : locale === 'ar' ? `المفهوم: ${concept}\n\nعمق الشرح: ${depth === 'simple' ? 'بسيط للمبتدئين' : depth === 'medium' ? 'متوسط للأشخاص ذوي الأساس' : 'عميق للمحترفين'}\n\nشرح هذا المفهوم.` : `Concept: ${concept}\n\nExplanation depth: ${depth === 'simple' ? 'simple for beginners' : depth === 'medium' ? 'medium for those with basic knowledge' : 'deep for professionals'}\n\nExplain this concept.`;
          const content = await callDeepseek(env, systemPrompt, userPrompt);
          return json({ concept, explanation: content, depth });
        }

        case '/api/idea-to-action':
        case '/api/idea-to-action/': {
          const idea = payload.idea as string;
          if (!idea?.trim()) return errJson('Idea is required', 400);
          const systemPrompt = `你是一个高效的行动规划助手。根据用户提供的创意想法，帮助制定可执行的行动计划。规划原则：目标明确、步骤具体、时间合理、资源可行、风险可控。请用 ${langLabel(locale)} 输出。`;
          const userPrompt = locale === 'zh' ? `创意想法：${idea}\n\n请制定一个可执行的行动计划。` : locale === 'es' ? `Idea creativa: ${idea}\n\nDesarrolla un plan de acción ejecutable.` : locale === 'fr' ? `Idée créative: ${idea}\n\nÉlaborez un plan d'action exécutable.` : locale === 'hi' ? `रचनात्मक विचार: ${idea}\n\nएक निष्पादन योग्य कार्य योजना बनाएं।` : locale === 'ar' ? `فكرة إبداعية: ${idea}\n\nقم بإعداد خطة عمل يمكن تنفيذها.` : `Creative idea: ${idea}\n\nDevelop an actionable plan.`;
          const content = await callDeepseek(env, systemPrompt, userPrompt);
          return json({ idea, plan: content, steps: [] });
        }

        case '/api/ai-copywriter':
        case '/api/ai-copywriter/': {
          const product = payload.product as string;
          const selling = payload.selling as string;
          const type = (payload.type as string) || 'ad-headline';
          const tone = (payload.tone as string) || 'persuasive';
          const platform = (payload.platform as string) || 'general';
          if (!product?.trim() || !selling?.trim()) return errJson('Product and selling points are required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.persuasive || 'persuasive';
          const systemPrompt = `你是一个专业的营销文案生成专家。根据用户提供的产品信息和需求，生成高质量的营销文案。

文案类型：
- 广告标题：吸引眼球的短标题，适合投放广告
- 产品描述：详细介绍产品特点和优势
- 社媒帖子：适合社交媒体平台的文案
- 邮件主题：吸引打开的邮件标题
- 落地页首屏：落地页顶部的核心文案

目标平台：
- 通用：适用于多个平台
- 独立站：电商独立站
- Instagram：图片社交平台
- Facebook：社交网络
- X：原Twitter，短文本平台

语气风格：
- 正式/商务：专业严谨
- 友好/亲切：轻松随和
- 简洁/精炼：言简意赅
- 幽默/风趣：轻松有趣
- 说服/营销：有说服力
- 学术/专业：专业权威

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "copy": "生成的文案内容",
      "why": "为什么这样写（一句话说明）"
    }
  ]
}

请生成【3条】候选文案。用 ${langLabel(locale)} 输出。文案要真实可信，不夸大不吹牛，不编造虚假数据。`;

          const userPrompt = locale === 'zh'
            ? `产品名：${product}\n\n核心卖点：${selling}\n\n文案类型：${type}\n\n目标平台：${platform}\n\n语气风格：${targetTone}\n\n请生成3条营销文案。`
            : locale === 'es'
            ? `Nombre del producto: ${product}\n\nPuntos de venta: ${selling}\n\nTipo de texto: ${type}\n\nPlataforma objetivo: ${platform}\n\nEstilo de tono: ${targetTone}\n\nGenera 3 copys de marketing.`
            : locale === 'fr'
            ? `Nom du produit: ${product}\n\nPoints de vente: ${selling}\n\nType de texte: ${type}\n\nPlateforme cible: ${platform}\n\nStyle de ton: ${targetTone}\n\nGénérez 3 copies marketing.`
            : locale === 'hi'
            ? `उत्पाद का नाम: ${product}\n\nबिक्री बिंदु: ${selling}\n\nपाठ प्रकार: ${type}\n\nलक्ष्य प्लेटफॉर्म: ${platform}\n\nटोन शैली: ${targetTone}\n\n3 मार्केटिंग कॉपी बनाएं।`
            : locale === 'ar'
            ? `اسم المنتج: ${product}\n\nنقاط البيع: ${selling}\n\nنوع النص: ${type}\n\nالمنصة المستهدفة: ${platform}\n\nأسلوب النبرة: ${targetTone}\n\nأنشئ 3 نسخ تسويقية.`
            : `Product name: ${product}\n\nSelling points: ${selling}\n\nCopy type: ${type}\n\nTarget platform: ${platform}\n\nTone style: ${targetTone}\n\nGenerate 3 marketing copies.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.items || !Array.isArray(result.items)) {
            return errJson('No copy generated', 500);
          }
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/seo-miner':
        case '/api/seo-miner/': {
          const url = payload.url as string;
          const keywords = (payload.keywords as string) || '';
          if (!url?.trim()) return errJson('URL is required', 400);
          const systemPrompt = `你是一个专业的SEO分析助手。根据用户提供的URL和关键词，分析该网页的SEO优化情况。分析内容包括：页面标题、元描述、关键词密度、内容质量、内部链接、外部链接、移动端适配、页面速度等。请用 ${langLabel(locale)} 输出。`;
          const userPrompt = locale === 'zh' ? `分析URL：${url}\n\n目标关键词：${keywords || '无'}\n\n请进行全面的SEO分析。` : locale === 'es' ? `URL a analizar: ${url}\n\nPalabras clave objetivo: ${keywords || 'ninguna'}\n\nRealiza un análisis SEO completo.` : locale === 'fr' ? `URL à analyser: ${url}\n\nMots-clés cibles: ${keywords || 'aucune'}\n\nEffectuez une analyse SEO complète.` : locale === 'hi' ? `विश्लेषण URL: ${url}\n\nलक्ष्य कीवर्ड: ${keywords || 'कोई नहीं'}\n\nपूर्ण SEO विश्लेषण करें।` : locale === 'ar' ? `URL لتحليله: ${url}\n\nالكلمات الرئيسية المستهدفة: ${keywords || 'لا يوجد'}\n\nقم بإجراء تحليل SEO شامل.` : `URL to analyze: ${url}\n\nTarget keywords: ${keywords || 'none'}\n\nPerform a comprehensive SEO analysis.`;
          const content = await callDeepseek(env, systemPrompt, userPrompt);
          return json({ url, keywords, analysis: content });
        }

        default:
          return errJson('Not found', 404);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('API error:', path, msg);
      if (msg.includes('API key not configured')) {
        return errJson('AI service not configured (missing API key)', 503);
      }
      if (msg.includes('AI service unavailable')) {
        return errJson('AI service temporarily unavailable. Please try again later.', 503);
      }
      return errJson(`Internal server error: ${msg}`, 500);
    }
};