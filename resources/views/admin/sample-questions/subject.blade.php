@extends('layouts.admin')

@section('page-title', 'Na\'munaviy savollar fanini tanlang')

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
                            <i class="fas fa-lightbulb me-2"></i>Na'munaviy savollar fanini tanlang
                        </h5>
                        @isset($subjects)
                            <span class="badge bg-white text-primary px-3 py-2" style="border-radius: 20px; font-weight: 600;">Jami: {{ $subjects->total() ?? count($subjects) }}</span>
                        @endisset
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <a href="{{ route('admin.sample-questions.subject.list') }}" class="btn btn-outline-light btn-sm px-3" style="border-radius: 8px; font-weight: 500;">
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
                                    <th class="text-white fw-bold py-3" style="border: none;">Fan nomi</th>
                                    <th class="text-center text-white fw-bold py-3" style="width: 150px; border: none;">Na'munaviy savollar</th>
                                    <th class="text-center text-white fw-bold py-3" style="width: 200px; border: none;">Harakat</th>
                                </tr>
                                <tr class="filter-row" style="background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%); border-bottom: 2px solid #e1e5e9;">
                                    <form method="GET" action="{{ route('admin.sample-questions.subject.list') }}" class="w-100">
                                        <td class="align-middle text-center py-3">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <i class="fas fa-filter text-primary me-2" style="font-size: 1.1rem;" title="Filter fanlar"></i>
                                                <span class="badge bg-primary text-white px-2 py-1" style="font-size: 0.7rem;">FILTER</span>
                                            </div>
                                        </td>
                                        <td class="p-3">
                                            <div class="input-group input-group-sm">
                                                <span class="input-group-text bg-white border-end-0 shadow-sm" style="border-color: #dee2e6;">
                                                    <i class="fas fa-search text-success"></i>
                                                </span>
                                                <input type="text" name="search" value="{{ request('search') }}" 
                                                       class="form-control form-control-sm border-start-0 shadow-sm" 
                                                       placeholder="Fan nomini qidirish..." 
                                                       onchange="this.form.submit()"
                                                       style="border-left: none !important; border-color: #dee2e6;">
                                            </div>
                                        </td>
                                        <td class="p-3">
                                            <div class="d-flex align-items-center justify-content-center">
                                                <i class="fas fa-info-circle text-muted"></i>
                                            </div>
                                        </td>
                                        <td class="p-3">
                                            <div class="d-flex flex-wrap gap-2">
                                                <button type="submit" class="btn btn-sm btn-primary shadow-sm px-3" title="Filterni qo'llash" style="border-radius: 6px;">
                                                    <i class="fas fa-filter me-1"></i>Filter
                                                </button>
                                                <a href="{{ route('admin.sample-questions.subject.list') }}" class="btn btn-sm btn-outline-secondary shadow-sm px-3" title="Filtrni tozalash" style="border-radius: 6px;">
                                                    <i class="fas fa-eraser me-1"></i>Tozalash
                                                </a>
                                            </div>
                                        </td>
                                    </form>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($subjects as $subject)
                                    <tr class="align-middle" style="transition: all 0.3s ease; border-bottom: 1px solid #f1f3f4;">
                                        <td class="text-center fw-bold text-muted py-3" style="background-color: #f8f9fa;">{{ $subject->id }}</td>
                                        <td class="py-3">
                                            <div class="d-flex align-items-start gap-2">
                                                <i class="fas fa-book text-primary mt-1" style="font-size: 1.2rem;"></i>
                                                <div>
                                                    <div class="text-dark fw-semibold">{{ $subject->name }}</div>
                                                    @if($subject->description)
                                                        <div class="text-muted small">{{ Str::limit($subject->description, 100) }}</div>
                                                    @endif
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center py-3">
                                            @php
                                                $sampleQuestionsCount = \App\Models\Question::sample()->where('subject_id', $subject->id)->count();
                                            @endphp
                                            <span class="badge px-3 py-2" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border-radius: 20px; font-weight: 500;">
                                                <i class="fas fa-lightbulb me-1"></i>{{ $sampleQuestionsCount }}
                                            </span>
                                        </td>
                                        <td class="text-center py-3">
                                            <a href="{{ route('admin.sample-questions.index', $subject) }}" 
                                               class="btn btn-sm shadow-sm px-4 py-2" 
                                               style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; border: none; border-radius: 8px; font-weight: 500;"
                                               title="Na'munaviy savollarni ko'rish">
                                                <i class="fas fa-eye me-1"></i>Savollarni ko'rish
                                            </a>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center py-5" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                                            <div class="text-muted mb-3">
                                                <i class="fas fa-info-circle me-2" style="font-size: 1.2rem;"></i>
                                                <span style="font-size: 1.1rem; font-weight: 500;">Ma'lumot topilmadi.</span>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
                @if($subjects->hasPages())
                <div class="card-footer" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-top: 1px solid #dee2e6;">
                    <nav class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div class="text-muted small fw-semibold">
                            <i class="fas fa-file-alt me-1"></i>Sahifa: {{ $subjects->currentPage() }} / {{ $subjects->lastPage() }}
                        </div>
                        {{ $subjects->appends(request()->query())->links('pagination::bootstrap-4') }}
                    </nav>
                </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection