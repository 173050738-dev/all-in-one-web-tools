'use client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Image as ImageIcon, Download, Upload, Settings, Home, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import { categories } from '@/data/categories';

import { useParams, usePathname } from 'next/navigation';
const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathSlug = (() => {
    const m = pathname.match(/\/tool\/([^/]+)/);
    return m ? m[1] : undefined;
  })();
const pathLocale = (() => {
  const lm = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const rawLocale = (lm && lm[1]) ? lm[1] : ''; return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'zh');
})();
const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;
  const t = useTranslations('tool');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');
  const tool = getToolBySlug((resolvedParams?.slug ?? pathSlug) as string);
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const { addToHistory } = usePreferencesStore();
  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
      document.title = `${tool.name} - Korelyy Tools`;
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', tool.description);
    }
  }, [tool]);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.7);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} - Korelyy Tools`;
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', tool.description);
    }
  }, [tool]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    setOriginalFile(file);
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOriginalImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    setOriginalFile(file);
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setOriginalImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!originalImage || !originalFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      const outputType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(outputType, quality);
      setCompressedImage(compressedDataUrl);

      const base64Length = compressedDataUrl.split(',')[1].length;
      const estimatedSize = Math.floor((base64Length * 3) / 4);
      setCompressedSize(estimatedSize);
      setIsProcessing(false);
    };
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!compressedImage || !originalFile) return;
    const link = document.createElement('a');
    const ext = originalFile.type === 'image/png' ? '.png' : '.jpg';
    link.download = `compressed_${originalFile.name.replace(/\.[^/.]+$/, '')}${ext}`;
    link.href = compressedImage;
    link.click();
  };

  const savedPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  if (!tool) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <p className='text-gray-600 dark:text-gray-400'>工具不存在。</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-wrap items-center gap-1.5 text-xs sm:text-sm mb-6'>
        <a href={`/${resolvedLocale}`} className='flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[28px]'>
          <Home className='h-4 w-4' />
          <span>{breadcrumbT('home')}</span>
        </a>
        {tool && (() => {
          const cat = categories.find((c) => c.id === tool.category);
          if (!cat) return null;
          return (
            <>
              <ChevronRight className='h-3.5 w-3.5 text-gray-400 shrink-0' />
              <a
                href={`/${resolvedLocale}?category=${cat.id}`}
                className='text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[180px]'
              >
                {sidebarT(cat.id)}
              </a>
            </>
          );
        })()}
        {tool && (
          <>
            <ChevronRight className='h-3.5 w-3.5 text-gray-400 shrink-0' />
            <span className='font-medium text-gray-900 dark:text-gray-100 truncate max-w-[260px]'>{tool.name}</span>
          </>
        )}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <aside className='lg:col-span-2 hidden lg:block'>
          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('related')}</h3>
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} locale={resolvedLocale} />
            ))}
          </div>
        </aside>
        <main className='lg:col-span-7'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                <ImageIcon className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{tool.name}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{tool.description}</p>
              </div>
            </div>

            <div
              className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 sm:p-8 text-center mb-4 sm:mb-6 cursor-pointer hover:border-primary-400 dark:hover:border-primary-600 transition-colors'
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />
              <Upload className='h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4' />
              <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-1'>
                点击或拖拽上传图片
              </p>
              <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                支持 JPG、PNG、WebP、GIF 等格式
              </p>
            </div>

            {originalImage && (
              <div className='space-y-4 sm:space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>原图</label>
                      <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>{formatSize(originalSize)}</span>
                    </div>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800'>
                      <img src={originalImage} alt='Original' className='w-full h-40 sm:h-48 object-contain' />
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>压缩后</label>
                      <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                        {compressedSize > 0 ? formatSize(compressedSize) : '--'}
                        {savedPercent > 0 && <span className='text-green-500 ml-1'>(-{savedPercent}%)</span>}
                      </span>
                    </div>
                    <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800'>
                      {compressedImage ? (
                        <img src={compressedImage} alt='Compressed' className='w-full h-40 sm:h-48 object-contain' />
                      ) : (
                        <div className='w-full h-40 sm:h-48 flex items-center justify-center text-gray-400 text-sm'>
                          点击开始压缩
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4 sm:h-5 sm:w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>压缩设置</span>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                    <div>
                      <div className='flex items-center justify-between mb-1'>
                        <label className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>压缩质量</label>
                        <span className='text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium'>{Math.round(quality * 100)}%</span>
                      </div>
                      <input
                        type='range'
                        min='0.1'
                        max='1'
                        step='0.05'
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500'
                      />
                    </div>
                    <div>
                      <div className='flex items-center justify-between mb-1'>
                        <label className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>最大宽度</label>
                        <span className='text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium'>{maxWidth}px</span>
                      </div>
                      <select
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                        className='w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                      >
                        <option value={1920}>1920px (Full HD)</option>
                        <option value={1280}>1280px (HD)</option>
                        <option value={1024}>1024px</option>
                        <option value={800}>800px</option>
                        <option value={640}>640px</option>
                        <option value={4096}>不限制 (原尺寸)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                  <button
                    onClick={compressImage}
                    disabled={isProcessing}
                    className='w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isProcessing ? '压缩中...' : '开始压缩'}
                  </button>
                  <button
                    onClick={downloadImage}
                    disabled={!compressedImage}
                    className='w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <Download className='h-4 w-4 sm:h-5 sm:w-5' />
                    下载压缩图
                  </button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className='hidden' />
          </div>
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              上传图片后调整压缩质量和尺寸，点击压缩即可快速减小图片文件大小，完全本地处理，不上传服务器。
            </p>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                纯本地处理，保护隐私
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                支持批量调节压缩质量
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                自定义最大宽度限制
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                实时预览压缩效果
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                支持拖拽上传
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
