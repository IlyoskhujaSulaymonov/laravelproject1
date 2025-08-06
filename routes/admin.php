<?php

use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/admin', function () {
    return redirect('admin/dashboard');
})->middleware(['auth']);

Route::get('/admin/dashboard', [AdminDashboardController::class, 'dashboard']) ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');