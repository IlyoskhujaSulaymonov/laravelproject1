<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AiRateLimit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userId = $request->user()?->id;
        
        if (!$userId) {
            return response()->json([
                'success' => false,
                'error' => 'AI xizmatidan foydalanish uchun tizimga kiring'
            ], 401);
        }

        // Rate limiting configuration
        $rateLimit = config('ai.settings.rate_limit', 100); // requests per hour
        $cacheKey = "ai_rate_limit_{$userId}";
        
        // Get current request count
        $requestCount = Cache::get($cacheKey, 0);
        
        // Check if rate limit exceeded
        if ($requestCount >= $rateLimit) {
            Log::warning("AI rate limit exceeded for user {$userId}");
            
            return response()->json([
                'success' => false,
                'error' => 'AI so\'rovlar limiti tugadi. Bir soat kutib, qaytadan urinib ko\'ring.',
                'rate_limit' => $rateLimit,
                'retry_after' => 3600 // 1 hour in seconds
            ], 429);
        }
        
        // Increment request count
        Cache::put($cacheKey, $requestCount + 1, now()->addHour());
        
        // Add rate limit headers to response
        $response = $next($request);
        
        $response->headers->set('X-RateLimit-Limit', $rateLimit);
        $response->headers->set('X-RateLimit-Remaining', max(0, $rateLimit - $requestCount - 1));
        $response->headers->set('X-RateLimit-Reset', now()->addHour()->timestamp);
        
        return $response;
    }
}