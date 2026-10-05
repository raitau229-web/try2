import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Vercelやドメイン直下で配信する場合は '/'。GitHub Pagesでリポジトリ名配下に
  // デプロイする場合は BASE_PATH (例: '/trip-share/') をビルド時に指定する。
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
