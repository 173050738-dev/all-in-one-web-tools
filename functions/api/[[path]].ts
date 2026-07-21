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

        case '/api/ai-grammar-checker':
        case '/api/ai-grammar-checker/': {
          const text = payload.text as string;
          const goal = (payload.goal as string) || 'general';
          if (!text?.trim()) return errJson('Text is required', 400);
          if (text.length > 4000) return errJson('Text too long (max 4000 chars)', 400);

          const rateLimitResult = await checkRateLimit(env, request, 10);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const systemPrompt = `你是专业的多语言写作校对与润色专家。分析用户文本，检测语法/拼写/标点/用词问题，给出改写与评分。
必须只返回有效 JSON，不要任何解释文字、不要用\`\`\`包裹。结构：
{
  "corrections":[{"original":"错误片段","suggestion":"改后","type":"grammar|spelling|punctuation|wording","reason":"为什么(一句话)"}],
  "rewritten":"整段改写后的通顺全文",
  "score": 0-100 的整数,
  "scoreComment":"一句话可读性评价",
  "tone":"检测到的当前语气(如 formal/neutral/stiff/friendly)",
  "toneSuggestion":"若语气不佳给出调整建议，否则空字符串",
  "stats":{"words":字数,"sentences":句数,"issues":问题数}
}
按【写作目标 goal】调整改写风格(academic学术严谨/business-email商务礼貌/social社媒轻快/resume简历有力/casual日常/general通用)。
所有文字输出用 ${langLabel(locale)}。corrections 最多返回 20 条。若无错误，corrections 返回空数组、rewritten 返回原文。`;

          const userPrompt = locale === 'zh'
            ? `待校对文本：\n${text}\n\n写作目标：${goal}\n\n请按 JSON 结构返回校对结果。`
            : locale === 'es'
            ? `Texto para revisar:\n${text}\n\nObjetivo de escritura: ${goal}\n\nDevuelve el resultado en formato JSON.`
            : locale === 'fr'
            ? `Texte à corriger:\n${text}\n\nObjectif d'écriture: ${goal}\n\nRetournez le résultat au format JSON.`
            : locale === 'hi'
            ? `प्रूफ़रीडिंग के लिए टेक्स्ट:\n${text}\n\nलेखन लक्ष्य: ${goal}\n\nJSON प्रारूप में परिणाम लौटाएं।`
            : locale === 'ar'
            ? `نص للمراجعة:\n${text}\n\nهدف الكتابة: ${goal}\n\nأرجِع النتيجة بصيغة JSON.`
            : `Text to proofread:\n${text}\n\nWriting goal: ${goal}\n\nReturn the result as the required JSON.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('AI response parse error', 502);
          }
          return json({ ...result, remaining: rateLimitResult.remaining });
        }

        case '/api/prompt-refine':
        case '/api/prompt-refine/': {
          const prompt = payload.prompt as string;
          const kind = (payload.kind as string) || 'image';
          const lang = (payload.lang as string) || 'en';
          if (!prompt?.trim()) return errJson('Prompt is required', 400);
          if (prompt.length > 2000) return errJson('Prompt too long (max 2000 chars)', 400);

          const rateLimitResult = await checkRateLimit(env, request, 10);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const isImage = kind === 'image';
          const langLabelStr = lang === 'zh' ? '中文' : 'English';
          const systemPrompt = `你是一个专业的 AI ${isImage ? '图像' : '视频'} 提示词优化专家。把用户提供的原始 prompt 优化成更专业、更出效果的高质量提示词。
优化要点：补充细节让画面更丰富；调整描述顺序，主体在前细节在后；保留原始 prompt 的核心意思不偏离主题；用 ${langLabelStr} 输出；只返回优化后的提示词文本，不要任何解释、不要 markdown、不要用引号包裹。
返回格式（必须是有效的 JSON）：{"refined": "优化后的提示词"}`;

          const userPrompt = lang === 'zh'
            ? `原始提示词：\n${prompt}\n\n请优化成更专业的${isImage ? '图像' : '视频'}生成提示词。`
            : `Original prompt:\n${prompt}\n\nRefine it into a more professional ${isImage ? 'image' : 'video'} generation prompt.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return json({ refined: prompt, remaining: rateLimitResult.remaining });
          }
          return json({ refined: result.refined || prompt, remaining: rateLimitResult.remaining });
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

        case '/api/ai-review-generator':
        case '/api/ai-review-generator/': {
          const product = payload.product as string;
          const selling = payload.selling as string;
          const type = (payload.type as string) || 'positive';
          const tone = (payload.tone as string) || 'friendly';
          const platform = (payload.platform as string) || 'general';
          if (!product?.trim() || !selling?.trim()) return errJson('Product name and feelings are required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.friendly || 'friendly';
          const systemPrompt = `你是一个专业的电商评价生成专家。根据用户提供的商品信息和简单感受，生成自然真实的评价。

评价类型：
- 好评：积极正面，突出优点
- 中评：客观中立，优缺点都提
- 差评：负面反馈，指出问题

目标平台：
- 淘宝：语气亲切，使用表情符号
- 拼多多：接地气，强调性价比
- 美团/饿了么：关注配送速度和服务
- 京东：强调品质和物流

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "review": "生成的评价内容"
    }
  ]
}

请生成【3条】候选评价。用 ${langLabel(locale)} 输出。评价要口语化，像真实用户写的，不要太官方太生硬。`;

          const userPrompt = locale === 'zh'
            ? `产品名：${product}\n\n核心卖点：${selling}\n\n评价类型：${type}\n\n目标平台：${platform}\n\n语气风格：${targetTone}\n\n请生成3条评价。`
            : locale === 'es'
            ? `Nombre del producto: ${product}\n\nPuntos de venta: ${selling}\n\nTipo de texto: ${type}\n\nPlataforma objetivo: ${platform}\n\nEstilo de tono: ${targetTone}\n\nGenera 3 copys de marketing.`
            : locale === 'fr'
            ? `Nom du produit: ${product}\n\nPoints de vente: ${selling}\n\nType de texte: ${type}\n\nPlateforme cible: ${platform}\n\nStyle de ton: ${targetTone}\n\nGénérez 3 copies marketing.`
            : locale === 'hi'
            ? `उत्पाद का नाम: ${product}\n\nबिक्री बिंदु: ${selling}\n\nपाठ प्रकार: ${type}\n\nलक्ष्य प्लेटफॉर्म: ${platform}\n\nटोन शैली: ${targetTone}\n\n3 मार्केटिंग कॉपी बनाएं।`
            : locale === 'ar'
            ? `اسم المنتج: ${product}\n\nنقاط البيع: ${selling}\n\nنوع النص: ${type}\n\nالمنصة المستهدفة: ${platform}\n\nأسلوب النبرة: ${targetTone}\n\nأنشئ 3 نسخ تسويقية.`
            : `Product name: ${product}\n\nFeelings: ${selling}\n\nReview type: ${type}\n\nTarget platform: ${platform}\n\nTone style: ${targetTone}\n\nGenerate 3 reviews.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.items || !Array.isArray(result.items)) {
            return errJson('No reviews generated', 500);
          }
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-resume-experience-optimize':
        case '/api/ai-resume-experience-optimize/': {
          const experience = payload.experience as string;
          const targetRole = (payload.targetRole as string) || '';
          const industry = (payload.industry as string) || '';
          const tone = (payload.tone as string) || 'professional';
          if (!experience?.trim()) return errJson('Experience description is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.friendly || 'friendly';
          const systemPrompt = `你是一个专业的简历优化专家。根据用户提供的工作经历描述，优化成更专业、更具吸引力的简历内容。

优化原则：
- 使用专业术语和关键词
- 突出量化成果和业绩
- 采用STAR法则（情境-任务-行动-结果）
- 语气专业自信
- 突出核心竞争力

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "optimized": "优化后的简历内容"
    }
  ]
}

