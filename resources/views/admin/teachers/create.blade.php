@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Yangi O‘qituvchi</h1>

    <form action="{{ route('admin.teachers.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label>Ism:</label>
            <input type="text" name="name" class="form-control" required value="{{ old('name') }}">
        </div>

        <div class="mb-3">
            <label>Email:</label>
            <input type="email" name="email" class="form-control" required value="{{ old('email') }}">
        </div>

        <div class="mb-3">
            <label>Fan:</label>
            <input type="text" name="subject" class="form-control" value="{{ old('subject') }}">
        </div>

        <button class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.teachers.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>
@endsection
