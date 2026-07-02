import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Idea {
  id: string;
  title: string;
  description: string;
  contact?: string;
  authorName?: string;
  authorId?: string;
  status: 'pending' | 'reviewing' | 'bidding' | 'developing' | 'completed' | 'rejected';
  votes: number;
  votedBy: string[];
  createdAt: number;
  updatedAt?: number;
  adminReply?: string;
  category?: string;
  budget?: string;
  deadline?: string;
  assignedDeveloperId?: string;
  assignedDeveloperName?: string;
  bidsCount?: number;
}

export interface Developer {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  skills: string[];
  bio: string;
  contact: string;
  completedProjects: number;
  rating: number;
  joinedAt: number;
}

export interface Bid {
  id: string;
  ideaId: string;
  developerId: string;
  developerName: string;
  developerTitle?: string;
  proposal: string;
  price: string;
  deliveryTime: string;
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Comment {
  id: string;
  ideaId: string;
  authorId: string;
  authorName: string;
  authorRole: 'user' | 'developer' | 'admin';
  content: string;
  createdAt: number;
  replyTo?: string;
}

export interface CommunityState {
  ideaVotes: Record<string, boolean>;
  myIdeas: string[];
  userId: string;
  hasAcceptedTerms: boolean;
  ideas: Idea[];
  developers: Developer[];
  bids: Bid[];
  comments: Comment[];
  currentRole: 'user' | 'developer';
  currentDeveloperId?: string;
  _ensureUserId: () => string;
  _resolveUserId: () => string;
  setAcceptedTerms: (accepted: boolean) => void;
  voteIdea: (ideaId: string) => void;
  hasVotedIdea: (ideaId: string) => boolean;
  getMyIdeas: () => Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'status' | 'votes' | 'votedBy' | 'createdAt' | 'bidsCount'>) => Idea;
  updateIdea: (ideaId: string, updates: Partial<Idea>) => void;
  setCurrentRole: (role: 'user' | 'developer') => void;
  addDeveloper: (dev: Omit<Developer, 'id' | 'completedProjects' | 'rating' | 'joinedAt'>) => Developer;
  updateDeveloper: (devId: string, updates: Partial<Developer>) => void;
  getCurrentDeveloper: () => Developer | undefined;
  addBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'status'>) => Bid;
  getBidsByIdea: (ideaId: string) => Bid[];
  acceptBid: (bidId: string, ideaId: string) => void;
  rejectBid: (bidId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Comment;
  getCommentsByIdea: (ideaId: string) => Comment[];
}

const BASE_DATE = 1782969600000;
const DAY = 86400000;

const defaultDevelopers: Developer[] = [
  {
    id: 'dev-1',
    name: '代码小能手',
    title: '全栈开发工程师',
    skills: ['React', 'Node.js', 'TypeScript', 'Canvas'],
    bio: '5年前端开发经验，擅长各种在线小工具开发，高效保质~',
    contact: 'dev1@example.com',
    completedProjects: 28,
    rating: 4.9,
    joinedAt: BASE_DATE - DAY * 90,
  },
  {
    id: 'dev-2',
    name: 'UI魔法师',
    title: '前端+UI设计师',
    skills: ['Vue', 'CSS动画', 'Figma', '响应式设计'],
    bio: '设计+开发一条龙，做出来的工具不仅好用还好看！',
    contact: 'dev2@example.com',
    completedProjects: 15,
    rating: 4.8,
    joinedAt: BASE_DATE - DAY * 60,
  },
  {
    id: 'dev-3',
    name: '极客小王',
    title: 'AI工具开发专家',
    skills: ['Python', 'AI/ML', 'API集成', '自动化'],
    bio: '专注AI相关工具开发，各种API集成轻车熟路~',
    contact: 'dev3@example.com',
    completedProjects: 42,
    rating: 5.0,
    joinedAt: BASE_DATE - DAY * 120,
  },
];

