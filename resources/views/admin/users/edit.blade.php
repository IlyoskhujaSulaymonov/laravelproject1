@extends('layouts.admin')

@section('content')
    <div class="container">
        <h1>Foydalanuvchini tahrirlash</h1>

        <form action="{{ route('admin.users.update', $user) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label>Ism</label>
                <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
                @error('name')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            <div class="mb-3">
                <label>Email</label>
                <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" required>
                @error('email')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            <div class="mb-3">
                <label>Yangi parol (ixtiyoriy)</label>
                <div class="input-group">
                    <input type="password" name="password" id="password" class="form-control" required>
                    <span class="input-group-text" onclick="togglePassword('password', 'eyeIcon')" style="cursor: pointer;">
                        <i class="fas fa-eye" id="eyeIcon"></i>
                    </span>
                </div>
                @error('password')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            <div class="mb-3">
                <label>Parolni tasdiqlash</label>
                <div class="input-group">
                    <input type="password" name="password_confirmation" id="passwordConfirm" class="form-control" required>
                    <span class="input-group-text" onclick="togglePassword('passwordConfirm', 'eyeIconConfirm')"
                        style="cursor: pointer;">
                        <i class="fas fa-eye" id="eyeIconConfirm"></i>
                    </span>
                </div>
            </div>

            <div class="mb-3">
                <label>Roli</label>
                <select name="role_id" class="form-control" required>
                    <option value="">-- Tanlang --</option>
                    @foreach ($roles as $role)
                        <option value="{{ $role->id }}"
                            {{ old('role_id', $user->role_id) == $role->id ? 'selected' : '' }}>
                            {{ $role->name }}
                        </option>
                    @endforeach
                </select>
                @error('role_id')
                    <small class="text-danger">{{ $message }}</small>
                @enderror
            </div>

            <button type="submit" class="btn btn-primary">Yangilash</button>
            <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Ortga</a>
        </form>
    </div>
@endsection
