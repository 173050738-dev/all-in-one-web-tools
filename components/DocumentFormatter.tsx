'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FileText, Trash2, Download, Copy, Check, Settings, Type, Layout, AlignLeft } from 'lucide-react';
import * as PDFLib from 'pdf-lib';

interface DocumentFormatterProps {
  locale?: string;
}

interface TemplateConfig {
  id: string;
  name: Record<string, string>;
  pageSize: 'A4' | 'Letter' | 'Legal';
  margins: { top: number; right: number; bottom: number; left: number };
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spacing: number;
  headerStyles: Record<number, { fontSize: number; fontWeight: string; marginBottom: number }>;
  showPageNumbers: boolean;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left';
  customCss: string;
}

const templates: TemplateConfig[] = [
  {
    id: 'gov-doc',
    name: { zh: '党政公文', en: 'Government Document', es: 'Documento Gubernamental', fr: 'Document Gouvernemental', hi: 'सरकारी दस्तावेज़', ar: 'مستند حكومي' },
    pageSize: 'A4',
    margins: { top: 37, right: 28, bottom: 35, left: 28 },
    fontFamily: '"SimSun", "Songti SC", serif',
    fontSize: 16,
    lineHeight: 28,
    spacing: 0,
    headerStyles: {
      1: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
      2: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
      3: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
      4: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
      5: { fontSize: 13, fontWeight: 'normal', marginBottom: 8 },
      6: { fontSize: 12, fontWeight: 'normal', marginBottom: 6 },
    },
    showPageNumbers: true,
    pageNumberPosition: 'bottom-center',
    customCss: `body { font-family: "SimSun", "Songti SC", serif; } h1 { font-family: "SimHei", "Microsoft YaHei", sans-serif; }`,
  },
  {
    id: 'apa7',
    name: { zh: 'APA 7th', en: 'APA 7th Edition', es: 'APA 7ª Edición', fr: 'APA 7e Édition', hi: 'APA 7वां संस्करण', ar: 'APA الطبعة السابعة' },
    pageSize: 'Letter',
    margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
    fontFamily: '"Times New Roman", serif',
    fontSize: 12,
    lineHeight: 24,
    spacing: 0,
    headerStyles: {
      1: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
      2: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
      3: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
      4: { fontSize: 12, fontWeight: 'normal', marginBottom: 6 },
      5: { fontSize: 11, fontWeight: 'normal', marginBottom: 6 },
      6: { fontSize: 10, fontWeight: 'normal', marginBottom: 4 },
    },
    showPageNumbers: true,
    pageNumberPosition: 'top-right',
    customCss: `body { font-family: "Times New Roman", serif; text-align: justify; }`,
  },
  {
    id: 'mla9',
    name: { zh: 'MLA 9th', en: 'MLA 9th Edition', es: 'MLA 9ª Edición', fr: 'MLA 9e Édition', hi: 'MLA 9वां संस्करण', ar: 'MLA الطبعة التاسعة' },
    pageSize: 'Letter',
    margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 38.1 },
    fontFamily: '"Times New Roman", serif',
    fontSize: 12,
    lineHeight: 24,
    spacing: 0,
    headerStyles: {
      1: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
      2: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
      3: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
      4: { fontSize: 12, fontWeight: 'normal', marginBottom: 6 },
      5: { fontSize: 11, fontWeight: 'normal', marginBottom: 6 },
      6: { fontSize: 10, fontWeight: 'normal', marginBottom: 4 },
    },
    showPageNumbers: true,
    pageNumberPosition: 'top-right',
    customCss: `body { font-family: "Times New Roman", serif; text-align: left; }`,
  },
  {
    id: 'business',
    name: { zh: '商业报告', en: 'Business Report', es: 'Informe Empresarial', fr: 'Rapport d\'Entreprise', hi: 'व्यावसायिक रिपोर्ट', ar: 'تقرير تجاري' },
    pageSize: 'A4',
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    fontFamily: '"Arial", "Helvetica Neue", sans-serif',
    fontSize: 11,
    lineHeight: 16.5,
    spacing: 4,
    headerStyles: {
      1: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
      2: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
      3: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
      4: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
      5: { fontSize: 11, fontWeight: 'bold', marginBottom: 6 },
      6: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
    },
    showPageNumbers: true,
    pageNumberPosition: 'bottom-center',
    customCss: `body { font-family: "Arial", "Helvetica Neue", sans-serif; }`,
  },
  {
    id: 'resume',
    name: { zh: '简历模板', en: 'Resume Template', es: 'Plantilla de CV', fr: 'Modèle de CV', hi: 'रिज्यूमे टेम्प्लेट', ar: 'قالب السيرة الذاتية' },
    pageSize: 'A4',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    fontFamily: '"Arial", "Helvetica Neue", sans-serif',
    fontSize: 10,
    lineHeight: 14,
    spacing: 6,
    headerStyles: {
      1: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
      2: { fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
      3: { fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
      4: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
      5: { fontSize: 9, fontWeight: 'bold', marginBottom: 3 },
      6: { fontSize: 9, fontWeight: 'normal', marginBottom: 2 },
    },
    showPageNumbers: false,
    pageNumberPosition: 'bottom-center',
    customCss: `body { font-family: "Arial", "Helvetica Neue", sans-serif; } h1 { text-transform: uppercase; }`,
  },
];

const i18n = {
  zh: {
    title: '专业文档格式自动排版',
    subtitle: '粘贴内容，一键切换格式模板，导出 Word/PDF',
    pastePlaceholder: '在此粘贴文档内容...\n\n支持标题自动识别：\n# 一级标题\n## 二级标题\n### 三级标题\n\n段落自动应用模板样式',
    formatBtn: '应用格式',
    exportWord: '导出 Word',
    exportPdf: '导出 PDF',
    clear: '清空',
    preview: '预览',
    templateSelector: '选择模板',
    disclaimer: '所有处理均在您的本地浏览器完成，我们不会存储或传输您输入的任何内容。请勿输入涉密或敏感信息。',
    pageSize: '页面尺寸',
    margins: '页边距',
    fontFamily: '字体',
    fontSize: '字号',
    lineHeight: '行距',
    pageNumbers: '页码',
    loading: '处理中...',
    exportSuccess: '导出成功',
  },
  en: {
    title: 'Professional Document Formatter',
    subtitle: 'Paste content, switch format templates with one click, export Word/PDF',
    pastePlaceholder: 'Paste document content here...\n\nTitle auto-detection supported:\n# Heading 1\n## Heading 2\n### Heading 3\n\nParagraphs automatically apply template styles',
    formatBtn: 'Apply Format',
    exportWord: 'Export Word',
    exportPdf: 'Export PDF',
    clear: 'Clear',
    preview: 'Preview',
    templateSelector: 'Select Template',
    disclaimer: 'All processing is done locally in your browser. We do not store or transmit any content you enter. Do not enter confidential or sensitive information.',
    pageSize: 'Page Size',
    margins: 'Margins',
    fontFamily: 'Font',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',
    pageNumbers: 'Page Numbers',
    loading: 'Processing...',
    exportSuccess: 'Export successful',
  },
  es: {
    title: 'Formateador de Documentos Profesional',
    subtitle: 'Pega contenido, cambia plantillas con un clic, exporta Word/PDF',
    pastePlaceholder: 'Pega el contenido del documento aquí...\n\nCompatible con detección automática de títulos:\n# Título nivel 1\n## Título nivel 2\n### Título nivel 3\n\nLos párrafos aplican estilos de plantilla automáticamente',
    formatBtn: 'Aplicar Formato',
    exportWord: 'Exportar Word',
    exportPdf: 'Exportar PDF',
    clear: 'Limpiar',
    preview: 'Vista Previa',
    templateSelector: 'Seleccionar Plantilla',
    disclaimer: 'Todo el procesamiento se realiza localmente en tu navegador. No almacenamos ni transmitimos ningún contenido que ingreses. No ingreses información confidencial o sensible.',
    pageSize: 'Tamaño de Página',
    margins: 'Márgenes',
    fontFamily: 'Fuente',
    fontSize: 'Tamaño de Fuente',
    lineHeight: 'Interlineado',
    pageNumbers: 'Números de Página',
    loading: 'Procesando...',
    exportSuccess: 'Exportación exitosa',
  },
  fr: {
    title: 'Formateur de Documents Professionnel',
    subtitle: 'Collez du contenu, basculez de modèle en un clic, exportez Word/PDF',
    pastePlaceholder: 'Collez le contenu du document ici...\n\nPrend en charge la détection automatique des titres:\n# Titre niveau 1\n## Titre niveau 2\n### Titre niveau 3\n\nLes paragraphes appliquent automatiquement les styles du modèle',
    formatBtn: 'Appliquer Format',
    exportWord: 'Exporter Word',
    exportPdf: 'Exporter PDF',
    clear: 'Effacer',
    preview: 'Aperçu',
    templateSelector: 'Sélectionner Modèle',
    disclaimer: 'Tout le traitement est effectué localement dans votre navigateur. Nous ne stockons ni ne transmettons aucun contenu que vous entrez. Ne saisissez pas d\'informations confidentielles ou sensibles.',
    pageSize: 'Taille de Page',
    margins: 'Marges',
    fontFamily: 'Police',
    fontSize: 'Taille de Police',
    lineHeight: 'Interligne',
    pageNumbers: 'Numéros de Page',
    loading: 'Traitement...',
    exportSuccess: 'Exportation réussie',
  },
  hi: {
    title: 'पेशेवर दस्तावेज़ फॉर्मेटर',
    subtitle: 'सामग्री पेस्ट करें, एक क्लिक से फॉर्मेट टेम्प्लेट बदलें, Word/PDF निर्यात करें',
    pastePlaceholder: 'यहां दस्तावेज़ की सामग्री पेस्ट करें...\n\nशीर्षकों का स्वचालित पता लगाना समर्थित:\n# शीर्षक स्तर 1\n## शीर्षक स्तर 2\n### शीर्षक स्तर 3\n\nपैराग्राफ स्वचालित रूप से टेम्प्लेट स्टाइल लागू करते हैं',
    formatBtn: 'फॉर्मेट लागू करें',
    exportWord: 'Word निर्यात करें',
    exportPdf: 'PDF निर्यात करें',
    clear: 'साफ़ करें',
    preview: 'पूर्वावलोकन',
    templateSelector: 'टेम्प्लेट चुनें',
    disclaimer: 'सभी प्रसंस्करण आपके स्थानीय ब्राउज़र में किया जाता है। हम आपके द्वारा दर्ज की गई किसी भी सामग्री को स्टोर या प्रसारित नहीं करते हैं। गोपनीय या संवेदनशील जानकारी न दर्ज करें।',
    pageSize: 'पेज आकार',
    margins: 'मार्जिन',
    fontFamily: 'फ़ॉन्ट',
    fontSize: 'फ़ॉन्ट साइज़',
    lineHeight: 'पंक्ति ऊंचाई',
    pageNumbers: 'पेज नंबर',
    loading: 'प्रसंस्करण हो रहा है...',
    exportSuccess: 'निर्यात सफल',
  },
  ar: {
    title: 'معالج تنسيق المستندات المحترف',
    subtitle: 'الصق المحتوى، قم بالتبديل بين قوالب التنسيق بنقرة واحدة، صدر Word/PDF',
    pastePlaceholder: 'الصق محتوى المستند هنا...\n\nدعم الكشف التلقائي للعناوين:\n# عنوان مستوى 1\n## عنوان مستوى 2\n### عنوان مستوى 3\n\nتطبيق أسلوب القالب تلقائيًا على الفقرات',
    formatBtn: 'تطبيق التنسيق',
    exportWord: 'تصدير Word',
    exportPdf: 'تصدير PDF',
    clear: 'مسح',
    preview: 'معاينة',
    templateSelector: 'اختيار القالب',
    disclaimer: 'تتم جميع العمليات المعالجة محلياً داخل متصفحك. لا نخزن ولا ننقل أي محتوى تدخل. لا تدخل أي معلومات سرية أو حساسة.',
    pageSize: 'حجم الصفحة',
    margins: 'الهوامش',
    fontFamily: 'الخط',
    fontSize: 'حجم الخط',
    lineHeight: 'ارتفاع السطر',
    pageNumbers: 'أرقام الصفحات',
    loading: 'جارٍ المعالجة...',
    exportSuccess: 'التصدير ناجح',
  },
};

const pageSizeMap: Record<string, { width: number; height: number }> = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
};

