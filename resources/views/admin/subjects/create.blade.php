@extends('layouts.admin')

@section('title', 'Yangi Fan Qo‘shish')

@section('content')
<div class="container py-4">
    <h2 class="mb-4">Yangi Fan Qo‘shish</h2>

    <form action="{{ route('admin.subjects.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label for="name" class="form-label">Fan nomi</label>
            <input type="text" name="name" class="form-control" required value="{{ old('name') }}">
        </div>

        <div class="mb-3">
            <label for="code" class="form-label">Fan kodi</label>
            <input type="text" name="code" class="form-control" required value="{{ old('code') }}">
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Izoh</label>
            <textarea name="description" class="form-control">{{ old('description') }}</textarea>
        </div>

        <button type="submit" class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.subjects.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
