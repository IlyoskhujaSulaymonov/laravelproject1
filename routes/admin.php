<?php

use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SchoolClassController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TaskController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\StudentDashboardController;

Route::get('/admin', function () {
    return redirect('admin/dashboard');
})->middleware(['auth']);

Route::get('/admin/dashboard', [AdminDashboardController::class, 'dashboard']) ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

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


Route::get('/dashboard', [MainController::class, 'dashboard'])->name('dashboard');
Route::resource('questions', QuestionsController::class);

Route::middleware(['auth'])->group(function () {
    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index'])->name('teacher.dashboard');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});