const defaultBids: Bid[] = [
  {
    id: 'bid-1',
    ideaId: 'idea-8',
    developerId: 'dev-1',
    developerName: '代码小能手',
    developerTitle: '全栈开发工程师',
    proposal: '这个需求我很熟悉！之前做过类似的图片处理工具。预计3天可以完成第一版，支持主流格式压缩，后续可以迭代增加更多功能。',
    price: '免费 / 打赏支持',
    deliveryTime: '3天',
    createdAt: BASE_DATE - DAY * 1,
    status: 'pending',
  },
  {
    id: 'bid-2',
    ideaId: 'idea-8',
    developerId: 'dev-2',
    developerName: 'UI魔法师',
    developerTitle: '前端+UI设计师',
    proposal: '我可以做！不仅功能实现，界面也会做得很漂亮，支持各种滤镜效果。一周内交付，保证满意~',
    price: '50元打赏',
    deliveryTime: '7天',
    createdAt: BASE_DATE - DAY * 0.5,
    status: 'pending',
  },
];

const defaultComments: Comment[] = [
  {
    id: 'comment-1',
    ideaId: 'idea-8',
    authorId: 'user-1',
    authorName: '摄影爱好者',
    authorRole: 'user',
    content: '强烈支持！手机上压缩图片太不方便了',
    createdAt: BASE_DATE - DAY * 2,
  },
  {
    id: 'comment-2',
    ideaId: 'idea-8',
    authorId: 'dev-1',
    authorName: '代码小能手',
    authorRole: 'developer',
    content: '这个不难做，用Canvas就能实现，有需要的可以找我~',
    createdAt: BASE_DATE - DAY * 1.5,
  },
];

