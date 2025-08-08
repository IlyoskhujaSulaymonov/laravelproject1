<?php 
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::latest()->paginate(10);
        return view('admin.subjects.index', compact('subjects'));
    }

    public function create()
    {
        return view('admin.subjects.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code',
            'description' => 'nullable|string',
        ]);

        Subject::create($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Fan muvaffaqiyatli qo‘shildi.');
    }

    public function edit(Subject $subject)
    {
        return view('admin.subjects.edit', compact('subject'));
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code,' . $subject->id,
            'description' => 'nullable|string',
        ]);

        $subject->update($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Fan yangilandi.');
    }

    public function destroy(Subject $subject)
    {
        if ($subject->topics()->exists()) {
            return redirect()->route('admin.subjects.index')->with('error', 'Fanni o‘chirish mumkin emas, chunki unga bog‘langan mavzular mavjud.');
        }

        $subject->delete();
        return redirect()->route('admin.subjects.index')->with('success', 'Fan o‘chirildi.');
    }
}
