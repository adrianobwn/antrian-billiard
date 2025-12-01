<?php $__env->startSection('title', 'Book a Table - Billiard Reservation'); ?>

<?php $__env->startSection('content'); ?>
<div class="max-w-4xl mx-auto">
    <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Book a Table</h1>

        <form x-data="reservationForm()" @submit.prevent="submitForm" action="<?php echo e(route('customer.reservations.store')); ?>" method="POST">
            <?php echo csrf_field(); ?>

            <!-- Table Selection -->
            <div class="mb-6">
                <label for="table_id" class="block text-sm font-medium text-gray-700 mb-2">Select Table</label>
                <select id="table_id" name="table_id" x-model="selectedTable" required
                        @change="updateTableInfo()"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="">Choose a table...</option>
                    <?php $__currentLoopData = $tables; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $table): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($table->id); ?>"
                                data-rate="<?php echo e($table->tableType->hourly_rate); ?>"
                                data-number="<?php echo e($table->table_number); ?>"
                                data-type="<?php echo e($table->tableType->name); ?>">
                            <?php echo e($table->table_number); ?> - <?php echo e($table->tableType->name); ?> (<?php echo e($table->tableType->category); ?>) - $<?php echo e(number_format($table->tableType->hourly_rate, 2)); ?>/hour
                        </option>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </select>

                <?php $__errorArgs = ['table_id'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                    <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
                <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
            </div>

            <!-- Table Info Display -->
            <div x-show="selectedTable" x-transition class="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-blue-900 mb-2">Selected Table Details:</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium">Table Number:</span>
                        <span x-text="tableInfo.number"></span>
                    </div>
                    <div>
                        <span class="font-medium">Type:</span>
                        <span x-text="tableInfo.type"></span>
                    </div>
                    <div>
                        <span class="font-medium">Hourly Rate:</span>
                        <span>$<span x-text="tableInfo.rate"></span></span>
                    </div>
                </div>
            </div>

            <!-- Date and Time -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="reservation_time" class="block text-sm font-medium text-gray-700 mb-2">Date and Time</label>
                    <input type="datetime-local" id="reservation_time" name="reservation_time"
                           x-model="reservationTime" required
                           @change="calculateTotal()"
                           min="<?php echo e(now()->format('Y-m-d\TH:i')); ?>"
                           class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <?php $__errorArgs = ['reservation_time'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                        <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
                    <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                </div>

                <div>
                    <label for="duration_hours" class="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                    <select id="duration_hours" name="duration_hours" x-model="duration" required
                            @change="calculateTotal()"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">Select duration...</option>
                        <option value="1">1 hour</option>
                        <option value="2">2 hours</option>
                        <option value="3">3 hours</option>
                        <option value="4">4 hours</option>
                        <option value="5">5 hours</option>
                        <option value="6">6 hours</option>
                        <option value="7">7 hours</option>
                        <option value="8">8 hours</option>
                    </select>
                    <?php $__errorArgs = ['duration_hours'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                        <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
                    <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                </div>
            </div>

            <!-- Promo Code -->
            <div class="mb-6">
                <label for="promo_code" class="block text-sm font-medium text-gray-700 mb-2">Promo Code (Optional)</label>
                <div class="flex space-x-4">
                    <input type="text" id="promo_code" name="promo_code"
                           x-model="promoCode"
                           @change="applyPromo()"
                           placeholder="Enter promo code"
                           class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <button type="button" @click="applyPromo()"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                        Apply
                    </button>
                </div>
                <?php $__errorArgs = ['promo_code'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                    <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
                <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                <div x-show="promoMessage" x-text="promoMessage"
                     :class="promoSuccess ? 'text-green-600' : 'text-red-600'"
                     class="mt-1 text-sm"></div>
            </div>

            <!-- Price Calculation -->
            <div x-show="tableInfo.rate && duration" x-transition class="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 class="font-semibold text-green-900 mb-2">Price Calculation:</h3>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span>Base Cost (<span x-text="duration"></span> hours × $<span x-text="tableInfo.rate"></span>/hour):</span>
                        <span>$<span x-text="baseCost"></span></span>
                    </div>
                    <div x-show="discount > 0" class="flex justify-between text-green-600">
                        <span>Discount (<span x-text="discountPercent"></span>%):</span>
                        <span>-$<span x-text="discount"></span></span>
                    </div>
                    <div class="flex justify-between font-semibold text-lg">
                        <span>Total Cost:</span>
                        <span>$<span x-text="totalCost"></span></span>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <button type="submit"
                        :disabled="!canSubmit"
                        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Create Reservation
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function reservationForm() {
    return {
        selectedTable: '',
        tableInfo: {
            number: '',
            type: '',
            rate: 0
        },
        reservationTime: '',
        duration: '',
        promoCode: '',
        promoMessage: '',
        promoSuccess: false,
        availablePromos: <?php echo json_encode($promos->map(function($promo) {
            return ['code' => $promo->code, 'discount' => $promo->discount_percent];
        }), 512) ?>,

        baseCost: 0,
        discount: 0,
        discountPercent: 0,
        totalCost: 0,

        updateTableInfo() {
            const select = document.getElementById('table_id');
            const option = select.options[select.selectedIndex];

            if (option.value) {
                this.tableInfo = {
                    number: option.dataset.number,
                    type: option.dataset.type,
                    rate: parseFloat(option.dataset.rate)
                };
            } else {
                this.tableInfo = { number: '', type: '', rate: 0 };
            }
            this.calculateTotal();
        },

        applyPromo() {
            const promo = this.availablePromos.find(p => p.code === this.promoCode.toUpperCase());

            if (promo) {
                this.discountPercent = promo.discount;
                this.promoMessage = `Promo applied! ${promo.discount}% discount`;
                this.promoSuccess = true;
                this.calculateTotal();
            } else if (this.promoCode) {
                this.discountPercent = 0;
                this.promoMessage = 'Invalid promo code';
                this.promoSuccess = false;
                this.calculateTotal();
            } else {
                this.discountPercent = 0;
                this.promoMessage = '';
                this.calculateTotal();
            }
        },

        calculateTotal() {
            if (this.tableInfo.rate && this.duration) {
                this.baseCost = this.tableInfo.rate * this.duration;
                this.discount = this.baseCost * (this.discountPercent / 100);
                this.totalCost = this.baseCost - this.discount;
            } else {
                this.baseCost = 0;
                this.discount = 0;
                this.totalCost = 0;
            }
        },

        get canSubmit() {
            return this.selectedTable && this.reservationTime && this.duration;
        },

        submitForm() {
            if (!this.canSubmit) return;

            // Let the form submit normally
            this.$el.submit();
        }
    }
}
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/adrianobawan/Study/Iyan/Projek/antrian-billiard/resources/views/customer/create_reservation.blade.php ENDPATH**/ ?>