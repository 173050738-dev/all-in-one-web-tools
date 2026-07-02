'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { RotateCcw, Shuffle, Dices, Sparkles, Plus, X, Check } from 'lucide-react';

const fortuneSticks = [
  { number: '第一签', level: '上上签', text: '万事如意，心想事成', detail: '此签大吉，诸事顺遂，贵人相助，前程似锦。' },
  { number: '第二签', level: '上签', text: '一帆风顺，前程似锦', detail: '事业有成，财运亨通，家庭和睦，身体康健。' },
  { number: '第三签', level: '上签', text: '贵人相助，左右逢源', detail: '外出遇贵，事业上升，财运渐旺，喜事临门。' },
  { number: '第四签', level: '中上签', text: '稳步上升，厚积薄发', detail: '脚踏实地，努力前行，终有所成，不可急躁。' },
  { number: '第五签', level: '中签', text: '平平安安，顺其自然', detail: '守旧为宜，不宜冒进，静待时机，可保平安。' },
  { number: '第六签', level: '中签', text: '有得有失，知足常乐', detail: '得失相伴，不必强求，心态平和，自有福报。' },
  { number: '第七签', level: '中下签', text: '谨慎行事，三思后行', detail: '近期多舛，需防小人，凡事谨慎，可保无虞。' },
  { number: '第八签', level: '下签', text: '时运不济，静待时机', detail: '诸事不顺，宜静不宜动，修身养性，等待转机。' },
];

const yesNoOptions = [
  { result: '一定行！', emoji: '🌟', color: 'text-green-500' },
  { result: '没问题~', emoji: '✅', color: 'text-green-500' },
  { result: '必须的！', emoji: '💯', color: 'text-green-500' },
  { result: '可以试试', emoji: '👍', color: 'text-green-400' },
  { result: '再想想吧', emoji: '🤔', color: 'text-yellow-500' },
  { result: '随缘就好', emoji: '🌿', color: 'text-yellow-500' },
  { result: '不太建议', emoji: '🚫', color: 'text-orange-500' },
  { result: '算了算了', emoji: '❌', color: 'text-red-500' },
];

