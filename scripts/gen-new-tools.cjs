const fs = require('fs');
const path = require('path');

const newTools = [
  // ========== 🎬 视频制作类 (25个) ==========
  {
    id: 'canva-video', slug: 'canva-video', name: 'Canva视频编辑器',
    description: '零基础短视频制作神器，10000+视频模板一键套用，支持多比例横竖屏切换，剪字幕、加转场、换背景音乐手机端全搞定。',
    category: 'video-editing', tags: ['视频剪辑', '短视频', '模板', 'Canva', '横竖屏', '字幕'],
    isFree: true, isLimitedFree: true, icon: 'Video', relatedTools: [],
    externalUrl: 'https://www.canva.com/zh_cn/',
    likes: 15234, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['email'],
  },
  {
    id: 'capcut-web', slug: 'capcut-web', name: '剪映专业版网页',
    description: '字节跳动官方在线视频剪辑平台，和剪映APP素材全同步，智能字幕、一键成片、曲线变速、调色预设齐，电脑+手机浏览器直接剪。',
    category: 'video-editing', tags: ['剪映', 'CapCut', '在线剪辑', '字幕', '短视频', '抖音'],
    isFree: true, icon: 'Clapperboard', relatedTools: [],
    externalUrl: 'https://www.capcut.cn/',
    likes: 21876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['email'],
  },
  {
    id: 'descript-video', slug: 'descript-video', name: 'Descript AI视频剪辑',
    description: '文字改稿式剪辑视频，自动生成逐字稿字幕，删除文字就是剪掉画面，AI虚拟人配音+播客+录屏三合一，自由职业内容生产提效3倍。',
    category: 'video-editing', tags: ['AI剪辑', '文字剪辑', '自动字幕', '录屏', 'Podcast', 'Descript'],
    isFree: false, isLimitedFree: true, icon: 'FileEdit', relatedTools: [],
    externalUrl: 'https://www.descript.com/',
    likes: 9421, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'veed-io', slug: 'veed-io', name: 'Veed在线视频工作室',
    description: '浏览器端一站式视频工具，录屏、裁剪、自动字幕、背景移除、绿幕抠像、加水印、压缩、格式转换全齐，自媒体人日更神器。',
    category: 'video-editing', tags: ['在线剪辑', '自动字幕', '录屏', '压缩', '绿幕', 'Veed'],
    isFree: false, isLimitedFree: true, icon: 'Scissors', relatedTools: [],
    externalUrl: 'https://www.veed.io/',
    likes: 11345, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'kapwing-tools', slug: 'kapwing-tools', name: 'Kapwing多媒体工具箱',
    description: 'Meme图、短视频、GIF一站式制作，视频加文字、加字幕、拼接、裁剪、转GIF，微信公众号/小红书封面模板齐全，无需登录即可使用。',
    category: 'media-tools', tags: ['GIF', 'Meme', '封面', '字幕', '视频裁剪', 'Kapwing'],
    isFree: true, isLimitedFree: true, icon: 'Layers', relatedTools: [],
    externalUrl: 'https://www.kapwing.com/',
    likes: 8765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'wistia-hosting', slug: 'wistia-hosting', name: 'Wistia商业视频托管',
    description: '企业级营销视频托管平台，高清无广告播放、访客观看热力图、收集邮箱线索、自定义播放器品牌，创业公司官网视频首选。',
    category: 'media-tools', tags: ['视频托管', '营销', '线索收集', '品牌', '播放器', 'Wistia'],
    isFree: false, isLimitedFree: true, icon: 'TrendingUp', relatedTools: [],
    externalUrl: 'https://wistia.com/',
    likes: 4231, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'vidyard-messages', slug: 'vidyard-messages', name: 'Vidyard视频消息',
    description: '自由职业者远程沟通神器，一键录制屏幕+摄像头视频消息，带客户观看追踪，比打字高效10倍，客户问题秒懂。',
    category: 'collaboration', tags: ['视频消息', '远程沟通', '录屏', '销售', '自由职业', '追踪'],
    isFree: true, isLimitedFree: true, icon: 'MessageSquareVideo', relatedTools: [],
    externalUrl: 'https://www.vidyard.com/',
    likes: 5678, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'loom-recorder', slug: 'loom-recorder', name: 'Loom异步录屏分享',
    description: '远程协作录屏TOP1，屏幕+人脸+语音同步录制，自动生成链接，客户点击即看，支持评论打点，远程团队和Upwork接单标配。',
    category: 'productivity', tags: ['录屏', '异步沟通', '远程工作', '分享链接', 'Loom', '协作'],
    isFree: true, isLimitedFree: true, icon: 'MonitorPlay', relatedTools: [],
    externalUrl: 'https://www.loom.com/',
    likes: 18932, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'screencastify-chrome', slug: 'screencastify-chrome', name: 'Screencastify教程录屏',
    description: 'Chrome插件录屏，免费版每集30分钟，支持摄像头叠加、画笔标注、一键导出MP4或Google Drive，教师/培训师录课首选。',
    category: 'education', tags: ['录屏', 'Chrome', '教程', '标注', '在线教育', 'Google Drive'],
    isFree: true, isLimitedFree: true, icon: 'PlayCircle', relatedTools: [],
    externalUrl: 'https://www.screencastify.com/',
    likes: 7342, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'streamyard-live', slug: 'streamyard-live', name: 'StreamYard多平台直播',
    description: '浏览器直播推流，无需OBS，一键同时推流抖音、视频号、B站、YouTube、Facebook、LinkedIn 6+平台，加Logo、跑马灯、邀请嘉宾连麦。',
    category: 'video-editing', tags: ['直播', '推流', '多平台', '嘉宾连麦', '创业', 'StreamYard'],
    isFree: false, isLimitedFree: true, icon: 'Radio', relatedTools: [],
    externalUrl: 'https://streamyard.com/',
    likes: 8213, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'restream-io', slug: 'restream-io', name: 'Restream直播多推',
    description: '全球直播分发领航者，一次推流到30+社交平台（B站/视频号/YouTube/Twitch/X），带视频存储回放、直播间聊天聚合，个人IP直播带货标配。',
    category: 'media-tools', tags: ['直播', '多平台推流', '回放', '聊天聚合', 'IP', 'Restream'],
    isFree: false, isLimitedFree: true, icon: 'Share2', relatedTools: [],
    externalUrl: 'https://restream.io/',
    likes: 6789, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'runway-gen', slug: 'runway-gen', name: 'Runway AI视频工具',
    description: '专业级AI视频创作工具套件，文字生成场景、图片转动效、绿幕一键抠图、老视频修复超分，影视后期和独立动画师的生产力倍增器。',
    category: 'ai-tools', tags: ['AI视频', '绿幕', '抠图', '超分辨率', '动画', 'Runway'],
    isFree: false, isLimitedFree: true, icon: 'Sparkles', relatedTools: [],
    externalUrl: 'https://runwayml.com/',
    likes: 12876, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'pika-labs', slug: 'pika-labs', name: 'Pika AI视频生成',
    description: '文字/图片转高清动画视频，支持动漫、3D、写实、赛博朋克等多种风格，自媒体片头、电商产品演示创意快速出样。',
    category: 'ai-tools', tags: ['AI视频生成', '文生视频', '图生视频', '动画', '创意', 'Pika'],
    isFree: true, isLimitedFree: true, icon: 'Film', relatedTools: [],
    externalUrl: 'https://pika.art/',
    likes: 16543, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'submagic-auto', slug: 'submagic-auto', name: 'Submagic AI字幕生成',
    description: 'AI自动识别语音生成短视频字幕，支持彩色高亮、Emoji点缀、双语对照，40+语言一键导出SRT，TikTok和YouTube Shorts涨粉标配。',
    category: 'video-editing', tags: ['自动字幕', '短视频', '双语字幕', 'SRT', '高亮字幕', 'Submagic'],
    isFree: false, isLimitedFree: true, icon: 'Captions', relatedTools: [],
    externalUrl: 'https://www.submagic.co/',
    likes: 5432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'opus-clip', slug: 'opus-clip', name: 'Opus长视频切短视频',
    description: 'AI一键把长播客/访谈/直播切出10条高光短视频，自动生成爆款Hook开头、加Virality评分、配字幕和B-ROLL，内容工作室省80%剪辑时间。',
    category: 'ai-tools', tags: ['AI剪辑', '高光片段', '短视频', 'Virality', '播客', 'Opus'],
    isFree: false, isLimitedFree: true, icon: 'ScissorsLineDashed', relatedTools: [],
    externalUrl: 'https://www.opus.pro/',
    likes: 9876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'repurpose-io', slug: 'repurpose-io', name: 'Repurpose内容二次分发',
    description: '内容一鱼多吃自动化：YouTube自动转成音频发播客、切短视频发TikTok/Shorts，博客转LinkedIn图文，个人IP内容分发效率提10倍。',
    category: 'marketing', tags: ['内容分发', '自动化', '多平台', '一鱼多吃', 'IP', 'Repurpose'],
    isFree: false, isLimitedFree: true, icon: 'RefreshCw', relatedTools: [],
    externalUrl: 'https://repurpose.io/',
    likes: 4321, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'riverside-fm', slug: 'riverside-fm', name: 'Riverside高清远程采访',
    description: '远程视频/播客采访录制天花板，嘉宾无需下载软件，本地4K音视频逐帧存储，直播推流+自动转文字稿+多轨道素材一键导出。',
    category: 'media-tools', tags: ['采访录制', '高清', '播客', '远程嘉宾', '多轨', 'Riverside'],
    isFree: false, isLimitedFree: true, icon: 'Mic2', relatedTools: [],
    externalUrl: 'https://riverside.fm/',
    likes: 7654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'streamlabs-obs', slug: 'streamlabs-obs', name: 'Streamlabs直播助手',
    description: '直播一键美化助手，Overlays打赏特效模板、聊天机器人、观众互动游戏、提醒弹窗，新人主播快速打造精致直播间。',
    category: 'media-tools', tags: ['直播', 'Overlays', '打赏特效', '聊天机器人', '主播', 'Streamlabs'],
    isFree: true, isLimitedFree: true, icon: 'Gift', relatedTools: [],
    externalUrl: 'https://streamlabs.com/',
    likes: 13210, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'motion-array', slug: 'motion-array', name: 'Motion Array视频素材库',
    description: '一站式视频素材全库，PR/AE/FCPX模板、LUT调色预设、转场插件、配乐音效、8K无版权视频素材，按月订阅无限商用下载。',
    category: 'design-tools', tags: ['PR模板', 'AE模板', 'LUT', '配乐', '音效', '商用素材'],
    isFree: false, isLimitedFree: true, icon: 'Package', relatedTools: [],
    externalUrl: 'https://motionarray.com/',
    likes: 10432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'artlist-io', slug: 'artlist-io', name: 'Artlist无版权音乐',
    description: '全球创作者公认的商用音乐授权平台，订阅期内全平台无版权风险，YouTuber/Freelancer/广告公司长期授权首选，无索赔纠纷。',
    category: 'audio-tools', tags: ['商用音乐', '无版权', '配乐', 'YouTuber', '授权', 'Artlist'],
    isFree: false, isLimitedFree: true, icon: 'Music2', relatedTools: [],
    externalUrl: 'https://artlist.io/',
    likes: 8321, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'epidemic-sound', slug: 'epidemic-sound', name: 'Epidemic Sound音效库',
    description: '40万首+高品质正版音乐+10万+音效，订阅全包，可用于YouTube/抖音/广告片/游戏，自动匹配音乐时长，版权索赔100%兜底。',
    category: 'audio-tools', tags: ['正版音乐', '音效', '商用授权', '索赔兜底', '匹配时长', 'Epidemic'],
    isFree: false, isLimitedFree: true, icon: 'Headphones', relatedTools: [],
    externalUrl: 'https://www.epidemicsound.com/',
    likes: 9123, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'storyblocks-vid', slug: 'storyblocks-vid', name: 'Storyblocks素材平台',
    description: '视频+音频+图片三合一订阅，100万+HD/4K无版权视频、AE/PR模板、80万+照片矢量，Freelancer接外包降低素材成本。',
    category: 'design-tools', tags: ['素材', '4K视频', '图片', '矢量', '订阅制', 'Storyblocks'],
    isFree: false, isLimitedFree: true, icon: 'ImagePlus', relatedTools: [],
    externalUrl: 'https://www.storyblocks.com/',
    likes: 7432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'pixabay-video', slug: 'pixabay-video', name: 'Pixabay免费视频素材',
    description: '全球最大CC0免费视频站，数百万条HD/4K无版权视频+照片+音乐+矢量插画，无需署名商用全免费，创业初期零成本素材首选。',
    category: 'design-tools', tags: ['CC0', '免费视频', '无版权', '4K', '零成本', 'Pixabay'],
    isFree: true, icon: 'Film', relatedTools: [],
    externalUrl: 'https://pixabay.com/videos/',
    likes: 19876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'pexels-videos', slug: 'pexels-videos', name: 'Pexels免费视频图片',
    description: '高质量免费无版权视频与图片聚合平台，Pexels视频精选全球创作者投稿，画面质感高、分类清晰，免费商用无需授权。',
    category: 'design-tools', tags: ['无版权', '免费图片', '4K视频', '高质量', '商用', 'Pexels'],
    isFree: true, icon: 'Camera', relatedTools: [],
    externalUrl: 'https://www.pexels.com/videos/',
    likes: 18543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'unsplash-images', slug: 'unsplash-images', name: 'Unsplash高清图库',
    description: '设计师必备的免费高清图片站，全球摄影师社区投稿，风景、科技、商业、人物高清大图全免费商用，API可直接接入产品。',
    category: 'design-tools', tags: ['高清图片', '免费图库', '商用', '摄影', 'API', 'Unsplash'],
    isFree: true, icon: 'Image', relatedTools: [],
    externalUrl: 'https://unsplash.com/',
    likes: 25432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },

  // ========== 💼 个人创业类 (25个) ==========
  {
    id: 'canva-design', slug: 'canva-design', name: 'Canva全场景设计',
    description: '创业团队设计0门槛，LOGO、海报、名片、PPT、菜单、H5邀请函、优惠券、易拉宝100万+模板，拖拽式修改，小白秒出图。',
    category: 'design-tools', tags: ['LOGO', '海报', '名片', 'PPT', '模板', 'Canva'],
    isFree: true, isLimitedFree: true, icon: 'Palette', relatedTools: [],
    externalUrl: 'https://www.canva.cn/',
    likes: 32145, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'figma-design', slug: 'figma-design', name: 'Figma产品设计协作',
    description: '全球TOP产品UI/UX设计工具，浏览器原生多人协作，组件库、原型交互动效、DevMode切图一键给开发，SaaS创业和独立开发者标配。',
    category: 'dev-tools', tags: ['UI', 'UX', '原型', '协作', '组件库', 'Figma'],
    isFree: true, isLimitedFree: true, icon: 'Figma', relatedTools: [],
    externalUrl: 'https://www.figma.com/',
    likes: 28765, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'feishu-docs', slug: 'feishu-docs', name: '飞书文档协作',
    description: '字节跳动出品的企业协作套件，文档+表格+多维表格+日历+会议+OKR一体化，创业公司50人以下基础版全免费，替代Office全家桶。',
    category: 'collaboration', tags: ['文档', '协作', 'OKR', '多维表格', '会议', '飞书'],
    isFree: true, isLimitedFree: true, icon: 'FileText', relatedTools: [],
    externalUrl: 'https://www.feishu.cn/',
    likes: 15432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'tencent-docs', slug: 'tencent-docs', name: '腾讯文档',
    description: '国内用户最多的在线文档表格工具，和微信无缝打通，直接分享给好友无需登录，多人同时编辑实时保存，小微企业轻协作首选。',
    category: 'collaboration', tags: ['文档', '表格', '微信分享', '多人协作', '腾讯', '轻量'],
    isFree: true, isLimitedFree: true, icon: 'FileSpreadsheet', relatedTools: [],
    externalUrl: 'https://docs.qq.com/',
    likes: 21098, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'notion-workspace', slug: 'notion-workspace', name: 'Notion创业知识库',
    description: 'All-in-One工作空间，商业计划书、SOP操作手册、客户CRM、项目看板、产品Roadmap全塞一个Notion里，自由职业者的数字大脑。',
    category: 'productivity', tags: ['知识库', 'SOP', 'CRM', '看板', 'All-in-One', 'Notion'],
    isFree: true, isLimitedFree: true, icon: 'Database', relatedTools: [],
    externalUrl: 'https://www.notion.so/',
    likes: 29876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'xmind-mindmap', slug: 'xmind-mindmap', name: 'XMind思维导图',
    description: '商业计划书逻辑梳理首选思维导图，鱼骨图、组织结构图、甘特图、矩阵图多视图，脑图一键导出PPT/Word/PDF，手机端云同步。',
    category: 'productivity', tags: ['思维导图', '商业计划', '鱼骨图', '甘特图', '逻辑梳理', 'XMind'],
    isFree: true, isLimitedFree: true, icon: 'Network', relatedTools: [],
    externalUrl: 'https://xmind.cn/',
    likes: 17654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'processon-flow', slug: 'processon-flow', name: 'ProcessOn在线流程图',
    description: '国内最好用的在线流程图与思维导图工具，BPMN流程图、ER图、拓扑图、UI原型、思维导图，模板中心80万+精品图，一键共享协作。',
    category: 'dev-tools', tags: ['流程图', 'BPMN', 'ER图', '拓扑', '思维导图', 'ProcessOn'],
    isFree: true, isLimitedFree: true, icon: 'GitBranch', relatedTools: [],
    externalUrl: 'https://www.processon.com/',
    likes: 12345, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['email'],
  },
  {
    id: 'whimsical-wire', slug: 'whimsical-wire', name: 'Whimsical线框图看板',
    description: '产品经理快速出低保真原型+流程图+看板+便签四合一，无需设计感，简洁线条专业规范，独立开发者接私单用它3天出需求文档。',
    category: 'dev-tools', tags: ['线框图', '流程图', '看板', '便签', '需求文档', 'Whimsical'],
    isFree: true, isLimitedFree: true, icon: 'LayoutGrid', relatedTools: [],
    externalUrl: 'https://whimsical.com/',
    likes: 8765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'chuangkit-poster', slug: 'chuangkit-poster', name: '创客贴国内设计',
    description: '专为国内创业者优化的在线设计平台，餐饮菜单、微商海报、地产宣传单、招聘启事、促销横幅本地化模板，自带国内商用字体授权。',
    category: 'design-tools', tags: ['海报', '菜单', '宣传单', '招聘', '商用字体', '创客贴'],
    isFree: true, isLimitedFree: true, icon: 'Brush', relatedTools: [],
    externalUrl: 'https://www.chuangkit.com/',
    likes: 13210, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'markup-hero', slug: 'markup-hero', name: 'Markup Hero截图标注',
    description: '产品经理和自由职业者的截图+长截图+PDF标注神器，箭头、画笔、文字、模糊打码、多图拼接、一键生成链接给客户评论反馈。',
    category: 'productivity', tags: ['截图', '标注', '长截图', 'PDF', '客户反馈', 'Markup'],
    isFree: true, isLimitedFree: true, icon: 'Pencil', relatedTools: [],
    externalUrl: 'https://markuphero.com/',
    likes: 6543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'airtable-db', slug: 'airtable-db', name: 'Airtable低代码数据库',
    description: '像Excel一样用的关系型数据库，客户CRM、项目管理、库存管理、选题日历全部搭积木搞定，支持视图切换、表单收集、自动化。',
    category: 'productivity', tags: ['低代码', '数据库', 'CRM', '表单', '自动化', 'Airtable'],
    isFree: true, isLimitedFree: true, icon: 'Table', relatedTools: [],
    externalUrl: 'https://airtable.com/',
    likes: 21345, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'feishu-bitable', slug: 'feishu-bitable', name: '飞书多维表格',
    description: '国产Airtable平替，看板、甘特图、画册、表单、流程图多视图切换，支持自动化、数据看板、跨表关联，国内网络流畅无阻塞。',
    category: 'productivity', tags: ['多维表格', '看板', '甘特图', '表单', '自动化', '飞书'],
    isFree: true, isLimitedFree: true, icon: 'LayoutList', relatedTools: [],
    externalUrl: 'https://www.feishu.cn/product/base',
    likes: 9876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'tencent-survey', slug: 'tencent-survey', name: '腾讯问卷调研',
    description: '国内市场调研与数据收集首选，30+题型、逻辑跳转、抽奖红包、样本服务，和微信生态打通，朋友圈转发填问卷零门槛。',
    category: 'marketing', tags: ['问卷', '市场调研', '微信', '抽奖红包', '样本', '腾讯问卷'],
    isFree: true, isLimitedFree: true, icon: 'ClipboardList', relatedTools: [],
    externalUrl: 'https://wj.qq.com/',
    likes: 15432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'typeform-form', slug: 'typeform-form', name: 'Typeform优雅表单',
    description: '高颜值交互式表单/问卷/报名页，一题一页的卡片式体验，完成率比传统表单高3倍，海外Freelancer接客户需求收集神器。',
    category: 'marketing', tags: ['表单', '问卷', '报名页', '高颜值', '客户需求', 'Typeform'],
    isFree: true, isLimitedFree: true, icon: 'CheckSquare', relatedTools: [],
    externalUrl: 'https://www.typeform.com/',
    likes: 12876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'jotform-builder', slug: 'jotform-builder', name: 'Jotform万能表单',
    description: '10000+表单模板，预约、报名、支付、电子签名、产品订单、合同审批、HR入职表，拖拽式搭建，支持Stripe/支付宝收款。',
    category: 'collaboration', tags: ['表单', '预约', '支付', '电子签名', '订单', 'Jotform'],
    isFree: true, isLimitedFree: true, icon: 'FileCheck2', relatedTools: [],
    externalUrl: 'https://www.jotform.com/',
    likes: 11234, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'pandadoc-sign', slug: 'pandadoc-sign', name: 'PandaDoc电子合同',
    description: '电子提案、报价单、合同、NDA一站式制作签署，内置合规电子签名，追踪客户打开时间和停留点，外贸B2B签单转化率+40%。',
    category: 'hr-tools', tags: ['电子签名', '合同', '提案', 'NDA', '追踪', '外贸'],
    isFree: false, isLimitedFree: true, icon: 'PenTool', relatedTools: [],
    externalUrl: 'https://www.pandadoc.com/',
    likes: 7654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'fadada-sign', slug: 'fadada-sign', name: '法大大电子签名',
    description: '国内合规电子签名与合同管理平台，国密算法+公证处存证+司法认可，签劳动合同、供应商合同、股东协议全合法有效，API接入方便。',
    category: 'hr-tools', tags: ['电子签名', '国内合规', '公证处存证', '司法认可', '合同', '法大大'],
    isFree: true, isLimitedFree: true, icon: 'FileSignature', relatedTools: [],
    externalUrl: 'https://www.fadada.com/',
    likes: 8765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'shangshangqian', slug: 'shangshangqian', name: '上上签电子签约',
    description: '企业级电子签约SaaS，和国内200+生态打通（钉钉、企业微信、Oracle、SAP），实名认证+区块链存证，单笔合同秒级批量签署。',
    category: 'hr-tools', tags: ['电子签约', '企业级', '区块链存证', '实名认证', '批量签署', '上上签'],
    isFree: false, isLimitedFree: true, icon: 'ScrollText', relatedTools: [],
    externalUrl: 'https://www.bestsign.cn/',
    likes: 5432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'good-acc', slug: 'good-acc', name: '畅捷通好会计',
    description: '用友旗下小微企业在线财务软件，智能取票、自动记账、一键报税、老板经营看板，无需懂会计，个体户+初创公司记外账首选。',
    category: 'finance-tools', tags: ['财务', '记账', '报税', '小微企业', '用友', '个体户'],
    isFree: false, isLimitedFree: true, icon: 'Calculator', relatedTools: [],
    externalUrl: 'https://h.chanjet.com/',
    likes: 6543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'mingpian全能王', slug: 'mingpian-scanner', name: '名片全能王在线',
    description: '拍照一秒识别名片自动入库，CRM客户跟进管理、日程提醒、群发节日祝福，商务BD拓展客户的手机端效率神器，支持微信名片互通。',
    category: 'marketing', tags: ['名片识别', 'CRM', '客户管理', '商务BD', '祝福群发', '名片全能王'],
    isFree: true, isLimitedFree: true, icon: 'Contact', relatedTools: [],
    externalUrl: 'https://www.camcard.com/',
    likes: 4321, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'aiqicha-query', slug: 'aiqicha-query', name: '爱企查工商查询',
    description: '百度旗下企业信息查询平台，公司注册信息、股东结构、司法风险、经营异常、知识产权免费查，创业合作前背调必过一遍。',
    category: 'finance-tools', tags: ['工商查询', '企业信息', '股东结构', '司法风险', '背调', '爱企查'],
    isFree: true, isLimitedFree: true, icon: 'Search', relatedTools: [],
    externalUrl: 'https://aiqicha.baidu.com/',
    likes: 14321, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'tianyancha', slug: 'tianyancha', name: '天眼查企业风控',
    description: '国内最权威的企业征信大数据平台，关系图谱发掘关联公司、疑似实际控制人、企业链图，投资尽调和大客户信用评估必备。',
    category: 'finance-tools', tags: ['企业征信', '关系图谱', '尽调', '风控', '关联公司', '天眼查'],
    isFree: true, isLimitedFree: true, icon: 'Eye', relatedTools: [],
    externalUrl: 'https://www.tianyancha.com/',
    likes: 16543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'trae-cn', slug: 'trae-cn', name: 'Trae AI编程助手',
    description: '国产AI编程IDE，深度集成大模型，代码自动补全、Bug自动修复、文档一键生成、前端组件预览，独立开发者一人顶十人团队。',
    category: 'dev-tools', tags: ['AI编程', '代码补全', 'Bug修复', '国产IDE', '独立开发', 'Trae'],
    isFree: true, isLimitedFree: true, icon: 'Code2', relatedTools: [],
    externalUrl: 'https://trae.ai/',
    likes: 10987, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['email'],
  },
  {
    id: 'codeium-free', slug: 'codeium-free', name: 'Codeium免费AI补全',
    description: '永久免费的AI代码补全工具，支持70+编程语言、VSCode/JetBrains/Neovim/Vim多编辑器插件，Chat+Search+补全三合一，替代Copilot省钱。',
    category: 'dev-tools', tags: ['AI补全', '免费', '多语言', '多插件', 'Chat', 'Codeium'],
    isFree: true, icon: 'Braces', relatedTools: [],
    externalUrl: 'https://codeium.com/',
    likes: 8765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'dida-365', slug: 'dida-365', name: '滴答清单任务管理',
    description: '国产GTD任务管理App天花板，待办+日历+番茄钟+专注统计四合一，全平台云同步，微信/钉钉提醒，创业人日周月复盘最佳伴侣。',
    category: 'productivity', tags: ['待办', 'GTD', '番茄钟', '日历', '全平台', '滴答清单'],
    isFree: true, isLimitedFree: true, icon: 'CheckCircle2', relatedTools: [],
    externalUrl: 'https://dida365.com/',
    likes: 22345, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },

  // ========== 👨💻 自由职业 / Freelancer 类 (25个) ==========
  {
    id: 'upwork-market', slug: 'upwork-market', name: 'Upwork全球接单',
    description: '全球最大的Freelance自由职业平台，软件开发、设计、写作、翻译、营销、数据录入全品类，美元结算，远程工作入门必研究的平台规则。',
    category: 'marketing', tags: ['自由职业', '接单', '美元', '全球', '远程', 'Upwork'],
    isFree: true, isLimitedFree: true, icon: 'Globe', relatedTools: [],
    externalUrl: 'https://www.upwork.com/',
    likes: 18765, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'fiverr-gig', slug: 'fiverr-gig', name: 'Fiverr服务交易',
    description: '全球知名的微服务交易市场，起步价5美元，LOGO设计、视频剪辑、SEO优化、文案写作标准化服务包，适合新手销售标准化服务。',
    category: 'marketing', tags: ['微服务', '5美元', '标准化服务', '新手', '海外', 'Fiverr'],
    isFree: true, isLimitedFree: true, icon: 'ShoppingBag', relatedTools: [],
    externalUrl: 'https://www.fiverr.com/',
    likes: 16543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'zbj-service', slug: 'zbj-service', name: '猪八戒服务市场',
    description: '国内最大的创意服务众包平台，LOGO、VI、网站、APP开发、文案、翻译、装修设计，中小企业发布需求一键对比服务商报价。',
    category: 'marketing', tags: ['众包', '创意服务', '国内', '服务商报价', '设计', '猪八戒'],
    isFree: true, isLimitedFree: true, icon: 'Users', relatedTools: [],
    externalUrl: 'https://www.zbj.com/',
    likes: 9876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'yuanling-work', slug: 'yuanling-work', name: '圆领远程工作',
    description: '国内远程工作招聘与自由职业平台，按小时/按项目收费，平台托管资金保障，程序员/设计师/运营/产品远程岗位一站式对接。',
    category: 'hr-tools', tags: ['远程工作', '自由职业', '资金托管', '岗位对接', '国内', '圆领'],
    isFree: true, isLimitedFree: true, icon: 'Briefcase', relatedTools: [],
    externalUrl: 'https://www.yuanling.com/',
    likes: 5432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'pj-work', slug: 'pj-work', name: '程序员客栈外包',
    description: '国内垂直IT技术外包平台，实名认证开发者匹配，按阶段托管付款+源码交付+售后保修，独立开发者和小团队接技术项目的渠道。',
    category: 'dev-tools', tags: ['外包', 'IT', '托管付款', '源码交付', '开发者', '程序员客栈'],
    isFree: true, isLimitedFree: true, icon: 'Laptop', relatedTools: [],
    externalUrl: 'https://www.proginn.com/',
    likes: 6789, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['email'],
  },
  {
    id: 'toggl-track', slug: 'toggl-track', name: 'Toggl工时追踪',
    description: 'Freelancer按小时收费必备，一键启动计时、自动记录项目和任务、区分客户、生成周报月报，工时数据直接导出到发票工具收款。',
    category: 'hr-tools', tags: ['工时追踪', '按小时收费', '客户区分', '报表', '发票', 'Toggl'],
    isFree: true, isLimitedFree: true, icon: 'Clock', relatedTools: [],
    externalUrl: 'https://track.toggl.com/',
    likes: 13456, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'harvest-invoice', slug: 'harvest-invoice', name: 'Harvest工时+发票',
    description: '工时追踪+在线发票二合一，自动把工时和费用转成正规发票，客户信用卡/PayPal在线支付，催款邮件自动发送，收款可视化报表。',
    category: 'finance-tools', tags: ['工时', '发票', '在线支付', '催款', '报表', 'Harvest'],
    isFree: false, isLimitedFree: true, icon: 'FileDollarSign', relatedTools: [],
    externalUrl: 'https://www.getharvest.com/',
    likes: 7654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'freshbooks-cloud', slug: 'freshbooks-cloud', name: 'FreshBooks云会计',
    description: '专为自由职业者和5人以下团队设计的云会计软件，时间追踪、自动发票、费用报销、在线收款、税务准备，北美Freelancer报税标配。',
    category: 'finance-tools', tags: ['云会计', '发票', '费用报销', '税务', '北美', 'FreshBooks'],
    isFree: false, isLimitedFree: true, icon: 'FileSpreadsheet', relatedTools: [],
    externalUrl: 'https://www.freshbooks.com/',
    likes: 8765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'wave-invoicing', slug: 'wave-invoicing', name: 'Wave免费发票工具',
    description: '真正永久免费的发票+会计工具，无隐藏费用，无限发票、无限客户、银行对账、财务报表，北美新Freelance零成本启动首选。',
    category: 'finance-tools', tags: ['免费发票', '永久免费', '对账', '财务报表', '北美', 'Wave'],
    isFree: true, icon: 'Receipt', relatedTools: [],
    externalUrl: 'https://www.waveapps.com/',
    likes: 9876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'andco-freelance', slug: 'andco-freelance', name: 'AND.CO Freelance套件',
    description: 'Fiverr旗下的自由职业全流程工具，提案、合同、NDA、时间追踪、发票、支付、税务文档一条龙，接单后90%文书工作自动化。',
    category: 'hr-tools', tags: ['提案', '合同', 'NDA', '发票', '自动化', 'AND.CO'],
    isFree: true, isLimitedFree: true, icon: 'Briefcase', relatedTools: [],
    externalUrl: 'https://www.and.co/',
    likes: 5432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'bonsai-suite', slug: 'bonsai-suite', name: 'Bonsai Freelance提案',
    description: '顶级Freelancer用的业务套件，1000+行业合同模板（律师审核）、专业提案PDF、自动定时发票、会计税务报告，年入10万刀以上必入。',
    category: 'finance-tools', tags: ['合同模板', '提案', '发票', '税务', '律师审核', 'Bonsai'],
    isFree: false, isLimitedFree: true, icon: 'TreePine', relatedTools: [],
    externalUrl: 'https://www.hellobonsai.com/',
    likes: 6543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'calendly-meeting', slug: 'calendly-meeting', name: 'Calendly自动预约',
    description: '和客户约会议的效率神器，把你的可用时间段生成一个链接，客户点进去自助选时间，自动同步Google/Outlook/飞书日历，短信邮件双提醒。',
    category: 'collaboration', tags: ['预约', '会议', '日历同步', '提醒', '自助', 'Calendly'],
    isFree: true, isLimitedFree: true, icon: 'CalendarClock', relatedTools: [],
    externalUrl: 'https://calendly.com/',
    likes: 23456, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'cal-com', slug: 'cal-com', name: 'Cal.com开源预约',
    description: 'Calendly的开源免费替代方案，代码可自托管、完全白标自定义域名和Logo，无品牌广告，独立SaaS产品内置预约功能的首选。',
    category: 'collaboration', tags: ['开源', '免费', '自托管', '白标', '自定义', 'Cal.com'],
    isFree: true, icon: 'CalendarCheck', relatedTools: [],
    externalUrl: 'https://cal.com/',
    likes: 12345, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'acuity-sched', slug: 'acuity-sched', name: 'Acuity预约管理',
    description: '服务型Freelancer和个体户的预约+收款神器，瑜伽/健身/咨询/摄影/家教按服务类型设时间、收定金、自动Zoom创建会议+群发提醒。',
    category: 'marketing', tags: ['预约', '收款', '定金', 'Zoom会议', '提醒', 'Acuity'],
    isFree: false, isLimitedFree: true, icon: 'CalendarDays', relatedTools: [],
    externalUrl: 'https://acuityscheduling.com/',
    likes: 4321, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'tencent-meeting', slug: 'tencent-meeting', name: '腾讯会议在线',
    description: '国内最流畅的视频会议工具，一键发起邀请链接，微信直接加入无需下载，最多2000人同时参会，屏幕共享、虚拟背景、会议纪要AI自动生成。',
    category: 'collaboration', tags: ['视频会议', '微信', '屏幕共享', 'AI纪要', '大规模', '腾讯会议'],
    isFree: true, isLimitedFree: true, icon: 'Video', relatedTools: [],
    externalUrl: 'https://meeting.tencent.com/',
    likes: 28765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'zoom-video', slug: 'zoom-video', name: 'Zoom视频会议',
    description: '全球最流行的远程视频会议工具，跨平台兼容，屏幕共享+虚拟背景+分组讨论+会议录制，Freelancer和海外客户沟通毫无障碍。',
    category: 'collaboration', tags: ['视频会议', '跨平台', '录制', '分组讨论', '海外', 'Zoom'],
    isFree: true, isLimitedFree: true, icon: 'PhoneCall', relatedTools: [],
    externalUrl: 'https://zoom.us/',
    likes: 31234, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'feishu-meeting', slug: 'feishu-meeting', name: '飞书妙记会议',
    description: '飞书自带视频会议+妙纪要，实时转写文字、一键导出Word/Notion、说话人自动识别、重点话题检索，团队会议资料沉淀省90%整理时间。',
    category: 'collaboration', tags: ['会议纪要', '转写', '说话人识别', '沉淀', '妙记', '飞书'],
    isFree: true, isLimitedFree: true, icon: 'Mic', relatedTools: [],
    externalUrl: 'https://www.feishu.cn/product/meetings',
    likes: 10987, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'miro-whiteboard', slug: 'miro-whiteboard', name: 'Miro在线白板',
    description: '全球最强的在线协作白板，思维导图、用户旅程、竞品分析、头脑风暴、站会看板、流程图模板多到爆炸，分布式团队脑暴必备。',
    category: 'collaboration', tags: ['白板', '头脑风暴', '协作', '模板', '分布式', 'Miro'],
    isFree: true, isLimitedFree: true, icon: 'LayoutDashboard', relatedTools: [],
    externalUrl: 'https://miro.com/',
    likes: 15432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'invision-freehand', slug: 'invision-freehand', name: 'Freehand协作白板',
    description: 'InVision旗下的设计协作白板，设计师和客户线上改稿的利器，线框稿+Figma嵌入+评论打点+便签投票，远程评审会1小时搞定。',
    category: 'design-tools', tags: ['白板', '设计评审', 'Figma嵌入', '评论打点', '投票', 'Freehand'],
    isFree: true, isLimitedFree: true, icon: 'PencilLine', relatedTools: [],
    externalUrl: 'https://www.invisionapp.com/freehand',
    likes: 5432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'skillshare-learn', slug: 'skillshare-learn', name: 'Skillshare技能学习',
    description: '自由职业者充电首选，设计、剪辑、编程、营销、写作、插画、摄影、创业2.8万+高质量视频课程，月度订阅无限看。',
    category: 'education', tags: ['在线课程', '技能学习', '设计', '剪辑', '创业', 'Skillshare'],
    isFree: false, isLimitedFree: true, icon: 'GraduationCap', relatedTools: [],
    externalUrl: 'https://www.skillshare.com/',
    likes: 12345, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'coursera-plus', slug: 'coursera-plus', name: 'Coursera大学课程',
    description: '全球顶尖大学和公司官方课程平台，Google、IBM、Meta的职业证书全球公认，适合Freelancer系统学习技能、获得行业认可的证书。',
    category: 'education', tags: ['大学课程', '职业证书', 'Google', 'Meta', '系统学习', 'Coursera'],
    isFree: true, isLimitedFree: true, icon: 'Award', relatedTools: [],
    externalUrl: 'https://www.coursera.org/',
    likes: 18765, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'degreed-skill', slug: 'degreed-skill', name: 'Degreed技能矩阵',
    description: '个人技能发展记录平台，把你读过的书、学过的课、证书、项目、文章统一录入，自动生成可视化技能矩阵报告，Freelancer找工作加分。',
    category: 'education', tags: ['技能矩阵', '学习记录', '证书', '报告', '求职', 'Degreed'],
    isFree: true, isLimitedFree: true, icon: 'BarChart3', relatedTools: [],
    externalUrl: 'https://degreed.com/',
    likes: 3456, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'canva-resume', slug: 'canva-resume', name: 'Canva简历模板',
    description: '找工作/接私单的简历神器，500+专业简历模板（一页纸简历、创意简历、设计师简历、程序员简历），免费导出PDF/图片。',
    category: 'hr-tools', tags: ['简历', '模板', '求职', '接私单', 'PDF导出', 'Canva'],
    isFree: true, isLimitedFree: true, icon: 'FileUser', relatedTools: [],
    externalUrl: 'https://www.canva.cn/documents/templates/resumes/',
    likes: 17654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'standard-resume', slug: 'standard-resume', name: 'Standard Resume简洁简历',
    description: '程序员/设计师/运营极简ATS友好简历生成器，一行一行填自动排版，支持导入LinkedIn，不用调格式就能出HR最爱的一页纸简历。',
    category: 'hr-tools', tags: ['简历', 'ATS友好', '极简', 'LinkedIn导入', '一页纸', 'Standard'],
    isFree: true, isLimitedFree: true, icon: 'UserCheck', relatedTools: [],
    externalUrl: 'https://standardresume.co/',
    likes: 6789, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'read-cv', slug: 'read-cv', name: 'Read.cv创意作品集',
    description: '创意工作者的个人简历+作品集社交平台，设计师、产品经理、开发者展示作品的LinkedIn替代，社区优质项目机会内推直推。',
    category: 'hr-tools', tags: ['作品集', '创意', '内推', '社交', '简历', 'Read.cv'],
    isFree: true, isLimitedFree: true, icon: 'FolderKanban', relatedTools: [],
    externalUrl: 'https://read.cv/',
    likes: 5432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },

  // ========== 🛠️ 其他实用工具类 (25个，功能不重复) ==========
  {
    id: 'tide-focus', slug: 'tide-focus', name: 'Tide白噪音番茄钟',
    description: '深度专注三合一：白噪音+番茄钟25/5循环+专注时长统计，下雨声、咖啡馆、海浪、图书馆多场景音效，Freelancer在家工作抗干扰。',
    category: 'health', tags: ['白噪音', '番茄钟', '专注', '抗干扰', '统计', 'Tide'],
    isFree: true, isLimitedFree: true, icon: 'Timer', relatedTools: [],
    externalUrl: 'https://tide.fm/',
    likes: 15432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'noisli-bg', slug: 'noisli-bg', name: 'Noisli背景音效',
    description: '自由搭配的背景声音，咖啡+下雨+打字+鸟叫+火车任意混合，可单独调音量；带计时器和文本编辑器，写文案和代码的BGM神器。',
    category: 'productivity', tags: ['背景音', '混合音效', '计时器', '编辑器', '专注', 'Noisli'],
    isFree: true, isLimitedFree: true, icon: 'VolumeX', relatedTools: [],
    externalUrl: 'https://www.noisli.com/',
    likes: 9876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'forest-focus', slug: 'forest-focus', name: 'Forest专注种树',
    description: '戒掉手机分心，专注时间种下一棵虚拟树，时间到存活、玩手机立刻枯萎；累计种树够多可以真的种真树，学习和自律打卡神器。',
    category: 'health', tags: ['专注', '自律', '种真树', '戒手机', '打卡', 'Forest'],
    isFree: true, isLimitedFree: true, icon: 'TreeDeciduous', relatedTools: [],
    externalUrl: 'https://www.forestapp.cc/',
    likes: 24567, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'todoist-gtd', slug: 'todoist-gtd', name: 'Todoist任务清单',
    description: '全球经典GTD任务管理App，智能截止日期识别、项目文件夹、标签、优先级、重复规则、Karma积分，全平台同步，500强员工在用。',
    category: 'productivity', tags: ['GTD', '任务', '智能日期', '标签', 'Karma', 'Todoist'],
    isFree: true, isLimitedFree: true, icon: 'CheckSquare', relatedTools: [],
    externalUrl: 'https://todoist.com/',
    likes: 23456, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'ms-todo', slug: 'ms-todo', name: '微软To Do待办',
    description: '微软出品的免费待办，和Outlook邮箱、Teams、Office全家桶深度打通，我的一天、已规划、重要、任务清单5种视图，职场人无缝衔接。',
    category: 'productivity', tags: ['待办', '微软', 'Office', 'Outlook', '同步', 'Microsoft'],
    isFree: true, icon: 'SquareCheck', relatedTools: [],
    externalUrl: 'https://to-do.office.com/',
    likes: 18765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['email'],
  },
  {
    id: 'obsidian-publish', slug: 'obsidian-publish', name: 'Obsidian知识库',
    description: '本地优先的Markdown双向链接笔记软件，资料像维基百科一样互联，丰富的插件市场和社区主题，适合构建个人知识库或独立产品文档。',
    category: 'education', tags: ['Markdown', '双向链接', '知识库', '本地优先', '插件', 'Obsidian'],
    isFree: true, isLimitedFree: true, icon: 'BookOpen', relatedTools: [],
    externalUrl: 'https://obsidian.md/',
    likes: 17654, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'roam-research', slug: 'roam-research', name: 'Roam Research网状笔记',
    description: '双向链接笔记的开山之作，每日笔记+块级引用+关系图谱，把零散知识连成网，作家、研究员、产品经理深度思考写作的首选。',
    category: 'education', tags: ['双向链接', '块级引用', '关系图谱', '每日笔记', '深度思考', 'Roam'],
    isFree: false, isLimitedFree: true, icon: 'Orbit', relatedTools: [],
    externalUrl: 'https://roamresearch.com/',
    likes: 8765, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'duolingo-web', slug: 'duolingo-web', name: '多邻国语言学习',
    description: '全球最火的免费语言学习平台，英/日/韩/法/西/德/意40+语言，游戏化闯关+每日打卡+排位赛，碎片时间学外语越学越上瘾。',
    category: 'education', tags: ['语言学习', '游戏化', '40+语言', '打卡', '排位赛', '多邻国'],
    isFree: true, isLimitedFree: true, icon: 'Languages', relatedTools: [],
    externalUrl: 'https://www.duolingo.cn/',
    likes: 35432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'anki-web', slug: 'anki-web', name: 'Anki闪卡记忆',
    description: '间隔重复记忆算法的标杆，考研/考证/医学/法律/背单词神器，自己做卡片或下载他人牌组，配合手机端App同步，遗忘曲线科学复习。',
    category: 'education', tags: ['闪卡', '间隔重复', '考研', '考证', '记忆算法', 'Anki'],
    isFree: true, icon: 'Brain', relatedTools: [],
    externalUrl: 'https://ankiweb.net/',
    likes: 15432, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'grammarly-check', slug: 'grammarly-check', name: 'Grammarly英文润色',
    description: '全球最多人用的英文写作检查工具，语法、拼写、语气、剽窃检测、学术规范，接海外写作、翻译、留学文书单的Freelancer必备。',
    category: 'content-tools', tags: ['英文', '语法', '润色', '剽窃检测', '留学', 'Grammarly'],
    isFree: true, isLimitedFree: true, icon: 'SpellCheck', relatedTools: [],
    externalUrl: 'https://www.grammarly.com/',
    likes: 28765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'netease-jianwai', slug: 'netease-jianwai', name: '网易见外工作台',
    description: '网易出品的AI字幕翻译与转写平台，视频自动生成中英文双语字幕、音频转文字、文档翻译，合规备案国内访问快，自媒体人做搬运必备。',
    category: 'content-tools', tags: ['字幕', '翻译', '转写', '双语', '国内', '网易见外'],
    isFree: true, isLimitedFree: true, icon: 'Languages', relatedTools: [],
    externalUrl: 'https://jianwai.netease.com/',
    likes: 11234, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['cn-phone'],
  },
  {
    id: 'deepl-translate', slug: 'deepl-translate', name: 'DeepL精准翻译',
    description: '公认翻译质量最好的AI翻译器，上下文理解超越Google翻译，英/法/德/日/西/中/俄30+语言互译，保留原格式导出文档翻译。',
    category: 'content-tools', tags: ['翻译', 'AI', '高质量', '多语言', '文档', 'DeepL'],
    isFree: true, isLimitedFree: true, icon: 'Globe2', relatedTools: [],
    externalUrl: 'https://www.deepl.com/translator',
    likes: 19876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'ilovepdf-io', slug: 'ilovepdf-io', name: 'iLovePDF PDF工具箱',
    description: '全球PDF工具天花板，PDF合并、拆分、压缩、转Word/Excel/PPT/图片、加密解密、水印、页码、旋转、OCR识别24种功能全免费。',
    category: 'pdf-tools', tags: ['PDF', '合并', '拆分', '压缩', '转Word', 'iLovePDF'],
    isFree: true, isLimitedFree: true, icon: 'FileText', relatedTools: [],
    externalUrl: 'https://www.ilovepdf.com/',
    likes: 31234, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'smallpdf-tools', slug: 'smallpdf-tools', name: 'SmallPDF瑞士军刀',
    description: 'PDF界的瑞士军刀，20+文档工具全齐，界面清爽无广告，和Google Drive/Dropbox/OneDrive云端直连，处理完自动存云端。',
    category: 'pdf-tools', tags: ['PDF', '云端集成', '压缩', '转换', '无广告', 'SmallPDF'],
    isFree: true, isLimitedFree: true, icon: 'FolderArchive', relatedTools: [],
    externalUrl: 'https://smallpdf.com/',
    likes: 26543, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'kami-pdf', slug: 'kami-pdf', name: 'Kami在线PDF标注',
    description: '老师和学生的最爱，在线PDF/Word/图片/电子书高亮、划重点、文字评论、语音评论、签名、画图，Google Classroom无缝集成。',
    category: 'pdf-tools', tags: ['PDF', '标注', '评论', '教育', 'Classroom', 'Kami'],
    isFree: true, isLimitedFree: true, icon: 'Highlighter', relatedTools: [],
    externalUrl: 'https://www.kamihq.com/',
    likes: 7654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'lightpdf-cloud', slug: 'lightpdf-cloud', name: 'LightPDF云PDF',
    description: '国产PDF云服务，PDF转Word/Excel/PPT/JPG/TXT、OCR文字识别、PDF编辑、签名、水印移除合规版，国内浏览器秒开。',
    category: 'pdf-tools', tags: ['PDF', 'OCR', '国产', '云服务', '秒开', 'LightPDF'],
    isFree: true, isLimitedFree: true, icon: 'FileEdit', relatedTools: [],
    externalUrl: 'https://lightpdf.cn/',
    likes: 9876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'direct', signup: ['no-signup'],
  },
  {
    id: 'carbon-now', slug: 'carbon-now', name: 'Carbon代码美化截图',
    description: '技术博主写公众号/推特的神器，复制代码生成带语法高亮+渐变背景+行号+圆角的精美代码图，一键导出PNG/SVG，技术分享图直接用。',
    category: 'dev-tools', tags: ['代码截图', '语法高亮', '渐变背景', '技术博客', '分享图', 'Carbon'],
    isFree: true, icon: 'Brackets', relatedTools: [],
    externalUrl: 'https://carbon.now.sh/',
    likes: 18765, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'ray-so', slug: 'ray-so', name: 'Ray.so梦幻代码截图',
    description: '更酷炫的代码美化截图，玻璃拟态+磨砂渐变背景+深/浅主题+窗口阴影，生成的代码图比Carbon更有设计感，前端开发者分享首选。',
    category: 'dev-tools', tags: ['代码截图', '玻璃拟态', '渐变', '高颜值', '前端', 'Ray.so'],
    isFree: true, icon: 'Aperture', relatedTools: [],
    externalUrl: 'https://ray.so/',
    likes: 11234, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'codepen-io', slug: 'codepen-io', name: 'CodePen前端灵感',
    description: '全球最大的前端代码灵感社区，HTML/CSS/JS在线调试和分享，酷炫动画、交互动效、CSS艺术、SVG作品，找前端UI灵感和代码片段首选。',
    category: 'dev-tools', tags: ['前端', '灵感', 'HTML', 'CSS', '动画', 'CodePen'],
    isFree: true, isLimitedFree: true, icon: 'Codepen', relatedTools: [],
    externalUrl: 'https://codepen.io/',
    likes: 23456, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'figma-community', slug: 'figma-community', name: 'Figma社区模板',
    description: '免费设计资源金矿，App UI、仪表盘、插画、3D图标、线框原型、设计系统100万+文件，一键复制到自己Figma编辑器直接改。',
    category: 'design-tools', tags: ['设计模板', '免费资源', 'App UI', '插画', '设计系统', 'Figma'],
    isFree: true, icon: 'Copy', relatedTools: [],
    externalUrl: 'https://www.figma.com/community',
    likes: 21345, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'dribbble-design', slug: 'dribbble-design', name: 'Dribbble设计灵感',
    description: '全球设计师作品集平台，UI/UX、插画、动效、品牌、网页设计TOP作品都在这里，接设计私单的设计师发布作品吸引客户首选地。',
    category: 'design-tools', tags: ['作品集', 'UI', '插画', '动效', '获客', 'Dribbble'],
    isFree: true, isLimitedFree: true, icon: 'Palette', relatedTools: [],
    externalUrl: 'https://dribbble.com/',
    likes: 20987, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'behance-portfolio', slug: 'behance-portfolio', name: 'Behance作品发布',
    description: 'Adobe旗下的创意作品社区，平面、UI、建筑、摄影、插画、动效长图项目展示，Adobe Talent招聘直通，设计师找高薪工作的线上简历。',
    category: 'design-tools', tags: ['作品集', 'Adobe', '招聘', '创意', '简历', 'Behance'],
    isFree: true, icon: 'FolderOpen', relatedTools: [],
    externalUrl: 'https://www.behance.net/',
    likes: 17654, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'notion-templates', slug: 'notion-templates', name: 'Notion模板库',
    description: '官方精选的数千个Notion免费模板，OKR追踪、第二大脑、CRM、旅行规划、习惯打卡、读书清单、预算管理，找到模板一键复制即用。',
    category: 'productivity', tags: ['Notion模板', 'OKR', 'CRM', '习惯打卡', '免费', '官方'],
    isFree: true, icon: 'LayoutTemplate', relatedTools: [],
    externalUrl: 'https://www.notion.so/templates',
    likes: 15432, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['no-signup'],
  },
  {
    id: 'product-hunt', slug: 'product-hunt', name: 'Product Hunt新产品',
    description: '全球新产品发现社区，SaaS、工具、App、AI产品每日发布榜，独立开发者和创业者找灵感、研究竞品、发布自己产品的首发平台。',
    category: 'dev-tools', tags: ['新产品', 'SaaS', '竞品', '首发', '独立开发', 'ProductHunt'],
    isFree: true, icon: 'Rocket', relatedTools: [],
    externalUrl: 'https://www.producthunt.com/',
    likes: 19876, difficulty: 'easy', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
  {
    id: 'hunt-webflow', slug: 'hunt-webflow', name: 'Webflow无代码建站',
    description: '设计师首选的无代码建站平台，拖拽式设计+CMS后台+表单+支付+多语言+SEO优化全齐，独立开发者做企业官网/落地页接外包一单回本。',
    category: 'dev-tools', tags: ['无代码', '建站', 'CMS', 'SEO', '落地页', 'Webflow'],
    isFree: true, isLimitedFree: true, icon: 'Globe', relatedTools: [],
    externalUrl: 'https://webflow.com/',
    likes: 16543, difficulty: 'medium', complianceLevel: 'green', platform: 'all', accessTag: 'vpn-required', signup: ['email'],
  },
];

// ============ 附加到 tools.ts ============
const srcPath = path.join(__dirname, '..', 'data', 'tools.ts');
let src = fs.readFileSync(srcPath, 'utf8');

// 在最后一个 ]; 之前插入新工具（先找到 `  }\n];` 模式）
const closePattern = /(\n\s*\}\s*)\n\];/;
const match = src.match(closePattern);
if (!match) {
  console.error('❌ 找不到tools数组结束位置');
  process.exit(1);
}

