@extends('layouts.admin')

@section('page-title', 'Foydalanuvchi Testlari')

@section('content')
<div class="row mb-4">
    <div class="col-md-8">
        <h1 class="h3 mb-0">Foydalanuvchi Testlari</h1>
        <p class="text-muted">Barcha foydalanuvchilar tomonidan topshirilgan testlarni ko'rish va boshqarish</p>
        <div class="alert alert-info alert-sm d-flex align-items-center">
            <i class="fas fa-info-circle me-2"></i>
            <small>Matematik formulalar LaTeX formatida ko'rsatiladi. Misol: $x^2 + y^2 = z^2$</small>
        </div>
    </div>
    <div class="col-md-4 text-end">
        <a href="{{ route('admin.user-tests.analytics') }}" class="btn btn-info me-2">
            <i class="fas fa-chart-line"></i> Tahlil
        </a>
        <a href="{{ route('admin.user-tests.export') }}{{ request()->getQueryString() ? '?' . request()->getQueryString() : '' }}" 
           class="btn btn-success">
            <i class="fas fa-download"></i> Eksport
        </a>
    </div>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-header">
        <h5 class="mb-0">
            <i class="fas fa-filter me-2"></i>Filtrlar
            <button class="btn btn-sm btn-outline-secondary float-end" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#filtersCollapse" aria-expanded="true">
                <i class="fas fa-chevron-down"></i>
            </button>
        </h5>
    </div>
    <div class="collapse show" id="filtersCollapse">
        <div class="card-body">
            <form method="GET" action="{{ route('admin.user-tests.index') }}">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label for="search" class="form-label">Qidiruv</label>
                        <input type="text" class="form-control" id="search" name="search" 
                               value="{{ request('search') }}" placeholder="Test nomi yoki foydalanuvchi...">
                    </div>
                    <div class="col-md-3">
                        <label for="user_id" class="form-label">Foydalanuvchi</label>
                        <select class="form-select" id="user_id" name="user_id">
                            <option value="">Barchasi</option>
                            @foreach($users as $user)
                                <option value="{{ $user->id }}" {{ request('user_id') == $user->id ? 'selected' : '' }}>
                                    {{ $user->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="subject_id" class="form-label">Fan</label>
                        <select class="form-select" id="subject_id" name="subject_id">
                            <option value="">Barchasi</option>
                            @foreach($subjects as $subject)
                                <option value="{{ $subject->id }}" {{ request('subject_id') == $subject->id ? 'selected' : '' }}>
                                    {{ $subject->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="status" class="form-label">Holat</label>
                        <select class="form-select" id="status" name="status">
                            <option value="">Barchasi</option>
                            <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>Tugallangan</option>
                            <option value="in_progress" {{ request('status') == 'in_progress' ? 'selected' : '' }}>Jarayonda</option>
                            <option value="abandoned" {{ request('status') == 'abandoned' ? 'selected' : '' }}>Tashlab ketilgan</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="test_type" class="form-label">Test turi</label>
                        <select class="form-select" id="test_type" name="test_type">
                            <option value="">Barchasi</option>
                            <option value="practice" {{ request('test_type') == 'practice' ? 'selected' : '' }}>Amaliyot</option>
                            <option value="assessment" {{ request('test_type') == 'assessment' ? 'selected' : '' }}>Baholash</option>
                            <option value="quiz" {{ request('test_type') == 'quiz' ? 'selected' : '' }}>Viktorina</option>
                            <option value="final_exam" {{ request('test_type') == 'final_exam' ? 'selected' : '' }}>Yakuniy imtihon</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="min_score" class="form-label">Min ball (%)</label>
                        <input type="number" class="form-control" id="min_score" name="min_score" 
                               value="{{ request('min_score') }}" min="0" max="100">
                    </div>
                    <div class="col-md-3">
                        <label for="max_score" class="form-label">Max ball (%)</label>
                        <input type="number" class="form-control" id="max_score" name="max_score" 
                               value="{{ request('max_score') }}" min="0" max="100">
                    </div>
                    <div class="col-md-3">
                        <label for="start_date" class="form-label">Boshlanish sanasi</label>
                        <input type="date" class="form-control" id="start_date" name="start_date" 
                               value="{{ request('start_date') }}">
                    </div>
                    <div class="col-md-3">
                        <label for="end_date" class="form-label">Tugash sanasi</label>
                        <input type="date" class="form-control" id="end_date" name="end_date" 
                               value="{{ request('end_date') }}">
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-search"></i> Qidirish
                        </button>
                        <a href="{{ route('admin.user-tests.index') }}" class="btn btn-outline-secondary">
                            <i class="fas fa-times"></i> Tozalash
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Statistics Cards -->
<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">Jami testlar</h5>
                        <h3 class="mb-0">{{ $tests->total() }}</h3>
                    </div>
                    <i class="fas fa-clipboard-list fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">Tugallangan</h5>
                        <h3 class="mb-0">{{ $tests->where('status', 'completed')->count() }}</h3>
                    </div>
                    <i class="fas fa-check-circle fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">Jarayonda</h5>
                        <h3 class="mb-0">{{ $tests->where('status', 'in_progress')->count() }}</h3>
                    </div>
                    <i class="fas fa-clock fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">O'rtacha ball</h5>
                        <h3 class="mb-0">{{ number_format($tests->where('status', 'completed')->avg('score_percentage'), 1) }}%</h3>
                    </div>
                    <i class="fas fa-chart-line fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Tests Table -->
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">Testlar ro'yxati</h5>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Foydalanuvchi</th>
                        <th>Test nomi</th>
                        <th>Fan / Mavzu</th>
                        <th>Ball</th>
                        <th>Holat</th>
                        <th>Turi</th>
                        <th>Sana</th>
                        <th>Amallar</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($tests as $test)
                        <tr>
                            <td>{{ $test->id }}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                        {{ substr($test->user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <div class="fw-medium">{{ $test->user->name }}</div>
                                        <small class="text-muted">{{ $test->user->email }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="fw-medium math-content">{!! $test->test_name !!}</div>
                                <small class="text-muted">
                                    {{ $test->correct_answers }}/{{ $test->total_questions }} to'g'ri
                                </small>
                            </td>
                            <td>
                                <div class="fw-medium">{{ $test->topic->subject->name ?? 'N/A' }}</div>
                                <small class="text-muted">{{ $test->topic->title }}</small>
                            </td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="progress" style="width: 60px; height: 8px;">
                                        <div class="progress-bar 
                                            @if($test->score_percentage >= 80) bg-success
                                            @elseif($test->score_percentage >= 60) bg-warning
                                            @else bg-danger
                                            @endif"
                                            style="width: {{ $test->score_percentage }}%"></div>
                                    </div>
                                    <span class="ms-2 fw-medium">{{ $test->score_percentage }}%</span>
                                </div>
                                <small class="text-muted">{{ $test->grade }}</small>
                            </td>
                            <td>
                                @if($test->status === 'completed')
                                    <span class="badge bg-success">Tugallangan</span>
                                @elseif($test->status === 'in_progress')
                                    <span class="badge bg-warning">Jarayonda</span>
                                @else
                                    <span class="badge bg-secondary">Tashlab ketilgan</span>
                                @endif
                            </td>
                            <td>
                                @switch($test->test_type)
                                    @case('practice')
                                        <span class="badge bg-info">Amaliyot</span>
                                        @break
                                    @case('assessment')
                                        <span class="badge bg-primary">Baholash</span>
                                        @break
                                    @case('quiz')
                                        <span class="badge bg-secondary">Viktorina</span>
                                        @break
                                    @case('final_exam')
                                        <span class="badge bg-danger">Yakuniy</span>
                                        @break
                                    @default
                                        <span class="badge bg-light text-dark">N/A</span>
                                @endswitch
                            </td>
                            <td>
                                <div>{{ $test->created_at->format('d.m.Y') }}</div>
                                <small class="text-muted">{{ $test->created_at->format('H:i') }}</small>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.user-tests.show', $test) }}" 
                                       class="btn btn-sm btn-outline-primary" title="Ko'rish">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <button type="button" class="btn btn-sm btn-outline-danger" 
                                            onclick="deleteTest({{ $test->id }})" title="O'chirish">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="text-center py-4">
                                <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Hech qanday test topilmadi</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @if($tests->hasPages())
        <div class="card-footer">
            {{ $tests->links() }}
        </div>
    @endif
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Testni o'chirish</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Ushbu testni o'chirishni xohlaysizmi? Bu amal bekor qilib bo'lmaydi.</p>
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

/* Mathematical content styling */
.math-content {
    line-height: 1.6;
}

.math-content .MathJax {
    font-size: inherit !important;
}

/* Ensure math content doesn't break table layout */
td .math-content {
    word-break: break-word;
    overflow-wrap: break-word;
}
</style>
@endpush

@push('scripts')
<!-- MathJax for rendering mathematical formulas -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script>
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
};

function deleteTest(testId) {
    const form = document.getElementById('deleteForm');
    form.action = `{{ route('admin.user-tests.index') }}/${testId}`;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

// Auto-submit form on filter change
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const selects = form.querySelectorAll('select');
    
    selects.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value !== '') {
                form.submit();
            }
        });
    });
    
    // Re-render MathJax after page load
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});
</script>
@endpush