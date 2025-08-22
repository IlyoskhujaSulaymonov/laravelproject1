<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('landing');
});

Route::middleware(['auth','verified','role:user'])
    ->get('/user/dashboard', fn () => view('profile.dashboard'))
    ->name('user.dashboard');

// Profile routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/user/profile', [ProfileController::class, 'profile']);
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
