
@extends('layouts.admin')

@section('title', 'Boshqaruv paneli - EduAdmin')
@section('page-title', 'Boshqaruv paneli')

@push('styles')
<style>
    .stat-card {
        position: relative;
        overflow: hidden;
    }
    .stat-card::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        transform: rotate(45deg);
        transition: all 0.3s ease;
    }
    .stat-card:hover::after {
        top: -25%;
        right: -25%;
    }
    .activity-item {
        border-left: 3px solid transparent;
        transition: all 0.3s ease;
    }
    .activity-item.student { border-left-color: #4facfe; }
    .activity-item.teacher { border-left-color: #43e97b; }
    .activity-item.task { border-left-color: #fa709a; }
    .activity-item.class { border-left-color: #fee140; }
    .chart-container {
        position: relative;
        height: 300px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        padding: 20px;
    }
</style>
@endpush

@section('content')
<div class="row mb-4">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h2 class="mb-1">Xush kelibsiz, Admin!</h2>
                <p class="text-muted mb-0">Bugungi taʼlim tizimidagi yangiliklar quyidagicha:</p>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#quickStatsModal">
                    <i class="fas fa-chart-bar me-2"></i>Tez Statistika
                </button>
                <button class="btn btn-outline-primary" onclick="exportDashboard()">
                    <i class="fas fa-download me-2"></i>Hisobotni yuklab olish
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Statistika kartalari -->
<div class="row mb-4">
    <div class="col-lg-3 col-md-6 mb-3">
        <div class="stat-card students animate-slide-up">
            <div class="stat-icon students">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="stat-number" data-count="1234">0</div>
            <div class="stat-label">Umumiy o‘quvchilar</div>
            <div class="stat-change positive">
                <i class="fas fa-arrow-up me-1"></i>O‘tgan oydan +12%
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 mb-3">
        <div class="stat-card teachers animate-slide-up" style="animation-delay: 0.1s">
            <div class="stat-icon teachers">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
            <div class="stat-number" data-count="87">0</div>
            <div class="stat-label">Umumiy o‘qituvchilar</div>
            <div class="stat-change positive">
                <i class="fas fa-arrow-up me-1"></i>O‘tgan oydan +3%
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 mb-3">
        <div class="stat-card classes animate-slide-up" style="animation-delay: 0.2s">
            <div class="stat-icon classes">
                <i class="fas fa-school"></i>
            </div>
            <div class="stat-number" data-count="45">0</div>
            <div class="stat-label">Faol sinflar</div>
            <div class="stat-change positive">
                <i class="fas fa-arrow-up me-1"></i>O‘tgan oydan +8%
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 mb-3">
        <div class="stat-card tasks animate-slide-up" style="animation-delay: 0.3s">
            <div class="stat-icon tasks">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="stat-number" data-count="156">0</div>
            <div class="stat-label">Kutilayotgan vazifalar</div>
            <div class="stat-change negative">
                <i class="fas fa-arrow-down me-1"></i>O‘tgan oydan -5%
            </div>
        </div>
    </div>
</div>

<!-- So'nggi faoliyatlar -->
<div class="row">
    <div class="col-lg-6 mb-4">
        <div class="card animate-slide-up" style="animation-delay: 0.4s">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-clock me-2 text-primary"></i>So‘nggi faoliyatlar
                </h5>
                <small class="text-muted">Taʼlim tizimidagi so‘nggi yangilanishlar</small>
            </div>
            <div class="card-body">
                <div class="timeline">
                    @foreach([
                        ['type' => 'student', 'action' => 'Yangi o‘quvchi ro‘yxatga olindi', 'name' => 'Alice Johnson', 'time' => '2 soat oldin'],
                        ['type' => 'task', 'action' => 'Topshiriq topshirildi', 'name' => 'Matematika uy vazifasi #5', 'time' => '4 soat oldin'],
                        ['type' => 'teacher', 'action' => 'Yangi o‘qituvchi qo‘shildi', 'name' => 'Dr. Robert Smith', 'time' => '1 kun oldin'],
                        ['type' => 'class', 'action' => 'Dars jadvali yangilandi', 'name' => 'Fizika 101', 'time' => '2 kun oldin'],
                        ['type' => 'task', 'action' => 'Yangi topshiriq yaratildi', 'name' => 'Kimyo laboratoriya hisobot', 'time' => '3 kun oldin']
                    ] as $activity)
                    <div class="timeline-item">
                        <div class="timeline-content activity-item {{ $activity['type'] }}">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">{{ $activity['action'] }}</h6>
                                    <p class="mb-1 text-primary">{{ $activity['name'] }}</p>
                                    <small class="text-muted">{{ $activity['time'] }}</small>
                                </div>
                                <span class="badge badge-{{ $activity['type'] }}">{{ ucfirst($activity['type']) }}</span>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <!-- Yaqin tadbirlar -->
    <div class="col-lg-6 mb-4">
        <div class="card animate-slide-up" style="animation-delay: 0.5s">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-calendar-alt me-2 text-success"></i>Yaqin tadbirlar
                </h5>
                <small class="text-muted">Muhim sanalar va muddatlar</small>
            </div>
            <div class="card-body">
                @foreach([
                    ['title' => 'Ota-onalar bilan uchrashuv', 'date' => '15-yanvar 2025', 'type' => 'uchrashuv', 'color' => 'primary'],
                    ['title' => 'Fan ko‘rgazmasi', 'date' => '20-yanvar 2025', 'type' => 'tadbir', 'color' => 'info'],
                    ['title' => 'Semestr imtihonlari', 'date' => '1-fevral 2025', 'type' => 'imtihon', 'color' => 'warning'],
                    ['title' => 'Qishki ta’til', 'date' => '15-fevral 2025', 'type' => 'taʼtil', 'color' => 'success'],
                ] as $event)
                <div class="d-flex justify-content-between align-items-center mb-3 p-3 rounded" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);">
                    <div>
                        <h6 class="mb-1">{{ $event['title'] }}</h6>
                        <div class="d-flex align-items-center text-muted">
                            <i class="fas fa-calendar me-2"></i>
                            <small>{{ $event['date'] }}</small>
                        </div>
                    </div>
                    <span class="badge bg-{{ $event['color'] }}">{{ ucfirst($event['type']) }}</span>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</div>

<!-- Darslarga Ro‘yxatdan O‘tish Jarayoni -->
<div class="row mb-4">
    <div class="col-12">
        <div class="card animate-slide-up" style="animation-delay: 0.6s">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-chart-line me-2 text-info"></i>Darslarga Ro‘yxatdan O‘tish Holati
                </h5>
                <small class="text-muted">Faol darslar uchun joriy ro‘yxatdan o‘tish va sig‘im solishtirmasi</small>
            </div>
            <div class="card-body">
                <div class="row">
                    @foreach([
                        ['name' => 'Matematika', 'enrolled' => 45, 'capacity' => 50, 'progress' => 90, 'color' => 'primary'],
                        ['name' => 'Fizika', 'enrolled' => 38, 'capacity' => 45, 'progress' => 84, 'color' => 'info'],
                        ['name' => 'Kimyo', 'enrolled' => 42, 'capacity' => 50, 'progress' => 84, 'color' => 'success'],
                        ['name' => 'Biologiya', 'enrolled' => 35, 'capacity' => 40, 'progress' => 88, 'color' => 'warning']
                    ] as $class)
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="p-3 rounded" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="mb-0">{{ $class['name'] }}</h6>
                                <span class="badge bg-{{ $class['color'] }}">{{ $class['progress'] }}%</span>
                            </div>
                            <div class="mb-2">
                                <small class="text-muted">{{ $class['enrolled'] }}/{{ $class['capacity'] }} o‘quvchi</small>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-{{ $class['color'] }}" role="progressbar" 
                                     style="width: 0%" 
                                     aria-valuenow="{{ $class['progress'] }}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100">
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Diagrammalar Qatori -->
<div class="row">
    <div class="col-lg-8 mb-4">
        <div class="card animate-slide-up" style="animation-delay: 0.7s">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-chart-area me-2 text-warning"></i>Talabalar Faolligi Tahlili
                </h5>
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-lg-4 mb-4">
        <div class="card animate-slide-up" style="animation-delay: 0.8s">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-chart-pie me-2 text-danger"></i>Baholar Taqsimoti
                </h5>
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="gradeChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Tez Statistikalar Modal Oynasi -->
<div class="modal fade" id="quickStatsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="fas fa-chart-bar me-2"></i>Tezkor Statistikalar
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row text-center">
                    <div class="col-md-4 mb-3">
                        <div class="p-3 rounded" style="background: var(--success-gradient); color: white;">
                            <i class="fas fa-graduation-cap fa-2x mb-2"></i>
                            <h3>95%</h3>
                            <p class="mb-0">Davomat Ko‘rsatkichi</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="p-3 rounded" style="background: var(--info-gradient); color: white;">
                            <i class="fas fa-trophy fa-2x mb-2"></i>
                            <h3>87%</h3>
                            <p class="mb-0">Imtihon O‘tish Ko‘rsatkichi</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="p-3 rounded" style="background: var(--warning-gradient); color: white;">
                            <i class="fas fa-star fa-2x mb-2"></i>
                            <h3>4.2</h3>
                            <p class="mb-0">O‘rtacha Reyting</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
$(document).ready(function() {
    initializePerformanceChart();
    initializeGradeChart();
});

function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
            datasets: [{
                label: 'O‘rtacha Ball',
                data: [78, 82, 85, 88, 84, 90],
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function initializeGradeChart() {
    const ctx = document.getElementById('gradeChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#4facfe',
                    '#43e97b',
                    '#fa709a',
                    '#fee140',
                    '#ff9a9e'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function exportDashboard() {
    showLoading();
    
    setTimeout(function() {
        hideLoading();
        showAlert('success', 'Dashboard hisoboti muvaffaqiyatli eksport qilindi!');
    }, 2000);
}
</script>
@endpush
