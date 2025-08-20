@extends('layouts.admin')

@section('page-title', 'Foydalanuvchi tarifini tahrirlash')

@section('content')
<div class="container mt-4">

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.user_plans.update', $userPlan->id) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="user_id" class="form-label">Foydalanuvchi</label>
            <select name="user_id" id="user_id" class="form-control select2" required>
                @foreach($users as $user)
                    <option value="{{ $user->id }}" {{ $userPlan->user_id == $user->id ? 'selected' : '' }}>
                        {{ $user->name }} (Balans: {{ $user->payments()->sum('amount') }})
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="plan_id" class="form-label">Reja</label>
            <select name="plan_id" id="plan_id" class="form-control select2" required>
                @foreach($plans as $plan)
                    <option value="{{ $plan->id }}" {{ $userPlan->plan_id == $plan->id ? 'selected' : '' }}>
                        {{ $plan->name }} (Narxi: {{ $plan->price }})
                    </option>
                @endforeach
            </select>
        </div>

        {{-- <div class="mb-3">
            <label for="starts_at" class="form-label">Boshlanish sanasi</label>
            <input type="date" name="starts_at" id="starts_at" class="form-control"
                   value="{{ old('starts_at', $userPlan->starts_at->format('Y-m-d')) }}" required>
        </div> --}}

        <div class="mb-3 form-check">
            <input type="checkbox" name="is_active" id="is_active" class="form-check-input"
                   {{ $userPlan->is_active ? 'checked' : '' }}>
            <label for="is_active" class="form-check-label">Faol</label>
        </div>

        <button type="submit" class="btn btn-success">Yangilash</button>
        <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>
@endsection

@push('scripts')
<script>
    $(document).ready(function() {
        $('.select2').select2({
            width: '100%',
            placeholder: "Tanlang...",
            allowClear: true
        });
    });
</script>
@endpush
