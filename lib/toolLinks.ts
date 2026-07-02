export type ToolLinkType = 'internal' | 'external' | 'fallback';

export interface ResolvedToolLink {
  type: ToolLinkType;
  url: string;
  realSlug?: string;
  displayName?: string;
}

export const INTERNAL_TOOL_SLUGS = new Set<string>([
  'avatar-decorator',
  'base64-tool',
  'caption-generator',
  'case-converter',
  'color-picker',
  'copy-cleaner',
  'countdown',
  'danmaku',
  'decision-wheel',
  'emoji-mixer',
  'fortune-sticks',
  'grid-cutter',
  'image-compressor',
  'image-to-base64',
  'json-formatter',
  'keyword-spinoff-generator',
  'markdown-platform-adapter',
  'markdown-preview',
  'mortgage-calculator',
  'password-generator',
  'pdf-merger',
  'pinyin-annotator',
  'qr-code-generator',
  'random-number',
  'regex-tester',
  'script-splitter',
  'sentiment-analyzer',
  'text-counter',
  'text-tools',
  'text-to-speech',
  'timestamp-converter',
  'title-weight-checker',
  'url-encode-decode',
  'uuid-generator',
  'vertical-chinese-generator',
  'wallpaper-maker',
]);

export const SLUG_ALIAS: Record<string, string> = {
  'base64-encoder': 'base64-tool',
  'base64-decoder': 'base64-tool',
  'base64': 'base64-tool',
  'url-encoder': 'url-encode-decode',
  'url-decoder': 'url-encode-decode',
  'urlencode': 'url-encode-decode',
  'regex101': 'regex-tester',
  'regex': 'regex-tester',
  'pomodoro-timer': 'countdown',
  'pomodoro': 'countdown',
  'tomato-timer': 'countdown',
  'focus-timer': 'countdown',
  'image-compress': 'image-compressor',
  'compress-image': 'image-compressor',
  'pdf-merge': 'pdf-merger',
  'merge-pdf': 'pdf-merger',
  'json': 'json-formatter',
  'json-formatter-online': 'json-formatter',
  'qr-code': 'qr-code-generator',
  'qrcode': 'qr-code-generator',
  'password': 'password-generator',
  'random-password': 'password-generator',
  'uuid': 'uuid-generator',
  'uuid-generate': 'uuid-generator',
  'pinyin': 'pinyin-annotator',
  'pinyin-annotation': 'pinyin-annotator',
  'zhuyin': 'pinyin-annotator',
  'random': 'random-number',
  'rng': 'random-number',
  'timestamp': 'timestamp-converter',
  'unix-timestamp': 'timestamp-converter',
  'time-converter': 'timestamp-converter',
  'emoji': 'emoji-mixer',
  'emoji-mix': 'emoji-mixer',
  'color': 'color-picker',
  'color-palette': 'color-picker',
  'case': 'case-converter',
  'case-convert': 'case-converter',
  'counter': 'text-counter',
  'char-counter': 'text-counter',
  'word-counter': 'text-counter',
  'markdown': 'markdown-preview',
  'md-preview': 'markdown-preview',
  'tts': 'text-to-speech',
  'text2speech': 'text-to-speech',
  'sentiment': 'sentiment-analyzer',
  'sentiment-analysis': 'sentiment-analyzer',
  'caption': 'caption-generator',
  'subtitle': 'caption-generator',
  'avatar': 'avatar-decorator',
  'pfp': 'avatar-decorator',
  'image-grid': 'grid-cutter',
  'grid-split': 'grid-cutter',
  'wallpaper': 'wallpaper-maker',
  'bg-maker': 'wallpaper-maker',
  'script-split': 'script-splitter',
  'copy': 'copy-cleaner',
  'formatting-cleaner': 'copy-cleaner',
  'title-check': 'title-weight-checker',
  'headline-checker': 'title-weight-checker',
  'keyword': 'keyword-spinoff-generator',
  'seo-keyword': 'keyword-spinoff-generator',
  'markdown-adapter': 'markdown-platform-adapter',
  'md-converter': 'markdown-platform-adapter',
  'vertical-text': 'vertical-chinese-generator',
  'vertical-chinese': 'vertical-chinese-generator',
  'mortgage': 'mortgage-calculator',
  'loan-calculator': 'mortgage-calculator',
  'image2base64': 'image-to-base64',
  'img-base64': 'image-to-base64',
  'fortune': 'fortune-sticks',
  'chinese-fortune': 'fortune-sticks',
  'lucky': 'fortune-sticks',
  'decision': 'decision-wheel',
  'picker-wheel': 'decision-wheel',
  'random-decision': 'decision-wheel',
  'danmaku-maker': 'danmaku',
  'bullet-screen': 'danmaku',
  'countdown-timer': 'countdown',
  'deadline': 'countdown',
};

