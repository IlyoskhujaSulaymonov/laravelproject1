<?php

use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\SampleQuestionController;
use App\Http\Controllers\Admin\TopicController;
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
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\UserPlanController;
use App\Http\Controllers\Admin\UserTestController as AdminUserTestController;
use App\Http\Controllers\Admin\PlanPurchaseRequestController;

Route::get('/admin', function () {
    return redirect('admin/dashboard');
})->middleware(['auth', 'role:admin,teacher']);

Route::get('/admin/dashboard', [AdminDashboardController::class, 'dashboard']) ->middleware(['auth','role:admin,teacher'])
    ->name('admin.dashboard');

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
Route::resource('teachers', TeacherController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('students', StudentController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('classes', SchoolClassController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('topics', TopicController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('subjects', SubjectController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('tasks', TaskController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::get('questions/topics/list', [QuestionController::class, 'topicList'])->name('questions.topic.list');
    Route::get('questions/{topic}', [QuestionController::class, 'index'])->name('questions.index');
    Route::get('questions/create/{topic}', [QuestionController::class, 'create'])->name('questions.create');
    Route::post('questions/{topic}', [QuestionController::class, 'store'])->name('questions.store');
    Route::get('questions/edit/{topic}/{question}', [QuestionController::class, 'edit'])->name('questions.edit');
    Route::put('questions/{topic}/{question}', [QuestionController::class, 'update'])->name('questions.update');
    Route::delete('questions/{topic}/{question}', [QuestionController::class, 'destroy'])->name('questions.destroy');
     Route::get('questions/show/{topic}/{question}', [QuestionController::class, 'show'])->name('questions.show');
});

// Sample Questions (Na'munaviy savollar) Routes
Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::get('sample-questions/subjects/list', [SampleQuestionController::class, 'subjectList'])->name('sample-questions.subject.list');
    Route::get('sample-questions/{subject}', [SampleQuestionController::class, 'index'])->name('sample-questions.index');
    Route::get('sample-questions/create/{subject}', [SampleQuestionController::class, 'create'])->name('sample-questions.create');
    Route::post('sample-questions/{subject}', [SampleQuestionController::class, 'store'])->name('sample-questions.store');
    Route::get('sample-questions/edit/{subject}/{question}', [SampleQuestionController::class, 'edit'])->name('sample-questions.edit');
    Route::put('sample-questions/{subject}/{question}', [SampleQuestionController::class, 'update'])->name('sample-questions.update');
    Route::delete('sample-questions/{subject}/{question}', [SampleQuestionController::class, 'destroy'])->name('sample-questions.destroy');
    Route::get('sample-questions/show/{subject}/{question}', [SampleQuestionController::class, 'show'])->name('sample-questions.show');
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('users', UserController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('roles', RoleController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::resource('teachers', TeacherController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {
    Route::resource('plans', PlanController::class);
});

Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {
    Route::resource('user_plans', UserPlanController::class);
});

Route::prefix('admin')->middleware(['auth','role:admin'])->name('admin.')->group(function () {
    Route::resource('payments', PaymentController::class);
});

// User Tests Management Routes
Route::prefix('admin')->middleware(['auth', 'role:admin,teacher'])->name('admin.')->group(function () {
    Route::get('user-tests', [AdminUserTestController::class, 'index'])->name('user-tests.index');
    Route::get('user-tests/{userTest}', [AdminUserTestController::class, 'show'])->name('user-tests.show');
    Route::delete('user-tests/{userTest}', [AdminUserTestController::class, 'destroy'])->name('user-tests.destroy');
    Route::get('user-tests-analytics', [AdminUserTestController::class, 'analytics'])->name('user-tests.analytics');

    // Plan Purchase Requests Routes
    Route::get('plan-purchase-requests', [PlanPurchaseRequestController::class, 'index'])->name('plan-purchase-requests.index');
    Route::get('plan-purchase-requests/{planPurchaseRequest}', [PlanPurchaseRequestController::class, 'show'])->name('plan-purchase-requests.show');
    Route::put('plan-purchase-requests/{planPurchaseRequest}', [PlanPurchaseRequestController::class, 'update'])->name('plan-purchase-requests.update');
    Route::delete('plan-purchase-requests/{planPurchaseRequest}', [PlanPurchaseRequestController::class, 'destroy'])->name('plan-purchase-requests.destroy');
    Route::get('user-tests-export', [AdminUserTestController::class, 'export'])->name('user-tests.export');
});


// Route::get('/dashboard', [MainController::class, 'dashboard'])->name('dashboard');
Route::get('admin/notifications/check', [MainController::class, 'notificationsCheck'])->name('notifications.check');

Route::middleware(['auth', 'role:admin,teacher'])->group(function () {
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
    Route::get('/teacher/files', [TeacherController::class, 'list'])->name('teacher.files');
    Route::get('/teacher/upload', [TeacherController::class, 'uploadForm'])->name('teacher.upload');
    Route::post('/teacher/upload', [TeacherController::class, 'upload'])->name('teacher.upload.store');
    Route::delete('/teacher/file/{id}', [TeacherController::class, 'delete'])->name('teacher.file.delete');
    Route::get('/teacher/file/{id}/edit', [TeacherController::class, 'edit'])->name('teacher.file.edit');
    Route::put('/teacher/file/{id}', [TeacherController::class, 'update'])->name('teacher.file.update');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});
