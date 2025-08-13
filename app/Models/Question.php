<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
protected $fillable = ['topic_id', 'question','formulas','images'];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }
}
