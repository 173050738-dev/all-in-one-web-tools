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

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: '待审核', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  reviewing: { label: '评估中', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Lightbulb },
  bidding: { label: '招募中', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: Handshake },
  developing: { label: '开发中', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: Loader2 },
  completed: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  rejected: { label: '暂不实现', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: X },
};

const categories = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: 'image-tools', name: '图片工具', icon: '🖼️' },
  { id: 'ai-tools', name: 'AI工具', icon: '🤖' },
  { id: 'lifestyle', name: '生活娱乐', icon: '🎮' },
  { id: 'productivity', name: '效率工具', icon: '⚡' },
  { id: 'developer-tools', name: '开发工具', icon: '💻' },
  { id: 'other', name: '其他', icon: '✨' },
];

const skillOptions = [
  'React', 'Vue', 'TypeScript', 'JavaScript', 'Canvas', 'CSS动画',
  'Node.js', 'Python', 'AI/ML', 'API集成', 'Figma', 'UI设计',
  '响应式设计', '移动端开发', '自动化', '数据处理',
];

const budgetOptions = [
  { id: 'all', label: '全部预算' },
  { id: 'free', label: '免费' },
  { id: 'tip', label: '打赏支持' },
  { id: 'low', label: '¥1-100' },
  { id: 'mid', label: '¥100-500' },
  { id: 'high', label: '¥500+' },
];

