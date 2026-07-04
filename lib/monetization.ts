export type KofiTierId = 'monthly' | 'one_time' | 'commercial';

export interface KofiTier {
  id: KofiTierId;
  label: string;
  price: string;
  /** 比如 '/ mo' 或空字符串，和 price 拼接显示即可，避免组件内重复 */
  suffix?: string;
  tagline: string;
  /** Ko-fi 链接会拼上 tier 参数，用户注册完后直接把 base URL 填好就能跳转 */
  utm: string;
}

export interface ToolUnlockSpec {
  freeTitle: string;
  freeItems: string[];
  unlockTitle: string;
  unlockItems: string[];
}

/**
 * 把 "your-kofi-handle" 替换成你注册 Ko-fi 后的用户名即可，
 * 比如 https://ko-fi.com/korelyy 就填 "korelyy"。
 * 不用改代码，改这里一行就全站生效。
 */
export const KOFI_HANDLE = 'korelyy';
export const KOFI_BASE_URL = `https://ko-fi.com/${KOFI_HANDLE}`;

export const KOFI_TIERS: KofiTier[] = [
  {
    id: 'monthly',
    label: 'Monthly Pro',
    price: '$3',
    suffix: '/ mo',
    tagline: 'Cancel anytime, unlock + ad-free for 30 days',
    utm: 'monthly3',
  },
  {
    id: 'one_time',
    label: 'Lifetime Pass',
    price: '$9',
    suffix: '',
    tagline: 'Pay once, unlock all premium tools forever',
    utm: 'onetime9',
  },
  {
    id: 'commercial',
    label: 'Team / Commercial',
    price: '$19',
    suffix: '',
    tagline: 'Team use + API access + priority support',
    utm: 'commercial19',
  },
];

/**
 * 只在这 5 个高频工具上显示 Ko-fi 解锁 Banner，
 * 其他工具保持纯免费、无打扰、专注 SEO。
 */
export const HIGH_FREQUENCY_TOOL_SLUGS = new Set([
  'regex-tester',
  'json-formatter',
  'qr-code-generator',
  'password-generator',
  'base64-tool',
] as const);

export type HighFreqSlug = (typeof HIGH_FREQUENCY_TOOL_SLUGS extends Set<infer T> ? T : never);

/**
 * 每个高频工具的「免费 vs 解锁」差异化文案。
 * 先写英文（全球默认）+ 中文两块，工具页内会根据 locale 自动切。
 * 其余 4 种语言（hi/es/fr/ar）暂时 fallback 到英文，
 * 等真实有用户付费后再补翻译，不浪费工作量。
 */
