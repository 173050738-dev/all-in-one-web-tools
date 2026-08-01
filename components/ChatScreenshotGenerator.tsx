'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Download, Plus, Trash2, Image as ImageIcon,
  Clock, MessageSquare, Upload, RotateCcw,
} from 'lucide-react';

interface ChatScreenshotGeneratorProps {
  locale?: string;
}

type MessageType = 'text' | 'image' | 'time';

interface ChatMessage {
  id: string;
  type: MessageType;
  sender: 'me' | 'other';
  content: string;
}

type Sender = 'me' | 'other';

interface TextPack {
  back: string;
  title: string;
  subtitle: string;
  participants: string;
  myNameLabel: string;
  otherNameLabel: string;
  myNamePlaceholder: string;
  otherNamePlaceholder: string;
  changeAvatar: string;
  addMessage: string;
  senderLabel: string;
  me: string;
  other: string;
  inputPlaceholder: string;
  addText: string;
  addImage: string;
  addTime: string;
  messageList: string;
  emptyMessage: string;
  imageLabel: string;
  clearAll: string;
  preview: string;
  download: string;
  tip: string;
  defaultTitle: string;
}

const TEXTS: Record<string, TextPack> = {
  zh: {
    back: '返回',
    title: '聊天记录生成器',
    subtitle: '纯前端生成微信风格聊天截图，可下载为 PNG',
    participants: '双方信息',
    myNameLabel: '我方昵称',
    otherNameLabel: '对方昵称',
    myNamePlaceholder: '输入你的昵称',
    otherNamePlaceholder: '输入对方昵称',
    changeAvatar: '换头像',
    addMessage: '添加消息',
    senderLabel: '当前发送方',
    me: '我',
    other: '对方',
    inputPlaceholder: '输入消息内容，回车快速添加…',
    addText: '文字',
    addImage: '图片',
    addTime: '时间线',
    messageList: '消息列表',
    emptyMessage: '还没有消息，先在上方添加一条试试',
    imageLabel: '[图片]',
    clearAll: '清空',
    preview: '实时预览',
    download: '下载 PNG',
    tip: '所有处理都在你的浏览器本地完成，不会上传任何数据',
    defaultTitle: '聊天',
  },
  en: {
    back: 'Back',
    title: 'Chat Screenshot Generator',
    subtitle: 'Create WeChat-style chat screenshots in your browser, download as PNG',
    participants: 'Participants',
    myNameLabel: 'My name',
    otherNameLabel: 'Other name',
    myNamePlaceholder: 'Enter your name',
    otherNamePlaceholder: 'Enter the other name',
    changeAvatar: 'Change',
    addMessage: 'Add message',
    senderLabel: 'Sender',
    me: 'Me',
    other: 'Other',
    inputPlaceholder: 'Type a message and press Enter to add…',
    addText: 'Text',
    addImage: 'Image',
    addTime: 'Time',
    messageList: 'Messages',
    emptyMessage: 'No messages yet. Add one above to get started.',
    imageLabel: '[Image]',
    clearAll: 'Clear',
    preview: 'Live preview',
    download: 'Download PNG',
    tip: 'Everything runs locally in your browser. No data is ever uploaded.',
    defaultTitle: 'Chat',
  },
  es: {
    back: 'Volver',
    title: 'Generador de Capturas de Chat',
    subtitle: 'Crea capturas de chat estilo WeChat en tu navegador, descarga en PNG',
    participants: 'Participantes',
    myNameLabel: 'Mi nombre',
    otherNameLabel: 'Nombre del otro',
    myNamePlaceholder: 'Introduce tu nombre',
    otherNamePlaceholder: 'Introduce el otro nombre',
    changeAvatar: 'Cambiar',
    addMessage: 'Añadir mensaje',
    senderLabel: 'Remitente',
    me: 'Yo',
    other: 'Otro',
    inputPlaceholder: 'Escribe un mensaje y pulsa Enter para añadir…',
    addText: 'Texto',
    addImage: 'Imagen',
    addTime: 'Hora',
    messageList: 'Mensajes',
    emptyMessage: 'Aún no hay mensajes. Añade uno arriba para empezar.',
    imageLabel: '[Imagen]',
    clearAll: 'Limpiar',
    preview: 'Vista previa',
    download: 'Descargar PNG',
    tip: 'Todo se procesa localmente en tu navegador. No se suben datos.',
    defaultTitle: 'Chat',
  },
  fr: {
    back: 'Retour',
    title: 'Générateur de Captures de Chat',
    subtitle: 'Créez des captures de chat style WeChat dans votre navigateur, téléchargez en PNG',
    participants: 'Participants',
    myNameLabel: 'Mon nom',
    otherNameLabel: 'Nom de l\'autre',
    myNamePlaceholder: 'Entrez votre nom',
    otherNamePlaceholder: 'Entrez le nom de l\'autre',
    changeAvatar: 'Changer',
    addMessage: 'Ajouter un message',
    senderLabel: 'Expéditeur',
    me: 'Moi',
    other: 'Autre',
    inputPlaceholder: 'Tapez un message et appuyez sur Entrée pour ajouter…',
    addText: 'Texte',
    addImage: 'Image',
    addTime: 'Heure',
    messageList: 'Messages',
    emptyMessage: 'Aucun message pour l\'instant. Ajoutez-en un ci-dessus.',
    imageLabel: '[Image]',
    clearAll: 'Vider',
    preview: 'Aperçu en direct',
    download: 'Télécharger PNG',
    tip: 'Tout est traité localement dans votre navigateur. Aucune donnée envoyée.',
    defaultTitle: 'Chat',
  },
  hi: {
    back: 'वापस',
    title: 'चैट स्क्रीनशॉट जनरेटर',
    subtitle: 'ब्राउज़र में WeChat-शैली के चैट स्क्रीनशॉट बनाएं, PNG डाउनलोड करें',
    participants: 'प्रतिभागी',
    myNameLabel: 'मेरा नाम',
    otherNameLabel: 'दूसरे का नाम',
    myNamePlaceholder: 'अपना नाम दर्ज करें',
    otherNamePlaceholder: 'दूसरे का नाम दर्ज करें',
    changeAvatar: 'बदलें',
    addMessage: 'संदेश जोड़ें',
    senderLabel: 'भेजने वाला',
    me: 'मैं',
    other: 'दूसरा',
    inputPlaceholder: 'संदेश टाइप करें और जोड़ने के लिए Enter दबाएं…',
    addText: 'टेक्स्ट',
    addImage: 'इमेज',
    addTime: 'समय',
    messageList: 'संदेश',
    emptyMessage: 'अभी कोई संदेश नहीं। ऊपर एक जोड़ें।',
    imageLabel: '[इमेज]',
    clearAll: 'साफ़ करें',
    preview: 'लाइव पूर्वावलोकन',
    download: 'PNG डाउनलोड करें',
    tip: 'सब कुछ आपके ब्राउज़र में लोकल चलता है। कोई डेटा अपलोड नहीं होता।',
    defaultTitle: 'चैट',
  },
  ar: {
    back: 'رجوع',
    title: 'مولّد لقطات الدردشة',
    subtitle: 'أنشئ لقطات دردشة بنمط WeChat في متصفحك، حمّل كـ PNG',
    participants: 'المشاركون',
    myNameLabel: 'اسمي',
    otherNameLabel: 'اسم الطرف الآخر',
    myNamePlaceholder: 'أدخل اسمك',
    otherNamePlaceholder: 'أدخل اسم الطرف الآخر',
    changeAvatar: 'تغيير',
    addMessage: 'إضافة رسالة',
    senderLabel: 'المرسل',
    me: 'أنا',
    other: 'الآخر',
    inputPlaceholder: 'اكتب رسالة واضغط Enter للإضافة…',
    addText: 'نص',
    addImage: 'صورة',
    addTime: 'وقت',
    messageList: 'الرسائل',
    emptyMessage: 'لا توجد رسائل بعد. أضف واحدة بالأعلى للبدء.',
    imageLabel: '[صورة]',
    clearAll: 'مسح',
    preview: 'معاينة مباشرة',
    download: 'تحميل PNG',
    tip: 'كل شيء يعمل محلياً في متصفحك. لا يتم رفع أي بيانات.',
    defaultTitle: 'دردشة',
  },
};

