'use client';

import { Layers, Lightbulb, ArrowLeft, Rocket, Sparkles, Clock, Construction } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type FeatureKey = 'workflows' | 'ideas';

const FEATURE_CONFIG: Record<FeatureKey, {
  icon: React.ComponentType<any>;
  gradient: string;
  titles: Record<string, string>;
  subtitles: Record<string, string>;
  descriptions: Record<string, string>;
  eta: Record<string, string>;
}> = {
  workflows: {
    icon: Layers,
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    titles: {
      zh: 'AI 工作流 · 即将上线',
      en: 'AI Workflows · Coming Soon',
      fr: 'Workflows IA · Bientôt disponible',
      es: 'Workflows IA · Próximamente',
      hi: 'AI वर्कफ़्लो · जल्द आ रहा है',
      ar: 'سير عمل الذكاء الاصطناعي · قريباً',
    },
    subtitles: {
      zh: '串联 1000+ 工具，打造你的专属自动化流水线',
      en: 'Chain 1000+ tools into your own automation pipeline',
      fr: 'Enchaînez 1000+ outils dans votre pipeline automatisé',
      es: 'Conecta más de 1000 herramientas en tu flujo automático',
      hi: '1000+ टूल्स को अपने ऑटोमेशन पाइपलाइन में जोड़ें',
      ar: 'اربط أكثر من 1000 أداة في خط الأتمتة الخاص بك',
    },
    descriptions: {
      zh: [
        '🎯 拖拽式画布：零代码构建复杂工作流',
        '🔗 多工具串联：Base64 → 二维码 → 水印 → 压缩 一键搞定',
        '🧠 AI 智能生成：一句话描述自动生成完整流程',
        '📦 模板市场：50+ 行业精品模板开箱即用',
      ].join('\n'),
      en: [
        '🎯 Drag & Drop: Build complex workflows with zero code',
        '🔗 Chain tools: Base64 → QR → Watermark → Compress in one go',
        '🧠 AI Generate: Describe in one sentence, auto-create the flow',
        '📦 Templates: 50+ industry templates ready to use',
      ].join('\n'),
      fr: [
        '🎯 Glisser-déposer : Construisez des workflows sans code',
        '🔗 Chaînez les outils : Base64 → QR → Filigrane → Compression',
        '🧠 IA : Décrivez en une phrase, le workflow se crée tout seul',
        '📦 Modèles : 50+ templates prêts à l\'emploi',
      ].join('\n'),
      es: [
        '🎯 Arrastra y suelta: crea flujos complejos sin código',
        '🔗 Encadena herramientas: Base64 → QR → Marca → Comprime',
        '🧠 IA: describe en una frase y crea el flujo automáticamente',
        '📦 Plantillas: más de 50 plantillas listas para usar',
      ].join('\n'),
      hi: [
        '🎯 ड्रैग एंड ड्रॉप: बिना कोड के जटिल वर्कफ़्लो बनाएं',
        '🔗 टूल्स जोड़ें: Base64 → QR → वॉटरमार्क → कंप्रेस एक ही बार में',
        '🧠 AI जनरेटर: एक वाक्य में वर्णन करें, वर्कफ़्लो अपने आप बन जाएगा',
        '📦 टेम्पलेट्स: 50+ उद्योग टेम्पलेट्स उपयोग के लिए तैयार',
      ].join('\n'),
      ar: [
        '🎯 السحب والإفلات: أنشئ سير عمل معقد بدون برمجة',
        '🔗 ربط الأدوات: Base64 → QR → علامة مائية → ضغط في خطوة واحدة',
        '🧠 الذكاء الاصطناعي: صف في جملة واحدة، ينشئ السير تلقائياً',
        '📦 القوالب: أكثر من 50 قالب صناعي جاهز للاستخدام',
      ].join('\n'),
    },
    eta: {
      zh: '预计上线：2026 年 Q3',
      en: 'ETA: Q3 2026',
      fr: 'Disponible : T3 2026',
      es: 'Fecha: T3 2026',
      hi: 'लॉन्च : Q3 2026',
      ar: 'التاريخ: Q3 2026',
    },
  },
  ideas: {
    icon: Lightbulb,
    gradient: 'from-amber-500 via-orange-500 to-pink-500',
    titles: {
      zh: '创意工坊 · 即将上线',
      en: 'Idea Workshop · Coming Soon',
      fr: 'Atelier d\'idées · Bientôt disponible',
      es: 'Taller de Ideas · Próximamente',
      hi: 'आइडिया वर्कशॉप · जल्द आ रहा है',
      ar: 'ورشة الأفكار · قريباً',
    },
    subtitles: {
      zh: '把脑洞变成工具，让每个创意都能被一键使用',
      en: 'Turn ideas into tools, make every creativity one-click usable',
      fr: 'Transformez vos idées en outils, chaque créativité est accessible en un clic',
      es: 'Convierte ideas en herramientas, cada creatividad a un clic',
      hi: 'आइडियाओं को टूल्स में बदलें, हर रचनात्मकता एक क्लिक में',
      ar: 'حوّل الأفكار إلى أدوات، كل إبداع بنقرة واحدة',
    },
    descriptions: {
      zh: [
        '💡 创意提交：一句话描述想要的工具，AI 帮你实现',
        '🏆 投票机制：社区投票热门创意优先上线',
        '🎨 定制化参数：每个人的创意都可配置专属参数',
        '💰 收益分成：热门创意作者获得平台收益分成',
      ].join('\n'),
      en: [
        '💡 Submit ideas: Describe a tool in one sentence, AI builds it',
        '🏆 Community votes: Popular ideas get developed first',
        '🎨 Custom params: Every idea can have its own configurable params',
        '💰 Revenue share: Top idea creators earn platform revenue',
      ].join('\n'),
      fr: [
        '💡 Idées : Décrivez un outil en une phrase, l\'IA le construit',
        '🏆 Votes communautaires : Les idées populaires sont développées en premier',
        '🎨 Paramètres personnalisés : chaque idée a ses propres options',
        '💰 Partage des revenus : les meilleurs créateurs sont rémunérés',
      ].join('\n'),
      es: [
        '💡 Envía ideas: describe una herramienta en una frase, la IA la construye',
        '🏆 Votos: las ideas populares se desarrollan primero',
        '🎨 Parámetros: cada idea tiene sus propias opciones configurables',
        '💰 Ingresos: los creadores principales ganan dinero',
      ].join('\n'),
      hi: [
        '💡 आइडिया सबमिट करें: एक वाक्य में टूल का वर्णन करें, AI उसे बनाता है',
        '🏆 कम्युनिटी वोट: लोकप्रिय आइडिया पहले विकसित होते हैं',
        '🎨 कस्टम पैरामीटर: हर आइडिया के अपने कॉन्फ़िगरेबल पैरामीटर हो सकते हैं',
        '💰 रेवेन्यू शेयर: टॉप क्रिएटर्स प्लेटफ़ॉर्म से कमाई करते हैं',
      ].join('\n'),
      ar: [
        '💡 إرسال الأفكار: صف الأداة في جملة واحدة، يبنيها الذكاء الاصطناعي',
        '🏆 تصويت المجتمع: الأفكار الشائعة يتم تطويرها أولاً',
        '🎨 معلمات مخصصة: كل فكرة لها إعداداتها الخاصة',
        '💰 مشاركة الإيرادات: أفضل المبدعين يكسبون من المنصة',
      ].join('\n'),
    },
    eta: {
      zh: '预计上线：2026 年 Q4',
      en: 'ETA: Q4 2026',
      fr: 'Disponible : T4 2026',
      es: 'Fecha: T4 2026',
      hi: 'लॉन्च : Q4 2026',
      ar: 'التاريخ: Q4 2026',
    },
  },
};

