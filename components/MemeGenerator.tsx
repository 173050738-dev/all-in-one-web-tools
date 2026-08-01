'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, Plus, Trash2, Type, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface Props {
  locale?: string;
}

type TemplateId = 'whiteFrame' | 'black' | 'indigo' | 'split' | 'mushroom' | 'grayCard';

interface TextLayer {
  id: string;
  text: string;
  x: number; // fraction 0..1
  y: number; // fraction 0..1
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}

const FONT_STACK = 'Impact, "Arial Black", "Helvetica Neue", sans-serif';
const PADDING = 24;
const TEMPLATE_SIZE = 600;
const MAX_IMAGE_DIM = 800;

const translations: Record<string, Record<string, string>> = {
  zh: {
    title: '表情包生成器',
    subtitle: '上传图片或选择模板，加上经典上下文字，一键生成表情包。',
    preview: '实时预览',
    uploadImage: '上传图片',
    uploadHint: '支持 JPG / PNG / WebP，图片仅在浏览器内处理',
    templates: '预设模板',
    topText: '上文字',
    topTextPh: '顶部文字（如：一个人去吃饭）',
    bottomText: '下文字',
    bottomTextPh: '底部文字（如：结果上了个厕所）',
    textStyle: '文字样式',
    editingClassic: '当前编辑：上下文字',
    editingLayer: '当前编辑：自由文字层',
    fontSize: '字号',
    textColor: '文字颜色',
    strokeColor: '描边颜色',
    strokeWidth: '描边粗细',
    textLayers: '自由文字层',
    addLayer: '添加文字层',
    deleteLayer: '删除',
    selected: '已选中',
    layerTextPh: '输入文字…',
    newLayerText: '点击编辑',
    noLayers: '还没有自由文字层，点击「添加文字层」可在画布上任意位置放置文字并拖动。',
    downloadPng: '下载 PNG',
    clearText: '清空文字',
    dragTip: '提示：点击画布上的自由文字层可选中并拖动定位。',
    tplWhiteFrame: '白底黑框',
    tplBlack: '纯黑底',
    tplIndigo: '靛蓝底',
    tplSplit: '上下分屏',
    tplMushroom: '小蘑菇',
    tplGray: '灰底卡片',
  },
  en: {
    title: 'Meme Generator',
    subtitle: 'Upload an image or pick a template, add classic top/bottom text, and export a meme.',
    preview: 'Live Preview',
    uploadImage: 'Upload Image',
    uploadHint: 'JPG / PNG / WebP supported. Processed entirely in your browser.',
    templates: 'Templates',
    topText: 'Top Text',
    topTextPh: 'Top caption (e.g. WHEN YOU FINALLY FIX IT)',
    bottomText: 'Bottom Text',
    bottomTextPh: 'Bottom caption (e.g. AND IT BREAKS AGAIN)',
    textStyle: 'Text Style',
    editingClassic: 'Editing: Top / Bottom text',
    editingLayer: 'Editing: Free text layer',
    fontSize: 'Font size',
    textColor: 'Text color',
    strokeColor: 'Stroke color',
    strokeWidth: 'Stroke width',
    textLayers: 'Free Text Layers',
    addLayer: 'Add text layer',
    deleteLayer: 'Delete',
    selected: 'Selected',
    layerTextPh: 'Type text…',
    newLayerText: 'TAP TO EDIT',
    noLayers: 'No free text layers yet. Click "Add text layer" to place draggable text anywhere.',
    downloadPng: 'Download PNG',
    clearText: 'Clear text',
    dragTip: 'Tip: tap a free text layer on the canvas to select and drag it.',
    tplWhiteFrame: 'White Frame',
    tplBlack: 'Black',
    tplIndigo: 'Indigo',
    tplSplit: 'Split Panel',
    tplMushroom: 'Mushroom',
    tplGray: 'Gray Card',
  },
  es: {
    title: 'Generador de Memes',
    subtitle: 'Sube una imagen o elige una plantilla, añade texto superior/inferior y exporta.',
    preview: 'Vista previa',
    uploadImage: 'Subir imagen',
    uploadHint: 'JPG / PNG / WebP. Procesado solo en tu navegador.',
    templates: 'Plantillas',
    topText: 'Texto superior',
    topTextPh: 'Texto superior (ej: CUANDO LO ARREGLAS)',
    bottomText: 'Texto inferior',
    bottomTextPh: 'Texto inferior (ej: Y SE ROMPE OTRA VEZ)',
    textStyle: 'Estilo de texto',
    editingClassic: 'Editando: texto superior/inferior',
    editingLayer: 'Editando: capa de texto libre',
    fontSize: 'Tamaño',
    textColor: 'Color del texto',
    strokeColor: 'Color del trazo',
    strokeWidth: 'Grosor del trazo',
    textLayers: 'Capas de texto libres',
    addLayer: 'Añadir capa',
    deleteLayer: 'Eliminar',
    selected: 'Seleccionado',
    layerTextPh: 'Escribe texto…',
    newLayerText: 'TOCA PARA EDITAR',
    noLayers: 'Sin capas aún. Pulsa "Añadir capa" para colocar texto arrastrable.',
    downloadPng: 'Descargar PNG',
    clearText: 'Borrar texto',
    dragTip: 'Consejo: toca una capa en el lienzo para seleccionarla y arrastrarla.',
    tplWhiteFrame: 'Marco blanco',
    tplBlack: 'Negro',
    tplIndigo: 'Índigo',
    tplSplit: 'Panel dividido',
    tplMushroom: 'Champiñón',
    tplGray: 'Tarjeta gris',
  },
  fr: {
    title: 'Générateur de Memes',
    subtitle: 'Importez une image ou choisissez un modèle, ajoutez texte haut/bas et exportez.',
    preview: 'Aperçu',
    uploadImage: 'Importer une image',
    uploadHint: 'JPG / PNG / WebP. Traitement uniquement dans votre navigateur.',
    templates: 'Modèles',
    topText: 'Texte du haut',
    topTextPh: 'Texte du haut (ex: QUAND TU LE RÉPARES)',
    bottomText: 'Texte du bas',
    bottomTextPh: 'Texte du bas (ex: ET ÇA CASSE ENCORE)',
    textStyle: 'Style du texte',
    editingClassic: 'Édition : texte haut/bas',
    editingLayer: 'Édition : calque de texte libre',
    fontSize: 'Taille',
    textColor: 'Couleur du texte',
    strokeColor: 'Couleur du contour',
    strokeWidth: 'Épaisseur du contour',
    textLayers: 'Calques de texte libres',
    addLayer: 'Ajouter un calque',
    deleteLayer: 'Supprimer',
    selected: 'Sélectionné',
    layerTextPh: 'Saisir du texte…',
    newLayerText: 'TAPER POUR ÉDITER',
    noLayers: 'Aucun calque. Cliquez sur "Ajouter un calque" pour placer du texte déplaçable.',
    downloadPng: 'Télécharger PNG',
    clearText: 'Effacer le texte',
    dragTip: 'Astuce : touchez un calque sur le canevas pour le sélectionner et le déplacer.',
    tplWhiteFrame: 'Cadre blanc',
    tplBlack: 'Noir',
    tplIndigo: 'Indigo',
    tplSplit: 'Panneau divisé',
    tplMushroom: 'Champignon',
    tplGray: 'Carte grise',
  },
  hi: {
    title: 'मीम जनरेटर',
    subtitle: 'इमेज अपलोड करें या टेम्पलेट चुनें, ऊपर/नीचे टेक्स्ट जोड़ें और मीम निर्यात करें।',
    preview: 'लाइव पूर्वावलोकन',
    uploadImage: 'इमेज अपलोड करें',
    uploadHint: 'JPG / PNG / WebP। केवल आपके ब्राउज़र में प्रोसेस होता है।',
    templates: 'टेम्पलेट',
    topText: 'ऊपरी टेक्स्ट',
    topTextPh: 'ऊपरी टेक्स्ट (जैसे: जब आप ठीक करते हैं)',
    bottomText: 'निचला टेक्स्ट',
    bottomTextPh: 'निचला टेक्स्ट (जैसे: और फिर टूट जाता है)',
    textStyle: 'टेक्स्ट शैली',
    editingClassic: 'संपादन: ऊपर/नीचे टेक्स्ट',
    editingLayer: 'संपादन: मुक्त टेक्स्ट परत',
    fontSize: 'फ़ॉन्ट आकार',
    textColor: 'टेक्स्ट रंग',
    strokeColor: 'स्ट्रोक रंग',
    strokeWidth: 'स्ट्रोक चौड़ाई',
    textLayers: 'मुक्त टेक्स्ट परतें',
    addLayer: 'परत जोड़ें',
    deleteLayer: 'हटाएँ',
    selected: 'चयनित',
    layerTextPh: 'टेक्स्ट लिखें…',
    newLayerText: 'संपादित करने के लिए टैप करें',
    noLayers: 'अभी कोई परत नहीं। खींचने योग्य टेक्स्ट रखने के लिए "परत जोड़ें" दबाएँ।',
    downloadPng: 'PNG डाउनलोड करें',
    clearText: 'टेक्स्ट साफ़ करें',
    dragTip: 'सुझाव: चयन करने और खींचने के लिए कैनवास पर परत टैप करें।',
    tplWhiteFrame: 'सफ़ेद फ़्रेम',
    tplBlack: 'काला',
    tplIndigo: 'इंडिगो',
    tplSplit: 'विभाजित पैनल',
    tplMushroom: 'मशरूम',
    tplGray: 'ग्रे कार्ड',
  },
  ar: {
    title: 'مولّد الميمز',
    subtitle: 'ارفع صورة أو اختر قالبًا، أضف نصًا علويًا/سفليًا وصدّر الميم.',
    preview: 'معاينة مباشرة',
    uploadImage: 'رفع صورة',
    uploadHint: 'JPG / PNG / WebP. تُعالج بالكامل داخل متصفحك.',
    templates: 'القوالب',
    topText: 'النص العلوي',
    topTextPh: 'النص العلوي (مثال: عندما تصلحه)',
    bottomText: 'النص السفلي',
    bottomTextPh: 'النص السفلي (مثال: وينكسر مجددًا)',
    textStyle: 'نمط النص',
    editingClassic: 'تحرير: النص العلوي/السفلي',
    editingLayer: 'تحرير: طبقة نص حر',
    fontSize: 'حجم الخط',
    textColor: 'لون النص',
    strokeColor: 'لون الحد',
    strokeWidth: 'سُمك الحد',
    textLayers: 'طبقات النص الحر',
    addLayer: 'إضافة طبقة',
    deleteLayer: 'حذف',
    selected: 'محدد',
    layerTextPh: 'اكتب نصًا…',
    newLayerText: 'انقر للتحرير',
    noLayers: 'لا طبقات بعد. اضغط «إضافة طبقة» لوضع نص قابل للسحب في أي مكان.',
    downloadPng: 'تنزيل PNG',
    clearText: 'مسح النص',
    dragTip: 'تلميح: انقر على طبقة في اللوحة لتحديدها وسحبها.',
    tplWhiteFrame: 'إطار أبيض',
    tplBlack: 'أسود',
    tplIndigo: 'نيلي',
    tplSplit: 'لوحة مقسومة',
    tplMushroom: 'فطر',
    tplGray: 'بطاقة رمادية',
  },
};

