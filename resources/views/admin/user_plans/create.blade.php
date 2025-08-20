@extends('layouts.admin')

@section('page-title', 'Foydalanuvchi rejasini qo‘shish')

@section('content')
<div class="container mt-4">

    <form action="{{ route('admin.user_plans.store') }}" method="POST" class="mt-3">
        @csrf

        {{-- USER --}}
        <div class="mb-3">
            <label class="form-label">Foydalanuvchi</label>
            <input type="hidden" name="user_id" value="{{ $user->id }}">
            <input type="text" class="form-control" value="{{ $user->name }} ({{ $user->email }})" disabled>
        </div>

        {{-- BALANCE --}}
        <div class="mb-3">
            <label class="form-label">Foydalanuvchi balansi</label>
            <input type="text" class="form-control" value="{{ number_format($user->balance) }} so‘m" disabled>
        </div>

        {{-- PLAN --}}
        <div class="mb-3">
            <label for="plan_id" class="form-label">Reja</label>
            <select name="plan_id" id="plan_id" class="form-select" required>
                <option value="">-- Tanlang --</option>
                @foreach($plans as $plan)
                    <option value="{{ $plan->id }}" data-price="{{ $plan->price }}">
                        {{ $plan->name }} ({{ $plan->price > 0 ? number_format($plan->price) . ' so‘m' : 'Bepul' }})
                    </option>
                @endforeach
            </select>
            <small class="text-muted">Foydalanuvchi balansidan kam bo‘lmagan reja tanlansin</small>
        </div>

        {{-- START DATE --}}
        <div class="mb-3">
            <label for="starts_at" class="form-label">Boshlanish sanasi</label>
            <input type="date" name="starts_at" id="starts_at" class="form-control"
                   required value="{{ old('starts_at', now()->toDateString()) }}">
        </div>

        {{-- ACTIVE --}}
        <div class="form-check mb-3">
            <input type="checkbox" name="is_active" id="is_active" class="form-check-input" value="1" checked>
            <label for="is_active" class="form-check-label">Faolmi?</label>
        </div>

        <button type="submit" class="btn btn-success">Saqlash</button>
        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>

{{-- JS: validate plan price vs balance --}}
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const planSelect = document.getElementById("plan_id");
        const userBalance = {{ $user->balance }};

        planSelect.addEventListener("change", function() {
            const selectedOption = planSelect.options[planSelect.selectedIndex];
            const planPrice = parseFloat(selectedOption.dataset.price || 0);

            if (planPrice > userBalance) {
                alert("Foydalanuvchi balansida ushbu rejani sotib olish uchun mablag‘ yetarli emas!");
                planSelect.value = "";
            }
        });
    });
</script>
@endsection
