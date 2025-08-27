<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPlan extends Model
{
   protected $fillable = [
        'user_id', 'plan_id', 'starts_at', 'ends_at', 'is_active', 'assessments_used', 'lessons_used', 'ai_hints_used', 'last_reset_date'
    ];

    protected $casts = [
        'starts_at' => 'date',
        'ends_at' => 'date', 
        'last_reset_date' => 'date',
        'features'       => 'array'
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Check if user can take more assessments
    public function canTakeAssessment()
    {
        $this->resetUsageIfNeeded();
        return $this->assessments_used < $this->plan->assessments_limit;
    }

    // Check if user can take more lessons
    public function canTakeLesson()
    {
        $this->resetUsageIfNeeded();
        return $this->lessons_used < $this->plan->lessons_limit;
    }

    // Check if user can use AI hints
    public function canUseAIHint()
    {
        $this->resetUsageIfNeeded();
        return $this->ai_hints_used < $this->plan->ai_hints_limit;
    }

    // Increment assessment usage
    public function useAssessment()
    {
        $this->resetUsageIfNeeded();
        $this->increment('assessments_used');
        return $this;
    }

    // Increment lesson usage
    public function useLesson()
    {
        $this->resetUsageIfNeeded();
        $this->increment('lessons_used');
        return $this;
    }

    // Increment AI hint usage
    public function useAIHint()
    {
        $this->resetUsageIfNeeded();
        $this->increment('ai_hints_used');
        return $this;
    }

    // Get remaining assessments
    public function getRemainingAssessments()
    {
        $this->resetUsageIfNeeded();
        return max(0, $this->plan->assessments_limit - $this->assessments_used);
    }

    // Get remaining lessons
    public function getRemainingLessons()
    {
        $this->resetUsageIfNeeded();
        return max(0, $this->plan->lessons_limit - $this->lessons_used);
    }

    // Get remaining AI hints
    public function getRemainingAIHints()
    {
        $this->resetUsageIfNeeded();
        return max(0, $this->plan->ai_hints_limit - $this->ai_hints_used);
    }

    // Reset usage counts if month has passed
    protected function resetUsageIfNeeded()
    {
        $now = now()->startOfDay();
        $lastReset = $this->last_reset_date ?? $this->starts_at ?? $now;
        
        // Check if a month has passed since last reset
        if ($now->diffInDays($lastReset) >= 30) {
            $this->update([
                'assessments_used' => 0,
                'lessons_used' => 0,
                'ai_hints_used' => 0,
                'last_reset_date' => $now
            ]);
        }
    }
}
