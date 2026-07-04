'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
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
    | 'korelyy-premium';
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

const LINKS: Record<CPSLink['id'], CPSLink> = {
  // TODO-CPS-REPLACE: Grammarly 联盟 https://grammarly.go2cloud.org 注册后换这里
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
  // TODO-CPS-REPLACE: 阿里云推广 https://promotion.aliyun.com/ 联盟后台注册
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
  // TODO-CPS-REPLACE: Notion Partner Program https://www.notion.so/partners 注册
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
  // TODO-CPS-REPLACE: ChatGPT Plus 官方充值 / 靠谱代充链接或 OpenAI Affiliate
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
  // 通用兜底推荐：Korelyy 自家 Premium 或联合会员
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
};

interface CPSPlaceholderProps {
  slot: string;
  size: AdSlotSize;
  sizeLabel: string;
}

function AdCPSPlaceholder({ slot, size }: CPSPlaceholderProps) {
  // 选位策略：根据 slot + size 投放不同 CPS
  let primary: CPSLink['id'];
  let secondary: CPSLink['id'];

  if (size === 'rectangle' || slot.includes('-rectangle') || slot.includes('tool-')) {
    // 工具详情页右侧方形 → 放写作用 AI（精准匹配「文字工作者」工具用户）
    primary = 'grammarly-premium';
    secondary = 'korelyy-premium';
  } else if (size === 'in-feed' || slot.includes('infeed') || slot.includes('in-feed')) {
    // 工作流 / 工具列表信息流 → 阿里云 + Notion 双卡片（左云服务器右笔记）
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

