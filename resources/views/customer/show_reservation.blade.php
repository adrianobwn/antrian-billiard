@extends('layouts.app')

@section('title', 'Reservation Details - Billiard Reservation')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Reservation Details</h1>
        </div>

        @if ($reservation->status === 'cancelled')
            <div class="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">This reservation has been cancelled</p>
                    </div>
                </div>
            </div>
        @endif

        <!-- Reservation Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="space-y-4">
                <h2 class="text-lg font-semibold text-gray-900">Booking Information</h2>

                <div>
                    <span class="text-sm font-medium text-gray-500">Reservation ID</span>
                    <p class="text-lg">{{ $reservation->id }}</p>
                </div>

                <div>
                    <span class="text-sm font-medium text-gray-500">Table</span>
                    <p class="text-lg">{{ $reservation->table->table_number }} - {{ $reservation->table->tableType->name }}</p>
                </div>

                <div>
                    <span class="text-sm font-medium text-gray-500">Location</span>
                    <p class="text-lg">{{ $reservation->table->location }}</p>
                </div>

                <div>
                    <span class="text-sm font-medium text-gray-500">Reservation Time</span>
                    <p class="text-lg">{{ $reservation->reservation_time->format('M j, Y \a\t g:i A') }}</p>
                </div>

                <div>
                    <span class="text-sm font-medium text-gray-500">Duration</span>
                    <p class="text-lg">{{ $reservation->duration_hours }} hour(s)</p>
                </div>

                <div>
                    <span class="text-sm font-medium text-gray-500">Status</span>
                    <p>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold
                            @if($reservation->status === 'confirmed') bg-green-100 text-green-800
                            @elseif($reservation->status === 'pending') bg-yellow-100 text-yellow-800
                            @elseif($reservation->status === 'completed') bg-blue-100 text-blue-800
                            @else bg-red-100 text-red-800 @endif">
                            {{ ucfirst($reservation->status) }}
                        </span>
                    </p>
                </div>
            </div>

            <div class="space-y-4">
                <h2 class="text-lg font-semibold text-gray-900">Payment Information</h2>

                @if($reservation->payment)
                    <div>
                        <span class="text-sm font-medium text-gray-500">Payment Method</span>
                        <p class="text-lg">{{ ucfirst(str_replace('_', ' ', $reservation->payment->payment_method)) }}</p>
                    </div>

                    <div>
                        <span class="text-sm font-medium text-gray-500">Amount Paid</span>
                        <p class="text-lg font-semibold text-green-600">${{ number_format($reservation->payment->amount, 2) }}</p>
                    </div>

                    <div>
                        <span class="text-sm font-medium text-gray-500">Payment Date</span>
                        <p class="text-lg">{{ $reservation->payment->payment_date->format('M j, Y \a\t g:i A') }}</p>
                    </div>
                @else
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-yellow-700">Payment not completed yet</p>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Price Breakdown -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span>Base Cost ({{ $reservation->duration_hours }}h × ${{ number_format($reservation->table->tableType->hourly_rate, 2) }}/h)</span>
                            <span>${{ number_format($reservation->table->tableType->hourly_rate * $reservation->duration_hours, 2) }}</span>
                        </div>
                        @if($reservation->promo)
                            <div class="flex justify-between text-green-600">
                                <span>Promo Discount ({{ $reservation->promo->discount_percent }}%)</span>
                                <span>-${{ number_format(($reservation->table->tableType->hourly_rate * $reservation->duration_hours) * ($reservation->promo->discount_percent / 100), 2) }}</span>
                            </div>
                        @endif
                        <div class="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total Cost</span>
                            <span class="text-green-600">${{ number_format($reservation->calculateCost(), 2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center border-t pt-6">
            <div>
                <a href="{{ route('customer.reservations.my') }}" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back to My Reservations
                </a>
            </div>

            <div class="flex space-x-3">
                @if($reservation->status === 'pending' && !$reservation->payment)
                    <form action="{{ route('customer.reservations.cancel', $reservation->id) }}" method="POST" class="inline">
                        @csrf
                        @if($reservation->reservation_time->diffInHours(now()) >= 2)
                            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Cancel Reservation
                            </button>
                        @else
                            <button type="button" disabled class="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed" title="Cannot cancel less than 2 hours before start time">
                                Cannot Cancel (Too Late)
                            </button>
                        @endif
                    </form>

                    <form action="{{ route('customer.reservations.pay', $reservation->id) }}" method="POST" class="inline">
                        @csrf
                        <div class="flex space-x-2">
                            <select name="payment_method" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="">Select Method</option>
                                <option value="cash">Cash</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="transfer">Bank Transfer</option>
                                <option value="ewallet">E-Wallet</option>
                            </select>
                            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Pay Now
                            </button>
                        </div>
                    </form>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection