<?php

namespace App\Services;

use App\Models\User;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\Question;
use App\Models\UserTest;
use App\Models\UserSkillLevel;
use App\Models\UserTopicProgress;
use App\Models\UserRecommendation;
use Illuminate\Support\Collection;

class AdaptiveLearningService
{
    /**
     * Conduct skill assessment for a user in a specific subject
     */
    public function conductSkillAssessment($userId, $subjectId, $questionsPerLevel = 5)
    {
        $user = User::find($userId);
        $subject = Subject::find($subjectId);
        
        if (!$user || !$subject) {
            throw new \Exception('User or Subject not found');
        }

        // Get assessment topics for each difficulty level
        $assessmentTopics = Topic::where('subject_id', $subjectId)
            ->where('is_assessment', true)
            ->orderBy('difficulty_level')
            ->orderBy('order')
            ->get()
            ->groupBy('difficulty_level');

        $skillLevel = 'beginner';
        $totalScore = 0;
        $totalQuestions = 0;

        // Test each difficulty level
        foreach (['beginner', 'intermediate', 'advanced'] as $level) {
            if (!isset($assessmentTopics[$level])) {
                continue;
            }

            $questions = $this->getAssessmentQuestions($assessmentTopics[$level], $questionsPerLevel);
            
            if ($questions->isEmpty()) {
                continue;
            }

            // Create assessment test
            $testData = [
                'user_id' => $userId,
                'topic_id' => $assessmentTopics[$level]->first()->id,
                'test_name' => "Skill Assessment - {$subject->name} ({$level})",
                'total_questions' => $questions->count(),
                'test_type' => 'assessment',
                'difficulty_level' => $level,
                'category' => 'skill_assessment'
            ];

            // This would typically be handled by the frontend
            // For now, we'll simulate the assessment
            $score = $this->simulateAssessmentScore($level);
            
            $testData['correct_answers'] = round(($score / 100) * $testData['total_questions']);
            $testData['score_percentage'] = $score;
            $testData['status'] = 'completed';

            UserTest::create($testData);

            $totalScore += $score;
            $totalQuestions += $testData['total_questions'];

            // Determine skill level based on performance
            if ($score >= 70) {
                $skillLevel = $level;
                if ($level === 'advanced' && $score >= 85) {
                    break; // User has mastered advanced level
                }
            } else {
                break; // User struggled at this level
            }
        }

        // Save or update skill level
        $averageScore = $totalQuestions > 0 ? round($totalScore / 3) : 0;
        
        UserSkillLevel::updateOrCreate(
            ['user_id' => $userId, 'subject_id' => $subjectId],
            [
                'skill_level' => $skillLevel,
                'assessment_score' => $averageScore,
                'last_assessed_at' => now(),
                'needs_reassessment' => false
            ]
        );

        // Generate initial learning recommendations
        UserRecommendation::generateRecommendationsForUser($userId);

        return [
            'skill_level' => $skillLevel,
            'score' => $averageScore,
            'recommendations' => UserRecommendation::getActiveForUser($userId)
        ];
    }

    /**
     * Get assessment questions for topics
     */
    private function getAssessmentQuestions(Collection $topics, $questionsPerLevel)
    {
        $questions = collect();
        
        foreach ($topics as $topic) {
            $topicQuestions = Question::where('topic_id', $topic->id)
                ->inRandomOrder()
                ->limit($questionsPerLevel)
                ->get();
            
            $questions = $questions->merge($topicQuestions);
        }

        return $questions->shuffle()->take($questionsPerLevel * 2); // Get double for variety
    }

    /**
     * Simulate assessment score (in real implementation, this would come from user)
     */
    private function simulateAssessmentScore($level)
    {
        switch ($level) {
            case 'beginner':
                return rand(70, 95);
            case 'intermediate':
                return rand(60, 85);
            case 'advanced':
                return rand(50, 80);
            default:
                return rand(50, 70);
        }
    }

