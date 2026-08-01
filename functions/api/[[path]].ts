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
  const apiKey = env.DEEPSEEK_API_KEY || (typeof process !== 'undefined' ? process.env?.DEEPSEEK_API_KEY : undefined);
  const apiUrl = env.DEEPSEEK_API_URL || 'https://token.sensenova.cn/v1/chat/completions';
  const model = env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

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

async function checkRateLimit(env: Env, request: Request, limit: number = 5, toolName: string = 'default'): Promise<{ remaining: number | null; blocked: boolean; message: string }> {
  if (!env.DB) return { remaining: null, blocked: false, message: '' };

  try {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const day = new Date().toISOString().split('T')[0];
    const key = `${ip}:${toolName}:${day}`;

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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-copywriter');
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

          const rateLimitResult = await checkRateLimit(env, request, 10, 'ai-grammar-checker');
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

          const rateLimitResult = await checkRateLimit(env, request, 10, 'prompt-refine');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-review-generator');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-resume-experience-optimize');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-xiaohongshu-title-generator');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'competitor-analyzer');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'keyword-analyzer');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'email-template-generator');
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

          const rateLimitResult = await checkRateLimit(env, request, 5, 'time-estimator');
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

        case '/api/caption-generator':
        case '/api/caption-generator/': {
          const theme = payload.theme as string;
          const emotion = (payload.emotion as string) || '';
          const keywords = (payload.keywords as string[]) || [];
          if (!theme?.trim()) return errJson('Theme is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'caption-generator');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const systemPrompt = `你是一个专业的社交媒体文案创作助手，擅长创作各种风格的朋友圈文案、小红书文案等。`;

          const userPrompt = locale === 'zh'
            ? `请为我生成5条${theme}主题的${emotion || '轻松'}风格朋友圈文案，每条文案要简短有趣，适合社交媒体发布。${keywords.length > 0 ? '包含关键词：' + keywords.join('、') : ''}不要太长，每条不超过40个字。`
            : locale === 'es'
            ? `Genera 5 leyendas para redes sociales sobre ${theme} con tono ${emotion || 'relajado'}. ${keywords.length > 0 ? 'Incluir palabras clave: ' + keywords.join(', ') : ''} Manténgalas breves y atractivas, cada una con menos de 60 caracteres.`
            : locale === 'fr'
            ? `Générez 5 légendes pour les réseaux sociaux sur ${theme} avec un ton ${emotion || 'détendu'}. ${keywords.length > 0 ? 'Inclure les mots-clés: ' + keywords.join(', ') : ''} Gardez-les courtes et engageantes, chaque légende moins de 60 caractères.`
            : locale === 'hi'
            ? `${theme} विषय के लिए 5 सोशल मीडिया कैप्शन बनाएं ${emotion || 'आराम'} टोन के साथ। ${keywords.length > 0 ? 'कुंजी शब्द शामिल करें: ' + keywords.join(', ') : ''} उन्हें छोटा और आकर्षक रखें, प्रत्येक 60 कैरेक्टर से कम।`
            : locale === 'ar'
            ? `أنشئ 5 تسميات لمواقع التواصل الاجتماعي حول ${theme} بلغة ${emotion || 'هادئة'}. ${keywords.length > 0 ? 'شمل الكلمات المفتاحية: ' + keywords.join(', ') : ''} ابقىها مختصرة وجذابة، كل تسمية أقل من 60 حرفًا.`
            : `Generate 5 social media captions about ${theme} with ${emotion || 'casual'} tone. ${keywords.length > 0 ? 'Include keywords: ' + keywords.join(', ') : ''} Keep them short and engaging, each caption under 60 characters.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt);
          const captions = content.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, '').trim()).slice(0, 5);
          return json({ success: true, captions, remaining: rateLimitResult.remaining });
        }

        case '/api/copy-cleaner':
        case '/api/copy-cleaner/': {
          const text = payload.text as string;
          const level = (payload.level as string) || 'mid';
          if (!text?.trim()) return errJson('Text is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'copy-cleaner');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const levelDesc = level === 'strong' ? '深度清洗，只保留核心信息，大幅度精简' : level === 'mid' ? '中等清洗，去除重复和空洞词，适当精简' : '轻度清洗，去除重复内容';

          const systemPrompt = `你是一个专业的文案优化专家，擅长去除冗余、精简表达、提升文案质量。`;

          const userPrompt = locale === 'zh'
            ? `请对以下文案进行${levelDesc}，保留核心信息的同时优化表达，使文案更加精炼、专业：\n\n${text}\n\n请直接返回清洗后的文案，不要添加任何解释。`
            : locale === 'es'
            ? `Por favor, limpie el siguiente texto con ${level === 'strong' ? 'limpieza profunda, manteniendo solo la información esencial, reduciendo drásticamente' : level === 'mid' ? 'limpieza media, eliminando repeticiones y palabras vacías, reduciendo adecuadamente' : 'limpieza ligera, eliminando contenido repetido'}, optimice la expresión mientras preserva la información esencial, haciéndola más concisa y profesional:\n\n${text}\n\nDevuelva el texto limpio directamente sin explicaciones.`
            : locale === 'fr'
            ? `Veuillez nettoyer le texte suivant avec ${level === 'strong' ? 'nettoyage profond, ne gardant que l\'information essentielle, réduisant considérablement' : level === 'mid' ? 'nettoyage moyen, éliminant les répétitions et les mots vides, réduisant适当' : 'nettoyage léger, éliminant le contenu répété'}, optimisez l'expression tout en préservant l'information essentielle, la rendant plus concise et professionnelle:\n\n${text}\n\nVeuillez retourner le texte nettoyé directement sans explications.`
            : locale === 'hi'
            ? `कृपया निम्नलिखित पाठ को ${level === 'strong' ? 'गहरी सफाई के साथ, केवल मुख्य जानकारी को बनाए रखते हुए, बड़े पैमाने पर छोटा करें' : level === 'mid' ? 'मध्यम सफाई के साथ, दोहराव और खाली शब्दों को हटाते हुए, उपयुक्त रूप से छोटा करें' : 'हल्की सफाई के साथ, दोहराव सामग्री को हटाते हुए'} साफ़ करें, मुख्य जानकारी को बनाए रखते हुए अभिव्यक्ति को अनुकूलित करें, पाठ को अधिक संक्षिप्त और पेशेवर बनाएं:\n\n${text}\n\nकृपया सीधे साफ़ पाठ लौटाएं, बिना किसी व्याख्या के।`
            : locale === 'ar'
            ? `يرجى تنظيف النص التالي بـ ${level === 'strong' ? 'تنظيف عميق، الاحتفاظ بالمعلومات الأساسية فقط، تقليص كبير' : level === 'mid' ? 'تنظيف متوسط، إزالة التكرارات والكلمات الفارغة، تقليص مناسب' : 'تنظيف خفيف، إزالة المحتوى المتكرر'}, تحسين التعبير مع الحفاظ على المعلومات الأساسية، وجعل النص أكثر إيجازاً واحترافاً:\n\n${text}\n\nيرجى إرجاع النص المنظف مباشرة بدون أي تفسير.`
            : `Please clean the following text with ${level === 'strong' ? 'deep cleaning, keeping only core information, drastically reducing' : level === 'mid' ? 'medium cleaning, removing repetitions and empty words, appropriately reducing' : 'light cleaning, removing repeated content'}, optimize the expression while preserving core information, making it more concise and professional:\n\n${text}\n\nPlease return the cleaned text directly without any explanations.`;

          const cleaned = await callDeepseek(env, systemPrompt, userPrompt);
          return json({ success: true, cleaned, remaining: rateLimitResult.remaining });
        }

        case '/api/excuse-gen':
        case '/api/excuse-gen/': {
          const scenario = (payload.scenario as string) || 'late';
          const mode = (payload.mode as string) || 'serious';
          const customScenario = payload.customScenario as string;
          const scenarioLabel = (
            locale === 'zh' ? { late: '迟到', 'skip-work': '不想上班', 'cancel-plans': '不想赴约', deadline: 'deadline拖了' }
            : locale === 'es' ? { late: 'llegar tarde', 'skip-work': 'faltar al trabajo', 'cancel-plans': 'cancelar planes', deadline: 'plazo vencido' }
            : locale === 'fr' ? { late: 'en retard', 'skip-work': 'rater le travail', 'cancel-plans': 'annuler un plan', deadline: 'deadline manquée' }
            : locale === 'hi' ? { late: 'देर से पहुंचना', 'skip-work': 'काम छोड़ना', 'cancel-plans': 'योजना रद्द', deadline: 'समयसीमा छूटी' }
            : locale === 'ar' ? { late: 'تأخرت', 'skip-work': 'غياب عن العمل', 'cancel-plans': 'إلغاء خطة', deadline: 'فات الموعد' }
            : { late: 'running late', 'skip-work': 'skip work', 'cancel-plans': 'cancel plans', deadline: 'missed deadline' }
          )[scenario] || scenario;
          const actualScenario = customScenario?.trim() || scenarioLabel;
          const modeDesc = mode === 'serious'
            ? (locale === 'zh' ? '真实可信的借口' : locale === 'en' ? 'plausible realistic excuse' : locale === 'es' ? 'excusa creíble' : locale === 'fr' ? 'excuse crédible' : locale === 'hi' ? 'विश्वसनीय बहाना' : 'عذر واقعي')
            : (locale === 'zh' ? '荒诞搞笑的借口' : locale === 'en' ? 'absurd hilarious excuse' : locale === 'es' ? 'excusa absurda' : locale === 'fr' ? 'excuse absurde' : locale === 'hi' ? 'बेतुका मज़ेदार बहाना' : 'عذر سخيف مضحك');
          const systemPrompt = `你是一个借口生成器。生成${modeDesc}。只返回JSON：{"excuse":"借口内容","explanation":"一句话解释"}。用${langLabel(locale)}输出。简短口语化，不要违法内容。`;
          const userPrompt = `场景：${actualScenario}\n模式：${mode}\n生成1条借口。`;
          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          try { const r = JSON.parse(content); return json({ excuse: r.excuse, explanation: r.explanation || '', source: 'ai' }); }
          catch { return json({ excuse: content, explanation: '', source: 'ai' }); }
        }

        case '/api/wave-art-ai':
        case '/api/wave-art-ai/': {
          const text = payload.text as string;
          if (!text?.trim()) return errJson('Text is required', 400);
          const systemPrompt = `你是声波艺术解读师。根据文字生成趣味波形解读（像星座解读那样有趣但无害）+3条社交配文。只返回JSON：{"reading":"解读80-150字","captions":["配文1","配文2","配文3"]}。用${langLabel(locale)}输出。积极正面，不涉及负面判断或诊断。`;
          const userPrompt = `输入文字：${text}\n生成波形解读和3条社交配文。`;
          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          try { const r = JSON.parse(content); return json({ reading: r.reading, captions: r.captions || [], source: 'ai' }); }
          catch { return json({ reading: content, captions: [], source: 'ai' }); }
        }

        case '/api/life-weeks-ai':
        case '/api/life-weeks-ai/': {
          const age = payload.age as number;
          if (typeof age !== 'number') return errJson('Age required', 400);
          const systemPrompt = `你是人生规划顾问。根据年龄生成个性化建议+反思提示。只返回JSON：{"stage":"阶段名","advice":["建议1","建议2","建议3"],"prompts":["问题1","问题2","问题3","问题4","问题5"]}。用${langLabel(locale)}输出。积极具体，不说教，不涉及医疗诊断。`;
          const userPrompt = `年龄：${age}岁\n生成人生阶段建议和5个反思提示。`;
          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          try { const r = JSON.parse(content); return json({ stage: r.stage || '', advice: (r.advice || []).join('\n'), prompts: r.prompts || [], source: 'ai' }); }
          catch { return json({ stage: '', advice: content, prompts: [], source: 'ai' }); }
        }

        case '/api/name-constellation-ai':
        case '/api/name-constellation-ai/': {
          const name = (payload.name as string) || '';
          const style = (payload.style as number) || 0;
          if (!name.trim()) return errJson('Name is required', 400);
          const styleNames = ['milky-way', 'aurora', 'twilight', 'dreamscape'];
          const styleName = styleNames[style] || 'milky-way';
          const palettes: Record<string, string[]> = {
            'milky-way': ['#ffffff', '#ffd700', '#87ceeb', '#dda0dd', '#fffacd'],
            'aurora': ['#7df9ff', '#0077b6', '#caf0f8', '#90e0ef', '#ade8f4'],
            'twilight': ['#e0aaff', '#c77dff', '#9d4edd', '#7b2cbf', '#ffd6ff'],
            'dreamscape': ['#f5e6ff', '#da8fff', '#b388ff', '#e1bee7', '#f8bbd0'],
          };
          const palette = palettes[styleName] || palettes['milky-way'];
          const systemPrompt = `你是名字星图分析师。将名字的每个字母转化为星图数据。

风格：${styleName}
调色板：${palette.join(', ')}

返回严格JSON格式：
{"stars":[{"id":0,"letter":"A","x":200,"y":200,"color":"#fff","size":5,"brightness":0.8,"meaning":"creative","energy":0.7}],"connections":[{"from":0,"to":1,"strength":0.8}],"description":"2-3 sentence personality profile","traits":["trait1","trait2"],"luckyColor":"#ffd700","luckyNumber":5}

规则：
- 使用名字中的实际字母
- x,y围绕400,300分布，散布在200px范围
- 连线只连能量兼容的字母（30-70%比例）
- description和traits用${langLabel(locale)}
- meaning可用${langLabel(locale)}或英文，保持简短
- 每个名字要独特`;
          const userPrompt = `名字："${name}"\n风格：${styleName}\n请生成星图。`;
          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          try {
            const r = JSON.parse(content);
            if (!r.stars || r.stars.length === 0) return errJson('No stars generated', 500);
            // Normalize positions to nice constellation
            const stars = r.stars.map((s: any, i: number) => ({
              id: i,
              letter: String(s.letter || '?'),
              x: typeof s.x === 'number' ? s.x : 200 + i * 30,
              y: typeof s.y === 'number' ? s.y : 200 + (i % 3) * 40,
              color: String(s.color || palette[i % palette.length]),
              size: Math.min(12, Math.max(2, Number(s.size) || 5)),
              brightness: Math.min(1, Math.max(0.3, Number(s.brightness) || 0.7)),
              meaning: String(s.meaning || ''),
              energy: Math.min(1, Math.max(0, Number(s.energy) || 0.5)),
            }));
            // Fix positions into constellation pattern
            const cx = 400, cy = 300;
            const n = stars.length;
            stars.forEach((s: any, i: number) => {
              const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
              const r = 80 + (i % 3) * 60 + (i * 7 % 30);
              s.x = Math.round(cx + Math.cos(angle) * r + (i * 11 % 20) - 10);
              s.y = Math.round(cy + Math.sin(angle) * r + (i * 13 % 20) - 10);
            });
            const connections = (r.connections || []).map((c: any) => ({
              from: Number(c.from) || 0,
              to: Number(c.to) || 0,
              strength: Math.min(1, Math.max(0.1, Number(c.strength) || 0.5)),
            }));
            return json({
              stars,
              connections,
              description: String(r.description || ''),
              traits: Array.isArray(r.traits) ? r.traits : [],
              luckyColor: String(r.luckyColor || '#ffffff'),
              luckyNumber: Math.min(9, Math.max(1, Number(r.luckyNumber) || 5)),
              source: 'ai',
            });
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
        }

        case '/api/ai-name-generator':
        case '/api/ai-name-generator/': {
          const type = (payload.type as string) || 'baby';
          const surname = (payload.surname as string) || '';
          const gender = (payload.gender as string) || 'neutral';
          const style = (payload.style as string) || 'classic';
          if (!surname?.trim()) return errJson('Surname is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-name-generator');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const typeMap: Record<string, string> = {
            baby: locale === 'zh' ? '宝宝名字' : locale === 'es' ? 'nombre de bebé' : locale === 'fr' ? 'nom de bébé' : locale === 'hi' ? 'बेबी नाम' : locale === 'ar' ? 'اسم طفل' : 'baby name',
            pet: locale === 'zh' ? '宠物名字' : locale === 'es' ? 'nombre de mascota' : locale === 'fr' ? 'nom d\'animal' : locale === 'hi' ? 'पालतू नाम' : locale === 'ar' ? 'اسم حيوان أليف' : 'pet name',
            nickname: locale === 'zh' ? '网名/昵称' : locale === 'es' ? 'apodo' : locale === 'fr' ? 'pseudo' : locale === 'hi' ? 'उपनाम' : locale === 'ar' ? 'اسم مستعار' : 'nickname',
            english: locale === 'zh' ? '英文名' : locale === 'es' ? 'nombre en inglés' : locale === 'fr' ? 'nom anglais' : locale === 'hi' ? 'अंग्रेजी नाम' : locale === 'ar' ? 'اسم إنجليزي' : 'English name',
          };
          const genderMap: Record<string, string> = {
            male: locale === 'zh' ? '男' : locale === 'es' ? 'masculino' : locale === 'fr' ? 'masculin' : locale === 'hi' ? 'पुरुष' : locale === 'ar' ? 'ذكر' : 'male',
            female: locale === 'zh' ? '女' : locale === 'es' ? 'femenino' : locale === 'fr' ? 'féminin' : locale === 'hi' ? 'महिला' : locale === 'ar' ? 'أنثى' : 'female',
            neutral: locale === 'zh' ? '中性' : locale === 'es' ? 'neutral' : locale === 'fr' ? 'neutre' : locale === 'hi' ? 'तटस्थ' : locale === 'ar' ? 'محايد' : 'neutral',
          };
          const nameStyleMap: Record<string, string> = {
            classic: locale === 'zh' ? '古风/传统' : locale === 'es' ? 'clásico' : locale === 'fr' ? 'classique' : locale === 'hi' ? 'पारंपरिक' : locale === 'ar' ? 'كلاسيكي' : 'classic/traditional',
            modern: locale === 'zh' ? '现代/简约' : locale === 'es' ? 'moderno' : locale === 'fr' ? 'moderne' : locale === 'hi' ? 'आधुनिक' : locale === 'ar' ? 'حديث' : 'modern',
            cute: locale === 'zh' ? '可爱/俏皮' : locale === 'es' ? 'lindo' : locale === 'fr' ? 'mignon' : locale === 'hi' ? 'प्यारा' : locale === 'ar' ? 'لطيف' : 'cute',
            powerful: locale === 'zh' ? '霸气/豪迈' : locale === 'es' ? 'poderoso' : locale === 'fr' ? 'puissant' : locale === 'hi' ? 'शक्तिशाली' : locale === 'ar' ? 'قوي' : 'powerful',
            poetic: locale === 'zh' ? '诗意/文雅' : locale === 'es' ? 'poético' : locale === 'fr' ? 'poétique' : locale === 'hi' ? 'काव्यात्मक' : locale === 'ar' ? 'شاعري' : 'poetic',
          };
          const targetType = typeMap[type] || typeMap.baby;
          const targetGender = genderMap[gender] || genderMap.neutral;
          const targetStyle = nameStyleMap[style] || nameStyleMap.classic;

          const systemPrompt = `你是一个专业的起名专家。根据用户提供的姓氏、性别和风格偏好，生成好听有寓意的名字。每个名字附带寓意解释和出处。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "name": "名字",
      "meaning": "寓意解释",
      "origin": "出处/典故"
    }
  ]
}

