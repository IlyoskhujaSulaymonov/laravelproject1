@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>O‘qituvchini Tahrirlash</h1>

    <form action="{{ route('admin.teachers.update', $teacher) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label>Ism:</label>
            <input type="text" name="name" class="form-control" required value="{{ old('name', $teacher->name) }}">
        </div>

        <div class="mb-3">
            <label>Email:</label>
            <input type="email" name="email" class="form-control" required value="{{ old('email', $teacher->email) }}">
        </div>

        <div class="mb-3">
            <label>Fan:</label>
            <input type="text" name="subject" class="form-control" value="{{ old('subject', $teacher->subject) }}">
        </div>

        <button class="btn btn-success">Yangilash</button>
        <a href="{{ route('admin.teachers.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
