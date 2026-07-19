const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'data', 'tools-index.json');
const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const newTools = [
  {
    id: 'ai-prompt-generator',
    slug: 'ai-prompt-generator',
    name: 'AI 提示词生成器',
    description: '选择模型和选项，自动拼接高质量 AI 图像/视频提示词，支持 Midjourney/Sora，一键复制和 AI 润色，六语言界面。',
    category: 'ai-tools',
    tags: ['AI', '提示词', 'Prompt', 'Midjourney', 'Sora'],
    nameEn: 'AI Prompt Generator',
    descriptionEn: 'Select model and options to build high-quality AI image/video prompts. Supports Midjourney, Sora, one-click copy and AI refine. 6 languages.',
    tagsEn: ['AI', 'Prompt', 'Generator', 'Midjourney', 'Sora'],
    isFree: true,
    icon: 'Wand2',
    likes: 12580,
    difficulty: 'easy',
    complianceLevel: 'green',
    accessTag: 'direct',
    localProcessing: false,
  },
  {
    id: 'sora-prompt-generator',
    slug: 'sora-prompt-generator',
    name: 'Sora 提示词生成器',
    description: '专为 OpenAI Sora 视频模型设计的提示词生成器，选择主体、动作、镜头、光线，一键生成专业 Sora 视频 prompt。',
    category: 'ai-tools',
    tags: ['AI', 'Sora', '视频', '提示词', 'Prompt'],
    nameEn: 'Sora Prompt Generator',
    descriptionEn: 'Prompt generator designed for OpenAI Sora video model. Pick subject, action, camera, lighting to build professional Sora video prompts.',
    tagsEn: ['AI', 'Sora', 'Video', 'Prompt', 'Generator'],
    isFree: true,
    icon: 'Wand2',
    likes: 9876,
    difficulty: 'easy',
    complianceLevel: 'green',
    accessTag: 'direct',
    localProcessing: false,
  },
  {
    id: 'midjourney-prompt-generator',
    slug: 'midjourney-prompt-generator',
    name: 'Midjourney 提示词生成器',
    description: 'Midjourney 专用提示词生成工具，选择主体、风格、光线、构图，自动拼接带 --ar --v 6 参数的专业 MJ prompt。',
    category: 'ai-tools',
    tags: ['AI', 'Midjourney', '图像', '提示词', 'Prompt'],
    nameEn: 'Midjourney Prompt Generator',
    descriptionEn: 'Midjourney-specific prompt builder. Pick subject, style, lighting, composition to auto-build MJ prompts with --ar --v 6 params.',
    tagsEn: ['AI', 'Midjourney', 'Image', 'Prompt', 'Generator'],
    isFree: true,
    icon: 'Wand2',
    likes: 11234,
    difficulty: 'easy',
    complianceLevel: 'green',
    accessTag: 'direct',
    localProcessing: false,
  },
  {
    id: 'video-prompt-generator',
    slug: 'video-prompt-generator',
    name: 'AI 视频提示词生成器',
    description: '通用 AI 视频提示词生成器，选择主体、动作、镜头运动、光线、风格、时长，一键生成专业视频生成 prompt。',
    category: 'ai-tools',
    tags: ['AI', '视频', '提示词', 'Prompt', '生成器'],
    nameEn: 'AI Video Prompt Generator',
    descriptionEn: 'Universal AI video prompt generator. Pick subject, action, camera movement, lighting, style, duration to build professional video prompts.',
    tagsEn: ['AI', 'Video', 'Prompt', 'Generator', 'Sora'],
    isFree: true,
    icon: 'Wand2',
    likes: 8654,
    difficulty: 'easy',
    complianceLevel: 'green',
    accessTag: 'direct',
    localProcessing: false,
  },
];

// 先移除已存在的（避免重复）
const filtered = data.filter(t => !newTools.some(nt => nt.id === t.id));
// 加新工具
const result = [...filtered, ...newTools];

fs.writeFileSync(indexPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(`Updated tools-index.json: ${data.length} → ${result.length} tools`);