请生成【5个】名字。用 ${langLabel(locale)} 输出。寓意要真实可信，出处准确，不编造典故。`;

          const userPrompt = locale === 'zh'
            ? `类型：${targetType}\n姓氏：${surname}\n性别：${targetGender}\n风格：${targetStyle}\n\n请生成5个有寓意的名字。`
            : locale === 'es'
            ? `Tipo: ${targetType}\nApellido: ${surname}\nGénero: ${targetGender}\nEstilo: ${targetStyle}\n\nGenera 5 nombres con significado.`
            : locale === 'fr'
            ? `Type: ${targetType}\nNom de famille: ${surname}\nGenre: ${targetGender}\nStyle: ${targetStyle}\n\nGénérez 5 noms avec signification.`
            : locale === 'hi'
            ? `प्रकार: ${targetType}\nउपनाम: ${surname}\nलिंग: ${targetGender}\nशैली: ${targetStyle}\n\n5 अर्थपूर्ण नाम बनाएं।`
            : locale === 'ar'
            ? `النوع: ${targetType}\nاسم العائلة: ${surname}\nالجنس: ${targetGender}\nالأسلوب: ${targetStyle}\n\nأنشئ 5 أسماء ذات معنى.`
            : `Type: ${targetType}\nSurname: ${surname}\nGender: ${targetGender}\nStyle: ${targetStyle}\n\nGenerate 5 meaningful names.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.items || !Array.isArray(result.items)) {
            return errJson('No names generated', 500);
          }
          return json({ items: result.items.slice(0, 5), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-greeting-generator':
        case '/api/ai-greeting-generator/': {
          const occasion = (payload.occasion as string) || 'birthday';
          const recipient = (payload.recipient as string) || '';
          const message = (payload.message as string) || '';
          const tone = (payload.tone as string) || 'warm';
          if (!recipient?.trim()) return errJson('Recipient is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-greeting-generator');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const occasionMap: Record<string, string> = {
            birthday: locale === 'zh' ? '生日' : locale === 'es' ? 'cumpleaños' : locale === 'fr' ? 'anniversaire' : locale === 'hi' ? 'जन्मदिन' : locale === 'ar' ? 'عيد ميلاد' : 'birthday',
            wedding: locale === 'zh' ? '婚礼' : locale === 'es' ? 'boda' : locale === 'fr' ? 'mariage' : locale === 'hi' ? 'शादी' : locale === 'ar' ? 'زفاف' : 'wedding',
            newyear: locale === 'zh' ? '新年' : locale === 'es' ? 'año nuevo' : locale === 'fr' ? 'nouvel an' : locale === 'hi' ? 'नया साल' : locale === 'ar' ? 'رأس السنة' : 'new year',
            springfestival: locale === 'zh' ? '春节' : locale === 'es' ? 'fiesta de primavera' : locale === 'fr' ? 'fête du printemps' : locale === 'hi' ? 'वसंत उत्सव' : locale === 'ar' ? 'مهرجان الربيع' : 'spring festival',
            midautumn: locale === 'zh' ? '中秋' : locale === 'es' ? 'medio otoño' : locale === 'fr' ? 'mi-automne' : locale === 'hi' ? 'मध्य शरद' : locale === 'ar' ? 'منتصف الخريف' : 'mid-autumn',
            housewarming: locale === 'zh' ? '乔迁' : locale === 'es' ? 'inauguración' : locale === 'fr' ? 'emménagement' : locale === 'hi' ? 'गृह प्रवेश' : locale === 'ar' ? 'انتقال منزل' : 'housewarming',
            graduation: locale === 'zh' ? '毕业' : locale === 'es' ? 'graduación' : locale === 'fr' ? 'diplôme' : locale === 'hi' ? 'स्नातक' : locale === 'ar' ? 'تخرج' : 'graduation',
            promotion: locale === 'zh' ? '升职' : locale === 'es' ? 'ascenso' : locale === 'fr' ? 'promotion' : locale === 'hi' ? 'पदोन्नति' : locale === 'ar' ? 'ترقية' : 'promotion',
          };
          const greetingToneMap: Record<string, string> = {
            warm: locale === 'zh' ? '温馨' : locale === 'es' ? 'cálido' : locale === 'fr' ? 'chaleureux' : locale === 'hi' ? 'गर्मजनक' : locale === 'ar' ? 'دافئ' : 'warm',
            formal: locale === 'zh' ? '正式' : locale === 'es' ? 'formal' : locale === 'fr' ? 'formel' : locale === 'hi' ? 'औपचारिक' : locale === 'ar' ? 'رسمي' : 'formal',
            humorous: locale === 'zh' ? '幽默' : locale === 'es' ? 'humorístico' : locale === 'fr' ? 'humoristique' : locale === 'hi' ? 'हास्यपूर्ण' : locale === 'ar' ? 'مزاح' : 'humorous',
            creative: locale === 'zh' ? '创意' : locale === 'es' ? 'creativo' : locale === 'fr' ? 'créatif' : locale === 'hi' ? 'रचनात्मक' : locale === 'ar' ? 'إبداعي' : 'creative',
          };
          const targetOccasion = occasionMap[occasion] || occasionMap.birthday;
          const targetTone = greetingToneMap[tone] || greetingToneMap.warm;

          const systemPrompt = `你是一个专业的祝福语创作专家。根据场景和收件人，生成真挚动人的祝福语。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "greeting": "祝福语内容",
      "tips": "送出建议（如何送出、何时送、搭配什么礼物等）"
    }
  ]
}

请生成【3条】祝福语。用 ${langLabel(locale)} 输出。祝福语要真挚动人、避免套话，每条不超过150字。`;

          const extraMsg = message?.trim() ? `\n${locale === 'zh' ? '附加留言' : locale === 'es' ? 'Mensaje adicional' : locale === 'fr' ? 'Message supplémentaire' : locale === 'hi' ? 'अतिरिक्त संदेश' : locale === 'ar' ? 'رسالة إضافية' : 'Additional message'}: ${message.trim()}` : '';

          const userPrompt = locale === 'zh'
            ? `场景：${targetOccasion}\n收件人：${recipient}\n语气：${targetTone}${extraMsg}\n\n请生成3条祝福语。`
            : locale === 'es'
            ? `Ocasión: ${targetOccasion}\nDestinatario: ${recipient}\nTono: ${targetTone}${extraMsg}\n\nGenera 3 felicitaciones.`
            : locale === 'fr'
            ? `Occasion: ${targetOccasion}\nDestinataire: ${recipient}\nTon: ${targetTone}${extraMsg}\n\nGénérez 3 félicitations.`
            : locale === 'hi'
            ? `अवसर: ${targetOccasion}\nप्राप्तकर्ता: ${recipient}\nटोन: ${targetTone}${extraMsg}\n\n3 शुभकामनाएं बनाएं।`
            : locale === 'ar'
            ? `المناسبة: ${targetOccasion}\nالمستلم: ${recipient}\nالنبرة: ${targetTone}${extraMsg}\n\nأنشئ 3 تهنئات.`
            : `Occasion: ${targetOccasion}\nRecipient: ${recipient}\nTone: ${targetTone}${extraMsg}\n\nGenerate 3 greetings.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.items || !Array.isArray(result.items)) {
            return errJson('No greetings generated', 500);
          }
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-weekly-report':
        case '/api/ai-weekly-report/': {
          const role = (payload.role as string) || '';
          const tasks = (payload.tasks as string) || '';
          const achievements = (payload.achievements as string) || '';
          const plans = (payload.plans as string) || '';
          if (!role?.trim() || !tasks?.trim()) return errJson('Role and tasks are required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-weekly-report');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const sectionLabels = {
            summary: locale === 'zh' ? '本周总结' : locale === 'es' ? 'Resumen de la semana' : locale === 'fr' ? 'Résumé de la semaine' : locale === 'hi' ? 'इस सप्ताह का सारांश' : locale === 'ar' ? 'ملخص الأسبوع' : 'This Week Summary',
            achievements: locale === 'zh' ? '主要成果' : locale === 'es' ? 'Logros principales' : locale === 'fr' ? 'Principaux résultats' : locale === 'hi' ? 'मुख्य उपलब्धियां' : locale === 'ar' ? 'الإنجازات الرئيسية' : 'Main Achievements',
            issues: locale === 'zh' ? '问题与风险' : locale === 'es' ? 'Problemas y riesgos' : locale === 'fr' ? 'Problèmes et risques' : locale === 'hi' ? 'समस्याएं और जोखिम' : locale === 'ar' ? 'المشكلات والمخاطر' : 'Issues & Risks',
            plans: locale === 'zh' ? '下周计划' : locale === 'es' ? 'Plan de la próxima semana' : locale === 'fr' ? 'Plan de la semaine prochaine' : locale === 'hi' ? 'अगले सप्ताह की योजना' : locale === 'ar' ? 'خطة الأسبوع القادم' : 'Next Week Plan',
          };

          const systemPrompt = `你是一个职场写作助手。根据用户提供的工作内容，生成结构化的周报。包含：本周总结、主要成果、问题与风险、下周计划。

输出要求：
- 使用 markdown 格式
- 使用一级标题 # 周报标题
- 使用二级标题 ## 划分以下四个固定章节：
  ## ${sectionLabels.summary}
  ## ${sectionLabels.achievements}
  ## ${sectionLabels.issues}
  ## ${sectionLabels.plans}
- 每个章节内容要充实具体，可用列表 - 呈现
- 用 ${langLabel(locale)} 输出

返回格式要求（必须是有效的 JSON）：
{
  "report": "周报全文（markdown 格式字符串）"
}`;

          const achievementsSection = achievements?.trim() ? `\n${locale === 'zh' ? '已取得成果' : locale === 'es' ? 'Logros obtenidos' : locale === 'fr' ? 'Résultats obtenus' : locale === 'hi' ? 'प्राप्त उपलब्धियां' : locale === 'ar' ? 'الإنجازات المحققة' : 'Achievements made'}: ${achievements.trim()}` : '';
          const plansSection = plans?.trim() ? `\n${locale === 'zh' ? '下周计划' : locale === 'es' ? 'Plan de próxima semana' : locale === 'fr' ? 'Plan de la semaine prochaine' : locale === 'hi' ? 'अगले सप्ताह की योजना' : locale === 'ar' ? 'خطة الأسبوع القادم' : 'Next week plan'}: ${plans.trim()}` : '';

          const userPrompt = locale === 'zh'
            ? `职位：${role}\n本周工作内容：\n${tasks}${achievementsSection}${plansSection}\n\n请生成结构化周报。`
            : locale === 'es'
            ? `Puesto: ${role}\nTareas de esta semana:\n${tasks}${achievementsSection}${plansSection}\n\nGenera un informe semanal estructurado.`
            : locale === 'fr'
            ? `Poste: ${role}\nTâches de cette semaine:\n${tasks}${achievementsSection}${plansSection}\n\nGénérez un rapport hebdomadaire structuré.`
            : locale === 'hi'
            ? `पद: ${role}\nइस सप्ताह के कार्य:\n${tasks}${achievementsSection}${plansSection}\n\nएक संरचित साप्ताहिक रिपोर्ट बनाएं।`
            : locale === 'ar'
            ? `المنصب: ${role}\nمهام هذا الأسبوع:\n${tasks}${achievementsSection}${plansSection}\n\nأنشئ تقريراً أسبوعياً منظماً.`
            : `Role: ${role}\nThis week's tasks:\n${tasks}${achievementsSection}${plansSection}\n\nGenerate a structured weekly report.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.report || typeof result.report !== 'string') {
            return errJson('No report generated', 500);
          }
          return json({ report: result.report, remaining: rateLimitResult.remaining });
        }

        case '/api/ai-recipe-generator':
        case '/api/ai-recipe-generator/': {
          const ingredients = (payload.ingredients as string) || '';
          const cuisine = (payload.cuisine as string) || 'any';
          const difficulty = (payload.difficulty as string) || 'easy';
          const servings = (payload.servings as string) || '2';
          const diet = (payload.diet as string) || 'none';
          if (!ingredients?.trim()) return errJson('Ingredients are required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-recipe-generator');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const cuisineMap: Record<string, string> = {
            chinese: locale === 'zh' ? '中式' : locale === 'es' ? 'china' : locale === 'fr' ? 'chinoise' : locale === 'hi' ? 'चीनी' : locale === 'ar' ? 'صيني' : 'Chinese',
            western: locale === 'zh' ? '西式' : locale === 'es' ? 'occidental' : locale === 'fr' ? 'occidental' : locale === 'hi' ? 'पश्चिमी' : locale === 'ar' ? 'غربي' : 'Western',
            japanese: locale === 'zh' ? '日式' : locale === 'es' ? 'japonesa' : locale === 'fr' ? 'japonaise' : locale === 'hi' ? 'जापानी' : locale === 'ar' ? 'ياباني' : 'Japanese',
            korean: locale === 'zh' ? '韩式' : locale === 'es' ? 'coreana' : locale === 'fr' ? 'coréenne' : locale === 'hi' ? 'कोरियाई' : locale === 'ar' ? 'كوري' : 'Korean',
            southeast: locale === 'zh' ? '东南亚' : locale === 'es' ? 'sudeste asiático' : locale === 'fr' ? 'sud-est asiatique' : locale === 'hi' ? 'दक्षिण पूर्व एशियाई' : locale === 'ar' ? 'جنوب شرق آسيوي' : 'Southeast Asian',
            any: locale === 'zh' ? '不限' : locale === 'es' ? 'cualquiera' : locale === 'fr' ? 'toute' : locale === 'hi' ? 'कोई भी' : locale === 'ar' ? 'أي' : 'Any',
          };
          const difficultyMap: Record<string, string> = {
            easy: locale === 'zh' ? '简单' : locale === 'es' ? 'fácil' : locale === 'fr' ? 'facile' : locale === 'hi' ? 'आसान' : locale === 'ar' ? 'سهل' : 'easy',
            medium: locale === 'zh' ? '中等' : locale === 'es' ? 'media' : locale === 'fr' ? 'moyenne' : locale === 'hi' ? 'मध्यम' : locale === 'ar' ? 'متوسط' : 'medium',
            hard: locale === 'zh' ? '复杂' : locale === 'es' ? 'difícil' : locale === 'fr' ? 'difficile' : locale === 'hi' ? 'कठिन' : locale === 'ar' ? 'صعب' : 'hard',
          };
          const dietMap: Record<string, string> = {
            none: locale === 'zh' ? '无限制' : locale === 'es' ? 'sin restricción' : locale === 'fr' ? 'aucune' : locale === 'hi' ? 'कोई नहीं' : locale === 'ar' ? 'بدون' : 'none',
            vegetarian: locale === 'zh' ? '素食' : locale === 'es' ? 'vegetariano' : locale === 'fr' ? 'végétarien' : locale === 'hi' ? 'शाकाहारी' : locale === 'ar' ? 'نباتي' : 'vegetarian',
            lowcalorie: locale === 'zh' ? '低卡' : locale === 'es' ? 'bajo en calorías' : locale === 'fr' ? 'faible calorie' : locale === 'hi' ? 'कम कैलोरी' : locale === 'ar' ? 'منخفض السعرات' : 'low-calorie',
            glutenfree: locale === 'zh' ? '无麸质' : locale === 'es' ? 'sin gluten' : locale === 'fr' ? 'sans gluten' : locale === 'hi' ? 'ग्लूटेन मुक्त' : locale === 'ar' ? 'خالٍ من الغلوتين' : 'gluten-free',
          };
          const targetCuisine = cuisineMap[cuisine] || cuisineMap.any;
          const targetDifficulty = difficultyMap[difficulty] || difficultyMap.easy;
          const targetDiet = dietMap[diet] || dietMap.none;

          const systemPrompt = `你是一个专业厨师和营养师。根据用户提供的食材和偏好，生成详细菜谱。

返回格式要求（必须是有效的 JSON）：
{
  "recipes": [
    {
      "name": "菜名",
      "ingredients": ["材料1（用量）", "材料2（用量）"],
      "steps": ["步骤1", "步骤2", "步骤3"],
      "tips": "烹饪小贴士",
      "nutrition": "营养信息（含热量/蛋白质/脂肪等）"
    }
  ]
}

请生成【2个】菜谱。用 ${langLabel(locale)} 输出。菜谱要切实可行，步骤清晰可执行，营养信息要真实合理。`;

          const userPrompt = locale === 'zh'
            ? `食材：${ingredients}\n菜系：${targetCuisine}\n难度：${targetDifficulty}\n人数：${servings}人份\n饮食限制：${targetDiet}\n\n请生成2个菜谱。`
            : locale === 'es'
            ? `Ingredientes: ${ingredients}\nCocina: ${targetCuisine}\nDificultad: ${targetDifficulty}\nPorciones: ${servings}\nDieta: ${targetDiet}\n\nGenera 2 recetas.`
            : locale === 'fr'
            ? `Ingrédients: ${ingredients}\nCuisine: ${targetCuisine}\nDifficulté: ${targetDifficulty}\nPortions: ${servings}\nRégime: ${targetDiet}\n\nGénérez 2 recettes.`
            : locale === 'hi'
            ? `सामग्री: ${ingredients}\nभोजन: ${targetCuisine}\nकठिनाई: ${targetDifficulty}\nहिस्से: ${servings}\nआहार: ${targetDiet}\n\n2 रेसिपी बनाएं।`
            : locale === 'ar'
            ? `المكونات: ${ingredients}\nالمطبخ: ${targetCuisine}\nالصعوبة: ${targetDifficulty}\nالحصص: ${servings}\nالحمية: ${targetDiet}\n\nأنشئ وصفتين.`
            : `Ingredients: ${ingredients}\nCuisine: ${targetCuisine}\nDifficulty: ${targetDifficulty}\nServings: ${servings}\nDiet: ${targetDiet}\n\nGenerate 2 recipes.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.recipes || !Array.isArray(result.recipes)) {
            return errJson('No recipes generated', 500);
          }
          return json({ recipes: result.recipes.slice(0, 2), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-regex-generator':
        case '/api/ai-regex-generator/': {
          const description = (payload.description as string) || '';
          const language = (payload.language as string) || 'general';
          const testString = (payload.testString as string) || '';
          if (!description?.trim()) return errJson('Description is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-regex-generator');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const languageMap: Record<string, string> = {
            javascript: 'JavaScript',
            python: 'Python',
            java: 'Java',
            go: 'Go',
            general: locale === 'zh' ? '通用（PCRE 风格）' : locale === 'es' ? 'general (estilo PCRE)' : locale === 'fr' ? 'général (style PCRE)' : locale === 'hi' ? 'सामान्य (PCRE शैली)' : locale === 'ar' ? 'عام (نمط PCRE)' : 'general (PCRE style)',
          };
          const targetLanguage = languageMap[language] || languageMap.general;

          const systemPrompt = `你是一个正则表达式专家。根据用户的自然语言描述，生成正确的正则表达式，并解释每个部分的含义。

返回格式要求（必须是有效的 JSON）：
{
  "regex": "正则表达式（仅模式本身，不含语言特定分隔符/标志）",
  "explanation": "逐段解释每个部分的作用，例如：^ 表示开头，[a-z] 匹配小写字母等",
  "matches": ["在测试字符串中匹配到的字符串列表，如无测试字符串则为空数组"],
  "testCode": "对应语言的测试代码片段（字符串）"
}

注意：
- regex 字段只输出纯正则模式本身（如 ^[a-z]+$），不要包含 /.../ 分隔符或标志
- 如果提供了测试字符串，必须在 matches 数组中列出所有匹配到的子串
- testCode 要根据目标语言生成可运行的示例代码
- 用 ${langLabel(locale)} 输出 explanation，regex/testCode 保持代码形式`;

          const testStrSection = testString?.trim() ? `\n${locale === 'zh' ? '测试字符串' : locale === 'es' ? 'Cadena de prueba' : locale === 'fr' ? 'Chaîne de test' : locale === 'hi' ? 'परीक्षण स्ट्रिंग' : locale === 'ar' ? 'سلسلة الاختبار' : 'Test string'}: ${testString.trim()}` : '';

          const userPrompt = locale === 'zh'
            ? `需求描述：${description}\n目标语言：${targetLanguage}${testStrSection}\n\n请生成正则表达式并解释。`
            : locale === 'es'
            ? `Descripción: ${description}\nLenguaje: ${targetLanguage}${testStrSection}\n\nGenera la expresión regular y explícala.`
            : locale === 'fr'
            ? `Description: ${description}\nLangage: ${targetLanguage}${testStrSection}\n\nGénérez l'expression régulière et expliquez-la.`
            : locale === 'hi'
            ? `विवरण: ${description}\nभाषा: ${targetLanguage}${testStrSection}\n\nरेगुलर एक्सप्रेशन बनाएं और समझाएं।`
            : locale === 'ar'
            ? `الوصف: ${description}\nاللغة: ${targetLanguage}${testStrSection}\n\nأنشئ التعبير النمطي واشرحه.`
            : `Description: ${description}\nLanguage: ${targetLanguage}${testStrSection}\n\nGenerate the regex and explain it.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try {
            result = JSON.parse(content);
          } catch {
            return errJson('Failed to parse AI response', 500);
          }
          if (!result.regex || typeof result.regex !== 'string') {
            return errJson('No regex generated', 500);
          }
          return json({
            regex: result.regex,
            explanation: result.explanation || '',
            matches: Array.isArray(result.matches) ? result.matches : [],
            testCode: result.testCode || '',
            remaining: rateLimitResult.remaining,
          });
        }

        case '/api/ai-game-guide':
        case '/api/ai-game-guide/': {
          const game = (payload.game as string) || '';
          const situation = (payload.situation as string) || '';
          const level = (payload.level as string) || '';
          const platform = (payload.platform as string) || 'general';
          if (!game?.trim() || !situation?.trim()) return errJson('Game and situation are required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-game-guide');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const systemPrompt = `你是一位资深的游戏攻略专家，熟悉各类热门游戏的关卡、BOSS、角色养成和操作技巧。根据玩家提供的游戏名、卡点描述和关卡信息，生成实用的通关攻略。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "title": "攻略标题",
      "strategy": "详细通关思路（200-300字，分步骤说明）",
      "tips": "避坑要点/小技巧（50-100字）"
    }
  ]
}

