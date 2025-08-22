<?php

namespace App\Http\Middleware;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as Middleware;

class EnsureFrontendRequestsAreStateful extends Middleware
{
    /**
     * Configure Sanctum to not enforce CSRF for stateless token requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public static function fromFrontend($request)
    {
        $referer = $request->headers->get('referer');
        $userAgent = $request->headers->get('user-agent');

        // If the request is from our frontend application
        if ($referer && str_contains($referer, config('app.url'))) {
            return true;
        }

        // Check for common SPA headers
        if ($request->hasHeader('X-Requested-With') && $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return true;
        }

        return parent::fromFrontend($request);
    }
}