<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration form.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle registration.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class
            ],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => 'Ism majburiy.',
            'name.string' => 'Ism matn bo\'lishi kerak.',
            'name.max' => 'Ism 255 belgidan oshmasligi kerak.',
            'email.required' => 'Email majburiy.',
            'email.string' => 'Email matn bo\'lishi kerak.',
            'email.lowercase' => 'Email kichik harflarda bo\'lishi kerak.',
            'email.email' => 'Email noto\'g\'ri formatda.',
            'email.max' => 'Email 255 belgidan oshmasligi kerak.',
            'email.unique' => 'Bu email allaqachon ro\'yxatdan o\'tgan.',
            'phone.required' => 'Telefon raqam majburiy.',
            'phone.string' => 'Telefon raqam matn bo\'lishi kerak.',
            'phone.max' => 'Telefon raqam 20 belgidan oshmasligi kerak.',
            'password.required' => 'Parol majburiy.',
            'password.confirmed' => 'Parollar mos emas.',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'role'     => User::ROLE_USER,
            'password' => Hash::make($request->password),
        ]);

        // Fire Registered event (this triggers email verification notification)
        event(new Registered($user));

        // Login newly registered user
        Auth::login($user);

        // Redirect to verification notice page
        return redirect()->route('verification.notice')
            ->with('status', 'verification-link-sent');
    }
}
