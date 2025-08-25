<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Adaptive Learning</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="font-sans antialiased">
    <div id="learning-app" class="min-h-screen bg-gray-50"></div>

    <script>
        // Initialize the learning app
        document.addEventListener('DOMContentLoaded', function() {
            // Set auth token from Laravel session if available
            @auth
                localStorage.setItem('auth_token', '{{ auth()->user()->createToken("learning")->plainTextToken ?? "" }}');
                localStorage.setItem('user_id', '{{ auth()->user()->id }}');
                localStorage.setItem('user_name', '{{ auth()->user()->name }}');
                localStorage.setItem('user_email', '{{ auth()->user()->email }}');
            @endauth

            // Initialize React app
            if (window.initLearningApp) {
                window.initLearningApp();
            }
        });
    </script>
</body>
</html>