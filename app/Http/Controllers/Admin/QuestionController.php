<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
     public function index()
    {
        $questions = Question::with('topic')->paginate(10);
        return view('admin.questions.index', compact('questions'));
    }

    public function create()
    {
        $topics = Topic::all();
        return view('admin.questions.create', compact('topics'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'content' => 'required|string',
            'variants.*.text' => 'required|string',
            'correct_variant' => 'required|in:0,1,2,3',
        ]);

        $question = Question::create($request->only('topic_id', 'content'));

        foreach ($request->variants as $index => $variant) {
            $question->variants()->create([
                'text' => $variant['text'],
                'is_correct' => $request->correct_variant == $index,
            ]);
        }

        return redirect()->route('admin.questions.index')->with('success', 'Savol qo‘shildi!');
    }


    public function edit(Question $question)
    {
        $topics = Topic::all();
        $question->load('variants');
        return view('admin.questions.edit', compact('question', 'topics'));
    }

    public function update(Request $request, Question $question)
    {
        $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'content' => 'required|string',
            'variants.*.text' => 'required|string',
            'variants.*.is_correct' => 'boolean',
        ]);

        $question->update($request->only('topic_id', 'content'));
        $question->variants()->delete();

        foreach ($request->variants as $variant) {
            $question->variants()->create($variant);
        }

        return redirect()->route('admin.questions.index')->with('success', 'Savol yangilandi!');
    }

    public function destroy(Question $question)
    {
        $question->delete();
        return redirect()->route('admin.questions.index')->with('success', 'Savol o‘chirildi!');
    }
}
