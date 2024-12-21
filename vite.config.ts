import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3001,
    proxy: {
      '/cards': {
        target: 'https://images.ygoprodeck.com/images/cards_cropped',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cards/, ''),
      },
    },
  },
})
