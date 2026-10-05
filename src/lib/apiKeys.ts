// Viteはデフォルトで VITE_ プレフィックス付きの環境変数しかクライアントに公開しない。
// プレフィックス無しの環境変数はビルド後 import.meta.env 上に存在しないため、
// 実際にデフォルトキーとして機能させるには VITE_ を付ける必要がある。
const DEFAULT_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? null;
const DEFAULT_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? null;

export function resolveGoogleMapsApiKey(userKey: string | null): string | null {
  return userKey || DEFAULT_GOOGLE_MAPS_API_KEY || null;
}

export function resolveGeminiApiKey(userKey: string | null): string | null {
  return userKey || DEFAULT_GEMINI_API_KEY || null;
}

export function hasDefaultGoogleMapsApiKey(): boolean {
  return Boolean(DEFAULT_GOOGLE_MAPS_API_KEY);
}

export function hasDefaultGeminiApiKey(): boolean {
  return Boolean(DEFAULT_GEMINI_API_KEY);
}
