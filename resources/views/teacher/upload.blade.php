@extends('layouts.app')

@section('content')
    <div class="card shadow">
        <div class="card-header bg-success text-white">
            <h4>⬆️ Yangi fayl yuklash</h4>
        </div>
        <div class="card-body">
            <form action="{{ route('teacher.upload.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="mb-3">
                    <label class="form-label">Mavzu nomi</label>
                    <input type="text" name="title" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Faylni tanlang</label>
                    <input type="file" name="file" class="form-control" required>
                </div>

                <button type="submit" class="btn btn-success">Yuklash</button>
            </form>
        </div>
    </div>
@endsection