const TEMPLATE_LIST: TemplateId[] = ['whiteFrame', 'black', 'indigo', 'split', 'mushroom', 'grayCard'];

function pathRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawTemplateBg(ctx: CanvasRenderingContext2D, id: TemplateId, W: number, H: number) {
  ctx.clearRect(0, 0, W, H);
  switch (id) {
    case 'black': {
      ctx.fillStyle = '#0b0b0b';
      ctx.fillRect(0, 0, W, H);
      break;
    }
    case 'indigo': {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#4f46e5');
      g.addColorStop(1, '#6366f1');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const rg = ctx.createRadialGradient(W * 0.3, H * 0.25, 10, W * 0.3, H * 0.25, W * 0.7);
      rg.addColorStop(0, 'rgba(255,255,255,0.18)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
      break;
    }
    case 'split': {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H / 2);
      ctx.fillStyle = '#0b0b0b';
      ctx.fillRect(0, H / 2, W, H / 2);
      break;
    }
    case 'grayCard': {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = Math.max(2, W * 0.006);
      pathRoundRect(ctx, 8, 8, W - 16, H - 16, 18);
      ctx.stroke();
      break;
    }
    case 'mushroom': {
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(0, 0, W, H);
      // stem
      const stemW = W * 0.42;
      const stemH = H * 0.42;
      const stemX = (W - stemW) / 2;
      const stemY = H * 0.5;
      ctx.fillStyle = '#fdf3d8';
      pathRoundRect(ctx, stemX, stemY, stemW, stemH, 24);
      ctx.fill();
      ctx.strokeStyle = '#e7d2a3';
      ctx.lineWidth = 3;
      ctx.stroke();
      // cap
      const capW = W * 0.78;
      const capH = H * 0.38;
      const capX = (W - capW) / 2;
      const capY = H * 0.12;
      ctx.fillStyle = '#dc2626';
      pathRoundRect(ctx, capX, capY, capW, capH, capH * 0.55);
      ctx.fill();
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3;
      ctx.stroke();
      // dots
      ctx.fillStyle = '#ffffff';
      const dots = [
        [capX + capW * 0.18, capY + capH * 0.5, capW * 0.1],
        [capX + capW * 0.45, capY + capH * 0.32, capW * 0.085],
        [capX + capW * 0.72, capY + capH * 0.55, capW * 0.11],
        [capX + capW * 0.58, capY + capH * 0.7, capW * 0.07],
      ] as const;
      for (const [dx, dy, dr] of dots) {
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'whiteFrame':
    default: {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      const lw = Math.max(6, W * 0.018);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = lw;
      pathRoundRect(ctx, lw / 2, lw / 2, W - lw, H - lw, 14);
      ctx.stroke();
      break;
    }
  }
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const rawPara of text.split('\n')) {
    if (rawPara.trim() === '') {
      lines.push('');
      continue;
    }
    const tokens: string[] = [];
    let cur = '';
    for (const ch of rawPara) {
      if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(ch)) {
        if (cur) { tokens.push(cur); cur = ''; }
        tokens.push(ch);
      } else if (/\s/.test(ch)) {
        if (cur) { tokens.push(cur); cur = ''; }
        tokens.push(' ');
      } else {
        cur += ch;
      }
    }
    if (cur) tokens.push(cur);

    let line = '';
    for (const tk of tokens) {
      if (tk === ' ' && line === '') continue;
      const test = line + tk;
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        lines.push(line.replace(/\s+$/, ''));
        line = tk === ' ' ? '' : tk.replace(/^\s+/, '');
      } else {
        line = test;
      }
    }
    if (line !== '') lines.push(line.replace(/\s+$/, ''));
  }
  while (lines.length && lines[0] === '') lines.shift();
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function setFont(ctx: CanvasRenderingContext2D, fontSize: number) {
  ctx.font = `bold ${fontSize}px ${FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  centerX: number,
  topY: number,
  fontSize: number,
  color: string,
  strokeColor: string,
  strokeWidth: number,
) {
  setFont(ctx, fontSize);
  const lineH = fontSize * 1.12;
  lines.forEach((line, i) => {
    const y = topY + lineH * i + lineH / 2;
    if (strokeWidth > 0) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(line, centerX, y);
    }
    ctx.fillStyle = color;
    ctx.fillText(line, centerX, y);
  });
}

function getLayerBBox(ctx: CanvasRenderingContext2D, layer: TextLayer, W: number, H: number) {
  setFont(ctx, layer.fontSize);
  const lines = wrapLines(ctx, layer.text, W - PADDING * 2);
  const lineH = layer.fontSize * 1.12;
  const totalH = lines.length * lineH;
  const centerX = layer.x * W;
  const centerY = layer.y * H;
  const topY = centerY - totalH / 2;
  let maxW = 0;
  for (const l of lines) maxW = Math.max(maxW, ctx.measureText(l).width);
  if (lines.length === 0) maxW = layer.fontSize * 2;
  const pad = 10;
  return { x1: centerX - maxW / 2 - pad, y1: topY - pad, x2: centerX + maxW / 2 + pad, y2: topY + totalH + pad };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function MemeGenerator({ locale = 'en' }: Props) {
  const dict = translations[locale] || translations.en;
  const t = (key: string) => dict[key] ?? translations.en[key] ?? key;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('whiteFrame');
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: TEMPLATE_SIZE, h: TEMPLATE_SIZE });

  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const [fontSize, setFontSize] = useState(44);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(6);

  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const selectedLayer = selectedLayerId ? layers.find((l) => l.id === selectedLayerId) ?? null : null;

  const curFontSize = selectedLayer ? selectedLayer.fontSize : fontSize;
  const curTextColor = selectedLayer ? selectedLayer.color : textColor;
  const curStrokeColor = selectedLayer ? selectedLayer.strokeColor : strokeColor;
  const curStrokeWidth = selectedLayer ? selectedLayer.strokeWidth : strokeWidth;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = dims.w;
    const H = dims.h;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    if (image) {
      ctx.drawImage(image, 0, 0, W, H);
    } else {
      drawTemplateBg(ctx, templateId, W, H);
    }

    const maxTextWidth = W - PADDING * 2;

    if (topText.trim()) {
      setFont(ctx, fontSize);
      const lines = wrapLines(ctx, topText, maxTextWidth);
      drawLines(ctx, lines, W / 2, PADDING, fontSize, textColor, strokeColor, strokeWidth);
    }
    if (bottomText.trim()) {
      setFont(ctx, fontSize);
      const lines = wrapLines(ctx, bottomText, maxTextWidth);
      const lineH = fontSize * 1.12;
      const topY = H - PADDING - lines.length * lineH;
      drawLines(ctx, lines, W / 2, topY, fontSize, textColor, strokeColor, strokeWidth);
    }

    for (const layer of layers) {
      setFont(ctx, layer.fontSize);
      const lines = wrapLines(ctx, layer.text, maxTextWidth);
      const lineH = layer.fontSize * 1.12;
      const topY = layer.y * H - (lines.length * lineH) / 2;
      drawLines(ctx, lines, layer.x * W, topY, layer.fontSize, layer.color, layer.strokeColor, layer.strokeWidth);
    }
  }, [image, templateId, dims, topText, bottomText, fontSize, textColor, strokeColor, strokeWidth, layers]);

  useEffect(() => {
    draw();
  }, [draw]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (!w || !h) { w = TEMPLATE_SIZE; h = TEMPLATE_SIZE; }
        const maxDim = MAX_IMAGE_DIM;
        if (w > maxDim || h > maxDim) {
          const r = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        setDims({ w, h });
        setImage(img);
        setTemplateId('whiteFrame');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectTemplate = (id: TemplateId) => {
    setTemplateId(id);
    setImage(null);
    setDims({ w: TEMPLATE_SIZE, h: TEMPLATE_SIZE });
  };

  const addLayer = () => {
    const id = `l${Date.now()}`;
    const yOff = 0.35 + (layers.length % 3) * 0.12;
    setLayers((prev) => [
      ...prev,
      {
        id,
        text: t('newLayerText'),
        x: 0.5,
        y: yOff,
        fontSize,
        color: textColor,
        strokeColor,
        strokeWidth,
      },
    ]);
    setSelectedLayerId(id);
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const updateLayerText = (text: string) => {
    if (!selectedLayer) return;
    setLayers((prev) => prev.map((l) => (l.id === selectedLayer.id ? { ...l, text } : l)));
  };

  const setStyle = (patch: Partial<Pick<TextLayer, 'fontSize' | 'color' | 'strokeColor' | 'strokeWidth'>>) => {
    if (selectedLayer) {
      setLayers((prev) => prev.map((l) => (l.id === selectedLayer.id ? { ...l, ...patch } : l)));
    } else {
      if (patch.fontSize !== undefined) setFontSize(patch.fontSize);
      if (patch.color !== undefined) setTextColor(patch.color);
      if (patch.strokeColor !== undefined) setStrokeColor(patch.strokeColor);
      if (patch.strokeWidth !== undefined) setStrokeWidth(patch.strokeWidth);
    }
  };

  const clearText = () => {
    setTopText('');
    setBottomText('');
    setLayers([]);
    setSelectedLayerId(null);
  };

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    const W = canvas.width;
    const H = canvas.height;
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const b = getLayerBBox(ctx, layer, W, H);
      if (pos.x >= b.x1 && pos.x <= b.x2 && pos.y >= b.y1 && pos.y <= b.y2) {
        setSelectedLayerId(layer.id);
        const lx = layer.x * W;
        const ly = layer.y * H;
        dragRef.current = { id: layer.id, offsetX: pos.x - lx, offsetY: pos.y - ly };
        try { canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }
        return;
      }
    }
    setSelectedLayerId(null);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getCanvasPos(e);
    const W = canvas.width;
    const H = canvas.height;
    const { id, offsetX, offsetY } = dragRef.current;
    setLayers((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, x: clamp((pos.x - offsetX) / W, 0, 1), y: clamp((pos.y - offsetY) / H, 0, 1) }
          : l,
      ),
    );
  };

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        try { canvas.releasePointerCapture(e.pointerId); } catch { /* noop */ }
      }
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevSel = selectedLayerId;
    setSelectedLayerId(null);
    requestAnimationFrame(() => {
      draw();
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meme-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSelectedLayerId(prevSel);
      }, 'image/png');
    });
  };

  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';
  const cardClass = 'bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700';
  const inputClass =
    'w-full min-h-[44px] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 outline-none';

  return (
    <div className='max-w-3xl mx-auto px-1 sm:px-2'>
      <div className='mb-5 flex items-start gap-3'>
        <div className='p-2.5 bg-indigo-600 rounded-xl text-white shrink-0'>
          <Type className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
        </div>
      </div>

      {/* Preview */}
      <div className={`${cardClass} mb-4`}>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>{t('preview')}</span>
          <button
            onClick={clearText}
            className='inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
          >
            <RotateCcw className='h-3.5 w-3.5' />
            {t('clearText')}
          </button>
        </div>

        <div className='flex justify-center'>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className='w-full max-w-[560px] h-auto block rounded-xl bg-white shadow-sm border border-gray-200 dark:border-gray-700 touch-none select-none'
            style={{ aspectRatio: `${dims.w} / ${dims.h}` }}
          />
        </div>

        <p className='mt-3 text-xs text-gray-500 dark:text-gray-400 text-center'>{t('dragTip')}</p>

        <div className='mt-4 flex flex-wrap gap-2'>
          <button
            onClick={() => fileInputRef.current?.click()}
            className='inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors'
          >
            <Upload className='h-4 w-4' />
            {t('uploadImage')}
          </button>
          <button
            onClick={downloadPng}
            className='inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors'
          >
            <Download className='h-4 w-4' />
            {t('downloadPng')}
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={onUpload}
            className='hidden'
          />
        </div>
        <p className='mt-2 text-[11px] text-gray-400 dark:text-gray-500 inline-flex items-center gap-1'>
          <ImageIcon className='h-3 w-3' />
          {t('uploadHint')}
        </p>
      </div>

      {/* Templates */}
      <div className={`${cardClass} mb-4`}>
        <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('templates')}</h3>
        <div className='grid grid-cols-3 sm:grid-cols-6 gap-2'>
          {TEMPLATE_LIST.map((id) => (
            <button
              key={id}
              onClick={() => selectTemplate(id)}
              className={`min-h-[44px] px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${
                !image && templateId === id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t(`tpl${id.charAt(0).toUpperCase()}${id.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Classic top / bottom text */}
      <div className={`${cardClass} mb-4`}>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>{t('topText')}</label>
            <input
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder={t('topTextPh')}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('bottomText')}</label>
            <input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder={t('bottomTextPh')}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Text style */}
      <div className={`${cardClass} mb-4`}>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100'>{t('textStyle')}</h3>
          <span className='text-[11px] px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'>
            {selectedLayer ? t('editingLayer') : t('editingClassic')}
          </span>
        </div>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>
              {t('fontSize')}: {Math.round(curFontSize)}px
            </label>
            <input
              type='range'
              min={16}
              max={96}
              value={curFontSize}
              onChange={(e) => setStyle({ fontSize: Number(e.target.value) })}
              className='w-full accent-indigo-600 min-h-[44px]'
            />
          </div>
          <div>
            <label className={labelClass}>
              {t('strokeWidth')}: {Math.round(curStrokeWidth)}px
            </label>
            <input
              type='range'
              min={0}
              max={14}
              value={curStrokeWidth}
              onChange={(e) => setStyle({ strokeWidth: Number(e.target.value) })}
              className='w-full accent-indigo-600 min-h-[44px]'
            />
          </div>
          <div>
            <label className={labelClass}>{t('textColor')}</label>
            <div className='flex items-center gap-2 min-h-[44px]'>
              <input
                type='color'
                value={curTextColor}
                onChange={(e) => setStyle({ color: e.target.value })}
                className='h-11 w-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer p-1'
              />
              <span className='text-xs text-gray-500 dark:text-gray-400 font-mono'>{curTextColor}</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('strokeColor')}</label>
            <div className='flex items-center gap-2 min-h-[44px]'>
              <input
                type='color'
                value={curStrokeColor}
                onChange={(e) => setStyle({ strokeColor: e.target.value })}
                className='h-11 w-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent cursor-pointer p-1'
              />
              <span className='text-xs text-gray-500 dark:text-gray-400 font-mono'>{curStrokeColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Free text layers */}
      <div className={`${cardClass} mb-4`}>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100'>{t('textLayers')}</h3>
          <button
            onClick={addLayer}
            className='inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors'
          >
            <Plus className='h-4 w-4' />
            {t('addLayer')}
          </button>
        </div>

        {selectedLayer && (
          <div className='mb-3'>
            <label className={labelClass}>{t('editingLayer')}</label>
            <textarea
              value={selectedLayer.text}
              onChange={(e) => updateLayerText(e.target.value)}
              placeholder={t('layerTextPh')}
              rows={2}
              className={`${inputClass} resize-y`}
            />
          </div>
        )}

        {layers.length === 0 ? (
          <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{t('noLayers')}</p>
        ) : (
          <ul className='space-y-2'>
            {layers.map((layer, idx) => (
              <li
                key={layer.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                  selectedLayerId === layer.id
                    ? 'border-indigo-400 bg-indigo-50/60 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40'
                }`}
              >
                <button
                  onClick={() => setSelectedLayerId(layer.id)}
                  className='flex-1 min-w-0 text-start min-h-[40px] flex items-center'
                >
                  <span className='text-[11px] font-mono text-gray-400 me-2 shrink-0'>#{idx + 1}</span>
                  <span className='truncate text-sm text-gray-800 dark:text-gray-200'>
                    {layer.text || t('layerTextPh')}
                  </span>
                </button>
                {selectedLayerId === layer.id && (
                  <span className='text-[10px] font-medium text-indigo-600 dark:text-indigo-400 shrink-0'>
                    {t('selected')}
                  </span>
                )}
                <button
                  onClick={() => deleteLayer(layer.id)}
                  aria-label={t('deleteLayer')}
                  className='shrink-0 inline-flex items-center justify-center w-11 h-11 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
