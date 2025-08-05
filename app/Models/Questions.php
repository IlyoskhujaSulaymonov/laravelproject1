<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
    protected $fillable = ['user_id', 'subject', 'topic', 'file_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
