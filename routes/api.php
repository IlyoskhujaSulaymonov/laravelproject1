<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\UserTestController;
use App\Http\Controllers\Api\LearningController;
use App\Models\Region;
use Illuminate\Support\Facades\Route;

// Profile routes moved to web.php for proper CSRF handling

// Keep only API-specific routes here
Route::middleware(['auth:sanctum'])->group(function () {
    // User Tests API routes
    Route::prefix('api/user-tests')->group(function () {
        Route::get('/', [UserTestController::class, 'index']);
        Route::post('/', [UserTestController::class, 'store']);
        Route::get('/stats', [UserTestController::class, 'getUserStats']);
        Route::get('/topics', [UserTestController::class, 'getAvailableTopics']);
        Route::get('/subjects', [UserTestController::class, 'getSubjects']);
        Route::get('/subjects/{subjectId}/topics', [UserTestController::class, 'getTopicsBySubject']);
        Route::get('/topics/{topicId}/questions', [UserTestController::class, 'getTopicQuestions']);
        Route::get('/weekly-progress', [UserTestController::class, 'getWeeklyProgress']);
        Route::get('/performance-comparison', [UserTestController::class, 'getPerformanceComparison']);
        Route::get('/categories', [UserTestController::class, 'getTestCategories']);
        Route::get('/category/{category}', [UserTestController::class, 'getTestsByCategory']);
        Route::get('/difficulty/{difficulty}', [UserTestController::class, 'getTestsByDifficulty']);
        Route::get('/shared', [UserTestController::class, 'getSharedTests']);
        Route::get('/study-groups', [UserTestController::class, 'getStudyGroups']);
        Route::get('/leaderboard', [UserTestController::class, 'getLeaderboard']);
        Route::post('/study-groups', [UserTestController::class, 'createStudyGroup']);
        Route::get('/{id}', [UserTestController::class, 'show']);
        Route::get('/{id}/analytics', [UserTestController::class, 'getTestAnalytics']);
        Route::post('/{id}/share', [UserTestController::class, 'shareTest']);
        Route::post('/{id}/retake', [UserTestController::class, 'retakeTest']);
        Route::delete('/{id}', [UserTestController::class, 'deleteTest']);
    });

    // Adaptive Learning System API routes
    Route::prefix('api/learning')->group(function () {
        Route::get('/dashboard', [LearningController::class, 'dashboard']);
        Route::post('/assessment/{subjectId}', [LearningController::class, 'conductAssessment']);
        Route::get('/topics/{subjectId?}', [LearningController::class, 'getAvailableTopics']);
        Route::get('/topic/{topicId}/materials', [LearningController::class, 'getTopicMaterials']);
        Route::post('/topic/{topicId}/practice', [LearningController::class, 'startPractice']);
        Route::post('/test/submit', [LearningController::class, 'submitTest']);
        Route::get('/skill-levels', [LearningController::class, 'getSkillLevels']);
        Route::post('/recommendation/{recommendationId}/dismiss', [LearningController::class, 'dismissRecommendation']);
    });
});

Route::get('/api/regions', function () {
    return response()->json([
        'regions' => Region::all(),
    ]);
});
