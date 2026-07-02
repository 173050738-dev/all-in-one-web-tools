import { Tool } from './tools';

const synonymMap: Record<string, string[]> = {
  '图片压缩': ['压缩图片', '图片变小', '照片压缩', '减小图片', '图片优化', '压图'],
  '抠图': ['去背景', '背景去除', '透明背景', '抠背景', '换背景', 'remove background'],
  'pdf': ['PDF', 'pdf文档', 'pdf文件', 'Adobe Acrobat'],
  'pdf压缩': ['压缩pdf', 'pdf变小', '减小pdf', 'pdf优化'],
  '翻译': ['翻译工具', '在线翻译', '翻译器', 'translate', '翻译软件'],
  '二维码': ['qr码', 'QR Code', '扫码', '生成二维码'],
  '格式转换': ['转换格式', '文件转换', '格式互转', 'converter'],
  'json': ['JSON', 'json格式化', 'json校验', 'json工具'],
  'base64': ['Base64', 'base64编码', 'base64解码', '编码解码'],
  '设计': ['设计师', '设计工具', '平面设计', 'UI设计', 'design'],
  '配色': ['颜色', '调色板', '配色方案', 'color', '色彩'],
  '图标': ['icon', '图标库', '矢量图标', '图标下载'],
  '字体': ['font', '字体下载', '字库', '字体设计'],
  '写作': ['写作工具', '文案', '文章', 'writing', '创作'],
  '办公': ['效率', '工作', 'office', '生产力', '提效'],
  '笔记': ['记事本', '笔记软件', 'notion', '笔记工具'],
  '视频': ['视频编辑', '视频处理', 'video', '剪辑'],
  '音频': ['音乐', '声音', 'audio', '音效'],
  'ai': ['AI', '人工智能', '智能', 'artificial intelligence', 'gpt'],
  '开发': ['程序员', '开发者', 'developer', '编程', '代码'],
  '前端': ['前端开发', 'web开发', 'html', 'css', 'javascript'],
  '学习': ['学生', '教育', 'study', 'learn', '学习工具'],
  'ppt': ['演示文稿', '幻灯片', 'powerpoint', 'PPT模板'],
  '团队': ['协作', '团队协作', 'collaboration', '项目管理'],
  '图片': ['图像', '照片', 'image', 'photo', '图'],
  '压缩': ['compress', '压缩工具', '文件压缩'],
  '生成': ['制作', '创建', 'generate', '生成器'],
  '在线': ['网页版', '在线工具', 'online', '网页工具'],
  '免费': ['free', '免费工具', '无需付费'],
  'remove background': ['抠图', '去背景', '背景去除', '透明背景'],
  'compress image': ['图片压缩', '压缩图片', '图片变小', '照片压缩'],
  'pdf editor': ['pdf编辑', '编辑pdf', 'pdf修改'],
  'qr code': ['二维码', 'qr码', '扫码'],
  'color palette': ['配色', '调色板', '配色方案'],
  'code editor': ['代码编辑器', '在线编辑器', '编程工具'],
  'project management': ['项目管理', '团队协作', '任务管理'],
  'text to speech': ['文字转语音', '语音合成', 'tts'],
};

export function searchTools(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) return tools;

  const q = query.toLowerCase().trim();
  const queryWords = q.split(/\s+/).filter(w => w.length > 0);

  const expandedTerms = new Set<string>([q, ...queryWords]);
  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if (q.includes(key.toLowerCase()) || key.toLowerCase().includes(q)) {
      synonyms.forEach(s => expandedTerms.add(s.toLowerCase()));
    }
    for (const word of queryWords) {
      if (key.toLowerCase().includes(word) || word.includes(key.toLowerCase())) {
        synonyms.forEach(s => expandedTerms.add(s.toLowerCase()));
      }
    }
  }

  const scored = tools.map(tool => {
    let score = 0;

    const name = tool.name.toLowerCase();
    const desc = tool.description.toLowerCase();
    const tags = tool.tags.map(t => t.toLowerCase());

    if (name.includes(q)) score += 100;
    if (tags.some(t => t === q)) score += 80;
    if (tags.some(t => t.includes(q))) score += 50;
    if (desc.includes(q)) score += 30;

    for (const term of expandedTerms) {
      if (name.includes(term)) score += 40;
      if (tags.some(t => t.includes(term))) score += 25;
      if (desc.includes(term)) score += 15;
    }

    for (const word of queryWords) {
      if (name.includes(word)) score += 20;
      if (tags.some(t => t.includes(word))) score += 15;
      if (desc.includes(word)) score += 8;
    }

    return { tool, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.tool);
}
