@extends('layouts.admin')

@section('page-title', 'Test Tafsilotlari - ' . $userTest->test_name)

@section('content')
<div class="row mb-4">
    <div class="col-md-8">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <a href="{{ route('admin.user-tests.index') }}">Foydalanuvchi Testlari</a>
                </li>
                <li class="breadcrumb-item active">Test Tafsilotlari</li>
            </ol>
        </nav>
        <h1 class="h3 mb-0">{{ $userTest->test_name }}</h1>
        <p class="text-muted">{{ $userTest->user->name }} tomonidan topshirilgan test</p>
        <div class="alert alert-info alert-sm d-flex align-items-center">
            <i class="fas fa-superscript me-2"></i>
            <small>Matematik formulalar avtomatik ravishda ko'rsatiladi</small>
        </div>
    </div>
    <div class="col-md-4 text-end">
        <a href="{{ route('admin.user-tests.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left"></i> Orqaga
        </a>
    </div>
</div>

<!-- Test Overview -->
<div class="row mb-4">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-info-circle me-2"></i>Test Ma'lumotlari
                </h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-6">Foydalanuvchi:</dt>
                            <dd class="col-sm-6">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                        {{ substr($userTest->user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <div>{{ $userTest->user->name }}</div>
                                        <small class="text-muted">{{ $userTest->user->email }}</small>
                                    </div>
                                </div>
                            </dd>
                            <dt class="col-sm-6">Fan:</dt>
                            <dd class="col-sm-6">{{ $userTest->topic->subject->name ?? 'N/A' }}</dd>
                            <dt class="col-sm-6">Mavzu:</dt>
                            <dd class="col-sm-6">{{ $userTest->topic->title }}</dd>
                            <dt class="col-sm-6">Test turi:</dt>
                            <dd class="col-sm-6">
                                @switch($userTest->test_type)
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
                                        <span class="badge bg-danger">Yakuniy imtihon</span>
                                        @break
                                    @default
                                        <span class="badge bg-light text-dark">N/A</span>
                                @endswitch
                            </dd>
                        </dl>
                    </div>
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-6">Holat:</dt>
                            <dd class="col-sm-6">
                                @if($userTest->status === 'completed')
                                    <span class="badge bg-success">Tugallangan</span>
                                @elseif($userTest->status === 'in_progress')
                                    <span class="badge bg-warning">Jarayonda</span>
                                @else
                                    <span class="badge bg-secondary">Tashlab ketilgan</span>
                                @endif
                            </dd>
                            <dt class="col-sm-6">Sarflangan vaqt:</dt>
                            <dd class="col-sm-6">{{ $userTest->formatted_time_spent }}</dd>
                            <dt class="col-sm-6">Test sanasi:</dt>
                            <dd class="col-sm-6">{{ $userTest->created_at->format('d.m.Y H:i') }}</dd>
                            <dt class="col-sm-6">Kategoriya:</dt>
                            <dd class="col-sm-6">
                                @if($userTest->category)
                                    <span class="badge bg-outline-primary">{{ $userTest->category }}</span>
                                @else
                                    <span class="text-muted">N/A</span>
                                @endif
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-chart-pie me-2"></i>Natijalar
                </h5>
            </div>
            <div class="card-body text-center">
                <div class="position-relative d-inline-block mb-3">
                    <svg width="120" height="120" class="progress-ring">
                        <circle cx="60" cy="60" r="50" fill="transparent" stroke="#e9ecef" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="transparent" 
                                stroke="{{ $userTest->score_percentage >= 80 ? '#28a745' : ($userTest->score_percentage >= 60 ? '#ffc107' : '#dc3545') }}" 
                                stroke-width="8"
                                stroke-dasharray="{{ 2 * 3.14159 * 50 }}"
                                stroke-dashoffset="{{ 2 * 3.14159 * 50 * (1 - $userTest->score_percentage / 100) }}"
                                transform="rotate(-90 60 60)"/>
                    </svg>
                    <div class="position-absolute top-50 start-50 translate-middle">
                        <h3 class="mb-0">{{ $userTest->score_percentage }}%</h3>
                        <small class="text-muted">{{ $userTest->grade }}</small>
                    </div>
                </div>
                <div class="row text-center">
                    <div class="col-6">
                        <div class="border-end">
                            <h4 class="text-success mb-0">{{ $userTest->correct_answers }}</h4>
                            <small class="text-muted">To'g'ri</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <h4 class="text-danger mb-0">{{ $userTest->total_questions - $userTest->correct_answers }}</h4>
                        <small class="text-muted">Noto'g'ri</small>
                    </div>
                </div>
                <div class="mt-3">
                    <small class="text-muted">Jami savollar: {{ $userTest->total_questions }}</small>
                </div>
            </div>
        </div>
    </div>
</div>

@if(!empty($questionAnalysis))
<!-- Question Analysis -->
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">
            <i class="fas fa-list-alt me-2"></i>Savollar tahlili
        </h5>
    </div>
    <div class="card-body">
        <div class="accordion" id="questionsAccordion">
            @foreach($questionAnalysis as $index => $analysis)
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading{{ $index }}">
                        <button class="accordion-button {{ $index > 0 ? 'collapsed' : '' }}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse{{ $index }}" 
                                aria-expanded="{{ $index === 0 ? 'true' : 'false' }}">
                            <div class="d-flex align-items-center w-100">
                                <span class="me-3">
                                    @if($analysis['is_correct'])
                                        <i class="fas fa-check-circle text-success"></i>
                                    @else
                                        <i class="fas fa-times-circle text-danger"></i>
                                    @endif
                                </span>
                                <span class="fw-medium">Savol {{ $index + 1 }}</span>
                                <span class="ms-auto badge {{ $analysis['is_correct'] ? 'bg-success' : 'bg-danger' }}">
                                    {{ $analysis['is_correct'] ? 'To\'g\'ri' : 'Noto\'g\'ri' }}
                                </span>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse{{ $index }}" class="accordion-collapse collapse {{ $index === 0 ? 'show' : '' }}" 
                         data-bs-parent="#questionsAccordion">
                        <div class="accordion-body">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <h6>Savol matni:</h6>
                                    <div class="bg-light p-3 rounded math-content">
                                        {!! $analysis['question']->rendered_question !!}
                                    </div>
                                </div>
                                
                                @if($analysis['question']->variants->count() > 0)
                                    <div class="col-md-6">
                                        <h6>Javob variantlari:</h6>
                                        <div class="list-group">
                                            @foreach($analysis['question']->variants as $variant)
                                                <div class="list-group-item d-flex align-items-center
                                                    @if($variant->is_correct) bg-success bg-opacity-10 border-success
                                                    @elseif($analysis['user_answer'] && $analysis['user_answer']->id === $variant->id) bg-danger bg-opacity-10 border-danger
                                                    @endif">
                                                    <span class="badge bg-secondary me-2">{{ $variant->option_letter }}</span>
                                                    <span class="flex-grow-1 math-content">{!! $variant->rendered_text !!}</span>
                                                    @if($variant->is_correct)
                                                        <i class="fas fa-check text-success ms-2" title="To'g'ri javob"></i>
                                                    @endif
                                                    @if($analysis['user_answer'] && $analysis['user_answer']->id === $variant->id)
                                                        <i class="fas fa-user text-primary ms-2" title="Foydalanuvchi javobi"></i>
                                                    @endif
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Javob tahlili:</h6>
                                        <div class="bg-light p-3 rounded">
                                            @if($analysis['user_answer'])
                                                <div class="mb-2">
                                                    <strong>Foydalanuvchi javobi:</strong>
                                                    <span class="badge bg-primary">{{ $analysis['user_answer']->option_letter }}</span>
                                                    <span class="math-content">{!! $analysis['user_answer']->rendered_text !!}</span>
                                                </div>
                                            @else
                                                <div class="mb-2">
                                                    <strong>Foydalanuvchi javobi:</strong>
                                                    <span class="text-muted">Javob berilmagan</span>
                                                </div>
                                            @endif
                                            
                                            @if($analysis['correct_answer'])
                                                <div class="mb-2">
                                                    <strong>To'g'ri javob:</strong>
                                                    <span class="badge bg-success">{{ $analysis['correct_answer']->option_letter }}</span>
                                                    <span class="math-content">{!! $analysis['correct_answer']->rendered_text !!}</span>
                                                </div>
                                            @endif
                                            
                                            <div>
                                                <strong>Natija:</strong>
                                                @if($analysis['is_correct'])
                                                    <span class="text-success">
                                                        <i class="fas fa-check-circle"></i> To'g'ri
                                                    </span>
                                                @else
                                                    <span class="text-danger">
                                                        <i class="fas fa-times-circle"></i> Noto'g'ri
                                                    </span>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>
@else
<!-- No Question Data -->
<div class="card">
    <div class="card-body text-center py-5">
        <i class="fas fa-info-circle fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">Savol ma'lumotlari mavjud emas</h5>
        <p class="text-muted">Ushbu test uchun savollar tahlili mavjud emas.</p>
    </div>
</div>
@endif

@endsection

@push('styles')
<style>
.avatar-sm {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
}

.progress-ring circle {
    transition: stroke-dashoffset 0.5s ease-in-out;
}

.accordion-button:not(.collapsed) {
    background-color: rgba(13, 110, 253, 0.1);
}

.list-group-item {
    border: 1px solid #dee2e6;
}

.bg-success.bg-opacity-10 {
    background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-danger.bg-opacity-10 {
    background-color: rgba(220, 53, 69, 0.1) !important;
}

/* Mathematical content styling */
.math-content {
    line-height: 1.6;
}

.math-content .MathJax {
    font-size: inherit !important;
}

/* Ensure math formulas display nicely in question content */
.math-content p {
    margin-bottom: 0.5rem;
}

.math-content:last-child {
    margin-bottom: 0;
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

// Re-render MathJax when accordion is opened
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-collapse');
    
    accordionItems.forEach(item => {
        item.addEventListener('shown.bs.collapse', function() {
            if (window.MathJax) {
                MathJax.typesetPromise([this]);
            }
        });
    });
    
    // Initial render
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});
</script>
@endpush