// 生成工具对象的TS代码片段
const snippet = newTools.map(t => {
  const parts = [];
  parts.push(`  {\n    id: '${t.id}',`);
  parts.push(` slug: '${t.slug}',`);
  parts.push(` name: '${t.name.replace(/'/g, "\\'")}',`);
  parts.push(`\n    description: '${t.description.replace(/'/g, "\\'")}',`);
  parts.push(`\n    category: '${t.category}',`);
  const tagsLiteral = `[${t.tags.map(tag => `'${tag.replace(/'/g, "\\'")}'`).join(', ')}]`;
  parts.push(` tags: ${tagsLiteral},`);
  parts.push(`\n    isFree: ${t.isFree},`);
  if (t.isLimitedFree !== undefined) parts.push(` isLimitedFree: ${t.isLimitedFree},`);
  parts.push(`\n    icon: '${t.icon}',`);
  parts.push(` relatedTools: [],`);
  parts.push(`\n    externalUrl: '${t.externalUrl}',`);
  if (t.likes) parts.push(`\n    likes: ${t.likes},`);
  if (t.difficulty) parts.push(` difficulty: '${t.difficulty}',`);
  if (t.complianceLevel) parts.push(` complianceLevel: '${t.complianceLevel}',`);
  if (t.platform) parts.push(` platform: '${t.platform}',`);
  if (t.accessTag) parts.push(`\n    accessTag: '${t.accessTag}',`);
  if (t.signup && t.signup.length) {
    const signupLiteral = `[${t.signup.map(s => `'${s}'`).join(', ')}]`;
    parts.push(` signup: ${signupLiteral},`);
  }
  parts.push(`\n  },`);
  return parts.join('');
}).join('\n');

