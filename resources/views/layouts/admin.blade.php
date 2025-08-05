<!DOCTYPE html>
<html lang="uz" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="Ta'lim boshqaruv tizimi - o'qituvchilar, talabalar va darslarni boshqarish">

        <!-- Favicon -->
    <link rel="icon" type="image/jpeg" sizes="192x192" href="{{ asset('/images/logo.png') }}">

    <title>@yield('title', 'Ta\'lim Boshqaruvi - Ta\'lim Boshqaruv Tizimi')</title>

    <!-- Preload critical resources -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

    <!-- Font Awesome Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous">

    <!-- Custom CSS -->
    <link href="{{ asset('css/admin.css') }}" rel="stylesheet">

    @stack('styles')
</head>

<body>
    <div class="wrapper">
        <!-- Sidebar Overlay for Mobile -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Sidebar -->
        <nav id="sidebar" class="sidebar" role="navigation" aria-label="Asosiy navigatsiya">
            <div class="sidebar-header">
                <div class="sidebar-brand">
                    <i class="fas fa-graduation-cap brand-icon" aria-hidden="true"></i>
                    <div class="brand-text">
                        <h4 class="mb-0">Ta'lim Boshqaruvi</h4>
                    </div>
                </div>
                <button type="button" id="sidebarCollapse" class="btn btn-outline-light btn-sm"
                    aria-label="Yon panelni yig'ish/kengaytirish">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>

            <div class="sidebar-menu">
                <div class="menu-section">
                    <h6 class="menu-title">NAVIGATSIYA</h6>
                    <ul class="nav nav-pills nav-sidebar flex-column" role="menubar">
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.dashboard') }}"
                                class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.dashboard') ? 'page' : 'false' }}">
                                <i class="fas fa-home nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Boshqaruv Paneli</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.teachers.index') }}"
                                class="nav-link {{ request()->routeIs('admin.teachers*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.teachers*') ? 'page' : 'false' }}">
                                <i class="fas fa-chalkboard-teacher nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">O'qituvchilar</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.students.index') }}"
                                class="nav-link {{ request()->routeIs('admin.students*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.students*') ? 'page' : 'false' }}">
                                <i class="fas fa-user-graduate nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Talabalar</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.classes.index') }}"
                                class="nav-link {{ request()->routeIs('admin.classes*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.classes*') ? 'page' : 'false' }}">
                                <i class="fas fa-school nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Sinflar</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.subjects.index') }}"
                                class="nav-link {{ request()->routeIs('admin.subjects*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.subjects*') ? 'page' : 'false' }}">
                                <i class="fas fa-book nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Fanlar</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.tasks.index') }}"
                                class="nav-link {{ request()->routeIs('admin.tasks*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.tasks*') ? 'page' : 'false' }}">
                                <i class="fas fa-clipboard-list nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Vazifalar va Topshiriqlar</span>
                            </a>
                        </li>
                        {{-- <li class="nav-item" role="none">
                            <a href="{{ route('admin.grades') }}"
                                class="nav-link {{ request()->routeIs('admin.grades*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.grades*') ? 'page' : 'false' }}">
                                <i class="fas fa-chart-line nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Baholar</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.reports') }}"
                                class="nav-link {{ request()->routeIs('admin.reports*') ? 'active' : '' }}"
                                role="menuitem"
                                aria-current="{{ request()->routeIs('admin.reports*') ? 'page' : 'false' }}">
                                <i class="fas fa-file-alt nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Hisobotlar</span>
                            </a>
                        </li> --}}
                    </ul>
                </div>

                <div class="menu-section">
                    <h6 class="menu-title">TIZIM</h6>
                    {{-- <ul class="nav nav-pills nav-sidebar flex-column" role="menubar">
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.settings') }}" 
                               class="nav-link {{ request()->routeIs('admin.settings*') ? 'active' : '' }}"
                               role="menuitem"
                               aria-current="{{ request()->routeIs('admin.settings*') ? 'page' : 'false' }}">
                                <i class="fas fa-cog nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Sozlamalar</span>
                            </a>
                        </li>
                        <li class="nav-item" role="none">
                            <a href="{{ route('admin.users') }}" 
                               class="nav-link {{ request()->routeIs('admin.users*') ? 'active' : '' }}"
                               role="menuitem"
                               aria-current="{{ request()->routeIs('admin.users*') ? 'page' : 'false' }}">
                                <i class="fas fa-users nav-icon" aria-hidden="true"></i>
                                <span class="nav-text">Foydalanuvchilar</span>
                            </a>
                        </li>
                    </ul> --}}
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <div id="content" class="content">
            <!-- Top Navigation -->
            <nav class="navbar navbar-expand-lg navbar-light topbar">
                <div class="container-fluid">
                    <button type="button" id="sidebarCollapseTop"
                        class="btn btn-outline-primary btn-sm me-3 d-md-none" aria-label="Yon panelni ochish">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                    </button>

                    <h1 class="navbar-brand mb-0 h4">@yield('page-title', 'Boshqaruv Paneli')</h1>

                    <div class="navbar-nav ms-auto">
                        <!-- Notifications -->
                        <div class="nav-item dropdown me-3">
                            <a class="nav-link position-relative" href="#" id="notificationDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false"
                                aria-label="Bildirishnomalar">
                                <i class="fas fa-bell fs-5" aria-hidden="true"></i>
                                <span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    3
                                    <span class="visually-hidden">o'qilmagan bildirishnomalar</span>
                                </span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                                <li>
                                    <h6 class="dropdown-header">Bildirishnomalar</h6>
                                </li>
                                <li><a class="dropdown-item" href="#">Yangi talaba qo'shildi</a></li>
                                <li><a class="dropdown-item" href="#">Vazifa topshirildi</a></li>
                                <li><a class="dropdown-item" href="#">Tizim yangilandi</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item text-center" href="#">Barchasini ko'rish</a></li>
                            </ul>
                        </div>

                        <!-- User Profile -->
                        <div class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle profile-dropdown d-flex align-items-center"
                                href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false" aria-label="Foydalanuvchi menyusi">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                    class="rounded-circle me-2" width="32" height="32"
                                    alt="Foydalanuvchi rasmi">
                                <span class="d-none d-md-inline">{{ Auth::user()->name ?? 'Administrator' }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li>
                                    <a class="dropdown-item" href="{{ route('profile.edit') }}">
                                        <i class="fas fa-user me-2" aria-hidden="true"></i>Profil
                                    </a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <form method="POST" action="{{ route('logout') }}" class="d-inline">
                                        @csrf
                                        <button type="submit" class="dropdown-item">
                                            <i class="fas fa-sign-out-alt me-2" aria-hidden="true"></i>Chiqish
                                        </button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Main Content Area -->
            <main class="main-content" role="main">
                <div class="container-fluid">
                    <!-- Success Alert -->
                    @if (session('success'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
                            {{ session('success') }}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"
                                aria-label="Ogohlantirishni yopish"></button>
                        </div>
                    @endif

                    <!-- Error Alert -->
                    @if (session('error'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
                            {{ session('error') }}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"
                                aria-label="Ogohlantirishni yopish"></button>
                        </div>
                    @endif

                    <!-- Validation Errors -->
                    @if ($errors->any())
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
                            <strong>Xatoliklar mavjud:</strong>
                            <ul class="mb-0 mt-2">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"
                                aria-label="Ogohlantirishni yopish"></button>
                        </div>
                    @endif

                    @yield('content')
                </div>
            </main>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous">
    </script>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>


    <!-- Custom JS -->
    <script src="{{ asset('js/admin.js') }}"></script>

    @stack('scripts')
</body>

</html>
