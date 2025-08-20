@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2>✏️ To'lovni tahrirlash</h2>

    <form action="{{ route('admin.payments.update', $payment->id) }}" method="POST" class="mt-3" id="editPaymentForm">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="user_search" class="form-label">Foydalanuvchi</label>
            <div class="position-relative">
                <input type="text" id="user_search" class="form-control" 
                       placeholder="Ism yoki email bo'yicha qidiring..." 
                       value="{{ $payment->user->name }} ({{ $payment->user->email }})"
                       autocomplete="off">
                <input type="hidden" name="user_id" id="user_id" value="{{ $payment->user_id }}" required>
                <div id="user_dropdown" class="dropdown-menu w-100" style="max-height: 200px; overflow-y: auto;"></div>
            </div>
            @error('user_id') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="amount" class="form-label">Miqdor</label>
            <input type="number" step="0.01" name="amount" id="amount" class="form-control" 
                   value="{{ old('amount', $payment->amount) }}" required min="0">
            <div class="form-text" id="price_hint"></div>
            <div id="price_error" class="text-danger" style="display: none;"></div>
            @error('amount') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="currency" class="form-label">Valyuta</label>
            <select name="currency" id="currency" class="form-select" required>
                <option value="UZS" {{ $payment->currency === 'UZS' ? 'selected' : '' }}>UZS - O'zbek so'mi</option>
                <option value="USD" {{ $payment->currency === 'USD' ? 'selected' : '' }}>USD - Dollar</option>
                <option value="EUR" {{ $payment->currency === 'EUR' ? 'selected' : '' }}>EUR - Evro</option>
                <option value="RUB" {{ $payment->currency === 'RUB' ? 'selected' : '' }}>RUB - Rubl</option>
            </select>
            @error('currency') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="provider" class="form-label">To'lov provayderi</label>
            <input type="text" name="provider" id="provider" class="form-control"
                   value="{{ old('provider', $payment->provider) }}">
            @error('provider') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="transaction_id" class="form-label">Transaction ID</label>
            <input type="text" name="transaction_id" id="transaction_id" class="form-control"
                   value="{{ old('transaction_id', $payment->transaction_id) }}">
            @error('transaction_id') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select name="status" id="status" class="form-select" required>
                <option value="pending" {{ $payment->status === 'pending' ? 'selected' : '' }}>Pending</option>
                <option value="paid" {{ $payment->status === 'paid' ? 'selected' : '' }}>Paid</option>
                <option value="failed" {{ $payment->status === 'failed' ? 'selected' : '' }}>Failed</option>
            </select>
            @error('status') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <button type="submit" class="btn btn-primary" id="submitBtn">
            <span class="spinner-border spinner-border-sm d-none" role="status"></span>
            Yangilash
        </button>
        <a href="{{ route('admin.payments.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>

<script>
class PaymentEditForm {
    constructor() {
        this.users = @json($users);
        this.currentPlanPrice = 0;
        this.init();
    }

    init() {
        this.setupUserSearch();
        this.setupPlanSelection();
        this.setupPriceValidation();
        this.setupFormSubmission();
        
        // Set initial plan price if plan is selected
        const selectedPlan = document.getElementById('plan_id');
        if (selectedPlan.value) {
            this.currentPlanPrice = parseFloat(selectedPlan.options[selectedPlan.selectedIndex].dataset.price) || 0;
            this.updatePriceHint();
        }
    }

    setupUserSearch() {
        const searchInput = document.getElementById('user_search');
        const dropdown = document.getElementById('user_dropdown');
        const hiddenInput = document.getElementById('user_id');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterUsers(e.target.value, dropdown, hiddenInput);
            }, 300);
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value) {
                this.filterUsers(searchInput.value, dropdown, hiddenInput);
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.position-relative')) {
                dropdown.classList.remove('show');
            }
        });
    }

    filterUsers(query, dropdown, hiddenInput) {
        if (query.length < 2) {
            dropdown.classList.remove('show');
            return;
        }

        const filteredUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredUsers.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-item-text">Foydalanuvchi topilmadi</div>';
        } else {
            dropdown.innerHTML = filteredUsers.map(user => 
                `<button type="button" class="dropdown-item" data-user-id="${user.id}">
                    <div class="d-flex align-items-center">
                        <div class="me-2">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                 style="width: 32px; height: 32px; font-size: 14px;">
                                ${user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <div class="fw-medium">${user.name}</div>
                            <small class="text-muted">${user.email}</small>
                        </div>
                    </div>
                </button>`
            ).join('');
        }

        dropdown.classList.add('show');

        // Add click handlers for dropdown items
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const userId = e.currentTarget.dataset.userId;
                const user = this.users.find(u => u.id == userId);
                
                if (user) {
                    document.getElementById('user_search').value = `${user.name} (${user.email})`;
                    hiddenInput.value = userId;
                    dropdown.classList.remove('show');
                }
            });
        });
    }

    setupPlanSelection() {
        const planSelect = document.getElementById('plan_id');
        const amountInput = document.getElementById('amount');

        planSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            this.currentPlanPrice = parseFloat(selectedOption.dataset.price) || 0;
            
            // Auto-fill price if plan is selected and amount is empty or less than plan price
            if (this.currentPlanPrice > 0) {
                const currentAmount = parseFloat(amountInput.value) || 0;
                if (currentAmount === 0 || currentAmount < this.currentPlanPrice) {
                    amountInput.value = this.currentPlanPrice.toFixed(2);
                }
            }
            
            this.updatePriceHint();
            this.validatePrice();
        });
    }

    setupPriceValidation() {
        const amountInput = document.getElementById('amount');
        
        amountInput.addEventListener('input', () => {
            this.validatePrice();
        });

        amountInput.addEventListener('blur', () => {
            this.validatePrice();
        });
    }

    validatePrice() {
        const amountInput = document.getElementById('amount');
        const errorDiv = document.getElementById('price_error');
        const amount = parseFloat(amountInput.value) || 0;

        if (this.currentPlanPrice > 0 && amount < this.currentPlanPrice) {
            errorDiv.textContent = `Miqdor kamida ${this.currentPlanPrice.toFixed(2)} so'm bo'lishi kerak`;
            errorDiv.style.display = 'block';
            amountInput.classList.add('is-invalid');
            return false;
        } else {
            errorDiv.style.display = 'none';
            amountInput.classList.remove('is-invalid');
            return true;
        }
    }

    updatePriceHint() {
        const hintDiv = document.getElementById('price_hint');
        
        if (this.currentPlanPrice > 0) {
            hintDiv.textContent = `Minimal miqdor: ${this.currentPlanPrice.toFixed(2)} so'm`;
            hintDiv.className = 'form-text text-info';
        } else {
            hintDiv.textContent = '';
        }
    }

    setupFormSubmission() {
        const form = document.getElementById('editPaymentForm');
        const submitBtn = document.getElementById('submitBtn');
        const spinner = submitBtn.querySelector('.spinner-border');

        form.addEventListener('submit', (e) => {
            if (!this.validatePrice()) {
                e.preventDefault();
                return false;
            }

            // Show loading state
            spinner.classList.remove('d-none');
            submitBtn.disabled = true;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PaymentEditForm();
});
</script>

<style>
.dropdown-menu.show {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    padding: 0.5rem 1rem;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.is-invalid {
    border-color: #dc3545;
}
</style>
@endsection
