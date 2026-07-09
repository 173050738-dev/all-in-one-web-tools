'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Info, Sparkles, X } from 'lucide-react';

export type AdSlotSize =
  | 'banner'       // 728×90  顶部/列表中间横幅
  | 'rectangle'    // 300×250 工具详情侧栏方形
  | 'in-feed'      // 流式 工具列表间隙
  | 'sticky-bottom' // 移动端 底部粘性
  | 'auto';        // 自适应

const CLOSED_ADS_STORAGE_KEY = 'korelyy:closed-ad-slots-v2';
const CLOSED_ADS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type ClosedAdsMap = Record<string, number>;

function readClosedMap(): ClosedAdsMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CLOSED_ADS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ClosedAdsMap;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function pruneAndGetClosedSlots(): string[] {
  if (typeof window === 'undefined') return [];
  const map = readClosedMap();
  const now = Date.now();
  const result: string[] = [];
  const pruned: ClosedAdsMap = {};
  for (const [slot, expiresAt] of Object.entries(map)) {
    if (typeof expiresAt === 'number' && expiresAt > now) {
      result.push(slot);
      pruned[slot] = expiresAt;
    }
  }
  try {
    if (Object.keys(pruned).length !== Object.keys(map).length) {
      window.localStorage.setItem(CLOSED_ADS_STORAGE_KEY, JSON.stringify(pruned));
    }
  } catch {
    /* ignore */
  }
  return result;
}

function getClosedSlots(): string[] {
  return pruneAndGetClosedSlots();
}

