import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    https: false, // If you need HTTPS with mkcert, set this to true later
    cors: true,
    origin: 'http://127.0.0.1:5173',
    hmr: {
      host: '127.0.0.1',
      protocol: 'ws',
    },
  },
  plugins: [
    laravel({
      input: [
        'resources/js/app.tsx',
        'resources/css/app.css',
      ],
      refresh: true,
    }),
    react(),
  ],
})
