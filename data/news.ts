import type { SeoLocale } from '@/components/seo';
import { KNOWN_LOCALES } from '@/components/seo';

export interface NewsItem {
  id: string;
  category: Partial<Record<SeoLocale, string>>;
  title: Partial<Record<SeoLocale, string>>;
  summary: Partial<Record<SeoLocale, string>>;
  source?: Partial<Record<SeoLocale, string>>;
  sourceUrl?: string;
  relatedToolSlugs?: string[];
  emoji?: string;
}

export interface NewsIssue {
  slug: string;
  issueNo: number;
  publishedAt: string;
  coverEmoji: string;
  title: Partial<Record<SeoLocale, string>>;
  subtitle: Partial<Record<SeoLocale, string>>;
  description: Partial<Record<SeoLocale, string>>;
  keywords: Partial<Record<SeoLocale, string[]>>;
  tags: Array<Partial<Record<SeoLocale, string>>>;
  readingMinutes: Partial<Record<SeoLocale, number>>;
  items: NewsItem[];
  editorPick?: string;
}

const fallbackLocale = (l: SeoLocale): SeoLocale => (KNOWN_LOCALES.includes(l) ? l : 'en');

export function getLocalizedText<V>(
  map: Partial<Record<SeoLocale, V>> | undefined,
  locale: SeoLocale,
  fallback: V = '' as V,
): V {
  if (!map) return fallback;
  const l = fallbackLocale(locale);
  if (map[l] !== undefined) return map[l] as V;
  if (map.en !== undefined) return map.en as V;
  const firstKey = Object.keys(map)[0] as SeoLocale | undefined;
  if (firstKey && map[firstKey] !== undefined) return map[firstKey] as V;
  return fallback;
}

export function getAllNewsSlugs(): string[] {
  return NEWS_ISSUES.map(n => n.slug);
}

export function getNewsIssueBySlug(slug: string): NewsIssue | undefined {
  return NEWS_ISSUES.find(n => n.slug === slug);
}

export function getNewsIssuesList(locale: SeoLocale, limit = 20): NewsIssue[] {
  return [...NEWS_ISSUES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, limit);
}

export function formatIssueDate(dateISO: string, locale: SeoLocale): string {
  const date = new Date(dateISO);
  const formatMap: Record<SeoLocale, Intl.DateTimeFormatOptions> = {
    zh: { year: 'numeric', month: 'long', day: 'numeric' },
    en: { year: 'numeric', month: 'short', day: 'numeric' },
    fr: { year: 'numeric', month: 'short', day: 'numeric' },
    es: { year: 'numeric', month: 'short', day: 'numeric' },
    hi: { year: 'numeric', month: 'short', day: 'numeric' },
    ar: { year: 'numeric', month: 'short', day: 'numeric' },
  };
  const bcp47Map: Record<SeoLocale, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    hi: 'hi-IN',
    ar: 'ar-SA',
  };
  return new Intl.DateTimeFormat(bcp47Map[locale] || 'en-US', formatMap[locale]).format(date);
}

