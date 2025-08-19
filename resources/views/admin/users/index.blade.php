@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2 class="mb-4">Foydalanuvchilar ro'yxati</h2>

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>
        </div>
    @endif

    @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>
        </div>
    @endif

    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <a href="{{ route('admin.users.create') }}" class="btn btn-primary">
                <i class="fas fa-plus"></i> Yangi foydalanuvchi qo'shish
            </a>
            <div class="d-flex">
                <input type="text" id="searchInput" class="form-control me-2" placeholder="Qidirish..." style="width: 200px;">
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered table-striped table-hover" id="usersTable">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ism</th>
                            <th scope="col">Email</th>
                            <th scope="col">Telefon</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Joriy tarif rejasi</th>
                            <th scope="col">Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($users as $user)
                            <tr>
                                <td>{{ $loop->iteration }}</td>
                                <td>{{ $user->name }}</td>
                                <td>{{ $user->email }}</td>
                                <td>{{ $user->phone ?? 'N/A' }}</td>
                                <td>{{ $user->role_name }}</td>
                                <td>
                                    <span id="current-plan-{{ $user->id }}">{{ $user->currentPlan?->id ?? 'Reja yo\'q' }}</span>
                                    <button class="btn btn-sm btn-info ms-2 change-plan-btn"
                                            data-user-id="{{ $user->id }}"
                                            data-user-name="{{ $user->name }}"
                                            data-current-plan="{{ $user->currentPlan?->id ?? '' }}"
                                            title="Tarif rejasini o'zgartirish">
                                        <i class="fas fa-edit"></i> O'zgartirish
                                    </button>
                                </td>
                                <td>
                                    <a href="{{ route('admin.users.edit', $user->id) }}"
                                       class="btn btn-warning btn-sm"
                                       title="Foydalanuvchini tahrirlash">
                                        <i class="fas fa-edit"></i> Tahrirlash
                                    </a>
                                    <form action="{{ route('admin.users.destroy', $user->id) }}"
                                          method="POST"
                                          style="display:inline-block;"
                                          onsubmit="return confirm('Haqiqatan ham {{ $user->name }} ni o\'chirmoqchimisiz?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm" title="Foydalanuvchini o'chirish">
                                            <i class="fas fa-trash"></i> O'chirish
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center">Hozircha foydalanuvchilar yo'q</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                {{ $users->links() }}
            </div>
        </div>
    </div>
</div>

