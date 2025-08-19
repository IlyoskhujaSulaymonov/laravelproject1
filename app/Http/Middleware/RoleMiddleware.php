<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    protected $roleMap = [
        'admin'   => User::ROLE_ADMIN,
        'user'    => User::ROLE_USER,
        'teacher' => User::ROLE_TEACHER,
    ];

    public function handle($request, Closure $next, ...$roles)
    {
        $user = Auth::user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        // Convert role names to their numeric constants
        $allowedRoles = array_map(fn($role) => $this->roleMap[$role] ?? $role, $roles);

        if (!in_array($user->role, $allowedRoles)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}