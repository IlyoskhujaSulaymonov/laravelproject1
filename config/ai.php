<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI Service
    |--------------------------------------------------------------------------
    |
    | This option controls the default AI service that will be used for
    | mathematical explanations and problem solving. Supported services:
    | "openai", "anthropic", "gemini"
    |
    */

    'default_service' => env('AI_DEFAULT_SERVICE', 'openai'),

    /*
    |--------------------------------------------------------------------------
    | OpenAI Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for OpenAI GPT models
    |
    */

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
        'organization' => env('OPENAI_ORGANIZATION'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Anthropic Claude Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Anthropic Claude models
    |
    */

    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'model' => env('ANTHROPIC_MODEL', 'claude-3-haiku-20240307'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Google Gemini Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Google Gemini models
    |
    */

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Service Settings
    |--------------------------------------------------------------------------
    |
    | Global settings for AI services
    |
    */

    'settings' => [
        'timeout' => env('AI_TIMEOUT', 30),
        'max_tokens' => env('AI_MAX_TOKENS', 500),
        'temperature' => env('AI_TEMPERATURE', 0.7),
        'rate_limit' => env('AI_RATE_LIMIT', 100), // requests per hour
    ],
];