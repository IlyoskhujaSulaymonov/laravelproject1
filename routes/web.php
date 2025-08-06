<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionsController;


Route::get('/', function () {
    return view('landing');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Route::get('/', [MainController::class, 'main'])->name('main');
    // Route::get('/dashboard', [MainController::class, 'dashboard'])->name('dashboard');
    Route::resource('questions', QuestionsController::class);
});

require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