const defaultIdeas: Idea[] = [
  {
    id: 'idea-1',
    title: '希望有一个表情制作工具',
    description: '可以自己做表情包，加文字加特效那种，斗图必备！',
    authorName: '小明',
    status: 'completed',
    votes: 128,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 30,
    adminReply: '已上线Emoji表情合成器，快去试试吧！',
    category: 'image-tools',
    budget: '免费',
    assignedDeveloperName: '代码小能手',
    bidsCount: 3,
  },
  {
    id: 'idea-2',
    title: '想要一个九宫格切图',
    description: '发朋友圈用的，把一张图切成9张，排列起来超有逼格',
    authorName: '小红',
    status: 'completed',
    votes: 96,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 20,
    adminReply: '已上线九宫格切图工具，一键生成！',
    category: 'image-tools',
    budget: '免费',
    assignedDeveloperName: 'UI魔法师',
    bidsCount: 2,
  },
  {
    id: 'idea-3',
    title: '能不能做一个头像加V的工具',
    description: '微博那种V认证，给头像加个金色V，装逼神器哈哈',
    authorName: '阿强',
    status: 'completed',
    votes: 75,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 15,
    adminReply: '已上线头像装饰器，加V、边框、挂件都有！',
    category: 'image-tools',
    budget: '免费',
    assignedDeveloperName: 'UI魔法师',
    bidsCount: 4,
  },
  {
    id: 'idea-4',
    title: '随机选择困难症救星',
    description: '中午吃什么、周末去哪玩，选不出来的时候让系统帮我选',
    authorName: '纠结星人',
    status: 'developing',
    votes: 62,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 10,
    adminReply: '已经在做啦！决定转盘和抽签筒都安排上了~',
    category: 'lifestyle',
    budget: '免费',
    assignedDeveloperName: '代码小能手',
    bidsCount: 5,
  },
  {
    id: 'idea-5',
    title: '朋友圈文案生成器',
    description: '每次发朋友圈都不知道配什么文字，救救孩子吧',
    authorName: '文艺青年',
    status: 'completed',
    votes: 89,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 7,
    adminReply: '已上线！8大分类上百条文案任你选~',
    category: 'lifestyle',
    budget: '免费',
    assignedDeveloperName: 'UI魔法师',
    bidsCount: 2,
  },
  {
    id: 'idea-6',
    title: '手机壁纸生成器',
    description: '自定义渐变背景+文字，做专属壁纸',
    authorName: '设计小白',
    status: 'developing',
    votes: 54,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 5,
    adminReply: '正在开发中，敬请期待！',
    category: 'image-tools',
    budget: '免费',
    assignedDeveloperName: '极客小王',
    bidsCount: 3,
  },
  {
    id: 'idea-7',
    title: '能不能做个AI自动生成工具',
    description: '我描述想要什么工具，AI自动生成出来，那就太酷了！',
    authorName: '科技迷',
    status: 'reviewing',
    votes: 234,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 3,
    adminReply: '这个想法超棒！我们正在研究技术可行性~',
    category: 'ai-tools',
    budget: '待定',
    bidsCount: 0,
  },
  {
    id: 'idea-8',
    title: '手机图片压缩工具',
    description: '手机里照片太大了，想发朋友圈都发不出去。需要一个能在手机上直接压缩图片的工具，支持批量压缩，压缩后可以直接下载。最好能调节压缩质量，不要太失真。',
    authorName: '摄影爱好者',
    status: 'bidding',
    votes: 156,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 3,
    category: 'image-tools',
    budget: '免费 / 可打赏',
    deadline: '一周内',
    bidsCount: 2,
  },
  {
    id: 'idea-9',
    title: 'AI写作助手',
    description: '想写东西的时候没思路，输入关键词就能生成文案的工具。支持多种风格：正式、幽默、文艺、营销文案等。最好还能一键复制。',
    authorName: '文案狗',
    status: 'bidding',
    votes: 89,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 2,
    category: 'ai-tools',
    budget: '免费 / 20元打赏',
    deadline: '10天内',
    bidsCount: 1,
  },
  {
    id: 'idea-10',
    title: '番茄钟工作法计时器',
    description: '工作25分钟休息5分钟的番茄钟，要有统计功能，看看每天专注了多久。支持自定义时长，有白噪音就更好了。',
    authorName: '效率达人',
    status: 'pending',
    votes: 45,
    votedBy: [],
    createdAt: BASE_DATE - DAY * 1,
    category: 'productivity',
    budget: '免费',
    bidsCount: 0,
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      ideaVotes: {},
      myIdeas: [],
      userId: '',
      hasAcceptedTerms: false,
      ideas: defaultIdeas,
      developers: defaultDevelopers,
      bids: defaultBids,
      comments: defaultComments,
      currentRole: 'user',
      _ensureUserId: () => {
        const state = get();
        if (state.userId) return state.userId;
        if (typeof window !== 'undefined') {
          try {
            const storedId = localStorage.getItem('userId');
            if (storedId) {
              set({ userId: storedId });
              return storedId;
            }
          } catch (e) {
          }
        }
        const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('userId', newId);
          } catch (e) {
          }
        }
        set({ userId: newId });
        return newId;
      },
      _resolveUserId: () => {
        return get()._ensureUserId();
      },
      setAcceptedTerms: (accepted) => set({ hasAcceptedTerms: accepted }),
      voteIdea: (ideaId) => {
        const uid = get()._ensureUserId();
        set((state) => {
          return {
            userId: uid,
            ideaVotes: {
              ...state.ideaVotes,
              [ideaId]: !state.ideaVotes[ideaId],
            },
            myIdeas: state.ideas.find((i) => i.id === ideaId && i.authorId === uid)
              ? state.myIdeas
              : state.myIdeas,
            ideas: state.ideas.map((idea) => {
              if (idea.id !== ideaId) return idea;
              const voted = idea.votedBy.includes(uid);
              return {
                ...idea,
                votes: voted ? idea.votes - 1 : idea.votes + 1,
                votedBy: voted
                  ? idea.votedBy.filter((u) => u !== uid)
                  : [...idea.votedBy, uid],
              };
            }),
          };
        });
      },
      hasVotedIdea: (ideaId) => {
        const uid = get()._ensureUserId();
        const state = get();
        const idea = state.ideas.find((i) => i.id === ideaId);
        return idea ? idea.votedBy.includes(uid) : false;
      },
      getMyIdeas: () => {
        const uid = get()._ensureUserId();
        const state = get();
        return state.ideas.filter((idea) => idea.authorId === uid || idea.votedBy.includes(uid));
      },
      addIdea: (idea) => {
        const uid = get()._ensureUserId();
        const newIdea: Idea = {
          id: `idea-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          ...idea,
          authorId: uid,
          status: 'pending',
          votes: 0,
          votedBy: [],
          createdAt: Date.now(),
        };
        set((state) => ({
          ideas: [newIdea, ...state.ideas],
          myIdeas: [...state.myIdeas, newIdea.id],
        }));
        return newIdea;
      },
      updateIdea: (ideaId, updates) =>
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === ideaId ? { ...idea, ...updates, updatedAt: Date.now() } : idea
          ),
        })),
      setCurrentRole: (role) => set({ currentRole: role }),
      addDeveloper: (dev) => {
        const newDev: Developer = {
          id: `dev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          ...dev,
          completedProjects: 0,
          rating: 5.0,
          joinedAt: Date.now(),
        };
        set((state) => ({
          developers: [...state.developers, newDev],
          currentDeveloperId: newDev.id,
          currentRole: 'developer',
        }));
        return newDev;
      },
      updateDeveloper: (devId, updates) =>
        set((state) => ({
          developers: state.developers.map((d) =>
            d.id === devId ? { ...d, ...updates } : d
          ),
        })),
      getCurrentDeveloper: () => {
        const state = get();
        return state.developers.find((d) => d.id === state.currentDeveloperId);
      },
      addBid: (bid) => {
        const newBid: Bid = {
          id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          ...bid,
          createdAt: Date.now(),
          status: 'pending',
        };
        set((state) => ({
          bids: [...state.bids, newBid],
          ideas: state.ideas.map((idea) =>
            idea.id === bid.ideaId
              ? { ...idea, bidsCount: (idea.bidsCount || 0) + 1 }
              : idea
          ),
        }));
        return newBid;
      },
      getBidsByIdea: (ideaId) => {
        const state = get();
        return state.bids.filter((b) => b.ideaId === ideaId);
      },
      acceptBid: (bidId, ideaId) =>
        set((state) => {
          const bid = state.bids.find((b) => b.id === bidId);
          return {
            bids: state.bids.map((b) =>
              b.id === bidId
                ? { ...b, status: 'accepted' as const }
                : b.ideaId === ideaId
                ? { ...b, status: 'rejected' as const }
                : b
            ),
            ideas: state.ideas.map((idea) =>
              idea.id === ideaId
                ? {
                    ...idea,
                    status: 'developing' as const,
                    assignedDeveloperId: bid?.developerId,
                    assignedDeveloperName: bid?.developerName,
                  }
                : idea
            ),
          };
        }),
      rejectBid: (bidId) =>
        set((state) => ({
          bids: state.bids.map((b) =>
            b.id === bidId ? { ...b, status: 'rejected' as const } : b
          ),
        })),
      addComment: (comment) => {
        const newComment: Comment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          ...comment,
          createdAt: Date.now(),
        };
        set((state) => ({
          comments: [...state.comments, newComment],
        }));
        return newComment;
      },
      getCommentsByIdea: (ideaId) => {
        const state = get();
        return state.comments.filter((c) => c.ideaId === ideaId);
      },
    }),
    {
      name: 'tool-hub-community-v2',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        return localStorage;
      }),
      version: 1,
    }
  )
);
