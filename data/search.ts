import { Tool } from './tools';

const synonymMap: Record<string, string[]> = {
  '图片压缩': ['压缩图片', '图片变小', '照片压缩', '减小图片', '图片优化', '压图', 'compress image', 'image compress', 'reduce image size'],
  '抠图': ['去背景', '背景去除', '透明背景', '抠背景', '换背景', 'remove background', 'bg remove', 'background remover'],
  '去水印': ['去图片水印', '水印消除', '删水印', 'remove watermark', 'watermark removal', '水印去除'],
  '水印': ['加水印', '添加水印', '图片水印', 'watermark', 'add watermark'],
  'pdf': ['PDF', 'pdf文档', 'pdf文件', 'Adobe Acrobat', 'pdf工具', 'pdf处理'],
  'pdf压缩': ['压缩pdf', 'pdf变小', '减小pdf', 'pdf优化', 'compress pdf'],
  '翻译': ['翻译工具', '在线翻译', '翻译器', 'translate', '翻译软件', 'translator'],
  '二维码': ['qr码', 'QR Code', '扫码', '生成二维码', 'qr code generator'],
  '格式转换': ['转换格式', '文件转换', '格式互转', 'converter', 'convert file'],
  'json': ['JSON', 'json格式化', 'json校验', 'json工具', 'json formatter'],
  'base64': ['Base64', 'base64编码', 'base64解码', '编码解码', 'base64 encode', 'base64 decode'],
  '设计': ['设计师', '设计工具', '平面设计', 'UI设计', 'design', 'graphic design'],
  '配色': ['颜色', '调色板', '配色方案', 'color', '色彩', 'color palette'],
  '图标': ['icon', '图标库', '矢量图标', '图标下载', 'icon finder', 'svg 图标'],
  '字体': ['font', '字体下载', '字库', '字体设计', 'font generator', '字体生成'],
  '写作': ['写作工具', '文案', '文章', 'writing', '创作', 'copywriting', '文案生成'],
  '办公': ['效率', '工作', 'office', '生产力', '提效', 'productivity'],
  '笔记': ['记事本', '笔记软件', 'notion', '笔记工具', 'note', 'note taking'],
  '视频': ['视频编辑', '视频处理', 'video', '剪辑', 'video editor', '剪视频'],
  '音频': ['音乐', '声音', 'audio', '音效', 'sound', '音频编辑'],
  'ai': ['AI', '人工智能', '智能', 'artificial intelligence', 'gpt', 'chatgpt'],
  '开发': ['程序员', '开发者', 'developer', '编程', '代码', 'coding', 'programming'],
  '前端': ['前端开发', 'web开发', 'html', 'css', 'javascript', 'frontend'],
  '学习': ['学生', '教育', 'study', 'learn', '学习工具', 'education'],
  'ppt': ['演示文稿', '幻灯片', 'powerpoint', 'PPT模板', 'ppt制作', 'presentation'],
  '团队': ['协作', '团队协作', 'collaboration', '项目管理', 'team work'],
  '图片': ['图像', '照片', 'image', 'photo', '图', 'picture'],
  '压缩': ['compress', '压缩工具', '文件压缩', 'zip', 'rar'],
  '解压': ['unzip', '解压缩', 'extract', '压缩包', 'zip extract'],
  '生成': ['制作', '创建', 'generate', '生成器', 'generator', 'creator'],
  '在线': ['网页版', '在线工具', 'online', '网页工具', 'web tool'],
  '免费': ['free', '免费工具', '无需付费', 'no cost'],
  '头像': ['头像生成', '头像制作', 'avatar', 'profile picture', 'pfp', '头像装饰'],
  'p图': ['修图', '照片编辑', 'photo edit', 'photo editor', 'ps', 'photoshop', '图片处理'],
  '简历': ['cv', 'resume', '简历模板', '简历制作', 'resume builder', '简历生成'],
  'logo': ['logo设计', 'logo生成', 'logo maker', 'logo creator', '商标设计'],
  '海报': ['海报设计', '海报制作', 'poster', 'poster maker', '海报生成'],
  '字幕': ['自动字幕', '字幕生成', 'subtitles', 'video subtitle', '视频字幕', '字幕下载'],
  'excel': ['表格', 'spreadsheet', 'xlsx', 'xls', '电子表格', 'excel 处理'],
  'gif': ['动图', 'gif制作', 'gif generator', 'animated gif', 'gif动图'],
  'mp3': ['音频格式', '音乐格式', 'mp3转换', 'audio converter', '音频转换'],
  '思维导图': ['脑图', 'mind map', 'mindmap', '思维导图制作'],
  '流程图': ['flowchart', 'workflow', '流程制作', 'flow chart maker'],
  'markdown': ['md', 'markdown编辑器', 'markdown preview', 'md 编辑'],
  '单位换算': ['换算器', 'unit converter', 'convert units', '单位转换'],
  '身份证': ['身份证生成', '身份证号校验', 'id card', '身份证验证'],
  '随机密码': ['密码生成', 'password generator', '随机密码生成', 'password'],
  '录屏': ['屏幕录制', 'screen recorder', '录屏工具', 'screen capture'],
  'ocr': ['图片转文字', '文字识别', 'image to text', 'ocr识别', '文字提取'],
  'csv': ['csv 转 json', 'csv转换', 'csv to json', '表格转换'],
  'remove background': ['抠图', '去背景', '背景去除', '透明背景', 'bg remove'],
  'compress image': ['图片压缩', '压缩图片', '图片变小', '照片压缩', 'image compress'],
  'pdf editor': ['pdf编辑', '编辑pdf', 'pdf修改', 'pdf 编辑器'],
  'qr code': ['二维码', 'qr码', '扫码', 'qr code generator'],
  'color palette': ['配色', '调色板', '配色方案', '配色生成'],
  'code editor': ['代码编辑器', '在线编辑器', '编程工具', 'online editor'],
  'project management': ['项目管理', '团队协作', '任务管理', 'task management'],
  'text to speech': ['文字转语音', '语音合成', 'tts', 'text reader'],
  'speech to text': ['语音转文字', '语音识别', '语音录入', 'transcription', 'stt'],
  'image to text': ['OCR', '文字识别', '图片转文字', 'ocr识别', '文字提取'],
  'resume': ['简历', 'cv', '简历模板', '简历制作', 'resume builder'],
  'cv': ['简历', 'resume', '简历模板', '简历生成'],
  'watermark': ['水印', '去水印', '加水印', '添加水印', 'watermark removal'],
  'poster': ['海报', '海报设计', '海报制作', 'poster maker'],
  'subtitles': ['字幕', '自动字幕', '字幕生成', '视频字幕', 'subtitle'],
  'copywriting': ['文案', '写作', '文案生成', '写作工具', 'content writing'],
  'excel sheet': ['excel', '表格', 'spreadsheet', '电子表格'],
  'unzip': ['解压', '解压缩', 'extract', '压缩包解压'],
  'gif maker': ['gif制作', '动图制作', 'gif生成', 'animated gif'],
  'ocr scanner': ['OCR', '图片转文字', '文字识别', '扫描识别'],
  'markdown editor': ['markdown', 'md 编辑器', 'markdown preview', 'md 写作'],
  'password generator': ['随机密码', '密码生成', 'password', '随机密码生成'],
  'screen recorder': ['录屏', '屏幕录制', '录屏工具'],
  'mind map': ['思维导图', '脑图', 'mindmap', '思维导图制作'],
  'unit converter': ['单位换算', '单位转换', '换算器'],
  'ppt template': ['ppt模板', '幻灯片模板', '演示文稿模板', 'powerpoint template'],
  'avatar maker': ['头像制作', '头像生成', 'avatar generator', '头像设计'],
  'logo maker': ['logo设计', 'logo生成', 'logo creator', '商标设计'],
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
