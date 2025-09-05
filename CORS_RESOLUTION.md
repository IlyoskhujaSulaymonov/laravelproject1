# CORS Resolution Guide

This document explains how to resolve CORS (Cross-Origin Resource Sharing) issues in the edu-system application.

## Understanding the Problem

The CORS error occurs when:
1. Your main application runs on `https://edu-system` (secure HTTPS)
2. Vite's development server runs on `http://127.0.0.1:5173` (insecure HTTP)
3. Browsers block cross-origin requests by default for security reasons

## Solutions

### Solution 1: Built-in Laravel CORS Configuration

Laravel provides a built-in CORS middleware (`\Illuminate\Http\Middleware\HandleCors::class`) which is already registered in the Kernel.

### Solution 2: CORS Configuration File

The `config/cors.php` file has been created with proper configuration:

```php
'allowed_origins' => ['https://edu-system', 'http://edu-system', 'http://localhost:5173', 'http://127.0.0.1:5173'],
'supports_credentials' => true,
```

### Solution 3: Vite Configuration

The vite.config.js file has been updated with proper CORS settings:

```javascript
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
```

### Solution 4: Environment Configuration

The .env file has been updated with proper URL configuration:

```
APP_URL=https://edu-system
VITE_APP_URL="${APP_URL}"
```

## How to Test the Fix

1. Restart your Laravel development server:
   ```bash
   php artisan serve
   ```

2. Restart your Vite development server:
   ```bash
   npm run dev
   ```

3. Access your application at `https://edu-system`

## Alternative Solutions

### Using Laravel Sail (Docker)

If you're using Laravel Sail, you can use the built-in Vite support:

1. Start Sail with Vite:
   ```bash
   ./vendor/bin/sail up -d
   ```

2. Run Vite through Sail:
   ```bash
   ./vendor/bin/sail npm run dev
   ```

### Proxy Configuration

You can also configure a proxy in your web server (Apache/Nginx) to forward requests to Vite.

## Troubleshooting

If you're still experiencing issues:

1. Clear your browser cache
2. Check browser developer tools Network tab for specific error details
3. Verify that all configuration files have been updated correctly
4. Ensure that your web server is properly configured to handle HTTPS requests

## Security Considerations

The current CORS configuration is suitable for development but should be restricted in production:

1. Limit the `allowed_origins` to only trusted domains
2. Use specific headers instead of `*` in production