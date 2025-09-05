@extends('layouts.admin')

@section('page-title', $subject->name . ' - na\'munaviy savolni ko\'rish')

@section('content')
<a href="{{ route('admin.sample-questions.index', $subject) }}" class="btn btn-secondary mb-3 ms-2">
    <i class="fa fa-arrow-left"></i> Ortga
</a>
<a href="{{ route('admin.sample-questions.edit', [$subject, $question]) }}" class="btn btn-warning mb-3">
    <i class="fa fa-edit"></i> Tahrirlash
</a>
<a href="{{ route('admin.sample-questions.create', $subject) }}" class="btn btn-warning mb-3">
    Yangi na'munaviy savol qo'shish
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
    // Use subject as topic for compatibility with existing question component
    // The React component expects window.topic.id for building URLs
    window.topic = @json($subject);
    window.subject = @json($subject);
    window.question = @json($question);
    window.isSampleQuestion = true;
    window.sampleQuestionMode = true;
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
@endsection