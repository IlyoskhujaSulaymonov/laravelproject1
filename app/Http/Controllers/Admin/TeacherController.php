<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::latest()->paginate(10);
        return view('admin.teachers.index', compact('teachers'));
    }

    public function create()
    {
        return view('admin.teachers.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'phone'    => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role'     => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $user->id,
            'name'    => $validated['name'],
            'email'   => $validated['email'],
            'phone'   => $validated['phone'] ?? null,
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'O‘qituvchi muvaffaqiyatli qo‘shildi.');
    }


    public function edit(Teacher $teacher)
    {
        return view('admin.teachers.edit', compact('teacher'));
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $teacher->user_id,
            'phone' => 'nullable|string|max:20',
        ]);

        $teacher->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        if ($teacher->user) {
            $teacher->user->update([
                'name'  => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);
        }

        return redirect()->route('admin.teachers.index')->with('success', 'O‘qituvchi yangilandi.');
    }


    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return redirect()->route('admin.teachers.index')
            ->with('success', 'O‘qituvchi hisobi o‘chirildi.');
    }
}
    // public function dashboard()
    // {
    //     return view('teacher.dashboard');
    // }

    // public function list()
    // {
    //     $files = UploadedFile::latest()->get();
    //     return view('teacher.files', compact('files'));
    // }

    // public function uploadForm()
    // {
    //     return view('teacher.upload');
    // }

    // public function upload(Request $request)
    // {
    //     $request->validate([
    //         'title' => 'required|string',
    //         'file' => 'required|file'
    //     ]);

    //     $path = $request->file('file')->store('uploads', 'public');

    //     UploadedFile::create([
    //         'title' => $request->title,
    //         'file_path' => $path
    //     ]);

    //     return redirect()->route('teacher.files')->with('success', 'Fayl yuklandi!');
    // }

    // public function delete($id)
    // {
    //     $file = UploadedFile::findOrFail($id);
    //     Storage::disk('public')->delete($file->file_path);
    //     $file->delete();
    //     return back()->with('success', 'Fayl o‘chirildi!');
    // }

    // public function edit($id)
    // {
    //     $file = UploadedFile::findOrFail($id);
    //     return view('teacher.edit', compact('file'));
    // }

    // public function update(Request $request, $id)
    // {
    //     $file = UploadedFile::findOrFail($id);
    //     $file->update([
    //         'title' => $request->title,
    //     ]);
    //     return redirect()->route('teacher.files')->with('success', 'Muvaffaqiyatli tahrirlandi!');
    // }