export const EXTERNAL_TOOL_URLS: Record<string, string> = {
  'canva': 'https://www.canva.com',
  'coolors': 'https://coolors.co',
  'unsplash': 'https://unsplash.com',
  'flaticon': 'https://www.flaticon.com',
  'tinypng': 'https://tinypng.com',
  'remove-bg': 'https://www.remove.bg',
  'photopea': 'https://www.photopea.com',
  'image-format-converter': 'https://cloudconvert.com/image-converter',
  'ilovepdf': 'https://www.ilovepdf.com',
  'smallpdf': 'https://smallpdf.com',
  'deepl': 'https://www.deepl.com/translator',
  'codecademy': 'https://www.codecademy.com',
  'copy-ai': 'https://www.copy.ai',
  'buffer': 'https://buffer.com',
  'wikipedia': 'https://www.wikipedia.org',
  'runway': 'https://runwayml.com',
  'runwayml': 'https://runwayml.com',
  'capcut': 'https://www.capcut.com',
  'jianying': 'https://www.capcut.com',
  'remove-music': 'https://www.lalal.ai',
  'lalal': 'https://www.lalal.ai',
  'vocal-remover': 'https://www.lalal.ai',
  'elevenlabs': 'https://elevenlabs.io',
  'eleven-labs': 'https://elevenlabs.io',
  'notion': 'https://www.notion.so',
  'trello': 'https://trello.com',
  'google-docs': 'https://docs.google.com',
  'googledocs': 'https://docs.google.com',
  'grammarly': 'https://www.grammarly.com',
  'dribbble': 'https://dribbble.com',
  'figma': 'https://www.figma.com',
  'shopify': 'https://www.shopify.com',
  'chatgpt': 'https://chat.openai.com',
  'openai': 'https://chat.openai.com',
  'gpt': 'https://chat.openai.com',
  'fiverr': 'https://www.fiverr.com',
  'tiktok': 'https://www.tiktok.com',
  'douyin': 'https://www.tiktok.com',
  'midjourney': 'https://www.midjourney.com',
  'mj': 'https://www.midjourney.com',
  'vercel': 'https://vercel.com',
  'slack': 'https://slack.com',
  'github': 'https://github.com',
  'chatpdf': 'https://www.chatpdf.com',
  'notion-ai': 'https://www.notion.so/product/ai',
  'feishu': 'https://www.feishu.cn',
  'lark': 'https://www.larksuite.com',
  'wechat': 'https://weixin.qq.com',
  'weixin': 'https://weixin.qq.com',
  'dingtalk': 'https://www.dingtalk.com',
  'cross-border-finance': 'https://www.xero.com',
  'cross-border-listing': 'https://www.shopify.com',
  'fiverr-proposal': 'https://www.fiverr.com',
  'product-image-ai': 'https://www.remove.bg',
  'video-pipeline': 'https://www.capcut.com',
  'multilingual-cs': 'https://www.deepl.com/translator',
};

