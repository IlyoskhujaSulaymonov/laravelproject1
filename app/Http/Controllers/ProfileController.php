<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\PasswordChangeRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{

    public function profile(Request $request)
    {
        $user = Auth::user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => "Foydalanuvchi topilmadi",
        ], 401);
    }

    return response()->json([
        'success' => true,
        'message' => "Foydalanuvchi profili",
        'data'    => new UserResource($user->load(['userData.region', 'userData', 'currentPlan.plan'])), // Eager load
    ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        
        // Update users table
        $user->fill($request->only(['name', 'email', 'phone']));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle avatar file upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('images/avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();
         
        // Update or create user_data table
        // The UserData model will automatically handle JSON casting for subjects and goals
        $user->userData()->updateOrCreate(
            ['user_id' => $user->id],
            $request->only([
                'region_id',
                'date_of_birth',
                'occupation',
                'education_level',
                'current_grade',
                'subjects',
                'goals',
            ])
        );

        // Return JSON response for AJAX requests
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Profil muvaffaqiyatli yangilandi!',
                'data' => new UserResource($user->load(['userData.region', 'userData', 'currentPlan.plan']))
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(PasswordChangeRequest $request)
    {
        $user = $request->user();
        
        // Update the user's password
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Return JSON response for AJAX requests
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Parol muvaffaqiyatli o\'zgartirildi!'
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'password-updated');
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
