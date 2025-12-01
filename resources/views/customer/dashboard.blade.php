@extends('layouts.app')

@section('title', 'Customer Dashboard - Billiard Reservation')

@section('content')
<div class="max-w-7xl mx-auto">
    <!-- Welcome Section -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ Auth::guard('web')->user()->name }}!</h1>
        <p class="mt-1 text-gray-600">Manage your billiard reservations and bookings</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Book a Table</h3>
                    <p class="text-sm text-gray-600">Reserve a billiard table</p>
                </div>
            </div>
            <div class="mt-4">
                <a href="{{ route('customer.reservations.create') }}"
                   class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Book Now
                </a>
            </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">My Reservations</h3>
                    <p class="text-sm text-gray-600">View your bookings</p>
                </div>
            </div>
            <div class="mt-4">
                <a href="{{ route('customer.reservations.my') }}"
                   class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    View All
                </a>
            </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Payment History</h3>
                    <p class="text-sm text-gray-600">Track your payments</p>
                </div>
            </div>
            <div class="mt-4">
                <button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    Coming Soon
                </button>
            </div>
        </div>
    </div>

    <!-- Recent Reservations -->
    <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Recent Reservations</h2>
        </div>
        <div class="p-6">
            @if($recentReservations->count() > 0)
                <div class="space-y-4">
                    @foreach($recentReservations as $reservation)
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div class="flex-1">
                                <div class="flex items-center">
                                    <h3 class="text-sm font-medium text-gray-900">
                                        Table {{ $reservation->table->table_number }} - {{ $reservation->table->tableType->name }}
                                    </h3>
                                    <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full
                                        @if($reservation->status === 'confirmed') bg-green-100 text-green-800
                                        @elseif($reservation->status === 'pending') bg-yellow-100 text-yellow-800
                                        @elseif($reservation->status === 'completed') bg-blue-100 text-blue-800
                                        @else bg-red-100 text-red-800 @endif">
                                        {{ ucfirst($reservation->status) }}
                                    </span>
                                </div>
                                <p class="mt-1 text-sm text-gray-500">
                                    {{ $reservation->reservation_time->format('M j, Y \a\t g:i A') }} • {{ $reservation->duration_hours }} hour(s)
                                </p>
                                <p class="mt-1 text-sm font-medium text-gray-900">
                                    ${{ number_format($reservation->calculateCost(), 2) }}
                                    @if($reservation->payment)
                                        <span class="ml-2 text-green-600">• Paid</span>
                                    @else
                                        <span class="ml-2 text-yellow-600">• Payment Pending</span>
                                    @endif
                                </p>
                            </div>
                            <div class="ml-4">
                                <a href="{{ route('customer.reservations.show', $reservation->id) }}"
                                   class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                                    View Details
                                </a>
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="mt-6 text-center">
                    <a href="{{ route('customer.reservations.my') }}" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all reservations →
                    </a>
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No reservations yet</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by booking your first table.</p>
                    <div class="mt-6">
                        <a href="{{ route('customer.reservations.create') }}"
                           class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Book Your First Table
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection