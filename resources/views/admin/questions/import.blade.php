@extends('layouts.admin')

    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
    
@section('content')
<div class="container">
    <h1 class="mb-4">Savollarni kiritish</h1>

   <form action="{{ route('admin.questions.import.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
     {{-- Topic Selection --}}
        <div class="mb-3">
            <label for="topic_id" class="form-label fw-bold">Mavzu</label>
            <select name="topic_id" id="topic_id" class="form-select" required>
                @foreach($topics as $topic)
                    <option value="{{ $topic->id }}" {{ old('topic_id') == $topic->id ? 'selected' : '' }}>
                        {{ $topic->title }}
                    </option>
                @endforeach
            </select>
        </div>
         <div class="mb-3">
            <label for="topic_id" class="form-label fw-bold">Fayl yuklang...</label>
            <input type="file" name="pdf" accept="application/pdf" required>
        </div>
 
   
      <div class="mt-4">
            <button type="submit" class="btn btn-success">Saqlash</button>
            <a href="{{ route('admin.questions.index') }}" class="btn btn-secondary">Bekor qilish</a>
        </div>
</form>

</div>
@endsection
