import { useStore } from "@/store/useStore";
import { createClient } from "@/lib/supabase/client";

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  maxFiles: number;
}

/**
 * Quota Guard Hook
 * Check if current user (or guest) has enough quota to perform operation
 * Returns whether allowed, reason, max files limit
 */
export function useQuotaGuard() {
  const { user, guestDailyUsed, incrementGuestUsage } = useStore();

  const checkQuota = async (requestedFileCount: number): Promise<QuotaCheckResult> => {
    // Logged-in user
    if (user) {
      const today = new Date().toISOString().split("T")[0];

      // If day changed, reset quota (optimistic reset on frontend, trigger handles backend)
      if (user.reset_at !== today) {
        const supabase = createClient();
        await supabase
          .from("profiles")
          .update({ daily_used: 0, reset_at: today })
          .eq("id", user.id);
        user.daily_used = 0;
        user.reset_at = today;
      }

      if (user.daily_used >= user.daily_limit) {
        return {
          allowed: false,
          reason: `Today quota exhausted (${user.daily_limit} uses), upgrade to Pro for more quota`,
          maxFiles: user.max_files_per_request,
        };
      }

      if (requestedFileCount > user.max_files_per_request) {
        return {
          allowed: false,
          reason: `Max ${user.max_files_per_request} files per request, selected ${requestedFileCount}`,
          maxFiles: user.max_files_per_request,
        };
      }

      return { allowed: true, maxFiles: user.max_files_per_request };
    }

    // Guest mode (stricter)
    if (guestDailyUsed >= 2) {
      return {
        allowed: false,
        reason: "Guest limited to 2 uses/day. Log in or sign up for more quota",
        maxFiles: 1,
      };
    }

    if (requestedFileCount > 1) {
      return {
        allowed: false,
        reason: "Guest can only process 1 file at a time. Log in to process more",
        maxFiles: 1,
      };
    }

    return { allowed: true, maxFiles: 1 };
  };

  const consumeQuota = async (toolType: string, fileCount: number) => {
    if (user) {
      const supabase = createClient();
      await supabase.rpc("increment_usage", {
        user_id: user.id,
        tool_type: toolType,
        file_count: fileCount,
      });
      // Optimistic local state update
      useStore.setState({
        user: { ...user, daily_used: user.daily_used + 1 },
      });
    } else {
      incrementGuestUsage();
    }
  };

  return { checkQuota, consumeQuota };
}
