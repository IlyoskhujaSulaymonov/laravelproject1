@extends('layouts.admin')

@section('page-title','Mavzular ro\'yxati')

@section('content')
<div class="container-fluid">

    @foreach (['success', 'danger', 'warning'] as $msg)
        @if(session($msg))
            <div class="alert alert-{{ $msg }} alert-dismissible fade show shadow-sm" role="alert">
                {{ session($msg) }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif
    @endforeach

    <div class="row mb-4">
        <div class="col-12">
            <div class="card shadow-lg border-0" style="border-radius: 12px; overflow: hidden;">
                <div class="card-header text-white d-flex flex-wrap gap-2 justify-content-between align-items-center sticky-top" style="top: 60px; z-index: 9; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                    <div class="d-flex align-items-center gap-2">
                        <h5 class="mb-0 d-flex align-items-center">
                            <i class="fas fa-list-alt me-2"></i>Mavzular ro'yxati
                        </h5>
                        @isset($topics)
                            <span class="badge bg-white text-primary px-3 py-2" style="border-radius: 20px; font-weight: 600;">Jami: {{ $topics->total() ?? count($topics) }}</span>
                        @endisset
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <a href="{{ route('admin.topics.create') }}" class="btn btn-light btn-sm shadow-sm px-3" style="border-radius: 8px; font-weight: 500;">
                            <i class="fas fa-plus me-1"></i>Yangi yaratish
                        </a>
                        <a href="{{ route('admin.topics.index') }}" class="btn btn-outline-light btn-sm px-3" style="border-radius: 8px; font-weight: 500;">
                            <i class="fas fa-rotate-right me-1"></i>Yangilash
                        </a>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-striped align-middle mb-0">
                            <thead style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);">
                                <tr>
                                    <th class="text-center text-white fw-bold py-3" style="width: 80px; border: none;">ID</th>
                                    <th class="text-white fw-bold py-3" style="width: 200px; border: none;">Fan nomi</th>
                                    <th class="text-white fw-bold py-3" style="border: none;">Nomi</th>
                                    <th class="text-center text-white fw-bold py-3" style="width: 120px; border: none;">Tartib raqami</th>
                                    <th class="text-center text-white fw-bold py-3" style="width: 220px; border: none;">Harakat</th>
                                </tr>
            <tr class="filter-row" style="background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%); border-bottom: 2px solid #e1e5e9;">
                <form method="GET" action="{{ route('admin.topics.index') }}" class="w-100">
                    <td class="align-middle text-center py-3">
                        <div class="d-flex align-items-center justify-content-center">
                            <i class="fas fa-filter text-primary me-2" style="font-size: 1.1rem;" title="Filter mavzular"></i>
                            <span class="badge bg-primary text-white px-2 py-1" style="font-size: 0.7rem;">FILTER</span>
                        </div>
                    </td>
                    <td class="p-3">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white border-end-0 shadow-sm" style="border-color: #dee2e6;">
                                <i class="fas fa-book text-primary"></i>
                            </span>
                            <select name="subject_id" class="form-select form-select-sm border-start-0 shadow-sm" onchange="this.form.submit()" style="border-left: none !important; border-color: #dee2e6;">
                                <option value="">Barcha fanlar</option>
                                @foreach($subjects as $subject)
                                    <option value="{{ $subject->id }}" {{ request('subject_id') == $subject->id ? 'selected' : '' }}>
                                        {{ $subject->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </td>
                    <td class="p-3">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white border-end-0 shadow-sm" style="border-color: #dee2e6;">
                                <i class="fas fa-search text-success"></i>
                            </span>
                            <input type="text" name="search" value="{{ request('search') }}" 
                                   class="form-control form-control-sm border-start-0 shadow-sm" 
                                   placeholder="Mavzu nomini qidirish..." 
                                   onchange="this.form.submit()"
                                   style="border-left: none !important; border-color: #dee2e6;">
                        </div>
                    </td>
                    <td class="p-3">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white border-end-0 shadow-sm" style="border-color: #dee2e6;">
                                <i class="fas fa-sort-numeric-down text-info"></i>
                            </span>
                            <input type="text" name="order" value="{{ request('order') }}" 
                                   class="form-control form-control-sm border-start-0 shadow-sm" 
                                   placeholder="Tartib raqami..." 
                                   onchange="this.form.submit()"
                                   style="border-left: none !important; border-color: #dee2e6;">
                        </div>
                    </td>
                    <td class="p-3">
                        <div class="d-flex flex-wrap gap-2">
                            <button type="submit" class="btn btn-sm btn-primary shadow-sm px-3" title="Filterni qo'llash" style="border-radius: 6px;">
                                <i class="fas fa-filter me-1"></i>Filter
                            </button>
                            <a href="{{ route('admin.topics.index') }}" class="btn btn-sm btn-outline-secondary shadow-sm px-3" title="Filtrni tozalash" style="border-radius: 6px;">
                                <i class="fas fa-eraser me-1"></i>Tozalash
                            </a>
                        </div>
                    </td>
                </form>
            </tr>
                            </thead>
                            <tbody>
                                @forelse($topics as $topic)
                                    <tr class="align-middle" style="transition: all 0.3s ease; border-bottom: 1px solid #f1f3f4;">
                                        <td class="text-center fw-bold text-muted py-3" style="background-color: #f8f9fa;">{{ $topic->id }}</td>
                                        <td class="py-3">
                                            <span class="badge px-3 py-2" style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; border-radius: 20px; font-weight: 500;">
                                                <i class="fas fa-book-open me-1"></i>{{ $topic->subject?->name }}
                                            </span>
                                        </td>
                                        <td class="fw-semibold py-3">
                                            <div class="d-flex align-items-start gap-2">
                                                <i class="fas fa-circle text-primary mt-1" style="font-size: 8px;"></i>
                                                <div>
                                                    <div class="text-dark fw-semibold">{{ $topic->title }}</div>
                                                    @if(method_exists($topic, 'questions') && $topic->questions)
                                                        <small class="text-muted d-flex align-items-center mt-1">
                                                            <i class="fas fa-question-circle me-1"></i>Savollar: {{ $topic->questions()->count() }}
                                                        </small>
                                                    @endif
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center py-3">
                                            <span class="badge px-3 py-2" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; border-radius: 20px; font-weight: 500;">{{ $topic->order }}</span>
                                        </td>
                                        <td class="text-center py-3">
                                            <div class="d-flex justify-content-center gap-2">
                                                <a href="{{ route('admin.topics.edit', $topic) }}" 
                                                   class="btn btn-sm btn-outline-warning shadow-sm" 
                                                   title="O'zgartirish"
                                                   style="border-radius: 8px; padding: 8px 12px;">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                                <form action="{{ route('admin.topics.destroy', $topic) }}" 
                                                      method="POST" 
                                                      class="d-inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button class="btn btn-sm btn-outline-danger shadow-sm" 
                                                            onclick="return confirm('Haqiqatan ham o\'chirmoqchimisiz?')" 
                                                            title="O'chirish"
                                                            style="border-radius: 8px; padding: 8px 12px;">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="text-center py-5" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                                            <div class="text-muted mb-3">
                                                <i class="fas fa-info-circle me-2" style="font-size: 1.2rem;"></i>
                                                <span style="font-size: 1.1rem; font-weight: 500;">Ma'lumot topilmadi.</span>
                                            </div>
                                            <div class="mt-3">
                                                <a href="{{ route('admin.topics.create') }}" class="btn btn-primary px-4 py-2" style="border-radius: 8px; font-weight: 500;">
                                                    <i class="fas fa-plus me-1"></i>Yangi mavzu yaratish
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
                @if($topics->hasPages())
                <div class="card-footer" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-top: 1px solid #dee2e6;">
                    <nav class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div class="text-muted small fw-semibold">
                            <i class="fas fa-file-alt me-1"></i>Sahifa: {{ $topics->currentPage() }} / {{ $topics->lastPage() }}
                        </div>
                        {{ $topics->appends(request()->query())->links('pagination::bootstrap-4') }}
                    </nav>
                </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection
