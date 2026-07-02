'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Info, Sparkles, X } from 'lucide-react';

export type AdSlotSize =
  | 'banner'       // 728×90  顶部/列表中间横幅
  | 'rectangle'    // 300×250 工具详情侧栏方形
  | 'in-feed'      // 流式 工具列表间隙
  | 'sticky-bottom' // 移动端 底部粘性
  | 'auto';        // 自适应

const CLOSED_ADS_STORAGE_KEY = 'korelyy:closed-ad-slots';

function getClosedSlots(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CLOSED_ADS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveClosedSlot(slotId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const closed = Array.from(new Set([...getClosedSlots(), slotId]));
    window.localStorage.setItem(CLOSED_ADS_STORAGE_KEY, JSON.stringify(closed));
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

  useEffect(() => {
    setMounted(true);
    setIsClosed(getClosedSlots().includes(slot));
  }, [slot]);

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
        // ===== 占位：联盟推荐 / 开发者提示（没配置 Publisher 时显示给用户看的推荐位）=====
        <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-8 gap-2 text-center">
          <Info className="w-6 h-6 text-gray-400" aria-hidden="true" />
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-semibold text-sm">{t('placeholder.title')}</div>
            <div className="text-[11px] opacity-80 max-w-[380px] mx-auto">
              {t('placeholder.hint', { slot, size: s.label })}
            </div>
            <div className="text-[10px] opacity-60 font-mono break-all max-w-[340px] mx-auto pt-1">
              NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxx
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
