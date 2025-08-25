<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AI uztoz</title>
    <meta name="description" content="Ta'lim boshqaruv tizimi">
    <link rel="icon" type="image/jpeg" sizes="192x192" href="{{ asset('/images/logo.png') }}">

    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
</head>

<body>
    <div id="app" data-page="landing"></div>

    <script>
        window.Laravel = {
            loginUrl: "{{ route('login') }}"
        };
    </script>
</body>

</html>