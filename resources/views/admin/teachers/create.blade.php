@extends('layouts.admin')

@section('content')
    <div class="container">
        <h1 class="mb-4">Yangi o‘qituvchi qo‘shish</h1>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('admin.teachers.store') }}" method="POST">
            @csrf

            <div class="mb-3">
                <label for="first_name" class="form-label">Ism</label>
                <input type="text" name="name" id="name" class="form-control" value="{{ old('name') }}"
                    required>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email manzil</label>
                <input type="email" name="email" id="email" class="form-control" value="{{ old('email') }}"
                    required>
            </div>

            <div class="mb-3">
                <label for="phone" class="form-label">Telefon nomer</label>
                <input type="text" name="phone" id="phone" class="form-control" value="{{ old('phone') }}">
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Parol</label>
                <input type="password" name="password" class="form-control" placeholder="Parol" required>
            </div>

            <div class="mb-3">
                <label for="password_confirmation" class="form-label">Parolni tasdiqlang</label>
                <input type="password" name="password_confirmation" class="form-control"
                    placeholder="Parolni qayta kiriting" required>
            </div>

            <button type="submit" class="btn btn-success">Saqlash</button>
            <a href="{{ route('admin.teachers.index') }}" class="btn btn-secondary">Bekor qilish</a>
        </form>
    </div>
@endsection
