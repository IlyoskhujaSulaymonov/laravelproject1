<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Landing Page</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
</head>

<body>
    <div id="app"></div>

    <script>
        window.Laravel = {
            loginUrl: "{{ route('login') }}"
        };
    </script>
</body>

</html>
