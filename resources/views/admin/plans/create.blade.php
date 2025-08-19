@extends('layouts.admin')
@section('page-title', 'Yangi tarif qo\'shish')

@section('content')
<div class="container py-4">
    <form action="{{ route('admin.plans.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label>Nomi</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label>Narxi (so'm)</label>
            <input type="number" step="0.01" name="price" class="form-control" required>
        </div>
        <div class="mb-3">
            <label>Davomiyligi (kunlarda)</label>
            <input type="number" name="duration" class="form-control" required>
        </div>
        <div class="mb-3">
            <label>Tasnifi</label>
            <textarea name="description" class="form-control"></textarea>
        </div>

        <div class="mb-3">
            <label>Imkoniyatlari</label>
            <div id="features-wrapper">
                <div class="d-flex mb-2 feature-item">
                    <input type="text" name="features[]" class="form-control" placeholder="Masalan: Cheksiz darslar">
                    <button type="button" class="btn btn-danger ms-2 remove-feature">O‘chirish</button>
                </div>
            </div>
            <button type="button" id="add-feature" class="btn btn-primary mt-2">➕ Qo‘shish</button>
        </div>

        <button class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.plans.index') }}" class="btn btn-secondary">Orqaga</a>
    </form>
</div>

{{-- Dinamik qo‘shish/o‘chirish uchun JS --}}
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const wrapper = document.getElementById('features-wrapper');
        const addBtn = document.getElementById('add-feature');

        addBtn.addEventListener('click', function () {
            const div = document.createElement('div');
            div.classList.add('d-flex', 'mb-2', 'feature-item');
            div.innerHTML = `
                <input type="text" name="features[]" class="form-control" placeholder="Masalan: Yangi imkoniyat">
                <button type="button" class="btn btn-danger ms-2 remove-feature">O‘chirish</button>
            `;
            wrapper.appendChild(div);
        });

        wrapper.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-feature')) {
                e.target.closest('.feature-item').remove();
            }
        });
    });
</script>
@endsection
