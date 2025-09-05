@extends('layouts.admin')

@section('page-title','Yangi mavzu qo\'shish')

@section('content')
<div class="container">

    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.topics.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label for="subject_id" class="form-label">Fanlar</label>
            <select name="subject_id" id="subject_id" class="form-select" required>
                <option value="">Fanni tanglang</option>
                @foreach($subjects as $subject)
                    <option value="{{ $subject->id }}" {{ old('subject_id') == $subject->id ? 'selected' : '' }}>
                        {{ $subject->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="title" class="form-label">Mavzu nomi</label>
            <input type="text" name="title" id="title" class="form-control" value="{{ old('title') }}" required>
        </div>

        <div class="mb-3">
            <label for="order" class="form-label">Tartib raqami</label>
            <input type="number" name="order" id="order" class="form-control" value="{{ old('order', 1) }}" required>
        </div>

        <button type="submit" class="btn btn-success">Yaratish</button>
        <a href="{{ route('admin.topics.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>
@endsection
