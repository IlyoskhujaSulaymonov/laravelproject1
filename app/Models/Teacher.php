<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $table = 'teachers';

    use HasFactory;

    protected $fillable = ['user_id', 'name', 'email', 'phone'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    protected static function booted()
    {
        static::deleting(function ($teacher) {
            if ($teacher->user) {
                $teacher->user->delete();
            }
        });
    }
}
