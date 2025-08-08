@extends('layouts.admin')

@section('content')
    <div class="container">
        <h1 class="mb-4">O‘qituvchini tahrirlash</h1>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('admin.teachers.update', $teacher) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label for="name" class="form-label">Ism</label>
                <input type="text" name="name" id="name" class="form-control"
                    value="{{ old('name', $teacher->name) }}" required>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email manzil</label>
                <input type="email" name="email" id="email" class="form-control"
                    value="{{ old('email', $teacher->email) }}" required>
            </div>

            <div class="mb-3">
                <label for="phone" class="form-label">Telefon nomer</label>
                <input type="text" name="phone" id="phone" class="form-control"
                    value="{{ old('phone', $teacher->phone) }}">
            </div>

            <button type="submit" class="btn btn-primary">Yangilash</button>
            <a href="{{ route('admin.teachers.index') }}" class="btn btn-secondary">Bekor qilish</a>
        </form>
    </div>
@endsection
