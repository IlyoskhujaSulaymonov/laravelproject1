<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $fillable = ['question_id', 'text', 'is_correct','option_letter','formulas'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
