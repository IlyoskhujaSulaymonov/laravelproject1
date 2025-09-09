@extends('layouts.admin')

@section('page-title', 'Tarif rejasini sotib olish so\'rovi tafsilotlari')

@section('content')
<div class="row mb-4">
    <div class="col-md-8">
        <h1 class="h3 mb-0">Tarif rejasini sotib olish so'rovi #{{ $planPurchaseRequest->id }}</h1>

    </div>
    <div class="col-md-4 text-end">
        <a href="{{ route('admin.plan-purchase-requests.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left"></i> So'rovlarga qaytish
        </a>
    </div>
</div>

<div class="row">
    <!-- Request Details -->
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-info-circle me-2"></i>So'rov tafsilotlari
                </h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-4">So'rov ID:</dt>
                            <dd class="col-sm-8">{{ $planPurchaseRequest->id }}</dd>
                            
                            <dt class="col-sm-4">Holat:</dt>
                            <dd class="col-sm-8">
                                @if($planPurchaseRequest->status === 'pending')
                                    <span class="badge bg-warning">Kutilmoqda</span>
                                @elseif($planPurchaseRequest->status === 'approved')
                                    <span class="badge bg-success">Tasdiqlangan</span>
                                @else
                                    <span class="badge bg-danger">Rad etilgan</span>
                                @endif
                            </dd>
                            
                            <dt class="col-sm-4">Yaratilgan:</dt>
                            <dd class="col-sm-8">{{ $planPurchaseRequest->created_at->format('d.m.Y H:i') }}</dd>
                            
                            @if($planPurchaseRequest->responded_at)
                                <dt class="col-sm-4">Javob berilgan:</dt>
                                <dd class="col-sm-8">{{ $planPurchaseRequest->responded_at->format('d.m.Y H:i') }}</dd>
                            @endif
                        </dl>
                    </div>
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-4">Foydalanuvchi:</dt>
                            <dd class="col-sm-8">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                        {{ substr($planPurchaseRequest->user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <div class="fw-medium">{{ $planPurchaseRequest->user->name }}</div>
                                        <small class="text-muted">{{ $planPurchaseRequest->user->email }}</small>
                                    </div>
                                </div>
                            </dd>
                            
                            <dt class="col-sm-4">Tarif reja:</dt>
                            <dd class="col-sm-8">
                                <div class="fw-medium">{{ $planPurchaseRequest->plan->name }}</div>
                                <small class="text-muted">{{ number_format($planPurchaseRequest->plan->price, 0, '', ' ') }} UZS {{ $planPurchaseRequest->plan->duration }} kun uchun</small>
                            </dd>
                        </dl>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">Foydalanuvchi xabari:</label>
                    <div class="border rounded p-3 bg-light">
                        {{ $planPurchaseRequest->message ?? 'Xabar yo\'q' }}
                    </div>
                </div>
                
                @if($planPurchaseRequest->phone)
                    <div class="mb-3">
                        <label class="form-label fw-bold">Telefon:</label>
                        <div class="border rounded p-3 bg-info bg-opacity-10">
                            {{ $planPurchaseRequest->phone }}
                        </div>
                    </div>
                @endif
                
                @if($planPurchaseRequest->telegram_username)
                    <div class="mb-3">
                        <label class="form-label fw-bold">Telegram Username:</label>
                        <div class="border rounded p-3 bg-info bg-opacity-10">
                            @<a href="https://t.me/{{ $planPurchaseRequest->telegram_username }}" target="_blank">{{ $planPurchaseRequest->telegram_username }}</a>
                        </div>
                    </div>
                @endif
                
                @if($planPurchaseRequest->admin_response)
                    <div class="mb-3">
                        <label class="form-label fw-bold">Administrator javobi:</label>
                        <div class="border rounded p-3 bg-info bg-opacity-10">
                            {{ $planPurchaseRequest->admin_response }}
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
    
    <!-- Response Form -->
    <div class="col-md-4">
        @if($planPurchaseRequest->status === 'pending')
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-reply me-2"></i>So'rovga javob berish
                    </h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('admin.plan-purchase-requests.update', $planPurchaseRequest) }}">
                        @csrf
                        @method('PUT')
                        
                        <div class="mb-3">
                            <label for="status" class="form-label">Holat</label>
                            <select class="form-select" id="status" name="status" required>
                                <option value="">Holatni tanlang</option>
                                <option value="approved">Tasdiqlash</option>
                                <option value="rejected">Rad etish</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="admin_response" class="form-label">Javob xabari</label>
                            <textarea class="form-control" id="admin_response" name="admin_response" rows="4" 
                                      placeholder="Foydalanuvchiga javobingizni kiriting..." required></textarea>
                            <div class="form-text">Bu xabar foydalanuvchiga yuboriladi.</div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="fas fa-paper-plane me-2"></i>Javob yuborish
                        </button>
                    </form>
                </div>
            </div>
        @else
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-check-circle me-2"></i>So'rov ko'rib chiqilgan
                    </h5>
                </div>
                <div class="card-body">
                    <p class="mb-0">
                        So'rovning hozirgi holati: 
                        <strong>
                            @if($planPurchaseRequest->status === 'approved')
                                <button class="btn btn-success">Tasdiqlangan</button>
                            @elseif($planPurchaseRequest->status === 'rejected')
                                <button class="btn btn-danger">Rad etilgan</button>
                            @else
                                <button class="btn btn-warning">Kutilmoqda</button>
                            @endif
                        </strong>
                    </p>
                </div>
            </div>
        @endif
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