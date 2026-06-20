import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * User role type
 */
export type UserRole = "free" | "pro" | "lifetime";

/**
 * User info interface
 */
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  daily_used: number;
  daily_limit: number;
  max_files_per_request: number;
  reset_at: string;
}

/**
 * Global state store
 * Contains user auth state, quota info, processing results etc.
 */
interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // Guest mode quota (no logged-in user)
  guestDailyUsed: number;
  incrementGuestUsage: () => void;
  resetGuestUsage: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),
      guestDailyUsed: 0,
      incrementGuestUsage: () =>
        set((state) => ({ guestDailyUsed: state.guestDailyUsed + 1 })),
      resetGuestUsage: () => set({ guestDailyUsed: 0 }),
    }),
    {
      name: "pdf-tools-storage",
      partialize: (state) => ({ guestDailyUsed: state.guestDailyUsed }),
    }
  )
);