function saveClosedSlot(slotId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = readClosedMap();
    map[slotId] = Date.now() + CLOSED_ADS_TTL_MS;
    window.localStorage.setItem(CLOSED_ADS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

interface AdSlotProps {
  slot: string;
  size?: AdSlotSize;
  publisherId?: string;   // AdSense ca-pub-xxx
  className?: string;
  /** 未配置 publisherId 时是否显示「此处可接入广告」的开发者提示占位 */
  showPlaceholder?: boolean;
  /** 是否显示右上角一键关闭按钮（in-feed / sticky-bottom 默认 true，rectangle 默认 false，banner 默认 true） */
  closable?: boolean;
  /** 关闭后的回调，用于 sticky-bottom 清除 body padding 等副作用 */
  onClose?: () => void;
}

const sizeStyles: Record<AdSlotSize, { wrap: string; minH: string; label: string }> = {
  banner: {
    wrap: 'w-full max-w-[728px] mx-auto',
    minH: 'min-h-[90px]',
    label: 'Banner 728×90',
  },
  rectangle: {
    wrap: 'w-full max-w-[300px]',
    minH: 'min-h-[250px]',
    label: 'Medium Rectangle 300×250',
  },
  'in-feed': {
    wrap: 'w-full col-span-full sm:col-span-2 lg:col-span-3 xl:col-span-4',
    minH: 'min-h-[130px] sm:min-h-[150px]',
    label: 'Native / In-feed',
  },
  'sticky-bottom': {
    wrap: 'w-full fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur',
    minH: 'min-h-[50px] sm:min-h-[60px]',
    label: 'Mobile Sticky',
  },
  auto: {
    wrap: 'w-full',
    minH: 'min-h-[120px]',
    label: 'Responsive Auto',
  },
};

/**
 * 统一广告位组件（符合 terms「广告与第三方链接」条款要求）
 * - 接入 Google AdSense：在 NEXT_PUBLIC_ADSENSE_PUBLISHER_ID 填 ca-pub-xxx
 * - 接入 Ezoic / 其他：把 <ins> 标签内容替换成对方代码即可
 * - 标记明确的 "Ad" / "广告" 标识，合规要求
 */
export default function AdSlot({
  slot,
  size = 'auto',
  publisherId,
  className = '',
  showPlaceholder = true,
  closable,
  onClose,
}: AdSlotProps) {
  const t = useTranslations('ads');
  const s = sizeStyles[size];
  const pub =
    publisherId ||
    (typeof process !== 'undefined'
      ? (process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID as string)
      : undefined);
  const isConfigured = !!pub;

  const defaultClosable = size === 'sticky-bottom' || size === 'in-feed' || size === 'banner';
  const canClose = closable ?? defaultClosable;

  const [mounted, setMounted] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const adPushedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setIsClosed(getClosedSlots().includes(slot));
  }, [slot]);

  useEffect(() => {
    if (!mounted || !isConfigured || isClosed || adPushedRef.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      adPushedRef.current = true;
    } catch {
      // ignore push failures (e.g. SDK not yet loaded, retry on next render benign)
    }
  }, [mounted, isConfigured, isClosed, pub, slot]);

  function handleClose() {
    setIsClosed(true);
    saveClosedSlot(slot);
    if (size === 'sticky-bottom' && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--ad-sticky-bottom-height', '0px');
    }
    try {
      onClose?.();
    } catch {
      /* ignore */
    }
  }

  if (!mounted) {
    return (
      <div
        data-ad-slot={slot}
        data-ad-size={size}
        aria-hidden="true"
        className={`invisible rounded-xl border border-transparent ${s.wrap} ${s.minH} ${className}`}
      />
    );
  }

  if (isClosed) return null;

  const isSticky = size === 'sticky-bottom';

  return (
    <div
      data-ad-slot={slot}
      data-ad-size={size}
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-sm ${
        isSticky ? 'safe-area-bottom' : ''
      } ${s.wrap} ${s.minH} ${className}`}
      role="complementary"
      aria-label={t('a11yLabel', { slot })}
    >
      {/* 合规标识：广告 / Ad / Sponsored */}
      <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-gray-900/85 text-gray-100 shadow">
        <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
        {t('label')}
      </span>

      {/* 一键关闭按钮 */}
      {canClose ? (
        <button
          type="button"
          onClick={handleClose}
          aria-label={t('closeA11y')}
          title={t('closeA11y')}
          className="absolute top-1.5 right-1.5 z-20 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 shadow-sm transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      ) : null}

      {isConfigured ? (
        // ===== Google AdSense / Ezoic 代码（填了 publisherId 自动生效）=====
        <div className="w-full h-full flex items-center justify-center p-2 pt-7">
          <ins
            className="adsbygoogle w-full h-full flex items-center justify-center"
            style={{ display: 'block' }}
            data-ad-client={pub}
            data-ad-slot={slot}
            data-ad-format={
              size === 'rectangle'
                ? 'rectangle'
                : size === 'banner'
                  ? 'horizontal'
                  : 'auto'
            }
            data-full-width-responsive="true"
          />
        </div>
      ) : showPlaceholder ? (
        <AdCPSPlaceholder slot={slot} size={size} sizeLabel={s.label} />
      ) : null}
    </div>
  );
}

/* =========================================================================
 * AdCPSPlaceholder — 未配置 AdSense 时显示真实的 CPS 推荐位（自营变现）
 *   每个位置/规格放不同产品，href 先占位，注册联盟后替换即可。
 *   替换位置关键词：TODO-CPS-REPLACE
 * =======================================================================*/

type CPSLink = {
  /** 唯一标识，方便后面替换 */
  id:
    | 'grammarly-premium'
    | 'aliyun-newbie'
    | 'notion-ai-annual'
    | 'chatgpt-plus'
    | 'korelyy-premium'
    | 'canva-pro'
    | 'adobe-acrobat-pro'
    | 'github-copilot'
    | 'figma-pro';
  /** TODO-CPS-REPLACE: 注册对应联盟后把下面 href 换成真实推广链接 */
  href: string;
  /** 左上角小标签 */
  tag: string;
  /** 产品名称（大标题） */
  title: string;
  /** 副标题（卖点） */
  subtitle: string;
  /** CTA 按钮文字 */
  cta: string;
  /** 主色渐变 from -> to */
  gradientFrom: string;
  gradientTo: string;
  /** 标签文字色（和背景对比度好） */
  tagBg: string;
  tagTxt: string;
  /** 装饰 emoji / 图标字符（简单不依赖外部资源） */
  iconChar: string;
};

type AdLocale = 'en' | 'zh' | 'es' | 'fr' | 'ar' | 'hi';

const I18N_LINKS: Record<AdLocale, Record<CPSLink['id'], CPSLink>> = {
  zh: {
    'grammarly-premium': {
      id: 'grammarly-premium',
      href: '#',
      tag: '英文写作 AI',
      title: 'Grammarly Premium',
      subtitle: '论文/邮件/报告一键润色，30 天退款保障',
      cta: '年度 5 折 →',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      tagBg: 'bg-white/80 text-emerald-700',
      tagTxt: '',
      iconChar: '✍️',
    },
    'aliyun-newbie': {
      id: 'aliyun-newbie',
      href: 'https://www.aliyun.com/minisite/goods?userCode=t0ukqzcf',
      tag: '云服务器新人',
      title: '阿里云 2核2G 99 元/年',
      subtitle: '部署小站 / 跑爬虫 / 练手项目，性价比之王',
      cta: '立即抢 →',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500',
      tagBg: 'bg-white/80 text-orange-700',
      tagTxt: '',
      iconChar: '☁️',
    },
    'notion-ai-annual': {
      id: 'notion-ai-annual',
      href: '#',
      tag: '工作流 / AI 笔记',
      title: 'Notion AI 年度订阅',
      subtitle: '写作 · 知识管理 · 数据库自动化，一站搞定',
      cta: '免费试用 →',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-gray-900',
      tagBg: 'bg-white/80 text-slate-700',
      tagTxt: '',
      iconChar: '📓',
    },
    'chatgpt-plus': {
      id: 'chatgpt-plus',
      href: '#',
      tag: 'AI 助手 首选',
      title: 'ChatGPT Plus 订阅',
      subtitle: 'GPT-4o 多模态 · DALL-E 画图 · Code Interpreter',
      cta: '立即开通 →',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-violet-700',
      tagTxt: '',
      iconChar: '🤖',
    },
    'korelyy-premium': {
      id: 'korelyy-premium',
      href: '#',
      tag: 'Korelyy 会员',
      title: '全部工具高级版',
      subtitle: '解锁 AI 增强 · 批量导出 · 无水印 · 优先使用',
      cta: '¥39/月 开通 →',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
      tagBg: 'bg-white/80 text-indigo-700',
      tagTxt: '',
      iconChar: '✨',
    },
    'canva-pro': {
      id: 'canva-pro',
      href: '#',
      tag: '图片 / 设计',
      title: 'Canva Pro 会员',
      subtitle: '100万+ 模板 · 品牌素材 · AI 抠图 · 批量设计',
      cta: '30 天免费 →',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600',
      tagBg: 'bg-white/80 text-sky-700',
      tagTxt: '',
      iconChar: '🎨',
    },
    'adobe-acrobat-pro': {
      id: 'adobe-acrobat-pro',
      href: '#',
      tag: 'PDF 专业版',
      title: 'Adobe Acrobat Pro',
      subtitle: 'PDF 编辑 / 签名 / OCR 识别 / 合并压缩，业界标准',
      cta: '7 天免费 →',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-700',
      tagBg: 'bg-white/80 text-red-700',
      tagTxt: '',
      iconChar: '📑',
    },
    'github-copilot': {
      id: 'github-copilot',
      href: '#',
      tag: 'AI 编程助手',
      title: 'GitHub Copilot',
      subtitle: 'IDE 实时写代码 · 补全重构 · 查 Bug，效率翻倍',
      cta: '免费试用 →',
      gradientFrom: 'from-zinc-700',
      gradientTo: 'to-zinc-900',
      tagBg: 'bg-white/80 text-zinc-700',
      tagTxt: '',
      iconChar: '💻',
    },
    'figma-pro': {
      id: 'figma-pro',
      href: '#',
      tag: 'UI / UX 设计',
      title: 'Figma Professional',
      subtitle: '协作式原型 · 组件库 · Dev Mode，设计到开发一站',
      cta: '免费开始 →',
      gradientFrom: 'from-fuchsia-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-fuchsia-700',
      tagTxt: '',
      iconChar: '🖼️',
    },
  },
  en: {
    'grammarly-premium': {
      id: 'grammarly-premium',
      href: '#',
      tag: 'Writing AI',
      title: 'Grammarly Premium',
      subtitle: 'Polish essays/emails/reports in one click. 30-day money back guarantee.',
      cta: '50% OFF Yearly →',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      tagBg: 'bg-white/80 text-emerald-700',
      tagTxt: '',
      iconChar: '✍️',
    },
    'aliyun-newbie': {
      id: 'aliyun-newbie',
      href: 'https://www.aliyun.com/minisite/goods?userCode=t0ukqzcf',
      tag: 'Cloud Starter',
      title: 'Alibaba Cloud 2C2G $13.80/yr',
      subtitle: 'Perfect for small sites, crawlers and practice projects. Unbeatable value.',
      cta: 'Grab Deal →',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500',
      tagBg: 'bg-white/80 text-orange-700',
      tagTxt: '',
      iconChar: '☁️',
    },
    'notion-ai-annual': {
      id: 'notion-ai-annual',
      href: '#',
      tag: 'Workflow / AI Notes',
      title: 'Notion AI Annual',
      subtitle: 'Writing · Knowledge base · Database automation — all in one workspace.',
      cta: 'Free Trial →',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-gray-900',
      tagBg: 'bg-white/80 text-slate-700',
      tagTxt: '',
      iconChar: '📓',
    },
    'chatgpt-plus': {
      id: 'chatgpt-plus',
      href: '#',
      tag: 'Top AI Assistant',
      title: 'ChatGPT Plus Subscription',
      subtitle: 'GPT-4o Multimodal · DALL-E image generation · Code Interpreter included.',
      cta: 'Subscribe Now →',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-violet-700',
      tagTxt: '',
      iconChar: '🤖',
    },
    'korelyy-premium': {
      id: 'korelyy-premium',
      href: '#',
      tag: 'Korelyy Premium',
      title: 'All Tools Pro Upgrade',
      subtitle: 'Unlock AI enhancements · Batch export · No watermarks · Priority access.',
      cta: '$5.49/mo →',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
      tagBg: 'bg-white/80 text-indigo-700',
      tagTxt: '',
      iconChar: '✨',
    },
    'canva-pro': {
      id: 'canva-pro',
      href: '#',
      tag: 'Image / Design',
      title: 'Canva Pro Membership',
      subtitle: '1M+ templates · Brand kit · AI background removal · Bulk create.',
      cta: '30-Day Free →',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600',
      tagBg: 'bg-white/80 text-sky-700',
      tagTxt: '',
      iconChar: '🎨',
    },
    'adobe-acrobat-pro': {
      id: 'adobe-acrobat-pro',
      href: '#',
      tag: 'PDF Pro Suite',
      title: 'Adobe Acrobat Pro',
      subtitle: 'PDF editing · E-sign · OCR · Merge & compress. The industry standard.',
      cta: '7-Day Free →',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-700',
      tagBg: 'bg-white/80 text-red-700',
      tagTxt: '',
      iconChar: '📑',
    },
    'github-copilot': {
      id: 'github-copilot',
      href: '#',
      tag: 'AI Coding Assistant',
      title: 'GitHub Copilot',
      subtitle: 'Real-time code in your IDE · Autocomplete · Refactor · Debug. 2× faster.',
      cta: 'Free Trial →',
      gradientFrom: 'from-zinc-700',
      gradientTo: 'to-zinc-900',
      tagBg: 'bg-white/80 text-zinc-700',
      tagTxt: '',
      iconChar: '💻',
    },
    'figma-pro': {
      id: 'figma-pro',
      href: '#',
      tag: 'UI / UX Design',
      title: 'Figma Professional',
      subtitle: 'Collaborative prototypes · Libraries · Dev Mode — design to dev, one tool.',
      cta: 'Start Free →',
      gradientFrom: 'from-fuchsia-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-fuchsia-700',
      tagTxt: '',
      iconChar: '🖼️',
    },
  },
  es: {
    'grammarly-premium': {
      id: 'grammarly-premium',
      href: '#',
      tag: 'IA de Redacción',
      title: 'Grammarly Premium',
      subtitle: 'Perfecciona ensayos/correos/informes con un clic. Garantía 30 días.',
      cta: '50% DTO. Anual →',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      tagBg: 'bg-white/80 text-emerald-700',
      tagTxt: '',
      iconChar: '✍️',
    },
    'aliyun-newbie': {
      id: 'aliyun-newbie',
      href: 'https://www.aliyun.com/minisite/goods?userCode=t0ukqzcf',
      tag: 'Nuevo en Cloud',
      title: 'Alibaba Cloud 2C2G 99 ¥/año',
      subtitle: 'Ideal para sitios pequeños, crawlers y proyectos. Precio inmejorable.',
      cta: '¡Aprovecha →',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500',
      tagBg: 'bg-white/80 text-orange-700',
      tagTxt: '',
      iconChar: '☁️',
    },
    'notion-ai-annual': {
      id: 'notion-ai-annual',
      href: '#',
      tag: 'Flujos / Notas IA',
      title: 'Suscripción Anual Notion AI',
      subtitle: 'Redacción · Base de conocimiento · Automatización de BD en un solo lugar.',
      cta: 'Prueba Gratis →',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-gray-900',
      tagBg: 'bg-white/80 text-slate-700',
      tagTxt: '',
      iconChar: '📓',
    },
    'chatgpt-plus': {
      id: 'chatgpt-plus',
      href: '#',
      tag: 'Mejor Asistente IA',
      title: 'Suscripción ChatGPT Plus',
      subtitle: 'GPT-4o Multimodal · Generación de imágenes DALL-E · Code Interpreter incluido.',
      cta: 'Suscríbete Ya →',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-violet-700',
      tagTxt: '',
      iconChar: '🤖',
    },
    'korelyy-premium': {
      id: 'korelyy-premium',
      href: '#',
      tag: 'Membresía Korelyy',
      title: 'Versión Pro Todas las Herramientas',
      subtitle: 'Mejoras IA · Exportación por lotes · Sin marcas de agua · Acceso prioritario.',
      cta: '¥39/mes →',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
      tagBg: 'bg-white/80 text-indigo-700',
      tagTxt: '',
      iconChar: '✨',
    },
    'canva-pro': {
      id: 'canva-pro',
      href: '#',
      tag: 'Imagen / Diseño',
      title: 'Canva Pro',
      subtitle: 'Más de 1M de plantillas · Kit de marca · Eliminar fondo IA · Diseño por lotes.',
      cta: '30 días Gratis →',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600',
      tagBg: 'bg-white/80 text-sky-700',
      tagTxt: '',
      iconChar: '🎨',
    },
    'adobe-acrobat-pro': {
      id: 'adobe-acrobat-pro',
      href: '#',
      tag: 'PDF Profesional',
      title: 'Adobe Acrobat Pro',
      subtitle: 'Editar PDF · Firmar · OCR · Comprimir y unir. El estándar del sector.',
      cta: '7 días Gratis →',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-700',
      tagBg: 'bg-white/80 text-red-700',
      tagTxt: '',
      iconChar: '📑',
    },
    'github-copilot': {
      id: 'github-copilot',
      href: '#',
      tag: 'IA para Programar',
      title: 'GitHub Copilot',
      subtitle: 'Código en tiempo real en tu IDE · Autocompletar · Refactor · Depurar. 2× más rápido.',
      cta: 'Prueba Gratis →',
      gradientFrom: 'from-zinc-700',
      gradientTo: 'to-zinc-900',
      tagBg: 'bg-white/80 text-zinc-700',
      tagTxt: '',
      iconChar: '💻',
    },
    'figma-pro': {
      id: 'figma-pro',
      href: '#',
      tag: 'Diseño UI / UX',
      title: 'Figma Professional',
      subtitle: 'Prototipos colaborativos · Librerías · Dev Mode — diseño a dev, una herramienta.',
      cta: 'Empieza Gratis →',
      gradientFrom: 'from-fuchsia-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-fuchsia-700',
      tagTxt: '',
      iconChar: '🖼️',
    },
  },
  fr: {
    'grammarly-premium': {
      id: 'grammarly-premium',
      href: '#',
      tag: 'IA Rédaction',
      title: 'Grammarly Premium',
      subtitle: 'Améliorez dissertations, mails et rapports en un clic. Garantie 30 jours.',
      cta: '-50% Annuel →',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      tagBg: 'bg-white/80 text-emerald-700',
      tagTxt: '',
      iconChar: '✍️',
    },
    'aliyun-newbie': {
      id: 'aliyun-newbie',
      href: 'https://www.aliyun.com/minisite/goods?userCode=t0ukqzcf',
      tag: 'Débutant Cloud',
      title: 'Alibaba Cloud 2C2G 99 ¥/an',
      subtitle: 'Idéal pour petits sites, crawlers et projets. Rapport Q/P imbattable.',
      cta: 'Profiter →',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500',
      tagBg: 'bg-white/80 text-orange-700',
      tagTxt: '',
      iconChar: '☁️',
    },
    'notion-ai-annual': {
      id: 'notion-ai-annual',
      href: '#',
      tag: 'Workflows / Notes IA',
      title: 'Abonnement Annuel Notion AI',
      subtitle: 'Rédaction · Base de connaissances · Automatisation BD dans un seul espace.',
      cta: 'Essai Gratuit →',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-gray-900',
      tagBg: 'bg-white/80 text-slate-700',
      tagTxt: '',
      iconChar: '📓',
    },
    'chatgpt-plus': {
      id: 'chatgpt-plus',
      href: '#',
      tag: 'Top Assistant IA',
      title: 'Abonnement ChatGPT Plus',
      subtitle: 'GPT-4o Multimodal · Génération d’images DALL-E · Code Interpreter inclus.',
      cta: 'S’inscrire →',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-violet-700',
      tagTxt: '',
      iconChar: '🤖',
    },
    'korelyy-premium': {
      id: 'korelyy-premium',
      href: '#',
      tag: 'Abonnement Korelyy',
      title: 'Version Pro Tous les Outils',
      subtitle: 'Améliorations IA · Export par lots · Sans filigrane · Accès prioritaire.',
      cta: '¥39/mois →',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
      tagBg: 'bg-white/80 text-indigo-700',
      tagTxt: '',
      iconChar: '✨',
    },
    'canva-pro': {
      id: 'canva-pro',
      href: '#',
      tag: 'Image / Design',
      title: 'Canva Pro',
      subtitle: '1M+ de modèles · Kit de marque · Suppression fond IA · Création en lot.',
      cta: '30 jours Gratuit →',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600',
      tagBg: 'bg-white/80 text-sky-700',
      tagTxt: '',
      iconChar: '🎨',
    },
    'adobe-acrobat-pro': {
      id: 'adobe-acrobat-pro',
      href: '#',
      tag: 'PDF Pro',
      title: 'Adobe Acrobat Pro',
      subtitle: 'Édition PDF · Signature · OCR · Fusionner et compresser. La référence.',
      cta: '7 jours Gratuit →',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-700',
      tagBg: 'bg-white/80 text-red-700',
      tagTxt: '',
      iconChar: '📑',
    },
    'github-copilot': {
      id: 'github-copilot',
      href: '#',
      tag: 'IA de Code',
      title: 'GitHub Copilot',
      subtitle: 'Code en temps réel dans l’IDE · Auto-complétion · Refactor · Déboguer. 2× plus vite.',
      cta: 'Essai Gratuit →',
      gradientFrom: 'from-zinc-700',
      gradientTo: 'to-zinc-900',
      tagBg: 'bg-white/80 text-zinc-700',
      tagTxt: '',
      iconChar: '💻',
    },
    'figma-pro': {
      id: 'figma-pro',
      href: '#',
      tag: 'Design UI / UX',
      title: 'Figma Professional',
      subtitle: 'Prototypes collaboratifs · Librairies · Dev Mode — design & dev, un outil.',
      cta: 'Démarrer Gratuit →',
      gradientFrom: 'from-fuchsia-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-fuchsia-700',
      tagTxt: '',
      iconChar: '🖼️',
    },
  },
  ar: {
    'grammarly-premium': {
      id: 'grammarly-premium',
      href: '#',
      tag: 'ذكاء اصطناعي للكتابة',
      title: 'Grammarly Premium',
      subtitle: 'صقل المقالات والرسائل والتقارير بنقرة واحدة. ضمان استرداد 30 يومًا.',
      cta: 'خصم 50% سنوي →',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      tagBg: 'bg-white/80 text-emerald-700',
      tagTxt: '',
      iconChar: '✍️',
    },
    'aliyun-newbie': {
      id: 'aliyun-newbie',
      href: 'https://www.aliyun.com/minisite/goods?userCode=t0ukqzcf',
      tag: 'مبتدئ في السحابة',
      title: 'علي بابا كلاود 2C2G 99 يوان/سنة',
      subtitle: 'مثالي للمواقع الصغيرة والزحف والمشاريع التجريبية. قيمة لا تُضاهى.',
      cta: 'اغتنم العرض →',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500',
      tagBg: 'bg-white/80 text-orange-700',
      tagTxt: '',
      iconChar: '☁️',
    },
    'notion-ai-annual': {
      id: 'notion-ai-annual',
      href: '#',
      tag: 'سير العمل / ملاحظات ذكاء',
      title: 'اشتراك سنوي Notion AI',
      subtitle: 'الكتابة · قاعدة المعرفة · أتمتة قواعد البيانات في مساحة عمل واحدة.',
      cta: 'تجربة مجانية →',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-gray-900',
      tagBg: 'bg-white/80 text-slate-700',
      tagTxt: '',
      iconChar: '📓',
    },
    'chatgpt-plus': {
      id: 'chatgpt-plus',
      href: '#',
      tag: 'أفضل مساعد ذكاء',
      title: 'اشتراك ChatGPT Plus',
      subtitle: 'GPT-4o متعدد الوسائط · توليد صور DALL-E · Code Interpreter مدمج.',
      cta: 'اشترك الآن →',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-violet-700',
      tagTxt: '',
      iconChar: '🤖',
    },
    'korelyy-premium': {
      id: 'korelyy-premium',
      href: '#',
      tag: 'عضوية Korelyy',
      title: 'النسخة الاحترافية لجميع الأدوات',
      subtitle: 'تحسينات ذكاء · تصدير مجمع · علامات مائية وصول سريع.',
      cta: '¥39/شهر →',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
      tagBg: 'bg-white/80 text-indigo-700',
      tagTxt: '',
      iconChar: '✨',
    },
    'canva-pro': {
      id: 'canva-pro',
      href: '#',
      tag: 'صورة / تصميم',
      title: 'Canva Pro',
      subtitle: 'أكثر من مليون قالب · هوية علامة تجارية · إزالة خلفية بالذكاء · تصميم مجمع.',
      cta: '30 يومًا مجاني →',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600',
      tagBg: 'bg-white/80 text-sky-700',
      tagTxt: '',
      iconChar: '🎨',
    },
    'adobe-acrobat-pro': {
      id: 'adobe-acrobat-pro',
      href: '#',
      tag: 'PDF احترافي',
      title: 'Adobe Acrobat Pro',
      subtitle: 'تعديل PDF · توقيع إلكتروني · OCR · دمج وضغط. المعيار الصناعي.',
      cta: '7 أيام مجانية →',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-700',
      tagBg: 'bg-white/80 text-red-700',
      tagTxt: '',
      iconChar: '📑',
    },
    'github-copilot': {
      id: 'github-copilot',
      href: '#',
      tag: 'ذكاء للبرمجة',
      title: 'GitHub Copilot',
      subtitle: 'كود في الوقت الفعلي داخل IDE · إكمال تلقائي · إعادة بناء · تصحيح أخطاء. أسرع مرتين.',
      cta: 'تجربة مجانية →',
      gradientFrom: 'from-zinc-700',
      gradientTo: 'to-zinc-900',
      tagBg: 'bg-white/80 text-zinc-700',
      tagTxt: '',
      iconChar: '💻',
    },
    'figma-pro': {
      id: 'figma-pro',
      href: '#',
      tag: 'تصميم UI / UX',
      title: 'Figma Professional',
      subtitle: 'نماذج أولية تعاونية · مكتبات مكونات · Dev Mode — من التصميم للتطوير في أداة واحدة.',
      cta: 'ابدأ مجانًا →',
      gradientFrom: 'from-fuchsia-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-fuchsia-700',
      tagTxt: '',
      iconChar: '🖼️',
    },
  },
  hi: {
    'grammarly-premium': {
      id: 'grammarly-premium',
      href: '#',
      tag: 'लेखन एआई',
      title: 'Grammarly Premium',
      subtitle: 'निबंध/ईमेल/रिपोर्ट एक क्लिक में पॉलिश। 30 दिन की मनी बैक गारंटी।',
      cta: 'सालाना 50% छूट →',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      tagBg: 'bg-white/80 text-emerald-700',
      tagTxt: '',
      iconChar: '✍️',
    },
    'aliyun-newbie': {
      id: 'aliyun-newbie',
      href: 'https://www.aliyun.com/minisite/goods?userCode=t0ukqzcf',
      tag: 'क्लाउड नया यूजर',
      title: 'अलीबाबा क्लाउड 2C2G 99¥/वर्ष',
      subtitle: 'छोटी साइट, क्रॉलर और अभ्यास प्रोजेक्ट के लिए बेस्ट वैल्यू।',
      cta: 'फटाफट लें →',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500',
      tagBg: 'bg-white/80 text-orange-700',
      tagTxt: '',
      iconChar: '☁️',
    },
    'notion-ai-annual': {
      id: 'notion-ai-annual',
      href: '#',
      tag: 'वर्कफ़्लो / एआई नोट्स',
      title: 'Notion AI वार्षिक सब्सक्रिप्शन',
      subtitle: 'लेखन · नॉलेज बेस · डेटाबेस ऑटोमेशन — एक ही वर्कस्पेस में।',
      cta: 'फ्री ट्रायल →',
      gradientFrom: 'from-slate-700',
      gradientTo: 'to-gray-900',
      tagBg: 'bg-white/80 text-slate-700',
      tagTxt: '',
      iconChar: '📓',
    },
    'chatgpt-plus': {
      id: 'chatgpt-plus',
      href: '#',
      tag: 'टॉप एआई असिस्टेंट',
      title: 'ChatGPT Plus सब्सक्रिप्शन',
      subtitle: 'GPT-4o मल्टीमोडल · DALL-E इमेज जेन · Code Interpreter शामिल।',
      cta: 'अभी सब्सक्राइब करें →',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-violet-700',
      tagTxt: '',
      iconChar: '🤖',
    },
    'korelyy-premium': {
      id: 'korelyy-premium',
      href: '#',
      tag: 'Korelyy प्रीमियम',
      title: 'सभी टूल्स का प्रो वर्जन',
      subtitle: 'एआई एन्हांस · बैच एक्सपोर्ट · बिना वॉटरमार्क · प्रायोरिटी एक्सेस।',
      cta: '¥39/महीना →',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
      tagBg: 'bg-white/80 text-indigo-700',
      tagTxt: '',
      iconChar: '✨',
    },
    'canva-pro': {
      id: 'canva-pro',
      href: '#',
      tag: 'इमेज / डिज़ाइन',
      title: 'Canva Pro मेंबरशिप',
      subtitle: '10 लाख+ टेम्पलेट · ब्रांड किट · AI बैकग्राउंड हटाना · बल्क डिज़ाइन।',
      cta: '30 दिन फ्री →',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600',
      tagBg: 'bg-white/80 text-sky-700',
      tagTxt: '',
      iconChar: '🎨',
    },
    'adobe-acrobat-pro': {
      id: 'adobe-acrobat-pro',
      href: '#',
      tag: 'PDF प्रो सूट',
      title: 'Adobe Acrobat Pro',
      subtitle: 'PDF एडिट · ई-साइन · OCR · मर्ज और कंप्रेस। इंडस्ट्री स्टैंडर्ड।',
      cta: '7 दिन फ्री →',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-700',
      tagBg: 'bg-white/80 text-red-700',
      tagTxt: '',
      iconChar: '📑',
    },
    'github-copilot': {
      id: 'github-copilot',
      href: '#',
      tag: 'AI कोडिंग असिस्टेंट',
      title: 'GitHub Copilot',
      subtitle: 'आपके IDE में रियल-टाइम कोड · ऑटोकंपलीट · रिफैक्टर · डीबग। 2× तेज़।',
      cta: 'फ्री ट्रायल →',
      gradientFrom: 'from-zinc-700',
      gradientTo: 'to-zinc-900',
      tagBg: 'bg-white/80 text-zinc-700',
      tagTxt: '',
      iconChar: '💻',
    },
    'figma-pro': {
      id: 'figma-pro',
      href: '#',
      tag: 'UI / UX डिज़ाइन',
      title: 'Figma Professional',
      subtitle: 'सहयोगी प्रोटोटाइप · लाइब्रेरी · डेव मोड — डिज़ाइन से डेव तक, एक टूल।',
      cta: 'फ्री स्टार्ट →',
      gradientFrom: 'from-fuchsia-500',
      gradientTo: 'to-purple-700',
      tagBg: 'bg-white/80 text-fuchsia-700',
      tagTxt: '',
      iconChar: '🖼️',
    },
  },
};

interface CPSPlaceholderProps {
  slot: string;
  size: AdSlotSize;
  sizeLabel: string;
}

function resolveFromToolContext(
  slot: string,
): { primary: CPSLink['id']; secondary: CPSLink['id'] } | null {
  const parts = slot.split('-');
  const slug = parts.slice(1, -2).join('-').toLowerCase();
  const category = (parts[parts.length - 1] || '').toLowerCase();
  const fullText = `${slug} ${category}`;

  const matches = (keywords: string[]): boolean =>
    keywords.some((k) => fullText.includes(k.toLowerCase()));

  // ===== 1. PDF / OCR 工具 → Adobe Acrobat Pro =====
  if (matches(['pdf', 'ocr', 'acrobat', 'sign', 'signature', 'compress', 'merge'])) {
    return { primary: 'adobe-acrobat-pro', secondary: 'grammarly-premium' };
  }
  // ===== 2. 图片 / 设计 / 编辑 → Canva Pro =====
  if (matches([
    'image', 'photo', 'picture', 'compress', 'compressor', 'cutter', 'grid',
    'wallpaper', 'avatar', 'poster', 'decorator', 'emoji', 'mixer', 'edit',
    'editor', 'resizer', 'crop', 'color', 'picker', 'palette', 'design',
    'img', 'figure', 'removebg', 'background', 'design-tools', 'graphics',
  ])) {
    return { primary: 'canva-pro', secondary: 'figma-pro' };
  }
  // ===== 3. UI / UX / 原型 / Figma 类 → Figma Pro =====
  if (matches(['figma', 'prototype', 'ui', 'ux', 'wireframe', 'mockup'])) {
    return { primary: 'figma-pro', secondary: 'canva-pro' };
  }
  // ===== 4. 开发 / 代码 / 格式化 / DevTools → GitHub Copilot =====
  if (matches([
    'json', 'formatter', 'regex', 'tester', 'code', 'script', 'uuid',
    'generate', 'generator', 'encode', 'decode', 'base64', 'markdown', 'preview',
    'convert', 'timestamp', 'converter', 'parser', 'yaml', 'xml', 'lint',
    'devtools', 'developer', 'programming', 'syntax', 'highlight', 'diff',
    'patch', 'ssh', 'jwt', 'encode-decode', 'crypto', 'hash', 'encode',
  ])) {
    return { primary: 'github-copilot', secondary: 'korelyy-premium' };
  }
  // ===== 5. 写作 / 标题 / 字幕 / 文案 / 翻译 → Grammarly Premium =====
  if (matches([
    'text', 'translate', 'translator', 'case', 'convert', 'copy', 'cleaner',
    'counter', 'sentiment', 'analyzer', 'caption', 'generator', 'title',
    'pinyin', 'annotator', 'keyword', 'spin', 'off', 'seo', 'srt', 'subtitle',
    'speech', 'sentence', 'paragraph', 'essay', 'writing', 'writer',
    'grammar', 'spell', 'word', 'character',
  ])) {
    return { primary: 'grammarly-premium', secondary: 'notion-ai-annual' };
  }
  // ===== 6. AI / 工作流 / 生成 / 智能 类 → ChatGPT Plus + Notion AI =====
  if (matches([
    'ai', 'workflow', 'caption', 'sentiment', 'tts', 'text-to-speech',
    'transcript', 'analyze', 'assistant', 'recommend', 'bot',
  ])) {
    return { primary: 'chatgpt-plus', secondary: 'notion-ai-annual' };
  }
  // ===== 7. 金融 / 贷款 / 计算 → 先推自己 Korelyy Premium（广告合规风险高）=====
  if (matches(['mortgage', 'finance', 'loan', 'calculator', 'interest'])) {
    return { primary: 'korelyy-premium', secondary: 'aliyun-newbie' };
  }
  // ===== 8. 体育 / 足球 / WC → Korelyy Premium（联盟产品少，先推自己会员）=====
  if (matches(['wc-', 'worldcup', 'football', 'sport', 'scoreboard', 'poster', 'fan'])) {
    return { primary: 'korelyy-premium', secondary: 'chatgpt-plus' };
  }
  // ===== 9. QR / 条码 / 二维码 / 生成 → Notion AI + Korelyy Premium =====
  if (matches(['qr', 'qrcode', 'barcode', 'scanner'])) {
    return { primary: 'notion-ai-annual', secondary: 'korelyy-premium' };
  }
  return null;
}

function AdCPSPlaceholder({ slot, size }: CPSPlaceholderProps) {
  const nextIntlLocale = useLocale() as AdLocale;
  const locale = useMemo<AdLocale>(() => {
    const valid: AdLocale[] = ['en', 'zh', 'es', 'fr', 'ar', 'hi'];
    if (valid.includes(nextIntlLocale)) return nextIntlLocale;
    if (typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/')[1] as AdLocale;
      if (valid.includes(seg)) return seg;
    }
    return 'en';
  }, [nextIntlLocale]);
  const LINKS = I18N_LINKS[locale];

  let primary: CPSLink['id'];
  let secondary: CPSLink['id'];

  // ====== 最高优先级：从工具 slug + category 精确匹配（转化率 2~5×）======
  const toolMatch = (size === 'rectangle' || size === 'banner' || slot.startsWith('tool-'))
    ? resolveFromToolContext(slot)
    : null;
  if (toolMatch) {
    primary = toolMatch.primary;
    secondary = toolMatch.secondary;
  } else if (size === 'rectangle' || slot.includes('-rectangle') || slot.includes('tool-')) {
    // 工具详情页右侧方形 → 写作用 AI（文字工作者用户）
    primary = 'grammarly-premium';
    secondary = 'korelyy-premium';
  } else if (size === 'in-feed' || slot.includes('infeed') || slot.includes('in-feed')) {
    // 工作流 / 工具列表信息流 → 阿里云 + Notion 双卡片
    primary = 'aliyun-newbie';
    secondary = 'notion-ai-annual';
  } else if (size === 'sticky-bottom') {
    // 底部粘性 → ChatGPT Plus（手机端快速决策）
    primary = 'chatgpt-plus';
    secondary = 'korelyy-premium';
  } else if (size === 'banner') {
    // 横幅 → Notion + Grammarly 联合
    primary = 'notion-ai-annual';
    secondary = 'grammarly-premium';
  } else {
    primary = 'korelyy-premium';
    secondary = 'aliyun-newbie';
  }

  const p = LINKS[primary];
  const s = LINKS[secondary];

  // ---- 尺寸 1：rectangle (300×250) 单卡片堆叠 ----
  if (size === 'rectangle' || slot.includes('-rectangle') || slot.includes('tool-')) {
    return (
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
        className={`relative block w-full h-full min-h-[250px] rounded-xl overflow-hidden bg-gradient-to-br ${p.gradientFrom} ${p.gradientTo} p-5 pt-9 text-white shadow-md hover:scale-[1.02] transition-transform`}
        data-cps-id={p.id}
      >
        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${p.tagBg}`}>
          {p.iconChar} &nbsp;{p.tag}
        </div>
        <div className="mt-2 text-lg font-extrabold leading-tight drop-shadow-sm">
          {p.title}
        </div>
        <div className="mt-1 text-[12px] opacity-92 leading-snug line-clamp-2">
          {p.subtitle}
        </div>
        <div className="absolute bottom-4 right-4 inline-flex items-center px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow">
          {p.cta}
        </div>
      </a>
    );
  }

  // ---- 尺寸 2：in-feed (跨整行) 双卡片 ----
  if (size === 'in-feed' || slot.includes('infeed') || slot.includes('in-feed')) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 pt-8 w-full h-full">
        <InFeedCard link={p} />
        <InFeedCard link={s} />
      </div>
    );
  }

  // ---- 尺寸 3：sticky-bottom (底部横条) ----
  if (size === 'sticky-bottom') {
    return (
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
        className={`flex items-center gap-3 w-full h-full min-h-[50px] sm:min-h-[60px] px-3 sm:px-5 py-2 bg-gradient-to-r ${p.gradientFrom} ${p.gradientTo} text-white hover:brightness-105 transition`}
        data-cps-id={p.id}
      >
        <div className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${p.tagBg} flex items-center justify-center text-lg`}>
          {p.iconChar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] sm:text-sm font-bold truncate">
            {p.title}
          </div>
          <div className="text-[10px] sm:text-[11px] opacity-90 truncate">
            {p.subtitle}
          </div>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-[11px] sm:text-xs font-bold shadow">
          {p.cta}
        </div>
      </a>
    );
  }

  // ---- 尺寸 4：banner (728×90) ----
  if (size === 'banner') {
    return (
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer sponsored nofollow"
        className={`flex items-center gap-4 w-full h-full min-h-[90px] px-5 bg-gradient-to-r ${p.gradientFrom} ${p.gradientTo} text-white hover:brightness-105 transition`}
        data-cps-id={p.id}
      >
        <div className={`shrink-0 w-14 h-14 rounded-xl ${p.tagBg} flex items-center justify-center text-3xl`}>
          {p.iconChar}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${p.tagBg}`}>
            {p.tag}
          </div>
          <div className="mt-1 text-base sm:text-lg font-extrabold truncate">
            {p.title}
          </div>
          <div className="text-[11px] sm:text-xs opacity-92 truncate">
            {p.subtitle} · 右侧卡片：{s.title}
          </div>
        </div>
        <div className="shrink-0 px-4 py-2 rounded-full bg-white/95 text-gray-900 text-sm font-bold shadow">
          {p.cta}
        </div>
      </a>
    );
  }

  // ---- 尺寸 5：auto / banner else → 通用渐变卡 ----
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      className={`relative block w-full h-full min-h-[120px] rounded-xl overflow-hidden bg-gradient-to-br ${p.gradientFrom} ${p.gradientTo} p-4 pt-8 text-white hover:scale-[1.01] transition-transform`}
      data-cps-id={p.id}
    >
      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${p.tagBg}`}>
        {p.iconChar} &nbsp;{p.tag}
      </div>
      <div className="mt-2 text-base sm:text-lg font-extrabold">{p.title}</div>
      <div className="mt-0.5 text-[12px] opacity-92 line-clamp-2">{p.subtitle}</div>
      <div className="absolute bottom-3 right-3 inline-flex items-center px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow">
        {p.cta}
      </div>
    </a>
  );
}

function InFeedCard({ link }: { link: CPSLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      className={`relative block w-full h-full min-h-[120px] rounded-xl overflow-hidden bg-gradient-to-br ${link.gradientFrom} ${link.gradientTo} p-4 text-white shadow hover:scale-[1.01] transition-transform`}
      data-cps-id={link.id}
    >
      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${link.tagBg}`}>
        {link.iconChar} &nbsp;{link.tag}
      </div>
      <div className="mt-2 text-sm sm:text-base font-extrabold leading-tight">{link.title}</div>
      <div className="mt-1 text-[11px] sm:text-xs opacity-92 leading-snug line-clamp-2">
        {link.subtitle}
      </div>
      <div className="absolute bottom-3 right-3 inline-flex items-center px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-[11px] font-bold shadow">
        {link.cta}
      </div>
    </a>
  );
}

