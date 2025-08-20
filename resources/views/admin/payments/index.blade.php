@extends('layouts.admin')

@section('page-title', '💳 To‘lovlar tarixi')

@section('content')
<div class="container mt-4">

    @if(session('success'))
        <div class="alert alert-success mt-2">
            {{ session('success') }}
        </div>
    @endif

    <div class="d-flex justify-content-end mb-3">
        <a href="{{ route('admin.payments.create') }}" class="btn btn-success">➕ Yangi to‘lov qo‘shish</a>
    </div>

    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>Foydalanuvchi</th>
                <th>Email</th>
                <th>Miqdor</th>
                <th>Valyuta</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Transaction ID</th>
                <th>To'lov turi</th>
                <th>Sana</th>
                <th>Amallar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($payments as $payment)
                <tr>
                    <td>{{ $payment->id }}</td>
                    <td>{{ $payment->user->name ?? '-' }}</td>
                    <td>{{ $payment->user->email ?? '-' }}</td>
                    <td>{{ number_format($payment->amount, 2) }}</td>
                    <td>{{ $payment->currency }}</td>
                    <td>
                        <span class="badge 
                            @if($payment->status === 'paid') bg-success 
                            @elseif($payment->status === 'failed') bg-danger 
                            @else bg-warning text-dark @endif">
                            {{ ucfirst($payment->status) }}
                        </span>
                    </td>
                    <td>{{ $payment->provider ?? '-' }}</td>
                    <td>{{ $payment->transaction_id ?? '-' }}</td>
                    <td>
                        <span class="badge 
                            @if($payment->payment_purpose === 'income') bg-primary 
                            @else bg-danger 
                            @endif">
                            {{ $payment->payment_purpose === 'income' ? 'Kirim' : 'Chiqim' }}
                        </span>
                    </td>
                    <td>{{ $payment->created_at->format('Y-m-d H:i') }}</td>
                    <td>
                        <div class="btn-group">
                            <a href="{{ route('admin.payments.edit', $payment->id) }}" class="btn btn-sm btn-warning">✏️</a>
                            <form action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST" onsubmit="return confirm('O‘chirishni tasdiqlaysizmi?')" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-sm btn-danger">🗑️</button>
                            </form>
                        </div>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" class="text-center">To‘lovlar mavjud emas</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{ $payments->links() }}
</div>
@endsection
