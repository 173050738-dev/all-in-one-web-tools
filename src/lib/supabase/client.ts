import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client
 * Used in frontend components for user data operations (protected by RLS policies)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
