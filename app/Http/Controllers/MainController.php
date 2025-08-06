<?php

namespace App\Http\Controllers;
use App\Models\Question;
use App\Models\Student;

use Illuminate\Http\Request;

class MainController extends Controller
{

    public function main()
    {
        return redirect('admin.dashboard');
    }

    public function dashboard()
    {
        return view('admin.dashboard')->with([
            'students' => Student::all(),
        ]);
    }
}