const insertIndex = match.index + match[1].length;
src = src.slice(0, insertIndex) + ',\n' + snippet + '\n' + src.slice(insertIndex);

fs.writeFileSync(srcPath, src, 'utf8');
console.log(`✅ 已追加 ${newTools.length} 个工具到 data/tools.ts（index=${insertIndex}）`);

// ============ 同步写入 6 语言 translation.json ============
function buildTranslations(base, overrides = {}) {
  return {
    name: overrides.name ?? base.name,
    description: overrides.desc ?? base.description,
  };
}

const localeDir = path.join(__dirname, '..', 'public', 'locales');
const localeMap = {
  zh: {},
  en: {
    'canva-video': { name: 'Canva Video Editor', desc: 'Zero-skills short video creator, 10,000+ templates with drag-and-drop, multi-aspect ratio, captions and transitions — works fully on mobile browsers.' },
    'capcut-web': { name: 'CapCut Web Editor', desc: 'ByteDance\'s online video editor fully synced with mobile CapCut. Smart captions, one-click trailer, speed ramping and LUT presets.' },
    'descript-video': { name: 'Descript AI Video', desc: 'Edit video by editing text — auto transcriptions, AI overdub, screen and podcast recorder all in one. Triples solo content creator throughput.' },
    'veed-io': { name: 'VEED Online Studio', desc: 'Browser all-in-one video studio: recording, trimming, auto captions, BG removal, chroma key, watermark, compression, conversion.' },
    'kapwing-tools': { name: 'Kapwing Media Kit', desc: 'One-stop memes, short videos and GIFs. Add text / captions / stitching / trimming, WeChat and Xiaohongshu cover templates preloaded.' },
    'wistia-hosting': { name: 'Wistia Video Hosting', desc: 'Marketing-grade ad-free HD video hosting with viewer heatmaps, email lead capture and branded player. Perfect for startup websites.' },
    'vidyard-messages': { name: 'Vidyard Video Messages', desc: 'Record screen+camera async video messages with watch tracking — way clearer than typed text for freelancers working with overseas clients.' },
    'loom-recorder': { name: 'Loom Async Screen Share', desc: 'The #1 async screen recorder. Captures screen + face + voice, auto-generates shareable link with timestamped comments — remote work staple.' },
    'screencastify-chrome': { name: 'Screencastify Recorder', desc: 'Chrome screen recorder with 30-min free sessions, webcam overlay, pen annotation, one-click MP4 or Google Drive export — great for tutors.' },
    'streamyard-live': { name: 'StreamYard Multi-Platform Live', desc: 'Browser live streaming to Douyin, Bilibili, Video Account, YouTube, Facebook, LinkedIn simultaneously with logo, ticker and guest call-ins.' },
    'restream-io': { name: 'Restream Multi-Distribute', desc: 'Stream once and reach 30+ social platforms with VOD storage, replay and unified chat. Essential for live commerce creators.' },
    'runway-gen': { name: 'Runway AI Video Suite', desc: 'Pro AI video creation toolkit: text-to-scene, image motion, one-click chroma key, old video restoration and upscaling.' },
    'pika-labs': { name: 'Pika AI Video Generator', desc: 'Text / image-to-HD animation with anime, 3D, realistic and cyberpunk styles. Fast prototyping for titles and product demos.' },
    'submagic-auto': { name: 'Submagic AI Captions', desc: 'Auto-gen short-video captions with color highlights, emoji callouts and bilingual SRT export. Viral boost for TikTok/Shorts.' },
    'opus-clip': { name: 'Opus Long-to-Shorts AI', desc: 'Clips 10 viral shorts from long podcasts with auto hooks, Virality scores, captions and B-ROLL, saving 80% of studio editing time.' },
    'repurpose-io': { name: 'Repurpose Content Repurposing', desc: 'Automated content repurposing pipeline: YouTube to podcast, shorts, TikTok, blog post to LinkedIn carousels.' },
    'riverside-fm': { name: 'Riverside Remote Recording', desc: 'Top-grade remote interview recorder. Guests join via browser, local 4K multitrack storage, live streaming and auto transcription.' },
    'streamlabs-obs': { name: 'Streamlabs Live Assistant', desc: 'Stream beautification toolkit: overlays, donation effects, chatbots, interactive games and alerts for new streamers.' },
    'motion-array': { name: 'Motion Array Stock', desc: 'All-in-one asset subscription: PR/AE/FCPX templates, LUTs, transitions, SFX music, 8K royalty-free stock.' },
    'artlist-io': { name: 'Artlist Royalty-Free Music', desc: 'Creator-standard royalty-free music subscription with global license coverage, zero YouTube Content ID claims.' },
    'epidemic-sound': { name: 'Epidemic Sound Library', desc: '400K+ tracks + 100K SFX with unlimited subscription; auto-fits duration with 100% claim protection.' },
    'storyblocks-vid': { name: 'Storyblocks Assets', desc: '3-in-1 video/audio/image subscription; lower per-project asset costs for freelancers and creative studios.' },
    'pixabay-video': { name: 'Pixabay Free Stock Video', desc: 'Largest CC0 free library with millions of HD/4K videos, images, music, vectors — 100% free commercial use, no attribution.' },
    'pexels-videos': { name: 'Pexels Free Video & Images', desc: 'Curated high-quality free stock; curated HD/4K videos, photos, all hand-picked by humans, free commercial.' },
    'unsplash-images': { name: 'Unsplash HD Photos', desc: 'Designer-grade free HD photos from global photographers; free commercial with a public REST API for product integration.' },
    'canva-design': { name: 'Canva Design Platform', desc: 'Zero-learning-curve design for startups. 1M+ templates of logos, posters, business cards, PPTs, menus, H5 invites, banners.' },
    'figma-design': { name: 'Figma Design Collaboration', desc: 'The industry-leading UI/UX collaborative design platform; component libraries, interactive prototypes, DevMode hand-off — solo dev staple.' },
    'feishu-docs': { name: 'Feishu Collaboration Suite', desc: 'Docs, Sheets, Bitable, Calendar, Meetings, OKRs unified. Free for teams under 50 — perfect Chinese Office 365 alternative.' },
    'tencent-docs': { name: 'Tencent Docs', desc: 'Most popular online docs & sheets in China. WeChat shareable, no login to view, real-time multi-user co-edit.' },
    'notion-workspace': { name: 'Notion Workspace', desc: 'All-in-one workspace for business plans, SOPs, CRM, kanban boards and roadmaps — the digital brain of every freelancer.' },
    'xmind-mindmap': { name: 'XMind Mind Maps', desc: 'Business planning mind mapping with fishbone, org chart, Gantt and matrix views; one-click PPT/Word/PDF export.' },
    'processon-flow': { name: 'ProcessOn Diagrams', desc: 'Top-tier online flowcharts, mind maps, BPMN, ER, network topology, wireframes; 800K+ community templates.' },
    'whimsical-wire': { name: 'Whimsical Wireframe Suite', desc: 'PM fast prototyping kit: low-fi wireframes + flowcharts + kanban + sticky notes. 3-day spec turnaround for freelance devs.' },
    'chuangkit-poster': { name: 'ChuangKit Chinese Design', desc: 'China-tailored design: catering menus, WeChat posters, real-estate flyers, recruitment, domestic commercial font licensing built-in.' },
    'markup-hero': { name: 'Markup Hero Screenshots', desc: 'Annotated, long screenshots + PDF marking. Arrows, blurs, text, mosaic, multi-image collages, shareable links for client reviews.' },
    'airtable-db': { name: 'Airtable Low-Code DB', desc: 'Relational database that feels like Excel: CRM, projects, inventory, content calendar, forms + automation — no code required.' },
    'feishu-bitable': { name: 'Feishu Bitable', desc: 'Domestic Airtable with kanban, Gantt, gallery, form, automation and cross-table relations, fast domestic network.' },
    'tencent-survey': { name: 'Tencent Surveys', desc: 'Top China market research tool; 30+ question types, logic jumps, lucky money rewards, WeChat sharing, sample panel.' },
    'typeform-form': { name: 'Typeform Beautiful Forms', desc: 'High-conversion one-question-at-a-time forms with 3x completion rate; overseas client intake must-have.' },
    'jotform-builder': { name: 'Jotform Forms Builder', desc: '10K+ templates for booking, sign-ups, payments, e-signatures, orders, approvals, onboarding; drag-drop with Stripe/WeChat Pay.' },
    'pandadoc-sign': { name: 'PandaDoc e-Signatures', desc: 'Proposals, quotes, contracts, NDAs with legally-binding e-signatures, open time tracking — +40% close rate for B2B sales.' },
    'fadada-sign': { name: 'FaDaDa e-Contracts', desc: 'China-compliant e-signatures: national cryptography, notary deposit, judicial admissibility, REST API integrations.' },
    'shangshangqian': { name: 'ShangShangQian Enterprise Sign', desc: 'Enterprise SaaS e-signatures with 200+ native integrations; real-name auth, blockchain notarization, bulk signing.' },
    'good-acc': { name: 'Yonyou Good Accounting', desc: 'Yonyou cloud accounting for micro-businesses; auto capture invoices, bookkeeping, one-click tax filing, owner dashboard.' },
    'mingpian-scanner': { name: 'CamCard Business Card Scanner', desc: 'OCR business cards to CRM, track follow-ups, calendar reminders, festival greetings bulk send; WeChat card integration.' },
    'aiqicha-query': { name: 'AIQiCha Business Search', desc: 'Baidu free business registry search; corporate info, shareholders, legal risks, IPRs — must-check before partnerships.' },
    'tianyancha': { name: 'TianYanCha Risk Intel', desc: 'The most authoritative business credit big data in China; relationship graphs, UBO mining, due-diligence deep-dive.' },
    'trae-cn': { name: 'Trae AI Coding IDE', desc: 'Chinese AI-powered IDE with LLMs, auto completion, auto bug fix, doc generation and live preview. 10x solo dev productivity.' },
    'codeium-free': { name: 'Codeium Free AI Complete', desc: 'Forever-free AI code completion for 70+ languages across VSCode/JetBrains/Neovim/Vim. Chat + search + autocomplete in one.' },
    'dida-365': { name: 'TickTick Task Manager', desc: 'The GTD app leader in China; todos + calendar + pomodoro + focus reports, cloud sync, WeChat/DingTalk reminders.' },
    'upwork-market': { name: 'Upwork Freelance Marketplace', desc: 'Largest global freelance marketplace. Dev, design, copy, translate, SEO, data; USD payouts — the benchmark platform.' },
    'fiverr-gig': { name: 'Fiverr Gigs Marketplace', desc: 'Micro-services from $5; logo, video, SEO, copywriting packaged as Gigs — beginner-friendly global sales.' },
    'zbj-service': { name: 'ZBJ Service Marketplace', desc: 'China\'s largest creative services platform: logos, VI, sites, apps, copy, translation. Compare quotes from vendors.' },
    'yuanling-work': { name: 'YuanLing Remote Work', desc: 'Domestic freelance and remote job board; hourly or project escrow billing, dev/design/ops/PM roles matched.' },
    'pj-work': { name: 'Proginn Outsourcing', desc: 'China tech-only freelance matching. Verified developers, milestone escrow, source code delivery and maintenance warranty.' },
    'toggl-track': { name: 'Toggl Time Tracking', desc: 'Hourly freelancers must-have. One-click timers, project/client tags, weekly/monthly reports — export directly to invoicing tools.' },
    'harvest-invoice': { name: 'Harvest Time + Invoicing', desc: 'Time + online invoices unified; auto turn billable hours into invoices, card/PayPal payments, auto reminders, AR dashboard.' },
    'freshbooks-cloud': { name: 'FreshBooks Cloud Accounting', desc: 'Cloud accounting for freelancers and teams <5. Time, invoicing, expenses, online payments, tax packs — NA freelancer standard.' },
    'wave-invoicing': { name: 'Wave Free Invoicing', desc: 'Truly forever free invoicing + accounting. Unlimited invoices, clients, bank reconciliation, reports — zero startup cost.' },
    'andco-freelance': { name: 'AND.CO Freelance OS', desc: 'Fiverr-owned all-in freelance OS: proposals, contracts, NDAs, time, invoices, payments, tax docs; 90% admin automated.' },
    'bonsai-suite': { name: 'Bonsai Freelance Bundle', desc: 'Premium freelance bundle; 1000+ lawyer-vetted templates, branded proposals, recurring invoices, tax reports — for $100K+ earners.' },
    'calendly-meeting': { name: 'Calendly Scheduling', desc: 'Share a personal booking link; clients self-serve times. Auto syncs to Google/Outlook/Feishu with dual SMS + email reminders.' },
    'cal-com': { name: 'Cal.com Open Source Scheduling', desc: 'Open-source, free, self-hostable Calendly alternative. White-label custom domain, logo, zero branding — perfect for SaaS embedding.' },
    'acuity-sched': { name: 'Acuity Appointment Suite', desc: 'Service-freelancer appointment & payment: per-service calendars, deposits, auto Zoom creation and mass reminders.' },
    'tencent-meeting': { name: 'Tencent Meetings', desc: 'Best China video meetings. One-click invite links; join from WeChat without app; 2000 participants, share, AI minutes.' },
    'zoom-video': { name: 'Zoom Video Meetings', desc: 'The world standard video conferencing. Cross-platform, screen share, breakout rooms, cloud recording — crystal clear with overseas clients.' },
    'feishu-meeting': { name: 'Feishu Minutes', desc: 'Meetings with AI Minutes: live transcription, Word/Notion export, speaker diarization, topic search; 90% less recap time.' },
    'miro-whiteboard': { name: 'Miro Online Whiteboard', desc: 'The world\'s strongest collaborative whiteboard. Mind maps, user journeys, competitive analysis, stand-ups, retros.' },
    'invision-freehand': { name: 'Freehand Design Whiteboard', desc: 'InVision collaborative review board; wireframes + Figma embed, comment pinning, sticky-note voting, one-hour remote design review.' },
    'skillshare-learn': { name: 'Skillshare Creative Learning', desc: 'Freelancer upskilling favorite. 28K+ quality classes in design, video, code, marketing, writing, photography, entrepreneurship.' },
    'coursera-plus': { name: 'Coursera University Courses', desc: 'Top university and corporation courses. Google, IBM, Meta Career Certificates globally recognized — structured skill-building.' },
    'degreed-skill': { name: 'Degreed Skill Matrix', desc: 'Unified skill tracking for books, courses, certs, projects and articles; auto-generate a visual skill matrix report for job hunting.' },
    'canva-resume': { name: 'Canva Resume Builder', desc: '500+ professional resume templates: one-page, creative, designer, dev, PM. Free export as PDF/PNG for job hunt or freelance pitches.' },
    'standard-resume': { name: 'Standard Resume Builder', desc: 'ATS-friendly clean resumes for devs/designers/PMs. Fill line-by-line, auto-formats to recruiter-preferred 1-page; LinkedIn import.' },
    'read-cv': { name: 'Read.cv Portfolio Site', desc: 'Creative worker LinkedIn alternative. Mini portfolios + resume + community, curated referral opportunities and internal promotions.' },
    'tide-focus': { name: 'Tide Focus White Noise', desc: 'Deep focus 3-in-1: white noise, 25/5 Pomodoro, focus stats. Rain, cafe, ocean, library ASMR to fight home-office distraction.' },
    'noisli-bg': { name: 'Noisli Background Mixer', desc: 'Mix-and-match background sounds: cafe, rain, typing, fire, birds, trains. Independent volume, timer + mini text editor for writing/coding.' },
    'forest-focus': { name: 'Forest Phone Discipline', desc: 'Plant virtual trees during focus sessions; if you quit early the tree dies. Accumulate coins to plant REAL trees. Anti-procrastination viral app.' },
    'todoist-gtd': { name: 'Todoist Task Manager', desc: 'World-famous GTD app with natural-language date parsing, projects, labels, priorities, recurring rules, Karma and all-device sync.' },
    'ms-todo': { name: 'Microsoft To Do', desc: 'Free Microsoft tasks, deep Outlook, Teams and Office integration. My Day / Planned / Important views — seamless for office workers.' },
    'obsidian-publish': { name: 'Obsidian Knowledge Base', desc: 'Local-first markdown bidirectional-link notes. Plugins and themes galore, great for personal Zettelkasten and product docs.' },
    'roam-research': { name: 'Roam Research Notes', desc: 'The original bi-directional note app. Daily Notes, block-level references and graph view for writers, PMs and researchers.' },
    'duolingo-web': { name: 'Duolingo Languages', desc: 'World\'s #1 free language app. 40+ languages with game-like lessons, streaks, leagues — addictive micro-study every day.' },
    'anki-web': { name: 'Anki Spaced Flashcards', desc: 'The gold standard SRS app. Self-made or shared decks for exams, med, law, language. Scientific forgetting curve reviews, mobile sync.' },
    'grammarly-check': { name: 'Grammarly English Checker', desc: 'The most popular English writing assistant. Grammar, tone, plagiarism, academic checks — essential for writers and translators.' },
    'netease-jianwai': { name: 'NetEase JianWai AI', desc: 'NetEase AI caption translation; bilingual subtitles, audio-to-text, document translation; China fast access with ICP filing.' },
    'deepl-translate': { name: 'DeepL Translator', desc: 'Widely recognized best AI translator; 30+ languages with contextual awareness; formatted document translation included.' },
    'ilovepdf-io': { name: 'iLovePDF Toolkit', desc: 'Top PDF tool worldwide. Merge, split, compress, convert to Word/Excel/PPT/Image, encrypt, watermark, page, rotate, OCR — 24 functions free.' },
    'smallpdf-tools': { name: 'SmallPDF Swiss Knife', desc: 'The Swiss-army PDF kit. 20+ clean, ad-free tools; Google Drive, Dropbox and OneDrive cloud integration, save back to cloud.' },
    'kami-pdf': { name: 'Kami PDF Annotator', desc: 'The favorite K12 PDF annotation app. Highlight, text, voice, signature and draw on PDFs/Word/images; Google Classroom integration.' },
    'lightpdf-cloud': { name: 'LightPDF China Cloud', desc: 'Domestic Chinese PDF cloud. Word/Excel/PPT/JPG/TXT conversion, OCR text recognition, editing, signature, compliant watermark removal.' },
    'carbon-now': { name: 'Carbon Code Screenshots', desc: 'Technical bloggers favorite. Paste code → beautiful syntax-highlighted pics with gradient BG, line numbers, rounded — PNG/SVG export.' },
    'ray-so': { name: 'Ray.so Dreamy Code Shots', desc: 'Glassmorphic code screenshots; sleek gradient frosted backgrounds with themes & drop shadows — fancier sharing images for frontend devs.' },
    'codepen-io': { name: 'CodePen Frontend Playground', desc: 'Largest frontend inspiration community. Live HTML/CSS/JS pens; animations, interactive widgets, CSS art — daily UI inspiration.' },
    'figma-community': { name: 'Figma Community Files', desc: 'The free-design goldmine. 1M+ App UI, dash, illustration, 3D icon, wireframe, DS files — duplicate into Figma and edit.' },
    'dribbble-design': { name: 'Dribbble Design Inspiration', desc: 'Top designer portfolio platform. UI/UX, illustration, motion, branding. Post works to attract freelance client inquiries.' },
    'behance-portfolio': { name: 'Behance Creative Portfolios', desc: 'Adobe creative showcase. Graphic, UI, architecture, photography long-form projects; Adobe Talent connects to premium jobs.' },
    'notion-templates': { name: 'Notion Template Gallery', desc: 'Curated thousands of free Notion templates. OKR, Second Brain, CRM, trip planner, habit tracker, budget — duplicate & go.' },
    'product-hunt': { name: 'Product Hunt Launches', desc: 'The place to discover new products. SaaS, tools, apps, AI launches daily. Indiehackers research competitors and launch here first.' },
    'hunt-webflow': { name: 'Webflow No-Code Builder', desc: 'Designer-first no-code builder. Drag-and-drop, CMS, forms, payments, multilingual, SEO. Freelancers build client sites in days not weeks.' },
  },
  es: {},
  fr: {},
  ar: {},
  hi: {},
};

