'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Sparkles, Shuffle, Copy, Check } from 'lucide-react';

const faceEmojis = ['😀', '😂', '🥰', '😎', '🤔', '😴', '🤯', '🥺', '😈', '👻', '🤖', '👽', '🎃', '🐱', '🐶', '🐰', '🦊', '🐼'];
const elementEmojis = ['❤️', '🔥', '💎', '⭐', '🌟', '💫', '🎉', '🎊', '🌈', '☀️', '🌙', '⚡', '💧', '🍀', '🌸', '🎀', '👑', '🎭'];
const mouthEmojis = ['👄', '💋', '😬', '👅'];
const accessoryEmojis = ['🕶️', '👓', '🎩', '🧢', '💄', '💍', '🧣', '🎀'];

type Combination = {
  left: string;
  right: string;
  result: string;
  name: string;
};

const presetCombinations: Combination[] = [
  { left: '😀', right: '🔥', result: '🔥😀🔥', name: '火到爆' },
  { left: '😎', right: '👑', result: '😎👑', name: '大佬' },
  { left: '🥰', right: '❤️', result: '❤️🥰❤️', name: '爱意满满' },
  { left: '👻', right: '🎃', result: '🎃👻🎃', name: '万圣节' },
  { left: '🤖', right: '⚡', result: '⚡🤖⚡', name: '机械觉醒' },
  { left: '🐱', right: '👑', result: '👑🐱', name: '猫主子' },
  { left: '🐶', right: '❤️', result: '🐶💕', name: '修勾爱你' },
  { left: '😴', right: '💤', result: '😴💤', name: '困到不行' },
  { left: '🤯', right: '💥', result: '🤯💥', name: '脑袋爆炸' },
  { left: '🥺', right: '💧', result: '🥺💧', name: '委屈巴巴' },
  { left: '😈', right: '🔥', result: '😈🔥', name: '小恶魔' },
  { left: '🌈', right: '🦄', result: '🌈🦄🌈', name: '彩虹独角兽' },
];

