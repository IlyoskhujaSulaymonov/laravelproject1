<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Variant;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SampleQuestionController extends Controller
{
    public function subjectList(Request $request)
    {
        $query = Subject::orderBy('name');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $subjects = $query->paginate(20);

        return view('admin.sample-questions.subject', compact('subjects'));
    }
    
    public function index(Subject $subject)
    {
        $questions = Question::sample()
            ->with('subject')
            ->where('subject_id', $subject->id)
            ->paginate(10);
            
        return view('admin.sample-questions.index', compact('questions', 'subject'));
    }

    public function create(Subject $subject)
    {
        return view('admin.sample-questions.create', compact('subject'));
    }

    public function store(Subject $subject, Request $request)
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
                    $path = $image->storeAs('sample-questions/images', $filename, 'public');
                    $uploadedImages[] = [
                        'filename' => $filename,
                        'path' => $path,
                        'url' => Storage::url($path)
                    ];
                }
            }

            DB::beginTransaction();

            $question = Question::create([
                'subject_id' => $subject->id,
                'topic_id' => null, // Explicitly set to null for sample questions
                'type' => 'sample',
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

            // Check if this is a request from the React component (AJAX request)
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Na\'munaviy savol muvaffaqiyatli saqlandi!',
                    'redirect' => route('admin.sample-questions.index', $subject)
                ]);
            }

            return redirect()->route('admin.sample-questions.index', $subject)->with('success', 'Na\'munaviy savol muvaffaqiyatli saqlandi!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Xatolik yuz berdi: ' . $e->getMessage()
                ], 500);
            }
            
            return redirect()->back()->with('error', 'Xatolik yuz berdi: ' . $e->getMessage());
        }
    }

    public function edit(Subject $subject, Question $question)
    {
        // Ensure this is a sample question for this subject
        if (!$question->isSample() || $question->subject_id !== $subject->id) {
            abort(404);
        }

        $question->load('variants');
        
        // Force refresh from database to ensure we get raw data
        $question = $question->fresh(['variants']);
        
        // Safely convert JSON strings to arrays
        try {
            $question->formulas = is_string($question->formulas) ? 
                json_decode($question->formulas, true) : 
                (is_array($question->formulas) ? $question->formulas : []);
        } catch (Exception $e) {
            $question->formulas = [];
        }
        
        try {
            $question->images = is_string($question->images) ? 
                json_decode($question->images, true) : 
                (is_array($question->images) ? $question->images : []);
        } catch (Exception $e) {
            $question->images = [];
        }
        
        // Handle variants safely
        if ($question->variants && is_countable($question->variants)) {
            foreach ($question->variants as $variant) {
                try {
                    $variant->formulas = is_string($variant->formulas) ? 
                        json_decode($variant->formulas, true) : 
                        (is_array($variant->formulas) ? $variant->formulas : []);
                } catch (Exception $e) {
                    $variant->formulas = [];
                }
            }
        }
        
        return view('admin.sample-questions.edit', compact('question', 'subject'));
    }

    public function update(Subject $subject, Question $question, Request $request)
    {
        try {
            // Ensure this is a sample question for this subject
            if (!$question->isSample() || $question->subject_id !== $subject->id) {
                abort(404);
            }

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

            $currentImages = $question->images ?? [];
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
                    $path = $image->storeAs('sample-questions/images', $filename, 'public');
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
                // Ensure sample question properties are maintained
                'subject_id' => $subject->id,
                'topic_id' => null,
                'type' => 'sample',
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

            // Check if this is a request from the React component (AJAX request)
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Na\'munaviy savol muvaffaqiyatli yangilandi!',
                    'redirect' => route('admin.sample-questions.index', $subject)
                ]);
            }

            return redirect()->route('admin.sample-questions.index', $subject)->with('success', 'Na\'munaviy savol muvaffaqiyatli yangilandi!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Xatolik yuz berdi: ' . $e->getMessage()
                ], 500);
            }
            
            return redirect()->back()->with('error', 'Xatolik yuz berdi: ' . $e->getMessage());
        }
    }

    public function show(Subject $subject, Question $question)
    {
        // Ensure this is a sample question for this subject
        if (!$question->isSample() || $question->subject_id !== $subject->id) {
            abort(404);
        }

        $question->load('variants');
        
        // Force refresh from database to ensure we get raw data
        $question = $question->fresh(['variants']);
        
        // Safely convert JSON strings to arrays
        try {
            $question->formulas = is_string($question->formulas) ? 
                json_decode($question->formulas, true) : 
                (is_array($question->formulas) ? $question->formulas : []);
        } catch (Exception $e) {
            $question->formulas = [];
        }
        
        try {
            $question->images = is_string($question->images) ? 
                json_decode($question->images, true) : 
                (is_array($question->images) ? $question->images : []);
        } catch (Exception $e) {
            $question->images = [];
        }
        
        // Handle variants safely
        if ($question->variants && is_countable($question->variants)) {
            foreach ($question->variants as $variant) {
                try {
                    $variant->formulas = is_string($variant->formulas) ? 
                        json_decode($variant->formulas, true) : 
                        (is_array($variant->formulas) ? $variant->formulas : []);
                } catch (Exception $e) {
                    $variant->formulas = [];
                }
            }
        }
        
        return view('admin.sample-questions.show', compact('subject', 'question'));
    }   

    public function destroy(Subject $subject, Question $question)
    {
        // Ensure this is a sample question for this subject
        if (!$question->isSample() || $question->subject_id !== $subject->id) {
            abort(404);
        }

        $question->delete();
        return redirect()->route('admin.sample-questions.index', $subject)->with('success', 'Na\'munaviy savol o\'chirildi!');
    }
}