<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirectGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callbackGoogle()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'password' => bcrypt(Str::random(16)),
                'email_verified_at' => now(), // mark as verified
            ]
        );

        // If user already exists but not verified, mark them verified
        if (is_null($user->email_verified_at)) {
            $user->update(['email_verified_at' => now()]);
        }

        Auth::login($user, true);

        return redirect()->route('user.profile')
            ->with('success', 'Successfully logged in with Google!');
    }

    public function redirectFacebook()
    {
         return Socialite::driver('facebook')->redirect();
    }

    public function callbackFacebook()
    {
        $facebookUser = Socialite::driver('facebook')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $facebookUser->getEmail()],
            [
                'name' => $facebookUser->getName(),
                'password' => bcrypt(Str::random(16)),
            ]
        );

        Auth::login($user, true);

        return redirect()->route('user.profile')->with('success', 'Successfully logged in with Facebook!');
    }
}
