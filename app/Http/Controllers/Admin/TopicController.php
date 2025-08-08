<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
public function index(Request $request)
{
    $subjects = Subject::all();
    $query = Topic::with('subject')->orderBy('order');

    if ($request->filled('subject_id')) {
        $query->where('subject_id', $request->subject_id);
    }
    if ($request->filled('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    $topics = $query->paginate(10); // Show 10 per page

    return view('admin.topics.index', compact('topics', 'subjects'));
}


    public function create()
    {
        $subjects = Subject::all();
        return view('admin.topics.create', compact('subjects'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        Topic::create($request->all());
        return redirect()->route('admin.topics.index')->with('success', 'Topic created!');
    }

    public function show(Topic $topic)
    {
        return view('admin.topics.show', compact('topic'));
    }

    public function edit(Topic $topic)
    {
        $subjects = Subject::all();
        return view('admin.topics.edit', compact('topic', 'subjects'));
    }

    public function update(Request $request, Topic $topic)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $topic->update($request->all());
        return redirect()->route('admin.topics.index')->with('success', 'Topic updated!');
    }

    public function destroy(Topic $topic)
    {
        $topic->delete();
        return redirect()->route('admin.topics.index')->with('success', 'Topic deleted!');
    }
}