请生成【3条】不同思路的攻略。用 ${langLabel(locale)} 输出。攻略要具体可操作，不编造不存在的技能/道具名。`;

          const userPrompt = locale === 'zh'
            ? `游戏名：${game}\n关卡/角色/BOSS：${level || '未指定'}\n平台：${platform}\n卡点描述：${situation}\n\n请生成3条通关攻略。`
            : locale === 'es'
            ? `Juego: ${game}\nNivel/personaje/jefe: ${level || 'no especificado'}\nPlataforma: ${platform}\nDescripción del problema: ${situation}\n\nGenera 3 guías.`
            : locale === 'fr'
            ? `Jeu: ${game}\nNiveau/personnage/boss: ${level || 'non spécifié'}\nPlateforme: ${platform}\nDescription du blocage: ${situation}\n\nGénérez 3 guides.`
            : locale === 'hi'
            ? `गेम: ${game}\nस्तर/चरित्र/बॉस: ${level || 'अनिर्दिष्ट'}\nप्लेटफ़ॉर्म: ${platform}\nसमस्या विवरण: ${situation}\n\n3 गाइड बनाएं।`
            : locale === 'ar'
            ? `اللعبة: ${game}\nالمستوى/الشخصية/الزعيم: ${level || 'غير محدد'}\nالمنصة: ${platform}\nوصف المشكلة: ${situation}\n\nأنشئ 3 أدلة.`
            : `Game: ${game}\nLevel/character/boss: ${level || 'unspecified'}\nPlatform: ${platform}\nBlocker description: ${situation}\n\nGenerate 3 guides.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try { result = JSON.parse(content); } catch { return errJson('Failed to parse AI response', 500); }
          if (!result.items || !Array.isArray(result.items)) return errJson('No guides generated', 500);
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-workout-plan':
        case '/api/ai-workout-plan/': {
          const goal = (payload.goal as string) || 'fitness';
          const level = (payload.level as string) || 'beginner';
          const equipment = (payload.equipment as string) || 'bodyweight';
          const daysPerWeek = (payload.daysPerWeek as string) || '3';
          if (!goal?.trim()) return errJson('Goal is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-workout-plan');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const goalMap: Record<string, string> = {
            fat_loss: locale === 'zh' ? '减脂' : locale === 'es' ? 'pérdida de grasa' : locale === 'fr' ? 'perte de graisse' : locale === 'hi' ? 'वसा हानि' : locale === 'ar' ? 'فقدان الدهون' : 'fat loss',
            muscle: locale === 'zh' ? '增肌' : locale === 'es' ? 'ganancia muscular' : locale === 'fr' ? 'prise de muscle' : locale === 'hi' ? 'मांसपेशी वृद्धि' : locale === 'ar' ? 'بناء العضلات' : 'muscle gain',
            shaping: locale === 'zh' ? '塑形' : locale === 'es' ? 'tonificación' : locale === 'fr' ? 'tonification' : locale === 'hi' ? 'शेपिंग' : locale === 'ar' ? 'نحت الجسم' : 'body shaping',
            fitness: locale === 'zh' ? '提升体能' : locale === 'es' ? 'mejorar condición física' : locale === 'fr' ? 'améliorer la condition' : locale === 'hi' ? 'फिटनेस' : locale === 'ar' ? 'لياقة بدنية' : 'general fitness',
          };
          const levelMap: Record<string, string> = {
            beginner: locale === 'zh' ? '初学者' : locale === 'es' ? 'principiante' : locale === 'fr' ? 'débutant' : locale === 'hi' ? 'शुरुआती' : locale === 'ar' ? 'مبتدئ' : 'beginner',
            intermediate: locale === 'zh' ? '中级' : locale === 'es' ? 'intermedio' : locale === 'fr' ? 'intermédiaire' : locale === 'hi' ? 'मध्यवर्ती' : locale === 'ar' ? 'متوسط' : 'intermediate',
            advanced: locale === 'zh' ? '高级' : locale === 'es' ? 'avanzado' : locale === 'fr' ? 'avancé' : locale === 'hi' ? 'उन्नत' : locale === 'ar' ? 'متقدم' : 'advanced',
          };
          const equipMap: Record<string, string> = {
            bodyweight: locale === 'zh' ? '徒手/自重' : locale === 'es' ? 'peso corporal' : locale === 'fr' ? 'poids du corps' : locale === 'hi' ? 'शारीरिक भार' : locale === 'ar' ? 'وزن الجسم' : 'bodyweight',
            dumbbell: locale === 'zh' ? '哑铃' : locale === 'es' ? 'mancuernas' : locale === 'fr' ? 'haltères' : locale === 'hi' ? 'डम्बल' : locale === 'ar' ? 'دمبل' : 'dumbbells',
            gym: locale === 'zh' ? '健身房全套' : locale === 'es' ? 'gimnasio completo' : locale === 'fr' ? 'salle de sport' : locale === 'hi' ? 'जिम' : locale === 'ar' ? 'صالة رياضية' : 'full gym',
            home: locale === 'zh' ? '家用简单器械' : locale === 'es' ? 'equipo casero' : locale === 'fr' ? 'équipement maison' : locale === 'hi' ? 'घर का उपकरण' : locale === 'ar' ? 'معدات منزلية' : 'home equipment',
          };

          const systemPrompt = `你是一位专业的健身教练，持有认证资格，擅长根据用户目标、体能水平、可用器械和时间安排制定科学的训练计划。

返回格式要求（必须是有效的 JSON）：
{
  "summary": "计划总览（100-150字，说明思路和预期效果）",
  "items": [
    {
      "day": "第1天",
      "focus": "训练重点（如：胸部+三头）",
      "exercises": "具体动作清单（含组数×次数，如：俯卧撑 4×12）",
      "duration": "预计时长（如：45分钟）",
      "notes": "注意事项（50字内）"
    }
  ],
  "nutritionTips": "饮食建议（100字内）"
}

根据用户每周训练天数生成对应数量的天数安排（${daysPerWeek}天）。用 ${langLabel(locale)} 输出。动作要安全可行，适合该体能水平。`;

          const userPrompt = locale === 'zh'
            ? `目标：${goalMap[goal] || goalMap.fitness}\n体能水平：${levelMap[level] || levelMap.beginner}\n可用器械：${equipMap[equipment] || equipMap.bodyweight}\n每周训练天数：${daysPerWeek}\n\n请生成训练计划。`
            : locale === 'es'
            ? `Objetivo: ${goalMap[goal] || goalMap.fitness}\nNivel: ${levelMap[level] || levelMap.beginner}\nEquipo: ${equipMap[equipment] || equipMap.bodyweight}\nDías por semana: ${daysPerWeek}\n\nGenera un plan.`
            : locale === 'fr'
            ? `Objectif: ${goalMap[goal] || goalMap.fitness}\nNiveau: ${levelMap[level] || levelMap.beginner}\nÉquipement: ${equipMap[equipment] || equipMap.bodyweight}\nJours par semaine: ${daysPerWeek}\n\nGénérez un plan.`
            : locale === 'hi'
            ? `लक्ष्य: ${goalMap[goal] || goalMap.fitness}\nस्तर: ${levelMap[level] || levelMap.beginner}\nउपकरण: ${equipMap[equipment] || equipMap.bodyweight}\nसप्ताह के दिन: ${daysPerWeek}\n\nएक योजना बनाएं।`
            : locale === 'ar'
            ? `الهدف: ${goalMap[goal] || goalMap.fitness}\nالمستوى: ${levelMap[level] || levelMap.beginner}\nالمعدات: ${equipMap[equipment] || equipMap.bodyweight}\nأيام الأسبوع: ${daysPerWeek}\n\nأنشئ خطة.`
            : `Goal: ${goalMap[goal] || goalMap.fitness}\nLevel: ${levelMap[level] || levelMap.beginner}\nEquipment: ${equipMap[equipment] || equipMap.bodyweight}\nDays per week: ${daysPerWeek}\n\nGenerate a plan.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try { result = JSON.parse(content); } catch { return errJson('Failed to parse AI response', 500); }
          if (!result.items || !Array.isArray(result.items)) return errJson('No plan generated', 500);
          return json({
            summary: result.summary || '',
            items: result.items,
            nutritionTips: result.nutritionTips || '',
            remaining: rateLimitResult.remaining,
          });
        }

        case '/api/ai-moments-caption':
        case '/api/ai-moments-caption/': {
          const scene = (payload.scene as string) || '';
          const style = (payload.style as string) || 'mixed';
          const mood = (payload.mood as string) || '';
          if (!scene?.trim()) return errJson('Scene description is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-moments-caption');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const styleMap: Record<string, string> = {
            literary: locale === 'zh' ? '文艺清新' : locale === 'es' ? 'literario' : locale === 'fr' ? 'littéraire' : locale === 'hi' ? 'साहित्यिक' : locale === 'ar' ? 'أدبي' : 'literary',
            humorous: locale === 'zh' ? '幽默搞笑' : locale === 'es' ? 'humorístico' : locale === 'fr' ? 'humoristique' : locale === 'hi' ? 'हास्यपूर्ण' : locale === 'ar' ? 'فكاهي' : 'humorous',
            minimal: locale === 'zh' ? '简约留白' : locale === 'es' ? 'minimalista' : locale === 'fr' ? 'minimaliste' : locale === 'hi' ? 'न्यूनतम' : locale === 'ar' ? 'بسيط' : 'minimal',
            emotional: locale === 'zh' ? '走心情感' : locale === 'es' ? 'emocional' : locale === 'fr' ? 'émotionnel' : locale === 'hi' ? 'भावनात्मक' : locale === 'ar' ? 'عاطفي' : 'emotional',
            mixed: locale === 'zh' ? '混合三种风格' : locale === 'es' ? 'tres estilos mixtos' : locale === 'fr' ? 'trois styles mélangés' : locale === 'hi' ? 'तीन शैलियाँ' : locale === 'ar' ? 'ثلاثة أساليب' : 'three mixed styles',
          };

          const systemPrompt = `你是一位社交媒体文案专家，擅长写朋友圈/微信动态文案。文案要有"人味"，避免AI腔和营销腔，像真人发的朋友圈。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "caption": "文案内容（20-80字，可带emoji，不要#话题#）",
      "vibe": "风格标签（如：文艺/幽默/走心）"
    }
  ]
}

