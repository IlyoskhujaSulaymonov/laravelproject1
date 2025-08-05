@extends('layouts.admin')
@section('title', 'Yangi vazifa')

@section('content')
<div class="container py-4">
    <h2>Yangi vazifa</h2>

    <form action="{{ route('admin.tasks.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="title">Sarlavha</label>
            <input type="text" name="title" class="form-control" required value="{{ old('title') }}">
        </div>
        <div class="mb-3">
            <label for="description">Tavsif</label>
            <textarea name="description" class="form-control">{{ old('description') }}</textarea>
        </div>
        <div class="mb-3">
            <label for="due_date">Muddati</label>
            <input type="date" name="due_date" class="form-control" value="{{ old('due_date') }}">
        </div>
        <button class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.tasks.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
