<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SchoolClassController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TaskController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\StudentDashboardController;

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/', [MainController::class, 'main'])->name('main');
    Route::get('/dashboard', [MainController::class, 'dashboard'])->name('dashboard');
    Route::resource('questions', QuestionsController::class);
});

Route::get('/admin/dashboard', [AdminDashboardController::class, 'dashboard'])->name('admin.dashboard');

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {
    Route::resource('teachers', TeacherController::class);
});

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {
    Route::resource('students', StudentController::class);
});

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {
    Route::resource('classes', SchoolClassController::class);
});

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {
    Route::resource('subjects', SubjectController::class);
});

Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {
    Route::resource('tasks', TaskController::class);
});



Route::middleware(['auth'])->group(function () {
    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index'])->name('teacher.dashboard');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});



require __DIR__.'/auth.php';
