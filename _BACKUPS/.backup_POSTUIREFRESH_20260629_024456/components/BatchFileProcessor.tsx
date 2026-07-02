'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Download,
  Settings,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Layers,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderDown,
  ArrowLeft,
} from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  processedSize?: number;
  preview?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
  output?: string;
  outputName?: string;
}

type ToolMode = 'compress' | 'convert' | 'rename';

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function BatchFileProcessor({ locale }: { locale: string }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<ToolMode>('compress');
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [renamePrefix, setRenamePrefix] = useState('image_');
  const [renameStartNum, setRenameStartNum] = useState(1);
  const [renameDigitCount, setRenameDigitCount] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles: FileItem[] = Array.from(fileList)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: generateId(),
        file,
        name: file.name,
        originalSize: file.size,
        status: 'pending' as const,
      }));
    
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const compressImage = (file: File): Promise<{ dataUrl: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return reject(new Error('Canvas not available'));

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));

          ctx.drawImage(img, 0, 0, width, height);

          const outputType = mode === 'convert' ? outputFormat : 
            (file.type === 'image/png' ? 'image/png' : 'image/jpeg');
          const qualityValue = mode === 'convert' && outputFormat === 'image/png' ? undefined : quality;
          
          const dataUrl = canvas.toDataURL(outputType, qualityValue);
          const base64Length = dataUrl.split(',')[1].length;
          const estimatedSize = Math.floor((base64Length * 3) / 4);
          
          resolve({ dataUrl, size: estimatedSize });
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (fileItem: FileItem, index: number): Promise<FileItem> => {
    try {
      if (mode === 'rename') {
        const ext = fileItem.name.match(/\.[^/.]+$/)?.[0] || '.jpg';
        const num = (renameStartNum + index).toString().padStart(renameDigitCount, '0');
        const newName = `${renamePrefix}${num}${ext}`;
        
        return {
          ...fileItem,
          status: 'done',
          outputName: newName,
          output: URL.createObjectURL(fileItem.file),
          processedSize: fileItem.originalSize,
        };
      } else {
        const result = await compressImage(fileItem.file);
        const ext = outputFormat === 'image/jpeg' ? '.jpg' : 
                    outputFormat === 'image/png' ? '.png' : 
                    outputFormat === 'image/webp' ? '.webp' : '.jpg';
        const baseName = fileItem.name.replace(/\.[^/.]+$/, '');
        const newName = mode === 'compress' ? `${baseName}_compressed${ext}` : `${baseName}${ext}`;
        
        return {
          ...fileItem,
          status: 'done',
          output: result.dataUrl,
          outputName: newName,
          processedSize: result.size,
        };
      }
    } catch (error: any) {
      return {
        ...fileItem,
        status: 'error',
        error: error.message,
      };
    }
  };

  const processAll = async () => {
    if (files.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'pending' as const })));

    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const fileItem = pendingFiles[i];
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'processing' as const } : f
      ));
      
      const result = await processFile(fileItem, i);
      setFiles(prev => prev.map(f => f.id === fileItem.id ? result : f));
    }
    
    setIsProcessing(false);
  };

  const downloadAll = () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.output);
    doneFiles.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.output!;
        link.download = file.outputName || file.name;
        link.click();
      }, index * 200);
    });
  };

  const downloadSingle = (fileItem: FileItem) => {
    if (!fileItem.output) return;
    const link = document.createElement('a');
    link.href = fileItem.output;
    link.download = fileItem.outputName || fileItem.name;
    link.click();
  };

  const doneCount = files.filter(f => f.status === 'done').length;
  const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalProcessedSize = files.filter(f => f.status === 'done' && f.processedSize)
    .reduce((sum, f) => sum + (f.processedSize || 0), 0);
  const savedPercent = totalOriginalSize > 0 && totalProcessedSize > 0
    ? Math.round(((totalOriginalSize - totalProcessedSize) / totalOriginalSize) * 100)
    : 0;

  const modeLabels = {
    compress: locale === 'zh' ? '批量压缩' : 'Compress',
    convert: locale === 'zh' ? '格式转换' : 'Convert',
    rename: locale === 'zh' ? '批量重命名' : 'Rename',
  };

  const modeIcons = {
    compress: Layers,
    convert: Sparkles,
    rename: FileText,
  };

  return (
    <div className='flex-1 min-w-0 space-y-4 sm:space-y-6'>
      <div className='flex items-center gap-4'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
          <ArrowLeft className='h-5 w-5' />
          <span className='text-sm font-medium'>{locale === 'zh' ? '返回首页' : 'Back'}</span>
        </a>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'>
            <FolderDown className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
              {locale === 'zh' ? '批量文件处理' : 'Batch File Processor'}
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {locale === 'zh' 
                ? '批量压缩、转换格式、重命名，纯本地处理' 
                : 'Batch compress, convert, rename. 100% local processing.'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2 mb-4'>
          {(['compress', 'convert', 'rename'] as ToolMode[]).map((m) => {
            const Icon = modeIcons[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl font-medium text-sm transition-all ${
                  mode === m
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500 ring-inset'
                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='h-5 w-5' />
                <span>{modeLabels[m]}</span>
              </button>
            );
          })}
        </div>

        <div
          className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors'
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileSelect}
            className='hidden'
          />
          <Upload className='h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4' />
          <p className='text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mb-1'>
            {locale === 'zh' ? '点击或拖拽上传图片' : 'Click or drag to upload images'}
          </p>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
            {locale === 'zh' 
              ? '支持 JPG、PNG、WebP 等格式，可批量上传' 
              : 'Support JPG, PNG, WebP. Batch upload supported.'}
          </p>
        </div>

        {files.length > 0 && (
          <div className='mt-4'>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className='w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            >
              <div className='flex items-center gap-2'>
                <Settings className='h-4 w-4' />
                {locale === 'zh' ? '处理设置' : 'Settings'}
              </div>
              {showSettings ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </button>

            {showSettings && (
              <div className='mt-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl space-y-4'>
                {(mode === 'compress' || mode === 'convert') && (
                  <>
                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          {locale === 'zh' ? '压缩质量' : 'Quality'}
                        </label>
                        <span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                          {Math.round(quality * 100)}%
                        </span>
                      </div>
                      <input
                        type='range'
                        min='0.1'
                        max='1'
                        step='0.05'
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className='w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500'
                      />
                    </div>
                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          {locale === 'zh' ? '最大宽度' : 'Max Width'}
                        </label>
                        <span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                          {maxWidth}px
                        </span>
                      </div>
                      <select
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                        className='w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        <option value={1920}>1920px (Full HD)</option>
                        <option value={1280}>1280px (HD)</option>
                        <option value={1024}>1024px</option>
                        <option value={800}>800px</option>
                        <option value={640}>640px</option>
                        <option value={4096}>{locale === 'zh' ? '不限制 (原尺寸)' : 'Original size'}</option>
                      </select>
                    </div>
                  </>
                )}

                {mode === 'convert' && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {locale === 'zh' ? '输出格式' : 'Output Format'}
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className='w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='image/jpeg'>JPEG</option>
                      <option value='image/png'>PNG</option>
                      <option value='image/webp'>WebP</option>
                    </select>
                  </div>
                )}

                {mode === 'rename' && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        {locale === 'zh' ? '文件名前缀' : 'Filename Prefix'}
                      </label>
                      <input
                        type='text'
                        value={renamePrefix}
                        onChange={(e) => setRenamePrefix(e.target.value)}
                        className='w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='image_'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          {locale === 'zh' ? '起始数字' : 'Start Number'}
                        </label>
                        <input
                          type='number'
                          value={renameStartNum}
                          onChange={(e) => setRenameStartNum(parseInt(e.target.value) || 1)}
                          min='1'
                          className='w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          {locale === 'zh' ? '位数' : 'Digit Count'}
                        </label>
                        <select
                          value={renameDigitCount}
                          onChange={(e) => setRenameDigitCount(parseInt(e.target.value))}
                          className='w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                          <option value={2}>2 (01)</option>
                          <option value={3}>3 (001)</option>
                          <option value={4}>4 (0001)</option>
                          <option value={5}>5 (00001)</option>
                        </select>
                      </div>
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 p-2 bg-white dark:bg-gray-800 rounded-lg'>
                      {locale === 'zh' ? '预览: ' : 'Preview: '}
                      <span className='font-mono text-gray-700 dark:text-gray-300'>
                        {renamePrefix}{renameStartNum.toString().padStart(renameDigitCount, '0')}.jpg
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-5 w-5 text-blue-500' />
                <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                  {locale === 'zh' ? '文件列表' : 'File List'}
                </h2>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  ({files.length})
                </span>
              </div>
              <button
                onClick={clearAll}
                className='text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors'
              >
                {locale === 'zh' ? '清空全部' : 'Clear All'}
              </button>
            </div>

            {(mode === 'compress' || mode === 'convert') && doneCount > 0 && (
              <div className='mb-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800'>
                <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-sm'>
                  <div>
                    <span className='text-gray-600 dark:text-gray-400'>
                      {locale === 'zh' ? '原始大小: ' : 'Original: '}
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {formatSize(totalOriginalSize)}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600 dark:text-gray-400'>
                      {locale === 'zh' ? '处理后: ' : 'Processed: '}
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {formatSize(totalProcessedSize)}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600 dark:text-gray-400'>
                      {locale === 'zh' ? '节省: ' : 'Saved: '}
                    </span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>
                      {savedPercent}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className='space-y-2 max-h-80 sm:max-h-96 overflow-y-auto'>
              {files.map((file) => (
                <div
                  key={file.id}
                  className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl'
                >
                  <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex-shrink-0 overflow-hidden'>
                    {file.preview || URL.createObjectURL(file.file) ? (
                      <img
                        src={file.preview || URL.createObjectURL(file.file)}
                        alt={file.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <ImageIcon className='w-5 h-5 m-auto text-gray-400' />
                    )}
                  </div>
                  
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                      {file.outputName || file.name}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                      <span>{formatSize(file.originalSize)}</span>
                      {file.processedSize && (
                        <>
                          <span>→</span>
                          <span>{formatSize(file.processedSize)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 flex-shrink-0'>
                    {file.status === 'pending' && (
                      <span className='text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-md'>
                        {locale === 'zh' ? '等待中' : 'Pending'}
                      </span>
                    )}
                    {file.status === 'processing' && (
                      <span className='flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md'>
                        <Loader2 className='h-3 w-3 animate-spin' />
                        {locale === 'zh' ? '处理中' : 'Processing'}
                      </span>
                    )}
                    {file.status === 'done' && (
                      <button
                        onClick={() => downloadSingle(file)}
                        className='flex items-center gap-1 text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors'
                      >
                        <CheckCircle2 className='h-3 w-3' />
                        {locale === 'zh' ? '下载' : 'Download'}
                      </button>
                    )}
                    {file.status === 'error' && (
                      <span className='flex items-center gap-1 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md'>
                        <XCircle className='h-3 w-3' />
                        {locale === 'zh' ? '失败' : 'Failed'}
                      </span>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
              <button
                onClick={processAll}
                disabled={isProcessing || files.length === 0}
                className='flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/30'
              >
                {isProcessing ? (
                  <>
                    <Loader2 className='h-4 w-4 sm:h-5 sm:w-5 animate-spin' />
                    {locale === 'zh' ? '处理中...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Sparkles className='h-4 w-4 sm:h-5 sm:w-5' />
                    {locale === 'zh' ? '开始处理' : 'Start Processing'}
                  </>
                )}
              </button>
              <button
                onClick={downloadAll}
                disabled={doneCount === 0}
                className='flex items-center justify-center gap-2 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <Download className='h-4 w-4 sm:h-5 sm:w-5' />
                {locale === 'zh' ? '全部下载' : 'Download All'}
                {doneCount > 0 && <span className='text-xs'>({doneCount})</span>}
              </button>
            </div>
          </div>

          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-500' />
              {locale === 'zh' ? '隐私安全' : 'Privacy & Security'}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              {locale === 'zh' 
                ? '所有文件处理均在您的浏览器中完成，文件不会上传到任何服务器，100% 保护您的数据隐私。' 
                : 'All file processing is done in your browser. Files are never uploaded to any server. 100% data privacy protection.'}
            </p>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className='hidden' />
    </div>
  );
}
