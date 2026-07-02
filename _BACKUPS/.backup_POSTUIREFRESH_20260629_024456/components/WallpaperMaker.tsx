'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, RotateCcw, Type, Palette, Shuffle, Image as ImageIcon } from 'lucide-react';

const gradients = [
  { id: 'sunset', name: '日落', colors: ['#ff6b6b', '#feca57'] },
  { id: 'ocean', name: '海洋', colors: ['#2e86de', '#00d2d3'] },
  { id: 'forest', name: '森林', colors: ['#10ac84', '#1dd1a1'] },
  { id: 'purple', name: '紫霞', colors: ['#a55eea', '#8854d0'] },
  { id: 'pink', name: '樱花', colors: ['#fd79a8', '#e84393'] },
  { id: 'orange', name: '暖阳', colors: ['#fd9644', '#fa8231'] },
  { id: 'blue', name: '冰蓝', colors: ['#45aaf2', '#2d98da'] },
  { id: 'mint', name: '薄荷', colors: ['#26de81', '#20bf6b'] },
  { id: 'peach', name: '蜜桃', colors: ['#fc5c65', '#fd9644'] },
  { id: 'lavender', name: '薰衣草', colors: ['#a55eea', '#d6a2e8'] },
  { id: 'midnight', name: '午夜', colors: ['#1e272e', '#485460'] },
  { id: 'candy', name: '糖果', colors: ['#ff6b9d', '#c44569'] },
  { id: 'aurora', name: '极光', colors: ['#00d2d3', '#54a0ff'] },
  { id: 'flame', name: '火焰', colors: ['#ff4757', '#ff6348'] },
  { id: 'emerald', name: '翡翠', colors: ['#00b894', '#55efc4'] },
  { id: 'golden', name: '金色', colors: ['#fdcb6e', '#e17055'] },
];

const fontStyles = [
  { id: 'normal', name: '默认', weight: 'normal', style: 'normal' },
  { id: 'bold', name: '粗体', weight: 'bold', style: 'normal' },
  { id: 'light', name: '细体', weight: '300', style: 'normal' },
  { id: 'italic', name: '斜体', weight: 'normal', style: 'italic' },
];

const presetTexts = [
  '今天也要加油鸭',
  '一切都是最好的安排',
  '愿你被世界温柔以待',
  '保持热爱，奔赴山海',
  '未来可期',
  '好事正在路上',
  '做自己的太阳',
  '生活明朗，万物可爱',
];

export default function WallpaperMaker() {
  const [selectedGradient, setSelectedGradient] = useState('sunset');
  const [text, setText] = useState('今天也要加油鸭');
  const [fontSize, setFontSize] = useState(48);
  const [fontStyle, setFontStyle] = useState('bold');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<CanvasTextAlign>('center');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const gradient = gradients.find(g => g.id === selectedGradient) || gradients[0];

  const drawWallpaper = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const gradientObj = ctx.createLinearGradient(0, 0, width, height);
    gradientObj.addColorStop(0, gradient.colors[0]);
    gradientObj.addColorStop(1, gradient.colors[1]);
    ctx.fillStyle = gradientObj;
    ctx.fillRect(0, 0, width, height);

    if (text) {
      const style = fontStyles.find(f => f.id === fontStyle) || fontStyles[0];
      ctx.fillStyle = textColor;
      ctx.font = `${style.weight} ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';

      let x = width / 2;
      if (textAlign === 'left') x = width * 0.1;
      if (textAlign === 'right') x = width * 0.9;

      const lines = text.split('\n');
      const lineHeight = fontSize * 1.4;
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
      });
    }
  }, [gradient, text, fontSize, fontStyle, textColor, textAlign]);

  useEffect(() => {
    drawWallpaper();
  }, [drawWallpaper]);

  const downloadWallpaper = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'wallpaper.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const randomize = useCallback(() => {
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const randomText = presetTexts[Math.floor(Math.random() * presetTexts.length)];
    setSelectedGradient(randomGradient.id);
    setText(randomText);
  }, []);

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
          <div className='p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white'>
            <ImageIcon className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>手机壁纸工坊</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>渐变+文字，打造专属壁纸</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Palette className='h-4 w-4 text-indigo-500' />
              渐变颜色
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {gradients.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGradient(g.id)}
                  className={`aspect-square rounded-xl transition-all ${
                    selectedGradient === g.id
                      ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                  }}
                  title={g.name}
                />
              ))}
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Type className='h-4 w-4 text-indigo-500' />
              文字设置
            </h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
              rows={3}
              placeholder='输入你想写的文字...'
            />
            <div className='mt-3 grid grid-cols-2 gap-2'>
              <button
                onClick={() => setTextColor('#ffffff')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  textColor === '#ffffff'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ⬜ 白字
              </button>
              <button
                onClick={() => setTextColor('#1a1a2e')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  textColor === '#1a1a2e'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ⬛ 黑字
              </button>
            </div>

            <div className='mt-3 space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-sm text-gray-600 dark:text-gray-400'>字号大小</label>
                <span className='text-sm text-gray-500'>{fontSize}px</span>
              </div>
              <input
                type='range'
                min='24'
                max='96'
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500'
              />
            </div>

            <div className='mt-3 flex gap-2'>
              {fontStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFontStyle(style.id)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    fontStyle === style.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  style={{ fontWeight: style.weight, fontStyle: style.style }}
                >
                  {style.name}
                </button>
              ))}
            </div>

            <div className='mt-3 flex gap-2'>
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => setTextAlign(align as 'left' | 'center' | 'right')}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    textAlign === align
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {align === 'left' ? '左对齐' : align === 'center' ? '居中' : '右对齐'}
                </button>
              ))}
            </div>

            <div className='mt-3'>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>💡 推荐文案</p>
              <div className='flex flex-wrap gap-1.5'>
                {presetTexts.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setText(t)}
                    className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    {t.length > 8 ? t.slice(0, 8) + '...' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={randomize}
            className='w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2'
          >
            <Shuffle className='h-5 w-5' />
            随机一个
          </button>
        </div>

        <div className='space-y-4'>
          <div className='flex justify-center'>
            <div
              ref={previewRef}
              className='w-64 h-[450px] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-gray-200 dark:border-gray-700'
              style={{
                background: `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]})`,
              }}
            >
              <div className='absolute inset-0 flex items-center justify-center p-8'>
                <p
                  style={{
                    color: textColor,
                    fontSize: `${fontSize * 0.35}px`,
                    fontWeight: fontStyles.find(f => f.id === fontStyle)?.weight || 'normal',
                    fontStyle: fontStyles.find(f => f.id === fontStyle)?.style || 'normal',
                    textAlign: textAlign,
                    lineHeight: 1.4,
                  }}
                >
                  {text || '预览文字'}
                </p>
              </div>
              <div className='absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full' />
            </div>
          </div>

          <button
            onClick={downloadWallpaper}
            className='w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2'
          >
            <Download className='h-5 w-5' />
            下载壁纸 (1080×1920)
          </button>

          <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
            📱 适配大部分手机屏幕，点击保存到相册即可设置
          </p>
        </div>
      </div>
    </div>
  );
}
