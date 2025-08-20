<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;


class Plan extends Model
{
    use SoftDeletes;
   protected $fillable = [
        'name', 'slug', 'price', 'duration', 'description', 'features','assessments_limit', 'lessons_limit', 'ai_hints_limit', 'subjects_limit'
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(UserPlan::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($plan) {
            $plan->slug = Str::slug($plan->name);
        });

        static::updating(function ($plan) {
            $plan->slug = Str::slug($plan->name);
        });
    }
}
