/**
 * @deprecated 此文件为向后兼容层。新项目请直接使用以下拆分后的 store：
 * - useUiPreferencesStore  from '@/stores/ui-preferences'
 * - useSearchPreferencesStore  from '@/stores/search-preferences'
 * - useFavoritesStore  from '@/stores/favorites'
 * - useWorkflowsStore  from '@/stores/workflows'
 * - useApiKeysStore  from '@/stores/api-keys'
 * - useCommunityStore  from '@/stores/community'
 *
 * 迁移说明：
 * - 旧 persist name: 'tool-station-preferences' (加密存储，兼容现有用户数据)
 * - 新 persist name: 各子 store 独立命名，详见各文件
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptData, decryptData, generateSecureId } from '@/utils/security';
import { useUiPreferencesStore } from '@/stores/ui-preferences';
import { useSearchPreferencesStore } from '@/stores/search-preferences';
import { useFavoritesStore } from '@/stores/favorites';
import { useWorkflowsStore } from '@/stores/workflows';
import { useApiKeysStore } from '@/stores/api-keys';
import { useCommunityStore } from '@/stores/community';

export interface HistoryItem {
  toolId: string;
  timestamp: number;
}

export interface CustomWorkflowStep {
  toolSlug: string;
  title: string;
  description: string;
}

export interface CustomWorkflow {
  id: string;
  title: string;
  description: string;
  steps: CustomWorkflowStep[];
  icon?: string;
  category?: string;
  tags?: string[];
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'advanced';
  groupId?: string;
  createdAt: number;
  updatedAt?: number;
  isShared?: boolean;
}

export interface WorkflowProgress {
  workflowId: string;
  workflowType: 'official' | 'custom';
  completedSteps: number[];
  totalSteps: number;
  startedAt: number;
  lastActiveAt: number;
  completedAt?: number;
}

export interface WorkflowGroup {
  id: string;
  name: string;
  createdAt: number;
}

export interface WorkflowStats {
  totalCompleted: number;
  totalSteps: number;
  totalTimeSavedMinutes: number;
  streakDays: number;
  lastActiveDate?: string;
  completedWorkflows: string[];
}

export interface ApiKeyUsage {
  date: string;
  calls: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: number;
  lastUsedAt?: number;
  totalCalls: number;
  usage: ApiKeyUsage[];
  status: 'active' | 'revoked';
  scopes: string[];
}

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

interface PreferencesState {
  locale: string;
  theme: 'light' | 'dark';
  searchQuery: string;
  likedTools: string[];
  favoriteTools: string[];
  history: HistoryItem[];
  elderMode: boolean;
  highContrast: boolean;
  workflowRatings: Record<string, number>;
  customWorkflows: CustomWorkflow[];
  workflowProgress: Record<string, WorkflowProgress>;
  workflowGroups: WorkflowGroup[];
  workflowStats: WorkflowStats;
  favoriteWorkflows: string[];
  apiKeys: ApiKey[];
  ideas: Idea[];
  developers: Developer[];
  bids: Bid[];
  comments: Comment[];
  currentRole: 'user' | 'developer';
  currentDeveloperId?: string;
  userId: string;
  _resolveUserId: () => string;
  setLocale: (locale: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;
  toggleLike: (toolId: string) => void;
  isLiked: (toolId: string) => boolean;
  toggleFavorite: (toolId: string) => Promise<{ favorited: boolean; rolledBack?: boolean }> | void;
  isFavorite: (toolId: string) => boolean;
  clearFavorites: () => void;
  setFavoriteTools: (toolIds: string[]) => void;
  getFavoriteSlugs: () => string[];
  mergeFromServer: (serverSlugs: string[]) => void;
  addToHistory: (toolId: string) => void;
  removeFromHistory: (toolId: string) => void;
  clearHistory: () => void;
  toggleElderMode: () => void;
  toggleHighContrast: () => void;
  setWorkflowRating: (workflowId: string, rating: number) => void;
  getWorkflowRating: (workflowId: string) => number;
  addCustomWorkflow: (workflow: any) => void;
  removeCustomWorkflow: (id: string) => void;
  updateCustomWorkflow: (id: string, updates: Partial<CustomWorkflow>) => void;
  toggleWorkflowFavorite: (workflowId: string) => void;
  isWorkflowFavorite: (workflowId: string) => boolean;
  startWorkflowProgress: (workflowId: string, workflowType: 'official' | 'custom', totalSteps: number) => void;
  toggleStepComplete: (workflowId: string, stepIndex: number) => void;
  getWorkflowProgress: (workflowId: string) => WorkflowProgress | undefined;
  clearWorkflowProgress: (workflowId: string) => void;
  addWorkflowGroup: (name: string) => void;
  removeWorkflowGroup: (id: string) => void;
  renameWorkflowGroup: (id: string, name: string) => void;
  moveWorkflowToGroup: (workflowId: string, groupId: string | null) => void;
  recordWorkflowComplete: (workflowId: string, stepsCount: number) => void;
  addApiKey: (name: string, scopes?: string[]) => ApiKey;
  removeApiKey: (id: string) => void;
  updateApiKey: (id: string, updates: Partial<Pick<ApiKey, 'name' | 'scopes'>>) => void;
  revokeApiKey: (id: string) => void;
  recordApiKeyUsage: (key: string) => void;
  addIdea: (idea: Omit<Idea, 'id' | 'status' | 'votes' | 'votedBy' | 'createdAt' | 'bidsCount'>) => Idea;
  voteIdea: (ideaId: string) => void;
  hasVotedIdea: (ideaId: string) => boolean;
  getMyIdeas: () => Idea[];
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

const STORAGE_KEY = 'tool-station-preferences';

const secureStorage = {
  getItem: (name: string): Promise<string | null> => {
    try {
      if (typeof localStorage === 'undefined') return Promise.resolve(null);
      const encrypted = localStorage.getItem(name);
      if (!encrypted) return Promise.resolve(null);
      return Promise.resolve()
        .then(() => decryptData(encrypted))
        .catch(() => encrypted as any)
        .then((v) => (v === undefined || v === null ? null : (v as string | null)))
        .catch(() => null);
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (name: string, value: string): Promise<void> => {
    try {
      if (typeof localStorage === 'undefined') return Promise.resolve();
      return Promise.resolve()
        .then(() => encryptData(value))
        .catch(() => value)
        .then((encrypted) => {
          try { localStorage.setItem(name, encrypted as string); } catch { /* noop */ }
        })
        .catch(() => { try { localStorage.setItem(name, value); } catch { /* noop */ } });
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (name: string): void => {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.removeItem(name); } catch { /* noop */ }
  },
};

