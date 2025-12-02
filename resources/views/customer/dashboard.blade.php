@extends('layouts.app')

@section('title', 'Customer Dashboard - Billiard Reservation')

@section('content')
<div class="max-w-7xl mx-auto">
    <!-- Welcome Section -->
    <div class="glass-effect rounded-2xl p-8 mb-8 animate-slide-in shadow-glow border border-green-200">
        <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center text-cream-light text-2xl font-bold shadow-lg">
                {{ strtoupper(substr(Auth::guard('web')->user()->name, 0, 1)) }}
            </div>
            <div>
                <h1 class="text-3xl font-bold text-green-dark text-shadow">Welcome back, {{ Auth::guard('web')->user()->name }}!</h1>
                <p class="mt-2 text-green-medium text-lg">Manage your billiard reservations and bookings</p>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="glass-effect rounded-2xl p-6 hover-lift shadow-lg border border-green-200 animate-fade-in" style="animation-delay: 0.1s">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-gradient-green rounded-full p-4 billiard-ball">
                    <svg class="w-6 h-6 text-cream-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-bold text-green-dark">Book a Table</h3>
                    <p class="text-sm text-green-medium">Reserve a billiard table</p>
                </div>
            </div>
            <div class="mt-6">
                <a href="{{ route('customer.reservations.create') }}"
                   class="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-cream font-medium bg-gradient-green hover:bg-green-light transform hover:scale-105 transition-all duration-300">
                    Book Now
                </a>
            </div>
        </div>

        <div class="glass-effect rounded-2xl p-6 hover-lift shadow-lg border border-green-200 animate-fade-in" style="animation-delay: 0.2s">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-accent rounded-full p-4 billiard-ball">
                    <svg class="w-6 h-6 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-bold text-green-dark">My Reservations</h3>
                    <p class="text-sm text-green-medium">View your bookings</p>
                </div>
            </div>
            <div class="mt-6">
                <a href="{{ route('customer.reservations.my') }}"
                   class="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-cream font-medium bg-green-accent hover:bg-green-light transform hover:scale-105 transition-all duration-300">
                    View All
                </a>
            </div>
        </div>

        <div class="glass-effect rounded-2xl p-6 hover-lift shadow-lg border border-green-200 animate-fade-in" style="animation-delay: 0.3s">
            <div class="flex items-center">
                <div class="flex-shrink-0 bg-cream-medium rounded-full p-4 billiard-ball">
                    <svg class="w-6 h-6 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="text-lg font-bold text-green-dark">Payment History</h3>
                    <p class="text-sm text-green-medium">Track your payments</p>
                </div>
            </div>
            <div class="mt-6">
                <button class="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-cream font-medium bg-cream-medium hover:bg-cream-dark text-green-dark transform hover:scale-105 transition-all duration-300">
                    Coming Soon
                </button>
            </div>
        </div>
    </div>

    <!-- Recent Reservations -->
    <div class="glass-effect rounded-2xl shadow-xl border border-green-200 animate-fade-in" style="animation-delay: 0.4s">
        <div class="px-6 py-4 border-b border-green-200 bg-gradient-green text-cream rounded-t-2xl">
            <h2 class="text-xl font-bold text-cream-light flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Recent Reservations
            </h2>
        </div>
        <div class="p-6">
            @if($recentReservations->count() > 0)
                <div class="space-y-4">
                    @foreach($recentReservations as $reservation)
                        <div class="flex items-center justify-between p-4 bg-cream rounded-xl hover-lift shadow-sm border border-cream-medium">
                            <div class="flex-1">
                                <div class="flex items-center">
                                    <h3 class="text-sm font-bold text-green-dark">
                                        🎱 Table {{ $reservation->table->table_number }} - {{ $reservation->table->tableType->name }}
                                    </h3>
                                    <span class="ml-3 px-3 py-1 text-xs font-bold rounded-full
                                        @if($reservation->status === 'confirmed') bg-green-accent text-green-dark shadow-sm
                                        @elseif($reservation->status === 'pending') bg-yellow-400 text-yellow-900 shadow-sm
                                        @elseif($reservation->status === 'completed') bg-blue-400 text-blue-900 shadow-sm
                                        @else bg-red-400 text-red-900 shadow-sm @endif">
                                        {{ ucfirst($reservation->status) }}
                                    </span>
                                </div>
                                <p class="mt-2 text-sm text-green-medium font-medium">
                                    {{ $reservation->reservation_time->format('M j, Y \a\t g:i A') }} • {{ $reservation->duration_hours }} hour(s)
                                </p>
                                <p class="mt-1 text-sm font-bold text-green-dark">
                                    ${{ number_format($reservation->calculateCost(), 2) }}
                                    @if($reservation->payment)
                                        <span class="ml-2 text-green-accent font-medium">✅ Paid</span>
                                    @else
                                        <span class="ml-2 text-yellow-600 font-medium">⏳ Payment Pending</span>
                                    @endif
                                </p>
                            </div>
                            <div class="ml-4">
                                <a href="{{ route('customer.reservations.show', $reservation->id) }}"
                                   class="inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg text-green-dark bg-green-accent hover:bg-green-light transform hover:scale-105 transition-all duration-300">
                                    View Details
                                </a>
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="mt-8 text-center">
                    <a href="{{ route('customer.reservations.my') }}" class="inline-flex items-center text-green-dark font-bold hover:text-green-light transition-colors duration-300">
                        View all reservations
                        <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
            @else
                <div class="text-center py-12">
                    <div class="w-20 h-20 mx-auto bg-cream-medium rounded-full flex items-center justify-center mb-4">
                        <svg class="w-12 h-12 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <h3 class="mt-4 text-lg font-bold text-green-dark">No reservations yet</h3>
                    <p class="mt-2 text-green-medium">Get started by booking your first table.</p>
                    <div class="mt-8">
                        <a href="{{ route('customer.reservations.create') }}"
                           class="inline-flex items-center px-6 py-3 rounded-xl shadow-lg text-cream font-bold bg-gradient-green hover:bg-green-light transform hover:scale-105 transition-all duration-300">
                            🎱 Book Your First Table
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection