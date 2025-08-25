<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRecommendation extends Model
{
    protected $fillable = [
        'user_id',
        'topic_id',
        'reason',
        'priority',
        'explanation',
        'is_active',
        'recommended_at',
        'dismissed_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'recommended_at' => 'datetime',
        'dismissed_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    // Generate recommendations for a user
    public static function generateRecommendationsForUser($userId)
    {
        $user = User::find($userId);
        if (!$user) return;

        // Clear old recommendations
        self::where('user_id', $userId)->delete();

        $recommendations = [];

        // Get user's progress across all topics
        $userProgress = UserTopicProgress::where('user_id', $userId)
            ->with('topic.subject')
            ->get();

        // Get user's skill levels
        $userSkillLevels = UserSkillLevel::where('user_id', $userId)->get()->keyBy('subject_id');

        // 1. Recommend weak areas for practice
        foreach ($userProgress as $progress) {
            if ($progress->needsMorePractice()) {
                $recommendations[] = [
                    'user_id' => $userId,
                    'topic_id' => $progress->topic_id,
                    'reason' => 'weak_area',
                    'priority' => 1,
                    'explanation' => "You scored {$progress->best_score}% on this topic. Practice more to improve!",
                    'is_active' => true,
                    'recommended_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        }

        // 2. Recommend next level topics
        foreach ($userSkillLevels as $subjectId => $skillLevel) {
            $completedTopics = $userProgress->where('topic.subject_id', $subjectId)
                ->whereIn('status', ['completed', 'mastered'])
                ->pluck('topic_id');

            // Find next available topics
            $nextTopics = Topic::where('subject_id', $subjectId)
                ->whereNotIn('id', $completedTopics)
                ->where('difficulty_level', $skillLevel->skill_level)
                ->get();

            foreach ($nextTopics as $topic) {
                if ($topic->hasCompletedPrerequisites($userId)) {
                    $recommendations[] = [
                        'user_id' => $userId,
                        'topic_id' => $topic->id,
                        'reason' => 'next_level',
                        'priority' => 2,
                        'explanation' => "Ready for the next topic: {$topic->title}",
                        'is_active' => true,
                        'recommended_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                    break; // Only recommend one next topic per subject
                }
            }
        }

        // 3. Recommend prerequisite topics for locked content
        $allTopics = Topic::with('subject')->get();
        foreach ($allTopics as $topic) {
            if (!$topic->hasCompletedPrerequisites($userId) && $topic->isAvailableForUser($userId)) {
                $prerequisites = $topic->prerequisiteTopics();
                foreach ($prerequisites as $prereq) {
                    $progress = $userProgress->where('topic_id', $prereq->id)->first();
                    if (!$progress || !in_array($progress->status, ['completed', 'mastered'])) {
                        $recommendations[] = [
                            'user_id' => $userId,
                            'topic_id' => $prereq->id,
                            'reason' => 'prerequisite',
                            'priority' => 1,
                            'explanation' => "Complete this to unlock: {$topic->title}",
                            'is_active' => true,
                            'recommended_at' => now(),
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    }
                }
            }
        }

        // 4. Recommend review for old completed topics
        $oldCompletedTopics = $userProgress->where('status', 'completed')
            ->where('last_attempted_at', '<', now()->subWeeks(4));

        foreach ($oldCompletedTopics as $progress) {
            $recommendations[] = [
                'user_id' => $userId,
                'topic_id' => $progress->topic_id,
                'reason' => 'review',
                'priority' => 3,
                'explanation' => "Time for a review to keep your skills sharp!",
                'is_active' => true,
                'recommended_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        // Remove duplicates and limit recommendations
        $uniqueRecommendations = collect($recommendations)
            ->unique('topic_id')
            ->sortBy('priority')
            ->take(10)
            ->toArray();

        // Insert recommendations
        if (!empty($uniqueRecommendations)) {
            self::insert($uniqueRecommendations);
        }
    }

    // Dismiss a recommendation
    public function dismiss()
    {
        $this->update([
            'is_active' => false,
            'dismissed_at' => now()
        ]);
    }

    // Get active recommendations for user
    public static function getActiveForUser($userId)
    {
        return self::where('user_id', $userId)
            ->where('is_active', true)
            ->with('topic.subject')
            ->orderBy('priority')
            ->orderBy('recommended_at', 'desc')
            ->get();
    }
}