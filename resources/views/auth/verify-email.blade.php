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
            <div class="flex items-center justify-center mb-6">
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                    {{-- Mail Icon --}}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path d="M3 8l9 6 9-6" />
                        <path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2 pl-5">Email tasdiqlash</h1>
            </div>
            <p class="text-gray-600">
                Ro‘yxatdan o‘tishni tugatish uchun emailingizni tasdiqlang.
            </p>
        </div>

        {{-- Card --}}
        <div class="bg-white/80 backdrop-blur-sm shadow-2xl rounded-xl p-6">
            @if (session('status') == 'verification-link-sent')
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
                    {{-- Check Icon --}}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-green-700 text-sm">
                        Yangi tasdiqlash havolasi emailingizga yuborildi.
                    </span>
                </div>
            @endif

            <div class="text-sm text-gray-600 mb-6">
                {{ __('Emailingizga tasdiqlash havolasini yubordik. Agar xat kelmagan bo‘lsa, quyidagi tugma orqali qayta yuborishingiz mumkin.') }}
            </div>

            {{-- Resend Button --}}
            <form method="POST" action="{{ route('verification.send') }}" class="mb-4">
                @csrf
                <button type="submit"
                        class="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path d="M4 4v16h16V4H4zm4 5h8M8 13h8" />
                    </svg>
                    <span>Qayta yuborish</span>
                </button>
            </form>

            {{-- Logout --}}
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit"
                        class="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Chiqish</span>
                </button>
            </form>
        </div>
    </div>
</div>
@endsection
