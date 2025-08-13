@extends('layouts.admin')

@section('page-title', $topic->title . ' - savolni tahrirlash')

@section('content')
<a href="{{ route('admin.questions.index', $topic) }}" class="btn btn-secondary mb-3 ms-2">
    <i class="fa fa-arrow-left"></i> Ortga
</a>
<a href="{{ route('admin.questions.create', $topic) }}" class="btn btn-primary mb-3">
    Yangi savol qo'shish
</a>

<div class="container mx-auto py-12">
    <div id="app" data-page="question-edit"></div>
</div>

<script>
    window.topic = @json($topic);
    window.question = @json($question);
    window.questionId = {{ $question->id }};
</script>
@endsection
