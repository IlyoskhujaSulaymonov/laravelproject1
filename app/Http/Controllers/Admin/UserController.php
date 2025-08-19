<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Teacher;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['currentPlan.plan'])->latest()->paginate(10);
        $plans = Plan::all();
        return view('admin.users.index', compact('users','plans'));
    }

    public function create()
    {
        $roles = Role::all();
        return view('admin.users.create', compact('roles'));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|string|in:admin,teacher,student',
            'phone'    => 'nullable|string|max:20',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        if ($validated['role'] === 'teacher') {
            Teacher::create([
                'user_id'    => $user->id,
                'name' => $validated['name'],
                'email'      => $validated['email'],
                'phone'      => $validated['phone'],
            ]);
        }

        return redirect()->route('admin.users.index')->with('success', 'Foydalanuvchi muvaffaqiyatli qo‘shildi.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        return view('admin.users.edit', compact('user', 'roles'));
    }


    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone'      => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if ($user->role === 'teacher') {
            $teacher = $user->teacher;
            if ($teacher) {
                $teacher->update([
                    'name'  => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.users.index')->with('success', 'Foydalanuvchi yangilandi.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Foydalanuvchi o‘chirildi.');
    }

    public function changePlan(Request $request, User $user)
{
    $request->validate([
        'plan_id' => 'required|exists:plans,id',
    ]);

    // Deactivate old plans
    $user->subscriptions()->update(['is_active' => false]);

    // Attach new plan
    $plan = Plan::find($request->plan_id);

    $user->subscriptions()->create([
        'plan_id' => $plan->id,
        'starts_at' => now(),
        'ends_at' => now()->addDays($plan->duration),
        'is_active' => true,
    ]);

    return redirect()->route('admin.users.index')->with('success', 'Foydalanuvchi rejasi yangilandi!');
}
}
