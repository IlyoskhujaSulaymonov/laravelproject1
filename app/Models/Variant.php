<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $fillable = ['question_id', 'text', 'is_correct','image_path','is_correct', 'format'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
