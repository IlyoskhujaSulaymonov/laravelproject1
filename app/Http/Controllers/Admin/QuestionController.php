<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\Variant;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class QuestionController extends Controller
{
    public function topicList(Request $request)
    {
        $subjects = Subject::all();
        $query = Topic::with('subject')->orderBy('order');

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $topics = $query->paginate(20);

        return view('admin.questions.topic', compact('topics', 'subjects'));
    }
    
     public function index(Topic $topic)
    {
        $questions = Question::with('topic')->where('topic_id',$topic->id)->paginate(10);
        return view('admin.questions.index', compact('questions', 'topic'));
    }

    public function create(Topic $topic)
    {
        return view('admin.questions.create', compact('topic'));
    }

    public function store(Topic $topic, Request $request)
    {
        try {
            $request->validate([
                'question' => 'required|string',
                'formulas' => 'nullable|string',
                'variants' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $formulas = $request->formulas ? json_decode($request->formulas, true) : [];
            $variants = $request->variants ? json_decode($request->variants, true) : [];

            if (!empty($variants)) {
                $hasCorrectAnswer = false;
                foreach ($variants as $variant) {
                    if (isset($variant['isCorrect']) && $variant['isCorrect']) {
                        $hasCorrectAnswer = true;
                        break;
                    }
                }
                
                if (!$hasCorrectAnswer) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Iltimos, kamida bitta to\'g\'ri javobni belgilang!'
                    ], 422);
                }
            }

            // Handle image uploads
            $uploadedImages = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('questions/images', $filename, 'public');
                    $uploadedImages[] = [
                        'filename' => $filename,
                        'path' => $path,
                        'url' => Storage::url($path)
                    ];
                }
            }

            DB::beginTransaction();

            $question = Question::create([
                'topic_id' => $topic->id,
                'question' => $request->question,
                'formulas' => json_encode($formulas),
                'images' => json_encode($uploadedImages),
            ]);

            if (!empty($variants)) {
                $optionLetters = ['A', 'B', 'C', 'D'];
                
                foreach ($variants as $index => $variant) {
                    Variant::create([
                        'question_id' => $question->id,
                        'option_letter' => $optionLetters[$index] ?? chr(65 + $index), // A, B, C, D...
                        'text' => $variant['text'] ?? '',
                        'formulas' => json_encode($variant['formulas'] ?? []),
                        'is_correct' => $variant['isCorrect'] ?? false,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Savol muvaffaqiyatli saqlandi!',
                'redirect' => route('admin.questions.index',$topic)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Xatolik yuz berdi: ' . $e->getMessage()
            ], 500);
        }
    }


    public function edit(Topic $topic, Question $question)
    {
        $question->load('variants');
        return view('admin.questions.edit', compact('question', 'topic'));
    }

    public function update(Topic $topic, Question $question, Request $request)
    {
        try {
            $request->validate([
                'question' => 'required|string',
                'formulas' => 'nullable|string',
                'variants' => 'nullable|string',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'existing_images' => 'nullable|string', // JSON string of existing images to keep
            ]);

            $formulas = $request->formulas ? json_decode($request->formulas, true) : [];
            $variants = $request->variants ? json_decode($request->variants, true) : [];
            $existingImages = $request->existing_images ? json_decode($request->existing_images, true) : [];

            if (!empty($variants)) {
                $hasCorrectAnswer = false;
                foreach ($variants as $variant) {
                    if (isset($variant['isCorrect']) && $variant['isCorrect']) {
                        $hasCorrectAnswer = true;
                        break;
                    }
                }
                
                if (!$hasCorrectAnswer) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Iltimos, kamida bitta to\'g\'ri javobni belgilang!'
                    ], 422);
                }
            }

            $currentImages = json_decode($question->images ?? '[]', true);
            $finalImages = [];
            
            // Keep existing images that are still wanted
            foreach ($currentImages as $currentImage) {
                $shouldKeep = false;
                foreach ($existingImages as $existingImage) {
                    if ($currentImage['filename'] === $existingImage['filename']) {
                        $shouldKeep = true;
                        break;
                    }
                }
                if ($shouldKeep) {
                    $finalImages[] = $currentImage;
                } else {
                    if (Storage::disk('public')->exists($currentImage['path'])) {
                        Storage::disk('public')->delete($currentImage['path']);
                    }
                }
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('questions/images', $filename, 'public');
                    $finalImages[] = [
                        'filename' => $filename,
                        'path' => $path,
                        'url' => Storage::url($path)
                    ];
                }
            }

            DB::beginTransaction();

            $question->update([
                'question' => $request->question,
                'formulas' => json_encode($formulas),
                'images' => json_encode($finalImages),
            ]);

            $question->variants()->delete();

            if (!empty($variants)) {
                $optionLetters = ['A', 'B', 'C', 'D'];
                
                foreach ($variants as $index => $variant) {
                    Variant::create([
                        'question_id' => $question->id,
                        'option_letter' => $optionLetters[$index] ?? chr(65 + $index),
                        'text' => $variant['text'] ?? '',
                        'formulas' => json_encode($variant['formulas'] ?? []),
                        'is_correct' => $variant['isCorrect'] ?? false,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Savol muvaffaqiyatli yangilandi!',
                'redirect' => route('admin.questions.index', $topic)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Xatolik yuz berdi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Topic $topic, Question $question)
    {
        $question->load('variants');
        return view('admin.questions.show', compact('topic','question'));
    }   

    public function destroy(Topic $topic, Question $question)
    {
        $question->delete();
        return redirect()->route('admin.questions.index',$topic)->with('success', 'Savol o‘chirildi!');
    }
    
}
