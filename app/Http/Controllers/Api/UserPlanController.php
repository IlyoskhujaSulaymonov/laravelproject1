<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserPlanController extends Controller
{

        /**
     * Get user's current plan details
     */
    public function getCurrentPlan()
    {
        $user = Auth::user();
        $userPlan = $user->currentPlan;
        
        if (!$userPlan) {
            return response()->json([
                'success' => false,
                'message' => 'Hozirda faol reja yo\'q',
                'data' => null
            ]);
        }
        
        $plan = $userPlan->plan;
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $userPlan->id,
                'plan_id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price' => $plan->price,
                'duration' => $plan->duration,
                'features' => $plan->features ?? [],
                'limits' => [
                    'assessments_limit' => $plan->assessments_limit,
                    'lessons_limit' => $plan->lessons_limit,
                    'ai_hints_limit' => $plan->ai_hints_limit,
                    'subjects_limit' => $plan->subjects_limit ?? null
                ],
                'usage' => [
                    'assessments_used' => $userPlan->assessments_used ?? 0,
                    'lessons_used' => $userPlan->lessons_used ?? 0,
                    'ai_hints_used' => $userPlan->ai_hints_used ?? 0
                ],
                'remaining' => [
                    'assessments' => $user->getRemainingAssessments(),
                    'lessons' => max(0, $plan->lessons_limit - ($userPlan->lessons_used ?? 0)),
                    'ai_hints' => max(0, $plan->ai_hints_limit - ($userPlan->ai_hints_used ?? 0))
                ],
                'dates' => [
                    'starts_at' => $userPlan->starts_at,
                    'ends_at' => $userPlan->ends_at,
                    'last_reset_date' => $userPlan->last_reset_date
                ],
                'is_active' => $userPlan->is_active,
                'can_take_assessment' => $user->canTakeAssessment()
            ]
        ]);
    }

    /**
     * Get user's plan usage statistics
     */
    public function getPlanUsage()
    {
        $user = Auth::user();
        $userPlan = $user->currentPlan;
        
        if (!$userPlan) {
            return response()->json([
                'success' => false,
                'message' => 'Hozirda faol reja yo\'q',
                'data' => null
            ]);
        }
        
        $plan = $userPlan->plan;
        
        // // Reset usage if needed (monthly reset)
        // $userPlan->resetUsageIfNeeded();
        
        return response()->json([
            'success' => true,
            'data' => [
                'current_usage' => [
                    'assessments' => $userPlan->assessments_used ?? 0,
                    'lessons' => $userPlan->lessons_used ?? 0,
                    'ai_hints' => $userPlan->ai_hints_used ?? 0
                ],
                'limits' => [
                    'assessments' => $plan->assessments_limit,
                    'lessons' => $plan->lessons_limit,
                    'ai_hints' => $plan->ai_hints_limit
                ],
                'remaining' => [
                    'assessments' => $user->getRemainingAssessments(),
                    'lessons' => $plan->lessons_limit > 0 ? max(0, $plan->lessons_limit - ($userPlan->lessons_used ?? 0)) : -1,
                    'ai_hints' => $plan->ai_hints_limit > 0 ? max(0, $plan->ai_hints_limit - ($userPlan->ai_hints_used ?? 0)) : -1
                ],
                'percentage_used' => [
                    'assessments' => $plan->assessments_limit > 0 ? round((($userPlan->assessments_used ?? 0) / $plan->assessments_limit) * 100, 1) : 0,
                    'lessons' => $plan->lessons_limit > 0 ? round((($userPlan->lessons_used ?? 0) / $plan->lessons_limit) * 100, 1) : 0,
                    'ai_hints' => $plan->ai_hints_limit > 0 ? round((($userPlan->ai_hints_used ?? 0) / $plan->ai_hints_limit) * 100, 1) : 0
                ],
                'can_use' => [
                    'assessments' => $user->canTakeAssessment(),
                    'lessons' => $plan->lessons_limit <= 0 || ($userPlan->lessons_used ?? 0) < $plan->lessons_limit,
                    'ai_hints' => $plan->ai_hints_limit <= 0 || ($userPlan->ai_hints_used ?? 0) < $plan->ai_hints_limit
                ],
                'last_reset_date' => $userPlan->last_reset_date,
                'next_reset_date' => $userPlan->last_reset_date ? $userPlan->last_reset_date->addMonth()->startOfMonth() : now()->addMonth()->startOfMonth(),
                'plan_info' => [
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'is_unlimited' => $plan->assessments_limit >= 999
                ]
            ]
        ]);
    }
}