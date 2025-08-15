@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-blue-25 via-white to-purple-25 flex items-center justify-center p-4 relative">
  {{-- Background Animation --}}
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-20 left-10 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-20 right-10 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>

  <div class="w-full max-w-md relative z-10">
    {{-- Header --}}
    <div class="text-center mb-6">
      <a href="{{ url('/') }}" class="mb-3 text-gray-600 hover:text-gray-900 text-sm inline-flex items-center">
        {{-- Arrow Left SVG --}}
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Bosh sahifaga qaytish
      </a>
      <div class="flex items-center justify-center mb-3">
              <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                    {{-- Graduation Cap --}}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path d="M22 10L12 4 2 10l10 6 10-6z" />
                        <path d="M6 12v5c0 1.1 2.9 2 6 2s6-.9 6-2v-5" />
                    </svg>
                </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-1 pl-5">Ro'yxatdan o'tish</h1>
      </div>
      <p class="text-gray-600 text-sm mb-3">AI ta'lim platformasiga qo'shiling</p>
    </div>

    {{-- Card --}}
    <div class="bg-white/90 backdrop-blur-sm shadow-lg border-0 rounded-xl p-6 space-y-4">
      {{-- Errors --}}
      @if ($errors->any())
        <div class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-3">
          {{-- Alert Circle SVG --}}
          <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="text-red-700 text-sm">{{ implode(', ', $errors->all()) }}</span>
        </div>
      @endif

      {{-- Success flash --}}
      @if (session('status'))
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-3">
          {{-- Check Circle SVG --}}
          <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
          <span class="text-green-700 text-sm">{{ session('status') }}</span>
        </div>
      @endif

      {{-- Form --}}
      <form method="POST" action="{{ route('register') }}" class="space-y-3">
        @csrf

        {{-- Name --}}
        <div>
          <label for="name" class="text-sm font-medium text-gray-700">Ism va Familiya *</label>
          <input id="name" type="text" name="name" value="{{ old('name') }}"
               placeholder="Ismingiz va Familiyangiz"
               class="pl-3 h-10 w-full border border-gray-200 focus:border-blue-500 rounded-lg"
               required>
        </div>

        {{-- Email --}}
        <div>
          <label for="email" class="text-sm font-medium text-gray-700">Email manzil *</label>
          <input id="email" type="email" name="email" value="{{ old('email') }}"
               placeholder="example@email.com"
               class="pl-3 h-10 w-full border border-gray-200 focus:border-blue-500 rounded-lg"
               required>
        </div>

        {{-- Phone --}}
        <div>
          <label for="phone" class="text-sm font-medium text-gray-700">Telefon raqam</label>
          <input id="phone" type="tel" name="phone" value="{{ old('phone') }}"
               placeholder="+998 90 123 45 67"
               class="pl-3 h-10 w-full border border-gray-200 focus:border-blue-500 rounded-lg">
        </div>

        {{-- Password --}}
        <div>
          <label for="password" class="text-sm font-medium text-gray-700">Parol *</label>
          <div class="relative">
            <input id="password" type="password" name="password"
                 placeholder="Kamida 6 ta belgi"
                 class="pl-3 pr-10 h-10 w-full border border-gray-200 focus:border-blue-500 rounded-lg"
                 required>
            <button type="button" onclick="togglePassword('password', this)"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {{-- Eye SVG --}}
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        {{-- Password Confirm --}}
        <div>
          <label for="password_confirmation" class="text-sm font-medium text-gray-700">Parolni tasdiqlang *</label>
          <div class="relative">
            <input id="password_confirmation" type="password" name="password_confirmation"
                 placeholder="Parolni takrorlang"
                 class="pl-3 pr-10 h-10 w-full border border-gray-200 focus:border-blue-500 rounded-lg"
                 required>
            <button type="button" onclick="togglePassword('password_confirmation', this)"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {{-- Eye SVG --}}
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        {{-- Submit --}}
        <button type="submit"
            class="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          Ro'yxatdan o'tish
        </button>
      </form>

      {{-- Divider --}}
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">yoki</span>
        </div>
      </div>

    {{-- Social buttons --}}
      <div class="space-y-3">
                <a href="{{ url('/auth/google/redirect') }}"
                   class="flex items-center justify-center h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-lg">
                    {{-- Google Icon --}}
                    <svg class="h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google bilan ro'yxatdan o'tish
                </a>

                <div class="grid grid-cols-2 gap-3">
                    <a href="{{ url('/auth/facebook/redirect') }}"
                       class="flex items-center justify-center h-12 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 rounded-lg">
                        {{-- Facebook Icon --}}
                        <svg class="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </a>

                    <a href="{{ url('/auth/telegram/redirect') }}"
                       class="flex items-center justify-center h-12 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 rounded-lg">
                        {{-- Telegram Icon --}}
                        <svg class="h-5 w-5 mr-2" fill="#0088CC" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                    </a>
                </div>
            </div>

      {{-- Login link --}}
      <div class="text-center pt-3 border-t border-gray-200">
        <p class="text-gray-600 text-sm">
          Hisobingiz bormi?
          <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-700 font-medium">Kirish</a>
        </p>
      </div>
    </div>
  </div>
</div>

{{-- Add mask script --}}
<script src="https://unpkg.com/imask"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    var phoneMask = IMask(
        document.getElementById('phone'), {
            mask: '+{998} 00 000 00 00'
        }
    );
});
</script>
<script>
function togglePassword(id, btn) {
  let input = document.getElementById(id);
  let icon = btn.querySelector('svg');
  if (input.type === "password") {
    input.type = "text";
    // Eye Off SVG
    icon.outerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 2.47-5.97"/></svg>`;
  } else {
    input.type = "password";
    // Eye SVG
    icon.outerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}
</script>
@endsection
