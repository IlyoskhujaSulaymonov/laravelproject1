@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Savolni tahrirlash</h1>

    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.questions.update', $question) }}" method="POST">
        @csrf
        @method('PUT')

        {{-- Topic Selection --}}
        <div class="mb-3">
            <label for="topic_id" class="form-label">Mavzu</label>
            <select name="topic_id" id="topic_id" class="form-select" required>
                @foreach($topics as $topic)
                    <option value="{{ $topic->id }}" {{ $question->topic_id == $topic->id ? 'selected' : '' }}>
                        {{ $topic->title }}
                    </option>
                @endforeach
            </select>
        </div>

        {{-- Question Content --}}
        <div class="mb-3">
            <label for="content" class="form-label">Savol matni (LaTeX qo‘llab-quvvatlanadi)</label>
            <textarea name="content" id="content" class="form-control" rows="4" required>{{ old('content', $question->content) }}</textarea>
        </div>

        {{-- Variants with Radio Buttons --}}
        <h5>Variantlar</h5>
        @foreach($question->variants as $i => $variant)
            <div class="mb-2 d-flex align-items-center">
                <input type="text" name="variants[{{ $i }}][text]" class="form-control me-2"
                       value="{{ old("variants.$i.text", $variant->text) }}" required>

                <input type="radio" name="correct_variant" value="{{ $i }}" id="correct_{{ $i }}"
                       {{ old('correct_variant', $question->variants->search(fn($v) => $v->is_correct)) == $i ? 'checked' : '' }}
                       class="form-check-input me-1">
                <label for="correct_{{ $i }}" class="form-check-label">To‘g‘ri</label>
            </div>
        @endforeach

        {{-- Submit Buttons --}}
        <button type="submit" class="btn btn-primary">Yangilash</button>
        <a href="{{ route('admin.questions.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>

{{-- MathJax --}}
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
@endsection
