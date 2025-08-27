<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'email'    => $this->email,
            'phone'    => $this->phone ?? null,
            'city'     => $this->whenLoaded('userData.region', fn () => $this->userData->region->name),
            'user_data' => $this->whenLoaded('userData', fn () => [
                'region_id' => $this->userData->region_id,
                'date_of_birth' => $this->userData->date_of_birth,
                'occupation' => $this->userData->occupation,
                'education_level' => $this->userData->education_level,
                'current_grade' => $this->userData->current_grade,
                'subjects' => $this->userData->subjects,
                'goals' => $this->userData->goals,
            ]),
            'current_plan' => $this->whenLoaded('currentPlan.plan', fn () => [
                'id' => $this->currentPlan->id,
                'plan_id' => $this->currentPlan->plan->id,
                'name' => $this->currentPlan->plan->name,
                'slug' => $this->currentPlan->plan->slug,
                'price' => $this->currentPlan->plan->price,
                'duration' => $this->currentPlan->plan->duration,
                'description' => $this->currentPlan->plan->description,
                'features' => $this->currentPlan->plan->features,
                'assessments_limit' => $this->currentPlan->plan->assessments_limit,
                'lessons_limit' => $this->currentPlan->plan->lessons_limit,
                'ai_hints_limit' => $this->currentPlan->plan->ai_hints_limit,
                'subjects_limit' => $this->currentPlan->plan->subjects_limit,
                'starts_at' => $this->currentPlan->starts_at,
                'ends_at' => $this->currentPlan->ends_at,
                'is_active' => $this->currentPlan->is_active,
            ]),
            'email_verified_at' => $this->email_verified_at,
            'avatar'   => $this->avatar,
            'created_at'  => $this->created_at?->toDateTimeString(),
            'updated_at'  => $this->updated_at?->toDateTimeString(),
            'last_login_at' => $this->last_login_at?->toDateTimeString(),
        ];
    }
}