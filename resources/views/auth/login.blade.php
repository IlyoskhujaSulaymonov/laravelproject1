@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
    {{-- Background Animation --}}
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
        {{-- Header --}}
        <div class="text-center mb-8">
            <a href="{{ url('/') }}" class="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900">
                {{-- Arrow Left --}}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Bosh sahifaga qaytish
            </a>

            <div class="flex items-center justify-center mb-6">
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                    {{-- Graduation Cap --}}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path d="M22 10L12 4 2 10l10 6 10-6z" />
                        <path d="M6 12v5c0 1.1 2.9 2 6 2s6-.9 6-2v-5" />
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2 pl-5">Xush kelibsiz!</h1>
            </div>
        </div>

        {{-- Login Card --}}
        <div class="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-xl p-6">
            <div class="text-center pb-4">
                <h2 class="text-2xl font-bold text-gray-900">Hisobingizga kirish</h2>
                <p class="text-gray-600">Email va parolingizni kiriting yoki ijtimoiy tarmoq orqali kiring</p>
            </div>

            {{-- Error Message --}}
            @if(session('error'))
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
                    {{-- Alert Circle --}}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span class="text-red-700 text-sm">{{ session('error') }}</span>
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf

                {{-- Email --}}
                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-gray-700">Email manzil</label>
                    <input id="email" name="email" type="email" value="{{ old('email') }}" placeholder="example@email.com"
                           required
                           class="pl-3 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors w-full rounded-lg"/>
                </div>

                {{-- Password --}}
                <div class="space-y-2">
                    <label for="password" class="text-sm font-medium text-gray-700">Parol</label>
                    <input id="password" name="password" type="password" placeholder="Parolingizni kiriting" required
                           class="pl-3 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors w-full rounded-lg"/>
                </div>

                {{-- Remember + Forgot --}}
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" name="remember" class="rounded border-gray-300">
                        <span class="text-sm text-gray-600">Meni eslab qol</span>
                    </label>
                    <a href="{{ route('password.request') }}" class="text-blue-600 hover:text-blue-700 text-sm">
                        Parolni unutdingizmi?
                    </a>
                </div>

                {{-- Submit --}}
                <button type="submit"
                        class="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg flex items-center justify-center space-x-2">
                    {{-- Shield --}}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Kirish</span>
                </button>
            </form>

            {{-- Divider --}}
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">yoki</span>
                </div>
            </div>

            {{-- Social Login --}}
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
                    Google bilan kirish
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

            {{-- Register Link --}}
            <div class="text-center pt-4 border-t border-gray-200 mt-6">
                <p class="text-gray-600">
                    Hisobingiz yo'qmi?
                    <a href="{{ route('register') }}" class="text-blue-600 hover:text-blue-700 font-semibold">
                        Ro'yxatdan o'ting
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
