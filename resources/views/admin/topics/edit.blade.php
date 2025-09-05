@extends('layouts.admin')

@section('page-title','Mavzuni tahrirlash')

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

    <form action="{{ route('admin.topics.update', $topic) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="subject_id" class="form-label">Fanlar</label>
            <select name="subject_id" id="subject_id" class="form-select" required>
                <option value="">Fanni tanlang</option>
                @foreach($subjects as $subject)
                    <option value="{{ $subject->id }}" {{ $topic->subject_id == $subject->id ? 'selected' : '' }}>
                        {{ $subject->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="title" class="form-label">Mavzu nomi</label>
            <input type="text" name="title" id="title" class="form-control" value="{{ old('title', $topic->title) }}" required>
        </div>

        <div class="mb-3">
            <label for="order" class="form-label">Tartib raqam</label>
            <input type="number" name="order" id="order" class="form-control" value="{{ old('order', $topic->order) }}" required>
        </div>

        <button type="submit" class="btn btn-primary">tahrirlash</button>
        <a href="{{ route('admin.topics.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>
@endsection
