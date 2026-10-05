# たびシェア（Trip Share）

行程表（タイムライン形式）・予算管理・旅程の共有/検索を1つにまとめた旅行計画アプリです。
[旅程作成らいた](../旅程作成らいた) の行程表・予算管理機能をベースに、
[snsひかる](../snsひかる) の共有・いいね機能をSupabaseバックエンドとして統合しました。

## 画面構成（下部タブ）

- **マイ旅程**: 自分が作成した旅程の一覧
- **作成**: 新しい旅程を作成
- **検索**: 他のユーザーが共有した旅程を閲覧・いいね

旅程の詳細画面には「行程表」「予算」「共有」の3タブがあり、「共有」タブから旅程を検索タブに公開できます。

## 主な機能

- **行程表タイムライン**: 場所を追加すると、移動時間を挟んだ1本の連続したリストとして表示されます。宿泊を追加すると自動的に「Day」が区切られます。
- **希望滞在時間・時刻のピン留め**: 滞在時間を入力すると以降の到着・出発時刻が自動計算されます。特定の場所だけ時刻を固定することもできます。
- **予算管理**: カテゴリ別の予算項目（計画額・実績額）を管理し、行程表の場所や移動と紐付けられます。
- **Google Maps連携（任意）**: 設定画面で自分のGoogle Maps APIキーを登録すると、場所検索・移動ルートの自動計算が使えます。
- **旅程の共有・検索・いいね（Supabase）**: 作成した旅程を検索タブに公開すると、ログインした他のユーザーが閲覧・いいねできます。

## データの保存

- 旅行・行程・予算・APIキーなどの編集データは、ブラウザの **localStorage** にのみ保存されます（これまで通り、個人利用は完全にサーバーレス）。
- 「共有」タブで公開した旅程だけが、公開時点のスナップショットとして **Supabase** に保存されます。

## セットアップ

### 1. ローカル開発

```bash
npm install
npm run dev
```

### 2. 共有・検索機能を使う場合（任意）

共有・検索・いいねを使わず、行程表・予算管理だけを使う場合はこの手順は不要です。

1. **Supabase**: 新しいプロジェクトを作成 → `SQL Editor` に `supabase/schema.sql` を貼り付けて実行
2. **Supabase**: `Project Settings > API` の Project URL と anon (publishable) key をコピー
3. `cp .env.example .env.local` にコピーして `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を記入
4. **Supabase**: `Authentication > URL Configuration` の Site URL を本番URLに変更（開発中は `Authentication > Sign In / Providers > Email` の「Confirm email」をオフにするとメール確認を省略できます）

### 3. デプロイ（GitHub Pages）

`main` ブランチへのpushで GitHub Actions が自動的に GitHub Pages へデプロイします（`.github/workflows/deploy.yml`）。
共有機能を使う場合は、リポジトリの `Settings > Secrets and variables > Actions` に
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を登録してください。

## ビルド・Lint

```bash
npm run build
npm run lint
```

## 構成

- `supabase/schema.sql` — テーブル(profiles / shared_trips / likes)・サインアップ時のプロフィール自動作成・RLS
- `src/store/useTripStore.ts` — 行程表・予算のローカル永続ストア(zustand)
- `src/lib/sharing.ts` — 旅程の公開・取り消し・いいね(Supabase)
- `src/components/trip/` — マイ旅程一覧・作成・詳細(行程表/予算/共有)
- `src/components/discover/` — 検索タブ(共有フィード・詳細・いいね)
- `src/components/auth/LoginPage.tsx` — ログイン / 新規登録
