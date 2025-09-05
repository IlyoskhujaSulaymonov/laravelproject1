<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\LearningController;
use App\Http\Controllers\Api\UserPlanController;
use App\Http\Controllers\Api\UserTestController;
use App\Http\Controllers\Api\TelegramController; // Added TelegramController
use App\Models\Region;
use Illuminate\Support\Facades\Route;

// Profile routes moved to web.php for proper CSRF handling

// Keep only API-specific routes here
Route::middleware(['auth:sanctum'])->group(function () {
    // AI Integration routes for Math Tutor
    Route::prefix('api/ai')->middleware(['throttle:60,1', App\Http\Middleware\AiRateLimit::class])->group(function () {
        Route::post('/explain-math', [AiController::class, 'explainMath']);
        Route::post('/solve-problem', [AiController::class, 'solveProblem']);
        Route::post('/get-hint', [AiController::class, 'getHint']);
        Route::get('/status', [AiController::class, 'status']); // Status check doesn't need rate limiting
    });

    // User Tests API routes
    Route::prefix('api/user-tests')->group(function () {
        Route::get('/', [UserTestController::class, 'index']);
        Route::post('/', [UserTestController::class, 'store']);
        Route::get('/stats', [UserTestController::class, 'getUserStats']);
        Route::get('/assessment-status', [UserTestController::class, 'getAssessmentStatus']);
        Route::get('/level-finding/{subjectId}', [UserTestController::class, 'startLevelFindingTest']);
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

    // User Plan API routes
    Route::prefix('api/user-plan')->group(function () {
        Route::get('/current', [UserPlanController::class, 'getCurrentPlan']);
        Route::get('/usage', [UserPlanController::class, 'getPlanUsage']);
    });

    // Telegram Integration API routes
    Route::prefix('api/telegram')->group(function () {
        Route::post('/request-plan-purchase', [TelegramController::class, 'requestPlanPurchase']);
        Route::post('/connect-account', [TelegramController::class, 'connectTelegramAccount']);
    });

});

// Public Plans API route (accessible to all users)
Route::get('/api/plans', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\Plan::select('id', 'name', 'slug', 'description', 'price', 'duration', 'features', 'assessments_limit', 'lessons_limit', 'ai_hints_limit', 'subjects_limit')
            ->orderBy('price', 'asc')
            ->get()
    ]);
});

Route::get('/api/regions', function () {
    return response()->json([
        'regions' => Region::all(),
    ]);
});

// Telegram Webhook route (no auth required)
Route::post('/api/telegram/webhook', [TelegramController::class, 'handleWebhook']);