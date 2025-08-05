<?php

namespace App\Http\Controllers;
use App\Models\Questions;
use App\Models\Student;

use Illuminate\Http\Request;

class MainController extends Controller
{

    public function main()
    {
        return redirect('/dashboard');
    }

    public function dashboard()
    {
        return view('dashboard')->with([
            'questions' => Questions::latest()->paginate(10),
            'students' => Student::all(),
        ]);
    }
}
