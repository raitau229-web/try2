import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTripStore } from "../../store/useTripStore";
import { TripCard } from "./TripCard";

export function TripListPage() {
  const tripsRecord = useTripStore((s) => s.trips);
  const trips = useMemo(
    () => Object.values(tripsRecord).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [tripsRecord]
  );

  return (
    <div>
      <h2 className="page-heading">マイ旅程</h2>
      {trips.length === 0 ? (
        <div className="empty-state">
          <p>まだ旅行がありません。</p>
          <Link className="btn btn-primary" to="/new">
            最初の旅程を作成
          </Link>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
