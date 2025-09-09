<?php

use DefStudio\Telegraph\Telegraph;

return [

    /*
    |--------------------------------------------------------------------------
    | Telegraph Models
    |--------------------------------------------------------------------------
    |
    | Here you can configure the models used by Telegraph.
    |
    */

    'models' => [
        'telegraph_bot' => DefStudio\Telegraph\Models\TelegraphBot::class,
        'telegraph_chat' => DefStudio\Telegraph\Models\TelegraphChat::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegraph Storage Driver
    |--------------------------------------------------------------------------
    |
    | Here you can configure the storage driver for Telegraph.
    |
    */

    'storage' => [
        'driver' => 'file', // file, database, redis
        'file' => [
            'path' => storage_path('telegraph'),
        ],
        'redis' => [
            'connection' => 'default',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegraph Bots
    |--------------------------------------------------------------------------
    |
    | Here you can configure the bots used by Telegraph.
    |
    */

    'bots' => [
        'default' => [
            'token' => env('TELEGRAM_BOT_TOKEN'),
            'name' => env('TELEGRAM_BOT_USERNAME', 'math_ai_integrator_bot'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegraph Webhook Route
    |--------------------------------------------------------------------------
    |
    | Here you can configure the webhook route for Telegraph.
    |
    */

    'webhook' => [
        'route' => '/telegraph/{token}/webhook',
        'middleware' => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegraph Polling
    |--------------------------------------------------------------------------
    |
    | Here you can configure the polling settings for Telegraph.
    |
    */

    'polling' => [
        'enabled' => false,
        'interval' => 5, // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegraph Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Here you can configure the rate limiting settings for Telegraph.
    |
    */

    'rate_limiting' => [
        'enabled' => true,
        'limit' => 100, // requests
        'decay' => 1, // minute
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegraph Debug Mode
    |--------------------------------------------------------------------------
    |
    | Here you can configure the debug mode for Telegraph.
    |
    */

    'debug' => [
        'enabled' => env('TELEGRAPH_DEBUG', false),
        'log_channel' => env('TELEGRAPH_LOG_CHANNEL', 'default'),
    ],

];
