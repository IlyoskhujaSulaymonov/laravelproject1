@extends('layouts.admin')

@section('page-title', $topic->title . ' - savolni ko\'rish')

@section('content')
<a href="{{ route('admin.questions.index', $topic) }}" class="btn btn-secondary mb-3 ms-2">
    <i class="fa fa-arrow-left"></i> Ortga
</a>
<a href="{{ route('admin.questions.edit', [$topic, $question]) }}" class="btn btn-warning mb-3">
    <i class="fa fa-edit"></i> Tahrirlash
</a>
<a href="{{ route('admin.questions.create', $topic) }}" class="btn btn-primary mb-3">
    Yangi savol qo'shish
</a>

<div class="container mx-auto py-12">
    <div id="app" data-page="question-view"></div>
</div>

<!-- Added MathJax configuration and script -->
<script>
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\$$', '\$$']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        }
    };
</script>

<script>
    window.topic = @json($topic);
    window.question = @json($question);
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
@endsection
