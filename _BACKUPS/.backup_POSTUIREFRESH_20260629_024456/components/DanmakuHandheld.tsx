'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Type,
  Palette,
  Zap,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface DanmakuHandheldProps {
  locale?: string;
}

const presetTexts = [
  { zh: '我爱你', en: 'I LOVE YOU' },
  { zh: '生日快乐', en: 'HAPPY BIRTHDAY' },
  { zh: '加油', en: 'GO GO GO' },
  { zh: '永远支持你', en: 'FOREVER SUPPORT' },
  { zh: '最棒的', en: 'THE BEST' },
];

const presetColors = [
  { name: '红色', value: '#FF0000', bg: '#000000' },
  { name: '绿色', value: '#00FF00', bg: '#000000' },
  { name: '蓝色', value: '#00BFFF', bg: '#000000' },
  { name: '黄色', value: '#FFD700', bg: '#000000' },
  { name: '粉色', value: '#FF69B4', bg: '#000000' },
  { name: '彩虹', value: 'rainbow', bg: '#000000' },
  { name: '白字黑底', value: '#FFFFFF', bg: '#000000' },
  { name: '黑字白底', value: '#000000', bg: '#FFFFFF' },
];

export default function DanmakuHandheld({ locale = 'zh' }: DanmakuHandheldProps) {
  const [text, setText] = useState(locale === 'zh' ? '我爱你' : 'I LOVE YOU');
  const [speed, setSpeed] = useState(5);
  const [fontSize, setFontSize] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);

  const currentColor = presetColors[colorIndex];
  const isRainbow = currentColor.value === 'rainbow';

  useEffect(() => {
    if (!isPlaying || !containerRef.current || !textRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const container = containerRef.current;
    const textEl = textRef.current;
    const containerWidth = container.offsetWidth;
    const textWidth = textEl.offsetWidth;

    positionRef.current = containerWidth;

    const animate = () => {
      positionRef.current -= speed * 0.5;
      if (positionRef.current < -textWidth) {
        positionRef.current = containerWidth;
      }
      if (textEl) {
        textEl.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed, text]);

  const togglePlay = () => {
    if (!text.trim()) return;
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    positionRef.current = 0;
    if (textRef.current) {
      textRef.current.style.transform = 'translateX(0)';
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const rainbowStyle = isRainbow
    ? {
        background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'rainbow 2s linear infinite',
      }
    : { color: currentColor.value };

  const t = {
    title: locale === 'zh' ? '弹幕手持' : 'LED Banner',
    subtitle: locale === 'zh' ? '手机秒变手持弹幕，演唱会/接机/应援必备神器' : 'Turn your phone into an LED banner. Perfect for concerts and events.',
    inputText: locale === 'zh' ? '弹幕文字' : 'Text',
    placeholder: locale === 'zh' ? '输入要显示的文字...' : 'Enter text to display...',
    speed: locale === 'zh' ? '滚动速度' : 'Speed',
    fontSize: locale === 'zh' ? '字体大小' : 'Font Size',
    color: locale === 'zh' ? '颜色样式' : 'Color Style',
    presets: locale === 'zh' ? '快捷文字' : 'Quick Text',
    play: locale === 'zh' ? '开始滚动' : 'Start',
    pause: locale === 'zh' ? '暂停' : 'Pause',
    reset: locale === 'zh' ? '重置' : 'Reset',
    fullscreen: locale === 'zh' ? '全屏' : 'Fullscreen',
    tip: locale === 'zh' ? '💡 提示：横屏手机效果更佳！点击全屏按钮进入横屏模式，举高手机就能当应援牌用啦。' : '💡 Tip: Use landscape mode for best effect! Click fullscreen and hold your phone sideways.',
    features: locale === 'zh' ? '功能特点' : 'Features',
    f1: locale === 'zh' ? '超大字号，远距离也清晰' : 'Huge font, visible from far away',
    f2: locale === 'zh' ? '多种颜色和彩虹效果' : 'Multiple colors & rainbow effect',
    f3: locale === 'zh' ? '可调节滚动速度' : 'Adjustable scroll speed',
    f4: locale === 'zh' ? '支持全屏显示' : 'Fullscreen display',
    f5: locale === 'zh' ? '内置常用快捷文字' : 'Built-in quick text presets',
    f6: locale === 'zh' ? '完全免费，无广告' : '100% free, no ads',
    slow: locale === 'zh' ? '慢' : 'Slow',
    fast: locale === 'zh' ? '快' : 'Fast',
    small: locale === 'zh' ? '小' : 'Small',
    big: locale === 'zh' ? '大' : 'Big',
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <style>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'>
                <Smartphone className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div
                ref={containerRef}
                className='relative w-full h-32 sm:h-40 rounded-xl overflow-hidden flex items-center'
                style={{ backgroundColor: currentColor.bg }}
              >
                <div
                  ref={textRef}
                  className='whitespace-nowrap font-bold whitespace-nowrap'
                  style={{
                    fontSize: `${fontSize}px`,
                    ...rainbowStyle,
                    textShadow: isRainbow ? 'none' : `0 0 10px ${currentColor.value}40`,
                    paddingLeft: '100%',
                  }}
                >
                  {text || ' '}
                </div>
                {!isPlaying && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-gray-500 text-sm'>
                      {locale === 'zh' ? '点击"开始滚动"预览效果' : 'Click "Start" to preview'}
                    </span>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t.inputText}
                    </label>
                    <input
                      type='text'
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        reset();
                      }}
                      placeholder={t.placeholder}
                      className='w-full px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500'
                    />
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t.speed}</label>
                      <span className='text-xs text-gray-500'>{t.slow} <ChevronRight className='w-3 h-3 inline' /> {t.fast}</span>
                    </div>
                    <input
                      type='range'
                      min='1'
                      max='20'
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500'
                    />
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t.fontSize}</label>
                      <span className='text-xs text-gray-500'>{t.small} <ChevronRight className='w-3 h-3 inline' /> {t.big}</span>
                    </div>
                    <input
                      type='range'
                      min='30'
                      max='150'
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500'
                    />
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t.color}
                    </label>
                    <div className='grid grid-cols-4 gap-2'>
                      {presetColors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => { setColorIndex(i); reset(); }}
                          className={`aspect-square rounded-lg border-2 transition-all ${
                            colorIndex === i
                              ? 'border-pink-500 scale-110 shadow-lg'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                          }`}
                          style={{
                            background: c.value === 'rainbow'
                              ? 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)'
                              : c.value,
                            backgroundColor: c.bg,
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t.presets}
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {presetTexts.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => { setText(locale === 'zh' ? p.zh : p.en); reset(); }}
                          className='px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors'
                        >
                          {locale === 'zh' ? p.zh : p.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <button
                  onClick={togglePlay}
                  disabled={!text.trim()}
                  className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                >
                  {isPlaying ? <Pause className='h-4 w-4 sm:h-5 sm:w-5' /> : <Play className='h-4 w-4 sm:h-5 sm:w-5' />}
                  {isPlaying ? t.pause : t.play}
                </button>
                <button
                  onClick={reset}
                  className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium'
                >
                  <RotateCcw className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t.reset}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium'
                >
                  <Maximize2 className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t.fullscreen}
                </button>
              </div>

              <div className='p-3 sm:p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-pink-700 dark:text-pink-300'>
                  {t.tip}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t.features}</h3>
            <ul className='space-y-3'>
              {[t.f1, t.f2, t.f3, t.f4, t.f5, t.f6].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 flex-shrink-0' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