const BACK_BTN: Record<string, string> = {
  zh: '← 返回首页',
  en: '← Back Home',
  fr: '← Retour',
  es: '← Volver',
  hi: '← होम पर वापस',
  ar: '← العودة للرئيسية',
};

const FEATURE_LABELS: Record<FeatureKey, Record<string, string>> = {
  workflows: {
    zh: '工具工作流',
    en: 'Workflows',
    fr: 'Workflows',
    es: 'Workflows',
    hi: 'वर्कफ़्लो',
    ar: 'سير العمل',
  },
  ideas: {
    zh: '创意工坊',
    en: 'Ideas',
    fr: 'Idées',
    es: 'Ideas',
    hi: 'आइडिया',
    ar: 'الأفكار',
  },
};

export default function FeatureComingSoon({ feature }: { feature: FeatureKey }) {
  const params = useParams();
  const router = useRouter();
  const localeRaw = (params?.locale as string) || 'zh';
  const locale = ['zh', 'en', 'fr', 'es', 'hi', 'ar'].includes(localeRaw) ? localeRaw : 'zh';

  const cfg = FEATURE_CONFIG[feature];
  const Icon = cfg.icon;

  const title = cfg.titles[locale] ?? cfg.titles.en;
  const subtitle = cfg.subtitles[locale] ?? cfg.subtitles.en;
  const description = cfg.descriptions[locale] ?? cfg.descriptions.en;
  const eta = cfg.eta[locale] ?? cfg.eta.en;
  const backLabel = BACK_BTN[locale] ?? BACK_BTN.en;
  const label = FEATURE_LABELS[feature][locale] ?? FEATURE_LABELS[feature].en;

  const handleBack = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-3xl w-full">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 mb-6 sm:mb-8 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {backLabel}
        </button>

        <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-gray-900 shadow-xl shadow-gray-500/5 dark:shadow-black/20">
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${cfg.gradient}`} />

          <div className="px-5 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16">
            <div className="flex flex-col items-center text-center">
              <div className={`relative mb-6 sm:mb-8`}>
                <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-30 bg-gradient-to-br ${cfg.gradient}`} />
                <div className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${cfg.gradient} shadow-lg flex items-center justify-center`}>
                  <Icon className="w-10 h-10 sm:w-14 sm:h-14 text-white" strokeWidth={1.8} />
                </div>
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center rotate-12 border border-gray-100 dark:border-gray-700">
                  <Construction className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" strokeWidth={2} />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                {label} · BETA
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3 sm:mb-4">
                {title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-6 sm:mb-8">
                {subtitle}
              </p>

              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 dark:from-indigo-950/40 dark:via-blue-950/40 dark:to-violet-950/40 border border-indigo-200/50 dark:border-indigo-800/40 mb-8 sm:mb-10">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  {eta}
                </span>
              </div>

              <div className="w-full max-w-lg grid gap-2.5 sm:gap-3 mb-8 sm:mb-10">
                {description.split('\n').map((line, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cfg.gradient}`} />
                    </div>
                    <p className="text-xs sm:text-sm md:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                      {line}
                    </p>
                  </div>
                ))}
              </div>

              <div className="w-full max-w-md">
                <button
                  onClick={handleBack}
                  className={`group relative w-full h-12 sm:h-14 rounded-2xl bg-gradient-to-r ${cfg.gradient} text-white text-sm sm:text-base font-bold shadow-lg shadow-gray-500/20 dark:shadow-black/30 hover:shadow-xl hover:shadow-gray-500/30 dark:hover:shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2 sm:gap-2.5">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
                    <span>{backLabel.replace('← ', '')}，先去看看其他工具</span>
                  </div>
                </button>
              </div>

              <p className="mt-5 sm:mt-6 text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
                有任何建议 / 想参与内测？欢迎联系我们 ✉️
              </p>
            </div>
          </div>

          <div className={`absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300/40 dark:via-gray-600/40 to-transparent`} />
        </div>
      </div>
    </div>
  );
}
