<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserTest;
use App\Models\User;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserTestController extends Controller
{
    /**
     * Display a listing of user tests.
     */
    public function index(Request $request)
    {
        $query = UserTest::with(['user', 'topic.subject'])
            ->orderBy('created_at', 'desc');

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by subject
        if ($request->filled('subject_id')) {
            $query->whereHas('topic', function ($q) use ($request) {
                $q->where('subject_id', $request->subject_id);
            });
        }

        // Filter by topic
        if ($request->filled('topic_id')) {
            $query->where('topic_id', $request->topic_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by test type
        if ($request->filled('test_type')) {
            $query->where('test_type', $request->test_type);
        }

        // Filter by score range
        if ($request->filled('min_score')) {
            $query->where('score_percentage', '>=', $request->min_score);
        }
        if ($request->filled('max_score')) {
            $query->where('score_percentage', '<=', $request->max_score);
        }

        // Date range filter
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Search by test name or user name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('test_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $tests = $query->paginate(20);

        // Get filter options
        $users = User::where('role_id', 3)->orderBy('name')->get(); // Students only
        $subjects = Subject::orderBy('name')->get();
        $topics = Topic::orderBy('title')->get();

        return view('admin.user-tests.index', compact('tests', 'users', 'subjects', 'topics'));
    }

    /**
     * Display the specified user test.
     */
    public function show(UserTest $userTest)
    {
        $userTest->load(['user', 'topic.subject']);
        
        // Get detailed question analysis if available
        $questionAnalysis = [];
        if ($userTest->questions_data && is_array($userTest->questions_data)) {
            foreach ($userTest->questions_data as $questionData) {
                if (isset($questionData['question_id'])) {
                    $question = \App\Models\Question::with('variants')
                        ->find($questionData['question_id']);
                    
                    if ($question) {
                        $userAnswer = $question->variants->firstWhere('id', $questionData['user_answer_id'] ?? null);
                        $correctAnswer = $question->variants->firstWhere('id', $questionData['correct_answer_id'] ?? null);
                        
                        $questionAnalysis[] = [
                            'question' => $question,
                            'user_answer' => $userAnswer,
                            'correct_answer' => $correctAnswer,
                            'is_correct' => $questionData['is_correct'] ?? false,
                        ];
                    }
                }
            }
        }

        return view('admin.user-tests.show', compact('userTest', 'questionAnalysis'));
    }

    /**
     * Get analytics data for user tests.
     */
    public function analytics(Request $request)
    {
        // Basic statistics
        $totalTests = UserTest::count();
        $completedTests = UserTest::where('status', 'completed')->count();
        $averageScore = UserTest::where('status', 'completed')->avg('score_percentage');
        $totalUsers = UserTest::distinct('user_id')->count();

        // Tests by subject
        $testsBySubject = UserTest::select(
                'subjects.name as subject_name',
                DB::raw('COUNT(*) as test_count'),
                DB::raw('AVG(score_percentage) as avg_score')
            )
            ->join('topics', 'user_tests.topic_id', '=', 'topics.id')
            ->join('subjects', 'topics.subject_id', '=', 'subjects.id')
            ->where('user_tests.status', 'completed')
            ->groupBy('subjects.id', 'subjects.name')
            ->orderBy('test_count', 'desc')
            ->get();

        // Tests by month (last 12 months)
        $testsByMonth = UserTest::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as test_count'),
                DB::raw('AVG(score_percentage) as avg_score')
            )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top performers (users with highest average scores)
        $topPerformers = UserTest::select(
                'users.name',
                'users.email',
                DB::raw('COUNT(*) as total_tests'),
                DB::raw('AVG(score_percentage) as avg_score'),
                DB::raw('MAX(score_percentage) as best_score')
            )
            ->join('users', 'user_tests.user_id', '=', 'users.id')
            ->where('user_tests.status', 'completed')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->having('total_tests', '>=', 3) // At least 3 tests
            ->orderBy('avg_score', 'desc')
            ->limit(10)
            ->get();

        // Recent activity (last 7 days)
        $recentActivity = UserTest::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as test_count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return view('admin.user-tests.analytics', compact(
            'totalTests', 'completedTests', 'averageScore', 'totalUsers',
            'testsBySubject', 'testsByMonth', 'topPerformers', 'recentActivity'
        ));
    }

    /**
     * Delete a user test.
     */
    public function destroy(UserTest $userTest)
    {
        $userTest->delete();

        return redirect()->route('admin.user-tests.index')
            ->with('success', 'Foydalanuvchi testi muvaffaqiyatli o\'chirildi!');
    }

    /**
     * Export user tests data.
     */
    public function export(Request $request)
    {
        $query = UserTest::with(['user', 'topic.subject']);

        // Apply same filters as index method
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('subject_id')) {
            $query->whereHas('topic', function ($q) use ($request) {
                $q->where('subject_id', $request->subject_id);
            });
        }

        // Add more filters as needed...

        $tests = $query->get();

        $filename = 'user_tests_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );

        $callback = function() use($tests) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'ID', 'User Name', 'User Email', 'Subject', 'Topic', 'Test Name',
                'Total Questions', 'Correct Answers', 'Score %', 'Time Spent',
                'Status', 'Test Type', 'Created At'
            ]);

            foreach ($tests as $test) {
                fputcsv($file, [
                    $test->id,
                    $test->user->name,
                    $test->user->email,
                    $test->topic->subject->name ?? '',
                    $test->topic->title,
                    $test->test_name,
                    $test->total_questions,
                    $test->correct_answers,
                    $test->score_percentage,
                    $test->formatted_time_spent,
                    $test->status,
                    $test->test_type ?? '',
                    $test->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}