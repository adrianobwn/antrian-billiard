@extends('layouts.app')

@section('title', 'Admin Dashboard - Billiard Reservation')

@section('content')
<div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="mt-2 text-gray-600">Overview of your billiard reservation system</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Today's Income -->
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Today's Income</p>
                    <p class="text-2xl font-semibold text-gray-900">${{ number_format($todayIncome, 2) }}</p>
                </div>
            </div>
        </div>

        <!-- Today's Reservations -->
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Today's Reservations</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ $todayReservations }}</p>
                </div>
            </div>
        </div>

        <!-- Active Reservations -->
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Active Reservations</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ $activeReservations }}</p>
                </div>
            </div>
        </div>

        <!-- Total Customers -->
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 rounded-full p-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Total Customers</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ $totalCustomers }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Additional Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Table Status -->
        <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Table Status</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-green-50 rounded-lg">
                    <p class="text-2xl font-semibold text-green-600">{{ $availableTables }}</p>
                    <p class="text-sm text-gray-600">Available</p>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <p class="text-2xl font-semibold text-gray-600">{{ $totalTables - $availableTables }}</p>
                    <p class="text-sm text-gray-600">Occupied/Maintenance</p>
                </div>
            </div>
            <div class="mt-4">
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Availability</span>
                    <span class="font-medium">{{ $totalTables > 0 ? round(($availableTables / $totalTables) * 100) : 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: {{ $totalTables > 0 ? round(($availableTables / $totalTables) * 100) : 0 }}%"></div>
                </div>
            </div>
        </div>

        <!-- Weekly Income -->
        <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Weekly Income (Last 7 Days)</h3>
            <div class="text-center">
                <p class="text-3xl font-bold text-green-600">${{ number_format($weeklyIncome, 2) }}</p>
                <p class="text-sm text-gray-600 mt-2">Total revenue this week</p>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Reservations -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Recent Reservations</h3>
            </div>
            <div class="p-6">
                @if($recentReservations->count() > 0)
                    <div class="space-y-4">
                        @foreach($recentReservations as $reservation)
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div class="flex items-center">
                                        <span class="font-medium text-gray-900">{{ $reservation->customer_name }}</span>
                                        <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full
                                            @if($reservation->reservation_status === 'confirmed') bg-green-100 text-green-800
                                            @elseif($reservation->reservation_status === 'pending') bg-yellow-100 text-yellow-800
                                            @elseif($reservation->reservation_status === 'completed') bg-blue-100 text-blue-800
                                            @else bg-red-100 text-red-800 @endif">
                                            {{ ucfirst($reservation->reservation_status) }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600">
                                        Table {{ $reservation->table_number }} • {{ $reservation->reservation_time->format('M j, g:i A') }}
                                    </p>
                                </div>
                                <a href="{{ route('admin.reservations.show', $reservation->reservation_id) }}"
                                   class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                    View
                                </a>
                            </div>
                        @endforeach
                    </div>
                    <div class="mt-4">
                        <a href="{{ route('admin.reservations.index') }}" class="text-sm font-medium text-blue-600 hover:text-blue-500">
                            View all reservations →
                        </a>
                    </div>
                @else
                    <div class="text-center py-8">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p class="mt-2 text-sm text-gray-600">No recent reservations</p>
                    </div>
                @endif
            </div>
        </div>

        <!-- Popular Table Types -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Popular Table Types</h3>
            </div>
            <div class="p-6">
                @if($popularTableTypes->count() > 0)
                    <div class="space-y-4">
                        @foreach($popularTableTypes as $tableType)
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <span class="font-medium text-gray-900">{{ $tableType->name }}</span>
                                    <p class="text-sm text-gray-600">{{ $tableType->booking_count }} bookings</p>
                                </div>
                                <div class="text-right">
                                    <div class="w-24 bg-gray-200 rounded-full h-2">
                                        <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $popularTableTypes->max('booking_count') > 0 ? round(($tableType->booking_count / $popularTableTypes->max('booking_count')) * 100) : 0 }}%"></div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-8">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <p class="mt-2 text-sm text-gray-600">No table type data available</p>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection