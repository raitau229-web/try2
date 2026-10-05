import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{ text: string; kind: "error" | "info" } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!hasSupabaseConfig) {
    return (
      <div className="empty-state">
        共有・検索機能を使うにはSupabaseの接続設定が必要です。README を参照して
        VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定してください。
      </div>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ text: "メールアドレスまたはパスワードが違います。", kind: "error" });
      else navigate("/discover");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      });
      if (error) setMessage({ text: `登録できませんでした: ${error.message}`, kind: "error" });
      else if (!data.session)
        setMessage({ text: "確認メールを送りました。メール内のリンクを開いてからログインしてください。", kind: "info" });
      else navigate("/discover");
    }
    setBusy(false);
  }

  return (
    <div>
      <h2 className="page-heading">{mode === "login" ? "ログイン" : "アカウントを作成"}</h2>
      <form onSubmit={submit} className="card">
        {mode === "signup" && (
          <div className="field">
            <label>表示名</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} required />
          </div>
        )}
        <div className="field">
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label>パスワード（6文字以上）</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </div>
        {message && (
          <p className={`notice ${message.kind === "error" ? "notice-error" : ""}`} role="alert">
            {message.text}
          </p>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {mode === "login" ? "ログイン" : "アカウントを作成"}
        </button>
      </form>
      <p className="muted">
        {mode === "login" ? "はじめての方は " : "アカウントをお持ちの方は "}
        <button
          type="button"
          className="btn-text"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage(null);
          }}
        >
          {mode === "login" ? "アカウントを作成" : "ログイン"}
        </button>
      </p>
    </div>
  );
}