function parseDocument(text: string, template: TemplateConfig): string {
  const lines = text.split('\n');
  const blocks: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (/^#{1,6}\s+/.test(line)) {
      const match = line.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const style = template.headerStyles[level] || template.headerStyles[3];
        blocks.push(`<h${level} style="font-size:${style.fontSize}px;font-weight:${style.fontWeight};margin-bottom:${style.marginBottom}px;">${escapeHtml(match[2])}</h${level}>`);
      }
      continue;
    }
    
    if (line.trim() === '') {
      blocks.push('<div style="height:1em;"></div>');
      continue;
    }
    
    blocks.push(`<p style="margin:0;padding:0;">${escapeHtml(line)}</p>`);
  }
  
  return blocks.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

function generatePreviewHtml(content: string, template: TemplateConfig): string {
  const size = pageSizeMap[template.pageSize];
  const marginStyle = `margin:${template.margins.top}px ${template.margins.right}px ${template.margins.bottom}px ${template.margins.left}px`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    body {
      width: ${size.width}px;
      height: ${size.height}px;
      ${marginStyle};
      font-family: ${template.fontFamily};
      font-size: ${template.fontSize}px;
      line-height: ${template.lineHeight}px;
      letter-spacing: ${template.spacing}px;
      color: #000;
      margin: 0 auto;
      padding: 0;
    }
    ${template.customCss}
    h1,h2,h3,h4,h5,h6 { margin-top: 0; }
    p { margin: 0 0 ${template.lineHeight / 2}px 0; }
    .page-number {
      position: fixed;
      font-size: ${template.fontSize * 0.8}px;
      color: #666;
    }
    ${template.pageNumberPosition === 'bottom-center' ? '.page-number { bottom: 10px; left: 50%; transform: translateX(-50%); }' : ''}
    ${template.pageNumberPosition === 'bottom-right' ? '.page-number { bottom: 10px; right: 10px; }' : ''}
    ${template.pageNumberPosition === 'bottom-left' ? '.page-number { bottom: 10px; left: 10px; }' : ''}
    ${template.pageNumberPosition === 'top-right' ? '.page-number { top: 10px; right: 10px; }' : ''}
    ${template.pageNumberPosition === 'top-left' ? '.page-number { top: 10px; left: 10px; }' : ''}
  </style>
</head>
<body>
  ${content}
  ${template.showPageNumbers ? '<div class="page-number">1</div>' : ''}
</body>
</html>
  `.trim();
}

export default function DocumentFormatter({ locale = 'zh' }: DocumentFormatterProps) {
  const t = i18n[locale as keyof typeof i18n] || i18n.zh;
  const [content, setContent] = useState(t.pastePlaceholder);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  
  const htmlContent = parseDocument(content, selectedTemplate);
  
  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(generatePreviewHtml(htmlContent, selectedTemplate));
        iframeDoc.close();
      }
    }
  }, [htmlContent, selectedTemplate]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);
  
  const clearAll = () => {
    setContent('');
  };
  
  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = htmlContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const exportWord = () => {
    const html = generatePreviewHtml(htmlContent, selectedTemplate);
    const blob = new Blob([`
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body { font-family: ${selectedTemplate.fontFamily}; font-size: ${selectedTemplate.fontSize}px; line-height: ${selectedTemplate.lineHeight}px; }
  </style>
</head>
<body>${htmlContent}</body>
</html>
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${selectedTemplate.id}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const exportPdf = async () => {
    setExporting(true);
    try {
      const { width, height } = pageSizeMap[selectedTemplate.pageSize];
      const pdfDoc = await PDFLib.PDFDocument.create();
      const page = pdfDoc.addPage([width, height]);
      
      const margins = selectedTemplate.margins;
      const contentWidth = width - margins.left - margins.right;
      const contentHeight = height - margins.top - margins.bottom;
      
      const fontSize = selectedTemplate.fontSize;
      const lineHeight = selectedTemplate.lineHeight;
      
      const textLines = content.split('\n').filter(l => l.trim());
      let y = height - margins.top;
      
      for (const line of textLines) {
        if (/^#{1,6}\s+/.test(line)) {
          const match = line.match(/^(#{1,6})\s+(.*)/);
          if (match) {
            const level = match[1].length;
            const style = selectedTemplate.headerStyles[level] || selectedTemplate.headerStyles[3];
            const headerFontSize = style.fontSize;
            page.drawText(match[2], {
              x: margins.left,
              y: y,
              size: headerFontSize,
              bold: style.fontWeight === 'bold',
            });
            y -= headerFontSize + style.marginBottom;
          }
        } else {
          page.drawText(line, {
            x: margins.left,
            y: y,
            size: fontSize,
            maxWidth: contentWidth,
            lineHeight: lineHeight,
          });
          y -= lineHeight;
        }
        
        if (y < margins.bottom) {
          const newPage = pdfDoc.addPage([width, height]);
          page = newPage;
          y = height - margins.top;
        }
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${selectedTemplate.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              {t.templateSelector}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all min-h-[44px] flex items-center justify-center ${
                    selectedTemplate.id === template.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {template.name[locale] || template.name.en}
                </button>
              ))}
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t.preview}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={copyHtml}
                  className="px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 min-h-[32px]"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? t.exportSuccess : 'HTML'}
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 min-h-[32px]"
                >
                  <Trash2 className="w-3 h-3" />
                  {t.clear}
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={handleChange}
              placeholder={t.pastePlaceholder}
              className="w-full h-64 p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <p className="text-xs text-amber-800 dark:text-amber-200">{t.disclaimer}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="card p-4 sticky top-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                {t.preview}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{selectedTemplate.pageSize}</span>
                <span>·</span>
                <span>{selectedTemplate.fontFamily.split(',')[0].replace(/["']/g, '')}</span>
                <span>{selectedTemplate.fontSize}px</span>
              </div>
            </div>
            
            <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: '500px' }}>
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Document Preview"
              />
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={exportWord}
                disabled={exporting}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                {t.exportWord}
              </button>
              <button
                onClick={exportPdf}
                disabled={exporting}
                className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                {t.exportPdf}
              </button>
            </div>
            
            {exporting && (
              <div className="mt-3 text-center text-sm text-gray-500">{t.loading}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}