'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Grid3X3, RotateCcw, Image as ImageIcon, Check } from 'lucide-react';

export default function GridCutter() {
  const [image, setImage] = useState<string | null>(null);
  const [slices, setSlices] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setSlices([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      const sliceSize = Math.floor(size / 3);
      const outputSize = 1080;

      const newSlices: string[] = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          canvas.width = outputSize;
          canvas.height = outputSize;

          ctx.drawImage(
            img,
            startX + col * sliceSize,
            startY + row * sliceSize,
            sliceSize,
            sliceSize,
            0,
            0,
            outputSize,
            outputSize
          );

          newSlices.push(canvas.toDataURL('image/jpeg', 0.95));
        }
      }

      setSlices(newSlices);
      setIsProcessing(false);
    };
    img.src = image;
  }, [image]);

  const downloadSlice = useCallback((dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.download = `grid-${index + 1}.jpg`;
    link.href = dataUrl;
    link.click();
  }, []);

  const downloadAll = useCallback(() => {
    slices.forEach((slice, index) => {
      setTimeout(() => downloadSlice(slice, index), index * 200);
    });
  }, [slices, downloadSlice]);

  const reset = useCallback(() => {
    setImage(null);
    setSlices([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div className='p-3 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl text-white'>
            <Grid3X3 className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>九宫格切图</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>一键切成9张图，发朋友圈神器</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-all'
        >
          <div className='w-16 h-16 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center'>
            <Upload className='h-8 w-8 text-pink-500' />
          </div>
          <p className='text-gray-700 dark:text-gray-300 font-medium mb-1'>点击上传图片</p>
          <p className='text-gray-500 dark:text-gray-500 text-sm'>支持 JPG、PNG 格式，自动裁成正方形</p>
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
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>原图预览</h3>
              <button
                onClick={reset}
                className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1'
              >
                <RotateCcw className='h-3.5 w-3.5' />
                重新选择
              </button>
            </div>
            <div className='relative max-w-sm mx-auto'>
              <img
                src={image}
                alt='原图'
                className='w-full aspect-square object-cover rounded-xl'
              />
              <div className='absolute inset-0 pointer-events-none'>
                <div className='w-full h-full grid grid-cols-3 grid-rows-3'>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className='border border-white/50' />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {slices.length === 0 && (
            <button
              onClick={processImage}
              disabled={isProcessing}
              className='w-full py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  处理中...
                </>
              ) : (
                <>
                  <Grid3X3 className='h-5 w-5' />
                  开始切图
                </>
              )}
            </button>
          )}

          {slices.length > 0 && (
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                  <Check className='h-5 w-5 text-green-500' />
                  切图完成！
                </h3>
                <button
                  onClick={downloadAll}
                  className='px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-1.5'
                >
                  <Download className='h-4 w-4' />
                  下载全部
                </button>
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>按顺序保存到相册，发朋友圈更有逼格 ✨</p>
              <div className='grid grid-cols-3 gap-2'>
                {slices.map((slice, index) => (
                  <div
                    key={index}
                    onClick={() => downloadSlice(slice, index)}
                    className='relative aspect-square rounded-lg overflow-hidden cursor-pointer group'
                  >
                    <img src={slice} alt={`切片 ${index + 1}`} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center'>
                      <Download className='h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                    </div>
                    <div className='absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-medium'>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
