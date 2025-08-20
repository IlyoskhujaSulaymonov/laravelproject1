@extends('layouts.admin')

@section('page-title', 'Foydalanuvchilar ro\'yxati')

<style>
/* General Container Styling */
.container.mt-4 {
    max-width: 1400px;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Search Input Styling */
.position-relative {
    transition: all 0.3s ease;
}

#searchInput {
    border-radius: 20px;
    border: 1px solid #ced4da;
    background-color: #fff;
    transition: border-color 0.3s, box-shadow 0.3s;
}

#searchInput:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

#searchInput::placeholder {
    color: #6c757d;
    font-style: italic;
}

.fa-search {
    color: #6c757d;
    transition: color 0.3s;
}

#searchInput:focus + .fa-search {
    color: #007bff;
}

/* Button Styling */
.btn-primary,
.btn-outline-primary,
.btn-outline-success,
.btn-warning,
.btn-danger {
    border-radius: 6px;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: translateY(-1px);
}

.btn-outline-primary:hover,
.btn-outline-success:hover {
    transform: translateY(-1px);
}

.btn-warning:hover {
    background-color: #e0a800;
    border-color: #d39e00;
}

.btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
    transform: translateY(-1px);
}
/* Avatar Styling */
.avatar-sm {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.3s ease;
}

.avatar-sm:hover {
    transform: scale(1.1);
}

/* Badge Styling */
.badge.bg-secondary {
    background-color: #6c757d !important;
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
}

/* Sortable Columns */
.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: background-color 0.2s;
}

.sortable:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.sortable i {
    opacity: 0.7;
    transition: opacity 0.2s;
}

.sortable:hover i,
.sortable.active i {
    opacity: 1;
}

/* Loading Overlay */
#tableLoading:not(.d-none) {
    opacity: 1;
    transition: opacity 0.3s;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
    border-width: 0.3em;
}

/* Pagination Styling */
.pagination {
    margin-top: 1rem;
}

.page-link {
    border-radius: 6px;
    margin: 0 0.2rem;
    color: #007bff;
    border: 1px solid #dee2e6;
    transition: all 0.3s ease;
}

.page-link:hover {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
    transform: translateY(-1px);
}

.page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .container.mt-4 {
        padding: 1rem;
    }

    .d-flex.gap-2 {
        flex-direction: column;
        gap: 0.5rem;
    }

    #searchInput {
        width: 100% !important;
    }

    .table-responsive {
        max-height: none;
    }

    .table th,
    .table td {
        font-size: 0.9rem;
        padding: 0.5rem;
    }

    .btn-group .btn {
        padding: 0.4rem 0.8rem;
    }

    .avatar-sm {
        width: 28px;
        height: 28px;
        font-size: 0.8rem;
    }
}

/* Alert Container */
#alertContainer .alert {
    border-radius: 6px;
    margin-bottom: 1rem;
    animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* No Results Message */
#noResultsRow .text-muted {
    font-size: 1rem;
    opacity: 0.8;
}

#noResultsRow i {
    color: #6c757d;
}

/* Balance and Plan Styling */
.fw-medium {
    color: #212529;
}

.text-muted small {
    font-size: 0.75rem;
}
</style>