请生成【3条】优化后的简历经历。用 ${langLabel(locale)} 输出。`;

          const userPrompt = locale === 'zh'
            ? `工作经历：${experience}\n\n目标职位：${targetRole || '无'}\n\n行业：${industry || '无'}\n\n语气风格：${targetTone}\n\n请优化这段简历经历。`
            : locale === 'es'
            ? `Experiencia laboral: ${experience}\n\nCargo objetivo: ${targetRole || 'ninguno'}\n\nIndustria: ${industry || 'ninguna'}\n\nEstilo de tono: ${targetTone}\n\nOptimiza esta experiencia laboral.`
            : locale === 'fr'
            ? `Expérience professionnelle: ${experience}\n\nPoste cible: ${targetRole || 'aucun'}\n\nIndustrie: ${industry || 'aucune'}\n\nStyle de ton: ${targetTone}\n\nOptimisez cette expérience professionnelle.`
            : locale === 'hi'
            ? `कार्य अनुभव: ${experience}\n\nलक्ष्य भूमिका: ${targetRole || 'कोई नहीं'}\n\nउद्योग: ${industry || 'कोई नहीं'}\n\nटोन शैली: ${targetTone}\n\nइस कार्य अनुभव को अनुकूलित करें।`
            : locale === 'ar'
            ? `الخبرة العملية: ${experience}\n\nالدور المستهدف: ${targetRole || 'لا يوجد'}\n\nالصناعة: ${industry || 'لا يوجد'}\n\nأسلوب النبرة: ${targetTone}\n\nقم بتحسين هذه الخبرة العملية.`
            : `Work experience: ${experience}\n\nTarget role: ${targetRole || 'none'}\n\nIndustry: ${industry || 'none'}\n\nTone style: ${targetTone}\n\nOptimize this resume experience.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.items || !Array.isArray(result.items)) {
            return errJson('No optimization generated', 500);
          }
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-xiaohongshu-title-generator':
        case '/api/ai-xiaohongshu-title-generator/': {
          const content = payload.content as string;
          const category = (payload.category as string) || 'lifestyle';
          const tone = (payload.tone as string) || 'friendly';
          if (!content?.trim()) return errJson('Content description is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.friendly || 'friendly';
          const systemPrompt = `你是一个专业的小红书标题生成专家。根据用户提供的内容描述，生成吸引人的小红书风格标题。

小红书标题特点：
- 使用表情符号吸引眼球
- 使用数字增加说服力
- 使用疑问句引发好奇心
- 突出关键词和标签
- 口语化、接地气
- 使用热门词汇和话题标签

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "title": "生成的标题"
    }
  ]
}

请生成【3条】候选标题。用 ${langLabel(locale)} 输出。`;

          const userPrompt = locale === 'zh'
            ? `内容描述：${content}\n\n内容分类：${category}\n\n语气风格：${targetTone}\n\n请生成3条小红书标题。`
            : locale === 'es'
            ? `Descripción del contenido: ${content}\n\nCategoría: ${category}\n\nEstilo de tono: ${targetTone}\n\nGenera 3 títulos para Xiaohongshu.`
            : locale === 'fr'
            ? `Description du contenu: ${content}\n\nCatégorie: ${category}\n\nStyle de ton: ${targetTone}\n\nGénérez 3 titres pour Xiaohongshu.`
            : locale === 'hi'
            ? `सामग्री विवरण: ${content}\n\nश्रेणी: ${category}\n\nटोन शैली: ${targetTone}\n\nXiaohongshu के लिए 3 शीर्षक बनाएं।`
            : locale === 'ar'
            ? `وصف المحتوى: ${content}\n\nالفئة: ${category}\n\nأسلوب النبرة: ${targetTone}\n\nأنشئ 3 عناوين لـ Xiaohongshu.`
            : `Content description: ${content}\n\nCategory: ${category}\n\nTone style: ${targetTone}\n\nGenerate 3 Xiaohongshu titles.`;

          const aiContent = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(aiContent);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.items || !Array.isArray(result.items)) {
            return errJson('No titles generated', 500);
          }
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/competitor-analyzer':
        case '/api/competitor-analyzer/': {
          const competitors = payload.competitors as any[];
          if (!competitors || !Array.isArray(competitors) || competitors.length === 0) return errJson('Competitors data is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const competitorText = competitors.map((c: any, i: number) => 
            `${i + 1}. 名称: ${c.name || '未命名'}, 链接: ${c.url || '无'}, 价格: ${c.price || '未定价'}, 评分: ${c.rating || '无'}, 评价数: ${c.reviews || '无'}`
          ).join('\n');

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

请用 ${langLabel(locale)} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

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

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          return json({ ...result, remaining: rateLimitResult.remaining });
        }

        case '/api/keyword-analyzer':
        case '/api/keyword-analyzer/': {
          const keywords = payload.keywords as string[];
          if (!keywords || !Array.isArray(keywords) || keywords.length === 0) return errJson('Keywords data is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const keywordsText = keywords.map((k: string, i: number) => `${i + 1}. ${k}`).join('\n');

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

请用 ${langLabel(locale)} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

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

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          return json({ ...result, remaining: rateLimitResult.remaining });
        }

        case '/api/email-template-generator':
        case '/api/email-template-generator/': {
          const { subject, product, audience, tone } = payload;
          if (!subject || !product) return errJson('Subject and product are required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

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

请用 ${langLabel(locale)} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

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

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          return json({ ...result, remaining: rateLimitResult.remaining });
        }

        case '/api/time-estimator':
        case '/api/time-estimator/': {
          const task = payload.task as string;
          const complexity = (payload.complexity as string) || 'medium';
          const experience = (payload.experience as string) || 'medium';
          if (!task?.trim()) return errJson('Task description is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5);
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

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

请用 ${langLabel(locale)} 输出。确保JSON格式正确，不要包含任何markdown代码块标记。`;

          const userPrompt = locale === 'zh'
            ? `任务描述：${task}\n复杂度：${complexity}\n经验水平：${experience}\n\n请进行专业的工时估算并按JSON格式返回。`
            : locale === 'es'
            ? `Descripción de la tarea: ${task}\nComplejidad: ${complexity}\nNivel de experiencia: ${experience}\n\nRealice una estimación de horas profesional y devuelva en formato JSON.`
            : locale === 'fr'
            ? `Description de la tâche: ${task}\nComplexité: ${complexity}\nNiveau d'expérience: ${experience}\n\nEffectuez une estimation professionnelle du temps et retournez au format JSON.`
            : locale === 'hi'
            ? `कार्य विवरण: ${task}\nजटिलता: ${complexity}\nअनुभव स्तर: ${experience}\n\nपेशेवर टाइम एस्टीमेशन करें और JSON प्रारूप में लौटाएं।`
            : locale === 'ar'
            ? `وصف المهمة: ${task}\nالمعقدة: ${complexity}\nمستوى الخبرة: ${experience}\n\nقم بإجراء تقدير وقت احترافي وارجع بالتنسيق JSON.`
            : `Task description: ${task}\nComplexity: ${complexity}\nExperience level: ${experience}\n\nPerform a professional time estimate and return in JSON format.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          return json({ ...result, remaining: rateLimitResult.remaining });
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