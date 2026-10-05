import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { fetchSharedTrip } from "../../lib/sharing";
import { computeStopTimes, deriveDayGroups } from "../../lib/timeline";
import { hasSupabaseConfig } from "../../lib/supabase";
import type { SharedTrip, StopCategory } from "../../types";
import { LikeButton } from "./LikeButton";

const CATEGORY_ICON: Record<StopCategory, string> = {
  activity: "🎟",
  lodging: "🛏",
  other: "📍",
};

export function SharedTripDetailPage() {
  const { sharedId } = useParams<{ sharedId: string }>();
  const [trip, setTrip] = useState<SharedTrip | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    if (!sharedId) return;
    fetchSharedTrip(sharedId)
      .then((data) => {
        if (data) {
          setTrip(data);
          setState("ready");
        } else {
          setState("missing");
        }
      })
      .catch(() => setState("error"));
  }, [sharedId]);

  if (!hasSupabaseConfig) {
    return (
      <div className="empty-state">
        共有・検索機能を使うにはSupabaseの接続設定が必要です。README を参照してください。
      </div>
    );
  }
  if (state === "loading") return <p className="muted">読み込み中…</p>;
  if (state === "error")
    return (
      <p className="notice notice-error" role="alert">
        旅程を読み込めませんでした。
      </p>
    );
  if (state === "missing" || !trip)
    return (
      <div className="empty-state">
        この旅程は見つかりませんでした。削除された可能性があります。
        <br />
        <Link className="btn btn-primary" to="/discover">
          検索へ戻る
        </Link>
      </div>
    );

  const { snapshot } = trip;
  const dayGroups = deriveDayGroups(snapshot.stops);
  const computedTimes = computeStopTimes(snapshot.stops, indexLegs(snapshot.legs), snapshot.startDateTime);

  return (
    <article>
      <p className="card-dest">{snapshot.area || "エリア未設定"}</p>
      <h2 className="page-heading">{trip.title}</h2>
      <p className="muted">
        {trip.profiles?.display_name ?? "匿名"}
        {snapshot.plannedNights != null ? `　${snapshot.plannedNights}泊` : ""}
      </p>
      {trip.description && <p>{trip.description}</p>}

      <div className="itinerary-timeline" style={{ marginTop: 16 }}>
        {dayGroups.map((group, gi) => (
          <div key={group[0]?.id ?? gi}>
            <div className="day-divider">Day {gi + 1}</div>
            {group.map((stop) => {
              const time = computedTimes.get(stop.id);
              return (
                <div key={stop.id} className="stop-node stop-node-readonly">
                  <div className="stop-time-col">
                    <div className="stop-time">{time?.arrival ? format(time.arrival, "M/d HH:mm") : "--:--"}</div>
                  </div>
                  <div className="stop-rail">
                    <div className={`stop-marker${stop.category === "lodging" ? " stop-marker-lodging" : ""}`}>
                      {CATEGORY_ICON[stop.category]}
                    </div>
                  </div>
                  <div className={`stop-body card${stop.category === "lodging" ? " stop-body-lodging" : ""}`}>
                    <p className="card-title" style={{ margin: 0 }}>
                      {stop.name}
                    </p>
                    {stop.note && <p className="muted">{stop.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {snapshot.stops.length === 0 && <div className="empty-state">まだ場所が登録されていません。</div>}
      </div>

      <div className="detail-actions">
        <LikeButton sharedTripId={trip.id} initialLikers={trip.likes.map((l) => l.user_id)} />
      </div>
    </article>
  );
}

function indexLegs(legs: SharedTrip["snapshot"]["legs"]) {
  return Object.fromEntries(legs.map((leg) => [leg.id, leg]));
}
