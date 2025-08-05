@extends('layouts.admin')
@section('title', 'Sinfni tahrirlash')

@section('content')
<div class="container py-4">
    <h2>Sinfni tahrirlash</h2>

    <form action="{{ route('admin.classes.update', $class) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="name">Sinf nomi</label>
            <input type="text" name="name" class="form-control" required value="{{ old('name', $class->name) }}">
        </div>
        <button class="btn btn-success">Yangilash</button>
        <a href="{{ route('admin.classes.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
