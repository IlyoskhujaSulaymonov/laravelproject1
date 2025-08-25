<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTest extends Model
{
    protected $fillable = [
        'user_id',
        'topic_id',
        'test_name',
        'total_questions',
        'correct_answers',
        'score_percentage',
        'time_spent',
        'questions_data',
        'status',
        'category',
        'difficulty_level',
        'test_type'
    ];

    protected $casts = [
        'questions_data' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function getFormattedTimeSpentAttribute(): string
    {
        if (!$this->time_spent) {
            return 'N/A';
        }

        $minutes = floor($this->time_spent / 60);
        $seconds = $this->time_spent % 60;

        return sprintf('%d:%02d', $minutes, $seconds);
    }

    public function getGradeAttribute(): string
    {
        $score = $this->score_percentage;

        if ($score >= 90) return 'A\'lo';
        if ($score >= 80) return 'Yaxshi';
        if ($score >= 70) return 'Qoniqarli';
        if ($score >= 60) return 'O\'rtacha';
        return 'Qoniqarsiz';
    }
}
