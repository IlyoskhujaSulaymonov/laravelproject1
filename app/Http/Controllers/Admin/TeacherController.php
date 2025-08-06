<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Models\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    public function dashboard()
    {
        return view('teacher.dashboard');
    }

    public function list()
    {
        $files = UploadedFile::latest()->get();
        return view('teacher.files', compact('files'));
    }

    public function uploadForm()
    {
        return view('teacher.upload');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'file' => 'required|file'
        ]);

        $path = $request->file('file')->store('uploads', 'public');

        UploadedFile::create([
            'title' => $request->title,
            'file_path' => $path
        ]);

        return redirect()->route('teacher.files')->with('success', 'Fayl yuklandi!');
    }

    public function delete($id)
    {
        $file = UploadedFile::findOrFail($id);
        Storage::disk('public')->delete($file->file_path);
        $file->delete();
        return back()->with('success', 'Fayl o‘chirildi!');
    }

    public function edit($id)
    {
        $file = UploadedFile::findOrFail($id);
        return view('teacher.edit', compact('file'));
    }

    public function update(Request $request, $id)
    {
        $file = UploadedFile::findOrFail($id);
        $file->update([
            'title' => $request->title,
        ]);
        return redirect()->route('teacher.files')->with('success', 'Muvaffaqiyatli tahrirlandi!');
    }
}