// 复制英文到西班牙/法语（占位翻译，如果后续需要再精细化），阿拉伯/印度语同理
['es', 'fr'].forEach(lang => {
  localeMap[lang] = { ...localeMap.en };
});
// 阿拉伯语和印地语先用英文版占位（合规安全）
['ar', 'hi'].forEach(lang => {
  localeMap[lang] = { ...localeMap.en };
});

for (const [lang, override] of Object.entries(localeMap)) {
  const filePath = path.join(localeDir, lang, 'translation.json');
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!raw.tools) raw.tools = {};

  newTools.forEach(t => {
    const ov = override[t.id];
    const base = ov ? ov : { name: t.name, desc: t.description };
    raw.tools[t.id] = {
      name: base.name,
      description: base.desc,
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + '\n', 'utf8');
  console.log(`✅ ${lang}/translation.json 写入 ${newTools.length} 个工具翻译`);
}

console.log('\n🎉 全部写入完成！总计:');
console.log(`   tools.ts 追加: ${newTools.length} 条`);
console.log(`   6 语言翻译文件: 全部更新完毕`);
console.log(`   分类分布:`);
const byCat = {};
newTools.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + 1; });
for (const [k, v] of Object.entries(byCat)) {
  console.log(`     ${k}: ${v}`);
}
