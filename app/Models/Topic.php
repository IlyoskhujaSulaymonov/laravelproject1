<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    protected $fillable = [
        'subject_id',
        'title', 
        'order',
        'difficulty_level',
        'prerequisites',
        'description',
        'learning_objectives',
        'materials',
        'estimated_time',
        'is_assessment',
        'min_score_to_pass'
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'materials' => 'array',
        'is_assessment' => 'boolean'
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserTopicProgress::class);
    }

    public function userTests()
    {
        return $this->hasMany(UserTest::class);
    }

    // Get prerequisites as Topic models
    public function prerequisiteTopics()
    {
        if (empty($this->prerequisites)) {
            return collect();
        }
        return Topic::whereIn('id', $this->prerequisites)->get();
    }

    // Check if user has completed prerequisites
    public function hasCompletedPrerequisites($userId)
    {
        if (empty($this->prerequisites)) {
            return true;
        }
        
        $completedCount = UserTopicProgress::where('user_id', $userId)
            ->whereIn('topic_id', $this->prerequisites)
            ->whereIn('status', ['completed', 'mastered'])
            ->count();
            
        return $completedCount === count($this->prerequisites);
    }

    // Get user's progress for this topic
    public function getUserProgress($userId)
    {
        return $this->userProgress()->where('user_id', $userId)->first();
    }

    // Check if topic is available for user based on skill level and prerequisites
    public function isAvailableForUser($userId)
    {
        // Check if user has completed prerequisites
        if (!$this->hasCompletedPrerequisites($userId)) {
            return false;
        }

        // Check if user's skill level matches topic difficulty
        $userSkillLevel = UserSkillLevel::where('user_id', $userId)
            ->where('subject_id', $this->subject_id)
            ->first();

        if (!$userSkillLevel) {
            // If no skill level assessment, only allow beginner topics
            return $this->difficulty_level === 'beginner';
        }

        $skillHierarchy = ['beginner', 'intermediate', 'advanced'];
        $userLevel = array_search($userSkillLevel->skill_level, $skillHierarchy);
        $topicLevel = array_search($this->difficulty_level, $skillHierarchy);

        return $topicLevel <= $userLevel;
    }
}
