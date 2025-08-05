@extends('layouts.admin')
@section('title', 'Vazifani tahrirlash')

@section('content')
<div class="container py-4">
    <h2>Vazifani tahrirlash</h2>

    <form action="{{ route('admin.tasks.update', $task) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="title">Sarlavha</label>
            <input type="text" name="title" class="form-control" required value="{{ old('title', $task->title) }}">
        </div>
        <div class="mb-3">
            <label for="description">Tavsif</label>
            <textarea name="description" class="form-control">{{ old('description', $task->description) }}</textarea>
        </div>
        <div class="mb-3">
            <label for="due_date">Muddati</label>
            <input type="date" name="due_date" class="form-control" value="{{ old('due_date', $task->due_date) }}">
        </div>
        <button class="btn btn-success">Yangilash</button>
        <a href="{{ route('admin.tasks.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
