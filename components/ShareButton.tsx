'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

interface SharePlatform {
  name: string;
  icon: string;
  action: () => void;
}

interface ShareButtonProps {
  title?: string;
}

export default function ShareButton({ title = 'Korelyy - Online Tools Collection' }: ShareButtonProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowQRCode(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const onCloseAll = (e: Event) => {
      const ev = e as CustomEvent<{ except?: string }>;
      if (ev.detail?.except === 'share') return;
      setIsOpen(false);
      setShowQRCode(false);
    };
    window.addEventListener('close-all-overlay-panels', onCloseAll as EventListener);
    return () => window.removeEventListener('close-all-overlay-panels', onCloseAll as EventListener);
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: currentUrl,
        });
        setIsOpen(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.log('Share failed:', err);
        }
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
    setIsOpen(false);
  };

  const sharePlatforms: SharePlatform[] = locale === 'zh'
    ? [
        {
          name: '微信',
          icon: '💬',
          action: () => {
            setShowQRCode(true);
          },
        },
        {
          name: 'QQ',
          icon: '🐧',
          action: () => {
            const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent('发现一个超好用的在线工具集合网站！')}`;
            openShareWindow(qqUrl);
          },
        },
        {
          name: '微博',
          icon: '📝',
          action: () => {
            const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title + ' - 发现一个超好用的在线工具集合网站！')}`;
            openShareWindow(weiboUrl);
          },
        },
        {
          name: copied ? '已复制!' : '复制链接',
          icon: copied ? '✅' : '🔗',
          action: copyToClipboard,
        },
        {
          name: '二维码',
          icon: '📱',
          action: () => {
            setShowQRCode(true);
          },
        },
      ]
    : [
        {
          name: 'Facebook',
          icon: '📘',
          action: () => {
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
            openShareWindow(fbUrl);
          },
        },
        {
          name: 'Twitter/X',
          icon: '🐦',
          action: () => {
            const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Check out this amazing free online tools collection: ' + title)}`;
            openShareWindow(twitterUrl);
          },
        },
        {
          name: 'WhatsApp',
          icon: '💬',
          action: () => {
            const waUrl = `https://wa.me/?text=${encodeURIComponent('Check out this amazing free online tools collection: ' + title + ' ' + currentUrl)}`;
            openShareWindow(waUrl);
          },
        },
        {
          name: 'LinkedIn',
          icon: '💼',
          action: () => {
            const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
            openShareWindow(liUrl);
          },
        },
        {
          name: 'Telegram',
          icon: '✈️',
          action: () => {
            const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Check out this amazing free online tools collection: ' + title)}`;
            openShareWindow(tgUrl);
          },
        },
        {
          name: copied ? 'Copied!' : 'Copy Link',
          icon: copied ? '✅' : '🔗',
          action: copyToClipboard,
        },
        {
          name: 'QR Code',
          icon: '📱',
          action: () => {
            setShowQRCode(true);
          },
        },
      ];

  return (
    <div className='relative'>
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            window.dispatchEvent(new CustomEvent('close-all-overlay-panels', { detail: { except: 'share' } }));
          }
          setIsOpen(!isOpen);
          setShowQRCode(false);
        }}
        className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xs font-medium'
        aria-label='Share'
      >
        <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
        </svg>
        <span className='hidden sm:inline'>
          {locale === 'zh' ? '分享' : 'Share'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/20 z-40'
            onClick={() => {
              setIsOpen(false);
              setShowQRCode(false);
            }}
          />

          <div
            ref={panelRef}
            className={`fixed top-20 left-3 right-3 sm:left-auto sm:right-4 lg:right-8 w-auto sm:w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[70vh] flex flex-col z-50`}
          >
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-sm'>
                {showQRCode 
                  ? (locale === 'zh' ? '二维码' : 'QR Code')
                  : (locale === 'zh' ? '分享到' : 'Share to')
                }
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowQRCode(false);
                }}
                className='p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='overflow-y-auto flex-1'>
              {showQRCode ? (
                <div className='p-4 flex flex-col items-center'>
                  <div className='bg-white p-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm'>
                    <QRCodeSVG
                      value={currentUrl}
                      size={isMobile ? 100 : 140}
                      level='H'
                      includeMargin={true}
                    />
                  </div>
                  <p className='mt-3 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed px-2'>
                    {locale === 'zh'
                      ? '使用微信/相机扫描二维码'
                      : 'Scan with WeChat/camera to open'}
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className='mt-3 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]'
                  >
                    <span>{copied ? (locale === 'zh' ? '已复制!' : 'Copied!') : (locale === 'zh' ? '复制链接' : 'Copy Link')}</span>
                  </button>
                  <button
                    onClick={() => setShowQRCode(false)}
                    className='mt-2 w-full py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-h-[40px]'
                  >
                    {locale === 'zh' ? '返回分享' : 'Back to Share'}
                  </button>
                </div>
              ) : (
                <>
                  {isMobile && typeof navigator.share === 'function' && (
                    <button
                      onClick={handleNativeShare}
                      className='w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 min-h-[48px]'
                    >
                      <span className='text-xl'>📤</span>
                      <span className='font-medium text-gray-700 dark:text-gray-200 text-sm'>
                        {locale === 'zh' ? '系统分享' : 'More...'}
                      </span>
                    </button>
                  )}

                  <div className={`p-3 grid gap-2 ${isMobile ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    {sharePlatforms.map((platform) => (
                      <button
                        key={platform.name}
                        onClick={platform.action}
                        className='flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[52px] justify-center'
                      >
                        <span className='text-xl'>{platform.icon}</span>
                        <span className='text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-tight text-center'>
                          {platform.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