const DEFAULT_AVATAR_ME =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#7BB4E8"/><circle cx="40" cy="32" r="14" fill="#FFFFFF"/><path d="M14 72 Q40 50 66 72 L66 80 L14 80 Z" fill="#FFFFFF"/></svg>'
  );

const DEFAULT_AVATAR_OTHER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#F0A868"/><circle cx="40" cy="32" r="14" fill="#FFFFFF"/><path d="M14 72 Q40 50 66 72 L66 80 L14 80 Z" fill="#FFFFFF"/></svg>'
  );

const FONT_FAMILY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    if (para === '') {
      lines.push('');
      continue;
    }
    let line = '';
    for (let i = 0; i < para.length; i++) {
      const testLine = line + para[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = para[i];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
  }
  return lines.length ? lines : [''];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawAvatar(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, size: number
) {
  ctx.save();
  roundRect(ctx, x, y, size, size, 6);
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ChatScreenshotGenerator({ locale = 'en' }: ChatScreenshotGeneratorProps) {
  const t = TEXTS[locale] || TEXTS.en;

  const [myAvatar, setMyAvatar] = useState(DEFAULT_AVATAR_ME);
  const [otherAvatar, setOtherAvatar] = useState(DEFAULT_AVATAR_OTHER);
  const [myName, setMyName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentSender, setCurrentSender] = useState<Sender>('me');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const myAvatarInputRef = useRef<HTMLInputElement>(null);
  const otherAvatarInputRef = useRef<HTMLInputElement>(null);
  const imageMsgInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setter(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addTextMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: genId(), type: 'text', sender: currentSender, content: text }]);
    setInputText('');
  };

  const addImageMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMessages(prev => [...prev, { id: genId(), type: 'image', sender: currentSender, content: reader.result as string }]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addTimeDivider = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    setMessages(prev => [...prev, { id: genId(), type: 'time', sender: 'me', content: `${hh}:${mm}` }]);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const clearAll = () => {
    setMessages([]);
  };

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 375;
      const headerHeight = 56;
      const padding = 12;
      const avatarSize = 40;
      const avatarGap = 8;
      const bubbleMaxWidth = 200;
      const bubblePaddingH = 12;
      const bubblePaddingV = 10;
      const fontSize = 16;
      const lineHeight = 1.45;
      const msgGap = 16;
      const timeBlockHeight = 36;
      const imgMaxSize = 150;

      ctx.font = `${fontSize}px ${FONT_FAMILY}`;

      const imageCache: Record<string, HTMLImageElement> = {};
      const urlsToLoad = new Set<string>([myAvatar, otherAvatar]);
      messages.forEach(m => {
        if (m.type === 'image') urlsToLoad.add(m.content);
      });
      for (const url of urlsToLoad) {
        if (!imageCache[url]) {
          try {
            const img = await loadImage(url);
            if (cancelled) return;
            imageCache[url] = img;
          } catch {
            // skip failed image
          }
        }
      }
      if (cancelled) return;

      type Layout = { height: number; lines: string[]; bubbleWidth: number; imgW?: number; imgH?: number };
      const layout: Layout[] = messages.map(msg => {
        if (msg.type === 'time') {
          return { height: timeBlockHeight, lines: [], bubbleWidth: 0 };
        }
        if (msg.type === 'image') {
          const img = imageCache[msg.content];
          let imgW = imgMaxSize;
          let imgH = imgMaxSize;
          if (img && img.width && img.height) {
            const ratio = img.width / img.height;
            if (ratio >= 1) {
              imgW = imgMaxSize;
              imgH = Math.max(1, imgMaxSize / ratio);
            } else {
              imgH = imgMaxSize;
              imgW = Math.max(1, imgMaxSize * ratio);
            }
          }
          return { height: imgH, lines: [], bubbleWidth: imgW, imgW, imgH };
        }
        ctx.font = `${fontSize}px ${FONT_FAMILY}`;
        const lines = wrapText(ctx, msg.content, bubbleMaxWidth - bubblePaddingH * 2);
        let bubbleWidth = 0;
        lines.forEach(l => {
          bubbleWidth = Math.max(bubbleWidth, ctx.measureText(l).width);
        });
        bubbleWidth += bubblePaddingH * 2;
        const height = lines.length * fontSize * lineHeight + bubblePaddingV * 2;
        return { height, lines, bubbleWidth };
      });

      let totalHeight = headerHeight + padding;
      layout.forEach(l => {
        totalHeight += l.height + msgGap;
      });
      totalHeight += padding;
      totalHeight = Math.max(totalHeight, 420);

      canvas.width = width;
      canvas.height = Math.round(totalHeight);

      // Background
      ctx.fillStyle = '#EDEDED';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header bar
      ctx.fillStyle = '#EDEDED';
      ctx.fillRect(0, 0, width, headerHeight);
      ctx.fillStyle = '#D9D9D9';
      ctx.fillRect(0, headerHeight - 0.5, width, 0.5);

      // Back arrow
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const ax = 16;
      const ay = headerHeight / 2;
      ctx.beginPath();
      ctx.moveTo(ax + 6, ay - 6);
      ctx.lineTo(ax, ay);
      ctx.lineTo(ax + 6, ay + 6);
      ctx.stroke();

      // Title (other name)
      ctx.fillStyle = '#000000';
      ctx.font = `bold 17px ${FONT_FAMILY}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const titleText = otherName.trim() || t.defaultTitle;
      ctx.fillText(titleText, width / 2, headerHeight / 2, width - 90);

      // Messages
      let y = headerHeight + padding;
      messages.forEach((msg, i) => {
        const info = layout[i];

        if (msg.type === 'time') {
          ctx.font = `12px ${FONT_FAMILY}`;
          const tw = ctx.measureText(msg.content).width;
          const boxW = tw + 16;
          const boxH = 20;
          const boxX = (width - boxW) / 2;
          const boxY = y + (timeBlockHeight - boxH) / 2;
          ctx.fillStyle = 'rgba(0,0,0,0.15)';
          roundRect(ctx, boxX, boxY, boxW, boxH, 4);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(msg.content, width / 2, boxY + boxH / 2);
          y += info.height + msgGap;
          return;
        }

        const isMe = msg.sender === 'me';
        const avatarImg = imageCache[isMe ? myAvatar : otherAvatar];
        const avatarX = isMe ? width - padding - avatarSize : padding;

        if (avatarImg) {
          drawAvatar(ctx, avatarImg, avatarX, y, avatarSize);
        } else {
          ctx.fillStyle = '#CCCCCC';
          roundRect(ctx, avatarX, y, avatarSize, avatarSize, 6);
          ctx.fill();
        }

        if (msg.type === 'image') {
          const bw = info.imgW || imgMaxSize;
          const bh = info.imgH || imgMaxSize;
          const bubbleX = isMe
            ? width - padding - avatarSize - avatarGap - bw
            : padding + avatarSize + avatarGap;
          const img = imageCache[msg.content];
          if (img) {
            ctx.save();
            roundRect(ctx, bubbleX, y, bw, bh, 6);
            ctx.clip();
            ctx.drawImage(img, bubbleX, y, bw, bh);
            ctx.restore();
          } else {
            ctx.fillStyle = '#DDDDDD';
            roundRect(ctx, bubbleX, y, bw, bh, 6);
            ctx.fill();
          }
        } else {
          const bubbleX = isMe
            ? width - padding - avatarSize - avatarGap - info.bubbleWidth
            : padding + avatarSize + avatarGap;
          const bubbleY = y;
          ctx.fillStyle = isMe ? '#95EC69' : '#FFFFFF';
          roundRect(ctx, bubbleX, bubbleY, info.bubbleWidth, info.height, 6);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.font = `${fontSize}px ${FONT_FAMILY}`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          info.lines.forEach((line, li) => {
            ctx.fillText(
              line,
              bubbleX + bubblePaddingH,
              bubbleY + bubblePaddingV + li * fontSize * lineHeight
            );
          });
        }

        y += info.height + msgGap;
      });
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [messages, myName, otherName, myAvatar, otherAvatar, t.defaultTitle]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || messages.length === 0) return;
    const link = document.createElement('a');
    link.download = 'chat-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const senderLabel = (s: Sender) => (s === 'me' ? (myName.trim() || t.me) : (otherName.trim() || t.other));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4 min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.back}</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control panel */}
        <div className="space-y-4 order-2 lg:order-1">
          {/* Participants */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t.participants}</h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => myAvatarInputRef.current?.click()}
                className="flex flex-col items-center gap-1 shrink-0"
                aria-label={t.changeAvatar}
              >
                <img
                  src={myAvatar}
                  alt={t.me}
                  className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                />
                <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 min-h-[44px]">
                  <Upload className="h-3 w-3" />
                  {t.changeAvatar}
                </span>
              </button>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t.myNameLabel}</label>
                <input
                  type="text"
                  value={myName}
                  onChange={e => setMyName(e.target.value)}
                  placeholder={t.myNamePlaceholder}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => otherAvatarInputRef.current?.click()}
                className="flex flex-col items-center gap-1 shrink-0"
                aria-label={t.changeAvatar}
              >
                <img
                  src={otherAvatar}
                  alt={t.other}
                  className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                />
                <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 min-h-[44px]">
                  <Upload className="h-3 w-3" />
                  {t.changeAvatar}
                </span>
              </button>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t.otherNameLabel}</label>
                <input
                  type="text"
                  value={otherName}
                  onChange={e => setOtherName(e.target.value)}
                  placeholder={t.otherNamePlaceholder}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Add message */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t.addMessage}</h2>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t.senderLabel}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentSender('me')}
                  className={`flex-1 h-11 rounded-lg border text-sm font-medium transition ${
                    currentSender === 'me'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t.me}{myName.trim() ? ` · ${myName.trim()}` : ''}
                </button>
                <button
                  onClick={() => setCurrentSender('other')}
                  className={`flex-1 h-11 rounded-lg border text-sm font-medium transition ${
                    currentSender === 'other'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t.other}{otherName.trim() ? ` · ${otherName.trim()}` : ''}
                </button>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addTextMessage();
                }
              }}
              placeholder={t.inputPlaceholder}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={addTextMessage}
                className="flex items-center gap-1 h-11 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-40"
                disabled={!inputText.trim()}
              >
                <Plus className="h-4 w-4" />
                {t.addText}
              </button>
              <button
                onClick={() => imageMsgInputRef.current?.click()}
                className="flex items-center gap-1 h-11 px-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-indigo-400 transition"
              >
                <ImageIcon className="h-4 w-4" />
                {t.addImage}
              </button>
              <button
                onClick={addTimeDivider}
                className="flex items-center gap-1 h-11 px-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-indigo-400 transition"
              >
                <Clock className="h-4 w-4" />
                {t.addTime}
              </button>
            </div>
          </div>

          {/* Message list */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {t.messageList} ({messages.length})
              </h2>
              {messages.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 h-9 px-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t.clearAll}
                </button>
              )}
            </div>

            {messages.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">{t.emptyMessage}</p>
            ) : (
              <div className="space-y-1 max-h-72 overflow-y-auto pe-1">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                      <span
                        className={`inline-block w-10 shrink-0 text-xs ${
                          msg.sender === 'me'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-orange-500'
                        }`}
                      >
                        {senderLabel(msg.sender)}
                      </span>
                      <span className="text-gray-400 mx-1">·</span>
                      {msg.type === 'time' ? (
                        <span className="text-gray-500">⏰ {msg.content}</span>
                      ) : msg.type === 'image' ? (
                        <span className="text-gray-500">{t.imageLabel}</span>
                      ) : (
                        <span className="truncate">{msg.content}</span>
                      )}
                    </span>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="h-11 w-11 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition shrink-0"
                      aria-label="delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3 order-1 lg:order-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t.preview}</h2>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 flex justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full rounded-lg shadow-lg"
              style={{ width: '100%', maxWidth: '375px' }}
            />
          </div>
          <button
            onClick={download}
            disabled={messages.length === 0}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            {t.download}
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{t.tip}</p>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={myAvatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleAvatarUpload(e, setMyAvatar)}
      />
      <input
        ref={otherAvatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleAvatarUpload(e, setOtherAvatar)}
      />
      <input
        ref={imageMsgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={addImageMessage}
      />
    </div>
  );
}
