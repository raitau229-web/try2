import { Link } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";
import { useUser } from "../../lib/useUser";

export function Header() {
  const { user, ready } = useUser();

  return (
    <header className="top-header">
      <Link to="/" className="logo">
        <span className="logo-mark" aria-hidden="true" />
        たびシェア
      </Link>
      <div className="top-header-actions">
        {hasSupabaseConfig && ready && (
          user ? (
            <button className="btn-text" onClick={() => supabase.auth.signOut()}>
              ログアウト
            </button>
          ) : (
            <Link className="btn-text" to="/login">
              ログイン
            </Link>
          )
        )}
        <Link className="btn-icon" to="/settings" title="設定">
          ⚙
        </Link>
      </div>
    </header>
  );
}
