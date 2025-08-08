@extends('layouts.admin') {{-- Agar sizda admin layout bo‘lsa --}}
@section('content')
<div class="container mt-4">
    <h2>Foydalanuvchi qo‘shish</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <strong>Xatolik!</strong> Ma’lumotlarni to‘g‘ri kiriting.<br><br>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.users.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label for="name" class="form-label">Ism</label>
            <input type="text" name="name" class="form-control" placeholder="Ism" value="{{ old('name') }}" required>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email manzil</label>
            <input type="email" name="email" class="form-control" placeholder="Email" value="{{ old('email') }}" required>
        </div>

        <div class="mb-3">
            <label for="phone" class="form-label">Telefon nomer</label>
            <input type="text" name="phone" class="form-control" placeholder="+998 XX XXX XX XX" value="{{ old('phone') }}">
        </div>

        <div class="mb-3">
            <label for="role" class="form-label">Rol</label>
            <select name="role" id="role" class="form-select" required>
                <option value="">-- Rolni tanlang --</option>
                <option value="admin" {{ old('role') == 'admin' ? 'selected' : '' }}>Admin</option>
                <option value="teacher" {{ old('role') == 'teacher' ? 'selected' : '' }}>Teacher</option>
                <option value="student" {{ old('role') == 'student' ? 'selected' : '' }}>Student</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Parol</label>
            <input type="password" name="password" class="form-control" placeholder="Parol" required>
        </div>

        <div class="mb-3">
            <label for="password_confirmation" class="form-label">Parolni tasdiqlang</label>
            <input type="password" name="password_confirmation" class="form-control" placeholder="Parolni qayta kiriting" required>
        </div>

        <button type="submit" class="btn btn-primary">Saqlash</button>
        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>
@endsection
