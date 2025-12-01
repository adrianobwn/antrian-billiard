<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $__env->yieldContent('title', 'Billiard Reservation System'); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <?php echo $__env->yieldPushContent('styles'); ?>
</head>
<body class="bg-gray-50">
    <div x-data="{ mobileMenu: false }">
        <!-- Navigation -->
        <?php if(auth()->guard('web')->check()): ?>
        <!-- Customer Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="<?php echo e(route('customer.dashboard')); ?>" class="text-xl font-bold">
                            Billiard Reservation
                        </a>
                    </div>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="<?php echo e(route('customer.dashboard')); ?>" class="hover:text-blue-200 transition">
                            Dashboard
                        </a>
                        <a href="<?php echo e(route('customer.reservations.create')); ?>" class="hover:text-blue-200 transition">
                            Book Table
                        </a>
                        <a href="<?php echo e(route('customer.reservations.my')); ?>" class="hover:text-blue-200 transition">
                            My Reservations
                        </a>
                        <div class="relative" x-data="{ dropdown: false }">
                            <button @click="dropdown = !dropdown" class="hover:text-blue-200 transition">
                                <?php echo e(Auth::guard('web')->user()->name); ?>

                                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div x-show="dropdown" @click.away="dropdown = false"
                                 x-transition:enter="transition ease-out duration-100"
                                 x-transition:enter-start="transform opacity-0 scale-95"
                                 x-transition:enter-end="transform opacity-100 scale-100"
                                 class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                <form action="<?php echo e(route('customer.logout')); ?>" method="POST">
                                    <?php echo csrf_field(); ?>
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile menu button -->
                    <div class="md:hidden flex items-center">
                        <button @click="mobileMenu = !mobileMenu" class="hover:text-blue-200">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div x-show="mobileMenu" x-transition class="md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="<?php echo e(route('customer.dashboard')); ?>" class="block px-3 py-2 hover:bg-blue-700 rounded">Dashboard</a>
                        <a href="<?php echo e(route('customer.reservations.create')); ?>" class="block px-3 py-2 hover:bg-blue-700 rounded">Book Table</a>
                        <a href="<?php echo e(route('customer.reservations.my')); ?>" class="block px-3 py-2 hover:bg-blue-700 rounded">My Reservations</a>
                        <form action="<?php echo e(route('customer.logout')); ?>" method="POST">
                            <?php echo csrf_field(); ?>
                            <button type="submit" class="block w-full text-left px-3 py-2 hover:bg-blue-700 rounded">Logout</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
        <?php endif; ?>

        <?php if(auth()->guard('admin')->check()): ?>
        <!-- Admin Navigation -->
        <nav class="bg-gray-800 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="<?php echo e(route('admin.dashboard')); ?>" class="text-xl font-bold">
                            Admin Dashboard
                        </a>
                    </div>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="<?php echo e(route('admin.dashboard')); ?>" class="hover:text-gray-300 transition">
                            Dashboard
                        </a>
                        <a href="<?php echo e(route('admin.reservations.index')); ?>" class="hover:text-gray-300 transition">
                            Reservations
                        </a>
                        <div class="relative" x-data="{ dropdown: false }">
                            <button @click="dropdown = !dropdown" class="hover:text-gray-300 transition flex items-center">
                                Management
                                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div x-show="dropdown" @click.away="dropdown = false"
                                 x-transition:enter="transition ease-out duration-100"
                                 x-transition:enter-start="transform opacity-0 scale-95"
                                 x-transition:enter-end="transform opacity-100 scale-100"
                                 class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <a href="<?php echo e(route('admin.table-types.index')); ?>" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Table Types</a>
                                <a href="<?php echo e(route('admin.tables.index')); ?>" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tables</a>
                                <a href="<?php echo e(route('admin.promos.index')); ?>" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Promos</a>
                            </div>
                        </div>
                        <a href="<?php echo e(route('admin.reports')); ?>" class="hover:text-gray-300 transition">
                            Reports
                        </a>
                        <div class="relative" x-data="{ dropdown: false }">
                            <button @click="dropdown = !dropdown" class="hover:text-gray-300 transition">
                                <?php echo e(Auth::guard('admin')->user()->name); ?>

                                <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div x-show="dropdown" @click.away="dropdown = false"
                                 x-transition:enter="transition ease-out duration-100"
                                 x-transition:enter-start="transform opacity-0 scale-95"
                                 x-transition:enter-end="transform opacity-100 scale-100"
                                 class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <form action="<?php echo e(route('admin.logout')); ?>" method="POST">
                                    <?php echo csrf_field(); ?>
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <?php endif; ?>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <?php echo $__env->yieldContent('content'); ?>
        </main>

        <!-- Flash Messages -->
        <?php if(session()->has('success')): ?>
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)"
                 class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                <?php echo e(session('success')); ?>

            </div>
        <?php endif; ?>

        <?php if(session()->has('error')): ?>
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)"
                 class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                <?php echo e(session('error')); ?>

            </div>
        <?php endif; ?>
    </div>

    <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html><?php /**PATH /Users/adrianobawan/Study/Iyan/Projek/antrian-billiard/resources/views/layouts/app.blade.php ENDPATH**/ ?>