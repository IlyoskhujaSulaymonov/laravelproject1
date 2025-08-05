<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $table = 'teachers'; // Specify the table name if it's not the plural form of the model name
    
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'email', 'phone'];
}
