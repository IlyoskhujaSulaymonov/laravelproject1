<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::get('/', function () {
    return view('landing');
});

// User authentication check endpoint
Route::middleware(['auth'])->get('/user', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'name' => $request->user()->name,
        'email' => $request->user()->email,
        'email_verified_at' => $request->user()->email_verified_at,
        'created_at' => $request->user()->created_at,
        'updated_at' => $request->user()->updated_at,
    ]);
});

Route::middleware(['auth'])
    ->get('/user/dashboard', fn() => view('profile.dashboard'))
    ->name('user.dashboard');

// Learning system route
Route::middleware(['auth'])
    ->get('/learning', fn() => view('learning.index'))
    ->name('learning.index');

// Profile routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/user/profile', [ProfileController::class, 'profile']);
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/admin.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';