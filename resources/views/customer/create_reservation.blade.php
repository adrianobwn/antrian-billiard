@extends('layouts.app')

@section('title', 'Book a Table - Billiard Reservation')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Book a Table</h1>

        <form x-data="reservationForm()" @submit.prevent="submitForm" action="{{ route('customer.reservations.store') }}" method="POST">
            @csrf

            <!-- Table Selection -->
            <div class="mb-6">
                <label for="table_id" class="block text-sm font-medium text-gray-700 mb-2">Select Table</label>
                <select id="table_id" name="table_id" x-model="selectedTable" required
                        @change="updateTableInfo()"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="">Choose a table...</option>
                    @foreach($tables as $table)
                        <option value="{{ $table->id }}"
                                data-rate="{{ $table->tableType->hourly_rate }}"
                                data-number="{{ $table->table_number }}"
                                data-type="{{ $table->tableType->name }}">
                            {{ $table->table_number }} - {{ $table->tableType->name }} ({{ $table->tableType->category }}) - ${{ number_format($table->tableType->hourly_rate, 2) }}/hour
                        </option>
                    @endforeach
                </select>

                @error('table_id')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
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
                           min="{{ now()->format('Y-m-d\TH:i') }}"
                           class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    @error('reservation_time')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
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
                    @error('duration_hours')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
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
                @error('promo_code')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
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
        availablePromos: @json($promos->map(function($promo) {
            return ['code' => $promo->code, 'discount' => $promo->discount_percent];
        })),

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
@endsection