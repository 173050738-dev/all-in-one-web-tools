'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw, User, Sparkles, Crown, Heart, Star } from 'lucide-react';

const borderStyles = [
  { id: 'none', name: '无', color: 'transparent' },
  { id: 'vip', name: 'V认证', color: 'linear-gradient(135deg, #FFD700, #FFA500)' },
  { id: 'rainbow', name: '彩虹', color: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)' },
  { id: 'pink', name: '粉色', color: 'linear-gradient(135deg, #ff6b9d, #c44569)' },
  { id: 'blue', name: '蓝色', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'green', name: '绿色', color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { id: 'orange', name: '橙色', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'silver', name: '银色', color: 'linear-gradient(135deg, #bdc3c7, #2c3e50)' },
];

const stickers = [
  { id: 'none', name: '无', emoji: '' },
  { id: 'crown', name: '皇冠', emoji: '👑', position: 'top-right' },
  { id: 'heart', name: '爱心', emoji: '❤️', position: 'bottom-right' },
  { id: 'star', name: '星星', emoji: '⭐', position: 'top-left' },
  { id: 'fire', name: '火焰', emoji: '🔥', position: 'bottom-left' },
  { id: 'sparkles', name: '闪光', emoji: '✨', position: 'top-right' },
  { id: 'rainbow', name: '彩虹', emoji: '🌈', position: 'top' },
  { id: 'diamond', name: '钻石', emoji: '💎', position: 'bottom-right' },
];

export default function AvatarDecorator() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedBorder, setSelectedBorder] = useState('vip');
  const [selectedSticker, setSelectedSticker] = useState('none');
  const [borderWidth, setBorderWidth] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const getBorderColors = useCallback((borderId: string): string[] => {
    const style = borderStyles.find(s => s.id === borderId);
    if (!style || borderId === 'none') return ['transparent', 'transparent'];
    
    if (borderId === 'rainbow') {
      return ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'];
    }
    if (borderId === 'vip') {
      return ['#FFD700', '#FFA500', '#FFD700'];
    }
    if (borderId === 'pink') return ['#ff6b9d', '#c44569'];
    if (borderId === 'blue') return ['#667eea', '#764ba2'];
    if (borderId === 'green') return ['#11998e', '#38ef7d'];
    if (borderId === 'orange') return ['#f093fb', '#f5576c'];
    if (borderId === 'silver') return ['#bdc3c7', '#2c3e50'];
    return ['#ddd', '#999'];
  }, []);

  const drawAvatar = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      const borderSize = selectedBorder === 'none' ? 0 : borderWidth;
      const avatarSize = size - borderSize * 2;
      const center = size / 2;

      if (selectedBorder !== 'none') {
        const colors = getBorderColors(selectedBorder);
        const gradient = ctx.createConicGradient(0, center, center);
        colors.forEach((color, i) => {
          gradient.addColorStop(i / (colors.length - 1), color);
        });
        ctx.beginPath();
        ctx.arc(center, center, size / 2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();

      const scale = Math.max(avatarSize / img.width, avatarSize / img.height);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;
      const x = center - scaledW / 2;
      const y = center - scaledH / 2;

      ctx.drawImage(img, x, y, scaledW, scaledH);
      ctx.restore();

      const sticker = stickers.find(s => s.id === selectedSticker);
      if (sticker && sticker.emoji) {
        const stickerSize = size * 0.25;
        let sx = center;
        let sy = center;

        switch (sticker.position) {
          case 'top-right':
            sx = size - stickerSize * 0.4;
            sy = stickerSize * 0.4;
            break;
          case 'top-left':
            sx = stickerSize * 0.4;
            sy = stickerSize * 0.4;
            break;
          case 'bottom-right':
            sx = size - stickerSize * 0.4;
            sy = size - stickerSize * 0.4;
            break;
          case 'bottom-left':
            sx = stickerSize * 0.4;
            sy = size - stickerSize * 0.4;
            break;
          case 'top':
            sx = center;
            sy = stickerSize * 0.3;
            break;
        }

        ctx.font = `${stickerSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, sx, sy);
      }

      if (selectedBorder === 'vip') {
        const vBadgeSize = size * 0.18;
        const vx = size - vBadgeSize * 0.3;
        const vy = size - vBadgeSize * 0.3;

        ctx.beginPath();
        ctx.arc(vx, vy, vBadgeSize * 0.6, 0, Math.PI * 2);
        const vGrad = ctx.createLinearGradient(vx - 30, vy - 30, vx + 30, vy + 30);
        vGrad.addColorStop(0, '#FFD700');
        vGrad.addColorStop(1, '#FFA500');
        ctx.fillStyle = vGrad;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = `bold ${vBadgeSize * 0.7}px Arial`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('V', vx, vy);
      }
    };
    img.src = image;
  }, [image, selectedBorder, selectedSticker, borderWidth, getBorderColors]);

  useEffect(() => {
    if (image) {
      drawAvatar();
    }
  }, [image, drawAvatar]);

  const downloadAvatar = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'avatar-decorated.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  const reset = useCallback(() => {
    setImage(null);
    setSelectedBorder('vip');
    setSelectedSticker('none');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const currentBorder = borderStyles.find(s => s.id === selectedBorder);

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
          <div className='p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white'>
            <User className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>头像装饰器</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>一键加V、渐变边框、可爱挂件</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all'
        >
          <div className='w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center'>
            <Upload className='h-8 w-8 text-purple-500' />
          </div>
          <p className='text-gray-700 dark:text-gray-300 font-medium mb-1'>点击上传头像</p>
          <p className='text-gray-500 dark:text-gray-500 text-sm'>支持 JPG、PNG 格式，正方形最佳</p>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col items-center'>
              <div
                ref={previewRef}
                className='w-48 h-48 rounded-full overflow-hidden relative'
                style={{
                  background: currentBorder?.color || 'transparent',
                  padding: selectedBorder === 'none' ? 0 : borderWidth,
                }}
              >
                <img
                  src={image}
                  alt='头像预览'
                  className='w-full h-full object-cover rounded-full'
                />
                {selectedSticker !== 'none' && (
                  <div
                    className='absolute text-4xl'
                    style={{
                      top: stickers.find(s => s.id === selectedSticker)?.position?.includes('top') ? '5%' : 'auto',
                      bottom: stickers.find(s => s.id === selectedSticker)?.position?.includes('bottom') ? '5%' : 'auto',
                      left: stickers.find(s => s.id === selectedSticker)?.position?.includes('left') ? '5%' : 'auto',
                      right: stickers.find(s => s.id === selectedSticker)?.position?.includes('right') ? '5%' : 'auto',
                    }}
                  >
                    {stickers.find(s => s.id === selectedSticker)?.emoji}
                  </div>
                )}
              </div>
              <button
                onClick={reset}
                className='mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1'
              >
                <RotateCcw className='h-3.5 w-3.5' />
                重新选择
              </button>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Sparkles className='h-4 w-4 text-yellow-500' />
              边框样式
            </h3>
            <div className='grid grid-cols-4 gap-2 mb-4'>
              {borderStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedBorder(style.id)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedBorder === style.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div
                    className='w-10 h-10 mx-auto rounded-full'
                    style={{
                      background: style.color,
                      padding: style.id === 'none' ? 0 : 3,
                    }}
                  >
                    <div className='w-full h-full rounded-full bg-gray-200 dark:bg-gray-600' />
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1 text-center'>{style.name}</p>
                </button>
              ))}
            </div>
            {selectedBorder !== 'none' && (
              <div className='space-y-2'>
                <label className='text-sm text-gray-600 dark:text-gray-400'>边框粗细</label>
                <input
                  type='range'
                  min='4'
                  max='20'
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500'
                />
              </div>
            )}
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
              <Crown className='h-4 w-4 text-yellow-500' />
              挂件装饰
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {stickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => setSelectedSticker(sticker.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSticker === sticker.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className='text-2xl text-center'>
                    {sticker.emoji || '❌'}
                  </div>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1 text-center'>{sticker.name}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={downloadAvatar}
            className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2'
          >
            <Download className='h-5 w-5' />
            保存头像
          </button>
        </div>
      )}
    </div>
  );
}
