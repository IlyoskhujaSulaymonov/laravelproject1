<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTopicProgress extends Model
{
    protected $fillable = [
        'user_id',
        'topic_id',
        'status',
        'best_score',
        'attempts',
        'correct_answers',
        'total_questions_attempted',
        'weak_areas',
        'last_attempted_at',
        'completed_at',
        'mastered_at'
    ];

    protected $casts = [
        'weak_areas' => 'array',
        'last_attempted_at' => 'datetime',
        'completed_at' => 'datetime',
        'mastered_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    // Update progress based on test results
    public function updateFromTestResult(UserTest $test)
    {
        $this->attempts += 1;
        $this->total_questions_attempted += $test->total_questions;
        $this->correct_answers += $test->correct_answers;
        $this->last_attempted_at = now();

        if ($test->score_percentage > $this->best_score) {
            $this->best_score = $test->score_percentage;
        }

        // Analyze weak areas from test data
        $this->analyzeWeakAreas($test);

        // Update status based on performance
        $minScoreToPass = $this->topic->min_score_to_pass ?? 70;
        
        if ($test->score_percentage >= $minScoreToPass) {
            if ($this->status === 'not_started' || $this->status === 'in_progress') {
                $this->status = 'completed';
                $this->completed_at = now();
            }
            
            // If score is excellent (90%+), mark as mastered
            if ($test->score_percentage >= 90 && $this->status !== 'mastered') {
                $this->status = 'mastered';
                $this->mastered_at = now();
            }
        } else {
            $this->status = 'in_progress';
        }

        $this->save();
    }

    // Analyze weak areas from test questions
    private function analyzeWeakAreas(UserTest $test)
    {
        $weakAreas = $this->weak_areas ?? [];
        $questionsData = $test->questions_data ?? [];

        foreach ($questionsData as $questionData) {
            if (!$questionData['is_correct']) {
                $questionId = $questionData['question_id'];
                $question = Question::find($questionId);
                
                if ($question) {
                    // You can categorize questions by type/topic here
                    // For now, we'll track question IDs that user struggled with
                    $weakAreas[] = $questionId;
                }
            }
        }

        // Keep only unique weak areas and limit to recent struggles
        $this->weak_areas = array_unique(array_slice($weakAreas, -20));
    }

    // Get accuracy percentage
    public function getAccuracyPercentage()
    {
        if ($this->total_questions_attempted === 0) {
            return 0;
        }
        
        return round(($this->correct_answers / $this->total_questions_attempted) * 100, 1);
    }

    // Check if user needs more practice
    public function needsMorePractice()
    {
        $minScoreToPass = $this->topic->min_score_to_pass ?? 70;
        return $this->best_score < $minScoreToPass || $this->getAccuracyPercentage() < $minScoreToPass;
    }

    // Get study time estimate based on performance
    public function getEstimatedStudyTime()
    {
        $baseTime = $this->topic->estimated_time ?? 30;
        
        if ($this->status === 'mastered') {
            return 0; // No additional study needed
        }
        
        if ($this->best_score >= 80) {
            return round($baseTime * 0.3); // Quick review
        } elseif ($this->best_score >= 60) {
            return round($baseTime * 0.7); // Moderate study
        }
        
        return $baseTime; // Full study time needed
    }
}