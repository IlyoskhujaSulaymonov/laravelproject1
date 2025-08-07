@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Yangi foydalanuvchi qo‘shish</h1>

    <form action="{{ route('admin.users.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label>Ism</label>
            <input type="text" name="name" class="form-control" value="{{ old('name') }}" required>
            @error('name') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <div class="mb-3">
            <label>Email</label>
            <input type="email" name="email" class="form-control" value="{{ old('email') }}" required>
            @error('email') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <div class="mb-3">
            <label>Parol</label>
            <input type="password" name="password" class="form-control" required>
            @error('password') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <div class="mb-3">
            <label>Parolni tasdiqlash</label>
            <input type="password" name="password_confirmation" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Roli (ID)</label>
            <input type="number" name="role_id" class="form-control" value="{{ old('role_id') }}" required>
            @error('role_id') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <button type="submit" class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Ortga</a>
    </form>
</div>
@endsection