@section('content')
<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex gap-2">
            <div class="position-relative">
                <input type="text" 
                       id="searchInput" 
                       class="form-control" 
                       placeholder="Qidirish..." 
                       style="width: 250px; padding-left: 2.5rem;">
                <i class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            </div>
            <a href="{{ route('admin.users.create') }}" class="btn btn-primary">
                <i class="fas fa-plus"></i> Yangi foydalanuvchi
            </a>
        </div>
    </div>

    <!-- Alert Container -->
    <div id="alertContainer"></div>

    <div class="card">
        <div class="card-body p-0">
            <!-- Loading Overlay -->
            <div id="tableLoading" class="d-none position-relative">
                <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style="z-index: 10;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yuklanmoqda...</span>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover mb-0" id="usersTable">
                    <thead class="table-dark sticky-top">
                        <tr>
                            <th scope="col" class="text-center" style="width: 60px;">#</th>
                            <th scope="col" class="sortable" data-sort="name">
                                Ism <i class="fas fa-sort ms-1"></i>
                            </th>
                            <th scope="col" class="sortable" data-sort="email">
                                Email <i class="fas fa-sort ms-1"></i>
                            </th>
                            <th scope="col">Telefon</th>
                            <th scope="col" class="sortable" data-sort="role">
                                Rol <i class="fas fa-sort ms-1"></i>
                            </th>
                            <th scope="col">Joriy tarif rejasi</th>
                              <th scope="col">Balance</th>
                            <th scope="col" class="text-center" style="width: 200px;">Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($users as $user)
                            <tr data-user-id="{{ $user->id }}">
                                <td class="text-center">{{ $loop->iteration }}</td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2">
                                            {{ strtoupper(substr($user->name, 0, 1)) }}
                                        </div>
                                        <strong>{{ $user->name }}</strong>
                                    </div>
                                </td>
                                <td>{{ $user->email }}</td>
                                <td>
                                    @if($user->phone)
                                        <a href="tel:{{ $user->phone }}" class="text-decoration-none">
                                            {{ $user->phone }}
                                        </a>
                                    @else
                                        <span class="text-muted">N/A</span>
                                    @endif
                                </td>
                                <td>
                                    <span class="badge bg-secondary">{{ $user->role_name }}</span>
                                </td>
                               <td>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <span id="current-plan-{{ $user->id }}" class="fw-medium">
                                            @if($user->currentPlan)
                                                {{ $user->currentPlan->plan?->name }}
                                                <small class="text-muted d-block">@if($user->currentPlan->ends_at) {{ $user->currentPlan->ends_at }} gacha @endif</small>
                                            @else
                                                <span class="text-muted">Reja yo'q</span>
                                            @endif
                                        </span>

                                        @if($user->currentPlan)
                                            {{-- Agar reja mavjud bo‘lsa, tahrirlash tugmasi --}}
                                           <a href="{{ route('admin.user_plans.create', ['user_id' => $user->id]) }}"
                                            class="btn btn-sm btn-outline-primary"
                                            title="Tarif rejasini tahrirlash"
                                            aria-label="Tarif rejasini tahrirlash">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        @else
                                            {{-- Agar reja mavjud bo‘lmasa, qo‘shish tugmasi --}}
                                            <a href="{{ route('admin.user_plans.create', ['user_id' => $user->id]) }}"
                                            class="btn btn-sm btn-outline-success"
                                            title="Tarif rejasini qo‘shish"
                                            aria-label="Tarif rejasini qo‘shish">
                                                <i class="fas fa-plus"></i>
                                            </a>
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <span class="fw-medium">{{ number_format($user->balance) }} so‘m</span>
                                <td>
                                    <div class="btn-group" role="group" aria-label="Foydalanuvchi amallar">
                                        <a href="{{ route('admin.users.edit', $user->id) }}"
                                           class="btn btn-warning btn-sm"
                                           title="Foydalanuvchini tahrirlash"
                                           aria-label="Foydalanuvchini tahrirlash">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <button type="button" 
                                                class="btn btn-danger btn-sm delete-user-btn"
                                                data-user-id="{{ $user->id }}"
                                                data-user-name="{{ $user->name }}"
                                                title="Foydalanuvchini o'chirish"
                                                aria-label="Foydalanuvchini o'chirish">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr id="noResultsRow">
                                <td colspan="7" class="text-center py-4">
                                    <div class="text-muted">
                                        <i class="fas fa-users fa-2x mb-2"></i>
                                        <p class="mb-0">Hozircha foydalanuvchilar yo'q</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            @if($users->hasPages())
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            {{ $users->firstItem() }}-{{ $users->lastItem() }} dan {{ $users->total() }} ta
                        </small>
                        {{ $users->links() }}
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

@section('styles')
<style>
.avatar-sm {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
}

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.sortable i {
    opacity: 0.5;
    transition: opacity 0.2s;
}

.sortable:hover i,
.sortable.active i {
    opacity: 1;
}

#searchInput:focus {
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.table-responsive {
    max-height: 70vh;
}

.sticky-top {
    position: sticky;
    top: 0;
    z-index: 5;
}
</style>
@endsection
