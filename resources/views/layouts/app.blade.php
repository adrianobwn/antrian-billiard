<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Billiard Reservation System')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'green-dark': '#0f4c0f',
                        'green-medium': '#1a5c1a',
                        'green-light': '#2d7a2d',
                        'green-accent': '#4ade80',
                        'cream': '#faf6f0',
                        'cream-light': '#fefdfb',
                        'cream-medium': '#f5ede2',
                        'cream-dark': '#e8dcc0'
                    },
                    animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'slide-in': 'slideIn 0.5s ease-out',
                        'fade-in': 'fadeIn 0.8s ease-out'
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' }
                        },
                        slideIn: {
                            '0%': { transform: 'translateX(-100%)', opacity: '0' },
                            '100%': { transform: 'translateX(0)', opacity: '1' }
                        },
                        fadeIn: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        }
                    },
                    backgroundImage: {
                        'gradient-green': 'linear-gradient(135deg, #0f4c0f 0%, #1a5c1a 50%, #2d7a2d 100%)',
                        'gradient-cream': 'linear-gradient(135deg, #faf6f0 0%, #f5ede2 50%, #fefdfb 100%)'
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background: linear-gradient(135deg, #faf6f0 0%, #f5ede2 100%);
            min-height: 100vh;
        }

        .glass-effect {
            background: rgba(250, 246, 240, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(232, 220, 192, 0.3);
        }

        .green-glass {
            background: rgba(15, 76, 15, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(74, 222, 128, 0.3);
        }

        .billiard-ball {
            animation: float 6s ease-in-out infinite;
        }

        .shadow-glow {
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
        }

        .text-shadow {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hover-lift {
            transition: all 0.3s ease;
        }

        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(15, 76, 15, 0.3);
        }

        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .bounce-gentle {
            animation: bounce-gentle 3s ease-in-out infinite;
        }
    </style>
    @stack('styles')
</head>
<body class="bg-gradient-cream">
    <div x-data="{ mobileMenu: false }">
        <!-- Navigation -->
        @auth('web')
        <!-- Customer Navigation -->
        <nav class="bg-gradient-green text-cream shadow-2xl border-b-4 border-green-800 relative overflow-hidden">
            <div class="absolute inset-0 bg-black opacity-20"></div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="{{ route('customer.dashboard') }}" class="text-xl font-bold text-cream-light hover-lift flex items-center space-x-2">
                            <div class="w-8 h-8 bg-green-accent rounded-full billiard-ball shadow-glow"></div>
                            <span class="text-shadow">Billiard Reservation</span>
                        </a>
                    </div>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="{{ route('customer.dashboard') }}" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                            Dashboard
                        </a>
                        <a href="{{ route('customer.reservations.create') }}" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                            Book Table
                        </a>
                        <a href="{{ route('customer.reservations.my') }}" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                            My Reservations
                        </a>
                        <div class="relative" x-data="{ dropdown: false }">
                            <button @click="dropdown = !dropdown" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium flex items-center">
                                {{ Auth::guard('web')->user()->name }}
                                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div x-show="dropdown" @click.away="dropdown = false"
                                 x-transition:enter="transition ease-out duration-200"
                                 x-transition:enter-start="transform opacity-0 scale-95"
                                 x-transition:enter-end="transform opacity-100 scale-100"
                                 class="absolute right-0 mt-2 w-48 glass-effect rounded-lg shadow-2xl py-1 z-50 border border-cream-dark">
                                <a href="#" class="block px-4 py-2 text-sm text-green-dark hover:bg-green-accent hover:text-cream rounded transition-all duration-200">Profile</a>
                                <form action="{{ route('customer.logout') }}" method="POST">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-green-dark hover:bg-green-accent hover:text-cream rounded transition-all duration-200">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile menu button -->
                    <div class="md:hidden flex items-center">
                        <button @click="mobileMenu = !mobileMenu" class="text-cream hover:text-green-accent transition-all duration-300">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div x-show="mobileMenu" x-transition:enter="transition ease-out duration-200" class="md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="{{ route('customer.dashboard') }}" class="block px-3 py-2 text-cream hover:bg-green-accent hover:text-green-dark rounded-lg transition-all duration-200 font-medium">Dashboard</a>
                        <a href="{{ route('customer.reservations.create') }}" class="block px-3 py-2 text-cream hover:bg-green-accent hover:text-green-dark rounded-lg transition-all duration-200 font-medium">Book Table</a>
                        <a href="{{ route('customer.reservations.my') }}" class="block px-3 py-2 text-cream hover:bg-green-accent hover:text-green-dark rounded-lg transition-all duration-200 font-medium">My Reservations</a>
                        <form action="{{ route('customer.logout') }}" method="POST">
                            @csrf
                            <button type="submit" class="block w-full text-left px-3 py-2 text-cream hover:bg-green-accent hover:text-green-dark rounded-lg transition-all duration-200 font-medium">Logout</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
        @endauth

        @auth('admin')
        <!-- Admin Navigation -->
        <nav class="bg-gradient-green text-cream shadow-2xl border-b-4 border-green-800 relative overflow-hidden">
            <div class="absolute inset-0 bg-black opacity-25"></div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="{{ route('admin.dashboard') }}" class="text-xl font-bold text-cream-light hover-lift flex items-center space-x-2">
                            <div class="w-8 h-8 bg-green-800 rounded-lg bounce-gentle"></div>
                            <span class="text-shadow">Admin Dashboard</span>
                        </a>
                    </div>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="{{ route('admin.dashboard') }}" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                            Dashboard
                        </a>
                        <a href="{{ route('admin.reservations.index') }}" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                            Reservations
                        </a>
                        <div class="relative" x-data="{ dropdown: false }">
                            <button @click="dropdown = !dropdown" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium flex items-center">
                                Management
                                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div x-show="dropdown" @click.away="dropdown = false"
                                 x-transition:enter="transition ease-out duration-200"
                                 x-transition:enter-start="transform opacity-0 scale-95"
                                 x-transition:enter-end="transform opacity-100 scale-100"
                                 class="absolute left-0 mt-2 glass-effect rounded-lg shadow-2xl py-1 z-50 border border-cream-dark">
                                <a href="{{ route('admin.table-types.index') }}" class="block px-4 py-2 text-sm text-green-dark hover:bg-green-accent hover:text-cream rounded transition-all duration-200">Table Types</a>
                                <a href="{{ route('admin.tables.index') }}" class="block px-4 py-2 text-sm text-green-dark hover:bg-green-accent hover:text-cream rounded transition-all duration-200">Tables</a>
                                <a href="{{ route('admin.promos.index') }}" class="block px-4 py-2 text-sm text-green-dark hover:bg-green-accent hover:text-cream rounded transition-all duration-200">Promos</a>
                            </div>
                        </div>
                        <a href="{{ route('admin.reports') }}" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                            Reports
                        </a>
                        <div class="relative" x-data="{ dropdown: false }">
                            <button @click="dropdown = !dropdown" class="text-cream hover:text-green-accent transition-all duration-300 hover:scale-110 font-medium">
                                {{ Auth::guard('admin')->user()->name }}
                                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div x-show="dropdown" @click.away="dropdown = false"
                                 x-transition:enter="transition ease-out duration-200"
                                 x-transition:enter-start="transform opacity-0 scale-95"
                                 x-transition:enter-end="transform opacity-100 scale-100"
                                 class="absolute right-0 mt-2 glass-effect rounded-lg shadow-2xl py-1 z-50 border border-cream-dark">
                                <form action="{{ route('admin.logout') }}" method="POST">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-green-dark hover:bg-green-accent hover:text-cream rounded transition-all duration-200">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        @endauth

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div class="glass-effect rounded-2xl p-6 shadow-xl">
                @yield('content')
            </div>
        </main>

        <!-- Flash Messages -->
        @if(session()->has('success'))
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="transform translate-x-full opacity-0"
                 x-transition:enter-end="transform translate-x-0 opacity-100"
                 x-transition:leave="transition ease-in duration-300"
                 x-transition:leave-start="transform translate-x-0 opacity-100"
                 x-transition:leave-end="transform translate-x-full opacity-0"
                 class="fixed top-4 right-4 bg-green-accent text-green-dark px-6 py-4 rounded-xl shadow-2xl z-50 border-2 border-green-light hover-lift">
                <div class="flex items-center space-x-3">
                    <svg class="w-6 h-6 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium">{{ session('success') }}</span>
                </div>
            </div>
        @endif

        @if(session()->has('error'))
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="transform translate-x-full opacity-0"
                 x-transition:enter-end="transform translate-x-0 opacity-100"
                 x-transition:leave="transition ease-in duration-300"
                 x-transition:leave-start="transform translate-x-0 opacity-100"
                 x-transition:leave-end="transform translate-x-full opacity-0"
                 class="fixed top-4 right-4 bg-red-500 text-cream px-6 py-4 rounded-xl shadow-2xl z-50 border-2 border-red-600 hover-lift">
                <div class="flex items-center space-x-3">
                    <svg class="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium">{{ session('error') }}</span>
                </div>
            </div>
        @endif
    </div>

    @stack('scripts')
</body>
</html>