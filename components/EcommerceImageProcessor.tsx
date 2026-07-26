// EcommerceImageProcessor.tsx - Global E-commerce Image Batch Processor
// Supports Amazon, eBay, Shopify, Etsy, Walmart, TikTok Shop, Shopee, Lazada, Taobao, JD, etc.
// 100% local processing

'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Download, Upload, Trash2, Image as ImageIcon,
  X, Check, Globe, Grid3X3, Settings,
} from 'lucide-react';
import BuiltWithKorelyy from './BuiltWithKorelyy';
import {
  PLATFORM_PRESETS, translations, REGION_LABELS,
  processImage, createZipBlob,
  type CropMode, type WatermarkPosition,
} from './ecommercePresets';

type Locale = 'zh' | 'en' | 'es' | 'fr' | 'hi' | 'ar';

interface ProcessedImage {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  originalUrl: string;
  processedUrl: string | null;
  processedSize: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
  templateId: string;
  templateLabel: string;
}

interface Props {
  locale?: string;
}

export default function EcommerceImageProcessor({ locale = 'zh' }: Props) {
  const t = translations[locale as Locale] || translations.en;

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('amazon');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('amazon-main');
  const [cropMode, setCropMode] = useState<CropMode>('center');
  const [quality, setQuality] = useState<number>(0.85);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('');
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('br');
  const [watermarkSize, setWatermarkSize] = useState<number>(24);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.5);
  const [watermarkColor, setWatermarkColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compareImage, setCompareImage] = useState<ProcessedImage | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showPlatforms, setShowPlatforms] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentPlatform = PLATFORM_PRESETS.find((p) => p.id === selectedPlatform);
  const currentTemplate = currentPlatform?.templates.find((t) => t.id === selectedTemplate);

  const getTemplateLabel = (template: { label: Record<string, string>; width: number; height: number }) => {
    const label = template.label[locale as Locale] || template.label.en;
    const h = template.height || 'auto';
    return `${label} ${template.width}×${h}`;
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const imageFiles = files
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        originalName: file.name,
        originalSize: file.size,
        originalUrl: '',
        processedUrl: null,
        processedSize: 0,
        status: 'pending' as const,
        templateId: selectedTemplate,
        templateLabel: currentTemplate ? getTemplateLabel(currentTemplate) : '',
      }));

    imageFiles.forEach((imgFile) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) =>
          prev.map((i) => (i.id === imgFile.id ? { ...i, originalUrl: ev.target?.result as string } : i))
        );
      };
      reader.readAsDataURL(imgFile.file);
    });

    setImages((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAllImages = () => {
    setImages([]);
    setCompareImage(null);
  };

  const processAllImages = async () => {
    if (!currentTemplate) return;
    setIsProcessing(true);

    const pendingImages = images.filter((i) => i.status === 'pending');
    let successCount = 0;
    let failCount = 0;

    for (const imgFile of pendingImages) {
      setImages((prev) =>
        prev.map((i) => (i.id === imgFile.id ? { ...i, status: 'processing' } : i))
      );

      try {
        const result = await processImage(imgFile.originalUrl, {
          template: currentTemplate,
          cropMode,
          quality,
          watermarkEnabled,
          watermarkText,
          watermarkPosition,
          watermarkSize,
          watermarkOpacity,
          watermarkColor,
        });

        setImages((prev) =>
          prev.map((i) =>
            i.id === imgFile.id
              ? { ...i, processedUrl: result.dataUrl, processedSize: result.size, status: 'done' }
              : i
          )
        );
        successCount++;
      } catch (err) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === imgFile.id
              ? { ...i, status: 'error', error: (err as Error).message }
              : i
          )
        );
        failCount++;
      }
    }

    setIsProcessing(false);

    if (successCount > 0) {
      alert(`${t.allDone}! ${successCount} ${t.successCount}${failCount > 0 ? `, ${failCount} ${t.failCount}` : ''}`);
    }
  };

  const downloadSingle = (img: ProcessedImage) => {
    if (!img.processedUrl) return;
    const ext = currentTemplate?.format === 'png' ? '.png' : currentTemplate?.format === 'webp' ? '.webp' : '.jpg';
    const baseName = img.originalName.replace(/\.[^/.]+$/, '');
    const platformName = currentPlatform?.id || 'custom';
    const templateName = currentTemplate ? getTemplateLabel(currentTemplate).replace(/[^a-zA-Z0-9]/g, '_') : 'output';
    const fileName = `${platformName}_${templateName}_${baseName}${ext}`;

    const a = document.createElement('a');
    a.href = img.processedUrl;
    a.download = fileName;
    a.click();
  };

  const downloadAllZip = () => {
    const doneImages = images.filter((i) => i.status === 'done' && i.processedUrl);
    if (doneImages.length === 0) return;

    const ext = currentTemplate?.format === 'png' ? '.png' : currentTemplate?.format === 'webp' ? '.webp' : '.jpg';
    const platformName = currentPlatform?.id || 'custom';
    const templateName = currentTemplate ? getTemplateLabel(currentTemplate).replace(/[^a-zA-Z0-9]/g, '_') : 'output';
    const folderName = `${platformName}_${templateName}`;

    const files: { name: string; data: ArrayBuffer }[] = [];

    doneImages.forEach((img) => {
      if (!img.processedUrl) return;
      const baseName = img.originalName.replace(/\.[^/.]+$/, '');
      const fileName = `${folderName}/${baseName}${ext}`;
      const base64 = img.processedUrl.split(',')[1];
      const binary = atob(base64);
      const buffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
      }
      files.push({ name: fileName, data: buffer.buffer });
    });

    const zipBlob = createZipBlob(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}_images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewImage = (img: ProcessedImage) => {
    setCompareImage(img);
  };

  const closePreview = () => {
    setCompareImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left sidebar - Platform selection */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="card p-4 space-y-4">
            <div>
              <button
                onClick={() => setShowPlatforms(!showPlatforms)}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary-600" />
                  {t.selectPlatform}
                </h3>
              </button>

              {showPlatforms && (
                <div className="space-y-3">
                  {Array.from(new Set(PLATFORM_PRESETS.map(p => p.region))).map((region) => {
                    const platforms = PLATFORM_PRESETS.filter(p => p.region === region);
                    if (platforms.length === 0) return null;
                    const regionLabel = REGION_LABELS[region]?.[locale as Locale] || region;
                    return (
                      <div key={region}>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
                          {regionLabel}
                        </div>
                        <div className="space-y-1">
                          {platforms.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setSelectedPlatform(p.id);
                                setSelectedTemplate(p.templates[0].id);
                              }}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all min-h-[44px] ${
                                selectedPlatform === p.id
                                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <span className="text-lg">{p.icon}</span>
                              <span className="flex-1 truncate">{p.name[locale as Locale] || p.name.en}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Size templates */}
            {currentPlatform && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-primary-600" />
                  {t.selectSize}
                </h3>
                <div className="space-y-2">
                  {currentPlatform.templates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    const label = template.label[locale as Locale] || template.label.en;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all min-h-[44px] ${
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500'
                            : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`font-medium text-sm ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100'}`}>
                          {label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {template.width}×{template.height || 'auto'} · {template.maxSizeMB}MB · {template.format.toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Settings panel */}
          <div className="card p-4 mt-4 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary-600" />
              {t.settings}
            </h3>

            {/* Crop mode */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">{t.cropMode}</label>
              <div className="grid grid-cols-3 gap-1">
                {(['center', 'contain', 'fill'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCropMode(mode)}
                    className={`p-2 rounded text-xs min-h-[44px] ${
                      cropMode === mode
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t[`crop${mode.charAt(0).toUpperCase() + mode.slice(1)}` as keyof typeof t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                {t.quality}: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            {/* Watermark */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.watermark}</span>
              </label>

              {watermarkEnabled && (
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder={t.watermarkTextPlaceholder}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  />

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{t.watermarkPosition}</label>
                    <div className="grid grid-cols-5 gap-1">
                      {(['tl', 'tr', 'center', 'bl', 'br'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setWatermarkPosition(pos)}
                          className={`p-1.5 rounded text-xs min-h-[32px] ${
                            watermarkPosition === pos
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                          title={t[`position${pos.toUpperCase()}` as keyof typeof t]}
                        >
                          {pos === 'tl' ? '↖' : pos === 'tr' ? '↗' : pos === 'bl' ? '↙' : pos === 'br' ? '↘' : '●'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      {t.watermarkSize}: {watermarkSize}px
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="100"
                      value={watermarkSize}
                      onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      {t.watermarkOpacity}: {Math.round(watermarkOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{t.watermarkColor}</label>
                    <input
                      type="color"
                      value={watermarkColor}
                      onChange={(e) => setWatermarkColor(e.target.value)}
                      className="w-full h-9 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          {/* Upload area */}
          <div
            className={`card p-6 border-2 border-dashed transition-all min-h-[200px] ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="text-center py-8">
              <Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t.upload}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.formats}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors min-h-[44px]"
              >
                <Upload className="h-4 w-4" />
                {t.selectImages}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Canvas (hidden, for processing) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Process button */}
          {images.length > 0 && (
            <div className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {images.length} {t.file}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={processAllImages}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors min-h-[44px]"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t.processing}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {t.process}
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearAllImages}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors min-h-[44px]"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t.clearAll}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t.processingHint}</p>
            </div>
          )}

          {/* Image list */}
          {images.length > 0 && (
            <div className="space-y-3">
              {images.map((img) => (
                <div key={img.id} className="card p-4 flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img src={img.originalUrl} alt={img.originalName} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{img.originalName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatSize(img.originalSize)} → {img.status === 'done' ? formatSize(img.processedSize) : '—'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {currentPlatform?.name[locale as Locale] || currentPlatform?.name.en} · {getTemplateLabel(currentTemplate!)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {img.status === 'done' && img.processedUrl && (
                      <>
                        <button
                          onClick={() => previewImage(img)}
                          className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg transition-colors min-h-[36px] min-w-[36px]"
                          title={t.preview}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadSingle(img)}
                          className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg transition-colors min-h-[36px] min-w-[36px]"
                          title={t.download}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {img.status === 'processing' && (
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {img.status === 'error' && (
                      <span className="text-xs text-red-500">Error</span>
                    )}
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors min-h-[36px] min-w-[36px]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Download all button */}
              {images.some((i) => i.status === 'done') && (
                <button
                  onClick={downloadAllZip}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors min-h-[48px] font-medium"
                >
                  <Download className="h-5 w-5" />
                  {t.downloadAll}
                </button>
              )}
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t.noImages}
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="lg:col-span-3 order-3">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t.guide}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">{t.guideText}</p>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t.features}</h3>
            <ul className="space-y-2">
              {['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'].map((key) => (
                <li key={key} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {t[key as keyof typeof t]}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <BuiltWithKorelyy />
            </div>
          </div>
        </aside>
      </div>

      {/* Preview modal */}
      {compareImage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.preview}</h3>
              <button onClick={closePreview} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[36px] min-w-[36px]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.before}</div>
                  <img src={compareImage.originalUrl} alt="Original" className="w-full rounded-lg" />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatSize(compareImage.originalSize)}</div>
                </div>
                {compareImage.processedUrl && (
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.after}</div>
                    <img src={compareImage.processedUrl} alt="Processed" className="w-full rounded-lg" />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatSize(compareImage.processedSize)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              {compareImage.processedUrl && (
                <button
                  onClick={() => { downloadSingle(compareImage); closePreview(); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  {t.download}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