export default function IdeaWorkshop({ locale = 'zh' }: { locale?: string }) {
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
  const [budget, setBudget] = useState('免费');
  const [deadline, setDeadline] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [bidProposal, setBidProposal] = useState('');
  const [bidPrice, setBidPrice] = useState('免费 / 打赏支持');
  const [bidDelivery, setBidDelivery] = useState('7天');
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
        if (budgetFilter === 'free') return b.includes('免费');
        if (budgetFilter === 'tip') return b.includes('打赏');
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
  }, [ideas, searchQuery, statusFilter, categoryFilter, budgetFilter, sortBy]);

  const stats = useMemo(() => {
    const total = ideas.length;
    const completed = ideas.filter((i) => i.status === 'completed').length;
    const bidding = ideas.filter((i) => i.status === 'bidding').length;
    const devCount = developers.length;
    return { total, completed, bidding, devCount };
  }, [ideas, developers]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    if (diff < 7) return `${diff}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const handleSubmitIdea = useCallback(() => {
    if (!title.trim() || !description.trim()) return;

    addIdea({
      title: title.trim(),
      description: description.trim(),
      authorName: authorName.trim() || '匿名用户',
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
      setBudget('免费');
      setDeadline('');
      setSelectedSkills([]);
    }, 2000);
  }, [title, description, authorName, contact, ideaCategory, budget, deadline, addIdea]);

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
      setBidPrice('免费 / 打赏支持');
      setBidDelivery('7天');
    }, 2000);
  }, [selectedIdea, bidProposal, bidPrice, bidDelivery, addBid, getCurrentDeveloper]);

  const handleSubmitComment = useCallback(() => {
    if (!selectedIdea || !commentText.trim()) return;

    const dev = getCurrentDeveloper();
    addComment({
      ideaId: selectedIdea.id,
      authorId: dev?.id || 'anonymous',
      authorName: dev?.name || '匿名用户',
      authorRole: currentRole === 'developer' && dev ? 'developer' : 'user',
      content: commentText.trim(),
    });

    setCommentText('');
  }, [selectedIdea, commentText, addComment, getCurrentDeveloper, currentRole]);

  const handleBecomeDeveloper = useCallback(() => {
    if (!devName.trim() || !devTitle.trim() || !devSkills.trim() || !devContact.trim()) return;

    addDeveloper({
      name: devName.trim(),
      title: devTitle.trim(),
      skills: devSkills.split(/[,，\s]+/).filter(Boolean),
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
          筛选条件
        </h3>
      </div>

      <div>
        <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2'>
          项目状态
        </h4>
        <div className='space-y-1'>
          {['all', 'bidding', 'developing', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === s
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {s === 'all' ? '全部状态' : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2'>
          分类
        </h4>
        <div className='space-y-1'>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium'
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
          预算范围
        </h4>
        <div className='space-y-1'>
          {budgetOptions.map((b) => (
            <button
              key={b.id}
              onClick={() => setBudgetFilter(b.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                budgetFilter === b.id
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium'
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
          排序方式
        </h4>
        <div className='space-y-1'>
          {[
            { id: 'newest', label: '最新发布', icon: Calendar },
            { id: 'votes', label: '最多点赞', icon: ThumbsUp },
            { id: 'bids', label: '最多投标', icon: Briefcase },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  sortBy === s.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
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
        className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all cursor-pointer group'
      >
        <div className='flex items-start justify-between gap-2 mb-2'>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${status.bg} ${status.color}`}>
            <StatusIcon className='h-3 w-3' />
            {status.label}
          </span>
          <span className='text-xs text-gray-400 flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {formatDate(idea.createdAt)}
          </span>
        </div>

        <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
          {idea.title}
        </h4>

        <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3'>
          {idea.description}
        </p>

        <div className='flex flex-wrap gap-1.5 mb-3'>
          {cat && cat.id !== 'all' && (
            <span className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md'>
              {cat.icon} {cat.name}
            </span>
          )}
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center gap-3 text-xs text-gray-500'>
            <span className='flex items-center gap-1 text-green-600'>
              <DollarSign className='h-3.5 w-3.5' />
              {idea.budget || '免费'}
            </span>
            <span className='flex items-center gap-1'>
              <Briefcase className='h-3.5 w-3.5' />
              {idea.bidsCount || 0} 投标
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); voteIdea(idea.id); }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
              voted
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500'
            }`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${voted ? 'fill-current' : ''}`} />
            <span className='text-xs font-medium'>{idea.votes}</span>
          </button>
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
          <span>返回</span>
        </button>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='text-center mb-6'>
            <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center'>
              <Code2 className='h-8 w-8 text-white' />
            </div>
            <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>成为开发者</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>接单赚收益，用技术创造价值</p>
          </div>

          {devSubmitted ? (
            <div className='text-center py-8'>
              <div className='w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'>
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              </div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>入驻成功！</h4>
              <p className='text-gray-500 text-sm'>欢迎加入，快去看看有什么需求可以接吧~</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  昵称 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder='你的开发者昵称'
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  身份/头衔 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={devTitle}
                  onChange={(e) => setDevTitle(e.target.value)}
                  placeholder='例如：前端开发工程师 / UI设计师'
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  擅长技能 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={devSkills}
                  onChange={(e) => setDevSkills(e.target.value)}
                  placeholder='用逗号分隔，如：React, Canvas, AI API'
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  个人简介
                </label>
                <textarea
                  value={devBio}
                  onChange={(e) => setDevBio(e.target.value)}
                  placeholder='介绍一下自己的经验和擅长的方向~'
                  rows={3}
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                  <div className='flex items-center gap-1.5'>
                    <Mail className='h-4 w-4' />
                    联系方式 <span className='text-red-500'>*</span>
                  </div>
                </label>
                <input
                  type='text'
                  value={devContact}
                  onChange={(e) => setDevContact(e.target.value)}
                  placeholder='邮箱/微信，需求方联系你用'
                  className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <p className='text-xs text-gray-400 mt-1'>🔒 仅在你投标后才会展示给需求方</p>
              </div>

              <button
                onClick={handleBecomeDeveloper}
                disabled={!devName.trim() || !devTitle.trim() || !devSkills.trim() || !devContact.trim()}
                className='w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                <Zap className='h-5 w-5' />
                立即入驻
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
          <span>返回需求大厅</span>
        </button>

        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-white'>
              <Users className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>开发者广场</h1>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>发现优秀开发者，找到最适合你的合作伙伴</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {developers.map((dev) => (
            <div
              key={dev.id}
              className='bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all'
            >
              <div className='flex items-start gap-3 mb-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0'>
                  {dev.name.charAt(0)}
                </div>
                <div className='flex-1 min-w-0'>
                  <h4 className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1'>
                    {dev.name}
                    <BadgeCheck className='h-4 w-4 text-blue-500' />
                  </h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>{dev.title}</p>
                </div>
              </div>

              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                {dev.bio}
              </p>

              <div className='flex flex-wrap gap-1 mb-3'>
                {dev.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className='px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md'
                  >
                    {skill}
                  </span>
                ))}
                {dev.skills.length > 4 && (
                  <span className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-md'>
                    +{dev.skills.length - 4}
                  </span>
                )}
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
                <div className='flex items-center gap-3 text-xs text-gray-500'>
                  <span className='flex items-center gap-1'>
                    <Star className='h-3.5 w-3.5 text-yellow-500 fill-yellow-500' />
                    {dev.rating}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Briefcase className='h-3.5 w-3.5' />
                    {dev.completedProjects} 项目
                  </span>
                </div>
                <button className='px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors'>
                  联系
                </button>
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
          <span>返回列表</span>
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div className='lg:col-span-2 space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700'>
              <div className='flex items-start justify-between gap-3 mb-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className='h-3 w-3' />
                      {status.label}
                    </span>
                    {cat && cat.id !== 'all' && (
                      <span className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full'>
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
                      {selectedIdea.authorName || '匿名用户'}
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
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500'
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
                    className='w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2'
                  >
                    <Briefcase className='h-5 w-5' />
                    我要投标
                  </button>
                ) : (
                  <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-blue-200 dark:border-blue-800/50'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        <Briefcase className='h-4 w-4 text-blue-500' />
                        提交投标
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
                        <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>投标成功！</h4>
                        <p className='text-sm text-gray-500'>等待需求方确认~</p>
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                            你的方案 <span className='text-red-500'>*</span>
                          </label>
                          <textarea
                            value={bidProposal}
                            onChange={(e) => setBidProposal(e.target.value)}
                            placeholder='说说你的实现思路、技术方案，越详细越容易中标~'
                            rows={4}
                            className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                          />
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                              报价
                            </label>
                            <input
                              type='text'
                              value={bidPrice}
                              onChange={(e) => setBidPrice(e.target.value)}
                              placeholder='如：免费 / 50元'
                              className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                              交付时间
                            </label>
                            <input
                              type='text'
                              value={bidDelivery}
                              onChange={(e) => setBidDelivery(e.target.value)}
                              placeholder='如：3天 / 一周'
                              className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSubmitBid}
                          disabled={!bidProposal.trim()}
                          className='w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                          <Send className='h-4 w-4' />
                          提交投标
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
                  <Users className='h-4 w-4 text-blue-500' />
                  投标列表 ({ideaBids.length})
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
                          <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
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
                          <span className='px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full'>
                            已中标
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
                              选中
                            </button>
                            <button
                              onClick={() => rejectBid(bid.id)}
                              className='px-2.5 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors'
                            >
                              拒绝
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
                讨论区 ({ideaComments.length})
              </h3>

              <div className='flex gap-2 mb-4'>
                <input
                  type='text'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder='说点什么...'
                  className='flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className='px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Send className='h-4 w-4' />
                </button>
              </div>

              <div className='space-y-3 max-h-80 overflow-y-auto'>
                {ideaComments.length === 0 ? (
                  <p className='text-center text-gray-400 text-sm py-4'>暂无讨论，来说两句吧~</p>
                ) : (
                  ideaComments.map((comment) => (
                    <div key={comment.id} className='flex gap-2'>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                        comment.authorRole === 'developer'
                          ? 'bg-gradient-to-br from-blue-400 to-purple-500'
                          : 'bg-gradient-to-br from-orange-400 to-pink-500'
                      }`}>
                        {comment.authorName.charAt(0)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-1.5 mb-0.5'>
                          <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>{comment.authorName}</span>
                          {comment.authorRole === 'developer' && (
                            <span className='px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-medium rounded'>
                              开发者
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
                <BarChart3 className='h-4 w-4 text-blue-500' />
                项目概况
              </h3>
              <div className='space-y-3'>
                {selectedIdea.budget && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>预算</span>
                    <span className='text-sm font-medium text-green-600 flex items-center gap-1'>
                      <DollarSign className='h-4 w-4' />
                      {selectedIdea.budget}
                    </span>
                  </div>
                )}
                {selectedIdea.deadline && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>期望时间</span>
                    <span className='text-sm font-medium text-orange-600 flex items-center gap-1'>
                      <Timer className='h-4 w-4' />
                      {selectedIdea.deadline}
                    </span>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>投标数</span>
                  <span className='text-sm font-medium text-blue-600 flex items-center gap-1'>
                    <Briefcase className='h-4 w-4' />
                    {selectedIdea.bidsCount || 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>关注数</span>
                  <span className='text-sm font-medium text-pink-600 flex items-center gap-1'>
                    <Heart className='h-4 w-4' />
                    {selectedIdea.votes}
                  </span>
                </div>
              </div>
            </div>

            {selectedIdea.assignedDeveloperName && (
              <div className='bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                  <Award className='h-4 w-4 text-purple-500' />
                  承接开发者
                </h3>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                    {selectedIdea.assignedDeveloperName.charAt(0)}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {selectedIdea.assignedDeveloperName}
                    </p>
                    <p className='text-xs text-gray-500'>已承接开发</p>
                  </div>
                </div>
              </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-green-500' />
                安全保障
              </h3>
              <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>平台审核，确保需求真实有效</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>开发者实名认证，靠谱有保障</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>全程沟通记录，有据可查</span>
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
      <div className='mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
          <button
            onClick={() => window.history.back()}
            className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 w-fit'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>返回</span>
          </button>

          <div className='flex items-center gap-2'>
            {currentRole === 'developer' ? (
              <div className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium'>
                <Code2 className='h-4 w-4' />
                开发者模式
              </div>
            ) : (
              <button
                onClick={() => setView('becomeDev')}
                className='flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all'
              >
                <Code2 className='h-4 w-4' />
                开发者入驻
              </button>
            )}
            <button
              onClick={() => setView('devList')}
              className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
            >
              <Users className='h-4 w-4' />
              找开发者
            </button>
          </div>
        </div>

        <div className='bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl p-6 text-white mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold mb-2'>
                {currentRole === 'developer' ? '💼 发现需求，接单赚收益' : '🛠️ 工具需求大厅'}
              </h1>
              <p className='text-white/80 text-sm sm:text-base'>
                {currentRole === 'developer'
                  ? '浏览需求池，找到适合你的项目，用技术创造价值'
                  : '想要的工具找不到？发布需求，开发者帮你实现'}
              </p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowForm(true)}
                className='px-5 py-2.5 bg-white text-orange-600 font-medium rounded-xl hover:bg-orange-50 transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap'
              >
                <Plus className='h-5 w-5' />
                发布需求
              </button>
            </div>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'>
            <div className='bg-white/20 backdrop-blur-sm rounded-xl p-3'>
              <p className='text-2xl font-bold'>{stats.total}</p>
              <p className='text-xs text-white/80'>总需求数</p>
            </div>
            <div className='bg-white/20 backdrop-blur-sm rounded-xl p-3'>
              <p className='text-2xl font-bold'>{stats.bidding}</p>
              <p className='text-xs text-white/80'>招募中</p>
            </div>
            <div className='bg-white/20 backdrop-blur-sm rounded-xl p-3'>
              <p className='text-2xl font-bold'>{stats.completed}</p>
              <p className='text-xs text-white/80'>已完成</p>
            </div>
            <div className='bg-white/20 backdrop-blur-sm rounded-xl p-3'>
              <p className='text-2xl font-bold'>{stats.devCount}</p>
              <p className='text-xs text-white/80'>开发者</p>
            </div>
          </div>
        </div>

        <div className='relative mb-4'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='搜索需求关键词...'
              className='w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            />
          </div>
        </div>

        <div className='flex lg:hidden gap-2 mb-4'>
          <button
            onClick={() => setShowFilterMobile(true)}
            className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            <Filter className='h-4 w-4' />
            筛选
          </button>
          <div className='flex-1 flex items-center justify-end gap-2'>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg ${
                viewMode === 'card'
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className='h-4 w-4' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {showFilterMobile && (
        <div className='fixed inset-0 bg-black/50 z-50 lg:hidden' onClick={() => setShowFilterMobile(false)}>
          <div
            className='absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>筛选条件</h3>
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
              共 <span className='font-medium text-gray-900 dark:text-gray-100'>{filteredIdeas.length}</span> 个需求
            </p>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>排序：</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className='px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500'
              >
                <option value='newest'>最新发布</option>
                <option value='votes'>最多点赞</option>
                <option value='bids'>最多投标</option>
              </select>
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className='text-center py-16 text-gray-500'>
              <Lightbulb className='h-16 w-16 mx-auto mb-4 opacity-30' />
              <p className='text-lg mb-2'>暂无匹配的需求</p>
              <p className='text-sm text-gray-400'>换个筛选条件试试，或者发布第一个需求吧~</p>
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
                <Sparkles className='h-5 w-5 text-orange-500' />
                发布工具需求
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
                <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>发布成功！</h4>
                <p className='text-gray-500 text-sm'>开发者们会很快看到你的需求~</p>
              </div>
            ) : (
              <div className='p-4 space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    需求标题 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='一句话描述你想要什么工具'
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    详细描述 <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='描述一下这个工具的功能、使用场景，越详细越容易被开发者看到哦~'
                    rows={4}
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                      分类
                    </label>
                    <select
                      value={ideaCategory}
                      onChange={(e) => setIdeaCategory(e.target.value)}
                      className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
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
                        预算
                      </div>
                    </label>
                    <input
                      type='text'
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder='免费 / 打赏 / 金额'
                      className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    <div className='flex items-center gap-1'>
                      <Timer className='h-3.5 w-3.5' />
                      期望完成时间
                    </div>
                  </label>
                  <input
                    type='text'
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder='选填，如：一周内 / 越快越好'
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    <div className='flex items-center gap-1.5'>
                      <User className='h-4 w-4' />
                      你的昵称
                    </div>
                  </label>
                  <input
                    type='text'
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder='选填，默认为"匿名用户"'
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                    <div className='flex items-center gap-1.5'>
                      <Mail className='h-4 w-4' />
                      联系方式
                    </div>
                  </label>
                  <input
                    type='text'
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder='选填，开发者中标后可以联系你'
                    className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                  />
                  <p className='text-xs text-gray-400 mt-1'>🔒 仅在开发者投标后可见，不会公开</p>
                </div>

                <button
                  onClick={handleSubmitIdea}
                  disabled={!title.trim() || !description.trim()}
                  className='w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  <Send className='h-5 w-5' />
                  发布需求
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