<!-- Single reusable modal instead of multiple modals in loop -->
<!-- Single Plan Change Modal -->
<div class="modal fade" id="changePlanModal" tabindex="-1" aria-labelledby="changePlanModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="changePlanModalLabel">Reja tanlash</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Yopish"></button>
            </div>
            <form id="changePlanForm">
                @csrf
                @method('PUT')
                <div class="modal-body">
                    <!-- Added alert container for modal-specific messages -->
                    <div id="modalAlert" class="alert d-none" role="alert"></div>
                    
                    <div class="mb-3">
                        <label for="plan_id" class="form-label">Reja</label>
                        <select name="plan_id" id="plan_id" class="form-select" required>
                            <option value="" disabled>Rejani tanlang</option>
                            @foreach($plans as $plan)
                                <option value="{{ $plan->id }}">
                                    {{ $plan->name }} ({{ $plan->duration }} kun) - ${{ $plan->price }}
                                </option>
                            @endforeach
                        </select>
                        <div class="invalid-feedback" id="plan-error"></div>
                    </div>
                    
                    <!-- Added plan details display -->
                    <div id="planDetails" class="mt-3 p-3 bg-light rounded d-none">
                        <h6>Reja tafsilotlari:</h6>
                        <div id="planInfo"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bekor qilish</button>
                    <!-- Added loading state and spinner -->
                    <button type="submit" class="btn btn-primary" id="savePlanBtn">
                        <span class="spinner-border spinner-border-sm d-none" id="loadingSpinner" role="status" aria-hidden="true"></span>
                        <span id="btnText">Saqlash</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('usersTable');
    const rows = table.getElementsByTagName('tr');

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let found = false;

            for (let j = 1; j < cells.length - 1; j++) {
                if (cells[j].textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                    break;
                }
            }

            rows[i].style.display = found ? '' : 'none';
        }
    });

    const changePlanModal = new bootstrap.Modal(document.getElementById('changePlanModal'));
    const changePlanForm = document.getElementById('changePlanForm');
    const modalTitle = document.getElementById('changePlanModalLabel');
    const planSelect = document.getElementById('plan_id');
    const modalAlert = document.getElementById('modalAlert');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const planDetails = document.getElementById('planDetails');
    const planInfo = document.getElementById('planInfo');
    
    let currentUserId = null;

    // Plan data for details display
    const planData = @json($plans->keyBy('id'));

    // Handle plan change button clicks
    document.querySelectorAll('.change-plan-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentUserId = this.dataset.userId;
            const userName = this.dataset.userName;
            const currentPlan = this.dataset.currentPlan;
            
            modalTitle.textContent = `${userName} uchun reja tanlash`;
            planSelect.value = currentPlan || '';
            
            // Reset form state
            resetModalState();
            
            // Show plan details if current plan exists
            if (currentPlan && planData[currentPlan]) {
                showPlanDetails(planData[currentPlan]);
            }
            
            changePlanModal.show();
        });
    });

    // Handle plan selection change
    planSelect.addEventListener('change', function() {
        const selectedPlanId = this.value;
        if (selectedPlanId && planData[selectedPlanId]) {
            showPlanDetails(planData[selectedPlanId]);
        } else {
            planDetails.classList.add('d-none');
        }
    });

    // Handle form submission with AJAX
    changePlanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUserId) return;
        
        const formData = new FormData(this);
        
        // Show loading state
        setLoadingState(true);
        hideAlert();
        
        fetch(`/admin/users/${currentUserId}/change-plan`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 422) {
                    return response.json().then(data => Promise.reject(data));
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showAlert('success', data.message || 'Reja muvaffaqiyatli o\'zgartirildi!');
                
                // Update the current plan display in the table
                const currentPlanElement = document.getElementById(`current-plan-${currentUserId}`);
                if (currentPlanElement && data.planName) {
                    currentPlanElement.textContent = data.planName;
                }
                
                const changeBtn = document.querySelector(`[data-user-id="${currentUserId}"]`);
                if (changeBtn && data.userPlan) {
                    changeBtn.setAttribute('data-current-plan', data.userPlan.plan_id);
                }
                
                // Close modal after short delay
                setTimeout(() => {
                    changePlanModal.hide();
                    
                    // Show success message in main page
                    showMainAlert('success', data.message || 'Reja muvaffaqiyatli o\'zgartirildi!');
                }, 1500);
            } else {
                showAlert('danger', data.message || 'Xatolik yuz berdi!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            if (error.errors) {
                // Handle validation errors
                Object.keys(error.errors).forEach(field => {
                    const errorElement = document.getElementById(`${field}-error`);
                    if (errorElement) {
                        errorElement.textContent = error.errors[field][0];
                        document.getElementById(field).classList.add('is-invalid');
                    }
                });
                showAlert('danger', error.message || 'Validatsiya xatoliklari mavjud!');
            } else {
                showAlert('danger', error.message || 'Tarmoq xatosi yuz berdi!');
            }
        })
        .finally(() => {
            setLoadingState(false);
        });
    });

    // Helper functions
    function setLoadingState(loading) {
        if (loading) {
            loadingSpinner.classList.remove('d-none');
            btnText.textContent = 'Saqlanmoqda...';
            savePlanBtn.disabled = true;
        } else {
            loadingSpinner.classList.add('d-none');
            btnText.textContent = 'Saqlash';
            savePlanBtn.disabled = false;
        }
    }

    function showAlert(type, message) {
        modalAlert.className = `alert alert-${type}`;
        modalAlert.textContent = message;
        modalAlert.classList.remove('d-none');
    }

    function hideAlert() {
        modalAlert.classList.add('d-none');
    }

    function resetModalState() {
        hideAlert();
        planDetails.classList.add('d-none');
        
        // Clear validation errors
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });
    }

    function showPlanDetails(plan) {
        planInfo.innerHTML = `
            <strong>Nomi:</strong> ${plan.name}<br>
            <strong>Narxi:</strong> $${plan.price}<br>
            <strong>Davomiyligi:</strong> ${plan.duration} kun<br>
            <strong>Tavsif:</strong> ${plan.description || 'Tavsif yo\'q'}
        `;
        planDetails.classList.remove('d-none');
    }

    function showMainAlert(type, message) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>
            </div>
        `;
        
        const container = document.querySelector('.container');
        const existingAlert = container.querySelector('.alert');
        
        if (existingAlert) {
            existingAlert.remove();
        }
        
        container.insertAdjacentHTML('afterbegin', alertHtml);
    }
});
</script>
@endsection