export const TOOL_UNLOCK_FEATURES: Record<string, { en: ToolUnlockSpec; zh: ToolUnlockSpec }> = {
  'regex-tester': {
    en: {
      freeTitle: 'Free (always)',
      freeItems: [
        'Single-line regex test',
        'Up to 10 match groups',
        'Common flavor presets',
      ],
      unlockTitle: 'Unlocked',
      unlockItems: [
        'Multiline / file paste (up to 10MB text)',
        '100+ regex template library (email/url/phone/ipv6...)',
        'Replace + download result as txt',
        'Save private history in browser',
        'Ad-free interface',
      ],
    },
    zh: {
      freeTitle: '免费版（持续可用）',
      freeItems: ['单行正则测试', '最多 10 个捕获组', '常用正则引擎预设'],
      unlockTitle: '解锁后获得',
      unlockItems: [
        '多行 / 文件粘贴（最大 10MB 文本）',
        '100+ 正则模板库（邮箱/URL/手机号/IPv6 等）',
        '替换结果一键下载为 txt',
        '浏览器内私密历史记录',
        '完全无广告界面',
      ],
    },
  },
  'json-formatter': {
    en: {
      freeTitle: 'Free (always)',
      freeItems: [
        'Up to 500KB JSON',
        'Format / minify / validate',
        '2-level tree view',
      ],
      unlockTitle: 'Unlocked',
      unlockItems: [
        'Up to 50MB large JSON files',
        'Full-depth tree + search + path copy',
        'JSON ↔ YAML / CSV / XML batch convert',
        'Diff mode: compare two JSONs',
        'Ad-free interface',
      ],
    },
    zh: {
      freeTitle: '免费版（持续可用）',
      freeItems: ['≤ 500KB JSON', '格式化 / 压缩 / 校验', '2 层树形视图'],
      unlockTitle: '解锁后获得',
      unlockItems: [
        '最大 50MB 超大 JSON 文件',
        '深度完整树 + 搜索 + 路径复制',
        'JSON ↔ YAML / CSV / XML 批量互转',
        'Diff 模式：两份 JSON 对比',
        '完全无广告界面',
      ],
    },
  },
  'qr-code-generator': {
    en: {
      freeTitle: 'Free (always)',
      freeItems: [
        'Basic QR code (text / url / wifi)',
        'Up to 500×500 px PNG',
        '4 error correction levels',
      ],
      unlockTitle: 'Unlocked',
      unlockItems: [
        'Batch QR generation from CSV (1000+)',
        'Logo embed + 16 gradient styles',
        'Vector SVG / PDF / EPS export',
        'WiFi / vCard / email templates',
        'Ad-free interface',
      ],
    },
    zh: {
      freeTitle: '免费版（持续可用）',
      freeItems: ['基础二维码（文本/URL/WiFi）', '最多 500×500 像素 PNG', '4 档纠错级别'],
      unlockTitle: '解锁后获得',
      unlockItems: [
        'CSV 批量生成二维码（1000+ 个）',
        '嵌入 Logo + 16 种渐变样式',
        '矢量 SVG / PDF / EPS 导出',
        'WiFi / vCard / 邮件模板',
        '完全无广告界面',
      ],
    },
  },
  'password-generator': {
    en: {
      freeTitle: 'Free (always)',
      freeItems: [
        'Up to 64 chars',
        '5 character sets',
        'Single-click copy',
      ],
      unlockTitle: 'Unlocked',
      unlockItems: [
        'Up to 512 chars + pronounceable mode',
        'Batch generate 1000 passwords + CSV export',
        'Entropy bar + strength audit',
        'Passphrase (diceware) generator',
        'Ad-free interface',
      ],
    },
    zh: {
      freeTitle: '免费版（持续可用）',
      freeItems: ['最多 64 位', '5 种字符类型', '一键复制'],
      unlockTitle: '解锁后获得',
      unlockItems: [
        '最长 512 位 + 易读密码模式',
        '批量生成 1000 条 + CSV 导出',
        '熵值条 + 强度审计',
        '易记密码短语（diceware）生成',
        '完全无广告界面',
      ],
    },
  },
  'base64-tool': {
    en: {
      freeTitle: 'Free (always)',
      freeItems: [
        'Text ↔ Base64',
        'Up to 2MB per encode',
        'URL-safe toggle',
      ],
      unlockTitle: 'Unlocked',
      unlockItems: [
        'File encode / decode (any file, up to 200MB)',
        'Image ↔ Base64 inline preview',
        'Batch file list process + zip download',
        'Data URL builder for CSS / HTML',
        'Ad-free interface',
      ],
    },
    zh: {
      freeTitle: '免费版（持续可用）',
      freeItems: ['文本 ↔ Base64 互转', '单次最大 2MB', 'URL-safe 开关'],
      unlockTitle: '解锁后获得',
      unlockItems: [
        '任意文件编解码（单文件最大 200MB）',
        '图片 ↔ Base64 内嵌实时预览',
        '批量文件处理 + zip 打包下载',
        '生成 CSS / HTML 用 Data URL',
        '完全无广告界面',
      ],
    },
  },
};

export function buildKofiUrl(tierId: KofiTierId, slug: string, locale: string): string {
  const tier = KOFI_TIERS.find((t) => t.id === tierId) ?? KOFI_TIERS[0];
  const utm = new URLSearchParams({
    utm_source: 'korelyy_tools',
    utm_medium: 'tool_banner',
    utm_campaign: tier.utm,
    utm_term: slug,
    utm_content: locale,
  });
  return `${KOFI_BASE_URL}?${utm.toString()}`;
}

export function getToolUnlockSpec(slug: string, locale: string): ToolUnlockSpec | null {
  const bySlug = TOOL_UNLOCK_FEATURES[slug];
  if (!bySlug) return null;
  return bySlug[locale as 'en' | 'zh'] ?? bySlug.en;
}

export function shouldShowKofiBanner(slug: string): boolean {
  return HIGH_FREQUENCY_TOOL_SLUGS.has(slug as HighFreqSlug);
}
