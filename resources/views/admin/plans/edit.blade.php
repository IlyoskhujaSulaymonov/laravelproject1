@extends('layouts.admin')
@section('page-title', 'Tarifni tahrirlash')

@section('content')
<div class="container py-4">

    <form action="{{ route('admin.plans.update', $plan->id) }}" method="POST">
        @csrf
        @method('PUT')

       <div class="mb-3">
            <label>Nomi</label>
            <input type="text" name="name" class="form-control" value="{{ $plan->name }}" required>
        </div>
        <div class="mb-3">
            <label>Narxi (so'm)</label>
            <input type="number" step="0.01" name="price" class="form-control" value="{{ $plan->price }}" required>
        </div>
        <div class="mb-3">
            <label>Davomiyligi (kunlarda)</label>
            <input type="number" name="duration" class="form-control" value="{{ $plan->duration }}" required>
        </div>
        <div class="mb-3">
            <label>Tasnifi</label>
            <textarea name="description" class="form-control">{{ $plan->description }}</textarea>
        </div>
        <div class="mb-3">
            <label>Imkoniyatlari</label>
            <div id="features-wrapper">
                @foreach($plan->features ?? [] as $feature)
                    <div class="d-flex mb-2 feature-item">
                        <input type="text" name="features[]" class="form-control" value="{{ $feature }}">
                        <button type="button" class="btn btn-danger ms-2 remove-feature">❌</button>
                    </div>
                @endforeach
            </div>
            <button type="button" id="add-feature" class="btn btn-sm btn-primary mt-2">➕ Qo‘shish</button>
        </div>
        
        <button class="btn btn-success">Yangilash</button>
        <a href="{{ route('admin.plans.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>

<script>
    document.getElementById('add-feature').addEventListener('click', function() {
        let wrapper = document.getElementById('features-wrapper');
        let div = document.createElement('div');
        div.classList.add('d-flex', 'mb-2', 'feature-item');
        div.innerHTML = `
            <input type="text" name="features[]" class="form-control" placeholder="Yangi imkoniyat">
            <button type="button" class="btn btn-danger ms-2 remove-feature">❌</button>
        `;
        wrapper.appendChild(div);
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-feature')) {
            e.target.parentElement.remove();
        }
    });
</script>
@endsection
