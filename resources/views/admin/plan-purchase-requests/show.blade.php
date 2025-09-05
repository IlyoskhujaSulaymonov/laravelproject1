@extends('layouts.admin')

@section('page-title', 'Plan Purchase Request Details')

@section('content')
<div class="row mb-4">
    <div class="col-md-8">
        <h1 class="h3 mb-0">Plan Purchase Request #{{ $planPurchaseRequest->id }}</h1>
        <p class="text-muted">View and manage plan purchase request details</p>
    </div>
    <div class="col-md-4 text-end">
        <a href="{{ route('admin.plan-purchase-requests.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left"></i> Back to Requests
        </a>
    </div>
</div>

<div class="row">
    <!-- Request Details -->
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-info-circle me-2"></i>Request Details
                </h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-4">Request ID:</dt>
                            <dd class="col-sm-8">{{ $planPurchaseRequest->id }}</dd>
                            
                            <dt class="col-sm-4">Status:</dt>
                            <dd class="col-sm-8">
                                @if($planPurchaseRequest->status === 'pending')
                                    <span class="badge bg-warning">Pending</span>
                                @elseif($planPurchaseRequest->status === 'approved')
                                    <span class="badge bg-success">Approved</span>
                                @else
                                    <span class="badge bg-danger">Rejected</span>
                                @endif
                            </dd>
                            
                            <dt class="col-sm-4">Created:</dt>
                            <dd class="col-sm-8">{{ $planPurchaseRequest->created_at->format('d.m.Y H:i') }}</dd>
                            
                            @if($planPurchaseRequest->responded_at)
                                <dt class="col-sm-4">Responded:</dt>
                                <dd class="col-sm-8">{{ $planPurchaseRequest->responded_at->format('d.m.Y H:i') }}</dd>
                            @endif
                        </dl>
                    </div>
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-4">User:</dt>
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
                            
                            <dt class="col-sm-4">Plan:</dt>
                            <dd class="col-sm-8">
                                <div class="fw-medium">{{ $planPurchaseRequest->plan->name }}</div>
                                <small class="text-muted">{{ $planPurchaseRequest->plan->price }} UZS for {{ $planPurchaseRequest->plan->duration }} days</small>
                            </dd>
                        </dl>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">User Message:</label>
                    <div class="border rounded p-3 bg-light">
                        {{ $planPurchaseRequest->message }}
                    </div>
                </div>
                
                @if($planPurchaseRequest->admin_response)
                    <div class="mb-3">
                        <label class="form-label fw-bold">Admin Response:</label>
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
                        <i class="fas fa-reply me-2"></i>Respond to Request
                    </h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('admin.plan-purchase-requests.update', $planPurchaseRequest) }}">
                        @csrf
                        @method('PUT')
                        
                        <div class="mb-3">
                            <label for="status" class="form-label">Status</label>
                            <select class="form-select" id="status" name="status" required>
                                <option value="">Select Status</option>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="admin_response" class="form-label">Response Message</label>
                            <textarea class="form-control" id="admin_response" name="admin_response" rows="4" 
                                      placeholder="Enter your response to the user..." required></textarea>
                            <div class="form-text">This message will be sent to the user.</div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="fas fa-paper-plane me-2"></i>Send Response
                        </button>
                    </form>
                </div>
            </div>
        @else
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-check-circle me-2"></i>Request Processed
                    </h5>
                </div>
                <div class="card-body">
                    <p class="mb-0">
                        This request has already been processed with status: 
                        <strong>{{ ucfirst($planPurchaseRequest->status) }}</strong>
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