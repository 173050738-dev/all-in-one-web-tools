export interface PromptField {
  key: string;
  enLabel: string;
  zhLabel: string;
  options: { value: string; en: string; zh: string }[];
}

export interface PromptModel {
  id: string;
  kind: 'image' | 'video';
  enName: string;
  zhName: string;
  fields: PromptField[];
  join: (values: Record<string, string>, lang: 'en' | 'zh') => string;
}

const universalImageFields: PromptField[] = [
  {
    key: 'subject',
    enLabel: 'Subject',
    zhLabel: '主体',
    options: [
      { value: 'a beautiful girl', en: 'Beautiful girl', zh: '美丽女孩' },
      { value: 'a handsome man', en: 'Handsome man', zh: '帅气男人' },
      { value: 'a cute cat', en: 'Cute cat', zh: '可爱猫咪' },
      { value: 'a majestic mountain', en: 'Majestic mountain', zh: '雄伟山脉' },
      { value: 'a futuristic city', en: 'Futuristic city', zh: '未来城市' },
      { value: 'a cozy room', en: 'Cozy room', zh: '温馨房间' },
    ],
  },
  {
    key: 'style',
    enLabel: 'Style',
    zhLabel: '风格',
    options: [
      { value: 'photorealistic', en: 'Photorealistic', zh: '照片写实' },
      { value: 'anime', en: 'Anime', zh: '动漫风' },
      { value: 'oil painting', en: 'Oil painting', zh: '油画' },
      { value: 'watercolor', en: 'Watercolor', zh: '水彩' },
      { value: 'cyberpunk', en: 'Cyberpunk', zh: '赛博朋克' },
      { value: 'minimalist', en: 'Minimalist', zh: '极简' },
    ],
  },
  {
    key: 'lighting',
    enLabel: 'Lighting',
    zhLabel: '光线',
    options: [
      { value: 'golden hour', en: 'Golden hour', zh: '黄金时刻' },
      { value: 'soft studio light', en: 'Soft studio light', zh: '柔和影棚光' },
      { value: 'dramatic backlight', en: 'Dramatic backlight', zh: '戏剧性背光' },
      { value: 'neon glow', en: 'Neon glow', zh: '霓虹光晕' },
      { value: 'natural sunlight', en: 'Natural sunlight', zh: '自然阳光' },
      { value: 'moonlit', en: 'Moonlit', zh: '月光' },
    ],
  },
  {
    key: 'composition',
    enLabel: 'Composition',
    zhLabel: '构图',
    options: [
      { value: 'close-up shot', en: 'Close-up', zh: '特写' },
      { value: 'wide angle', en: 'Wide angle', zh: '广角' },
      { value: 'portrait', en: 'Portrait', zh: '人像' },
      { value: 'bird eye view', en: 'Bird eye view', zh: '鸟瞰' },
      { value: 'low angle', en: 'Low angle', zh: '低角度' },
      { value: 'symmetrical', en: 'Symmetrical', zh: '对称' },
    ],
  },
  {
    key: 'quality',
    enLabel: 'Quality',
    zhLabel: '画质',
    options: [
      { value: '8k ultra detailed', en: '8K ultra detailed', zh: '8K 超精细' },
      { value: '4k high resolution', en: '4K high resolution', zh: '4K 高清' },
      { value: 'masterpiece', en: 'Masterpiece', zh: '杰作' },
      { value: 'professional photography', en: 'Professional photo', zh: '专业摄影' },
    ],
  },
  {
    key: 'mood',
    enLabel: 'Mood',
    zhLabel: '氛围',
    options: [
      { value: 'dreamy', en: 'Dreamy', zh: '梦幻' },
      { value: 'epic', en: 'Epic', zh: '史诗' },
      { value: 'peaceful', en: 'Peaceful', zh: '宁静' },
      { value: 'mysterious', en: 'Mysterious', zh: '神秘' },
      { value: 'vibrant', en: 'Vibrant', zh: '活力' },
      { value: 'melancholic', en: 'Melancholic', zh: '忧郁' },
    ],
  },
];

const midjourneyFields: PromptField[] = [
  ...universalImageFields,
  {
    key: 'aspect',
    enLabel: 'Aspect Ratio',
    zhLabel: '比例',
    options: [
      { value: '--ar 16:9', en: '16:9 (landscape)', zh: '16:9 横版' },
      { value: '--ar 9:16', en: '9:16 (portrait)', zh: '9:16 竖版' },
      { value: '--ar 1:1', en: '1:1 (square)', zh: '1:1 方形' },
      { value: '--ar 4:3', en: '4:3', zh: '4:3' },
      { value: '--ar 3:4', en: '3:4', zh: '3:4' },
    ],
  },
];

