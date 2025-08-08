@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Yangi savol qo‘shish</h1>

    <form action="{{ route('admin.questions.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        {{-- Format Selection --}}
        <div class="mb-3">
            <label class="form-label">Savol formati</label>
            <div id="formatRadios">
                @foreach(['text' => 'Oddiy matn', 'latex' => 'LaTeX', 'image' => 'Rasm', 'richtext' => 'Rich Text'] as $value => $label)
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="format" id="format_{{ $value }}" value="{{ $value }}"
                               {{ old('format', 'text') === $value ? 'checked' : '' }} onclick="toggleFormatFields('{{ $value }}')">
                        <label class="form-check-label" for="format_{{ $value }}">{{ $label }}</label>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- Text / LaTeX / Rich Text --}}
        <div id="textField" class="mb-3">
            <label for="content" class="form-label">Savol matni</label>
            <textarea name="content" id="content" class="form-control" rows="4">{{ old('content') }}</textarea>
            <small class="text-muted">LaTeX uchun: \( x^2 + y^2 = z^2 \) yoki \( \frac{n! \cdot (n+4)!}{(n+3)! \cdot (n-1)!} = 45 \)</small>
            {{-- Added LaTeX Preview Area --}}
            <div id="latexPreview" class="mt-2" style="display: none; border: 1px solid #ddd; padding: 10px; min-height: 50px;"></div>
        </div>

        {{-- Image Upload --}}
        <div id="imageField" class="mb-3" style="display:none;">
            <label for="image" class="form-label">Rasm yuklash</label>
            <input type="file" name="image" id="image" class="form-control">
        </div>

        {{-- Topic Selection --}}
        <div class="mb-3">
            <label for="topic_id" class="form-label">Mavzu</label>
            <select name="topic_id" id="topic_id" class="form-select" required>
                @foreach($topics as $topic)
                    <option value="{{ $topic->id }}" {{ old('topic_id') == $topic->id ? 'selected' : '' }}>
                        {{ $topic->title }}
                    </option>
                @endforeach
            </select>
        </div>

        <h5>Variantlar</h5>
        @for($i = 0; $i < 4; $i++)
            <div class="mb-2 d-flex align-items-center">
                <input type="text" name="variants[{{ $i }}][text]" class="form-control me-2"
                    placeholder="Variant matni" value="{{ old("variants.$i.text") }}" required>
                <input type="radio" name="correct_variant" value="{{ $i }}" id="correct_{{ $i }}"
                    {{ old('correct_variant') == $i ? 'checked' : '' }} class="form-check-input me-1">
                <label for="correct_{{ $i }}" class="form-check-label">To‘g‘ri</label>
            </div>
        @endfor

        <button type="submit" class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.questions.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>

{{-- MathJax --}}
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>

<script>
    function toggleFormatFields(format) {
        const showText = ['text', 'latex', 'richtext'].includes(format);
        document.getElementById('textField').style.display = showText ? 'block' : 'none';
        document.getElementById('imageField').style.display = (format === 'image') ? 'block' : 'none';
        // Show/hide LaTeX preview based on format
        document.getElementById('latexPreview').style.display = (format === 'latex') ? 'block' : 'none';
    }

    document.addEventListener('DOMContentLoaded', function () {
        const selectedFormat = document.querySelector('input[name="format"]:checked').value;
        toggleFormatFields(selectedFormat);

        // Live LaTeX Preview
        const textarea = document.getElementById('content');
        const preview = document.getElementById('latexPreview');
        textarea.addEventListener('input', function () {
            if (document.querySelector('input[name="format"]:checked').value === 'latex') {
                try {
                    // Wrap input in \( \) for inline LaTeX rendering
                    preview.innerHTML = `\\(${textarea.value}\\>`;
                    // Trigger MathJax to re-render the preview
                    MathJax.typesetPromise([preview]).catch(function (err) {
                        preview.innerHTML = '<span style="color: red;">Invalid LaTeX syntax</span>';
                    });
                } catch (e) {
                    preview.innerHTML = '<span style="color: red;">Invalid LaTeX syntax</span>';
                }
            }
        });
    });

    // Optional: Form submission validation for LaTeX
    document.querySelector('form').addEventListener('submit', function (event) {
        const format = document.querySelector('input[name="format"]:checked').value;
        if (format === 'latex') {
            const content = document.getElementById('content').value;
            if (!content.trim()) {
                alert('LaTeX formatda savol matni kiritilishi shart!');
                event.preventDefault();
            }
            // Optional: Add server-side or client-side LaTeX validation
        }
    });
</script>
@endsection