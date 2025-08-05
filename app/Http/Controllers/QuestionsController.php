<?php

namespace App\Http\Controllers;

use App\Models\Questions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


class QuestionsController extends Controller
{

    public function store(Request $request)
    {
        
        $request->validate([
            'subject' => 'required|string|max:255',
            'topic' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx|max:15360',
        ]);

        
        $name = $request->file('file')->getClientOriginalName();
        $path = $request->file('file')->storeAs('files', $name, 'public');

        $questions = Questions::create([
            'user_id' => Auth::id(),
            'subject' => $request->input('subject'),
            'topic' => $request->input('topic'),
            'file_url' => $path,
        ]);

        return redirect()->back()->with('success', 'Fayl muvaffaqiyatli yuklandi!');
    }
}
