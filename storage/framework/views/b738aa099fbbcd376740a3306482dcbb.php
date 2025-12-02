<?php $__env->startSection('title', 'Customer Login - Billiard Reservation'); ?>

<?php $__env->startSection('content'); ?>
<div class="min-h-screen flex items-center justify-center bg-gradient-cream py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-32 h-32 bg-green-accent rounded-full opacity-10 billiard-ball"></div>
        <div class="absolute bottom-20 right-20 w-48 h-48 bg-green-light rounded-full opacity-10 billiard-ball" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-cream-dark rounded-full opacity-20 billiard-ball" style="animation-delay: 4s;"></div>
    </div>

    <div class="relative max-w-md w-full">
        <div class="glass-effect rounded-3xl shadow-2xl p-8 border border-green-200 animate-fade-in">
            <!-- Logo Section -->
            <div class="text-center mb-8">
                <div class="mx-auto w-24 h-24 bg-gradient-green rounded-3xl flex items-center justify-center shadow-xl billiard-ball mb-4">
                    <span class="text-4xl font-bold text-cream-light">🎱</span>
                </div>
                <h1 class="text-3xl font-bold text-green-dark text-shadow">
                    Welcome Back
                </h1>
                <p class="mt-2 text-green-medium">
                    Sign in to manage your reservations
                </p>
            </div>

            <form class="mt-8 space-y-6" action="<?php echo e(route('customer.login')); ?>" method="POST">
                <?php echo csrf_field(); ?>
                <input type="hidden" name="remember" value="true">

                <div class="space-y-4">
                    <div>
                        <label for="email-address" class="block text-sm font-bold text-green-dark mb-2">Email Address</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-green-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                </svg>
                            </div>
                            <input id="email-address" name="email" type="email" autocomplete="email" required
                                   class="block w-full pl-10 pr-3 py-3 border-2 border-green-200 rounded-xl text-green-dark placeholder-green-medium bg-cream-light focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-transparent transition-all duration-300 hover-lift"
                                   placeholder="Enter your email" value="<?php echo e(old('email')); ?>">
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-bold text-green-dark mb-2">Password</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-green-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <input id="password" name="password" type="password" autocomplete="current-password" required
                                   class="block w-full pl-10 pr-3 py-3 border-2 border-green-200 rounded-xl text-green-dark placeholder-green-medium bg-cream-light focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-transparent transition-all duration-300 hover-lift"
                                   placeholder="Enter your password">
                        </div>
                    </div>
                </div>

                <?php if($errors->any()): ?>
                    <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-slide-in">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <div class="text-sm text-red-700">
                                    <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <p><?php echo e($error); ?></p>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="mt-8">
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-cream bg-gradient-green hover:bg-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent shadow-lg transform hover:scale-105 transition-all duration-300 hover-lift">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-cream-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                            </svg>
                        </span>
                        Sign in
                    </button>
                </div>

                <div class="text-center space-y-4">
                    <p class="text-sm text-green-medium">
                        Don't have an account?
                        <a href="<?php echo e(route('customer.register')); ?>" class="font-bold text-green-dark hover:text-green-accent transition-colors duration-300 hover:underline">
                            Create one here
                        </a>
                    </p>
                    <div class="border-t border-green-200 pt-4">
                        <a href="<?php echo e(route('admin.login')); ?>" class="text-sm text-green-medium hover:text-green-dark transition-colors duration-300 hover:underline font-medium">
                            🔒 Admin access? Sign in here
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/adrianobawan/Study/Iyan/Projek/antrian-billiard/resources/views/auth/customer-login.blade.php ENDPATH**/ ?>