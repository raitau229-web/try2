import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// URL/キー未設定でもアプリ自体（行程表・予算管理）はローカルだけで動作させたいので、
// ここでは例外を投げず、共有・検索・いいね機能を使おうとした時にエラーメッセージを出す。
export const hasSupabaseConfig = Boolean(url && anonKey);

export const supabase = createClient(
  url || "https://placeholder.invalid",
  anonKey || "placeholder-anon-key"
);