const EXTERNAL_DISPLAY_NAMES: Record<string, string> = {
  'canva': 'Canva',
  'coolors': 'Coolors',
  'unsplash': 'Unsplash',
  'flaticon': 'Flaticon',
  'tinypng': 'TinyPNG',
  'remove-bg': 'Remove.bg',
  'photopea': 'Photopea',
  'image-format-converter': 'CloudConvert',
  'ilovepdf': 'iLovePDF',
  'smallpdf': 'Smallpdf',
  'deepl': 'DeepL',
  'codecademy': 'Codecademy',
  'copy-ai': 'Copy.ai',
  'buffer': 'Buffer',
  'wikipedia': 'Wikipedia',
  'runway': 'Runway',
  'runwayml': 'Runway',
  'capcut': 'CapCut',
  'jianying': 'CapCut',
  'remove-music': 'Lalal.ai',
  'lalal': 'Lalal.ai',
  'vocal-remover': 'Lalal.ai',
  'elevenlabs': 'ElevenLabs',
  'eleven-labs': 'ElevenLabs',
  'notion': 'Notion',
  'trello': 'Trello',
  'google-docs': 'Google Docs',
  'googledocs': 'Google Docs',
  'grammarly': 'Grammarly',
  'dribbble': 'Dribbble',
  'figma': 'Figma',
  'shopify': 'Shopify',
  'chatgpt': 'ChatGPT',
  'openai': 'OpenAI',
  'gpt': 'ChatGPT',
  'fiverr': 'Fiverr',
  'tiktok': 'TikTok',
  'douyin': 'TikTok',
  'midjourney': 'Midjourney',
  'mj': 'Midjourney',
  'vercel': 'Vercel',
  'slack': 'Slack',
  'github': 'GitHub',
  'chatpdf': 'ChatPDF',
  'notion-ai': 'Notion AI',
  'feishu': '飞书',
  'lark': 'Lark',
  'wechat': '微信',
  'weixin': '微信',
  'dingtalk': '钉钉',
};

export function resolveToolLink(slug: string | undefined | null, locale: string = 'zh'): ResolvedToolLink {
  if (!slug) {
    return { type: 'fallback', url: `/${locale}` };
  }
  const raw = String(slug).trim().toLowerCase();
  if (!raw) {
    return { type: 'fallback', url: `/${locale}` };
  }

  const aliased = SLUG_ALIAS[raw];
  const candidate = aliased || raw;

  if (INTERNAL_TOOL_SLUGS.has(candidate)) {
    return {
      type: 'internal',
      url: `/${locale}/tool/${candidate}`,
      realSlug: candidate,
    };
  }

  const extUrl = EXTERNAL_TOOL_URLS[raw] || (aliased ? EXTERNAL_TOOL_URLS[aliased] : undefined);
  if (extUrl) {
    return {
      type: 'external',
      url: extUrl,
      displayName: EXTERNAL_DISPLAY_NAMES[raw] || (aliased ? EXTERNAL_DISPLAY_NAMES[aliased] : undefined) || raw.toUpperCase(),
    };
  }

  return {
    type: 'fallback',
    url: `/${locale}`,
  };
}

export function getToolDisplayLabel(slug: string | undefined | null): string | null {
  if (!slug) return null;
  const raw = String(slug).trim().toLowerCase();
  return EXTERNAL_DISPLAY_NAMES[raw] || null;
}

export function isInternalTool(slug: string | undefined | null): boolean {
  if (!slug) return false;
  const raw = String(slug).trim().toLowerCase();
  const aliased = SLUG_ALIAS[raw] || raw;
  return INTERNAL_TOOL_SLUGS.has(aliased);
}

export function isExternalTool(slug: string | undefined | null): boolean {
  if (!slug) return false;
  const raw = String(slug).trim().toLowerCase();
  const direct = !!EXTERNAL_TOOL_URLS[raw];
  const aliased = !!SLUG_ALIAS[raw] && !!EXTERNAL_TOOL_URLS[SLUG_ALIAS[raw]];
  return direct || aliased;
}
