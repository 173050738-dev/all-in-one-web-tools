'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FileText, Trash2, Undo2, Redo2, Copy, Download, Check } from 'lucide-react';

interface MarkdownPreviewProps {
  locale?: string;
}

const i18n = {
  zh: { title:"Markdown预览", subtitle:"左右分栏实时编辑+预览", editor:"编辑区", preview:"预览区", sample:"# 你好，Markdown\n\n这是**粗体**和*斜体*的示例。\n\n## 小标题\n\n支持：\n- 项目符号列表\n- 有序列表\n1. 第一项\n2. 第二项\n\n```js\nconsole.log('代码块');\n```\n\n> 引用块\n\n[链接](https://korelyy.com)", sampleTitle:"加载示例", clear:"清空", copyHtml:"复制HTML", downloadMd:"下载 .md", downloadHtml:"下载 .html", undo:"撤销", redo:"重做" },
  en: { title:"Markdown Preview", subtitle:"Split-pane real-time edit + preview", editor:"Editor", preview:"Preview", sample:"# Hello Markdown\n\nThis is an example of **bold** and *italic*.\n\n## Subtitle\n\nSupports:\n- Bullet list\n- Ordered list\n1. First\n2. Second\n\n```js\nconsole.log('code block');\n```\n\n> Blockquote\n\n[Link](https://korelyy.com)", sampleTitle:"Load Sample", clear:"Clear", copyHtml:"Copy HTML", downloadMd:"Download .md", downloadHtml:"Download .html", undo:"Undo", redo:"Redo" },
  hi: { title:"Markdown प्रीव्यू", subtitle:"स्प्लिट पेन रीयल-टाइम एडिट+प्रीव्यू", editor:"एडिटर", preview:"प्रीव्यू", sample:"# नमस्ते Markdown\n\nयह **बोल्ड** और *इटैलिक* का उदाहरण है।\n\n## उपशीर्षक\n\nसपोर्ट:\n- बुलेट सूची\n1. पहला", sampleTitle:"सैंपल लोड करें", clear:"साफ़ करें", copyHtml:"HTML कॉपी", downloadMd:"Download .md", downloadHtml:"Download .html", undo:"पूर्ववत", redo:"फिर से" },
  fr: { title:"Aperçu Markdown", subtitle:"Édition + aperçu en temps réel", editor:"Éditeur", preview:"Aperçu", sample:"# Bonjour Markdown\n\nExemple **gras** et *italique*.\n\n## Sous-titre\n- Liste\n\n> Citation\n\n[Lien](https://korelyy.com)", sampleTitle:"Charger exemple", clear:"Effacer", copyHtml:"Copier HTML", downloadMd:"Télécharger .md", downloadHtml:"Télécharger .html", undo:"Annuler", redo:"Rétablir" },
  es: { title:"Vista previa Markdown", subtitle:"Edición + previsualización en tiempo real", editor:"Editor", preview:"Vista", sample:"# Hola Markdown\n\nEjemplo **negrita** y *cursiva*.\n\n## Subtítulo\n- Lista\n\n> Cita\n\n[Enlace](https://korelyy.com)", sampleTitle:"Cargar ejemplo", clear:"Limpiar", copyHtml:"Copiar HTML", downloadMd:"Descargar .md", downloadHtml:"Descargar .html", undo:"Deshacer", redo:"Rehacer" },
  ar: { title:"معاينة Markdown", subtitle:"تحرير ومعاينة فورية", editor:"المحرر", preview:"المعاينة", sample:"# مرحباً Markdown\n\nمثال **عريض** و*مائل*.\n\n## عنوان فرعي\n\n- قائمة\n\n> اقتباس\n\n[رابط](https://korelyy.com)", sampleTitle:"تحميل مثال", clear:"مسح", copyHtml:"نسخ HTML", downloadMd:"تحميل .md", downloadHtml:"تحميل .html", undo:"تراجع", redo:"إعادة" }
};

