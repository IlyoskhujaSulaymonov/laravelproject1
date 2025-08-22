<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserData extends Model
{
    protected $fillable = ['user_id','region_id', 'date_of_birth', 'occupation', 'education_level', 'current_grade', 'subjects', 'goals'];

    protected $casts = [
        'subjects' => 'array',
        'goals' => 'array',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function city()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}
