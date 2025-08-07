@extends('layouts.admin')

@section('title', 'Talabani Tahrirlash')

@section('content')
<div class="container py-4">
    <h2 class="mb-4">Talabani Tahrirlash</h2>

    <form action="{{ route('admin.students.update', $student) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="name" class="form-label">Ismi</label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $student->name) }}" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email manzili</label>
            <input type="email" name="email" class="form-control" value="{{ old('email', $student->email) }}" required>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Telefon nomer</label>
            <input type="text" name="phone" class="form-control" value="{{ old('phone', $student->phone) }}">
        </div>

        <button type="submit" class="btn btn-success">Yangilash</button>
        <a href="{{ route('admin.students.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
