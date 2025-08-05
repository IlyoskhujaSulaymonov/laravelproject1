@extends('layouts.admin')
@section('title', 'Yangi sinf')

@section('content')
<div class="container py-4">
    <h2>Yangi sinf qo‘shish</h2>

    <form action="{{ route('admin.classes.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name">Sinf nomi (masalan: 6, 7, 9)</label>
            <input type="text" name="name" class="form-control" required value="{{ old('name') }}">
        </div>
        <button class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.classes.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
