import { useEffect, useState } from "react";
import { fetchSharedFeed } from "../../lib/sharing";
import { hasSupabaseConfig } from "../../lib/supabase";
import type { SharedTrip } from "../../types";
import { SharedTripCard } from "./SharedTripCard";

export function DiscoverPage() {
  const [trips, setTrips] = useState<SharedTrip[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    fetchSharedFeed()
      .then(setTrips)
      .catch(() => setError("旅程を読み込めませんでした。時間をおいて再読み込みしてください。"));
  }, []);

  if (!hasSupabaseConfig) {
    return (
      <div className="empty-state">
        共有・検索機能を使うにはSupabaseの接続設定が必要です。README を参照して
        VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定してください。
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-heading">みんなの旅程</h2>
      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}
      {!error && trips === null && <p className="muted">読み込み中…</p>}
      {trips && trips.length === 0 && <div className="empty-state">まだ共有された旅程がありません。</div>}
      <div className="feed-list">{trips?.map((trip) => <SharedTripCard key={trip.id} trip={trip} />)}</div>
    </div>
  );
}
