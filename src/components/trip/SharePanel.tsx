import { useState } from "react";
import { Link } from "react-router-dom";
import { useTrip } from "../../hooks/useTrip";
import { useTripStore } from "../../store/useTripStore";
import { hasSupabaseConfig } from "../../lib/supabase";
import { useUser } from "../../lib/useUser";
import { publishTrip, unpublishTrip } from "../../lib/sharing";
import type { ID } from "../../types";

export function SharePanel({ tripId }: { tripId: ID }) {
  const { trip, stops } = useTrip(tripId);
  const legsRecord = useTripStore((s) => s.legs);
  const setTripSharedId = useTripStore((s) => s.actions.setTripSharedId);
  const { user } = useUser();
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!trip) return null;

  if (!hasSupabaseConfig) {
    return (
      <div className="card">
        <p className="muted">
          共有機能を使うにはSupabaseの接続設定が必要です（README参照）。
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card">
        <p className="muted">旅程を検索タブに共有するにはログインが必要です。</p>
        <Link className="btn btn-primary" to="/login">
          ログイン
        </Link>
      </div>
    );
  }

  async function handlePublish() {
    setBusy(true);
    setError(null);
    try {
      const legs = Object.values(legsRecord).filter((l) => l.tripId === tripId);
      const sharedId = await publishTrip(trip, stops, legs, user!.id, description || null);
      setTripSharedId(trip.id, sharedId);
    } catch {
      setError("共有できませんでした。時間をおいてもう一度お試しください。");
    }
    setBusy(false);
  }

  async function handleUnpublish() {
    if (!trip.sharedId) return;
    if (!window.confirm("検索タブへの公開を取り消しますか？")) return;
    setBusy(true);
    setError(null);
    try {
      await unpublishTrip(trip.sharedId);
      setTripSharedId(trip.id, null);
    } catch {
      setError("取り消しに失敗しました。");
    }
    setBusy(false);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>検索タブへの共有</h3>
      </div>
      {trip.sharedId ? (
        <>
          <p className="muted">
            ✓ 公開中です。行程表を編集したら「更新する」で最新の内容を反映できます。
          </p>
          <div className="row">
            <button className="btn btn-primary" onClick={handlePublish} disabled={busy}>
              更新する
            </button>
            <button className="btn-text danger" onClick={handleUnpublish} disabled={busy}>
              公開を取り消す
            </button>
            <Link className="btn" to={`/discover/${trip.sharedId}`}>
              公開ページを見る
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label>ひとこと紹介（任意）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="この旅程の見どころなど"
            />
          </div>
          <button className="btn btn-primary" onClick={handlePublish} disabled={busy}>
            検索タブに共有する
          </button>
        </>
      )}
      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
