import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export interface WorkflowsState {
  workflows: CustomWorkflow[];
  activeWorkflowId: string | null;
  workflowResults: Record<string, any>;
  showWorkflowModal: boolean;
  workflowRatings: Record<string, number>;
  customWorkflows: CustomWorkflow[];
  workflowProgress: Record<string, WorkflowProgress>;
  workflowGroups: WorkflowGroup[];
  workflowStats: WorkflowStats;
  favoriteWorkflows: string[];
  saveWorkflow: (workflow: Partial<CustomWorkflow> & { title: string; steps: CustomWorkflowStep[] }) => CustomWorkflow;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string) => CustomWorkflow | null;
  runWorkflow: (workflowId: string) => void;
  setActiveWorkflowId: (id: string | null) => void;
  setShowWorkflowModal: (show: boolean) => void;
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
}

export const useWorkflowsStore = create<WorkflowsState>()(
  persist(
    (set, get) => ({
      workflows: [],
      activeWorkflowId: null,
      workflowResults: {},
      showWorkflowModal: false,
      workflowRatings: {},
      customWorkflows: [],
      workflowProgress: {},
      workflowGroups: [],
      workflowStats: {
        totalCompleted: 0,
        totalSteps: 0,
        totalTimeSavedMinutes: 0,
        streakDays: 0,
        completedWorkflows: [],
      },
      favoriteWorkflows: [],
      saveWorkflow: (workflow) => {
        const newWorkflow: CustomWorkflow = {
          id: workflow.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          title: workflow.title,
          description: workflow.description || '',
          steps: workflow.steps,
          icon: workflow.icon,
          category: workflow.category,
          tags: workflow.tags,
          estimatedTime: workflow.estimatedTime,
          difficulty: workflow.difficulty,
          groupId: workflow.groupId,
          createdAt: Date.now(),
          isShared: workflow.isShared,
        };
        set((state) => ({
          customWorkflows: [newWorkflow, ...state.customWorkflows],
          workflows: [newWorkflow, ...state.workflows],
        }));
        return newWorkflow;
      },
      deleteWorkflow: (id) =>
        set((state) => ({
          customWorkflows: state.customWorkflows.filter((w) => w.id !== id),
          workflows: state.workflows.filter((w) => w.id !== id),
        })),
      duplicateWorkflow: (id) => {
        const state = get();
        const original = state.customWorkflows.find((w) => w.id === id) || state.workflows.find((w) => w.id === id);
        if (!original) return null;
        const duplicated: CustomWorkflow = {
          ...original,
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          title: `${original.title} (副本)`,
          createdAt: Date.now(),
          updatedAt: undefined,
        };
        set((s) => ({
          customWorkflows: [duplicated, ...s.customWorkflows],
          workflows: [duplicated, ...s.workflows],
        }));
        return duplicated;
      },
      runWorkflow: (workflowId) => {
        set({ activeWorkflowId: workflowId, showWorkflowModal: true });
      },
      setActiveWorkflowId: (id) => set({ activeWorkflowId: id }),
      setShowWorkflowModal: (show) => set({ showWorkflowModal: show }),
      setWorkflowRating: (workflowId, rating) =>
        set((state) => ({
          workflowRatings: {
            ...state.workflowRatings,
            [workflowId]: rating,
          },
        })),
      getWorkflowRating: (workflowId) => get().workflowRatings[workflowId] || 0,
      addCustomWorkflow: (workflow) =>
        set((state) => ({
          customWorkflows: [
            { ...workflow, id: workflow.id || `custom-${Date.now()}`, createdAt: Date.now() },
            ...state.customWorkflows,
          ],
          workflows: [
            { ...workflow, id: workflow.id || `custom-${Date.now()}`, createdAt: Date.now() },
            ...state.workflows,
          ],
        })),
      removeCustomWorkflow: (id) =>
        set((state) => ({
          customWorkflows: state.customWorkflows.filter((w) => w.id !== id),
          workflows: state.workflows.filter((w) => w.id !== id),
        })),
      updateCustomWorkflow: (id, updates) =>
        set((state) => ({
          customWorkflows: state.customWorkflows.map((w) =>
            w.id === id ? { ...w, ...updates, updatedAt: Date.now() } : w
          ),
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, ...updates, updatedAt: Date.now() } : w
          ),
        })),
      toggleWorkflowFavorite: (workflowId) =>
        set((state) => ({
          favoriteWorkflows: state.favoriteWorkflows.includes(workflowId)
            ? state.favoriteWorkflows.filter((id) => id !== workflowId)
            : [...state.favoriteWorkflows, workflowId],
        })),
      isWorkflowFavorite: (workflowId) => get().favoriteWorkflows.includes(workflowId),
      startWorkflowProgress: (workflowId, workflowType, totalSteps) =>
        set((state) => {
          const existing = state.workflowProgress[workflowId];
          if (existing) return state;
          return {
            workflowProgress: {
              ...state.workflowProgress,
              [workflowId]: {
                workflowId,
                workflowType,
                totalSteps,
                completedSteps: [],
                startedAt: Date.now(),
                lastActiveAt: Date.now(),
              },
            },
          };
        }),
      toggleStepComplete: (workflowId, stepIndex) =>
        set((state) => {
          const progress = state.workflowProgress[workflowId];
          if (!progress) return state;

          const isCompleted = progress.completedSteps.includes(stepIndex);
          const newCompletedSteps = isCompleted
            ? progress.completedSteps.filter((i) => i !== stepIndex)
            : [...progress.completedSteps, stepIndex];

          return {
            workflowProgress: {
              ...state.workflowProgress,
              [workflowId]: {
                ...progress,
                completedSteps: newCompletedSteps,
                lastActiveAt: Date.now(),
              },
            },
          };
        }),
      getWorkflowProgress: (workflowId) => get().workflowProgress[workflowId],
      clearWorkflowProgress: (workflowId) =>
        set((state) => {
          const newProgress = { ...state.workflowProgress };
          delete newProgress[workflowId];
          return { workflowProgress: newProgress };
        }),
      addWorkflowGroup: (name) =>
        set((state) => ({
          workflowGroups: [
            ...state.workflowGroups,
            { id: `group-${Date.now()}`, name, createdAt: Date.now() },
          ],
        })),
      removeWorkflowGroup: (id) =>
        set((state) => ({
          workflowGroups: state.workflowGroups.filter((g) => g.id !== id),
          customWorkflows: state.customWorkflows.map((w) =>
            w.groupId === id ? { ...w, groupId: undefined } : w
          ),
          workflows: state.workflows.map((w) =>
            w.groupId === id ? { ...w, groupId: undefined } : w
          ),
        })),
      renameWorkflowGroup: (id, name) =>
        set((state) => ({
          workflowGroups: state.workflowGroups.map((g) =>
            g.id === id ? { ...g, name } : g
          ),
        })),
      moveWorkflowToGroup: (workflowId, groupId) =>
        set((state) => ({
          customWorkflows: state.customWorkflows.map((w) =>
            w.id === workflowId ? { ...w, groupId: groupId || undefined } : w
          ),
          workflows: state.workflows.map((w) =>
            w.id === workflowId ? { ...w, groupId: groupId || undefined } : w
          ),
        })),
      recordWorkflowComplete: (workflowId, stepsCount) =>
        set((state) => {
          const today = new Date().toDateString();
          const lastDate = state.workflowStats.lastActiveDate;
          let newStreak = state.workflowStats.streakDays;

          if (lastDate) {
            const last = new Date(lastDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }

          const alreadyCompleted = state.workflowStats.completedWorkflows.includes(workflowId);

          return {
            workflowStats: {
              totalCompleted: state.workflowStats.totalCompleted + 1,
              totalSteps: state.workflowStats.totalSteps + stepsCount,
              totalTimeSavedMinutes: state.workflowStats.totalTimeSavedMinutes + Math.round(stepsCount * 5),
              streakDays: newStreak,
              lastActiveDate: today,
              completedWorkflows: alreadyCompleted
                ? state.workflowStats.completedWorkflows
                : [...state.workflowStats.completedWorkflows, workflowId],
            },
            workflowProgress: {
              ...state.workflowProgress,
              [workflowId]: {
                ...state.workflowProgress[workflowId],
                completedAt: Date.now(),
              },
            },
          };
        }),
    }),
    {
      name: 'tool-hub-workflows',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        try {
          const __t = '__zustand_ls_probe__';
          localStorage.setItem(__t, '1');
          localStorage.removeItem(__t);
          return {
            getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
            setItem: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
            removeItem: (k) => { try { localStorage.removeItem(k); } catch {} },
          };
        } catch {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
      }),
    }
  )
);
