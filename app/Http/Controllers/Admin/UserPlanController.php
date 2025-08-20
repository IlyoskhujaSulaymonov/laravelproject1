<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserPlanController extends Controller
{
   public function index()
    {
        $userPlans = UserPlan::with(['user', 'plan'])->latest()->paginate(15);
        return view('admin.user_plans.index', compact('userPlans'));
    }

    /**
     * Show the form for creating a new user plan.
     */
    public function create(Request $request)
{
    $plans = Plan::all();

    $selectedUserId = $request->get('user_id'); // passed from index table
    $user = User::with('payments')->findOrFail($selectedUserId);

    // Only get successful payments (you may filter by status if you have one)
    $payments = $user->payments()
        ->where('status', 'paid') // Assuming 'paid' is the status for successful payments
        ->orderByDesc('created_at')
        ->get();

    return view('admin.user_plans.create', compact('plans', 'user', 'payments'));
}

    /**
     * Store a newly created user plan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'plan_id'   => 'required|exists:plans,id',
            'starts_at' => 'required|date',
            'is_active' => 'boolean',
        ]);

        // 🔹 Get selected plan & user
        $plan = Plan::findOrFail($validated['plan_id']);
        $user = User::findOrFail($validated['user_id']);

        // 🔹 Check user balance
        if ($user->balance < $plan->price) {
            return back()
                ->withErrors(['balance' => 'Foydalanuvchining balansida yetarli mablag‘ yo‘q.'])
                ->withInput();
        }

        // 🔹 Deduct balance by creating expense payment
        DB::transaction(function () use (&$validated, $user, $plan) {
            // Create payment
            $payment = Payment::create([
            'user_id' => $user->id,
            'amount'  => $plan->price,
            'payment_purpose' => 'expense',
            'status'  => 'paid',
            'currency'=> 'UZS',
            ]);

            // Calculate ends_at from plan duration
            $startsAt = \Carbon\Carbon::parse($validated['starts_at']);
            if ($plan->duration) {
            $validated['ends_at'] = $startsAt->copy()->addDays($plan->duration);
            }

            // Save with linked payment_id
            $validated['payment_id'] = $payment->id;

            UserPlan::create($validated);
        });

        return redirect()->route('admin.users.index')
            ->with('success', 'Foydalanuvchi rejasi muvaffaqiyatli qo‘shildi va to‘lov balansdan yechildi.');
    }


    /**
     * Show the form for editing the specified user plan.
     */
    public function edit(UserPlan $userPlan)
    {
        $users = User::all();
        $plans = Plan::all();

        return view('admin.user_plans.edit', compact('userPlan', 'users', 'plans'));
    }

    /**
     * Update the specified user plan in storage.
     */
    public function update(Request $request, UserPlan $user_plan)
    {
        $validated = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'plan_id'   => 'required|exists:plans,id',
            'starts_at' => 'required|date',
            'ends_at'   => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
            'payment_id'=> 'nullable|string|max:255',
        ]);

        $user_plan->update($validated);

        return redirect()->route('admin.user_plans.index')
            ->with('success', 'Foydalanuvchi rejasi yangilandi.');
    }

    /**
     * Remove the specified user plan from storage.
     */
    public function destroy(UserPlan $user_plan)
    {
        $user_plan->delete();

        return redirect()->route('admin.user_plans.index')
            ->with('success', 'Foydalanuvchi rejasi o‘chirildi.');
    }
}