    /**
     * Process test results and update learning progress
     */
    public function processTestResult(UserTest $test)
    {
        // Update topic progress
        $progress = UserTopicProgress::updateOrCreate(
            ['user_id' => $test->user_id, 'topic_id' => $test->topic_id],
            [
                'status' => 'in_progress',
                'attempts' => 0,
                'correct_answers' => 0,
                'total_questions_attempted' => 0,
                'weak_areas' => []
            ]
        );

        $progress->updateFromTestResult($test);

        // Update skill level if needed
        $this->updateSkillLevelFromPerformance($test->user_id, $test->topic->subject_id);

        // Generate new recommendations
        UserRecommendation::generateRecommendationsForUser($test->user_id);

        return $progress;
    }

    /**
     * Update user's skill level based on recent performance
     */
    private function updateSkillLevelFromPerformance($userId, $subjectId)
    {
        $skillLevel = UserSkillLevel::where('user_id', $userId)
            ->where('subject_id', $subjectId)
            ->first();

        if ($skillLevel) {
            $skillLevel->updateSkillLevelFromPerformance();
        }
    }

    /**
     * Get personalized learning path for user
     */
    public function getPersonalizedLearningPath($userId, $subjectId = null)
    {
        $query = UserRecommendation::where('user_id', $userId)
            ->where('is_active', true)
            ->with(['topic.subject', 'topic.userProgress' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);

        if ($subjectId) {
            $query->whereHas('topic', function($q) use ($subjectId) {
                $q->where('subject_id', $subjectId);
            });
        }

        $recommendations = $query->orderBy('priority')
            ->orderBy('recommended_at', 'desc')
            ->get();

        return $recommendations->map(function($rec) {
            return [
                'id' => $rec->id,
                'topic' => [
                    'id' => $rec->topic->id,
                    'title' => $rec->topic->title,
                    'subject' => $rec->topic->subject->name,
                    'difficulty_level' => $rec->topic->difficulty_level,
                    'estimated_time' => $rec->topic->estimated_time,
                    'description' => $rec->topic->description,
                    'materials' => $rec->topic->materials
                ],
                'reason' => $rec->reason,
                'explanation' => $rec->explanation,
                'priority' => $rec->priority,
                'progress' => $rec->topic->userProgress->first() ? [
                    'status' => $rec->topic->userProgress->first()->status,
                    'best_score' => $rec->topic->userProgress->first()->best_score,
                    'attempts' => $rec->topic->userProgress->first()->attempts
                ] : null
            ];
        });
    }

    /**
     * Get learning analytics for user
     */
    public function getLearningAnalytics($userId)
    {
        $user = User::find($userId);
        
        $skillLevels = $user->skillLevels()->with('subject')->get();
        $topicProgress = $user->topicProgress()->with('topic.subject')->get();
        $recentTests = $user->userTests()
            ->with('topic.subject')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $analytics = [
            'skill_levels' => $skillLevels->map(function($sl) {
                return [
                    'subject' => $sl->subject->name,
                    'level' => $sl->skill_level,
                    'score' => $sl->assessment_score,
                    'last_assessed' => $sl->last_assessed_at?->format('Y-m-d'),
                    'needs_reassessment' => $sl->needs_reassessment || $sl->isAssessmentOutdated()
                ];
            }),
            'topic_progress' => $topicProgress->groupBy('topic.subject.name')->map(function($subjects) {
                return [
                    'total_topics' => $subjects->count(),
                    'completed' => $subjects->whereIn('status', ['completed', 'mastered'])->count(),
                    'mastered' => $subjects->where('status', 'mastered')->count(),
                    'in_progress' => $subjects->where('status', 'in_progress')->count(),
                    'average_score' => round($subjects->avg('best_score'), 1)
                ];
            }),
            'recent_activity' => $recentTests->map(function($test) {
                return [
                    'test_name' => $test->test_name,
                    'topic' => $test->topic->title,
                    'subject' => $test->topic->subject->name,
                    'score' => $test->score_percentage,
                    'date' => $test->created_at->format('Y-m-d H:i')
                ];
            }),
            'overall_stats' => [
                'total_tests_taken' => $user->userTests()->count(),
                'average_score' => round($user->userTests()->avg('score_percentage'), 1),
                'total_study_time' => $user->userTests()->sum('time_spent'),
                'topics_mastered' => $topicProgress->where('status', 'mastered')->count(),
                'subjects_active' => $skillLevels->count()
            ]
        ];

        return $analytics;
    }
}