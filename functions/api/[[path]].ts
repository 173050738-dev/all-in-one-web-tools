/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  DEEPSEEK_MODEL?: string;
}

function okJson(data: unknown, status = 200): Response {
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
  return okJson({ error }, status);
}

function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}

const langLabel = (locale: string): string => {
  return locale === 'zh' ? '中文' : locale === 'es' ? '西班牙语' : locale === 'fr' ? '法语' : locale === 'hi' ? '印地语' : locale === 'ar' ? '阿拉伯语' : 'English';
};

const toneMap: Record<string, Record<string, string>> = {
  zh: {
    formal: '正式/商务',
    friendly: '友好/亲切',
    concise: '简洁/精炼',
    humorous: '幽默/风趣',
    persuasive: '说服/营销',
    academic: '学术/专业',
  },
  en: {
    formal: 'formal/business',
    friendly: 'friendly/casual',
    concise: 'concise/to-the-point',
    humorous: 'humorous/funny',
    persuasive: 'persuasive/marketing',
    academic: 'academic/professional',
  },
  es: {
    formal: 'formal',
    friendly: 'amigable',
    concise: 'conciso',
    humorous: 'humorístico',
    persuasive: 'persuasivo',
    academic: 'académico',
  },
  fr: {
    formal: 'formel',
    friendly: 'amiable',
    concise: 'concis',
    humorous: 'humoristique',
    persuasive: 'persuasif',
    academic: 'académique',
  },
  hi: {
    formal: 'औपचारिक',
    friendly: 'दोस्ताना',
    concise: 'संक्षिप्त',
    humorous: 'हास्यपूर्ण',
    persuasive: 'प्रेरणादायक',
    academic: 'अकादमिक',
  },
  ar: {
    formal: 'رسمي',
    friendly: 'ودود',
    concise: 'مختصر',
    humorous: 'مزح',
    persuasive: 'قائل',
    academic: 'أكاديمي',
  },
};

