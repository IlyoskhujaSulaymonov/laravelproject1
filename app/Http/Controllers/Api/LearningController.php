<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AdaptiveLearningService;
use App\Models\User;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\UserTest;
use App\Models\UserSkillLevel;
use App\Models\UserTopicProgress;
use App\Models\UserRecommendation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LearningController extends Controller
{
    protected $learningService;

    public function __construct(AdaptiveLearningService $learningService)
    {
        $this->learningService = $learningService;
    }

    /**
     * Get user's learning dashboard data
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $analytics = $this->learningService->getLearningAnalytics($user->id);
        $recommendations = $this->learningService->getPersonalizedLearningPath($user->id);
        $needsAssessment = $user->needsSkillAssessment();

        return response()->json([
            'analytics' => $analytics,
            'recommendations' => $recommendations,
            'needs_assessment' => $needsAssessment,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ]);
    }

    /**
     * Conduct skill assessment for a subject
     */
    public function conductAssessment(Request $request, $subjectId): JsonResponse
    {
        $request->validate([
            'questions_per_level' => 'integer|min:3|max:10'
        ]);

        try {
            $result = $this->learningService->conductSkillAssessment(
                $request->user()->id,
                $subjectId,
                $request->input('questions_per_level', 5)
            );

            return response()->json([
                'message' => 'Assessment completed successfully',
                'result' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Assessment failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get available topics for user with difficulty filtering
     */
    public function getAvailableTopics(Request $request, $subjectId = null): JsonResponse
    {
        $user = $request->user();
        
        $query = Topic::with(['subject', 'userProgress' => function($q) use ($user) {
            $q->where('user_id', $user->id);
        }]);

        if ($subjectId) {
            $query->where('subject_id', $subjectId);
        }

        $topics = $query->get()->filter(function($topic) use ($user) {
            return $topic->isAvailableForUser($user->id);
        });

        $formattedTopics = $topics->map(function($topic) use ($user) {
            $progress = $topic->userProgress->first();
            
            return [
                'id' => $topic->id,
                'title' => $topic->title,
                'description' => $topic->description,
                'difficulty_level' => $topic->difficulty_level,
                'estimated_time' => $topic->estimated_time,
                'materials' => $topic->materials,
                'learning_objectives' => $topic->learning_objectives,
                'subject' => [
                    'id' => $topic->subject->id,
                    'name' => $topic->subject->name
                ],
                'prerequisites_completed' => $topic->hasCompletedPrerequisites($user->id),
                'progress' => $progress ? [
                    'status' => $progress->status,
                    'best_score' => $progress->best_score,
                    'attempts' => $progress->attempts,
                    'accuracy' => $progress->getAccuracyPercentage(),
                    'last_attempted' => $progress->last_attempted_at?->format('Y-m-d H:i'),
                    'estimated_study_time' => $progress->getEstimatedStudyTime()
                ] : null,
                'question_count' => $topic->questions()->count()
            ];
        });

        return response()->json([
            'topics' => $formattedTopics->values(),
            'total' => $formattedTopics->count()
        ]);
    }

    /**
     * Get learning materials for a topic
     */
    public function getTopicMaterials(Request $request, $topicId): JsonResponse
    {
        $topic = Topic::with('subject')->find($topicId);
        
        if (!$topic) {
            return response()->json(['message' => 'Topic not found'], 404);
        }

        $user = $request->user();
        
        if (!$topic->isAvailableForUser($user->id)) {
            return response()->json([
                'message' => 'Topic not available',
                'reason' => 'Prerequisites not completed or skill level insufficient'
            ], 403);
        }

        $progress = UserTopicProgress::where('user_id', $user->id)
            ->where('topic_id', $topicId)
            ->first();

        return response()->json([
            'topic' => [
                'id' => $topic->id,
                'title' => $topic->title,
                'description' => $topic->description,
                'learning_objectives' => $topic->learning_objectives,
                'materials' => $topic->materials,
                'estimated_time' => $topic->estimated_time,
                'difficulty_level' => $topic->difficulty_level,
                'subject' => $topic->subject->name
            ],
            'progress' => $progress ? [
                'status' => $progress->status,
                'best_score' => $progress->best_score,
                'attempts' => $progress->attempts,
                'last_attempted' => $progress->last_attempted_at?->format('Y-m-d H:i')
            ] : null,
            'prerequisites' => $topic->prerequisiteTopics()->map(function($prereq) {
                return [
                    'id' => $prereq->id,
                    'title' => $prereq->title
                ];
            })
        ]);
    }

    /**
     * Start practice session for a topic
     */
    public function startPractice(Request $request, $topicId): JsonResponse
    {
        $user = $request->user();
        $topic = Topic::find($topicId);
        
        if (!$topic) {
            return response()->json(['message' => 'Topic not found'], 404);
        }

        if (!$topic->isAvailableForUser($user->id)) {
            return response()->json([
                'message' => 'Topic not available',
                'reason' => 'Prerequisites not completed or skill level insufficient'
            ], 403);
        }

        $request->validate([
            'question_count' => 'integer|min:5|max:50'
        ]);

        $questionCount = $request->input('question_count', 10);
        
        // Get questions for practice
        $questions = $topic->questions()
            ->with('variants')
            ->inRandomOrder()
            ->limit($questionCount)
            ->get();

        if ($questions->isEmpty()) {
            return response()->json(['message' => 'No questions available for this topic'], 404);
        }

        // Format questions for frontend
        $formattedQuestions = $questions->map(function($question) {
            return [
                'id' => $question->id,
                'question' => $question->question,
                'formulas' => $question->formulas,
                'images' => $question->images,
                'variants' => $question->variants->map(function($variant) {
                    return [
                        'id' => $variant->id,
                        'text' => $variant->text,
                        'option_letter' => $variant->option_letter
                    ];
                })
            ];
        });

        return response()->json([
            'topic' => [
                'id' => $topic->id,
                'title' => $topic->title,
                'difficulty_level' => $topic->difficulty_level
            ],
            'questions' => $formattedQuestions,
            'total_questions' => $questions->count(),
            'time_limit' => $topic->estimated_time * 60 // Convert to seconds
        ]);
    }

    /**
     * Submit practice test results
     */
    public function submitTest(Request $request): JsonResponse
    {
        $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'test_name' => 'required|string',
            'total_questions' => 'required|integer|min:1',
            'correct_answers' => 'required|integer|min:0',
            'time_spent' => 'required|integer|min:0',
            'questions_data' => 'required|array',
            'test_type' => 'string|in:practice,assessment,review',
            'difficulty_level' => 'string|in:beginner,intermediate,advanced'
        ]);

        $user = $request->user();
        $scorePercentage = round(($request->correct_answers / $request->total_questions) * 100);

        $test = UserTest::create([
            'user_id' => $user->id,
            'topic_id' => $request->topic_id,
            'test_name' => $request->test_name,
            'total_questions' => $request->total_questions,
            'correct_answers' => $request->correct_answers,
            'score_percentage' => $scorePercentage,
            'time_spent' => $request->time_spent,
            'questions_data' => $request->questions_data,
            'status' => 'completed',
            'test_type' => $request->input('test_type', 'practice'),
            'difficulty_level' => $request->input('difficulty_level'),
            'category' => 'practice'
        ]);

        // Process the test result
        $progress = $this->learningService->processTestResult($test);

        return response()->json([
            'message' => 'Test submitted successfully',
            'test' => [
                'id' => $test->id,
                'score_percentage' => $test->score_percentage,
                'grade' => $test->grade,
                'time_spent' => $test->formatted_time_spent
            ],
            'progress' => [
                'status' => $progress->status,
                'best_score' => $progress->best_score,
                'attempts' => $progress->attempts,
                'needs_more_practice' => $progress->needsMorePractice()
            ],
            'recommendations' => $this->learningService->getPersonalizedLearningPath($user->id, $test->topic->subject_id)
        ]);
    }

    /**
     * Get user's skill levels
     */
    public function getSkillLevels(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $skillLevels = $user->skillLevels()->with('subject')->get();
        
        return response()->json([
            'skill_levels' => $skillLevels->map(function($sl) {
                return [
                    'subject_id' => $sl->subject_id,
                    'subject_name' => $sl->subject->name,
                    'skill_level' => $sl->skill_level,
                    'assessment_score' => $sl->assessment_score,
                    'last_assessed_at' => $sl->last_assessed_at?->format('Y-m-d'),
                    'needs_reassessment' => $sl->needs_reassessment || $sl->isAssessmentOutdated()
                ];
            })
        ]);
    }

    /**
     * Dismiss a recommendation
     */
    public function dismissRecommendation(Request $request, $recommendationId): JsonResponse
    {
        $recommendation = UserRecommendation::where('id', $recommendationId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$recommendation) {
            return response()->json(['message' => 'Recommendation not found'], 404);
        }

        $recommendation->dismiss();

        return response()->json(['message' => 'Recommendation dismissed']);
    }
}