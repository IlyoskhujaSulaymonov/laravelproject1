<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teachers extends Model
{
    protected $fillable = ['name', 'user_id', 'subject', 'file_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