async function callDeepseek(env: Env, systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = env.DEEPSEEK_API_KEY;
  const apiUrl = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const model = env.DEEPSEEK_MODEL || 'deepseek-chat';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

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
      max_tokens: 1500,
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

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const path = params.path?.join('/') || '';

  if (request.method === 'OPTIONS') {
    return corsPreflight();
  }

  if (request.method !== 'POST') {
    return errJson('Method not allowed', 405);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return errJson('Invalid JSON body', 400);
  }

  const locale = (payload.locale as string) || 'zh';

  try {
    switch (path) {
      case 'tone-changer':
      case 'tone-changer/': {
        const text = payload.text as string;
        const tone = (payload.tone as string) || 'friendly';

        if (!text?.trim()) {
          return errJson('Text is required', 400);
        }

        const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.friendly || 'friendly';

        const systemPrompt = `你是一个专业的语气转换助手。根据用户提供的文本和目标语气，重写文本使其符合指定的语气风格。

语气类型说明：
- 正式/商务：适合商务邮件、正式报告等场合
- 友好/亲切：适合朋友交流、社交媒体等场合
- 简洁/精炼：去除冗余，直接表达核心内容
- 幽默/风趣：添加轻松幽默的表达方式
- 说服/营销：具有说服力，适合营销文案
- 学术/专业：严谨专业，适合学术写作

请用 ${langLabel(locale)} 输出。保持原文的核心意思不变。`;

        const userPrompt = locale === 'zh'
          ? `原始文本：${text}\n\n目标语气：${targetTone}\n\n请转换语气并重写。`
          : locale === 'es'
          ? `Texto original: ${text}\n\nTono objetivo: ${targetTone}\n\nReescribe con el tono especificado.`
          : locale === 'fr'
          ? `Texte original: ${text}\n\nTon cible: ${targetTone}\n\nRéécrivez avec le ton spécifié.`
          : locale === 'hi'
          ? `मूल पाठ: ${text}\n\nलक्ष्य टोन: ${targetTone}\n\nनिर्दिष्ट टोन के साथ फिर से लिखें।`
          : locale === 'ar'
          ? `النص الأصلي: ${text}\n\nالنبرة المستهدفة: ${targetTone}\n\nأعد كتابته بالنبرة المحددة.`
          : `Original text: ${text}\n\nTarget tone: ${targetTone}\n\nRewrite with the specified tone.`;

        const content = await callDeepseek(env, systemPrompt, userPrompt);

        return okJson({
          original: text,
          rewritten: content,
          tone: tone,
          explanation: '',
        });
      }

      case 'task-breakdown':
      case 'task-breakdown/': {
        const task = payload.task as string;

        if (!task?.trim()) {
          return errJson('Task is required', 400);
        }

        const systemPrompt = `你是一个高效的任务分解助手。根据用户提供的任务描述，将其分解为具体的、可执行的步骤。

分解原则：
1. 步骤清晰、具体，每个步骤都是一个独立的动作
2. 按照逻辑顺序排列
3. 考虑到可能的依赖关系
4. 给出合理的时间估算

请用 ${langLabel(locale)} 输出。`;

        const userPrompt = locale === 'zh'
          ? `任务描述：${task}\n\n请将此任务分解为具体步骤。`
          : locale === 'es'
          ? `Descripción de la tarea: ${task}\n\nDescomponga esta tarea en pasos específicos.`
          : locale === 'fr'
          ? `Description de la tâche: ${task}\n\nDécomposez cette tâche en étapes spécifiques.`
          : locale === 'hi'
          ? `कार्य विवरण: ${task}\n\nइस कार्य को विशिष्ट चरणों में विभाजित करें।`
          : locale === 'ar'
          ? `وصف المهمة: ${task}\n\nقم بتفكيك هذه المهمة إلى خطوات محددة.`
          : `Task description: ${task}\n\nBreak down this task into specific steps.`;

        const content = await callDeepseek(env, systemPrompt, userPrompt);

        return okJson({
          task: task,
          steps: content,
        });
      }

      case 'concept-explain':
      case 'concept-explain/': {
        const concept = payload.concept as string;

        if (!concept?.trim()) {
          return errJson('Concept is required', 400);
        }

        const systemPrompt = `你是一个耐心的知识讲解助手。根据用户提供的概念，用通俗易懂的方式进行解释。

讲解原则：
1. 使用简单明了的语言，避免过多专业术语
2. 提供实际例子帮助理解
3. 结构清晰，层次分明
4. 必要时给出对比或类比

请用 ${langLabel(locale)} 输出。`;

        const userPrompt = locale === 'zh'
          ? `概念：${concept}\n\n请用通俗易懂的方式解释这个概念。`
          : locale === 'es'
          ? `Concepto: ${concept}\n\nExplique este concepto de manera sencilla y comprensible.`
          : locale === 'fr'
          ? `Concept: ${concept}\n\nExpliquez ce concept de manière simple et compréhensible.`
          : locale === 'hi'
          ? `अवधारणा: ${concept}\n\nइस अवधारणा को सरल और समझने योग्य तरीके से समझाएं।`
          : locale === 'ar'
          ? `المفهوم: ${concept}\n\nأشرح هذا المفهوم بطريقة بسيطة ومفهومة.`
          : `Concept: ${concept}\n\nExplain this concept in a simple and understandable way.`;

        const content = await callDeepseek(env, systemPrompt, userPrompt);

        return okJson({
          concept: concept,
          explanation: content,
        });
      }

      case 'idea-to-action':
      case 'idea-to-action/': {
        const idea = payload.idea as string;

        if (!idea?.trim()) {
          return errJson('Idea is required', 400);
        }

        const systemPrompt = `你是一个行动导向的创意助手。根据用户提供的想法，帮助制定具体的行动计划。

行动计划应包含：
1. 明确的目标
2. 具体的步骤
3. 时间安排建议
4. 潜在挑战和应对策略

请用 ${langLabel(locale)} 输出。`;

        const userPrompt = locale === 'zh'
          ? `想法：${idea}\n\n请为这个想法制定具体的行动计划。`
          : locale === 'es'
          ? `Idea: ${idea}\n\nDesarrolle un plan de acción específico para esta idea.`
          : locale === 'fr'
          ? `Idée: ${idea}\n\nDéveloppez un plan d'action spécifique pour cette idée.`
          : locale === 'hi'
          ? `विचार: ${idea}\n\nइस विचार के लिए एक विशिष्ट क्रिया योजना तैयार करें।`
          : locale === 'ar'
          ? `الفكرة: ${idea}\n\nقم بإعداد خطة عمل محددة لهذه الفكرة.`
          : `Idea: ${idea}\n\nDevelop a specific action plan for this idea.`;

        const content = await callDeepseek(env, systemPrompt, userPrompt);

        return okJson({
          idea: idea,
          plan: content,
        });
      }

      case 'ai-copywriter':
      case 'ai-copywriter/': {
        const product = payload.product as string;
        const selling = payload.selling as string;
        const type = (payload.type as string) || 'sales';
        const tone = (payload.tone as string) || 'friendly';
        const platform = (payload.platform as string) || 'general';

        if (!product?.trim() || !selling?.trim()) {
          return errJson('Product and selling points are required', 400);
        }

        const targetTone = toneMap[locale]?.[tone] || toneMap[locale]?.friendly || 'friendly';

        const systemPrompt = `你是一个专业的文案撰写助手。根据用户提供的产品信息和卖点，撰写高质量的营销文案。

文案类型：
- sales：销售文案，强调产品优势和购买理由
- social：社交媒体文案，活泼有趣，易于传播
- email：邮件营销文案，专业正式，转化率高
- ad：广告文案，简洁有力，吸引眼球

请用 ${langLabel(locale)} 输出，语气：${targetTone}。`;

        const userPrompt = locale === 'zh'
          ? `产品：${product}\n\n卖点：${selling}\n\n文案类型：${type}\n\n平台：${platform}\n\n请撰写营销文案。`
          : locale === 'es'
          ? `Producto: ${product}\n\nPuntos de venta: ${selling}\n\nTipo de copia: ${type}\n\nPlataforma: ${platform}\n\nEscriba el texto publicitario.`
          : locale === 'fr'
          ? `Produit: ${product}\n\nPoints de vente: ${selling}\n\nType de copie: ${type}\n\nPlateforme: ${platform}\n\nÉcrivez le texte publicitaire.`
          : locale === 'hi'
          ? `उत्पाद: ${product}\n\nबिक्री बिंदु: ${selling}\n\nप्रतिलिपि प्रकार: ${type}\n\nप्लेटफॉर्म: ${platform}\n\nविपणन प्रतिलिपि लिखें।`
          : locale === 'ar'
          ? `المنتج: ${product}\n\nنقاط البيع: ${selling}\n\nنوع النص: ${type}\n\nالمنصة: ${platform}\n\nأكتب النص التسويقي.`
          : `Product: ${product}\n\nSelling points: ${selling}\n\nCopy type: ${type}\n\nPlatform: ${platform}\n\nWrite the marketing copy.`;

        const content = await callDeepseek(env, systemPrompt, userPrompt);

        return okJson({
          product: product,
          selling: selling,
          copy: content,
        });
      }

      case 'seo-miner':
      case 'seo-miner/': {
        const keyword = payload.keyword as string;
        const domain = payload.domain as string;

        if (!keyword?.trim()) {
          return errJson('Keyword is required', 400);
        }

        const systemPrompt = `你是一个专业的SEO分析助手。根据用户提供的关键词，分析SEO优化建议。

分析内容包括：
1. 关键词难度评估
2. 相关关键词建议
3. 内容优化建议
4. 页面标题和描述建议

请用 ${langLabel(locale)} 输出。`;

        const userPrompt = locale === 'zh'
          ? `关键词：${keyword}\n\n目标网站：${domain || '不限'}\n\n请分析SEO优化建议。`
          : locale === 'es'
          ? `Palabra clave: ${keyword}\n\nSitio web objetivo: ${domain || 'cualquiera'}\n\nAnalice las recomendaciones de SEO.`
          : locale === 'fr'
          ? `Mot-clé: ${keyword}\n\nSite web cible: ${domain || 'n'importe lequel'}\n\nAnalysez les recommandations SEO.`
          : locale === 'hi'
          ? `कीवर्ड: ${keyword}\n\nलक्ष्य वेबसाइट: ${domain || 'कोई भी'}\n\nSEO अनुशंसाओं का विश्लेषण करें।`
          : locale === 'ar'
          ? `الكلمة المفتاحية: ${keyword}\n\nالموقع الهدف: ${domain || 'أي'}\n\nقم بتحليل مقترحات SEO.`
          : `Keyword: ${keyword}\n\nTarget website: ${domain || 'any'}\n\nAnalyze SEO optimization suggestions.`;

        const content = await callDeepseek(env, systemPrompt, userPrompt);

        return okJson({
          keyword: keyword,
          domain: domain,
          analysis: content,
        });
      }

      default:
        return errJson('API endpoint not found', 404);
    }
  } catch (error) {
    console.error('API error:', error);
    return errJson('Internal server error', 500);
  }
};