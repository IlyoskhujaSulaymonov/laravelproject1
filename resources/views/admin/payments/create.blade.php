@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2>➕ Yangi to'lov qo'shish</h2>

    <form action="{{ route('admin.payments.store') }}" method="POST" class="mt-3" id="paymentForm">
        @csrf

        <!-- Added searchable user select with search functionality -->
        <div class="mb-3">
            <label for="user_search" class="form-label">Foydalanuvchi</label>
            <div class="position-relative">
                <input type="text" id="user_search" class="form-control" placeholder="Ism yoki email bo'yicha qidiring..." autocomplete="off">
                <input type="hidden" name="user_id" id="user_id" required>
                <div id="user_dropdown" class="dropdown-menu w-100" style="max-height: 200px; overflow-y: auto; display: none;">
                    @foreach($users as $user)
                        <a href="#" class="dropdown-item user-option" data-user-id="{{ $user->id }}" data-user-name="{{ $user->name }}" data-user-email="{{ $user->email }}">
                            <strong>{{ $user->name }}</strong><br>
                            <small class="text-muted">{{ $user->email }}</small>
                        </a>
                    @endforeach
                </div>
            </div>
            @error('user_id') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <!-- Enhanced amount field with validation message -->
        <div class="mb-3">
            <label for="amount" class="form-label">Miqdor</label>
            <input type="number" step="0.01" name="amount" id="amount" class="form-control" required>
            <div id="price_validation_message" class="text-danger mt-1" style="display: none;"></div>
            @error('amount') <span class="text-danger">{{ $message }}</span> @enderror
        </div>

        <!-- Converted currency to select dropdown -->
        <div class="mb-3">
            <label for="currency" class="form-label">Valyuta</label>
            <select name="currency" id="currency" class="form-select" required>
                <option value="UZS" selected>UZS - O'zbek so'mi</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="provider" class="form-label">To'lov provayderi</label>
            <input type="text" name="provider" id="provider" class="form-control">
        </div>

        <div class="mb-3">
            <label for="transaction_id" class="form-label">Transaction ID</label>
            <input type="text" name="transaction_id" id="transaction_id" class="form-control">
        </div>

        <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select name="status" id="status" class="form-select" required>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
            </select>
        </div>

        <button type="submit" class="btn btn-success" id="submitBtn">Saqlash</button>
        <a href="{{ route('admin.payments.index') }}" class="btn btn-secondary">Bekor qilish</a>
    </form>
</div>

<!-- Added JavaScript for enhanced functionality -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const userSearch = document.getElementById('user_search');
    const userIdInput = document.getElementById('user_id');
    const userDropdown = document.getElementById('user_dropdown');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('paymentForm');

    let selectedPlanPrice = 0;

    // User search functionality
    userSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const userOptions = userDropdown.querySelectorAll('.user-option');
        let hasVisibleOptions = false;

        userOptions.forEach(option => {
            const userName = option.dataset.userName.toLowerCase();
            const userEmail = option.dataset.userEmail.toLowerCase();
            
            if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
                option.style.display = 'block';
                hasVisibleOptions = true;
            } else {
                option.style.display = 'none';
            }
        });

        userDropdown.style.display = searchTerm.length > 0 && hasVisibleOptions ? 'block' : 'none';
        
        // Clear selection if search is cleared
        if (searchTerm.length === 0) {
            userIdInput.value = '';
        }
    });

    // User selection
    userDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('user-option') || e.target.closest('.user-option')) {
            const option = e.target.classList.contains('user-option') ? e.target : e.target.closest('.user-option');
            const userId = option.dataset.userId;
            const userName = option.dataset.userName;
            const userEmail = option.dataset.userEmail;

            userSearch.value = `${userName} (${userEmail})`;
            userIdInput.value = userId;
            userDropdown.style.display = 'none';
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userSearch.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
    });


    // Form submission validation
    form.addEventListener('submit', function(e) {
        if (!validatePrice()) {
            e.preventDefault();
            return false;
        }
        
        if (!userIdInput.value) {
            e.preventDefault();
            alert('Iltimos, foydalanuvchini tanlang');
            return false;
        }
    });
});
</script>

<style>
.dropdown-menu {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.dropdown-item {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.is-invalid {
    border-color: #dc3545;
}

#user_search:focus + #user_dropdown {
    display: block;
}
</style>
@endsection