const initUi = () => {
  const s = useUiPreferencesStore.getState();
  return { locale: s.locale, theme: s.theme, elderMode: s.elderMode, highContrast: s.highContrast };
};
const initSearch = () => ({ searchQuery: useSearchPreferencesStore.getState().searchQuery });
const initFav = () => {
  const s = useFavoritesStore.getState();
  return { likedTools: s.likedTools, favoriteTools: s.favoriteTools, history: s.history };
};
const initWf = () => {
  const s = useWorkflowsStore.getState();
  return {
    workflowRatings: s.workflowRatings,
    customWorkflows: s.customWorkflows,
    workflowProgress: s.workflowProgress,
    workflowGroups: s.workflowGroups,
    workflowStats: s.workflowStats,
    favoriteWorkflows: s.favoriteWorkflows,
  };
};
const initApi = () => ({ apiKeys: useApiKeysStore.getState().apiKeys });
const initCmty = () => {
  const s = useCommunityStore.getState();
  return {
    ideas: s.ideas,
    developers: s.developers,
    bids: s.bids,
    comments: s.comments,
    currentRole: s.currentRole,
    currentDeveloperId: s.currentDeveloperId,
    userId: s.userId,
  };
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => {
      const subsInitialized = { current: false };
      const ensureSubs = () => {
        if (subsInitialized.current) return;
        subsInitialized.current = true;
        useUiPreferencesStore.subscribe((s) => set({
          locale: s.locale, theme: s.theme, elderMode: s.elderMode, highContrast: s.highContrast,
        }));
        useSearchPreferencesStore.subscribe((s) => set({ searchQuery: s.searchQuery }));
        useFavoritesStore.subscribe((s) => set({
          likedTools: s.likedTools, favoriteTools: s.favoriteTools, history: s.history,
        }));
        useWorkflowsStore.subscribe((s) => set({
          workflowRatings: s.workflowRatings,
          customWorkflows: s.customWorkflows,
          workflowProgress: s.workflowProgress,
          workflowGroups: s.workflowGroups,
          workflowStats: s.workflowStats,
          favoriteWorkflows: s.favoriteWorkflows,
        }));
        useApiKeysStore.subscribe((s) => set({ apiKeys: s.apiKeys }));
        useCommunityStore.subscribe((s) => set({
          ideas: s.ideas,
          developers: s.developers,
          bids: s.bids,
          comments: s.comments,
          currentRole: s.currentRole,
          currentDeveloperId: s.currentDeveloperId,
          userId: s.userId,
        }));
        set({
          ...(() => { const s = useUiPreferencesStore.getState(); return { locale: s.locale, theme: s.theme, elderMode: s.elderMode, highContrast: s.highContrast }; })(),
          ...(() => ({ searchQuery: useSearchPreferencesStore.getState().searchQuery }))(),
          ...(() => { const s = useFavoritesStore.getState(); return { likedTools: s.likedTools, favoriteTools: s.favoriteTools, history: s.history }; })(),
          ...(() => {
            const s = useWorkflowsStore.getState();
            return {
              workflowRatings: s.workflowRatings,
              customWorkflows: s.customWorkflows,
              workflowProgress: s.workflowProgress,
              workflowGroups: s.workflowGroups,
              workflowStats: s.workflowStats,
              favoriteWorkflows: s.favoriteWorkflows,
            };
          })(),
          ...(() => ({ apiKeys: useApiKeysStore.getState().apiKeys }))(),
          ...(() => {
            const s = useCommunityStore.getState();
            return {
              ideas: s.ideas,
              developers: s.developers,
              bids: s.bids,
              comments: s.comments,
              currentRole: s.currentRole,
              currentDeveloperId: s.currentDeveloperId,
              userId: s.userId,
            };
          })(),
        });
      };

      ensureSubs();

      if (typeof window !== 'undefined') {
        const syncAll = () => {
          set({
            ...(() => { const s = useUiPreferencesStore.getState(); return { locale: s.locale, theme: s.theme, elderMode: s.elderMode, highContrast: s.highContrast }; })(),
            ...(() => ({ searchQuery: useSearchPreferencesStore.getState().searchQuery }))(),
            ...(() => { const s = useFavoritesStore.getState(); return { likedTools: s.likedTools, favoriteTools: s.favoriteTools, history: s.history }; })(),
            ...(() => {
              const s = useWorkflowsStore.getState();
              return {
                workflowRatings: s.workflowRatings,
                customWorkflows: s.customWorkflows,
                workflowProgress: s.workflowProgress,
                workflowGroups: s.workflowGroups,
                workflowStats: s.workflowStats,
                favoriteWorkflows: s.favoriteWorkflows,
              };
            })(),
            ...(() => ({ apiKeys: useApiKeysStore.getState().apiKeys }))(),
            ...(() => {
              const s = useCommunityStore.getState();
              return {
                ideas: s.ideas,
                developers: s.developers,
                bids: s.bids,
                comments: s.comments,
                currentRole: s.currentRole,
                currentDeveloperId: s.currentDeveloperId,
                userId: s.userId,
              };
            })(),
          });
        };
        if (typeof queueMicrotask === 'function') queueMicrotask(syncAll);
        setTimeout(syncAll, 120);
        setTimeout(syncAll, 700);
      }

      return {
        ...initUi(),
        ...initSearch(),
        ...initFav(),
        ...initWf(),
        ...initApi(),
        ...initCmty(),
        _resolveUserId: () => {
          ensureSubs();
          return useCommunityStore.getState()._resolveUserId();
        },
        setLocale: (locale) => { ensureSubs(); useUiPreferencesStore.getState().setLocale(locale); },
        setTheme: (theme) => { ensureSubs(); useUiPreferencesStore.getState().setTheme(theme); },
        toggleTheme: () => { ensureSubs(); useUiPreferencesStore.getState().toggleTheme(); },
        setSearchQuery: (query) => { ensureSubs(); useSearchPreferencesStore.getState().setSearchQuery(query); },
        toggleLike: (toolId) => { ensureSubs(); useFavoritesStore.getState().toggleLike(toolId); },
        isLiked: (toolId) => { ensureSubs(); return get().likedTools.includes(toolId); },
        toggleFavorite: (toolId) => { ensureSubs(); return useFavoritesStore.getState().toggleFavorite(toolId); },
        isFavorite: (toolId) => { ensureSubs(); return get().favoriteTools.includes(toolId); },
        clearFavorites: () => { ensureSubs(); useFavoritesStore.getState().clearFavorites(); },
        setFavoriteTools: (toolIds) => { ensureSubs(); useFavoritesStore.getState().setFavoriteTools(toolIds); },
        getFavoriteSlugs: () => { ensureSubs(); return useFavoritesStore.getState().getFavoriteSlugs(); },
        mergeFromServer: (serverSlugs) => { ensureSubs(); useFavoritesStore.getState().mergeFromServer(serverSlugs); },
        addToHistory: (toolId) => { ensureSubs(); useFavoritesStore.getState().addToHistory(toolId); },
        removeFromHistory: (toolId) => { ensureSubs(); useFavoritesStore.getState().removeFromHistory(toolId); },
        clearHistory: () => { ensureSubs(); useFavoritesStore.getState().clearHistory(); },
        toggleElderMode: () => { ensureSubs(); useUiPreferencesStore.getState().toggleElderMode(); },
        toggleHighContrast: () => { ensureSubs(); useUiPreferencesStore.getState().toggleHighContrast(); },
        setWorkflowRating: (workflowId, rating) => { ensureSubs(); useWorkflowsStore.getState().setWorkflowRating(workflowId, rating); },
        getWorkflowRating: (workflowId) => { ensureSubs(); return get().workflowRatings[workflowId] ?? 0; },
        addCustomWorkflow: (workflow) => { ensureSubs(); return useWorkflowsStore.getState().addCustomWorkflow(workflow); },
        removeCustomWorkflow: (id) => { ensureSubs(); useWorkflowsStore.getState().removeCustomWorkflow(id); },
        updateCustomWorkflow: (id, updates) => { ensureSubs(); useWorkflowsStore.getState().updateCustomWorkflow(id, updates); },
        toggleWorkflowFavorite: (workflowId) => { ensureSubs(); useWorkflowsStore.getState().toggleWorkflowFavorite(workflowId); },
        isWorkflowFavorite: (workflowId) => { ensureSubs(); return get().favoriteWorkflows.includes(workflowId); },
        startWorkflowProgress: (workflowId, workflowType, totalSteps) => {
          ensureSubs(); useWorkflowsStore.getState().startWorkflowProgress(workflowId, workflowType, totalSteps);
        },
        toggleStepComplete: (workflowId, stepIndex) => {
          ensureSubs(); useWorkflowsStore.getState().toggleStepComplete(workflowId, stepIndex);
        },
        getWorkflowProgress: (workflowId) => { ensureSubs(); return get().workflowProgress[workflowId]; },
        clearWorkflowProgress: (workflowId) => { ensureSubs(); useWorkflowsStore.getState().clearWorkflowProgress(workflowId); },
        addWorkflowGroup: (name) => { ensureSubs(); useWorkflowsStore.getState().addWorkflowGroup(name); },
        removeWorkflowGroup: (id) => { ensureSubs(); useWorkflowsStore.getState().removeWorkflowGroup(id); },
        renameWorkflowGroup: (id, name) => { ensureSubs(); useWorkflowsStore.getState().renameWorkflowGroup(id, name); },
        moveWorkflowToGroup: (workflowId, groupId) => {
          ensureSubs(); useWorkflowsStore.getState().moveWorkflowToGroup(workflowId, groupId);
        },
        recordWorkflowComplete: (workflowId, stepsCount) => {
          ensureSubs(); useWorkflowsStore.getState().recordWorkflowComplete(workflowId, stepsCount);
        },
        addApiKey: (name, scopes) => { ensureSubs(); return useApiKeysStore.getState().addApiKey(name, scopes); },
        removeApiKey: (id) => { ensureSubs(); useApiKeysStore.getState().removeApiKey(id); },
        updateApiKey: (id, updates) => { ensureSubs(); useApiKeysStore.getState().updateApiKey(id, updates); },
        revokeApiKey: (id) => { ensureSubs(); useApiKeysStore.getState().revokeApiKey(id); },
        recordApiKeyUsage: (key) => { ensureSubs(); useApiKeysStore.getState().recordApiKeyUsage(key); },
        addIdea: (idea) => { ensureSubs(); return useCommunityStore.getState().addIdea(idea); },
        voteIdea: (ideaId) => { ensureSubs(); useCommunityStore.getState().voteIdea(ideaId); },
        hasVotedIdea: (ideaId) => { ensureSubs(); return useCommunityStore.getState().hasVotedIdea(ideaId); },
        getMyIdeas: () => { ensureSubs(); return useCommunityStore.getState().getMyIdeas(); },
        updateIdea: (ideaId, updates) => { ensureSubs(); useCommunityStore.getState().updateIdea(ideaId, updates); },
        setCurrentRole: (role) => { ensureSubs(); useCommunityStore.getState().setCurrentRole(role); },
        addDeveloper: (dev) => { ensureSubs(); return useCommunityStore.getState().addDeveloper(dev); },
        updateDeveloper: (devId, updates) => { ensureSubs(); useCommunityStore.getState().updateDeveloper(devId, updates); },
        getCurrentDeveloper: () => { ensureSubs(); return useCommunityStore.getState().getCurrentDeveloper(); },
        addBid: (bid) => { ensureSubs(); return useCommunityStore.getState().addBid(bid); },
        getBidsByIdea: (ideaId) => { ensureSubs(); return useCommunityStore.getState().getBidsByIdea(ideaId); },
        acceptBid: (bidId, ideaId) => { ensureSubs(); useCommunityStore.getState().acceptBid(bidId, ideaId); },
        rejectBid: (bidId) => { ensureSubs(); useCommunityStore.getState().rejectBid(bidId); },
        addComment: (comment) => { ensureSubs(); return useCommunityStore.getState().addComment(comment); },
        getCommentsByIdea: (ideaId) => { ensureSubs(); return useCommunityStore.getState().getCommentsByIdea(ideaId); },
      } as PreferencesState;
    },
    {
      name: STORAGE_KEY,
      storage: secureStorage as any,
      partialize: (_state) => ({}),
    }
  )
);
