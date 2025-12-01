<?php $__env->startSection('title', 'My Reservations - Billiard Reservation'); ?>

<?php $__env->startSection('content'); ?>
<div class="max-w-7xl mx-auto">
    <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">My Reservations</h1>
        </div>

        <div class="p-6">
            <?php if($reservations->count() > 0): ?>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reservation
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Table
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cost
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <?php $__currentLoopData = $reservations; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $reservation): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        #<?php echo e(substr($reservation->id, 0, 8)); ?>

                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div class="text-sm font-medium text-gray-900"><?php echo e($reservation->table->table_number); ?></div>
                                            <div class="text-sm text-gray-500"><?php echo e($reservation->table->tableType->name); ?></div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <?php echo e($reservation->reservation_time->format('M j, Y')); ?>

                                        <br>
                                        <?php echo e($reservation->reservation_time->format('g:i A')); ?>

                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <?php echo e($reservation->duration_hours); ?> hour(s)
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                            <?php if($reservation->status === 'confirmed'): ?> bg-green-100 text-green-800
                                            <?php elseif($reservation->status === 'pending'): ?> bg-yellow-100 text-yellow-800
                                            <?php elseif($reservation->status === 'completed'): ?> bg-blue-100 text-blue-800
                                            <?php else: ?> bg-red-100 text-red-800 <?php endif; ?>">
                                            <?php echo e(ucfirst($reservation->status)); ?>

                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <?php if($reservation->promo): ?>
                                            <div class="text-green-600">$<?php echo e(number_format($reservation->calculateCost(), 2)); ?></div>
                                            <div class="text-xs text-gray-500 line-through">$<?php echo e(number_format($reservation->table->tableType->hourly_rate * $reservation->duration_hours, 2)); ?></div>
                                        <?php else: ?>
                                            $<?php echo e(number_format($reservation->calculateCost(), 2)); ?>

                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <?php if($reservation->payment): ?>
                                            <div class="text-green-600">Paid</div>
                                            <div class="text-xs text-gray-500"><?php echo e(ucfirst(str_replace('_', ' ', $reservation->payment->payment_method))); ?></div>
                                        <?php else: ?>
                                            <div class="text-yellow-600">Pending</div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a href="<?php echo e(route('customer.reservations.show', $reservation->id)); ?>"
                                           class="text-blue-600 hover:text-blue-900 mr-3">
                                            View
                                        </a>

                                        <?php if($reservation->status === 'pending' && !$reservation->payment): ?>
                                            <?php if($reservation->reservation_time->diffInHours(now()) >= 2): ?>
                                                <form action="<?php echo e(route('customer.reservations.cancel', $reservation->id)); ?>" method="POST" class="inline">
                                                    <?php echo csrf_field(); ?>
                                                    <button type="submit" class="text-red-600 hover:text-red-900"
                                                            onclick="return confirm('Are you sure you want to cancel this reservation?')">
                                                        Cancel
                                                    </button>
                                                </form>
                                            <?php endif; ?>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <?php echo e($reservations->links()); ?>

            <?php else: ?>
                <div class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No reservations</h3>
                    <p class="mt-1 text-sm text-gray-500">You haven't made any reservations yet.</p>
                    <div class="mt-6">
                        <a href="<?php echo e(route('customer.reservations.create')); ?>"
                           class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Book Your First Table
                        </a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/adrianobawan/Study/Iyan/Projek/antrian-billiard/resources/views/customer/my_reservations.blade.php ENDPATH**/ ?>