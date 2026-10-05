import { Link } from "react-router-dom";
import type { SharedTrip } from "../../types";
import { LikeButton } from "./LikeButton";

export function SharedTripCard({ trip }: { trip: SharedTrip }) {
  const { snapshot } = trip;
  const nights = snapshot.plannedNights;

  return (
    <article className="card feed-card">
      <p className="card-dest">{snapshot.area || "エリア未設定"}</p>
      <h3 className="card-title">
        <Link to={`/discover/${trip.id}`}>{trip.title}</Link>
      </h3>
      <p className="muted">
        {nights != null ? `${nights}泊` : "日数未定"} ・ {snapshot.stops.length}件の場所
      </p>
      {trip.description && <p className="card-desc">{trip.description}</p>}
      <div className="card-foot">
        <span className="meta">{trip.profiles?.display_name ?? "匿名"}</span>
        <LikeButton sharedTripId={trip.id} initialLikers={trip.likes.map((l) => l.user_id)} />
      </div>
    </article>
  );
}
