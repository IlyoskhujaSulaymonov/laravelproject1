import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    define: {
        // Pass environment variables to the frontend
        'import.meta.env.VITE_TELEGRAM_BOT_USERNAME': JSON.stringify(process.env.TELEGRAM_BOT_USERNAME || 'math_ai_integrator_bot'),
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: {
            origin: ['https://edu-system', 'http://edu-system', 'http://127.0.0.1:5173'],
            credentials: true,
        },
        hmr: {
            host: 'localhost',
            protocol: 'ws',
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './resources/js'),
        },
    },
});