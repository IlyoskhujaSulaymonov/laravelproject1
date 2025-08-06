@extends('layouts.app')

@section('content')
    <h3 class="mb-4">📂 Yuklangan fayllar ro'yxati</h3>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @foreach($files as $file)
        <div class="card mb-3 shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">{{ $file->title }}</h5>
                    <a href="{{ asset('storage/'.$file->file_path) }}" target="_blank" class="btn btn-sm btn-outline-secondary">
                        📄 Ko‘rish
                    </a>
                </div>
                <div>
                    <a href="{{ route('teacher.file.edit', $file->id) }}" class="btn btn-warning btn-sm">✏️ Tahrirlash</a>
                    <form action="{{ route('teacher.file.delete', $file->id) }}" method="POST" class="d-inline">
                        @csrf @method('DELETE')
                        <button class="btn btn-danger btn-sm" onclick="return confirm('Faylni o‘chirmoqchimisiz?')">
                            🗑️ O‘chirish
                        </button>
                    </form>
                </div>
            </div>
        </div>
    @endforeach
@endsection
