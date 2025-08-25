<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSkillLevel extends Model
{
    protected $fillable = [
        'user_id',
        'subject_id',
        'skill_level',
        'assessment_score',
        'last_assessed_at',
        'needs_reassessment'
    ];

    protected $casts = [
        'last_assessed_at' => 'datetime',
        'needs_reassessment' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // Check if assessment is outdated (older than 3 months)
    public function isAssessmentOutdated()
    {
        if (!$this->last_assessed_at) {
            return true;
        }
        
        return $this->last_assessed_at->lt(now()->subMonths(3));
    }

    // Get skill level as numeric value for comparisons
    public function getSkillLevelNumeric()
    {
        $levels = ['beginner' => 1, 'intermediate' => 2, 'advanced' => 3];
        return $levels[$this->skill_level] ?? 1;
    }

    // Update skill level based on recent performance
    public function updateSkillLevelFromPerformance()
    {
        $recentTests = UserTest::where('user_id', $this->user_id)
            ->whereHas('topic', function($query) {
                $query->where('subject_id', $this->subject_id);
            })
            ->where('created_at', '>=', now()->subWeeks(4))
            ->get();

        if ($recentTests->isEmpty()) {
            return;
        }

        $averageScore = $recentTests->avg('score_percentage');
        
        $newLevel = 'beginner';
        if ($averageScore >= 85) {
            $newLevel = 'advanced';
        } elseif ($averageScore >= 70) {
            $newLevel = 'intermediate';
        }

        if ($newLevel !== $this->skill_level) {
            $this->update([
                'skill_level' => $newLevel,
                'last_assessed_at' => now(),
                'needs_reassessment' => false
            ]);
        }
    }
}