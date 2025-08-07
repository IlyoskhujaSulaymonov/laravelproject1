@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Rolni tahrirlash</h1>

    <form action="{{ route('admin.roles.update', $role) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="name">Rol nomi</label>
            <input type="text" name="name" id="name" class="form-control" value="{{ old('name', $role->name) }}" required>
            @error('name') <small class="text-danger">{{ $message }}</small> @enderror
        </div>

        <button type="submit" class="btn btn-primary">Yangilash</button>
        <a href="{{ route('admin.roles.index') }}" class="btn btn-secondary">Ortga</a>
    </form>
</div>
@endsection