function simpleMarkdown(md: string): string {
  const lines = md.split('\n');
  const blocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      const code = codeLines.join('\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      blocks.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
      continue;
    }

    if (/^#{1,3}\s+/.test(line)) {
      const levelMatch = line.match(/^(#{1,3})\s+(.*)/);
      if (levelMatch) {
        const level = levelMatch[1].length;
        const text = processInline(levelMatch[2]);
        blocks.push(`<h${level}>${text}</h${level}>`);
      }
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      const quote = processInline(quoteLines.join(' '));
      blocks.push(`<blockquote>${quote}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const ulLines: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        ulLines.push(processInline(lines[i].replace(/^[-*]\s+/, '')));
        i++;
      }
      blocks.push(`<ul>${ulLines.map(l => `<li>${l}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const olLines: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        olLines.push(processInline(lines[i].replace(/^\d+\.\s+/, '')));
        i++;
      }
      blocks.push(`<ol>${olLines.map(l => `<li>${l}</li>`).join('')}</ol>`);
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paragraphLines: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' &&
           !lines[i].startsWith('```') && !/^#{1,3}\s+/.test(lines[i]) &&
           !lines[i].startsWith('> ') && !/^[-*]\s+/.test(lines[i]) &&
           !/^\d+\.\s+/.test(lines[i])) {
      paragraphLines.push(lines[i]);
      i++;
    }
    const paragraph = processInline(paragraphLines.join(' '));
    blocks.push(`<p>${paragraph}</p>`);
  }

  return blocks.join('\n');
}

function processInline(text: string): string {
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  result = result.replace(/`([^`]+?)`/g, '<code>$1</code>');
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  result = result.replace(/\n/g, '<br />');

  return result;
}

export default function MarkdownPreview({ locale = 'zh' }: MarkdownPreviewProps) {
  const t = i18n[locale as keyof typeof i18n] || i18n.zh;

  const [md, setMd] = useState(t.sample);
  const [history, setHistory] = useState<string[]>([t.sample]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const isUndoing = useRef(false);

  useEffect(() => {
    if (isUndoing.current) {
      isUndoing.current = false;
      return;
    }
    setHistory(prev => {
      const sliced = prev.slice(0, historyIdx + 1);
      if (sliced[sliced.length - 1] !== md) {
        const newHistory = [...sliced, md];
        if (newHistory.length > 50) {
          return newHistory.slice(-50);
        }
        return newHistory;
      }
      return prev;
    });
    setHistoryIdx(prev => Math.min(prev + 1, 49));
  }, [md]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMd(e.target.value);
  }, []);

  const loadSample = () => {
    setMd(t.sample);
  };

  const clearAll = () => {
    setMd('');
  };

  const undo = () => {
    if (historyIdx > 0) {
      isUndoing.current = true;
      setHistoryIdx(prev => prev - 1);
      setMd(history[historyIdx - 1]);
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      isUndoing.current = true;
      setHistoryIdx(prev => prev + 1);
      setMd(history[historyIdx + 1]);
    }
  };

  const html = simpleMarkdown(md);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMd = () => {
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Preview</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.375rem; }
h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem; }
blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; color: #4b5563; margin: 1rem 0; }
pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.75rem; }
code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: ui-monospace, monospace; }
pre code { background: transparent; padding: 0; }
ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
p { margin: 0.5rem 0; }
a { color: #2563eb; text-decoration: underline; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const proseStyle = `
    & h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    & h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.375rem; }
    & h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem; }
    & blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; color: #4b5563; margin: 1rem 0; }
    .dark & blockquote { color: #9ca3af; border-left-color: #4b5563; }
    & pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.75rem; margin: 0.5rem 0; }
    & code { background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: ui-monospace, monospace; font-size: 0.875rem; }
    .dark & code:not(pre code) { background: #1f2937; }
    & pre code { background: transparent; padding: 0; font-size: 0.75rem; }
    & ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
    & ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
    & li { margin: 0.125rem 0; }
    & p { margin: 0.5rem 0; }
    & a { color: #2563eb; text-decoration: underline; }
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={loadSample}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <FileText className="h-4 w-4" />
              {t.sampleTitle}
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Trash2 className="h-4 w-4" />
              {t.clear}
            </button>
            <button
              onClick={undo}
              disabled={historyIdx <= 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <Undo2 className="h-4 w-4" />
              {t.undo}
            </button>
            <button
              onClick={redo}
              disabled={historyIdx >= history.length - 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <Redo2 className="h-4 w-4" />
              {t.redo}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyHtml}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? '✓' : t.copyHtml}
            </button>
            <button
              onClick={downloadMd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              {t.downloadMd}
            </button>
            <button
              onClick={downloadHtml}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg btn-primary transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              {t.downloadHtml}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              {t.editor}
            </div>
            <textarea
              value={md}
              onChange={handleChange}
              className="w-full min-h-[500px] p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              {t.preview}
            </div>
            <div
              className="w-full min-h-[500px] p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 text-gray-900 dark:text-gray-100 overflow-auto prose-container"
              style={{ lineHeight: 1.6 }}
            >
              <style>{`.prose-container { ${proseStyle} }`}</style>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
