@extends('layouts.admin')

@section('content')
<div class="container">
    <h1 class="mb-4">Savollar ro‘yxati</h1>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <a href="{{ route('admin.questions.create') }}" class="btn btn-primary mb-3">Yangi savol qo‘shish</a>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Mavzu</th>
                <th>Savol</th>
                <th>Variantlar</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($questions as $question)
                <tr>
                    <td>{{ $question->id }}</td>
                    <td>{{ $question->topic->title ?? 'Noma’lum' }}</td>
                    <td>{!! $question->content !!}</td>
                    <td>
                        <ul class="mb-0">
                            @foreach($question->variants as $variant)
                                <li>
                                    {{ $variant->text }}
                                    @if($variant->is_correct)
                                        <strong>(To‘g‘ri)</strong>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </td>
                    <td>
                        <a href="{{ route('admin.questions.edit', $question) }}" class="btn btn-sm btn-warning">Tahrirlash</a>
                        <form action="{{ route('admin.questions.destroy', $question) }}" method="POST" style="display:inline-block;">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-danger" onclick="return confirm('O‘chirishni istaysizmi?')">O‘chirish</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">Savollar topilmadi.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="mt-3">
        {{ $questions->links() }}
    </div>
</div>

{{-- MathJax --}}
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
@endsection
