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

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getBalanceAttribute()
    {
        return $this->payments()->where('payment_purpose','income')->sum('amount') -
         $this->payments()->where('payment_purpose','expense')->sum('amount');
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
}
