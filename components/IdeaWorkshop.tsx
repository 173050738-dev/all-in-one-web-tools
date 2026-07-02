'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Lightbulb,
  ThumbsUp,
  Plus,
  X,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles,
  MessageSquare,
  Send,
  User,
  Mail,
  ArrowLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  Timer,
  Star,
  Code2,
  Briefcase,
  Users,
  Filter,
  ChevronRight,
  Award,
  Zap,
  Handshake,
  Search,
  MapPin,
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal,
  BarChart3,
  ShieldCheck,
  BadgeCheck,
  Heart,
  Share2,
  BookOpen,
  Settings,
  Menu,
} from 'lucide-react';
import { usePreferencesStore, type Idea, type Bid, type Comment, type Developer } from '@/stores/preferences';

export default function IdeaWorkshop({ locale = 'zh' }: { locale?: string }) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'status.pending': '待审核',
      'status.reviewing': '评估中',
      'status.bidding': '招募中',
      'status.developing': '开发中',
      'status.completed': '已完成',
      'status.rejected': '暂不实现',
      'category.all': '全部',
      'category.image-tools': '图片工具',
      'category.ai-tools': 'AI工具',
      'category.lifestyle': '生活娱乐',
      'category.productivity': '效率工具',
      'category.developer-tools': '开发工具',
      'category.other': '其他',
      'skill.css-anim': 'CSS动画',
      'skill.api-integration': 'API集成',
      'skill.ui-design': 'UI设计',
      'skill.responsive': '响应式设计',
      'skill.mobile-dev': '移动端开发',
      'skill.automation': '自动化',
      'skill.data-processing': '数据处理',
      'budget.all': '全部预算',
      'budget.free': '免费',
      'budget.tip': '打赏支持',
      'budget.low': '¥1-100',
      'budget.mid': '¥100-500',
      'budget.high': '¥500+',
      'date.today': '今天',
      'date.yesterday': '昨天',
      'date.daysAgo': '{n}天前',
      'filter.title': '筛选条件',
      'filter.projectStatus': '项目状态',
      'filter.allStatuses': '全部状态',
      'filter.category': '分类',
      'filter.budgetRange': '预算范围',
      'filter.sortBy': '排序方式',
      'sort.newest': '最新发布',
      'sort.mostVotes': '最多点赞',
      'sort.mostBids': '最多投标',
      'card.bids': '投标',
      'card.free': '免费',
      'common.back': '返回',
      'becomeDev.title': '成为开发者',
      'becomeDev.subtitle': '接单赚收益，用技术创造价值',
      'becomeDev.success': '入驻成功！',
      'becomeDev.successSub': '欢迎加入，快去看看有什么需求可以接吧~',
      'becomeDev.nickname': '昵称',
      'becomeDev.nicknamePh': '你的开发者昵称',
      'becomeDev.titleField': '身份/头衔',
      'becomeDev.titlePh': '例如：前端开发工程师 / UI设计师',
      'becomeDev.skills': '擅长技能',
      'becomeDev.skillsPh': '用逗号分隔，如：React, Canvas, AI API',
      'becomeDev.bio': '个人简介',
      'becomeDev.bioPh': '介绍一下自己的经验和擅长的方向~',
      'becomeDev.contact': '联系方式',
      'becomeDev.contactPh': '邮箱/微信，需求方联系你用',
      'becomeDev.contactNote': '🔒 仅在你投标后才会展示给需求方',
      'becomeDev.submit': '立即入驻',
      'devList.back': '返回需求大厅',
      'devList.title': '开发者广场',
      'devList.subtitle': '发现优秀开发者，找到最适合你的合作伙伴',
      'devList.projects': '项目',
      'devList.contact': '联系',
      'detail.back': '返回列表',
      'detail.anonymous': '匿名用户',
      'detail.bidBtn': '我要投标',
      'detail.bidSubmitTitle': '提交投标',
      'detail.bidSuccess': '投标成功！',
      'detail.bidSuccessSub': '等待需求方确认~',
      'detail.bidProposal': '你的方案',
      'detail.bidProposalPh': '说说你的实现思路、技术方案，越详细越容易中标~',
      'detail.bidPrice': '报价',
      'detail.bidPricePh': '如：免费 / 50元',
      'detail.bidDelivery': '交付时间',
      'detail.bidDeliveryPh': '如：3天 / 一周',
      'detail.bidSubmit': '提交投标',
      'detail.bidList': '投标列表',
      'detail.bidAccepted': '已中标',
      'detail.accept': '选中',
      'detail.reject': '拒绝',
      'detail.discussion': '讨论区',
      'detail.discussionPh': '说点什么...',
      'detail.discussionEmpty': '暂无讨论，来说两句吧~',
      'detail.developerBadge': '开发者',
      'detail.overview': '项目概况',
      'detail.budget': '预算',
      'detail.deadline': '期望时间',
      'detail.bidCount': '投标数',
      'detail.voteCount': '关注数',
      'detail.assignedDev': '承接开发者',
      'detail.assignedNote': '已承接开发',
      'detail.safety': '安全保障',
      'detail.safety1': '平台审核，确保需求真实有效',
      'detail.safety2': '开发者实名认证，靠谱有保障',
      'detail.safety3': '全程沟通记录，有据可查',
      'hero.searchPh': '搜索需求关键词，如：PPT制作、图片压缩、AI翻译...',
      'hero.titleDev': '💼 发现需求，接单赚收益',
      'hero.titleUser': '🛠️ 工具需求大厅',
      'hero.subtitleDev': '浏览需求池，找到适合你的项目，用技术创造价值',
      'hero.subtitleUser': '想要的工具找不到？发布需求，开发者帮你实现',
      'hero.postNeed': '发布需求',
      'hero.devMode': '开发者模式',
      'hero.joinDev': '开发者入驻',
      'hero.findDev': '找开发者',
      'stats.total': '总需求数',
      'stats.bidding': '招募中',
      'stats.completed': '已完成',
      'stats.developers': '开发者',
      'mobile.filter': '筛选',
      'list.resultCount': '共',
      'list.resultCount2': '个需求',
      'list.sortLabel': '排序：',
      'list.emptyTitle': '暂无匹配的需求',
      'list.emptySub': '换个筛选条件试试，或者发布第一个需求吧~',
      'form.title': '发布工具需求',
      'form.success': '发布成功！',
      'form.successSub': '开发者们会很快看到你的需求~',
      'form.needTitle': '需求标题',
      'form.needTitlePh': '一句话描述你想要什么工具',
      'form.description': '详细描述',
      'form.descriptionPh': '描述一下这个工具的功能、使用场景，越详细越容易被开发者看到哦~',
      'form.category': '分类',
      'form.budget': '预算',
      'form.budgetPh': '免费 / 打赏 / 金额',
      'form.deadline': '期望完成时间',
      'form.deadlinePh': '选填，如：一周内 / 越快越好',
      'form.yourNickname': '你的昵称',
      'form.yourNicknamePh': '选填，默认为"匿名用户"',
      'form.contact': '联系方式',
      'form.contactPh': '选填，开发者中标后可以联系你',
      'form.contactNote': '🔒 仅在开发者投标后可见，不会公开',
      'form.submit': '发布需求',
      'default.budget': '免费',
      'default.bidPrice': '免费 / 打赏支持',
      'default.bidDelivery': '7天',
      'filter.contains.free': '免费',
      'filter.contains.tip': '打赏',
    },
    en: {
      'status.pending': 'Pending Review',
      'status.reviewing': 'Under Review',
      'status.bidding': 'Recruiting',
      'status.developing': 'In Development',
      'status.completed': 'Completed',
      'status.rejected': 'Not Planned',
      'category.all': 'All',
      'category.image-tools': 'Image Tools',
      'category.ai-tools': 'AI Tools',
      'category.lifestyle': 'Lifestyle & Entertainment',
      'category.productivity': 'Productivity',
      'category.developer-tools': 'Developer Tools',
      'category.other': 'Other',
      'skill.css-anim': 'CSS Animation',
      'skill.api-integration': 'API Integration',
      'skill.ui-design': 'UI Design',
      'skill.responsive': 'Responsive Design',
      'skill.mobile-dev': 'Mobile Development',
      'skill.automation': 'Automation',
      'skill.data-processing': 'Data Processing',
      'budget.all': 'All Budgets',
      'budget.free': 'Free',
      'budget.tip': 'Tip Support',
      'budget.low': '$1-15',
      'budget.mid': '$15-70',
      'budget.high': '$70+',
      'date.today': 'Today',
      'date.yesterday': 'Yesterday',
      'date.daysAgo': '{n}d ago',
      'filter.title': 'Filters',
      'filter.projectStatus': 'Project Status',
      'filter.allStatuses': 'All Statuses',
      'filter.category': 'Category',
      'filter.budgetRange': 'Budget Range',
      'filter.sortBy': 'Sort By',
      'sort.newest': 'Newest First',
      'sort.mostVotes': 'Most Liked',
      'sort.mostBids': 'Most Bids',
      'card.bids': 'Bids',
      'card.free': 'Free',
      'common.back': 'Back',
      'becomeDev.title': 'Become a Developer',
      'becomeDev.subtitle': 'Take orders and earn with your skills',
      'becomeDev.success': 'Welcome aboard!',
      'becomeDev.successSub': 'Great to have you — go check out available projects!',
      'becomeDev.nickname': 'Display Name',
      'becomeDev.nicknamePh': 'Your developer nickname',
      'becomeDev.titleField': 'Title / Role',
      'becomeDev.titlePh': 'e.g. Frontend Engineer / UI Designer',
      'becomeDev.skills': 'Skills',
      'becomeDev.skillsPh': 'Comma separated, e.g. React, Canvas, AI API',
      'becomeDev.bio': 'Bio',
      'becomeDev.bioPh': 'Tell us about your experience and strengths~',
      'becomeDev.contact': 'Contact',
      'becomeDev.contactPh': 'Email / WeChat, for clients to reach you',
      'becomeDev.contactNote': '🔒 Only visible to requesters after you bid',
      'becomeDev.submit': 'Join Now',
      'devList.back': 'Back to Hall',
      'devList.title': 'Developer Plaza',
      'devList.subtitle': 'Discover talented developers for your project',
      'devList.projects': 'Projects',
      'devList.contact': 'Contact',
      'detail.back': 'Back to List',
      'detail.anonymous': 'Anonymous',
      'detail.bidBtn': 'Place a Bid',
      'detail.bidSubmitTitle': 'Submit Bid',
      'detail.bidSuccess': 'Bid submitted!',
      'detail.bidSuccessSub': 'Waiting for requester confirmation~',
      'detail.bidProposal': 'Your Proposal',
      'detail.bidProposalPh': 'Describe your approach and tech stack — detail wins bids!',
      'detail.bidPrice': 'Price',
      'detail.bidPricePh': 'e.g. Free / $50',
      'detail.bidDelivery': 'Delivery Time',
      'detail.bidDeliveryPh': 'e.g. 3 days / 1 week',
      'detail.bidSubmit': 'Submit Bid',
      'detail.bidList': 'Bids',
      'detail.bidAccepted': 'Awarded',
      'detail.accept': 'Accept',
      'detail.reject': 'Reject',
      'detail.discussion': 'Discussion',
      'detail.discussionPh': 'Say something...',
      'detail.discussionEmpty': 'No comments yet. Be the first to speak!',
      'detail.developerBadge': 'Developer',
      'detail.overview': 'Project Overview',
      'detail.budget': 'Budget',
      'detail.deadline': 'Expected Timeline',
      'detail.bidCount': 'Bids',
      'detail.voteCount': 'Followers',
      'detail.assignedDev': 'Assigned Developer',
      'detail.assignedNote': 'Currently developing',
      'detail.safety': 'Safety & Guarantees',
      'detail.safety1': 'Platform-verified, genuine requirements only',
      'detail.safety2': 'Developers are identity-verified and reliable',
      'detail.safety3': 'Full communication records for reference',
      'hero.searchPh': 'Search needs: PPT maker, image compressor, AI translator...',
      'hero.titleDev': '💼 Discover projects, earn with your skills',
      'hero.titleUser': '🛠️ Tool Needs Hall',
      'hero.subtitleDev': 'Browse the pool and find projects matching your expertise',
      'hero.subtitleUser': "Can't find the tool you want? Post a need, let devs build it",
      'hero.postNeed': 'Post Need',
      'hero.devMode': 'Developer Mode',
      'hero.joinDev': 'Join as Dev',
      'hero.findDev': 'Find Devs',
      'stats.total': 'Total Needs',
      'stats.bidding': 'Recruiting',
      'stats.completed': 'Completed',
      'stats.developers': 'Developers',
      'mobile.filter': 'Filter',
      'list.resultCount': '',
      'list.resultCount2': 'needs',
      'list.sortLabel': 'Sort:',
      'list.emptyTitle': 'No matching needs',
      'list.emptySub': 'Try different filters, or post the first need!',
      'form.title': 'Post a Tool Need',
      'form.success': 'Posted successfully!',
      'form.successSub': 'Developers will see your need shortly~',
      'form.needTitle': 'Need Title',
      'form.needTitlePh': 'One sentence describing the tool you want',
      'form.description': 'Detailed Description',
      'form.descriptionPh': 'Describe features and use cases — more detail = more dev interest!',
      'form.category': 'Category',
      'form.budget': 'Budget',
      'form.budgetPh': 'Free / Tip / Amount',
      'form.deadline': 'Expected Completion',
      'form.deadlinePh': 'Optional, e.g. Within a week / ASAP',
      'form.yourNickname': 'Your Nickname',
      'form.yourNicknamePh': 'Optional, defaults to "Anonymous"',
      'form.contact': 'Contact Info',
      'form.contactPh': 'Optional, devs can reach you after winning the bid',
      'form.contactNote': '🔒 Only visible to bidding devs, never public',
      'form.submit': 'Post Need',
      'default.budget': 'Free',
      'default.bidPrice': 'Free / Tip Support',
      'default.bidDelivery': '7 days',
      'filter.contains.free': 'Free',
      'filter.contains.tip': 'Tip',
    },
    hi: {
      'status.pending': 'समीक्षा लंबित',
      'status.reviewing': 'मूल्यांकन हो रहा है',
      'status.bidding': 'भर्ती चल रही है',
      'status.developing': 'विकासाधीन',
      'status.completed': 'पूर्ण हुआ',
      'status.rejected': 'अभी नहीं',
      'category.all': 'सभी',
      'category.image-tools': 'इमेज टूल्स',
      'category.ai-tools': 'AI टूल्स',
      'category.lifestyle': 'जीवनशैली और मनोरंजन',
      'category.productivity': 'उत्पादकता',
      'category.developer-tools': 'डेवलपर टूल्स',
      'category.other': 'अन्य',
      'skill.css-anim': 'CSS एनीमेशन',
      'skill.api-integration': 'API एकीकरण',
      'skill.ui-design': 'UI डिज़ाइन',
      'skill.responsive': 'रेस्पॉन्सिव डिज़ाइन',
      'skill.mobile-dev': 'मोबाइल डेवलपमेंट',
      'skill.automation': 'ऑटोमेशन',
      'skill.data-processing': 'डेटा प्रोसेसिंग',
      'budget.all': 'सभी बजट',
      'budget.free': 'निःशुल्क',
      'budget.tip': 'टिप सहायता',
      'budget.low': '₹80-8,000',
      'budget.mid': '₹8,000-40,000',
      'budget.high': '₹40,000+',
      'date.today': 'आज',
      'date.yesterday': 'कल',
      'date.daysAgo': '{n} दिन पहले',
      'filter.title': 'फ़िल्टर',
      'filter.projectStatus': 'परियोजना स्थिति',
      'filter.allStatuses': 'सभी स्थितियाँ',
      'filter.category': 'श्रेणी',
      'filter.budgetRange': 'बजट सीमा',
      'filter.sortBy': 'क्रमबद्ध करें',
      'sort.newest': 'नवीनतम पहले',
      'sort.mostVotes': 'सबसे ज़्यादा पसंद',
      'sort.mostBids': 'सबसे ज़्यादा बोली',
      'card.bids': 'बोलियाँ',
      'card.free': 'निःशुल्क',
      'common.back': 'वापस',
      'becomeDev.title': 'डेवलपर बनें',
      'becomeDev.subtitle': 'ऑर्डर लें और अपनी तकनीक से कमाएँ',
      'becomeDev.success': 'स्वागत है!',
      'becomeDev.successSub': 'आपका स्वागत है — उपलब्ध परियोजनाएँ देखें!',
      'becomeDev.nickname': 'नाम',
      'becomeDev.nicknamePh': 'आपका डेवलपर नाम',
      'becomeDev.titleField': 'पद / भूमिका',
      'becomeDev.titlePh': 'जैसे: फ्रंटएंड इंजीनियर / UI डिज़ाइनर',
      'becomeDev.skills': 'कौशल',
      'becomeDev.skillsPh': 'अल्पविराम से अलग, जैसे: React, Canvas, AI API',
      'becomeDev.bio': 'परिचय',
      'becomeDev.bioPh': 'अपने अनुभव और विशेषज्ञता के बारे में बताएँ~',
      'becomeDev.contact': 'संपर्क',
      'becomeDev.contactPh': 'ईमेल / वीचैट, ग्राहक संपर्क के लिए',
      'becomeDev.contactNote': '🔒 केवल बोली लगाने के बाद ग्राहक को दिखाई देगा',
      'becomeDev.submit': 'अभी जुड़ें',
      'devList.back': 'हॉल पर वापस',
      'devList.title': 'डेवलपर प्लाज़ा',
      'devList.subtitle': 'अपनी परियोजना के लिए प्रतिभाशाली डेवलपर खोजें',
      'devList.projects': 'परियोजनाएँ',
      'devList.contact': 'संपर्क',
      'detail.back': 'सूची पर वापस',
      'detail.anonymous': 'अनाम',
      'detail.bidBtn': 'बोली लगाएँ',
      'detail.bidSubmitTitle': 'बोली सबमिट करें',
      'detail.bidSuccess': 'बोली सबमिट हुई!',
      'detail.bidSuccessSub': 'ग्राहक की पुष्टि का इंतज़ार~',
      'detail.bidProposal': 'आपका प्रस्ताव',
      'detail.bidProposalPh': 'अपना दृष्टिकोण बताएँ — विस्तार बोली जीतता है!',
      'detail.bidPrice': 'मूल्य',
      'detail.bidPricePh': 'जैसे: निःशुल्क / $50',
      'detail.bidDelivery': 'डिलीवरी समय',
      'detail.bidDeliveryPh': 'जैसे: 3 दिन / 1 सप्ताह',
      'detail.bidSubmit': 'बोली सबमिट करें',
      'detail.bidList': 'बोलियाँ',
      'detail.bidAccepted': 'चुना गया',
      'detail.accept': 'स्वीकारें',
      'detail.reject': 'अस्वीकारें',
      'detail.discussion': 'चर्चा',
      'detail.discussionPh': 'कुछ कहें...',
      'detail.discussionEmpty': 'अभी कोई टिप्पणी नहीं। पहले व्यक्ति बनें!',
      'detail.developerBadge': 'डेवलपर',
      'detail.overview': 'परियोजना अवलोकन',
      'detail.budget': 'बजट',
      'detail.deadline': 'अपेक्षित समय',
      'detail.bidCount': 'बोलियाँ',
      'detail.voteCount': 'अनुयायी',
      'detail.assignedDev': 'असाइन किया गया डेवलपर',
      'detail.assignedNote': 'वर्तमान में विकसित हो रहा है',
      'detail.safety': 'सुरक्षा और गारंटी',
      'detail.safety1': 'प्लेटफ़ॉर्म सत्यापित, वास्तविक आवश्यकताएँ',
      'detail.safety2': 'डेवलपर पहचान-सत्यापित और भरोसेमंद',
      'detail.safety3': 'संपूर्ण संचार रिकॉर्ड सुरक्षित',
      'hero.searchPh': 'खोजें: PPT मेकर, इमेज कंप्रेसर, AI अनुवादक...',
      'hero.titleDev': '💼 परियोजनाएँ खोजें, अपने कौशल से कमाएँ',
      'hero.titleUser': '🛠️ टूल नीड्स हॉल',
      'hero.subtitleDev': 'पूल ब्राउज़ करें और अपनी विशेषज्ञता के अनुरूप प्रोजेक्ट पाएँ',
      'hero.subtitleUser': 'अपनी इच्छा का टूल नहीं मिला? आवश्यकता पोस्ट करें, डेवलपर बनाएँगे',
      'hero.postNeed': 'आवश्यकता पोस्ट करें',
      'hero.devMode': 'डेवलपर मोड',
      'hero.joinDev': 'डेवलपर बनें',
      'hero.findDev': 'डेवलपर खोजें',
      'stats.total': 'कुल आवश्यकताएँ',
      'stats.bidding': 'भर्ती चल रही है',
      'stats.completed': 'पूर्ण हुआ',
      'stats.developers': 'डेवलपर्स',
      'mobile.filter': 'फ़िल्टर',
      'list.resultCount': '',
      'list.resultCount2': 'आवश्यकताएँ',
      'list.sortLabel': 'क्रम:',
      'list.emptyTitle': 'कोई मेल खाती आवश्यकता नहीं',
      'list.emptySub': 'अलग फ़िल्टर आज़माएँ, या पहली आवश्यकता पोस्ट करें!',
      'form.title': 'टूल आवश्यकता पोस्ट करें',
      'form.success': 'सफलतापूर्वक पोस्ट किया गया!',
      'form.successSub': 'डेवलपर जल्द ही आपकी आवश्यकता देखेंगे~',
      'form.needTitle': 'आवश्यकता शीर्षक',
      'form.needTitlePh': 'एक वाक्य में वांछित टूल का वर्णन करें',
      'form.description': 'विस्तृत विवरण',
      'form.descriptionPh': 'सुविधाओं और उपयोग के बारे में बताएँ — विस्तार = अधिक डेवलपर रुचि!',
      'form.category': 'श्रेणी',
      'form.budget': 'बजट',
      'form.budgetPh': 'निःशुल्क / टिप / राशि',
      'form.deadline': 'अपेक्षित पूर्णता',
      'form.deadlinePh': 'वैकल्पिक, जैसे: एक सप्ताह के भीतर / जल्द से जल्द',
      'form.yourNickname': 'आपका नाम',
      'form.yourNicknamePh': 'वैकल्पिक, डिफ़ॉल्ट "अनाम"',
      'form.contact': 'संपर्क जानकारी',
      'form.contactPh': 'वैकल्पिक, बोली जीतने पर डेवलपर संपर्क कर सकता है',
      'form.contactNote': '🔒 केवल बोली लगाने वाले डेवलपर को दिखाई देगा, कभी सार्वजनिक नहीं',
      'form.submit': 'आवश्यकता पोस्ट करें',
      'default.budget': 'निःशुल्क',
      'default.bidPrice': 'निःशुल्क / टिप सहायता',
      'default.bidDelivery': '7 दिन',
      'filter.contains.free': 'निःशुल्क',
      'filter.contains.tip': 'टिप',
    },
    fr: {
      'status.pending': 'En attente',
      'status.reviewing': 'En évaluation',
      'status.bidding': 'Recrutement',
      'status.developing': 'En développement',
      'status.completed': 'Terminé',
      'status.rejected': 'Non prévu',
      'category.all': 'Tout',
      'category.image-tools': 'Outils Image',
      'category.ai-tools': 'Outils IA',
      'category.lifestyle': 'Lifestyle & Divertissement',
      'category.productivity': 'Productivité',
      'category.developer-tools': 'Outils Dev',
      'category.other': 'Autre',
      'skill.css-anim': 'Animation CSS',
      'skill.api-integration': 'Intégration API',
      'skill.ui-design': 'Design UI',
      'skill.responsive': 'Design Responsive',
      'skill.mobile-dev': 'Dev Mobile',
      'skill.automation': 'Automatisation',
      'skill.data-processing': 'Traitement de Données',
      'budget.all': 'Tous les budgets',
      'budget.free': 'Gratuit',
      'budget.tip': 'Pourboire',
      'budget.low': '1€-14€',
      'budget.mid': '14€-65€',
      'budget.high': '65€+',
      'date.today': "Aujourd'hui",
      'date.yesterday': 'Hier',
      'date.daysAgo': 'il y a {n}j',
      'filter.title': 'Filtres',
      'filter.projectStatus': 'Statut du projet',
      'filter.allStatuses': 'Tous les statuts',
      'filter.category': 'Catégorie',
      'filter.budgetRange': 'Budget',
      'filter.sortBy': 'Trier par',
      'sort.newest': 'Plus récents',
      'sort.mostVotes': 'Plus aimés',
      'sort.mostBids': 'Plus d’offres',
      'card.bids': 'Offres',
      'card.free': 'Gratuit',
      'common.back': 'Retour',
      'becomeDev.title': 'Devenir Développeur',
      'becomeDev.subtitle': 'Acceptez des missions et gagnez avec vos compétences',
      'becomeDev.success': 'Bienvenue !',
      'becomeDev.successSub': 'Ravi de vous compter parmi nous — allez voir les projets !',
      'becomeDev.nickname': "Nom d'affichage",
      'becomeDev.nicknamePh': 'Votre pseudo développeur',
      'becomeDev.titleField': 'Titre / Rôle',
      'becomeDev.titlePh': 'ex: Ingénieur Frontend / Designer UI',
      'becomeDev.skills': 'Compétences',
      'becomeDev.skillsPh': 'Séparées par virgule, ex: React, Canvas, API IA',
      'becomeDev.bio': 'Bio',
      'becomeDev.bioPh': 'Parlez-nous de votre expérience et atouts~',
      'becomeDev.contact': 'Contact',
      'becomeDev.contactPh': 'Email / WeChat, pour que les clients vous joignent',
      'becomeDev.contactNote': '🔒 Visible uniquement des demandeurs après votre offre',
      'becomeDev.submit': 'Rejoindre',
      'devList.back': 'Retour au Hall',
      'devList.title': 'Place aux Développeurs',
      'devList.subtitle': 'Trouvez des développeurs talentueux pour votre projet',
      'devList.projects': 'Projets',
      'devList.contact': 'Contacter',
      'detail.back': 'Retour à la liste',
      'detail.anonymous': 'Anonyme',
      'detail.bidBtn': 'Faire une offre',
      'detail.bidSubmitTitle': 'Soumettre l’offre',
      'detail.bidSuccess': 'Offre envoyée !',
      'detail.bidSuccessSub': 'En attente de confirmation du demandeur~',
      'detail.bidProposal': 'Votre Proposition',
      'detail.bidProposalPh': 'Décrivez votre approche — le détail remporte les offres !',
      'detail.bidPrice': 'Prix',
      'detail.bidPricePh': 'ex: Gratuit / 50€',
      'detail.bidDelivery': 'Délai de livraison',
      'detail.bidDeliveryPh': 'ex: 3 jours / 1 semaine',
      'detail.bidSubmit': 'Envoyer l’offre',
      'detail.bidList': 'Offres',
      'detail.bidAccepted': 'Sélectionné',
      'detail.accept': 'Accepter',
      'detail.reject': 'Refuser',
      'detail.discussion': 'Discussion',
      'detail.discussionPh': 'Dites quelque chose...',
      'detail.discussionEmpty': 'Aucun commentaire. Soyez le premier !',
      'detail.developerBadge': 'Développeur',
      'detail.overview': 'Aperçu du Projet',
      'detail.budget': 'Budget',
      'detail.deadline': 'Délai attendu',
      'detail.bidCount': 'Offres',
      'detail.voteCount': 'Abonnés',
      'detail.assignedDev': 'Développeur Assigné',
      'detail.assignedNote': 'En cours de développement',
      'detail.safety': 'Sécurité & Garanties',
      'detail.safety1': 'Vérifiés par la plateforme, demandes authentiques',
      'detail.safety2': 'Développeurs vérifiés et fiables',
      'detail.safety3': 'Historique complet des échanges conservé',
      'hero.searchPh': 'Rechercher: créateur PPT, compresseur image, traducteur IA...',
      'hero.titleDev': '💼 Trouvez des projets, gagnez avec vos compétences',
      'hero.titleUser': '🛠️ Hall des Besoins d’Outils',
      'hero.subtitleDev': 'Parcourez le pool et trouvez des projets à votre mesure',
      'hero.subtitleUser': "Outil introuvable? Postez un besoin, laissez les devs le créer",
      'hero.postNeed': 'Poster un Besoin',
      'hero.devMode': 'Mode Développeur',
      'hero.joinDev': 'Rejoindre Dev',
      'hero.findDev': 'Trouver des Devs',
      'stats.total': 'Besoins Totaux',
      'stats.bidding': 'Recrutement',
      'stats.completed': 'Terminés',
      'stats.developers': 'Développeurs',
      'mobile.filter': 'Filtrer',
      'list.resultCount': '',
      'list.resultCount2': 'besoins',
      'list.sortLabel': 'Trier :',
      'list.emptyTitle': 'Aucun besoin correspondant',
      'list.emptySub': 'Essayez d’autres filtres, ou postez le premier besoin !',
      'form.title': 'Poster un Besoin d’Outil',
      'form.success': 'Posté avec succès !',
      'form.successSub': 'Les développeurs verront votre besoin sous peu~',
      'form.needTitle': 'Titre du besoin',
      'form.needTitlePh': 'Une phrase décrivant l’outil souhaité',
      'form.description': 'Description détaillée',
      'form.descriptionPh': 'Fonctionnalités, cas d’usage — plus de détails = plus d’intérêt !',
      'form.category': 'Catégorie',
      'form.budget': 'Budget',
      'form.budgetPh': 'Gratuit / Pourboire / Montant',
      'form.deadline': 'Livraison attendue',
      'form.deadlinePh': 'Optionnel, ex: Sous une semaine / Dès que possible',
      'form.yourNickname': 'Votre pseudo',
      'form.yourNicknamePh': 'Optionnel, "Anonyme" par défaut',
      'form.contact': 'Contact',
      'form.contactPh': 'Optionnel, les devs vous joignent après attribution',
      'form.contactNote': '🔒 Visible uniquement des devs ayant fait une offre, jamais public',
      'form.submit': 'Poster le Besoin',
      'default.budget': 'Gratuit',
      'default.bidPrice': 'Gratuit / Pourboire',
      'default.bidDelivery': '7 jours',
      'filter.contains.free': 'Gratuit',
      'filter.contains.tip': 'Pourboire',
    },
    es: {
      'status.pending': 'Pendiente',
      'status.reviewing': 'En Evaluación',
      'status.bidding': 'Reclutando',
      'status.developing': 'En Desarrollo',
      'status.completed': 'Completado',
      'status.rejected': 'No Planeado',
      'category.all': 'Todo',
      'category.image-tools': 'Herramientas Imagen',
      'category.ai-tools': 'Herramientas IA',
      'category.lifestyle': 'Estilo y Entretenimiento',
      'category.productivity': 'Productividad',
      'category.developer-tools': 'Herramientas Dev',
      'category.other': 'Otro',
      'skill.css-anim': 'Animación CSS',
      'skill.api-integration': 'Integración API',
      'skill.ui-design': 'Diseño UI',
      'skill.responsive': 'Diseño Responsive',
      'skill.mobile-dev': 'Dev Móvil',
      'skill.automation': 'Automatización',
      'skill.data-processing': 'Procesamiento de Datos',
      'budget.all': 'Todos los Presupuestos',
      'budget.free': 'Gratis',
      'budget.tip': 'Propina',
      'budget.low': '1€-14€',
      'budget.mid': '14€-65€',
      'budget.high': '65€+',
      'date.today': 'Hoy',
      'date.yesterday': 'Ayer',
      'date.daysAgo': 'hace {n}d',
      'filter.title': 'Filtros',
      'filter.projectStatus': 'Estado del Proyecto',
      'filter.allStatuses': 'Todos los Estados',
      'filter.category': 'Categoría',
      'filter.budgetRange': 'Rango de Presupuesto',
      'filter.sortBy': 'Ordenar por',
      'sort.newest': 'Más Recientes',
      'sort.mostVotes': 'Más Gustados',
      'sort.mostBids': 'Más Ofertas',
      'card.bids': 'Ofertas',
      'card.free': 'Gratis',
      'common.back': 'Volver',
      'becomeDev.title': 'Ser Desarrollador',
      'becomeDev.subtitle': 'Acepta pedidos y gana con tu talento',
      'becomeDev.success': '¡Bienvenido!',
      'becomeDev.successSub': '¡Qué alegría tenerte — mira los proyectos disponibles!',
      'becomeDev.nickname': 'Nombre Visible',
      'becomeDev.nicknamePh': 'Tu nick de desarrollador',
      'becomeDev.titleField': 'Título / Rol',
      'becomeDev.titlePh': 'ej: Ingeniero Frontend / Diseñador UI',
      'becomeDev.skills': 'Habilidades',
      'becomeDev.skillsPh': 'Separadas por coma, ej: React, Canvas, API IA',
      'becomeDev.bio': 'Biografía',
      'becomeDev.bioPh': 'Cuéntanos tu experiencia y puntos fuertes~',
      'becomeDev.contact': 'Contacto',
      'becomeDev.contactPh': 'Email / WeChat, para que los clientes te contacten',
      'becomeDev.contactNote': '🔒 Solo visible para solicitantes después de tu oferta',
      'becomeDev.submit': 'Unirse Ahora',
      'devList.back': 'Volver al Hall',
      'devList.title': 'Plaza de Desarrolladores',
      'devList.subtitle': 'Encuentra desarrolladores talentosos para tu proyecto',
      'devList.projects': 'Proyectos',
      'devList.contact': 'Contactar',
      'detail.back': 'Volver a la Lista',
      'detail.anonymous': 'Anónimo',
      'detail.bidBtn': 'Hacer una Oferta',
      'detail.bidSubmitTitle': 'Enviar Oferta',
      'detail.bidSuccess': '¡Oferta enviada!',
      'detail.bidSuccessSub': 'Esperando confirmación del solicitante~',
      'detail.bidProposal': 'Tu Propuesta',
      'detail.bidProposalPh': 'Describe tu enfoque — ¡el detalle gana ofertas!',
      'detail.bidPrice': 'Precio',
      'detail.bidPricePh': 'ej: Gratis / 50€',
      'detail.bidDelivery': 'Tiempo de Entrega',
      'detail.bidDeliveryPh': 'ej: 3 días / 1 semana',
      'detail.bidSubmit': 'Enviar Oferta',
      'detail.bidList': 'Ofertas',
      'detail.bidAccepted': 'Adjudicado',
      'detail.accept': 'Aceptar',
      'detail.reject': 'Rechazar',
      'detail.discussion': 'Discusión',
      'detail.discussionPh': 'Di algo...',
      'detail.discussionEmpty': 'Sin comentarios. ¡Sé el primero!',
      'detail.developerBadge': 'Desarrollador',
      'detail.overview': 'Resumen del Proyecto',
      'detail.budget': 'Presupuesto',
      'detail.deadline': 'Plazo Esperado',
      'detail.bidCount': 'Ofertas',
      'detail.voteCount': 'Seguidores',
      'detail.assignedDev': 'Desarrollador Asignado',
      'detail.assignedNote': 'En desarrollo',
      'detail.safety': 'Seguridad y Garantías',
      'detail.safety1': 'Verificados por plataforma, solicitudes auténticas',
      'detail.safety2': 'Desarrolladores verificados y confiables',
      'detail.safety3': 'Historial completo de comunicaciones conservado',
      'hero.searchPh': 'Buscar: creador PPT, compresor imagen, traductor IA...',
      'hero.titleDev': '💼 Encuentra proyectos, gana con tus habilidades',
      'hero.titleUser': '🛠️ Hall de Necesidades',
      'hero.subtitleDev': 'Explora y encuentra proyectos acorde a tu expertise',
      'hero.subtitleUser': '¿No encuentras la herramienta? Publica una necesidad, déjala a los devs',
      'hero.postNeed': 'Publicar Necesidad',
      'hero.devMode': 'Modo Desarrollador',
      'hero.joinDev': 'Unirse como Dev',
      'hero.findDev': 'Buscar Devs',
      'stats.total': 'Necesidades Totales',
      'stats.bidding': 'Reclutando',
      'stats.completed': 'Completados',
      'stats.developers': 'Desarrolladores',
      'mobile.filter': 'Filtrar',
      'list.resultCount': '',
      'list.resultCount2': 'necesidades',
      'list.sortLabel': 'Ordenar:',
      'list.emptyTitle': 'Ninguna necesidad coincide',
      'list.emptySub': '¡Prueba otros filtros o publica la primera necesidad!',
      'form.title': 'Publicar Necesidad de Herramienta',
      'form.success': '¡Publicado con éxito!',
      'form.successSub': 'Los desarrolladores verán tu necesidad pronto~',
      'form.needTitle': 'Título de la Necesidad',
      'form.needTitlePh': 'Una frase describiendo la herramienta que quieres',
      'form.description': 'Descripción Detallada',
      'form.descriptionPh': 'Funciones, casos de uso — ¡más detalle = más interés!',
      'form.category': 'Categoría',
      'form.budget': 'Presupuesto',
      'form.budgetPh': 'Gratis / Propina / Cantidad',
      'form.deadline': 'Entrega Esperada',
      'form.deadlinePh': 'Opcional, ej: En una semana / Cuanto antes',
      'form.yourNickname': 'Tu Nick',
      'form.yourNicknamePh': 'Opcional, "Anónimo" por defecto',
      'form.contact': 'Info de Contacto',
      'form.contactPh': 'Opcional, los devs te contactan tras adjudicación',
      'form.contactNote': '🔒 Solo visible para devs con oferta, nunca público',
      'form.submit': 'Publicar Necesidad',
      'default.budget': 'Gratis',
      'default.bidPrice': 'Gratis / Propina',
      'default.bidDelivery': '7 días',
      'filter.contains.free': 'Gratis',
      'filter.contains.tip': 'Propina',
    },
    ar: {
      'status.pending': 'قيد المراجعة',
      'status.reviewing': 'قيد التقييم',
      'status.bidding': 'قيد التوظيف',
      'status.developing': 'قيد التطوير',
      'status.completed': 'مكتمل',
      'status.rejected': 'غير مخطط له',
      'category.all': 'الكل',
      'category.image-tools': 'أدوات الصور',
      'category.ai-tools': 'أدوات الذكاء الاصطناعي',
      'category.lifestyle': 'نمط الحياة والترفيه',
      'category.productivity': 'الإنتاجية',
      'category.developer-tools': 'أدوات المطور',
      'category.other': 'أخرى',
      'skill.css-anim': 'تحريك CSS',
      'skill.api-integration': 'تكامل واجهات برمجة التطبيقات',
      'skill.ui-design': 'تصميم واجهة المستخدم',
      'skill.responsive': 'تصميم متجاوب',
      'skill.mobile-dev': 'تطوير الهاتف',
      'skill.automation': 'التشغيل الآلي',
      'skill.data-processing': 'معالجة البيانات',
      'budget.all': 'جميع الميزانيات',
      'budget.free': 'مجاني',
      'budget.tip': 'دعم بالبقشيش',
      'budget.low': '40-4000 ر.س',
      'budget.mid': '4000-20000 ر.س',
      'budget.high': '+20000 ر.س',
      'date.today': 'اليوم',
      'date.yesterday': 'أمس',
      'date.daysAgo': 'قبل {n}ي',
      'filter.title': 'الفلاتر',
      'filter.projectStatus': 'حالة المشروع',
      'filter.allStatuses': 'جميع الحالات',
      'filter.category': 'الفئة',
      'filter.budgetRange': 'نطاق الميزانية',
      'filter.sortBy': 'ترتيب حسب',
      'sort.newest': 'الأحدث أولاً',
      'sort.mostVotes': 'الأكثر إعجاباً',
      'sort.mostBids': 'أكثر العروض',
      'card.bids': 'العروض',
      'card.free': 'مجاني',
      'common.back': 'رجوع',
      'becomeDev.title': 'كن مطوراً',
      'becomeDev.subtitle': 'اقبل الطلبات واكسب بأكفائك',
      'becomeDev.success': '!أهلاً بك',
      'becomeDev.successSub': '!يسعدنا انضمامك — انظر إلى المشاريع المتاحة',
      'becomeDev.nickname': 'اسم العرض',
      'becomeDev.nicknamePh': 'لقب المطور الخاص بك',
      'becomeDev.titleField': 'المسمى / الدور',
      'becomeDev.titlePh': 'مثال: مهندس الواجهة / مصمم واجهة المستخدم',
      'becomeDev.skills': 'المهارات',
      'becomeDev.skillsPh': 'مفصولة بفواصل، مثال: React، Canvas، واجهات برمجة التطبيقات الذكية',
      'becomeDev.bio': 'نبذة شخصية',
      'becomeDev.bioPh': '~أخبرنا عن خبرتك ونقاط قوتك',
      'becomeDev.contact': 'التواصل',
      'becomeDev.contactPh': 'البريد الإلكتروني / الواتساب، للتواصل مع العملاء',
      'becomeDev.contactNote': '🔒 مرئي فقط للطالبين بعد تقديم عرضك',
      'becomeDev.submit': 'انضم الآن',
      'devList.back': 'العودة إلى القاعة',
      'devList.title': 'ساحة المطورين',
      'devList.subtitle': 'اكتشف مطورين موهوبين لمشروعك',
      'devList.projects': 'مشاريع',
      'devList.contact': 'تواصل',
      'detail.back': 'العودة إلى القائمة',
      'detail.anonymous': 'مجهول',
      'detail.bidBtn': 'تقديم عرض',
      'detail.bidSubmitTitle': 'إرسال العرض',
      'detail.bidSuccess': '!تم إرسال العرض',
      'detail.bidSuccessSub': '~في انتظار تأكيد الطالب',
      'detail.bidProposal': 'اقتراحك',
      'detail.bidProposalPh': '!صف نهجك — التفاصيل تفوز بالعروض',
      'detail.bidPrice': 'السعر',
      'detail.bidPricePh': 'مثال: مجاني / 200 ر.س',
      'detail.bidDelivery': 'وقت التسليم',
      'detail.bidDeliveryPh': 'مثال: 3 أيام / أسبوع واحد',
      'detail.bidSubmit': 'إرسال العرض',
      'detail.bidList': 'العروض',
      'detail.bidAccepted': 'مُنح',
      'detail.accept': 'قبول',
      'detail.reject': 'رفض',
      'detail.discussion': 'النقاش',
      'detail.discussionPh': 'قل شيئاً...',
      'detail.discussionEmpty': '!لا توجد تعليقات بعد. كن أول من يتكلم',
      'detail.developerBadge': 'مطور',
      'detail.overview': 'نظرة عامة على المشروع',
      'detail.budget': 'الميزانية',
      'detail.deadline': 'المهلة المتوقعة',
      'detail.bidCount': 'العروض',
      'detail.voteCount': 'المتابعون',
      'detail.assignedDev': 'المطور المعين',
      'detail.assignedNote': 'قيد التطوير حالياً',
      'detail.safety': 'الأمان والضمانات',
      'detail.safety1': 'تم التحقق من المنصة، طلبات حقيقية فقط',
      'detail.safety2': 'المطورون موثقون وموثوق بهم',
      'detail.safety3': 'سجل كامل لجميع المراسلات محفوظ',
      'hero.searchPh': '...ابحث: صانع العروض التقديمية، ضاغط الصور، المترجم الذكي',
      'hero.titleDev': '💼 اكتشف المشاريع، واكسب بأكفائك',
      'hero.titleUser': '🛠️ قاعة احتياجات الأدوات',
      'hero.subtitleDev': 'تصفح المجموعة وابحث عن مشاريع تناسب خبرتك',
      'hero.subtitleUser': '؟لا تجد الأداة التي تريدها. انشر احتياجاً، ودع المطورين ينشئونها',
      'hero.postNeed': 'نشر الاحتياج',
      'hero.devMode': 'وضع المطور',
      'hero.joinDev': 'انضم كمطور',
      'hero.findDev': 'ابحث عن مطورين',
      'stats.total': 'إجمالي الاحتياجات',
      'stats.bidding': 'قيد التوظيف',
      'stats.completed': 'مكتمل',
      'stats.developers': 'المطورون',
      'mobile.filter': 'فلترة',
      'list.resultCount': '',
      'list.resultCount2': 'احتياجات',
      'list.sortLabel': 'ترتيب:',
      'list.emptyTitle': 'لا توجد احتياجات مطابقة',
      'list.emptySub': '!جرب فلاتر أخرى، أو انشر أول احتياج',
      'form.title': 'نشر احتياج أداة',
      'form.success': '!تم النشر بنجاح',
      'form.successSub': '~سيرى المطورون احتياجك قريباً',
      'form.needTitle': 'عنوان الاحتياج',
      'form.needTitlePh': 'جملة واحدة تصف الأداة التي تريدها',
      'form.description': 'الوصف التفصيلي',
      'form.descriptionPh': '!الميزات، حالات الاستخدام — مزيد من التفاصيل = مزيد من الاهتمام',
      'form.category': 'الفئة',
      'form.budget': 'الميزانية',
      'form.budgetPh': 'مجاني / بقشيش / مبلغ',
      'form.deadline': 'التسليم المتوقع',
      'form.deadlinePh': 'اختياري، مثال: خلال أسبوع / في أقرب وقت',
      'form.yourNickname': 'لقبك',
      'form.yourNicknamePh': 'اختياري، الافتراضي "مجهول"',
      'form.contact': 'معلومات التواصل',
      'form.contactPh': 'اختياري، يتواصل معك المطورون بعد المنح',
      'form.contactNote': '🔒 مرئي فقط للمطورين أعضاء العرض، أبداً علني',
      'form.submit': 'نشر الاحتياج',
      'default.budget': 'مجاني',
      'default.bidPrice': 'مجاني / دعم بالبقشيش',
      'default.bidDelivery': '7 أيام',
      'filter.contains.free': 'مجاني',
      'filter.contains.tip': 'بقشيش',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };

  const t = getT(locale);

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: t('status.pending'), color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
    reviewing: { label: t('status.reviewing'), color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Lightbulb },
    bidding: { label: t('status.bidding'), color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: Handshake },
    developing: { label: t('status.developing'), color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: Loader2 },
    completed: { label: t('status.completed'), color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
    rejected: { label: t('status.rejected'), color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: X },
  };

  const categories = [
    { id: 'all', name: t('category.all'), icon: '📋' },
    { id: 'image-tools', name: t('category.image-tools'), icon: '🖼️' },
    { id: 'ai-tools', name: t('category.ai-tools'), icon: '🤖' },
    { id: 'lifestyle', name: t('category.lifestyle'), icon: '🎮' },
    { id: 'productivity', name: t('category.productivity'), icon: '⚡' },
    { id: 'developer-tools', name: t('category.developer-tools'), icon: '💻' },
    { id: 'other', name: t('category.other'), icon: '✨' },
  ];

  const skillOptions = [
    'React', 'Vue', 'TypeScript', 'JavaScript', 'Canvas', t('skill.css-anim'),
    'Node.js', 'Python', 'AI/ML', t('skill.api-integration'), 'Figma', t('skill.ui-design'),
    t('skill.responsive'), t('skill.mobile-dev'), t('skill.automation'), t('skill.data-processing'),
  ];

  const budgetOptions = [
    { id: 'all', label: t('budget.all') },
    { id: 'free', label: t('budget.free') },
    { id: 'tip', label: t('budget.tip') },
    { id: 'low', label: t('budget.low') },
    { id: 'mid', label: t('budget.mid') },
    { id: 'high', label: t('budget.high') },
  ];

  const {
    ideas,
    developers,
    bids,
    comments,
    currentRole,
    currentDeveloperId,
    addIdea,
    voteIdea,
    hasVotedIdea,
    setCurrentRole,
    addDeveloper,
    addBid,
    acceptBid,
    rejectBid,
    addComment,
    getBidsByIdea,
    getCommentsByIdea,
    getCurrentDeveloper,
  } = usePreferencesStore();

  const [view, setView] = useState<'list' | 'detail' | 'becomeDev' | 'devList'>('list');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'bidding' | 'developing' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'bids'>('newest');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [contact, setContact] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('other');
  const [budget, setBudget] = useState(t('default.budget'));
  const [deadline, setDeadline] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [bidProposal, setBidProposal] = useState('');
  const [bidPrice, setBidPrice] = useState(t('default.bidPrice'));
  const [bidDelivery, setBidDelivery] = useState(t('default.bidDelivery'));
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const [commentText, setCommentText] = useState('');

  const [devName, setDevName] = useState('');
  const [devTitle, setDevTitle] = useState('');
  const [devSkills, setDevSkills] = useState('');
  const [devBio, setDevBio] = useState('');
  const [devContact, setDevContact] = useState('');
  const [devSubmitted, setDevSubmitted] = useState(false);

  const currentDev = getCurrentDeveloper();
  const ideaBids = selectedIdea ? getBidsByIdea(selectedIdea.id) : [];
  const ideaComments = selectedIdea ? getCommentsByIdea(selectedIdea.id) : [];

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((idea) => idea.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((idea) => idea.category === categoryFilter);
    }

    if (budgetFilter !== 'all') {
      result = result.filter((idea) => {
        const b = idea.budget?.toLowerCase() || '';
        if (budgetFilter === 'free') return b.includes(t('filter.contains.free').toLowerCase());
        if (budgetFilter === 'tip') return b.includes(t('filter.contains.tip').toLowerCase());
        if (budgetFilter === 'low') return b.includes('100') || /[1-9]\d/.test(b);
        if (budgetFilter === 'mid') return b.includes('100') || b.includes('200') || b.includes('300') || b.includes('400');
        if (budgetFilter === 'high') return b.includes('500') || b.includes('1000');
        return true;
      });
    }

    if (sortBy === 'votes') {
      result.sort((a, b) => b.votes - a.votes);
    } else if (sortBy === 'bids') {
      result.sort((a, b) => (b.bidsCount || 0) - (a.bidsCount || 0));
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [ideas, searchQuery, statusFilter, categoryFilter, budgetFilter, sortBy, t]);

  const stats = useMemo(() => {
    const total = ideas.length;
    const completed = ideas.filter((i) => i.status === 'completed').length;
    const bidding = ideas.filter((i) => i.status === 'bidding').length;
    const devCount = developers.length;
    return { total, completed, bidding, devCount };
  }, [ideas, developers]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleSubmitIdea = useCallback(() => {
    if (!title.trim() || !description.trim()) return;

    addIdea({
      title: title.trim(),
      description: description.trim(),
      authorName: authorName.trim() || t('detail.anonymous'),
      contact: contact.trim() || undefined,
      category: ideaCategory,
      budget: budget,
      deadline: deadline || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setTitle('');
      setDescription('');
      setAuthorName('');
      setContact('');
      setIdeaCategory('other');
      setBudget(t('default.budget'));
      setDeadline('');
      setSelectedSkills([]);
    }, 2000);
  }, [title, description, authorName, contact, ideaCategory, budget, deadline, addIdea, t]);

  const handleSubmitBid = useCallback(() => {
    if (!selectedIdea || !bidProposal.trim()) return;

    const dev = getCurrentDeveloper();
    if (!dev) return;

    addBid({
      ideaId: selectedIdea.id,
      developerId: dev.id,
      developerName: dev.name,
      developerTitle: dev.title,
      proposal: bidProposal.trim(),
      price: bidPrice,
      deliveryTime: bidDelivery,
    });

    setBidSubmitted(true);
    setTimeout(() => {
      setShowBidForm(false);
      setBidSubmitted(false);
      setBidProposal('');
      setBidPrice(t('default.bidPrice'));
      setBidDelivery(t('default.bidDelivery'));
    }, 2000);
  }, [selectedIdea, bidProposal, bidPrice, bidDelivery, addBid, getCurrentDeveloper, t]);

  const handleSubmitComment = useCallback(() => {
    if (!selectedIdea || !commentText.trim()) return;

    const dev = getCurrentDeveloper();
    addComment({
      ideaId: selectedIdea.id,
      authorId: dev?.id || 'anonymous',
      authorName: dev?.name || t('detail.anonymous'),
      authorRole: currentRole === 'developer' && dev ? 'developer' : 'user',
      content: commentText.trim(),
    });

    setCommentText('');
  }, [selectedIdea, commentText, addComment, getCurrentDeveloper, currentRole, t]);

  const handleBecomeDeveloper = useCallback(() => {
    if (!devName.trim() || !devTitle.trim() || !devSkills.trim() || !devContact.trim()) return;

    addDeveloper({
      name: devName.trim(),
      title: devTitle.trim(),
      skills: devSkills.split(/[,\uFF0C\s]+/).filter(Boolean),
      bio: devBio.trim(),
      contact: devContact.trim(),
    });

    setDevSubmitted(true);
    setTimeout(() => {
      setDevSubmitted(false);
      setView('list');
    }, 2000);
  }, [devName, devTitle, devSkills, devBio, devContact, addDeveloper]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const openDetail = (idea: Idea) => {
    setSelectedIdea(idea);
    setView('detail');
  };

  const goBack = () => {
    setView('list');
    setSelectedIdea(null);
    setShowBidForm(false);
  };

  const isMyIdea = (idea: Idea) => {
    return idea.authorId === usePreferencesStore.getState().userId;
  };

  const FilterSidebar = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
          <SlidersHorizontal className='h-4 w-4' />
          {t('filter.title')}
        </h3>
      </div>

      <div>
        <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2'>
          {t('filter.projectStatus')}
        </h4>
        <div className='space-y-1'>
          {['all', 'bidding', 'developing', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === s
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? t('filter.allStatuses') : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2'>
          {t('filter.category')}
        </h4>
        <div className='space-y-1'>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className='mr-2'>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2'>
          {t('filter.budgetRange')}
        </h4>
        <div className='space-y-1'>
          {budgetOptions.map((b) => (
            <button
              key={b.id}
              onClick={() => setBudgetFilter(b.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                budgetFilter === b.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2'>
          {t('filter.sortBy')}
        </h4>
        <div className='space-y-1'>
          {[
            { id: 'newest', label: t('sort.newest'), icon: Calendar },
            { id: 'votes', label: t('sort.mostVotes'), icon: ThumbsUp },
            { id: 'bids', label: t('sort.mostBids'), icon: Briefcase },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  sortBy === s.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className='h-4 w-4' />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const IdeaCard = ({ idea }: { idea: Idea }) => {
    const status = statusConfig[idea.status] || statusConfig.pending;
    const StatusIcon = status.icon;
    const voted = hasVotedIdea(idea.id);
    const cat = categories.find((c) => c.id === idea.category);

    return (
      <div
        onClick={() => openDetail(idea)}
        className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 h-full flex flex-col relative cursor-pointer group'
      >
        <div className='h-1 bg-[#34A89C] flex-shrink-0' />
        <div className='p-4 flex-1 flex flex-col min-h-0'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium flex-shrink-0 ${status.bg} ${status.color}`}>
            <StatusIcon className='h-3 w-3' />
            {status.label}
          </span>
          <span className='text-[11px] text-gray-400 flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {formatDate(idea.createdAt)}
          </span>
        </div>

        <h4 className='font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight'>
          {idea.title}
        </h4>

        <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed'>
          {idea.description}
        </p>

        <div className='flex flex-wrap gap-1.5 mb-3'>
          {cat && cat.id !== 'all' && (
            <span className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
              {cat.icon} {cat.name}
            </span>
          )}
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto'>
          <div className='flex items-center gap-3 text-[11px] text-gray-500'>
            <span className='flex items-center gap-1 text-green-600 dark:text-green-400'>
              <DollarSign className='h-3.5 w-3.5' />
              {idea.budget || t('card.free')}
            </span>
            <span className='flex items-center gap-1'>
              <Briefcase className='h-3.5 w-3.5' />
              {idea.bidsCount || 0} {t('card.bids')}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); voteIdea(idea.id); }}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${
              voted
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-500'
            }`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${voted ? 'fill-current' : ''}`} />
            <span className='text-[11px] font-semibold tabular-nums leading-none'>{idea.votes}</span>
          </button>
        </div>
        </div>
      </div>
    );
  };

  if (view === 'becomeDev') {
    return (
      <div className='max-w-2xl mx-auto px-4 py-6'>
        <button
          onClick={goBack}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('common.back')}</span>
        </button>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='text-center mb-6'>
            <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#34A89C] to-[#54C2B0] rounded-2xl flex items-center justify-center'>
              <Code2 className='h-8 w-8 text-white' />
            </div>
            <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{t('becomeDev.title')}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{t('becomeDev.subtitle')}</p>
          </div>

          {devSubmitted ? (
            <div className='text-center py-8'>
              <div className='w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t('becomeDev.success')}</h4>
              <p className='text-gray-500 text-sm'>{t('becomeDev.successSub')}</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  {t('becomeDev.nickname')} <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder={t('becomeDev.nicknamePh')}
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  {t('becomeDev.titleField')} <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={devTitle}
                  onChange={(e) => setDevTitle(e.target.value)}
                  placeholder={t('becomeDev.titlePh')}
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  {t('becomeDev.skills')} <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={devSkills}
                  onChange={(e) => setDevSkills(e.target.value)}
                  placeholder={t('becomeDev.skillsPh')}
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  {t('becomeDev.bio')}
                </label>
                <textarea
                  value={devBio}
                  onChange={(e) => setDevBio(e.target.value)}
                  placeholder={t('becomeDev.bioPh')}
                  rows={3}
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C] resize-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  <div className='flex items-center gap-1.5'>
                    <Mail className='h-4 w-4' />
                    {t('becomeDev.contact')} <span className='text-red-500'>*</span>
                  </div>
                </label>
                <input
                  type='text'
                  value={devContact}
                  onChange={(e) => setDevContact(e.target.value)}
                  placeholder={t('becomeDev.contactPh')}
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C]'
                />
                <p className='text-xs text-gray-400 mt-1'>{t('becomeDev.contactNote')}</p>
              </div>

              <button
                onClick={handleBecomeDeveloper}
                disabled={!devName.trim() || !devTitle.trim() || !devSkills.trim() || !devContact.trim()}
                className='w-full py-3 bg-gradient-to-r from-[#34A89C] to-[#4AB8A9] text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                <Zap className='h-5 w-5' />
                {t('becomeDev.submit')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'devList') {
    return (
      <div className='max-w-5xl mx-auto px-4 py-6'>
        <button
          onClick={goBack}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('devList.back')}</span>
        </button>

        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-3 bg-gradient-to-br from-[#34A89C] to-[#54C2B0] rounded-xl text-white'>
              <Users className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('devList.title')}</h1>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>{t('devList.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {developers.map((dev) => (
            <div
              key={dev.id}
              className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 h-full flex flex-col relative'
            >
              <div className='h-1 bg-[#34A89C] flex-shrink-0' />
              <div className='p-5 flex-1 flex flex-col min-h-0'>
              <div className='flex items-start gap-3 mb-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-[#34A89C] to-[#54C2B0] rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0'>
                  {dev.name.charAt(0)}
                </div>
                <div className='flex-1 min-w-0'>
                  <h4 className='font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 flex items-center gap-1 leading-tight'>
                    {dev.name}
                    <BadgeCheck className='h-4 w-4 text-[#34A89C]' />
                  </h4>
                  <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>{dev.title}</p>
                </div>
              </div>

              <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed'>
                {dev.bio}
              </p>

              <div className='flex flex-wrap gap-1.5 mb-3'>
                {dev.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  >
                    {skill}
                  </span>
                ))}
                {dev.skills.length > 4 && (
                  <span className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                    +{dev.skills.length - 4}
                  </span>
                )}
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto'>
                <div className='flex items-center gap-3 text-[11px] text-gray-500'>
                  <span className='flex items-center gap-1'>
                    <Star className='h-3.5 w-3.5 text-yellow-500 fill-yellow-500' />
                    {dev.rating}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Briefcase className='h-3.5 w-3.5' />
                    {dev.completedProjects} {t('devList.projects')}
                  </span>
                </div>
                <button className='px-3 py-1.5 bg-[#34A89C] text-white text-[11px] font-semibold rounded-md hover:bg-[#2F9B8F] transition-colors active:scale-[0.98]'>
                  {t('devList.contact')}
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'detail' && selectedIdea) {
    const status = statusConfig[selectedIdea.status] || statusConfig.pending;
    const StatusIcon = status.icon;
    const voted = hasVotedIdea(selectedIdea.id);
    const isOwner = isMyIdea(selectedIdea);
    const cat = categories.find((c) => c.id === selectedIdea.category);

    return (
      <div className='max-w-5xl mx-auto px-4 py-6'>
        <button
          onClick={goBack}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('detail.back')}</span>
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div className='lg:col-span-2 space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700'>
              <div className='flex items-start justify-between gap-3 mb-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-2 flex-wrap'>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className='h-3 w-3' />
                      {status.label}
                    </span>
                    {cat && cat.id !== 'all' && (
                      <span className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                        {cat.icon} {cat.name}
                      </span>
                    )}
                  </div>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    {selectedIdea.title}
                  </h2>
                  <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='flex items-center gap-1'>
                      <User className='h-4 w-4' />
                      {selectedIdea.authorName || t('detail.anonymous')}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      {formatDate(selectedIdea.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => voteIdea(selectedIdea.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
                    voted
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500'
                  }`}
                >
                  <ThumbsUp className={`h-5 w-5 ${voted ? 'fill-current' : ''}`} />
                  <span className='text-sm font-bold'>{selectedIdea.votes}</span>
                </button>
              </div>

              <div className='prose prose-sm dark:prose-invert max-w-none'>
                <p className='text-gray-700 dark:text-gray-300 whitespace-pre-line'>
                  {selectedIdea.description}
                </p>
              </div>
            </div>

            {selectedIdea.status === 'bidding' && currentRole === 'developer' && currentDev && (
              <div>
                {!showBidForm ? (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className='w-full py-3 bg-gradient-to-r from-[#34A89C] to-[#4AB8A9] text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2'
                  >
                    <Briefcase className='h-5 w-5' />
                    {t('detail.bidBtn')}
                  </button>
                ) : (
                  <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-emerald-200 dark:border-emerald-800/40'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        <Briefcase className='h-4 w-4 text-blue-500' />
                        {t('detail.bidSubmitTitle')}
                      </h3>
                      <button
                        onClick={() => setShowBidForm(false)}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                      >
                        <X className='h-4 w-4 text-gray-500' />
                      </button>
                    </div>

                    {bidSubmitted ? (
                      <div className='text-center py-6'>
                        <div className='w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
                          <CheckCircle2 className='h-6 w-6 text-green-500' />
                        </div>
                        <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t('detail.bidSuccess')}</h4>
                        <p className='text-sm text-gray-500'>{t('detail.bidSuccessSub')}</p>
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                            {t('detail.bidProposal')} <span className='text-red-500'>*</span>
                          </label>
                          <textarea
                            value={bidProposal}
                            onChange={(e) => setBidProposal(e.target.value)}
                            placeholder={t('detail.bidProposalPh')}
                            rows={4}
                            className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C] resize-none'
                          />
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                              {t('detail.bidPrice')}
                            </label>
                            <input
                              type='text'
                              value={bidPrice}
                              onChange={(e) => setBidPrice(e.target.value)}
                              placeholder={t('detail.bidPricePh')}
                              className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C]'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                              {t('detail.bidDelivery')}
                            </label>
                            <input
                              type='text'
                              value={bidDelivery}
                              onChange={(e) => setBidDelivery(e.target.value)}
                              placeholder={t('detail.bidDeliveryPh')}
                              className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#34A89C]'
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSubmitBid}
                          disabled={!bidProposal.trim()}
                          className='w-full py-2.5 bg-gradient-to-r from-[#34A89C] to-[#4AB8A9] text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                          <Send className='h-4 w-4' />
                          {t('detail.bidSubmit')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedIdea.status === 'bidding' && ideaBids.length > 0 && (
              <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                  <Users className='h-4 w-4 text-[#34A89C]' />
                  {t('detail.bidList')} ({ideaBids.length})
                </h3>
                <div className='space-y-3'>
                  {ideaBids.map((bid) => (
                    <div
                      key={bid.id}
                      className={`p-3 rounded-xl border ${
                        bid.status === 'accepted'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                          : bid.status === 'rejected'
                          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className='flex items-start justify-between gap-2 mb-2'>
                        <div className='flex items-center gap-2'>
                          <div className='w-10 h-10 bg-gradient-to-br from-[#34A89C] to-[#54C2B0] rounded-full flex items-center justify-center text-white text-sm font-bold'>
                            {bid.developerName.charAt(0)}
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1'>
                              {bid.developerName}
                              {bid.status === 'accepted' && <BadgeCheck className='h-4 w-4 text-green-500' />}
                            </p>
                            {bid.developerTitle && (
                              <p className='text-xs text-gray-500'>{bid.developerTitle}</p>
                            )}
                          </div>
                        </div>
                        {bid.status === 'accepted' && (
                          <span className='px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[11px] font-medium rounded-md'>
                            {t('detail.bidAccepted')}
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>{bid.proposal}</p>
                      <div className='flex items-center justify-between text-xs'>
                        <div className='flex gap-3 text-gray-500'>
                          <span className='flex items-center gap-1 text-green-600'>
                            <DollarSign className='h-3 w-3' />
                            {bid.price}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Timer className='h-3 w-3' />
                            {bid.deliveryTime}
                          </span>
                        </div>
                        {isOwner && bid.status === 'pending' && (
                          <div className='flex gap-2'>
                            <button
                              onClick={() => acceptBid(bid.id, selectedIdea.id)}
                              className='px-2.5 py-1 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors'
                            >
                              {t('detail.accept')}
                            </button>
                            <button
                              onClick={() => rejectBid(bid.id)}
                              className='px-2.5 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors'
                            >
                              {t('detail.reject')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                <MessageSquare className='h-4 w-4 text-orange-500' />
                {t('detail.discussion')} ({ideaComments.length})
              </h3>

              <div className='flex gap-2 mb-4'>
                <input
                  type='text'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder={t('detail.discussionPh')}
                  className='flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className='px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Send className='h-4 w-4' />
                </button>
              </div>

              <div className='space-y-3 max-h-80 overflow-y-auto'>
                {ideaComments.length === 0 ? (
                  <p className='text-center text-gray-400 text-sm py-4'>{t('detail.discussionEmpty')}</p>
                ) : (
                  ideaComments.map((comment) => (
                    <div key={comment.id} className='flex gap-2'>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                        comment.authorRole === 'developer'
                          ? 'bg-gradient-to-br from-[#34A89C] to-[#54C2B0]'
                          : 'bg-gradient-to-br from-orange-400 to-pink-500'
                      }`}>
                        {comment.authorName.charAt(0)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-1.5 mb-0.5'>
                          <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>{comment.authorName}</span>
                          {comment.authorRole === 'developer' && (
                            <span className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40'>
                              {t('detail.developerBadge')}
                            </span>
                          )}
                          <span className='text-xs text-gray-400'>{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                <BarChart3 className='h-4 w-4 text-[#34A89C]' />
                {t('detail.overview')}
              </h3>
              <div className='space-y-3'>
                {selectedIdea.budget && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>{t('detail.budget')}</span>
                    <span className='text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1'>
                      <DollarSign className='h-4 w-4' />
                      {selectedIdea.budget}
                    </span>
                  </div>
                )}
                {selectedIdea.deadline && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>{t('detail.deadline')}</span>
                    <span className='text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1'>
                      <Timer className='h-4 w-4' />
                      {selectedIdea.deadline}
                    </span>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>{t('detail.bidCount')}</span>
                  <span className='text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1'>
                    <Briefcase className='h-4 w-4' />
                    {selectedIdea.bidsCount || 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>{t('detail.voteCount')}</span>
                  <span className='text-sm font-medium text-pink-600 flex items-center gap-1'>
                    <Heart className='h-4 w-4' />
                    {selectedIdea.votes}
                  </span>
                </div>
              </div>
            </div>

            {selectedIdea.assignedDeveloperName && (
              <div className='bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/40 overflow-hidden shadow-sm'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                  <Award className='h-4 w-4 text-[#34A89C]' />
                  {t('detail.assignedDev')}
                </h3>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-[#34A89C] to-[#54C2B0] rounded-full flex items-center justify-center text-white font-bold'>
                    {selectedIdea.assignedDeveloperName.charAt(0)}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {selectedIdea.assignedDeveloperName}
                    </p>
                    <p className='text-xs text-gray-500'>{t('detail.assignedNote')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-green-500' />
                {t('detail.safety')}
              </h3>
              <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>{t('detail.safety1')}</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>{t('detail.safety2')}</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>{t('detail.safety3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <div className='mb-4'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 w-fit'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('common.back')}</span>
        </button>
      </div>

      <div className='mb-6 sm:mb-8'>
        <div className='mb-4 sm:mb-5 max-w-3xl mx-auto'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hero.searchPh')}
              className={`w-full pl-12 pr-4 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow min-h-[46px] sm:min-h-[44px] text-sm sm:text-[15px] border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent`}
            />
          </div>
        </div>

        <div className='text-center'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2'>
            {currentRole === 'developer' ? t('hero.titleDev') : t('hero.titleUser')}
          </h1>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 max-w-3xl mx-auto'>
            {currentRole === 'developer'
              ? t('hero.subtitleDev')
              : t('hero.subtitleUser')}
          </p>

          <div className='flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8'>
            <button
              onClick={() => setShowForm(true)}
              className='px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-[#34A89C] to-[#4AB8A9] text-white font-medium rounded-xl hover:from-[#2F9B8F] hover:to-[#3FA598] transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap active:scale-[0.98]'
            >
              <Plus className='h-5 w-5' />
              {t('hero.postNeed')}
            </button>

            {currentRole === 'developer' ? (
              <div className='flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-200/50 dark:border-emerald-800/30'>
                <Code2 className='h-4 w-4' />
                {t('hero.devMode')}
              </div>
            ) : (
              <button
                onClick={() => setView('becomeDev')}
                className='px-4 py-2.5 min-h-[44px] bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-1.5 active:scale-[0.98]'
              >
                <Code2 className='h-4 w-4' />
                {t('hero.joinDev')}
              </button>
            )}

            <button
              onClick={() => setView('devList')}
              className='px-4 py-2.5 min-h-[44px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 active:scale-[0.98]'
            >
              <Users className='h-4 w-4' />
              {t('hero.findDev')}
            </button>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all'>
            <p className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tabular-nums mb-1'>{stats.total}</p>
            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>{t('stats.total')}</p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all'>
            <p className='text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 tabular-nums mb-1'>{stats.bidding}</p>
            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>{t('stats.bidding')}</p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all'>
            <p className='text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 tabular-nums mb-1'>{stats.completed}</p>
            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>{t('stats.completed')}</p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all overflow-hidden relative'>
            <div className='h-1 bg-[#34A89C] -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-4 sm:mb-5 flex-shrink-0 opacity-70' />
            <p className='text-2xl sm:text-3xl font-bold text-[#34A89C] dark:text-[#4AB8A9] tabular-nums mb-1'>{stats.devCount}</p>
            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>{t('stats.developers')}</p>
          </div>
        </div>
      </div>

      <div className='flex lg:hidden gap-2 mb-4'>
        <button
          onClick={() => setShowFilterMobile(true)}
          className='flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-[0.98]'
        >
          <Filter className='h-4 w-4' />
          {t('mobile.filter')}
        </button>
        <div className='flex-1 flex items-center justify-end gap-2'>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2.5 h-11 w-11 rounded-xl ${
              viewMode === 'card'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            <Grid3X3 className='h-4 w-4' />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 h-11 w-11 rounded-xl ${
              viewMode === 'list'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            <List className='h-4 w-4' />
          </button>
        </div>
      </div>

      {showFilterMobile && (
        <div className='fixed inset-0 bg-black/50 z-50 lg:hidden' onClick={() => setShowFilterMobile(false)}>
          <div
            className='absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('filter.title')}</h3>
              <button
                onClick={() => setShowFilterMobile(false)}
                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              >
                <X className='h-5 w-5 text-gray-500' />
              </button>
            </div>
            <div className='p-4'>
              <FilterSidebar />
            </div>
          </div>
        </div>
      )}

      <div className='flex gap-6'>
        <div className='hidden lg:block w-56 flex-shrink-0'>
          <div className='sticky top-24'>
            <FilterSidebar />
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='hidden sm:flex items-center justify-between mb-4'>
            <p className='text-sm text-gray-500'>
              {t('list.resultCount')} <span className='font-medium text-gray-900 dark:text-gray-100'>{filteredIdeas.length}</span> {t('list.resultCount2')}
            </p>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>{t('list.sortLabel')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className='px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
              >
                <option value='newest'>{t('sort.newest')}</option>
                <option value='votes'>{t('sort.mostVotes')}</option>
                <option value='bids'>{t('sort.mostBids')}</option>
              </select>
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className='text-center py-16 text-gray-500'>
              <Lightbulb className='h-16 w-16 mx-auto mb-4 opacity-30' />
              <p className='text-lg mb-2'>{t('list.emptyTitle')}</p>
              <p className='text-sm text-gray-400'>{t('list.emptySub')}</p>
            </div>
          ) : (
            <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                <Sparkles className='h-5 w-5 text-primary-500' />
                {t('form.title')}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              >
                <X className='h-5 w-5 text-gray-500' />
              </button>
            </div>

            {submitted ? (
              <div className='p-8 text-center'>
                <div className='w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
                  <CheckCircle2 className='h-8 w-8 text-green-500' />
                </div>
                <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t('form.success')}</h4>
                <p className='text-gray-500 text-sm'>{t('form.successSub')}</p>
              </div>
            ) : (
              <div className='p-4 space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    {t('form.needTitle')} <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('form.needTitlePh')}
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    {t('form.description')} <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('form.descriptionPh')}
                    rows={4}
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                      {t('form.category')}
                    </label>
                    <select
                      value={ideaCategory}
                      onChange={(e) => setIdeaCategory(e.target.value)}
                      className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                    >
                      {categories.filter(c => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                      <div className='flex items-center gap-1'>
                        <DollarSign className='h-3.5 w-3.5' />
                        {t('form.budget')}
                      </div>
                    </label>
                    <input
                      type='text'
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder={t('form.budgetPh')}
                      className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    <div className='flex items-center gap-1'>
                      <Timer className='h-3.5 w-3.5' />
                      {t('form.deadline')}
                    </div>
                  </label>
                  <input
                    type='text'
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder={t('form.deadlinePh')}
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    <div className='flex items-center gap-1.5'>
                      <User className='h-4 w-4' />
                      {t('form.yourNickname')}
                    </div>
                  </label>
                  <input
                    type='text'
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={t('form.yourNicknamePh')}
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    <div className='flex items-center gap-1.5'>
                      <Mail className='h-4 w-4' />
                      {t('form.contact')}
                    </div>
                  </label>
                  <input
                    type='text'
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t('form.contactPh')}
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                  <p className='text-xs text-gray-400 mt-1'>{t('form.contactNote')}</p>
                </div>

                <button
                  onClick={handleSubmitIdea}
                  disabled={!title.trim() || !description.trim()}
                  className='w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  <Send className='h-5 w-5' />
                  {t('form.submit')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
