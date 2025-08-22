<?php

use App\Http\Controllers\ProfileController;
use App\Models\Region;
use Illuminate\Support\Facades\Route;

// Profile routes moved to web.php for proper CSRF handling

// Keep only API-specific routes here
Route::middleware(['auth:sanctum'])->group(function () {
    // Add API-only routes here if needed
});

Route::get('/api/regions', function () {
    return response()->json([
        'regions' => Region::all(),
    ]);
});