@extends('layouts.app')

@section('content')
    <div class="text-center">
        <h1 class="mb-4">O'qituvchi oynasi</h1>
        <div class="d-grid gap-3 col-6 mx-auto">
            <a href="{{ route('teacher.files') }}" class="btn btn-outline-primary btn-lg">
                📂 Yuklangan Fayllar
            </a>
            <a href="{{ route('teacher.upload') }}" class="btn btn-outline-success btn-lg">
                ⬆️ Fayl Yuklash
            </a>
        </div>
    </div>
@endsection
