'use client';

import { useState, useCallback, useRef } from 'react';
import { Download, Upload, CheckSquare, Square, ChevronDown, ChevronUp, FileJson, Image, FileCode, Package, X, Loader2 } from 'lucide-react';

interface FigmaLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  children?: FigmaLayer[];
  fills?: Array<{
    type: string;
    color?: { r: number; g: number; b: number };
    imageRef?: string;
    scaleMode?: string;
  }>;
  strokes?: Array<{
    type: string;
    color?: { r: number; g: number; b: number };
    weight?: number;
  }>;
  strokeWeight?: number;
  backgroundColor?: { r: number; g: number; b: number };
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  rotation?: number;
}

interface ParsedLayer extends FigmaLayer {
  selected: boolean;
  expanded: boolean;
  path: string;
}

type ExportFormat = 'png' | 'svg';

interface FigmaJsonExporterProps {
  locale?: string;
}

export default function FigmaJsonExporter({ locale = 'zh' }: FigmaJsonExporterProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      title: 'Figma JSON 批量导出',
      subtitle: '粘贴 Figma 页面 JSON，批量导出 PNG/SVG，100% 本地处理',
      pastePlaceholder: '在此粘贴 Figma 页面 JSON 数据...',
      parseBtn: '解析图层',
      exporting: '导出中...',
      selectAll: '全选',
      deselectAll: '取消全选',
      noLayers: '暂无图层，粘贴 JSON 后点击解析',
      layerName: '图层名称',
      layerType: '类型',
      width: '宽度',
      height: '高度',
      exportFormat: '导出格式',
      exportPng: '导出 PNG',
      exportSvg: '导出 SVG',
      downloadSingle: '下载',
      downloadAll: '打包下载全部',
      totalSelected: '已选择 {count} 个图层',
      parseError: 'JSON 解析失败，请检查数据格式',
      noFigmaData: '未检测到有效的 Figma 数据',
      loading: '解析中...',
      tips: '💡 在 Figma 中右键页面 → 复制 → 粘贴到此处',
      preview: '预览',
      emptySelection: '请先选择要导出的图层',
      frame: '画板',
      group: '组',
      rectangle: '矩形',
      text: '文本',
      vector: '矢量',
      ellipse: '椭圆',
      line: '线条',
      component: '组件',
      instance: '实例',
      other: '其他',
    },
    en: {
      title: 'Figma JSON Batch Exporter',
      subtitle: 'Paste Figma page JSON, batch export PNG/SVG, 100% local processing',
      pastePlaceholder: 'Paste Figma page JSON data here...',
      parseBtn: 'Parse Layers',
      exporting: 'Exporting...',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      noLayers: 'No layers yet. Paste JSON and click Parse',
      layerName: 'Layer Name',
      layerType: 'Type',
      width: 'Width',
      height: 'Height',
      exportFormat: 'Export Format',
      exportPng: 'Export PNG',
      exportSvg: 'Export SVG',
      downloadSingle: 'Download',
      downloadAll: 'Download All as Zip',
      totalSelected: '{count} layers selected',
      parseError: 'JSON parsing failed. Please check data format',
      noFigmaData: 'No valid Figma data detected',
      loading: 'Parsing...',
      tips: '💡 In Figma: right-click page → Copy → Paste here',
      preview: 'Preview',
      emptySelection: 'Please select layers to export first',
      frame: 'Frame',
      group: 'Group',
      rectangle: 'Rectangle',
      text: 'Text',
      vector: 'Vector',
      ellipse: 'Ellipse',
      line: 'Line',
      component: 'Component',
      instance: 'Instance',
      other: 'Other',
    },
    es: {
      title: 'Exportador Batch Figma JSON',
      subtitle: 'Pega JSON de página Figma, exporta PNG/SVG en lote, 100% procesamiento local',
      pastePlaceholder: 'Pega aquí los datos JSON de la página Figma...',
      parseBtn: 'Analizar Capas',
      exporting: 'Exportando...',
      selectAll: 'Seleccionar Todo',
      deselectAll: 'Deseleccionar Todo',
      noLayers: 'No hay capas aún. Pega JSON y haz clic en Analizar',
      layerName: 'Nombre de Capa',
      layerType: 'Tipo',
      width: 'Anchura',
      height: 'Altura',
      exportFormat: 'Formato de Exportación',
      exportPng: 'Exportar PNG',
      exportSvg: 'Exportar SVG',
      downloadSingle: 'Descargar',
      downloadAll: 'Descargar Todo como Zip',
      totalSelected: '{count} capas seleccionadas',
      parseError: 'Error al analizar JSON. Verifica el formato de datos',
      noFigmaData: 'No se detectó datos Figma válidos',
      loading: 'Analizando...',
      tips: '💡 En Figma: clic derecho en página → Copiar → Pega aquí',
      preview: 'Vista Previa',
      emptySelection: 'Selecciona capas para exportar primero',
      frame: 'Frame',
      group: 'Grupo',
      rectangle: 'Rectángulo',
      text: 'Texto',
      vector: 'Vector',
      ellipse: 'Elipse',
      line: 'Línea',
      component: 'Componente',
      instance: 'Instancia',
      other: 'Otro',
    },
    fr: {
      title: 'Exportateur Batch Figma JSON',
      subtitle: 'Collez le JSON de page Figma, exportez PNG/SVG en lot, traitement 100% local',
      pastePlaceholder: 'Collez ici les données JSON de la page Figma...',
      parseBtn: 'Analyser les Couches',
      exporting: 'Exportation...',
      selectAll: 'Tout Sélectionner',
      deselectAll: 'Tout Désélectionner',
      noLayers: 'Aucune couche pour le moment. Collez JSON et cliquez sur Analyser',
      layerName: 'Nom de Couche',
      layerType: 'Type',
      width: 'Largeur',
      height: 'Hauteur',
      exportFormat: 'Format d\'Exportation',
      exportPng: 'Exporter PNG',
      exportSvg: 'Exporter SVG',
      downloadSingle: 'Télécharger',
      downloadAll: 'Télécharger Tout en Zip',
      totalSelected: '{count} couches sélectionnées',
      parseError: 'Échec de l\'analyse JSON. Vérifiez le format des données',
      noFigmaData: 'Aucune donnée Figma valide détectée',
      loading: 'Analyse...',
      tips: '💡 Dans Figma : clic droit sur la page → Copier → Coller ici',
      preview: 'Aperçu',
      emptySelection: 'Veuillez sélectionner des couches à exporter d\'abord',
      frame: 'Frame',
      group: 'Groupe',
      rectangle: 'Rectangle',
      text: 'Texte',
      vector: 'Vecteur',
      ellipse: 'Ellipse',
      line: 'Ligne',
      component: 'Composant',
      instance: 'Instance',
      other: 'Autre',
    },
    hi: {
      title: 'Figma JSON बैच एक्सपोर्टर',
      subtitle: 'Figma पेज JSON पेस्ट करें, PNG/SVG बैच एक्सपोर्ट करें, 100% लोकल प्रोसेसिंग',
      pastePlaceholder: 'यहां Figma पेज JSON डेटा पेस्ट करें...',
      parseBtn: 'लेयर्स पार्स करें',
      exporting: 'एक्सपोर्ट हो रहा है...',
      selectAll: 'सभी चुनें',
      deselectAll: 'सभी चुनें हटाएं',
      noLayers: 'अभी तक कोई लेयर नहीं। JSON पेस्ट करें और पार्स पर क्लिक करें',
      layerName: 'लेयर नाम',
      layerType: 'प्रकार',
      width: 'चौड़ाई',
      height: 'ऊंचाई',
      exportFormat: 'एक्सपोर्ट प्रारूप',
      exportPng: 'PNG एक्सपोर्ट करें',
      exportSvg: 'SVG एक्सपोर्ट करें',
      downloadSingle: 'डाउनलोड',
      downloadAll: 'सभी को ज़िप के रूप में डाउनलोड करें',
      totalSelected: '{count} लेयर्स चुने गए',
      parseError: 'JSON पार्सिंग विफल। कृपया डेटा प्रारूप की जांच करें',
      noFigmaData: 'मान्य Figma डेटा नहीं पाया गया',
      loading: 'पार्सिंग हो रही है...',
      tips: '💡 Figma में: पेज पर राइट-क्लिक → कॉपी → यहां पेस्ट करें',
      preview: 'पूर्वावलोकन',
      emptySelection: 'कृपया पहले एक्सपोर्ट करने के लिए लेयर्स चुनें',
      frame: 'फ्रेम',
      group: 'समूह',
      rectangle: 'आयत',
      text: 'टेक्स्ट',
      vector: 'वेक्टर',
      ellipse: 'दीर्घवृत्त',
      line: 'लाइन',
      component: 'कंपोनेंट',
      instance: 'इंस्टेंस',
      other: 'अन्य',
    },
    ar: {
      title: 'مصدر تصدير Figma JSON الجماعي',
      subtitle: 'الصق بيانات JSON من صفحة Figma، تصدير PNG/SVG بالجملة، معالجة 100% محلية',
      pastePlaceholder: 'الصق بيانات JSON من صفحة Figma هنا...',
      parseBtn: 'تحليل الطبقات',
      exporting: 'جارٍ التصدير...',
      selectAll: 'تحديد الكل',
      deselectAll: 'إلغاء تحديد الكل',
      noLayers: 'لا توجد طبقات بعد. الصق JSON وانقر على تحليل',
      layerName: 'اسم الطبقة',
      layerType: 'النوع',
      width: 'العرض',
      height: 'الارتفاع',
      exportFormat: 'تنسيق التصدير',
      exportPng: 'تصدير PNG',
      exportSvg: 'تصدير SVG',
      downloadSingle: 'تنزيل',
      downloadAll: 'تنزيل الكل كـ Zip',
      totalSelected: '{count} طبقات مختارة',
      parseError: 'فشل تحليل JSON. يرجى مراجعة تنسيق البيانات',
      noFigmaData: 'لم يتم اكتشاف بيانات Figma صالحة',
      loading: 'جارٍ التحليل...',
      tips: '💡 في Figma: نقر بزر الماوس الأيمن على الصفحة → نسخ → الصق هنا',
      preview: 'معاينة',
      emptySelection: 'يرجى تحديد الطبقات المراد تصديرها أولاً',
      frame: 'إطار',
      group: 'مجموعة',
      rectangle: 'مستطيل',
      text: 'نص',
      vector: 'متجه',
      ellipse: 'بيضوي',
      line: 'خط',
      component: 'مكون',
      instance: 'مثيل',
      other: 'آخر',
    },
  };

  const t = translations[locale];

  const [jsonInput, setJsonInput] = useState<string>('');
  const [layers, setLayers] = useState<ParsedLayer[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [previewLayer, setPreviewLayer] = useState<ParsedLayer | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getLayerTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      FRAME: t.frame,
      GROUP: t.group,
      RECTANGLE: t.rectangle,
      TEXT: t.text,
      VECTOR: t.vector,
      ELLIPSE: t.ellipse,
      LINE: t.line,
      COMPONENT: t.component,
      INSTANCE: t.instance,
    };
    return typeMap[type] || t.other;
  };

  const parseFigmaJson = useCallback((jsonString: string): ParsedLayer[] => {
    try {
      const data = JSON.parse(jsonString);
      const document = data.document;
      if (!document || !document.children) {
        throw new Error(t.noFigmaData);
      }

      const extractLayers = (nodes: any[], parentPath: string = ''): ParsedLayer[] => {
        const result: ParsedLayer[] = [];
        
        for (const node of nodes) {
          if (!node.visible && node.type !== 'FRAME') continue;

          const path = parentPath ? `${parentPath} / ${node.name}` : node.name;
          const bounds = node.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 };
          
          const layer: ParsedLayer = {
            id: node.id,
            name: node.name,
            type: node.type,
            visible: node.visible || false,
            x: bounds.x || 0,
            y: bounds.y || 0,
            width: bounds.width || 0,
            height: bounds.height || 0,
            selected: false,
            expanded: node.type === 'FRAME',
            path,
            children: node.children ? extractLayers(node.children, path) : undefined,
            fills: node.fills,
            strokes: node.strokes,
            strokeWeight: node.strokeWeight,
            backgroundColor: node.backgroundColor,
            text: node.characters,
            fontSize: node.fontSize,
            fontFamily: node.fontFamily,
            opacity: node.opacity,
            rotation: node.rotation,
          };

          result.push(layer);
        }

        return result;
      };

      return extractLayers(document.children);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : t.parseError);
    }
  }, [t]);

  const handleParse = useCallback(() => {
    if (!jsonInput.trim()) return;
    
    setIsParsing(true);
    setError('');
    
    setTimeout(() => {
      try {
        const parsedLayers = parseFigmaJson(jsonInput);
        setLayers(parsedLayers);
        setError('');
      } catch (e) {
        setError(e instanceof Error ? e.message : t.parseError);
        setLayers([]);
      }
      setIsParsing(false);
    }, 100);
  }, [jsonInput, parseFigmaJson, t]);

  const toggleSelectAll = useCallback(() => {
    setLayers(prev => prev.map(layer => ({
      ...layer,
      selected: !layer.selected,
      children: layer.children?.map(child => ({ ...child, selected: !layer.selected })),
    })));
  }, []);

  const toggleLayerSelect = useCallback((layerId: string) => {
    const toggleRecursive = (layers: ParsedLayer[]): ParsedLayer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return {
            ...layer,
            selected: !layer.selected,
            children: layer.children?.map(child => ({ ...child, selected: !layer.selected })),
          };
        }
        return {
          ...layer,
          children: layer.children ? toggleRecursive(layer.children) : undefined,
        };
      });
    };
    setLayers(prev => toggleRecursive(prev));
  }, []);

  const toggleLayerExpand = useCallback((layerId: string) => {
    const toggleRecursive = (layers: ParsedLayer[]): ParsedLayer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, expanded: !layer.expanded };
        }
        return {
          ...layer,
          children: layer.children ? toggleRecursive(layer.children) : undefined,
        };
      });
    };
    setLayers(prev => toggleRecursive(prev));
  }, []);

  const getAllSelectedLayers = (layers: ParsedLayer[]): ParsedLayer[] => {
    const selected: ParsedLayer[] = [];
    
    const collect = (items: ParsedLayer[]) => {
      for (const item of items) {
        if (item.selected) {
          selected.push(item);
        }
        if (item.children) {
          collect(item.children);
        }
      }
    };
    
    collect(layers);
    return selected;
  };

  const renderLayerToCanvas = (layer: ParsedLayer): string => {
    const canvas = document.createElement('canvas');
    canvas.width = layer.width || 200;
    canvas.height = layer.height || 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (layer.backgroundColor) {
      ctx.fillStyle = `rgb(${Math.round(layer.backgroundColor.r * 255)}, ${Math.round(layer.backgroundColor.g * 255)}, ${Math.round(layer.backgroundColor.b * 255)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (layer.fills && layer.fills.length > 0) {
      for (const fill of layer.fills) {
        if (fill.type === 'SOLID' && fill.color) {
          ctx.fillStyle = `rgb(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }

    if (layer.text) {
      ctx.fillStyle = '#333';
      ctx.font = `${layer.fontSize || 14}px ${layer.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layer.text, canvas.width / 2, canvas.height / 2);
    }

    return canvas.toDataURL(`image/${exportFormat}`, 1);
  };

  const generateSvg = (layer: ParsedLayer): string => {
    const fills = layer.fills && layer.fills.length > 0 && layer.fills[0].type === 'SOLID' && layer.fills[0].color
      ? `fill="rgb(${Math.round(layer.fills[0].color.r * 255)}, ${Math.round(layer.fills[0].color.g * 255)}, ${Math.round(layer.fills[0].color.b * 255)})"`
      : 'fill="white"';
    
    let content = `<rect x="0" y="0" width="${layer.width || 200}" height="${layer.height || 200}" ${fills} stroke="#333" stroke-width="1"/>`;
    
    if (layer.text) {
      content += `<text x="${(layer.width || 200) / 2}" y="${(layer.height || 200) / 2}" font-size="${layer.fontSize || 14}" text-anchor="middle" dominant-baseline="middle" fill="#333">${layer.text}</text>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${layer.width || 200}" height="${layer.height || 200}" viewBox="0 0 ${layer.width || 200} ${layer.height || 200}">
${content}
</svg>`;
  };

  const downloadSingle = useCallback((layer: ParsedLayer) => {
    if (exportFormat === 'png') {
      const dataUrl = renderLayerToCanvas(layer);
      const link = document.createElement('a');
      link.download = `${layer.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } else {
      const svgContent = generateSvg(layer);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${layer.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_')}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [exportFormat]);

  const downloadAll = useCallback(async () => {
    const selectedLayers = getAllSelectedLayers(layers);
    if (selectedLayers.length === 0) {
      setError(t.emptySelection);
      return;
    }

    setIsExporting(true);
    setError('');

    try {
      const format = exportFormat;
      
      for (const layer of selectedLayers) {
        await new Promise(resolve => setTimeout(resolve, 200));
        downloadSingle(layer);
      }

      if (selectedLayers.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.parseError);
    }

    setIsExporting(false);
  }, [layers, downloadSingle, exportFormat, t]);

  const selectedCount = getAllSelectedLayers(layers).length;

  const renderLayerTree = (items: ParsedLayer[], level: number = 0) => {
    return items.map((layer) => (
      <div key={layer.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div
          className={`flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
            layer.selected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {layer.children && layer.children.length > 0 && (
            <button
              onClick={() => toggleLayerExpand(layer.id)}
              className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
            >
              {layer.expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
          {!layer.children && <span className="w-4" />}
          
          <button
            onClick={() => toggleLayerSelect(layer.id)}
            className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            {layer.selected ? (
              <CheckSquare className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {layer.name}
              </span>
              <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {getLayerTypeName(layer.type)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t.width}: {Math.round(layer.width)}px
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t.height}: {Math.round(layer.height)}px
              </span>
            </div>
          </div>
          
          <button
            onClick={() => downloadSingle(layer)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="h-3 w-3" />
            {t.downloadSingle}
          </button>
        </div>
        
        {layer.children && layer.children.length > 0 && layer.expanded && (
          <div>{renderLayerTree(layer.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <FileJson className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-5 card p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.pastePlaceholder}</span>
              </div>
              
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setError('');
                }}
                placeholder={t.pastePlaceholder}
                className="w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono"
              />
              
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleParse}
                  disabled={isParsing || !jsonInput.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isParsing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.loading}
                    </span>
                  ) : (
                    t.parseBtn
                  )}
                </button>
                <button
                  onClick={() => {
                    setJsonInput('');
                    setLayers([]);
                    setError('');
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  {t.deselectAll}
                </button>
              </div>
              
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{t.tips}</p>
              
              {error && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.layerName}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {selectedCount > 0 ? t.deselectAll : t.selectAll}
                    </button>
                  </div>
                </div>

                {layers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
                    <FileJson className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">{t.noLayers}</p>
                  </div>
                ) : (
                  <div className="max-h-80 sm:max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    {renderLayerTree(layers)}
                  </div>
                )}
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                      {t.exportFormat}
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setExportFormat('png')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          exportFormat === 'png'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Image className="h-4 w-4" />
                        {t.exportPng}
                      </button>
                      <button
                        onClick={() => setExportFormat('svg')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                          exportFormat === 'svg'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FileCode className="h-4 w-4" />
                        {t.exportSvg}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={downloadAll}
                    disabled={isExporting || selectedCount === 0}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.exporting}
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4" />
                        {t.downloadAll}
                      </>
                    )}
                  </button>
                </div>

                {selectedCount > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {t.totalSelected.replace('{count}', selectedCount.toString())}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">功能特点</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                纯浏览器端处理，保护隐私
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                支持批量导出 PNG/SVG
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                自动解析 Figma 图层结构
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                支持全选/单选图层导出
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                保留图层名称和尺寸信息
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                无需登录 Figma 账号
              </li>
            </ul>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}