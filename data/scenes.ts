export interface Scene {
  id: string;
  icon: string;
  toolSlugs: string[];
}

export const scenes: Scene[] = [
  {
    id: 'content-creator',
    icon: 'Sparkles',
    toolSlugs: ['canva', 'remove-bg', 'tinypng', 'coolors', 'chatgpt', 'deepl'],
  },
  {
    id: 'developer',
    icon: 'Code',
    toolSlugs: ['github', 'replit', 'regex101', 'jsonlint', 'base64encode', 'uuid-generator'],
  },
  {
    id: 'designer',
    icon: 'Palette',
    toolSlugs: ['figma', 'photopea', 'coolors', 'unsplash', 'dribbble', 'fontpair'],
  },
  {
    id: 'student',
    icon: 'GraduationCap',
    toolSlugs: ['deepl', 'google-translate', 'ilovepdf', 'grammarly', 'typing-game', 'tinypng'],
  },
  {
    id: 'office-worker',
    icon: 'Briefcase',
    toolSlugs: ['notion', 'google-docs', 'ilovepdf', 'qrcode-monke', 'timestamp-converter', 'password-generator'],
  },
  {
    id: 'video-creator',
    icon: 'Video',
    toolSlugs: ['kapwing', 'runway', 'synthesia', 'elevenlabs', 'remove-music', 'vidshift'],
  },
];

export function getSceneTools(sceneId: string) {
  const scene = scenes.find(s => s.id === sceneId);
  return scene ? scene.toolSlugs : [];
}