请生成【3条】文案。${style === 'mixed' ? '3条分别用文艺、幽默、走心三种不同风格。' : `统一用${styleMap[style] || styleMap.mixed}风格。`}用 ${langLabel(locale)} 输出。文案要真实自然，不夸大不做作。`;

          const userPrompt = locale === 'zh'
            ? `照片/场景描述：${scene}\n心情：${mood || '随意'}\n风格：${styleMap[style] || styleMap.mixed}\n\n请生成3条朋友圈文案。`
            : locale === 'es'
            ? `Descripción de la escena: ${scene}\nEstado de ánimo: ${mood || 'casual'}\nEstilo: ${styleMap[style] || styleMap.mixed}\n\nGenera 3 textos.`
            : locale === 'fr'
            ? `Description de la scène: ${scene}\nHumeur: ${mood || 'décontractée'}\nStyle: ${styleMap[style] || styleMap.mixed}\n\nGénérez 3 légendes.`
            : locale === 'hi'
            ? `दृश्य विवरण: ${scene}\nमूड: ${mood || 'सामान्य'}\nशैली: ${styleMap[style] || styleMap.mixed}\n\n3 कैप्शन बनाएं।`
            : locale === 'ar'
            ? `وصف المشهد: ${scene}\nالمزاج: ${mood || 'عادي'}\nالأسلوب: ${styleMap[style] || styleMap.mixed}\n\nأنشئ 3 تعليقات.`
            : `Scene description: ${scene}\nMood: ${mood || 'casual'}\nStyle: ${styleMap[style] || styleMap.mixed}\n\nGenerate 3 captions.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try { result = JSON.parse(content); } catch { return errJson('Failed to parse AI response', 500); }
          if (!result.items || !Array.isArray(result.items)) return errJson('No captions generated', 500);
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-smart-reply':
        case '/api/ai-smart-reply/': {
          const incomingText = (payload.incomingText as string) || '';
          const relation = (payload.relation as string) || 'friend';
          const goal = (payload.goal as string) || 'reply';
          if (!incomingText?.trim()) return errJson('Incoming message is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-smart-reply');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const relationMap: Record<string, string> = {
            partner: locale === 'zh' ? '情侣/另一半' : locale === 'es' ? 'pareja' : locale === 'fr' ? 'partenaire' : locale === 'hi' ? 'साथी' : locale === 'ar' ? 'شريك' : 'partner',
            boss: locale === 'zh' ? '领导/上司' : locale === 'es' ? 'jefe' : locale === 'fr' ? 'patron' : locale === 'hi' ? 'बॉस' : locale === 'ar' ? 'مدير' : 'boss',
            client: locale === 'zh' ? '客户' : locale === 'es' ? 'cliente' : locale === 'fr' ? 'client' : locale === 'hi' ? 'ग्राहक' : locale === 'ar' ? 'عميل' : 'client',
            friend: locale === 'zh' ? '朋友' : locale === 'es' ? 'amigo' : locale === 'fr' ? 'ami' : locale === 'hi' ? 'दोस्त' : locale === 'ar' ? 'صديق' : 'friend',
            family: locale === 'zh' ? '家人' : locale === 'es' ? 'familia' : locale === 'fr' ? 'famille' : locale === 'hi' ? 'परिवार' : locale === 'ar' ? 'عائلة' : 'family',
            crush: locale === 'zh' ? '暗恋对象' : locale === 'es' ? 'interés romántico' : locale === 'fr' ? 'craquage' : locale === 'hi' ? 'क्रश' : locale === 'ar' ? 'إعجاب' : 'crush',
          };
          const goalMap: Record<string, string> = {
            reply: locale === 'zh' ? '得体回复' : locale === 'es' ? 'respuesta apropiada' : locale === 'fr' ? 'réponse appropriée' : locale === 'hi' ? 'उचित उत्तर' : locale === 'ar' ? 'رد مناسب' : 'appropriate reply',
            refuse: locale === 'zh' ? '委婉拒绝' : locale === 'es' ? 'rechazar educadamente' : locale === 'fr' ? 'refuser poliment' : locale === 'hi' ? 'विनम्र अस्वीकृति' : locale === 'ar' ? 'رفض مهذب' : 'polite refusal',
            accept: locale === 'zh' ? '欣然答应' : locale === 'es' ? 'aceptar con gusto' : locale === 'fr' ? 'accepter avec plaisir' : locale === 'hi' ? 'खुशी से स्वीकार' : locale === 'ar' ? 'قبول بسرور' : 'gladly accept',
            icebreak: locale === 'zh' ? '破冰搭话' : locale === 'es' ? 'romper el hielo' : locale === 'fr' ? 'briser la glace' : locale === 'hi' ? 'बर्फ तोड़ना' : locale === 'ar' ? 'كسر الجليد' : 'break the ice',
            negotiate: locale === 'zh' ? '谈判斡旋' : locale === 'es' ? 'negociar' : locale === 'fr' ? 'négocier' : locale === 'hi' ? 'बातचीत' : locale === 'ar' ? 'تفاوض' : 'negotiate',
          };

          const systemPrompt = `你是一位高情商沟通专家，擅长在复杂人际关系中给出得体、自然、不尴尬的回复话术。回复要像真人说的话，不要像客服模板，要考虑对方感受和关系亲疏。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "reply": "回复话术（30-100字）",
      "reasoning": "为什么这么说（50字内，说明这样回复的考量）"
    }
  ]
}

请生成【3条】不同风格的回复。用 ${langLabel(locale)} 输出。话术要真实可用，不油腻不套路。`;

          const userPrompt = locale === 'zh'
            ? `对方身份：${relationMap[relation] || relationMap.friend}\n沟通目标：${goalMap[goal] || goalMap.reply}\n对方消息：${incomingText}\n\n请生成3条高情商回复。`
            : locale === 'es'
            ? `Relación: ${relationMap[relation] || relationMap.friend}\nObjetivo: ${goalMap[goal] || goalMap.reply}\nMensaje recibido: ${incomingText}\n\nGenera 3 respuestas.`
            : locale === 'fr'
            ? `Relation: ${relationMap[relation] || relationMap.friend}\nObjectif: ${goalMap[goal] || goalMap.reply}\nMessage reçu: ${incomingText}\n\nGénérez 3 réponses.`
            : locale === 'hi'
            ? `संबंध: ${relationMap[relation] || relationMap.friend}\nलक्ष्य: ${goalMap[goal] || goalMap.reply}\nप्राप्त संदेश: ${incomingText}\n\n3 उत्तर बनाएं।`
            : locale === 'ar'
            ? `العلاقة: ${relationMap[relation] || relationMap.friend}\nالهدف: ${goalMap[goal] || goalMap.reply}\nالرسالة الواردة: ${incomingText}\n\nأنشئ 3 ردود.`
            : `Relationship: ${relationMap[relation] || relationMap.friend}\nGoal: ${goalMap[goal] || goalMap.reply}\nIncoming message: ${incomingText}\n\nGenerate 3 replies.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try { result = JSON.parse(content); } catch { return errJson('Failed to parse AI response', 500); }
          if (!result.items || !Array.isArray(result.items)) return errJson('No replies generated', 500);
          return json({ items: result.items.slice(0, 3), remaining: rateLimitResult.remaining });
        }

        case '/api/ai-gift-recommender':
        case '/api/ai-gift-recommender/': {
          const recipient = (payload.recipient as string) || '';
          const occasion = (payload.occasion as string) || 'birthday';
          const budget = (payload.budget as string) || '';
          const interest = (payload.interest as string) || '';
          if (!recipient?.trim()) return errJson('Recipient is required', 400);

          const rateLimitResult = await checkRateLimit(env, request, 5, 'ai-gift-recommender');
          if (rateLimitResult.blocked) {
            return json({ error: 'RATE_LIMIT', message: rateLimitResult.message }, 429);
          }

          const occasionMap: Record<string, string> = {
            birthday: locale === 'zh' ? '生日' : locale === 'es' ? 'cumpleaños' : locale === 'fr' ? 'anniversaire' : locale === 'hi' ? 'जन्मदिन' : locale === 'ar' ? 'عيد ميلاد' : 'birthday',
            anniversary: locale === 'zh' ? '纪念日' : locale === 'es' ? 'aniversario' : locale === 'fr' ? 'anniversaire de couple' : locale === 'hi' ? 'वर्षगांठ' : locale === 'ar' ? 'ذكرى سنوية' : 'anniversary',
            festival: locale === 'zh' ? '节日' : locale === 'es' ? 'fiesta' : locale === 'fr' ? 'fête' : locale === 'hi' ? 'त्योहार' : locale === 'ar' ? 'عطلة' : 'festival',
            thanks: locale === 'zh' ? '答谢' : locale === 'es' ? 'agradecimiento' : locale === 'fr' ? 'remerciement' : locale === 'hi' ? 'धन्यवाद' : locale === 'ar' ? 'شكر' : 'thank you',
            apology: locale === 'zh' ? '道歉' : locale === 'es' ? 'disculpa' : locale === 'fr' ? 'excuse' : locale === 'hi' ? 'माफ़ी' : locale === 'ar' ? 'اعتذار' : 'apology',
          };

          const systemPrompt = `你是一位贴心的礼物推荐顾问，了解不同人群的喜好和各类场合的送礼礼仪。推荐要具体、可买到、不踩雷，避开烂大街的礼物。

返回格式要求（必须是有效的 JSON）：
{
  "items": [
    {
      "gift": "礼物名称",
      "reason": "推荐理由（80字内，说明为什么适合）",
      "priceRange": "大致价位（如：100-300元）",
      "whereToBuy": "购买渠道（如：天猫/京东/线下礼品店）"
    }
  ]
}

请生成【5个】不同价位的礼物建议。用 ${langLabel(locale)} 输出。礼物要真实存在、可购买，不编造品牌。`;

          const userPrompt = locale === 'zh'
            ? `送礼对象：${recipient}\n场合：${occasionMap[occasion] || occasionMap.birthday}\n预算：${budget || '不限'}\n对方兴趣：${interest || '未指定'}\n\n请推荐5个礼物。`
            : locale === 'es'
            ? `Destinatario: ${recipient}\nOcasión: ${occasionMap[occasion] || occasionMap.birthday}\nPresupuesto: ${budget || 'sin límite'}\nIntereses: ${interest || 'no especificado'}\n\nRecomienda 5 regalos.`
            : locale === 'fr'
            ? `Destinataire: ${recipient}\nOccasion: ${occasionMap[occasion] || occasionMap.birthday}\nBudget: ${budget || 'illimité'}\nIntérêts: ${interest || 'non spécifié'}\n\nRecommandez 5 cadeaux.`
            : locale === 'hi'
            ? `प्राप्तकर्ता: ${recipient}\nअवसर: ${occasionMap[occasion] || occasionMap.birthday}\nबजट: ${budget || 'असीमित'}\nरुचि: ${interest || 'अनिर्दिष्ट'}\n\n5 उपहार सुझाएं।`
            : locale === 'ar'
            ? `المستلم: ${recipient}\nالمناسبة: ${occasionMap[occasion] || occasionMap.birthday}\nالميزانية: ${budget || 'غير محدد'}\nالاهتمامات: ${interest || 'غير محدد'}\n\nاقترح 5 هدايا.`
            : `Recipient: ${recipient}\nOccasion: ${occasionMap[occasion] || occasionMap.birthday}\nBudget: ${budget || 'unlimited'}\nInterests: ${interest || 'unspecified'}\n\nRecommend 5 gifts.`;

          const content = await callDeepseek(env, systemPrompt, userPrompt, true);
          let result;
          try { result = JSON.parse(content); } catch { return errJson('Failed to parse AI response', 500); }
          if (!result.items || !Array.isArray(result.items)) return errJson('No gifts generated', 500);
          return json({ items: result.items.slice(0, 5), remaining: rateLimitResult.remaining });
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