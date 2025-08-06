@extends('layouts.app')

@section('content')
    <div class="card shadow">
        <div class="card-header bg-warning">
            <h4>✏️ Fayl nomini tahrirlash</h4>
        </div>
        <div class="card-body">
            <form action="{{ route('teacher.file.update', $file->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label class="form-label">Mavzu</label>
                    <input type="text" name="title" class="form-control" value="{{ $file->title }}" required>
                </div>

                <button class="btn btn-primary">Saqlash</button>
            </form>
        </div>
    </div>
@endsection
