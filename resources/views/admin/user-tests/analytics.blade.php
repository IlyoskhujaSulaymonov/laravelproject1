@extends('layouts.admin')

@section('page-title', 'Test Tahlillari')

@section('content')
<div class="row mb-4">
    <div class="col-md-8">
        <h1 class="h3 mb-0">Test Tahlillari</h1>
        <p class="text-muted">Foydalanuvchi testlari bo'yicha to'liq statistika va tahlil</p>
    </div>
    <div class="col-md-4 text-end">
        <a href="{{ route('admin.user-tests.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left"></i> Testlar ro'yxati
        </a>
    </div>
</div>

<!-- Main Statistics -->
<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title text-white-50">Jami testlar</h6>
                        <h3 class="mb-0">{{ number_format($totalTests) }}</h3>
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
                        <h6 class="card-title text-white-50">Tugallangan</h6>
                        <h3 class="mb-0">{{ number_format($completedTests) }}</h3>
                        <small>{{ $totalTests ? number_format(($completedTests / $totalTests) * 100, 1) : 0 }}%</small>
                    </div>
                    <i class="fas fa-check-circle fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title text-white-50">O'rtacha ball</h6>
                        <h3 class="mb-0">{{ number_format($averageScore, 1) }}%</h3>
                    </div>
                    <i class="fas fa-chart-line fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title text-white-50">Faol foydalanuvchilar</h6>
                        <h3 class="mb-0">{{ number_format($totalUsers) }}</h3>
                    </div>
                    <i class="fas fa-users fa-2x opacity-75"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Charts Row -->
<div class="row mb-4">
    <!-- Tests by Subject -->
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-book me-2"></i>Fanlar bo'yicha testlar
                </h5>
            </div>
            <div class="card-body">
                <canvas id="subjectChart" height="300"></canvas>
            </div>
        </div>
    </div>
    
    <!-- Monthly Tests Trend -->
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-calendar-alt me-2"></i>Oylik test tendensiyasi
                </h5>
            </div>
            <div class="card-body">
                <canvas id="monthlyChart" height="300"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Recent Activity and Top Performers -->