export default function FortuneSticks() {
  const [mode, setMode] = useState<'fortune' | 'yesno' | 'custom'>('fortune');
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [customOptions, setCustomOptions] = useState<string[]>(['吃火锅', '吃烧烤', '吃日料', '吃沙拉']);
  const [newOption, setNewOption] = useState('');
  const [customResult, setCustomResult] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawFortune = useCallback(() => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * fortuneSticks.length);
      setResult(fortuneSticks[randomIndex]);
      setIsShaking(false);
      setShowResult(true);
    }, 1500);
  }, [isShaking]);

  const drawYesNo = useCallback(() => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * yesNoOptions.length);
      setResult(yesNoOptions[randomIndex]);
      setIsShaking(false);
      setShowResult(true);
    }, 1000);
  }, [isShaking]);

  const drawCustom = useCallback(() => {
    if (isShaking || customOptions.length < 2) return;
    setIsShaking(true);
    setCustomResult('');
    setShowResult(false);

    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * customOptions.length);
      setCustomResult(customOptions[randomIndex]);
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * customOptions.length);
        setCustomResult(customOptions[finalIndex]);
        setIsShaking(false);
        setShowResult(true);
      }
    }, 100);
  }, [isShaking, customOptions]);

  const addOption = useCallback(() => {
    if (newOption.trim() && !customOptions.includes(newOption.trim())) {
      setCustomOptions([...customOptions, newOption.trim()]);
      setNewOption('');
    }
  }, [newOption, customOptions]);

  const removeOption = useCallback((index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  }, [customOptions]);

  const reset = useCallback(() => {
    setResult(null);
    setCustomResult('');
    setShowResult(false);
  }, []);

  const getLevelColor = (level: string) => {
    if (level.includes('上上')) return 'from-red-500 to-pink-500';
    if (level.includes('上签')) return 'from-orange-400 to-yellow-400';
    if (level.includes('中上')) return 'from-green-400 to-emerald-400';
    if (level.includes('中签')) return 'from-blue-400 to-cyan-400';
    if (level.includes('中下')) return 'from-purple-400 to-pink-400';
    return 'from-gray-400 to-slate-500';
  };

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
          <div className='p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white'>
            <Dices className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>随机抽签筒</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>求签、抽决定、纠结症救星</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl'>
        <button
          onClick={() => { setMode('fortune'); reset(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'fortune'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          🎋 求签
        </button>
        <button
          onClick={() => { setMode('yesno'); reset(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'yesno'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          ✅ 是/否
        </button>
        <button
          onClick={() => { setMode('custom'); reset(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'custom'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          🎯 自定义
        </button>
      </div>

      <div className='space-y-6'>
        {mode === 'fortune' && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div
              ref={containerRef}
              className='flex flex-col items-center'
            >
              <div
                className={`w-32 h-40 relative mb-6 ${
                  isShaking ? 'animate-bounce' : ''
                }`}
                style={{
                  animation: isShaking ? 'shake 0.1s infinite' : 'none',
                }}
              >
                <div className='absolute inset-0 bg-gradient-to-b from-red-500 to-red-700 rounded-t-full rounded-b-3xl shadow-xl'>
                  <div className='absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl'>
                    签
                  </div>
                </div>
              </div>

              {showResult && result && (
                <div
                  className={`w-full max-w-sm p-5 rounded-xl bg-gradient-to-br ${getLevelColor(result.level)} text-white text-center shadow-lg`}
                  style={{
                    animation: 'fadeInUp 0.5s ease-out',
                  }}
                >
                  <p className='text-sm opacity-80 mb-1'>{result.number}</p>
                  <p className='text-2xl font-bold mb-1'>{result.level}</p>
                  <p className='text-lg mb-2'>{result.text}</p>
                  <p className='text-sm opacity-90'>{result.detail}</p>
                </div>
              )}

              <button
                onClick={drawFortune}
                disabled={isShaking}
                className='mt-6 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 flex items-center gap-2'
              >
                {isShaking ? (
                  <>
                    <Sparkles className='h-5 w-5 animate-spin' />
                    摇签中...
                  </>
                ) : (
                  <>
                    <Shuffle className='h-5 w-5' />
                    求一支签
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {mode === 'yesno' && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='text-center'>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>默念你的问题，然后点击按钮</p>
              
              <div
                className={`w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center ${
                  isShaking ? 'animate-pulse' : ''
                }`}
              >
                {showResult && result ? (
                  <div className='text-center text-white'>
                    <div className='text-5xl mb-2'>{result.emoji}</div>
                    <p className={`text-xl font-bold ${result.color}`} style={{ color: 'white' }}>{result.result}</p>
                  </div>
                ) : (
                  <span className='text-6xl'>❓</span>
                )}
              </div>

              <button
                onClick={drawYesNo}
                disabled={isShaking}
                className='px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 flex items-center gap-2 mx-auto'
              >
                {isShaking ? (
                  <>
                    <Sparkles className='h-5 w-5 animate-spin' />
                    思考中...
                  </>
                ) : (
                  <>
                    <Dices className='h-5 w-5' />
                    告诉我答案
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {mode === 'custom' && (
          <div className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>🎯 选项列表</h3>
              
              <div className='flex gap-2 mb-3'>
                <input
                  type='text'
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addOption()}
                  placeholder='添加选项...'
                  className='flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
                <button
                  onClick={addOption}
                  className='px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors'
                >
                  <Plus className='h-5 w-5' />
                </button>
              </div>

              <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
                {customOptions.map((option, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-sm'
                  >
                    {option}
                    <button
                      onClick={() => removeOption(index)}
                      className='ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
              </div>

              {customOptions.length < 2 && (
                <p className='text-sm text-red-500 mt-2'>至少需要2个选项哦~</p>
              )}
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center'>
              <div
                className={`w-48 h-48 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center ${
                  isShaking ? 'animate-pulse' : ''
                }`}
              >
                {showResult && customResult ? (
                  <div className='text-center text-white px-4'>
                    <Check className='h-12 w-12 mx-auto mb-2' />
                    <p className='text-xl font-bold'>{customResult}</p>
                  </div>
                ) : (
                  <span className='text-6xl'>🎲</span>
                )}
              </div>

              <button
                onClick={drawCustom}
                disabled={isShaking || customOptions.length < 2}
                className='px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center gap-2 mx-auto'
              >
                {isShaking ? (
                  <>
                    <Sparkles className='h-5 w-5 animate-spin' />
                    抽取中...
                  </>
                ) : (
                  <>
                    <Shuffle className='h-5 w-5' />
                    开始抽取
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {showResult && (
          <button
            onClick={reset}
            className='w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2'
          >
            <RotateCcw className='h-5 w-5' />
            再来一次
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
