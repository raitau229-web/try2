import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/useTripStore";

export function CreateTripPage() {
  const addTrip = useTripStore((s) => s.actions.addTrip);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");

  function handleCreate() {
    if (!title.trim()) return;
    const id = addTrip(title.trim(), area.trim());
    navigate(`/trips/${id}`);
  }

  return (
    <div>
      <h2 className="page-heading">新しい旅程を作成</h2>
      <div className="card">
        <div className="field">
          <label>タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 京都1泊2日"
            autoFocus
          />
        </div>
        <div className="field">
          <label>エリア</label>
          <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="例: 京都" />
        </div>
        <button className="btn btn-primary" onClick={handleCreate} disabled={!title.trim()}>
          作成する
        </button>
      </div>
      <p className="muted">
        作成後は行程表タブで場所の追加・並び替え・予算管理ができます。旅程が完成したら検索タブから他のユーザーに共有できます。
      </p>
    </div>
  );
}
