@extends('layouts.admin')

@section('page-title', 'Tarif rejasini sotib olish so\'rovlari')

@section('content')


<!-- Filters -->
<div class="card mb-4 shadow-sm">
    <div class="card-header bg-white">
        <h5 class="mb-0">
            <i class="fas fa-filter me-2 text-primary"></i>Filtrlar
            <button class="btn btn-sm btn-outline-primary float-end" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#filtersCollapse" aria-expanded="false" aria-controls="filtersCollapse" id="filterToggle">
                <i class="fas fa-chevron-down" id="filterIcon"></i>
            </button>
        </h5>
    </div>
    <div class="collapse" id="filtersCollapse">
        <div class="card-body">
            <form method="GET" action="{{ route('admin.plan-purchase-requests.index') }}" class="row g-4">
                <div class="col-md-6 col-lg-3">
                    <label for="search" class="form-label fw-bold">Qidirish</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="search" name="search" 
                               value="{{ request('search') }}" placeholder="Foydalanuvchi nomi yoki email...">
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <label for="user_id" class="form-label fw-bold">Foydalanuvchi</label>
                    <select class="form-select" id="user_id" name="user_id">
                        <option value="">Barcha foydalanuvchilar</option>
                        @foreach($users as $user)
                            <option value="{{ $user->id }}" {{ request('user_id') == $user->id ? 'selected' : '' }}>
                                {{ $user->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-6 col-lg-3">
                    <label for="plan_id" class="form-label fw-bold">Tarif reja</label>
                    <select class="form-select" id="plan_id" name="plan_id">
                        <option value="">Barcha tarif rejalar</option>
                        @foreach($plans as $plan)
                            <option value="{{ $plan->id }}" {{ request('plan_id') == $plan->id ? 'selected' : '' }}>
                                {{ $plan->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-6 col-lg-3">
                    <label for="status" class="form-label fw-bold">Holat</label>
                    <select class="form-select" id="status" name="status">
                        <option value="">Barcha holatlar</option>
                        @foreach($statuses as $key => $value)
                            <option value="{{ $key }}" {{ request('status') == $key ? 'selected' : '' }}>
                                @if($key === 'pending')
                                    Kutilmoqda
                                @elseif($key === 'approved')
                                    Tasdiqlangan
                                @else
                                    Rad etilgan
                                @endif
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-12 mt-2">
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-search me-1"></i> Filtr
                        </button>
                        <a href="{{ route('admin.plan-purchase-requests.index') }}" class="btn btn-outline-secondary">
                            <i class="fas fa-times me-1"></i> Tozalash
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Requests Table -->
<div class="card shadow-sm">
    <div class="card-header bg-white">
        <h5 class="mb-0">Sotib olish so'rovlari</h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Foydalanuvchi</th>
                        <th>Tarif reja</th>
                        <th>Aloqa ma'lumotlari</th>
                        <th>Holat</th>
                        <th>Sana</th>
                        <th>Harakatlar</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($requests as $request)
                        <tr>
                            <td>{{ $request->id }}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                        {{ substr($request->user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <div class="fw-medium">{{ $request->user->name }}</div>
                                        <small class="text-muted">{{ $request->user->email }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="fw-medium">{{ $request->plan->name }}</div>
                                <small class="text-muted">{{ number_format($request->plan->price, 0, '', ' ') }} UZS</small>
                            </td>
                            <td>
                                @if($request->phone)
                                    <div><i class="fas fa-phone me-1"></i> {{ $request->phone }}</div>
                                @endif
                                @if($request->telegram_username)
                                    <div><i class="fab fa-telegram me-1"></i> @<a href="https://t.me/{{ $request->telegram_username }}" target="_blank">{{ $request->telegram_username }}</a></div>
                                @endif
                                @if(!$request->phone && !$request->telegram_username)
                                    <div class="text-muted">Aloqa ma'lumotlari yo'q</div>
                                @endif
                            </td>
                            <td>
                                @if($request->status === 'pending')
                                    <span class="badge bg-warning">Kutilmoqda</span>
                                @elseif($request->status === 'approved')
                                    <span class="badge bg-success">Tasdiqlangan</span>
                                @else
                                    <span class="badge bg-danger">Rad etilgan</span>
                                @endif
                            </td>
                            <td>
                                <div>{{ $request->created_at->format('d.m.Y') }}</div>
                                <small class="text-muted">{{ $request->created_at->format('H:i') }}</small>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.plan-purchase-requests.show', $request) }}" 
                                       class="btn btn-sm btn-outline-primary" title="Ko'rish">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <button type="button" class="btn btn-sm btn-outline-danger" 
                                            onclick="deleteRequest({{ $request->id }})" title="O'chirish">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-5">
                                <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Sotib olish so'rovlari topilmadi</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @if($requests->hasPages())
        <div class="card-footer">
            {{ $requests->links() }}
        </div>
    @endif
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">So'rovni o'chirish</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Ushbu sotib olish so'rovini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
                <form id="deleteForm" method="POST" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">O'chirish</button>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection

@push('styles')
<style>
.avatar-sm {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
}
</style>
@endpush

@push('scripts')
<script>
// Handle filter toggle icon change
document.addEventListener('DOMContentLoaded', function() {
    const filterCollapse = document.getElementById('filtersCollapse');
    const filterIcon = document.getElementById('filterIcon');
    
    filterCollapse.addEventListener('hide.bs.collapse', function () {
        filterIcon.classList.remove('fa-chevron-up');
        filterIcon.classList.add('fa-chevron-down');
    });
    
    filterCollapse.addEventListener('show.bs.collapse', function () {
        filterIcon.classList.remove('fa-chevron-down');
        filterIcon.classList.add('fa-chevron-up');
    });
});

function deleteRequest(requestId) {
    const form = document.getElementById('deleteForm');
    form.action = `{{ url('admin/plan-purchase-requests') }}/${requestId}`;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}
</script>
@endpush