<?php 
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::latest()->paginate(10);
        return view('admin.classes.index', compact('classes'));
    }

    public function create()
    {
        return view('admin.classes.create');
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:10']);
        SchoolClass::create(['name' => $request->name]);
        return redirect()->route('admin.classes.index')->with('success', 'Sinf qo‘shildi.');
    }

    public function edit(SchoolClass $class)
    {
        return view('admin.classes.edit', compact('class'));
    }

    public function update(Request $request, SchoolClass $class)
    {
        $request->validate(['name' => 'required|string|max:10']);
        $class->update(['name' => $request->name]);
        return redirect()->route('admin.classes.index')->with('success', 'Sinf yangilandi.');
    }

    public function destroy(SchoolClass $class)
    {
        $class->delete();
        return redirect()->route('admin.classes.index')->with('success', 'Sinf o‘chirildi.');
    }
}
