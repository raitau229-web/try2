-- たびシェア: Supabase の SQL Editor に貼り付けて実行してください
-- (行程表・予算管理そのものはブラウザのlocalStorageのみで完結します。
--  ここで作るテーブルは「検索タブ」への旅程の共有・いいね専用です)
--
-- 同じSupabaseプロジェクトを旧「たびプラン(ひかる)」から引き続き使う場合、
-- profiles / サインアップ時の自動プロフィール作成トリガーはすでに存在するため、
-- ここでは shared_trips / shared_trip_likes だけを追加する(profilesの再作成はしない)。
-- 新規プロジェクトの場合は、先に profiles テーブルとトリガーの作成が必要。
-- (該当部分はGitHubの旧 snsひかる リポジトリの supabase/schema.sql を参照)

create table public.shared_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  description text check (char_length(description) <= 2000),
  -- 公開した時点でのTrip/Stop/Legのスナップショット(jsonb)。
  -- 型は src/types/index.ts の SharedTripSnapshot と対応する。
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);
create index shared_trips_created_at_idx on public.shared_trips (created_at desc);

create table public.shared_trip_likes (
  shared_trip_id uuid not null references public.shared_trips(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (shared_trip_id, user_id)
);

-- Row Level Security
alter table public.shared_trips enable row level security;
alter table public.shared_trip_likes enable row level security;

create policy "shared trips are public" on public.shared_trips for select using (true);
create policy "insert own shared trip" on public.shared_trips for insert with check (auth.uid() = user_id);
create policy "update own shared trip" on public.shared_trips for update using (auth.uid() = user_id);
create policy "delete own shared trip" on public.shared_trips for delete using (auth.uid() = user_id);

create policy "shared trip likes are public" on public.shared_trip_likes for select using (true);
create policy "like as myself" on public.shared_trip_likes for insert with check (auth.uid() = user_id);
create policy "unlike my own like" on public.shared_trip_likes for delete using (auth.uid() = user_id);