<div class="row mb-4">
    <!-- Recent Activity -->
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-clock me-2"></i>So'nggi 7 kun faoliyati
                </h5>
            </div>
            <div class="card-body">
                <canvas id="activityChart" height="200"></canvas>
            </div>
        </div>
    </div>
    
    <!-- Top Performers -->
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-trophy me-2"></i>Eng yaxshi natijalar
                </h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Foydalanuvchi</th>
                                <th>Testlar</th>
                                <th>O'rtacha</th>
                                <th>Eng yaxshi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($topPerformers as $index => $performer)
                                <tr>
                                    <td>
                                        @if($index < 3)
                                            <i class="fas fa-medal text-{{ $index === 0 ? 'warning' : ($index === 1 ? 'secondary' : 'dark') }}"></i>
                                        @else
                                            {{ $index + 1 }}
                                        @endif
                                    </td>
                                    <td>
                                        <div>
                                            <div class="fw-medium">{{ $performer->name }}</div>
                                            <small class="text-muted">{{ $performer->email }}</small>
                                        </div>
                                    </td>
                                    <td>{{ $performer->total_tests }}</td>
                                    <td>
                                        <span class="badge bg-{{ $performer->avg_score >= 80 ? 'success' : ($performer->avg_score >= 60 ? 'warning' : 'danger') }}">
                                            {{ number_format($performer->avg_score, 1) }}%
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge bg-primary">{{ $performer->best_score }}%</span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="text-center text-muted">Ma'lumot yo'q</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Detailed Statistics -->
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-chart-bar me-2"></i>Fanlar bo'yicha batafsil statistika
                </h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Fan</th>
                                <th>Testlar soni</th>
                                <th>O'rtacha ball</th>
                                <th>Muvaffaqiyat darajasi</th>
                                <th>Eng past ball</th>
                                <th>Eng yuqori ball</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($testsBySubject as $subject)
                                <tr>
                                    <td class="fw-medium">{{ $subject->subject_name }}</td>
                                    <td>{{ number_format($subject->test_count) }}</td>
                                    <td>
                                        <span class="badge bg-{{ $subject->avg_score >= 80 ? 'success' : ($subject->avg_score >= 60 ? 'warning' : 'danger') }}">
                                            {{ number_format($subject->avg_score, 1) }}%
                                        </span>
                                    </td>
                                    <td>
                                        @php
                                            $successRate = $subject->avg_score >= 60 ? 
                                                (($subject->avg_score - 60) / 40) * 100 : 0;
                                        @endphp
                                        <div class="d-flex align-items-center">
                                            <div class="progress me-2" style="width: 100px; height: 8px;">
                                                <div class="progress-bar bg-{{ $successRate >= 75 ? 'success' : ($successRate >= 50 ? 'warning' : 'danger') }}" 
                                                     style="width: {{ $successRate }}%"></div>
                                            </div>
                                            <small>{{ number_format($successRate, 1) }}%</small>
                                        </div>
                                    </td>
                                    <td>
                                        @php
                                            $minScore = \App\Models\UserTest::whereHas('topic', function($q) use ($subject) {
                                                $q->whereHas('subject', function($s) use ($subject) {
                                                    $s->where('name', $subject->subject_name);
                                                });
                                            })->min('score_percentage');
                                        @endphp
                                        {{ $minScore ?? 'N/A' }}%
                                    </td>
                                    <td>
                                        @php
                                            $maxScore = \App\Models\UserTest::whereHas('topic', function($q) use ($subject) {
                                                $q->whereHas('subject', function($s) use ($subject) {
                                                    $s->where('name', $subject->subject_name);
                                                });
                                            })->max('score_percentage');
                                        @endphp
                                        {{ $maxScore ?? 'N/A' }}%
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="progress me-2" style="width: 80px; height: 6px;">
                                                <div class="progress-bar" style="width: {{ $subject->avg_score }}%"></div>
                                            </div>
                                            <small class="text-muted">{{ number_format($subject->avg_score, 1) }}%</small>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="text-center text-muted py-4">Ma'lumot topilmadi</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

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
</script>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Common chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    // Tests by Subject Chart
    const subjectData = @json($testsBySubject);
    const subjectChart = new Chart(document.getElementById('subjectChart'), {
        type: 'doughnut',
        data: {
            labels: subjectData.map(item => item.subject_name),
            datasets: [{
                data: subjectData.map(item => item.test_count),
                backgroundColor: [
                    '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545',
                    '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0'
                ]
            }]
        },
        options: {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = subjectData[context.dataIndex];
                            return `${context.label}: ${item.test_count} test (${item.avg_score.toFixed(1)}% o'rtacha)`;
                        }
                    }
                }
            }
        }
    });

    // Monthly Tests Chart
    const monthlyData = @json($testsByMonth);
    const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
        type: 'line',
        data: {
            labels: monthlyData.map(item => {
                const date = new Date(item.month + '-01');
                return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });
            }),
            datasets: [{
                label: 'Testlar soni',
                data: monthlyData.map(item => item.test_count),
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'O\'rtacha ball (%)',
                data: monthlyData.map(item => item.avg_score),
                borderColor: '#198754',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Testlar soni'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'O\'rtacha ball (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });

    // Recent Activity Chart
    const activityData = @json($recentActivity);
    const activityChart = new Chart(document.getElementById('activityChart'), {
        type: 'bar',
        data: {
            labels: activityData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'Testlar soni',
                data: activityData.map(item => item.test_count),
                backgroundColor: '#0d6efd',
                borderColor: '#0d6efd',
                borderWidth: 1
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Testlar soni'
                    }
                }
            }
        }
    });
    
    // Initialize MathJax rendering
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});
</script>
@endpush