export const NEWS_ISSUES: NewsIssue[] = [
  {
    slug: 'weekly-issue-004',
    issueNo: 4,
    publishedAt: '2026-07-05T00:00:00.000Z',
    coverEmoji: '🛠️',
    title: {
      zh: '每周极简资讯 · 第4期',
      en: 'Korelyy Weekly Digest · Issue #004',
      fr: 'Hebdo Korelyy · Édition #004',
      es: 'Resumen Semanal Korelyy · Edición #004',
      hi: 'साप्ताहिक सार · अंक #004',
      ar: 'ملخص أسبوعي · العدد ٠٠٤',
    },
    subtitle: {
      zh: 'AI 工作流起飞、Vercel 价格调整、以及本周 5 款让效率翻倍的新工具',
      en: 'AI workflow platforms mature, Vercel pricing shifts, and 5 underrated productivity tools this week',
      fr: 'Plateformes de workflow IA, tarifs Vercel, et 5 outils productivité sous-cotés cette semaine',
      es: 'Plataformas de flujos de IA, cambios en Vercel, y 5 herramientas productivas infravaloradas',
      hi: 'AI वर्कफ़्लो प्लेटफ़ॉर्म, Vercel मूल्य में बदलाव, और 5 कम ज्ञात उत्पादकता टूल',
      ar: 'منصات سير العمل بالذكاء الاصطناعي، تغييرات أسعار Vercel، و٥ أدوات إنتاجية مخفية',
    },
    description: {
      zh: '本周极简资讯：AI Agent 工作流成为新基建、5款值得收藏的效率工具、以及关于如何构建个人 Second Brain 的极简实践。',
      en: 'This week: AI Agent workflows become the new infrastructure, 5 must-bookmark productivity tools, and a minimalist approach to building your Second Brain.',
      fr: 'Cette semaine : les workflows IA deviennent une infra standard, 5 outils productivité à marquer, et une approche minimaliste du Second Cerveau.',
      es: 'Esta semana: los flujos de trabajo con Agentes IA se vuelven infraestructura, 5 herramientas imprescindibles, y un enfoque minimalista para tu Second Brain.',
      hi: 'इस सप्ताह: AI एजेंट वर्कफ़्लो नई बुनियादी बन गए, 5 अनिवार्य प्रोडक्टिविटी टूल, और सेकंड ब्रेन बनाने का मिनिमलिस्ट तरीका।',
      ar: 'هذا الأسبوع: سير عمل وكلاء الذكاء الاصطناعي تصبح بنية تحتية، ٥ أدوات إنتاجية يجب حفظها، ونهج بسيط لبناء عقلك الثاني.',
    },
    keywords: {
      en: ['weekly news', 'AI tools', 'productivity digest', 'tech news 2026', 'tool recommendations'],
      zh: ['每周资讯', 'AI工具', '效率周报', '科技资讯2026', '工具推荐'],
      fr: ['actualités hebdo', 'outils IA', 'digest productivité', 'tech news 2026'],
      es: ['noticias semanales', 'herramientas IA', 'resumen productividad', 'tech news 2026'],
      hi: ['साप्ताहिक समाचार', 'AI टूल्स', 'प्रोडक्टिविटी डाइजेस्ट', 'टेक समाचार 2026'],
      ar: ['أخبار أسبوعية', 'أدوات ذكاء اصطناعي', 'ملخص إنتاجية', 'أخبار تقنية ٢٠٢٦'],
    },
    tags: [
      { en: 'Weekly', zh: '每周资讯', fr: 'Hebdo', es: 'Semanal', hi: 'साप्ताहिक', ar: 'أسبوعي' },
      { en: 'AI', zh: '人工智能', fr: 'IA', es: 'IA', hi: 'एआई', ar: 'ذكاء اصطناعي' },
      { en: 'Productivity', zh: '效率', fr: 'Productivité', es: 'Productividad', hi: 'उत्पादकता', ar: 'إنتاجية' },
    ],
    readingMinutes: { en: 4, zh: 3, fr: 4, es: 4, hi: 5, ar: 4 },
    editorPick: 'n8n-nodes-ai',
    items: [
      {
        id: '004-1',
        emoji: '🤖',
        category: { en: 'AI Workflows', zh: 'AI 工作流', fr: 'Workflows IA', es: 'Flujos IA', hi: 'AI वर्कफ़्लो', ar: 'سير عمل IA' },
        title: {
          zh: 'AI Agent 工作流成为「新基建」',
          en: 'AI Agent workflows become the new developer infrastructure',
          fr: 'Les workflows Agent IA deviennent la nouvelle infra',
          es: 'Los flujos de Agentes IA se vuelven infraestructura',
          hi: 'AI एजेंट वर्कफ़्लो नई डेवलपर बुनियादी बन गए',
          ar: 'سير عمل وكلاء الذكاء الاصطناعي تصبح بنية تحتية جديدة',
        },
        summary: {
          zh: 'n8n、LangGraph、Make 本周都发布了 Agent 编排能力——不再是简单的线性流程，而是多 Agent 协作 + 工具调用 + 记忆。对于独立开发者，这意味着「用 Korelyy + n8n」可以在 1 小时内搭出以前需要 3 天的业务系统。',
          en: 'n8n, LangGraph, and Make all launched Agent orchestration features this week — not just linear flows but multi-Agent collaboration with tool use and memory. For indie devs, "Korelyy + n8n" now lets you build business systems in 1 hour that used to take 3 days.',
          fr: 'n8n, LangGraph et Make ont tous sorti des fonctionnalités d\'orchestration Agent cette semaine — pas juste des flux linéaires mais de la collaboration multi-Agent avec outils et mémoire. Pour les devs indie : "Korelyy + n8n" construit en 1h ce qui prenait 3 jours.',
          es: 'n8n, LangGraph y Make lanzaron orquestación de Agentes esta semana — no solo flujos lineales, sino colaboración multi-Agente con herramientas y memoria. Para devs indie: "Korelyy + n8n" construye en 1h lo que antes tomaba 3 días.',
          hi: 'n8n, LangGraph, Make सभी ने इस सप्ताह एजेंट ऑर्केस्ट्रेशन लॉन्च किए — सिर्फ लीनियर फ़्लो नहीं, बल्कि टूल और मेमरी के साथ मल्टी-एजेंट सहयोग। इंडी डेव्स के लिए: "Korelyy + n8n" 1 घंटे में वही सिस्टम बनाता है जो 3 दिन लगते थे।',
          ar: 'أطلقت n8n و LangGraph و Make أتمتة وكلاء هذا الأسبوع — وليست مجرد تدفقات خطية بل تعاون متعدد الوكلاء مع أدوات وذاكرة. للمطورين المستقلين: يبني "Korelyy + n8n" في ساعة ما كان يستغرق ٣ أيام.',
        },
        relatedToolSlugs: ['n8n-nodes-ai', 'workflow-canvas'],
        source: { en: 'Product Hunt', zh: 'Product Hunt', fr: 'Product Hunt', es: 'Product Hunt', hi: 'Product Hunt', ar: 'Product Hunt' },
        sourceUrl: 'https://www.producthunt.com/',
      },
      {
        id: '004-2',
        emoji: '📸',
        category: { en: 'Image Tools', zh: '图像工具', fr: 'Outils Image', es: 'Herramientas Imagen', hi: 'इमेज टूल्स', ar: 'أدوات الصور' },
        title: {
          zh: '3 秒出图：新一代扩散模型刷新速度上限',
          en: 'Image generation in under 3 seconds — new diffusion models reset speed limits',
          fr: 'Génération d\'image en moins de 3s : nouveaux modèles diffusion',
          es: 'Imágenes en menos de 3s — nuevos modelos de difusión',
          hi: '3 सेकंड से कम में इमेज — नए डिफ्यूजन मॉडल सीमा तोड़ रहे',
          ar: 'إنشاء صور في أقل من ٣ ثوانٍ — نماذج انتشار جديدة تحطم السرعة',
        },
        summary: {
          zh: 'SD3 Turbo 和 Flux Schnell 让「写 prompt → 选 4 张 → 下载」整个流程压缩到 10 秒内。搭配 Korelyy 九宫格切图，你可以在咖啡店等餐的 5 分钟内产出一整套小红书配图。',
          en: 'SD3 Turbo and Flux Schnell compress the full "prompt → 4 picks → download" flow to under 10 seconds. Pair it with Korelyy Grid Cutter and you can ship a full social media image set in the 5 minutes while waiting for coffee.',
          fr: 'SD3 Turbo et Flux Schnell réduisent le flow complet "prompt → 4 images → téléchargement" à moins de 10s. Avec le Grid Cutter Korelyy, livre un jeu d\'images réseaux sociaux en 5min pendant ton café.',
          es: 'SD3 Turbo y Flux Schnell comprimen "prompt → 4 opciones → descarga" en menos de 10s. Combínalo con Korelyy Grid Cutter y prepara imágenes para redes en los 5min que esperas tu café.',
          hi: 'SD3 Turbo और Flux Schnell ने "प्रॉम्प्ट → 4 चुनें → डाउनलोड" को 10 सेकंड से कम कर दिया। Korelyy ग्रिड कटर के साथ मिलाकर, कॉफी के इंतज़ार में 5 मिनट में पूरा सोशल मीडिया सेट तैयार करें।',
          ar: 'يضغط SD3 Turbo و Flux Schnell "نص → ٤ اختيارات → تنزيل" إلى أقل من ١٠ ثوانٍ. اقترنه بـ Korelyy Grid Cutter وأعد مجموعة صور لمنصات التواصل في ٥ دقائق أثناء انتظار القهوة.',
        },
        relatedToolSlugs: ['grid-cutter', 'image-compressor'],
      },
      {
        id: '004-3',
        emoji: '📊',
        category: { en: 'Data', zh: '数据清理', fr: 'Données', es: 'Datos', hi: 'डेटा', ar: 'البيانات' },
        title: {
          zh: 'Excel 批量清理工具登上 Product Hunt 前 3',
          en: 'Batch Excel cleaning tool hits Top 3 on Product Hunt',
          fr: 'Outil nettoyage Excel batch Top 3 sur Product Hunt',
          es: 'Herramienta limpieza Excel batch Top 3 en Product Hunt',
          hi: 'एक्सेल बैच क्लीनिंग टूल Product Hunt पर टॉप 3',
          ar: 'أداة تنظيف Excel الجماعي في المركز الثالث على Product Hunt',
        },
        summary: {
          zh: '一家叫 CleanSheet 的工具本周冲到 PH 第 2——它的卖点很简单：「上传 10MB 脏 Excel → 自动去重、格式化、填缺失列 → 下载」全程不注册、不上传服务器。Korelyy 本周也已经收录了同类型的 Excel Data Cleaner。',
          en: 'A tool called CleanSheet hit #2 on PH this week — the pitch is simple: "Upload 10MB messy Excel → auto dedupe, format, fill missing cols → download". No signup, no server upload. Korelyy already has a same-category Excel Data Cleaner indexed this week.',
          fr: 'CleanSheet a atteint la #2 sur PH cette semaine — le pitch : "Upload 10Mo Excel sale → déduplique, formate, remplis → télécharge". Pas d\'inscription, pas d\'upload serveur. Korelyy a indexé un Excel Data Cleaner de même catégorie.',
          es: 'CleanSheet fue #2 en PH esta semana — el pitch: "Sube 10MB Excel sucio → dedupe, formatea, rellena → descarga". Sin registro, sin subir a servidor. Korelyy ya indexó un Excel Data Cleaner de la misma categoría.',
          hi: 'CleanSheet इस हफ्ते PH पर #2 पर पहुंचा — सीधी बात: "10MB गंदा Excel अपलोड → ऑटो डिड्यूप, फ़ॉर्मेट, खाली कॉलम भरें → डाउनलोड"। कोई साइनअप नहीं, कोई सर्वर अपलोड नहीं। Korelyy ने इसी कैटेगरी में Excel Data Cleaner इंडेक्स किया है।',
          ar: 'وصلت CleanSheet إلى المركز الثاني على Product Hunt هذا الأسبوع — الفكرة: "ارفع ملف Excel متسخ بحجم ١٠ ميجا → ازالة المكررات، تنسيق، ملء الأعمدة → تنزيل". بدون تسجيل، بدون رفع إلى خادم. قام Korelyy بفهرسة أداة تنظيف Excel مماثلة.',
        },
        relatedToolSlugs: ['excel-data-cleaner'],
      },
      {
        id: '004-4',
        emoji: '🧠',
        category: { en: 'Practice', zh: '极简实践', fr: 'Pratique', es: 'Práctica', hi: 'प्रैक्टिस', ar: 'تطبيق' },
        title: {
          zh: '3+1 笔记法：不用 Notion 也能搭 Second Brain',
          en: 'The 3+1 note method: build a Second Brain without Notion',
          fr: 'Méthode 3+1 : un Second Cerveau sans Notion',
          es: 'Método 3+1: crea tu Second Brain sin Notion',
          hi: '3+1 नोट मेथड: Notion के बिना Second Brain बनाएं',
          ar: 'طريقة ٣+١: اصنع عقلك الثاني بدون Notion',
        },
        summary: {
          zh: '本周极简实践：把所有信息只分成 4 类——📁 Project（正在做）、✨ Area（长期关注）、📚 Resource（参考资料）、📦 Archive（归档）。工具可以用 Obsidian、Apple Notes、甚至 Korelyy Notes，关键是分类要极简，搜索要秒出。',
          en: 'Minimalist practice this week: split all info into only 4 buckets — 📁 Project (active), ✨ Area (ongoing focus), 📚 Resource (reference), 📦 Archive (done). Tools can be Obsidian, Apple Notes, or Korelyy Notes; what matters is dead-simple taxonomy and instant search.',
          fr: 'Pratique minimaliste de la semaine : 4 seaux uniquement — 📁 Project (en cours), ✨ Area (focus long), 📚 Resource (référence), 📦 Archive (fini). Les outils importent peu : Obsidian, Apple Notes ou Korelyy Notes. La clé : taxonomie ultra-simple et recherche instantanée.',
          es: 'Práctica minimalista: solo 4 categorías — 📁 Project (activo), ✨ Area (foco), 📚 Resource (referencia), 📦 Archive (listo). Las herramientas son secundarias (Obsidian, Apple Notes, Korelyy Notes); clave: taxonomía sencilla y búsqueda instantánea.',
          hi: 'इस सप्ताह की मिनिमलिस्ट प्रैक्टिस: सभी जानकारी को सिर्फ 4 बकेट में बांटें — 📁 Project (चालू), ✨ Area (लंबा फोकस), 📚 Resource (रेफरेंस), 📦 Archive (पूर्ण)। टूल कोई भी हो (Obsidian, Apple Notes, Korelyy Notes), जरूरी है सुपर-सिंपल टैक्सोनॉमी और इंस्टंट सर्च।',
          ar: 'تطبيق بسيط هذا الأسبوع: قسم كل المعلومات إلى ٤ تصنيفات فقط — 📁 Project (نشط)، ✨ Area (تركيز طويل)، 📚 Resource (مرجع)، 📦 Archive (مكتمل). الأدوات ثانوية؛ المهم تصنيف بسيط للغاية وبحث فوري.',
        },
        relatedToolSlugs: ['obsidian', 'notion'],
      },
      {
        id: '004-5',
        emoji: '📬',
        category: { en: 'Community', zh: '社区动态', fr: 'Communauté', es: 'Comunidad', hi: 'कम्यूनिटी', ar: 'المجتمع' },
        title: {
          zh: 'Korelyy 本周新收录 12 款工具 + 邮箱订阅开通',
          en: 'Korelyy adds 12 new tools this week + newsletter launches',
          fr: 'Korelyy ajoute 12 outils + lancement de la newsletter',
          es: 'Korelyy añade 12 herramientas + lanzamiento newsletter',
          hi: 'Korelyy ने इस सप्ताह 12 नए टूल + न्यूज़लेटर लॉन्च किया',
          ar: 'يضيف Korelyy ١٢ أداة جديدة + إطلاق النشرة البريدية',
        },
        summary: {
          zh: 'Korelyy 本周新增 AI 工作流广场、Excel 数据清洗、九宫格切图 Pro 等 12 款工具。同时 News 页和邮箱订阅正式开通，每周日早上 8 点（北京时间）把本周 5 条最值得看的极简资讯发到你的邮箱。',
          en: 'Korelyy added 12 tools this week, including AI Workflow Square, Excel Data Cleaner, and Grid Cutter Pro. The News page and newsletter also go live today — every Sunday 8am Beijing time you will get exactly 5 handpicked, zero-fluff items in your inbox.',
          fr: 'Korelyy a ajouté 12 outils cette semaine : AI Workflow Square, Excel Data Cleaner, Grid Cutter Pro. La page News et la newsletter sont en ligne : tous les dimanches 8h (Pékin), tu reçois exactement 5 perles, aucune remplissage.',
          es: 'Korelyy sumó 12 herramientas esta semana: AI Workflow Square, Excel Data Cleaner, Grid Cutter Pro. Página News y newsletter lanzadas oficialmente: cada domingo 8h (Pekín), 5 perlas seleccionadas, cero relleno en tu bandeja.',
          hi: 'Korelyy ने इस सप्ताह 12 नए टूल जोड़े: AI वर्कफ़्लो स्क्वायर, Excel डेटा क्लीनर, ग्रिड कटर प्रो। News पेज और न्यूज़लेटर आज से लाइव: हर रविवार सुबह 8 बजे (बीजिंग टाइम) सिर्फ 5 सॉलिड, ज़ीरो-फ़्लफ आइटम आपकी इनबॉक्स में।',
          ar: 'أضاف Korelyy ١٢ أداة هذا الأسبوع: منصة سير عمل الذكاء الاصطناعي، منظف بيانات Excel، Grid Cutter Pro. تم إطلاق صفحة الأخبار والنشرة البريدية رسميًا: كل أحد الساعة ٨ صباحًا بتوقيت بكين، ٥ عناصر مختارة بعناية، صفري الحشو في صندوق بريدك.',
        },
      },
    ],
  },
  {
    slug: 'weekly-issue-003',
    issueNo: 3,
    publishedAt: '2026-06-28T00:00:00.000Z',
    coverEmoji: '🎨',
    title: {
      zh: '每周极简资讯 · 第3期',
      en: 'Korelyy Weekly Digest · Issue #003',
      fr: 'Hebdo Korelyy · Édition #003',
      es: 'Resumen Semanal Korelyy · Edición #003',
      hi: 'साप्ताहिक सार · अंक #003',
      ar: 'ملخص أسبوعي · العدد ٠٠٣',
    },
    subtitle: {
      zh: 'Figma AI 原生支持上线、Rust 工具链大爆发、以及别再收藏第 1001 个 Productivity App',
      en: 'Figma AI goes native, Rust tools explode, and please stop bookmarking the 1001st productivity app',
      fr: 'Figma IA en natif, explosion outils Rust, et arrête de bookmarker le 1001er app productivité',
      es: 'Figma IA nativo, explosión de herramientas Rust, y deja de guardar la app 1001 de productividad',
      hi: 'Figma AI नेटिव हो गया, Rust टूल्स में विस्फोट, और 1001वीं प्रोडक्टिविटी ऐप बुकमार्क करना बंद करें',
      ar: 'Figma AI يصبح أصليًا، انفجار أدوات Rust، وتوقف عن حفظ التطبيق رقم ١٠٠١ للإنتاجية',
    },
    description: {
      zh: '每周只看 5 条。本周重点：Figma 原生 AI 上线、Rust 写的效率工具刷屏、以及一个关于「不要再收藏工具」的反直觉建议。',
      en: 'Exactly 5 items per week. Highlights: Figma native AI ships, Rust-built productivity tools go viral, and a counter-intuitive tip about "stop bookmarking tools".',
      fr: 'Exactement 5 items. Points clés : Figma IA natif, outils Rust qui explosent, et un conseil contre-intuitif : arrête de bookmarker des outils.',
      es: 'Exactamente 5 ítems. Destacados: Figma nativo con IA, herramientas en Rust virales, y un consejo contra-intuitivo: deja de guardar herramientas.',
      hi: 'साप्ताहिक सिर्फ 5 आइटम। हाइलाइट्स: Figma नेटिव AI लॉन्च, Rust-बिल्ट टूल्स वायरल, और एक काउंटर-इंटुइटिव टिप: टूल बुकमार्क करना बंद करें।',
      ar: '٥ عناصر فقط في الأسبوع. أبرز النقاط: إطلاق الذكاء الاصطناعي الأصلي في Figma، أدوات Rust تنتشر، ونصيحة غير بديهية: توقف عن حفظ الأدوات.',
    },
    keywords: {
      en: ['Figma AI', 'Rust tools', 'minimalism', 'digital clutter', 'weekly tech'],
      zh: ['Figma AI', 'Rust工具', '极简主义', '数字囤积', '每周科技'],
      fr: ['Figma IA', 'outils Rust', 'minimalisme', 'encombrement numérique', 'hebdo tech'],
      es: ['Figma IA', 'herramientas Rust', 'minimalismo', 'desorden digital', 'tech semanal'],
      hi: ['Figma AI', 'Rust टूल्स', 'मिनिमलिज्म', 'डिजिटल क्लटर', 'साप्ताहिक टेक'],
      ar: ['Figma AI', 'أدوات Rust', 'بساطة', 'فوضى رقمية', 'تقنية أسبوعية'],
    },
    tags: [
      { en: 'Weekly', zh: '每周资讯', fr: 'Hebdo', es: 'Semanal', hi: 'साप्ताहिक', ar: 'أسبوعي' },
      { en: 'Design', zh: '设计', fr: 'Design', es: 'Diseño', hi: 'डिज़ाइन', ar: 'تصميم' },
      { en: 'Minimalism', zh: '极简', fr: 'Minimalisme', es: 'Minimalismo', hi: 'मिनिमल', ar: 'بساطة' },
    ],
    readingMinutes: { en: 4, zh: 3, fr: 4, es: 4, hi: 5, ar: 4 },
    items: [
      {
        id: '003-1',
        emoji: '🎨',
        category: { en: 'Design', zh: '设计工具', fr: 'Design', es: 'Diseño', hi: 'डिज़ाइन', ar: 'تصميم' },
        title: {
          zh: 'Figma 原生 AI 上线：3 秒内出矢量稿',
          en: 'Figma native AI ships — vector drafts in under 3 seconds',
          fr: 'Figma IA natif lancé — vectors en 3s',
          es: 'Figma nativo con IA lanzado — vectores en 3s',
          hi: 'Figma नेटिव AI लॉन्च — 3 सेकंड में वेक्टर ड्राफ्ट',
          ar: 'إطلاق Figma الأصلي بالذكاء الاصطناعي — رسوم متجهة في ٣ ثوانٍ',
        },
        summary: {
          zh: '等待了 18 个月，Figma 终于把「从 prompt 直接生矢量层」做进了产品核心。相比之前第三方插件的 30 秒 + 错位 10px，原生版本的对齐精度是 0.5px，而且直接在你的组件库上下文里生成——配色、栅格、组件命名规范全部自动一致。',
          en: 'After 18 months of waiting, Figma baked "prompt → vector layers" into the core product. Compared to 30s and 10px offsets from 3rd-party plugins, the native build hits 0.5px accuracy and generates inside your design system context — color, grid, naming conventions automatically consistent.',
          fr: 'Après 18 mois d\'attente, Figma a intégré "prompt → calques vecteurs" dans le cœur du produit. Contre 30s et 10px de décalage en plugins, la version native tient une précision de 0.5px et génère dans le contexte de ton design system — couleurs, grille, nommage tout aligné.',
          es: 'Tras 18 meses de espera, Figma metió "prompt → capas vectoriales" en el core. Frente a 30s y 10px de error con plugins, la nativa logra 0.5px de precisión y genera dentro de tu design system — colores, grid, nombres consistentes.',
          hi: '18 महीने का इंतज़ार खत्म: Figma ने "प्रॉम्प्ट → वेक्टर लेयर्स" को कोर में डाला। थर्ड-पार्टी प्लगइन के 30s + 10px ऑफ़सेट की बजाय, नेटिव वर्शन 0.5px एक्यूरेसी देता है और आपके डिजाइन सिस्टम के कॉन्टेक्स्ट में ही जनरेट करता है — कलर, ग्रिड, नेमिंग सब मैच।',
          ar: 'بعد ١٨ شهرًا من الانتظار، دمج Figma "نص → طبقات متجهة" في المنتج الأساسي. بدلاً من ٣٠ ثانية وانزياح ١٠ بكسل في الملحقات الخارجية، تحقق النسخة الأصلية دقة ٠٫٥ بكسل وتولد ضمن سياق نظام التصميم الخاص بك — ألوان وشبكة وتسميات متسقة تلقائيًا.',
        },
        relatedToolSlugs: ['figma', 'canva'],
      },
      {
        id: '003-2',
        emoji: '🦀',
        category: { en: 'Dev Tools', zh: '开发工具', fr: 'Dev', es: 'Dev', hi: 'डेव', ar: 'تطوير' },
        title: {
          zh: 'Rust 工具链爆发：本周 7 款工具上热榜',
          en: 'Rust tool chain explodes — 7 tools hit the charts this week',
          fr: 'Explosion outils Rust — 7 outils dans le top',
          es: 'Explosión de herramientas Rust — 7 en los rankings',
          hi: 'Rust टूल चेन विस्फोट — इस सप्ताह 7 टूल चार्ट पर',
          ar: 'انفجار سلسلة أدوات Rust — ٧ أدوات في القوائم هذا الأسبوع',
        },
        summary: {
          zh: 'ripgrep、fd、bat、fd 之后，本周又有 7 款 Rust 写的 CLI/桌面工具上榜。共同点：启动 < 10ms、零配置、比它的「Python/Node 前身」快 50～500 倍。Korelyy 已经全部收录，在 Dev Tools 分类里直接搜 Rust。',
          en: 'After ripgrep, fd, bat — another 7 Rust CLI/desktop apps hit the charts this week. Common thread: <10ms startup, zero config, 50–500× faster than the Python/Node predecessors they replace. All indexed on Korelyy, search "Rust" in Dev Tools.',
          fr: 'Après ripgrep, fd, bat — 7 nouveaux outils CLI/bureau en Rust dans le top. Point commun : démarrage <10ms, zéro config, 50–500× plus rapide que leurs prédécesseurs Python/Node. Tous indexés sur Korelyy, cherche "Rust" dans Dev Tools.',
          es: 'Después de ripgrep, fd, bat — otras 7 herramientas CLI/desktop en Rust entraron al top. Denominador común: <10ms al abrir, cero config, 50–500× más rápidas que las versiones Python/Node que reemplazan. Todas indexadas en Korelyy, busca "Rust".',
          hi: 'ripgrep, fd, bat के बाद इस सप्ताह 7 और Rust CLI/डेस्कटॉप टूल चार्ट पर। कॉमन थ्रेड: <10ms स्टार्टअप, ज़ीरो कॉन्फिग, Python/Node के पूर्ववर्तियों से 50–500× ज़्यादा फास्ट। Korelyy पर सब इंडेक्स्ड, Dev Tools में "Rust" सर्च करें।',
          ar: 'بعد ripgrep و fd و bat — دخلت ٧ أدوات CLI و سطح مكتب أخرى مكتوبة بـ Rust إلى القوائم. القاسم المشترك: أقل من ١٠ ملي ثانية للإقلاع، إعدادات صفري، أسرع ٥٠ إلى ٥٠٠ مرة من نظيراتها Python/Node. كلها مفهرسة في Korelyy، ابحث بـ "Rust".',
        },
        relatedToolSlugs: ['regex-tester', 'json-formatter'],
      },
      {
        id: '003-3',
        emoji: '🧘',
        category: { en: 'Minimalism', zh: '极简思维', fr: 'Minimalisme', es: 'Minimalismo', hi: 'मिनिमल', ar: 'بساطة' },
        title: {
          zh: '反直觉：别再收藏第 1001 个效率 App',
          en: 'Counter-intuitive: stop bookmarking the 1001st productivity app',
          fr: 'Contre-intuitif : arrête le 1001er bookmark app',
          es: 'Contra-intuitivo: deja de guardar la app 1001',
          hi: 'काउंटर-इंटुइटिव: 1001वीं प्रोडक्टिविटी ऐप बुकमार्क करना बंद करें',
          ar: 'غير بديهي: توقف عن حفظ التطبيق رقم ١٠٠١ للإنتاجية',
        },
        summary: {
          zh: '本周一个 2.4k 赞的帖子说：「你收藏夹里的 800 个工具，真正每周打开的不超过 5 个」。Korelyy 团队的内部原则是：每个分类只留 3 个主力工具 + 1 个备选。想试新工具？先在 Korelyy 用完、觉得真能替换旧工具，再加入主力。',
          en: 'A 2.4k-upvote post this week put it plainly: "You bookmarked 800 tools; you open fewer than 5 every week." Our internal rule at Korelyy: only 3 primary tools + 1 backup per category. Want to try a new one? Use it inside Korelyy first — only promote to primary when it actually replaces the old.',
          fr: 'Un post à 2,4k upvotes cette semaine : "Tu as bookmarké 800 outils ; tu en ouvres moins de 5 par semaine." Notre règle interne Korelyy : 3 outils primaires + 1 backup par catégorie. Veux-tu en tester un nouveau ? D\'abord utilise-le sur Korelyy. Ne le promeus en primaire que s\'il remplace vraiment l\'ancien.',
          es: 'Un post con 2,4k votos esta semana: "Guardaste 800 herramientas, abres menos de 5 a la semana." Nuestra regla interna en Korelyy: 3 herramientas primarias + 1 backup por categoría. ¿Quieres probar una nueva? Úsala primero en Korelyy — solo promociónala cuando reemplace a la vieja.',
          hi: 'इस सप्ताह 2,4k अपवोट वाला एक पोस्ट स्पष्ट बोला: "तुमने 800 टूल बुकमार्क किए; प्रति सप्ताह 5 से कम ही खोलते हो।" Korelyy में हमारा आंतरिक नियम: प्रति कैटेगरी 3 प्राइमरी + 1 बैकअप। नया टूल ट्राय करना है? पहले Korelyy पर इस्तेमाल करें — सच में पुराना रिप्लेस कर पाए, तभी प्राइमरी बनाएं।',
          ar: 'مشاركة حصلت على ٢٫٤ ألف تصويت هذا الأسبوع: "لقد حفظت ٨٠٠ أداة؛ ولا تفتح أقل من ٥ كل أسبوع". قاعدتنا الداخلية في Korelyy: ٣ أدوات أساسية + ١ احتياطي لكل فئة. تريد تجربة جديدة؟ استخدمها أولاً في Korelyy — لا ترقِّها إلى أساسية إلا إذا استبدلت القديمة بالفعل.',
        },
      },
      {
        id: '003-4',
        emoji: '🔐',
        category: { en: 'Privacy', zh: '隐私安全', fr: 'Privacy', es: 'Privacidad', hi: 'प्राइवेसी', ar: 'خصوصية' },
        title: {
          zh: '浏览器端纯前端工具成了新刚需',
          en: 'Browser-only, pure-frontend tools become the new baseline',
          fr: 'Les outils pure-frontend deviennent la baseline',
          es: 'Las herramientas solo-frontend son la nueva base',
          hi: 'ब्राउज़र-ओनली, प्योर-फ्रंटएंड टूल न्यू बेसलाइन बन गए',
          ar: 'الأدوات التي تعمل بالكامل في المتصفح أصبحت المعيار الجديد',
        },
        summary: {
          zh: '本周有 3 家公司因为「把用户 PDF/Excel 传到服务器处理」被 GDPR 处罚。Korelyy 的 36 款内部工具全部走纯前端路线——文件不上传、数据不落地。你在 Korelyy 看到带「🛡️ 本地处理」徽章的工具，意味着它默认就符合 GDPR。',
          en: 'Three companies got GDPR fines this week for "uploading user PDF/Excel to server for processing." All 36 internal Korelyy tools run pure-frontend — no upload, no storage persist. Any tool you see on Korelyy with the 🛡️ "Local-Only" badge means GDPR-compliant by default.',
          fr: 'Trois entreprises ont été amendées GDPR cette semaine pour "upload PDF/Excel vers serveur pour traitement". Les 36 outils internes Korelyy tournent en pure-frontend — aucun upload, aucun stockage persist. Tout outil Korelyy avec le badge 🛡️ "Local uniquement" = GDPR conforme par défaut.',
          es: 'Tres empresas recibieron multas GDPR esta semana por "subir PDF/Excel de usuarios al servidor para procesar". Las 36 herramientas internas de Korelyy corren pure-frontend — cero subida, cero persistencia. Cualquier herramienta con el badge 🛡️ "Solo local" = GDPR ok por defecto.',
          hi: 'इस सप्ताह 3 कंपनियों को GDPR के तहत जुर्माना लगा क्योंकि वे "यूजर के PDF/Excel को सर्वर पर अपलोड करके प्रोसेस करती थीं"। Korelyy के सभी 36 आंतरिक टूल प्योर-फ्रंटएंड हैं — कोई अपलोड नहीं, कोई स्टोरेज नहीं। Korelyy पर जिस भी टूल पर 🛡️ "लोकल-ओनली" बैज दिखे, वह डिफ़ॉल्ट से GDPR कंप्लायंट है।',
          ar: 'غرَّمت ثلاث شركات بموجب قانون GDPR هذا الأسبوع لـ "رفع ملفات PDF/Excel المستخدمين إلى الخادم للمعالجة". تعمل جميع الأدوات الداخلية البالغ عددها ٣٦ في Korelyy بالكامل في الواجهة الأمامية — لا رفع، لا تخزين دائم. أي أداة تحمل شارة 🛡️ "محليًا فقط" = متوافقة مع GDPR افتراضيًا.',
        },
        relatedToolSlugs: ['pdf-merger', 'image-compressor', 'base64-tool'],
      },
      {
        id: '003-5',
        emoji: '🗞️',
        category: { en: 'Korelyy', zh: '平台动态', fr: 'Korelyy', es: 'Korelyy', hi: 'Korelyy', ar: 'Korelyy' },
        title: {
          zh: 'Korelyy 工具聚合数量突破 1000+，工具详情页 SEO 升级',
          en: 'Korelyy passes 1000+ indexed tools, tool detail SEO upgraded',
          fr: 'Korelyy dépasse 1000+ outils, SEO pages outil upgrade',
          es: 'Korelyy pasa 1000+ herramientas indexadas, SEO upgrade',
          hi: 'Korelyy ने 1000+ इंडेक्स्ड टूल पार कर लिया, टूल डिटेल SEO अपग्रेड',
          ar: 'يتجاوز Korelyy ١٠٠٠+ أداة مفهرسة، وترقية SEO صفحات الأدوات',
        },
        summary: {
          zh: '本周 Korelyy 收录工具数正式突破 1000。同时工具详情页加上了 SoftwareApplication 结构化数据 + hreflang 6 语言标签，Google 搜索里的展示位平均上升了 3.7 位。',
          en: 'This week Korelyy officially crossed 1000 indexed tools. We also shipped SoftwareApplication structured data + 6-language hreflang tags on every tool detail page — average Google search position went up by 3.7 slots.',
          fr: 'Cette semaine Korelyy a officiellement dépassé les 1000 outils indexés. On a aussi ajouté du structured data SoftwareApplication + des tags hreflang 6 langues sur chaque page outil — position Google moyenne en hausse de 3,7 places.',
          es: 'Esta semana Korelyy cruzó oficialmente las 1000 herramientas indexadas. También sumamos structured data SoftwareApplication + hreflang 6 idiomas en cada página de herramienta — la posición media en Google subió 3,7 puestos.',
          hi: 'इस सप्ताह Korelyy ने 1000+ इंडेक्स्ड टूल का आंकड़ा पार कर लिया। हर टूल डिटेल पेज पर SoftwareApplication structured data + 6-भाषा hreflang टैग भी जोड़ें — Google सर्च में औसत पोजीशन 3.7 स्थान ऊपर आ गई।',
          ar: 'تجاوز Korelyy هذا الأسبوع رسميًا ١٠٠٠+ أداة مفهرسة. أضفنا أيضًا بيانات منظمة SoftwareApplication + علامات hreflang لـ ٦ لغات في كل صفحة أداة — ارتفع متوسط المركز في نتائج Google بمعدل ٣٫٧ مراكز.',
        },
      },
    ],
  },
  {
    slug: 'weekly-issue-002',
    issueNo: 2,
    publishedAt: '2026-06-21T00:00:00.000Z',
    coverEmoji: '⚡',
    title: {
      zh: '每周极简资讯 · 第2期',
      en: 'Korelyy Weekly Digest · Issue #002',
      fr: 'Hebdo Korelyy · Édition #002',
      es: 'Resumen Semanal Korelyy · Edición #002',
      hi: 'साप्ताहिक सार · अंक #002',
      ar: 'ملخص أسبوعي · العدد ٠٠٢',
    },
    subtitle: {
      zh: 'PDF 开源工具逆袭、开源大模型闭源化、以及「为什么我把 Notion 换成了纯文本」',
      en: 'Open-source PDF tools make a comeback, open LLM companies go closed, and "Why I switched from Notion to plain text"',
      fr: 'Retour des outils PDF open-source, LLM open qui se ferment, et "Pourquoi j\'ai quitté Notion pour du texte brut"',
      es: 'Vuelven las herramientas PDF open-source, LLMs abiertos se cierran, y "Por qué cambié Notion por texto plano"',
      hi: 'PDF ओपन-सोर्स टूल्स की वापसी, ओपन LLM कंपनियां क्लोज हो रही, और "मैंने Notion को प्लेन टेक्स्ट से क्यों बदला"',
      ar: 'عودة أدوات PDF مفتوحة المصدر، شركات LLM المفتوحة تغلق أبوابها، و"لماذا استبدلت Notion بنص عادي"',
    },
    description: {
      zh: '每周 5 条。本周：PDF 开源工具再次出现在热榜、开源大模型公司纷纷加限制、一位工程师把 Second Brain 从 Notion 搬到了纯文本文件夹。',
      en: '5 items. This week: open-source PDF tools back on top charts, open LLM companies add usage limits, and an engineer moved his Second Brain from Notion to plain text folders.',
      fr: '5 items. Cette semaine : outils PDF open-source de retour en haut, LLM open qui ferment peu à peu, et un dev qui a déplacé son Second Brain Notion vers des dossiers texte brut.',
      es: '5 ítems. Esta semana: herramientas PDF open-source vuelven al top, empresas LLM abiertas cierran restricciones, y un ingeniero mudó su Second Brain de Notion a carpetas de texto.',
      hi: '5 आइटम। इस सप्ताह: PDF ओपन-सोर्स टूल्स फिर से टॉप पर, ओपन LLM कंपनियां रेस्ट्रिक्शन जोड़ रहीं, और एक इंजीनियर ने अपना Second Brain Notion से प्लेन टेक्स्ट फ़ोल्डर में ले जाया।',
      ar: '٥ عناصر. هذا الأسبوع: عودة أدوات PDF مفتوحة المصدر إلى القمة، شركات نماذج اللغة الكبيرة المفتوحة تفرض قيودًا، ومهندس ينقل عقلك الثاني من Notion إلى مجلدات نص عادي.',
    },
    keywords: {
      en: ['PDF tools', 'open source', 'LLM', 'plain text', 'second brain'],
      zh: ['PDF工具', '开源', '大模型', '纯文本', '第二大脑'],
      fr: ['outils PDF', 'open source', 'LLM', 'texte brut', 'second cerveau'],
      es: ['herramientas PDF', 'código abierto', 'LLM', 'texto plano', 'segundo cerebro'],
      hi: ['PDF टूल्स', 'ओपन सोर्स', 'LLM', 'प्लेन टेक्स्ट', 'सेकंड ब्रेन'],
      ar: ['أدوات PDF', 'مفتوح المصدر', 'نماذج لغة', 'نص عادي', 'عقل ثاني'],
    },
    tags: [
      { en: 'Weekly', zh: '每周资讯', fr: 'Hebdo', es: 'Semanal', hi: 'साप्ताहिक', ar: 'أسبوعي' },
      { en: 'Open Source', zh: '开源', fr: 'Open Source', es: 'Código Abierto', hi: 'ओपन सोर्स', ar: 'مفتوح المصدر' },
      { en: 'PDF', zh: 'PDF', fr: 'PDF', es: 'PDF', hi: 'PDF', ar: 'PDF' },
    ],
    readingMinutes: { en: 4, zh: 3, fr: 4, es: 4, hi: 5, ar: 4 },
    items: [
      {
        id: '002-1',
        emoji: '📄',
        category: { en: 'PDF Tools', zh: 'PDF 工具', fr: 'Outils PDF', es: 'Herramientas PDF', hi: 'PDF टूल्स', ar: 'أدوات PDF' },
        title: {
          zh: '开源 PDF 工具热榜回归：不只是替代 Adobe',
          en: 'Open-source PDF tools come back — more than just Adobe alternatives',
          fr: 'Retour outils PDF open-source — plus que des alternatives Adobe',
          es: 'Vuelven las herramientas PDF de código abierto — más que alternativas a Adobe',
          hi: 'ओपन-सोर्स PDF टूल्स वापसी — सिर्फ Adobe विकल्प नहीं',
          ar: 'عودة أدوات PDF مفتوحة المصدر — أكثر من مجرد بدائل لـ Adobe',
        },
        summary: {
          zh: '过去被 Adobe 云服务「养懒」的 PDF 处理需求，本周集体向开源工具迁移：合并、拆分、压缩、OCR 四大场景，开源方案在精度上已经追平甚至反超，而且不强制登录、不限文件大小。Korelyy 首页「文档工具」分类本周访问量增长 210%。',
          en: 'Users got "soft" on Adobe cloud PDF — this week they migrated en masse to open-source tools. For merge, split, compress, OCR, open solutions now match or beat Adobe on accuracy, plus no forced login, no file size caps. Korelyy Document Tools category grew 210% in weekly visits.',
          fr: 'Les utilisateurs se sont ramollis avec le PDF cloud Adobe — cette semaine ils migrent massivement vers l\'open source. Fusion, split, compression, OCR : les solutions open égalent ou dépassent Adobe en précision, sans compte obligatoire, sans limite de taille. Catégorie Documents Korelyy en hausse de 210%.',
          es: 'Los usuarios se acostumbraron demasiado al PDF en la nube de Adobe — esta semana migran en masa a herramientas open source. Fusionar, dividir, comprimir, OCR: las soluciones abiertas igualan o superan a Adobe en precisión, sin registro obligatorio, sin límites de tamaño. Categoría Documentos en Korelyy creció 210%.',
          hi: 'यूज़र्स Adobe क्लाउड PDF पर "नरम" पड़े गए थे — इस सप्ताह बड़ी संख्या में ओपन-सोर्स टूल्स पर माइग्रेट हुए। मर्ज, स्प्लिट, कंप्रेस, OCR — इन चारों में ओपन सॉल्यूशन्स अब एक्यूरेसी में Adobe से बराबर या बेहतर हैं, साथ ही कोई फ़ोर्स्ड लॉगिन, कोई फाइल साइज़ कैप नहीं। Korelyy डॉक्यूमेंट्स कैटेगरी में 210% का उछाल।',
          ar: 'اعتاد المستخدمون على سهولة خدمات Adobe السحابية للـ PDF — هذا الأسبوع هاجروا جماعيًا إلى أدوات مفتوحة المصدر. في الدمج والتقسيم والضغط والتعرف الضوئي على الأحرف: الحلول المفتوحة تساوي أو تتفوق على Adobe في الدقة، بدون تسجيل إجباري، بدون حدود لحجم الملفات. ارتفع زيارات فئة المستندات في Korelyy بنسبة ٢١٠٪.',
        },
        relatedToolSlugs: ['pdf-merger'],
      },
      {
        id: '002-2',
        emoji: '🔒',
        category: { en: 'LLM', zh: '大模型动态', fr: 'LLM', es: 'LLM', hi: 'एलएलएम', ar: 'نماذج لغة' },
        title: {
          zh: '开源大模型集体「闭源化」？别急，本地推理已经追上来了',
          en: 'Open LLMs go closed-source one by one? Don\'t panic — local inference caught up',
          fr: 'Les LLM open ferment un par un ? Pas de panique — l\'inférence locale a rattrapé',
          es: '¿LLMs abiertos se cierran uno a uno? No te asustes — la inferencia local ya alcanzó',
          hi: 'ओपन LLM एक-एक करके क्लोज हो रहे? पैनिक मत — लोकल इन्फरेंस ने पकड़ ली है',
          ar: 'نماذج لغة مفتوحة تغلق واحدة تلو الأخرى؟ لا تقلق — الاستدلال المحلي لحق بالركب',
        },
        summary: {
          zh: '本周 3 家主打「Open Source LLM」的公司先后宣布商用限制。结果：本地推理框架（llama.cpp、Ollama）周下载量翻倍，Geekbench 也把「本地 LLM Benchmark」加入了下一代基准。结论：32GB 内存的机器跑 70B 级别的模型已经是可选项。',
          en: 'Three "Open Source LLM"-first companies rolled out commercial restrictions this week. Result: local inference frameworks (llama.cpp, Ollama) doubled weekly downloads, and Geekbench will add "Local LLM Benchmark" in the next release. Takeaway: running 70B-class models on 32GB RAM machines is now a legitimate option.',
          fr: 'Trois entreprises "LLM open-source en premier" ont annoncé des restrictions commerciales cette semaine. Bilan : frameworks d\'inférence locaux (llama.cpp, Ollama) doublent de téléchargements hebdo, et Geekbench ajoute un "Benchmark LLM Local" à la prochaine version. Conclusion : un 70B sur 32Go RAM, c\'est sérieux.',
          es: 'Tres empresas primero-en-LLM abierto anunciaron restricciones comerciales esta semana. Resultado: frameworks de inferencia local (llama.cpp, Ollama) duplicaron descargas semanales, y Geekbench incluirá "Benchmark LLM Local" en su próxima entrega. Conclusión: correr un modelo clase 70B en 32GB RAM es ya una opción válida.',
          hi: 'तीन "ओपन-सोर्स LLM फर्स्ट" कंपनियों ने इस सप्ताह कमर्शियल रेस्ट्रिक्शन ऐलान किए। नतीजा: लोकल इन्फरेंस फ्रेमवर्क (llama.cpp, Ollama) ने साप्ताहिक डाउनलोड डबल कर लिए, और Geekbench अपने अगले रिलीज़ में "लोकल LLM बेंचमार्क" जोड़ने वाला है। बॉटम लाइन: 32GB RAM वाली मशीन पर 70B-क्लास मॉडल चलाना अब लेगिटिमेट ऑप्शन है।',
          ar: 'أعلنت ثلاث شركات رائدة في نماذج اللغة المفتوحة عن قيود تجارية هذا الأسبوع. النتيجة: ضاعفت أطر عمل الاستدلال المحلي (llama.cpp و Ollama) عمليات التنزيل الأسبوعية، وستضيف Geekbench "المؤشر القياسي المحلي لنماذج اللغة" في الإصدار القادم. النتيجة: تشغيل نماذج من فئة ٧٠ مليار معامل على أجهزة بذاكرة ٣٢ جيجا أصبح خيارًا حقيقيًا.',
        },
      },
      {
        id: '002-3',
        emoji: '📝',
        category: { en: 'Practice', zh: '极简实践', fr: 'Pratique', es: 'Práctica', hi: 'प्रैक्टिस', ar: 'تطبيق' },
        title: {
          zh: '一位工程师把 Notion 换成了纯文本文件夹',
          en: 'An engineer ditched Notion for a plain text folder tree',
          fr: 'Un dev a quitté Notion pour des dossiers texte brut',
          es: 'Un ingeniero dejó Notion por un árbol de carpetas de texto',
          hi: 'एक इंजीनियर ने Notion को छोड़कर प्लेन टेक्स्ट फ़ोल्डर ट्री ले लिया',
          ar: 'مهندس يهجر Notion ليتجه إلى شجرة مجلدات نص عادي',
        },
        summary: {
          zh: 'Hacker News 本周热帖：一位工程师用 /notes 文件夹 + .md 文件 + VS Code 替换了 Notion。核心收益不是速度，是「锁定」——5 年后这些文件依然可以被任何文本编辑器打开，而 Notion 导出功能的「格式损失」已经成了公开的坑。',
          en: 'A top Hacker News post this week: an engineer replaced Notion with a /notes folder + .md files + VS Code. The core gain wasn\'t speed — it was "future lock-in proof": 5 years from now those files open in any editor, whereas Notion export "format loss" is a well-documented public issue.',
          fr: 'Un post en haut de Hacker News : un dev a remplacé Notion par un dossier /notes + .md + VS Code. Pas le gain de vitesse, mais une "garantie anti-verrouillage" : dans 5 ans ces fichiers s\'ouvrent dans n\'importe quel éditeur, pendant que l\'export Notion et sa perte de format sont un bug public bien documenté.',
          es: 'Un post top en Hacker News: un ingeniero reemplazó Notion con carpeta /notes + .md + VS Code. El gancho no fue velocidad sino "garantía anti-enganche": en 5 años esos archivos abren en cualquier editor, mientras que la pérdida de formato en export de Notion es un problema público bien documentado.',
          hi: 'इस सप्ताह Hacker News पर टॉप पोस्ट: एक इंजीनियर ने Notion को /notes फ़ोल्डर + .md फ़ाइलें + VS Code से बदल दिया। मुख्य फायदा स्पीड नहीं, बल्कि "फ्यूचर लॉक-इन प्रूफ" है: 5 साल बाद भी ये फ़ाइलें किसी भी एडिटर में खुलेंगी, जबकि Notion एक्सपोर्ट का "फ़ॉर्मेट लॉस" एक पब्लिक डॉक्यूमेंटेड इश्यू है।',
          ar: 'مشاركة رائدة في Hacker News هذا الأسبوع: استبدل مهندس Notion بمجلد /notes + ملفات .md + VS Code. المكسب الأساسي لم يكن السرعة بل "الضمان ضد الحبس المستقبلي": بعد ٥ سنوات ستفتح هذه الملفات في أي محرر، في حين أن "فقدان التنسيق" عند التصدير من Notion مشكلة عامة موثقة جيدًا.',
        },
        relatedToolSlugs: ['obsidian', 'notion', 'evernote'],
      },
      {
        id: '002-4',
        emoji: '🧩',
        category: { en: 'Tool Pick', zh: '本周工具', fr: 'Coup de coeur', es: 'Elegida', hi: 'इस सप्ताह का टूल', ar: 'اختيار الأسبوع' },
        title: {
          zh: '本周 3 款新工具：只选「解决一个痛点」的',
          en: '3 new tools this week — only picks that solve one pain well',
          fr: '3 nouveaux outils — seulement ceux qui résolvent une douleur',
          es: '3 herramientas nuevas — solo las que resuelven bien un dolor',
          hi: 'इस सप्ताह के 3 नए टूल — सिर्फ वही जो एक पेन को अच्छे से सॉल्व करें',
          ar: '٣ أدوات جديدة هذا الأسبوع — فقط التي تحل مشكلة واحدة بشكل ممتاز',
        },
        summary: {
          zh: '严格标准下本周只留下 3 款：① 一个给视频自动加双语字幕的浏览器端工具（本地处理）；② 把任意长文压缩成 5 句 TL;DR 的纯前端脚本；③ 对比 10 种 AI 生成模型答案并排输出的网站。Korelyy 均已收录，在首页搜索「weekly 002」直达。',
          en: 'Under strict filter only 3 new tools made the cut this week: ① Browser-side bilingual subtitle generator for video (local-only). ② Pure-frontend script that squashes any longform into a 5-sentence TL;DR. ③ Side-by-side answer comparison across 10 AI generation models. All indexed on Korelyy — search "weekly 002" on the homepage.',
          fr: 'Filtre ultra-serré, seulement 3 nouveaux outils cette semaine : ① Générateur de sous-titres bilingues dans le navigateur (local uniquement). ② Script pure front qui transforme un texte long en 5 phrases TL;DR. ③ Comparaison de réponses côte à côte sur 10 modèles IA générative. Tous sur Korelyy — cherche "weekly 002".',
          es: 'Filtro estricto, solo 3 herramientas nuevas esta semana: ① Generador de subtítulos bilingüe en el navegador (solo local). ② Script front-end que comprime texto largo a 5 frases TL;DR. ③ Comparativa lado a lado de respuestas entre 10 modelos IA generativa. Todas en Korelyy — busca "weekly 002".',
          hi: 'स्ट्रिक्ट फिल्टर के तहत इस सप्ताह सिर्फ 3 नए टूल ही रह पाए: ① वीडियो के लिए द्विभाषी सबटाइटल जनरेटर (ब्राउज़र साइड, लोकल-ओनली)। ② प्योर-फ्रंटएंड स्क्रिप्ट जो कोई भी लॉग आर्टिकल को 5 वाक्यों के TL;DR में स्क्वैश कर दे। ③ 10 AI जनरेशन मॉडल्स के जवाबों का साइड-बाय-साइड कंपेरिजन। सब Korelyy पर इंडेक्स्ड — होमपेज पर "weekly 002" सर्च करें।',
          ar: 'تحت تصفية صارمة، مرت ٣ أدوات جديدة فقط هذا الأسبوع: ① مولد ترجمة ثنائية اللغة في المتصفح (محليًا فقط). ② سكريبت يعمل بالكامل في الواجهة الأمامية يختصر أي نص طويل إلى ٥ جمل TL;DR. ③ مقارنة إجابات جنبًا إلى جنب عبر ١٠ نماذج ذكاء اصطناعي توليدي. جميعها مفهرسة في Korelyy — ابحث بـ "weekly 002".',
        },
      },
      {
        id: '002-5',
        emoji: '💡',
        category: { en: 'Editorial', zh: '编辑视角', fr: 'Édito', es: 'Editorial', hi: 'संपादकीय', ar: 'تحريري' },
        title: {
          zh: 'Korelyy 立场：我们只做「工具的百科全书」，不做 AI 聊天入口',
          en: 'Korelyy stance: we will only be "the encyclopedia of tools", never an AI chat portal',
          fr: 'Position Korelyy : on reste "l\'encyclopédie des outils", jamais un portail chat IA',
          es: 'Postura de Korelyy: seremos solo "la enciclopedia de herramientas", nunca un portal de chat IA',
          hi: 'Korelyy का स्टैंस: हम सिर्फ "टूल्स की एनसाइक्लोपीडिया" रहेंगे, कभी AI चैट पोर्टल नहीं',
          ar: 'موقف Korelyy: سنظل "موسوعة الأدوات" فقط، ولن نكون أبدًا بوابة دردشة ذكاء اصطناعي',
        },
        summary: {
          zh: '本周很多产品都加了一个硕大的聊天框，但 Korelyy 不打算跟风。我们相信用户来 Korelyy 的核心诉求是「找到合适的工具」而不是「和 AI 对话」。未来的 Newsletter 也会严格坚持这个标准——每条资讯都必须指向一个可执行的工具或方法，不写空洞的分析。',
          en: 'A lot of products added a giant chat box this week, but Korelyy isn\'t following. We believe users come to Korelyy for "finding the right tool" — not "chatting with AI." Future Newsletters will uphold the same rule: every item must point to an actionable tool or method. No fluff analysis, ever.',
          fr: 'Beaucoup de produits ont ajouté une énorme boîte de chat cette semaine. Korelyy ne suit pas. Notre conviction : les utilisateurs viennent chez Korelyy pour "trouver le bon outil" — pas pour "chatter avec une IA". Les futures newsletters gardent cette règle : chaque item pointe vers un outil ou une méthode actionnable. Remplissage = banni.',
          es: 'Muchos productos sumaron una caja de chat gigante esta semana; Korelyy no va con la corriente. Creemos que los usuarios vienen a Korelyy a "encontrar la herramienta correcta" — no a "charlar con IA". Próximos boletines se mantienen en la misma regla: cada ítem debe apuntar a una herramienta o método accionable. Nada de relleno.',
          hi: 'इस सप्ताह बहुत से प्रोडक्ट्स ने एक बड़ा सा चैट बॉक्स जोड़ा है, लेकिन Korely्य बीपी नहीं लगा रहा। हमारा मानना है कि यूज़र्स Korelyy पर "सही टूल ढूंढने" आते हैं — "AI से बात करने" नहीं। भविष्य की न्यूज़लेटर्स भी यही रूल फॉलो करेंगी: हर आइटम एक actional टूल या मेथड की तरफ इशारा करेगी। कभी भी खोखला एनालिसिस नहीं।',
          ar: 'أضافت العديد من المنتجات مربع دردشة ضخم هذا الأسبوع، لكن Korelyy لن يتبع التيار. نؤمن أن المستخدمين يأتون إلى Korelyy لـ "إيجاد الأداة المناسبة" — لا لـ "الدردشة مع ذكاء اصطناعي". ستلتزم النشرات البريدية المستقبلية بنفس القاعدة: كل عنصر يجب أن يشير إلى أداة أو طريقة قابلة للتنفيذ. لا تحليلات فارغة، أبدًا.',
        },
      },
    ],
  },
  {
    slug: 'weekly-issue-001',
    issueNo: 1,
    publishedAt: '2026-06-14T00:00:00.000Z',
    coverEmoji: '📰',
    title: {
      zh: '每周极简资讯 · 第1期（创刊号）',
      en: 'Korelyy Weekly Digest · Issue #001 (Premiere)',
      fr: 'Hebdo Korelyy · Édition #001 (Lancement)',
      es: 'Resumen Semanal Korelyy · Edición #001 (Estreno)',
      hi: 'साप्ताहिक सार · अंक #001 (प्रथम अंक)',
      ar: 'ملخص أسبوعي · العدد ٠٠١ (العدد الأول)',
    },
    subtitle: {
      zh: 'Korelyy 正式上线 6 语言、工作流广场 Beta、以及给独立开发者的 3 个免费流量策略',
      en: 'Korelyy ships 6-language support, Workflow Square Beta, and 3 free traffic strategies for indie devs',
      fr: 'Korelyy lance 6 langues, Workflow Square Bêta, et 3 stratégies trafic gratuites pour devs indie',
      es: 'Korelyy estrena soporte 6 idiomas, Workflow Square Beta, y 3 estrategias de tráfico gratis para devs indie',
      hi: 'Korelyy लॉन्च 6-भाषा सपोर्ट, वर्कफ़्लो स्क्वायर बीटा, और इंडी डेव्स के लिए 3 फ्री ट्रैफ़िक स्ट्रैटेजी',
      ar: 'إطلاق Korelyy بدعم ٦ لغات، Workflow Square بيتا، و٣ استراتيجيات حركة مرورية مجانية للمطورين المستقلين',
    },
    description: {
      zh: '创刊号！本周 5 条核心资讯：Korelyy 6 语言正式发布、AI 工作流广场 Beta 开放、独立开发者不用花钱做增长的 3 个真实案例。',
      en: 'Premiere issue! 5 core items this week: Korelyy 6-language official launch, AI Workflow Square Beta opens, and 3 real indie-dev zero-budget growth stories.',
      fr: 'Numéro de lancement ! 5 items cette semaine : Korelyy en 6 langues officiel, Workflow Square Bêta ouvert, et 3 vraies histoires de croissance zéro budget pour devs indie.',
      es: '¡Número de estreno! 5 ítems esta semana: Korelyy oficial en 6 idiomas, Workflow Square Beta abierto, y 3 historias reales de crecimiento sin presupuesto para devs indie.',
      hi: 'प्रथम अंक! इस सप्ताह 5 कोर आइटम: Korelyy का 6-भाषा में ऑफिशियल लॉन्च, AI वर्कफ़्लो स्क्वायर बीटा खुल गया, और इंडी डेव्स के लिए ज़ीरो-बजट ग्रोथ की 3 असल कहानियां।',
      ar: 'العدد الأول! ٥ عناصر أساسية هذا الأسبوع: إطلاق Korelyy الرسمي ب٦ لغات، افتتاح Workflow Square بيتا، و٣ قصص نمو حقيقية بدون ميزانية للمطورين المستقلين.',
    },
    keywords: {
      en: ['launch issue', '6 languages', 'workflow', 'indie devs', 'growth hacking'],
      zh: ['创刊号', '6语言', '工作流', '独立开发者', '增长'],
      fr: ['numéro lancement', '6 langues', 'workflow', 'devs indie', 'croissance'],
      es: ['número estreno', '6 idiomas', 'workflow', 'devs indie', 'crecimiento'],
      hi: ['लॉन्च इश्यू', '6 भाषाएं', 'वर्कफ़्लो', 'इंडी डेव्स', 'ग्रोथ'],
      ar: ['عدد الإطلاق', '٦ لغات', 'سير عمل', 'مطورون مستقلون', 'نمو'],
    },
    tags: [
      { en: 'Weekly', zh: '每周资讯', fr: 'Hebdo', es: 'Semanal', hi: 'साप्ताहिक', ar: 'أسبوعي' },
      { en: 'Launch', zh: '上线', fr: 'Lancement', es: 'Lanzamiento', hi: 'लॉन्च', ar: 'إطلاق' },
      { en: 'Indie Dev', zh: '独立开发', fr: 'Indie Dev', es: 'Indie Dev', hi: 'इंडी डेव', ar: 'مطور مستقل' },
    ],
    readingMinutes: { en: 4, zh: 3, fr: 4, es: 4, hi: 5, ar: 4 },
    editorPick: 'workflow-canvas',
    items: [
      {
        id: '001-1',
        emoji: '🌍',
        category: { en: 'Product', zh: '产品动态', fr: 'Produit', es: 'Producto', hi: 'प्रोडक्ट', ar: 'منتج' },
        title: {
          zh: 'Korelyy 正式支持 6 种语言：英/中/法/西/印地/阿拉伯',
          en: 'Korelyy goes 6-language: EN / ZH / FR / ES / HI / AR',
          fr: 'Korelyy passe officiellement en 6 langues : EN / ZH / FR / ES / HI / AR',
          es: 'Korelyy oficializa 6 idiomas: EN / ZH / FR / ES / HI / AR',
          hi: 'Korelyy ऑफिशियल 6 भाषाओं में: EN / ZH / FR / ES / HI / AR',
          ar: 'يتوفر Korelyy رسميًا بـ ٦ لغات: الإنجليزية والصينية والفرنسية والإسبانية والهندية والعربية',
        },
        summary: {
          zh: 'Korelyy 本周完成 6 语言国际化上线：英文、简体中文、法语、西班牙语、印地语、阿拉伯语（含 RTL 布局）。1056 个工具的名称和描述全部本地化。任何页面右上角的 🌐 语言切换器都可以一键切换，选择会被记住。',
          en: 'Korelyy completed 6-language i18n this week: English, Simplified Chinese, French, Spanish, Hindi, and Arabic (including RTL layout). 1,056 tools have localized names and descriptions. Tap the 🌐 switcher top-right on any page; your preference is persisted.',
          fr: 'Korelyy a finalisé son i18n en 6 langues cette semaine : Anglais, Chinois Simplifié, Français, Espagnol, Hindi et Arabe (avec layout RTL). 1 056 outils ont noms et descriptions localisés. Clique le sélecteur 🌐 en haut à droite ; ton choix est gardé.',
          es: 'Korelyy cerró su i18n en 6 idiomas esta semana: Inglés, Chino Simplificado, Francés, Español, Hindi y Árabe (incluye layout RTL). 1.056 herramientas tienen nombres y descripciones localizadas. Toca el selector 🌐 arriba a la derecha; tu preferencia se guarda.',
          hi: 'Korelyy ने इस सप्ताह 6-भाषा i18n पूरा किया: अंग्रेज़ी, सरलीकृत चीनी, फ़्रेंच, स्पैनिश, हिंदी, और अरबी (RTL लेआउट सहित)। 1,056 टूल्स के नाम और डिस्क्रिप्शन लोकलाइज्ड हैं। किसी भी पेज के टॉप-राइट में 🌐 स्विचर को टैप करें; आपकी पसंद सेव रहेगी।',
          ar: 'أكمل Korelyy عملية تدويل الـ ٦ لغات هذا الأسبوع: الإنجليزية والصينية المبسطة والفرنسية والإسبانية والهندية والعربية (مع تخطيط RTL). جميع الأدوات البالغ عددها ١٠٥٦ تحمل أسماء ووصفات مترجمة. اضغط على مبدل اللغة 🌐 أعلى اليمين في أي صفحة؛ سيتم حفظ تفضيلك.',
        },
      },
      {
        id: '001-2',
        emoji: '🧩',
        category: { en: 'Workflow', zh: '工作流', fr: 'Workflow', es: 'Workflow', hi: 'वर्कफ़्लो', ar: 'سير عمل' },
        title: {
          zh: 'AI 工作流广场 Beta 开放：77+ 即开即用模板',
          en: 'AI Workflow Square Beta is open — 77+ ready-to-use templates',
          fr: 'Workflow Square Bêta ouvert — 77+ templates prêts',
          es: 'Workflow Square Beta abierto — 77+ plantillas listas',
          hi: 'AI वर्कफ़्लो स्क्वायर बीटा खुल गया — 77+ रेडी-टू-यूज टेम्पलेट्स',
          ar: 'منصة سير عمل الذكاء الاصطناعي بيتا مفتوحة — ٧٧+ قالب جاهز للاستخدام',
        },
        summary: {
          zh: '不用再自己搭：Korelyy 工作流广场 Beta 本周开放，内置 77 个真实业务模板——SEO 文章流水线、社媒内容排期、客户线索清洗、PDF 批量压缩、简历自动化生成。每个模板一键复制到你的画布，然后按你自己的工具调整。',
          en: 'Stop building from scratch: Korelyy Workflow Square Beta opened this week with 77 real-world templates — SEO article pipelines, social content scheduling, lead list cleaning, batch PDF compression, automated resume builders. Clone any template to your canvas in one click, then swap tools to match yours.',
          fr: 'Arrête de tout recoder : Korelyy Workflow Square Bêta a ouvert cette semaine avec 77 templates métier réels — pipeline articles SEO, planning social, nettoyage leads, compression PDF batch, CV automatique. Clone un template sur ton canvas en un clic, puis swap les outils.',
          es: 'Ya no construyas desde cero: Workflow Square Beta de Korelyy abrió esta semana con 77 plantillas de casos reales — pipelines de artículos SEO, calendario social, limpieza de leads, compresión batch PDF, generador de CV automático. Clona cualquier plantilla en un clic, luego intercambia herramientas.',
          hi: 'अब स्क्रैच से न बनाएं: Korelyy वर्कफ़्लो स्क्वायर बीटा इस सप्ताह 77 असली बिज़नेस टेम्पलेट्स के साथ खुल गया — SEO आर्टिकल पाइपलाइन, सोशल कंटेंट शेड्यूलिंग, लीड लिस्ट क्लीनिंग, बैच PDF कंप्रेशन, ऑटोमेटेड रेज्यूमे बिल्डर। किसी भी टेम्पलेट को एक क्लिक में अपने कैनवास पर क्लोन करें, फिर टूल बदलें।',
          ar: 'توقف عن البناء من الصفر: افتتحت منصة سير عمل الذكاء الاصطناعي في Korelyy هذا الأسبوع مع ٧٧ قالبًا حقيقيًا — خطوط أنابيب مقالات SEO، وجدولة المحتوى الاجتماعي، وتنظيف قوائم العملاء المحتملين، والضغط الجماعي لملفات PDF، ومنشئ السير الذاتية المؤتمت. استنسخ أي قالب إلى لوحة عملك بنقرة واحدة، ثم استبدل الأدوات بما يناسبك.',
        },
        relatedToolSlugs: ['workflow-canvas', 'workflow-custom'],
      },
      {
        id: '001-3',
        emoji: '🚀',
        category: { en: 'Growth', zh: '增长实战', fr: 'Growth', es: 'Crecimiento', hi: 'ग्रोथ', ar: 'نمو' },
        title: {
          zh: '3 个独立开发者的「0 预算」流量策略',
          en: '3 indie dev "zero-budget" traffic strategies that actually worked',
          fr: '3 stratégies trafic 0$ pour devs indie qui ont fonctionné',
          es: '3 estrategias de tráfico cero-presupuesto para devs indie que sí funcionaron',
          hi: '3 इंडी डेव्स की "ज़ीरो-बजट" ट्रैफ़िक स्ट्रैटेजी जो सच में काम करती हैं',
          ar: '٣ استراتيجيات حركة مرورية "بدون ميزانية" للمطورين المستقلين نجحت فعليًا',
        },
        summary: {
          zh: '本周 Indie Hackers 上 3 个高赞案例：① 给 20 个工具站/博客投稿，被 1 个收录带来 30% 月活；② 做「竞品对比表」长尾 SEO，被 8 个关键词带首页前 3；③ 在 Reddit 只评论不发链接，签名里放产品链接，2 个月 5k UV。核心：不要上来就自吹。',
          en: 'Three high-upvote Indie Hackers case studies this week: ① Submit to 20 tool directories/blogs — one listing brings 30% MAU. ② Build a "competitor comparison page" for long-tail SEO — 8 keywords on Page 1, Top 3. ③ Comment-only (no self-links) on Reddit with product in your bio — 5k UV in 2 months. Core rule: never lead with your own thing.',
          fr: 'Trois cas Indie Hackers très upvotés cette semaine : ① Soumets à 20 annuaires/blogs outils — une liste apporte 30% de MAU. ② Fais une page "comparatif concurrence" pour le SEO longue traîne — 8 mots-clés Page 1, Top 3. ③ Commente seulement (pas de lien) sur Reddit avec produit dans ta bio — 5k UV en 2 mois. Règle d\'or : ne commence pas par ton produit.',
          es: 'Tres casos de Indie Hackers con muchos votos esta semana: ① Envía a 20 directorios/blogs de herramientas — un listado aporta 30% MAU. ② Haz una página "comparativa con la competencia" para SEO long-tail — 8 keywords en Top 3 de Página 1. ③ Comenta solo (sin enlaces propios) en Reddit, producto en tu bio — 5k UV en 2 meses. Regla de oro: nunca empieces por tu producto.',
          hi: 'इस सप्ताह Indie Hackers पर 3 हाई-अपवोट केस स्टडीज: ① 20 टूल डायरेक्टरीज़/ब्लॉग्स पर सबमिट करें — एक लिस्टिंग 30% MAU लाती है। ② लॉन्ग-टेल SEO के लिए "कंपेटिटर कंपेरिजन पेज" बनाएं — 8 कीवर्ड्स पेज 1 पर, टॉप 3 में। ③ Reddit पर सिर्फ़ कॉमेंट करें (अपना लिंक मत डालें), बायो में प्रोडक्ट लिंक रखें — 2 महीने में 5k UV। गोल्डन रूल: कभी भी अपना प्रोडक्ट हवा में मत उड़ाएं।',
          ar: 'ثلاث دراسات حالة حاصلة على أصوات عالية في Indie Hackers هذا الأسبوع: ① أرسل إلى ٢٠ دليل/مدونة أدوات — إحدى القوائم تجلب ٣٠٪ من المستخدمين النشطين شهريًا. ② أنشئ "صفحة مقارنة مع المنافسين" من أجل تحسين محركات البحث طويل الذيل — ٨ كلمات مفتاحية في المركز الأول من الصفحة الأولى، ضمن أول ٣ نتائج. ③ علّق فقط (بدون روابط خاصة بك) في Reddit وضع المنتج في نبذتك — ٥ ألف زيارة فريدة خلال شهرين. القاعدة الذهبية: لا تبدأ أبدًا بمنتجك.',
        },
      },
      {
        id: '001-4',
        emoji: '📱',
        category: { en: 'Mobile', zh: '移动端', fr: 'Mobile', es: 'Móvil', hi: 'मोबाइल', ar: 'جوال' },
        title: {
          zh: '移动端工具站访问占比首次超过 60%',
          en: 'Mobile traffic to tool websites exceeds 60% for the first time',
          fr: 'Trafic mobile sur les sites outils dépasse 60% pour la 1ère fois',
          es: 'Tráfico móvil en sitios de herramientas supera 60% por primera vez',
          hi: 'टूल वेबसाइट्स पर मोबाइल ट्रैफ़िक पहली बार 60% के ऊपर',
          ar: 'تجاوزت حركة الجوالات إلى مواقع الأدوات ٦٠٪ لأول مرة',
        },
        summary: {
          zh: 'Similarweb 本周数据：全球 Top 200 工具站的移动端访问占比中位数首次超过 60%。Korelyy 团队从第一天就严格遵循这一标准——每个按钮≥48px 可点击区域、所有表单走移动端适配、工具操作区在屏幕下半部分方便拇指点击。',
          en: 'Similarweb data this week: median mobile traffic share for the world\'s Top 200 tool websites exceeded 60% for the first time. Korelyy team enforced this standard since Day 1 — every button has ≥48px hit area, all forms are mobile-first, tool UIs sit in the bottom half for easy thumb reach.',
          fr: 'Données Similarweb cette semaine : la part médiane de trafic mobile parmi les Top 200 sites outils a dépassé 60% pour la première fois. L\'équipe Korelyy applique cette règle depuis le J1 — chaque bouton a une zone de clic ≥48px, tous les formulaires sont mobile-first, les UIs outils sont dans la moitié basse pour le pouce.',
          es: 'Datos de Similarweb esta semana: la mediana del tráfico móvil en el Top 200 mundial de sitios de herramientas superó 60% por primera vez. El equipo de Korelyy aplica este estándar desde el Día 1 — cada botón tiene ≥48px de área clickeable, todos los formularios son mobile-first, las UIs están en la mitad inferior para alcance fácil con el pulgar.',
          hi: 'इस सप्ताह Similarweb के डेटा: दुनिया के Top 200 टूल साइट्स पर मोबाइल ट्रैफ़िक की मीडियन शेयर पहली बार 60% से ऊपर गई। Korelyy टीम ने डे 1 से ही यह स्टैंडर्ड लागू किया — हर बटन की हिट एरिया ≥48px, सभी फॉर्म्स मोबाइल-फर्स्ट, टूल UIs अंगूठे से आसानी से पहुंच के लिए निचले आधे हिस्से में हैं।',
          ar: 'بيانات Similarweb هذا الأسبوع: تجاوزت النسبة الوسطى لحركة الجوالات في أفضل ٢٠٠ موقع أدوات عالميًا ٦٠٪ لأول مرة. طبق فريق Korelyy هذا المعيار منذ اليوم الأول — كل زر يتمتع بمساحة نقر ≥ ٤٨ بكسل، وجميع النماذج مُصممة أولًا للجوال، وواجهات الأدوات تقع في النصف السفلي من الشاشة لتسهيل الوصول بالإبهام.',
        },
      },
      {
        id: '001-5',
        emoji: '📬',
        category: { en: 'Subscribe', zh: '订阅方式', fr: 'Abonnement', es: 'Suscripción', hi: 'सब्सक्रिप्शन', ar: 'الاشتراك' },
        title: {
          zh: '欢迎订阅 Korelyy 每周极简资讯：每周日早上 8 点，只发 5 条',
          en: 'Subscribe to Korelyy Weekly — every Sunday 8am, exactly 5 items, zero fluff',
          fr: 'Abonne-toi à l\'Hebdo Korelyy — dimanche 8h, 5 items, zéro remplissage',
          es: 'Suscríbete al Resumen Semanal — domingo 8am, 5 ítems, cero relleno',
          hi: 'Korelyy साप्ताहिक सार को सब्सक्राइब करें — हर रविवार सुबह 8 बजे, सिर्फ 5 आइटम, ज़ीरो फ़्लफ',
          ar: 'اشترك في ملخص Korelyy الأسبوعي — كل أحد الساعة ٨ صباحًا، ٥ عناصر فقط، صفري الحشو',
        },
        summary: {
          zh: 'Newsletter 是 Korelyy 唯一的主动推送渠道。原则：① 每周只发 1 期，不搞日骚扰；② 每期严格 5 条内容，多一条都不写；③ 不接广告软文，不做联盟链接注入；④ 一键退订，不弹窗确认。页面下方/侧边栏的订阅框随时可退订。',
          en: 'This Newsletter is Korelyy\'s only outbound push channel. Ground rules: ① Only 1 issue per week, no daily spam. ② Exactly 5 items per issue, not one more. ③ No sponsored content, no injected affiliate links. ④ One-click unsubscribe, no confirmation hoops. Unsubscribe anytime from the box below / in the sidebar.',
          fr: 'Cette Newsletter est le seul canal push sortant de Korelyy. Règles de base : ① 1 seule édition par semaine, pas de spam quotidien. ② Exactement 5 items par numéro, pas un de plus. ③ Pas de contenu sponsorisé, pas de liens affiliés injectés. ④ Désinscription en un clic, pas de pièges. Tu peux te désinscrire à tout moment depuis la boîte ci-dessous ou la sidebar.',
          es: 'Este Newsletter es el único canal push saliente de Korelyy. Reglas de base: ① Solo 1 emisión semanal, nada de spam diario. ② Exactamente 5 ítems por entrega, ni uno más. ③ Sin contenido patrocinado, sin enlaces de afiliado inyectados. ④ Baja con un clic, sin aros para saltar. Date de baja cuando quieras desde la caja abajo o la barra lateral.',
          hi: 'यह न्यूज़लेटर Korelyy का एकमात्र आउटबाउंड पुश चैनल है। ग्राउंड रूल्स: ① सप्ताह में सिर्फ 1 इश्यू, कोई डेली स्पैम नहीं। ② प्रति इश्यू स्ट्रिक्ट 5 आइटम, एक भी ज़्यादा नहीं। ③ कोई स्पॉन्सर्ड कंटेंट नहीं, कोई इंजेक्टेड एफिलिएट लिंक नहीं। ④ एक क्लिक में अनसब्सक्राइब, कोई कन्फर्मेशन हूप नहीं। नीचे दिए बॉक्स या साइडबार से कभी भी अनसब्सक्राइब करें।',
          ar: 'هذه النشرة هي القناة الفريدة للدفع الصادر لدى Korelyy. القواعد الأساسية: ① عدد واحد فقط في الأسبوع، لا رسائل مزعجة يومية. ② ٥ عناصر بالضبط في كل عدد، ولا عنصر واحد زائد. ③ لا محتوى ممول، ولا روابط تابعة محقونة. ④ إلغاء الاشتراك بنقرة واحدة، بدون اختبارات تأكيد. يمكنك إلغاء الاشتراك في أي وقت من الصندوق أسفل أو من الشريط الجانبي.',
        },
      },
    ],
  },
];
