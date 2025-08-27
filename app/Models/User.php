<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Models\Teacher;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    const ROLE_ADMIN = 0;
    const ROLE_USER = 1;
    const ROLE_TEACHER = 2;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'role',
        'name',
        'email',
        'phone',
        'avatar',
        'password',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function userData()
    {
        return $this->hasOne(UserData::class);
    }
    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(UserPlan::class);
    }

    public function currentPlan()
    {
        return $this->hasOne(UserPlan::class)
            ->where('is_active', true);
    }

    public function userPlan()
    {
        return $this->currentPlan();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function userTests()
    {
        return $this->hasMany(UserTest::class);
    }

    public function skillLevels()
    {
        return $this->hasMany(UserSkillLevel::class);
    }

    public function getBalanceAttribute()
    {
        return $this->payments()->where('payment_purpose', 'income')->sum('amount') -
            $this->payments()->where('payment_purpose', 'expense')->sum('amount');
    }

    public static function getRole($role = null)
    {
        $arr = [
            self::ROLE_ADMIN => 'admin',
            self::ROLE_USER => 'o\'quvchi',
            self::ROLE_TEACHER => 'o\'qituvchi',
        ];

        if ($role === null) {
            return $arr;
        }

        return $arr[$role];
    }

    public function getRoleNameAttribute()
    {
        return self::getRole($this->role);
    }

    protected static function booted()
    {
        static::created(function ($user) {
            // Only apply free plan to students
            if ($user->role === self::ROLE_USER) {
                $freePlan = Plan::where('slug', 'free')->first();

                if ($freePlan) {
                    $user->subscriptions()->create([
                        'plan_id'   => $freePlan->id,
                        'starts_at' => now(),
                        'ends_at'   => null,
                        'is_active' => true,
                    ]);
                }
            }
        });
    }

    // Check if user has found their skill level for any subject
    public function hasFoundSkillLevel()
    {
        return $this->skillLevels()->exists();
    }

    // Get skill level for a specific subject
    public function getSkillLevel($subjectId)
    {
        return $this->skillLevels()->where('subject_id', $subjectId)->first();
    }

    // Check if user needs to find their level (no skill levels recorded)
    public function needsLevelAssessment()
    {
        return !$this->hasFoundSkillLevel();
    }

    // Can take assessment test (within plan limits)
    public function canTakeAssessment()
    {
        $currentPlan = $this->currentPlan;
        if (!$currentPlan) {
            return false;
        }
        
        return $currentPlan->canTakeAssessment();
    }

    // Get remaining assessments for current month
    public function getRemainingAssessments()
    {
        $currentPlan = $this->currentPlan;
        if (!$currentPlan) {
            return 0;
        }
        
        return $currentPlan->getRemainingAssessments();
    }
}
