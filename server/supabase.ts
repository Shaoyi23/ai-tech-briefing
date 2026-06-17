import { createClient } from "@supabase/supabase-js";

export type ArticleRow = {
  id: string;
  title: string;
  translated_title: string | null;
  source: string;
  category: string;
  published_at: string | null;
  summary: string;
  key_points: string[] | null;
  keywords: string[] | null;
  url: string;
  bookmarked: boolean | null;
};

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