export default function EmojiMixer() {
  const [leftEmoji, setLeftEmoji] = useState('😀');
  const [rightEmoji, setRightEmoji] = useState('🔥');
  const [resultEmoji, setResultEmoji] = useState('');
  const [resultName, setResultName] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<'faces' | 'elements' | 'accessories'>('faces');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mixEmojis = useCallback(() => {
    setIsAnimating(true);
    
    const preset = presetCombinations.find(
      c => (c.left === leftEmoji && c.right === rightEmoji) ||
           (c.left === rightEmoji && c.right === leftEmoji)
    );

    setTimeout(() => {
      if (preset) {
        setResultEmoji(preset.result);
        setResultName(preset.name);
      } else {
        const patterns = [
          `${leftEmoji}${rightEmoji}`,
          `${rightEmoji}${leftEmoji}${rightEmoji}`,
          `${leftEmoji}✨${rightEmoji}`,
          `${leftEmoji}${rightEmoji}${leftEmoji}`,
          `✨${leftEmoji}${rightEmoji}✨`,
        ];
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        setResultEmoji(randomPattern);
        setResultName('神秘组合');
      }
      setIsAnimating(false);
    }, 800);
  }, [leftEmoji, rightEmoji]);

  const randomMix = useCallback(() => {
    const randomFace = faceEmojis[Math.floor(Math.random() * faceEmojis.length)];
    const randomElement = elementEmojis[Math.floor(Math.random() * elementEmojis.length)];
    setLeftEmoji(randomFace);
    setRightEmoji(randomElement);
    
    setTimeout(() => {
      mixEmojis();
    }, 100);
  }, [mixEmojis]);

  const copyResult = useCallback(() => {
    navigator.clipboard.writeText(resultEmoji);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [resultEmoji]);

  const drawResult = useCallback(() => {
    if (!canvasRef.current || !resultEmoji) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, '#fef3c7');
    gradient.addColorStop(1, '#fde68a');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(resultEmoji, size/2, size/2);
  }, [resultEmoji]);

  useEffect(() => {
    if (resultEmoji) {
      drawResult();
    }
  }, [resultEmoji, drawResult]);

  const currentEmojis = activeTab === 'faces' ? faceEmojis : activeTab === 'elements' ? elementEmojis : accessoryEmojis;

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='mb-6'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4'
        >
          <RotateCcw className='h-4 w-4' />
          <span>返回</span>
        </button>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white'>
            <Sparkles className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Emoji 表情合成器</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>两个emoji合成一个新表情，太好玩了！</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      <div className='space-y-6'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-center gap-4 mb-6'>
            <div
              className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform border-2 border-dashed border-gray-200 dark:border-gray-600'
            >
              {leftEmoji}
            </div>
            <div className='text-3xl text-gray-300'>+</div>
            <div
              className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform border-2 border-dashed border-gray-200 dark:border-gray-600'
            >
              {rightEmoji}
            </div>
            <div className='text-3xl text-gray-300'>=</div>
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border-2 border-yellow-300 dark:border-yellow-700 ${
                isAnimating ? 'animate-bounce' : ''
              }`}
            >
              {isAnimating ? '❓' : resultEmoji || '❓'}
            </div>
          </div>

          {resultName && !isAnimating && (
            <div className='text-center mb-4'>
              <span className='inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-medium rounded-full'>
                ✨ {resultName} ✨
              </span>
            </div>
          )}

          <div className='flex gap-3 justify-center'>
            <button
              onClick={mixEmojis}
              disabled={isAnimating}
              className='px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center gap-2'
            >
              <Sparkles className='h-4 w-4' />
              开始合成
            </button>
            <button
              onClick={randomMix}
              className='px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2'
            >
              <Shuffle className='h-4 w-4' />
              随机
            </button>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3'>
            <button
              onClick={() => setActiveTab('faces')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'faces'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              😀 表情脸
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'elements'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              ⭐ 元素
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'accessories'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              👑 配饰
            </button>
          </div>

          <div className='grid grid-cols-6 gap-2 mb-4'>
            {currentEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  if (activeTab === 'faces') {
                    setLeftEmoji(emoji);
                  } else {
                    setRightEmoji(emoji);
                  }
                }}
                className={`p-2 text-2xl sm:text-3xl rounded-xl transition-all hover:scale-110 ${
                  (activeTab === 'faces' && leftEmoji === emoji) ||
                  (activeTab !== 'faces' && rightEmoji === emoji)
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 scale-110'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <p className='text-xs text-gray-500 dark:text-gray-400 text-center'>
            💡 点击表情脸选择左边，点击元素/配饰选择右边，然后点"开始合成"
          </p>
        </div>

        {resultEmoji && !isAnimating && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>🎉 合成结果</h3>
            <div className='flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl'>
              <span className='text-4xl sm:text-5xl'>{resultEmoji}</span>
              <div className='flex gap-2'>
                <button
                  onClick={copyResult}
                  className='px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5 shadow-sm'
                >
                  {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                  {copied ? '已复制' : '复制'}
                </button>
                <button
                  onClick={() => {
                    if (!canvasRef.current) return;
                    const link = document.createElement('a');
                    link.download = 'emoji-mix.png';
                    link.href = canvasRef.current.toDataURL('image/png');
                    link.click();
                  }}
                  className='px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors flex items-center gap-1.5 shadow-sm'
                >
                  <Download className='h-4 w-4' />
                  保存图片
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>🔥 热门组合</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
            {presetCombinations.slice(0, 6).map((combo, index) => (
              <button
                key={index}
                onClick={() => {
                  setLeftEmoji(combo.left);
                  setRightEmoji(combo.right);
                  setResultEmoji(combo.result);
                  setResultName(combo.name);
                }}
                className='p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left'
              >
                <div className='text-2xl mb-1'>{combo.result}</div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{combo.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
