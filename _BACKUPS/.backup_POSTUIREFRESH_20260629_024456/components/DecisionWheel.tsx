'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shuffle,
  Plus,
  Trash2,
  RotateCcw,
  Settings,
  Sparkles,
  Edit3,
  X,
} from 'lucide-react';

interface DecisionWheelProps {
  locale?: string;
}

const presetOptions = [
  { name: '中午吃什么', options: ['火锅', '烧烤', '日料', '快餐', '面条', '饺子', '麻辣烫', '沙拉'] },
  { name: '周末去哪玩', options: ['看电影', '逛商场', '公园散步', '在家躺平', '打游戏', '读书', '运动', '喝咖啡'] },
  { name: '今晚玩什么', options: ['王者荣耀', '原神', '英雄联盟', '吃鸡', '塞尔达', '看剧', '刷抖音', '睡觉'] },
];

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
];

export default function DecisionWheel({ locale = 'zh' }: DecisionWheelProps) {
  const [options, setOptions] = useState<string[]>(['火锅', '烧烤', '日料', '快餐', '面条', '饺子', '麻辣烫', '沙拉']);
  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const center = size / 2;
    const radius = size / 2 - 10;
    const segmentAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    options.forEach((option, i) => {
      const startAngle = i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, radius / 8)}px sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2;
      const displayText = option.length > 6 ? option.slice(0, 6) + '...' : option;
      ctx.fillText(displayText, radius - 15, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 35, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(locale === 'zh' ? '开始' : 'GO', center, center);
  }, [options, locale]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);
    const targetAngle = randomIndex * segmentAngle + segmentAngle / 2;
    const spins = 5 + Math.random() * 3;
    const finalRotation = rotation + spins * 360 + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(options[randomIndex]);
    }, 4000);
  };

  const addOption = () => {
    if (!newOption.trim() || options.length >= 12) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(options[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    const newOptions = [...options];
    newOptions[editingIndex] = editValue.trim();
    setOptions(newOptions);
    setEditingIndex(null);
    setEditValue('');
  };

  const loadPreset = (preset: typeof presetOptions[0]) => {
    setOptions([...preset.options]);
    setResult(null);
    setRotation(0);
  };

  const reset = () => {
    setResult(null);
    setRotation(0);
  };

  const t = {
    title: locale === 'zh' ? '决定转盘' : 'Decision Wheel',
    subtitle: locale === 'zh' ? '纠结症患者的福音！让转盘帮你做决定，午餐吃什么、周末去哪玩，转一下就知道' : 'Can\'t decide? Spin the wheel and let fate decide!',
    presets: locale === 'zh' ? '快捷模板' : 'Quick Presets',
    options: locale === 'zh' ? '选项设置' : 'Options',
    addOption: locale === 'zh' ? '添加选项' : 'Add Option',
    placeholder: locale === 'zh' ? '输入新选项...' : 'Enter new option...',
    spin: locale === 'zh' ? '开始转盘' : 'Spin',
    spinning: locale === 'zh' ? '转动中...' : 'Spinning...',
    result: locale === 'zh' ? '结果是' : 'Result',
    reset: locale === 'zh' ? '重新开始' : 'Reset',
    tip: locale === 'zh' ? '💡 提示：点击中间的"开始"或下方按钮转动转盘。支持 2-12 个选项，可以添加、编辑或删除。' : '💡 Tip: Click "GO" in the center or the button below to spin. Supports 2-12 options.',
    features: locale === 'zh' ? '功能特点' : 'Features',
    f1: locale === 'zh' ? '自定义选项（2-12个）' : 'Custom options (2-12 items)',
    f2: locale === 'zh' ? '内置常用快捷模板' : 'Built-in quick presets',
    f3: locale === 'zh' ? '流畅的转盘动画' : 'Smooth spin animation',
    f4: locale === 'zh' ? '完全随机公平公正' : 'Truly random & fair',
    f5: locale === 'zh' ? '支持编辑和删除' : 'Edit & delete options',
    f6: locale === 'zh' ? '完全免费无广告' : '100% free, no ads',
    maxReached: locale === 'zh' ? '最多12个选项' : 'Max 12 options',
    minRequired: locale === 'zh' ? '至少需要2个选项' : 'Need at least 2 options',
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'>
                <Shuffle className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='absolute -top-2 left-1/2 -translate-x-1/2 z-10'>
                    <div className='w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg' />
                  </div>
                  <div
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={320}
                      onClick={spin}
                      className='w-64 h-64 sm:w-80 sm:h-80 cursor-pointer select-none'
                    />
                  </div>
                </div>
              </div>

              {result && !isSpinning && (
                <div className='text-center animate-bounce'>
                  <div className='inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl shadow-lg'>
                    <p className='text-sm opacity-80 mb-1'>{t.result} 🎉</p>
                    <p className='text-2xl sm:text-3xl font-bold'>{result}</p>
                  </div>
                </div>
              )}

              <div className='flex justify-center gap-3'>
                <button
                  onClick={spin}
                  disabled={isSpinning || options.length < 2}
                  className='flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                >
                  <Sparkles className='h-5 w-5' />
                  {isSpinning ? t.spinning : t.spin}
                </button>
                <button
                  onClick={reset}
                  disabled={isSpinning}
                  className='flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <RotateCcw className='h-5 w-5' />
                </button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                    <Sparkles className='w-4 h-4 text-orange-500' />
                    {t.presets}
                  </h3>
                  <div className='space-y-2'>
                    {presetOptions.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => loadPreset(preset)}
                        className='w-full text-left px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm'
                      >
                        {locale === 'zh' ? preset.name : preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                    <Settings className='w-4 h-4 text-orange-500' />
                    {t.options} ({options.length}/12)
                  </h3>
                  <div className='flex gap-2 mb-3'>
                    <input
                      type='text'
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addOption()}
                      placeholder={t.placeholder}
                      maxLength={10}
                      className='flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                    />
                    <button
                      onClick={addOption}
                      disabled={!newOption.trim() || options.length >= 12}
                      className='px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      <Plus className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='space-y-1.5 max-h-48 overflow-y-auto'>
                    {options.map((option, i) => (
                      <div
                        key={i}
                        className='flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 group'
                      >
                        <div
                          className='w-3 h-3 rounded-full flex-shrink-0'
                          style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        {editingIndex === i ? (
                          <>
                            <input
                              type='text'
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') setEditingIndex(null);
                              }}
                              autoFocus
                              maxLength={10}
                              className='flex-1 px-2 py-1 rounded border border-orange-300 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500'
                            />
                            <button
                              onClick={saveEdit}
                              className='p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded'
                            >
                              <span className='text-xs font-medium'>✓</span>
                            </button>
                            <button
                              onClick={() => setEditingIndex(null)}
                              className='p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <X className='w-3 h-3' />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>{option}</span>
                            <button
                              onClick={() => startEdit(i)}
                              className='p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                              <Edit3 className='w-3.5 h-3.5' />
                            </button>
                            <button
                              onClick={() => removeOption(i)}
                              disabled={options.length <= 2}
                              className='p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed'
                            >
                              <Trash2 className='w-3.5 h-3.5' />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-orange-700 dark:text-orange-300'>
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
                  <span className='w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0' />
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
