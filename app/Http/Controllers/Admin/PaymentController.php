<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
     public function index()
    {
        $payments = Payment::where('amount','>',0)->latest()->paginate(20);
        return view('admin.payments.index', compact('payments'));
    }

    public function create()
    {
        $users = User::where('role',User::ROLE_USER)->get(); 
        return view('admin.payments.create', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:10',
            'provider' => 'nullable|string|max:50',
            'transaction_id' => 'nullable|string|max:255',
            'status' => 'required|in:pending,paid,failed',
        ]);

        Payment::create($validated);

        return redirect()->route('admin.payments.index')->with('success', 'To‘lov muvaffaqiyatli qo‘shildi.');
    }

    public function edit(Payment $payment)
    {
        $users =User::where('role',User::ROLE_USER)->get(); // Assuming you want only users
        return view('admin.payments.edit', compact('payment', 'users'));
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:10',
            'provider' => 'nullable|string|max:50',
            'transaction_id' => 'nullable|string|max:255',
            'status' => 'required|in:pending,paid,failed',
        ]);

        $payment->update($validated);

        return redirect()->route('admin.payments.index')->with('success', 'To‘lov yangilandi.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->route('admin.payments.index')->with('success', 'To‘lov o‘chirildi.');
    }
}
