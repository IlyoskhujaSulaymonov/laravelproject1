<?php

use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SchoolClassController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TaskController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;

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

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::resource('users', UserController::class);
});

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::resource('roles', RoleController::class);
});

Route::prefix('admin')->middleware(['auth'])->name('admin.')->group(function () {
    Route::resource('teachers', TeacherController::class);
});




Route::get('/dashboard', [MainController::class, 'dashboard'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
    Route::get('/teacher/files', [TeacherController::class, 'list'])->name('teacher.files');
    Route::get('/teacher/upload', [TeacherController::class, 'uploadForm'])->name('teacher.upload');
    Route::post('/teacher/upload', [TeacherController::class, 'upload'])->name('teacher.upload.store');
    Route::delete('/teacher/file/{id}', [TeacherController::class, 'delete'])->name('teacher.file.delete');
    Route::get('/teacher/file/{id}/edit', [TeacherController::class, 'edit'])->name('teacher.file.edit');
    Route::put('/teacher/file/{id}', [TeacherController::class, 'update'])->name('teacher.file.update');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});
