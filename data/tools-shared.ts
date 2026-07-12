export type Difficulty = 'easy' | 'medium' | 'advanced';
export type ComplianceLevel = 'green' | 'yellow' | 'red';
export type Platform = 'desktop' | 'mobile' | 'all';
export type AccessTag = 'direct' | 'vpn-required';
export type PaymentMethod = 'alipay' | 'wechat' | 'visa' | 'mastercard';
export type SignupType = 'no-signup' | 'email' | 'cn-phone' | 'global-phone' | 'cc-required' | 'wechat' | 'phone';

export interface ToolIndexItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nameEn?: string;
  descriptionEn?: string;
  tagsEn?: string[];
  isFree: boolean;
  isLimitedFree?: boolean;
  icon: string;
  externalUrl?: string;
  likes?: number;
  difficulty?: Difficulty;
  complianceLevel?: ComplianceLevel;
  platform?: Platform;
  accessTag?: AccessTag;
  localProcessing?: boolean;
}

export interface ToolDetailItem {
  relatedTools: string[];
  payment?: PaymentMethod[];
  signup?: SignupType[];
}

/** 完整 Tool 类型（= 薄索引 + 详情，兼容原先 Tool 接口 100%） */
export interface Tool extends ToolIndexItem, ToolDetailItem {}

/* ---------------- 合规等级计算（原 computeComplianceLevel ） ---------------- */
const verifiedDomains = [
  'baidu.com', 'bilibili.com', 'douyin.com', 'ele.me', 'alipay.com', 'taobao.com', 'tmall.com',
  'jd.com', 'meituan.com', 'ctrip.com', 'xiaohongshu.com', 'weibo.com', 'zhihu.com', 'qq.com',
  '163.com', 'sogou.com', 'so.com', '360.cn', 'weixin.qq.com', 'weixin.com', 'wechat.com',
  'xiaomi.com', 'huawei.com', 'oppo.com', 'vivo.com', 'lenovo.com', 'dell.com.cn', 'hp.com.cn',
  'sony.com.cn', 'samsung.com.cn', 'apple.com.cn', 'microsoft.com.cn', 'google.cn', 'bing.com',
  'github.com', 'github.io', 'gitlab.com', 'npmjs.com', 'nodejs.org', 'python.org', 'php.net',
  'react.dev', 'vuejs.org', 'nextjs.org', 'tailwindcss.com', 'developer.aliyun.com',
  'cloud.tencent.com', 'segmentfault.com', 'gitee.com', 'csdn.net', 'cnblogs.com',
  'zh.wikipedia.org', 'wikipedia.org', 'stackoverflow.com', 'stackexchange.com',
  'www.autohome.com.cn', 'www.dongchedi.com', 'www.chinaunicom.com.cn', 'www.chinamobile.com',
  'www.cctv.com', 'www.xinhuanet.com', 'www.people.com.cn', 'www.sina.com.cn', 'www.sohu.com',
  'www.douban.com', 'www.dianping.com', 'www.juejin.cn', 'www.iqiyi.com', 'www.youku.com',
];

const blockedKeywords = ['crack', 'pirate', '破解', '盗版', '激活', '注册机', 'keygen', 'serial', 'hack', '入侵', '攻击', '病毒', '恶意', '色情', '成人', '赌博', '博彩', '毒品', '违法'];

export function computeComplianceLevel(tool: Pick<Tool, 'complianceLevel' | 'externalUrl' | 'name'>): ComplianceLevel {
  if (tool.complianceLevel) return tool.complianceLevel;
  if (!tool.externalUrl) return 'green';
  const lowerName = tool.name.toLowerCase();
  for (const keyword of blockedKeywords) {
    if (lowerName.includes(keyword.toLowerCase())) return 'red';
  }
  try {
    const parsed = new URL(tool.externalUrl);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname.endsWith('.cn') || hostname.includes('.cn.')) return 'green';
    for (const domain of verifiedDomains) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) return 'green';
    }
    return 'yellow';
  } catch {
    return 'yellow';
  }
}