const universalVideoFields: PromptField[] = [
  {
    key: 'subject',
    enLabel: 'Subject',
    zhLabel: '主体',
    options: [
      { value: 'a person walking', en: 'Person walking', zh: '行走的人' },
      { value: 'a flowing river', en: 'Flowing river', zh: '流淌的河' },
      { value: 'a dancing girl', en: 'Dancing girl', zh: '跳舞的女孩' },
      { value: 'a flying dragon', en: 'Flying dragon', zh: '飞翔的龙' },
      { value: 'a city at night', en: 'City at night', zh: '夜晚城市' },
      { value: 'ocean waves', en: 'Ocean waves', zh: '海浪' },
    ],
  },
  {
    key: 'action',
    enLabel: 'Action',
    zhLabel: '动作',
    options: [
      { value: 'slowly moving', en: 'Slow motion', zh: '慢动作' },
      { value: 'dynamic movement', en: 'Dynamic', zh: '动态' },
      { value: 'rotating', en: 'Rotating', zh: '旋转' },
      { value: 'floating', en: 'Floating', zh: '漂浮' },
      { value: 'exploding', en: 'Exploding', zh: '爆炸' },
      { value: 'calm and still', en: 'Calm', zh: '静止' },
    ],
  },
  {
    key: 'camera',
    enLabel: 'Camera',
    zhLabel: '镜头',
    options: [
      { value: 'cinematic tracking shot', en: 'Tracking shot', zh: '跟踪镜头' },
      { value: 'drone aerial view', en: 'Drone shot', zh: '无人机航拍' },
      { value: 'close-up dolly in', en: 'Dolly in close-up', zh: '推近特写' },
      { value: 'slow pan left', en: 'Slow pan', zh: '缓慢平移' },
      { value: 'handheld shake', en: 'Handheld', zh: '手持抖动' },
      { value: 'static tripod', en: 'Static tripod', zh: '固定三脚架' },
    ],
  },
  {
    key: 'lighting',
    enLabel: 'Lighting',
    zhLabel: '光线',
    options: [
      { value: 'golden hour lighting', en: 'Golden hour', zh: '黄金时刻' },
      { value: 'neon lights', en: 'Neon lights', zh: '霓虹灯光' },
      { value: 'moonlight', en: 'Moonlight', zh: '月光' },
      { value: 'studio lighting', en: 'Studio light', zh: '影棚光' },
      { value: 'sunset glow', en: 'Sunset glow', zh: '日落余晖' },
    ],
  },
  {
    key: 'style',
    enLabel: 'Style',
    zhLabel: '风格',
    options: [
      { value: 'photorealistic', en: 'Photorealistic', zh: '照片写实' },
      { value: 'anime style', en: 'Anime', zh: '动漫' },
      { value: 'cinematic film', en: 'Cinematic', zh: '电影感' },
      { value: '3d render', en: '3D render', zh: '3D 渲染' },
      { value: 'watercolor animation', en: 'Watercolor', zh: '水彩动画' },
    ],
  },
  {
    key: 'duration',
    enLabel: 'Duration',
    zhLabel: '时长',
    options: [
      { value: '5 second clip', en: '5s short', zh: '5秒短片' },
      { value: '10 second scene', en: '10s scene', zh: '10秒场景' },
      { value: 'seamless loop', en: 'Seamless loop', zh: '无缝循环' },
    ],
  },
];

const soraFields: PromptField[] = [
  ...universalVideoFields,
];

function joinImagePrompt(values: Record<string, string>, lang: 'en' | 'zh'): string {
  const parts: string[] = [];
  if (values.subject) parts.push(values.subject);
  if (values.style) parts.push(values.style);
  if (values.lighting) parts.push(values.lighting);
  if (values.composition) parts.push(values.composition);
  if (values.mood) parts.push(values.mood);
  if (values.quality) parts.push(values.quality);
  if (values.aspect) parts.push(values.aspect);
  return parts.join(', ');
}

function joinVideoPrompt(values: Record<string, string>, lang: 'en' | 'zh'): string {
  const parts: string[] = [];
  if (values.subject) parts.push(values.subject);
  if (values.action) parts.push(values.action);
  if (values.camera) parts.push(values.camera);
  if (values.lighting) parts.push(values.lighting);
  if (values.style) parts.push(values.style);
  if (values.duration) parts.push(values.duration);
  return parts.join(', ');
}

export const promptModels: PromptModel[] = [
  {
    id: 'universal-image',
    kind: 'image',
    enName: 'Universal Image',
    zhName: '通用图像',
    fields: universalImageFields,
    join: joinImagePrompt,
  },
  {
    id: 'midjourney',
    kind: 'image',
    enName: 'Midjourney',
    zhName: 'Midjourney',
    fields: midjourneyFields,
    join: (values, lang) => joinImagePrompt(values, lang) + ' --v 6',
  },
  {
    id: 'universal-video',
    kind: 'video',
    enName: 'Universal Video',
    zhName: '通用视频',
    fields: universalVideoFields,
    join: joinVideoPrompt,
  },
  {
    id: 'sora',
    kind: 'video',
    enName: 'Sora',
    zhName: 'Sora',
    fields: soraFields,
    join: joinVideoPrompt,
  },
];

export function getPromptModel(id: string): PromptModel | undefined {
  return promptModels.find((m) => m.id === id);
}
