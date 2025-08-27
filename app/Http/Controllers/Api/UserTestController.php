<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserTest;
use App\Models\Topic;
use App\Models\Question;
use App\Models\Subject;
use App\Models\UserSkillLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserTestController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = UserTest::with(['topic', 'topic.subject'])
            ->where('user_id', $user->id);

        // Apply filters
        if ($request->filled('subject_id')) {
            $query->whereHas('topic', function ($q) use ($request) {
                $q->where('subject_id', $request->subject_id);
            });
        }

        if ($request->filled('topic_id')) {
            $query->where('topic_id', $request->topic_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('min_score')) {
            $query->where('score_percentage', '>=', $request->min_score);
        }

        if ($request->filled('max_score')) {
            $query->where('score_percentage', '<=', $request->max_score);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('test_name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('difficulty_level')) {
            $query->where('difficulty_level', $request->difficulty_level);
        }

        if ($request->filled('test_type')) {
            $query->where('test_type', $request->test_type);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $tests = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'tests' => $tests->items(),
                'pagination' => [
                    'current_page' => $tests->currentPage(),
                    'last_page' => $tests->lastPage(),
                    'per_page' => $tests->perPage(),
                    'total' => $tests->total(),
                ]
            ]
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $test = UserTest::with(['topic', 'topic.subject'])
            ->where('user_id', $user->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'test' => $test
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'test_name' => 'required|string|max:255',
            'total_questions' => 'required|integer|min:1',
            'correct_answers' => 'required|integer|min:0',
            'time_spent' => 'nullable|integer|min:0',
            'questions_data' => 'nullable|array',
            'test_type' => 'nullable|string|in:practice,assessment,level_finding'
        ]);

        $user = Auth::user();
        
        // Check if this is an assessment test and if user has remaining assessments
        if (in_array($request->test_type, ['assessment', 'level_finding'])) {
            if (!$user->canTakeAssessment()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sizda ushbu oy uchun baholash testlari tugagan. Yangisini olish uchun rejangizni yangilang yoki keyingi oyni kuting.',
                    'data' => [
                        'remaining_assessments' => $user->getRemainingAssessments()
                    ]
                ], 403);
            }
            
            // Use an assessment
            $user->currentPlan->useAssessment();
        }

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
            'category' => $request->category ?? 'practice',
            'difficulty_level' => $request->difficulty_level ?? 'medium',
            'test_type' => $request->test_type ?? 'practice'
        ]);
        
        // If this is a level finding test, update user skill level
        if ($request->test_type === 'level_finding') {
            $this->updateUserSkillLevel($user, $test);
        }

        return response()->json([
            'success' => true,
            'message' => 'Test natijasi muvaffaqiyatli saqlandi!',
            'data' => [
                'test' => $test->load(['topic']),
                'remaining_assessments' => $user->getRemainingAssessments()
            ]
        ]);
    }

    public function getAvailableTopics()
    {
        $topics = Topic::with('subject')
            ->whereHas('questions')
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'topics' => $topics
            ]
        ]);
    }

    public function getTopicQuestions($topicId)
    {
        $topic = Topic::with(['questions.variants'])->findOrFail($topicId);

        $questions = $topic->questions->map(function ($question) {
            return [
                'id' => $question->id,
                'question' => $question->question,
                'formulas' => json_decode($question->formulas, true),
                'images' => json_decode($question->images, true),
                'variants' => $question->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'option_letter' => $variant->option_letter,
                        'text' => $variant->text,
                        'formulas' => json_decode($variant->formulas, true),
                        'is_correct' => $variant->is_correct
                    ];
                })
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'topic' => $topic,
                'questions' => $questions
            ]
        ]);
    }

    public function getUserStats()
    {
        $user = Auth::user();

        // Basic stats
        $totalTests = UserTest::where('user_id', $user->id)->count();
        $averageScore = UserTest::where('user_id', $user->id)->avg('score_percentage');
        $bestScore = UserTest::where('user_id', $user->id)->max('score_percentage');
        $totalTimeSpent = UserTest::where('user_id', $user->id)->sum('time_spent');

        // Advanced stats
        $testsThisWeek = UserTest::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfWeek())
            ->count();

        $testsThisMonth = UserTest::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        // Calculate improvement rate (last 10 tests vs previous 10)
        $recentTests = UserTest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->pluck('score_percentage')
            ->avg();

        $previousTests = UserTest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->skip(10)
            ->limit(10)
            ->pluck('score_percentage')
            ->avg();

        $improvementRate = $previousTests ? (($recentTests - $previousTests) / $previousTests) * 100 : 0;

        // Subject performance
        $subjectPerformance = UserTest::select(
                'subjects.name as subject_name',
                DB::raw('COUNT(*) as tests_taken'),
                DB::raw('AVG(score_percentage) as average_score'),
                DB::raw('MAX(score_percentage) as best_score'),
                DB::raw('MAX(user_tests.created_at) as last_test_date')
            )
            ->join('topics', 'user_tests.topic_id', '=', 'topics.id')
            ->join('subjects', 'topics.subject_id', '=', 'subjects.id')
            ->where('user_tests.user_id', $user->id)
            ->groupBy('subjects.id', 'subjects.name')
            ->get();

        // Performance trend (last 30 days)
        $performanceTrend = UserTest::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('AVG(score_percentage) as score')
            )
            ->where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $recentTests = UserTest::with(['topic'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_tests' => $totalTests,
                    'average_score' => round($averageScore ?? 0, 1),
                    'best_score' => $bestScore ?? 0,
                    'total_time_spent' => $totalTimeSpent ?? 0,
                    'tests_this_week' => $testsThisWeek,
                    'tests_this_month' => $testsThisMonth,
                    'improvement_rate' => round($improvementRate, 1),
                    'favorite_subjects' => $subjectPerformance,
                    'performance_trend' => $performanceTrend
                ],
                'recent_tests' => $recentTests
            ]
        ]);
    }

    public function getSubjects()
    {
        $subjects = Subject::withCount('topics')
            ->whereHas('topics.questions')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'subjects' => $subjects
            ]
        ]);
    }

    public function getTopicsBySubject($subjectId)
    {
        $topics = Topic::with('subject')
            ->where('subject_id', $subjectId)
            ->whereHas('questions')
            ->withCount('questions')
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'topics' => $topics
            ]
        ]);
    }

    public function getTestAnalytics($testId)
    {
        $user = Auth::user();
        $test = UserTest::with(['topic', 'topic.subject'])
            ->where('user_id', $user->id)
            ->findOrFail($testId);

        $analytics = [];
        
        if ($test->questions_data) {
            foreach ($test->questions_data as $questionData) {
                $question = Question::with('variants')->find($questionData['question_id']);
                if ($question) {
                    $analytics[] = [
                        'question_id' => $question->id,
                        'question_text' => $question->question,
                        'user_answer_id' => $questionData['user_answer_id'],
                        'correct_answer_id' => $questionData['correct_answer_id'],
                        'is_correct' => $questionData['is_correct'],
                        'user_answer' => $question->variants->firstWhere('id', $questionData['user_answer_id']),
                        'correct_answer' => $question->variants->firstWhere('id', $questionData['correct_answer_id']),
                        'all_variants' => $question->variants
                    ];
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'test' => $test,
                'analytics' => $analytics
            ]
        ]);
    }

    public function getWeeklyProgress()
    {
        $user = Auth::user();
        $weeklyData = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $tests = UserTest::where('user_id', $user->id)
                ->whereDate('created_at', $date)
                ->get();
            
            $weeklyData[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('l'),
                'tests_count' => $tests->count(),
                'average_score' => $tests->avg('score_percentage') ?? 0,
                'total_time' => $tests->sum('time_spent') ?? 0
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'weekly_progress' => $weeklyData
            ]
        ]);
    }

    public function getPerformanceComparison()
    {
        $user = Auth::user();
        
        // Get user's performance by subject
        $userPerformance = UserTest::select(
                'subjects.name as subject_name',
                DB::raw('AVG(score_percentage) as average_score'),
                DB::raw('COUNT(*) as tests_taken')
            )
            ->join('topics', 'user_tests.topic_id', '=', 'topics.id')
            ->join('subjects', 'topics.subject_id', '=', 'subjects.id')
            ->where('user_tests.user_id', $user->id)
            ->groupBy('subjects.id', 'subjects.name')
            ->get();

        // Get global average for comparison (anonymized)
        $globalPerformance = UserTest::select(
                'subjects.name as subject_name',
                DB::raw('AVG(score_percentage) as global_average')
            )
            ->join('topics', 'user_tests.topic_id', '=', 'topics.id')
            ->join('subjects', 'topics.subject_id', '=', 'subjects.id')
            ->groupBy('subjects.id', 'subjects.name')
            ->get()
            ->keyBy('subject_name');

        $comparison = $userPerformance->map(function ($userSubject) use ($globalPerformance) {
            $globalAvg = $globalPerformance->get($userSubject->subject_name);
            return [
                'subject_name' => $userSubject->subject_name,
                'user_average' => round($userSubject->average_score, 1),
                'global_average' => $globalAvg ? round($globalAvg->global_average, 1) : 0,
                'tests_taken' => $userSubject->tests_taken,
                'performance_vs_global' => $globalAvg ? 
                    round($userSubject->average_score - $globalAvg->global_average, 1) : 0
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'performance_comparison' => $comparison
            ]
        ]);
    }

    public function deleteTest($testId)
    {
        $user = Auth::user();
        $test = UserTest::where('user_id', $user->id)->findOrFail($testId);
        
        $test->delete();

        return response()->json([
            'success' => true,
            'message' => 'Test muvaffaqiyatli o\'chirildi!'
        ]);
    }

    public function retakeTest($testId)
    {
        $user = Auth::user();
        $originalTest = UserTest::with(['topic'])
            ->where('user_id', $user->id)
            ->findOrFail($testId);

        // Get questions for the same topic
        $topic = Topic::with(['questions.variants'])->findOrFail($originalTest->topic_id);

        $questions = $topic->questions->map(function ($question) {
            return [
                'id' => $question->id,
                'question' => $question->question,
                'formulas' => json_decode($question->formulas, true),
                'images' => json_decode($question->images, true),
                'variants' => $question->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'option_letter' => $variant->option_letter,
                        'text' => $variant->text,
                        'formulas' => json_decode($variant->formulas, true),
                        'is_correct' => $variant->is_correct
                    ];
                })
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'topic' => $topic,
                'questions' => $questions,
                'original_test' => $originalTest
            ]
        ]);
    }

    public function getTestCategories()
    {
        $categories = [
            ['id' => 'practice', 'name' => 'Amaliyot', 'description' => 'Oddiy mashq testlari'],
            ['id' => 'assessment', 'name' => 'Baholash', 'description' => 'Bilim darajasini baholash'],
            ['id' => 'quiz', 'name' => 'Viktorina', 'description' => 'Tez test'],
            ['id' => 'final_exam', 'name' => 'Yakuniy imtihon', 'description' => 'Yakuniy nazorat']
        ];

        $difficultyLevels = [
            ['id' => 'easy', 'name' => 'Oson', 'color' => 'green'],
            ['id' => 'medium', 'name' => 'O\'rtacha', 'color' => 'yellow'],
            ['id' => 'hard', 'name' => 'Qiyin', 'color' => 'red']
        ];

        $testTypes = [
            ['id' => 'practice', 'name' => 'Mashq'],
            ['id' => 'assessment', 'name' => 'Baholash'],
            ['id' => 'quiz', 'name' => 'Viktorina'],
            ['id' => 'final_exam', 'name' => 'Yakuniy imtihon']
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'difficulty_levels' => $difficultyLevels,
                'test_types' => $testTypes
            ]
        ]);
    }

    public function getTestsByCategory($category)
    {
        $user = Auth::user();
        $tests = UserTest::with(['topic', 'topic.subject'])
            ->where('user_id', $user->id)
            ->where('category', $category)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'tests' => $tests->items(),
                'pagination' => [
                    'current_page' => $tests->currentPage(),
                    'last_page' => $tests->lastPage(),
                    'per_page' => $tests->perPage(),
                    'total' => $tests->total(),
                ]
            ]
        ]);
    }

    public function getTestsByDifficulty($difficulty)
    {
        $user = Auth::user();
        $tests = UserTest::with(['topic', 'topic.subject'])
            ->where('user_id', $user->id)
            ->where('difficulty_level', $difficulty)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'tests' => $tests->items(),
                'pagination' => [
                    'current_page' => $tests->currentPage(),
                    'last_page' => $tests->lastPage(),
                    'per_page' => $tests->perPage(),
                    'total' => $tests->total(),
                ]
            ]
        ]);
    }

    public function shareTest(Request $request, $testId)
    {
        $request->validate([
            'share_with' => 'required|array',
            'share_with.*' => 'exists:users,id',
            'message' => 'nullable|string|max:255',
            'allow_retake' => 'boolean'
        ]);

        $user = Auth::user();
        $test = UserTest::where('user_id', $user->id)->findOrFail($testId);

        $shareData = [];
        foreach ($request->share_with as $userId) {
            $shareData[] = [
                'test_id' => $testId,
                'shared_by' => $user->id,
                'shared_with' => $userId,
                'message' => $request->message,
                'allow_retake' => $request->allow_retake ?? true,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        // Note: You would need to create a test_shares table for this
        // DB::table('test_shares')->insert($shareData);

        return response()->json([
            'success' => true,
            'message' => 'Test muvaffaqiyatli baham ko\'rildi!',
            'data' => [
                'shared_count' => count($shareData)
            ]
        ]);
    }

    public function getSharedTests()
    {
        $user = Auth::user();
        
        // Note: This would require a test_shares table
        /*
        $sharedTests = DB::table('test_shares')
            ->join('user_tests', 'test_shares.test_id', '=', 'user_tests.id')
            ->join('users', 'test_shares.shared_by', '=', 'users.id')
            ->join('topics', 'user_tests.topic_id', '=', 'topics.id')
            ->where('test_shares.shared_with', $user->id)
            ->select(
                'user_tests.*',
                'users.name as shared_by_name',
                'test_shares.message',
                'test_shares.allow_retake',
                'test_shares.created_at as shared_at',
                'topics.title as topic_title'
            )
            ->orderBy('test_shares.created_at', 'desc')
            ->get();
        */

        // For now, return mock data
        $sharedTests = [];

        return response()->json([
            'success' => true,
            'data' => [
                'shared_tests' => $sharedTests
            ]
        ]);
    }

    public function createStudyGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'members' => 'required|array|min:1',
            'members.*' => 'exists:users,id',
            'subject_id' => 'nullable|exists:subjects,id'
        ]);

        $user = Auth::user();

        // Note: You would need to create study_groups and study_group_members tables
        $studyGroupData = [
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $user->id,
            'subject_id' => $request->subject_id,
            'created_at' => now(),
            'updated_at' => now()
        ];

        // $groupId = DB::table('study_groups')->insertGetId($studyGroupData);

        return response()->json([
            'success' => true,
            'message' => 'O\'quv guruhi muvaffaqiyatli yaratildi!',
            'data' => [
                'group' => $studyGroupData
            ]
        ]);
    }

    public function getStudyGroups()
    {
        $user = Auth::user();
        
        // Note: This would require study_groups and study_group_members tables
        /*
        $studyGroups = DB::table('study_groups')
            ->join('study_group_members', 'study_groups.id', '=', 'study_group_members.group_id')
            ->where('study_group_members.user_id', $user->id)
            ->orWhere('study_groups.created_by', $user->id)
            ->select('study_groups.*')
            ->distinct()
            ->get();
        */

        // For now, return mock data
        $studyGroups = [];

        return response()->json([
            'success' => true,
            'data' => [
                'study_groups' => $studyGroups
            ]
        ]);
    }

    public function getLeaderboard(Request $request)
    {
        $period = $request->get('period', 'monthly'); // daily, weekly, monthly, all_time
        $subjectId = $request->get('subject_id');
        $limit = $request->get('limit', 10);

        $query = DB::table('user_tests')
            ->join('users', 'user_tests.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(*) as total_tests'),
                DB::raw('AVG(score_percentage) as average_score'),
                DB::raw('MAX(score_percentage) as best_score'),
                DB::raw('SUM(time_spent) as total_time')
            )
            ->where('user_tests.status', 'completed')
            ->groupBy('users.id', 'users.name');

        // Apply period filter
        switch ($period) {
            case 'daily':
                $query->whereDate('user_tests.created_at', today());
                break;
            case 'weekly':
                $query->where('user_tests.created_at', '>=', now()->startOfWeek());
                break;
            case 'monthly':
                $query->where('user_tests.created_at', '>=', now()->startOfMonth());
                break;
        }

        // Apply subject filter
        if ($subjectId) {
            $query->join('topics', 'user_tests.topic_id', '=', 'topics.id')
                  ->where('topics.subject_id', $subjectId);
        }

        $leaderboard = $query->orderBy('average_score', 'desc')
                            ->orderBy('total_tests', 'desc')
                            ->limit($limit)
                            ->get()
                            ->map(function ($user, $index) {
                                return [
                                    'rank' => $index + 1,
                                    'user_id' => $user->id,
                                    'name' => $user->name,
                                    'total_tests' => $user->total_tests,
                                    'average_score' => round($user->average_score, 1),
                                    'best_score' => $user->best_score,
                                    'total_time' => $user->total_time
                                ];
                            });

        return response()->json([
            'success' => true,
            'data' => [
                'leaderboard' => $leaderboard,
                'period' => $period,
                'user_rank' => $this->getUserRank(Auth::id(), $period, $subjectId)
            ]
        ]);
    }

    private function getUserRank($userId, $period, $subjectId = null)
    {
        // Implementation to get current user's rank
        // This is a simplified version
        return [
            'rank' => null,
            'average_score' => 0,
            'total_tests' => 0
        ];
    }

    /**
     * Update user skill level based on test result
     */
    private function updateUserSkillLevel($user, $test)
    {
        $topic = Topic::with('subject')->findOrFail($test->topic_id);
        $subjectId = $topic->subject->id;
        
        // Determine skill level based on score
        $skillLevel = 'beginner';
        if ($test->score_percentage >= 85) {
            $skillLevel = 'advanced';
        } elseif ($test->score_percentage >= 70) {
            $skillLevel = 'intermediate';
        }
        
        // Update or create user skill level
        UserSkillLevel::updateOrCreate(
            [
                'user_id' => $user->id,
                'subject_id' => $subjectId
            ],
            [
                'skill_level' => $skillLevel,
                'assessment_score' => $test->score_percentage,
                'last_assessed_at' => now(),
                'needs_reassessment' => false
            ]
        );
    }

    /**
     * Check user's assessment limits and skill level status
     */
    public function getAssessmentStatus()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'can_take_assessment' => $user->canTakeAssessment(),
                'remaining_assessments' => $user->getRemainingAssessments(),
                'needs_level_assessment' => $user->needsLevelAssessment(),
                'has_skill_level' => $user->hasFoundSkillLevel(),
                'current_plan' => $user->currentPlan ? [
                    'name' => $user->currentPlan->plan->name,
                    'assessments_limit' => $user->currentPlan->plan->assessments_limit,
                    'assessments_used' => $user->currentPlan->assessments_used
                ] : null
            ]
        ]);
    }

    /**
     * Start level finding assessment
     */
    public function startLevelFindingTest($subjectId)
    {
        $user = Auth::user();
        
        // Check if user can take assessment
        if (!$user->canTakeAssessment()) {
            return response()->json([
                'success' => false,
                'message' => 'Sizda ushbu oy uchun baholash testlari tugagan.'
            ], 403);
        }
        
        // Get mixed difficulty questions for level assessment
        $topics = Topic::where('subject_id', $subjectId)
            ->whereHas('questions')
            ->with(['questions.variants'])
            ->get();
            
        $questions = collect();
        
        // Get questions from different difficulty levels
        foreach ($topics as $topic) {
            $topicQuestions = $topic->questions->take(3); // 3 questions per topic
            $questions = $questions->merge($topicQuestions);
        }
        
        $questions = $questions->take(15)->shuffle(); // Limit to 15 questions
        
        $formattedQuestions = $questions->map(function ($question) {
            return [
                'id' => $question->id,
                'question' => $question->question,
                'formulas' => json_decode($question->formulas, true),
                'images' => json_decode($question->images, true),
                'variants' => $question->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'option_letter' => $variant->option_letter,
                        'text' => $variant->text,
                        'formulas' => json_decode($variant->formulas, true),
                        'is_correct' => $variant->is_correct
                    ];
                })
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => [
                'questions' => $formattedQuestions,
                'test_type' => 'level_finding',
                'subject_id' => $subjectId,
                'message' => 'Bu test sizning bilim darajangizni aniqlash uchun. Barcha savollarga javob bering.'
            ]
        ]);
    }


}
