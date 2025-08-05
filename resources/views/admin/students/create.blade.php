@extends('layouts.admin')

@section('title', 'Yangi Talaba Qo‘shish')

@section('content')
<div class="container py-4">
    <h2 class="mb-4">Yangi Talaba Qo‘shish</h2>

    <form action="{{ route('admin.students.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Ismi</label>
            <input type="text" name="name" class="form-control" value="{{ old('name') }}" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email manzili</label>
            <input type="email" name="email" class="form-control" value="{{ old('email') }}" required>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Telefon</label>
            <input type="text" name="phone" class="form-control" value="{{ old('phone') }}">
        </div>

        <button type="submit" class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.students.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
